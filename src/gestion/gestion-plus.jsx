import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { db, THEMES, ETAPES, euro, dateFr, dateHeure, errMsg } from '../espace/db.js';

// Kairn Admin, suite (29/10/2026, demandes d'Ugo) : suivi des campagnes par client (4 étapes, « campagne lancée » au clic),
// tickets des clients avec réponse, gestion du Leads Shop (hors zone remis en vente, prix, retrait).

const PRIX = { PAC: 28, ITE: 27, PPV: 35 };

// ─ Campagnes : suivi par client ─
export function Campagnes({ data, apercu }) {
  const { commandes, clients, leads, reload } = data;
  const [msg, setMsg] = useState('');
  const [f, setF] = useState({});
  const livresPar = useMemo(() => {
    const m = {};
    for (const l of leads || []) if (l.commande_id && !l.annule) m[l.commande_id] = (m[l.commande_id] || 0) + 1;
    return m;
  }, [leads]);
  const parClient = useMemo(() => {
    const m = new Map();
    for (const c of commandes || []) {
      if (!c.user_id || c.type === 'shop' || c.statut === 'refusee') continue;
      if (!m.has(c.user_id)) m.set(c.user_id, []);
      m.get(c.user_id).push(c);
    }
    return [...m.entries()].map(([uid, list]) => ({ uid, client: (clients || []).find((k) => k.user_id === uid), list }))
      .sort((a, b) => {
        const rank = (x) => Math.min(...x.list.map((c) => ETAPES.findIndex(([e]) => e === c.etape)));
        return rank(a) - rank(b);
      });
  }, [commandes, clients]);
  async function run(fn, ok) {
    setMsg('');
    if (apercu) return;
    const { data: r, error } = await fn();
    if (error) { setMsg(errMsg(error)); return; }
    setMsg(typeof ok === 'function' ? ok(r) : ok);
    reload();
  }
  const val = (c, k, d) => (f[c.id]?.[k] ?? d);
  const set = (c, k) => (e) => setF((x) => ({ ...x, [c.id]: { ...x[c.id], [k]: e.target.value } }));
  const etape = (c, e) => run(() => db.rpc('admin_etape', { p_commande: c.id, p_etape: e }), e === 'lancee' ? 'Campagne lancée : le client le voit dans son espace.' : 'Étape mise à jour.');
  const bdc = (c) => run(() => db.rpc('admin_approuver_commande', { p_commande: c.id, p_plafond: +val(c, 'plafond', parseInt(c.volume, 10) || 50), p_prix: +val(c, 'prix', PRIX[c.thematique] ?? 30) }), (n) => `Bon de commande ${n} émis.`);
  return (
    <>
      <header className="ec-head ec-head-row"><div><h1>Campagnes</h1><p>Chaque commande d’un client est une campagne à lancer. Faites-la avancer : le client voit l’étape dans son espace.</p></div></header>
      {msg && <p className="ec-ok">{msg}</p>}
      {commandes && parClient.length === 0 && <div className="ec-card ec-empty"><p>Aucune commande client pour l’instant.</p></div>}
      <div className="gp-clients">
        {parClient.map(({ uid, client, list }) => (
          <section className="ec-card gp-client" key={uid}>
            <header><b>{client?.societe || list[0].societe || 'Client'}</b><span>{[client?.prenom, client?.telephone, list[0].email].filter(Boolean).join(' · ')}</span></header>
            {list.map((c0) => {
              const c = { ...c0, etape: c0.etape || 'recue' };
              const k = Math.max(0, ETAPES.findIndex(([e]) => e === c.etape));
              const n = livresPar[c.id] || 0;
              return (
                <div className="gp-camp" key={c.id}>
                  <div className="gp-camp-top">
                    <b>{THEMES[c.thematique] || c.thematique} · {c.plafond || c.volume} leads</b>
                    <span>{c.zone ? `Zone : ${c.zone} · ` : ''}reçue le {dateFr(c.created_at)}{c.bdc_numero ? ` · ${c.bdc_numero}` : ''}{c.plafond ? ` · ${n}/${c.plafond} livrés` : ''}</span>
                  </div>
                  <ol className="ec-steps">{ETAPES.map(([e, t], i) => <li key={e} className={i < k ? 'is-done' : i === k ? 'is-now' : ''}><i />{t}</li>)}</ol>
                  <div className="ec-actions gp-acts">
                    {!c.bdc_numero && (
                      <>
                        <label>Leads<input type="number" min="1" value={val(c, 'plafond', parseInt(c.volume, 10) || 50)} onChange={set(c, 'plafond')} /></label>
                        <label>€ HT<input type="number" min="0" step="0.5" value={val(c, 'prix', PRIX[c.thematique] ?? 30)} onChange={set(c, 'prix')} /></label>
                        <button type="button" className="ec-btn-ghost" onClick={() => bdc(c)}>Émettre le BDC</button>
                      </>
                    )}
                    {c.etape === 'recue' && <button type="button" className="ec-btn-ghost" onClick={() => etape(c, 'preparation')}>En préparation</button>}
                    {['recue', 'preparation'].includes(c.etape) && <button type="button" className="ec-btn ec-btn-ok" onClick={() => etape(c, 'lancee')}>Campagne lancée</button>}
                    {c.etape === 'lancee' && <button type="button" className="ec-btn-ghost" onClick={() => etape(c, 'terminee')}>Terminer</button>}
                    {c.etape !== 'recue' && <button type="button" className="ec-link-btn" onClick={() => etape(c, ETAPES[k - 1][0])}>Étape précédente</button>}
                  </div>
                </div>
              );
            })}
          </section>
        ))}
      </div>
    </>
  );
}

// ─ Tickets ─
export function TicketsAdmin({ data, apercu, onCount }) {
  const { clients } = data;
  const [tickets, setTickets] = useState(null);
  const [cur, setCur] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [texte, setTexte] = useState('');
  const [tab, setTab] = useState('ouvert');
  const [error, setError] = useState('');
  const load = useCallback(async () => {
    if (apercu) { setTickets([]); return; }
    const { data: t } = await db.from('tickets').select('*').order('maj_le', { ascending: false });
    setTickets(t || []);
  }, [apercu]);
  useEffect(() => { load(); const i = setInterval(load, 60000); return () => clearInterval(i); }, [load]);
  useEffect(() => { onCount?.((tickets || []).filter((t) => t.statut === 'ouvert' && t.dernier_client_le && (!t.vu_admin_le || t.dernier_client_le > t.vu_admin_le)).length); }, [tickets, onCount]);
  async function ouvrir(t) {
    setCur(t); setError(''); setTexte('');
    const { data: m } = await db.from('ticket_messages').select('*').eq('ticket_id', t.id).order('created_at');
    setMsgs(m || []);
    await db.rpc('ticket_vu', { p_ticket: t.id });
    load();
  }
  async function repondre(e) {
    e.preventDefault();
    if (!texte.trim()) return;
    const { data: { session } } = await db.auth.getSession();
    const { error: err } = await db.from('ticket_messages').insert({ ticket_id: cur.id, auteur: session.user.id, de_kairn: true, texte: texte.trim().slice(0, 4000) });
    if (err) { setError(errMsg(err)); return; }
    setTexte('');
    ouvrir(cur);
  }
  async function fermer(t, statut) {
    await db.from('tickets').update({ statut }).eq('id', t.id);
    setCur({ ...t, statut });
    load();
  }
  const nom = (uid) => (clients || []).find((c) => c.user_id === uid)?.societe || 'Client';
  const nonLu = (t) => t.statut === 'ouvert' && t.dernier_client_le && (!t.vu_admin_le || t.dernier_client_le > t.vu_admin_le);
  const rows = (tickets || []).filter((t) => (tab === 'tous' ? true : t.statut === tab));
  return (
    <>
      <header className="ec-head ec-head-row"><div><h1>Tickets</h1><p>Les messages des clients, envoyés depuis la bulle de leur espace. Chaque message vous arrive aussi sur Telegram.</p></div></header>
      <div className="ec-tabs">{[['ouvert', 'Ouverts'], ['ferme', 'Fermés'], ['tous', 'Tous']].map(([k, t]) => <button type="button" key={k} className={tab === k ? 'is-on' : ''} onClick={() => setTab(k)}>{t}{k === 'ouvert' && (tickets || []).some(nonLu) && <b>{tickets.filter(nonLu).length}</b>}</button>)}</div>
      <div className="gp-tickets">
        <div className="ec-card gp-tlist">
          {tickets && rows.length === 0 && <p className="ec-muted">Aucun ticket.</p>}
          {rows.map((t) => (
            <button type="button" key={t.id} className={`gp-t${cur?.id === t.id ? ' is-on' : ''}`} onClick={() => ouvrir(t)}>
              <b>{nonLu(t) && <i className="gp-dot" />}{t.urgent && <em>Urgent</em>}{t.sujet}</b>
              <span>{nom(t.client_id)} · {dateHeure(t.maj_le)}</span>
            </button>
          ))}
        </div>
        <div className="ec-card gp-tview">
          {!cur ? <p className="ec-muted">Choisissez un ticket.</p> : (
            <>
              <div className="gp-tview-head"><div><b>{cur.urgent && <em>Urgent</em>}{cur.sujet}</b><span>{nom(cur.client_id)}</span></div>
                {cur.statut === 'ouvert' ? <button type="button" className="ec-btn-ghost" onClick={() => fermer(cur, 'ferme')}>Fermer</button> : <button type="button" className="ec-btn-ghost" onClick={() => fermer(cur, 'ouvert')}>Rouvrir</button>}
              </div>
              <div className="tk-thread gp-thread">
                {msgs.map((m) => <div key={m.id} className={`tk-msg${m.de_kairn ? '' : ' is-kairn'}`}><p>{m.texte}</p><span>{m.de_kairn ? 'Vous' : nom(cur.client_id)} · {dateHeure(m.created_at)}</span></div>)}
              </div>
              {cur.statut === 'ouvert' && (
                <form className="tk-reply" onSubmit={repondre}>
                  <textarea rows={3} value={texte} onChange={(e) => setTexte(e.target.value)} maxLength={4000} placeholder="Votre réponse au client" />
                  <button type="submit" className="ec-btn" disabled={!texte.trim()}>Répondre</button>
                </form>
              )}
              {error && <p className="ec-err">{error}</p>}
            </>
          )}
        </div>
      </div>
    </>
  );
}

// ─ Leads Shop ─
export function ShopAdmin({ data, apercu }) {
  const { leads, clients, commandes, reload } = data;
  const [tab, setTab] = useState('vente');
  const [prix, setPrix] = useState({});
  const [msg, setMsg] = useState('');
  const clientOf = (uid) => (clients || []).find((c) => c.user_id === uid)?.societe || '·';
  const shopCmd = new Set((commandes || []).filter((c) => c.type === 'shop').map((c) => c.id));
  // Shop : seulement les copies remises en vente après un litige accepté (hors zone ou doublon, 4 € de moins ; Ugo, 30/10/2026).
  const enStock = (leads || []).filter((l) => !l.client_id && !l.annule && l.deja_transmis);
  const rows = tab === 'vente' ? enStock.filter((l) => l.en_vente) : tab === 'retires' ? enStock.filter((l) => !l.en_vente) : (leads || []).filter((l) => shopCmd.has(l.commande_id));
  async function maj(l, patch, ok) {
    setMsg('');
    if (apercu) return;
    const { error } = await db.from('leads').update(patch).eq('id', l.id);
    if (error) { setMsg(errMsg(error)); return; }
    setMsg(ok); reload();
  }
  const ventes = (leads || []).filter((l) => shopCmd.has(l.commande_id));
  return (
    <>
      <header className="ec-head ec-head-row"><div><h1>Leads Shop</h1><p>Les leads hors zone ou en doublon acceptés en litige y reviennent seuls, 4 € moins chers, jamais proposés au client qui les a signalés. Vous pouvez changer un prix ou retirer un lead.</p></div></header>
      <div className="ec-kpis">
        <div className="ec-kpi"><b>En vente</b><span>Visibles par les clients</span><strong>{enStock.filter((l) => l.en_vente).length}</strong></div>
        <div className="ec-kpi"><b>Retirés</b><span>Masqués aux clients</span><strong>{enStock.filter((l) => !l.en_vente).length}</strong></div>
        <div className="ec-kpi"><b>Vendus au Shop</b><span>Toutes périodes, HT</span><strong>{euro(ventes.reduce((s, l) => s + Number(l.prix_ht), 0))}</strong></div>
      </div>
      <div className="ec-tabs">{[['vente', 'En vente'], ['retires', 'Retirés'], ['vendus', 'Vendus']].map(([k, t]) => <button type="button" key={k} className={tab === k ? 'is-on' : ''} onClick={() => setTab(k)}>{t}</button>)}</div>
      {msg && <p className="ec-ok">{msg}</p>}
      {leads && rows.length === 0 ? <div className="ec-card ec-empty"><p>Rien ici.</p></div> : (
        <div className="ec-card ec-table-wrap">
          <table className="ec-table">
            <thead><tr><th>Reçu le</th><th>Thématique</th><th>Code postal</th><th>Origine</th><th className="ec-num">Prix HT</th><th>{tab === 'vendus' ? 'Acheteur' : 'Action'}</th></tr></thead>
            <tbody>{rows.slice(0, 300).map((l) => (
              <tr key={l.id}>
                <td>{dateHeure(l.recu_le)}</td><td>{THEMES[l.thematique]}</td><td>{l.code_postal || '·'}</td>
                <td>{l.source === 'shop_doublon' ? 'Doublon' : 'Hors zone'}</td>
                <td className="ec-num">{tab === 'vendus' ? euro(l.prix_ht) : (
                  <span className="ec-actions gp-price"><input type="number" min="0" step="0.5" value={prix[l.id] ?? l.prix_ht} onChange={(e) => setPrix((p) => ({ ...p, [l.id]: e.target.value }))} />
                    {prix[l.id] != null && +prix[l.id] !== +l.prix_ht && <button type="button" className="ec-link-btn" onClick={() => maj(l, { prix_ht: +prix[l.id] }, 'Prix mis à jour.')}>OK</button>}</span>
                )}</td>
                <td>{tab === 'vendus' ? clientOf(l.client_id) : tab === 'vente'
                  ? <button type="button" className="ec-link-btn" onClick={() => maj(l, { en_vente: false }, 'Lead retiré du Shop.')}>Retirer</button>
                  : <button type="button" className="ec-link-btn" onClick={() => maj(l, { en_vente: true }, 'Lead remis en vente.')}>Remettre en vente</button>}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </>
  );
}

export function Bientot({ titre, texte }) {
  return (
    <>
      <header className="ec-head"><h1>{titre}</h1></header>
      <div className="ec-card ec-empty"><p>{texte}</p></div>
    </>
  );
}
