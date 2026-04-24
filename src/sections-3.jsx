import React, { useState, useRef } from 'react';
import { BOOKING_URL, CONTACT_EMAIL } from './config.js';
import { KairnMark } from './sections-1.jsx';

// ═════════════════════════════════════════════════════════════
// CASE STUDIES
// ═════════════════════════════════════════════════════════════
export function KCases({ isMobile, cases }) {
  const [idx, setIdx] = useState(0);
  const c = cases[idx];
  const next = () => setIdx((i) => (i + 1) % cases.length);
  const prev = () => setIdx((i) => (i - 1 + cases.length) % cases.length);
  const pad = isMobile ? '64px 20px' : '120px 120px';
  const arrowBtn = {
    width: 44, height: 44, borderRadius: '50%',
    background: '#fff', color: '#0A0A0A',
    border: 'none', cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    transition: 'transform .15s ease, opacity .15s ease',
  };
  const card = {
    background: 'rgba(255,255,255,.03)',
    border: '1px solid rgba(255,255,255,.08)',
    borderRadius: 16,
  };

  return (
    <section style={{ padding: pad, background: '#0A0A0A', color: '#fff', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)', width: 600, height: 400, background: 'radial-gradient(ellipse, rgba(139,92,246,.18), transparent 70%)', pointerEvents: 'none' }}></div>
      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 24, marginBottom: isMobile ? 32 : 48 }}>
          <div>
            <div className="k-section-label">
              <span className="k-section-label-sq"></span>
              06 — Réalisations
            </div>
            <h2 style={{ fontSize: isMobile ? 36 : 64, marginTop: 20, letterSpacing: '-0.035em', maxWidth: 780, lineHeight: 1.02 }}>
              Ce qu'on a livré. <span style={{ color: 'rgba(255,255,255,.5)' }}>Et ce que ça a donné.</span>
            </h2>
          </div>
          {!isMobile && (
            <div className="mono" style={{ fontSize: 12, color: 'rgba(255,255,255,.45)', letterSpacing: '0.18em' }}>
              {String(idx + 1).padStart(2, '0')} / {String(cases.length).padStart(2, '0')}
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '0.85fr 1.7fr 0.95fr', gap: 16, alignItems: 'stretch' }}>
          {/* KPIs */}
          <div style={{ display: 'flex', flexDirection: isMobile ? 'row' : 'column', gap: 14, overflowX: isMobile ? 'auto' : 'visible' }}>
            {c.kpis.map((k, i) => (
              <div key={i} style={{
                ...card,
                padding: '26px 22px',
                flex: 1,
                minWidth: isMobile ? 200 : 0,
                display: 'flex', flexDirection: 'column', justifyContent: 'center',
              }}>
                <div style={{
                  fontSize: isMobile ? 34 : 42,
                  lineHeight: 1, letterSpacing: '-0.03em', fontWeight: 500,
                  background: 'linear-gradient(180deg, #E9D5FF, #8B5CF6)',
                  WebkitBackgroundClip: 'text', backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  {k.value}
                </div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,.55)', marginTop: 10, lineHeight: 1.4 }}>
                  {k.label}
                </div>
              </div>
            ))}
          </div>

          {/* Case content */}
          <div style={{
            ...card,
            padding: isMobile ? 28 : '36px 40px',
            position: 'relative', overflow: 'hidden',
            minHeight: isMobile ? 0 : 420,
          }}>
            {c.company && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22, paddingBottom: 22, borderBottom: '1px solid rgba(255,255,255,.08)' }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: '#0A0A0A',
                  border: '1px solid rgba(255,255,255,.1)',
                  padding: 6, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <img src={c.company.logo} alt={c.company.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 500, color: '#fff', letterSpacing: '-0.01em' }}>{c.company.name}</div>
                  <div className="mono" style={{ fontSize: 11, color: 'rgba(196,181,253,.75)', letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 3 }}>
                    Cas client · {String(idx + 1).padStart(2, '0')} / {String(cases.length).padStart(2, '0')}
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 22 }}>
              {c.tags.map((t, i) => (
                <span key={i} style={{
                  fontSize: 12, padding: '6px 14px',
                  border: '1px solid rgba(255,255,255,.12)',
                  borderRadius: 999,
                  color: 'rgba(255,255,255,.82)',
                  background: 'rgba(255,255,255,.03)',
                }}>
                  {t}
                </span>
              ))}
            </div>

            <h3 style={{ fontSize: isMobile ? 22 : 32, lineHeight: 1.15, letterSpacing: '-0.025em', fontWeight: 500, marginBottom: 26, textWrap: 'balance' }}>
              {c.title}
            </h3>

            <div style={{ marginBottom: 18 }}>
              <div className="mono" style={{ fontSize: 12, color: 'rgba(255,255,255,.5)', letterSpacing: '0.06em', marginBottom: 8 }}>Challenge :</div>
              <p style={{ fontSize: 15, lineHeight: 1.55, color: 'rgba(255,255,255,.82)' }}>{c.challenge}</p>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,.1)', paddingTop: 18 }}>
              <div className="mono" style={{ fontSize: 12, color: '#C4B5FD', letterSpacing: '0.06em', marginBottom: 8 }}>Solution :</div>
              <p style={{ fontSize: 15, lineHeight: 1.55, color: 'rgba(255,255,255,.82)' }}>{c.solution}</p>
            </div>

            <div style={{ position: 'absolute', bottom: -60, right: -60, width: 220, height: 220, background: 'radial-gradient(circle, rgba(139,92,246,.22), transparent 70%)', pointerEvents: 'none' }}></div>
          </div>

          {/* Quote */}
          <div style={{
            ...card,
            padding: '30px 26px',
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: 'rgba(255,255,255,.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 22,
            }}>
              <svg width="16" height="13" viewBox="0 0 16 13" fill="none">
                <path d="M0 13 V6 C0 2 2 0 5 0 V2.5 C3.5 2.5 2.5 3.5 2.5 5 H5 V13 H0 Z M9 13 V6 C9 2 11 0 14 0 V2.5 C12.5 2.5 11.5 3.5 11.5 5 H14 V13 H9 Z" fill="rgba(255,255,255,.45)" />
              </svg>
            </div>
            <p style={{ fontSize: 14.5, lineHeight: 1.55, color: 'rgba(255,255,255,.82)', flex: 1 }}>
              “{c.quote}”
            </p>
            <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,.55)', marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,.08)' }}>
              {c.author}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14, marginTop: 36 }}>
          <button onClick={prev} style={arrowBtn} aria-label="Projet précédent">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M11 7 L3 7 M7 3 L3 7 L7 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button onClick={next} style={arrowBtn} aria-label="Projet suivant">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7 L11 7 M7 3 L11 7 L7 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      </div>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════
// TESTIMONIALS
// ═════════════════════════════════════════════════════════════
export function KTestimonials({ isMobile, items, cols = 3, sectionNumber = '07' }) {
  const pad = isMobile ? '80px 0 80px 20px' : '140px 0 140px 120px';
  const tones = ['light', 'violet', 'ink', 'light', 'violet', 'ink'];
  const cardStyle = (tone, long) => {
    const base = {
      padding: isMobile ? '32px 26px' : '40px 36px',
      borderRadius: 20,
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      minHeight: long ? (isMobile ? 340 : 380) : (isMobile ? 280 : 320),
      flex: '0 0 auto',
      width: isMobile ? 300 : long ? 520 : 400,
      scrollSnapAlign: 'start',
      position: 'relative', overflow: 'hidden',
      transition: 'transform .25s ease',
    };
    if (tone === 'violet') return { ...base, background: 'linear-gradient(155deg, #FAF5FF 0%, #EDE4FF 100%)', border: '1px solid rgba(139,92,246,.14)', color: 'var(--ink)' };
    if (tone === 'ink') return { ...base, background: '#0A0A0A', border: '1px solid rgba(255,255,255,.08)', color: '#fff' };
    return { ...base, background: '#fff', border: '1px solid var(--line-2)', color: 'var(--ink)' };
  };

  return (
    <section style={{ padding: pad, background: '#fff', borderTop: '1px solid var(--line-2)', borderBottom: '1px solid var(--line-2)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -150, right: '-10%', width: 600, height: 500, background: 'radial-gradient(ellipse, rgba(139,92,246,.07), transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -200, left: '-10%', width: 500, height: 400, background: 'radial-gradient(ellipse, rgba(196,181,253,.08), transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', paddingRight: isMobile ? 0 : 120, position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 24, marginBottom: isMobile ? 36 : 56 }}>
          <div>
            <div className="k-section-label">
              <span className="k-section-label-sq"></span>
              {sectionNumber} — Témoignages
            </div>
            <h2 style={{ fontSize: isMobile ? 36 : 64, marginTop: 20, letterSpacing: '-0.035em', maxWidth: 820, lineHeight: 1.02, textWrap: 'balance' }}>
              Ils nous ont fait confiance. <span style={{ color: 'var(--muted)' }}>Voilà ce qu'ils en disent.</span>
            </h2>
          </div>
        </div>
      </div>

      <div className="k-scroll-hide" style={{
        display: 'flex',
        gap: isMobile ? 14 : 20,
        overflowX: 'auto',
        scrollSnapType: 'x mandatory',
        paddingRight: isMobile ? 20 : 120,
        paddingLeft: 0,
        paddingBottom: 4,
        position: 'relative',
      }}>
        {items.map((t, i) => {
          const tone = tones[i % tones.length];
          const long = t.q.length > 220;
          const isInk = tone === 'ink';
          const mutedColor = isInk ? 'rgba(255,255,255,.55)' : 'var(--muted)';
          const bodyColor = isInk ? 'rgba(255,255,255,.92)' : 'var(--ink)';
          const nameColor = isInk ? '#fff' : 'var(--ink)';
          const sepColor = isInk ? 'rgba(255,255,255,.1)' : 'var(--line-2)';
          const quoteColor = tone === 'violet' ? '#8B5CF6' : isInk ? 'rgba(255,255,255,.22)' : '#C4B5FD';
          return (
            <article key={i} style={cardStyle(tone, long)}>
              {isInk && (
                <div style={{ position: 'absolute', top: 0, right: 0, width: 280, height: 280, background: 'radial-gradient(circle at top right, rgba(139,92,246,.35), transparent 60%)', pointerEvents: 'none' }} />
              )}
              {tone === 'violet' && (
                <div style={{ position: 'absolute', bottom: -40, right: -40, width: 180, height: 180, background: 'radial-gradient(circle, rgba(139,92,246,.14), transparent 70%)', pointerEvents: 'none' }} />
              )}

              <div style={{ position: 'relative' }}>
                <svg width={isMobile ? 28 : 34} height={isMobile ? 22 : 27} viewBox="0 0 34 27" fill="none" style={{ marginBottom: isMobile ? 18 : 24, color: quoteColor, display: 'block' }}>
                  <path d="M0 27 V13 C0 4 5 0 13 0 V5 C8 5 6 6.5 6 10 H13 V27 H0 Z M20 27 V13 C20 4 25 0 33 0 V5 C28 5 26 6.5 26 10 H33 V27 H20 Z" fill="currentColor" />
                </svg>
                <p style={{ fontSize: isMobile ? 15.5 : long ? 18 : 16.5, lineHeight: 1.55, letterSpacing: '-0.01em', color: bodyColor, fontWeight: long ? 400 : 400 }}>
                  {t.q}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 28, paddingTop: 22, borderTop: `1px solid ${sepColor}`, position: 'relative' }}>
                {t.logoEl ? (
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: isInk ? 'rgba(255,255,255,.08)' : '#0A0A0A',
                    border: isInk ? '1px solid rgba(255,255,255,.1)' : '1px solid var(--line-2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', flexShrink: 0,
                  }}>
                    {t.logoEl}
                  </div>
                ) : t.logo ? (
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: '#0A0A0A',
                    border: isInk ? '1px solid rgba(255,255,255,.1)' : '1px solid var(--line-2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: 6, flexShrink: 0,
                  }}>
                    <img src={t.logo} alt={t.c} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                ) : (
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #C4B5FD, #8B5CF6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: 500, fontSize: 15, flexShrink: 0,
                  }}>
                    {t.n.split(' ').map(x => x[0]).join('')}
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 500, color: nameColor, letterSpacing: '-0.005em' }}>{t.n}</div>
                  <div className="mono" style={{ fontSize: 11, color: mutedColor, letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.p} · {t.c}</div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════
// LOGOS STRIP
// ═════════════════════════════════════════════════════════════
export function KLogos({ isMobile }) {
  const brands = [
    {
      name: 'TradeAuto',
      logo: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M3 12 L4 8 C4.2 7.2 4.8 7 5.5 7 H14.5 C15.2 7 15.8 7.2 16 8 L17 12 V14 H15 V13 H5 V14 H3 Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
          <circle cx="6.5" cy="13.5" r="1.2" fill="currentColor" />
          <circle cx="13.5" cy="13.5" r="1.2" fill="currentColor" />
        </svg>
      ),
    },
    {
      name: 'Rénovia',
      logo: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M3 10 L10 4 L17 10 V16 H12 V12 H8 V16 H3 Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      name: 'MadameLaGouvernante',
      logo: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 3 L10 17 M5 6 L15 6 M6 10 L14 10 M7 14 L13 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      name: 'Lumibat',
      logo: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="3" fill="currentColor" />
          <path d="M10 2 V5 M10 15 V18 M2 10 H5 M15 10 H18 M4.5 4.5 L6.5 6.5 M13.5 13.5 L15.5 15.5 M4.5 15.5 L6.5 13.5 M13.5 6.5 L15.5 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      name: 'Cabinet Véran',
      logo: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M4 17 V8 L10 3 L16 8 V17" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
          <path d="M8 17 V12 H12 V17" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
          <circle cx="10" cy="8.5" r="1" fill="currentColor" />
        </svg>
      ),
    },
    {
      name: 'BistroNomie',
      logo: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M4 9 C4 6 6.5 4 10 4 C13.5 4 16 6 16 9 C16 10 15.5 10.5 14.5 10.5 H5.5 C4.5 10.5 4 10 4 9 Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
          <path d="M10 10.5 V16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M6 16 H14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      name: 'Atelier Sombre',
      logo: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.4" />
          <path d="M10 3 A7 7 0 0 1 10 17 Z" fill="currentColor" />
        </svg>
      ),
    },
    {
      name: 'Fleuriste Mira',
      logo: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="2" fill="currentColor" />
          <circle cx="10" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="10" cy="15" r="2.5" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="5" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="15" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      ),
    },
    {
      name: 'Studio Kano',
      logo: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M4 4 V16 M4 10 L14 4 M4 10 L14 16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      name: 'Pharmacie Opale',
      logo: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 4 V16 M4 10 H16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      name: 'Voltéa',
      logo: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M11 3 L5 11 H9 L8 17 L15 9 H11 Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" fill="none" />
        </svg>
      ),
    },
    {
      name: 'Maison Clovis',
      logo: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M3 17 V9 L10 3 L17 9 V17 Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
          <path d="M8 17 V13 H12 V17" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
          <path d="M10 3 V6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      name: 'Nord & Fils',
      logo: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 3 L12 10 L10 17 L8 10 Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
          <path d="M3 10 L10 8 L17 10 L10 12 Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      name: 'Slashly',
      logo: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M14 3 L6 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="6" cy="5" r="1.5" fill="currentColor" />
          <circle cx="14" cy="15" r="1.5" fill="currentColor" />
        </svg>
      ),
    },
    {
      name: 'Nebulo',
      logo: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="3.5" fill="currentColor" />
          <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 2" />
        </svg>
      ),
    },
    {
      name: 'Forkpath',
      logo: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="5" cy="5" r="1.8" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="15" cy="5" r="1.8" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="10" cy="15" r="1.8" stroke="currentColor" strokeWidth="1.4" />
          <path d="M5 6.8 V11 C5 12 6 13 7 13 H10 M15 6.8 V11 C15 12 14 13 13 13 H10 M10 13 V13.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      ),
    },
  ];
  const LogoItem = ({ brand }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, opacity: .55, color: 'var(--ink)' }}>
      {brand.logo}
      <span style={{ fontSize: 19, fontWeight: 500, letterSpacing: '-0.025em' }}>{brand.name}</span>
    </div>
  );
  return (
    <section style={{ padding: isMobile ? '48px 0' : '72px 0', background: 'var(--bg)' }}>
      <div style={{ textAlign: 'center', marginBottom: isMobile ? 28 : 40 }}>
        <p className="mono" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
          Des équipes qui nous font confiance
        </p>
      </div>
      <div className="k-logo-mask">
        <div className="k-logo-track">
          {[...brands, ...brands, ...brands].map((b, i) => (
            <LogoItem key={i} brand={b} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════
// FAQ
// ═════════════════════════════════════════════════════════════
export function KFAQ({ isMobile, items }) {
  const [open, setOpen] = useState(0);
  const pad = isMobile ? '60px 20px' : '120px 120px';
  return (
    <section style={{ padding: pad, background: '#fff', borderTop: '1px solid var(--line-2)' }}>
      <div style={{ maxWidth: 1040, margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.1fr 1.4fr', gap: isMobile ? 32 : 64 }}>
        <div>
          <div className="k-section-label">
            <span className="k-section-label-sq"></span>
            08 — FAQ
          </div>
          <h2 style={{ fontSize: isMobile ? 28 : 44, marginTop: 20, letterSpacing: '-0.03em', lineHeight: 1.08, textWrap: 'balance' }}>
            Les questions qu'on nous pose.
          </h2>
          {!isMobile && (
            <p style={{ color: 'var(--muted)', fontSize: 14.5, marginTop: 16, lineHeight: 1.55, maxWidth: 280 }}>
              Une question qui n’est pas ici&nbsp;? On y répond en 24h par email.
            </p>
          )}
        </div>
        <div>
          {items.map((item, i) => (
            <div key={i} className={`k-faq-item ${open === i ? 'open' : ''}`}>
              <button className="k-faq-trigger" onClick={() => setOpen(open === i ? -1 : i)}>
                <span style={{ fontSize: isMobile ? 15.5 : 17, fontWeight: 500, letterSpacing: '-0.01em' }}>
                  {item.q}
                </span>
                <span className="k-faq-plus"></span>
              </button>
              <div className="k-faq-panel">
                <p style={{ color: 'var(--muted)', fontSize: 14.5, lineHeight: 1.6, paddingBottom: 22, maxWidth: 540 }}>
                  {item.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════
// FINAL CTA
// ═════════════════════════════════════════════════════════════
export function KFinalCTA({ isMobile }) {
  const pad = isMobile ? '80px 20px 90px' : '140px 120px 150px';

  const steps = [
    { n: '01', t: 'On échange 30 min', d: 'Vous nous racontez où vous en êtes. On pose les bonnes questions.' },
    { n: '02', t: 'Audit sous 48h', d: 'Diagnostic chiffré de votre stack + plan d\'action priorisé.' },
    { n: '03', t: 'Mission lancée', d: 'Si le match est là, on démarre. Sinon on vous recommande.' },
  ];

  return (
    <section className="k-cta-final" style={{ padding: pad, position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1040, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
        <span className="k-eyebrow">
          <span className="k-eyebrow-dot"></span>
          Prochaine disponibilité · T2 2026
        </span>

        <h2 style={{
          fontSize: isMobile ? 44 : 96,
          marginTop: 28,
          letterSpacing: '-0.04em', lineHeight: 0.96,
          color: 'var(--ink)',
          fontWeight: 600,
          textWrap: 'balance',
        }}>
          Parlons de<br />votre projet.
        </h2>

        <p style={{
          fontSize: isMobile ? 16 : 19,
          color: 'rgba(31,27,46,.72)',
          marginTop: 24, lineHeight: 1.55,
          maxWidth: 560,
          marginLeft: 'auto', marginRight: 'auto',
        }}>
          30 minutes suffisent pour savoir si on peut vous aider. Pas de pitch commercial — juste un audit honnête.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 36, flexWrap: 'wrap' }}>
          <a className="k-cta" href={BOOKING_URL} target="_blank" rel="noopener noreferrer" style={{ padding: '16px 26px', fontSize: 16 }}>
            Réserver 30 minutes
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7 L11 7 M7 3 L11 7 L7 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </a>
          <a className="k-cta k-cta-ghost" href={`mailto:${CONTACT_EMAIL}`} style={{ padding: '16px 22px', fontSize: 14.5, borderColor: 'rgba(10,10,10,.18)', fontFamily: 'Geist Mono, monospace', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="3" width="11" height="8" rx="1.2" stroke="currentColor" strokeWidth="1.3" /><path d="M2 4 L7 8 L12 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
            {CONTACT_EMAIL}
          </a>
        </div>

        {/* What happens next — 3 steps */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: isMobile ? 12 : 16,
          margin: isMobile ? '60px auto 0' : '80px auto 0',
          maxWidth: 960,
        }}>
          {steps.map((s) => (
            <div key={s.n} style={{
              padding: '22px 24px',
              borderRadius: 14,
              background: '#fff',
              border: '1px solid var(--line-2)',
              textAlign: 'left',
              display: 'flex',
              gap: 14,
              alignItems: 'flex-start',
              boxShadow: '0 1px 2px rgba(10,10,10,.02), 0 12px 30px -20px rgba(124,58,237,.2)',
              transition: 'transform .3s, box-shadow .3s, border-color .3s',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'rgba(139,92,246,.3)'; e.currentTarget.style.boxShadow = '0 1px 2px rgba(10,10,10,.02), 0 20px 40px -18px rgba(124,58,237,.3)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = ''; e.currentTarget.style.boxShadow = '0 1px 2px rgba(10,10,10,.02), 0 12px 30px -20px rgba(124,58,237,.2)'; }}
            >
              <span style={{
                fontFamily: 'Geist Mono, monospace',
                fontSize: 11, fontWeight: 600,
                padding: '4px 9px', borderRadius: 6,
                background: 'rgba(139,92,246,.12)',
                color: 'var(--violet-deep)',
                letterSpacing: '0.1em',
                flexShrink: 0,
                height: 'fit-content',
              }}>{s.n}</span>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--ink)' }}>{s.t}</div>
                <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6, lineHeight: 1.55 }}>{s.d}</div>
              </div>
            </div>
          ))}
        </div>

        {/* meta footer */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 14,
          marginTop: 40,
          flexWrap: 'wrap',
          fontFamily: 'Geist Mono, monospace',
          fontSize: 11.5,
          color: 'rgba(31,27,46,.5)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="4.8" stroke="currentColor" strokeWidth="1.1" /><path d="M6 3.3 L6 6 L8 7.3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" /></svg>
            Réponse sous 24h
          </span>
          <span style={{ color: 'rgba(139,92,246,.35)' }}>·</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="1.5" y="2.5" width="9" height="7" rx="1" stroke="currentColor" strokeWidth="1.1" /><circle cx="6" cy="6" r="1.3" stroke="currentColor" strokeWidth="1.1" /></svg>
            Calls en visio
          </span>
          <span style={{ color: 'rgba(139,92,246,.35)' }}>·</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="1.5" y="2" width="9" height="8.5" rx="1.2" stroke="currentColor" strokeWidth="1.1" /><path d="M1.5 4.5 L10.5 4.5 M4 1 L4 3 M8 1 L8 3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" /></svg>
            Créneaux dès cette semaine
          </span>
        </div>
      </div>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════
// FOOTER
// ═════════════════════════════════════════════════════════════
export function KFooter({ isMobile }) {
  const pad = isMobile ? '48px 20px 32px' : '64px 120px 40px';
  const cols = [
    { t: 'Services', items: ['Build', 'Ads', 'Audit', 'Dashboards'] },
    { t: 'Ressources', items: ['Réalisations', 'Playbook Ads', 'Contact'] },
    { t: 'Légal', items: ['Mentions légales', 'Confidentialité', 'CGV'] },
  ];
  return (
    <footer style={{ padding: pad, background: '#0A0A0A', color: '#fff' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr 1fr' : '1.6fr 1fr 1fr 1fr',
          gap: isMobile ? 32 : 48,
        }}>
          <div style={{ gridColumn: isMobile ? 'span 2' : 'auto' }}>
            <span className="k-logo" style={{ color: '#fff' }}>
              <KairnMark />
              Kairn
            </span>
            <p style={{ color: 'rgba(255,255,255,.55)', fontSize: 14, marginTop: 16, maxWidth: 280, lineHeight: 1.55 }}>
              Agence Build & Ads. On construit les machines qui convertissent, on les fait tourner à plein régime.
            </p>
          </div>
          {cols.map(c => (
            <div key={c.t}>
              <div className="mono" style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                {c.t}
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '16px 0 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {c.items.map(x => (
                  <li key={x}><a style={{ color: 'rgba(255,255,255,.75)', fontSize: 14 }}>{x}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{
          marginTop: isMobile ? 40 : 64, paddingTop: 24,
          borderTop: '1px solid rgba(255,255,255,.1)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16,
        }}>
          <span className="mono" style={{ fontSize: 11.5, color: 'rgba(255,255,255,.4)' }}>
            © 2026 Kairn
          </span>
          <span className="mono" style={{ fontSize: 11.5, color: 'rgba(255,255,255,.55)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#8B5CF6', boxShadow: '0 0 8px rgba(139,92,246,.8)' }}></span>
            Systèmes opérationnels
          </span>
        </div>
      </div>
    </footer>
  );
}
