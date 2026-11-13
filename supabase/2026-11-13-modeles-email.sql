-- Modèles d'e-mail de l'espace client (Ugo, 13/11/2026 : « quand je clique sur E-mail, je veux que ça ouvre plusieurs
-- modèles [...] plus un onglet où il peut créer lui-même son modèle »). Même table que les modèles de SMS
-- (supabase/2026-11-12-relance-leads.sql) : une colonne canal ('sms' ou 'email') et un objet pour l'e-mail.
-- N'ajoute que des colonnes et élargit la longueur permise du texte (640 → 3 000 caractères, un e-mail est plus long).
-- Retour arrière : voir la fin du fichier.

alter table public.sms_modeles add column if not exists canal text not null default 'sms' check (canal in ('sms', 'email'));
alter table public.sms_modeles add column if not exists objet text check (objet is null or char_length(objet) <= 150);
alter table public.sms_modeles drop constraint if exists sms_modeles_texte_check;
alter table public.sms_modeles add constraint sms_modeles_texte_check check (char_length(btrim(texte)) between 1 and 3000);
create index if not exists sms_modeles_canal on public.sms_modeles (user_id, canal, ordre);

-- ─ Retour arrière (à lancer seulement en cas de besoin) ─────────
-- delete from public.sms_modeles where canal = 'email';
-- drop index if exists public.sms_modeles_canal;
-- alter table public.sms_modeles drop constraint if exists sms_modeles_texte_check;
-- alter table public.sms_modeles add constraint sms_modeles_texte_check check (char_length(btrim(texte)) between 1 and 640);
-- alter table public.sms_modeles drop column if exists objet, drop column if exists canal;
