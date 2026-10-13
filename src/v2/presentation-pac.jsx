import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { KairnLogo, useV2Favicon } from './layout.jsx';
import { CONTACT_EMAIL } from '../config.js';
import './presentation-pac.css';

// Présentation commerciale « Génération de leads pompe à chaleur », pensée pour un iPad posé sur la table.
// Page cachée (/presentation-pac) : non référencée, liée nulle part.
// Deux modèles, définis par Ugo le 13/10 :
//   1. Achat de leads exclusifs à 30 € le lead ;
//   2. Campagne du client, pub payée par le client ; Kairn facture (27 € − coût réel du lead), rien si le coût réel ≥ 27 €
//      (plancher passé de 30 € à 27 € par Ugo le 13/10).
// Tous les chiffres autres que ces deux prix sont des exemples, signalés comme tels à l'écran.

const PRICE = 30; // modèle 1 : prix d'un lead acheté
const FLOOR = 27; // modèle 2 : prix plancher par lead
const EASE = [0.22, 0.8, 0.24, 1];
const eur = (n) => `${n.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €`;

function Steps({ items }) {
  return (
    <ol className="pp-steps">
      {items.map((t, i) => (
        <motion.li key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.08, duration: 0.5, ease: EASE }}>
          <span className="pp-step-n">{i + 1}</span>
          <span>{t}</span>
        </motion.li>
      ))}
    </ol>
  );
}

// ─ Simulateur : coût par lead pour le client, modèle 1 contre modèle 2 ─
function Simulator() {
  const [cpl, setCpl] = useState(20);
  const [leads, setLeads] = useState(150);
  const fee = Math.max(0, FLOOR - cpl);
  const m2 = cpl + fee;
  return (
    <div className="pp-sim" onPointerDown={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()}>
      <div className="pp-sim-inputs">
        <label>
          <span>Budget publicitaire par lead <em>(exemple)</em></span>
          <b>{eur(cpl)}</b>
          <input type="range" min="5" max="45" step="1" value={cpl} onChange={(e) => setCpl(+e.target.value)} />
        </label>
        <label>
          <span>Leads reçus dans le mois <em>(exemple)</em></span>
          <b>{leads}</b>
          <input type="range" min="10" max="400" step="10" value={leads} onChange={(e) => setLeads(+e.target.value)} />
        </label>
      </div>
      <div className="pp-sim-out">
        <div className="pp-sim-col">
          <p className="pp-sim-h">Modèle 1 · Achat de leads</p>
          <dl>
            <div><dt>Prix par lead</dt><dd>{eur(PRICE)}</dd></div>
            <div className="is-total"><dt>Total du mois</dt><dd>{eur(PRICE * leads)}</dd></div>
          </dl>
        </div>
        <div className="pp-sim-col is-accent">
          <p className="pp-sim-h">Modèle 2 · Votre campagne</p>
          <dl>
            <div><dt>Payé à Meta</dt><dd>{eur(cpl)}</dd></div>
            <div><dt>Facturé par Kairn</dt><dd>{eur(fee)}</dd></div>
            <div><dt>Coût par lead</dt><dd>{eur(m2)}</dd></div>
            <div className="is-total"><dt>Total du mois</dt><dd>{eur(m2 * leads)}</dd></div>
          </dl>
        </div>
      </div>
      <p className="pp-sim-note">
        {cpl < FLOOR
          ? `Chaque lead vous coûte ${eur(cpl)} en budget publicitaire : Kairn facture la différence jusqu’à ${eur(FLOOR)}, soit ${eur(fee)}.`
          : `Chaque lead vous coûte ${eur(cpl)} en budget publicitaire, soit ${eur(FLOOR)} ou plus : Kairn ne facture rien, vous ne payez que Meta.`}
      </p>
    </div>
  );
}


// ─ Conversion : ce que rapportent les leads, selon le taux de signature du client ─
// Sources affichées : HBR 2011 (Oldroyd, McElheran, Elkington, « The Short Life of Online Sales Leads ») ;
// La Prime Effy, prix PAC air-eau pose incluse, page lue le 13/10/2026.
function Earnings() {
  const [leads, setLeads] = useState(150);
  const [rate, setRate] = useState(1);
  const [basket, setBasket] = useState(5000);
  const deals = Math.round((leads * rate) / 100);
  const revenue = deals * basket;
  const cost = leads * PRICE;
  return (
    <div className="pp-sim pp-earn" onPointerDown={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()}>
      <div className="pp-sim-inputs is-three">
        <label>
          <span>Leads dans le mois</span>
          <b>{leads}</b>
          <input type="range" min="10" max="400" step="10" value={leads} onChange={(e) => setLeads(+e.target.value)} />
        </label>
        <label>
          <span>Taux de signature</span>
          <b>{rate} %</b>
          <input type="range" min="1" max="30" step="1" value={rate} onChange={(e) => setRate(+e.target.value)} />
        </label>
        <label>
          <span>Panier moyen</span>
          <b>{eur(basket)}</b>
          <input type="range" min="5000" max="25000" step="500" value={basket} onChange={(e) => setBasket(+e.target.value)} />
        </label>
      </div>
      <div className="pp-earn-out">
        <div><span>Chantiers signés</span><b>{deals}</b></div>
        <div className="is-main"><span>Chiffre d’affaires signé</span><b>{eur(revenue)}</b></div>
        <div><span>Coût des leads (à {eur(PRICE)})</span><b>{eur(cost)}</b></div>
      </div>
    </div>
  );
}


// ─ Étapes de mise en place (après le détail du modèle 2), illustrées par de vraies captures
//   d'un client (ETXE ENERGIE). Seuls les noms des prospects sont floutés (choix d'Ugo, 13/10 : « ne floute rien »).
const IMG = (f) => `/presentation-pac/${f}`;

function Build({ n, title, text, caption, children }) {
  return (
    <div className="pp-slide pp-build">
      <div className="pp-build-text">
        <p className="pp-eyebrow">Ce qu’on met en place · {n}/5</p>
        <h2>{title}</h2>
        <p className="pp-lead">{text}</p>
        <p className="pp-caption">{caption}</p>
      </div>
      <motion.div className="pp-build-visual" initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.15, duration: 0.6, ease: EASE }}>
        {children}
      </motion.div>
    </div>
  );
}

function Browser({ src, alt, crop }) {
  return (
    <div className="pp-browser">
      <div className="pp-browser-bar" aria-hidden="true"><i /><i /><i /></div>
      <img src={IMG(src)} alt={alt} className={crop ? 'is-crop' : undefined} draggable="false" />
    </div>
  );
}


// Maquettes de pubs Instagram (aucune vraie pub de client) : photo, vidéo (Reels) et carrousel.
function PacArt({ variant = 0, id }) {
  const skies = [['#7DB7F5', '#DCEBFB'], ['#F6B27A', '#FCE3CC'], ['#8EC5E8', '#E8F4FB']];
  const [s1, s2] = skies[variant % 3];
  return (
    <svg viewBox="0 0 400 500" className="pp-art" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={`sk${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={s1} /><stop offset="1" stopColor={s2} /></linearGradient>
        <linearGradient id={`gr${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7FB069" /><stop offset="1" stopColor="#4E8A3E" /></linearGradient>
        <linearGradient id={`wall${id}`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#F3EEE6" /><stop offset="1" stopColor="#E2DACD" /></linearGradient>
        <linearGradient id={`unit${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FAFBFC" /><stop offset="1" stopColor="#D5DAE1" /></linearGradient>
        <radialGradient id={`fan${id}`}><stop offset="0" stopColor="#4B5563" /><stop offset="1" stopColor="#1F2937" /></radialGradient>
      </defs>
      <rect width="400" height="500" fill={`url(#sk${id})`} />
      <circle cx="330" cy="80" r="34" fill="#FFF7D6" opacity=".8" />
      <path d="M0 300 Q120 270 220 292 T400 280 V500 H0 Z" fill="#9CC28A" opacity=".55" />
      <rect y="352" width="400" height="148" fill={`url(#gr${id})`} />
      {/* maison */}
      <path d="M48 356 V214 L178 128 L308 214 V356 Z" fill={`url(#wall${id})`} />
      <path d="M30 222 L178 118 L326 222 L310 232 L178 140 L46 232 Z" fill="#3F4652" />
      <rect x="78" y="250" width="58" height="52" rx="3" fill="#2B3441" /><rect x="82" y="254" width="50" height="44" fill="#9CC6EA" opacity=".9" /><path d="M107 254 V298 M82 276 H132" stroke="#E5E7EB" strokeWidth="3" />
      <rect x="192" y="262" width="52" height="94" rx="3" fill="#6B4F3A" /><circle cx="234" cy="312" r="3" fill="#E5C07B" />
      <rect x="40" y="352" width="276" height="8" fill="#B9AFA0" />
      {/* pompe à chaleur extérieure */}
      <ellipse cx="350" cy="372" rx="58" ry="8" fill="#000" opacity=".18" />
      <rect x="298" y="298" width="104" height="70" rx="6" fill={`url(#unit${id})`} stroke="#AEB6C2" strokeWidth="2" />
      <circle cx="334" cy="333" r="24" fill={`url(#fan${id})`} />
      {[0, 1, 2, 3].map((k) => <path key={k} d={`M334 333 L${334 + 20 * Math.cos(k * 1.57)} ${333 + 20 * Math.sin(k * 1.57)}`} stroke="#9CA3AF" strokeWidth="5" strokeLinecap="round" />)}
      <circle cx="334" cy="333" r="24" fill="none" stroke="#6B7280" strokeWidth="2" />
      {[0, 1, 2, 3, 4].map((k) => <rect key={k} x="368" y={312 + k * 9} width="24" height="3" rx="1.5" fill="#9AA3AF" />)}
      <rect x="300" y="366" width="8" height="10" fill="#6B7280" /><rect x="392" y="366" width="8" height="10" fill="#6B7280" />
      {/* haie */}
      <ellipse cx="20" cy="352" rx="40" ry="22" fill="#3E7A35" /><ellipse cx="70" cy="356" rx="30" ry="16" fill="#4C8C40" />
    </svg>
  );
}

const Icon = {
  heart: <path d="M12 20.5s-7.5-4.6-9.3-9.2C1.4 7.9 3.6 4.5 7 4.5c2 0 3.6 1.2 5 3 1.4-1.8 3-3 5-3 3.4 0 5.6 3.4 4.3 6.8-1.8 4.6-9.3 9.2-9.3 9.2z" />,
  comment: <path d="M20.5 11.5a8.5 8.5 0 0 1-12.6 7.4L3.5 20l1.2-4.1A8.5 8.5 0 1 1 20.5 11.5z" />,
  send: <path d="M21.5 3 10.5 13.8M21.5 3l-6.8 18-4.2-7.2L3 9.8 21.5 3z" />,
  save: <path d="M18.5 21 12 16.5 5.5 21V4.5a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1V21z" />,
};
const Ico = ({ name, size = 22 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" strokeLinecap="round">{Icon[name]}</svg>;

function StatusBar({ dark }) {
  return (
    <div className={`pp-ig-status${dark ? ' is-dark' : ''}`}>
      <b>9:41</b>
      <span className="pp-ig-sys"><i /><i /><i /><em /></span>
    </div>
  );
}

function IgHeader({ dark }) {
  return (
    <div className={`pp-ig-head${dark ? ' is-dark' : ''}`}>
      <span className="pp-ig-ring"><span /></span>
      <span className="pp-ig-name"><b>votre_entreprise</b><small>Sponsorisé</small></span>
      <span className="pp-ig-more">•••</span>
    </div>
  );
}

function AdMock({ kind }) {
  if (kind === 'video') {
    return (
      <div className="pp-phone pp-ig is-reel">
        <PacArt variant={1} id="v" />
        <div className="pp-reel-shade" />
        <StatusBar dark />
        <div className="pp-reel-progress"><i /></div>
        <p className="pp-reel-title">3 erreurs avant d’installer une pompe à chaleur</p>
        <div className="pp-reel-side">
          <span><Ico name="heart" size={24} /></span><span><Ico name="comment" size={24} /></span><span><Ico name="send" size={24} /></span>
        </div>
        <div className="pp-reel-bottom">
          <IgHeader dark />
          <p>Avant de changer de chauffage, regardez ça…</p>
          <span className="pp-reel-cta">En savoir plus <b>›</b></span>
        </div>
      </div>
    );
  }
  return (
    <div className="pp-phone pp-ig">
      <StatusBar />
      <IgHeader />
      <div className="pp-ig-media">
        {kind === 'photo' ? <PacArt variant={0} id="p" /> : (
          <div className="pp-ig-track">
            {[0, 2, 1].map((v, k) => (
              <div key={k} className="pp-ig-slide">
                <PacArt variant={v} id={`c${k}`} />
                <span className="pp-ig-slide-t">{['Combien ça coûte ?', 'Quelles aides ?', 'En combien de temps ?'][k]}</span>
              </div>
            ))}
          </div>
        )}
        {kind === 'carousel' && <span className="pp-ig-count">1/3</span>}
      </div>
      <span className="pp-ig-cta">En savoir plus <b>›</b></span>
      <div className="pp-ig-actions">
        <Ico name="heart" /><Ico name="comment" /><Ico name="send" />
        {kind === 'carousel' && <span className="pp-ig-dots"><i className="on" /><i /><i /></span>}
        <span className="pp-ig-save"><Ico name="save" /></span>
      </div>
      <p className="pp-ig-caption"><b>votre_entreprise</b> {kind === 'photo' ? 'Votre chaudière vous coûte trop cher ? Faites le point en 2 minutes.' : 'Trois questions à vous poser avant de changer de chauffage 👉'}</p>
    </div>
  );
}

const BUILD_SLIDES = [
  () => (
    <Build n={1} title={<>Des pubs qui <span className="pp-grad">arrêtent le pouce.</span></>}
      text="Photo, vidéo, carrousel : sur Facebook et Instagram, plusieurs formats et plusieurs angles diffusés en même temps, pour trouver celui qui fait réagir vos clients."
      caption="Les trois formats de publicité (maquettes d’exemple).">
      <div className="pp-phones">
        {[['photo', 'Photo'], ['video', 'Vidéo'], ['carousel', 'Carrousel']].map(([kind, label], i) => (
          <figure key={kind} className="pp-format" style={{ transform: `translateY(${[18, -10, 24][i]}px) rotate(${[-4, 0, 4][i]}deg)` }}>
            <AdMock kind={kind} />
            <figcaption>{label}</figcaption>
          </figure>
        ))}
      </div>
    </Build>
  ),
  () => (
    <Build n={2} title={<>Une campagne <span className="pp-grad">construite pour apprendre.</span></>}
      text="Campagne, ensembles de publicités, annonces : chaque pub est mesurée séparément, sur votre zone, pour savoir laquelle fonctionne."
      caption="Gestionnaire de publicités d’une campagne en cours.">
      <Browser src="campagne.jpg" alt="Gestionnaire de publicités Meta : trois annonces actives" />
    </Build>
  ),
  () => (
    <Build n={3} title={<>Une page <span className="pp-grad">dédiée à l’offre.</span></>}
      text="Un message clair, une preuve, et un formulaire en étapes qui qualifie la demande avant qu’elle arrive chez vous."
      caption="Landing page réalisée pour un client.">
      <Browser src="landing.jpg" alt="Landing page avec un formulaire en étapes" />
    </Build>
  ),
  () => (
    <Build n={4} title={<>Chaque lead arrive <span className="pp-grad">dans votre CRM.</span></>}
      text="Un pipeline à vos étapes, les rappels et les relances. Et l’espace Pilotage, qui relie chaque lead à la publicité qui l’a amené."
      caption="CRM et espace Pilotage d’un client, noms des prospects floutés.">
      <div className="pp-stack">
        <Browser src="crm-pipeline.jpg" alt="Pipeline du CRM, colonnes par étape" />
        <div className="pp-stack-front"><Browser src="crm-pilotage-haut.jpg" alt="Espace Pilotage : dépense, leads, signés" crop /></div>
      </div>
    </Build>
  ),
  () => (
    <Build n={5} title={<>On garde <span className="pp-grad">ce qui fait signer.</span></>}
      text="Chaque pub est jugée sur les leads, les rendez-vous et les signatures, pas sur les clics. Le budget va aux annonces qui signent."
      caption="Espace Finance d’un client : coût par lead jour par jour, chiffre d’affaires et taux de conversion.">
      <Browser src="finance.jpg" alt="Espace Finance du CRM : coût par lead et conversion" />
    </Build>
  ),
];

const SLIDES = [
  // 0 · Couverture
  ({ next }) => (
    <div className="pp-cover">
      <div className="pp-brand"><KairnLogo size={44} /><span>Kairn</span></div>
      <p className="pp-eyebrow">Génération de leads · Pompe à chaleur</p>
      <h1>Des demandes de pompe à chaleur, <span className="pp-grad">chaque jour.</span></h1>
      <p className="pp-lead">Deux façons de travailler ensemble. Vous choisissez celle qui vous convient.</p>
      <button type="button" className="pp-btn" onClick={next}>Commencer <span aria-hidden="true">→</span></button>
    </div>
  ),
  // 1 · Le constat
  () => (
    <div className="pp-slide">
      <p className="pp-eyebrow">Le constat</p>
      <h2>Un lead ne vaut que <span className="pp-grad">s’il signe.</span></h2>
      <div className="pp-cards two">
        <div className="pp-card is-good">
          <p className="pp-card-t">Le lead exclusif</p>
          <p>Envoyé à vous seul. Pas de course au téléphone contre d’autres installateurs, pas de négociation sur le prix.</p>
          <p className="pp-instead">Au lieu du lead partagé, vendu à plusieurs entreprises en même temps.</p>
        </div>
        <div className="pp-card is-good">
          <p className="pp-card-t">Le lead qualifié</p>
          <p>Propriétaire, maison, projet et délai renseignés avant l’appel : vous ne rappelez que des projets réels.</p>
          <p className="pp-instead">Au lieu du locataire, de l’appartement ou du projet flou : un appel pour rien.</p>
        </div>
      </div>
      <p className="pp-foot">C’est la base de nos deux modèles.</p>
    </div>
  ),
  // 2 · Les deux modèles
  ({ go }) => (
    <div className="pp-slide">
      <p className="pp-eyebrow">Deux modèles</p>
      <h2>Vous achetez des leads, <span className="pp-grad">ou vous avez votre campagne.</span></h2>
      <div className="pp-cards two">
        <button type="button" className="pp-card pp-model" onClick={() => go(3)}>
          <span className="pp-tag">Modèle 1</span>
          <p className="pp-card-t big">Achat de leads</p>
          <p className="pp-price">{eur(PRICE)} <small>le lead</small></p>
          <p>Vous recevez des demandes qualifiées et vous payez à la pièce. Rien d’autre à gérer.</p>
          <span className="pp-more">Voir le détail →</span>
        </button>
        <button type="button" className="pp-card pp-model is-accent" onClick={() => go(4)}>
          <span className="pp-tag">Modèle 2</span>
          <p className="pp-card-t big">Votre campagne</p>
          <p className="pp-price">Plancher {eur(FLOOR)} <small>par lead</small></p>
          <p>Une campagne à votre nom. Vous payez Meta, nous facturons l’écart entre le coût publicitaire d’un lead et {eur(FLOOR)}.</p>
          <span className="pp-more">Voir le détail →</span>
        </button>
      </div>
    </div>
  ),
  // 3 · Modèle 1
  () => (
    <div className="pp-slide pp-split">
      <div>
        <span className="pp-tag">Modèle 1</span>
        <h2>Achat de leads&nbsp;: <span className="pp-grad">{eur(PRICE)} le lead.</span></h2>
        <p className="pp-lead">Exclusif : chaque lead n’est envoyé qu’à vous.</p>
        <div className="pp-best"><b>Idéal pour</b> démarrer vite, sans rien gérer.</div>
      </div>
      <Steps items={[
        'Nous diffusons nos campagnes pompe à chaleur dans votre zone.',
        <><b>Nous définissons ensemble vos critères</b> : propriétaire, maison, chauffage actuel, zone, délai du projet. Chaque demande passe par un formulaire qui les vérifie.</>,
        'Vous recevez le lead. Il n’est envoyé qu’à vous.',
        `Vous payez ${eur(PRICE)} par lead reçu.`,
      ]} />
    </div>
  ),
  // 4 · Modèle 2
  () => (
    <div className="pp-slide pp-split">
      <div>
        <span className="pp-tag accent">Modèle 2</span>
        <h2>Votre campagne, <span className="pp-grad">à votre nom.</span></h2>
        <p className="pp-lead">Vous payez directement le budget publicitaire à Meta. Nous facturons seulement l’écart jusqu’à {eur(FLOOR)} par lead.</p>
        <div className="pp-rule">
          <p className="pp-rule-t">Notre rémunération, en toute transparence</p>
          <p className="pp-formula">{eur(FLOOR)} <i>−</i> coût publicitaire du lead</p>
          <p>Si un lead vous coûte {eur(FLOOR)} ou plus en budget publicitaire, nous ne facturons rien.</p>
        </div>
        <div className="pp-best pp-fame"><b>En prime, votre notoriété.</b> Chaque jour, les propriétaires de votre zone voient le nom de votre entreprise, y compris ceux qui ne remplissent pas le formulaire.</div>
      </div>
      <Steps items={[
        'Nous créons votre campagne Facebook et Instagram, sur votre compte publicitaire Meta.',
        'Nous construisons la page et le formulaire qui qualifient les demandes.',
        'Vous payez directement la publicité à Meta.',
        `Pour chaque lead reçu, nous facturons la différence entre ${eur(FLOOR)} et ce qu’il vous a coûté en budget publicitaire.`,
      ]} />
    </div>
  ),
  // 5 à 9 · Ce qu'on met en place
  ...BUILD_SLIDES,
  // 10 · Simulateur
  () => (
    <div className="pp-slide">
      <p className="pp-eyebrow">Faites le calcul</p>
      <h2>Ce que coûte un lead, <span className="pp-grad">dans chaque modèle.</span></h2>
      <Simulator />
    </div>
  ),
  // 11 · Conversion
  () => (
    <div className="pp-slide pp-conv">
      <p className="pp-eyebrow">Quelle conversion attendre ?</p>
      <h2>Le lead ouvre la porte, <span className="pp-grad">votre équipe signe.</span></h2>
      <div className="pp-factors">
        <div className="pp-factor is-key">
          <b>Votre délai de rappel</b>
          <p>Le facteur n°1. Rappelé dans l’heure, un lead a 7 fois plus de chances d’aboutir à un vrai échange qu’une heure plus tard.</p>
          <small>Harvard Business Review, 2011, sur 1,25 million de leads</small>
        </div>
        <div className="pp-factor">
          <b>Vos commerciaux</b>
          <p>Leur aisance au téléphone et en visite technique.</p>
        </div>
        <div className="pp-factor">
          <b>Vos process</b>
          <p>Relances, rapidité du devis, suivi des aides.</p>
        </div>
      </div>
      <Earnings />
      <p className="pp-caption">Repère : une pompe à chaleur air-eau coûte de 10 000 à 18 000 € pose incluse (La Prime Effy, 2026).</p>
    </div>
  ),
  // 12 · Comparatif
  () => (
    <div className="pp-slide">
      <p className="pp-eyebrow">En résumé</p>
      <h2>Les deux modèles, <span className="pp-grad">côte à côte.</span></h2>
      <div className="pp-table" role="table">
        {[
          ['', 'Modèle 1 · Achat de leads', 'Modèle 2 · Votre campagne'],
          ['Prix par lead', `${eur(PRICE)}`, `${eur(FLOOR)} au total (budget publicitaire + Kairn) ; si le budget publicitaire d’un lead dépasse ${eur(FLOOR)}, vous ne payez que ce budget`],
          ['Qui paie le budget publicitaire', 'Kairn', 'Vous, directement à Meta'],
          ['Leads exclusifs', 'Oui', 'Oui'],
          ['Campagne et compte publicitaire', 'Chez Kairn', 'À votre nom'],
          ['Idéal pour', 'Démarrer vite, sans rien gérer', 'Avoir votre propre source de chantiers'],
        ].map((row, r) => (
          <div key={r} className={`pp-tr${r === 0 ? ' is-head' : ''}`} role="row">
            {row.map((c, k) => <div key={k} className="pp-td" role={r === 0 ? 'columnheader' : 'cell'}>{c}</div>)}
          </div>
        ))}
      </div>
    </div>
  ),
  // 13 · Clôture
  ({ choice, setChoice }) => (
    <div className="pp-cover">
      <p className="pp-eyebrow">Et maintenant</p>
      <h1>Par lequel <span className="pp-grad">on commence ?</span></h1>
      <div className="pp-choice" onPointerDown={(e) => e.stopPropagation()}>
        {['Achat de leads', 'Votre campagne'].map((c, i) => (
          <button key={c} type="button" className={`pp-choice-b${choice === i ? ' is-on' : ''}`} onClick={() => setChoice(i)}>
            <span className="pp-tag">Modèle {i + 1}</span>{c}
          </button>
        ))}
      </div>
      <p className="pp-contact"><KairnLogo size={26} /> Kairn · {CONTACT_EMAIL} · kairnagency.com</p>
    </div>
  ),
];

export default function PresentationPac() {
  useV2Favicon();
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const [choice, setChoice] = useState(null);
  const touch = useRef(null);
  const last = SLIDES.length - 1;

  const go = useCallback((n) => {
    const to = Math.max(0, Math.min(last, n));
    setDir(to >= i ? 1 : -1);
    setI(to);
  }, [i, last]);
  const next = useCallback(() => go(i + 1), [go, i]);
  const prev = useCallback(() => go(i - 1), [go, i]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.target instanceof HTMLInputElement) return; // les flèches règlent le curseur du simulateur
      if (['ArrowRight', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); next(); }
      if (['ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); prev(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev]);

  // Balayage horizontal pour changer d'étape (les commandes interactives l'interceptent).
  const onTouchStart = (e) => {
    // Pas de balayage depuis une commande (curseur, bouton) : on la laisse fonctionner.
    if (e.target.closest('input, button, .pp-sim, .pp-choice')) { touch.current = null; return; }
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e) => {
    if (!touch.current) return;
    const dx = e.changedTouches[0].clientX - touch.current.x;
    const dy = e.changedTouches[0].clientY - touch.current.y;
    touch.current = null;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) (dx < 0 ? next : prev)();
  };

  const Slide = SLIDES[i];
  return (
    <div className="pp" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="pp-glow" aria-hidden="true" />
      <div className="pp-progress" aria-hidden="true"><i style={{ width: `${(i / last) * 100}%` }} /></div>

      <main className="pp-stage">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.section
            key={i}
            className="pp-frame"
            custom={dir}
            initial={{ opacity: 0, x: dir * 60, filter: 'blur(6px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: dir * -60, filter: 'blur(6px)' }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <Slide next={next} go={go} choice={choice} setChoice={setChoice} />
          </motion.section>
        </AnimatePresence>
      </main>

      <nav className="pp-nav" aria-label="Étapes">
        <button type="button" className="pp-arrow" onClick={prev} disabled={i === 0} aria-label="Étape précédente">←</button>
        <div className="pp-dots">
          {SLIDES.map((_, k) => <button key={k} type="button" className={k === i ? 'is-on' : undefined} onClick={() => go(k)} aria-label={`Étape ${k + 1}`} />)}
        </div>
        <button type="button" className="pp-arrow" onClick={next} disabled={i === last} aria-label="Étape suivante">→</button>
      </nav>
    </div>
  );
}
