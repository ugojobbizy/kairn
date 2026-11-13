import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { Nav, Footer, useV2Favicon } from '../v2/layout.jsx';
import { Reveal } from '../v2/blocks.jsx';
import { CONTACT_EMAIL } from '../config.js';
import '../v2/v2.css';
import './v3.css';

// Page « Devenir apporteur d'affaires » (Ugo, 13/11/2026) : candidature, validée par Ugo dans Kairn Admin
// (/gestion/apporteurs), puis e-mail d'accès à l'espace apporteur (/apporteur). Même mise en page que /commander.
// Non référencée au départ (src/seo.js).

const STEPS = [
  ['Vous candidatez', 'Quelques informations sur vous : nous lisons chaque candidature.'],
  ['On fait connaissance', 'Un appel pour voir ensemble les entreprises que vous pouvez nous présenter et fixer votre commission par lead.'],
  ['Votre espace s’ouvre', 'Vous recevez un e-mail pour choisir votre mot de passe. Chaque client que vous nous apportez y apparaît.'],
];

const POINTS = [
  ['Une commission sur chaque lead', 'Pour chaque lead livré à un client que vous nous avez apporté, vous touchez un montant fixe, convenu avant.'],
  ['Tout est visible', 'Votre espace montre, client par client et commande par commande, combien de leads ont été livrés et ce qui vous revient.'],
  ['Des règles claires', 'Une commission est due quand le client a réglé sa commande et qu’aucun litige n’est en cours. Un lead remplacé n’est compté qu’une fois.'],
];

function CandidatureForm() {
  const [f, setF] = useState({ prenom: '', nom: '', societe: '', email: '', telephone: '', siret: '', message: '', website: '' });
  const [state, setState] = useState('idle');
  const [error, setError] = useState('');
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));
  async function submit(e) {
    e.preventDefault();
    setError('');
    if (!f.prenom.trim() || !f.nom.trim()) { setError('Indiquez votre prénom et votre nom.'); return; }
    setState('sending');
    const r = await fetch('/api/apporteur-candidature', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f) }).catch(() => null);
    const data = r ? await r.json().catch(() => ({})) : {};
    if (!r || !r.ok) {
      setState('idle');
      setError({ bad_phone: 'Ce numéro de téléphone ne semble pas valide.', bad_email: 'Cette adresse e-mail ne semble pas valide.', bad_siret: 'Le SIRET compte 14 chiffres.', missing_fields: 'Indiquez votre prénom et votre nom.' }[data.error] || `L’envoi n’a pas abouti. Écrivez-nous à ${CONTACT_EMAIL}.`);
      return;
    }
    setState('sent');
  }
  if (state === 'sent') {
    return (
      <div className="od-sent" role="status">
        <span className="od-sent-ico" aria-hidden="true">✓</span>
        <h3>Candidature reçue.</h3>
        <p>Merci {f.prenom}. Nous vous rappelons au {f.telephone} pour faire connaissance.</p>
      </div>
    );
  }
  return (
    <form className="od-form" onSubmit={submit} noValidate>
      <h2>Devenir apporteur</h2>
      <div className="od-grid">
        <label className="od-field"><span>Prénom</span><input required value={f.prenom} onChange={set('prenom')} autoComplete="given-name" /></label>
        <label className="od-field"><span>Nom</span><input required value={f.nom} onChange={set('nom')} autoComplete="family-name" /></label>
        <label className="od-field"><span>E-mail</span><input required type="email" value={f.email} onChange={set('email')} autoComplete="email" /></label>
        <label className="od-field"><span>Téléphone</span><input required type="tel" value={f.telephone} onChange={set('telephone')} autoComplete="tel" /></label>
        <label className="od-field"><span>Société (facultatif)</span><input value={f.societe} onChange={set('societe')} autoComplete="organization" /></label>
        <label className="od-field"><span>SIRET (facultatif)</span><input value={f.siret} onChange={set('siret')} inputMode="numeric" placeholder="14 chiffres" /></label>
      </div>
      <label className="od-field"><span>Votre réseau (facultatif)</span><textarea rows={4} value={f.message} onChange={set('message')} placeholder="Votre métier, les entreprises que vous connaissez, votre secteur…" /></label>
      <input className="bk-trap" tabIndex={-1} autoComplete="off" value={f.website} onChange={set('website')} aria-hidden="true" />
      {error && <p className="od-err" role="alert">{error}</p>}
      <button type="submit" className="od-submit" disabled={state === 'sending'}>{state === 'sending' ? 'Envoi…' : 'Envoyer ma candidature'}</button>
      <p className="od-legal">Vos données servent uniquement à traiter votre candidature. <Link to="/confidentialite">Politique de confidentialité</Link>. Déjà apporteur ? <Link to="/apporteur">Se connecter</Link>.</p>
    </form>
  );
}

export default function DevenirApporteur() {
  useV2Favicon();
  return (
    <MotionConfig reducedMotion="user">
      <div className="v2 v3">
        <Nav light shop />
        <main className="od">
          <div className="aurora-grid" aria-hidden="true" />
          <div className="hero-halo" aria-hidden="true" />
          <div className="wrap od-inner">
            <Reveal className="od-head">
              <p className="eyebrow">Apporteurs d’affaires</p>
              <h1>Vous connaissez des artisans ? <span className="serif grad-text">Présentez-les-nous.</span></h1>
            </Reveal>
            <div className="od-cols">
              <Reveal className="od-aside">
                <h2>Une commission sur chaque lead, <span className="serif grad-text">en toute transparence.</span></h2>
                <p>Kairn vend des leads exclusifs aux professionnels de la rénovation énergétique. Vous nous présentez une entreprise ; tant qu’elle commande, vous touchez une commission sur chaque lead qui lui est livré.</p>
                <ul className="od-points">
                  {POINTS.map(([t, d]) => <li key={t}><b>{t}</b><p>{d}</p></li>)}
                </ul>
                <ol className="od-steps">
                  {STEPS.map(([h, d], i) => <li key={h}><span>{i + 1}</span><div><b>{h}</b><p>{d}</p></div></li>)}
                </ol>
              </Reveal>
              <Reveal delay={0.1} className="od-card"><CandidatureForm /></Reveal>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
