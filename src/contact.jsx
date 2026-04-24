import React from 'react';
import { KNav } from './sections-1.jsx';
import { KFAQ, KFooter } from './sections-3.jsx';
import { BOOKING_URL, CONTACT_EMAIL } from './config.js';

// ═════════════════════════════════════════════════════════════
// CONTACT HERO
// ═════════════════════════════════════════════════════════════
function ContactHero({ isMobile }) {
  return (
    <section className="k-hero k-hero-bg" style={{ position: 'relative', paddingBottom: isMobile ? 40 : 72 }}>
      <div className="k-hero-blob" style={{ width: 440, height: 440, background: '#C4B5FD', top: -120, left: '16%' }}></div>
      <div className="k-hero-blob" style={{ width: 520, height: 520, background: '#8B5CF6', top: -60, right: '10%', opacity: .24, animationDelay: '-6s' }}></div>

      <div style={{ textAlign: 'center', paddingTop: isMobile ? 40 : 80, position: 'relative' }}>
        <span className="k-eyebrow">
          <span className="k-eyebrow-dot"></span>
          Contact · Réponse sous 24h ouvrées
        </span>
      </div>

      <h1 className="k-hero-headline" style={{ fontSize: isMobile ? 42 : 88, marginTop: isMobile ? 20 : 32 }}>
        Parlons de <em>votre projet</em>.
      </h1>
      <p className="k-hero-sub" style={{ fontSize: isMobile ? 16 : 19, marginTop: isMobile ? 20 : 28 }}>
        Le plus rapide : un <strong style={{ color: 'var(--ink)', fontWeight: 500 }}>RDV de 30 min</strong>. Le plus asynchrone : un email détaillé. Dans les deux cas, réponse honnête — on dit oui, non, ou on vous renvoie vers quelqu'un de mieux placé.
      </p>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════
// CONTACT METHODS — main actions grid
// ═════════════════════════════════════════════════════════════
function ContactMethods({ isMobile }) {
  const pad = isMobile ? '40px 20px 60px' : '60px 120px 100px';
  const methods = [
    {
      tag: 'Recommandé',
      title: 'Réserver 30 min',
      description: 'Audit honnête de votre contexte. Pas de pitch commercial. On identifie si Kairn peut aider et sinon, on vous renvoie vers mieux adapté.',
      action: 'Ouvrir le calendrier',
      href: BOOKING_URL,
      external: true,
      icon: 'calendar',
      primary: true,
    },
    {
      tag: 'Le plus détaillé',
      title: 'Email',
      description: 'Écrivez directement à l\'équipe — brief, contexte, budget, timeline. On répond en moins de 24h ouvrées.',
      action: CONTACT_EMAIL,
      href: `mailto:${CONTACT_EMAIL}`,
      icon: 'mail',
    },
    {
      tag: 'Asynchrone',
      title: 'LinkedIn',
      description: 'Ugo Gianeselli (fondateur) répond personnellement aux messages. Idéal pour les questions rapides ou les intros.',
      action: 'Voir le profil',
      href: 'https://www.linkedin.com/',
      external: true,
      icon: 'linkedin',
    },
  ];
  const Icon = ({ name }) => {
    const common = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };
    if (name === 'calendar') return <svg {...common}><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>;
    if (name === 'mail') return <svg {...common}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>;
    return <svg {...common}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>;
  };
  return (
    <section style={{ padding: pad, background: 'var(--bg)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? 16 : 20 }}>
          {methods.map((m) => (
            <a
              key={m.title}
              href={m.href}
              target={m.external ? '_blank' : undefined}
              rel={m.external ? 'noopener noreferrer' : undefined}
              style={{
                display: 'flex', flexDirection: 'column',
                padding: '32px 28px 32px',
                borderRadius: 18,
                background: m.primary
                  ? 'linear-gradient(180deg, #1A1033 0%, #0A0A0A 100%)'
                  : '#fff',
                color: m.primary ? '#fff' : 'var(--ink)',
                border: m.primary ? '1px solid rgba(139,92,246,.3)' : '1px solid var(--line-2)',
                boxShadow: m.primary
                  ? '0 30px 80px -20px rgba(124,58,237,.45)'
                  : '0 2px 0 rgba(10,10,10,.02)',
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform .25s, box-shadow .25s',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = m.primary ? '0 36px 90px -22px rgba(124,58,237,.55)' : '0 24px 50px -24px rgba(124,58,237,.2)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = m.primary ? '0 30px 80px -20px rgba(124,58,237,.45)' : '0 2px 0 rgba(10,10,10,.02)'; }}
            >
              {m.primary && (
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 80% 0%, rgba(139,92,246,.35), transparent 60%)', pointerEvents: 'none' }}></div>
              )}
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 10,
                    background: m.primary
                      ? 'rgba(139,92,246,.22)'
                      : 'linear-gradient(135deg, #8B5CF6, #6D28D9)',
                    color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: m.primary ? 'inset 0 1px 0 rgba(196,181,253,.4)' : '0 8px 20px -6px rgba(124,58,237,.5)',
                  }}>
                    <Icon name={m.icon} />
                  </div>
                  <span className="mono" style={{
                    fontSize: 10.5, padding: '5px 10px', borderRadius: 999,
                    background: m.primary ? 'rgba(255,255,255,.08)' : 'rgba(139,92,246,.1)',
                    color: m.primary ? 'rgba(196,181,253,.9)' : 'var(--violet-deep)',
                    border: m.primary ? '1px solid rgba(196,181,253,.3)' : '1px solid rgba(139,92,246,.15)',
                    letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 500,
                  }}>
                    {m.tag}
                  </span>
                </div>
                <h3 style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.025em', marginTop: 24 }}>
                  {m.title}
                </h3>
                <p style={{ fontSize: 14.5, color: m.primary ? 'rgba(255,255,255,.7)' : 'var(--muted)', marginTop: 12, lineHeight: 1.6, flex: 1 }}>
                  {m.description}
                </p>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  marginTop: 24, paddingTop: 18,
                  borderTop: m.primary ? '1px solid rgba(255,255,255,.12)' : '1px solid var(--line-2)',
                  fontSize: 14.5, fontWeight: 500,
                  color: m.primary ? '#C4B5FD' : 'var(--violet)',
                }}>
                  {m.action}
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7 L11 7 M7 3 L11 7 L7 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════
// WHAT TO EXPECT
// ═════════════════════════════════════════════════════════════
function ContactProcess({ isMobile }) {
  const pad = isMobile ? '60px 20px' : '100px 120px';
  const steps = [
    { n: '01', t: 'Vous nous écrivez', d: 'Email, Calendly, ou LinkedIn. Peu importe.' },
    { n: '02', t: 'On répond sous 24h', d: 'Jour ouvré, en français ou en anglais selon votre préférence.' },
    { n: '03', t: 'Premier call · 30 min', d: 'Audit rapide de votre contexte. Aucune obligation de suite.' },
    { n: '04', t: 'Proposition sous 5 jours', d: 'Si match : scope, timeline, prix. Si pas match : intro vers une agence mieux placée.' },
  ];
  return (
    <section style={{ padding: pad, background: '#fff', borderTop: '1px solid var(--line-2)', borderBottom: '1px solid var(--line-2)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="k-section-label">
          <span className="k-section-label-sq"></span>
          01 — Ce qui se passe après
        </div>
        <h2 style={{ fontSize: isMobile ? 34 : 56, marginTop: 20, letterSpacing: '-0.035em', maxWidth: 820, lineHeight: 1.04 }}>
          Le parcours. <span style={{ color: 'var(--muted)' }}>Prévisible. Sans surprise.</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)', gap: isMobile ? 16 : 20, marginTop: isMobile ? 32 : 48 }}>
          {steps.map((s) => (
            <div key={s.n} style={{
              padding: '28px 24px',
              borderRadius: 14,
              background: 'linear-gradient(180deg, #FBFAFF 0%, #F5F3FF 100%)',
              border: '1px solid var(--line-2)',
            }}>
              <div className="mono" style={{ fontSize: 11, color: 'var(--violet)', letterSpacing: '0.14em' }}>{s.n}</div>
              <h3 style={{ fontSize: 17, fontWeight: 500, letterSpacing: '-0.012em', marginTop: 14 }}>{s.t}</h3>
              <p style={{ color: 'var(--muted)', fontSize: 13.5, marginTop: 8, lineHeight: 1.55 }}>{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════
// AVAILABILITY & TIMEZONES
// ═════════════════════════════════════════════════════════════
function ContactAvailability({ isMobile }) {
  const pad = isMobile ? '60px 20px' : '120px 120px';
  const days = [
    { d: 'Lun', h: '9h — 19h', open: true },
    { d: 'Mar', h: '9h — 19h', open: true },
    { d: 'Mer', h: '9h — 19h', open: true },
    { d: 'Jeu', h: '9h — 19h', open: true },
    { d: 'Ven', h: '9h — 19h', open: true },
    { d: 'Sam', h: '9h — 19h', open: true },
    { d: 'Dim', h: 'Fermé', open: false },
  ];
  return (
    <section style={{ padding: pad, background: 'linear-gradient(180deg, #F5F3FF 0%, #FAFAFA 60%, #F5F3FF 100%)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="k-section-label">
          <span className="k-section-label-sq"></span>
          02 — Disponibilité
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 28 : 60, marginTop: 20, alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: isMobile ? 34 : 52, letterSpacing: '-0.035em', lineHeight: 1.04 }}>
              Entre Bordeaux et Genève. <span style={{ color: 'var(--muted)' }}>Six jours sur sept.</span>
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: isMobile ? 15 : 16, marginTop: 20, lineHeight: 1.6, maxWidth: 440 }}>
              Ouverts de 9h à 19h, fermés le dimanche. Réponse sous 24h ouvrées — les urgences passent par Slack partagé sur les missions actives.
            </p>
          </div>
          <div style={{
            padding: '24px 28px 26px',
            borderRadius: 18,
            background: '#fff',
            border: '1px solid var(--line-2)',
            boxShadow: '0 24px 60px -30px rgba(124,58,237,.15)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 52, height: 52, borderRadius: '50%',
                background: 'radial-gradient(circle at 35% 30%, #C4B5FD, #8B5CF6 65%)',
                border: '1px solid rgba(139,92,246,.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 6px 16px -4px rgba(124,58,237,.4), inset 0 1px 0 rgba(255,255,255,.4)',
              }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#fff', boxShadow: '0 0 10px rgba(255,255,255,.9)' }}></span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em' }}>Bordeaux · Genève</div>
                <div className="mono" style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2, letterSpacing: '0.06em' }}>
                  CET · UTC+1
                </div>
              </div>
              <span className="k-proc-kpi">
                <span className="k-proc-kpi-dot"></span>En ligne
              </span>
            </div>
            <div style={{ height: 1, background: 'var(--line-2)', margin: '20px 0' }}></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {days.map((x) => (
                <div key={x.d} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  fontSize: 13.5,
                  color: x.open ? 'var(--ink-soft)' : 'var(--muted)',
                  fontFamily: 'Geist Mono, monospace',
                  letterSpacing: '0.02em',
                }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: x.open ? 'var(--violet)' : 'var(--line-2)',
                      boxShadow: x.open ? '0 0 6px rgba(139,92,246,.6)' : 'none',
                    }}></span>
                    {x.d}
                  </span>
                  <span style={{ fontWeight: x.open ? 500 : 400 }}>{x.h}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════
// DIRECT CTA (simplified — replaces KFinalCTA for this page)
// ═════════════════════════════════════════════════════════════
function ContactDirectCTA({ isMobile }) {
  const pad = isMobile ? '72px 20px' : '120px 120px';
  return (
    <section className="k-cta-final" style={{ padding: pad }}>
      <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
        <span className="k-eyebrow" style={{ background: 'rgba(255,255,255,.55)' }}>
          <span className="k-eyebrow-dot"></span>
          Prochaine disponibilité · T2 2026
        </span>
        <h2 style={{
          fontSize: isMobile ? 40 : 72, marginTop: 24,
          letterSpacing: '-0.04em', lineHeight: 0.98,
          color: 'var(--ink)',
        }}>
          Le plus simple, c'est de nous parler.
        </h2>
        <p style={{ fontSize: isMobile ? 16 : 18, color: 'rgba(31,27,46,.72)', marginTop: 20, lineHeight: 1.5, maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' }}>
          30 minutes pour savoir si on peut aider — ou vous recommander quelqu'un qui le pourra.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 32, flexWrap: 'wrap' }}>
          <a className="k-cta" href={BOOKING_URL} target="_blank" rel="noopener noreferrer" style={{ padding: '16px 26px', fontSize: 16 }}>
            Ouvrir le calendrier
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7 L11 7 M7 3 L11 7 L7 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </a>
          <a className="k-cta k-cta-ghost" href={`mailto:${CONTACT_EMAIL}`} style={{ padding: '16px 22px', fontSize: 15, borderColor: 'rgba(10,10,10,.2)' }}>
            {CONTACT_EMAIL}
          </a>
        </div>
      </div>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════
// CONTACT PAGE ROOT
// ═════════════════════════════════════════════════════════════
const CONTACT_FAQ = [
  { q: 'Quel est le délai de réponse moyen ?', a: 'Moins de 24h ouvrées sur email. Immédiat sur Calendly (vous réservez directement un créneau).' },
  { q: 'Travaillez-vous avec des clients hors France ?', a: 'Oui. 40% de nos clients sont hors France (UK, Suisse, Canada, Belgique, Portugal). Calls en EN si besoin, reporting en EN.' },
  { q: 'Que dois-je préparer pour le premier call ?', a: 'Rien de formel. Un brief écrit — même approximatif — aide à gagner du temps, mais on peut aussi découvrir votre contexte ensemble. Pas de pitch à faire, pas de test à passer : le call sert à aligner, pas à vous juger.' },
  { q: 'Est-ce que vous signez des NDA ?', a: 'Oui, mutuel. On envoie un NDA type au premier call si vous préférez échanger sous protection. Mais 90% des conversations initiales se font sans, en toute confiance.' },
  { q: 'Puis-je venir vous rencontrer ?', a: 'Les échanges se font 100% en visio pour l\'instant, pas de rendez-vous physique. Ça nous permet de tenir les délais, de répondre plus vite, et de travailler avec des clients partout en France et à l\'international.' },
];

export default function ContactPage({ variant = 'desktop' }) {
  const isMobile = variant === 'mobile';
  return (
    <div className="kairn">
      <KNav isMobile={isMobile} />
      <ContactHero isMobile={isMobile} />
      <ContactMethods isMobile={isMobile} />
      <ContactProcess isMobile={isMobile} />
      <ContactAvailability isMobile={isMobile} />
      <KFAQ isMobile={isMobile} items={CONTACT_FAQ} sectionNumber="03" />
      <ContactDirectCTA isMobile={isMobile} />
      <KFooter isMobile={isMobile} />
      {isMobile && (
        <div style={{ position: 'sticky', bottom: 0, padding: '0 0 12px', pointerEvents: 'none' }}>
          <a className="k-mob-cta" href={BOOKING_URL} target="_blank" rel="noopener noreferrer" style={{ pointerEvents: 'auto', textDecoration: 'none' }}>
            <span style={{ fontSize: 14, fontWeight: 500 }}>Le plus rapide.</span>
            <span style={{ fontSize: 13, color: '#C4B5FD', fontWeight: 500 }}>Réserver 30 min →</span>
          </a>
        </div>
      )}
    </div>
  );
}
