import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BOOKING_URL, CONTACT_EMAIL } from '../config.js';

// Réservation en deux étapes, à la manière d'iClosed :
// 1. coordonnées (enregistrées tout de suite comme lead dans le CRM)
// 2. choix d'un créneau libre dans Google Agenda (via /api/slots et /api/book).

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

export default function Booking() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ country: 'FR', phone: '', name: '', website: '' });
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

  const validate = () => {
    const er = {};
    const digits = form.phone.replace(/\D/g, '');
    if (digits.length < 8 || digits.length > 15) er.phone = 'Entrez un numéro de téléphone valide, par exemple 6 12 34 56 78.';
    if (form.name.trim().length < 2) er.name = 'Indiquez votre prénom et votre nom.';
    setErrors(er);
    return !Object.keys(er).length;
  };

  const submitStep1 = async (e) => {
    e.preventDefault();
    if (form.website) return; // champ piège rempli par un robot
    if (!validate()) return;
    setSaving(true);
    try {
      // Supabase n'est chargé qu'au moment d'enregistrer un lead (allège la page d'accueil).
      const { supabase, isSupabaseConfigured } = await import('../lib/supabase.js');
      if (isSupabaseConfigured) {
        const utm = getUtm();
        const lead = {
          first_name: form.name.trim(),
          email: null,
          phone: fullPhone,
          utm_source: utm.utm_source || null,
          utm_campaign: utm.utm_campaign || null,
          utm_content: utm.utm_content || null,
          stage: 'new',
        };
        // Pas d'email demandé : si la colonne l'exige, on réessaie avec une chaîne vide.
        const { error } = await supabase.from('leads').insert(lead);
        if (error) await supabase.from('leads').insert({ ...lead, email: '' });
      }
      if (typeof window.fbq === 'function') { try { window.fbq('track', 'Lead'); } catch { /* pixel absent */ } }
    } catch {
      // Le lead n'a pas pu être enregistré : on laisse quand même réserver, l'agenda garde les coordonnées.
    } finally {
      setSaving(false);
      setStep(2);
    }
  };

  const confirm = async () => {
    if (!slot) return;
    setBooking(true);
    setBookError('');
    try {
      const r = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ start: slot, name: form.name.trim(), phone: fullPhone, website: form.website }),
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
        <p>On vous appelle au <strong>{fullPhone}</strong>. Un imprévu ? Écrivez-nous à <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>
      </div>
    );
  }

  const daySlots = day ? monthSlots[day] || [] : [];

  return (
    <div className="bk">
      <ol className="bk-steps" aria-label="Étapes de la réservation">
        <li className={step === 1 ? 'is-active' : 'is-done'}><i />Vos coordonnées</li>
        <li className={step === 2 ? 'is-active' : ''}><i />Choisissez votre créneau</li>
      </ol>

      <div className="bk-body">
        {/* ── Étape 1 ── */}
        <form className="bk-form" onSubmit={submitStep1} noValidate>
          <h3>Appel de découverte avec Kairn</h3>
          <p className="bk-intro">30 minutes pour parler de votre acquisition : vos chiffres, vos objectifs, et ce qu’on ferait à votre place.</p>

          <label className="bk-label" htmlFor="bk-phone">Téléphone</label>
          <div className={`bk-phone${errors.phone ? ' has-error' : ''}`}>
            <select aria-label="Indicatif du pays" value={form.country} onChange={update('country')} disabled={step === 2}>
              {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.code} {c.dial}</option>)}
            </select>
            <input id="bk-phone" type="tel" inputMode="tel" autoComplete="tel-national" placeholder="6 12 34 56 78" value={form.phone} onChange={update('phone')} disabled={step === 2} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'bk-phone-err' : undefined} />
          </div>
          {errors.phone && <p className="bk-err" id="bk-phone-err">{errors.phone}</p>}

          <label className="bk-label" htmlFor="bk-name">Prénom et nom</label>
          <input id="bk-name" className={`bk-input${errors.name ? ' has-error' : ''}`} autoComplete="name" value={form.name} onChange={update('name')} disabled={step === 2} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'bk-name-err' : undefined} />
          {errors.name && <p className="bk-err" id="bk-name-err">{errors.name}</p>}


          <input className="bk-trap" tabIndex={-1} autoComplete="off" aria-hidden="true" value={form.website} onChange={update('website')} name="website" />

          <p className="bk-legal">En envoyant vos informations, vous acceptez qu’elles soient enregistrées conformément à nos <Link to="/cgv">conditions</Link> et à notre <Link to="/confidentialite">politique de confidentialité</Link>.</p>

          {step === 1 ? (
            <button type="submit" className="bk-btn" disabled={saving}>
              {saving ? 'Un instant…' : 'Continuer'}
              <Chevron dir="right" />
            </button>
          ) : (
            <button type="button" className="bk-btn bk-btn-ghost" onClick={() => { setStep(1); setSlot(null); }}>
              Modifier mes coordonnées
            </button>
          )}
        </form>

        {/* ── Étape 2 ── */}
        <div className={`bk-cal${step === 1 ? ' is-locked' : ''}`} aria-disabled={step === 1}>
          <div className="bk-cal-head">
            <span className="bk-month">{monthLabel}</span>
            <div className="bk-nav">
              <button type="button" onClick={() => shiftMonth(-1)} disabled={!canPrev || step === 1} aria-label="Mois précédent"><Chevron dir="left" /></button>
              <button type="button" onClick={() => shiftMonth(1)} disabled={step === 1} aria-label="Mois suivant"><Chevron dir="right" /></button>
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
                      disabled={!available || step === 1}
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

          {step === 1 && (
            <div className="bk-lock" role="note">Remplissez vos coordonnées pour choisir votre créneau.</div>
          )}
          <p className="bk-tz">Horaires affichés à l’heure de Paris.</p>
        </div>
      </div>
    </div>
  );
}
