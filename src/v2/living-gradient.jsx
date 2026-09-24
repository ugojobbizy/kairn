import React, { useEffect, useRef } from 'react';

// Fond « living gradient » en WebGL : quatre taches bleues aux trajectoires aléatoires
// (bruit simplex), tenues à l'écart de la zone du titre, vignette et grain de film. Déclinaison bleue Kairn.
// Sans WebGL (ou en cas d'échec), le fond CSS posé en dessous reste visible.
// Mouvement réduit : une seule image fixe. Hors écran : l'animation se met en pause.

const VERT = `
attribute vec2 a;
void main() { gl_Position = vec4(a, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;

// Bruit simplex 3D (Ashima Arts, licence MIT)
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

// Position d'une tache : trajectoire pilotée par le bruit, donc sans cycle perceptible
vec2 wander(float seed, float t, float aspect, vec2 center, vec2 range) {
  float x = snoise(vec3(seed, t, 0.0));
  float y = snoise(vec3(seed + 31.7, t, 4.0));
  return vec2((center.x + range.x * x) * aspect, center.y + range.y * y);
}

float blob(vec2 q, vec2 c, float r) {
  vec2 d = q - c;
  return exp(-dot(d, d) / (r * r));
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float aspect = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * aspect, uv.y);
  float t = uTime * 0.16;

  // Déformation organique : les taches ondulent au lieu de rester rondes
  vec2 q = p + 0.22 * vec2(
    snoise(vec3(p * 1.1, t * 0.9)),
    snoise(vec3(p * 1.1 + 5.2, t * 0.9))
  );

  // Quatre taches aux trajectoires aléatoires et au rayon qui respire
  vec2 c1 = wander(1.3, t,        aspect, vec2(0.20, 0.62), vec2(0.14, 0.18));
  vec2 c2 = wander(7.9, t * 0.85, aspect, vec2(0.80, 0.55), vec2(0.14, 0.22));
  vec2 c3 = wander(3.1, t * 1.1,  aspect, vec2(0.50, 0.22), vec2(0.30, 0.10));
  vec2 c4 = wander(5.6, t * 1.3,  aspect, vec2(0.50, 0.95), vec2(0.34, 0.06));
  float r1 = 0.24 + 0.06 * snoise(vec3(2.0, t * 1.4, 9.0));
  float r2 = 0.30 + 0.07 * snoise(vec3(4.0, t * 1.2, 9.0));
  float r3 = 0.26 + 0.07 * snoise(vec3(6.0, t * 1.3, 9.0));
  float r4 = 0.15 + 0.04 * snoise(vec3(8.0, t * 1.6, 9.0));

  vec3 sky    = vec3(0.36, 0.64, 1.00);
  vec3 royal  = vec3(0.10, 0.28, 0.95);
  vec3 indigo = vec3(0.24, 0.18, 0.85);
  vec3 cyan   = vec3(0.30, 0.80, 1.00);

  vec3 acc = sky * blob(q, c1, r1) * 1.25
           + royal * blob(q, c2, r2) * 1.1
           + indigo * blob(q, c3, r3) * 0.9
           + cyan * blob(q, c4, r4) * 0.7;

  // Zone du titre : la lumière y est atténuée pour garder le texte lisible
  float textZone = length((uv - vec2(0.5, 0.63)) * vec2(1.35, 2.1));
  acc *= mix(0.28, 1.0, smoothstep(0.12, 0.62, textZone));
  // Écrans étroits (mobile) : le titre occupe presque toute la largeur, on baisse la lumière
  acc *= mix(0.45, 1.0, smoothstep(0.7, 1.3, aspect));

  // Fusion lumineuse sans saturation brutale
  vec3 col = vec3(0.008, 0.012, 0.035) + (1.0 - exp(-acc * 1.15));

  // Vignette douce
  float v = smoothstep(1.2, 0.3, length((uv - vec2(0.5, 0.55)) * vec2(1.1, 1.0)));
  col *= mix(0.12, 1.0, v);

  // Grain de film
  col += (hash(gl_FragCoord.xy + fract(uTime) * 100.0) - 0.5) * 0.055;

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    gl.deleteShader(s);
    return null;
  }
  return s;
}

export default function LivingGradient({ className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas && canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
    if (!gl) return undefined;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return undefined;
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return undefined;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'a');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(prog, 'uRes');
    const uTime = gl.getUniformLocation(prog, 'uTime');

    // Rendu en basse définition : le dégradé est flou par nature, ça divise le coût GPU.
    const SCALE = 0.5;
    const resize = () => {
      const w = Math.max(1, Math.round(canvas.clientWidth * SCALE));
      const h = Math.max(1, Math.round(canvas.clientHeight * SCALE));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.uniform2f(uRes, w, h);
    };

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const start = performance.now() - 20000; // démarre en cours de mouvement
    let raf = 0;
    let visible = true;

    const draw = () => {
      resize();
      gl.uniform1f(uTime, (performance.now() - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const loop = () => {
      draw();
      raf = visible ? requestAnimationFrame(loop) : 0;
    };

    canvas.classList.add('is-ready');
    if (reduced) {
      draw();
      const onResize = () => draw();
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(loop);
    });
    io.observe(canvas);
    raf = requestAnimationFrame(loop);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, []);

  return <canvas ref={canvasRef} className={`living-gradient ${className}`} aria-hidden="true" />;
}
