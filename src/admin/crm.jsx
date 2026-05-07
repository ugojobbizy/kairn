import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  DndContext, DragOverlay, PointerSensor, useSensor, useSensors,
  closestCorners, useDroppable, useDraggable,
} from '@dnd-kit/core';
import { KairnMark } from '../sections-1.jsx';
import { useAuth } from './auth-context.jsx';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { BOOKING_URL } from '../config.js';
import LeadForm from './lead-form.jsx';
import { leadsToCsv, downloadCsv, dateStamp } from './csv-export.js';

// ═════════════════════════════════════════════════════════════
// CONSTANTS — pipeline stages and form value labels
// ═════════════════════════════════════════════════════════════
const STAGES = [
  { v: 'new',       l: 'Nouveau',     accent: '#8B5CF6', desc: 'À traiter' },
  { v: 'contacted', l: 'Contacté',    accent: '#6366F1', desc: '1er contact envoyé' },
  { v: 'booked',    l: 'RDV pris',    accent: '#0EA5E9', desc: 'Calendly confirmé' },
  { v: 'qualified', l: 'Qualifié',    accent: '#F59E0B', desc: 'Call effectué' },
  { v: 'won',       l: 'Gagné',       accent: '#10B981', desc: 'Devis signé' },
  { v: 'lost',      l: 'Perdu',       accent: '#9CA3AF', desc: 'Pas le bon fit' },
];
const STAGE_INDEX = Object.fromEntries(STAGES.map((s, i) => [s.v, i]));
const STAGE_LABEL = Object.fromEntries(STAGES.map(s => [s.v, s.l]));
const STAGE_ACCENT = Object.fromEntries(STAGES.map(s => [s.v, s.accent]));
const ACTIVE_STAGES = ['new', 'contacted', 'booked', 'qualified'];

const SECTOR_LABEL = {
  // Legacy values still in DB
  dental: 'Dental', immo: 'Immobilier', auto: 'Auto',
  resto: 'Resto / Hôtellerie', services: 'Services',
  // Current values
  medical: 'Médical / paramédical',
  b2c: 'Services B2C',
  b2b: 'Services B2B',
  commerce: 'Commerce / e-commerce',
  autre: 'Autre',
};
const GOAL_LABEL = {
  // Legacy
  leads: 'Plus de leads', refonte: 'Refonte site/funnel',
  ads: 'Lancer Meta Ads', automation: 'Automatiser ventes',
  // Current
  'more-rdv': '+ de RDV qualifiés',
  cheaper: 'Acquisition − chère',
  predictable: 'Acquisition + prévisible',
  launch: 'Lancer un nouveau produit',
};
const BUDGET_LABEL = {
  none: 'Pas encore lancé', lt2k: '< 2k', '2-5k': '2–5k', '5-15k': '5–15k', '15kplus': '15k+',
};
const TIMING_LABEL = {
  now: 'Dans le mois', quarter: 'Ce trimestre', exploring: 'Pas encore décidé',
};
const OUTCOME_LABEL = {
  recruter: 'Recruter de nouveaux collaborateurs',
  scaler: "Doubler mon CA",
  strategique: 'Reprendre du temps stratégique',
  vacances: 'Enfin prendre de vraies vacances',
  autre: 'Autre',
};

const SECTOR_EMOJI = {
  dental: '🦷', immo: '🏠', auto: '🚗', resto: '🍽️', services: '💼',
  medical: '⚕️', b2c: '🧑‍🤝‍🧑', b2b: '🤝', commerce: '🛍️', autre: '✦',
};

// ═════════════════════════════════════════════════════════════
// META + UTILS
// ═════════════════════════════════════════════════════════════
function useAdminMeta() {
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex,nofollow';
    document.head.appendChild(meta);
    const prev = document.title;
    document.title = 'Kairn CRM';
    return () => { document.head.removeChild(meta); document.title = prev; };
  }, []);
}

function timeAgo(iso) {
  if (!iso) return '';
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return 'à l\'instant';
  if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `il y a ${Math.floor(diff / 3600)} h`;
  if (diff < 86400 * 7) return `il y a ${Math.floor(diff / 86400)} j`;
  return new Date(iso).toLocaleDateString('fr-CH', { day: '2-digit', month: 'short' });
}

function formatDateTime(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('fr-CH', { dateStyle: 'medium', timeStyle: 'short' });
}

function avatarColor(seed) {
  // Simple hash → hue offset, anchored on violet palette
  if (!seed) return 'linear-gradient(135deg, #C4B5FD, #8B5CF6)';
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const tints = [
    'linear-gradient(135deg, #C4B5FD, #8B5CF6)',
    'linear-gradient(135deg, #DDD6FE, #7C3AED)',
    'linear-gradient(135deg, #BFDBFE, #6366F1)',
    'linear-gradient(135deg, #FBCFE8, #A78BFA)',
    'linear-gradient(135deg, #C7D2FE, #8B5CF6)',
  ];
  return tints[h % tints.length];
}

function getInitial(lead) {
  const s = (lead?.first_name || lead?.email || '?').trim();
  return s.charAt(0).toUpperCase() || '?';
}

// ═════════════════════════════════════════════════════════════
// TOAST SYSTEM
// ═════════════════════════════════════════════════════════════
function ToastStack({ toasts, onDismiss }) {
  return (
    <div style={{
      position: 'fixed', top: 80, right: 20, zIndex: 200,
      display: 'flex', flexDirection: 'column', gap: 8,
      pointerEvents: 'none',
    }}>
      {toasts.map((t) => (
        <div key={t.id} className="k-toast" style={{
          pointerEvents: 'auto',
          padding: '10px 14px', borderRadius: 12,
          background: '#0A0A0A', color: '#fff',
          fontSize: 13.5, fontWeight: 500,
          fontFamily: 'Geist, sans-serif',
          boxShadow: '0 14px 40px -12px rgba(10,10,10,.5), 0 0 0 1px rgba(255,255,255,.06) inset',
          display: 'inline-flex', alignItems: 'center', gap: 10,
          minWidth: 220, maxWidth: 360,
          animation: 'k-toast-in .25s cubic-bezier(.2,.7,.3,1)',
        }}>
          {t.icon && <span style={{ flexShrink: 0, color: t.color || '#A78BFA', display: 'inline-flex' }}>{t.icon}</span>}
          <span style={{ flex: 1, lineHeight: 1.4 }}>{t.text}</span>
          {t.action && (
            <button onClick={() => { t.action.onClick(); onDismiss(t.id); }} style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: '#A78BFA', fontFamily: 'Geist, sans-serif',
              fontSize: 13, fontWeight: 600, padding: '4px 8px', borderRadius: 6,
            }}>
              {t.action.label}
            </button>
          )}
          <button onClick={() => onDismiss(t.id)} aria-label="Fermer" style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: 'rgba(255,255,255,.5)', padding: 2,
            display: 'inline-flex', alignItems: 'center',
          }}>
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M3 3 L11 11 M11 3 L3 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          </button>
        </div>
      ))}
      <style>{`
        @keyframes k-toast-in { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>
    </div>
  );
}

const ICONS = {
  check: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7 L6 10 L11 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  trash: <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 5 L13 5 M6 5 V3 H10 V5 M5 5 L6 13 H10 L11 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  arrow: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7 L11 7 M7 3 L11 7 L7 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  download: <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 2 V11 M4 7 L8 11 L12 7 M3 14 H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>,
};

// ═════════════════════════════════════════════════════════════
// LEAD CARD (draggable)
// ═════════════════════════════════════════════════════════════
function LeadCard({ lead, onClick, onAdvanceStage, isOverlay = false }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: lead.id,
    data: { lead },
  });
  const isNew = lead.stage === 'new' && (Date.now() - new Date(lead.created_at).getTime()) < 24 * 3600 * 1000;
  const stageIdx = STAGE_INDEX[lead.stage] ?? 0;
  const canAdvance = stageIdx < STAGES.length - 2; // can't advance past 'won'
  const nextStage = canAdvance ? STAGES[stageIdx + 1] : null;
  const [hover, setHover] = useState(false);

  return (
    <div
      ref={setNodeRef}
      onClick={(e) => {
        if (isDragging) return;
        if (e.target.closest('[data-stage-advance]')) return;
        onClick?.(lead);
      }}
      onMouseEnter={() => !isOverlay && !isDragging && setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: '16px 16px 14px',
        background: '#fff',
        border: '1px solid ' + (hover ? 'var(--lav)' : 'var(--line-2)'),
        borderRadius: 14,
        cursor: isOverlay ? 'grabbing' : 'pointer',
        boxShadow: isOverlay
          ? '0 28px 70px -14px rgba(124,58,237,.5)'
          : isDragging ? 'none' : (hover ? '0 14px 32px -16px rgba(124,58,237,.35)' : '0 1px 0 rgba(10,10,10,.02)'),
        opacity: isDragging && !isOverlay ? 0.4 : 1,
        transition: isOverlay ? 'none' : 'transform .18s cubic-bezier(.4,0,.2,1), box-shadow .18s, border-color .18s',
        transform: hover && !isDragging ? 'translateY(-2px)' : 'none',
        position: 'relative',
        userSelect: 'none',
      }}
    >
      {/* Drag handle (left edge) */}
      <span
        {...attributes}
        {...listeners}
        aria-label="Déplacer"
        style={{
          position: 'absolute', top: 0, bottom: 0, left: 0, width: 16,
          cursor: isOverlay ? 'grabbing' : 'grab',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: hover ? 0.6 : 0.18,
          transition: 'opacity .15s',
          color: 'var(--violet-deep)',
        }}
      >
        <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
          <circle cx="3" cy="3" r="1.1" fill="currentColor" />
          <circle cx="7" cy="3" r="1.1" fill="currentColor" />
          <circle cx="3" cy="7" r="1.1" fill="currentColor" />
          <circle cx="7" cy="7" r="1.1" fill="currentColor" />
          <circle cx="3" cy="11" r="1.1" fill="currentColor" />
          <circle cx="7" cy="11" r="1.1" fill="currentColor" />
        </svg>
      </span>

      {isNew && (
        <span style={{
          position: 'absolute', top: 12, right: 12,
          width: 8, height: 8, borderRadius: '50%',
          background: 'var(--violet)',
          boxShadow: '0 0 0 4px rgba(139,92,246,.18)',
          animation: 'k-card-pulse 2.4s ease-in-out infinite',
        }} />
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 6 }}>
        <span style={{
          flexShrink: 0,
          width: 30, height: 30, borderRadius: '50%',
          background: avatarColor(lead.first_name || lead.email),
          color: '#fff', fontWeight: 600, fontSize: 13,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 0 1.5px rgba(255,255,255,.6) inset, 0 4px 10px -4px rgba(124,58,237,.35)',
          letterSpacing: '-0.01em',
        }}>{getInitial(lead)}</span>
        <div style={{ flex: 1, minWidth: 0, paddingRight: isNew ? 14 : 0 }}>
          <div style={{
            fontSize: 14, fontWeight: 600, letterSpacing: '-0.012em', color: 'var(--ink)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {lead.first_name || '—'}
          </div>
          {lead.company && (
            <div style={{
              fontSize: 12, color: 'var(--muted)', marginTop: 1,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>{lead.company}</div>
          )}
        </div>
      </div>

      {(lead.sector || lead.budget) && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 11, paddingLeft: 6 }}>
          {lead.sector && (
            <span style={{
              fontSize: 11, padding: '3px 9px', borderRadius: 999,
              background: 'rgba(139,92,246,.10)', color: 'var(--violet-deep)',
              fontWeight: 500,
            }}>
              {SECTOR_EMOJI[lead.sector] || '✦'} {SECTOR_LABEL[lead.sector] || lead.sector}
            </span>
          )}
          {lead.budget && (
            <span style={{
              fontSize: 11, padding: '3px 9px', borderRadius: 999,
              background: 'var(--bg-alt)', color: 'var(--ink-soft)',
              fontWeight: 500,
            }}>
              {BUDGET_LABEL[lead.budget] || lead.budget}
            </span>
          )}
        </div>
      )}

      <div style={{
        marginTop: 12, paddingTop: 10, paddingLeft: 6,
        borderTop: '1px solid var(--line)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
        minHeight: 22,
      }}>
        <span className="mono" style={{ fontSize: 10.5, color: 'var(--muted)', letterSpacing: '0.06em' }}>
          {timeAgo(lead.created_at)}
        </span>
        {lead.utm_source && (
          <span className="mono" style={{
            fontSize: 9.5, padding: '2px 7px', borderRadius: 999,
            background: 'var(--bg-alt)', color: 'var(--muted)',
            letterSpacing: '0.08em', textTransform: 'uppercase',
            whiteSpace: 'nowrap', maxWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {lead.utm_source}
          </span>
        )}
        {nextStage && (
          <button
            data-stage-advance="true"
            onClick={(e) => { e.stopPropagation(); onAdvanceStage?.(lead, nextStage.v); }}
            title={`→ ${nextStage.l}`}
            style={{
              opacity: hover ? 1 : 0,
              transition: 'opacity .15s, background .15s, color .15s',
              padding: '3px 8px', borderRadius: 999,
              border: '1px solid ' + nextStage.accent + '40',
              background: nextStage.accent + '15',
              color: nextStage.accent,
              cursor: 'pointer',
              fontSize: 10.5, fontWeight: 600,
              fontFamily: 'Geist, sans-serif',
              letterSpacing: '0.04em',
              display: 'inline-flex', alignItems: 'center', gap: 4,
            }}
          >
            {nextStage.l}
            <svg width="9" height="9" viewBox="0 0 14 14" fill="none"><path d="M3 7 L11 7 M7 3 L11 7 L7 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        )}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// COLUMN (droppable)
// ═════════════════════════════════════════════════════════════
function Column({ stage, leads, onCardClick, onAdvanceStage }) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.v });
  return (
    <div style={{
      flex: '0 0 296px', display: 'flex', flexDirection: 'column',
      maxHeight: '100%',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '12px 14px',
        background: '#fff',
        border: '1px solid var(--line-2)',
        borderRadius: 14,
        marginBottom: 12,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <span style={{
          position: 'absolute', left: 0, top: 0, bottom: 0,
          width: 3, background: stage.accent,
        }} />
        <span style={{
          width: 8, height: 8, borderRadius: '50%',
          background: stage.accent, flexShrink: 0,
        }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, letterSpacing: '-0.01em' }}>{stage.l}</div>
          <div className="mono" style={{ fontSize: 10.5, color: 'var(--muted)', letterSpacing: '0.04em', marginTop: 1 }}>{stage.desc}</div>
        </div>
        <span style={{
          fontSize: 12, fontWeight: 600,
          padding: '3px 9px', borderRadius: 999,
          background: 'var(--bg-alt)', color: 'var(--ink-soft)',
          minWidth: 26, textAlign: 'center',
        }}>
          {leads.length}
        </span>
      </div>
      <div
        ref={setNodeRef}
        style={{
          flex: 1, minHeight: 100,
          padding: 10, borderRadius: 14,
          background: isOver ? 'rgba(139,92,246,.10)' : 'rgba(245,243,255,.55)',
          border: '1px dashed ' + (isOver ? 'var(--violet)' : 'transparent'),
          transition: 'background .15s, border-color .15s',
          display: 'flex', flexDirection: 'column', gap: 10,
          overflowY: 'auto',
        }}
      >
        {leads.length === 0 && !isOver && (
          <div style={{
            padding: '32px 10px', textAlign: 'center',
            fontSize: 12, color: 'var(--muted)',
          }}>
            Aucun lead
          </div>
        )}
        {leads.map((l) => (
          <LeadCard key={l.id} lead={l} onClick={onCardClick} onAdvanceStage={onAdvanceStage} />
        ))}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// LIST VIEW (sortable table)
// ═════════════════════════════════════════════════════════════
function ListView({ leads, onRowClick }) {
  const [sortBy, setSortBy] = useState({ key: 'created_at', dir: 'desc' });

  const sorted = useMemo(() => {
    const arr = [...leads];
    arr.sort((a, b) => {
      const av = a?.[sortBy.key];
      const bv = b?.[sortBy.key];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      const cmp = String(av).localeCompare(String(bv), 'fr');
      return sortBy.dir === 'asc' ? cmp : -cmp;
    });
    return arr;
  }, [leads, sortBy]);

  const toggleSort = (key) => {
    setSortBy((s) => s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' });
  };

  const SortHeader = ({ k, children, align }) => (
    <th onClick={() => toggleSort(k)} style={{
      padding: '12px 14px', textAlign: align || 'left',
      fontSize: 11.5, color: 'var(--muted)', fontWeight: 600,
      letterSpacing: '0.08em', textTransform: 'uppercase',
      cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap',
      borderBottom: '1px solid var(--line-2)',
      background: 'rgba(255,255,255,.85)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      position: 'sticky', top: 0,
    }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
        {children}
        {sortBy.key === k && (
          <svg width="9" height="9" viewBox="0 0 14 14" fill="none" style={{
            transform: sortBy.dir === 'asc' ? 'rotate(180deg)' : 'rotate(0)',
            transition: 'transform .15s', color: 'var(--violet-deep)',
          }}>
            <path d="M3 5 L7 9 L11 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
    </th>
  );

  return (
    <div style={{
      background: '#fff', borderRadius: 14, border: '1px solid var(--line-2)',
      overflow: 'hidden',
      boxShadow: '0 1px 0 rgba(10,10,10,.02), 0 12px 30px -20px rgba(124,58,237,.18)',
    }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%', borderCollapse: 'separate', borderSpacing: 0,
          fontFamily: 'Geist, sans-serif',
        }}>
          <thead>
            <tr>
              <SortHeader k="first_name">Lead</SortHeader>
              <SortHeader k="company">Entreprise</SortHeader>
              <SortHeader k="stage">Stage</SortHeader>
              <SortHeader k="sector">Secteur</SortHeader>
              <SortHeader k="budget">Budget</SortHeader>
              <SortHeader k="utm_source">Source</SortHeader>
              <SortHeader k="created_at">Créé</SortHeader>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: 60, textAlign: 'center', color: 'var(--muted)', fontSize: 13.5 }}>
                  Aucun lead à afficher.
                </td>
              </tr>
            )}
            {sorted.map((l) => (
              <tr key={l.id}
                onClick={() => onRowClick(l)}
                style={{ cursor: 'pointer', transition: 'background .12s' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-alt)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = ''; }}
              >
                <td style={td}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                      flexShrink: 0,
                      width: 26, height: 26, borderRadius: '50%',
                      background: avatarColor(l.first_name || l.email),
                      color: '#fff', fontWeight: 600, fontSize: 12,
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    }}>{getInitial(l)}</span>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--ink)' }}>{l.first_name || '—'}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>{l.email}</div>
                    </div>
                  </div>
                </td>
                <td style={td}>{l.company || '—'}</td>
                <td style={td}>
                  <span style={{
                    fontSize: 11, padding: '3px 9px', borderRadius: 999,
                    background: STAGE_ACCENT[l.stage] + '18', color: STAGE_ACCENT[l.stage],
                    fontWeight: 600, letterSpacing: '0.04em',
                  }}>
                    {STAGE_LABEL[l.stage] || l.stage}
                  </span>
                </td>
                <td style={td}>{l.sector ? `${SECTOR_EMOJI[l.sector] || '✦'} ${SECTOR_LABEL[l.sector] || l.sector}` : '—'}</td>
                <td style={td}>{BUDGET_LABEL[l.budget] || '—'}</td>
                <td style={tdMono}>{l.utm_source || '—'}</td>
                <td style={tdMono}>{timeAgo(l.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const td = {
  padding: '12px 14px', fontSize: 13.5, color: 'var(--ink-soft)',
  borderBottom: '1px solid var(--line)', verticalAlign: 'middle',
};
const tdMono = { ...td, fontFamily: 'Geist Mono, monospace', fontSize: 12, color: 'var(--muted)' };

// ═════════════════════════════════════════════════════════════
// LEAD DRAWER (edit mode) — sectioned redesign
// ═════════════════════════════════════════════════════════════
function LeadDrawer({ lead, onClose, onUpdate, onDelete, pushToast }) {
  const [notes, setNotes] = useState(lead?.notes || '');
  const [stage, setStage] = useState(lead?.stage || 'new');
  const [savedAt, setSavedAt] = useState(null);
  const [savingNotes, setSavingNotes] = useState(false);

  useEffect(() => {
    setNotes(lead?.notes || '');
    setStage(lead?.stage || 'new');
    setSavedAt(null);
  }, [lead?.id]);

  if (!lead) return null;

  const calendlyForLead = (() => {
    try {
      const url = new URL(BOOKING_URL);
      if (lead.first_name) url.searchParams.set('name', lead.first_name);
      if (lead.email) url.searchParams.set('email', lead.email);
      return url.toString();
    } catch (_) { return BOOKING_URL; }
  })();

  const saveNotes = async () => {
    if (notes === (lead.notes || '')) return;
    setSavingNotes(true);
    await onUpdate(lead.id, { notes });
    setSavingNotes(false);
    setSavedAt(Date.now());
    pushToast?.({ text: 'Note sauvegardée', icon: ICONS.check, color: '#10B981' });
  };

  const changeStage = async (newStage) => {
    if (newStage === stage) return;
    setStage(newStage);
    await onUpdate(lead.id, { stage: newStage });
    pushToast?.({ text: `Stage : ${STAGE_LABEL[newStage]}`, icon: ICONS.arrow, color: STAGE_ACCENT[newStage] });
  };

  const remove = async () => {
    if (!window.confirm(`Supprimer définitivement ${lead.first_name || lead.email} ?`)) return;
    const snapshot = { ...lead };
    await onDelete(lead.id);
    pushToast?.({
      text: 'Lead supprimé',
      icon: ICONS.trash,
      color: '#F87171',
      duration: 6000,
      action: {
        label: 'Annuler',
        onClick: async () => {
          if (isSupabaseConfigured) {
            await supabase.from('leads').insert(snapshot);
          }
        },
      },
    });
  };

  const copy = (text, label) => {
    if (!text) return;
    navigator.clipboard?.writeText(text);
    pushToast?.({ text: `${label || 'Copié'} : ${text}`, icon: ICONS.check, color: '#A78BFA' });
  };

  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0,
        background: 'rgba(10,10,10,.36)',
        zIndex: 90, backdropFilter: 'blur(2px)',
        animation: 'kfade .18s ease-out',
      }} />
      <style>{`
        @keyframes kfade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes kslide { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>

      <aside style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 'min(520px, 100vw)',
        background: '#fff',
        boxShadow: '-30px 0 80px -20px rgba(10,10,10,.28)',
        zIndex: 100,
        overflowY: 'auto',
        animation: 'kslide .26s cubic-bezier(.2,.7,.3,1)',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Sticky header */}
        <div style={{
          padding: '20px 22px 18px', borderBottom: '1px solid var(--line)',
          position: 'sticky', top: 0, background: '#fff', zIndex: 2,
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <span style={{
              flexShrink: 0,
              width: 48, height: 48, borderRadius: '50%',
              background: avatarColor(lead.first_name || lead.email),
              color: '#fff', fontWeight: 600, fontSize: 20,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 0 1.5px rgba(255,255,255,.6) inset, 0 8px 18px -6px rgba(124,58,237,.5)',
            }}>{getInitial(lead)}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.025em', lineHeight: 1.15, margin: 0 }}>
                {lead.first_name || '—'}
              </h2>
              {lead.company && (
                <div style={{ fontSize: 13.5, color: 'var(--muted)', marginTop: 3 }}>{lead.company}</div>
              )}
              <span className="mono" style={{
                display: 'inline-block', marginTop: 6,
                fontSize: 10.5, color: 'var(--muted)',
                letterSpacing: '0.08em', textTransform: 'uppercase',
              }}>
                Créé {timeAgo(lead.created_at)}
              </span>
            </div>
            <button onClick={remove} title="Supprimer le lead" style={{
              background: 'transparent', border: '1px solid var(--line-2)',
              borderRadius: 10, cursor: 'pointer',
              padding: 8, color: '#9CA3AF',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              transition: 'color .15s, background .15s, border-color .15s',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#DC2626'; e.currentTarget.style.borderColor = '#FECACA'; e.currentTarget.style.background = '#FEF2F2'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#9CA3AF'; e.currentTarget.style.borderColor = 'var(--line-2)'; e.currentTarget.style.background = 'transparent'; }}
            >
              {ICONS.trash}
            </button>
            <button onClick={onClose} aria-label="Fermer" style={{
              background: 'transparent', border: '1px solid var(--line-2)',
              borderRadius: 10, cursor: 'pointer',
              padding: 8, color: 'var(--muted)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 3 L11 11 M11 3 L3 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
            </button>
          </div>

          {/* Stage selector */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 16 }}>
            {STAGES.map((s) => (
              <button key={s.v} onClick={() => changeStage(s.v)} style={{
                padding: '7px 12px', borderRadius: 999,
                background: stage === s.v ? s.accent : '#fff',
                color: stage === s.v ? '#fff' : 'var(--ink-soft)',
                border: '1px solid ' + (stage === s.v ? s.accent : 'var(--line-2)'),
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
                fontFamily: 'Geist, sans-serif', letterSpacing: '0.01em',
                transition: 'all .15s',
                boxShadow: stage === s.v ? `0 6px 16px -6px ${s.accent}` : 'none',
              }}>
                {s.l}
              </button>
            ))}
          </div>

          {/* Quick actions */}
          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <a href={`mailto:${lead.email}?subject=${encodeURIComponent('Suite à votre demande Kairn')}`} style={quickActionPrimary}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="2" y="3.5" width="12" height="9" rx="1.4" stroke="currentColor" strokeWidth="1.4" /><path d="M2.5 4.5 L8 9 L13.5 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
              Email
            </a>
            {lead.phone && (
              <a href={`tel:${lead.phone}`} style={quickActionSecondary}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 2 H6 L7.5 5.5 L5.5 7 C6.5 9 7 9.5 9 10.5 L10.5 8.5 L14 10 V13 C14 13.6 13.6 14 13 14 C7 14 2 9 2 3 C2 2.4 2.4 2 3 2 Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>
                Appeler
              </a>
            )}
            <a href={calendlyForLead} target="_blank" rel="noopener noreferrer" style={quickActionSecondary}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="11" rx="1.4" stroke="currentColor" strokeWidth="1.4" /><path d="M2 6 H14 M5 1 V4 M11 1 V4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
              Calendly
            </a>
          </div>
        </div>

        {/* Body sections */}
        <div style={{ padding: '20px 22px 24px', flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Profil */}
          <DrawerSection title="Profil">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <ProfileField label="Email" value={lead.email} onCopy={() => copy(lead.email, 'Email')} />
              {lead.phone && <ProfileField label="Téléphone" value={lead.phone} onCopy={() => copy(lead.phone, 'Téléphone')} />}
              {lead.sector && <ProfileField label="Secteur" value={`${SECTOR_EMOJI[lead.sector] || ''} ${SECTOR_LABEL[lead.sector] || lead.sector}`} />}
              {lead.budget && <ProfileField label="Budget" value={BUDGET_LABEL[lead.budget] || lead.budget} />}
              {lead.goal && <ProfileField label="Objectif" value={GOAL_LABEL[lead.goal] || lead.goal} />}
              {lead.outcome && <ProfileField label="Outcome" value={OUTCOME_LABEL[lead.outcome] || lead.outcome} />}
              {lead.timing && <ProfileField label="Timing" value={TIMING_LABEL[lead.timing] || lead.timing} />}
            </div>
            {(lead.utm_source || lead.utm_campaign || lead.utm_content) && (
              <div className="mono" style={{
                marginTop: 14, padding: '10px 12px',
                background: 'var(--bg-alt)', borderRadius: 10,
                fontSize: 11, color: 'var(--muted)',
                letterSpacing: '0.04em',
                display: 'flex', flexWrap: 'wrap', gap: 14,
              }}>
                {lead.utm_source && <span>source: <strong style={{ color: 'var(--violet-deep)' }}>{lead.utm_source}</strong></span>}
                {lead.utm_campaign && <span>campaign: <strong style={{ color: 'var(--violet-deep)' }}>{lead.utm_campaign}</strong></span>}
                {lead.utm_content && <span>content: <strong style={{ color: 'var(--violet-deep)' }}>{lead.utm_content}</strong></span>}
              </div>
            )}
          </DrawerSection>

          {/* Notes */}
          <DrawerSection title="Notes" trailing={
            savingNotes ? <span style={{ fontSize: 11, color: 'var(--muted)' }}>Sauvegarde…</span> :
            savedAt ? <SavedIndicator savedAt={savedAt} /> : null
          }>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={saveNotes}
              placeholder="Vos notes — auto-sauvegarde quand vous cliquez ailleurs."
              style={{
                width: '100%', minHeight: 130, resize: 'vertical',
                padding: '12px 14px', borderRadius: 12,
                border: '1px solid var(--line-2)', background: '#fff',
                fontSize: 14, fontFamily: 'Geist, sans-serif', color: 'var(--ink)',
                outline: 'none', lineHeight: 1.6,
                transition: 'border-color .15s, box-shadow .15s', boxSizing: 'border-box',
              }}
              onFocus={(e) => { e.target.style.borderColor = 'var(--violet)'; e.target.style.boxShadow = '0 0 0 4px rgba(139,92,246,.12)'; }}
              onMouseLeave={(e) => { /* keep focus */ }}
            />
          </DrawerSection>

          {/* Activité */}
          <DrawerSection title="Activité">
            <Timeline lead={lead} />
          </DrawerSection>
        </div>
      </aside>
    </>
  );
}

const quickActionPrimary = {
  flex: 1, padding: '10px 14px', borderRadius: 10,
  background: 'linear-gradient(180deg, #9B6FFB, #7C3AED)', color: '#fff',
  fontSize: 13, fontWeight: 600, textAlign: 'center',
  textDecoration: 'none', fontFamily: 'Geist, sans-serif',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
  boxShadow: '0 8px 18px -6px rgba(124,58,237,.5)',
};
const quickActionSecondary = {
  flex: 1, padding: '10px 14px', borderRadius: 10,
  background: '#fff', color: 'var(--ink-soft)',
  border: '1px solid var(--line-2)',
  fontSize: 13, fontWeight: 500, textAlign: 'center',
  textDecoration: 'none', fontFamily: 'Geist, sans-serif',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
};

function DrawerSection({ title, trailing, children }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span className="mono" style={{
          fontSize: 11, color: 'var(--violet-deep)',
          letterSpacing: '0.18em', textTransform: 'uppercase',
          fontWeight: 600,
        }}>{title}</span>
        {trailing}
      </div>
      {children}
    </div>
  );
}

function ProfileField({ label, value, onCopy }) {
  const [hover, setHover] = useState(false);
  const clickable = !!onCopy && !!value;
  return (
    <div
      onClick={clickable ? onCopy : undefined}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      title={clickable ? 'Copier' : undefined}
      style={{
        padding: '9px 12px', borderRadius: 10,
        background: hover && clickable ? 'var(--bg-alt)' : 'rgba(245,243,255,.4)',
        border: '1px solid ' + (hover && clickable ? 'var(--lav)' : 'var(--line)'),
        cursor: clickable ? 'pointer' : 'default',
        transition: 'background .12s, border-color .12s',
      }}
    >
      <div className="mono" style={{
        fontSize: 10, color: 'var(--muted)',
        letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600,
        marginBottom: 3,
      }}>{label}</div>
      <div style={{
        fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.4,
        wordBreak: 'break-word',
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <span style={{ flex: 1, minWidth: 0 }}>{value}</span>
        {clickable && hover && (
          <svg width="11" height="11" viewBox="0 0 14 14" fill="none" style={{ color: 'var(--violet-deep)', flexShrink: 0 }}>
            <rect x="3" y="3" width="8" height="8" rx="1.4" stroke="currentColor" strokeWidth="1.4" />
            <path d="M5 5 V2 H12 V9 H10" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
          </svg>
        )}
      </div>
    </div>
  );
}

function SavedIndicator({ savedAt }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 30000);
    return () => clearInterval(t);
  }, []);
  void tick;
  return (
    <span style={{
      fontSize: 11, color: '#10B981', fontWeight: 500,
      display: 'inline-flex', alignItems: 'center', gap: 5,
    }}>
      <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
        <path d="M3 7 L6 10 L11 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Sauvegardé {timeAgo(new Date(savedAt).toISOString())}
    </span>
  );
}

function Timeline({ lead }) {
  const items = [];
  items.push({
    label: 'Lead créé',
    detail: lead.utm_source ? `Source: ${lead.utm_source}` : null,
    iso: lead.created_at,
    color: 'var(--violet)',
  });
  if (lead.updated_at && lead.updated_at !== lead.created_at) {
    items.push({
      label: `Stage actuel : ${STAGE_LABEL[lead.stage] || lead.stage}`,
      detail: 'Dernière mise à jour',
      iso: lead.updated_at,
      color: STAGE_ACCENT[lead.stage] || 'var(--violet)',
    });
  }
  items.sort((a, b) => new Date(b.iso) - new Date(a.iso));

  return (
    <div style={{ position: 'relative', paddingLeft: 22 }}>
      <div style={{
        position: 'absolute', left: 7, top: 6, bottom: 6,
        width: 1, background: 'linear-gradient(180deg, var(--lav), transparent)',
      }} />
      {items.map((it, i) => (
        <div key={i} style={{ position: 'relative', paddingBottom: i < items.length - 1 ? 16 : 0 }}>
          <span style={{
            position: 'absolute', left: -22, top: 4,
            width: 14, height: 14, borderRadius: '50%',
            background: '#fff', border: `2px solid ${it.color}`,
            boxShadow: `0 0 0 2px #fff, 0 4px 10px -4px ${it.color}50`,
          }} />
          <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--ink)' }}>{it.label}</div>
          {it.detail && <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{it.detail}</div>}
          <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', marginTop: 3, letterSpacing: '0.04em' }}>
            {formatDateTime(it.iso)}
          </div>
        </div>
      ))}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// CREATE LEAD MODAL
// ═════════════════════════════════════════════════════════════
function CreateLeadModal({ open, onClose, onCreated, pushToast }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!open) return null;

  const submit = async (payload) => {
    setError(null);
    setSubmitting(true);
    if (!isSupabaseConfigured) {
      setError({ kind: 'config', message: 'Supabase n\'est pas configuré dans le .env.' });
      setSubmitting(false);
      return;
    }
    const { data, error: dbErr } = await supabase.from('leads').insert(payload).select().single();
    setSubmitting(false);
    if (dbErr) {
      const isRls = /row-level security|RLS|401|permission denied|new row violates/i.test(`${dbErr.code} ${dbErr.message}`);
      setError({ kind: isRls ? 'rls' : 'db', message: dbErr.message, code: dbErr.code });
      return;
    }
    onCreated?.(data);
    onClose();
    pushToast?.({ text: 'Lead ajouté.', icon: ICONS.check, color: '#10B981' });
  };

  const close = () => { setError(null); onClose(); };

  return (
    <>
      <div onClick={close} style={{
        position: 'fixed', inset: 0,
        background: 'rgba(10,10,10,.4)',
        zIndex: 90, backdropFilter: 'blur(3px)',
        animation: 'kfade .18s ease-out',
      }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 'min(580px, calc(100vw - 32px))', maxHeight: 'calc(100vh - 60px)', overflowY: 'auto',
        background: '#fff', borderRadius: 18,
        boxShadow: '0 40px 100px -20px rgba(10,10,10,.4)',
        zIndex: 100, padding: 28, boxSizing: 'border-box',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div>
            <span className="mono" style={{
              fontSize: 11, color: 'var(--violet-deep)',
              letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600,
            }}>Nouveau lead</span>
            <h2 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.025em', marginTop: 6 }}>
              Ajouter manuellement
            </h2>
          </div>
          <button onClick={close} aria-label="Fermer" style={{
            background: 'transparent', border: '1px solid var(--line-2)',
            borderRadius: 10, cursor: 'pointer', padding: 8, color: 'var(--muted)',
            display: 'inline-flex', alignItems: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 3 L11 11 M11 3 L3 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
          </button>
        </div>

        {error && error.kind === 'rls' && (
          <div style={{
            padding: '14px 16px', borderRadius: 12, marginBottom: 16,
            background: '#FFFBEB', border: '1px solid #FDE68A', color: '#92400E',
            fontSize: 13, lineHeight: 1.55,
          }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>RLS Supabase bloque l'insertion.</div>
            <div style={{ marginBottom: 8 }}>
              Votre table <code style={{ fontFamily: 'Geist Mono, monospace', fontSize: 12, padding: '1px 5px', background: 'rgba(0,0,0,.06)', borderRadius: 4 }}>leads</code> a une policy qui exige une auth. Pour autoriser les inserts depuis ce CRM (et le formulaire public), exécute ce SQL dans <strong>Supabase Studio → SQL Editor</strong>&nbsp;:
            </div>
            <pre style={{
              fontFamily: 'Geist Mono, monospace', fontSize: 11, lineHeight: 1.5,
              background: '#0A0A0A', color: '#E9D5FF',
              padding: '10px 12px', borderRadius: 8,
              overflowX: 'auto', margin: 0,
            }}>{`CREATE POLICY "anon insert leads" ON leads
FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon update leads" ON leads
FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "anon delete leads" ON leads
FOR DELETE TO anon USING (true);`}</pre>
          </div>
        )}

        {error && error.kind === 'db' && (
          <div style={{
            padding: '12px 14px', borderRadius: 10, marginBottom: 16,
            background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B',
            fontSize: 13, lineHeight: 1.5,
          }}>
            Erreur Supabase {error.code ? `(${error.code})` : ''}&nbsp;: {error.message}
          </div>
        )}

        {error && error.kind === 'config' && (
          <div style={{
            padding: '12px 14px', borderRadius: 10, marginBottom: 16,
            background: '#FFFBEB', border: '1px solid #FDE68A', color: '#92400E',
            fontSize: 13, lineHeight: 1.5,
          }}>
            {error.message}
          </div>
        )}

        <LeadForm onSubmit={submit} onCancel={close} submitting={submitting} />
      </div>
    </>
  );
}

// ═════════════════════════════════════════════════════════════
// CRM ROOT
// ═════════════════════════════════════════════════════════════
export default function AdminCRM() {
  useAdminMeta();
  const { signOut } = useAuth();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [search, setSearch] = useState('');
  const [filterSector, setFilterSector] = useState('');
  const [filterBudget, setFilterBudget] = useState('');
  const [filterStage, setFilterStage] = useState('');
  const [activeLeadId, setActiveLeadId] = useState(null);
  const [draggingLead, setDraggingLead] = useState(null);
  const [view, setView] = useState(() => {
    try { return localStorage.getItem('kairn_admin_view') || 'kanban'; } catch (_) { return 'kanban'; }
  });
  const [createOpen, setCreateOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const searchRef = useRef(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  // Toast helper
  const pushToast = useCallback((toast) => {
    const id = Math.random().toString(36).slice(2);
    const t = { id, duration: 3000, ...toast };
    setToasts((prev) => [...prev, t]);
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), t.duration);
  }, []);
  const dismissToast = (id) => setToasts((prev) => prev.filter((x) => x.id !== id));

  // Persist view
  useEffect(() => {
    try { localStorage.setItem('kairn_admin_view', view); } catch (_) {}
  }, [view]);

  // ⌘K / Ctrl+K to focus search
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const fetchLeads = useCallback(async () => {
    if (!isSupabaseConfigured) { setLoading(false); return; }
    setLoadError('');
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      setLoadError(error.message);
    } else {
      setLeads(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  // Realtime subscription
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const channel = supabase
      .channel('leads-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setLeads((prev) => [payload.new, ...prev.filter(l => l.id !== payload.new.id)]);
        } else if (payload.eventType === 'UPDATE') {
          setLeads((prev) => prev.map(l => l.id === payload.new.id ? payload.new : l));
        } else if (payload.eventType === 'DELETE') {
          setLeads((prev) => prev.filter(l => l.id !== payload.old.id));
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const updateLead = async (id, patch) => {
    setLeads((prev) => prev.map(l => l.id === id ? { ...l, ...patch, updated_at: new Date().toISOString() } : l));
    if (!isSupabaseConfigured) return;
    const { error } = await supabase.from('leads').update(patch).eq('id', id);
    if (error) {
      setLoadError(error.message);
      fetchLeads();
    }
  };

  const deleteLead = async (id) => {
    setLeads((prev) => prev.filter(l => l.id !== id));
    setActiveLeadId(null);
    if (!isSupabaseConfigured) return;
    const { error } = await supabase.from('leads').delete().eq('id', id);
    if (error) {
      setLoadError(error.message);
      fetchLeads();
    }
  };

  const advanceStage = (lead, newStage) => {
    updateLead(lead.id, { stage: newStage });
    pushToast({ text: `${lead.first_name || 'Lead'} → ${STAGE_LABEL[newStage]}`, icon: ICONS.arrow, color: STAGE_ACCENT[newStage] });
  };

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      if (filterSector && l.sector !== filterSector) return false;
      if (filterBudget && l.budget !== filterBudget) return false;
      if (filterStage && l.stage !== filterStage) return false;
      if (search) {
        const q = search.toLowerCase();
        const hay = `${l.first_name || ''} ${l.company || ''} ${l.email || ''} ${l.phone || ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [leads, search, filterSector, filterBudget, filterStage]);

  const byStage = useMemo(() => {
    const buckets = Object.fromEntries(STAGES.map(s => [s.v, []]));
    for (const l of filtered) {
      const s = buckets[l.stage] ? l.stage : 'new';
      buckets[s].push(l);
    }
    return buckets;
  }, [filtered]);

  const kpis = useMemo(() => {
    const counts = Object.fromEntries(STAGES.map(s => [s.v, 0]));
    for (const l of leads) counts[l.stage] = (counts[l.stage] || 0) + 1;
    const won = counts.won || 0;
    const lost = counts.lost || 0;
    const closedRatio = (won + lost) > 0 ? Math.round((won / (won + lost)) * 100) : null;

    const oneWeekAgo = Date.now() - 7 * 86400 * 1000;
    const twoWeekAgo = Date.now() - 14 * 86400 * 1000;
    const newWeek = leads.filter(l => new Date(l.created_at).getTime() > oneWeekAgo).length;
    const newPrevWeek = leads.filter(l => {
      const t = new Date(l.created_at).getTime();
      return t > twoWeekAgo && t <= oneWeekAgo;
    }).length;
    const weekDelta = newWeek - newPrevWeek;

    const activeCount = ACTIVE_STAGES.reduce((acc, s) => acc + (counts[s] || 0), 0);

    // Average days from created → qualified/won/lost (terminal-ish stages)
    const settled = leads.filter(l => ['qualified', 'won', 'lost'].includes(l.stage) && l.updated_at);
    const avgDaysQual = settled.length
      ? Math.round(settled.reduce((acc, l) => acc + (new Date(l.updated_at) - new Date(l.created_at)) / 86400000, 0) / settled.length)
      : null;

    return { counts, closedRatio, newWeek, weekDelta, activeCount, avgDaysQual };
  }, [leads]);

  const onDragStart = (e) => {
    const lead = leads.find(l => l.id === e.active.id);
    setDraggingLead(lead);
  };

  const onDragEnd = (e) => {
    setDraggingLead(null);
    const { active, over } = e;
    if (!over) return;
    const newStage = over.id;
    if (!STAGES.find(s => s.v === newStage)) return;
    const lead = leads.find(l => l.id === active.id);
    if (!lead || lead.stage === newStage) return;
    updateLead(lead.id, { stage: newStage });
    pushToast({ text: `${lead.first_name || 'Lead'} → ${STAGE_LABEL[newStage]}`, icon: ICONS.arrow, color: STAGE_ACCENT[newStage] });
  };

  const exportCsv = () => {
    const csv = leadsToCsv(filtered);
    downloadCsv(`kairn-leads-${dateStamp()}.csv`, csv);
    pushToast({ text: `CSV exporté · ${filtered.length} lead${filtered.length > 1 ? 's' : ''}`, icon: ICONS.download, color: '#A78BFA' });
  };

  const activeLead = leads.find(l => l.id === activeLeadId);
  const filtersActive = !!(search || filterSector || filterBudget || filterStage);

  return (
    <div className="kairn" style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        @keyframes k-card-pulse {
          0%, 100% { box-shadow: 0 0 0 4px rgba(139,92,246,.18); }
          50% { box-shadow: 0 0 0 7px rgba(139,92,246,.06); }
        }
        @keyframes k-spin { to { transform: rotate(360deg); } }
      `}</style>

      <ToastStack toasts={toasts} onDismiss={dismissToast} />

      {/* Top bar */}
      <header style={{
        height: 64, padding: '0 24px',
        background: 'rgba(255,255,255,.85)',
        backdropFilter: 'saturate(140%) blur(14px)',
        WebkitBackdropFilter: 'saturate(140%) blur(14px)',
        borderBottom: '1px solid var(--line-2)',
        position: 'sticky', top: 0, zIndex: 40,
        display: 'flex', alignItems: 'center',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 16,
          maxWidth: 1600, margin: '0 auto', width: '100%',
        }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'var(--ink)', flexShrink: 0 }}>
            <KairnMark />
            <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 16, fontWeight: 600, letterSpacing: '-0.02em' }}>Kairn</span>
          </Link>
          <span style={{ height: 18, width: 1, background: 'var(--line-2)', flexShrink: 0 }} />
          <span style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--ink-soft)', flexShrink: 0 }}>CRM · Leads</span>

          {/* Search bar */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: 460 }}>
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" style={{
                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                color: 'var(--muted)', pointerEvents: 'none',
              }}>
                <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" />
                <path d="M14 14 L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                ref={searchRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un lead…"
                style={{
                  width: '100%', padding: '10px 60px 10px 38px',
                  borderRadius: 12, border: '1px solid var(--line-2)',
                  background: '#fff', fontSize: 13.5, fontFamily: 'Geist, sans-serif',
                  color: 'var(--ink)', outline: 'none', boxSizing: 'border-box',
                  transition: 'border-color .15s, box-shadow .15s',
                }}
                onFocus={(e) => { e.target.style.borderColor = 'var(--violet)'; e.target.style.boxShadow = '0 0 0 4px rgba(139,92,246,.12)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--line-2)'; e.target.style.boxShadow = 'none'; }}
              />
              <span className="mono" style={{
                position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                fontSize: 10.5, color: 'var(--muted)',
                padding: '3px 6px', borderRadius: 5,
                background: 'var(--bg-alt)', border: '1px solid var(--line-2)',
                pointerEvents: 'none',
              }}>⌘K</span>
            </div>
          </div>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <button onClick={exportCsv} title="Exporter en CSV" style={topBtnGhost}>
              {ICONS.download}
              <span style={{ marginLeft: 6 }}>CSV</span>
            </button>
            <button onClick={() => setCreateOpen(true)} style={topBtnPrimary}>
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path d="M7 3 V11 M3 7 H11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <span style={{ marginLeft: 6 }}>Nouveau lead</span>
            </button>
            <div style={{ position: 'relative' }}>
              <button onClick={() => setAccountOpen((v) => !v)} aria-label="Compte" style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'linear-gradient(135deg, #C4B5FD, #7C3AED)',
                color: '#fff', fontWeight: 600, fontSize: 14,
                border: 'none', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 0 1.5px rgba(255,255,255,.7) inset, 0 6px 16px -6px rgba(124,58,237,.45)',
              }}>M</button>
              {accountOpen && (
                <>
                  <div onClick={() => setAccountOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 50 }} />
                  <div style={{
                    position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                    background: '#fff', border: '1px solid var(--line-2)',
                    borderRadius: 12, padding: 6, minWidth: 180,
                    boxShadow: '0 24px 60px -12px rgba(10,10,10,.18)',
                    zIndex: 60,
                  }}>
                    <button onClick={() => { setAccountOpen(false); signOut(); }} style={{
                      width: '100%', padding: '10px 12px', borderRadius: 8,
                      background: 'transparent', border: 'none', cursor: 'pointer',
                      fontFamily: 'Geist, sans-serif', fontSize: 13.5, color: 'var(--ink)',
                      display: 'flex', alignItems: 'center', gap: 8, textAlign: 'left',
                    }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-alt)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M11 4 V3 H4 V13 H11 V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M7 8 H14 M11 5 L14 8 L11 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Se déconnecter
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* KPI dashboard */}
      <div style={{ padding: '20px 24px 0', maxWidth: 1600, width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 14,
        }}>
          <KpiCard
            label="Pipeline actif"
            value={kpis.activeCount}
            sub={`${ACTIVE_STAGES.length} étapes`}
            accent="#8B5CF6"
            icon={<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="3" rx="1" stroke="currentColor" strokeWidth="1.4" /><rect x="2" y="7" width="9" height="3" rx="1" stroke="currentColor" strokeWidth="1.4" /><rect x="2" y="11" width="6" height="3" rx="1" stroke="currentColor" strokeWidth="1.4" /></svg>}
          />
          <KpiCard
            label="Nouveaux · 7j"
            value={kpis.newWeek}
            sub={kpis.weekDelta === 0 ? 'stable vs S-1' : (kpis.weekDelta > 0 ? `+${kpis.weekDelta} vs S-1` : `${kpis.weekDelta} vs S-1`)}
            subColor={kpis.weekDelta > 0 ? '#10B981' : kpis.weekDelta < 0 ? '#EF4444' : 'var(--muted)'}
            accent="#6366F1"
            icon={<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 3 V13 M3 8 H13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>}
          />
          <KpiCard
            label="Taux de closing"
            value={kpis.closedRatio !== null ? `${kpis.closedRatio}%` : '—'}
            sub={`${kpis.counts.won} gagné · ${kpis.counts.lost} perdu`}
            accent="#10B981"
            progress={kpis.closedRatio}
            icon={<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8 L7 12 L13 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
          />
          <KpiCard
            label="Délai moyen → qualifié"
            value={kpis.avgDaysQual !== null ? `${kpis.avgDaysQual} j` : '—'}
            sub={kpis.avgDaysQual !== null ? `${(leads.filter(l => ['qualified','won','lost'].includes(l.stage))).length} leads` : '—'}
            accent="#F59E0B"
            icon={<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.4" /><path d="M8 5 V8 L10 9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>}
          />
        </div>
      </div>

      {/* View toggle + filters */}
      <div style={{
        padding: '18px 24px 8px', maxWidth: 1600, width: '100%', margin: '0 auto',
        boxSizing: 'border-box',
        display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
      }}>
        <div style={{
          display: 'inline-flex', padding: 3, borderRadius: 999,
          background: '#fff', border: '1px solid var(--line-2)',
        }}>
          <ToggleBtn active={view === 'kanban'} onClick={() => setView('kanban')}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="3.5" height="12" rx="1" stroke="currentColor" strokeWidth="1.4" /><rect x="6.5" y="2" width="3.5" height="9" rx="1" stroke="currentColor" strokeWidth="1.4" /><rect x="11" y="2" width="3" height="6" rx="1" stroke="currentColor" strokeWidth="1.4" /></svg>
            Kanban
          </ToggleBtn>
          <ToggleBtn active={view === 'list'} onClick={() => setView('list')}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M3 4 H13 M3 8 H13 M3 12 H13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            Liste
          </ToggleBtn>
        </div>

        <span style={{ height: 24, width: 1, background: 'var(--line-2)' }} />

        <SelectFilter value={filterStage} onChange={setFilterStage} placeholder="Tous stages" options={STAGES.map(s => ({ v: s.v, l: s.l }))} />
        <SelectFilter value={filterSector} onChange={setFilterSector} placeholder="Tous secteurs" options={[
          ['medical','Médical'], ['b2c','B2C'], ['b2b','B2B'], ['commerce','Commerce'], ['autre','Autre'],
        ].map(([v, l]) => ({ v, l }))} />
        <SelectFilter value={filterBudget} onChange={setFilterBudget} placeholder="Tous budgets" options={Object.entries(BUDGET_LABEL).map(([v, l]) => ({ v, l }))} />

        {filtersActive && (
          <button onClick={() => { setSearch(''); setFilterSector(''); setFilterBudget(''); setFilterStage(''); }} style={{
            padding: '8px 12px', borderRadius: 999,
            background: 'transparent', border: '1px solid var(--line-2)',
            fontFamily: 'Geist, sans-serif', fontSize: 12.5, color: 'var(--muted)',
            cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 5,
          }}>
            <svg width="11" height="11" viewBox="0 0 14 14" fill="none"><path d="M3 3 L11 11 M11 3 L3 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            Effacer
          </button>
        )}

        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--muted)' }}>
          <strong style={{ color: 'var(--ink)', fontWeight: 600 }}>{filtered.length}</strong>{' '}
          {filtered.length > 1 ? 'leads' : 'lead'}{filtersActive && ` · ${leads.length} total`}
        </span>
      </div>

      {/* Errors */}
      {!isSupabaseConfigured && (
        <div style={{ margin: '12px 24px', padding: '14px 16px', borderRadius: 12, background: '#FFFBEB', border: '1px solid #FDE68A', color: '#92400E', fontSize: 13.5, lineHeight: 1.5, maxWidth: 1600, marginLeft: 'auto', marginRight: 'auto' }}>
          Supabase n'est pas configuré. Renseignez <code>VITE_SUPABASE_URL</code> et <code>VITE_SUPABASE_ANON_KEY</code> dans <code>.env</code>.
        </div>
      )}
      {loadError && (
        <div style={{ margin: '12px 24px', padding: '14px 16px', borderRadius: 12, background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', fontSize: 13.5, maxWidth: 1600, marginLeft: 'auto', marginRight: 'auto' }}>
          Erreur : {loadError}
        </div>
      )}

      {/* Board / List */}
      <div style={{
        flex: 1, padding: '12px 24px 32px',
        maxWidth: 1600, width: '100%', margin: '0 auto', boxSizing: 'border-box',
        overflowX: view === 'kanban' ? 'auto' : 'visible',
        overflowY: 'visible',
      }}>
        {loading ? (
          <div style={{ padding: 60, textAlign: 'center', color: 'var(--muted)', fontSize: 14 }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              border: '2.5px solid var(--line-2)', borderTopColor: 'var(--violet)',
              margin: '0 auto 14px', animation: 'k-spin 0.8s linear infinite',
            }} />
            Chargement des leads…
          </div>
        ) : view === 'kanban' ? (
          <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={onDragStart} onDragEnd={onDragEnd}>
            <div style={{
              display: 'flex', gap: 16,
              minHeight: 'calc(100vh - 280px)',
              paddingBottom: 16,
            }}>
              {STAGES.map((stage) => (
                <Column
                  key={stage.v}
                  stage={stage}
                  leads={byStage[stage.v] || []}
                  onCardClick={(l) => setActiveLeadId(l.id)}
                  onAdvanceStage={advanceStage}
                />
              ))}
            </div>
            <DragOverlay>
              {draggingLead ? <LeadCard lead={draggingLead} isOverlay /> : null}
            </DragOverlay>
          </DndContext>
        ) : (
          <ListView leads={filtered} onRowClick={(l) => setActiveLeadId(l.id)} />
        )}
      </div>

      {activeLead && (
        <LeadDrawer
          lead={activeLead}
          onClose={() => setActiveLeadId(null)}
          onUpdate={updateLead}
          onDelete={deleteLead}
          pushToast={pushToast}
        />
      )}

      <CreateLeadModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={(lead) => setLeads((prev) => [lead, ...prev.filter(l => l.id !== lead.id)])}
        pushToast={pushToast}
      />
    </div>
  );
}

const topBtnGhost = {
  display: 'inline-flex', alignItems: 'center',
  padding: '8px 14px', borderRadius: 999,
  background: '#fff', border: '1px solid var(--line-2)',
  fontFamily: 'Geist, sans-serif', fontSize: 13, fontWeight: 500,
  color: 'var(--ink-soft)', cursor: 'pointer',
  transition: 'background .12s, border-color .12s',
};

const topBtnPrimary = {
  display: 'inline-flex', alignItems: 'center',
  padding: '9px 16px', borderRadius: 999,
  background: 'linear-gradient(180deg, #9B6FFB, #7C3AED)',
  color: '#fff', border: 'none',
  fontFamily: 'Geist, sans-serif', fontSize: 13, fontWeight: 600,
  cursor: 'pointer',
  boxShadow: '0 8px 18px -6px rgba(124,58,237,.55)',
};

function ToggleBtn({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      padding: '7px 14px', borderRadius: 999,
      background: active ? 'linear-gradient(180deg, #9B6FFB, #7C3AED)' : 'transparent',
      color: active ? '#fff' : 'var(--ink-soft)',
      border: 'none', cursor: 'pointer',
      fontFamily: 'Geist, sans-serif', fontSize: 12.5, fontWeight: 600,
      display: 'inline-flex', alignItems: 'center', gap: 6,
      boxShadow: active ? '0 4px 12px -4px rgba(124,58,237,.5)' : 'none',
      transition: 'all .15s',
    }}>{children}</button>
  );
}

function KpiCard({ label, value, sub, subColor, accent, icon, progress }) {
  return (
    <div style={{
      padding: 18, borderRadius: 14,
      background: '#fff', border: '1px solid var(--line-2)',
      boxShadow: '0 1px 0 rgba(10,10,10,.02), 0 12px 30px -22px rgba(124,58,237,.22)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span className="mono" style={{
          fontSize: 10.5, color: 'var(--muted)',
          letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600,
        }}>{label}</span>
        <span style={{
          width: 26, height: 26, borderRadius: 8,
          background: accent + '15',
          color: accent,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}>{icon}</span>
      </div>
      <div style={{
        fontSize: 28, fontWeight: 600, letterSpacing: '-0.03em', color: 'var(--ink)',
        lineHeight: 1, marginBottom: 6,
      }}>{value}</div>
      {sub && (
        <div style={{ fontSize: 11.5, color: subColor || 'var(--muted)', fontWeight: 500 }}>{sub}</div>
      )}
      {typeof progress === 'number' && (
        <div style={{
          marginTop: 10, height: 4, borderRadius: 999,
          background: 'var(--line)', overflow: 'hidden',
        }}>
          <div style={{
            width: `${Math.max(0, Math.min(100, progress))}%`, height: '100%',
            background: accent, borderRadius: 999,
            transition: 'width .6s cubic-bezier(.4,0,.2,1)',
          }} />
        </div>
      )}
    </div>
  );
}

function SelectFilter({ value, onChange, placeholder, options }) {
  return (
    <div style={{ position: 'relative' }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none',
          padding: '8px 32px 8px 14px',
          borderRadius: 999, border: '1px solid var(--line-2)',
          background: '#fff', fontSize: 12.5, fontFamily: 'Geist, sans-serif',
          color: value ? 'var(--ink)' : 'var(--muted)',
          fontWeight: 500,
          outline: 'none', cursor: 'pointer',
        }}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.v} value={o.v}>{o.l}</option>
        ))}
      </select>
      <svg width="9" height="9" viewBox="0 0 14 14" fill="none" style={{
        position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
        pointerEvents: 'none', color: 'var(--muted)',
      }}>
        <path d="M3 5 L7 9 L11 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
