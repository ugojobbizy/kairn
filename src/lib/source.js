// Origine du visiteur (17/11/2026) : au premier passage, on garde dans le navigateur le site d'où il vient
// (Google, Bing, ChatGPT, LinkedIn…), sa page d'arrivée et la date. Le texte part avec chaque demande
// (réservation, commande) pour savoir quelles pages et quels canaux amènent des clients.
// Rien n'est envoyé tant que le visiteur ne remplit pas un formulaire. Gardé 90 jours.
const KEY = 'kairn-source';
const TTL = 90 * 24 * 3600 * 1000;

const NOMS = [
  [/(^|\.)google\./, 'Google'],
  [/(^|\.)bing\.com$/, 'Bing'],
  [/(^|\.)duckduckgo\.com$/, 'DuckDuckGo'],
  [/(^|\.)qwant\.com$/, 'Qwant'],
  [/(^|\.)ecosia\.org$/, 'Ecosia'],
  [/(^|\.)yahoo\./, 'Yahoo'],
  [/chatgpt\.com$|openai\.com$/, 'ChatGPT'],
  [/perplexity\.ai$/, 'Perplexity'],
  [/(^|\.)claude\.ai$/, 'Claude'],
  [/gemini\.google\.com$/, 'Gemini'],
  [/copilot\.microsoft\.com$/, 'Copilot'],
  [/linkedin\.com$|lnkd\.in$/, 'LinkedIn'],
  [/facebook\.com$|fb\.com$|instagram\.com$/, 'Meta'],
];

function nommer(host) {
  if (!host) return 'accès direct';
  // Gemini avant Google : l'ordre du tableau ferait gagner Google.
  if (/gemini\.google\.com$/.test(host)) return 'Gemini';
  for (const [re, nom] of NOMS) if (re.test(host)) return nom;
  return host.replace(/^www\./, '');
}

function lire() {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (v && Date.now() - v.t < TTL) return v;
  } catch { /* stockage indisponible */ }
  return null;
}

export function captureSource() {
  if (typeof window === 'undefined' || lire()) return;
  let host = '';
  try {
    const r = document.referrer ? new URL(document.referrer) : null;
    if (r && r.hostname !== window.location.hostname) host = r.hostname;
  } catch { /* référent illisible */ }
  const p = new URLSearchParams(window.location.search);
  const v = {
    t: Date.now(),
    o: p.get('utm_source') ? `${p.get('utm_source')}${p.get('utm_medium') ? ` / ${p.get('utm_medium')}` : ''}` : nommer(host),
    l: window.location.pathname,
  };
  try { localStorage.setItem(KEY, JSON.stringify(v)); } catch { /* navigation privée */ }
  try { sessionStorage.setItem(KEY, JSON.stringify(v)); } catch { /* idem */ }
}

// Texte lisible, par ex. « Google → /leads-pompe-a-chaleur (12/11/2026) ».
export function getSource() {
  if (typeof window === 'undefined') return null;
  let v = lire();
  if (!v) {
    try { v = JSON.parse(sessionStorage.getItem(KEY) || 'null'); } catch { v = null; }
  }
  if (!v) return null;
  const d = new Date(v.t).toLocaleDateString('fr-FR', { timeZone: 'Europe/Paris' });
  return `${v.o} → ${v.l} (${d})`;
}

// Compteur de visites (22/11/2026) : une ligne par page vue dans la table visites (base kairn), sans cookie ni adresse IP :
// chemin, source de l'arrivée (Google, ChatGPT…), identifiant tiré au hasard et gardé dans l'onglet seulement.
// Sert à l'agent de contenu à voir quelles pages et quels canaux amènent du monde. Les espaces privés ne sont pas comptés.
const PRIVE = /^\/(gestion|espace|admin|apporteur|embed)(\/|$)/;
const VISITE = 'kairn-visite';

export function compterVisite(chemin) {
  if (typeof window === 'undefined' || import.meta.env.DEV || PRIVE.test(chemin) || navigator.webdriver) return;
  let id = null;
  let arrivee = false;
  try { id = sessionStorage.getItem(VISITE); } catch { /* stockage indisponible */ }
  if (!id) {
    arrivee = true;
    id = crypto.randomUUID ? crypto.randomUUID() : null;
    try { if (id) sessionStorage.setItem(VISITE, id); } catch { /* idem */ }
  }
  let source = null;
  if (arrivee) {
    let host = '';
    try {
      const r = document.referrer ? new URL(document.referrer) : null;
      if (r && r.hostname !== window.location.hostname) host = r.hostname;
    } catch { /* référent illisible */ }
    const u = new URLSearchParams(window.location.search).get('utm_source');
    source = u ? `utm:${u}` : nommer(host);
  }
  try {
    fetch('https://bmqvlwdbwfnafuovzzhi.supabase.co/rest/v1/rpc/site_visite', {
      method: 'POST',
      keepalive: true,
      headers: { apikey: 'sb_publishable_xyIez0a8masZaN3RM_GQIw_e4KyILCV', Authorization: 'Bearer sb_publishable_xyIez0a8masZaN3RM_GQIw_e4KyILCV', 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_chemin: chemin, p_source: source, p_visite: id, p_arrivee: arrivee }),
    }).catch(() => {});
  } catch { /* hors ligne */ }
}
