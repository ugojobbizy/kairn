// Trafic du site pour l'agent de contenu (22/11/2026).
// - importerGsc : lit la Search Console (API Search Analytics, compte de service en lecture) et range les lignes
//   jour × page (table gsc_pages, totaux exacts) et jour × page × requête (table gsc). Appelé chaque jour par /api/keepalive. Sans compte de service (GSC_SA_JSON ou reglages_serveur.gsc_sa_json), ne fait rien.
// - rapportTrafic : chiffres agrégés de N jours (visites, sources, pages, demandes, Search Console) et des N jours d'avant,
//   sans aucune donnée personnelle (pas de téléphone, de nom ni d'e-mail). Lu par l'agent via /api/notif (jeton AGENT_JETON).
import crypto from 'node:crypto';
import { adminFetch } from './_auth-admin.js';

const SITE_GSC = process.env.GSC_SITE || 'sc-domain:kairnagency.com';
const jourIso = (d) => d.toISOString().slice(0, 10);
const ilYa = (n) => new Date(Date.now() - n * 86400000);

// Secrets rangés dans la table reglages_serveur (illisible avec la clé publique), à défaut de variables Vercel.
export async function reglage(cle) {
  const r = await adminFetch(`/rest/v1/reglages_serveur?select=valeur&cle=eq.${encodeURIComponent(cle)}`);
  return r.ok && r.body?.[0] ? r.body[0].valeur : null;
}

async function jetonGoogle(brut) {
  const sa = JSON.parse(brut);
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
  const now = Math.floor(Date.now() / 1000);
  const corps = `${b64({ alg: 'RS256', typ: 'JWT' })}.${b64({ iss: sa.client_email, scope: 'https://www.googleapis.com/auth/webmasters.readonly', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 })}`;
  const sig = crypto.createSign('RSA-SHA256').update(corps).sign(sa.private_key, 'base64url');
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${corps}.${sig}` }),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(`google_token_${r.status}: ${JSON.stringify(j).slice(0, 200)}`);
  return j.access_token;
}

export async function importerGsc() {
  const brut = process.env.GSC_SA_JSON || await reglage('gsc_sa_json');
  if (!brut) return { skipped: 'compte de service Search Console absent' };
  const token = await jetonGoogle(brut);
  // Premier import : 90 jours ; ensuite les 10 derniers jours (Google complète ses chiffres pendant quelques jours).
  const vide = await adminFetch('/rest/v1/gsc_pages?select=jour&limit=1');
  const debut = jourIso(ilYa(vide.ok && vide.body?.length ? 10 : 90));
  const fin = jourIso(ilYa(1));
  // gsc_pages : totaux exacts par page ; gsc : détail par requête (Google y masque les requêtes rares).
  const pages = await importer(token, debut, fin, ['date', 'page'], 'gsc_pages', 'jour,page', (x) => ({ jour: x.keys[0], page: chemin(x.keys[1]) }));
  const requetes = await importer(token, debut, fin, ['date', 'page', 'query'], 'gsc', 'jour,page,requete', (x) => ({ jour: x.keys[0], page: chemin(x.keys[1]), requete: x.keys[2].slice(0, 300) }));
  return { debut, fin, pages, requetes };
}

const chemin = (url) => url.replace(/^https?:\/\/[^/]+/, '').replace(/[?#].*$/, '') || '/';

async function importer(token, debut, fin, dimensions, table, conflit, cles) {
  let startRow = 0;
  let total = 0;
  for (;;) {
    const r = await fetch(`https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE_GSC)}/searchAnalytics/query`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ startDate: debut, endDate: fin, dimensions, rowLimit: 25000, startRow, dataState: 'all' }),
    });
    const j = await r.json();
    if (!r.ok) throw new Error(`gsc_${r.status}: ${JSON.stringify(j).slice(0, 200)}`);
    // Plusieurs adresses (www ou non, paramètres, ancre) donnent le même chemin : on les additionne avant l'enregistrement.
    const m = new Map();
    for (const x of j.rows || []) {
      const k = cles(x);
      const id = JSON.stringify(k);
      const a = m.get(id) || { ...k, clics: 0, impressions: 0, posImp: 0 };
      a.clics += x.clicks; a.impressions += x.impressions; a.posImp += x.position * x.impressions;
      m.set(id, a);
    }
    const rows = [...m.values()].map(({ posImp, ...r }) => ({ ...r, position: r.impressions ? Math.round((posImp / r.impressions) * 100) / 100 : null }));
    if (!(j.rows || []).length) break;
    const w = await adminFetch(`/rest/v1/${table}?on_conflict=${conflit}`, {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify(rows),
    });
    if (!w.ok) throw new Error(`${table}_upsert_${w.status}: ${JSON.stringify(w.body).slice(0, 200)}`);
    total += rows.length;
    if ((j.rows || []).length < 25000) break;
    startRow += 25000;
  }
  return total;
}

// Visites gardées 13 mois au plus (mention de /confidentialite).
export async function purgerVisites() {
  await adminFetch(`/rest/v1/visites?cree_le=lt.${ilYa(395).toISOString()}`, { method: 'DELETE', headers: { Prefer: 'return=minimal' } });
}

async function lire(path) {
  const r = await adminFetch(path);
  if (!r.ok) throw new Error(`lecture_${r.status}: ${path.split('?')[0]}`);
  return r.body || [];
}

// Agrégats calculés en SQL (fonction trafic_periode, réservée au serveur) : pas de plafond de 1 000 lignes.
async function periode(debut, fin) {
  const r = await adminFetch('/rest/v1/rpc/trafic_periode', { method: 'POST', body: JSON.stringify({ p_debut: debut.toISOString(), p_fin: fin.toISOString() }) });
  if (!r.ok) throw new Error(`trafic_periode_${r.status}: ${JSON.stringify(r.body).slice(0, 200)}`);
  return r.body;
}

export async function rapportTrafic(jours = 28) {
  const n = Math.min(Math.max(parseInt(jours, 10) || 28, 1), 120);
  const fin = new Date(`${jourIso(new Date())}T00:00:00Z`);
  const debut = new Date(fin.getTime() - n * 86400000);
  const avant = new Date(debut.getTime() - n * 86400000);
  const [actuelle, precedente, dernier, premiere] = await Promise.all([
    periode(debut, fin),
    periode(avant, debut),
    lire('/rest/v1/gsc_pages?select=jour&order=jour.desc&limit=1'),
    lire('/rest/v1/visites?select=cree_le&order=cree_le.asc&limit=1'),
  ]);
  return {
    genere_le: new Date().toISOString(),
    note: 'Search Console : Google publie ses chiffres avec 2 à 3 jours de retard. Visites : compteur du site, depuis la date de mise en service ci-dessous ; les robots ne sont pas comptés.',
    search_console_dernier_jour: dernier[0]?.jour || null,
    compteur_visites_depuis: premiere[0]?.cree_le?.slice(0, 10) || null,
    jours: n,
    periode: actuelle,
    periode_precedente: precedente,
  };
}
