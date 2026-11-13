import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { db, THEMES, euro, dateFr, dateHeure, errMsg, appareilHeaders } from '../espace/db.js';
import { STATUTS_COMMISSION, CLASSE_COMMISSION } from '../apporteur/statuts.js';
import { libelleForme, ibanLisible, manquesKairn, siretValide } from '../apporteur/contrat.js';

// Apporteurs d'affaires dans Kairn Admin (Ugo, 13/11/2026). Candidatures (/devenir-apporteur) à valider : Valider crée le
// compte et envoie l'e-mail d'accès (api/apporteur.js, action ouvrir). Fiche apporteur : clients tagués et lignes de commission,
// une par bon de commande (fonction admin_commissions). « Marquer versée » fige montant, leads et taux
// (admin_verser_commission), seulement sur une ligne « À payer » : commande terminée, réglée, sans litige en attente.
// Le tag d'un client (apporteur, commission par lead, date de début) se pose sur la fiche client (TagApporteur ci-dessous).

const STATUTS = { candidature: 'Candidature', actif: 'Actif', refuse: 'Refusé', suspendu: 'Suspendu' };
const CLASSE = { candidature: 'is-en_attente', actif: 'is-ouverte', refuse: 'is-refusee', suspendu: 'is-terminee' };

function Head({ title, sub, children }) {
  return <header className="ec-head ec-head-row"><div><h1>{title}</h1>{sub && <p>{sub}</p>}</div>{children}</header>;
}

export function useApporteurs(apercu) {
  const [d, setD] = useState({ apporteurs: null, lignes: null, error: '' });
  const load = useCallback(async () => {
    if (apercu) { setD({ apporteurs: [], lignes: [], error: '' }); return; }
    const [a, l] = await Promise.all([
      db.from('apporteurs').select('*').order('created_at', { ascending: false }),
      db.rpc('admin_commissions'),
    ]);
    setD({ apporteurs: a.data || [], lignes: l.data || [], error: a.error || l.error ? 'Apporteurs illisibles (migration du 13/11 non appliquée ?).' : '' });
  }, [apercu]);
  useEffect(() => { load(); }, [load]);
  return { ...d, reload: load };
}

function totaux(lignes) {
  const t = { en_cours: 0, a_payer: 0, versee: 0, leads: 0 };
  for (const l of lignes) { t[l.statut] += Number(l.montant || 0); t.leads += l.leads || 0; }
  return t;
}

async function ouvrir(payload) {
  const { data: sd } = await db.auth.getSession();
  const r = await fetch('/api/apporteur', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${sd.session?.access_token}`, ...appareilHeaders() }, body: JSON.stringify({ ...payload, action: 'ouvrir' }) })
    .then(async (x) => ({ status: x.status, body: await x.json().catch(() => ({})) })).catch(() => null);
  if (!r || r.status !== 200) {
    const code = r?.body?.error;
    return { err: code === 'service_non_configure' ? 'La clé de service Supabase n’est pas posée dans Vercel (SUPABASE_SERVICE_ROLE_KEY).'
      : code === 'bad_params' ? 'E-mail valide et nom obligatoires.'
        : code === 'deja_client' ? 'Cette adresse est déjà celle d’un compte client : l’apporteur doit utiliser une autre adresse.'
          : code === 'forbidden' ? 'Accès réservé à l’administration Kairn.'
            : 'L’opération n’a pas abouti. Réessayez dans un instant.' };
  }
  return r.body;
}

function Lien({ lien }) {
  const [copie, setCopie] = useState(false);
  if (!lien) return null;
  return (
    <div className="ec-field ec-lien">
      <span>Lien d’accès de l’apporteur (à usage unique)</span>
      <div><input readOnly value={lien} onFocus={(e) => e.target.select()} /><button type="button" className="ec-btn-ghost" onClick={() => navigator.clipboard.writeText(lien).then(() => setCopie(true))}>{copie ? 'Copié' : 'Copier'}</button></div>
    </div>
  );
}

function NouvelApporteur({ reload }) {
  const vide = { email: '', prenom: '', nom: '', societe: '', telephone: '', siret: '' };
  const [f, setF] = useState(vide);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [lien, setLien] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));
  async function submit(e) {
    e.preventDefault();
    setMsg(''); setErr(''); setLien('');
    setBusy(true);
    const r = await ouvrir(f);
    setBusy(false);
    if (r.err) { setErr(r.err); return; }
    setMsg(`Espace apporteur ouvert pour ${f.prenom || f.nom}. ${r.email_envoye ? `Invitation envoyée à ${f.email}.` : 'L’e-mail n’est pas parti : envoyez-lui le lien ci-dessous.'}`);
    setLien(r.lien); setF(vide); reload();
  }
  return (
    <form className="ec-card ec-form ec-form-grid" onSubmit={submit}>
      <label className="ec-field"><span>E-mail</span><input type="email" required value={f.email} onChange={set('email')} /></label>
      <label className="ec-field"><span>Prénom</span><input value={f.prenom} onChange={set('prenom')} /></label>
      <label className="ec-field"><span>Nom</span><input required value={f.nom} onChange={set('nom')} /></label>
      <label className="ec-field"><span>Société</span><input value={f.societe} onChange={set('societe')} /></label>
      <label className="ec-field"><span>Téléphone</span><input value={f.telephone} onChange={set('telephone')} /></label>
      <label className="ec-field"><span>SIRET</span><input value={f.siret} onChange={set('siret')} /></label>
      <div className="ec-field"><button type="submit" className="ec-btn" disabled={busy}>{busy ? 'Création…' : 'Créer l’apporteur'}</button></div>
      {err && <p className="ec-err">{err}</p>}{msg && <p className="ec-ok">{msg}</p>}
      <Lien lien={lien} />
    </form>
  );
}

// ─ Liste ─
export function Apporteurs({ data, apercu }) {
  const a = useApporteurs(apercu);
  const navigate = useNavigate();
  const [ouvert, setOuvert] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [lien, setLien] = useState('');
  const [busy, setBusy] = useState('');
  const candidatures = (a.apporteurs || []).filter((x) => x.statut === 'candidature');
  const autres = (a.apporteurs || []).filter((x) => x.statut !== 'candidature');
  const nClients = (id) => (data.clients || []).filter((c) => c.apporteur_id === id).length;
  const tot = totaux(a.lignes || []);

  async function valider(x) {
    setMsg(''); setErr(''); setLien('');
    if (apercu || !window.confirm(`Valider ${x.prenom || ''} ${x.nom} ? Son compte est créé et il reçoit un e-mail d’accès à ${x.email}.`)) return;
    setBusy(x.id);
    const r = await ouvrir({ id: x.id });
    setBusy('');
    if (r.err) { setErr(r.err); return; }
    setMsg(`${x.prenom || x.nom} est apporteur. ${r.email_envoye ? `E-mail d’accès envoyé à ${x.email}.` : 'L’e-mail n’est pas parti : envoyez-lui le lien ci-dessous.'}`);
    setLien(r.lien); a.reload();
  }
  async function refuser(x) {
    setMsg(''); setErr('');
    if (apercu || !window.confirm(`Refuser la candidature de ${x.prenom || ''} ${x.nom} ? Aucun e-mail n’est envoyé.`)) return;
    const { error } = await db.from('apporteurs').update({ statut: 'refuse' }).eq('id', x.id);
    if (error) setErr(errMsg(error)); else { setMsg('Candidature refusée.'); a.reload(); }
  }

  return (
    <>
      <Head title="Apporteurs" sub="Vos apporteurs d’affaires, leurs clients et leurs commissions.">
        <button type="button" className="ec-btn" onClick={() => setOuvert((o) => !o)}>{ouvert ? 'Fermer' : 'Nouvel apporteur'}</button>
      </Head>
      {a.error && <p className="ec-err">{a.error}</p>}
      {err && <p className="ec-err">{err}</p>}{msg && <p className="ec-ok">{msg}</p>}
      {lien && <div className="ec-card"><Lien lien={lien} /></div>}
      {ouvert && <><p className="ec-note">Sans candidature : le compte est créé tout de suite et l’apporteur reçoit son e-mail d’accès.</p><NouvelApporteur reload={a.reload} /></>}
      <div className="ec-kpis ec-kpis-4">
        <div className={`ec-kpi${tot.a_payer > 0 ? ' is-alert' : ''}`}><b>À payer</b><span>Commandes réglées, sans litige en cours</span><strong>{euro(tot.a_payer)}</strong></div>
        <div className="ec-kpi"><b>En cours</b><span>Pas encore payable</span><strong>{euro(tot.en_cours)}</strong></div>
        <div className="ec-kpi"><b>Versé</b><span>Depuis le début</span><strong>{euro(tot.versee)}</strong></div>
        <div className="ec-kpi"><b>Candidatures</b><span>À valider ou refuser</span><strong>{candidatures.length}</strong></div>
      </div>

      {candidatures.length > 0 && (
        <>
          <h2 style={{ margin: '26px 0 12px', fontSize: 18, fontWeight: 600 }}>Candidatures</h2>
          <div className="ec-card ec-table-wrap">
            <table className="ec-table">
              <thead><tr><th>Reçue le</th><th>Nom</th><th>Contact</th><th>Réseau</th><th /></tr></thead>
              <tbody>{candidatures.map((x) => (
                <tr key={x.id}>
                  <td>{dateHeure(x.created_at)}</td>
                  <td><b>{[x.prenom, x.nom].filter(Boolean).join(' ')}</b>{x.societe && <small className="ec-block">{x.societe}{x.siret ? ` · ${x.siret}` : ''}</small>}</td>
                  <td>{x.telephone ? <a href={`tel:${x.telephone}`}>{x.telephone}</a> : '·'}<small className="ec-block">{x.email}</small></td>
                  <td className="ec-wrap">{x.message || '·'}</td>
                  <td style={{ whiteSpace: 'nowrap' }}><button type="button" className="ec-btn" disabled={busy === x.id} onClick={() => valider(x)}>{busy === x.id ? 'Ouverture…' : 'Valider'}</button> <button type="button" className="ec-btn-ghost" onClick={() => refuser(x)}>Refuser</button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </>
      )}

      <h2 style={{ margin: '26px 0 12px', fontSize: 18, fontWeight: 600 }}>Apporteurs</h2>
      {a.apporteurs === null ? <div className="ec-loading" aria-busy="true" /> : !autres.length ? <div className="ec-card ec-empty"><p>Aucun apporteur pour l’instant. Page de candidature : <a href="/devenir-apporteur" target="_blank" rel="noopener noreferrer">/devenir-apporteur</a>.</p></div> : (
        <div className="ec-card ec-table-wrap">
          <table className="ec-table ec-table-click">
            <thead><tr><th>Apporteur</th><th>Statut</th><th className="ec-num">Clients</th><th className="ec-num">Leads comptés</th><th className="ec-num">À payer</th><th className="ec-num">En cours</th><th className="ec-num">Versé</th></tr></thead>
            <tbody>{autres.map((x) => {
              const t = totaux((a.lignes || []).filter((l) => l.apporteur_id === x.id));
              return (
                <tr key={x.id} onClick={() => navigate(`/gestion/apporteurs/${x.id}`)}>
                  <td><b>{[x.prenom, x.nom].filter(Boolean).join(' ')}</b><small className="ec-block">{x.societe || x.email}</small></td>
                  <td><span className={`ec-status ${CLASSE[x.statut]}`}>{STATUTS[x.statut]}</span></td>
                  <td className="ec-num">{nClients(x.id)}</td>
                  <td className="ec-num">{t.leads}</td>
                  <td className="ec-num">{t.a_payer > 0 ? <span className="ec-status is-ouverte">{euro(t.a_payer)}</span> : '·'}</td>
                  <td className="ec-num">{t.en_cours ? euro(t.en_cours) : '·'}</td>
                  <td className="ec-num">{t.versee ? euro(t.versee) : '·'}</td>
                </tr>
              );
            })}</tbody>
          </table>
        </div>
      )}
      <p className="ec-note">Pour relier un client à un apporteur : fiche du client, bloc « Apporteur d’affaires ».</p>
    </>
  );
}

// ─ Fiche ─
export function FicheApporteur({ data, apercu }) {
  const { id } = useParams();
  const a = useApporteurs(apercu);
  const x = (a.apporteurs || []).find((y) => y.id === id);
  const lignes = useMemo(() => (a.lignes || []).filter((l) => l.apporteur_id === id), [a.lignes, id]);
  const clients = (data.clients || []).filter((c) => c.apporteur_id === id);
  const [f, setF] = useState('tout');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [lien, setLien] = useState('');
  if (a.apporteurs === null) return <p className="ec-muted">Chargement…</p>;
  if (!x) return <><Head title="Apporteur introuvable" /><Link to="/gestion/apporteurs" className="ec-link-btn">Retour aux apporteurs</Link></>;
  const t = totaux(lignes);
  const vues = f === 'tout' ? lignes : lignes.filter((l) => l.statut === f);

  async function verser(l) {
    setMsg(''); setErr('');
    const ref = window.prompt(`Commission de ${euro(l.montant)} HT pour ${l.societe} (${l.bdc_numero}, ${l.leads} leads à ${euro(l.taux)}).\nRéférence du virement ou de la facture de l’apporteur (facultatif) :`, '');
    if (ref === null) return;
    const { error } = await db.rpc('admin_verser_commission', { p_commande: l.commande_id, p_reference: ref });
    if (error) setErr(/pas_a_payer/.test(error.message) ? 'Cette ligne n’est plus « À payer » (litige ou livraison en cours) : rechargez.' : errMsg(error));
    else { setMsg(`Versement de ${euro(l.montant)} enregistré.`); a.reload(); }
  }
  async function statut(s) {
    setMsg(''); setErr('');
    if (!window.confirm(s === 'suspendu' ? 'Suspendre cet apporteur ? Il garde l’accès en lecture à ses commissions passées.' : 'Réactiver cet apporteur ?')) return;
    const { error } = await db.from('apporteurs').update({ statut: s }).eq('id', id);
    if (error) setErr(errMsg(error)); else a.reload();
  }
  async function pdfContrat() {
    setErr('');
    const { data: sd } = await db.auth.getSession();
    const r = await fetch('/api/apporteur', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${sd.session?.access_token}`, ...appareilHeaders() }, body: JSON.stringify({ action: 'pdf', id }) }).catch(() => null);
    if (!r || !r.ok) { setErr('Téléchargement du contrat impossible.'); return; }
    const url = URL.createObjectURL(await r.blob());
    const a2 = document.createElement('a');
    a2.href = url; a2.download = `contrat-apporteur-${(x.raison_sociale || x.nom).replace(/[^\w-]+/g, '-').toLowerCase()}.pdf`; a2.click();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  }
  async function renvoyer() {
    setMsg(''); setErr(''); setLien('');
    const r = await ouvrir({ id });
    if (r.err) { setErr(r.err); return; }
    setMsg(r.email_envoye ? `Nouveau lien envoyé à ${x.email}.` : 'L’e-mail n’est pas parti : envoyez-lui le lien ci-dessous.');
    setLien(r.lien);
  }

  return (
    <>
      <Link to="/gestion/apporteurs" className="ec-back">← Tous les apporteurs</Link>
      <Head title={[x.prenom, x.nom].filter(Boolean).join(' ')} sub={`${STATUTS[x.statut]}${x.valide_le ? ` depuis le ${dateFr(x.valide_le)}` : ''}`}>
        <div className="ec-head-tools">
          {x.statut === 'actif' && <button type="button" className="ec-btn-ghost" onClick={renvoyer}>Renvoyer l’accès</button>}
          {x.statut === 'actif' && <button type="button" className="ec-btn-ghost" onClick={() => statut('suspendu')}>Suspendre</button>}
          {x.statut === 'suspendu' && <button type="button" className="ec-btn-ghost" onClick={() => statut('actif')}>Réactiver</button>}
        </div>
      </Head>
      {err && <p className="ec-err">{err}</p>}{msg && <p className="ec-ok">{msg}</p>}
      {lien && <div className="ec-card"><Lien lien={lien} /></div>}
      <div className="ec-fiche">
        <section className="ec-card ec-fiche-id">
          <h2>Coordonnées</h2>
          <dl className="ec-dl ec-dl-1">
            <div><dt>Société</dt><dd>{x.societe || '·'}</dd></div>
            <div><dt>Téléphone</dt><dd>{x.telephone ? <a href={`tel:${x.telephone}`}>{x.telephone}</a> : '·'}</dd></div>
            <div><dt>E-mail</dt><dd><a href={`mailto:${x.email}`}>{x.email}</a></dd></div>
            <div><dt>SIRET</dt><dd>{x.siret || '·'}</dd></div>
            <div><dt>Entreprise</dt><dd>{x.raison_sociale ? `${x.raison_sociale} · ${libelleForme(x.forme, x.forme_autre)}` : '·'}</dd></div>
            <div><dt>Adresse</dt><dd>{x.adresse ? `${x.adresse}, ${x.code_postal} ${x.ville}` : '·'}</dd></div>
            <div><dt>TVA</dt><dd>{x.tva_regime === 'franchise' ? 'Franchise (293 B)' : x.tva_numero || '·'}</dd></div>
            <div><dt>IBAN</dt><dd>{x.iban ? `${ibanLisible(x.iban)} (${x.titulaire_iban || '·'})` : '·'}</dd></div>
            <div><dt>Contrat</dt><dd>{x.contrat_signe_le ? <>Signé le {dateHeure(x.contrat_signe_le)} <button type="button" className="ec-link-btn" onClick={pdfContrat}>PDF</button></> : x.statut === 'actif' ? 'Onboarding en cours, pas encore signé' : '·'}</dd></div>
            <div><dt>Clients</dt><dd>{clients.length ? clients.map((c) => <Link key={c.user_id} to={`/gestion/clients/${c.user_id}`} className="ec-block">{c.societe} · {euro(c.commission_ht)} / lead</Link>) : 'Aucun : taguez un client depuis sa fiche.'}</dd></div>
          </dl>
        </section>
        <section className="ec-fiche-chiffres">
          <div className="ec-kpis ec-kpis-4">
            <div className={`ec-kpi${t.a_payer > 0 ? ' is-alert' : ''}`}><b>À payer</b><span>Commandes réglées, sans litige</span><strong>{euro(t.a_payer)}</strong></div>
            <div className="ec-kpi"><b>En cours</b><span>Pas encore payable</span><strong>{euro(t.en_cours)}</strong></div>
            <div className="ec-kpi"><b>Versé</b><span>Depuis le début</span><strong>{euro(t.versee)}</strong></div>
            <div className="ec-kpi"><b>Leads comptés</b><span>Livrés, non annulés</span><strong>{t.leads}</strong></div>
          </div>
        </section>
      </div>
      <div className="ec-tabs">{[['tout', `Toutes (${lignes.length})`], ['a_payer', 'À payer'], ['en_cours', 'En cours'], ['versee', 'Versées']].map(([k, tt]) => <button type="button" key={k} className={f === k ? 'is-on' : ''} onClick={() => setF(k)}>{tt}</button>)}</div>
      {vues.length === 0 ? <div className="ec-card ec-empty" style={{ marginTop: 14 }}><p>Aucune ligne.</p></div> : (
        <div className="ec-card ec-table-wrap" style={{ marginTop: 14 }}>
          <table className="ec-table">
            <thead><tr><th>Approuvée le</th><th>Client</th><th>Commande</th><th className="ec-num">Leads</th><th className="ec-num">Par lead</th><th className="ec-num">Commission HT</th><th>Statut</th><th /></tr></thead>
            <tbody>{vues.map((l) => (
              <tr key={l.commande_id}>
                <td>{dateFr(l.approuve_le)}</td>
                <td><Link to={`/gestion/clients/${l.client_id}`}><b>{l.societe}</b></Link></td>
                <td>{THEMES[l.thematique] || l.thematique || '·'}<small className="ec-block">{l.bdc_numero}</small></td>
                <td className="ec-num">{l.leads}</td>
                <td className="ec-num">{euro(l.taux)}</td>
                <td className="ec-num"><b>{euro(l.montant)}</b></td>
                <td><span className={`ec-status ${CLASSE_COMMISSION[l.statut]}`}>{STATUTS_COMMISSION[l.statut]}{l.verse_le ? ` le ${dateFr(l.verse_le)}` : ''}</span>{(l.raison || l.reference) && <small className="ec-block">{l.raison || `Réf. ${l.reference}`}</small>}</td>
                <td>{l.statut === 'a_payer' && <button type="button" className="ec-btn" onClick={() => verser(l)}>Marquer versée</button>}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
      <p className="ec-note">Une ligne par bon de commande approuvé depuis la date de tag du client. « À payer » : commande terminée, réglée, sans litige en attente. Les montants versés sont figés : changer la commission d’un client ne touche que les lignes non versées.</p>
    </>
  );
}

// ─ Bloc de la fiche client : apporteur, commission par lead, date de début ─
export function TagApporteur({ client, reload, apercu }) {
  const a = useApporteurs(apercu);
  const actifs = (a.apporteurs || []).filter((x) => x.statut === 'actif' || x.id === client.apporteur_id);
  const auj = new Date().toISOString().slice(0, 10);
  const init = () => ({ apporteur_id: client.apporteur_id || '', commission_ht: client.commission_ht ?? '', apporteur_depuis: client.apporteur_depuis || auj });
  const [f, setF] = useState(init);
  const [edit, setEdit] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const courant = (a.apporteurs || []).find((x) => x.id === client.apporteur_id);
  async function save(e) {
    e.preventDefault();
    setMsg(''); setErr('');
    const sans = !f.apporteur_id;
    const taux = Number(String(f.commission_ht).replace(',', '.'));
    if (!sans && (!Number.isFinite(taux) || taux < 0 || String(f.commission_ht).trim() === '')) { setErr('Indiquez la commission par lead en euros HT.'); return; }
    if (apercu) { setEdit(false); setMsg('Aperçu : rien n’est écrit.'); return; }
    const { error } = await db.from('clients').update(sans ? { apporteur_id: null, commission_ht: null, apporteur_depuis: null } : { apporteur_id: f.apporteur_id, commission_ht: taux, apporteur_depuis: f.apporteur_depuis || auj }).eq('user_id', client.user_id);
    if (error) { setErr(errMsg(error)); return; }
    setEdit(false); setMsg(sans ? 'Client détaché de son apporteur. Les versements passés restent.' : 'Apporteur enregistré.'); reload();
  }
  return (
    <section className="ec-card" style={{ marginTop: 16 }}>
      <div className="ec-head-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>Apporteur d’affaires</h2>
        <button type="button" className="ec-btn-ghost" onClick={() => { setF(init()); setEdit((v) => !v); }}>{edit ? 'Annuler' : client.apporteur_id ? 'Modifier' : 'Relier à un apporteur'}</button>
      </div>
      {err && <p className="ec-err">{err}</p>}{msg && <p className="ec-ok">{msg}</p>}
      {edit ? (
        <form className="ec-form ec-form-grid" onSubmit={save} style={{ marginTop: 12 }}>
          <label className="ec-field"><span>Apporteur</span>
            <select value={f.apporteur_id} onChange={(e) => setF((x) => ({ ...x, apporteur_id: e.target.value }))}>
              <option value="">Aucun</option>
              {actifs.map((x) => <option key={x.id} value={x.id}>{[x.prenom, x.nom].filter(Boolean).join(' ')}{x.societe ? ` (${x.societe})` : ''}</option>)}
            </select>
          </label>
          {f.apporteur_id && <label className="ec-field"><span>Commission par lead (€ HT)</span><input inputMode="decimal" value={f.commission_ht} onChange={(e) => setF((x) => ({ ...x, commission_ht: e.target.value }))} placeholder="3" /></label>}
          {f.apporteur_id && <label className="ec-field"><span>Compter les commandes approuvées à partir du</span><input type="date" value={f.apporteur_depuis} onChange={(e) => setF((x) => ({ ...x, apporteur_depuis: e.target.value }))} /></label>}
          <div className="ec-field"><button type="submit" className="ec-btn">Enregistrer</button></div>
        </form>
      ) : (
        <p className="ec-muted" style={{ marginTop: 8 }}>{client.apporteur_id
          ? <>Apporté par <Link to={`/gestion/apporteurs/${client.apporteur_id}`}><b>{courant ? [courant.prenom, courant.nom].filter(Boolean).join(' ') : 'un apporteur'}</b></Link> · {euro(client.commission_ht)} HT par lead · commandes approuvées depuis le {dateFr(client.apporteur_depuis)}</>
          : 'Aucun apporteur.'}</p>
      )}
    </section>
  );
}

// ─ Paramètres : identité de Kairn au contrat d'apporteur, et signature d'Ugo ─
// Tant qu'elle est incomplète, les apporteurs remplissent leurs infos mais voient « contrat en préparation ».
const CHAMPS_KAIRN = [
  ['nom_legal', 'Nom légal', 'Ex. Kairn, ou vos prénom et nom si vous êtes entrepreneur individuel'],
  ['forme', 'Forme juridique', 'Ex. « SASU au capital de 1 000 € » ou « entrepreneur individuel »'],
  ['siret', 'SIRET', '14 chiffres'],
  ['adresse', 'Adresse du siège', 'Rue, code postal, ville'],
  ['signataire', 'Signataire', 'Vos prénom et nom'],
  ['qualite', 'Qualité du signataire', 'Ex. Président, Gérant, entrepreneur'],
  ['ville_tribunal', 'Ville du tribunal compétent', 'En général celle du siège'],
];

function PadAdmin({ valeur, onChange }) {
  const ref = React.useRef(null);
  const actif = React.useRef(false);
  useEffect(() => {
    const c = ref.current; const r = window.devicePixelRatio || 1;
    c.width = c.offsetWidth * r; c.height = c.offsetHeight * r;
    const ctx = c.getContext('2d'); ctx.scale(r, r); ctx.lineWidth = 2.4; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#0B0918';
  }, []);
  const pos = (e) => { const b = ref.current.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; };
  return (
    <div>
      {valeur && <img src={valeur} alt="Signature enregistrée" style={{ maxHeight: 70, display: 'block', marginBottom: 8 }} />}
      <canvas ref={ref} style={{ width: '100%', height: 140, border: '1px dashed #B8C2D6', borderRadius: 12, touchAction: 'none', background: '#fff' }}
        onPointerDown={(e) => { ref.current.setPointerCapture(e.pointerId); actif.current = true; const ctx = ref.current.getContext('2d'); ctx.beginPath(); ctx.moveTo(...pos(e)); }}
        onPointerMove={(e) => { if (!actif.current) return; const ctx = ref.current.getContext('2d'); ctx.lineTo(...pos(e)); ctx.stroke(); }}
        onPointerUp={() => { if (actif.current) { actif.current = false; onChange(ref.current.toDataURL('image/png')); } }} />
      <button type="button" className="ec-link-btn" onClick={() => { const c = ref.current; c.getContext('2d').clearRect(0, 0, c.width, c.height); onChange(''); }}>Effacer</button>
    </div>
  );
}

export function Parametres({ apercu }) {
  const [k, setK] = useState(null);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  useEffect(() => {
    if (apercu) { setK({}); return; }
    db.from('kairn_parametres').select('*').eq('id', 1).maybeSingle().then(({ data, error }) => { if (error) setErr('Paramètres illisibles (migration non appliquée ?).'); setK(data || {}); });
  }, [apercu]);
  if (!k) return <div className="ec-loading" aria-busy="true" />;
  const manques = manquesKairn(k);
  async function save(e) {
    e.preventDefault();
    setMsg(''); setErr('');
    if (k.siret && !siretValide(k.siret)) { setErr('SIRET invalide.'); return; }
    if (apercu) { setMsg('Aperçu : rien n’est écrit.'); return; }
    const ligne = { id: 1, maj_le: new Date().toISOString(), signature_png: k.signature_png || null };
    for (const [c] of CHAMPS_KAIRN) ligne[c] = c === 'siret' ? String(k.siret || '').replace(/\s/g, '') || null : String(k[c] || '').trim() || null;
    const { error } = await db.from('kairn_parametres').upsert(ligne);
    setMsg(error ? '' : 'Enregistré.'); if (error) setErr(errMsg(error));
  }
  return (
    <>
      <Head title="Paramètres" sub="Votre identité au contrat d’apporteur d’affaires. Elle figure en tête de chaque contrat et sur les factures que les apporteurs vous adressent." />
      <p className={manques.length ? 'ec-err' : 'ec-ok'}>{manques.length ? `Contrats bloqués : il manque ${manques.join(', ')}. Les apporteurs voient « contrat en préparation ».` : 'Complet : les apporteurs peuvent signer.'}</p>
      <form className="ec-card ec-form" onSubmit={save} style={{ display: 'grid', gap: 14 }}>
        {CHAMPS_KAIRN.map(([c, t, aide]) => (
          <label key={c} className="ec-field"><span>{t}</span><input value={k[c] || ''} onChange={(e) => setK((x) => ({ ...x, [c]: e.target.value }))} placeholder={aide} /></label>
        ))}
        <div className="ec-field"><span>Votre signature (facultatif, apposée sur chaque contrat)</span><PadAdmin valeur={k.signature_png} onChange={(v) => setK((x) => ({ ...x, signature_png: v || null }))} /></div>
        <div><button type="submit" className="ec-btn">Enregistrer</button></div>
        {err && <p className="ec-err">{err}</p>}{msg && <p className="ec-ok">{msg}</p>}
      </form>
      <p className="ec-note">Un changement ne touche pas les contrats déjà signés : leur texte est figé. Le modèle de contrat est rédigé par Claude, à faire relire par un avocat.</p>
    </>
  );
}
