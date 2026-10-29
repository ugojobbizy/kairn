// Catalogue Kairn Leads. Prix donnés par Ugo le 28/10/2026 (PAC 28 €, ITE 27 €, PPV 35 €), affichés HT.
// Ce que contient chaque contact (formulaire de la campagne ITE, à confirmer pour PAC et PPV).
export const CONTENU_CONTACT = ['Nom, téléphone, e-mail et code postal', 'Type de logement, propriétaire ou non', 'Délai du projet'];

export const PRODUITS = [
  {
    code: 'PAC',
    nom: 'Pompe à chaleur',
    prix: 28,
    accroche: 'Des particuliers qui ont demandé à être rappelés pour installer une pompe à chaleur.',
  },
  {
    code: 'ITE',
    nom: 'Isolation par l’extérieur',
    prix: 27,
    accroche: 'Des particuliers qui ont demandé à être rappelés pour isoler leurs murs par l’extérieur.',
  },
  {
    code: 'PPV',
    nom: 'Photovoltaïque',
    prix: 35,
    accroche: 'Des particuliers qui ont demandé à être rappelés pour poser des panneaux solaires.',
  },
];

// Ce qui vaut pour tous les produits (bible de copy Kairn, 27/10/2026).
export const GARANTIES = [
  'Chaque contact est envoyé à un seul installateur',
  // Ugo, 29/10/2026 : « je ne remplace pas les faux numéros, je remplace que les doublons et les hors zone ».
  'Doublon ou hors zone : remplacé',
  'Sans engagement : vous arrêtez quand vous voulez',
];

export const prixHT = (n) => `${n} € HT`;
