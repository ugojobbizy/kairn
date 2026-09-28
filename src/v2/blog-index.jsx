import React from 'react';
import { MotionConfig, motion } from 'framer-motion';
import { Nav, Footer, BookCta, useV2Favicon } from './layout.jsx';
import Booking from './booking.jsx';
import { EASE, Pill, Glow, Reveal } from './blocks.jsx';
import { PostCard } from './article.jsx';
import { POSTS } from '../blog/generated/index.js';
import { CATEGORIES } from '../blog/meta.js';
import './v2.css';
import './blog.css';

// Page d'accueil du blog (/blog) : les articles rangés par catégorie.

export default function BlogIndex() {
  useV2Favicon();
  const groups = CATEGORIES.map((c) => ({ ...c, posts: POSTS.filter((p) => p.category === c.id) })).filter((g) => g.posts.length);

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
              {groups.length > 1 && (
                <nav className="blog-cats" aria-label="Catégories">
                  {groups.map((g) => <a key={g.id} href={`#${g.id}`}>{g.label}</a>)}
                </nav>
              )}
            </div>
          </section>

          {groups.map((g) => (
            <section key={g.id} id={g.id} className="band blog-group">
              <div className="wrap">
                <div className="blog-group-head">
                  <h2>{g.label}</h2>
                  <p>{g.intro}</p>
                </div>
                <div className="post-cards">
                  {g.posts.map((p) => <PostCard key={p.slug} post={p} />)}
                </div>
              </div>
            </section>
          ))}

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
