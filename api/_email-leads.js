// E-mail d'alerte « nouveau contact » (bloc 1 « vitesse et relance », 12/11/2026 ; Ugo : alertes par e-mail seulement pour
// l'instant). Même DA que les e-mails d'accès (api/_email-kairn.js) : tableaux et styles en ligne, logo joint (cid:logo-kairn).
// Chaque contact porte son téléphone cliquable et l'heure limite de rappel (5 jours ouvrables, src/espace/relance.js).
import { dernierAppel } from '../src/espace/relance.js';

const THEMES = { PAC: 'Pompe à chaleur', ITE: 'Isolation extérieure', PPV: 'Photovoltaïque' };
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";

// Les serveurs tournent en UTC : on calcule sur l'heure murale de Paris (une date « locale » qui porte l'heure de Paris).
function heureParis(d) {
  const s = new Date(d).toLocaleString('sv-SE', { timeZone: 'Europe/Paris' });
  return new Date(s.replace(' ', 'T'));
}
function limite(l) {
  const dem = l.recu_le || l.livre_le;
  if (!dem) return '';
  const fin = dernierAppel(heureParis(dem));
  return fin ? fin.toLocaleString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }).replace(':', ' h ').replace(' h 00', ' h') : '';
}
const telHref = (t) => `tel:${String(t || '').replace(/[^\d+]/g, '')}`;

export function emailLeads({ titre, leads, site, test }) {
  const lien = `${site}/espace/prospects?vue=journee`;
  const liste = leads.slice(0, 20);
  const intro = leads.length === 1 ? 'Un particulier vient de demander à être rappelé. Appelez-le maintenant, pendant qu’il attend votre appel.'
    : `${leads.length} particuliers viennent de demander à être rappelés. Appelez-les maintenant, pendant qu’ils attendent votre appel.`;
  const carte = (l) => {
    const nom = [l.prenom, l.nom].filter(Boolean).join(' ') || 'Contact';
    const lieu = [l.code_postal, l.ville].filter(Boolean).join(' ');
    const details = [l.statut_occupation, l.type_logement, l.chauffage, l.surface].filter(Boolean).join(' · ');
    const lim = limite(l);
    return `<tr><td style="padding:0 0 10px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #E1E6F0;border-radius:14px;">
      <tr><td style="padding:14px 16px;font-family:${FONT};">
        <p style="margin:0;font-size:16px;font-weight:600;color:#0B0918;">${esc(nom)}</p>
        <p style="margin:2px 0 0;font-size:14px;color:#475569;">${esc(THEMES[l.thematique] || l.thematique || '')}${lieu ? ` · ${esc(lieu)}` : ''}</p>
        ${details ? `<p style="margin:4px 0 0;font-size:13px;color:#64748B;">${esc(details)}</p>` : ''}
        ${l.telephone ? `<p style="margin:10px 0 0;"><a href="${esc(telHref(l.telephone))}" style="display:inline-block;padding:9px 14px;border-radius:10px;background:#2F5BEA;color:#FFFFFF;font-size:15px;font-weight:600;text-decoration:none;">Appeler le ${esc(l.telephone)}</a></p>` : ''}
        ${lim ? `<p style="margin:10px 0 0;font-size:12.5px;color:#B45309;">À rappeler au plus tard ${esc(lim)} (5 jours ouvrables après sa demande).</p>` : ''}
      </td></tr></table></td></tr>`;
  };
  const html = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${esc(titre)}</title></head>
<body style="margin:0;padding:0;background:#EEF1F7;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(intro)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#EEF1F7;">
<tr><td align="center" style="padding:28px 14px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:#FFFFFF;border-radius:20px;overflow:hidden;border:1px solid #E1E6F0;">
    <tr><td style="background:#0B0918;background-image:linear-gradient(135deg,#0B0918 0%,#1B1A4A 100%);padding:22px 28px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
        <td style="vertical-align:middle;"><img src="cid:logo-kairn" width="36" height="36" alt="" style="display:block;border:0;border-radius:10px;"></td>
        <td style="vertical-align:middle;padding-left:10px;font-family:${FONT};font-size:19px;font-weight:600;color:#FFFFFF;">Kairn</td>
      </tr></table>
    </td></tr>
    <tr><td style="height:4px;line-height:4px;font-size:0;background:#2F5BEA;background-image:linear-gradient(90deg,#0EA5E9,#4F46E5);">&nbsp;</td></tr>
    <tr><td style="padding:28px 28px 8px;font-family:${FONT};">
      <h1 style="margin:0 0 10px;font-size:24px;line-height:1.25;font-weight:600;letter-spacing:-0.5px;color:#0B0918;">${esc(titre)}</h1>
      <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#334155;">${esc(intro)}</p>
    </td></tr>
    <tr><td style="padding:0 28px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${liste.map(carte).join('')}</table>
      ${leads.length > 20 ? `<p style="margin:0 0 10px;font-family:${FONT};font-size:14px;color:#475569;">… et ${leads.length - 20} autres dans votre espace.</p>` : ''}
    </td></tr>
    <tr><td style="padding:10px 28px 28px;font-family:${FONT};">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-radius:14px;background:#0B0918;">
        <a href="${esc(lien)}" style="display:inline-block;padding:14px 20px;font-family:${FONT};font-size:15px;font-weight:600;color:#FFFFFF;text-decoration:none;border-radius:14px;">Ouvrir Ma journée</a>
      </td></tr></table>
      <p style="margin:14px 0 0;font-size:13px;line-height:1.6;color:#64748B;">Après l’appel, notez « Pas de réponse » ou « Il a répondu » : la relance suivante se programme toute seule.</p>
      ${test ? '<p style="margin:14px 0 0;font-size:13px;color:#94A3B8;">Ceci est un e-mail de test : ce contact n’existe pas.</p>' : ''}
    </td></tr>
    <tr><td style="padding:18px 28px;border-top:1px solid #E1E6F0;font-family:${FONT};font-size:12px;line-height:1.6;color:#94A3B8;">
      Kairn · <a href="${site}" style="color:#94A3B8;">kairnagency.com</a> · Pour changer les adresses prévenues : Mon compte, dans votre espace.
    </td></tr>
  </table>
</td></tr></table>
</body></html>`;
  const texte = [`${titre}.`, '', intro, '',
    ...liste.flatMap((l) => [`• ${[l.prenom, l.nom].filter(Boolean).join(' ') || 'Contact'} · ${l.telephone || ''} · ${[l.code_postal, l.ville].filter(Boolean).join(' ')} · ${THEMES[l.thematique] || l.thematique || ''}`, limite(l) ? `  À rappeler au plus tard ${limite(l)}.` : null].filter(Boolean)),
    leads.length > 20 ? `… et ${leads.length - 20} autres.` : null, '', `Ma journée : ${lien}`, test ? '\n(Ceci est un e-mail de test.)' : null].filter((x) => x !== null).join('\n');
  return { sujet: titre, html, texte };
}
