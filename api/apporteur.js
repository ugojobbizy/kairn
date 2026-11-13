// POST /api/apporteur : apporteurs d'affaires (Ugo, 13/11/2026). Une seule fonction pour deux actions
// (le forfait Vercel limite le nombre de fonctions serveur) :
//   { action: 'candidature', prenom, nom, societe?, email, telephone, siret?, message?, website }
//     page publique /devenir-apporteur : enregistrée par la fonction SQL site_candidature_apporteur
//     (table illisible avec la clé publique), puis alerte Telegram à Ugo, qui valide dans Kairn Admin.
//   { action: 'ouvrir', id } ou { action: 'ouvrir', email, nom, prenom?, societe?, telephone?, siret? }
//     Kairn Admin, avec l'en-tête Authorization: Bearer <jeton admin> : valide une candidature (ou renvoie l'accès),
//     ou crée directement un apporteur. Même schéma que api/client-ouvrir.js : crée le compte de connexion s'il
//     n'existe pas, relie la fiche apporteurs (user_id, statut actif) et envoie l'e-mail où il choisit son mot de passe.
//     Rend aussi le lien, à copier si l'e-mail ne part pas.
import { send, readJson } from './_calendar.js';
import { telegram } from './_telegram.js';
import { SUPABASE_URL, SUPABASE_KEY, serviceKey, adminFetch, lienAcces, envoyerEmail } from './_auth-admin.js';
import { emailAcces } from './_email-kairn.js';
import { pdfContrat, dateParis } from './_contrat-pdf.js';
import { texteContrat, manquesApporteur, manquesKairn, VERSION_CONTRAT } from '../src/apporteur/contrat.js';
import { createHash } from 'node:crypto';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const UUID = /^[0-9a-f-]{36}$/i;
const clean = (v, max) => { const s = String(v ?? '').trim(); return s ? s.slice(0, max) : null; };

export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'method_not_allowed' });
  let body;
  // La signature tracée (image) dépasse la petite limite par défaut.
  try { body = await readJson(req, 400000); } catch { return send(res, 400, { error: 'bad_body' }); }
  if (body.action === 'candidature') return candidature(req, res, body);
  if (body.action === 'ouvrir') return ouvrir(req, res, body);
  if (body.action === 'signer') return signer(req, res, body);
  if (body.action === 'pdf') return pdf(req, res, body);
  return send(res, 400, { error: 'bad_action' });
}

async function candidature(req, res, body) {
  // Champ piège invisible : un humain le laisse vide.
  if (body.website) return send(res, 200, { ok: true });

  const nom = clean(body.nom, 120);
  const prenom = clean(body.prenom, 100);
  if (!nom || !prenom) return send(res, 400, { error: 'missing_fields' });
  const email = clean(body.email, 200)?.toLowerCase();
  if (!email || !EMAIL.test(email)) return send(res, 400, { error: 'bad_email' });
  const telephone = String(body.telephone || '').replace(/[^\d+]/g, '');
  if (telephone.replace(/\D/g, '').length < 8 || telephone.length > 20) return send(res, 400, { error: 'bad_phone' });
  const siret = clean(String(body.siret || '').replace(/\s/g, ''), 20);
  if (siret && !/^\d{14}$/.test(siret)) return send(res, 400, { error: 'bad_siret' });
  const societe = clean(body.societe, 120);
  const message = clean(body.message, 1000);

  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/site_candidature_apporteur`, {
      method: 'POST',
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_prenom: prenom, p_nom: nom, p_societe: societe, p_email: email, p_telephone: telephone, p_siret: siret, p_message: message }),
    });
    if (!r.ok) { console.error('[apporteur-candidature]', r.status, (await r.text()).slice(0, 200)); return send(res, 502, { error: 'save_failed' }); }
  } catch (err) {
    console.error('[apporteur-candidature]', err.message);
    return send(res, 502, { error: 'save_failed' });
  }

  try {
    await telegram([
      '🤝 Candidature apporteur d’affaires',
      `${prenom} ${nom}${societe ? ` · ${societe}` : ''}`,
      `${telephone} · ${email}`,
      message ? `« ${message.slice(0, 300)} »` : null,
      'À valider : kairnagency.com/gestion/apporteurs',
    ].filter(Boolean).join('\n'));
  } catch (err) { console.error('[apporteur-candidature] telegram :', err.message); }
  return send(res, 200, { ok: true });
}

async function ouvrir(req, res, body) {
  const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!token) return send(res, 401, { error: 'no_token' });
  if (!serviceKey()) return send(res, 503, { error: 'service_non_configure' });
  try {
    const a = await fetch(`${SUPABASE_URL}/rest/v1/rpc/is_admin`, { method: 'POST', headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'x-kairn-appareil': String(req.headers['x-kairn-appareil'] || '') }, body: '{}' });
    if (!a.ok || (await a.json()) !== true) return send(res, 403, { error: 'forbidden' });

    // La fiche : existante (candidature) ou créée ici.
    let fiche;
    if (body.id) {
      if (!UUID.test(String(body.id))) return send(res, 400, { error: 'bad_params' });
      const f = await adminFetch(`/rest/v1/apporteurs?select=*&id=eq.${body.id}`);
      fiche = Array.isArray(f.body) ? f.body[0] : null;
      if (!fiche) return send(res, 404, { error: 'introuvable' });
    } else {
      const email = clean(body.email, 200)?.toLowerCase();
      const nom = clean(body.nom, 120);
      if (!email || !EMAIL.test(email) || !nom) return send(res, 400, { error: 'bad_params' });
      const deja = await adminFetch(`/rest/v1/apporteurs?select=*&email=eq.${encodeURIComponent(email)}`);
      fiche = Array.isArray(deja.body) ? deja.body[0] : null;
      if (!fiche) {
        const c = await adminFetch('/rest/v1/apporteurs', { method: 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify({ email, nom, prenom: clean(body.prenom, 100), societe: clean(body.societe, 120), telephone: clean(body.telephone, 40), siret: clean(body.siret, 20) }) });
        fiche = Array.isArray(c.body) ? c.body[0] : null;
        if (!c.ok || !fiche) { console.error('[apporteur-ouvrir] fiche :', c.status, JSON.stringify(c.body).slice(0, 200)); return send(res, 502, { error: 'fiche_impossible' }); }
      }
    }
    const email = String(fiche.email).toLowerCase();
    if (!EMAIL.test(email)) return send(res, 400, { error: 'bad_params' });

    // Compte : invitation (création) ; inscriptions fermées : création par l'API admin puis lien ; compte existant : lien.
    let l = await lienAcces(email, 'invite');
    let nouveau = true;
    if (!l.ok && /signup/i.test(String(l.code))) {
      const u = await adminFetch('/auth/v1/admin/users', { method: 'POST', body: JSON.stringify({ email, email_confirm: true }) });
      if (u.ok || u.status === 422) { l = await lienAcces(email, 'recovery'); nouveau = u.ok; }
    } else if (!l.ok && (l.status === 422 || /exist|registered/i.test(String(l.code)))) { l = await lienAcces(email, 'recovery'); nouveau = false; }
    if (!l.ok || !l.userId) { console.error('[apporteur-ouvrir] lien :', l.status, l.code); return send(res, 502, { error: 'compte_impossible' }); }

    // Un compte déjà client garde son espace client : on ne le transforme pas en apporteur sans le dire.
    const cl = await adminFetch(`/rest/v1/clients?select=user_id&user_id=eq.${l.userId}`);
    if (Array.isArray(cl.body) && cl.body.length) return send(res, 409, { error: 'deja_client' });

    const maj = await adminFetch(`/rest/v1/apporteurs?id=eq.${fiche.id}`, { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ user_id: l.userId, statut: 'actif', valide_le: fiche.valide_le || new Date().toISOString() }) });
    if (!maj.ok) { console.error('[apporteur-ouvrir] maj :', maj.status, JSON.stringify(maj.body).slice(0, 200)); return send(res, 502, { error: 'fiche_impossible' }); }

    let envoye = false;
    try {
      const m = emailAcces({ mode: 'invite', espace: 'apporteur', prenom: fiche.prenom, lien: l.lien });
      envoye = await envoyerEmail(email, m.sujet, m.texte, m.html);
    } catch (err) { console.error('[apporteur-ouvrir] e-mail :', err.message); }
    return send(res, 200, { ok: true, id: fiche.id, nouveau, email_envoye: envoye, lien: l.lien });
  } catch (err) {
    console.error('[apporteur-ouvrir]', err.message);
    return send(res, 502, { error: 'ouverture_impossible' });
  }
}

// ─ Signature du contrat (13/11/2026) ─
// { action: 'signer', empreinte, signature (image PNG en data URL), nom_signataire, accepte: true }, jeton de l'apporteur.
// Le serveur refait le texte à partir de la fiche en base et de l'identité de Kairn : il doit avoir exactement l'empreinte
// du texte affiché à l'apporteur, sinon rien n'est signé (le contrat a changé entre-temps).

async function utilisateur(req) {
  const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!token) return null;
  const r = await fetch(`${SUPABASE_URL}/auth/v1/user`, { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}` } });
  if (!r.ok) return null;
  const u = await r.json().catch(() => null);
  return u?.id ? { id: u.id, email: u.email, token } : null;
}
const normaliser = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z]/g, '');

async function signer(req, res, body) {
  if (!serviceKey()) return send(res, 503, { error: 'service_non_configure' });
  const u = await utilisateur(req);
  if (!u) return send(res, 401, { error: 'no_token' });
  if (body.accepte !== true) return send(res, 400, { error: 'non_accepte' });
  const sig = String(body.signature || '');
  if (!/^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(sig) || sig.length < 1500 || sig.length > 350000) return send(res, 400, { error: 'signature_invalide' });
  try {
    const f = await adminFetch(`/rest/v1/apporteurs?select=*&user_id=eq.${u.id}`);
    const a = Array.isArray(f.body) ? f.body[0] : null;
    if (!a || a.statut !== 'actif') return send(res, 403, { error: 'forbidden' });
    if (a.contrat_signe_le) return send(res, 409, { error: 'deja_signe' });
    const kf = await adminFetch('/rest/v1/kairn_parametres?select=*&id=eq.1');
    const k = Array.isArray(kf.body) ? kf.body[0] : null;
    if (manquesKairn(k).length) return send(res, 409, { error: 'kairn_incomplet' });
    if (manquesApporteur(a).length) return send(res, 400, { error: 'fiche_incomplete', manques: manquesApporteur(a) });
    if (normaliser(body.nom_signataire) !== normaliser(`${a.prenom} ${a.nom}`)) return send(res, 400, { error: 'nom_different' });
    const texte = texteContrat(k, a);
    const empreinte = createHash('sha256').update(texte, 'utf8').digest('hex');
    if (empreinte !== String(body.empreinte || '')) return send(res, 409, { error: 'contrat_change' });

    const ligne = {
      apporteur_id: a.id, version: VERSION_CONTRAT, texte, empreinte, signe_le: new Date().toISOString(),
      nom_signataire: `${a.prenom} ${a.nom}`.trim(),
      ip: String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '').split(',')[0].trim().slice(0, 64),
      user_agent: String(req.headers['user-agent'] || '').slice(0, 300),
      signature_png: sig,
      kairn_signataire: `${k.signataire}, ${k.qualite}, pour ${k.nom_legal}`,
      kairn_signature_png: k.signature_png || null,
    };
    // Verrou : la date de signature n'est posée que si elle était vide (deux clics simultanés ne signent qu'une fois).
    const v = await adminFetch(`/rest/v1/apporteurs?id=eq.${a.id}&contrat_signe_le=is.null`, { method: 'PATCH', headers: { Prefer: 'return=representation' }, body: JSON.stringify({ contrat_signe_le: ligne.signe_le }) });
    if (!v.ok || !Array.isArray(v.body) || !v.body.length) return send(res, 409, { error: 'deja_signe' });
    const c = await adminFetch('/rest/v1/apporteur_contrats', { method: 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify(ligne) });
    if (!c.ok) {
      console.error('[apporteur] contrat :', c.status, JSON.stringify(c.body).slice(0, 200));
      await adminFetch(`/rest/v1/apporteurs?id=eq.${a.id}`, { method: 'PATCH', body: JSON.stringify({ contrat_signe_le: null }) });
      return send(res, 502, { error: 'signature_impossible' });
    }

    // Exemplaire PDF aux deux Parties, puis alerte Telegram. Un envoi raté ne défait pas la signature.
    let envoye = false;
    try {
      const fichier = await pdfContrat(ligne);
      const piece = [{ filename: `contrat-apporteur-kairn-${(a.raison_sociale || a.nom).replace(/[^\w-]+/g, '-').toLowerCase()}.pdf`, content: fichier, contentType: 'application/pdf' }];
      const texteMail = [`Bonjour ${a.prenom || ''},`, '', `Votre contrat d’apporteur d’affaires avec Kairn est signé (${dateParis(ligne.signe_le)}, heure de Paris). Vous le trouverez en pièce jointe ; il reste téléchargeable dans votre espace : https://www.kairnagency.com/apporteur/compte`, '', 'Kairn · kairnagency.com'];
      envoye = await envoyerEmail(a.email, 'Votre contrat d’apporteur d’affaires Kairn (signé)', texteMail, null, piece);
      const ugo = process.env.LEAD_NOTIFY_TO || process.env.ZOHO_SMTP_USER;
      if (ugo) await envoyerEmail(ugo, `Contrat apporteur signé : ${a.prenom} ${a.nom}${a.raison_sociale ? ` (${a.raison_sociale})` : ''}`, [`${a.prenom} ${a.nom} a signé son contrat d’apporteur d’affaires le ${dateParis(ligne.signe_le)}.`, `Empreinte SHA-256 : ${empreinte}`, 'Exemplaire PDF joint.'], null, piece);
    } catch (err) { console.error('[apporteur] e-mail contrat :', err.message); }
    try { await telegram(`✍️ Contrat apporteur signé : ${a.prenom} ${a.nom}${a.raison_sociale ? ` · ${a.raison_sociale}` : ''}\nkairnagency.com/gestion/apporteurs/${a.id}`); } catch { /* alerte facultative */ }
    return send(res, 200, { ok: true, email_envoye: envoye });
  } catch (err) {
    console.error('[apporteur] signer :', err.message);
    return send(res, 502, { error: 'signature_impossible' });
  }
}

// { action: 'pdf' } : l'apporteur télécharge son contrat ; { action: 'pdf', id } : Kairn Admin, celui d'un apporteur.
async function pdf(req, res, body) {
  if (!serviceKey()) return send(res, 503, { error: 'service_non_configure' });
  const u = await utilisateur(req);
  if (!u) return send(res, 401, { error: 'no_token' });
  try {
    let filtre;
    if (body.id) {
      if (!UUID.test(String(body.id))) return send(res, 400, { error: 'bad_params' });
      const a = await fetch(`${SUPABASE_URL}/rest/v1/rpc/is_admin`, { method: 'POST', headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${u.token}`, 'Content-Type': 'application/json', 'x-kairn-appareil': String(req.headers['x-kairn-appareil'] || '') }, body: '{}' });
      if (!a.ok || (await a.json()) !== true) return send(res, 403, { error: 'forbidden' });
      filtre = `apporteur_id=eq.${body.id}`;
    } else {
      const f = await adminFetch(`/rest/v1/apporteurs?select=id&user_id=eq.${u.id}`);
      const a = Array.isArray(f.body) ? f.body[0] : null;
      if (!a) return send(res, 403, { error: 'forbidden' });
      filtre = `apporteur_id=eq.${a.id}`;
    }
    const c = await adminFetch(`/rest/v1/apporteur_contrats?select=*&${filtre}&order=signe_le.desc&limit=1`);
    const ligne = Array.isArray(c.body) ? c.body[0] : null;
    if (!ligne) return send(res, 404, { error: 'aucun_contrat' });
    const fichier = await pdfContrat(ligne);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="contrat-apporteur-kairn.pdf"');
    res.setHeader('Cache-Control', 'no-store');
    return res.end(fichier);
  } catch (err) {
    console.error('[apporteur] pdf :', err.message);
    return send(res, 502, { error: 'pdf_impossible' });
  }
}
