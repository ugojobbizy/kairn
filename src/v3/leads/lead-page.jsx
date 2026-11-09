import React from 'react';
import { Link } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { Nav, Footer, useV2Favicon } from '../../v2/layout.jsx';
import Booking from '../../v2/booking.jsx';
import { AuditHeader } from '../../v2/trust.jsx';
import { Reveal, FaqList } from '../../v2/blocks.jsx';
import { CONTACT_EMAIL } from '../../config.js';
import { AUTHOR } from '../../blog/meta.js';
import { GARANTIES, prixHT } from '../produits.js';
import { prixDe, commandeHref, parSlug, dateMaj, MINIMUM } from './thematiques.js';
import '../../v2/v2.css';
import '../v3.css';
import '../police.css';
import './leads.css';

// Gabarit des pages « Leads {thématique} » (plan du 09/11/2026, SEO et GEO).
// Même ordre partout (Cache Brain, SPIO #5, m152 : promesse, preuve, offre, questions, action) ;
// tout le texte propre au métier vient de thematiques.js. Les blocs communs (production, exclusif ou mutualisé)
// restent courts pour que chaque page garde une majorité de texte qui lui est propre.

function Check() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>;
}

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

const ETAPES = (t) => [
  ['Une campagne par métier', `Nous diffusons des publicités Meta (Facebook, Instagram) dédiées ${t.pourLe}, sur les départements que vous avez choisis. Kairn paie la publicité.`],
  ['Un formulaire qui filtre', `La personne répond elle-même aux questions qui comptent dans votre métier. Celles qui ne correspondent pas à vos critères ne vous sont pas envoyées.`],
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

export default function LeadPage({ slug }) {
  useV2Favicon();
  const t = parSlug(slug);
  const prix = prixDe(t);
  const parent = t.parent ? parSlug(t.parent) : null;
  const fil = [['Accueil', '/'], ['Leads', '/leads'], ...(parent ? [[parent.court, `/${parent.slug}`]] : []), [t.court, null]];
  const enfants = (t.enfants || []).map(parSlug).filter((x) => x.pret);
  const proches = (t.proches || []).map(parSlug).filter((x) => x.pret);
  const href = commandeHref(t);

  return (
    <MotionConfig reducedMotion="user">
      <div className="v2 v3 font-tight ld">
        <a href="#contenu" className="skip">Aller au contenu</a>
        <Nav light shop />

        <main id="contenu">
          {/* ── Haut : la réponse d'emblée (ce que c'est, pour qui, le prix) ── */}
          <section className="hero is-light ld-hero">
            <Halos />
            <div className="aurora-grid" aria-hidden="true" />
            <div className="wrap ld-hero-inner">
              <Fil items={fil} />
              <p className="eyebrow">Kairn Leads · {t.court}</p>
              <h1>{t.h1[0]} <span className="serif grad-text">{t.h1[1]}</span></h1>
              <p className="hero-lead ld-chapo">{t.chapo}</p>
              <div className="ld-actions">
                <Link to={href} className="btn btn-order">Commander des leads {t.motCommande}</Link>
                <a href="#reserver" className="btn btn-light">Réserver un appel</a>
              </div>
              <ul className="ld-badges" aria-label="Conditions">
                <li><b>{prix ? prixHT(prix) : 'Sur devis'}</b> {prix ? 'le contact' : 'prix donné avant commande'}</li>
                <li><b>Exclusif</b> envoyé à vous seul</li>
                <li><b>Sans engagement</b> à partir de {MINIMUM} contacts</li>
              </ul>
            </div>
          </section>

          {/* ── En bref : faits vérifiables, lisibles par un humain pressé et par les moteurs de réponse ── */}
          <section className="band ld-band" id="en-bref">
            <div className="wrap">
              <Reveal className="sec-head sec-head-left">
                <p className="eyebrow">En bref</p>
                <h2 className="h2">Les leads {t.motTitre} Kairn, <span className="serif grad-text">en {t.bref ? 8 : 7} points.</span></h2>
              </Reveal>
              <Reveal>
                <table className="ld-bref">
                  <caption className="sr-only">Conditions des leads {t.motTitre} Kairn</caption>
                  <tbody>
                    <tr><th scope="row">Ce que vous achetez</th><td>{t.definition}</td></tr>
                    <tr><th scope="row">Prix</th><td>{prix ? `${prixHT(prix)} le contact, payé sur bon de commande, par virement.` : 'Sur devis : le prix dépend de la zone, du volume et des critères. Il vous est donné avant toute commande.'}</td></tr>
                    <tr><th scope="row">Exclusivité</th><td>Chaque contact est envoyé à un seul professionnel, jamais revendu.</td></tr>
                    <tr><th scope="row">Livraison</th><td>Au fil des demandes, chaque jour, dans votre espace client (export Excel ou CSV, alerte e-mail ou mobile).</td></tr>
                    <tr><th scope="row">Zone</th><td>Partout en France métropolitaine : départements, régions{t.groupe === 'renovation' ? ' ou zones climatiques' : ''}, choisis à la commande.</td></tr>
                    <tr><th scope="row">Engagement</th><td>Aucun. Première commande à partir de {MINIMUM} contacts, vous arrêtez quand vous voulez.</td></tr>
                    <tr><th scope="row">Remplacement</th><td>Doublon ou hors zone : signalé depuis votre espace, remplacé après vérification.</td></tr>
                    {t.bref && <tr><th scope="row">{t.bref[0]}</th><td>{t.bref[1]}</td></tr>}
                  </tbody>
                </table>
              </Reveal>
              <p className="ld-maj">Mis à jour le <time dateTime={t.maj}>{dateMaj(t.maj)}</time> par {AUTHOR.name}, fondateur de Kairn.</p>
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
                <div className="ld-cards">
                  {enfants.map((e) => (
                    <Link key={e.slug} to={`/${e.slug}`} className="ld-card is-link">
                      <h3>{e.label}</h3>
                      <p>{e.resume}</p>
                      <span className="ld-more">Voir la page</span>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ── Ce que contient un lead ── */}
          <section className="band ld-band has-halos" id="contenu-lead">
            <Halos />
            <div className="wrap ld-split">
              <Reveal className="sec-head sec-head-left">
                <p className="eyebrow">Ce que vous recevez</p>
                <h2 className="h2">Ce que contient <span className="serif grad-text">un lead {t.motTitre}.</span></h2>
                <p>{t.qualif}</p>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="ld-fiche" role="group" aria-label={`Exemple de fiche d’un lead ${t.motTitre}`}>
                  <div className="ld-fiche-head"><span className="ld-dot" /> Nouveau contact · {t.court}</div>
                  <dl>
                    <div><dt>Coordonnées</dt><dd>Nom, téléphone, e-mail, code postal</dd></div>
                    {t.champs.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
                    <div><dt>Demande</dt><dd>Date et heure, réponses au formulaire</dd></div>
                  </dl>
                  <p className="ld-fiche-note">Exemple de champs. Les questions se règlent avec vous avant le lancement.</p>
                </div>
              </Reveal>
            </div>
          </section>

          {/* ── Comment nous produisons ces leads ── */}
          <section className="band ld-band" id="production">
            <div className="wrap">
              <Reveal className="sec-head sec-head-left">
                <p className="eyebrow">Comment ça marche</p>
                <h2 className="h2">De la publicité <span className="serif grad-text">à votre téléphone.</span></h2>
              </Reveal>
              <ol className="ld-steps">
                {ETAPES(t).map(([h, d], i) => (
                  <Reveal as="li" key={h} delay={i * 0.06}><span className="ld-num">{String(i + 1).padStart(2, '0')}</span><h3>{h}</h3><p>{d}</p></Reveal>
                ))}
              </ol>
              <p className="ld-link-line">Votre espace client en détail : <Link to="/plateforme">la plateforme Kairn</Link>.</p>
            </div>
          </section>

          {/* ── Pour qui ── */}
          <section className="band ld-band" id="pour-qui">
            <div className="wrap">
              <Reveal className="sec-head sec-head-left">
                <p className="eyebrow">Pour qui</p>
                <h2 className="h2">{t.pourQuiTitre[0]} <span className="serif grad-text">{t.pourQuiTitre[1]}</span></h2>
              </Reveal>
              <div className="ld-cards">
                {t.pourQui.map(([h, d], i) => (
                  <Reveal key={h} delay={i * 0.06} className="ld-card"><h3>{h}</h3><p>{d}</p></Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* ── Exclusif ou mutualisé ── */}
          <section className="band ld-band" id="exclusif">
            <div className="wrap">
              <Reveal className="sec-head sec-head-left">
                <p className="eyebrow">Exclusif ou mutualisé</p>
                <h2 className="h2">Un lead exclusif, <span className="serif grad-text">c’est un appel sans concurrent.</span></h2>
                <p>{t.exclusif}</p>
              </Reveal>
              <Reveal>
                <div className="ld-scroll">
                  <table className="ld-compare">
                    <thead><tr><th scope="col"><span className="sr-only">Critère</span></th><th scope="col">Lead partagé<small>plateformes, annuaires</small></th><th scope="col">Lead exclusif Kairn<small>Kairn Leads</small></th><th scope="col">Campagne en propre<small>Kairn Pilotage</small></th></tr></thead>
                    <tbody>
                      {COMPARE(prix).map(([k, a, b, c]) => <tr key={k}><th scope="row">{k}</th><td>{a}</td><td><Check />{b}</td><td>{c}</td></tr>)}
                    </tbody>
                  </table>
                </div>
              </Reveal>
            </div>
          </section>

          {/* ── Marché en chiffres, sourcés et datés ── */}
          {t.marche && (
            <section className="band ld-band has-halos" id="marche">
              <Halos />
              <div className="wrap">
                <Reveal className="sec-head sec-head-left">
                  <p className="eyebrow">Le marché</p>
                  <h2 className="h2">{t.marcheTitre[0]} <span className="serif grad-text">{t.marcheTitre[1]}</span></h2>
                  {t.marcheIntro && <p>{t.marcheIntro}</p>}
                </Reveal>
                <div className="ld-stats">
                  {t.marche.map((c, i) => (
                    <Reveal key={c.l} delay={i * 0.05} className="ld-stat">
                      <b className={c.v.length > 9 ? "is-long" : undefined}>{c.v}</b>
                      <p>{c.l}</p>
                      <small>Source : <a href={c.url} target="_blank" rel="noopener noreferrer">{c.src}</a></small>
                    </Reveal>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ── Cadre légal ── */}
          <section className="band ld-band" id="cadre-legal">
            <div className="wrap ld-split">
              <Reveal className="sec-head sec-head-left">
                <p className="eyebrow">Cadre légal</p>
                <h2 className="h2">Ce que dit la loi <span className="serif grad-text">sur ces contacts.</span></h2>
                <p>Des règles simples, mais qui coûtent cher quand on les ignore. Ce résumé n’est pas un avis juridique.</p>
              </Reveal>
              <ul className="ld-legal">
                {t.legal.map(([h, d]) => (
                  <Reveal as="li" key={h}><h3>{h}</h3><p><Riche v={d} /></p></Reveal>
                ))}
              </ul>
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
                <ul className="ld-proches">
                  {proches.map((p) => <li key={p.slug}><Link to={`/${p.slug}`}>{p.label}</Link></li>)}
                  <li><Link to="/leads">Toutes les thématiques</Link></li>
                </ul>
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
