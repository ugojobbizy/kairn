import React, { useState } from 'react';
import { IllusLanding, IllusFunnel, IllusFlow, IllusDash, IllusCPL, IllusCurve } from './illustrations.jsx';
import { KNav } from './sections-1.jsx';
import { KLogos, KFAQ, KFinalCTA, KFooter } from './sections-3.jsx';
import { BOOKING_URL } from './config.js';

// ═════════════════════════════════════════════════════════════
// BUILD HERO
// ═════════════════════════════════════════════════════════════
function BuildHero({ isMobile }) {
  return (
    <section className="k-hero k-hero-bg" style={{ position: 'relative', paddingBottom: isMobile ? 48 : 96 }}>
      <div className="k-hero-blob" style={{ width: 440, height: 440, background: '#C4B5FD', top: -120, left: '12%' }}></div>
      <div className="k-hero-blob" style={{ width: 520, height: 520, background: '#8B5CF6', top: -60, right: '10%', opacity: .22, animationDelay: '-6s' }}></div>

      <div style={{ textAlign: 'center', paddingTop: isMobile ? 40 : 80, position: 'relative' }}>
        <span className="k-eyebrow">
          <span className="k-eyebrow-dot"></span>
          Build · code + no-code · livraison &lt; 30 jours
        </span>
      </div>

      <h1 className="k-hero-headline" style={{ fontSize: isMobile ? 42 : 88, marginTop: isMobile ? 20 : 32 }}>
        Tout ce que vous auriez <em>déjà dû</em> avoir en ligne.
      </h1>
      <p className="k-hero-sub" style={{ fontSize: isMobile ? 16 : 19, marginTop: isMobile ? 20 : 28 }}>
        Landings, funnels, plateformes SaaS, automatisations. On construit la machine qui convertit — <strong style={{ color: 'var(--ink)', fontWeight: 500 }}>avec le code dans vos mains</strong>.
      </p>

      <div style={{ textAlign: 'center', padding: isMobile ? '28px 20px 0' : '36px 0 0', display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap', position: 'relative' }}>
        <a className="k-cta" href={BOOKING_URL} target="_blank" rel="noopener noreferrer" style={{ padding: '16px 26px', fontSize: 16 }}>
          Réserver 30 min
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7 L11 7 M7 3 L11 7 L7 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </a>
        <a className="k-cta k-cta-ghost" href="#stack" style={{ padding: '16px 22px', fontSize: 15 }}>
          Voir la stack
        </a>
      </div>

      {!isMobile && (
        <div style={{ maxWidth: 1200, margin: '56px auto 0', padding: '0 24px', position: 'relative' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
            <div style={{ background: 'rgba(255,255,255,.7)', backdropFilter: 'blur(8px)', border: '1px solid var(--line-2)', borderRadius: 16, padding: 24, boxShadow: '0 24px 60px -30px rgba(124,58,237,.2)' }}>
              <div className="mono" style={{ fontSize: 11, color: 'var(--violet)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Délai moyen</div>
              <div className="k-metric-num" style={{ fontSize: 48, marginTop: 10, lineHeight: 1 }}>18<span style={{ color: 'var(--violet)' }}>j</span></div>
            </div>
            <div style={{ background: 'rgba(255,255,255,.7)', backdropFilter: 'blur(8px)', border: '1px solid var(--line-2)', borderRadius: 16, padding: 24, boxShadow: '0 24px 60px -30px rgba(124,58,237,.2)' }}>
              <div className="mono" style={{ fontSize: 11, color: 'var(--violet)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Conversion visée</div>
              <div className="k-metric-num" style={{ fontSize: 48, marginTop: 10, lineHeight: 1 }}>8<span style={{ color: 'var(--violet)' }}>%+</span></div>
            </div>
            <div style={{ background: 'rgba(255,255,255,.7)', backdropFilter: 'blur(8px)', border: '1px solid var(--line-2)', borderRadius: 16, padding: 24, boxShadow: '0 24px 60px -30px rgba(124,58,237,.2)' }}>
              <div className="mono" style={{ fontSize: 11, color: 'var(--violet)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Code source</div>
              <div className="k-metric-num" style={{ fontSize: 48, marginTop: 10, lineHeight: 1 }}>100<span style={{ color: 'var(--violet)' }}>%</span></div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// ═════════════════════════════════════════════════════════════
// ETHOS — 3 pillars
// ═════════════════════════════════════════════════════════════
function BuildEthos({ isMobile }) {
  const pad = isMobile ? '60px 20px' : '120px 120px';
  const pillars = [
    { n: '01', t: 'Vélocité', d: '2 à 4 semaines pour livrer ce qui prenait 6 mois. On découpe, on ne dilue pas.' },
    { n: '02', t: 'Ownership', d: 'Le code vous appartient. Hébergé où vous voulez, modifiable par qui vous voulez.' },
    { n: '03', t: 'Stack moderne', d: 'React, Next.js, Supabase, n8n. Aucun vendor lock-in, aucun abonnement obligatoire.' },
  ];
  return (
    <section style={{ padding: pad, background: '#fff', borderTop: '1px solid var(--line-2)', borderBottom: '1px solid var(--line-2)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="k-section-label">
          <span className="k-section-label-sq"></span>
          01 — Ce qui nous distingue
        </div>
        <h2 style={{ fontSize: isMobile ? 30 : 52, marginTop: 16, maxWidth: 900, letterSpacing: '-0.028em', lineHeight: 1.08 }}>
          Trois règles. <span style={{ color: 'var(--muted)' }}>Non-négociables.</span>
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
// SERVICES DETAIL — alternating rows
// ═════════════════════════════════════════════════════════════
function BuildServiceRow({ index, title, tag, description, bullets, Illus, reverse, isMobile }) {
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
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 80% 10%, rgba(139,92,246,.12), transparent 60%)' }}></div>
          <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <Illus />
          </div>
        </div>
      </div>
    </div>
  );
}

function BuildServicesDetail({ isMobile }) {
  const pad = isMobile ? '20px 20px 40px' : '80px 120px 60px';
  const services = [
    {
      tag: 'Landings',
      title: 'Landing pages haute conversion',
      description: 'Des pages taillées pour transformer. Design sur-mesure, copy affûtée, tracking serveur. Conçues pour convertir, pas pour briller en awards.',
      bullets: [
        'Conversion cible : 6 à 12% selon le segment',
        'Copywriting inclus — on ne se contente pas de remplir des blocs',
        'Tracking serveur (Meta CAPI, GA4, PostHog)',
        'A/B testing intégré dès J-1',
      ],
      Illus: IllusLanding,
    },
    {
      tag: 'Funnels',
      title: 'Tunnels multi-étapes pensés pour le lead qualifié',
      description: 'Formulaires progressifs, qualification IA, segmentation dynamique. Le volume ne sert à rien si les SQL ne signent pas.',
      bullets: [
        'Qualification par scoring IA (GPT ou Claude)',
        'Segmentation dynamique selon le parcours',
        'Intégration CRM native (HubSpot, Pipedrive, Attio)',
        'Relances automatisées par email et WhatsApp',
      ],
      Illus: IllusFunnel,
      reverse: true,
    },
    {
      tag: 'SaaS',
      title: 'Plateformes sur-mesure & applications métier',
      description: 'Quand le no-code ne suffit plus. MVP en 4-8 semaines, architecture propre, prête à scaler quand vous levez.',
      bullets: [
        'Auth, BDD, paiements Stripe, tableau admin',
        'Multi-tenants, permissions granulaires, audit log',
        'Déploiement continu sur Vercel / Cloudflare',
        'Tests automatisés & monitoring intégrés',
      ],
      Illus: IllusDash,
    },
    {
      tag: 'Automations',
      title: 'Automatisations no-code + agents IA',
      description: 'Le travail répétitif, on l\'efface. Workflows n8n et Make, agents OpenAI/Claude pour la qualif, l\'extraction et la génération.',
      bullets: [
        'Agents IA sur-mesure (GPT-5, Claude, Gemini)',
        'Orchestration n8n / Make / Temporal',
        'Connecteurs sur-mesure pour vos outils internes',
        'Observability : logs, retries, alerting Slack',
      ],
      Illus: IllusFlow,
      reverse: true,
    },
    {
      tag: 'Analytics',
      title: 'Dashboards & stack de tracking propre',
      description: 'Vous savez d\'où vient chaque lead, combien il coûte, combien il rapporte. Plus d\'à-peu-près.',
      bullets: [
        'Tracking serveur end-to-end',
        'Attribution multi-touch & LTV cohorte',
        'Dashboards Metabase / Retool / sur-mesure',
        'Reporting automatique (Slack, email, Notion)',
      ],
      Illus: IllusCPL,
    },
    {
      tag: 'Migrations',
      title: 'Reprise, refonte & migrations',
      description: 'On ne vous force pas à tout refaire. On audite l\'existant, on migre ce qui doit l\'être, on garde ce qui marche.',
      bullets: [
        'Audit technique & cartographie de l\'existant',
        'Plan de migration par paliers, zéro downtime',
        'Reprise de code hérité (legacy React, WordPress, Webflow)',
        'Documentation complète pour vos équipes',
      ],
      Illus: IllusCurve,
      reverse: true,
    },
  ];
  return (
    <section style={{ padding: pad, background: 'var(--bg)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ padding: isMobile ? '40px 0 20px' : '40px 0 0' }}>
          <div className="k-section-label">
            <span className="k-section-label-sq"></span>
            02 — Capacités Build
          </div>
          <h2 style={{ fontSize: isMobile ? 36 : 64, marginTop: 20, letterSpacing: '-0.035em', maxWidth: 900, lineHeight: 1.02 }}>
            Six choses qu'on fait. <span style={{ color: 'var(--muted)' }}>Bien.</span>
          </h2>
        </div>
        {services.map((s, i) => (
          <BuildServiceRow key={i} index={i} isMobile={isMobile} {...s} />
        ))}
      </div>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════
// STACK — technologies grouped
// ═════════════════════════════════════════════════════════════
function BuildStack({ isMobile }) {
  const pad = isMobile ? '60px 20px' : '120px 120px';
  const groups = [
    {
      name: 'Frontend',
      items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Astro'],
    },
    {
      name: 'Backend & data',
      items: ['Node.js', 'Supabase', 'Prisma', 'PostgreSQL', 'Redis', 'tRPC'],
    },
    {
      name: 'Infra & hosting',
      items: ['Vercel', 'Cloudflare', 'Railway', 'Fly.io', 'AWS', 'Docker'],
    },
    {
      name: 'Automation',
      items: ['n8n', 'Make', 'Zapier', 'Temporal', 'Inngest', 'Trigger.dev'],
    },
    {
      name: 'IA & agents',
      items: ['OpenAI', 'Anthropic Claude', 'LangChain', 'Vercel AI SDK', 'Pinecone', 'LlamaIndex'],
    },
    {
      name: 'Tracking & analytics',
      items: ['GA4', 'PostHog', 'Plausible', 'Mixpanel', 'Segment', 'Stripe'],
    },
  ];
  return (
    <section id="stack" style={{ padding: pad, background: '#fff', borderTop: '1px solid var(--line-2)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="k-section-label">
          <span className="k-section-label-sq"></span>
          03 — Stack technique
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 24, marginTop: 20 }}>
          <h2 style={{ fontSize: isMobile ? 34 : 56, letterSpacing: '-0.035em', maxWidth: 720, lineHeight: 1.04 }}>
            La stack. <span style={{ color: 'var(--muted)' }}>Choisie par contexte, pas par habitude.</span>
          </h2>
          {!isMobile && (
            <p style={{ color: 'var(--muted)', fontSize: 14.5, maxWidth: 320, lineHeight: 1.55 }}>
              On ne vend pas de religion. Chaque techno est évaluée selon votre équipe, votre existant, et votre horizon produit.
            </p>
          )}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? 20 : 28, marginTop: isMobile ? 32 : 48 }}>
          {groups.map((g) => (
            <div key={g.name} style={{
              padding: '24px 24px 28px',
              borderRadius: 14,
              border: '1px solid var(--line-2)',
              background: 'linear-gradient(180deg, #fff 0%, #FBFAFF 100%)',
              transition: 'transform .25s, box-shadow .25s, border-color .25s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 18px 40px -20px rgba(124,58,237,.22)'; e.currentTarget.style.borderColor = 'var(--lav)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.borderColor = 'var(--line-2)'; }}
            >
              <div className="mono" style={{ fontSize: 11, color: 'var(--violet)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                {g.name}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
                {g.items.map((it) => (
                  <span key={it} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '6px 12px', borderRadius: 999,
                    background: '#fff',
                    border: '1px solid var(--line-2)',
                    fontSize: 13, fontWeight: 500, color: 'var(--ink-soft)',
                    letterSpacing: '-0.005em',
                  }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--violet)', boxShadow: '0 0 6px rgba(139,92,246,.5)' }}></span>
                    {it}
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
// PROCESS Build — 4 specific steps
// ═════════════════════════════════════════════════════════════
function BuildProcessStep({ n, title, duration, description, bullets, isMobile, isLast }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'auto 1fr' : '120px 1fr 1fr', gap: isMobile ? 20 : 48, padding: isMobile ? '32px 0' : '48px 0', borderTop: '1px solid var(--line-2)', position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <div style={{
          width: isMobile ? 56 : 88,
          height: isMobile ? 56 : 88,
          borderRadius: '50%',
          background: n === '02'
            ? 'radial-gradient(circle at 35% 30%, #C4B5FD 0%, #8B5CF6 55%, #6D28D9 100%)'
            : 'radial-gradient(circle at 35% 30%, #FAFAFA 0%, #EDE9FE 45%, #C4B5FD 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid rgba(139,92,246,.25)',
          boxShadow: '0 10px 30px -8px rgba(124,58,237,.3), inset 0 1px 0 rgba(255,255,255,.9)',
        }}>
          <span className="mono" style={{ fontSize: isMobile ? 14 : 18, fontWeight: 600, color: n === '02' ? '#fff' : 'var(--violet-deep)', letterSpacing: '0.02em' }}>
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

function BuildProcess({ isMobile }) {
  const pad = isMobile ? '60px 20px' : '120px 120px';
  const steps = [
    { n: '01', title: 'Discovery', duration: '1 semaine', description: 'Audit de l\'existant, cadrage produit, architecture technique. On sait exactement ce qu\'on va construire avant la moindre ligne de code.', bullets: ['Audit technique & UX', 'Brief produit validé', 'Architecture & choix de stack', 'Roadmap détaillée'] },
    { n: '02', title: 'Design', duration: '1 semaine', description: 'Wireframes, maquettes haute fidélité, prototype cliquable. Aucune surprise au launch : vous voyez le produit avant qu\'on le code.', bullets: ['Wireframes & mockups Figma', 'Prototype interactif', 'Design system complet', 'Validation contenu + copy'] },
    { n: '03', title: 'Build', duration: '2 à 4 semaines', description: 'Développement, intégration, QA. Livraison hebdomadaire sur un environnement de staging pour valider en continu.', bullets: ['Code sur votre repo GitHub', 'Staging accessible dès J-3', 'Tests automatisés & QA', 'Reviews hebdomadaires'] },
    { n: '04', title: 'Launch', duration: 'J-Day', description: 'Mise en production, handover technique, formation équipe. Le produit est à vous, vous savez comment il tourne.', bullets: ['Deploy production & monitoring', 'Documentation technique complète', 'Session de formation (1h)', '30 jours de support inclus'] },
  ];
  return (
    <section style={{ padding: pad, background: 'linear-gradient(180deg, #F5F3FF 0%, #FAFAFA 60%, #F5F3FF 100%)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="k-section-label">
          <span className="k-section-label-sq"></span>
          04 — Processus Build
        </div>
        <h2 style={{ fontSize: isMobile ? 36 : 64, marginTop: 20, letterSpacing: '-0.035em', maxWidth: 900, lineHeight: 1.02 }}>
          Du brief au launch. <span style={{ color: 'var(--muted)' }}>En moins de 30 jours.</span>
        </h2>
        <div style={{ marginTop: isMobile ? 32 : 56 }}>
          {steps.map((s, i) => (
            <BuildProcessStep key={s.n} {...s} isMobile={isMobile} isLast={i === steps.length - 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════
// DELIVERABLES
// ═════════════════════════════════════════════════════════════
function BuildDeliverables({ isMobile }) {
  const pad = isMobile ? '60px 20px' : '100px 120px';
  const items = [
    { icon: 'code', title: 'Code source complet', d: 'Sur votre repo GitHub, sous votre compte. Aucune dépendance à Kairn.' },
    { icon: 'doc', title: 'Documentation technique', d: 'README, architecture, conventions, setup local. Un dev tiers peut reprendre en 2h.' },
    { icon: 'training', title: 'Formation équipe', d: 'Session de 1h en visio pour faire le tour de la stack avec vos devs / vos équipes produit.' },
    { icon: 'support', title: '30 jours de support', d: 'Bugs, ajustements, questions techniques. Réponse sous 24h ouvrées.' },
  ];
  const Icon = ({ name }) => {
    const common = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };
    if (name === 'code') return <svg {...common}><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>;
    if (name === 'doc') return <svg {...common}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="8" y1="13" x2="16" y2="13" /><line x1="8" y1="17" x2="16" y2="17" /></svg>;
    if (name === 'training') return <svg {...common}><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c0 1 2 3 6 3s6-2 6-3v-5" /></svg>;
    return <svg {...common}><path d="M12 22s-8-4.5-8-11.8A5 5 0 0 1 12 5a5 5 0 0 1 8 5.2c0 7.3-8 11.8-8 11.8z" /></svg>;
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
            Ce que vous récupérez. <span style={{ color: 'var(--muted)' }}>Tout.</span>
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
// PRICING — 3 tiers
// ═════════════════════════════════════════════════════════════
function BuildPricing({ isMobile }) {
  const pad = isMobile ? '60px 20px' : '120px 120px';
  const tiers = [
    {
      name: 'Landing',
      price: '4 500',
      delay: '2 semaines',
      pitch: 'Une page qui convertit. Pour tester un marché, lancer un produit, ou remplacer une landing qui ne marche plus.',
      features: ['1 landing page haute conversion', 'Copywriting inclus', 'Tracking serveur (Meta, GA4)', 'A/B testing configuré', 'Hébergement 6 mois inclus', '30 jours de support'],
    },
    {
      name: 'Funnel',
      price: '9 500',
      delay: '3-4 semaines',
      pitch: 'Le parcours complet. Landing, formulaire, qualification IA, séquences email, reporting.',
      features: ['Landing + tunnel multi-étapes', 'Qualification IA (GPT/Claude)', 'Intégration CRM + automations', 'Séquences email nurturing', 'Dashboard reporting', 'Tout le pack Landing inclus'],
      highlight: true,
    },
    {
      name: 'Plateforme',
      price: 'Sur devis',
      delay: '6-8 semaines',
      pitch: 'SaaS, marketplace, app métier. Architecture sur-mesure, scalable, prête à lever.',
      features: ['Architecture produit complète', 'Auth + paiements Stripe', 'Tableau admin + multi-tenants', 'Tests automatisés + CI/CD', 'Design system complet', '60 jours de support'],
    },
  ];
  return (
    <section style={{ padding: pad, background: 'var(--bg)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="k-section-label">
          <span className="k-section-label-sq"></span>
          06 — Tarifs
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 24, marginTop: 20 }}>
          <h2 style={{ fontSize: isMobile ? 36 : 64, letterSpacing: '-0.035em', maxWidth: 720, lineHeight: 1.02 }}>
            Trois formats. <span style={{ color: 'var(--muted)' }}>Au forfait. Sans surprise.</span>
          </h2>
          {!isMobile && (
            <p style={{ color: 'var(--muted)', fontSize: 14.5, maxWidth: 320, lineHeight: 1.55 }}>
              Prix fixes, délais contractuels. Ce qui n'est pas dans le scope ne sort pas du budget.
            </p>
          )}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? 16 : 20, marginTop: isMobile ? 32 : 48 }}>
          {tiers.map((t) => (
            <div key={t.name} style={{
              position: 'relative',
              padding: '32px 28px 32px',
              borderRadius: 18,
              background: t.highlight
                ? 'linear-gradient(180deg, #1A1033 0%, #0A0A0A 100%)'
                : '#fff',
              color: t.highlight ? '#fff' : 'var(--ink)',
              border: t.highlight ? '1px solid rgba(139,92,246,.3)' : '1px solid var(--line-2)',
              boxShadow: t.highlight
                ? '0 30px 80px -20px rgba(124,58,237,.45)'
                : '0 2px 0 rgba(10,10,10,.02)',
              overflow: 'hidden',
              transform: t.highlight && !isMobile ? 'translateY(-8px)' : 'none',
            }}>
              {t.highlight && (
                <>
                  <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 80% 0%, rgba(139,92,246,.35), transparent 60%)', pointerEvents: 'none' }}></div>
                  <span style={{ position: 'absolute', top: 20, right: 20, padding: '4px 10px', borderRadius: 999, background: 'rgba(139,92,246,.2)', border: '1px solid rgba(196,181,253,.4)', color: '#C4B5FD', fontSize: 10.5, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: 'Geist Mono, monospace' }}>
                    Populaire
                  </span>
                </>
              )}
              <div style={{ position: 'relative' }}>
                <div className="mono" style={{ fontSize: 11, color: t.highlight ? 'rgba(196,181,253,.8)' : 'var(--violet)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                  {t.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 14 }}>
                  <span className="k-metric-num" style={{
                    fontSize: 48, lineHeight: 1,
                    background: t.highlight
                      ? 'linear-gradient(180deg, #fff, #C4B5FD)'
                      : 'linear-gradient(180deg, #0A0A0A, #2A2340)',
                    WebkitBackgroundClip: 'text', backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    {t.price}
                  </span>
                  {t.price !== 'Sur devis' && (
                    <span style={{ fontSize: 18, fontWeight: 500, color: t.highlight ? 'rgba(255,255,255,.6)' : 'var(--muted)' }}>€ HT</span>
                  )}
                </div>
                <div className="mono" style={{ fontSize: 11.5, color: t.highlight ? 'rgba(255,255,255,.55)' : 'var(--muted)', marginTop: 6 }}>
                  Délai · {t.delay}
                </div>
                <p style={{ fontSize: 14.5, color: t.highlight ? 'rgba(255,255,255,.75)' : 'var(--muted)', marginTop: 20, lineHeight: 1.55, minHeight: 60 }}>
                  {t.pitch}
                </p>
                <div style={{ height: 1, background: t.highlight ? 'rgba(255,255,255,.12)' : 'var(--line-2)', margin: '24px 0 20px' }}></div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {t.features.map((f, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13.5, color: t.highlight ? 'rgba(255,255,255,.85)' : 'var(--ink-soft)', lineHeight: 1.5 }}>
                      <span style={{ flexShrink: 0, width: 14, height: 14, borderRadius: '50%', background: t.highlight ? 'rgba(139,92,246,.3)' : 'rgba(139,92,246,.12)', marginTop: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1.5 4.5 L3 6 L6.5 2" stroke={t.highlight ? '#C4B5FD' : '#8B5CF6'} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  className={`k-cta ${t.highlight ? 'k-cta-violet' : 'k-cta-ghost'}`}
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ marginTop: 28, width: '100%', justifyContent: 'center', borderColor: t.highlight ? 'rgba(255,255,255,.14)' : 'rgba(10,10,10,.15)' }}
                >
                  {t.price === 'Sur devis' ? 'Demander un devis' : 'Démarrer ce format'}
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7 L11 7 M7 3 L11 7 L7 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════
// BUILD PAGE ROOT
// ═════════════════════════════════════════════════════════════
const BUILD_FAQ = [
  { q: 'Quel est le délai moyen de livraison ?', a: 'Entre 2 et 4 semaines pour une landing ou un funnel, 6 à 8 semaines pour une plateforme. On découpe les projets plus longs en paliers livrables de 4 semaines max.' },
  { q: 'À qui appartient le code après la livraison ?', a: '100% à vous. Le repo GitHub est sous votre compte dès J-1. Aucune clause de propriété intellectuelle, aucun lock-in, aucun abonnement obligatoire.' },
  { q: 'Faut-il obligatoirement héberger chez vous ?', a: 'Non. On vous livre le code et la doc de déploiement. Vous hébergez où vous voulez (Vercel, Cloudflare, AWS, votre serveur). On peut gérer l\'infra pour vous si vous préférez, au forfait.' },
  { q: 'Offrez-vous du support après la livraison ?', a: '30 jours de support inclus (bugs, ajustements, questions). Au-delà, on propose un mensuel de maintenance ou d\'évolution à partir de 1 200€/mois, sans engagement.' },
  { q: 'Quelle stack recommandez-vous ?', a: 'Ça dépend de votre contexte. Par défaut : Next.js + Supabase + Tailwind pour du web, n8n ou Make pour de l\'automatisation. Si vous avez déjà une stack, on s\'y adapte.' },
  { q: 'Pouvez-vous reprendre un projet existant ?', a: 'Oui. On commence par un audit technique (2 à 5 jours selon la taille). On identifie ce qui doit être refait, migré, ou conservé, puis on propose un plan de reprise par paliers.' },
];

export default function BuildPage({ variant = 'desktop' }) {
  const isMobile = variant === 'mobile';
  return (
    <div className="kairn">
      <KNav isMobile={isMobile} />
      <BuildHero isMobile={isMobile} />
      <BuildEthos isMobile={isMobile} />
      <BuildServicesDetail isMobile={isMobile} />
      <BuildStack isMobile={isMobile} />
      <BuildProcess isMobile={isMobile} />
      <BuildDeliverables isMobile={isMobile} />
      <KLogos isMobile={isMobile} />
      <KFAQ isMobile={isMobile} items={BUILD_FAQ} sectionNumber="06" />
      <KFinalCTA isMobile={isMobile} />
      <KFooter isMobile={isMobile} />
      {isMobile && (
        <div style={{ position: 'sticky', bottom: 0, padding: '0 0 12px', pointerEvents: 'none' }}>
          <a className="k-mob-cta" href={BOOKING_URL} target="_blank" rel="noopener noreferrer" style={{ pointerEvents: 'auto', textDecoration: 'none' }}>
            <span style={{ fontSize: 14, fontWeight: 500 }}>Démarrer un projet Build.</span>
            <span style={{ fontSize: 13, color: '#C4B5FD', fontWeight: 500 }}>Réserver 30 min →</span>
          </a>
        </div>
      )}
    </div>
  );
}
