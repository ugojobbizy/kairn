import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './styles.js';
import KairnHomeV3 from './v3/home.jsx';
import SeoManager from './seo-manager.jsx';

// Une page chargée à la demande dont le fichier a disparu (onglet ouvert avant une mise en ligne : les noms de fichiers
// changent à chaque version) recharge le site une fois, au lieu de rester blanche (Ugo, 30/10/2026 : « parfois je clique
// sur des pages et c'est super long à charger »). Le drapeau évite une boucle si le fichier manque vraiment.
const RELOAD_KEY = 'kairn-page-reload';
function lazyPage(load) {
  return lazy(() => load().catch((err) => {
    let deja = false;
    try { deja = sessionStorage.getItem(RELOAD_KEY) === '1'; sessionStorage.setItem(RELOAD_KEY, '1'); } catch { /* stockage bloqué */ }
    if (!deja) { window.location.reload(); return new Promise(() => {}); }
    throw err;
  }));
}

// Préchargement : le code d'une page part dès que la souris passe sur son lien (ou que le doigt le touche),
// pour qu'elle s'affiche sans attente au clic. Mêmes fichiers que les lazyPage ci-dessous (Vite ne les charge qu'une fois).
const PRECHARGE = [
  ['/commander', () => import('./v3/order.jsx')],
  ['/espace', () => import('./espace/espace.jsx')],
  ['/gestion', () => import('./gestion/gestion.jsx')],
  ['/plateforme', () => import('./v3/plateforme.jsx')],
  ['/realisations', () => import('./v2/realisations-v2.jsx')],
  ['/generation-de-leads', () => import('./v2/lead-gen.jsx')],
  ['/creation-site-internet', () => import('./v2/web-creation.jsx')],
  ['/creation-landing-page', () => import('./v2/landing-creation.jsx')],
  ['/crm-sur-mesure', () => import('./v2/crm-page.jsx')],
  ['/agence-bordeaux', () => import('./v2/bordeaux-page.jsx')],
  ['/blog', () => import('./v2/blog-index.jsx')],
];
function usePrechargement() {
  useEffect(() => {
    const fait = new Set();
    const viser = (e) => {
      const a = e.target.closest && e.target.closest('a[href^="/"]');
      if (!a) return;
      const path = a.getAttribute('href').split(/[?#]/)[0];
      const p = PRECHARGE.find(([k]) => path === k || path.startsWith(`${k}/`));
      if (p && !fait.has(p[0])) { fait.add(p[0]); p[1]().catch(() => fait.delete(p[0])); }
    };
    document.addEventListener('pointerover', viser, { passive: true });
    document.addEventListener('touchstart', viser, { passive: true });
    document.addEventListener('focusin', viser);
    // La page a bien démarré : un futur fichier manquant pourra de nouveau provoquer un rechargement.
    const t = setTimeout(() => { try { sessionStorage.removeItem(RELOAD_KEY); } catch { /* stockage bloqué */ } }, 5000);
    return () => { document.removeEventListener('pointerover', viser); document.removeEventListener('touchstart', viser); document.removeEventListener('focusin', viser); clearTimeout(t); };
  }, []);
}

// Barre de chargement fine en haut de l'écran pendant qu'une page arrive (au lieu d'un écran blanc).
function Chargement() {
  return <div className="page-loading" role="progressbar" aria-label="Chargement de la page"><span /></div>;
}

// Pages chargées à la demande : la page d'accueil n'embarque pas le code des autres pages.
const KairnHome = lazyPage(() => import('./home.jsx'));
const KairnHomeV2 = lazyPage(() => import('./v2/home-v2.jsx'));
const OrderPage = lazyPage(() => import('./v3/order.jsx'));
const ClientSpace = lazyPage(() => import('./espace/espace.jsx'));
const Gestion = lazyPage(() => import('./gestion/gestion.jsx'));
const Plateforme = lazyPage(() => import('./v3/plateforme.jsx'));
const RealisationsPage = lazyPage(() => import('./realisations.jsx'));
const LandingPage = lazyPage(() => import('./landing.jsx'));
const LandingPage2 = lazyPage(() => import('./landing2.jsx'));
const LandingPage3 = lazyPage(() => import('./landing3.jsx'));
const RealisationsV2 = lazyPage(() => import('./v2/realisations-v2.jsx'));
const LeadGenPage = lazyPage(() => import('./v2/lead-gen.jsx'));
const WebCreationPage = lazyPage(() => import('./v2/web-creation.jsx'));
const LandingCreationPage = lazyPage(() => import('./v2/landing-creation.jsx'));
const CrmPage = lazyPage(() => import('./v2/crm-page.jsx'));
const BordeauxPage = lazyPage(() => import('./v2/bordeaux-page.jsx'));
const BlogIndex = lazyPage(() => import('./v2/blog-index.jsx'));
const PresentationPac = lazyPage(() => import('./v2/presentation-pac.jsx'));
const Onboarding = lazyPage(() => import('./onboarding/onboarding.jsx'));
const OnboardingAdmin = lazyPage(() => import('./onboarding/admin.jsx'));
const ArticlePage = lazyPage(() => import('./v2/article.jsx'));
const MentionsLegales = lazyPage(() => import('./legal.jsx').then((m) => ({ default: m.MentionsLegales })));
const Confidentialite = lazyPage(() => import('./legal.jsx').then((m) => ({ default: m.Confidentialite })));
const CGV = lazyPage(() => import('./legal.jsx').then((m) => ({ default: m.CGV })));
const AdminLoginPage = lazyPage(() => import('./admin/admin-pages.jsx').then((m) => ({ default: m.AdminLoginPage })));
const AdminCRMPage = lazyPage(() => import('./admin/admin-pages.jsx').then((m) => ({ default: m.AdminCRMPage })));

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) { el.scrollIntoView({ behavior: 'smooth' }); return; }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 768px)').matches : false,
  );
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return isMobile;
}

export function Shell() {
  usePrechargement();
  const isMobile = useIsMobile();
  const variant = isMobile ? 'mobile' : 'desktop';
  return (
    <>
      <ScrollToTop />
      <SeoManager />
      <Suspense fallback={<Chargement />}>
      <Routes>
        {/* Mise en ligne du 29/10/2026 (Ugo : « déploie en live tout ») : la V2 devient l'accueil ; l'accueil blanc reste sur /accueil-v1,
            l'ancien accueil sombre sur /landingpage. */}
        <Route path="/" element={<KairnHomeV3 police="tight" />} />
        <Route path="/accueil-v1" element={<KairnHomeV3 />} />
        <Route path="/landingpage" element={<KairnHomeV2 />} />
        <Route path="/commander" element={<OrderPage />} />
        <Route path="/espace/*" element={<ClientSpace />} />
        <Route path="/gestion/*" element={<Gestion />} />
        <Route path="/plateforme" element={<Plateforme />} />
        <Route path="/v1" element={<KairnHome variant={variant} />} />
        <Route path="/realisations" element={<RealisationsV2 />} />
        <Route path="/generation-de-leads" element={<LeadGenPage />} />
        <Route path="/creation-site-internet" element={<WebCreationPage />} />
        <Route path="/creation-landing-page" element={<LandingCreationPage />} />
        <Route path="/crm-sur-mesure" element={<CrmPage />} />
        <Route path="/agence-bordeaux" element={<BordeauxPage />} />
        <Route path="/blog" element={<BlogIndex />} />
        <Route path="/presentation-pac" element={<PresentationPac />} />
        <Route path="/onboarding/admin" element={<OnboardingAdmin />} />
        <Route path="/onboarding/:token" element={<Onboarding />} />
        <Route path="/blog/:slug" element={<ArticlePage />} />
        <Route path="/v1/realisations" element={<RealisationsPage variant={variant} />} />
        <Route path="/landing" element={<LandingPage variant={variant} />} />
        <Route path="/landing2" element={<LandingPage2 variant={variant} />} />
        <Route path="/v2" element={<Navigate to="/" replace />} />
        <Route path="/v2/realisations" element={<Navigate to="/realisations" replace />} />
        {/* Anciennes pages de la V1, retirées : renvoi vers l'accueil */}
        <Route path="/build" element={<Navigate to="/creation-site-internet" replace />} />
        <Route path="/ads" element={<Navigate to="/generation-de-leads" replace />} />
        <Route path="/contact" element={<Navigate to="/" replace />} />
        <Route path="/landing3" element={<LandingPage3 variant={variant} />} />
        <Route path="/mentions-legales" element={<MentionsLegales />} />
        <Route path="/confidentialite" element={<Confidentialite />} />
        <Route path="/cgv" element={<CGV />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminCRMPage />} />
        <Route path="*" element={<KairnHomeV3 police="tight" />} />
      </Routes>
      </Suspense>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  );
}
