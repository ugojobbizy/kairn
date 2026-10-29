import React, { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { CAMPAGNES } from './campagnes.js';

// Captures de campagnes en éventail (d'après la section « Preuve brute » envoyée par Ugo, 28/10/2026).
// Un clic ouvre la capture en grand ; flèches du clavier pour passer de l'une à l'autre, Échap pour fermer.

// `items` : la liste montrée (par défaut les captures de campagnes ; la V2 y passe les pubs de src/v3/ads.js).
export function Lightbox({ index, onClose, onMove, items = CAMPAGNES }) {
  const c = items[index];
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onMove(1);
      if (e.key === 'ArrowLeft') onMove(-1);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; document.removeEventListener('keydown', onKey); };
  }, [onClose, onMove]);
  // Rendue dans <body> : un parent animé (transform) piégerait sinon la position fixe.
  return createPortal(
    <div className="lb" role="dialog" aria-modal="true" aria-label={c.titre} onClick={onClose}>
      <figure className="lb-fig" onClick={(e) => e.stopPropagation()}>
        <img src={c.src} alt={`${c.titre}, ${c.secteur}`} />
        <figcaption><span className="cf-tag">{c.tag}</span><b>{c.titre}</b><span>{c.secteur}</span><span className="lb-count">{index + 1} / {items.length}</span></figcaption>
      </figure>
      <button type="button" className="lb-btn lb-prev" onClick={(e) => { e.stopPropagation(); onMove(-1); }} aria-label="Image précédente">‹</button>
      <button type="button" className="lb-btn lb-next" onClick={(e) => { e.stopPropagation(); onMove(1); }} aria-label="Image suivante">›</button>
      <button type="button" className="lb-close" onClick={onClose} aria-label="Fermer">×</button>
    </div>,
    document.body,
  );
}

export default function CampaignFan() {
  const [open, setOpen] = useState(null);
  const n = CAMPAGNES.length;
  const close = useCallback(() => setOpen(null), []);
  const move = useCallback((d) => setOpen((i) => (i + d + n) % n), [n]);
  const mid = (n - 1) / 2;
  return (
    <>
      <ul className="cf">
        {CAMPAGNES.map((c, i) => {
          const o = i - mid;
          return (
            <li key={c.src} style={{ '--r': `${o * 5}deg`, '--y': `${Math.abs(o) * Math.abs(o) * 5}px`, '--z': n - Math.round(Math.abs(o)) }}>
              <button type="button" className="cf-card" onClick={() => setOpen(i)} aria-label={`Agrandir : ${c.titre}, ${c.secteur}`}>
                <img src={c.src} alt="" loading="lazy" />
                <span className="cf-info">
                  <span className="cf-tag">{c.tag}</span>
                  <b>{c.titre}</b>
                  <span>{c.secteur}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      {open !== null && <Lightbox index={open} onClose={close} onMove={move} />}
    </>
  );
}
