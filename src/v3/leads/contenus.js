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
  // ───────────────────────────── Appareils auditifs ─────────────────────────────
  'leads-appareils-auditifs': {
    "h1": [
      "Leads appareils auditifs",
      "pour remplir votre agenda de bilans."
    ],
    "chapo": "Un lead audition exclusif est vendu sur devis chez Kairn à un seul audioprothésiste, sans engagement, à partir de 50 contacts : c’est une personne qui a demandé elle-même à faire un bilan auditif dans un centre proche de chez elle. La demande naît d’une publicité Meta dédiée à votre zone, et votre appel sert à fixer ce bilan, jamais à vendre un appareil à distance.",
    "motTitre": "appareils auditifs",
    "motCommande": "audition",
    "pourLe": "aux projets de bilan auditif",
    "definition": "Un contact de particulier qui a rempli lui-même une demande de bilan auditif dans un centre de sa zone : coordonnées, tranche d’âge, code postal et délai souhaité pour le rendez-vous. Aucune question sur sa santé.",
    "bref": [
      "Le bilan, pas la vente",
      "La vente d’aides auditives par démarchage, à domicile ou par correspondance est interdite (art. L4361-7 du Code de la santé publique) : chaque lead mène à un rendez-vous dans votre centre."
    ],
    "qualif": "Avant d’appeler, vous savez quel âge a la personne, où elle habite par rapport à votre centre et dans quel délai elle veut son bilan. Le reste, l’audition, l’ordonnance, l’ancien appareil, se découvre au bilan, là où la loi et le secret médical le permettent.",
    "champs": [
      [
        "Âge",
        "Tranche d’âge (60 à 69 ans, 70 ans et plus…)"
      ],
      [
        "Demande",
        "Bilan auditif en centre"
      ],
      [
        "Code postal",
        "Commune et code postal du domicile"
      ],
      [
        "Délai",
        "Ce mois-ci, dans les 3 mois, se renseigne"
      ]
    ],
    "pourQuiTitre": [
      "Pour les audioprothésistes",
      "qui veulent plus de bilans."
    ],
    "pourQui": [
      [
        "Audioprothésistes indépendants",
        "Votre centre vit de sa zone de chalandise, à quelques kilomètres autour de la vitrine. Des demandes de bilan qui ne viennent que de chez vous comblent les creux de l’agenda sans passer par une plateforme de rendez-vous partagée.",
        "user",
        [
          "Libéral",
          "Un ou deux centres",
          "Zone courte"
        ]
      ],
      [
        "Centres sous enseigne",
        "Vous dirigez un centre franchisé ou affilié et vous avez des objectifs de bilans à tenir. Une campagne propre à votre secteur complète la communication nationale de l’enseigne, qui ne vise pas vos rues.",
        "building",
        [
          "Franchise",
          "Objectifs de bilans",
          "Directeur de centre"
        ]
      ],
      [
        "Réseaux de plusieurs centres",
        "Vous ouvrez un nouveau centre ou un point de consultation qui démarre lentement. Les contacts arrivent par centre, chacun dans sa zone, et vous suivez leur avancée dans le même espace.",
        "chart",
        [
          "Multi-centres",
          "Ouverture",
          "Suivi par centre"
        ]
      ]
    ],
    "exemple": {
      "init": "MR",
      "nom": "Monique R.",
      "ville": "Angers · 49000",
      "projet": "Bilan auditif",
      "mail": "m•••••@laposte.net",
      "reponses": [
        [
          "Âge",
          "70 ans et plus"
        ],
        [
          "Demande",
          "Bilan en centre"
        ],
        [
          "Code postal",
          "49000"
        ],
        [
          "Délai",
          "Ce mois-ci"
        ]
      ]
    },
    "form": [
      "Quand souhaitez-vous faire votre bilan auditif ?",
      [
        "Ce mois-ci",
        "Dans les 3 mois",
        "Je me renseigne"
      ]
    ],
    "exclusif": "Une personne de 70 ans appelée par trois centres le même jour ne sait plus qui l’a vraiment invitée, et elle ne vient chez aucun. Avec un lead exclusif, c’est votre centre qu’elle attend au téléphone, et c’est chez vous qu’elle prend rendez-vous.",
    "marcheTitre": [
      "Un marché de l’aide auditive",
      "porté par les 65 ans et plus."
    ],
    "marcheIntro": "Le 100 % Santé a ouvert l’appareillage à un public plus large, mais la plupart des acheteurs choisissent encore le panier libre. Les chiffres ci-dessous portent leur source.",
    "marche": [
      {
        "v": "2 Md€",
        "l": "de prothèses auditives achetées en France en 2022, dont 42 % pris en charge par l’Assurance maladie obligatoire.",
        "src": "DREES, La complémentaire santé 2024, fiche 24 (lu le 09/11/2026)",
        "url": "https://drees.solidarites-sante.gouv.fr/sites/default/files/2025-04/CS24%20-%20Fiche%2024%20-%20La%20prise%20en%20charge%20des%20proth%C3%A8ses%20auditives%20%28MAJ%29_1.pdf"
      },
      {
        "v": "79 %",
        "l": "des personnes qui ont acheté un appareil auditif en 2021 avaient 65 ans ou plus.",
        "src": "DREES, La complémentaire santé 2024, fiche 24 (lu le 09/11/2026)",
        "url": "https://drees.solidarites-sante.gouv.fr/sites/default/files/2025-04/CS24%20-%20Fiche%2024%20-%20La%20prise%20en%20charge%20des%20proth%C3%A8ses%20auditives%20%28MAJ%29_1.pdf"
      },
      {
        "v": "61 %",
        "l": "des acheteurs d’une paire ont choisi le panier libre (classe II) en 2021, pour un prix moyen de 2 951 € la paire.",
        "src": "DREES, La complémentaire santé 2024, fiche 24 (lu le 09/11/2026)",
        "url": "https://drees.solidarites-sante.gouv.fr/sites/default/files/2025-04/CS24%20-%20Fiche%2024%20-%20La%20prise%20en%20charge%20des%20proth%C3%A8ses%20auditives%20%28MAJ%29_1.pdf"
      },
      {
        "v": "5 053",
        "l": "audioprothésistes en France en 2024, dont 71 % salariés et 29 % libéraux ou mixtes.",
        "src": "ARS Île-de-France, démographie des audioprothésistes, mai 2025 (lu le 09/11/2026)",
        "url": "https://www.iledefrance.paps.sante.fr/media/139500/download"
      }
    ],
    "legal": [
      [
        "Un bilan en centre, jamais une vente à distance",
        [
          [
            "La location, le colportage, les ventes itinérantes, de démonstration, par démarchage ou par correspondance d’appareils de prothèse auditive sont interdits (Code de la santé publique, "
          ],
          [
            "art. L4361-7",
            "https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006072665/LEGISCTA000006171563"
          ],
          [
            "). Votre appel sert donc à fixer un bilan dans votre centre : pas de vente au téléphone, pas d’essai ni de visite à domicile pour vendre."
          ]
        ]
      ],
      [
        "Aucune question de santé dans le formulaire",
        [
          [
            "« J’entends mal » ou « je porte déjà un appareil » sont des données de santé : leur collecte exige un consentement explicite et séparé ("
          ],
          [
            "RGPD, art. 9",
            "https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre2"
          ],
          [
            "). Le formulaire Kairn s’en tient à l’âge, au souhait de bilan et au code postal. L’audition se mesure au bilan, dans votre cabine."
          ]
        ]
      ],
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
            "art. R223-1, décret n° 2026-662",
            "https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000054483939"
          ],
          [
            "). Le formulaire de votre campagne affiche donc le nom de votre centre, et ce consentement vaut un an au plus."
          ]
        ]
      ],
      LEGAL_RGPD,
      LEGAL_RESPONSABLE
    ],
    "prixTexte": "Sur devis : le prix du contact dépend de la zone autour de votre centre, du volume et des critères d’âge retenus. Il vous est donné par écrit avant la commande, payée sur bon de commande par virement. Kairn paie la publicité, vous payez les contacts livrés.",
    "faq": [
      [
        "Combien coûte un lead appareils auditifs ?",
        "Le prix est sur devis : il dépend de la zone autour de votre centre, du volume commandé et des critères retenus, comme la tranche d’âge. Il vous est donné avant toute commande. Kairn paie la publicité, sans abonnement, et la première commande commence à 50 contacts."
      ],
      [
        "Un lead audition est-il envoyé à plusieurs centres ?",
        "Non. Chaque demande de bilan est envoyée à un seul audioprothésiste et n’est jamais revendue. Le formulaire nomme votre centre : la personne sait qui va l’appeler."
      ],
      [
        "Ai-je le droit d’appeler ces personnes ?",
        "Oui, pour fixer le bilan qu’elles ont demandé : elles ont donné leur accord à un appel de votre centre, nommé dans le formulaire (art. L223-1 du Code de la consommation). En revanche, vendre l’appareil au téléphone ou proposer de venir le vendre à domicile est interdit (art. L4361-7 du Code de la santé publique)."
      ],
      [
        "Quel âge ont les contacts ?",
        "Chaque contact indique sa tranche d’âge. Les tranches visées, par exemple 60 ans et plus, se règlent avec vous avant le lancement : un contact qui n’y entre pas ne vous est pas envoyé. Pour repère, 79 % des acheteurs d’un appareil en 2021 avaient 65 ans ou plus (DREES)."
      ],
      [
        "Le contact sait-il s’il veut le 100 % Santé ou la classe II ?",
        "Le formulaire ne le demande pas : le choix entre les deux paniers se fait au bilan, devis en main. En classe I (100 % Santé), le prix est plafonné à 950 € par oreille et le reste à charge est nul avec une complémentaire responsable (DREES). Les publicités Kairn ne présentent jamais l’appareil comme « gratuit » sans ces conditions."
      ],
      [
        "Le contact a-t-il déjà une ordonnance ?",
        "Kairn ne le demande pas, car c’est une donnée de santé. La délivrance d’un appareil exige une prescription médicale préalable (art. L4361-1 du Code de la santé publique) : c’est un point à vérifier au premier rendez-vous."
      ],
      [
        "Recevez-vous des leads avec un rendez-vous déjà posé ?",
        "Non. Kairn livre la demande de bilan avec ses coordonnées, chaque jour, dans votre espace client (export Excel ou CSV, alertes, CRM avec pipeline). C’est votre centre qui appelle et fixe le créneau dans son agenda."
      ],
      [
        "Que se passe-t-il si le contact est un doublon ou hors zone ?",
        "Vous le signalez depuis votre espace client. Après vérification, il est remplacé par un nouveau contact de votre zone."
      ]
    ],
    "proches": [
      "leads-mutuelle-sante",
      "leads-contrat-obseques",
      "leads-assurance"
    ]
  },
  // ───────────────────────────── Formation professionnelle ─────────────────────────────
  'leads-formation-professionnelle': {
    "h1": [
      "Leads formation professionnelle",
      "des entreprises qui veulent former."
    ],
    "chapo": "Un lead formation professionnelle exclusif est vendu sur devis chez Kairn à un seul organisme de formation, sans engagement, à partir de 50 contacts : c’est un dirigeant ou un responsable RH qui a demandé lui-même à être rappelé pour former ses salariés. Il précise le thème, le nombre de personnes et le financement prévu, fonds propres de l’entreprise ou OPCO.",
    "motTitre": "formation professionnelle",
    "motCommande": "formation",
    "pourLe": "aux projets de formation en entreprise",
    "definition": "Un contact professionnel, dirigeant ou responsable RH, qui a rempli lui-même une demande de rappel pour former ses salariés : coordonnées, entreprise et effectif, thème, nombre de personnes à former et financement prévu.",
    "bref": [
      "Financement annoncé",
      "Chaque contact dit qui paiera la formation : l’entreprise sur ses fonds propres ou l’OPCO, dans le cadre du plan de développement des compétences. Vous savez avant l’appel s’il y a un dossier de prise en charge à monter."
    ],
    "qualif": "Avant d’appeler, vous savez à qui vous parlez dans l’entreprise, quelle est sa taille, quel thème l’intéresse, combien de salariés sont à former et qui paiera. Une demande prise en charge par l’OPCO ne se traite pas comme une formation réglée sur fonds propres : vous préparez la bonne proposition dès le premier échange.",
    "champs": [
      [
        "Fonction",
        "Dirigeant ou responsable RH"
      ],
      [
        "Entreprise",
        "Tranche d’effectif"
      ],
      [
        "Besoin",
        "Thème et nombre de salariés à former"
      ],
      [
        "Financement",
        "Entreprise, OPCO ou à voir"
      ]
    ],
    "pourQuiTitre": [
      "Pour les organismes de formation",
      "qui vendent aux entreprises."
    ],
    "pourQui": [
      [
        "Organismes inter et intra-entreprises",
        "Vous vendez des sessions aux TPE et PME et vos commerciaux passent trop de temps à trouver le bon interlocuteur. Des dirigeants et des RH qui ont eux-mêmes posé la question arrivent avec un besoin et un nombre de stagiaires.",
        "briefcase",
        [
          "B2B",
          "Sessions inter",
          "Intra sur site"
        ]
      ],
      [
        "Centres certifiés Qualiopi",
        "Votre certification vous ouvre la prise en charge par l’OPCO. Les entreprises qui comptent sur ce financement vous reviennent, et vous montez le dossier avec elles.",
        "badge",
        [
          "Qualiopi",
          "OPCO",
          "Montage de dossier"
        ]
      ],
      [
        "Formateurs et petites structures",
        "Vous animez vous-même, et le temps passé à prospecter est du temps de formation perdu. Quelques demandes d’entreprises par semaine sur votre thème suffisent à ouvrir une session de plus.",
        "user",
        [
          "Indépendant",
          "Thème précis",
          "Petit volume"
        ]
      ]
    ],
    "exemple": {
      "init": "SL",
      "nom": "Sandrine L.",
      "ville": "Tours · 37000",
      "projet": "Formation management",
      "mail": "s•••••@transports-exemple.fr",
      "reponses": [
        [
          "Fonction",
          "Dirigeante"
        ],
        [
          "Entreprise",
          "10 à 49 salariés"
        ],
        [
          "Besoin",
          "Management, 3 salariés"
        ],
        [
          "Financement",
          "OPCO"
        ]
      ]
    },
    "form": [
      "Qui finance la formation ?",
      [
        "L’entreprise",
        "L’OPCO",
        "À voir avec vous"
      ]
    ],
    "exclusif": "Une entreprise qui a demandé un devis de formation et reçoit cinq propositions le même jour choisit la moins chère, ou repousse le projet à l’an prochain. Seul à la rappeler, vous défendez votre programme et votre tarif plutôt qu’une remise.",
    "marcheTitre": [
      "Un marché de la formation",
      "très concurrentiel."
    ],
    "marcheIntro": "Plus de 150 000 organismes sont déclarés, et moins d’un tiers sont certifiés Qualiopi. Pour être choisi, il faut être appelé par l’entreprise avant les autres. Les chiffres ci-dessous portent leur source.",
    "marche": [
      {
        "v": "154 589",
        "l": "organismes de formation déclarés en activité en France (liste publique mise à jour le 08/11/2026).",
        "src": "DGEFP, liste publique des organismes de formation, data.gouv.fr (lu le 09/11/2026)",
        "url": "https://www.data.gouv.fr/fr/datasets/582c8978c751df788ec0bb7e/"
      },
      {
        "v": "45 866",
        "l": "organismes certifiés Qualiopi, dont 44 597 pour les actions de formation.",
        "src": "DGEFP, liste publique des organismes de formation, data.gouv.fr (lu le 09/11/2026)",
        "url": "https://www.data.gouv.fr/fr/datasets/582c8978c751df788ec0bb7e/"
      },
      {
        "v": "56,6 Md€",
        "l": "de dépense nationale pour la formation professionnelle continue et l’apprentissage en 2024.",
        "src": "Banque des Territoires, d’après la DARES (lu le 09/11/2026)",
        "url": "https://www.banquedesterritoires.fr/en-2024-566-milliards-deuros-de-depenses-pour-la-formation-professionnelle-continue-et"
      },
      {
        "v": "16,4 Md€",
        "l": "dépensés directement par les entreprises pour la formation en 2024, soit 29 % du total.",
        "src": "Banque des Territoires, d’après la DARES (lu le 09/11/2026)",
        "url": "https://www.banquedesterritoires.fr/en-2024-566-milliards-deuros-de-depenses-pour-la-formation-professionnelle-continue-et"
      }
    ],
    "legal": [
      [
        "Des entreprises, pas de prospection sur les droits individuels",
        [
          [
            "Le Code du travail interdit, même avec l’accord de la personne, toute prospection par téléphone, SMS, courriel ou réseau social qui vise à collecter les droits à la formation d’un salarié ou à lui faire signer une formation payée par ces droits ("
          ],
          [
            "art. L6323-8-1",
            "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000047666673"
          ],
          [
            ", jusqu’à 375 000 € d’amende pour une société). Les campagnes Kairn ne visent donc que les entreprises qui forment leurs salariés, sur fonds propres ou avec l’OPCO."
          ]
        ]
      ],
      [
        "Prospection B2B : coordonnées professionnelles et opposition",
        [
          [
            "Entre professionnels, la CNIL admet la prospection sans consentement préalable si le message est lié à la fonction de la personne, qu’elle en est informée et qu’elle peut s’y opposer simplement ("
          ],
          [
            "CNIL, prospection commerciale par courrier électronique",
            "https://www.cnil.fr/fr/la-prospection-commerciale-par-courrier-electronique"
          ],
          [
            "). Chaque contact Kairn laisse ses coordonnées professionnelles pour être rappelé sur son besoin de formation : à chaque relance, laissez-lui le moyen de dire non, et retirez-le de vos envois s’il le demande."
          ]
        ]
      ],
      [
        "Qualiopi pour la prise en charge OPCO",
        [
          [
            "Un OPCO ne finance que des organismes certifiés Qualiopi ("
          ],
          [
            "art. L6316-1 du Code du travail",
            "https://code.travail.gouv.fr/code-du-travail/l6316-1"
          ],
          [
            "). Sans certification, vous pouvez traiter les formations payées par l’entreprise sur ses fonds propres, mais pas celles qui comptent sur l’OPCO : les critères d’envoi en tiennent compte."
          ]
        ]
      ],
      LEGAL_RGPD
    ],
    "prixTexte": "Sur devis : le prix du contact dépend de la zone, du volume, du thème et de la taille d’entreprise visée. Il vous est donné avant la commande, payée sur bon de commande par virement. Kairn paie la publicité.",
    "faq": [
      [
        "Combien coûte un lead formation professionnelle ?",
        "Le prix est sur devis : il dépend de la zone, du volume, du thème de formation et de la taille d’entreprise visée. Il vous est donné avant toute commande. Kairn paie la publicité, sans abonnement, et la première commande commence à 50 contacts."
      ],
      [
        "Les leads sont-ils revendus à d’autres organismes ?",
        "Non. Chaque demande est envoyée à un seul organisme de formation et n’est jamais revendue. L’entreprise n’attend qu’un appel, le vôtre."
      ],
      [
        "Qui sont les contacts ?",
        "Des dirigeants et des responsables RH qui veulent former leurs salariés. Chaque contact indique sa fonction, la tranche d’effectif de l’entreprise, le thème et le nombre de personnes à former."
      ],
      [
        "Comment savoir si la formation sera financée ?",
        "Chaque contact indique le financement prévu : l’entreprise sur ses fonds propres, l’OPCO dans le cadre du plan de développement des compétences, ou à voir avec vous. Vous pouvez ne recevoir que certains financements : cela se règle avec vous avant le lancement."
      ],
      [
        "Faut-il être certifié Qualiopi pour acheter ces leads ?",
        "Non, mais sans Qualiopi l’OPCO ne finance pas la formation (art. L6316-1 du Code du travail). Les demandes qui comptent sur l’OPCO sont alors écartées des critères d’envoi, et vous recevez celles financées par l’entreprise."
      ],
      [
        "Ai-je le droit d’appeler et de relancer ces contacts ?",
        "Oui, sur leurs coordonnées professionnelles et pour le besoin de formation qu’ils ont exprimé. La CNIL admet la prospection entre professionnels quand le message est lié à la fonction de la personne, à condition qu’elle puisse s’y opposer à tout moment."
      ],
      [
        "Comment les contacts sont-ils livrés ?",
        "Chaque jour, dans votre espace client : export Excel ou CSV, alerte à chaque nouveau contact et CRM avec pipeline pour suivre les demandes jusqu’à la convention de formation. Chaque contact porte la date et l’heure de sa demande."
      ],
      [
        "Que se passe-t-il si le contact est un doublon ou hors zone ?",
        "Vous le signalez depuis votre espace client. Après vérification, il est remplacé par un nouveau contact."
      ]
    ],
    "proches": [
      "leads-demenagement",
      "leads-appareils-auditifs",
      "leads-assurance"
    ]
  },
  // ───────────────────────────── Déménagement ─────────────────────────────
  'leads-demenagement': {
    "h1": [
      "Leads déménagement",
      "avec le volume et la date."
    ],
    "chapo": "Un lead déménagement exclusif est vendu sur devis chez Kairn à un seul déménageur, sans engagement, à partir de 50 contacts : c’est un particulier qui a demandé lui-même un devis pour son déménagement. Il indique le volume en m³, la date, les villes de départ et d’arrivée, l’étage et l’ascenseur, de quoi chiffrer avant même la visite technique.",
    "motTitre": "déménagement",
    "motCommande": "déménagement",
    "pourLe": "aux projets de déménagement",
    "definition": "Un contact de particulier qui a rempli lui-même une demande de devis de déménagement : coordonnées, volume estimé en m³, date souhaitée, villes de départ et d’arrivée, étage et ascenseur.",
    "bref": [
      "Haute saison en été",
      "Près d’un déménagement sur deux (48,7 %) a lieu de juin à septembre, d’après le baromètre Nextories 2025 : le volume de contacts se règle mois par mois, pour remplir aussi les camions hors saison."
    ],
    "qualif": "Avant d’appeler, vous savez combien de mètres cubes il faut charger, à quelle date, d’où à où et à quel étage. Vous écartez les petits volumes ou les dates déjà prises, vous prévoyez le monte-meubles et vous arrivez à la visite avec une première idée du prix.",
    "champs": [
      [
        "Volume",
        "Estimation en m³"
      ],
      [
        "Date",
        "Date ou semaine souhaitée"
      ],
      [
        "Trajet",
        "Villes de départ et d’arrivée"
      ],
      [
        "Accès",
        "Étage et ascenseur, au départ et à l’arrivée"
      ]
    ],
    "pourQuiTitre": [
      "Pour les déménageurs",
      "qui veulent remplir leurs camions."
    ],
    "pourQui": [
      [
        "Déménageurs locaux",
        "Vous faites surtout des déménagements dans votre agglomération et le département voisin. Des demandes de votre secteur, avec le volume et l’étage, vous évitent de vous déplacer pour un studio au rez-de-chaussée que vous auriez chiffré au téléphone.",
        "home",
        [
          "Agglomération",
          "1 à 10 salariés",
          "Visite technique"
        ]
      ],
      [
        "Entreprises multi-agences",
        "Vous avez plusieurs dépôts et des équipes à occuper toute l’année. Les contacts arrivent par zone, et vous lissez le planning entre la haute saison et les mois creux.",
        "building",
        [
          "Plusieurs dépôts",
          "Planning",
          "Équipes salariées"
        ]
      ],
      [
        "Spécialistes longue distance",
        "Vous organisez des trajets entre régions et vous cherchez des volumes qui justifient le camion. Les villes de départ et d’arrivée vous permettent de grouper les chargements sur un même trajet.",
        "chart",
        [
          "Longue distance",
          "Groupage",
          "Gros volumes"
        ]
      ]
    ],
    "exemple": {
      "init": "CD",
      "nom": "Camille D.",
      "ville": "Villeurbanne · 69100",
      "projet": "Déménagement",
      "mail": "c•••••@free.fr",
      "reponses": [
        [
          "Volume",
          "Environ 30 m³"
        ],
        [
          "Date",
          "Semaine du 13 juillet"
        ],
        [
          "Trajet",
          "Villeurbanne vers Nantes"
        ],
        [
          "Accès",
          "3e étage sans ascenseur"
        ]
      ]
    },
    "form": [
      "Quel volume pensez-vous déménager ?",
      [
        "Moins de 20 m³",
        "20 à 40 m³",
        "Plus de 40 m³"
      ]
    ],
    "exclusif": "Sur un comparateur, la même famille reçoit quatre ou cinq devis et choisit souvent le moins cher, parfois sans visite. Seul à la rappeler, vous prenez le temps de la visite technique et vous chiffrez au juste prix.",
    "marcheTitre": [
      "Près de 6 millions",
      "de personnes déménagent chaque année."
    ],
    "marcheIntro": "Les Français déménagent moins qu’il y a dix ans, et la plupart restent près de chez eux. Le secteur, lui, reste fait de petites entreprises qui se disputent l’été. Les chiffres ci-dessous portent leur source.",
    "marche": [
      {
        "v": "5,91 M",
        "l": "de personnes ont changé de résidence principale en 2023, contre 6,95 millions en 2013.",
        "src": "INSEE, Insee Première n° 2073 (lu le 09/11/2026)",
        "url": "https://www.insee.fr/fr/statistiques/8648157"
      },
      {
        "v": "18,8 km",
        "l": "de distance médiane pour un déménagement d’une commune à une autre ; le quart le plus long dépasse 105 km.",
        "src": "INSEE, Insee Première n° 2073 (lu le 09/11/2026)",
        "url": "https://www.insee.fr/fr/statistiques/8648157"
      },
      {
        "v": "1 219",
        "l": "établissements de déménagement en France en 2025, pour 10 241 salariés.",
        "src": "Chambre syndicale du déménagement, chiffres clés (lu le 09/11/2026)",
        "url": "https://www.csdemenagement.fr/espace-presse/chiffres-cles/en-france.html"
      },
      {
        "v": "48,7 %",
        "l": "des déménagements ont lieu de juin à septembre, dont environ 19 % en juillet.",
        "src": "Nextories, baromètre 2025, cité par Selectra (lu le 09/11/2026)",
        "url": "https://www.nextories.com/demenageur/barometre-2025"
      }
    ],
    "legal": [
      [
        "Votre nom dans le formulaire",
        [
          [
            "Depuis le 11/08/2026, un particulier ne peut être appelé que s’il y a consenti au préalable, et la demande de consentement doit nommer le déménageur qui appellera (Code de la consommation, "
          ],
          [
            "art. L223-1",
            "https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006069565/LEGISCTA000032221441"
          ],
          [
            " et "
          ],
          [
            "art. R223-1, décret n° 2026-662",
            "https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000054483939"
          ],
          [
            "). Ce consentement vaut un an au plus : le formulaire de votre campagne affiche le nom de votre entreprise."
          ]
        ]
      ],
      [
        "« Nos partenaires » ne suffit plus",
        [
          [
            "Une demande de devis transmise à plusieurs déménageurs sous un simple accord « pour nos partenaires », sans noms, ne couvre pas leurs appels. La CNIL exige que les partenaires soient identifiés au moment du recueil, et toute revente à un autre acheteur demande un nouveau consentement ("
          ],
          [
            "CNIL, 10/06/2026",
            "https://www.cnil.fr/fr/la-prospection-b-to-c-quelles-regles-pour-transmettre-des-donnees-des-partenaires"
          ],
          [
            "). Un lead Kairn n’est transmis qu’à vous."
          ]
        ]
      ],
      LEGAL_RGPD,
      LEGAL_RESPONSABLE
    ],
    "prixTexte": "Sur devis : le prix du contact dépend de votre zone, du volume commandé et des critères retenus, comme un volume minimum en m³. Il vous est donné avant la commande, payée sur bon de commande par virement. Kairn paie la publicité.",
    "faq": [
      [
        "Combien coûte un lead déménagement ?",
        "Le prix est sur devis : il dépend de votre zone, du volume commandé et des critères retenus, par exemple un minimum de m³ ou la longue distance seule. Il vous est donné avant toute commande. Kairn paie la publicité, sans abonnement, et la première commande commence à 50 contacts."
      ],
      [
        "Le lead est-il envoyé à plusieurs déménageurs ?",
        "Non. Chaque demande de devis est envoyée à un seul déménageur et n’est jamais revendue. C’est la différence avec un comparateur, où la même famille est rappelée par plusieurs entreprises."
      ],
      [
        "Puis-je fixer un volume minimum ?",
        "Oui. Chaque contact indique son volume estimé en m³, et un seuil, par exemple 20 m³ et plus, se règle avec vous avant le lancement. Une demande sous ce seuil ne vous est pas envoyée."
      ],
      [
        "Puis-je recevoir seulement les longues distances ?",
        "Oui. Chaque contact donne ses villes de départ et d’arrivée : la zone peut porter sur le départ, sur l’arrivée ou sur les deux, selon ce que vous savez faire. Les critères se règlent avec vous avant le lancement."
      ],
      [
        "Comment gérer le pic de l’été ?",
        "Vous choisissez le volume de contacts à chaque commande, sans abonnement : vous pouvez en prendre moins quand le planning est plein et davantage de septembre à mai pour remplir les mois creux. Près d’un déménagement sur deux a lieu de juin à septembre (baromètre Nextories 2025)."
      ],
      [
        "Combien de leads faut-il pour signer un déménagement ?",
        "Kairn ne promet aucun taux de signature : il dépend du délai de rappel, de la visite technique et de votre prix. Kairn s’engage sur le contact, une demande réelle, récente, dans votre zone, envoyée à vous seul."
      ],
      [
        "Comment les contacts sont-ils livrés ?",
        "Chaque jour, dans votre espace client : export Excel ou CSV, alerte à chaque nouveau contact et CRM avec pipeline pour suivre chaque devis jusqu’à la signature. La date et l’heure de la demande sont indiquées sur chaque fiche."
      ],
      [
        "Que se passe-t-il si le contact est un doublon ou hors zone ?",
        "Vous le signalez depuis votre espace client. Après vérification, il est remplacé par un nouveau contact de votre zone."
      ]
    ],
    "proches": [
      "leads-assurance",
      "leads-regroupement-de-credits",
      "leads-formation-professionnelle"
    ]
  },
  // ───────────────────────────── Regroupement de crédits ─────────────────────────────
  'leads-regroupement-de-credits': {
    "h1": [
      "Leads regroupement de crédits",
      "pour courtiers IOBSP."
    ],
    "chapo": "Un lead regroupement de crédits Kairn est un particulier qui a demandé lui-même à être rappelé pour regrouper ses crédits, transmis à un seul courtier IOBSP ou établissement, sur devis, sans engagement, à partir de 50 contacts. Il a rempli sa demande après une publicité Meta qui n’affiche ni taux ni mensualité, et qui vous nomme comme celui qui rappellera.",
    "motTitre": "regroupement de crédits",
    "motCommande": "rachat de crédit",
    "pourLe": "aux projets de regroupement de crédits",
    "definition": "Un contact de particulier qui a rempli lui-même une demande de rappel pour regrouper ses crédits en cours : coordonnées, montant approximatif des crédits, statut de logement, situation professionnelle et revenus du foyer, avec son accord pour être appelé par vous.",
    "bref": [
      "Ni taux ni mensualité",
      "La publicité et le formulaire n’affichent aucun taux, aucune mensualité, aucune simulation : la proposition chiffrée, c’est vous qui la faites, après étude du dossier."
    ],
    "qualif": "Avant d’appeler, vous savez à peu près combien la personne doit, si elle est propriétaire ou locataire, quelle est sa situation professionnelle et dans quelle tranche se situent les revenus du foyer. De quoi distinguer un dossier hypothécaire d’un regroupement de crédits à la consommation, et écarter les demandes trop petites pour être montées.",
    "champs": [
      [
        "Crédits en cours",
        "Tranche du montant total restant dû"
      ],
      [
        "Logement",
        "Propriétaire, avec ou sans prêt, ou locataire"
      ],
      [
        "Situation professionnelle",
        "CDI, fonctionnaire, retraité, indépendant…"
      ],
      [
        "Revenus du foyer",
        "Tranche de revenus nets mensuels"
      ]
    ],
    "pourQuiTitre": [
      "Pour les courtiers",
      "qui montent des dossiers de regroupement."
    ],
    "pourQui": [
      [
        "Courtiers IOBSP indépendants",
        "Vous montez vous-même les dossiers et cherchez des demandes récentes à étudier, plutôt que des fichiers déjà appelés par trois confrères.",
        "user",
        [
          "COBSP",
          "ORIAS",
          "Cabinet indépendant"
        ]
      ],
      [
        "Réseaux et cabinets franchisés",
        "Vos conseillers ont besoin d’un flux régulier de dossiers à instruire : vous fixez le volume et les critères, agence par agence.",
        "building",
        [
          "Plusieurs agences",
          "Conseillers",
          "Volume réglé"
        ]
      ],
      [
        "Établissements spécialisés",
        "Vous financez le regroupement en direct et voulez des demandes que vous êtes seul à traiter, dans les départements où vous intervenez.",
        "briefcase",
        [
          "Établissement",
          "Prêt hypothécaire",
          "Conso et immo"
        ]
      ]
    ],
    "exemple": {
      "init": "SL",
      "nom": "Sandrine L.",
      "ville": "Limoges · 87000",
      "projet": "Regroupement de crédits",
      "mail": "s•••••@gmail.com",
      "reponses": [
        [
          "Crédits en cours",
          "30 000 à 50 000 €"
        ],
        [
          "Logement",
          "Propriétaire avec prêt"
        ],
        [
          "Situation",
          "Salariée en CDI"
        ],
        [
          "Revenus du foyer",
          "2 500 à 3 500 €"
        ]
      ]
    },
    "form": [
      "Êtes-vous propriétaire de votre logement ?",
      [
        "Oui, sans prêt en cours",
        "Oui, avec un prêt en cours",
        "Non, je suis locataire"
      ]
    ],
    "exclusif": "Un emprunteur qui a laissé ses coordonnées et reçoit cinq appels de courtiers dans la journée finit par se méfier de tous, à juste titre. Un lead exclusif vous laisse le temps d’écouter sa situation et de demander les pièces du dossier dans de bonnes conditions.",
    "marcheTitre": [
      "Un marché du crédit",
      "qui change le 20 novembre."
    ],
    "marcheIntro": "Le crédit à la consommation reste un marché de volume, et sa réforme entre en vigueur le 20/11/2026. Chaque chiffre porte sa source.",
    "marche": [
      {
        "v": "49 Md€",
        "l": "de crédits à la consommation produits par les établissements spécialisés en 2025 (+1,9 % sur un an).",
        "src": "ASF, La Lettre ASF n° 208 (lu le 09/11/2026)",
        "url": "https://asf-france.com/wp-content/uploads/2026/04/LA-LETTRE-ASF_208.pdf"
      },
      {
        "v": "36 370",
        "l": "inscriptions à l’ORIAS en opérations de banque et services de paiement (IOBSP) au 31/12/2025.",
        "src": "ORIAS (lu le 09/11/2026)",
        "url": "https://www.orias.fr/"
      },
      {
        "v": "100 000 €",
        "l": "nouveau plafond du crédit à la consommation à partir du 20/11/2026, contre 75 000 € jusqu’ici.",
        "src": "Service-public.gouv.fr (lu le 09/11/2026)",
        "url": "https://www.service-public.gouv.fr/particuliers/actualites/A18451"
      }
    ],
    "legal": [
      [
        "Votre nom dans le formulaire",
        [
          [
            "Depuis le 11/08/2026, appeler un particulier exige son consentement préalable, et la demande de consentement doit nommer le professionnel qui appellera ("
          ],
          [
            "art. L223-1 et R223-1 du Code de la consommation",
            "https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006069565/LEGISCTA000032221441"
          ],
          [
            ", "
          ],
          [
            "texte publié au Journal officiel",
            "https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000054483939"
          ],
          [
            "). Le formulaire de votre campagne nomme donc votre cabinet, dans une case dédiée au rappel, jamais pré-cochée. Ce consentement vaut un an au plus."
          ]
        ]
      ],
      [
        "Kairn transmet une demande, rien de plus",
        [
          [
            "Kairn ne fait que transmettre la demande d’une personne intéressée : ni taux, ni mensualité, ni simulation, ni étude de dossier, ni collecte de justificatifs. Le conseil, l’offre et le montage du dossier relèvent de votre activité d’intermédiaire, encadrée par votre immatriculation IOBSP à l’"
          ],
          [
            "ORIAS",
            "https://www.orias.fr/"
          ],
          [
            "."
          ]
        ]
      ],
      [
        "La mention qui change le 20/11/2026",
        [
          [
            "À partir du 20/11/2026, une publicité pour un crédit doit porter la mention « Attention ! Un crédit coûte de l’argent et doit être remboursé ! » et ne peut plus mettre en avant la facilité d’obtenir un crédit ("
          ],
          [
            "service-public.gouv.fr",
            "https://www.service-public.gouv.fr/particuliers/actualites/A18451"
          ],
          [
            "). Les publicités qui produisent vos contacts en tiennent compte : aucune promesse d’accord, aucune baisse de mensualité chiffrée."
          ]
        ]
      ],
      LEGAL_RGPD,
      LEGAL_RESPONSABLE
    ],
    "prixTexte": "Sur devis : le prix du contact dépend de la zone, du volume et des critères retenus (montant des crédits, statut de logement, situation professionnelle). Il vous est donné avant toute commande, payée sur bon de commande par virement. Kairn paie la publicité, sans abonnement.",
    "faq": [
      [
        "Combien coûte un lead regroupement de crédits ?",
        "Le prix est sur devis : il dépend de votre zone, du volume commandé et de vos critères d’envoi, par exemple propriétaires seulement ou montant minimum de crédits. Il vous est communiqué avant toute commande. Kairn paie la publicité, sans abonnement, et la première commande part de 50 contacts."
      ],
      [
        "Un lead rachat de crédit est-il vendu à plusieurs courtiers ?",
        "Non. Chaque contact est envoyé à un seul acheteur et n’est jamais revendu. C’est aussi la logique de la loi depuis le 11/08/2026 : le consentement au rappel nomme le professionnel qui appellera, il ne peut pas servir à plusieurs."
      ],
      [
        "Faut-il être IOBSP pour acheter ces leads ?",
        "Pour proposer et monter un regroupement de crédits, oui : c’est votre activité d’intermédiaire qui l’exige, avec une immatriculation à l’ORIAS. Kairn, de son côté, se limite à transmettre la demande, sans conseil ni condition de crédit."
      ],
      [
        "Peut-on recevoir seulement des propriétaires ?",
        "Oui. Chaque contact indique s’il est propriétaire sans prêt, propriétaire avec un prêt en cours ou locataire. Les critères d’envoi se règlent avec vous avant le lancement, et un contact qui n’y répond pas ne vous est pas envoyé."
      ],
      [
        "Les leads sont-ils filtrés sur le fichage Banque de France ?",
        "Le formulaire ne pose pas la question par défaut : la personne ne sait pas toujours si elle est inscrite au FICP, et sa réponse ne remplace pas la vérification de l’établissement prêteur. Si vous voulez en faire un critère, cela se décide avec vous avant le lancement."
      ],
      [
        "Les publicités respectent-elles la réforme du 20 novembre 2026 ?",
        "Oui. À partir du 20/11/2026, elles portent la mention « Attention ! Un crédit coûte de l’argent et doit être remboursé ! » et ne mettent pas en avant la facilité d’obtenir un crédit. Elles n’affichent ni taux ni mensualité."
      ],
      [
        "Garantissez-vous des dossiers financés ?",
        "Non. Kairn s’engage sur le contact : une demande réelle, récente, dans votre zone, envoyée à vous seul. La faisabilité du dossier se juge à l’étude des pièces, et la décision revient à l’établissement prêteur."
      ],
      [
        "Que se passe-t-il si le contact est un doublon ou hors zone ?",
        "Vous le signalez depuis votre espace client. Après vérification, Kairn le remplace par une nouvelle demande de regroupement."
      ]
    ],
    "proches": [
      "leads-assurance-emprunteur",
      "leads-assurance",
      "leads-mutuelle-sante"
    ]
  },
  // ───────────────────────────── Assurance ─────────────────────────────
  'leads-assurance': {
    "h1": [
      "Leads assurance",
      "pour courtiers et agents."
    ],
    "chapo": "Un lead assurance Kairn est un particulier qui a demandé lui-même à être rappelé au sujet de sa mutuelle, de son assurance de prêt ou d’un contrat obsèques, transmis à un seul courtier, agent ou assureur, sur devis, sans engagement, à partir de 50 contacts. Le formulaire vous nomme : la personne sait qui va l’appeler.",
    "motTitre": "assurance",
    "motCommande": "assurance",
    "pourLe": "aux projets d’assurance",
    "definition": "Un contact de particulier qui a rempli lui-même une demande de rappel au sujet d’une assurance : la branche qui l’intéresse, son âge, sa situation actuelle (contrat en cours, échéance) et le moment où il préfère être appelé.",
    "bref": [
      "Trois branches",
      "Mutuelle santé, assurance emprunteur et contrat obsèques ont chacune leur campagne, leurs questions et leur page : vous commandez une branche ou plusieurs."
    ],
    "qualif": "Avant d’appeler, vous savez quelle assurance la personne veut revoir, son âge, si elle a déjà un contrat et quand il arrive à échéance, et à quel moment la joindre. Vous préparez l’appel sur le bon produit, avec la bonne compagnie de votre gamme.",
    "champs": [
      [
        "Assurance recherchée",
        "Mutuelle, prêt immobilier, obsèques"
      ],
      [
        "Âge",
        "Âge de la personne à assurer"
      ],
      [
        "Contrat actuel",
        "Oui ou non, avec date d’échéance"
      ],
      [
        "Rappel",
        "Moment préféré pour être appelé"
      ]
    ],
    "pourQuiTitre": [
      "Pour les intermédiaires",
      "inscrits à l’ORIAS."
    ],
    "pourQui": [
      [
        "Cabinets de courtage",
        "Vous placez chez plusieurs compagnies et voulez des demandes récentes à instruire, branche par branche, sans dépendre des comparateurs.",
        "briefcase",
        [
          "Courtier",
          "Multi-compagnies",
          "1 à 10 personnes"
        ]
      ],
      [
        "Agents généraux",
        "Votre portefeuille vit de la proximité : des demandes de votre secteur, que vous êtes seul à rappeler, pour l’agence et ses collaborateurs.",
        "shield",
        [
          "Agence",
          "Mandat",
          "Secteur local"
        ]
      ],
      [
        "Plateformes et assureurs en direct",
        "Vous vendez à distance avec un plateau de conseillers : un volume réglé chaque semaine, avec la preuve du consentement de chaque contact.",
        "chart",
        [
          "Vente à distance",
          "Plateau",
          "Gros volumes"
        ]
      ]
    ],
    "enfantsTitre": [
      "Trois branches,",
      "trois pages dédiées."
    ],
    "enfantsIntro": "Chaque branche a sa propre campagne et ses propres questions : choisissez celle qui correspond à votre portefeuille.",
    "exemple": {
      "init": "MD",
      "nom": "Martine D.",
      "ville": "Angers · 49000",
      "projet": "Mutuelle santé",
      "mail": "m•••••@free.fr",
      "reponses": [
        [
          "Assurance",
          "Mutuelle santé"
        ],
        [
          "Âge",
          "67 ans"
        ],
        [
          "Contrat actuel",
          "Oui, échéance au 31/12"
        ],
        [
          "Rappel",
          "En fin de matinée"
        ]
      ]
    },
    "form": [
      "Quelle assurance voulez-vous revoir ?",
      [
        "Ma mutuelle santé",
        "Mon assurance de prêt",
        "Un contrat obsèques"
      ]
    ],
    "exclusif": "En assurance, le particulier qui reçoit plusieurs appels pour la même demande compare d’abord les voix, puis ne décroche plus. Un lead exclusif vous laisse faire votre travail de conseil, face à un interlocuteur qui sait déjà qui vous êtes.",
    "marcheTitre": [
      "Un marché de l’assurance",
      "à 308 milliards."
    ],
    "marcheIntro": "L’assurance française a encaissé 9 % de cotisations de plus en 2025, et la santé et la prévoyance en forment une large part. Chaque chiffre porte sa source.",
    "marche": [
      {
        "v": "308,6 Md€",
        "l": "de cotisations pour l’ensemble de l’assurance française en 2025 (+9,0 % sur un an).",
        "src": "France Assureurs, données clés 2025 (lu le 09/11/2026)",
        "url": "https://www.franceassureurs.fr/wp-content/uploads/lassurance-francaise-donnees-cles-2025.pdf"
      },
      {
        "v": "89,1 Md€",
        "l": "de cotisations santé et prévoyance en 2025, dont 43 % sur des contrats individuels.",
        "src": "France Assureurs, santé et prévoyance 2025 (lu le 09/11/2026)",
        "url": "https://www.franceassureurs.fr/wp-content/uploads/le-marche-des-assurances-sante-et-prevoyance-en-2025_-version-public.pdf"
      },
      {
        "v": "74 077",
        "l": "inscriptions d’intermédiaires en assurance au registre de l’ORIAS au 31/12/2025.",
        "src": "ORIAS (lu le 09/11/2026)",
        "url": "https://www.orias.fr/"
      }
    ],
    "legal": [
      [
        "Votre nom dans le formulaire",
        [
          [
            "Depuis le 11/08/2026, un particulier ne peut être appelé que s’il y a consenti au préalable, et la demande de consentement nomme le professionnel qui appellera ("
          ],
          [
            "art. L223-1 et R223-1 du Code de la consommation",
            "https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006069565/LEGISCTA000032221441"
          ],
          [
            ", "
          ],
          [
            "texte publié au Journal officiel",
            "https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000054483939"
          ],
          [
            "). Le formulaire de votre campagne affiche donc le nom de votre cabinet ou de votre agence. Ce consentement vaut un an au plus."
          ]
        ]
      ],
      [
        "Kairn ne compare ni ne conseille",
        "Kairn fournit des informations sur des personnes intéressées, sans aucune autre démarche pour aider à conclure un contrat : ni comparaison de garanties, ni tarif, ni recommandation. L’article L511-1 du Code des assurances exclut cette simple fourniture de données de la distribution d’assurance."
      ],
      [
        "Votre immatriculation ORIAS",
        [
          [
            "Présenter, proposer et conseiller un contrat, c’est votre métier d’intermédiaire : courtier, agent général ou mandataire, inscrit à l’"
          ],
          [
            "ORIAS",
            "https://www.orias.fr/"
          ],
          [
            ". Votre devoir de conseil suit la "
          ],
          [
            "recommandation ACPR 2024-R-03",
            "https://acpr.banque-france.fr/sites/default/files/medias/documents/20241121_cp_acpr_recommandation_devoir_de_conseil_.pdf"
          ],
          [
            ", applicable depuis le 01/01/2026."
          ]
        ]
      ],
      LEGAL_RGPD,
      LEGAL_RESPONSABLE
    ],
    "prixTexte": "Sur devis, branche par branche : le prix du contact dépend de la branche, de la zone, du volume et de vos critères (âge, contrat en cours). Il est fixé avant la commande, payée sur bon de commande par virement. Kairn paie la publicité, sans abonnement.",
    "faq": [
      [
        "Combien coûte un lead assurance ?",
        "Le prix est sur devis, car il varie d’une branche à l’autre : une demande de mutuelle, d’assurance de prêt ou de contrat obsèques ne se qualifie pas de la même façon. Il dépend aussi de la zone, du volume et de vos critères, et vous est donné avant toute commande. Kairn paie la publicité, sans abonnement, première commande à partir de 50 contacts."
      ],
      [
        "Quelles branches sont couvertes ?",
        "Trois : mutuelle santé, assurance emprunteur et contrat obsèques. Chacune a sa campagne et ses questions de qualification. Vous pouvez commander une seule branche ou les combiner."
      ],
      [
        "Acheter des leads assurance est-il encore légal depuis le 11 août 2026 ?",
        "Oui, à condition que la personne ait consenti à être appelée par vous. Depuis le 11/08/2026, le démarchage téléphonique sans consentement préalable est interdit, et ce consentement doit nommer le professionnel. Le formulaire Kairn nomme votre cabinet ou votre agence, dans une case dédiée non pré-cochée."
      ],
      [
        "Faut-il être inscrit à l’ORIAS pour acheter ces contacts ?",
        "Pour présenter, proposer ou conseiller un contrat, oui : c’est votre activité de distribution qui l’exige. Kairn se limite à fournir des données sur des personnes intéressées, ce que l’article L511-1 du Code des assurances exclut de la distribution."
      ],
      [
        "Lead exclusif ou mutualisé : quelle différence ?",
        "Un lead mutualisé est vendu à plusieurs intermédiaires, qui appellent tous la même personne. Chez Kairn, chaque contact va à un seul acheteur et n’est jamais revendu. Le consentement nominatif rend d’ailleurs un contact revendu à des tiers non nommés inexploitable au téléphone."
      ],
      [
        "Pourquoi certains leads achetés ne répondent-ils pas ?",
        "Souvent parce qu’ils ont été vendus plusieurs fois, ou rappelés plusieurs jours après la demande. Un contact Kairn arrive le jour même dans votre espace client, avec la date et l’heure de sa demande et le moment où la personne préfère être appelée. Kairn ne promet pas pour autant de taux de joignabilité."
      ],
      [
        "Garantissez-vous des contrats signés ?",
        "Non. Kairn s’engage sur le contact : une demande réelle, récente, dans votre zone, envoyée à vous seul. La signature dépend de votre conseil et de votre gamme."
      ],
      [
        "Que se passe-t-il si le contact est un doublon ou hors zone ?",
        "Signalez-le depuis votre espace client : après vérification, il est remplacé par une nouvelle demande de la même branche."
      ]
    ],
    "proches": [
      "leads-mutuelle-sante",
      "leads-assurance-emprunteur",
      "leads-contrat-obseques",
      "leads-regroupement-de-credits"
    ]
  },
  // ───────────────────────────── Mutuelle santé ─────────────────────────────
  'leads-mutuelle-sante': {
    "h1": [
      "Leads mutuelle santé",
      "seniors et actifs."
    ],
    "chapo": "Un lead mutuelle santé Kairn est un particulier, souvent senior, qui a demandé lui-même à être rappelé pour revoir sa complémentaire santé, transmis à un seul courtier ou organisme, sur devis, sans engagement, à partir de 50 contacts. Le formulaire porte sur ses besoins de remboursement et ne lui pose aucune question sur sa santé.",
    "motTitre": "mutuelle santé",
    "motCommande": "mutuelle",
    "pourLe": "aux projets de mutuelle santé",
    "definition": "Un contact de particulier qui a rempli lui-même une demande de rappel pour sa complémentaire santé : âge, personnes à couvrir, régime obligatoire, postes de remboursement prioritaires et mutuelle actuelle, sans aucune donnée médicale.",
    "bref": [
      "Aucune question de santé",
      "Le formulaire ne demande ni maladie, ni traitement, ni hospitalisation passée. Il porte sur les postes à mieux rembourser : dentaire, optique, audition, hospitalisation."
    ],
    "qualif": "Avant d’appeler, vous connaissez l’âge de la personne et celui de son conjoint, son régime obligatoire, les postes qu’elle veut mieux faire rembourser et l’échéance de sa mutuelle actuelle. Vous savez quelle formule présenter, et vous ne lui avez rien demandé sur sa santé.",
    "champs": [
      [
        "Âge",
        "Âge de l’assuré et du conjoint"
      ],
      [
        "Régime",
        "Général, TNS, agricole, Alsace-Moselle"
      ],
      [
        "Postes prioritaires",
        "Dentaire, optique, audition…"
      ],
      [
        "Mutuelle actuelle",
        "Échéance et cotisation mensuelle"
      ]
    ],
    "pourQuiTitre": [
      "Pour les courtiers",
      "qui placent des complémentaires santé."
    ],
    "pourQui": [
      [
        "Courtiers santé spécialisés seniors",
        "Vous connaissez les garanties dentaire, optique et audition qui comptent à la retraite : des demandes de personnes de plus de 60 ans, à vous seul.",
        "user",
        [
          "Seniors",
          "Retraités",
          "Courtier ORIAS"
        ]
      ],
      [
        "Plateformes de courtage à distance",
        "Vos conseillers enchaînent les appels : un volume régulier de demandes santé, avec le régime et l’échéance déjà renseignés.",
        "chart",
        [
          "Plateau",
          "Vente à distance",
          "Volume réglé"
        ]
      ],
      [
        "Mutuelles régionales",
        "Vous vendez vos propres contrats sur quelques départements : des demandes de votre territoire, au rythme de vos agences.",
        "building",
        [
          "Mutuelle",
          "Agences",
          "Territoire"
        ]
      ]
    ],
    "exemple": {
      "init": "GB",
      "nom": "Gérard B.",
      "ville": "Perpignan · 66000",
      "projet": "Mutuelle santé",
      "mail": "g•••••@wanadoo.fr",
      "reponses": [
        [
          "Âge",
          "71 ans, conjointe 68 ans"
        ],
        [
          "Régime",
          "Général"
        ],
        [
          "Priorité",
          "Dentaire"
        ],
        [
          "Mutuelle actuelle",
          "Échéance au 31/12"
        ]
      ]
    },
    "form": [
      "Quel poste voulez-vous mieux faire rembourser ?",
      [
        "Dentaire",
        "Optique",
        "Audition"
      ]
    ],
    "exclusif": "Un retraité appelé par quatre courtiers pour la même mutuelle croit souvent à une arnaque, et raccroche. Un lead exclusif vous permet d’appeler seul, sous le nom que le formulaire lui a déjà donné.",
    "marcheTitre": [
      "Une complémentaire",
      "qui coûte plus cher avec l’âge."
    ],
    "marcheIntro": "La cotisation d’un contrat individuel grimpe avec l’âge, et les 65 ans ou plus sont désormais presque aussi nombreux que les moins de 20 ans. Chaque chiffre porte sa source.",
    "marche": [
      {
        "v": "46,5 Md€",
        "l": "de cotisations santé collectées en 2024 par 373 organismes complémentaires (+8,2 %).",
        "src": "Drees, rapport 2025 sur les organismes complémentaires (lu le 09/11/2026)",
        "url": "https://drees.solidarites-sante.gouv.fr/publications-communique-de-presse-documents-de-reference/rapports/251218-rapport-organismes-complémentaires"
      },
      {
        "v": "146 €",
        "l": "par mois : la prime d’un contrat individuel à 85 ans, contre 33 € à 20 ans, pour l’assuré de référence.",
        "src": "Drees, panorama La complémentaire santé, édition 2024 (lu le 09/11/2026)",
        "url": "https://drees.solidarites-sante.gouv.fr/publications-communique-de-presse/panoramas-de-la-drees/240710_Panorama_ComplementaireSante2024"
      },
      {
        "v": "22,2 %",
        "l": "des habitants ont 65 ans ou plus au 01/01/2026 (22,5 % ont moins de 20 ans).",
        "src": "INSEE, bilan démographique 2025 (lu le 09/11/2026)",
        "url": "https://www.insee.fr/fr/statistiques/8719824"
      },
      {
        "v": "43 %",
        "l": "des cotisations santé et prévoyance viennent de contrats individuels, ceux que l’on souscrit soi-même (2025).",
        "src": "France Assureurs, santé et prévoyance 2025 (lu le 09/11/2026)",
        "url": "https://www.franceassureurs.fr/wp-content/uploads/le-marche-des-assurances-sante-et-prevoyance-en-2025_-version-public.pdf"
      }
    ],
    "legal": [
      [
        "Votre nom dans le formulaire",
        [
          [
            "Le particulier qui demande à revoir sa mutuelle coche une case qui nomme votre cabinet : depuis le 11/08/2026, l’appel exige un consentement préalable, et la demande de consentement doit désigner le professionnel qui appellera ("
          ],
          [
            "art. L223-1 et R223-1 du Code de la consommation",
            "https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006069565/LEGISCTA000032221441"
          ],
          [
            ", "
          ],
          [
            "texte publié au Journal officiel",
            "https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000054483939"
          ],
          [
            "). Ce consentement vaut un an au plus."
          ]
        ]
      ],
      [
        "Aucune question de santé",
        "Le formulaire ne recueille aucune donnée de santé : ni pathologie, ni traitement, ni hospitalisation. Ces informations sont des données sensibles au sens de l’article 9 du RGPD. Les questions portent seulement sur les postes de remboursement souhaités, l’âge, le régime et le contrat en cours."
      ],
      [
        "Kairn ne compare aucune mutuelle",
        [
          [
            "Kairn ne compare aucune garantie, n’affiche aucun tarif et ne recommande aucun contrat : c’est la simple fourniture de données que l’article L511-1 du Code des assurances laisse hors de la distribution. Le conseil revient à vous, intermédiaire inscrit à l’"
          ],
          [
            "ORIAS",
            "https://www.orias.fr/"
          ],
          [
            "."
          ]
        ]
      ],
      LEGAL_RGPD,
      LEGAL_RESPONSABLE
    ],
    "prixTexte": "Sur devis : le prix du contact dépend de la zone, du volume et de vos critères, par exemple un âge minimum ou un régime obligatoire. Il vous est donné avant toute commande, payée sur bon de commande par virement. Kairn paie la publicité, sans abonnement.",
    "faq": [
      [
        "Combien coûte un lead mutuelle santé ?",
        "Le prix est sur devis : il dépend de votre zone, du volume et de vos critères d’envoi, comme un âge minimum ou un régime obligatoire précis. Il vous est communiqué avant toute commande. Kairn paie la publicité, sans abonnement, et la première commande part de 50 contacts."
      ],
      [
        "Les contacts sont-ils tous des seniors ?",
        "Non, mais beaucoup le sont : la prime d’un contrat individuel passe de 33 € par mois à 20 ans à 146 € à 85 ans selon la Drees, et la question se pose souvent au départ en retraite. Vous pouvez fixer un âge minimum dans vos critères d’envoi."
      ],
      [
        "Le formulaire pose-t-il des questions sur la santé ?",
        "Non, jamais. Il ne demande ni maladie, ni traitement, ni hospitalisation, qui sont des données sensibles au sens du RGPD. Il porte sur les postes à mieux rembourser, l’âge, le régime et la mutuelle actuelle."
      ],
      [
        "Peut-on filtrer par régime obligatoire ?",
        "Oui. Chaque contact indique son régime : général, travailleur non salarié, agricole ou Alsace-Moselle. Si vous ne placez que certains régimes, ce critère se règle avec vous avant le lancement."
      ],
      [
        "La personne a-t-elle déjà une mutuelle ?",
        "Le plus souvent oui : 96 % de la population est couverte par une complémentaire santé, selon la Drees. Le formulaire demande l’échéance et la cotisation actuelle, qui vous disent quand et sur quelle base proposer autre chose."
      ],
      [
        "Un lead mutuelle est-il vendu à plusieurs courtiers ?",
        "Non. Chaque contact est envoyé à un seul acheteur et n’est jamais revendu. La personne a consenti à être rappelée par vous, et par personne d’autre."
      ],
      [
        "Faut-il être courtier ORIAS pour acheter ces contacts ?",
        "Pour conseiller et proposer une complémentaire santé, oui : c’est votre activité de distribution d’assurance qui l’exige. Une mutuelle qui vend ses propres contrats peut aussi commander. Kairn se limite à transmettre la demande."
      ],
      [
        "Que se passe-t-il si le contact est un doublon ou hors zone ?",
        "Vous le signalez depuis votre espace client. Une fois la vérification faite, Kairn le remplace par une autre demande de mutuelle."
      ]
    ],
    "proches": [
      "leads-assurance",
      "leads-contrat-obseques",
      "leads-appareils-auditifs",
      "leads-assurance-emprunteur"
    ]
  },
  // ───────────────────────────── Assurance emprunteur ─────────────────────────────
  'leads-assurance-emprunteur': {
    "h1": [
      "Leads assurance emprunteur",
      "portés par la loi Lemoine."
    ],
    "chapo": "Un lead assurance emprunteur Kairn est un particulier qui a demandé lui-même à être rappelé pour changer l’assurance de son prêt immobilier, transmis à un seul courtier ou assureur, sur devis, sans engagement, à partir de 50 contacts. Depuis la loi Lemoine, il peut en changer à tout moment, et le formulaire ne lui pose aucune question de santé.",
    "motTitre": "assurance emprunteur",
    "motCommande": "emprunteur",
    "pourLe": "aux projets d’assurance emprunteur",
    "definition": "Un contact d’emprunteur qui a rempli lui-même une demande de rappel pour changer l’assurance de son prêt immobilier : année de signature, capital restant dû, nombre d’emprunteurs et âge de chacun, banque prêteuse.",
    "bref": [
      "Changement à tout moment",
      "Depuis la loi Lemoine (loi n° 2022-270 du 28/02/2022), l’emprunteur peut résilier son assurance de prêt à tout moment, sans attendre la date anniversaire."
    ],
    "qualif": "Avant d’appeler, vous savez quand le prêt a été signé, combien il reste à rembourser, combien de personnes sont assurées et à quel âge, et quelle banque a prêté. Vous estimez l’économie possible avant de décrocher, et vous voyez déjà si le dossier entre dans les seuils où le questionnaire médical est supprimé.",
    "champs": [
      [
        "Signature du prêt",
        "Année de signature"
      ],
      [
        "Capital restant dû",
        "Tranche de montant"
      ],
      [
        "Emprunteurs",
        "Nombre et âge de chacun"
      ],
      [
        "Banque prêteuse",
        "Établissement qui a accordé le prêt"
      ]
    ],
    "pourQuiTitre": [
      "Pour les spécialistes",
      "de l’assurance de prêt."
    ],
    "pourQui": [
      [
        "Courtiers en assurance emprunteur",
        "La substitution est votre métier : des emprunteurs qui ont déjà décidé de regarder ailleurs que chez leur banque.",
        "shield",
        [
          "Substitution",
          "Délégation",
          "Courtier ORIAS"
        ]
      ],
      [
        "Courtiers en crédit immobilier",
        "Vous placez aussi l’assurance de vos clients : des demandes de substitution pour occuper vos conseillers entre deux montages de prêt.",
        "home",
        [
          "IOBSP",
          "Crédit immobilier",
          "Assurance"
        ]
      ],
      [
        "Assureurs alternatifs",
        "Vous vendez votre contrat en direct, hors des réseaux bancaires : des emprunteurs à vous seul, dans le volume que vous fixez.",
        "badge",
        [
          "Vente directe",
          "Contrat alternatif",
          "Volume réglé"
        ]
      ]
    ],
    "exemple": {
      "init": "TR",
      "nom": "Thomas R.",
      "ville": "Nantes · 44000",
      "projet": "Assurance de prêt",
      "mail": "t•••••@gmail.com",
      "reponses": [
        [
          "Prêt signé en",
          "2022"
        ],
        [
          "Capital restant dû",
          "150 000 à 200 000 €"
        ],
        [
          "Emprunteurs",
          "2, de 34 et 36 ans"
        ],
        [
          "Banque",
          "Banque mutualiste"
        ]
      ]
    },
    "form": [
      "Quand avez-vous signé votre prêt ?",
      [
        "Il y a moins de 2 ans",
        "Il y a 2 à 5 ans",
        "Il y a plus de 5 ans"
      ]
    ],
    "exclusif": "Un emprunteur qui veut changer d’assurance compare des économies : s’il reçoit trois appels, il retient le dernier chiffre entendu, pas le meilleur conseil. Un lead exclusif vous laisse le temps de faire l’étude complète et de l’accompagner jusqu’à l’accord de sa banque.",
    "marcheTitre": [
      "Les changements d’assurance",
      "ont plus que doublé."
    ],
    "marcheIntro": "Depuis la loi Lemoine, les demandes de changement d’assurance de prêt ont plus que doublé, et la quasi-totalité est acceptée. Chaque chiffre porte sa source.",
    "marche": [
      {
        "v": "22,15 M",
        "l": "de contrats d’assurance emprunteur couvrent des crédits immobiliers en 2024, pour près de 7 Md€ de cotisations.",
        "src": "CCSF, avis du 26/05/2026 (lu le 09/11/2026)",
        "url": "https://www.banque-france.fr/system/files/2026-06/CCSF_Avis_ADE_1_adopte_260526.pdf"
      },
      {
        "v": "496 654",
        "l": "demandes de substitution en 2024, contre 198 530 en 2021.",
        "src": "CCSF, avis du 26/05/2026 (lu le 09/11/2026)",
        "url": "https://www.banque-france.fr/system/files/2026-06/CCSF_Avis_ADE_1_adopte_260526.pdf"
      },
      {
        "v": "93,91 %",
        "l": "de ces demandes de substitution ont été acceptées en 2024.",
        "src": "CCSF, avis du 26/05/2026 (lu le 09/11/2026)",
        "url": "https://www.banque-france.fr/system/files/2026-06/CCSF_Avis_ADE_1_adopte_260526.pdf"
      },
      {
        "v": "17,48 %",
        "l": "de part de marché pour les assureurs alternatifs externes en 2024, contre 16 % en 2021.",
        "src": "CCSF, avis du 26/05/2026 (lu le 09/11/2026)",
        "url": "https://www.banque-france.fr/system/files/2026-06/CCSF_Avis_ADE_1_adopte_260526.pdf"
      }
    ],
    "legal": [
      [
        "Votre nom dans le formulaire",
        [
          [
            "L’emprunteur accepte d’être rappelé par un professionnel désigné par son nom, le vôtre : depuis le 11/08/2026, c’est la condition pour l’appeler ("
          ],
          [
            "art. L223-1 et R223-1 du Code de la consommation",
            "https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006069565/LEGISCTA000032221441"
          ],
          [
            ", "
          ],
          [
            "texte publié au Journal officiel",
            "https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000054483939"
          ],
          [
            "). Ce consentement est recueilli dans une case dédiée et vaut un an au plus."
          ]
        ]
      ],
      [
        "Loi Lemoine : ce que le particulier sait déjà",
        [
          [
            "L’assurance de prêt se résilie à tout moment, et le questionnaire médical est supprimé quand la part assurée ne dépasse pas 200 000 € par assuré et que le crédit se termine avant le 60e anniversaire. Le CCSF fait le point sur son application dans son "
          ],
          [
            "avis du 26/05/2026",
            "https://www.banque-france.fr/system/files/2026-06/CCSF_Avis_ADE_1_adopte_260526.pdf"
          ],
          [
            "."
          ]
        ]
      ],
      [
        "Aucune question de santé, aucun conseil",
        [
          [
            "Le formulaire ne demande rien sur l’état de santé : ce sont des données sensibles (art. 9 du RGPD), et le questionnaire médical, quand il est requis, relève de l’assureur. Kairn ne compare aucun contrat et ne chiffre aucune économie : il transmet la demande, le conseil revient à vous, intermédiaire inscrit à l’"
          ],
          [
            "ORIAS",
            "https://www.orias.fr/"
          ],
          [
            "."
          ]
        ]
      ],
      LEGAL_RGPD,
      LEGAL_RESPONSABLE
    ],
    "prixTexte": "Sur devis : le prix du contact dépend de la zone, du volume et de vos critères, par exemple un capital restant dû minimum. Il vous est donné avant toute commande, payée sur bon de commande par virement. Kairn paie la publicité, sans abonnement.",
    "faq": [
      [
        "Combien coûte un lead assurance emprunteur ?",
        "Le prix est sur devis : il dépend de votre zone, du volume commandé et de vos critères, comme un capital restant dû minimum ou une année de signature. Il vous est donné avant toute commande. Kairn paie la publicité, sans abonnement, et la première commande part de 50 contacts."
      ],
      [
        "Qu’a changé la loi Lemoine pour les leads emprunteur ?",
        "Elle permet de changer d’assurance de prêt à tout moment, et non plus seulement à la date anniversaire. Les demandes de substitution sont passées de 198 530 en 2021 à 496 654 en 2024, dont 93,91 % acceptées, selon le CCSF."
      ],
      [
        "Le formulaire pose-t-il des questions de santé ?",
        "Non. Il demande l’âge des emprunteurs et le capital restant dû, qui suffisent pour savoir si le dossier entre dans les seuils de la loi Lemoine (200 000 € par assuré, fin du crédit avant 60 ans). Le questionnaire médical, s’il est nécessaire, se remplit auprès de l’assureur."
      ],
      [
        "Recevez-vous des leads pour un nouveau prêt ?",
        "Cette campagne vise les emprunteurs qui ont déjà un prêt et veulent changer d’assurance. Si vous cherchez des projets d’achat en cours, parlez-en avant la commande : les questions du formulaire et les critères d’envoi se règlent avec vous."
      ],
      [
        "Quel capital restant dû rend la substitution intéressante ?",
        "Cela dépend de votre tarif, de l’âge des emprunteurs et du contrat de la banque. Chaque contact indique la tranche de capital restant dû et l’année de signature : vous fixez le minimum qui vous convient dans vos critères d’envoi."
      ],
      [
        "Faut-il être inscrit à l’ORIAS pour acheter ces leads ?",
        "Pour conseiller et proposer une assurance de prêt, oui : courtier, agent ou assureur, c’est votre activité de distribution qui l’exige. Kairn se limite à transmettre la demande, sans comparer de contrats."
      ],
      [
        "Un lead emprunteur est-il vendu à plusieurs courtiers ?",
        "Non. Chaque contact est envoyé à un seul acheteur et n’est jamais revendu. L’emprunteur a accepté d’être rappelé par vous nommément."
      ],
      [
        "Que se passe-t-il si le contact est un doublon ou hors zone ?",
        "Signalez-le depuis votre espace client. S’il est confirmé, Kairn le remplace par une autre demande de changement d’assurance."
      ]
    ],
    "proches": [
      "leads-regroupement-de-credits",
      "leads-assurance",
      "leads-mutuelle-sante"
    ]
  },
  // ───────────────────────────── Contrat obsèques ─────────────────────────────
  'leads-contrat-obseques': {
    "h1": [
      "Leads contrat obsèques",
      "pour courtiers et assureurs."
    ],
    "chapo": "Un lead contrat obsèques Kairn est un particulier qui a demandé lui-même à être rappelé pour financer ses obsèques par un contrat d’assurance, transmis à un seul courtier ou assureur, sur devis, sans engagement, à partir de 50 contacts. Kairn ne propose aucune prestation funéraire et ne cible jamais des familles en deuil.",
    "motTitre": "contrat obsèques",
    "motCommande": "obsèques",
    "pourLe": "aux projets de contrat obsèques",
    "definition": "Un contact de particulier qui a rempli lui-même une demande de rappel pour souscrire un contrat obsèques, c’est-à-dire une assurance de prévoyance qui financera ses obsèques : âge, personnes à couvrir, capital souhaité et contrat existant.",
    "bref": [
      "Âge moyen : 65 ans",
      "C’est l’âge moyen de souscription d’un contrat obsèques en 2024, selon France Assureurs : vos interlocuteurs sont surtout de jeunes retraités."
    ],
    "qualif": "Avant d’appeler, vous connaissez l’âge de la personne, si elle veut se couvrir seule ou avec son conjoint, le capital qu’elle envisage et si elle a déjà un contrat. Vous préparez une proposition à sa mesure, sans pousser un capital qu’elle n’a pas demandé.",
    "champs": [
      [
        "Âge",
        "Âge du futur assuré"
      ],
      [
        "Couverture",
        "Seul ou en couple"
      ],
      [
        "Capital souhaité",
        "Tranche de capital"
      ],
      [
        "Contrat existant",
        "Oui ou non"
      ]
    ],
    "pourQuiTitre": [
      "Pour les intermédiaires",
      "de la prévoyance obsèques."
    ],
    "pourQui": [
      [
        "Courtiers en prévoyance obsèques",
        "Vous placez des contrats en capital ou en prestations chez plusieurs assureurs : des demandes récentes, que vous êtes seul à rappeler.",
        "briefcase",
        [
          "Courtier ORIAS",
          "Capital",
          "Prestations"
        ]
      ],
      [
        "Assureurs en direct",
        "Vous distribuez votre propre contrat obsèques à distance : un volume réglé, avec la preuve du consentement de chaque contact.",
        "shield",
        [
          "Assureur",
          "Vente à distance",
          "Volume réglé"
        ]
      ],
      [
        "Agents et mandataires d’assurance",
        "La prévoyance complète votre portefeuille : des demandes de votre secteur pour vos rendez-vous en agence ou à domicile, sur rendez-vous pris.",
        "user",
        [
          "Agence",
          "Prévoyance",
          "Secteur local"
        ]
      ]
    ],
    "exemple": {
      "init": "CM",
      "nom": "Colette M.",
      "ville": "Clermont-Ferrand · 63000",
      "projet": "Contrat obsèques",
      "mail": "c•••••@orange.fr",
      "reponses": [
        [
          "Âge",
          "68 ans"
        ],
        [
          "Couverture",
          "En couple"
        ],
        [
          "Capital souhaité",
          "3 000 à 5 000 €"
        ],
        [
          "Contrat existant",
          "Non"
        ]
      ]
    },
    "form": [
      "Quel capital souhaitez-vous prévoir ?",
      [
        "Moins de 3 000 €",
        "3 000 à 5 000 €",
        "Plus de 5 000 €"
      ]
    ],
    "exclusif": "Le contrat obsèques s’adresse à des personnes âgées, qu’une série d’appels insistants inquiète à raison. Un lead exclusif vous permet un seul appel, posé, sous le nom que la personne a accepté dans le formulaire.",
    "marcheTitre": [
      "5,7 millions de contrats",
      "en portefeuille."
    ],
    "marcheIntro": "Le contrat obsèques a connu en 2024 sa meilleure année de souscriptions depuis 2009, et plus de la moitié des contrats vie entière passent encore par le guichet bancaire. Chaque chiffre porte sa source.",
    "marche": [
      {
        "v": "5,7 M",
        "l": "de contrats obsèques à adhésion individuelle en portefeuille fin 2024 (+4,7 %), pour 1,9 Md€ de cotisations.",
        "src": "France Assureurs, prévoyance 2024 (lu le 09/11/2026)",
        "url": "https://www.franceassureurs.fr/wp-content/uploads/lassurance-prevoyance-en-2024.pdf"
      },
      {
        "v": "550 800",
        "l": "contrats souscrits en 2024, le plus haut niveau depuis 2009.",
        "src": "France Assureurs, prévoyance 2024 (lu le 09/11/2026)",
        "url": "https://www.franceassureurs.fr/wp-content/uploads/lassurance-prevoyance-en-2024.pdf"
      },
      {
        "v": "4 350 €",
        "l": "de capital moyen garanti par un contrat vie entière en 2024.",
        "src": "France Assureurs, prévoyance 2024 (lu le 09/11/2026)",
        "url": "https://www.franceassureurs.fr/wp-content/uploads/lassurance-prevoyance-en-2024.pdf"
      },
      {
        "v": "30 %",
        "l": "des contrats vie entière sont distribués par des agents, des courtiers ou des salariés d’assureurs (59 % au guichet bancaire).",
        "src": "France Assureurs, prévoyance 2024 (lu le 09/11/2026)",
        "url": "https://www.franceassureurs.fr/wp-content/uploads/lassurance-prevoyance-en-2024.pdf"
      }
    ],
    "legal": [
      [
        "Votre nom dans le formulaire",
        [
          [
            "La personne qui remplit le formulaire accepte d’être rappelée par vous, nommément : depuis le 11/08/2026, l’appel d’un particulier exige ce consentement préalable ("
          ],
          [
            "art. L223-1 et R223-1 du Code de la consommation",
            "https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006069565/LEGISCTA000032221441"
          ],
          [
            ", "
          ],
          [
            "texte publié au Journal officiel",
            "https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000054483939"
          ],
          [
            "). Il vaut un an au plus, et pour elle seule : un proche dont elle parlerait n’a pas consenti à être appelé."
          ]
        ]
      ],
      [
        "Ni prestations funéraires, ni familles en deuil",
        [
          [
            "L’"
          ],
          [
            "article L2223-33 du CGCT",
            "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006390312"
          ],
          [
            " interdit, sauf pour les formules de financement d’obsèques, les offres de services faites en prévision d’obsèques ou dans les deux mois suivant un décès, y compris par un intermédiaire. Kairn ne transmet donc aucune demande de devis funéraire, ne vend aucun contact à ce titre et ne cible jamais des familles venant de perdre un proche : seul le financement par un contrat d’assurance entre dans ses campagnes."
          ]
        ]
      ],
      [
        "Un contrat d’assurance, un intermédiaire ORIAS",
        [
          [
            "Le contrat obsèques est un contrat d’assurance de prévoyance : le présenter et conseiller sur la cotisation relève d’un intermédiaire inscrit à l’"
          ],
          [
            "ORIAS",
            "https://www.orias.fr/"
          ],
          [
            " ou de l’assureur lui-même. Kairn ne compare aucun contrat et n’affiche aucun tarif ; les publicités ne jouent ni sur l’urgence ni sur la peur."
          ]
        ]
      ],
      LEGAL_RGPD,
      LEGAL_RESPONSABLE
    ],
    "prixTexte": "Sur devis : le prix du contact dépend de la zone, du volume et de vos critères, par exemple une tranche d’âge ou de capital. Il vous est donné avant toute commande, payée sur bon de commande par virement. Kairn paie la publicité, sans abonnement.",
    "faq": [
      [
        "Combien coûte un lead contrat obsèques ?",
        "Le prix est sur devis : il dépend de votre zone, du volume commandé et de vos critères, comme une tranche d’âge ou un capital minimum. Il vous est communiqué avant toute commande. Kairn paie la publicité, sans abonnement, et la première commande part de 50 contacts."
      ],
      [
        "Kairn vend-il des contacts aux pompes funèbres ?",
        "Non. Kairn ne propose aucune prestation funéraire et ne transmet aucune demande de devis d’obsèques. L’article L2223-33 du CGCT interdit les offres de services faites en prévision d’obsèques ou dans les deux mois d’un décès, hors formules de financement : seul le contrat obsèques, une assurance, entre dans ce cadre."
      ],
      [
        "Qui demande à être rappelé ?",
        "Le futur assuré lui-même, qui prépare le financement de ses obsèques, seul ou avec son conjoint. Le consentement au rappel est celui de la personne qui remplit le formulaire : un proche dont elle parlerait n’a pas consenti à être appelé."
      ],
      [
        "Faut-il être inscrit à l’ORIAS pour acheter ces leads ?",
        "Oui, sauf si vous êtes l’assureur : présenter et conseiller un contrat obsèques est une activité de distribution d’assurance. Kairn se limite à transmettre la demande, sans comparer de contrats."
      ],
      [
        "Comment sont rédigées les publicités ?",
        "Sans urgence, sans peur et sans promesse de prix. Le secteur est surveillé de près (avis du CCSF du 08/10/2024, contrôles de la DGCCRF), et les campagnes en tiennent compte : elles parlent de financer ses obsèques à l’avance, rien de plus."
      ],
      [
        "Contrat en capital ou en prestations : que contient le lead ?",
        "Le formulaire indique le capital envisagé, la couverture seule ou en couple et l’existence d’un contrat. Le choix entre capital et prestations, comme le mode de cotisation, se discute au téléphone avec vous."
      ],
      [
        "Un lead obsèques est-il vendu à plusieurs intermédiaires ?",
        "Non. Chaque contact est envoyé à un seul acheteur et n’est jamais revendu. Pour un public âgé, c’est aussi ce qui évite des appels répétés pour la même demande."
      ],
      [
        "Que se passe-t-il si le contact est un doublon ou hors zone ?",
        "Vous le signalez depuis votre espace client ; après vérification, il est remplacé par une nouvelle demande de contrat obsèques."
      ]
    ],
    "proches": [
      "leads-assurance",
      "leads-mutuelle-sante",
      "leads-appareils-auditifs"
    ]
  },
};
