import React from 'react';
import { IllusCurve, IllusFunnel, IllusFlow, IllusLanding, IllusDash, IllusCPL } from './illustrations.jsx';
import { KNav } from './sections-1.jsx';
import { KLogos, KFAQ, KFinalCTA, KFooter } from './sections-3.jsx';
import { BOOKING_URL } from './config.js';

// ═════════════════════════════════════════════════════════════
// ADS HERO
// ═════════════════════════════════════════════════════════════
function AdsHero({ isMobile }) {
  return (
    <section className="k-hero k-hero-bg" style={{ position: 'relative', paddingBottom: isMobile ? 48 : 96 }}>
      <div className="k-hero-blob" style={{ width: 480, height: 480, background: '#8B5CF6', top: -120, left: '8%', opacity: .28 }}></div>
      <div className="k-hero-blob" style={{ width: 520, height: 520, background: '#C4B5FD', top: -60, right: '12%', animationDelay: '-6s' }}></div>

      <div style={{ textAlign: 'center', paddingTop: isMobile ? 40 : 80, position: 'relative' }}>
        <span className="k-eyebrow">
          <span className="k-eyebrow-dot"></span>
          Ads · Meta · Google · LinkedIn · TikTok · scaling
        </span>
      </div>

      <h1 className="k-hero-headline" style={{ fontSize: isMobile ? 42 : 88, marginTop: isMobile ? 20 : 32 }}>
        Le CPL qui baisse. <em>Le budget qui scale</em>.
      </h1>
      <p className="k-hero-sub" style={{ fontSize: isMobile ? 16 : 19, marginTop: isMobile ? 20 : 28 }}>
        On optimise avant de scaler. <strong style={{ color: 'var(--ink)', fontWeight: 500 }}>Creative testing, tracking serveur, attribution multi-touch</strong> — tout audité, rien au hasard.
      </p>

      <div style={{ textAlign: 'center', padding: isMobile ? '28px 20px 0' : '36px 0 0', display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap', position: 'relative' }}>
        <a className="k-cta" href={BOOKING_URL} target="_blank" rel="noopener noreferrer" style={{ padding: '16px 26px', fontSize: 16 }}>
          Réserver 30 min
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7 L11 7 M7 3 L11 7 L7 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </a>
        <a className="k-cta k-cta-ghost" href="#methodo" style={{ padding: '16px 22px', fontSize: 15 }}>
          Voir la méthode
        </a>
      </div>

      {!isMobile && (
        <div style={{ maxWidth: 1200, margin: '56px auto 0', padding: '0 24px', position: 'relative' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
            <div style={{ background: 'rgba(255,255,255,.7)', backdropFilter: 'blur(8px)', border: '1px solid var(--line-2)', borderRadius: 16, padding: 24, boxShadow: '0 24px 60px -30px rgba(124,58,237,.2)' }}>
              <div className="mono" style={{ fontSize: 11, color: 'var(--violet)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>CPL moyen</div>
              <div className="k-metric-num" style={{ fontSize: 48, marginTop: 10, lineHeight: 1 }}>−38<span style={{ color: 'var(--violet)' }}>%</span></div>
            </div>
            <div style={{ background: 'rgba(255,255,255,.7)', backdropFilter: 'blur(8px)', border: '1px solid var(--line-2)', borderRadius: 16, padding: 24, boxShadow: '0 24px 60px -30px rgba(124,58,237,.2)' }}>
              <div className="mono" style={{ fontSize: 11, color: 'var(--violet)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>ROAS médian</div>
              <div className="k-metric-num" style={{ fontSize: 48, marginTop: 10, lineHeight: 1 }}>4.8<span style={{ color: 'var(--violet)' }}>×</span></div>
            </div>
            <div style={{ background: 'rgba(255,255,255,.7)', backdropFilter: 'blur(8px)', border: '1px solid var(--line-2)', borderRadius: 16, padding: 24, boxShadow: '0 24px 60px -30px rgba(124,58,237,.2)' }}>
              <div className="mono" style={{ fontSize: 11, color: 'var(--violet)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Break-even</div>
              <div className="k-metric-num" style={{ fontSize: 48, marginTop: 10, lineHeight: 1 }}>14<span style={{ color: 'var(--violet)' }}>j</span></div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// ═════════════════════════════════════════════════════════════
// ETHOS — 3 rules
// ═════════════════════════════════════════════════════════════
function AdsEthos({ isMobile }) {
  const pad = isMobile ? '60px 20px' : '120px 120px';
  const pillars = [
    { n: '01', t: 'Optimize avant scale', d: 'On baisse le CPL avant de toucher au budget. Jamais l\'inverse. Scaler une machine cassée coûte plus cher que la réparer.' },
    { n: '02', t: 'Creative first', d: '80% de la performance vient de la créa. On teste 20 variantes par semaine, classées par hook, format, et angle.' },
    { n: '03', t: 'Tracking serveur', d: 'Meta CAPI, GA4 Enhanced Conversions, GTM server-side. Pas de tracking, pas de décision — c\'est non-négociable.' },
  ];
  return (
    <section style={{ padding: pad, background: '#fff', borderTop: '1px solid var(--line-2)', borderBottom: '1px solid var(--line-2)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="k-section-label">
          <span className="k-section-label-sq"></span>
          01 — Nos règles
        </div>
        <h2 style={{ fontSize: isMobile ? 30 : 52, marginTop: 16, maxWidth: 900, letterSpacing: '-0.028em', lineHeight: 1.08 }}>
          Trois principes. <span style={{ color: 'var(--muted)' }}>Appliqués sans exception.</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: isMobile ? 20 : 40, marginTop: isMobile ? 32 : 56 }}>
          {pillars.map((x) => (
            <div key={x.n} className="k-pos-card">
              <div className="mono k-pos-num">{x.n}</div>
              <h3 style={{ fontSize: 22, marginTop: 10, fontWeight: 500 }}>{x.t}</h3>
              <p style={{ color: 'var(--muted)', fontSize: 14.5, marginTop: 10, lineHeight: 1.55 }}>{x.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════
// CHANNELS — alternating rows
// ═════════════════════════════════════════════════════════════
function AdsChannelRow({ index, title, tag, description, bullets, bestFor, Illus, reverse, isMobile }) {
  const gap = isMobile ? 28 : 80;
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
      gap,
      alignItems: 'center',
      padding: isMobile ? '40px 0' : '80px 0',
      borderTop: index > 0 ? '1px solid var(--line-2)' : 'none',
    }}>
      <div style={{ order: isMobile ? 0 : (reverse ? 2 : 0) }}>
        <div className="mono" style={{ fontSize: 11, color: 'var(--violet)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
          0{index + 1} — {tag}
        </div>
        <h3 style={{ fontSize: isMobile ? 28 : 40, marginTop: 14, fontWeight: 600, letterSpacing: '-0.028em', lineHeight: 1.08 }}>
          {title}
        </h3>
        <p style={{ color: 'var(--muted)', fontSize: isMobile ? 15 : 16.5, marginTop: 16, lineHeight: 1.6, maxWidth: 480 }}>
          {description}
        </p>
        <ul style={{ listStyle: 'none', padding: 0, margin: '24px 0 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {bullets.map((b, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: 14.5, color: 'var(--ink-soft)', lineHeight: 1.5 }}>
              <span style={{ flexShrink: 0, width: 16, height: 16, borderRadius: 4, background: 'linear-gradient(135deg, #C4B5FD, #8B5CF6)', marginTop: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1.5 4.5 L3 6 L6.5 2" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
              {b}
            </li>
          ))}
        </ul>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 20, padding: '6px 12px', borderRadius: 999, background: 'rgba(139,92,246,.08)', border: '1px solid rgba(139,92,246,.15)' }}>
          <span className="mono" style={{ fontSize: 10.5, color: 'var(--violet-deep)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Best for</span>
          <span style={{ fontSize: 13, color: 'var(--ink-soft)', fontWeight: 500 }}>{bestFor}</span>
        </div>
      </div>
      <div style={{ order: isMobile ? 0 : 1, position: 'relative' }}>
        <div style={{
          background: 'linear-gradient(135deg, #FBFAFF 0%, #F5F3FF 100%)',
          borderRadius: 20,
          padding: isMobile ? 24 : 40,
          border: '1px solid var(--line-2)',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 24px 60px -30px rgba(124,58,237,.25)',
          minHeight: isMobile ? 200 : 320,
          display: 'flex',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 20% 10%, rgba(139,92,246,.12), transparent 60%)' }}></div>
          <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <Illus />
          </div>
        </div>
      </div>
    </div>
  );
}

function AdsChannels({ isMobile }) {
  const pad = isMobile ? '20px 20px 40px' : '80px 120px 60px';
  const channels = [
    {
      tag: 'Meta Ads',
      title: 'Facebook & Instagram · le volume maîtrisé',
      description: 'Le levier n°1 pour du volume qualifié en B2C et B2B mid-market. Structure CBO, creative testing industrialisé, CAPI obligatoire.',
      bullets: [
        'Structure CBO + ASC campaigns',
        'Creative testing · 20+ variantes/mois',
        'Meta CAPI + Conversions API serveur',
        'Retargeting segmenté + lookalikes',
      ],
      bestFor: 'B2C · DTC · SaaS B2B mid-market',
      Illus: IllusCurve,
    },
    {
      tag: 'Google Ads',
      title: 'Search, Performance Max & Display',
      description: 'La demande existante, captée avec précision. Search intent-based, PMax pour le scaling, Display pour le retargeting.',
      bullets: [
        'Search campaigns avec match types stricts',
        'Performance Max segmenté par audience',
        'Enhanced Conversions + Google Tag Server',
        'Display + Discovery pour retargeting',
      ],
      bestFor: 'Demande captive · B2B · e-commerce',
      Illus: IllusFunnel,
      reverse: true,
    },
    {
      tag: 'LinkedIn Ads',
      title: 'B2B qualifié · ABM & lead gen',
      description: 'Le seul canal qui cible par poste, entreprise et séniorité. Cher au CPL mais redoutable sur le SQL si bien piloté.',
      bullets: [
        'Sponsored Content + Message Ads',
        'Audiences matchées par liste de comptes (ABM)',
        'Thought Leader Ads (posts perso de décideurs)',
        'Conversion API LinkedIn intégrée',
      ],
      bestFor: 'Enterprise · SaaS B2B · professional services',
      Illus: IllusFlow,
    },
    {
      tag: 'TikTok Ads',
      title: 'Native, créatif, viral',
      description: 'Audience jeune, mais plus seulement. Les créas doivent ressembler au feed, pas à des pubs. 10 créas minimum par lancement.',
      bullets: [
        'Spark Ads (boost de posts organiques)',
        'Creative testing 2× plus rapide que Meta',
        'TikTok Pixel + Events API serveur',
        'Scripts UGC fournis pour vos créateurs',
      ],
      bestFor: 'DTC · beauté · food · apps B2C',
      Illus: IllusLanding,
      reverse: true,
    },
    {
      tag: 'YouTube Ads',
      title: 'Vidéo long + Shorts · brand + perf',
      description: 'Le canal sous-estimé. In-stream pour la conversion, Shorts pour la découverte, Discovery pour la demande latente.',
      bullets: [
        'In-stream skippables optimisés pour la conversion',
        'YouTube Shorts en placement séparé',
        'Attribution cross-device via Google signals',
        'Retargeting par view-through à 10s',
      ],
      bestFor: 'Brand storytelling · démo produit',
      Illus: IllusDash,
    },
    {
      tag: 'Retargeting',
      title: 'Retargeting & programmatique',
      description: 'Pour clôturer les leads qui ne signent pas au premier contact. Séquences personnalisées selon la profondeur du funnel.',
      bullets: [
        'Retargeting multi-canal (Meta + Google + LinkedIn)',
        'Sequencing par étape du funnel',
        'Dynamic retargeting (DPA) pour l\'e-commerce',
        'Programmatique DSP pour les audiences niches',
      ],
      bestFor: 'Closing · B2C + B2B long cycle',
      Illus: IllusCPL,
      reverse: true,
    },
  ];
  return (
    <section style={{ padding: pad, background: 'var(--bg)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ padding: isMobile ? '40px 0 20px' : '40px 0 0' }}>
          <div className="k-section-label">
            <span className="k-section-label-sq"></span>
            02 — Canaux maîtrisés
          </div>
          <h2 style={{ fontSize: isMobile ? 36 : 64, marginTop: 20, letterSpacing: '-0.035em', maxWidth: 900, lineHeight: 1.02 }}>
            Six canaux. <span style={{ color: 'var(--muted)' }}>Un par contexte.</span>
          </h2>
        </div>
        {channels.map((c, i) => (
          <AdsChannelRow key={i} index={i} isMobile={isMobile} {...c} />
        ))}
      </div>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════
// METHODOLOGY — 4 pillars
// ═════════════════════════════════════════════════════════════
function AdsMethodology({ isMobile }) {
  const pad = isMobile ? '60px 20px' : '120px 120px';
  const pillars = [
    {
      n: '01',
      t: 'Creative testing',
      stats: '20+ créas/mois',
      d: 'Matrix hook × angle × format. Chaque variante testée avec budget égal pendant 72h avant arbitrage.',
      tags: ['UGC · Hook-driven', 'Motion design', 'Testimonial B2B', 'Product demo'],
    },
    {
      n: '02',
      t: 'Targeting',
      stats: 'Broad + exclusions',
      d: 'On laisse l\'algo travailler large, avec des exclusions fines. Les lookalikes en backup, pas en primaire.',
      tags: ['Broad + CBO', 'Exclusion dynamique', 'Lookalikes 1-3%', 'Custom audiences'],
    },
    {
      n: '03',
      t: 'Tracking serveur',
      stats: '100% first-party',
      d: 'Meta CAPI, GA4 Enhanced, GTM server-side container sur Cloud Run. Pas de données perdues, pas d\'iOS14 blues.',
      tags: ['Meta CAPI', 'GTM server-side', 'Enhanced Conv.', 'Stape.io'],
    },
    {
      n: '04',
      t: 'Optimisation',
      stats: 'Weekly cadence',
      d: 'Lundi : analyse cohortes. Mardi : arbitrage créas. Mercredi : nouveaux tests. Jeudi : scaling. Vendredi : reporting.',
      tags: ['Cohort analysis', 'LTV optim.', 'Scaling CBO', 'Weekly Loom'],
    },
  ];
  return (
    <section id="methodo" style={{ padding: pad, background: '#fff', borderTop: '1px solid var(--line-2)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="k-section-label">
          <span className="k-section-label-sq"></span>
          03 — Méthodologie
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 24, marginTop: 20 }}>
          <h2 style={{ fontSize: isMobile ? 34 : 56, letterSpacing: '-0.035em', maxWidth: 720, lineHeight: 1.04 }}>
            Quatre piliers. <span style={{ color: 'var(--muted)' }}>Sur chaque compte. Chaque semaine.</span>
          </h2>
          {!isMobile && (
            <p style={{ color: 'var(--muted)', fontSize: 14.5, maxWidth: 320, lineHeight: 1.55 }}>
              Pas de framework théorique. Un checklist concret, appliqué en production.
            </p>
          )}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: isMobile ? 16 : 20, marginTop: isMobile ? 32 : 48 }}>
          {pillars.map((p) => (
            <div key={p.n} style={{
              padding: '32px 28px 32px',
              borderRadius: 16,
              border: '1px solid var(--line-2)',
              background: 'linear-gradient(180deg, #fff 0%, #FBFAFF 100%)',
              position: 'relative',
              overflow: 'hidden',
              transition: 'transform .25s, box-shadow .25s, border-color .25s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 24px 50px -24px rgba(124,58,237,.28)'; e.currentTarget.style.borderColor = 'var(--lav)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.borderColor = 'var(--line-2)'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span className="mono" style={{ fontSize: 12, color: 'var(--violet)', fontWeight: 600, letterSpacing: '0.08em' }}>{p.n}</span>
                  <h3 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.025em' }}>{p.t}</h3>
                </div>
                <span className="k-proc-kpi">
                  <span className="k-proc-kpi-dot"></span>{p.stats}
                </span>
              </div>
              <p style={{ color: 'var(--muted)', fontSize: 14.5, marginTop: 14, lineHeight: 1.6 }}>
                {p.d}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 18 }}>
                {p.tags.map((t) => (
                  <span key={t} style={{
                    fontSize: 12, padding: '5px 10px', borderRadius: 999,
                    background: 'rgba(139,92,246,.08)',
                    color: 'var(--violet-deep)',
                    border: '1px solid rgba(139,92,246,.15)',
                    fontFamily: 'Geist Mono, monospace',
                  }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════
// PROCESS ADS — 4 steps
// ═════════════════════════════════════════════════════════════
function AdsProcessStep({ n, title, duration, description, bullets, isMobile }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'auto 1fr' : '120px 1fr 1fr', gap: isMobile ? 20 : 48, padding: isMobile ? '32px 0' : '48px 0', borderTop: '1px solid var(--line-2)', position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <div style={{
          width: isMobile ? 56 : 88,
          height: isMobile ? 56 : 88,
          borderRadius: '50%',
          background: n === '03'
            ? 'radial-gradient(circle at 35% 30%, #C4B5FD 0%, #8B5CF6 55%, #6D28D9 100%)'
            : 'radial-gradient(circle at 35% 30%, #FAFAFA 0%, #EDE9FE 45%, #C4B5FD 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid rgba(139,92,246,.25)',
          boxShadow: '0 10px 30px -8px rgba(124,58,237,.3), inset 0 1px 0 rgba(255,255,255,.9)',
        }}>
          <span className="mono" style={{ fontSize: isMobile ? 14 : 18, fontWeight: 600, color: n === '03' ? '#fff' : 'var(--violet-deep)', letterSpacing: '0.02em' }}>
            {n}
          </span>
        </div>
      </div>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <h3 style={{ fontSize: isMobile ? 24 : 32, fontWeight: 600, letterSpacing: '-0.028em' }}>{title}</h3>
          <span className="k-proc-kpi">
            <span className="k-proc-kpi-dot"></span>{duration}
          </span>
        </div>
        <p style={{ color: 'var(--muted)', fontSize: isMobile ? 14.5 : 15.5, marginTop: 12, lineHeight: 1.6, maxWidth: 520 }}>
          {description}
        </p>
      </div>
      {!isMobile && (
        <div>
          <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Livrable</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: '12px 0 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {bullets.map((b, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.5 }}>
                <span style={{ flexShrink: 0, width: 5, height: 5, borderRadius: '50%', background: 'var(--violet)', marginTop: 8 }}></span>
                {b}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function AdsProcess({ isMobile }) {
  const pad = isMobile ? '60px 20px' : '120px 120px';
  const steps = [
    { n: '01', title: 'Audit', duration: '48h', description: 'Audit complet : compte, tracking, créas, concurrence. On identifie les fuites avant la moindre dépense additionnelle.', bullets: ['Audit compte & historique', 'Validation tracking server-side', 'Analyse concurrentielle (Meta Library, SpyFu)', 'Plan d\'action priorisé'] },
    { n: '02', title: 'Setup', duration: '1 semaine', description: 'Setup technique complet. Tracking CAPI, structure CBO, 20 créas initiales, budget calibré par canal et audience.', bullets: ['Meta CAPI + GTM server-side', 'Structure CBO + ASC campaigns', '20 créas produites et testées', 'Budget calibré par canal'] },
    { n: '03', title: 'Launch', duration: 'J-Day', description: 'Activation des campagnes, monitoring intensif 72h. Arbitrage quotidien jusqu\'à la stabilisation du CPL.', bullets: ['Go-live avec checklist validée', 'Monitoring toutes les 4h pendant 72h', 'Arbitrages quotidiens S1', 'Reporting J+3 détaillé'] },
    { n: '04', title: 'Scale', duration: 'Cadence hebdo', description: 'Itérations hebdomadaires sur les créas, le ciblage, le budget. 10 nouvelles créas par mois, reporting Notion + Loom chaque lundi.', bullets: ['10+ nouvelles créas/mois', 'Arbitrage créas hebdo', 'Scaling CBO progressif', 'Reporting Loom + Notion lundi'] },
  ];
  return (
    <section style={{ padding: pad, background: 'linear-gradient(180deg, #F5F3FF 0%, #FAFAFA 60%, #F5F3FF 100%)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="k-section-label">
          <span className="k-section-label-sq"></span>
          04 — Processus Ads
        </div>
        <h2 style={{ fontSize: isMobile ? 36 : 64, marginTop: 20, letterSpacing: '-0.035em', maxWidth: 900, lineHeight: 1.02 }}>
          De l'audit au scale. <span style={{ color: 'var(--muted)' }}>En 3 semaines max.</span>
        </h2>
        <div style={{ marginTop: isMobile ? 32 : 56 }}>
          {steps.map((s) => (
            <AdsProcessStep key={s.n} {...s} isMobile={isMobile} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════
// DELIVERABLES
// ═════════════════════════════════════════════════════════════
function AdsDeliverables({ isMobile }) {
  const pad = isMobile ? '60px 20px' : '100px 120px';
  const items = [
    { icon: 'dashboard', title: 'Dashboard live', d: 'Metabase ou Looker Studio accessible 24/7. Tous les KPIs en temps réel : CPL, CPA, ROAS, LTV.' },
    { icon: 'report', title: 'Rapport hebdo', d: 'Chaque lundi : Loom de 10 min + doc Notion. Ce qui a marché, ce qu\'on change, pourquoi.' },
    { icon: 'library', title: 'Creative library', d: 'Toutes les créas classées par hook, angle, performance. Exportable, utilisable ailleurs.' },
    { icon: 'stack', title: 'Stack tracking', d: 'Meta CAPI, GA4, GTM server, Enhanced Conversions. Documenté, transmissible.' },
  ];
  const Icon = ({ name }) => {
    const common = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };
    if (name === 'dashboard') return <svg {...common}><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></svg>;
    if (name === 'report') return <svg {...common}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><path d="M8 18l2-4 3 2 3-5" /></svg>;
    if (name === 'library') return <svg {...common}><rect x="3" y="4" width="5" height="16" rx="1" /><rect x="10" y="4" width="5" height="16" rx="1" /><rect x="17" y="4" width="4" height="16" rx="1" /></svg>;
    return <svg {...common}><path d="M3 12L12 3l9 9" /><path d="M5 10v10h14V10" /><circle cx="12" cy="15" r="2" /></svg>;
  };
  return (
    <section style={{ padding: pad, background: '#fff', borderTop: '1px solid var(--line-2)', borderBottom: '1px solid var(--line-2)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="k-section-label">
          <span className="k-section-label-sq"></span>
          05 — Livrables
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 24, marginTop: 20 }}>
          <h2 style={{ fontSize: isMobile ? 34 : 56, letterSpacing: '-0.035em', maxWidth: 720, lineHeight: 1.04 }}>
            Ce que vous recevez. <span style={{ color: 'var(--muted)' }}>Chaque semaine.</span>
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)', gap: isMobile ? 16 : 20, marginTop: isMobile ? 28 : 40 }}>
          {items.map((it) => (
            <div key={it.title} style={{
              padding: '28px 24px 28px', borderRadius: 14,
              background: 'linear-gradient(180deg, #FBFAFF 0%, #F5F3FF 100%)',
              border: '1px solid var(--line-2)',
            }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px -6px rgba(124,58,237,.5)' }}>
                <Icon name={it.icon} />
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 500, letterSpacing: '-0.012em', marginTop: 20 }}>{it.title}</h3>
              <p style={{ color: 'var(--muted)', fontSize: 13.5, marginTop: 8, lineHeight: 1.55 }}>{it.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════
// ADS PAGE ROOT
// ═════════════════════════════════════════════════════════════
const ADS_FAQ = [
  { q: 'Quel est le budget mensuel minimum pour travailler avec vous ?', a: 'Budget média de 10 000€/mois minimum par canal. En dessous, on ne peut pas produire assez de créas pour itérer proprement, et les apprentissages Meta/Google sont trop lents.' },
  { q: 'Y a-t-il un engagement minimum ?', a: 'Trois mois minimum. Un mois = setup + learning Meta. Deux mois = premiers arbitrages. Trois mois = vous voyez ce qu\'on vaut. Au-delà, pas d\'engagement, préavis 30 jours.' },
  { q: 'Quels sont vos frais de gestion ?', a: 'Forfait mensuel fixe à partir de 2 500€ HT pour un canal, 5 500€ HT pour trois canaux. Pas de % sur le budget média : ça aligne mal les intérêts et ça pousse à brûler.' },
  { q: 'La production des créas est-elle incluse ?', a: 'Inclus : 10 créas/mois (variations, hooks, formats). Les UGC, vidéos produites, et motion design complexes sont en sus — on a un réseau de créateurs sélectionnés.' },
  { q: 'Qui possède les comptes publicitaires ?', a: 'Vous. On travaille sur vos comptes Business Manager Meta, vos comptes Google Ads, etc. Si vous partez, vous gardez tout : l\'historique, les audiences, les créas.' },
  { q: 'Offrez-vous une garantie de résultat ?', a: 'On s\'engage sur des fourchettes chiffrées à l\'audit initial (CPL cible, ROAS objectif, break-even). Si non atteint à J+90, on ajuste le plan à nos frais, ou on rembourse le trop-perçu au prorata.' },
];

export default function AdsPage({ variant = 'desktop' }) {
  const isMobile = variant === 'mobile';
  return (
    <div className="kairn">
      <KNav isMobile={isMobile} />
      <AdsHero isMobile={isMobile} />
      <AdsEthos isMobile={isMobile} />
      <AdsChannels isMobile={isMobile} />
      <AdsMethodology isMobile={isMobile} />
      <AdsProcess isMobile={isMobile} />
      <AdsDeliverables isMobile={isMobile} />
      <KLogos isMobile={isMobile} />
      <KFAQ isMobile={isMobile} items={ADS_FAQ} sectionNumber="06" />
      <KFinalCTA isMobile={isMobile} />
      <KFooter isMobile={isMobile} />
      {isMobile && (
        <div style={{ position: 'sticky', bottom: 0, padding: '0 0 12px', pointerEvents: 'none' }}>
          <a className="k-mob-cta" href={BOOKING_URL} target="_blank" rel="noopener noreferrer" style={{ pointerEvents: 'auto', textDecoration: 'none' }}>
            <span style={{ fontSize: 14, fontWeight: 500 }}>Faire tourner la machine.</span>
            <span style={{ fontSize: 13, color: '#C4B5FD', fontWeight: 500 }}>Réserver 30 min →</span>
          </a>
        </div>
      )}
    </div>
  );
}
