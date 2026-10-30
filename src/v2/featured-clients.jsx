import React from 'react';

// Trois cas ajoutés à la demande d'Ugo (30/10/2026) : Etxe Energie, ED HABITAT, Décoratherm.
// Chiffres de volume seulement, jamais de CPL (dépôt public). Captures : CRM Etxe avec noms remplacés par des faux
// et codes postaux masqués (Ugo : « la seule capture que tu peux mettre, c'est la capture du CRM »), site Décoratherm public.
const CASES = [
  {
    id: 'etxe-energie',
    label: 'Génération de leads · Isolation des combles',
    name: 'ETXE ENERGIE',
    h: 'Une campagne de leads combles,',
    i: 'de la pub jusqu’au rappel.',
    lead: 'ETXE ENERGIE vérifie l’éligibilité des propriétaires, monte le dossier de primes CEE et confie le chantier à un installateur RGE, sur une offre combles à 1 €. On a créé les publicités, lancé et piloté la campagne, puis construit un CRM sur mesure : chaque lead y arrive avec ses réponses, et le résultat de l’appel repart vers Meta pour viser les bons profils.',
    kpis: [['12', 'départements du Sud-Ouest ciblés'], ['680', 'codes postaux dans le ciblage'], ['5 min', 'entre le formulaire Meta et la fiche dans le CRM']],
    shots: [{ img: '/v2/etxe-crm.jpg', w: 1335, h: 896, url: 'CRM · ETXE ENERGIE', alt: 'Pipeline du CRM ETXE ENERGIE : colonnes Nouveau, NRP 1, NRP 2, NRP 3, fiches de leads (noms fictifs, codes postaux masqués).' }],
    note: 'Noms remplacés par des exemples, codes postaux masqués.',
    deliv: ['Publicités : textes, visuels et vidéos', 'Campagne lancée et pilotée en interne', 'CRM sur mesure : pipeline, rappels, modèles d’e-mail', 'Leads qualifiés renvoyés à Meta pour affiner le ciblage'],
  },
  {
    id: 'ed-habitat',
    label: 'Outil de gestion · Rénovation énergétique',
    logo: { src: '/v2/logos/ed-habitat.svg', alt: 'ED HABITAT' },
    h: 'Toute l’entreprise',
    i: 'dans un seul outil de gestion.',
    lead: 'ED HABITAT fait de l’isolation et de la façade. On lui a construit de zéro un outil de gestion à sa charte, pour le bureau, les commerciaux et les régies de pose : chaque dossier suit ses étapes du devis jusqu’au solde, avec le planning de pose, le SAV, la facturation, l’équipe et le matériel au même endroit.',
    kpis: [['12', 'modules : chantiers, dossiers, planning, SAV, facturation…'], ['9', 'étapes suivies, du devis en brouillon au dossier soldé'], ['1', 'seul outil pour le bureau, les commerciaux et les poseurs']],
    shots: [{ img: '/v2/ed-habitat-hub.jpg', w: 2000, h: 776, url: 'Outil de gestion · ED HABITAT', alt: 'Fiche dossier de l’outil ED HABITAT : étape suivante, informations du dossier, montage du dossier en 9 étapes (données de démonstration).' }],
    note: 'Données de démonstration.',
    deliv: ['Dossiers suivis étape par étape, avec historique', 'Planning de pose et SAV', 'Facturation, équipe et matériel', 'Accès par rôle : admin, commerciaux, régies'],
  },
  {
    id: 'decoratherm',
    label: 'Site web, SEO et outil comptable',
    name: 'Decoratherm',
    h: 'Un site qui amène les devis,',
    i: 'une compta qui se tient toute seule.',
    lead: 'Decoratherm, artisan façade et ITE à La Rochelle, nous a confié son site. On l’a reconstruit et référencé : pages métiers, simulateur de prix au m², comparateur d’isolants, réalisations avant et après, blog et demande de devis. Puis on a construit son outil de trésorerie : les relevés de ses trois banques arrivent au même endroit, chaque opération est classée et reliée à son justificatif.',
    kpis: [['3', 'banques réunies dans un seul outil'], ['1 200+', 'opérations classées et rapprochées'], ['892', 'tests automatiques pour ne perdre aucune donnée']],
    shots: [{ img: '/v2/decoratherm-site.jpg', w: 1335, h: 896, url: 'decoratherm.com', alt: 'Site Decoratherm : « Isolez, ravalez, sublimez votre façade », boutons devis et estimation au m².' }],
    mock: true,
    deliv: ['Site sur mesure : ITE, ravalement, bardage', 'Simulateur de prix et comparateur d’isolants', 'Référencement SEO local et blog', 'Trésorerie : 3 banques, justificatifs, sauvegarde chiffrée'],
  },
];

// Réplique de l'outil de trésorerie Decoratherm, chiffres inventés (Ugo, 30/10/2026 : « je peux pas afficher ses chiffres,
// crée une magnifique maquette »). Aucune donnée réelle du client.
const BANQUES = [['CIC', 'Compte courant', '48 320,15 €'], ['Qonto', 'Chantiers', '21 905,40 €'], ['FINOM', 'Réserve', '12 600,00 €']];
const FLUX = [38, 52, 44, 61, 57, 70, 66, 78, 72, 85, 80, 92];
const OPS = [
  ['28/10', 'Virement client · Chantier ITE Lagord', 'Ventes', '+ 14 200,00 €', 'ok'],
  ['27/10', 'Fournisseur isolants', 'Matériaux', '− 6 418,32 €', 'ok'],
  ['25/10', 'Location échafaudage', 'Location', '− 1 260,00 €', 'manque'],
  ['24/10', 'Acompte · Ravalement Aytré', 'Ventes', '+ 4 850,00 €', 'ok'],
  ['22/10', 'Carburant véhicules', 'Déplacements', '− 312,84 €', 'ok'],
];

function ComptaMockup() {
  const max = Math.max(...FLUX);
  const pts = FLUX.map((v, i) => `${(i / (FLUX.length - 1)) * 100},${100 - (v / max) * 86}`).join(' ');
  return (
    <figure className="ia-shot fc-shot cm" aria-label="Maquette de l’outil de trésorerie Decoratherm, chiffres fictifs">
      <div className="shot-bar" aria-hidden="true"><span className="shot-dots"><i /><i /><i /></span><span className="shot-url">Trésorerie · Decoratherm</span></div>
      <div className="cm-app">
        <aside className="cm-side" aria-hidden="true">
          <p className="cm-brand">Decora<span>therm</span></p>
          {['Tableau de bord', 'Opérations', 'Justificatifs', 'Banques', 'Catégories', 'Exports'].map((x, i) => <span key={x} className={i === 0 ? 'is-on' : undefined}>{x}</span>)}
        </aside>
        <div className="cm-main">
          <div className="cm-head"><div><small>Trésorerie</small><b>Octobre 2026</b></div><span className="cm-sync">● 3 banques à jour</span></div>
          <div className="cm-kpis">
            <div><small>Disponible</small><b>82 825,55 €</b><em className="up">+ 6,2 % ce mois</em></div>
            <div><small>Entrées du mois</small><b>41 380,00 €</b><em className="up">12 encaissements</em></div>
            <div><small>Sorties du mois</small><b>29 714,62 €</b><em>48 opérations</em></div>
            <div><small>Autonomie</small><b>5,8 mois</b><em>au rythme actuel</em></div>
          </div>
          <div className="cm-row">
            <div className="cm-card cm-chart">
              <small>Trésorerie disponible, 12 mois</small>
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                <defs><linearGradient id="cmg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#EA580C" stopOpacity=".28" /><stop offset="1" stopColor="#EA580C" stopOpacity="0" /></linearGradient></defs>
                <polygon points={`0,100 ${pts} 100,100`} fill="url(#cmg)" />
                <polyline points={pts} fill="none" stroke="#EA580C" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
              </svg>
            </div>
            <div className="cm-card cm-banks">
              <small>Comptes</small>
              {BANQUES.map(([b, t, v]) => <div key={b}><span className="cm-bank">{b[0]}</span><p><b>{b}</b><i>{t}</i></p><strong>{v}</strong></div>)}
            </div>
          </div>
          <div className="cm-card cm-ops">
            <small>Dernières opérations</small>
            {OPS.map(([d, l, c, m, j]) => (
              <div key={l}><span>{d}</span><p>{l}</p><em>{c}</em><b className={m.startsWith('+') ? 'up' : undefined}>{m}</b><i className={j === 'ok' ? 'ok' : 'ko'}>{j === 'ok' ? 'Justifié' : 'Justificatif à joindre'}</i></div>
            ))}
          </div>
        </div>
      </div>
      <figcaption>Maquette fidèle à l’outil, chiffres fictifs.</figcaption>
    </figure>
  );
}

function Case({ c }) {
  return (
    <section className="band ia fc" id={c.id}>
      <div className="wrap">
        <div className="ia-top">
          <div>
            <span className="pill"><span className="pill-dot"><i /></span>{c.label}</span>
            {c.logo ? <img className="ia-logo fc-logo" src={c.logo.src} alt={c.logo.alt} height="56" /> : <p className="fc-name">{c.name}</p>}
            <h2 className="h2">{c.h} <span className="serif grad-text">{c.i}</span></h2>
            <p className="ia-lead">{c.lead}</p>
          </div>
          <div className="ia-kpis">
            {c.kpis.map(([b, s]) => <div key={s}><b>{b}</b><span>{s}</span></div>)}
          </div>
        </div>

        {c.shots.map((s) => (
          <figure key={s.img} className="ia-shot fc-shot">
            <div className="shot-bar" aria-hidden="true"><span className="shot-dots"><i /><i /><i /></span><span className="shot-url">{s.url}</span></div>
            <img src={s.img} width={s.w} height={s.h} loading="lazy" decoding="async" alt={s.alt} />
            {c.note && <figcaption>{c.note}</figcaption>}
          </figure>
        ))}

        {c.mock && <ComptaMockup />}

        <ul className="ia-deliv">
          {c.deliv.map((d) => <li key={d}><span aria-hidden="true">✓</span>{d}</li>)}
        </ul>
      </div>
    </section>
  );
}

export default function FeaturedClients() {
  return CASES.map((c) => <Case key={c.id} c={c} />);
}
