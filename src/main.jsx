import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

const root = document.getElementById('root');

// HTML pré-rendu pour Google (scripts/seo-prerender.mjs), masqué au visiteur : on lève le masque
// une fois que React a remplacé ce HTML par l'application (premier rendu validé).
function Reveal() {
  useEffect(() => {
    root.removeAttribute('data-ssr');
    document.documentElement.classList.remove('ssr-wait');
  }, []);
  return null;
}

ReactDOM.createRoot(root).render(<><Reveal /><App /></>);
