-- Sécurité de Kairn Admin (audit du 31/10/2026, accord d'Ugo : « Oui, corrige »).
-- 1. Appareils connus (Ugo, 31/10/2026 : « lorsque la connexion provient de mon Mac, on ne demande pas de code
--    supplémentaire », code envoyé sur Telegram pour un autre appareil, appareil connu 30 jours, alerte Telegram).
--    is_admin() n'est vrai qu'avec le mot de passe ET la clé d'un appareil connu, envoyée par le navigateur
--    dans l'en-tête x-kairn-appareil. La base n'en garde que l'empreinte (sha256). Toutes les règles d'accès et les
--    fonctions admin passent par is_admin(), les fonctions serveur (api/) aussi, qui relaient l'en-tête.
--    Codes et clés sont créés seulement par api/admin-code.js (clé de service) : aucune règle d'écriture ici.
-- 2. compte_admin() : l'e-mail est-il dans admins, sans clé d'appareil. Sert seulement à l'écran de connexion
--    (demander le code) et à l'espace client (renvoyer l'admin vers /gestion). Ne donne accès à rien.
-- 3. Pré-commande d'un client : plus de plafond, prix, date de lancement ni étape autre que « recue » à la création.

create table if not exists public.admin_appareils (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  cle_hash text not null unique,
  nom text,
  cree_le timestamptz not null default now(),
  expire_le timestamptz not null default now() + interval '30 days'
);
alter table public.admin_appareils enable row level security;

create table if not exists public.admin_codes (
  email text primary key,
  code_hash text not null,
  essais int not null default 0,
  cree_le timestamptz not null default now(),
  expire_le timestamptz not null
);
alter table public.admin_codes enable row level security;

create or replace function public.compte_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.admins where email = auth.jwt() ->> 'email');
$$;
revoke all on function public.compte_admin() from public, anon;
grant execute on function public.compte_admin() to authenticated;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.admins where email = auth.jwt() ->> 'email')
     and exists (
       select 1 from public.admin_appareils a
       where a.email = auth.jwt() ->> 'email' and a.expire_le > now()
         and a.cle_hash = encode(sha256(convert_to(coalesce(current_setting('request.headers', true)::json ->> 'x-kairn-appareil', ''), 'UTF8')), 'hex')
     );
$$;

-- Liste et retrait des appareils dans Kairn Admin.
create policy admin_appareils_lit on public.admin_appareils for select to authenticated using (public.is_admin());
create policy admin_appareils_retire on public.admin_appareils for delete to authenticated using (public.is_admin());

drop policy if exists commandes_client_cree on public.commandes;
create policy commandes_client_cree on public.commandes for insert to authenticated
  with check (user_id = auth.uid() and statut = 'nouvelle' and bdc_numero is null and montant_ht is null and approuve_le is null
              and regle_le is null and (type is null or type = 'precommande')
              and plafond is null and prix_unitaire is null and lancee_le is null and coalesce(etape, 'recue') = 'recue');

-- Retour arrière :
-- create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = '' as $$
--   select exists (select 1 from public.admins where email = auth.jwt() ->> 'email'); $$;
-- (les tables admin_appareils et admin_codes peuvent rester ; l'ancienne règle commandes_client_cree, sans les quatre dernières conditions)
