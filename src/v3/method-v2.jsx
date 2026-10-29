import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useScroll, useSpring } from 'framer-motion';

// Méthode de la V2 (Ugo, 29/10/2026 : « changez complètement cette section, elle ne va pas avec le style du site »).
// Mise en page éditoriale : titre à gauche qui reste en place, quatre étapes en lignes à droite, séparées par un filet.
// Un trait vertical se remplit au défilement ; l'étape au centre de l'écran passe en bleu. Textes repris de src/v2/method.jsx.
// Étapes réécrites (proposition de copy du 29/10/2026) : ce qui se passe après une commande de contacts.
// Délais retirés faute de source ; livraison dans l'espace client (construit le 29/10).
const STEPS = [
  { t: 'Vous commandez', when: 'En ligne', d: 'Votre métier, vos départements, le volume, à partir de 50 contacts. Sans engagement.' },
  { t: 'On valide ensemble', when: 'Bon de commande', d: 'On vérifie votre zone, on émet le bon de commande et on lance en moins de 24 h.' },
  { t: 'Les contacts arrivent', when: 'Espace client', d: 'Chaque contact est envoyé à vous seul : nom, téléphone, e-mail, code postal, propriétaire ou non, type de logement, chauffage, surface.' },
  { t: 'Vous rappelez', when: 'Dans l’heure, si possible', d: 'Plus le rappel est rapide, plus ça décroche. Un doublon ou un contact hors zone se signale en un clic : il est remplacé.' },
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
        <p className="eyebrow">Comment ça se passe</p>
        <h2 className="h2">De la commande <span className="serif grad-text">au premier contact.</span></h2>
        <p className="m2-lead">Ce qui se passe quand vous commandez des contacts. Pour le Pilotage, on vous explique tout lors de l’audit stratégique.</p>
        <Link to="/commander" className="btn btn-order">Commander des leads</Link>
      </div>
      <div className="m2-list" ref={list}>
        <span className="m2-rail" aria-hidden="true"><motion.span style={{ scaleY: fill }} /></span>
        <ol>{STEPS.map((s, i) => <Step key={s.t} s={s} i={i} />)}</ol>
      </div>
    </div>
  );
}
