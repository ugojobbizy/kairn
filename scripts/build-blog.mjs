// Compile les articles du blog (content/blog/*.md) en modules JavaScript :
//  - src/blog/generated/index.js : les métadonnées de tous les articles (liste, SEO, sitemap) ;
//  - src/blog/generated/posts/<slug>.js : le HTML et le sommaire de chaque article, chargés à la demande.
// Lancé avant `vite` et `vite build` (voir package.json). Les fichiers générés ne sont pas versionnés.
//
// Le script refuse de compiler un article qui enfreint une règle de rédaction bloquante
// (tiret cadratin en milieu de phrase, lien interne cassé, champ manquant) et signale les mots à éviter.
import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { join, basename } from 'node:path';
import matter from 'gray-matter';
import { Marked } from 'marked';
import { CATEGORIES, SERVICE_PAGES, BLOG_PATH } from '../src/blog/meta.js';

const SRC = 'content/blog';
const OUT = 'src/blog/generated';
const REQUIRED = ['title', 'seoTitle', 'description', 'category', 'datePublished', 'servicePage', 'faq'];
const SITE_ROUTES = ['/', '/realisations', BLOG_PATH, ...Object.keys(SERVICE_PAGES), '/mentions-legales', '/confidentialite', '/cgv'];
// Mots proscrits par brain/core/style.md : avertissement, pas blocage.
const AVOID = [/\bsur-mesure\b/i, /à votre écoute/i, /professionnalisme/i, /expertise reconnue/i, /clé en main/i];

// Typographie française : apostrophe courbe, espaces insécables avant : ; ? ! % € et dans les guillemets.
const typo = (t) => String(t)
  .replace(/'/g, '\u2019')
  .replace(/ ([:;?!%»€])/g, '\u00A0$1')
  .replace(/« /g, '«\u00A0');
// Applique typo() au texte seulement, jamais à l'intérieur des balises HTML.
const typoHtml = (html) => html.split(/(<[^>]+>)/).map((part) => (part.startsWith('<') ? part : typo(part.replace(/&#39;/g, "'")))).join('');

// Les dates YAML sans guillemets arrivent en objets Date : on les ramène à AAAA-MM-JJ.
const isoDate = (d) => (d instanceof Date ? d.toISOString().slice(0, 10) : String(d));

const slugify = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/<[^>]+>/g, '').replace(/&#?\w+;/g, '-').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const plain = (s) => s.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ');

const files = readdirSync(SRC).filter((f) => f.endsWith('.md')).sort();
const errors = [];
const warnings = [];
const posts = [];
const bodies = {};

for (const file of files) {
  const slug = basename(file, '.md');
  const { data, content } = matter(readFileSync(join(SRC, file), 'utf8'));
  if (data.draft) continue;
  const where = `${file}`;

  for (const k of REQUIRED) if (data[k] == null || data[k] === '') errors.push(`${where} : champ « ${k} » manquant`);
  if (data.category && !CATEGORIES.some((c) => c.id === data.category)) errors.push(`${where} : catégorie inconnue « ${data.category} »`);
  if (data.servicePage && !SERVICE_PAGES[data.servicePage]) errors.push(`${where} : page de service inconnue « ${data.servicePage} »`);
  if (data.description && data.description.length > 160) warnings.push(`${where} : description de ${data.description.length} caractères (160 max conseillé)`);
  if (data.seoTitle && data.seoTitle.length > 65) warnings.push(`${where} : seoTitle de ${data.seoTitle.length} caractères (65 max conseillé)`);

  // R-007 : pas de tiret cadratin ou demi-cadratin en milieu de phrase dans un texte livré.
  const prose = [content, data.title, data.description, ...(data.faq || []).flatMap((f) => [f.q, f.a])].join('\n');
  prose.split('\n').forEach((line, i) => {
    if (/\S\s[—–]\s\S/.test(line)) errors.push(`${where} : tiret en milieu de phrase (ligne ${i + 1}) : « ${line.trim().slice(0, 80)} »`);
  });
  const words0 = prose.replace(/\]\([^)]*\)/g, ']');
  for (const re of AVOID) if (re.test(words0)) warnings.push(`${where} : expression à éviter ${re}`);

  // Rendu Markdown : identifiants sur les titres, sommaire des H2, liens externes en nouvel onglet.
  const toc = [];
  const used = new Set();
  const marked = new Marked({
    gfm: true,
    renderer: {
      heading({ tokens, depth }) {
        const text = this.parser.parseInline(tokens);
        if (depth === 1) errors.push(`${where} : titre H1 dans le corps (le H1 vient de « title »)`);
        let id = slugify(text);
        while (used.has(id)) id += '-2';
        used.add(id);
        if (depth === 2) toc.push({ id, text: plain(text) });
        return `<h${depth} id="${id}">${text}</h${depth}>\n`;
      },
      link({ href, title, tokens }) {
        const text = this.parser.parseInline(tokens);
        const t = title ? ` title="${title}"` : '';
        if (/^https?:\/\//.test(href)) return `<a href="${href}"${t} target="_blank" rel="noopener noreferrer">${text}</a>`;
        const path = href.split('#')[0];
        const ok = !path || SITE_ROUTES.includes(path) || (path.startsWith(`${BLOG_PATH}/`) && files.includes(`${path.slice(BLOG_PATH.length + 1)}.md`));
        if (!ok) errors.push(`${where} : lien interne cassé « ${href} »`);
        return `<a href="${href}"${t}>${text}</a>`;
      },
    },
  });
  // Tableaux enveloppés pour défiler horizontalement sur téléphone.
  let html = marked.parse(content);
  html = html.replace(/<table>/g, '<div class="post-table"><table>').replace(/<\/table>/g, '</table></div>');
  html = typoHtml(html);
  toc.forEach((t) => { t.text = typo(t.text.replace(/&#39;/g, "'")); });

  const words = plain(html).split(/\s+/).filter(Boolean).length;
  const post = {
    slug,
    path: `${BLOG_PATH}/${slug}`,
    title: typo(data.title),
    seoTitle: typo(data.seoTitle),
    description: typo(data.description),
    category: data.category,
    datePublished: isoDate(data.datePublished),
    dateModified: isoDate(data.dateModified || data.datePublished),
    servicePage: data.servicePage,
    ctaTitle: data.ctaTitle ? typo(data.ctaTitle) : null,
    ctaText: data.ctaText ? typo(data.ctaText) : null,
    faq: (data.faq || []).map((f) => [typo(f.q), typo(f.a)]),
    related: data.related || [],
    words,
    minutes: Math.max(1, Math.round(words / 220)),
  };
  posts.push(post);
  bodies[slug] = { html, toc };
}

for (const p of posts) {
  for (const r of p.related) if (!posts.some((x) => x.slug === r)) errors.push(`${p.slug}.md : article lié introuvable « ${r} »`);
}

warnings.forEach((w) => console.warn(`⚠ blog : ${w}`));
if (errors.length) {
  errors.forEach((e) => console.error(`✖ blog : ${e}`));
  process.exit(1);
}

posts.sort((a, b) => b.datePublished.localeCompare(a.datePublished) || a.title.localeCompare(b.title));

rmSync(OUT, { recursive: true, force: true });
mkdirSync(join(OUT, 'posts'), { recursive: true });
const header = '// Fichier généré par scripts/build-blog.mjs à partir de content/blog. Ne pas modifier à la main.\n';
writeFileSync(join(OUT, 'index.js'), `${header}export const POSTS = ${JSON.stringify(posts, null, 2)};\n`);
for (const [slug, body] of Object.entries(bodies)) {
  writeFileSync(join(OUT, 'posts', `${slug}.js`), `${header}export default ${JSON.stringify(body)};\n`);
}
console.log(`Blog : ${posts.length} article(s) compilé(s)`);
