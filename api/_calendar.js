// Outils partagés des fonctions de réservation : réglages, fuseau horaire,
// accès Google Agenda par compte de service (JWT signé, sans dépendance).
import crypto from 'node:crypto';

export const CONFIG = {
  timeZone: 'Europe/Paris',
  workDays: [1, 2, 3, 4, 5], // lundi → vendredi
  dayStart: 9 * 60, // 9:00
  dayEnd: 18 * 60, // 18:00 (dernier créneau à 17:30)
  slotMinutes: 30,
  minNoticeHours: 12,
  horizonDays: 30,
};

// Mode démo : uniquement en local (activé par le serveur de dev Vite) quand Google n'est pas configuré.
export const isDemo = () =>
  process.env.KAIRN_BOOKING_DEMO === '1' && !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;

// ─ fuseau horaire ─
function tzOffsetMs(date, timeZone) {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
  const p = Object.fromEntries(dtf.formatToParts(date).map((x) => [x.type, x.value]));
  return Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second) - date.getTime();
}

export function zonedToUtc(y, m, d, minutes, timeZone = CONFIG.timeZone) {
  const guess = Date.UTC(y, m - 1, d, Math.floor(minutes / 60), minutes % 60);
  const off = tzOffsetMs(new Date(guess), timeZone);
  let t = guess - off;
  const off2 = tzOffsetMs(new Date(t), timeZone);
  if (off2 !== off) t = guess - off2;
  return new Date(t);
}

export function zonedDateKey(date, timeZone = CONFIG.timeZone) {
  return new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
}

// Créneaux théoriques (heures ouvrées) d'un mois, avant confrontation à l'agenda.
export function candidateSlots(year, month, now = new Date()) {
  const earliest = now.getTime() + CONFIG.minNoticeHours * 3600e3;
  const latest = now.getTime() + CONFIG.horizonDays * 86400e3;
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const slots = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const weekday = new Date(Date.UTC(year, month - 1, d)).getUTCDay();
    if (!CONFIG.workDays.includes(weekday)) continue;
    for (let min = CONFIG.dayStart; min + CONFIG.slotMinutes <= CONFIG.dayEnd; min += CONFIG.slotMinutes) {
      const start = zonedToUtc(year, month, d, min);
      if (start.getTime() >= earliest && start.getTime() <= latest) slots.push(start);
    }
  }
  return slots;
}

export function removeBusy(slots, busy) {
  const ranges = busy.map((b) => [Date.parse(b.start), Date.parse(b.end)]);
  const len = CONFIG.slotMinutes * 60e3;
  return slots.filter((s) => {
    const a = s.getTime();
    const b = a + len;
    return !ranges.some(([bs, be]) => a < be && b > bs);
  });
}

// ─ Google ─
let cachedToken = null;

async function accessToken() {
  if (cachedToken && cachedToken.exp > Date.now() + 60e3) return cachedToken.value;
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n');
  if (!email || !key) throw new Error('not_configured');
  const now = Math.floor(Date.now() / 1000);
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
  const unsigned = `${b64({ alg: 'RS256', typ: 'JWT' })}.${b64({
    iss: email,
    scope: 'https://www.googleapis.com/auth/calendar',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  })}`;
  const signature = crypto.createSign('RSA-SHA256').update(unsigned).sign(key).toString('base64url');
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${unsigned}.${signature}` }),
  });
  if (!r.ok) throw new Error(`google_auth_${r.status}`);
  const j = await r.json();
  cachedToken = { value: j.access_token, exp: Date.now() + j.expires_in * 1000 };
  return cachedToken.value;
}

const calendarId = () => process.env.GOOGLE_CALENDAR_ID;

export async function fetchBusy(timeMin, timeMax) {
  const token = await accessToken();
  const r = await fetch('https://www.googleapis.com/calendar/v3/freeBusy', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ timeMin: timeMin.toISOString(), timeMax: timeMax.toISOString(), timeZone: CONFIG.timeZone, items: [{ id: calendarId() }] }),
  });
  if (!r.ok) throw new Error(`google_freebusy_${r.status}`);
  const j = await r.json();
  const cal = j.calendars?.[calendarId()];
  if (!cal || cal.errors?.length) throw new Error('google_calendar_access');
  return cal.busy || [];
}

export async function createEvent({ start, name, phone }) {
  const token = await accessToken();
  const end = new Date(start.getTime() + CONFIG.slotMinutes * 60e3);
  const r = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId())}/events`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      summary: `Appel de découverte — ${name}`,
      description: `Réservé depuis kairn.agency\n\nNom : ${name}\nTéléphone : ${phone}`,
      start: { dateTime: start.toISOString(), timeZone: CONFIG.timeZone },
      end: { dateTime: end.toISOString(), timeZone: CONFIG.timeZone },
    }),
  });
  if (!r.ok) throw new Error(`google_event_${r.status}`);
  return r.json();
}

// ─ HTTP (compatible Vercel et serveur de dev Vite) ─
export function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

export async function readJson(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const raw = Buffer.concat(chunks).toString('utf8');
  if (raw.length > 5000) throw new Error('payload_too_large');
  return raw ? JSON.parse(raw) : {};
}
