import React, { createContext, useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const AuthContext = createContext({ authed: false, loading: true });

const SESSION_KEY = 'kairn_admin_session';
const EXPIRY_MS = 30 * 24 * 60 * 60 * 1000;

export function AuthProvider({ children }) {
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (s?.ok && typeof s.exp === 'number' && s.exp > Date.now()) {
          setAuthed(true);
        } else {
          localStorage.removeItem(SESSION_KEY);
        }
      }
    } catch (_) {
      try { localStorage.removeItem(SESSION_KEY); } catch (_) {}
    }
    setLoading(false);
  }, []);

  const signIn = (password) => {
    const expected = import.meta.env.VITE_ADMIN_PASSWORD;
    if (!expected) {
      return { ok: false, error: 'VITE_ADMIN_PASSWORD non configuré dans .env.local' };
    }
    if (password !== expected) {
      return { ok: false, error: 'Mot de passe invalide.' };
    }
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify({ ok: true, exp: Date.now() + EXPIRY_MS }));
    } catch (_) {}
    setAuthed(true);
    return { ok: true };
  };

  const signOut = () => {
    try { localStorage.removeItem(SESSION_KEY); } catch (_) {}
    setAuthed(false);
  };

  return (
    <AuthContext.Provider value={{ authed, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthGuard({ children }) {
  const { authed, loading } = useAuth();
  const location = useLocation();
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#FAFAFA', color: 'var(--muted)', fontFamily: 'Geist, sans-serif',
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          border: '2px solid var(--line-2)', borderTopColor: 'var(--violet)',
          animation: 'kspin 0.8s linear infinite',
        }} />
        <style>{`@keyframes kspin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }
  if (!authed) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }
  return children;
}
