import React from 'react';
import { Reveal } from '../v2/blocks.jsx';

// Les quatre piliers de Kairn Leads (Ugo, 30/10/2026 : « pour la fraîcheur c'est vrai qu'il faut le mettre plus en avant,
// la qualification aussi, le flux régulier aussi et l'exclusivité »). Aucun chiffre de résultat : Ugo préfère en parler au téléphone.
// Flux journalier, pas hebdomadaire (Ugo, 30/10/2026). Textes : brand/copy-v3-proposition.md, section 2.
const PILIERS = [
  { tag: 'Frais', h: 'Il vient de remplir le formulaire.', p: 'Le contact arrive dans votre espace client dès que le particulier valide sa demande, pas trois jours après dans un fichier. Vous l’appelez pendant qu’il attend votre appel.' },
  { tag: 'Qualifié', h: 'Vous savez qui vous appelez.', p: 'Propriétaire ou locataire, maison ou appartement, chauffage actuel, surface, code postal. Vos commerciaux décrochent avec le projet sous les yeux.' },
  { tag: 'Tous les jours', h: 'Un flux, pas un lot.', p: 'Les contacts tombent chaque jour, pas 50 d’un coup puis plus rien. Vos commerciaux ont des appels à passer tous les matins, et vous ne connaissez plus le mois plein suivi du mois vide.' },
  { tag: 'À vous seul', h: 'Aucun autre installateur ne l’appelle.', p: 'Chaque contact est envoyé à un seul professionnel, dans vos départements. Quand vous appelez, vous n’êtes pas le cinquième de la journée.' },
];

export default function Piliers() {
  return (
    <div className="pil">
      <Reveal className="sec-head sec-head-left">
        <p className="eyebrow">Kairn Leads</p>
        <h2 className="h2">Ce qui fait qu’un contact se signe, <span className="serif grad-text">on s’en occupe avant qu’il arrive.</span></h2>
        <p>Le reste se joue au téléphone. Et ça, vos commerciaux savent faire.</p>
      </Reveal>
      <ol className="pil-grid">
        {PILIERS.map((x, i) => (
          <Reveal as="li" key={x.tag} delay={i * 0.06} className="pil-card">
            <span className="pil-tag"><b>{String(i + 1).padStart(2, '0')}</b>{x.tag}</span>
            <h3>{x.h}</h3>
            <p>{x.p}</p>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}
