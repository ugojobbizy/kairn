import React, { useRef } from 'react';
import { motion, useInView, useScroll, useSpring } from 'framer-motion';

// Méthode de la V2 (Ugo, 29/10/2026 : « changez complètement cette section, elle ne va pas avec le style du site »).
// Mise en page éditoriale : titre à gauche qui reste en place, quatre étapes en lignes à droite, séparées par un filet.
// Un trait vertical se remplit au défilement ; l'étape au centre de l'écran passe en bleu. Textes repris de src/v2/method.jsx.
const STEPS = [
  { t: 'Audit', when: '48 h', d: 'Offre, page, tracking, créas. On identifie les fuites avant de dépenser un euro.' },
  { t: 'Mise en place', when: '2 à 4 semaines', d: 'Landing page, campagne, CRM sur mesure, tracking serveur, premières créas.' },
  { t: 'Lancement', when: 'Jour J', d: 'Campagnes en ligne, budget calibré. On observe, on ne promet pas.' },
  { t: 'Optimisation', when: 'Chaque lundi', d: 'Itérations hebdo et reporting transparent : leads, coût, signatures.' },
];

function Step({ s, i }) {
  const ref = useRef(null);
  const on = useInView(ref, { margin: '-49% 0px -49% 0px' });
  return (
    <li ref={ref} className={on ? 'm2-step is-on' : 'm2-step'}>
      <span className="m2-num">{String(i + 1).padStart(2, '0')}</span>
      <div className="m2-body">
        <div className="m2-top">
          <h3>{s.t}</h3>
          <span className="m2-when">{s.when}</span>
        </div>
        <p>{s.d}</p>
      </div>
    </li>
  );
}

export default function MethodV2() {
  const list = useRef(null);
  const { scrollYProgress } = useScroll({ target: list, offset: ['start 60%', 'end 50%'] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return (
    <div className="m2">
      <div className="m2-aside">
        <p className="eyebrow">Méthode</p>
        <h2 className="h2">Quatre étapes. <span className="serif grad-text">Rien de plus.</span></h2>
        <p className="m2-lead">De l’audit au premier lundi d’optimisation : ce qui se passe quand vous nous confiez vos campagnes.</p>
        <a href="#reserver" className="btn btn-order">Réserver un appel</a>
      </div>
      <div className="m2-list" ref={list}>
        <span className="m2-rail" aria-hidden="true"><motion.span style={{ scaleY: fill }} /></span>
        <ol>{STEPS.map((s, i) => <Step key={s.t} s={s} i={i} />)}</ol>
      </div>
    </div>
  );
}
