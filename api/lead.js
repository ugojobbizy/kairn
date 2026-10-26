// POST /api/lead { id, phone, first_name?, company?, email?, slot?, utm_*?, website }
// Capture du prospect pendant la réservation, à la manière d'iClosed :
// étape 1 = numéro seul, étape 2 = prénom, société, e-mail, étape 3 = créneau.
// Chaque appel complète la même ligne (id tiré au hasard par le navigateur) dans la table leads_site
// de la base Supabase « kairn », via la fonction SQL site_lead_upsert (la table n'est pas lisible avec la clé publique).
// Un e-mail prévient Ugo au numéro (étape 1) puis aux coordonnées (étape 2), si Zoho est configuré.
import nodemailer from 'nodemailer';
import { send, readJson } from './_calendar.js';

const SUPABASE_URL = 'https://bmqvlwdbwfnafuovzzhi.supabase.co';
const SUPABASE_KEY = 'sb_publishable_xyIez0a8masZaN3RM_GQIw_e4KyILCV';
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const clean = (v, max) => {
  const s = String(v ?? '').trim();
  return s ? s.slice(0, max) : null;
};

async function upsert(row) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/site_lead_upsert`, {
    method: 'POST',
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(Object.fromEntries(Object.entries(row).map(([k, v]) => [`p_${k}`, v]))),
  });
  if (!r.ok) throw new Error(`supabase_${r.status}: ${(await r.text()).slice(0, 200)}`);
}

async function notify(subject, lines) {
  const user = process.env.ZOHO_SMTP_USER;
  const pass = process.env.ZOHO_SMTP_PASS;
  if (!user || !pass) {
    console.warn('[lead] e-mail non envoyé : ZOHO_SMTP_USER ou ZOHO_SMTP_PASS absent');
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

  const id = String(body.id || '');
  const phone = String(body.phone || '').replace(/[^\d+]/g, '');
  if (!UUID.test(id)) return send(res, 400, { error: 'bad_id' });
  if (phone.replace(/\D/g, '').length < 8 || phone.length > 20) return send(res, 400, { error: 'bad_phone' });
  const email = clean(body.email, 120);
  if (email && !EMAIL.test(email)) return send(res, 400, { error: 'bad_email' });
  const slot = body.slot ? new Date(body.slot) : null;
  if (slot && Number.isNaN(slot.getTime())) return send(res, 400, { error: 'bad_slot' });

  const row = {
    id,
    phone,
    first_name: clean(body.first_name, 80),
    company: clean(body.company, 120),
    email,
    slot: slot ? slot.toISOString() : null,
    utm_source: clean(body.utm_source, 120),
    utm_campaign: clean(body.utm_campaign, 120),
    utm_content: clean(body.utm_content, 120),
    page: clean(body.page, 200),
  };

  try {
    await upsert(row);
  } catch (err) {
    console.error('[lead] enregistrement refusé :', err.message);
    return send(res, 502, { error: 'store_failed' });
  }

  // Le créneau est déjà annoncé par Google Agenda : pas d'e-mail à l'étape 3.
  let mailed = false;
  if (!row.slot) {
    const step2 = row.first_name || row.company || row.email;
    try {
      mailed = await notify(
        step2 ? `Prospect site : ${row.first_name || ''} (${row.company || 'société non donnée'})` : `Nouveau numéro sur le site : ${phone}`,
        [
          step2 ? 'Le prospect a donné ses coordonnées (il n’a pas encore choisi de créneau).' : 'Un prospect a laissé son numéro (étape 1 de la réservation).',
          '',
          `Téléphone : ${phone}`,
          row.first_name && `Prénom : ${row.first_name}`,
          row.company && `Société : ${row.company}`,
          row.email && `E-mail : ${row.email}`,
          row.utm_source && `Source : ${[row.utm_source, row.utm_campaign, row.utm_content].filter(Boolean).join(' / ')}`,
          row.page && `Page : ${row.page}`,
        ],
      );
    } catch (err) {
      console.error('[lead] e-mail en échec :', err.message);
    }
  }
  return send(res, 200, { ok: true, mailed });
}
