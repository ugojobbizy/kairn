import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

// Centre d'aide de l'espace client (Ugo, 31/10/2026 : « une petite icône pour l'interrogation [...] la documentation exacte
// de comment fonctionne la plateforme et comment s'en servir »). Bouton « ? » en bas à droite, sous la bulle de conversation.
// À l'ouverture, l'article de l'écran en cours est affiché ; une recherche parcourt tous les articles.
// Le contenu décrit ce que fait la plateforme au 31/10/2026 : à mettre à jour à chaque évolution d'un écran.

const ARTICLES = [
  { id: 'demarrer', route: null, titre: 'Bien démarrer', resume: 'Comment fonctionne votre espace, en 1 minute.', corps: [
    ['p', 'Votre espace Kairn sert à trois choses : recevoir vos contacts, les suivre jusqu’à la signature, et gérer vos commandes.'],
    ['ol', ['Vous commandez des contacts (thématique, zone, volume) depuis « Mes commandes » ou « Commander des contacts ».', 'Nous validons votre zone et votre volume, puis le bon de commande arrive dans « Mes commandes ».', 'Les contacts arrivent dans « Mes contacts », chacun envoyé à vous seul.', 'Vous les appelez, vous notez où vous en êtes, et le tableau de bord suit vos résultats.']],
    ['tip', 'Rappelez vite : un contact qui vient de faire sa demande décroche beaucoup plus souvent.'],
  ] },
  { id: 'tableau', route: '/espace', exact: true, titre: 'Le tableau de bord', resume: 'Ce qu’il y a à faire maintenant, et vos résultats.', corps: [
    ['h', 'À faire maintenant'],
    ['p', 'Trois cases : les nouveaux contacts à appeler, les rappels prévus aujourd’hui (dont ceux en retard) et les rendez-vous du jour. Chaque case ouvre la bonne vue de « Mes contacts ».'],
    ['h', 'Vos résultats'],
    ['ul', ['Contacts reçus sur la période choisie (7 jours, 30 jours ou depuis le début), et leur montant HT.', 'Traités : contacts dont vous avez changé l’étape.', 'Premier suivi en : temps médian entre la réception d’un contact et votre premier changement d’étape.', 'RDV pris, Signés, et coût par signature (montant des contacts de la période divisé par le nombre de signés).']],
    ['tip', 'Ces chiffres viennent des étapes que vous donnez à vos contacts : plus votre suivi est à jour, plus ils sont justes.'],
  ] },
  { id: 'contacts', route: '/espace/prospects', titre: 'Mes contacts : le pipeline', resume: 'Classer vos contacts par étape, en les faisant glisser.', corps: [
    ['p', 'Chaque contact est une carte rangée dans une colonne : Nouveau, NRP (ne répond pas), À rappeler, RDV pris, Devis envoyé, Signé, Perdu.'],
    ['ul', ['Sur ordinateur, faites glisser une carte d’une colonne à l’autre pour changer son étape.', 'Sur téléphone, faites défiler les colonnes de côté, ou choisissez l’étape dans le menu au-dessus.', 'Une carte bordée de vert est arrivée il y a moins d’une heure.', 'Les pastilles indiquent un rendez-vous, un rappel (en rouge s’il est en retard) ou un litige.']],
    ['p', 'La recherche trouve un contact par nom, téléphone ou code postal. Les vues Liste, Rappels et Agenda présentent les mêmes contacts autrement.'],
  ] },
  { id: 'fiche', route: '/espace/prospects', titre: 'La fiche d’un contact', resume: 'Appeler, noter, programmer un rappel ou un rendez-vous.', corps: [
    ['p', 'Cliquez sur une carte pour ouvrir sa fiche.'],
    ['ul', ['Appeler, SMS (un message prêt à envoyer, que vous pouvez modifier) ou E-mail.', 'Étape : un clic pour la changer. En « Perdu », choisissez le motif.', 'Rendez-vous : date et heure, puis « Ajouter à Google Agenda ». Fixer un rendez-vous passe le contact en « RDV pris ».', 'Rappel programmé : une date, ou un raccourci (dans 1 h, demain 9 h…). Il apparaît dans la vue Rappels et sur le tableau de bord.', 'Notes : ajoutez ce que le contact vous a dit. Elles s’affichent dans l’activité, avec chaque changement d’étape.']],
  ] },
  { id: 'export', route: '/espace/prospects', titre: 'Exporter vos contacts', resume: 'Vers Excel, Google Sheets ou votre CRM.', corps: [
    ['p', 'Le bouton « Exporter » de « Mes contacts » propose trois choix : un fichier pour Excel, un fichier CSV standard (Google Sheets, la plupart des CRM), ou « Copier le tableau » à coller directement dans un tableur.'],
    ['p', 'L’export reprend les contacts affichés (recherche et filtres compris), avec leur étape, rendez-vous, rappel, motif de perte et dernière note.'],
    ['tip', 'Pour envoyer chaque nouveau contact automatiquement vers votre CRM, renseignez un webhook dans « Compte et alertes ».'],
  ] },
  { id: 'commander', route: '/espace/precommande', titre: 'Commander ou relancer une campagne', resume: 'Thématique, zone, volume, et bon de commande.', corps: [
    ['ol', ['Choisissez la thématique et le nombre de contacts (50 au minimum).', 'Choisissez la zone sur la carte : France entière, régions, départements (3 au moins) ou zones climatiques H1, H2, H3.', 'Envoyez la demande. Nous validons la zone et le volume, puis le bon de commande arrive dans « Mes commandes ».']],
    ['p', 'Le bouton « Relancer une campagne » de « Mes contacts » reprend votre dernière campagne (thématique, zone) : changez le volume si besoin et envoyez en un clic.'],
    ['p', 'Le règlement se fait par virement à réception du bon de commande.'],
  ] },
  { id: 'commandes', route: '/espace/commandes', titre: 'Mes commandes', resume: 'Suivre la livraison de vos contacts.', corps: [
    ['p', 'Chaque commande ouverte montre les contacts livrés sur le total commandé. Quand une commande touche à sa fin, le bouton « Reconduire » prépare la suivante, déjà remplie.'],
    ['p', 'Les étapes d’une campagne : demande reçue, en préparation, campagne lancée, terminée.'],
  ] },
  { id: 'shop', route: '/espace/shop', titre: 'Le Leads Shop', resume: 'Des contacts disponibles tout de suite, 4 € moins chers.', corps: [
    ['p', 'Le Leads Shop propose des contacts qu’un autre installateur a signalés hors de sa zone ou en doublon. Ils sont remis en vente 4 € moins chers ; la réduction est affichée sur chaque ligne.'],
    ['ul', ['Filtrez par date, thématique, département, code postal ou prix.', 'Cochez les contacts voulus, puis « Acheter » : leurs coordonnées apparaissent aussitôt dans « Mes contacts » et un bon de commande est créé.', 'Les coordonnées ne sont visibles qu’après l’achat.']],
  ] },
  { id: 'litiges', route: '/espace/litiges', titre: 'Signaler un doublon ou un hors zone', resume: 'Faire remplacer un contact.', corps: [
    ['p', 'Depuis la fiche d’un contact, « Signaler un doublon ou un hors zone ». Choisissez le motif et ajoutez une précision si besoin.'],
    ['p', 'Nous vérifions chaque signalement. Accepté, le contact est remplacé par un contact neuf. Vous suivez la réponse dans « Mes litiges ».'],
    ['tip', 'Seuls les doublons et les contacts hors de votre zone sont remplacés.'],
  ] },
  { id: 'compta', route: '/espace/comptabilite', titre: 'Comptabilité et règlement', resume: 'Vos bons de commande et ce qui reste à régler.', corps: [
    ['p', 'Tous vos bons de commande approuvés, avec leur montant HT et TTC, et leur état : réglé ou à régler. Le règlement se fait par virement à réception du bon de commande.'],
  ] },
  { id: 'alertes', route: '/espace/compte', titre: 'Être prévenu d’un nouveau contact', resume: 'E-mail, notification sur le téléphone, webhook.', corps: [
    ['ul', ['Par e-mail : activé d’office, sur l’adresse de votre choix.', 'Notification sur le téléphone : à activer sur chaque appareil. Sur iPhone, ajoutez d’abord l’espace à l’écran d’accueil (Partager, puis « Sur l’écran d’accueil »), ouvrez-le depuis l’icône, puis activez.', 'Webhook (facultatif) : chaque contact livré part aussitôt vers l’adresse indiquée, par exemple Zapier ou Make, pour arriver dans votre CRM ou votre Google Sheet.']],
    ['p', '« Envoyer un test » envoie un faux contact sur vos canaux et vous dit ce qui est parti.'],
  ] },
  { id: 'contact', route: null, titre: 'Nous écrire', resume: 'Un bug, une erreur, une suggestion, une question.', corps: [
    ['p', 'La bulle juste au-dessus de ce bouton ouvre vos échanges avec nous. Choisissez Bug, Erreur, Suggestion ou Question, puis écrivez.'],
    ['p', 'Nous sommes prévenus tout de suite, et notre réponse arrive dans cette même bulle (une pastille rouge vous le signale).'],
  ] },
];

function Corps({ blocs }) {
  return blocs.map(([t, v], i) => {
    if (t === 'p') return <p key={i}>{v}</p>;
    if (t === 'h') return <h4 key={i}>{v}</h4>;
    if (t === 'tip') return <p key={i} className="ad-tip">{v}</p>;
    const L = t === 'ol' ? 'ol' : 'ul';
    return <L key={i}>{v.map((x) => <li key={x}>{x}</li>)}</L>;
  });
}
const texte = (a) => [a.titre, a.resume, ...a.corps.flatMap(([, v]) => (Array.isArray(v) ? v : [v]))].join(' ').toLowerCase();
const sansAccents = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '');

export default function Aide() {
  const loc = useLocation();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [art, setArt] = useState(null);
  // À l'ouverture : l'article de l'écran en cours (le plus précis), sinon la liste.
  useEffect(() => {
    if (!open) return;
    const p = loc.pathname.replace(/\/$/, '') || '/espace';
    const a = ARTICLES.find((x) => x.route && (x.exact ? p === x.route || p === '/espace/demo' : p.startsWith(x.route)));
    setArt(a ? a.id : null); setQ('');
  }, [open, loc.pathname]);
  useEffect(() => { const k = (e) => { if (e.key === 'Escape') setOpen(false); }; window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k); }, []);
  const res = useMemo(() => { const s = sansAccents(q.trim().toLowerCase()); return s ? ARTICLES.filter((a) => sansAccents(texte(a)).includes(s)) : ARTICLES; }, [q]);
  const a = art && ARTICLES.find((x) => x.id === art);
  return (
    <>
      <button type="button" className={`ad-fab${open ? ' is-open' : ''}`} onClick={() => setOpen((o) => !o)} aria-label={open ? 'Fermer l’aide' : 'Aide et documentation'} aria-expanded={open}>{open ? '×' : '?'}</button>
      {open && (
        <div className="ad-panel" role="dialog" aria-label="Aide et documentation">
          <header className="ad-head">
            {a ? <button type="button" className="tk-back" onClick={() => setArt(null)}>‹ Tous les articles</button> : <b>Aide et documentation</b>}
            <span>Comment fonctionne votre espace</span>
          </header>
          {a ? (
            <article className="ad-body ad-art"><h3>{a.titre}</h3><Corps blocs={a.corps} /></article>
          ) : (
            <div className="ad-body">
              <input className="ad-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher : rappel, export, zone…" aria-label="Rechercher dans l’aide" autoFocus />
              {res.length === 0 ? <p className="ad-empty">Rien trouvé. Écrivez-nous avec la bulle juste au-dessus.</p> : (
                <ul className="ad-list">{res.map((x) => <li key={x.id}><button type="button" onClick={() => setArt(x.id)}><b>{x.titre}</b><span>{x.resume}</span></button></li>)}</ul>
              )}
              <p className="ad-foot">Pas de réponse ? Écrivez-nous avec la bulle juste au-dessus.</p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
