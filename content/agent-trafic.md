# Agent de contenu : lire le trafic et agir dessus

Complète `content/agent-blog.md`. Décisions d'Ugo du 22/11/2026, à la suite de ses premières demandes entrantes (2 venues du blog et de ChatGPT le même jour) : « tu dois trouver ce qu'on a fait et continuer » ; l'agent « doit analyser le trafic qui vient sur mon site, comprendre ce qui fonctionne, créer des nouveaux articles et des nouvelles pages en fonction de ça et m'attirer de plus en plus de monde ».

Ce qu'il peut faire seul :
- publier des articles (comme avant) ;
- **créer des pages métier** `/leads-{métier}` : « Mets-la en ligne. Si moi je trouve que ça ne va pas, je te préviendrai, on la retirera. Juste tu me préviens s'il y a des nouvelles pages » ;
- **retoucher les articles et les pages métier** (titre Google, description, texte, liens internes), mais avec méthode : « s'il modifie à chaque demande et qu'il n'a pas un échantillon assez gros, ça aura aucune valeur [...] trouve un moyen pour qu'il puisse modifier sans me foutre la merde sur mon site » ;
- la **page d'accueil** est « plus délicate » : jamais modifiée par l'agent, il propose seulement.

Rapport à Ugo : Telegram, chaque lundi.

## 1. Lire les chiffres

```bash
curl -s -X POST https://www.kairnagency.com/api/notif \
  -H "x-agent-jeton: $AGENT_JETON" -H 'Content-Type: application/json' \
  -d '{"action":"rapport","jours":28}' > /tmp/rapport.json
```

`$AGENT_JETON` est une variable d'environnement de la routine. Ne l'écris jamais dans un fichier, un commit ou un message.

Le rapport donne, pour les 28 derniers jours complets (`periode`) et les 28 d'avant (`periode_precedente`) :
- `visites` : compteur du site (sans cookie, robots exclus), en service depuis `compteur_visites_depuis` : visites par source (Google, ChatGPT, Bing, accès direct…), pages d'arrivée, source × page d'arrivée, pages vues ;
- `demandes` : chaque demande du site (réservation d'appel ou formulaire Commander) avec sa page et son origine (« Google → /blog/... »). C'est **le chiffre qui compte** : une page qui amène des demandes vaut plus qu'une page qui amène des visites ;
- `search_console` : clics, impressions, CTR et position moyenne par page, par requête, et par couple requête × page (branchée le 22/11/2026, historique depuis le 24/08/2026). `total` et `par_page` sont les chiffres exacts : sers-t'en pour les seuils par page. `par_requete` et `requete_page` omettent les requêtes rares que Google masque : leur somme est plus petite que le total, c'est normal.

Une page vue n'est pas une demande. Un mail direct à contact@kairnagency.com n'apparaît nulle part : ne conclus jamais qu'une page « ne ramène rien » sur les seules demandes du site.

## 2. Ce qui compte comme preuve (tailles d'échantillon)

Une décision ne se prend que sur un signal assez gros. En dessous, on ne touche à rien et on attend.

| Décision | Seuil minimum, sur 28 jours |
|---|---|
| Retoucher le titre ou la description d'une page | 200 impressions Search Console sur cette page, position moyenne entre 1 et 15, et CTR inférieur à la moitié du CTR moyen du site pour les pages de la même tranche de position (1 à 3, 4 à 10, 11 à 15), calculé dans le rapport |
| Écrire un article sur une requête vue dans la Search Console | 30 impressions sur la requête (ou un groupe de requêtes de même intention), aucune page du site en position 1 à 10 dessus |
| Créer une page métier | voir section 5 |
| Dire qu'une page ou un canal « marche » | au moins 2 demandes, ou 20 visites d'arrivée, venues de lui |
| Revenir sur une retouche | 28 jours après, au moins 200 impressions depuis la retouche |

Pas de seuil atteint : écris « pas assez de données » dans le rapport, ne fabrique pas de conclusion.

## 3. Le passage du lundi : analyse, retouches, rapport

Le lundi, avant l'article d'actualité :

1. Lis le rapport (section 1), `content/journal-modifs.md` et `content/rapport-trafic.md` (rapport de la semaine précédente).
2. **Ce qui marche** : canaux et pages qui amènent des demandes et des visites, requêtes qui montent (impressions ou position meilleures que la période précédente).
3. **Réordonne `content/plan-blog.md`** :
   - monte en priorité 1 les sujets liés aux pages et aux métiers qui amènent des demandes ;
   - ajoute les requêtes de la Search Console qui passent le seuil de la section 2 et n'ont pas de page dédiée (marque-les « signal Search Console du {date} : N impressions, position P ») ;
   - ajoute des sujets voisins de ceux qui ramènent du monde depuis ChatGPT et les autres IA (même métier, autre question d'acheteur).
4. **Retouches** (section 4), au plus 2 par lundi.
5. **Liens internes** : dans 1 à 3 articles qui ont des visites, ajoute un lien vers la page qui amène le plus de demandes, si le lien a du sens pour le lecteur. Note-le dans `content/journal-modifs.md`.
6. Écris `content/rapport-trafic.md` (remplace le précédent) : chiffres clés, ce qui marche, ce qui a été fait, ce qui est prévu, propositions pour l'accueil.
7. Publie le tout dans le même commit que l'article du jour, ou dans un commit à part `Trafic : analyse du {date}` si l'article échoue.
8. Envoie le rapport Telegram (section 7).

Si la Search Console n'est pas branchée et que le compteur a moins de 14 jours : pas de retouche, seulement le plan, le rapport et le message.

## 4. Retoucher une page existante sans casser le site

Pages autorisées : articles (`content/blog/*.md`) et pages métier (`src/v3/leads/thematiques.js` pour le titre et la description, `src/v3/leads/contenus.js` pour le texte).

**Jamais touchées par l'agent** : la page d'accueil `/` et tout ce qui s'y affiche (`src/v2/`, `src/v3/` hors `leads/`), `/commander`, `/plateforme`, la réservation, les prix (`src/v3/produits.js`), le menu, le pied de page, les pages légales, `/gestion`, `/espace`, `api/`, `supabase/`, `vercel.json`. Pour l'accueil, écris une proposition dans le rapport : Ugo décide.

Règles :
- une page retouchée ne l'est plus pendant **42 jours** (28 jours de mesure, plus le délai de Google) ;
- **2 retouches au plus par semaine**, le lundi seulement ;
- une retouche = une seule chose changée (le titre, ou la description, ou une section), pour savoir ce qui a joué ;
- avant de changer, note dans `content/journal-modifs.md` : date, page, ce qui change (avant → après), la raison chiffrée (impressions, CTR, position des 28 jours) ;
- le titre Google garde le mot-clé principal au début, 65 caractères au plus, et reste vrai (prix lus dans `produits.js`, aucune promesse de résultat) ;
- 28 jours après, compare dans le journal : si le CTR a baissé avec au moins 200 impressions depuis, remets l'ancienne version et note-le. Sinon, note « gardé ».

## 5. Créer une page métier

Une page métier `/leads-{métier}` s'ajoute quand **un de ces signaux** est réuni sur 28 jours :
- 50 impressions Search Console sur des requêtes d'acheteur de ce métier (« leads {métier} », « trouver des clients {métier} », « prospects {métier} ») sans page métier dédiée ;
- 2 demandes ou plus venues d'articles de ce métier ;
- 30 visites d'arrivée ou plus sur des articles de ce métier.

Et seulement si Kairn peut vendre ce métier : des particuliers qui demandent à être rappelés après une publicité Meta, pour un professionnel (comme les pages existantes). Pas de B2B pur, pas de secteur interdit par Meta, pas de santé au sens médical (questions de santé interdites).

Comment :
1. Copie le modèle d'une page **sur devis** existante (une entrée de `src/v3/leads/thematiques.js` sans `produit`, et son texte dans `src/v3/leads/contenus.js`), avec le code de la thématique dans `src/v3/leads/codes.js` (`THEMATIQUES_DEVIS`) pour que le formulaire Commander l'accepte. Prix : **sur devis**, jamais un prix inventé.
2. Même structure que les autres pages, mêmes promesses vraies (exclusif, dès 50 contacts, sans engagement), FAQ de 5 questions, liens vers 2 articles et `/commander`.
3. `npm run build` doit passer et la page doit apparaître dans le sitemap et `llms.txt` (le build les génère).
4. **Une page nouvelle par semaine au plus.**
5. Dès qu'elle répond 200 en ligne : message Telegram immédiat (section 7) avec le lien, pour qu'Ugo la contrôle. Note-la dans `content/journal-modifs.md`.

Si Ugo demande de retirer une page : `pret: false` dans `thematiques.js` (la page sort des routes, du menu et du sitemap).

## 6. Choisir l'article du jour avec les chiffres

Les jours d'article de trafic, le sujet vient toujours de `content/plan-blog.md`, que le lundi a réordonné avec les chiffres. Si le rapport du jour montre une requête qui passe le seuil de la section 2 et n'est pas encore dans le plan, ajoute-la au plan (priorité 1) avant de choisir.

## 7. Messages Telegram

```bash
curl -s -X POST https://www.kairnagency.com/api/notif \
  -H "x-agent-jeton: $AGENT_JETON" -H 'Content-Type: application/json' \
  --data-binary @/tmp/message.json
```
avec `/tmp/message.json` = `{"action":"telegram","texte":"..."}` (écris le JSON avec `python3 -c 'import json,sys; ...'` pour échapper le texte).

**Lundi**, 15 lignes au plus, texte simple, sans tiret cadratin :
```
Semaine du {date} au {date}
Visites : N (semaine d'avant : N). Sources : Google N, ChatGPT N, …
Demandes du site : N ({page} ← {source}, …)
Google : N clics, N impressions, position moyenne P
Ce qui marche : …
Publié cette semaine : N articles ({titres courts})
Retouches : … (ou « aucune, pas assez de données »)
Prévu : …
Pour l'accueil (à toi de décider) : … (si une idée)
Rapport complet : https://github.com/ugojobbizy/kairn/blob/main/content/rapport-trafic.md
```

**Nouvelle page métier** : `Nouvelle page en ligne : {titre} {adresse}. Pourquoi : {signal chiffré}. Pour la retirer, dis-le à Claude.`

N'envoie pas d'autre message (pas de message pour chaque article).
