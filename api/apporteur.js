// POST /api/apporteur : apporteurs d'affaires (Ugo, 13/11/2026). Une seule fonction pour deux actions
// (le forfait Vercel limite le nombre de fonctions serveur) :
//   { action: 'candidature', prenom, nom, societe?, email, telephone, siret?, message?, website }
//     page publique /devenir-apporteur : enregistrée par la fonction SQL site_candidature_apporteur
//     (table illisible avec la clé publique), puis alerte Telegram à Ugo, qui valide dans Kairn Admin.
//   { action: 'ouvrir', id } ou { action: 'ouvrir', email, nom, prenom?, societe?, telephone?, siret? }
//     Kairn Admin, avec l'en-tête Authorization: Bearer <jeton admin> : valide une candidature (ou renvoie l'accès),
//     ou crée directement un apporteur. Même schéma que api/client-ouvrir.js : crée le compte de connexion s'il
//     n'existe pas, relie la fiche apporteurs (user_id, statut actif) et envoie l'e-mail où il choisit son mot de passe.
//     Rend aussi le lien, à copier si l'e-mail ne part pas.
import { send, readJson } from './_calendar.js';
import { telegram } from './_telegram.js';
import { SUPABASE_URL, SUPABASE_KEY, serviceKey, adminFetch, lienAcces, envoyerEmail } from './_auth-admin.js';
import { emailAcces } from './_email-kairn.js';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const UUID = /^[0-9a-f-]{36}$/i;
const clean = (v, max) => { const s = String(v ?? '').trim(); return s ? s.slice(0, max) : null; };

export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'method_not_allowed' });
  let body;
  try { body = await readJson(req); } catch { return send(res, 400, { error: 'bad_body' }); }
  if (body.action === 'candidature') return candidature(req, res, body);
  if (body.action === 'ouvrir') return ouvrir(req, res, body);
  return send(res, 400, { error: 'bad_action' });
}

async function candidature(req, res, body) {
  // Champ piège invisible : un humain le laisse vide.
  if (body.website) return send(res, 200, { ok: true });

  const nom = clean(body.nom, 120);
  const prenom = clean(body.prenom, 100);
  if (!nom || !prenom) return send(res, 400, { error: 'missing_fields' });
  const email = clean(body.email, 200)?.toLowerCase();
  if (!email || !EMAIL.test(email)) return send(res, 400, { error: 'bad_email' });
  const telephone = String(body.telephone || '').replace(/[^\d+]/g, '');
  if (telephone.replace(/\D/g, '').length < 8 || telephone.length > 20) return send(res, 400, { error: 'bad_phone' });
  const siret = clean(String(body.siret || '').replace(/\s/g, ''), 20);
  if (siret && !/^\d{14}$/.test(siret)) return send(res, 400, { error: 'bad_siret' });
  const societe = clean(body.societe, 120);
  const message = clean(body.message, 1000);

  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/site_candidature_apporteur`, {
      method: 'POST',
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_prenom: prenom, p_nom: nom, p_societe: societe, p_email: email, p_telephone: telephone, p_siret: siret, p_message: message }),
    });
    if (!r.ok) { console.error('[apporteur-candidature]', r.status, (await r.text()).slice(0, 200)); return send(res, 502, { error: 'save_failed' }); }
  } catch (err) {
    console.error('[apporteur-candidature]', err.message);
    return send(res, 502, { error: 'save_failed' });
  }

  try {
    await telegram([
      '🤝 Candidature apporteur d’affaires',
      `${prenom} ${nom}${societe ? ` · ${societe}` : ''}`,
      `${telephone} · ${email}`,
      message ? `« ${message.slice(0, 300)} »` : null,
      'À valider : kairnagency.com/gestion/apporteurs',
    ].filter(Boolean).join('\n'));
  } catch (err) { console.error('[apporteur-candidature] telegram :', err.message); }
  return send(res, 200, { ok: true });
}

async function ouvrir(req, res, body) {
  const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!token) return send(res, 401, { error: 'no_token' });
  if (!serviceKey()) return send(res, 503, { error: 'service_non_configure' });
  try {
    const a = await fetch(`${SUPABASE_URL}/rest/v1/rpc/is_admin`, { method: 'POST', headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'x-kairn-appareil': String(req.headers['x-kairn-appareil'] || '') }, body: '{}' });
    if (!a.ok || (await a.json()) !== true) return send(res, 403, { error: 'forbidden' });

    // La fiche : existante (candidature) ou créée ici.
    let fiche;
    if (body.id) {
      if (!UUID.test(String(body.id))) return send(res, 400, { error: 'bad_params' });
      const f = await adminFetch(`/rest/v1/apporteurs?select=*&id=eq.${body.id}`);
      fiche = Array.isArray(f.body) ? f.body[0] : null;
      if (!fiche) return send(res, 404, { error: 'introuvable' });
    } else {
      const email = clean(body.email, 200)?.toLowerCase();
      const nom = clean(body.nom, 120);
      if (!email || !EMAIL.test(email) || !nom) return send(res, 400, { error: 'bad_params' });
      const deja = await adminFetch(`/rest/v1/apporteurs?select=*&email=eq.${encodeURIComponent(email)}`);
      fiche = Array.isArray(deja.body) ? deja.body[0] : null;
      if (!fiche) {
        const c = await adminFetch('/rest/v1/apporteurs', { method: 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify({ email, nom, prenom: clean(body.prenom, 100), societe: clean(body.societe, 120), telephone: clean(body.telephone, 40), siret: clean(body.siret, 20) }) });
        fiche = Array.isArray(c.body) ? c.body[0] : null;
        if (!c.ok || !fiche) { console.error('[apporteur-ouvrir] fiche :', c.status, JSON.stringify(c.body).slice(0, 200)); return send(res, 502, { error: 'fiche_impossible' }); }
      }
    }
    const email = String(fiche.email).toLowerCase();
    if (!EMAIL.test(email)) return send(res, 400, { error: 'bad_params' });

    // Compte : invitation (création) ; inscriptions fermées : création par l'API admin puis lien ; compte existant : lien.
    let l = await lienAcces(email, 'invite');
    let nouveau = true;
    if (!l.ok && /signup/i.test(String(l.code))) {
      const u = await adminFetch('/auth/v1/admin/users', { method: 'POST', body: JSON.stringify({ email, email_confirm: true }) });
      if (u.ok || u.status === 422) { l = await lienAcces(email, 'recovery'); nouveau = u.ok; }
    } else if (!l.ok && (l.status === 422 || /exist|registered/i.test(String(l.code)))) { l = await lienAcces(email, 'recovery'); nouveau = false; }
    if (!l.ok || !l.userId) { console.error('[apporteur-ouvrir] lien :', l.status, l.code); return send(res, 502, { error: 'compte_impossible' }); }

    // Un compte déjà client garde son espace client : on ne le transforme pas en apporteur sans le dire.
    const cl = await adminFetch(`/rest/v1/clients?select=user_id&user_id=eq.${l.userId}`);
    if (Array.isArray(cl.body) && cl.body.length) return send(res, 409, { error: 'deja_client' });

    const maj = await adminFetch(`/rest/v1/apporteurs?id=eq.${fiche.id}`, { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ user_id: l.userId, statut: 'actif', valide_le: fiche.valide_le || new Date().toISOString() }) });
    if (!maj.ok) { console.error('[apporteur-ouvrir] maj :', maj.status, JSON.stringify(maj.body).slice(0, 200)); return send(res, 502, { error: 'fiche_impossible' }); }

    let envoye = false;
    try {
      const m = emailAcces({ mode: 'invite', espace: 'apporteur', prenom: fiche.prenom, lien: l.lien });
      envoye = await envoyerEmail(email, m.sujet, m.texte, m.html);
    } catch (err) { console.error('[apporteur-ouvrir] e-mail :', err.message); }
    return send(res, 200, { ok: true, id: fiche.id, nouveau, email_envoye: envoye, lien: l.lien });
  } catch (err) {
    console.error('[apporteur-ouvrir]', err.message);
    return send(res, 502, { error: 'ouverture_impossible' });
  }
}
