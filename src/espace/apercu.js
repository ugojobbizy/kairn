// Données fictives de l'aperçu de développement (/espace?apercu et /gestion?apercu). Aucune personne réelle :
// prénoms et noms génériques numérotés, téléphones en 06 00 00 xx xx.
const CP = ['33000', '33600', '24100', '47000', '40100', '64000', '17000', '16000', '87000', '19100', '81000', '31000'];
const STATUTS = ['Propriétaire', 'Propriétaire', 'Propriétaire', 'Locataire'];
const LOGEMENTS = ['Maison', 'Maison', 'Appartement'];
const CHAUFFAGES = ['Fioul', 'Gaz', 'Électrique', 'Bois'];
const SURFACES = ['Moins de 70 m²', '70 à 110 m²', '110 à 150 m²', 'Plus de 150 m²'];
const PRIX = { PAC: 28, ITE: 27, PPV: 35 };

function lead(i, them, daysAgo, extra = {}) {
  const d = new Date(Date.now() - daysAgo * 86400000 - i * 3600000);
  const cp = CP[i % CP.length];
  return {
    id: `apercu-${them}-${i}`, recu_le: d.toISOString(), thematique: them, prix_ht: PRIX[them],
    consentement_jusqu: new Date(d.getTime() + 7 * 86400000).toISOString().slice(0, 10),
    code_postal: cp, departement: cp.slice(0, 2), ville: 'Ville exemple',
    statut_occupation: STATUTS[i % 4], type_logement: LOGEMENTS[i % 3], chauffage: CHAUFFAGES[i % 4], surface: SURFACES[i % 4],
    prenom: 'Prospect', nom: `Exemple ${i + 1}`, telephone: `06 00 00 ${String(10 + (i % 90)).padStart(2, '0')} ${String(i % 100).padStart(2, '0')}`,
    email: `prospect${i + 1}@exemple.fr`, client_id: null, commande_id: null, livre_le: null, exporte_le: null, annule: false, ...extra,
  };
}

export function apercuData() {
  const cmd = {
    id: 'apercu-cmd-1', created_at: new Date(Date.now() - 7 * 86400000).toISOString(), type: 'precommande', thematique: 'ITE', volume: '100',
    statut: 'ouverte', etape: 'lancee', bdc_numero: 'BDC-2026-00001', plafond: 100, prix_unitaire: 27, montant_ht: 2700, approuve_le: new Date(Date.now() - 7 * 86400000).toISOString(), regle_le: null,
    societe: 'Exemple Chauffage', zone: '33, 24, 47',
  };
  const pre = { id: 'apercu-cmd-2', created_at: new Date(Date.now() - 86400000).toISOString(), type: 'precommande', thematique: 'PAC', volume: '50', statut: 'nouvelle', etape: 'recue', societe: 'Exemple Chauffage', zone: '33' };
  const shopCmd = { id: 'apercu-cmd-3', created_at: new Date(Date.now() - 20 * 86400000).toISOString(), type: 'shop', thematique: 'PPV', volume: '4', statut: 'terminee', etape: 'terminee', bdc_numero: 'BDC-2026-00000', plafond: 4, prix_unitaire: 35, montant_ht: 140, approuve_le: new Date(Date.now() - 20 * 86400000).toISOString(), regle_le: new Date(Date.now() - 15 * 86400000).toISOString(), societe: 'Exemple Chauffage' };
  const mine = [
    ...Array.from({ length: 73 }, (_, i) => lead(i, 'ITE', Math.floor(i / 10), { client_id: 'apercu', commande_id: cmd.id, livre_le: new Date(Date.now() - Math.floor(i / 10) * 86400000 - i * 3600000).toISOString(), exporte_le: i > 8 ? new Date().toISOString() : null })),
    ...Array.from({ length: 4 }, (_, i) => lead(200 + i, 'PPV', 20, { client_id: 'apercu', commande_id: shopCmd.id, livre_le: shopCmd.created_at, exporte_le: new Date().toISOString() })),
  ];
  const litiges = [
    { id: 'apercu-lit-1', created_at: new Date(Date.now() - 2 * 86400000).toISOString(), lead_id: mine[3].id, client_id: 'apercu', motif: 'doublon', message: 'Déjà reçu la semaine dernière.', statut: 'en_attente', reponse: null },
    { id: 'apercu-lit-2', created_at: new Date(Date.now() - 4 * 86400000).toISOString(), lead_id: mine[12].id, client_id: 'apercu', motif: 'hors_zone', message: null, statut: 'accepte', reponse: 'Vérifié, remplacé.', remplacement_id: mine[13].id },
  ];
  const stock = [
    ...Array.from({ length: 40 }, (_, i) => lead(300 + i, 'ITE', Math.floor(i / 12))),
    ...Array.from({ length: 22 }, (_, i) => lead(400 + i, 'PAC', Math.floor(i / 8))),
    ...Array.from({ length: 9 }, (_, i) => lead(500 + i, 'PPV', Math.floor(i / 4))),
  ].map(({ prenom, nom, telephone, email, ville, ...rest }, i) => ({ ...rest, en_vente: true, deja_transmis: i % 9 === 4, prix_ht: i % 9 === 4 ? rest.prix_ht - 5 : rest.prix_ht }));
  return { leads: mine, commandes: [pre, cmd, shopCmd], litiges, stock };
}
