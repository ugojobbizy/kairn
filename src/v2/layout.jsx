import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CONTACT_EMAIL, WHATSAPP_NUMBER, whatsappUrl } from '../config.js';

// Éléments communs aux pages de la V2 : logo, navigation, pied de page, bouton de réservation.

// Logo « cairn au trait » : trois pierres en contour dégradé cyan → indigo, sans tuile.
let logoSeq = 0;
export function KairnLogo({ size = 34 }) {
  const [id] = useState(() => `kl-${++logoSeq}`);
  return (
    <svg className="kairn-logo" width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#67E8F9" />
          <stop offset="1" stopColor="#818CF8" />
        </linearGradient>
      </defs>
      <rect x="7" y="32" width="34" height="9" rx="4.5" fill="none" stroke={`url(#${id})`} strokeWidth="3" />
      <rect x="11.5" y="20.5" width="25" height="8.5" rx="4.25" fill="none" stroke={`url(#${id})`} strokeWidth="3" />
      <rect x="16.5" y="9.5" width="15" height="8" rx="4" fill={`url(#${id})`} />
    </svg>
  );
}

// Icône d'onglet propre à la V2 (le site V1 garde la sienne).
export function useV2Favicon() {
  useEffect(() => {
    const link = document.querySelector('link[rel="icon"]');
    if (!link) return undefined;
    const prev = link.getAttribute('href');
    link.setAttribute('href', '/favicon.svg?v=2');
    return () => link.setAttribute('href', prev);
  }, []);
}

export function ArrowUpRight({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

// Renvoie vers le module de réservation présent en bas de chaque page (#reserver).
export function BookCta({ children, className = 'btn btn-dark' }) {
  return (
    <a className={className} href="#reserver">
      {children}
      <span className="btn-ico"><ArrowUpRight /></span>
    </a>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <header className={`nav${scrolled ? ' is-scrolled' : ''}`}>
      <div className="wrap">
        <div className="nav-bar">
          <Link to="/" className="brand" aria-label="Kairn, accueil"><KairnLogo />Kairn</Link>
          <nav className="nav-links" aria-label="Navigation principale">
            <Link to="/#systeme">Le système</Link>
            <Link to="/#methode">Méthode</Link>
            <Link to="/realisations">Réalisations</Link>
            <Link to="/#faq">Questions</Link>
            {WHATSAPP_NUMBER && (
              <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="nav-wa" aria-label="Contact sur WhatsApp (nouvel onglet)">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3 2.4 1 2.9.8 3.4.7.5-.1 1.7-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z" /></svg>
                Contact
              </a>
            )}
          </nav>
          <BookCta><span className="long">Réserver un appel</span><span className="short">Réserver</span></BookCta>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <Link to="/" className="brand"><KairnLogo />Kairn</Link>
            <p style={{ marginTop: 12, maxWidth: '34ch', fontSize: 15, color: 'var(--muted)' }}>
              Agence de génération de leads. Campagnes, landing pages et CRM sur mesure, par une seule équipe.
            </p>
          </div>
          <div>
            <h3>Agence</h3>
            <ul>
              <li><Link to="/#systeme">Le système</Link></li>
              <li><Link to="/#methode">Méthode</Link></li>
              <li><Link to="/realisations">Réalisations</Link></li>
            </ul>
          </div>
          <div>
            <h3>Contact</h3>
            <ul>
              {WHATSAPP_NUMBER && (
                <li><a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
              )}
              <li><a href="#reserver">Réserver un appel</a></li>
            </ul>
          </div>
          <div>
            <h3>Légal</h3>
            <ul>
              <li><Link to="/mentions-legales">Mentions légales</Link></li>
              <li><Link to="/confidentialite">Confidentialité</Link></li>
              <li><Link to="/cgv">CGV</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-base">
          <span>© {new Date().getFullYear()} Kairn</span>
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </div>
      </div>
    </footer>
  );
}
