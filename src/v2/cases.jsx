import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlowCard } from './glow-card.jsx';

// Cas clients au format d'origine du site : chiffres à gauche, contexte au centre,
// citation à droite, navigation entre les cas. Textes TradeAuto et Rénovia repris du site en ligne ;
// chiffres Isolation d'Aquitaine relevés dans son CRM (Supabase, tables ad_spend et leads), le 2026-09-23.

const CASES = [
  {
    name: 'Isolation d’Aquitaine',
    logo: '/v2/isolation-aquitaine-logo.png',
    logoWide: true,
    tags: ['Isolation thermique par l’extérieur', 'Meta Ads', 'CRM sur mesure'],
    title: 'Un coût par lead divisé par 3,5 en trois mois',
    challenge: 'Des budgets publicitaires engloutis sans retour mesurable : impossible de savoir quelle campagne amenait des chantiers, ni ce que coûtait réellement un lead.',
    solution: 'Landing page dédiée à l’isolation par l’extérieur, campagne Meta construite et pilotée en interne, CRM sur mesure qui relie chaque lead à sa campagne, à son annonce et à son coût. Chaque décision de budget s’appuie sur la donnée.',
    kpis: [
      { v: '−72 %', l: 'CPL · de 19,43 € (juin) à 5,49 € (août)' },
      { v: '323', l: 'leads captés dans le CRM, de mai à septembre 2026' },
      { v: '5,49 €', l: 'coût par lead en août 2026' },
    ],
    deliverables: ['Landing page ITE en 5 étapes', 'Campagne Meta pilotable, créa par créa', 'CRM sur mesure : pipeline, attribution, finance', 'Suivi des dépenses publicitaires synchronisé'],
  },
  {
    name: 'TradeAuto',
    logo: '/tradeauto-logo.png',
    tags: ['Automobile', 'Meta + Google Ads', 'CRM & attribution'],
    title: 'Site, CRM et acquisition livrés en 4 semaines',
    challenge: "Leads dispersés entre formulaires, emails et WhatsApp. Pas de visibilité sur le coût réel d'acquisition ni sur la qualité des sources.",
    solution: 'Site + CRM + dashboard temps réel + campagnes Meta & Google par la même équipe. Tracking serveur end-to-end, attribution multi-source.',
    kpis: [
      { v: '−64 %', l: 'CPL · de 27,40 CHF à 10 CHF' },
      { v: '86', l: 'leads ultra-qualifiés générés cette semaine' },
      { v: '4 sem.', l: 'du brief au tunnel complet' },
    ],
    quote: 'Site, CRM, dashboard, Meta + Google Ads : tout livré par la même équipe en 4 semaines. Je recommande les yeux fermés.',
    author: 'Louis · Fondateur, TRADEAUTO.CH',
  },
  {
    name: 'Rénovia',
    logo: '/renovia-logo.svg',
    tags: ['Rénovation', 'Lead gen', 'Funnel & qualification'],
    title: 'CPL divisé par 2 avec des dossiers prêts à closer',
    challenge: 'Leads tièdes, dossiers incomplets, équipe commerciale qui relance dans le vide. Conversion en chute, no-shows fréquents.',
    solution: 'Funnel refondu, qualification enrichie (DPE live, profil ANAH), tracking serveur complet. Les leads arrivent avec un dossier signé prêt à closer.',
    kpis: [
      { v: '+158 %', l: 'taux de conversion · 12 % → 31 %' },
      { v: '−46 %', l: 'CPL · de 24 € à 13 €' },
      { v: '5×', l: 'plus de data par lead · 3 → 15+ champs' },
    ],
    quote: 'CPL divisé par 2, conversion doublée. Mais surtout : les leads arrivent avec un dossier complet. Le closing a suivi.',
    author: 'Samuel · Fondateur, RENOVIA.FR',
  },
];

const pad = (n) => String(n).padStart(2, '0');

function Arrow({ dir }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={dir === 'left' ? 'M19 12H5M11 18l-6-6 6-6' : 'M5 12h14M13 6l6 6-6 6'} />
    </svg>
  );
}

export default function Cases() {
  const [[index, dir], setState] = useState([0, 1]);
  const c = CASES[index];
  const go = (d) => setState(([i]) => [(i + d + CASES.length) % CASES.length, d]);

  return (
    <div className="cases2">
      <div className="cases2-count" aria-live="polite">{pad(index + 1)} / {pad(CASES.length)}</div>

      <AnimatePresence mode="wait" custom={dir}>
        <motion.div
          key={c.name}
          className="cases2-grid"
          custom={dir}
          initial={{ opacity: 0, x: dir * 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: dir * -40 }}
          transition={{ duration: 0.45, ease: [0.22, 0.8, 0.24, 1] }}
        >
          <div className="cases2-kpis">
            {c.kpis.map((k, i) => (
              <GlowCard key={k.l} className="cases2-kpi" glowColor="kairn" radius={20}>
                <motion.b initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.1, duration: 0.5 }}>{k.v}</motion.b>
                <span>{k.l}</span>
              </GlowCard>
            ))}
          </div>

          <GlowCard as="article" className="cases2-main" glowColor="kairn" radius={20}>
            <div className="cases2-head">
              <img src={c.logo} alt="" width={c.logoWide ? 152 : 48} height="48" className={c.logoWide ? 'is-wide' : undefined} />
              <div>
                <b>{c.name}</b>
                <small>Cas client · {pad(index + 1)} / {pad(CASES.length)}</small>
              </div>
            </div>
            <div className="cases2-tags">{c.tags.map((t) => <span key={t}>{t}</span>)}</div>
            <h3>{c.title}</h3>
            <div className="cases2-block">
              <em>Challenge :</em>
              <p>{c.challenge}</p>
            </div>
            <div className="cases2-block">
              <em>Solution :</em>
              <p>{c.solution}</p>
            </div>
          </GlowCard>

          {c.quote ? (
            <GlowCard as="figure" className="cases2-quote" glowColor="kairn" radius={20}>
              <span className="cases2-qmark" aria-hidden="true">“</span>
              <blockquote>« {c.quote} »</blockquote>
              <figcaption>{c.author}</figcaption>
            </GlowCard>
          ) : (
            <GlowCard className="cases2-quote cases2-deliv" glowColor="kairn" radius={20}>
              <span className="cases2-deliv-title">Ce qu’on a livré</span>
              <ul>
                {c.deliverables.map((d) => (
                  <li key={d}><span aria-hidden="true">✓</span>{d}</li>
                ))}
              </ul>
            </GlowCard>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Flèches sur les côtés (en bas sur mobile) */}
      <button type="button" className="cases2-side is-prev" onClick={() => go(-1)} aria-label="Cas précédent"><Arrow dir="left" /></button>
      <button type="button" className="cases2-side is-next" onClick={() => go(1)} aria-label="Cas suivant"><Arrow dir="right" /></button>

      <div className="cases2-nav">
        <button type="button" className="cases2-mob" onClick={() => go(-1)} aria-label="Cas précédent"><Arrow dir="left" /></button>
        <div className="cases2-dots">
          {CASES.map((x, i) => (
            <button key={x.name} type="button" className={i === index ? 'is-on' : ''} onClick={() => setState([i, i > index ? 1 : -1])} aria-label={`Voir le cas ${x.name}`} aria-current={i === index} />
          ))}
        </div>
        <button type="button" className="cases2-mob" onClick={() => go(1)} aria-label="Cas suivant"><Arrow dir="right" /></button>
      </div>
    </div>
  );
}
