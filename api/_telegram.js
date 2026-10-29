// Envoi d'un message Telegram à Ugo (bot @BotFather). Variables Vercel : TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID.
export async function telegram(text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) {
    console.warn('[notif] Telegram non configuré : TELEGRAM_BOT_TOKEN ou TELEGRAM_CHAT_ID absent');
    return false;
  }
  const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chat, text, disable_web_page_preview: true }),
  });
  if (!r.ok) console.error('[notif] Telegram a refusé :', r.status, (await r.text()).slice(0, 200));
  return r.ok;
}
