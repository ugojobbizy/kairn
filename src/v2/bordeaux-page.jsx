import React from 'react';
import { Link } from 'react-router-dom';
import { motion, MotionConfig } from 'framer-motion';
import { Nav, Footer, BookCta, useV2Favicon } from './layout.jsx';
import LivingGradient from './living-gradient.jsx';
import Booking from './booking.jsx';
import Cases from './cases.jsx';
import { EASE, Icon, Pill, Glow, Reveal, FaqList } from './blocks.jsx';
import { FAQ_BDX } from './faq-data.js';
import { CONTACT_EMAIL } from '../config.js';
import './v2.css';

// Page locale « Agence à Bordeaux » (/agence-bordeaux) : relie la fiche Google au site
// et dit explicitement que Kairn travaille partout en France.

const PROOF = [
  ['Bordeaux', 'là où on est basés', 'Gironde'],
  ['France', 'nos clients, partout', 'Tout en visio'],
  ['4 sem.', 'site, CRM et campagnes livrés', 'TradeAuto, en Suisse'],
];

const WHERE = [
  { t: 'Vous êtes à Bordeaux ou en Gironde', d: 'Une agence dans votre ville, qui répond sous 24 h et fait tout sous un seul toit : le site, les campagnes et le CRM.' },
  { t: 'Vous êtes ailleurs en France', d: 'Tout se fait en visio : cadrage, validation des maquettes, points réguliers. La distance ne change ni le délai ni la méthode. Nos clients sont partout en France, et jusqu’en Suisse.', on: true },
];

const SERVICES = [
  { to: '/generation-de-leads', icon: 'megaphone', t: 'Génération de leads', d: 'Campagnes Meta et Google Ads, landing page, qualification et CRM : des demandes suivies jusqu’à la vente.' },
  { to: '/creation-site-internet', icon: 'code', t: 'Création de site internet', d: 'Sites, tunnels de conversion et plateformes sur mesure, livrés en quelques semaines.' },
  { to: '/creation-landing-page', icon: 'layout', t: 'Création de landing page', d: 'Une page par offre, pensée pour vos campagnes, livrée en deux semaines.' },
  { to: '/crm-sur-mesure', icon: 'users', t: 'CRM sur mesure', d: 'Pipeline à vos étapes, attribution des leads à leurs campagnes, relances automatiques.' },
];

export default function BordeauxPage() {
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
              <Reveal y={12}><Pill>Agence à Bordeaux · Projets partout en France</Pill></Reveal>
              <motion.h1 className="bdx-h1" initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}>
                Agence web et génération de leads à Bordeaux, <span className="serif grad-text">pour des projets partout en France.</span>
              </motion.h1>
              <Reveal delay={0.35} y={16}>
                <p className="hero-lead">
                  Kairn est basée à Bordeaux. On crée vos sites, landing pages et CRM, et on lance vos campagnes Meta et Google Ads, pour les entreprises bordelaises comme pour des <strong>projets partout en France</strong>.
                </p>
              </Reveal>
              <Reveal delay={0.5} y={16} className="hero-cta">
                <BookCta>Prendre un RDV découverte</BookCta>
                <span className="hero-meta">30 min · en visio · où que vous soyez</span>
              </Reveal>
              <Reveal delay={0.65} y={16}>
                <ul className="lg-proof bdx-proof" aria-label="Où nous travaillons">
                  {PROOF.map(([v, l, c]) => (
                    <li key={v}><b>{v}</b><span>{l}</span><small>{c}</small></li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </section>

          {/* ── Bordeaux ou ailleurs ── */}
          <section className="band" style={{ paddingTop: 'var(--band-sm)', paddingBottom: 'var(--band-sm)' }}>
            <div className="wrap">
              <Reveal className="sec-head">
                <Pill>Bordeaux ou ailleurs</Pill>
                <h2 className="h2">Basés à Bordeaux. <span className="serif grad-text">Au travail partout en France.</span></h2>
                <p>Que votre entreprise soit à Mérignac, à Lyon ou à Lille, la méthode est la même et l’équipe aussi.</p>
              </Reveal>
              <div className="lp-compare">
                {WHERE.map((c, i) => (
                  <Reveal key={c.t} delay={i * 0.08} className={`lp-col${c.on ? ' is-on' : ''}`}>
                    <h3>{c.t}</h3>
                    <p>{c.d}</p>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* ── Services ── */}
          <section className="band" id="systeme" style={{ paddingTop: 0 }}>
            <div className="wrap">
              <Reveal className="sec-head">
                <Pill>Ce qu’on fait</Pill>
                <h2 className="h2">Quatre métiers, <span className="serif grad-text">une seule équipe.</span></h2>
                <p>Chaque projet peut commencer par l’un d’eux. La plupart finissent par les relier.</p>
              </Reveal>
              <div className="bdx-services">
                {SERVICES.map((s, i) => (
                  <Reveal key={s.to} delay={i * 0.08}>
                    <Link to={s.to} className="bdx-service">
                      <span className="bcard-ico"><Icon name={s.icon} /></span>
                      <h3>{s.t}</h3>
                      <p>{s.d}</p>
                      <span className="bdx-more">En savoir plus <Icon name="arrow" size={16} stroke={2} /></span>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* ── Résultats ── */}
          <section className="band dark" id="resultats">
            <Glow />
            <div className="wrap">
              <Reveal className="sec-head">
                <Pill>Résultats</Pill>
                <h2 className="h2">Ce qu’on a livré. <span className="serif grad-text">Et ce que ça a rapporté.</span></h2>
                <p>Des chiffres relevés chez nos clients, en France et en Suisse.</p>
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
                <h2 className="h2">Travailler avec nous, <span className="serif grad-text">d’où que vous soyez.</span></h2>
                <p>Une question qui n’est pas ici ? Écrivez à <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>, on répond sous 24 h.</p>
              </Reveal>
              <FaqList items={FAQ_BDX} />
            </div>
          </section>

          {/* ── CTA final ── */}
          <section id="contact" style={{ paddingBottom: 'var(--band-sm)' }}>
            <Reveal className="final">
              <Glow />
              <div className="final-inner">
                <Pill>Bordeaux ou ailleurs</Pill>
                <h2 className="h2">30 minutes pour savoir si on peut <span className="serif">vous aider.</span></h2>
                <p className="final-lead">En visio, où que vous soyez. On regarde votre offre, vos chiffres actuels, et on vous dit franchement ce qu’on ferait.</p>
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
