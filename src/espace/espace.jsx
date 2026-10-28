import React, { useEffect, useState } from 'react';
import { Link, NavLink, Route, Routes, useNavigate, useSearchParams } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { KairnLogo, useV2Favicon } from '../v2/layout.jsx';
import { OrderForm } from '../v3/order.jsx';
import { PRODUITS, GARANTIES, CONTENU_CONTACT, prixHT } from '../v3/produits.js';
import { CONTACT_EMAIL, WHATSAPP_NUMBER, whatsappUrl } from '../config.js';
import '../v2/v2.css';
import '../v3/v3.css';
import './espace.css';

// Espace client Kairn (lot 1, 28/10/2026) : connexion, menu à gauche, catalogue PAC / ITE / PPV avec prix, commande,
// suivi des commandes. Les comptes sont créés par Ugo (Supabase Auth, projet « kairn »), puis une ligne dans la table clients.
// Mes leads et Factures arrivent dans un lot suivant.

const URL = 'https://bmqvlwdbwfnafuovzzhi.supabase.co';
const KEY = 'sb_publishable_xyIez0a8masZaN3RM_GQIw_e4KyILCV';
const db = createClient(URL, KEY, { auth: { storageKey: 'kairn-espace-auth' } });

const MENU = [
  { to: '/espace', end: true, t: 'Accueil', ico: <path d="M3 10.5 12 3l9 7.5V21H3z" /> },
  { to: '/espace/commander', t: 'Commander', ico: <><path d="M6 6h15l-2 9H7z" /><circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M6 6 5 2H2" /></> },
  { to: '/espace/commandes', t: 'Mes commandes', ico: <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" /></> },
  { to: '/espace/leads', t: 'Mes leads', soon: true, ico: <><circle cx="9" cy="8" r="4" /><path d="M2 21v-1a6 6 0 0 1 12 0v1M17 11h5M19.5 8.5v5" /></> },
  { to: '/espace/factures', t: 'Factures', soon: true, ico: <><path d="M6 2h9l5 5v15H6z" /><path d="M14 2v6h6M9 13h6M9 17h6" /></> },
  { to: '/espace/compte', t: 'Mon compte', ico: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></> },
];

function Ico({ children }) {
  return <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>;
}

const STATUTS = { nouvelle: 'Reçue', en_cours: 'En cours', ouverte: 'Flux ouvert', refusee: 'Refusée' };
const dateFr = (d) => new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });

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
        <p>Vos commandes, vos contacts et vos factures, au même endroit.</p>
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

// ─ pages ─
function Home({ client }) {
  return (
    <>
      <header className="ec-head">
        <p className="eyebrow">Kairn Leads</p>
        <h1>Bonjour{client?.prenom ? ` ${client.prenom}` : ''}.</h1>
        <p>Nos thématiques ouvertes. Choisissez un produit pour passer commande : Ugo valide votre zone et ouvre le flux.</p>
      </header>
      <div className="ec-products">
        {PRODUITS.map((p) => (
          <article className="ec-product" key={p.code}>
            <div className="ec-product-top">
              <span className="ec-code">{p.code}</span>
              <span className="ec-price"><b>{p.prix} €</b> HT / contact</span>
            </div>
            <h2>{p.nom}</h2>
            <p>{p.accroche}</p>
            <p className="ec-sub">Chaque contact contient</p>
            <ul>{CONTENU_CONTACT.map((x) => <li key={x}>{x}</li>)}</ul>
            <Link to={`/espace/commander?thematique=${p.code}`} className="ec-btn">Commander</Link>
          </article>
        ))}
      </div>
      <section className="ec-panel">
        <h2>Pour tous les produits</h2>
        <ul className="ec-checks">{GARANTIES.map((g) => <li key={g}>{g}</li>)}</ul>
      </section>
    </>
  );
}

function Order({ session, client }) {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const t = params.get('thematique');
  const initial = {
    societe: client?.societe || '',
    nom: client?.prenom || '',
    email: session.user.email,
    telephone: client?.telephone || '',
    siret: client?.siret || '',
    ...(PRODUITS.some((p) => p.code === t) ? { thematique: t } : {}),
  };
  async function send(f) {
    const { error } = await db.from('commandes').insert({
      user_id: session.user.id,
      souhait: f.souhait,
      societe: f.societe || null,
      nom: f.nom || null,
      email: f.email || null,
      telephone: f.telephone || null,
      thematique: f.thematique || null,
      volume: f.volume || null,
      zone: f.zone || null,
      siret: f.siret || null,
      page: '/espace/commander',
    });
    if (error) throw new Error('La commande n’a pas pu être enregistrée. Réessayez ou écrivez-nous.');
  }
  return (
    <>
      <header className="ec-head">
        <p className="eyebrow">Commander</p>
        <h1>Nouvelle commande</h1>
        <p>Ugo reçoit votre commande, valide la zone et le volume avec vous, puis ouvre le flux.</p>
      </header>
      <div className="ec-card ec-order">
        <OrderForm key={t || 'x'} initial={initial} send={send} compact onDone={() => setTimeout(() => navigate('/espace/commandes'), 1800)} />
      </div>
    </>
  );
}

function Orders({ session }) {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    db.from('commandes').select('id, created_at, souhait, thematique, volume, zone, statut').eq('user_id', session.user.id).order('created_at', { ascending: false })
      .then(({ data, error: err }) => { if (err) setError('Impossible de charger vos commandes.'); else setRows(data); });
  }, [session.user.id]);
  return (
    <>
      <header className="ec-head">
        <p className="eyebrow">Suivi</p>
        <h1>Mes commandes</h1>
      </header>
      {error && <p className="ec-err">{error}</p>}
      {rows && rows.length === 0 && (
        <div className="ec-card ec-empty"><p>Aucune commande pour l’instant.</p><Link to="/espace/commander" className="ec-btn">Passer une commande</Link></div>
      )}
      {rows && rows.length > 0 && (
        <div className="ec-card ec-table-wrap">
          <table className="ec-table">
            <thead><tr><th>Date</th><th>Demande</th><th>Thématique</th><th>Volume / sem.</th><th>Zone</th><th>Statut</th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>{dateFr(r.created_at)}</td>
                  <td>{r.souhait === 'leads' ? 'Leads' : 'Accompagnement'}</td>
                  <td>{r.thematique || '·'}</td>
                  <td>{r.volume || '·'}</td>
                  <td>{r.zone || '·'}</td>
                  <td><span className={`ec-status is-${r.statut}`}>{STATUTS[r.statut] || r.statut}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

function Soon({ title, text }) {
  return (
    <>
      <header className="ec-head"><p className="eyebrow">Bientôt</p><h1>{title}</h1></header>
      <div className="ec-card ec-empty"><p>{text}</p></div>
    </>
  );
}

function Account({ session, client }) {
  return (
    <>
      <header className="ec-head"><p className="eyebrow">Compte</p><h1>Mon compte</h1></header>
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

// ─ cadre : menu à gauche ─
function Shell({ session, client }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`ec${open ? ' is-open' : ''}`}>
      <aside className="ec-side">
        <Link to="/" className="brand"><KairnLogo />Kairn</Link>
        <p className="ec-company">{client?.societe || session.user.email}</p>
        <nav aria-label="Espace client">
          {MENU.map((m) => (
            <NavLink key={m.to} to={m.to} end={m.end} className={({ isActive }) => `ec-link${isActive ? ' is-active' : ''}`} onClick={() => setOpen(false)}>
              <Ico>{m.ico}</Ico><span>{m.t}</span>{m.soon && <em>Bientôt</em>}
            </NavLink>
          ))}
        </nav>
        <div className="ec-side-foot">
          {WHATSAPP_NUMBER && <a href={whatsappUrl('Bonjour Ugo, une question depuis mon espace client.')} target="_blank" rel="noopener noreferrer" className="ec-help">Une question ? <b>Écrire à Ugo</b></a>}
          <button type="button" className="ec-logout" onClick={() => db.auth.signOut()}>Se déconnecter</button>
        </div>
      </aside>
      <button type="button" className="ec-burger" aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'} aria-expanded={open} onClick={() => setOpen((o) => !o)}><span /><span /></button>
      <main className="ec-main">
        <Routes>
          <Route index element={<Home client={client} />} />
          <Route path="commander" element={<Order session={session} client={client} />} />
          <Route path="commandes" element={<Orders session={session} />} />
          <Route path="leads" element={<Soon title="Mes leads" text="Ici, chaque contact livré avec sa date, sa zone et la pub d’où il vient. En attendant, vos contacts vous sont envoyés directement." />} />
          <Route path="factures" element={<Soon title="Factures" text="Vos factures seront téléchargeables ici. En attendant, Ugo vous les envoie par e-mail." />} />
          <Route path="compte" element={<Account session={session} client={client} />} />
          <Route path="*" element={<Home client={client} />} />
        </Routes>
      </main>
    </div>
  );
}

export default function ClientSpace() {
  useV2Favicon();
  const [session, setSession] = useState(undefined);
  const [client, setClient] = useState(undefined);
  useEffect(() => {
    db.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = db.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);
  useEffect(() => {
    if (!session) { setClient(undefined); return; }
    db.from('clients').select('societe, prenom, telephone, siret').eq('user_id', session.user.id).maybeSingle()
      .then(({ data }) => setClient(data || null));
  }, [session]);

  // Aperçu du cadre en développement seulement (/espace?apercu) : faux client, aucune donnée lue ni écrite.
  if (import.meta.env.DEV && new URLSearchParams(window.location.search).has('apercu')) {
    return <div className="v2 v3 ec-root"><Shell session={{ user: { id: 'apercu', email: 'client@exemple.fr' } }} client={{ societe: 'Exemple Chauffage', prenom: 'Julien' }} /></div>;
  }

  let body;
  if (session === undefined || (session && client === undefined)) body = <div className="ec-loading" aria-busy="true" />;
  else if (!session) body = <Login />;
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
