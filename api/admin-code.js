// Code de connexion de Kairn Admin sur un nouvel appareil (Ugo, 31/10/2026 : « envoie-moi le code via Telegram »).
//   POST /api/admin-code { etape: 'envoyer' }            avec Authorization: Bearer <jeton> : code à 6 chiffres sur Telegram.
//   POST /api/admin-code { etape: 'verifier', code }     : rend { cle }, la clé de l'appareil, connue 30 jours.
// Le navigateur garde la clé (localStorage) et l'envoie dans l'en-tête x-kairn-appareil ; la base n'en garde que
// l'empreinte (table admin_appareils) et is_admin() l'exige (supabase/2026-10-31-securite-admin.sql).
// Code valable 10 minutes, 5 essais, un envoi par minute au plus. Alerte Telegram à chaque appareil ajouté.
// Variables Vercel : SUPABASE_SERVICE_ROLE_KEY, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID.
import crypto from 'node:crypto';
import { send, readJson } from './_calendar.js';
import { telegram } from './_telegram.js';
import { SUPABASE_URL, SUPABASE_KEY, serviceKey, adminFetch } from './_auth-admin.js';

const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
const egal = (a, b) => a.length === b.length && crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
const eq = (v) => encodeURIComponent(v);

function appareil(ua) {
  const s = String(ua || '');
  const os = /iPhone/.test(s) ? 'iPhone' : /iPad/.test(s) ? 'iPad' : /Android/.test(s) ? 'Android' : /Mac OS X/.test(s) ? 'Mac' : /Windows/.test(s) ? 'Windows' : 'Appareil';
  const nav = /Edg\//.test(s) ? 'Edge' : /Chrome\//.test(s) ? 'Chrome' : /Firefox\//.test(s) ? 'Firefox' : /Safari\//.test(s) ? 'Safari' : 'navigateur';
  return `${os} · ${nav}`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'method_not_allowed' });
  const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!token) return send(res, 401, { error: 'no_token' });
  if (!serviceKey()) return send(res, 503, { error: 'service_non_configure' });
  let body;
  try { body = await readJson(req); } catch { return send(res, 400, { error: 'bad_body' }); }

  try {
    // Mot de passe déjà vérifié par Supabase : la session doit être valide et son e-mail dans admins.
    const u = await fetch(`${SUPABASE_URL}/auth/v1/user`, { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}` } });
    if (!u.ok) return send(res, 401, { error: 'bad_token' });
    const email = String((await u.json()).email || '').toLowerCase();
    const a = await adminFetch(`/rest/v1/admins?select=email&email=eq.${eq(email)}`);
    if (!email || !Array.isArray(a.body) || !a.body.length) return send(res, 403, { error: 'forbidden' });

    if (body.etape === 'envoyer') {
      const r = await adminFetch(`/rest/v1/admin_codes?select=cree_le&email=eq.${eq(email)}`);
      const avant = Array.isArray(r.body) ? r.body[0] : null;
      if (avant && Date.now() - new Date(avant.cree_le).getTime() < 60e3) return send(res, 429, { error: 'trop_tot' });
      const code = String(crypto.randomInt(0, 1e6)).padStart(6, '0');
      const w = await adminFetch('/rest/v1/admin_codes?on_conflict=email', { method: 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
        body: JSON.stringify({ email, code_hash: sha(`${email}:${code}`), essais: 0, cree_le: new Date().toISOString(), expire_le: new Date(Date.now() + 10 * 60e3).toISOString() }) });
      if (!w.ok) { console.error('[admin-code] enregistrement :', w.status, JSON.stringify(w.body).slice(0, 200)); return send(res, 502, { error: 'code_impossible' }); }
      const sent = await telegram(`🔐 Code Kairn Admin : ${code}\n${appareil(req.headers['user-agent'])} demande l'accès. Valable 10 minutes.\nSi ce n'est pas vous : changez votre mot de passe.`);
      return sent ? send(res, 200, { ok: true }) : send(res, 502, { error: 'telegram_echec' });
    }

    if (body.etape === 'verifier') {
      const code = String(body.code || '').replace(/\s/g, '');
      if (!/^\d{6}$/.test(code)) return send(res, 400, { error: 'bad_code' });
      const r = await adminFetch(`/rest/v1/admin_codes?select=*&email=eq.${eq(email)}`);
      const c = Array.isArray(r.body) ? r.body[0] : null;
      if (!c || new Date(c.expire_le) < new Date() || c.essais >= 5) return send(res, 410, { error: 'code_expire' });
      await adminFetch(`/rest/v1/admin_codes?email=eq.${eq(email)}`, { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ essais: c.essais + 1 }) });
      if (!egal(sha(`${email}:${code}`), c.code_hash)) return send(res, 403, { error: 'code_faux', reste: Math.max(0, 4 - c.essais) });
      await adminFetch(`/rest/v1/admin_codes?email=eq.${eq(email)}`, { method: 'DELETE' });
      const cle = crypto.randomBytes(32).toString('hex');
      const nom = appareil(req.headers['user-agent']);
      const w = await adminFetch('/rest/v1/admin_appareils', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ email, cle_hash: sha(cle), nom }) });
      if (!w.ok) { console.error('[admin-code] appareil :', w.status, JSON.stringify(w.body).slice(0, 200)); return send(res, 502, { error: 'appareil_impossible' }); }
      await telegram(`✅ Nouvel appareil connu sur Kairn Admin : ${nom}, pour 30 jours.\nSi ce n'est pas vous : retirez-le dans Kairn Admin, Appareils, et changez votre mot de passe.`);
      return send(res, 200, { ok: true, cle });
    }
    return send(res, 400, { error: 'bad_etape' });
  } catch (err) {
    console.error('[admin-code]', err.message);
    return send(res, 502, { error: 'admin_code_failed' });
  }
}
