// POST /api/client-ouvrir avec l'en-tête Authorization: Bearer <jeton admin>
//   { email, societe, prenom?, telephone?, siret? }
// Kairn Admin, écran Clients (Ugo, 30/10/2026 : « je veux onboarder un client en deux clics ») :
// crée le compte de connexion s'il n'existe pas, ouvre l'espace (table clients), active les alertes par e-mail
// (client_prefs) et envoie l'invitation, où le client choisit son mot de passe. Rend aussi le lien, à copier si l'e-mail ne part pas.
import { send, readJson } from './_calendar.js';
import { SUPABASE_URL, SUPABASE_KEY, serviceKey, adminFetch, lienAcces, envoyerEmail } from './_auth-admin.js';
import { emailAcces } from './_email-kairn.js';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const clean = (v, max) => { const s = String(v ?? '').trim(); return s ? s.slice(0, max) : null; };

export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'method_not_allowed' });
  const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!token) return send(res, 401, { error: 'no_token' });
  if (!serviceKey()) return send(res, 503, { error: 'service_non_configure' });
  let body;
  try { body = await readJson(req); } catch { return send(res, 400, { error: 'bad_body' }); }
  const email = clean(body.email, 200)?.toLowerCase();
  const societe = clean(body.societe, 200);
  if (!email || !EMAIL.test(email) || !societe) return send(res, 400, { error: 'bad_params' });

  try {
    // L'appelant doit être admin : la question est posée avec son propre jeton.
    const a = await fetch(`${SUPABASE_URL}/rest/v1/rpc/is_admin`, { method: 'POST', headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: '{}' });
    if (!a.ok || (await a.json()) !== true) return send(res, 403, { error: 'forbidden' });

    // Compte : invitation (création) ; s'il existe déjà, lien pour (re)choisir son mot de passe.
    let l = await lienAcces(email, 'invite');
    let nouveau = true;
    if (!l.ok && (l.status === 422 || /exist|registered/i.test(String(l.code)))) { l = await lienAcces(email, 'recovery'); nouveau = false; }
    if (!l.ok || !l.userId) { console.error('[client-ouvrir] lien :', l.status, l.code); return send(res, 502, { error: 'compte_impossible' }); }

    const fiche = { user_id: l.userId, societe, prenom: clean(body.prenom, 100), telephone: clean(body.telephone, 40), siret: clean(body.siret, 20) };
    const c = await adminFetch('/rest/v1/clients?on_conflict=user_id', { method: 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=minimal' }, body: JSON.stringify(fiche) });
    if (!c.ok) { console.error('[client-ouvrir] clients :', c.status, JSON.stringify(c.body).slice(0, 200)); return send(res, 502, { error: 'fiche_impossible' }); }
    // Alertes par e-mail actives d'office, sur l'adresse du compte ; le client les change dans Compte et alertes.
    await adminFetch('/rest/v1/client_prefs?on_conflict=user_id', { method: 'POST', headers: { Prefer: 'resolution=ignore-duplicates,return=minimal' }, body: JSON.stringify({ user_id: l.userId, alerte_email: true, email }) });

    let envoye = false;
    try {
      // Toujours une invitation « première connexion », même pour un compte qui existait déjà.
      const m = emailAcces({ mode: 'invite', prenom: fiche.prenom, societe, lien: l.lien });
      envoye = await envoyerEmail(email, m.sujet, m.texte, m.html);
    } catch (err) { console.error('[client-ouvrir] e-mail :', err.message); }
    return send(res, 200, { ok: true, nouveau, email_envoye: envoye, lien: l.lien });
  } catch (err) {
    console.error('[client-ouvrir]', err.message);
    return send(res, 502, { error: 'ouverture_impossible' });
  }
}
