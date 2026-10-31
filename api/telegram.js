// Réponses d'Ugo depuis Telegram (31/10/2026 : « que je puisse écrire par message la réponse et qu'eux le reçoivent
// sur leur plateforme directement »).
//   POST /api/telegram : appelé par Telegram (webhook). Ugo répond à une alerte de demande client (api/notif.js) :
//     le texte part dans la conversation du client (fonction ticket_repondre_kairn) ; « /fermer » clôt la demande.
//     Seuls les messages de la conversation d'Ugo (TELEGRAM_CHAT_ID) et portant le jeton secret du webhook sont acceptés.
//   POST /api/telegram?brancher=1 avec Authorization: Bearer <jeton admin> : déclare ce webhook auprès de Telegram (une fois).
// Variables Vercel : TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID (déjà là), SUPABASE_SERVICE_ROLE_KEY.
// Le jeton secret du webhook est dérivé du jeton du bot : aucune variable de plus.
import crypto from 'node:crypto';
import { send, readJson } from './_calendar.js';
import { SUPABASE_URL, SUPABASE_KEY, SITE, serviceKey, adminFetch } from './_auth-admin.js';

const BOT = () => process.env.TELEGRAM_BOT_TOKEN || '';
const CHAT = () => String(process.env.TELEGRAM_CHAT_ID || '');
export const secretWebhook = () => crypto.createHash('sha256').update(`kairn-webhook:${BOT()}`).digest('hex').slice(0, 48);

async function tg(method, payload) {
  const r = await fetch(`https://api.telegram.org/bot${BOT()}/${method}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  return r.json().catch(() => ({ ok: false }));
}
const dire = (texte, replyTo) => tg('sendMessage', { chat_id: CHAT(), text: texte, ...(replyTo ? { reply_to_message_id: replyTo } : {}), disable_web_page_preview: true });

async function brancher(req, res) {
  const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  const a = await fetch(`${SUPABASE_URL}/rest/v1/rpc/is_admin`, { method: 'POST', headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: '{}' });
  if (!token || !a.ok || (await a.json()) !== true) return send(res, 403, { error: 'forbidden' });
  if (!BOT() || !CHAT()) return send(res, 503, { error: 'telegram_non_configure' });
  if (!serviceKey()) return send(res, 503, { error: 'service_non_configure' });
  const r = await tg('setWebhook', { url: `${SITE}/api/telegram`, secret_token: secretWebhook(), allowed_updates: ['message'], drop_pending_updates: true });
  if (!r.ok) { console.error('[telegram] setWebhook :', r.description); return send(res, 502, { error: 'telegram_refuse', detail: r.description || '' }); }
  await dire('✅ Réponses branchées : répondez à une alerte de demande client pour lui écrire directement sur sa plateforme. « /fermer » en réponse clôt la demande.');
  return send(res, 200, { ok: true });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'method_not_allowed' });
  const url = new URL(req.url, SITE);
  if (url.searchParams.get('brancher')) return brancher(req, res);

  // Appel de Telegram : on répond toujours 200 (sinon Telegram renvoie le même message en boucle), sauf jeton faux.
  if (!BOT() || req.headers['x-telegram-bot-api-secret-token'] !== secretWebhook()) return send(res, 401, { error: 'bad_secret' });
  let update;
  try { update = await readJson(req); } catch { return send(res, 200, { ok: true }); }
  const m = update?.message;
  if (!m || String(m.chat?.id) !== CHAT() || !m.text) return send(res, 200, { ok: true });
  try {
    const cible = m.reply_to_message?.message_id;
    if (!cible) {
      await dire('Pour écrire à un client, répondez directement à son alerte (appui long ou glisser, puis Répondre).', m.message_id);
      return send(res, 200, { ok: true });
    }
    const lien = await adminFetch(`/rest/v1/telegram_liens?select=ticket_id&message_id=eq.${cible}`);
    const ticketId = Array.isArray(lien.body) ? lien.body[0]?.ticket_id : null;
    if (!ticketId) {
      await dire('Je ne retrouve pas la demande liée à ce message. Répondez à une alerte de demande client, ou répondez depuis Kairn Admin.', m.message_id);
      return send(res, 200, { ok: true });
    }
    const t = await adminFetch(`/rest/v1/tickets?select=sujet,statut,client_id&id=eq.${ticketId}`);
    const ticket = Array.isArray(t.body) ? t.body[0] : null;
    const c = ticket ? await adminFetch(`/rest/v1/clients?select=societe&user_id=eq.${ticket.client_id}`) : null;
    const societe = (Array.isArray(c?.body) && c.body[0]?.societe) || 'le client';
    const texte = m.text.trim();

    if (/^\/fermer\b/i.test(texte)) {
      await adminFetch(`/rest/v1/tickets?id=eq.${ticketId}`, { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ statut: 'ferme' }) });
      await dire(`🔒 Demande « ${ticket?.sujet || ''} » de ${societe} fermée.`, m.message_id);
      return send(res, 200, { ok: true });
    }
    const r = await adminFetch('/rest/v1/rpc/ticket_repondre_kairn', { method: 'POST', body: JSON.stringify({ p_ticket: ticketId, p_texte: texte }) });
    if (!r.ok) {
      console.error('[telegram] réponse :', r.status, JSON.stringify(r.body).slice(0, 200));
      await dire('❌ La réponse n’est pas partie. Réessayez, ou répondez depuis Kairn Admin.', m.message_id);
      return send(res, 200, { ok: true });
    }
    // Une demande fermée se rouvre quand Kairn y répond.
    if (ticket?.statut === 'ferme') await adminFetch(`/rest/v1/tickets?id=eq.${ticketId}`, { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ statut: 'ouvert' }) });
    await dire(`✅ Envoyé à ${societe}.`, m.message_id);
    return send(res, 200, { ok: true });
  } catch (err) {
    console.error('[telegram]', err.message);
    return send(res, 200, { ok: true });
  }
}
