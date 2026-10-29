import React from 'react';
import { Link } from 'react-router-dom';

// Remplace la bande des pubs Meta sur la V2 (Ugo, 29/10/2026 : « on va la remplacer par à quoi ressemble un lead dans son CRM »).
// Fiche d'un lead telle qu'elle arrive dans l'espace client, avec les champs réels de la table leads.
// Données fictives et masquées : aucune personne réelle. Principe repris de Cache Brain (SPIO #5 Funnel Building, m152) :
// appuyer chaque promesse par une démonstration du produit.
const REPONSES = [
  ['Statut', 'Propriétaire'],
  ['Logement', 'Maison'],
  ['Chauffage', 'Gaz'],
  ['Surface', '110 à 150 m²'],
];
const POINTS = [
  'Ses coordonnées et ses réponses au formulaire : propriétaire ou locataire, logement, chauffage, surface.',
  'À vous seul : aucun autre installateur ne reçoit ce contact.',
  'Doublon ou hors zone : signalé en un clic, remplacé.',
  'Export CSV en un clic vers votre CRM ou votre tableur.',
];

function Check() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>;
}

export default function LeadSample() {
  return (
    <div className="ls">
      <div className="ls-text">
        <p className="eyebrow">Un lead Kairn</p>
        <h2 className="h2">Un lead, <span className="serif grad-text">pas juste un numéro.</span></h2>
        <p className="ls-lead">Chaque contact arrive dans votre espace client. Vous savez qui vous appelez, et pour quel projet, avant de décrocher.</p>
        <ul className="ls-points">
          {POINTS.map((p) => <li key={p}><Check />{p}</li>)}
        </ul>
        <Link to="/plateforme" className="btn ls-btn">Voir la plateforme</Link>
      </div>

      <figure className="ls-card" aria-label="Exemple de fiche lead, données fictives">
        <div className="ls-top">
          <span className="ls-tag">Exemple fictif</span>
          <span className="ls-new">Nouveau</span>
        </div>
        <div className="ls-who">
          <span className="ls-avatar" aria-hidden="true">ML</span>
          <div>
            <b>Marie L.</b>
            <span>Pessac · 33600</span>
          </div>
        </div>
        <p className="ls-theme">Isolation des murs par l’extérieur</p>
        <dl className="ls-contact">
          <div><dt>Téléphone</dt><dd>06 •• •• •• 18</dd><span className="ls-call">Appeler</span></div>
          <div><dt>E-mail</dt><dd>m•••••@gmail.com</dd></div>
        </dl>
        <p className="ls-sub">Réponses au formulaire</p>
        <dl className="ls-grid">
          {REPONSES.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
        </dl>
        <div className="ls-foot">
          <span>Reçu aujourd’hui à 10:42</span>
          <span className="ls-excl">Exclusif</span>
        </div>
      </figure>
    </div>
  );
}
