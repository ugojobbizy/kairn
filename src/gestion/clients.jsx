import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { db, THEMES, MOTIFS, LITIGE_STATUTS, SUIVI, TVA, euro, dateFr, dateHeure } from '../espace/db.js';

// Clients de Kairn Admin (Ugo, 30/10/2026 : « visualiser tous mes clients et avoir une fiche sur eux avec toutes les infos,
// le nombre de leads achetés, le montant dépensé, les encours, les factures réglées, celles à régler »).
// Liste avec les chiffres clés, création en un clic (api/client-ouvrir.js), et une fiche par client sur /gestion/clients/:id.
// Tous les chiffres sont calculés à partir des tables commandes, leads, litiges, lead_suivi, client_prefs et tickets.
// Montants : bons de commande approuvés, hors taxes ; les factures Pennylane ne sont pas encore branchées.

function Head({ title, sub, children }) {
  return <header className="ec-head ec-head-row"><div><h1>{title}</h1>{sub && <p>{sub}</p>}</div>{children}</header>;
}

const CMD_STATUTS = { nouvelle: 'À valider', en_cours: 'À valider', ouverte: 'Ouverte', terminee: 'Terminée', refusee: 'Refusée' };
const jours = (d) => (d ? Math.floor((Date.now() - new Date(d).getTime()) / 86400000) : null);

// Chiffres d'un client, à partir des données déjà chargées par Kairn Admin.
export function statsClient(uid, { leads, commandes, litiges }) {
  const cmds = (commandes || []).filter((c) => c.user_id === uid);
  const bdc = cmds.filter((c) => c.bdc_numero && c.statut !== 'refusee');
  const mesLeads = (leads || []).filter((l) => l.client_id === uid);
  const actifs = mesLeads.filter((l) => !l.annule);
  const livresPar = {};
  for (const l of actifs) if (l.commande_id) livresPar[l.commande_id] = (livresPar[l.commande_id] || 0) + 1;
  const ouvertes = bdc.filter((c) => c.statut === 'ouverte');
  const engage = bdc.filter((c) => c.approuve_le).reduce((s, c) => s + Number(c.montant_ht || 0), 0);
  const regle = bdc.filter((c) => c.regle_le).reduce((s, c) => s + Number(c.montant_ht || 0), 0);
  const aRegler = bdc.filter((c) => c.approuve_le && !c.regle_le);
  const lit = (litiges || []).filter((g) => g.client_id === uid);
  const derniereLivraison = actifs.reduce((m, l) => (l.livre_le && (!m || l.livre_le > m) ? l.livre_le : m), null);
  return {
    cmds, bdc, ouvertes, livresPar, aRegler, lit,
    livres: actifs.length,
    commande: bdc.reduce((s, c) => s + (c.plafond || 0), 0),
    resteALivrer: ouvertes.reduce((s, c) => s + Math.max(0, (c.plafond || 0) - (livresPar[c.id] || 0)), 0),
    engage, regle, du: engage - regle,
    duPlusAncien: aRegler.reduce((m, c) => (!m || c.approuve_le < m ? c.approuve_le : m), null),
    prixMoyen: actifs.length ? actifs.reduce((s, l) => s + Number(l.prix_ht || 0), 0) / actifs.length : 0,
    preCommandes: cmds.filter((c) => !c.bdc_numero && ['nouvelle', 'en_cours'].includes(c.statut)).length,
    litAttente: lit.filter((g) => g.statut === 'en_attente').length,
    litAcceptes: lit.filter((g) => g.statut === 'accepte').length,
    derniereLivraison,
    derniereCommande: cmds[0]?.created_at || null,
  };
}

// ─ Création en un clic (déplacé de gestion.jsx) ─
function NouveauClient({ apercu, reload, onCree }) {
  const vide = { email: '', societe: '', prenom: '', telephone: '', siret: '' };
  const [f, setF] = useState(vide);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [lien, setLien] = useState('');
  const [busy, setBusy] = useState(false);
  const [copie, setCopie] = useState(false);
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));
  async function ouvrir(e) {
    e.preventDefault();
    setMsg(''); setErr(''); setLien(''); setCopie(false);
    if (apercu) { setMsg(`Aperçu : rien n’est créé. En vrai, ${f.email || 'le client'} reçoit son invitation.`); return; }
    setBusy(true);
    const r = await ouvrirCompte(f);
    setBusy(false);
    if (r.err) { setErr(r.err); return; }
    setMsg(`${r.nouveau ? 'Compte créé' : 'Compte existant relié'} et espace ouvert pour ${f.societe}. ${r.email_envoye ? `Invitation envoyée à ${f.email}.` : 'L’e-mail n’est pas parti : envoyez-lui le lien ci-dessous.'}`);
    setLien(r.lien);
    setF(vide);
    await reload();
    onCree?.();
  }
  return (
    <form className="ec-card ec-form ec-form-grid" onSubmit={ouvrir}>
      <label className="ec-field"><span>E-mail du compte</span><input type="email" required value={f.email} onChange={set('email')} /></label>
      <label className="ec-field"><span>Société</span><input required value={f.societe} onChange={set('societe')} /></label>
      <label className="ec-field"><span>Prénom du contact</span><input value={f.prenom} onChange={set('prenom')} /></label>
      <label className="ec-field"><span>Téléphone</span><input value={f.telephone} onChange={set('telephone')} /></label>
      <label className="ec-field"><span>SIRET</span><input value={f.siret} onChange={set('siret')} /></label>
      <div className="ec-field"><button type="submit" className="ec-btn" disabled={busy}>{busy ? 'Création…' : 'Créer le client'}</button></div>
      {err && <p className="ec-err">{err}</p>}{msg && <p className="ec-ok">{msg}</p>}
      {lien && <LienAcces lien={lien} copie={copie} onCopie={() => setCopie(true)} />}
    </form>
  );
}

function LienAcces({ lien, copie, onCopie }) {
  return (
    <div className="ec-field ec-lien">
      <span>Lien d’accès du client (à usage unique)</span>
      <div><input readOnly value={lien} onFocus={(e) => e.target.select()} /><button type="button" className="ec-btn-ghost" onClick={() => navigator.clipboard.writeText(lien).then(onCopie)}>{copie ? 'Copié' : 'Copier'}</button></div>
    </div>
  );
}

// Appel commun à la création et au renvoi de l'invitation.
async function ouvrirCompte(fiche) {
  const { data: sd } = await db.auth.getSession();
  const r = await fetch('/api/client-ouvrir', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${sd.session?.access_token}` }, body: JSON.stringify(fiche) })
    .then(async (x) => ({ status: x.status, body: await x.json().catch(() => ({})) })).catch(() => null);
  if (!r || r.status !== 200) {
    const code = r?.body?.error;
    return { err: code === 'service_non_configure' ? 'La clé de service Supabase n’est pas posée dans Vercel (SUPABASE_SERVICE_ROLE_KEY).'
      : code === 'bad_params' ? 'E-mail valide et société obligatoires.'
        : code === 'forbidden' ? 'Accès réservé à l’administration Kairn.'
          : 'L’opération n’a pas abouti. Réessayez dans un instant.' };
  }
  return r.body;
}

// ─ Liste ─
export function Clients({ data, apercu }) {
  const { clients, reload } = data;
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [tri, setTri] = useState('engage');
  const [ouvert, setOuvert] = useState(false);
  const rows = useMemo(() => (clients || []).map((c) => ({ c, s: statsClient(c.user_id, data) }))
    .filter(({ c }) => !q || `${c.societe} ${c.prenom || ''} ${c.telephone || ''} ${c.siret || ''}`.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => (tri === 'nom' ? a.c.societe.localeCompare(b.c.societe) : tri === 'du' ? b.s.du - a.s.du : tri === 'livraison' ? String(b.s.derniereLivraison || '').localeCompare(String(a.s.derniereLivraison || '')) : b.s.engage - a.s.engage)), [clients, data, q, tri]);
  const tot = rows.reduce((t, { s }) => ({ engage: t.engage + s.engage, du: t.du + s.du, reste: t.reste + s.resteALivrer, actifs: t.actifs + (s.ouvertes.length ? 1 : 0) }), { engage: 0, du: 0, reste: 0, actifs: 0 });
  return (
    <>
      <Head title="Clients" sub="Tous vos clients, leurs chiffres et leur fiche complète.">
        <button type="button" className="ec-btn" onClick={() => setOuvert((o) => !o)}>{ouvert ? 'Fermer' : 'Nouveau client'}</button>
      </Head>
      {(ouvert || (clients && clients.length === 0)) && (
        <>
          <p className="ec-note">Remplissez la fiche et cliquez sur Créer le client : le compte est créé, l’espace ouvert, et le client reçoit par e-mail un lien pour choisir son mot de passe.</p>
          <NouveauClient apercu={apercu} reload={reload} />
        </>
      )}
      <div className="ec-kpis ec-kpis-4">
        <div className="ec-kpi"><b>Clients</b><span>{tot.actifs} avec une commande en cours</span><strong>{clients ? clients.length : '·'}</strong></div>
        <div className="ec-kpi"><b>Chiffre d’affaires</b><span>Bons de commande approuvés, HT</span><strong>{euro(tot.engage)}</strong></div>
        <div className={`ec-kpi${tot.du > 0 ? ' is-alert' : ''}`}><b>À encaisser</b><span>Approuvé, pas encore réglé, HT</span><strong>{euro(tot.du)}</strong></div>
        <div className="ec-kpi"><b>Reste à livrer</b><span>Contacts sur les commandes ouvertes</span><strong>{tot.reste}</strong></div>
      </div>
      {clients && clients.length > 0 && (
        <>
          <div className="ec-filters ec-filters-2">
            <label className="is-wide"><span>Recherche</span><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Société, contact, téléphone, SIRET" /></label>
            <label><span>Trier par</span><select value={tri} onChange={(e) => setTri(e.target.value)}><option value="engage">Chiffre d’affaires</option><option value="du">Montant à régler</option><option value="livraison">Dernière livraison</option><option value="nom">Nom</option></select></label>
          </div>
          <div className="ec-card ec-table-wrap">
            <table className="ec-table ec-table-click">
              <thead><tr><th>Société</th><th>Contact</th><th className="ec-num">Contacts livrés</th><th className="ec-num">Reste à livrer</th><th className="ec-num">CA HT</th><th className="ec-num">À régler HT</th><th>Dernière livraison</th><th /></tr></thead>
              <tbody>
                {rows.map(({ c, s }) => (
                  <tr key={c.user_id} onClick={() => navigate(`/gestion/clients/${c.user_id}`)}>
                    <td><b>{c.societe}</b>{(s.preCommandes > 0 || s.litAttente > 0) && <small className="ec-block">{[s.preCommandes && `${s.preCommandes} pré-commande à valider`, s.litAttente && `${s.litAttente} litige en attente`].filter(Boolean).join(' · ')}</small>}</td>
                    <td>{c.prenom || '·'}<small className="ec-block">{c.telephone || ''}</small></td>
                    <td className="ec-num">{s.livres}</td>
                    <td className="ec-num">{s.resteALivrer || '·'}</td>
                    <td className="ec-num"><b>{euro(s.engage)}</b></td>
                    <td className="ec-num">{s.du > 0 ? <span className="ec-status is-en_attente">{euro(s.du)}</span> : '·'}</td>
                    <td>{s.derniereLivraison ? dateFr(s.derniereLivraison) : '·'}</td>
                    <td><Link to={`/gestion/clients/${c.user_id}`} className="ec-link-btn" onClick={(e) => e.stopPropagation()}>Fiche</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}

// ─ Fiche ─
export function FicheClient({ data, apercu }) {
  const { id } = useParams();
  const { clients, leads, litiges, reload } = data;
  const c = (clients || []).find((x) => x.user_id === id);
  const s = useMemo(() => (c ? statsClient(id, data) : null), [c, id, data]);
  const [extra, setExtra] = useState({ prefs: null, suivi: [], tickets: [], push: 0 });
  const [edit, setEdit] = useState(null);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [lien, setLien] = useState('');
  const [copie, setCopie] = useState(false);
  const [onglet, setOnglet] = useState('commandes');

  useEffect(() => {
    if (!c || apercu) return;
    Promise.all([
      db.from('client_prefs').select('*').eq('user_id', id).maybeSingle(),
      db.from('lead_suivi').select('lead_id, statut, maj_le').eq('client_id', id),
      db.from('tickets').select('*').eq('client_id', id).order('created_at', { ascending: false }),
      db.from('push_abonnements').select('id').eq('user_id', id),
    ]).then(([p, sv, t, pu]) => setExtra({ prefs: p.data || null, suivi: sv.data || [], tickets: t.data || [], push: (pu.data || []).length }));
  }, [c, id, apercu]);

  if (!clients) return <p className="ec-muted">Chargement…</p>;
  if (!c) return <><Head title="Client introuvable" /><Link to="/gestion/clients" className="ec-link-btn">Retour aux clients</Link></>;

  const mesLeads = (leads || []).filter((l) => l.client_id === id).sort((a, b) => String(b.livre_le).localeCompare(String(a.livre_le)));
  const parStatut = {};
  for (const x of extra.suivi) parStatut[x.statut] = (parStatut[x.statut] || 0) + 1;
  const traites = extra.suivi.filter((x) => x.statut !== 'a_appeler').length;
  const parTheme = {};
  for (const l of mesLeads.filter((x) => !x.annule)) parTheme[l.thematique] = (parTheme[l.thematique] || 0) + 1;
  const email = extra.prefs?.email || '';

  async function enregistrer(e) {
    e.preventDefault();
    setMsg(''); setErr('');
    if (apercu) { setEdit(null); setMsg('Aperçu : rien n’est écrit.'); return; }
    const { error } = await db.from('clients').update({ societe: edit.societe.trim(), prenom: edit.prenom.trim() || null, telephone: edit.telephone.trim() || null, siret: edit.siret.trim() || null }).eq('user_id', id);
    if (error) { setErr('Enregistrement impossible.'); return; }
    setEdit(null); setMsg('Fiche mise à jour.'); reload();
  }
  async function renvoyer() {
    setMsg(''); setErr(''); setLien(''); setCopie(false);
    if (!email) { setErr('Aucune adresse e-mail connue pour ce client : recréez-le depuis Nouveau client avec son e-mail.'); return; }
    if (apercu) { setMsg('Aperçu : rien n’est envoyé.'); return; }
    const r = await ouvrirCompte({ email, societe: c.societe, prenom: c.prenom, telephone: c.telephone, siret: c.siret });
    if (r.err) { setErr(r.err); return; }
    setMsg(r.email_envoye ? `Nouveau lien envoyé à ${email}.` : 'L’e-mail n’est pas parti : envoyez-lui le lien ci-dessous.');
    setLien(r.lien);
  }
  async function regler(cmd) {
    if (apercu || !window.confirm(`Marquer le bon de commande ${cmd.bdc_numero} comme réglé (${euro(cmd.montant_ht)} HT) ?`)) return;
    const { error } = await db.from('commandes').update({ regle_le: new Date().toISOString() }).eq('id', cmd.id);
    if (error) setErr('Règlement non enregistré.'); else { setMsg('Règlement enregistré.'); reload(); }
  }

  return (
    <>
      <Link to="/gestion/clients" className="ec-back">← Tous les clients</Link>
      <Head title={c.societe} sub={`Client depuis le ${dateFr(c.created_at)}${s.derniereLivraison ? ` · dernière livraison ${dateHeure(s.derniereLivraison)}` : ''}`}>
        <div className="ec-head-tools">
          <button type="button" className="ec-btn-ghost" onClick={renvoyer}>Renvoyer l’accès</button>
          <button type="button" className="ec-btn-ghost" onClick={() => setEdit(edit ? null : { societe: c.societe || '', prenom: c.prenom || '', telephone: c.telephone || '', siret: c.siret || '' })}>{edit ? 'Annuler' : 'Modifier'}</button>
        </div>
      </Head>
      {err && <p className="ec-err">{err}</p>}{msg && <p className="ec-ok">{msg}</p>}
      {lien && <div className="ec-card"><LienAcces lien={lien} copie={copie} onCopie={() => setCopie(true)} /></div>}

      <div className="ec-fiche">
        <section className="ec-card ec-fiche-id">
          <h2>Coordonnées</h2>
          {edit ? (
            <form className="ec-form" onSubmit={enregistrer}>
              {[['societe', 'Société'], ['prenom', 'Contact'], ['telephone', 'Téléphone'], ['siret', 'SIRET']].map(([k, t]) => (
                <label key={k} className="ec-field"><span>{t}</span><input value={edit[k]} required={k === 'societe'} onChange={(e) => setEdit((x) => ({ ...x, [k]: e.target.value }))} /></label>
              ))}
              <button type="submit" className="ec-btn">Enregistrer</button>
            </form>
          ) : (
            <dl className="ec-dl ec-dl-1">
              <div><dt>Contact</dt><dd>{c.prenom || '·'}</dd></div>
              <div><dt>Téléphone</dt><dd>{c.telephone ? <a href={`tel:${c.telephone.replace(/\s/g, '')}`}>{c.telephone}</a> : '·'}</dd></div>
              <div><dt>E-mail</dt><dd>{email ? <a href={`mailto:${email}`}>{email}</a> : '·'}</dd></div>
              <div><dt>SIRET</dt><dd>{c.siret ? <a href={`https://annuaire-entreprises.data.gouv.fr/etablissement/${c.siret.replace(/\s/g, '')}`} target="_blank" rel="noopener noreferrer">{c.siret}</a> : '·'}</dd></div>
              <div><dt>Alertes</dt><dd>{apercu ? 'E-mail' : [extra.prefs?.alerte_email && 'E-mail', extra.prefs?.alerte_push && `Mobile (${extra.push} appareil${extra.push > 1 ? 's' : ''})`, extra.prefs?.webhook_url && 'Webhook CRM'].filter(Boolean).join(' · ') || 'Aucune'}</dd></div>
            </dl>
          )}
        </section>

        <section className="ec-fiche-chiffres">
          <div className="ec-kpis ec-kpis-4">
            <div className="ec-kpi"><b>Contacts livrés</b><span>{Object.entries(parTheme).map(([k, n]) => `${n} ${k}`).join(' · ') || 'Aucun pour l’instant'}</span><strong>{s.livres}</strong></div>
            <div className="ec-kpi"><b>Chiffre d’affaires</b><span>{s.livres ? `${euro(s.prixMoyen)} HT par contact en moyenne` : 'Bons de commande approuvés, HT'}</span><strong>{euro(s.engage)}</strong><small>{euro(s.engage * (1 + TVA))} TTC</small></div>
            <div className={`ec-kpi${s.du > 0 ? ' is-alert' : ''}`}><b>À régler</b><span>{s.aRegler.length ? `${s.aRegler.length} bon${s.aRegler.length > 1 ? 's' : ''}, le plus ancien depuis ${jours(s.duPlusAncien)} j` : 'Tout est réglé'}</span><strong>{euro(s.du)}</strong><small>Déjà réglé : {euro(s.regle)} HT</small></div>
            <div className="ec-kpi"><b>En cours</b><span>{s.ouvertes.length} commande{s.ouvertes.length > 1 ? 's' : ''} ouverte{s.ouvertes.length > 1 ? 's' : ''}{s.preCommandes ? ` · ${s.preCommandes} à valider` : ''}</span><strong>{s.resteALivrer}</strong><small>contacts restant à livrer</small></div>
          </div>
          <div className="ec-kpis ec-kpis-4">
            <div className="ec-kpi"><b>Commandé</b><span>Total des bons de commande</span><strong>{s.commande}</strong></div>
            <div className="ec-kpi"><b>Litiges</b><span>{s.litAcceptes} accepté{s.litAcceptes > 1 ? 's' : ''} · {s.litAttente} en attente</span><strong>{s.lit.length}</strong></div>
            <div className="ec-kpi"><b>Contacts traités</b><span>Statut changé par le client dans son suivi</span><strong>{s.livres ? `${Math.round((traites / s.livres) * 100)} %` : '·'}</strong><small>{traites} sur {s.livres}</small></div>
            <div className="ec-kpi"><b>Signés (déclarés)</b><span>{['rdv', 'devis', 'nrp'].map((k) => `${parStatut[k] || 0} ${SUIVI[k]}`).join(' · ')}</span><strong>{parStatut.signe || 0}</strong></div>
          </div>
          <p className="ec-note">Les statuts viennent du suivi tenu par le client : ils mesurent d’abord s’il traite ses contacts, pas leur qualité.</p>
        </section>
      </div>

      <div className="ec-tabs">
        {[['commandes', `Commandes et factures (${s.cmds.length})`], ['leads', `Contacts livrés (${mesLeads.length})`], ['litiges', `Litiges (${s.lit.length})`], ['tickets', `Messages (${extra.tickets.length})`]].map(([k, t]) => <button type="button" key={k} className={onglet === k ? 'is-on' : ''} onClick={() => setOnglet(k)}>{t}</button>)}
      </div>

      {onglet === 'commandes' && (s.cmds.length === 0 ? <div className="ec-card ec-empty"><p>Aucune commande.</p></div> : (
        <div className="ec-card ec-table-wrap">
          <table className="ec-table">
            <thead><tr><th>Date</th><th>N° du BDC</th><th>Thématique</th><th>Zone</th><th>Avancement</th><th className="ec-num">Montant HT</th><th>Statut</th><th>Règlement</th></tr></thead>
            <tbody>{s.cmds.map((m) => {
              const n = s.livresPar[m.id] || 0;
              return (
                <tr key={m.id}>
                  <td>{dateFr(m.created_at)}</td>
                  <td>{m.bdc_numero || <span className="ec-muted">Pré-commande</span>}{m.type === 'shop' && <small className="ec-block">Leads Shop</small>}</td>
                  <td>{THEMES[m.thematique] || m.thematique || '·'}</td>
                  <td>{m.zone || '·'}</td>
                  <td>{m.plafond ? `${n} / ${m.plafond}` : `${m.volume || '·'} demandés`}</td>
                  <td className="ec-num">{m.montant_ht != null ? <><b>{euro(m.montant_ht)}</b><small>{euro(m.montant_ht * (1 + TVA))} TTC</small></> : '·'}</td>
                  <td><span className={`ec-status is-${m.statut}`}>{CMD_STATUTS[m.statut] || m.statut}</span></td>
                  <td>{!m.approuve_le ? '·' : m.regle_le ? <span className="ec-status is-ouverte">Réglé le {dateFr(m.regle_le)}</span>
                    : <><span className="ec-status is-en_attente">À régler · {jours(m.approuve_le)} j</span> <button type="button" className="ec-link-btn" onClick={() => regler(m)}>Marquer réglé</button></>}</td>
                </tr>
              );
            })}</tbody>
          </table>
        </div>
      ))}

      {onglet === 'leads' && (mesLeads.length === 0 ? <div className="ec-card ec-empty"><p>Aucun contact livré.</p></div> : (
        <div className="ec-card ec-table-wrap">
          <table className="ec-table">
            <thead><tr><th>Livré le</th><th>Thématique</th><th>Contact</th><th>Code postal</th><th className="ec-num">Prix HT</th><th>Suivi du client</th><th>État</th></tr></thead>
            <tbody>{mesLeads.slice(0, 300).map((l) => {
              const sv = extra.suivi.find((x) => x.lead_id === l.id);
              return (
                <tr key={l.id}>
                  <td>{dateHeure(l.livre_le)}</td><td>{THEMES[l.thematique] || l.thematique}</td>
                  <td><b>{[l.prenom, l.nom].filter(Boolean).join(' ') || '·'}</b></td><td>{l.code_postal || '·'}</td>
                  <td className="ec-num">{euro(l.prix_ht)}</td>
                  <td>{sv ? <span className={`ec-st is-${sv.statut}`}>{SUIVI[sv.statut]}</span> : <span className="ec-muted">À appeler</span>}</td>
                  <td>{l.annule ? <span className="ec-status is-refusee">Annulé (litige)</span> : l.exporte_le ? 'Exporté' : '·'}</td>
                </tr>
              );
            })}</tbody>
          </table>
        </div>
      ))}

      {onglet === 'litiges' && (s.lit.length === 0 ? <div className="ec-card ec-empty"><p>Aucun litige.</p></div> : (
        <div className="ec-card ec-table-wrap">
          <table className="ec-table">
            <thead><tr><th>Levé le</th><th>Motif</th><th>Message</th><th>Statut</th><th>Réponse</th></tr></thead>
            <tbody>{s.lit.map((g) => (
              <tr key={g.id}><td>{dateHeure(g.created_at)}</td><td>{MOTIFS[g.motif]}</td><td className="ec-wrap">{g.message || '·'}</td><td><span className={`ec-status is-${g.statut}`}>{LITIGE_STATUTS[g.statut]}</span></td><td className="ec-wrap">{g.reponse || '·'}</td></tr>
            ))}</tbody>
          </table>
          <p className="ec-note" style={{ padding: '0 16px 14px' }}><Link to="/gestion/litiges">Trancher les litiges</Link></p>
        </div>
      ))}

      {onglet === 'tickets' && (extra.tickets.length === 0 ? <div className="ec-card ec-empty"><p>{apercu ? 'Messages non chargés dans l’aperçu.' : 'Aucun message de ce client.'}</p></div> : (
        <div className="ec-card ec-table-wrap">
          <table className="ec-table">
            <thead><tr><th>Ouvert le</th><th>Sujet</th><th>Statut</th><th /></tr></thead>
            <tbody>{extra.tickets.map((t) => (
              <tr key={t.id}><td>{dateHeure(t.created_at)}</td><td className="ec-wrap">{t.urgent && <b>Urgent · </b>}{t.sujet}</td><td>{t.statut}</td><td><Link to="/gestion/tickets" className="ec-link-btn">Répondre</Link></td></tr>
            ))}</tbody>
          </table>
        </div>
      ))}
    </>
  );
}
