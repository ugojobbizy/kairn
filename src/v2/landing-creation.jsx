import React from 'react';
import { Link } from 'react-router-dom';
import { motion, MotionConfig } from 'framer-motion';
import { Nav, Footer, BookCta, useV2Favicon } from './layout.jsx';
import LivingGradient from './living-gradient.jsx';
import Booking from './booking.jsx';
import WorkGallery from './work-gallery.jsx';
import { AdsVisual, PageVisual, QualVisual, TrackingVisual } from './bento-visuals.jsx';
import { EASE, Icon, Pill, Glow, Reveal, BentoGrid, BentoCard, FaqList } from './blocks.jsx';
import { FAQ_LP } from './faq-data.js';
import { CONTACT_EMAIL } from '../config.js';
import './v2.css';

// Page de service « Création de landing page » (/creation-landing-page).
// Contenu du pack Landing de l'ancienne page Build ; règles de conversion issues du système de design Kairn.
// Chiffres repris des cas clients déjà publiés.

const PROOF = [
  ['−72 %', 'de coût par lead', 'Isolation d’Aquitaine'],
  ['12 → 31 %', 'de taux de conversion', 'Rénovia'],
  ['2 sem.', 'pour livrer une landing', 'Délai habituel'],
];

const COMPARE = [
  { t: 'Un site internet', d: 'Présente toute l’entreprise : vos services, votre équipe, vos réalisations. Le visiteur explore, compare, revient plus tard.', link: ['/creation-site-internet', 'Création de site internet'] },
  { t: 'Une landing page', d: 'Une seule offre, un seul objectif : obtenir la demande. Pas de menu qui disperse. Le visiteur qui arrive d’une pub trouve exactement ce qu’on lui a promis.', on: true },
];

const RULES = [
  { icon: 'bolt', t: 'Une page, une offre', d: 'Un seul message et un seul appel à l’action. Chaque offre et chaque source de trafic a sa page.' },
  { icon: 'check', t: 'La preuve dès le premier écran', d: 'Avis, chiffres, réalisations réelles : ce qui rassure se voit sans défiler.' },
  { icon: 'filter', t: 'Un formulaire court', d: 'Quatre champs au maximum, libellés visibles, erreurs expliquées sous le champ concerné.' },
  { icon: 'layout', t: 'Pensée d’abord pour le téléphone', d: 'Le bouton et le numéro sont atteignables sans défiler. Champs pleine largeur, texte lisible sans zoomer.' },
  { icon: 'users', t: 'De vraies photos', d: 'Chantiers, équipe, produits : une photo authentique un peu imparfaite convainc plus qu’une image de banque.' },
  { icon: 'chart', t: 'Un tracking qui remonte les leads', d: 'Chaque demande est renvoyée à Meta et Google côté serveur : les campagnes apprennent sur de vrais prospects.' },
];

const INCLUDED = [
  'Cadrage de l’offre et de la cible',
  'Rédaction des textes',
  'Design sur mesure, pensé pour le téléphone',
  'Formulaire qualifiant, branché à votre CRM ou à votre email',
  'Tracking serveur Meta et GA4',
  'A/B testing configuré dès la mise en ligne',
  'Hébergement 6 mois inclus',
  '30 jours de support après la mise en ligne',
];

export default function LandingCreationPage() {
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
              <Reveal y={12}><Pill>Création de landing page</Pill></Reveal>
              <motion.h1 initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}>
                Création de landing page&nbsp;: une offre, une page, <span className="serif grad-text">des demandes.</span>
              </motion.h1>
              <Reveal delay={0.35} y={16}>
                <p className="hero-lead">
                  Des landing pages conçues pour vos campagnes Meta et Google Ads&nbsp;: un seul message, un formulaire court et un <strong>tracking serveur</strong> qui remonte chaque lead. Textes inclus, livrée en deux semaines, et le code vous appartient.
                </p>
              </Reveal>
              <Reveal delay={0.5} y={16} className="hero-cta">
                <BookCta>Parler de votre page</BookCta>
                <span className="hero-meta">30 min · en visio · sans engagement</span>
              </Reveal>
              <Reveal delay={0.65} y={16}>
                <ul className="lg-proof" aria-label="Résultats et délais">
                  {PROOF.map(([v, l, c]) => (
                    <li key={l}><b>{v}</b><span>{l}</span><small>{c}</small></li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </section>

          {/* ── Site ou landing ── */}
          <section className="band" style={{ paddingTop: 'var(--band-sm)', paddingBottom: 'var(--band-sm)' }}>
            <div className="wrap">
              <Reveal className="sec-head">
                <Pill>Site ou landing page ?</Pill>
                <h2 className="h2">Un site présente. <span className="serif grad-text">Une landing convertit.</span></h2>
                <p>Envoyer une pub vers la page d’accueil, c’est payer des clics pour que le visiteur cherche seul ce qu’il était venu chercher.</p>
              </Reveal>
              <div className="lp-compare">
                {COMPARE.map((c, i) => (
                  <Reveal key={c.t} delay={i * 0.08} className={`lp-col${c.on ? ' is-on' : ''}`}>
                    <h3>{c.t}</h3>
                    <p>{c.d}</p>
                    {c.link && <Link to={c.link[0]}>{c.link[1]} →</Link>}
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* ── Ce qui fait convertir ── */}
          <section className="band" style={{ paddingTop: 0, paddingBottom: 'var(--band-sm)' }}>
            <div className="wrap">
              <Reveal className="sec-head">
                <Pill>Notre méthode</Pill>
                <h2 className="h2">Six règles <span className="serif grad-text">qu’on ne négocie pas.</span></h2>
                <p>Chaque page passe cette grille avant la mise en ligne, sur ordinateur puis sur téléphone.</p>
              </Reveal>
              <div className="lg-pains lp-rules">
                {RULES.map((r, i) => (
                  <Reveal key={r.t} delay={(i % 3) * 0.08} className="lg-pain">
                    <span className="bcard-ico"><Icon name={r.icon} /></span>
                    <h3>{r.t}</h3>
                    <p>{r.d}</p>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* ── Branchée sur l'acquisition ── */}
          <section className="band" id="systeme" style={{ paddingTop: 0, paddingBottom: 0 }}>
            <div className="wrap">
              <Reveal className="sec-head">
                <Pill>Branchée sur vos campagnes</Pill>
                <h2 className="h2">Une page qui ne vit pas <span className="serif grad-text">seule.</span></h2>
                <p>La landing est un maillon de la chaîne : la pub amène le visiteur, la page le qualifie, le tracking dit ce qui a marché. C’est notre métier de <Link to="/generation-de-leads">génération de leads</Link>.</p>
              </Reveal>
              <BentoGrid>
                <BentoCard icon="layout" title="La page" description="Un message, une preuve, un bouton. Rien qui détourne de la demande."><PageVisual /></BentoCard>
                <BentoCard icon="filter" title="Le formulaire" description="Les bonnes questions : vous savez qui rappeler en premier."><QualVisual /></BentoCard>
                <BentoCard span icon="megaphone" title="Les campagnes" description="Chaque annonce pointe vers la page qui lui correspond. Plusieurs versions testées, on garde celle qui fait signer."><AdsVisual /></BentoCard>
              </BentoGrid>
              <div className="lp-track">
                <BentoGrid>
                  <BentoCard span icon="chart" title="Le tracking serveur" description="Les conversions remontent même quand le navigateur bloque les cookies. Vous voyez ce que chaque page rapporte."><TrackingVisual /></BentoCard>
                  <Reveal className="lp-incl">
                    <h3>Ce qui est inclus</h3>
                    <ul>
                      {INCLUDED.map((x) => <li key={x}><span aria-hidden="true">✓</span>{x}</li>)}
                    </ul>
                  </Reveal>
                </BentoGrid>
              </div>
            </div>
          </section>

          {/* ── Réalisations ── */}
          <section className="band" id="realisations">
            <div className="wrap">
              <Reveal className="sec-head">
                <Pill>Réalisations</Pill>
                <h2 className="h2">Des landing pages <span className="serif grad-text">en production.</span></h2>
                <p>Toutes branchées sur des campagnes actives et sur le CRM du client.</p>
              </Reveal>
              <WorkGallery />
              <div className="cases-more">
                <Link to="/realisations" className="btn btn-dark">Voir les cas clients</Link>
              </div>
            </div>
          </section>

          {/* ── FAQ ── */}
          <section className="band" id="faq" style={{ paddingTop: 0 }}>
            <div className="wrap faq-grid">
              <Reveal className="faq-aside">
                <Pill>Questions</Pill>
                <h2 className="h2">Landing page&nbsp;: <span className="serif grad-text">vos questions.</span></h2>
                <p>Une question qui n’est pas ici ? Écrivez à <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>, on répond sous 24 h.</p>
              </Reveal>
              <FaqList items={FAQ_LP} />
            </div>
          </section>

          {/* ── CTA final ── */}
          <section id="contact" style={{ paddingBottom: 'var(--band-sm)' }}>
            <Reveal className="final">
              <Glow />
              <div className="final-inner">
                <Pill>Parlons de votre page</Pill>
                <h2 className="h2">30 minutes pour savoir <span className="serif">ce qui bloque.</span></h2>
                <p className="final-lead">Montrez-nous votre page et vos campagnes actuelles. On vous dit franchement ce qu’on changerait, et ce que ça demanderait.</p>
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
