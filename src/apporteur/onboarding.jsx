import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { KairnLogo } from '../v2/layout.jsx';
import { CONTACT_EMAIL } from '../config.js';
import { db } from '../espace/db.js';
import {
  FORMES, estIndividuel, formeDepuisNature, siretValide, ibanValide, ibanLisible,
  manquesApporteur, manquesKairn, sectionsContrat, texteContrat, DUREE_COMMISSION_MOIS,
} from './contrat.js';
import './apporteur.css';

// Onboarding de l'apporteur à sa première connexion (Ugo, 13/11/2026 : « hyper efficient [...] qu'ils rentrent TOUTES
// leurs infos et que ça génère un contrat aux normes et qu'ils le signent direct »). Quatre étapes :
// 1. l'entreprise (le SIRET remplit le reste par l'annuaire public recherche-entreprises.api.gouv.fr),
// 2. le signataire, 3. TVA et compte bancaire, 4. lecture du contrat et signature tracée.
// Chaque étape est enregistrée (apporteur_enregistrer) : on peut s'arrêter et reprendre. Le contrat affiché est fait
// à partir de la fiche relue en base ; le serveur refait le même texte et vérifie l'empreinte avant de signer.

const ETAPES = ['Votre entreprise', 'Vous', 'Paiement', 'Contrat'];
const CHAMPS = ['forme', 'forme_autre', 'raison_sociale', 'siret', 'adresse', 'code_postal', 'ville', 'prenom', 'nom', 'representant_qualite', 'telephone', 'tva_regime', 'tva_numero', 'iban', 'titulaire_iban'];
const QUALITE = { sasu: 'Président', sas: 'Président', sa: 'Directeur général', eurl: 'Gérant', sarl: 'Gérant' };

// Numéro de TVA français déduit du SIREN : FR + clé + SIREN.
function tvaDepuisSiren(siret) {
  const s = String(siret || '').replace(/\s/g, '').slice(0, 9);
  if (!/^\d{9}$/.test(s)) return '';
  const cle = (12 + 3 * (Number(s) % 97)) % 97;
  return `FR${String(cle).padStart(2, '0')}${s}`;
}

async function empreinte(texte) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(texte));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function Champ({ label, children, aide }) {
  return <label className="ec-field"><span>{label}</span>{children}{aide && <small className="ec-muted">{aide}</small>}</label>;
}

// Signature tracée au doigt ou à la souris.
function PadSignature({ onChange }) {
  const ref = useRef(null);
  const dessin = useRef({ actif: false, traits: 0 });
  useEffect(() => {
    const c = ref.current;
    const r = window.devicePixelRatio || 1;
    c.width = c.offsetWidth * r;
    c.height = c.offsetHeight * r;
    const ctx = c.getContext('2d');
    ctx.scale(r, r);
    ctx.lineWidth = 2.4; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#0B0918';
  }, []);
  const pos = (e) => { const b = ref.current.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; };
  const down = (e) => { e.preventDefault(); ref.current.setPointerCapture(e.pointerId); dessin.current.actif = true; const ctx = ref.current.getContext('2d'); ctx.beginPath(); ctx.moveTo(...pos(e)); };
  const move = (e) => { if (!dessin.current.actif) return; const ctx = ref.current.getContext('2d'); ctx.lineTo(...pos(e)); ctx.stroke(); };
  const up = () => {
    if (!dessin.current.actif) return;
    dessin.current.actif = false; dessin.current.traits += 1;
    onChange(dessin.current.traits >= 1 ? ref.current.toDataURL('image/png') : '');
  };
  const effacer = () => { const c = ref.current; c.getContext('2d').clearRect(0, 0, c.width, c.height); dessin.current.traits = 0; onChange(''); };
  return (
    <div className="ap-pad">
      <canvas ref={ref} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={up} aria-label="Zone de signature" />
      <div className="ap-pad-foot"><span>Signez ici, au doigt ou à la souris</span><button type="button" className="ec-link-btn" onClick={effacer}>Effacer</button></div>
    </div>
  );
}

export default function Onboarding({ fiche, session, onSigne, apercu = false }) {
  const [f, setF] = useState(() => Object.fromEntries(CHAMPS.map((k) => [k, fiche[k] ?? ''])));
  const [etape, setEtape] = useState(() => {
    if (manquesApporteur({ ...fiche }).length === 0) return 3;
    return fiche.siret ? 1 : 0;
  });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [annuaire, setAnnuaire] = useState('');
  const [dirigeants, setDirigeants] = useState([]);
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));
  const indiv = estIndividuel(f.forme);

  // SIRET valide : l'annuaire public remplit la forme, le nom et l'adresse.
  async function chercher(siret) {
    const s = String(siret).replace(/\s/g, '');
    if (!siretValide(s)) { setAnnuaire(''); return; }
    setAnnuaire('Recherche dans l’annuaire des entreprises…');
    try {
      const r = await fetch(`https://recherche-entreprises.api.gouv.fr/search?q=${s}&per_page=1`).then((x) => x.json());
      const e = r.results?.[0];
      if (!e || e.siren !== s.slice(0, 9)) { setAnnuaire('Entreprise introuvable dans l’annuaire : remplissez les champs à la main.'); return; }
      const et = (e.matching_etablissements || []).find((m) => m.siret === s) || e.siege || {};
      const forme = formeDepuisNature(e.nature_juridique, e.complements?.est_entrepreneur_individuel);
      const ds = (e.dirigeants || []).filter((d) => d.type_dirigeant !== 'personne morale' && (d.prenoms || d.nom));
      setDirigeants(ds);
      const d0 = ds[0];
      const adresse = [et.numero_voie, et.indice_repetition, et.type_voie, et.libelle_voie].filter(Boolean).join(' ') || String(et.adresse || '').replace(/\s\d{5}\s.*$/, '');
      setF((x) => ({
        ...x, forme, raison_sociale: e.nom_raison_sociale || e.nom_complet || x.raison_sociale,
        adresse: adresse || x.adresse, code_postal: et.code_postal || x.code_postal, ville: et.libelle_commune || x.ville,
        prenom: x.prenom || (d0?.prenoms || '').split(' ')[0].replace(/^./, (c) => c.toUpperCase()).replace(/(?<=.)./g, (c) => c.toLowerCase()),
        nom: x.nom || (d0?.nom || '').replace(/(?<=.)./g, (c) => c.toLowerCase()).replace(/^./, (c) => c.toUpperCase()),
        representant_qualite: x.representant_qualite || (forme in QUALITE ? (d0?.qualite || QUALITE[forme]) : ''),
        tva_numero: x.tva_numero || tvaDepuisSiren(s),
      }));
      setAnnuaire(`Trouvé : ${e.nom_complet}${e.etat_administratif === 'C' ? ' (entreprise fermée : vérifiez votre SIRET)' : ''}. Vérifiez et corrigez si besoin.`);
    } catch { setAnnuaire('Annuaire indisponible : remplissez les champs à la main.'); }
  }

  const manquesEtape = useMemo(() => {
    const m = manquesApporteur(f);
    const par = [
      ['forme juridique', 'forme juridique (précisez)', 'dénomination', 'nom commercial ou nom', 'SIRET valide', 'adresse complète'],
      ['prénom et nom', 'qualité du signataire', 'téléphone'],
      ['régime de TVA', 'numéro de TVA intracommunautaire', 'IBAN valide', 'titulaire du compte'],
    ][etape] || [];
    return m.filter((x) => par.includes(x));
  }, [f, etape]);

  async function suivant() {
    setErr('');
    if (manquesEtape.length) { setErr(`À compléter : ${manquesEtape.join(', ')}.`); return; }
    setBusy(true);
    const { error } = apercu ? { error: null } : await db.rpc('apporteur_enregistrer', { p: f });
    setBusy(false);
    if (error) { setErr('Enregistrement impossible. Réessayez dans un instant.'); return; }
    setEtape((e) => e + 1);
  }

  return (
    <div className="ap-onb">
      <header className="ap-onb-top">
        <Link to="/" className="brand"><KairnLogo /><span className="brand-word">Kairn</span></Link>
        <button type="button" className="ec-link-btn" onClick={() => db.auth.signOut()}>Se déconnecter</button>
      </header>
      <div className="ap-onb-card">
        <p className="ap-onb-eyebrow">Espace apporteur · 3 minutes</p>
        <h1>{etape < 3 ? 'Vos informations' : 'Votre contrat'}</h1>
        <p className="ec-muted">Elles servent à établir votre contrat d’apporteur d’affaires et à vous payer vos commissions. Vous signez en ligne à la fin.</p>
        <ol className="ap-steps">{ETAPES.map((t, i) => <li key={t} className={i === etape ? 'is-on' : i < etape ? 'is-done' : ''}><span>{i < etape ? '✓' : i + 1}</span>{t}</li>)}</ol>

        {etape === 0 && (
          <div className="ec-form">
            <Champ label="SIRET" aide={annuaire || '14 chiffres : la suite se remplit toute seule.'}>
              <input inputMode="numeric" value={f.siret} onChange={(e) => { set('siret')(e); chercher(e.target.value); }} placeholder="123 456 789 00012" autoFocus />
            </Champ>
            <Champ label="Forme juridique">
              <select value={f.forme} onChange={set('forme')}><option value="">Choisir</option>{FORMES.map(([k, t]) => <option key={k} value={k}>{t}</option>)}</select>
            </Champ>
            {f.forme === 'autre' && <Champ label="Précisez la forme"><input value={f.forme_autre} onChange={set('forme_autre')} placeholder="Association, SCI, SNC…" /></Champ>}
            <Champ label={indiv ? 'Nom commercial (ou vos prénom et nom)' : 'Dénomination'}><input value={f.raison_sociale} onChange={set('raison_sociale')} autoComplete="organization" /></Champ>
            <Champ label={indiv ? 'Adresse professionnelle' : 'Adresse du siège'}><input value={f.adresse} onChange={set('adresse')} autoComplete="street-address" /></Champ>
            <div className="ap-row">
              <Champ label="Code postal"><input inputMode="numeric" value={f.code_postal} onChange={set('code_postal')} autoComplete="postal-code" /></Champ>
              <Champ label="Ville"><input value={f.ville} onChange={set('ville')} autoComplete="address-level2" /></Champ>
            </div>
          </div>
        )}

        {etape === 1 && (
          <div className="ec-form">
            {!indiv && dirigeants.length > 1 && (
              <Champ label="Qui signe ? (dirigeants connus de l’annuaire)">
                <select onChange={(e) => { const d = dirigeants[Number(e.target.value)]; if (d) setF((x) => ({ ...x, prenom: (d.prenoms || '').split(' ')[0], nom: d.nom || '', representant_qualite: d.qualite || x.representant_qualite })); }} defaultValue="">
                  <option value="" disabled>Choisir</option>
                  {dirigeants.map((d, i) => <option key={`${d.nom}${i}`} value={i}>{[d.prenoms, d.nom].filter(Boolean).join(' ')}{d.qualite ? ` · ${d.qualite}` : ''}</option>)}
                </select>
              </Champ>
            )}
            <div className="ap-row">
              <Champ label="Prénom"><input value={f.prenom} onChange={set('prenom')} autoComplete="given-name" /></Champ>
              <Champ label="Nom"><input value={f.nom} onChange={set('nom')} autoComplete="family-name" /></Champ>
            </div>
            {!indiv && <Champ label="Qualité" aide="Votre fonction dans la société : Président, Gérant…"><input value={f.representant_qualite} onChange={set('representant_qualite')} /></Champ>}
            <Champ label="Téléphone"><input type="tel" value={f.telephone} onChange={set('telephone')} autoComplete="tel" /></Champ>
            <Champ label="E-mail" aide="Celui de votre connexion. Pour le changer, écrivez-nous."><input value={session.user.email} disabled /></Champ>
          </div>
        )}

        {etape === 2 && (
          <div className="ec-form">
            <fieldset className="ap-choix">
              <legend>TVA</legend>
              <label><input type="radio" name="tva" checked={f.tva_regime === 'franchise'} onChange={() => setF((x) => ({ ...x, tva_regime: 'franchise' }))} /><span><b>Je ne facture pas la TVA</b><small>Franchise en base (art. 293 B du CGI), le cas de la plupart des micro-entreprises.</small></span></label>
              <label><input type="radio" name="tva" checked={f.tva_regime === 'assujetti'} onChange={() => setF((x) => ({ ...x, tva_regime: 'assujetti', tva_numero: x.tva_numero || tvaDepuisSiren(x.siret) }))} /><span><b>Je facture la TVA</b><small>Vos factures ajoutent la TVA aux commissions.</small></span></label>
            </fieldset>
            {f.tva_regime === 'assujetti' && <Champ label="Numéro de TVA intracommunautaire" aide="Prérempli à partir de votre SIREN : vérifiez-le."><input value={f.tva_numero} onChange={set('tva_numero')} placeholder="FR00123456789" /></Champ>}
            <Champ label="IBAN du compte où verser vos commissions" aide={f.iban && !ibanValide(f.iban) ? 'IBAN incomplet ou erroné.' : f.iban ? `✓ ${ibanLisible(f.iban)}` : 'Il figure dans votre contrat.'}>
              <input value={f.iban} onChange={set('iban')} placeholder="FR76 …" autoComplete="off" spellCheck={false} />
            </Champ>
            <Champ label="Titulaire du compte"><input value={f.titulaire_iban} onChange={set('titulaire_iban')} onFocus={() => !f.titulaire_iban && setF((x) => ({ ...x, titulaire_iban: x.raison_sociale || `${x.prenom} ${x.nom}`.trim() }))} /></Champ>
          </div>
        )}

        {etape === 3 && <Signature session={session} onSigne={onSigne} onRetour={() => setEtape(0)} apercu={apercu ? f : null} />}

        {err && <p className="ec-err" role="alert">{err}</p>}
        {etape < 3 && (
          <div className="ap-nav">
            {etape > 0 ? <button type="button" className="ec-btn-ghost" onClick={() => { setErr(''); setEtape((e) => e - 1); }}>Retour</button> : <span />}
            <button type="button" className="ec-btn" disabled={busy} onClick={suivant}>{busy ? 'Enregistrement…' : etape === 2 ? 'Voir mon contrat' : 'Continuer'}</button>
          </div>
        )}
      </div>
      <p className="ap-onb-help">Une question ? <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>
    </div>
  );
}

// Étape 4 : le contrat fait à partir de la fiche relue en base, puis la signature.
// apercu : la fiche saisie à l'écran et une identité Kairn d'exemple, sans lecture en base (développement).
const KAIRN_EXEMPLE = { nom_legal: 'Kairn (exemple)', forme: 'forme à compléter', siret: '55203253400703', adresse: 'adresse à compléter', signataire: 'Ugo Gianeselli', qualite: 'dirigeant', ville_tribunal: 'Bordeaux' };
function Signature({ session, onSigne, onRetour, apercu }) {
  const [d, setD] = useState(null);
  const [lu, setLu] = useState(false);
  const [nom, setNom] = useState('');
  const [sig, setSig] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const boite = useRef(null);
  useEffect(() => {
    if (apercu) { setD({ a: { ...apercu, siret: String(apercu.siret).replace(/\s/g, ''), iban: String(apercu.iban).replace(/\s/g, '').toUpperCase() }, k: KAIRN_EXEMPLE }); return; }
    Promise.all([
      db.from('apporteurs').select('*').eq('user_id', session.user.id).maybeSingle(),
      db.rpc('contrat_kairn'),
    ]).then(([a, k]) => setD({ a: a.data, k: (k.data || [])[0] || null }));
  }, [session, apercu]);
  if (!d) return <div className="ec-loading" aria-busy="true" />;
  const { a, k } = d;
  if (!a || manquesApporteur(a).length) return <><p className="ec-err">Il manque : {manquesApporteur(a || {}).join(', ')}.</p><button type="button" className="ec-btn" onClick={onRetour}>Compléter</button></>;
  if (manquesKairn(k).length) {
    return <div className="ap-attente"><h2>Contrat en préparation</h2><p>Vos informations sont enregistrées. Kairn finalise le modèle de contrat : vous recevrez un e-mail pour le signer, en un clic.</p></div>;
  }
  const s = sectionsContrat(k, a);
  const attendu = `${a.prenom} ${a.nom}`.trim();
  const nomOk = nom.trim().toLowerCase() === attendu.toLowerCase();

  async function signer() {
    setErr('');
    if (!lu) { setErr('Cochez « J’ai lu et j’accepte le contrat ».'); return; }
    if (!nomOk) { setErr(`Tapez exactement « ${attendu} ».`); return; }
    if (!sig) { setErr('Tracez votre signature dans le cadre.'); return; }
    if (apercu) { setErr('Aperçu : rien n’est signé.'); return; }
    setBusy(true);
    const { data } = await db.auth.getSession();
    const r = await fetch('/api/apporteur', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${data.session?.access_token}` },
      body: JSON.stringify({ action: 'signer', empreinte: await empreinte(texteContrat(k, a)), signature: sig, nom_signataire: nom.trim(), accepte: true }),
    }).then(async (x) => ({ ok: x.ok, body: await x.json().catch(() => ({})) })).catch(() => null);
    setBusy(false);
    if (r?.ok) { onSigne(); return; }
    const code = r?.body?.error;
    setErr(code === 'contrat_change' ? 'Le contrat vient d’être mis à jour : rechargez la page pour lire la dernière version.'
      : code === 'deja_signe' ? 'Ce contrat est déjà signé.'
        : code === 'fiche_incomplete' ? `Il manque : ${(r.body.manques || []).join(', ')}.`
          : code === 'signature_invalide' ? 'Signature trop courte : tracez-la à nouveau.'
            : `La signature n’a pas abouti. Réessayez, ou écrivez à ${CONTACT_EMAIL}.`);
  }

  return (
    <div className="ap-contrat">
      <div className="ap-contrat-resume">
        <p><b>L’essentiel :</b> vous présentez des entreprises à Kairn ; pour chaque lead livré à une entreprise que vous avez apportée, vous touchez la commission fixée pour elle, pendant {DUREE_COMMISSION_MOIS} mois après sa première commande. Une commission est payable quand la commande est livrée, réglée par le client et sans litige. Vous facturez Kairn, payé sous 30 jours. Pas d’exclusivité, fin possible à tout moment avec un mois de préavis.</p>
        <button type="button" className="ec-link-btn" onClick={onRetour}>Corriger mes informations</button>
      </div>
      <div className="ap-contrat-texte" ref={boite} tabIndex={0} aria-label="Texte du contrat">
        <h2>{s.titre}</h2>
        {s.parties.map(([t, p]) => <p key={p}>{t && <b>{t} : </b>}{p}</p>)}
        {s.articles.map(([t, ps]) => <section key={t}><h3>{t}</h3>{ps.map((p) => <p key={p.slice(0, 40)}>{p}</p>)}</section>)}
      </div>
      <label className="ap-check"><input type="checkbox" checked={lu} onChange={(e) => setLu(e.target.checked)} /><span>J’ai lu et j’accepte le contrat d’apporteur d’affaires ci-dessus.</span></label>
      <Champ label={`Tapez votre nom : ${attendu}`}><input value={nom} onChange={(e) => setNom(e.target.value)} autoComplete="name" className={nom && !nomOk ? 'is-bad' : ''} /></Champ>
      <PadSignature onChange={setSig} />
      {err && <p className="ec-err" role="alert">{err}</p>}
      <button type="button" className="ec-btn ap-signer" disabled={busy} onClick={signer}>{busy ? 'Signature…' : 'Signer le contrat'}</button>
      <p className="ec-small">Signature électronique (articles 1366 et 1367 du Code civil) : la date, l’heure, votre adresse IP et l’empreinte du texte sont conservées. Vous recevez le contrat signé en PDF par e-mail.</p>
    </div>
  );
}
