// Texte des pages « Leads {thématique} », par adresse (voir thematiques.js pour le catalogue léger).
// Chargé seulement avec la page (lead-page.jsx) et par le pré-rendu. Chaque chiffre de marché porte sa source
// et sa date de lecture. Vouvoiement, pas de tiret cadratin, aucun nom de personne réelle (Ugo, 09/11/2026).

export const RENOV_LEGAL_DEMARCHAGE = ['Démarchage interdit, rappel d’une demande permis', [
  ['Le démarchage téléphonique des particuliers pour des travaux de rénovation énergétique est interdit, sauf contrat en cours (Code de la consommation, '],
  ['art. L223-1', 'https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006069565/LEGISCTA000032221441'],
  ['). Depuis le 11/08/2026, rappeler une personne qui a fait elle-même une demande n’est pas du démarchage si vous pouvez prouver la demande, si l’appel a lieu dans les 5 jours ouvrables et s’il ne porte que sur l’objet demandé ('],
  ['art. R223-4, décret n° 2026-662', 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000054483939'],
  ['). C’est pour cela que chaque contact Kairn arrive avec la date et l’heure de sa demande.'],
]];
export const RENOV_LEGAL_ECRIT = ['Pas de relance commerciale par SMS ou WhatsApp', 'Pour la rénovation énergétique, la prospection par SMS, e-mail, messagerie ou réseau social est interdite elle aussi (art. L223-8 du Code de la consommation, depuis le 02/07/2025), et l’exception des 5 jours ne vise que le téléphone. Un message qui répond directement à la demande, comme la confirmation d’un rendez-vous, reste possible.'];
export const LEGAL_RGPD = ['Une demande consentie, pour un seul professionnel', 'La personne remplit elle-même le formulaire, sait pourquoi elle sera rappelée, et sa demande n’est transmise qu’à vous. Au premier appel, dites-lui d’où vient sa demande : c’est une exigence de la CNIL, et c’est aussi ce qui la met en confiance.'];
export const LEGAL_RESPONSABLE = ['Le professionnel qui en profite est responsable', 'En cas de démarchage illicite, l’amende peut atteindre 375 000 € pour une société, le contrat signé est nul, et tout professionnel qui en a tiré profit est présumé responsable (art. L223-1). Acheter des demandes réelles et récentes, et les rappeler vite, est la meilleure protection.'];

export const CONTENUS = {
  // ───────────────────────────── Pompe à chaleur ─────────────────────────────
  'leads-pompe-a-chaleur': {
    h1: ['Leads pompe à chaleur', 'exclusifs, chaque jour.'],
    chapo: 'Un lead pompe à chaleur exclusif coûte 28 € HT chez Kairn, transmis à un seul installateur, sans engagement, à partir de 50 contacts. C’est un particulier qui a demandé lui-même à être rappelé pour installer une PAC, après une publicité Meta dédiée à votre zone.',
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
    // [titre, texte, icône, étiquettes]
    pourQui: [
      ['Chauffagistes RGE QualiPAC', 'Vous posez vous-même et voulez remplir le planning avec des projets dans votre secteur, sans dépendre du bouche-à-oreille ni des plateformes partagées.', 'wrench', ['Pose en direct', 'QualiPAC', '1 à 10 salariés']],
      ['Entreprises de rénovation énergétique', 'Vous avez des équipes de pose et des commerciaux à occuper : un flux régulier de demandes de PAC, au rythme que vous choisissez.', 'building', ['Équipes de pose', 'Commerciaux', 'Multi-métiers']],
      ['Structures commerciales', 'Vous vendez et faites poser par des partenaires : vous absorbez du volume et vous avez besoin de demandes récentes, que vous êtes seul à appeler.', 'briefcase', ['Gros volumes', 'Vente', 'Pose sous-traitée']],
    ],
    // Fiche d'exemple (données fictives) et question du formulaire montrée dans « Comment ça marche ».
    exemple: { init: 'JP', nom: 'Jean P.', ville: 'Mérignac · 33700', projet: 'Pompe à chaleur', mail: 'j•••••@orange.fr', reponses: [['Statut', 'Propriétaire'], ['Logement', 'Maison'], ['Chauffage', 'Fioul'], ['Surface', '110 à 150 m²']] },
    form: ['Comment vous chauffez-vous aujourd’hui ?', ['Fioul', 'Gaz', 'Électrique']],
    exclusif: 'Une demande de PAC revendue à plusieurs installateurs se joue au premier qui décroche son téléphone, et le particulier, appelé plusieurs fois, finit par ne plus répondre. Un lead exclusif vous laisse le temps de bien préparer l’appel.',
    marcheTitre: ['Un marché de la PAC', 'qui repart en 2026.'],
    marcheIntro: 'Après deux années de baisse, les ventes de pompes à chaleur air-eau repartent nettement en 2026. Les chiffres ci-dessous portent leur source.',
    marche: [
      { v: '179 377', l: 'pompes à chaleur air-eau vendues en France en 2025 (-1,8 % sur un an).', src: 'Uniclima, bilan 2025 (05/02/2026)', url: 'https://fpa.fr/wp-content/uploads/2026/02/CP-Uniclima_bilan-2025-et-perspectives-2026_5-02-26-VF.pdf' },
      { v: '+20,3 %', l: 'de ventes de PAC air-eau sur les huit premiers mois de 2026 par rapport à 2025.', src: 'Effy, d’après Uniclima (30/09/2026)', url: 'https://www.effy.fr/pro/actualite/bilan-uniclima-les-pompes-a-chaleur-retrouvent-la-croissance-en-2026' },
      { v: '15 496', l: 'établissements RGE qualifiés pour la pompe à chaleur chez les particuliers.', src: 'ADEME, liste des entreprises RGE (lue le 27/10/2026)', url: 'https://data.ademe.fr/datasets/liste-des-entreprises-rge-2' },
      { v: '5 000 €', l: 'd’aide MaPrimeRénov’ au plus pour une PAC air-eau (ménages très modestes) : c’est l’un des rares gestes encore aidés seuls depuis le 01/09/2026.', src: 'Service-public.gouv.fr, fiche F35083 (lue le 09/11/2026)', url: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F35083' },
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
    prixTexte: '28 € HT le contact, payé sur bon de commande, par virement. Kairn paie la publicité : vous n’avancez aucun budget, vous payez les contacts livrés. Le prix ne dépend ni du département ni du volume commandé.',
    faq: [
      ['Combien coûte un lead pompe à chaleur ?', '28 € HT le contact chez Kairn, payé sur bon de commande par virement. La publicité est payée par Kairn : vous ne payez que les contacts livrés, sans abonnement. Première commande à partir de 50 contacts.'],
      ['Un lead PAC est-il vendu à plusieurs installateurs ?', 'Non. Chaque contact est envoyé à un seul installateur et n’est jamais revendu. La campagne qui le produit est dédiée à la pompe à chaleur et à votre zone.'],
      ['Dans quel délai faut-il rappeler un lead PAC ?', 'Le plus vite possible, idéalement dans l’heure : la personne a encore son projet en tête. La loi fixe aussi une limite : en rénovation énergétique, l’appel doit avoir lieu dans les 5 jours ouvrables qui suivent la demande (art. R223-4 du Code de la consommation). Chaque contact arrive avec la date et l’heure de sa demande.'],
      ['Faut-il être RGE pour acheter des leads pompe à chaleur ?', 'Les aides de l’État (MaPrimeRénov’, primes CEE) exigent une pose par une entreprise RGE QualiPAC. Sans qualification, vous pouvez rappeler les contacts, mais une partie des particuliers comptera sur ces aides : mieux vaut le savoir avant de commander.'],
      ['Les contacts sont-ils tous propriétaires d’une maison ?', 'Chaque contact indique s’il est propriétaire ou locataire, et s’il vit en maison ou en appartement. Les critères d’envoi, par exemple les propriétaires de maison seulement, se règlent avec vous avant le lancement : un contact qui n’y répond pas ne vous est pas envoyé.'],
      ['Les particuliers peuvent-ils encore toucher MaPrimeRénov’ pour une PAC ?', 'Oui pour la PAC air-eau : depuis le 01/09/2026, c’est l’un des rares gestes encore aidés seuls, de 3 000 à 5 000 € selon les revenus, et rien pour les revenus supérieurs. La PAC air-air n’y est pas éligible. Les primes CEE (Coup de pouce chauffage) s’y ajoutent. Les conditions à jour sont sur service-public.gouv.fr (fiche F35083).'],
      ['Puis-je choisir ma zone ?', 'Oui. Vous choisissez à la commande la France entière, des régions, des départements (trois au moins) ou des zones climatiques (H1, H2, H3). Un contact hors de votre zone est remplacé.'],
      ['Que se passe-t-il si le contact est un doublon ou hors zone ?', 'Vous le signalez depuis votre espace client. Après vérification, il est remplacé par un nouveau contact.'],
      ['Garantissez-vous des chantiers signés ?', 'Non, et méfiez-vous de ceux qui le promettent. Kairn s’engage sur le contact : une demande réelle, récente, dans votre zone, envoyée à vous seul. La signature se joue au téléphone et au devis.'],
      ['Quelle différence avec l’achat d’un fichier de prospects ?', 'Un fichier contient des personnes qui n’ont rien demandé, et le démarchage téléphonique est interdit en rénovation énergétique. Un lead Kairn est une demande que la personne vient de faire elle-même, que vous avez le droit de rappeler.'],
    ],
    proches: ['leads-isolation-thermique-exterieur', 'leads-panneaux-solaires', 'leads-isolation-combles', 'leads-toiture'],
  },
  // ───────────────────────────── Panneaux solaires ─────────────────────────────
  'leads-panneaux-solaires': {
    "h1": [
      "Leads panneaux solaires",
      "pour l’autoconsommation."
    ],
    "chapo": "Un lead panneaux solaires exclusif coûte 35 € HT chez Kairn, envoyé à un seul installateur photovoltaïque, sans engagement, à partir de 50 contacts. C’est un propriétaire qui a demandé lui-même à être rappelé pour un projet de panneaux sur son toit, après une publicité Meta diffusée dans votre zone et centrée sur sa facture d’électricité.",
    "motTitre": "panneaux solaires",
    "motCommande": "photovoltaïque",
    "pourLe": "aux projets de panneaux solaires",
    "definition": "Un contact de particulier qui a rempli lui-même une demande de rappel pour installer des panneaux photovoltaïques : coordonnées, statut d’occupation, logement, toiture et montant de sa facture d’électricité.",
    "bref": [
      "Autoconsommation d’abord",
      "Depuis le 05/06/2026, la prime à l’autoconsommation n’existe plus pour les nouveaux projets et le surplus revendu est payé 1,1 c€ le kWh : le projet se vend sur la baisse de la facture, plus sur la revente."
    ],
    "qualif": "Avant d’appeler, vous savez si la personne est propriétaire d’une maison, comment est orienté son toit et ce qu’elle paie d’électricité chaque mois. Vous arrivez au premier appel avec un ordre de grandeur de puissance en tête, et vous écartez tout de suite le toit plein nord ou l’appartement.",
    "champs": [
      [
        "Statut",
        "Propriétaire ou locataire"
      ],
      [
        "Logement",
        "Maison ou appartement"
      ],
      [
        "Toiture",
        "Orientation et couverture"
      ],
      [
        "Facture d’électricité",
        "Tranche de montant mensuel"
      ]
    ],
    "pourQuiTitre": [
      "Pour les installateurs",
      "qui posent du solaire."
    ],
    "pourQui": [
      [
        "Installateurs RGE QualiPV",
        "Vous posez des centrales de 3 à 9 kWc chez les particuliers et voulez des demandes de votre secteur, que vous êtes seul à rappeler, pour caler vos équipes de pose semaine après semaine.",
        "wrench",
        [
          "QualiPV 36",
          "Résidentiel",
          "Pose en direct"
        ]
      ],
      [
        "Électriciens et couvreurs",
        "Le photovoltaïque complète votre métier : un flux de projets solaires dans votre zone, au volume que vous choisissez, sans monter un service marketing.",
        "home",
        [
          "Électricité",
          "Couverture",
          "Activité en plus"
        ]
      ],
      [
        "Sociétés régionales de solaire",
        "Vous avez des commerciaux qui partent en rendez-vous chaque jour : il leur faut des demandes récentes, avec la toiture et la consommation déjà connues.",
        "briefcase",
        [
          "Commerciaux",
          "Volume",
          "Batterie et borne"
        ]
      ]
    ],
    "exemple": {
      "init": "SL",
      "nom": "Sophie L.",
      "ville": "Montauban · 82000",
      "projet": "Panneaux solaires",
      "mail": "s•••••@gmail.com",
      "reponses": [
        [
          "Statut",
          "Propriétaire"
        ],
        [
          "Logement",
          "Maison"
        ],
        [
          "Toiture",
          "Tuiles, plein sud"
        ],
        [
          "Facture",
          "150 à 200 € par mois"
        ]
      ]
    },
    "form": [
      "Combien payez-vous d’électricité par mois ?",
      [
        "Moins de 100 €",
        "100 à 200 €",
        "Plus de 200 €"
      ]
    ],
    "exclusif": "Un projet solaire se décide sur la confiance, dans un secteur où les particuliers ont appris à se méfier des vendeurs trop pressants. Si vous êtes le seul à rappeler, vous avez le temps d’expliquer l’autoconsommation au lieu de courir après un client déjà sollicité par trois concurrents.",
    "marcheTitre": [
      "Un parc solaire",
      "qui grandit encore."
    ],
    "marcheIntro": "Le photovoltaïque raccordé progresse chaque année en France, alors que les règles de revente ont changé en juin 2026. Les chiffres ci-dessous portent leur source.",
    "marche": [
      {
        "v": "31,3 GW",
        "l": "de parc photovoltaïque raccordé en France au 31/12/2025.",
        "src": "SDES, tableau de bord solaire T4 2025 (lu le 09/11/2026)",
        "url": "https://www.statistiques.developpement-durable.gouv.fr/tableau-de-bord-solaire-photovoltaique-quatrieme-trimestre-2025"
      },
      {
        "v": "6,1 GW",
        "l": "raccordés pendant l’année 2025, contre 5,2 GW en 2024.",
        "src": "SDES, tableau de bord solaire T4 2025 (lu le 09/11/2026)",
        "url": "https://www.statistiques.developpement-durable.gouv.fr/tableau-de-bord-solaire-photovoltaique-quatrieme-trimestre-2025"
      },
      {
        "v": "3 996",
        "l": "qualifications QualiPV 36 actives (installations jusqu’à 36 kVA) au 02/01/2026.",
        "src": "Qualit’EnR, rapport d’activité 2025 (lu le 09/11/2026)",
        "url": "https://www.qualit-enr.org/wp-content/uploads/2026/07/QEnR-RA-2025-WEB-pages.pdf"
      },
      {
        "v": "1,1 c€",
        "l": "HT le kWh de surplus revendu (jusqu’à 100 kWc) pour les projets déposés depuis le 05/06/2026, date de fin de la prime à l’autoconsommation.",
        "src": "CAPEB, d’après l’arrêté du 01/06/2026 (lu le 09/11/2026)",
        "url": "https://www.capeb.fr/actualites/photovoltaique-modification-des-conditions-d-achat-de-l-electricite-solaire"
      }
    ],
    "legal": [
      RENOV_LEGAL_DEMARCHAGE,
      RENOV_LEGAL_ECRIT,
      LEGAL_RGPD,
      [
        "Un secteur surveillé de près",
        [
          [
            "La loi de 2020 vise aussi la production d’énergie renouvelable : le solaire est concerné au même titre que l’isolation. C’est aussi le secteur le plus présent dans les procès en nullité de contrats et de crédits affectés. Un devis clair, sans promesse de revente, et les conditions d’achat du surplus à jour ("
          ],
          [
            "CAPEB",
            "https://www.capeb.fr/actualites/photovoltaique-modification-des-conditions-d-achat-de-l-electricite-solaire"
          ],
          [
            ") vous protègent."
          ]
        ]
      ],
      LEGAL_RESPONSABLE
    ],
    "prixTexte": "35 € HT le contact, payé sur bon de commande, par virement. Kairn paie la publicité : vous n’avancez aucun budget, vous payez les contacts livrés. Le prix est le même quel que soit le département.",
    "faq": [
      [
        "Combien coûte un lead panneaux solaires ?",
        "35 € HT le contact chez Kairn, payé sur bon de commande par virement. La publicité est payée par Kairn : vous ne payez que les contacts livrés, sans abonnement. Première commande à partir de 50 contacts."
      ],
      [
        "Un lead photovoltaïque est-il vendu à plusieurs installateurs ?",
        "Non. Chaque contact est envoyé à un seul installateur et n’est jamais revendu. La campagne qui le produit est dédiée au solaire et à votre zone."
      ],
      [
        "Le particulier veut-il revendre ou consommer son électricité ?",
        "Depuis l’arrêté du 01/06/2026, la prime à l’autoconsommation est supprimée pour les nouveaux projets et le surplus n’est plus racheté que 1,1 c€ HT le kWh. Les publicités Kairn parlent donc de baisse de facture, pas de revenu : la personne qui demande à être rappelée cherche à consommer ce qu’elle produit."
      ],
      [
        "Peut-on filtrer selon la toiture ?",
        "Oui. Chaque contact indique l’orientation et le type de couverture de son toit. Les critères d’envoi, par exemple les maisons seulement ou les toits orientés sud, est ou ouest, se règlent avec vous avant le lancement."
      ],
      [
        "A-t-on le droit de rappeler un lead photovoltaïque ?",
        "Oui, à condition de rappeler dans les 5 jours ouvrables qui suivent la demande et de ne parler que du projet demandé (art. R223-4 du Code de la consommation). Le démarchage téléphonique, lui, est interdit pour la production d’énergie renouvelable. Chaque contact arrive avec la date et l’heure de sa demande."
      ],
      [
        "Puis-je choisir ma zone ?",
        "Oui. Vous choisissez à la commande la France entière, des régions ou des départements (trois au moins). Un contact hors de votre zone est remplacé."
      ],
      [
        "Que se passe-t-il si le contact est un doublon ou hors zone ?",
        "Vous le signalez depuis votre espace client. Après vérification, il est remplacé par un nouveau contact."
      ],
      [
        "Garantissez-vous des installations signées ?",
        "Non. Kairn s’engage sur le contact : une demande réelle, récente, dans votre zone, envoyée à vous seul. La signature dépend de votre appel, de votre visite technique et de votre devis."
      ]
    ],
    "proches": [
      "leads-pompe-a-chaleur",
      "leads-toiture",
      "leads-isolation-combles",
      "leads-isolation-thermique-exterieur"
    ]
  },
  // ───────────────────────────── Isolation par l’extérieur ─────────────────────────────
  'leads-isolation-thermique-exterieur': {
    "h1": [
      "Leads isolation thermique par l’extérieur",
      "pour les façadiers."
    ],
    "chapo": "Un lead ITE exclusif coûte 27 € HT chez Kairn, envoyé à une seule entreprise d’isolation, sans engagement, à partir de 50 contacts. C’est un propriétaire de maison individuelle qui a demandé lui-même à être rappelé pour isoler ses murs par l’extérieur, après une publicité Meta diffusée dans votre zone.",
    "motTitre": "ITE",
    "motCommande": "ITE",
    "pourLe": "aux projets d’isolation par l’extérieur",
    "definition": "Un contact de particulier qui a rempli lui-même une demande de rappel pour isoler les murs de sa maison par l’extérieur : coordonnées, statut d’occupation, type de maison, nature des murs et surface de façade estimée.",
    "bref": [
      "Plus d’aide au geste",
      "Depuis le 01/01/2026, l’ITE seule n’est plus financée par MaPrimeRénov’ : la personne qui demande à être rappelée connaît souvent déjà la réponse, et vient pour le chantier, pas pour la prime."
    ],
    "qualif": "Avant d’appeler, vous savez si la personne est propriétaire, si sa maison est mitoyenne ou non, en quoi sont faits ses murs et quelle surface de façade est en jeu. De quoi estimer l’échafaudage et le chantier avant même la visite.",
    "champs": [
      [
        "Statut",
        "Propriétaire ou locataire"
      ],
      [
        "Maison",
        "Individuelle ou mitoyenne"
      ],
      [
        "Murs",
        "Parpaing, brique, pierre…"
      ],
      [
        "Façade",
        "Surface estimée à isoler"
      ]
    ],
    "pourQuiTitre": [
      "Pour les entreprises",
      "qui isolent les façades."
    ],
    "pourQui": [
      [
        "Façadiers et enduiseurs RGE",
        "Vous posez l’isolant et l’enduit vous-même : il vous faut des chantiers de maisons dans un rayon que vos équipes peuvent tenir, sans dépendre des appels d’offres.",
        "wrench",
        [
          "Qualibat",
          "Façade",
          "Pose en direct"
        ]
      ],
      [
        "Entreprises de rénovation globale",
        "Vous montez des projets de rénovation d’ampleur où l’ITE est le gros poste : vous cherchez des propriétaires prêts à traiter toute la maison.",
        "building",
        [
          "Rénovation d’ampleur",
          "Multi-lots",
          "Accompagnement"
        ]
      ],
      [
        "Entreprises d’isolation multi-postes",
        "Vous faites déjà combles et planchers : la façade est le chantier au plus gros montant, celui qui remplit un mois d’équipe.",
        "badge",
        [
          "Isolation",
          "Gros paniers",
          "Équipes de pose"
        ]
      ]
    ],
    "exemple": {
      "init": "MD",
      "nom": "Marc D.",
      "ville": "Saint-Quentin · 02100",
      "projet": "Isolation par l’extérieur",
      "mail": "m•••••@free.fr",
      "reponses": [
        [
          "Statut",
          "Propriétaire"
        ],
        [
          "Maison",
          "Individuelle"
        ],
        [
          "Murs",
          "Brique"
        ],
        [
          "Façade",
          "100 à 150 m²"
        ]
      ]
    },
    "form": [
      "En quoi sont construits les murs de votre maison ?",
      [
        "Parpaing",
        "Brique",
        "Pierre"
      ]
    ],
    "exclusif": "Un chantier d’ITE se chiffre après une visite et un métré, ce qui prend du temps. Si la même demande part chez quatre façadiers, le propriétaire reçoit quatre visites, compare au prix le plus bas et vous fait travailler pour rien : un lead exclusif vous rend ce temps.",
    "marcheTitre": [
      "Une ITE qui se vend",
      "sans la prime."
    ],
    "marcheIntro": "L’ITE est le geste le plus touché par la réforme des aides de 2026. Le marché demeure, mais le discours change. Les repères ci-dessous portent leur source.",
    "marche": [
      {
        "v": "01/01/2026",
        "l": "date à laquelle l’isolation des murs, dont l’ITE, est sortie du parcours MaPrimeRénov’ par geste.",
        "src": "jechange.fr, 27/08/2026 (lu le 09/11/2026)",
        "url": "https://www.jechange.fr/energie/electricite/news/maprimerenov-isolation-fenetres-poele-granules-fin-monogeste-septembre-2026"
      },
      {
        "v": "2022",
        "l": "année de fin du Coup de pouce Isolation : restent les primes CEE classiques, dont le montant est fixé par chaque fournisseur d’énergie.",
        "src": "Ministère de la Transition écologique (lu le 09/11/2026)",
        "url": "https://www.ecologie.gouv.fr/coup-pouce-chauffage-et-isolation"
      },
      {
        "v": "63 000",
        "l": "entreprises RGE environ en France, toutes spécialités, pour 560 000 entreprises du bâtiment.",
        "src": "DREAL Nouvelle-Aquitaine, support FFB 2025 (lu le 09/11/2026)",
        "url": "https://www.nouvelle-aquitaine.developpement-durable.gouv.fr/IMG/pdf/2025_moment_pro_rge_ffb.pdf"
      }
    ],
    "legal": [
      RENOV_LEGAL_DEMARCHAGE,
      RENOV_LEGAL_ECRIT,
      LEGAL_RGPD,
      [
        "L’ITE, geste le plus surveillé",
        [
          [
            "L’Anah considère l’ITE comme le geste le plus exposé à la fraude aux aides. Depuis la "
          ],
          [
            "loi n° 2025-594 du 30/06/2025",
            "https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000051824277"
          ],
          [
            ", elle peut exclure des aides pendant 5 ans les bénéficiaires et mandataires fautifs. Une demande faite par le propriétaire lui-même, sans intermédiaire, et un devis signé par une entreprise RGE Qualibat restent la meilleure garantie."
          ]
        ]
      ],
      LEGAL_RESPONSABLE
    ],
    "prixTexte": "27 € HT le contact, payé sur bon de commande, par virement. Kairn paie la publicité : vous n’avancez aucun budget, vous payez les contacts livrés. Le prix est le même quel que soit le département.",
    "faq": [
      [
        "Combien coûte un lead ITE ?",
        "27 € HT le contact chez Kairn, payé sur bon de commande par virement. La publicité est payée par Kairn : vous ne payez que les contacts livrés, sans abonnement. Première commande à partir de 50 contacts."
      ],
      [
        "L’isolation thermique par l’extérieur est-elle encore aidée en 2026 ?",
        "Plus par MaPrimeRénov’ en geste seul depuis le 01/01/2026. Restent les primes CEE (fiche BAR-EN-102, montant fixé par le fournisseur d’énergie), l’éco-PTZ, la TVA réduite et la Rénovation d’ampleur accompagnée. Les conditions officielles sont sur service-public.gouv.fr (fiche F35083)."
      ],
      [
        "Puis-je ne recevoir que des maisons individuelles ?",
        "Oui. Chaque contact indique s’il est propriétaire et si sa maison est individuelle ou mitoyenne. Les critères d’envoi se règlent avec vous avant le lancement : un contact qui n’y répond pas ne vous est pas envoyé."
      ],
      [
        "Un lead ITE est-il vendu à plusieurs entreprises ?",
        "Non. Chaque contact est envoyé à une seule entreprise et n’est jamais revendu. La campagne qui le produit est dédiée à l’isolation par l’extérieur et à votre zone."
      ],
      [
        "Comment éviter les dossiers liés à la fraude aux aides ?",
        "Le contact Kairn est une demande faite par le propriétaire lui-même, sur un formulaire, sans mandataire ni promesse d’isolation à 1 €. Vous gardez la main sur le devis et le montage d’aides, ce qui vous laisse vérifier chaque dossier vous-même."
      ],
      [
        "Dans quel délai faut-il rappeler un lead ITE ?",
        "Dans les 5 jours ouvrables qui suivent la demande, comme l’impose le Code de la consommation pour la rénovation énergétique (art. R223-4), et de préférence le jour même. Chaque contact arrive avec la date et l’heure de sa demande."
      ],
      [
        "Que se passe-t-il si le contact est un doublon ou hors zone ?",
        "Vous le signalez depuis votre espace client. Après vérification, il est remplacé par un nouveau contact."
      ],
      [
        "Garantissez-vous des chantiers signés ?",
        "Non. Kairn s’engage sur le contact : une demande réelle, récente, dans votre zone, envoyée à vous seul. La signature se joue à la visite, au métré et au devis."
      ]
    ],
    "proches": [
      "leads-isolation-combles",
      "leads-pompe-a-chaleur",
      "leads-fenetres-menuiserie",
      "leads-toiture"
    ]
  },
  // ───────────────────────────── Isolation des combles ─────────────────────────────
  'leads-isolation-combles': {
    "h1": [
      "Leads isolation des combles",
      "perdus ou aménagés."
    ],
    "chapo": "Un lead isolation des combles chez Kairn est vendu sur devis, à une seule entreprise d’isolation, sans engagement, à partir de 50 contacts. C’est un propriétaire qui a demandé lui-même à être rappelé pour isoler ses combles perdus ou ses rampants, après une publicité Meta diffusée dans votre zone, et qui a précisé l’accès et la surface.",
    "motTitre": "isolation des combles",
    "motCommande": "combles",
    "pourLe": "aux projets d’isolation des combles",
    "definition": "Un contact de particulier qui a rempli lui-même une demande de rappel pour isoler ses combles : coordonnées, statut d’occupation, type de combles (perdus ou aménagés), surface à isoler et accès.",
    "bref": [
      "Perdus ou aménagés",
      "Le soufflage en combles perdus et l’isolation des rampants ne se chiffrent ni ne se posent de la même façon : la fiche dit lequel des deux est en jeu, et vous ne recevez que celui que vous faites."
    ],
    "qualif": "Avant d’appeler, vous savez si les combles sont perdus ou aménagés, quelle surface il faut isoler et comment on y accède. Pour un souffleur, c’est presque un devis : il reste à vérifier l’isolant en place et l’état de la toiture.",
    "champs": [
      [
        "Statut",
        "Propriétaire ou locataire"
      ],
      [
        "Combles",
        "Perdus ou aménagés"
      ],
      [
        "Surface",
        "Tranche de surface à isoler"
      ],
      [
        "Accès",
        "Trappe, escalier, aucun"
      ]
    ],
    "pourQuiTitre": [
      "Pour les isolateurs",
      "qui travaillent sous le toit."
    ],
    "pourQui": [
      [
        "Souffleurs d’isolant",
        "Un chantier de combles perdus se fait en une demi-journée : votre camion de soufflage doit tourner tous les jours, avec des chantiers groupés dans un même secteur.",
        "wrench",
        [
          "Soufflage",
          "Combles perdus",
          "Chantiers courts"
        ]
      ],
      [
        "Plaquistes-isolateurs",
        "Vous isolez les rampants et aménagez les combles : vous cherchez des propriétaires qui veulent gagner une pièce ou ne plus avoir chaud l’été sous le toit.",
        "home",
        [
          "Rampants",
          "Aménagement",
          "Plâtrerie"
        ]
      ],
      [
        "Entreprises d’isolation RGE",
        "Vous montez les dossiers CEE pour vos clients : il vous faut des propriétaires de maison, dans les zones où la prime est la plus forte.",
        "badge",
        [
          "RGE",
          "Primes CEE",
          "Multi-postes"
        ]
      ]
    ],
    "exemple": {
      "init": "CR",
      "nom": "Céline R.",
      "ville": "Besançon · 25000",
      "projet": "Isolation des combles",
      "mail": "c•••••@laposte.net",
      "reponses": [
        [
          "Statut",
          "Propriétaire"
        ],
        [
          "Combles",
          "Perdus"
        ],
        [
          "Surface",
          "70 à 100 m²"
        ],
        [
          "Accès",
          "Trappe"
        ]
      ]
    },
    "form": [
      "Vos combles sont-ils aménagés ?",
      [
        "Non, perdus",
        "Oui, habités",
        "Je ne sais pas"
      ]
    ],
    "exclusif": "Après des années d’isolation à 1 € et d’appels à répétition, beaucoup de propriétaires raccrochent au deuxième commercial. Un lead exclusif vous place seul au bout du fil, avec une personne qui attend votre appel et non celui d’un cinquième vendeur.",
    "marcheTitre": [
      "Des combles aidés",
      "autrement depuis septembre."
    ],
    "marcheIntro": "Depuis le 01/09/2026, les combles ne passent plus par MaPrimeRénov’ en geste seul. Les primes CEE, elles, dépendent de la zone climatique. Les repères ci-dessous portent leur source.",
    "marche": [
      {
        "v": "01/09/2026",
        "l": "date à partir de laquelle l’isolation des combles et des toitures est sortie de MaPrimeRénov’ par geste (décret n° 2026-822).",
        "src": "jechange.fr, 27/08/2026 (lu le 09/11/2026)",
        "url": "https://www.jechange.fr/energie/electricite/news/maprimerenov-isolation-fenetres-poele-granules-fin-monogeste-septembre-2026"
      },
      {
        "v": "1 700",
        "l": "kWh cumac par m² de combles perdus isolés en zone H1 (fiche CEE BAR-EN-101), contre 1 400 en H2 et 920 en H3.",
        "src": "ADEME, calculateur CEE (lu le 09/11/2026)",
        "url": "https://calculateur-cee.ademe.fr/pdf/display/286/BAR-EN-101"
      },
      {
        "v": "2022",
        "l": "année de fin du Coup de pouce Isolation : la prime CEE dépend désormais du prix fixé par chaque fournisseur d’énergie.",
        "src": "Ministère de la Transition écologique (lu le 09/11/2026)",
        "url": "https://www.ecologie.gouv.fr/coup-pouce-chauffage-et-isolation"
      }
    ],
    "legal": [
      RENOV_LEGAL_DEMARCHAGE,
      RENOV_LEGAL_ECRIT,
      LEGAL_RGPD,
      [
        "Des particuliers échaudés par l’isolation à 1 €",
        [
          [
            "L’isolation des combles a été le terrain historique du démarchage abusif, et le public s’en souvient. Pour les primes CEE, la pose doit être faite par une entreprise RGE ; le "
          ],
          [
            "ministère de la Transition écologique",
            "https://www.ecologie.gouv.fr/coup-pouce-chauffage-et-isolation"
          ],
          [
            " rappelle les conditions. Dites dès le premier appel qui vous êtes et d’où vient la demande."
          ]
        ]
      ],
      LEGAL_RESPONSABLE
    ],
    "prixTexte": "Prix sur devis, selon votre zone, le volume et vos critères (combles perdus, aménagés ou les deux), annoncé avant toute commande. Paiement sur bon de commande, par virement. Kairn paie la publicité : vous payez les contacts livrés.",
    "faq": [
      [
        "Combien coûte un lead isolation des combles ?",
        "Le prix est sur devis : il dépend de votre zone, du volume commandé et de vos critères, et il vous est donné avant toute commande. Kairn paie la publicité, vous ne payez que les contacts livrés, sans abonnement. Première commande à partir de 50 contacts."
      ],
      [
        "Puis-je recevoir seulement des combles perdus, ou seulement des rampants ?",
        "Oui. Le formulaire demande si les combles sont perdus ou aménagés, et ce critère se règle avec vous avant le lancement. Un contact qui ne correspond pas à ce que vous posez ne vous est pas envoyé."
      ],
      [
        "Quelles aides restent pour isoler des combles depuis septembre 2026 ?",
        "Depuis le 01/09/2026, l’isolation des combles ne passe plus par MaPrimeRénov’ en geste seul. Restent les primes CEE (fiche BAR-EN-101 pour les combles perdus), l’éco-PTZ et la Rénovation d’ampleur accompagnée. Ce sont souvent les premières questions du particulier au téléphone."
      ],
      [
        "La fiche indique-t-elle l’accès aux combles ?",
        "Oui. Le contact précise s’il accède à ses combles par une trappe, un escalier, ou s’il n’y a pas d’accès, ainsi que la surface à isoler. Vous savez avant d’appeler si un soufflage est possible."
      ],
      [
        "Peut-on cibler les zones où la prime CEE est la plus forte ?",
        "Oui. Vous pouvez commander par départements ou par zones climatiques (H1, H2, H3). Pour les combles perdus, le volume de CEE va de 920 kWh cumac par m² en H3 à 1 700 en H1, ce qui change le reste à charge du client."
      ],
      [
        "Un lead combles est-il vendu à plusieurs entreprises ?",
        "Non. Chaque contact est envoyé à une seule entreprise et n’est jamais revendu. La campagne qui le produit est dédiée à l’isolation des combles et à votre zone."
      ],
      [
        "Que se passe-t-il si le contact est un doublon ou hors zone ?",
        "Vous le signalez depuis votre espace client. Après vérification, il est remplacé par un nouveau contact."
      ],
      [
        "Garantissez-vous des chantiers signés ?",
        "Non. Kairn s’engage sur le contact : une demande réelle, récente, dans votre zone, envoyée à vous seul. La signature dépend de votre visite et de votre devis."
      ]
    ],
    "proches": [
      "leads-isolation-thermique-exterieur",
      "leads-toiture",
      "leads-pompe-a-chaleur",
      "leads-fenetres-menuiserie"
    ]
  },
  // ───────────────────────────── Toiture ─────────────────────────────
  'leads-toiture': {
    "h1": [
      "Leads toiture",
      "pour les couvreurs."
    ],
    "chapo": "Un lead toiture chez Kairn est vendu sur devis, à un seul couvreur, sans engagement, à partir de 50 contacts. C’est un propriétaire qui a demandé lui-même à être rappelé pour sa couverture, sa charpente ou sa zinguerie, après une publicité Meta diffusée dans votre zone, en précisant la nature des travaux et leur urgence.",
    "motTitre": "toiture",
    "motCommande": "toiture",
    "pourLe": "aux travaux de toiture",
    "definition": "Un contact de particulier qui a rempli lui-même une demande de rappel pour des travaux de toiture : coordonnées, statut d’occupation, nature des travaux (réfection, fuite, zinguerie, charpente), type de couverture et urgence.",
    "bref": [
      "Fuite ou projet",
      "La fiche distingue la fuite à traiter cette semaine de la réfection prévue dans six mois : vous savez lequel rappeler en premier et lequel planifier."
    ],
    "qualif": "Avant d’appeler, vous savez s’il s’agit d’une réfection complète, d’une fuite, de zinguerie ou de charpente, sur quelle couverture, et si c’est urgent. Vous pouvez prévoir le bon matériel pour la visite, et la fiche indique si une isolation est envisagée.",
    "champs": [
      [
        "Statut",
        "Propriétaire ou locataire"
      ],
      [
        "Travaux",
        "Réfection, fuite, zinguerie, charpente"
      ],
      [
        "Couverture",
        "Tuiles, ardoise, zinc, bac acier"
      ],
      [
        "Urgence",
        "Fuite active ou projet"
      ]
    ],
    "pourQuiTitre": [
      "Pour les couvreurs",
      "et charpentiers."
    ],
    "pourQui": [
      [
        "Couvreurs-zingueurs",
        "Vous refaites des toits et des gouttières : vous voulez des chantiers de particuliers dans votre secteur, entre deux chantiers de promoteurs ou pendant les creux de saison.",
        "wrench",
        [
          "Couverture",
          "Zinguerie",
          "Artisan"
        ]
      ],
      [
        "Charpentiers-couvreurs",
        "Vous intervenez sur la structure autant que sur la couverture : les réfections lourdes, qui demandent un diagnostic de charpente, sont votre cœur de métier.",
        "home",
        [
          "Charpente",
          "Réfection lourde",
          "Ossature"
        ]
      ],
      [
        "Couvreurs qui isolent",
        "Vous êtes RGE et proposez l’isolation des rampants ou le sarking en même temps que la couverture : un toit refait est le meilleur moment pour l’isoler.",
        "badge",
        [
          "RGE",
          "Sarking",
          "Rampants"
        ]
      ]
    ],
    "exemple": {
      "init": "PG",
      "nom": "Patrick G.",
      "ville": "Vannes · 56000",
      "projet": "Toiture",
      "mail": "p•••••@orange.fr",
      "reponses": [
        [
          "Statut",
          "Propriétaire"
        ],
        [
          "Travaux",
          "Réfection complète"
        ],
        [
          "Couverture",
          "Ardoise"
        ],
        [
          "Urgence",
          "Projet sous 3 mois"
        ]
      ]
    },
    "form": [
      "Quels travaux voulez-vous faire sur votre toit ?",
      [
        "Réfection",
        "Fuite",
        "Gouttières"
      ]
    ],
    "exclusif": "Un toit ne se chiffre pas depuis le trottoir : il faut monter, regarder, mesurer. Quand la même demande est envoyée à cinq couvreurs, quatre se déplacent pour rien. Avec un lead exclusif, votre visite a un sens, et le propriétaire n’a qu’un seul couvreur à recevoir.",
    "marcheTitre": [
      "Une toiture",
      "entre deux régimes."
    ],
    "marcheIntro": "La couverture n’est pas, en soi, de la rénovation énergétique ; l’isolation de la toiture l’est. Deux dates de 2026 changent la façon de vendre l’une et l’autre. Les repères ci-dessous portent leur source.",
    "marche": [
      {
        "v": "11/08/2026",
        "l": "fin de Bloctel : tout appel commercial à un particulier exige désormais son consentement préalable, y compris pour une réfection de couverture.",
        "src": "CNIL (lu le 09/11/2026)",
        "url": "https://cnil.fr/fr/node/169071"
      },
      {
        "v": "01/09/2026",
        "l": "date à partir de laquelle l’isolation des toitures est sortie de MaPrimeRénov’ par geste ; restent les primes CEE, l’éco-PTZ et la Rénovation d’ampleur.",
        "src": "jechange.fr, 27/08/2026 (lu le 09/11/2026)",
        "url": "https://www.jechange.fr/energie/electricite/news/maprimerenov-isolation-fenetres-poele-granules-fin-monogeste-septembre-2026"
      },
      {
        "v": "560 000",
        "l": "entreprises du bâtiment en France, dont environ 63 000 sont RGE : le couvreur qui isole reste l’exception.",
        "src": "DREAL Nouvelle-Aquitaine, support FFB 2025 (lu le 09/11/2026)",
        "url": "https://www.nouvelle-aquitaine.developpement-durable.gouv.fr/IMG/pdf/2025_moment_pro_rge_ffb.pdf"
      }
    ],
    "legal": [
      [
        "Votre nom dans le formulaire",
        [
          [
            "Depuis le 11/08/2026, appeler un particulier exige son consentement préalable, et la demande de consentement doit nommer le professionnel qui appellera (Code de la consommation, "
          ],
          [
            "art. L223-1",
            "https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006069565/LEGISCTA000032221441"
          ],
          [
            " et "
          ],
          [
            "art. R223-1",
            "https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000054483939"
          ],
          [
            "). Le formulaire de votre campagne porte donc le nom de votre entreprise. Ce consentement vaut un an au plus."
          ]
        ]
      ],
      [
        "Toit isolé : la règle de la rénovation énergétique",
        [
          [
            "Si la demande porte aussi sur l’isolation de la toiture, il s’agit de travaux d’économies d’énergie : le démarchage y est interdit (loi n° 2020-901), et le rappel doit avoir lieu dans les 5 jours ouvrables qui suivent la demande, sur le seul objet demandé ("
          ],
          [
            "art. R223-4, décret n° 2026-662",
            "https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000054483939"
          ],
          [
            "). Chaque contact Kairn arrive avec la date et l’heure de sa demande."
          ]
        ]
      ],
      LEGAL_RGPD,
      LEGAL_RESPONSABLE
    ],
    "prixTexte": "Prix sur devis, selon votre zone, le volume et la nature des travaux que vous voulez recevoir, annoncé avant toute commande. Paiement sur bon de commande, par virement. Kairn paie la publicité : vous payez les contacts livrés.",
    "faq": [
      [
        "Combien coûte un lead toiture ?",
        "Le prix est sur devis : il dépend de votre zone, du volume commandé et des travaux que vous voulez recevoir, et il vous est donné avant toute commande. Kairn paie la publicité, vous ne payez que les contacts livrés, sans abonnement. Première commande à partir de 50 contacts."
      ],
      [
        "Puis-je séparer réfection, fuite, zinguerie et démoussage ?",
        "Oui. Le formulaire demande la nature des travaux, et vous choisissez avant le lancement ceux que vous voulez recevoir. Un couvreur qui ne fait pas de démoussage, par exemple, ne reçoit pas ces demandes."
      ],
      [
        "Comment repérer les urgences ?",
        "Chaque contact indique s’il a une fuite active ou un projet à plus long terme, et arrive avec la date et l’heure de sa demande. Vous rappelez les fuites en premier et planifiez les réfections."
      ],
      [
        "A-t-on le droit de rappeler un lead toiture ?",
        "Oui : la personne a donné son consentement sur un formulaire qui nomme votre entreprise, comme l’exige le Code de la consommation depuis le 11/08/2026. Si la demande inclut l’isolation, la règle de la rénovation énergétique s’ajoute : rappel dans les 5 jours ouvrables, sur le seul objet demandé."
      ],
      [
        "Le particulier peut-il avoir une aide pour son toit ?",
        "Une réfection de couverture seule n’ouvre droit ni à MaPrimeRénov’ ni aux primes CEE. L’isolation de la toiture est aidée par les CEE, l’éco-PTZ et la Rénovation d’ampleur, mais plus par MaPrimeRénov’ en geste seul depuis le 01/09/2026."
      ],
      [
        "Faut-il être RGE pour acheter des leads toiture ?",
        "Non pour la couverture, la charpente et la zinguerie. La qualification RGE ne compte que si vous proposez l’isolation de la toiture et que le client veut des aides : dites-le nous, la campagne s’adapte."
      ],
      [
        "Un lead toiture est-il vendu à plusieurs couvreurs ?",
        "Non. Chaque contact est envoyé à un seul couvreur et n’est jamais revendu. Un doublon ou un contact hors de votre zone est remplacé après vérification."
      ],
      [
        "Garantissez-vous des chantiers signés ?",
        "Non. Kairn s’engage sur le contact : une demande réelle, récente, dans votre zone, envoyée à vous seul. La signature dépend de votre visite sur le toit et de votre devis."
      ]
    ],
    "proches": [
      "leads-isolation-combles",
      "leads-panneaux-solaires",
      "leads-isolation-thermique-exterieur",
      "leads-fenetres-menuiserie"
    ]
  },
  // ───────────────────────────── Fenêtres et menuiserie ─────────────────────────────
  'leads-fenetres-menuiserie': {
    "h1": [
      "Leads fenêtres et menuiserie",
      "pour les poseurs."
    ],
    "chapo": "Un lead fenêtres et menuiserie chez Kairn est vendu sur devis, à un seul menuisier poseur, sans engagement, à partir de 50 contacts. C’est un propriétaire qui a demandé lui-même à être rappelé pour remplacer ses fenêtres, ses portes ou ses volets, après une publicité Meta diffusée dans votre zone, en indiquant combien d’ouvertures sont concernées.",
    "motTitre": "fenêtres et menuiserie",
    "motCommande": "menuiserie",
    "pourLe": "aux projets de fenêtres et menuiserie",
    "definition": "Un contact de particulier qui a rempli lui-même une demande de rappel pour remplacer des menuiseries extérieures : coordonnées, statut d’occupation, logement, nombre de fenêtres et matériau souhaité.",
    "bref": [
      "Copropriété",
      "En appartement, changer l’aspect des fenêtres demande souvent l’accord de la copropriété : la fiche dit si le contact vit en maison ou en appartement, pour que vous posiez la question dès le premier appel."
    ],
    "qualif": "Avant d’appeler, vous savez combien d’ouvertures sont à remplacer, en quel matériau, et ce qu’il y a aujourd’hui (simple vitrage ou double vitrage ancien). Une demande pour une seule fenêtre et un projet de toute la maison ne se traitent pas de la même façon.",
    "champs": [
      [
        "Statut",
        "Propriétaire ou locataire"
      ],
      [
        "Nombre de fenêtres",
        "1 à 3, 4 à 7, 8 et plus"
      ],
      [
        "Matériau",
        "PVC, aluminium, bois"
      ],
      [
        "Vitrage actuel",
        "Simple ou double ancien"
      ]
    ],
    "pourQuiTitre": [
      "Pour les menuisiers",
      "qui posent chez les particuliers."
    ],
    "pourQui": [
      [
        "Menuisiers poseurs",
        "Vous fabriquez ou achetez vos menuiseries et les posez vous-même : il vous faut des projets de remplacement dans votre secteur pour tenir le carnet de commandes.",
        "wrench",
        [
          "Pose en direct",
          "Rénovation",
          "Artisan"
        ]
      ],
      [
        "Franchisés et concessionnaires",
        "Vous représentez une marque de fenêtres dans votre ville : vos conseillers ont besoin de rendez-vous de chiffrage chez des propriétaires qui attendent l’appel.",
        "building",
        [
          "Showroom",
          "Marque",
          "Conseillers"
        ]
      ],
      [
        "Entreprises RGE menuiseries",
        "Vous intégrez les fenêtres aux rénovations d’ampleur ou montez les dossiers CEE : le remplacement de simple vitrage est votre meilleur point d’entrée.",
        "badge",
        [
          "Qualibat",
          "Primes CEE",
          "Rénovation globale"
        ]
      ]
    ],
    "exemple": {
      "init": "NB",
      "nom": "Nathalie B.",
      "ville": "Angers · 49000",
      "projet": "Fenêtres",
      "mail": "n•••••@hotmail.fr",
      "reponses": [
        [
          "Statut",
          "Propriétaire"
        ],
        [
          "Fenêtres",
          "4 à 7"
        ],
        [
          "Matériau",
          "PVC"
        ],
        [
          "Vitrage",
          "Simple vitrage"
        ]
      ]
    },
    "form": [
      "Combien de fenêtres voulez-vous remplacer ?",
      [
        "1 à 3",
        "4 à 7",
        "8 et plus"
      ]
    ],
    "exclusif": "Pour des fenêtres, le particulier demande souvent plusieurs devis et compare les prix au mètre près. Si sa demande a été vendue à plusieurs poseurs, vous entrez dans une enchère ; si vous êtes seul, vous vendez votre pose et votre conseil.",
    "marcheTitre": [
      "Un marché de la fenêtre",
      "qui se joue en rénovation."
    ],
    "marcheIntro": "La fenêtre neuve recule avec la construction ; le remplacement chez les particuliers fait l’essentiel du marché. Les chiffres ci-dessous portent leur source.",
    "marche": [
      {
        "v": "10,3 millions",
        "l": "de fenêtres vendues en France en 2023, en baisse de 4,0 % sur un an.",
        "src": "Codifab, étude du marché de la fenêtre 2024 (lu le 09/11/2026)",
        "url": "https://codifab.fr/actions-collectives/etude-du-marche-de-la-fenetre-2024-activite-2023"
      },
      {
        "v": "-16,4 %",
        "l": "de volume en rénovation de maison individuelle entre 2021 et 2024, contre -47,5 % dans la maison neuve.",
        "src": "Codifab, étude du marché de la fenêtre 2024 (lu le 09/11/2026)",
        "url": "https://codifab.fr/actions-collectives/etude-du-marche-de-la-fenetre-2024-activite-2023"
      },
      {
        "v": "01/09/2026",
        "l": "date à partir de laquelle le remplacement des fenêtres est sorti de MaPrimeRénov’ par geste (40 à 100 € par fenêtre auparavant).",
        "src": "jechange.fr, 27/08/2026 (lu le 09/11/2026)",
        "url": "https://www.jechange.fr/energie/electricite/news/maprimerenov-isolation-fenetres-poele-granules-fin-monogeste-septembre-2026"
      }
    ],
    "legal": [
      RENOV_LEGAL_DEMARCHAGE,
      RENOV_LEGAL_ECRIT,
      [
        "Portes, volets, portails : votre nom dans le formulaire",
        [
          [
            "Remplacer des fenêtres pour mieux isoler relève des économies d’énergie, d’où les deux règles ci-dessus. Pour une porte, des volets ou un portail, c’est le régime général : depuis le 11/08/2026, l’appel exige le consentement préalable du particulier, et la demande doit nommer le professionnel qui appellera (Code de la consommation, "
          ],
          [
            "art. L223-1",
            "https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006069565/LEGISCTA000032221441"
          ],
          [
            " et "
          ],
          [
            "art. R223-1",
            "https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000054483939"
          ],
          [
            "). Le formulaire porte donc le nom de votre entreprise ; ce consentement vaut un an au plus."
          ]
        ]
      ],
      LEGAL_RGPD,
      LEGAL_RESPONSABLE
    ],
    "prixTexte": "Prix sur devis, selon votre zone, le volume et vos critères (nombre de fenêtres, matériau, portes et volets), annoncé avant toute commande. Paiement sur bon de commande, par virement. Kairn paie la publicité : vous payez les contacts livrés.",
    "faq": [
      [
        "Combien coûte un lead fenêtres ?",
        "Le prix est sur devis : il dépend de votre zone, du volume commandé et de vos critères, et il vous est donné avant toute commande. Kairn paie la publicité, vous ne payez que les contacts livrés, sans abonnement. Première commande à partir de 50 contacts."
      ],
      [
        "Puis-je fixer un nombre minimum de fenêtres par contact ?",
        "Oui. Le formulaire demande combien d’ouvertures sont à remplacer, et vous pouvez écarter avant le lancement les demandes d’une seule fenêtre. Un contact qui ne répond pas à vos critères ne vous est pas envoyé."
      ],
      [
        "PVC, aluminium ou bois : peut-on filtrer le matériau ?",
        "Chaque contact indique le matériau qu’il souhaite. Si vous ne posez que de l’aluminium ou du bois, la campagne et les critères d’envoi sont réglés en conséquence."
      ],
      [
        "Quelles aides restent pour changer ses fenêtres en 2026 ?",
        "Depuis le 01/09/2026, le remplacement de fenêtres seul n’est plus financé par MaPrimeRénov’. Restent les primes CEE (fiche BAR-EN-104), l’éco-PTZ et la Rénovation d’ampleur accompagnée. Beaucoup de particuliers l’ignorent encore : mieux vaut l’aborder dès le premier appel."
      ],
      [
        "Recevez-vous aussi des demandes de volets, de portes ou de baies vitrées ?",
        "Oui, si vous les posez. La campagne est réglée sur ce que vous vendez, et la fiche dit de quel type d’ouverture il s’agit. Pour les portes et volets, le formulaire de consentement nomme votre entreprise, comme l’exige le Code de la consommation depuis le 11/08/2026."
      ],
      [
        "Un lead menuiserie est-il vendu à plusieurs poseurs ?",
        "Non. Chaque contact est envoyé à un seul professionnel et n’est jamais revendu. La campagne qui le produit est dédiée à vos menuiseries et à votre zone."
      ],
      [
        "Que se passe-t-il si le contact est un doublon ou hors zone ?",
        "Vous le signalez depuis votre espace client. Après vérification, il est remplacé par un nouveau contact."
      ],
      [
        "Garantissez-vous des ventes ?",
        "Non. Kairn s’engage sur le contact : une demande réelle, récente, dans votre zone, envoyée à vous seul. La vente se joue au rendez-vous de chiffrage et au devis."
      ]
    ],
    "proches": [
      "leads-isolation-thermique-exterieur",
      "leads-pompe-a-chaleur",
      "leads-isolation-combles",
      "leads-toiture"
    ]
  },
};
