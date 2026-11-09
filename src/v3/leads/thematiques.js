// Pages « Leads {thématique} » (plan du 09/11/2026, SEO et GEO) : une entrée par page.
// Tout le texte propre à un métier vit ici ; le gabarit est dans lead-page.jsx, le référencement dans src/seo.js.
// Prix : PAC, ITE, PPV lus dans PRODUITS (produits.js, prix d'Ugo du 28/10) ; les autres sont sur devis (Ugo, 09/11).
// Chaque chiffre de marché porte sa source et sa date de lecture. Vouvoiement, pas de tiret cadratin.
// pret : false = page pas encore rédigée (ni route, ni lien, ni sitemap).
import { PRODUITS } from '../produits.js';
import { THEMATIQUES_DEVIS } from './codes.js';

export const MINIMUM = 50; // première commande, en contacts (FAQ de l'accueil, 30/10)

export const GROUPES = [
  { id: 'renovation', eyebrow: 'Rénovation et habitat', titre: ['Leads pour les', 'installateurs et artisans.'], intro: 'Des propriétaires qui ont un projet de travaux et ont demandé à être rappelés. Pompe à chaleur, isolation et solaire sont ouverts en continu.' },
  { id: 'finance', eyebrow: 'Crédit et assurance', titre: ['Leads pour les', 'courtiers et assureurs.'], intro: 'Des particuliers qui ont demandé une étude ou un devis, transmis à un seul intermédiaire.' },
  { id: 'services', eyebrow: 'Santé, formation et services', titre: ['Leads pour les', 'professionnels de service.'], intro: 'Audition, obsèques, formation, déménagement : une campagne dédiée à votre métier et à votre zone.' },
];

const RENOV_LEGAL_DEMARCHAGE = ['Démarchage interdit, rappel d’une demande permis', [
  ['Le démarchage téléphonique des particuliers pour des travaux de rénovation énergétique est interdit, sauf contrat en cours (Code de la consommation, '],
  ['art. L223-1', 'https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006069565/LEGISCTA000032221441'],
  ['). Depuis le 11/08/2026, rappeler une personne qui a fait elle-même une demande n’est pas du démarchage si vous pouvez prouver la demande, si l’appel a lieu dans les 5 jours ouvrables et s’il ne porte que sur l’objet demandé ('],
  ['art. R223-4, décret n° 2026-662', 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000054483939'],
  ['). C’est pour cela que chaque contact Kairn arrive avec la date et l’heure de sa demande.'],
]];
const RENOV_LEGAL_ECRIT = ['Pas de relance commerciale par SMS ou WhatsApp', 'Pour la rénovation énergétique, la prospection par SMS, e-mail, messagerie ou réseau social est interdite elle aussi (art. L223-8 du Code de la consommation, depuis le 02/07/2025), et l’exception des 5 jours ne vise que le téléphone. Un message qui répond directement à la demande, comme la confirmation d’un rendez-vous, reste possible.'];
const LEGAL_RGPD = ['Une demande consentie, pour un seul professionnel', 'La personne remplit elle-même le formulaire, sait pourquoi elle sera rappelée, et sa demande n’est transmise qu’à vous. Au premier appel, dites-lui d’où vient sa demande : c’est une exigence de la CNIL, et c’est aussi ce qui la met en confiance.'];
const LEGAL_RESPONSABLE = ['Le professionnel qui en profite est responsable', 'En cas de démarchage illicite, l’amende peut atteindre 375 000 € pour une société, le contrat signé est nul, et tout professionnel qui en a tiré profit est présumé responsable (art. L223-1). Acheter des demandes réelles et récentes, et les rappeler vite, est la meilleure protection.'];

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
    h1: ['Leads pompe à chaleur', 'exclusifs, chaque jour.'],
    chapo: 'Un lead pompe à chaleur Kairn est un propriétaire qui a demandé lui-même à être rappelé pour installer une PAC, après une publicité Meta dédiée. Il est envoyé à un seul installateur, dans votre zone, pour 28 € HT le contact, sans abonnement ni engagement.',
    motTitre: 'pompe à chaleur',
    motCommande: 'PAC',
    pourLe: 'aux projets de pompe à chaleur',
    definition: 'Un contact de particulier qui a rempli lui-même une demande de rappel pour un projet de pompe à chaleur : coordonnées, statut d’occupation, logement, chauffage actuel et surface.',
    bref: ['Rappel conseillé', 'Dans l’heure si possible, et toujours sous 5 jours ouvrables : au-delà, l’appel redevient du démarchage, interdit en rénovation énergétique (art. R223-4).'],
    qualif: 'Avant d’appeler, vous savez si la personne est propriétaire, dans quel logement elle vit, comment elle se chauffe aujourd’hui et quelle surface il faut chauffer. De quoi préparer un premier chiffrage et écarter d’emblée les projets qui ne sont pas pour vous.',
    champs: [
      ['Statut', 'Propriétaire ou locataire'],
      ['Logement', 'Maison ou appartement'],
      ['Chauffage actuel', 'Gaz, fioul, électrique, bois…'],
      ['Surface', 'Tranche de surface chauffée'],
    ],
    pourQuiTitre: ['Pour les installateurs', 'qui posent des PAC.'],
    pourQui: [
      ['Chauffagistes RGE QualiPAC', 'Vous posez vous-même et voulez remplir le planning avec des projets dans votre secteur, sans dépendre du bouche-à-oreille ni des plateformes partagées.'],
      ['Entreprises de rénovation énergétique', 'Vous avez des équipes de pose et des commerciaux à occuper : un flux régulier de demandes de PAC, au rythme que vous choisissez.'],
      ['Structures commerciales', 'Vous vendez et faites poser par des partenaires : vous absorbez du volume et vous avez besoin de demandes récentes, que vous êtes seul à appeler.'],
    ],
    exclusif: 'Une demande de PAC revendue à plusieurs installateurs se joue au premier qui décroche son téléphone, et le particulier, appelé cinq fois, finit par ne plus répondre. Un lead exclusif vous laisse le temps de bien préparer l’appel.',
    marcheTitre: ['Un marché de la PAC', 'qui repart en 2026.'],
    marcheIntro: 'Après deux années de baisse, les ventes de pompes à chaleur air-eau repartent nettement en 2026. Les chiffres ci-dessous portent leur source.',
    marche: [
      { v: '179 377', l: 'pompes à chaleur air-eau vendues en France en 2025 (-1,8 % sur un an).', src: 'Uniclima, bilan 2025 (05/02/2026)', url: 'https://fpa.fr/wp-content/uploads/2026/02/CP-Uniclima_bilan-2025-et-perspectives-2026_5-02-26-VF.pdf' },
      { v: '+20,3 %', l: 'de ventes de PAC air-eau sur les huit premiers mois de 2026 par rapport à 2025.', src: 'Effy, d’après Uniclima (30/09/2026)', url: 'https://www.effy.fr/pro/actualite/bilan-uniclima-les-pompes-a-chaleur-retrouvent-la-croissance-en-2026' },
      { v: '15 496', l: 'établissements RGE qualifiés pour la pompe à chaleur chez les particuliers.', src: 'ADEME, liste des entreprises RGE (lue le 27/10/2026)', url: 'https://data.ademe.fr/datasets/liste-des-entreprises-rge-2' },
      { v: '10 000 à 18 000 €', l: 'TTC pour une PAC air-eau posée dans une maison, main-d’œuvre comprise.', src: 'Hello Watt (lu le 27/10/2026)', url: 'https://www.hellowatt.fr/pompe-a-chaleur/installation-pompe-chaleur/prix-pompe-a-chaleur' },
    ],
    legal: [
      RENOV_LEGAL_DEMARCHAGE,
      RENOV_LEGAL_ECRIT,
      LEGAL_RGPD,
      ['Le RGE compte pour les aides', [
        ['MaPrimeRénov’ et les primes CEE (Coup de pouce chauffage) ne sont versées que si la pose est faite par une entreprise RGE. Beaucoup de particuliers posent la question dès le premier appel : '],
        ['France Rénov’', 'https://france-renov.gouv.fr/professionnels'],
        [' détaille les conditions.'],
      ]],
      LEGAL_RESPONSABLE,
    ],
    prixTexte: '28 € HT le contact, payé sur bon de commande, par virement. Kairn paie la publicité : vous n’avancez aucun budget, vous payez les contacts livrés. Pour situer ce prix, une PAC air-eau posée se facture 10 000 à 18 000 € TTC (Hello Watt).',
    faq: [
      ['Combien coûte un lead pompe à chaleur ?', '28 € HT le contact chez Kairn, payé sur bon de commande par virement. La publicité est payée par Kairn : vous ne payez que les contacts livrés, sans abonnement. Première commande à partir de 50 contacts.'],
      ['Un lead PAC est-il vendu à plusieurs installateurs ?', 'Non. Chaque contact est envoyé à un seul installateur et n’est jamais revendu. La campagne qui le produit est dédiée à la pompe à chaleur et à votre zone.'],
      ['Dans quel délai faut-il rappeler un lead PAC ?', 'Le plus vite possible, idéalement dans l’heure : la personne a encore son projet en tête. La loi fixe aussi une limite : en rénovation énergétique, l’appel doit avoir lieu dans les 5 jours ouvrables qui suivent la demande (art. R223-4 du Code de la consommation). Chaque contact arrive avec la date et l’heure de sa demande.'],
      ['Faut-il être RGE pour acheter des leads pompe à chaleur ?', 'Les aides de l’État (MaPrimeRénov’, primes CEE) exigent une pose par une entreprise RGE QualiPAC. Sans qualification, vous pouvez rappeler les contacts, mais une partie des particuliers comptera sur ces aides : mieux vaut le savoir avant de commander.'],
      ['Puis-je choisir ma zone ?', 'Oui. Vous choisissez à la commande la France entière, des régions, des départements (trois au moins) ou des zones climatiques (H1, H2, H3). Un contact hors de votre zone est remplacé.'],
      ['Que se passe-t-il si le contact est un doublon ou hors zone ?', 'Vous le signalez depuis votre espace client. Après vérification, il est remplacé par un nouveau contact.'],
      ['Garantissez-vous des chantiers signés ?', 'Non, et méfiez-vous de ceux qui le promettent. Kairn s’engage sur le contact : une demande réelle, récente, dans votre zone, envoyée à vous seul. La signature se joue au téléphone et au devis.'],
      ['Quelle différence avec l’achat d’un fichier de prospects ?', 'Un fichier contient des personnes qui n’ont rien demandé, et le démarchage téléphonique est interdit en rénovation énergétique. Un lead Kairn est une demande que la personne vient de faire elle-même, que vous avez le droit de rappeler.'],
    ],
    proches: ['leads-isolation-thermique-exterieur', 'leads-panneaux-solaires', 'leads-isolation-combles', 'leads-toiture'],
  },

  // Pages à rédiger (étape 2 du plan) : métadonnées seulement, pour le maillage une fois prêtes.
  { pret: false, slug: 'leads-panneaux-solaires', code: 'PPV', produit: 'PPV', groupe: 'renovation', court: 'Panneaux solaires', label: 'Leads panneaux solaires', resume: 'Des propriétaires qui veulent poser des panneaux photovoltaïques.' },
  { pret: false, slug: 'leads-isolation-thermique-exterieur', code: 'ITE', produit: 'ITE', groupe: 'renovation', court: 'Isolation par l’extérieur', label: 'Leads ITE (isolation par l’extérieur)', resume: 'Des propriétaires de maison qui veulent isoler leurs murs par l’extérieur.' },
  { pret: false, slug: 'leads-isolation-combles', code: 'COMBLES', groupe: 'renovation', court: 'Isolation des combles', label: 'Leads isolation des combles', resume: 'Des propriétaires qui veulent isoler leurs combles perdus ou aménagés.' },
  { pret: false, slug: 'leads-toiture', code: 'TOITURE', groupe: 'renovation', court: 'Toiture', label: 'Leads toiture', resume: 'Couverture, charpente, zinguerie : des propriétaires avec un projet de toit.' },
  { pret: false, slug: 'leads-fenetres-menuiserie', code: 'MENUISERIE', groupe: 'renovation', court: 'Fenêtres et menuiserie', label: 'Leads fenêtres et menuiserie', resume: 'Des propriétaires qui veulent changer leurs fenêtres, portes ou volets.' },
  { pret: false, slug: 'leads-regroupement-de-credits', code: 'CREDIT', groupe: 'finance', court: 'Regroupement de crédits', label: 'Leads regroupement de crédits', resume: 'Des particuliers qui veulent regrouper leurs crédits en une seule mensualité.' },
  { pret: false, slug: 'leads-assurance', code: 'ASSURANCE', groupe: 'finance', court: 'Assurance', label: 'Leads assurance', resume: 'Mutuelle santé, assurance emprunteur, contrat obsèques.', enfants: ['leads-mutuelle-sante', 'leads-assurance-emprunteur', 'leads-contrat-obseques'] },
  { pret: false, slug: 'leads-mutuelle-sante', code: 'MUTUELLE', groupe: 'finance', parent: 'leads-assurance', court: 'Mutuelle santé', label: 'Leads mutuelle santé', resume: 'Des particuliers, souvent seniors, qui comparent leur complémentaire santé.' },
  { pret: false, slug: 'leads-assurance-emprunteur', code: 'EMPRUNTEUR', groupe: 'finance', parent: 'leads-assurance', court: 'Assurance emprunteur', label: 'Leads assurance emprunteur', resume: 'Des emprunteurs qui veulent changer d’assurance de prêt.' },
  { pret: false, slug: 'leads-contrat-obseques', code: 'OBSEQUES', groupe: 'finance', parent: 'leads-assurance', court: 'Contrat obsèques', label: 'Leads contrat obsèques', resume: 'Des particuliers qui veulent préparer et financer leurs obsèques.' },
  { pret: false, slug: 'leads-appareils-auditifs', code: 'AUDITION', groupe: 'services', court: 'Appareils auditifs', label: 'Leads appareils auditifs', resume: 'Des personnes qui veulent un bilan auditif ou un appareil.' },
  { pret: false, slug: 'leads-pompes-funebres', code: 'FUNERAIRE', groupe: 'services', court: 'Pompes funèbres', label: 'Leads pompes funèbres', resume: 'Des familles qui préparent des obsèques ou une prévoyance.' },
  { pret: false, slug: 'leads-formation-professionnelle', code: 'FORMATION', groupe: 'services', court: 'Formation professionnelle', label: 'Leads formation professionnelle', resume: 'Des actifs et des entreprises qui cherchent une formation.' },
  { pret: false, slug: 'leads-demenagement', code: 'DEMENAGEMENT', groupe: 'services', court: 'Déménagement', label: 'Leads déménagement', resume: 'Des particuliers qui préparent un déménagement et demandent un devis.' },
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
