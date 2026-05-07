import React from 'react';

// ═════════════════════════════════════════════════════════════
// METRICS
// ═════════════════════════════════════════════════════════════
export function KMetrics({ isMobile, metrics }) {
  const pad = isMobile ? '60px 20px' : '100px 120px';
  return (
    <section style={{ padding: pad, background: '#fff', borderTop: '1px solid var(--line-2)', borderBottom: '1px solid var(--line-2)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="k-section-label">
          <span className="k-section-label-sq"></span>
          03 — Chiffres clés · 2023 → 2026
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
          gap: 0,
          marginTop: isMobile ? 32 : 48,
          borderTop: '1px solid var(--line-2)',
        }}>
          {metrics.map((m, i) => (
            <div key={i} style={{
              padding: isMobile ? '28px 16px' : '40px 28px',
              borderRight: isMobile ? (i % 2 === 0 ? '1px solid var(--line-2)' : 'none') : (i < 3 ? '1px solid var(--line-2)' : 'none'),
              borderBottom: isMobile && i < 2 ? '1px solid var(--line-2)' : 'none',
              position: 'relative',
            }}>
              <span className="mono" style={{ fontSize: 11, color: 'var(--violet)' }}>0{i + 1}</span>
              <div className="k-metric-num k-num-in" style={{ fontSize: isMobile ? 48 : 84, marginTop: 8, lineHeight: 1 }}>
                {m.n}<span style={{ color: 'var(--violet)' }}>{m.suf}</span>
              </div>
              <p style={{ color: 'var(--muted)', fontSize: isMobile ? 13 : 15, marginTop: 12, lineHeight: 1.45 }}>{m.l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════
// PROCESS — spatial 3D timeline
// ═════════════════════════════════════════════════════════════
export function KProcess({ isMobile, steps, kpis: kpisProp, sectionLabel = '04 — Processus', heading, subheading }) {
  const pad = isMobile ? '60px 20px 80px' : '120px 120px 140px';
  const kpis = kpisProp || ['48h', '2–4 sem', 'J-Day', 'hebdo'];
  return (
    <section style={{ padding: pad, background: 'linear-gradient(180deg, #F5F3FF 0%, #FAFAFA 60%, #F5F3FF 100%)', position: 'relative', overflow: 'hidden' }}>
      {!isMobile && <div className="k-proc-gridfloor"></div>}

      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 24 }}>
          <div>
            <div className="k-section-label">
              <span className="k-section-label-sq"></span>
              {sectionLabel}
            </div>
            <h2 style={{ fontSize: isMobile ? 36 : 64, marginTop: 20, letterSpacing: '-0.035em', maxWidth: 780, lineHeight: 1.02 }}>
              {heading || (<>Quatre étapes. <span style={{ color: 'var(--muted)' }}>Rien de plus.</span></>)}
            </h2>
          </div>
          {subheading !== null && (
            <p style={{ color: 'var(--muted)', fontSize: 15, maxWidth: 340, lineHeight: 1.55 }}>
              {subheading || "On refuse les projets qui n'entrent pas dans ce cadre. C'est ce qui permet de tenir les délais."}
            </p>
          )}
        </div>

        {isMobile ? (
          <div style={{ marginTop: 48, position: 'relative', paddingLeft: 64 }}>
            <div className="k-proc-m-rail"></div>
            {steps.map((s, i) => (
              <div key={s.n} style={{ position: 'relative', marginBottom: 32 }}>
                <div className="k-proc-m-disc">
                  <span className="k-proc-glyph">{s.n}</span>
                </div>
                <div className={`k-proc-card k-proc-card-${i + 1}`}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                    <span className="k-proc-kpi"><span className="k-proc-kpi-dot"></span>{kpis[i]}</span>
                    <span className="k-proc-duration">étape · {s.n}</span>
                  </div>
                  <h3 style={{ fontSize: 24, marginTop: 14, fontWeight: 600, letterSpacing: '-0.025em' }}>{s.t}</h3>
                  <p style={{ color: 'var(--muted)', fontSize: 14.5, marginTop: 10, lineHeight: 1.55 }}>{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="k-proc-stage" style={{ marginTop: 40 }}>
            <div className="k-proc-stage-bg"></div>
            <div className="k-proc-plane">
              <div className="k-proc-rail-under"></div>
              <div className="k-proc-rail"></div>
              <div className="k-proc-packet">
                <div className="k-proc-pkt"></div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', position: 'relative' }}>
                {steps.map((s, i) => {
                  const isOuter = i === 0 || i === steps.length - 1;
                  return (
                  <div key={s.n} className="k-proc-node" style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div style={{ position: 'relative', height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <div style={{ position: 'relative', width: 72, height: 72 }}>
                        <div className="k-proc-ring" style={{ animationDelay: `${i * -2}s` }}></div>
                        <div className="k-proc-ring k-proc-ring-2" style={{ animationDelay: `${i * -3}s` }}></div>
                        <div className="k-proc-satellite" style={{ animationDelay: `${i * -2.5}s` }}></div>
                        {isOuter && <div className="k-proc-satellite k-proc-satellite-b"></div>}
                        <div className={`k-proc-disc ${!isOuter ? 'k-proc-disc-even' : ''}`} style={{ animationDelay: `${i * -.8}s, ${i * -.5}s` }}>
                          <span className="k-proc-glyph">{s.n}</span>
                        </div>
                      </div>
                    </div>
                    <div className={`k-proc-card k-proc-card-${i + 1}`} style={{ marginTop: 12, flex: 1, transform: `translateZ(${isOuter ? 20 : 0}px)` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                        <span className="k-proc-kpi"><span className="k-proc-kpi-dot"></span>{kpis[i]}</span>
                        <span className="k-proc-duration">étape · {s.n}</span>
                      </div>
                      <h3 style={{ fontSize: 26, marginTop: 16, fontWeight: 600, letterSpacing: '-0.028em' }}>{s.t}</h3>
                      <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 10, lineHeight: 1.55 }}>{s.d}</p>
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════
// SPLINE — 3D sphere
// ═════════════════════════════════════════════════════════════
export function KSpline({ isMobile, sectionLabel = '05 — Execution', title, body, ctas }) {
  const pad = isMobile ? '64px 20px 72px' : '140px 120px 160px';
  const sphereSize = isMobile ? 260 : 440;

  const stars = React.useMemo(() => (
    Array.from({ length: 40 }).map(() => ({
      x: Math.random() * 100, y: Math.random() * 100,
      d: Math.random() * 3, s: 0.5 + Math.random() * 2,
    }))
  ), []);

  return (
    <section style={{ padding: pad, background: 'linear-gradient(180deg, #0B0716 0%, #140A2B 50%, #0B0716 100%)', color: '#fff', position: 'relative', overflow: 'hidden' }}>
      {stars.map((s, i) => (
        <span key={i} className="k-sphere-star" style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, animationDelay: `${s.d}s` }}></span>
      ))}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 50% 50%, rgba(139,92,246,.25), transparent 55%)',
        pointerEvents: 'none',
      }}></div>

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 40 : 80, alignItems: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
          <div className="k-sphere-float" style={{ width: sphereSize, height: sphereSize, position: 'relative' }}>
            <div className="k-sphere-ring" style={{ inset: -40, transform: 'rotateX(72deg)' }}></div>
            <div className="k-sphere-ring" style={{ inset: -80, transform: 'rotateX(72deg) rotateZ(30deg)', borderColor: 'rgba(196,181,253,.18)' }}></div>
            <div className="k-sphere-orbit">
              <span className="k-sphere-planet" style={{ left: '-6px', top: '50%' }}></span>
            </div>
            <div className="k-sphere-orbit k-sphere-orbit-2">
              <span className="k-sphere-planet" style={{ right: '-4px', top: '50%', width: 6, height: 6, background: 'radial-gradient(circle at 30% 30%, #fff, #C4B5FD)' }}></span>
            </div>
            <div className="k-sphere-core" style={{ width: '100%', height: '100%' }}></div>
            <div className="mono" style={{
              position: 'absolute', right: -40, top: 40,
              fontSize: 10, letterSpacing: '0.16em', color: 'rgba(196,181,253,.8)',
              textTransform: 'uppercase',
              textShadow: '0 0 12px rgba(139,92,246,.5)',
            }}>
              v.3.2 · realtime
            </div>
            <div className="mono" style={{
              position: 'absolute', left: -16, bottom: 20,
              fontSize: 10, letterSpacing: '0.16em', color: 'rgba(196,181,253,.8)',
              textTransform: 'uppercase',
            }}>
              ← core
            </div>
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          <div className="k-section-label" style={{ background: 'rgba(255,255,255,.08)', borderColor: 'rgba(196,181,253,.25)', color: '#fff' }}>
            <span className="k-section-label-sq"></span>
            {sectionLabel}
          </div>
          <h2 style={{ fontSize: isMobile ? 34 : 64, marginTop: 20, letterSpacing: '-0.035em', lineHeight: 1.02 }}>
            {title || (<>La performance<br /><span style={{ color: 'rgba(255,255,255,.55)' }}>n’attend pas.</span><br />Nous non plus.</>)}
          </h2>
          <p style={{ color: 'rgba(255,255,255,.65)', fontSize: 16, marginTop: 24, maxWidth: 440, lineHeight: 1.6 }}>
            {body || "Notre vitesse d’exécution vient d’une règle simple : on ne commence que ce qu’on peut finir en moins de 30 jours. Les projets plus longs sont découpés, pas étalés."}
          </p>
          {ctas || (
            <div style={{ display: 'flex', gap: 12, marginTop: 32, flexWrap: 'wrap' }}>
              <button className="k-cta k-cta-violet">
                Voir nos dernières livraisons
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7 L11 7 M7 3 L11 7 L7 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <button className="k-cta" style={{ background: 'rgba(255,255,255,.08)', color: '#fff', border: '1px solid rgba(255,255,255,.14)' }}>
                Parler au fondateur
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
