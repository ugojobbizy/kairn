import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, NavLink, Route, Routes } from 'react-router-dom';
import { KairnLogo, useV2Favicon } from '../v2/layout.jsx';
import { PRODUITS } from '../v3/produits.js';
import { db, THEMES, MOTIFS, LITIGE_STATUTS, TVA, euro, dateFr, dateHeure, errMsg, alerterLivraison } from '../espace/db.js';
import { apercuData } from '../espace/apercu.js';
import { Campagnes, TicketsAdmin, ShopAdmin, Bientot } from './gestion-plus.jsx';
import { Clients, FicheClient } from './clients.jsx';

// Kairn Monitor (suivi des campagnes Meta), ouvert depuis le menu (Ugo, 29/10/2026).
const MONITOR_URL = 'https://kairn-monitor.vercel.app';
import '../v2/v2.css';
import '../v3/v3.css';
import '../espace/espace.css';

// Kairn Admin (/gestion, 29/10/2026) : l'espace de gestion d'Ugo derrière l'espace client.
// Alerte à chaque litige en attente (cloche, compteur dans le menu, titre de l'onglet), arbitrage accepté ou refusé ;
// validation des pré-commandes (numéro de BDC), livraison de leads du stock, règlements, import CSV de leads, ouverture des accès.
// Accès : compte Supabase dont l'e-mail est dans la table admins (fonction is_admin).

const PRIX = Object.fromEntries(PRODUITS.map((p) => [p.code, p.prix]));
const CMD_STATUTS = { nouvelle: 'À valider', en_cours: 'À valider', ouverte: 'Ouverte', terminee: 'Terminée', refusee: 'Refusée' };

function Ico({ children, size = 19 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>;
}

function useAdminData(apercu) {
  const [d, setD] = useState({ leads: null, commandes: null, litiges: null, clients: null });
  const [error, setError] = useState('');
  const load = useCallback(async () => {
    if (apercu) {
      const a = apercuData();
      const leads = [...a.leads, ...a.stock.map((s) => ({ ...s, prenom: 'Prospect', nom: 'Stock', telephone: '06 00 00 00 00' }))];
      setD({ leads, commandes: a.commandes.map((c) => ({ ...c, user_id: 'apercu' })), litiges: a.litiges, clients: [{ user_id: 'apercu', societe: 'Exemple Chauffage', prenom: 'Julien', telephone: '06 00 00 00 01', created_at: new Date().toISOString() }] });
      return;
    }
    const [l, c, g, k] = await Promise.all([
      db.from('leads').select('*').order('recu_le', { ascending: false }).limit(5000),
      db.from('commandes').select('*').order('created_at', { ascending: false }),
      db.from('litiges').select('*').order('created_at', { ascending: false }),
      db.from('clients').select('*').order('created_at', { ascending: false }),
    ]);
    setError(l.error || c.error || g.error || k.error ? 'Une partie des données n’a pas pu être chargée.' : '');
    setD({ leads: l.data || [], commandes: c.data || [], litiges: g.data || [], clients: k.data || [] });
  }, [apercu]);
  useEffect(() => { load(); }, [load]);
  // Les litiges arrivent sans prévenir : relecture toutes les minutes tant que l'onglet est ouvert.
  useEffect(() => {
    if (apercu) return undefined;
    const t = setInterval(() => { if (!document.hidden) load(); }, 60000);
    return () => clearInterval(t);
  }, [apercu, load]);
  return { ...d, error, reload: load };
}

function Head({ title, sub, children }) {
  return <header className="ec-head ec-head-row"><div><h1>{title}</h1>{sub && <p>{sub}</p>}</div>{children}</header>;
}

// ─ Tableau de bord ─
function Dashboard({ data, tickets }) {
  const { leads, commandes, litiges } = data;
  const aLancer = (commandes || []).filter((c) => c.user_id && c.type !== 'shop' && c.statut !== 'refusee' && ['recue', 'preparation'].includes(c.etape)).length;
  const attente = (litiges || []).filter((g) => g.statut === 'en_attente').length;
  const aValider = (commandes || []).filter((c) => c.user_id && !c.bdc_numero && ['nouvelle', 'en_cours'].includes(c.statut)).length;
  const stock = (leads || []).filter((l) => !l.client_id && !l.annule);
  const du = (commandes || []).filter((c) => c.approuve_le && !c.regle_le).reduce((s, c) => s + Number(c.montant_ht || 0), 0);
  return (
    <>
      <Head title="Kairn Admin" sub="Ce qui attend une décision de votre part." />
      <div className="ec-kpis">
        <Link to="/gestion/campagnes" className={`ec-kpi${aLancer ? ' is-alert' : ''}`}><b>Campagnes à lancer</b><span>Demandes reçues ou en préparation</span><strong>{aLancer}</strong></Link>
        <Link to="/gestion/tickets" className={`ec-kpi${tickets ? ' is-alert' : ''}`}><b>Messages clients</b><span>Tickets non lus</span><strong>{tickets}</strong></Link>
        <Link to="/gestion/litiges" className={`ec-kpi${attente ? ' is-alert' : ''}`}><b>Litiges en attente</b><span>À arbitrer</span><strong>{attente}</strong></Link>
      </div>
      <div className="ec-kpis">
        <Link to="/gestion/commandes" className={`ec-kpi${aValider ? ' is-alert' : ''}`}><b>Bons de commande à émettre</b><span>Pré-commandes sans BDC</span><strong>{aValider}</strong></Link>
        <Link to="/gestion/commandes" className="ec-kpi"><b>À encaisser</b><span>BDC approuvés non réglés, HT</span><strong>{euro(du)}</strong></Link>
        <Link to="/gestion/shop" className="ec-kpi"><b>Leads Shop</b><span>En vente maintenant</span><strong>{stock.filter((l) => l.en_vente !== false).length}</strong></Link>
      </div>
      <p className="ec-label">Stock disponible par thématique</p>
      <div className="ec-kpis">
        {Object.entries(THEMES).map(([k, t]) => <Link to="/gestion/leads" key={k} className="ec-kpi"><b>{t}</b><span>Leads en stock</span><strong>{stock.filter((l) => l.thematique === k).length}</strong></Link>)}
      </div>
    </>
  );
}

// ─ Litiges ─
function Litiges({ data, apercu }) {
  const { litiges, leads, clients, reload } = data;
  const leadOf = useMemo(() => new Map((leads || []).map((l) => [l.id, l])), [leads]);
  const clientOf = useMemo(() => new Map((clients || []).map((c) => [c.user_id, c])), [clients]);
  const [tab, setTab] = useState('en_attente');
  const [rep, setRep] = useState({});
  const [busy, setBusy] = useState('');
  const [msg, setMsg] = useState('');
  const rows = (litiges || []).filter((g) => (tab === 'tous' ? true : g.statut === tab));
  const stockDe = (t) => (leads || []).filter((l) => !l.client_id && !l.annule && l.thematique === t).length;
  async function trancher(g, ok) {
    setBusy(g.id); setMsg('');
    if (apercu) { setBusy(''); return; }
    const { data: newId, error } = await db.rpc('admin_trancher_litige', { p_litige: g.id, p_accepte: ok, p_reponse: rep[g.id] || '' });
    setBusy('');
    if (error) { setMsg(errMsg(error)); return; }
    setMsg(ok ? (newId ? 'Litige accepté : un lead de remplacement a été livré.' : 'Litige accepté : plus de stock, le remplacement reste à livrer sur la commande.') : 'Litige refusé.');
    reload();
  }
  return (
    <>
      <Head title="Litiges" sub="Doublon ou hors zone : accepté, le lead est annulé et remplacé par un lead du stock de la même thématique." />
      <div className="ec-tabs">{[['en_attente', 'En attente'], ['accepte', 'Acceptés'], ['refuse', 'Refusés'], ['tous', 'Tous']].map(([k, t]) => (
        <button type="button" key={k} className={tab === k ? 'is-on' : ''} onClick={() => setTab(k)}>{t}{k === 'en_attente' && (litiges || []).some((g) => g.statut === 'en_attente') && <b>{litiges.filter((g) => g.statut === 'en_attente').length}</b>}</button>
      ))}</div>
      {msg && <p className="ec-ok">{msg}</p>}
      {litiges && rows.length === 0 ? <div className="ec-card ec-empty"><p>Aucun litige ici.</p></div> : (
        <div className="ec-litiges">
          {rows.map((g) => {
            const l = leadOf.get(g.lead_id) || {};
            const c = clientOf.get(g.client_id);
            return (
              <article className="ec-card ec-litige" key={g.id}>
                <div className="ec-litige-top">
                  <span className={`ec-status is-${g.statut}`}>{LITIGE_STATUTS[g.statut]}</span>
                  <b>{MOTIFS[g.motif]}</b>
                  <span className="ec-muted">levé le {dateHeure(g.created_at)} par {c?.societe || 'client'}</span>
                </div>
                <dl className="ec-dl ec-dl-4">
                  <div><dt>Lead</dt><dd>{[l.prenom, l.nom].filter(Boolean).join(' ') || '·'}</dd></div>
                  <div><dt>Téléphone</dt><dd>{l.telephone || '·'}</dd></div>
                  <div><dt>Code postal</dt><dd>{l.code_postal || '·'} {l.ville || ''}</dd></div>
                  <div><dt>Thématique · livré le</dt><dd>{THEMES[l.thematique] || '·'} · {dateFr(l.livre_le)}</dd></div>
                </dl>
                {g.message && <p className="ec-litige-msg">« {g.message} »</p>}
                {g.statut === 'en_attente' ? (
                  <>
                    <label className="ec-field"><span>Votre réponse au client (facultatif)</span><textarea rows={2} value={rep[g.id] || ''} onChange={(e) => setRep((r) => ({ ...r, [g.id]: e.target.value }))} maxLength={1000} /></label>
                    <div className="ec-litige-actions">
                      <span className="ec-muted">Stock {THEMES[l.thematique] ? THEMES[l.thematique].toLowerCase() : ''} : {stockDe(l.thematique)} lead(s)</span>
                      <button type="button" className="ec-btn ec-btn-no" disabled={busy === g.id} onClick={() => trancher(g, false)}>Refuser</button>
                      <button type="button" className="ec-btn ec-btn-ok" disabled={busy === g.id} onClick={() => trancher(g, true)}>Accepter et remplacer</button>
                    </div>
                  </>
                ) : (g.reponse || g.traite_le) && <p className="ec-note">Tranché le {dateHeure(g.traite_le)}{g.reponse ? ` · « ${g.reponse} »` : ''}{g.statut === 'accepte' ? (g.remplacement_id ? ' · remplacé' : ' · remplacement à livrer') : ''}</p>}
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}

// ─ Commandes ─
function Commandes({ data, apercu }) {
  const { commandes, leads, clients, reload } = data;
  const [tab, setTab] = useState('a_valider');
  const [form, setForm] = useState({});
  const [msg, setMsg] = useState('');
  const clientOf = useMemo(() => new Map((clients || []).map((c) => [c.user_id, c])), [clients]);
  const livresPar = useMemo(() => {
    const m = {};
    for (const l of leads || []) if (l.commande_id && !l.annule) m[l.commande_id] = (m[l.commande_id] || 0) + 1;
    return m;
  }, [leads]);
  const all = commandes || [];
  const lists = {
    a_valider: all.filter((c) => c.user_id && !c.bdc_numero && ['nouvelle', 'en_cours'].includes(c.statut)),
    ouvertes: all.filter((c) => c.statut === 'ouverte'),
    a_regler: all.filter((c) => c.approuve_le && !c.regle_le),
    site: all.filter((c) => !c.user_id),
    toutes: all.filter((c) => c.user_id),
  };
  const rows = lists[tab];
  const val = (c, k, d) => (form[c.id]?.[k] ?? d);
  const set = (c, k) => (e) => setForm((f) => ({ ...f, [c.id]: { ...f[c.id], [k]: e.target.value } }));
  async function run(fn, ok) {
    setMsg('');
    if (apercu) return;
    const { data: r, error } = await fn();
    if (error) { setMsg(errMsg(error)); return; }
    setMsg(typeof ok === 'function' ? ok(r) : ok);
    reload();
  }
  const valider = (c) => run(() => db.rpc('admin_approuver_commande', { p_commande: c.id, p_plafond: +val(c, 'plafond', parseInt(c.volume, 10) || 50), p_prix: +val(c, 'prix', PRIX[c.thematique] ?? 30) }), (n) => `Bon de commande ${n} émis : la commande est ouverte.`);
  // Après la livraison, le client est alerté selon ses préférences (lot 3 de la refonte de l'espace, 30/10/2026).
  const livrer = async (c) => {
    const depart = Date.now();
    await run(() => db.rpc('admin_livrer', { p_commande: c.id, p_n: +val(c, 'n', Math.max(0, (c.plafond || 0) - (livresPar[c.id] || 0))) }), (n) => `${n} lead(s) livré(s).`);
    if (apercu) return;
    const a = await alerterLivraison(c.id, depart);
    const lu = (v) => ({ envoye: 'envoyé', non_configure: 'non configuré', desactive: 'désactivé', aucun: 'aucun', aucun_appareil: 'aucun appareil', echec: 'échec' }[v] || String(v).replace('envoye_', 'envoyé ×').replace('refuse_', 'refusé '));
    if (a && a.leads) setMsg((m) => `${m} Alertes du client : e-mail ${lu(a.email)}, mobile ${lu(a.push)}, webhook ${lu(a.webhook)}.`);
  };
  const regler = (c) => run(() => db.from('commandes').update({ regle_le: new Date().toISOString() }).eq('id', c.id), 'Règlement enregistré.');
  const refuser = (c) => window.confirm('Refuser cette pré-commande ?') && run(() => db.from('commandes').update({ statut: 'refusee' }).eq('id', c.id), 'Pré-commande refusée.');
  return (
    <>
      <Head title="Commandes" sub="Validez les pré-commandes (le BDC est émis), livrez depuis le stock, enregistrez les règlements." />
      <div className="ec-tabs">{[['a_valider', 'À valider'], ['ouvertes', 'Ouvertes'], ['a_regler', 'À régler'], ['toutes', 'Toutes'], ['site', 'Demandes du site']].map(([k, t]) => (
        <button type="button" key={k} className={tab === k ? 'is-on' : ''} onClick={() => setTab(k)}>{t}{k === 'a_valider' && lists.a_valider.length > 0 && <b>{lists.a_valider.length}</b>}</button>
      ))}</div>
      {msg && <p className="ec-ok">{msg}</p>}
      {commandes && rows.length === 0 ? <div className="ec-card ec-empty"><p>Rien ici.</p></div> : (
        <div className="ec-card ec-table-wrap">
          <table className="ec-table">
            <thead><tr><th>Date</th><th>Client</th><th>BDC</th><th>Thématique</th><th>Zone</th><th>Avancement</th><th className="ec-num">Montant HT</th><th>Statut</th><th>Action</th></tr></thead>
            <tbody>
              {rows.map((c) => {
                const n = livresPar[c.id] || 0;
                const cl = clientOf.get(c.user_id);
                return (
                  <tr key={c.id}>
                    <td>{dateHeure(c.created_at)}</td>
                    <td><b>{cl?.societe || c.societe || '·'}</b>{!c.user_id && <small className="ec-block">{c.nom} · {c.telephone} · {c.email}</small>}</td>
                    <td>{c.bdc_numero || '·'}</td>
                    <td>{THEMES[c.thematique] || c.thematique || (c.souhait === 'accompagnement' ? 'Accompagnement' : '·')}</td>
                    <td className="ec-wrap">{c.zone || '·'}</td>
                    <td>{c.plafond ? `${n} / ${c.plafond}` : `${c.volume || '·'} demandés`}</td>
                    <td className="ec-num">{c.montant_ht != null ? <><b>{euro(c.montant_ht)}</b><small>{euro(c.montant_ht * (1 + TVA))} TTC</small></> : '·'}</td>
                    <td><span className={`ec-status is-${c.statut}`}>{c.regle_le ? 'Réglé' : CMD_STATUTS[c.statut] || c.statut}</span></td>
                    <td>
                      {tab === 'a_valider' && (
                        <div className="ec-actions">
                          <label>Leads<input type="number" min="1" value={val(c, 'plafond', parseInt(c.volume, 10) || 50)} onChange={set(c, 'plafond')} /></label>
                          <label>€ HT<input type="number" min="0" step="0.5" value={val(c, 'prix', PRIX[c.thematique] ?? 30)} onChange={set(c, 'prix')} /></label>
                          <button type="button" className="ec-btn" onClick={() => valider(c)}>Émettre le BDC</button>
                          <button type="button" className="ec-link-btn" onClick={() => refuser(c)}>Refuser</button>
                        </div>
                      )}
                      {tab === 'ouvertes' && (
                        <div className="ec-actions">
                          <label>Livrer<input type="number" min="1" value={val(c, 'n', Math.max(0, (c.plafond || 0) - n))} onChange={set(c, 'n')} /></label>
                          <button type="button" className="ec-btn" onClick={() => livrer(c)}>Livrer du stock</button>
                        </div>
                      )}
                      {tab === 'a_regler' && <button type="button" className="ec-btn ec-btn-ok" onClick={() => regler(c)}>Marquer réglé</button>}
                    </td>
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

// ─ Leads : stock et import CSV ─
const CHAMPS = ['thematique', 'prix_ht', 'recu_le', 'consentement_jusqu', 'prenom', 'nom', 'telephone', 'email', 'code_postal', 'ville', 'statut_occupation', 'type_logement', 'chauffage', 'surface', 'source'];
function parseCsv(text) {
  const lines = text.replace(/\r/g, '').split('\n').filter((l) => l.trim());
  if (lines.length < 2) return { rows: [], errors: ['Il faut une ligne d’en-tête et au moins une ligne.'] };
  const sep = (lines[0].match(/;/g) || []).length >= (lines[0].match(/,/g) || []).length ? ';' : ',';
  const split = (l) => { const out = []; let cur = ''; let q = false; for (const ch of l) { if (ch === '"') q = !q; else if (ch === sep && !q) { out.push(cur); cur = ''; } else cur += ch; } out.push(cur); return out.map((x) => x.trim()); };
  const head = split(lines[0]).map((h) => h.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z_]/g, '_'));
  const rows = []; const errors = [];
  lines.slice(1).forEach((l, i) => {
    const v = split(l); const r = {};
    head.forEach((h, k) => { if (CHAMPS.includes(h) && v[k]) r[h] = v[k]; });
    r.thematique = (r.thematique || '').toUpperCase();
    if (!THEMES[r.thematique]) { errors.push(`Ligne ${i + 2} : thématique « ${r.thematique || 'vide'} » inconnue (PAC, ITE ou PPV).`); return; }
    if (!r.telephone) { errors.push(`Ligne ${i + 2} : téléphone manquant.`); return; }
    r.prix_ht = r.prix_ht ? Number(String(r.prix_ht).replace(',', '.')) : PRIX[r.thematique];
    if (r.recu_le) { const d = new Date(r.recu_le.includes('/') ? r.recu_le.split(' ')[0].split('/').reverse().join('-') + (r.recu_le.split(' ')[1] ? `T${r.recu_le.split(' ')[1]}` : '') : r.recu_le); if (Number.isNaN(+d)) delete r.recu_le; else r.recu_le = d.toISOString(); }
    if (r.consentement_jusqu && r.consentement_jusqu.includes('/')) r.consentement_jusqu = r.consentement_jusqu.split('/').reverse().join('-');
    rows.push(r);
  });
  return { rows, errors };
}

function Leads({ data, apercu }) {
  const { leads, clients, reload } = data;
  const clientOf = useMemo(() => new Map((clients || []).map((c) => [c.user_id, c])), [clients]);
  const [tab, setTab] = useState('stock');
  const [text, setText] = useState('');
  const [msg, setMsg] = useState('');
  const parsed = useMemo(() => (text.trim() ? parseCsv(text) : null), [text]);
  const rows = (leads || []).filter((l) => (tab === 'stock' ? !l.client_id && !l.annule : tab === 'livres' ? l.client_id && !l.annule : l.annule)).slice(0, 300);
  async function importer() {
    if (!parsed?.rows.length) return;
    setMsg('');
    if (apercu) return;
    for (let i = 0; i < parsed.rows.length; i += 500) {
      const { error } = await db.from('leads').insert(parsed.rows.slice(i, i + 500));
      if (error) { setMsg(`Import arrêté à la ligne ${i + 2} : ${errMsg(error)}`); reload(); return; }
    }
    setMsg(`${parsed.rows.length} lead(s) ajouté(s) au stock.`);
    setText('');
    reload();
  }
  async function fichier(e) {
    const f = e.target.files?.[0];
    if (f) setText(await f.text());
  }
  return (
    <>
      <Head title="Leads" sub="Le stock alimente le Leads Shop et les livraisons sur commande." />
      <div className="ec-tabs">{[['stock', 'En stock'], ['livres', 'Livrés'], ['annules', 'Annulés (litiges)'], ['import', 'Importer']].map(([k, t]) => <button type="button" key={k} className={tab === k ? 'is-on' : ''} onClick={() => setTab(k)}>{t}</button>)}</div>
      {msg && <p className="ec-ok">{msg}</p>}
      {tab === 'import' ? (
        <div className="ec-card ec-form">
          <p className="ec-note" style={{ marginTop: 0 }}>Colonnes reconnues (première ligne) : {CHAMPS.join(', ')}. Obligatoires : thematique (PAC, ITE ou PPV) et telephone. Sans prix_ht, le prix du catalogue s’applique. Séparateur point-virgule ou virgule.</p>
          <label className="ec-field"><span>Fichier CSV</span><input type="file" accept=".csv,text/csv" onChange={fichier} /></label>
          <label className="ec-field"><span>Ou collez le contenu</span><textarea rows={8} value={text} onChange={(e) => setText(e.target.value)} placeholder="thematique;prenom;nom;telephone;email;code_postal" /></label>
          {parsed && <p className="ec-note"><b>{parsed.rows.length}</b> lead(s) prêts{parsed.errors.length ? `, ${parsed.errors.length} ligne(s) écartée(s)` : ''}.</p>}
          {parsed?.errors.length > 0 && <ul className="ec-errlist">{parsed.errors.slice(0, 20).map((x) => <li key={x}>{x}</li>)}</ul>}
          <button type="button" className="ec-btn" disabled={!parsed?.rows.length} onClick={importer}>Ajouter au stock</button>
        </div>
      ) : leads && rows.length === 0 ? <div className="ec-card ec-empty"><p>Aucun lead ici.</p></div> : (
        <div className="ec-card ec-table-wrap">
          <table className="ec-table">
            <thead><tr><th>Reçu le</th><th>Thématique</th><th className="ec-num">Prix HT</th><th>Prospect</th><th>Téléphone</th><th>Code postal</th><th>Consentement</th><th>Client</th></tr></thead>
            <tbody>{rows.map((l) => (
              <tr key={l.id}>
                <td>{dateHeure(l.recu_le)}</td><td>{THEMES[l.thematique]}</td><td className="ec-num">{euro(l.prix_ht)}</td>
                <td>{[l.prenom, l.nom].filter(Boolean).join(' ') || '·'}</td><td>{l.telephone || '·'}</td><td>{l.code_postal || '·'}</td>
                <td>{l.consentement_jusqu ? dateFr(l.consentement_jusqu) : '·'}</td><td>{l.client_id ? clientOf.get(l.client_id)?.societe || 'client' : <span className="ec-muted">Stock</span>}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </>
  );
}

// ─ Clients ─
function Shell({ session, apercu }) {
  const data = useAdminData(apercu);
  const [open, setOpen] = useState(false);
  const attente = (data.litiges || []).filter((g) => g.statut === 'en_attente').length;
  const aValider = (data.commandes || []).filter((c) => c.user_id && !c.bdc_numero && ['nouvelle', 'en_cours'].includes(c.statut)).length;
  const [nTickets, setNTickets] = useState(0);
  useEffect(() => {
    if (apercu) return undefined;
    const count = () => db.from('tickets').select('statut, dernier_client_le, vu_admin_le').eq('statut', 'ouvert')
      .then(({ data: t }) => setNTickets((t || []).filter((x) => x.dernier_client_le && (!x.vu_admin_le || x.dernier_client_le > x.vu_admin_le)).length));
    count();
    const i = setInterval(() => { if (!document.hidden) count(); }, 60000);
    return () => clearInterval(i);
  }, [apercu]);
  const aLancer = (data.commandes || []).filter((c) => c.user_id && c.type !== 'shop' && c.statut !== 'refusee' && ['recue', 'preparation'].includes(c.etape)).length;
  const alertes = attente + nTickets + aLancer;
  useEffect(() => { document.title = alertes ? `(${alertes}) Kairn Admin` : 'Kairn Admin'; }, [alertes]);
  const MENU = [
    { to: '/gestion', end: true, t: 'Tableau de bord', ico: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></> },
    { to: '/gestion/campagnes', t: 'Campagnes', n: aLancer, ico: <><path d="M3 11l18-8-8 18-2-8z" /></> },
    { to: '/gestion/tickets', t: 'Tickets', n: nTickets, ico: <><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" /></> },
    { to: '/gestion/litiges', t: 'Litiges', n: attente, ico: <><path d="M12 3v18M5 21h14M5 8l-3 6a3 3 0 0 0 6 0zM19 8l-3 6a3 3 0 0 0 6 0zM5 8h14" /></> },
    { to: '/gestion/commandes', t: 'Commandes', n: aValider, ico: <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" /></> },
    { to: '/gestion/leads', t: 'Leads', ico: <><circle cx="9" cy="8" r="4" /><path d="M2 21v-1a6 6 0 0 1 12 0v1M16 4a4 4 0 0 1 0 8M22 21v-1a6 6 0 0 0-4-5.6" /></> },
    { to: '/gestion/shop', t: 'Leads Shop', ico: <><path d="M6 6h15l-2 9H7z" /><circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M6 6 5 2H2" /></> },
    { to: '/gestion/clients', t: 'Clients', ico: <><path d="M3 21V7l9-4 9 4v14" /><path d="M9 21v-6h6v6" /></> },
    { to: '/gestion/contrats', t: 'Contrats', ico: <><path d="M6 2h9l5 5v15H6z" /><path d="M14 2v6h6M9 13h6M9 17h6" /></> },
    { to: '/gestion/factures', t: 'Factures', ico: <><rect x="4" y="2" width="16" height="20" rx="2" /><path d="M8 7h8M8 11h8M8 15h5" /></> },
  ];
  return (
    <div className={`ec${open ? ' is-open' : ''}`}>
      <header className="ec-top">
        <Link to="/gestion" className="brand"><KairnLogo />Kairn</Link>
        <span className="ec-company">Kairn Admin</span>
        <Link to="/gestion/litiges" className="ec-bell" style={{ marginLeft: 'auto' }} aria-label={`${attente} litige(s) en attente`}>
          <Ico><path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></Ico>{attente > 0 && <b>{attente}</b>}
        </Link>
        <span className="ec-avatar" style={{ marginLeft: 0 }} title={session.user.email}>UG</span>
        <button type="button" className="ec-burger" aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'} aria-expanded={open} onClick={() => setOpen((o) => !o)}><span /><span /></button>
      </header>
      <aside className="ec-side">
        <p className="ec-side-label">Gestion</p>
        <nav aria-label="Kairn Admin">
          {MENU.map((m) => (
            <NavLink key={m.to} to={m.to} end={m.end} className={({ isActive }) => `ec-link${isActive ? ' is-active' : ''}`} onClick={() => setOpen(false)}>
              <Ico>{m.ico}</Ico><span>{m.t}</span>{m.n > 0 && <span className="ec-badge">{m.n}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="ec-side-foot">
          <a href={MONITOR_URL} target="_blank" rel="noopener noreferrer" className="ec-btn gp-monitor">Ouvrir Kairn Monitor ↗</a>
          <button type="button" className="ec-logout" onClick={() => db.auth.signOut()}>Se déconnecter</button>
        </div>
      </aside>
      <main className="ec-main">
        {data.error && <p className="ec-err">{data.error}</p>}
        <Routes>
          <Route path="tickets" element={<TicketsAdmin data={data} apercu={apercu} onCount={setNTickets} />} />
          <Route index element={<Dashboard data={data} tickets={nTickets} />} />
          <Route path="campagnes" element={<Campagnes data={data} apercu={apercu} />} />
          <Route path="shop" element={<ShopAdmin data={data} apercu={apercu} />} />
          <Route path="contrats" element={<Bientot titre="Contrats" texte="Signature en ligne de chaque nouveau client, à venir. Le format (une fois par client ou à chaque campagne) est à valider avec votre avocat." />} />
          <Route path="factures" element={<Bientot titre="Factures" texte="Factures conformes générées par Pennylane, à brancher quand votre compte sera créé. En attendant, les bons de commande et leur règlement sont dans Commandes." />} />
          <Route path="litiges" element={<Litiges data={data} apercu={apercu} />} />
          <Route path="commandes" element={<Commandes data={data} apercu={apercu} />} />
          <Route path="leads" element={<Leads data={data} apercu={apercu} />} />
          <Route path="clients" element={<Clients data={data} apercu={apercu} />} />
          <Route path="clients/:id" element={<FicheClient data={data} apercu={apercu} />} />
          <Route path="*" element={<Dashboard data={data} tickets={nTickets} />} />
        </Routes>
      </main>
    </div>
  );
}

function Login({ denied }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  async function submit(e) {
    e.preventDefault();
    setError('');
    const { error: err } = await db.auth.signInWithPassword({ email: email.trim(), password });
    if (err) setError('E-mail ou mot de passe incorrect.');
  }
  return (
    <div className="ec-login">
      <div className="aurora-grid" aria-hidden="true" />
      <form className="ec-login-card" onSubmit={submit}>
        <span className="brand"><KairnLogo />Kairn</span>
        <h1>Kairn Admin</h1>
        {denied ? (
          <><p>Ce compte n’a pas accès à l’administration.</p><button type="button" className="ec-btn" onClick={() => db.auth.signOut()}>Changer de compte</button></>
        ) : (
          <>
            <p>Espace de gestion réservé à Kairn.</p>
            <label><span>E-mail</span><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" /></label>
            <label><span>Mot de passe</span><input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" /></label>
            {error && <p className="ec-err" role="alert">{error}</p>}
            <button type="submit" className="ec-btn">Se connecter</button>
          </>
        )}
      </form>
    </div>
  );
}

export default function Gestion() {
  useV2Favicon();
  const [session, setSession] = useState(undefined);
  const [admin, setAdmin] = useState(undefined);
  useEffect(() => {
    db.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = db.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);
  useEffect(() => {
    if (!session) { setAdmin(undefined); return; }
    db.rpc('is_admin').then(({ data }) => setAdmin(Boolean(data)));
  }, [session]);
  const apercu = useMemo(() => import.meta.env.DEV && new URLSearchParams(window.location.search).has('apercu'), []);
  let body;
  if (apercu) body = <Shell session={{ user: { email: 'ugo@exemple.fr' } }} apercu />;
  else if (session === undefined || (session && admin === undefined)) body = <div className="ec-loading" aria-busy="true" />;
  else if (!session) body = <Login />;
  else if (!admin) body = <Login denied />;
  else body = <Shell session={session} />;
  return <div className="v2 v3 ec-root">{body}</div>;
}
