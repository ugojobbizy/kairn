-- Onboarding et contrat des apporteurs d'affaires (13/11/2026), base « kairn ». Ajoute seulement des objets,
-- remplace commission_lignes (règle des 12 mois) et apporteur_clients (date de fin de commission).
-- Ugo, 13/11/2026 : « un onboarding pour les apporteurs d'affaires hyper efficient [...] qu'ils rentrent TOUTES leurs
-- infos et que ça génère un contrat aux normes et qu'ils le signent direct ». Choix cliqués : signature électronique
-- simple maison, à la première connexion (espace fermé tant que le contrat n'est pas signé), 12 mois de commission
-- par client (à compter de sa première commande, tranché par Claude), identité de Kairn saisie par Ugo dans Kairn Admin.

-- ─ Fiche complète de l'apporteur ────────────────────────────────
alter table public.apporteurs add column if not exists forme text check (forme in ('micro', 'ei', 'eurl', 'sarl', 'sasu', 'sas', 'sa', 'autre'));
alter table public.apporteurs add column if not exists forme_autre text;
alter table public.apporteurs add column if not exists raison_sociale text;
alter table public.apporteurs add column if not exists adresse text;
alter table public.apporteurs add column if not exists code_postal text;
alter table public.apporteurs add column if not exists ville text;
alter table public.apporteurs add column if not exists representant_qualite text;
alter table public.apporteurs add column if not exists tva_regime text check (tva_regime in ('franchise', 'assujetti'));
alter table public.apporteurs add column if not exists tva_numero text;
alter table public.apporteurs add column if not exists iban text;
alter table public.apporteurs add column if not exists titulaire_iban text;
alter table public.apporteurs add column if not exists contrat_signe_le timestamptz;

-- L'apporteur complète sa fiche tant qu'il n'a pas signé ; ensuite, un changement passe par Kairn (e-mail).
-- Seuls ces champs sont modifiables : jamais le statut, le compte, l'e-mail ni la date de signature.
create or replace function public.apporteur_enregistrer(p jsonb) returns void
language plpgsql security definer set search_path = '' as $$
begin
  update public.apporteurs set
    forme = coalesce(nullif(p ->> 'forme', ''), forme),
    forme_autre = left(nullif(trim(p ->> 'forme_autre'), ''), 80),
    raison_sociale = left(nullif(trim(p ->> 'raison_sociale'), ''), 160),
    siret = left(nullif(regexp_replace(coalesce(p ->> 'siret', ''), '\s', '', 'g'), ''), 14),
    adresse = left(nullif(trim(p ->> 'adresse'), ''), 200),
    code_postal = left(nullif(trim(p ->> 'code_postal'), ''), 5),
    ville = left(nullif(trim(p ->> 'ville'), ''), 100),
    prenom = left(nullif(trim(p ->> 'prenom'), ''), 100),
    nom = coalesce(left(nullif(trim(p ->> 'nom'), ''), 120), nom),
    representant_qualite = left(nullif(trim(p ->> 'representant_qualite'), ''), 80),
    telephone = left(nullif(trim(p ->> 'telephone'), ''), 20),
    tva_regime = nullif(p ->> 'tva_regime', ''),
    tva_numero = left(nullif(upper(regexp_replace(coalesce(p ->> 'tva_numero', ''), '\s', '', 'g')), ''), 20),
    iban = left(nullif(upper(regexp_replace(coalesce(p ->> 'iban', ''), '\s', '', 'g')), ''), 34),
    titulaire_iban = left(nullif(trim(p ->> 'titulaire_iban'), ''), 120)
  where user_id = auth.uid() and statut = 'actif' and contrat_signe_le is null;
  if not found then raise exception 'fiche_verrouillee'; end if;
end $$;
revoke all on function public.apporteur_enregistrer(jsonb) from public, anon;
grant execute on function public.apporteur_enregistrer(jsonb) to authenticated;

-- ─ Identité de Kairn (une seule ligne), saisie par Ugo dans Kairn Admin, Paramètres ─
create table if not exists public.kairn_parametres (
  id integer primary key default 1 check (id = 1),
  nom_legal text,
  forme text,
  siret text,
  adresse text,
  signataire text,
  qualite text,
  ville_tribunal text,
  signature_png text,
  maj_le timestamptz not null default now()
);
alter table public.kairn_parametres enable row level security;
create policy kairn_parametres_admin on public.kairn_parametres for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Pour l'écran de signature : l'identité de Kairn telle qu'elle figure au contrat (sans la signature tracée).
create or replace function public.contrat_kairn()
returns table (nom_legal text, forme text, siret text, adresse text, signataire text, qualite text, ville_tribunal text)
language sql stable security definer set search_path = '' as $$
  select k.nom_legal, k.forme, k.siret, k.adresse, k.signataire, k.qualite, k.ville_tribunal
  from public.kairn_parametres k
  where k.id = 1 and exists (select 1 from public.apporteurs a where a.user_id = auth.uid() and a.statut in ('actif', 'suspendu'));
$$;
revoke all on function public.contrat_kairn() from public, anon;
grant execute on function public.contrat_kairn() to authenticated;

-- ─ Contrats signés (écrits seulement par la fonction serveur api/apporteur.js, clé de service) ─
create table if not exists public.apporteur_contrats (
  id uuid primary key default gen_random_uuid(),
  apporteur_id uuid not null references public.apporteurs(id) on delete restrict,
  version text not null,
  texte text not null,
  empreinte text not null,
  signe_le timestamptz not null default now(),
  nom_signataire text not null,
  ip text,
  user_agent text,
  signature_png text not null,
  kairn_signataire text,
  kairn_signature_png text
);
alter table public.apporteur_contrats enable row level security;
create policy contrats_apporteur_lit on public.apporteur_contrats for select to authenticated
  using (apporteur_id in (select id from public.apporteurs where user_id = auth.uid()));
create policy contrats_admin_lit on public.apporteur_contrats for select to authenticated using (public.is_admin());

-- ─ Règle des 12 mois : commandes approuvées dans les 12 mois suivant la première commande comptée du client ─
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
  left join lateral (select min(c2.approuve_le) as premiere from public.commandes c2
                     where c2.user_id = c.user_id and c2.bdc_numero is not null and c2.approuve_le is not null
                       and c2.statut <> 'refusee' and c2.approuve_le >= coalesce(cl.apporteur_depuis, '-infinity'::date)) p on true
  left join lateral (select count(*) as leads from public.leads l
                     where l.commande_id = c.id and l.livre_le is not null and not l.annule) n on true
  left join lateral (select count(*) as n from public.litiges g join public.leads l on l.id = g.lead_id
                     where l.commande_id = c.id and g.statut = 'en_attente') lit on true
  where c.bdc_numero is not null and c.approuve_le is not null and c.statut <> 'refusee'
    and (v.id is not null or (cl.apporteur_id is not null and cl.commission_ht is not null
                              and c.approuve_le >= coalesce(cl.apporteur_depuis, '-infinity'::date)
                              and c.approuve_le < p.premiere + interval '12 months'));
$$;
revoke all on function public.commission_lignes() from public, anon, authenticated;

-- Clients de l'apporteur avec la fin de leur période de commission (vide tant qu'aucune commande).
drop function if exists public.apporteur_clients();
create or replace function public.apporteur_clients()
returns table (societe text, commission_ht numeric, apporteur_depuis date, fin_commission date)
language sql stable security definer set search_path = '' as $$
  select cl.societe, cl.commission_ht, cl.apporteur_depuis,
    (select (min(c.approuve_le) + interval '12 months')::date from public.commandes c
      where c.user_id = cl.user_id and c.bdc_numero is not null and c.approuve_le is not null and c.statut <> 'refusee'
        and c.approuve_le >= coalesce(cl.apporteur_depuis, '-infinity'::date))
  from public.clients cl join public.apporteurs a on a.id = cl.apporteur_id
  where a.user_id = auth.uid() and a.statut in ('actif', 'suspendu')
  order by cl.societe;
$$;
revoke all on function public.apporteur_clients() from public, anon;
grant execute on function public.apporteur_clients() to authenticated;

-- Retour arrière :
-- drop function if exists public.contrat_kairn(); drop function if exists public.apporteur_enregistrer(jsonb);
-- drop table if exists public.apporteur_contrats; drop table if exists public.kairn_parametres;
-- alter table public.apporteurs drop column if exists forme, drop column if exists forme_autre, drop column if exists raison_sociale,
--   drop column if exists adresse, drop column if exists code_postal, drop column if exists ville, drop column if exists representant_qualite,
--   drop column if exists tva_regime, drop column if exists tva_numero, drop column if exists iban, drop column if exists titulaire_iban,
--   drop column if exists contrat_signe_le;
-- commission_lignes et apporteur_clients : reprendre leur version de supabase/2026-11-13-apporteurs.sql
-- (apporteur_clients : drop function puis recréer, le type de retour change).
