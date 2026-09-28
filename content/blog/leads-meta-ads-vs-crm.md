---
title: "Pourquoi Meta compte deux fois plus de leads que votre CRM"
seoTitle: "Leads Meta Ads et CRM : pourquoi les chiffres ne collent pas"
description: "Meta annonçait 634 leads, le CRM en avait 293. Les 6 causes de cet écart, comment les vérifier en 30 minutes, et pourquoi il faut piloter sur le CRM."
category: suivi
datePublished: 2026-09-28
servicePage: /crm-sur-mesure
ctaTitle: "Vos chiffres Meta et votre CRM ne collent pas ?"
ctaText: "On compare vos leads Meta et vos leads réels, jour par jour, et on vous montre d'où vient l'écart. 30 minutes, en visio."
related:
  - cout-par-lead-calcul
  - landing-page-ou-site-vitrine
  - acheter-des-leads-renovation-energetique
faq:
  - q: "Est-ce normal que Meta affiche plus de leads que mon CRM ?"
    a: "Un petit écart, oui : Meta et votre CRM ne comptent pas la même chose ni au même moment. Un écart du simple au double mérite une vérification : il signale souvent un événement mal placé, un doublon ou des demandes qui n'arrivent jamais dans le CRM."
  - q: "Quel chiffre faut-il utiliser pour calculer son coût par lead ?"
    a: "Celui du CRM, c'est-à-dire les demandes réellement reçues et exploitables. Le chiffre de Meta sert à comparer les annonces entre elles dans Meta, pas à juger la rentabilité d'une campagne."
  - q: "L'API de conversions Meta règle-t-elle le problème ?"
    a: "Elle règle une partie du problème : les conversions perdues à cause des bloqueurs et des navigateurs qui limitent le suivi. Mal configurée, sans dédoublonnage avec le pixel, elle peut au contraire doubler les événements."
  - q: "Comment relier chaque lead du CRM à l'annonce Meta qui l'a amené ?"
    a: "En enregistrant avec chaque demande les paramètres de l'adresse de la page (campagne, ensemble de publicités, annonce) et l'identifiant de clic Meta. Il suffit ensuite de rapprocher ces leads des dépenses de chaque annonce pour obtenir un vrai coût par lead, annonce par annonce."
---

De mai à août 2026, une campagne Meta Ads que nous pilotions pour une entreprise d'isolation par l'extérieur a produit **634 leads comptés par Meta**. Sur la même période, son CRM en a enregistré **293**. Plus de deux fois moins.

La réponse courte : Meta compte des **événements** qu'il attribue à ses publicités, votre CRM compte des **demandes** reçues. Ce ne sont pas les mêmes objets. Et c'est le second chiffre qui paie vos factures.

Cet article explique d'où vient ce genre d'écart, comment trouver la cause chez vous en une demi-heure, et pourquoi le chiffre de Meta ne doit jamais servir à décider d'un budget.

## Ce que l'écart change concrètement

Sur ces quatre mois, la campagne a dépensé 3 345,51 €. Selon la source retenue, le coût par lead n'est pas du tout le même :

| | Leads comptés | Coût par lead |
|---|---|---|
| Leads comptés par Meta | 634 | 5,28 € |
| CRM (demandes réellement reçues) | 293 | 11,42 € |

Calculé sur les leads de Meta, le coût par lead était **deux fois plus bas que la réalité**. Une entreprise qui pilote sur ce chiffre prend trois mauvaises décisions :

- **Elle garde des annonces qui ne rapportent rien.** Une annonce peut déclencher beaucoup d'événements « lead » sans produire une seule demande exploitable.
- **Elle se croit rentable alors qu'elle ne l'est pas.** Si votre coût par lead maximum est de 8 €, la campagne semble gagnante à 5,28 € et perd de l'argent à 11,42 €. (Pour calculer ce seuil chez vous, voir [notre article sur le coût par lead](/blog/cout-par-lead-calcul).)
- **Elle entraîne mal l'algorithme.** On y revient plus bas : c'est la conséquence la plus coûteuse, et la moins visible.

Dans cette campagne, le coût par lead a été suivi sur les leads du CRM, mois par mois : 19,43 € en juin, 9,92 € en juillet, 5,49 € en août. Ce sont ces chiffres, et pas ceux de Meta, qui disent ce que la campagne a vraiment coûté.

## Ce que Meta appelle un « lead »

Pour Meta, un lead est un **événement de conversion** : un signal envoyé par votre site (via le pixel ou l'API de conversions) ou par un formulaire instantané Meta, puis **attribué** à une publicité.

Deux mots comptent dans cette définition.

**« Événement »** : Meta compte ce qu'on lui envoie. Si le signal part au mauvais moment, deux fois, ou pour une demande qui n'aboutit pas, Meta le compte quand même. Il n'a aucun moyen de savoir que la demande n'est jamais arrivée chez vous.

**« Attribué »** : par défaut, Meta s'attribue une conversion survenue jusqu'à 7 jours après un clic sur une publicité, ou 1 jour après une simple vue. Il la range au jour de l'impression ou du clic, pas au jour de la demande. Votre CRM, lui, enregistre la demande le jour où elle arrive, quelle que soit son origine.

Ces deux différences expliquent un décalage limité. Pour un écart du simple au double, il faut aussi regarder du côté des six causes suivantes. Sur la campagne citée plus haut, nous n'avons pas établi la part de chacune : l'article décrit ce qu'il faut vérifier, pas un diagnostic de ce cas.

## Les 6 causes d'un écart du simple au double

### 1. L'événement « Lead » part au mauvais moment

C'est la cause la plus fréquente sur les formulaires en plusieurs étapes. L'événement est déclenché au clic sur « Suivant » de la première étape, ou à l'affichage de la page, au lieu de l'envoi final. Chaque visiteur qui commence le formulaire devient un « lead » pour Meta, même s'il abandonne à l'étape 2.

L'ordre de grandeur de la perte est connu : sur une autre campagne que nous avons menée, 31 personnes ont commencé le formulaire et 3 l'ont envoyé. Un événement placé au démarrage aurait compté dix fois trop de leads.

**Comment vérifier :** dans le Gestionnaire d'événements, ouvrez l'outil de test des événements, remplissez votre formulaire sans l'envoyer, et regardez si un événement « Lead » apparaît.

### 2. Le même lead est compté deux fois

Si votre site envoie l'événement à la fois par le pixel (depuis le navigateur) et par l'API de conversions (depuis le serveur), Meta doit savoir que c'est la même demande. Il faut pour ça un **identifiant d'événement commun** aux deux envois. Sans lui, chaque demande compte double.

**Comment vérifier :** dans le Gestionnaire d'événements, l'onglet de l'événement « Lead » indique si les événements du navigateur et du serveur sont dédoublonnés.

### 3. La page de remerciement déclenche l'événement

Quand l'événement « Lead » est déclenché par l'affichage de la page de remerciement, chaque rechargement, retour arrière ou visite directe de cette page crée un lead de plus. Un visiteur qui garde l'onglet ouvert et le rouvre le lendemain en crée un autre.

**Comment vérifier :** ouvrez votre page de remerciement directement, sans remplir le formulaire. Si un événement « Lead » part, vous tenez une cause.

### 4. Des demandes n'arrivent jamais dans le CRM

L'événement part côté navigateur, mais l'enregistrement échoue côté serveur : champ refusé, numéro de téléphone mal formaté, service d'envoi en panne, outil d'automatisation arrêté. Meta a compté la demande, votre CRM ne l'a jamais reçue. Et le prospect, lui, croit vous avoir écrit.

C'est la cause la plus grave des six, parce que ce sont de vrais prospects qui sont perdus.

**Comment vérifier :** envoyez trois demandes de test avec des numéros de formats différents (avec espaces, avec +33, sans le 0) et vérifiez qu'elles arrivent toutes dans le CRM.

### 5. Les formulaires instantanés et les doublons

Avec les formulaires instantanés de Meta (le formulaire qui s'ouvre dans Facebook ou Instagram, sans passer par votre site), une même personne peut envoyer plusieurs fois le formulaire, depuis deux annonces différentes. Meta compte chaque envoi. Un CRM bien fait fusionne les doublons sur le téléphone ou l'e-mail, et ne garde qu'une personne.

Si ces leads ne sont pas synchronisés automatiquement avec votre CRM, une partie reste simplement dans l'espace de Meta, où personne ne va les chercher.

**Comment vérifier :** téléchargez les leads du formulaire instantané pour une semaine et comptez les numéros en double.

### 6. Les conversions estimées

Quand une partie des visiteurs refuse le suivi (notamment sur iPhone, ou quand les cookies sont refusés), Meta **estime** une partie des conversions qu'il ne peut plus observer. Ces conversions modélisées apparaissent dans les rapports sans correspondre à une demande identifiable. Leur poids est variable, et Meta ne le détaille pas publicité par publicité.

**Comment vérifier :** on ne peut pas les isoler finement. C'est une raison de plus de juger une campagne sur les demandes réellement reçues.

## Comment trouver la cause chez vous, en 30 minutes

1. **Exportez les leads Meta jour par jour** sur les 30 derniers jours (colonnes : jour, résultats).
2. **Exportez les demandes de votre CRM** sur la même période, jour par jour, en ne gardant que celles qui viennent de Meta.
3. **Mettez les deux séries côte à côte.** Un écart constant (par exemple toujours autour du double) oriente vers un problème de déclenchement : causes 1, 2 ou 3. Un écart qui apparaît à partir d'une date précise oriente vers une panne : cause 4.
4. **Faites les tests décrits plus haut**, avec l'outil de test des événements ouvert.
5. **Corrigez, puis comparez à nouveau** une semaine plus tard. L'écart ne tombera jamais à zéro, à cause de l'attribution. Il doit devenir petit et stable.

## Pourquoi un événement faux coûte plus cher qu'un rapport faux

Un rapport faux, on peut le corriger à la main dans un tableur. Un événement faux, non : il entraîne l'algorithme.

Quand vous demandez à Meta d'optimiser vos campagnes sur l'événement « Lead », il cherche les personnes les plus susceptibles de déclencher cet événement. Si l'événement part au démarrage du formulaire, Meta apprend à trouver des gens qui **commencent** des formulaires. Pas des gens qui les envoient, encore moins des gens qui signent.

Plus la campagne tourne, plus elle devient efficace pour produire des événements sans valeur. Le coût par lead affiché baisse, le nombre de vraies demandes stagne ou recule. C'est exactement le moment où beaucoup d'entreprises augmentent le budget.

La correction est simple sur le principe : **l'événement envoyé à Meta doit correspondre à une demande enregistrée**. Le plus fiable est de l'envoyer depuis le serveur, au moment où le CRM enregistre la demande, avec l'API de conversions.

## La règle : piloter sur le CRM, lead par lead

Le chiffre de Meta reste utile pour une seule chose : comparer des annonces entre elles, à l'intérieur de Meta. Pour tout le reste (budget, rentabilité, choix d'une annonce à couper), la référence est le CRM.

Encore faut-il que le CRM sache d'où vient chaque lead. Concrètement, chaque demande doit arriver avec :

- **la campagne, l'ensemble de publicités et l'annonce**, lus dans l'adresse de la page (les paramètres UTM) ;
- **l'identifiant de clic Meta**, qui permet de renvoyer la conversion à Meta depuis le serveur ;
- **la date et l'heure réelles** de la demande.

Il suffit ensuite de synchroniser chaque jour les dépenses de chaque annonce avec le CRM pour obtenir un coût par lead **réel**, annonce par annonce. Puis, quand vos commerciaux mettent à jour le statut des leads (joint, rendez-vous, devis, signé), un coût par client signé, par annonce.

C'est ce que nous construisons pour nos clients : un [CRM qui relie chaque lead à la publicité qui l'a amené](/crm-sur-mesure) et à la vente qu'il a rapportée. Sur la campagne décrite plus haut, c'est en comparant les deux sources que l'écart est apparu : le chiffre de Meta seul ne l'aurait pas montré.

## À retenir

- Meta compte des événements attribués à ses publicités. Votre CRM compte des demandes reçues. Les deux chiffres ne seront jamais égaux.
- Un petit écart est normal. Un écart du simple au double mérite une vérification, en commençant par les six causes ci-dessus.
- Le coût par lead se calcule avec les leads du CRM. Sur notre exemple, le chiffre de Meta le sous-estimait de moitié.
- Un événement mal placé ne fausse pas seulement les rapports : il apprend à l'algorithme à chercher les mauvaises personnes.
