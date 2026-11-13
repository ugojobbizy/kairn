import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { db, THEMES, MOTIFS, LITIGE_STATUTS, SUIVI, MOTIFS_PERTE, TVA, euro, dateFr, dateHeure, errMsg, downloadCsv, notifier } from './db.js';
import { PRODUITS } from '../v3/produits.js';
import { useData } from './data.js';
import { MAX_APPELS, planDe, prochaineTentative, etatDelai, dansCreneau, finCreneau, prochainCreneau, duree, remplir, numeroIntl, VARIABLES } from './relance.js';
import { useModeles, variables, conseille } from './modeles.js';
import { useColonnes, listeColonnes, etapeBase, typeDe, nomDe, couleurDe, TYPES, COULEURS } from './colonnes.js';

// CRM de l'espace client « Mes contacts » (Ugo, 30/10/2026 : « prends la même base que le CRM que j'ai fait pour ETXE Énergie
// et pour Isolation d'Aquitaine »). Même logique que ~/combles-crm (AdminShell, LeadDrawer) : pipeline en colonnes avec
// glisser-déposer, fiche latérale (appel, SMS, e-mail, étape, rendez-vous et lien Google Agenda, rappel, motif de perte,
// notes et fil d'activité), vues Liste, Rappels et Agenda ; sur mobile, colonnes en défilement avec accès direct à une étape.
// Données : table lead_suivi et journal lead_suivi_journal (supabase/2026-10-30-crm-client.sql).

export const ETAPES_CRM = Object.keys(SUIVI);

// ─ petites aides ─
export const nomComplet = (l) => [l.prenom, l.nom].filter(Boolean).join(' ') || 'Contact';
const initiales = (l) => nomComplet(l).split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
export function age(d) {
  if (!d) return '';
  const min = Math.max(0, Math.round((Date.now() - new Date(d).getTime()) / 60000));
  if (min < 60) return `${Math.max(1, min)} min`;
  const h = Math.round(min / 60);
  return h < 24 ? `${h} h` : `${Math.round(h / 24)} j`;
}
const toLocal = (d) => { if (!d) return ''; const x = new Date(d); x.setMinutes(x.getMinutes() - x.getTimezoneOffset()); return x.toISOString().slice(0, 16); };
const fromLocal = (v) => (v ? new Date(v).toISOString() : null);
const tel = (l) => (l.telephone || '').replace(/\s/g, '');
const jour = (d) => new Date(d).toDateString();
const quand = (d) => new Date(d).toLocaleString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).replace(',', '').replace(/(\d{2}):(\d{2})$/, (_, h, m) => `à ${Number(h)} h${m === '00' ? '' : ` ${m}`}`);
// ─ relance : délai légal et plan d'appels (src/espace/relance.js) ─
export const demandeDe = (l) => l.recu_le || l.livre_le;
const heure = (d) => new Date(d).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }).replace(':', ' h ').replace(/ h 00$/, ' h');
const jourHeure = (d) => {
  const x = new Date(d); const auj = new Date(); const dem = new Date(); dem.setDate(dem.getDate() + 1);
  if (x.toDateString() === auj.toDateString()) return `aujourd’hui ${heure(x)}`;
  if (x.toDateString() === dem.toDateString()) return `demain ${heure(x)}`;
  return `${x.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })} ${heure(x)}`;
};
// Pastille du délai légal de rappel (5 jours ouvrables après la demande).
function useCols() { const { colonnes } = useData(); return useMemo(() => listeColonnes(colonnes), [colonnes]); }
export function Delai({ lead: l, sv, now }) {
  const cols = useCols();
  if (sv && typeDe(sv.statut, cols) !== 'relance') return null;
  const e = etatDelai(demandeDe(l), now);
  if (!e.fin) return null;
  if (e.depasse) return <span className="crm-delai is-out" title="Le délai légal de rappel est passé : ne plus appeler ce contact.">Délai dépassé</span>;
  return <span className={`crm-delai${e.urgent ? ' is-urgent' : ''}`} title={`Dernier appel possible : ${jourHeure(e.fin)} (5 jours ouvrables après la demande)`}>{e.urgent ? `Dernier jour · ${duree(e.reste)}` : `${duree(e.reste)} pour rappeler`}</span>;
}

// ─ « Générer un SMS » et « E-mail » : modèles remplis pour ce contact, copiés et envoyés par l'installateur ─
// (Ugo, 12/11 et 13/11/2026). Un onglet « + Créer un modèle » enregistre un modèle à soi sans quitter la fiche.
function MessageModal({ canal, lead: l, client, sv, apercu, onClose }) {
  const { liste, enregistrer } = useModeles(canal, apercu);
  const email = canal === 'email';
  const vars = variables(l, client, sv);
  const [choix, setChoix] = useState(() => { const c = conseille(canal, sv); return liste.some((m) => m.id === c) ? c : liste[0]?.id; });
  const [creer, setCreer] = useState(null); // { titre, objet, texte } pendant la création
  const [erreur, setErreur] = useState('');
  const m = liste.find((x) => x.id === choix) || liste[0];
  const [objet, setObjet] = useState('');
  const [texte, setTexte] = useState('');
  const [copie, setCopie] = useState('');
  useEffect(() => { if (m) { setObjet(remplir(m.objet || '', vars)); setTexte(remplir(m.texte, vars)); } setCopie(''); }, [choix, m?.texte, m?.objet]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { const k = (e) => { if (e.key === 'Escape') onClose(); }; window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k); }, [onClose]);
  const manque = !client?.societe || !client?.prenom;
  async function copier(quoi, val) {
    try { await navigator.clipboard.writeText(val); setCopie(quoi); setTimeout(() => setCopie(''), 2500); } catch { /* presse-papiers refusé : le texte reste sélectionnable */ }
  }
  async function sauver(e) {
    e.preventDefault(); setErreur('');
    if (!creer.titre.trim() || !creer.texte.trim()) { setErreur('Donnez un nom et un texte au modèle.'); return; }
    const row = await enregistrer({ titre: creer.titre.trim(), objet: creer.objet?.trim(), texte: creer.texte.trim() });
    if (!row) { setErreur('L’enregistrement n’a pas abouti. Réessayez.'); return; }
    setCreer(null); setChoix(row.id);
  }
  const inserer = (v) => setCreer((x) => ({ ...x, texte: `${x.texte}${x.texte && !/\s$/.test(x.texte) ? ' ' : ''}${v}` }));
  const dest = email ? l.email : l.telephone;
  return (
    <div className="ec-modal" role="dialog" aria-modal="true" aria-label={email ? 'Écrire un e-mail' : 'Générer un SMS'} onClick={onClose}>
      <div className={`ec-modal-card crm-sms${email ? ' is-email' : ''}`} onClick={(e) => e.stopPropagation()}>
        <h2>{email ? 'Écrire un e-mail' : 'Générer un SMS'}</h2>
        <p className="ec-modal-lead">Pour {nomComplet(l)} · {dest || (email ? 'pas d’adresse e-mail' : 'pas de numéro')}</p>
        <div className="crm-sms-modeles" role="tablist" aria-label="Modèles">
          {liste.map((x) => <button type="button" role="tab" aria-selected={!creer && choix === x.id} key={x.id} className={!creer && choix === x.id ? 'is-on' : ''} onClick={() => { setCreer(null); setChoix(x.id); }}>{x.titre}</button>)}
          <button type="button" role="tab" aria-selected={Boolean(creer)} className={`is-add${creer ? ' is-on' : ''}`} onClick={() => setCreer({ titre: '', objet: '', texte: '' })}>+ Créer un modèle</button>
        </div>
        {creer ? (
          <form onSubmit={sauver}>
            <label className="ec-field"><span>Nom du modèle</span><input value={creer.titre} maxLength={60} onChange={(e) => setCreer((x) => ({ ...x, titre: e.target.value }))} placeholder={email ? 'Ex. Après la visite technique' : 'Ex. Je suis en route'} autoFocus /></label>
            {email && <label className="ec-field"><span>Objet</span><input value={creer.objet} maxLength={150} onChange={(e) => setCreer((x) => ({ ...x, objet: e.target.value }))} placeholder="Ex. Suite à notre visite" /></label>}
            <label className="ec-field"><span>Texte</span><textarea rows={email ? 9 : 5} maxLength={email ? 3000 : 640} value={creer.texte} onChange={(e) => setCreer((x) => ({ ...x, texte: e.target.value }))} placeholder={'Bonjour {prenom}, …'} /></label>
            <div className="crm-sms-modeles crm-vars">{VARIABLES.map(([v, t]) => <button type="button" key={v} onClick={() => inserer(v)} title={`Insère ${v}`}>+ {t}</button>)}</div>
            <p className="ec-note">Parlez seulement du projet que le particulier a demandé : la loi limite le rappel à l’objet de sa demande.</p>
            {erreur && <p className="ec-err" role="alert">{erreur}</p>}
            <div className="ec-modal-actions"><button type="button" className="ec-btn-ghost" onClick={() => setCreer(null)}>Annuler</button><button type="submit" className="ec-btn">Enregistrer le modèle</button></div>
          </form>
        ) : (
          <>
            {email && (
              <label className="ec-field"><span>Objet</span>
                <span className="crm-copy-row"><input value={objet} onChange={(e) => setObjet(e.target.value)} maxLength={150} /><button type="button" className="ec-btn-ghost" onClick={() => copier('objet', objet)}>{copie === 'objet' ? 'Copié' : 'Copier'}</button></span>
              </label>
            )}
            <label className="ec-field"><span>Message (modifiable)</span><textarea rows={email ? 12 : 6} value={texte} onChange={(e) => setTexte(e.target.value)} maxLength={email ? 3000 : 640} /></label>
            {!email && <p className="crm-sms-compte">{texte.length} caractères{texte.length > 160 ? ` · ${Math.ceil(texte.length / 153)} SMS` : ''}</p>}
            {manque && <p className="ec-note">Le nom de votre société ou votre prénom manque dans votre fiche : écrivez-nous pour la compléter.</p>}
            <div className="crm-sms-actions">
              <button type="button" className="ec-btn" onClick={() => copier('texte', texte)}>{copie === 'texte' ? 'Copié' : email ? 'Copier le message' : 'Copier le texte'}</button>
              {email ? (
                <a className="ec-btn-ghost" href={`mailto:${l.email || ''}?subject=${encodeURIComponent(objet)}&body=${encodeURIComponent(texte)}`}>Ouvrir dans ma messagerie</a>
              ) : (
                <>
                  <a className="ec-btn-ghost" href={`sms:${tel(l)}?&body=${encodeURIComponent(texte)}`}>Ouvrir dans Messages</a>
                  <a className="ec-btn-ghost" href={`https://wa.me/${numeroIntl(l.telephone)}?text=${encodeURIComponent(texte)}`} target="_blank" rel="noopener noreferrer">Ouvrir dans WhatsApp</a>
                </>
              )}
            </div>
            <p className="ec-small">Le message part de {email ? 'votre messagerie' : 'votre téléphone'} : rien n’est envoyé par Kairn. <Link to="/espace/compte#modeles" onClick={onClose}>Gérer mes modèles</Link></p>
          </>
        )}
      </div>
    </div>
  );
}

function gcalUrl(l, rdv, client) {
  if (!rdv) return null;
  const f = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const a = new Date(rdv); const b = new Date(a.getTime() + 3600000);
  const q = new URLSearchParams({ action: 'TEMPLATE', text: `RDV ${nomComplet(l)} · ${THEMES[l.thematique] || ''}`, dates: `${f(a)}/${f(b)}`,
    details: `Tél. ${l.telephone || ''}\n${[l.statut_occupation, l.type_logement, l.chauffage, l.surface].filter(Boolean).join(' · ')}${client?.societe ? `\n${client.societe}` : ''}`,
    location: [l.code_postal, l.ville].filter(Boolean).join(' ') });
  return `https://calendar.google.com/calendar/render?${q}`;
}
function Ico({ d, size = 16 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>;
}
const I = {
  tel: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />,
  sms: <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
  cal: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 9h18M8 3v4M16 3v4" /></>,
  bell: <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10 21a2 2 0 0 0 4 0" /></>,
  x: <path d="M6 6l12 12M18 6 6 18" />,
};

// ─ filtres (aussi utilisés par le Leads Shop) ─
export function useFilters(rows, dateKey) {
  const [q, setQ] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [them, setThem] = useState('');
  const [dep, setDep] = useState('');
  const quick = (days) => {
    const d = new Date(); d.setHours(0, 0, 0, 0);
    if (days === 'mois') d.setDate(1); else if (days === 'semaine') d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); else d.setDate(d.getDate() - days);
    setFrom(d.toISOString().slice(0, 10));
    const e = new Date(); if (days === 1) { e.setDate(e.getDate() - 1); } setTo(e.toISOString().slice(0, 10));
  };
  const out = useMemo(() => (rows || []).filter((r) => {
    const d = r[dateKey] ? r[dateKey].slice(0, 10) : '';
    if (from && d < from) return false;
    if (to && d > to) return false;
    if (them && r.thematique !== them) return false;
    if (dep && !(r.departement || '').startsWith(dep.trim())) return false;
    if (q) {
      const s = `${r.prenom || ''} ${r.nom || ''} ${r.telephone || ''} ${(r.telephone || '').replace(/\s/g, '')} ${r.email || ''} ${r.code_postal || ''} ${r.ville || ''}`.toLowerCase();
      if (!s.includes(q.toLowerCase().trim())) return false;
    }
    return true;
  }), [rows, dateKey, q, from, to, them, dep]);
  const bar = (search, dateLabel) => (
    <div className="ec-filters">
      {search && <label className="is-wide"><span>Recherche</span><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Nom, téléphone ou e-mail" /></label>}
      <label><span>{dateLabel} du</span><input type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></label>
      <label><span>{dateLabel} au</span><input type="date" value={to} onChange={(e) => setTo(e.target.value)} /></label>
      <label><span>Thématique</span><select value={them} onChange={(e) => setThem(e.target.value)}><option value="">Toutes</option>{Object.entries(THEMES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
      <label><span>Département</span><input value={dep} onChange={(e) => setDep(e.target.value)} placeholder="Ex. 33" maxLength={3} /></label>
      <div className="ec-quick">
        {[[0, 'Aujourd’hui'], [1, 'Hier'], [3, '3 derniers jours'], ['semaine', 'Cette semaine'], ['mois', 'Ce mois-ci']].map(([k, t]) => <button type="button" key={t} onClick={() => quick(k)}>{t}</button>)}
        {(from || to || them || dep || q) && <button type="button" className="is-reset" onClick={() => { setQ(''); setFrom(''); setTo(''); setThem(''); setDep(''); }}>Effacer</button>}
      </div>
    </div>
  );
  return { rows: out, bar, q, setQ, them, setThem, dep, setDep };
}

// ─ export : Excel (point-virgule), CSV standard (Google Sheets, CRM), ou copie à coller ─
const COLS = [['livre_le', 'Reçu le'], ['thematique', 'Thématique'], ['prenom', 'Prénom'], ['nom', 'Nom'], ['telephone', 'Téléphone'], ['email', 'E-mail'],
  ['code_postal', 'Code postal'], ['ville', 'Ville'], ['statut_occupation', 'Statut d’occupation'], ['type_logement', 'Type de logement'], ['chauffage', 'Chauffage'],
  ['surface', 'Surface'], ['_etape', 'Étape'], ['_montant', 'Montant devis HT'], ['_rdv', 'Rendez-vous'], ['_rappel', 'Rappel'], ['_motif', 'Motif de perte'], ['_note', 'Dernière note']];
function ExportMenu({ rows, onExported }) {
  const [copied, setCopied] = useState(false);
  const cols = COLS.map(([k, t]) => [k === 'livre_le' ? (r) => dateHeure(r.livre_le) : k, t]);
  const name = () => `kairn-contacts-${new Date().toISOString().slice(0, 10)}.csv`;
  async function copier() {
    const val = (c, r) => String((typeof c[0] === 'function' ? c[0](r) : r[c[0]]) ?? '').replace(/[\t\n]/g, ' ');
    const tsv = [cols.map((c) => c[1]).join('\t'), ...rows.map((r) => cols.map((c) => val(c, r)).join('\t'))].join('\n');
    try { await navigator.clipboard.writeText(tsv); setCopied(true); setTimeout(() => setCopied(false), 2500); onExported(); } catch { /* presse-papiers refusé */ }
  }
  return (
    <details className="ec-export">
      <summary className="ec-btn-ghost"><Ico d={<path d="M12 3v12M7 10l5 5 5-5M4 21h16" />} />Exporter ({rows.length})</summary>
      <div className="ec-export-menu">
        <button type="button" disabled={!rows.length} onClick={() => { downloadCsv(name(), cols, rows); onExported(); }}><b>Excel</b><span>Fichier CSV pour Excel</span></button>
        <button type="button" disabled={!rows.length} onClick={() => { downloadCsv(name(), cols, rows, ','); onExported(); }}><b>CRM ou Google Sheets</b><span>Fichier CSV standard, à importer</span></button>
        <button type="button" disabled={!rows.length} onClick={copier}><b>{copied ? 'Copié' : 'Copier le tableau'}</b><span>À coller dans Google Sheets ou Excel</span></button>
      </div>
    </details>
  );
}

// ─ signalement d'un doublon ou d'un hors zone ─
export function LitigeModal({ lead, apercu, onClose, onDone }) {
  const [motif, setMotif] = useState('doublon');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function submit(e) {
    e.preventDefault();
    setBusy(true); setError('');
    if (apercu) { onDone(); return; }
    const { error: err } = await db.from('litiges').insert({ lead_id: lead.id, motif, message: message.trim() || null });
    setBusy(false);
    if (err) setError(errMsg(err)); else onDone();
  }
  return (
    <div className="ec-modal" role="dialog" aria-modal="true" aria-label="Signaler un lead" onClick={onClose}>
      <form className="ec-modal-card" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <h2>Signaler un lead</h2>
        <p className="ec-modal-lead">{nomComplet(lead)} · {lead.code_postal} · livré le {dateFr(lead.livre_le)}</p>
        <p className="ec-sub">Motif</p>
        <div className="ec-seg ec-seg-sm">{Object.entries(MOTIFS).map(([k, t]) => <button type="button" key={k} className={motif === k ? 'is-on' : ''} onClick={() => setMotif(k)}><b>{t}</b></button>)}</div>
        <label className="ec-field"><span>Précision (facultatif)</span><textarea rows={3} value={message} onChange={(e) => setMessage(e.target.value)} maxLength={1000} placeholder={motif === 'doublon' ? 'Ex. déjà reçu le 12/10 sous un autre nom' : 'Ex. habite dans le 64, hors de ma zone'} /></label>
        <p className="ec-note">Un doublon ou un contact hors zone est remplacé après vérification.</p>
        {error && <p className="ec-err" role="alert">{error}</p>}
        <div className="ec-modal-actions"><button type="button" className="ec-btn-ghost" onClick={onClose}>Annuler</button><button type="submit" className="ec-btn" disabled={busy}>{busy ? 'Envoi…' : 'Envoyer'}</button></div>
      </form>
    </div>
  );
}

// ─ carte du pipeline ─
// Lisible en un coup d'œil (Ugo, 13/11/2026 : « c'est pas assez clair ») : qui, quoi et où, puis UNE prochaine action
// (rendez-vous, rappel, motif de perte), puis l'état des appels et le délai légal. Plus d'initiales ni d'étiquettes
// de logement sur la carte : elles sont dans la fiche.
function Carte({ lead: l, sv, litige, onOpen, onDrag, dragging, selected, selecting, onSelect }) {
  const cols = useCols();
  const rdv = sv?.rdv_le && new Date(sv.rdv_le) > new Date(Date.now() - 3600000);
  const rappel = sv?.rappel_le;
  const enRetard = rappel && new Date(rappel) < new Date();
  const relancable = !sv || typeDe(sv.statut, cols) === 'relance';
  const action = rdv ? <p className="crm-next is-rdv"><Ico d={I.cal} size={13} />RDV {quand(sv.rdv_le)}</p>
    : rappel && relancable ? <p className={`crm-next ${enRetard ? 'is-late' : 'is-rappel'}`}><Ico d={I.bell} size={13} />{enRetard ? 'En retard · ' : 'Rappel '}{quand(rappel)}</p>
      : sv?.motif_perte ? <p className="crm-next">{MOTIFS_PERTE[sv.motif_perte] || sv.motif_perte}</p> : null;
  return (
    <div role="button" tabIndex={0} draggable className={`crm-card${dragging ? ' is-drag' : ''}${selected ? ' is-sel' : ''}${selecting ? ' is-selecting' : ''}${!sv && Date.now() - new Date(l.livre_le).getTime() < 3600000 ? ' is-fresh' : ''}`}
      onClick={() => onOpen(l.id)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(l.id); } }}
      onDragStart={(e) => { e.dataTransfer.setData('text/plain', l.id); e.dataTransfer.effectAllowed = 'move'; onDrag(l.id); }} onDragEnd={() => onDrag(null)}>
      <div className="crm-card-top">
        {onSelect && <input type="checkbox" className="crm-card-check" checked={Boolean(selected)} aria-label={`Sélectionner ${nomComplet(l)}`} onClick={(e) => e.stopPropagation()} onChange={onSelect} />}
        <b className="crm-card-name">{nomComplet(l)}</b>
        <span className="crm-age" title={`Demande du ${dateHeure(demandeDe(l))}`}>{age(demandeDe(l))}</span>
      </div>
      <p className="crm-card-sub">{[THEMES[l.thematique] || l.thematique, [l.code_postal, l.ville].filter(Boolean).join(' ')].filter(Boolean).join(' · ')}</p>
      {action}
      {Number(sv?.montant) > 0 && <p className="crm-montant">{Math.round(Number(sv.montant)).toLocaleString('fr-FR')} € HT</p>}
      {litige && <p className="crm-next is-lit">Litige {LITIGE_STATUTS[litige.statut].toLowerCase()}</p>}
      {relancable && (
        <div className="crm-card-foot">
          <span>{sv?.tentatives ? `Appel ${Math.min(sv.tentatives, MAX_APPELS)}/${MAX_APPELS}` : 'Pas encore appelé'}</span>
          <Delai lead={l} sv={sv} />
        </div>
      )}
    </div>
  );
}

// ─ fiche latérale ─
// Après « Appeler » : l'installateur dit ce qui s'est passé. « Pas de réponse » compte l'appel et programme la relance
// suivante du plan (4 appels au plus, créneaux autorisés, avant la fin du délai légal) ; « Il a répondu » compte l'appel.
export function useAppel(onToast) {
  const { suiviPar, appeler, prefs, colonnes } = useData();
  return async (l, resultat) => {
    const sv = suiviPar.get(l.id);
    const faites = (sv?.tentatives || 0) + 1;
    const prochaine = resultat === 'nrp' ? prochaineTentative(demandeDe(l), faites, planDe(prefs), new Date()) : null;
    const ok = await appeler(l.id, resultat, prochaine ? prochaine.toISOString() : null);
    if (!ok) return;
    if (resultat === 'repondu') onToast?.(`Appel ${faites} noté. Choisissez la suite : rendez-vous, rappel ou perdu.`);
    else if (sv && typeDe(sv.statut, listeColonnes(colonnes)) !== 'relance') onToast?.(`Appel ${faites} noté, sans réponse.`);
    else onToast?.(prochaine ? `Pas de réponse (appel ${faites}/${MAX_APPELS}). Relance prévue ${jourHeure(prochaine)}.`
      : `Pas de réponse (appel ${faites}). Plus de relance possible : ${faites >= MAX_APPELS ? `${MAX_APPELS} appels faits` : 'délai légal atteint'}. Vous pouvez le classer perdu (injoignable).`);
  };
}

function Fiche({ lead: l, client, litige, apercu, onClose, onSignal, onToast }) {
  const { suiviPar, journalPar, majSuivi, noter, prefs, majMontant } = useData();
  const cols = useCols();
  const sv = suiviPar.get(l.id) || { statut: 'a_appeler', rappel_le: null, rdv_le: null, motif_perte: null, tentatives: 0 };
  const [montant, setMontant] = useState(sv.montant ?? '');
  useEffect(() => { setMontant(sv.montant ?? ''); }, [l.id, sv.montant]);
  const sauverMontant = () => { const v = String(montant).replace(/\s/g, '').replace(',', '.'); const n = v === '' ? null : Math.round(Number(v) * 100) / 100; if (v !== '' && (!Number.isFinite(n) || n < 0)) { onToast?.('Montant invalide.'); return; } if (n !== (sv.montant == null ? null : Number(sv.montant))) majMontant(l.id, n); };
  const [msg, setMsg] = useState(null); // 'sms' | 'email'
  const appel = useAppel(onToast);
  const relancable = typeDe(sv.statut, cols) === 'relance';
  const delai = etatDelai(demandeDe(l));
  const convenu = sv.statut === 'a_rappeler';
  const prevue = !relancable ? null : sv.rappel_le ? (convenu ? sv.rappel_le : prochainCreneau(new Date(sv.rappel_le))) : prochaineTentative(demandeDe(l), sv.tentatives || 0, planDe(prefs));
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => { const k = (e) => { if (e.key === 'Escape') onClose(); }; window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k); }, [onClose]);
  useEffect(() => { setNote(''); }, [l.id]);
  const journal = (journalPar.get(l.id) || []).slice().sort((a, b) => String(b.cree_le).localeCompare(String(a.cree_le)));
  const set = (patch) => majSuivi(l.id, patch);
  const plus = (h) => { const d = new Date(); if (h === 'demain') { d.setDate(d.getDate() + 1); d.setHours(9, 0, 0, 0); } else d.setTime(d.getTime() + h * 3600000); return d.toISOString(); };
  async function ajouterNote(e) {
    e.preventDefault();
    if (!note.trim()) return;
    setBusy(true);
    const ok = await noter(l.id, note.trim());
    setBusy(false);
    if (ok) setNote('');
  }
  const reponses = [['Projet', THEMES[l.thematique] || l.thematique], ['Statut', l.statut_occupation], ['Logement', l.type_logement], ['Chauffage', l.chauffage], ['Surface', l.surface]].filter(([, v]) => v);
  const g = gcalUrl(l, sv.rdv_le, client);
  return (
    <div className="crm-drawer" role="dialog" aria-modal="true" aria-label={`Fiche de ${nomComplet(l)}`}>
      <button type="button" className="crm-drawer-bg" aria-label="Fermer" onClick={onClose} />
      <aside className="crm-drawer-panel">
        <header className="crm-drawer-head">
          <span className="crm-av is-lg">{initiales(l)}</span>
          <div><b>{nomComplet(l)}</b><span>Demande du {dateHeure(demandeDe(l))} · il y a {age(demandeDe(l))}</span></div>
          <button type="button" className="crm-x" aria-label="Fermer" onClick={onClose}><Ico d={I.x} size={18} /></button>
        </header>
        <div className="crm-drawer-body">
          <div className="crm-actions">
            <a className="crm-call" href={`tel:${tel(l)}`}><Ico d={I.tel} size={18} />Appeler</a>
            <button type="button" className="crm-act" onClick={() => setMsg('sms')}><Ico d={I.sms} size={18} />SMS</button>
            <button type="button" className="crm-act" onClick={() => setMsg('email')}><Ico d={I.mail} size={18} />E-mail</button>
          </div>

          <section className="crm-appel">
            <div className="crm-appel-head">
              <b>{sv.tentatives ? `Appel${sv.tentatives > 1 ? 's' : ''} passé${sv.tentatives > 1 ? 's' : ''} : ${sv.tentatives}/${MAX_APPELS}` : 'Pas encore appelé'}</b>
              {relancable && <Delai lead={l} sv={sv} />}
            </div>
            <p className="crm-appel-txt">
              {!relancable ? 'Contact en cours de traitement.'
                : delai.depasse ? 'Le délai légal de rappel (5 jours ouvrables après la demande) est passé : ne l’appelez plus.'
                  : sv.tentatives >= MAX_APPELS ? `${MAX_APPELS} appels faits : plus de relance prévue.`
                    : prevue ? `${convenu ? 'Rappel convenu' : sv.tentatives ? 'Prochaine relance' : 'À appeler'} ${new Date(prevue) <= new Date() ? (convenu ? `le ${jourHeure(prevue)}, à faire maintenant` : 'maintenant') : jourHeure(prevue)} · dernier appel possible ${jourHeure(delai.fin)}.`
                      : `Dernier appel possible ${jourHeure(delai.fin)}.`}
            </p>
            <div className="crm-appel-btns">
              <button type="button" className="ec-btn-ghost" onClick={() => appel(l, 'nrp')}>Pas de réponse</button>
              <button type="button" className="ec-btn-ghost" onClick={() => appel(l, 'repondu')}>Il a répondu</button>
            </div>
          </section>

          <section><h3>Étape</h3>
            <div className="crm-steps">{cols.filter((c) => !c.masquee || c.statut === sv.statut).map((c) => <button type="button" key={c.statut} style={{ '--c': c.couleur }} className={sv.statut === c.statut ? 'is-on' : ''} aria-pressed={sv.statut === c.statut} onClick={() => set({ statut: c.statut })}>{c.nom}</button>)}</div>
            {etapeBase(sv.statut, cols) === 'perdu' && (
              <label className="crm-field"><span>Motif de perte</span>
                <select value={sv.motif_perte || ''} onChange={(e) => set({ motif_perte: e.target.value || null })}><option value="">Choisir un motif…</option>{Object.entries(MOTIFS_PERTE).map(([k, t]) => <option key={k} value={k}>{t}</option>)}</select>
              </label>
            )}
          </section>

          <section><h3>Montant du devis</h3>
            <div className="crm-when crm-montant-field">
              <input type="text" inputMode="decimal" value={montant} onChange={(e) => setMontant(e.target.value)} onBlur={sauverMontant} onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }} placeholder="Ex. 12 500" aria-label="Montant du devis HT en euros" />
              <span>€ HT</span>
            </div>
          </section>

          <section><h3>Coordonnées</h3>
            <dl className="crm-dl">
              <div><dt>Téléphone</dt><dd><a href={`tel:${tel(l)}`}>{l.telephone || '·'}</a></dd></div>
              <div><dt>E-mail</dt><dd>{l.email ? <a href={`mailto:${l.email}`}>{l.email}</a> : '·'}</dd></div>
              <div><dt>Adresse</dt><dd>{[l.code_postal, l.ville].filter(Boolean).join(' ') || '·'}</dd></div>
            </dl>
          </section>

          {reponses.length > 0 && <section><h3>Réponses au formulaire</h3><dl className="crm-dl">{reponses.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl></section>}

          <section><h3>Rendez-vous</h3>
            <div className="crm-when">
              <input type="datetime-local" value={toLocal(sv.rdv_le)} onChange={(e) => set({ rdv_le: fromLocal(e.target.value), ...(e.target.value && relancable ? { statut: 'rdv' } : {}) })} />
              {sv.rdv_le && <button type="button" className="ec-link-btn" onClick={() => set({ rdv_le: null })}>Effacer</button>}
            </div>
            {g && <a className="crm-gcal" href={g} target="_blank" rel="noopener noreferrer"><Ico d={I.cal} size={14} />Ajouter à Google Agenda</a>}
          </section>

          <section><h3>Rappel programmé</h3>
            <div className="crm-when">
              <input type="datetime-local" value={toLocal(sv.rappel_le)} onChange={(e) => set({ rappel_le: fromLocal(e.target.value) })} />
              {sv.rappel_le && <button type="button" className="ec-link-btn" onClick={() => set({ rappel_le: null })}>Effacer</button>}
            </div>
            <div className="crm-quick">
              {[[1, 'Dans 1 h'], [3, 'Dans 3 h'], ['demain', 'Demain 9 h'], [48, 'Dans 2 jours']].map(([h, t]) => <button type="button" key={t} onClick={() => set({ rappel_le: plus(h), ...(['a_appeler', 'nrp'].includes(sv.statut) ? { statut: 'a_rappeler' } : {}) })}>{t}</button>)}
            </div>
          </section>

          <section><h3>Notes</h3>
            <form className="crm-note" onSubmit={ajouterNote}>
              <textarea rows={2} maxLength={2000} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ex. appelé à 14 h, message laissé ; budget 12 000 €…" />
              <button type="submit" className="ec-btn" disabled={busy || !note.trim()}>{busy ? 'Ajout…' : 'Ajouter'}</button>
            </form>
          </section>

          <section><h3>Activité</h3>
            <ol className="crm-feed">
              {journal.map((j) => (
                <li key={j.id} className={j.type === 'note' ? 'is-note' : ''}>
                  <i style={{ background: j.type === 'note' ? '#CBD5E1' : j.type === 'appel' ? '#94A3B8' : couleurDe(j.statut, cols) }} />
                  <div>{j.type === 'note' ? <p>{j.texte}</p> : j.type === 'appel' ? <p>Appel : <b>{j.texte === 'nrp' ? 'pas de réponse' : 'a répondu'}</b></p> : <p>Étape : <b>{nomDe(j.statut, cols)}</b></p>}<span>{dateHeure(j.cree_le)}</span></div>
                </li>
              ))}
              <li><i style={{ background: couleurDe('a_appeler', cols) }} /><div><p>Contact reçu</p><span>{dateHeure(l.livre_le)}</span></div></li>
            </ol>
          </section>

          <footer className="crm-drawer-foot">
            {litige ? <span className={`ec-status is-${litige.statut}`}>Litige {LITIGE_STATUTS[litige.statut].toLowerCase()}</span>
              : <button type="button" className="ec-link-btn" onClick={() => onSignal(l)}>Signaler un doublon ou un hors zone</button>}
            {apercu && <span className="ec-muted">Aperçu : rien n’est enregistré</span>}
          </footer>
        </div>
      </aside>
      {msg && <MessageModal canal={msg} lead={l} client={client} sv={sv} apercu={apercu} onClose={() => setMsg(null)} />}
    </div>
  );
}

// ─ Relancer une campagne (Ugo, 31/10/2026 : « un bouton en haut pour relancer une campagne automatiquement ») ─
// Reprend la dernière campagne du client (thématique, zone, volume) et envoie la demande en un clic, sans repasser
// par le formulaire ; le volume se change dans la fenêtre. Même enregistrement que la page « Commander des contacts ».
const VOLUMES = [50, 100, 200, 500];
function Relance({ session, client, apercu, onClose }) {
  const { commandes, reload } = useData();
  const derniere = (commandes || []).find((c) => c.type !== 'shop' && c.thematique && c.statut !== 'refusee');
  const [qte, setQte] = useState(() => { const n = Number(derniere?.plafond || derniere?.volume); return VOLUMES.includes(n) ? n : 100; });
  const [etat, setEtat] = useState('idle');
  const [error, setError] = useState('');
  const prix = PRODUITS.find((x) => x.code === derniere?.thematique)?.prix;
  async function relancer() {
    setError(''); setEtat('envoi');
    if (apercu) { setEtat('ok'); return; }
    const { data: created, error: err } = await db.from('commandes').insert({
      user_id: session.user.id, souhait: 'leads', type: 'precommande', thematique: derniere.thematique, volume: String(qte), zone: derniere.zone || null,
      societe: client?.societe || null, nom: client?.prenom || null, email: session.user.email, telephone: client?.telephone || null, siret: client?.siret || null,
      page: '/espace/prospects',
    }).select('id').single();
    if (err) { setEtat('idle'); setError(errMsg(err)); return; }
    notifier('commande', created.id);
    setEtat('ok');
    reload();
  }
  return (
    <div className="ec-modal" role="dialog" aria-modal="true" aria-label="Relancer une campagne" onClick={onClose}>
      <div className="ec-modal-card crm-relance" onClick={(e) => e.stopPropagation()}>
        <h2>Relancer une campagne</h2>
        {!derniere ? (
          <>
            <p className="ec-modal-lead">Vous n’avez pas encore de campagne à relancer.</p>
            <div className="ec-modal-actions"><button type="button" className="ec-btn-ghost" onClick={onClose}>Fermer</button><Link to="/espace/precommande" className="ec-btn">Commander des contacts</Link></div>
          </>
        ) : etat === 'ok' ? (
          <>
            <p className="ec-ok">Campagne relancée : {qte} contacts {THEMES[derniere.thematique]?.toLowerCase()}. Nous validons la zone et le volume, puis le bon de commande arrive dans Mes commandes.{apercu ? ' (Démo : rien n’est enregistré.)' : ''}</p>
            <div className="ec-modal-actions"><button type="button" className="ec-btn" onClick={onClose}>Fermer</button></div>
          </>
        ) : (
          <>
            <p className="ec-modal-lead">Même campagne que la dernière, envoyée en un clic.</p>
            <dl className="crm-dl">
              <div><dt>Thématique</dt><dd>{THEMES[derniere.thematique] || derniere.thematique}</dd></div>
              <div><dt>Zone</dt><dd>{derniere.zone || 'À préciser avec nous'}</dd></div>
              <div><dt>Dernière demande</dt><dd>{dateFr(derniere.created_at)}</dd></div>
            </dl>
            <p className="ec-sub">Nombre de contacts</p>
            <div className="ec-seg ec-seg-sm">{VOLUMES.map((v) => <button type="button" key={v} className={qte === v ? 'is-on' : ''} onClick={() => setQte(v)}><b>{v}</b></button>)}</div>
            {prix && <div className="ec-total"><span>Montant estimé</span><b>{euro(qte * prix)} HT</b><em>{euro(qte * prix * (1 + TVA))} TTC</em></div>}
            {error && <p className="ec-err" role="alert">{error}</p>}
            <div className="ec-modal-actions">
              <Link to={`/espace/precommande?${new URLSearchParams({ thematique: derniere.thematique, quantite: String(qte), zone: derniere.zone || '' })}`} className="ec-btn-ghost">Changer la zone</Link>
              <button type="button" className="ec-btn" onClick={relancer} disabled={etat === 'envoi'}>{etat === 'envoi' ? 'Envoi…' : 'Relancer'}</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─ Ma journée : qui appeler maintenant (bloc 1 « vitesse et relance », 12/11/2026) ─
// Nouveaux contacts d'abord (le plus ancien en tête : son délai court depuis plus longtemps), puis relances arrivées à
// échéance ; ensuite ce qui tombe plus tard dans la journée, les rendez-vous du jour et les contacts dont le délai est passé.
export function planJournee(rows, suiviPar, prefs, now = new Date(), cols = listeColonnes([])) {
  const finJour = new Date(now); finJour.setHours(23, 59, 59, 999);
  const plan = planDe(prefs);
  const out = { maintenant: [], plusTard: [], ensuite: [], depasses: [], rdv: [] };
  for (const l of rows) {
    const sv = suiviPar.get(l.id);
    const statut = sv?.statut || 'a_appeler';
    if (sv?.rdv_le && ['rdv', 'devis'].includes(statut)) { const r = new Date(sv.rdv_le); if (r.toDateString() === now.toDateString()) out.rdv.push({ l, quand: r }); }
    if (typeDe(statut, cols) !== 'relance') continue;
    const delai = etatDelai(demandeDe(l), now);
    // Lecture prudente : même un rappel convenu (« À rappeler ») sort de la liste une fois le délai de la demande passé.
    if (delai.depasse) { out.depasses.push({ l }); continue; }
    let quand;
    if (statut === 'a_rappeler') quand = sv?.rappel_le ? new Date(sv.rappel_le) : now; // heure convenue avec le particulier
    else if (sv?.rappel_le) quand = prochainCreneau(new Date(sv.rappel_le)); // relance recalée dans un créneau autorisé
    else quand = prochaineTentative(demandeDe(l), sv?.tentatives || 0, plan, now);
    if (!quand) continue; // plus de relance possible (4 appels faits) : visible dans le pipeline, pas dans la journée
    const item = { l, quand, nouveau: statut === 'a_appeler' && !sv?.tentatives };
    if (quand <= now) out.maintenant.push(item); else if (quand <= finJour) out.plusTard.push(item); else out.ensuite.push(item);
  }
  out.maintenant.sort((a, b) => (b.nouveau - a.nouveau) || (new Date(demandeDe(a.l)) - new Date(demandeDe(b.l))));
  out.plusTard.sort((a, b) => a.quand - b.quand);
  out.ensuite.sort((a, b) => a.quand - b.quand);
  out.rdv.sort((a, b) => a.quand - b.quand);
  return out;
}

function Journee({ rows, onOpen, onToast, now, cols }) {
  const { suiviPar, prefs, majSuivi } = useData();
  const appel = useAppel(onToast);
  const j = useMemo(() => planJournee(rows, suiviPar, prefs, now, cols), [rows, suiviPar, prefs, now, cols]);
  const ok = dansCreneau(now);
  const fin = finCreneau(now);
  const reprise = ok ? null : prochainCreneau(now);
  const ligne = ({ l, quand, nouveau }, tard) => {
    const sv = suiviPar.get(l.id);
    const when = tard === 'jour' ? jourHeure(quand) : tard ? heure(quand) : '';
    return (
      <li key={l.id} className="crm-jl">
        <button type="button" className="crm-jl-who" onClick={() => onOpen(l.id)}>
          <span className="crm-av">{initiales(l)}</span>
          <span className="crm-line-who"><b>{nomComplet(l)}</b><small>{[THEMES[l.thematique], [l.code_postal, l.ville].filter(Boolean).join(' ')].filter(Boolean).join(' · ')}</small></span>
        </button>
        <span className="crm-jl-meta">
          {nouveau ? <span className="crm-chrono" title="Temps écoulé depuis la demande">Attend depuis {duree(now - new Date(demandeDe(l)))}{when ? ` · à appeler ${when}` : ''}</span>
            : <span className="crm-appels">{sv?.statut === 'a_rappeler' ? `Rappel convenu${when ? ` ${when}` : ''}` : `Relance · appel ${(sv?.tentatives || 0) + 1}/${MAX_APPELS}${when ? ` · ${when}` : ''}`}</span>}
          <Delai lead={l} sv={sv} now={now} />
        </span>
        <span className="crm-jl-act">
          <a className="crm-jl-call" href={`tel:${tel(l)}`}><Ico d={I.tel} size={16} />Appeler</a>
          <button type="button" className="crm-jl-btn" onClick={() => appel(l, 'nrp')}>Pas de réponse</button>
          <button type="button" className="crm-jl-btn" onClick={() => { appel(l, 'repondu'); onOpen(l.id); }}>Répondu</button>
        </span>
      </li>
    );
  };
  return (
    <div className="crm-journee">
      <p className={`crm-creneau${ok ? ' is-ok' : ''}`}>
        <i aria-hidden="true" />
        {ok ? <>Appels autorisés jusqu’à <b>{heure(fin)}</b></> : <>Hors des horaires d’appel. Reprise <b>{reprise ? jourHeure(reprise) : '·'}</b></>}
        <small>Lundi au vendredi hors fériés, 10 h à 13 h et 14 h à 20 h, sauf horaire précis convenu avec le particulier.</small>
      </p>

      <section className="crm-jsec is-now">
        <h2>À appeler maintenant<b>{j.maintenant.length}</b></h2>
        {j.maintenant.length ? <ul>{j.maintenant.map((x) => ligne(x, false))}</ul> : <p className="crm-jvide">Personne à appeler pour l’instant. Les nouveaux contacts et les relances arrivent ici.</p>}
      </section>
      {j.plusTard.length > 0 && <section className="crm-jsec"><h2>Plus tard aujourd’hui<b>{j.plusTard.length}</b></h2><ul>{j.plusTard.map((x) => ligne(x, true))}</ul></section>}
      {j.ensuite.length > 0 && (
        <details className="crm-jsec crm-jsec-plie"><summary><h2>Prochains jours<b>{j.ensuite.length}</b></h2></summary>
          <ul>{j.ensuite.map((x) => ligne(x, 'jour'))}</ul></details>
      )}
      {j.rdv.length > 0 && (
        <section className="crm-jsec"><h2>Rendez-vous aujourd’hui<b>{j.rdv.length}</b></h2>
          <ul>{j.rdv.map(({ l, quand }) => (
            <li key={l.id} className="crm-jl"><button type="button" className="crm-jl-who" onClick={() => onOpen(l.id)}><span className="crm-av">{initiales(l)}</span><span className="crm-line-who"><b>{nomComplet(l)}</b><small>{[THEMES[l.thematique], [l.code_postal, l.ville].filter(Boolean).join(' ')].filter(Boolean).join(' · ')}</small></span></button>
              <span className="crm-jl-meta"><span className="crm-appels">{heure(quand)}</span></span>
              <span className="crm-jl-act"><a className="crm-jl-call" href={`tel:${tel(l)}`}><Ico d={I.tel} size={16} />Appeler</a></span></li>
          ))}</ul>
        </section>
      )}
      {j.depasses.length > 0 && (
        <section className="crm-jsec is-out"><h2>Délai légal dépassé<b>{j.depasses.length}</b></h2>
          <p className="crm-jvide">Ces contacts n’ont pas été joints dans les 5 jours ouvrables qui suivent leur demande : la loi ne permet plus de les appeler. Classez-les pour vider la liste.</p>
          {j.depasses.length > 1 && <p className="crm-jvide"><button type="button" className="crm-jl-btn" onClick={async () => { for (const { l } of j.depasses) await majSuivi(l.id, { statut: 'perdu', motif_perte: 'injoignable', rappel_le: null }); }}>Tout classer perdu (injoignable)</button></p>}
          <ul>{j.depasses.map(({ l }) => (
            <li key={l.id} className="crm-jl"><button type="button" className="crm-jl-who" onClick={() => onOpen(l.id)}><span className="crm-av">{initiales(l)}</span><span className="crm-line-who"><b>{nomComplet(l)}</b><small>Demande du {dateFr(demandeDe(l))}</small></span></button>
              <span className="crm-jl-act"><button type="button" className="crm-jl-btn" onClick={() => majSuivi(l.id, { statut: 'perdu', motif_perte: 'injoignable', rappel_le: null })}>Classer perdu (injoignable)</button></span></li>
          ))}</ul>
        </section>
      )}
    </div>
  );
}

// ─ Pipeline : colonnes du client (renommer, couleur, type, ordre, masquer, supprimer), total des devis, tri par
// colonne, sélection multiple (Ugo, 13/11/2026). Réglage des colonnes : src/espace/colonnes.js.
const TRIS = { recent: 'Plus récents', ancien: 'Plus anciens', delai: 'Délai restant', montant: 'Montant' };
function trier(rows, tri, suiviPar) {
  const r = [...rows];
  const dem = (l) => new Date(demandeDe(l)).getTime();
  if (tri === 'ancien') return r.sort((a, b) => dem(a) - dem(b));
  if (tri === 'montant') return r.sort((a, b) => (Number(suiviPar.get(b.id)?.montant) || 0) - (Number(suiviPar.get(a.id)?.montant) || 0));
  if (tri === 'delai') return r.sort((a, b) => (etatDelai(demandeDe(a)).reste ?? 9e15) - (etatDelai(demandeDe(b)).reste ?? 9e15));
  return r.sort((a, b) => dem(b) - dem(a));
}
const euroRond = (n) => `${Math.round(Number(n) || 0).toLocaleString('fr-FR')} €`;

function MenuColonne({ col, cols, n, tri, onTri, onSelectAll, onClose, gestion, onToast }) {
  const [nom, setNom] = useState(col.nom);
  const [confirmer, setConfirmer] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const k = (e) => { if (e.key === 'Escape') onClose(); };
    const c = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    window.addEventListener('keydown', k); window.addEventListener('mousedown', c);
    return () => { window.removeEventListener('keydown', k); window.removeEventListener('mousedown', c); };
  }, [onClose]);
  const i = cols.findIndex((c) => c.statut === col.statut);
  const ok = (p, msg) => p.then((r) => { if (!r) onToast('L’enregistrement n’a pas abouti. Réessayez.'); else if (msg) onToast(msg); });
  return (
    <div className="crm-menu" ref={ref} role="menu">
      <form onSubmit={(e) => { e.preventDefault(); if (nom.trim() && nom.trim() !== col.nom) ok(gestion.renommer(col.statut, nom)); onClose(); }}>
        <label className="crm-menu-field"><span>Nom de la colonne</span><input value={nom} maxLength={40} onChange={(e) => setNom(e.target.value)} autoFocus /></label>
      </form>
      <div className="crm-menu-colors" aria-label="Couleur">{COULEURS.map((c) => <button type="button" key={c} style={{ background: c }} className={c === col.couleur ? 'is-on' : ''} aria-label={`Couleur ${c}`} onClick={() => ok(gestion.changerCouleur(col.statut, c))} />)}</div>
      {col.perso && (
        <label className="crm-menu-field"><span>Type</span>
          <select value={col.type} onChange={(e) => ok(gestion.changerType(col.statut, e.target.value))}>{Object.entries(TYPES).map(([k, t]) => <option key={k} value={k}>{t}</option>)}</select>
        </label>
      )}
      <p className="crm-menu-label">Trier</p>
      <div className="crm-menu-tri">{Object.entries(TRIS).map(([k, t]) => <button type="button" key={k} className={tri === k ? 'is-on' : ''} onClick={() => onTri(k)}>{t}</button>)}</div>
      <hr />
      <button type="button" className="crm-menu-item" onClick={() => { onSelectAll(); onClose(); }} disabled={!n}>Sélectionner les {n} contacts</button>
      <button type="button" className="crm-menu-item" onClick={() => ok(gestion.deplacer(col.statut, -1))} disabled={i <= 0}>Déplacer à gauche</button>
      <button type="button" className="crm-menu-item" onClick={() => ok(gestion.deplacer(col.statut, 1))} disabled={i >= cols.length - 1}>Déplacer à droite</button>
      {col.statut !== 'a_appeler' && <button type="button" className="crm-menu-item" onClick={() => { ok(gestion.masquer(col.statut, true), `« ${col.nom} » masquée. Pour la réafficher : bouton Colonnes.`); onClose(); }}>Masquer la colonne</button>}
      {col.perso && (n ? <p className="crm-menu-note">Pour supprimer cette colonne, déplacez d’abord ses {n} contacts.</p>
        : confirmer ? <button type="button" className="crm-menu-item is-danger" onClick={() => { ok(gestion.supprimer(col.statut), `Colonne « ${col.nom} » supprimée.`); onClose(); }}>Confirmer la suppression</button>
          : <button type="button" className="crm-menu-item is-danger" onClick={() => setConfirmer(true)}>Supprimer la colonne</button>)}
    </div>
  );
}

function NouvelleColonne({ gestion, onToast, onClose }) {
  const [nom, setNom] = useState('');
  const [type, setType] = useState('en_cours');
  return (
    <form className="crm-col crm-col-new" onSubmit={async (e) => { e.preventDefault(); if (!nom.trim()) return; const r = await gestion.ajouter(nom.trim(), type); if (!r) onToast('La colonne n’a pas pu être créée. Réessayez.'); onClose(); }}>
      <label className="crm-menu-field"><span>Nom de la colonne</span><input value={nom} maxLength={40} onChange={(e) => setNom(e.target.value)} placeholder="Ex. Visite technique" autoFocus /></label>
      <label className="crm-menu-field"><span>Type</span><select value={type} onChange={(e) => setType(e.target.value)}>{Object.entries(TYPES).map(([k, t]) => <option key={k} value={k}>{t}</option>)}</select></label>
      <p className="crm-menu-note">{{ relance: 'Les contacts restent dans Ma journée : relances et délai légal s’appliquent.', en_cours: 'Contact joint, affaire en cours (comme RDV pris ou Devis envoyé).', gagne: 'Les contacts sont comptés comme signés.', perdu: 'Les contacts sont comptés comme perdus.' }[type]}</p>
      <div className="crm-col-new-act"><button type="button" className="ec-btn-ghost" onClick={onClose}>Annuler</button><button type="submit" className="ec-btn" disabled={!nom.trim()}>Créer</button></div>
    </form>
  );
}

function PanneauColonnes({ gestion, onToast, onClose }) {
  const ref = useRef(null);
  useEffect(() => { const c = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); }; window.addEventListener('mousedown', c); return () => window.removeEventListener('mousedown', c); }, [onClose]);
  return (
    <div className="crm-menu crm-menu-cols" ref={ref}>
      <p className="crm-menu-label">Colonnes affichées</p>
      {gestion.liste.map((c) => (
        <label key={c.statut} className="crm-menu-check">
          <input type="checkbox" checked={!c.masquee} disabled={c.statut === 'a_appeler'} onChange={(e) => gestion.masquer(c.statut, !e.target.checked).then((r) => { if (!r) onToast('L’enregistrement n’a pas abouti.'); })} />
          <i style={{ background: c.couleur }} />{c.nom}<small>{TYPES[c.type]}</small>
        </label>
      ))}
    </div>
  );
}

function Pipeline({ rows, cols, gestion, suiviPar, enLitige, majSuivi, onOpen, sel, setSel, onToast, boardRef }) {
  const [drag, setDrag] = useState(null);
  const [over, setOver] = useState(null);
  const [menu, setMenu] = useState(null);
  const [nouvelle, setNouvelle] = useState(false);
  const [tris, setTris] = useState({});
  const visibles = cols.filter((c) => !c.masquee);
  const parCol = useMemo(() => {
    const m = Object.fromEntries(cols.map((c) => [c.statut, []]));
    for (const l of rows) { const s = suiviPar.get(l.id)?.statut || 'a_appeler'; (m[s] || m.a_appeler).push(l); }
    return m;
  }, [rows, cols, suiviPar]);
  function deposer(id, statut) {
    setOver(null); setDrag(null);
    if (!id) return;
    // Glisser une carte sélectionnée déplace toute la sélection.
    const ids = sel.has(id) ? [...sel] : [id];
    for (const x of ids) if ((suiviPar.get(x)?.statut || 'a_appeler') !== statut) majSuivi(x, { statut });
    if (ids.length > 1) { onToast(`${ids.length} contacts déplacés.`); setSel(new Set()); }
    else if (typeDe(statut, cols) === 'perdu') onOpen(id);
  }
  const basculer = (id) => setSel((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  return (
    <div className="crm-board" ref={boardRef}>
      {visibles.map((c) => {
        const liste = trier(parCol[c.statut] || [], tris[c.statut], suiviPar);
        const total = liste.reduce((t, l) => t + (Number(suiviPar.get(l.id)?.montant) || 0), 0);
        return (
          <section key={c.statut} data-etape={c.statut} className={`crm-col${over === c.statut ? ' is-over' : ''}`} style={{ '--c': c.couleur }}
            onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; if (over !== c.statut) setOver(c.statut); }}
            onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setOver(null); }}
            onDrop={(e) => { e.preventDefault(); deposer(e.dataTransfer.getData('text/plain') || drag, c.statut); }}>
            <header className="crm-col-head">
              <h2><i />{c.nom}<b>{liste.length}</b></h2>
              {total > 0 && <span className="crm-col-total" title="Total des devis de la colonne (HT)">{euroRond(total)}</span>}
              <button type="button" className="crm-col-more" aria-label={`Options de la colonne ${c.nom}`} onClick={() => setMenu(menu === c.statut ? null : c.statut)}>
                <Ico d={<><circle cx="5" cy="12" r="1.3" /><circle cx="12" cy="12" r="1.3" /><circle cx="19" cy="12" r="1.3" /></>} size={16} />
              </button>
              {menu === c.statut && <MenuColonne col={c} cols={cols} n={liste.length} tri={tris[c.statut] || 'recent'} onTri={(t) => setTris((x) => ({ ...x, [c.statut]: t }))}
                onSelectAll={() => setSel((s) => new Set([...s, ...liste.map((l) => l.id)]))} onClose={() => setMenu(null)} gestion={gestion} onToast={onToast} />}
            </header>
            <div className="crm-col-body">
              {liste.slice(0, 80).map((l) => <Carte key={l.id} lead={l} sv={suiviPar.get(l.id)} litige={enLitige.get(l.id)} onOpen={onOpen} onDrag={setDrag} dragging={drag === l.id}
                selected={sel.has(l.id)} selecting={sel.size > 0} onSelect={() => basculer(l.id)} />)}
              {liste.length > 80 && <p className="crm-more">+ {liste.length - 80} autres : utilisez la recherche ou la liste</p>}
              {liste.length === 0 && <p className="crm-empty">{c.statut === 'a_appeler' ? 'Les nouveaux contacts arrivent ici.' : 'Glissez une carte ici'}</p>}
            </div>
          </section>
        );
      })}
      {nouvelle ? <NouvelleColonne gestion={gestion} onToast={onToast} onClose={() => setNouvelle(false)} />
        : <button type="button" className="crm-col-add" onClick={() => setNouvelle(true)}>+ Ajouter une colonne</button>}
    </div>
  );
}

// Barre d'actions de la sélection multiple.
function BarreSelection({ sel, setSel, cols, majSuivi, exportRows, onToast }) {
  const [cible, setCible] = useState('');
  if (!sel.size) return null;
  const ids = [...sel];
  const deplacer = (statut, patch = {}) => { for (const id of ids) majSuivi(id, { statut, ...patch }); onToast(`${ids.length} contact${ids.length > 1 ? 's' : ''} déplacé${ids.length > 1 ? 's' : ''} vers « ${nomDe(statut, cols)} ».`); setSel(new Set()); setCible(''); };
  const exporter = () => {
    const cs = COLS.map(([k, t]) => [k === 'livre_le' ? (r) => dateHeure(r.livre_le) : k, t]);
    downloadCsv(`kairn-selection-${new Date().toISOString().slice(0, 10)}.csv`, cs, exportRows.filter((r) => sel.has(r.id)));
  };
  return (
    <div className="crm-bulk" role="toolbar" aria-label="Actions sur la sélection">
      <b>{ids.length} sélectionné{ids.length > 1 ? 's' : ''}</b>
      <select value={cible} onChange={(e) => { if (e.target.value) deplacer(e.target.value); }} aria-label="Déplacer vers">
        <option value="">Déplacer vers…</option>{cols.map((c) => <option key={c.statut} value={c.statut}>{c.nom}</option>)}
      </select>
      <button type="button" onClick={() => deplacer('perdu', { motif_perte: 'injoignable', rappel_le: null })}>Classer perdu</button>
      <button type="button" onClick={exporter}>Exporter</button>
      <button type="button" className="is-ghost" onClick={() => setSel(new Set())}>Annuler</button>
    </div>
  );
}

// ─ Mes contacts ─
export default function Contacts({ apercu, client, session }) {
  const { leads, litiges, suiviPar, journalPar, majSuivi, reload, prefs } = useData();
  const gestion = useColonnes(apercu);
  const cols = gestion.liste;
  const [params, setParams] = useSearchParams();
  const vue = params.get('vue') || 'journee';
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 30000); return () => clearInterval(t); }, []);
  const [toast, setToast] = useState('');
  useEffect(() => { if (!toast) return undefined; const t = setTimeout(() => setToast(''), 6000); return () => clearTimeout(t); }, [toast]);
  const setVue = (v) => { const p = new URLSearchParams(params); p.set('vue', v); setParams(p, { replace: true }); };
  const [ouvert, setOuvert] = useState(null);
  const [litigeFor, setLitigeFor] = useState(null);
  const [relance, setRelance] = useState(false);
  const [panneau, setPanneau] = useState(false);
  const [sel, setSel] = useState(() => new Set());
  const board = useRef(null);
  const enLitige = useMemo(() => new Map((litiges || []).map((g) => [g.lead_id, g])), [litiges]);
  const actifs = useMemo(() => (leads || []).filter((l) => !l.annule).sort((a, b) => String(b.livre_le).localeCompare(String(a.livre_le))), [leads]);
  const f = useFilters(actifs, 'livre_le');
  const statutDe = (l) => (suiviPar.get(l.id) || {}).statut || 'a_appeler';
  const st = (l) => etapeBase(statutDe(l), cols);
  const maintenant = Date.now();
  const finJour = new Date(); finJour.setHours(23, 59, 59, 999);
  const rappels = f.rows.filter((l) => suiviPar.get(l.id)?.rappel_le && !['signe', 'perdu'].includes(st(l))).sort((a, b) => suiviPar.get(a.id).rappel_le.localeCompare(suiviPar.get(b.id).rappel_le));
  const rdvs = f.rows.filter((l) => suiviPar.get(l.id)?.rdv_le && new Date(suiviPar.get(l.id).rdv_le) > maintenant - 86400000).sort((a, b) => suiviPar.get(a.id).rdv_le.localeCompare(suiviPar.get(b.id).rdv_le));
  const rappelsDus = rappels.filter((l) => new Date(suiviPar.get(l.id).rappel_le) <= finJour).length;
  const lead = ouvert && (leads || []).find((l) => l.id === ouvert);
  const journee = useMemo(() => planJournee(f.rows, suiviPar, prefs, now, cols), [f.rows, suiviPar, prefs, now, cols]);
  const nouveaux = f.rows.filter((l) => statutDe(l) === 'a_appeler').length;
  const signes = f.rows.filter((l) => st(l) === 'signe');
  const caSigne = signes.reduce((t, l) => t + (Number(suiviPar.get(l.id)?.montant) || 0), 0);
  const exportRows = f.rows.map((l) => {
    const s = suiviPar.get(l.id) || {}; const j = (journalPar.get(l.id) || []).filter((x) => x.type === 'note').sort((a, b) => String(b.cree_le).localeCompare(String(a.cree_le)))[0];
    return { ...l, _etape: nomDe(statutDe(l), cols), _montant: s.montant ?? '', _rdv: s.rdv_le ? dateHeure(s.rdv_le) : '', _rappel: s.rappel_le ? dateHeure(s.rappel_le) : '', _motif: s.motif_perte ? MOTIFS_PERTE[s.motif_perte] || s.motif_perte : '', _note: j?.texte || '' };
  });
  async function marquer() {
    const ids = f.rows.filter((r) => !r.exporte_le).map((r) => r.id);
    if (ids.length && !apercu) { await db.rpc('leads_marquer_exportes', { p_ids: ids }); reload(); }
  }
  const allerA = (k) => board.current?.querySelector(`[data-etape="${k}"]`)?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
  const pill = (l) => <span className="crm-pill" style={{ '--c': couleurDe(statutDe(l), cols) }}>{nomDe(statutDe(l), cols)}</span>;

  const ligne = (l, extra) => (
    <li key={l.id}><button type="button" onClick={() => setOuvert(l.id)}>
      <span className="crm-av">{initiales(l)}</span>
      <span className="crm-line-who"><b>{nomComplet(l)}</b><small>{[THEMES[l.thematique], l.code_postal].filter(Boolean).join(' · ')}</small></span>
      {pill(l)}
      {extra}
    </button></li>
  );
  const parJour = (rows, key) => {
    const g = new Map();
    for (const l of rows) { const d = jour(suiviPar.get(l.id)[key]); if (!g.has(d)) g.set(d, []); g.get(d).push(l); }
    return [...g.entries()];
  };
  const basculer = (id) => setSel((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const listeRows = f.rows.slice(0, 500);

  return (
    <div className="crm">
      <header className="crm-head">
        <div className="crm-head-top">
          <div className="crm-title"><h1>Mes contacts</h1><button type="button" className="ec-btn crm-relancer" onClick={() => setRelance(true)}><Ico d={<path d="M21 12a9 9 0 1 1-2.6-6.4M21 4v5h-5" />} />Relancer une campagne</button></div>
          <div className="crm-stats">
            <span className={journee.maintenant.length ? 'is-hot' : ''}><b>{journee.maintenant.length}</b>à appeler maintenant</span>
            <span><b>{nouveaux}</b>nouveaux</span>
            <span className={rappelsDus ? 'is-warn' : ''}><b>{rappelsDus}</b>rappels aujourd’hui</span>
            <span><b>{rdvs.filter((l) => new Date(suiviPar.get(l.id).rdv_le) >= maintenant).length}</b>RDV à venir</span>
            <span className="is-ok"><b>{signes.length}</b>signés{caSigne > 0 ? ` · ${euroRond(caSigne)}` : ''}</span>
          </div>
        </div>
        <div className="crm-toolbar">
          <input className="crm-search" value={f.q} onChange={(e) => f.setQ(e.target.value)} placeholder="Nom, téléphone, code postal…" aria-label="Rechercher un contact" />
          <select className="crm-select" value={f.them} onChange={(e) => f.setThem(e.target.value)} aria-label="Thématique"><option value="">Toutes les thématiques</option>{Object.entries(THEMES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
          <input className="crm-search crm-dep" value={f.dep} onChange={(e) => f.setDep(e.target.value)} placeholder="Département" maxLength={3} aria-label="Filtrer par département" inputMode="numeric" />
          <div className="crm-views" role="tablist" aria-label="Affichage">
            {[['journee', `Ma journée${journee.maintenant.length ? ` (${journee.maintenant.length})` : ''}`], ['pipeline', 'Pipeline'], ['liste', 'Liste'], ['rappels', `Rappels${rappelsDus ? ` (${rappelsDus})` : ''}`], ['agenda', 'Agenda']].map(([k, t]) => <button type="button" role="tab" aria-selected={vue === k} key={k} className={vue === k ? 'is-on' : ''} onClick={() => setVue(k)}>{t}</button>)}
          </div>
          {vue === 'pipeline' && (
            <div className="crm-cols-btn">
              <button type="button" className="ec-btn-ghost" onClick={() => setPanneau((x) => !x)}>Colonnes{cols.some((c) => c.masquee) ? ` (${cols.filter((c) => c.masquee).length} masquée${cols.filter((c) => c.masquee).length > 1 ? 's' : ''})` : ''}</button>
              {panneau && <PanneauColonnes gestion={gestion} onToast={setToast} onClose={() => setPanneau(false)} />}
            </div>
          )}
          <ExportMenu rows={exportRows} onExported={marquer} />
        </div>
        {vue === 'pipeline' && (
          <select className="crm-jump" onChange={(e) => allerA(e.target.value)} aria-label="Aller à l’étape">
            {cols.filter((c) => !c.masquee).map((c) => <option key={c.statut} value={c.statut}>{c.nom}</option>)}
          </select>
        )}
      </header>

      {leads && actifs.length === 0 && <div className="ec-card ec-empty"><p><b>Aucun contact pour l’instant.</b></p><p>Ils arrivent ici dès qu’ils vous sont livrés.</p></div>}

      {vue === 'journee' && actifs.length > 0 && <Journee rows={f.rows} onOpen={setOuvert} onToast={setToast} now={now} cols={cols} />}

      {vue === 'pipeline' && actifs.length > 0 && <Pipeline rows={f.rows} cols={cols} gestion={gestion} suiviPar={suiviPar} enLitige={enLitige} majSuivi={majSuivi} onOpen={setOuvert} sel={sel} setSel={setSel} onToast={setToast} boardRef={board} />}

      {vue === 'liste' && actifs.length > 0 && (
        <>
          {f.bar(false, 'Reçu')}
          <div className="ec-card ec-table-wrap">
            <table className="ec-table ec-table-click">
              <thead><tr>
                <th className="crm-th-check"><input type="checkbox" aria-label="Tout sélectionner" checked={listeRows.length > 0 && listeRows.every((l) => sel.has(l.id))} onChange={(e) => setSel(e.target.checked ? new Set(listeRows.map((l) => l.id)) : new Set())} /></th>
                <th>Reçu</th><th>Contact</th><th>Téléphone</th><th>Projet</th><th>Code postal</th><th>Étape</th><th>Montant</th><th>Prochaine action</th></tr></thead>
              <tbody>{listeRows.map((l) => { const s = suiviPar.get(l.id) || {}; return (
                <tr key={l.id} onClick={() => setOuvert(l.id)} className={sel.has(l.id) ? 'is-sel' : ''}>
                  <td className="crm-th-check" onClick={(e) => e.stopPropagation()}><input type="checkbox" aria-label={`Sélectionner ${nomComplet(l)}`} checked={sel.has(l.id)} onChange={() => basculer(l.id)} /></td>
                  <td>{dateHeure(l.livre_le)}</td><td><b>{nomComplet(l)}</b></td><td><a href={`tel:${tel(l)}`} onClick={(e) => e.stopPropagation()}>{l.telephone || '·'}</a></td>
                  <td>{THEMES[l.thematique] || l.thematique}</td><td>{l.code_postal || '·'}</td>
                  <td>{pill(l)}</td>
                  <td className="ec-num">{s.montant ? euroRond(s.montant) : '·'}</td>
                  <td>{s.rdv_le ? `RDV ${quand(s.rdv_le)}` : s.rappel_le ? `Rappel ${quand(s.rappel_le)}` : '·'}</td>
                </tr>); })}</tbody>
            </table>
          </div>
        </>
      )}

      {vue === 'rappels' && (rappels.length === 0 ? <div className="ec-card ec-empty"><p>Aucun rappel programmé. Programmez-en un depuis la fiche d’un contact.</p></div> : (
        <div className="crm-agenda">
          {[['En retard', rappels.filter((l) => new Date(suiviPar.get(l.id).rappel_le) < maintenant)], ['Aujourd’hui', rappels.filter((l) => { const d = new Date(suiviPar.get(l.id).rappel_le); return d >= maintenant && d <= finJour; })], ['Plus tard', rappels.filter((l) => new Date(suiviPar.get(l.id).rappel_le) > finJour)]]
            .filter(([, r]) => r.length).map(([t, r]) => (
              <section key={t} className={t === 'En retard' ? 'is-late' : ''}><h2>{t}<b>{r.length}</b></h2><ul>{r.map((l) => ligne(l, <span className="crm-when-txt">{quand(suiviPar.get(l.id).rappel_le)}</span>))}</ul></section>
            ))}
        </div>
      ))}

      {vue === 'agenda' && (rdvs.length === 0 ? <div className="ec-card ec-empty"><p>Aucun rendez-vous à venir. Fixez-en un depuis la fiche d’un contact.</p></div> : (
        <div className="crm-agenda">
          {parJour(rdvs, 'rdv_le').map(([d, r]) => (
            <section key={d}><h2>{new Date(d).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}<b>{r.length}</b></h2>
              <ul>{r.map((l) => ligne(l, <span className="crm-when-txt">{new Date(suiviPar.get(l.id).rdv_le).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>))}</ul></section>
          ))}
        </div>
      ))}

      {['pipeline', 'liste'].includes(vue) && <BarreSelection sel={sel} setSel={setSel} cols={cols} majSuivi={majSuivi} exportRows={exportRows} onToast={setToast} />}
      {lead && <Fiche lead={lead} client={client} litige={enLitige.get(lead.id)} apercu={apercu} onClose={() => setOuvert(null)} onSignal={setLitigeFor} onToast={setToast} />}
      {toast && <p className="crm-toast" role="status" onClick={() => setToast('')}>{toast}</p>}
      {relance && <Relance session={session} client={client} apercu={apercu} onClose={() => setRelance(false)} />}
      {litigeFor && <LitigeModal lead={litigeFor} apercu={apercu} onClose={() => setLitigeFor(null)} onDone={() => { setLitigeFor(null); reload(); }} />}
    </div>
  );
}
