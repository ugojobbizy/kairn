import React from 'react';
import { KNav } from './sections-1.jsx';
import { KTestimonials, KLogos, KFinalCTA, KFooter } from './sections-3.jsx';
import { BOOKING_URL } from './config.js';

// ═════════════════════════════════════════════════════════════
// HERO
// ═════════════════════════════════════════════════════════════
function RealisationsHero({ isMobile }) {
  return (
    <section className="k-hero k-hero-bg" style={{ position: 'relative', paddingBottom: isMobile ? 32 : 48 }}>
      <div className="k-hero-blob" style={{ width: 440, height: 440, background: '#C4B5FD', top: -120, left: '12%' }}></div>
      <div className="k-hero-blob" style={{ width: 520, height: 520, background: '#8B5CF6', top: -40, right: '10%', opacity: .22, animationDelay: '-6s' }}></div>

      <div style={{ textAlign: 'center', paddingTop: isMobile ? 40 : 80, position: 'relative' }}>
        <span className="k-eyebrow">
          <span className="k-eyebrow-dot"></span>
          Réalisations 2026
        </span>
      </div>

      <h1 className="k-hero-headline" style={{ fontSize: isMobile ? 42 : 88, marginTop: isMobile ? 20 : 32 }}>
        Ce qu'on a livré. <em>Ce que ça a donné.</em>
      </h1>
      <p className="k-hero-sub" style={{ fontSize: isMobile ? 16 : 19, marginTop: isMobile ? 20 : 28 }}>
        Des projets <strong style={{ color: 'var(--ink)', fontWeight: 500 }}>Build + Ads</strong> livrés sous un seul toit. Sites, funnels, automatisations, campagnes — avec des résultats traçables, pas des slides.
      </p>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════
// TUNNEL LAYER — bloc acquisition / gestion / pilotage
// ═════════════════════════════════════════════════════════════
function TunnelLayer({ step, label, title, body, url, img, alt, objectPosition = 'top', objectFit = 'cover', isMobile, isLast = false }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '0.85fr 1.15fr',
      gap: isMobile ? 20 : 40,
      alignItems: 'center',
      paddingBottom: isLast ? 0 : (isMobile ? 32 : 48),
      marginBottom: isLast ? 0 : (isMobile ? 32 : 48),
      borderBottom: isLast ? 'none' : '1px dashed rgba(196,181,253,.18)',
    }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 14 }}>
          <span className="mono" style={{
            fontSize: 34, fontWeight: 600,
            letterSpacing: '-0.02em',
            background: 'linear-gradient(180deg, #C4B5FD, #8B5CF6)',
            WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
            fontFeatureSettings: '"tnum"',
          }}>{step}</span>
          <span className="mono" style={{
            fontSize: 11,
            color: '#C4B5FD',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            fontWeight: 500,
          }}>{label}</span>
        </div>
        <h3 style={{
          fontSize: isMobile ? 26 : 32,
          fontWeight: 600,
          color: '#fff',
          letterSpacing: '-0.025em',
          lineHeight: 1.1,
        }}>{title}</h3>
        <p style={{
          fontSize: 14.5,
          color: 'rgba(255,255,255,.72)',
          marginTop: 14,
          lineHeight: 1.6,
        }}>{body}</p>
      </div>

      <div style={{
        borderRadius: 14,
        overflow: 'hidden',
        background: '#fff',
        border: '1px solid rgba(255,255,255,.12)',
        boxShadow: '0 30px 80px -20px rgba(0,0,0,.6)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 14px',
          background: '#F5F3FF',
          borderBottom: '1px solid var(--line-2)',
        }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#F87171' }}></span>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#FBBF24' }}></span>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#34D399' }}></span>
          <span className="mono" style={{ flex: 1, textAlign: 'center', fontSize: 11, color: 'var(--muted)' }}>{url}</span>
          <span className="mono" style={{ fontSize: 10, color: 'var(--violet-deep)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Live</span>
        </div>
        <div style={{ aspectRatio: isMobile ? '4 / 3' : '16 / 10', overflow: 'hidden', background: '#fafafa' }}>
          <img src={img} alt={alt} style={{ width: '100%', height: '100%', objectFit, objectPosition }} />
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// FEATURED — TRADEAUTO.CH
// ═════════════════════════════════════════════════════════════
function FeaturedTradeauto({ isMobile }) {
  const pad = isMobile ? '40px 16px 60px' : '60px 60px 100px';

  return (
    <section style={{ padding: pad, background: 'var(--bg)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{
          position: 'relative',
          borderRadius: isMobile ? 20 : 28,
          overflow: 'hidden',
          background: 'linear-gradient(180deg, #0E0820 0%, #150B2E 50%, #0B0716 100%)',
          border: '1px solid rgba(139,92,246,.25)',
          boxShadow: '0 40px 120px -30px rgba(124,58,237,.55)',
        }}>
          {/* ambient glow */}
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 85% -10%, rgba(139,92,246,.4), transparent 55%), radial-gradient(ellipse at 15% 120%, rgba(196,181,253,.18), transparent 55%)', pointerEvents: 'none' }}></div>

          {/* header strip */}
          <div style={{
            position: 'relative',
            padding: isMobile ? '24px 20px 20px' : '36px 48px 28px',
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? 16 : 24,
            alignItems: isMobile ? 'flex-start' : 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255,255,255,.08)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '6px 12px 6px 10px', borderRadius: 999,
                background: 'rgba(139,92,246,.18)',
                border: '1px solid rgba(196,181,253,.3)',
                fontFamily: 'Geist Mono, monospace',
                fontSize: 11, fontWeight: 500, color: '#C4B5FD',
                letterSpacing: '0.14em', textTransform: 'uppercase',
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#C4B5FD', boxShadow: '0 0 8px rgba(196,181,253,.7)' }}></span>
                Projet phare · Build + Ads
              </span>
            </div>
            <a href="https://www.tradeauto.ch" target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              color: '#fff', fontSize: 14, fontWeight: 500,
              padding: '10px 16px 10px 18px', borderRadius: 999,
              background: 'rgba(255,255,255,.06)',
              border: '1px solid rgba(255,255,255,.12)',
              transition: 'background .2s, border-color .2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,.12)'; e.currentTarget.style.borderColor = 'rgba(196,181,253,.4)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.12)'; }}
            >
              <span className="mono" style={{ fontSize: 12, color: 'rgba(196,181,253,.8)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Live</span>
              tradeauto.ch
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M4 10 L10 4 M5 4 L10 4 L10 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </a>
          </div>

          {/* title block */}
          <div style={{ position: 'relative', padding: isMobile ? '32px 20px 20px' : '56px 48px 32px', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr auto', gap: isMobile ? 20 : 40, alignItems: 'flex-end' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                <div style={{
                  width: isMobile ? 52 : 64, height: isMobile ? 52 : 64, borderRadius: 14,
                  background: '#0A0A0A',
                  border: '1px solid rgba(255,255,255,.08)',
                  padding: 6,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <img src="/tradeauto-logo.png" alt="TRADEAUTO logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div>
                  <div className="mono" style={{ fontSize: 11, color: 'rgba(196,181,253,.7)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                    Cas d'étude · 01
                  </div>
                  <div className="mono" style={{ fontSize: 12, color: 'rgba(255,255,255,.55)', marginTop: 4, letterSpacing: '0.04em' }}>
                    Automobile · Suisse · B2C + B2B
                  </div>
                </div>
              </div>
              <h2 style={{
                fontSize: isMobile ? 44 : 80,
                fontWeight: 600,
                letterSpacing: '-0.04em',
                lineHeight: 0.98,
                color: '#fff',
              }}>
                TRADEAUTO<span style={{
                  background: 'linear-gradient(180deg, #F8A85A, #F59E0B)',
                  WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>.CH</span>
              </h2>
              <p style={{
                fontSize: isMobile ? 15.5 : 18,
                color: 'rgba(255,255,255,.72)',
                marginTop: 20, lineHeight: 1.6,
                maxWidth: 680,
              }}>
                Le <strong style={{ color: '#fff', fontWeight: 600 }}>tunnel d'acquisition complet</strong> pour le rachat automobile en Suisse — de la première impression Ads jusqu'au paiement. Site public, CRM dealer, dashboard financier, campagnes Meta + Google Ads, SEO, catalogue B2B. Sous un seul toit, livré en 4 semaines.
              </p>
            </div>
            {!isMobile && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
                {[
                  { l: 'Livraison', v: '4 semaines' },
                  { l: 'Scope', v: 'Build + Ads + CRM' },
                  { l: 'Marché', v: 'CH · FR + DE' },
                ].map((x) => (
                  <div key={x.l} style={{ textAlign: 'right' }}>
                    <div className="mono" style={{ fontSize: 10.5, color: 'rgba(196,181,253,.6)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>{x.l}</div>
                    <div style={{ fontSize: 15, color: '#fff', fontWeight: 500, marginTop: 4 }}>{x.v}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ───── Tunnel complet : 3 couches ───── */}
          <div style={{
            position: 'relative',
            padding: isMobile ? '8px 20px 16px' : '16px 48px 24px',
          }}>
            <div className="mono" style={{
              fontSize: 11,
              color: 'rgba(196,181,253,.7)',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              fontWeight: 500,
              marginBottom: isMobile ? 20 : 28,
            }}>
              Le tunnel, de bout en bout
            </div>

            <TunnelLayer
              step="01"
              label="Acquisition"
              title="Capter le lead, en FR comme en DE."
              body="Landing pages bilingues, funnel d'estimation 7 étapes optimisé mobile, Meta + Google Ads ciblés par région, SEO local. Tracking server-side (Meta CAPI + GA4) pour que chaque franc d'Ads soit attribué à une vente."
              url="tradeauto.ch"
              img="/tradeauto-landing.png"
              alt="TRADEAUTO — landing & funnel d'estimation"
              objectPosition="top"
              isMobile={isMobile}
            />

            <TunnelLayer
              step="02"
              label="Gestion"
              title="Qualifier, relancer, convertir."
              body="CRM dealer sur mesure — pipeline kanban (Nouveau → Contacté → RDV → Offre → Gagné), notes et activités, relances WhatsApp / email automatisées, export CSV. Les leads ne dorment plus dans une inbox."
              url="tradeauto.ch/crm"
              img="/tradeauto-crm.png"
              alt="TRADEAUTO — pipeline CRM dealer"
              objectPosition="center"
              objectFit="contain"
              isMobile={isMobile}
            />

            <TunnelLayer
              step="03"
              label="Pilotage"
              title="Voir chaque franc dépensé. Et ce qu'il rapporte."
              body="Dashboard financier live : volume de leads par jour, coût par lead, coût par lead gagné, taux de conversion, dépenses Meta Ads. Plus besoin de Looker Studio ou d'un export manuel — tout est dans le back-office."
              url="tradeauto.ch/analytics"
              img="/tradeauto-dashboard.png"
              alt="TRADEAUTO — dashboard financier"
              objectPosition="center"
              objectFit="contain"
              isMobile={isMobile}
              isLast={true}
            />
          </div>

          {/* Ce qui a été livré */}
          <div style={{
            position: 'relative',
            padding: isMobile ? '8px 20px 32px' : '8px 48px 40px',
          }}>
            <div style={{
              padding: isMobile ? '22px' : '28px 32px',
              borderRadius: 16,
              background: 'rgba(255,255,255,.04)',
              border: '1px solid rgba(255,255,255,.1)',
            }}>
              <div className="mono" style={{ fontSize: 11, color: 'rgba(196,181,253,.75)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                Ce qui a été livré
              </div>
              <ul style={{
                listStyle: 'none', padding: 0, margin: '18px 0 0',
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                gap: '10px 32px',
              }}>
                {[
                  'Site public Next.js (FR + DE) — funnel d\'estimation 7 étapes',
                  'Catalogue B2B — publication des véhicules aux concessionnaires',
                  'CRM dealer avec pipeline kanban drag & drop',
                  'Dashboard financier live (leads, ventes, coût par lead)',
                  'Campagnes Meta Ads · CH-FR + CH-DE',
                  'Campagnes Google Ads + SEO local',
                  'Tracking server-side (GA4 + Meta CAPI)',
                  'Automatisations WhatsApp + email (Resend)',
                ].map((x, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13.5, color: 'rgba(255,255,255,.85)', lineHeight: 1.5 }}>
                    <span style={{ flexShrink: 0, width: 14, height: 14, borderRadius: '50%', background: 'rgba(139,92,246,.25)', marginTop: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1.5 4.5 L3 6 L6.5 2" stroke="#C4B5FD" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </span>
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* KPIs bar */}
          <div style={{
            position: 'relative',
            padding: isMobile ? '24px 20px 28px' : '40px 48px 48px',
            borderTop: '1px solid rgba(255,255,255,.08)',
            background: 'rgba(255,255,255,.02)',
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: isMobile ? 20 : 32 }}>
              {[
                { n: '−64', suf: '%', l: 'CPL · de 27,40 CHF à 10 CHF en quelques semaines' },
                { n: '86', suf: '', l: 'Leads ultra qualifiés générés ce mois' },
                { n: '7', suf: '%', l: 'Taux de conversion lead → vente' },
                { n: '4', suf: ' sem', l: 'Du brief au tunnel complet en ligne' },
              ].map((x) => (
                <div key={x.l}>
                  <div style={{
                    fontSize: isMobile ? 40 : 56,
                    fontFamily: 'Geist Mono, monospace',
                    fontWeight: 600,
                    letterSpacing: '-0.03em',
                    lineHeight: 1,
                    background: 'linear-gradient(180deg, #fff 0%, #C4B5FD 100%)',
                    WebkitBackgroundClip: 'text', backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontFeatureSettings: '"tnum"',
                  }}>
                    {x.n}<span style={{
                      background: 'linear-gradient(180deg, #C4B5FD, #8B5CF6)',
                      WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    }}>{x.suf}</span>
                  </div>
                  <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,.6)', marginTop: 10, lineHeight: 1.45 }}>
                    {x.l}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* challenge / build / ads */}
          <div style={{
            position: 'relative',
            padding: isMobile ? '32px 20px' : '56px 48px',
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: isMobile ? 28 : 32,
            borderTop: '1px solid rgba(255,255,255,.08)',
          }}>
            {[
              { label: 'Le contexte', title: 'Un marché opaque', body: 'Le rachat automobile en Suisse est dominé par des plateformes B2B aux tarifs peu transparents. L\'objectif : une plateforme B2C qui capte le particulier, centralise les leads côté dealer, et redistribue les véhicules aux concessionnaires partenaires.' },
              { label: 'Build', title: 'Tunnel complet, 4 semaines', body: 'Site public + funnel d\'estimation 7 étapes, CRM dealer avec pipeline kanban, catalogue B2B, dashboard financier live. Stack Next.js + Supabase, tracking server-side, automatisations WhatsApp / email.' },
              { label: 'Ads', title: 'CPL divisé par 2,7', body: 'Meta Ads + Google Ads + SEO local, ciblage Suisse romande puis alémanique. Itérations creative hebdomadaires, restructuration CBO, tracking server-side Meta CAPI + GA4. Résultat : CPL passé de 27,40 CHF à 10 CHF en quelques semaines — et stabilisé.' },
            ].map((x, i) => (
              <div key={x.label} style={{ position: 'relative' }}>
                <div className="mono" style={{
                  fontSize: 11,
                  color: i === 0 ? 'rgba(255,255,255,.5)' : '#C4B5FD',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  fontWeight: 500,
                }}>
                  {x.label}
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 600, color: '#fff', marginTop: 12, letterSpacing: '-0.02em' }}>
                  {x.title}
                </h3>
                <p style={{ fontSize: 14.5, color: 'rgba(255,255,255,.7)', marginTop: 12, lineHeight: 1.6 }}>
                  {x.body}
                </p>
              </div>
            ))}
          </div>

          {/* stack & channels */}
          <div style={{
            position: 'relative',
            padding: isMobile ? '20px 20px 24px' : '0 48px 48px',
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
            gap: isMobile ? 20 : 32,
          }}>
            {[
              { title: 'Stack Build', items: ['Next.js', 'Supabase', 'Tailwind CSS', 'Vercel', 'GTM server-side', 'Resend'] },
              { title: 'Canaux & Acquisition', items: ['Meta Ads (FB + IG)', 'Google Ads', 'SEO local CH-FR + CH-DE', 'Meta CAPI', 'GA4 Enhanced Conv.', 'WhatsApp Business'] },
            ].map((g) => (
              <div key={g.title} style={{
                padding: '22px 22px 22px',
                borderRadius: 14,
                background: 'rgba(255,255,255,.04)',
                border: '1px solid rgba(255,255,255,.1)',
              }}>
                <div className="mono" style={{ fontSize: 10.5, color: 'rgba(196,181,253,.7)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                  {g.title}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 14 }}>
                  {g.items.map((it) => (
                    <span key={it} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '6px 11px', borderRadius: 999,
                      background: 'rgba(255,255,255,.06)',
                      border: '1px solid rgba(255,255,255,.1)',
                      fontSize: 12, color: 'rgba(255,255,255,.9)', fontWeight: 500,
                    }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#C4B5FD', boxShadow: '0 0 6px rgba(196,181,253,.6)' }}></span>
                      {it}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* live CTA */}
          <div style={{
            position: 'relative',
            padding: isMobile ? '8px 20px 32px' : '0 48px 56px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}>
            <div className="mono" style={{ fontSize: 12, color: 'rgba(255,255,255,.55)', letterSpacing: '0.1em' }}>
              Voir comment on l'a livré, en production.
            </div>
            <a href="https://www.tradeauto.ch" target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '14px 22px',
              borderRadius: 999,
              background: 'linear-gradient(180deg, #9B6FFB, #7C3AED)',
              color: '#fff',
              fontSize: 15, fontWeight: 500,
              boxShadow: '0 10px 30px -8px rgba(124,58,237,.55), inset 0 1px 0 rgba(255,255,255,.12)',
              transition: 'transform .2s, box-shadow .2s',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 16px 40px -8px rgba(124,58,237,.7), inset 0 1px 0 rgba(255,255,255,.12)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 10px 30px -8px rgba(124,58,237,.55), inset 0 1px 0 rgba(255,255,255,.12)'; }}
            >
              Ouvrir tradeauto.ch
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4 10 L10 4 M5 4 L10 4 L10 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════
// FEATURED — MADAME LA GOUVERNANTE
// ═════════════════════════════════════════════════════════════
function FeaturedMadameLaGouvernante({ isMobile }) {
  const pad = isMobile ? '0 16px 60px' : '0 60px 100px';

  return (
    <section style={{ padding: pad, background: 'var(--bg)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{
          position: 'relative',
          borderRadius: isMobile ? 20 : 28,
          overflow: 'hidden',
          background: 'linear-gradient(180deg, #0B0716 0%, #130726 50%, #080410 100%)',
          border: '1px solid rgba(245,158,11,.2)',
          boxShadow: '0 40px 120px -30px rgba(245,158,11,.22), 0 20px 60px -20px rgba(0,0,0,.5)',
        }}>
          {/* ambient glow — gold + violet */}
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 15% -10%, rgba(245,158,11,.22), transparent 55%), radial-gradient(ellipse at 85% 110%, rgba(139,92,246,.2), transparent 55%)', pointerEvents: 'none' }}></div>

          {/* header strip */}
          <div style={{
            position: 'relative',
            padding: isMobile ? '24px 20px 20px' : '36px 48px 28px',
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? 16 : 24,
            alignItems: isMobile ? 'flex-start' : 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255,255,255,.08)',
          }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 12px 6px 10px', borderRadius: 999,
              background: 'rgba(245,158,11,.14)',
              border: '1px solid rgba(245,158,11,.28)',
              fontFamily: 'Geist Mono, monospace',
              fontSize: 11, fontWeight: 500, color: '#FCD34D',
              letterSpacing: '0.14em', textTransform: 'uppercase',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FCD34D', boxShadow: '0 0 8px rgba(252,211,77,.7)' }}></span>
              Projet phare · Plateforme two-sided
            </span>
            <a href="https://www.madamelagouvernante.com" target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              color: '#fff', fontSize: 14, fontWeight: 500,
              padding: '10px 16px 10px 18px', borderRadius: 999,
              background: 'rgba(255,255,255,.06)',
              border: '1px solid rgba(255,255,255,.12)',
              transition: 'background .2s, border-color .2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,.12)'; e.currentTarget.style.borderColor = 'rgba(252,211,77,.4)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.12)'; }}
            >
              <span className="mono" style={{ fontSize: 12, color: 'rgba(252,211,77,.85)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Live</span>
              madamelagouvernante.com
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M4 10 L10 4 M5 4 L10 4 L10 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </a>
          </div>

          {/* title block */}
          <div style={{ position: 'relative', padding: isMobile ? '32px 20px 24px' : '56px 48px 32px', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr auto', gap: isMobile ? 20 : 40, alignItems: 'flex-end' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                <div style={{
                  width: isMobile ? 52 : 64, height: isMobile ? 52 : 64, borderRadius: 14,
                  background: '#0A0A0A',
                  border: '1px solid rgba(255,255,255,.08)',
                  padding: 6,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <img src="/madame-logo.png" alt="Madame La Gouvernante logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div>
                  <div className="mono" style={{ fontSize: 11, color: 'rgba(252,211,77,.75)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                    Cas d'étude · 02
                  </div>
                  <div className="mono" style={{ fontSize: 12, color: 'rgba(255,255,255,.55)', marginTop: 4, letterSpacing: '0.04em' }}>
                    Marketplace · Restauration · France
                  </div>
                </div>
              </div>
              <h2 style={{
                fontSize: isMobile ? 36 : 64,
                fontWeight: 600,
                letterSpacing: '-0.035em',
                lineHeight: 1,
                color: '#fff',
              }}>
                MADAME LA<br />
                <span style={{
                  background: 'linear-gradient(180deg, #FCD34D, #F59E0B 70%, #D97706)',
                  WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>GOUVERNANTE</span>
              </h2>
              <p style={{
                fontSize: isMobile ? 15.5 : 17.5,
                color: 'rgba(255,255,255,.72)',
                marginTop: 22, lineHeight: 1.6,
                maxWidth: 680,
              }}>
                <strong style={{ color: '#fff', fontWeight: 600 }}>Plateforme two-sided</strong> qui met en relation des <strong style={{ color: '#fff', fontWeight: 600 }}>auto-entrepreneurs</strong> (cuisiniers, serveurs, barmans, pâtissiers, sommeliers…) avec des <strong style={{ color: '#fff', fontWeight: 600 }}>établissements</strong> (restaurants, hôtels, traiteurs) pour des <strong style={{ color: '#fff', fontWeight: 600 }}>missions courtes et moyen terme</strong> en France. Un écosystème complet : onboarding réglementé, dispatch automatisé, <strong style={{ color: '#FCD34D', fontWeight: 600 }}>paiement intégré Stripe</strong> et <strong style={{ color: '#FCD34D', fontWeight: 600 }}>facturation automatisée</strong> (marge plateforme calculée à la volée, factures PDF générées, RIB validé à l'onboarding).
              </p>
            </div>
            {!isMobile && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
                {[
                  { l: 'Scope', v: 'Plateforme full-stack' },
                  { l: 'Rôles', v: '3 dashboards' },
                  { l: 'Marché', v: 'France · IDF' },
                ].map((x) => (
                  <div key={x.l} style={{ textAlign: 'right' }}>
                    <div className="mono" style={{ fontSize: 10.5, color: 'rgba(252,211,77,.65)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>{x.l}</div>
                    <div style={{ fontSize: 15, color: '#fff', fontWeight: 500, marginTop: 4 }}>{x.v}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Architecture + Ce qui est livré */}
          <div style={{
            position: 'relative',
            padding: isMobile ? '8px 20px 24px' : '16px 48px 40px',
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1.15fr 1fr',
            gap: isMobile ? 20 : 32,
          }}>
            {/* architecture visual */}
            <div style={{
              borderRadius: 16,
              background: 'linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.02))',
              border: '1px solid rgba(255,255,255,.1)',
              padding: isMobile ? '22px 18px' : '28px 26px',
              overflow: 'hidden',
              position: 'relative',
            }}>
              {/* subtle grid bg */}
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'linear-gradient(rgba(252,211,77,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(252,211,77,.04) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
                maskImage: 'radial-gradient(ellipse at center, #000 0%, transparent 75%)',
                WebkitMaskImage: 'radial-gradient(ellipse at center, #000 0%, transparent 75%)',
                pointerEvents: 'none',
              }}></div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
                <div className="mono" style={{ fontSize: 10.5, color: 'rgba(252,211,77,.75)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                  Architecture · vue d'ensemble
                </div>
                <div className="mono" style={{ fontSize: 10, color: 'rgba(255,255,255,.4)', letterSpacing: '0.14em' }}>
                  v1.0 · prod
                </div>
              </div>

              {/* ── Layer 1 : Users (3 roles) ── */}
              <div className="mono" style={{ fontSize: 9.5, color: 'rgba(255,255,255,.35)', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: 20, marginBottom: 8, position: 'relative' }}>
                · Users
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, position: 'relative' }}>
                {[
                  { role: 'FREELANCE', desc: 'Onboarding · candidature · calendrier', color: '#A78BFA', icon: 'M7 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-6 11a6 6 0 1 1 12 0v1H1v-1Z' },
                  { role: 'ENTERPRISE', desc: 'Missions · slots · reviews', color: '#FCD34D', icon: 'M2 2h10v12H2zM4 4v2h6V4zM4 7v2h6V7zM4 10v2h4v-2z' },
                  { role: 'ADMIN', desc: 'Validation · dispatch · stats', color: '#F472B6', icon: 'M7 1 2 3v4c0 3 2 5 5 6 3-1 5-3 5-6V3Zm0 3 1.5 3 3 .5-2 2 .5 3L7 10.5 4 12l.5-3-2-2 3-.5Z' },
                ].map((r) => (
                  <div key={r.role} style={{
                    padding: '12px 10px',
                    borderRadius: 10,
                    background: `linear-gradient(180deg, ${r.color}14, rgba(0,0,0,.35))`,
                    border: `1px solid ${r.color}35`,
                    textAlign: 'center',
                    position: 'relative',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill={r.color} style={{ opacity: .9 }}>
                        <path d={r.icon} />
                      </svg>
                    </div>
                    <div className="mono" style={{ fontSize: 10, color: r.color, letterSpacing: '0.14em', fontWeight: 600 }}>
                      {r.role}
                    </div>
                    <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,.55)', marginTop: 4, lineHeight: 1.4 }}>
                      {r.desc}
                    </div>
                  </div>
                ))}
              </div>

              {/* flow arrows down */}
              <svg width="100%" height="22" viewBox="0 0 300 22" preserveAspectRatio="none" style={{ display: 'block', margin: '6px 0', position: 'relative' }}>
                <defs>
                  <linearGradient id="flowGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(252,211,77,0)" />
                    <stop offset="100%" stopColor="rgba(252,211,77,.45)" />
                  </linearGradient>
                </defs>
                <path d="M50 0 L50 14 M150 0 L150 18 M250 0 L250 14" stroke="url(#flowGrad)" strokeWidth="1" strokeDasharray="3 3" />
                <path d="M50 16 l-2 -4 l4 0 z" fill="rgba(252,211,77,.5)" />
                <path d="M150 20 l-2.5 -5 l5 0 z" fill="rgba(252,211,77,.6)" />
                <path d="M250 16 l-2 -4 l4 0 z" fill="rgba(252,211,77,.5)" />
              </svg>

              {/* ── Layer 2 : Core pipeline — 5 subsystems ── */}
              <div className="mono" style={{ fontSize: 9.5, color: 'rgba(255,255,255,.35)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8, position: 'relative' }}>
                · Pipeline · Next.js 16 + Prisma · 26+ endpoints
              </div>
              <div style={{
                padding: '14px 12px',
                borderRadius: 12,
                background: 'linear-gradient(180deg, rgba(245,158,11,.1), rgba(139,92,246,.08))',
                border: '1px solid rgba(252,211,77,.3)',
                position: 'relative',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,.05), 0 10px 28px -14px rgba(245,158,11,.35)',
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(5, 1fr)',
                  gap: 4,
                  alignItems: 'center',
                }}>
                  {[
                    { t: 'Auth', d: 'NextAuth v5', icon: 'M4 6V4a3 3 0 1 1 6 0v2m-7 0h8v7H3z' },
                    { t: 'Matching', d: 'Géo · spé · indispos', icon: 'M7 1a4 4 0 0 0-4 4c0 3 4 7 4 7s4-4 4-7a4 4 0 0 0-4-4Zm0 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z', highlight: true },
                    { t: 'Dispatch', d: 'WhatsApp + email', icon: 'M1 2h12v9H8l-3 2v-2H1z' },
                    { t: 'Paiement', d: 'Stripe · facturation', icon: 'M1 3h12v8H1zm0 3h12M3 9h3', highlight: true },
                    { t: 'Reviews', d: 'Ratings croisés', icon: 'M7 1 9 5l4 .5-3 3 1 4-4-2-4 2 1-4-3-3L5 5Z' },
                  ].map((s, i, arr) => (
                    <React.Fragment key={s.t}>
                      <div style={{
                        textAlign: 'center',
                        padding: '10px 6px',
                        borderRadius: 8,
                        background: s.highlight ? 'linear-gradient(180deg, #FCD34D22, #D9770622)' : 'rgba(0,0,0,.25)',
                        border: s.highlight ? '1px solid rgba(252,211,77,.5)' : '1px solid rgba(255,255,255,.06)',
                        boxShadow: s.highlight ? '0 0 18px rgba(252,211,77,.2)' : 'none',
                        position: 'relative',
                      }}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill={s.highlight ? '#FCD34D' : 'rgba(255,255,255,.7)'} style={{ marginBottom: 4 }}>
                          <path d={s.icon} stroke={s.highlight ? '#FCD34D' : 'rgba(255,255,255,.7)'} strokeWidth={s.t === 'Paiement' || s.t === 'Matching' ? 1 : 0} />
                        </svg>
                        <div className="mono" style={{ fontSize: 10, fontWeight: 600, color: s.highlight ? '#FCD34D' : '#fff', letterSpacing: '0.06em' }}>
                          {s.t}
                        </div>
                        <div className="mono" style={{ fontSize: 8.5, color: 'rgba(255,255,255,.45)', marginTop: 3, letterSpacing: '0.04em' }}>
                          {s.d}
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                </div>

                {/* flowing arrows between subsystems (overlay) */}
                <svg width="100%" height="4" viewBox="0 0 100 4" preserveAspectRatio="none" style={{ position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)', pointerEvents: 'none', opacity: .35 }}>
                  <path d="M0 2 L100 2" stroke="rgba(252,211,77,.6)" strokeWidth=".3" strokeDasharray="1 1" />
                </svg>
              </div>

              {/* flow arrow down */}
              <svg width="100%" height="16" viewBox="0 0 300 16" preserveAspectRatio="none" style={{ display: 'block', margin: '4px 0', position: 'relative' }}>
                <path d="M150 0 L150 12" stroke="rgba(252,211,77,.4)" strokeWidth="1" strokeDasharray="2 2" />
                <path d="M150 14 l-2.5 -5 l5 0 z" fill="rgba(252,211,77,.55)" />
              </svg>

              {/* ── Layer 3 : Services ── */}
              <div className="mono" style={{ fontSize: 9.5, color: 'rgba(255,255,255,.35)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8, position: 'relative' }}>
                · Services &amp; infra
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, position: 'relative' }}>
                {[
                  { n: 'Supabase', t: 'DB', c: '#3ECF8E' },
                  { n: 'Stripe', t: 'Payments', c: '#635BFF', highlight: true },
                  { n: 'Cloudinary', t: 'Files', c: '#3448C5' },
                  { n: 'Resend', t: 'Email', c: '#fff' },
                  { n: 'Twilio', t: 'WhatsApp', c: '#F22F46' },
                  { n: 'NextAuth', t: 'Auth', c: '#fff' },
                  { n: 'Vercel', t: 'Infra', c: '#fff' },
                ].map((s) => (
                  <span key={s.n} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '5px 10px', borderRadius: 999,
                    background: s.highlight ? 'rgba(99,91,255,.12)' : 'rgba(255,255,255,.05)',
                    border: s.highlight ? '1px solid rgba(99,91,255,.4)' : '1px solid rgba(255,255,255,.1)',
                    fontSize: 11, color: 'rgba(255,255,255,.9)', fontWeight: 500,
                  }}>
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: s.c, boxShadow: s.highlight ? `0 0 6px ${s.c}` : 'none' }}></span>
                    {s.n}
                    <span className="mono" style={{ fontSize: 9.5, color: 'rgba(255,255,255,.4)', letterSpacing: '0.08em' }}>{s.t}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Ce qui est livré */}
            <div style={{
              padding: isMobile ? '22px' : '28px 28px',
              borderRadius: 16,
              background: 'rgba(255,255,255,.04)',
              border: '1px solid rgba(255,255,255,.1)',
            }}>
              <div className="mono" style={{ fontSize: 10.5, color: 'rgba(252,211,77,.75)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                Ce qui a été livré
              </div>
              <ul style={{
                listStyle: 'none', padding: 0, margin: '16px 0 0',
                display: 'flex', flexDirection: 'column', gap: 9,
              }}>
                {[
                  { t: '3 dashboards spécialisés (freelance, entreprise, admin)' },
                  { t: 'Onboarding freelance réglementé (SIRET, RIB, pièce d\'identité, références)' },
                  { t: 'Matching intelligent — géolocalisation + spécialité + indispos + rating', hl: true },
                  { t: 'Paiement intégré Stripe · facturation automatisée', hl: true },
                  { t: 'Marge plateforme calculée à la volée (taux entreprise vs reversé freelance)', hl: true },
                  { t: 'Factures PDF générées automatiquement · envoi Resend', hl: true },
                  { t: 'Dispatch WhatsApp Twilio + tokens signés pour réponse one-click' },
                  { t: 'Calendrier d\'indisponibilités + slots multiples par mission' },
                  { t: 'State machine mission (6 états) + ratings croisés' },
                  { t: 'Emails transactionnels (5 templates) + SEO (9 pages, sitemap)' },
                ].map((x, i) => (
                  <li key={i} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 10,
                    fontSize: 13,
                    color: x.hl ? '#fff' : 'rgba(255,255,255,.8)',
                    fontWeight: x.hl ? 500 : 400,
                    lineHeight: 1.5,
                  }}>
                    <span style={{
                      flexShrink: 0, width: 14, height: 14, borderRadius: '50%',
                      background: x.hl ? 'rgba(252,211,77,.4)' : 'rgba(245,158,11,.22)',
                      boxShadow: x.hl ? '0 0 8px rgba(252,211,77,.45)' : 'none',
                      marginTop: 3, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1.5 4.5 L3 6 L6.5 2" stroke="#FCD34D" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </span>
                    {x.t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* technical KPIs bar */}
          <div style={{
            position: 'relative',
            padding: isMobile ? '24px 20px 28px' : '40px 48px 48px',
            borderTop: '1px solid rgba(255,255,255,.08)',
            background: 'rgba(255,255,255,.02)',
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: isMobile ? 20 : 32 }}>
              {[
                { n: '26', suf: '+', l: 'Endpoints API REST' },
                { n: '150', suf: '+', l: 'Missions réalisées chaque semaine en production' },
                { n: '14', suf: '', l: 'Spécialités métiers supportées' },
                { n: '3', suf: '', l: 'Dashboards distincts · FREELANCE / ENTERPRISE / ADMIN' },
              ].map((x) => (
                <div key={x.l}>
                  <div style={{
                    fontSize: isMobile ? 40 : 56,
                    fontFamily: 'Geist Mono, monospace',
                    fontWeight: 600,
                    letterSpacing: '-0.03em',
                    lineHeight: 1,
                    background: 'linear-gradient(180deg, #fff 0%, #FCD34D 100%)',
                    WebkitBackgroundClip: 'text', backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontFeatureSettings: '"tnum"',
                  }}>
                    {x.n}<span style={{
                      background: 'linear-gradient(180deg, #FCD34D, #D97706)',
                      WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    }}>{x.suf}</span>
                  </div>
                  <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,.6)', marginTop: 10, lineHeight: 1.45 }}>
                    {x.l}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ADMIN SPOTLIGHT — end-to-end control */}
          <div style={{
            position: 'relative',
            padding: isMobile ? '24px 20px 8px' : '40px 48px 8px',
          }}>
            <div style={{
              borderRadius: 16,
              overflow: 'hidden',
              background: 'linear-gradient(135deg, rgba(244,114,182,.08), rgba(139,92,246,.06) 50%, rgba(245,158,11,.08))',
              border: '1px solid rgba(244,114,182,.22)',
              padding: isMobile ? '22px 20px' : '32px 36px',
              position: 'relative',
            }}>
              {/* side decoration */}
              <div style={{
                position: 'absolute',
                top: 0, bottom: 0, left: 0,
                width: 3,
                background: 'linear-gradient(180deg, #F472B6, #FCD34D)',
                boxShadow: '0 0 20px rgba(244,114,182,.4)',
              }}></div>

              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.1fr 2fr', gap: isMobile ? 20 : 40, alignItems: 'center' }}>
                <div>
                  <div className="mono" style={{ fontSize: 11, color: '#F472B6', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 500 }}>
                    Dashboard admin · Control tower
                  </div>
                  <h3 style={{ fontSize: isMobile ? 22 : 26, fontWeight: 600, color: '#fff', marginTop: 12, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                    Gestion complète, <span style={{
                      background: 'linear-gradient(90deg, #F472B6, #FCD34D)',
                      WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    }}>de la mission à la facture</span>.
                  </h3>
                  <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,.7)', marginTop: 12, lineHeight: 1.6 }}>
                    Un seul back-office pour tout orchestrer : publier une mission, piloter le matching, suivre les statuts en temps réel, éditer et encaisser les factures.
                  </p>
                </div>

                {/* end-to-end journey */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(6, 1fr)',
                  gap: isMobile ? 6 : 4,
                  alignItems: 'stretch',
                  position: 'relative',
                }}>
                  {[
                    { s: '01', t: 'Créer', d: 'Mission · slots · taux' },
                    { s: '02', t: 'Matcher', d: 'Pool filtré intelligent' },
                    { s: '03', t: 'Dispatcher', d: 'WhatsApp + email' },
                    { s: '04', t: 'Suivre', d: 'Kanban statuts live' },
                    { s: '05', t: 'Valider', d: 'Prestation + reviews' },
                    { s: '06', t: 'Facturer', d: 'PDF + Stripe · payé', highlight: true },
                  ].map((stp, i, arr) => (
                    <div key={stp.s} style={{
                      position: 'relative',
                      padding: '12px 8px',
                      borderRadius: 10,
                      background: stp.highlight ? 'linear-gradient(180deg, rgba(252,211,77,.18), rgba(217,119,6,.1))' : 'rgba(0,0,0,.22)',
                      border: stp.highlight ? '1px solid rgba(252,211,77,.55)' : '1px solid rgba(255,255,255,.08)',
                      boxShadow: stp.highlight ? '0 0 18px rgba(252,211,77,.22)' : 'none',
                      textAlign: 'center',
                    }}>
                      <div className="mono" style={{
                        fontSize: 10, fontWeight: 600,
                        color: stp.highlight ? '#FCD34D' : 'rgba(244,114,182,.85)',
                        letterSpacing: '0.12em',
                      }}>{stp.s}</div>
                      <div style={{
                        fontSize: 12.5, fontWeight: 600,
                        color: '#fff',
                        marginTop: 4, letterSpacing: '-0.01em',
                      }}>{stp.t}</div>
                      <div className="mono" style={{
                        fontSize: 9, color: 'rgba(255,255,255,.45)',
                        marginTop: 3, letterSpacing: '0.04em',
                        lineHeight: 1.3,
                      }}>{stp.d}</div>

                      {/* arrow to next step (hidden on last; hidden on wrapped rows on mobile) */}
                      {!isMobile && i < arr.length - 1 && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none" style={{
                          position: 'absolute',
                          right: -7, top: '50%', transform: 'translateY(-50%)',
                          opacity: .5,
                        }}>
                          <path d="M1 4 L8 4 M5 1 L8 4 L5 7" stroke="rgba(244,114,182,.85)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Admin dashboard — live screenshot */}
          <div style={{
            position: 'relative',
            padding: isMobile ? '16px 20px 24px' : '24px 48px 40px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
              <div className="mono" style={{ fontSize: 10.5, color: 'rgba(252,211,77,.75)', letterSpacing: '0.22em', textTransform: 'uppercase' }}>
                Le back-office admin, en production
              </div>
              <div className="mono" style={{ fontSize: 10, color: 'rgba(255,255,255,.4)', letterSpacing: '0.14em' }}>
                Pilotage missions · freelances · factures
              </div>
            </div>

            <div style={{
              borderRadius: 14,
              overflow: 'hidden',
              background: '#fff',
              border: '1px solid rgba(252,211,77,.2)',
              boxShadow: '0 30px 80px -20px rgba(245,158,11,.32), 0 10px 30px -10px rgba(0,0,0,.45)',
            }}>
              {/* browser chrome */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 14px',
                background: '#FFFBEB',
                borderBottom: '1px solid #FDE68A',
              }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#F87171' }}></span>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#FBBF24' }}></span>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#34D399' }}></span>
                <span className="mono" style={{ flex: 1, textAlign: 'center', fontSize: 11, color: '#6B7280' }}>
                  madamelagouvernante.com/admin
                </span>
                <span className="mono" style={{ fontSize: 10.5, color: '#D97706', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600 }}>
                  Live
                </span>
              </div>

              {/* screenshot */}
              <div style={{ background: '#FAFAFA', overflow: 'hidden' }}>
                <img
                  src="/madamelagouv.png"
                  alt="Madame La Gouvernante — back-office admin"
                  style={{ display: 'block', width: '100%', height: 'auto' }}
                />
              </div>
            </div>
          </div>

          {/* challenge / build / automations */}
          <div style={{
            position: 'relative',
            padding: isMobile ? '32px 20px' : '56px 48px',
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: isMobile ? 28 : 32,
            borderTop: '1px solid rgba(255,255,255,.08)',
          }}>
            {[
              { label: 'Le contexte', title: 'Un marché fragmenté', body: 'Les extras de la restauration sont gérés au fil de l\'eau : groupes WhatsApp, tableurs, appels. Aucune plateforme ne couvre l\'ensemble du cycle (candidature, validation admin, dispatch, reviews, paiement) tout en respectant les contraintes réglementaires du statut auto-entrepreneur.' },
              { label: 'Build', title: 'Plateforme full-stack', body: 'Next.js 16 App Router + Prisma v7 + Supabase. 11 modèles relationnels (User, Profile, Mission, Application, Assignment, Offer, Review, Unavailability, Upload, tokens…). Auth NextAuth v5, uploads signés Cloudinary, tracking serveur. 3 dashboards, 1 back-office admin.' },
              { label: 'Automatisations', title: 'Matching intelligent + paiement', body: 'Matching multi-critères (spécialité × géoloc/rayon × indispos × rating) qui fait remonter les meilleurs profils, puis dispatch WhatsApp + email avec tokens signés pour réponse 1-clic. Paiement Stripe intégré, facturation automatisée avec marge plateforme, PDF générés à la complétion — fin du WhatsApp qui perd des leads et de la facture Excel.' },
            ].map((x, i) => (
              <div key={x.label} style={{ position: 'relative' }}>
                <div className="mono" style={{
                  fontSize: 11,
                  color: i === 0 ? 'rgba(255,255,255,.5)' : (i === 2 ? '#FCD34D' : '#C4B5FD'),
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  fontWeight: 500,
                }}>
                  {x.label}
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 600, color: '#fff', marginTop: 12, letterSpacing: '-0.02em' }}>
                  {x.title}
                </h3>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,.7)', marginTop: 12, lineHeight: 1.6 }}>
                  {x.body}
                </p>
              </div>
            ))}
          </div>

          {/* automations showcase — 6 flows */}
          <div style={{
            position: 'relative',
            padding: isMobile ? '8px 20px 24px' : '0 48px 32px',
          }}>
            <div className="mono" style={{ fontSize: 10.5, color: 'rgba(252,211,77,.7)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 16 }}>
              Flows automatisés
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
              gap: 10,
            }}>
              {[
                { t: 'Matching intelligent', d: 'Score multi-critères : spécialité + géoloc/rayon + dispo + rating — les top profils remontent en tête', hl: true },
                { t: 'Dispatch multi-canal', d: 'Top matchs notifiés via WhatsApp Twilio + email · tokens signés pour répondre en 1 clic', hl: true },
                { t: 'Paiement Stripe intégré', d: 'L\'entreprise paie la plateforme, qui reverse au freelance après prestation — marge auto', hl: true },
                { t: 'Facturation automatisée', d: 'Factures PDF générées dès mission complétée · envoi Resend · archivage', hl: true },
                { t: 'Indispos → Filtre auto', d: 'Calendrier freelance exclu en temps réel du matching, slots multiples' },
                { t: 'Validation admin KYC', d: 'Onboarding multi-étapes · SIRET / RIB / pièce d\'identité vérifiés avant accès' },
              ].map((a, i) => (
                <div key={i} style={{
                  padding: '14px 16px',
                  borderRadius: 10,
                  background: a.hl ? 'rgba(245,158,11,.07)' : 'rgba(255,255,255,.03)',
                  border: a.hl ? '1px solid rgba(252,211,77,.28)' : '1px solid rgba(255,255,255,.08)',
                  transition: 'border-color .2s, background .2s, transform .2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(252,211,77,.45)'; e.currentTarget.style.background = 'rgba(245,158,11,.1)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = a.hl ? 'rgba(252,211,77,.28)' : 'rgba(255,255,255,.08)'; e.currentTarget.style.background = a.hl ? 'rgba(245,158,11,.07)' : 'rgba(255,255,255,.03)'; e.currentTarget.style.transform = ''; }}
                >
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: 8 }}>
                    {a.hl && <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#FCD34D', boxShadow: '0 0 6px rgba(252,211,77,.7)' }}></span>}
                    {a.t}
                  </div>
                  <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,.6)', marginTop: 5, lineHeight: 1.5 }}>
                    {a.d}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* stack */}
          <div style={{
            position: 'relative',
            padding: isMobile ? '20px 20px 24px' : '8px 48px 48px',
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
            gap: isMobile ? 16 : 24,
          }}>
            {[
              { title: 'Stack Build', items: ['Next.js 16 (App Router)', 'TypeScript', 'Tailwind CSS v4', 'Prisma v7', 'PostgreSQL · Supabase', 'NextAuth v5'] },
              { title: 'Services & Intégrations', items: ['Stripe · paiement + facturation', 'Cloudinary · uploads signés', 'Resend · email transactionnel', 'Twilio · WhatsApp Business', 'Vercel · deploy + ISR', 'Nodemailer SMTP'] },
            ].map((g) => (
              <div key={g.title} style={{
                padding: '22px 22px',
                borderRadius: 14,
                background: 'rgba(255,255,255,.04)',
                border: '1px solid rgba(255,255,255,.1)',
              }}>
                <div className="mono" style={{ fontSize: 10.5, color: 'rgba(252,211,77,.7)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                  {g.title}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 14 }}>
                  {g.items.map((it) => (
                    <span key={it} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '6px 11px', borderRadius: 999,
                      background: 'rgba(255,255,255,.06)',
                      border: '1px solid rgba(255,255,255,.1)',
                      fontSize: 12, color: 'rgba(255,255,255,.9)', fontWeight: 500,
                    }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#FCD34D', boxShadow: '0 0 6px rgba(252,211,77,.6)' }}></span>
                      {it}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* live CTA */}
          <div style={{
            position: 'relative',
            padding: isMobile ? '8px 20px 32px' : '0 48px 56px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}>
            <div className="mono" style={{ fontSize: 12, color: 'rgba(255,255,255,.55)', letterSpacing: '0.1em' }}>
              L'écosystème complet, en production.
            </div>
            <a href="https://www.madamelagouvernante.com" target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '14px 22px',
              borderRadius: 999,
              background: 'linear-gradient(180deg, #FCD34D, #D97706)',
              color: '#1A0B00',
              fontSize: 15, fontWeight: 600,
              boxShadow: '0 10px 30px -8px rgba(245,158,11,.6), inset 0 1px 0 rgba(255,255,255,.3)',
              transition: 'transform .2s, box-shadow .2s',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 16px 40px -8px rgba(245,158,11,.75), inset 0 1px 0 rgba(255,255,255,.35)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 10px 30px -8px rgba(245,158,11,.6), inset 0 1px 0 rgba(255,255,255,.3)'; }}
            >
              Ouvrir madamelagouvernante.com
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4 10 L10 4 M5 4 L10 4 L10 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════
// FEATURED — RÉNOVIA
// ═════════════════════════════════════════════════════════════
function FeaturedRenovia({ isMobile }) {
  const pad = isMobile ? '0 16px 60px' : '0 60px 100px';

  return (
    <section style={{ padding: pad, background: 'var(--bg)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{
          position: 'relative',
          borderRadius: isMobile ? 20 : 28,
          overflow: 'hidden',
          background: 'linear-gradient(180deg, #061814 0%, #0B2A20 50%, #061510 100%)',
          border: '1px solid rgba(34,197,94,.22)',
          boxShadow: '0 40px 120px -30px rgba(34,197,94,.22), 0 20px 60px -20px rgba(0,0,0,.5)',
        }}>
          {/* ambient glow — green + gold */}
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 85% -10%, rgba(34,197,94,.18), transparent 55%), radial-gradient(ellipse at 15% 110%, rgba(201,163,90,.15), transparent 55%)', pointerEvents: 'none' }}></div>

          {/* header strip */}
          <div style={{
            position: 'relative',
            padding: isMobile ? '24px 20px 20px' : '36px 48px 28px',
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? 16 : 24,
            alignItems: isMobile ? 'flex-start' : 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255,255,255,.08)',
          }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 12px 6px 10px', borderRadius: 999,
              background: 'rgba(34,197,94,.14)',
              border: '1px solid rgba(34,197,94,.3)',
              fontFamily: 'Geist Mono, monospace',
              fontSize: 11, fontWeight: 500, color: '#4ADE80',
              letterSpacing: '0.14em', textTransform: 'uppercase',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ADE80', boxShadow: '0 0 8px rgba(74,222,128,.7)' }}></span>
              Cas d'étude · Refonte CRO
            </span>
            <a href="https://renovia.fr" target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              color: '#fff', fontSize: 14, fontWeight: 500,
              padding: '10px 16px 10px 18px', borderRadius: 999,
              background: 'rgba(255,255,255,.06)',
              border: '1px solid rgba(255,255,255,.12)',
              transition: 'background .2s, border-color .2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,.12)'; e.currentTarget.style.borderColor = 'rgba(74,222,128,.4)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.12)'; }}
            >
              <span className="mono" style={{ fontSize: 12, color: 'rgba(74,222,128,.85)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Live</span>
              renovia.fr
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M4 10 L10 4 M5 4 L10 4 L10 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </a>
          </div>

          {/* title block */}
          <div style={{ position: 'relative', padding: isMobile ? '32px 20px 24px' : '56px 48px 32px', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr auto', gap: isMobile ? 20 : 40, alignItems: 'flex-end' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                <div style={{
                  width: isMobile ? 52 : 64, height: isMobile ? 52 : 64, borderRadius: 14,
                  background: 'linear-gradient(135deg, #046B4F, #024332)',
                  border: '1px solid rgba(74,222,128,.35)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 10px 24px -6px rgba(34,197,94,.4), inset 0 1px 0 rgba(255,255,255,.12)',
                }}>
                  <svg width={isMobile ? 26 : 32} height={isMobile ? 26 : 32} viewBox="0 0 32 32" fill="none">
                    <path d="M16 4 L26 10 L26 22 L16 28 L6 22 L6 10 Z" stroke="#C9A35A" strokeWidth="1.6" strokeLinejoin="round" />
                    <path d="M16 12 L16 22 M12 16 L20 16 M16 8 C18 10 18 12 16 12" stroke="#4ADE80" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <div className="mono" style={{ fontSize: 11, color: 'rgba(74,222,128,.75)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                    Cas d'étude · 03
                  </div>
                  <div className="mono" style={{ fontSize: 12, color: 'rgba(255,255,255,.55)', marginTop: 4, letterSpacing: '0.04em' }}>
                    Rénovation énergétique · France · Lead-gen
                  </div>
                </div>
              </div>
              <h2 style={{
                fontSize: isMobile ? 44 : 80,
                fontWeight: 600,
                letterSpacing: '-0.04em',
                lineHeight: 0.98,
                color: '#fff',
              }}>
                RÉNO<span style={{
                  background: 'linear-gradient(180deg, #4ADE80, #22C55E 60%, #059669)',
                  WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>VIA</span>
              </h2>
              <p style={{
                fontSize: isMobile ? 15.5 : 17.5,
                color: 'rgba(255,255,255,.72)',
                marginTop: 22, lineHeight: 1.6,
                maxWidth: 680,
              }}>
                Plateforme de simulation d'aides pour la rénovation énergétique (MaPrimeRénov', CEE, Éco-PTZ). Le client arrivait avec une landing qui convertissait à <strong style={{ color: '#fff', fontWeight: 600 }}>12%</strong> avec un CPL à <strong style={{ color: '#fff', fontWeight: 600 }}>24 €</strong> — basique : nom, prénom, téléphone. On a <strong style={{ color: '#4ADE80', fontWeight: 600 }}>repensé toute l'architecture du système</strong> pour des leads <strong style={{ color: '#4ADE80', fontWeight: 600 }}>ultra-qualifiés et intentionnistes</strong>, avec un dossier complet livré au RGE partenaire.
              </p>
            </div>
            {!isMobile && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
                {[
                  { l: 'Avant', v: '12% · 24 €', muted: true },
                  { l: 'Après', v: '31% · 13 €' },
                  { l: 'Delta', v: '+158% · −46%' },
                ].map((x) => (
                  <div key={x.l} style={{ textAlign: 'right' }}>
                    <div className="mono" style={{ fontSize: 10.5, color: x.muted ? 'rgba(255,255,255,.35)' : 'rgba(74,222,128,.7)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>{x.l}</div>
                    <div style={{ fontSize: 15, color: x.muted ? 'rgba(255,255,255,.5)' : '#fff', fontWeight: 500, marginTop: 4, textDecoration: x.muted ? 'line-through' : 'none' }}>{x.v}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ─── BEFORE / AFTER CENTERPIECE ─── */}
          <div style={{
            position: 'relative',
            padding: isMobile ? '8px 20px 24px' : '16px 48px 40px',
          }}>
            <div className="mono" style={{ fontSize: 10.5, color: 'rgba(74,222,128,.75)', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 20 }}>
              La transformation, en un coup d'œil
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr auto 1fr',
              gap: isMobile ? 16 : 20,
              alignItems: 'stretch',
            }}>
              {/* BEFORE */}
              <div style={{
                padding: isMobile ? '22px 20px' : '28px 28px',
                borderRadius: 16,
                background: 'rgba(255,255,255,.02)',
                border: '1px dashed rgba(255,255,255,.15)',
                position: 'relative',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                  <span className="mono" style={{
                    fontSize: 10.5, padding: '4px 10px', borderRadius: 999,
                    background: 'rgba(255,255,255,.05)', color: 'rgba(255,255,255,.55)',
                    border: '1px solid rgba(255,255,255,.1)',
                    letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 500,
                  }}>AVANT · Landing V1</span>
                  <span className="mono" style={{ fontSize: 10, color: 'rgba(255,255,255,.4)' }}>2025</span>
                </div>

                <h3 style={{ fontSize: 18, fontWeight: 600, color: 'rgba(255,255,255,.85)', marginTop: 16, letterSpacing: '-0.015em' }}>
                  Formulaire nom / prénom / numéro.
                </h3>
                <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,.5)', marginTop: 8, lineHeight: 1.55 }}>
                  Pas de qualification. Pas de contexte. Le RGE reçoit 3 champs et rappelle à froid.
                </p>

                {/* mini form preview */}
                <div style={{ marginTop: 18, padding: '14px', borderRadius: 10, background: 'rgba(0,0,0,.25)', border: '1px solid rgba(255,255,255,.06)' }}>
                  {['Prénom', 'Nom', 'Téléphone'].map((f, i) => (
                    <div key={i} style={{
                      fontSize: 11, fontFamily: 'Geist Mono, monospace',
                      padding: '8px 10px', marginTop: i === 0 ? 0 : 6,
                      borderRadius: 6,
                      background: 'rgba(255,255,255,.03)',
                      border: '1px solid rgba(255,255,255,.08)',
                      color: 'rgba(255,255,255,.35)',
                      letterSpacing: '0.02em',
                    }}>
                      {f}_
                    </div>
                  ))}
                  <div style={{
                    marginTop: 8, padding: '8px 10px', borderRadius: 6,
                    background: 'rgba(255,255,255,.08)',
                    textAlign: 'center', fontSize: 11, fontWeight: 600,
                    color: 'rgba(255,255,255,.5)',
                  }}>
                    Envoyer
                  </div>
                </div>

                {/* metrics */}
                <div style={{ display: 'flex', gap: 16, marginTop: 18 }}>
                  {[
                    { n: '12', u: '%', l: 'Conversion' },
                    { n: '24', u: '€', l: 'CPL' },
                    { n: '3', u: '', l: 'Champs' },
                  ].map((m) => (
                    <div key={m.l} style={{ flex: 1 }}>
                      <div className="mono" style={{
                        fontSize: 22, fontWeight: 600,
                        color: 'rgba(255,255,255,.5)',
                        letterSpacing: '-0.02em',
                        fontFeatureSettings: '"tnum"',
                      }}>
                        {m.n}<span style={{ fontSize: 13, marginLeft: 1, color: 'rgba(255,255,255,.35)' }}>{m.u}</span>
                      </div>
                      <div className="mono" style={{ fontSize: 10, color: 'rgba(255,255,255,.35)', letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 2 }}>
                        {m.l}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ARROW (desktop) */}
              {!isMobile && (
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexDirection: 'column',
                  gap: 8,
                  minWidth: 80,
                }}>
                  <div style={{
                    padding: '6px 12px', borderRadius: 999,
                    background: 'rgba(34,197,94,.15)',
                    border: '1px solid rgba(74,222,128,.4)',
                    fontFamily: 'Geist Mono, monospace',
                    fontSize: 10.5, fontWeight: 600,
                    color: '#4ADE80',
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                  }}>Refonte</div>
                  <svg width="56" height="20" viewBox="0 0 56 20" fill="none">
                    <defs>
                      <linearGradient id="renoviaArrowGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="rgba(74,222,128,0)" />
                        <stop offset="100%" stopColor="rgba(74,222,128,1)" />
                      </linearGradient>
                    </defs>
                    <path d="M0 10 L46 10" stroke="url(#renoviaArrowGrad)" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M44 4 L52 10 L44 16" stroke="#4ADE80" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                </div>
              )}
              {isMobile && (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <svg width="20" height="28" viewBox="0 0 20 28" fill="none">
                    <path d="M10 2 L10 22" stroke="#4ADE80" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M4 18 L10 26 L16 18" stroke="#4ADE80" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                </div>
              )}

              {/* AFTER */}
              <div style={{
                padding: isMobile ? '22px 20px' : '28px 28px',
                borderRadius: 16,
                background: 'linear-gradient(180deg, rgba(34,197,94,.08), rgba(4,107,79,.04))',
                border: '1px solid rgba(74,222,128,.32)',
                position: 'relative',
                boxShadow: '0 0 40px -10px rgba(34,197,94,.35)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                  <span className="mono" style={{
                    fontSize: 10.5, padding: '4px 10px', borderRadius: 999,
                    background: 'rgba(34,197,94,.2)', color: '#4ADE80',
                    border: '1px solid rgba(74,222,128,.35)',
                    letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 600,
                  }}>APRÈS · Landing V2 · Kairn</span>
                  <span className="mono" style={{ fontSize: 10, color: 'rgba(74,222,128,.7)' }}>2026</span>
                </div>

                <h3 style={{ fontSize: 18, fontWeight: 600, color: '#fff', marginTop: 16, letterSpacing: '-0.015em' }}>
                  Funnel de qualification en 5 étapes.
                </h3>
                <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,.72)', marginTop: 8, lineHeight: 1.55 }}>
                  Adresse → DPE live ADEME → éligibilité ANAH → aides chiffrées → coordonnées. Le RGE reçoit un dossier complet.
                </p>

                {/* funnel preview — 5 steps */}
                <div style={{ marginTop: 18, padding: '14px', borderRadius: 10, background: 'rgba(0,0,0,.3)', border: '1px solid rgba(74,222,128,.15)' }}>
                  {[
                    { t: 'Adresse', d: 'Autocomplete BAN' },
                    { t: 'DPE live', d: 'Base ADEME · 15M records' },
                    { t: 'Éligibilité', d: 'Profil ANAH en temps réel' },
                    { t: 'Aides chiffrées', d: '3 scénarios · MPR + CEE + PTZ' },
                    { t: 'Coordonnées', d: 'Lead chaud · dossier complet' },
                  ].map((s, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '7px 10px', marginTop: i === 0 ? 0 : 4,
                      borderRadius: 6,
                      background: i === 4 ? 'rgba(34,197,94,.12)' : 'rgba(255,255,255,.03)',
                      border: i === 4 ? '1px solid rgba(74,222,128,.35)' : '1px solid rgba(255,255,255,.05)',
                    }}>
                      <span className="mono" style={{
                        fontSize: 9, padding: '2px 6px', borderRadius: 4,
                        background: 'rgba(74,222,128,.2)', color: '#4ADE80',
                        fontWeight: 600, letterSpacing: '0.08em',
                        flexShrink: 0,
                      }}>0{i + 1}</span>
                      <span style={{ fontSize: 11.5, fontWeight: 600, color: '#fff' }}>{s.t}</span>
                      <span className="mono" style={{ fontSize: 10, color: 'rgba(255,255,255,.5)', letterSpacing: '0.04em', marginLeft: 'auto' }}>{s.d}</span>
                    </div>
                  ))}
                </div>

                {/* metrics */}
                <div style={{ display: 'flex', gap: 16, marginTop: 18 }}>
                  {[
                    { n: '31', u: '%', l: 'Conversion' },
                    { n: '13', u: '€', l: 'CPL' },
                    { n: '15', u: '+', l: 'Data points' },
                  ].map((m) => (
                    <div key={m.l} style={{ flex: 1 }}>
                      <div className="mono" style={{
                        fontSize: 22, fontWeight: 600,
                        background: 'linear-gradient(180deg, #fff, #4ADE80)',
                        WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        letterSpacing: '-0.02em',
                        fontFeatureSettings: '"tnum"',
                      }}>
                        {m.n}<span style={{ fontSize: 13, marginLeft: 1 }}>{m.u}</span>
                      </div>
                      <div className="mono" style={{ fontSize: 10, color: 'rgba(74,222,128,.8)', letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 2 }}>
                        {m.l}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Live landing screenshot */}
          <div style={{
            position: 'relative',
            padding: isMobile ? '8px 20px 24px' : '16px 48px 40px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div className="mono" style={{ fontSize: 10.5, color: 'rgba(74,222,128,.75)', letterSpacing: '0.22em', textTransform: 'uppercase' }}>
                La landing V2 en production
              </div>
              <div className="mono" style={{ fontSize: 10, color: 'rgba(255,255,255,.4)', letterSpacing: '0.14em' }}>
                Hero · champ d'autocomplétion d'adresse
              </div>
            </div>

            <div style={{
              borderRadius: 14,
              overflow: 'hidden',
              background: '#fff',
              border: '1px solid rgba(74,222,128,.2)',
              boxShadow: '0 30px 80px -20px rgba(34,197,94,.35), 0 10px 30px -10px rgba(0,0,0,.4)',
            }}>
              {/* browser chrome */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 14px',
                background: '#F3FAF6',
                borderBottom: '1px solid #E4E9E6',
              }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#F87171' }}></span>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#FBBF24' }}></span>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#34D399' }}></span>
                <span className="mono" style={{ flex: 1, textAlign: 'center', fontSize: 11, color: '#4B5563' }}>
                  renovia.fr
                </span>
                <span className="mono" style={{ fontSize: 10.5, color: '#046B4F', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600 }}>
                  Live
                </span>
              </div>

              {/* screenshot */}
              <div style={{ background: '#FBFDFC', overflow: 'hidden' }}>
                <img
                  src="/capture-landingpage.png"
                  alt="Rénovia — landing page en production"
                  style={{ display: 'block', width: '100%', height: 'auto' }}
                />
              </div>
            </div>
          </div>

          {/* KPIs bar */}
          <div style={{
            position: 'relative',
            padding: isMobile ? '24px 20px 28px' : '40px 48px 48px',
            borderTop: '1px solid rgba(255,255,255,.08)',
            background: 'rgba(255,255,255,.02)',
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: isMobile ? 20 : 32 }}>
              {[
                { n: '+158', suf: '%', l: 'Taux de conversion · de 12% à 31%' },
                { n: '−46', suf: '%', l: 'CPL · de 24 € à 13 €' },
                { n: '5', suf: 'x', l: 'Plus de data par lead · 3 champs → 15+' },
                { n: '2', suf: ' min', l: 'Pour un DPE live depuis la base ADEME' },
              ].map((x) => (
                <div key={x.l}>
                  <div style={{
                    fontSize: isMobile ? 40 : 56,
                    fontFamily: 'Geist Mono, monospace',
                    fontWeight: 600,
                    letterSpacing: '-0.03em',
                    lineHeight: 1,
                    background: 'linear-gradient(180deg, #fff 0%, #4ADE80 100%)',
                    WebkitBackgroundClip: 'text', backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontFeatureSettings: '"tnum"',
                  }}>
                    {x.n}<span style={{
                      background: 'linear-gradient(180deg, #4ADE80, #059669)',
                      WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    }}>{x.suf}</span>
                  </div>
                  <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,.6)', marginTop: 10, lineHeight: 1.45 }}>
                    {x.l}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contexte / Refonte / Résultat */}
          <div style={{
            position: 'relative',
            padding: isMobile ? '32px 20px' : '56px 48px',
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: isMobile ? 28 : 32,
            borderTop: '1px solid rgba(255,255,255,.08)',
          }}>
            {[
              { label: 'Le contexte', title: 'Un lead sans contexte vaut zéro', body: 'L\'ancienne landing capturait 3 champs — nom, prénom, numéro. Le RGE rappelait à froid, sans savoir si la personne est éligible, propriétaire, dans quelle classe énergétique. Résultat : rappels infructueux, no-shows, CPL qui explose sans ROAS.' },
              { label: 'La refonte', title: 'Architecture repensée, lead intentionniste', body: 'On a inversé l\'équation : au lieu de capturer vite, on engage d\'abord. Adresse → DPE tiré en live de la base ADEME (15M de records officiels). IA en fallback si le DPE n\'existe pas. 3 questions d\'éligibilité ANAH. Moteur qui chiffre 3 scénarios (MaPrimeRénov, CEE, Éco-PTZ). Le visiteur VOIT son montant d\'aide avant de donner ses coordonnées.' },
              { label: 'Le résultat', title: 'CPL divisé par 2, intention ×5', body: 'Le visiteur passe 5 minutes à qualifier son propre dossier. Quand il remplit ses coordonnées, il est déjà investi et intentionniste. Le RGE reçoit un dossier complet : DPE, surface, chauffage, scénario chiffré, profil ANAH. Les rappels closent mieux, le no-show s\'effondre, le CPL tombe à 13 €.' },
            ].map((x, i) => (
              <div key={x.label} style={{ position: 'relative' }}>
                <div className="mono" style={{
                  fontSize: 11,
                  color: i === 0 ? 'rgba(255,255,255,.5)' : '#4ADE80',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  fontWeight: 500,
                }}>
                  {x.label}
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 600, color: '#fff', marginTop: 12, letterSpacing: '-0.02em' }}>
                  {x.title}
                </h3>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,.7)', marginTop: 12, lineHeight: 1.6 }}>
                  {x.body}
                </p>
              </div>
            ))}
          </div>

          {/* stack */}
          <div style={{
            position: 'relative',
            padding: isMobile ? '20px 20px 24px' : '0 48px 48px',
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
            gap: isMobile ? 16 : 24,
          }}>
            {[
              { title: 'Stack Build', items: ['Next.js 16', 'React 19', 'Tailwind CSS v4', 'Supabase PostgreSQL', 'Vercel · deploy', 'Plausible · analytics'] },
              { title: 'Sources & Intégrations', items: ['Base Adresse Nationale (BAN)', 'Base ADEME · 15M DPE', 'Claude API · fallback DPE', 'Barèmes ANAH 2026', 'Resend · emails RGE', 'Upstash Redis · anti-spam'] },
            ].map((g) => (
              <div key={g.title} style={{
                padding: '22px 22px',
                borderRadius: 14,
                background: 'rgba(255,255,255,.04)',
                border: '1px solid rgba(255,255,255,.1)',
              }}>
                <div className="mono" style={{ fontSize: 10.5, color: 'rgba(74,222,128,.8)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                  {g.title}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 14 }}>
                  {g.items.map((it) => (
                    <span key={it} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '6px 11px', borderRadius: 999,
                      background: 'rgba(255,255,255,.06)',
                      border: '1px solid rgba(255,255,255,.1)',
                      fontSize: 12, color: 'rgba(255,255,255,.9)', fontWeight: 500,
                    }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#4ADE80', boxShadow: '0 0 6px rgba(74,222,128,.6)' }}></span>
                      {it}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* live CTA */}
          <div style={{
            position: 'relative',
            padding: isMobile ? '8px 20px 32px' : '0 48px 56px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}>
            <div className="mono" style={{ fontSize: 12, color: 'rgba(255,255,255,.55)', letterSpacing: '0.1em' }}>
              Le funnel qualifié, en production.
            </div>
            <a href="https://renovia.fr" target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '14px 22px',
              borderRadius: 999,
              background: 'linear-gradient(180deg, #22C55E, #059669)',
              color: '#fff',
              fontSize: 15, fontWeight: 600,
              boxShadow: '0 10px 30px -8px rgba(34,197,94,.55), inset 0 1px 0 rgba(255,255,255,.2)',
              transition: 'transform .2s, box-shadow .2s',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 16px 40px -8px rgba(34,197,94,.7), inset 0 1px 0 rgba(255,255,255,.25)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 10px 30px -8px rgba(34,197,94,.55), inset 0 1px 0 rgba(255,255,255,.2)'; }}
            >
              Ouvrir renovia.fr
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4 10 L10 4 M5 4 L10 4 L10 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════
// OTHER CASES
// ═════════════════════════════════════════════════════════════
const OTHER_CASES = [
  {
    sector: 'SaaS B2B · Série A',
    kpi: '−39%',
    kpiLabel: 'CPL en 60 jours',
    title: 'De 82€ à 49€ sur Meta Ads',
    desc: 'Refonte creative, restructuration CBO, audit tracking serveur. Passage d\'un CPL plafonné à un ROAS stable sur 3 mois.',
    duration: '8 semaines',
    scope: 'Ads',
    tone: 'violet',
  },
  {
    sector: 'Cabinet de conseil',
    kpi: '+15h',
    kpiLabel: 'gagnées par semaine',
    title: 'Prise de RDV automatisée bout-en-bout',
    desc: 'Formulaire → qualification IA → Calendly → CRM. Fini la saisie manuelle, les relances oubliées, les leads perdus.',
    duration: '3 semaines',
    scope: 'Build',
    tone: 'ink',
  },
  {
    sector: 'DTC · beauté premium',
    kpi: '4.8×',
    kpiLabel: 'ROAS à l\'échelle',
    title: 'Scale Meta de 600€ à 14K€ / mois',
    desc: 'Creative testing hebdomadaire, cohort analysis, LTV intégré au reporting. Scaling contrôlé sur 6 mois.',
    duration: '6 mois',
    scope: 'Ads',
    tone: 'lav',
  },
];

function OtherCases({ isMobile }) {
  const pad = isMobile ? '60px 20px' : '100px 120px';
  return (
    <section style={{ padding: pad, background: '#fff', borderTop: '1px solid var(--line-2)', borderBottom: '1px solid var(--line-2)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 24 }}>
          <div>
            <div className="k-section-label">
              <span className="k-section-label-sq"></span>
              01 — Autres missions
            </div>
            <h2 style={{ fontSize: isMobile ? 34 : 56, marginTop: 20, letterSpacing: '-0.035em', maxWidth: 720, lineHeight: 1.04 }}>
              Missions récentes. <span style={{ color: 'var(--muted)' }}>Un aperçu.</span>
            </h2>
          </div>
          {!isMobile && (
            <p style={{ color: 'var(--muted)', fontSize: 14.5, maxWidth: 320, lineHeight: 1.55 }}>
              Certaines missions restent confidentielles. Sur demande, on partage des détails chiffrés en NDA.
            </p>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? 16 : 20, marginTop: isMobile ? 32 : 48 }}>
          {OTHER_CASES.map((c, i) => (
            <div key={i} className="k-case">
              <div style={{
                padding: '28px 24px 24px',
                background: c.tone === 'violet' ? 'linear-gradient(150deg, #F5F3FF, #EDE9FE)' : c.tone === 'ink' ? '#0A0A0A' : 'linear-gradient(150deg, #FFFFFF, #F5F3FF)',
                color: c.tone === 'ink' ? '#fff' : 'var(--ink)',
                borderBottom: '1px solid var(--line-2)',
                position: 'relative',
                overflow: 'hidden',
              }}>
                {c.tone === 'ink' && (
                  <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 80% 0%, rgba(139,92,246,.35), transparent 60%)' }}></div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
                  <div className="mono" style={{ fontSize: 11, color: c.tone === 'ink' ? 'rgba(255,255,255,.55)' : 'var(--muted)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                    {c.sector}
                  </div>
                  <span className="mono" style={{
                    fontSize: 10, padding: '3px 8px', borderRadius: 999,
                    background: c.tone === 'ink' ? 'rgba(196,181,253,.15)' : 'rgba(139,92,246,.1)',
                    color: c.tone === 'ink' ? '#C4B5FD' : 'var(--violet-deep)',
                    border: c.tone === 'ink' ? '1px solid rgba(196,181,253,.25)' : '1px solid rgba(139,92,246,.15)',
                    letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 500,
                  }}>
                    {c.scope}
                  </span>
                </div>
                <div className="k-metric-num" style={{
                  fontSize: 64, marginTop: 16, lineHeight: 1,
                  background: c.tone === 'ink'
                    ? 'linear-gradient(180deg, #fff, #C4B5FD)'
                    : 'linear-gradient(180deg, #0A0A0A, #2A2340)',
                  WebkitBackgroundClip: 'text', backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  position: 'relative',
                }}>
                  {c.kpi}
                </div>
                <p className="mono" style={{ fontSize: 12, color: c.tone === 'ink' ? 'rgba(255,255,255,.6)' : 'var(--muted)', marginTop: 6, position: 'relative' }}>
                  {c.kpiLabel}
                </p>
              </div>
              <div style={{ padding: '20px 24px 24px' }}>
                <h3 style={{ fontSize: 17, fontWeight: 500, letterSpacing: '-0.012em' }}>{c.title}</h3>
                <p style={{ color: 'var(--muted)', fontSize: 13.5, marginTop: 8, lineHeight: 1.55 }}>{c.desc}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--line-2)' }}>
                  <span className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>{c.duration}</span>
                  <span style={{ fontSize: 12, color: 'var(--muted)' }}>confidentiel</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════
// SELECTION CRITERIA — strip
// ═════════════════════════════════════════════════════════════
function SelectionCriteria({ isMobile }) {
  const pad = isMobile ? '60px 20px' : '120px 120px';
  return (
    <section style={{ padding: pad, background: 'linear-gradient(180deg, #F5F3FF 0%, #FAFAFA 60%, #F5F3FF 100%)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="k-section-label">
          <span className="k-section-label-sq"></span>
          02 — Comment on choisit nos projets
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1.2fr', gap: isMobile ? 28 : 60, marginTop: 20, alignItems: 'center' }}>
          <h2 style={{ fontSize: isMobile ? 34 : 52, letterSpacing: '-0.035em', lineHeight: 1.04 }}>
            Tous les projets ne se valent pas. <span style={{ color: 'var(--muted)' }}>On l'assume.</span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { t: 'Une vraie promesse à tenir', d: 'Le produit a du sens. On sait pourquoi on le construit, pas juste pour exister.' },
              { t: 'Un marché qui existe', d: 'Il y a déjà une demande à capter, ou un signal clair qu\'elle arrive. Pas de missionnariat.' },
              { t: 'Un décideur accessible', d: 'On travaille directement avec la personne qui signe. Pas de 4 couches de validation.' },
              { t: 'Le scope tient en 30 jours', d: 'Ce qui dépasse est découpé, pas étalé. Les projets fleuves finissent mal, toujours.' },
            ].map((x, i) => (
              <div key={i} style={{
                padding: '18px 22px',
                borderRadius: 12,
                background: '#fff',
                border: '1px solid var(--line-2)',
                display: 'flex', alignItems: 'flex-start', gap: 14,
                boxShadow: '0 1px 0 rgba(10,10,10,.02)',
              }}>
                <span style={{ flexShrink: 0, width: 22, height: 22, borderRadius: 6, background: 'linear-gradient(135deg, #C4B5FD, #8B5CF6)', marginTop: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M2 5.5 L4.5 8 L9 3" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
                <div>
                  <h3 style={{ fontSize: 15.5, fontWeight: 600, letterSpacing: '-0.012em' }}>{x.t}</h3>
                  <p style={{ color: 'var(--muted)', fontSize: 13.5, marginTop: 4, lineHeight: 1.55 }}>{x.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════
// ROOT
// ═════════════════════════════════════════════════════════════
const REALIS_TESTIMONIALS = [
  { q: 'Site, CRM, dashboard, Meta + Google Ads — tout livré par la même équipe en 4 semaines. Aujourd\'hui le coût par lead est stable à 10 CHF et je vois tout en temps réel dans le back-office. Je recommande les yeux fermés.', n: 'Louis', p: 'Fondateur', c: 'TRADEAUTO.CH', logo: '/tradeauto-logo.png' },
  { q: 'Avant on jonglait entre WhatsApp, tableurs et relances oubliées. Kairn nous a livré une plateforme two-sided complète — matching intelligent, dispatch auto, paiement Stripe, facturation. Aujourd\'hui on pilote 150+ missions par semaine depuis un seul back-office.', n: 'Manon', p: 'Co-fondatrice', c: 'MADAMELAGOUVERNANTE.COM', logo: '/madame-logo.png' },
  { q: 'CPL divisé par 2, conversion doublée. Mais surtout : les leads arrivent avec un dossier complet. Le closing a suivi.', n: 'Samuel', p: 'Fondateur', c: 'RENOVIA.FR', logo: '/renovia-logo.svg' },
];

export default function RealisationsPage({ variant = 'desktop' }) {
  const isMobile = variant === 'mobile';
  return (
    <div className="kairn">
      <KNav isMobile={isMobile} />
      <RealisationsHero isMobile={isMobile} />
      <FeaturedTradeauto isMobile={isMobile} />
      <FeaturedMadameLaGouvernante isMobile={isMobile} />
      <FeaturedRenovia isMobile={isMobile} />
      <OtherCases isMobile={isMobile} />
      <SelectionCriteria isMobile={isMobile} />
      <KTestimonials isMobile={isMobile} items={REALIS_TESTIMONIALS} sectionNumber="03" />
      <KLogos isMobile={isMobile} />
      <KFinalCTA isMobile={isMobile} />
      <KFooter isMobile={isMobile} />
      {isMobile && (
        <div style={{ position: 'sticky', bottom: 0, padding: '0 0 12px', pointerEvents: 'none' }}>
          <a className="k-mob-cta" href={BOOKING_URL} target="_blank" rel="noopener noreferrer" style={{ pointerEvents: 'auto', textDecoration: 'none' }}>
            <span style={{ fontSize: 14, fontWeight: 500 }}>Le prochain projet ?</span>
            <span style={{ fontSize: 13, color: '#C4B5FD', fontWeight: 500 }}>Réserver 30 min →</span>
          </a>
        </div>
      )}
    </div>
  );
}
