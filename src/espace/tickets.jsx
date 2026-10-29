import React, { useCallback, useEffect, useRef, useState } from 'react';
import { db, dateHeure, errMsg, notifier } from './db.js';

// Bulle de discussion de l'espace client (Ugo, 29/10/2026 : « les clients doivent pouvoir me contacter en cas d'urgence,
// un petit logo discussion pour ouvrir un ticket »). Un ticket = un sujet et des messages ; chaque message du client
// déclenche une alerte Telegram (api/notif.js). Ugo répond depuis Kairn Admin, Tickets.

function Bubble() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" /><path d="M8.5 11h7M8.5 14h4" /></svg>;
}

export default function Tickets({ session }) {
  const [open, setOpen] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [cur, setCur] = useState(null); // ticket ouvert, ou 'new'
  const [msgs, setMsgs] = useState([]);
  const [sujet, setSujet] = useState('');
  const [texte, setTexte] = useState('');
  const [urgent, setUrgent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const end = useRef(null);

  const load = useCallback(async () => {
    const { data } = await db.from('tickets').select('*').eq('client_id', session.user.id).order('maj_le', { ascending: false });
    setTickets(data || []);
  }, [session.user.id]);
  const loadMsgs = useCallback(async (id) => {
    const { data } = await db.from('ticket_messages').select('*').eq('ticket_id', id).order('created_at');
    setMsgs(data || []);
  }, []);
  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    if (!open) return undefined;
    load();
    const t = setInterval(() => { load(); if (cur && cur !== 'new') loadMsgs(cur.id); }, 30000);
    return () => clearInterval(t);
  }, [open, cur, load, loadMsgs]);
  useEffect(() => { end.current?.scrollIntoView({ block: 'end' }); }, [msgs]);

  // une réponse de Kairn plus récente que la dernière visite du client = non lue
  const nonLus = tickets.filter((t) => t.statut === 'ouvert' && t.repondu_le && (!t.vu_client_le || t.repondu_le > t.vu_client_le)).length;

  async function ouvrir(t) {
    setCur(t); setError(''); setTexte('');
    await loadMsgs(t.id);
    db.rpc('ticket_vu', { p_ticket: t.id });
  }
  async function creer(e) {
    e.preventDefault();
    if (!sujet.trim() || !texte.trim()) { setError('Indiquez un sujet et votre message.'); return; }
    setBusy(true); setError('');
    const { data: t, error: err } = await db.from('tickets').insert({ sujet: sujet.trim().slice(0, 160), urgent }).select().single();
    if (err) { setBusy(false); setError(errMsg(err)); return; }
    const { error: err2 } = await db.from('ticket_messages').insert({ ticket_id: t.id, texte: texte.trim().slice(0, 4000) });
    setBusy(false);
    if (err2) { setError(errMsg(err2)); return; }
    notifier('ticket', t.id);
    setSujet(''); setTexte(''); setUrgent(false);
    await load();
    ouvrir(t);
  }
  async function repondre(e) {
    e.preventDefault();
    if (!texte.trim()) return;
    setBusy(true); setError('');
    const { error: err } = await db.from('ticket_messages').insert({ ticket_id: cur.id, texte: texte.trim().slice(0, 4000) });
    setBusy(false);
    if (err) { setError(errMsg(err)); return; }
    notifier('ticket', cur.id);
    setTexte('');
    loadMsgs(cur.id);
  }

  return (
    <>
      <button type="button" className={`tk-fab${open ? ' is-open' : ''}`} onClick={() => setOpen((o) => !o)} aria-label={open ? 'Fermer la discussion' : 'Contacter Kairn'} aria-expanded={open}>
        {open ? <span aria-hidden="true">×</span> : <Bubble />}
        {!open && nonLus > 0 && <b>{nonLus}</b>}
      </button>
      {open && (
        <div className="tk-panel" role="dialog" aria-label="Contacter Kairn">
          <header className="tk-head">
            {cur ? <button type="button" className="tk-back" onClick={() => { setCur(null); load(); }}>‹ Mes demandes</button> : <b>Contacter Kairn</b>}
            <span>Réponse d’Ugo dans la journée</span>
          </header>

          {!cur && (
            <div className="tk-body">
              <button type="button" className="ec-btn tk-new" onClick={() => { setCur('new'); setError(''); }}>Nouvelle demande</button>
              {tickets.length === 0 ? <p className="tk-empty">Une question, un problème sur un lead, une urgence ? Écrivez ici : Ugo est prévenu tout de suite.</p> : (
                <ul className="tk-list">
                  {tickets.map((t) => (
                    <li key={t.id}><button type="button" onClick={() => ouvrir(t)}>
                      <b>{t.urgent && <em>Urgent</em>}{t.sujet}</b>
                      <span>{t.statut === 'ferme' ? 'Fermée' : t.repondu_le && (!t.vu_client_le || t.repondu_le > t.vu_client_le) ? 'Nouvelle réponse' : 'Ouverte'} · {dateHeure(t.maj_le)}</span>
                    </button></li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {cur === 'new' && (
            <form className="tk-body tk-form" onSubmit={creer}>
              <label><span>Sujet</span><input value={sujet} onChange={(e) => setSujet(e.target.value)} maxLength={160} placeholder="Ex. Un lead ne répond pas" /></label>
              <label><span>Message</span><textarea rows={5} value={texte} onChange={(e) => setTexte(e.target.value)} maxLength={4000} /></label>
              <label className="tk-urgent"><input type="checkbox" checked={urgent} onChange={(e) => setUrgent(e.target.checked)} />C’est urgent</label>
              {error && <p className="ec-err">{error}</p>}
              <button type="submit" className="ec-btn" disabled={busy}>{busy ? 'Envoi…' : 'Envoyer'}</button>
            </form>
          )}

          {cur && cur !== 'new' && (
            <>
              <div className="tk-body tk-thread">
                <p className="tk-subject">{cur.urgent && <em>Urgent</em>}{cur.sujet}</p>
                {msgs.map((m) => (
                  <div key={m.id} className={`tk-msg${m.de_kairn ? ' is-kairn' : ''}`}>
                    <p>{m.texte}</p>
                    <span>{m.de_kairn ? 'Ugo · Kairn' : 'Vous'} · {dateHeure(m.created_at)}</span>
                  </div>
                ))}
                <div ref={end} />
              </div>
              {cur.statut === 'ferme' ? <p className="tk-closed">Demande fermée. Ouvrez-en une nouvelle si besoin.</p> : (
                <form className="tk-reply" onSubmit={repondre}>
                  <textarea rows={2} value={texte} onChange={(e) => setTexte(e.target.value)} maxLength={4000} placeholder="Votre message" />
                  <button type="submit" className="ec-btn" disabled={busy || !texte.trim()}>Envoyer</button>
                </form>
              )}
              {error && <p className="ec-err" style={{ padding: '0 16px 12px' }}>{error}</p>}
            </>
          )}
        </div>
      )}
    </>
  );
}
