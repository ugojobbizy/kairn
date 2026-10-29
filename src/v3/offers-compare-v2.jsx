import React from 'react';
import { Link } from 'react-router-dom';
import { KairnLogo } from '../v2/layout.jsx';
import { Reveal } from '../v2/blocks.jsx';

// Tableau « Kairn Leads ou Kairn Pilotage » de la V2 (Ugo, 29/10/2026 : « améliore-moi le design de ce tableau »).
// Deux colonnes en piliers (fond posé case par case, arrondi en haut et en bas) : Leads sur fond clair, Pilotage sur bloc nuit.
// Chaque case : la réponse courte en gros, le détail en petit. Mêmes informations que ROWS dans offers.jsx.
// Lignes réécrites (proposition de copy du 29/10/2026) : 6 points qui comptent pour l'acheteur, prix compris.
// Pilotage : tarif et engagement non fixés au 29/10, donc « sur devis » et « à voir ensemble ».
// Kairn Leads couvre aussi d'autres secteurs (Ugo, 29/10/2026 : « je ne vends pas que des contacts de PAC, ITE et panneaux solaires »).
const ROWS = [
  { k: 'Ce que vous recevez', a: ['Des contacts de particuliers', 'chacun envoyé à un seul professionnel'], b: ['Vos campagnes Meta, pilotées', 'avec landing page et CRM, sur vos propres comptes'] },
  { k: 'Pour quels secteurs', a: ['Le vôtre', 'pompe à chaleur, isolation, solaire en continu ; les autres secteurs sur demande'], b: ['Tous', 'votre offre, votre zone, vos pubs'] },
  { k: 'Qui paie la pub', a: ['Kairn', 'vous n’avancez aucun budget publicitaire'], b: ['Vous', 'nous l’investissons et l’optimisons pour vous'] },
  { k: 'Ce que vous payez', a: ['Le contact', 'PAC 28 €, ITE 27 €, solaire 35 € HT ; autres secteurs : prix donné avant commande'], b: ['Sur devis', 'selon votre métier et votre budget'] },
  { k: 'Engagement', a: ['Aucun', 'à partir de 50 contacts, vous arrêtez quand vous voulez'], b: ['À voir ensemble', 'pendant l’appel avec Ugo'] },
  { k: 'Si un contact est mauvais', a: ['Doublon ou hors zone : remplacé', 'signalé depuis votre espace client ; les faux numéros ne sont pas remplacés'], b: ['Vous le voyez', 'le CRM relie chaque contact à sa pub : on coupe celles qui amènent les mauvais'] },
];
const OFFERS = [
  { key: 'a', word: 'Leads', kicker: 'Le produit', cls: 'is-leads', cta: <Link to="/commander" className="btn btn-order">Commander des leads</Link> },
  { key: 'b', word: 'Pilotage', kicker: 'Le service', cls: 'is-pilot', cta: <a href="#reserver" className="btn oc-btn-light">Réserver un appel</a> },
];

function Head({ o }) {
  return (
    <div className="oc-head">
      <span className="oc-kicker">{o.kicker}</span>
      <span className="oc-mark"><KairnLogo size={26} /><span><b>{o.word}</b></span></span>
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
