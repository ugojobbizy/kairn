import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { KairnMark } from './sections-1.jsx';
import { KProcess } from './sections-2.jsx';
import { KCases, KFinalCTA, KLogos } from './sections-3.jsx';
import { BOOKING_URL, CONTACT_EMAIL } from './config.js';
import { supabase, isSupabaseConfigured } from './lib/supabase.js';

// ═════════════════════════════════════════════════════════════
// NOINDEX — paid-traffic page, must not be in Google
// ═════════════════════════════════════════════════════════════
function useNoIndex() {
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex,nofollow';
    document.head.appendChild(meta);
    const prevTitle = document.title;
    document.title = 'Kairn — Audit gratuit · Romandie';
    return () => {
      document.head.removeChild(meta);
      document.title = prevTitle;
    };
  }, []);
}

// ═════════════════════════════════════════════════════════════
// SLIM NAV — only the logo as escape hatch to /
// ═════════════════════════════════════════════════════════════
function LandingNav() {
  return (
    <nav className="k-nav" style={{
      position: 'sticky', top: 0, zIndex: 50,
      padding: '14px 0',
      background: 'rgba(250,250,250,.78)',
      backdropFilter: 'saturate(140%) blur(14px)',
      WebkitBackdropFilter: 'saturate(140%) blur(14px)',
      borderBottom: '1px solid rgba(237,233,254,.6)',
    }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 max(20px, calc((100vw - 1280px) / 2 + 24px))',
      }}>
        <Link to="/" className="k-logo" style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          textDecoration: 'none', color: 'var(--ink)',
        }} aria-label="Kairn — accueil">
          <KairnMark />
          <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 17, fontWeight: 600, letterSpacing: '-0.02em' }}>Kairn</span>
        </Link>
        <Link to="/" style={{
          fontSize: 13, color: 'var(--muted)', textDecoration: 'none',
          display: 'inline-flex', alignItems: 'center', gap: 6,
        }}>
          Découvrir l'agence
          <svg width="11" height="11" viewBox="0 0 14 14" fill="none"><path d="M3 7 L11 7 M7 3 L11 7 L7 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>
      </div>
    </nav>
  );
}

// ═════════════════════════════════════════════════════════════
// HERO — mental image + scarcity
// ═════════════════════════════════════════════════════════════
function LandingHero({ isMobile, onScrollToForm, onScrollToProof }) {
  return (
    <section className="k-hero k-hero-bg" style={{ position: 'relative', paddingBottom: isMobile ? 48 : 96 }}>
      <div className="k-hero-blob" style={{ width: 460, height: 460, background: '#C4B5FD', top: -120, left: '14%' }}></div>
      <div className="k-hero-blob" style={{ width: 540, height: 540, background: '#8B5CF6', top: -80, right: '8%', opacity: .26, animationDelay: '-6s' }}></div>

      <div style={{ textAlign: 'center', paddingTop: isMobile ? 36 : 72, position: 'relative' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          padding: '7px 16px 7px 12px', borderRadius: 999,
          background: 'rgba(255,255,255,.65)', backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          border: '1px solid rgba(196,181,253,.4)',
          boxShadow: '0 1px 0 rgba(255,255,255,.8) inset, 0 14px 30px -16px rgba(124,58,237,.30)',
        }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--violet)', boxShadow: '0 0 10px rgba(139,92,246,.7)' }} />
          <span className="mono" style={{ fontSize: 11, color: 'var(--violet-deep)', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 500 }}>
            Agence Build + Ads · Suisse Romande
          </span>
        </span>
      </div>

      <h1 className="k-hero-headline" style={{
        fontSize: isMobile ? 44 : 104, marginTop: isMobile ? 24 : 38,
        textAlign: 'center', maxWidth: 1180, marginLeft: 'auto', marginRight: 'auto',
        letterSpacing: '-0.05em', lineHeight: 0.94, fontWeight: 500,
      }}>
        Site qui convertit.<br />
        <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 400, background: 'linear-gradient(120deg, #8B5CF6, #6D28D9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          Ads qui rentabilisent.
        </span><br />
        Reporting qui ne ment pas.
      </h1>

      <p className="k-hero-sub" style={{ fontSize: isMobile ? 17 : 21, marginTop: isMobile ? 24 : 32, textAlign: 'center', maxWidth: 720, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.55, color: 'rgba(31,27,46,.72)', fontWeight: 400 }}>
        Pendant que vous dormez, votre site convertit vos visiteurs Meta en demandes prêtes à closer. <span style={{ color: 'var(--ink)', fontWeight: 500 }}>Lundi matin, vous choisissez qui rappeler.</span>
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: isMobile ? 28 : 36, flexWrap: 'wrap', padding: '0 20px' }}>
        <button onClick={onScrollToForm} className="k-cta" style={{
          padding: isMobile ? '14px 22px' : '16px 26px',
          fontSize: isMobile ? 15 : 16,
          background: 'linear-gradient(180deg, #9B6FFB 0%, #7C3AED 100%)',
          color: '#fff', border: 'none', cursor: 'pointer',
          boxShadow: '0 14px 36px -10px rgba(124,58,237,.55)',
        }}>
          Identifier mon plan en 60 secondes
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7 L11 7 M7 3 L11 7 L7 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <button onClick={onScrollToProof} className="k-cta k-cta-ghost" style={{
          padding: isMobile ? '14px 18px' : '16px 22px',
          fontSize: isMobile ? 14.5 : 15, cursor: 'pointer', background: 'transparent',
        }}>
          Voir des résultats
        </button>
      </div>

      <div style={{
        display: 'flex', justifyContent: 'center', gap: isMobile ? 14 : 28, marginTop: isMobile ? 32 : 44,
        flexWrap: 'wrap', textAlign: 'center', padding: '0 20px',
      }}>
        {[
          { v: '12+', l: 'projets livrés' },
          { v: '−38%', l: 'CPL moyen' },
          { v: '18 jours', l: 'time-to-launch' },
        ].map((m, i) => (
          <React.Fragment key={m.l}>
            <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontSize: isMobile ? 20 : 22, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ink)' }}>{m.v}</span>
              <span className="mono" style={{ fontSize: 11.5, color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{m.l}</span>
            </div>
            {i < 2 && !isMobile && <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--lav)', alignSelf: 'center' }}></span>}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════
// LOGO STRIP — quick social proof
// ═════════════════════════════════════════════════════════════
function LandingLogos({ isMobile }) {
  const brands = [
    { name: 'TradeAuto', logo: (<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 12 L4 8 C4.2 7.2 4.8 7 5.5 7 H14.5 C15.2 7 15.8 7.2 16 8 L17 12 V14 H15 V13 H5 V14 H3 Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /><circle cx="6.5" cy="13.5" r="1.2" fill="currentColor" /><circle cx="13.5" cy="13.5" r="1.2" fill="currentColor" /></svg>) },
    { name: 'Rénovia', logo: (<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 10 L10 4 L17 10 V16 H12 V12 H8 V16 H3 Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>) },
    { name: 'MadameLaGouvernante', logo: (<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 3 L10 17 M5 6 L15 6 M6 10 L14 10 M7 14 L13 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>) },
    { name: 'Cabinet Véran', logo: (<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 17 V8 L10 3 L16 8 V17" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /><path d="M8 17 V12 H12 V17" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /><circle cx="10" cy="8.5" r="1" fill="currentColor" /></svg>) },
    { name: 'BistroNomie', logo: (<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 9 C4 6 6.5 4 10 4 C13.5 4 16 6 16 9 C16 10 15.5 10.5 14.5 10.5 H5.5 C4.5 10.5 4 10 4 9 Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /><path d="M10 10.5 V16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /><path d="M6 16 H14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>) },
    { name: 'Lumibat', logo: (<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="3" fill="currentColor" /><path d="M10 2 V5 M10 15 V18 M2 10 H5 M15 10 H18 M4.5 4.5 L6.5 6.5 M13.5 13.5 L15.5 15.5 M4.5 15.5 L6.5 13.5 M13.5 6.5 L15.5 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>) },
  ];
  return (
    <section style={{
      padding: isMobile ? '32px 20px 28px' : '48px 120px 36px',
      borderTop: '1px solid var(--line-2)',
      borderBottom: '1px solid var(--line-2)',
      background: '#fff',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="mono" style={{
          fontSize: 11.5, color: 'var(--muted)', letterSpacing: '0.18em', textTransform: 'uppercase',
          textAlign: 'center', marginBottom: 22,
        }}>
          Ils nous font confiance pour piloter leurs leads
        </div>
        <div style={{
          display: 'flex', justifyContent: 'space-around', alignItems: 'center',
          gap: isMobile ? 18 : 32, flexWrap: 'wrap', color: 'var(--ink-soft)',
          opacity: 0.78,
        }}>
          {brands.map((b) => (
            <div key={b.name} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 14.5, fontWeight: 500, letterSpacing: '-0.012em' }}>
              {b.logo}
              <span>{b.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════
// BEFORE / AFTER — vivid contrast for System 1
// ═════════════════════════════════════════════════════════════
function LandingBeforeAfter({ isMobile }) {
  const before = [
    'Leads dispersés entre formulaires, mails, WhatsApp',
    'Vous payez Meta sans savoir ce qui marche',
    'Site qui convertit 1-2% (vous laissez 80% sur la table)',
    'Agence Build + Agence Ads (2 contrats, 0 cohérence)',
    'Reporting flou, vous y croyez ou pas',
  ];
  const after = [
    'Un seul tableau de bord, un seul flux clean',
    'Tracking serveur — vous voyez chaque euro',
    'Pages qui convertissent au-delà de 8%',
    'Une seule équipe, un seul livrable, un seul reporting',
    'Chiffres exacts chaque lundi · pas de zone de flou',
  ];
  const pad = isMobile ? '64px 20px' : '110px 120px';
  return (
    <section style={{ padding: pad, background: 'var(--bg)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="k-section-label" style={{ justifyContent: 'center' }}>
          <span className="k-section-label-sq"></span>
          01 — Le contraste
        </div>
        <h2 style={{
          fontSize: isMobile ? 32 : 52, marginTop: 18,
          letterSpacing: '-0.035em', lineHeight: 1.04,
          textAlign: 'center', maxWidth: 880, margin: '18px auto 0',
        }}>
          La différence entre <span style={{ color: 'var(--muted)' }}>"on espère"</span> et <em style={{ background: 'linear-gradient(120deg, #8B5CF6, #6D28D9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontStyle: 'normal' }}>"on sait"</em>.
        </h2>

        <div style={{
          display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? 18 : 28, marginTop: isMobile ? 36 : 56,
        }}>
          {/* BEFORE */}
          <div style={{
            padding: isMobile ? '28px 22px' : '36px 32px',
            borderRadius: 18,
            background: '#fff',
            border: '1px solid var(--line-2)',
            opacity: 0.92,
          }}>
            <div className="mono" style={{ fontSize: 11.5, letterSpacing: '0.18em', color: 'var(--muted)', textTransform: 'uppercase' }}>
              Sans Kairn
            </div>
            <h3 style={{ fontSize: 24, fontWeight: 500, marginTop: 10, letterSpacing: '-0.02em', color: 'var(--ink-soft)' }}>
              L'acquisition au feeling
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: '20px 0 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {before.map((t) => (
                <li key={t} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 14.5, color: 'var(--muted)', lineHeight: 1.55 }}>
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, marginTop: 3 }}>
                    <circle cx="10" cy="10" r="9" stroke="#9CA3AF" strokeWidth="1.4" />
                    <path d="M7 7 L13 13 M13 7 L7 13" stroke="#9CA3AF" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* AFTER */}
          <div style={{
            padding: isMobile ? '28px 22px' : '36px 32px',
            borderRadius: 18,
            background: 'linear-gradient(180deg, #1A1033 0%, #0A0A0A 100%)',
            border: '1px solid rgba(139,92,246,.35)',
            color: '#fff',
            position: 'relative', overflow: 'hidden',
            boxShadow: '0 30px 80px -28px rgba(124,58,237,.55)',
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 80% 0%, rgba(139,92,246,.30), transparent 60%)', pointerEvents: 'none' }}></div>
            <div style={{ position: 'relative' }}>
              <div className="mono" style={{ fontSize: 11.5, letterSpacing: '0.18em', color: '#C4B5FD', textTransform: 'uppercase' }}>
                Avec Kairn
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 500, marginTop: 10, letterSpacing: '-0.02em', color: '#fff' }}>
                La machine qui tourne
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: '20px 0 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
                {after.map((t) => (
                  <li key={t} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 14.5, color: 'rgba(255,255,255,.85)', lineHeight: 1.55 }}>
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, marginTop: 3 }}>
                      <circle cx="10" cy="10" r="9" fill="#8B5CF6" />
                      <path d="M6 10 L9 13 L14 7" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════
// FORM — multi-step qualification
// ═════════════════════════════════════════════════════════════
const SECTORS = [
  { v: 'dental', l: 'Dentiste / Médical' },
  { v: 'immo', l: 'Immobilier' },
  { v: 'auto', l: 'Auto' },
  { v: 'resto', l: 'Restaurant / Hôtellerie' },
  { v: 'services', l: 'Services aux pros' },
  { v: 'autre', l: 'Autre' },
];
const GOALS = [
  { v: 'leads', l: 'Plus de leads qualifiés' },
  { v: 'refonte', l: 'Refonte du site / funnel' },
  { v: 'ads', l: 'Lancer Meta Ads' },
  { v: 'automation', l: 'Automatiser mes ventes' },
];
const BUDGETS = [
  { v: 'none', l: "Pas encore d'ads" },
  { v: 'lt2k', l: '< 2 000 CHF' },
  { v: '2-5k', l: '2 — 5 000 CHF' },
  { v: '5-15k', l: '5 — 15 000 CHF' },
  { v: '15kplus', l: '15 000+ CHF' },
];
const TIMINGS = [
  { v: 'now', l: 'Ce mois-ci' },
  { v: 'quarter', l: 'Ce trimestre' },
  { v: 'exploring', l: "J'explore" },
];
const SECTOR_LABEL = Object.fromEntries(SECTORS.map(s => [s.v, s.l]));
const GOAL_LABEL = Object.fromEntries(GOALS.map(g => [g.v, g.l]));
const BUDGET_LABEL = Object.fromEntries(BUDGETS.map(b => [b.v, b.l]));
const TIMING_LABEL = Object.fromEntries(TIMINGS.map(t => [t.v, t.l]));

function getUtm() {
  if (typeof window === 'undefined') return {};
  const sp = new URLSearchParams(window.location.search);
  return {
    utm_source: sp.get('utm_source') || undefined,
    utm_campaign: sp.get('utm_campaign') || undefined,
    utm_content: sp.get('utm_content') || undefined,
  };
}

function buildCalendlyUrl(data) {
  const url = new URL(BOOKING_URL);
  if (data.first_name) url.searchParams.set('name', data.first_name);
  if (data.email) url.searchParams.set('email', data.email);
  // Calendly custom questions: a1, a2, a3...
  const summary = `${SECTOR_LABEL[data.sector] || ''} · Objectif: ${GOAL_LABEL[data.goal] || ''} · Budget: ${BUDGET_LABEL[data.budget] || ''} · Timing: ${TIMING_LABEL[data.timing] || ''}${data.company ? ' · ' + data.company : ''}${data.phone ? ' · ' + data.phone : ''}`;
  url.searchParams.set('a1', summary);
  return url.toString();
}

function Chip({ active, onClick, children }) {
  return (
    <button type="button" onClick={onClick} style={{
      padding: '14px 18px',
      borderRadius: 12,
      background: active ? 'linear-gradient(180deg, #9B6FFB 0%, #7C3AED 100%)' : '#fff',
      color: active ? '#fff' : 'var(--ink)',
      border: active ? '1px solid transparent' : '1px solid var(--line-2)',
      fontFamily: 'Geist, sans-serif',
      fontSize: 15, fontWeight: 500, letterSpacing: '-0.012em',
      cursor: 'pointer',
      transition: 'transform .18s, box-shadow .18s, border-color .18s',
      boxShadow: active ? '0 14px 32px -10px rgba(124,58,237,.45)' : '0 1px 0 rgba(10,10,10,.02)',
      textAlign: 'left',
      width: '100%',
    }}
      onMouseEnter={(e) => { if (!active) { e.currentTarget.style.borderColor = 'var(--lav)'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
      onMouseLeave={(e) => { if (!active) { e.currentTarget.style.borderColor = 'var(--line-2)'; e.currentTarget.style.transform = ''; } }}
    >
      {children}
    </button>
  );
}

function Input({ label, type = 'text', value, onChange, required, autoComplete, placeholder }) {
  const [focused, setFocused] = useState(false);
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 7, fontFamily: 'Geist, sans-serif' }}>
      <span style={{ fontSize: 12.5, color: 'var(--muted)', letterSpacing: '0.02em', fontWeight: 500 }}>{label}{required && <span style={{ color: 'var(--violet)' }}> *</span>}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          padding: '13px 14px',
          fontSize: 15,
          fontFamily: 'inherit',
          color: 'var(--ink)',
          background: '#fff',
          border: '1px solid ' + (focused ? 'var(--violet)' : 'var(--line-2)'),
          borderRadius: 10,
          outline: 'none',
          transition: 'border-color .15s, box-shadow .15s',
          boxShadow: focused ? '0 0 0 3px rgba(139,92,246,.12)' : 'none',
        }}
      />
    </label>
  );
}

function ProgressBar({ step, total }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 26 }}>
      <div style={{ flex: 1, height: 6, borderRadius: 999, background: 'var(--line)', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${(step / total) * 100}%`,
          background: 'linear-gradient(90deg, #C4B5FD 0%, #8B5CF6 60%, #6D28D9 100%)',
          borderRadius: 999,
          transition: 'width .35s cubic-bezier(.4,0,.2,1)',
        }}></div>
      </div>
      <span className="mono" style={{ fontSize: 11.5, color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
        Étape {step} / {total}
      </span>
    </div>
  );
}

const LANDING_FORM_KEY = 'kairn_landing2_form_v1';

const LandingForm = React.forwardRef(function LandingForm({ isMobile }, ref) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    sector: '', goal: '', budget: '',
    first_name: '', company: '', email: '', phone: '', timing: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [calendlyUrl, setCalendlyUrl] = useState('');

  // rehydrate from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LANDING_FORM_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.data) setData((d) => ({ ...d, ...parsed.data }));
        if (parsed?.step && parsed.step >= 1 && parsed.step <= 4) setStep(parsed.step);
      }
    } catch (_) {}
  }, []);

  // persist
  useEffect(() => {
    try { localStorage.setItem(LANDING_FORM_KEY, JSON.stringify({ data, step })); } catch (_) {}
  }, [data, step]);

  const total = 4;
  const set = (k, v) => setData((d) => ({ ...d, [k]: v }));

  const next = () => setStep((s) => Math.min(total, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!data.first_name || !data.email || !data.phone) {
      setError('Prénom, email et téléphone sont requis.');
      return;
    }
    setSubmitting(true);
    const utm = getUtm();
    const payload = {
      first_name: data.first_name.trim(),
      company: data.company.trim() || null,
      email: data.email.trim(),
      phone: data.phone.trim() || null,
      sector: data.sector || null,
      goal: data.goal || null,
      budget: data.budget || null,
      timing: data.timing || null,
      utm_source: utm.utm_source || null,
      utm_campaign: utm.utm_campaign || null,
      utm_content: utm.utm_content || null,
      stage: 'new',
    };

    try {
      if (isSupabaseConfigured) {
        const { error: insertErr } = await supabase.from('leads').insert(payload);
        if (insertErr) throw insertErr;
      }
      // Meta Pixel (conditional, no-op if not loaded)
      if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
        try { window.fbq('track', 'Lead'); } catch (_) {}
      }
      const url = buildCalendlyUrl(payload);
      setCalendlyUrl(url);
      setSubmitted(true);
      try { localStorage.removeItem(LANDING_FORM_KEY); } catch (_) {}
    } catch (err) {
      setError("On n'a pas pu enregistrer votre demande. Réessayez ou écrivez-nous à " + CONTACT_EMAIL + '.');
    } finally {
      setSubmitting(false);
    }
  };

  const canNext = useMemo(() => {
    if (step === 1) return Boolean(data.sector);
    if (step === 2) return Boolean(data.goal);
    if (step === 3) return Boolean(data.budget);
    return true;
  }, [step, data]);

  const pad = isMobile ? '64px 20px' : '110px 120px';

  // CONFIRMATION SCREEN
  if (submitted) {
    return (
      <section ref={ref} id="form" style={{ padding: pad, background: 'linear-gradient(180deg, #FAFAFA 0%, #F5F3FF 100%)' }}>
        <div style={{
          maxWidth: 720, margin: '0 auto',
          padding: isMobile ? '36px 24px' : '56px 48px',
          background: '#fff', borderRadius: 20,
          border: '1px solid var(--line-2)',
          boxShadow: '0 40px 100px -40px rgba(124,58,237,.35)',
          textAlign: 'center', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(139,92,246,.10), transparent 70%)', pointerEvents: 'none' }}></div>
          <div style={{ position: 'relative' }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'linear-gradient(135deg, #C4B5FD, #8B5CF6 65%, #6D28D9)',
              margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 14px 32px -10px rgba(124,58,237,.55)',
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12 L10 17 L19 7" /></svg>
            </div>
            <h2 style={{ fontSize: isMobile ? 30 : 42, marginTop: 22, letterSpacing: '-0.035em', lineHeight: 1.05 }}>
              Merci {data.first_name || ''}. Votre demande est arrivée.
            </h2>
            <p style={{ fontSize: isMobile ? 15 : 17, color: 'var(--muted)', marginTop: 16, lineHeight: 1.6, maxWidth: 540, margin: '16px auto 0' }}>
              Pour gagner 24h, choisissez maintenant un créneau de <strong style={{ color: 'var(--ink)', fontWeight: 500 }}>30 minutes</strong>. On regarde votre cas ensemble — sans pitch commercial.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 30, flexWrap: 'wrap' }}>
              <a className="k-cta" href={calendlyUrl || BOOKING_URL} target="_blank" rel="noopener noreferrer" style={{
                padding: '16px 26px', fontSize: 16,
                background: 'linear-gradient(180deg, #9B6FFB 0%, #7C3AED 100%)',
                color: '#fff', boxShadow: '0 14px 36px -10px rgba(124,58,237,.55)',
              }}>
                Réserver mon RDV de 30 min
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7 L11 7 M7 3 L11 7 L7 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </a>
              <a className="k-cta k-cta-ghost" href={`mailto:${CONTACT_EMAIL}?subject=Suite%20de%20ma%20demande%20landing`} style={{ padding: '16px 22px', fontSize: 15 }}>
                Préférer un email
              </a>
            </div>
            <div className="mono" style={{ marginTop: 24, fontSize: 11.5, color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Réponse personnelle sous 24h ouvrées
            </div>
          </div>
        </div>
      </section>
    );
  }

  // FORM SCREEN
  return (
    <section ref={ref} id="form" style={{ padding: pad, background: 'linear-gradient(180deg, #FAFAFA 0%, #F5F3FF 100%)' }}>
      <div style={{
        maxWidth: 760, margin: '0 auto',
        padding: isMobile ? '32px 22px 36px' : '48px 56px 52px',
        background: '#fff', borderRadius: 20,
        border: '1px solid var(--line-2)',
        boxShadow: '0 40px 100px -40px rgba(124,58,237,.30)',
      }}>
        <div className="k-section-label">
          <span className="k-section-label-sq"></span>
          02 — Votre plan en 60 secondes
        </div>
        <h2 style={{ fontSize: isMobile ? 28 : 38, marginTop: 14, letterSpacing: '-0.03em', lineHeight: 1.08 }}>
          Quelques questions. <span style={{ color: 'var(--muted)' }}>Et on revient avec une réponse honnête.</span>
        </h2>

        <div style={{ marginTop: isMobile ? 28 : 36 }}>
          <ProgressBar step={step} total={total} />

          {step === 1 && (
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 500, letterSpacing: '-0.015em' }}>Quel est votre secteur ?</h3>
              <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 6 }}>Pour adapter notre réponse à votre marché.</p>
              <div style={{
                display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                gap: 10, marginTop: 18,
              }}>
                {SECTORS.map((s) => (
                  <Chip key={s.v} active={data.sector === s.v} onClick={() => { set('sector', s.v); setTimeout(next, 160); }}>
                    {s.l}
                  </Chip>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 500, letterSpacing: '-0.015em' }}>Quel est votre objectif principal ?</h3>
              <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 6 }}>Une seule réponse — la plus prioritaire pour vous.</p>
              <div style={{
                display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                gap: 10, marginTop: 18,
              }}>
                {GOALS.map((g) => (
                  <Chip key={g.v} active={data.goal === g.v} onClick={() => { set('goal', g.v); setTimeout(next, 160); }}>
                    {g.l}
                  </Chip>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 500, letterSpacing: '-0.015em' }}>Budget mensuel actuel sur Meta&nbsp;Ads ?</h3>
              <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 6 }}>Une fourchette suffit. Pas de jugement — on s'adapte.</p>
              <div style={{
                display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                gap: 10, marginTop: 18,
              }}>
                {BUDGETS.map((b) => (
                  <Chip key={b.v} active={data.budget === b.v} onClick={() => { set('budget', b.v); setTimeout(next, 160); }}>
                    {b.l}
                  </Chip>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <form onSubmit={submit}>
              <h3 style={{ fontSize: 18, fontWeight: 500, letterSpacing: '-0.015em' }}>Vos coordonnées</h3>
              <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 6 }}>Réponse personnelle d'un consultant Kairn sous 24h ouvrées.</p>
              <div style={{
                display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                gap: 14, marginTop: 18,
              }}>
                <Input label="Prénom" value={data.first_name} onChange={(v) => set('first_name', v)} required autoComplete="given-name" />
                <Input label="Entreprise" value={data.company} onChange={(v) => set('company', v)} autoComplete="organization" />
                <Input label="Email" type="email" value={data.email} onChange={(v) => set('email', v)} required autoComplete="email" />
                <Input label="Téléphone" type="tel" value={data.phone} onChange={(v) => set('phone', v)} required autoComplete="tel" />
              </div>

              <div style={{ marginTop: 22 }}>
                <span style={{ fontSize: 12.5, color: 'var(--muted)', letterSpacing: '0.02em', fontWeight: 500 }}>Quand voulez-vous démarrer&nbsp;?</span>
                <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                  {TIMINGS.map((t) => (
                    <button key={t.v} type="button" onClick={() => set('timing', t.v)} style={{
                      padding: '10px 14px', borderRadius: 999,
                      background: data.timing === t.v ? 'var(--ink)' : '#fff',
                      color: data.timing === t.v ? '#fff' : 'var(--ink-soft)',
                      border: '1px solid ' + (data.timing === t.v ? 'var(--ink)' : 'var(--line-2)'),
                      fontFamily: 'Geist, sans-serif', fontSize: 13.5, fontWeight: 500,
                      cursor: 'pointer', transition: 'background .15s, color .15s, border-color .15s',
                    }}>
                      {t.l}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div style={{
                  marginTop: 18, padding: '12px 14px',
                  borderRadius: 10, background: '#FEF2F2', color: '#991B1B',
                  fontSize: 13.5, border: '1px solid #FECACA',
                }}>
                  {error}
                </div>
              )}

              <button type="submit" disabled={submitting} className="k-cta" style={{
                marginTop: 26, padding: '16px 26px', fontSize: 16, width: '100%',
                background: 'linear-gradient(180deg, #9B6FFB 0%, #7C3AED 100%)',
                color: '#fff', border: 'none', cursor: submitting ? 'wait' : 'pointer',
                opacity: submitting ? 0.7 : 1,
                boxShadow: '0 14px 36px -10px rgba(124,58,237,.55)',
                justifyContent: 'center',
              }}>
                {submitting ? 'Envoi…' : 'Recevoir mon plan personnalisé'}
                {!submitting && <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7 L11 7 M7 3 L11 7 L7 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
              </button>

              <div style={{ marginTop: 16, fontSize: 12.5, color: 'var(--muted)', textAlign: 'center', lineHeight: 1.6 }}>
                Pas de spam · Réponse personnelle sous 24h · Données hébergées en UE · Conforme nLPD/RGPD
              </div>
            </form>
          )}

          {step < 4 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 26 }}>
              <button onClick={back} disabled={step === 1} type="button" style={{
                padding: '10px 14px', background: 'transparent', border: 'none',
                color: step === 1 ? 'var(--line-2)' : 'var(--muted)',
                fontFamily: 'Geist, sans-serif', fontSize: 14, cursor: step === 1 ? 'default' : 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 6,
              }}>
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M11 7 L3 7 M7 3 L3 7 L7 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                Retour
              </button>
              <button onClick={next} disabled={!canNext} type="button" className="k-cta" style={{
                padding: '12px 20px', fontSize: 14.5,
                background: canNext ? 'var(--ink)' : 'var(--line-2)',
                color: canNext ? '#fff' : 'var(--muted)',
                cursor: canNext ? 'pointer' : 'default',
                border: 'none',
                opacity: canNext ? 1 : 0.7,
              }}>
                Continuer
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M3 7 L11 7 M7 3 L11 7 L7 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
});

// ═════════════════════════════════════════════════════════════
// CASES + STEPS data (re-using main-site components KCases, KProcess)
// ═════════════════════════════════════════════════════════════
const LANDING_CASES = [
  {
    company: { name: 'TradeAuto', logo: '/tradeauto-logo.png' },
    tags: ['Automobile', 'Suisse', 'Build + Ads'],
    title: 'Site, CRM et acquisition livrés en 4 semaines',
    challenge: "Leads dispersés entre formulaires, emails et WhatsApp. Pas de visibilité sur le coût réel d'acquisition ni sur la qualité des sources.",
    solution: 'Site + CRM + dashboard temps réel + campagnes Meta & Google par la même équipe. Tracking serveur end-to-end, attribution multi-source.',
    kpis: [
      { value: '−64%', label: 'CPL · de 27 à 10 CHF' },
      { value: '86', label: 'leads qualifiés / semaine' },
      { value: '4 sem.', label: 'du brief au tunnel complet' },
    ],
    quote: 'Site, CRM, dashboard, Meta + Google Ads — tout livré par la même équipe en 4 semaines. Je recommande les yeux fermés.',
    author: 'Louis · Fondateur, TRADEAUTO.CH',
  },
  {
    company: { name: 'Rénovia', logo: '/renovia-logo.svg' },
    tags: ['Rénovation', 'Lead Gen', 'Funnel & Qualification'],
    title: 'CPL divisé par 2 avec des dossiers prêts à closer',
    challenge: 'Leads tièdes, dossiers incomplets, équipe commerciale qui relance dans le vide. Conversion en chute, no-shows fréquents.',
    solution: 'Funnel refondu, qualification enrichie (DPE live, profil ANAH), tracking serveur complet. Les leads arrivent avec un dossier signé prêt à closer.',
    kpis: [
      { value: '+158%', label: 'taux de conversion · 12% → 31%' },
      { value: '−46%', label: 'CPL · de 24 € à 13 €' },
      { value: '5×', label: 'plus de data par lead · 3 → 15+ champs' },
    ],
    quote: 'CPL divisé par 2, conversion doublée. Mais surtout : les leads arrivent avec un dossier complet. Le closing a suivi.',
    author: 'Samuel · Fondateur, RENOVIA.FR',
  },
  {
    company: { name: 'Madame la Gouvernante', logo: '/madame-logo.png' },
    tags: ['Marketplace', 'Two-sided', 'Stripe & Automation'],
    title: 'Plateforme two-sided pour piloter 150+ missions / semaine',
    challenge: 'Coordination manuelle via WhatsApp et tableurs. Matching entreprises/auto-entrepreneurs lent, relances oubliées, facturation manuelle.',
    solution: 'Plateforme two-sided avec matching intelligent, dispatch auto, paiement Stripe et facturation générée. Un seul back-office pour piloter tout le flux.',
    kpis: [
      { value: '150+', label: 'missions réalisées chaque semaine' },
      { value: '26+', label: 'endpoints API REST' },
      { value: '14', label: 'spécialités métiers supportées' },
    ],
    quote: "Aujourd'hui on pilote 150+ missions par semaine depuis un seul back-office. La différence est nuit et jour.",
    author: 'Manon · Co-fondatrice, MADAMELAGOUVERNANTE.COM',
  },
];

const LANDING_STEPS = [
  { n: '01', t: 'Audit', d: 'Stack, funnel, tracking, créas. On identifie les fuites avant de toucher à quoi que ce soit.' },
  { n: '02', t: 'Build', d: 'Pages, automatisations, tracking. Livré en 2 à 4 semaines, pas en 6 mois.' },
  { n: '03', t: 'Launch', d: 'Mise en ligne, campagnes lancées, budget calibré. On observe, on ne promet pas.' },
  { n: '04', t: 'Optimize', d: 'Itérations hebdo sur les créas, le funnel, le ciblage. Reporting transparent chaque lundi.' },
];

// Wrapper to attach proofRef while reusing the main-site KCases component
const LandingCasesAnchor = React.forwardRef(function LandingCasesAnchor({ isMobile }, ref) {
  return (
    <div ref={ref} id="proof">
      <KCases isMobile={isMobile} cases={LANDING_CASES} />
    </div>
  );
});


// ═════════════════════════════════════════════════════════════
// FAQ — silent objections
// ═════════════════════════════════════════════════════════════
function LandingFAQ({ isMobile }) {
  const [open, setOpen] = useState(0);
  const items = [
    {
      q: 'Combien de temps avant les premiers leads ?',
      a: 'Site et campagnes en ligne entre 2 et 3 semaines après la signature. Premiers leads dès la 1re semaine de diffusion ads — la phase d\'optimisation CPL prend typiquement 2 à 4 semaines supplémentaires.',
    },
    {
      q: 'Que se passe-t-il à la fin de l\'engagement ?',
      a: 'Vous récupérez 100% des assets : code source du site, comptes Meta/Google Ads, dashboards, automatisations. Pas de lock-in. Vous pouvez partir avec un préavis de 30 jours.',
    },
    {
      q: 'Vous travaillez avec quels secteurs ?',
      a: 'SME romandes principalement : médical/dentaire, immobilier, automobile, restauration/hôtellerie, services aux pros. On refuse les projets pré-revenue ou hors de notre cadre — pas de gaspillage.',
    },
    {
      q: 'Pourquoi pas une agence locale suisse pure ?',
      a: 'On opère depuis la Romandie, on facture en CHF, conformes nLPD. Mais on combine une équipe Build (dev, design, automation) et Ads (Meta, Google) sous un seul toit — rare en local. Vous évitez de jongler entre 2 prestataires.',
    },
    {
      q: 'Qui est propriétaire des assets (site, comptes ads) ?',
      a: 'Vous, intégralement. Comptes Meta/Google créés à votre nom, code livré sous votre repo, automations sur vos workspaces. On a accès tant que la mission est active — vous gardez tout après.',
    },
    {
      q: 'Vous gardez nos données en Suisse ?',
      a: 'Données utilisateurs hébergées en UE (Frankfurt, Supabase). Conforme nLPD et RGPD. Si vous avez des contraintes spécifiques de souveraineté CH, on adapte le stack à votre charge — c\'est rare mais possible.',
    },
    {
      q: 'C\'est quoi le process concrètement ?',
      a: 'Audit (1 sem) → Spec chiffrée validée par vous → Build (2-3 sem) → Lancement → Optimisation hebdo. Reporting chaque lundi avec les chiffres bruts. Aucune surprise sur la facture.',
    },
  ];
  const pad = isMobile ? '80px 20px' : '140px 80px';
  return (
    <section style={{ padding: pad, background: '#fff', position: 'relative' }}>
      <div style={{ maxWidth: 920, margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '6px 14px 6px 12px', borderRadius: 999, background: '#fff', border: '1px solid var(--line-2)', boxShadow: '0 1px 0 rgba(10,10,10,.02)' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--violet)' }} />
          <span className="mono" style={{ fontSize: 11, color: 'var(--violet-deep)', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 500 }}>
            05 — Questions fréquentes
          </span>
        </div>
        <h2 style={{ fontSize: isMobile ? 36 : 64, marginTop: 22, letterSpacing: '-0.04em', lineHeight: 1.0, fontWeight: 500, maxWidth: 800 }}>
          Ce que les autres<br/>
          <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 400, background: 'linear-gradient(120deg, #8B5CF6, #6D28D9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            prospects nous demandent.
          </span>
        </h2>
        <div style={{ marginTop: isMobile ? 32 : 44 }}>
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={i} style={{
                borderTop: '1px solid var(--line-2)',
                borderBottom: i === items.length - 1 ? '1px solid var(--line-2)' : 'none',
              }}>
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  style={{
                    width: '100%', padding: '20px 0',
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14,
                    textAlign: 'left', fontFamily: 'Geist, sans-serif',
                  }}
                >
                  <span style={{ fontSize: isMobile ? 16 : 17, fontWeight: 500, color: 'var(--ink)', letterSpacing: '-0.012em' }}>
                    {item.q}
                  </span>
                  <span style={{
                    width: 26, height: 26, borderRadius: '50%',
                    background: isOpen ? 'var(--violet)' : 'var(--line)',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'background .18s, transform .25s',
                    transform: isOpen ? 'rotate(45deg)' : 'rotate(0)',
                    flexShrink: 0,
                  }}>
                    <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
                      <path d="M7 1 V13 M1 7 H13" stroke={isOpen ? '#fff' : 'var(--ink-soft)'} strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </span>
                </button>
                <div style={{
                  maxHeight: isOpen ? 400 : 0,
                  overflow: 'hidden',
                  transition: 'max-height .35s cubic-bezier(.4,0,.2,1)',
                }}>
                  <p style={{
                    fontSize: 14.5, color: 'var(--muted)',
                    lineHeight: 1.65, paddingBottom: 22, paddingRight: 40, margin: 0,
                  }}>
                    {item.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════
// MINIMAL FOOTER
// ═════════════════════════════════════════════════════════════
function LandingFooter() {
  return (
    <footer style={{
      padding: '32px 24px 28px',
      background: '#0A0A0A', color: 'rgba(255,255,255,.6)',
      fontSize: 13, letterSpacing: '0.01em',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', textAlign: 'center' }}>
        <div style={{ fontSize: 14, color: '#fff', fontWeight: 500 }}>
          Kairn · Suisse Romande
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '6px 16px', fontSize: 12.5 }}>
          <span>Lausanne · Genève</span>
          <span>·</span>
          <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: '#C4B5FD', textDecoration: 'none' }}>{CONTACT_EMAIL}</a>
          <span>·</span>
          <a href="/" style={{ color: 'rgba(255,255,255,.6)', textDecoration: 'none' }}>Découvrir l'agence</a>
        </div>
        <div className="mono" style={{ fontSize: 10.5, color: 'rgba(255,255,255,.45)', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 4 }}>
          Données hébergées en UE · Conforme nLPD &amp; RGPD · © 2026
        </div>
      </div>
    </footer>
  );
}

// ═════════════════════════════════════════════════════════════
// LANDING PAGE ROOT
// ═════════════════════════════════════════════════════════════
export default function LandingPage({ variant = 'desktop' }) {
  useNoIndex();
  const isMobile = variant === 'mobile';
  const formRef = useRef(null);
  const proofRef = useRef(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const scrollToProof = () => {
    proofRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="kairn">
      <LandingNav />
      <LandingHero isMobile={isMobile} onScrollToForm={scrollToForm} onScrollToProof={scrollToProof} />
      <KLogos isMobile={isMobile} />
      <LandingBeforeAfter isMobile={isMobile} />
      <LandingForm ref={formRef} isMobile={isMobile} />
      <LandingCasesAnchor ref={proofRef} isMobile={isMobile} />
      <KProcess isMobile={isMobile} steps={LANDING_STEPS} />
      <LandingFAQ isMobile={isMobile} />
      <KFinalCTA isMobile={isMobile} />
      <LandingFooter />
      {isMobile && (
        <div style={{ position: 'sticky', bottom: 0, padding: '0 0 12px', pointerEvents: 'none', zIndex: 30 }}>
          <button onClick={scrollToForm} className="k-mob-cta" style={{ pointerEvents: 'auto', border: 'none', cursor: 'pointer', width: 'calc(100% - 24px)', margin: '0 12px' }}>
            <span style={{ fontSize: 14, fontWeight: 500 }}>Mon plan en 60 secondes.</span>
            <span style={{ fontSize: 13, color: '#C4B5FD', fontWeight: 500 }}>Commencer →</span>
          </button>
        </div>
      )}
    </div>
  );
}
