import React from 'react';
import { Link } from 'react-router-dom';
import { motion, MotionConfig } from 'framer-motion';
import { Nav, Footer, BookCta, useV2Favicon } from './layout.jsx';
import LivingGradient from './living-gradient.jsx';
import Booking from './booking.jsx';
import { QualVisual, TrackingVisual, ReportVisual, BuildVisual, CrmVisual } from './bento-visuals.jsx';
import { EASE, Icon, Pill, Glow, Reveal, BentoGrid, BentoCard, FaqList } from './blocks.jsx';
import { FAQ_CRM } from './faq-data.js';
import { CONTACT_EMAIL } from '../config.js';
import './v2.css';

// Page de service « CRM et outils sur mesure » (/crm-sur-mesure).
// Chiffres et citation repris des cas clients déjà publiés (TradeAuto, Isolation d'Aquitaine, Madame la Gouvernante).
// Capture : tableau de bord TradeAuto (aucune donnée personnelle).

const PROOF = [
  ['323', 'leads suivis dans le CRM', 'Isolation d’Aquitaine'],
  ['150+', 'missions pilotées chaque semaine', 'Madame la Gouvernante'],
  ['4 sem.', 'site, CRM et tableau de bord', 'TradeAuto'],
];

const WHY = [
  { icon: 'layers', t: 'Votre façon de vendre, pas celle du logiciel', d: 'Les étapes du pipeline, les champs de la fiche et les relances suivent votre métier. Pas l’inverse.' },
  { icon: 'chart', t: 'Le coût de chaque lead, et de chaque vente', d: 'Le CRM connaît la campagne, l’annonce et la dépense publicitaire. Vous voyez ce qu’a coûté un client signé.' },
  { icon: 'code', t: 'Pas d’abonnement par utilisateur', d: 'Le code vous appartient. Ajouter un commercial ne change rien à la facture, et personne ne peut vous couper l’accès.' },
];

const STEPS = [
  { t: 'Cartographie', d: 'On suit un lead de la pub à la signature : chaque étape, chaque outil, chaque personne qui intervient.' },
  { t: 'Maquettes', d: 'Écrans du pipeline, de la fiche lead et du tableau de bord validés avec vous et vos commerciaux.' },
  { t: 'Développement', d: 'Une version de test en ligne mise à jour chaque semaine, branchée sur vos formulaires et vos campagnes.' },
  { t: 'Mise en service', d: 'Mise en production, une heure de prise en main avec l’équipe et 30 jours de support inclus.' },
];

export default function CrmPage() {
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
              <Reveal y={12}><Pill>CRM et outils sur mesure</Pill></Reveal>
              <motion.h1 initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}>
                CRM sur mesure&nbsp;: chaque lead suivi <span className="serif grad-text">jusqu’à la signature.</span>
              </motion.h1>
              <Reveal delay={0.35} y={16}>
                <p className="hero-lead">
                  On construit le CRM et les outils commerciaux autour de votre façon de vendre&nbsp;: pipeline, <strong>attribution de chaque lead à sa campagne</strong>, relances automatiques, tableau de bord. Basés à Bordeaux, clients partout en France. Le code vous appartient.
                </p>
              </Reveal>
              <Reveal delay={0.5} y={16} className="hero-cta">
                <BookCta>Parler de votre CRM</BookCta>
                <span className="hero-meta">30 min · en visio · sans engagement</span>
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

          {/* ── Pourquoi sur mesure ── */}
          <section className="band" style={{ paddingTop: 'var(--band-sm)', paddingBottom: 'var(--band-sm)' }}>
            <div className="wrap">
              <Reveal className="sec-head">
                <Pill>Pourquoi sur mesure</Pill>
                <h2 className="h2">Un CRM du marché range vos contacts. <span className="serif grad-text">Le vôtre vous dit quoi faire.</span></h2>
                <p>HubSpot ou Pipedrive font très bien le travail standard. Dès que vous voulez relier une vente à la pub qui l’a amenée, ou suivre un métier qui ne rentre pas dans leurs cases, le sur mesure devient la solution la plus simple.</p>
              </Reveal>
              <div className="lg-pains">
                {WHY.map((p, i) => (
                  <Reveal key={p.t} delay={i * 0.08} className="lg-pain">
                    <span className="bcard-ico"><Icon name={p.icon} /></span>
                    <h3>{p.t}</h3>
                    <p>{p.d}</p>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* ── Ce qu'on construit ── */}
          <section className="band" id="systeme" style={{ paddingTop: 0, paddingBottom: 0 }}>
            <div className="wrap">
              <Reveal className="sec-head">
                <Pill>Ce qu’on construit</Pill>
                <h2 className="h2">Du formulaire <span className="serif grad-text">au client signé.</span></h2>
                <p>Un seul outil pour suivre les leads, relancer au bon moment et savoir ce qui rapporte. Les leads viennent de vos <Link to="/creation-landing-page">landing pages</Link> et de vos <Link to="/generation-de-leads">campagnes</Link>.</p>
              </Reveal>
              <BentoGrid>
                <BentoCard span dark icon="users" title="Un pipeline à vos étapes" description="Nouveau, contacté, rendez-vous, offre, signé : chaque lead avance d’une colonne à l’autre, avec sa source exacte."><CrmVisual /></BentoCard>
                <BentoCard icon="filter" title="Des fiches lead complètes" description="Le projet, le besoin, le délai : vos commerciaux savent qui rappeler en premier."><QualVisual /></BentoCard>
                <BentoCard icon="calendar" title="Un reporting qui arrive seul" description="Leads, coût et signatures envoyés chaque semaine, sans ouvrir l’outil."><ReportVisual /></BentoCard>
                <BentoCard span icon="chart" title="Un tableau de bord en temps réel" description="Leads reçus, ventes, coût par lead et coût par vente, calculés avec les dépenses publicitaires synchronisées chaque jour."><TrackingVisual /></BentoCard>
                <BentoCard span icon="code" title="Relances et automatisations" description="Relances par email et WhatsApp, notifications à l’équipe, connecteurs vers vos outils avec n8n et Make. Déjà sur HubSpot, Pipedrive ou Attio ? On s’y branche."><BuildVisual /></BentoCard>
              </BentoGrid>
            </div>
          </section>

          {/* ── Cas TradeAuto ── */}
          <section className="band ia" id="tradeauto">
            <div className="wrap">
              <div className="ia-top">
                <div>
                  <Pill>Cas client · CRM sur mesure</Pill>
                  <img className="ia-logo crm-logo" src="/tradeauto-logo.png" alt="TradeAuto" width="56" height="56" />
                  <h2 className="h2">Site, CRM et tableau de bord <span className="serif grad-text">en 4 semaines.</span></h2>
                  <p className="ia-lead">
                    TradeAuto rachète des véhicules en Suisse. Ses leads arrivaient par des formulaires, des emails et WhatsApp, sans vision du coût réel d’acquisition. On a livré le site, le CRM, le tableau de bord et les campagnes Meta et Google, avec un tracking serveur de bout en bout.
                  </p>
                </div>
                <div className="ia-kpis">
                  <div><b>−64 %</b><span>de coût par lead, de 27,40 CHF à 10 CHF</span></div>
                  <div><b>86</b><span>leads ultra-qualifiés en un mois (avril 2026)</span></div>
                  <div><b>4 sem.</b><span>du brief au tunnel complet</span></div>
                </div>
              </div>
              <Reveal as="figure" className="ia-shot crm-shot">
                <div className="shot-bar" aria-hidden="true"><span className="shot-dots"><i /><i /><i /></span><span className="shot-url">Tableau de bord TradeAuto</span></div>
                <img src="/v2/tradeauto-dashboard.jpg" width="1600" height="668" loading="lazy" decoding="async"
                  alt="Tableau de bord du CRM TradeAuto : volume de leads par jour, 86 leads reçus en avril, 6 ventes, coût par lead Meta Ads de 10 CHF." />
              </Reveal>
              <Reveal as="figure" className="crm-quote">
                <blockquote>« Site, CRM, dashboard, Meta + Google Ads : tout livré par la même équipe en 4 semaines. Je recommande les yeux fermés. »</blockquote>
                <figcaption>Louis · Fondateur, TRADEAUTO.CH</figcaption>
              </Reveal>
              <div className="cases-more">
                <Link to="/realisations" className="btn btn-dark">Voir tous les cas clients</Link>
              </div>
            </div>
          </section>

          {/* ── Déroulé ── */}
          <section className="band" id="methode" style={{ background: 'linear-gradient(180deg, transparent, var(--tint) 30%, var(--tint) 70%, transparent)' }}>
            <div className="wrap">
              <Reveal className="sec-head">
                <Pill>Déroulé</Pill>
                <h2 className="h2">Construit avec <span className="serif grad-text">ceux qui vont s’en servir.</span></h2>
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
                <h2 className="h2">CRM sur mesure&nbsp;: <span className="serif grad-text">vos questions.</span></h2>
                <p>Une question qui n’est pas ici ? Écrivez à <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>, on répond sous 24 h.</p>
              </Reveal>
              <FaqList items={FAQ_CRM} />
            </div>
          </section>

          {/* ── CTA final ── */}
          <section id="contact" style={{ paddingBottom: 'var(--band-sm)' }}>
            <Reveal className="final">
              <Glow />
              <div className="final-inner">
                <Pill>Parlons de votre CRM</Pill>
                <h2 className="h2">30 minutes pour voir <span className="serif">où se perdent vos leads.</span></h2>
                <p className="final-lead">Racontez-nous comment un lead arrive et comment il devient client. On vous dit ce qu’on automatiserait, et ce qu’on laisserait tel quel.</p>
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
