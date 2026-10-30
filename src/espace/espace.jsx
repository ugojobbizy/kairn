import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Link, Navigate, NavLink, Route, Routes, useNavigate, useSearchParams } from 'react-router-dom';
import { KairnLogo, useV2Favicon } from '../v2/layout.jsx';
import { PRODUITS, GARANTIES } from '../v3/produits.js';
import { CONTACT_EMAIL, WHATSAPP_NUMBER, whatsappUrl } from '../config.js';
import { db, THEMES, MOTIFS, SUIVI, LITIGE_STATUTS, TVA, ETAPES, euro, dateFr, dateHeure, errMsg, downloadCsv, notifier } from './db.js';
import Tickets from './tickets.jsx';
import { apercuData } from './apercu.js';
import '../v2/v2.css';
import '../v3/v3.css';
import './espace.css';

// Espace client Kairn (29/10/2026), sur le modèle de Flow d'AKA Médias (captures d'Ugo) avec la DA Kairn :
// Accueil (tableau de bord, raccourcis, catalogue), Mes prospects, Leads Shop, Mes litiges, Mes commandes, Comptabilité, Mes contrats.
// Paiement par bon de commande (Stripe plus tard). Litiges : doublon ou hors zone seulement, Ugo tranche dans Kairn Admin (/gestion).

// Refonte du 30/10/2026 (Ugo : « repenser l'espace client [...] beaucoup plus ergonomique ») : l'outil sert d'abord à appeler.
// Accueil « Aujourd'hui » (contacts frais à appeler), fiches contact avec Appeler et SMS, export Excel, CSV ou Google Sheets,
// commandes reconductibles ; sur mobile, barre d'onglets en bas (champ « tab »). Plan : ~/.claude/plans/staged-wondering-peach.md.
const MENU = [
  { to: '/espace', end: true, t: 'Aujourd’hui', tab: 'Aujourd’hui', ico: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></> },
  { to: '/espace/prospects', t: 'Mes contacts', tab: 'Contacts', ico: <><circle cx="9" cy="8" r="4" /><path d="M2 21v-1a6 6 0 0 1 12 0v1M16 4a4 4 0 0 1 0 8M22 21v-1a6 6 0 0 0-4-5.6" /></> },
  { to: '/espace/commandes', t: 'Mes commandes', tab: 'Commandes', ico: <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" /></> },
  { to: '/espace/shop', t: 'Leads Shop', tab: 'Shop', ico: <><path d="M6 6h15l-2 9H7z" /><circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M6 6 5 2H2" /></> },
  { to: '/espace/litiges', t: 'Mes litiges', ico: <><path d="M12 3v18M5 21h14M5 8l-3 6a3 3 0 0 0 6 0zM19 8l-3 6a3 3 0 0 0 6 0zM5 8h14" /></> },
  { to: '/espace/comptabilite', t: 'Comptabilité', ico: <><rect x="4" y="2" width="16" height="20" rx="2" /><path d="M8 6h8M8 10h2M14 10h2M8 14h2M14 14h2M8 18h2M14 18h2" /></> },
  { to: '/espace/contrats', t: 'Mes contrats', ico: <><path d="M6 2h9l5 5v15H6z" /><path d="M14 2v6h6M9 13h6M9 17h6" /></> },
  { to: '/espace/compte', t: 'Compte et alertes', ico: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></> },
];

function Ico({ children, size = 19 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>;
}
const Arrow = () => <Ico size={16}><path d="M5 12h14M13 6l6 6-6 6" /></Ico>;
const Check = () => <Ico size={15}><path d="M20 6 9 17l-5-5" /></Ico>;

// ─ données : base réelle, ou jeu fictif pour l'aperçu de développement ─
const Data = createContext(null);
const useData = () => useContext(Data);

function useClientData(session, apercu) {
  const [state, setState] = useState({ leads: null, commandes: null, litiges: null, suivi: null, error: '' });
  const load = useCallback(async () => {
    if (apercu) { setState((st) => ({ ...apercu, suivi: st.suivi || apercu.suivi, error: '' })); return; }
    const uid = session.user.id;
    const [l, c, g, sv] = await Promise.all([
      db.from('leads').select('*').eq('client_id', uid).order('livre_le', { ascending: false }),
      db.from('commandes').select('*').eq('user_id', uid).order('created_at', { ascending: false }),
      db.from('litiges').select('*').eq('client_id', uid).order('created_at', { ascending: false }),
      db.from('lead_suivi').select('*').eq('client_id', uid),
    ]);
    setState({ leads: l.data || [], commandes: c.data || [], litiges: g.data || [], suivi: sv.data || [], error: l.error || c.error || g.error || sv.error ? 'Une partie de vos données n’a pas pu être chargée.' : '' });
  }, [session.user.id, apercu]);
  useEffect(() => { load(); }, [load]);
  const suiviPar = useMemo(() => new Map((state.suivi || []).map((x) => [x.lead_id, x])), [state.suivi]);
  // Enregistre statut, note et rappel d'un contact (fonction suivi_maj). Affichage immédiat, retour arrière si l'écriture échoue.
  const majSuivi = useCallback(async (leadId, patch) => {
    const avant = state.suivi || [];
    const cur = avant.find((x) => x.lead_id === leadId) || { lead_id: leadId, statut: 'a_appeler', note: null, rappel_le: null };
    const next = { ...cur, ...patch, maj_le: new Date().toISOString() };
    setState((st) => ({ ...st, suivi: [...(st.suivi || []).filter((x) => x.lead_id !== leadId), next] }));
    if (apercu) return true;
    const { error } = await db.rpc('suivi_maj', { p_lead: leadId, p_statut: next.statut, p_note: next.note || null, p_rappel: next.rappel_le || null });
    if (error) { setState((st) => ({ ...st, suivi: avant, error: 'Le suivi n’a pas pu être enregistré. Réessayez.' })); return false; }
    return true;
  }, [state.suivi, apercu]);
  return { ...state, suiviPar, majSuivi, reload: load };
}

// Chiffres dérivés : livrés par commande (hors leads annulés après litige), montant dû.
function useStats() {
  const { leads, commandes } = useData();
  return useMemo(() => {
    if (!leads || !commandes) return null;
    const actifs = leads.filter((l) => !l.annule);
    const livresPar = {};
    for (const l of actifs) if (l.commande_id) livresPar[l.commande_id] = (livresPar[l.commande_id] || 0) + 1;
    const bdc = commandes.filter((c) => c.bdc_numero);
    const enCours = bdc.filter((c) => c.statut === 'ouverte');
    const reste = enCours.reduce((s, c) => s + Math.max(0, (c.plafond || 0) - (livresPar[c.id] || 0)), 0);
    const du = bdc.filter((c) => c.approuve_le && !c.regle_le).reduce((s, c) => s + Number(c.montant_ht || 0), 0);
    // Complétion : leads livrés sur le total commandé (plafonds des bons de commande).
    const commande = bdc.filter((c) => c.statut !== 'refusee').reduce((t, c) => t + (c.plafond || 0), 0);
    const livresCmd = bdc.filter((c) => c.statut !== 'refusee').reduce((t, c) => t + Math.min(c.plafond || 0, livresPar[c.id] || 0), 0);
    return { livres: actifs.length, reste, du, livresPar, enCours, bdc, commande, livresCmd };
  }, [leads, commandes]);
}

// Barre de complétion des commandes (Ugo, 29/10/2026 : « une petite barre de complétion qui va de 0 à 100 %, un truc sympa »).
// Elle se remplit à l'arrivée sur la page, un reflet la parcourt, et elle passe au vert à 100 %.
function Completion({ done, total }) {
  const pct = total ? Math.min(100, Math.round((done / total) * 100)) : 0;
  const [shown, setShown] = useState(0);
  useEffect(() => { const t = requestAnimationFrame(() => setShown(pct)); return () => cancelAnimationFrame(t); }, [pct]);
  return (
    <div className={`ec-compl${pct >= 100 ? ' is-full' : ''}`}>
      <div className="ec-compl-top">
        <span>{total ? `${done} sur ${total} commandés` : 'Aucune commande en cours'}</span>
        <b>{pct} %</b>
      </div>
      <div className="ec-compl-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label="Complétion de vos commandes">
        <span style={{ width: `${shown}%` }}><i /></span>
      </div>
    </div>
  );
}

function PageHead({ title, sub, children }) {
  return (
    <header className="ec-head ec-head-row">
      <div><h1>{title}</h1>{sub && <p>{sub}</p>}</div>
      {children}
    </header>
  );
}

function Empty({ children }) {
  return <div className="ec-card ec-empty">{children}</div>;
}

// ─ connexion ─
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const { error: err } = await db.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (err) setError(err.message === 'Invalid login credentials' ? 'E-mail ou mot de passe incorrect.' : 'Connexion impossible pour le moment. Réessayez dans un instant.');
  }
  return (
    <div className="ec-login">
      <div className="aurora-grid" aria-hidden="true" />
      <div className="hero-halo" aria-hidden="true" />
      <form className="ec-login-card" onSubmit={submit}>
        <Link to="/" className="brand"><KairnLogo />Kairn</Link>
        <h1>Espace client</h1>
        <p>Vos prospects, vos commandes et vos factures, au même endroit.</p>
        <label><span>E-mail</span><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" /></label>
        <label><span>Mot de passe</span><input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" /></label>
        {error && <p className="ec-err" role="alert">{error}</p>}
        <button type="submit" className="ec-btn" disabled={busy}>{busy ? 'Connexion…' : 'Se connecter'}</button>
        <p className="ec-small">Mot de passe oublié ? Écrivez à <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>
        <p className="ec-small">Pas encore client ? <Link to="/commander">Commander des leads</Link></p>
      </form>
    </div>
  );
}

// ─ Fiche contact (accueil et Mes contacts) ─
// Âge du contact : la fraîcheur se lit d'un coup d'œil (pilier « frais » de l'accueil du site).
function ilYa(d) {
  if (!d) return '';
  const min = Math.max(0, Math.round((Date.now() - new Date(d).getTime()) / 60000));
  if (min < 1) return 'à l’instant';
  if (min < 60) return `il y a ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `il y a ${h} h`;
  const j = Math.round(h / 24);
  return j === 1 ? 'hier' : `il y a ${j} jours`;
}
const isFrais = (d) => d && Date.now() - new Date(d).getTime() < 3600000;
const nomComplet = (l) => [l.prenom, l.nom].filter(Boolean).join(' ') || 'Contact';
const initiales = (l) => nomComplet(l).split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
// SMS prêt à envoyer depuis le téléphone du commercial ; il le relit et le modifie avant l'envoi.
function smsHref(l, client) {
  const t = (THEMES[l.thematique] || 'votre projet').toLowerCase();
  const corps = `Bonjour ${l.prenom || ''}, vous avez demandé à être rappelé pour votre projet (${t}). Je vous appelle dans quelques minutes.${client?.societe ? ` ${client.societe}` : ''}`;
  return `sms:${(l.telephone || '').replace(/\s/g, '')}?&body=${encodeURIComponent(corps.replace(/\s+/g, ' ').trim())}`;
}

// Suivi d'un contact : statut en un tap, note, date de rappel (lot 2 de la refonte, table lead_suivi).
const toLocalInput = (d) => { if (!d) return ''; const x = new Date(d); x.setMinutes(x.getMinutes() - x.getTimezoneOffset()); return x.toISOString().slice(0, 16); };
function SuiviBar({ lead: l }) {
  const { suiviPar, majSuivi } = useData();
  const cur = suiviPar.get(l.id) || { statut: 'a_appeler', note: null, rappel_le: null };
  const [note, setNote] = useState(cur.note || '');
  const [openNote, setOpenNote] = useState(Boolean(cur.note) || Boolean(cur.rappel_le));
  useEffect(() => { setNote(cur.note || ''); }, [l.id, cur.note]);
  return (
    <div className="ec-suivi">
      <div className="ec-suivi-st" role="group" aria-label="Statut du contact">
        {Object.entries(SUIVI).map(([k, t]) => (
          <button type="button" key={k} className={`is-${k}${cur.statut === k ? ' is-on' : ''}`} aria-pressed={cur.statut === k} onClick={() => majSuivi(l.id, { statut: k })}>{t}</button>
        ))}
      </div>
      {openNote ? (
        <div className="ec-suivi-more">
          <label><span>Note</span><textarea rows={2} maxLength={2000} value={note} onChange={(e) => setNote(e.target.value)} onBlur={() => { if (note !== (cur.note || '')) majSuivi(l.id, { note }); }} placeholder="Ce qu’il vous a dit, son projet, son budget…" /></label>
          <label><span>Me rappeler le</span><input type="datetime-local" value={toLocalInput(cur.rappel_le)} onChange={(e) => majSuivi(l.id, { rappel_le: e.target.value ? new Date(e.target.value).toISOString() : null })} /></label>
        </div>
      ) : <button type="button" className="ec-link-btn ec-suivi-add" onClick={() => setOpenNote(true)}>Ajouter une note ou un rappel</button>}
    </div>
  );
}

function ContactCard({ lead: l, client, litige, onSignal, compact }) {
  const { suiviPar } = useData();
  const sv = suiviPar.get(l.id);
  const qualif = [l.statut_occupation, l.type_logement, l.chauffage, l.surface].filter(Boolean);
  return (
    <article className={`ec-contact${isFrais(l.livre_le) ? ' is-fresh' : ''}${compact ? ' is-compact' : ''}`}>
      <header className="ec-contact-top">
        <span className="ec-contact-av" aria-hidden="true">{initiales(l)}</span>
        <div className="ec-contact-who">
          <b>{nomComplet(l)}</b>
          <span>{[l.code_postal, l.ville].filter(Boolean).join(' ')}</span>
        </div>
        <span className="ec-contact-age">{isFrais(l.livre_le) && <i aria-hidden="true" />}{ilYa(l.livre_le)}</span>
      </header>
      {compact && sv && sv.statut !== 'a_appeler' && <span className={`ec-st is-${sv.statut}`}>{SUIVI[sv.statut]}</span>}
      <p className="ec-contact-theme">{THEMES[l.thematique] || l.thematique}</p>
      {qualif.length > 0 && <ul className="ec-contact-q">{qualif.map((q) => <li key={q}>{q}</li>)}</ul>}
      {!compact && (
        <>
          <div className="ec-contact-actions">
            <a className="ec-call" href={`tel:${(l.telephone || '').replace(/\s/g, '')}`}><Ico size={18}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" /></Ico>Appeler</a>
            <a className="ec-sms" href={smsHref(l, client)}><Ico size={18}><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" /></Ico>SMS</a>
          </div>
          <SuiviBar lead={l} />
          <dl className="ec-contact-coord">
            <div><dt>Téléphone</dt><dd>{l.telephone || '·'}</dd></div>
            <div><dt>E-mail</dt><dd>{l.email ? <a href={`mailto:${l.email}`}>{l.email}</a> : '·'}</dd></div>
          </dl>
          <footer className="ec-contact-foot">
            <span>Reçu le {dateHeure(l.livre_le)}</span>
            {litige ? <span className={`ec-status is-${litige.statut}`}>Litige {LITIGE_STATUTS[litige.statut].toLowerCase()}</span>
              : <button type="button" className="ec-link-btn" onClick={() => onSignal(l)}>Signaler un doublon ou un hors zone</button>}
          </footer>
        </>
      )}
    </article>
  );
}

// Plus de 80 % livrés : la commande touche à sa fin, on propose de la reconduire (seuil à valider par Ugo).
const SEUIL_RECONDUIRE = 0.8;
function reconduireHref(c) {
  const q = new URLSearchParams({ thematique: c.thematique || 'PAC', quantite: String(c.plafond || c.volume || 100), zone: c.zone || '' });
  return `/espace/precommande?${q}`;
}

function CommandeCard({ c, n }) {
  const pct = c.plafond ? n / c.plafond : 0;
  return (
    <div className={`ec-order${pct >= SEUIL_RECONDUIRE ? ' is-ending' : ''}`}>
      <div className="ec-order-top"><b>{THEMES[c.thematique] || c.thematique}</b><span>{c.zone ? `Dép. ${c.zone}` : c.bdc_numero}</span></div>
      <Completion done={n} total={c.plafond || 0} />
      {pct >= SEUIL_RECONDUIRE ? (
        <div className="ec-order-end"><span>Bientôt terminée : plus que {Math.max(0, c.plafond - n)} contacts.</span><Link to={reconduireHref(c)} className="ec-btn">Reconduire</Link></div>
      ) : <p className="ec-order-sub">Encore {Math.max(0, c.plafond - n)} contacts à recevoir.</p>}
    </div>
  );
}

// ─ Aujourd'hui (accueil) ─
function Home({ client, apercu }) {
  const s = useStats();
  const { leads, litiges, suiviPar, reload } = useData();
  const [litigeFor, setLitigeFor] = useState(null);
  const enLitige = useMemo(() => new Map((litiges || []).map((g) => [g.lead_id, g])), [litiges]);
  // « À appeler » : les contacts livrés depuis 48 h et pas encore joints (sans statut, ou NRP), du plus frais au plus ancien.
  const recents = useMemo(() => (leads || []).filter((l) => !l.annule && l.livre_le && Date.now() - new Date(l.livre_le).getTime() < 48 * 3600000
    && ['a_appeler', 'nrp'].includes((suiviPar.get(l.id) || {}).statut || 'a_appeler'))
    .sort((a, b) => new Date(b.livre_le) - new Date(a.livre_le)), [leads, suiviPar]);
  // « À rappeler » : rappel prévu d'ici ce soir, le plus proche d'abord.
  const rappels = useMemo(() => {
    const fin = new Date(); fin.setHours(23, 59, 59, 999);
    const byId = new Map((leads || []).map((l) => [l.id, l]));
    return [...suiviPar.values()].filter((x) => x.rappel_le && new Date(x.rappel_le) <= fin && byId.has(x.lead_id) && !['signe', 'perdu'].includes(x.statut))
      .sort((a, b) => new Date(a.rappel_le) - new Date(b.rappel_le)).map((x) => ({ ...byId.get(x.lead_id), _rappel: x.rappel_le }));
  }, [leads, suiviPar]);
  const auj = recents.filter((l) => new Date(l.livre_le).toDateString() === new Date().toDateString()).length;
  return (
    <>
      <header className="ec-today">
        <p className="ec-today-hi">Bonjour{client?.prenom ? ` ${client.prenom}` : ''}</p>
        <h1>{leads ? <><strong>{recents.length}</strong> contact{recents.length > 1 ? 's' : ''} à appeler</> : 'Chargement…'}</h1>
        <p>{auj} reçu{auj > 1 ? 's' : ''} aujourd’hui. Plus vous rappelez vite, plus ça décroche.</p>
      </header>
      {leads && recents.length === 0 ? (
        <Empty><p><b>Aucun nouveau contact pour le moment.</b></p><p>Ils arrivent ici dès qu’ils vous sont livrés.</p><Link to="/espace/prospects" className="ec-link-btn">Voir tous mes contacts</Link></Empty>
      ) : (
        <div className="ec-contacts">
          {recents.slice(0, 12).map((l) => <ContactCard key={l.id} lead={l} client={client} litige={enLitige.get(l.id)} onSignal={setLitigeFor} />)}
        </div>
      )}
      {recents.length > 12 && <Link to="/espace/prospects" className="ec-more">Voir les {recents.length - 12} autres contacts</Link>}

      {rappels.length > 0 && (
        <>
          <p className="ec-label">À rappeler aujourd’hui</p>
          <div className="ec-contacts">{rappels.map((l) => <ContactCard key={l.id} lead={l} client={client} litige={enLitige.get(l.id)} onSignal={setLitigeFor} />)}</div>
        </>
      )}

      {s && s.enCours.length > 0 && (
        <>
          <p className="ec-label">Mes commandes en cours</p>
          <div className="ec-orders">{s.enCours.map((c) => <CommandeCard key={c.id} c={c} n={s.livresPar[c.id] || 0} />)}</div>
        </>
      )}
      <div className="ec-mini-kpis">
        <div><span>Contacts reçus</span><b>{s ? s.livres : '·'}</b></div>
        <div><span>Reste à livrer</span><b>{s ? s.reste : '·'}</b></div>
        <Link to="/espace/comptabilite"><span>Montant dû HT</span><b>{s ? euro(s.du) : '·'}</b></Link>
      </div>
      <Link to="/espace/precommande" className="ec-btn ec-btn-block">Commander des contacts</Link>
      {litigeFor && <LitigeModal lead={litigeFor} apercu={apercu} onClose={() => setLitigeFor(null)} onDone={() => { setLitigeFor(null); reload(); }} />}
    </>
  );
}

// ─ Pré-commande ─
const QUANTITES = [50, 100, 200, 500];
function Precommande({ session, client, apercu }) {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { reload } = useData();
  const first = PRODUITS.some((p) => p.code === params.get('thematique')) ? params.get('thematique') : 'PAC';
  const [them, setThem] = useState(first);
  // Reconduire une commande : thématique, quantité et zone préremplies (lien de CommandeCard).
  const [qte, setQte] = useState(() => (QUANTITES.includes(Number(params.get('quantite'))) ? Number(params.get('quantite')) : 100));
  const [zone, setZone] = useState(params.get('zone') || '');
  const [state, setState] = useState('idle');
  const [error, setError] = useState('');
  const prod = PRODUITS.find((p) => p.code === them);
  async function submit(e) {
    e.preventDefault();
    if (!zone.trim()) { setError('Indiquez vos départements.'); return; }
    setError(''); setState('sending');
    if (apercu) { setState('sent'); return; }
    const { data: created, error: err } = await db.from('commandes').insert({
      user_id: session.user.id, souhait: 'leads', type: 'precommande', thematique: them, volume: String(qte), zone: zone.trim().slice(0, 200),
      societe: client?.societe || null, nom: client?.prenom || null, email: session.user.email, telephone: client?.telephone || null, siret: client?.siret || null,
      page: '/espace/precommande',
    }).select('id').single();
    if (err) { setState('idle'); setError(errMsg(err)); return; }
    notifier('commande', created.id);
    setState('sent');
    reload();
    setTimeout(() => navigate('/espace/commandes'), 1600);
  }
  return (
    <>
      <PageHead title="Commander des contacts" sub="Nous validons votre zone et votre volume, puis ouvrons le flux : le bon de commande arrive dans Mes commandes." />
      <form className="ec-card ec-form" onSubmit={submit}>
        <p className="ec-sub">Thématique</p>
        <div className="ec-seg">{PRODUITS.map((p) => <button type="button" key={p.code} className={them === p.code ? 'is-on' : ''} onClick={() => setThem(p.code)}><b>{p.code}</b><span>{p.nom} · {p.prix} € HT</span></button>)}</div>
        <p className="ec-sub">Nombre de leads</p>
        <div className="ec-seg ec-seg-sm">{QUANTITES.map((q) => <button type="button" key={q} className={qte === q ? 'is-on' : ''} onClick={() => setQte(q)}><b>{q}</b></button>)}</div>
        <label className="ec-field"><span>Départements couverts</span><input value={zone} onChange={(e) => setZone(e.target.value)} placeholder="Ex. 33, 24, 47" maxLength={200} /></label>
        <div className="ec-total"><span>Montant estimé</span><b>{euro(qte * prod.prix)} HT</b><em>{euro(qte * prod.prix * (1 + TVA))} TTC</em></div>
        {error && <p className="ec-err" role="alert">{error}</p>}
        {state === 'sent' ? <p className="ec-ok">Demande envoyée. Nous revenons vers vous pour valider la zone.</p>
          : <button type="submit" className="ec-btn" disabled={state === 'sending'}>{state === 'sending' ? 'Envoi…' : 'Envoyer la demande'}</button>}
      </form>
    </>
  );
}

// ─ Mes prospects ─
const COLS_PROSPECTS = [['livre_le', 'Livré le'], ['thematique', 'Thématique'], ['prenom', 'Prénom'], ['nom', 'Nom'], ['telephone', 'Téléphone'], ['email', 'E-mail'], ['code_postal', 'Code postal'], ['ville', 'Ville'], ['statut_occupation', 'Statut d’occupation'], ['type_logement', 'Type de logement'], ['chauffage', 'Chauffage'], ['surface', 'Surface'], ['suivi_statut', 'Statut de suivi'], ['suivi_note', 'Note']];

function useFilters(rows, dateKey) {
  const [q, setQ] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [them, setThem] = useState('');
  const [dep, setDep] = useState('');
  const quick = (days) => {
    const d = new Date(); d.setHours(0, 0, 0, 0);
    if (days === 'mois') d.setDate(1); else if (days === 'semaine') d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); else d.setDate(d.getDate() - days);
    setFrom(d.toISOString().slice(0, 10));
    const e = new Date(); if (days === 1) { e.setDate(e.getDate() - 1); } setTo(e.toISOString().slice(0, 10));
  };
  const out = useMemo(() => (rows || []).filter((r) => {
    const d = r[dateKey] ? r[dateKey].slice(0, 10) : '';
    if (from && d < from) return false;
    if (to && d > to) return false;
    if (them && r.thematique !== them) return false;
    if (dep && !(r.departement || '').startsWith(dep.trim())) return false;
    if (q) {
      const s = `${r.prenom || ''} ${r.nom || ''} ${r.telephone || ''} ${r.email || ''}`.toLowerCase();
      if (!s.includes(q.toLowerCase())) return false;
    }
    return true;
  }), [rows, dateKey, q, from, to, them, dep]);
  const bar = (search, dateLabel) => (
    <div className="ec-filters">
      {search && <label className="is-wide"><span>Recherche</span><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Nom, téléphone ou e-mail" /></label>}
      <label><span>{dateLabel} du</span><input type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></label>
      <label><span>{dateLabel} au</span><input type="date" value={to} onChange={(e) => setTo(e.target.value)} /></label>
      <label><span>Thématique</span><select value={them} onChange={(e) => setThem(e.target.value)}><option value="">Toutes</option>{Object.entries(THEMES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
      <label><span>Département</span><input value={dep} onChange={(e) => setDep(e.target.value)} placeholder="Ex. 33" maxLength={3} /></label>
      <div className="ec-quick">
        {[[0, 'Aujourd’hui'], [1, 'Hier'], [3, '3 derniers jours'], ['semaine', 'Cette semaine'], ['mois', 'Ce mois-ci']].map(([k, t]) => <button type="button" key={t} onClick={() => quick(k)}>{t}</button>)}
        {(from || to || them || dep || q) && <button type="button" className="is-reset" onClick={() => { setQ(''); setFrom(''); setTo(''); setThem(''); setDep(''); }}>Effacer</button>}
      </div>
    </div>
  );
  return { rows: out, bar };
}

// Écran large : liste à gauche, fiche ouverte à droite. Mobile : fiches complètes les unes sous les autres.
function useWide(px = 1100) {
  const q = `(min-width: ${px}px)`;
  const [wide, setWide] = useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches);
  useEffect(() => { const m = window.matchMedia(q); const on = () => setWide(m.matches); m.addEventListener('change', on); return () => m.removeEventListener('change', on); }, [q]);
  return wide;
}

// Export : Excel (point-virgule), CSV standard (virgule : Google Sheets, la plupart des CRM), ou copie à coller dans un tableur.
function ExportMenu({ rows, onExported }) {
  const [copied, setCopied] = useState(false);
  const cols = COLS_PROSPECTS.map(([k, t]) => [k === 'livre_le' ? (r) => dateHeure(r.livre_le) : k, t]);
  const name = (ext) => `kairn-contacts-${new Date().toISOString().slice(0, 10)}.${ext}`;
  async function copier() {
    const val = (c, r) => String((typeof c[0] === 'function' ? c[0](r) : r[c[0]]) ?? '').replace(/[\t\n]/g, ' ');
    const tsv = [cols.map((c) => c[1]).join('\t'), ...rows.map((r) => cols.map((c) => val(c, r)).join('\t'))].join('\n');
    try { await navigator.clipboard.writeText(tsv); setCopied(true); setTimeout(() => setCopied(false), 2500); onExported(); } catch { /* presse-papiers refusé */ }
  }
  return (
    <details className="ec-export">
      <summary className="ec-btn-ghost"><Ico size={16}><path d="M12 3v12M7 10l5 5 5-5M4 21h16" /></Ico>Exporter ({rows.length})</summary>
      <div className="ec-export-menu">
        <button type="button" disabled={!rows.length} onClick={() => { downloadCsv(name('csv'), cols, rows); onExported(); }}><b>Excel</b><span>Fichier CSV pour Excel</span></button>
        <button type="button" disabled={!rows.length} onClick={() => { downloadCsv(name('csv'), cols, rows, ','); onExported(); }}><b>CRM ou Google Sheets</b><span>Fichier CSV standard, à importer</span></button>
        <button type="button" disabled={!rows.length} onClick={copier}><b>{copied ? 'Copié' : 'Copier le tableau'}</b><span>À coller dans Google Sheets ou Excel</span></button>
      </div>
    </details>
  );
}

function Prospects({ apercu, client }) {
  const { leads, litiges, suiviPar, reload } = useData();
  const [statut, setStatut] = useState('');
  const [tab, setTab] = useState('tous');
  const [vue, setVue] = useState('fiches');
  const [sel, setSel] = useState(null);
  const [showF, setShowF] = useState(false);
  const wide = useWide();
  const [litigeFor, setLitigeFor] = useState(null);
  const enLitige = useMemo(() => new Map((litiges || []).map((g) => [g.lead_id, g])), [litiges]);
  const base = useMemo(() => (leads || []).filter((l) => !l.annule && (tab === 'tous' || (tab === 'exportes' ? l.exporte_le : !l.exporte_le))), [leads, tab]);
  const st = (l) => (suiviPar.get(l.id) || {}).statut || 'a_appeler';
  const f0 = useFilters(base, 'livre_le');
  const f = { ...f0, rows: statut ? f0.rows.filter((l) => st(l) === statut) : f0.rows };
  const parStatut = useMemo(() => { const m = {}; for (const l of f0.rows) m[st(l)] = (m[st(l)] || 0) + 1; return m; }, [f0.rows, suiviPar]);
  const exportRows = f.rows.map((l) => ({ ...l, suivi_statut: SUIVI[st(l)], suivi_note: (suiviPar.get(l.id) || {}).note || '' }));
  async function marquer() {
    const ids = f.rows.filter((r) => !r.exporte_le).map((r) => r.id);
    if (ids.length && !apercu) { await db.rpc('leads_marquer_exportes', { p_ids: ids }); reload(); }
  }
  return (
    <>
      <PageHead title="Mes contacts">
        <div className="ec-head-tools">
          <div className="ec-switch" role="group" aria-label="Affichage">
            <button type="button" className={vue === 'fiches' ? 'is-on' : ''} onClick={() => setVue('fiches')}>Fiches</button>
            <button type="button" className={vue === 'pipeline' ? 'is-on' : ''} onClick={() => setVue('pipeline')}>Pipeline</button>
            <button type="button" className={vue === 'tableau' ? 'is-on' : ''} onClick={() => setVue('tableau')}>Tableau</button>
          </div>
          <ExportMenu rows={exportRows} onExported={marquer} />
        </div>
      </PageHead>
      <div className="ec-tabs">{[['tous', 'Tous'], ['a_exporter', 'À exporter'], ['exportes', 'Exportés']].map(([k, t]) => <button type="button" key={k} className={tab === k ? 'is-on' : ''} onClick={() => setTab(k)}>{t}</button>)}</div>
      <button type="button" className="ec-filters-toggle" aria-expanded={showF} onClick={() => setShowF((o) => !o)}>{showF ? 'Masquer les filtres' : 'Filtrer et rechercher'}</button>
      <div className={`ec-filters-box${showF ? ' is-open' : ''}`}>{f.bar(true, 'Livré')}</div>
      <div className="ec-stfilter" role="group" aria-label="Filtrer par statut">
        <button type="button" className={!statut ? 'is-on' : ''} onClick={() => setStatut('')}>Tous <b>{f0.rows.length}</b></button>
        {Object.entries(SUIVI).map(([k, t]) => <button type="button" key={k} className={statut === k ? 'is-on' : ''} onClick={() => setStatut(k)}>{t} <b>{parStatut[k] || 0}</b></button>)}
      </div>
      {vue === 'pipeline' && wide && leads && (
        <div className="ec-pipe">
          {Object.entries(SUIVI).map(([k, t]) => {
            const col = f0.rows.filter((l) => st(l) === k);
            return (
              <section key={k} className={`ec-pipe-col is-${k}`}>
                <h3>{t}<b>{col.length}</b></h3>
                <div>{col.slice(0, 40).map((l) => <div key={l.id} role="button" tabIndex={0} className="ec-pipe-card" onClick={() => { setSel(l); setVue('fiches'); }} onKeyDown={(e) => { if (e.key === 'Enter') { setSel(l); setVue('fiches'); } }}><ContactCard lead={l} compact /></div>)}</div>
              </section>
            );
          })}
        </div>
      )}
      <div className="ec-count"><b>{f.rows.length}</b> contact{f.rows.length > 1 ? 's' : ''} · {tab === 'a_exporter' ? 'à exporter' : tab === 'exportes' ? 'déjà exportés' : 'du plus récent au plus ancien'}</div>
      {leads && f.rows.length > 0 && (vue === 'fiches' || (vue === 'pipeline' && !wide)) && (wide ? (
        <div className="ec-md">
          <ul className="ec-md-list">
            {f.rows.map((l) => {
              const cur = (sel && sel.id === l.id) || (!sel && l === f.rows[0]);
              return <li key={l.id} role="button" tabIndex={0} className={cur ? 'is-on' : ''} onClick={() => setSel(l)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSel(l); } }}><ContactCard lead={l} compact /></li>;
            })}
          </ul>
          <div className="ec-md-detail"><ContactCard lead={f.rows.find((l) => sel && l.id === sel.id) || f.rows[0]} client={client} litige={enLitige.get((sel || f.rows[0]).id)} onSignal={setLitigeFor} /></div>
        </div>
      ) : (
        <div className="ec-contacts">{f.rows.slice(0, 60).map((l) => <ContactCard key={l.id} lead={l} client={client} litige={enLitige.get(l.id)} onSignal={setLitigeFor} />)}</div>
      ))}
      {leads && f.rows.length === 0 ? (
        <Empty>{tab === 'a_exporter' ? <><p><b>Aucun lead à exporter : vous êtes à jour.</b></p><button type="button" className="ec-link-btn" onClick={() => setTab('tous')}>Voir tous les leads</button></> : <p>Aucun lead pour ces filtres.</p>}</Empty>
      ) : vue === 'tableau' && (
        <div className="ec-card ec-table-wrap">
          <table className="ec-table">
            <thead><tr><th>Livré le</th><th>Thématique</th><th>Prospect</th><th>Téléphone</th><th>E-mail</th><th>Code postal</th><th>Statut</th><th>Logement</th><th>Chauffage</th><th>Surface</th><th /></tr></thead>
            <tbody>
              {f.rows.map((l) => {
                const g = enLitige.get(l.id);
                return (
                  <tr key={l.id}>
                    <td>{dateHeure(l.livre_le)}</td>
                    <td>{THEMES[l.thematique] || l.thematique}</td>
                    <td><b>{[l.prenom, l.nom].filter(Boolean).join(' ') || '·'}</b></td>
                    <td><a href={`tel:${l.telephone}`}>{l.telephone || '·'}</a></td>
                    <td>{l.email || '·'}</td>
                    <td>{l.code_postal || '·'}{l.ville ? ` ${l.ville}` : ''}</td>
                    <td>{l.statut_occupation || '·'}</td>
                    <td>{l.type_logement || '·'}</td>
                    <td>{l.chauffage || '·'}</td>
                    <td>{l.surface || '·'}</td>
                    <td>{g ? <span className={`ec-status is-${g.statut}`}>Litige {LITIGE_STATUTS[g.statut].toLowerCase()}</span> : <button type="button" className="ec-link-btn" onClick={() => setLitigeFor(l)}>Signaler</button>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {litigeFor && <LitigeModal lead={litigeFor} apercu={apercu} onClose={() => setLitigeFor(null)} onDone={() => { setLitigeFor(null); reload(); }} />}
    </>
  );
}

function LitigeModal({ lead, apercu, onClose, onDone }) {
  const [motif, setMotif] = useState('doublon');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function submit(e) {
    e.preventDefault();
    setBusy(true); setError('');
    if (apercu) { onDone(); return; }
    const { error: err } = await db.from('litiges').insert({ lead_id: lead.id, motif, message: message.trim() || null });
    setBusy(false);
    if (err) setError(errMsg(err)); else onDone();
  }
  return (
    <div className="ec-modal" role="dialog" aria-modal="true" aria-label="Signaler un lead" onClick={onClose}>
      <form className="ec-modal-card" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <h2>Signaler un lead</h2>
        <p className="ec-modal-lead">{[lead.prenom, lead.nom].filter(Boolean).join(' ')} · {lead.code_postal} · livré le {dateFr(lead.livre_le)}</p>
        <p className="ec-sub">Motif</p>
        <div className="ec-seg ec-seg-sm">{Object.entries(MOTIFS).map(([k, t]) => <button type="button" key={k} className={motif === k ? 'is-on' : ''} onClick={() => setMotif(k)}><b>{t}</b></button>)}</div>
        <label className="ec-field"><span>Précision (facultatif)</span><textarea rows={3} value={message} onChange={(e) => setMessage(e.target.value)} maxLength={1000} placeholder={motif === 'doublon' ? 'Ex. déjà reçu le 12/10 sous un autre nom' : 'Ex. habite dans le 64, hors de ma zone'} /></label>
        <p className="ec-note">Un doublon ou un contact hors zone est remplacé après vérification. Les faux numéros ne sont pas remplacés.</p>
        {error && <p className="ec-err" role="alert">{error}</p>}
        <div className="ec-modal-actions"><button type="button" className="ec-btn-ghost" onClick={onClose}>Annuler</button><button type="submit" className="ec-btn" disabled={busy}>{busy ? 'Envoi…' : 'Envoyer le litige'}</button></div>
      </form>
    </div>
  );
}

// ─ Leads Shop ─
function Shop({ apercu }) {
  const { reload } = useData();
  const navigate = useNavigate();
  const [stock, setStock] = useState(null);
  const [error, setError] = useState('');
  const [sel, setSel] = useState(() => new Set());
  const [busy, setBusy] = useState(false);
  const [pmin, setPmin] = useState('');
  const [pmax, setPmax] = useState('');
  const [cp, setCp] = useState('');
  const [page, setPage] = useState(0);
  const load = useCallback(async () => {
    if (apercu) { setStock(apercu.stock); return; }
    const { data, error: err } = await db.rpc('shop_leads');
    if (err) setError(errMsg(err)); else setStock(data || []);
  }, [apercu]);
  useEffect(() => { load(); }, [load]);
  const f = useFilters(stock, 'recu_le');
  const rows = useMemo(() => f.rows.filter((r) => (!pmin || r.prix_ht >= +pmin) && (!pmax || r.prix_ht <= +pmax) && (!cp || (r.code_postal || '').startsWith(cp.trim()))), [f.rows, pmin, pmax, cp]);
  const PER = 25;
  const shown = rows.slice(page * PER, page * PER + PER);
  useEffect(() => { setPage(0); }, [rows.length]);
  const chosen = (stock || []).filter((r) => sel.has(r.id));
  const total = chosen.reduce((s, r) => s + Number(r.prix_ht), 0);
  const toggle = (id) => setSel((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const allOn = shown.length > 0 && shown.every((r) => sel.has(r.id));
  async function buy() {
    if (!chosen.length) return;
    if (!window.confirm(`Acheter ${chosen.length} lead${chosen.length > 1 ? 's' : ''} pour ${euro(total)} HT (${euro(total * (1 + TVA))} TTC) ? Un bon de commande sera créé, à régler par virement.`)) return;
    setBusy(true); setError('');
    if (apercu) { setBusy(false); setSel(new Set()); return; }
    const { data: cmdId, error: err } = await db.rpc('shop_acheter', { p_ids: chosen.map((r) => r.id) });
    setBusy(false);
    if (err) { setError(errMsg(err)); load(); return; }
    notifier('commande', cmdId);
    setSel(new Set());
    await reload();
    navigate('/espace/prospects');
  }
  return (
    <>
      <PageHead title="Leads Shop" sub="Leads disponibles à l’achat. Les coordonnées ne sont visibles qu’après l’achat. Les leads marqués « déjà transmis » étaient hors zone pour un premier professionnel : ils sont 5 € moins chers." />
      {f.bar(false, 'Reçu')}
      <div className="ec-filters ec-filters-2">
        <label><span>Prix min (€)</span><input inputMode="decimal" value={pmin} onChange={(e) => setPmin(e.target.value)} placeholder="Min" /></label>
        <label><span>Prix max (€)</span><input inputMode="decimal" value={pmax} onChange={(e) => setPmax(e.target.value)} placeholder="Max" /></label>
        <label><span>Code postal commence par</span><input value={cp} onChange={(e) => setCp(e.target.value)} placeholder="Ex. 3310" maxLength={5} /></label>
      </div>
      {error && <p className="ec-err" role="alert">{error}</p>}
      {stock && rows.length === 0 ? <Empty><p><b>Aucun lead disponible pour ces filtres.</b></p><p>Le stock se remplit chaque jour : revenez bientôt, ou passez une pré-commande depuis l’accueil.</p></Empty> : (
        <div className="ec-card ec-table-wrap">
          <table className="ec-table">
            <thead><tr>
              <th className="ec-cb"><input type="checkbox" aria-label="Tout sélectionner sur la page" checked={allOn} onChange={() => setSel((s) => { const n = new Set(s); shown.forEach((r) => (allOn ? n.delete(r.id) : n.add(r.id))); return n; })} /></th>
              <th>Consentement valable jusqu’au</th><th>Reçu le</th><th>Thématique</th><th className="ec-num">Prix HT</th><th>Code postal</th><th>Statut d’occupation</th><th>Type de logement</th><th>Chauffage</th><th>Surface</th>
            </tr></thead>
            <tbody>
              {shown.map((r) => (
                <tr key={r.id} className={sel.has(r.id) ? 'is-sel' : ''} onClick={() => toggle(r.id)}>
                  <td className="ec-cb"><input type="checkbox" aria-label="Sélectionner ce lead" checked={sel.has(r.id)} onChange={() => toggle(r.id)} onClick={(e) => e.stopPropagation()} /></td>
                  <td>{dateFr(r.consentement_jusqu)}</td><td>{dateHeure(r.recu_le)}</td><td>{THEMES[r.thematique]}</td><td className="ec-num"><b>{euro(r.prix_ht)}</b>{r.deja_transmis && <small className="ec-promo" title="Lead hors zone pour un premier professionnel, remis en vente à prix réduit">Déjà transmis · prix réduit</small>}</td>
                  <td>{r.code_postal || '·'}</td><td>{r.statut_occupation || '·'}</td><td>{r.type_logement || '·'}</td><td>{r.chauffage || '·'}</td><td>{r.surface || '·'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {rows.length > PER && (
        <div className="ec-pager">
          <button type="button" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Précédent</button>
          <span>{page * PER + 1}–{Math.min(rows.length, page * PER + PER)} sur {rows.length}</span>
          <button type="button" disabled={(page + 1) * PER >= rows.length} onClick={() => setPage((p) => p + 1)}>Suivant</button>
        </div>
      )}
      {chosen.length > 0 && (
        <div className="ec-cart">
          <span><b>{chosen.length}</b> lead{chosen.length > 1 ? 's' : ''} sélectionné{chosen.length > 1 ? 's' : ''} · <b>{euro(total)} HT</b></span>
          <button type="button" className="ec-btn-ghost is-dark" onClick={() => setSel(new Set())}>Vider</button>
          <button type="button" className="ec-btn" onClick={buy} disabled={busy}>{busy ? 'Achat…' : 'Acheter'}</button>
        </div>
      )}
    </>
  );
}

// ─ Mes litiges ─
function Litiges() {
  const { litiges, leads } = useData();
  const byId = useMemo(() => new Map((leads || []).map((l) => [l.id, l])), [leads]);
  const [q, setQ] = useState('');
  const [statut, setStatut] = useState('');
  const [motif, setMotif] = useState('');
  const rows = (litiges || []).filter((g) => {
    const l = byId.get(g.lead_id);
    if (statut && g.statut !== statut) return false;
    if (motif && g.motif !== motif) return false;
    if (q && !`${l?.prenom || ''} ${l?.nom || ''} ${g.message || ''} ${g.reponse || ''}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });
  return (
    <>
      <PageHead title="Mes litiges" sub="Signalez un lead depuis Mes prospects. Doublon ou hors zone : remplacé après vérification." />
      <div className="ec-filters">
        <label className="is-wide"><span>Recherche</span><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Lead, message ou réponse" /></label>
        <label><span>Statut</span><select value={statut} onChange={(e) => setStatut(e.target.value)}><option value="">Tous</option>{Object.entries(LITIGE_STATUTS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
        <label><span>Motif</span><select value={motif} onChange={(e) => setMotif(e.target.value)}><option value="">Tous</option>{Object.entries(MOTIFS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
      </div>
      {litiges && rows.length === 0 ? <Empty><p>Aucun litige.</p></Empty> : (
        <div className="ec-card ec-table-wrap">
          <table className="ec-table">
            <thead><tr><th>Lead</th><th>Motif</th><th>Message</th><th>Statut</th><th>Levé le</th><th>Réponse</th></tr></thead>
            <tbody>
              {rows.map((g) => {
                const l = byId.get(g.lead_id);
                return (
                  <tr key={g.id}>
                    <td><b>{l ? [l.prenom, l.nom].filter(Boolean).join(' ') : '·'}</b></td>
                    <td>{MOTIFS[g.motif]}</td>
                    <td className="ec-wrap">{g.message || '·'}</td>
                    <td><span className={`ec-status is-${g.statut}`}>{LITIGE_STATUTS[g.statut]}</span></td>
                    <td>{dateHeure(g.created_at)}</td>
                    <td className="ec-wrap">{g.reponse || (g.statut === 'accepte' ? (g.remplacement_id ? 'Remplacé' : 'Remplacement à venir') : '·')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

// ─ Étapes de campagne ─
export function Etapes({ etape = 'recue' }) {
  const k = Math.max(0, ETAPES.findIndex(([e]) => e === etape));
  return (
    <ol className="ec-steps" aria-label={`Étape : ${ETAPES[k][1]}`}>
      {ETAPES.map(([e, t], i) => <li key={e} className={i < k ? 'is-done' : i === k ? 'is-now' : ''}><i />{t}</li>)}
    </ol>
  );
}

// ─ Mes commandes ─
const CMD_STATUTS = { nouvelle: 'En validation', en_cours: 'En validation', ouverte: 'Ouverte', terminee: 'Terminée', refusee: 'Refusée' };
function Commandes() {
  const { commandes } = useData();
  const s = useStats();
  const [tab, setTab] = useState('en_cours');
  const all = commandes || [];
  const rows = tab === 'en_cours' ? all.filter((c) => c.statut === 'ouverte') : tab === 'pre' ? all.filter((c) => c.type === 'precommande' && !c.bdc_numero) : tab === 'shop' ? all.filter((c) => c.type === 'shop') : all;
  return (
    <>
      <PageHead title="Mes commandes"><Link to="/espace/precommande" className="ec-btn">Commander des contacts</Link></PageHead>
      <div className="ec-tabs">{[['en_cours', 'Commandes en cours'], ['toutes', 'Toutes les commandes'], ['pre', 'Pré-commandes'], ['shop', 'Commandes Shop']].map(([k, t]) => <button type="button" key={k} className={tab === k ? 'is-on' : ''} onClick={() => setTab(k)}>{t}</button>)}</div>
      {tab === 'en_cours' && s && s.enCours.length > 0 && (
        <div className="ec-progress-grid">
          {s.enCours.map((c) => {
            const n = s.livresPar[c.id] || 0;
            const pct = Math.min(100, Math.round((n / (c.plafond || 1)) * 100));
            return (
              <div className="ec-progress-card" key={c.id}>
                <div className="ec-progress-top"><b>{THEMES[c.thematique] || c.thematique}</b><span className="ec-chip">{c.type === 'shop' ? 'Shop' : 'Pré-commande'}</span></div>
                {c.type !== 'shop' && <Etapes etape={c.etape} />}
                <p>Livré <strong>{n}</strong> / Plafond <strong>{c.plafond}</strong></p>
                <p className="ec-small-l">Restant : <b>{Math.max(0, c.plafond - n)}</b></p>
                <div className="ec-bar"><span style={{ width: `${pct}%` }} /></div>
                {c.type !== 'shop' && pct >= SEUIL_RECONDUIRE * 100 && <Link to={reconduireHref(c)} className="ec-btn ec-btn-sm">Reconduire cette commande</Link>}
              </div>
            );
          })}
        </div>
      )}
      {tab === 'pre' && rows.length > 0 && (
        <div className="ec-progress-grid">
          {rows.map((c) => (
            <div className="ec-progress-card" key={c.id}>
              <div className="ec-progress-top"><b>{THEMES[c.thematique] || c.thematique}</b><span className="ec-chip">{c.volume} leads</span></div>
              <Etapes etape={c.etape} />
              <p className="ec-small-l">Zone : {c.zone || '·'}</p>
            </div>
          ))}
        </div>
      )}
      {commandes && rows.length === 0 ? <Empty><p>{tab === 'pre' ? 'Aucune pré-commande en attente de validation.' : 'Aucune commande ici pour l’instant.'}</p><Link to="/espace/precommande" className="ec-btn">Pré-commander</Link></Empty> : (
        <div className="ec-card ec-table-wrap">
          <table className="ec-table">
            <thead><tr><th>Date</th><th>N° du BDC</th><th>Thématique</th><th>Quantité</th><th>Avancement</th><th className="ec-num">Montant HT</th><th>Étape</th><th>Statut</th></tr></thead>
            <tbody>
              {rows.map((c) => {
                const n = s?.livresPar[c.id] || 0;
                return (
                  <tr key={c.id}>
                    <td>{dateHeure(c.created_at)}</td>
                    <td>{c.bdc_numero || <span className="ec-muted">En validation</span>}</td>
                    <td>{THEMES[c.thematique] || c.thematique || '·'}</td>
                    <td>{c.plafond || c.volume || '·'} leads</td>
                    <td>{c.plafond ? <span className="ec-mini-bar"><i><em style={{ width: `${Math.min(100, (n / c.plafond) * 100)}%` }} /></i>{n} / {c.plafond}</span> : '·'}</td>
                    <td className="ec-num">{c.montant_ht != null ? <><b>{euro(c.montant_ht)}</b><small>{euro(c.montant_ht * (1 + TVA))} TTC</small></> : '·'}</td>
                    <td>{c.type === 'shop' ? '·' : (ETAPES.find(([e]) => e === c.etape) || ETAPES[0])[1]}</td>
                    <td><span className={`ec-status is-${c.statut}`}>{CMD_STATUTS[c.statut] || c.statut}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

// ─ Comptabilité ─
function Compta() {
  const s = useStats();
  const bdc = s?.bdc || [];
  const regle = bdc.filter((c) => c.regle_le).reduce((t, c) => t + Number(c.montant_ht || 0), 0);
  return (
    <>
      <PageHead title="Comptabilité" sub="Vos bons de commande et leur règlement. Paiement par virement à réception du bon de commande." />
      <div className="ec-kpis">
        <div className="ec-kpi"><b>Montant dû</b><span>Bons de commande à régler</span><strong>{s ? euro(s.du) : '·'}</strong><small>{s ? `${euro(s.du * (1 + TVA))} TTC` : ''}</small></div>
        <div className="ec-kpi"><b>Déjà réglé</b><span>Toutes périodes, HT</span><strong>{euro(regle)}</strong></div>
        <div className="ec-kpi"><b>Bons de commande</b><span>Approuvés</span><strong>{bdc.length}</strong></div>
      </div>
      {bdc.length === 0 ? <Empty><p>Aucun bon de commande pour l’instant.</p></Empty> : (
        <div className="ec-card ec-table-wrap">
          <table className="ec-table">
            <thead><tr><th>N° du BDC</th><th>Date</th><th>Objet</th><th className="ec-num">Montant HT</th><th className="ec-num">TTC</th><th>Règlement</th></tr></thead>
            <tbody>
              {bdc.map((c) => (
                <tr key={c.id}>
                  <td><b>{c.bdc_numero}</b></td><td>{dateFr(c.approuve_le || c.created_at)}</td>
                  <td>{c.plafond} leads {THEMES[c.thematique] ? THEMES[c.thematique].toLowerCase() : c.thematique}{c.type === 'shop' ? ' (Shop)' : ''}</td>
                  <td className="ec-num">{euro(c.montant_ht)}</td><td className="ec-num">{euro(c.montant_ht * (1 + TVA))}</td>
                  <td>{c.regle_le ? <span className="ec-status is-ouverte">Réglé le {dateFr(c.regle_le)}</span> : <span className="ec-status is-en_attente">À régler</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="ec-note">Les factures et le paiement par carte arrivent bientôt. Une question sur un règlement ? <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>
    </>
  );
}

function Contrats() {
  return (
    <>
      <PageHead title="Mes contrats" sub="Vos conditions de vente et vos contrats signés." />
      <Empty><p>Aucun contrat pour l’instant. Nous les déposons ici dès qu’ils sont signés.</p></Empty>
    </>
  );
}

// ─ Alertes : e-mail, notification mobile, webhook vers le CRM du client (lot 3, 30/10/2026) ─
const pushOk = () => typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
const b64ToBytes = (b64) => { const p = '='.repeat((4 - (b64.length % 4)) % 4); const raw = atob((b64 + p).replace(/-/g, '+').replace(/_/g, '/')); return Uint8Array.from(raw, (c) => c.charCodeAt(0)); };
const appareil = () => { const ua = navigator.userAgent; return /iPhone|iPad/.test(ua) ? 'iPhone ou iPad' : /Android/.test(ua) ? 'Android' : /Mac/.test(ua) ? 'Mac' : /Windows/.test(ua) ? 'Windows' : 'Navigateur'; };
const isIos = () => typeof navigator !== 'undefined' && /iPhone|iPad/.test(navigator.userAgent);
const standalone = () => typeof window !== 'undefined' && (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true);

async function abonnerAppareil(userId) {
  const cle = await fetch('/api/livraison').then((r) => r.json()).catch(() => ({}));
  if (!cle.vapid) throw new Error('push_non_configure');
  if ((await Notification.requestPermission()) !== 'granted') throw new Error('permission_refusee');
  const reg = await navigator.serviceWorker.register('/sw-espace.js', { scope: '/espace' });
  await navigator.serviceWorker.ready;
  const sub = (await reg.pushManager.getSubscription()) || await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64ToBytes(cle.vapid) });
  const j = sub.toJSON();
  const { error } = await db.from('push_abonnements').insert({ user_id: userId, endpoint: j.endpoint, p256dh: j.keys.p256dh, auth: j.keys.auth, appareil: appareil() });
  if (error && !String(error.message).includes('duplicate')) throw error;
}

function Alertes({ session, apercu }) {
  const [p, setP] = useState(null);
  const [busy, setBusy] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  useEffect(() => {
    if (apercu) { setP({ alerte_email: true, email: session.user.email, alerte_push: false, webhook_url: '' }); return; }
    db.from('client_prefs').select('*').eq('user_id', session.user.id).maybeSingle()
      .then(({ data }) => setP(data ? { ...data, webhook_url: data.webhook_url || '' } : { alerte_email: true, email: session.user.email, alerte_push: false, webhook_url: '' }));
  }, [session, apercu]);
  if (!p) return <div className="ec-card"><p className="ec-muted">Chargement…</p></div>;
  const set = (k, v) => setP((x) => ({ ...x, [k]: v }));
  async function save(next = p) {
    setErr(''); setMsg('');
    const url = (next.webhook_url || '').trim();
    if (url && !/^https:\/\/\S+$/i.test(url)) { setErr('L’adresse du webhook doit commencer par https://'); return false; }
    if (next.alerte_email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(next.email || '')) { setErr('Indiquez une adresse e-mail valide pour les alertes.'); return false; }
    if (apercu) { setMsg('Enregistré (aperçu : rien n’est écrit).'); return true; }
    const { error } = await db.from('client_prefs').upsert({ user_id: session.user.id, alerte_email: next.alerte_email, email: next.email || null, alerte_push: next.alerte_push, webhook_url: url || null, maj_le: new Date().toISOString() });
    if (error) { setErr('L’enregistrement n’a pas abouti. Réessayez.'); return false; }
    setMsg('Préférences enregistrées.');
    return true;
  }
  async function activerPush(on) {
    setErr(''); setMsg('');
    if (!on) { const n = { ...p, alerte_push: false }; setP(n); await save(n); return; }
    if (!pushOk()) { setErr(isIos() && !standalone() ? 'Sur iPhone : touchez Partager, puis « Sur l’écran d’accueil », ouvrez Kairn depuis l’icône et réactivez ici.' : 'Ce navigateur ne gère pas les notifications. Essayez Chrome, Safari ou Edge à jour.'); return; }
    setBusy('push');
    try {
      if (!apercu) await abonnerAppareil(session.user.id);
      const n = { ...p, alerte_push: true }; setP(n); await save(n);
      setMsg('Notifications activées sur cet appareil.');
    } catch (e) {
      setErr(e.message === 'permission_refusee' ? 'Notifications refusées : autorisez-les dans les réglages du navigateur pour ce site.'
        : e.message === 'push_non_configure' ? 'Les notifications mobiles ne sont pas encore disponibles. Utilisez l’e-mail en attendant.'
          : 'Activation impossible pour le moment. Réessayez.');
    }
    setBusy('');
  }
  async function tester() {
    setErr(''); setMsg('');
    if (!(await save())) return;
    if (apercu) return;
    setBusy('test');
    const { data } = await db.auth.getSession();
    const r = await fetch('/api/livraison', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${data.session?.access_token}` }, body: JSON.stringify({ test: true }) }).then((x) => x.json()).catch(() => null);
    setBusy('');
    if (!r?.ok) { setErr('Le test n’a pas pu partir. Réessayez.'); return; }
    const lu = { envoye: 'envoyé', desactive: 'désactivé', aucun: 'aucun', non_configure: 'pas encore disponible', aucun_appareil: 'aucun appareil abonné', echec: 'échec' };
    const f = (v) => lu[v] || (String(v).startsWith('envoye_') ? `envoyé (${String(v).slice(7)} appareil)` : String(v).startsWith('refuse_') ? `refusé (code ${String(v).slice(7)})` : v);
    setMsg(`Test envoyé. E-mail : ${f(r.email)}. Mobile : ${f(r.push)}. Webhook : ${f(r.webhook)}.`);
  }
  return (
    <div className="ec-card ec-alertes">
      <h2>Être prévenu d’un nouveau contact</h2>
      <p className="ec-muted">Choisissez comment vous êtes alerté dès qu’un contact vous est livré. Rappeler vite, c’est ce qui fait décrocher.</p>
      <div className="ec-alerte">
        <label className="ec-toggle"><input type="checkbox" checked={p.alerte_email} onChange={(e) => set('alerte_email', e.target.checked)} /><span><b>Par e-mail</b><small>Un e-mail avec les contacts livrés.</small></span></label>
        {p.alerte_email && <label className="ec-field"><span>Adresse des alertes</span><input type="email" value={p.email || ''} onChange={(e) => set('email', e.target.value)} placeholder="commercial@votre-societe.fr" /></label>}
      </div>
      <div className="ec-alerte">
        <label className="ec-toggle"><input type="checkbox" checked={p.alerte_push} disabled={busy === 'push'} onChange={(e) => activerPush(e.target.checked)} /><span><b>Notification sur ce téléphone</b><small>{isIos() && !standalone() ? 'Sur iPhone, ajoutez d’abord l’espace à l’écran d’accueil (Partager, puis « Sur l’écran d’accueil »).' : 'Une notification sur cet appareil, comme un SMS. À activer sur chaque téléphone.'}</small></span></label>
      </div>
      <div className="ec-alerte">
        <label className="ec-field"><span>Envoyer vers mon CRM (webhook, facultatif)</span><input type="url" value={p.webhook_url} onChange={(e) => set('webhook_url', e.target.value)} placeholder="https://hooks.zapier.com/…" /></label>
        <small className="ec-muted">Chaque contact livré part aussitôt vers cette adresse. Avec Zapier ou Make, il arrive dans votre CRM, votre Google Sheet ou votre Excel en ligne.</small>
      </div>
      {err && <p className="ec-err" role="alert">{err}</p>}
      {msg && <p className="ec-ok">{msg}</p>}
      <div className="ec-alertes-actions">
        <button type="button" className="ec-btn" onClick={() => save()}>Enregistrer</button>
        <button type="button" className="ec-btn-ghost" onClick={tester} disabled={busy === 'test'}>{busy === 'test' ? 'Envoi…' : 'Envoyer un test'}</button>
      </div>
    </div>
  );
}

function Account({ session, client, apercu }) {
  return (
    <>
      <PageHead title="Mon compte" />
      <Alertes session={session} apercu={apercu} />
      <div className="ec-card">
        <dl className="ec-dl">
          <div><dt>Société</dt><dd>{client?.societe || '·'}</dd></div>
          <div><dt>Contact</dt><dd>{client?.prenom || '·'}</dd></div>
          <div><dt>E-mail de connexion</dt><dd>{session.user.email}</dd></div>
          <div><dt>Téléphone</dt><dd>{client?.telephone || '·'}</dd></div>
          <div><dt>SIRET</dt><dd>{client?.siret || '·'}</dd></div>
        </dl>
        <p className="ec-small">Une information à changer ? Écrivez à <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>
      </div>
    </>
  );
}

// ─ cadre : barre du haut, menu à gauche ─
function Shell({ session, client, apercu }) {
  const [open, setOpen] = useState(false);
  const data = useClientData(session, apercu);
  const initials = (client?.societe || session.user.email).split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <Data.Provider value={data}>
      <div className={`ec${open ? ' is-open' : ''}`}>
        <header className="ec-top">
          <Link to="/" className="brand"><KairnLogo />Kairn</Link>
          <span className="ec-company">{client?.societe || session.user.email}</span>
          <Link to="/espace/compte" className="ec-avatar" aria-label="Mon compte">{initials}</Link>
          <button type="button" className="ec-burger" aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'} aria-expanded={open} onClick={() => setOpen((o) => !o)}><span /><span /></button>
        </header>
        <aside className="ec-side">
          <p className="ec-side-label">Navigation</p>
          <nav aria-label="Espace client">
            {MENU.map((m) => (
              <NavLink key={m.to} to={m.to} end={m.end} className={({ isActive }) => `ec-link${isActive ? ' is-active' : ''}`} onClick={() => setOpen(false)}>
                <Ico>{m.ico}</Ico><span>{m.t}</span>
              </NavLink>
            ))}
          </nav>
          <div className="ec-side-foot">
            {WHATSAPP_NUMBER && <a href={whatsappUrl('Bonjour Ugo, une question depuis mon espace client.')} target="_blank" rel="noopener noreferrer" className="ec-help">Une question ? <b>Nous écrire sur WhatsApp</b></a>}
            <button type="button" className="ec-logout" onClick={() => db.auth.signOut()}>Se déconnecter</button>
          </div>
        </aside>
        {!apercu && <Tickets session={session} />}
        <nav className="ec-tabbar" aria-label="Navigation rapide">
          {MENU.filter((m) => m.tab).map((m) => (
            <NavLink key={m.to} to={m.to} end={m.end} className={({ isActive }) => (isActive ? 'is-active' : undefined)} onClick={() => setOpen(false)}>
              <Ico size={21}>{m.ico}</Ico><span>{m.tab}</span>
            </NavLink>
          ))}
          <button type="button" className={open ? 'is-active' : undefined} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            <Ico size={21}><circle cx="5" cy="12" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="19" cy="12" r="1.6" /></Ico><span>Plus</span>
          </button>
        </nav>
        <main className="ec-main">
          {data.error && <p className="ec-err">{data.error}</p>}
          <Routes>
            <Route index element={<Home client={client} apercu={apercu} />} />
            <Route path="prospects" element={<Prospects apercu={apercu} client={client} />} />
            <Route path="shop" element={<Shop apercu={apercu} />} />
            <Route path="litiges" element={<Litiges />} />
            <Route path="commandes" element={<Commandes />} />
            <Route path="precommande" element={<Precommande session={session} client={client} apercu={apercu} />} />
            <Route path="comptabilite" element={<Compta />} />
            <Route path="contrats" element={<Contrats />} />
            <Route path="compte" element={<Account session={session} client={client} apercu={apercu} />} />
            <Route path="*" element={<Home client={client} apercu={apercu} />} />
          </Routes>
        </main>
      </div>
    </Data.Provider>
  );
}

export default function ClientSpace() {
  useV2Favicon();
  // Manifeste propre à l'espace : installé sur l'écran d'accueil, il s'ouvre sur /espace (notifications sur iPhone).
  useEffect(() => {
    const link = document.querySelector('link[rel="manifest"]');
    if (!link) return undefined;
    const prev = link.getAttribute('href');
    link.setAttribute('href', '/espace.webmanifest');
    return () => link.setAttribute('href', prev);
  }, []);
  const [session, setSession] = useState(undefined);
  const [client, setClient] = useState(undefined);
  const [admin, setAdmin] = useState(false);
  useEffect(() => {
    db.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = db.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);
  useEffect(() => {
    if (!session) { setClient(undefined); return; }
    db.from('clients').select('societe, prenom, telephone, siret').eq('user_id', session.user.id).maybeSingle()
      .then(({ data }) => setClient(data || null));
    db.rpc('is_admin').then(({ data }) => setAdmin(Boolean(data)));
  }, [session]);

  // Aperçu en développement seulement (/espace?apercu) : faux client et fausses données, rien n'est lu ni écrit en base.
  const apercu = useMemo(() => (import.meta.env.DEV && new URLSearchParams(window.location.search).has('apercu') ? apercuData() : null), []);
  if (apercu) {
    return <div className="v2 v3 ec-root"><Shell session={{ user: { id: 'apercu', email: 'client@exemple.fr' } }} client={{ societe: 'Exemple Chauffage', prenom: 'Julien' }} apercu={apercu} /></div>;
  }

  let body;
  if (session === undefined || (session && client === undefined)) body = <div className="ec-loading" aria-busy="true" />;
  else if (!session) body = <Login />;
  // Compte admin : il vend des leads, il n'en achète pas. Il part sur Kairn Admin (/gestion), pas sur une vue client
  // (Ugo, 29/10/2026 : « en tant qu'admin je n'ai pas besoin de voir combien coûtent les leads »).
  else if (!client && admin) body = <Navigate to="/gestion" replace />;
  else if (!client) {
    body = (
      <div className="ec-login">
        <div className="ec-login-card">
          <Link to="/" className="brand"><KairnLogo />Kairn</Link>
          <h1>Accès en préparation</h1>
          <p>Votre compte existe, mais votre espace n’est pas encore ouvert. Nous l’activons après votre premier échange.</p>
          <button type="button" className="ec-btn" onClick={() => db.auth.signOut()}>Se déconnecter</button>
        </div>
      </div>
    );
  } else body = <Shell session={session} client={client} />;

  return <div className="v2 v3 ec-root">{body}</div>;
}
