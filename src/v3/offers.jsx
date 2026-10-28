import React from 'react';
import { Link } from 'react-router-dom';
import { KairnLogo, ArrowUpRight } from '../v2/layout.jsx';
import { Reveal } from '../v2/blocks.jsx';

// Les deux offres de Kairn, d'après la page « Produit ou service ? » d'AKA Médias (captures d'Ugo, 28/10/2026) :
// Kairn Leads (le produit : contacts sur nos thématiques, notre budget pub) et Kairn Pilotage (le service : vos campagnes, votre budget).

const ROWS = [
  ['Ce que vous achetez', 'Des contacts de particuliers, à l’unité ou par volume', 'Le pilotage de vos campagnes Meta, avec landing page et CRM'],
  ['Qui produit les contacts', 'Nous, sur nos thématiques déjà ouvertes : pompe à chaleur, isolation par l’extérieur, photovoltaïque', 'Nous, mais pour vous : sur votre métier à vous'],
  ['Budget publicitaire', 'Le nôtre : nous portons le risque', 'Le vôtre : nous l’investissons et l’optimisons'],
  ['Quand la choisir', 'Votre métier fait partie de nos thématiques', 'Votre métier n’est pas chez nous, ou vous voulez vos propres campagnes'],
];

function Mark({ word }) {
  return (
    <span className="of-mark">
      <KairnLogo size={30} />
      <span>Kairn <b>{word}</b></span>
    </span>
  );
}

function Check() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>;
}

export function OffersCompare() {
  return (
    <Reveal>
    <div className="of-table" role="table" aria-label="Kairn Leads ou Kairn Pilotage">
      <div className="of-row of-head" role="row">
        <div role="columnheader" />
        <div className="of-c1" role="columnheader"><Mark word="Leads" /><p className="of-kicker">Kairn Leads · le produit</p></div>
        <div className="of-c2" role="columnheader"><Mark word="Pilotage" /><p className="of-kicker">Kairn Pilotage · le service</p></div>
      </div>
      {ROWS.map(([k, a, b]) => (
        <div className="of-row" role="row" key={k}>
          <div className="of-k" role="rowheader">{k}</div>
          <div className="of-c1" role="cell">{a}</div>
          <div className="of-c2" role="cell">{b}</div>
        </div>
      ))}
    </div>
    </Reveal>
  );
}

export function OfferCards() {
  return (
    <div className="of-cards">
      <Reveal className="of-card is-product">
        <span className="of-tag">Un produit</span>
        <Mark word="Leads" />
        <h3>On produit. Vous achetez.</h3>
        <p>Nous investissons <strong>notre propre budget publicitaire</strong> sur Meta, sur trois thématiques : pompe à chaleur, isolation par l’extérieur, photovoltaïque. Vous achetez les contacts à l’unité, chacun envoyé à un seul installateur.</p>
        <ul>
          <li><Check />Contacts exclusifs, jamais revendus</li>
          <li><Check />Aucun budget publicitaire à avancer, sans engagement</li>
          <li><Check />Faux numéro, doublon, hors zone : remplacé</li>
        </ul>
        <Link to="/commander" className="btn of-btn">Commander des leads <span className="btn-ico"><ArrowUpRight /></span></Link>
      </Reveal>
      <Reveal className="of-card is-service" delay={0.08}>
        <span className="of-tag">Un service</span>
        <Mark word="Pilotage" />
        <h3>Vous investissez. On pilote.</h3>
        <p>Votre métier n’est pas dans nos thématiques, ou vous voulez vos propres campagnes ? Nous prenons en main votre acquisition sur Meta : <strong>votre budget</strong>, vos comptes, notre méthode.</p>
        <ul>
          <li><Check />Campagnes Meta montées sur votre offre</li>
          <li><Check />Landing page et CRM sur mesure : chaque lead relié à sa pub</li>
          <li><Check />Vos comptes, vos données, vos leads : tout reste chez vous</li>
        </ul>
        <a href="#reserver" className="btn of-btn">Réserver un appel <span className="btn-ico"><ArrowUpRight /></span></a>
      </Reveal>
    </div>
  );
}
