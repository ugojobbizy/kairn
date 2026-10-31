import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, MotionConfig } from 'framer-motion';
import { Nav, Footer, useV2Favicon } from '../v2/layout.jsx';
import Booking from '../v2/booking.jsx';
import { ClientLogos, AuditHeader } from '../v2/trust.jsx';
import Method from '../v2/method.jsx';
import Cases from '../v2/cases.jsx';
import { CONTACT_EMAIL } from '../config.js';
import { FAQ, FAQ_V2 } from '../v2/faq-data.js';
import { EASE, Pill, Reveal, FaqList } from '../v2/blocks.jsx';
import { OffersCompare, OfferCards } from './offers.jsx';
import OffersCompareV2 from './offers-compare-v2.jsx';
import CampaignReel from './campaign-reel.jsx';
import HeroBg from './hero-bg.jsx';
import HeroBgV2 from './hero-bg-v2.jsx';
import LeadSample from './lead-sample.jsx';
import PlatformTabs from './platform-tabs.jsx';
import MethodV2 from './method-v2.jsx';
import Piliers from './piliers.jsx';
import '../v2/v2.css';
import './v3.css';
import './police.css';

// Accueil de la refonte (28/10/2026) : fond blanc (Ugo : « le fond soit blanc et pas bleu car ça fait trop chargé »),
// deux offres (Kairn Leads, Kairn Pilotage), captures de vraies campagnes, réservation d'un appel.
// L'accueil précédent reste en ligne sur /landingpage.

// Ugo, 28/10/2026 : « met la plus petite et fait un truc qui ressemble un peu à ça : Achetez nos leads, ou confiez-nous votre acquisition. »
const headline = [
  { w: 'Achetez' }, { w: 'nos' }, { w: 'leads,' }, { br: true },
  { w: 'ou', serif: true }, { w: 'confiez-nous', serif: true }, { w: 'votre', serif: true }, { w: 'acquisition.', serif: true },
];

// V2 : titre générique (Ugo, 29/10/2026 : « je ne vends pas que des contacts de PAC, ITE et panneaux solaires [...]
// la headline doit être générique »). On garde l'exclusivité de la proposition de copy du même jour.
// 30/10/2026 : titre, chapô, boutons et piliers repris de brand/copy-v3-proposition.md (validée par Ugo) :
// marché déjà acheteur de leads, page bas de tunnel sur fraîcheur, qualification, flux journalier, exclusivité.
const headlineV2 = [
  { w: 'Chaque' }, { w: 'jour,' }, { w: 'des' }, { w: 'contacts' }, { w: 'frais' }, { br: true },
  { w: 'que', serif: true }, { w: 'vous', serif: true }, { w: 'êtes', serif: true }, { w: 'seul', serif: true }, { w: 'à', serif: true }, { w: 'appeler.', serif: true },
];

const GOOGLE_PROFILE = 'https://maps.google.com/?cid=17839410346044495568';

function GoogleRating() {
  return (
    <a className="g-rating" href={GOOGLE_PROFILE} target="_blank" rel="noopener noreferrer" aria-label="5 sur 5 sur Google : voir les avis">
      <svg className="g-rating-logo" viewBox="0 0 48 48" aria-hidden="true">
        <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
        <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
        <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
        <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
      </svg>
      <span className="g-rating-stars" aria-hidden="true">★★★★★</span>
      <span><b>5/5</b> sur Google</span>
    </a>
  );
}

// Barre de progression façon VSL (Ugo, 31/10/2026) : elle avance vite au début et lentement à la fin, sans afficher les secondes.
const vslProgress = (t) => 1 - (1 - t) * (1 - t);
const VSL_MUET = '/vsl-kairn-v4b-muet.mp4';
const VSL_FULL = '/vsl-kairn-v4b.mp4';

function HeroVsl() {
  const ref = useRef(null);
  const box = useRef(null);
  const bar = useRef(null);
  const [sound, setSound] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [ended, setEnded] = useState(false);

  useEffect(() => {
    if (!sound) return undefined;
    let raf = 0;
    const tick = () => {
      const v = ref.current;
      if (v && bar.current && v.duration) bar.current.style.transform = `scaleX(${vslProgress(Math.min(1, v.currentTime / v.duration))})`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [sound]);

  const unmute = () => {
    const v = ref.current;
    if (!v) return;
    // Boucle muette en version légère (3,4 Mo, 720p, sans son) ; la version complète (1080p, son) ne se charge qu'au clic.
    v.src = VSL_FULL;
    v.muted = false;
    v.loop = false;
    v.play();
    setSound(true);
  };
  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) { if (v.ended) v.currentTime = 0; v.play(); } else v.pause();
  };
  const toggleMute = (e) => {
    e.stopPropagation();
    const v = ref.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };
  const fullscreen = (e) => {
    e.stopPropagation();
    const el = box.current, v = ref.current;
    if (document.fullscreenElement) { document.exitFullscreen(); return; }
    if (el && el.requestFullscreen) el.requestFullscreen();
    else if (v && v.webkitEnterFullscreen) v.webkitEnterFullscreen(); // iPhone : plein écran natif
  };

  return (
    <div className={`hero-vsl${sound ? ' is-sound' : ''}${sound && !playing ? ' is-paused' : ''}`} ref={box}>
      <video ref={ref} src={VSL_MUET} poster="/vsl-kairn-v4-poster.jpg" autoPlay muted loop playsInline preload="metadata"
        onPlay={() => { setPlaying(true); setEnded(false); }} onPause={() => setPlaying(false)} onEnded={() => setEnded(true)}
        onClick={sound ? toggle : undefined} aria-label="Vidéo de présentation de Kairn (1 minute)" />
      {!sound && (
        <button type="button" className="hero-vsl-cover" onClick={unmute} aria-label="Activer le son de la vidéo">
          <span className="hero-vsl-sound"><span aria-hidden="true">🔊</span> Activer le son</span>
        </button>
      )}
      {sound && !playing && (
        <button type="button" className="vsl-big" onClick={toggle} aria-label={ended ? 'Revoir la vidéo' : 'Reprendre la vidéo'}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor" /></svg>
          <span>{ended ? 'Revoir' : 'Reprendre'}</span>
        </button>
      )}
      {sound && (
        <div className="vsl-ctrl">
          <div className="vsl-track" aria-hidden="true"><i ref={bar} /></div>
          <div className="vsl-btns">
            <button type="button" onClick={(e) => { e.stopPropagation(); toggle(); }} aria-label={playing ? 'Pause' : 'Lecture'}>
              {playing
                ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor" /></svg>
                : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor" /></svg>}
            </button>
            <span className="vsl-sp" />
            <button type="button" onClick={toggleMute} aria-label={muted ? 'Activer le son' : 'Couper le son'}>
              {muted
                ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" /><path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" /><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>}
            </button>
            <button type="button" onClick={fullscreen} aria-label="Plein écran">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// police = 'tight' : test de la police Inter Tight (Ugo, 28/10/2026), servi sur /v2.
// Halos bleu clair qui dérivent lentement, repris de la VSL v4 (Ugo, 31/10/2026 : « j'adore le petit dégradé bleu clair »).
function Halos() {
  return <div className="halos" aria-hidden="true"><i className="halo-a" /><i className="halo-b" /></div>;
}

export default function KairnHomeV3({ police }) {
  useV2Favicon();
  useEffect(() => {
    if (police !== 'tight' || document.getElementById('font-inter-tight')) return;
    const l = document.createElement('link');
    l.id = 'font-inter-tight';
    l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,300..700;1,300..700&display=swap';
    document.head.appendChild(l);
  }, [police]);
  // Fond du hero à comparer : ?fond=topo | cairn | flux (choix d'Ugo en attente).
  const fond = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('fond') || 'topo' : 'topo';
  return (
    <MotionConfig reducedMotion="user">
      <div className={police ? `v2 v3 font-${police}` : 'v2 v3'}>
        <a href="#contenu" className="skip">Aller au contenu</a>
        <Nav light shop />

        <main id="contenu">
          {/* ── Hero ── */}
          <section className="hero is-light">
            {police && <Halos />}
            {police ? <HeroBgV2 variant={new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '').get('fond') || 'trame'} /> : <HeroBg variant={fond} />}
            <div className="wrap hero-inner">
              {/* Retirée de la V2 (Ugo, 28/10/2026 : « enlève ça sur la v2 »). */}
              {!police && <Reveal y={12}><Pill>Leads exclusifs et campagnes Meta</Pill></Reveal>}
              <h1>
                {(police ? headlineV2 : headline).map((x, i) => x.br ? <br key={i} className="hero-br" /> : (
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
                    {i < (police ? headlineV2 : headline).length - 1 && ' '}
                  </React.Fragment>
                ))}
              </h1>
              <Reveal delay={0.4} y={16}>
                {police ? (
                  <p className="hero-lead">
                    <strong>Nous payons la pub, vous payez au contact</strong>, sans engagement. Vous préférez vos propres campagnes ? <strong>On alimente vos commerciaux</strong> avec une acquisition sur mesure.
                  </p>
                ) : (
                  <p className="hero-lead">
                    Deux façons de travailler avec Kairn : <strong>acheter des leads au volume</strong> ou <strong>nous confier vos campagnes</strong>.
                  </p>
                )}
              </Reveal>
              <Reveal delay={0.5} y={16} className="hero-actions">
                <Link to="/commander" className="btn btn-order">{police ? 'Commander des contacts' : 'Commander des leads'}</Link>
                <a href="#reserver" className="btn btn-light">Lancer ma campagne</a>
              </Reveal>
              {/* Note Google donnée par Ugo le 29/10/2026 (« finalement j'ai 5 étoiles par 4,9 sur google »). */}
              {police && <Reveal delay={0.55} y={12}><GoogleRating /></Reveal>}
              <Reveal delay={0.6} y={24}><HeroVsl /></Reveal>
              {/* Bande de clients retirée de l'accueil (Ugo, 29/10/2026 : « enlève ça finalement ») ; gardée sur /accueil-v1. */}
              {!police && <Reveal delay={0.65} y={16}><ClientLogos /></Reveal>}
            </div>
          </section>

          {/* ── Les quatre piliers de Kairn Leads (V2 seulement) ── */}
          {police && <section className="band" id="piliers" style={{ paddingTop: 'var(--band-sm)' }}>
            <div className="wrap">
              <Piliers />
            </div>
          </section>}
          {/* ── Les deux offres ── */}
          <section className={police ? 'band has-halos' : 'band'} id="offres" style={{ paddingTop: 'var(--band-sm)' }}>
            {police && <Halos />}
            <div className="wrap">
              <Reveal className="sec-head sec-head-left">
                {police ? (
                  <>
                    <p className="eyebrow">Deux offres</p>
                    <h2 className="h2">Vous payez au contact, <span className="serif grad-text">ou on crée votre campagne.</span></h2>
                    <p>Vous voulez des contacts dans votre secteur, sans avancer de budget : c’est Kairn Leads. Vous voulez vos propres campagnes, sur votre budget : c’est Kairn Pilotage.</p>
                  </>
                ) : (
                  <>
                    <p className="eyebrow">Produit ou service ?</p>
                    <h2 className="h2">La différence tient en une ligne : <span className="serif grad-text">à qui appartient le budget pub.</span></h2>
                    <p>L’essentiel tient en quatre points.</p>
                  </>
                )}
              </Reveal>
              {police ? <OffersCompareV2 /> : <OffersCompare />}
              <p className="of-note">{police ? 'Les deux se combinent : des contacts achetés chez Kairn Leads, et vos propres campagnes pilotées par Kairn Pilotage.' : 'Et les deux se combinent : un installateur peut acheter des contacts sur nos thématiques et nous confier le reste de son acquisition.'}</p>
              {/* V2 : cartes retirées, elles redisaient le tableau (proposition de copy du 29/10/2026). */}
              {!police && <OfferCards />}
            </div>
          </section>

          {/* ── Notre plateforme (V2 seulement, avant la fiche lead : Ugo, 29/10/2026) ── */}
          {police && <section className="band has-halos" id="plateforme">
            <Halos />
            <div className="wrap">
              <Reveal><PlatformTabs /></Reveal>
            </div>
          </section>}

          {/* ── Vraies campagnes ; sur la V2, la fiche d'un lead à la place des pubs Meta (Ugo, 29/10/2026) ── */}
          <section className="band" id={police ? 'lead' : 'campagnes'}>
            <div className="wrap">
              <Reveal>{police ? <LeadSample /> : <CampaignReel />}</Reveal>
            </div>
          </section>

          {/* Les cas clients sont dessinés pour un fond sombre : ils restent dans un bloc nuit arrondi, pas en fond de page.
              Retirés de la V2 (Ugo, 28/10/2026 : « enlève-moi cette section »). */}
          {!police && <section className="band" id="resultats">
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
          </section>}

          {/* ── Méthode ── */}
          <section className="band" id="methode">
            <div className="wrap">
              {police ? <MethodV2 /> : (
                <>
                  <Reveal className="sec-head">
                    <Pill>Méthode</Pill>
                    <h2 className="h2">Quatre étapes. <span className="serif grad-text">Rien de plus.</span></h2>
                  </Reveal>
                  <Method />
                </>
              )}
            </div>
          </section>

          {/* Sur la V2, la FAQ passe avant la réservation : la page finit sur l'action (proposition de copy du 29/10/2026). */}
          {police && (
            <>
          {/* ── FAQ ── */}
          <section className="band has-halos" id="faq">
            <Halos />
            <div className="wrap faq-grid">
              <Reveal className="faq-aside">
                <Pill>Questions</Pill>
                <h2 className="h2">Les questions <span className="serif grad-text">{police ? 'avant de commander.' : 'qu’on nous pose.'}</span></h2>
                <p>Une question qui n’est pas ici ? Écrivez à <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>{police ? ', ou posez-la-nous en réservant un appel juste en dessous.' : '.'}</p>
              </Reveal>
              <FaqList items={police ? FAQ_V2 : FAQ} />
            </div>
          </section>
          {/* ── Réservation ── */}
          <section className="band band-book" style={{ paddingTop: 0 }}>
            <div className="wrap">
              <div className="book-card">
                <AuditHeader variant={police ? 'appel' : 'audit'} />
                {police ? <Booking title="Audit stratégique" intro={['30 minutes en visio : votre métier, vos départements, le nombre de contacts par jour qu’il vous faut. Vous repartez avec un prix et une date de démarrage.']} /> : <Booking />}
              </div>
            </div>
          </section>

            </>
          )}
          {!police && (
            <>
          {/* ── Réservation ── */}
          <section className="band band-book" style={{ paddingTop: 0 }}>
            <div className="wrap">
              <div className="book-card">
                <AuditHeader variant={police ? 'appel' : 'audit'} />
                {police ? <Booking title="Audit stratégique" intro={['30 minutes en visio : votre métier, vos départements, le nombre de contacts par jour qu’il vous faut. Vous repartez avec un prix et une date de démarrage.']} /> : <Booking />}
              </div>
            </div>
          </section>

          {/* ── FAQ ── */}
          <section className="band" id="faq">
            <div className="wrap faq-grid">
              <Reveal className="faq-aside">
                <Pill>Questions</Pill>
                <h2 className="h2">Les questions <span className="serif grad-text">{police ? 'avant de commander.' : 'qu’on nous pose.'}</span></h2>
                <p>Une question qui n’est pas ici ? Écrivez à <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>{police ? ', ou posez-la-nous en réservant un appel juste en dessous.' : '.'}</p>
              </Reveal>
              <FaqList items={police ? FAQ_V2 : FAQ} />
            </div>
          </section>
            </>
          )}
        </main>

        <Footer />
        <div className="mob-cta"><Link to="/commander" className="btn btn-order">{police ? 'Commander des contacts' : 'Commander des leads'}</Link></div>
      </div>
    </MotionConfig>
  );
}
