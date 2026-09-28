---
title: "Automatiser le suivi de ses leads avec n8n : 5 automatisations concrètes"
seoTitle: "Automatisation n8n : 5 exemples pour suivre vos leads"
description: "Alerte en moins d'une minute, message au prospect, relances, coût par lead chaque jour, ventes renvoyées à Meta : 5 automatisations n8n qui rapportent."
category: suivi
datePublished: 2026-10-20
draft: true
servicePage: /crm-sur-mesure
ctaTitle: "Qu'est-ce qu'on automatiserait chez vous ?"
ctaText: "Racontez-nous comment un lead arrive et comment il devient client. On vous dit ce qu'on automatiserait, et ce qu'on laisserait tel quel."
related:
  - crm-sur-mesure-ou-logiciel
  - tracking-server-side-api-conversions
  - leads-meta-ads-vs-crm
faq:
  - q: "Qu'est-ce que n8n ?"
    a: "n8n est un outil d'automatisation qui relie vos applications entre elles : quand un événement arrive (une demande sur le site), il enchaîne des actions (l'enregistrer dans le CRM, prévenir l'équipe, envoyer un message). Il peut être hébergé sur votre propre serveur ou utilisé en version hébergée."
  - q: "n8n, Make ou Zapier : lequel choisir ?"
    a: "Les trois font le même travail de base. n8n se distingue parce qu'il peut être hébergé chez vous, ce qui garde les données de vos prospects sur votre serveur, et parce qu'il permet d'écrire du code quand un scénario sort de l'ordinaire. Make et Zapier sont plus simples à prendre en main pour des scénarios courts."
  - q: "Peut-on envoyer des messages WhatsApp automatiques aux prospects ?"
    a: "Oui, par l'API officielle de WhatsApp Business. Il faut l'accord du prospect pour lui écrire sur WhatsApp, recueilli par exemple dans le formulaire, et les messages envoyés à l'initiative de l'entreprise utilisent des modèles validés par Meta. C'est adapté à un message de confirmation après une demande, pas à de la prospection non sollicitée."
  - q: "Faut-il un développeur pour utiliser n8n ?"
    a: "Pour des scénarios simples, non : l'interface se manipule en reliant des blocs. Pour des scénarios qui touchent à l'argent (calcul de coûts, envoi de conversions aux régies), une erreur passe inaperçue longtemps et coûte cher : mieux vaut les faire construire et tester."
---

Automatiser le suivi de ses leads, ce n'est pas remplacer les commerciaux. C'est supprimer ce qui les ralentit : recopier des demandes, oublier une relance, chercher d'où vient un client. **n8n** est l'un des outils qui permettent de le faire : il relie vos applications et enchaîne des actions quand un événement se produit.

Voici cinq automatisations, dans l'ordre où elles rapportent. Chacune est décrite avec son déclencheur, ses étapes et ce qu'elle change.

## Pourquoi automatiser le suivi, et pas autre chose

Une demande perd de sa valeur à chaque heure qui passe. Le particulier qui vient de remplir un formulaire attend un appel, a encore l'offre en tête, et décroche. Le lendemain, il a peut-être déjà parlé à un concurrent.

Or, dans beaucoup d'entreprises, le trajet d'une demande ressemble à ça : un e-mail arrive dans une boîte partagée, quelqu'un le voit en fin de matinée, le recopie dans un tableur, et le commercial rappelle l'après-midi. Rien de dramatique à chaque étape. Beaucoup de temps perdu au total.

Les automatisations qui suivent visent d'abord ce trajet.

## 1. La demande arrive, l'équipe est prévenue en moins d'une minute

**Déclencheur :** une nouvelle demande (formulaire du site, formulaire instantané Meta, formulaire Google).

**Étapes :**

1. n8n reçoit la demande, avec la campagne et l'annonce d'origine.
2. Il vérifie que le numéro n'existe pas déjà dans le CRM. Si oui, il met à jour la fiche au lieu d'en créer une seconde.
3. Il enregistre la demande dans le CRM.
4. Il prévient le commercial de garde, par SMS, WhatsApp ou messagerie d'équipe, avec l'essentiel : nom, projet, délai, commune, et un lien vers la fiche.

**Ce que ça change :** plus aucune demande n'attend dans une boîte e-mail. Le commercial peut rappeler pendant que le prospect a encore l'écran ouvert.

## 2. Le prospect reçoit un message qui prépare l'appel

**Déclencheur :** la demande vient d'être enregistrée.

**Étapes :**

1. n8n envoie au prospect un message court (SMS, WhatsApp ou e-mail) : sa demande est bien reçue, qui va l'appeler, dans quel délai.
2. Si la demande arrive en dehors des heures d'ouverture, le message le dit, et donne l'heure du rappel.

**Ce que ça change :** un prospect prévenu décroche plus volontiers un numéro qu'il ne connaît pas. Et il sait que sa demande n'est pas tombée dans le vide.

Une précision pour WhatsApp : l'envoi automatique passe par l'API officielle de WhatsApp Business, avec l'accord du prospect (une case dans le formulaire) et des modèles de messages validés. C'est fait pour ce genre de confirmation, pas pour de la prospection.

## 3. Les relances qui ne dépendent plus de la mémoire de quelqu'un

**Déclencheur :** chaque matin, n8n passe en revue les leads du CRM.

**Étapes :**

1. Il repère les leads « à rappeler » depuis plus de 24 heures, et les renvoie en tête de liste du commercial.
2. Pour ceux qui n'ont pas décroché deux fois, il envoie un message au prospect proposant de choisir un créneau de rappel.
3. Pour les devis envoyés sans réponse depuis une semaine, il crée une tâche de relance.

**Ce que ça change :** aucune demande ne meurt parce qu'on l'a oubliée. Les commerciaux passent leur temps sur les appels, pas sur le tri.

## 4. Le coût par lead calculé chaque jour, annonce par annonce

C'est l'automatisation qui change le plus la façon de piloter un budget publicitaire.

**Déclencheur :** chaque nuit.

**Étapes :**

1. n8n récupère chez Meta et Google les dépenses de la veille, annonce par annonce.
2. Il les enregistre dans le CRM, à côté des leads arrivés par ces annonces.
3. Le CRM calcule le coût par lead et, quand les statuts sont à jour, le coût par client signé, pour chaque annonce.

**Ce que ça change :** vous ne jugez plus vos campagnes sur les chiffres des plateformes, mais sur les demandes réellement reçues. L'écart peut être énorme : sur une campagne Meta que nous avons suivie de mai à août 2026, Meta annonçait 634 leads et le CRM en avait reçu 293. Le vrai coût par lead était le double de celui affiché ([nous avons détaillé les causes ici](/blog/leads-meta-ads-vs-crm)).

## 5. Les ventes renvoyées à Meta et Google

**Déclencheur :** un commercial passe un lead en « rendez-vous » ou en « signé » dans le CRM.

**Étapes :**

1. n8n récupère l'identifiant de clic enregistré avec le lead à son arrivée.
2. Il envoie la conversion à la plateforme d'origine, depuis le serveur (API de conversions chez Meta, import de conversions chez Google), en respectant le consentement donné par le visiteur.

**Ce que ça change :** les algorithmes n'apprennent plus seulement à trouver des gens qui remplissent des formulaires, mais des gens qui prennent rendez-vous et signent. C'est le levier le plus puissant pour améliorer la qualité des leads sur la durée. Nous l'expliquons en détail dans [tracking server-side et API de conversions](/blog/tracking-server-side-api-conversions).

## En bonus : le point du lundi

**Déclencheur :** chaque lundi matin.

Un message au dirigeant avec les chiffres de la semaine : demandes reçues, rendez-vous, signatures, dépense, coût par lead, coût par client, et l'annonce qui a le mieux marché. Personne n'a besoin d'ouvrir un outil pour savoir où en est l'acquisition.

## Ce qu'il ne faut pas automatiser

- **Le premier appel.** Un robot qui rappelle un prospect ne remplace pas une voix qui répond aux questions.
- **Les décisions de budget.** Couper ou augmenter une campagne automatiquement sur un coût par lead calculé avec dix leads, c'est décider au hasard. Un coût par lead ne se lit pas avant une trentaine de leads ([pourquoi](/blog/cout-par-lead-calcul)).
- **Ce qui n'arrive qu'une fois par mois.** Automatiser une tâche rare coûte plus cher que de la faire.

## n8n, Make ou Zapier ?

Les trois relient des applications et enchaînent des actions. Pour le suivi des leads, n8n a deux avantages : il peut être **hébergé sur votre propre serveur**, ce qui garde les données de vos prospects chez vous, et il permet d'**écrire du code** quand un scénario sort de l'ordinaire (dédoublonnage, calculs de coûts, appels aux API des régies). Make et Zapier sont plus rapides à prendre en main pour des scénarios courts.

Le choix de l'outil compte moins que deux règles :

1. **Chaque automatisation qui touche à l'argent est testée** avec de vraies données avant d'être branchée. Une erreur dans un calcul de coût ou un envoi de conversion peut passer inaperçue des semaines.
2. **Chaque échec prévient quelqu'un.** Une automatisation qui s'arrête en silence, c'est une demande qui n'arrive jamais dans le CRM, et un prospect qui croit vous avoir écrit.

Nous construisons ces automatisations avec n8n et Make, autour d'un [CRM qui relie chaque lead à sa source](/crm-sur-mesure), ou branchées sur l'outil que vous utilisez déjà.

## À retenir

- Automatisez d'abord le trajet de la demande : enregistrement, alerte, message au prospect.
- Les relances automatiques évitent que des demandes meurent par oubli.
- Le coût par lead calculé chaque nuit dans le CRM remplace les chiffres des plateformes.
- Renvoyer les ventes à Meta et Google améliore la qualité des leads sur la durée.
- Testez tout ce qui touche à l'argent, et faites en sorte qu'un échec prévienne quelqu'un.
