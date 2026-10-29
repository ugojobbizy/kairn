import React from 'react';
import { Link } from 'react-router-dom';
import { KairnLogo } from '../v2/layout.jsx';
import { Reveal } from '../v2/blocks.jsx';

// Tableau « Kairn Leads ou Kairn Pilotage » de la V2 (Ugo, 29/10/2026 : « améliore-moi le design de ce tableau »).
// Deux colonnes en piliers (fond posé case par case, arrondi en haut et en bas) : Leads sur fond clair, Pilotage sur bloc nuit.
// Chaque case : la réponse courte en gros, le détail en petit. Mêmes informations que ROWS dans offers.jsx.
const ROWS = [
  { k: 'Ce que vous achetez', a: ['Des contacts', 'de particuliers, à l’unité ou par volume'], b: ['Un pilotage', 'de vos campagnes Meta, avec landing page et CRM'] },
  { k: 'Qui produit les contacts', a: ['Nous, sur nos thématiques', 'pompe à chaleur, isolation par l’extérieur, photovoltaïque'], b: ['Nous, pour vous', 'sur votre métier à vous'] },
  { k: 'Budget publicitaire', a: ['Le nôtre', 'nous portons le risque'], b: ['Le vôtre', 'nous l’investissons et l’optimisons'] },
  { k: 'Quand la choisir', a: ['Votre métier est chez nous', 'il fait partie de nos thématiques'], b: ['Votre métier n’y est pas', 'ou vous voulez vos propres campagnes'] },
];
const OFFERS = [
  { key: 'a', word: 'Leads', kicker: 'Le produit', cls: 'is-leads', cta: <Link to="/commander" className="btn btn-order">Commander des leads</Link> },
  { key: 'b', word: 'Pilotage', kicker: 'Le service', cls: 'is-pilot', cta: <a href="#reserver" className="btn oc-btn-light">Réserver un appel</a> },
];

function Head({ o }) {
  return (
    <div className="oc-head">
      <span className="oc-kicker">{o.kicker}</span>
      <span className="oc-mark"><KairnLogo size={26} /><span>Kairn <b>{o.word}</b></span></span>
    </div>
  );
}

function Cell({ v }) {
  return <><strong>{v[0]}</strong><span className="oc-d">{v[1]}</span></>;
}

export default function OffersCompareV2() {
  return (
    <Reveal>
      {/* Ordinateur : une grille, les deux offres en piliers */}
      <div className="oc" role="table" aria-label="Kairn Leads ou Kairn Pilotage">
        <div className="oc-row" role="row">
          <div className="oc-k" role="columnheader" />
          {OFFERS.map((o) => <div key={o.key} className={`oc-c ${o.cls}`} role="columnheader"><Head o={o} /></div>)}
        </div>
        {ROWS.map((r) => (
          <div className="oc-row" role="row" key={r.k}>
            <div className="oc-k" role="rowheader">{r.k}</div>
            {OFFERS.map((o) => <div key={o.key} className={`oc-c ${o.cls}`} role="cell"><Cell v={r[o.key]} /></div>)}
          </div>
        ))}
        <div className="oc-row oc-foot" role="row">
          <div className="oc-k" />
          {OFFERS.map((o) => <div key={o.key} className={`oc-c ${o.cls}`}>{o.cta}</div>)}
        </div>
      </div>

      {/* Téléphone : une carte par offre */}
      <div className="oc-cards">
        {OFFERS.map((o) => (
          <div key={o.key} className={`oc-card ${o.cls}`}>
            <Head o={o} />
            <dl>
              {ROWS.map((r) => <div key={r.k}><dt>{r.k}</dt><dd><Cell v={r[o.key]} /></dd></div>)}
            </dl>
            {o.cta}
          </div>
        ))}
      </div>
    </Reveal>
  );
}
