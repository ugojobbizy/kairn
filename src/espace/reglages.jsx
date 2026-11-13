import React, { useEffect, useState } from 'react';
import { db } from './db.js';
import { useData } from './data.js';
import { useModeles, variables, LIBELLES } from './modeles.js';
import { MAX_APPELS, PLAN_DEFAUT, planDe, planValide, remplir, VARIABLES } from './relance.js';

// Réglages du bloc 1 « vitesse et relance » (12/11/2026), dans Mon compte : plan de relance des NRP et modèles de SMS.

const MOMENTS = [['reception', 'Dès réception'], ['10:00', '10 h'], ['10:30', '10 h 30'], ['11:30', '11 h 30'], ['12:15', '12 h 15'], ['14:00', '14 h'], ['15:00', '15 h'], ['17:00', '17 h'], ['18:00', '18 h'], ['19:00', '19 h']];
const JOURS = [1, 2, 3, 4, 5];
const libJour = (j) => (j === 1 ? 'Jour de la demande' : `${j}e jour d’appel`);

export function PlanRelance({ session, apercu }) {
  const { prefs, setPrefs } = useData();
  const [plan, setPlan] = useState(() => planDe(prefs));
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  useEffect(() => { setPlan(planDe(prefs)); }, [prefs]);
  const perso = Boolean(prefs?.plan_relance);
  const maj = (i, k, v) => setPlan((p) => p.map((x, n) => (n === i ? { ...x, [k]: k === 'j' ? Number(v) : v } : x)));
  async function enregistrer(next) {
    setMsg(''); setErr('');
    const tri = next ? [...next].sort((a, b) => a.j - b.j || (a.h === 'reception' ? -1 : b.h === 'reception' ? 1 : a.h.localeCompare(b.h))) : null;
    if (tri && !planValide(tri)) { setErr(`Le plan compte de 1 à ${MAX_APPELS} appels, du jour de la demande au 5e jour d’appel.`); return; }
    if (!apercu) {
      const { error } = await db.from('client_prefs').upsert({ user_id: session.user.id, plan_relance: tri, maj_le: new Date().toISOString() });
      if (error) { setErr('L’enregistrement n’a pas abouti. Réessayez.'); return; }
    }
    setPrefs({ ...(prefs || {}), plan_relance: tri });
    setMsg(tri ? 'Plan enregistré. Il s’applique aux prochains appels sans réponse.' : 'Plan Kairn rétabli.');
  }
  return (
    <div className="ec-card ec-plan" id="plan">
      <h2>Plan de relance des contacts injoignables</h2>
      <p className="ec-muted">Quand vous notez « Pas de réponse », le prochain appel est programmé selon ce plan et apparaît dans Ma journée au bon moment. {MAX_APPELS} appels au plus, toujours dans les horaires autorisés (lundi au vendredi hors fériés, 10 h à 13 h et 14 h à 20 h) et avant la fin du délai légal de 5 jours ouvrables.</p>
      <ol className="ec-plan-list">
        {plan.map((x, i) => (
          <li key={i}>
            <b>Appel {i + 1}</b>
            <select value={x.j} onChange={(e) => maj(i, 'j', e.target.value)} aria-label={`Jour de l’appel ${i + 1}`}>{JOURS.map((j) => <option key={j} value={j}>{libJour(j)}</option>)}</select>
            <select value={x.h} onChange={(e) => maj(i, 'h', e.target.value)} aria-label={`Heure de l’appel ${i + 1}`}>{MOMENTS.map(([v, t]) => <option key={v} value={v}>{t}</option>)}</select>
            {plan.length > 1 && <button type="button" className="ec-link-btn" onClick={() => setPlan((p) => p.filter((_, n) => n !== i))}>Retirer</button>}
          </li>
        ))}
      </ol>
      {plan.length < MAX_APPELS && <button type="button" className="ec-link-btn" onClick={() => setPlan((p) => [...p, { j: Math.min(5, (p[p.length - 1]?.j || 1) + 1), h: '18:00' }])}>+ Ajouter un appel</button>}
      {err && <p className="ec-err" role="alert">{err}</p>}
      {msg && <p className="ec-ok">{msg}</p>}
      <div className="ec-alertes-actions">
        <button type="button" className="ec-btn" onClick={() => enregistrer(plan)}>Enregistrer le plan</button>
        {perso && <button type="button" className="ec-btn-ghost" onClick={() => enregistrer(null)}>Revenir au plan Kairn</button>}
      </div>
      <p className="ec-small">Plan Kairn : {PLAN_DEFAUT.map((x) => `${x.j === 1 ? 'J1' : `J${x.j}`} ${x.h === 'reception' ? 'dès réception' : x.h.replace(/:00$/, ' h').replace(':', ' h ')}`).join(', ')}.</p>
    </div>
  );
}

// Modèles de SMS et d'e-mail (canal), même liste que dans la fenêtre d'un contact.
export function ModelesMessages({ canal, client, apercu }) {
  const { liste, perso, enregistrer, supprimer, retablir } = useModeles(canal, apercu);
  const email = canal === 'email';
  const [edit, setEdit] = useState(null); // { id?, titre, objet, texte }
  const [err, setErr] = useState('');
  const exemple = variables({ prenom: 'Marie', thematique: 'PAC', ville: 'Mérignac' }, client, { rdv_le: new Date(Date.now() + 86400000).setHours(14, 30, 0, 0) });
  async function sauver(e) {
    e.preventDefault(); setErr('');
    const titre = edit.titre.trim(); const texte = edit.texte.trim();
    if (!titre || !texte) { setErr('Donnez un nom et un texte au modèle.'); return; }
    if (await enregistrer({ id: edit.id, titre, objet: edit.objet?.trim(), texte })) setEdit(null);
    else setErr('L’enregistrement n’a pas abouti. Réessayez.');
  }
  const inserer = (v) => setEdit((x) => ({ ...x, texte: `${x.texte}${x.texte && !/\s$/.test(x.texte) ? ' ' : ''}${v}` }));
  return (
    <div className="ec-card ec-modeles" id={email ? 'modeles-email' : 'modeles'}>
      <h2>{LIBELLES[canal].titre}</h2>
      <p className="ec-muted">Dans la fiche d’un contact, le bouton « {email ? 'E-mail' : 'SMS'} » remplit le modèle avec son prénom et son projet. Vous le copiez et l’envoyez {email ? 'depuis votre messagerie' : 'depuis votre téléphone'} : rien ne part de Kairn.</p>
      <ul className="ec-modeles-list">
        {liste.map((m) => (
          <li key={m.id}>
            <div><b>{m.titre}</b>{email && m.objet && <em>Objet : {remplir(m.objet, exemple)}</em>}<p>{remplir(m.texte, exemple)}</p></div>
            <span>
              <button type="button" className="ec-link-btn" onClick={() => setEdit({ id: m.id, titre: m.titre, objet: m.objet || '', texte: m.texte })}>Modifier</button>
              {liste.length > 1 && <button type="button" className="ec-link-btn" onClick={async () => { if (!(await supprimer(m))) setErr('La suppression n’a pas abouti.'); }}>Supprimer</button>}
            </span>
          </li>
        ))}
      </ul>
      {err && !edit && <p className="ec-err" role="alert">{err}</p>}
      <div className="ec-alertes-actions">
        <button type="button" className="ec-btn-ghost" onClick={() => setEdit({ titre: '', objet: '', texte: '' })} disabled={liste.length >= 20}>+ Nouveau modèle</button>
        {perso && <button type="button" className="ec-btn-ghost" onClick={async () => { if (!(await retablir())) setErr('L’opération n’a pas abouti.'); }}>Revenir aux modèles Kairn</button>}
      </div>
      {edit && (
        <div className="ec-modal" role="dialog" aria-modal="true" aria-label={`Modèle ${LIBELLES[canal].un}`} onClick={() => setEdit(null)}>
          <form className="ec-modal-card crm-sms" onClick={(e) => e.stopPropagation()} onSubmit={sauver}>
            <h2>{edit.id ? 'Modifier le modèle' : 'Nouveau modèle'}</h2>
            <label className="ec-field"><span>Nom du modèle</span><input value={edit.titre} maxLength={60} onChange={(e) => setEdit((x) => ({ ...x, titre: e.target.value }))} placeholder="Ex. Après la visite technique" /></label>
            {email && <label className="ec-field"><span>Objet</span><input value={edit.objet} maxLength={150} onChange={(e) => setEdit((x) => ({ ...x, objet: e.target.value }))} /></label>}
            <label className="ec-field"><span>Texte</span><textarea rows={email ? 10 : 5} maxLength={email ? 3000 : 640} value={edit.texte} onChange={(e) => setEdit((x) => ({ ...x, texte: e.target.value }))} /></label>
            <div className="crm-sms-modeles crm-vars">{VARIABLES.map(([v, t]) => <button type="button" key={v} onClick={() => inserer(v)} title={`Insère ${v}`}>+ {t}</button>)}</div>
            <p className="ec-small ec-apercu">Aperçu : {remplir(edit.texte, exemple) || '·'}</p>
            <p className="ec-note">Parlez seulement du projet que le particulier a demandé : la loi limite le rappel à l’objet de sa demande.</p>
            {err && <p className="ec-err" role="alert">{err}</p>}
            <div className="ec-modal-actions"><button type="button" className="ec-btn-ghost" onClick={() => setEdit(null)}>Annuler</button><button type="submit" className="ec-btn">Enregistrer</button></div>
          </form>
        </div>
      )}
    </div>
  );
}
