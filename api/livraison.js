// GET /api/livraison : clé publique des notifications mobiles.
// POST /api/livraison avec l'en-tête Authorization: Bearer <jeton>
//   { commande, depuis }   Kairn Admin, juste après admin_livrer : alerte le client des contacts livrés depuis « depuis ».
//   { test: true }         Le client lui-même, depuis Mon compte : un faux contact envoyé sur ses propres canaux.
// Canaux (lot 3 de la refonte de l'espace, 30/10/2026) : e-mail (Zoho), notification mobile (Web Push), webhook du client.
// Tout est relu avec le jeton de l'appelant : l'admin lit tout, un client ne lit que ses propres préférences (RLS).
// Variables Vercel : ZOHO_SMTP_USER, ZOHO_SMTP_PASS (e-mail) ; VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY (push).
// Un canal non configuré est sauté et dit dans la réponse ; un canal qui échoue n'empêche pas les autres.
import nodemailer from 'nodemailer';
import webpush from 'web-push';
import { send, readJson } from './_calendar.js';

const SUPABASE_URL = 'https://bmqvlwdbwfnafuovzzhi.supabase.co';
const SUPABASE_KEY = 'sb_publishable_xyIez0a8masZaN3RM_GQIw_e4KyILCV';
const SITE = 'https://www.kairnagency.com';
const THEMES = { PAC: 'Pompe à chaleur', ITE: 'Isolation extérieure', PPV: 'Photovoltaïque' };
const UUID = /^[0-9a-f-]{36}$/i;

async function rest(path, token, init = {}) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, { ...init, headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...(init.headers || {}) } });
  if (!r.ok) throw new Error(`supabase_${r.status}`);
  return r.status === 204 ? null : r.json();
}

// Contenu commun aux trois canaux.
export function resume(leads) {
  const n = leads.length;
  const t = THEMES[leads[0]?.thematique] || 'votre thématique';
  return {
    titre: n === 1 ? 'Nouveau contact à appeler' : `${n} nouveaux contacts à appeler`,
    corps: n === 1 ? `${[leads[0].prenom, leads[0].nom].filter(Boolean).join(' ') || 'Un particulier'} · ${t} · ${leads[0].code_postal || ''}`.trim() : `${t} : rappelez-les pendant qu'ils attendent votre appel.`,
  };
}

// Charge utile du webhook : un objet par contact, champs stables (clés en anglais pour Zapier, Make et les CRM).
export function payload(leads, test = false) {
  return {
    event: test ? 'test' : 'leads.delivered',
    sent_at: new Date().toISOString(),
    leads: leads.map((l) => ({
      id: l.id, delivered_at: l.livre_le, topic: l.thematique, topic_label: THEMES[l.thematique] || l.thematique,
      first_name: l.prenom, last_name: l.nom, phone: l.telephone, email: l.email, postal_code: l.code_postal, city: l.ville,
      occupancy: l.statut_occupation, housing: l.type_logement, heating: l.chauffage, surface: l.surface,
    })),
  };
}

async function viaEmail(prefs, leads, r) {
  const user = process.env.ZOHO_SMTP_USER;
  const pass = process.env.ZOHO_SMTP_PASS;
  if (!user || !pass) return 'non_configure';
  const { titre } = resume(leads);
  const lignes = leads.slice(0, 20).map((l) => `• ${[l.prenom, l.nom].filter(Boolean).join(' ')} · ${l.telephone || ''} · ${l.code_postal || ''} ${l.ville || ''} · ${THEMES[l.thematique] || l.thematique}`);
  const transport = nodemailer.createTransport({ host: process.env.ZOHO_SMTP_HOST || 'smtp.zoho.eu', port: 465, secure: true, auth: { user, pass } });
  await transport.sendMail({
    from: `Kairn <${user}>`, to: prefs.email, subject: titre,
    text: [`${titre}.`, '', ...lignes, leads.length > 20 ? `… et ${leads.length - 20} autres.` : '', '', `Appelez-les depuis votre espace : ${SITE}/espace`, '', 'Plus vous rappelez vite, plus ça décroche.', r.test ? '\n(Ceci est un e-mail de test.)' : ''].filter((x) => x !== null).join('\n'),
  });
  return 'envoye';
}

async function viaPush(subs, leads, token, r) {
  const pub = process.env.VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  if (!pub || !priv) return 'non_configure';
  if (!subs.length) return 'aucun_appareil';
  webpush.setVapidDetails('mailto:contact@kairnagency.com', pub, priv);
  const { titre, corps } = resume(leads);
  const msg = JSON.stringify({ title: r.test ? `Test · ${titre}` : titre, body: corps, url: '/espace' });
  let ok = 0;
  for (const s of subs) {
    try {
      await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, msg, { TTL: 3600, urgency: 'high' });
      ok += 1;
    } catch (err) {
      // Abonnement expiré : on le retire pour ne plus le tenter.
      if (err.statusCode === 404 || err.statusCode === 410) await rest(`push_abonnements?id=eq.${s.id}`, token, { method: 'DELETE' }).catch(() => {});
      else console.error('[livraison] push refusé :', err.statusCode, String(err.body || '').slice(0, 200));
    }
  }
  return ok ? `envoye_${ok}` : 'echec';
}

async function viaWebhook(prefs, leads, r) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 6000);
  try {
    const w = await fetch(prefs.webhook_url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'User-Agent': 'Kairn-Webhook/1' }, body: JSON.stringify(payload(leads, r.test)), signal: ctrl.signal, redirect: 'error' });
    return w.ok ? 'envoye' : `refuse_${w.status}`;
  } finally { clearTimeout(t); }
}

export default async function handler(req, res) {
  // GET : clé publique VAPID, lue par l'espace client pour abonner un appareil aux notifications.
  if (req.method === 'GET') return send(res, 200, { vapid: process.env.VAPID_PUBLIC_KEY || null });
  if (req.method !== 'POST') return send(res, 405, { error: 'method_not_allowed' });
  const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!token) return send(res, 401, { error: 'no_token' });
  let body;
  try { body = await readJson(req); } catch { return send(res, 400, { error: 'bad_body' }); }

  try {
    const u = await fetch(`${SUPABASE_URL}/auth/v1/user`, { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}` } });
    if (!u.ok) return send(res, 401, { error: 'bad_token' });
    const me = await u.json();

    let clientId; let leads; const r = { test: Boolean(body.test) };
    if (r.test) {
      clientId = me.id;
      leads = [{ id: '00000000-0000-0000-0000-000000000000', livre_le: new Date().toISOString(), thematique: 'PAC', prenom: 'Contact', nom: 'Test', telephone: '06 00 00 00 00', email: 'test@exemple.fr', code_postal: '33000', ville: 'Bordeaux', statut_occupation: 'Propriétaire', type_logement: 'Maison', chauffage: 'Gaz', surface: '110 à 150 m²' }];
    } else {
      const admin = await rest('rpc/is_admin', token, { method: 'POST', body: '{}' });
      if (admin !== true) return send(res, 403, { error: 'forbidden' });
      const commande = String(body.commande || '');
      const depuis = new Date(body.depuis || 0);
      if (!UUID.test(commande) || Number.isNaN(depuis.getTime())) return send(res, 400, { error: 'bad_params' });
      const [c] = await rest(`commandes?select=user_id&id=eq.${commande}`, token);
      if (!c?.user_id) return send(res, 404, { error: 'not_found' });
      clientId = c.user_id;
      leads = await rest(`leads?select=*&commande_id=eq.${commande}&livre_le=gte.${encodeURIComponent(depuis.toISOString())}&order=livre_le.desc`, token);
      if (!leads.length) return send(res, 200, { ok: true, leads: 0 });
    }

    const [prefs] = await rest(`client_prefs?select=*&user_id=eq.${clientId}`, token);
    const out = { leads: leads.length, email: 'desactive', push: 'desactive', webhook: 'aucun' };
    if (!prefs) return send(res, 200, { ok: true, ...out, prefs: 'aucune' });
    const subs = prefs.alerte_push ? await rest(`push_abonnements?select=id,endpoint,p256dh,auth&user_id=eq.${clientId}`, token) : [];
    const canal = (k, run) => run().then((v) => { out[k] = v; }, (err) => { out[k] = 'echec'; console.error(`[livraison] ${k} :`, err.message); });
    await Promise.all([
      prefs.alerte_email && prefs.email && canal('email', () => viaEmail(prefs, leads, r)),
      prefs.alerte_push && canal('push', () => viaPush(subs, leads, token, r)),
      prefs.webhook_url && canal('webhook', () => viaWebhook(prefs, leads, r)),
    ]);
    return send(res, 200, { ok: true, ...out });
  } catch (err) {
    console.error('[livraison]', err.message);
    return send(res, 502, { error: 'livraison_failed' });
  }
}
