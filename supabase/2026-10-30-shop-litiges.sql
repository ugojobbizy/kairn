-- Leads Shop réservé aux contacts remis en vente après un litige (30/10/2026), base Supabase « kairn » (bmqvlwdbwfnafuovzzhi).
-- Ugo, 30/10/2026 : « dans l'espace Lead Shop il doit y avoir uniquement les hors zones et les doublons et du coup ils doivent
-- tous être avec une petite réduction, on va dire de 4 euros par lead, et affiche sa réduction ».
-- Avant : le Shop montrait tout le stock non attribué ; seuls les hors zone revenaient, 5 € moins chers.
-- Après : le Shop ne montre et ne vend que les copies créées par un litige accepté (hors zone ou doublon), 4 € moins chères ;
-- le stock neuf ne part plus que par les commandes (admin_livrer). shop_leads rend aussi le prix d'origine pour afficher la réduction.
-- Retour arrière : relancer les définitions de supabase/2026-10-29-campagnes-shop.sql (shop_leads, shop_acheter, admin_trancher_litige).

-- ─ Shop : seulement les contacts remis en vente, avec leur prix d'origine ─
drop function if exists public.shop_leads();
create function public.shop_leads()
returns table (id uuid, recu_le timestamptz, thematique text, prix_ht numeric, prix_origine numeric, consentement_jusqu date,
               code_postal text, departement text, statut_occupation text, type_logement text, chauffage text, surface text)
language sql stable security definer set search_path = public as $$
  select l.id, l.recu_le, l.thematique, l.prix_ht, coalesce(o.prix_ht, l.prix_ht + 4), l.consentement_jusqu, l.code_postal, l.departement,
         l.statut_occupation, l.type_logement, l.chauffage, l.surface
  from public.leads l
  left join public.leads o on o.id = l.origine_id
  where l.client_id is null and not l.annule and l.en_vente and l.deja_transmis
    and (l.exclu_client is null or l.exclu_client <> auth.uid())
    and (l.consentement_jusqu is null or l.consentement_jusqu >= current_date)
    and (public.est_client() or public.is_admin())
  order by l.recu_le desc;
$$;
revoke all on function public.shop_leads() from public, anon;
grant execute on function public.shop_leads() to authenticated;

-- ─ Achat au Shop : mêmes règles, limité aux contacts remis en vente ─
create or replace function public.shop_acheter(p_ids uuid[])
returns uuid
language plpgsql security definer set search_path = public as $$
declare
  v_cmd uuid; v_n int; v_total numeric; v_client public.clients%rowtype; v_email text; v_them text;
begin
  select * into v_client from public.clients where user_id = auth.uid();
  if not found then raise exception 'pas_client'; end if;
  if p_ids is null or array_length(p_ids, 1) is null or array_length(p_ids, 1) > 500 then raise exception 'selection_invalide'; end if;
  perform 1 from public.leads where id = any(p_ids) and client_id is null and not annule and en_vente and deja_transmis
    and (exclu_client is null or exclu_client <> auth.uid())
    and (consentement_jusqu is null or consentement_jusqu >= current_date) for update skip locked;
  select count(*), sum(prix_ht), case when count(distinct thematique) = 1 then min(thematique) else 'Mixte' end
    into v_n, v_total, v_them
    from public.leads where id = any(p_ids) and client_id is null and not annule and en_vente and deja_transmis
      and (exclu_client is null or exclu_client <> auth.uid())
      and (consentement_jusqu is null or consentement_jusqu >= current_date);
  if v_n = 0 then raise exception 'plus_disponible'; end if;
  select email into v_email from auth.users where id = auth.uid();
  insert into public.commandes (user_id, souhait, type, societe, nom, email, telephone, siret, thematique, volume, page,
                                statut, etape, bdc_numero, plafond, prix_unitaire, montant_ht, approuve_le)
  values (auth.uid(), 'leads', 'shop', v_client.societe, v_client.prenom, v_email, v_client.telephone, v_client.siret, v_them,
          v_n::text, '/espace/shop', 'terminee', 'terminee', public.bdc_suivant(), v_n, round(v_total / v_n, 2), v_total, now())
  returning id into v_cmd;
  update public.leads set client_id = auth.uid(), commande_id = v_cmd, livre_le = now()
    where id = any(p_ids) and client_id is null and not annule and en_vente and deja_transmis
      and (exclu_client is null or exclu_client <> auth.uid())
      and (consentement_jusqu is null or consentement_jusqu >= current_date);
  return v_cmd;
end $$;

-- ─ Litige accepté : remplacement, puis remise en vente au Shop pour les hors zone ET les doublons, 4 € moins cher ─
create or replace function public.admin_trancher_litige(p_litige uuid, p_accepte boolean, p_reponse text)
returns uuid
language plpgsql security definer set search_path = public as $$
declare v_l public.litiges%rowtype; v_lead public.leads%rowtype; v_new uuid;
begin
  if not public.is_admin() then raise exception 'interdit'; end if;
  select * into v_l from public.litiges where id = p_litige for update;
  if not found or v_l.statut <> 'en_attente' then raise exception 'litige_deja_traite'; end if;
  if p_accepte then
    select * into v_lead from public.leads where id = v_l.lead_id for update;
    update public.leads set annule = true where id = v_lead.id;
    select id into v_new from public.leads
      where client_id is null and not annule and en_vente and not deja_transmis and thematique = v_lead.thematique
        and (consentement_jusqu is null or consentement_jusqu >= current_date)
      order by recu_le desc limit 1 for update skip locked;
    if v_new is not null then
      update public.leads set client_id = v_lead.client_id, commande_id = v_lead.commande_id, livre_le = now() where id = v_new;
    elsif v_lead.commande_id is not null then
      update public.commandes set statut = 'ouverte' where id = v_lead.commande_id and statut = 'terminee';
    end if;
    if v_l.motif in ('hors_zone', 'doublon') then
      insert into public.leads (recu_le, thematique, prix_ht, consentement_jusqu, code_postal, ville, statut_occupation, type_logement,
                                chauffage, surface, prenom, nom, telephone, email, source, deja_transmis, exclu_client, origine_id)
      values (v_lead.recu_le, v_lead.thematique, greatest(0, v_lead.prix_ht - 4), v_lead.consentement_jusqu, v_lead.code_postal, v_lead.ville,
              v_lead.statut_occupation, v_lead.type_logement, v_lead.chauffage, v_lead.surface, v_lead.prenom, v_lead.nom,
              v_lead.telephone, v_lead.email, 'shop_' || v_l.motif, true, v_lead.client_id, v_lead.id);
    end if;
  end if;
  update public.litiges set statut = case when p_accepte then 'accepte' else 'refuse' end,
    reponse = nullif(left(trim(p_reponse), 1000), ''), traite_le = now(), remplacement_id = v_new
  where id = p_litige;
  return v_new;
end $$;
