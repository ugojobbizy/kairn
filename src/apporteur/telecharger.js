import { db, appareilHeaders } from '../espace/db.js';

// Téléchargement d'un PDF produit par api/apporteur.js (contrat signé, relevé à facturer).
export async function telecharger(action, nom, id) {
  const { data } = await db.auth.getSession();
  const r = await fetch('/api/apporteur', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${data.session?.access_token}`, ...appareilHeaders() }, body: JSON.stringify({ action, ...(id ? { id } : {}) }) }).catch(() => null);
  if (!r || !r.ok) return (await r?.json().catch(() => ({})))?.error || 'erreur';
  const url = URL.createObjectURL(await r.blob());
  const a = document.createElement('a');
  a.href = url; a.download = nom; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
  return '';
}
export const telechargerReleve = (id) => telecharger('releve', 'releve-commissions-kairn.pdf', id);
