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

// Ordre : Isolation d'Aquitaine et Sud Ouest Isolation jamais côte à côte (Ugo, 29/10/2026).
const LOGOS = [
  { name: 'Isolation d’Aquitaine', src: '/v2/logos/isolation-aquitaine.png', h: 30 },
  { name: 'TradeAuto', src: '/v2/logos/tradeauto.png', h: 34 },
  { name: 'Sud Ouest Isolation', src: '/v2/logos/sud-ouest-isolation.png', h: 34 },
  { name: 'Rénovia', node: <RenoviaLogo /> },
  // Ajouté le 29/10/2026 à la demande d'Ugo (logo de la charte ED HABITAT, horizontal marine).
  { name: 'ED HABITAT', src: '/v2/logos/ed-habitat.svg', h: 50 },
  { name: 'Madame la Gouvernante', src: '/v2/logos/mlg.png', h: 26 },
  { name: 'Decoratherm', node: <DecorathermLogo /> },
];

// marquee : V2 de l'accueil (Ugo, 29/10/2026 : « améliore cette barre de clients, c'est hyper moche comme ça ») :
// sans carte, intitulé entre deux filets, logos gris qui défilent en continu, fondus sur les bords.
export function ClientLogos({ marquee = false }) {
  if (marquee) {
    const row = (dup) => LOGOS.map((l) => (
      <li key={`${l.name}${dup ? '-2' : ''}`} title={l.name} aria-hidden={dup || undefined}>
        {l.node || <img src={l.src} alt={dup ? '' : l.name} height={l.h} style={{ '--h': `${l.h}px` }} loading="lazy" />}
      </li>
    ));
    return (
      <div className="logo-marquee">
        <p className="logo-marquee-label"><span>Ils travaillent déjà avec Kairn</span></p>
        <div className="logo-marquee-track">
          <ul className="logo-band-logos">{row(false)}{row(true)}</ul>
        </div>
      </div>
    );
  }
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

// variante « appel » : V2 de l'accueil (proposition de copy du 29/10/2026), un appel avec Ugo pour les deux offres.
const AUDIT_COPY = {
  audit: { eyebrow: 'Réservation', h: 'Réservez votre', i: 'audit offert.', lead: '30 minutes avec Ugo, fondateur de Kairn. Un court formulaire, puis choisissez votre créneau.', founder: 'Fondateur de Kairn. Il mène tous les appels découverte.', pills: ['Sans engagement', 'Prospects exclusifs', 'Plan d’action offert'] },
  appel: { eyebrow: 'Audit', h: 'Votre audit offert,', i: 'en 30 minutes.', lead: 'En visio avec Ugo, fondateur de Kairn. Votre métier, votre zone, le volume qu’il vous faut : vous saurez si Kairn Leads ou Kairn Pilotage vous convient. Laissez votre numéro, puis choisissez un créneau.', founder: 'Fondateur de Kairn. C’est lui que vous aurez en visio.', pills: ['Sans engagement', 'Le fondateur, pas un commercial', 'Une campagne réelle montrée'] },
};

export function AuditHeader({ variant = 'audit' }) {
  const c = AUDIT_COPY[variant];
  return (
    <>
      <div className="audit-head">
        <div className="audit-copy">
          <p className="audit-eyebrow">{c.eyebrow}</p>
          <h2 className="h2" id="reserver">{c.h} <span className="serif">{c.i}</span></h2>
          <p className="audit-lead">{c.lead}</p>
        </div>
        <div className="founder">
          {FOUNDER_PHOTO
            ? <img src={FOUNDER_PHOTO} alt="Ugo Gianeselli" width="64" height="64" />
            : <span className="founder-initials" aria-hidden="true">UG</span>}
          <div>
            <b>Ugo Gianeselli</b>
            <p>{c.founder}</p>
          </div>
        </div>
      </div>
      <ul className="audit-pills">
        {c.pills.map((p) => <li key={p}><Check />{p}</li>)}
      </ul>
    </>
  );
}
