import React, { useId, useState } from 'react';

// Composants interactifs insérés dans les articles par <div data-widget="…">…</div><!--/widget-->.

const eur = (n) => (Number.isFinite(n) ? n.toLocaleString('fr-FR', { maximumFractionDigits: n < 100 ? 2 : 0 }) : '0') + ' €';
const num = (v) => {
  const n = parseFloat(String(v).replace(',', '.').replace(/\s/g, ''));
  return Number.isFinite(n) && n >= 0 ? n : 0;
};

function Field({ label, hint, suffix, value, onChange }) {
  const id = useId();
  return (
    <div className="calc-field">
      <label htmlFor={id}>{label}</label>
      <div className="calc-input">
        <input id={id} inputMode="decimal" value={value} onChange={(e) => onChange(e.target.value)} />
        <span>{suffix}</span>
      </div>
      {hint && <small>{hint}</small>}
    </div>
  );
}

// Coût par lead maximum = marge par vente × taux de signature × part de la marge consacrée à l'acquisition.
export default function CplCalculator() {
  const [margin, setMargin] = useState('1500');
  const [close, setClose] = useState('10');
  const [share, setShare] = useState('30');
  const m = num(margin);
  const c = num(close) / 100;
  const s = num(share) / 100;
  const cac = m * s;
  const cpl = cac * c;
  const breakeven = m * c;

  return (
    <div className="calc" role="group" aria-label="Calculateur de coût par lead maximum">
      <p className="calc-title">Calculez votre coût par lead maximum</p>
      <p className="calc-note">Valeurs d’exemple : remplacez-les par les vôtres.</p>
      <div className="calc-fields">
        <Field label="Marge brute par vente" hint="Prix de vente moins le coût direct (matériel, sous-traitance)" suffix="€" value={margin} onChange={setMargin} />
        <Field label="Taux de signature des leads" hint="Sur 100 demandes reçues, combien signent ?" suffix="%" value={close} onChange={setClose} />
        <Field label="Part pour l’acquisition" hint="Part de la marge que vous acceptez de dépenser pour gagner un client" suffix="%" value={share} onChange={setShare} />
      </div>
      <dl className="calc-out" aria-live="polite">
        <div className="is-main">
          <dt>Coût par lead maximum</dt>
          <dd>{eur(cpl)}</dd>
        </div>
        <div>
          <dt>Coût maximum pour signer un client</dt>
          <dd>{eur(cac)}</dd>
        </div>
        <div>
          <dt>Au-delà de ce coût par lead, chaque vente vous coûte plus qu’elle ne rapporte</dt>
          <dd>{eur(breakeven)}</dd>
        </div>
      </dl>
    </div>
  );
}
