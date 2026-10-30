// Étapes de la plateforme, partagées par la page /plateforme et la section à onglets de l'accueil.
// Captures de l'espace client en aperçu (données d'exemple) dans public/plateforme/.
export const ETAPES = [
  {
    // Ugo, 30/10/2026 : le Leads Shop est un espace à part, il regroupe les leads produits en surplus sur les autres campagnes, à prix réduit.
    img: 'shop', tag: 'Leads Shop', h: 'Le surplus de nos campagnes,', i: 'à prix réduit.',
    p: 'Un espace à part, en plus de vos commandes : les contacts produits en surplus sur nos campagnes, disponibles tout de suite et moins chers. Filtrés par secteur, département, code postal ou prix. Vous cochez, vous achetez : les coordonnées apparaissent aussitôt, et le bon de commande se crée tout seul.',
    points: ['Coordonnées visibles seulement après l’achat', 'Hors zone d’un autre client : marqué « déjà transmis », 5 € moins cher', 'Consentement du particulier encore valable'],
  },
  {
    img: 'prospects', tag: 'Mes prospects', h: 'Vos contacts,', i: 'prêts à appeler.',
    p: 'Chaque lead livré arrive ici avec son nom, son téléphone, son e-mail, son code postal et sa qualification. Vous filtrez, vous exportez en CSV en un clic, et vous savez toujours ce qui reste à traiter.',
    points: ['Onglets « À exporter » et « Exportés »', 'Filtres par date, secteur, département', 'Téléphone cliquable depuis le mobile'],
  },
  {
    img: 'litige', tag: 'Litiges', h: 'Un doublon ?', i: 'Un clic.',
    p: 'Un lead en doublon ou hors de votre zone se signale directement depuis la liste. Nous le vérifions : accepté, il est remplacé par un lead neuf. Vous suivez la réponse dans Mes litiges.',
    points: ['Motifs : doublon ou hors zone', 'Remplacé après vérification', 'Réponse suivie dans Mes litiges'],
  },
  {
    img: 'commandes', tag: 'Mes commandes', h: 'Chaque commande,', i: 'lead par lead.',
    p: 'Vous pré-commandez depuis le catalogue ; nous validons votre zone et émettons le bon de commande. Ensuite, vous voyez la livraison avancer : livrés, plafond, restant.',
    points: ['Pré-commande en ligne, à partir de 50 leads', 'Bon de commande numéroté, HT et TTC', 'Avancement en direct'],
  },
  {
    img: 'compta', tag: 'Comptabilité', h: 'Vos règlements,', i: 'sans relance.',
    p: 'Tous vos bons de commande au même endroit, avec ce qui est réglé et ce qui reste à régler. Paiement par virement à réception du bon de commande ; la carte bancaire arrive bientôt.',
    points: ['Montant dû et déjà réglé', 'Bons de commande numérotés', 'Paiement par carte bientôt'],
  },
];
