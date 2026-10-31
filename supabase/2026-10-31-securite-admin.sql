-- Sécurité de Kairn Admin (audit du 31/10/2026, accord d'Ugo : « Oui, corrige »).
-- 1. Double authentification obligatoire pour les droits admin : is_admin() n'est vrai qu'avec une session aal2
--    (mot de passe + code de l'application d'authentification). Toutes les règles d'accès et les fonctions admin
--    passent par is_admin(), les fonctions serveur (api/) aussi : elles exigent donc toutes l'aal2 sans autre changement.
-- 2. compte_admin() : l'e-mail est-il dans admins, quel que soit le niveau. Sert seulement à l'écran de connexion
--    (afficher l'étape du code) et à l'espace client (renvoyer l'admin vers /gestion). Ne donne accès à rien.
-- 3. Pré-commande d'un client : plus de plafond, prix, date de lancement ni étape autre que « recue » à la création.

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce(auth.jwt() ->> 'aal', '') = 'aal2'
     and exists (select 1 from public.admins where email = auth.jwt() ->> 'email');
$$;

create or replace function public.compte_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.admins where email = auth.jwt() ->> 'email');
$$;
revoke all on function public.compte_admin() from public, anon;
grant execute on function public.compte_admin() to authenticated;

drop policy if exists commandes_client_cree on public.commandes;
create policy commandes_client_cree on public.commandes for insert to authenticated
  with check (user_id = auth.uid() and statut = 'nouvelle' and bdc_numero is null and montant_ht is null and approuve_le is null
              and regle_le is null and (type is null or type = 'precommande')
              and plafond is null and prix_unitaire is null and lancee_le is null and coalesce(etape, 'recue') = 'recue');

-- Retour arrière :
-- create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = '' as $$
--   select exists (select 1 from public.admins where email = auth.jwt() ->> 'email'); $$;
-- (et l'ancienne règle commandes_client_cree, sans les quatre dernières conditions)
