// Accès « service » à la base kairn pour les fonctions serveur qui gèrent les comptes clients.
// Variable Vercel : SUPABASE_SERVICE_ROLE_KEY (clé secrète du projet, Settings, API keys). Elle ne quitte jamais le serveur.
// Accepte une clé secrète récente (sb_secret_…, en-tête apikey seul) ou l'ancienne clé service_role (JWT, aussi en Bearer).
import nodemailer from 'nodemailer';

export const SUPABASE_URL = 'https://bmqvlwdbwfnafuovzzhi.supabase.co';
export const SUPABASE_KEY = 'sb_publishable_xyIez0a8masZaN3RM_GQIw_e4KyILCV';
export const SITE = 'https://www.kairnagency.com';

export const serviceKey = () => process.env.SUPABASE_SERVICE_ROLE_KEY || '';

function headers(extra = {}) {
  const k = serviceKey();
  return { apikey: k, ...(k.startsWith('ey') ? { Authorization: `Bearer ${k}` } : {}), 'Content-Type': 'application/json', ...extra };
}

export async function adminFetch(path, init = {}) {
  const r = await fetch(`${SUPABASE_URL}${path}`, { ...init, headers: headers(init.headers) });
  const text = await r.text();
  let body = null;
  try { body = text ? JSON.parse(text) : null; } catch { body = text; }
  return { ok: r.ok, status: r.status, body };
}

// Lien d'accès à usage unique, posé sur le site (pas de redirection Supabase à configurer) :
// la page /espace/bienvenue l'échange contre une session (verifyOtp), puis le client choisit son mot de passe.
// type « invite » crée le compte s'il n'existe pas ; « recovery » sert à un compte qui existe déjà.
export async function lienAcces(email, type) {
  const r = await adminFetch('/auth/v1/admin/generate_link', { method: 'POST', body: JSON.stringify({ type, email }) });
  if (!r.ok) return { ok: false, status: r.status, code: r.body?.error_code || r.body?.code || r.body?.msg || r.body?.message };
  const b = r.body || {};
  const p = b.properties || b;
  const user = b.user || b;
  if (!p.hashed_token) return { ok: false, status: 500, code: 'pas_de_jeton' };
  const q = new URLSearchParams({ token_hash: p.hashed_token, type: p.verification_type || type });
  return { ok: true, userId: user.id, lien: `${SITE}/espace/bienvenue?${q}` };
}

// E-mail envoyé par Zoho (variables ZOHO_SMTP_USER, ZOHO_SMTP_PASS). Rend false si Zoho n'est pas configuré.
export async function envoyerEmail(to, subject, lignes) {
  const user = process.env.ZOHO_SMTP_USER;
  const pass = process.env.ZOHO_SMTP_PASS;
  if (!user || !pass) return false;
  const transport = nodemailer.createTransport({ host: process.env.ZOHO_SMTP_HOST || 'smtp.zoho.eu', port: 465, secure: true, auth: { user, pass } });
  await transport.sendMail({ from: `Kairn <${user}>`, to, subject, text: lignes.join('\n') });
  return true;
}
