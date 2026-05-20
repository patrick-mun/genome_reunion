# Méthodologie de validation in silico — Génome Réunion
## Quatre profils de population synthétique et liens INSEE utiles

**Version :** v0.4  
**Statut :** document de travail à intégrer au projet  
**Objectif :** formaliser une stratégie de validation méthodologique indépendante d'une reconstruction historique exhaustive de La Réunion.

**Historique :**
- v0.1 — version initiale (quatre profils, stratégies, métriques, proxys INSEE).
- v0.2 — clarification du **découplage simulateur ↔ méthode** dans §10 (les `%` d'ascendance par secteur deviennent des cibles de calibration émergentes, non des inputs directs) ; ajout d'une section dédiée aux **outils logiciels et au pipeline de simulation** (§11) ; renumérotation des sections suivantes.
- v0.3 — refonte du §5 : classification des métriques en trois tiroirs (primaires extrinsèques / diagnostiques intrinsèques / algorithmiques) avec hiérarchie de jugement explicite ; spécification de **formes mathématiques d'évaluation distinctes** de celles de `S_div` pour les dimensions partagées (PCA, ADMIXTURE, IBD, ROH).
- v0.4 — ajout d'une section **§7 « Seuils de succès quantitatifs (pré-enregistrés) »** : formule du Δ relatif, règle de jugement par profil, table de seuils initiale, trois ancrages de justification (coût-bénéfice, IC 95 %, convention), clause de pré-enregistrement et de tolérance pour les métriques diagnostiques ; ajout du livrable `validation_thresholds.tsv` ; renumérotation §7→§8 … §15→§16.

---

## 1. Principe général

La validation ne doit pas chercher à prouver que l'on connaît parfaitement la structure réelle de la population réunionnaise. Elle doit tester si la méthodologie de sélection WGS reste robuste dans plusieurs régimes possibles de structure populationnelle.

L'idée retenue est de construire plusieurs populations synthétiques de **2500 individus**, puis de sélectionner **350 WGS** selon différentes stratégies. La méthode est ensuite évaluée selon des métriques communes : diversité capturée, représentativité, parenté résiduelle, capture des variants rares ou fondateurs, performance d'imputation et stabilité algorithmique.

Le scénario central pour La Réunion n'est pas considéré comme strictement homogène ni comme totalement fragmenté. Il est défini comme un scénario **mixte-hétérogène** : une population globalement admixée, mais structurée par des gradients géographiques, des sous-profils locaux, des effets fondateurs et des différences haplotypiques.

---

## 2. Objectif méthodologique

La validation doit répondre à quatre questions :

1. **Si la population est homogène**, la méthode géo-ancestrale n'invente-t-elle pas artificiellement un gain ?
2. **Si les moyennes d'admixture sont proches mais que des sous-profils existent**, la méthode détecte-t-elle ce que les moyennes masquent ?
3. **Si La Réunion correspond à un profil mixte-hétérogène**, la méthode capture-t-elle mieux les profils utiles qu'un tirage simple ?
4. **Si la population est fortement hétérogène**, la méthode protège-t-elle contre un prélèvement biaisé ou trop localisé ?

Cette logique permet de valider la méthode sans prétendre reconstituer parfaitement l'histoire démographique réelle de l'île.

---

## 3. Les quatre profils de population à tester

### Profil A — Homogène

#### Rôle

Contrôle négatif. Il sert à vérifier que la méthode ne crée pas artificiellement une différence lorsque la population est réellement peu structurée.

#### Hypothèse

Tous les secteurs présentent une admixture proche. Les différences géographiques sont faibles.

| Secteur | Européen | Africain | Malgache | Indien | Chinois / Est-asiatique | Comores / Océan Indien |
|---|---:|---:|---:|---:|---:|---:|
| Nord | 20 | 15 | 18 | 30 | 8 | 9 |
| Est | 18 | 16 | 20 | 30 | 7 | 9 |
| Sud | 19 | 14 | 18 | 31 | 8 | 10 |
| Ouest | 21 | 15 | 17 | 29 | 9 | 9 |
| Hauts / Cirques | 22 | 14 | 18 | 28 | 7 | 11 |
| Sud-Est | 18 | 17 | 20 | 29 | 6 | 10 |

#### Paramètres attendus

| Paramètre | Niveau |
|---|---|
| Variance d'admixture entre secteurs | faible |
| Sous-profils internes | faibles |
| IBD local | faible à modéré |
| ROH longs | rares |
| Variants fondateurs localisés | très rares |
| Mobilité inter-secteurs | forte |
| Endogamie locale | faible |

#### Résultat attendu

```text
random ≈ géographique strict ≈ géo-ancestral
```

Un gain faible de la méthode géo-ancestrale est attendu. Si le gain est très élevé, cela peut signaler un biais de la métrique ou une simulation mal contrôlée.

---

### Profil B — Mixte avec sous-structure cachée

#### Rôle

Scénario réaliste bas. Les moyennes sectorielles restent relativement proches, mais certains sous-profils, haplotypes ou variants fondateurs sont localisés.

#### Hypothèse

Les secteurs sont globalement admixés, mais chaque secteur contient plusieurs sous-profils internes.

| Secteur | Européen | Africain | Malgache | Indien | Chinois / Est-asiatique | Comores / Océan Indien |
|---|---:|---:|---:|---:|---:|---:|
| Nord urbain | 25 | 10 | 10 | 22 | 20 | 13 |
| Est agricole | 12 | 20 | 28 | 30 | 4 | 6 |
| Saint-Leu / Hauts Ouest | 28 | 8 | 12 | 42 | 3 | 7 |
| Sud agricole | 18 | 10 | 10 | 50 | 4 | 8 |
| Hauts du Sud / Plaine | 45 | 8 | 10 | 25 | 2 | 10 |
| Sud-Est | 12 | 18 | 25 | 35 | 3 | 7 |
| Cirques / Hauts isolés | 35 | 14 | 25 | 16 | 1 | 9 |

#### Sous-profils à simuler

Exemple pour le **Sud agricole** :

| Sous-profil | Proportion dans le secteur | Signal simulé |
|---|---:|---|
| Engagisme indien agricole | 45 % | forte composante indienne |
| Créole sud admixé | 30 % | mélange indien / européen / africain / malgache |
| Mobilité récente | 15 % | profil diffus |
| Petit foyer fondateur | 10 % | ROH / IBD local, variant rare simulé |

Exemple pour les **Hauts du Sud / Plaine** :

| Sous-profil | Proportion dans le secteur | Signal simulé |
|---|---:|---|
| Yab / petits agriculteurs | 40 % | composante européenne fondatrice plus élevée |
| Admixé des Hauts | 30 % | européen + malgache + indien |
| Fondateur local | 20 % | ROH / IBD élevé |
| Mobilité récente | 10 % | profil diffus |

#### Résultat attendu

```text
random < géographique strict < géo-ancestral < géo-ancestral + bras découverte
```

Ce profil teste la capacité de la méthode à détecter ce qu'un simple camembert moyen masque.

---

### Profil C — Mixte-hétérogène réunionnais plausible

#### Rôle

Scénario principal pour Génome Réunion. Il représente l'hypothèse centrale : La Réunion est globalement admixée, mais régionalement, socialement et haplotypiquement hétérogène.

#### Hypothèse

La population est très métissée à l'échelle de l'île, mais certains secteurs ou sous-secteurs portent des signatures particulières : zones agricoles, Hauts, cirques, réseaux commerciaux, foyers fondateurs, mobilité récente.

| Secteur / sous-secteur | Signal proxy dominant | Effet attendu |
|---|---|---|
| Nord urbain | commerce, administration, mobilité récente | profils plus diffus, composantes chinoise/est-asiatique et européenne récente plus visibles |
| Nord-Est / Est agricole | habitations, canne, héritage servile et engagisme | composantes malgache, africaine et indienne plus marquées |
| Saint-Leu / Hauts de l'Ouest | agriculture, Hauts, implantation indienne et petits foyers locaux | combinaison indien agricole + fondateurs locaux |
| Sud agricole | engagisme agricole | forte composante indienne dans certains sous-profils |
| Hauts du Sud / Plaine | petits agriculteurs, isolement relatif | composante européenne fondatrice, ROH / IBD local |
| Sud-Est périphérique | agriculture, isolement relatif | mélange indien / malgache / africain avec sous-structure |
| Cirques / Hauts isolés | isolement, marronnage, dérive | haplotypes localisés, ROH / IBD, variants fondateurs simulés |

#### Caractéristiques attendues

| Dimension | Niveau attendu |
|---|---|
| Admixture globale | élevée |
| Différences de moyenne entre secteurs | modérées à fortes |
| Sous-profils internes | forts |
| Hétérogénéité haplotypique | forte |
| Variants fondateurs localisés | probables |
| Parenté locale / IBD | variable selon secteurs |
| ROH | surtout dans zones isolées ou sous-profils fondateurs |
| Mobilité moderne | atténue mais n'efface pas les structures anciennes |

#### Résultat attendu

```text
random < géographique strict < géo-ancestral < géo-ancestral + bras découverte
```

L'écart attendu est modéré à net. Il ne doit pas être caricatural, afin d'éviter de représenter La Réunion comme une population artificiellement fragmentée.

---

### Profil D — Hétérogène extrême

#### Rôle

Stress-test méthodologique. Il vérifie que la stratégie reste efficace lorsqu'une population est très structurée.

#### Hypothèse

Les secteurs présentent des profils très contrastés et des variants rares/fondateurs localisés.

| Secteur | Européen | Africain | Malgache | Indien | Chinois / Est-asiatique | Comores / Océan Indien |
|---|---:|---:|---:|---:|---:|---:|
| Nord urbain / commercial | 30 | 8 | 8 | 20 | 25 | 9 |
| Est agricole ancien | 6 | 25 | 38 | 24 | 2 | 5 |
| Nord-Est agricole indien | 8 | 14 | 20 | 52 | 2 | 4 |
| Saint-Leu / Hauts Ouest | 32 | 6 | 10 | 45 | 1 | 6 |
| Sud agricole | 12 | 6 | 8 | 66 | 2 | 6 |
| Hauts du Sud / Plaine | 60 | 5 | 8 | 18 | 1 | 8 |
| Cirques / Hauts isolés | 45 | 18 | 25 | 6 | 0 | 6 |
| Ouest littoral | 28 | 12 | 12 | 28 | 12 | 8 |

#### Variants fondateurs simulés

| Variant simulé | Zone principale | Fréquence locale | Fréquence île entière |
|---|---|---:|---:|
| F1 | Hauts du Sud | 6 % | 0,8 % |
| F2 | Est agricole | 4 % | 0,6 % |
| F3 | Saint-Leu / Hauts Ouest | 5 % | 0,7 % |
| F4 | Cirques | 8 % | 0,4 % |
| F5 | Sud agricole | 3 % | 0,9 % |

#### Résultat attendu

```text
opportuniste urbain << random < géographique strict < géo-ancestral < géo-ancestral + bras découverte
```

Ce profil ne doit pas être présenté comme le modèle principal de La Réunion. Il sert à démontrer que la méthode reste pertinente dans une situation difficile.

---

## 4. Stratégies de sélection à comparer

Chaque profil doit être soumis aux mêmes stratégies de sélection.

| Stratégie | Description | Rôle dans la validation |
|---|---|---|
| Opportuniste urbain | prélèvement concentré sur quelques zones faciles d'accès | scénario biaisé à battre |
| Random | tirage aléatoire simple parmi les 2500 | référence minimale |
| Géographique strict | allocation proportionnelle par secteur | teste la seule représentativité territoriale |
| PCA-only | sélection par distance dans l'espace PCA | teste l'information génétique globale |
| ADMIXTURE-only | sélection par entropie ou distance des profils q_k | teste l'information ancestrale |
| Géo-ancestral | secteur × profil d'ascendance | stratégie principale |
| Géo-ancestral + bras découverte | noyau représentatif + pool libre informatif | stratégie candidate optimale |

---

## 5. Métriques de validation

Les mêmes métriques doivent être calculées pour chaque profil et chaque stratégie. Elles sont **classées en trois tiroirs** selon leur indépendance vis-à-vis de la fonction objectif `S_div = 0.30·PCA + 0.30·ADMIX + 0.25·IBD + 0.15·ROH` (cf. §10.2 sur le découplage simulateur ↔ méthode).

### 5.1 Métriques primaires (extrinsèques) — critère décisif de succès

Ces métriques portent sur des dimensions **absentes de `S_div`**. Elles constituent le verdict réel de la performance de la méthode.

| Métrique | Question évaluée | Indépendance vs `S_div` |
|---|---|---|
| Couverture allélique totale | combien de variants sont capturés ? | totale |
| Capture des variants rares (MAF < 1 %) | la stratégie récupère-t-elle les variants à fréquence faible ? | totale |
| Capture des variants fondateurs simulés (F1–F5) | les foyers locaux sont-ils représentés ? | totale (variants injectés au stade simulation) |
| Performance d'imputation aval | le panel WGS améliore-t-il l'imputation des 2150 SNP restants sur un jeu held-out ? | totale (calcul aval, distinct de la sélection) |

### 5.2 Métriques diagnostiques (intrinsèques) — sanity-check, pas verdict

Ces métriques portent sur des dimensions **présentes dans `S_div`**. Elles servent à vérifier que l'optimisation a effectivement opéré sur ce qu'elle prétend faire, mais ne constituent pas un jugement de performance — la méthode `géo-ancestrale` et les stratégies `PCA-only` / `ADMIXTURE-only` les amélioreront mécaniquement par construction.

Pour réduire l'alignement trivial entre objectif et métrique, la **forme mathématique** utilisée à l'évaluation doit différer de celle utilisée dans `S_div` :

| Dimension | Forme dans `S_div` (objectif) | Forme recommandée à l'évaluation (métrique) |
|---|---|---|
| PCA | distance euclidienne au centroïde de la cohorte | **volume de l'enveloppe convexe** couverte par la sélection dans l'espace PCA (PC1–PC4) |
| ADMIXTURE | entropie de Shannon du vecteur `q_k` | **divergence KL** entre `q_k(sélection)` et `q_k(cohorte)` |
| IBD | pénalité de redondance pair-à-pair | **distribution complète** des longueurs de segments IBD ≥ 5 cM (test KS vs cohorte) |
| ROH | comptage de ROH au-delà d'un seuil | **distribution complète** des longueurs de ROH (test KS) + indice de Gini |

| Métrique diagnostique | Question évaluée |
|---|---|
| Distance PCA sélection vs cohorte totale | la sélection respecte-t-elle la structure globale ? |
| Divergence ADMIXTURE sélection vs cohorte totale | les proportions ancestrales sont-elles conservées ? |
| IBD résiduel (distribution) | y a-t-il trop de redondance génétique ? |
| Distribution ROH | la sélection surreprésente-t-elle l'autozygotie ? |

### 5.3 Métriques algorithmiques (orthogonales) — robustesse

Indépendantes du contenu génétique, elles mesurent la fiabilité du procédé.

| Métrique | Question évaluée |
|---|---|
| Stabilité multi-seed | l'algorithme donne-t-il des résultats reproductibles ? |
| Sensibilité aux poids `S_div` | les conclusions dépendent-elles trop des poids ? |
| Stabilité à l'ordre de présentation | l'algorithme greedy est-il invariant à la permutation des candidats ? |

### 5.4 Hiérarchie de jugement

Une méthode est déclarée **validée** sur un profil si elle :

1. **gagne sur les métriques primaires (§5.1)** — critère décisif ;
2. **conserve un comportement raisonnable sur les diagnostiques (§5.2)** — sans dégrader sensiblement PCA / ADMIXTURE / IBD / ROH par rapport à la cohorte totale ;
3. **reste stable sur les métriques algorithmiques (§5.3)**.

Inverser cette hiérarchie — juger d'abord sur les diagnostiques — risquerait de valider une méthode qui optimise bien son propre score sans valeur ajoutée externe. Les §5.1 sont les juges, les §5.2 sont les témoins, les §5.3 sont les contrôles.

---

## 6. Interprétation attendue

| Profil | Résultat interprétable |
|---|---|
| Homogène | random, géographique et géo-ancestral doivent être proches |
| Mixte | la géo-ancestrale doit récupérer les sous-profils mieux que random |
| Mixte-hétérogène réunionnais plausible | la géo-ancestrale + bras découverte doit offrir le meilleur compromis |
| Hétérogène extrême | la méthode doit clairement battre les prélèvements naïfs |

La validation est considérée robuste si la méthode :

1. ne surinterprète pas le scénario homogène ;
2. gagne dans les scénarios mixte et mixte-hétérogène ;
3. résiste au stress-test hétérogène ;
4. reste stable quand on change les seeds, les poids et l'ordre de sélection.

---

## 7. Seuils de succès quantitatifs (pré-enregistrés)

Le §6 fixe la **direction** attendue ; cette section fixe l'**amplitude** requise pour parler de succès. Les seuils sont **pré-enregistrés** : ils sont posés *avant* la première simulation et versionnés dans le repo. Cela empêche tout ajustement *post-hoc* permettant de faire passer la méthode.

### 7.1 Forme générale du Δ

Pour chaque métrique primaire `M` (cf. §5.1) et chaque profil `P`, on calcule un **gain relatif** par rapport à la stratégie `random`, agrégé sur ≥ 100 seeds indépendantes :

```text
Δ_M,P = ( M(stratégie testée) − M(random) ) / M(random)     [%]
```

Et l'on exige, pour conclure au succès, que **l'intervalle de confiance à 95 %** du Δ ne croise pas le seuil défini.

### 7.2 Règle de jugement par profil

| Profil | Critère de succès | Critère d'échec |
|---|---|---|
| **A homogène** | `|Δ| < δ_A_max` (contrôle négatif respecté) | `|Δ| ≥ δ_A_max` → métrique ou simulation suspecte |
| **B mixte** | `Δ ≥ δ_B_min` ET IC 95 % > 0 | `Δ < δ_B_min` → méthode peu utile |
| **C plausible** | `Δ ≥ δ_C_min` ET IC 95 % > 0 | `Δ < δ_C_min` → méthode ne se justifie pas |
| **D extrême** | `Δ ≥ δ_D_min` ET IC 95 % > 0 | `Δ < δ_D_min` → méthode fragile en hétérogénéité forte |

### 7.3 Table de seuils proposés (v0.4 — à valider)

Ces valeurs sont des **points de départ documentés**, à figer formellement avant la première simulation.

| Métrique primaire (§5.1) | δ_A_max | δ_B_min | δ_C_min | δ_D_min | Unité |
|---|---:|---:|---:|---:|---|
| Couverture allélique totale | ≤ 2 % | ≥ 5 % | ≥ 8 % | ≥ 15 % | gain relatif |
| Capture des variants rares (MAF < 1 %) | ≤ 3 % | ≥ 10 % | ≥ 15 % | ≥ 25 % | gain relatif |
| Capture des variants fondateurs F1–F5 | ≤ 0,10 | ≥ 0,15 | ≥ 0,20 | ≥ 0,35 | différence absolue (proportion détectée) |
| Performance d'imputation aval (ΔR² moyen) | ≤ 0,01 | ≥ 0,02 | ≥ 0,03 | ≥ 0,05 | différence absolue de R² |

### 7.4 Les trois ancrages pour justifier chaque seuil

Chaque valeur du tableau §7.3 doit être justifiée par au moins deux des trois ancrages suivants :

1. **Ancrage coût-bénéfice (« combien de WGS supplémentaires »).** Avant validation, faire tourner `random` à plusieurs budgets `N ∈ {200, 250, 300, 350, 400, 500}` sur le profil C. Tracer la courbe `M(random) vs N`. Si la stratégie `géo-ancestrale` à N=350 atteint la même valeur de `M` que `random` à N=400, on parle de « gain équivalent à 50 WGS économisés ». Un seuil interprétable cliniquement et budgétairement.

2. **Ancrage statistique (IC 95 %).** Pour chaque seuil, exiger que l'intervalle de confiance bootstrap à 95 % du Δ sur ≥ 100 seeds **ne croise pas** le seuil dans le mauvais sens. C'est plus exigeant qu'un simple test de significativité avec un grand N.

3. **Ancrage par convention / littérature.** Là où la littérature propose des effets de référence (ex. ΔR² d'imputation > 0,02 considéré comme cliniquement pertinent dans Beagle/GLIMPSE), utiliser cette convention. Pour les autres métriques, conventions de Cohen : effet petit ≈ 5 %, moyen ≈ 15 %, grand ≈ 30 %.

### 7.5 Clause de pré-enregistrement

- La table §7.3 est figée dans un fichier `validation_thresholds.tsv` versionné dans le repo **avant la première simulation**.
- Un dépôt externe horodaté (OSF, Zenodo, ou simple tag Git signé) garantit la non-modification *post-hoc*.
- Les seuils ne peuvent être amendés *après* simulation que si :
  - un défaut technique est documenté dans la simulation, **ou**
  - la courbe de saturation `random` (§7.4 ancrage 1) rend les seuils manifestement inadaptés.
- Tout amendement est versionné avec sa justification (commit dédié + entrée dans l'historique du document).

### 7.6 Que faire des métriques diagnostiques (§5.2) ?

Les métriques diagnostiques ne portent pas de seuil de succès au sens strict. On exige seulement qu'elles **ne se dégradent pas** par rapport à `random` au-delà d'une tolérance :

```text
Δ_diagnostique,P ≥ −5 %   (la sélection ne doit pas faire pire que random)
```

Une dégradation au-delà de cette tolérance signale un effet de bord de la fonction objectif (ex. la méthode optimise tellement la diversité qu'elle dégrade la conservation de la structure globale).

---

## 8. Proxys à intégrer dans le simulateur

### Proxys historiques et géographiques

| Proxy | Utilisation |
|---|---|
| zones agricoles historiques | pondérer esclavage, engagisme agricole, canne |
| habitations sucrières | localiser les bassins de main-d'œuvre servile |
| anciennes usines sucrières | relier agriculture, bourgs et commerces |
| ports historiques | modéliser points d'entrée et réseaux commerciaux |
| marchés / bourgs / centres urbains | modéliser commerce indien, gujarati, chinois |
| Hauts et cirques | modéliser isolement, ROH, IBD et dérive |
| axes routiers et mobilité | modéliser brassage moderne |
| lieux de culte et associations culturelles | proxy qualitatif d'implantation historique, à utiliser avec prudence |
| généalogie agrégée / CGB / ANOM | familles fondatrices, primo-arrivants, profondeur locale |

### Proxys modernes

| Proxy | Source principale |
|---|---|
| population par commune | INSEE |
| densité | INSEE |
| âge | INSEE |
| ménages / logements | INSEE |
| naissances / décès | INSEE |
| emploi / catégories socio-professionnelles | INSEE |
| revenus / pauvreté | INSEE |
| mobilité résidentielle | INSEE |
| trajets domicile-travail | INSEE / études territoriales |

---

## 9. Liens INSEE utiles

### Dossier complet — Département de La Réunion

- URL : https://www.insee.fr/fr/statistiques/2011101?geo=DEP-974
- Usage : indicateurs démographiques, sociaux et économiques à l'échelle du département.
- Variables utiles : population, âge, familles, logements, emploi, chômage, revenus, naissances, décès, entreprises.

### Dossier complet — Région de La Réunion

- URL : https://www.insee.fr/fr/statistiques/2011101?geo=REG-04
- Usage : lecture régionale globale et comparaison avec le niveau départemental.
- Variables utiles : mêmes familles d'indicateurs que le dossier départemental.

### Base du dossier complet

- URL : https://www.insee.fr/fr/statistiques/5359146
- Usage : fichier téléchargeable avec données communales.
- Intérêt principal : environ 1900 indicateurs communaux exploitables pour créer une table `commune × indicateurs`.
- Variables utiles : population, structure d'âge, logement, familles, emploi, revenus, pauvreté, naissances, décès, équipements.

### Dossiers complets par commune

Exemple Saint-Denis :

- URL : https://www.insee.fr/fr/statistiques/2011101?geo=COM-97411
- Usage : extraction commune par commune.
- Variables utiles : historique de population, âge, lieu de résidence antérieure, ménages, logement, emploi.

### Page INSEE La Réunion

- URL : https://www.insee.fr/fr/information/2018985
- Usage : portail d'entrée vers les statistiques locales, comparateurs et dossiers régionaux.

### Accès aux résultats pour toutes les zones

- URL : https://insee.fr/fr/statistiques/zones/2011101
- Usage : sélectionner des communes, départements, régions ou intercommunalités.

---

## 10. Table de données minimale recommandée

Pour intégrer les données INSEE dans le simulateur, créer une table de travail :

```text
commune
secteur_simulation
population
densite
part_jeunes
part_actifs
part_ages
naissances
deces
menages
logements
revenu_median
taux_pauvrete
emploi
mobilite_residentielle
pression_urbaine
pression_agricole_proxy
pression_commerciale_proxy
indice_isolement
poids_recrutement_EFS
```

Puis agréger par secteur :

```text
Nord urbain
Nord-Est / Est agricole
Saint-Leu / Hauts Ouest
Sud agricole
Hauts du Sud / Plaine
Sud-Est périphérique
Cirques / Hauts isolés
Ouest littoral
```

---

## 11. Formulation algorithmique

Pour une composante ancestrale simulée `g`, dans un secteur `s`, à une période `t` :

```text
P(g | s,t) ∝ F(g,t) × [αg·A(s,t) + βg·C(s,t) + γg·I(s,t) + δg·M(s,t) + ηg·G(s,t)]
```

Avec :

| Terme | Définition |
|---|---|
| `F(g,t)` | flux historique global de la composante `g` à la période `t` |
| `A(s,t)` | pression agricole historique |
| `C(s,t)` | pression commerciale / urbaine |
| `I(s,t)` | isolement géographique |
| `M(s,t)` | mobilité moderne |
| `G(s,t)` | signal fondateur / généalogique |

Les coefficients `αg, βg, γg, δg, ηg` varient selon la composante simulée. Par exemple, `A` pèse fortement pour l'engagisme agricole, `C` pour les réseaux commerciaux gujaratis ou chinois, `I` pour les Hauts et cirques, et `G` pour les fondateurs anciens.

### 11.1 Statut de la formulation : cible de calibration, non tirage individuel

L'équation ci-dessus **ne décrit pas un tirage individuel d'ascendance**. Elle définit les **fréquences ancestrales attendues** par secteur, qui servent de **cibles de calibration** pour le simulateur démographique.

Les individus synthétiques ne sont **pas** générés en tirant `g` selon `P(g|s,t)`. Ils sont produits par une simulation forward-time (ou coalescente) sur `G ≈ 10–12` générations, avec recombinaison, dérive, migration inter-secteurs et injection éventuelle de variants fondateurs sur lignées spécifiques. Les proportions ancestrales observées en sortie sont ensuite **comparées** aux cibles ; les flux migratoires `F(g,t)` et les pondérations `αg…ηg` sont ajustés jusqu'à convergence des sorties simulées sur les tableaux §3.

### 11.2 Pourquoi ce découplage est indispensable

Le simulateur doit opérer à un **niveau plus profond** que la méthode de sélection, pour les raisons suivantes :

1. **Éviter une validation tautologique.** Si les `%` d'ascendance par secteur étaient des inputs directs du simulateur, et que la sélection `géo-ancestrale` optimise sur ces mêmes `%`, le gain mesuré serait garanti par construction et ne validerait rien.
2. **Faire émerger une structure haplotypique réaliste.** Les métriques `IBD résiduel`, `ROH`, `capture des variants fondateurs` et `performance d'imputation` n'ont de sens que si les individus synthétiques portent des **blocs haplotypiques cohérents** issus de recombinaison sur plusieurs générations, pas des étiquettes ancestrales posées à la main.
3. **Disjoindre fonction objectif et métrique d'évaluation.** La fonction objectif `S_div` de la méthode et les métriques §5 doivent reposer sur des grandeurs construites différemment, sinon on mesure la cohérence interne de la méthode, pas sa performance réelle. Voir §5 pour la classification opérationnelle en métriques **primaires** (extrinsèques, juges du succès), **diagnostiques** (intrinsèques, témoins) et **algorithmiques** (contrôles).

Les `%` ancestraux des tableaux §3 sont donc traités comme des **sorties émergentes** d'une démographie sous-jacente plus riche, non comme des paramètres de tirage. Cette discipline méthodologique est l'un des piliers de la validité de l'étude.

---

## 12. Outils logiciels et pipeline de simulation

### 12.1 Vue d'ensemble du pipeline

```text
[1] Démographie historique        →  msprime (coalescent multi-population)
        ↓ haplotypes phasés, LD réaliste, ROH/IBD émergents
[2] Variants fondateurs simulés   →  SLiM 4 (forward-time)
        ↓ injection F1…F5 sur lignées spécifiques (profil D)
[3] Cohorte synthétique 2500 ind. →  VCF + métadonnées (secteur, sous-profil)
        ↓
[4] PCA / ADMIXTURE / IBD / ROH   →  PLINK 2, ADMIXTURE, hap-ibd, GARLIC
        ↓ scores par individu
[5] Sélection 350 WGS             →  Python (7 stratégies, dont géo-ancestral)
        ↓
[6] Métriques de validation       →  scikit-allel, pandas, R
        ↓
[7] Imputation aval (2150 SNP)    →  Beagle 5.4 ou GLIMPSE2
        ↓
[8] Rapport final                 →  Quarto / Jupyter Book (HTML + PDF)
```

### 12.2 Outils recommandés par étape

| Étape | Outil principal | Rôle | Licence |
|---|---|---|---|
| Simulation démographique | **msprime** (Python) | coalescent multi-population, admixture pulsée, recombinaison | MIT |
| Variants fondateurs / dérive | **SLiM 4** | forward-time, injection variants rares, petites populations | GPL-3 |
| Carte génétique | **HapMap / deCODE** | taux de recombinaison réalistes (GRCh38) | publique |
| QC / manipulation VCF | **bcftools**, **PLINK 2** | filtrage MAF, HWE, missingness, conversion formats | GPL/MIT |
| PCA | **PLINK 2 (`--pca`)** ou **smartpca** | structure globale | GPL |
| ADMIXTURE supervisée | **ADMIXTURE 1.3** | proportions `q_k`, K=4 à K=6 | libre académique |
| IBD | **hap-ibd** ou **iLASH** | segments partagés ≥ 2–3 cM | libre académique |
| ROH | **PLINK 2 (`--homozyg`)** ou **GARLIC** | distribution d'autozygotie | GPL |
| Sélection géo-ancestrale | **Python** (numpy, pandas, scikit-allel) | implémentation `S_div` + 7 stratégies | MIT |
| Imputation aval | **Beagle 5.4** ou **GLIMPSE2** | imputation des 2150 SNP non-WGS | libre académique |
| Orchestration | **Snakemake** ou **Nextflow** | DAG reproductible, multi-seed, traçabilité | MIT/Apache |
| Conteneurisation | **Docker** ou **Singularity / Apptainer** | image figée, ré-exécution exacte | libre |
| Rapport final | **Quarto** | HTML + PDF auditables, code embarqué | MIT |

### 12.3 Paramètres de simulation à fixer (valeurs indicatives)

| Paramètre | Valeur indicative | Justification |
|---|---|---|
| Profondeur générationnelle `G` | 10–12 générations | depuis 1665, ≈ 25–30 ans/génération |
| Taille effective initiale `Ne` par secteur | 200–500 | calibrée sur démographie historique INSEE |
| Taux de recombinaison | carte HapMap GRCh38 | standard humain |
| Taux de mutation `μ` | 1,25 × 10⁻⁸ / site / génération | valeur consensus humaine |
| Brassage inter-secteurs | 1–5 % / génération (variable selon période) | faible pour Hauts/cirques, fort pour côtes |
| Nombre de réplicats par profil | ≥ 100 seeds indépendantes | pour intervalles de confiance des métriques |
| Nombre de SNP simulés | ≥ 500 000 sur 22 autosomes | suffisant pour PCA, ADMIXTURE, ROH, IBD |
| Statut paramètre | `observé` / `estimé` / `scénarisé` | obligatoire par §12 garde-fous |

### 12.4 Exigences de reproductibilité

Toute la chaîne doit être :

- **versionnée** (Git, un tag par run de validation) ;
- **conteneurisée** (image Docker/Singularity figée, avec versions exactes des outils) ;
- **paramétrée par seed** (un seed par réplicat, journalisé dans un manifest) ;
- **orchestrée** par Snakemake ou Nextflow (DAG reproductible, reprise sur échec) ;
- **archivée** avec hash SHA-256 des cohortes synthétiques produites, pour permettre une ré-exécution exacte ou une audit indépendant.

### 12.5 Alternatives et options

| Besoin | Alternative |
|---|---|
| Simulation très grande échelle | **stdpopsim** (catalogue de modèles démographiques humains pré-validés, basé sur msprime) |
| ADMIXTURE non supervisée comparative | **fastSTRUCTURE** ou **sNMF** (R) |
| Phasage si besoin | **SHAPEIT5** ou **Beagle 5.4** (déjà cité) |
| Visualisation PCA / ADMIXTURE | **R** (ggplot2, pophelper) ou **Python** (matplotlib, seaborn) |
| Comparaison cohortes (Fst, etc.) | **scikit-allel** (Python) ou **EIGENSOFT** |

---

## 13. Garde-fous scientifiques et éthiques

La simulation doit respecter quatre garde-fous :

1. **Ne pas assigner une origine individuelle.** Les composantes sont des outils de simulation génétique, pas des identités sociales.
2. **Distinguer les paramètres observés, estimés et scénarisés.** Chaque paramètre doit recevoir un statut : `observé`, `estimé`, `scénarisé`.
3. **Ne pas présenter les profils comme des mesures réelles.** Les profils A-D servent à valider la méthode, non à décrire définitivement La Réunion.
4. **Calibrer dès que les 2500 SNP réels sont disponibles.** Les scénarios doivent être comparés aux PCA, ADMIXTURE, ROH, IBD et fréquences réelles.

---

## 14. Positionnement final recommandé

Le scénario principal du projet doit être le **Profil C — mixte-hétérogène réunionnais plausible**.

Texte de justification recommandé :

> La population réunionnaise ne sera pas modélisée comme une population homogène ni comme une population totalement fragmentée. Le scénario principal sera un profil mixte-hétérogène : une population globalement admixée, mais présentant des gradients géographiques, des sous-profils locaux, des zones à héritage agricole ou commercial marqué et des foyers potentiels d'effets fondateurs. Ce scénario sera encadré par un profil homogène servant de contrôle négatif, un profil mixte avec sous-structure cachée et un profil hétérogène extrême utilisé comme stress-test méthodologique.

---

## 15. Livrables attendus

| Livrable | Description |
|---|---|
| `synthetic_population_A_homogene.tsv` | cohorte synthétique homogène |
| `synthetic_population_B_mixte.tsv` | cohorte synthétique mixte sous-structurée |
| `synthetic_population_C_reunion_plausible.tsv` | cohorte synthétique principale |
| `synthetic_population_D_heterogene_extreme.tsv` | cohorte stress-test |
| `selection_comparison_metrics.tsv` | comparaison des stratégies |
| `founder_variant_capture.tsv` | capture des variants fondateurs simulés |
| `pca_admixture_distance.tsv` | distance sélection vs cohorte totale |
| `ibd_roh_summary.tsv` | parenté et autozygotie résiduelles |
| `imputation_performance.tsv` | performance d'imputation |
| `validation_thresholds.tsv` | seuils de succès pré-enregistrés (§7) |
| `validation_report.html/pdf` | rapport interprétable et auditable |

---

## 16. Résumé opérationnel

La validation repose sur quatre profils :

1. **Homogène** : contrôle négatif.
2. **Mixte** : moyennes proches mais sous-profils cachés.
3. **Mixte-hétérogène réunionnais plausible** : scénario central.
4. **Hétérogène extrême** : stress-test.

Une méthode robuste doit :

```text
ne pas surinterpréter le profil homogène ;
identifier les sous-structures dans le profil mixte ;
être optimale dans le profil réunionnais plausible ;
résister au stress-test hétérogène.
```

Cette approche rend la validation de la stratégie WGS plus défendable, car elle ne dépend pas d'une reconstruction historique parfaite de La Réunion. Elle teste la méthode dans plusieurs mondes possibles, puis permettra une calibration empirique sur les 2500 SNP réels.
