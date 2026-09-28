import React, { useState } from 'react';
import { MotionConfig, motion } from 'framer-motion';
import { Nav, Footer, BookCta, useV2Favicon } from './layout.jsx';
import Booking from './booking.jsx';
import { EASE, Icon, Pill, Glow, Reveal } from './blocks.jsx';
import { PostCard, PostCover, categoryLabel } from './article.jsx';
import { Link } from 'react-router-dom';
import { POSTS } from '../blog/generated/index.js';
import { CATEGORIES } from '../blog/meta.js';
import './v2.css';
import './blog.css';

// Page d'accueil du blog (/blog) : un article à la une, puis tous les articles, filtrables par catégorie.
// L'article à la une est celui marqué « featured: true » dans son en-tête, sinon le plus récent.

export default function BlogIndex() {
  useV2Favicon();
  const [cat, setCat] = useState('all');
  const featured = POSTS.find((p) => p.featured) || POSTS[0];
  const cats = CATEGORIES.filter((c) => POSTS.some((p) => p.category === c.id));
  const list = POSTS.filter((p) => p !== featured && (cat === 'all' || p.category === cat));

  return (
    <MotionConfig reducedMotion="user">
      <div className="v2 blog">
        <a href="#contenu" className="skip">Aller au contenu</a>
        <Nav />

        <main id="contenu">
          <section className="hero is-dark blog-hero">
            <Glow />
            <div className="wrap post-hero-inner">
              <Reveal y={12}><Pill>Le blog</Pill></Reveal>
              <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}>
                Trouver des clients sur internet, <span className="serif grad-text">chiffres à l’appui.</span>
              </motion.h1>
              <p className="post-lead">
                Sites, landing pages, Meta et Google Ads, CRM : ce qu’on a appris en lançant des campagnes pour des entreprises, avec les vrais chiffres et les erreurs qu’on ne refera pas.
              </p>
            </div>
          </section>

          <section className="band blog-list">
            <div className="wrap">
              {featured && (
                <Link to={featured.path} className="post-feature">
                  <PostCover post={featured} className="is-big" />
                  <div className="post-feature-body">
                    <span className="post-card-cat">À la une · {categoryLabel(featured.category)}</span>
                    <h2>{featured.title}</h2>
                    <p>{featured.description}</p>
                    <span className="post-card-meta">Lire l’article · {featured.minutes} min <Icon name="arrow" size={15} stroke={2} /></span>
                  </div>
                </Link>
              )}

              <div className="blog-filter" role="tablist" aria-label="Filtrer par catégorie">
                {[{ id: 'all', label: 'Tous les articles' }, ...cats].map((c) => (
                  <button key={c.id} type="button" role="tab" aria-selected={cat === c.id} className={cat === c.id ? 'is-on' : undefined} onClick={() => setCat(c.id)}>
                    {c.label}
                  </button>
                ))}
              </div>
              {cat !== 'all' && <p className="blog-filter-intro">{CATEGORIES.find((c) => c.id === cat)?.intro}</p>}

              <div className="post-cards">
                {list.map((p) => <PostCard key={p.slug} post={p} />)}
              </div>
            </div>
          </section>

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
