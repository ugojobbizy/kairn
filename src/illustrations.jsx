import React from 'react';

// ─────────────────────────────────────────────────────────────
// 1. LANDING PAGE — mockup qui s'assemble
// ─────────────────────────────────────────────────────────────
export function IllusLanding() {
  return (
    <svg className="k-illus" viewBox="0 0 220 140" fill="none">
      <rect x="14" y="12" width="192" height="116" rx="6" fill="#fff" stroke="#E9E4F7" />
      <rect x="14" y="12" width="192" height="14" rx="6" fill="#F5F3FF" />
      <circle cx="22" cy="19" r="1.6" fill="#E9E4F7" />
      <circle cx="28" cy="19" r="1.6" fill="#E9E4F7" />
      <circle cx="34" cy="19" r="1.6" fill="#E9E4F7" />
      <rect x="44" y="16" width="50" height="6" rx="2" fill="#EDE9FE" />

      <g className="k-land-block k-land-b1">
        <rect x="22" y="34" width="90" height="6" rx="2" fill="#0A0A0A" />
        <rect x="22" y="44" width="70" height="4" rx="1.5" fill="#C4B5FD" />
        <rect x="22" y="52" width="58" height="4" rx="1.5" fill="#E9E4F7" />
      </g>

      <g className="k-land-block k-land-b2">
        <rect x="130" y="34" width="68" height="44" rx="4" fill="#F5F3FF" stroke="#C4B5FD" strokeWidth=".6" />
        <circle cx="164" cy="56" r="9" fill="#8B5CF6" opacity=".85" />
        <rect x="152" y="68" width="24" height="3" rx="1.5" fill="#C4B5FD" />
      </g>

      <g className="k-land-block k-land-b3">
        <rect x="22" y="66" width="40" height="12" rx="6" fill="#8B5CF6" />
        <rect x="28" y="70" width="28" height="4" rx="1.5" fill="#fff" />
      </g>

      <g className="k-land-block k-land-b4">
        <rect x="22" y="88" width="54" height="30" rx="3" fill="#FAFAFA" stroke="#EDE9FE" />
        <rect x="82" y="88" width="54" height="30" rx="3" fill="#FAFAFA" stroke="#EDE9FE" />
        <rect x="142" y="88" width="54" height="30" rx="3" fill="#FAFAFA" stroke="#EDE9FE" />
        <circle cx="30" cy="96" r="2" fill="#8B5CF6" />
        <circle cx="90" cy="96" r="2" fill="#8B5CF6" />
        <circle cx="150" cy="96" r="2" fill="#8B5CF6" />
        <rect x="26" y="104" width="28" height="3" rx="1.5" fill="#0A0A0A" />
        <rect x="86" y="104" width="28" height="3" rx="1.5" fill="#0A0A0A" />
        <rect x="146" y="104" width="28" height="3" rx="1.5" fill="#0A0A0A" />
        <rect x="26" y="110" width="40" height="2.5" rx="1" fill="#D1D5DB" />
        <rect x="86" y="110" width="40" height="2.5" rx="1" fill="#D1D5DB" />
        <rect x="146" y="110" width="40" height="2.5" rx="1" fill="#D1D5DB" />
      </g>

      <g className="k-land-cursor" transform="translate(52 72)">
        <path d="M0 0 L0 10 L3 7 L6 12 L8 11 L5 6 L9 5 Z" fill="#0A0A0A" />
      </g>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// 2. FUNNEL
// ─────────────────────────────────────────────────────────────
export function IllusFunnel() {
  return (
    <svg className="k-illus" viewBox="0 0 220 140" fill="none">
      <path d="M40 30 L180 30 L140 70 L140 118 L80 118 L80 70 Z" fill="#F5F3FF" stroke="#C4B5FD" strokeWidth="1" />
      <line x1="60" y1="50" x2="160" y2="50" stroke="#E9E4F7" strokeWidth=".8" strokeDasharray="2 2" />
      <line x1="78" y1="72" x2="142" y2="72" stroke="#E9E4F7" strokeWidth=".8" strokeDasharray="2 2" />
      <line x1="80" y1="94" x2="140" y2="94" stroke="#E9E4F7" strokeWidth=".8" strokeDasharray="2 2" />

      <rect x="44" y="36" width="30" height="8" rx="2" fill="#fff" stroke="#EDE9FE" />
      <text x="59" y="42" fontSize="5" fontFamily="Geist Mono" fill="#6B7280" textAnchor="middle">Visite</text>
      <rect x="64" y="58" width="30" height="8" rx="2" fill="#fff" stroke="#EDE9FE" />
      <text x="79" y="64" fontSize="5" fontFamily="Geist Mono" fill="#6B7280" textAnchor="middle">Lead</text>
      <rect x="85" y="80" width="30" height="8" rx="2" fill="#fff" stroke="#EDE9FE" />
      <text x="100" y="86" fontSize="5" fontFamily="Geist Mono" fill="#6B7280" textAnchor="middle">Qualifié</text>
      <rect x="95" y="102" width="30" height="8" rx="2" fill="#8B5CF6" />
      <text x="110" y="108" fontSize="5" fontFamily="Geist Mono" fill="#fff" textAnchor="middle">Signé</text>

      <circle className="k-fun-dot k-fun-d1" cx="110" cy="30" r="2.5" fill="#8B5CF6" />
      <circle className="k-fun-dot k-fun-d2" cx="110" cy="30" r="2.5" fill="#8B5CF6" />
      <circle className="k-fun-dot k-fun-d3" cx="110" cy="30" r="2.5" fill="#C4B5FD" />
      <circle className="k-fun-dot k-fun-d4" cx="110" cy="30" r="2.5" fill="#8B5CF6" />

      <text x="188" y="42" fontSize="6" fontFamily="Geist Mono" fill="#0A0A0A">1.0×</text>
      <text x="188" y="64" fontSize="6" fontFamily="Geist Mono" fill="#6B7280">0.4×</text>
      <text x="188" y="86" fontSize="6" fontFamily="Geist Mono" fill="#6B7280">0.2×</text>
      <text x="188" y="108" fontSize="6" fontFamily="Geist Mono" fill="#8B5CF6" fontWeight="600">0.08×</text>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// 3. AUTOMATIONS
// ─────────────────────────────────────────────────────────────
export function IllusFlow() {
  const Node = ({ cx, cy, variant = 'plain', className = '' }) => (
    <g className={`k-flow-node ${className}`} style={{ transformOrigin: `${cx}px ${cy}px` }}>
      <rect x={cx - 18} y={cy - 9} width="36" height="18" rx="4" fill="#fff" stroke="#C4B5FD" />
      {variant === 'trigger' && <circle cx={cx - 12} cy={cy} r="2" fill="#8B5CF6" />}
      {variant === 'action' && <rect x={cx - 14} y={cy - 2} width="4" height="4" fill="#8B5CF6" />}
      {variant === 'ai' && <path d={`M${cx - 14} ${cy - 2} L${cx - 10} ${cy - 4} L${cx - 10} ${cy + 2} Z`} fill="#8B5CF6" />}
      <rect x={cx - 7} y={cy - 2} width="18" height="1.8" rx="1" fill="#0A0A0A" />
      <rect x={cx - 7} y={cy + 2} width="12" height="1.4" rx=".8" fill="#9CA3AF" />
    </g>
  );
  return (
    <svg className="k-illus" viewBox="0 0 220 140" fill="none">
      <path className="k-flow-path" d="M52 40 L 90 40" stroke="#8B5CF6" strokeWidth="1.2" />
      <path className="k-flow-path" d="M128 40 Q148 40 148 62 T 168 82" stroke="#8B5CF6" strokeWidth="1.2" />
      <path className="k-flow-path" d="M52 40 Q70 40 70 70 T 90 98" stroke="#8B5CF6" strokeWidth="1.2" />
      <path className="k-flow-path" d="M128 98 L 168 98" stroke="#8B5CF6" strokeWidth="1.2" />

      <Node cx={34} cy={40} variant="trigger" />
      <Node cx={110} cy={40} variant="action" className="k-flow-n2" />
      <Node cx={186} cy={82} variant="ai" className="k-flow-n3" />
      <Node cx={110} cy={98} variant="action" className="k-flow-n2" />
      <Node cx={186} cy={98} variant="action" className="k-flow-n4" />

      <text x="14" y="22" fontSize="5.5" fontFamily="Geist Mono" fill="#6B7280">webhook</text>
      <text x="170" y="122" fontSize="5.5" fontFamily="Geist Mono" fill="#6B7280">→ sync</text>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// 4. ADS CURVE
// ─────────────────────────────────────────────────────────────
export function IllusCurve() {
  return (
    <svg className="k-illus" viewBox="0 0 220 140" fill="none">
      <line x1="24" y1="30" x2="24" y2="118" stroke="#E9E4F7" strokeWidth=".6" />
      <line x1="24" y1="118" x2="204" y2="118" stroke="#E9E4F7" strokeWidth=".6" />
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1="24" y1={40 + i * 22} x2="204" y2={40 + i * 22} stroke="#F5F3FF" strokeWidth=".6" />
      ))}

      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <rect
          key={i}
          className="k-curve-bar"
          x={36 + i * 22}
          y={60 + i * 3}
          width="8"
          height={56 - i * 6}
          rx="1"
          fill="#EDE9FE"
          style={{ animationDelay: `${i * 0.08}s` }}
        />
      ))}

      <path className="k-curve-line" d="M30 100 Q 60 95 80 80 T 130 60 T 200 36" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M30 100 Q 60 95 80 80 T 130 60 T 200 36 L 200 118 L 30 118 Z" fill="url(#k-curve-grad)" opacity=".35" />
      <defs>
        <linearGradient id="k-curve-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity=".6" />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
        </linearGradient>
      </defs>

      <circle className="k-curve-pt" cx="30" cy="100" r="3" fill="#8B5CF6" />
      <circle className="k-curve-pt" cx="80" cy="80" r="3" fill="#8B5CF6" style={{ animationDelay: '.2s' }} />
      <circle className="k-curve-pt" cx="130" cy="60" r="3" fill="#8B5CF6" style={{ animationDelay: '.4s' }} />
      <circle className="k-curve-pt" cx="200" cy="36" r="4" fill="#8B5CF6" style={{ animationDelay: '.6s' }} />
      <circle className="k-curve-pt" cx="200" cy="36" r="8" fill="#8B5CF6" opacity=".18" style={{ animationDelay: '.6s' }} />

      <text x="180" y="28" fontSize="6" fontFamily="Geist Mono" fontWeight="600" fill="#0A0A0A">ROAS 4.8×</text>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// 5. CPL DESCENDING
// ─────────────────────────────────────────────────────────────
export function IllusCPL() {
  const nums = ['82€', '74€', '68€', '61€', '55€', '49€', '44€', '41€'];
  return (
    <svg className="k-illus" viewBox="0 0 220 140" fill="none">
      <rect x="60" y="24" width="100" height="92" rx="8" fill="#fff" stroke="#E9E4F7" />
      <rect x="60" y="24" width="100" height="18" rx="8" fill="#F5F3FF" />
      <text x="70" y="35.5" fontSize="6" fontFamily="Geist Mono" fill="#6B7280">CPL · 90j</text>
      <circle cx="153" cy="33" r="2.5" fill="#8B5CF6" />
      <circle cx="153" cy="33" r="5" fill="#8B5CF6" opacity=".2" />

      <defs>
        <clipPath id="k-cpl-clip">
          <rect x="60" y="42" width="100" height="50" />
        </clipPath>
        <linearGradient id="k-cpl-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="20%" stopColor="#fff" stopOpacity="0" />
          <stop offset="80%" stopColor="#fff" stopOpacity="0" />
          <stop offset="100%" stopColor="#fff" />
        </linearGradient>
      </defs>

      <g clipPath="url(#k-cpl-clip)">
        <g className="k-cpl-track">
          {nums.map((n, i) => (
            <text key={i} x="110" y={72 + i * 30} fontSize="22" fontFamily="Geist Mono" fontWeight="600" fill="#0A0A0A" textAnchor="middle">
              {n}
            </text>
          ))}
        </g>
      </g>
      <rect x="60" y="42" width="100" height="50" fill="url(#k-cpl-fade)" pointerEvents="none" />

      <rect x="60" y="94" width="100" height="22" rx="2" fill="#FAFAFA" />
      <g className="k-cpl-arrow">
        <path d="M 75 105 L 80 111 L 85 105" stroke="#8B5CF6" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <line x1="80" y1="100" x2="80" y2="110" stroke="#8B5CF6" strokeWidth="1.6" strokeLinecap="round" />
      </g>
      <text x="92" y="109" fontSize="8" fontFamily="Geist Mono" fontWeight="600" fill="#0A0A0A">−38%</text>
      <text x="122" y="109" fontSize="6" fontFamily="Geist Mono" fill="#6B7280">vs baseline</text>

      <line x1="44" y1="40" x2="54" y2="40" stroke="#C4B5FD" strokeWidth="1" />
      <line x1="44" y1="70" x2="54" y2="70" stroke="#C4B5FD" strokeWidth="1" />
      <line x1="44" y1="100" x2="54" y2="100" stroke="#C4B5FD" strokeWidth="1" />
      <line x1="166" y1="40" x2="176" y2="40" stroke="#C4B5FD" strokeWidth="1" />
      <line x1="166" y1="70" x2="176" y2="70" stroke="#C4B5FD" strokeWidth="1" />
      <line x1="166" y1="100" x2="176" y2="100" stroke="#C4B5FD" strokeWidth="1" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// 6. DASHBOARD
// ─────────────────────────────────────────────────────────────
export function IllusDash() {
  return (
    <svg className="k-illus" viewBox="0 0 220 140" fill="none">
      <rect x="18" y="22" width="122" height="96" rx="6" fill="#fff" stroke="#E9E4F7" />
      <rect x="28" y="32" width="40" height="4" rx="1.5" fill="#9CA3AF" />

      <rect x="26" y="44" width="96" height="24" fill="#fff" />
      <g className="k-dash-num">
        <text x="28" y="62" fontSize="22" fontFamily="Geist Mono" fontWeight="600" fill="#0A0A0A">12 847</text>
      </g>
      <g className="k-dash-num" style={{ animationDelay: '1.5s' }}>
        <text x="28" y="62" fontSize="22" fontFamily="Geist Mono" fontWeight="600" fill="#0A0A0A">14 220</text>
      </g>
      <g className="k-dash-num" style={{ animationDelay: '3s' }}>
        <text x="28" y="62" fontSize="22" fontFamily="Geist Mono" fontWeight="600" fill="#0A0A0A">15 934</text>
      </g>

      <rect x="28" y="70" width="38" height="12" rx="6" fill="#F5F3FF" />
      <path d="M34 78 L 37 74 L 40 78" stroke="#8B5CF6" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <text x="43" y="78.5" fontSize="6" fontFamily="Geist Mono" fontWeight="600" fill="#8B5CF6">+24%</text>

      <path className="k-dash-spark" d="M28 100 L 42 94 L 56 98 L 70 88 L 84 92 L 98 80 L 112 86 L 126 74" stroke="#8B5CF6" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <circle cx="126" cy="74" r="2.5" fill="#8B5CF6" />

      <rect x="150" y="22" width="52" height="44" rx="5" fill="#F5F3FF" stroke="#EDE9FE" />
      <rect x="158" y="30" width="24" height="3" rx="1.5" fill="#9CA3AF" />
      <text x="158" y="50" fontSize="12" fontFamily="Geist Mono" fontWeight="600" fill="#0A0A0A">4.8×</text>
      <rect x="158" y="54" width="28" height="2.5" rx="1" fill="#C4B5FD" />

      <rect x="150" y="74" width="52" height="44" rx="5" fill="#F5F3FF" stroke="#EDE9FE" />
      <rect x="158" y="82" width="20" height="3" rx="1.5" fill="#9CA3AF" />
      <text x="158" y="102" fontSize="12" fontFamily="Geist Mono" fontWeight="600" fill="#0A0A0A">39%</text>
      <rect x="158" y="106" width="22" height="2.5" rx="1" fill="#C4B5FD" />
    </svg>
  );
}
