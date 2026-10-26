// GET /api/keepalive : appelé chaque jour par Vercel (vercel.json, « crons »).
// Supabase met en pause un projet gratuit après 7 jours sans activité ; la base « kairn » s'est arrêtée ainsi avant le 26/10/2026,
// ce qui aurait fait perdre les numéros du module de réservation. Une lecture par jour suffit à la garder active.
import { send } from './_calendar.js';

const SUPABASE_URL = 'https://bmqvlwdbwfnafuovzzhi.supabase.co';
const SUPABASE_KEY = 'sb_publishable_xyIez0a8masZaN3RM_GQIw_e4KyILCV';

export default async function handler(req, res) {
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/leads_site?select=id&limit=1`, { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } });
    if (!r.ok) throw new Error(`supabase_${r.status}`);
    return send(res, 200, { ok: true });
  } catch (err) {
    console.error('[keepalive] base injoignable :', err.message);
    return send(res, 502, { error: err.message });
  }
}
