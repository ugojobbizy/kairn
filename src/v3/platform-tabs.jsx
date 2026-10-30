import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ETAPES } from './plateforme-data.js';
import './plateforme.css';

// Section « Notre plateforme » de l'accueil V2 (Ugo, 29/10/2026 : « rajoute une section : Notre plateforme »),
// placée avant la fiche lead, en captures à onglets (choix cliqués). Mêmes captures et textes que la page /plateforme.

function Check() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>;
}

export default function PlatformTabs() {
  const [k, setK] = useState(0);
  const [fade, setFade] = useState('fin');
  const bar = useRef(null);
  const e = ETAPES[k];

  // Sur téléphone la barre défile : fondu du côté où il reste des onglets à voir.
  function majFade() {
    const el = bar.current;
    if (!el) return;
    const f = [];
    if (el.scrollLeft > 4) f.push('debut');
    if (el.scrollLeft + el.clientWidth < el.scrollWidth - 4) f.push('fin');
    setFade(f.join(' '));
  }
  useEffect(() => {
    majFade();
    window.addEventListener('resize', majFade);
    return () => window.removeEventListener('resize', majFade);
  }, []);
  function choisir(i, btn) {
    setK(i);
    const el = bar.current;
    if (el && el.scrollWidth > el.clientWidth) el.scrollTo({ left: btn.offsetLeft - (el.clientWidth - btn.offsetWidth) / 2, behavior: 'smooth' });
  }
  return (
    <div className="pt">
      <div className="pt-head">
        <p className="eyebrow">Notre plateforme</p>
        <h2 className="h2">Tout se passe <span className="serif grad-text">dans votre espace client.</span></h2>
        <p>Acheter, recevoir, exporter, signaler, régler : une seule plateforme, ouverte dès votre première commande validée.</p>
      </div>

      <div className="pt-tabs" ref={bar} data-fade={fade || undefined} onScroll={majFade} role="tablist" aria-label="Fonctions de la plateforme">
        {ETAPES.map((x, i) => (
          <button key={x.img} type="button" role="tab" id={`pt-tab-${x.img}`} aria-selected={i === k} aria-controls="pt-panel"
            className={i === k ? 'is-on' : undefined} onClick={(ev) => choisir(i, ev.currentTarget)}>{x.tag}</button>
        ))}
      </div>

      <div className="pt-panel" id="pt-panel" role="tabpanel" aria-labelledby={`pt-tab-${e.img}`}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={e.img} className="pt-grid" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.28 }}>
            <div className="pt-copy">
              <h3>{e.h} <span className="serif grad-text">{e.i}</span></h3>
              <p>{e.p}</p>
              <ul className="pf-points">{e.points.map((x) => <li key={x}><Check />{x}</li>)}</ul>
            </div>
            <figure className="pf-frame">
              <div className="pf-bar" aria-hidden="true"><i /><i /><i /><span>kairnagency.com/espace</span></div>
              <img src={`/plateforme/${e.img}.jpg`} alt={`${e.tag} dans l’espace client Kairn`} width="2000" height="1194" loading="lazy" decoding="async" />
            </figure>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="pt-more"><Link to="/plateforme" className="btn ls-btn">Découvrir la plateforme</Link></div>
    </div>
  );
}
