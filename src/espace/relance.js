// Relance des contacts : délai légal, créneaux d'appel autorisés et plan de relance des NRP (bloc 1 « vitesse et relance »,
// décisions d'Ugo du 12/11/2026). Fonctions pures, sans base ni React : testables à part (scripts/test-relance.mjs).
//
// Source : fiche pratique DGCCRF « Les règles du démarchage téléphonique s'imposant aux entreprises », écrite le 27/07/2026,
// relue le 12/11/2026 sur economie.gouv.fr :
//   - rénovation énergétique : démarchage totalement interdit ; « Les appels en réponse à une demande explicite d'information
//     du consommateur sont toutefois autorisés sous conditions strictes : ils doivent se faire dans un délai de 5 jours
//     ouvrables et l'objet de l'appel est limité aux biens ou services pour lesquels le consommateur a demandé à être appelé » ;
//   - « du lundi au vendredi, sauf lorsque ces jours sont fériés, et seulement de 10 heures à 13 heures et de 14 heures à
//     20 heures » ; « plus de quatre fois au cours d'une période de trente jours » interdit.
// La fiche ne dit pas si les horaires et les 4 appels valent pour un rappel demandé : Ugo a choisi de les appliquer (12/11).
//
// Lecture prudente retenue (choix de Claude, à valider) : jours ouvrables = lundi à samedi hors fériés, le jour de la demande
// ne compte pas ; la limite tombe à la fin du 5e jour ouvrable. Le samedi n'étant pas un jour d'appel, le dernier appel
// possible est en pratique le dernier créneau de semaine avant cette limite. Heure de la France métropolitaine (celle du
// navigateur de l'installateur) ; jours fériés d'Alsace-Moselle non comptés.

export const MAX_APPELS = 4;
export const CRENEAUX = [[10, 0, 13, 0], [14, 0, 20, 0]];

// Plan par défaut (Ugo, 12/11/2026) : J1 à la réception, J1 fin d'après-midi, J2 matin, J4 soir.
// j = n-ième jour d'appel (lundi-vendredi hors fériés), le jour de la demande étant le jour 1 s'il en est un.
// h = 'reception' (tout de suite, ou le prochain créneau autorisé) ou une heure « HH:MM ».
export const PLAN_DEFAUT = [{ j: 1, h: 'reception' }, { j: 1, h: '17:00' }, { j: 2, h: '10:30' }, { j: 4, h: '18:00' }];

const jourSeul = (d) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
const cle = (d) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

// Dimanche de Pâques (algorithme de Meeus/Jones/Butcher).
function paques(y) {
  const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
  return new Date(y, Math.floor((h + l - 7 * m + 114) / 31) - 1, ((h + l - 7 * m + 114) % 31) + 1);
}
const cacheFeries = new Map();
// Les 11 jours fériés nationaux (code du travail, art. L3133-1), lundi de Pentecôte compris.
export function feries(y) {
  if (cacheFeries.has(y)) return cacheFeries.get(y);
  const p = paques(y);
  const plus = (n) => new Date(p.getFullYear(), p.getMonth(), p.getDate() + n);
  const s = new Set([new Date(y, 0, 1), plus(1), new Date(y, 4, 1), new Date(y, 4, 8), plus(39), plus(50), new Date(y, 6, 14),
    new Date(y, 7, 15), new Date(y, 10, 1), new Date(y, 10, 11), new Date(y, 11, 25)].map(cle));
  cacheFeries.set(y, s);
  return s;
}
export const estFerie = (d) => feries(d.getFullYear()).has(cle(d));
export const estOuvrable = (d) => d.getDay() !== 0 && !estFerie(d);
export const estJourAppel = (d) => d.getDay() !== 0 && d.getDay() !== 6 && !estFerie(d);

// Fin du délai légal : fin du 5e jour ouvrable qui suit le jour de la demande.
export function dateLimite(demande) {
  if (!demande) return null;
  const d = jourSeul(demande);
  let n = 0;
  while (n < 5) { d.setDate(d.getDate() + 1); if (estOuvrable(d)) n += 1; }
  d.setHours(23, 59, 59, 999);
  return d;
}

const aHeure = (jour, h, m) => { const x = new Date(jour); x.setHours(h, m, 0, 0); return x; };
// Vrai si l'instant tombe dans un créneau d'appel autorisé.
export function dansCreneau(t) {
  const d = new Date(t);
  if (!estJourAppel(d)) return false;
  const min = d.getHours() * 60 + d.getMinutes();
  return CRENEAUX.some(([h1, m1, h2, m2]) => min >= h1 * 60 + m1 && min < h2 * 60 + m2);
}
// Premier instant autorisé à partir de t (t lui-même s'il est dans un créneau).
export function prochainCreneau(t) {
  const d = new Date(t);
  for (let i = 0; i < 30; i += 1) {
    const jour = jourSeul(d); jour.setDate(jour.getDate() + i);
    if (!estJourAppel(jour)) continue;
    for (const [h1, m1, h2, m2] of CRENEAUX) {
      const a = aHeure(jour, h1, m1), b = aHeure(jour, h2, m2);
      if (d < b) return d > a ? d : a;
    }
  }
  return null;
}
// Fin du créneau en cours (pour « autorisé jusqu'à 13 h »), ou null hors créneau.
export function finCreneau(t) {
  const d = new Date(t);
  if (!dansCreneau(d)) return null;
  for (const [h1, m1, h2, m2] of CRENEAUX) { const a = aHeure(d, h1, m1), b = aHeure(d, h2, m2); if (d >= a && d < b) return b; }
  return null;
}
// Dernier instant d'appel possible avant la limite légale.
export function dernierAppel(demande) {
  const lim = dateLimite(demande);
  if (!lim) return null;
  const d = jourSeul(lim);
  for (let i = 0; i < 15; i += 1) {
    if (estJourAppel(d) && d >= jourSeul(demande)) { const [, , h2, m2] = CRENEAUX[CRENEAUX.length - 1]; return aHeure(d, h2, m2); }
    d.setDate(d.getDate() - 1);
  }
  return null;
}

// Liste des jours d'appel à partir du jour de la demande (le jour 1 est le jour de la demande s'il est un jour d'appel).
function joursAppel(demande, n) {
  const out = []; const d = jourSeul(demande);
  for (let i = 0; out.length < n && i < 40; i += 1) { if (estJourAppel(d)) out.push(new Date(d)); d.setDate(d.getDate() + 1); }
  return out;
}

export function planValide(plan) {
  if (!Array.isArray(plan) || plan.length === 0 || plan.length > MAX_APPELS) return false;
  return plan.every((x) => Number.isInteger(x?.j) && x.j >= 1 && x.j <= 5 && (x.h === 'reception' || /^([01]\d|2[0-3]):[0-5]\d$/.test(x.h || '')));
}
export const planDe = (prefs) => (planValide(prefs?.plan_relance) ? prefs.plan_relance : PLAN_DEFAUT);

// Moment prévu de la tentative n° (index + 1) selon le plan, recalé dans un créneau autorisé et jamais avant « maintenant ».
// Renvoie null quand le plan est épuisé, que les 4 appels sont faits ou que le délai légal est passé.
export function prochaineTentative(demande, faites, plan = PLAN_DEFAUT, maintenant = new Date()) {
  if (!demande || faites >= MAX_APPELS || faites >= plan.length) return null;
  const etape = plan[faites];
  const jours = joursAppel(demande, 6);
  const jour = jours[Math.min(etape.j, jours.length) - 1];
  let cible;
  if (etape.h === 'reception') cible = new Date(Math.max(new Date(demande).getTime(), jour.getTime()));
  else { const [h, m] = etape.h.split(':').map(Number); cible = aHeure(jour, h, m); }
  if (cible < maintenant) cible = new Date(maintenant);
  const t = prochainCreneau(cible);
  const fin = dernierAppel(demande);
  if (!t || (fin && t >= fin)) return null;
  return t;
}

// État légal d'un contact à un instant donné.
export function etatDelai(demande, maintenant = new Date()) {
  const fin = dernierAppel(demande);
  if (!fin) return { fin: null, reste: null, depasse: false, urgent: false };
  const reste = fin.getTime() - new Date(maintenant).getTime();
  return { fin, reste, depasse: reste <= 0, urgent: reste > 0 && reste < 24 * 3600000 };
}

// Durées lisibles : « 12 min », « 3 h 05 », « 2 j 4 h ».
export function duree(ms) {
  const min = Math.max(0, Math.round(ms / 60000));
  if (min < 60) return `${Math.max(1, min)} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h} h ${String(min % 60).padStart(2, '0')}`;
  return `${Math.floor(h / 24)} j ${h % 24} h`;
}

// ─ Modèles de SMS (« Générer un SMS », Ugo, 12/11/2026 : l'installateur copie le texte et l'envoie lui-même) ─
// Variables remplacées : {prenom} {nom} {projet} {ville} {entreprise} {signataire} {rdv}.
export const VARIABLES = [['{prenom}', 'Prénom du contact'], ['{projet}', 'Projet demandé'], ['{ville}', 'Ville'], ['{entreprise}', 'Votre société'], ['{signataire}', 'Votre prénom'], ['{rdv}', 'Date du rendez-vous']];
export function remplir(texte, v) {
  const elide = v.entreprise && /^[aeiouyhâàéèêëîïôûAEIOUYHÂÀÉÈÊËÎÏÔÛ]/.test(v.entreprise);
  return String(texte || '').replace(/\b([Dd])e \{entreprise\}/g, (_, d) => (elide ? `${d}’{entreprise}` : `${d}e {entreprise}`))
    .replace(/\{(prenom|nom|projet|ville|entreprise|signataire|rdv)\}/g, (_, k) => v[k] || '')
    .replace(/[ \t]+([,.])/g, '$1').replace(/[ \t]{2,}/g, ' ').replace(/ +\n/g, '\n').trim();
}
// Numéro au format international pour WhatsApp (wa.me) : 06 12 34 56 78 → 33612345678.
export function numeroIntl(tel) {
  const d = String(tel || '').replace(/[^\d+]/g, '');
  if (d.startsWith('+')) return d.slice(1);
  if (d.startsWith('00')) return d.slice(2);
  if (d.startsWith('0') && d.length === 10) return `33${d.slice(1)}`;
  return d;
}
