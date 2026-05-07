import React, { useState } from 'react';

const SECTORS = [
  { v: 'medical', l: 'Médical / paramédical' },
  { v: 'b2c', l: 'Services B2C' },
  { v: 'b2b', l: 'Services B2B' },
  { v: 'commerce', l: 'Commerce / e-commerce' },
  { v: 'autre', l: 'Autre' },
];

const BUDGETS = [
  { v: 'none', l: 'Pas encore lancé' },
  { v: 'lt2k', l: '< 2 000 CHF' },
  { v: '2-5k', l: '2 000 — 5 000 CHF' },
  { v: '5-15k', l: '5 000 — 15 000 CHF' },
  { v: '15kplus', l: '15 000+ CHF' },
];

const GOALS = [
  { v: 'more-rdv', l: '+ de RDV qualifiés' },
  { v: 'cheaper', l: 'Acquisition − chère' },
  { v: 'predictable', l: 'Acquisition + prévisible' },
  { v: 'launch', l: 'Lancer un nouveau produit' },
];

const STAGES = [
  { v: 'new', l: 'Nouveau' },
  { v: 'contacted', l: 'Contacté' },
  { v: 'booked', l: 'RDV pris' },
  { v: 'qualified', l: 'Qualifié' },
  { v: 'won', l: 'Gagné' },
  { v: 'lost', l: 'Perdu' },
];

const inputBase = {
  width: '100%', padding: '11px 13px', fontSize: 14,
  fontFamily: 'Geist, sans-serif', color: 'var(--ink)',
  background: '#fff',
  border: '1px solid var(--line-2)', borderRadius: 10, outline: 'none',
  boxSizing: 'border-box', transition: 'border-color .15s, box-shadow .15s',
};

const labelStyle = {
  fontSize: 12.5, color: 'var(--muted)', fontWeight: 500,
  marginBottom: 6, display: 'block',
};

export default function LeadForm({ onSubmit, onCancel, submitting }) {
  const [data, setData] = useState({
    first_name: '', company: '', email: '', phone: '',
    stage: 'new', sector: '', budget: '', goal: '', notes: '',
  });
  const [error, setError] = useState('');

  const set = (k, v) => setData((d) => ({ ...d, [k]: v }));

  const submit = (e) => {
    e.preventDefault();
    setError('');
    const fn = data.first_name.trim();
    const em = data.email.trim();
    if (!fn) return setError('Le prénom est requis.');
    if (!em || !/^\S+@\S+\.\S+$/.test(em)) return setError('Email invalide.');

    const payload = {
      first_name: fn,
      company: data.company.trim() || null,
      email: em,
      phone: data.phone.trim() || null,
      stage: data.stage || 'new',
      sector: data.sector || null,
      budget: data.budget || null,
      goal: data.goal || null,
      notes: data.notes.trim() || null,
      utm_source: 'manual',
      utm_campaign: null,
      utm_content: null,
    };
    onSubmit?.(payload);
  };

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="Prénom *" required>
          <input
            value={data.first_name}
            onChange={(e) => set('first_name', e.target.value)}
            placeholder="Marie"
            autoFocus
            style={inputBase}
            onFocus={(e) => { e.target.style.borderColor = 'var(--violet)'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,.12)'; }}
            onBlur={(e) => { e.target.style.borderColor = 'var(--line-2)'; e.target.style.boxShadow = 'none'; }}
          />
        </Field>
        <Field label="Entreprise">
          <input
            value={data.company}
            onChange={(e) => set('company', e.target.value)}
            placeholder="Cabinet Véran"
            style={inputBase}
            onFocus={(e) => { e.target.style.borderColor = 'var(--violet)'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,.12)'; }}
            onBlur={(e) => { e.target.style.borderColor = 'var(--line-2)'; e.target.style.boxShadow = 'none'; }}
          />
        </Field>
        <Field label="Email *" required>
          <input
            type="email"
            value={data.email}
            onChange={(e) => set('email', e.target.value)}
            placeholder="marie@example.com"
            style={inputBase}
            onFocus={(e) => { e.target.style.borderColor = 'var(--violet)'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,.12)'; }}
            onBlur={(e) => { e.target.style.borderColor = 'var(--line-2)'; e.target.style.boxShadow = 'none'; }}
          />
        </Field>
        <Field label="Téléphone">
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => set('phone', e.target.value)}
            placeholder="+41 ..."
            style={inputBase}
            onFocus={(e) => { e.target.style.borderColor = 'var(--violet)'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,.12)'; }}
            onBlur={(e) => { e.target.style.borderColor = 'var(--line-2)'; e.target.style.boxShadow = 'none'; }}
          />
        </Field>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="Stage">
          <Select value={data.stage} onChange={(v) => set('stage', v)} options={STAGES} />
        </Field>
        <Field label="Secteur">
          <Select value={data.sector} onChange={(v) => set('sector', v)} options={SECTORS} placeholder="—" />
        </Field>
        <Field label="Budget Meta Ads">
          <Select value={data.budget} onChange={(v) => set('budget', v)} options={BUDGETS} placeholder="—" />
        </Field>
        <Field label="Objectif">
          <Select value={data.goal} onChange={(v) => set('goal', v)} options={GOALS} placeholder="—" />
        </Field>
      </div>

      <Field label="Notes">
        <textarea
          value={data.notes}
          onChange={(e) => set('notes', e.target.value)}
          placeholder="Source, contexte, première conversation…"
          rows={3}
          style={{ ...inputBase, resize: 'vertical', lineHeight: 1.5, minHeight: 80 }}
          onFocus={(e) => { e.target.style.borderColor = 'var(--violet)'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,.12)'; }}
          onBlur={(e) => { e.target.style.borderColor = 'var(--line-2)'; e.target.style.boxShadow = 'none'; }}
        />
      </Field>

      {error && (
        <div style={{
          padding: '10px 12px', borderRadius: 10,
          background: '#FEF2F2', color: '#991B1B', fontSize: 13,
          border: '1px solid #FECACA',
        }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
        <button type="button" onClick={onCancel} style={{
          padding: '11px 18px', borderRadius: 999,
          background: 'transparent', border: '1px solid var(--line-2)',
          fontFamily: 'Geist, sans-serif', fontSize: 13.5, fontWeight: 500,
          color: 'var(--ink-soft)', cursor: 'pointer',
        }}>
          Annuler
        </button>
        <button type="submit" disabled={submitting} style={{
          padding: '11px 22px', borderRadius: 999,
          background: 'linear-gradient(180deg, #9B6FFB 0%, #7C3AED 100%)',
          color: '#fff', border: 'none',
          fontFamily: 'Geist, sans-serif', fontSize: 13.5, fontWeight: 600,
          cursor: submitting ? 'wait' : 'pointer',
          opacity: submitting ? 0.7 : 1,
          boxShadow: '0 10px 24px -8px rgba(124,58,237,.5)',
          display: 'inline-flex', alignItems: 'center', gap: 8,
        }}>
          {submitting ? 'Création…' : 'Créer le lead'}
          {!submitting && <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M3 7 L11 7 M7 3 L11 7 L7 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>}
        </button>
      </div>
    </form>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display: 'block' }}>
      <span style={labelStyle}>{label}</span>
      {children}
    </label>
  );
}

function Select({ value, onChange, options, placeholder }) {
  return (
    <div style={{ position: 'relative' }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          ...inputBase,
          appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none',
          paddingRight: 34, cursor: 'pointer',
          color: value ? 'var(--ink)' : 'var(--muted)',
        }}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.v} value={o.v}>{o.l}</option>
        ))}
      </select>
      <svg width="10" height="10" viewBox="0 0 14 14" fill="none" style={{
        position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
        pointerEvents: 'none', color: 'var(--muted)',
      }}>
        <path d="M3 5 L7 9 L11 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
