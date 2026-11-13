// PDF du contrat d'apporteur d'affaires (13/11/2026), avec pdf-lib (polices standard, sans fichier externe).
// Toujours regénéré à l'identique depuis la ligne figée de apporteur_contrats : texte, empreinte, signatures, date, IP.
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const W = 595.28;
const H = 841.89;
const M = 56;
const INK = rgb(0.05, 0.04, 0.1);
const MUTED = rgb(0.4, 0.42, 0.5);

// Les polices standard ne savent écrire que le jeu WinAnsi : on remplace le reste (espaces fines, etc.).
const propre = (s) => String(s ?? '')
  .replace(/[   ]/g, ' ')
  .replace(/[‐-–]/g, '-')
  .replace(/[^\x20-\x7e -ÿ‘’“”•…€Œœ]/g, '');

export const dateParis = (d) => new Date(d).toLocaleString('fr-FR', { timeZone: 'Europe/Paris', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });

function decouper(texte, font, size, largeur) {
  const lignes = [];
  // Les guillemets restent collés à leur mot (jamais un « seul en fin de ligne).
  for (const para of propre(texte).replace(/« /g, '«\u0001').replace(/ »/g, '\u0001»').split('\n')) {
    if (!para) { lignes.push(''); continue; }
    let l = '';
    for (const mot of para.split(' ').map((x) => x.replace(/\u0001/g, ' '))) {
      const essai = l ? `${l} ${mot}` : mot;
      if (font.widthOfTextAtSize(essai, size) > largeur && l) { lignes.push(l); l = mot; } else l = essai;
    }
    lignes.push(l);
  }
  return lignes;
}

async function image(pdf, dataUrl) {
  const m = /^data:image\/png;base64,(.+)$/.exec(String(dataUrl || ''));
  if (!m) return null;
  try { return await pdf.embedPng(Buffer.from(m[1], 'base64')); } catch { return null; }
}

// c : ligne apporteur_contrats.
export async function pdfContrat(c) {
  const pdf = await PDFDocument.create();
  pdf.setTitle('Contrat d’apporteur d’affaires Kairn');
  pdf.setCreator('Kairn');
  const reg = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const largeur = W - 2 * M;
  let page = pdf.addPage([W, H]);
  let y = H - M;
  const place = (h) => { if (y - h < M + 24) { page = pdf.addPage([W, H]); y = H - M; } };

  const lignes = String(c.texte).split('\n');
  lignes.forEach((brut, i) => {
    const titre = i === 0;
    const article = /^(Article \d+\.|Préambule)/.test(brut);
    const font = titre || article ? bold : reg;
    const size = titre ? 16 : article ? 11 : 10;
    const color = i === 1 ? MUTED : INK;
    if (article) y -= 4;
    for (const l of decouper(brut, font, size, largeur)) {
      const h = size * 1.45;
      place(h);
      if (l) page.drawText(l, { x: M, y: y - size, size, font, color });
      y -= l ? h : size * 0.6;
    }
    if (titre) y -= 6;
  });

  // Bloc des signatures.
  const sigA = await image(pdf, c.signature_png);
  const sigK = await image(pdf, c.kairn_signature_png);
  place(190);
  y -= 18;
  page.drawText(propre('Fait par voie électronique, en deux exemplaires PDF.'), { x: M, y: y - 10, size: 10, font: reg, color: INK });
  y -= 28;
  const col = largeur / 2 - 10;
  const bloc = (x, titre, lignesB, sig) => {
    let yy = y;
    page.drawText(propre(titre), { x, y: yy - 11, size: 11, font: bold, color: INK });
    yy -= 18;
    for (const l of lignesB) for (const s of decouper(l, reg, 9, col)) { page.drawText(s, { x, y: yy - 9, size: 9, font: reg, color: MUTED }); yy -= 13; }
    if (sig) {
      const dim = sig.scaleToFit(col, 70);
      page.drawImage(sig, { x, y: yy - dim.height - 4, width: dim.width, height: dim.height });
    }
  };
  bloc(M, 'Pour Kairn', [c.kairn_signataire || '', `Accepté le ${dateParis(c.signe_le)}`, 'Signature électronique simple'], sigK);
  bloc(M + col + 20, 'L’Apporteur', [c.nom_signataire, `Signé le ${dateParis(c.signe_le)} (heure de Paris)`, `Adresse IP : ${c.ip || 'inconnue'}`, '« Lu et approuvé », signature électronique simple'], sigA);

  // Pied de page : version, empreinte, numéro de page.
  const pages = pdf.getPages();
  pages.forEach((p, i) => {
    const pied = propre(`Contrat d’apporteur d’affaires · ${c.version} · empreinte SHA-256 du texte : ${c.empreinte} · page ${i + 1}/${pages.length}`);
    for (const [j, l] of decouper(pied, reg, 6.5, largeur).entries()) p.drawText(l, { x: M, y: 30 - j * 9, size: 6.5, font: reg, color: MUTED });
  });
  return Buffer.from(await pdf.save());
}
