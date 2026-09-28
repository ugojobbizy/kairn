// Référencement : titre, description, indexation et données structurées de chaque adresse.
// Utilisé à deux endroits :
//  - scripts/seo-prerender.mjs écrit une page HTML par adresse à la compilation (lue par Google
//    et par les aperçus de partage, qui n'exécutent pas toujours le JavaScript) ;
//  - <SeoManager /> (App.jsx) remet les mêmes balises à jour pendant la navigation.
import { FAQ, FAQ_LEADS, FAQ_WEB, FAQ_LP, FAQ_CRM, FAQ_BDX } from './v2/faq-data.js';
import { POSTS } from './blog/generated/index.js';
import { BLOG_PATH, CATEGORIES, AUTHOR } from './blog/meta.js';

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
  '/generation-de-leads': {
    title: 'Agence de génération de leads : Meta Ads, landing page et CRM · Kairn',
    description: 'Kairn, agence de génération de leads basée à Bordeaux : campagnes Meta et Google Ads, landing page, qualification et CRM sur mesure. Chaque lead tracé jusqu’à la vente.',
    crumb: 'Génération de leads',
    faq: FAQ_LEADS,
    service: { name: 'Génération de leads', serviceType: 'Génération de leads' },
  },
  '/creation-site-internet': {
    title: 'Création de site internet sur mesure · Kairn',
    description: 'Kairn, agence web à Bordeaux : sites internet, landing pages, tunnels de conversion et plateformes sur mesure, livrés en quelques semaines. Le code vous appartient.',
    crumb: 'Création de site internet',
    faq: FAQ_WEB,
    service: { name: 'Création de site internet', serviceType: 'Création de site internet' },
  },
  '/creation-landing-page': {
    title: 'Création de landing page qui convertit · Kairn',
    description: 'Landing pages pour vos campagnes Meta et Google Ads : textes inclus, formulaire qualifiant, tracking serveur et A/B testing. Livrée en deux semaines par Kairn, à Bordeaux.',
    crumb: 'Création de landing page',
    faq: FAQ_LP,
    service: { name: 'Création de landing page', serviceType: 'Création de landing page' },
  },
  '/crm-sur-mesure': {
    title: 'CRM sur mesure et outils commerciaux · Kairn',
    description: 'Kairn développe votre CRM sur mesure : pipeline à vos étapes, attribution de chaque lead à sa campagne, relances automatiques et tableau de bord. Le code vous appartient.',
    crumb: 'CRM sur mesure',
    faq: FAQ_CRM,
    service: { name: 'CRM sur mesure', serviceType: 'Développement de CRM sur mesure' },
  },
  '/agence-bordeaux': {
    title: 'Agence web et génération de leads à Bordeaux · Kairn',
    description: 'Kairn, agence basée à Bordeaux : sites, landing pages, CRM sur mesure et campagnes Meta et Google Ads, pour des entreprises bordelaises et des projets partout en France.',
    crumb: 'Agence à Bordeaux',
    faq: FAQ_BDX,
    service: {
      name: 'Agence web et génération de leads à Bordeaux',
      serviceType: 'Création web et génération de leads',
      areaServed: [{ '@type': 'City', name: 'Bordeaux' }, { '@type': 'Country', name: 'France' }],
    },
  },
  '/mentions-legales': { title: 'Mentions légales · Kairn', description: 'Mentions légales du site kairnagency.com, édité par Kairn.' },
  '/confidentialite': { title: 'Politique de confidentialité · Kairn', description: 'Comment Kairn collecte, utilise et protège vos données personnelles sur kairnagency.com.' },
  '/cgv': { title: 'Conditions générales de vente · Kairn', description: 'Conditions générales de vente des prestations de Kairn : création web, campagnes publicitaires et CRM sur mesure.' },

  // Blog : la page d'accueil du blog, puis un article par fichier de content/blog (voir scripts/build-blog.mjs).
  [BLOG_PATH]: {
    title: 'Blog · Sites, publicité et génération de leads · Kairn',
    description: 'Guides pratiques pour les entreprises qui veulent des clients sur internet : sites, landing pages, Meta et Google Ads, CRM et suivi des leads. Chiffres réels, sans jargon.',
    crumb: 'Blog',
    kind: 'blog',
  },
  ...Object.fromEntries(POSTS.map((post) => [post.path, {
    title: post.seoTitle,
    description: post.description,
    crumb: post.title,
    faq: post.faq.length ? post.faq : undefined,
    kind: 'article',
    post,
  }])),

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
  address: { '@type': 'PostalAddress', addressLocality: 'Bordeaux', addressRegion: 'Nouvelle-Aquitaine', addressCountry: 'FR' },
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
  if (page.kind === 'article') return articleData(path, page);
  if (page.kind === 'blog') return blogData(path, page);
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
      ...(page.service ? [{
        '@type': 'Service',
        '@id': `${SITE_URL}${path}#service`,
        name: page.service.name,
        serviceType: page.service.serviceType,
        description: page.description,
        url: `${SITE_URL}${path}`,
        provider: { '@id': `${SITE_URL}/#organization` },
        areaServed: page.service.areaServed || { '@type': 'Country', name: 'France' },
      }] : []),
      ...(page.faq ? [{
        '@type': 'FAQPage',
        mainEntity: page.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
      }] : []),
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: page.crumb || page.title.split(' · ')[0], item: `${SITE_URL}${path}` },
        ],
      },
    ],
  };
}

const faqData = (faq) => ({
  '@type': 'FAQPage',
  mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
});

const PERSON = {
  '@type': 'Person',
  '@id': `${SITE_URL}${BLOG_PATH}#auteur`,
  name: AUTHOR.name,
  worksFor: { '@id': `${SITE_URL}/#organization` },
  ...(AUTHOR.linkedin ? { sameAs: [AUTHOR.linkedin] } : {}),
};

function articleData(path, page) {
  const { post } = page;
  const url = `${SITE_URL}${path}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${url}#article`,
        mainEntityOfPage: url,
        url,
        headline: post.title,
        description: post.description,
        datePublished: post.datePublished,
        dateModified: post.dateModified,
        inLanguage: 'fr-FR',
        articleSection: CATEGORIES.find((c) => c.id === post.category)?.label,
        wordCount: post.words,
        image: page.image || OG_IMAGE,
        author: PERSON,
        publisher: { '@id': `${SITE_URL}/#organization` },
        isPartOf: { '@id': `${SITE_URL}${BLOG_PATH}#blog` },
      },
      ...(page.faq ? [faqData(page.faq)] : []),
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}${BLOG_PATH}` },
          { '@type': 'ListItem', position: 3, name: post.title, item: url },
        ],
      },
    ],
  };
}

function blogData(path, page) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Blog',
        '@id': `${SITE_URL}${path}#blog`,
        url: `${SITE_URL}${path}`,
        name: page.title,
        description: page.description,
        inLanguage: 'fr-FR',
        publisher: { '@id': `${SITE_URL}/#organization` },
        blogPost: POSTS.map((p) => ({ '@type': 'BlogPosting', headline: p.title, url: `${SITE_URL}${p.path}`, datePublished: p.datePublished })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}${path}` },
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
    `<meta property="og:type" content="${page.kind === 'article' ? 'article' : 'website'}" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:locale" content="fr_FR" />`,
    `<meta property="og:title" content="${esc(page.title)}" />`,
    `<meta property="og:description" content="${esc(page.description)}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:image" content="${page.image || OG_IMAGE}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="Kairn, création web et génération de leads" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(page.title)}" />`,
    `<meta name="twitter:description" content="${esc(page.description)}" />`,
    `<meta name="twitter:image" content="${page.image || OG_IMAGE}" />`,
  ];
  if (page.kind === 'article') {
    tags.push(
      `<meta property="article:published_time" content="${page.post.datePublished}" />`,
      `<meta property="article:modified_time" content="${page.post.dateModified}" />`,
      `<meta property="article:author" content="${esc(AUTHOR.name)}" />`,
    );
  }
  const data = structuredData(path);
  if (data) tags.push(`<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`);
  return tags.join('\n    ');
}
