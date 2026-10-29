import React, { useEffect, useRef } from 'react';

// Fonds du hero de la V2 (28/10/2026). Ugo : « trouve d'autres inspirations mais je veux quelque chose que personne n'a jamais fait ».
// Pistes à comparer sur /v2 (?fond=trame | aimant | limaille | sismo | epingles), dessinées sur un canvas :
//  trame    : une trame de points qui s'allume autour de la souris, sous un halo (par défaut depuis le 28/10/2026).
//  aimant   : la limaille retravaillée en vraies lignes de champ parcourues par des points.
//  limaille : de la limaille de fer autour d'un aimant ; l'aimant suit la souris, le champ converge vers le bouton Commander.
//  sismo    : des lignes de sismographe ; une secousse traverse parfois une ligne (un lead qui arrive), la souris déforme le tracé.
//  epingles : un écran d'épingles (le jouet) où un cairn est imprimé en relief ; la souris y laisse son empreinte.

const BLUE = [47, 91, 234];
const CYAN = [14, 165, 233];
const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));

// Canvas plein cadre : densité d'écran, redimensionnement, position de la souris (relative au hero),
// pause hors écran, une seule image fixe si l'utilisateur limite les animations.
function useCanvas(draw) {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current;
    const host = cv?.parentElement;
    if (!cv || !host) return undefined;
    const ctx = cv.getContext('2d');
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const st = { w: 0, h: 0, mx: null, my: null, t0: performance.now(), visible: true };
    const resize = () => {
      const r = host.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      st.w = r.width; st.h = r.height;
      cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (still) draw(ctx, st, 0);
    };
    const move = (e) => { const r = host.getBoundingClientRect(); st.mx = e.clientX - r.left; st.my = e.clientY - r.top; };
    const leave = () => { st.mx = null; st.my = null; };
    const ro = new ResizeObserver(resize); ro.observe(host);
    const io = new IntersectionObserver(([en]) => { st.visible = en.isIntersecting; }); io.observe(host);
    resize();
    let raf = 0;
    const loop = (now) => { if (st.visible) draw(ctx, st, (now - st.t0) / 1000); raf = requestAnimationFrame(loop); };
    if (!still) {
      window.addEventListener('pointermove', move, { passive: true });
      document.addEventListener('pointerleave', leave);
      raf = requestAnimationFrame(loop);
    }
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); window.removeEventListener('pointermove', move); document.removeEventListener('pointerleave', leave); };
  }, [draw]);
  return ref;
}

// ── Limaille ─────────────────────────────────────────────────────
// Un dipôle : pôle + sous le bouton Commander (attracteur fixe), pôle − sur la souris
// (ou en orbite lente quand il n'y a pas de souris). Chaque brin suit la direction du champ.
function drawLimaille(ctx, st, t) {
  const { w, h } = st;
  ctx.clearRect(0, 0, w, h);
  const ax = w * 0.5, ay = Math.min(h, 900) * 0.5;
  const bx = st.mx ?? w * 0.5 + Math.cos(t * 0.25) * w * 0.34;
  const by = st.my ?? ay - 60 + Math.sin(t * 0.25) * 260;
  const step = w < 700 ? 16 : 19;
  for (let y = step / 2; y < h; y += step) {
    for (let x = step / 2; x < w; x += step) {
      // décalage stable par brin, pour casser la grille
      const jx = x + Math.sin(x * 12.9898 + y * 78.233) * step * 0.35;
      const jy = y + Math.cos(x * 39.346 + y * 11.135) * step * 0.35;
      let fx = 0, fy = 0;
      for (const [px, py, q] of [[ax, ay, 1], [bx, by, -0.8]]) {
        const dx = jx - px, dy = jy - py;
        const d2 = dx * dx + dy * dy + 900;
        const k = q / (d2 * Math.sqrt(d2));
        fx += dx * k; fy += dy * k;
      }
      const mag = Math.hypot(fx, fy);
      if (!mag) continue;
      const s = Math.min(1, Math.log10(1 + mag * 2e6) / 2.6) ** 2.2;
      if (s < 0.04) continue;
      // zone du titre : on éclaircit pour garder le texte lisible
      const cx = (jx - w / 2) / (w * 0.34), cy = (jy - 250) / 150;
      const calm = Math.min(1, Math.max(0, Math.hypot(cx, cy) - 0.55));
      const a = (0.06 + 0.7 * s) * calm;
      if (a < 0.02) continue;
      const len = 2 + 13 * s;
      const ux = (fx / mag) * len, uy = (fy / mag) * len;
      const c = mix(BLUE, CYAN, Math.min(1, jx / w));
      ctx.strokeStyle = `rgba(${c[0]},${c[1]},${c[2]},${a.toFixed(3)})`;
      ctx.lineWidth = 1.1;
      ctx.beginPath(); ctx.moveTo(jx - ux / 2, jy - uy / 2); ctx.lineTo(jx + ux / 2, jy + uy / 2); ctx.stroke();
    }
  }
}

// ── Sismographe ──────────────────────────────────────────────────
// Des lignes horizontales au tracé légèrement bruité. Toutes les 2,6 s environ, une secousse
// part de la gauche sur une ligne au hasard ; un point marque son sommet.
const SISMO = { pulses: [], next: 0.6 };
function drawSismo(ctx, st, t) {
  const { w, h } = st;
  ctx.clearRect(0, 0, w, h);
  const n = w < 700 ? 16 : 26;
  const gap = h / (n + 1);
  if (t > SISMO.next) {
    SISMO.pulses.push({ line: 1 + Math.floor(Math.random() * n), t0: t, speed: w / (3.2 + Math.random() * 1.6) });
    SISMO.next = t + 1.8 + Math.random() * 1.6;
  }
  SISMO.pulses = SISMO.pulses.filter((p) => (t - p.t0) * p.speed < w + 200);
  for (let i = 1; i <= n; i += 1) {
    const y0 = i * gap;
    const cy = (y0 - 250) / 150;
    const near = Math.abs(cy) < 1;
    ctx.beginPath();
    let peak = null;
    for (let x = 0; x <= w; x += 4) {
      let y = y0 + Math.sin(x * 0.012 + i * 1.7 + t * 0.6) * 1.6 + Math.sin(x * 0.047 + i * 3.1 - t * 1.1) * 0.8;
      if (st.mx != null) {
        const d = Math.hypot(x - st.mx, y0 - st.my);
        y += Math.exp(-(d * d) / 9000) * Math.sin(x * 0.18 - t * 9) * 7;
      }
      for (const p of SISMO.pulses) {
        if (p.line !== i) continue;
        const px = (t - p.t0) * p.speed - 100;
        const dx = x - px;
        const env = Math.exp(-(dx * dx) / 2600);
        const dy = env * Math.sin(dx * 0.22) * gap * 0.9;
        y -= dy;
        if (env > 0.98) peak = [x, y];
      }
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    const a = near ? 0.12 : 0.3;
    const c = mix(BLUE, CYAN, i / n);
    ctx.strokeStyle = `rgba(${c[0]},${c[1]},${c[2]},${a})`;
    ctx.lineWidth = 1;
    ctx.stroke();
    if (peak) {
      ctx.fillStyle = 'rgba(47,91,234,.85)';
      ctx.beginPath(); ctx.arc(peak[0], peak[1], 3, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(47,91,234,.15)';
      ctx.beginPath(); ctx.arc(peak[0], peak[1], 9, 0, Math.PI * 2); ctx.fill();
    }
  }
}

// ── Écran d'épingles ─────────────────────────────────────────────
// Un relief de cairn (quatre pierres empilées, à droite) et l'empreinte de la souris poussent les épingles.
// Chaque épingle est un point décalé vers le haut selon sa hauteur, avec son ombre : on lit le relief.
function cairnHeight(x, y, w, h) {
  const cx = w * 0.9, base = Math.min(h, 900) * 0.66, u = Math.min(w * 0.065, 100);
  const stones = [[0, 0.55, 1.5, 0.62], [0.12, 1.55, 1.15, 0.52], [-0.06, 2.4, 0.85, 0.44], [0.05, 3.08, 0.55, 0.36]];
  let v = 0;
  for (const [ox, oy, rx, ry] of stones) {
    const dx = (x - (cx + ox * u)) / (rx * u), dy = (y - (base - oy * u)) / (ry * u);
    const r = dx * dx + dy * dy;
    if (r < 1) v = Math.max(v, Math.sqrt(1 - r));
  }
  return v;
}
function drawEpingles(ctx, st, t) {
  const { w, h } = st;
  ctx.clearRect(0, 0, w, h);
  const step = w < 700 ? 12 : 14;
  const mx = st.mx ?? w * 0.18 + Math.sin(t * 0.3) * w * 0.08;
  const my = st.my ?? Math.min(h, 900) * 0.62 + Math.cos(t * 0.37) * 60;
  for (let y = step / 2; y < h; y += step) {
    for (let x = step / 2; x < w; x += step) {
      let z = cairnHeight(x, y, w, h);
      const d = Math.hypot(x - mx, y - my);
      z = Math.max(z, Math.exp(-(d * d) / 9000));
      const cx = (x - w / 2) / (w * 0.34), cy = (y - 250) / 150;
      const calm = Math.min(1, Math.max(0.15, Math.hypot(cx, cy) - 0.4));
      const lift = z * step * 1.6;
      if (z > 0.02) {
        ctx.fillStyle = `rgba(12,10,40,${(0.12 * z * calm).toFixed(3)})`;
        ctx.beginPath(); ctx.arc(x + lift * 0.35, y + lift * 0.2, 2.2, 0, Math.PI * 2); ctx.fill();
      }
      const c = mix(BLUE, CYAN, z);
      ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${((0.14 + 0.75 * z) * calm).toFixed(3)})`;
      ctx.beginPath(); ctx.arc(x, y - lift, 1.1 + z * 1.4, 0, Math.PI * 2); ctx.fill();
    }
  }
}


// ── Aimant (version 2 de la limaille, Ugo, 28/10/2026 : « j'aime bien l'idée, néanmoins améliore-le ») ──
// Les vraies lignes de champ, tracées d'un pôle à l'autre : elles partent de la souris (ou d'un pôle qui orbite
// lentement) et se referment sur le bouton Commander. Des points lumineux les parcourent vers le bouton : les leads qui affluent.
function fieldAt(x, y, poles) {
  let fx = 0, fy = 0;
  for (const [px, py, q] of poles) {
    const dx = x - px, dy = y - py;
    const d2 = dx * dx + dy * dy + 400;
    const k = q / (d2 * Math.sqrt(d2));
    fx += dx * k; fy += dy * k;
  }
  return [fx, fy];
}
function traceLine(x, y, poles, sink, w, h) {
  const pts = [[x, y]];
  for (let i = 0; i < 260; i += 1) {
    const [fx, fy] = fieldAt(x, y, poles);
    const m = Math.hypot(fx, fy) || 1;
    const step = 7;
    const [gx, gy] = fieldAt(x + (fx / m) * step / 2, y + (fy / m) * step / 2, poles);
    const g = Math.hypot(gx, gy) || 1;
    x += (gx / g) * step; y += (gy / g) * step;
    pts.push([x, y]);
    if (Math.hypot(x - sink[0], y - sink[1]) < 14) break;
    if (x < -80 || x > w + 80 || y < -80 || y > h + 80) break;
  }
  return pts;
}
function drawAimant(ctx, st, t) {
  const { w, h } = st;
  const H = Math.min(h, 900);
  ctx.clearRect(0, 0, w, h);
  // pôle + : la souris (source des lignes), pôle − : sous le bouton Commander (les lignes s'y referment)
  const ax = w * 0.43, ay = H * 0.49;
  const bx = st.mx ?? w * 0.5 + Math.cos(t * 0.18) * w * 0.36;
  const by = st.my ?? H * 0.42 + Math.sin(t * 0.18 * 1.3) * H * 0.3;
  const poles = [[bx, by, 1], [ax, ay, -1]];
  const n = w < 700 ? 22 : 34;
  for (let k = 0; k < n; k += 1) {
    const ang = (k / n) * Math.PI * 2 + 0.11;
    const pts = traceLine(bx + Math.cos(ang) * 16, by + Math.sin(ang) * 16, poles, [ax, ay], w, h);
    if (pts.length < 4) continue;
    const closes = Math.hypot(pts[pts.length - 1][0] - ax, pts[pts.length - 1][1] - ay) < 20;
    // la ligne
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i += 1) ctx.lineTo(pts[i][0], pts[i][1]);
    const grad = ctx.createLinearGradient(bx, by, ax, ay);
    grad.addColorStop(0, `rgba(${CYAN},.32)`);
    grad.addColorStop(1, `rgba(${BLUE},${closes ? 0.32 : 0.14})`);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1;
    ctx.stroke();
    if (!closes) continue;
    // deux points par ligne, qui filent vers le bouton
    for (let j = 0; j < 2; j += 1) {
      const u = ((t * 0.16 + k * 0.137 + j * 0.5) % 1);
      const i = Math.floor(u * (pts.length - 1));
      const [x, y] = pts[i];
      const fade = Math.sin(u * Math.PI);
      ctx.fillStyle = `rgba(${BLUE},${(0.85 * fade).toFixed(3)})`;
      ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = `rgba(${CYAN},${(0.18 * fade).toFixed(3)})`;
      ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fill();
    }
  }
  // zone du titre : on efface en partie pour garder le texte net
  ctx.save();
  ctx.globalCompositeOperation = 'destination-out';
  ctx.translate(w / 2, 250); ctx.scale(Math.min(w * 0.42, 560) / 160, 1);
  const veil = ctx.createRadialGradient(0, 0, 0, 0, 0, 160);
  veil.addColorStop(0, 'rgba(0,0,0,.8)'); veil.addColorStop(0.6, 'rgba(0,0,0,.5)'); veil.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = veil; ctx.fillRect(-160, -160, 320, 320);
  ctx.restore();
}

// ── Trame (Ugo, 28/10/2026 : « j'aime bien l'idée de l'animation lorsqu'on bouge la souris mais j'aimerais un truc plus classe et plus stylé ») ──
// Une trame de points fins, comme le fond des grilles de pubs qu'il aime. Autour de la souris (suivie avec retard, pour la douceur),
// les points s'allument en bleu, grossissent et s'écartent légèrement, sous un halo diffus. Un reflet lent traverse la trame en diagonale.
function drawTrame(ctx, st, t) {
  const { w, h } = st;
  const H = Math.min(h, 900);
  ctx.clearRect(0, 0, w, h);
  const tx = st.mx ?? w * 0.5 + Math.cos(t * 0.21) * w * 0.3;
  const ty = st.my ?? H * 0.5 + Math.sin(t * 0.27) * H * 0.28;
  st.sx = st.sx == null ? tx : st.sx + (tx - st.sx) * 0.08;
  st.sy = st.sy == null ? ty : st.sy + (ty - st.sy) * 0.08;
  const { sx, sy } = st;
  const R = Math.min(220, w * 0.16);
  const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, R * 2.4);
  glow.addColorStop(0, 'rgba(47,91,234,.10)'); glow.addColorStop(0.5, 'rgba(14,165,233,.04)'); glow.addColorStop(1, 'rgba(47,91,234,0)');
  ctx.fillStyle = glow; ctx.fillRect(0, 0, w, h);
  const step = w < 700 ? 20 : 24;
  for (let y = step / 2; y < h; y += step) {
    for (let x = step / 2; x < w; x += step) {
      const dx = x - sx, dy = y - sy;
      const d = Math.hypot(dx, dy) || 1;
      const near = Math.exp(-(d * d) / (2 * R * R));
      const sheen = 0.35 * Math.max(0, Math.sin((x + y) * 0.0035 - t * 0.7)) ** 12;
      const e = Math.min(1, near + sheen);
      const cx = (x - w / 2) / (w * 0.34), cy = (y - 250) / 150;
      const calm = Math.min(1, Math.max(0.25, Math.hypot(cx, cy) - 0.3));
      const px = x + (dx / d) * near * 6, py = y + (dy / d) * near * 6;
      if (e < 0.03) {
        ctx.fillStyle = `rgba(20,16,48,${(0.11 * calm).toFixed(3)})`;
        ctx.fillRect(px - 0.75, py - 0.75, 1.5, 1.5);
        continue;
      }
      const c = mix(BLUE, CYAN, Math.min(1, Math.max(0, (x - sx) / (R * 2) + 0.5)));
      ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${((0.12 + 0.78 * e) * calm).toFixed(3)})`;
      ctx.beginPath(); ctx.arc(px, py, 0.8 + 1.5 * e, 0, Math.PI * 2); ctx.fill();
    }
  }
}

const DRAW = { trame: drawTrame, aimant: drawAimant, limaille: drawLimaille, sismo: drawSismo, epingles: drawEpingles };

export default function HeroBgV2({ variant }) {
  const ref = useCanvas(DRAW[variant] || drawTrame);
  return <canvas ref={ref} className="hb hb-v2" aria-hidden="true" />;
}
