// Pages « Leads {thématique} » (plan du 09/11/2026, SEO et GEO) : le catalogue léger, une entrée par page
// (adresse, nom, prix, titre et description pour Google). Il est chargé partout (menu, pied de page, routes, référencement) :
// le texte des pages vit dans contenus.js, chargé seulement avec la page (lead-page.jsx), et ses FAQ sont ajoutées
// aux données structurées au moment du pré-rendu (scripts/seo-prerender.mjs).
// Prix : PAC, ITE, PPV lus dans PRODUITS (produits.js, prix d'Ugo du 28/10) ; les autres sont sur devis (Ugo, 09/11).
// pret : false = page pas encore rédigée (ni route, ni lien, ni sitemap).
import { PRODUITS } from '../produits.js';
import { THEMATIQUES_DEVIS } from './codes.js';

export const MINIMUM = 50; // première commande, en contacts (FAQ de l'accueil, 30/10)

export const GROUPES = [
  { id: 'renovation', eyebrow: 'Rénovation et habitat', titre: ['Leads pour les', 'installateurs et artisans.'], intro: 'Des propriétaires qui ont un projet de travaux et ont demandé à être rappelés. Pompe à chaleur, isolation et solaire sont ouverts en continu.' },
  { id: 'finance', eyebrow: 'Crédit et assurance', titre: ['Leads pour les', 'courtiers et assureurs.'], intro: 'Des particuliers qui ont demandé une étude ou un devis, transmis à un seul intermédiaire.' },
  { id: 'services', eyebrow: 'Santé, formation et services', titre: ['Leads pour les', 'professionnels de service.'], intro: 'Audition, formation, déménagement : une campagne dédiée à votre métier et à votre zone.' },
];

export const THEMATIQUES = [
  // ───────────────────────────── Pompe à chaleur ─────────────────────────────
  {
    pret: true,
    slug: 'leads-pompe-a-chaleur',
    code: 'PAC',
    produit: 'PAC',
    groupe: 'renovation',
    court: 'Pompe à chaleur',
    label: 'Leads pompe à chaleur',
    resume: 'Des propriétaires qui veulent remplacer leur chauffage par une pompe à chaleur.',
    maj: '2026-11-09',
    title: 'Leads pompe à chaleur exclusifs (PAC) à 28 € HT · Kairn',
    description: 'Leads PAC exclusifs : des propriétaires qui ont demandé à être rappelés pour une pompe à chaleur. 28 € HT le contact, à vous seul, sans engagement.',
  },

  // Pages à rédiger (étape 2 du plan) : métadonnées seulement, pour le maillage une fois prêtes.
  {
    "pret": true,
    "slug": "leads-panneaux-solaires",
    "code": "PPV",
    "produit": "PPV",
    "groupe": "renovation",
    "court": "Panneaux solaires",
    "label": "Leads panneaux solaires",
    "resume": "Des propriétaires qui veulent produire leur propre électricité avec des panneaux solaires.",
    "maj": "2026-11-09",
    "title": "Leads panneaux solaires exclusifs à 35 € HT · Kairn",
    "description": "Leads photovoltaïque exclusifs : des propriétaires qui ont demandé à être rappelés pour poser des panneaux solaires. 35 € HT le contact, sans engagement."
  },
  {
    "pret": true,
    "slug": "leads-isolation-thermique-exterieur",
    "code": "ITE",
    "produit": "ITE",
    "groupe": "renovation",
    "court": "Isolation par l’extérieur",
    "label": "Leads ITE",
    "resume": "Des propriétaires de maison qui veulent isoler leurs murs par l’extérieur.",
    "maj": "2026-11-09",
    "title": "Leads ITE, leads isolation thermique par l’extérieur · Kairn",
    "description": "Leads ITE exclusifs : des propriétaires de maison qui ont demandé à être rappelés pour isoler leur façade par l’extérieur. 27 € HT, sans engagement."
  },
  {
    "pret": true,
    "slug": "leads-isolation-combles",
    "code": "COMBLES",
    "groupe": "renovation",
    "court": "Isolation des combles",
    "label": "Leads isolation des combles",
    "resume": "Des propriétaires qui veulent isoler leurs combles perdus ou aménagés.",
    "maj": "2026-11-09",
    "title": "Leads isolation des combles exclusifs, sur devis · Kairn",
    "description": "Leads isolation des combles exclusifs : des propriétaires qui ont demandé à être rappelés pour isoler leurs combles perdus ou aménagés. Prix sur devis."
  },
  {
    "pret": true,
    "slug": "leads-toiture",
    "code": "TOITURE",
    "groupe": "renovation",
    "court": "Toiture",
    "label": "Leads toiture",
    "resume": "Des propriétaires qui veulent refaire, réparer ou isoler leur toiture.",
    "maj": "2026-11-09",
    "title": "Leads toiture exclusifs pour couvreurs, sur devis · Kairn",
    "description": "Leads toiture exclusifs : des propriétaires qui ont demandé un couvreur pour leur couverture, charpente ou zinguerie. Prix sur devis, sans engagement."
  },
  {
    "pret": true,
    "slug": "leads-fenetres-menuiserie",
    "code": "MENUISERIE",
    "groupe": "renovation",
    "court": "Fenêtres et menuiserie",
    "label": "Leads fenêtres et menuiserie",
    "resume": "Des propriétaires qui veulent remplacer leurs fenêtres, portes ou volets.",
    "maj": "2026-11-09",
    "title": "Leads fenêtres et menuiserie exclusifs, sur devis · Kairn",
    "description": "Leads menuiserie exclusifs : des propriétaires qui ont demandé à être rappelés pour changer leurs fenêtres, portes ou volets. Sur devis, sans engagement."
  },
  { pret: false, slug: 'leads-regroupement-de-credits', code: 'CREDIT', groupe: 'finance', court: 'Regroupement de crédits', label: 'Leads regroupement de crédits', resume: 'Des particuliers qui veulent regrouper leurs crédits en une seule mensualité.' },
  { pret: false, slug: 'leads-assurance', code: 'ASSURANCE', groupe: 'finance', court: 'Assurance', label: 'Leads assurance', resume: 'Mutuelle santé, assurance emprunteur, contrat obsèques.', enfants: ['leads-mutuelle-sante', 'leads-assurance-emprunteur', 'leads-contrat-obseques'] },
  { pret: false, slug: 'leads-mutuelle-sante', code: 'MUTUELLE', groupe: 'finance', parent: 'leads-assurance', court: 'Mutuelle santé', label: 'Leads mutuelle santé', resume: 'Des particuliers, souvent seniors, qui comparent leur complémentaire santé.' },
  { pret: false, slug: 'leads-assurance-emprunteur', code: 'EMPRUNTEUR', groupe: 'finance', parent: 'leads-assurance', court: 'Assurance emprunteur', label: 'Leads assurance emprunteur', resume: 'Des emprunteurs qui veulent changer d’assurance de prêt.' },
  { pret: false, slug: 'leads-contrat-obseques', code: 'OBSEQUES', groupe: 'finance', parent: 'leads-assurance', court: 'Contrat obsèques', label: 'Leads contrat obsèques', resume: 'Des particuliers qui veulent préparer et financer leurs obsèques.' },
  {
    "pret": true,
    "slug": "leads-appareils-auditifs",
    "code": "AUDITION",
    "groupe": "services",
    "court": "Appareils auditifs",
    "label": "Leads appareils auditifs",
    "resume": "Des personnes qui veulent faire un bilan auditif dans un centre près de chez elles.",
    "maj": "2026-11-09",
    "title": "Leads appareils auditifs et audition exclusifs · Kairn",
    "description": "Leads audition exclusifs pour audioprothésistes : des personnes qui demandent un bilan auditif dans votre centre. Sur devis, sans engagement."
  },
  {
    "pret": true,
    "slug": "leads-formation-professionnelle",
    "code": "FORMATION",
    "groupe": "services",
    "court": "Formation professionnelle",
    "label": "Leads formation professionnelle",
    "resume": "Des dirigeants et des RH qui veulent former leurs salariés, financement entreprise ou OPCO.",
    "maj": "2026-11-09",
    "title": "Leads formation professionnelle entreprises · Kairn",
    "description": "Leads formation exclusifs pour organismes Qualiopi : dirigeants et RH qui veulent former leurs salariés, financé par l’entreprise ou l’OPCO. Sur devis."
  },
  {
    "pret": true,
    "slug": "leads-demenagement",
    "code": "DEMENAGEMENT",
    "groupe": "services",
    "court": "Déménagement",
    "label": "Leads déménagement",
    "resume": "Des particuliers qui préparent un déménagement et demandent un devis.",
    "maj": "2026-11-09",
    "title": "Leads déménagement exclusifs, sur devis · Kairn",
    "description": "Leads déménagement exclusifs : des particuliers qui demandent un devis, avec volume en m³, date, trajet, étage et ascenseur. Sur devis, sans engagement."
  },
];

// Contrôle au chargement : chaque code de page existe au catalogue (prix) ou dans la liste des devis.
for (const t of THEMATIQUES) {
  const connu = t.produit ? PRODUITS.some((p) => p.code === t.produit) : THEMATIQUES_DEVIS.some((d) => d.code === t.code);
  if (!connu) throw new Error(`thematiques.js : code inconnu ${t.code}`);
}

export const PRETES = THEMATIQUES.filter((t) => t.pret);
export const parSlug = (slug) => THEMATIQUES.find((t) => t.slug === slug);
export const prixDe = (t) => (t.produit ? PRODUITS.find((p) => p.code === t.produit).prix : null);
export const commandeHref = (t) => `/commander?thematique=${t.code}`;
export const dateMaj = (iso) => new Date(`${iso}T12:00:00Z`).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
