import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Encart « coût par chantier » de l'accueil (Ugo, 09/11/2026 : intégrer le calculateur à la page principale).
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
  const [prix, setPrix] = useState(28);
  const [taux, setTaux] = useState(7);
  const [panier, setPanier] = useState(12000);
  const parChantier = taux ? prix / (taux / 100) : 0;
  const part = panier ? (parChantier / panier) * 100 : 0;
  return (
    <div className="ccm">
      <div className="sec-head sec-head-left ccm-head">
        <p className="eyebrow">Calculateur</p>
        <h2 className="h2">Un lead se juge <span className="serif grad-text">au chantier signé.</span></h2>
        <p>Faites glisser : le prix d’un lead ne veut rien dire tant qu’on ne le rapporte pas à vos signatures.</p>
      </div>
      <div className="ccm-box">
        <div className="ccm-inputs">
          <Curseur label="Prix du lead" value={prix} set={setPrix} min={5} max={100} step={1} format={(v) => `${v} € HT`} />
          <Curseur label="Leads qui deviennent un chantier" value={taux} set={setTaux} min={1} max={30} step={0.5} format={(v) => `${v.toLocaleString('fr-FR')} %`} />
          <Curseur label="Panier moyen d’un chantier" value={panier} set={setPanier} min={1000} max={40000} step={500} format={eur} />
        </div>
        <div className="ccm-res" aria-live="polite">
          <p className="ccm-res-l">Coût en leads par chantier signé</p>
          <p className="ccm-res-v">{eur(parChantier)}</p>
          <p className="ccm-res-s">soit {part.toLocaleString('fr-FR', { maximumFractionDigits: 1 })} % du montant du chantier</p>
          <Link to="/calculateur-cout-par-chantier" className="btn btn-order ccm-btn">Faire le calcul complet</Link>
        </div>
      </div>
      <p className="ccm-note">Valeurs d’exemple, à remplacer par vos chiffres. Le calcul complet compare aussi deux offres.</p>
    </div>
  );
}
