import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { Nav, Footer, useV2Favicon } from '../v2/layout.jsx';
import { Reveal } from '../v2/blocks.jsx';
import '../v2/v2.css';
import './v3.css';
import './police.css';
import './plateforme.css';
import { ETAPES } from './plateforme-data.js';

// Page « Plateforme » (Ugo, 29/10/2026 : « à la place de la page méthode dans la navbar, plutôt plateforme, et sur cette page
// je veux que tu expliques en faisant des inserts comment fonctionne notre plateforme »).
// L'accueil de l'espace est l'insert du haut de page ; les cinq étapes suivent. Inserts : captures de l'espace client en aperçu (données d'exemple, aucune personne réelle) dans public/plateforme/.
// Style de la V2 (Inter Tight, titres fins).


function Frame({ img, alt, priority }) {
  return (
    <figure className="pf-frame">
      <div className="pf-bar" aria-hidden="true"><i /><i /><i /><span>kairnagency.com/espace</span></div>
      <img src={`/plateforme/${img}.jpg`} alt={alt} width="2000" height="1194" loading={priority ? 'eager' : 'lazy'} decoding="async" />
    </figure>
  );
}

function Check() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>;
}

export default function Plateforme() {
  useV2Favicon();
  useEffect(() => {
    if (document.getElementById('font-inter-tight')) return;
    const l = document.createElement('link');
    l.id = 'font-inter-tight';
    l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,300..700;1,300..700&display=swap';
    document.head.appendChild(l);
  }, []);
  return (
    <MotionConfig reducedMotion="user">
      <div className="v2 v3 font-tight pf">
        <a href="#contenu" className="skip">Aller au contenu</a>
        <Nav light shop />
        <main id="contenu">
          <section className="pf-hero">
            <div className="wrap">
              <Reveal y={12}><p className="eyebrow">La plateforme Kairn</p></Reveal>
              <Reveal y={16}><h1 className="pf-h1">Vos leads, vos commandes, <span className="serif grad-text">au même endroit.</span></h1></Reveal>
              <Reveal y={16} delay={0.1}><p className="pf-lead">Chaque client Kairn a son espace : vous suivez vos commandes, achetez des leads disponibles tout de suite, exportez vos prospects et signalez un doublon en un clic.</p></Reveal>
              <Reveal y={16} delay={0.15} className="pf-actions">
                <Link to="/commander" className="btn btn-order">Commander des leads</Link>
                <Link to="/espace" className="btn btn-light">Se connecter</Link>
              </Reveal>
              <Reveal y={30} delay={0.2} className="pf-hero-shot"><Frame img="accueil" alt="Accueil de l’espace client Kairn : prospects livrés, reste à livrer, montant dû, catalogue" priority /></Reveal>
              <p className="pf-caption">Captures de l’espace client, données d’exemple.</p>
            </div>
          </section>

          <section className="pf-steps">
            <div className="wrap">
              {ETAPES.map((e, k) => (
                <article className={`pf-step${k % 2 ? ' is-rev' : ''}`} key={e.img}>
                  <Reveal className="pf-copy">
                    <p className="pf-num">{String(k + 1).padStart(2, '0')} · {e.tag}</p>
                    <h2 className="h2">{e.h} <span className="serif grad-text">{e.i}</span></h2>
                    <p className="pf-p">{e.p}</p>
                    <ul className="pf-points">{e.points.map((x) => <li key={x}><Check />{x}</li>)}</ul>
                  </Reveal>
                  <Reveal y={30} className="pf-shot"><Frame img={e.img} alt={`${e.tag} dans l’espace client Kairn`} /></Reveal>
                </article>
              ))}
            </div>
          </section>

          <section className="band" style={{ paddingTop: 0 }}>
            <div className="wrap">
              <div className="pf-cta">
                <h2 className="h2">Prêt à recevoir <span className="serif grad-text">vos premiers leads ?</span></h2>
                <p>Votre espace s’ouvre dès votre première commande validée.</p>
                <div className="pf-actions">
                  <Link to="/commander" className="btn btn-order">Commander des leads</Link>
                  <Link to="/#reserver" className="btn pf-btn-light">Faire un audit</Link>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
