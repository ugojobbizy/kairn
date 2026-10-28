import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { Nav, Footer, useV2Favicon } from '../v2/layout.jsx';
import { Reveal } from '../v2/blocks.jsx';
import { CONTACT_EMAIL, WHATSAPP_NUMBER, whatsappUrl } from '../config.js';
import { PRODUITS, prixHT } from './produits.js';
import '../v2/v2.css';
import './v3.css';

// Page « Commander », d'après la page contact d'AKA Médias (capture d'Ugo, 28/10/2026), sur fond blanc.
// Une seule demande : acheter des leads (Kairn Leads) ou être accompagné (Kairn Pilotage).

const SOUHAITS = [['leads', 'Acheter des leads'], ['accompagnement', 'Être accompagné']];
const THEMATIQUES = [...PRODUITS.map((p) => [p.code, `${p.nom} (${prixHT(p.prix)} le contact)`]), ['Autre', 'Autre métier']];
const VOLUMES = ['10', '25', '50', '+ de 50'];

const STEPS = [
  ['Ugo vous lit', 'Pas de tri automatique : votre demande est lue par celui qui règle les campagnes.'],
  ['Ugo vous rappelle', 'Pour comprendre votre métier, votre zone et le rythme qu’il vous faut, et vous dire franchement si c’est Kairn Leads ou Kairn Pilotage.'],
  ['Le flux s’ouvre', 'Accès à votre espace client, puis vos premiers contacts. Sur une thématique déjà ouverte, ça peut aller vite.'],
];

// send : envoi personnalisé (espace client) ; par défaut, POST /api/commande.
export function OrderForm({ initial = {}, onDone, compact = false, send }) {
  const [f, setF] = useState({ souhait: 'leads', societe: '', nom: '', email: '', telephone: '', thematique: '', volume: '', zone: '', siret: '', website: '', ...initial });
  const [state, setState] = useState('idle');
  const [error, setError] = useState('');
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));
  const pick = (k, v) => setF((x) => ({ ...x, [k]: v }));
  const leads = f.souhait === 'leads';

  async function submit(e) {
    e.preventDefault();
    setError('');
    if (leads && !f.thematique) { setError('Choisissez une thématique.'); return; }
    setState('sending');
    try {
      if (send) {
        await send(f);
        setState('sent');
        onDone?.();
        return;
      }
      const r = await fetch('/api/commande', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...f, page: window.location.pathname }),
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
        <p>Ugo l’a dans sa boîte. Il vous rappelle au {f.telephone} pour faire le point.</p>
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
      <label className="od-field"><span>Zone d’intervention (départements)</span><input value={f.zone} onChange={set('zone')} placeholder="Ex. : 33, 40, 47, ou France entière" /></label>
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
  const initial = PRODUITS.some((p) => p.code === t) ? { thematique: t } : {};
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
                <h2>Vos premiers contacts peuvent <span className="serif grad-text">arriver vite.</span></h2>
                <p>Dites-nous la thématique, la zone et le volume qu’il vous faut : Ugo lit votre demande et vous rappelle. Pas d’accusé de réception automatique.</p>
                <p>Votre métier n’est pas dans la liste ? Choisissez « Être accompagné » : c’est Kairn Pilotage, sur votre propre budget.</p>
                <ul className="od-prices">
                  {PRODUITS.map((p) => <li key={p.code}><b>{p.nom}</b><span>{prixHT(p.prix)} le contact</span></li>)}
                </ul>
                <ul className="od-contact">
                  <li><a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></li>
                  {WHATSAPP_NUMBER && <li><a href={whatsappUrl('Bonjour, je souhaite commander des leads.')} target="_blank" rel="noopener noreferrer">Écrire sur WhatsApp</a></li>}
                </ul>
                <ol className="od-steps">
                  {STEPS.map(([h, d], i) => <li key={h}><span>{i + 1}</span><div><b>{h}</b><p>{d}</p></div></li>)}
                </ol>
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
