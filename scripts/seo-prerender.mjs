// Après `vite build` : écrit une page HTML par adresse (dist/<adresse>/index.html) avec ses propres
// balises de référencement, et un bloc <noscript> lisible sans JavaScript.
// Pour le blog, le texte complet des articles est aussi écrit dans <div id="root"> : Google le lit
// sans exécuter le JavaScript, puis React remplace ce contenu par la page interactive au chargement.
// Pour les pages principales indexables, le HTML réel de la page (rendu React côté serveur, dist-ssr/)
// est écrit dans <div id="root"> : texte complet et liens internes lisibles sans JavaScript.
// Écrit enfin dist/sitemap.xml à partir de la liste des pages indexables.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { PAGES, headTags, SITE_URL } from '../src/seo.js';
import { POSTS } from '../src/blog/generated/index.js';
import { BLOG_PATH, CATEGORIES, AUTHOR } from '../src/blog/meta.js';

const DIST = 'dist';
const { render: ssr } = await import('../dist-ssr/entry-server.js');

// Les animations d’apparition démarrent invisibles (opacity:0, décalage, flou) : dans le HTML pré-rendu,
// le contenu doit être visible tel quel. On retire ces déclarations des attributs style.
const visible = (html) => html.replace(/style="([^"]*)"/g, (m, css) => {
  if (!/opacity:\s*0(?![.\d])/.test(css)) return m;
  const kept = css.split(';').filter((d) => d.trim() && !/^\s*(opacity|transform|filter)\s*:/.test(d)).join(';');
  return kept ? `style="${kept}"` : '';
});
const template = readFileSync(join(DIST, 'index.html'), 'utf8');
if (!template.includes('<!--seo:start-->') || !template.includes('<!--seo:noscript-->') || !template.includes('<div id="root"></div>')) {
  throw new Error('Marqueurs SEO absents de dist/index.html');
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// Le blog n'apparaît pas dans ces liens : il n'est accessible que par Google et le sitemap (choix de l'utilisateur).
const MAIN_LINKS = [['/', 'Accueil'], ['/realisations', 'Réalisations'], ['/generation-de-leads', 'Génération de leads'], ['/creation-site-internet', 'Création de site internet'], ['/creation-landing-page', 'Création de landing page'], ['/crm-sur-mesure', 'CRM sur mesure'], ['/agence-bordeaux', 'Agence à Bordeaux']];
const nav = `<nav>${MAIN_LINKS.map(([href, label]) => `<a href="${href}">${esc(label)}</a>`).join(' · ')}</nav>`;
const dateFr = (iso) => new Date(`${iso}T12:00:00Z`).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

// Mise en forme minimale du contenu pré-rendu, visible le temps que le JavaScript se charge.
const PRE_STYLE = `<style>.pre{max-width:720px;margin:0 auto;padding:32px 20px 80px;font:17px/1.65 Geist,-apple-system,system-ui,sans-serif;color:#0C0A1A}.pre nav{font-size:14px;margin-bottom:32px}.pre nav a{color:#2F5BEA}.pre h1{font-size:40px;line-height:1.1;letter-spacing:-.03em}.pre table{border-collapse:collapse}.pre td,.pre th{border:1px solid #ddd;padding:6px 10px}</style>`;

async function blogBody(path) {
  if (path === BLOG_PATH) {
    const sections = CATEGORIES.map((c) => {
      const list = POSTS.filter((p) => p.category === c.id);
      if (!list.length) return '';
      return `<section><h2>${esc(c.label)}</h2><ul>${list.map((p) => `<li><a href="${p.path}">${esc(p.title)}</a> : ${esc(p.description)}</li>`).join('')}</ul></section>`;
    }).join('');
    return `${PRE_STYLE}<div class="pre">${nav}<h1>Blog Kairn</h1><p>${esc(PAGES[path].description)}</p>${sections}</div>`;
  }
  const { post } = PAGES[path];
  const { default: body } = await import(`../src/blog/generated/posts/${post.slug}.js`);
  const faq = post.faq.length ? `<h2>Questions fréquentes</h2>${post.faq.map(([q, a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join('')}` : '';
  return `${PRE_STYLE}<article class="pre">${nav}<p><a href="${BLOG_PATH}">Blog</a></p><h1>${esc(post.title)}</h1><p>Par ${esc(AUTHOR.name)} · ${dateFr(post.datePublished)} · ${post.minutes} min de lecture</p>${body.html}${faq}</article>`;
}

async function render(path) {
  const page = PAGES[path];
  const noscript = `<noscript>
      <h1>${esc(page.title)}</h1>
      <p>${esc(page.description)}</p>
      <nav>${MAIN_LINKS.map(([href, label]) => `<a href="${SITE_URL}${href}">${esc(label)}</a>`).join(' · ')}</nav>
      <p>Contact : <a href="mailto:contact@kairnagency.com">contact@kairnagency.com</a></p>
    </noscript>`;
  const full = !page.kind && !page.robots; // pages principales indexables : rendu React complet
  let html = template
    .replace(/<!--seo:start-->[\s\S]*?<!--seo:end-->/, headTags(path))
    .replace('<!--seo:noscript-->', page.kind || full ? '' : noscript);
  if (page.kind) html = html.replace('<div id="root"></div>', `<div id="root">${await blogBody(path)}</div>`);
  if (full) {
    // Le visiteur avec JavaScript ne voit pas ce HTML (sinon il apparaîtrait, disparaîtrait puis rejouerait
    // ses animations quand React prend le relais). Filet : si l'application n'a pas démarré après 4 s, on l'affiche.
    const guard = `<style>.ssr-wait #root[data-ssr]{visibility:hidden}</style><script>document.documentElement.classList.add('ssr-wait');setTimeout(function(){document.documentElement.classList.remove('ssr-wait')},4000)</script>`;
    html = html
      .replace('</head>', `${guard}</head>`)
      .replace('<div id="root"></div>', `<div id="root" data-ssr>${visible(await ssr(path))}</div>`);
  }
  return html;
}

let count = 0;
for (const path of Object.keys(PAGES)) {
  const html = await render(path);
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

// Sitemap : toutes les pages indexables. Les articles portent leur date de mise à jour,
// les autres pages la date de compilation.
const today = new Date().toISOString().slice(0, 10);
const LOW = ['/mentions-legales', '/confidentialite', '/cgv'];
const urls = Object.entries(PAGES)
  .filter(([, p]) => !p.robots)
  .map(([path, p]) => {
    const lastmod = p.kind === 'article' ? p.post.dateModified : today;
    const priority = path === '/' ? '1.0' : LOW.includes(path) ? '0.2' : p.kind === 'article' ? '0.7' : p.kind === 'blog' ? '0.8' : '0.9';
    return `  <url>\n    <loc>${SITE_URL}${path}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <priority>${priority}</priority>\n  </url>`;
  });
writeFileSync(join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`);
console.log(`Sitemap : ${urls.length} adresses`);
