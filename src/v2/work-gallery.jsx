import React from 'react';
import { Reveal } from './blocks.jsx';

// Galerie de sites livrés (captures réelles des clients).
const WORK = [
  { img: '/v2/tradeauto-landing.jpg', w: 1489, h: 914, url: 'tradeauto.ch', name: 'TradeAuto', what: 'Site, tunnel de reprise de véhicule, CRM et tableau de bord, livrés en 4 semaines.', alt: 'Page d’accueil du site TradeAuto, reprise de véhicules en Suisse.' },
  { img: '/v2/isolation-aquitaine-landing.jpg', w: 1440, h: 900, url: 'isolation-aquitaine', name: 'Isolation d’Aquitaine', what: 'Landing page avec simulateur d’aides en 5 étapes, branchée sur un CRM sur mesure.', alt: 'Landing page Isolation d’Aquitaine : titre « Froide l’hiver, trop chaude l’été », simulateur d’aides.' },
  { img: '/v2/capture-landingpage.jpg', w: 1225, h: 822, url: 'renovia.fr', name: 'Rénovia', what: 'Parcours de simulation des aides à la rénovation, qualification et tracking serveur.', alt: 'Page d’accueil Rénovia : simulateur d’aides à la rénovation énergétique à partir de l’adresse.' },
];

export default function WorkGallery() {
  return (
    <div className="wb-work">
      {WORK.map((x, i) => (
        <Reveal key={x.name} delay={i * 0.08} as="figure" className="wb-shot">
          <div className="shot-bar" aria-hidden="true"><span className="shot-dots"><i /><i /><i /></span><span className="shot-url">{x.url}</span></div>
          <img src={x.img} width={x.w} height={x.h} loading="lazy" decoding="async" alt={x.alt} />
          <figcaption><b>{x.name}</b><span>{x.what}</span></figcaption>
        </Reveal>
      ))}
    </div>
  );
}
