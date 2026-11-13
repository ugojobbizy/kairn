// Référencement : titre, description, indexation et données structurées de chaque adresse.
// Utilisé à deux endroits :
//  - scripts/seo-prerender.mjs écrit une page HTML par adresse à la compilation (lue par Google
//    et par les aperçus de partage, qui n'exécutent pas toujours le JavaScript) ;
//  - <SeoManager /> (App.jsx) remet les mêmes balises à jour pendant la navigation.
import { FAQ_V2, FAQ_LEADS, FAQ_WEB, FAQ_LP, FAQ_CRM, FAQ_BDX } from './v2/faq-data.js';
import { POSTS } from './blog/generated/index.js';
import { BLOG_PATH, CATEGORIES, AUTHOR } from './blog/meta.js';
import { PRETES, parSlug, prixDe } from './v3/leads/thematiques.js';
import { FAQ_HUB } from './v3/leads/hub-data.js';
import { FAQ_CALC } from './v3/leads/calc-data.js';

export const SITE_URL = 'https://www.kairnagency.com';
export const SITE_NAME = 'Kairn';
export const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

const NOINDEX = 'noindex, follow';

export const PAGES = {
  '/': {
    title: 'Kairn · Leads exclusifs et campagnes Meta',
    description: 'Des contacts qualifiés que vous êtes seul à appeler : Kairn paie la pub, vous payez au contact, sans engagement. Ou confiez-nous vos campagnes Meta, sur votre budget.',
  },
  '/realisations': {
    title: 'Réalisations et cas clients · Kairn',
    description: 'Landing pages, campagnes Meta et CRM sur mesure : nos cas clients chiffrés, dont un coût par lead divisé par 3,5 en trois mois pour Isolation d’Aquitaine.',
  },
  '/generation-de-leads': {
    title: 'Agence de génération de leads : Meta Ads, landing page et CRM · Kairn',
    description: 'Kairn, agence de génération de leads partout en France : campagnes Meta et Google Ads, landing page, qualification et CRM sur mesure. Chaque lead tracé jusqu’à la vente.',
    crumb: 'Génération de leads',
    faq: FAQ_LEADS,
    service: { name: 'Génération de leads', serviceType: 'Génération de leads' },
  },
  '/creation-site-internet': {
    title: 'Création de site internet sur mesure · Kairn',
    description: 'Kairn crée vos sites internet, landing pages, tunnels de conversion et plateformes sur mesure, livrés en quelques semaines. Le code vous appartient.',
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
    title: 'Agence de génération de leads partout en France · Kairn',
    description: 'Kairn, agence de génération de leads : leads exclusifs payés au contact, ou campagnes Meta pilotées sur votre budget, partout en France. Sites, landing pages et CRM en complément.',
    crumb: 'Agence à Bordeaux',
    faq: FAQ_BDX,
    service: {
      name: 'Agence de génération de leads',
      serviceType: 'Génération de leads',
      areaServed: [{ '@type': 'City', name: 'Bordeaux' }, { '@type': 'Country', name: 'France' }],
    },
  },
  '/mentions-legales': { title: 'Mentions légales · Kairn', description: 'Mentions légales du site kairnagency.com, édité par Kairn.' },
  '/confidentialite': { title: 'Politique de confidentialité · Kairn', description: 'Comment Kairn collecte, utilise et protège vos données personnelles sur kairnagency.com.' },
  '/cgv': { title: 'Conditions générales de vente · Kairn', description: 'Conditions générales de vente des prestations de Kairn : création web, campagnes publicitaires et CRM sur mesure.' },

  // Pages « Leads {thématique} » (09/11/2026) : catalogue, puis une page par entrée prête de thematiques.js.
  '/leads': {
    title: 'Achat de leads exclusifs par secteur · Kairn',
    description: 'Leads exclusifs pour installateurs, courtiers et pros : des particuliers qui ont demandé à être rappelés, envoyés à un seul acheteur. Sans engagement.',
    crumb: 'Leads',
    faq: FAQ_HUB,
    service: { name: 'Vente de leads exclusifs', serviceType: 'Génération de leads' },
  },
  '/calculateur-cout-par-chantier': {
    title: 'Calculateur du coût par chantier signé (leads) · Kairn',
    description: 'Calculateur gratuit : du prix de vos leads à votre coût par chantier signé, votre marge et le prix maximum à payer par lead. Comparez deux offres.',
    crumb: 'Calculateur',
    crumbs: [['Leads', '/leads']],
    faq: FAQ_CALC,
    app: { name: 'Calculateur de coût par chantier signé', description: 'Calcule le coût par chantier signé, la marge après achat des leads et le prix maximum d’un lead à partir du prix du lead et des taux de joignabilité, de rendez-vous et de signature.' },
  },
  ...Object.fromEntries(PRETES.map((t) => {
    const parent = t.parent ? parSlug(t.parent) : null;
    const prix = prixDe(t);
    return [`/${t.slug}`, {
      title: t.title,
      description: t.description,
      crumb: t.court,
      crumbs: [['Leads', '/leads'], ...(parent ? [[parent.court, `/${parent.slug}`]] : [])],
      // FAQ ajoutée au pré-rendu (contenus.js n'est pas chargé dans le navigateur avec cette page).
      service: {
        name: t.label,
        serviceType: 'Génération de leads',
        ...(prix ? { offers: { '@type': 'Offer', price: String(prix), priceCurrency: 'EUR', priceSpecification: { '@type': 'UnitPriceSpecification', price: String(prix), priceCurrency: 'EUR', valueAddedTaxIncluded: false, unitText: 'contact' } } } : {}),
      },
      dateModified: t.maj,
    }];
  })),

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
    // FAQ ajoutée au pré-rendu depuis le module de l'article (scripts/seo-prerender.mjs).
    kind: 'article',
    post,
  }])),

  // Pages à ne pas référencer : anciennes versions, landing pages publicitaires, espace privé.
  '/v1': { title: 'Kairn (ancienne version)', description: 'Ancienne version du site Kairn.', robots: NOINDEX, canonical: '/' },
  '/v1/realisations': { title: 'Réalisations (ancienne version) · Kairn', description: 'Ancienne version de la page Réalisations.', robots: NOINDEX, canonical: '/realisations' },
  '/commander': { title: 'Commander des leads · Kairn', description: 'Commandez des contacts exclusifs en pompe à chaleur, isolation par l’extérieur ou photovoltaïque, ou confiez vos campagnes Meta à Kairn.' },
  '/embed/calculateur': { title: 'Calculateur du coût par chantier signé · Kairn', description: 'Version intégrable du calculateur Kairn.', robots: 'noindex, follow', canonical: '/calculateur-cout-par-chantier' },
  '/espace': { title: 'Espace client · Kairn', description: 'Espace client Kairn.', robots: 'noindex, nofollow' },
  '/plateforme': { title: 'La plateforme Kairn · Espace client', description: 'Vos leads, vos commandes et vos règlements au même endroit : Leads Shop, export des prospects, litiges, bons de commande.' },
  '/gestion': { title: 'Kairn Admin', description: 'Gestion Kairn.', robots: 'noindex, nofollow' },
  '/apporteur': { title: 'Espace apporteur · Kairn', description: 'Espace des apporteurs d’affaires Kairn.', robots: 'noindex, nofollow' },
  '/devenir-apporteur': { title: 'Devenir apporteur d’affaires · Kairn', description: 'Présentez des artisans de la rénovation énergétique à Kairn et touchez une commission sur chaque lead qui leur est livré, avec un espace pour tout suivre.', robots: NOINDEX },
  '/accueil-v1': { title: 'Kairn (accueil blanc, sauvegarde)', description: 'Première version de l’accueil refondu, gardée en sauvegarde.', robots: NOINDEX },
  '/landingpage': { title: 'Kairn (accueil sauvegardé)', description: 'Accueil Kairn d’octobre 2026, gardé en sauvegarde.', robots: NOINDEX },
  '/landing': { title: 'Kairn', description: 'Page de campagne Kairn.', robots: NOINDEX },
  '/landing2': { title: 'Kairn', description: 'Page de campagne Kairn.', robots: NOINDEX },
  '/landing3': { title: 'Kairn', description: 'Page de campagne Kairn.', robots: NOINDEX },
  '/presentation-pac': { title: 'Kairn · Leads pompe à chaleur', description: 'Présentation des deux modèles de génération de leads pompe à chaleur.', robots: 'noindex, nofollow' },
  '/onboarding/admin': { title: 'Kairn · Onboarding clients', description: 'Espace privé.', robots: 'noindex, nofollow' },
  '/admin': { title: 'Kairn Admin', description: 'Espace privé.', robots: 'noindex, nofollow' },
  '/admin/login': { title: 'Kairn Admin · Connexion', description: 'Espace privé.', robots: 'noindex, nofollow' },
};

// Adresse inconnue : le site affiche l'accueil, mais Google ne doit pas l'indexer (évite les « soft 404 »).
export const NOT_FOUND = { title: 'Page introuvable · Kairn', description: PAGES['/'].description, robots: 'noindex, follow', canonical: '/' };

const ONBOARDING = { title: 'Kairn · Votre projet de site', description: 'Questionnaire de création de site.', robots: 'noindex, nofollow' };

export function pageFor(pathname) {
  const path = pathname !== '/' ? pathname.replace(/\/+$/, '') : '/';
  if (!PAGES[path] && path.startsWith('/onboarding/')) return ONBOARDING; // lien privé d'un client
  if (!PAGES[path] && path.startsWith('/espace/')) return PAGES['/espace']; // pages de l'espace client
  if (!PAGES[path] && path.startsWith('/gestion/')) return PAGES['/gestion']; // pages de Kairn Admin
  if (!PAGES[path] && path.startsWith('/apporteur/')) return PAGES['/apporteur']; // pages de l'espace apporteur
  return PAGES[path] || NOT_FOUND;
}

// ─ Données structurées (schema.org) ─
// Nom de la fiche Google et du domaine : « Kairn Agency » (choix d'Ugo, 20/10), alors que le site affiche « Kairn ».
// Il ne figure que dans ces données invisibles, pour que Google relie le site, la fiche et les recherches « Kairn Agency ».
const BRAND_NAME = 'Kairn Agency';
const GOOGLE_PROFILE = 'https://maps.google.com/?cid=17839410346044495568';
// Profils de la marque (donnés par Ugo, 09/11/2026), reliés pour que Google et les IA reconnaissent une seule entité.
const PROFILS = [GOOGLE_PROFILE, 'https://www.linkedin.com/company/kairn-agence/', 'https://www.instagram.com/kairnagency/'];

const ORGANIZATION = {
  '@type': 'ProfessionalService',
  '@id': `${SITE_URL}/#organization`,
  name: BRAND_NAME,
  alternateName: SITE_NAME,
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/logo-512.png`,
  image: OG_IMAGE,
  email: 'contact@kairnagency.com',
  telephone: '+33781274179',
  address: { '@type': 'PostalAddress', addressLocality: 'Bordeaux', addressRegion: 'Nouvelle-Aquitaine', addressCountry: 'FR' },
  areaServed: { '@type': 'Country', name: 'France' },
  description: PAGES['/'].description,
  knowsAbout: ['Génération de leads', 'Leads exclusifs', 'Leads pompe à chaleur', 'Leads isolation thermique par l’extérieur', 'Leads photovoltaïque', 'Meta Ads', 'Création de landing pages', 'CRM sur mesure', 'Tracking serveur'],
  hasMap: GOOGLE_PROFILE,
  sameAs: PROFILS,
};

const WEBSITE = {
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: `${SITE_URL}/`,
  name: BRAND_NAME,
  alternateName: SITE_NAME,
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
          mainEntity: FAQ_V2.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
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
        ...(page.dateModified ? { dateModified: page.dateModified, author: { '@type': 'Person', name: AUTHOR.name, worksFor: { '@id': `${SITE_URL}/#organization` } } } : {}),
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
        ...(page.service.offers ? { offers: page.service.offers } : {}),
      }] : []),
      ...(page.app ? [{
        '@type': 'WebApplication',
        '@id': `${SITE_URL}${path}#app`,
        name: page.app.name,
        description: page.app.description,
        url: `${SITE_URL}${path}`,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Tous (navigateur web)',
        inLanguage: 'fr-FR',
        isAccessibleForFree: true,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
        publisher: { '@id': `${SITE_URL}/#organization` },
      }] : []),
      ...(page.faq ? [{
        '@type': 'FAQPage',
        mainEntity: page.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
      }] : []),
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          ['Accueil', '/'],
          ...(page.crumbs || []),
          [page.crumb || page.title.split(' · ')[0], path],
        ].map(([name, p], i) => ({ '@type': 'ListItem', position: i + 1, name, item: `${SITE_URL}${p}` })),
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
    `<meta property="og:image:alt" content="Kairn, agence de génération de leads" />`,
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
