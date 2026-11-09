import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { pageFor, structuredData, SITE_URL, OG_IMAGE } from './seo.js';

// Met à jour titre, description, indexation et balises de partage à chaque changement de page.
// Les pages HTML générées à la compilation portent déjà les bonnes balises ; ce composant
// garde la cohérence pendant la navigation interne et pour les adresses inconnues.
function setMeta(attr, key, value) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
}

// Premier affichage : la page pré-rendue porte déjà ses données structurées complètes (dont la FAQ des pages Leads,
// absente du code chargé dans le navigateur) ; on les garde, et on ne les remplace qu'à la navigation suivante.
let premier = true;

export default function SeoManager() {
  const { pathname } = useLocation();
  useEffect(() => {
    const page = pageFor(pathname);
    const path = pathname !== '/' ? pathname.replace(/\/+$/, '') : '/';
    const canonical = `${SITE_URL}${page.canonical ?? path}`;
    document.title = page.title;
    setMeta('name', 'description', page.description);
    setMeta('name', 'robots', page.robots || 'index, follow, max-image-preview:large');
    setMeta('property', 'og:title', page.title);
    setMeta('property', 'og:description', page.description);
    setMeta('property', 'og:url', canonical);
    setMeta('name', 'twitter:title', page.title);
    setMeta('name', 'twitter:description', page.description);
    setMeta('property', 'og:type', page.kind === 'article' ? 'article' : 'website');
    setMeta('property', 'og:image', page.image || OG_IMAGE);
    setMeta('name', 'twitter:image', page.image || OG_IMAGE);
    // Données structurées de la page affichée (article, FAQ, fil d'Ariane…).
    const data = structuredData(path);
    let ld = document.head.querySelector('script[type="application/ld+json"]');
    const garder = premier && ld;
    premier = false;
    if (garder) {
      // données pré-rendues gardées telles quelles
    } else if (data) {
      if (!ld) {
        ld = document.createElement('script');
        ld.type = 'application/ld+json';
        document.head.appendChild(ld);
      }
      ld.textContent = JSON.stringify(data);
    } else if (ld) {
      ld.remove();
    }
    let link = document.head.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', canonical);
  }, [pathname]);
  return null;
}
