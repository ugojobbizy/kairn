-- Mesure du trafic pour l'agent de contenu (22/11/2026, carte blanche d'Ugo : « un truc qui me coûte pas d'argent [...] ultra efficace et complet »).
-- visites : compteur maison sans cookie ni adresse IP. Une ligne par page vue : chemin, source nommée (Google, ChatGPT…),
--   identifiant de visite tiré au hasard et gardé dans l'onglet seulement (sessionStorage), arrivée oui ou non.
-- gsc : lignes de la Search Console (jour, page, requête), importées chaque jour par /api/keepalive.
-- Ajout seulement. Retour arrière : drop function public.site_visite(text, text, uuid, boolean); drop table public.visites; drop table public.gsc;
begin;

create table if not exists public.visites (
  id bigint generated always as identity primary key,
  cree_le timestamptz not null default now(),
  chemin text not null,
  source text,
  visite uuid,
  arrivee boolean not null default false
);
create index if not exists visites_cree_le on public.visites (cree_le);
alter table public.visites enable row level security;
drop policy if exists visites_admin on public.visites;
create policy visites_admin on public.visites for select to authenticated using (is_admin());

create or replace function public.site_visite(p_chemin text, p_source text, p_visite uuid, p_arrivee boolean)
returns void language sql security definer set search_path to 'public' as $$
  insert into public.visites (chemin, source, visite, arrivee)
  values (left(coalesce(p_chemin, '/'), 200), left(p_source, 80), p_visite, coalesce(p_arrivee, false));
$$;
revoke all on function public.site_visite(text, text, uuid, boolean) from public;
grant execute on function public.site_visite(text, text, uuid, boolean) to anon, authenticated;

create table if not exists public.gsc (
  jour date not null,
  page text not null,
  requete text not null,
  clics integer not null default 0,
  impressions integer not null default 0,
  position numeric(6,2),
  primary key (jour, page, requete)
);
alter table public.gsc enable row level security;
drop policy if exists gsc_admin on public.gsc;
create policy gsc_admin on public.gsc for select to authenticated using (is_admin());

commit;

-- Fonction trafic_periode : appliquée par la migration trafic_agent_rapport (22/11/2026), texte relisible en base (pg_get_functiondef).

-- reglages_serveur (migration reglages_serveur, 22/11/2026) : secrets lus par les fonctions serveur seulement (clé service_role),
-- car la variable Vercel n'a pas pu être créée (API et CLI refusées le 22/11). RLS sans règle : illisible avec la clé publique.
-- Clés : agent_jeton_sha256 (empreinte du jeton de l'agent de contenu), gsc_sa_json (compte de service Google, lecture Search Console).
create table if not exists public.reglages_serveur (cle text primary key, valeur text not null, maj_le timestamptz not null default now());
alter table public.reglages_serveur enable row level security;
revoke all on public.reglages_serveur from anon, authenticated;

-- gsc_pages (migration gsc_pages, 22/11/2026) : totaux exacts jour × page ; la table gsc (détail par requête) ne contient pas
-- les requêtes rares que Google masque. trafic_periode réécrite dans la même migration pour lire les totaux dans gsc_pages.
create table if not exists public.gsc_pages (
  jour date not null, page text not null,
  clics integer not null default 0, impressions integer not null default 0, position numeric(6,2),
  primary key (jour, page)
);
alter table public.gsc_pages enable row level security;
create policy gsc_pages_admin on public.gsc_pages for select to authenticated using (is_admin());
-- Retour arrière : drop table public.gsc_pages; drop table public.reglages_serveur;
