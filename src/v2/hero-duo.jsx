import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

// Panneaux du hero repris de la V1 (Build · 01 / Ads · 02), au branding V2 :
// verre sombre, bleu Kairn, illustrations animées en boucle.

const EASE = [0.22, 0.8, 0.24, 1];

function useLoop(steps, interval, ref) {
  const inView = useInView(ref, { margin: '-10% 0px' });
  const reduce = useReducedMotion();
  const [i, setI] = useState(reduce ? steps - 1 : 0);
  useEffect(() => {
    if (reduce || !inView) return undefined;
    const id = setInterval(() => setI((x) => (x + 1) % steps), interval);
    return () => clearInterval(id);
  }, [inView, reduce, steps, interval]);
  return [i, reduce];
}

// Build : les briques de la machine s'allument une à une, un signal les traverse
const BLOCKS = [
  { t: 'Landing page', x: 8, y: 14 },
  { t: 'Formulaire', x: 56, y: 14 },
  { t: 'CRM', x: 56, y: 60 },
  { t: 'Automatisations', x: 8, y: 60 },
];
function BuildIllus() {
  const ref = useRef(null);
  const [s, reduce] = useLoop(6, 700, ref);
  const lit = reduce ? 4 : Math.min(s, 4);
  return (
    <div className="duo-illus duo-build" ref={ref} aria-hidden="true">
      <svg className="duo-links" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M30 26 H62 M78 38 V60 M62 72 H30" fill="none" stroke="rgba(169,193,255,.35)" strokeWidth="1.2" strokeDasharray="2.5 2.5" vectorEffect="non-scaling-stroke" />
      </svg>
      {!reduce && (
        <motion.span className="duo-signal" animate={{ left: ['28%', '64%', '78%', '78%', '64%', '28%'], top: ['26%', '26%', '38%', '62%', '72%', '72%'] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: 'linear' }} />
      )}
      {BLOCKS.map((b, i) => (
        <motion.div key={b.t} className={`duo-block${i < lit ? ' is-on' : ''}`} style={{ left: `${b.x}%`, top: `${b.y}%` }}
          animate={{ scale: i === lit - 1 && !reduce ? [1, 1.06, 1] : 1 }} transition={{ duration: 0.5 }}>
          <i />{b.t}
        </motion.div>
      ))}
    </div>
  );
}

// Ads : le volume de leads monte pendant que le CPL descend
function AdsIllus() {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: '-10% 0px' });
  const reduce = useReducedMotion();
  const leads = 'M0,88 C30,86 50,78 80,74 C110,70 130,56 160,50 C190,44 210,28 240,22 C260,18 280,12 300,8';
  const cpl = 'M0,20 C40,24 70,36 100,44 C130,52 170,60 200,68 C230,74 260,78 300,82';
  const draw = inView && !reduce
    ? { pathLength: [0, 1, 1], opacity: [1, 1, 0.4] }
    : { pathLength: 1, opacity: 1 };
  const tr = (delay) => (inView && !reduce ? { duration: 5, times: [0, 0.45, 1], repeat: Infinity, ease: 'easeInOut', delay } : { duration: 0 });
  return (
    <div className="duo-illus duo-ads" ref={ref} aria-hidden="true">
      <div className="duo-legend">
        <span><i className="is-leads" />Leads</span>
        <span><i className="is-cpl" />Coût par lead</span>
      </div>
      <svg viewBox="0 0 300 96" preserveAspectRatio="none">
        <defs>
          <linearGradient id="duo-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3B82F6" stopOpacity=".35" />
            <stop offset="1" stopColor="#3B82F6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`${leads} L300,96 L0,96 Z`} fill="url(#duo-area)" />
        <motion.path d={cpl} fill="none" stroke="#7DD3FC" strokeWidth="2.5" strokeDasharray="5 5" strokeLinecap="round" vectorEffect="non-scaling-stroke" initial={{ pathLength: 0 }} animate={draw} transition={tr(0.3)} />
        <motion.path d={leads} fill="none" stroke="#7DA2FF" strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke" initial={{ pathLength: 0 }} animate={draw} transition={tr(0)} />
      </svg>
      <span className="duo-chip is-up">▲ Leads</span>
      <span className="duo-chip is-down">▼ CPL</span>
    </div>
  );
}

function Panel({ kind, dot, title, sub, children, delay }) {
  return (
    <motion.div className="duo-panel" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay }}>
      <span className="duo-kind"><i className={dot} />{kind}</span>
      <h2>{title}</h2>
      <p>{sub}</p>
      {children}
    </motion.div>
  );
}

export default function HeroDuo() {
  return (
    <div className="duo">
      <Panel kind="Build · 01" dot="is-build" title={<>On construit la&nbsp;machine.</>} delay={1}
        sub="Sites, tunnels, plateformes sur-mesure, automatisations. Livrés en semaines, pas en trimestres.">
        <BuildIllus />
      </Panel>
      <div className="duo-sep" aria-hidden="true"><span className="duo-sep-dot" /><span className="duo-sep-pulse" /></div>
      <Panel kind="Ads · 02" dot="is-ads" title={<>On la fait tourner à plein&nbsp;régime.</>} delay={1.15}
        sub="Meta, Google, LinkedIn, TikTok. On baisse le CPL, puis on scale. Dans cet ordre.">
        <AdsIllus />
      </Panel>
    </div>
  );
}
