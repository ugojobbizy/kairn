// POST /api/mot-de-passe { email, website }
// « Mot de passe oublié » de l'espace client : envoie par e-mail un lien pour choisir un nouveau mot de passe,
// seulement si l'adresse correspond à un compte client. La réponse est toujours la même : on ne révèle pas qui est client.
import { send, readJson } from './_calendar.js';
import { serviceKey, adminFetch, lienAcces, envoyerEmail } from './_auth-admin.js';
import { emailAcces } from './_email-kairn.js';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'method_not_allowed' });
  let body;
  try { body = await readJson(req); } catch { return send(res, 400, { error: 'bad_body' }); }
  if (body.website) return send(res, 200, { ok: true });
  const email = String(body.email || '').trim().toLowerCase().slice(0, 200);
  if (!EMAIL.test(email)) return send(res, 400, { error: 'bad_email' });
  if (!serviceKey()) return send(res, 503, { error: 'service_non_configure' });
  try {
    const l = await lienAcces(email, 'recovery');
    if (l.ok && l.userId) {
      const c = await adminFetch(`/rest/v1/clients?select=prenom&user_id=eq.${l.userId}`);
      const fiche = Array.isArray(c.body) ? c.body[0] : null;
      if (fiche) {
        const m = emailAcces({ mode: 'recovery', prenom: fiche.prenom, lien: l.lien });
        await envoyerEmail(email, m.sujet, m.texte, m.html);
      }
    }
  } catch (err) { console.error('[mot-de-passe]', err.message); }
  return send(res, 200, { ok: true });
}
