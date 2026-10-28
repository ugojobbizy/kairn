// POST /api/commande { souhait, societe, nom, email, telephone, thematique, volume, zone, siret?, page?, website }
// Formulaire « Commander » du site : enregistre la demande dans la table commandes de la base Supabase « kairn »
// par la fonction SQL site_commande_insert (la table n'est pas lisible avec la clé publique), puis prévient Ugo par e-mail si Zoho est configuré.
import nodemailer from 'nodemailer';
import { send, readJson } from './_calendar.js';

const SUPABASE_URL = 'https://bmqvlwdbwfnafuovzzhi.supabase.co';
const SUPABASE_KEY = 'sb_publishable_xyIez0a8masZaN3RM_GQIw_e4KyILCV';
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const SOUHAITS = { leads: 'Acheter des leads', accompagnement: 'Être accompagné' };
const THEMATIQUES = ['PAC', 'ITE', 'PPV', 'Autre'];
const VOLUMES = ['50', '100', '200', '+ de 200'];

const clean = (v, max) => {
  const s = String(v ?? '').trim();
  return s ? s.slice(0, max) : null;
};

async function notify(subject, lines) {
  const user = process.env.ZOHO_SMTP_USER;
  const pass = process.env.ZOHO_SMTP_PASS;
  if (!user || !pass) {
    console.warn('[commande] e-mail non envoyé : ZOHO_SMTP_USER ou ZOHO_SMTP_PASS absent');
    return false;
  }
  const transport = nodemailer.createTransport({ host: process.env.ZOHO_SMTP_HOST || 'smtp.zoho.eu', port: 465, secure: true, auth: { user, pass } });
  await transport.sendMail({ from: `Site Kairn <${user}>`, to: process.env.LEAD_NOTIFY_TO || user, subject, text: lines.filter(Boolean).join('\n') });
  return true;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'method_not_allowed' });
  let body;
  try { body = await readJson(req); } catch { return send(res, 400, { error: 'bad_body' }); }
  // Champ piège invisible : un humain le laisse vide.
  if (body.website) return send(res, 200, { ok: true });

  const souhait = String(body.souhait || '');
  if (!SOUHAITS[souhait]) return send(res, 400, { error: 'bad_souhait' });
  const telephone = String(body.telephone || '').replace(/[^\d+]/g, '');
  if (telephone.replace(/\D/g, '').length < 8 || telephone.length > 20) return send(res, 400, { error: 'bad_phone' });
  const email = clean(body.email, 120);
  if (!email || !EMAIL.test(email)) return send(res, 400, { error: 'bad_email' });
  const societe = clean(body.societe, 120);
  const nom = clean(body.nom, 120);
  if (!societe || !nom) return send(res, 400, { error: 'missing_fields' });
  const thematique = THEMATIQUES.includes(body.thematique) ? body.thematique : null;
  if (souhait === 'leads' && !thematique) return send(res, 400, { error: 'bad_thematique' });
  const volume = VOLUMES.includes(body.volume) ? body.volume : null;
  const siret = clean(String(body.siret || '').replace(/\s/g, ''), 20);
  if (siret && !/^\d{14}$/.test(siret)) return send(res, 400, { error: 'bad_siret' });

  const row = { souhait, societe, nom, email, telephone, thematique, volume, zone: clean(body.zone, 200), siret, page: clean(body.page, 200) };

  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/site_commande_insert`, {
      method: 'POST',
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(Object.entries(row).map(([k, v]) => [`p_${k}`, v]))),
    });
    if (!r.ok) throw new Error(`supabase_${r.status}: ${(await r.text()).slice(0, 200)}`);
  } catch (err) {
    console.error('[commande] enregistrement refusé :', err.message);
    return send(res, 502, { error: 'store_failed' });
  }

  let mailed = false;
  try {
    mailed = await notify(`Commande site : ${SOUHAITS[souhait]}${thematique ? ` ${thematique}` : ''} (${societe})`, [
      `${SOUHAITS[souhait]}`,
      '',
      `Société : ${societe}`,
      `Nom : ${nom}`,
      `E-mail : ${email}`,
      `Téléphone : ${telephone}`,
      thematique && `Thématique : ${thematique}`,
      volume && `Volume par semaine : ${volume}`,
      row.zone && `Zone : ${row.zone}`,
      siret && `SIRET : ${siret}`,
    ]);
  } catch (err) {
    console.error('[commande] e-mail en échec :', err.message);
  }
  return send(res, 200, { ok: true, mailed });
}
