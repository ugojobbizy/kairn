import * as React from 'react';

/* Composant « Tilted Grid Hero » envoyé par Ugo (28/10/2026), porté de TSX + Tailwind vers JSX + styles en ligne :
 * le projet n'a ni Tailwind, ni TypeScript, ni shadcn. Géométrie, animation et réglages inchangés.
 *
 * ── the curved row ──────────────────────────────────────────────
 * One row of images streams from right to left around the inside of a
 * cylinder. The centre faces you flat, the ends bend toward you so each
 * end image curves along its length, and the ends fade into the page.
 *
 * A CSS box can't bend, so every tile is cut into SLICES vertical strips,
 * each a flat facet of the cylinder showing its share of the image. The
 * tile (preserve-3d) is what moves: one rotateY about the cylinder's axis
 * carries the whole tile along the arc. Only a tile's delay differs, and
 * that sets where on the arc it sits. The fade is a static mask.
 * ─────────────────────────────────────────────────────────────── */

// Strips per tile.
const SLICES = 16;

// Camera distance from the screen, as a multiple of the cylinder's radius.
const CAMERA = 1.6;

// Cylinder radius, as a share of the hero's width, that puts the frame's edge `bend` radians round the arc.
function arc(bend) {
  return (CAMERA - 1 + Math.cos(bend)) / (2 * CAMERA * Math.sin(bend));
}

// A tile is never wider than this share of the hero.
const MAX_WIDTH = 55;

// Lays the loop on the cylinder (angles in degrees): unit = arc one tile-height spans,
// limit = how far round a tile's centre can go before it is off-screen, sweep = where the loop's ends sit.
function measure(width, height, tile, aspect, gap, bend) {
  const h = Math.min((tile / 100) * height, ((MAX_WIDTH / 100) * width) / aspect);
  const radius = width * arc(bend);
  if (!(h > 0) || !(radius > 0)) return { columns: 2, sweep: 0, unit: 0, limit: 0 };
  const deg = (rad) => (rad * 180) / Math.PI;
  const unit = deg(h / radius);
  const pitch = (aspect + gap / 100) * unit;
  const limit = deg(bend) + (aspect * unit) / 2;
  const columns = Math.min(60, Math.max(2, Math.ceil((2 * limit) / pitch)));
  const round = (n) => +n.toFixed(4);
  const sweep = round((columns * pitch) / 2);
  return { columns, sweep, unit: round(unit), limit: round(Math.min(sweep, limit)) };
}

export function TiltedGridHero({
  images,
  speed = 4,
  tileHeight = 26,
  aspectRatio = 16 / 9,
  gap = 6,
  axis = 56,
  curve = 80,
  fade = 12,
  children,
  className,
  style,
  ...props
}) {
  const ref = React.useRef(null);
  const id = React.useId().replace(/[^a-zA-Z0-9]/g, '');
  const orbit = `tgh-o-${id}`;
  const tile = `tgh-t-${id}`;
  const bend = (Math.min(85, Math.max(5, curve)) * Math.PI) / 180;

  const [layout, setLayout] = React.useState(null);
  // Taille mesurée du cadre : les longueurs 3D sont calculées en pixels, car Safari ignore les unités cqw/cqh
  // dans perspective et translateZ (vu le 28/10/2026 : bande à plat sous WebKit).
  const [size, setSize] = React.useState({ w: 1200, h: 560 });
  const [shown, setShown] = React.useState({});

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const next = measure(width, height, tileHeight, aspectRatio, gap, bend);
      setSize((prev) => (prev.w === width && prev.h === height ? prev : { w: width, h: height }));
      setLayout((prev) => (prev?.columns === next.columns && prev.sweep === next.sweep && prev.unit === next.unit ? prev : next));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [tileHeight, aspectRatio, gap, bend]);

  React.useEffect(() => {
    for (const { src } of images) new Image().src = src;
  }, [images]);

  const { columns, sweep, unit, limit } = layout ?? measure(1200, 560, tileHeight, aspectRatio, gap, bend);

  const tilePx = Math.min((tileHeight / 100) * size.h, ((MAX_WIDTH / aspectRatio) / 100) * size.w);
  const u = (n) => `${+(n * tilePx).toFixed(3)}px`;

  const r = 100 * arc(bend);
  const radius = `${+((r / 100) * size.w).toFixed(3)}px`;
  const turn = (d) => `translateZ(${radius}) rotateY(${+d.toFixed(4)}deg) translateZ(-${radius})`;

  const hide = +(((sweep - limit) / (2 * sweep || 1)) * 100).toFixed(4);
  const css =
    `@keyframes ${orbit}{`
    + `from{transform:${turn(-sweep)}}to{transform:${turn(sweep)}}`
    + `0%,${hide}%,${100 - hide}%,100%{visibility:hidden}`
    + `${hide + 0.001}%,${100 - hide - 0.001}%{visibility:visible}}`
    + `@media(prefers-reduced-motion:reduce){.${tile}{animation-play-state:paused}}`;

  const share = aspectRatio / SLICES;
  const duration = columns * speed;
  const mask = `linear-gradient(90deg,transparent,#000 ${fade}%,#000 ${100 - fade}%,transparent)`;

  return (
    <div ref={ref} className={className} {...props} style={{ position: 'relative', overflow: 'hidden', ...style }}>
      <style>{css}</style>
      <div
        aria-hidden
        style={{
          pointerEvents: 'none',
          position: 'absolute',
          inset: 0,
          transition: 'opacity .5s',
          opacity: layout ? 1 : 0,
          perspective: `${+((r / 100) * size.w * CAMERA).toFixed(3)}px`,
          perspectiveOrigin: `50% ${axis}%`,
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
      >
        {Array.from({ length: columns }, (_, t) => {
          const first = columns - 1 - t;
          const img = images[(shown[t] ?? first) % Math.max(images.length, 1)];
          return (
            <div
              key={t}
              className={tile}
              style={{
                position: 'absolute',
                left: `calc(50% - ${u(aspectRatio / 2)})`,
                top: `calc(${axis}% - ${u(0.5)})`,
                width: u(aspectRatio),
                height: u(1),
                transformStyle: 'preserve-3d',
                animation: `${orbit} ${duration}s linear ${-t * speed}s infinite`,
              }}
              onAnimationIteration={(e) => {
                const lap = Math.round(e.elapsedTime / duration);
                setShown((prev) => {
                  const next = lap * columns + first;
                  return prev[t] === next ? prev : { ...prev, [t]: next };
                });
              }}
            >
              {Array.from({ length: SLICES }, (_, k) => (
                <div
                  key={k}
                  style={{
                    position: 'absolute',
                    top: 0,
                    overflow: 'hidden',
                    background: '#EEF2FA',
                    borderTopLeftRadius: k === 0 ? 8 : 0,
                    borderBottomLeftRadius: k === 0 ? 8 : 0,
                    borderTopRightRadius: k === SLICES - 1 ? 8 : 0,
                    borderBottomRightRadius: k === SLICES - 1 ? 8 : 0,
                    left: u((aspectRatio - share) / 2),
                    width: k === SLICES - 1 ? u(share) : `${+(share * tilePx + 1).toFixed(3)}px`,
                    height: u(1),
                    transform: turn((aspectRatio / 2 - (k + 0.5) * share) * unit),
                  }}
                >
                  {img ? (
                    <img
                      src={img.src}
                      alt={k === 0 ? (img.alt ?? '') : ''}
                      draggable={false}
                      style={{ position: 'absolute', top: 0, maxWidth: 'none', objectFit: 'cover', left: u(-k * share), width: u(aspectRatio), height: u(1) }}
                    />
                  ) : null}
                </div>
              ))}
            </div>
          );
        })}
      </div>
      {children}
    </div>
  );
}

export default TiltedGridHero;
