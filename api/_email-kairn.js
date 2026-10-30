// Gabarit des e-mails d'accès à l'espace client (Ugo, 30/10/2026 : « un joli mail brandé de première connexion »).
// HTML en tableaux et styles en ligne (Gmail, Outlook, Apple Mail), DA Kairn : bandeau nuit, logo cairn, bouton bleu.
// Toujours accompagné d'une version texte. Le logo est servi par le site (public/logo-192.png).
import { SITE } from './_auth-admin.js';

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// mode « invite » : première connexion ; « recovery » : mot de passe oublié.
export function emailAcces({ mode, prenom, societe, lien }) {
  const invite = mode === 'invite';
  const sujet = invite ? 'Votre espace Kairn est prêt' : 'Choisissez un nouveau mot de passe Kairn';
  const bonjour = `Bonjour${prenom ? ` ${prenom}` : ''},`;
  const intro = invite
    ? `L’espace client${societe ? ` ${/^[aeiouyhâéèêîôûAEIOUYHÂÉÈÊÎÔÛ]/.test(societe) ? 'd’' : 'de '}${societe}` : ''} est ouvert. Il ne reste qu’une étape : choisir votre mot de passe.`
    : 'Vous avez demandé à changer le mot de passe de votre espace Kairn. Choisissez-en un nouveau avec le bouton ci-dessous.';
  const bouton = invite ? 'Choisir mon mot de passe' : 'Choisir un nouveau mot de passe';
  const points = [
    ['Vos contacts du jour', 'Chaque contact arrive dans votre espace dès qu’il vous est livré, prêt à appeler.'],
    ['Le suivi de chaque dossier', 'NRP, rendez-vous, devis, signé : tout est noté, avec vos rappels.'],
    ['Vos commandes', 'Livraisons, bons de commande et règlements au même endroit.'],
  ];
  const fin = invite
    ? `Ensuite, connectez-vous sur ${SITE.replace('https://', '')}/espace avec cette adresse e-mail.`
    : 'Si vous n’avez rien demandé, ignorez cet e-mail : votre mot de passe actuel reste valable.';

  const html = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${esc(sujet)}</title></head>
<body style="margin:0;padding:0;background:#EEF1F7;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(intro)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#EEF1F7;">
<tr><td align="center" style="padding:32px 16px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:#FFFFFF;border-radius:20px;overflow:hidden;border:1px solid #E1E6F0;">
    <tr><td style="background:#0B0918;background-image:linear-gradient(135deg,#0B0918 0%,#1B1A4A 100%);padding:28px 36px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
        <td style="vertical-align:middle;"><img src="${SITE}/logo-192.png" width="44" height="44" alt="" style="display:block;border:0;border-radius:12px;"></td>
        <td style="vertical-align:middle;padding-left:12px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:22px;font-weight:600;letter-spacing:-0.5px;color:#FFFFFF;">Kairn</td>
      </tr></table>
    </td></tr>
    <tr><td style="height:4px;line-height:4px;font-size:0;background:#2F5BEA;background-image:linear-gradient(90deg,#0EA5E9,#4F46E5);">&nbsp;</td></tr>
    <tr><td style="padding:36px 36px 8px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#0B0918;">
      <p style="margin:0 0 6px;font-size:12px;font-weight:600;letter-spacing:1.6px;text-transform:uppercase;color:#64748B;">${invite ? 'Espace client' : 'Mot de passe'}</p>
      <h1 style="margin:0 0 18px;font-size:28px;line-height:1.2;font-weight:600;letter-spacing:-0.8px;color:#0B0918;">${invite ? 'Bienvenue sur Kairn' : 'Nouveau mot de passe'}</h1>
      <p style="margin:0 0 10px;font-size:16px;line-height:1.6;color:#1E293B;">${esc(bonjour)}</p>
      <p style="margin:0 0 28px;font-size:16px;line-height:1.6;color:#334155;">${esc(intro)}</p>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-radius:14px;background:#2F5BEA;">
        <a href="${esc(lien)}" style="display:inline-block;padding:15px 22px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:16px;font-weight:600;color:#FFFFFF;text-decoration:none;border-radius:14px;white-space:nowrap;">${esc(bouton)}</a>
      </td></tr></table>
      <p style="margin:14px 0 0;font-size:13px;line-height:1.5;color:#64748B;">Lien personnel, à usage unique. Il ouvre votre espace sur ${esc(SITE.replace('https://', ''))}.</p>
    </td></tr>
    ${invite ? `<tr><td style="padding:28px 36px 4px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F5F7FB;border-radius:16px;">
        ${points.map(([t, d], i) => `<tr><td style="padding:${i === 0 ? '20px' : '4px'} 22px ${i === points.length - 1 ? '20px' : '12px'};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
            <td style="vertical-align:top;padding-top:2px;"><div style="width:22px;height:22px;border-radius:11px;background:#E3EAFE;color:#2F5BEA;font-size:13px;font-weight:700;line-height:22px;text-align:center;">${i + 1}</div></td>
            <td style="padding-left:12px;"><p style="margin:0;font-size:15px;font-weight:600;color:#0B0918;">${esc(t)}</p><p style="margin:2px 0 0;font-size:14px;line-height:1.5;color:#475569;">${esc(d)}</p></td>
          </tr></table>
        </td></tr>`).join('')}
      </table>
    </td></tr>` : ''}
    <tr><td style="padding:24px 36px 32px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
      <p style="margin:0 0 18px;font-size:14px;line-height:1.6;color:#475569;">${esc(fin)}</p>
      <p style="margin:0;font-size:13px;line-height:1.6;color:#94A3B8;">Le bouton ne marche pas ? Copiez ce lien dans votre navigateur :<br><a href="${esc(lien)}" style="color:#2F5BEA;word-break:break-all;">${esc(lien)}</a></p>
    </td></tr>
    <tr><td style="padding:20px 36px;border-top:1px solid #E1E6F0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;line-height:1.6;color:#94A3B8;">
      Kairn · Leads, sites et CRM · <a href="${SITE}" style="color:#94A3B8;">kairnagency.com</a><br>Une question ? Répondez simplement à cet e-mail.
    </td></tr>
  </table>
</td></tr></table>
</body></html>`;

  const texte = [bonjour, '', intro, '', `${bouton} :`, lien, '(lien personnel, à usage unique)', '', ...(invite ? points.map(([t, d]) => `• ${t} : ${d}`).concat('') : []), fin, '', 'Kairn · kairnagency.com'].join('\n');
  return { sujet, html, texte };
}
