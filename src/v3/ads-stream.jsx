import React from 'react';
import { ImageStreamHero } from '../components/ui/image-stream-hero.jsx';
import { ADS } from './ads.js';

// Section « nos pubs » de la V2 (Ugo, 28/10/2026 : « les photos doivent être des photos de mes ads ») :
// le couloir du composant Image Stream Hero avec de vraies créas Meta de nos clients (public/ads/).
// Écartées : les créas qui imitent un article de presse ou un bandeau télé, pour ne pas les montrer comme de la vraie presse.

export default function AdsStream() {
  return (
    <ImageStreamHero images={ADS} cards={9} offsetLeft={9} className="ads-stream" path={{ cardHeight: 22.5 }}>
      <div className="ads-stream-inner">
        <div>
          <p className="eyebrow">Nos créas</p>
          <h2 className="h2">Des pubs faites pour <span className="serif grad-text">arrêter le défilement.</span></h2>
        </div>
        <p className="ads-stream-foot">De vraies créas Meta conçues pour nos clients installateurs : isolation des murs, combles, rénovation.</p>
      </div>
    </ImageStreamHero>
  );
}
