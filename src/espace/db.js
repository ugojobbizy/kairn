import { createClient } from '@supabase/supabase-js';

// Client Supabase commun à l'espace client (/espace) et à Kairn Admin (/gestion) : base « kairn », clé publique.
// Même clé de session des deux côtés : Ugo se connecte une fois.
const URL = 'https://bmqvlwdbwfnafuovzzhi.supabase.co';
const KEY = 'sb_publishable_xyIez0a8masZaN3RM_GQIw_e4KyILCV';
export const db = createClient(URL, KEY, { auth: { storageKey: 'kairn-espace-auth' } });

export const THEMES = { PAC: 'Pompe à chaleur', ITE: 'Isolation extérieure', PPV: 'Photovoltaïque' };
export const MOTIFS = { doublon: 'Doublon', hors_zone: 'Hors zone' };
export const LITIGE_STATUTS = { en_attente: 'En attente', accepte: 'Accepté', refuse: 'Refusé' };
export const TVA = 0.2;

// Étapes de campagne (décision d'Ugo du 29/10/2026) : le client les voit dans Mes commandes, Ugo les change dans Kairn Admin.
export const ETAPES = [['recue', 'Demande reçue'], ['preparation', 'En préparation'], ['lancee', 'Campagne lancée'], ['terminee', 'Terminée']];

// Alerte Telegram d'Ugo (api/notif.js). Sans effet bloquant : une alerte ratée ne casse jamais l'action du client.
export async function notifier(type, id) {
  try {
    const { data } = await db.auth.getSession();
    const token = data.session?.access_token;
    if (!token || !id) return;
    await fetch('/api/notif', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ type, id }) });
  } catch { /* alerte facultative */ }
}

export const euro = (n) => `${Number(n || 0).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
export const dateFr = (d) => (d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '·');
export const dateHeure = (d) => (d ? new Date(d).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '·');

// Messages lisibles pour les erreurs levées par les fonctions SQL.
export function errMsg(e) {
  const m = String(e?.message || e || '');
  if (m.includes('plus_disponible')) return 'Ces leads viennent d’être achetés par quelqu’un d’autre. Rechargez la liste.';
  if (m.includes('pas_client')) return 'Votre espace n’est pas encore ouvert.';
  if (m.includes('compte_introuvable')) return 'Aucun compte Supabase avec cet e-mail : créez-le d’abord (Authentication, Add user).';
  if (m.includes('litige_deja_traite')) return 'Ce litige a déjà été tranché.';
  if (m.includes('duplicate key') && m.includes('litiges')) return 'Un litige existe déjà pour ce lead.';
  if (m.includes('interdit')) return 'Accès réservé à l’administration Kairn.';
  return 'L’opération n’a pas abouti. Réessayez dans un instant.';
}

// Export CSV (séparateur point-virgule, lu tel quel par Excel en français).
export function downloadCsv(name, cols, rows) {
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const csv = [cols.map((c) => esc(c[1])).join(';'), ...rows.map((r) => cols.map((c) => esc(typeof c[0] === 'function' ? c[0](r) : r[c[0]])).join(';'))].join('\r\n');
  const url = URL_.createObjectURL(new Blob([`﻿${csv}`], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url; a.download = name; a.click();
  setTimeout(() => URL_.revokeObjectURL(url), 1000);
}
const URL_ = typeof window !== 'undefined' ? window.URL : null;
