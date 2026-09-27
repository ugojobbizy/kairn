import React from 'react';
import { motion } from 'framer-motion';

// Briques partagées par les pages de la V2 : icônes, pastille, halo, apparition au scroll, grille bento, FAQ.

export const EASE = [0.22, 0.8, 0.24, 1];

// ─ icônes (tracés type Lucide) ─
export const ICONS = {
  arrow: <path d="M7 17 17 7M8 7h9v9" />,
  megaphone: <><path d="m3 11 18-5v12L3 14v-3z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" /></>,
  layout: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></>,
  filter: <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />,
  chart: <><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" /></>,
  down: <><path d="m22 17-8.5-8.5-5 5L2 7" /><path d="M16 17h6v-6" /></>,
  calendar: <><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>,
  code: <><path d="m16 18 6-6-6-6" /><path d="m8 6-6 6 6 6" /></>,
  layers: <><path d="m12 2 10 5-10 5L2 7l10-5z" /><path d="m2 17 10 5 10-5" /><path d="m2 12 10 5 10-5" /></>,
  check: <path d="M20 6 9 17l-5-5" />,
  plus: <path d="M12 5v14M5 12h14" />,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
  bolt: <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />,
};

export function Icon({ name, size = 20, stroke = 1.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}


export function Pill({ children }) {
  return <span className="pill"><span className="pill-dot"><i /></span>{children}</span>;
}

// Fond sombre à deux halos (indigo en haut à gauche, bleu nuit en bas à droite),
// reproduit d'après l'aperçu du composant 21st.dev « LivingOrigami bg ».
export function Glow() {
  return <div className="glow-bg" aria-hidden="true" />;
}

// Apparition au scroll
export function Reveal({ children, delay = 0, y = 24, className, as = 'div' }) {
  const M = motion[as];
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </M>
  );
}

// ─ Bento (adapté de 21st.dev « Bento Grid ») ─
const gridVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const cardVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: EASE } },
};

export function BentoGrid({ children }) {
  return (
    <motion.div className="bento" variants={gridVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}>
      {children}
    </motion.div>
  );
}

export function BentoCard({ title, description, icon, span, dark, children }) {
  return (
    <motion.article variants={cardVariants} className={`bcard${span ? ' span-2' : ''}${dark ? ' is-dark' : ''}`}>
      <div className="bcard-visual" aria-hidden="true">{children}</div>
      <div className="bcard-body">
        <div className="bcard-title">
          <span className="bcard-ico"><Icon name={icon} /></span>
          <h3>{title}</h3>
        </div>
        <p>{description}</p>
      </div>
    </motion.article>
  );
}

// Questions / réponses dépliables
export function FaqList({ items }) {
  return (
    <div className="faq">
      {items.map(([q, a], i) => (
        <Reveal key={q} delay={i * 0.06}>
          <details>
            <summary>{q}<span className="plus"><Icon name="plus" size={16} stroke={2.2} /></span></summary>
            <p>{a}</p>
          </details>
        </Reveal>
      ))}
    </div>
  );
}
