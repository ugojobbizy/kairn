// Injects all Kairn CSS (tokens, nav, hero, cards, process timeline, 3D sphere,
// case studies, testimonials, FAQ, CTAs, etc.) into <head> once on import.

(function () {
  if (typeof document === 'undefined' || document.getElementById('kairn-home-styles')) return;
  const s = document.createElement('style');
  s.id = 'kairn-home-styles';
  s.textContent = `
    /* ─ tokens ─ */
    .kairn {
      --bg: #FAFAFA;
      --bg-alt: #F5F3FF;
      --ink: #0A0A0A;
      --ink-soft: #1F1B2E;
      --muted: #6B7280;
      --line: #EDE9FE;
      --line-2: #E9E4F7;
      --violet: #8B5CF6;
      --violet-deep: #7C3AED;
      --lav: #C4B5FD;
      --lav-pale: #F5F3FF;
      color: var(--ink);
      background: var(--bg);
      font-family: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
      font-feature-settings: 'ss01', 'cv11';
      letter-spacing: -0.011em;
      line-height: 1.5;
      width: 100%;
      min-height: 100vh;
    }
    .kairn .mono { font-family: 'Geist Mono', ui-monospace, SF Mono, monospace; letter-spacing: 0; }
    .kairn h1, .kairn h2, .kairn h3 { margin: 0; font-weight: 600; letter-spacing: -0.028em; line-height: 1.05; }
    .kairn p { margin: 0; }
    .kairn a { color: inherit; text-decoration: none; cursor: pointer; }
    .kairn button { font-family: inherit; cursor: pointer; }

    /* ─ background living dot pattern ─ */
    .k-bg-dot {
      background-image: radial-gradient(circle, #E9E4F7 1px, transparent 1px);
      background-size: 24px 24px;
    }

    /* ─ cta ─ */
    .k-cta {
      display: inline-flex; align-items: center; gap: 8px;
      background: var(--ink); color: #fff;
      border: 0; border-radius: 999px; padding: 14px 22px;
      font-size: 15px; font-weight: 500; letter-spacing: -0.01em;
      transition: transform .2s, box-shadow .2s, background .2s;
      box-shadow: 0 1px 2px rgba(10,10,10,.2), inset 0 1px 0 rgba(255,255,255,.08);
    }
    .k-cta:hover { transform: translateY(-1px); box-shadow: 0 8px 24px -6px rgba(139,92,246,.45), 0 1px 2px rgba(10,10,10,.2); }
    .k-cta-violet { background: linear-gradient(180deg, #9B6FFB, #7C3AED); color: #fff; }
    .k-cta-ghost { background: transparent; color: var(--ink); border: 1px solid rgba(10,10,10,.12); }
    /* Override pour les CTA rendus comme <a> — sans ça, .kairn a { color: inherit } écrase le blanc */
    .kairn a.k-cta, .kairn a.k-cta-violet { color: #fff; }
    .kairn a.k-cta-ghost { color: var(--ink); }

    /* ─ nav ─ */
    .k-nav {
      position: sticky; top: 0; z-index: 50;
      backdrop-filter: saturate(1.2) blur(12px); -webkit-backdrop-filter: saturate(1.2) blur(12px);
      background: rgba(250,250,250,.78);
      border-bottom: 1px solid rgba(10,10,10,.06);
    }
    .k-nav-item { font-size: 14px; color: var(--ink-soft); padding: 8px 12px; border-radius: 8px; transition: background .15s, color .15s; cursor: pointer; }
    .k-nav-item:hover { background: rgba(139,92,246,.08); color: var(--ink); }

    /* ─ logo ─ */
    .k-logo {
      display: inline-flex; align-items: center; gap: 10px;
      font-weight: 600; letter-spacing: -0.02em; font-size: 17px;
      color: var(--ink);
    }
    .k-logo-mark {
      width: 28px; height: 28px;
      display: inline-block; flex-shrink: 0;
      position: relative;
      filter: drop-shadow(0 6px 16px rgba(124,58,237,.35)) drop-shadow(0 2px 4px rgba(76,29,149,.25));
      transition: filter .35s ease, transform .35s ease;
    }
    .k-logo-mark svg { display: block; width: 100%; height: 100%; }
    .k-logo-mark .k-logo-sparkle { transform-origin: 20.5px 7px; animation: k-logo-sparkle 3.6s ease-in-out infinite; }
    .k-logo-mark .k-logo-sheen { opacity: .55; animation: k-logo-sheen 5s ease-in-out infinite; }
    .k-logo:hover .k-logo-mark {
      filter: drop-shadow(0 8px 22px rgba(124,58,237,.55)) drop-shadow(0 2px 6px rgba(76,29,149,.35));
      transform: translateY(-1px);
    }
    @keyframes k-logo-sparkle {
      0%, 100% { transform: scale(1); opacity: 1; }
      35% { transform: scale(1.35); opacity: .85; }
      70% { transform: scale(0.85); opacity: .6; }
    }
    @keyframes k-logo-sheen {
      0%, 100% { opacity: .45; }
      50% { opacity: .8; }
    }

    /* ─ eyebrow badge ─ */
    .k-eyebrow {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 6px 12px 6px 10px; border-radius: 999px;
      background: #fff; border: 1px solid var(--line-2);
      font-size: 12.5px; color: var(--ink-soft);
      box-shadow: 0 1px 0 rgba(10,10,10,.02);
    }
    .k-eyebrow-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--violet); box-shadow: 0 0 0 3px rgba(139,92,246,.18); }
    @keyframes k-pulse-dot { 0%,100% { box-shadow: 0 0 0 3px rgba(139,92,246,.18); } 50% { box-shadow: 0 0 0 5px rgba(139,92,246,.06); } }
    .k-eyebrow-dot { animation: k-pulse-dot 2.4s ease-in-out infinite; }

    /* ─ hero split ─ */
    .k-hero { position: relative; }
    .k-hero-panels-d { display: grid; grid-template-columns: 1fr 1px 1fr; }
    .k-hero-sep-d { width: 1px; background: linear-gradient(180deg, transparent, var(--lav) 30%, var(--lav) 70%, transparent); position: relative; }
    .k-hero-sep-dot {
      position: absolute; top: 0; left: 50%;
      transform: translate(-50%, -50%);
      width: 12px; height: 12px; background: #fff;
      border: 1.5px solid var(--violet); border-radius: 50%;
      box-shadow: 0 0 0 4px rgba(139,92,246,.12), 0 0 12px rgba(139,92,246,.35);
      will-change: top;
    }
    .k-hero-kind {
      font-family: 'Geist Mono', monospace; font-size: 11px; letter-spacing: 0.18em;
      text-transform: uppercase; color: var(--muted);
    }
    .k-hero-kind-dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; margin-right: 8px; vertical-align: 2px; }

    /* ─ capacity cards ─ */
    .k-card {
      position: relative; background: #fff; border: 1px solid var(--line-2);
      border-radius: 14px; overflow: hidden;
      transition: transform .25s cubic-bezier(.2,.7,.3,1), box-shadow .25s, border-color .25s;
    }
    .k-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 18px 40px -20px rgba(124,58,237,.22), 0 2px 4px rgba(10,10,10,.04);
      border-color: var(--lav);
    }
    .k-card-illus { background: linear-gradient(180deg, #FBFAFF 0%, #F5F3FF 100%); position: relative; }
    .k-card-illus::after {
      content: ''; position: absolute; inset: 0;
      background: radial-gradient(circle at 50% 120%, rgba(196,181,253,.35), transparent 60%);
      pointer-events: none;
    }

    /* ─ positioning cards ─ */
    .k-pos-card {
      position: relative;
      padding: 24px 0;
      border-top: 1px solid var(--line-2);
      transition: transform .25s cubic-bezier(.2,.7,.3,1);
    }
    .k-pos-card::before {
      content: '';
      position: absolute;
      top: -1px; left: 0; right: 0;
      height: 2px;
      background: var(--violet);
      transform: scaleX(0);
      transform-origin: left center;
      transition: transform .55s cubic-bezier(.2,.7,.3,1);
    }
    .k-pos-card:hover { transform: translateY(-2px); }
    .k-pos-card:hover::before,
    .k-pos-card.k-pos-card-active::before {
      transform: scaleX(1);
    }
    .k-pos-card.k-pos-card-active { border-top-color: transparent; }
    .k-pos-num {
      font-family: 'Geist Mono', monospace;
      font-size: 12px;
      color: var(--muted);
      transition: color .3s;
    }
    .k-pos-card:hover .k-pos-num,
    .k-pos-card.k-pos-card-active .k-pos-num { color: var(--violet); }

    /* ─ metric counter ─ */
    .k-metric-num {
      font-family: 'Geist Mono', monospace; font-weight: 600;
      letter-spacing: -0.03em; font-feature-settings: 'tnum';
      background: linear-gradient(180deg, #0A0A0A 0%, #2A2340 100%);
      -webkit-background-clip: text; background-clip: text; color: transparent;
    }

    /* ─ process step ─ */
    .k-step-num {
      font-family: 'Geist Mono', monospace; font-weight: 500;
      color: var(--violet); font-size: 13px; letter-spacing: 0;
    }
    .k-step-line { height: 1px; background: linear-gradient(90deg, var(--lav) 0%, var(--line-2) 100%); }

    /* ─ process · spatial timeline ─ */
    .k-proc-stage {
      position: relative;
      perspective: 1400px;
      perspective-origin: 50% 40%;
      padding: 80px 0 40px;
    }
    .k-proc-plane {
      position: relative;
      transform-style: preserve-3d;
      transform: rotateX(18deg);
    }
    @keyframes k-proc-pulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(139,92,246,.55), 0 0 0 10px rgba(139,92,246,0), 0 0 30px rgba(139,92,246,.5); }
      50% { box-shadow: 0 0 0 5px rgba(139,92,246,.25), 0 0 0 20px rgba(139,92,246,0), 0 0 45px rgba(139,92,246,.7); }
    }
    @keyframes k-proc-travel {
      0% { offset-distance: 0%; opacity: 0; }
      8% { opacity: 1; }
      92% { opacity: 1; }
      100% { offset-distance: 100%; opacity: 0; }
    }
    @keyframes k-proc-pkt-trail {
      0% { opacity: 0; transform: scale(.4); }
      15%, 85% { opacity: 1; transform: scale(1); }
      100% { opacity: 0; transform: scale(.8); }
    }
    @keyframes k-proc-rail-flow {
      from { background-position: 0 0; }
      to { background-position: 80px 0; }
    }
    @keyframes k-proc-node-hover {
      0%, 100% { transform: translateZ(40px) translateY(0); }
      50% { transform: translateZ(40px) translateY(-4px); }
    }
    @keyframes k-proc-node-hover-alt {
      0%, 100% { transform: translateZ(40px) translateY(-3px); }
      50% { transform: translateZ(40px) translateY(2px); }
    }
    @keyframes k-proc-orbit-ring {
      from { transform: translateZ(20px) rotate(0deg); }
      to { transform: translateZ(20px) rotate(360deg); }
    }
    @keyframes k-proc-label-in {
      0% { opacity: 0; transform: translateY(8px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    @keyframes k-proc-scan {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    @keyframes k-proc-satellite {
      from { transform: rotate(0deg) translateX(62px) rotate(0deg); }
      to { transform: rotate(360deg) translateX(62px) rotate(-360deg); }
    }

    .k-proc-rail {
      position: absolute; left: 6%; right: 6%; top: 50%;
      height: 2px; transform: translateY(-50%);
      background:
        linear-gradient(90deg, transparent 0%, var(--lav) 10%, var(--violet) 50%, var(--lav) 90%, transparent 100%);
      border-radius: 2px;
      filter: drop-shadow(0 0 6px rgba(139,92,246,.35));
    }
    .k-proc-rail::before {
      content: ''; position: absolute; inset: -1px 0;
      background: repeating-linear-gradient(90deg, rgba(255,255,255,.85) 0 2px, transparent 2px 10px);
      opacity: .55;
      animation: k-proc-rail-flow 3s linear infinite;
    }
    .k-proc-rail-under {
      position: absolute; left: 6%; right: 6%; top: calc(50% + 28px);
      height: 1px; transform: translateY(-50%);
      background: linear-gradient(90deg, transparent, rgba(139,92,246,.18) 20%, rgba(139,92,246,.18) 80%, transparent);
      filter: blur(1.5px);
    }
    .k-proc-packet {
      position: absolute; left: 6%; right: 6%; top: 50%;
      width: calc(88%);
      height: 0; pointer-events: none;
    }
    .k-proc-pkt {
      position: absolute; top: 0; left: 0;
      width: 14px; height: 14px; border-radius: 50%;
      background: radial-gradient(circle at 30% 30%, #C4B5FD, #8B5CF6 50%, #6D28D9 95%);
      box-shadow: 0 0 16px rgba(139,92,246,.85), 0 0 4px rgba(196,181,253,.6) inset;
      offset-path: path('M 0 0 L 1200 0');
      animation: k-proc-travel 6s cubic-bezier(.55,0,.45,1) infinite;
    }
    .k-proc-pkt::after {
      content: ''; position: absolute; left: -46px; top: 50%;
      width: 46px; height: 2px; transform: translateY(-50%);
      background: linear-gradient(90deg, transparent, rgba(139,92,246,.75));
      border-radius: 2px;
    }

    .k-proc-node {
      position: relative;
      transform-style: preserve-3d;
      will-change: transform;
    }
    .k-proc-disc {
      position: relative;
      width: 72px; height: 72px;
      margin: 0 auto;
      border-radius: 50%;
      background:
        radial-gradient(circle at 35% 30%, #FAFAFA 0%, #EDE9FE 45%, #C4B5FD 100%);
      border: 1px solid rgba(139,92,246,.25);
      display: flex; align-items: center; justify-content: center;
      animation: k-proc-node-hover 4.5s ease-in-out infinite, k-proc-pulse 3.2s ease-in-out infinite;
      transform: translateZ(40px);
      box-shadow:
        0 10px 30px -8px rgba(124,58,237,.35),
        inset 0 1px 0 rgba(255,255,255,.9),
        inset 0 -8px 20px rgba(139,92,246,.12);
    }
    .k-proc-disc.k-proc-disc-active,
    .k-proc-disc:hover {
      background: radial-gradient(circle at 35% 30%, #C4B5FD 0%, #8B5CF6 55%, #6D28D9 100%);
      cursor: pointer;
    }
    .k-proc-disc.k-proc-disc-active .k-proc-glyph,
    .k-proc-disc:hover .k-proc-glyph { color: #fff; }
    .k-proc-disc-even { animation: k-proc-node-hover-alt 4.5s ease-in-out infinite, k-proc-pulse 3.2s ease-in-out infinite; }

    .k-proc-glyph {
      font-family: 'Geist Mono', monospace;
      font-weight: 600;
      font-size: 14px;
      color: var(--violet-deep);
      letter-spacing: 0.02em;
    }

    .k-proc-ring {
      position: absolute; inset: -14px;
      border: 1px dashed rgba(139,92,246,.28);
      border-radius: 50%;
      animation: k-proc-orbit-ring 14s linear infinite;
      transform: translateZ(20px);
      pointer-events: none;
    }
    .k-proc-ring-2 {
      inset: -28px;
      border-color: rgba(196,181,253,.22);
      border-style: solid;
      border-width: 1px;
      animation-duration: 22s; animation-direction: reverse;
    }
    .k-proc-satellite {
      position: absolute; top: 50%; left: 50%;
      width: 6px; height: 6px; margin: -3px 0 0 -3px;
      border-radius: 50%;
      background: radial-gradient(circle at 30% 30%, #fff, #8B5CF6);
      box-shadow: 0 0 10px rgba(139,92,246,.9);
      animation: k-proc-satellite 9s linear infinite;
    }
    .k-proc-satellite-b { animation-duration: 14s; animation-direction: reverse; background: radial-gradient(circle at 30% 30%, #fff, #C4B5FD); }

    .k-proc-card {
      position: relative;
      transform: translateZ(0);
      padding: 28px 22px 24px;
      border-radius: 16px;
      background: linear-gradient(180deg, rgba(255,255,255,.85) 0%, rgba(255,255,255,.55) 100%);
      border: 1px solid rgba(139,92,246,.12);
      backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
      box-shadow:
        0 24px 60px -30px rgba(124,58,237,.35),
        0 1px 0 rgba(255,255,255,.8) inset;
      overflow: hidden;
      animation: k-proc-label-in .9s cubic-bezier(.2,.7,.3,1) both;
    }
    .k-proc-card::before {
      content: ''; position: absolute; top: 0; left: -40%; width: 50%; height: 100%;
      background: linear-gradient(90deg, transparent, rgba(196,181,253,.22), transparent);
      animation: k-proc-scan 6s ease-in-out infinite;
      pointer-events: none;
    }
    .k-proc-card-1 { animation-delay: .05s }
    .k-proc-card-2 { animation-delay: .2s }
    .k-proc-card-3 { animation-delay: .35s }
    .k-proc-card-4 { animation-delay: .5s }

    .k-proc-kpi {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 4px 8px; border-radius: 6px;
      background: rgba(139,92,246,.1);
      color: var(--violet-deep);
      font-family: 'Geist Mono', monospace;
      font-size: 11px; font-weight: 500;
    }
    .k-proc-kpi-dot {
      width: 5px; height: 5px; border-radius: 50%;
      background: var(--violet);
      box-shadow: 0 0 6px rgba(139,92,246,.8);
    }
    .k-proc-duration {
      font-family: 'Geist Mono', monospace; font-size: 10.5px;
      color: var(--muted); letter-spacing: 0.14em; text-transform: uppercase;
    }

    .k-proc-stage-bg {
      position: absolute; inset: 0; pointer-events: none; overflow: hidden;
    }
    .k-proc-stage-bg::before {
      content: ''; position: absolute; inset: -20% -5% 0 -5%;
      background:
        radial-gradient(ellipse 50% 30% at 50% 60%, rgba(139,92,246,.18), transparent 70%),
        radial-gradient(ellipse 30% 20% at 20% 50%, rgba(196,181,253,.3), transparent 60%),
        radial-gradient(ellipse 30% 20% at 80% 50%, rgba(196,181,253,.3), transparent 60%);
      filter: blur(8px);
    }
    .k-proc-gridfloor {
      position: absolute; left: 0; right: 0; bottom: 0; height: 60%;
      background-image:
        linear-gradient(rgba(139,92,246,.08) 1px, transparent 1px),
        linear-gradient(90deg, rgba(139,92,246,.08) 1px, transparent 1px);
      background-size: 60px 60px;
      transform: perspective(700px) rotateX(60deg) translateY(20%);
      transform-origin: bottom;
      mask-image: linear-gradient(to top, #000 0%, transparent 100%);
      -webkit-mask-image: linear-gradient(to top, #000 0%, transparent 100%);
    }

    /* mobile spatial rail */
    .k-proc-m-rail {
      position: absolute; top: 0; bottom: 0; left: 28px; width: 2px;
      background: linear-gradient(180deg, transparent, var(--violet) 10%, var(--lav) 90%, transparent);
      border-radius: 2px;
      filter: drop-shadow(0 0 6px rgba(139,92,246,.35));
    }
    .k-proc-m-rail::after {
      content: ''; position: absolute; inset: 0;
      background: repeating-linear-gradient(180deg, rgba(255,255,255,.85) 0 2px, transparent 2px 10px);
      animation: k-proc-rail-flow-v 3s linear infinite;
      opacity: .6;
    }
    @keyframes k-proc-rail-flow-v {
      from { background-position: 0 0; }
      to { background-position: 0 80px; }
    }
    .k-proc-m-disc {
      position: absolute; left: 28px; top: 28px;
      transform: translate(-50%, -50%);
      width: 44px; height: 44px; border-radius: 50%;
      background: radial-gradient(circle at 35% 30%, #FAFAFA 0%, #EDE9FE 45%, #C4B5FD 100%);
      border: 1px solid rgba(139,92,246,.3);
      display: flex; align-items: center; justify-content: center;
      animation: k-proc-pulse 3.2s ease-in-out infinite;
      box-shadow: 0 8px 20px -6px rgba(124,58,237,.4), inset 0 1px 0 rgba(255,255,255,.9);
    }
    .k-proc-m-disc-active {
      background: radial-gradient(circle at 35% 30%, #C4B5FD 0%, #8B5CF6 55%, #6D28D9 100%);
    }
    .k-proc-m-disc-active .k-proc-glyph { color: #fff; }

    /* ─ 3D sphere ─ */
    @keyframes k-sphere-rot { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes k-sphere-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
    @keyframes k-orbit { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
    .k-sphere-float { animation: k-sphere-float 6s ease-in-out infinite; }
    .k-sphere-core {
      border-radius: 50%;
      background:
        radial-gradient(circle at 28% 28%, #F5F3FF 0%, #C4B5FD 20%, #8B5CF6 55%, #6D28D9 85%, #1E1145 100%);
      position: relative;
      box-shadow:
        0 30px 80px -20px rgba(124,58,237,.55),
        inset -20px -20px 60px rgba(30,17,69,.6),
        inset 10px 10px 40px rgba(255,255,255,.15);
    }
    .k-sphere-core::before {
      content: ''; position: absolute; inset: 6%;
      border-radius: 50%;
      background:
        radial-gradient(ellipse at 30% 25%, rgba(255,255,255,.45) 0%, rgba(255,255,255,0) 35%),
        conic-gradient(from 0deg at 50% 50%, rgba(139,92,246,0) 0deg, rgba(196,181,253,.25) 60deg, rgba(139,92,246,0) 120deg, rgba(196,181,253,.15) 220deg, rgba(139,92,246,0) 320deg);
      animation: k-sphere-rot 18s linear infinite;
      mix-blend-mode: screen;
    }
    .k-sphere-core::after {
      content: ''; position: absolute; inset: 12%;
      border-radius: 50%;
      background:
        radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(10,10,10,.15) 100%);
    }
    .k-sphere-ring {
      position: absolute; border: 1px dashed rgba(139,92,246,.28); border-radius: 50%;
      pointer-events: none;
    }
    .k-sphere-orbit { position: absolute; inset: 0; animation: k-orbit 24s linear infinite; }
    .k-sphere-orbit-2 { animation-duration: 38s; animation-direction: reverse; }
    .k-sphere-planet {
      position: absolute; width: 10px; height: 10px; border-radius: 50%;
      background: radial-gradient(circle at 30% 30%, #F5F3FF, #8B5CF6);
      box-shadow: 0 0 14px rgba(139,92,246,.5);
    }
    @keyframes k-twinkle { 0%,100% { opacity: .3 } 50% { opacity: 1 } }
    .k-sphere-star { position: absolute; width: 2px; height: 2px; background: #C4B5FD; border-radius: 50%; animation: k-twinkle 3s ease-in-out infinite; }

    /* ─ case study card ─ */
    .k-case {
      background: #fff; border: 1px solid var(--line-2); border-radius: 16px;
      overflow: hidden; transition: transform .25s, box-shadow .25s;
      display: flex; flex-direction: column;
    }
    .k-case:hover { transform: translateY(-2px); box-shadow: 0 20px 50px -24px rgba(124,58,237,.28); }

    /* ─ testimonial ─ */
    .k-quote-mark {
      font-family: Georgia, serif; font-size: 64px; line-height: 1; color: var(--lav);
      display: block; margin-bottom: -18px; opacity: .9;
    }

    /* ─ logo strip ─ */
    @keyframes k-logo-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
    .k-logo-track { display: flex; gap: 64px; animation: k-logo-scroll 40s linear infinite; width: max-content; }
    .k-logo-mask {
      overflow: hidden;
      mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
      -webkit-mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
    }

    /* ─ hidden scrollbar (used for snap rows) ─ */
    .k-scroll-hide { scrollbar-width: none; -ms-overflow-style: none; }
    .k-scroll-hide::-webkit-scrollbar { display: none; }

    /* ─ faq ─ */
    .k-faq-item {
      border-top: 1px solid var(--line-2);
      transition: background .2s;
    }
    .k-faq-item:last-child { border-bottom: 1px solid var(--line-2); }
    .k-faq-trigger { width: 100%; text-align: left; background: none; border: 0; padding: 22px 0; display: flex; justify-content: space-between; align-items: center; gap: 16px; }
    .k-faq-plus { width: 18px; height: 18px; position: relative; flex-shrink: 0; }
    .k-faq-plus::before, .k-faq-plus::after { content: ''; position: absolute; background: var(--ink); top: 50%; left: 50%; transform: translate(-50%,-50%); }
    .k-faq-plus::before { width: 12px; height: 1.5px; }
    .k-faq-plus::after { width: 1.5px; height: 12px; transition: transform .25s; }
    .k-faq-item.open .k-faq-plus::after { transform: translate(-50%,-50%) rotate(90deg); }
    .k-faq-panel { overflow: hidden; max-height: 0; transition: max-height .35s cubic-bezier(.4,0,.2,1); }
    .k-faq-item.open .k-faq-panel { max-height: 400px; }

    /* ─ final CTA gradient ─ */
    .k-cta-final {
      background:
        radial-gradient(ellipse at 20% 20%, rgba(196,181,253,.55), transparent 55%),
        radial-gradient(ellipse at 80% 90%, rgba(139,92,246,.4), transparent 55%),
        linear-gradient(135deg, #EDE9FE 0%, #C4B5FD 100%);
      position: relative;
      overflow: hidden;
    }
    .k-cta-final::before {
      content: ''; position: absolute; inset: 0;
      background-image: radial-gradient(circle, rgba(255,255,255,.4) 1px, transparent 1px);
      background-size: 24px 24px;
      opacity: .35;
      mask-image: radial-gradient(ellipse at center, #000 0%, transparent 70%);
      -webkit-mask-image: radial-gradient(ellipse at center, #000 0%, transparent 70%);
    }

    /* ─ mobile sticky CTA ─ */
    .k-mob-cta {
      position: sticky; bottom: 12px; margin: 0 12px;
      background: rgba(10,10,10,.92); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
      color: #fff; border-radius: 14px; padding: 14px 18px;
      display: flex; justify-content: space-between; align-items: center;
      box-shadow: 0 20px 40px -10px rgba(10,10,10,.35);
      z-index: 40;
    }

    /* ─ scroll counter anim ─ */
    @keyframes k-num-in { from { transform: translateY(8px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    .k-num-in { animation: k-num-in .8s cubic-bezier(.2,.7,.3,1) both; }

    /* ─ subtle bg grid ─ */
    .k-grid-bg {
      background-image:
        linear-gradient(to right, rgba(10,10,10,.03) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(10,10,10,.03) 1px, transparent 1px);
      background-size: 64px 64px;
    }

    /* ─ section label ─ */
    .k-section-label {
      display: inline-flex; align-items: center; gap: 10px;
      padding: 8px 14px 8px 10px;
      border-radius: 999px;
      background: #fff;
      border: 1px solid var(--line-2);
      font-family: 'Geist Mono', ui-monospace, monospace;
      font-size: 12.5px; font-weight: 500;
      color: var(--ink);
      letter-spacing: 0.04em;
      text-transform: uppercase;
      box-shadow: 0 2px 0 rgba(139,92,246,.05), inset 0 1px 0 #fff;
    }
    .k-section-label-sq {
      width: 10px; height: 10px; border-radius: 3px;
      background: linear-gradient(135deg, #C4B5FD, #8B5CF6);
      box-shadow: 0 0 0 2px #fff, 0 0 0 3px rgba(139,92,246,.25);
    }

    /* ─ hero background ─ */
    .k-hero-bg {
      position: relative;
      background:
        radial-gradient(ellipse 80% 60% at 50% 0%, #F5F3FF 0%, transparent 60%),
        radial-gradient(ellipse 40% 40% at 15% 30%, rgba(196,181,253,.35), transparent 60%),
        radial-gradient(ellipse 40% 40% at 85% 30%, rgba(139,92,246,.18), transparent 60%),
        #FAFAFA;
      overflow: hidden;
    }
    .k-hero-bg::before {
      content: ''; position: absolute; inset: 0;
      background-image:
        linear-gradient(to right, rgba(10,10,10,.035) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(10,10,10,.035) 1px, transparent 1px);
      background-size: 80px 80px;
      mask-image: radial-gradient(ellipse 80% 80% at 50% 40%, #000 10%, transparent 80%);
      -webkit-mask-image: radial-gradient(ellipse 80% 80% at 50% 40%, #000 10%, transparent 80%);
      pointer-events: none;
    }
    @keyframes k-hero-blob {
      0%, 100% { transform: translate(0,0) scale(1); }
      33% { transform: translate(30px, -20px) scale(1.08); }
      66% { transform: translate(-20px, 20px) scale(.95); }
    }
    .k-hero-blob {
      position: absolute; border-radius: 50%; filter: blur(80px);
      pointer-events: none; opacity: .6;
      animation: k-hero-blob 18s ease-in-out infinite;
    }

    .kairn .k-hero-headline {
      font-size: 88px;
      font-weight: 600;
      letter-spacing: -0.04em;
      line-height: 0.98;
      text-align: center;
      max-width: 1100px;
      margin: 32px auto 0;
      position: relative;
      text-wrap: balance;
      padding: 0 24px;
    }
    .kairn .k-hero-headline em {
      font-style: normal;
      background: linear-gradient(180deg, #8B5CF6 0%, #6D28D9 100%);
      -webkit-background-clip: text; background-clip: text; color: transparent;
    }
    .kairn .k-hero-sub {
      font-size: 19px; color: var(--muted); line-height: 1.55;
      text-align: center; max-width: 720px; margin: 28px auto 0;
      text-wrap: balance;
      padding: 0 24px;
    }
  `;
  document.head.appendChild(s);
})();

// Illustration-specific styles (animations for capacity cards).
(function () {
  if (typeof document === 'undefined' || document.getElementById('kairn-illus-styles')) return;
  const s = document.createElement('style');
  s.id = 'kairn-illus-styles';
  s.textContent = `
    .k-illus { width: 100%; height: 100%; display: block; overflow: visible; }
    .k-illus-wrap { position: relative; width: 100%; height: 100%; overflow: hidden; }

    @keyframes k-land-rise { 0%{opacity:0;transform:translateY(8px)} 60%{opacity:1;transform:translateY(0)} 100%{opacity:1;transform:translateY(0)} }
    @keyframes k-land-pulse { 0%,100%{opacity:.5} 50%{opacity:1} }
    .k-land-block { animation: k-land-rise 3.2s ease-out infinite; transform-origin: center; }
    .k-land-b1 { animation-delay: 0s }
    .k-land-b2 { animation-delay: .35s }
    .k-land-b3 { animation-delay: .7s }
    .k-land-b4 { animation-delay: 1.05s }
    .k-land-cursor { animation: k-land-pulse 1.2s ease-in-out infinite; }

    @keyframes k-fun-drop { 0%{transform:translateY(-6px);opacity:0} 20%{opacity:1} 80%{transform:translateY(34px);opacity:1} 100%{transform:translateY(40px);opacity:0} }
    .k-fun-dot { animation: k-fun-drop 2.4s cubic-bezier(.5,0,.5,1) infinite; }
    .k-fun-d1 { animation-delay: 0s } .k-fun-d2 { animation-delay: .6s }
    .k-fun-d3 { animation-delay: 1.2s } .k-fun-d4 { animation-delay: 1.8s }

    @keyframes k-flow-trace { 0%{stroke-dashoffset:60} 100%{stroke-dashoffset:0} }
    @keyframes k-flow-ping { 0%,100%{transform:scale(1);opacity:.85} 50%{transform:scale(1.12);opacity:1} }
    .k-flow-path { stroke-dasharray: 4 4; animation: k-flow-trace 1.8s linear infinite; }
    .k-flow-node { animation: k-flow-ping 2.2s ease-in-out infinite; transform-origin: center; transform-box: fill-box; }
    .k-flow-n2 { animation-delay: .5s } .k-flow-n3 { animation-delay: 1s } .k-flow-n4 { animation-delay: 1.5s }

    @keyframes k-curve-draw { 0%{stroke-dashoffset:280} 60%{stroke-dashoffset:0} 100%{stroke-dashoffset:0} }
    @keyframes k-curve-mark { 0%,50%{opacity:0;r:0} 70%{opacity:1;r:4} 100%{opacity:1;r:3} }
    @keyframes k-curve-bar { 0%{transform:scaleY(0)} 60%{transform:scaleY(1)} 100%{transform:scaleY(1)} }
    .k-curve-line { stroke-dasharray: 280; animation: k-curve-draw 3.4s ease-out infinite; }
    .k-curve-pt { animation: k-curve-mark 3.4s ease-out infinite; }
    .k-curve-bar { transform-origin: bottom; animation: k-curve-bar 3.4s ease-out infinite; }

    @keyframes k-cpl-down { 0%{transform:translateY(0)} 100%{transform:translateY(-210px)} }
    @keyframes k-cpl-arrow { 0%,100%{transform:translateY(0)} 50%{transform:translateY(2px)} }
    .k-cpl-track { animation: k-cpl-down 4s cubic-bezier(.7,0,.3,1) infinite; }
    .k-cpl-arrow { animation: k-cpl-arrow 1.2s ease-in-out infinite; transform-origin: center; transform-box: fill-box; }

    @keyframes k-dash-spark { 0%{stroke-dashoffset:120} 60%{stroke-dashoffset:0} 100%{stroke-dashoffset:0} }
    @keyframes k-dash-num { 0%{opacity:0} 8%,28%{opacity:1} 36%,100%{opacity:0} }
    .k-dash-spark { stroke-dasharray: 120; animation: k-dash-spark 3s ease-out infinite; }
    .k-dash-num { animation: k-dash-num 4.5s ease-in-out infinite; }
  `;
  document.head.appendChild(s);
})();
