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
import { FAQ } from './faq-data.js';
import { EASE, Pill, Glow, Reveal, BentoGrid, BentoCard, FaqList } from './blocks.jsx';
import './v2.css';

// Direction « Aurora + Bento » (déclinaison bleue) issue de la base de styles ui-ux-pro-max.
// Hero inspiré de « Agency Hero Section » (21st.dev), grille de « Bento Grid » (21st.dev).
// Chiffres et citations repris tels quels du site en ligne.

// ─ contenu ─
const STATS = [['47+', 'projets livrés'], ['−38 %', 'de CPL en moyenne'], ['18 j', 'de délai moyen de lancement'], ['2,4×', 'plus de leads qu’au départ']];

// ─ page ─

// Titre du hero de la V1, conservé tel quel ; « on la fait tourner » porte l'accent.
const headline = [
  { w: 'On' }, { w: 'construit' }, { w: 'la' }, { w: 'machine.' }, { br: true },
  { w: 'Puis' }, { w: 'on', serif: true }, { w: 'la', serif: true }, { w: 'fait', serif: true }, { w: 'tourner', serif: true },
  { w: 'à' }, { w: 'plein' }, { w: 'régime.' },
];

export default function KairnHomeV2() {
  useV2Favicon();

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
                  Kairn est une agence de <strong>génération de leads</strong>. On construit votre site et votre CRM, on lance vos campagnes Meta et Google, et on baisse votre coût par lead. Le tout sous un seul toit, en moins de 30 jours.
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
              <FaqList items={FAQ} />
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
