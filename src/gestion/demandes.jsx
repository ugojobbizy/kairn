import React, { useState } from 'react';
import { db, dateHeure, errMsg } from '../espace/db.js';

// Demandes du site (22/11/2026, demande d'Ugo) : ce qui arrive du site public sans compte client.
// - le formulaire Commander (table commandes, sans user_id) ;
// - les numéros laissés dans la réservation d'appel, étapes 1 et 2 (table leads_site).
// Une demande reste « à rappeler » tant que traite_le est vide.

const SOUHAITS = { leads: 'Acheter des leads', accompagnement: 'Être accompagné' };

export const commandesSite = (commandes) => (commandes || []).filter((c) => !c.user_id && c.statut !== 'refusee');
export const nbDemandesSite = (data) => commandesSite(data.commandes).filter((c) => !c.traite_le).length
  + (data.leadsSite || []).filter((l) => !l.traite_le).length;

export function Demandes({ data, apercu }) {
  const { commandes, leadsSite, reload } = data;
  const [tab, setTab] = useState('a_traiter');
  const [msg, setMsg] = useState('');
  const keep = (x) => (tab === 'a_traiter' ? !x.traite_le : !!x.traite_le);
  const cmds = commandesSite(commandes).filter(keep);
  const nums = (leadsSite || []).filter(keep);
  const nAll = nbDemandesSite(data);

  async function marquer(table, id, fait) {
    setMsg('');
    if (apercu) { setMsg('Aperçu : rien n’est enregistré.'); return; }
    const { error } = await db.from(table).update({ traite_le: fait ? new Date().toISOString() : null }).eq('id', id);
    if (error) { setMsg(errMsg(error)); return; }
    reload();
  }
  const bouton = (table, x) => (x.traite_le
    ? <button type="button" className="ec-link-btn" onClick={() => marquer(table, x.id, false)}>Remettre à rappeler</button>
    : <button type="button" className="ec-btn ec-btn-ok" onClick={() => marquer(table, x.id, true)}>Marquer traité</button>);
  const tel = (t) => (t ? <a href={`tel:${t}`}>{t}</a> : '·');

  return (
    <>
      <header className="ec-head"><div><h1>Demandes du site</h1><p>Ce qui arrive du site sans compte client : le formulaire Commander et les numéros laissés pour réserver un appel. Rappelez, puis marquez traité.</p></div></header>
      <div className="ec-tabs">{[['a_traiter', 'À rappeler'], ['traitees', 'Traitées']].map(([k, t]) => (
        <button type="button" key={k} className={tab === k ? 'is-on' : ''} onClick={() => setTab(k)}>{t}{k === 'a_traiter' && nAll > 0 && <b>{nAll}</b>}</button>
      ))}</div>
      {msg && <p className="ec-ok">{msg}</p>}

      <p className="ec-label">Formulaire Commander ({cmds.length})</p>
      {commandes && cmds.length === 0 ? <div className="ec-card ec-empty"><p>Rien ici.</p></div> : (
        <div className="ec-card ec-table-wrap">
          <table className="ec-table">
            <thead><tr><th>Date</th><th>Société</th><th>Contact</th><th>Demande</th><th>Zone</th><th>Arrivé par</th><th>Action</th></tr></thead>
            <tbody>
              {cmds.map((c) => (
                <tr key={c.id}>
                  <td>{dateHeure(c.created_at)}</td>
                  <td><b>{c.societe || '·'}</b>{c.siret && <small className="ec-block">SIRET {c.siret}</small>}</td>
                  <td>{c.nom || '·'}<small className="ec-block">{tel(c.telephone)} · {c.email || '·'}</small></td>
                  <td>{SOUHAITS[c.souhait] || c.souhait || '·'}<small className="ec-block">{[c.thematique, c.volume && `${c.volume} par semaine`].filter(Boolean).join(' · ') || '·'}</small></td>
                  <td className="ec-wrap">{c.zone || '·'}</td>
                  <td className="ec-wrap"><small>{c.source || '·'}</small></td>
                  <td>{bouton('commandes', c)}{c.traite_le && <small className="ec-block">Traité le {dateHeure(c.traite_le)}</small>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="ec-label">Numéros laissés pour réserver un appel ({nums.length})</p>
      {leadsSite && nums.length === 0 ? <div className="ec-card ec-empty"><p>Rien ici.</p></div> : (
        <div className="ec-card ec-table-wrap">
          <table className="ec-table">
            <thead><tr><th>Date</th><th>Téléphone</th><th>Coordonnées</th><th>Créneau</th><th>Page</th><th>Arrivé par</th><th>Action</th></tr></thead>
            <tbody>
              {nums.map((l) => (
                <tr key={l.id}>
                  <td>{dateHeure(l.created_at)}</td>
                  <td><b>{tel(l.phone)}</b></td>
                  <td>{[l.first_name, l.company].filter(Boolean).join(' · ') || <span className="ec-muted">Numéro seul</span>}{l.email && <small className="ec-block">{l.email}</small>}</td>
                  <td>{l.slot ? dateHeure(l.slot) : <span className="ec-muted">Aucun</span>}</td>
                  <td className="ec-wrap">{l.page || '·'}{l.utm_source && <small className="ec-block">utm : {[l.utm_source, l.utm_campaign, l.utm_content].filter(Boolean).join(' / ')}</small>}</td>
                  <td className="ec-wrap"><small>{l.source || '·'}</small></td>
                  <td>{bouton('leads_site', l)}{l.traite_le && <small className="ec-block">Traité le {dateHeure(l.traite_le)}</small>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
