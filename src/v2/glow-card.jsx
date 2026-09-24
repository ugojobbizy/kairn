import React, { useEffect, useRef } from 'react';

// Carte à bordure lumineuse qui suit le pointeur.
// Adapté de « spotlight-card » (21st.dev) : JSX + CSS de v2.css au lieu de TS + Tailwind.
// Différence volontaire : pas de `touch-action: none`, qui bloquait le défilement
// sur mobile quand le doigt partait d'une carte.

const glowColorMap = {
  // Palette Kairn : reste dans les bleus (≈ bleu ciel à gauche de l'écran → indigo à droite)
  kairn: { base: 205, spread: 45 },
  blue: { base: 220, spread: 200 },
  purple: { base: 280, spread: 300 },
  green: { base: 120, spread: 200 },
  red: { base: 0, spread: 200 },
  orange: { base: 30, spread: 200 },
};

export function GlowCard({ children, className = '', glowColor = 'blue', radius = 14, as: Tag = 'div' }) {
  const cardRef = useRef(null);

  useEffect(() => {
    const syncPointer = (e) => {
      const el = cardRef.current;
      if (!el) return;
      el.style.setProperty('--x', e.clientX.toFixed(2));
      el.style.setProperty('--xp', (e.clientX / window.innerWidth).toFixed(2));
      el.style.setProperty('--y', e.clientY.toFixed(2));
      el.style.setProperty('--yp', (e.clientY / window.innerHeight).toFixed(2));
    };
    document.addEventListener('pointermove', syncPointer);
    return () => document.removeEventListener('pointermove', syncPointer);
  }, []);

  const { base, spread } = glowColorMap[glowColor];

  return (
    <Tag
      ref={cardRef}
      data-glow
      className={`glow-card ${className}`}
      style={{ '--base': base, '--spread': spread, '--radius': radius }}
    >
      <div data-glow aria-hidden="true" />
      {children}
    </Tag>
  );
}
