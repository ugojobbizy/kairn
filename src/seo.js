// Référencement : titre, description, indexation et données structurées de chaque adresse.
// Utilisé à deux endroits :
//  - scripts/seo-prerender.mjs écrit une page HTML par adresse à la compilation (lue par Google
//    et par les aperçus de partage, qui n'exécutent pas toujours le JavaScript) ;
//  - <SeoManager /> (App.jsx) remet les mêmes balises à jour pendant la navigation.
import { FAQ } from './v2/faq-data.js';

export const SITE_URL = 'https://www.kairnagency.com';
export const SITE_NAME = 'Kairn';
export const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

const NOINDEX = 'noindex, follow';

export const PAGES = {
  '/': {
    title: 'Kairn · Création web & génération de leads',
    description: 'Kairn conçoit vos landing pages, lance vos campagnes Meta et Google Ads et construit votre CRM sur mesure pour suivre chaque lead jusqu’à la vente.',
  },
  '/realisations': {
    title: 'Réalisations et cas clients · Kairn',
    description: 'Landing pages, campagnes Meta et CRM sur mesure : nos cas clients chiffrés, dont un coût par lead divisé par 3,5 en trois mois pour Isolation d’Aquitaine.',
  },
  '/build': {
    title: 'Création de sites, landing pages et CRM sur mesure · Kairn',
    description: 'Landing pages, tunnels de conversion, plateformes et automatisations développés sur mesure et livrés en quelques semaines. Le code vous appartient.',
  },
  '/ads': {
    title: 'Campagnes Meta Ads et Google Ads · Kairn',
    description: 'On baisse votre coût par lead avant d’augmenter le budget : tests de créas, tracking serveur et attribution. Campagnes Meta et Google pilotées chaque semaine.',
  },
  '/contact': {
    title: 'Contact · Kairn',
    description: 'Réservez un appel de 30 minutes, écrivez-nous sur WhatsApp ou à contact@kairnagency.com. Une réponse honnête : oui, non, ou une recommandation.',
  },
  '/mentions-legales': { title: 'Mentions légales · Kairn', description: 'Mentions légales du site kairnagency.com, édité par Kairn.' },
  '/confidentialite': { title: 'Politique de confidentialité · Kairn', description: 'Comment Kairn collecte, utilise et protège vos données personnelles sur kairnagency.com.' },
  '/cgv': { title: 'Conditions générales de vente · Kairn', description: 'Conditions générales de vente des prestations de Kairn : création web, campagnes publicitaires et CRM sur mesure.' },

  // Pages à ne pas référencer : anciennes versions, landing pages publicitaires, espace privé.
  '/v1': { title: 'Kairn (ancienne version)', description: 'Ancienne version du site Kairn.', robots: NOINDEX, canonical: '/' },
  '/v1/realisations': { title: 'Réalisations (ancienne version) · Kairn', description: 'Ancienne version de la page Réalisations.', robots: NOINDEX, canonical: '/realisations' },
  '/landing': { title: 'Kairn', description: 'Page de campagne Kairn.', robots: NOINDEX },
  '/landing2': { title: 'Kairn', description: 'Page de campagne Kairn.', robots: NOINDEX },
  '/landing3': { title: 'Kairn', description: 'Page de campagne Kairn.', robots: NOINDEX },
  '/admin': { title: 'Kairn Admin', description: 'Espace privé.', robots: 'noindex, nofollow' },
  '/admin/login': { title: 'Kairn Admin · Connexion', description: 'Espace privé.', robots: 'noindex, nofollow' },
};

// Adresse inconnue : le site affiche l'accueil, mais Google ne doit pas l'indexer (évite les « soft 404 »).
export const NOT_FOUND = { title: 'Page introuvable · Kairn', description: PAGES['/'].description, robots: 'noindex, follow', canonical: '/' };

export function pageFor(pathname) {
  const path = pathname !== '/' ? pathname.replace(/\/+$/, '') : '/';
  return PAGES[path] || NOT_FOUND;
}

// ─ Données structurées (schema.org) ─
const ORGANIZATION = {
  '@type': 'ProfessionalService',
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/logo-512.png`,
  image: OG_IMAGE,
  email: 'contact@kairnagency.com',
  telephone: '+33781274179',
  areaServed: { '@type': 'Country', name: 'France' },
  description: PAGES['/'].description,
  knowsAbout: ['Création de landing pages', 'Génération de leads', 'Meta Ads', 'Google Ads', 'CRM sur mesure', 'Tracking serveur'],
};

const WEBSITE = {
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: `${SITE_URL}/`,
  name: SITE_NAME,
  inLanguage: 'fr-FR',
  publisher: { '@id': `${SITE_URL}/#organization` },
};

export function structuredData(path) {
  if (path === '/') {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        ORGANIZATION,
        WEBSITE,
        {
          '@type': 'FAQPage',
          mainEntity: FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
        },
      ],
    };
  }
  const page = PAGES[path];
  if (!page || page.robots) return null;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${SITE_URL}${path}#webpage`,
        url: `${SITE_URL}${path}`,
        name: page.title,
        description: page.description,
        inLanguage: 'fr-FR',
        isPartOf: { '@id': `${SITE_URL}/#website` },
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: page.title.split(' · ')[0], item: `${SITE_URL}${path}` },
        ],
      },
    ],
  };
}

// Balises <head> d'une adresse, sous forme de texte HTML (utilisé par le script de compilation).
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function headTags(path) {
  const page = PAGES[path] || NOT_FOUND;
  const canonical = `${SITE_URL}${page.canonical ?? path}`;
  const tags = [
    `<title>${esc(page.title)}</title>`,
    `<meta name="description" content="${esc(page.description)}" />`,
    `<meta name="robots" content="${page.robots || 'index, follow, max-image-preview:large'}" />`,
    `<link rel="canonical" href="${canonical}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:locale" content="fr_FR" />`,
    `<meta property="og:title" content="${esc(page.title)}" />`,
    `<meta property="og:description" content="${esc(page.description)}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:image" content="${OG_IMAGE}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="Kairn, création web et génération de leads" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(page.title)}" />`,
    `<meta name="twitter:description" content="${esc(page.description)}" />`,
    `<meta name="twitter:image" content="${OG_IMAGE}" />`,
  ];
  const data = structuredData(path);
  if (data) tags.push(`<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`);
  return tags.join('\n    ');
}
