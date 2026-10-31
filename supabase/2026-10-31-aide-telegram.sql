-- Retours des clients et réponses par Telegram (31/10/2026), base Supabase « kairn » (bmqvlwdbwfnafuovzzhi).
-- Ugo, 31/10/2026 : une icône « conversation » pour remonter bugs, erreurs et recommandations ; « que je reçoive sur
-- mon Telegram l'alerte et que je puisse écrire par message la réponse et qu'eux le reçoivent sur leur plateforme ».
--   tickets.categorie : bug, erreur, suggestion ou question.
--   telegram_liens : relie chaque alerte Telegram (message_id) à sa demande, pour router la réponse d'Ugo.
--   ticket_repondre_kairn : écrit la réponse au nom de l'admin ; appelée seulement par le serveur (clé de service).
-- Ajoute seulement des objets. Retour arrière : voir la fin du fichier.

alter table public.tickets add column if not exists categorie text not null default 'question'
  check (categorie in ('bug', 'erreur', 'suggestion', 'question'));

create table if not exists public.telegram_liens (
  message_id bigint primary key,
  ticket_id uuid not null references public.tickets(id) on delete cascade,
  cree_le timestamptz not null default now()
);
-- Aucune règle d'accès : seule la clé de service (serveur) lit et écrit cette table.
alter table public.telegram_liens enable row level security;

create or replace function public.ticket_repondre_kairn(p_ticket uuid, p_texte text)
returns uuid
language plpgsql security definer set search_path = public as $$
declare v_admin uuid; v_id uuid;
begin
  if nullif(btrim(p_texte), '') is null then raise exception 'message_vide'; end if;
  select u.id into v_admin from auth.users u join public.admins a on lower(a.email) = lower(u.email) order by u.created_at limit 1;
  if v_admin is null then raise exception 'admin_introuvable'; end if;
  if not exists (select 1 from public.tickets where id = p_ticket) then raise exception 'ticket_introuvable'; end if;
  insert into public.ticket_messages (ticket_id, auteur, de_kairn, texte) values (p_ticket, v_admin, true, left(btrim(p_texte), 4000))
  returning id into v_id;
  update public.tickets set vu_admin_le = now() where id = p_ticket;
  return v_id;
end $$;
revoke all on function public.ticket_repondre_kairn(uuid, text) from public, anon, authenticated;
grant execute on function public.ticket_repondre_kairn(uuid, text) to service_role;

-- ─ Retour arrière (à lancer seulement en cas de besoin) ─────────
-- drop function if exists public.ticket_repondre_kairn(uuid, text);
-- drop table if exists public.telegram_liens;
-- alter table public.tickets drop column if exists categorie;
