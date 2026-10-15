// Accès aux données d'onboarding (base Supabase « kairn », bmqvlwdbwfnafuovzzhi, créée le 15/10/2026).
// Le client n'a que son lien secret (/onboarding/:token) : il passe par des fonctions SQL qui
// filtrent sur ce jeton (onboarding_get, onboarding_save…). Les admins (table admins) lisent tout
// après connexion. La clé ci-dessous est la clé publique du projet : elle est faite pour le navigateur.
import { createClient } from '@supabase/supabase-js';

const URL = 'https://bmqvlwdbwfnafuovzzhi.supabase.co';
const KEY = 'sb_publishable_xyIez0a8masZaN3RM_GQIw_e4KyILCV';
export const BUCKET = 'onboarding';

export const db = createClient(URL, KEY, { auth: { storageKey: 'kairn-onboarding-auth' } });

const local = (token) => `kairn-onboarding:${token}`;
export function readLocal(token) {
  try { return JSON.parse(localStorage.getItem(local(token)) || 'null'); } catch { return null; }
}
function writeLocal(token, value) {
  try { localStorage.setItem(local(token), JSON.stringify(value)); } catch { /* navigateur privé : pas de copie locale */ }
}

export async function load(token) {
  const { data, error } = await db.rpc('onboarding_get', { p_token: token });
  if (error) throw new Error('Le serveur ne répond pas. Réessayez dans un instant.');
  if (!data) throw new Error('Ce lien n’existe pas. Vérifiez qu’il est complet.');
  return data;
}

export async function save(token, answers, submit = false) {
  writeLocal(token, { data: answers, savedAt: Date.now() }); // copie de secours dans le navigateur
  const { data, error } = await db.rpc('onboarding_save', { p_token: token, p_data: answers, p_submit: submit });
  if (error) throw new Error(error.message || 'Enregistrement refusé.');
  return data;
}

const safe = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\w.-]+/g, '-').slice(-80);

export async function upload(token, fieldId, file) {
  const path = `${token}/${fieldId}/${Date.now().toString(36)}-${safe(file.name)}`;
  const { error } = await db.storage.from(BUCKET).upload(path, file, { contentType: file.type || undefined, upsert: false });
  if (error) throw new Error(`Envoi de ${file.name} refusé : ${error.message}`);
  const { data, error: e2 } = await db.rpc('onboarding_add_file', { p_token: token, p_field: fieldId, p_name: file.name, p_path: path, p_size: file.size });
  if (e2) throw new Error(e2.message);
  return data;
}

export async function removeFile(token, path) {
  const { data, error } = await db.rpc('onboarding_remove_file', { p_token: token, p_path: path });
  if (error) throw new Error(error.message);
  return data;
}
