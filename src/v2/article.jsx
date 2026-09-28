import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { Nav, Footer, BookCta, useV2Favicon } from './layout.jsx';
import Booking from './booking.jsx';
import { Icon, Pill, Glow, Reveal, FaqList } from './blocks.jsx';
import CplCalculator from './blog-widgets.jsx';
import { POSTS } from '../blog/generated/index.js';
import { BLOG_PATH, CATEGORIES, SERVICE_PAGES, AUTHOR } from '../blog/meta.js';
import './v2.css';
import './blog.css';

// Page d'un article du blog (/blog/:slug). Le texte vient de content/blog/<slug>.md,
// compilé en HTML par scripts/build-blog.mjs et chargé à la demande.

const BODIES = import.meta.glob('../blog/generated/posts/*.js');
const WIDGETS = { 'cpl-calculator': CplCalculator };
const WIDGET_RE = /<div data-widget="([a-z-]+)">[\s\S]*?<\/div><!--\/widget-->/g;

export const dateFr = (iso) => new Date(`${iso}T12:00:00`).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
export const categoryLabel = (id) => CATEGORIES.find((c) => c.id === id)?.label;

// Découpe le HTML de l'article autour des composants interactifs (<div data-widget="…">).
function Body({ html }) {
  const parts = [];
  let last = 0;
  html.replace(WIDGET_RE, (match, name, offset) => {
    parts.push({ html: html.slice(last, offset) });
    parts.push({ widget: name });
    last = offset + match.length;
    return match;
  });
  parts.push({ html: html.slice(last) });
  return parts.map((p, i) => {
    if (p.widget) {
      const W = WIDGETS[p.widget];
      return W ? <W key={i} /> : null;
    }
    return <div key={i} dangerouslySetInnerHTML={{ __html: p.html }} />;
  });
}

// Visuel de couverture : le chiffre ou l'idée clé de l'article, sur fond sombre aux couleurs de la catégorie.
export function PostCover({ post, className = '' }) {
  if (!post.cover) return null;
  return (
    <div className={`post-cover ${className}`} data-cat={post.category} aria-hidden="true">
      <span className="post-cover-glow" />
      <span className="post-cover-grid" />
      <span className="post-cover-big">{post.cover.big}</span>
      <span className="post-cover-cap">{post.cover.caption}</span>
    </div>
  );
}

export function PostCard({ post, big }) {
  return (
    <Link to={post.path} className={`post-card${big ? ' is-big' : ''}`}>
      <PostCover post={post} />
      <span className="post-card-cat">{categoryLabel(post.category)}</span>
      <h3>{post.title}</h3>
      <p>{post.description}</p>
      <span className="post-card-meta">{post.minutes} min de lecture <Icon name="arrow" size={15} stroke={2} /></span>
    </Link>
  );
}

export default function ArticlePage() {
  useV2Favicon();
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = POSTS.find((p) => p.slug === slug);
  const [body, setBody] = useState(null);

  useEffect(() => {
    setBody(null);
    const load = BODIES[`../blog/generated/posts/${slug}.js`];
    if (load) load().then((m) => setBody(m.default));
  }, [slug]);

  if (!post) return <NotFound />;

  // Liens internes du texte : navigation sans rechargement de page.
  const onClick = (e) => {
    const a = e.target.closest('a');
    if (!a || a.target || e.metaKey || e.ctrlKey) return;
    const href = a.getAttribute('href');
    if (href && href.startsWith('/')) { e.preventDefault(); navigate(href); }
  };

  const related = post.related.map((s) => POSTS.find((p) => p.slug === s)).filter(Boolean);
  const service = SERVICE_PAGES[post.servicePage];

  return (
    <MotionConfig reducedMotion="user">
      <div className="v2 blog">
        <a href="#contenu" className="skip">Aller au contenu</a>
        <Nav />

        <main id="contenu">
          <header className="hero is-dark post-hero">
            <Glow />
            <div className="wrap post-hero-inner">
              <nav className="crumbs" aria-label="Fil d’Ariane">
                <Link to="/">Accueil</Link><span aria-hidden="true">/</span>
                <Link to={BLOG_PATH}>Blog</Link><span aria-hidden="true">/</span>
                <span>{categoryLabel(post.category)}</span>
              </nav>
              <h1>{post.title}</h1>
              <p className="post-lead">{post.description}</p>
              <p className="post-meta">
                <span>{AUTHOR.name}</span>
                <span>Mis à jour le <time dateTime={post.dateModified}>{dateFr(post.dateModified)}</time></span>
                <span>{post.minutes} min de lecture</span>
              </p>
            </div>
          </header>

          <div className="wrap post-grid">
            {body?.toc?.length > 2 && (
              <aside className="post-toc" aria-label="Sommaire">
                <p>Sommaire</p>
                <ol>
                  {body.toc.map((t) => <li key={t.id}><a href={`#${t.id}`}>{t.text}</a></li>)}
                </ol>
              </aside>
            )}

            <article className="post-body" onClick={onClick}>
              {body ? <Body html={body.html} /> : <div className="post-loading" aria-busy="true" />}

              <aside className="post-cta">
                <h2>{post.ctaTitle || 'On regarde vos chiffres ensemble ?'}</h2>
                <p>{post.ctaText || 'En 30 minutes, on analyse votre acquisition actuelle et on vous dit franchement ce qu’on changerait.'}</p>
                <div className="post-cta-actions">
                  <BookCta>Réserver un appel de 30 min</BookCta>
                  <Link to={post.servicePage} className="post-cta-link">{service} <Icon name="arrow" size={15} stroke={2} /></Link>
                </div>
              </aside>

              <aside className="post-author">
                <span className="post-author-avatar" aria-hidden="true">
                  {AUTHOR.photo ? <img src={AUTHOR.photo} alt="" width="56" height="56" /> : AUTHOR.name.split(' ').map((w) => w[0]).join('')}
                </span>
                <div>
                  <p className="post-author-name">
                    {AUTHOR.linkedin ? <a href={AUTHOR.linkedin} target="_blank" rel="noopener noreferrer">{AUTHOR.name}</a> : AUTHOR.name}
                    <small>{AUTHOR.role}</small>
                  </p>
                  <p>{AUTHOR.bio}</p>
                </div>
              </aside>
            </article>
          </div>

          {post.faq.length > 0 && (
            <section className="band post-faq" id="faq">
              <div className="wrap faq-grid">
                <Reveal className="faq-aside">
                  <Pill>Questions fréquentes</Pill>
                  <h2 className="h2">Les questions <span className="serif grad-text">qu’on nous pose.</span></h2>
                </Reveal>
                <FaqList items={post.faq} />
              </div>
            </section>
          )}

          {related.length > 0 && (
            <section className="band post-related">
              <div className="wrap">
                <h2 className="post-related-title">À lire ensuite</h2>
                <div className="post-cards">
                  {related.map((p) => <PostCard key={p.slug} post={p} />)}
                </div>
              </div>
            </section>
          )}

          <section id="contact" style={{ paddingBottom: 'var(--band-sm)' }}>
            <Reveal className="final">
              <Glow />
              <div className="final-inner">
                <Pill>Parlons de votre projet</Pill>
                <h2 className="h2">30 minutes pour savoir si on peut <span className="serif">vous aider.</span></h2>
                <p className="final-lead">On regarde votre offre, vos chiffres actuels et vos campagnes, et on vous dit franchement ce qu’on ferait.</p>
                <p className="final-free" id="reserver">Offert et sans engagement</p>
                <Booking />
              </div>
            </Reveal>
          </section>
        </main>

        <Footer />
        <div className="mob-cta"><BookCta>Réserver 30 min</BookCta></div>
      </div>
    </MotionConfig>
  );
}

function NotFound() {
  return (
    <div className="v2 blog">
      <Nav />
      <main id="contenu" className="wrap post-missing">
        <h1>Cet article n’existe pas ou a été déplacé.</h1>
        <p><Link to={BLOG_PATH}>Voir tous les articles du blog</Link></p>
      </main>
      <Footer />
    </div>
  );
}

