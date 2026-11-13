-- Apporteurs d'affaires (13/11/2026), base Supabase « kairn » (bmqvlwdbwfnafuovzzhi). Ajoute seulement des objets.
-- Ugo, 13/11/2026 : un apporteur ramène des clients ; chaque client ramené est tagué à son nom avec une commission
-- en € par lead, choisie à la main client par client ; l'apporteur suit sur son espace (/apporteur) les leads commandés
-- par ses clients et ses commissions, sans voir le prix payé par le client ni les coordonnées des leads.
-- Compte : candidature publique (/devenir-apporteur), validée par Ugo dans Kairn Admin, puis e-mail d'accès.
-- Paiement (Ugo) : « Je ne payerai jamais sur de l'argent non encaissé. » Une ligne de commission par bon de commande :
--   leads comptés = leads de la commande livrés et non annulés (un litige accepté annule le lead, son remplaçant compte) ;
--   « en_cours » tant que la commande n'est pas terminée, pas réglée, ou qu'un litige y est en attente ;
--   « a_payer » ensuite ; « versee » quand Ugo a marqué le versement (montant, leads et taux figés dans commission_versements).
-- Seules comptent les commandes approuvées à partir de la date de tag (clients.apporteur_depuis).

-- ─ Apporteurs ───────────────────────────────────────────────────
create table if not exists public.apporteurs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid unique references auth.users(id) on delete set null,
  prenom text,
  nom text not null,
  societe text,
  email text not null,
  telephone text,
  siret text,
  message text,
  statut text not null default 'candidature' check (statut in ('candidature', 'actif', 'refuse', 'suspendu')),
  valide_le timestamptz
);
alter table public.apporteurs enable row level security;
create policy apporteurs_lit_sa_fiche on public.apporteurs for select to authenticated using (user_id = auth.uid());
create policy apporteurs_admin on public.apporteurs for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ─ Tag du client ────────────────────────────────────────────────
alter table public.clients add column if not exists apporteur_id uuid references public.apporteurs(id) on delete set null;
alter table public.clients add column if not exists commission_ht numeric(8, 2) check (commission_ht >= 0);
alter table public.clients add column if not exists apporteur_depuis date;

-- ─ Versements (figés) ───────────────────────────────────────────
create table if not exists public.commission_versements (
  id uuid primary key default gen_random_uuid(),
  commande_id uuid not null unique references public.commandes(id) on delete restrict,
  apporteur_id uuid not null references public.apporteurs(id) on delete restrict,
  client_id uuid references auth.users(id) on delete set null,
  leads integer not null check (leads >= 0),
  taux numeric(8, 2) not null,
  montant numeric(10, 2) not null,
  verse_le timestamptz not null default now(),
  reference text
);
alter table public.commission_versements enable row level security;
create policy versements_apporteur_lit on public.commission_versements for select to authenticated
  using (apporteur_id in (select id from public.apporteurs where user_id = auth.uid()));
create policy versements_admin on public.commission_versements for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ─ Calcul des lignes (interne : appelé seulement par les fonctions ci-dessous) ─
create or replace function public.commission_lignes()
returns table (commande_id uuid, apporteur_id uuid, client_id uuid, societe text, bdc_numero text, thematique text,
               approuve_le timestamptz, leads integer, taux numeric, montant numeric, statut text, raison text,
               verse_le timestamptz, reference text)
language sql stable security definer set search_path = '' as $$
  select c.id, coalesce(v.apporteur_id, cl.apporteur_id), c.user_id, cl.societe, c.bdc_numero, c.thematique, c.approuve_le,
    coalesce(v.leads, n.leads)::int,
    coalesce(v.taux, cl.commission_ht),
    coalesce(v.montant, n.leads * cl.commission_ht),
    case when v.id is not null then 'versee'
         when c.statut <> 'terminee' or c.regle_le is null or lit.n > 0 then 'en_cours'
         else 'a_payer' end,
    case when v.id is not null then null
         when c.statut <> 'terminee' then 'Livraison en cours'
         when c.regle_le is null then 'En attente du règlement du client'
         when lit.n > 0 then 'Litige en cours d’examen'
         else null end,
    v.verse_le, v.reference
  from public.commandes c
  join public.clients cl on cl.user_id = c.user_id
  left join public.commission_versements v on v.commande_id = c.id
  left join lateral (select count(*) as leads from public.leads l
                     where l.commande_id = c.id and l.livre_le is not null and not l.annule) n on true
  left join lateral (select count(*) as n from public.litiges g join public.leads l on l.id = g.lead_id
                     where l.commande_id = c.id and g.statut = 'en_attente') lit on true
  where c.bdc_numero is not null and c.approuve_le is not null and c.statut <> 'refusee'
    and (v.id is not null or (cl.apporteur_id is not null and cl.commission_ht is not null
                              and c.approuve_le >= coalesce(cl.apporteur_depuis, '-infinity'::date)));
$$;
revoke all on function public.commission_lignes() from public, anon, authenticated;

-- ─ Côté apporteur ───────────────────────────────────────────────
create or replace function public.est_apporteur() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.apporteurs where user_id = auth.uid() and statut = 'actif');
$$;
revoke all on function public.est_apporteur() from public, anon;
grant execute on function public.est_apporteur() to authenticated;

-- Ses lignes de commission : jamais le prix du lead, le montant de la commande ni les coordonnées des leads.
create or replace function public.apporteur_tableau()
returns table (commande_id uuid, societe text, bdc_numero text, thematique text, approuve_le timestamptz,
               leads integer, taux numeric, montant numeric, statut text, raison text, verse_le timestamptz)
language sql stable security definer set search_path = '' as $$
  select x.commande_id, x.societe, x.bdc_numero, x.thematique, x.approuve_le, x.leads, x.taux, x.montant, x.statut, x.raison, x.verse_le
  from public.commission_lignes() x
  join public.apporteurs a on a.id = x.apporteur_id
  where a.user_id = auth.uid() and a.statut in ('actif', 'suspendu')
  order by x.approuve_le desc;
$$;
revoke all on function public.apporteur_tableau() from public, anon;
grant execute on function public.apporteur_tableau() to authenticated;

-- Ses clients tagués, même sans commande : société, commission, date de début.
create or replace function public.apporteur_clients()
returns table (societe text, commission_ht numeric, apporteur_depuis date)
language sql stable security definer set search_path = '' as $$
  select cl.societe, cl.commission_ht, cl.apporteur_depuis
  from public.clients cl join public.apporteurs a on a.id = cl.apporteur_id
  where a.user_id = auth.uid() and a.statut in ('actif', 'suspendu')
  order by cl.societe;
$$;
revoke all on function public.apporteur_clients() from public, anon;
grant execute on function public.apporteur_clients() to authenticated;

-- ─ Côté Kairn Admin ─────────────────────────────────────────────
create or replace function public.admin_commissions()
returns table (commande_id uuid, apporteur_id uuid, client_id uuid, societe text, bdc_numero text, thematique text,
               approuve_le timestamptz, leads integer, taux numeric, montant numeric, statut text, raison text,
               verse_le timestamptz, reference text)
language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.is_admin() then raise exception 'interdit'; end if;
  return query select * from public.commission_lignes();
end $$;
revoke all on function public.admin_commissions() from public, anon;
grant execute on function public.admin_commissions() to authenticated;

-- Versement : seulement une ligne « a_payer » ; montant, leads et taux figés à cet instant.
create or replace function public.admin_verser_commission(p_commande uuid, p_reference text)
returns numeric
language plpgsql security definer set search_path = '' as $$
declare v record;
begin
  if not public.is_admin() then raise exception 'interdit'; end if;
  select * into v from public.commission_lignes() x where x.commande_id = p_commande;
  if not found then raise exception 'ligne_introuvable'; end if;
  if v.statut <> 'a_payer' then raise exception 'pas_a_payer'; end if;
  insert into public.commission_versements (commande_id, apporteur_id, client_id, leads, taux, montant, reference)
  values (v.commande_id, v.apporteur_id, v.client_id, v.leads, v.taux, v.montant, nullif(left(trim(p_reference), 200), ''));
  return v.montant;
end $$;
revoke all on function public.admin_verser_commission(uuid, text) from public, anon;
grant execute on function public.admin_verser_commission(uuid, text) to authenticated;

-- ─ Candidature publique (/devenir-apporteur, par api/apporteur.js) ─
-- Une adresse déjà connue ne crée pas de deuxième fiche : la fonction rend la fiche existante.
create or replace function public.site_candidature_apporteur(
  p_prenom text, p_nom text, p_societe text, p_email text, p_telephone text, p_siret text, p_message text
) returns uuid
language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  if coalesce(trim(p_nom), '') = '' or coalesce(trim(p_email), '') = '' then raise exception 'champs_manquants'; end if;
  select id into v_id from public.apporteurs where lower(email) = lower(trim(p_email)) limit 1;
  if v_id is not null then return v_id; end if;
  insert into public.apporteurs (prenom, nom, societe, email, telephone, siret, message)
  values (left(p_prenom, 100), left(p_nom, 120), left(p_societe, 120), lower(left(trim(p_email), 200)), left(p_telephone, 20),
          left(p_siret, 20), left(p_message, 1000))
  returning id into v_id;
  return v_id;
end $$;
revoke all on function public.site_candidature_apporteur(text, text, text, text, text, text, text) from public;
grant execute on function public.site_candidature_apporteur(text, text, text, text, text, text, text) to anon, authenticated;

-- Retour arrière (dans cet ordre) :
-- drop function if exists public.site_candidature_apporteur(text, text, text, text, text, text, text);
-- drop function if exists public.admin_verser_commission(uuid, text);
-- drop function if exists public.admin_commissions();
-- drop function if exists public.apporteur_clients();
-- drop function if exists public.apporteur_tableau();
-- drop function if exists public.est_apporteur();
-- drop function if exists public.commission_lignes();
-- drop table if exists public.commission_versements;
-- alter table public.clients drop column if exists apporteur_depuis, drop column if exists commission_ht, drop column if exists apporteur_id;
-- drop table if exists public.apporteurs;
