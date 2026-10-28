import React, { useEffect, useMemo, useRef } from 'react';

// Fonds du hero (28/10/2026). Ugo a refusé la grille + halo (« tout le monde met ça quand ils utilisent l'IA ») :
// trois directions liées à l'idée de Kairn, à comparer sur la page (?fond=topo | cairn | flux).
//  topo  : courbes de niveau d'une carte de randonnée ; le cairn est le repère qui balise le chemin.
//  cairn : le symbole en très grand, au trait, coupé par le bord ; grain de papier.
//  flux  : des fils qui convergent sous le titre, des points (les leads) qui descendent le long.

// Générateur pseudo-aléatoire stable : le dessin est identique à chaque visite.
function rng(seed) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

// Relief imaginaire : quelques sommets et une ondulation douce. Les courbes de niveau sont tracées
// par « marching squares » : elles ne se croisent jamais, comme sur une vraie carte.
function height(x, y) {
  const hills = [[0.13, 0.72, 0.30, 1], [0.86, 0.12, 0.26, 0.9], [0.92, 0.88, 0.22, 0.75], [0.48, 1.18, 0.28, 0.6], [0.36, -0.15, 0.2, 0.5]];
  let h = 0;
  for (const [hx, hy, s, a] of hills) h += a * Math.exp(-((x - hx) ** 2 + ((y - hy) * 0.9) ** 2) / (2 * s * s));
  return h + 0.06 * Math.sin(x * 9 + y * 4) + 0.04 * Math.sin(y * 13 - x * 5);
}

function contours(levels, W = 1600, H = 900, nx = 200, ny = 113) {
  const g = [];
  for (let j = 0; j <= ny; j += 1) { g[j] = []; for (let i = 0; i <= nx; i += 1) g[j][i] = height(i / nx, (j / ny) * (H / W) * 1.8); }
  const sx = W / nx, sy = H / ny;
  return levels.map((lv) => {
    let d = '';
    const lerp = (a, b) => (lv - a) / (b - a);
    for (let j = 0; j < ny; j += 1) {
      for (let i = 0; i < nx; i += 1) {
        const a = g[j][i], b = g[j][i + 1], c = g[j + 1][i + 1], e = g[j + 1][i];
        const pts = [];
        if ((a < lv) !== (b < lv)) pts.push([(i + lerp(a, b)) * sx, j * sy]);
        if ((b < lv) !== (c < lv)) pts.push([(i + 1) * sx, (j + lerp(b, c)) * sy]);
        if ((e < lv) !== (c < lv)) pts.push([(i + lerp(e, c)) * sx, (j + 1) * sy]);
        if ((a < lv) !== (e < lv)) pts.push([i * sx, (j + lerp(a, e)) * sy]);
        for (let k = 0; k + 1 < pts.length; k += 2) d += `M${pts[k][0].toFixed(1)} ${pts[k][1].toFixed(1)}L${pts[k + 1][0].toFixed(1)} ${pts[k + 1][1].toFixed(1)}`;
      }
    }
    return d;
  });
}

// Ombrage du relief (« hillshade ») : lumière du nord-ouest, versants à l'ombre teintés de bleu,
// teinte qui fonce avec l'altitude. Même terrain que les courbes : les deux couches se superposent exactement.
function paintShade(canvas) {
  const W = 400, H = 225;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(W, H);
  const hy = (j) => (j / H) * (900 / 1600) * 1.8;
  const L = [-0.62, -0.5, 0.6];
  const ln = Math.hypot(...L);
  const flat = L[2] / ln;
  const e = 1 / W;
  for (let j = 0; j < H; j += 1) {
    for (let i = 0; i < W; i += 1) {
      const x = i / W, y = hy(j);
      const h = height(x, y);
      const dx = (height(x + e, y) - height(x - e, y)) / (2 * e);
      const dy = (height(x, y + e) - height(x, y - e)) / (2 * e);
      const k = 0.16;
      const n = [-dx * k, -dy * k, 1];
      const nn = Math.hypot(...n);
      const lam = (n[0] * L[0] + n[1] * L[1] + n[2] * L[2]) / (nn * ln);
      const shadow = Math.max(0, flat - lam);
      const a = Math.min(0.5, 0.1 * Math.max(0, h) + shadow * 3.2);
      const o = (j * W + i) * 4;
      img.data[o] = 47; img.data[o + 1] = 91; img.data[o + 2] = 234; img.data[o + 3] = Math.round(a * 255);
    }
  }
  ctx.putImageData(img, 0, 0);
}

function Topo() {
  const paths = useMemo(() => {
    const levels = Array.from({ length: 26 }, (_, i) => 0.06 + i * 0.04);
    return contours(levels).map((d, i) => ({ d, major: i % 5 === 4 }));
  }, []);
  const wrap = useRef(null);
  const shade = useRef(null);
  useEffect(() => {
    if (shade.current) paintShade(shade.current);
    const el = wrap.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !window.matchMedia('(pointer: fine)').matches) return undefined;
    // Profondeur : au mouvement de la souris, les courbes glissent plus que l'ombrage (parallaxe légère).
    let raf = 0;
    const onMove = (ev) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--px', ((ev.clientX / window.innerWidth) - 0.5).toFixed(3));
        el.style.setProperty('--py', ((ev.clientY / window.innerHeight) - 0.5).toFixed(3));
      });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => { cancelAnimationFrame(raf); window.removeEventListener('pointermove', onMove); };
  }, []);
  return (
    <div className="hb hb-topo" ref={wrap} aria-hidden="true">
      <canvas ref={shade} className="hb-topo-shade" />
      <svg className="hb-topo-lines" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
        {paths.map((p, i) => <path key={i} d={p.d} className={p.major ? 'is-major' : undefined} />)}
        <g className="hb-topo-marks">
          <text x="170" y="640">1 240</text>
          <text x="1330" y="130">980</text>
          <text x="1420" y="790">1 410</text>
        </g>
      </svg>
    </div>
  );
}

function Cairn() {
  return (
    <div className="hb hb-cairn" aria-hidden="true">
      <svg viewBox="0 0 48 48" className="hb-cairn-mark">
        <rect x="7" y="9.5" width="34" height="9" rx="4.5" />
        <rect x="11.5" y="21.5" width="25" height="8.5" rx="4.25" />
        <rect x="16.5" y="33" width="15" height="8" rx="4" className="is-full" />
      </svg>
      <svg className="hb-grain"><filter id="hb-grain"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch" /><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0" /></filter><rect width="100%" height="100%" filter="url(#hb-grain)" /></svg>
    </div>
  );
}

function Flux() {
  const lines = useMemo(() => {
    const r = rng(3);
    const out = [];
    const n = 34;
    for (let i = 0; i < n; i += 1) {
      const x0 = -100 + (1800 / (n - 1)) * i;
      const c1 = x0 + (r() - 0.5) * 80;
      out.push({ d: `M${x0.toFixed(1)},-20 C${c1.toFixed(1)},300 800,420 800,640 L800,900`, dur: 5 + r() * 6, delay: -r() * 10, dot: i % 3 === 0 });
    }
    return out;
  }, []);
  return (
    <svg className="hb hb-flux" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMin slice" aria-hidden="true">
      {lines.map((l, i) => (
        <g key={i}>
          <path id={`hb-l${i}`} d={l.d} />
          {l.dot && (
            <circle r="3.2">
              <animateMotion dur={`${l.dur.toFixed(1)}s`} begin={`${l.delay.toFixed(1)}s`} repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="linear">
                <mpath href={`#hb-l${i}`} />
              </animateMotion>
            </circle>
          )}
        </g>
      ))}
    </svg>
  );
}

export default function HeroBg({ variant }) {
  if (variant === 'cairn') return <Cairn />;
  if (variant === 'flux') return <Flux />;
  return <Topo />;
}
