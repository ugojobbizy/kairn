import React, { useCallback, useState } from 'react';
import { TiltedGridHero } from '../components/ui/tilted-grid-hero.jsx';
import { Lightbox } from './campaign-fan.jsx';
import { CAMPAGNES } from './campagnes.js';

// Section « Vraies campagnes » : la bande courbe du composant Tilted Grid Hero (demandé par Ugo le 28/10/2026)
// sur un bloc nuit, avec les captures de src/v3/campagnes.js. Le bouton ouvre les mêmes captures en grand.
const IMAGES = CAMPAGNES.map((c) => ({ src: c.src, alt: `${c.titre}, ${c.secteur}` }));

export default function CampaignReel() {
  const [open, setOpen] = useState(null);
  const n = CAMPAGNES.length;
  const close = useCallback(() => setOpen(null), []);
  const move = useCallback((d) => setOpen((i) => (i + d + n) % n), [n]);
  return (
    <>
      <TiltedGridHero images={IMAGES} className="reel" tileHeight={22} axis={58}>
        <div className="reel-inner">
          <div className="reel-head">
            <p className="eyebrow">Preuve brute</p>
            <h2 className="h2">Pas des maquettes. <span className="serif grad-text">De vraies campagnes.</span></h2>
          </div>
          <div className="reel-foot">
            <p>Pubs, landing pages, CRM : les mêmes captures que celles que nos clients reçoivent.</p>
            <button type="button" className="btn btn-light reel-btn" onClick={() => setOpen(0)}>Voir les captures en grand</button>
          </div>
        </div>
      </TiltedGridHero>
      {open !== null && <Lightbox index={open} onClose={close} onMove={move} />}
    </>
  );
}
