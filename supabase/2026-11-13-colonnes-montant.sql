-- Colonnes du pipeline propres à chaque client et montant du devis (Ugo, 13/11/2026 : « je veux pouvoir créer des
-- nouvelles colonnes, je veux pouvoir modifier le nom des colonnes » ; choix cliqués : renommer, réordonner, masquer, et
-- nouvelles colonnes typées ; montant du devis et total par colonne). Base « kairn ». N'ajoute que des objets et élargit
-- la liste des étapes permises ; ne modifie ni ne supprime aucune donnée.
--   crm_colonnes : réglage des colonnes du client. Une ligne par colonne de base renommée, déplacée ou masquée
--                  (cle = a_appeler, nrp, ...), une ligne par colonne créée (cle = null). Sans ligne : réglage Kairn.
--                  type : relance (le contact reste dans Ma journée et les relances), en_cours, gagne, perdu.
--   lead_suivi.statut : une étape de base, ou « col:<id> » pour une colonne créée par le client.
--   lead_suivi.montant : montant du devis HT, en euros.
--   suivi_montant : enregistre le montant d'un contact livré à l'appelant.
--   suivi_appel : « pas de réponse » sur un contact d'une colonne créée de type relance programme aussi la relance.
-- Retour arrière : voir la fin du fichier.

create table if not exists public.crm_colonnes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  cle text check (cle is null or cle in ('a_appeler', 'nrp', 'a_rappeler', 'rdv', 'devis', 'signe', 'perdu')),
  nom text not null check (char_length(btrim(nom)) between 1 and 40),
  type text not null check (type in ('relance', 'en_cours', 'gagne', 'perdu')),
  ordre integer not null default 0,
  masquee boolean not null default false,
  couleur text check (couleur is null or couleur ~ '^#[0-9A-Fa-f]{6}$'),
  cree_le timestamptz not null default now(),
  unique (user_id, cle)
);
create index if not exists crm_colonnes_user on public.crm_colonnes (user_id, ordre);
alter table public.crm_colonnes enable row level security;
drop policy if exists crm_colonnes_lit on public.crm_colonnes;
drop policy if exists crm_colonnes_cree on public.crm_colonnes;
drop policy if exists crm_colonnes_maj on public.crm_colonnes;
drop policy if exists crm_colonnes_suppr on public.crm_colonnes;
create policy crm_colonnes_lit on public.crm_colonnes for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy crm_colonnes_cree on public.crm_colonnes for insert to authenticated with check (user_id = auth.uid());
create policy crm_colonnes_maj on public.crm_colonnes for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy crm_colonnes_suppr on public.crm_colonnes for delete to authenticated using (user_id = auth.uid() and cle is null);

alter table public.lead_suivi drop constraint if exists lead_suivi_statut_check;
alter table public.lead_suivi add constraint lead_suivi_statut_check
  check (statut in ('a_appeler', 'nrp', 'a_rappeler', 'rdv', 'devis', 'signe', 'perdu') or statut ~ '^col:[0-9a-f-]{36}$');
alter table public.lead_suivi add column if not exists montant numeric(12, 2) check (montant is null or montant between 0 and 10000000);

create or replace function public.suivi_montant(p_lead uuid, p_montant numeric)
returns void
language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.leads where id = p_lead and client_id = auth.uid()) then raise exception 'interdit'; end if;
  insert into public.lead_suivi (lead_id, client_id, montant, maj_le) values (p_lead, auth.uid(), p_montant, now())
  on conflict (lead_id) do update set montant = excluded.montant, maj_le = now(), client_id = auth.uid();
end $$;
revoke all on function public.suivi_montant(uuid, numeric) from public, anon;
grant execute on function public.suivi_montant(uuid, numeric) to authenticated;

-- Étape « relançable » : les trois étapes de base d'appel, ou une colonne créée par le client de type relance.
create or replace function public.statut_relancable(p_statut text, p_client uuid)
returns boolean
language sql stable security definer set search_path = public as $$
  select p_statut in ('a_appeler', 'nrp', 'a_rappeler')
      or (p_statut like 'col:%' and exists (select 1 from public.crm_colonnes c where c.user_id = p_client and c.cle is null
                                              and 'col:' || c.id::text = p_statut and c.type = 'relance'));
$$;
revoke all on function public.statut_relancable(text, uuid) from public, anon;

create or replace function public.suivi_appel(p_lead uuid, p_resultat text, p_prochaine timestamptz)
returns public.lead_suivi
language plpgsql security definer set search_path = public as $$
declare v_ancien text; v_relance boolean; v_row public.lead_suivi;
begin
  if not exists (select 1 from public.leads where id = p_lead and client_id = auth.uid()) then raise exception 'interdit'; end if;
  if p_resultat not in ('nrp', 'repondu') then raise exception 'resultat_invalide'; end if;
  select statut into v_ancien from public.lead_suivi where lead_id = p_lead;
  v_relance := public.statut_relancable(coalesce(v_ancien, 'a_appeler'), auth.uid());
  insert into public.lead_suivi (lead_id, client_id, statut, tentatives, derniere_tentative, rappel_le, maj_le)
  values (p_lead, auth.uid(), case when p_resultat = 'nrp' then 'nrp' else 'a_appeler' end, 1, now(),
          case when p_resultat = 'nrp' then p_prochaine end, now())
  on conflict (lead_id) do update
    set tentatives = public.lead_suivi.tentatives + 1,
        derniere_tentative = now(),
        -- Une colonne de base passe en NRP ; une colonne créée de type relance garde le contact où il est.
        statut = case when p_resultat = 'nrp' and public.lead_suivi.statut in ('a_appeler', 'nrp', 'a_rappeler') then 'nrp' else public.lead_suivi.statut end,
        rappel_le = case when p_resultat = 'nrp' and v_relance then p_prochaine else public.lead_suivi.rappel_le end,
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

-- ─ Retour arrière (à lancer seulement en cas de besoin ; remettre d'abord les contacts « col:… » dans une étape de base) ─
-- update public.lead_suivi set statut = 'a_rappeler' where statut like 'col:%';
-- alter table public.lead_suivi drop constraint if exists lead_suivi_statut_check;
-- alter table public.lead_suivi add constraint lead_suivi_statut_check check (statut in ('a_appeler', 'nrp', 'a_rappeler', 'rdv', 'devis', 'signe', 'perdu'));
-- alter table public.lead_suivi drop column if exists montant;
-- drop function if exists public.suivi_montant(uuid, numeric);
-- (suivi_appel : reprendre la version de supabase/2026-11-12-relance-leads.sql, puis) drop function if exists public.statut_relancable(text, uuid);
-- drop table if exists public.crm_colonnes;
