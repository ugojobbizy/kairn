import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, animate, useInView, useMotionValue, useMotionValueEvent, useReducedMotion } from 'framer-motion';

// Section Méthode : à l'apparition, la ligne se remplit d'un trait de 1 à 4 et chaque étape
// s'allume quand la ligne atteint son rond ; ensuite une onde parcourt la ligne en boucle.

const EASE = [0.22, 0.8, 0.24, 1];

const STEPS = [
  { t: 'Audit', when: '48 h', d: 'Offre, page, tracking, créas. On identifie les fuites avant de dépenser un euro.' },
  { t: 'Mise en place', when: '2 à 4 semaines', d: 'Landing page, campagne, CRM sur mesure, tracking serveur, premières créas.' },
  { t: 'Lancement', when: 'Jour J', d: 'Campagnes en ligne, budget calibré. On observe, on ne promet pas.' },
  { t: 'Optimisation', when: 'Chaque lundi', d: 'Itérations hebdo et reporting transparent : leads, coût, signatures.' },
];

function Check() {
  return <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>;
}

// Boucle d'étapes qui ne tourne que lorsque la scène est active
function useTicker(on, steps, interval, { hold = false } = {}) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!on) { setI(0); return undefined; }
    if (reduce) { setI(steps - 1); return undefined; }
    const id = setInterval(() => setI((x) => (hold && x === steps - 1 ? x : (x + 1) % steps)), interval);
    return () => clearInterval(id);
  }, [on, reduce, steps, interval, hold]);
  return [i, reduce];
}

// 1 · Audit : les leads tombent dans l'entonnoir, deux s'échappent, la loupe les repère
const DROPS = [
  { x: 118, delay: 0 }, { x: 104, delay: 0.5 }, { x: 128, delay: 1.0, leak: 'L' },
  { x: 112, delay: 1.5 }, { x: 124, delay: 2.0, leak: 'R' }, { x: 108, delay: 2.5 },
];
function AuditScene({ on }) {
  const reduce = useReducedMotion();
  const live = on && !reduce;
  return (
    <div className="ms ms-audit2">
      <svg viewBox="0 0 240 110" aria-hidden="true">
        <defs>
          <linearGradient id="au-f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#C7D7FE" /><stop offset="1" stopColor="#93B4FF" /></linearGradient>
        </defs>
        <path d="M40 12 H200 L132 88 V104 H108 V88 Z" fill="url(#au-f)" opacity=".55" />
        <path d="M40 12 H200 L132 88 V104 H108 V88 Z" fill="none" stroke="#7DA2FF" strokeWidth="1.5" />
        {DROPS.map((d, k) => {
          const toLeak = d.leak === 'L' ? { x: [d.x, 76, 44], y: [4, 48, 62] } : d.leak === 'R' ? { x: [d.x, 164, 198], y: [4, 48, 62] } : { x: [d.x, 120, 120], y: [4, 70, 106] };
          return (
            <motion.circle key={k} r={d.leak ? 4 : 3.5} fill={d.leak ? '#EF4444' : '#2F5BEA'}
              initial={{ cx: d.x, cy: 4, opacity: 0 }}
              animate={live ? { cx: toLeak.x, cy: toLeak.y, opacity: [0, 1, 1, 0] } : { cx: d.x, cy: 30 + k * 6, opacity: on ? 0.8 : 0.35 }}
              transition={live ? { duration: 2.2, delay: d.delay, repeat: Infinity, repeatDelay: 0.8, ease: 'easeIn', times: [0, 0.55, 1] } : { duration: 0.3 }} />
          );
        })}
        {[{ x: 76, lbl: 'L' }, { x: 164, lbl: 'R' }].map((p) => (
          <g key={p.lbl}>
            <motion.circle cx={p.x} cy="48" r="5" fill="#EF4444" initial={false} animate={{ opacity: on ? 1 : 0, scale: on ? [1, 1.5, 1] : 0 }} transition={{ duration: 1.4, repeat: on && !reduce ? Infinity : 0 }} style={{ transformOrigin: `${p.x}px 48px` }} />
          </g>
        ))}
        <motion.g initial={false} animate={live ? { x: [0, 88, 0] } : { x: 0 }} transition={{ duration: 3.2, repeat: live ? Infinity : 0, ease: 'easeInOut' }}>
          <circle cx="76" cy="48" r="17" fill="rgba(255,255,255,.35)" stroke="#0C0A1A" strokeWidth="2.5" />
          <path d="M88 60 L100 72" stroke="#0C0A1A" strokeWidth="4" strokeLinecap="round" />
        </motion.g>
      </svg>
      <motion.span className="ms-chip is-red" initial={false} animate={{ opacity: on ? 1 : 0, y: on ? 0 : 6 }} transition={{ delay: on ? 0.8 : 0 }}>2 fuites détectées</motion.span>
    </div>
  );
}

// 2 · Mise en place : les briques s'emboîtent, puis un signal circule entre elles
const BLOCKS = [
  { b: 'Landing', from: { x: -40, y: -24, rotate: -8 } },
  { b: 'Campagne', from: { x: 40, y: -24, rotate: 8 } },
  { b: 'Tracking', from: { x: -40, y: 24, rotate: 6 } },
  { b: 'CRM', from: { x: 40, y: 24, rotate: -6 } },
];
function BuildScene({ on }) {
  const [i, reduce] = useTicker(on, 6, 380, { hold: true });
  const placed = reduce ? 4 : Math.min(i, 4);
  const linked = on && (reduce || i >= 5);
  return (
    <div className="ms ms-build2">
      <svg className="ms-links" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <motion.path d="M26 30 H74 V72 H26 Z" fill="none" stroke="#7DA2FF" strokeWidth="1.2" strokeDasharray="3 3" vectorEffect="non-scaling-stroke"
          initial={false} animate={{ pathLength: linked ? 1 : 0, opacity: linked ? 1 : 0 }} transition={{ duration: 0.8, ease: 'easeInOut' }} />
      </svg>
      {linked && !reduce && (
        <motion.span className="ms-signal" initial={{ left: '26%', top: '30%' }}
          animate={{ left: ['26%', '74%', '74%', '26%', '26%'], top: ['30%', '30%', '72%', '72%', '30%'] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'linear' }} />
      )}
      <div className="ms-grid">
        {BLOCKS.map((bl, k) => {
          const ok = on && k < placed;
          return (
            <motion.div key={bl.b} className={`ms-block${ok ? ' is-ok' : ''}`} initial={false}
              animate={ok ? { x: 0, y: 0, rotate: 0, opacity: 1, scale: 1 } : { ...bl.from, opacity: on ? 0.25 : 0.5, scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}>
              <span>{bl.b}</span>
              <motion.i initial={false} animate={{ scale: ok ? 1 : 0 }} transition={{ type: 'spring', stiffness: 500, damping: 18, delay: ok ? 0.15 : 0 }}><Check /></motion.i>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// 3 · Lancement : compte à rebours, bascule en ligne, diffusion continue
function LaunchScene({ on }) {
  const [i, reduce] = useTicker(on, 4, 520, { hold: true });
  const live = on && i >= 3;
  return (
    <div className="ms ms-launch2">
      <div className="ms-toggle-row">
        <span>Campagnes</span>
        <span className={`ms-toggle${live ? ' is-on' : ''}`}><motion.i layout transition={{ type: 'spring', stiffness: 500, damping: 30 }} /></span>
      </div>
      <div className="ms-status">
        <span className={`ms-dot${live ? ' is-on' : ''}`}>{live && !reduce && <><em /><em /></>}</span>
        <AnimatePresence mode="wait">
          <motion.b key={live ? 'on' : on ? `c${i}` : 'off'} initial={{ opacity: 0, y: 8, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}>
            {live ? 'En ligne' : on ? `Lancement dans ${3 - i}…` : 'En préparation'}
          </motion.b>
        </AnimatePresence>
      </div>
      <div className="ms-eq" aria-hidden="true">
        {[0.5, 0.8, 0.35, 0.95, 0.6, 0.75, 0.45, 0.9, 0.55, 0.7].map((h, k) => (
          <motion.i key={k} initial={false}
            animate={live && !reduce ? { scaleY: [h * 0.4, h, h * 0.6, h * 0.9, h * 0.4] } : { scaleY: live ? h : 0.12 }}
            transition={live && !reduce ? { duration: 1.2 + (k % 3) * 0.25, repeat: Infinity, ease: 'easeInOut', delay: k * 0.07 } : { duration: 0.4 }} />
        ))}
      </div>
      <span className="ms-caption">{live ? 'Diffusion en cours · budget calibré' : 'Budget calibré'}</span>
    </div>
  );
}

// 4 · Optimisation : chaque semaine, une nouvelle version de la courbe, plus haute
const CURVES = [
  { d: 'M6 66 C40 64 60 60 90 58 C120 56 150 54 194 50', end: [194, 50] },
  { d: 'M6 66 C40 62 60 54 90 50 C120 46 150 40 194 34', end: [194, 34] },
  { d: 'M6 66 C40 60 60 48 90 42 C120 36 150 26 194 20', end: [194, 20] },
  { d: 'M6 66 C40 58 60 42 90 34 C120 26 150 14 194 6', end: [194, 6] },
];
function OptimizeScene({ on }) {
  const [i, reduce] = useTicker(on, 4, 1500);
  const cur = on ? i : 0;
  return (
    <div className="ms ms-opti2">
      <span className="ms-version">
        <motion.span key={cur} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.3 }}>Version {cur + 1}</motion.span>
      </span>
      <motion.span className="ms-loop" initial={false} animate={{ rotate: on ? cur * 360 + (cur === 0 && on ? 0 : 0) : 0 }} transition={{ duration: 0.8, ease: EASE }} aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-3-6.7L21 8" /><path d="M21 3v5h-5" /></svg>
      </motion.span>
      <svg className="ms-chart" viewBox="0 0 200 72" preserveAspectRatio="none" aria-hidden="true">
        <defs><linearGradient id="op-g" x1="0" x2="1"><stop offset="0" stopColor="#4F46E5" /><stop offset="1" stopColor="#0EA5E9" /></linearGradient></defs>
        {CURVES.map((c, k) => k < cur && (
          <path key={`g${k}`} d={c.d} fill="none" stroke="#A9C1FF" strokeWidth="2" strokeDasharray="3 4" vectorEffect="non-scaling-stroke" opacity={0.3 + k * 0.15} />
        ))}
        <motion.path key={`c${cur}`} d={CURVES[cur].d} fill="none" stroke="url(#op-g)" strokeWidth="3.5" strokeLinecap="round" vectorEffect="non-scaling-stroke"
          initial={{ pathLength: reduce || !on ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, ease: 'easeInOut' }} />
      </svg>
      {on && (
        <motion.span key={`d${cur}`} className="ms-peak" style={{ left: `calc(14px + ${CURVES[cur].end[0] / 200} * (100% - 28px))`, top: `calc(30px + ${(CURVES[cur].end[1] / 72) * 62}px)` }}
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: reduce ? 0 : 0.9, type: 'spring', stiffness: 400, damping: 15 }} />
      )}
      <div className="ms-weeks">
        {['S1', 'S2', 'S3', 'S4'].map((w, k) => (
          <span key={w} className={on && k === cur ? 'is-cur' : on && k < cur ? 'is-done' : ''}>{w}</span>
        ))}
      </div>
    </div>
  );
}

const SCENES = [AuditScene, BuildScene, LaunchScene, OptimizeScene];

const FILL_S = 3.6; // durée du remplissage 1 → 4
const WAVE_S = 3.2; // durée d'un passage de l'onde

export default function Method() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: '-25% 0px' });
  const p = useMotionValue(reduce ? 1 : 0);
  const [active, setActive] = useState(reduce ? STEPS.length - 1 : -1);
  const [flowing, setFlowing] = useState(false);

  useEffect(() => {
    if (!inView || reduce) return undefined;
    setActive(0);
    const ctrl = animate(p, 1, { duration: FILL_S, ease: [0.45, 0, 0.25, 1], onComplete: () => setFlowing(true) });
    return () => ctrl.stop();
  }, [inView, reduce, p]);

  // Les ronds sont à 0, 1/3, 2/3 et 1 de la ligne.
  useMotionValueEvent(p, 'change', (v) => {
    setActive(Math.min(STEPS.length - 1, Math.floor(v * (STEPS.length - 1) + 0.02)));
  });

  return (
    <div className={`method${flowing ? ' is-flowing' : ''}`} ref={ref} style={{ '--wave': `${WAVE_S}s` }}>
      <motion.div className="method-rail" aria-hidden="true" style={{ '--p': p }}>
        <span className="method-fill" />
        <span className="method-fill-v" />
        {!flowing && inView && !reduce && <span className="method-head" />}
        {flowing && !reduce && <span className="method-wave" />}
      </motion.div>
      <ol className="method-steps">
        {STEPS.map((s, i) => {
          const on = i <= active;
          const Scene = SCENES[i];
          return (
            <li key={s.t} className={`mstep${on ? ' is-on' : ''}${i === active && !flowing ? ' is-current' : ''}`} style={{ '--k': i }}>
              <span className="mstep-orb"><span>0{i + 1}</span></span>
              <div className="mstep-card">
                <div className="mstep-visual" aria-hidden="true"><Scene on={on} /></div>
                <div className="mstep-body">
                  <span className="step-when">{s.when}</span>
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
