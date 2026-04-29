import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { KairnMark } from '../sections-1.jsx';
import { useAuth } from './auth-context.jsx';
import { isSupabaseConfigured } from '../lib/supabase.js';

function useAdminMeta() {
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex,nofollow';
    document.head.appendChild(meta);
    const prev = document.title;
    document.title = 'Kairn Admin — Connexion';
    return () => { document.head.removeChild(meta); document.title = prev; };
  }, []);
}

export default function AdminLogin() {
  useAdminMeta();
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const from = location.state?.from || '/admin';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location.state]);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: err } = await signIn(email, password);
    setLoading(false);
    if (err) {
      setError(err.message || 'Identifiants invalides.');
    }
  };

  return (
    <div className="kairn" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <div className="k-hero-bg" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', position: 'relative', overflow: 'hidden' }}>
        <div className="k-hero-blob" style={{ width: 420, height: 420, background: '#C4B5FD', top: -120, left: '12%' }}></div>
        <div className="k-hero-blob" style={{ width: 480, height: 480, background: '#8B5CF6', top: -40, right: '10%', opacity: .24, animationDelay: '-6s' }}></div>

        <div style={{ width: '100%', maxWidth: 420, position: 'relative' }}>
          <Link to="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            textDecoration: 'none', color: 'var(--ink)', marginBottom: 28,
          }}>
            <KairnMark />
            <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 17, fontWeight: 600, letterSpacing: '-0.02em' }}>Kairn</span>
          </Link>

          <div style={{
            padding: 32, borderRadius: 18, background: '#fff',
            border: '1px solid var(--line-2)',
            boxShadow: '0 30px 80px -30px rgba(124,58,237,.30)',
          }}>
            <span className="mono" style={{ fontSize: 11, color: 'var(--violet-deep)', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 500 }}>
              Espace privé
            </span>
            <h1 style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.025em', lineHeight: 1.1, marginTop: 10 }}>
              Tableau de bord interne
            </h1>
            <p style={{ fontSize: 14, color: 'var(--muted)', marginTop: 8, lineHeight: 1.55 }}>
              Connectez-vous pour accéder au CRM des leads.
            </p>

            {!isSupabaseConfigured && (
              <div style={{
                marginTop: 20, padding: '12px 14px', borderRadius: 10,
                background: '#FFFBEB', color: '#92400E', fontSize: 13,
                border: '1px solid #FDE68A', lineHeight: 1.5,
              }}>
                Supabase n'est pas encore configuré. Renseignez <code style={{ fontFamily: 'Geist Mono, monospace', fontSize: 12 }}>VITE_SUPABASE_URL</code> et <code style={{ fontFamily: 'Geist Mono, monospace', fontSize: 12 }}>VITE_SUPABASE_ANON_KEY</code> dans votre <code style={{ fontFamily: 'Geist Mono, monospace', fontSize: 12 }}>.env</code>.
              </div>
            )}

            <form onSubmit={submit} style={{ marginTop: 22 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <Field label="Email" type="email" value={email} onChange={setEmail} required autoComplete="email" autoFocus />
                <Field label="Mot de passe" type="password" value={password} onChange={setPassword} required autoComplete="current-password" />
              </div>

              {error && (
                <div style={{
                  marginTop: 16, padding: '10px 12px',
                  borderRadius: 10, background: '#FEF2F2', color: '#991B1B',
                  fontSize: 13, border: '1px solid #FECACA',
                }}>
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading || !isSupabaseConfigured} style={{
                marginTop: 22, padding: '13px 20px', width: '100%',
                background: 'linear-gradient(180deg, #9B6FFB 0%, #7C3AED 100%)',
                color: '#fff', border: 'none', borderRadius: 999,
                fontFamily: 'Geist, sans-serif', fontSize: 15, fontWeight: 500,
                cursor: loading || !isSupabaseConfigured ? 'not-allowed' : 'pointer',
                opacity: loading || !isSupabaseConfigured ? 0.6 : 1,
                boxShadow: '0 14px 32px -10px rgba(124,58,237,.45)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'transform .15s, box-shadow .15s',
              }}>
                {loading ? 'Connexion…' : 'Se connecter'}
              </button>
            </form>
          </div>

          <div style={{ marginTop: 18, textAlign: 'center' }}>
            <Link to="/" style={{
              fontSize: 13, color: 'var(--muted)', textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
              <svg width="11" height="11" viewBox="0 0 14 14" fill="none"><path d="M11 7 L3 7 M7 3 L3 7 L7 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Retour au site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, type = 'text', value, onChange, required, autoComplete, autoFocus }) {
  const [focused, setFocused] = useState(false);
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontSize: 12.5, color: 'var(--muted)', letterSpacing: '0.02em', fontWeight: 500 }}>{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          padding: '12px 14px', fontSize: 15,
          fontFamily: 'Geist, sans-serif', color: 'var(--ink)',
          background: '#fff',
          border: '1px solid ' + (focused ? 'var(--violet)' : 'var(--line-2)'),
          borderRadius: 10, outline: 'none',
          transition: 'border-color .15s, box-shadow .15s',
          boxShadow: focused ? '0 0 0 3px rgba(139,92,246,.12)' : 'none',
        }}
      />
    </label>
  );
}
