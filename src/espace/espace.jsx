import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Link, Navigate, NavLink, Route, Routes, useNavigate, useSearchParams } from 'react-router-dom';
import { KairnLogo, useV2Favicon } from '../v2/layout.jsx';
import { PRODUITS, GARANTIES } from '../v3/produits.js';
import { CONTACT_EMAIL, WHATSAPP_NUMBER, whatsappUrl } from '../config.js';
import { db, THEMES, MOTIFS, LITIGE_STATUTS, TVA, euro, dateFr, dateHeure, errMsg, downloadCsv } from './db.js';
import { apercuData } from './apercu.js';
import '../v2/v2.css';
import '../v3/v3.css';
import './espace.css';

// Espace client Kairn (29/10/2026), sur le modèle de Flow d'AKA Médias (captures d'Ugo) avec la DA Kairn :
// Accueil (tableau de bord, raccourcis, catalogue), Mes prospects, Leads Shop, Mes litiges, Mes commandes, Comptabilité, Mes contrats.
// Paiement par bon de commande (Stripe plus tard). Litiges : doublon ou hors zone seulement, Ugo tranche dans Kairn Admin (/gestion).

const MENU = [
  { to: '/espace', end: true, t: 'Accueil', ico: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></> },
  { to: '/espace/prospects', t: 'Mes prospects', ico: <><circle cx="9" cy="8" r="4" /><path d="M2 21v-1a6 6 0 0 1 12 0v1M16 4a4 4 0 0 1 0 8M22 21v-1a6 6 0 0 0-4-5.6" /></> },
  { to: '/espace/shop', t: 'Leads Shop', ico: <><path d="M6 6h15l-2 9H7z" /><circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M6 6 5 2H2" /></> },
  { to: '/espace/litiges', t: 'Mes litiges', ico: <><path d="M12 3v18M5 21h14M5 8l-3 6a3 3 0 0 0 6 0zM19 8l-3 6a3 3 0 0 0 6 0zM5 8h14" /></> },
  { to: '/espace/commandes', t: 'Mes commandes', ico: <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" /></> },
  { to: '/espace/comptabilite', t: 'Comptabilité', ico: <><rect x="4" y="2" width="16" height="20" rx="2" /><path d="M8 6h8M8 10h2M14 10h2M8 14h2M14 14h2M8 18h2M14 18h2" /></> },
  { to: '/espace/contrats', t: 'Mes contrats', ico: <><path d="M6 2h9l5 5v15H6z" /><path d="M14 2v6h6M9 13h6M9 17h6" /></> },
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
  const [state, setState] = useState({ leads: null, commandes: null, litiges: null, error: '' });
  const load = useCallback(async () => {
    if (apercu) { setState({ ...apercu, error: '' }); return; }
    const uid = session.user.id;
    const [l, c, g] = await Promise.all([
      db.from('leads').select('*').eq('client_id', uid).order('livre_le', { ascending: false }),
      db.from('commandes').select('*').eq('user_id', uid).order('created_at', { ascending: false }),
      db.from('litiges').select('*').eq('client_id', uid).order('created_at', { ascending: false }),
    ]);
    setState({ leads: l.data || [], commandes: c.data || [], litiges: g.data || [], error: l.error || c.error || g.error ? 'Une partie de vos données n’a pas pu être chargée.' : '' });
  }, [session.user.id, apercu]);
  useEffect(() => { load(); }, [load]);
  return { ...state, reload: load };
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

// ─ Accueil ─
function Home({ client }) {
  const s = useStats();
  return (
    <>
      <PageHead title={`Bienvenue${client?.prenom ? `, ${client.prenom}` : ''}`} sub="Des leads exclusifs, qualifiés et livrés en continu." />
      <p className="ec-label">Tableau de bord</p>
      <div className="ec-kpis">
        <div className="ec-kpi"><b>Nombre de prospects</b><span>Leads livrés, toutes périodes</span><strong>{s ? s.livres : '·'}</strong>{s && <Completion done={s.livresCmd} total={s.commande} />}</div>
        <div className="ec-kpi"><b>Reste à livrer</b><span>Sur vos commandes en cours</span><strong>{s ? s.reste : '·'}</strong></div>
        <div className="ec-kpi"><b>Montant dû</b><span>Bons de commande approuvés à régler, HT</span><strong>{s ? euro(s.du) : '·'}</strong></div>
      </div>
      <p className="ec-label">Raccourcis</p>
      <div className="ec-shortcuts">
        <Link to="/espace/prospects"><b>Mes prospects</b><span>Consulter les leads livrés</span><Arrow /></Link>
        <Link to="/espace/commandes"><b>Mes commandes</b><span>Suivre vos commandes et vos plafonds</span><Arrow /></Link>
        <Link to="/espace/shop"><b>Leads Shop</b><span>Acheter des leads disponibles tout de suite</span><Arrow /></Link>
      </div>
      <p className="ec-label">Catalogue de campagnes</p>
      <p className="ec-label-sub">Choisissez votre thématique et passez votre pré-commande.</p>
      <div className="ec-cat">
        {PRODUITS.map((p) => (
          <article className={`ec-offer is-${p.code.toLowerCase()}`} key={p.code}>
            <div className="ec-offer-top">
              <span className="ec-offer-ico">{p.code}</span>
              <div><h2>Leads {p.code}</h2><p>{p.nom}</p></div>
            </div>
            <p className="ec-offer-price"><b>{p.prix} €</b> HT / lead</p>
            <span className="ec-chip">Minimum 50 leads</span>
            <p className="ec-sub">Ce que vous recevez</p>
            <ul className="ec-grid-checks">{['Nom', 'Téléphone', 'E-mail', 'Code postal', 'Date de réception'].map((x) => <li key={x}><Check />{x}</li>)}</ul>
            <div className="ec-qualif">
              <p className="ec-sub">Qualification</p>
              <ul className="ec-grid-checks">{['Propriétaire ou non', 'Type de logement', 'Délai du projet'].map((x) => <li key={x}><Check />{x}</li>)}</ul>
            </div>
            <Link to={`/espace/precommande?thematique=${p.code}`} className="ec-btn">Pré-commander</Link>
          </article>
        ))}
      </div>
      <div className="ec-panel">
        <ul className="ec-checks">{GARANTIES.map((g) => <li key={g}>{g}</li>)}</ul>
      </div>
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
  const [qte, setQte] = useState(100);
  const [zone, setZone] = useState('');
  const [state, setState] = useState('idle');
  const [error, setError] = useState('');
  const prod = PRODUITS.find((p) => p.code === them);
  async function submit(e) {
    e.preventDefault();
    if (!zone.trim()) { setError('Indiquez vos départements.'); return; }
    setError(''); setState('sending');
    if (apercu) { setState('sent'); return; }
    const { error: err } = await db.from('commandes').insert({
      user_id: session.user.id, souhait: 'leads', type: 'precommande', thematique: them, volume: String(qte), zone: zone.trim().slice(0, 200),
      societe: client?.societe || null, nom: client?.prenom || null, email: session.user.email, telephone: client?.telephone || null, siret: client?.siret || null,
      page: '/espace/precommande',
    });
    if (err) { setState('idle'); setError(errMsg(err)); return; }
    setState('sent');
    reload();
    setTimeout(() => navigate('/espace/commandes'), 1600);
  }
  return (
    <>
      <PageHead title="Pré-commande" sub="Ugo valide votre zone et votre volume, puis ouvre le flux : vous recevez le bon de commande dans Mes commandes." />
      <form className="ec-card ec-form" onSubmit={submit}>
        <p className="ec-sub">Thématique</p>
        <div className="ec-seg">{PRODUITS.map((p) => <button type="button" key={p.code} className={them === p.code ? 'is-on' : ''} onClick={() => setThem(p.code)}><b>{p.code}</b><span>{p.nom} · {p.prix} € HT</span></button>)}</div>
        <p className="ec-sub">Nombre de leads</p>
        <div className="ec-seg ec-seg-sm">{QUANTITES.map((q) => <button type="button" key={q} className={qte === q ? 'is-on' : ''} onClick={() => setQte(q)}><b>{q}</b></button>)}</div>
        <label className="ec-field"><span>Départements couverts</span><input value={zone} onChange={(e) => setZone(e.target.value)} placeholder="Ex. 33, 24, 47" maxLength={200} /></label>
        <div className="ec-total"><span>Montant estimé</span><b>{euro(qte * prod.prix)} HT</b><em>{euro(qte * prod.prix * (1 + TVA))} TTC</em></div>
        {error && <p className="ec-err" role="alert">{error}</p>}
        {state === 'sent' ? <p className="ec-ok">Pré-commande envoyée. Ugo revient vers vous pour valider la zone.</p>
          : <button type="submit" className="ec-btn" disabled={state === 'sending'}>{state === 'sending' ? 'Envoi…' : 'Envoyer la pré-commande'}</button>}
      </form>
    </>
  );
}

// ─ Mes prospects ─
const COLS_PROSPECTS = [['livre_le', 'Livré le'], ['thematique', 'Thématique'], ['prenom', 'Prénom'], ['nom', 'Nom'], ['telephone', 'Téléphone'], ['email', 'E-mail'], ['code_postal', 'Code postal'], ['ville', 'Ville'], ['statut_occupation', 'Statut d’occupation'], ['type_logement', 'Type de logement'], ['chauffage', 'Chauffage'], ['surface', 'Surface']];

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

function Prospects({ apercu }) {
  const { leads, litiges, reload } = useData();
  const [tab, setTab] = useState('a_exporter');
  const [litigeFor, setLitigeFor] = useState(null);
  const enLitige = useMemo(() => new Map((litiges || []).map((g) => [g.lead_id, g])), [litiges]);
  const base = useMemo(() => (leads || []).filter((l) => !l.annule && (tab === 'tous' || (tab === 'exportes' ? l.exporte_le : !l.exporte_le))), [leads, tab]);
  const f = useFilters(base, 'livre_le');
  async function exporter() {
    downloadCsv(`kairn-prospects-${new Date().toISOString().slice(0, 10)}.csv`, COLS_PROSPECTS.map(([k, t]) => [k === 'livre_le' ? (r) => dateHeure(r.livre_le) : k, t]), f.rows);
    const ids = f.rows.filter((r) => !r.exporte_le).map((r) => r.id);
    if (ids.length && !apercu) { await db.rpc('leads_marquer_exportes', { p_ids: ids }); reload(); }
  }
  return (
    <>
      <PageHead title="Mes prospects">
        <button type="button" className="ec-btn-ghost" onClick={exporter} disabled={!f.rows.length}><Ico size={16}><path d="M12 3v12M7 10l5 5 5-5M4 21h16" /></Ico>Exporter ({f.rows.length})</button>
      </PageHead>
      <div className="ec-tabs">{[['a_exporter', 'À exporter'], ['tous', 'Tous les leads'], ['exportes', 'Exportés']].map(([k, t]) => <button type="button" key={k} className={tab === k ? 'is-on' : ''} onClick={() => setTab(k)}>{t}</button>)}</div>
      {f.bar(true, 'Livré')}
      <div className="ec-count"><b>{f.rows.length}</b> leads livrés · {tab === 'a_exporter' ? 'à exporter' : tab === 'exportes' ? 'déjà exportés' : 'toutes périodes confondues'}</div>
      {leads && f.rows.length === 0 ? (
        <Empty>{tab === 'a_exporter' ? <><p><b>Aucun lead à exporter : vous êtes à jour.</b></p><button type="button" className="ec-link-btn" onClick={() => setTab('tous')}>Voir tous les leads</button></> : <p>Aucun lead pour ces filtres.</p>}</Empty>
      ) : (
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
    const { error: err } = await db.rpc('shop_acheter', { p_ids: chosen.map((r) => r.id) });
    setBusy(false);
    if (err) { setError(errMsg(err)); load(); return; }
    setSel(new Set());
    await reload();
    navigate('/espace/prospects');
  }
  return (
    <>
      <PageHead title="Leads Shop" sub="Leads disponibles à l’achat. Les coordonnées ne sont visibles qu’après l’achat." />
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
                  <td>{dateFr(r.consentement_jusqu)}</td><td>{dateHeure(r.recu_le)}</td><td>{THEMES[r.thematique]}</td><td className="ec-num"><b>{euro(r.prix_ht)}</b></td>
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
      <PageHead title="Mes commandes"><Link to="/espace/precommande" className="ec-btn">Demander une commande</Link></PageHead>
      <div className="ec-tabs">{[['en_cours', 'Commandes en cours'], ['toutes', 'Toutes les commandes'], ['pre', 'Pré-commandes'], ['shop', 'Commandes Shop']].map(([k, t]) => <button type="button" key={k} className={tab === k ? 'is-on' : ''} onClick={() => setTab(k)}>{t}</button>)}</div>
      {tab === 'en_cours' && s && s.enCours.length > 0 && (
        <div className="ec-progress-grid">
          {s.enCours.map((c) => {
            const n = s.livresPar[c.id] || 0;
            const pct = Math.min(100, Math.round((n / (c.plafond || 1)) * 100));
            return (
              <div className="ec-progress-card" key={c.id}>
                <div className="ec-progress-top"><b>{THEMES[c.thematique] || c.thematique}</b><span className="ec-chip">{c.type === 'shop' ? 'Shop' : 'Pré-commande'}</span></div>
                <p>Livré <strong>{n}</strong> / Plafond <strong>{c.plafond}</strong></p>
                <p className="ec-small-l">Restant : <b>{Math.max(0, c.plafond - n)}</b></p>
                <div className="ec-bar"><span style={{ width: `${pct}%` }} /></div>
              </div>
            );
          })}
        </div>
      )}
      {commandes && rows.length === 0 ? <Empty><p>{tab === 'pre' ? 'Aucune pré-commande en attente de validation.' : 'Aucune commande ici pour l’instant.'}</p><Link to="/espace/precommande" className="ec-btn">Pré-commander</Link></Empty> : (
        <div className="ec-card ec-table-wrap">
          <table className="ec-table">
            <thead><tr><th>Date</th><th>N° du BDC</th><th>Thématique</th><th>Quantité</th><th>Avancement</th><th className="ec-num">Montant HT</th><th>Statut</th></tr></thead>
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
      <Empty><p>Aucun contrat pour l’instant. Ugo les dépose ici dès qu’ils sont signés.</p></Empty>
    </>
  );
}

function Account({ session, client }) {
  return (
    <>
      <PageHead title="Mon compte" />
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
            {WHATSAPP_NUMBER && <a href={whatsappUrl('Bonjour Ugo, une question depuis mon espace client.')} target="_blank" rel="noopener noreferrer" className="ec-help">Une question ? <b>Écrire à Ugo</b></a>}
            <button type="button" className="ec-logout" onClick={() => db.auth.signOut()}>Se déconnecter</button>
          </div>
        </aside>
        <main className="ec-main">
          {data.error && <p className="ec-err">{data.error}</p>}
          <Routes>
            <Route index element={<Home client={client} />} />
            <Route path="prospects" element={<Prospects apercu={apercu} />} />
            <Route path="shop" element={<Shop apercu={apercu} />} />
            <Route path="litiges" element={<Litiges />} />
            <Route path="commandes" element={<Commandes />} />
            <Route path="precommande" element={<Precommande session={session} client={client} apercu={apercu} />} />
            <Route path="comptabilite" element={<Compta />} />
            <Route path="contrats" element={<Contrats />} />
            <Route path="compte" element={<Account session={session} client={client} />} />
            <Route path="*" element={<Home client={client} />} />
          </Routes>
        </main>
      </div>
    </Data.Provider>
  );
}

export default function ClientSpace() {
  useV2Favicon();
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
          <p>Votre compte existe, mais votre espace n’est pas encore ouvert. Ugo l’active après votre premier échange.</p>
          <button type="button" className="ec-btn" onClick={() => db.auth.signOut()}>Se déconnecter</button>
        </div>
      </div>
    );
  } else body = <Shell session={session} client={client} />;

  return <div className="v2 v3 ec-root">{body}</div>;
}
