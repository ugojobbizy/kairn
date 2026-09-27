import React from 'react';
import { Link } from 'react-router-dom';
import { motion, MotionConfig } from 'framer-motion';
import { Nav, Footer, BookCta, useV2Favicon } from './layout.jsx';
import LivingGradient from './living-gradient.jsx';
import Booking from './booking.jsx';
import { PageVisual, QualVisual, TrackingVisual, CrmVisual, BuildVisual } from './bento-visuals.jsx';
import { EASE, Icon, Pill, Glow, Reveal, BentoGrid, BentoCard, FaqList } from './blocks.jsx';
import { FAQ_WEB } from './faq-data.js';
import WorkGallery from './work-gallery.jsx';
import { CONTACT_EMAIL } from '../config.js';
import './v2.css';

// Page de service « Création de site internet » (/creation-site-internet).
// Délais, propriété du code et déroulé repris de l'ancienne page Build du site ; aucun chiffre nouveau.

const PROOF = [
  ['4 sem.', 'du brief au tunnel complet', 'TradeAuto'],
  ['2 à 4 sem.', 'pour une landing ou un tunnel', 'Délai habituel'],
  ['100 %', 'du code vous appartient', 'Sur votre GitHub'],
];

const PROMISES = [
  { icon: 'calendar', t: 'Livré en semaines, pas en trimestres', d: '2 à 4 semaines pour une landing page ou un tunnel, 6 à 8 semaines pour une plateforme. Les projets plus longs sont découpés en étapes livrables.' },
  { icon: 'code', t: 'Le code vous appartient', d: 'Il est déposé sur votre compte GitHub dès le départ. Vous l’hébergez où vous voulez et le faites modifier par qui vous voulez.' },
  { icon: 'layers', t: 'Des technologies standards', d: 'React, Next.js, Supabase, n8n. Aucun abonnement imposé, aucune dépendance à Kairn : n’importe quel développeur peut reprendre le projet.' },
];


const STEPS = [
  { t: 'Cadrage', d: 'On regarde l’existant, on fixe le périmètre et l’architecture. Vous savez exactement ce qui sera livré, et quand.' },
  { t: 'Maquettes', d: 'Maquettes et textes validés avec vous avant la première ligne de code. Pas de surprise à la mise en ligne.' },
  { t: 'Développement', d: 'Une version de test en ligne mise à jour chaque semaine : vous suivez l’avancement et vous validez au fil de l’eau.' },
  { t: 'Mise en ligne', d: 'Mise en production, documentation, une heure de prise en main avec vos équipes et 30 jours de support inclus.' },
];

export default function WebCreationPage() {
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
              <Reveal y={12}><Pill>Création de site internet</Pill></Reveal>
              <motion.h1 initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}>
                Création de site internet&nbsp;: un site qui <span className="serif grad-text">vous ramène des clients.</span>
              </motion.h1>
              <Reveal delay={0.35} y={16}>
                <p className="hero-lead">
                  Agence web basée à Bordeaux, clients partout en France. Sites, landing pages, tunnels de conversion et <strong>plateformes sur mesure</strong>, développés à la main et livrés en quelques semaines. Le code vous appartient.
                </p>
              </Reveal>
              <Reveal delay={0.5} y={16} className="hero-cta">
                <BookCta>Parler de votre projet</BookCta>
                <span className="hero-meta">30 min · en visio · sans engagement</span>
              </Reveal>
              <Reveal delay={0.65} y={16}>
                <ul className="lg-proof" aria-label="Nos engagements">
                  {PROOF.map(([v, l, c]) => (
                    <li key={l}><b>{v}</b><span>{l}</span><small>{c}</small></li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </section>

          {/* ── Ce qu'on construit ── */}
          <section className="band" id="systeme" style={{ paddingTop: 'var(--band-sm)', paddingBottom: 0 }}>
            <div className="wrap">
              <Reveal className="sec-head">
                <Pill>Ce qu’on construit</Pill>
                <h2 className="h2">Du site vitrine <span className="serif grad-text">à la plateforme sur mesure.</span></h2>
                <p>Un site n’est pas une plaquette en ligne. Chaque page est pensée pour transformer un visiteur en demande, et chaque demande arrive au bon endroit. Besoin d’une page pour vos campagnes ? Voir la <Link to="/creation-landing-page">création de landing page</Link>. Un outil pour suivre vos leads ? Voir le <Link to="/crm-sur-mesure">CRM sur mesure</Link>.</p>
              </Reveal>
              <BentoGrid>
                <BentoCard icon="layout" title="Sites et landing pages" description="Design sur mesure, textes travaillés avec vous, pensés d’abord pour le téléphone."><PageVisual /></BentoCard>
                <BentoCard icon="filter" title="Tunnels de conversion" description="Formulaires en plusieurs étapes qui qualifient le visiteur avant qu’il vous contacte."><QualVisual /></BentoCard>
                <BentoCard span icon="chart" title="Mesure et tableaux de bord" description="Tracking serveur installé dès la mise en ligne : vous savez d’où viennent vos visiteurs et lesquels deviennent clients."><TrackingVisual /></BentoCard>
                <BentoCard span dark icon="users" title="Plateformes et CRM sur mesure" description="Espace client, marketplace, application métier : connexion, base de données, paiements Stripe et back-office, construits autour de votre façon de travailler."><CrmVisual /></BentoCard>
                <BentoCard span icon="code" title="Automatisations" description="Formulaires branchés au CRM, relances par email et WhatsApp, connecteurs vers vos outils avec n8n et Make : le travail répétitif disparaît."><BuildVisual /></BentoCard>
              </BentoGrid>
            </div>
          </section>

          {/* ── Réalisations ── */}
          <section className="band" id="realisations">
            <div className="wrap">
              <Reveal className="sec-head">
                <Pill>Réalisations</Pill>
                <h2 className="h2">Des sites en ligne, <span className="serif grad-text">qui travaillent.</span></h2>
                <p>Chacun de ces sites alimente les campagnes et le CRM du client. Les résultats sont détaillés dans nos cas clients.</p>
              </Reveal>
              <WorkGallery />
              <div className="cases-more">
                <Link to="/realisations" className="btn btn-dark">Voir les cas clients</Link>
              </div>
            </div>
          </section>

          {/* ── Engagements ── */}
          <section className="band" style={{ paddingTop: 0, paddingBottom: 'var(--band-sm)' }}>
            <div className="wrap">
              <Reveal className="sec-head">
                <Pill>Nos engagements</Pill>
                <h2 className="h2">Trois choses <span className="serif grad-text">non négociables.</span></h2>
              </Reveal>
              <div className="lg-pains">
                {PROMISES.map((p, i) => (
                  <Reveal key={p.t} delay={i * 0.08} className="lg-pain">
                    <span className="bcard-ico"><Icon name={p.icon} /></span>
                    <h3>{p.t}</h3>
                    <p>{p.d}</p>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* ── Déroulé ── */}
          <section className="band" id="methode" style={{ background: 'linear-gradient(180deg, transparent, var(--tint) 30%, var(--tint) 70%, transparent)' }}>
            <div className="wrap">
              <Reveal className="sec-head">
                <Pill>Déroulé</Pill>
                <h2 className="h2">Du premier appel <span className="serif grad-text">à la mise en ligne.</span></h2>
              </Reveal>
              <ol className="wb-steps">
                {STEPS.map((s, i) => (
                  <Reveal key={s.t} delay={i * 0.1} as="li" className="wb-step">
                    <span className="wb-num">{String(i + 1).padStart(2, '0')}</span>
                    <h3>{s.t}</h3>
                    <p>{s.d}</p>
                  </Reveal>
                ))}
              </ol>
            </div>
          </section>

          {/* ── FAQ ── */}
          <section className="band" id="faq">
            <div className="wrap faq-grid">
              <Reveal className="faq-aside">
                <Pill>Questions</Pill>
                <h2 className="h2">Création de site&nbsp;: <span className="serif grad-text">vos questions.</span></h2>
                <p>Une question qui n’est pas ici ? Écrivez à <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>, on répond sous 24 h.</p>
              </Reveal>
              <FaqList items={FAQ_WEB} />
            </div>
          </section>

          {/* ── CTA final ── */}
          <section id="contact" style={{ paddingBottom: 'var(--band-sm)' }}>
            <Reveal className="final">
              <Glow />
              <div className="final-inner">
                <Pill>Parlons de votre site</Pill>
                <h2 className="h2">30 minutes pour cadrer <span className="serif">votre projet.</span></h2>
                <p className="final-lead">Vous nous montrez ce que vous avez, ce que vous voulez. On vous dit ce qu’on construirait, en combien de temps.</p>
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
