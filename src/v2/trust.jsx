import React from 'react';

// Bande « Ils nous font déjà confiance » sous le hero, et en-tête du module de réservation
// (fondateur + garanties), inspirés de la landing de Grabb (capture envoyée par Ugo le 26/10/2026).
// Logos clients passés en blanc sur fond transparent (public/v2/logos/, tirés des logos d'origine du site).

// Rénovia et Decoratherm : monogramme + nom, dans le style des logos de Bienvendu.ch et Wealthbroker (captures d'Ugo, 26/10).
function RenoviaLogo() {
  return (
    <span className="logo-band-word">
      <span className="mono mono-fill" aria-hidden="true">R</span>
      <b style={{ fontWeight: 650, letterSpacing: '-0.02em' }}>Rénovia</b>
    </span>
  );
}

function DecorathermLogo() {
  return (
    <span className="logo-band-word">
      <span className="mono mono-line" aria-hidden="true"><i>D</i></span>
      <span style={{ letterSpacing: '-0.01em' }}><b style={{ fontWeight: 650 }}>Decora</b><span style={{ fontWeight: 400 }}>therm</span></span>
    </span>
  );
}

const LOGOS = [
  { name: 'Isolation d’Aquitaine', src: '/v2/logos/isolation-aquitaine.png', h: 30 },
  { name: 'Sud Ouest Isolation', src: '/v2/logos/sud-ouest-isolation.png', h: 34 },
  { name: 'TradeAuto', src: '/v2/logos/tradeauto.png', h: 34 },
  { name: 'Rénovia', node: <RenoviaLogo /> },
  { name: 'Madame la Gouvernante', src: '/v2/logos/mlg.png', h: 26 },
  { name: 'Decoratherm', node: <DecorathermLogo /> },
];

export function ClientLogos() {
  return (
    <div className="logo-band">
      <p className="logo-band-label">Ils nous font déjà confiance</p>
      <ul className="logo-band-logos">
        {LOGOS.map((l) => (
          <li key={l.name} title={l.name}>
            {l.node || <img src={l.src} alt={l.name} height={l.h} style={{ '--h': `${l.h}px` }} loading="lazy" />}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Check() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
  );
}

// Photo d'Ugo (envoyée le 26/10/2026, disque recadré) ; sans photo, ses initiales.
const FOUNDER_PHOTO = '/v2/ugo.jpg';

export function AuditHeader() {
  return (
    <>
      <div className="audit-head">
        <div className="audit-copy">
          <p className="audit-eyebrow">Réservation</p>
          <h2 className="h2" id="reserver">Réservez votre <span className="serif">audit offert.</span></h2>
          <p className="audit-lead">30 minutes avec Ugo, fondateur de Kairn. Un court formulaire, puis choisissez votre créneau.</p>
        </div>
        <div className="founder">
          {FOUNDER_PHOTO
            ? <img src={FOUNDER_PHOTO} alt="Ugo Gianeselli" width="64" height="64" />
            : <span className="founder-initials" aria-hidden="true">UG</span>}
          <div>
            <b>Ugo Gianeselli</b>
            <p>Fondateur de Kairn. Il mène tous les appels découverte.</p>
          </div>
        </div>
      </div>
      <ul className="audit-pills">
        <li><Check />Sans engagement</li>
        <li><Check />Prospects exclusifs</li>
        <li><Check />Plan d’action offert</li>
      </ul>
    </>
  );
}
