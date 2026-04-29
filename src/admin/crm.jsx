import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  DndContext, DragOverlay, PointerSensor, useSensor, useSensors,
  closestCorners, useDroppable,
} from '@dnd-kit/core';
import { useDraggable } from '@dnd-kit/core';
import { KairnMark } from '../sections-1.jsx';
import { useAuth } from './auth-context.jsx';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { BOOKING_URL, CONTACT_EMAIL } from '../config.js';

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
const STAGE_LABEL = Object.fromEntries(STAGES.map(s => [s.v, s.l]));
const STAGE_ACCENT = Object.fromEntries(STAGES.map(s => [s.v, s.accent]));

const SECTOR_LABEL = {
  dental: 'Dental', immo: 'Immobilier', auto: 'Auto',
  resto: 'Resto / Hôtellerie', services: 'Services', autre: 'Autre',
};
const GOAL_LABEL = {
  leads: 'Plus de leads', refonte: 'Refonte site/funnel',
  ads: 'Lancer Meta Ads', automation: 'Automatiser ventes',
};
const BUDGET_LABEL = {
  none: "Pas d'ads", lt2k: '< 2k', '2-5k': '2–5k', '5-15k': '5–15k', '15kplus': '15k+',
};
const TIMING_LABEL = {
  now: 'Ce mois-ci', quarter: 'Ce trimestre', exploring: 'Explore',
};

// ═════════════════════════════════════════════════════════════
// META + AUTH UTILS
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

const SECTOR_EMOJI = {
  dental: '🦷', immo: '🏠', auto: '🚗', resto: '🍽️', services: '💼', autre: '✦',
};

// ═════════════════════════════════════════════════════════════
// LEAD CARD (draggable)
// ═════════════════════════════════════════════════════════════
function LeadCard({ lead, onClick, isOverlay = false }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: lead.id,
    data: { lead },
  });

  const isNew = lead.stage === 'new' && (Date.now() - new Date(lead.created_at).getTime()) < 24 * 3600 * 1000;

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={(e) => { if (!isDragging) onClick?.(lead); }}
      style={{
        padding: '12px 14px',
        background: '#fff',
        border: '1px solid var(--line-2)',
        borderRadius: 12,
        cursor: isOverlay ? 'grabbing' : 'grab',
        boxShadow: isOverlay
          ? '0 24px 60px -12px rgba(124,58,237,.45)'
          : isDragging ? 'none' : '0 1px 0 rgba(10,10,10,.02)',
        opacity: isDragging && !isOverlay ? 0.4 : 1,
        transition: isOverlay ? 'none' : 'transform .15s, box-shadow .15s, border-color .15s',
        position: 'relative',
        userSelect: 'none',
      }}
      onMouseEnter={(e) => {
        if (!isDragging && !isOverlay) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 14px 32px -16px rgba(124,58,237,.30)';
          e.currentTarget.style.borderColor = 'var(--lav)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isOverlay) {
          e.currentTarget.style.transform = '';
          e.currentTarget.style.boxShadow = '0 1px 0 rgba(10,10,10,.02)';
          e.currentTarget.style.borderColor = 'var(--line-2)';
        }
      }}
    >
      {isNew && (
        <span style={{
          position: 'absolute', top: 10, right: 10,
          width: 7, height: 7, borderRadius: '50%',
          background: 'var(--violet)',
          boxShadow: '0 0 0 3px rgba(139,92,246,.18)',
        }} />
      )}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, paddingRight: isNew ? 14 : 0 }}>
        <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.012em', color: 'var(--ink)' }}>
          {lead.first_name || '—'}
        </span>
        {lead.company && (
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>· {lead.company}</span>
        )}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
        {lead.sector && (
          <span style={{
            fontSize: 11, padding: '3px 8px', borderRadius: 999,
            background: 'rgba(139,92,246,.10)', color: 'var(--violet-deep)',
            fontWeight: 500, letterSpacing: '0.01em',
          }}>
            {SECTOR_EMOJI[lead.sector] || '✦'} {SECTOR_LABEL[lead.sector] || lead.sector}
          </span>
        )}
        {lead.budget && (
          <span style={{
            fontSize: 11, padding: '3px 8px', borderRadius: 999,
            background: 'var(--bg-alt)', color: 'var(--ink-soft)',
            fontWeight: 500,
          }}>
            {BUDGET_LABEL[lead.budget] || lead.budget}
          </span>
        )}
      </div>
      {lead.goal && (
        <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 8, fontStyle: 'italic', lineHeight: 1.4 }}>
          "{GOAL_LABEL[lead.goal] || lead.goal}"
        </div>
      )}
      <div className="mono" style={{
        fontSize: 10.5, color: 'var(--muted)',
        letterSpacing: '0.06em', marginTop: 10,
        display: 'flex', gap: 8, flexWrap: 'wrap',
      }}>
        <span>{timeAgo(lead.created_at)}</span>
        {lead.utm_source && <span>· {lead.utm_source}</span>}
        {lead.utm_campaign && <span>· {lead.utm_campaign}</span>}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// COLUMN (droppable)
// ═════════════════════════════════════════════════════════════
function Column({ stage, leads, onCardClick }) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.v });
  return (
    <div style={{
      flex: '0 0 280px', display: 'flex', flexDirection: 'column',
      maxHeight: '100%',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 14px',
        background: '#fff',
        border: '1px solid var(--line-2)',
        borderRadius: 12,
        marginBottom: 12,
      }}>
        <span style={{
          width: 8, height: 8, borderRadius: '50%',
          background: stage.accent, flexShrink: 0,
        }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: '-0.01em' }}>{stage.l}</div>
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
          padding: 10, borderRadius: 12,
          background: isOver ? 'rgba(139,92,246,.08)' : 'rgba(245,243,255,.55)',
          border: '1px dashed ' + (isOver ? 'var(--violet)' : 'transparent'),
          transition: 'background .15s, border-color .15s',
          display: 'flex', flexDirection: 'column', gap: 10,
          overflowY: 'auto',
        }}
      >
        {leads.length === 0 && !isOver && (
          <div style={{
            padding: '28px 10px', textAlign: 'center',
            fontSize: 12, color: 'var(--muted)',
          }}>
            Aucun lead
          </div>
        )}
        {leads.map((l) => (
          <LeadCard key={l.id} lead={l} onClick={onCardClick} />
        ))}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// LEAD DETAIL DRAWER
// ═════════════════════════════════════════════════════════════
function LeadDrawer({ lead, onClose, onUpdate, onDelete }) {
  const [notes, setNotes] = useState(lead?.notes || '');
  const [stage, setStage] = useState(lead?.stage || 'new');
  const [savingNotes, setSavingNotes] = useState(false);

  useEffect(() => {
    setNotes(lead?.notes || '');
    setStage(lead?.stage || 'new');
  }, [lead]);

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
    if (notes === lead.notes) return;
    setSavingNotes(true);
    await onUpdate(lead.id, { notes });
    setSavingNotes(false);
  };

  const changeStage = async (newStage) => {
    setStage(newStage);
    await onUpdate(lead.id, { stage: newStage });
  };

  const remove = async () => {
    if (!window.confirm(`Supprimer définitivement le lead de ${lead.first_name || lead.email} ?`)) return;
    await onDelete(lead.id);
  };

  const copy = (text) => {
    navigator.clipboard?.writeText(text);
  };

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0,
        background: 'rgba(10,10,10,.32)',
        zIndex: 90, backdropFilter: 'blur(2px)',
        animation: 'kfade .18s ease-out',
      }} />
      <style>{`
        @keyframes kfade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes kslide { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>

      {/* Drawer */}
      <aside style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 'min(480px, 100vw)',
        background: '#fff',
        boxShadow: '-30px 0 80px -20px rgba(10,10,10,.25)',
        zIndex: 100,
        overflowY: 'auto',
        animation: 'kslide .26s cubic-bezier(.2,.7,.3,1)',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid var(--line-2)',
          display: 'flex', alignItems: 'flex-start', gap: 12,
          position: 'sticky', top: 0, background: '#fff', zIndex: 2,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{
                fontSize: 11, padding: '3px 9px', borderRadius: 999,
                background: STAGE_ACCENT[stage] + '20', color: STAGE_ACCENT[stage],
                letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600,
              }}>
                {STAGE_LABEL[stage]}
              </span>
              <span className="mono" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.04em' }}>
                {timeAgo(lead.created_at)}
              </span>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.025em', marginTop: 8 }}>
              {lead.first_name || '—'}{lead.company ? ` · ${lead.company}` : ''}
            </h2>
          </div>
          <button onClick={onClose} aria-label="Fermer" style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            padding: 6, color: 'var(--muted)', borderRadius: 8,
          }}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M5 5 L15 15 M15 5 L5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px', flex: 1 }}>
          {/* Stage selector */}
          <Section title="Étape">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {STAGES.map((s) => (
                <button key={s.v} onClick={() => changeStage(s.v)} style={{
                  padding: '7px 12px', borderRadius: 999,
                  background: stage === s.v ? s.accent : '#fff',
                  color: stage === s.v ? '#fff' : 'var(--ink-soft)',
                  border: '1px solid ' + (stage === s.v ? s.accent : 'var(--line-2)'),
                  fontSize: 12.5, fontWeight: 500, cursor: 'pointer',
                  fontFamily: 'Geist, sans-serif',
                  transition: 'all .15s',
                }}>
                  {s.l}
                </button>
              ))}
            </div>
          </Section>

          {/* Contact */}
          <Section title="Contact">
            <Row label="Email">
              <button onClick={() => copy(lead.email)} title="Copier" style={inlineLinkStyle}>
                {lead.email}
              </button>
            </Row>
            {lead.phone && (
              <Row label="Téléphone">
                <a href={`tel:${lead.phone}`} style={inlineLinkStyle}>{lead.phone}</a>
              </Row>
            )}
          </Section>

          {/* Form answers */}
          <Section title="Réponses">
            {lead.sector && <Row label="Secteur">{SECTOR_EMOJI[lead.sector] || ''} {SECTOR_LABEL[lead.sector] || lead.sector}</Row>}
            {lead.goal && <Row label="Objectif">{GOAL_LABEL[lead.goal] || lead.goal}</Row>}
            {lead.budget && <Row label="Budget">{BUDGET_LABEL[lead.budget] || lead.budget}</Row>}
            {lead.timing && <Row label="Timing">{TIMING_LABEL[lead.timing] || lead.timing}</Row>}
          </Section>

          {/* Source */}
          {(lead.utm_source || lead.utm_campaign || lead.utm_content) && (
            <Section title="Source">
              {lead.utm_source && <Row label="Source">{lead.utm_source}</Row>}
              {lead.utm_campaign && <Row label="Campagne">{lead.utm_campaign}</Row>}
              {lead.utm_content && <Row label="Contenu">{lead.utm_content}</Row>}
            </Section>
          )}

          {/* Notes */}
          <Section title="Notes">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={saveNotes}
              placeholder="Vos notes sur ce lead — sauvegardé automatiquement"
              style={{
                width: '100%', minHeight: 110, resize: 'vertical',
                padding: '12px 14px', borderRadius: 10,
                border: '1px solid var(--line-2)', background: '#fff',
                fontSize: 14, fontFamily: 'Geist, sans-serif', color: 'var(--ink)',
                outline: 'none', lineHeight: 1.55,
                transition: 'border-color .15s, box-shadow .15s',
              }}
              onFocus={(e) => { e.target.style.borderColor = 'var(--violet)'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,.10)'; }}
              onMouseLeave={(e) => { /* keep focus state */ }}
            />
            {savingNotes && <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>Sauvegarde…</div>}
          </Section>

          {/* Audit */}
          <Section title="Historique">
            <Row label="Créé">{new Date(lead.created_at).toLocaleString('fr-CH', { dateStyle: 'medium', timeStyle: 'short' })}</Row>
            {lead.updated_at && <Row label="Mis à jour">{new Date(lead.updated_at).toLocaleString('fr-CH', { dateStyle: 'medium', timeStyle: 'short' })}</Row>}
          </Section>
        </div>

        {/* Footer actions */}
        <div style={{
          padding: '14px 24px', borderTop: '1px solid var(--line-2)',
          display: 'flex', gap: 10, position: 'sticky', bottom: 0, background: '#fff',
        }}>
          <a href={`mailto:${lead.email}?subject=${encodeURIComponent('Suite à votre demande Kairn')}`} style={{
            flex: 1, padding: '10px 14px', borderRadius: 10,
            background: '#0A0A0A', color: '#fff',
            fontSize: 13.5, fontWeight: 500, textAlign: 'center',
            textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            Email
          </a>
          <a href={calendlyForLead} target="_blank" rel="noopener noreferrer" style={{
            flex: 1, padding: '10px 14px', borderRadius: 10,
            background: 'linear-gradient(180deg, #9B6FFB, #7C3AED)', color: '#fff',
            fontSize: 13.5, fontWeight: 500, textAlign: 'center',
            textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            Calendly
          </a>
          <button onClick={remove} title="Supprimer" style={{
            padding: '10px 12px', borderRadius: 10,
            background: 'transparent', border: '1px solid var(--line-2)',
            color: '#991B1B', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M4 6 L16 6 M8 6 V4 H12 V6 M6 6 L7 16 H13 L14 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      </aside>
    </>
  );
}

const inlineLinkStyle = {
  background: 'transparent', border: 'none', padding: 0,
  color: 'var(--violet-deep)', fontFamily: 'Geist, sans-serif',
  fontSize: 14, cursor: 'pointer', textAlign: 'left',
  textDecoration: 'underline', textDecorationColor: 'rgba(124,58,237,.3)',
};

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div className="mono" style={{
        fontSize: 11, color: 'var(--muted)',
        letterSpacing: '0.16em', textTransform: 'uppercase',
        fontWeight: 500, marginBottom: 10,
      }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {children}
      </div>
    </div>
  );
}

function Row({ label, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, fontSize: 14 }}>
      <span style={{ width: 90, color: 'var(--muted)', fontSize: 13, flexShrink: 0 }}>{label}</span>
      <span style={{ color: 'var(--ink-soft)', flex: 1, wordBreak: 'break-word' }}>{children}</span>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// CRM ROOT
// ═════════════════════════════════════════════════════════════
export default function AdminCRM() {
  useAdminMeta();
  const { user, signOut } = useAuth();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [search, setSearch] = useState('');
  const [filterSector, setFilterSector] = useState('');
  const [filterBudget, setFilterBudget] = useState('');
  const [activeLeadId, setActiveLeadId] = useState(null);
  const [draggingLead, setDraggingLead] = useState(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

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

  // Initial load
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
    setLeads((prev) => prev.map(l => l.id === id ? { ...l, ...patch } : l));
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

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      if (filterSector && l.sector !== filterSector) return false;
      if (filterBudget && l.budget !== filterBudget) return false;
      if (search) {
        const q = search.toLowerCase();
        const hay = `${l.first_name || ''} ${l.company || ''} ${l.email || ''} ${l.phone || ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [leads, search, filterSector, filterBudget]);

  const byStage = useMemo(() => {
    const buckets = Object.fromEntries(STAGES.map(s => [s.v, []]));
    for (const l of filtered) {
      const s = buckets[l.stage] ? l.stage : 'new';
      buckets[s].push(l);
    }
    return buckets;
  }, [filtered]);

  const stats = useMemo(() => {
    const counts = Object.fromEntries(STAGES.map(s => [s.v, 0]));
    for (const l of leads) counts[l.stage] = (counts[l.stage] || 0) + 1;
    const won = counts.won || 0;
    const lost = counts.lost || 0;
    const rate = (won + lost) > 0 ? Math.round((won / (won + lost)) * 100) : null;
    const oneWeekAgo = Date.now() - 7 * 86400 * 1000;
    const newWeek = leads.filter(l => new Date(l.created_at).getTime() > oneWeekAgo).length;
    return { counts, rate, newWeek };
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
  };

  const activeLead = leads.find(l => l.id === activeLeadId);

  return (
    <div className="kairn" style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      {/* Top nav */}
      <header style={{
        padding: '14px 24px',
        background: 'rgba(255,255,255,.85)',
        backdropFilter: 'saturate(140%) blur(14px)',
        WebkitBackdropFilter: 'saturate(140%) blur(14px)',
        borderBottom: '1px solid var(--line-2)',
        position: 'sticky', top: 0, zIndex: 40,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'space-between', maxWidth: 1600, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'var(--ink)' }}>
              <KairnMark />
              <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 16, fontWeight: 600, letterSpacing: '-0.02em' }}>Kairn</span>
            </Link>
            <span style={{ height: 18, width: 1, background: 'var(--line-2)' }} />
            <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink-soft)' }}>CRM</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {user?.email && (
              <span className="mono" style={{ fontSize: 11.5, color: 'var(--muted)', letterSpacing: '0.04em' }}>
                {user.email}
              </span>
            )}
            <button onClick={signOut} style={{
              padding: '7px 13px', borderRadius: 999,
              background: '#fff', border: '1px solid var(--line-2)',
              fontFamily: 'Geist, sans-serif', fontSize: 13, fontWeight: 500,
              color: 'var(--ink-soft)', cursor: 'pointer',
            }}>
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Stats + filters */}
      <div style={{ padding: '20px 24px 12px', maxWidth: 1600, width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
        {/* Stats line */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 18,
          padding: '14px 18px',
          background: '#fff', border: '1px solid var(--line-2)', borderRadius: 14,
          alignItems: 'center',
        }}>
          {STAGES.map((s) => (
            <div key={s.v} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: s.accent }} />
              <span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{s.l}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{stats.counts[s.v] || 0}</span>
            </div>
          ))}
          <div style={{ height: 18, width: 1, background: 'var(--line-2)' }} />
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span className="mono" style={{ fontSize: 11.5, color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Conv</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--violet-deep)' }}>{stats.rate !== null ? `${stats.rate}%` : '—'}</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span className="mono" style={{ fontSize: 11.5, color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>7j</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>+{stats.newWeek}</span>
          </div>
        </div>

        {/* Filters */}
        <div style={{
          display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap', alignItems: 'center',
        }}>
          <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: 360 }}>
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }}><circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" /><path d="M14 14 L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher nom, entreprise, email…"
              style={{
                width: '100%', padding: '9px 12px 9px 34px',
                borderRadius: 10, border: '1px solid var(--line-2)',
                background: '#fff', fontSize: 13.5, fontFamily: 'Geist, sans-serif',
                color: 'var(--ink)', outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>
          <SelectFilter value={filterSector} onChange={setFilterSector} placeholder="Tous secteurs" options={Object.entries(SECTOR_LABEL).map(([v, l]) => ({ v, l }))} />
          <SelectFilter value={filterBudget} onChange={setFilterBudget} placeholder="Tous budgets" options={Object.entries(BUDGET_LABEL).map(([v, l]) => ({ v, l }))} />
          {(search || filterSector || filterBudget) && (
            <button onClick={() => { setSearch(''); setFilterSector(''); setFilterBudget(''); }} style={{
              padding: '8px 12px', borderRadius: 999,
              background: 'transparent', border: '1px solid var(--line-2)',
              fontFamily: 'Geist, sans-serif', fontSize: 12.5, color: 'var(--muted)',
              cursor: 'pointer',
            }}>
              Effacer
            </button>
          )}
        </div>
      </div>

      {/* Errors / States */}
      {!isSupabaseConfigured && (
        <div style={{ margin: '12px 24px', padding: '14px 16px', borderRadius: 12, background: '#FFFBEB', border: '1px solid #FDE68A', color: '#92400E', fontSize: 13.5, lineHeight: 1.5 }}>
          Supabase n'est pas configuré. Renseignez <code>VITE_SUPABASE_URL</code> et <code>VITE_SUPABASE_ANON_KEY</code> dans <code>.env</code>, puis exécutez le SQL fourni dans le plan pour créer la table <code>leads</code>.
        </div>
      )}
      {loadError && (
        <div style={{ margin: '12px 24px', padding: '14px 16px', borderRadius: 12, background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', fontSize: 13.5 }}>
          Erreur : {loadError}
        </div>
      )}

      {/* Kanban */}
      <div style={{
        flex: 1, padding: '12px 24px 24px', overflowX: 'auto', overflowY: 'hidden',
        maxWidth: 1600, width: '100%', margin: '0 auto', boxSizing: 'border-box',
      }}>
        {loading ? (
          <div style={{ padding: 60, textAlign: 'center', color: 'var(--muted)', fontSize: 14 }}>
            Chargement des leads…
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={onDragStart} onDragEnd={onDragEnd}>
            <div style={{
              display: 'flex', gap: 16,
              minHeight: 'calc(100vh - 240px)',
              paddingBottom: 16,
            }}>
              {STAGES.map((stage) => (
                <Column
                  key={stage.v}
                  stage={stage}
                  leads={byStage[stage.v] || []}
                  onCardClick={(l) => setActiveLeadId(l.id)}
                />
              ))}
            </div>
            <DragOverlay>
              {draggingLead ? <LeadCard lead={draggingLead} isOverlay /> : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>

      {activeLead && (
        <LeadDrawer
          lead={activeLead}
          onClose={() => setActiveLeadId(null)}
          onUpdate={updateLead}
          onDelete={deleteLead}
        />
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
          padding: '9px 32px 9px 12px',
          borderRadius: 10, border: '1px solid var(--line-2)',
          background: '#fff', fontSize: 13.5, fontFamily: 'Geist, sans-serif',
          color: value ? 'var(--ink)' : 'var(--muted)',
          outline: 'none', cursor: 'pointer',
        }}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.v} value={o.v}>{o.l}</option>
        ))}
      </select>
      <svg width="10" height="10" viewBox="0 0 14 14" fill="none" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--muted)' }}><path d="M3 5 L7 9 L11 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </div>
  );
}
