import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { Nav, Footer, useV2Favicon } from '../../v2/layout.jsx';
import { Reveal, FaqList } from '../../v2/blocks.jsx';
import { Fil } from './lead-page.jsx';
import { Check } from './lead-visuals.jsx';
import { FAQ_CALC } from './calc-data.js';
import '../../v2/v2.css';
import '../v3.css';
import '../police.css';
import './leads.css';

// Calculateur « coût par chantier signé » (Ugo, 09/11/2026 : « J'aime bien l'idée du calculateur, intègre-le ! »).
// Outil gratuit pensé pour attirer des liens et être cité : tout le calcul se fait dans le navigateur, rien n'est envoyé.
// Les valeurs de départ sont des EXEMPLES (affichés comme tels), jamais des moyennes de marché : aucune source fiable n'existe.



const DEFAUT = { prix: 28, leads: 100, joints: 60, rdv: 40, signes: 30 };
const COMMUN = { panier: 12000, marge: 30 };

const eur = (n) => `${Math.round(n).toLocaleString('fr-FR')} €`;
const un = (n) => (n >= 10 ? Math.round(n).toLocaleString('fr-FR') : n.toLocaleString('fr-FR', { maximumFractionDigits: 1 }));

function calcul(o, c) {
  const joints = o.leads * (o.joints / 100);
  const rdv = joints * (o.rdv / 100);
  const signes = rdv * (o.signes / 100);
  const cout = o.leads * o.prix;
  const margeChantier = c.panier * (c.marge / 100);
  const tauxGlobal = o.leads ? signes / o.leads : 0;
  return {
    joints, rdv, signes, cout,
    parChantier: signes ? cout / signes : null,
    ca: signes * c.panier,
    margeNette: signes * margeChantier - cout,
    prixMax: margeChantier * tauxGlobal,
    tauxGlobal,
  };
}

// Curseur + case chiffrée (Ugo, 09/11/2026 : « que le visiteur puisse modifier le prix avec un curseur et les pourcentages »).
// La case accepte une valeur hors de la plage du curseur ; le curseur se cale alors à son bout.
function Champ({ label, aide, value, onChange, suffix, step = 1, min = 0, max, rmin = min, rmax = max }) {
  const lire = (e) => onChange(e.target.value === '' ? 0 : Number(e.target.value));
  const p = Math.max(0, Math.min(100, ((value - rmin) / (rmax - rmin)) * 100));
  return (
    <div className="calc-field">
      <label className="calc-row">
        <span className="calc-label">{label}{aide && <small>{aide}</small>}</span>
        <span className="calc-input">
          <input type="number" inputMode="decimal" value={value} step={step} min={min} max={max} onChange={lire} />
          <i>{suffix}</i>
        </span>
      </label>
      <input type="range" className="calc-range" aria-label={label} min={rmin} max={rmax} step={step} value={Math.max(rmin, Math.min(rmax, value))} onChange={lire} style={{ '--p': `${p}%` }} />
    </div>
  );
}

function Offre({ titre, o, set }) {
  const up = (k) => (v) => set({ ...o, [k]: v });
  return (
    <fieldset className="calc-offre">
      <legend>{titre}</legend>
      <Champ label="Prix du lead" value={o.prix} onChange={up('prix')} suffix="€ HT" step={1} rmin={1} rmax={150} />
      <Champ label="Leads achetés" aide="sur la période" value={o.leads} onChange={up('leads')} suffix="leads" step={10} rmin={10} rmax={1000} />
      <Champ label="Contacts joints" aide="ont décroché" value={o.joints} onChange={up('joints')} suffix="%" max={100} />
      <Champ label="Rendez-vous" aide="parmi les joints" value={o.rdv} onChange={up('rdv')} suffix="%" max={100} />
      <Champ label="Signés" aide="parmi les rendez-vous" value={o.signes} onChange={up('signes')} suffix="%" max={100} />
    </fieldset>
  );
}

function Resultat({ titre, r, meilleur }) {
  return (
    <div className={`calc-res${meilleur ? ' is-best' : ''}`}>
      <p className="calc-res-t">{titre}{meilleur && <em>Le moins cher au chantier</em>}</p>
      <p className="calc-big"><b>{r.parChantier ? eur(r.parChantier) : '–'}</b><span>de leads par chantier signé</span></p>
      <ol className="calc-funnel" aria-label="Entonnoir">
        <li><b>{un(r.joints)}</b> joints</li>
        <li><b>{un(r.rdv)}</b> rendez-vous</li>
        <li><b>{un(r.signes)}</b> chantiers signés</li>
      </ol>
      <dl className="calc-dl">
        <div><dt>Dépense en leads</dt><dd>{eur(r.cout)}</dd></div>
        <div><dt>Chiffre d’affaires signé</dt><dd>{eur(r.ca)}</dd></div>
        <div><dt>Marge après achat des leads</dt><dd className={r.margeNette < 0 ? 'is-neg' : undefined}>{eur(r.margeNette)}</dd></div>
        <div><dt>Prix maximum d’un lead</dt><dd>{eur(r.prixMax)}<small>au-delà, un chantier ne rapporte plus rien</small></dd></div>
      </dl>
    </div>
  );
}

export function Calculateur() {
  const [a, setA] = useState(DEFAUT);
  const [b, setB] = useState(null);
  const [c, setC] = useState(COMMUN);
  const ra = calcul(a, c);
  const rb = b ? calcul(b, c) : null;
  const best = rb && ra.parChantier && rb.parChantier ? (ra.parChantier <= rb.parChantier ? 'a' : 'b') : null;
  return (
    <div className="calc">
      <div className="calc-inputs">
        <fieldset className="calc-offre calc-commun">
          <legend>Votre métier</legend>
          <Champ label="Panier moyen d’un chantier" value={c.panier} onChange={(v) => setC({ ...c, panier: v })} suffix="€ HT" step={100} rmin={500} rmax={50000} />
          <Champ label="Marge brute" value={c.marge} onChange={(v) => setC({ ...c, marge: v })} suffix="%" max={100} />
        </fieldset>
        <Offre titre={b ? 'Offre A' : 'Votre offre de leads'} o={a} set={setA} />
        {b ? (
          <>
            <Offre titre="Offre B" o={b} set={setB} />
            <button type="button" className="calc-toggle" onClick={() => setB(null)}>Retirer l’offre B</button>
          </>
        ) : (
          <button type="button" className="calc-toggle" onClick={() => setB({ ...a })}>+ Comparer avec une autre offre</button>
        )}
        <p className="calc-note">Valeurs d’exemple : remplacez-les par vos chiffres. Rien n’est envoyé, le calcul se fait dans votre navigateur.</p>
      </div>
      <div className={`calc-results${rb ? ' is-two' : ''}`} aria-live="polite">
        <Resultat titre={rb ? 'Offre A' : 'Votre résultat'} r={ra} meilleur={best === 'a'} />
        {rb && <Resultat titre="Offre B" r={rb} meilleur={best === 'b'} />}
      </div>
    </div>
  );
}

function Halos() {
  return <div className="halos" aria-hidden="true"><i className="halo-a" /><i className="halo-b" /></div>;
}

export default function CalculateurPage() {
  useV2Favicon();
  return (
    <MotionConfig reducedMotion="user">
      <div className="v2 v3 font-tight ld">
        <a href="#contenu" className="skip">Aller au contenu</a>
        <Nav light shop />
        <main id="contenu">
          <section className="hero is-light ld-hero">
            <Halos />
            <div className="aurora-grid" aria-hidden="true" />
            <div className="wrap ld-hero-inner">
              <Fil items={[['Accueil', '/'], ['Leads', '/leads'], ['Calculateur', null]]} />
              <p className="eyebrow">Outil gratuit</p>
              <h1>Combien vous coûte <span className="serif grad-text">un chantier signé ?</span></h1>
              <p className="hero-lead ld-chapo">Le prix d’un lead ne dit pas s’il est rentable. Ce calculateur transforme le prix de vos leads, votre part de contacts joints, de rendez-vous et de signatures en un seul chiffre : ce que vous coûte chaque chantier signé, et le prix maximum que vous pouvez payer par lead. Comparez deux offres côte à côte.</p>
            </div>
          </section>

          <section className="band ld-band" id="calculateur" style={{ paddingTop: 0 }}>
            <div className="wrap"><Calculateur /></div>
          </section>

          <section className="band ld-band" id="formules">
            <div className="wrap ld-split">
              <Reveal className="sec-head sec-head-left">
                <p className="eyebrow">Les formules</p>
                <h2 className="h2">Ce que calcule <span className="serif grad-text">l’outil.</span></h2>
                <p>Quatre formules simples, à refaire avec vos propres chiffres chaque mois.</p>
              </Reveal>
              <ol className="ld-legal">
                {[
                  ['Chantiers signés', 'Leads achetés × part de contacts joints × part de rendez-vous × part de signatures.'],
                  ['Coût par chantier signé', 'Dépense en leads ÷ chantiers signés. C’est le chiffre qui compare deux fournisseurs, pas le prix du lead.'],
                  ['Marge après achat des leads', 'Chantiers signés × panier moyen × marge brute, moins la dépense en leads.'],
                  ['Prix maximum d’un lead', 'Marge par chantier × part des leads qui signent. Au-delà, chaque chantier vous coûte plus qu’il ne rapporte.'],
                ].map(([h, d], i) => (
                  <Reveal as="li" key={h} delay={i * 0.04}><span className="ld-legal-ico calc-num">{i + 1}</span><div><h3>{h}</h3><p>{d}</p></div></Reveal>
                ))}
              </ol>
            </div>
          </section>

          <section className="band ld-band" id="aller-plus-loin">
            <div className="wrap">
              <div className="ld-price">
                <div>
                  <p className="eyebrow">Et ensuite</p>
                  <h2 className="h2">Des leads exclusifs, <span className="serif grad-text">payés au contact.</span></h2>
                  <p>Pour mesurer vos taux, suivez chaque lead jusqu’à la signature. Pour en acheter, Kairn vend des leads exclusifs : envoyés à un seul professionnel, sans abonnement ni engagement, à partir de 50 contacts.</p>
                </div>
                <div className="ld-price-box">
                  <p className="ld-price-v">28 € HT</p>
                  <p className="ld-price-l">le lead pompe à chaleur exclusif</p>
                  <ul>
                    <li><Check />ITE 27 € HT, photovoltaïque 35 € HT</li>
                    <li><Check />Autres secteurs sur devis</li>
                    <li><Check />Kairn paie la publicité</li>
                  </ul>
                  <Link to="/leads" className="btn btn-order">Voir les leads par secteur</Link>
                </div>
              </div>
              <div className="ld-links" style={{ marginTop: 32 }}>
                <Link to="/blog/cout-par-lead-calcul" className="ld-link"><b>Coût par lead : calcul et CPL maximum</b><span>L’article de référence</span><i>→</i></Link>
                <Link to="/blog/lead-exclusif-ou-mutualise" className="ld-link"><b>Lead exclusif ou mutualisé</b><span>Le comparatif</span><i>→</i></Link>
                <Link to="/blog/fournisseur-de-leads-comment-choisir" className="ld-link"><b>Choisir un fournisseur de leads</b><span>12 questions à poser</span><i>→</i></Link>
              </div>
            </div>
          </section>

          <section className="band ld-band" id="integrer">
            <div className="wrap"><Integration /></div>
          </section>

          <section className="band has-halos" id="faq">
            <Halos />
            <div className="wrap faq-grid">
              <Reveal className="faq-aside">
                <p className="eyebrow">Questions</p>
                <h2 className="h2">Coût par chantier : <span className="serif grad-text">vos questions.</span></h2>
              </Reveal>
              <FaqList items={FAQ_CALC} />
            </div>
          </section>
        </main>
        <Footer />
        <div className="mob-cta"><Link to="/leads" className="btn btn-order">Voir les leads par secteur</Link></div>
      </div>
    </MotionConfig>
  );
}

// ─ Version intégrable (Ugo, 09/11/2026) : affichée dans l'iframe d'autres sites, avec le lien vers Kairn.
// La page /embed/calculateur est autorisée en iframe (vercel.json) et non indexée (src/seo.js).
// Elle envoie sa hauteur à la page hôte pour que l'iframe s'ajuste (script du code d'intégration).
export function EmbedCalculateur() {
  const ref = useRef(null);
  useEffect(() => {
    document.documentElement.classList.add('is-embed');
    const envoyer = () => { try { window.parent.postMessage({ kairnCalc: true, height: Math.ceil(ref.current?.getBoundingClientRect().height || 0) + 8 }, '*'); } catch { /* hors iframe */ } };
    envoyer();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(envoyer) : null;
    if (ro && ref.current) ro.observe(ref.current);
    return () => ro?.disconnect();
  }, []);
  return (
    <div className="v2 v3 font-tight ld calc-embed" ref={ref}>
      <Calculateur />
      <p className="calc-credit">Calculateur proposé par <a href="https://www.kairnagency.com/calculateur-cout-par-chantier" target="_blank" rel="noopener">Kairn, leads exclusifs pour les professionnels</a></p>
    </div>
  );
}

const CODE_INTEGRATION = `<iframe src="https://www.kairnagency.com/embed/calculateur" id="kairn-calculateur" title="Calculateur du coût par chantier signé" loading="lazy" style="width:100%;height:1100px;border:0;"></iframe>
<p style="font-size:13px;">Calculateur proposé par <a href="https://www.kairnagency.com/calculateur-cout-par-chantier">Kairn, leads exclusifs</a></p>
<script>window.addEventListener("message",function(e){if(e.origin==="https://www.kairnagency.com"&&e.data&&e.data.kairnCalc){document.getElementById("kairn-calculateur").style.height=e.data.height+"px";}});</script>`;

export function Integration() {
  const [copie, setCopie] = useState(false);
  const copier = async () => {
    try { await navigator.clipboard.writeText(CODE_INTEGRATION); setCopie(true); setTimeout(() => setCopie(false), 2500); } catch { /* copie manuelle */ }
  };
  return (
    <div className="calc-int">
      <div>
        <p className="eyebrow">Pour votre site</p>
        <h2 className="h2">Ajoutez ce calculateur <span className="serif grad-text">à votre site.</span></h2>
        <p>Vous tenez un blog, un média ou un site pour les artisans, les courtiers ou les installateurs ? Intégrez gratuitement ce calculateur : copiez le code et collez-le dans votre page. Il s’ajuste tout seul à la largeur et à la hauteur.</p>
      </div>
      <div className="calc-code">
        <pre><code>{CODE_INTEGRATION}</code></pre>
        <button type="button" className="btn btn-order" onClick={copier}>{copie ? 'Code copié' : 'Copier le code'}</button>
      </div>
    </div>
  );
}
