-- Espace client complet et Kairn Admin (29/10/2026), base Supabase « kairn » (bmqvlwdbwfnafuovzzhi).
-- Modèle : Flow d'AKA Médias (captures d'Ugo), adapté à Kairn. Ajoute seulement des objets ; complète la table commandes.
-- Décisions d'Ugo (29/10/2026) : paiement par bon de commande puis Stripe plus tard ; litiges à motifs fixes,
-- seuls « doublon » et « hors zone » existent (« je ne remplace pas les faux numéros ») ; Ugo arbitre chaque litige.

-- ─ Leads produits par Kairn ─────────────────────────────────────
-- Un lead sans client est en stock (visible dans le Leads Shop, sans ses coordonnées).
-- Un lead livré a un client et, le plus souvent, une commande (pré-commande ou achat Shop).
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  recu_le timestamptz not null default now(),
  thematique text not null check (thematique in ('PAC', 'ITE', 'PPV')),
  prix_ht numeric(8, 2) not null check (prix_ht >= 0),
  consentement_jusqu date,
  code_postal text,
  departement text generated always as (left(code_postal, 2)) stored,
  ville text,
  statut_occupation text,
  type_logement text,
  chauffage text,
  surface text,
  prenom text,
  nom text,
  telephone text,
  email text,
  source text,
  client_id uuid references auth.users(id) on delete set null,
  commande_id uuid references public.commandes(id) on delete set null,
  livre_le timestamptz,
  exporte_le timestamptz,
  -- vrai quand un litige est accepté : le lead ne compte plus dans la commande, un autre est livré à la place
  annule boolean not null default false
);
create index if not exists leads_stock on public.leads (thematique, recu_le desc) where client_id is null;
create index if not exists leads_client on public.leads (client_id, livre_le desc);
create index if not exists leads_commande on public.leads (commande_id);
alter table public.leads enable row level security;
create policy leads_client_lit on public.leads for select to authenticated using (client_id = auth.uid());
create policy leads_admin on public.leads for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ─ Commandes : bons de commande ─────────────────────────────────
-- type : précommande (catalogue, validée par Ugo) ou shop (achat immédiat de leads en stock). Vide = formulaire public.
alter table public.commandes add column if not exists type text check (type in ('precommande', 'shop'));
alter table public.commandes add column if not exists bdc_numero text unique;
alter table public.commandes add column if not exists plafond integer check (plafond > 0);
alter table public.commandes add column if not exists prix_unitaire numeric(8, 2);
alter table public.commandes add column if not exists montant_ht numeric(10, 2);
alter table public.commandes add column if not exists approuve_le timestamptz;
alter table public.commandes add column if not exists regle_le timestamptz;
alter table public.commandes drop constraint if exists commandes_statut_check;
alter table public.commandes add constraint commandes_statut_check check (statut in ('nouvelle', 'en_cours', 'ouverte', 'terminee', 'refusee'));

-- Le client crée seulement une demande vierge : pas de numéro de BDC, de montant ni de validation.
drop policy if exists commandes_client_cree on public.commandes;
create policy commandes_client_cree on public.commandes for insert to authenticated
  with check (user_id = auth.uid() and statut = 'nouvelle' and bdc_numero is null and montant_ht is null
    and approuve_le is null and regle_le is null and (type is null or type = 'precommande'));

create sequence if not exists public.bdc_seq;
create or replace function public.bdc_suivant() returns text
language sql security definer set search_path = public as $$
  select 'BDC-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.bdc_seq')::text, 5, '0');
$$;
revoke all on function public.bdc_suivant() from public, anon, authenticated;

-- ─ Litiges ──────────────────────────────────────────────────────
create table if not exists public.litiges (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  lead_id uuid not null unique references public.leads(id) on delete cascade,
  client_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  motif text not null check (motif in ('doublon', 'hors_zone')),
  message text check (char_length(message) <= 1000),
  statut text not null default 'en_attente' check (statut in ('en_attente', 'accepte', 'refuse')),
  reponse text,
  traite_le timestamptz,
  remplacement_id uuid references public.leads(id) on delete set null
);
alter table public.litiges enable row level security;
create policy litiges_client_lit on public.litiges for select to authenticated using (client_id = auth.uid());
-- Le client ouvre un litige seulement sur un lead qui lui a été livré.
create policy litiges_client_cree on public.litiges for insert to authenticated
  with check (client_id = auth.uid() and statut = 'en_attente' and reponse is null
    and exists (select 1 from public.leads l where l.id = lead_id and l.client_id = auth.uid()));
create policy litiges_admin on public.litiges for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ─ Fonctions côté client ────────────────────────────────────────
create or replace function public.est_client() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.clients where user_id = auth.uid());
$$;

-- Leads Shop : le stock sans coordonnées (ni nom, ni téléphone, ni e-mail, ni ville), consentement encore valide.
create or replace function public.shop_leads()
returns table (id uuid, recu_le timestamptz, thematique text, prix_ht numeric, consentement_jusqu date,
               code_postal text, departement text, statut_occupation text, type_logement text, chauffage text, surface text)
language sql stable security definer set search_path = public as $$
  select l.id, l.recu_le, l.thematique, l.prix_ht, l.consentement_jusqu, l.code_postal, l.departement,
         l.statut_occupation, l.type_logement, l.chauffage, l.surface
  from public.leads l
  where l.client_id is null and not l.annule
    and (l.consentement_jusqu is null or l.consentement_jusqu >= current_date)
    and (public.est_client() or public.is_admin())
  order by l.recu_le desc;
$$;

-- Achat Shop : crée un bon de commande approuvé (à régler) et livre les leads choisis encore disponibles, en une transaction.
create or replace function public.shop_acheter(p_ids uuid[])
returns uuid
language plpgsql security definer set search_path = public as $$
declare
  v_cmd uuid; v_n int; v_total numeric; v_client public.clients%rowtype; v_email text; v_them text;
begin
  select * into v_client from public.clients where user_id = auth.uid();
  if not found then raise exception 'pas_client'; end if;
  if p_ids is null or array_length(p_ids, 1) is null or array_length(p_ids, 1) > 500 then raise exception 'selection_invalide'; end if;
  -- verrouille les leads encore en stock ; ceux déjà partis sont ignorés
  perform 1 from public.leads where id = any(p_ids) and client_id is null and not annule
    and (consentement_jusqu is null or consentement_jusqu >= current_date) for update skip locked;
  select count(*), sum(prix_ht), case when count(distinct thematique) = 1 then min(thematique) else 'Mixte' end
    into v_n, v_total, v_them
    from public.leads where id = any(p_ids) and client_id is null and not annule
      and (consentement_jusqu is null or consentement_jusqu >= current_date);
  if v_n = 0 then raise exception 'plus_disponible'; end if;
  select email into v_email from auth.users where id = auth.uid();
  insert into public.commandes (user_id, souhait, type, societe, nom, email, telephone, siret, thematique, volume, page,
                                statut, bdc_numero, plafond, prix_unitaire, montant_ht, approuve_le)
  values (auth.uid(), 'leads', 'shop', v_client.societe, v_client.prenom, v_email, v_client.telephone, v_client.siret, v_them,
          v_n::text, '/espace/shop', 'terminee', public.bdc_suivant(), v_n, round(v_total / v_n, 2), v_total, now())
  returning id into v_cmd;
  update public.leads set client_id = auth.uid(), commande_id = v_cmd, livre_le = now()
    where id = any(p_ids) and client_id is null and not annule
      and (consentement_jusqu is null or consentement_jusqu >= current_date);
  return v_cmd;
end $$;

-- Export : marque comme exportés les leads du client (onglet « À exporter » de Mes prospects).
create or replace function public.leads_marquer_exportes(p_ids uuid[])
returns integer
language sql security definer set search_path = public as $$
  with u as (update public.leads set exporte_le = now() where id = any(p_ids) and client_id = auth.uid() and exporte_le is null returning 1)
  select count(*)::int from u;
$$;

-- ─ Fonctions Kairn Admin ────────────────────────────────────────
-- Ouvre l'espace d'un compte Supabase Auth déjà créé (par e-mail).
create or replace function public.admin_ouvrir_acces(p_email text, p_societe text, p_prenom text, p_telephone text, p_siret text)
returns uuid
language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  if not public.is_admin() then raise exception 'interdit'; end if;
  select id into v_id from auth.users where lower(email) = lower(trim(p_email));
  if v_id is null then raise exception 'compte_introuvable'; end if;
  insert into public.clients (user_id, societe, prenom, telephone, siret) values (v_id, p_societe, p_prenom, p_telephone, p_siret)
  on conflict (user_id) do update set societe = excluded.societe, prenom = excluded.prenom, telephone = excluded.telephone, siret = excluded.siret;
  return v_id;
end $$;

-- Valide une pré-commande : numéro de BDC, plafond, prix unitaire, montant ; le flux est ouvert.
create or replace function public.admin_approuver_commande(p_commande uuid, p_plafond integer, p_prix numeric)
returns text
language plpgsql security definer set search_path = public as $$
declare v_num text;
begin
  if not public.is_admin() then raise exception 'interdit'; end if;
  if p_plafond is null or p_plafond <= 0 or p_prix is null or p_prix < 0 then raise exception 'valeurs_invalides'; end if;
  update public.commandes
    set bdc_numero = coalesce(bdc_numero, public.bdc_suivant()), type = coalesce(type, 'precommande'), plafond = p_plafond,
        prix_unitaire = p_prix, montant_ht = round(p_plafond * p_prix, 2), approuve_le = coalesce(approuve_le, now()), statut = 'ouverte'
    where id = p_commande and user_id is not null and statut in ('nouvelle', 'en_cours', 'ouverte')
    returning bdc_numero into v_num;
  if v_num is null then raise exception 'commande_invalide'; end if;
  return v_num;
end $$;

-- Livre jusqu'à p_n leads du stock (même thématique, les plus récents d'abord) sur une commande ouverte.
create or replace function public.admin_livrer(p_commande uuid, p_n integer)
returns integer
language plpgsql security definer set search_path = public as $$
declare v_c public.commandes%rowtype; v_livres int; v_reste int; v_fait int;
begin
  if not public.is_admin() then raise exception 'interdit'; end if;
  select * into v_c from public.commandes where id = p_commande for update;
  if not found or v_c.user_id is null or v_c.plafond is null then raise exception 'commande_invalide'; end if;
  select count(*) into v_livres from public.leads where commande_id = p_commande and not annule;
  v_reste := greatest(0, v_c.plafond - v_livres);
  with pick as (
    select id from public.leads
    where client_id is null and not annule and thematique = v_c.thematique
      and (consentement_jusqu is null or consentement_jusqu >= current_date)
    order by recu_le desc limit least(p_n, v_reste) for update skip locked
  ), u as (
    update public.leads l set client_id = v_c.user_id, commande_id = p_commande, livre_le = now() from pick where l.id = pick.id returning 1
  ) select count(*) into v_fait from u;
  if v_livres + v_fait >= v_c.plafond then update public.commandes set statut = 'terminee' where id = p_commande; end if;
  return v_fait;
end $$;

-- Tranche un litige. Accepté : le lead est annulé (il ne compte plus) et, si le stock le permet, un lead de la même
-- thématique est livré tout de suite à la place ; sinon il reste à livrer sur la commande.
create or replace function public.admin_trancher_litige(p_litige uuid, p_accepte boolean, p_reponse text)
returns uuid
language plpgsql security definer set search_path = public as $$
declare v_l public.litiges%rowtype; v_lead public.leads%rowtype; v_new uuid;
begin
  if not public.is_admin() then raise exception 'interdit'; end if;
  select * into v_l from public.litiges where id = p_litige for update;
  if not found or v_l.statut <> 'en_attente' then raise exception 'litige_deja_traite'; end if;
  if p_accepte then
    select * into v_lead from public.leads where id = v_l.lead_id for update;
    update public.leads set annule = true where id = v_lead.id;
    select id into v_new from public.leads
      where client_id is null and not annule and thematique = v_lead.thematique
        and (consentement_jusqu is null or consentement_jusqu >= current_date)
      order by recu_le desc limit 1 for update skip locked;
    if v_new is not null then
      update public.leads set client_id = v_lead.client_id, commande_id = v_lead.commande_id, livre_le = now() where id = v_new;
    elsif v_lead.commande_id is not null then
      update public.commandes set statut = 'ouverte' where id = v_lead.commande_id and statut = 'terminee';
    end if;
  end if;
  update public.litiges set statut = case when p_accepte then 'accepte' else 'refuse' end,
    reponse = nullif(left(trim(p_reponse), 1000), ''), traite_le = now(), remplacement_id = v_new
  where id = p_litige;
  return v_new;
end $$;

-- Droits : rien pour anon ; les fonctions client et admin vérifient elles-mêmes qui appelle.
revoke all on function public.est_client() from public, anon;
revoke all on function public.shop_leads() from public, anon;
revoke all on function public.shop_acheter(uuid[]) from public, anon;
revoke all on function public.leads_marquer_exportes(uuid[]) from public, anon;
revoke all on function public.admin_ouvrir_acces(text, text, text, text, text) from public, anon;
revoke all on function public.admin_approuver_commande(uuid, integer, numeric) from public, anon;
revoke all on function public.admin_livrer(uuid, integer) from public, anon;
revoke all on function public.admin_trancher_litige(uuid, boolean, text) from public, anon;
grant execute on function public.est_client(), public.shop_leads(), public.shop_acheter(uuid[]), public.leads_marquer_exportes(uuid[]),
  public.admin_ouvrir_acces(text, text, text, text, text), public.admin_approuver_commande(uuid, integer, numeric), public.admin_livrer(uuid, integer), public.admin_trancher_litige(uuid, boolean, text)
  to authenticated;
