-- Suivi des contacts dans l'espace client (30/10/2026), base Supabase « kairn » (bmqvlwdbwfnafuovzzhi).
-- Lot 2 de la refonte de l'espace (plan ~/.claude/plans/staged-wondering-peach.md) : un CRM simple pour les clients
-- qui n'en ont pas (Ugo, 30/10/2026 : « si besoin ils doivent avoir accès à un CRM intégré »).
-- Ajoute seulement des objets : ne touche ni à leads, ni à commandes, ni à litiges.
-- Le client ne peut que lire leads (leads_client_lit) : son suivi vit à part, et ne s'écrit que par suivi_maj,
-- qui vérifie que le lead lui a bien été livré.
-- Retour arrière : voir la fin du fichier.

-- ─ État courant d'un contact ────────────────────────────────────
-- Une ligne par lead suivi. Pas de ligne = « à appeler ».
create table if not exists public.lead_suivi (
  lead_id uuid primary key references public.leads(id) on delete cascade,
  client_id uuid not null references auth.users(id) on delete cascade,
  statut text not null default 'a_appeler' check (statut in ('a_appeler', 'nrp', 'rdv', 'devis', 'signe', 'perdu')),
  note text check (char_length(note) <= 2000),
  rappel_le timestamptz,
  maj_le timestamptz not null default now()
);
create index if not exists lead_suivi_client on public.lead_suivi (client_id, statut);
create index if not exists lead_suivi_rappel on public.lead_suivi (client_id, rappel_le) where rappel_le is not null;
alter table public.lead_suivi enable row level security;
create policy lead_suivi_client_lit on public.lead_suivi for select to authenticated using (client_id = auth.uid());
create policy lead_suivi_admin_lit on public.lead_suivi for select to authenticated using (public.is_admin());

-- ─ Historique des changements de statut ─────────────────────────
-- Sert à savoir quand un contact a été traité (délai de rappel, NRP répétés). Un statut mesure d'abord
-- le traitement du lead par le client, pas sa qualité (règle M-05 du cerveau).
create table if not exists public.lead_suivi_journal (
  id bigint generated always as identity primary key,
  lead_id uuid not null references public.leads(id) on delete cascade,
  client_id uuid not null references auth.users(id) on delete cascade,
  statut text not null,
  cree_le timestamptz not null default now()
);
create index if not exists lead_suivi_journal_lead on public.lead_suivi_journal (lead_id, cree_le);
alter table public.lead_suivi_journal enable row level security;
create policy lead_suivi_journal_client_lit on public.lead_suivi_journal for select to authenticated using (client_id = auth.uid());
create policy lead_suivi_journal_admin_lit on public.lead_suivi_journal for select to authenticated using (public.is_admin());

-- ─ Écriture par le client ───────────────────────────────────────
-- Met à jour le statut, la note et la date de rappel d'un lead livré à l'appelant.
-- p_note et p_rappel à null les effacent : l'espace envoie toujours les trois valeurs courantes.
-- Journalise seulement un vrai changement de statut.
create or replace function public.suivi_maj(p_lead uuid, p_statut text, p_note text, p_rappel timestamptz)
returns void
language plpgsql security definer set search_path = public as $$
declare v_ancien text;
begin
  if not exists (select 1 from public.leads where id = p_lead and client_id = auth.uid()) then
    raise exception 'interdit';
  end if;
  select statut into v_ancien from public.lead_suivi where lead_id = p_lead;
  insert into public.lead_suivi (lead_id, client_id, statut, note, rappel_le, maj_le)
  values (p_lead, auth.uid(), p_statut, nullif(btrim(p_note), ''), p_rappel, now())
  on conflict (lead_id) do update
    set statut = excluded.statut, note = excluded.note, rappel_le = excluded.rappel_le, maj_le = now(), client_id = auth.uid();
  if v_ancien is distinct from p_statut then
    insert into public.lead_suivi_journal (lead_id, client_id, statut) values (p_lead, auth.uid(), p_statut);
  end if;
end;
$$;

revoke all on function public.suivi_maj(uuid, text, text, timestamptz) from public, anon;
grant execute on function public.suivi_maj(uuid, text, text, timestamptz) to authenticated;

-- ─ Retour arrière (à lancer seulement en cas de besoin) ─────────
-- drop function if exists public.suivi_maj(uuid, text, text, timestamptz);
-- drop table if exists public.lead_suivi_journal;
-- drop table if exists public.lead_suivi;
