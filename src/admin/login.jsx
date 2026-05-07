import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { KairnMark } from '../sections-1.jsx';
import { useAuth } from './auth-context.jsx';

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
  const { authed, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (authed) {
      const from = location.state?.from || '/admin';
      navigate(from, { replace: true });
    }
  }, [authed, navigate, location.state]);

  const submit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = signIn(password);
    setLoading(false);
    if (!result.ok) {
      setError(result.error || 'Mot de passe invalide.');
      setShake(true);
      setTimeout(() => setShake(false), 350);
      setPassword('');
      inputRef.current?.focus();
    }
  };

  return (
    <div className="kairn" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <style>{`
        @keyframes k-shake { 0%, 100% { transform: translateX(0); } 20%, 60% { transform: translateX(-6px); } 40%, 80% { transform: translateX(6px); } }
        @keyframes k-login-pulse { 0%, 100% { box-shadow: 0 14px 36px -10px rgba(124,58,237,.45); } 50% { box-shadow: 0 18px 44px -8px rgba(124,58,237,.6); } }
        .k-login-cta { position: relative; overflow: hidden; transition: transform .2s; animation: k-login-pulse 3.4s ease-in-out infinite; }
        .k-login-cta:hover { transform: translateY(-1px); }
        .k-login-cta:active { transform: translateY(0); }
        .k-login-shake { animation: k-shake .35s cubic-bezier(.36,.07,.19,.97); }
      `}</style>

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

          <div className={shake ? 'k-login-shake' : ''} style={{
            padding: 32, borderRadius: 18, background: '#fff',
            border: '1px solid var(--line-2)',
            boxShadow: '0 30px 80px -30px rgba(124,58,237,.30)',
          }}>
            <span className="mono" style={{ fontSize: 11, color: 'var(--violet-deep)', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600 }}>
              Espace privé · Kairn
            </span>
            <h1 style={{ fontSize: 32, fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.05, marginTop: 12 }}>
              <span style={{
                fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 400,
                background: 'linear-gradient(120deg, #8B5CF6, #6D28D9)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>Bienvenue.</span>
            </h1>
            <p style={{ fontSize: 14, color: 'var(--muted)', marginTop: 10, lineHeight: 1.55 }}>
              Tableau de bord interne. Mot de passe requis.
            </p>

            <form onSubmit={submit} style={{ marginTop: 24 }}>
              <PasswordField
                value={password}
                onChange={setPassword}
                inputRef={inputRef}
                hasError={!!error}
              />

              {error && (
                <div style={{
                  marginTop: 12, padding: '10px 12px',
                  borderRadius: 10, background: '#FEF2F2', color: '#991B1B',
                  fontSize: 13, border: '1px solid #FECACA',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <svg width="14" height="14" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
                    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.6" />
                    <path d="M10 6 V11 M10 14 V14.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading} className="k-login-cta" style={{
                marginTop: 22, padding: '14px 22px', width: '100%',
                background: 'linear-gradient(180deg, #9B6FFB 0%, #7C3AED 100%)',
                color: '#fff', border: 'none', borderRadius: 999,
                fontFamily: 'Geist, sans-serif', fontSize: 15, fontWeight: 600,
                letterSpacing: '-0.005em',
                cursor: loading ? 'wait' : 'pointer',
                opacity: loading ? 0.7 : 1,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>
                {loading ? 'Connexion…' : (
                  <>
                    Accéder au CRM
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7 L11 7 M7 3 L11 7 L7 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </>
                )}
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

function PasswordField({ value, onChange, inputRef, hasError }) {
  const [focused, setFocused] = useState(false);
  const [reveal, setReveal] = useState(false);
  return (
    <label style={{ display: 'block', position: 'relative' }}>
      <span style={{ display: 'block', fontSize: 12.5, color: 'var(--muted)', letterSpacing: '0.02em', fontWeight: 500, marginBottom: 8 }}>
        Mot de passe
      </span>
      <div style={{ position: 'relative' }}>
        <svg width="14" height="14" viewBox="0 0 20 20" fill="none" style={{
          position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
          color: focused ? 'var(--violet-deep)' : 'var(--muted)',
          pointerEvents: 'none', transition: 'color .15s',
        }}>
          <rect x="4" y="9" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M7 9 V6 a3 3 0 0 1 6 0 V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <input
          ref={inputRef}
          type={reveal ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          autoComplete="current-password"
          autoFocus
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%', padding: '14px 44px 14px 38px', fontSize: 15,
            fontFamily: 'Geist, sans-serif', color: 'var(--ink)',
            background: '#fff',
            border: '1px solid ' + (hasError ? '#FECACA' : focused ? 'var(--violet)' : 'var(--line-2)'),
            borderRadius: 12, outline: 'none', boxSizing: 'border-box',
            transition: 'border-color .15s, box-shadow .15s',
            boxShadow: focused ? '0 0 0 4px rgba(139,92,246,.14)' : 'none',
            letterSpacing: reveal ? '0' : '0.06em',
          }}
        />
        <button
          type="button"
          onClick={() => setReveal((r) => !r)}
          aria-label={reveal ? 'Masquer' : 'Afficher'}
          style={{
            position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
            background: 'transparent', border: 'none', cursor: 'pointer',
            padding: 8, color: 'var(--muted)', borderRadius: 8,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          {reveal ? (
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path d="M2 10 C2 10 5 5 10 5 C15 5 18 10 18 10 C18 10 15 15 10 15 C5 15 2 10 2 10 Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M3 3 L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path d="M2 10 C2 10 5 5 10 5 C15 5 18 10 18 10 C18 10 15 15 10 15 C5 15 2 10 2 10 Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          )}
        </button>
      </div>
    </label>
  );
}
