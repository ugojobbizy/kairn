import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IllusFlow, IllusCurve } from './illustrations.jsx';
import { BOOKING_URL } from './config.js';

// ═════════════════════════════════════════════════════════════
// BRAND MARK — Kairn (cairn stones + spark)
// ═════════════════════════════════════════════════════════════
export function KairnMark() {
  return (
    <span className="k-logo-mark" aria-hidden="true">
      <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="kmBg" x1="2" y1="0" x2="26" y2="28" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C4B5FD" />
            <stop offset="45%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#3F1D8F" />
          </linearGradient>
          <linearGradient id="kmStone" x1="6" y1="4" x2="22" y2="24" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#D6CCF5" />
          </linearGradient>
          <radialGradient id="kmSheen" cx="0.28" cy="0.18" r="0.7">
            <stop offset="0%" stopColor="rgba(255,255,255,0.75)" />
            <stop offset="55%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
          <radialGradient id="kmGlow" cx="0.5" cy="1" r="0.8">
            <stop offset="0%" stopColor="rgba(196,181,253,0.55)" />
            <stop offset="100%" stopColor="rgba(196,181,253,0)" />
          </radialGradient>
          <filter id="kmBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="0.6" />
          </filter>
        </defs>

        {/* base gem */}
        <rect x="0" y="0" width="28" height="28" rx="8" fill="url(#kmBg)" />

        {/* inner ambient glow */}
        <rect x="0" y="0" width="28" height="28" rx="8" fill="url(#kmGlow)" />

        {/* cairn stones — stacked, geological feel */}
        <g filter="url(#kmBlur)" opacity="0.35">
          <rect x="5.5" y="19" width="17" height="4.5" rx="2.25" fill="#2A1065" />
        </g>
        <rect x="5.5" y="18.5" width="17" height="4.5" rx="2.25" fill="url(#kmStone)" />
        <rect x="7.5" y="12.5" width="13" height="4" rx="2" fill="url(#kmStone)" opacity="0.92" />
        <rect x="10" y="7.5" width="8" height="3.5" rx="1.75" fill="url(#kmStone)" opacity="0.85" />

        {/* edge highlights on stones (thin top strokes for depth) */}
        <rect x="5.5" y="18.5" width="17" height="4.5" rx="2.25" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.5" />
        <rect x="7.5" y="12.5" width="13" height="4" rx="2" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
        <rect x="10" y="7.5" width="8" height="3.5" rx="1.75" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.5" />

        {/* specular sheen across whole mark */}
        <rect className="k-logo-sheen" x="0" y="0" width="28" height="28" rx="8" fill="url(#kmSheen)" />

        {/* 4-point sparkle */}
        <g className="k-logo-sparkle">
          <path d="M20.5 3.6 L21.1 6.4 L23.9 7 L21.1 7.6 L20.5 10.4 L19.9 7.6 L17.1 7 L19.9 6.4 Z" fill="#FFFFFF" />
        </g>

        {/* inner ring for premium feel */}
        <rect x="0.5" y="0.5" width="27" height="27" rx="7.5" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
      </svg>
    </span>
  );
}

const NAV_ITEMS = [
  { label: 'Build', to: '/build' },
  { label: 'Ads', to: '/ads' },
  { label: 'Réalisations', to: '/realisations' },
  { label: 'Contact', to: '/contact' },
];

function HeroSeparator() {
  const sepRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    let rafId = null;
    const update = () => {
      rafId = null;
      const sep = sepRef.current;
      const dot = dotRef.current;
      if (!sep || !dot) return;
      const rect = sep.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height + vh;
      const scrolled = vh - rect.top;
      const p = Math.max(0, Math.min(1, scrolled / total));
      dot.style.top = `${p * 100}%`;
    };
    const onScroll = () => { if (rafId == null) rafId = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div ref={sepRef} className="k-hero-sep-d">
      <span ref={dotRef} className="k-hero-sep-dot"></span>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// NAV
// ═════════════════════════════════════════════════════════════
export function KNav({ isMobile }) {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const navItems = isHome ? NAV_ITEMS : [{ label: 'Accueil', to: '/' }, ...NAV_ITEMS];

  if (isMobile) {
    return (
      <nav className="k-nav" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" className="k-logo">
          <KairnMark />
          Kairn
        </Link>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <a className="k-cta" href={BOOKING_URL} target="_blank" rel="noopener noreferrer" style={{ padding: '9px 14px', fontSize: 13 }}>
            Prendre RDV
          </a>
          <button aria-label="menu" style={{ width: 40, height: 40, border: '1px solid rgba(10,10,10,.1)', borderRadius: 10, background: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 16, height: 1.5, background: '#0A0A0A' }}></span>
            <span style={{ width: 16, height: 1.5, background: '#0A0A0A' }}></span>
          </button>
        </div>
      </nav>
    );
  }
  return (
    <nav className="k-nav" style={{ padding: '16px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Link to="/" className="k-logo" style={{ textDecoration: 'none' }}>
        <KairnMark />
        Kairn
      </Link>
      <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        {navItems.map((x) => (
          <Link key={x.label} to={x.to} className="k-nav-item" style={{ whiteSpace: 'nowrap' }}>{x.label}</Link>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <a className="k-cta" href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
          Prendre RDV
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7 L11 7 M7 3 L11 7 L7 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </a>
      </div>
    </nav>
  );
}

// ═════════════════════════════════════════════════════════════
// HERO
// ═════════════════════════════════════════════════════════════
function HeroPanel({ kind, dotColor, headline, sub, illus }) {
  return (
    <div style={{ padding: '64px 56px 40px', position: 'relative', minHeight: 440, display: 'flex', flexDirection: 'column' }}>
      <div className="k-hero-kind">
        <span className="k-hero-kind-dot" style={{ background: dotColor }}></span>
        {kind}
      </div>
      <h1 style={{ fontSize: 58, marginTop: 20, maxWidth: 520, letterSpacing: '-0.035em' }}>
        {headline}
      </h1>
      <p style={{ color: 'var(--muted)', fontSize: 17, maxWidth: 420, marginTop: 18, lineHeight: 1.55 }}>
        {sub}
      </p>
      <div style={{ marginTop: 28, height: 180, position: 'relative' }}>
        {illus}
      </div>
    </div>
  );
}

export function KHero({ isMobile }) {
  if (isMobile) {
    return (
      <section className="k-hero k-bg-dot">
        <div style={{ padding: '36px 20px 12px', textAlign: 'center' }}>
          <span className="k-eyebrow">
            <span className="k-eyebrow-dot"></span>
            Agence spécialisée · SaaS & Growth
          </span>
        </div>
        <div style={{ padding: '28px 24px 36px', borderBottom: '1px solid var(--line-2)' }}>
          <div className="k-hero-kind"><span className="k-hero-kind-dot" style={{ background: 'var(--violet)' }}></span>Build · 01</div>
          <h1 style={{ fontSize: 34, marginTop: 14, letterSpacing: '-0.03em' }}>On construit la&nbsp;machine.</h1>
          <p style={{ color: 'var(--muted)', fontSize: 15, marginTop: 12, lineHeight: 1.55 }}>
            Sites, tunnels, automatisations. Livrés en semaines, pas en trimestres.
          </p>
          <div style={{ height: 140, marginTop: 20 }}>
            <IllusFlow />
          </div>
        </div>
        <div style={{ padding: '32px 24px 28px', background: 'var(--lav-pale)' }}>
          <div className="k-hero-kind"><span className="k-hero-kind-dot" style={{ background: 'var(--ink)' }}></span>Ads · 02</div>
          <h1 style={{ fontSize: 34, marginTop: 14, letterSpacing: '-0.03em' }}>On la fait tourner à plein régime.</h1>
          <p style={{ color: 'var(--muted)', fontSize: 15, marginTop: 12, lineHeight: 1.55 }}>
            CPL qui baisse, budget qui scale proprement. Toujours dans cet ordre.
          </p>
          <div style={{ height: 140, marginTop: 20 }}>
            <IllusCurve />
          </div>
        </div>
        <div style={{ padding: '28px 20px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <a className="k-cta" href={BOOKING_URL} target="_blank" rel="noopener noreferrer" style={{ justifyContent: 'center' }}>
            Prendre un RDV découverte
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7 L11 7 M7 3 L11 7 L7 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </a>
          <p className="mono" style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'center', marginTop: 4 }}>
            30 min · pas de pitch commercial
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="k-hero k-hero-bg" style={{ position: 'relative', paddingBottom: 56 }}>
      <div className="k-hero-blob" style={{ width: 440, height: 440, background: '#C4B5FD', top: -120, left: '10%' }}></div>
      <div className="k-hero-blob" style={{ width: 520, height: 520, background: '#8B5CF6', top: -60, right: '8%', opacity: .25, animationDelay: '-6s' }}></div>

      <div style={{ textAlign: 'center', paddingTop: 64, position: 'relative' }}>
        <span className="k-eyebrow">
          <span className="k-eyebrow-dot"></span>
          Agence spécialisée · SaaS & Growth teams
        </span>
      </div>

      <h1 className="k-hero-headline">
        On construit la machine.<br />
        Puis <em>on la fait tourner</em> à plein régime.
      </h1>
      <p className="k-hero-sub">
        Kairn est une agence <strong style={{ color: 'var(--ink)', fontWeight: 500 }}>Build & Ads</strong>. On conçoit vos funnels, on déploie vos campagnes, on optimise vos CPL — le tout sous un seul toit, en moins de 30 jours.
      </p>

      <div style={{ textAlign: 'center', padding: '36px 0 56px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, position: 'relative' }}>
        <a className="k-cta" href={BOOKING_URL} target="_blank" rel="noopener noreferrer" style={{ padding: '16px 26px', fontSize: 16 }}>
          Prendre un RDV découverte
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7 L11 7 M7 3 L11 7 L7 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </a>
        <p className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>
          30 min · en visio · audit gratuit
        </p>
      </div>

      <div className="k-hero-panels-d" style={{ position: 'relative', background: 'rgba(255,255,255,.55)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', border: '1px solid var(--line-2)', borderRadius: 20, overflow: 'hidden', maxWidth: 1200, marginLeft: 'auto', marginRight: 'auto', marginTop: 24, boxShadow: '0 24px 60px -30px rgba(124,58,237,.3)' }}>
        <HeroPanel
          kind="Build · 01"
          dotColor="var(--violet)"
          headline={<>On construit la&nbsp;machine.</>}
          sub="Sites, tunnels, plateformes sur-mesure, automatisations. Livrés en semaines, pas en trimestres."
          illus={<IllusFlow />}
        />
        <HeroSeparator />
        <HeroPanel
          kind="Ads · 02"
          dotColor="var(--ink)"
          headline={<>On la fait tourner à plein régime.</>}
          sub="Meta, Google, LinkedIn, TikTok. On baisse le CPL, puis on scale. Dans cet ordre."
          illus={<IllusCurve />}
        />
      </div>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════
// EXPERTISE
// ═════════════════════════════════════════════════════════════
export function KExpertise({ isMobile }) {
  const pad = isMobile ? '60px 20px' : '120px 120px';
  return (
    <section style={{ padding: pad, background: '#fff', borderTop: '1px solid var(--line-2)', borderBottom: '1px solid var(--line-2)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="k-section-label">
          <span className="k-section-label-sq"></span>
          01 — Positionnement
        </div>
        <h2 style={{ fontSize: isMobile ? 30 : 52, marginTop: 16, maxWidth: 900, letterSpacing: '-0.028em', lineHeight: 1.08 }}>
          Deux expertises. <span style={{ color: 'var(--muted)' }}>Une seule finalité&nbsp;:</span> des leads qualifiés qui signent.
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: isMobile ? 20 : 40, marginTop: isMobile ? 32 : 56 }}>
          {[
            { n: '01', t: 'Build sans Ads', d: 'Un funnel parfait qui ne voit aucun trafic. Investissement dormant.' },
            { n: '02', t: 'Ads sans Build', d: 'Du budget qui brûle sur une landing mal convertissante. Payer plus cher ses propres fuites.' },
            { n: '03', t: 'Build + Ads ensemble', d: 'Le funnel converti, le creative testé, le CPL maîtrisé. C’est à ce moment-là qu’on scale.', highlight: true },
          ].map((x) => (
            <div key={x.n} className={`k-pos-card ${x.highlight ? 'k-pos-card-active' : ''}`}>
              <div className="mono k-pos-num">{x.n}</div>
              <h3 style={{ fontSize: 20, marginTop: 10, fontWeight: 500 }}>{x.t}</h3>
              <p style={{ color: 'var(--muted)', fontSize: 14.5, marginTop: 10, lineHeight: 1.55 }}>{x.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════
// CAPACITIES
// ═════════════════════════════════════════════════════════════
export function KCapacities({ isMobile, caps }) {
  const pad = isMobile ? '60px 20px 40px' : '120px 120px 80px';
  return (
    <section style={{ padding: pad, background: 'var(--bg)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 32, flexWrap: 'wrap' }}>
          <div>
            <div className="k-section-label">
              <span className="k-section-label-sq"></span>
              02 — Capacités
            </div>
            <h2 style={{ fontSize: isMobile ? 36 : 64, marginTop: 20, letterSpacing: '-0.035em', maxWidth: 780, lineHeight: 1.02 }}>
              Six leviers concrets. <span style={{ color: 'var(--muted)' }}>Un seul objectif.</span>
            </h2>
          </div>
          {!isMobile && (
            <p style={{ color: 'var(--muted)', fontSize: 15, maxWidth: 340, lineHeight: 1.55 }}>
              Chaque capacité est cadrée, chiffrée, livrable en autonomie ou combinée à l'ensemble.
            </p>
          )}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: isMobile ? 16 : 20,
          marginTop: isMobile ? 32 : 48,
        }}>
          {caps.map((c, i) => (
            <div key={i} className="k-card">
              <div className="k-card-illus" style={{ height: isMobile ? 180 : 210, padding: isMobile ? '18px' : '22px', display: 'flex' }}>
                <div style={{ width: '100%', height: '100%' }}>
                  <c.Illus />
                </div>
              </div>
              <div style={{ padding: isMobile ? '20px 20px 24px' : '24px 24px 28px', borderTop: '1px solid var(--line-2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="mono" style={{ fontSize: 10.5, color: 'var(--violet)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                    {c.tag}
                  </span>
                  <span className="mono" style={{ fontSize: 10.5, color: 'var(--muted)' }}>
                    0{i + 1}
                  </span>
                </div>
                <h3 style={{ fontSize: isMobile ? 18 : 20, marginTop: 12, fontWeight: 500, letterSpacing: '-0.012em' }}>
                  {c.k}
                </h3>
                <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 8, lineHeight: 1.55 }}>
                  {c.d}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
