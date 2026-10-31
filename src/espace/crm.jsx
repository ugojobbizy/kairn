import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { db, THEMES, MOTIFS, LITIGE_STATUTS, SUIVI, MOTIFS_PERTE, TVA, euro, dateFr, dateHeure, errMsg, downloadCsv, notifier } from './db.js';
import { PRODUITS } from '../v3/produits.js';
import { useData } from './data.js';

// CRM de l'espace client « Mes contacts » (Ugo, 30/10/2026 : « prends la même base que le CRM que j'ai fait pour ETXE Énergie
// et pour Isolation d'Aquitaine »). Même logique que ~/combles-crm (AdminShell, LeadDrawer) : pipeline en colonnes avec
// glisser-déposer, fiche latérale (appel, SMS, e-mail, étape, rendez-vous et lien Google Agenda, rappel, motif de perte,
// notes et fil d'activité), vues Liste, Rappels et Agenda ; sur mobile, colonnes en défilement avec accès direct à une étape.
// Données : table lead_suivi et journal lead_suivi_journal (supabase/2026-10-30-crm-client.sql).

export const ETAPES_CRM = Object.keys(SUIVI);
const TON = { a_appeler: '#2F5BEA', nrp: '#94A3B8', a_rappeler: '#D97706', rdv: '#0EA5E9', devis: '#7C3AED', signe: '#16A34A', perdu: '#64748B' };

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
const quand = (d) => new Date(d).toLocaleString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
function smsHref(l, client) {
  const t = (THEMES[l.thematique] || 'votre projet').toLowerCase();
  const corps = `Bonjour ${l.prenom || ''}, vous avez demandé à être rappelé pour votre projet (${t}). Je vous appelle dans quelques minutes.${client?.societe ? ` ${client.societe}` : ''}`;
  return `sms:${tel(l)}?&body=${encodeURIComponent(corps.replace(/\s+/g, ' ').trim())}`;
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
  return { rows: out, bar, q, setQ, them, setThem };
}

// ─ export : Excel (point-virgule), CSV standard (Google Sheets, CRM), ou copie à coller ─
const COLS = [['livre_le', 'Reçu le'], ['thematique', 'Thématique'], ['prenom', 'Prénom'], ['nom', 'Nom'], ['telephone', 'Téléphone'], ['email', 'E-mail'],
  ['code_postal', 'Code postal'], ['ville', 'Ville'], ['statut_occupation', 'Statut d’occupation'], ['type_logement', 'Type de logement'], ['chauffage', 'Chauffage'],
  ['surface', 'Surface'], ['_etape', 'Étape'], ['_rdv', 'Rendez-vous'], ['_rappel', 'Rappel'], ['_motif', 'Motif de perte'], ['_note', 'Dernière note']];
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
function Carte({ lead: l, sv, litige, onOpen, onDrag, dragging }) {
  const rdv = sv?.rdv_le && new Date(sv.rdv_le) > new Date(Date.now() - 3600000);
  const rappel = sv?.rappel_le;
  const enRetard = rappel && new Date(rappel) < new Date();
  return (
    <div role="button" tabIndex={0} draggable className={`crm-card${dragging ? ' is-drag' : ''}${!sv && Date.now() - new Date(l.livre_le).getTime() < 3600000 ? ' is-fresh' : ''}`}
      onClick={() => onOpen(l.id)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(l.id); } }}
      onDragStart={(e) => { e.dataTransfer.setData('text/plain', l.id); e.dataTransfer.effectAllowed = 'move'; onDrag(l.id); }} onDragEnd={() => onDrag(null)}>
      <div className="crm-card-top">
        <span className="crm-av">{initiales(l)}</span>
        <div className="crm-card-who"><b>{nomComplet(l)}</b><span>{[l.code_postal, l.ville].filter(Boolean).join(' ')}</span></div>
        <span className="crm-age">{age(l.livre_le)}</span>
      </div>
      <p className="crm-card-them">{THEMES[l.thematique] || l.thematique}</p>
      <div className="crm-tags">
        {[l.statut_occupation, l.type_logement, l.chauffage].filter(Boolean).map((t) => <span key={t}>{t}</span>)}
      </div>
      {(rdv || rappel || litige || sv?.motif_perte) && (
        <div className="crm-badges">
          {rdv && <span className="is-rdv"><Ico d={I.cal} size={12} />{quand(sv.rdv_le)}</span>}
          {rappel && <span className={enRetard ? 'is-late' : 'is-rappel'}><Ico d={I.bell} size={12} />{quand(rappel)}</span>}
          {sv?.motif_perte && <span>{MOTIFS_PERTE[sv.motif_perte] || sv.motif_perte}</span>}
          {litige && <span className="is-lit">Litige {LITIGE_STATUTS[litige.statut].toLowerCase()}</span>}
        </div>
      )}
    </div>
  );
}

// ─ fiche latérale ─
function Fiche({ lead: l, client, litige, apercu, onClose, onSignal }) {
  const { suiviPar, journalPar, majSuivi, noter } = useData();
  const sv = suiviPar.get(l.id) || { statut: 'a_appeler', rappel_le: null, rdv_le: null, motif_perte: null };
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
          <div><b>{nomComplet(l)}</b><span>Reçu le {dateHeure(l.livre_le)} · il y a {age(l.livre_le)}</span></div>
          <button type="button" className="crm-x" aria-label="Fermer" onClick={onClose}><Ico d={I.x} size={18} /></button>
        </header>
        <div className="crm-drawer-body">
          <div className="crm-actions">
            <a className="crm-call" href={`tel:${tel(l)}`}><Ico d={I.tel} size={18} />Appeler</a>
            <a className="crm-act" href={smsHref(l, client)}><Ico d={I.sms} size={18} />SMS</a>
            {l.email && <a className="crm-act" href={`mailto:${l.email}`}><Ico d={I.mail} size={18} />E-mail</a>}
          </div>

          <section><h3>Étape</h3>
            <div className="crm-steps">{ETAPES_CRM.map((k) => <button type="button" key={k} style={{ '--c': TON[k] }} className={sv.statut === k ? 'is-on' : ''} aria-pressed={sv.statut === k} onClick={() => set({ statut: k })}>{SUIVI[k]}</button>)}</div>
            {sv.statut === 'perdu' && (
              <label className="crm-field"><span>Motif de perte</span>
                <select value={sv.motif_perte || ''} onChange={(e) => set({ motif_perte: e.target.value || null })}><option value="">Choisir un motif…</option>{Object.entries(MOTIFS_PERTE).map(([k, t]) => <option key={k} value={k}>{t}</option>)}</select>
              </label>
            )}
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
              <input type="datetime-local" value={toLocal(sv.rdv_le)} onChange={(e) => set({ rdv_le: fromLocal(e.target.value), ...(e.target.value && ['a_appeler', 'nrp', 'a_rappeler'].includes(sv.statut) ? { statut: 'rdv' } : {}) })} />
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
                  <i style={{ background: j.type === 'note' ? '#CBD5E1' : TON[j.statut] }} />
                  <div>{j.type === 'note' ? <p>{j.texte}</p> : <p>Étape : <b>{SUIVI[j.statut] || j.statut}</b></p>}<span>{dateHeure(j.cree_le)}</span></div>
                </li>
              ))}
              <li><i style={{ background: TON.a_appeler }} /><div><p>Contact reçu</p><span>{dateHeure(l.livre_le)}</span></div></li>
            </ol>
          </section>

          <footer className="crm-drawer-foot">
            {litige ? <span className={`ec-status is-${litige.statut}`}>Litige {LITIGE_STATUTS[litige.statut].toLowerCase()}</span>
              : <button type="button" className="ec-link-btn" onClick={() => onSignal(l)}>Signaler un doublon ou un hors zone</button>}
            {apercu && <span className="ec-muted">Aperçu : rien n’est enregistré</span>}
          </footer>
        </div>
      </aside>
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

// ─ Mes contacts ─
export default function Contacts({ apercu, client, session }) {
  const { leads, litiges, suiviPar, journalPar, majSuivi, reload } = useData();
  const [params, setParams] = useSearchParams();
  const vue = params.get('vue') || 'pipeline';
  const setVue = (v) => { const p = new URLSearchParams(params); p.set('vue', v); setParams(p, { replace: true }); };
  const [ouvert, setOuvert] = useState(null);
  const [litigeFor, setLitigeFor] = useState(null);
  const [relance, setRelance] = useState(false);
  const [drag, setDrag] = useState(null);
  const [over, setOver] = useState(null);
  const board = useRef(null);
  const enLitige = useMemo(() => new Map((litiges || []).map((g) => [g.lead_id, g])), [litiges]);
  const actifs = useMemo(() => (leads || []).filter((l) => !l.annule).sort((a, b) => String(b.livre_le).localeCompare(String(a.livre_le))), [leads]);
  const f = useFilters(actifs, 'livre_le');
  const st = (l) => (suiviPar.get(l.id) || {}).statut || 'a_appeler';
  const parEtape = useMemo(() => { const m = Object.fromEntries(ETAPES_CRM.map((k) => [k, []])); for (const l of f.rows) (m[st(l)] || m.a_appeler).push(l); return m; }, [f.rows, suiviPar]);
  const maintenant = Date.now();
  const finJour = new Date(); finJour.setHours(23, 59, 59, 999);
  const rappels = f.rows.filter((l) => suiviPar.get(l.id)?.rappel_le && !['signe', 'perdu'].includes(st(l))).sort((a, b) => suiviPar.get(a.id).rappel_le.localeCompare(suiviPar.get(b.id).rappel_le));
  const rdvs = f.rows.filter((l) => suiviPar.get(l.id)?.rdv_le && new Date(suiviPar.get(l.id).rdv_le) > maintenant - 86400000).sort((a, b) => suiviPar.get(a.id).rdv_le.localeCompare(suiviPar.get(b.id).rdv_le));
  const rappelsDus = rappels.filter((l) => new Date(suiviPar.get(l.id).rappel_le) <= finJour).length;
  const lead = ouvert && (leads || []).find((l) => l.id === ouvert);
  const exportRows = f.rows.map((l) => {
    const s = suiviPar.get(l.id) || {}; const j = (journalPar.get(l.id) || []).filter((x) => x.type === 'note').sort((a, b) => String(b.cree_le).localeCompare(String(a.cree_le)))[0];
    return { ...l, _etape: SUIVI[st(l)], _rdv: s.rdv_le ? dateHeure(s.rdv_le) : '', _rappel: s.rappel_le ? dateHeure(s.rappel_le) : '', _motif: s.motif_perte ? MOTIFS_PERTE[s.motif_perte] || s.motif_perte : '', _note: j?.texte || '' };
  });
  async function marquer() {
    const ids = f.rows.filter((r) => !r.exporte_le).map((r) => r.id);
    if (ids.length && !apercu) { await db.rpc('leads_marquer_exportes', { p_ids: ids }); reload(); }
  }
  function deposer(id, etape) {
    setOver(null); setDrag(null);
    if (!id || st({ id }) === etape) return;
    majSuivi(id, { statut: etape });
    if (etape === 'perdu') setOuvert(id);
  }
  const allerA = (k) => board.current?.querySelector(`[data-etape="${k}"]`)?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });

  const ligne = (l, extra) => (
    <li key={l.id}><button type="button" onClick={() => setOuvert(l.id)}>
      <span className="crm-av">{initiales(l)}</span>
      <span className="crm-line-who"><b>{nomComplet(l)}</b><small>{[THEMES[l.thematique], l.code_postal].filter(Boolean).join(' · ')}</small></span>
      <span className="crm-pill" style={{ '--c': TON[st(l)] }}>{SUIVI[st(l)]}</span>
      {extra}
    </button></li>
  );
  const parJour = (rows, key) => {
    const g = new Map();
    for (const l of rows) { const d = jour(suiviPar.get(l.id)[key]); if (!g.has(d)) g.set(d, []); g.get(d).push(l); }
    return [...g.entries()];
  };

  return (
    <div className="crm">
      <header className="crm-head">
        <div className="crm-head-top">
          <div className="crm-title"><h1>Mes contacts</h1><button type="button" className="ec-btn crm-relancer" onClick={() => setRelance(true)}><Ico d={<path d="M21 12a9 9 0 1 1-2.6-6.4M21 4v5h-5" />} />Relancer une campagne</button></div>
          <div className="crm-stats">
            <span><b>{parEtape.a_appeler.length}</b>nouveaux</span>
            <span className={rappelsDus ? 'is-warn' : ''}><b>{rappelsDus}</b>rappels aujourd’hui</span>
            <span><b>{rdvs.filter((l) => new Date(suiviPar.get(l.id).rdv_le) >= maintenant).length}</b>RDV à venir</span>
            <span className="is-ok"><b>{parEtape.signe.length}</b>signés</span>
          </div>
        </div>
        <div className="crm-toolbar">
          <input className="crm-search" value={f.q} onChange={(e) => f.setQ(e.target.value)} placeholder="Nom, téléphone, code postal…" aria-label="Rechercher un contact" />
          <select className="crm-select" value={f.them} onChange={(e) => f.setThem(e.target.value)} aria-label="Thématique"><option value="">Toutes les thématiques</option>{Object.entries(THEMES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
          <div className="crm-views" role="tablist" aria-label="Affichage">
            {[['pipeline', 'Pipeline'], ['liste', 'Liste'], ['rappels', `Rappels${rappelsDus ? ` (${rappelsDus})` : ''}`], ['agenda', 'Agenda']].map(([k, t]) => <button type="button" role="tab" aria-selected={vue === k} key={k} className={vue === k ? 'is-on' : ''} onClick={() => setVue(k)}>{t}</button>)}
          </div>
          <ExportMenu rows={exportRows} onExported={marquer} />
        </div>
        {vue === 'pipeline' && (
          <select className="crm-jump" onChange={(e) => allerA(e.target.value)} aria-label="Aller à l’étape">
            {ETAPES_CRM.map((k) => <option key={k} value={k}>{SUIVI[k]} ({parEtape[k].length})</option>)}
          </select>
        )}
      </header>

      {leads && actifs.length === 0 && <div className="ec-card ec-empty"><p><b>Aucun contact pour l’instant.</b></p><p>Ils arrivent ici dès qu’ils vous sont livrés.</p></div>}

      {vue === 'pipeline' && actifs.length > 0 && (
        <div className="crm-board" ref={board}>
          {ETAPES_CRM.map((k) => (
            <section key={k} data-etape={k} className={`crm-col${over === k ? ' is-over' : ''}`} style={{ '--c': TON[k] }}
              onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; if (over !== k) setOver(k); }}
              onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setOver(null); }}
              onDrop={(e) => { e.preventDefault(); deposer(e.dataTransfer.getData('text/plain') || drag, k); }}>
              <h2><i />{SUIVI[k]}<b>{parEtape[k].length}</b></h2>
              <div className="crm-col-body">
                {parEtape[k].slice(0, 80).map((l) => <Carte key={l.id} lead={l} sv={suiviPar.get(l.id)} litige={enLitige.get(l.id)} onOpen={setOuvert} onDrag={setDrag} dragging={drag === l.id} />)}
                {parEtape[k].length > 80 && <p className="crm-more">+ {parEtape[k].length - 80} autres : utilisez la recherche ou la liste</p>}
                {parEtape[k].length === 0 && <p className="crm-empty">{k === 'a_appeler' ? 'Les nouveaux contacts arrivent ici.' : 'Glissez une carte ici'}</p>}
              </div>
            </section>
          ))}
        </div>
      )}

      {vue === 'liste' && actifs.length > 0 && (
        <>
          {f.bar(false, 'Reçu')}
          <div className="ec-card ec-table-wrap">
            <table className="ec-table ec-table-click">
              <thead><tr><th>Reçu</th><th>Contact</th><th>Téléphone</th><th>Projet</th><th>Code postal</th><th>Étape</th><th>Prochaine action</th></tr></thead>
              <tbody>{f.rows.slice(0, 500).map((l) => { const s = suiviPar.get(l.id) || {}; return (
                <tr key={l.id} onClick={() => setOuvert(l.id)}>
                  <td>{dateHeure(l.livre_le)}</td><td><b>{nomComplet(l)}</b></td><td><a href={`tel:${tel(l)}`} onClick={(e) => e.stopPropagation()}>{l.telephone || '·'}</a></td>
                  <td>{THEMES[l.thematique] || l.thematique}</td><td>{l.code_postal || '·'}</td>
                  <td><span className="crm-pill" style={{ '--c': TON[st(l)] }}>{SUIVI[st(l)]}</span></td>
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

      {lead && <Fiche lead={lead} client={client} litige={enLitige.get(lead.id)} apercu={apercu} onClose={() => setOuvert(null)} onSignal={setLitigeFor} />}
      {relance && <Relance session={session} client={client} apercu={apercu} onClose={() => setRelance(false)} />}
      {litigeFor && <LitigeModal lead={litigeFor} apercu={apercu} onClose={() => setLitigeFor(null)} onDone={() => { setLitigeFor(null); reload(); }} />}
    </div>
  );
}
