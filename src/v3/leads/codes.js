// Thématiques de leads vendues sur devis (Ugo, 09/11/2026 : « prix sur devis » pour tout ce qui n'est pas PAC, ITE, PPV).
// Source unique des codes : le formulaire de commande (src/v3/order.jsx), l'API (api/commande.js) et les pages
// « Leads {thématique} » (src/v3/leads/thematiques.js) la lisent. Un code tient en 40 caractères (colonne commandes.thematique).
// Pompes funèbres retirées (Ugo, 09/11/2026, au clic) : art. L2223-33 du CGCT, démarchage funéraire interdit.
export const THEMATIQUES_DEVIS = [
  { code: 'COMBLES', nom: 'Isolation des combles' },
  { code: 'TOITURE', nom: 'Toiture' },
  { code: 'MENUISERIE', nom: 'Fenêtres et menuiserie' },
  { code: 'AUDITION', nom: 'Appareils auditifs' },
  { code: 'CREDIT', nom: 'Regroupement de crédits' },
  { code: 'ASSURANCE', nom: 'Assurance' },
  { code: 'MUTUELLE', nom: 'Mutuelle santé' },
  { code: 'EMPRUNTEUR', nom: 'Assurance emprunteur' },
  { code: 'OBSEQUES', nom: 'Contrat obsèques' },
  { code: 'FORMATION', nom: 'Formation professionnelle' },
  { code: 'DEMENAGEMENT', nom: 'Déménagement' },
];
