import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { Nav, Footer, useV2Favicon } from '../v2/layout.jsx';
import { Reveal } from '../v2/blocks.jsx';
import { CONTACT_EMAIL, WHATSAPP_NUMBER, whatsappUrl } from '../config.js';
import { PhoneReveal } from '../lib/phone.jsx';
import { PRODUITS, CONTENU_CONTACT, prixHT } from './produits.js';
import { THEMATIQUES_DEVIS } from './leads/codes.js';
import ZonePicker, { zoneDepuisTexte, MIN_DEPARTEMENTS } from './zone-picker.jsx';
import '../v2/v2.css';
import './v3.css';
import { getSource } from '../lib/source.js';

// Page « Commander », d'après la page contact d'AKA Médias (capture d'Ugo, 28/10/2026), sur fond blanc.
// Une seule demande : acheter des leads (Kairn Leads) ou être accompagné (Kairn Pilotage).

const SOUHAITS = [['leads', 'Acheter des leads'], ['accompagnement', 'Être accompagné']];
const THEMATIQUES = [
  ...PRODUITS.map((p) => [p.code, `${p.nom} (${prixHT(p.prix)} le contact)`]),
  ...THEMATIQUES_DEVIS.map((t) => [t.code, `${t.nom} (sur devis)`]),
  ['Autre', 'Autre métier'],
];
const VOLUMES = ['50', '100', '200', '+ de 200'];

// Promesses déjà validées par Ugo (produits.js GARANTIES, chapôs des pages leads) : rien de neuf ici.
const GARANTIES_OD = [
  ['Exclusif', 'Chaque contact part chez un seul installateur : vous.'],
  ['Remplacé', 'Un doublon ou un contact hors de votre zone est remplacé.'],
  ['Sans engagement', 'À partir de 50 contacts. Vous arrêtez quand vous voulez.'],
  ['Rien à payer en ligne', 'Bon de commande, puis virement.'],
];

const STEPS = [
  ['Une personne lit votre demande', 'Celle qui règle les campagnes, pas un robot.'],
  ['On vous rappelle', 'Zone, volume, prix, date de démarrage : tout est calé avant le bon de commande.'],
  ['Vos contacts arrivent', 'Dans votre espace client, avec le détail de chaque demande.'],
];

function Check() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>;
}


// send : envoi personnalisé (espace client) ; par défaut, POST /api/commande.
export function OrderForm({ initial = {}, onDone, compact = false, send }) {
  const [f, setF] = useState({ souhait: 'leads', societe: '', nom: '', email: '', telephone: '', thematique: '', volume: '', zone: '', siret: '', website: '', ...initial });
  const [state, setState] = useState('idle');
  const [error, setError] = useState('');
  // Zone choisie sur la carte (30/10/2026) ; son libellé part dans le champ zone de la demande.
  const [zone, setZone] = useState(() => zoneDepuisTexte(initial.zone));
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));
  const pick = (k, v) => setF((x) => ({ ...x, [k]: v }));
  const leads = f.souhait === 'leads';

  async function submit(e) {
    e.preventDefault();
    setError('');
    if (leads && !f.thematique) { setError('Choisissez une thématique.'); return; }
    if (!zone.valide) { setError(zone.mode === 'departements' ? `Choisissez ${MIN_DEPARTEMENTS} départements au moins.` : 'Choisissez au moins une zone sur la carte.'); return; }
    const demande = { ...f, zone: zone.libelle };
    setState('sending');
    try {
      if (send) {
        await send(demande);
        setState('sent');
        onDone?.();
        return;
      }
      const r = await fetch('/api/commande', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...demande, page: window.location.pathname, source: getSource() }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) {
        const msg = {
          bad_phone: 'Ce numéro de téléphone ne semble pas valide.',
          bad_email: 'Cette adresse e-mail ne semble pas valide.',
          bad_siret: 'Le SIRET compte 14 chiffres.',
          missing_fields: 'Indiquez votre société et votre nom.',
        }[data.error];
        throw new Error(msg || 'L’envoi n’a pas abouti.');
      }
      setState('sent');
      onDone?.();
    } catch (err) {
      setState('idle');
      setError(err.message);
    }
  }

  if (state === 'sent') {
    return (
      <div className="od-sent" role="status">
        <span className="od-sent-ico" aria-hidden="true">✓</span>
        <h3>Demande reçue.</h3>
        <p>Votre demande est bien arrivée. Nous vous rappelons au {f.telephone} pour faire le point.</p>
      </div>
    );
  }

  return (
    <form className={`od-form${compact ? ' is-compact' : ''}`} onSubmit={submit} noValidate>
      {!compact && <h2>Recevoir des leads</h2>}
      <fieldset className="od-field">
        <legend>Je souhaite</legend>
        <div className="od-chips">
          {SOUHAITS.map(([v, t]) => (
            <button type="button" key={v} className={`od-chip${f.souhait === v ? ' is-on' : ''}`} aria-pressed={f.souhait === v} onClick={() => pick('souhait', v)}>{t}</button>
          ))}
        </div>
      </fieldset>
      <div className="od-grid">
        <label className="od-field"><span>Société</span><input required value={f.societe} onChange={set('societe')} autoComplete="organization" /></label>
        <label className="od-field"><span>Nom</span><input required value={f.nom} onChange={set('nom')} autoComplete="name" /></label>
        <label className="od-field"><span>E-mail professionnel</span><input required type="email" value={f.email} onChange={set('email')} autoComplete="email" /></label>
        <label className="od-field"><span>Téléphone</span><input required type="tel" value={f.telephone} onChange={set('telephone')} autoComplete="tel" /></label>
      </div>
      <label className="od-field">
        <span>Thématique{leads ? '' : ' (facultatif)'}</span>
        <select value={f.thematique} onChange={set('thematique')}>
          <option value="">Choisir une thématique</option>
          {THEMATIQUES.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
        </select>
      </label>
      {leads && (
        <fieldset className="od-field">
          <legend>Volume souhaité par semaine</legend>
          <div className="od-chips">
            {VOLUMES.map((v) => (
              <button type="button" key={v} className={`od-chip${f.volume === v ? ' is-on' : ''}`} aria-pressed={f.volume === v} onClick={() => pick('volume', v)}>{v}</button>
            ))}
          </div>
        </fieldset>
      )}
      <fieldset className="od-field od-zone"><legend>Zone d’intervention</legend><ZonePicker value={zone} onChange={setZone} /></fieldset>
      <label className="od-field"><span>SIRET (facultatif)</span><input value={f.siret} onChange={set('siret')} inputMode="numeric" placeholder="14 chiffres" /></label>
      <input className="bk-trap" tabIndex={-1} autoComplete="off" value={f.website} onChange={set('website')} aria-hidden="true" />
      {error && <p className="od-err" role="alert">{error}</p>}
      <button type="submit" className="od-submit" disabled={state === 'sending'}>{state === 'sending' ? 'Envoi…' : 'Demander une proposition'}</button>
      <p className="od-legal">Vos données servent uniquement à traiter votre demande. <Link to="/confidentialite">Politique de confidentialité</Link>.</p>
    </form>
  );
}

export default function OrderPage() {
  useV2Favicon();
  const [params] = useSearchParams();
  const t = params.get('thematique');
  const initial = THEMATIQUES.some(([code]) => code === t && code !== 'Autre') ? { thematique: t } : {};
  return (
    <MotionConfig reducedMotion="user">
      <div className="v2 v3">
        <Nav light shop />
        <main className="od">
          <div className="aurora-grid" aria-hidden="true" />
          <div className="hero-halo" aria-hidden="true" />
          <div className="wrap od-inner">
            <Reveal className="od-head">
              <p className="eyebrow">Commander</p>
              <h1>Passer commande, ou simplement <span className="serif grad-text">nous parler.</span></h1>
            </Reveal>
            <div className="od-cols">
              <Reveal className="od-aside">
                <h2>Des particuliers qui attendent un appel, <span className="serif grad-text">dans vos départements.</span></h2>
                <p className="od-lead">Dites-nous le métier, la zone et le volume. On vous rappelle avec un prix et une date de démarrage.</p>

                <ul className="od-prices" aria-label="Prix par contact">
                  {PRODUITS.map((p) => (
                    <li key={p.code}>
                      <span className="od-p-name">{p.nom}</span>
                      <span className="od-p-price">{p.prix} €<small>HT / contact</small></span>
                    </li>
                  ))}
                </ul>
                <p className="od-note">Autres métiers (combles, toiture, fenêtres, assurance…) : sur devis, prix donné avant toute commande.</p>

                <div className="od-box">
                  <p className="od-box-t">Dans chaque contact</p>
                  <p className="od-box-d">{CONTENU_CONTACT.join(' · ')}</p>
                  <ul className="od-guar">
                    {GARANTIES_OD.map(([t, d]) => <li key={t}><span className="od-ck"><Check /></span><div><b>{t}</b><p>{d}</p></div></li>)}
                  </ul>
                </div>

                <p className="od-sub">Après votre demande</p>
                <ol className="od-steps">
                  {STEPS.map(([h, d], i) => <li key={h}><span>{i + 1}</span><div><b>{h}</b><p>{d}</p></div></li>)}
                </ol>

                <div className="od-help">
                  <p>Une question avant de commander ?</p>
                  <div className="od-help-links">
                    <PhoneReveal className="od-pill" label="Afficher le téléphone" />
                    {WHATSAPP_NUMBER && <a className="od-pill" href={whatsappUrl('Bonjour, je souhaite commander des leads.')} target="_blank" rel="noopener noreferrer">WhatsApp</a>}
                    <a className="od-pill" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                  </div>
                  <p className="od-pilot">Vous préférez vos propres campagnes, sur votre budget ? Choisissez « Être accompagné » dans le formulaire : c’est Kairn Pilotage.</p>
                </div>
              </Reveal>
              <Reveal delay={0.1} className="od-card"><OrderForm initial={initial} /></Reveal>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
