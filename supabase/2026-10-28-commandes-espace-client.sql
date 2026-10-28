-- Refonte du 28/10/2026 : commandes du site et espace client (base Supabase « kairn », bmqvlwdbwfnafuovzzhi).
-- Ajoute seulement des objets : ne touche ni à leads_site, ni à onboardings, ni à admins.

-- Clients qui ont accès à l'espace client. Une ligne = un compte Supabase Auth créé par Ugo.
create table if not exists public.clients (
  user_id uuid primary key references auth.users(id) on delete cascade,
  societe text not null,
  prenom text,
  telephone text,
  siret text,
  created_at timestamptz not null default now()
);
alter table public.clients enable row level security;
create policy clients_lit_sa_fiche on public.clients for select to authenticated using (user_id = auth.uid());
create policy clients_admin on public.clients for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Commandes : formulaire public /commander (user_id vide) ou espace client (user_id du client).
create table if not exists public.commandes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid references auth.users(id) on delete set null,
  souhait text not null check (souhait in ('leads', 'accompagnement')),
  societe text,
  nom text,
  email text,
  telephone text,
  thematique text,
  volume text,
  zone text,
  siret text,
  message text,
  page text,
  statut text not null default 'nouvelle' check (statut in ('nouvelle', 'en_cours', 'ouverte', 'refusee'))
);
alter table public.commandes enable row level security;
-- Le client connecté lit et crée ses propres commandes ; l'admin lit tout.
create policy commandes_client_lit on public.commandes for select to authenticated using (user_id = auth.uid());
create policy commandes_client_cree on public.commandes for insert to authenticated with check (user_id = auth.uid());
create policy commandes_admin on public.commandes for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Formulaire public : insertion seulement, par une fonction (la table reste illisible avec la clé publique).
create or replace function public.site_commande_insert(
  p_souhait text, p_societe text, p_nom text, p_email text, p_telephone text,
  p_thematique text, p_volume text, p_zone text, p_siret text, p_page text
) returns uuid
language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.commandes (souhait, societe, nom, email, telephone, thematique, volume, zone, siret, page)
  values (p_souhait, left(p_societe, 120), left(p_nom, 120), left(p_email, 120), left(p_telephone, 20),
          left(p_thematique, 40), left(p_volume, 20), left(p_zone, 200), left(p_siret, 20), left(p_page, 200))
  returning id into v_id;
  return v_id;
end $$;
revoke all on function public.site_commande_insert(text, text, text, text, text, text, text, text, text, text) from public;
grant execute on function public.site_commande_insert(text, text, text, text, text, text, text, text, text, text) to anon, authenticated;
