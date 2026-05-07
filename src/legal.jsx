import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { KairnMark } from './sections-1.jsx';
import { CONTACT_EMAIL } from './config.js';

// ═════════════════════════════════════════════════════════════
// SHARED LAYOUT — minimal nav, content max-width 760, back link
// ═════════════════════════════════════════════════════════════
function LegalLayout({ title, lastUpdate, children }) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = `${title} · Kairn`;
    return () => { document.title = prevTitle; };
  }, [title]);

  return (
    <div className="kairn">
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        padding: '14px 0',
        background: 'rgba(250,250,250,.78)',
        backdropFilter: 'saturate(140%) blur(14px)',
        WebkitBackdropFilter: 'saturate(140%) blur(14px)',
        borderBottom: '1px solid rgba(237,233,254,.6)',
      }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 max(20px, calc((100vw - 1100px) / 2 + 24px))',
        }}>
          <Link to="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            textDecoration: 'none', color: 'var(--ink)',
          }} aria-label="Kairn — accueil">
            <KairnMark />
            <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 17, fontWeight: 600, letterSpacing: '-0.02em' }}>Kairn</span>
          </Link>
          <Link to="/" style={{
            fontSize: 13, color: 'var(--muted)', textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            ← Retour à l'accueil
          </Link>
        </div>
      </nav>

      <main style={{ padding: '64px 24px 96px', background: 'var(--bg)' }}>
        <article style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '6px 14px 6px 12px', borderRadius: 999, background: '#fff', border: '1px solid var(--line-2)', marginBottom: 18 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--violet)' }} />
            <span className="mono" style={{ fontSize: 11, color: 'var(--violet-deep)', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 500 }}>
              Document légal
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 56px)', letterSpacing: '-0.04em', lineHeight: 1.05, fontWeight: 500, margin: 0 }}>{title}</h1>
          <p className="mono" style={{ fontSize: 12, color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 14, marginBottom: 0 }}>
            Dernière mise à jour&nbsp;: {lastUpdate}
          </p>
          <div className="legal-content" style={{ marginTop: 36, color: 'rgba(31,27,46,.85)', fontSize: 16, lineHeight: 1.7 }}>
            {children}
          </div>

          <div style={{ marginTop: 56, padding: '20px 24px', background: '#F8F5FF', borderRadius: 14, border: '1px solid var(--line-2)', display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 14, color: 'var(--muted)' }}>Une question juridique&nbsp;?</span>
            <a href={`mailto:${CONTACT_EMAIL}?subject=Question%20juridique`} style={{ fontSize: 14, color: 'var(--violet-deep)', fontWeight: 500, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              {CONTACT_EMAIL} →
            </a>
          </div>

          <nav style={{ marginTop: 28, display: 'flex', flexWrap: 'wrap', gap: '8px 18px', justifyContent: 'center', fontSize: 13.5 }}>
            <Link to="/mentions-legales" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Mentions légales</Link>
            <span style={{ color: 'var(--lav)' }}>·</span>
            <Link to="/confidentialite" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Politique de confidentialité</Link>
            <span style={{ color: 'var(--lav)' }}>·</span>
            <Link to="/cgv" style={{ color: 'var(--muted)', textDecoration: 'none' }}>CGV</Link>
          </nav>
        </article>
      </main>

      <style>{`
        .legal-content h2 { font-size: 22px; font-weight: 600; letter-spacing: -0.02em; margin: 40px 0 12px; color: var(--ink); }
        .legal-content h3 { font-size: 17px; font-weight: 600; letter-spacing: -0.012em; margin: 26px 0 8px; color: var(--ink); }
        .legal-content p { margin: 12px 0; }
        .legal-content ul { padding-left: 22px; margin: 12px 0; }
        .legal-content li { margin: 6px 0; }
        .legal-content a { color: var(--violet-deep); text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 3px; }
        .legal-content strong { color: var(--ink); font-weight: 600; }
        .legal-content code { font-family: 'Geist Mono', ui-monospace, monospace; font-size: 14px; background: #F5F3FF; padding: 2px 6px; border-radius: 4px; color: var(--violet-deep); }
        .legal-placeholder { background: #FEF3C7; padding: 1px 6px; border-radius: 4px; color: #92400E; font-size: 14.5px; font-family: 'Geist Mono', ui-monospace, monospace; }
      `}</style>
    </div>
  );
}

const PH = ({ children }) => <code className="legal-placeholder">{children}</code>;

// ═════════════════════════════════════════════════════════════
// 1. MENTIONS LÉGALES (Impressum)
// ═════════════════════════════════════════════════════════════
export function MentionsLegales() {
  return (
    <LegalLayout title="Mentions légales" lastUpdate="6 mai 2026">
      <p>
        Le présent site <strong>kairn.agency</strong> est édité dans le cadre d'une activité indépendante exercée en Suisse romande.
        En vertu du droit suisse (notamment l'art. 3 LCD) et du règlement (UE) 2016/679 (RGPD), les informations suivantes sont mises à votre disposition.
      </p>

      <h2>Éditeur du site</h2>
      <ul>
        <li><strong>Raison sociale&nbsp;:</strong> <PH>[À COMPLÉTER · ex&nbsp;: Kairn — Moshe Chemouni, raison individuelle]</PH></li>
        <li><strong>Forme juridique&nbsp;:</strong> <PH>[À COMPLÉTER · raison individuelle / Sàrl / SA en formation]</PH></li>
        <li><strong>Adresse&nbsp;:</strong> <PH>[À COMPLÉTER · rue, NPA, ville, Suisse]</PH></li>
        <li><strong>Numéro IDE / CHE&nbsp;:</strong> <PH>[À COMPLÉTER · CHE-XXX.XXX.XXX]</PH></li>
        <li><strong>Représentant légal&nbsp;:</strong> Moshe Chemouni, fondateur</li>
        <li><strong>Contact&nbsp;:</strong> <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></li>
      </ul>

      <h2>Directeur de la publication</h2>
      <p>
        Moshe Chemouni, en sa qualité de fondateur. Pour toute demande relative au contenu publié, écrivez à
        {' '}<a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>

      <h2>Hébergement</h2>
      <ul>
        <li><strong>Hébergeur du site&nbsp;:</strong> Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA — datacenter Frankfurt (UE).</li>
        <li><strong>Stockage des données utilisateurs&nbsp;:</strong> Supabase (Postgres) — région Frankfurt (UE).</li>
        <li><strong>Domaine&nbsp;:</strong> géré via <PH>[À COMPLÉTER · ex Infomaniak / Cloudflare]</PH>.</li>
      </ul>

      <h2>Propriété intellectuelle</h2>
      <p>
        L'ensemble du contenu présent sur ce site (textes, visuels, logos, icônes, code) est la propriété exclusive de l'éditeur,
        à l'exception des marques tierces (Meta, Google, etc.) qui appartiennent à leurs détenteurs respectifs et sont mentionnées à titre informatif.
      </p>
      <p>
        Toute reproduction, représentation ou diffusion, totale ou partielle, sans autorisation écrite préalable, est interdite et constitue une contrefaçon
        sanctionnée par les articles 67 ss de la Loi fédérale sur le droit d'auteur (LDA).
      </p>

      <h2>Marques tierces</h2>
      <p>
        Les marques <strong>Meta</strong>, <strong>Facebook</strong>, <strong>Instagram</strong>, <strong>WhatsApp</strong> et <strong>Google</strong> sont des marques déposées de leurs détenteurs respectifs.
        Le statut <em>«&nbsp;Meta Business Partner&nbsp;»</em> mentionné sur ce site désigne une certification officielle attribuée par Meta Platforms, Inc.
      </p>

      <h2>Responsabilité</h2>
      <p>
        L'éditeur s'efforce de fournir des informations exactes et à jour sur ce site. Toutefois, il ne saurait être tenu responsable des erreurs,
        omissions ou résultats qui pourraient découler de l'utilisation des informations qui y figurent. Les performances passées (CPL, taux de conversion,
        nombre de leads) communiquées dans les études de cas ne constituent pas une garantie de résultats futurs.
      </p>

      <h2>Liens hypertextes</h2>
      <p>
        Ce site peut contenir des liens vers des sites tiers. L'éditeur n'exerce aucun contrôle sur leur contenu et décline toute responsabilité quant à
        leurs pratiques de protection des données ou la nature de leurs informations.
      </p>

      <h2>Droit applicable</h2>
      <p>
        Les présentes mentions légales sont régies par le <strong>droit suisse</strong>. Tout litige relatif à leur interprétation ou à leur exécution sera soumis
        à la juridiction exclusive des tribunaux de <PH>[À COMPLÉTER · ex&nbsp;: Lausanne, canton de Vaud]</PH>.
      </p>
    </LegalLayout>
  );
}

// ═════════════════════════════════════════════════════════════
// 2. POLITIQUE DE CONFIDENTIALITÉ (RGPD + nLPD)
// ═════════════════════════════════════════════════════════════
export function Confidentialite() {
  return (
    <LegalLayout title="Politique de confidentialité" lastUpdate="6 mai 2026">
      <p>
        Cette politique décrit comment Kairn collecte, utilise et protège vos données à caractère personnel. Elle s'applique à toute personne qui visite
        le site <strong>kairn.agency</strong>, remplit un formulaire de contact, prend rendez-vous via Calendly ou échange par email avec nous.
      </p>
      <p>
        Le présent document est rédigé en conformité avec la <strong>Loi fédérale sur la protection des données (nLPD, en vigueur depuis le 1er&nbsp;septembre 2023)</strong> et
        avec le <strong>Règlement général sur la protection des données (RGPD — Règlement (UE) 2016/679)</strong>, dans la mesure où ce dernier s'applique aux personnes
        résidant dans l'Union européenne.
      </p>

      <h2>Responsable du traitement</h2>
      <p>
        <strong>Kairn</strong> — <PH>[À COMPLÉTER · raison sociale légale]</PH>, dont les coordonnées figurent dans les{' '}
        <Link to="/mentions-legales">mentions légales</Link>. Pour toute demande relative à vos données personnelles&nbsp;:{' '}
        <a href={`mailto:${CONTACT_EMAIL}?subject=Donn%C3%A9es%20personnelles`}>{CONTACT_EMAIL}</a>.
      </p>

      <h2>Données collectées</h2>
      <p>Selon votre interaction avec le site, nous collectons les catégories de données suivantes&nbsp;:</p>
      <h3>Données fournies via le formulaire de qualification</h3>
      <ul>
        <li>Identité&nbsp;: prénom, nom (facultatif), entreprise (facultatif)</li>
        <li>Coordonnées&nbsp;: adresse email, numéro de téléphone</li>
        <li>Profil business&nbsp;: secteur d'activité, objectif principal, fourchette de budget Meta&nbsp;Ads, projection à 30&nbsp;jours, timing de démarrage</li>
      </ul>
      <h3>Données techniques collectées automatiquement</h3>
      <ul>
        <li>Adresse IP, type de navigateur, système d'exploitation</li>
        <li>Pages visitées, durée de session, source du trafic</li>
        <li>Identifiants UTM (utm_source, utm_campaign, utm_content) lorsque vous arrivez via une campagne</li>
        <li>Identifiants Meta Pixel (fbp, fbc) lorsque vous interagissez avec une publicité Meta</li>
      </ul>

      <h2>Finalités du traitement</h2>
      <ul>
        <li>Répondre à votre demande de contact ou d'audit</li>
        <li>Préparer et personnaliser un audit chiffré de votre potentiel d'acquisition (PDF) avant un éventuel rendez-vous</li>
        <li>Vous proposer un créneau de visioconférence via Calendly</li>
        <li>Mesurer la performance de nos campagnes publicitaires (anonymisé et agrégé)</li>
        <li>Respecter nos obligations légales et comptables</li>
      </ul>

      <h2>Bases légales</h2>
      <ul>
        <li><strong>Consentement</strong> (art. 6 RGPD §1.a / art. 31 nLPD)&nbsp;: en remplissant le formulaire et en cochant les cases requises, vous consentez expressément au traitement de vos données pour les finalités décrites ci-dessus.</li>
        <li><strong>Intérêt légitime</strong> (art. 6 RGPD §1.f / art. 31 nLPD)&nbsp;: pour les mesures techniques de sécurité, anti-fraude et amélioration du service.</li>
        <li><strong>Exécution contractuelle</strong> (art. 6 RGPD §1.b)&nbsp;: lorsqu'une mission est engagée, certaines données sont nécessaires à l'exécution du contrat.</li>
      </ul>

      <h2>Sous-traitants et destinataires</h2>
      <p>Vos données peuvent être partagées avec les prestataires techniques suivants, tous liés à Kairn par un accord de traitement&nbsp;:</p>
      <ul>
        <li><strong>Vercel Inc.</strong> (hébergement web) — datacenter Frankfurt, Allemagne (UE)</li>
        <li><strong>Supabase</strong> (base de données PostgreSQL et stockage) — région Frankfurt, Allemagne (UE)</li>
        <li><strong>Meta Platforms Ireland Ltd.</strong> (mesure publicitaire via Meta Pixel et Conversions API) — UE</li>
        <li><strong>Calendly LLC</strong> (prise de rendez-vous) — USA, sous Standard Contractual Clauses (SCC)</li>
        <li><strong>Google Ireland Ltd.</strong> (analyse d'audience le cas échéant) — UE</li>
      </ul>
      <p>Aucune donnée n'est revendue à des tiers à des fins commerciales.</p>

      <h2>Transferts hors UE/Suisse</h2>
      <p>
        Lorsque des données sont transférées vers des prestataires établis aux États-Unis (notamment Calendly), ces transferts sont encadrés par les{' '}
        <strong>Clauses Contractuelles Types (SCC) de la Commission européenne</strong> et, le cas échéant, par le <strong>EU-US Data Privacy Framework</strong>.
      </p>

      <h2>Durée de conservation</h2>
      <ul>
        <li>Leads non convertis&nbsp;: <strong>36&nbsp;mois</strong> à compter du dernier contact, puis suppression automatique.</li>
        <li>Clients actifs&nbsp;: durée de la relation contractuelle + 10 ans pour respecter les obligations comptables suisses (art.&nbsp;958f CO).</li>
        <li>Cookies techniques&nbsp;: 13 mois maximum.</li>
        <li>Données de mesure publicitaire (Meta Pixel)&nbsp;: 90 jours.</li>
      </ul>

      <h2>Vos droits</h2>
      <p>Conformément à la nLPD et au RGPD, vous disposez à tout moment des droits suivants sur vos données&nbsp;:</p>
      <ul>
        <li>Droit d'<strong>accès</strong>&nbsp;: obtenir une copie des données vous concernant</li>
        <li>Droit de <strong>rectification</strong>&nbsp;: corriger des données inexactes</li>
        <li>Droit à l'<strong>effacement</strong> («&nbsp;droit à l'oubli&nbsp;»)&nbsp;: demander la suppression de vos données</li>
        <li>Droit d'<strong>opposition</strong>&nbsp;: refuser certains traitements (notamment le marketing)</li>
        <li>Droit à la <strong>portabilité</strong>&nbsp;: récupérer vos données dans un format structuré</li>
        <li>Droit de <strong>retrait du consentement</strong> à tout moment, sans affecter les traitements antérieurs</li>
      </ul>
      <p>
        Pour exercer l'un de ces droits, écrivez à{' '}
        <a href={`mailto:${CONTACT_EMAIL}?subject=Exercice%20de%20droit%20RGPD%2FnLPD`}>{CONTACT_EMAIL}</a>{' '}
        en précisant la nature de votre demande. Une réponse vous sera apportée dans un délai maximum de <strong>30&nbsp;jours</strong>.
      </p>
      <p>
        Vous avez également le droit d'introduire une réclamation auprès du <strong>Préposé fédéral à la protection des données et à la transparence (PFPDT, Berne)</strong> ou,
        si vous êtes résident de l'UE, auprès de l'autorité de contrôle de votre pays de résidence.
      </p>

      <h2>Cookies et traceurs</h2>
      <p>Le site utilise les cookies suivants&nbsp;:</p>
      <ul>
        <li><strong>Cookies techniques (essentiels)</strong> — fonctionnement du site, sauvegarde du formulaire en cours&nbsp;: pas de consentement requis.</li>
        <li><strong>Meta Pixel (_fbp, _fbc)</strong> — mesure des conversions publicitaires Meta. Activé uniquement si vous arrivez via une publicité ou consentez explicitement.</li>
        <li><strong>UTM tags</strong> (utm_source, utm_campaign, utm_content)&nbsp;: paramètres d'URL non-cookies, utilisés pour attribuer la source du trafic.</li>
      </ul>

      <h2>Sécurité</h2>
      <p>
        Toutes les communications avec le site sont chiffrées en HTTPS (TLS 1.3). Les données sont stockées dans des bases sécurisées en UE (Frankfurt),
        avec accès restreint et journalisé. Aucun traitement automatisé entièrement automatisé produisant un effet juridique n'est mis en œuvre.
      </p>

      <h2>Modifications</h2>
      <p>
        Cette politique peut être mise à jour pour refléter les évolutions de notre activité ou de la législation. La date de la dernière mise à jour
        figure en haut de ce document. En cas de modification substantielle, vous serez informé par un avis visible sur le site.
      </p>
    </LegalLayout>
  );
}

// ═════════════════════════════════════════════════════════════
// 3. CONDITIONS GÉNÉRALES DE VENTE (CGV)
// ═════════════════════════════════════════════════════════════
export function CGV() {
  return (
    <LegalLayout title="Conditions générales de vente" lastUpdate="6 mai 2026">
      <p>
        Les présentes Conditions Générales de Vente (ci-après «&nbsp;CGV&nbsp;») régissent toute prestation fournie par <strong>Kairn</strong>{' '}
        (ci-après «&nbsp;le Prestataire&nbsp;») à un client professionnel (ci-après «&nbsp;le Client&nbsp;») dans le cadre de l'offre tout-en-un{' '}
        <em>création de landing page + lancement et gestion mensuelle des campagnes Meta&nbsp;Ads</em>.
      </p>
      <p>
        Toute commande passée auprès du Prestataire emporte acceptation pleine et entière des présentes CGV, qui prévalent sur tout autre document du Client,
        sauf accord écrit contraire.
      </p>

      <h2>1. Objet</h2>
      <p>Le Prestataire propose une offre standardisée comprenant&nbsp;:</p>
      <ul>
        <li>La <strong>création d'une landing page sur-mesure</strong> (design, développement, hébergement, tracking serveur)</li>
        <li>Le <strong>lancement complet des campagnes Meta&nbsp;Ads</strong> (et Google&nbsp;Ads le cas échéant)&nbsp;: configuration du Pixel, audiences, créas, calibrage du budget</li>
        <li>La <strong>gestion mensuelle</strong> des campagnes&nbsp;: optimisation continue, A/B testing, reporting hebdomadaire, point mensuel</li>
        <li>L'accès à un <strong>dashboard client temps réel</strong> avec CRM intégré offert</li>
      </ul>

      <h2>2. Tarifs</h2>
      <p>Les tarifs publics du Prestataire sont les suivants, libellés en francs suisses (CHF), TVA non incluse&nbsp;:</p>
      <ul>
        <li><strong>Lancement (one-shot)&nbsp;:</strong> à partir de <strong>CHF 2'490</strong> — facturé à la signature, comprenant la création de la landing page et le setup complet des campagnes.</li>
        <li><strong>Pilotage mensuel&nbsp;:</strong> à partir de <strong>CHF 590/mois</strong> — facturé chaque début de mois calendaire, comprenant la gestion, l'optimisation et le reporting.</li>
      </ul>
      <p>
        Le <strong>budget publicitaire</strong> versé directement aux régies (Meta, Google) est <em>en sus</em> des honoraires du Prestataire.
        Il est réglé directement par le Client à la régie, qui en garde le contrôle intégral.
      </p>
      <p>
        Le Prestataire se réserve le droit d'ajuster ses tarifs au-delà de cette fourchette pour des prestations sortant du cadre standard, après devis écrit accepté par le Client.
      </p>

      <h2>3. Modalités de paiement</h2>
      <ul>
        <li><strong>Lancement&nbsp;:</strong> 100&nbsp;% à la signature, par virement bancaire sous 7&nbsp;jours.</li>
        <li><strong>Pilotage mensuel&nbsp;:</strong> facturé en début de mois, payable sous 14&nbsp;jours par virement bancaire ou prélèvement automatique.</li>
        <li>Toute facture impayée à l'échéance entraîne, sans mise en demeure préalable, l'application d'<strong>intérêts moratoires de 5&nbsp;%</strong> par an conformément à l'art.&nbsp;104 du Code des obligations suisse.</li>
        <li>En cas de défaut de paiement persistant, le Prestataire se réserve le droit de suspendre la prestation après mise en demeure non honorée sous 10&nbsp;jours.</li>
      </ul>

      <h2>4. Délais d'exécution</h2>
      <p>
        Le Prestataire s'engage à mettre en ligne la landing page et à activer les campagnes Meta&nbsp;Ads dans un délai de <strong>7&nbsp;jours ouvrés</strong> à compter de la
        validation du brief par le Client. Le premier rendez-vous qualifié est typiquement obtenu sous 14&nbsp;jours après la mise en ligne.
      </p>
      <p>
        Ces délais sont indicatifs et conditionnés à la fourniture par le Client des éléments nécessaires (textes, visuels, accès, validations) dans les temps impartis.
        Tout retard imputable au Client décale le délai de livraison à due concurrence.
      </p>

      <h2>5. Engagement et résiliation</h2>
      <ul>
        <li>Le Pilotage mensuel est conclu pour une durée minimale de <strong>90&nbsp;jours</strong> à compter de la mise en ligne, période nécessaire à l'optimisation des campagnes et à l'atteinte des seuils de performance.</li>
        <li>Au-delà de cette période, le contrat se reconduit tacitement pour des périodes mensuelles, résiliables à tout moment moyennant un <strong>préavis de 30&nbsp;jours</strong> par email à <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</li>
        <li>En cas de résiliation par le Client avant la fin de la période minimale de 90&nbsp;jours, les mois restants restent dus.</li>
        <li>Le Prestataire peut résilier la mission avec préavis de 30&nbsp;jours en cas de désaccord stratégique majeur ou d'indisponibilité du Client.</li>
      </ul>

      <h2>6. Propriété des assets</h2>
      <p>Sauf accord contraire, le Client devient <strong>propriétaire de l'intégralité des livrables</strong> à l'issue du paiement intégral, à savoir&nbsp;:</p>
      <ul>
        <li>Le code source de la landing page (livré dans un dépôt Git accessible au Client)</li>
        <li>Les comptes <strong>Meta Business Manager</strong> et <strong>Google Ads</strong>, créés au nom du Client</li>
        <li>Les automatisations, dashboards et données collectées dans le CRM intégré</li>
      </ul>
      <p>
        Pendant la durée de la mission, le Prestataire dispose des accès nécessaires à l'exécution. À la fin de la mission, ces accès sont restitués
        sous 7&nbsp;jours et l'ensemble des assets reste la propriété du Client. Aucune clause de non-concurrence n'est imposée au Client.
      </p>

      <h2>7. Obligations du Client</h2>
      <ul>
        <li>Fournir, dans les délais convenus, les éléments nécessaires à la mission (informations, accès, validations).</li>
        <li>Respecter le budget publicitaire convenu et alimenter directement les régies (Meta, Google) selon les modalités convenues.</li>
        <li>S'assurer du respect des règles publicitaires des plateformes (notamment les Standards de la Communauté Meta, les Politiques Google Ads) pour les contenus qu'il fournit.</li>
        <li>Disposer des droits sur tous les contenus (textes, images, marques) qu'il transmet au Prestataire.</li>
      </ul>

      <h2>8. Garanties et limitation de responsabilité</h2>
      <p>
        Le Prestataire fournit les prestations dans les règles de l'art et selon une <strong>obligation de moyens</strong>. Aucun résultat chiffré (nombre de leads, CPL, taux de conversion)
        n'est garanti, ces indicateurs dépendant de facteurs hors du contrôle exclusif du Prestataire (qualité du marché, saisonnalité, concurrence, contenus du Client, budget alloué).
      </p>
      <p>
        Les performances passées présentées dans les études de cas sont communiquées à titre indicatif et ne constituent pas une promesse de résultat.
      </p>
      <p>
        La responsabilité du Prestataire est, en tout état de cause, <strong>limitée au montant des honoraires perçus sur les 3&nbsp;derniers mois</strong> précédant le fait générateur du dommage.
        Sont exclus tout dommage indirect, perte de clientèle, perte de chiffre d'affaires ou perte de données ne résultant pas directement de la prestation du Prestataire.
      </p>

      <h2>9. Confidentialité</h2>
      <p>
        Le Prestataire s'engage à conserver strictement confidentielles toutes les informations techniques, commerciales et stratégiques portées à sa connaissance dans le cadre de la mission.
        Cette obligation perdure 5&nbsp;ans après la fin du contrat. Le Prestataire peut toutefois mentionner le nom et le logo du Client à titre de référence, sauf opposition écrite du Client.
      </p>

      <h2>10. Données personnelles</h2>
      <p>
        Le traitement des données personnelles est encadré par la <Link to="/confidentialite">Politique de confidentialité</Link>, qui fait partie intégrante des présentes CGV.
        Lorsque le Prestataire agit en qualité de sous-traitant au sens du RGPD/nLPD pour le compte du Client, un accord de traitement spécifique peut être annexé sur demande.
      </p>

      <h2>11. Modifications</h2>
      <p>
        Les présentes CGV peuvent être mises à jour à tout moment. La version applicable est celle en vigueur à la date de signature de l'engagement.
        Les évolutions ultérieures s'appliquent aux nouveaux contrats et, pour les contrats en cours, après notification au Client et délai d'opposition de 30&nbsp;jours.
      </p>

      <h2>12. Droit applicable et juridiction</h2>
      <p>
        Les présentes CGV sont soumises au <strong>droit suisse</strong>, à l'exclusion des règles de conflit de lois. Tout litige relatif à leur formation, leur exécution
        ou leur interprétation relèvera de la <strong>juridiction exclusive des tribunaux de <PH>[À COMPLÉTER · ex&nbsp;: Lausanne, canton de Vaud]</PH></strong>,
        sous réserve des règles impératives de protection du consommateur.
      </p>
      <p>
        Les parties s'efforceront, préalablement à toute action judiciaire, de résoudre tout différend à l'amiable.
      </p>
    </LegalLayout>
  );
}
