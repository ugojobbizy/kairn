// Données fixes du blog, partagées par l'application, src/seo.js et les scripts de compilation.

export const BLOG_PATH = '/blog';

// Ordre d'affichage sur la page /blog.
export const CATEGORIES = [
  { id: 'sites', label: 'Sites et landing pages', intro: 'Ce qu’un site doit faire pour rapporter des demandes, et ce que ça coûte vraiment.' },
  { id: 'acquisition', label: 'Acquisition', intro: 'Meta Ads, Google Ads, formulaires : où mettre son budget, et comment savoir ce qu’il rapporte.' },
  { id: 'suivi', label: 'Suivi, CRM et automatisation', intro: 'Relier chaque lead à la pub qui l’a amené et à la vente qu’il a rapportée.' },
  { id: 'metiers', label: 'Par métier', intro: 'Site, pubs et leads, métier par métier : ce qui marche dans votre secteur.' },
];

// Pages de service vers lesquelles un article peut renvoyer.
export const SERVICE_PAGES = {
  '/generation-de-leads': 'Génération de leads',
  '/creation-site-internet': 'Création de site internet',
  '/creation-landing-page': 'Création de landing page',
  '/crm-sur-mesure': 'CRM sur mesure',
  '/agence-bordeaux': 'Agence à Bordeaux',
};

// Auteur des articles (encadré en fin d'article et données structurées).
// Bio, photo et LinkedIn à compléter avec les informations fournies par l'auteur.
export const AUTHOR = {
  name: 'Ugo Gianeselli',
  role: 'Kairn, agence de génération de leads',
  bio: 'Ugo Gianeselli conçoit chez Kairn les sites, les campagnes et les CRM qui relient chaque lead à sa source.',
  photo: null,
  linkedin: null,
};
