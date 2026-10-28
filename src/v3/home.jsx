import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, MotionConfig } from 'framer-motion';
import { Nav, Footer, useV2Favicon } from '../v2/layout.jsx';
import Booking from '../v2/booking.jsx';
import { ClientLogos, AuditHeader } from '../v2/trust.jsx';
import Method from '../v2/method.jsx';
import Cases from '../v2/cases.jsx';
import { CONTACT_EMAIL } from '../config.js';
import { FAQ } from '../v2/faq-data.js';
import { EASE, Pill, Reveal, FaqList } from '../v2/blocks.jsx';
import { OffersCompare, OfferCards } from './offers.jsx';
import CampaignFan from './campaign-fan.jsx';
import '../v2/v2.css';
import './v3.css';

// Accueil de la refonte (28/10/2026) : fond blanc (Ugo : « le fond soit blanc et pas bleu car ça fait trop chargé »),
// deux offres (Kairn Leads, Kairn Pilotage), captures de vraies campagnes, réservation d'un appel.
// L'accueil précédent reste en ligne sur /landingpage.

const headline = [
  { w: 'Vous' }, { w: 'faites' }, { w: 'votre' }, { w: 'métier.' }, { br: true },
  { w: 'Nous,' }, { w: 'on', serif: true }, { w: 'vous', serif: true }, { w: 'trouve', serif: true }, { w: 'les clients.', serif: true },
];

function HeroVsl() {
  const ref = useRef(null);
  const [sound, setSound] = useState(false);
  const unmute = () => {
    const v = ref.current;
    if (!v) return;
    v.muted = false;
    v.loop = false;
    v.currentTime = 0;
    v.play();
    setSound(true);
  };
  return (
    <div className="hero-vsl">
      <video ref={ref} src="/vsl-kairn.mp4" poster="/vsl-kairn-poster.jpg" autoPlay muted loop playsInline preload="metadata" controls={sound} aria-label="Vidéo de présentation de Kairn (40 secondes)" />
      {!sound && (
        <button type="button" className="hero-vsl-cover" onClick={unmute} aria-label="Activer le son de la vidéo">
          <span className="hero-vsl-sound"><span aria-hidden="true">🔊</span> Activer le son</span>
        </button>
      )}
    </div>
  );
}

export default function KairnHomeV3() {
  useV2Favicon();
  return (
    <MotionConfig reducedMotion="user">
      <div className="v2 v3">
        <a href="#contenu" className="skip">Aller au contenu</a>
        <Nav light shop />

        <main id="contenu">
          {/* ── Hero ── */}
          <section className="hero is-light">
            <div className="aurora-grid" aria-hidden="true" />
            <div className="hero-halo" aria-hidden="true" />
            <div className="wrap hero-inner">
              <Reveal y={12}><Pill>Leads exclusifs et campagnes Meta</Pill></Reveal>
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
              <Reveal delay={0.4} y={16}>
                <p className="hero-lead">
                  Deux façons de travailler avec Kairn : <strong>acheter des contacts exclusifs</strong> en pompe à chaleur, isolation par l’extérieur ou photovoltaïque, ou <strong>nous confier vos campagnes Meta</strong> sur votre propre budget.
                </p>
              </Reveal>
              <Reveal delay={0.5} y={16} className="hero-actions">
                <Link to="/commander" className="btn btn-order">Commander des leads</Link>
                <a href="#reserver" className="btn btn-light">Réserver un appel</a>
              </Reveal>
              <Reveal delay={0.6} y={24}><HeroVsl /></Reveal>
              <Reveal delay={0.65} y={16}><ClientLogos /></Reveal>
            </div>
          </section>

          {/* ── Les deux offres ── */}
          <section className="band" id="offres" style={{ paddingTop: 'var(--band-sm)' }}>
            <div className="wrap">
              <Reveal className="sec-head sec-head-left">
                <p className="eyebrow">Produit ou service ?</p>
                <h2 className="h2">La différence tient en une ligne : <span className="serif grad-text">à qui appartient le budget pub.</span></h2>
                <p>L’essentiel tient en quatre points.</p>
              </Reveal>
              <OffersCompare />
              <p className="of-note">Et les deux se combinent : un installateur peut acheter des contacts sur nos thématiques et nous confier le reste de son acquisition.</p>
              <OfferCards />
            </div>
          </section>

          {/* ── Vraies campagnes ── */}
          <section className="band cf-band" id="campagnes">
            <div className="wrap">
              <Reveal className="sec-head">
                <p className="eyebrow">Preuve brute</p>
                <h2 className="h2">Pas des maquettes. <span className="serif grad-text">De vraies campagnes.</span></h2>
                <p>Les mêmes captures que celles que nos clients reçoivent. Cliquez sur une capture pour l’agrandir.</p>
              </Reveal>
              <CampaignFan />
            </div>
          </section>

          {/* ── Résultats ── */}
          {/* Les cas clients sont dessinés pour un fond sombre : ils restent dans un bloc nuit arrondi, pas en fond de page. */}
          <section className="band" id="resultats">
            <div className="wrap">
              <div className="dark results-card">
              <Reveal className="sec-head">
                <Pill>Résultats</Pill>
                <h2 className="h2">Ce qu’on a livré. <span className="serif grad-text">Et ce que ça a rapporté.</span></h2>
                <p>Des chiffres relevés chez nos clients, pas des promesses.</p>
              </Reveal>
              <Cases sansCout />
              <div className="cases-more"><Link to="/realisations" className="btn btn-light">Toutes les réalisations</Link></div>
              </div>
            </div>
          </section>

          {/* ── Méthode ── */}
          <section className="band" id="methode">
            <div className="wrap">
              <Reveal className="sec-head">
                <Pill>Méthode</Pill>
                <h2 className="h2">Quatre étapes. <span className="serif grad-text">Rien de plus.</span></h2>
              </Reveal>
              <Method />
            </div>
          </section>

          {/* ── Réservation ── */}
          <section className="band" style={{ paddingTop: 0 }}>
            <div className="wrap">
              <div className="book-card">
                <AuditHeader />
                <Booking />
              </div>
            </div>
          </section>

          {/* ── FAQ ── */}
          <section className="band" id="faq">
            <div className="wrap faq-grid">
              <Reveal className="faq-aside">
                <Pill>Questions</Pill>
                <h2 className="h2">Les questions <span className="serif grad-text">qu’on nous pose.</span></h2>
                <p>Une question qui n’est pas ici ? Écrivez à <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>
              </Reveal>
              <FaqList items={FAQ} />
            </div>
          </section>
        </main>

        <Footer />
        <div className="mob-cta"><Link to="/commander" className="btn btn-order">Commander des leads</Link></div>
      </div>
    </MotionConfig>
  );
}
