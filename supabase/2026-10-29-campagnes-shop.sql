-- Suivi des campagnes par client et Leads Shop de revente (29/10/2026), base « kairn ».
-- Décisions d'Ugo (29/10/2026) : 4 étapes (demande reçue, en préparation, campagne lancée, terminée) que le client voit ;
-- seuls les leads HORS ZONE acceptés en litige repartent au Shop (pas les doublons), 5 € moins cher, jamais revendus
-- au client qui les a signalés ; Ugo peut retirer un lead du Shop ou changer son prix.

-- ─ Étape de campagne sur chaque commande ─
alter table public.commandes add column if not exists etape text not null default 'recue'
  check (etape in ('recue', 'preparation', 'lancee', 'terminee'));
alter table public.commandes add column if not exists lancee_le timestamptz;

create or replace function public.admin_etape(p_commande uuid, p_etape text)
returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'interdit'; end if;
  if p_etape not in ('recue', 'preparation', 'lancee', 'terminee') then raise exception 'valeurs_invalides'; end if;
  update public.commandes set etape = p_etape, lancee_le = case when p_etape = 'lancee' then coalesce(lancee_le, now()) else lancee_le end
    where id = p_commande;
  if not found then raise exception 'commande_invalide'; end if;
end $$;

-- ─ Leads remis en vente ─
alter table public.leads add column if not exists en_vente boolean not null default true;
alter table public.leads add column if not exists deja_transmis boolean not null default false;
alter table public.leads add column if not exists exclu_client uuid references auth.users(id) on delete set null;
alter table public.leads add column if not exists origine_id uuid references public.leads(id) on delete set null;

-- Shop : stock en vente, sans coordonnées, jamais proposé au client qui a signalé le lead.
drop function if exists public.shop_leads();
create function public.shop_leads()
returns table (id uuid, recu_le timestamptz, thematique text, prix_ht numeric, consentement_jusqu date,
               code_postal text, departement text, statut_occupation text, type_logement text, chauffage text, surface text,
               deja_transmis boolean)
language sql stable security definer set search_path = public as $$
  select l.id, l.recu_le, l.thematique, l.prix_ht, l.consentement_jusqu, l.code_postal, l.departement,
         l.statut_occupation, l.type_logement, l.chauffage, l.surface, l.deja_transmis
  from public.leads l
  where l.client_id is null and not l.annule and l.en_vente
    and (l.exclu_client is null or l.exclu_client <> auth.uid())
    and (l.consentement_jusqu is null or l.consentement_jusqu >= current_date)
    and (public.est_client() or public.is_admin())
  order by l.recu_le desc;
$$;
revoke all on function public.shop_leads() from public, anon;
grant execute on function public.shop_leads() to authenticated;

create or replace function public.shop_acheter(p_ids uuid[])
returns uuid
language plpgsql security definer set search_path = public as $$
declare
  v_cmd uuid; v_n int; v_total numeric; v_client public.clients%rowtype; v_email text; v_them text;
begin
  select * into v_client from public.clients where user_id = auth.uid();
  if not found then raise exception 'pas_client'; end if;
  if p_ids is null or array_length(p_ids, 1) is null or array_length(p_ids, 1) > 500 then raise exception 'selection_invalide'; end if;
  perform 1 from public.leads where id = any(p_ids) and client_id is null and not annule and en_vente
    and (exclu_client is null or exclu_client <> auth.uid())
    and (consentement_jusqu is null or consentement_jusqu >= current_date) for update skip locked;
  select count(*), sum(prix_ht), case when count(distinct thematique) = 1 then min(thematique) else 'Mixte' end
    into v_n, v_total, v_them
    from public.leads where id = any(p_ids) and client_id is null and not annule and en_vente
      and (exclu_client is null or exclu_client <> auth.uid())
      and (consentement_jusqu is null or consentement_jusqu >= current_date);
  if v_n = 0 then raise exception 'plus_disponible'; end if;
  select email into v_email from auth.users where id = auth.uid();
  insert into public.commandes (user_id, souhait, type, societe, nom, email, telephone, siret, thematique, volume, page,
                                statut, etape, bdc_numero, plafond, prix_unitaire, montant_ht, approuve_le)
  values (auth.uid(), 'leads', 'shop', v_client.societe, v_client.prenom, v_email, v_client.telephone, v_client.siret, v_them,
          v_n::text, '/espace/shop', 'terminee', 'terminee', public.bdc_suivant(), v_n, round(v_total / v_n, 2), v_total, now())
  returning id into v_cmd;
  update public.leads set client_id = auth.uid(), commande_id = v_cmd, livre_le = now()
    where id = any(p_ids) and client_id is null and not annule and en_vente
      and (exclu_client is null or exclu_client <> auth.uid())
      and (consentement_jusqu is null or consentement_jusqu >= current_date);
  return v_cmd;
end $$;

-- Livraison depuis le stock : jamais de lead déjà transmis sur une commande (ils ne se vendent qu'au Shop).
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
    where client_id is null and not annule and en_vente and not deja_transmis and thematique = v_c.thematique
      and (consentement_jusqu is null or consentement_jusqu >= current_date)
    order by recu_le desc limit least(p_n, v_reste) for update skip locked
  ), u as (
    update public.leads l set client_id = v_c.user_id, commande_id = p_commande, livre_le = now() from pick where l.id = pick.id returning 1
  ) select count(*) into v_fait from u;
  if v_livres + v_fait >= v_c.plafond then update public.commandes set statut = 'terminee' where id = p_commande; end if;
  return v_fait;
end $$;

-- Litige accepté : le lead est annulé et remplacé par un lead neuf ; s'il est HORS ZONE, une copie repart au Shop,
-- 5 € moins cher, marquée « déjà transmis », exclue pour le client qui l'a signalé.
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
      where client_id is null and not annule and en_vente and not deja_transmis and thematique = v_lead.thematique
        and (consentement_jusqu is null or consentement_jusqu >= current_date)
      order by recu_le desc limit 1 for update skip locked;
    if v_new is not null then
      update public.leads set client_id = v_lead.client_id, commande_id = v_lead.commande_id, livre_le = now() where id = v_new;
    elsif v_lead.commande_id is not null then
      update public.commandes set statut = 'ouverte' where id = v_lead.commande_id and statut = 'terminee';
    end if;
    if v_l.motif = 'hors_zone' then
      insert into public.leads (recu_le, thematique, prix_ht, consentement_jusqu, code_postal, ville, statut_occupation, type_logement,
                                chauffage, surface, prenom, nom, telephone, email, source, deja_transmis, exclu_client, origine_id)
      values (v_lead.recu_le, v_lead.thematique, greatest(0, v_lead.prix_ht - 5), v_lead.consentement_jusqu, v_lead.code_postal, v_lead.ville,
              v_lead.statut_occupation, v_lead.type_logement, v_lead.chauffage, v_lead.surface, v_lead.prenom, v_lead.nom,
              v_lead.telephone, v_lead.email, 'shop_hors_zone', true, v_lead.client_id, v_lead.id);
    end if;
  end if;
  update public.litiges set statut = case when p_accepte then 'accepte' else 'refuse' end,
    reponse = nullif(left(trim(p_reponse), 1000), ''), traite_le = now(), remplacement_id = v_new
  where id = p_litige;
  return v_new;
end $$;

revoke all on function public.admin_etape(uuid, text) from public, anon;
grant execute on function public.admin_etape(uuid, text) to authenticated;

-- ─ Tickets : le client contacte Ugo depuis son espace (Ugo, 29/10/2026 : « un petit logo discussion pour ouvrir un ticket ») ─
create table if not exists public.tickets (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  client_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  sujet text not null check (char_length(sujet) between 1 and 160),
  urgent boolean not null default false,
  statut text not null default 'ouvert' check (statut in ('ouvert', 'ferme')),
  maj_le timestamptz not null default now()
);
create table if not exists public.ticket_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  ticket_id uuid not null references public.tickets(id) on delete cascade,
  auteur uuid not null default auth.uid() references auth.users(id) on delete cascade,
  de_kairn boolean not null default false,
  texte text not null check (char_length(texte) between 1 and 4000),
  lu_le timestamptz
);
create index if not exists ticket_messages_ticket on public.ticket_messages (ticket_id, created_at);
alter table public.tickets enable row level security;
alter table public.ticket_messages enable row level security;
create policy tickets_client_lit on public.tickets for select to authenticated using (client_id = auth.uid());
create policy tickets_client_cree on public.tickets for insert to authenticated
  with check (client_id = auth.uid() and statut = 'ouvert' and public.est_client());
create policy tickets_admin on public.tickets for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy tmsg_client_lit on public.ticket_messages for select to authenticated
  using (exists (select 1 from public.tickets t where t.id = ticket_id and t.client_id = auth.uid()));
create policy tmsg_client_cree on public.ticket_messages for insert to authenticated
  with check (auteur = auth.uid() and not de_kairn and lu_le is null
    and exists (select 1 from public.tickets t where t.id = ticket_id and t.client_id = auth.uid()));
create policy tmsg_admin on public.ticket_messages for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ─ Tickets : suivi de lecture (appliqué en second, migration « tickets_suivi_lecture ») ─
alter table public.tickets add column if not exists repondu_le timestamptz;
alter table public.tickets add column if not exists vu_client_le timestamptz;
alter table public.tickets add column if not exists vu_admin_le timestamptz;
alter table public.tickets add column if not exists dernier_client_le timestamptz;
create or replace function public.ticket_message_maj() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  update public.tickets set maj_le = now(),
    repondu_le = case when new.de_kairn then now() else repondu_le end,
    dernier_client_le = case when new.de_kairn then dernier_client_le else now() end
  where id = new.ticket_id;
  return new;
end $$;
revoke all on function public.ticket_message_maj() from public, anon, authenticated;
drop trigger if exists ticket_message_maj on public.ticket_messages;
create trigger ticket_message_maj after insert on public.ticket_messages for each row execute function public.ticket_message_maj();
create or replace function public.ticket_vu(p_ticket uuid) returns void
language sql security definer set search_path = public as $$
  update public.tickets set vu_client_le = now() where id = p_ticket and client_id = auth.uid();
  update public.tickets set vu_admin_le = now() where id = p_ticket and public.is_admin();
$$;
revoke all on function public.ticket_vu(uuid) from public, anon;
grant execute on function public.ticket_vu(uuid) to authenticated;
