-- CRM de l'espace client, sur la base des CRM ETXE Énergie et Isolation d'Aquitaine (30/10/2026), base « kairn ».
-- Ugo, 30/10/2026 : « dans l'espace Mes contacts [...] prends la même base que le CRM que j'ai fait pour ETXE Énergie et
-- pour Isolation d'Aquitaine ». Complète supabase/2026-10-30-suivi-leads.sql (déjà appliqué) ; n'ajoute que des colonnes.
--   lead_suivi : étape « à rappeler », date de rendez-vous, motif de perte.
--   lead_suivi_journal : notes datées en plus des changements d'étape (fil d'activité de la fiche).
--   suivi_maj : remplacée par suivi_enregistrer (tous les champs) et suivi_noter (une note).
-- Retour arrière : voir la fin du fichier.

alter table public.lead_suivi drop constraint if exists lead_suivi_statut_check;
alter table public.lead_suivi add constraint lead_suivi_statut_check
  check (statut in ('a_appeler', 'nrp', 'a_rappeler', 'rdv', 'devis', 'signe', 'perdu'));
alter table public.lead_suivi add column if not exists rdv_le timestamptz;
alter table public.lead_suivi add column if not exists motif_perte text check (motif_perte is null or char_length(motif_perte) <= 60);

alter table public.lead_suivi_journal add column if not exists type text not null default 'statut' check (type in ('statut', 'note'));
alter table public.lead_suivi_journal add column if not exists texte text check (texte is null or char_length(texte) <= 2000);
alter table public.lead_suivi_journal alter column statut drop not null;

-- Enregistre l'état complet d'un contact livré à l'appelant ; journalise un vrai changement d'étape.
create or replace function public.suivi_enregistrer(p_lead uuid, p_statut text, p_rappel timestamptz, p_rdv timestamptz, p_motif text)
returns void
language plpgsql security definer set search_path = public as $$
declare v_ancien text;
begin
  if not exists (select 1 from public.leads where id = p_lead and client_id = auth.uid()) then raise exception 'interdit'; end if;
  select statut into v_ancien from public.lead_suivi where lead_id = p_lead;
  insert into public.lead_suivi (lead_id, client_id, statut, rappel_le, rdv_le, motif_perte, maj_le)
  values (p_lead, auth.uid(), p_statut, p_rappel, p_rdv, case when p_statut = 'perdu' then nullif(btrim(p_motif), '') end, now())
  on conflict (lead_id) do update
    set statut = excluded.statut, rappel_le = excluded.rappel_le, rdv_le = excluded.rdv_le,
        motif_perte = excluded.motif_perte, maj_le = now(), client_id = auth.uid();
  if v_ancien is distinct from p_statut then
    insert into public.lead_suivi_journal (lead_id, client_id, type, statut) values (p_lead, auth.uid(), 'statut', p_statut);
  end if;
end $$;

-- Ajoute une note datée au fil d'activité d'un contact livré à l'appelant.
create or replace function public.suivi_noter(p_lead uuid, p_texte text)
returns bigint
language plpgsql security definer set search_path = public as $$
declare v_id bigint;
begin
  if not exists (select 1 from public.leads where id = p_lead and client_id = auth.uid()) then raise exception 'interdit'; end if;
  if nullif(btrim(p_texte), '') is null then raise exception 'note_vide'; end if;
  insert into public.lead_suivi_journal (lead_id, client_id, type, texte) values (p_lead, auth.uid(), 'note', left(btrim(p_texte), 2000))
  returning id into v_id;
  -- Le contact apparaît dans le suivi dès sa première note.
  insert into public.lead_suivi (lead_id, client_id) values (p_lead, auth.uid()) on conflict (lead_id) do update set maj_le = now();
  return v_id;
end $$;

revoke all on function public.suivi_enregistrer(uuid, text, timestamptz, timestamptz, text) from public, anon;
revoke all on function public.suivi_noter(uuid, text) from public, anon;
grant execute on function public.suivi_enregistrer(uuid, text, timestamptz, timestamptz, text) to authenticated;
grant execute on function public.suivi_noter(uuid, text) to authenticated;

-- ─ Retour arrière (à lancer seulement en cas de besoin) ─────────
-- drop function if exists public.suivi_noter(uuid, text);
-- drop function if exists public.suivi_enregistrer(uuid, text, timestamptz, timestamptz, text);
-- delete from public.lead_suivi_journal where type = 'note';
-- alter table public.lead_suivi_journal drop column if exists texte, drop column if exists type;
-- alter table public.lead_suivi_journal alter column statut set not null;
-- update public.lead_suivi set statut = 'nrp' where statut = 'a_rappeler';
-- alter table public.lead_suivi drop column if exists motif_perte, drop column if exists rdv_le;
-- alter table public.lead_suivi drop constraint if exists lead_suivi_statut_check;
-- alter table public.lead_suivi add constraint lead_suivi_statut_check check (statut in ('a_appeler', 'nrp', 'rdv', 'devis', 'signe', 'perdu'));
