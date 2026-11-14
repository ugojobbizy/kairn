// Relevé des commissions à facturer (14/11/2026) : l'apporteur facture Kairn (décision d'Ugo, 13/11/2026), ce PDF lui dit
// quoi mettre sur sa facture : les commandes « À payer », le total HT, la TVA ou la mention de franchise, l'identité de Kairn.
// Ce n'est pas une facture. pdf-lib, polices standard (même principe que _contrat-pdf.js).
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { libelleForme } from '../src/apporteur/contrat.js';

const W = 595.28;
const H = 841.89;
const M = 48;
const INK = rgb(0.05, 0.04, 0.1);
const MUTED = rgb(0.4, 0.42, 0.5);
const LINE = rgb(0.85, 0.87, 0.9);

const propre = (s) => String(s ?? '')
  .replace(/[   ]/g, ' ')
  .replace(/[‐-—]/g, '-')
  .replace(/[^\x20-\x7e -ÿ‘’“”•…€Œœ]/g, '');
const eur = (n) => `${Number(n || 0).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/[  ]/g, ' ')} €`;
const jour = (d) => new Date(d).toLocaleDateString('fr-FR', { timeZone: 'Europe/Paris' });
const espSiret = (s) => String(s || '').replace(/\s/g, '').replace(/^(\d{3})(\d{3})(\d{3})(\d{5})$/, '$1 $2 $3 $4');

// Taux normal de TVA en France métropolitaine (20 %), appliqué aux commissions d'un apporteur assujetti.
export const TAUX_TVA = 0.2;

export function totauxReleve(a, lignes) {
  const ht = Math.round(lignes.reduce((s, l) => s + Number(l.montant || 0), 0) * 100) / 100;
  const tva = a.tva_regime === 'assujetti' ? Math.round(ht * TAUX_TVA * 100) / 100 : 0;
  return { ht, tva, ttc: Math.round((ht + tva) * 100) / 100 };
}

// a : fiche apporteurs ; k : kairn_parametres ; lignes : commission_lignes « a_payer » ; contratLe : date de signature.
export async function pdfReleve({ a, k, lignes, contratLe, contact }) {
  const pdf = await PDFDocument.create();
  pdf.setTitle('Relevé des commissions à facturer · Kairn');
  pdf.setCreator('Kairn');
  const reg = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  let page = pdf.addPage([W, H]);
  let y = H - M;
  const txt = (s, x, yy, o = {}) => page.drawText(propre(s), { x, y: yy, size: o.size || 9.5, font: o.bold ? bold : reg, color: o.color || INK });
  const droite = (s, xr, yy, o = {}) => { const t = propre(s); const f = o.bold ? bold : reg; txt(t, xr - f.widthOfTextAtSize(t, o.size || 9.5), yy, o); };
  const nouvellePageSi = (h) => { if (y - h < M + 30) { page = pdf.addPage([W, H]); y = H - M; return true; } return false; };

  txt('Relevé des commissions à facturer', M, y - 18, { size: 18, bold: true });
  y -= 34;
  txt(`Établi le ${jour(new Date())} · ce document n’est pas une facture : il indique ce que vous pouvez facturer à Kairn.`, M, y, { size: 9, color: MUTED });
  y -= 30;

  // Deux blocs : votre facture est adressée à… / émise par…
  const col = (W - 2 * M - 20) / 2;
  const bloc = (x, titre, lignesB) => {
    let yy = y;
    txt(titre, x, yy, { size: 8.5, bold: true, color: MUTED });
    yy -= 15;
    for (const [i, l] of lignesB.filter(Boolean).entries()) { txt(l, x, yy, { size: 9.5, bold: i === 0 }); yy -= 13; }
    return yy;
  };
  const kairnL = [k.nom_legal, k.forme, k.adresse, `SIRET ${espSiret(k.siret)}`];
  const apL = [
    a.raison_sociale || `${a.prenom} ${a.nom}`,
    libelleForme(a.forme, a.forme_autre),
    `${a.adresse}, ${a.code_postal} ${a.ville}`,
    `SIRET ${espSiret(a.siret)}`,
    a.tva_regime === 'assujetti' ? `TVA ${a.tva_numero}` : 'TVA non applicable, art. 293 B du CGI',
  ];
  const y1 = bloc(M, 'FACTURE À ADRESSER À', kairnL);
  const y2 = bloc(M + col + 20, 'ÉMISE PAR (VOUS)', apL);
  y = Math.min(y1, y2) - 18;

  // Tableau des commandes.
  const cols = [M, M + 68, M + 210, M + 340, M + 415, W - M];
  const entete = () => {
    page.drawRectangle({ x: M, y: y - 6, width: W - 2 * M, height: 20, color: rgb(0.96, 0.97, 0.98) });
    txt('Date', cols[0] + 4, y, { size: 8.5, bold: true });
    txt('Client', cols[1], y, { size: 8.5, bold: true });
    txt('Commande', cols[2], y, { size: 8.5, bold: true });
    droite('Leads', cols[3], y, { size: 8.5, bold: true });
    droite('Par lead HT', cols[4], y, { size: 8.5, bold: true });
    droite('Commission HT', cols[5] - 4, y, { size: 8.5, bold: true });
    y -= 22;
  };
  entete();
  for (const l of lignes) {
    if (nouvellePageSi(18)) entete();
    const client = propre(l.societe || '');
    txt(jour(l.approuve_le), cols[0] + 4, y);
    txt(client.length > 26 ? `${client.slice(0, 25)}…` : client, cols[1], y);
    txt(l.bdc_numero || '', cols[2], y);
    droite(String(l.leads), cols[3], y);
    droite(eur(l.taux), cols[4], y);
    droite(eur(l.montant), cols[5] - 4, y);
    y -= 8;
    page.drawLine({ start: { x: M, y }, end: { x: W - M, y }, thickness: 0.5, color: LINE });
    y -= 12;
  }

  // Totaux.
  const t = totauxReleve(a, lignes);
  nouvellePageSi(80);
  y -= 6;
  const tot = (lib, v, b) => { txt(lib, W - M - 230, y, { bold: b }); droite(v, W - M - 4, y, { bold: b }); y -= 16; };
  tot('Total HT', eur(t.ht), true);
  if (a.tva_regime === 'assujetti') { tot(`TVA ${TAUX_TVA * 100} %`, eur(t.tva)); tot('Total TTC', eur(t.ttc), true); }
  else { txt('TVA non applicable, art. 293 B du CGI', W - M - 230, y, { size: 8.5, color: MUTED }); y -= 16; }

  // Ce que la facture doit contenir.
  y -= 14;
  nouvellePageSi(170);
  txt('Votre facture', M, y, { size: 11, bold: true });
  y -= 16;
  const points = [
    'Un numéro de facture unique et chronologique, et sa date.',
    'Votre identité et celle de Kairn, telles qu’elles figurent ci-dessus (SIRET, adresse).',
    `Désignation : « Commissions d’apport d’affaires, contrat signé le ${jour(contratLe)} », avec la liste des commandes ci-dessus.`,
    a.tva_regime === 'assujetti' ? 'Le total HT, la TVA et le total TTC ; votre numéro de TVA intracommunautaire.' : 'Le total, avec la mention « TVA non applicable, art. 293 B du CGI ».',
    'L’échéance : paiement par virement sous 30 jours ; les pénalités de retard et l’indemnité forfaitaire de 40 € pour frais de recouvrement.',
    `À envoyer à ${contact}. Une facture par mois au plus. Les montants « En cours » ne se facturent pas encore.`,
  ];
  for (const p of points) {
    const mots = propre(p).split(' ');
    let l = '';
    const lignesP = [];
    for (const m of mots) { const e = l ? `${l} ${m}` : m; if (reg.widthOfTextAtSize(e, 9) > W - 2 * M - 14 && l) { lignesP.push(l); l = m; } else l = e; }
    lignesP.push(l);
    lignesP.forEach((s, i) => { if (i === 0) txt('•', M, y, { size: 9 }); txt(s, M + 12, y, { size: 9 }); y -= 12.5; });
    y -= 2;
  }

  const pages = pdf.getPages();
  pages.forEach((p, i) => p.drawText(propre(`Relevé établi depuis l’espace apporteur Kairn · page ${i + 1}/${pages.length}`), { x: M, y: 28, size: 7, font: reg, color: MUTED }));
  return Buffer.from(await pdf.save());
}
