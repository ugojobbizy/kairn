// Après `vite build` : écrit une page HTML par adresse (dist/<adresse>/index.html) avec ses propres
// balises de référencement, et un bloc <noscript> lisible sans JavaScript.
// Le contenu visible reste rendu par React ; seules les balises <head> changent d'une page à l'autre.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { PAGES, headTags, SITE_URL } from '../src/seo.js';

const DIST = 'dist';
const template = readFileSync(join(DIST, 'index.html'), 'utf8');
if (!template.includes('<!--seo:start-->') || !template.includes('<!--seo:noscript-->')) {
  throw new Error('Marqueurs SEO absents de dist/index.html');
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const MAIN_LINKS = [['/', 'Accueil'], ['/realisations', 'Réalisations']];

function render(path) {
  const page = PAGES[path];
  const noscript = `<noscript>
      <h1>${esc(page.title)}</h1>
      <p>${esc(page.description)}</p>
      <nav>${MAIN_LINKS.map(([href, label]) => `<a href="${SITE_URL}${href}">${esc(label)}</a>`).join(' · ')}</nav>
      <p>Contact : <a href="mailto:contact@kairnagency.com">contact@kairnagency.com</a></p>
    </noscript>`;
  return template
    .replace(/<!--seo:start-->[\s\S]*?<!--seo:end-->/, headTags(path))
    .replace('<!--seo:noscript-->', noscript);
}

let count = 0;
for (const path of Object.keys(PAGES)) {
  const html = render(path);
  if (path === '/') {
    writeFileSync(join(DIST, 'index.html'), html);
  } else {
    const dir = join(DIST, path);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'index.html'), html);
  }
  count++;
}
console.log(`SEO : ${count} pages HTML générées`);
