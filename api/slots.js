// GET /api/slots?month=2026-09 → créneaux libres du mois, groupés par jour (heure de Paris).
import { CONFIG, candidateSlots, removeBusy, fetchBusy, zonedDateKey, isDemo, send } from './_calendar.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return send(res, 405, { error: 'method_not_allowed' });
  const url = new URL(req.url, 'http://localhost');
  const m = /^(\d{4})-(\d{2})$/.exec(url.searchParams.get('month') || '');
  if (!m) return send(res, 400, { error: 'bad_month' });
  const year = +m[1];
  const month = +m[2];

  try {
    let slots = candidateSlots(year, month);
    if (slots.length) {
      if (isDemo()) {
        // Démo locale : on retire un créneau sur trois pour simuler un agenda occupé.
        slots = slots.filter((_, i) => i % 3 !== 1);
      } else {
        const busy = await fetchBusy(slots[0], new Date(slots[slots.length - 1].getTime() + CONFIG.slotMinutes * 60e3));
        slots = removeBusy(slots, busy);
      }
    }
    const days = {};
    for (const s of slots) (days[zonedDateKey(s)] ||= []).push(s.toISOString());
    return send(res, 200, { timeZone: CONFIG.timeZone, slotMinutes: CONFIG.slotMinutes, demo: isDemo(), days });
  } catch (err) {
    const status = err.message === 'not_configured' ? 503 : 502;
    return send(res, status, { error: err.message });
  }
}
