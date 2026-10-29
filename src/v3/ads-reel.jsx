import React, { useCallback, useEffect, useState } from 'react';
import { TiltedGridHero } from '../components/ui/tilted-grid-hero.jsx';
import { Lightbox } from './campaign-fan.jsx';
import { ADS } from './ads.js';

// Bande courbe de la V2 avec les pubs Meta au lieu des captures de campagnes
// (Ugo, 29/10/2026 : « utilisé finalement pour mettre les ads et pas les maquettes des campagnes »).
const IMAGES = ADS.map((a) => ({ src: a.src, alt: `${a.titre}, ${a.secteur}` }));

export default function AdsReel() {
  const [open, setOpen] = useState(null);
  const n = ADS.length;
  const close = useCallback(() => setOpen(null), []);
  const move = useCallback((d) => setOpen((i) => (i + d + n) % n), [n]);
  // Sur téléphone, les pubs du bord se courbent vers l'écran et grandissent : on les réduit pour ne pas couvrir le texte.
  const [small, setSmall] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const on = () => setSmall(mq.matches);
    on(); mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return (
    <>
      <TiltedGridHero images={IMAGES} className="reel reel-ads" tileHeight={small ? 25 : 34} aspectRatio={4 / 5} gap={5} axis={52} speed={3.2}>
        <div className="reel-inner">
          <div className="reel-head">
            <p className="eyebrow">Nos pubs</p>
            <h2 className="h2">Pas des modèles. <span className="serif grad-text">Nos propres pubs.</span></h2>
          </div>
          <div className="reel-foot">
            <p>Des créas Meta écrites et dessinées par Kairn pour nos clients installateurs : isolation des murs, des combles.</p>
            <button type="button" className="btn btn-light reel-btn" onClick={() => setOpen(0)}>Voir les pubs en grand</button>
          </div>
        </div>
      </TiltedGridHero>
      {open !== null && <Lightbox index={open} onClose={close} onMove={move} items={ADS} />}
    </>
  );
}
