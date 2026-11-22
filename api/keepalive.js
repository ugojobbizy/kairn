// GET /api/keepalive : appelé chaque jour par Vercel (vercel.json, « crons »).
// Supabase met en pause un projet gratuit après 7 jours sans activité ; la base « kairn » s'est arrêtée ainsi avant le 26/10/2026,
// ce qui aurait fait perdre les numéros du module de réservation. Une lecture par jour suffit à la garder active.
import { send } from './_calendar.js';
import { importerGsc, purgerVisites } from './_trafic.js';

const SUPABASE_URL = 'https://bmqvlwdbwfnafuovzzhi.supabase.co';
const SUPABASE_KEY = 'sb_publishable_xyIez0a8masZaN3RM_GQIw_e4KyILCV';

export default async function handler(req, res) {
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/leads_site?select=id&limit=1`, { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } });
    if (!r.ok) throw new Error(`supabase_${r.status}`);
  } catch (err) {
    console.error('[keepalive] base injoignable :', err.message);
    return send(res, 502, { error: err.message });
  }
  // Trafic (22/11/2026) : import quotidien de la Search Console et purge des visites de plus de 13 mois.
  // Réservé au cron Vercel (en-tête Authorization: Bearer CRON_SECRET) quand CRON_SECRET existe.
  const cron = !process.env.CRON_SECRET || req.headers.authorization === `Bearer ${process.env.CRON_SECRET}`;
  if (!cron) return send(res, 200, { ok: true });
  const out = { ok: true };
  try { out.gsc = await importerGsc(); } catch (err) { console.error('[keepalive] Search Console :', err.message); out.gsc = { error: err.message.slice(0, 200) }; }
  try { await purgerVisites(); } catch (err) { console.error('[keepalive] purge visites :', err.message); }
  return send(res, 200, out);
}
