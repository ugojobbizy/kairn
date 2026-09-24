import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion';

// Visuels animés des cartes du bento. Chaque scène tourne en boucle uniquement
// quand la carte est à l'écran ; en mouvement réduit, elle s'affiche à son état final.

const EASE = [0.22, 0.8, 0.24, 1];

function useLoop(steps, interval) {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: '-15% 0px' });
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduce) { setI(steps - 1); return undefined; }
    if (!inView) return undefined;
    const id = setInterval(() => setI((x) => (x + 1) % steps), interval);
    return () => clearInterval(id);
  }, [inView, reduce, steps, interval]);
  return [ref, i, reduce];
}

function Ico({ d, size = 12, stroke = 2.6 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}
const CHECK = 'M20 6 9 17l-5-5';
const DOWN = 'm22 17-8.5-8.5-5 5L2 7M16 17h6v-6';
const BOLT = 'M13 2 3 14h9l-1 8 10-12h-9l1-8z';

// ─ Campagnes : test A/B, la meilleure créa passe de main en main ─
export function AdsVisual() {
  const [ref, win] = useLoop(3, 2400);
  const ads = [
    { net: 'Meta', img: 'ad-img-1' },
    { net: 'Google', img: 'ad-img-2' },
    { net: 'Meta', img: 'ad-img-3' },
  ];
  return (
    <div className="vz" ref={ref}>
      <div className="ads-row">
        {ads.map((a, i) => (
          <motion.div
            key={i}
            className={`mini ad${i === win ? ' is-win' : ''}`}
            animate={{ y: i === win ? -12 : 0, scale: i === win ? 1.04 : 0.97 }}
            transition={{ type: 'spring', stiffness: 220, damping: 22 }}
          >
            {i === win && (
              <motion.span layoutId="ad-win" className="ad-win" transition={{ type: 'spring', stiffness: 300, damping: 28 }}>
                <Ico d={BOLT} size={10} /> Meilleure créa
              </motion.span>
            )}
            <div className="ad-head"><i /><span><b>Votre marque</b><small>Sponsorisé · {a.net}</small></span></div>
            <div className={`ad-img ${a.img}`} />
            <div className="ad-foot"><span className="ad-l" /><span className="ad-cta">En savoir plus</span></div>
          </motion.div>
        ))}
      </div>
      <span className="cpl-chip">
        <svg width="46" height="18" viewBox="0 0 46 18" aria-hidden="true">
          <motion.path d="M1 3 L10 6 L18 5 L27 10 L35 11 L45 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 1.6, ease: 'easeInOut' }} />
        </svg>
        CPL en baisse
      </span>
    </div>
  );
}

// ─ Landing : le formulaire se remplit, clic, lead reçu ─
export function PageVisual() {
  const [ref, s] = useLoop(6, 900);
  return (
    <div className="vz" ref={ref}>
      <div className="mini page">
        <div className="page-bar"><i /><i /><i /></div>
        <div className="page-h" /><div className="page-h s" />
        <div className={`field first${s >= 1 ? ' is-filled' : ''}`}><motion.span animate={{ width: s >= 1 ? '62%' : '0%' }} transition={{ duration: 0.5, ease: EASE }} /></div>
        <div className={`field${s >= 2 ? ' is-filled' : ''}`}><motion.span animate={{ width: s >= 2 ? '48%' : '0%' }} transition={{ duration: 0.5, ease: EASE }} /></div>
        <motion.div className="page-cta" animate={{ scale: s === 3 ? 0.94 : 1 }} transition={{ duration: 0.18 }}>
          {s === 3 && <span className="ripple" />}
        </motion.div>
        <motion.span className="cursor" animate={s >= 2 && s <= 3 ? { x: 96, y: 118, opacity: 1 } : { x: 150, y: 40, opacity: s >= 4 ? 0 : 1 }} transition={{ duration: 0.6, ease: EASE }}>
          <svg width="16" height="18" viewBox="0 0 16 18" aria-hidden="true"><path d="M1 1 L1 15 L5 11 L8 17 L10 16 L7 10 L13 10 Z" fill="#0C0A1A" stroke="#fff" strokeWidth="1.2" strokeLinejoin="round" /></svg>
        </motion.span>
      </div>
      <AnimatePresence>
        {s >= 4 && (
          <motion.div className="toast" initial={{ opacity: 0, y: 16, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.4, ease: EASE }}>
            <span className="toast-ico"><Ico d={CHECK} /></span>Nouveau lead reçu
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─ Qualification : les critères se cochent un à un ─
export function QualVisual() {
  const [ref, s] = useLoop(6, 750);
  const rows = ['Type de projet', 'Budget', 'Délai'];
  return (
    <div className="vz" ref={ref}>
      <div className="qual">
        {rows.map((label, i) => (
          <div key={label} className={`mini qual-row${s > i ? ' is-ok' : ''}`}>
            <span>{label}</span>
            <span className="qual-check">
              <AnimatePresence>{s > i && <motion.span key="c" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 20 }}><Ico d={CHECK} /></motion.span>}</AnimatePresence>
            </span>
          </div>
        ))}
        <motion.div className={`mini qual-row is-hot${s >= 3 ? ' is-on' : ''}`} animate={{ scale: s === 3 ? 1.05 : 1 }} transition={{ type: 'spring', stiffness: 300, damping: 15 }}>
          <span>Lead qualifié</span>
          <span className="qual-check"><Ico d={BOLT} /></span>
        </motion.div>
      </div>
    </div>
  );
}

// ─ Tracking : courbe qui se trace, nouveaux leads qui s'allument ─
export function TrackingVisual() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-15% 0px' });
  const leads = 'M0,120 C40,110 60,86 100,92 C140,98 160,60 200,66 C240,72 260,40 300,44 C340,48 360,22 400,18 C430,15 450,20 480,10';
  const ventes = 'M0,140 C60,138 100,130 160,126 C220,122 260,110 320,104 C380,98 430,86 480,78';
  const dots = [[100, 92], [200, 66], [300, 44], [400, 18]];
  return (
    <div className="vz-fill" ref={ref}>
      <span className="chart-title">Leads et ventes<span>par jour</span></span>
      <span className="live"><i />En direct</span>
      <div className="chart-wrap">
        <svg className="chart" viewBox="0 0 480 150" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="v2area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity=".3" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[30, 70, 110].map((y) => <line key={y} x1="0" x2="480" y1={y} y2={y} className="grid-line" vectorEffect="non-scaling-stroke" />)}
          <motion.path d={`${leads} L480,150 L0,150 Z`} fill="url(#v2area)" initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.9, duration: 0.8 }} />
          <motion.path d={ventes} fill="none" stroke="#7DD3FC" strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke" initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ duration: 1.6, ease: 'easeInOut', delay: 0.5 }} />
          <motion.path d={leads} fill="none" stroke="#2F5BEA" strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke" initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ duration: 1.6, ease: 'easeInOut', delay: 0.2 }} />
        </svg>
        {dots.map(([x, y], i) => (
          <span key={i} className="chart-dot" style={{ left: `${(x / 480) * 100}%`, top: `${(y / 150) * 100}%`, animationDelay: `${1.8 + i * 0.7}s` }} />
        ))}
      </div>
    </div>
  );
}

// ─ CPL : les barres descendent, sous la ligne d'objectif ─
export function CplVisual() {
  const h = [100, 84, 70, 56, 42];
  const reduce = useReducedMotion();
  return (
    <div className="vz">
      <span className="bars-note"><Ico d={DOWN} size={14} stroke={2.4} />Coût par lead</span>
      <div className="bars-wrap">
        <span className="goal"><em>Objectif</em></span>
        <div className="bars">
          {h.map((v, i) => (
            <motion.i key={i} style={{ height: v }}
              initial={{ scaleY: reduce ? 1 : 0 }}
              animate={reduce ? { scaleY: 1 } : { scaleY: [0, 1, 1, 0] }}
              transition={{ duration: 5, times: [0, 0.15, 0.85, 1], delay: i * 0.12, repeat: Infinity, ease: EASE }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─ Reporting : notification du lundi ─
export function ReportVisual() {
  const [ref, s] = useLoop(4, 1300);
  return (
    <div className="vz" ref={ref}>
      <div className="mini cal">
        <div className="cal-head">Lundi<span>09:00</span></div>
        <div className={`cal-ev is-main${s >= 1 ? ' is-sent' : ''}`}>
          <b>Reporting hebdo</b>Leads, coût, signatures
          <span className="cal-state">{s >= 1 ? <><Ico d={CHECK} size={10} /> Envoyé</> : 'En cours'}</span>
        </div>
        <div className="cal-ev"><b>Nouvelles créas</b>Tests de la semaine</div>
      </div>
      <AnimatePresence>
        {s >= 1 && s <= 2 && (
          <motion.div className="notif" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} transition={{ duration: 0.45, ease: EASE }}>
            <span className="notif-dot" />Rapport envoyé au client
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─ Build : le terminal tape la commande ─
const TERM = [
  { t: '$ kairn build --client', c: 'cmd' },
  { t: '→ Relances automatiques', c: 'dim' },
  { t: '→ Formulaire branché au CRM', c: 'dim' },
  { t: '→ Tableau de bord temps réel', c: 'dim' },
  { t: '✓ Livré en production', c: 'ok' },
];
export function BuildVisual() {
  const [ref, s] = useLoop(TERM.length + 3, 650);
  const shown = Math.min(s + 1, TERM.length);
  return (
    <div className="vz" ref={ref}>
      <div className="term">
        <div className="term-bar"><i /><i /><i /><span>terminal</span></div>
        <pre>
          {TERM.slice(0, shown).map((l, i) => (
            <motion.span key={`${l.t}-${i}`} className={`term-line ${l.c}`} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}>
              {l.t}{i === shown - 1 && <span className="caret" />}
            </motion.span>
          ))}
        </pre>
        <div className="term-progress"><motion.i animate={{ width: `${(shown / TERM.length) * 100}%` }} transition={{ duration: 0.4, ease: EASE }} /></div>
      </div>
    </div>
  );
}

// ─ CRM sur mesure : chaque lead avance dans le pipeline avec sa source ─
const STAGES = ['Nouveau', 'Contacté', 'RDV fixé', 'Signé'];
const PARKED = [
  [{ src: 'Google', tag: 'Mot-clé' }, { src: 'Meta', tag: 'Créa A' }],
  [{ src: 'Meta', tag: 'Créa C' }],
  [{ src: 'Google', tag: 'Mot-clé' }],
  [],
];
export function CrmVisual() {
  const [ref, s] = useLoop(5, 1400);
  const stage = Math.min(s, 3);
  return (
    <div className="vz-fill crm" ref={ref}>
      <div className="crm-board">
        {STAGES.map((name, col) => (
          <div key={name} className={`crm-col${col === 3 ? ' is-won' : ''}`}>
            <div className="crm-col-head"><span>{name}</span><em>{PARKED[col].length + (stage === col ? 1 : 0)}</em></div>
            {stage === col && (
              <motion.div layoutId="crm-lead" className="crm-card is-live" transition={{ type: 'spring', stiffness: 260, damping: 26 }}>
                <span className="crm-name" />
                <span className="crm-src is-meta">Meta · Créa B</span>
                {col === 3 && <span className="crm-won"><Ico d={CHECK} size={10} /> Signé</span>}
              </motion.div>
            )}
            {PARKED[col].map((c, i) => (
              <div key={i} className="crm-card">
                <span className="crm-name s" />
                <span className={`crm-src${c.src === 'Meta' ? ' is-meta' : ''}`}>{c.src} · {c.tag}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <AnimatePresence>
        {s >= 3 && (
          <motion.div className="crm-attrib" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.35, ease: EASE }}>
            <Ico d={BOLT} size={11} /> Vente attribuée à <b>Meta · Créa B</b>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
