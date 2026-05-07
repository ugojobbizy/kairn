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
    document.title = 'Kairn — Landing page + Ads tout-en-un · Romandie';
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
function LandingHero({ isMobile, onScrollToOffer, onScrollToProof }) {
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
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-label="Suisse" style={{ flexShrink: 0 }}>
            <rect width="14" height="10" rx="1.5" fill="#D52B1E" />
            <rect x="5.7" y="1.8" width="2.6" height="6.4" fill="#fff" />
            <rect x="3" y="4.3" width="8" height="1.4" fill="#fff" />
          </svg>
          <span className="mono" style={{ fontSize: 11, color: 'var(--violet-deep)', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 500 }}>
            Landing Page + Ads · Tout-en-un
          </span>
        </span>
      </div>

      <h1 className="k-hero-headline" style={{
        fontSize: isMobile ? 44 : 104, marginTop: isMobile ? 24 : 38,
        textAlign: 'center', maxWidth: 1180, marginLeft: 'auto', marginRight: 'auto',
        letterSpacing: '-0.05em', lineHeight: 0.94, fontWeight: 500,
      }}>
        <style>{`
          @keyframes k-hero-5x-shimmer {
            0%, 88%, 100% { background-position: 0% 50%; }
            44% { background-position: 100% 50%; }
          }
          @keyframes k-hero-5x-swell {
            0%, 100% { transform: scale(1); filter: drop-shadow(0 0 0 rgba(124,58,237,0)); }
            50% { transform: scale(1.08); filter: drop-shadow(0 6px 22px rgba(124,58,237,.5)); }
          }
          .k-hero-5x-wrap {
            display: inline-block;
            line-height: 1.18;
            padding: 0.05em 0.06em 0.14em;
            vertical-align: -0.04em;
          }
          .k-hero-5x {
            display: inline-block;
            background: linear-gradient(120deg, #8B5CF6 0%, #6D28D9 40%, #C4B5FD 50%, #6D28D9 60%, #8B5CF6 100%);
            background-size: 220% 100%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            transform-origin: 50% 60%;
            animation: k-hero-5x-shimmer 3.2s ease-in-out infinite, k-hero-5x-swell 3.2s ease-in-out infinite;
          }
        `}</style>
        Au fond, vous le savez&nbsp;: votre site convertit<br />
        <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 400, background: 'linear-gradient(120deg, #8B5CF6, #6D28D9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          <span className="k-hero-5x-wrap" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 400 }}>
            <span className="k-hero-5x">5x</span>
          </span>
          {' moins qu\'il ne devrait.'}
        </span>
      </h1>

      <div className="k-hero-sub" style={{ fontSize: isMobile ? 17 : 21, marginTop: isMobile ? 24 : 32, textAlign: 'center', maxWidth: 820, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.55, color: 'rgba(31,27,46,.72)', fontWeight: 400, display: 'flex', flexDirection: 'column', gap: isMobile ? 6 : 10, padding: '0 20px' }}>
        <span style={{ textWrap: 'balance' }}>Vos visiteurs repartent sans rien faire.</span>
        <span style={{ textWrap: 'balance' }}>Pas par manque d'intérêt — parce que votre site n'a jamais été conçu pour les convertir.</span>
        <span style={{ textWrap: 'balance', marginTop: isMobile ? 4 : 6 }}>
          On le reconçoit pour ça. Résultat&nbsp;: <span style={{ color: 'var(--ink)', fontWeight: 600 }}>5x plus de RDV en 14&nbsp;jours.</span>
        </span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: isMobile ? 28 : 36, flexWrap: 'wrap', padding: '0 20px' }}>
        <button onClick={onScrollToOffer} className="k-cta k-cta-quiz" style={{
          position: 'relative', overflow: 'hidden',
          padding: isMobile ? '14px 22px' : '16px 26px',
          fontSize: isMobile ? 15 : 16,
          background: 'linear-gradient(180deg, #9B6FFB 0%, #7C3AED 100%)',
          color: '#fff', border: 'none', cursor: 'pointer',
        }}>
          <span aria-hidden="true" className="k-cta-quiz-sheen" />
          <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            Voir l'offre tout-en-un
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7 L11 7 M7 3 L11 7 L7 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
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
          { l: 'Meta Business Partner certifié', isMetaLogo: true },
          { l: 'Entreprise romande', isSwissFlag: true },
          { l: 'Données hébergées en Suisse', isShield: true },
        ].map((m, i) => (
          <React.Fragment key={m.l}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, lineHeight: 1 }}>
              {m.isMetaLogo ? (
                <svg width="26" height="18" viewBox="0 0 287 191" fill="none" aria-label="Meta" style={{ flexShrink: 0 }}>
                  <defs>
                    <linearGradient id="meta-hero-grad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#0064E0" />
                      <stop offset="50%" stopColor="#7E5BFF" />
                      <stop offset="100%" stopColor="#FA4280" />
                    </linearGradient>
                  </defs>
                  <path fill="url(#meta-hero-grad)" d="M194.5 31.6c-19.4 0-34.6 14.6-48.4 33-19-24-34.7-33-53.5-33C54.7 31.6 25 81.7 25 134c0 32.7 15.8 53.5 42.3 53.5 19 0 32.6-9 56.9-51.4 0 0 10.1-17.8 17.1-30.2 2.4 4 5 8.2 7.7 12.7l11.5 19.4c22.5 37.6 35.1 49.5 57.8 49.5 25.8 0 40.1-21 40.1-54.6 0-55-30.3-101.3-63.9-101.3zm-104.7 92.9c-19.7 30.8-26.5 37.7-37.4 37.7-11.2 0-17.9-9.9-17.9-27.4 0-37.7 18.8-76.2 41.2-76.2 12.1 0 22.2 7 37.7 29.2-14.8 22.7-23.6 36.7-23.6 36.7zm89.3-4.7l-13.7-23c-3.7-6-7.3-11.6-10.7-16.7 12.4-19.1 22.6-28.7 34.7-28.7 25.1 0 45.2 36.9 45.2 82.4 0 17.3-5.7 27.4-17.5 27.4-11.3 0-16.7-7.5-37.9-41.4z" />
                </svg>
              ) : m.isSwissFlag ? (
                <svg width="16" height="16" viewBox="0 0 32 32" fill="none" aria-label="Suisse" style={{ flexShrink: 0, borderRadius: 2, boxShadow: '0 0 0 1px rgba(0,0,0,.06)' }}>
                  <rect width="32" height="32" fill="#DA291C" />
                  <rect x="13" y="6" width="6" height="20" fill="#fff" />
                  <rect x="6" y="13" width="20" height="6" fill="#fff" />
                </svg>
              ) : m.isShield ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-label="Données sécurisées en Suisse" style={{ flexShrink: 0, filter: 'drop-shadow(0 2px 4px rgba(124,58,237,.25))' }}>
                  <defs>
                    <linearGradient id="hero-shield-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#9B6FFB" />
                      <stop offset="100%" stopColor="#6D28D9" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M12 1.8 L4 4.6 V11.5 C4 16.4 7.2 20.6 12 22.2 C16.8 20.6 20 16.4 20 11.5 V4.6 Z"
                    fill="url(#hero-shield-grad)"
                    stroke="rgba(255,255,255,.55)"
                    strokeWidth="0.6"
                  />
                  <path d="M11 7.5 H13 V10.5 H16 V12.5 H13 V15.5 H11 V12.5 H8 V10.5 H11 Z" fill="#fff" />
                </svg>
              ) : (
                <span style={{ fontSize: isMobile ? 18 : 20, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ink)', lineHeight: 1 }}>{m.v}</span>
              )}
              <span className="mono" style={{ fontSize: 11.5, color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', lineHeight: 1 }}>{m.l}</span>
            </div>
            {i < 2 && !isMobile && <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--lav)' }}></span>}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════
// OFFER — single all-in-one bundle, transparent pricing
// ═════════════════════════════════════════════════════════════
const LandingOffer = React.forwardRef(function LandingOffer({ isMobile, onScrollToForm }, ref) {
  const pad = isMobile ? '64px 20px' : '110px 120px';

  return (
    <section ref={ref} id="offer" style={{ padding: pad, background: 'var(--bg)', position: 'relative' }}>
      <div className="k-hero-blob" style={{ width: 380, height: 380, background: '#C4B5FD', top: -60, right: '6%', opacity: .22 }}></div>
      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative' }}>
        <div style={{ textAlign: 'center' }}>
          <span className="k-section-label" style={{ display: 'inline-flex' }}>
            <span className="k-section-label-sq"></span>
            01 — L'offre
          </span>
        </div>
        <h2 style={{
          fontSize: isMobile ? 36 : 60, marginTop: 18,
          letterSpacing: '-0.04em', lineHeight: 1.02,
          textAlign: 'center', maxWidth: 880, margin: '18px auto 0', fontWeight: 500,
        }}>
          Une seule offre.{' '}
          <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 400, background: 'linear-gradient(120deg, #8B5CF6, #6D28D9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Tout-en-un.
          </span>{' '}
          Accessible.
        </h2>
        <p style={{
          fontSize: isMobile ? 16 : 18, marginTop: 18, textAlign: 'center',
          maxWidth: 640, margin: '18px auto 0', lineHeight: 1.55,
          color: 'rgba(31,27,46,.72)',
        }}>
          Pas de devis sur 14 pages. Pas de prestataires multiples. Une équipe, un livrable, un prix clair.
        </p>

        {/* Price anchor — comparison vs Romandie market average */}
        <div style={{
          marginTop: isMobile ? 28 : 44,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        }}>
          <div style={{
            fontSize: isMobile ? 14 : 15, color: 'var(--muted)',
            textAlign: 'center', maxWidth: 560, lineHeight: 1.5,
          }}>
            Le devis moyen d'une agence romande pour ce livrable&nbsp;:
          </div>
          <div style={{
            fontSize: isMobile ? 17 : 19, fontWeight: 500, color: 'rgba(31,27,46,.5)',
            letterSpacing: '-0.01em',
            textDecoration: 'line-through', textDecorationColor: 'rgba(31,27,46,.35)',
            textDecorationThickness: '1.5px',
          }}>
            CHF 12'000 setup + CHF 2'400 / mois
          </div>
          <div style={{
            marginTop: 6,
            fontSize: isMobile ? 14 : 15, color: 'var(--ink)', fontWeight: 500,
            display: 'inline-flex', alignItems: 'center', gap: 8,
          }}>
            Le nôtre&nbsp;:
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ animation: 'k-anchor-arrow 2s ease-in-out infinite', color: 'var(--violet-deep)' }}>
              <path d="M7 3 V11 M3 7 L7 11 L11 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </div>
        </div>
        <style>{`
          @keyframes k-anchor-arrow { 0%,100% { transform: translateY(0); } 50% { transform: translateY(3px); } }
          @keyframes k-cta-quiz-sheen { 0% { transform: translateX(-150%) skewX(-20deg); } 60%, 100% { transform: translateX(250%) skewX(-20deg); } }
          @keyframes k-cta-quiz-pulse { 0%, 100% { box-shadow: 0 1px 0 rgba(255,255,255,.18) inset, 0 14px 36px -10px rgba(124,58,237,.55), 0 22px 60px -20px rgba(124,58,237,.4); } 50% { box-shadow: 0 1px 0 rgba(255,255,255,.18) inset, 0 18px 44px -8px rgba(124,58,237,.7), 0 26px 70px -18px rgba(124,58,237,.5); } }
          .k-cta-quiz { transition: transform .25s cubic-bezier(.4,0,.2,1), box-shadow .25s; animation: k-cta-quiz-pulse 3.4s ease-in-out infinite; }
          .k-cta-quiz:hover { transform: translateY(-2px); }
          .k-cta-quiz:active { transform: translateY(0); }
          .k-cta-quiz-sheen { position: absolute; inset: 0; overflow: hidden; border-radius: inherit; pointer-events: none; }
          .k-cta-quiz-sheen::after {
            content: ''; position: absolute; top: 0; left: 0; width: 60%; height: 100%;
            background: linear-gradient(110deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.35) 50%, rgba(255,255,255,0) 100%);
            animation: k-cta-quiz-sheen 3.4s ease-in-out infinite;
          }
        `}</style>

        {/* Pricing cards */}
        <div style={{
          marginTop: isMobile ? 24 : 36,
          maxWidth: 920, marginLeft: 'auto', marginRight: 'auto',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? 16 : 20,
          alignItems: 'stretch',
        }}>
          {/* SETUP card */}
          <div style={{
            position: 'relative',
            padding: isMobile ? '28px 24px' : '34px 32px 32px',
            background: '#fff',
            border: '1px solid var(--line-2)',
            borderRadius: 20,
            boxShadow: '0 1px 2px rgba(10,10,10,.02), 0 16px 38px -22px rgba(124,58,237,.22)',
            display: 'flex', flexDirection: 'column', gap: 16,
          }}>
            <div>
              <div className="mono" style={{ fontSize: 11.5, letterSpacing: '0.2em', color: 'var(--violet-deep)', textTransform: 'uppercase', fontWeight: 600 }}>
                Setup complet
              </div>
              <div style={{ height: 1, background: 'linear-gradient(90deg, rgba(124,58,237,.18), rgba(124,58,237,0))', marginTop: 12, marginBottom: 16 }} />
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 500 }}>dès</span>
                <span style={{ fontSize: isMobile ? 38 : 46, fontWeight: 600, letterSpacing: '-0.035em', color: 'var(--ink)', lineHeight: 1 }}>CHF 2'490</span>
              </div>
              <div style={{ marginTop: 10, fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.5 }}>
                Facturation one-shot, livré sous 7 jours
              </div>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 11 }}>
              {[
                'Landing page sur-mesure conçue pour convertir',
                'Campagne Meta + Google lancée et calibrée',
                'Tracking serveur Pixel + GA4',
                'Dashboard live + CRM intégré offert',
              ].map((b) => (
                <li key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: 'var(--ink)', lineHeight: 1.45 }}>
                  <span style={{
                    flexShrink: 0, width: 18, height: 18, borderRadius: '50%',
                    background: 'rgba(124,58,237,.10)',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    marginTop: 1,
                  }}>
                    <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
                      <path d="M3 7 L6 10 L11 4" stroke="var(--violet-deep)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* MONTHLY card — featured */}
          <div style={{
            position: 'relative',
            padding: isMobile ? '28px 24px' : '34px 32px 32px',
            background: 'linear-gradient(170deg, #FAF8FF 0%, #F3EEFF 100%)',
            border: '1.5px solid rgba(124,58,237,.35)',
            borderRadius: 20,
            boxShadow: '0 1px 0 rgba(255,255,255,.6) inset, 0 24px 50px -22px rgba(124,58,237,.45), 0 12px 28px -16px rgba(124,58,237,.3)',
            display: 'flex', flexDirection: 'column', gap: 16,
          }}>
            {/* Recommandé badge */}
            <span style={{
              position: 'absolute', top: -12, right: 24,
              fontFamily: 'Geist Mono, monospace',
              fontSize: 10.5, fontWeight: 700,
              padding: '6px 12px', borderRadius: 999,
              background: 'linear-gradient(120deg, #8B5CF6, #6D28D9)',
              color: '#fff',
              letterSpacing: '0.18em', textTransform: 'uppercase',
              boxShadow: '0 8px 18px -6px rgba(124,58,237,.6)',
              whiteSpace: 'nowrap',
            }}>Recommandé</span>

            <div>
              <div className="mono" style={{ fontSize: 11.5, letterSpacing: '0.2em', color: 'var(--violet-deep)', textTransform: 'uppercase', fontWeight: 600 }}>
                Suivi mensuel
              </div>
              <div style={{ height: 1, background: 'linear-gradient(90deg, rgba(124,58,237,.35), rgba(124,58,237,0))', marginTop: 12, marginBottom: 16 }} />
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 500 }}>dès</span>
                <span style={{ fontSize: isMobile ? 38 : 46, fontWeight: 600, letterSpacing: '-0.035em', color: 'var(--ink)', lineHeight: 1 }}>CHF 590</span>
                <span style={{ fontSize: 16, color: 'var(--muted)', fontWeight: 500 }}>/ mois</span>
              </div>
              <div style={{ marginTop: 10, fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.5 }}>
                Sans engagement après 90 jours
              </div>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 11 }}>
              {[
                'Itérations créa hebdomadaires',
                'A/B testing en continu sur la landing page',
                'Reporting détaillé chaque lundi',
                'Optimisation budget Meta en temps réel',
              ].map((b) => (
                <li key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: 'var(--ink)', lineHeight: 1.45 }}>
                  <span style={{
                    flexShrink: 0, width: 18, height: 18, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #C4B5FD 0%, #8B5CF6 100%)',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    marginTop: 1,
                    boxShadow: '0 3px 8px -3px rgba(124,58,237,.55)',
                  }}>
                    <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
                      <path d="M3 7 L6 10 L11 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Reason-why block — absorbs price defiance */}
        <div style={{
          marginTop: isMobile ? 28 : 40,
          maxWidth: 760, marginLeft: 'auto', marginRight: 'auto',
          padding: isMobile ? '24px 22px 24px 24px' : '28px 32px 28px 34px',
          background: 'linear-gradient(180deg, #F8F5FF 0%, #F5F3FF 100%)',
          borderLeft: '3px solid var(--violet)',
          borderRadius: 14,
        }}>
          <div className="mono" style={{
            fontSize: 11, color: 'var(--violet-deep)', letterSpacing: '0.2em',
            textTransform: 'uppercase', fontWeight: 600,
          }}>
            Pourquoi on peut descendre à 2'490
          </div>
          <div style={{
            fontSize: isMobile ? 18 : 20, fontWeight: 600,
            color: 'var(--ink)', letterSpacing: '-0.02em', marginTop: 8,
          }}>
            Pourquoi 2'490 et pas 12'000&nbsp;?
          </div>
          <p style={{
            fontSize: isMobile ? 14.5 : 15.5,
            color: 'rgba(31,27,46,.76)', lineHeight: 1.7,
            marginTop: 12,
          }}>
            Parce qu'on a standardisé un livrable qui marche pour 90&nbsp;% des PME romandes. On ne facture pas 40&nbsp;h de devis sur-mesure. On ne facture pas 60&nbsp;h de réunions de cadrage. On ne facture pas 3 prestataires qui se renvoient la balle.
          </p>
          <p style={{
            fontSize: isMobile ? 14.5 : 15.5,
            color: 'var(--ink)', lineHeight: 1.6,
            marginTop: 14, fontWeight: 500,
          }}>
            Une équipe. Un livrable. Un prix — affiché, pas négocié.
          </p>
        </div>

        {/* Trust strip */}
        <div className="mono" style={{
          marginTop: isMobile ? 28 : 36,
          fontSize: 11, color: 'var(--muted)', letterSpacing: '0.16em', textTransform: 'uppercase',
          textAlign: 'center', display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
          gap: '6px 14px',
        }}>
          <span>Mise en ligne 7 jours</span>
          <span style={{ color: 'var(--lav)' }}>·</span>
          <span>Sans lock-in</span>
          <span style={{ color: 'var(--lav)' }}>·</span>
          <span>100% propriétaire des assets</span>
          <span style={{ color: 'var(--lav)' }}>·</span>
          <span>nLPD &amp; RGPD</span>
        </div>

        {/* CTA */}
        <div style={{ marginTop: isMobile ? 28 : 36, display: 'flex', justifyContent: 'center' }}>
          <button onClick={onScrollToForm} className="k-cta k-cta-quiz" style={{
            position: 'relative', overflow: 'hidden',
            padding: isMobile ? '14px 22px' : '16px 28px',
            fontSize: isMobile ? 15 : 16,
            background: 'linear-gradient(180deg, #9B6FFB 0%, #7C3AED 100%)',
            color: '#fff', border: 'none', cursor: 'pointer',
          }}>
            <span aria-hidden="true" className="k-cta-quiz-sheen" />
            <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              Démarrer mon projet
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7 L11 7 M7 3 L11 7 L7 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
});

// ═════════════════════════════════════════════════════════════
// DELIVERABLES — what we ship, with animated mockups
// ═════════════════════════════════════════════════════════════
function LandingDeliverables({ isMobile }) {
  const pad = isMobile ? '64px 20px' : '120px 120px';

  const items = [
    {
      n: '01',
      t: 'Une landing page conçue pour convertir, pas pour plaire.',
      d: "Pas un site vitrine. Une page conçue pour une seule mission : faire passer vos visiteurs du clic au RDV qualifié. Chaque bloc, chaque mot, chaque bouton a été testé sur des dizaines de milliers de visiteurs avant d'arriver chez vous — on garde ce qui convertit, on jette le reste.",
      bullets: [
        { b: "Vous savez précisément d'où viennent vos RDV", sub: 'Tracking serveur Pixel + GA4' },
        { b: "Votre page s'améliore chaque semaine, sans que vous y touchiez", sub: 'A/B testing en continu sur les blocs clés' },
        { b: '70% de votre trafic est sur mobile — votre page est conçue pour eux d\'abord', sub: 'Design mobile-first' },
      ],
      mockup: <MockupLandingAB />,
    },
    {
      n: '02',
      t: 'Pas de pub à "tout le monde". Une campagne taillée pour vos vrais acheteurs.',
      d: "Avant le premier euro de pub, on passe 1 jour entier à comprendre qui est votre vrai acheteur rentable : son métier, son budget, ses vraies frustrations, les mots qu'il utilise. La différence entre une pub que vos prospects scrollent — et une pub sur laquelle ils cliquent.",
      bullets: [
        { b: 'Votre pub parle exactement comme votre acheteur, pas comme une agence', sub: 'Brief ICP approfondi en jour 1, vocabulaire et frustrations cartographiés' },
        { b: 'Un client à Lausanne ne voit pas la même pub qu\'un client à Genève', sub: 'Audiences Meta & Google segmentées par profil et zone' },
        { b: "En 7 jours, vous savez exactement quel angle vend — pas en 6 mois d'A/B test", sub: '10 créas testées au lancement' },
      ],
      mockup: <MockupCampaign />,
    },
    {
      n: '03',
      t: 'Toute votre acquisition sur un seul écran. Sans HubSpot ni Pipedrive à payer en plus.',
      d: "Vos leads, vos campagnes, vos RDV pris : un seul écran, mis à jour en temps réel. Plus de copier-coller entre 3 outils. Plus de CRM séparé à payer chaque mois. Vous voyez ce qui rapporte, ce qu'il faut couper, et ce que votre budget Meta vous a vraiment ramené ce mois.",
      bullets: [
        { b: 'Vous rappelez vos leads dans les 5 minutes, pas dans 2 jours', sub: 'Notification en temps réel à chaque nouveau lead' },
        { b: "Vous économisez ~CHF 1'500/an que vous auriez dépensés en HubSpot ou Pipedrive", sub: 'CRM intégré, inclus sans surcoût' },
        { b: 'Chaque lundi en 2 minutes, vous savez ce que votre budget Meta vous a rapporté', sub: 'Rapport hebdomadaire automatique par email' },
      ],
      badge: 'CRM offert',
      mockup: <MockupDashboard />,
    },
  ];

  return (
    <section style={{ padding: pad, background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @keyframes k-deliv-pulse { 0%,100% { opacity: .9; transform: scale(1); } 50% { opacity: 1; transform: scale(1.04); } }
        @keyframes k-deliv-bar-grow { 0% { transform: scaleY(0); } 100% { transform: scaleY(1); } }
        @keyframes k-deliv-tag-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        @keyframes k-deliv-cursor { 0%,100% { transform: translate(0,0); opacity: .9; } 50% { transform: translate(2px,1px); opacity: 1; } }
        @keyframes k-deliv-radar { 0% { transform: scale(.4); opacity: .8; } 100% { transform: scale(2.2); opacity: 0; } }
        @keyframes k-deliv-counter { 0% { transform: translateY(8px); opacity: 0; } 30%,70% { transform: translateY(0); opacity: 1; } 100% { transform: translateY(-8px); opacity: 0; } }
        @keyframes k-deliv-scan { 0% { transform: translateX(-110%); } 100% { transform: translateX(110%); } }
        @keyframes k-deliv-row-in { 0% { transform: translateX(-12px); opacity: 0; } 100% { transform: translateX(0); opacity: 1; } }
        @keyframes k-deliv-dot { 0%,100% { opacity: .4; } 50% { opacity: 1; } }
        @keyframes k-deliv-tag-in { 0% { opacity: 0; transform: translateY(8px) scale(.92); } 60% { opacity: 1; transform: translateY(-2px) scale(1.03); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes k-deliv-tag-cycle { 0%, 4% { opacity: 0; transform: translateY(8px) scale(.94); } 10%, 88% { opacity: 1; transform: translateY(0) scale(1); } 95%, 100% { opacity: 0; transform: translateY(-6px) scale(.96); } }
        @keyframes k-deliv-line { 0% { stroke-dashoffset: 24; opacity: 0; } 15% { opacity: .9; } 85% { opacity: .9; } 100% { stroke-dashoffset: 0; opacity: 0; } }
        @keyframes k-deliv-match { 0%, 75% { transform: scale(1); opacity: .9; } 82% { transform: scale(2.2); opacity: 0; } 100% { transform: scale(2.2); opacity: 0; } }
        @keyframes k-deliv-heart { 0%, 65% { transform: scale(1); fill: #fff; stroke: #FF4773; } 72% { transform: scale(1.3); fill: #FF4773; stroke: #FF4773; } 100% { transform: scale(1); fill: #FF4773; stroke: #FF4773; } }
        @keyframes k-deliv-like-burst { 0%, 70% { opacity: 0; transform: translateY(0) scale(.6); } 78% { opacity: 1; transform: translateY(-12px) scale(1); } 88% { opacity: 1; transform: translateY(-26px) scale(1); } 100% { opacity: 0; transform: translateY(-40px) scale(.8); } }
        @keyframes k-deliv-text-1 { 0%, 1% { opacity: 0; } 5%, 28% { opacity: 1; } 31%, 100% { opacity: 0; } }
        @keyframes k-deliv-text-2 { 0%, 35% { opacity: 0; } 39%, 61% { opacity: 1; } 64%, 100% { opacity: 0; } }
        @keyframes k-deliv-text-3 { 0%, 68% { opacity: 0; } 72%, 94% { opacity: 1; } 97%, 100% { opacity: 0; } }
        @keyframes k-deliv-live-ring { 0% { r: 4; opacity: .55; } 100% { r: 16; opacity: 0; } }
        @keyframes k-deliv-bar-shimmer { 0% { transform: translateX(-30%); opacity: 0; } 25% { opacity: .6; } 75% { opacity: .6; } 100% { transform: translateX(110%); opacity: 0; } }
        @keyframes k-deliv-toast { 0%, 78% { opacity: 0; transform: translateY(-6px) scale(.92); } 84%, 92% { opacity: 1; transform: translateY(0) scale(1); } 96%, 100% { opacity: 0; transform: translateY(-6px) scale(.92); } }
        @keyframes k-deliv-bar-bounce { 0%, 90% { transform: scaleY(1); } 95% { transform: scaleY(1.08); } 100% { transform: scaleY(1); } }

        .k-deliv-row { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center; }
        .k-deliv-row.reverse .k-deliv-mockup { order: 2; }
        @media (max-width: 768px) {
          .k-deliv-row, .k-deliv-row.reverse { grid-template-columns: 1fr; gap: 28px; }
          .k-deliv-row.reverse .k-deliv-mockup { order: 0; }
        }
        .k-deliv-mockup {
          position: relative; aspect-ratio: 4/3;
          background: linear-gradient(160deg, #fff 0%, #FAF8FF 100%);
          border: 1px solid var(--line-2); border-radius: 22px;
          box-shadow: 0 30px 80px -32px rgba(124,58,237,.32), 0 1px 0 rgba(255,255,255,.8) inset;
          overflow: hidden;
        }
      `}</style>

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
        <div style={{ textAlign: 'center' }}>
          <span className="k-section-label" style={{ display: 'inline-flex' }}>
            <span className="k-section-label-sq"></span>
            02 — Ce qu'on vous livre
          </span>
        </div>
        <h2 style={{
          fontSize: isMobile ? 36 : 60, marginTop: 18,
          letterSpacing: '-0.04em', lineHeight: 1.02,
          textAlign: 'center', maxWidth: 880, margin: '18px auto 0', fontWeight: 500,
        }}>
          Voici ce qu'on{' '}
          <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 400, background: 'linear-gradient(120deg, #8B5CF6, #6D28D9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            vous livre.
          </span>
        </h2>
        <p style={{
          fontSize: isMobile ? 16 : 18, marginTop: 18, textAlign: 'center',
          maxWidth: 640, margin: '18px auto 0', lineHeight: 1.55,
          color: 'rgba(31,27,46,.72)',
        }}>
          Trois pièces, parfaitement assemblées. Conçues pour que vos campagnes performent dès le jour 7.
        </p>

        <div style={{ marginTop: isMobile ? 48 : 88, display: 'flex', flexDirection: 'column', gap: isMobile ? 56 : 96 }}>
          {items.map((it, i) => (
            <div key={it.n} className={`k-deliv-row${i % 2 === 1 ? ' reverse' : ''}`}>
              <div className="k-deliv-mockup">{it.mockup}</div>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                  <span style={{
                    width: 22, height: 1, background: 'linear-gradient(90deg, transparent, var(--violet-deep))',
                    display: 'inline-block',
                  }} />
                  <span className="mono" style={{
                    fontSize: 11.5, color: 'var(--violet-deep)', letterSpacing: '0.22em',
                    fontWeight: 600, textTransform: 'uppercase',
                  }}>
                    Livrable {it.n}
                  </span>
                  {it.badge && (
                    <span style={{
                      fontFamily: 'Geist Mono, ui-monospace, monospace',
                      fontSize: 10.5, color: '#fff', letterSpacing: '0.16em', textTransform: 'uppercase',
                      background: 'linear-gradient(120deg, #8B5CF6, #6D28D9)',
                      padding: '5px 10px', borderRadius: 999, fontWeight: 600,
                      boxShadow: '0 6px 16px -6px rgba(124,58,237,.55)',
                      marginLeft: 4,
                    }}>
                      {it.badge}
                    </span>
                  )}
                </div>
                <h3 style={{
                  fontSize: isMobile ? 26 : 34, fontWeight: 500,
                  letterSpacing: '-0.025em', lineHeight: 1.12, color: 'var(--ink)',
                  margin: 0,
                  textWrap: 'balance',
                }}>
                  {it.t}
                </h3>
                <p style={{
                  fontSize: isMobile ? 15 : 16, marginTop: 16,
                  color: 'rgba(31,27,46,.7)', lineHeight: 1.65,
                  paddingLeft: 14,
                  borderLeft: '2px solid rgba(124,58,237,.18)',
                }}>
                  {it.d}
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '24px 0 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {it.bullets.map((bullet, bi) => {
                    const isStructured = typeof bullet === 'object';
                    const main = isStructured ? bullet.b : bullet;
                    const sub = isStructured ? bullet.sub : null;
                    return (
                      <li key={bi} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, color: 'var(--ink)' }}>
                        <span style={{
                          flexShrink: 0,
                          width: 22, height: 22, borderRadius: '50%',
                          background: 'linear-gradient(135deg, #C4B5FD 0%, #8B5CF6 100%)',
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: '0 4px 10px -4px rgba(124,58,237,.55), 0 0 0 1px rgba(255,255,255,.6) inset',
                          marginTop: 1,
                        }}>
                          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                            <path d="M3 7 L6 10 L11 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                          </svg>
                        </span>
                        <span style={{ display: 'flex', flexDirection: 'column', gap: 4, lineHeight: 1.45 }}>
                          <span style={{ fontSize: isMobile ? 14.5 : 15, fontWeight: 600, letterSpacing: '-0.005em' }}>{main}</span>
                          {sub && (
                            <span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 400, lineHeight: 1.5 }}>{sub}</span>
                          )}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// — Mockup #1: Landing page with A/B variant + conversion lift
function MockupLandingAB() {
  return (
    <svg viewBox="0 0 400 300" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ab-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FAF8FF" />
          <stop offset="100%" stopColor="#EDE9FE" />
        </linearGradient>
        <linearGradient id="ab-cta" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9B6FFB" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
        <linearGradient id="ab-scan" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(139,92,246,0)" />
          <stop offset="50%" stopColor="rgba(139,92,246,.35)" />
          <stop offset="100%" stopColor="rgba(139,92,246,0)" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#ab-bg)" />

      {/* Browser window */}
      <g transform="translate(40, 30)">
        <rect x="0" y="0" width="320" height="220" rx="10" fill="#fff" stroke="#E9E4F7" strokeWidth="1" />
        {/* Top bar */}
        <rect x="0" y="0" width="320" height="22" rx="10" fill="#F8F5FF" />
        <rect x="0" y="11" width="320" height="11" fill="#F8F5FF" />
        <circle cx="12" cy="11" r="3" fill="#FFB4B4" />
        <circle cx="22" cy="11" r="3" fill="#FFD79A" />
        <circle cx="32" cy="11" r="3" fill="#A8E6B7" />
        <rect x="120" y="6" width="180" height="11" rx="5" fill="#fff" stroke="#EDE9FE" strokeWidth="1" />

        {/* Page content - hero block */}
        <rect x="20" y="42" width="180" height="10" rx="4" fill="#1F1B2E" />
        <rect x="20" y="58" width="240" height="10" rx="4" fill="#1F1B2E" />
        <rect x="20" y="74" width="140" height="10" rx="4" fill="#C4B5FD" />

        <rect x="20" y="98" width="200" height="6" rx="3" fill="#EDE9FE" />
        <rect x="20" y="110" width="180" height="6" rx="3" fill="#EDE9FE" />
        <rect x="20" y="122" width="160" height="6" rx="3" fill="#EDE9FE" />

        {/* CTA */}
        <rect x="20" y="146" width="110" height="32" rx="16" fill="url(#ab-cta)" />
        <rect x="42" y="159" width="66" height="6" rx="3" fill="rgba(255,255,255,.95)" />

        {/* Right side image placeholder */}
        <rect x="220" y="42" width="80" height="136" rx="8" fill="#F5F3FF" />
        <circle cx="260" cy="100" r="14" fill="#C4B5FD" opacity=".6" />
        <rect x="232" y="128" width="56" height="6" rx="3" fill="#DDD6FE" />
        <rect x="240" y="142" width="40" height="6" rx="3" fill="#DDD6FE" />

        {/* Scan line animation overlay */}
        <g style={{ animation: 'k-deliv-scan 4.2s ease-in-out infinite' }}>
          <rect x="-80" y="22" width="80" height="198" fill="url(#ab-scan)" />
        </g>
      </g>

      {/* Variant A/B badges */}
      <g style={{ animation: 'k-deliv-pulse 2.8s ease-in-out infinite' }}>
        <rect x="56" y="46" width="44" height="20" rx="10" fill="#1F1B2E" />
        <text x="78" y="60" textAnchor="middle" fontFamily="Geist Mono, ui-monospace, monospace" fontSize="10" fill="#fff" fontWeight="600" letterSpacing="0.1em">A/B</text>
      </g>

      {/* Conversion lift floating badge */}
      <g style={{ animation: 'k-deliv-tag-float 3.4s ease-in-out infinite' }}>
        <rect x="278" y="220" width="92" height="44" rx="12" fill="#fff" stroke="#EDE9FE" strokeWidth="1" filter="drop-shadow(0 8px 20px rgba(124,58,237,.25))" />
        <circle cx="296" cy="242" r="10" fill="#EDE9FE" />
        <path d="M291 244 L296 238 L301 244" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <text x="312" y="240" fontFamily="Geist, sans-serif" fontSize="10" fill="#7A6F94" letterSpacing="0.04em">Conv.</text>
        <text x="312" y="254" fontFamily="Geist, sans-serif" fontSize="14" fill="#1F1B2E" fontWeight="600">+38%</text>
      </g>

    </svg>
  );
}

// — Mockup #2: B2C-targeted ad with rotating consumer segments
// Each slot rotates through 3 audience variants over a 16.8s super-cycle
// (3 pill blink cycles of 5.6s, each blink revealing a new targeting variant).
function MockupCampaign() {
  const tags = [
    {
      x: 4, y: 58, w: 142, dotX: 18, textX: 28, textY: 75,
      anchor: { x: 155, y: 80 }, delay: '0s',
      variants: ['Femmes 35-55', 'Hommes 18-55', 'Mamans actives'],
    },
    {
      x: 252, y: 58, w: 145, dotX: 266, textX: 276, textY: 75,
      anchor: { x: 245, y: 80 }, delay: '1.4s',
      variants: ['Romandie · 10 km', 'Lausanne · 5 km', 'Genève · centre'],
    },
    {
      x: 4, y: 200, w: 150, dotX: 18, textX: 28, textY: 217,
      anchor: { x: 155, y: 215 }, delay: '2.8s',
      variants: ['Famille · enfants', 'Couple actif', 'Propriétaires'],
    },
    {
      x: 248, y: 200, w: 152, dotX: 262, textX: 272, textY: 217,
      anchor: { x: 245, y: 215 }, delay: '4.2s',
      variants: ['Bien-être & santé', 'Foodies & resto', 'Sport & lifestyle'],
    },
  ];
  const textAnims = ['k-deliv-text-1', 'k-deliv-text-2', 'k-deliv-text-3'];
  return (
    <svg viewBox="0 0 400 300" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cm-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FAF8FF" />
          <stop offset="100%" stopColor="#EDE9FE" />
        </linearGradient>
        <linearGradient id="cm-cta" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9B6FFB" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
        <radialGradient id="cm-radial" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(139,92,246,.35)" />
          <stop offset="100%" stopColor="rgba(139,92,246,0)" />
        </radialGradient>
        <linearGradient id="cm-ad-photo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFD9E2" />
          <stop offset="100%" stopColor="#FFB4D0" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#cm-bg)" />

      {/* Radar pulses behind the phone */}
      <g transform="translate(200, 150)">
        <circle r="40" fill="none" stroke="#8B5CF6" strokeWidth="1.5" opacity=".5" style={{ animation: 'k-deliv-radar 3s ease-out infinite', transformOrigin: 'center' }} />
        <circle r="40" fill="none" stroke="#8B5CF6" strokeWidth="1.5" opacity=".5" style={{ animation: 'k-deliv-radar 3s ease-out infinite 1s', transformOrigin: 'center' }} />
        <circle r="40" fill="none" stroke="#8B5CF6" strokeWidth="1.5" opacity=".5" style={{ animation: 'k-deliv-radar 3s ease-out infinite 2s', transformOrigin: 'center' }} />
        <circle r="80" fill="url(#cm-radial)" />
      </g>

      {/* Targeting lines: dashed flows from each tag to the phone (rendered behind the phone) */}
      {tags.map((t, i) => {
        const startX = t.x + t.w / 2;
        const startY = t.y + 13;
        return (
          <line
            key={`line-${i}`}
            x1={startX} y1={startY}
            x2={t.anchor.x} y2={t.anchor.y}
            stroke="#8B5CF6" strokeWidth="1.2"
            strokeDasharray="4 4"
            opacity="0"
            style={{ animation: `k-deliv-line 5.6s ease-in-out infinite ${t.delay}` }}
          />
        );
      })}

      {/* Phone mockup */}
      <g transform="translate(155, 50)">
        <rect x="0" y="0" width="90" height="190" rx="14" fill="#1F1B2E" />
        <rect x="3" y="3" width="84" height="184" rx="12" fill="#fff" />
        {/* Notch */}
        <rect x="33" y="5" width="24" height="5" rx="2.5" fill="#1F1B2E" />

        {/* Ad header */}
        <circle cx="14" cy="22" r="6" fill="#C4B5FD" />
        <rect x="24" y="18" width="34" height="4" rx="2" fill="#1F1B2E" />
        <rect x="24" y="25" width="22" height="3" rx="1.5" fill="#9088A7" />
        <rect x="62" y="18" width="22" height="9" rx="3" fill="#F5F3FF" />
        <text x="73" y="25" textAnchor="middle" fontFamily="Geist, sans-serif" fontSize="5" fill="#7C3AED" fontWeight="600">Sponso</text>

        {/* Ad image (consumer-friendly: warm gradient) */}
        <rect x="6" y="36" width="78" height="80" rx="4" fill="url(#cm-ad-photo)" />
        <circle cx="45" cy="74" r="13" fill="#fff" opacity=".75" />
        <circle cx="45" cy="70" r="5" fill="#FFB4D0" />
        <path d="M37 84 Q45 76 53 84" stroke="#FFB4D0" strokeWidth="1.5" fill="none" />

        {/* Heart-like reaction on the photo (animated like) */}
        <g transform="translate(73, 108)" style={{ transformOrigin: 'center', animation: 'k-deliv-heart 4.2s ease-in-out infinite' }}>
          <path d="M0 -3 C-3 -6, -7 -3, -5 1 L0 6 L5 1 C7 -3, 3 -6, 0 -3 Z" fill="#fff" stroke="#FF4773" strokeWidth="1.2" />
        </g>
        {/* Like burst particle */}
        <g style={{ animation: 'k-deliv-like-burst 4.2s ease-out infinite' }}>
          <path d="M73 108 m-3,-3 c-3,-6 -7,-3 -5,1 l5,5 l5,-5 c2,-4 -2,-7 -5,-1 z" fill="#FF4773" opacity=".85" transform="scale(.7)" transform-origin="73 108" />
        </g>

        {/* Ad copy */}
        <rect x="6" y="122" width="60" height="4" rx="2" fill="#1F1B2E" />
        <rect x="6" y="130" width="74" height="3" rx="1.5" fill="#9088A7" />
        <rect x="6" y="136" width="50" height="3" rx="1.5" fill="#9088A7" />

        {/* Ad CTA — consumer-friendly */}
        <rect x="6" y="146" width="78" height="18" rx="9" fill="url(#cm-cta)" />
        <text x="45" y="158" textAnchor="middle" fontFamily="Geist, sans-serif" fontSize="7" fill="#fff" fontWeight="600">En savoir plus</text>

        {/* Likes/comments row */}
        <circle cx="11" cy="174" r="2.5" fill="#FF4773" />
        <circle cx="20" cy="174" r="2.5" fill="#9088A7" />
        <rect x="26" y="172" width="20" height="3" rx="1.5" fill="#9088A7" />
        <rect x="64" y="172" width="20" height="3" rx="1.5" fill="#9088A7" />
      </g>

      {/* Audience tags — pill blinks every 5.6s, text rotates through 3 variants on a 16.8s super-cycle */}
      {tags.map((t, i) => (
        <g key={`tag-${i}`} style={{ animation: `k-deliv-tag-cycle 5.6s ease-in-out infinite ${t.delay}`, transformOrigin: `${t.x + t.w / 2}px ${t.y + 13}px` }}>
          <rect x={t.x} y={t.y} width={t.w} height="26" rx="13" fill="#fff" stroke="#E9E4F7" strokeWidth="1" filter="drop-shadow(0 6px 14px rgba(124,58,237,.18))" />
          <circle cx={t.dotX} cy={t.y + 13} r="3" fill="none" stroke="#8B5CF6" strokeWidth="1.4" style={{ transformOrigin: `${t.dotX}px ${t.y + 13}px`, animation: `k-deliv-match 5.6s ease-out infinite ${t.delay}` }} />
          <circle cx={t.dotX} cy={t.y + 13} r="3" fill="#8B5CF6" />
          {t.variants.map((variant, vi) => (
            <text
              key={vi}
              x={t.textX} y={t.textY}
              fontFamily="Geist, sans-serif" fontSize="11" fill="#1F1B2E" fontWeight="500"
              style={{ animation: `${textAnims[vi]} 16.8s ease-in-out infinite ${t.delay}` }}
            >
              {variant}
            </text>
          ))}
        </g>
      ))}
    </svg>
  );
}

// — Mockup #3: Live dashboard with rotating KPIs, animated bars, lead feed
function MockupDashboard() {
  // Bars: 7 days. Each bar gets its own loop animation (replay every 9s, staggered)
  const bars = [
    { x: 18,  h: 38, d: '0s' },
    { x: 42,  h: 56, d: '.2s' },
    { x: 66,  h: 30, d: '.4s' },
    { x: 90,  h: 70, d: '.6s' },
    { x: 114, h: 48, d: '.8s' },
    { x: 138, h: 82, d: '1s' },
    { x: 162, h: 64, d: '1.2s' },
  ];
  // Lead feed: 3 visible slots, each rotates through 3 names (cycle 12s)
  const leadSlots = [
    { y: 28, names: [
      { name: 'Léa B.',     tag: 'NEW', tagColor: '#7C3AED' },
      { name: 'Marc D.',    tag: 'NEW', tagColor: '#7C3AED' },
      { name: 'Aurore M.',  tag: 'RDV', tagColor: '#22C55E' },
    ]},
    { y: 52, names: [
      { name: 'Sophie L.',  tag: 'RDV', tagColor: '#22C55E' },
      { name: 'Tom R.',     tag: 'NEW', tagColor: '#7C3AED' },
      { name: 'Camille V.', tag: 'RDV', tagColor: '#22C55E' },
    ]},
    { y: 76, names: [
      { name: 'Pierre M.',  tag: 'NEW', tagColor: '#7C3AED' },
      { name: 'Sarah K.',   tag: 'RDV', tagColor: '#22C55E' },
      { name: 'Julien D.',  tag: 'NEW', tagColor: '#7C3AED' },
    ]},
  ];
  const counterAnims = ['k-deliv-text-1', 'k-deliv-text-2', 'k-deliv-text-3'];
  return (
    <svg viewBox="0 0 400 300" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="db-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FAF8FF" />
          <stop offset="100%" stopColor="#EDE9FE" />
        </linearGradient>
        <linearGradient id="db-bar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9B6FFB" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
        <linearGradient id="db-shimmer" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
          <stop offset="50%" stopColor="rgba(255,255,255,.7)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <clipPath id="db-bars-clip">
          <rect x="14" y="0" width="180" height="112" />
        </clipPath>
      </defs>
      <rect width="400" height="300" fill="url(#db-bg)" />

      {/* Dashboard window */}
      <g transform="translate(28, 26)">
        <rect x="0" y="0" width="344" height="248" rx="14" fill="#fff" stroke="#E9E4F7" strokeWidth="1" filter="drop-shadow(0 18px 40px rgba(124,58,237,.18))" />

        {/* Top bar — minimal: just LIVE indicator (no black title bar) */}
        <rect x="0" y="0" width="344" height="34" rx="14" fill="#FAFAFA" />
        <rect x="0" y="20" width="344" height="14" fill="#FAFAFA" />

        {/* LIVE indicator with radar pulse */}
        <circle cx="306" cy="17" r="14" fill="none" stroke="#22C55E" strokeWidth="1.2" opacity="0" style={{ transformOrigin: '306px 17px', animation: 'k-deliv-live-ring 2s ease-out infinite' }} />
        <circle cx="306" cy="17" r="4" fill="#22C55E" style={{ animation: 'k-deliv-dot 1.4s ease-in-out infinite' }} />
        <text x="316" y="20.5" fontFamily="Geist Mono, ui-monospace, monospace" fontSize="9" fill="#1F1B2E" fontWeight="700" letterSpacing="0.12em">LIVE</text>

        {/* "+1 lead" toast notification (loops every ~9s) */}
        <g style={{ animation: 'k-deliv-toast 9s ease-in-out infinite', transformOrigin: '172px 17px' }}>
          <rect x="140" y="6" width="64" height="22" rx="11" fill="#fff" stroke="#EDE9FE" strokeWidth="1" filter="drop-shadow(0 6px 14px rgba(124,58,237,.22))" />
          <circle cx="151" cy="17" r="3" fill="#22C55E" style={{ animation: 'k-deliv-dot 1.4s ease-in-out infinite' }} />
          <text x="180" y="20" textAnchor="middle" fontFamily="Geist Mono, ui-monospace, monospace" fontSize="9" fill="#1F1B2E" fontWeight="700" letterSpacing="0.06em">+1 LEAD</text>
        </g>

        {/* KPI tiles — vertical stack: label / value / delta */}
        <g>
          <rect x="14" y="48" width="100" height="62" rx="10" fill="#F8F5FF" />
          <text x="24" y="64" fontFamily="Geist Mono, ui-monospace, monospace" fontSize="8" fill="#7A6F94" letterSpacing="0.12em">LEADS · 7J</text>
          {/* Counter rotation 42 → 43 → 44 */}
          {['42', '43', '44'].map((v, i) => (
            <text key={v} x="24" y="90" fontFamily="Geist, sans-serif" fontSize="22" fill="#1F1B2E" fontWeight="600" style={{ animation: `${counterAnims[i]} 9s ease-in-out infinite` }}>{v}</text>
          ))}
          <text x="24" y="104" fontFamily="Geist, sans-serif" fontSize="9.5" fill="#22C55E" fontWeight="600">+18% sur 7 j</text>
        </g>
        <g>
          <rect x="122" y="48" width="100" height="62" rx="10" fill="#F8F5FF" />
          <text x="132" y="64" fontFamily="Geist Mono, ui-monospace, monospace" fontSize="8" fill="#7A6F94" letterSpacing="0.12em">CPL</text>
          <text x="132" y="90" fontFamily="Geist, sans-serif" fontSize="20" fill="#1F1B2E" fontWeight="600">CHF 11</text>
          <text x="132" y="104" fontFamily="Geist, sans-serif" fontSize="9.5" fill="#22C55E" fontWeight="600">−24% sur 30 j</text>
        </g>
        <g>
          <rect x="230" y="48" width="100" height="62" rx="10" fill="#F8F5FF" />
          <text x="240" y="64" fontFamily="Geist Mono, ui-monospace, monospace" fontSize="8" fill="#7A6F94" letterSpacing="0.12em">RDV PRIS</text>
          <text x="240" y="90" fontFamily="Geist, sans-serif" fontSize="20" fill="#1F1B2E" fontWeight="600">12</text>
          <text x="240" y="104" fontFamily="Geist, sans-serif" fontSize="9.5" fill="#7C3AED" fontWeight="600">cette semaine</text>
        </g>

        {/* Bar chart with looping replay + shimmer sweep */}
        <g transform="translate(14, 126)">
          <rect x="0" y="0" width="206" height="108" rx="10" fill="#FAFAFA" />
          <text x="14" y="18" fontFamily="Geist Mono, ui-monospace, monospace" fontSize="8" fill="#7A6F94" letterSpacing="0.12em">LEADS · 7 DERNIERS JOURS</text>

          {/* Bars: initial grow + subtle continuous bounce */}
          <g clipPath="url(#db-bars-clip)">
            {bars.map((b, i) => (
              <g key={i}>
                <rect
                  x={b.x} y={98 - b.h} width="14" height={b.h} rx="3" fill="url(#db-bar)"
                  style={{ transformOrigin: `${b.x + 7}px 98px`, animation: `k-deliv-bar-grow 1.1s cubic-bezier(.4,0,.2,1) ${b.d} both, k-deliv-bar-bounce 4.5s ease-in-out ${b.d} infinite` }}
                />
              </g>
            ))}
            {/* Shimmer overlay sweeping across the bars */}
            <rect x="0" y="20" width="60" height="78" fill="url(#db-shimmer)" opacity="0" style={{ animation: 'k-deliv-bar-shimmer 5.5s ease-in-out 2s infinite' }} />
          </g>
          <line x1="14" y1="98" x2="194" y2="98" stroke="#E9E4F7" strokeWidth="1" />
        </g>

        {/* Lead feed — 3 slots, each rotating through 3 names */}
        <g transform="translate(228, 126)">
          <rect x="0" y="0" width="102" height="108" rx="10" fill="#FAFAFA" />
          <text x="10" y="18" fontFamily="Geist Mono, ui-monospace, monospace" fontSize="8" fill="#7A6F94" letterSpacing="0.12em">FLUX LEADS</text>

          {leadSlots.map((slot, slotIdx) => (
            <g key={slotIdx} transform={`translate(0, ${slot.y})`}>
              <rect x="8" y="0" width="86" height="20" rx="6" fill="#fff" stroke="#EDE9FE" strokeWidth="1" />
              {slot.names.map((entry, i) => (
                <g key={i} style={{ animation: `${counterAnims[i]} 12s ease-in-out infinite` }}>
                  <circle cx="18" cy="10" r="4" fill={entry.tagColor} opacity=".5" />
                  <text x="26" y="12.5" fontFamily="Geist, sans-serif" fontSize="7" fill="#1F1B2E" fontWeight="500">{entry.name}</text>
                  <rect x="62" y="5" width="24" height="10" rx="5" fill={entry.tagColor} opacity=".15" />
                  <text x="74" y="12.5" textAnchor="middle" fontFamily="Geist Mono, ui-monospace, monospace" fontSize="6.5" fill={entry.tagColor} fontWeight="700" letterSpacing="0.1em">{entry.tag}</text>
                </g>
              ))}
            </g>
          ))}
        </g>
      </g>
    </svg>
  );
}

// ═════════════════════════════════════════════════════════════
// ENRICHED BRAND LIST — Romandie cities + sectors for KLogos
// ═════════════════════════════════════════════════════════════
const ROMANDIE_BRANDS = [
  { name: 'TradeAuto', city: 'Genève', sector: 'Auto', logo: (<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 12 L4 8 C4.2 7.2 4.8 7 5.5 7 H14.5 C15.2 7 15.8 7.2 16 8 L17 12 V14 H15 V13 H5 V14 H3 Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /><circle cx="6.5" cy="13.5" r="1.2" fill="currentColor" /><circle cx="13.5" cy="13.5" r="1.2" fill="currentColor" /></svg>) },
  { name: 'Rénovia', city: 'Lausanne', sector: 'Rénovation', logo: (<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 10 L10 4 L17 10 V16 H12 V12 H8 V16 H3 Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>) },
  { name: 'BAOBAB', city: 'Sion', sector: 'HR Tech', logo: (<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><ellipse cx="10" cy="6" rx="5.5" ry="2.8" fill="currentColor" /><circle cx="6" cy="5.5" r="2" fill="currentColor" /><circle cx="14" cy="5.5" r="2" fill="currentColor" /><rect x="8.6" y="8" width="2.8" height="9" rx="0.4" fill="currentColor" /><path d="M6 17 Q8 16 10 17 Q12 16 14 17" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" fill="none" /></svg>) },
  { name: 'MadameLaGouvernante', city: 'Genève', sector: 'Marketplace', logo: (<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 3 L10 17 M5 6 L15 6 M6 10 L14 10 M7 14 L13 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>) },
  { name: 'Lumibat', city: 'Vevey', sector: 'Bâtiment', logo: (<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="3" fill="currentColor" /><path d="M10 2 V5 M10 15 V18 M2 10 H5 M15 10 H18 M4.5 4.5 L6.5 6.5 M13.5 13.5 L15.5 15.5 M4.5 15.5 L6.5 13.5 M13.5 6.5 L15.5 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>) },
  { name: 'Cabinet Véran', city: 'Lausanne', sector: 'Médical', logo: (<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 17 V8 L10 3 L16 8 V17" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /><path d="M8 17 V12 H12 V17" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /><circle cx="10" cy="8.5" r="1" fill="currentColor" /></svg>) },
  { name: 'Nomad', city: 'International', sector: 'Missions freelances', logo: (<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.4" /><path d="M3 10 H17 M10 3 C12.5 5 13.5 7.5 13.5 10 C13.5 12.5 12.5 15 10 17 C7.5 15 6.5 12.5 6.5 10 C6.5 7.5 7.5 5 10 3 Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>) },
  { name: 'Isolia', city: 'Vevey', sector: 'Isolation', logo: (<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="4" width="14" height="12" stroke="currentColor" strokeWidth="1.4" rx="1" /><path d="M3 8 H17 M3 12 H17 M7 4 V16 M13 4 V16" stroke="currentColor" strokeWidth="1.2" /></svg>) },
  { name: "Renov'Habitat", city: 'Lausanne', sector: 'Immobilier', logo: (<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 9 L10 3 L17 9 V17 H3 Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /><path d="M8 17 V12 H12 V17" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /><path d="M5 17 H15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>) },
  { name: 'Pharmacie Opale', city: 'Fribourg', sector: 'Santé', logo: (<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.4" /><path d="M10 6 V14 M6 10 H14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>) },
];

// ═════════════════════════════════════════════════════════════
// LOGO STRIP — quick social proof
// ═════════════════════════════════════════════════════════════
function LandingLogos({ isMobile }) {
  const brands = [
    { name: 'TradeAuto', logo: (<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 12 L4 8 C4.2 7.2 4.8 7 5.5 7 H14.5 C15.2 7 15.8 7.2 16 8 L17 12 V14 H15 V13 H5 V14 H3 Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /><circle cx="6.5" cy="13.5" r="1.2" fill="currentColor" /><circle cx="13.5" cy="13.5" r="1.2" fill="currentColor" /></svg>) },
    { name: 'Rénovia', logo: (<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 10 L10 4 L17 10 V16 H12 V12 H8 V16 H3 Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>) },
    { name: 'MadameLaGouvernante', logo: (<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 3 L10 17 M5 6 L15 6 M6 10 L14 10 M7 14 L13 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>) },
    { name: 'Cabinet Véran', logo: (<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 17 V8 L10 3 L16 8 V17" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /><path d="M8 17 V12 H12 V17" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /><circle cx="10" cy="8.5" r="1" fill="currentColor" /></svg>) },
    { name: "Renov'Habitat", logo: (<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 9 L10 3 L17 9 V17 H3 Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /><path d="M8 17 V12 H12 V17" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /><path d="M5 17 H15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>) },
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
    { node: <>Vous payez Meta pour des clics qui ne convertissent pas</> },
    { node: <span style={{ color: 'var(--ink)', fontWeight: 600 }}>Vous laissez 80&nbsp;% de vos prospects sur la table.</span>, emphasis: true },
    { node: <>2 prestataires, 2 contrats, 0 cohérence sur le funnel</> },
    { node: <>Reporting flou, vous y croyez ou pas</> },
    { node: <>Délai 6-8 semaines avant la moindre mise en ligne</> },
  ];
  const after = [
    { node: <>Vous savez chaque lundi combien votre acquisition vous a rapporté</> },
    { node: <>Vos commerciaux râlent&nbsp;: <em style={{ fontStyle: 'italic', color: 'rgba(255,255,255,.95)' }}>«&nbsp;trop de leads, pas assez de temps&nbsp;»</em></> },
    { node: <>Premier RDV qualifié sous 14 jours — preuve client à l'appui</> },
    { node: <>CHF 2'490 setup, point. Aucune surprise sur la facture.</> },
    { node: <>Une seule équipe, un seul livrable, un seul interlocuteur</> },
  ];
  const pad = isMobile ? '64px 20px' : '110px 120px';
  return (
    <section style={{ padding: pad, background: 'var(--bg)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="k-section-label" style={{ justifyContent: 'center' }}>
          <span className="k-section-label-sq"></span>
          03 — Le contraste
        </div>
        <h2 style={{
          fontSize: isMobile ? 32 : 52, marginTop: 18,
          letterSpacing: '-0.035em', lineHeight: 1.04,
          textAlign: 'center', maxWidth: 880, margin: '18px auto 0',
        }}>
          La différence entre <span style={{ color: 'var(--muted)' }}>"éparpillé"</span> et <em style={{ background: 'linear-gradient(120deg, #8B5CF6, #6D28D9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontStyle: 'normal' }}>"intégré"</em>.
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
              {before.map((it, i) => (
                <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: it.emphasis ? 15.5 : 14.5, color: 'var(--muted)', lineHeight: 1.55 }}>
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, marginTop: 3 }}>
                    <circle cx="10" cy="10" r="9" stroke={it.emphasis ? '#7C3AED' : '#9CA3AF'} strokeWidth="1.4" />
                    <path d="M7 7 L13 13 M13 7 L7 13" stroke={it.emphasis ? '#7C3AED' : '#9CA3AF'} strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                  <span>{it.node}</span>
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
                Vous, dans 30 jours
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: '20px 0 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
                {after.map((it, i) => (
                  <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 14.5, color: 'rgba(255,255,255,.85)', lineHeight: 1.55 }}>
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, marginTop: 3 }}>
                      <circle cx="10" cy="10" r="9" fill="#8B5CF6" />
                      <path d="M6 10 L9 13 L14 7" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                    <span>{it.node}</span>
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
  { v: 'b2c', l: 'Services aux particuliers (B2C)' },
  { v: 'b2b', l: 'Services aux entreprises (B2B)' },
  { v: 'medical', l: 'Services médicaux / paramédical' },
  { v: 'commerce', l: 'Commerce / e-commerce' },
  { v: 'autre', l: 'Autre' },
];
const GOALS = [
  { v: 'more-rdv', l: '+ de RDV qualifiés / mois' },
  { v: 'cheaper', l: 'Acquisition − chère' },
  { v: 'predictable', l: 'Acquisition + prévisible' },
  { v: 'launch', l: 'Lancer un nouveau produit/service' },
];
const BUDGETS = [
  { v: 'none', l: 'Pas encore lancé' },
  { v: 'lt2k', l: '< 2 000 CHF / mois' },
  { v: '2-5k', l: '2 000 — 5 000 CHF / mois' },
  { v: '5-15k', l: '5 000 — 15 000 CHF / mois' },
  { v: '15kplus', l: '15 000+ CHF / mois' },
];
const TIMINGS = [
  { v: 'now', l: 'Dans le mois' },
  { v: 'quarter', l: 'Ce trimestre' },
  { v: 'exploring', l: 'Pas encore décidé' },
];
const OUTCOMES = [
  { v: 'recruter', l: 'Recruter de nouveaux collaborateurs' },
  { v: 'scaler', l: "Doubler mon chiffre d'affaires" },
  { v: 'strategique', l: 'Reprendre du temps stratégique' },
  { v: 'vacances', l: 'Enfin prendre de vraies vacances' },
  { v: 'autre', l: 'Autre' },
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
    sector: '', sector_other: '', goal: '', budget: '', outcome: '',
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
        if (parsed?.step && parsed.step >= 1 && parsed.step <= 5) setStep(parsed.step);
      }
    } catch (_) {}
  }, []);

  // persist
  useEffect(() => {
    try { localStorage.setItem(LANDING_FORM_KEY, JSON.stringify({ data, step })); } catch (_) {}
  }, [data, step]);

  const total = 5;
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

    // Best-effort Supabase persistence. We never block the user on a CRM failure —
    // the Calendly booking is what closes the loop, and the lead's contact info
    // still reaches us via the Calendly invite.
    if (isSupabaseConfigured) {
      try {
        const fullPayload = data.outcome ? { ...payload, outcome: data.outcome } : payload;
        let insertErr = null;
        const r = await supabase.from('leads').insert(fullPayload);
        insertErr = r.error;
        if (insertErr) {
          const safePayload = {
            ...fullPayload,
            sector: null, goal: null, budget: null, timing: null, outcome: null,
            notes: [
              data.sector ? `Activité: ${SECTOR_LABEL[data.sector] || data.sector}` : null,
              data.sector === 'autre' && data.sector_other ? `Activité (libre): ${data.sector_other}` : null,
              data.goal ? `Objectif: ${GOAL_LABEL[data.goal] || data.goal}` : null,
              data.budget ? `Budget: ${BUDGET_LABEL[data.budget] || data.budget}` : null,
              data.outcome ? `Outcome: ${data.outcome}` : null,
              data.timing ? `Timing: ${TIMING_LABEL[data.timing] || data.timing}` : null,
            ].filter(Boolean).join(' · '),
          };
          const r2 = await supabase.from('leads').insert(safePayload);
          insertErr = r2.error;
          if (insertErr) {
            delete safePayload.notes;
            const r3 = await supabase.from('leads').insert(safePayload);
            insertErr = r3.error;
          }
        }
        if (insertErr) {
          // Log the failure but don't block the user.
          // eslint-disable-next-line no-console
          console.warn('[landing2] Supabase insert failed, continuing to thank-you screen:', insertErr);
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('[landing2] Submit threw, continuing to thank-you screen:', err);
      }
    }

    // Meta Pixel (conditional, no-op if not loaded)
    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
      try { window.fbq('track', 'Lead'); } catch (_) {}
    }
    const url = buildCalendlyUrl(payload);
    setCalendlyUrl(url);
    setSubmitted(true);
    try { localStorage.removeItem(LANDING_FORM_KEY); } catch (_) {}
    setSubmitting(false);
  };

  const canNext = useMemo(() => {
    if (step === 1) {
      if (!data.sector) return false;
      if (data.sector === 'autre' && !data.sector_other.trim()) return false;
      return true;
    }
    if (step === 2) return Boolean(data.goal);
    if (step === 3) return Boolean(data.budget);
    if (step === 4) return Boolean(data.outcome);
    return true;
  }, [step, data]);

  const pad = isMobile ? '64px 20px' : '110px 120px';

  // CONFIRMATION SCREEN
  if (submitted) {
    return (
      <section ref={ref} id="form" style={{ padding: pad, background: 'linear-gradient(180deg, #FAFAFA 0%, #F5F3FF 100%)' }}>
        <div style={{
          maxWidth: 760, margin: '0 auto',
          padding: isMobile ? '36px 24px' : '52px 48px',
          background: '#fff', borderRadius: 20,
          border: '1px solid var(--line-2)',
          boxShadow: '0 40px 100px -40px rgba(124,58,237,.35)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(139,92,246,.10), transparent 70%)', pointerEvents: 'none' }}></div>
          <div style={{ position: 'relative' }}>
            {/* Confirmation */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{
                flexShrink: 0,
                width: 44, height: 44, borderRadius: '50%',
                background: 'linear-gradient(135deg, #C4B5FD, #8B5CF6 65%, #6D28D9)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 8px 20px -6px rgba(124,58,237,.55)',
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12 L10 17 L19 7" /></svg>
              </span>
              <h2 style={{ fontSize: isMobile ? 24 : 30, letterSpacing: '-0.025em', lineHeight: 1.15, fontWeight: 600, margin: 0 }}>
                C'est noté{data.first_name ? `, ${data.first_name}` : ''}.
              </h2>
            </div>

            <p style={{ fontSize: isMobile ? 15 : 16.5, marginTop: 16, color: 'rgba(31,27,46,.78)', lineHeight: 1.6 }}>
              Votre plan personnalisé est en cours de préparation. Vous le recevrez par email sous <strong style={{ color: 'var(--ink)', fontWeight: 600 }}>24h ouvrées</strong>.
            </p>

            {/* Divider */}
            <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(124,58,237,.18), transparent)', margin: isMobile ? '28px 0' : '36px 0' }} />

            {/* Calendly invitation */}
            <div>
              <div className="mono" style={{ fontSize: 11, color: 'var(--violet-deep)', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600 }}>
                Pour gagner du temps
              </div>
              <p style={{ fontSize: isMobile ? 15 : 16, marginTop: 10, color: 'var(--ink)', lineHeight: 1.6, fontWeight: 500 }}>
                Réservez directement votre créneau de visio — <span style={{ color: 'var(--muted)', fontWeight: 400 }}>30&nbsp;min, gratuit. Votre plan sera prêt à ce moment-là.</span>
              </p>

              {/* Calendly inline embed */}
              <div style={{
                marginTop: 18,
                borderRadius: 14,
                overflow: 'hidden',
                border: '1px solid var(--line-2)',
                background: '#fff',
                boxShadow: '0 12px 30px -16px rgba(124,58,237,.25)',
              }}>
                <iframe
                  title="Réserver un créneau Kairn"
                  src={(calendlyUrl || BOOKING_URL) + ((calendlyUrl || BOOKING_URL).includes('?') ? '&' : '?') + 'embed_type=Inline&hide_gdpr_banner=1&primary_color=7c3aed'}
                  style={{ width: '100%', height: isMobile ? 560 : 640, border: 'none', display: 'block' }}
                  loading="lazy"
                />
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(124,58,237,.18), transparent)', margin: isMobile ? '24px 0' : '32px 0' }} />

            {/* Fallback note */}
            <p style={{ fontSize: isMobile ? 13.5 : 14.5, color: 'var(--muted)', lineHeight: 1.6, fontStyle: 'italic' }}>
              Si vous préférez attendre l'audit avant la visio, aucun souci — il arrivera dans votre boîte sous 24h.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // FORM SCREEN
  return (
    <section ref={ref} id="form" style={{ padding: pad, background: 'linear-gradient(180deg, #FAFAFA 0%, #F5F3FF 100%)' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', marginBottom: isMobile ? 20 : 28, textAlign: 'center' }}>
        <div className="k-section-label" style={{ display: 'inline-flex' }}>
          <span className="k-section-label-sq"></span>
          04 — Votre plan en 30 secondes
        </div>
      </div>
      <div style={{
        maxWidth: 760, margin: '0 auto',
        padding: isMobile ? '32px 22px 36px' : '48px 56px 52px',
        background: '#fff', borderRadius: 20,
        border: '1px solid var(--line-2)',
        boxShadow: '0 40px 100px -40px rgba(124,58,237,.30)',
      }}>
        <h2 style={{
          fontSize: isMobile ? 26 : 36, marginTop: 14,
          letterSpacing: '-0.025em', lineHeight: 1.18, fontWeight: 500,
          color: 'var(--ink)',
          maxWidth: 720,
          textWrap: 'balance',
          textAlign: 'center',
          marginLeft: 'auto', marginRight: 'auto',
        }}>
          5 questions, 60 secondes pour savoir si on peut{' '}
          <em style={{
            fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 400,
            background: 'linear-gradient(120deg, #8B5CF6, #6D28D9)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            whiteSpace: 'nowrap',
          }}>multiplier vos RDV par 4</em>.
        </h2>
        <p style={{
          fontSize: isMobile ? 14.5 : 16,
          color: 'var(--muted)',
          marginTop: 10,
          lineHeight: 1.5,
          maxWidth: 600,
          textAlign: 'center',
          marginLeft: 'auto', marginRight: 'auto',
        }}>
          Ou si votre problème est ailleurs — on vous le dit cash.
        </p>

        <div style={{ marginTop: isMobile ? 28 : 36 }}>
          <ProgressBar step={step} total={total} />

          {step === 1 && (
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 500, letterSpacing: '-0.015em' }}>Quel type d'activité&nbsp;?</h3>
              <p style={{ fontSize: 13.5, marginTop: 6, color: 'var(--muted)', fontStyle: 'italic', lineHeight: 1.55 }}>
                On a déjà calibré nos campagnes par catégorie de business — vous bénéficiez direct des benchmarks observés.
              </p>
              <div style={{
                display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                gap: 10, marginTop: 18,
              }}>
                {SECTORS.map((s) => (
                  <Chip
                    key={s.v}
                    active={data.sector === s.v}
                    onClick={() => {
                      set('sector', s.v);
                      if (s.v !== 'autre') setTimeout(next, 160);
                    }}
                  >
                    {s.l}
                  </Chip>
                ))}
              </div>
              {data.sector === 'autre' && (
                <div style={{ marginTop: 16, position: 'relative' }}>
                  <label htmlFor="sector-other-input" style={{ display: 'block', fontSize: 12.5, color: 'var(--muted)', fontWeight: 500, marginBottom: 6 }}>
                    Précisez votre type d'activité
                  </label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      id="sector-other-input"
                      autoFocus
                      value={data.sector_other}
                      onChange={(e) => set('sector_other', e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && data.sector_other.trim()) {
                          e.preventDefault();
                          next();
                        }
                      }}
                      placeholder="Ex. coach sportif, consultant, école, …"
                      style={{
                        flex: 1,
                        padding: '12px 14px', fontSize: 14.5,
                        border: '1px solid var(--line-2)', borderRadius: 12,
                        background: '#fff', color: 'var(--ink)',
                        fontFamily: 'Geist, sans-serif',
                        outline: 'none',
                      }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(124,58,237,.5)'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(196,181,253,.25)'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--line-2)'; e.currentTarget.style.boxShadow = 'none'; }}
                    />
                    <button
                      type="button"
                      onClick={() => { if (data.sector_other.trim()) next(); }}
                      disabled={!data.sector_other.trim()}
                      style={{
                        padding: '0 16px', minWidth: 52,
                        background: data.sector_other.trim() ? 'linear-gradient(180deg, #9B6FFB 0%, #7C3AED 100%)' : 'var(--line-2)',
                        color: data.sector_other.trim() ? '#fff' : 'var(--muted)',
                        border: 'none', borderRadius: 12,
                        cursor: data.sector_other.trim() ? 'pointer' : 'default',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        fontFamily: 'Geist, sans-serif', fontSize: 14, fontWeight: 500,
                        transition: 'background .2s, transform .15s',
                      }}
                      aria-label="Valider et continuer"
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M3 7 L11 7 M7 3 L11 7 L7 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 500, letterSpacing: '-0.015em' }}>Qu'est-ce qui changerait le plus pour vous&nbsp;?</h3>
              <p style={{ fontSize: 13.5, marginTop: 6, color: 'var(--muted)', fontStyle: 'italic', lineHeight: 1.55 }}>
                Plus de leads, moins cher, ou plus prévisible — on calibre la mission selon ce qui compte vraiment.
              </p>
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
              <h3 style={{ fontSize: 18, fontWeight: 500, letterSpacing: '-0.015em' }}>Budget mensuel actuel sur Meta&nbsp;?</h3>
              <p style={{ fontSize: 13.5, marginTop: 6, color: 'var(--muted)', fontStyle: 'italic', lineHeight: 1.55 }}>
                On adapte le plan à ce que vous dépensez aujourd'hui — et à ce qui est réaliste de viser.
              </p>
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
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 500, letterSpacing: '-0.015em' }}>
                Si on doublait vos RDV qualifiés en 30 jours, qu'est-ce que ça changerait pour vous&nbsp;?
              </h3>
              <p style={{ fontSize: 13.5, marginTop: 6, color: 'var(--muted)', fontStyle: 'italic', lineHeight: 1.55 }}>
                Pas de mauvaise réponse — on calibre selon ce qui compte vraiment.
              </p>
              <div style={{
                display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                gap: 10, marginTop: 18,
              }}>
                {OUTCOMES.map((o) => (
                  <Chip key={o.v} active={data.outcome === o.v} onClick={() => { set('outcome', o.v); setTimeout(next, 160); }}>
                    {o.l}
                  </Chip>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <form onSubmit={submit}>
              <h3 style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em' }}>Vous y êtes presque.</h3>
              <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 8, lineHeight: 1.6 }}>
                Votre plan personnalisé est généré sur la base de vos réponses. Un consultant Kairn vous l'envoie sous 24h ouvrées.
              </p>
              <div style={{
                display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                gap: 14, marginTop: 18,
              }}>
                <Input label="Prénom" value={data.first_name} onChange={(v) => set('first_name', v)} required autoComplete="given-name" />
                <Input label="Entreprise" value={data.company} onChange={(v) => set('company', v)} required autoComplete="organization" />
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

              <button type="submit" disabled={submitting} className="k-cta k-cta-quiz" style={{
                position: 'relative', overflow: 'hidden',
                marginTop: 26, padding: '16px 26px', fontSize: 16, width: '100%',
                background: 'linear-gradient(180deg, #9B6FFB 0%, #7C3AED 100%)',
                color: '#fff', border: 'none', cursor: submitting ? 'wait' : 'pointer',
                opacity: submitting ? 0.7 : 1,
                justifyContent: 'center',
              }}>
                <span aria-hidden="true" className="k-cta-quiz-sheen" />
                <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                  {submitting ? 'Envoi…' : 'Recevoir mon plan personnalisé'}
                  {!submitting && <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7 L11 7 M7 3 L11 7 L7 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                </span>
              </button>

              <div style={{ marginTop: 16, fontSize: 12.5, color: 'var(--muted)', textAlign: 'center', lineHeight: 1.6 }}>
                Pas de spam · Réponse personnelle sous 24h · Données hébergées en UE · Conforme nLPD/RGPD
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 18 }}>
                <button onClick={back} type="button" style={{
                  padding: '8px 14px', background: 'transparent', border: 'none',
                  color: 'var(--muted)',
                  fontFamily: 'Geist, sans-serif', fontSize: 13.5, cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                }}>
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M11 7 L3 7 M7 3 L3 7 L7 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  Retour à l'étape précédente
                </button>
              </div>
            </form>
          )}

          {step > 1 && step < 5 && (
            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginTop: 26 }}>
              <button onClick={back} type="button" style={{
                padding: '10px 14px', background: 'transparent', border: 'none',
                color: 'var(--muted)',
                fontFamily: 'Geist, sans-serif', fontSize: 14, cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 6,
              }}>
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M11 7 L3 7 M7 3 L3 7 L7 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                Retour
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
    liveUrl: 'https://r-novia.vercel.app/',
  },
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
    quote: "On était à 12 leads/mois à 27 CHF pièce, dispersés entre 3 outils. Trois mois plus tard : 86/semaine à 10 CHF, dans un seul dashboard. J'ai dû recruter un commercial pour absorber le flux — c'était le seul vrai problème qu'il me restait.",
    author: 'Louis · Fondateur, TRADEAUTO.CH · Genève',
    liveUrl: 'https://tradeauto.ch',
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
    liveUrl: 'https://madamelagouvernante.com',
  },
  {
    company: { name: 'BAOBAB', logo: '/baobab-logo.svg' },
    tags: ['HR Tech', 'Plateforme B2B', 'Build full-stack'],
    title: 'Plateforme RH complète : sourcing, dashboard et automatisation full-stack',
    challenge: "Sourcing manuel de talents malgaches via emails et tableurs. Pas de visibilité côté entreprises FR clientes, processus de recrutement opaque, scaling impossible — chaque match coûtait des heures de coordination.",
    solution: "Landing page B2B pour attirer les entreprises francophones, plateforme complète de matching talents/entreprises, dashboard de gestion temps réel pour les clients, et automatisation full-stack du sourcing au billing. Une seule équipe, livraison end-to-end.",
    kpis: [
      { value: '+340%', label: "entreprises FR onboardées en 90 jours" },
      { value: '500+', label: 'talents vérifiés dans la base · scaling automatique' },
      { value: '8 sem.', label: 'du brief à la plateforme complète live' },
    ],
    quote: "On était sur Airtable avec 4 personnes qui passaient leurs journées à matcher des talents à la main. Aujourd'hui le système tourne tout seul, le client signe en 24h, le talent commence en 48h. On a pu se concentrer sur la croissance.",
    author: 'Fondateur · BAOBABFREELANCE.COM · Sion (Valais)',
    liveUrl: 'https://www.baobabfreelance.com/',
  },
];

const LANDING_STEPS = [
  { n: '01', t: 'Brief', d: 'Cadrage offre, ICP, message clé. Jour 1 — un seul call de 60 minutes.' },
  { n: '02', t: 'Build', d: 'Landing page sur-mesure, tracking serveur, setup Meta & Google Ads. Jours 2 à 6.' },
  { n: '03', t: 'Launch', d: 'Mise en ligne, campagnes activées, budget calibré. Jour 7 — vous êtes en ligne.' },
  { n: '04', t: 'Optimize', d: 'Itérations hebdo sur créas, audiences et funnel. Reporting détaillé chaque lundi.' },
];

// Wrapper to attach proofRef while reusing the main-site KCases component
const LandingCasesAnchor = React.forwardRef(function LandingCasesAnchor({ isMobile }, ref) {
  return (
    <div ref={ref} id="proof">
      <KCases isMobile={isMobile} cases={LANDING_CASES} sectionLabel="05 — Réalisations" />
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
      q: 'Pourquoi un prix unique au lieu d\'un devis sur-mesure ?',
      a: 'On a standardisé un livrable qui marche pour 90% des PME romandes : landing page + ads Meta & Google + gestion mensuelle. Si votre cas sort du cadre, on vous le dit en audit — mais dans la majorité des situations, vous payez ce qui est affiché, pas un devis qui gonfle au fil des semaines.',
    },
    {
      q: 'Combien de temps avant les premiers leads ?',
      a: 'Mise en ligne sous 7 jours après le brief. Premiers leads dès la 1re semaine de diffusion ads — la phase d\'optimisation CPL prend typiquement 2 à 4 semaines supplémentaires pour atteindre les seuils visés.',
    },
    {
      q: 'La gestion mensuelle inclut quoi exactement ?',
      a: 'Optimisation continue des campagnes, A/B sur créas et audiences, ajustement des budgets, reporting détaillé chaque lundi, 1 call mensuel de point. Le budget ads que vous dépensez chez Meta/Google est en plus — vous le contrôlez intégralement.',
    },
    {
      q: 'Et si je veux juste la landing page sans les ads ?',
      a: 'Possible mais ce n\'est pas notre offre principale. On performe quand on contrôle l\'intégralité du tunnel (page + tracking + ads) — c\'est ce qui nous permet de tenir le prix d\'entrée à CHF 2\'490. Pour une LP seule, parlons-en en audit.',
    },
    {
      q: 'Que se passe-t-il à la fin de l\'engagement ?',
      a: 'Vous récupérez 100% des assets : code source du site, comptes Meta/Google Ads, dashboards, automatisations. Pas de lock-in. Vous pouvez partir avec un préavis de 30 jours après les 90 premiers jours.',
    },
    {
      q: 'Qui est propriétaire des assets (site, comptes ads) ?',
      a: 'Vous, intégralement. Comptes Meta/Google créés à votre nom, code livré sous votre repo, automations sur vos workspaces. On a accès tant que la mission est active — vous gardez tout après.',
    },
    {
      q: 'Vous gardez nos données en Suisse ?',
      a: 'Données utilisateurs hébergées en UE (Frankfurt, Supabase). Conforme nLPD et RGPD. Si vous avez des contraintes spécifiques de souveraineté CH, on adapte le stack à votre charge — c\'est rare mais possible.',
    },
  ];
  const pad = isMobile ? '80px 20px' : '140px 80px';
  return (
    <section style={{ padding: pad, background: '#fff', position: 'relative' }}>
      <div style={{ maxWidth: 920, margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '6px 14px 6px 12px', borderRadius: 999, background: '#fff', border: '1px solid var(--line-2)', boxShadow: '0 1px 0 rgba(10,10,10,.02)' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--violet)' }} />
          <span className="mono" style={{ fontSize: 11, color: 'var(--violet-deep)', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 500 }}>
            07 — Questions fréquentes
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
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#fff', fontWeight: 500 }}>
          <svg width="16" height="12" viewBox="0 0 14 10" fill="none" aria-label="Suisse">
            <rect width="14" height="10" rx="1.5" fill="#D52B1E" />
            <rect x="5.7" y="1.8" width="2.6" height="6.4" fill="#fff" />
            <rect x="3" y="4.3" width="8" height="1.4" fill="#fff" />
          </svg>
          Kairn · Suisse Romande
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '6px 16px', fontSize: 12.5 }}>
          <span>Lausanne · Genève</span>
          <span>·</span>
          <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: '#C4B5FD', textDecoration: 'none' }}>{CONTACT_EMAIL}</a>
          <span>·</span>
          <a href="/" style={{ color: 'rgba(255,255,255,.6)', textDecoration: 'none' }}>Découvrir l'agence</a>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '6px 16px', fontSize: 12.5, marginTop: 2 }}>
          <Link to="/mentions-legales" style={{ color: '#C4B5FD', textDecoration: 'none' }}>Mentions légales</Link>
          <span style={{ color: 'rgba(196,181,253,.4)' }}>·</span>
          <Link to="/confidentialite" style={{ color: '#C4B5FD', textDecoration: 'none' }}>Confidentialité</Link>
          <span style={{ color: 'rgba(196,181,253,.4)' }}>·</span>
          <Link to="/cgv" style={{ color: '#C4B5FD', textDecoration: 'none' }}>CGV</Link>
        </div>
        <div className="mono" style={{ fontSize: 10.5, color: 'rgba(255,255,255,.45)', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 4, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '4px 10px' }}>
          <span>Données hébergées en UE</span>
          <span style={{ color: 'rgba(196,181,253,.35)' }}>·</span>
          <span>Conforme nLPD &amp; RGPD</span>
          <span style={{ color: 'rgba(196,181,253,.35)' }}>·</span>
          <span>Tarifs en CHF</span>
          <span style={{ color: 'rgba(196,181,253,.35)' }}>·</span>
          <span>© 2026</span>
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
  const offerRef = useRef(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const scrollToProof = () => {
    proofRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const scrollToOffer = () => {
    offerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="kairn">
      <LandingNav />
      <LandingHero isMobile={isMobile} onScrollToOffer={scrollToOffer} onScrollToProof={scrollToProof} />
      <KLogos isMobile={isMobile} brands={ROMANDIE_BRANDS} label="Des PME romandes qui nous font confiance" />
      <LandingOffer ref={offerRef} isMobile={isMobile} onScrollToForm={scrollToForm} />
      <LandingDeliverables isMobile={isMobile} />
      <LandingBeforeAfter isMobile={isMobile} />
      <LandingForm ref={formRef} isMobile={isMobile} />
      <LandingCasesAnchor ref={proofRef} isMobile={isMobile} />
      <KProcess isMobile={isMobile} steps={LANDING_STEPS} kpis={['Jour 1', 'Jours 2-6', 'Jour 7', 'Hebdo']} subheading={null} sectionLabel="06 — Processus" />
      <LandingFAQ isMobile={isMobile} />
      <KFinalCTA
        isMobile={isMobile}
        eyebrow="Prochains créneaux · cette semaine"
        heading={(
          <>
            <span style={{ display: 'block' }}>Combien de RDV votre site</span>
            <span style={{
              display: 'block',
              fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 400,
              background: 'linear-gradient(120deg, #8B5CF6, #6D28D9)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>rate chaque mois&nbsp;?</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45em', fontSize: '0.62em', color: 'var(--ink)', fontWeight: 500, marginTop: '0.35em', letterSpacing: '-0.02em' }}>
              Découvrez-le en 60&nbsp;secondes
              <span aria-hidden="true" className="k-finalcta-arrow" style={{
                position: 'relative',
                width: '1.5em', height: '1.5em',
                borderRadius: '50%',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(180deg, #9B6FFB 0%, #6D28D9 100%)',
                boxShadow: '0 1px 0 rgba(255,255,255,.35) inset, 0 6px 14px -4px rgba(124,58,237,.55), 0 0 0 4px rgba(196,181,253,.25)',
              }}>
                <svg width="0.78em" height="0.78em" viewBox="0 0 14 14" fill="none" style={{ display: 'block' }}>
                  <path d="M7 3.5 V10 M4 7.5 L7 10.5 L10 7.5" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              </span>
            </span>
            <style>{`
              @keyframes k-finalcta-arrow-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(4px); } }
              @keyframes k-finalcta-arrow-ring { 0%, 100% { box-shadow: 0 1px 0 rgba(255,255,255,.35) inset, 0 6px 14px -4px rgba(124,58,237,.55), 0 0 0 4px rgba(196,181,253,.25); } 50% { box-shadow: 0 1px 0 rgba(255,255,255,.35) inset, 0 8px 18px -3px rgba(124,58,237,.7), 0 0 0 8px rgba(196,181,253,0); } }
              .k-finalcta-arrow { animation: k-finalcta-arrow-bob 1.8s ease-in-out infinite, k-finalcta-arrow-ring 1.8s ease-out infinite; }
            `}</style>
          </>
        )}
        body={(
          <div style={{
            background: 'rgba(255,255,255,.55)',
            backdropFilter: 'saturate(140%) blur(8px)',
            WebkitBackdropFilter: 'saturate(140%) blur(8px)',
            border: '1px solid rgba(124,58,237,.18)',
            borderRadius: 16,
            padding: isMobile ? '20px 22px' : '24px 28px',
            boxShadow: '0 1px 0 rgba(255,255,255,.7) inset, 0 12px 30px -16px rgba(124,58,237,.28)',
          }}>
            <div className="mono" style={{
              fontSize: 11, color: 'var(--violet-deep)', letterSpacing: '0.2em',
              textTransform: 'uppercase', fontWeight: 600, marginBottom: 14,
            }}>
              À la fin du quiz, vous repartez avec
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { strong: 'Votre audit chiffré', rest: 'combien vous laissez sur la table, et pourquoi.' },
                { strong: 'Une reformulation d\'offre', rest: 'taillée pour votre secteur.' },
                { strong: 'Un créneau visio 30 min', rest: 'gratuit — si on peut vous aider.' },
              ].map((it, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, lineHeight: 1.5 }}>
                  <span style={{
                    flexShrink: 0,
                    width: 22, height: 22, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #C4B5FD 0%, #8B5CF6 100%)',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 10px -4px rgba(124,58,237,.55), 0 0 0 1px rgba(255,255,255,.6) inset',
                    marginTop: 2,
                  }}>
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                      <path d="M3 7 L6 10 L11 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                  </span>
                  <span style={{ fontSize: isMobile ? 14.5 : 15.5, color: 'var(--ink)' }}>
                    <strong style={{ fontWeight: 600 }}>{it.strong}</strong>
                    {' — '}
                    <span style={{ color: 'rgba(31,27,46,.7)' }}>{it.rest}</span>
                  </span>
                </li>
              ))}
            </ul>
            <div style={{
              marginTop: 16, paddingTop: 14,
              borderTop: '1px dashed rgba(124,58,237,.22)',
              fontSize: isMobile ? 13.5 : 14.5,
              color: 'rgba(31,27,46,.78)',
              lineHeight: 1.5,
            }}>
              <strong style={{ color: 'var(--ink)', fontWeight: 600 }}>Si on ne peut pas, on vous le dit cash.</strong>{' '}
              <span style={{ color: 'var(--muted)' }}>Pas de pitch, pas de relance.</span>
            </div>
          </div>
        )}
        primaryCta={{ label: 'Faire le quiz (60 sec)', onClick: scrollToForm }}
        secondaryCta={{ label: 'Réserver 30 min', href: BOOKING_URL, external: true }}
        steps={[
          { n: '01', t: 'Vous nous racontez votre situation en 30 secondes.', d: 'Quelques questions courtes. Vos coordonnées en dernier, pas avant.', duration: '30 sec', delivery: 'Vous' },
          { n: '02', t: 'Vous recevez votre audit chiffré sous 24h.', d: "Ce que vous ratez chaque mois, combien ça vous coûte, et comment le réparer en 14 jours. Vous le gardez — même si on ne travaille jamais ensemble.", badge: 'Offert', featured: true, duration: 'Sous 24h', delivery: 'Nous' },
          { n: '03', t: 'Vous repartez avec un plan d\'action concret.', d: '30 min en visio · une reformulation d\'offre taillée pour votre secteur + plan priorisé.', duration: '30 min', delivery: 'Ensemble' },
        ]}
        trustline="Si on ne peut pas vous aider, on vous le dit cash et on vous oriente vers quelqu'un qui peut."
      />
      <LandingFooter />
      {isMobile && (
        <div style={{ position: 'sticky', bottom: 0, padding: '0 0 12px', pointerEvents: 'none', zIndex: 30 }}>
          <button onClick={scrollToOffer} className="k-mob-cta" style={{ pointerEvents: 'auto', border: 'none', cursor: 'pointer', width: 'calc(100% - 24px)', margin: '0 12px' }}>
            <span style={{ fontSize: 14, fontWeight: 500 }}>Voir l'offre</span>
            <span style={{ fontSize: 13, color: '#C4B5FD', fontWeight: 500 }}>CHF 2'490 + 590/mois →</span>
          </button>
        </div>
      )}
    </div>
  );
}
