import { useCallback } from 'react';
import { db, THEMES } from './db.js';
import { useData } from './data.js';

// Modèles de messages de l'espace client : SMS (12/11/2026) et e-mails (Ugo, 13/11/2026). L'installateur génère le texte
// rempli avec le prénom et le projet du contact, le copie et l'envoie lui-même : rien ne part de Kairn.
// Textes : Claude, d'après ~/kairn-copy/references-cache-brain/2026-11-12-sms-rappel-leads.md (faire répondre, porte de
// sortie, confirmation avant le rendez-vous). Chaque message ne parle que du projet demandé : la loi limite le rappel
// d'un particulier à l'objet de sa demande (fiche DGCCRF du 27/07/2026). Tant que le client n'a rien modifié, ce sont ces
// modèles qui s'affichent ; au premier changement, ils sont copiés dans son compte (table sms_modeles, colonne canal).

const SIGNATURE = '\n\nBien cordialement,\n{signataire}\n{entreprise}\n{telephone}';

export const DEFAUTS = {
  sms: [
    { id: 'defaut-sms-1', titre: 'Injoignable (1er appel)', texte: 'Bonjour {prenom}, ici {signataire} de {entreprise}. Vous avez demandé à être rappelé pour votre projet de {projet}. Je viens d’essayer de vous joindre. Quand puis-je vous rappeler ? Répondez simplement avec un créneau.' },
    { id: 'defaut-sms-2', titre: 'Injoignable (relance)', texte: 'Bonjour {prenom}, c’est {signataire} de {entreprise}, au sujet de votre demande pour votre projet de {projet}. Je n’arrive pas à vous joindre. Si le projet est toujours d’actualité, répondez OUI et je vous rappelle quand ça vous arrange.' },
    { id: 'defaut-sms-3', titre: 'Confirmation de rendez-vous', texte: 'Bonjour {prenom}, je vous confirme notre rendez-vous du {rdv} pour votre projet de {projet}. Merci de répondre OK pour le confirmer. {signataire}, {entreprise}' },
    { id: 'defaut-sms-4', titre: 'Rappel la veille du rendez-vous', texte: 'Bonjour {prenom}, petit rappel : nous avons rendez-vous demain, {rdv}, pour votre projet de {projet}. En cas d’empêchement, prévenez-moi ici. {signataire}, {entreprise}' },
    { id: 'defaut-sms-5', titre: 'Relance du devis', texte: 'Bonjour {prenom}, avez-vous pu regarder le devis pour votre projet de {projet} ? Je reste disponible pour répondre à vos questions ou l’ajuster. {signataire}, {entreprise}' },
  ],
  email: [
    { id: 'defaut-email-1', titre: 'Relance 1', objet: 'Votre demande pour votre projet de {projet}',
      texte: `Bonjour {prenom},\n\nVous avez demandé à être rappelé au sujet de votre projet de {projet}. J’ai essayé de vous joindre, sans succès.\n\nIl me faut seulement quelques minutes au téléphone pour comprendre votre logement et ce que vous attendez, puis vous dire franchement si le projet est faisable et à quel prix.\n\nQuel moment vous arrange ? Répondez simplement à cet e-mail avec un jour et une heure, je vous appelle à ce moment-là.${SIGNATURE}` },
    { id: 'defaut-email-2', titre: 'Relance 2', objet: '{prenom}, votre projet de {projet} est-il toujours d’actualité ?',
      texte: `Bonjour {prenom},\n\nJe reviens vers vous au sujet de votre demande pour votre projet de {projet} : je n’ai pas encore réussi à vous avoir au téléphone.\n\nSi le moment n’est pas idéal, aucun souci. Dites-moi simplement quand vous rappeler, même dans quelques semaines.\n\nEt si vous avez changé d’avis, un mot suffit : je ne vous relancerai plus.${SIGNATURE}` },
    { id: 'defaut-email-3', titre: 'Relance 3 (dernière)', objet: 'Je clôture votre demande ?',
      texte: `Bonjour {prenom},\n\nSans nouvelles de votre part, je vais clôturer votre demande pour votre projet de {projet}.\n\nSi vous souhaitez toujours en parler, répondez simplement « Oui » à cet e-mail et je vous rappelle au moment qui vous convient.${SIGNATURE}` },
    { id: 'defaut-email-4', titre: 'Confirmation du rendez-vous', objet: 'Confirmation de notre rendez-vous du {rdv}',
      texte: `Bonjour {prenom},\n\nJe vous confirme notre rendez-vous du {rdv} pour votre projet de {projet}.\n\nPour que la visite soit vraiment utile, gardez si possible sous la main vos dernières factures d’énergie, et la surface ou les plans de votre logement si vous les avez.\n\nMerci de me confirmer en répondant à cet e-mail. En cas d’empêchement, prévenez-moi : nous trouverons un autre moment.${SIGNATURE}` },
    { id: 'defaut-email-5', titre: 'Envoi du devis', objet: 'Votre devis pour votre projet de {projet}',
      texte: `Bonjour {prenom},\n\nComme convenu, vous trouverez ci-joint le devis pour votre projet de {projet}.\n\nPrenez le temps de le lire. Si une ligne n’est pas claire ou si vous voulez ajuster quelque chose, appelez-moi ou répondez à cet e-mail : je vous explique tout.${SIGNATURE}` },
    { id: 'defaut-email-6', titre: 'Relance du devis', objet: 'Avez-vous pu regarder votre devis ?',
      texte: `Bonjour {prenom},\n\nJe reviens vers vous au sujet du devis pour votre projet de {projet}.\n\nAvez-vous pu le regarder ? Si vous avez une question, un doute sur un point ou un autre devis à comparer, je reste disponible pour en parler.${SIGNATURE}` },
  ],
};
export const LIBELLES = { sms: { un: 'SMS', titre: 'Mes modèles de SMS' }, email: { un: 'e-mail', titre: 'Mes modèles d’e-mail' } };

const PROJET = { PAC: 'pompe à chaleur', ITE: 'isolation extérieure', PPV: 'panneaux solaires' };
const dateRdv = (d) => (d ? new Date(d).toLocaleString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }).replace(':', ' h ').replace(/ h 00$/, ' h') : '');
export function variables(l, client, sv) {
  return { prenom: l.prenom || '', nom: l.nom || '', projet: PROJET[l.thematique] || (THEMES[l.thematique] || '').toLowerCase(), ville: l.ville || '',
    entreprise: client?.societe || '', signataire: client?.prenom || '', telephone: client?.telephone || '', rdv: dateRdv(sv?.rdv_le) };
}

// Modèle proposé d'office selon l'étape du contact.
export function conseille(canal, sv) {
  const n = sv?.tentatives || 0;
  if (canal === 'email') {
    if (sv?.statut === 'rdv') return 'defaut-email-4';
    if (sv?.statut === 'devis') return 'defaut-email-6';
    return n >= 3 ? 'defaut-email-3' : n === 2 ? 'defaut-email-2' : 'defaut-email-1';
  }
  if (sv?.statut === 'rdv') return new Date(sv.rdv_le || 0) - Date.now() < 36 * 3600000 ? 'defaut-sms-4' : 'defaut-sms-3';
  if (sv?.statut === 'devis') return 'defaut-sms-5';
  return n >= 2 ? 'defaut-sms-2' : 'defaut-sms-1';
}

// Modèles d'un canal pour le compte connecté, avec enregistrement, suppression et retour aux modèles Kairn.
export function useModeles(canal, apercu) {
  const { modeles, setModeles } = useData();
  const tous = modeles || [];
  const miens = tous.filter((m) => (m.canal || 'sms') === canal);
  const perso = miens.length > 0;
  const liste = perso ? miens : DEFAUTS[canal];
  const autres = tous.filter((m) => (m.canal || 'sms') !== canal);

  // Premier changement : les modèles Kairn du canal sont copiés dans le compte.
  const copierDefauts = useCallback(async () => {
    const rows = DEFAUTS[canal].map((m, i) => ({ canal, titre: m.titre, objet: m.objet || null, texte: m.texte, ordre: i }));
    if (apercu) { const c = rows.map((r, i) => ({ ...r, id: `apercu-${canal}-${i}` })); setModeles([...autres, ...c]); return c; }
    const { data, error } = await db.from('sms_modeles').insert(rows).select('*');
    if (error) return null;
    setModeles([...autres, ...data]);
    return data;
  }, [canal, apercu, autres, setModeles]);

  // Crée (sans id) ou modifie un modèle ; renvoie le modèle enregistré, ou null.
  const enregistrer = useCallback(async ({ id, titre, objet, texte }) => {
    let base = perso ? miens : await copierDefauts();
    if (!base) return null;
    let cible = id;
    if (cible && cible.startsWith('defaut-')) cible = base[DEFAUTS[canal].findIndex((m) => m.id === cible)]?.id;
    const champs = { titre, objet: canal === 'email' ? objet || null : null, texte };
    let row;
    if (apercu) row = { ...(base.find((m) => m.id === cible) || { id: `apercu-${canal}-${Date.now()}`, canal, ordre: base.length }), ...champs };
    else {
      const q = cible ? db.from('sms_modeles').update(champs).eq('id', cible).select('*').single()
        : db.from('sms_modeles').insert({ ...champs, canal, ordre: base.length }).select('*').single();
      const { data, error } = await q;
      if (error) return null;
      row = data;
    }
    base = cible ? base.map((m) => (m.id === cible ? row : m)) : [...base, row];
    setModeles([...autres, ...base]);
    return row;
  }, [perso, miens, copierDefauts, canal, apercu, autres, setModeles]);

  const supprimer = useCallback(async (m) => {
    let base = perso ? miens : await copierDefauts();
    if (!base) return false;
    const id = m.id.startsWith('defaut-') ? base[DEFAUTS[canal].findIndex((x) => x.id === m.id)]?.id : m.id;
    if (!apercu) { const { error } = await db.from('sms_modeles').delete().eq('id', id); if (error) return false; }
    setModeles([...autres, ...base.filter((x) => x.id !== id)]);
    return true;
  }, [perso, miens, copierDefauts, canal, apercu, autres, setModeles]);

  const retablir = useCallback(async () => {
    if (!apercu) { const { error } = await db.from('sms_modeles').delete().eq('canal', canal); if (error) return false; }
    setModeles(autres);
    return true;
  }, [canal, apercu, autres, setModeles]);

  return { liste, perso, enregistrer, supprimer, retablir };
}
