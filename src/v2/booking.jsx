import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BOOKING_URL, CONTACT_EMAIL } from '../config.js';

// Réservation en trois temps, à la manière d'iClosed :
// 1. le numéro seul, enregistré tout de suite (/api/lead) : on peut rappeler même sans réservation ;
// 2. prénom, société, e-mail, ajoutés à la même ligne ;
// 3. choix d'un créneau libre dans Google Agenda (via /api/slots et /api/book).

const TZ = 'Europe/Paris';
const COUNTRIES = [
  { code: 'FR', dial: '+33' },
  { code: 'BE', dial: '+32' },
  { code: 'CH', dial: '+41' },
  { code: 'LU', dial: '+352' },
  { code: 'CA', dial: '+1' },
];
const WEEKDAYS = ['lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.', 'dim.'];

const monthKey = (y, m) => `${y}-${String(m).padStart(2, '0')}`;
const dayKey = (y, m, d) => `${monthKey(y, m)}-${String(d).padStart(2, '0')}`;
const fmtTime = (iso) => new Intl.DateTimeFormat('fr-FR', { timeZone: TZ, hour: '2-digit', minute: '2-digit' }).format(new Date(iso));
const fmtLong = (iso) => new Intl.DateTimeFormat('fr-FR', { timeZone: TZ, weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }).format(new Date(iso));
const fmtDay = (key) => {
  const [y, m, d] = key.split('-').map(Number);
  return new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }).format(new Date(Date.UTC(y, m - 1, d)));
};
const todayParis = () => new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(new Date());

const newId = () => (crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
  const r = (Math.random() * 16) | 0;
  return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
}));

function getUtm() {
  try {
    const p = new URLSearchParams(window.location.search);
    return { utm_source: p.get('utm_source'), utm_campaign: p.get('utm_campaign'), utm_content: p.get('utm_content') };
  } catch { return {}; }
}

function Chevron({ dir }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={dir === 'left' ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'} />
    </svg>
  );
}

// title / intro : textes de l'en-tête du formulaire (la V2 de l'accueil passe ceux de l'appel avec Ugo, 29/10/2026).
export default function Booking({ title = 'Audit découverte Kairn', intro = ['Un premier échange pour parler de votre entreprise, de la façon dont vous trouvez vos clients aujourd’hui et de ce que vous aimeriez améliorer.', 'En visio, avec Ugo, fondateur de Kairn.'] }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ country: 'FR', phone: '', firstName: '', company: '', email: '', website: '' });
  const [leadId] = useState(newId);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const [today] = useState(todayParis);
  const [view, setView] = useState(() => { const [y, m] = todayParis().split('-').map(Number); return { y, m }; });
  const [slots, setSlots] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [day, setDay] = useState(null);
  const [slot, setSlot] = useState(null);
  const [booking, setBooking] = useState(false);
  const [bookError, setBookError] = useState('');
  const [done, setDone] = useState(null);

  const dial = COUNTRIES.find((c) => c.code === form.country).dial;
  const fullPhone = `${dial}${form.phone.replace(/\D/g, '').replace(/^0/, '')}`;

  // Créneaux du mois affiché
  useEffect(() => {
    const key = monthKey(view.y, view.m);
    if (slots[key]) return undefined;
    let cancelled = false;
    setLoading(true);
    setLoadError('');
    fetch(`/api/slots?month=${key}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((j) => { if (!cancelled) setSlots((s) => ({ ...s, [key]: j.days || {} })); })
      .catch(() => { if (!cancelled) setLoadError('Impossible de charger les disponibilités.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [view, slots]);

  const monthSlots = slots[monthKey(view.y, view.m)] || {};

  const grid = useMemo(() => {
    const first = new Date(Date.UTC(view.y, view.m - 1, 1)).getUTCDay(); // 0 = dimanche
    const offset = (first + 6) % 7; // semaine commençant le lundi
    const count = new Date(Date.UTC(view.y, view.m, 0)).getUTCDate();
    return [...Array(offset).fill(null), ...Array.from({ length: count }, (_, i) => i + 1)];
  }, [view]);

  const [ty, tm] = today.split('-').map(Number);
  const canPrev = view.y > ty || (view.y === ty && view.m > tm);
  const shiftMonth = (delta) => {
    setDay(null);
    setSlot(null);
    setView(({ y, m }) => {
      const t = m - 1 + delta;
      return { y: y + Math.floor(t / 12), m: ((t % 12) + 12) % 12 + 1 };
    });
  };
  const monthLabel = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(view.y, view.m - 1, 1)));

  const update = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: '' }));
  };

  const saveLead = async (extra) => {
    try {
      const r = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: leadId, phone: fullPhone, website: form.website, page: window.location.pathname, ...getUtm(), ...extra }),
      });
      if (!r.ok) throw new Error(String(r.status));
      return true;
    } catch (err) {
      // On laisse quand même avancer : le créneau réservé garde les coordonnées dans Google Agenda.
      console.error('Prospect non enregistré :', err.message);
      return false;
    }
  };

  const submitPhone = async (e) => {
    e.preventDefault();
    if (form.website) return; // champ piège rempli par un robot
    const digits = form.phone.replace(/\D/g, '');
    if (digits.length < 8 || digits.length > 15) {
      setErrors({ phone: 'Entrez un numéro de téléphone valide, par exemple 6 12 34 56 78.' });
      return;
    }
    setSaving(true);
    const ok = await saveLead({});
    if (ok && typeof window.fbq === 'function') { try { window.fbq('track', 'Lead'); } catch { /* pixel absent */ } }
    setSaving(false);
    setStep(2);
  };

  const submitDetails = async (e) => {
    e.preventDefault();
    const er = {};
    if (form.firstName.trim().length < 2) er.firstName = 'Indiquez votre prénom.';
    if (form.company.trim().length < 2) er.company = 'Indiquez le nom de votre société.';
    // E-mail facultatif (Ugo, 29/10/2026) : vérifié seulement s'il est rempli.
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) er.email = 'Entrez une adresse e-mail valide.';
    setErrors(er);
    if (Object.keys(er).length) return;
    setSaving(true);
    await saveLead({ first_name: form.firstName.trim(), company: form.company.trim(), email: form.email.trim() });
    setSaving(false);
    setStep(3);
  };

  const confirm = async () => {
    if (!slot) return;
    setBooking(true);
    setBookError('');
    try {
      const r = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ start: slot, name: form.firstName.trim(), company: form.company.trim(), email: form.email.trim(), phone: fullPhone, website: form.website }),
      });
      const j = await r.json().catch(() => ({}));
      if (r.status === 409) {
        setBookError('Ce créneau vient d’être pris. Choisissez-en un autre.');
        setSlot(null);
        setSlots((s) => { const n = { ...s }; delete n[monthKey(view.y, view.m)]; return n; });
        return;
      }
      if (!r.ok || !j.ok) throw new Error();
      setDone(slot);
      saveLead({ first_name: form.firstName.trim(), company: form.company.trim(), email: form.email.trim(), slot });
    } catch {
      setBookError(`La réservation n’a pas abouti. Réessayez, ou écrivez-nous à ${CONTACT_EMAIL}.`);
    } finally {
      setBooking(false);
    }
  };

  if (done) {
    return (
      <div className="bk bk-done" role="status">
        <span className="bk-done-ico" aria-hidden="true">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
        </span>
        <h3>C’est réservé.</h3>
        <p><strong>{fmtLong(done)}</strong> (heure de Paris).</p>
        <p>Ugo vous appelle au <strong>{fullPhone}</strong>. Un imprévu ? Écrivez-nous à <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>
      </div>
    );
  }

  const daySlots = day ? monthSlots[day] || [] : [];

  return (
    <div className="bk">
      <div className="bk-body">
        {/* ── Étapes 1 et 2 : coordonnées ── */}
        <form className="bk-form" onSubmit={step === 1 ? submitPhone : submitDetails} noValidate>
          <span className="bk-logo" aria-hidden="true"><img src="/favicon.svg" alt="" width="26" height="26" /></span>
          <h3>{title}</h3>
          {intro.map((t) => <p className="bk-intro" key={t}>{t}</p>)}

          <label className="bk-label" htmlFor="bk-phone">Votre numéro de téléphone</label>
          <div className={`bk-phone${errors.phone ? ' has-error' : ''}`}>
            <select aria-label="Indicatif du pays" value={form.country} onChange={update('country')} disabled={step > 1}>
              {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.code} {c.dial}</option>)}
            </select>
            <input id="bk-phone" type="tel" inputMode="tel" autoComplete="tel-national" placeholder="6 12 34 56 78" value={form.phone} onChange={update('phone')} disabled={step > 1} autoFocus={false} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'bk-phone-err' : undefined} />
          </div>
          {errors.phone && <p className="bk-err" id="bk-phone-err">{errors.phone}</p>}

          {step > 1 && (
            <div className="bk-more">
              <div className="bk-row">
                <div>
                  <label className="bk-label" htmlFor="bk-first">Prénom</label>
                  <input id="bk-first" className={`bk-input${errors.firstName ? ' has-error' : ''}`} autoComplete="given-name" value={form.firstName} onChange={update('firstName')} disabled={step > 2} aria-invalid={!!errors.firstName} />
                  {errors.firstName && <p className="bk-err">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="bk-label" htmlFor="bk-company">Société</label>
                  <input id="bk-company" className={`bk-input${errors.company ? ' has-error' : ''}`} autoComplete="organization" value={form.company} onChange={update('company')} disabled={step > 2} aria-invalid={!!errors.company} />
                  {errors.company && <p className="bk-err">{errors.company}</p>}
                </div>
              </div>
              <label className="bk-label" htmlFor="bk-email">E-mail <span className="bk-opt">(facultatif)</span></label>
              <input id="bk-email" type="email" inputMode="email" className={`bk-input${errors.email ? ' has-error' : ''}`} autoComplete="email" value={form.email} onChange={update('email')} disabled={step > 2} aria-invalid={!!errors.email} />
              {errors.email && <p className="bk-err">{errors.email}</p>}
            </div>
          )}

          <input className="bk-trap" tabIndex={-1} autoComplete="off" aria-hidden="true" value={form.website} onChange={update('website')} name="website" />

          <p className="bk-legal">En saisissant vos informations, vous acceptez qu’elles soient enregistrées conformément à nos <Link to="/cgv">conditions</Link> et à notre <Link to="/confidentialite">politique de confidentialité</Link>.</p>

          {step < 3 ? (
            <button type="submit" className="bk-btn" disabled={saving}>
              {saving ? 'Un instant…' : 'Continuer'}
              <Chevron dir="right" />
            </button>
          ) : (
            <button type="button" className="bk-btn bk-btn-ghost" onClick={() => { setStep(2); setSlot(null); }}>
              Modifier mes coordonnées
            </button>
          )}
        </form>

        {/* ── Étape 3 : créneau ── */}
        <div className={`bk-cal${step < 3 ? ' is-locked' : ''}`} aria-disabled={step < 3}>
          <div className="bk-cal-head">
            <span className="bk-month">{monthLabel}</span>
            <div className="bk-nav">
              <button type="button" onClick={() => shiftMonth(-1)} disabled={!canPrev || step < 3} aria-label="Mois précédent"><Chevron dir="left" /></button>
              <button type="button" onClick={() => shiftMonth(1)} disabled={step < 3} aria-label="Mois suivant"><Chevron dir="right" /></button>
            </div>
          </div>

          {!day ? (
            <>
              <div className="bk-grid" role="grid" aria-label={`Jours de ${monthLabel}`} aria-busy={loading}>
                {WEEKDAYS.map((w) => <span key={w} className="bk-wd" role="columnheader">{w}</span>)}
                {grid.map((d, i) => {
                  if (!d) return <span key={`e${i}`} />;
                  const key = dayKey(view.y, view.m, d);
                  const available = !!monthSlots[key]?.length;
                  return (
                    <button
                      key={key}
                      type="button"
                      className={`bk-day${available ? ' is-open' : ''}${key === today ? ' is-today' : ''}`}
                      disabled={!available || step < 3}
                      onClick={() => { setDay(key); setSlot(null); setBookError(''); }}
                      aria-label={`${fmtDay(key)}${available ? ', créneaux disponibles' : ', indisponible'}`}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
              {loadError && <p className="bk-err bk-err-cal">{loadError} <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">Réserver sur notre agenda en ligne</a>.</p>}
            </>
          ) : (
            <div className="bk-times">
              <button type="button" className="bk-back" onClick={() => { setDay(null); setSlot(null); }}>
                <Chevron dir="left" /> <span>{fmtDay(day)}</span>
              </button>
              <div className="bk-slots" role="listbox" aria-label="Créneaux disponibles">
                {daySlots.map((s) => (
                  <button key={s} type="button" role="option" aria-selected={slot === s} className={`bk-slot${slot === s ? ' is-selected' : ''}`} onClick={() => setSlot(s)}>
                    {fmtTime(s)}
                  </button>
                ))}
              </div>
              {bookError && <p className="bk-err" role="alert">{bookError}</p>}
              <button type="button" className="bk-btn" disabled={!slot || booking} onClick={confirm}>
                {booking ? 'Réservation…' : slot ? `Confirmer ${fmtTime(slot)}` : 'Choisissez un horaire'}
              </button>
            </div>
          )}

          {step < 3 && (
            <div className="bk-lock" role="note">Merci de remplir le formulaire avant de choisir votre créneau horaire.</div>
          )}
          <p className="bk-tz">Horaires affichés à l’heure de Paris.</p>
        </div>
      </div>
    </div>
  );
}
