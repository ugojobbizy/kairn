// POST /api/notif { type: 'commande' | 'ticket', id } avec l'en-tête Authorization: Bearer <jeton du client>
// Alerte Telegram d'Ugo quand un client passe commande (pré-commande ou Leads Shop) ou ouvre / relance un ticket
// (Ugo, 29/10/2026 : « je dois instantanément recevoir une notification sur Telegram »).
// L'objet est relu avec le jeton du client : il ne peut signaler que ses propres commandes et tickets (RLS).
// Variables Vercel : TELEGRAM_BOT_TOKEN (bot créé avec @BotFather), TELEGRAM_CHAT_ID (conversation d'Ugo).
import { send, readJson } from './_calendar.js';
import { telegram } from './_telegram.js';
import { serviceKey, adminFetch } from './_auth-admin.js';
import crypto from 'node:crypto';
import { rapportTrafic, reglage } from './_trafic.js';

const CATEGORIES = { bug: '🐞 Bug', erreur: '⚠️ Erreur', suggestion: '💡 Suggestion', question: '💬 Question' };

const SUPABASE_URL = 'https://bmqvlwdbwfnafuovzzhi.supabase.co';
const SUPABASE_KEY = 'sb_publishable_xyIez0a8masZaN3RM_GQIw_e4KyILCV';
const SITE = 'https://www.kairnagency.com';
const THEMES = { PAC: 'Pompe à chaleur', ITE: 'Isolation extérieure', PPV: 'Photovoltaïque' };

async function rest(path, token) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}` } });
  if (!r.ok) throw new Error(`supabase_${r.status}`);
  return r.json();
}

// Agent de contenu (22/11/2026) : en-tête x-agent-jeton, dont l'empreinte sha256 est rangée dans reglages_serveur
// (agent_jeton_sha256 ; la variable Vercel n'a pas pu être créée le 22/11).
// { action: 'rapport', jours } renvoie les chiffres agrégés du trafic ; { action: 'telegram', texte } prévient Ugo.
// Logé ici car le forfait Vercel bloque à 12 fonctions (constat du 13/11).
async function agentOk(req) {
  const recu = String(req.headers['x-agent-jeton'] || '');
  if (recu.length < 32) return false;
  const attendu = await reglage('agent_jeton_sha256');
  if (!attendu) return false;
  const h = crypto.createHash('sha256').update(recu).digest('hex');
  return h.length === attendu.length && crypto.timingSafeEqual(Buffer.from(h), Buffer.from(attendu));
}

async function agent(req, res) {
  if (!(await agentOk(req))) return send(res, 401, { error: 'bad_agent_token' });
  let body;
  try { body = await readJson(req); } catch { return send(res, 400, { error: 'bad_body' }); }
  try {
    if (body.action === 'rapport') return send(res, 200, await rapportTrafic(body.jours));
    if (body.action === 'telegram') {
      const texte = String(body.texte || '').trim().slice(0, 3900);
      if (!texte) return send(res, 400, { error: 'empty' });
      return send(res, 200, { ok: true, sent: Boolean(await telegram(`🤖 Agent contenu\n${texte}`)) });
    }
    return send(res, 400, { error: 'bad_action' });
  } catch (err) {
    console.error('[notif/agent]', err.message);
    return send(res, 502, { error: 'agent_failed', detail: err.message.slice(0, 200) });
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'method_not_allowed' });
  if (req.headers['x-agent-jeton']) return agent(req, res);
  const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!token) return send(res, 401, { error: 'no_token' });
  let body;
  try { body = await readJson(req); } catch { return send(res, 400, { error: 'bad_body' }); }
  const id = String(body.id || '');
  if (!/^[0-9a-f-]{36}$/i.test(id)) return send(res, 400, { error: 'bad_id' });

  try {
    const u = await fetch(`${SUPABASE_URL}/auth/v1/user`, { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}` } });
    if (!u.ok) return send(res, 401, { error: 'bad_token' });
    const user = await u.json();
    const [client] = await rest(`clients?select=societe,prenom,telephone&user_id=eq.${user.id}`, token);
    const qui = `${client?.societe || user.email}${client?.prenom ? ` (${client.prenom})` : ''}`;
    let text;
    if (body.type === 'commande') {
      const [c] = await rest(`commandes?select=type,thematique,volume,zone,montant_ht,bdc_numero&id=eq.${id}`, token);
      if (!c) return send(res, 404, { error: 'not_found' });
      text = c.type === 'shop'
        ? `🛒 Achat Leads Shop\n${qui}\n${c.volume} lead(s) ${THEMES[c.thematique] || c.thematique}, ${c.montant_ht} € HT\n${c.bdc_numero}\n${SITE}/gestion/commandes`
        : `🆕 Nouvelle pré-commande\n${qui}\n${c.volume} leads ${THEMES[c.thematique] || c.thematique}\nZone : ${c.zone || 'non précisée'}\nÀ valider et lancer : ${SITE}/gestion/campagnes`;
    } else if (body.type === 'ticket') {
      const [t] = await rest(`tickets?select=sujet,urgent,categorie&id=eq.${id}`, token);
      if (!t) return send(res, 404, { error: 'not_found' });
      const [m] = await rest(`ticket_messages?select=texte&ticket_id=eq.${id}&order=created_at.desc&limit=1`, token);
      // Ugo répond en répondant à ce message dans Telegram (api/telegram.js) ; /fermer clôt la demande.
      text = `${t.urgent ? '🚨 URGENT · ' : ''}${CATEGORIES[t.categorie] || '💬 Message'} client\n${qui}${client?.telephone ? ` · ${client.telephone}` : ''}\n« ${t.sujet} »\n${(m?.texte || '').slice(0, 600)}\n\n↩️ Répondez à ce message pour écrire au client (/fermer pour clore).\n${SITE}/gestion/tickets`;
      const sent = await telegram(text);
      if (typeof sent === 'number' && serviceKey()) {
        await adminFetch('/rest/v1/telegram_liens', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ message_id: sent, ticket_id: id }) })
          .catch((err) => console.error('[notif] lien Telegram :', err.message));
      }
      return send(res, 200, { ok: true, sent: Boolean(sent) });
    } else return send(res, 400, { error: 'bad_type' });
    const sent = await telegram(text);
    return send(res, 200, { ok: true, sent: Boolean(sent) });
  } catch (err) {
    console.error('[notif]', err.message);
    return send(res, 502, { error: 'notif_failed' });
  }
}
