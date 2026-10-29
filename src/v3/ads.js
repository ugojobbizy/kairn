// Pubs Meta montrées sur la V2 (bande courbe et couloir). Images dans public/ads/, réduites à 720 px depuis
// ~/Desktop/campagnes (CAMPAGNE ETANE/ads pour Isolation d'Aquitaine, META OIHAN pour Sud Ouest Isolation), le 28/10/2026.
// Écartées : les créas qui imitent un article de presse ou un bandeau télé.
const IA = 'Isolation d’Aquitaine · murs par l’extérieur';
const SOI = 'Sud Ouest Isolation · combles';
export const ADS = [
  ['Vrai ou faux ?', IA], ['Combien coûte l’isolation de vos murs ?', IA], ['Ce qu’on pose sur vos murs', IA], ['Le ticket à 1 €', IA],
  ['Isoler le toit sans les murs', IA], ['Ne refaites pas votre crépi', IA], ['Ce mur vous coûte de l’argent', IA], ['Arrêtez de chauffer la rue', IA],
  ['Combles perdus = 1 €', SOI], ['Avant, après : 30 cm', SOI], ['Arnaque ou pas ?', SOI], ['On vous appelle ? Raccrochez.', SOI],
  ['La conversation', SOI], ['Votre chaleur part par là', SOI], ['Aucune condition de revenus', SOI], ['Déjà un peu de laine ?', SOI],
  ['Le ticket détaillé', SOI], ['Vrai ou faux : c’est fini ?', SOI],
].map(([titre, secteur], i) => ({ src: `/ads/pub-${String(i + 1).padStart(2, '0')}.jpg`, tag: 'Pub Meta', titre, secteur }));
