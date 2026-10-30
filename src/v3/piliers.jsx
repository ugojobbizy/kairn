import React from 'react';
import { Reveal } from '../v2/blocks.jsx';

// Les quatre piliers de Kairn Leads (Ugo, 30/10/2026 : « pour la fraîcheur c'est vrai qu'il faut le mettre plus en avant,
// la qualification aussi, le flux régulier aussi et l'exclusivité »). Aucun chiffre de résultat : Ugo préfère en parler au téléphone.
// Flux journalier, pas hebdomadaire (Ugo, 30/10/2026). Textes : brand/copy-v3-proposition.md, section 2.
// Design enrichi (Ugo, 30/10/2026 : « améliore le design de ça c'est trop simple ») : un visuel produit par carte.
// Direction « cartes illustrées » choisie par Ugo (30/10/2026), contre un bento.
// Visuels : données fictives, aucun délai ni volume chiffré (non fournis par Ugo).

function Check() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>;
}

function VisFrais() {
  return (
    <div className="pv pv-frais" aria-hidden="true">
      <div className="pv-toast is-back"><span className="pv-dot" /><b>Nouveau contact</b><span>Pompe à chaleur · 31</span></div>
      <div className="pv-toast"><span className="pv-dot is-live" /><b>Nouveau contact</b><span>Isolation des murs · 33</span><em>À l’instant</em></div>
    </div>
  );
}

function VisQualifie() {
  const rows = [['Statut', 'Propriétaire'], ['Logement', 'Maison'], ['Chauffage', 'Gaz'], ['Surface', '110 à 150 m²']];
  return (
    <div className="pv pv-qualif" aria-hidden="true">
      {rows.map(([k, v]) => <div key={k} className="pv-row"><span>{k}</span><b><Check />{v}</b></div>)}
    </div>
  );
}

function VisFlux() {
  const jours = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  const h = [62, 74, 58, 70, 66, 54, 60];
  return (
    <div className="pv pv-flux" aria-hidden="true">
      {jours.map((j, i) => (
        <div key={i} className="pv-col"><span className="pv-bar" style={{ height: `${h[i]}%`, animationDelay: `${i * 0.08}s` }} /><span className="pv-day">{j}</span></div>
      ))}
    </div>
  );
}

function VisSeul() {
  return (
    <div className="pv pv-seul" aria-hidden="true">
      <span className="pv-lead">Contact</span>
      <svg className="pv-lines" viewBox="0 0 200 90" preserveAspectRatio="none">
        <path d="M100 0 C100 30 30 40 30 90" className="is-off" />
        <path d="M100 0 C100 30 170 40 170 90" className="is-off" />
        <path d="M100 0 L100 90" className="is-on" />
      </svg>
      <div className="pv-targets">
        <span className="is-off">Autre</span>
        <span className="is-on">Vous</span>
        <span className="is-off">Autre</span>
      </div>
    </div>
  );
}

const PILIERS = [
  { tag: 'Frais', Vis: VisFrais, h: 'Il vient de remplir le formulaire.', p: 'Le contact arrive dans votre espace client quelques secondes après sa demande, pas trois jours après dans un fichier. Vous l’appelez pendant qu’il attend votre appel.' },
  { tag: 'Qualifié', Vis: VisQualifie, h: 'Vous savez qui vous appelez.', p: 'Propriétaire ou locataire, maison ou appartement, chauffage actuel, surface, code postal. Vos commerciaux décrochent avec le projet sous les yeux.' },
  { tag: 'Tous les jours', Vis: VisFlux, h: 'Un flux, pas un lot.', p: 'Les contacts tombent chaque jour, pas 50 d’un coup puis plus rien. Vos commerciaux ont des appels à passer tous les matins, et vous ne connaissez plus le mois plein suivi du mois vide.' },
  { tag: 'À vous seul', Vis: VisSeul, h: 'Aucun autre installateur ne l’appelle.', p: 'Chaque contact est envoyé à un seul professionnel, dans vos départements. Quand vous appelez, vous n’êtes pas le cinquième de la journée.' },
];

export default function Piliers() {
  return (
    <div className="pil">
      <Reveal className="sec-head sec-head-left">
        <p className="eyebrow">Kairn Leads</p>
        <h2 className="h2">Quatre raisons <span className="serif grad-text">de signer plus.</span></h2>
        <p>Le reste se joue au téléphone. Et ça, vos commerciaux savent faire.</p>
      </Reveal>
      <ol className="pil-grid">
        {PILIERS.map(({ tag, Vis, h, p }, i) => (
          <Reveal as="li" key={tag} delay={i * 0.06} className="pil-card">
            <div className="pil-vis"><Vis /></div>
            <div className="pil-txt">
              <span className="pil-tag"><b>{String(i + 1).padStart(2, '0')}</b>{tag}</span>
              <h3>{h}</h3>
              <p>{p}</p>
            </div>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}
