-- 17/11/2026 : d'où vient chaque demande du site (premier contact : moteur ou site d'origine, page d'arrivée, date).
-- Ajout seulement : une colonne `source` sur leads_site et commandes, et un paramètre p_source facultatif
-- dans les deux fonctions d'écriture (l'ancien code, qui ne l'envoie pas, continue de marcher).
begin;

alter table public.leads_site add column if not exists source text;
alter table public.commandes add column if not exists source text;

drop function if exists public.site_lead_upsert(uuid, text, text, text, text, timestamptz, text, text, text, text);
create function public.site_lead_upsert(p_id uuid, p_phone text, p_first_name text default null, p_company text default null,
  p_email text default null, p_slot timestamptz default null, p_utm_source text default null, p_utm_campaign text default null,
  p_utm_content text default null, p_page text default null, p_source text default null)
returns void language sql security definer set search_path to 'public' as $function$
  insert into public.leads_site as l (id, phone, first_name, company, email, slot, utm_source, utm_campaign, utm_content, page, source)
  values (p_id, left(p_phone, 20), left(p_first_name, 80), left(p_company, 120), left(p_email, 120), p_slot,
          left(p_utm_source, 120), left(p_utm_campaign, 120), left(p_utm_content, 120), left(p_page, 200), left(p_source, 300))
  on conflict (id) do update set
    updated_at = now(),
    first_name = coalesce(excluded.first_name, l.first_name),
    company = coalesce(excluded.company, l.company),
    email = coalesce(excluded.email, l.email),
    slot = coalesce(excluded.slot, l.slot),
    source = coalesce(l.source, excluded.source);
$function$;

drop function if exists public.site_commande_insert(text, text, text, text, text, text, text, text, text, text);
create function public.site_commande_insert(p_souhait text, p_societe text, p_nom text, p_email text, p_telephone text,
  p_thematique text, p_volume text, p_zone text, p_siret text, p_page text, p_source text default null)
returns uuid language plpgsql security definer set search_path to 'public' as $function$
declare v_id uuid;
begin
  insert into public.commandes (souhait, societe, nom, email, telephone, thematique, volume, zone, siret, page, source)
  values (p_souhait, left(p_societe, 120), left(p_nom, 120), left(p_email, 120), left(p_telephone, 20),
          left(p_thematique, 40), left(p_volume, 20), left(p_zone, 200), left(p_siret, 20), left(p_page, 200), left(p_source, 300))
  returning id into v_id;
  return v_id;
end $function$;

revoke all on function public.site_lead_upsert(uuid, text, text, text, text, timestamptz, text, text, text, text, text) from public;
revoke all on function public.site_commande_insert(text, text, text, text, text, text, text, text, text, text, text) from public;
grant execute on function public.site_lead_upsert(uuid, text, text, text, text, timestamptz, text, text, text, text, text) to anon, authenticated, service_role;
grant execute on function public.site_commande_insert(text, text, text, text, text, text, text, text, text, text, text) to anon, authenticated, service_role;

commit;
