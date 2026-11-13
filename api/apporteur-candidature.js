// POST /api/apporteur-candidature { prenom, nom, societe?, email, telephone, siret?, message?, website }
// Candidature d'apporteur d'affaires (page /devenir-apporteur, Ugo, 13/11/2026). Enregistrée par la fonction SQL
// site_candidature_apporteur (table illisible avec la clé publique), puis alerte Telegram à Ugo, qui valide dans Kairn Admin.
import { send, readJson } from './_calendar.js';
import { telegram } from './_telegram.js';
import { SUPABASE_URL, SUPABASE_KEY } from './_auth-admin.js';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const clean = (v, max) => { const s = String(v ?? '').trim(); return s ? s.slice(0, max) : null; };

export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'method_not_allowed' });
  let body;
  try { body = await readJson(req); } catch { return send(res, 400, { error: 'bad_body' }); }
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
