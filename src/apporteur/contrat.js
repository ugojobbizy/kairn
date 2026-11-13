// Contrat d'apporteur d'affaires Kairn (13/11/2026). Module sans React : utilisé par l'écran de signature (/apporteur)
// et par la fonction serveur qui fige le texte, calcule son empreinte et génère le PDF (api/apporteur.js).
// Le texte signé est exactement celui que renvoie texteContrat() : la moindre modification change l'empreinte.
// Décisions d'Ugo (13/11/2026) : commission fixée client par client ; due seulement une fois la commande réglée, sans
// litige, sur un nombre exact de leads ; 12 mois de commission par client ; signature électronique simple, gratuite.
// Rédigé par Claude, à faire relire par un avocat avant usage large. Changer le texte = changer VERSION_CONTRAT.

export const VERSION_CONTRAT = 'v1 du 13/11/2026';
export const DUREE_COMMISSION_MOIS = 12;

export const FORMES = [
  ['micro', 'Entrepreneur individuel (micro-entreprise)'],
  ['ei', 'Entrepreneur individuel (régime réel)'],
  ['eurl', 'EURL'],
  ['sarl', 'SARL'],
  ['sasu', 'SASU'],
  ['sas', 'SAS'],
  ['sa', 'SA'],
  ['autre', 'Autre forme'],
];
export const libelleForme = (f, autre) => (f === 'autre' ? (autre || 'Société') : (FORMES.find(([k]) => k === f)?.[1] || ''));
export const estIndividuel = (f) => f === 'micro' || f === 'ei';

// Codes de nature juridique de l'INSEE (annuaire recherche-entreprises.api.gouv.fr) vers nos formes.
export function formeDepuisNature(code, entrepreneurIndividuel) {
  const c = String(code || '');
  if (entrepreneurIndividuel || c === '1000') return 'micro';
  if (c === '5498') return 'eurl';
  if (c.startsWith('54')) return 'sarl';
  if (c === '5720') return 'sasu';
  if (c.startsWith('57')) return 'sas';
  if (c.startsWith('55') || c.startsWith('56')) return 'sa';
  return 'autre';
}

// SIRET : 14 chiffres, clé de Luhn (La Poste, SIREN 356000000, fait exception).
export function siretValide(s) {
  const d = String(s || '').replace(/\s/g, '');
  if (!/^\d{14}$/.test(d)) return false;
  if (d.startsWith('356000000')) return d.split('').reduce((t, x) => t + Number(x), 0) % 5 === 0;
  let t = 0;
  for (let i = 0; i < 14; i++) { let n = Number(d[13 - i]); if (i % 2) { n *= 2; if (n > 9) n -= 9; } t += n; }
  return t % 10 === 0;
}

// IBAN : longueur et clé modulo 97.
export function ibanValide(s) {
  const v = String(s || '').replace(/\s/g, '').toUpperCase();
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{10,30}$/.test(v)) return false;
  const r = (v.slice(4) + v.slice(0, 4)).replace(/[A-Z]/g, (c) => String(c.charCodeAt(0) - 55));
  let m = 0;
  for (const ch of r) m = (m * 10 + Number(ch)) % 97;
  return m === 1;
}
export const ibanLisible = (s) => String(s || '').replace(/\s/g, '').toUpperCase().replace(/(.{4})/g, '$1 ').trim();

// Champs de l'apporteur exigés avant la signature. Rend la liste des manques (vide = prêt).
export function manquesApporteur(a) {
  const m = [];
  if (!a.forme) m.push('forme juridique');
  if (a.forme === 'autre' && !String(a.forme_autre || '').trim()) m.push('forme juridique (précisez)');
  if (!String(a.raison_sociale || '').trim()) m.push(estIndividuel(a.forme) ? 'nom commercial ou nom' : 'dénomination');
  if (!siretValide(a.siret)) m.push('SIRET valide');
  if (!String(a.adresse || '').trim() || !/^\d{5}$/.test(String(a.code_postal || '').trim()) || !String(a.ville || '').trim()) m.push('adresse complète');
  if (!String(a.prenom || '').trim() || !String(a.nom || '').trim()) m.push('prénom et nom');
  if (!estIndividuel(a.forme) && !String(a.representant_qualite || '').trim()) m.push('qualité du signataire');
  if (!String(a.telephone || '').replace(/\D/g, '').match(/^\d{9,}$/)) m.push('téléphone');
  if (a.tva_regime !== 'franchise' && a.tva_regime !== 'assujetti') m.push('régime de TVA');
  if (a.tva_regime === 'assujetti' && !/^FR[0-9A-Z]{2}\d{9}$/.test(String(a.tva_numero || '').replace(/\s/g, '').toUpperCase())) m.push('numéro de TVA intracommunautaire');
  if (!ibanValide(a.iban)) m.push('IBAN valide');
  if (!String(a.titulaire_iban || '').trim()) m.push('titulaire du compte');
  return m;
}

export function manquesKairn(k) {
  if (!k) return ['identité de Kairn'];
  const m = [];
  for (const [c, t] of [['nom_legal', 'nom légal'], ['forme', 'forme juridique'], ['siret', 'SIRET'], ['adresse', 'adresse'], ['signataire', 'signataire'], ['qualite', 'qualité du signataire'], ['ville_tribunal', 'ville du tribunal compétent']]) {
    if (!String(k[c] || '').trim()) m.push(t);
  }
  if (k.siret && !siretValide(k.siret)) m.push('SIRET valide');
  return m;
}

const siren = (s) => String(s || '').replace(/\s/g, '').slice(0, 9);
const espSiret = (s) => String(s || '').replace(/\s/g, '').replace(/^(\d{3})(\d{3})(\d{3})(\d{5})$/, '$1 $2 $3 $4');

// Désignation des parties.
function partieApporteur(a) {
  const adresse = `${a.adresse}, ${a.code_postal} ${a.ville}`;
  if (estIndividuel(a.forme)) {
    return `${a.prenom} ${a.nom}, entrepreneur individuel${a.raison_sociale && a.raison_sociale.trim().toLowerCase() !== `${a.prenom} ${a.nom}`.toLowerCase() ? ` exerçant sous le nom commercial « ${a.raison_sociale} »` : ''}, immatriculé sous le numéro SIRET ${espSiret(a.siret)}, domicilié professionnellement ${adresse}`;
  }
  return `${a.raison_sociale}, ${libelleForme(a.forme, a.forme_autre)}, immatriculée sous le numéro SIREN ${siren(a.siret)} (SIRET ${espSiret(a.siret)}), dont le siège est situé ${adresse}, représentée par ${a.prenom} ${a.nom}, en qualité de ${a.representant_qualite}`;
}
function partieKairn(k) {
  return `${k.nom_legal}, ${k.forme}, immatriculé(e) sous le numéro SIRET ${espSiret(k.siret)}, dont le siège est situé ${k.adresse}, représenté(e) par ${k.signataire}, en qualité de ${k.qualite}`;
}

// Le contrat, en sections. k : identité de Kairn (table kairn_parametres) ; a : fiche de l'apporteur.
export function sectionsContrat(k, a) {
  const D = DUREE_COMMISSION_MOIS;
  const tva = a.tva_regime === 'franchise'
    ? 'L’Apporteur déclare bénéficier de la franchise en base de TVA (article 293 B du Code général des impôts) : ses factures portent la mention « TVA non applicable, art. 293 B du CGI ».'
    : `L’Apporteur déclare être assujetti à la TVA sous le numéro ${String(a.tva_numero || '').replace(/\s/g, '').toUpperCase()} : ses factures ajoutent la TVA au taux en vigueur aux commissions, exprimées hors taxes.`;
  return {
    titre: 'Contrat d’apporteur d’affaires',
    parties: [
      ['Entre', `${partieKairn(k)}, ci-après « Kairn »,`],
      ['Et', `${partieApporteur(a)}, ci-après « l’Apporteur »,`],
      ['', 'ci-après ensemble « les Parties ».'],
    ],
    articles: [
      ['Préambule', [
        'Kairn exerce une activité de génération de leads : elle vend à des professionnels, notamment de la rénovation énergétique, des contacts de particuliers ayant demandé à être rappelés. L’Apporteur dispose d’un réseau de professionnels susceptibles de devenir clients de Kairn. Les Parties souhaitent encadrer la mise en relation de ces professionnels avec Kairn.',
      ]],
      ['Article 1. Objet', [
        'L’Apporteur présente à Kairn des entreprises susceptibles de lui acheter des leads. Sa mission se limite à cette mise en relation. Il ne négocie pas, ne fixe aucun prix, ne conclut aucun contrat, ne reçoit aucun paiement et ne prend aucun engagement au nom ou pour le compte de Kairn. Il n’est ni agent commercial, ni mandataire, ni salarié de Kairn.',
        'Le présent contrat n’est pas exclusif : chacune des Parties reste libre de travailler avec d’autres partenaires.',
      ]],
      ['Article 2. Indépendance', [
        'L’Apporteur exerce en professionnel indépendant. Il organise librement son activité, ses horaires et ses moyens, sans lien de subordination avec Kairn et sans objectif imposé. Il supporte seul ses frais, qui ne lui sont pas remboursés.',
        'Il est seul responsable de ses obligations sociales, fiscales et déclaratives. Lorsque les sommes dues au titre du contrat atteignent 5 000 euros hors taxes sur une année, il remet à Kairn, à sa demande et au moins tous les six mois, une attestation de vigilance de l’URSSAF (article L. 8222-1 du Code du travail).',
      ]],
      ['Article 3. Client apporté', [
        'Est un « Client apporté » toute entreprise présentée par l’Apporteur que Kairn accepte et rattache à l’Apporteur dans l’espace apporteur de la plateforme Kairn (l’« Espace apporteur »). Kairn reste libre de ne pas donner suite à une présentation, sans avoir à se justifier.',
        'N’est pas un Client apporté une entreprise déjà cliente de Kairn, ou en discussion commerciale avec elle, dans les six mois précédant la présentation. Si une même entreprise est présentée par plusieurs apporteurs, elle est rattachée au premier qui l’a présentée par écrit.',
      ]],
      ['Article 4. Commission', [
        'Pour chaque Client apporté, Kairn fixe une commission, en euros hors taxes par lead, et l’affiche dans l’Espace apporteur avant toute commande prise en compte. L’Apporteur qui conteste ce montant le signale par écrit dans les quinze jours de son affichage ; à défaut, il est réputé l’avoir accepté. Un changement de montant ne vaut que pour les commandes approuvées après ce changement.',
        `La commission est due sur les commandes du Client apporté approuvées par Kairn pendant les ${D} mois qui suivent la première commande approuvée de ce client. Elle est calculée par commande : nombre de leads livrés au Client apporté et non annulés, multiplié par la commission par lead. Un lead annulé à la suite d’une réclamation acceptée (doublon, hors zone) n’est pas compté ; le lead livré en remplacement est compté une seule fois.`,
        'La commission d’une commande devient exigible lorsque, cumulativement : la commande est entièrement livrée, le Client apporté l’a intégralement réglée à Kairn, et aucune réclamation n’est en cours sur cette commande. Aucune commission n’est due sur une somme que Kairn n’a pas encaissée. Si une somme encaissée est ensuite remboursée au Client apporté, la commission correspondante est déduite des commissions suivantes ou restituée.',
        'L’Espace apporteur indique pour chaque commande le nombre de leads comptés, le montant de la commission et son état (en cours, à payer, versée). Il fait foi entre les Parties, sauf erreur signalée par écrit dans les trente jours.',
      ]],
      ['Article 5. Facturation et paiement', [
        'L’Apporteur adresse à Kairn, au plus une fois par mois, une facture du montant des commissions affichées « à payer » dans l’Espace apporteur, conforme aux règles de facturation en vigueur et adressée à l’identité de Kairn figurant en tête du présent contrat.',
        tva,
        `Kairn règle chaque facture conforme par virement, dans les trente jours de sa réception, sur le compte bancaire indiqué par l’Apporteur (IBAN ${ibanLisible(a.iban)}, titulaire ${a.titulaire_iban}). L’Apporteur informe Kairn par écrit de tout changement de compte. Tout retard de paiement entraîne les pénalités et l’indemnité forfaitaire prévues par l’article L. 441-10 du Code de commerce.`,
      ]],
      ['Article 6. Obligations de l’Apporteur', [
        'L’Apporteur agit loyalement. Il présente Kairn de façon exacte, sans promesse sur les prix, les volumes ou les résultats, et sans se présenter comme son représentant. Il n’utilise ni la marque, ni le logo, ni les contenus de Kairn sans son accord écrit.',
        'Il respecte la réglementation applicable à sa prospection, notamment en matière de démarchage et de protection des données personnelles. Il ne transmet à Kairn les coordonnées d’une personne qu’avec son accord.',
      ]],
      ['Article 7. Espace apporteur et confidentialité', [
        'Kairn ouvre à l’Apporteur un accès personnel à l’Espace apporteur. L’Apporteur garde ses identifiants secrets et répond de leur usage.',
        'Les informations obtenues par l’Apporteur sur Kairn, ses clients, ses prix, ses volumes et ses méthodes sont confidentielles. Il ne les utilise que pour l’exécution du présent contrat et ne les communique à personne, pendant toute sa durée et deux ans après sa fin.',
      ]],
      ['Article 8. Durée et fin du contrat', [
        'Le contrat prend effet à sa signature, pour une durée indéterminée. Chaque Partie peut y mettre fin à tout moment par écrit, courrier électronique compris, avec un préavis d’un mois. En cas de manquement grave de l’autre Partie, elle peut y mettre fin sans préavis, par écrit motivé.',
        `À la fin du contrat, les commissions restent dues, aux conditions de l’article 4, sur les commandes approuvées avant la date de fin, dans la limite de la période de ${D} mois propre à chaque Client apporté. Aucune autre somme ni indemnité n’est due à l’Apporteur du fait de la fin du contrat. L’accès à l’Espace apporteur reste ouvert le temps de régler ces commissions.`,
      ]],
      ['Article 9. Données personnelles', [
        'Kairn traite les données de l’Apporteur (identité, coordonnées, données bancaires, historique de commissions) pour exécuter le contrat et respecter ses obligations comptables et fiscales. Elles sont conservées pendant la durée du contrat puis le temps des prescriptions légales. L’Apporteur peut exercer ses droits d’accès, de rectification et d’opposition en écrivant à Kairn.',
      ]],
      ['Article 10. Preuve et signature électronique', [
        'Les Parties conviennent que le contrat est signé par voie électronique (articles 1366 et 1367 du Code civil). L’Apporteur signe dans l’Espace apporteur après s’être identifié ; Kairn conserve le texte signé, son empreinte numérique, la date et l’heure, l’adresse IP et la signature tracée, qui font preuve de son consentement. Un exemplaire au format PDF est adressé aux deux Parties.',
      ]],
      ['Article 11. Droit applicable et litiges', [
        `Le contrat est soumis au droit français. Les Parties recherchent d’abord une solution amiable. À défaut d’accord dans un délai d’un mois, tout litige relève des tribunaux compétents de ${k.ville_tribunal}.`,
      ]],
    ],
  };
}

// Texte brut figé : c'est lui qui est signé, haché et imprimé dans le PDF.
export function texteContrat(k, a) {
  const s = sectionsContrat(k, a);
  const lignes = [s.titre.toUpperCase(), `Version ${VERSION_CONTRAT}`, ''];
  for (const [t, p] of s.parties) lignes.push(t ? `${t} : ${p}` : p);
  for (const [t, ps] of s.articles) { lignes.push('', t, ...ps); }
  return lignes.join('\n');
}
