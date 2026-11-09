import React, { useEffect, useRef, useState } from 'react';

// Visuels des pages « Leads {thématique} » (Ugo, 09/11/2026 : « tu me fais vraiment un truc basique », « je veux un meilleur design »).
// Même vocabulaire que les cartes illustrées de l'accueil (piliers.jsx, choisies par Ugo le 30/10) : fond à points, toasts,
// barres, fil vers « Vous ». Toutes les données affichées sont fictives et marquées comme telles quand elles imitent un contact.
// Les animations ne tournent que quand le bloc est à l'écran (classe is-play), et jamais si l'utilisateur réduit les animations.

export function Check() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>;
}

const PATHS = {
  shield: <><path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6l-8-3z" /><path d="m9 12 2 2 4-4" /></>,
  phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />,
  message: <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /><path d="m9 8 6 6M15 8l-6 6" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" /></>,
  badge: <><circle cx="12" cy="9" r="6" /><path d="m8.5 14-1.5 7 5-3 5 3-1.5-7" /></>,
  scale: <><path d="M12 3v18M5 21h14" /><path d="m5 8-3 6a3 3 0 0 0 6 0L5 8zM19 8l-3 6a3 3 0 0 0 6 0l-3-6zM5 8h14" /></>,
  wrench: <path d="M14.7 6.3a4 4 0 0 0 5 5L21 13l-8 8-3-3 8-8-1.3-1.3a4 4 0 0 0-5-5l2.6 2.6-2 2-2.6-2.6a4 4 0 0 0 5 5" />,
  building: <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M9 7h1M14 7h1M9 11h1M14 11h1M9 15h1M14 15h1M10 21v-3h4v3" /></>,
  briefcase: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18" /></>,
  chart: <><path d="M3 3v18h18" /><path d="m7 15 4-4 3 3 6-7" /></>,
  home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></>,
  pin: <><path d="M12 22s7-6.4 7-12a7 7 0 1 0-14 0c0 5.6 7 12 7 12z" /><circle cx="12" cy="10" r="2.5" /></>,
};

export function Ico({ name, size = 20 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{PATHS[name]}</svg>;
}

// Joue les animations quand l'élément est à l'écran.
export function usePlay() {
  const ref = useRef(null);
  const [play, setPlay] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') { setPlay(true); return undefined; }
    const io = new IntersectionObserver(([e]) => setPlay(e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, play];
}

const reduit = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Pile de notifications « Nouveau contact » : une nouvelle toutes les 2,2 s.
export function VisToasts({ play, items }) {
  const [n, setN] = useState(1);
  useEffect(() => {
    if (!play || reduit()) return undefined;
    const id = setInterval(() => setN((x) => x + 1), 2200);
    return () => clearInterval(id);
  }, [play]);
  const shown = [n - 2, n - 1, n].filter((k) => k >= 0);
  const pos = (k) => (k === n ? 'is-front' : k === n - 1 ? 'is-back' : 'is-gone');
  return (
    <div className="pv pv-frais ld-toasts" aria-hidden="true">
      {shown.map((k) => (
        <div key={k} className={`pv-toast ${pos(k)}`}>
          <span className="pv-dot" /><b>Nouveau contact</b><span>{items[k % items.length]}</span><em>À l’instant</em>
        </div>
      ))}
    </div>
  );
}

export function VisFlux() {
  const jours = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  const h = [62, 78, 58, 72, 66, 50, 56];
  return (
    <div className="pv pv-flux ld-flux" aria-hidden="true">
      {jours.map((j, i) => <div key={i} className="pv-col"><span className="pv-bar" style={{ height: `${h[i]}%`, '--i': i }} /><span className="pv-day">{j}</span></div>)}
    </div>
  );
}

export function VisSeul() {
  return (
    <div className="pv pv-seul" aria-hidden="true">
      <span className="pv-lead">Contact</span>
      <div className="pv-wire">
        <svg className="pv-lines" viewBox="0 0 200 90" preserveAspectRatio="none">
          <path d="M100 0 C100 30 30 40 30 90" className="is-off" />
          <path d="M100 0 C100 30 170 40 170 90" className="is-off" />
          <path d="M100 0 L100 90" className="is-on" />
        </svg>
        <span className="pv-spark" />
      </div>
      <div className="pv-targets"><span className="is-off">Autre</span><span className="is-on">Vous</span><span className="is-off">Autre</span></div>
    </div>
  );
}

// Zone : départements cochés autour d'une épingle, et les trois modes de choix.
export function VisZone({ climat }) {
  const deps = [['33', true], ['40', true], ['24', false], ['47', true], ['64', false], ['17', true]];
  return (
    <div className="ld-zone" aria-hidden="true">
      <div className="ld-zone-map">
        {deps.map(([d, on], i) => <span key={d} className={on ? 'is-on' : undefined} style={{ '--i': i }}>{d}</span>)}
        <i className="ld-zone-pin"><Ico name="pin" size={18} /></i>
      </div>
      <div className="ld-zone-modes"><span className="is-on">Départements</span><span>Régions</span>{climat && <span>H1 · H2 · H3</span>}</div>
    </div>
  );
}

export function VisEngagement({ minimum }) {
  return (
    <div className="ld-eng" aria-hidden="true">
      <div className="ld-eng-row"><span>Abonnement</span><span className="ld-switch" /></div>
      <div className="ld-eng-row"><span>Durée d’engagement</span><b>Aucune</b></div>
      <div className="ld-eng-row"><span>Première commande</span><b>{minimum} contacts</b></div>
    </div>
  );
}

export function VisRemplace() {
  return (
    <div className="ld-rep" aria-hidden="true">
      {['Doublon', 'Hors zone'].map((m, i) => (
        <div key={m} className="ld-rep-row" style={{ '--i': i }}>
          <span className="ld-rep-bad">{m}</span>
          <svg className="ld-rep-arrow" viewBox="0 0 40 10"><path d="M0 5h34M30 1l5 4-5 4" /></svg>
          <span className="ld-rep-ok"><Check />Remplacé</span>
        </div>
      ))}
    </div>
  );
}

// Frise du rappel : demande, idéal dans l'heure, limite légale à 5 jours ouvrables.
export function VisRappel() {
  return (
    <div className="ld-time" aria-hidden="true">
      <div className="ld-time-bar"><i className="ld-time-good" /><i className="ld-time-ok" /><span className="ld-time-dot" /></div>
      <div className="ld-time-lab">
        <span><b>Demande</b>10:42</span>
        <span className="is-good"><b>Idéal</b>dans l’heure</span>
        <span className="is-end"><b>Limite</b>5 jours ouvrables</span>
      </div>
    </div>
  );
}

// Étape 1 : une publicité Meta dédiée (maquette, sans marque ni visage).
export function VisAd({ court }) {
  return (
    <div className="ld-ad" aria-hidden="true">
      <div className="ld-ad-top"><span className="ld-ad-logo" /><div><b>Votre campagne</b><small>Sponsorisé</small></div></div>
      <div className="ld-ad-img"><Ico name="home" size={34} /><span>{court}</span></div>
      <div className="ld-ad-cta"><span>Demande de rappel gratuite</span><b>Obtenir un devis</b></div>
    </div>
  );
}

// Étape 2 : une question du formulaire, la bonne réponse se coche.
export function VisForm({ question, options }) {
  return (
    <div className="ld-form" aria-hidden="true">
      <p>{question}</p>
      {options.map((o, i) => <span key={o} className={i === 0 ? 'is-on' : undefined}><i />{o}</span>)}
    </div>
  );
}

// Étape 4 : le pipeline de l'espace client.
export function VisPipe() {
  const cols = [['Nouveau', 3], ['Rendez-vous', 2], ['Signé', 1]];
  return (
    <div className="ld-pipe" aria-hidden="true">
      {cols.map(([c, n], i) => (
        <div key={c} className="ld-pipe-col">
          <small>{c}</small>
          {Array.from({ length: n }, (_, k) => <span key={k} className={i === 2 ? 'is-won' : undefined} style={{ '--k': k + i }} />)}
        </div>
      ))}
    </div>
  );
}
