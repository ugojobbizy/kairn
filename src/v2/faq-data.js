// Questions fréquentes de l'accueil. Partagées avec le script SEO (données structurées FAQPage),
// pour que le balisage Google reste identique au texte affiché.
export const FAQ = [
  ['Quel est votre délai de démarrage ?', 'Sous 5 jours ouvrés après l’appel de cadrage. Les campagnes peuvent démarrer en 48 h si le tracking est déjà en place.'],
  ['Faut-il forcément refaire mon site ?', 'Non. On regarde d’abord ce qui existe. Si votre page convertit, on branche les campagnes dessus. Sinon, on construit une landing dédiée à l’offre, sans toucher au reste du site.'],
  ['Travaillez-vous avec un engagement minimum ?', 'Non. La mise en place est au forfait, l’acquisition au mois reconductible. Vous pouvez partir à tout moment avec un préavis de 30 jours.'],
  ['Garantie de résultat ?', 'On s’engage sur des fourchettes chiffrées à l’audit, pas sur des promesses marketing. Si les objectifs ne sont pas atteints à 90 jours, on ajuste le plan à nos frais.'],
  ['Quels outils utilisez-vous ?', 'Côté acquisition : Meta, Google, LinkedIn, TikTok. Côté build : React, Next.js, Supabase, n8n, Make. On choisit selon votre contexte, pas selon nos habitudes.'],
];

// Questions de la page « Génération de leads » (même usage : affichage et données structurées).
export const FAQ_LEADS = [
  ['Qu’est-ce qu’un lead qualifié ?', 'Une demande qui arrive avec de quoi décider : le projet, le besoin, le délai, et un moyen fiable de recontacter la personne. Les questions de qualification se définissent avec vous, selon ce qui fait signer dans votre métier.'],
  ['Meta Ads ou Google Ads : lequel choisir ?', 'Google capte les personnes qui cherchent déjà votre service. Meta va chercher celles qui ne cherchent pas encore mais ressemblent à vos clients. On choisit à l’audit selon votre offre et votre marge, et on combine souvent les deux.'],
  ['Pourquoi un CRM sur mesure ?', 'Parce qu’un lead n’a de valeur que s’il est suivi. Le CRM relie chaque demande à sa campagne, à son annonce et à son coût, puis suit le rappel jusqu’à la signature. C’est ce qui permet de couper les pubs qui ramènent des leads qui ne signent pas.'],
  ['Faut-il forcément refaire mon site ?', 'Non. On regarde d’abord ce qui existe. Si votre page convertit, on branche les campagnes dessus. Sinon, on construit une landing dédiée à l’offre, sans toucher au reste du site.'],
  ['Quel est votre délai de démarrage ?', 'Sous 5 jours ouvrés après l’appel de cadrage. Les campagnes peuvent démarrer en 48 h si le tracking est déjà en place.'],
  ['Travaillez-vous seulement à Bordeaux ?', 'Non. Kairn est basé à Bordeaux, mais on travaille avec des entreprises partout en France, et au-delà : TradeAuto est en Suisse. Tout se fait en visio.'],
];

// Questions de la page « Création de site internet ». Délais, code et support repris de l'ancienne page Build.
export const FAQ_WEB = [
  ['Quel est le délai de livraison ?', 'Entre 2 et 4 semaines pour une landing page ou un tunnel, 6 à 8 semaines pour une plateforme. Les projets plus longs sont découpés en étapes livrables de 4 semaines maximum.'],
  ['À qui appartient le code après la livraison ?', 'À vous, entièrement. Il est déposé sur votre compte GitHub dès le départ, sans clause de propriété intellectuelle ni abonnement obligatoire.'],
  ['Faut-il héberger le site chez vous ?', 'Non. On vous livre le code et la documentation de déploiement, vous hébergez où vous voulez. Si vous préférez ne pas vous en occuper, on peut gérer l’hébergement pour vous.'],
  ['Mon site sera-t-il bien référencé sur Google ?', 'Chaque page est livrée avec son titre, sa description, le balisage lu par Google et un sitemap, et elle est pensée d’abord pour le téléphone. Le référencement se construit ensuite avec le contenu et les avis.'],
  ['Pouvez-vous reprendre un site existant ?', 'Oui. On commence par un audit technique de 2 à 5 jours selon la taille, puis on propose un plan : ce qu’on garde, ce qu’on migre, ce qu’on refait.'],
  ['Offrez-vous du support après la livraison ?', 'Oui, 30 jours de support sont inclus : bugs, ajustements, questions. Au-delà, on propose un suivi mensuel de maintenance ou d’évolution, sans engagement.'],
];

// Questions de la page « Création de landing page ». Délai, textes, A/B testing et hébergement repris du pack Landing de l'ancienne page Build.
export const FAQ_LP = [
  ['Quelle différence entre un site et une landing page ?', 'Un site présente toute l’entreprise. Une landing page ne porte qu’une offre et un objectif : obtenir la demande. C’est la page vers laquelle on envoie une campagne publicitaire.'],
  ['Combien de temps faut-il pour créer une landing page ?', 'Deux semaines en moyenne, de l’appel de cadrage à la mise en ligne. Les maquettes et les textes sont validés avec vous avant le développement.'],
  ['Les textes sont-ils inclus ?', 'Oui. On rédige les textes à partir de ce que disent vos clients et de ce qui fait signer dans votre métier. Vous validez avant la mise en ligne.'],
  ['Pouvez-vous la brancher sur mes campagnes actuelles ?', 'Oui. On installe le tracking serveur Meta et GA4 et on connecte le formulaire à votre CRM ou à votre email. Vos campagnes peuvent pointer vers la nouvelle page dès sa mise en ligne.'],
  ['Peut-on tester plusieurs versions de la page ?', 'Oui, l’A/B testing est configuré dès la mise en ligne. On compare les versions sur le coût par lead et la qualité des demandes, pas seulement sur les clics.'],
  ['Où la page est-elle hébergée ?', 'L’hébergement est inclus pendant 6 mois. Ensuite, vous l’hébergez où vous voulez, ou on continue de s’en occuper. Le code vous appartient dans tous les cas.'],
];

// Questions de la page « CRM et outils sur mesure ». Délais, intégrations et support repris de l'ancienne page Build et des cas clients.
export const FAQ_CRM = [
  ['Pourquoi un CRM sur mesure plutôt que HubSpot ou Pipedrive ?', 'Un CRM du marché convient quand votre vente suit un schéma standard. Le sur mesure prend le relais quand vous voulez relier chaque vente à la pub qui l’a amenée, suivre des étapes propres à votre métier ou ne plus payer par utilisateur.'],
  ['Pouvez-vous connecter l’outil que j’utilise déjà ?', 'Oui. Si vous êtes sur HubSpot, Pipedrive ou Attio, on peut s’y brancher plutôt que tout remplacer : formulaires, relances et reporting remontent dans votre outil actuel.'],
  ['Comment fonctionne l’attribution des leads ?', 'Chaque lead est enregistré avec sa source, sa campagne et son annonce. Les dépenses publicitaires sont synchronisées chaque jour : le CRM calcule le coût par lead et le coût par vente, campagne par campagne.'],
  ['Combien de temps faut-il pour le mettre en place ?', 'Quelques semaines. Chez TradeAuto, le site, le CRM et le tableau de bord ont été livrés en 4 semaines. Une plateforme plus complète demande 6 à 8 semaines.'],
  ['À qui appartiennent le code et les données ?', 'À vous. Le code est déposé sur votre compte GitHub, et vos données restent les vôtres : vous pouvez les exporter à tout moment.'],
  ['Mon équipe va-t-elle s’en servir ?', 'C’est pour ça qu’on construit les écrans avec elle. À la mise en service, une heure de prise en main est incluse, puis 30 jours de support pour les ajustements.'],
];
