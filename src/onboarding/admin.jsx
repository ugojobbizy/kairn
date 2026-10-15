import React, { useEffect, useState } from 'react';
import { KairnLogo, useV2Favicon } from '../v2/layout.jsx';
import { db, BUCKET } from './store.js';
import { sectionsFor, isFilled, SECTORS } from './schema.js';
import './onboarding.css';

// Espace Kairn (/onboarding/admin) : créer le lien d'un client, suivre l'avancement, lire les réponses,
// télécharger les fichiers, copier le tout en texte. Accès : compte Supabase dont l'e-mail est dans la table admins.

const linkFor = (token) => `${window.location.origin}/onboarding/${token}`;
const date = (s) => (s ? new Date(s).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '');

function show(v, answers, f) {
  if (!isFilled(v)) return '';
  if (f.type === 'list') return v.filter((r) => isFilled(r)).map((r) => f.fields.map((s) => r[s.id]).filter(Boolean).join(' · ')).join('\n');
  if (Array.isArray(v)) {
    const other = answers[`${f.id}_autre`];
    return v.map((x) => (x === 'Autre' && other ? `Autre : ${other}` : x)).join(', ');
  }
  if (v === 'Autre' && answers[`${f.id}_autre`]) return `Autre : ${answers[`${f.id}_autre`]}`;
  return String(v);
}

function toMarkdown(o) {
  const lines = [`# Onboarding ${o.client_name} (${SECTORS[o.sector] || o.sector})`, `Statut : ${o.status === 'submitted' ? 'envoyé' : 'brouillon'} · mis à jour le ${date(o.updated_at)}`, ''];
  for (const s of sectionsFor(o.sector)) {
    lines.push(`## ${s.title}`);
    for (const f of s.fields) {
      const val = f.type === 'files'
        ? o.files.filter((x) => x.field === f.id).map((x) => x.name).join(', ')
        : show(o.data[f.id], o.data, f);
      lines.push(`- **${f.label}** : ${val || '(vide)'}`);
    }
    lines.push('');
  }
  return lines.join('\n');
}

export default function OnboardingAdmin() {
  useV2Favicon();
  const [session, setSession] = useState(undefined);
  useEffect(() => {
    db.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = db.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  if (session === undefined) return <div className="ob ob-center"><p>Chargement…</p></div>;
  return (
    <div className="ob">
      <header className="ob-top">
        <div className="ob-brand"><KairnLogo size={30} /><span>Kairn · Onboarding clients</span></div>
        {session && <button type="button" className="ob-save" onClick={() => db.auth.signOut()}>Se déconnecter</button>}
      </header>
      {session ? <Dashboard email={session.user.email} /> : <Login />}
    </div>
  );
}

function Login() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [msg, setMsg] = useState('');
  const submit = async (e) => {
    e.preventDefault();
    setMsg('');
    const fn = mode === 'login' ? db.auth.signInWithPassword : db.auth.signUp;
    const { data, error } = await fn.call(db.auth, { email, password: pass });
    if (error) return setMsg(error.message);
    if (mode === 'signup' && !data.session) setMsg('Compte créé. Confirmez votre e-mail, puis connectez-vous.');
  };
  return (
    <div className="oba">
      <form className="ob-card ob-msg" onSubmit={submit}>
        <h1>{mode === 'login' ? 'Connexion' : 'Créer le compte admin'}</h1>
        <label className="ob-field"><span className="ob-label">E-mail</span><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" /></label>
        <label className="ob-field"><span className="ob-label">Mot de passe</span><input type="password" value={pass} onChange={(e) => setPass(e.target.value)} required minLength={8} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} /></label>
        <button className="ob-btn" type="submit">{mode === 'login' ? 'Se connecter' : 'Créer le compte'}</button>
        <button type="button" className="oba-small" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>{mode === 'login' ? 'Première fois ? Créer le compte' : 'J’ai déjà un compte'}</button>
        {msg && <p className="ob-err">{msg}</p>}
      </form>
    </div>
  );
}

function Dashboard({ email }) {
  const [rows, setRows] = useState(null);
  const [err, setErr] = useState('');
  const [name, setName] = useState('');
  const [sector, setSector] = useState('assurance');
  const [open, setOpen] = useState(null);
  const [copied, setCopied] = useState('');

  const refresh = async () => {
    const { data, error } = await db.from('onboardings').select('*').order('created_at', { ascending: false });
    if (error) return setErr(error.message);
    setRows(data);
  };
  useEffect(() => { refresh(); }, []);

  const create = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const { error } = await db.from('onboardings').insert({ client_name: name.trim(), sector });
    if (error) return setErr(error.message);
    setName('');
    refresh();
  };

  const copy = async (text, key) => {
    try { await navigator.clipboard.writeText(text); setCopied(key); setTimeout(() => setCopied(''), 1800); } catch { setErr('Copie impossible : sélectionnez le texte à la main.'); }
  };

  if (rows === null && !err) return <div className="oba"><p>Chargement…</p></div>;
  const current = rows?.find((r) => r.id === open);

  return (
    <div className="oba">
      <div className="oba-head">
        <h1 className="ob-title">Clients</h1>
        <form className="oba-new" onSubmit={create}>
          <label>Nom du client<input value={name} onChange={(e) => setName(e.target.value)} placeholder="Cabinet Martin" /></label>
          <label>Type de site<select value={sector} onChange={(e) => setSector(e.target.value)}>{Object.entries(SECTORS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
          <button className="ob-btn" type="submit">Créer le lien</button>
        </form>
      </div>
      {err && <p className="ob-err">{err} {err.includes('row-level security') && `(le compte ${email} n’est pas encore admin)`}</p>}
      {rows && rows.length === 0 && <p className="ob-hint">Aucun client pour l’instant. Si vous venez de créer votre compte, il doit d’abord être déclaré admin ({email}).</p>}
      {rows && rows.length > 0 && (
        <table className="oba-table">
          <thead><tr><th>Client</th><th>Avancement</th><th>Statut</th><th>Lien à envoyer</th><th /></tr></thead>
          <tbody>
            {rows.map((r) => {
              const fields = sectionsFor(r.sector).flatMap((s) => s.fields);
              const done = fields.filter((f) => (f.type === 'files' ? r.files.some((x) => x.field === f.id) : isFilled(r.data[f.id]))).length;
              return (
                <tr key={r.id} className={open === r.id ? 'is-on' : ''}>
                  <td><b>{r.client_name}</b><br /><small className="ob-hint">{SECTORS[r.sector]} · créé le {date(r.created_at)}</small></td>
                  <td>{Math.round((done / fields.length) * 100)} %<br /><small className="ob-hint">modifié le {date(r.updated_at)}</small></td>
                  <td><span className={`oba-pill${r.status === 'submitted' ? ' is-done' : ''}`}>{r.status === 'submitted' ? `Envoyé le ${date(r.submitted_at)}` : 'En cours'}</span></td>
                  <td><div className="oba-link"><code>{linkFor(r.token)}</code><button type="button" className="oba-small" onClick={() => copy(linkFor(r.token), r.id)}>{copied === r.id ? 'Copié' : 'Copier'}</button></div></td>
                  <td><button type="button" className="oba-small" onClick={() => setOpen(open === r.id ? null : r.id)}>{open === r.id ? 'Fermer' : 'Voir'}</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {current && <Detail o={current} onCopy={() => copy(toMarkdown(current), 'md')} copied={copied === 'md'} onRefresh={refresh} />}
    </div>
  );
}

function Detail({ o, onCopy, copied, onRefresh }) {
  const open = async (path) => {
    const { data, error } = await db.storage.from(BUCKET).createSignedUrl(path, 300, { download: true });
    if (error) return alert(error.message);
    window.open(data.signedUrl, '_blank', 'noopener');
  };
  return (
    <section className="ob-card oba-detail">
      <div className="oba-head">
        <h2>{o.client_name}</h2>
        <div className="ob-actions" style={{ marginTop: 0 }}>
          <button type="button" className="ob-btn is-ghost" onClick={onRefresh}>Actualiser</button>
          <button type="button" className="ob-btn" onClick={onCopy}>{copied ? 'Copié' : 'Copier tout en texte'}</button>
        </div>
      </div>
      {sectionsFor(o.sector).map((s) => (
        <div key={s.id}>
          <h3>{s.title}</h3>
          <dl>
            {s.fields.map((f) => {
              if (f.type === 'files') {
                const list = o.files.filter((x) => x.field === f.id);
                return (
                  <React.Fragment key={f.id}>
                    <dt>{f.label}</dt>
                    <dd>{list.length ? list.map((x) => <div key={x.path}><button type="button" className="oba-small" onClick={() => open(x.path)}>{x.name}</button></div>) : <span className="is-empty">(aucun fichier)</span>}</dd>
                  </React.Fragment>
                );
              }
              const val = show(o.data[f.id], o.data, f);
              return (
                <React.Fragment key={f.id}>
                  <dt>{f.label}</dt>
                  <dd className={val ? '' : 'is-empty'}>{val || '(vide)'}</dd>
                </React.Fragment>
              );
            })}
          </dl>
        </div>
      ))}
    </section>
  );
}
