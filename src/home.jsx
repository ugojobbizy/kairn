import React from 'react';
import { IllusLanding, IllusFunnel, IllusFlow, IllusCurve, IllusCPL, IllusDash } from './illustrations.jsx';
import { KNav, KHero, KExpertise, KCapacities } from './sections-1.jsx';
import { KMetrics, KProcess, KSpline } from './sections-2.jsx';
import { KCases, KLogos, KFAQ, KFinalCTA, KFooter } from './sections-3.jsx';

const K_CAPS = [
  { k: 'Landing pages haute conversion', d: 'Pages qui convertissent au-delà de 8%. Framer, Webflow ou Next.js selon le besoin.', Illus: IllusLanding, tag: 'Build' },
  { k: 'Tunnels & pages de capture', d: 'Funnels multi-étapes pensés pour le lead qualifié, pas pour le volume vide.', Illus: IllusFunnel, tag: 'Build' },
  { k: 'Automatisations no-code', d: 'n8n, Make, Zapier. Workflows IA qui retirent le travail répétitif de vos équipes.', Illus: IllusFlow, tag: 'Build' },
  { k: 'Campagnes Meta & Google Ads', d: 'Creative + targeting + tracking. Tous les leviers audités avant la moindre dépense.', Illus: IllusCurve, tag: 'Ads' },
  { k: 'Optimisation CPL & scaling', d: 'On baisse le CPL avant de scaler le budget. Dans cet ordre, jamais l’inverse.', Illus: IllusCPL, tag: 'Ads' },
  { k: 'Dashboards & tracking', d: 'Stack de mesure propre — vous savez d’où vient chaque lead, en temps réel.', Illus: IllusDash, tag: 'Build' },
];

const K_METRICS = [
  { n: '47', suf: '+', l: 'Projets livrés' },
  { n: '−38', suf: '%', l: 'CPL moyen réduit' },
  { n: '18', suf: 'j', l: 'Time-to-launch moyen' },
  { n: '2.4', suf: '×', l: 'Volume de leads vs baseline' },
];

const K_STEPS = [
  { n: '01', t: 'Audit', d: 'Stack, funnel, tracking, créas. On identifie les fuites avant de toucher à quoi que ce soit.' },
  { n: '02', t: 'Build', d: 'Pages, automatisations, tracking. Livré en 2 à 4 semaines, pas en 6 mois.' },
  { n: '03', t: 'Launch', d: 'Mise en ligne, campagnes lancées, budget calibré. On observe, on ne promet pas.' },
  { n: '04', t: 'Optimize', d: 'Itérations hebdo sur les créas, le funnel, le ciblage. Reporting transparent chaque lundi.' },
];

const K_CASES = [
  {
    company: { name: 'TradeAuto', logo: '/tradeauto-logo.png' },
    tags: ['Automobile', 'Build + Ads', 'CRM & Tracking'],
    title: 'Site, CRM et acquisition livrés en 4 semaines',
    challenge: "Leads dispersés entre formulaires, emails et WhatsApp. Pas de visibilité sur le coût réel d'acquisition ni sur la qualité des sources.",
    solution: 'Site + CRM + dashboard temps réel + campagnes Meta & Google par la même équipe. Tracking serveur end-to-end, attribution multi-source.',
    kpis: [
      { value: '−64%', label: 'CPL · de 27,40 CHF à 10 CHF' },
      { value: '86', label: 'leads ultra-qualifiés générés cette semaine' },
      { value: '4 sem.', label: 'du brief au tunnel complet' },
    ],
    quote: 'Site, CRM, dashboard, Meta + Google Ads — tout livré par la même équipe en 4 semaines. Je recommande les yeux fermés.',
    author: 'Louis · Fondateur, TRADEAUTO.CH',
  },
  {
    company: { name: 'Madame la Gouvernante', logo: '/madame-logo.png' },
    tags: ['Marketplace', 'Two-sided', 'Stripe & Automation'],
    title: 'Plateforme two-sided pour piloter 150+ missions / semaine',
    challenge: 'Coordination manuelle via WhatsApp et tableurs. Matching entreprises/auto-entrepreneurs lent, relances oubliées, facturation manuelle.',
    solution: 'Plateforme two-sided avec matching intelligent, dispatch auto, paiement Stripe et facturation générée. Un seul back-office pour piloter tout le flux.',
    kpis: [
      { value: '150+', label: 'missions réalisées chaque semaine' },
      { value: '26+', label: 'endpoints API REST' },
      { value: '14', label: 'spécialités métiers supportées' },
    ],
    quote: "Aujourd'hui on pilote 150+ missions par semaine depuis un seul back-office. La différence est nuit et jour.",
    author: 'Manon · Co-fondatrice, MADAMELAGOUVERNANTE.COM',
  },
  {
    company: { name: 'Rénovia', logo: '/renovia-logo.svg' },
    tags: ['Rénovation', 'Lead Gen', 'Funnel & Qualification'],
    title: 'CPL divisé par 2 avec des dossiers prêts à closer',
    challenge: 'Leads tièdes, dossiers incomplets, équipe commerciale qui relance dans le vide. Conversion en chute, no-shows fréquents.',
    solution: 'Funnel refondu, qualification enrichie (DPE live, profil ANAH), tracking serveur complet. Les leads arrivent avec un dossier signé prêt à closer.',
    kpis: [
      { value: '+158%', label: 'taux de conversion · 12% → 31%' },
      { value: '−46%', label: 'CPL · de 24 € à 13 €' },
      { value: '5×', label: 'plus de data par lead · 3 → 15+ champs' },
    ],
    quote: 'CPL divisé par 2, conversion doublée. Mais surtout : les leads arrivent avec un dossier complet. Le closing a suivi.',
    author: 'Samuel · Fondateur, RENOVIA.FR',
  },
];

const K_FAQ = [
  { q: 'Quel est votre délai de démarrage ?', a: 'Sous 5 jours ouvrés après le call d’alignement. Les projets Ads peuvent démarrer en 48h si la stack tracking est prête.' },
  { q: 'Travaillez-vous avec un engagement minimum ?', a: 'Non. Les missions Build sont au forfait, les missions Ads au mois reconductible. Vous pouvez partir à tout moment avec un préavis de 30 jours.' },
  { q: 'Quels outils utilisez-vous ?', a: 'Côté Build : React, Prisma, Next.js, Supabase, n8n, Make. Côté Ads : Meta, Google, LinkedIn, TikTok. On choisit selon votre contexte, pas selon nos habitudes.' },
  { q: 'Garantie de résultat ?', a: 'On s’engage sur des fourchettes chiffrées à l’audit, pas sur des promesses marketing. Si les objectifs ne sont pas atteints à 90 jours, on ajuste le plan à nos frais.' },
  { q: 'Travaillez-vous avec des structures en phase d’amorçage ?', a: 'Oui, si la traction est là et le produit validé. On évite les projets pré-revenue — ce n’est pas le bon moment pour scaler de l’acquisition payante.' },
];

export default function KairnHome({ variant = 'desktop' }) {
  const isMobile = variant === 'mobile';
  return (
    <div className="kairn">
      <KNav isMobile={isMobile} />
      <KHero isMobile={isMobile} />
      <KExpertise isMobile={isMobile} />
      <KCapacities isMobile={isMobile} caps={K_CAPS} />
      <KMetrics isMobile={isMobile} metrics={K_METRICS} />
      <KProcess isMobile={isMobile} steps={K_STEPS} />
      <KSpline isMobile={isMobile} />
      <KCases isMobile={isMobile} cases={K_CASES} />
      <KLogos isMobile={isMobile} />
      <KFAQ isMobile={isMobile} items={K_FAQ} />
      <KFinalCTA isMobile={isMobile} />
      <KFooter isMobile={isMobile} />
      {isMobile && (
        <div style={{ position: 'sticky', bottom: 0, padding: '0 0 12px', pointerEvents: 'none' }}>
          <div className="k-mob-cta" style={{ pointerEvents: 'auto' }}>
            <span style={{ fontSize: 14, fontWeight: 500 }}>Parlons de votre projet.</span>
            <span style={{ fontSize: 13, color: '#C4B5FD', fontWeight: 500 }}>Réserver 30 min →</span>
          </div>
        </div>
      )}
    </div>
  );
}
