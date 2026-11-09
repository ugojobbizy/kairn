import React from 'react';
import { Link } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { Nav, Footer, useV2Favicon } from '../../v2/layout.jsx';
import Booking from '../../v2/booking.jsx';
import { AuditHeader } from '../../v2/trust.jsx';
import { Reveal, FaqList } from '../../v2/blocks.jsx';
import { prixHT } from '../produits.js';
import { GROUPES, THEMATIQUES, PRETES, prixDe, MINIMUM } from './thematiques.js';
import { FAQ_HUB } from './hub-data.js';
import { Fil } from './lead-page.jsx';
import '../../v2/v2.css';
import '../v3.css';
import '../police.css';
import './leads.css';

// Page catalogue /leads : toutes les thématiques, rangées par secteur, et les règles communes.
// Point d'entrée du maillage interne (menu, pied de page, chaque page thématique y renvoie).

function Halos() {
  return <div className="halos" aria-hidden="true"><i className="halo-a" /><i className="halo-b" /></div>;
}

export default function LeadsIndex() {
  useV2Favicon();
  return (
    <MotionConfig reducedMotion="user">
      <div className="v2 v3 font-tight ld">
        <a href="#contenu" className="skip">Aller au contenu</a>
        <Nav light shop />
        <main id="contenu">
          <section className="hero is-light ld-hero">
            <Halos />
            <div className="aurora-grid" aria-hidden="true" />
            <div className="wrap ld-hero-inner">
              <Fil items={[['Accueil', '/'], ['Leads', null]]} />
              <p className="eyebrow">Kairn Leads</p>
              <h1>Achat de leads exclusifs, <span className="serif grad-text">par secteur.</span></h1>
              <p className="hero-lead ld-chapo">
                Kairn produit des leads exclusifs : des particuliers qui ont demandé eux-mêmes à être rappelés, après une publicité Meta dédiée à votre métier. Chaque contact est envoyé à un seul professionnel. Kairn paie la publicité, vous payez au contact, sans engagement, à partir de {MINIMUM} contacts.
              </p>
              <div className="ld-actions">
                <Link to="/commander" className="btn btn-order">Commander des leads</Link>
                <a href="#reserver" className="btn btn-light">Réserver un appel</a>
              </div>
              <p className="ld-link-line">Combien vous coûte vraiment un chantier signé ? <Link to="/calculateur-cout-par-chantier">Faites le calcul avec notre calculateur gratuit</Link>.</p>
            </div>
          </section>

          {GROUPES.map((g) => {
            const list = PRETES.filter((t) => t.groupe === g.id && !t.parent);
            if (!list.length) return null;
            return (
              <section className="band ld-band" id={g.id} key={g.id}>
                <div className="wrap">
                  <Reveal className="sec-head sec-head-left">
                    <p className="eyebrow">{g.eyebrow}</p>
                    <h2 className="h2">{g.titre[0]} <span className="serif grad-text">{g.titre[1]}</span></h2>
                    <p>{g.intro}</p>
                  </Reveal>
                  <div className="ld-cards">
                    {list.map((t) => {
                      const prix = prixDe(t);
                      return (
                        <Link key={t.slug} to={`/${t.slug}`} className="ld-card is-link">
                          <span className="ld-card-prix">{prix ? `${prixHT(prix)} le contact` : 'Sur devis'}</span>
                          <h3>{t.label}</h3>
                          <p>{t.resume}</p>
                          {t.enfants && <p className="ld-card-sub">{t.enfants.map((s) => THEMATIQUES.find((x) => x.slug === s)).filter((x) => x.pret).map((x) => x.court).join(' · ')}</p>}
                          <span className="ld-more">Voir la page</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </section>
            );
          })}

          <section className="band has-halos" id="faq">
            <Halos />
            <div className="wrap faq-grid">
              <Reveal className="faq-aside">
                <p className="eyebrow">Questions</p>
                <h2 className="h2">Acheter des leads : <span className="serif grad-text">vos questions.</span></h2>
                <p>Ce qu’un acheteur doit vérifier chez n’importe quel fournisseur, et nos réponses.</p>
              </Reveal>
              <FaqList items={FAQ_HUB} />
            </div>
          </section>

          <section className="band band-book" style={{ paddingTop: 0 }}>
            <div className="wrap">
              <div className="book-card">
                <AuditHeader variant="appel" />
                <Booking title="Audit stratégique" intro={['30 minutes en visio : votre métier, vos départements, le nombre de contacts par jour qu’il vous faut. Vous repartez avec un prix et une date de démarrage.']} />
              </div>
            </div>
          </section>
        </main>
        <Footer />
        <div className="mob-cta"><Link to="/commander" className="btn btn-order">Commander des leads</Link></div>
      </div>
    </MotionConfig>
  );
}
