-- Bloc 1 « vitesse et relance » de l'espace client (décisions d'Ugo du 12/11/2026), base « kairn ». N'ajoute que des colonnes,
-- une table et une fonction ; ne modifie ni ne supprime aucune donnée.
--   lead_suivi : nombre d'appels passés et date du dernier (4 appels au plus, règle DGCCRF appliquée par choix d'Ugo).
--   lead_suivi_journal : type « appel » (texte = 'nrp' ou 'repondu') pour le fil d'activité.
--   client_prefs : plan de relance propre au client (null = plan Kairn par défaut, src/espace/relance.js) et adresses
--                  d'alerte supplémentaires (l'équipe : patron, commercial, secrétariat).
--   sms_modeles : modèles de SMS du client (« Générer un SMS » : copié puis envoyé par l'installateur lui-même).
--   suivi_appel : enregistre un appel (pas de réponse ou répondu) et programme la relance suivante.
-- Retour arrière : voir la fin du fichier.

alter table public.lead_suivi add column if not exists tentatives integer not null default 0 check (tentatives between 0 and 50);
alter table public.lead_suivi add column if not exists derniere_tentative timestamptz;

alter table public.lead_suivi_journal drop constraint if exists lead_suivi_journal_type_check;
alter table public.lead_suivi_journal add constraint lead_suivi_journal_type_check check (type in ('statut', 'note', 'appel'));

alter table public.client_prefs add column if not exists plan_relance jsonb
  check (plan_relance is null or (jsonb_typeof(plan_relance) = 'array' and jsonb_array_length(plan_relance) between 1 and 4));
alter table public.client_prefs add column if not exists emails_sup text[] not null default '{}'
  check (cardinality(emails_sup) <= 4);

create table if not exists public.sms_modeles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  titre text not null check (char_length(btrim(titre)) between 1 and 60),
  texte text not null check (char_length(btrim(texte)) between 1 and 640),
  ordre integer not null default 0,
  cree_le timestamptz not null default now()
);
create index if not exists sms_modeles_user on public.sms_modeles (user_id, ordre);
alter table public.sms_modeles enable row level security;
drop policy if exists sms_modeles_lit on public.sms_modeles;
drop policy if exists sms_modeles_cree on public.sms_modeles;
drop policy if exists sms_modeles_maj on public.sms_modeles;
drop policy if exists sms_modeles_suppr on public.sms_modeles;
create policy sms_modeles_lit on public.sms_modeles for select to authenticated using (user_id = auth.uid());
create policy sms_modeles_cree on public.sms_modeles for insert to authenticated with check (user_id = auth.uid());
create policy sms_modeles_maj on public.sms_modeles for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy sms_modeles_suppr on public.sms_modeles for delete to authenticated using (user_id = auth.uid());

-- Un appel passé à un contact livré à l'appelant. « nrp » : pas de réponse, l'étape passe à NRP (sauf si le contact est déjà
-- plus loin) et le rappel suivant est programmé à p_prochaine (calculé par l'espace selon le plan, null = plus de relance).
-- « repondu » : l'appel est compté, l'étape ne bouge pas (l'installateur la choisit ensuite).
create or replace function public.suivi_appel(p_lead uuid, p_resultat text, p_prochaine timestamptz)
returns public.lead_suivi
language plpgsql security definer set search_path = public as $$
declare v_ancien text; v_row public.lead_suivi;
begin
  if not exists (select 1 from public.leads where id = p_lead and client_id = auth.uid()) then raise exception 'interdit'; end if;
  if p_resultat not in ('nrp', 'repondu') then raise exception 'resultat_invalide'; end if;
  select statut into v_ancien from public.lead_suivi where lead_id = p_lead;
  insert into public.lead_suivi (lead_id, client_id, statut, tentatives, derniere_tentative, rappel_le, maj_le)
  values (p_lead, auth.uid(), case when p_resultat = 'nrp' then 'nrp' else 'a_appeler' end, 1, now(),
          case when p_resultat = 'nrp' then p_prochaine end, now())
  on conflict (lead_id) do update
    set tentatives = public.lead_suivi.tentatives + 1,
        derniere_tentative = now(),
        statut = case when p_resultat = 'nrp' and public.lead_suivi.statut in ('a_appeler', 'nrp', 'a_rappeler') then 'nrp' else public.lead_suivi.statut end,
        rappel_le = case when p_resultat = 'nrp' and public.lead_suivi.statut in ('a_appeler', 'nrp', 'a_rappeler') then p_prochaine else public.lead_suivi.rappel_le end,
        maj_le = now(), client_id = auth.uid()
  returning * into v_row;
  insert into public.lead_suivi_journal (lead_id, client_id, type, texte) values (p_lead, auth.uid(), 'appel', p_resultat);
  if coalesce(v_ancien, 'a_appeler') is distinct from v_row.statut then
    insert into public.lead_suivi_journal (lead_id, client_id, type, statut) values (p_lead, auth.uid(), 'statut', v_row.statut);
  end if;
  return v_row;
end $$;
revoke all on function public.suivi_appel(uuid, text, timestamptz) from public, anon;
grant execute on function public.suivi_appel(uuid, text, timestamptz) to authenticated;

-- ─ Retour arrière (à lancer seulement en cas de besoin) ─────────
-- drop function if exists public.suivi_appel(uuid, text, timestamptz);
-- drop table if exists public.sms_modeles;
-- alter table public.client_prefs drop column if exists emails_sup, drop column if exists plan_relance;
-- delete from public.lead_suivi_journal where type = 'appel';
-- alter table public.lead_suivi_journal drop constraint if exists lead_suivi_journal_type_check;
-- alter table public.lead_suivi_journal add constraint lead_suivi_journal_type_check check (type in ('statut', 'note'));
-- alter table public.lead_suivi drop column if exists derniere_tentative, drop column if exists tentatives;
