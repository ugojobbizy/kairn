import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, NavLink, Navigate, Route, Routes } from 'react-router-dom';
import { KairnLogo, useV2Favicon } from '../v2/layout.jsx';
import { CONTACT_EMAIL } from '../config.js';
import { db, THEMES, euro, dateFr } from '../espace/db.js';
import { STATUTS_COMMISSION, CLASSE_COMMISSION } from './statuts.js';
import '../v2/v2.css';
import '../v3/v3.css';
import '../espace/espace.css';

// Espace apporteur d'affaires (/apporteur, Ugo, 13/11/2026) : ses clients, les leads qui leur sont livrés, ses commissions.
// Données par deux fonctions SQL (supabase/2026-11-13-apporteurs.sql) : apporteur_tableau (une ligne par bon de commande
// de ses clients) et apporteur_clients. Jamais le prix du lead, le montant de la commande ni les coordonnées des leads.
// Règle d'Ugo : une commission n'est « à payer » qu'une fois la commande terminée, réglée par le client et sans litige en cours.
// Même connexion que l'espace client (session partagée) ; un compte client part sur /espace.


const MENU = [
  { to: '/apporteur', end: true, t: 'Tableau de bord', ico: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></> },
  { to: '/apporteur/clients', t: 'Mes clients', ico: <><path d="M3 21V7l9-4 9 4v14" /><path d="M9 21v-6h6v6" /></> },
  { to: '/apporteur/commissions', t: 'Mes commissions', ico: <><rect x="4" y="2" width="16" height="20" rx="2" /><path d="M8 6h8M8 10h2M14 10h2M8 14h2M14 14h2M8 18h2M14 18h2" /></> },
  { to: '/apporteur/compte', t: 'Mon compte', ico: <><circle cx="12" cy="8" r="4" /><path d="M4 21v-1a8 8 0 0 1 16 0v1" /></> },
];

function Ico({ children, size = 19 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>;
}
function Head({ title, sub }) {
  return <header className="ec-head ec-head-row"><div><h1>{title}</h1>{sub && <p>{sub}</p>}</div></header>;
}
const moisDe = (d) => (d ? new Date(d).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) : '·');
const cleMois = (d) => (d ? String(d).slice(0, 7) : '');

// Aperçu de développement (/apporteur?apercu) : fausses lignes, rien n'est lu en base.
function apercuApporteur() {
  const j = (n) => new Date(Date.now() - n * 864e5).toISOString();
  return {
    fiche: { prenom: 'Jules', nom: 'Martin', societe: 'JM Conseil', email: 'jules@exemple.fr', telephone: '06 00 00 00 00', siret: null, statut: 'actif' },
    clients: [{ societe: 'ED Habitat', commission_ht: 3, apporteur_depuis: j(60).slice(0, 10) }, { societe: 'Exemple Chauffage', commission_ht: 4, apporteur_depuis: j(20).slice(0, 10) }],
    lignes: [
      { commande_id: '1', societe: 'ED Habitat', bdc_numero: 'BDC-2026-00012', thematique: 'ITE', approuve_le: j(2), leads: 18, taux: 3, montant: 54, statut: 'en_cours', raison: 'Livraison en cours', verse_le: null },
      { commande_id: '2', societe: 'Exemple Chauffage', bdc_numero: 'BDC-2026-00010', thematique: 'PAC', approuve_le: j(12), leads: 50, taux: 4, montant: 200, statut: 'en_cours', raison: 'En attente du règlement du client', verse_le: null },
      { commande_id: '3', societe: 'ED Habitat', bdc_numero: 'BDC-2026-00007', thematique: 'ITE', approuve_le: j(25), leads: 50, taux: 3, montant: 150, statut: 'a_payer', raison: null, verse_le: null },
      { commande_id: '4', societe: 'ED Habitat', bdc_numero: 'BDC-2026-00003', thematique: 'ITE', approuve_le: j(50), leads: 50, taux: 3, montant: 150, statut: 'versee', raison: null, verse_le: j(30) },
    ],
  };
}

function useApporteurData(session, apercu) {
  const [d, setD] = useState({ lignes: null, clients: null, error: '' });
  const load = useCallback(async () => {
    if (apercu) { setD({ lignes: apercu.lignes, clients: apercu.clients, error: '' }); return; }
    const [t, c] = await Promise.all([db.rpc('apporteur_tableau'), db.rpc('apporteur_clients')]);
    setD({ lignes: t.data || [], clients: c.data || [], error: t.error || c.error ? 'Une partie de vos données n’a pas pu être chargée.' : '' });
  }, [apercu]);
  useEffect(() => { load(); }, [load, session]);
  return d;
}

function totaux(lignes) {
  const t = { en_cours: 0, a_payer: 0, versee: 0, leads: 0 };
  for (const l of lignes || []) { t[l.statut] += Number(l.montant || 0); t.leads += l.leads || 0; }
  return t;
}

function Kpis({ lignes }) {
  const t = totaux(lignes);
  const mois = cleMois(new Date().toISOString());
  const leadsMois = (lignes || []).filter((l) => cleMois(l.approuve_le) === mois).reduce((s, l) => s + (l.leads || 0), 0);
  return (
    <div className="ec-kpis ec-kpis-4">
      <div className="ec-kpi"><b>À payer</b><span>Commandes réglées, sans litige en cours</span><strong>{euro(t.a_payer)}</strong></div>
      <div className="ec-kpi"><b>En cours</b><span>Livraison, règlement ou litige en cours</span><strong>{euro(t.en_cours)}</strong></div>
      <div className="ec-kpi"><b>Déjà versé</b><span>Depuis le début</span><strong>{euro(t.versee)}</strong></div>
      <div className="ec-kpi"><b>Leads livrés</b><span>{leadsMois} sur les commandes de ce mois</span><strong>{t.leads}</strong></div>
    </div>
  );
}

function TableLignes({ lignes }) {
  if (!lignes.length) return <div className="ec-card ec-empty"><p>Aucune commande pour l’instant. Dès qu’un de vos clients commande, elle apparaît ici.</p></div>;
  return (
    <div className="ec-card ec-table-wrap">
      <table className="ec-table">
        <thead><tr><th>Date</th><th>Client</th><th>Commande</th><th className="ec-num">Leads livrés</th><th className="ec-num">Commission par lead</th><th className="ec-num">Commission HT</th><th>Statut</th></tr></thead>
        <tbody>{lignes.map((l) => (
          <tr key={l.commande_id}>
            <td>{dateFr(l.approuve_le)}</td>
            <td><b>{l.societe}</b></td>
            <td>{THEMES[l.thematique] || l.thematique || '·'}<small className="ec-block">{l.bdc_numero}</small></td>
            <td className="ec-num">{l.leads}</td>
            <td className="ec-num">{euro(l.taux)}</td>
            <td className="ec-num"><b>{euro(l.montant)}</b></td>
            <td><span className={`ec-status ${CLASSE_COMMISSION[l.statut]}`}>{STATUTS_COMMISSION[l.statut]}{l.statut === 'versee' && l.verse_le ? ` le ${dateFr(l.verse_le)}` : ''}</span>{l.raison && <small className="ec-block">{l.raison}</small>}</td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}

const REGLE = 'Une commission devient « À payer » quand la commande de votre client est entièrement livrée, réglée, et qu’aucun litige n’y est en cours. Un lead annulé après un litige ne compte pas ; celui qui le remplace compte.';

function Home({ data, fiche }) {
  const { lignes } = data;
  return (
    <>
      <Head title={`Bonjour${fiche?.prenom ? ` ${fiche.prenom}` : ''}`} sub="Les leads commandés par vos clients et vos commissions, à jour en temps réel." />
      {lignes === null ? <div className="ec-loading" aria-busy="true" /> : (
        <>
          <Kpis lignes={lignes} />
          <h2 style={{ margin: '28px 0 12px', fontSize: 18, fontWeight: 600 }}>Dernières commandes</h2>
          <TableLignes lignes={lignes.slice(0, 8)} />
          <p className="ec-note">{REGLE}</p>
        </>
      )}
    </>
  );
}

function Clients({ data }) {
  const { lignes, clients } = data;
  const rows = useMemo(() => (clients || []).map((c) => {
    const ls = (lignes || []).filter((l) => l.societe === c.societe);
    const parMois = {};
    for (const l of ls) { const k = cleMois(l.approuve_le); parMois[k] = (parMois[k] || 0) + (l.leads || 0); }
    return { c, leads: ls.reduce((s, l) => s + (l.leads || 0), 0), total: ls.reduce((s, l) => s + Number(l.montant || 0), 0), parMois, derniere: ls[0]?.approuve_le };
  }), [clients, lignes]);
  const mois = useMemo(() => [...new Set(rows.flatMap((r) => Object.keys(r.parMois)))].sort().reverse().slice(0, 6), [rows]);
  return (
    <>
      <Head title="Mes clients" sub="Les entreprises que vous nous avez apportées et les leads qu’elles ont commandés." />
      {clients === null ? <div className="ec-loading" aria-busy="true" /> : !clients.length ? <div className="ec-card ec-empty"><p>Aucun client relié à votre compte pour l’instant.</p></div> : (
        <div className="ec-card ec-table-wrap">
          <table className="ec-table">
            <thead><tr><th>Client</th><th className="ec-num">Commission par lead</th><th>Depuis le</th>{mois.map((m) => <th key={m} className="ec-num">{moisDe(`${m}-01`)}</th>)}<th className="ec-num">Leads livrés</th><th className="ec-num">Commissions HT</th></tr></thead>
            <tbody>{rows.map(({ c, leads, total, parMois }) => (
              <tr key={c.societe}>
                <td><b>{c.societe}</b></td>
                <td className="ec-num">{c.commission_ht != null ? euro(c.commission_ht) : '·'}</td>
                <td>{dateFr(c.apporteur_depuis)}</td>
                {mois.map((m) => <td key={m} className="ec-num">{parMois[m] || '·'}</td>)}
                <td className="ec-num">{leads}</td>
                <td className="ec-num"><b>{euro(total)}</b></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
      <p className="ec-note">Les leads sont rangés au mois de la commande.</p>
    </>
  );
}

function Commissions({ data }) {
  const [f, setF] = useState('tout');
  const lignes = data.lignes || [];
  const vues = f === 'tout' ? lignes : lignes.filter((l) => l.statut === f);
  return (
    <>
      <Head title="Mes commissions" sub="Une ligne par commande de vos clients." />
      {data.lignes === null ? <div className="ec-loading" aria-busy="true" /> : (
        <>
          <Kpis lignes={lignes} />
          <div className="ec-tabs">{[['tout', 'Toutes'], ['a_payer', 'À payer'], ['en_cours', 'En cours'], ['versee', 'Versées']].map(([k, t]) => <button type="button" key={k} className={f === k ? 'is-on' : ''} onClick={() => setF(k)}>{t}</button>)}</div>
          <div style={{ marginTop: 14 }}><TableLignes lignes={vues} /></div>
          <p className="ec-note">{REGLE} Pour être payé, envoyez votre facture à <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> du montant « À payer ».</p>
        </>
      )}
    </>
  );
}

function Compte({ session, fiche }) {
  return (
    <>
      <Head title="Mon compte" />
      <div className="ec-card">
        <dl className="ec-dl">
          <div><dt>Nom</dt><dd>{[fiche?.prenom, fiche?.nom].filter(Boolean).join(' ') || '·'}</dd></div>
          <div><dt>Société</dt><dd>{fiche?.societe || '·'}</dd></div>
          <div><dt>E-mail de connexion</dt><dd>{session.user.email}</dd></div>
          <div><dt>Téléphone</dt><dd>{fiche?.telephone || '·'}</dd></div>
          <div><dt>SIRET</dt><dd>{fiche?.siret || '·'}</dd></div>
        </dl>
        <p className="ec-small">Une information à changer ? Écrivez à <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>
      </div>
    </>
  );
}

function Shell({ session, fiche, apercu }) {
  const [open, setOpen] = useState(false);
  const data = useApporteurData(session, apercu);
  const nom = [fiche?.prenom, fiche?.nom].filter(Boolean).join(' ') || session.user.email;
  const initials = nom.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div className={`ec${open ? ' is-open' : ''}`}>
      <header className="ec-top">
        <Link to="/" className="brand"><KairnLogo /><span className="brand-word">Kairn</span></Link>
        <span className="ec-company">Espace apporteur · {nom}</span>
        <Link to="/apporteur/compte" className="ec-avatar" aria-label="Mon compte">{initials}</Link>
        <button type="button" className="ec-burger" aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'} aria-expanded={open} onClick={() => setOpen((o) => !o)}><span /><span /></button>
      </header>
      <aside className="ec-side">
        <p className="ec-side-label">Navigation</p>
        <nav aria-label="Espace apporteur">
          {MENU.map((m) => (
            <NavLink key={m.to} to={m.to} end={m.end} className={({ isActive }) => `ec-link${isActive ? ' is-active' : ''}`} onClick={() => setOpen(false)}>
              <Ico>{m.ico}</Ico><span>{m.t}</span>
            </NavLink>
          ))}
        </nav>
        <div className="ec-side-foot">
          <a href={`mailto:${CONTACT_EMAIL}`} className="ec-help">Une question ? <b>{CONTACT_EMAIL}</b></a>
          <button type="button" className="ec-logout" onClick={() => db.auth.signOut()}>Se déconnecter</button>
        </div>
      </aside>
      <main className="ec-main">
        {apercu && <div className="ec-demo"><span><b>Aperçu</b> Données fictives : rien n’est lu en base.</span></div>}
        {data.error && <p className="ec-err">{data.error}</p>}
        <Routes>
          <Route index element={<Home data={data} fiche={fiche} />} />
          <Route path="clients" element={<Clients data={data} />} />
          <Route path="commissions" element={<Commissions data={data} />} />
          <Route path="compte" element={<Compte session={session} fiche={fiche} />} />
          <Route path="*" element={<Home data={data} fiche={fiche} />} />
        </Routes>
      </main>
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [oubli, setOubli] = useState('');
  async function submit(e) {
    e.preventDefault();
    setBusy(true); setError('');
    const { error: err } = await db.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (err) setError(err.message === 'Invalid login credentials' ? 'E-mail ou mot de passe incorrect.' : 'Connexion impossible pour le moment. Réessayez dans un instant.');
  }
  async function oublie() {
    setError(''); setOubli('');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) { setError('Indiquez d’abord votre adresse e-mail ci-dessus.'); return; }
    const r = await fetch('/api/mot-de-passe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email.trim() }) }).catch(() => null);
    if (!r || !r.ok) { setError(`Envoi impossible pour le moment. Écrivez à ${CONTACT_EMAIL}.`); return; }
    setOubli('Si cette adresse a un espace Kairn, un lien pour choisir un nouveau mot de passe vient de lui être envoyé.');
  }
  return (
    <div className="ec-login">
      <div className="aurora-grid" aria-hidden="true" />
      <div className="hero-halo" aria-hidden="true" />
      <form className="ec-login-card" onSubmit={submit}>
        <Link to="/" className="brand"><KairnLogo /><span className="brand-word">Kairn</span></Link>
        <h1>Espace apporteur</h1>
        <p>Vos clients, leurs commandes et vos commissions.</p>
        <label><span>E-mail</span><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" /></label>
        <label><span>Mot de passe</span><input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" /></label>
        {error && <p className="ec-err" role="alert">{error}</p>}
        <button type="submit" className="ec-btn" disabled={busy}>{busy ? 'Connexion…' : 'Se connecter'}</button>
        <p className="ec-small"><button type="button" className="ec-link-btn" onClick={oublie}>Mot de passe oublié ?</button></p>
        {oubli && <p className="ec-ok">{oubli}</p>}
        <p className="ec-small">Pas encore apporteur ? <Link to="/devenir-apporteur">Candidater</Link></p>
      </form>
    </div>
  );
}

export default function Apporteur() {
  useV2Favicon();
  const [session, setSession] = useState(undefined);
  const [fiche, setFiche] = useState(undefined);
  const [client, setClient] = useState(false);
  useEffect(() => {
    db.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = db.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);
  useEffect(() => {
    if (!session) { setFiche(undefined); return; }
    Promise.all([
      db.from('apporteurs').select('prenom, nom, societe, email, telephone, siret, statut').eq('user_id', session.user.id).maybeSingle(),
      db.from('clients').select('user_id').eq('user_id', session.user.id).maybeSingle(),
    ]).then(([a, c]) => { setClient(Boolean(c.data)); setFiche(a.data || null); });
  }, [session]);
  const apercu = useMemo(() => (import.meta.env.DEV && new URLSearchParams(window.location.search).has('apercu') ? apercuApporteur() : null), []);

  let body;
  if (apercu) body = <Shell session={{ user: { id: 'apercu', email: apercu.fiche.email } }} fiche={apercu.fiche} apercu={apercu} />;
  else if (session === undefined || (session && fiche === undefined)) body = <div className="ec-loading" aria-busy="true" />;
  else if (!session) body = <Login />;
  else if (!fiche && client) body = <Navigate to="/espace" replace />;
  else if (!fiche || fiche.statut === 'candidature' || fiche.statut === 'refuse') {
    body = (
      <div className="ec-login"><div className="ec-login-card">
        <Link to="/" className="brand"><KairnLogo /><span className="brand-word">Kairn</span></Link>
        <h1>Accès en préparation</h1>
        <p>Votre compte existe, mais votre espace apporteur n’est pas encore ouvert. Nous l’activons après notre premier échange.</p>
        <button type="button" className="ec-btn" onClick={() => db.auth.signOut()}>Se déconnecter</button>
      </div></div>
    );
  } else body = <Shell session={session} fiche={fiche} />;
  return <div className="v2 v3 ec-root">{body}</div>;
}
