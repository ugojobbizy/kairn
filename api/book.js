// POST /api/book { start, name, phone, website } → crée l'événement dans Google Agenda.
import { CONFIG, candidateSlots, removeBusy, fetchBusy, createEvent, zonedDateKey, isDemo, send, readJson } from './_calendar.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'method_not_allowed' });
  let body;
  try { body = await readJson(req); } catch { return send(res, 400, { error: 'bad_body' }); }

  const name = String(body.name || '').trim();
  const phone = String(body.phone || '').replace(/[^\d+]/g, '');
  // Champ piège invisible : un humain le laisse vide.
  if (body.website) return send(res, 200, { ok: true });
  if (name.length < 2 || name.length > 80) return send(res, 400, { error: 'bad_name' });
  if (phone.replace(/\D/g, '').length < 8 || phone.length > 20) return send(res, 400, { error: 'bad_phone' });

  const start = new Date(body.start);
  if (Number.isNaN(start.getTime())) return send(res, 400, { error: 'bad_start' });

  try {
    // Le créneau doit faire partie des créneaux proposés et être encore libre.
    const [y, m] = zonedDateKey(start).split('-').map(Number);
    let valid = candidateSlots(y, m).filter((s) => s.getTime() === start.getTime());
    if (!valid.length) return send(res, 409, { error: 'slot_unavailable' });
    if (!isDemo()) {
      valid = removeBusy(valid, await fetchBusy(start, new Date(start.getTime() + CONFIG.slotMinutes * 60e3)));
      if (!valid.length) return send(res, 409, { error: 'slot_taken' });
      await createEvent({ start, name, phone });
    }
    return send(res, 200, { ok: true, start: start.toISOString(), demo: isDemo() });
  } catch (err) {
    const status = err.message === 'not_configured' ? 503 : 502;
    return send(res, status, { error: err.message });
  }
}
