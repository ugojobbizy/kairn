import React, { useMemo, useState } from 'react';
import { VIEWBOX, REGIONS, DEPARTEMENTS } from '../data/france-carte.js';
import './zone-picker.css';

// Choix de la zone d'une commande (Ugo, 30/10/2026) : France entière, régions, départements (3 au moins)
// ou zones climatiques H1, H2, H3, plusieurs choix possibles. Carte cliquable : le relief monte sous la sélection,
// qui passe au vert ; en mode régions, un clic sélectionne la région entière. Une liste à cocher double la carte (clavier, mobile).
// Valeur rendue : { mode, valeurs, departements, libelle, valide } ; « libelle » part dans le champ zone de la commande.

export const MIN_DEPARTEMENTS = 3;
const MODES = [['france', 'France entière'], ['regions', 'Régions'], ['departements', 'Départements'], ['climat', 'Zones climatiques']];
const CLIMATS = { H1: 'H1 · Nord, Est, montagne', H2: 'H2 · Ouest, Sud-Ouest', H3: 'H3 · Méditerranée' };
const unite = (mode, d) => (mode === 'regions' ? d.region : mode === 'climat' ? d.climat.slice(0, 2) : d.id);
const triDep = (a, b) => a.localeCompare(b, 'fr', { numeric: true });

export function zoneValeur(mode, valeurs) {
  const set = new Set(valeurs);
  const deps = mode === 'france' ? DEPARTEMENTS : DEPARTEMENTS.filter((d) => set.has(unite(mode, d)));
  const codes = deps.map((d) => d.id).sort(triDep);
  let libelle = 'France entière';
  if (mode === 'regions') libelle = `Régions : ${valeurs.map((r) => REGIONS[r]).join(', ')}`;
  if (mode === 'departements') libelle = `Départements : ${[...valeurs].sort(triDep).join(', ')}`;
  if (mode === 'climat') libelle = `Zones climatiques : ${[...valeurs].sort().join(', ')}`;
  const valide = mode === 'france' || (mode === 'departements' ? valeurs.length >= MIN_DEPARTEMENTS : valeurs.length > 0);
  return { mode, valeurs, departements: codes, libelle, valide };
}

// Relit le libellé enregistré sur une commande (reconduction, anciennes saisies « 33, 24, 47 »).
export function zoneDepuisTexte(txt) {
  const t = String(txt || '').trim();
  if (!t || /^france/i.test(t)) return zoneValeur('france', []);
  const corps = t.replace(/^[^:]*:\s*/, '');
  if (/^r[ée]gions/i.test(t)) {
    const noms = corps.split(/\s*,\s*/);
    return zoneValeur('regions', Object.keys(REGIONS).filter((k) => noms.includes(REGIONS[k])));
  }
  if (/^zones? climatiques?/i.test(t)) return zoneValeur('climat', ['H1', 'H2', 'H3'].filter((h) => corps.includes(h)));
  const ids = new Set(DEPARTEMENTS.map((d) => d.id));
  const codes = [...new Set((corps.toUpperCase().match(/\b(2A|2B|\d{2})\b/g) || []).filter((c) => ids.has(c)))];
  return zoneValeur('departements', codes);
}

export default function ZonePicker({ value, onChange }) {
  const mode = value?.mode || 'france';
  const valeurs = value?.valeurs || [];
  const [survol, setSurvol] = useState(null);
  const sel = new Set(valeurs);
  const set = (m, v) => onChange(zoneValeur(m, v));
  const basculer = (u) => set(mode, sel.has(u) ? valeurs.filter((x) => x !== u) : [...valeurs, u]);
  const actif = (d) => mode === 'france' || sel.has(unite(mode, d));
  const choisis = DEPARTEMENTS.filter(actif);
  const autres = DEPARTEMENTS.filter((d) => !actif(d));
  const nDeps = mode === 'france' ? DEPARTEMENTS.length : choisis.length;

  const liste = useMemo(() => {
    if (mode === 'regions') return Object.entries(REGIONS).sort((a, b) => a[1].localeCompare(b[1], 'fr')).map(([k, n]) => [k, n]);
    if (mode === 'climat') return Object.entries(CLIMATS);
    if (mode === 'departements') return [...DEPARTEMENTS].sort((a, b) => triDep(a.id, b.id)).map((d) => [d.id, `${d.id} · ${d.nom}`]);
    return [];
  }, [mode]);

  const nomSurvol = survol && (mode === 'regions' ? REGIONS[survol.region] : mode === 'climat' ? `Zone ${survol.climat.slice(0, 2)} (${survol.nom})` : `${survol.id} · ${survol.nom}`);
  const aide = mode === 'regions' ? 'Touchez une région pour la choisir.' : mode === 'departements' ? `Touchez vos départements : ${MIN_DEPARTEMENTS} au moins.` : mode === 'climat' ? 'Touchez une zone pour la choisir.' : 'Tous les départements de métropole.';

  return (
    <div className={`zp is-${mode}`}>
      <div className="zp-modes" role="radiogroup" aria-label="Type de zone">
        {MODES.map(([k, t]) => (
          <button type="button" role="radio" aria-checked={mode === k} key={k} className={mode === k ? 'is-on' : ''} onClick={() => set(k, k === mode ? valeurs : [])}>{t}</button>
        ))}
      </div>

      <div className="zp-body">
        <figure className="zp-map">
          <svg viewBox={VIEWBOX} role="img" aria-label={`Carte de France : ${nDeps} département${nDeps > 1 ? 's' : ''} choisi${nDeps > 1 ? 's' : ''}`}>
            <defs>
              <linearGradient id="zp-terre" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stopColor="#F4F7FC" /><stop offset="1" stopColor="#DDE4F0" /></linearGradient>
              <linearGradient id="zp-vert" x1="0" y1="0" x2="0.3" y2="1"><stop offset="0" stopColor="#4ADE80" /><stop offset="1" stopColor="#16A34A" /></linearGradient>
              <filter id="zp-socle" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="6" stdDeviation="7" floodColor="#1E3A8A" floodOpacity="0.18" /></filter>
              <filter id="zp-relief" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#14532D" floodOpacity="0.35" /></filter>
            </defs>
            <g filter="url(#zp-socle)">
              {autres.map((d) => (
                <path key={d.id} d={d.d} className={`zp-dep zp-c-${d.climat.slice(0, 2)}${survol && mode !== 'france' && unite(mode, survol) === unite(mode, d) ? ' is-hover' : ''}`}
                  onClick={mode === 'france' ? undefined : () => basculer(unite(mode, d))} onMouseEnter={() => setSurvol(d)} onMouseLeave={() => setSurvol(null)} />
              ))}
            </g>
            <g className="zp-sel" filter="url(#zp-relief)">
              {choisis.map((d) => (
                <path key={d.id} d={d.d} className="zp-dep is-on" onClick={mode === 'france' ? undefined : () => basculer(unite(mode, d))} onMouseEnter={() => setSurvol(d)} onMouseLeave={() => setSurvol(null)} />
              ))}
            </g>
          </svg>
          <figcaption>
            <span className="zp-survol" aria-live="polite">{nomSurvol || aide}</span>
            <small>Carte : Victor Cazanave, CC BY 4.0</small>
          </figcaption>
        </figure>

        <div className="zp-side">
          <p className="zp-count"><b>{nDeps}</b> département{nDeps > 1 ? 's' : ''} couvert{nDeps > 1 ? 's' : ''}</p>
          {mode === 'france' && <p className="zp-note">Vos contacts viennent de toute la France métropolitaine.</p>}
          {mode !== 'france' && (
            <>
              <ul className={`zp-list${mode === 'departements' ? ' is-long' : ''}`}>
                {liste.map(([k, t]) => (
                  <li key={k}><label className={sel.has(k) ? 'is-on' : ''}><input type="checkbox" checked={sel.has(k)} onChange={() => basculer(k)} />{t}</label></li>
                ))}
              </ul>
              {mode === 'departements' && valeurs.length > 0 && valeurs.length < MIN_DEPARTEMENTS && <p className="zp-warn">Encore {MIN_DEPARTEMENTS - valeurs.length} département{MIN_DEPARTEMENTS - valeurs.length > 1 ? 's' : ''} : {MIN_DEPARTEMENTS} au moins.</p>}
              {valeurs.length > 0 && <button type="button" className="zp-clear" onClick={() => set(mode, [])}>Tout désélectionner</button>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
