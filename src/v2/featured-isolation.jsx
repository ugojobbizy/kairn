import React from 'react';
import { motion } from 'framer-motion';

// Cas Isolation d'Aquitaine : chiffres réels relevés dans son CRM (tables ad_spend et leads), le 2026-09-23.
const IA_MONTHS = [
  { m: 'Juin', spend: '1 515,70 €', leads: 78, cpl: 19.43 },
  { m: 'Juillet', spend: '1 458,68 €', leads: 147, cpl: 9.92 },
  { m: 'Août', spend: '329,49 €', leads: 60, cpl: 5.49 },
];
const fmtEur = (n) => `${n.toFixed(2).replace('.', ',')} €`;

export default function FeaturedIsolation({ label = 'Cas d’étude · Nouveau', children }) {
  const max = IA_MONTHS[0].cpl;
  return (
    <section className="band ia" id="isolation-aquitaine">
      <div className="wrap">
        <div className="ia-top">
          <div>
            <span className="pill"><span className="pill-dot"><i /></span>{label}</span>
            <img className="ia-logo" src="/v2/isolation-aquitaine-logo.png" alt="Isolation d’Aquitaine" width="228" height="72" />
            <h2 className="h2">Un coût par lead <span className="serif grad-text">divisé par 3,5</span> en trois mois.</h2>
            <p className="ia-lead">
              Isolation d’Aquitaine vend de l’isolation thermique par l’extérieur. Avant nous, les budgets publicitaires partaient sans retour mesurable.
              On a construit la landing page, la campagne Meta pilotée en interne et un CRM sur mesure qui relie chaque lead à sa campagne, à son annonce et à son coût.
            </p>
          </div>
          <div className="ia-kpis">
            <div><b>−72 %</b><span>de coût par lead, de juin à août 2026</span></div>
            <div><b>323</b><span>leads captés dans le CRM, de mai à septembre</span></div>
            <div><b>5,49 €</b><span>coût par lead en août</span></div>
          </div>
        </div>

        <div className="ia-grid">
          <figure className="ia-shot">
            <div className="shot-bar" aria-hidden="true"><span className="shot-dots"><i /><i /><i /></span><span className="shot-url">isolation-aquitaine.vercel.app</span></div>
            <img src="/v2/isolation-aquitaine-landing.jpg" width="1440" height="900" loading="lazy" decoding="async"
              alt="Landing page Isolation d’Aquitaine : titre « Froide l’hiver, trop chaude l’été », simulateur d’aides en 5 étapes." />
          </figure>

          <div className="ia-chart">
            <span className="ia-chart-title">Coût par lead, mois par mois</span>
            <motion.div className="ia-bars" initial="hide" whileInView="show" viewport={{ once: true, margin: '-10% 0px' }}>
              {IA_MONTHS.map((x, i) => (
                <motion.div key={x.m} className="ia-bar" variants={{ hide: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.6 } } }}>
                  <b>{fmtEur(x.cpl)}</b>
                  <div className="ia-bar-track">
                    <motion.i variants={{ hide: { scaleY: 0 }, show: { scaleY: 1, transition: { delay: 0.2 + i * 0.15, duration: 0.8, ease: [0.22, 0.8, 0.24, 1] } } }}
                      style={{ height: `${(x.cpl / max) * 100}%` }} className={i === IA_MONTHS.length - 1 ? 'is-best' : undefined} />
                  </div>
                  <span>{x.m}</span>
                  <small>{x.leads} leads · {x.spend}</small>
                </motion.div>
              ))}
            </motion.div>
            <p className="ia-note">Leads enregistrés dans le CRM, budget Meta Ads du mois.</p>
          </div>
        </div>

        <ul className="ia-deliv">
          {['Landing page ITE : simulateur d’aides en 5 étapes', 'Campagne Meta construite et pilotée en interne', 'CRM sur mesure : pipeline, attribution, finance', 'Dépenses publicitaires synchronisées chaque jour'].map((d) => (
            <li key={d}><span aria-hidden="true">✓</span>{d}</li>
          ))}
        </ul>
        {children}
      </div>
    </section>
  );
}
