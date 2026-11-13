import { useCallback } from 'react';
import { db } from './db.js';
import { useData } from './data.js';

// Colonnes du pipeline propres à chaque client (Ugo, 13/11/2026 : « créer des nouvelles colonnes, modifier le nom des
// colonnes » ; choix cliqué : renommer, réordonner, masquer, et nouvelles colonnes typées). Table crm_colonnes
// (supabase/2026-11-13-colonnes-montant.sql). Sans réglage enregistré, ce sont les 7 colonnes Kairn.
// Une colonne créée a pour étape « col:<id> » dans lead_suivi.statut ; son type dit comment l'espace la traite :
//   relance  : le contact reste dans Ma journée, le plan de relance et le délai légal s'appliquent ;
//   en_cours : contact joint, affaire en cours (comme RDV pris ou Devis envoyé) ;
//   gagne    : compté comme signé ; perdu : compté comme perdu.

export const TYPES = { relance: 'À relancer', en_cours: 'En cours', gagne: 'Gagné', perdu: 'Perdu' };
export const COULEURS = ['#2F5BEA', '#94A3B8', '#D97706', '#0EA5E9', '#7C3AED', '#16A34A', '#64748B', '#DB2777', '#0D9488', '#CA8A04'];
const COULEUR_TYPE = { relance: '#D97706', en_cours: '#0EA5E9', gagne: '#16A34A', perdu: '#64748B' };

export const BASE = [
  { cle: 'a_appeler', nom: 'Nouveau', type: 'relance', couleur: '#2F5BEA' },
  { cle: 'nrp', nom: 'NRP', type: 'relance', couleur: '#94A3B8' },
  { cle: 'a_rappeler', nom: 'À rappeler', type: 'relance', couleur: '#D97706' },
  { cle: 'rdv', nom: 'RDV pris', type: 'en_cours', couleur: '#0EA5E9' },
  { cle: 'devis', nom: 'Devis envoyé', type: 'en_cours', couleur: '#7C3AED' },
  { cle: 'signe', nom: 'Signé', type: 'gagne', couleur: '#16A34A' },
  { cle: 'perdu', nom: 'Perdu', type: 'perdu', couleur: '#64748B' },
];
const BASE_PAR_CLE = Object.fromEntries(BASE.map((c) => [c.cle, c]));

// Liste complète, dans l'ordre : colonnes de base (avec le réglage du client) et colonnes créées.
// Chaque colonne : { id?, cle, statut, nom, type, couleur, ordre, masquee, perso }.
export function listeColonnes(rows) {
  const r = rows || [];
  const base = BASE.map((b, i) => {
    const x = r.find((y) => y.cle === b.cle);
    return { ...b, id: x?.id, statut: b.cle, nom: x?.nom || b.nom, couleur: x?.couleur || b.couleur, ordre: x ? x.ordre : i * 10, masquee: b.cle === 'a_appeler' ? false : Boolean(x?.masquee), perso: false };
  });
  const perso = r.filter((x) => !x.cle).map((x) => ({ id: x.id, cle: null, statut: `col:${x.id}`, nom: x.nom, type: x.type, couleur: x.couleur || COULEUR_TYPE[x.type], ordre: x.ordre, masquee: Boolean(x.masquee), perso: true }));
  return [...base, ...perso].sort((a, b) => a.ordre - b.ordre);
}

// Étape de base équivalente, pour la logique (relances, chiffres) : une colonne créée prend celle de son type.
const EQUIV = { relance: 'nrp', en_cours: 'rdv', gagne: 'signe', perdu: 'perdu' };
export function etapeBase(statut, colonnes) {
  if (!statut) return 'a_appeler';
  if (BASE_PAR_CLE[statut]) return statut;
  const c = (colonnes || []).find((x) => x.statut === statut);
  return c ? EQUIV[c.type] : 'a_appeler';
}
export const typeDe = (statut, colonnes) => (BASE_PAR_CLE[statut] ? BASE_PAR_CLE[statut].type : (colonnes || []).find((x) => x.statut === statut)?.type || 'relance');
export const nomDe = (statut, colonnes) => (colonnes || []).find((x) => x.statut === statut)?.nom || BASE_PAR_CLE[statut]?.nom || 'Nouveau';
export const couleurDe = (statut, colonnes) => (colonnes || []).find((x) => x.statut === statut)?.couleur || BASE_PAR_CLE[statut]?.couleur || '#2F5BEA';

const uuid = () => (globalThis.crypto?.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => { const r = (Math.random() * 16) | 0; return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16); }));

// Enregistrement du réglage : toute la liste est réécrite (ordre compris) ; une colonne créée a un id dès sa création.
export function useColonnes(apercu) {
  const { colonnes: rows, setColonnes } = useData();
  const liste = listeColonnes(rows);
  const ecrire = useCallback(async (next) => {
    const lignes = next.map((c, i) => ({ id: c.id || uuid(), cle: c.cle, nom: c.nom.trim().slice(0, 40), type: c.type, ordre: i * 10, masquee: Boolean(c.masquee), couleur: c.couleur || null }));
    const avant = rows;
    setColonnes(lignes);
    if (apercu) return true;
    const { error } = await db.from('crm_colonnes').upsert(lignes, { onConflict: 'id' });
    if (error) { setColonnes(avant); return false; }
    return true;
  }, [rows, setColonnes, apercu]);
  const renommer = (statut, nom) => ecrire(liste.map((c) => (c.statut === statut ? { ...c, nom } : c)));
  const masquer = (statut, masquee) => ecrire(liste.map((c) => (c.statut === statut ? { ...c, masquee } : c)));
  const deplacer = (statut, sens) => {
    const l = [...liste]; const i = l.findIndex((c) => c.statut === statut); const j = i + sens;
    if (i < 0 || j < 0 || j >= l.length) return Promise.resolve(true);
    [l[i], l[j]] = [l[j], l[i]];
    return ecrire(l);
  };
  const changerType = (statut, type) => ecrire(liste.map((c) => (c.statut === statut && c.perso ? { ...c, type } : c)));
  const changerCouleur = (statut, couleur) => ecrire(liste.map((c) => (c.statut === statut ? { ...c, couleur } : c)));
  // Nouvelle colonne, placée juste avant la première colonne gagnée (ou à la fin).
  const ajouter = async (nom, type) => {
    const col = { id: uuid(), cle: null, nom, type, couleur: COULEUR_TYPE[type], masquee: false, perso: true };
    const l = [...liste]; const k = l.findIndex((c) => c.type === 'gagne');
    l.splice(k < 0 ? l.length : k, 0, col);
    return (await ecrire(l)) ? `col:${col.id}` : null;
  };
  const supprimer = async (statut) => {
    const c = liste.find((x) => x.statut === statut);
    if (!c?.perso) return false;
    if (!apercu) { const { error } = await db.from('crm_colonnes').delete().eq('id', c.id); if (error) return false; }
    setColonnes((rows || []).filter((x) => x.id !== c.id));
    return true;
  };
  return { liste, renommer, masquer, deplacer, changerType, changerCouleur, ajouter, supprimer };
}
