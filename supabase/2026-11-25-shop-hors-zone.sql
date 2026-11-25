-- Leads Shop : retour à la règle du 29/10 (25/11/2026), base Supabase « kairn » (bmqvlwdbwfnafuovzzhi).
-- Choix cliqué d'Ugo le 25/11/2026 : « Revenir au 29/10 », c'est-à-dire seuls les HORS ZONE acceptés en litige
-- repartent au Shop, 5 € moins chers ; les doublons sont remplacés mais ne sont plus revendus (promesse « un seul professionnel »).
-- Le reste de la règle du 30/10 est gardé : le Shop ne montre que les copies issues d'un litige, réduction affichée.
-- Au 25/11, aucune copie « shop_% » n'existait en base : aucune donnée n'est modifiée.
-- Retour arrière : relancer les définitions de shop_leads et admin_trancher_litige de supabase/2026-10-30-shop-litiges.sql.

create or replace function public.shop_leads()
returns table (id uuid, recu_le timestamptz, thematique text, prix_ht numeric, prix_origine numeric, consentement_jusqu date,
               code_postal text, departement text, statut_occupation text, type_logement text, chauffage text, surface text)
language sql stable security definer set search_path = public as $$
  select l.id, l.recu_le, l.thematique, l.prix_ht, coalesce(o.prix_ht, l.prix_ht + 5), l.consentement_jusqu, l.code_postal, l.departement,
         l.statut_occupation, l.type_logement, l.chauffage, l.surface
  from public.leads l
  left join public.leads o on o.id = l.origine_id
  where l.client_id is null and not l.annule and l.en_vente and l.deja_transmis
    and (l.exclu_client is null or l.exclu_client <> auth.uid())
    and (l.consentement_jusqu is null or l.consentement_jusqu >= current_date)
    and (public.est_client() or public.is_admin())
  order by l.recu_le desc;
$$;

-- ─ Litige accepté : remplacement (doublon ou hors zone), puis remise en vente au Shop des seuls hors zone, 5 € moins cher ─
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
    if v_l.motif = 'hors_zone' then
      insert into public.leads (recu_le, thematique, prix_ht, consentement_jusqu, code_postal, ville, statut_occupation, type_logement,
                                chauffage, surface, prenom, nom, telephone, email, source, deja_transmis, exclu_client, origine_id)
      values (v_lead.recu_le, v_lead.thematique, greatest(0, v_lead.prix_ht - 5), v_lead.consentement_jusqu, v_lead.code_postal, v_lead.ville,
              v_lead.statut_occupation, v_lead.type_logement, v_lead.chauffage, v_lead.surface, v_lead.prenom, v_lead.nom,
              v_lead.telephone, v_lead.email, 'shop_' || v_l.motif, true, v_lead.client_id, v_lead.id);
    end if;
  end if;
  update public.litiges set statut = case when p_accepte then 'accepte' else 'refuse' end,
    reponse = nullif(left(trim(p_reponse), 1000), ''), traite_le = now(), remplacement_id = v_new
  where id = p_litige;
  return v_new;
end $$;
