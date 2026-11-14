-- Apporteurs d'affaires, ce qu'il manquait pour tourner (14/11/2026), base « kairn ». Ajoute seulement des objets.
-- Ugo, 14/11/2026 : « Réalise tous les points que tu peux faire toi en autonomie » après la liste des manques :
--   1. déclaration de prospect datée (le contrat dit « premier présenté par écrit ») ;
--   2. version du contrat signée, pour faire re-signer si le modèle change (relecture par un avocat) ;
--   3. date de la dernière attestation de vigilance URSSAF reçue (contrat, art. 2 : au-delà de 5 000 € HT par an).
-- Le relevé à facturer et l'export DAS2 se calculent à partir des tables existantes (api/apporteur.js, Kairn Admin).

-- ─ 1. Prospects déclarés par l'apporteur ─────────────────────────
create table if not exists public.apporteur_prospects (
  id uuid primary key default gen_random_uuid(),
  apporteur_id uuid not null references public.apporteurs(id) on delete restrict,
  societe text not null,
  siret text,
  ville text,
  contact text,
  telephone text,
  note text,
  declare_le timestamptz not null default now(),
  statut text not null default 'declare' check (statut in ('declare', 'accepte', 'refuse')),
  motif text,
  traite_le timestamptz
);
create index if not exists apporteur_prospects_apporteur on public.apporteur_prospects (apporteur_id);
alter table public.apporteur_prospects enable row level security;
create policy prospects_apporteur_lit on public.apporteur_prospects for select to authenticated
  using (apporteur_id in (select id from public.apporteurs where user_id = auth.uid()));
create policy prospects_admin on public.apporteur_prospects for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Déclaration : apporteur actif au contrat signé. La date est posée par la base, jamais par le navigateur.
create or replace function public.apporteur_declarer_prospect(p jsonb) returns uuid
language plpgsql security definer set search_path = '' as $$
declare v_ap uuid; v_id uuid; v_soc text; v_siret text;
begin
  select id into v_ap from public.apporteurs where user_id = auth.uid() and statut = 'actif' and contrat_signe_le is not null;
  if v_ap is null then raise exception 'non_autorise'; end if;
  v_soc := left(nullif(trim(p ->> 'societe'), ''), 160);
  if v_soc is null then raise exception 'societe_obligatoire'; end if;
  v_siret := nullif(regexp_replace(coalesce(p ->> 'siret', ''), '\s', '', 'g'), '');
  if v_siret is not null and v_siret !~ '^\d{14}$' then raise exception 'siret_invalide'; end if;
  if (select count(*) from public.apporteur_prospects where apporteur_id = v_ap and declare_le > now() - interval '1 day') >= 30 then
    raise exception 'trop_de_declarations';
  end if;
  insert into public.apporteur_prospects (apporteur_id, societe, siret, ville, contact, telephone, note)
  values (v_ap, v_soc, v_siret, left(nullif(trim(p ->> 'ville'), ''), 100), left(nullif(trim(p ->> 'contact'), ''), 120),
          left(nullif(regexp_replace(coalesce(p ->> 'telephone', ''), '[^\d+ ]', '', 'g'), ''), 20), left(nullif(trim(p ->> 'note'), ''), 1000))
  returning id into v_id;
  return v_id;
end $$;
revoke all on function public.apporteur_declarer_prospect(jsonb) from public, anon;
grant execute on function public.apporteur_declarer_prospect(jsonb) to authenticated;

-- ─ 2. Version du contrat signée ─────────────────────────────────
alter table public.apporteurs add column if not exists contrat_version text;
update public.apporteurs a set contrat_version = c.version
  from (select distinct on (apporteur_id) apporteur_id, version from public.apporteur_contrats order by apporteur_id, signe_le desc) c
  where c.apporteur_id = a.id and a.contrat_version is null;

-- ─ 3. Attestation de vigilance URSSAF ───────────────────────────
alter table public.apporteurs add column if not exists urssaf_attestation_le date;

-- Retour arrière :
-- drop function if exists public.apporteur_declarer_prospect(jsonb); drop table if exists public.apporteur_prospects;
-- alter table public.apporteurs drop column if exists contrat_version, drop column if exists urssaf_attestation_le;
