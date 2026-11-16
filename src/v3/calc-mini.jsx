import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Encart « ce que rapporte une commande » de l'accueil (Ugo, 09/11/2026 : intégrer le calculateur à la page principale).
// Version courte à 3 curseurs, sans dépendance lourde : l'outil complet est sur /calculateur-cout-par-chantier.
// Valeurs de départ = exemples, pas des moyennes (affiché sous l'encart).

const eur = (n) => `${Math.round(n).toLocaleString('fr-FR')} €`;

function Curseur({ label, value, set, min, max, step, format }) {
  const p = ((value - min) / (max - min)) * 100;
  return (
    <label className="ccm-field">
      <span className="ccm-top"><span>{label}</span><b>{format(value)}</b></span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => set(Number(e.target.value))} style={{ '--p': `${p}%` }} aria-label={label} />
    </label>
  );
}

export default function CalcMini() {
  // Ugo, 16/11/2026 : « je veux pas leur montrer combien ils vont dépenser, je veux leur montrer combien ils vont gagner » ;
  // choix cliqué : chiffre d'affaires signé en gros, marge nette en dessous.
  const [leads, setLeads] = useState(100);
  const [prix, setPrix] = useState(28);
  const [taux, setTaux] = useState(7);
  const [panier, setPanier] = useState(12000);
  const [marge, setMarge] = useState(30);
  const cout = leads * prix;
  const chantiers = leads * (taux / 100);
  const ca = chantiers * panier;
  const net = ca * (marge / 100) - cout;
  const fois = cout ? ca / cout : 0;
  const nb = (n) => n.toLocaleString('fr-FR', { maximumFractionDigits: 1 });
  return (
    <div className="ccm">
      <div className="sec-head sec-head-left ccm-head">
        <p className="eyebrow">Calculateur</p>
        <h2 className="h2">Un lead se juge <span className="serif grad-text">au chantier signé.</span></h2>
        <p>Faites glisser : voyez ce qu’une commande de leads vous rapporte, avec vos propres chiffres.</p>
      </div>
      <div className="ccm-box">
        <div className="ccm-inputs">
          <Curseur label="Leads commandés" value={leads} set={setLeads} min={10} max={500} step={10} format={(v) => `${v}`} />
          <Curseur label="Prix du lead" value={prix} set={setPrix} min={5} max={100} step={1} format={(v) => `${v} € HT`} />
          <Curseur label="Leads qui deviennent un chantier" value={taux} set={setTaux} min={1} max={30} step={0.5} format={(v) => `${v.toLocaleString('fr-FR')} %`} />
          <Curseur label="Panier moyen d’un chantier" value={panier} set={setPanier} min={1000} max={40000} step={500} format={eur} />
          <Curseur label="Votre marge sur un chantier" value={marge} set={setMarge} min={5} max={60} step={1} format={(v) => `${v} %`} />
        </div>
        <div className="ccm-res" aria-live="polite">
          <p className="ccm-res-l">Chiffre d’affaires signé</p>
          <p className="ccm-res-v">{eur(ca)}</p>
          <p className="ccm-res-s">{nb(chantiers)} chantier{chantiers >= 2 ? 's' : ''} signé{chantiers >= 2 ? 's' : ''} pour {eur(cout)} HT de leads, soit {nb(fois)} fois la mise</p>
          <div className="ccm-net">
            <span>Marge nette, leads payés</span>
            <b className={net < 0 ? 'is-neg' : ''}>{net < 0 ? '−' : '+'} {eur(Math.abs(net))}</b>
          </div>
          <Link to="/calculateur-cout-par-chantier" className="btn btn-order ccm-btn">Faire le calcul complet</Link>
        </div>
      </div>
      <p className="ccm-note">Valeurs d’exemple, à remplacer par vos chiffres. Ce n’est pas une promesse de résultat : le taux de signature dépend de votre rapidité de rappel et de votre closing.</p>
    </div>
  );
}
