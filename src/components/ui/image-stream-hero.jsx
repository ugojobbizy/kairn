import * as React from 'react';

/* Composant « Image Stream Hero » envoyé par Ugo (28/10/2026), porté de TSX + Tailwind vers JSX + styles en ligne :
 * le projet n'a ni Tailwind, ni TypeScript, ni shadcn. Géométrie, animation et réglages inchangés.
 * Les longueurs sont converties de cqw en pixels à partir de la largeur mesurée, car Safari ignore cqw
 * dans perspective et translate3d (même constat que pour tilted-grid-hero, 28/10/2026).
 *
 * ── the corridor ────────────────────────────────────────────────
 * Two rails of cards ride from far behind the screen toward the
 * viewer. Perspective alone does the work that looks like two
 * animations: as a card's z grows it gets bigger *and* its screen x
 * sweeps outward from the vanishing point, because the projection
 * scales position and size by the same factor.
 *
 * 1. Depth is authored as *apparent size*, geometrically: each card
 *    is a constant ratio bigger than the one behind it.
 * 2. The rails open hard in the first stretch and then hold (`fan` > 1).
 * 3. Neither end of the loop is ever on screen: `railBirth` is negative,
 *    so the newest card starts across the axis and sweeps back through
 *    the centre, which keeps the throat covered.
 * ─────────────────────────────────────────────────────────────── */

const PATH = {
  perspective: 30,
  cardWidth: 18,
  cardHeight: 25,
  cardRadius: 0.4,
  birthHeight: 2.6,
  exitHeight: 46,
  railBirth: -11,
  railExit: 44,
  fan: 3.3,
  turnBirth: 6,
  turnExit: 28,
  stops: 24,
};

// Sample the path once so the CSS keyframes trace the real curve. `cw` = 1 % of the container width, in px.
function keyframes(dir, name, p, cw) {
  const steps = [];
  for (let s = 0; s <= p.stops; s += 1) {
    const u = s / p.stops;
    const scale = (p.birthHeight / p.cardHeight) * Math.pow(p.exitHeight / p.birthHeight, u);
    const z = p.perspective * (1 - 1 / scale);
    const rail = p.railExit - (p.railExit - p.railBirth) * Math.pow(1 - u, p.fan);
    const turn = p.turnBirth + (p.turnExit - p.turnBirth) * u;
    steps.push(`${(u * 100).toFixed(2)}%{transform:translate3d(${(dir * rail * cw).toFixed(2)}px,0,${(z * cw).toFixed(2)}px) rotateY(${(-dir * turn).toFixed(2)}deg)}`);
  }
  return `@keyframes ${name}{${steps.join('')}}`;
}

// `offsetLeft` : décalage des images sur le rail gauche (0 = miroir exact du droit, comme l'original).
export function ImageStreamHero({ images, cards = 9, speed = 18, axis = 55, path, offsetLeft = 0, children, className, style, ...props }) {
  const ref = React.useRef(null);
  const id = React.useId().replace(/[^a-zA-Z0-9]/g, '');
  const right = `ish-r-${id}`;
  const left = `ish-l-${id}`;
  const card = `ish-c-${id}`;
  const p = React.useMemo(() => ({ ...PATH, ...path }), [path]);

  const [width, setWidth] = React.useState(1200);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(([e]) => setWidth((w) => (Math.abs(w - e.contentRect.width) < 1 ? w : e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const cw = width / 100;
  const px = (n) => `${+(n * cw).toFixed(2)}px`;

  const css = React.useMemo(
    () => `${keyframes(1, right, p, cw)}${keyframes(-1, left, p, cw)}@media(prefers-reduced-motion:reduce){.${card}{animation-play-state:paused}}`,
    [right, left, card, p, cw],
  );

  return (
    <div ref={ref} className={className} {...props} style={{ position: 'relative', overflow: 'hidden', ...style }}>
      <style>{css}</style>
      <div aria-hidden style={{ pointerEvents: 'none', position: 'absolute', inset: 0, perspective: px(p.perspective), perspectiveOrigin: `50% ${axis}%` }}>
        <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d' }}>
          {[right, left].map((name) => Array.from({ length: cards }, (_, i) => {
            const img = images[(i + (name === left ? offsetLeft : 0)) % Math.max(images.length, 1)];
            return (
              <div
                key={`${name}-${i}`}
                className={card}
                style={{
                  position: 'absolute',
                  overflow: 'hidden',
                  left: '50%',
                  top: `${axis}%`,
                  width: px(p.cardWidth),
                  height: px(p.cardHeight),
                  marginLeft: px(-p.cardWidth / 2),
                  marginTop: px(-p.cardHeight / 2),
                  borderRadius: px(p.cardRadius),
                  animation: `${name} ${speed}s linear infinite`,
                  animationDelay: `${-(i * speed) / cards}s`,
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  background: '#15122A',
                }}
              >
                {img ? <img src={img.src} alt={img.alt ?? ''} loading="lazy" decoding="async" draggable={false} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block', maxWidth: 'none' }} /> : null}
              </div>
            );
          }))}
        </div>
      </div>
      {children}
    </div>
  );
}

export default ImageStreamHero;
