// Questionnaire d'onboarding d'un site vitrine : tronc commun + module par secteur.
// Chaque section devient une étape ; chaque champ est stocké sous sa clé `id`.
// Types : text, email, tel, url, textarea, select, radio, checks (choix multiples + « Autre »),
// list (lignes répétables, `fields` = sous-champs), files (envoi de fichiers), colors.

const yesNo = ['Oui', 'Non', 'Je ne sais pas'];

const COMMON_START = [
  {
    id: 'identite',
    title: 'Votre entreprise',
    intro: 'Les informations de base qui apparaîtront sur le site et dans les mentions légales.',
    fields: [
      { id: 'nom_commercial', type: 'text', label: 'Nom affiché sur le site', placeholder: 'Ex. Cabinet Martin Assurances' },
      { id: 'raison_sociale', type: 'text', label: 'Raison sociale (si différente)' },
      { id: 'forme_juridique', type: 'text', label: 'Forme juridique et capital', placeholder: 'Ex. SARL au capital de 10 000 €' },
      { id: 'siren', type: 'text', label: 'SIREN ou SIRET' },
      { id: 'rcs', type: 'text', label: 'Ville d’immatriculation (RCS)' },
      { id: 'tva', type: 'text', label: 'Numéro de TVA intracommunautaire' },
      { id: 'dirigeant', type: 'text', label: 'Nom du dirigeant (directeur de la publication)' },
      { id: 'annee_creation', type: 'text', label: 'Année de création' },
    ],
  },
  {
    id: 'contact',
    title: 'Coordonnées',
    intro: 'Comment vos clients vous joignent et où ils vous trouvent.',
    fields: [
      { id: 'agences', type: 'list', label: 'Vos agences ou bureaux', addLabel: 'Ajouter une agence', fields: [
        { id: 'nom', label: 'Nom de l’agence' },
        { id: 'adresse', label: 'Adresse complète' },
        { id: 'telephone', label: 'Téléphone' },
        { id: 'horaires', label: 'Horaires', placeholder: 'Lun-ven 9h-12h / 14h-18h' },
      ] },
      { id: 'telephone', type: 'tel', label: 'Téléphone principal' },
      { id: 'email', type: 'email', label: 'E-mail de contact affiché' },
      { id: 'email_demandes', type: 'email', label: 'E-mail qui reçoit les demandes du site', hint: 'Si différent de l’e-mail affiché.' },
      { id: 'reseaux', type: 'list', label: 'Réseaux sociaux', addLabel: 'Ajouter un réseau', fields: [
        { id: 'reseau', label: 'Réseau', placeholder: 'LinkedIn, Facebook…' },
        { id: 'lien', label: 'Lien' },
      ] },
      { id: 'google_business', type: 'url', label: 'Lien de votre fiche Google (avis)', hint: 'Pour afficher vos avis Google sur le site.' },
    ],
  },
];

const INSURANCE = [
  {
    id: 'reglementaire',
    title: 'Statut et mentions obligatoires',
    intro: 'Un intermédiaire en assurance doit afficher certaines informations sur son site. On vérifiera ensemble la liste exacte avant la mise en ligne.',
    fields: [
      { id: 'categorie_orias', type: 'checks', label: 'Votre catégorie d’intermédiaire', options: ['Courtier en assurance', 'Agent général d’assurance', 'Mandataire d’assurance', 'Mandataire d’intermédiaire d’assurance', 'Courtier en opérations de banque (IOBSP)'], other: true },
      { id: 'orias', type: 'text', label: 'Numéro ORIAS', placeholder: '8 chiffres' },
      { id: 'compagnies_mandantes', type: 'textarea', label: 'Compagnie(s) que vous représentez', hint: 'Pour un agent général ou un mandataire : la ou les compagnies mandantes.' },
      { id: 'lien_capitalistique', type: 'radio', label: 'Un assureur détient-il plus de 10 % de votre capital, ou l’inverse ?', options: yesNo },
      { id: 'reclamations', type: 'textarea', label: 'Comment un client fait une réclamation', hint: 'Adresse postale et e-mail du service réclamations, délai de réponse.' },
      { id: 'mediateur', type: 'text', label: 'Médiateur auquel vous adhérez', placeholder: 'Ex. La Médiation de l’Assurance' },
      { id: 'rc_pro', type: 'text', label: 'Assureur de votre responsabilité civile professionnelle' },
      { id: 'remuneration', type: 'checks', label: 'Comment êtes-vous rémunéré ?', options: ['Commission incluse dans la prime', 'Honoraires payés par le client', 'Les deux'], other: true },
    ],
  },
  {
    id: 'offre',
    title: 'Vos produits et vos clients',
    intro: 'Ce que vous vendez et à qui : c’est ce qui structure les pages du site.',
    fields: [
      { id: 'cibles', type: 'checks', label: 'Vos clients', options: ['Particuliers', 'Professionnels et artisans', 'Entreprises', 'Professions libérales', 'Agriculteurs', 'Associations'], other: true },
      { id: 'produits_particuliers', type: 'checks', label: 'Produits pour les particuliers', options: ['Auto et moto', 'Habitation', 'Santé et mutuelle', 'Prévoyance', 'Assurance emprunteur', 'Épargne et assurance-vie', 'Retraite (PER)', 'Obsèques', 'Animaux', 'Protection juridique'], other: true },
      { id: 'produits_pros', type: 'checks', label: 'Produits pour les professionnels', options: ['Responsabilité civile professionnelle', 'Multirisque professionnelle', 'Décennale', 'Flotte automobile', 'Santé et prévoyance collective', 'Homme clé', 'Cyber', 'Protection juridique pro', 'Prévoyance du dirigeant (TNS)'], other: true },
      { id: 'produits_phares', type: 'textarea', label: 'Les 2 ou 3 produits que vous voulez mettre en avant', hint: 'Ceux qui vous rapportent le plus ou sur lesquels vous êtes les meilleurs.' },
      { id: 'partenaires', type: 'textarea', label: 'Compagnies partenaires que vous pouvez citer', hint: 'Vérifiez que vous avez le droit d’afficher leur nom ou leur logo.' },
      { id: 'zone', type: 'text', label: 'Zone d’intervention', placeholder: 'Ex. Gironde et Landes, ou toute la France à distance' },
    ],
  },
];

const COMMON_END = [
  {
    id: 'positionnement',
    title: 'Ce qui vous distingue',
    intro: 'Pourquoi un client vous choisit vous plutôt qu’un autre. Écrivez comme vous le diriez à l’oral.',
    fields: [
      { id: 'presentation', type: 'textarea', label: 'Présentez votre activité en quelques phrases' },
      { id: 'differences', type: 'textarea', label: 'Ce qui vous différencie de vos concurrents' },
      { id: 'client_ideal', type: 'textarea', label: 'Votre client idéal', hint: 'Qui il est, ce qu’il cherche, ce qui l’inquiète.' },
      { id: 'chiffres', type: 'textarea', label: 'Chiffres que vous pouvez afficher', hint: 'Années d’expérience, nombre de clients, note Google… uniquement des chiffres vérifiables.' },
      { id: 'temoignages', type: 'textarea', label: 'Témoignages clients (avec leur accord)' },
      { id: 'concurrents', type: 'textarea', label: 'Vos principaux concurrents (noms ou sites)' },
    ],
  },
  {
    id: 'objectifs',
    title: 'Ce que le site doit faire',
    intro: 'Un site vitrine sert à déclencher une action. Laquelle compte le plus pour vous ?',
    fields: [
      { id: 'objectif_principal', type: 'radio', label: 'Objectif principal', options: ['Recevoir des demandes de devis', 'Recevoir des appels', 'Faire prendre rendez-vous', 'Rassurer les clients qui me connaissent déjà'], other: true },
      { id: 'formulaire_devis', type: 'textarea', label: 'Questions à poser dans le formulaire de devis', hint: 'Ce dont vous avez besoin pour rappeler un prospect efficacement.' },
      { id: 'prise_rdv', type: 'radio', label: 'Prise de rendez-vous en ligne ?', options: ['Oui, j’ai déjà un outil (Calendly, etc.)', 'Oui, à mettre en place', 'Non'] },
      { id: 'lien_rdv', type: 'url', label: 'Lien de votre outil de rendez-vous' },
      { id: 'pages', type: 'checks', label: 'Pages souhaitées', options: ['Accueil', 'Qui sommes-nous', 'Une page par produit', 'Particuliers / Professionnels séparés', 'Contact et devis', 'FAQ', 'Blog / actualités', 'Recrutement'], other: true },
    ],
  },
  {
    id: 'equipe',
    title: 'Votre équipe',
    intro: 'Montrer les visages rassure, surtout en assurance. Facultatif.',
    fields: [
      { id: 'membres', type: 'list', label: 'Membres à présenter', addLabel: 'Ajouter une personne', fields: [
        { id: 'nom', label: 'Prénom et nom' },
        { id: 'role', label: 'Fonction' },
        { id: 'bio', label: 'Une phrase sur elle' },
      ] },
      { id: 'photos_equipe', type: 'files', label: 'Photos de l’équipe et des locaux', accept: 'image/*', multiple: true },
    ],
  },
  {
    id: 'identite_visuelle',
    title: 'Identité visuelle',
    intro: 'Pour que le site vous ressemble.',
    fields: [
      { id: 'logo', type: 'files', label: 'Votre logo', hint: 'Idéalement en SVG ou PNG haute définition.', accept: 'image/*,.svg,.pdf,.ai,.eps', multiple: true },
      { id: 'charte', type: 'files', label: 'Charte graphique (si vous en avez une)', accept: 'image/*,.pdf', multiple: true },
      { id: 'couleurs', type: 'colors', label: 'Vos couleurs', hint: 'Laissez vide si vous voulez qu’on vous propose.' },
      { id: 'style', type: 'checks', label: 'L’ambiance recherchée', options: ['Sobre et institutionnel', 'Moderne et épuré', 'Chaleureux et proche', 'Haut de gamme', 'Coloré et dynamique'], other: true },
      { id: 'sites_aimes', type: 'list', label: 'Sites que vous aimez (de n’importe quel secteur)', addLabel: 'Ajouter un site', fields: [
        { id: 'lien', label: 'Lien' },
        { id: 'pourquoi', label: 'Ce qui vous plaît' },
      ] },
      { id: 'a_eviter', type: 'textarea', label: 'Ce que vous ne voulez surtout pas' },
      { id: 'photos', type: 'radio', label: 'Photos du site', options: ['J’ai mes propres photos', 'Photos de banque d’images', 'Un mélange des deux', 'Je voudrais organiser un shooting'] },
      { id: 'photos_fichiers', type: 'files', label: 'Vos photos', accept: 'image/*', multiple: true },
    ],
  },
  {
    id: 'contenus',
    title: 'Textes et contenus',
    fields: [
      { id: 'redaction', type: 'radio', label: 'Qui écrit les textes du site ?', options: ['Kairn les rédige, je valide', 'Je fournis les textes', 'On les écrit ensemble'] },
      { id: 'documents', type: 'files', label: 'Documents utiles (plaquette, anciens textes, présentation)', accept: '.pdf,.doc,.docx,.ppt,.pptx,.txt,image/*', multiple: true },
      { id: 'faq', type: 'textarea', label: 'Les questions que vos clients vous posent le plus', hint: 'Elles serviront pour la FAQ.' },
      { id: 'vouvoiement', type: 'radio', label: 'Le site s’adresse aux visiteurs en', options: ['Vouvoiement', 'Tutoiement'] },
    ],
  },
  {
    id: 'technique',
    title: 'Technique et accès',
    intro: 'Ne mettez jamais de mot de passe ici : on organisera les accès ensemble.',
    fields: [
      { id: 'site_actuel', type: 'url', label: 'Site actuel (s’il existe)' },
      { id: 'domaine', type: 'radio', label: 'Avez-vous déjà un nom de domaine ?', options: ['Oui', 'Non, il faut en acheter un', 'Je ne sais pas'] },
      { id: 'domaine_nom', type: 'text', label: 'Nom de domaine souhaité ou existant', placeholder: 'Ex. cabinet-martin.fr' },
      { id: 'registrar', type: 'text', label: 'Chez qui est-il ? (OVH, Gandi, IONOS…)' },
      { id: 'emails_pro', type: 'radio', label: 'Vos e-mails professionnels utilisent ce domaine ?', options: yesNo, hint: 'Important : on ne doit pas les couper en branchant le site.' },
      { id: 'outils', type: 'textarea', label: 'Outils à relier au site', hint: 'Logiciel de gestion de cabinet, CRM, outil de devis, comparateur…' },
    ],
  },
  {
    id: 'projet',
    title: 'Planning et dernières infos',
    fields: [
      { id: 'interlocuteur', type: 'text', label: 'Votre interlocuteur pour le projet' },
      { id: 'interlocuteur_contact', type: 'text', label: 'Son téléphone et son e-mail' },
      { id: 'date_souhaitee', type: 'text', label: 'Date de mise en ligne souhaitée' },
      { id: 'contraintes', type: 'textarea', label: 'Contraintes à connaître', hint: 'Validation par une compagnie, événement, salon…' },
      { id: 'commentaires', type: 'textarea', label: 'Autre chose à nous dire ?' },
    ],
  },
];

export const SECTORS = { assurance: 'Cabinet d’assurance', generique: 'Site vitrine' };

export function sectionsFor(sector) {
  const middle = sector === 'assurance' ? INSURANCE : [];
  return [...COMMON_START, ...middle, ...COMMON_END];
}

// Valeur considérée comme remplie (pour la progression et les champs obligatoires).
export function isFilled(v) {
  if (v == null) return false;
  if (Array.isArray(v)) return v.some((x) => (typeof x === 'object' ? Object.values(x || {}).some(isFilled) : isFilled(x)));
  if (typeof v === 'object') return Object.values(v).some(isFilled);
  return String(v).trim() !== '';
}
