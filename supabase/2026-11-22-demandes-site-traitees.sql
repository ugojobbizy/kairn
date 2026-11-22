-- Demandes du site dans Kairn Admin (22/11/2026) : une date « traité le » sur les numéros laissés à la réservation (leads_site)
-- et sur les demandes du formulaire Commander (commandes sans compte). Vide = à rappeler.
-- Ajout seulement. Retour arrière : alter table ... drop column traite_le (sur les deux tables).
begin;
alter table public.leads_site add column if not exists traite_le timestamptz;
alter table public.commandes add column if not exists traite_le timestamptz;
commit;
