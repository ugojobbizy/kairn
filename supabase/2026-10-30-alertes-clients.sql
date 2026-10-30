-- Alertes des clients à chaque livraison de contacts (30/10/2026), base Supabase « kairn » (bmqvlwdbwfnafuovzzhi).
-- Lot 3 de la refonte de l'espace (plan ~/.claude/plans/staged-wondering-peach.md). Choix d'Ugo (30/10/2026) :
-- le client choisit entre e-mail et notification mobile ; un webhook optionnel envoie chaque contact vers son CRM
-- (Zapier, Make, Google Sheets). L'envoi part de api/livraison.js, appelé après chaque livraison (admin_livrer).
-- Ajoute seulement des objets. Retour arrière : voir la fin du fichier.

-- ─ Préférences d'alerte d'un client ─────────────────────────────
create table if not exists public.client_prefs (
  user_id uuid primary key references auth.users(id) on delete cascade,
  alerte_email boolean not null default true,
  email text check (email is null or email ~* '^[^\s@]+@[^\s@]+\.[^\s@]{2,}$'),
  alerte_push boolean not null default false,
  webhook_url text check (webhook_url is null or (webhook_url ~* '^https://[^\s]+$' and char_length(webhook_url) <= 500)),
  maj_le timestamptz not null default now()
);
alter table public.client_prefs enable row level security;
create policy client_prefs_lit on public.client_prefs for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy client_prefs_cree on public.client_prefs for insert to authenticated with check (user_id = auth.uid());
create policy client_prefs_maj on public.client_prefs for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ─ Abonnements aux notifications mobiles (Web Push) ─────────────
-- Un abonnement par appareil. L'admin peut supprimer un abonnement expiré (réponse 404 ou 410 du service de push).
create table if not exists public.push_abonnements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  endpoint text not null unique check (endpoint ~ '^https://'),
  p256dh text not null,
  auth text not null,
  appareil text,
  cree_le timestamptz not null default now()
);
create index if not exists push_abonnements_user on public.push_abonnements (user_id);
alter table public.push_abonnements enable row level security;
create policy push_lit on public.push_abonnements for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy push_cree on public.push_abonnements for insert to authenticated with check (user_id = auth.uid());
create policy push_suppr on public.push_abonnements for delete to authenticated using (user_id = auth.uid() or public.is_admin());

-- ─ Retour arrière (à lancer seulement en cas de besoin) ─────────
-- drop table if exists public.push_abonnements;
-- drop table if exists public.client_prefs;
