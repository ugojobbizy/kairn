import React from 'react';
import { Link } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { Nav, Footer, useV2Favicon } from '../../v2/layout.jsx';
import Booking from '../../v2/booking.jsx';
import { AuditHeader } from '../../v2/trust.jsx';
import { Reveal, FaqList } from '../../v2/blocks.jsx';
import { CONTACT_EMAIL } from '../../config.js';
import { GARANTIES, prixHT } from '../produits.js';
import { prixDe, commandeHref, parSlug, MINIMUM } from './thematiques.js';
import { CONTENUS } from './contenus.js';
import {
  Check, Ico, usePlay, VisToasts, VisSeul, VisCampagne, VisForm, VisPipe,
} from './lead-visuals.jsx';
import '../../v2/v2.css';
import '../v3.css';
import '../police.css';
import './leads.css';

// Gabarit des pages « Leads {thématique} » (plan du 09/11/2026, SEO et GEO).
// Ordre : promesse, preuve, offre, questions, action (Cache Brain, SPIO #5, m152). Tout le texte propre au métier vient de thematiques.js.
// Design refait le 09/11/2026 (Ugo : « tu me fais vraiment un truc basique ») : chaque section porte un visuel,
// dans le vocabulaire des cartes illustrées de l'accueil.

function Halos() {
  return <div className="halos" aria-hidden="true"><i className="halo-a" /><i className="halo-b" /></div>;
}

// Texte avec liens : une chaîne simple, ou une liste de morceaux [texte] / [texte, url].
function Riche({ v }) {
  if (typeof v === 'string') return v;
  return v.map((m, i) => (m[1]
    ? <a key={i} href={m[1]} target="_blank" rel="noopener noreferrer">{m[0]}</a>
    : <React.Fragment key={i}>{m[0]}</React.Fragment>));
}

export function Fil({ items }) {
  return (
    <nav className="ld-fil" aria-label="Fil d’Ariane">
      <ol>
        {items.map(([label, to], i) => (
          <li key={label}>{to && i < items.length - 1 ? <Link to={to}>{label}</Link> : <span aria-current="page">{label}</span>}</li>
        ))}
      </ol>
    </nav>
  );
}

// Départements fictifs des notifications animées.
const DEPS = ['33', '31', '44', '69', '13', '59', '35', '64'];

const ETAPES = (t) => [
  ['Une campagne par métier', `Nous diffusons des publicités Meta (Facebook, Instagram) dédiées ${t.pourLe}, sur les départements que vous avez choisis. Kairn paie la publicité.`],
  ['Un formulaire qui filtre', 'La personne répond elle-même aux questions qui comptent dans votre métier. Celles qui ne correspondent pas à vos critères ne vous sont pas envoyées.'],
  ['Livré à vous seul', 'Le contact arrive dans votre espace client dès que la demande est faite, avec ses réponses, la date et l’heure. Il n’est envoyé à aucun autre professionnel.'],
  ['Suivi jusqu’à la signature', 'Dans votre espace : appel, SMS, rappel, rendez-vous, motif de perte. Doublon ou hors zone : vous le signalez, il est remplacé après vérification.'],
];

// Trois façons d'avoir des demandes (gabarit transmis le 09/11/2026) : sans chiffre sur les plateformes,
// faute de source datée pour chacune ; délai et engagement de Pilotage repris de FAQ_LEADS et d'offers-compare-v2.
const COMPARE = (prix) => [
  ['Prix', 'Au contact ou par abonnement, selon la plateforme', prix ? `${prixHT(prix)} le contact` : 'Sur devis, au contact', 'Sur devis, plus votre budget publicitaire'],
  ['Exclusivité', 'La même demande part souvent à plusieurs professionnels', 'Vous seul', 'Vous seul : ce sont vos campagnes'],
  ['Délai', 'Selon les demandes reçues par la plateforme', 'Chaque jour, dès la demande', 'Lancement sous 5 jours ouvrés après l’appel de cadrage'],
  ['Engagement', 'Souvent un abonnement', `Aucun, à partir de ${MINIMUM} contacts`, 'À voir ensemble'],
  ['Qui paie la publicité', 'La plateforme', 'Kairn', 'Vous, sur vos propres comptes'],
];
const COLS = [['Lead partagé', 'Plateformes, annuaires', 'is-a'], ['Lead exclusif', 'Kairn Leads', 'is-b'], ['Campagne en propre', 'Kairn Pilotage', 'is-c']];

const LEGAL_ICO = ['phone', 'message', 'user', 'badge', 'scale', 'shield'];

export default function LeadPage({ slug }) {
  useV2Favicon();
  const t = { ...parSlug(slug), ...CONTENUS[slug] };
  const prix = prixDe(t);
  const parent = t.parent ? parSlug(t.parent) : null;
  const fil = [['Accueil', '/'], ['Leads', '/leads'], ...(parent ? [[parent.court, `/${parent.slug}`]] : []), [t.court, null]];
  const enfants = (t.enfants || []).map(parSlug).filter((x) => x.pret);
  const proches = (t.proches || []).map(parSlug).filter((x) => x.pret);
  const href = commandeHref(t);
  const toasts = DEPS.map((d) => `${t.court} · ${d}`);
  const prixTxt = prix ? `${prix} €` : 'Sur devis';
  const [heroRef, heroPlay] = usePlay();
  const [brefRef, brefPlay] = usePlay();
  const [stepsRef, stepsPlay] = usePlay();
  const ex = t.exemple;

  return (
    <MotionConfig reducedMotion="user">
      <div className="v2 v3 font-tight ld">
        <a href="#contenu" className="skip">Aller au contenu</a>
        <Nav light shop />

        <main id="contenu">
          {/* ── Haut : la réponse d'emblée, et à droite le produit qui arrive ── */}
          <section className="hero is-light ld-hero">
            <Halos />
            <div className="aurora-grid" aria-hidden="true" />
            <div className="wrap ld-hero-grid">
              <div className="ld-hero-inner">
                <Fil items={fil} />
                <p className="eyebrow">Kairn Leads · {t.court}</p>
                <h1>{t.h1[0]} <span className="serif grad-text">{t.h1[1]}</span></h1>
                <p className="hero-lead ld-chapo">{t.chapo}</p>
                <div className="ld-actions">
                  <Link to={href} className="btn btn-order">Commander des leads {t.motCommande}</Link>
                  <a href="#reserver" className="btn btn-light">Réserver un appel</a>
                </div>
              </div>
              <div ref={heroRef} className={`ld-hero-vis${heroPlay ? ' is-play' : ''}`} aria-hidden="true">
                <div className="ld-hero-price">
                  <small>Prix du contact</small>
                  <b>{prixTxt}{prix && <em>HT</em>}</b>
                  <span><Check />Exclusif</span>
                  <span><Check />Sans engagement</span>
                </div>
                <div className="ld-hero-stack"><VisToasts play={heroPlay} items={toasts} /></div>
                <div className="ld-hero-chip"><span className="ld-hero-chip-dot" />À vous seul</div>
                {ex && (
                  <div className="pv pv-qualif ld-hero-qual">
                    {ex.reponses.slice(0, 3).map(([k, v]) => <div key={k} className="pv-row"><span>{k}</span><b><Check />{v}</b></div>)}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ── En bref : les faits clés (balisage dl, lu tel quel par les moteurs) ── */}
          <section className="band ld-band" id="en-bref">
            <div className="wrap">
              <Reveal className="sec-head sec-head-left">
                <p className="eyebrow">En bref</p>
                <h2 className="h2">L’essentiel, <span className="serif grad-text">avant de commander.</span></h2>
              </Reveal>
              {/* Un seul bloc (Ugo, 09/11/2026 : « il y a trop de blocs ») : le prix en panneau nuit, les autres faits en liste. */}
              <Reveal>
                <div ref={brefRef} className={`bk${brefPlay ? ' is-play' : ''}`}>
                  <div className="bk-side">
                    <p className="bk-label">Prix</p>
                    <p className="bk-price">{prix ? prixHT(prix) : 'Sur devis'}</p>
                    <p className="bk-price-l">{prix ? 'le contact, payé sur bon de commande, par virement.' : 'Le prix dépend de la zone, du volume et des critères. Il vous est donné avant toute commande.'}</p>
                    <div className="bk-toasts"><VisToasts play={brefPlay} items={toasts.slice(3).concat(toasts.slice(0, 3))} /></div>
                    <Link to={href} className="btn btn-order bk-btn">{prix ? `Commander des leads ${t.motCommande}` : 'Demander un prix'}</Link>
                  </div>
                  <dl className="bk-list">
                    {[
                      ['home', 'Ce que vous achetez', t.definition],
                      ['user', 'Exclusivité', 'Chaque contact est envoyé à un seul professionnel, jamais revendu.'],
                      ['chart', 'Livraison', 'Au fil des demandes, chaque jour, dans votre espace client (export Excel ou CSV, alerte e-mail ou mobile).'],
                      ['pin', 'Zone', `Partout en France métropolitaine : départements, régions${t.groupe === 'renovation' ? ' ou zones climatiques' : ''}, choisis à la commande.`],
                      ['badge', 'Engagement', `Aucun. Première commande à partir de ${MINIMUM} contacts, vous arrêtez quand vous voulez.`],
                      ['shield', 'Remplacement', 'Doublon ou hors zone : signalé depuis votre espace, remplacé après vérification.'],
                      ...(t.bref ? [['phone', t.bref[0], t.bref[1]]] : []),
                    ].map(([ico, k, v], i) => (
                      <div key={k} className={i === 0 ? 'is-wide' : undefined}>
                        <span className="bk-ico"><Ico name={ico} size={18} /></span>
                        <dt>{k}</dt>
                        <dd>{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </Reveal>
            </div>
          </section>

          {/* ── Sous-pages (page chapeau assurance) ── */}
          {enfants.length > 0 && (
            <section className="band ld-band" id="types">
              <div className="wrap">
                <Reveal className="sec-head sec-head-left">
                  <p className="eyebrow">Par type de contrat</p>
                  <h2 className="h2">{t.enfantsTitre[0]} <span className="serif grad-text">{t.enfantsTitre[1]}</span></h2>
                  <p>{t.enfantsIntro}</p>
                </Reveal>
                <div className="ld-links">
                  {enfants.map((e) => (
                    <Link key={e.slug} to={`/${e.slug}`} className="ld-link"><b>{e.label}</b><span>{e.resume}</span><i>→</i></Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ── Ce que contient un lead : la fiche telle qu'elle arrive (même maquette que l'accueil) ── */}
          <section className="band ld-band has-halos" id="contenu-lead">
            <Halos />
            <div className="wrap">
              <div className="ls">
                <div className="ls-head">
                  <p className="eyebrow">Ce que vous recevez</p>
                  <h2 className="h2">Ce que contient <span className="serif grad-text">un lead {t.motTitre}.</span></h2>
                </div>
                <div className="ls-text">
                  <p className="ls-lead">{t.qualif}</p>
                  <ul className="ls-points">
                    <li><Check />Nom, téléphone, e-mail et code postal.</li>
                    {t.champs.map(([k, v]) => <li key={k}><Check /><span><b>{k}</b> : {v.charAt(0).toLowerCase() + v.slice(1)}.</span></li>)}
                    <li><Check />La date et l’heure de la demande.</li>
                  </ul>
                  <p className="ld-note">Les questions se règlent avec vous avant le lancement.</p>
                </div>
                {ex && (
                  <figure className="ls-card" aria-label="Exemple de fiche lead, données fictives">
                    <div className="ls-top"><span className="ls-tag">Exemple fictif</span><span className="ls-new">Nouveau</span></div>
                    <div className="ls-who">
                      <span className="ls-avatar" aria-hidden="true">{ex.init}</span>
                      <div><b>{ex.nom}</b><span>{ex.ville}</span></div>
                    </div>
                    <p className="ls-theme">{ex.projet}</p>
                    <dl className="ls-contact">
                      <div><dt>Téléphone</dt><dd>06 •• •• •• 27</dd><span className="ls-call">Appeler</span></div>
                      <div><dt>E-mail</dt><dd>{ex.mail}</dd></div>
                    </dl>
                    <p className="ls-sub">Réponses au formulaire</p>
                    <dl className="ls-grid">{ex.reponses.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
                    <div className="ls-foot"><span>Reçu aujourd’hui à 10:42</span><span className="ls-excl">Exclusif</span></div>
                  </figure>
                )}
              </div>
            </div>
          </section>

          {/* ── Comment ça marche : 4 étapes illustrées ── */}
          <section className="band ld-band" id="production">
            <div className="wrap">
              <Reveal className="sec-head sec-head-left">
                <p className="eyebrow">Comment ça marche</p>
                <h2 className="h2">De la publicité <span className="serif grad-text">à votre téléphone.</span></h2>
              </Reveal>
              <ol ref={stepsRef} className={`pil-grid ld-steps${stepsPlay ? ' is-play' : ''}`}>
                {ETAPES(t).map(([h, d], i) => (
                  <Reveal as="li" key={h} delay={i * 0.06} className="pil-card">
                    <div className="pil-vis">
                      {i === 0 && <VisCampagne court={t.court} />}
                      {i === 1 && <VisForm play={stepsPlay} question={t.form ? t.form[0] : 'Vous êtes ?'} options={t.form ? t.form[1] : ['Propriétaire', 'Locataire']} />}
                      {i === 2 && <VisSeul />}
                      {i === 3 && <VisPipe play={stepsPlay} />}
                    </div>
                    <div className="pil-txt">
                      <span className="pil-tag"><b>{String(i + 1).padStart(2, '0')}</b>Étape</span>
                      <h3>{h}</h3>
                      <p>{d}</p>
                    </div>
                  </Reveal>
                ))}
              </ol>
              <p className="ld-link-line">Votre espace client en détail : <Link to="/plateforme">la plateforme Kairn</Link>.</p>
            </div>
          </section>

          {/* ── Pour qui : profils ── */}
          <section className="band ld-band" id="pour-qui">
            <div className="wrap">
              <Reveal className="sec-head sec-head-left">
                <p className="eyebrow">Pour qui</p>
                <h2 className="h2">{t.pourQuiTitre[0]} <span className="serif grad-text">{t.pourQuiTitre[1]}</span></h2>
              </Reveal>
              <div className="ld-who">
                {t.pourQui.map(([h, d, ico, tags], i) => (
                  <Reveal key={h} delay={i * 0.06} className="ld-who-card">
                    <div className="ld-who-head">
                      <span className="ld-who-ico"><Ico name={ico || 'user'} size={24} /></span>
                      <span className="ld-who-n">Profil {String(i + 1).padStart(2, '0')}</span>
                    </div>
                    <h3>{h}</h3>
                    <p>{d}</p>
                    {tags && <ul className="ld-tags">{tags.map((g) => <li key={g}>{g}</li>)}</ul>}
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* ── Trois façons d'avoir des demandes : la colonne Kairn Leads en pilier ── */}
          <section className="band ld-band has-halos" id="exclusif">
            <Halos />
            <div className="wrap">
              <Reveal className="sec-head sec-head-left">
                <p className="eyebrow">Exclusif ou mutualisé</p>
                <h2 className="h2">Un lead exclusif, <span className="serif grad-text">c’est un appel sans concurrent.</span></h2>
                <p>{t.exclusif}</p>
              </Reveal>
              <Reveal>
                <div className="ld-scroll">
                  <div className="ld-vs" role="table" aria-label="Lead partagé, lead exclusif Kairn ou campagne en propre">
                    <div className="ld-vs-row ld-vs-head" role="row">
                      <div className="ld-vs-k" role="columnheader"><span className="sr-only">Critère</span></div>
                      {COLS.map(([h, s, c]) => <div key={h} className={`ld-vs-c ${c}`} role="columnheader"><b>{h}</b><small>{s}</small>{c === 'is-b' && <em>Recommandé</em>}</div>)}
                    </div>
                    {COMPARE(prix).map(([k, a, b, c]) => (
                      <div key={k} className="ld-vs-row" role="row">
                        <div className="ld-vs-k" role="rowheader">{k}</div>
                        <div className="ld-vs-c is-a" role="cell" data-col={COLS[0][0]}>{a}</div>
                        <div className="ld-vs-c is-b" role="cell" data-col={COLS[1][0]}><Check />{b}</div>
                        <div className="ld-vs-c is-c" role="cell" data-col={COLS[2][0]}>{c}</div>
                      </div>
                    ))}
                    <div className="ld-vs-row ld-vs-foot" role="row">
                      <div className="ld-vs-k" />
                      <div className="ld-vs-c is-a" />
                      <div className="ld-vs-c is-b"><Link to={href} className="btn btn-order">Commander</Link></div>
                      <div className="ld-vs-c is-c"><a href="#reserver" className="btn btn-light">En parler</a></div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </section>

          {/* ── Marché en chiffres, sourcés et datés ── */}
          {t.marche && (
            <section className="band ld-band" id="marche">
              <div className="wrap">
                <Reveal className="sec-head sec-head-left">
                  <p className="eyebrow">Le marché</p>
                  <h2 className="h2">{t.marcheTitre[0]} <span className="serif grad-text">{t.marcheTitre[1]}</span></h2>
                  {t.marcheIntro && <p>{t.marcheIntro}</p>}
                </Reveal>
                <div className="ld-stats">
                  {t.marche.map((c, i) => (
                    <Reveal key={c.l} delay={i * 0.05} className={`ld-stat${i === 0 ? ' is-dark' : ''}`}>
                      <span className="ld-stat-ico"><Ico name={['chart', 'chart', 'badge', 'home'][i % 4]} size={18} /></span>
                      <b className={c.v.length > 9 ? 'is-long' : undefined}>{c.v}</b>
                      <p>{c.l}</p>
                      <small>Source : <a href={c.url} target="_blank" rel="noopener noreferrer">{c.src}</a></small>
                    </Reveal>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ── Cadre légal ── */}
          <section className="band ld-band ld-legal-band" id="cadre-legal">
            <div className="wrap ld-split">
              <Reveal className="sec-head sec-head-left ld-sticky">
                <p className="eyebrow">Cadre légal</p>
                <h2 className="h2">Ce que dit la loi <span className="serif grad-text">sur ces contacts.</span></h2>
                <p>Des règles simples, mais qui coûtent cher quand on les ignore. Ce résumé n’est pas un avis juridique.</p>
              </Reveal>
              <ol className="ld-legal">
                {t.legal.map(([h, d], i) => (
                  <Reveal as="li" key={h} delay={i * 0.04}>
                    <span className="ld-legal-ico"><Ico name={LEGAL_ICO[i % LEGAL_ICO.length]} size={20} /></span>
                    <div><h3>{h}</h3><p><Riche v={d} /></p></div>
                  </Reveal>
                ))}
              </ol>
            </div>
          </section>

          {/* ── Prix ── */}
          <section className="band ld-band" id="prix">
            <div className="wrap">
              <div className="ld-price">
                <div>
                  <p className="eyebrow">Prix</p>
                  <h2 className="h2">Combien coûte <span className="serif grad-text">un lead {t.motTitre} ?</span></h2>
                  <p>{t.prixTexte}</p>
                </div>
                <div className="ld-price-box">
                  <p className="ld-price-v">{prix ? prixHT(prix) : 'Sur devis'}</p>
                  <p className="ld-price-l">{prix ? 'le contact exclusif' : 'prix donné avant toute commande'}</p>
                  <ul>
                    {GARANTIES.map((g) => <li key={g}><Check />{g}</li>)}
                    <li><Check />Kairn paie la publicité</li>
                  </ul>
                  <Link to={href} className="btn btn-order">{prix ? `Commander des leads ${t.motCommande}` : 'Demander un prix'}</Link>
                </div>
              </div>
            </div>
          </section>

          {/* ── FAQ ── */}
          <section className="band has-halos" id="faq">
            <Halos />
            <div className="wrap faq-grid">
              <Reveal className="faq-aside">
                <p className="eyebrow">Questions</p>
                <h2 className="h2">Leads {t.motTitre} : <span className="serif grad-text">vos questions.</span></h2>
                <p>Une autre question ? Écrivez à <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>, ou posez-la en réservant un appel juste en dessous.</p>
              </Reveal>
              <FaqList items={t.faq} />
            </div>
          </section>

          {/* ── Pages proches : maillage interne ── */}
          {proches.length > 0 && (
            <section className="band ld-band" id="autres">
              <div className="wrap">
                <h2 className="ld-h3">Autres leads</h2>
                <div className="ld-links">
                  {proches.map((p) => {
                    const px = prixDe(p);
                    return <Link key={p.slug} to={`/${p.slug}`} className="ld-link"><b>{p.label}</b><span>{px ? `${prixHT(px)} le contact` : 'Sur devis'}</span><i>→</i></Link>;
                  })}
                  <Link to="/leads" className="ld-link is-all"><b>Toutes les thématiques</b><span>Le catalogue complet</span><i>→</i></Link>
                </div>
              </div>
            </section>
          )}

          {/* ── Réservation ── */}
          <section className="band band-book" style={{ paddingTop: 0 }}>
            <div className="wrap">
              <div className="book-card">
                <AuditHeader variant="appel" />
                <Booking title="Audit stratégique" intro={[`30 minutes en visio : votre métier, vos départements, le nombre de leads ${t.motTitre} qu’il vous faut. Vous repartez avec un prix et une date de démarrage.`]} />
              </div>
            </div>
          </section>
        </main>

        <Footer />
        <div className="mob-cta"><Link to={href} className="btn btn-order">Commander des leads</Link></div>
      </div>
    </MotionConfig>
  );
}
