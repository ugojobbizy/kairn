import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, MotionConfig } from 'framer-motion';
import Cases from './cases.jsx';
import { Nav, Footer, BookCta, useV2Favicon } from './layout.jsx';
import LivingGradient from './living-gradient.jsx';
import Booking from './booking.jsx';
import Method from './method.jsx';
import HeroDuo from './hero-duo.jsx';
import { AdsVisual, PageVisual, QualVisual, TrackingVisual, CplVisual, ReportVisual, BuildVisual, CrmVisual } from './bento-visuals.jsx';
import { CONTACT_EMAIL } from '../config.js';
import './v2.css';

// Direction « Aurora + Bento » (déclinaison bleue) issue de la base de styles ui-ux-pro-max.
// Hero inspiré de « Agency Hero Section » (21st.dev), grille de « Bento Grid » (21st.dev).
// Chiffres et citations repris tels quels du site en ligne.

const EASE = [0.22, 0.8, 0.24, 1];

// ─ icônes (tracés type Lucide) ─
const ICONS = {
  arrow: <path d="M7 17 17 7M8 7h9v9" />,
  megaphone: <><path d="m3 11 18-5v12L3 14v-3z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" /></>,
  layout: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></>,
  filter: <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />,
  chart: <><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" /></>,
  down: <><path d="m22 17-8.5-8.5-5 5L2 7" /><path d="M16 17h6v-6" /></>,
  calendar: <><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>,
  code: <><path d="m16 18 6-6-6-6" /><path d="m8 6-6 6 6 6" /></>,
  layers: <><path d="m12 2 10 5-10 5L2 7l10-5z" /><path d="m2 17 10 5 10-5" /><path d="m2 12 10 5 10-5" /></>,
  check: <path d="M20 6 9 17l-5-5" />,
  plus: <path d="M12 5v14M5 12h14" />,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
  bolt: <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />,
};

function Icon({ name, size = 20, stroke = 1.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}


function Pill({ children }) {
  return <span className="pill"><span className="pill-dot"><i /></span>{children}</span>;
}

// Fond sombre à deux halos (indigo en haut à gauche, bleu nuit en bas à droite),
// reproduit d'après l'aperçu du composant 21st.dev « LivingOrigami bg ».
function Glow() {
  return <div className="glow-bg" aria-hidden="true" />;
}

// Apparition au scroll
function Reveal({ children, delay = 0, y = 24, className, as = 'div' }) {
  const M = motion[as];
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </M>
  );
}

// ─ Bento (adapté de 21st.dev « Bento Grid ») ─
const gridVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const cardVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: EASE } },
};

function BentoGrid({ children }) {
  return (
    <motion.div className="bento" variants={gridVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}>
      {children}
    </motion.div>
  );
}

function BentoCard({ title, description, icon, span, dark, children }) {
  return (
    <motion.article variants={cardVariants} className={`bcard${span ? ' span-2' : ''}${dark ? ' is-dark' : ''}`}>
      <div className="bcard-visual" aria-hidden="true">{children}</div>
      <div className="bcard-body">
        <div className="bcard-title">
          <span className="bcard-ico"><Icon name={icon} /></span>
          <h3>{title}</h3>
        </div>
        <p>{description}</p>
      </div>
    </motion.article>
  );
}

// ─ contenu ─
const STATS = [['47+', 'projets livrés'], ['−38 %', 'de CPL en moyenne'], ['18 j', 'de délai moyen de lancement'], ['2,4×', 'plus de leads qu’au départ']];

const FAQ = [
  ['Quel est votre délai de démarrage ?', 'Sous 5 jours ouvrés après l’appel de cadrage. Les campagnes peuvent démarrer en 48 h si le tracking est déjà en place.'],
  ['Faut-il forcément refaire mon site ?', 'Non. On regarde d’abord ce qui existe. Si votre page convertit, on branche les campagnes dessus. Sinon, on construit une landing dédiée à l’offre, sans toucher au reste du site.'],
  ['Travaillez-vous avec un engagement minimum ?', 'Non. La mise en place est au forfait, l’acquisition au mois reconductible. Vous pouvez partir à tout moment avec un préavis de 30 jours.'],
  ['Garantie de résultat ?', 'On s’engage sur des fourchettes chiffrées à l’audit, pas sur des promesses marketing. Si les objectifs ne sont pas atteints à 90 jours, on ajuste le plan à nos frais.'],
  ['Quels outils utilisez-vous ?', 'Côté acquisition : Meta, Google, LinkedIn, TikTok. Côté build : React, Next.js, Supabase, n8n, Make. On choisit selon votre contexte, pas selon nos habitudes.'],
];

// ─ page ─

// Titre du hero de la V1, conservé tel quel ; « on la fait tourner » porte l'accent.
const headline = [
  { w: 'On' }, { w: 'construit' }, { w: 'la' }, { w: 'machine.' }, { br: true },
  { w: 'Puis' }, { w: 'on', serif: true }, { w: 'la', serif: true }, { w: 'fait', serif: true }, { w: 'tourner', serif: true },
  { w: 'à' }, { w: 'plein' }, { w: 'régime.' },
];

export default function KairnHomeV2() {
  useV2Favicon();
  useEffect(() => {
    const prev = document.title;
    document.title = 'Kairn · Création web & génération de leads';
    return () => { document.title = prev; };
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="v2">
        <a href="#contenu" className="skip">Aller au contenu</a>
        <Nav />

        <main id="contenu">
          {/* ── Hero ── */}
          <section className="hero is-dark">
            <Glow />
            <LivingGradient />
            <div className="wrap hero-inner">
              <Reveal y={12}><Pill>Création web &amp; génération de leads</Pill></Reveal>

              <h1>
                {headline.map((x, i) => x.br ? <br key={i} className="hero-br" /> : (
                  <React.Fragment key={i}>
                    <motion.span
                      style={{ display: 'inline-block' }}
                      className={x.serif ? 'serif grad-text' : undefined}
                      initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      transition={{ duration: 0.8, ease: EASE, delay: 0.1 + i * 0.07 }}
                    >
                      {x.w}
                    </motion.span>
                    {i < headline.length - 1 && ' '}
                  </React.Fragment>
                ))}
              </h1>

              <Reveal delay={0.55} y={16}>
                <p className="hero-lead">
                  Kairn est une agence <strong>Build &amp; Ads</strong>. On conçoit vos funnels, on déploie vos campagnes, on optimise vos CPL, le tout sous un seul toit, en moins de 30 jours.
                </p>
              </Reveal>

              <Reveal delay={0.7} y={16} className="hero-cta">
                <BookCta>Prendre un RDV découverte</BookCta>
                <span className="hero-meta">30 min · en visio · audit gratuit</span>
              </Reveal>

              <motion.div className="stage" initial={{ opacity: 0, y: 60, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1.1, ease: EASE, delay: 0.85 }}>
                <div className="stage-glow" aria-hidden="true" />
                <HeroDuo />
              </motion.div>
            </div>

          </section>

          {/* ── Système (bento) ── */}
          <section className="band" id="systeme" style={{ paddingTop: 'var(--band-sm)' }}>
            <div className="wrap">
              <Reveal className="sec-head">
                <Pill>Le système</Pill>
                <h2 className="h2">Tout ce qu’il faut pour <span className="serif grad-text">remplir</span> votre agenda.</h2>
                <p>Pas une campagne isolée : une chaîne complète, de la publicité à la signature, tenue par la même équipe.</p>
              </Reveal>

              <BentoGrid>
                <BentoCard span icon="megaphone" title="Campagnes Meta & Google Ads" description="Créas, ciblage et tracking audités avant la moindre dépense. On teste, on coupe ce qui ne marche pas."><AdsVisual /></BentoCard>
                <BentoCard icon="layout" title="Landing page de conversion" description="Une page par offre, formulaire court, mobile first."><PageVisual /></BentoCard>
                <BentoCard icon="filter" title="Qualification du lead" description="Vos commerciaux reçoivent un dossier, pas un numéro."><QualVisual /></BentoCard>
                <BentoCard span icon="chart" title="Tracking et tableau de bord" description="D’où vient chaque lead, ce qu’il a coûté, s’il a signé. En temps réel."><TrackingVisual /></BentoCard>
                <BentoCard icon="down" title="Optimisation du CPL" description="On baisse le coût, puis on augmente le budget. Dans cet ordre."><CplVisual /></BentoCard>
                <BentoCard icon="calendar" title="Reporting chaque lundi" description="Leads, coût, signatures. Sans jargon."><ReportVisual /></BentoCard>
                <BentoCard span dark icon="users" title="Un CRM sur mesure pour l’attribution" description="Chaque lead arrive avec sa source exacte : campagne, créa, mot-clé. Vous voyez quelle pub fait signer, pas seulement celle qui fait cliquer."><CrmVisual /></BentoCard>
                <BentoCard span icon="code" title="Et si l’outil manque, on le construit" description="Formulaires branchés au CRM, relances automatiques, automatisations n8n et Make : la même équipe développe ce que l’acquisition exige."><BuildVisual /></BentoCard>
              </BentoGrid>

              <div className="stats">
                {STATS.map(([v, l], i) => (
                  <Reveal key={l} delay={i * 0.08} className="stat"><b>{v}</b><span>{l}</span></Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* ── Méthode ── */}
          <section className="band" id="methode" style={{ background: 'linear-gradient(180deg, transparent, var(--tint) 30%, var(--tint) 70%, transparent)' }}>
            <div className="wrap">
              <Reveal className="sec-head">
                <Pill>Méthode</Pill>
                <h2 className="h2">Quatre étapes. <span className="serif grad-text">Rien de plus.</span></h2>
                <p>On refuse les projets qui n’entrent pas dans ce cadre. C’est ce qui nous permet de tenir les délais.</p>
              </Reveal>
              <Method />
            </div>
          </section>

          {/* ── Résultats ── */}
          <section className="band dark" id="resultats">
            <Glow />
            <div className="wrap">
              <Reveal className="sec-head">
                <Pill>Résultats</Pill>
                <h2 className="h2">Ce qu’on a livré. <span className="serif grad-text">Et ce que ça a rapporté.</span></h2>
                <p>Des chiffres relevés chez nos clients, pas des promesses.</p>
              </Reveal>
              <Cases />
              <div className="cases-more">
                <Link to="/realisations" className="btn btn-light">Toutes les réalisations</Link>
              </div>
            </div>
          </section>

          {/* ── FAQ ── */}
          <section className="band" id="faq">
            <div className="wrap faq-grid">
              <Reveal className="faq-aside">
                <Pill>Questions</Pill>
                <h2 className="h2">Les questions <span className="serif grad-text">qu’on nous pose.</span></h2>
                <p>Une question qui n’est pas ici ? Écrivez à <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>, on répond sous 24 h.</p>
              </Reveal>
              <div className="faq">
                {FAQ.map(([q, a], i) => (
                  <Reveal key={q} delay={i * 0.06}>
                    <details>
                      <summary>{q}<span className="plus"><Icon name="plus" size={16} stroke={2.2} /></span></summary>
                      <p>{a}</p>
                    </details>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* ── CTA final ── */}
          <section id="contact" style={{ paddingBottom: 'var(--band-sm)' }}>
            <Reveal className="final">
              <Glow />
              <div className="final-inner">
                <Pill>Parlons de vos leads</Pill>
                <h2 className="h2">30 minutes pour savoir si on peut <span className="serif">vous aider.</span></h2>
                <p className="final-lead">Pas de pitch commercial. On regarde votre offre, vos chiffres actuels, et on vous dit franchement ce qu’on ferait.</p>
                <p className="final-free" id="reserver">Offert et sans engagement</p>
                <Booking />
              </div>
            </Reveal>
          </section>
        </main>

        <Footer />

        <div className="mob-cta"><BookCta>Réserver 30 min</BookCta></div>
      </div>
    </MotionConfig>
  );
}
