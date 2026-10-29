import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './styles.js';
import KairnHomeV3 from './v3/home.jsx';
import SeoManager from './seo-manager.jsx';

// Pages chargées à la demande : la page d'accueil n'embarque pas le code des autres pages.
const KairnHome = lazy(() => import('./home.jsx'));
const KairnHomeV2 = lazy(() => import('./v2/home-v2.jsx'));
const OrderPage = lazy(() => import('./v3/order.jsx'));
const ClientSpace = lazy(() => import('./espace/espace.jsx'));
const Gestion = lazy(() => import('./gestion/gestion.jsx'));
const Plateforme = lazy(() => import('./v3/plateforme.jsx'));
const RealisationsPage = lazy(() => import('./realisations.jsx'));
const LandingPage = lazy(() => import('./landing.jsx'));
const LandingPage2 = lazy(() => import('./landing2.jsx'));
const LandingPage3 = lazy(() => import('./landing3.jsx'));
const RealisationsV2 = lazy(() => import('./v2/realisations-v2.jsx'));
const LeadGenPage = lazy(() => import('./v2/lead-gen.jsx'));
const WebCreationPage = lazy(() => import('./v2/web-creation.jsx'));
const LandingCreationPage = lazy(() => import('./v2/landing-creation.jsx'));
const CrmPage = lazy(() => import('./v2/crm-page.jsx'));
const BordeauxPage = lazy(() => import('./v2/bordeaux-page.jsx'));
const BlogIndex = lazy(() => import('./v2/blog-index.jsx'));
const PresentationPac = lazy(() => import('./v2/presentation-pac.jsx'));
const Onboarding = lazy(() => import('./onboarding/onboarding.jsx'));
const OnboardingAdmin = lazy(() => import('./onboarding/admin.jsx'));
const ArticlePage = lazy(() => import('./v2/article.jsx'));
const MentionsLegales = lazy(() => import('./legal.jsx').then((m) => ({ default: m.MentionsLegales })));
const Confidentialite = lazy(() => import('./legal.jsx').then((m) => ({ default: m.Confidentialite })));
const CGV = lazy(() => import('./legal.jsx').then((m) => ({ default: m.CGV })));
const AdminLoginPage = lazy(() => import('./admin/admin-pages.jsx').then((m) => ({ default: m.AdminLoginPage })));
const AdminCRMPage = lazy(() => import('./admin/admin-pages.jsx').then((m) => ({ default: m.AdminCRMPage })));

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
  const isMobile = useIsMobile();
  const variant = isMobile ? 'mobile' : 'desktop';
  return (
    <>
      <ScrollToTop />
      <SeoManager />
      <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<KairnHomeV3 />} />
        <Route path="/landingpage" element={<KairnHomeV2 />} />
        <Route path="/v2" element={<KairnHomeV3 police="tight" />} />
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
        <Route path="*" element={<KairnHomeV3 />} />
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
