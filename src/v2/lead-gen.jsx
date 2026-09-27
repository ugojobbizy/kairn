import React from 'react';
import { Link } from 'react-router-dom';
import { motion, MotionConfig } from 'framer-motion';
import { Nav, Footer, BookCta, useV2Favicon } from './layout.jsx';
import LivingGradient from './living-gradient.jsx';
import Booking from './booking.jsx';
import Method from './method.jsx';
import FeaturedIsolation from './featured-isolation.jsx';
import { AdsVisual, PageVisual, QualVisual, TrackingVisual, CrmVisual } from './bento-visuals.jsx';
import { EASE, Icon, Pill, Glow, Reveal, BentoGrid, BentoCard, FaqList } from './blocks.jsx';
import { FAQ_LEADS } from './faq-data.js';
import { CONTACT_EMAIL } from '../config.js';
import './v2.css';

// Page de service « Génération de leads » (/generation-de-leads).
// Chiffres repris des cas clients déjà publiés sur le site ; aucun chiffre nouveau.

const PROOF = [
  ['−72 %', 'de coût par lead', 'Isolation d’Aquitaine'],
  ['86', 'leads en un mois', 'TradeAuto'],
  ['−46 %', 'de coût par lead', 'Rénovia'],
];

const PAINS = [
  { icon: 'chart', t: 'Des budgets sans retour mesurable', d: 'La pub tourne, des demandes arrivent, mais personne ne sait quelle campagne a fait signer. On coupe au hasard, on augmente au hasard.' },
  { icon: 'users', t: 'Des leads tièdes', d: 'Un nom et un numéro, sans projet ni délai. Vos commerciaux passent leurs journées à rappeler des gens qui ne décrochent pas.' },
  { icon: 'layers', t: 'Des outils qui ne se parlent pas', d: 'Formulaires, emails, WhatsApp, tableurs : les leads se perdent entre deux outils, et les relances avec eux.' },
];

export default function LeadGenPage() {
  useV2Favicon();

  return (
    <MotionConfig reducedMotion="user">
      <div className="v2 lg">
        <a href="#contenu" className="skip">Aller au contenu</a>
        <Nav />

        <main id="contenu">
          {/* ── Hero ── */}
          <section className="hero is-dark lg-hero">
            <Glow />
            <LivingGradient />
            <div className="wrap hero-inner">
              <Reveal y={12}><Pill>Agence de génération de leads</Pill></Reveal>
              <motion.h1 initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}>
                Génération de leads&nbsp;: des demandes qualifiées, <span className="serif grad-text">pas des clics.</span>
              </motion.h1>
              <Reveal delay={0.35} y={16}>
                <p className="hero-lead">
                  Agence basée à Bordeaux, clients partout en France. Campagnes Meta et Google Ads, landing page, qualification et <strong>CRM sur mesure</strong> : chaque lead est relié à la pub qui l’a amené et à la vente qu’il a rapportée.
                </p>
              </Reveal>
              <Reveal delay={0.5} y={16} className="hero-cta">
                <BookCta>Prendre un RDV découverte</BookCta>
                <span className="hero-meta">30 min · en visio · audit gratuit</span>
              </Reveal>
              <Reveal delay={0.65} y={16}>
                <ul className="lg-proof" aria-label="Résultats de nos clients">
                  {PROOF.map(([v, l, c]) => (
                    <li key={c}><b>{v}</b><span>{l}</span><small>{c}</small></li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </section>

          {/* ── Le problème ── */}
          <section className="band" style={{ paddingTop: 'var(--band-sm)', paddingBottom: 'var(--band-sm)' }}>
            <div className="wrap">
              <Reveal className="sec-head">
                <Pill>Pourquoi ça coince</Pill>
                <h2 className="h2">Le problème n’est pas le volume. <span className="serif grad-text">C’est ce qu’on ne voit pas.</span></h2>
                <p>La plupart des entreprises qui nous appellent ont déjà essayé la pub. Elles ont eu des leads. Elles n’ont pas eu de visibilité.</p>
              </Reveal>
              <div className="lg-pains">
                {PAINS.map((p, i) => (
                  <Reveal key={p.t} delay={i * 0.08} className="lg-pain">
                    <span className="bcard-ico"><Icon name={p.icon} /></span>
                    <h3>{p.t}</h3>
                    <p>{p.d}</p>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* ── Ce qu'on met en place ── */}
          <section className="band" id="systeme" style={{ paddingTop: 0, paddingBottom: 0 }}>
            <div className="wrap">
              <Reveal className="sec-head">
                <Pill>Ce qu’on met en place</Pill>
                <h2 className="h2">Une chaîne complète, <span className="serif grad-text">de la pub à la signature.</span></h2>
                <p>Chaque maillon est construit pour le suivant. C’est ce qui permet de baisser le coût par lead sans perdre en qualité.</p>
              </Reveal>
              <BentoGrid>
                <BentoCard span icon="megaphone" title="Campagnes Meta Ads et Google Ads" description="Google capte ceux qui cherchent déjà votre service, Meta va chercher ceux qui ne cherchent pas encore. Plusieurs créas testées en parallèle, on garde celles qui font signer."><AdsVisual /></BentoCard>
                <BentoCard icon="layout" title="Une landing page par offre" description="Un seul message, un formulaire court, pensée d’abord pour le téléphone."><PageVisual /></BentoCard>
                <BentoCard icon="filter" title="Des leads qualifiés à l’entrée" description="Les bonnes questions dans le formulaire : vos commerciaux savent qui rappeler en premier."><QualVisual /></BentoCard>
                <BentoCard span dark icon="users" title="Un CRM sur mesure, avec l’attribution" description="Chaque lead arrive avec sa campagne, son annonce et son coût. Vous voyez quelle pub fait signer, pas seulement celle qui fait cliquer."><CrmVisual /></BentoCard>
                <BentoCard span icon="chart" title="Tracking serveur et tableau de bord" description="Les conversions remontent aux plateformes même quand le navigateur bloque les cookies. Les algorithmes optimisent sur de vrais leads."><TrackingVisual /></BentoCard>
              </BentoGrid>
            </div>
          </section>

          {/* ── Cas client ── */}
          <FeaturedIsolation label="Cas client · Génération de leads">
            <div className="cases-more">
              <Link to="/realisations" className="btn btn-dark">Voir tous les cas clients</Link>
            </div>
          </FeaturedIsolation>

          {/* ── Méthode ── */}
          <section className="band" id="methode" style={{ background: 'linear-gradient(180deg, transparent, var(--tint) 30%, var(--tint) 70%, transparent)' }}>
            <div className="wrap">
              <Reveal className="sec-head">
                <Pill>Comment on travaille</Pill>
                <h2 className="h2">Quatre étapes. <span className="serif grad-text">Rien de plus.</span></h2>
                <p>Audit, mise en place, lancement, optimisation. On baisse le coût par lead d’abord, on augmente le budget ensuite.</p>
              </Reveal>
              <Method />
            </div>
          </section>

          {/* ── FAQ ── */}
          <section className="band" id="faq">
            <div className="wrap faq-grid">
              <Reveal className="faq-aside">
                <Pill>Questions</Pill>
                <h2 className="h2">Génération de leads : <span className="serif grad-text">vos questions.</span></h2>
                <p>Une question qui n’est pas ici ? Écrivez à <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>, on répond sous 24 h.</p>
              </Reveal>
              <FaqList items={FAQ_LEADS} />
            </div>
          </section>

          {/* ── CTA final ── */}
          <section id="contact" style={{ paddingBottom: 'var(--band-sm)' }}>
            <Reveal className="final">
              <Glow />
              <div className="final-inner">
                <Pill>Parlons de vos leads</Pill>
                <h2 className="h2">30 minutes pour savoir si on peut <span className="serif">vous aider.</span></h2>
                <p className="final-lead">On regarde votre offre, vos chiffres actuels et vos campagnes, et on vous dit franchement ce qu’on ferait.</p>
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
