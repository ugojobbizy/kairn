import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import './styles.js';
import KairnHome from './home.jsx';
import BuildPage from './build.jsx';
import AdsPage from './ads.jsx';
import RealisationsPage from './realisations.jsx';
import ContactPage from './contact.jsx';

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

function Shell() {
  const isMobile = useIsMobile();
  const variant = isMobile ? 'mobile' : 'desktop';
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<KairnHome variant={variant} />} />
        <Route path="/build" element={<BuildPage variant={variant} />} />
        <Route path="/ads" element={<AdsPage variant={variant} />} />
        <Route path="/realisations" element={<RealisationsPage variant={variant} />} />
        <Route path="/contact" element={<ContactPage variant={variant} />} />
        <Route path="*" element={<KairnHome variant={variant} />} />
      </Routes>
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
