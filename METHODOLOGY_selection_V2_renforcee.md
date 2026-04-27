# Méthodologie de sélection optimale : Génome Réunion

## Vue d'ensemble

Le projet Génome Réunion vise à créer un **référentiel génomique local pour les populations admixées réunionnaises** sous **contrainte budgétaire** : 350 séquençages WGS sélectionnés parmi 2500 génotypages SNP.

Cette approche repose sur deux principes :
1. **Représentativité géographique** (contrainte principale) : la sélection reflète la distribution démographique réelle de l'île
2. **Optimisation génétique** (au sein de chaque secteur) : S_div maximise l'information capturée localement

Résultat : **350 individus représentatifs + informatifs**, avec un biais directionnel **contrôlé, mesuré et documenté**.

**Nature du panel WGS :** le panel WGS n'est pas uniquement un échantillon aléatoire destiné à estimer directement des fréquences. Il s'agit d'un **panel hybride** :
- un **noyau représentatif** géographiquement majoritaire, garantissant l'ancrage démographique ;
- un **bras de découverte contrôlé** (5–10%) destiné à récupérer les profils génétiques très informatifs, notamment profils d'ascendance minoritaire/dominante, profils sous-capturés par la stratification stricte, et profils ROH/fondateurs.
Les fréquences populationnelles finales devront donc être **recalibrées sur la cohorte SNP complète de 2500 individus** par imputation, pondération ou stratification, et non interprétées naïvement à partir des seuls 350 WGS bruts.


**Positionnement méthodologique** : la présente approche doit être comprise comme une **heuristique paramétrée et reproductible**, et non comme la solution mathématiquement optimale au sens strict. L'objectif est de fournir une règle de sélection robuste, transparente, contrôlable et améliorable itérativement, adaptée à un **référentiel de première génération** sous contrainte budgétaire.


---

## 1. Contexte scientifique

### 1.1 Pourquoi une sélection ?

La Réunion présente une **double singularité génétique** :
- **Admixture complexe** : ancêtres africains, indiens, européens, malgaches
- **Effet fondateur** : population historiquement petite avec caractéristiques génomiques uniques
- **Structure géographique** : distribution démographique inégale par secteur

Le **biais de représentation global** signifie que les bases génomiques mondiales (gnomAD, 1000 Genomes) sous-représentent systématiquement les variants rares réunionnais, particulièrement en pharmacogénétique et prédiction de risque génétique (Martin et al., 2019 ; Naslavsky et al., 2022).

### 1.2 Justification statistique de N=350 WGS

**Principe** : le nombre de séquençages WGS doit permettre la caractérisation fiable des variants alléliques rares propres à la population réunionnaise, dans les limites du budget disponible.

**Cadre de calcul — 350 WGS = 700 haplotypes :**

Pour un variant à fréquence allélique f dans la population, la probabilité de le détecter au moins une fois dans 700 haplotypes est :

```
P(détection) = 1 - (1 - MAF)^700
```

| MAF | Copies attendues | P(détection) | Précision fréquence (IC95) |
|---|---|---|---|
| 5% | 35 | >99.9% | Élevée |
| 2% | 14 | >99.9% | Bonne (±1.5×) |
| **1%** | **7** | **>99.9%** | **Limite acceptable (±2×)** |
| 0.5% | 3.5 | ~97% | Insuffisante |
| 0.1% | 0.7 | ~50% | Non fiable |

**Seuil retenu : MAF ≥ 1%**

350 WGS garantit :
- **Détection systématique** (>99.9%) de tout variant présent à MAF ≥ 1% dans la population
- **Estimation de fréquence acceptable** (IC95 < facteur 2) pour MAF ≥ 1%
- **Couverture pharmacogénomique** : la majorité des variants cliniquement actionnables (pharmacogènes CYP, transporteurs) ont une MAF > 1%

**En-deçà de la limite MAF ≥ 1% :**
- Variants à MAF 0.5–1% : détectables dans ~97% des cas mais fréquences non estimables → à documenter
- Variants à MAF < 0.5% : nécessitent N >> 1000 WGS — hors portée de ce projet
- **Compensation** : les 2150 individus génotypés SNP (non séquencés) permettront l'imputation depuis le référentiel WGS, enrichissant partiellement la couverture des variants rares

**Comparaison bibliographique :**

| Étude | N WGS | Haplotypes | Seuil effectif MAF |
|---|---|---|---|
| Naslavsky et al. (2022) — Brésil | 1171 | 2342 | ~0.1% |
| Nunes et al. (2025) — Brésil | > 2000 | > 4000 | ~0.05% |
| **Génome Réunion** | **350** | **700** | **~1%** |

350 WGS est financièrement contraint mais scientifiquement justifié comme **référentiel de première génération** : il couvre l'ensemble des variants MAF ≥ 1%, représente 14% de la cohorte SNP, et constitue la base d'une imputation vers les 2150 restants.

#### **1.2.1 Statut statistique du panel WGS — découverte vs fréquence**

La formule `P(détection) = 1 - (1 - MAF)^700` fournit un **ordre de grandeur utile** pour un variant réparti de manière homogène dans la population et pour un échantillonnage suffisamment représentatif. Dans le présent projet, la sélection WGS est volontairement **stratifiée et partiellement enrichie** : elle vise à maximiser la diversité capturée, pas à produire un tirage aléatoire simple.

Il faut donc distinguer trois usages :

| Usage | Source principale | Interprétation |
|---|---|---|
| **Découverte de variants** | 350 WGS optimisés | Objectif fort : augmenter la probabilité de capter des variants informatifs |
| **Imputation / panel de référence** | 350 WGS + 2150 SNP | Objectif fort : projeter l'information WGS vers la cohorte complète |
| **Fréquences populationnelles finales** | Cohorte SNP 2500 recalibrée | Ne pas utiliser les fréquences brutes des 350 WGS sans pondération |

**Règle de prudence :** les fréquences observées dans les 350 WGS seront considérées comme des **fréquences enrichies / panel-based**. Les fréquences populationnelles réunionnaises devront être estimées après recalibration :
- pondération selon les strates géographiques ;
- pondération selon les strates génétiques lorsque nécessaire ;
- imputation des variants WGS dans les 2150 génotypes SNP restants ;
- comparaison entre fréquence brute WGS, fréquence pondérée et fréquence imputée.

Cette clarification évite une confusion importante : le panel WGS est d'abord un **outil de découverte et d'imputation**, puis devient un support d'estimation populationnelle lorsqu'il est relié à la cohorte SNP complète.

---

### 1.3 Architecture de sélection en trois temps

```
Cohorte EFS (2500 individus)
         ↓
    Génotypage SNP (puce)
         ↓
MÉTRIQUES GLOBALES (sur les 2500, une seule fois) :
   PCA globale → coordonnées PC1-PC5
   ADMIXTURE K optimal → proportions q_k
   ROH → ROH_score individuel
         ↓
STRATIFICATION GÉOGRAPHIQUE (représentativité = contrainte)
   Noyau géographique strict : 90–95% des WGS
   Secteur A: 32% → quota proportionnel
   Secteur B: 25% → quota proportionnel
   ...
   Secteur H: 3% → quota proportionnel
         ↓
BRAS DE DÉCOUVERTE CONTRÔLÉ (5–10% des WGS)
   Profils S_div globaux très informatifs
   Profils d'ascendance rare/dominante
   Profils ROH/fondateurs ciblés
         ↓
AU SEIN DE CHAQUE SECTEUR (en parallèle) :
   IBD intra-secteur → IBD_score
   PCA_score + ADMIX_score (depuis métriques globales, normalisés localement)
   Agrégation S_div → classement local
   Stratification quintile / binaire selon N
   Sélection greedy (contrainte IBD cross-secteur)
         ↓
   SÉLECTION 350 WGS (100% représentatif géographiquement)
         ↓
    Séquençage WGS ciblé
         ↓
   Référentiel réunionnais
```

---

## 2. Architecture de sélection

### 2.1 Étape 1 : Stratification géographique (fondation)

**Principe** : La représentativité géographique est la **contrainte principale**. Chaque secteur de l'île doit contribuer aux 350 WGS **proportionnellement à sa part de la cohorte totale**.

**Processus** :

1. **Documenter la distribution démographique de la cohorte 2500** :
   - Compter le nombre d'individus par secteur géographique (7-8 régions)
   - Calculer le % de chaque secteur
   - Exemple *(valeurs illustratives — les proportions réelles dépendent de la cohorte EFS)* :
   
   | Secteur | N (cohorte 2500) | % | N WGS (350) |
   |---|---|---|---|
   | Nord | 320 | 12.8% | 45 |
   | Nord-Est | 500 | 20.0% | 70 |
   | Est | 380 | 15.2% | 53 |
   | Sud-Est | 400 | 16.0% | 56 |
   | Sud | 350 | 14.0% | 49 |
   | Ouest | 300 | 12.0% | 42 |
   | Nord-Ouest | 250 | 10.0% | 35 |
   | **Total** | **2500** | **100%** | **350** |

2. **Allocation** : Chaque secteur reçoit `N_secteur_WGS = round(proportion_secteur × 350)`. En cas de désaccord d'arrondi (somme ≠ 350), les écarts sont corrigés en ajoutant ou retirant 1 WGS au(x) secteur(s) dont la proportion est la plus proche du demi-entier — garantissant que le total reste exactement 350.

**Résultat** : 350 WGS distribués géographiquement, garantissant que la sélection reflète la structure démographique réelle de La Réunion.

#### **2.1.1 Variante : noyau géographique + bras de découverte contrôlé**

La version stricte impose une stratification géographique sur la totalité des 350 WGS. Cette stratégie est robuste pour la représentativité, mais elle peut sous-capturer certains profils génétiques informatifs, notamment :
- profils d'ascendance minoritaire ou localement dominante mais peu mélangés ;
- individus éloignés du centroïde insulaire mais situés dans un secteur à faible quota ;
- profils ROH élevés évocateurs d'effet fondateur ;
- segments ancestraux rares utiles pour le phasage, l'imputation ou la découverte de variants locaux.

**Architecture recommandée :**

| Composante du panel | Proportion | N approximatif | Objectif |
|---|---:|---:|---|
| **Noyau géographique strict** | 90–95% | 315–332 | Représentativité démographique, stabilité des fréquences |
| **Bras découverte contrôlé** | 5–10% | 18–35 | Récupérer les profils génétiques rares, fondateurs ou sous-capturés |
| **Total** | 100% | 350 | Panel hybride : représentatif + informatif |

Le bras découverte contrôlé ne remplace pas la stratification géographique : il la complète. Il permet de préserver l'architecture dominante du panel tout en évitant qu'une contrainte géographique trop rigide élimine des profils rares ou fondateurs scientifiquement importants.

**Sous-catégories recommandées du bras découverte (5–10%) :**

| Sous-bras | Objectif | Critère principal |
|---|---|---|
| **S_div global extrême** | Capturer des profils très informatifs à l'échelle de l'île | Rang global S_div élevé, IBD compatible |
| **Ascendance rare/dominante** | Ne pas pénaliser les profils peu mélangés mais rares | Distance au centroïde ADMIX ou rareté locale q_k |
| **ROH/fondateur** | Conserver une partie de la signature fondatrice | ROH_total élevé, ROH partagé, cluster local |
| **Phasage / imputation** | Améliorer haplotypes et reconstruction locale | individus utiles par trio, parenté contrôlée, couverture de segments |

**Recommandation opérationnelle :**
- conserver la version stricte comme **référence principale** ;
- utiliser la version V2 avec bras découverte comme **version opérationnelle enrichie** ;
- documenter systématiquement les deux sorties : `sélection_stricte` et `sélection_hybride_V2` ;
- comparer leurs performances dans la validation 1000G/EPIGEN puis sur la cohorte réunionnaise.

---

### 2.2 Étape 2 : Calcul du score S_div

Le score S_div agrège **4 dimensions complémentaires** de la diversité génétique. Il s'agit d'un **score heuristique additif**, choisi pour sa lisibilité, sa reproductibilité et sa facilité d'audit. Ces dimensions peuvent présenter des corrélations partielles (ex : PCA et ADMIXTURE reflètent toutes deux la structure ancestrale ; IBD et ROH co-varient dans les populations fondatrices) — l'analyse de sensibilité des poids (§4.4) et l'analyse leave-one-component-out (§4.5) testeront empiriquement leur redondance effective et détermineront si certaines composantes sont substituables.

**Principe clé — global vs par secteur** :

| Composante | Calculée sur | Raison |
|---|---|---|
| PCA | **2500 individus (global)** | Centroïdes secteurs correctement positionnés dans un espace commun non déformé |
| ADMIXTURE | **2500 individus (global)** | Modèle ancestral unique = q_k interprétables de façon identique dans tous les secteurs |
| IBD | Par secteur | Parenté évaluée dans le contexte local de sélection |
| ROH | **2500 individus (global)** | Métrique individuelle, non affectée par le groupe de calcul |

PCA et ADMIXTURE calculés globalement apportent deux garanties concrètes : (1) le centroïde de chaque secteur est positionné dans un espace commun à toute la cohorte — la marginalité intra-secteur est mesurée dans une géométrie non déformée, (2) les proportions q_k signifient la même chose pour tous les 2500 individus (q_1 "africain" vaut autant au Nord qu'au Sud). En revanche, la **normalisation locale** (min/max par secteur) rend les scores absolus non comparables entre secteurs — ce qui est sans conséquence puisque le classement et la stratification quintile n'opèrent **qu'au sein de chaque secteur**.

#### **Composante 1 : PCA — Position dans l'espace génétique**

**Objectif** : Capturer les individus qui occupent des positions extrêmes ou peu fréquentes dans l'espace génétique du secteur.

**Calcul** :
1. Réaliser une PCA **globale sur les 2500 individus** (espace génétique commun)
2. Pour chaque secteur, calculer le centroïde du secteur dans l'espace global PC1-PC5 :
   ```
   centroïde_secteur = (mean(PC1), mean(PC2), ..., mean(PC5))  pour tous i du secteur
   ```
3. Pour chaque individu i, calculer sa distance euclidienne au centroïde de **son secteur** :
   ```
   PCA_distance(i) = √((PC1(i)-c1)² + (PC2(i)-c2)² + ... + (PC5(i)-c5)²)
   ```
4. Normaliser **au sein du secteur** entre 0 et 1 :
   ```
   PCA_score(i) = (PCA_distance(i) - min_secteur) / (max_secteur - min_secteur)
   ```

**Pourquoi global** : une PCA par secteur produit des axes propres à chaque sous-groupe — le centroïde serait mal positionné et les distances biaisées. Une PCA globale garantit que les axes PC1-PC5 capturent la structure génétique de l'île entière, et que le centroïde de chaque secteur est positionné correctement dans cet espace. La normalisation locale qui suit ne remet pas en cause ce bénéfice : elle sert uniquement à ramener les distances à [0,1] pour l'agrégation pondérée dans S_div.

**Interprétation** : PCA_score proche de 1 → individu aux marges génétiques de son secteur, dans l'espace de référence commun à toute la cohorte.

---

#### **Composante 2 : ADMIXTURE — Composition ancestrale**

**Objectif** : Favoriser les individus avec des profils d'admixture informatifs au sein du secteur, qu'ils soient **rares**, **extrêmes** ou **fortement mélangés**. L'entropie ne mesure pas la rareté au sens strict ; elle capture surtout l'équilibre du mélange. Sa contribution doit donc être interprétée conjointement avec PCA_score et avec l'analyse leave-one-component-out (§4.5).

**Point critique : entropie ≠ rareté :**

L'entropie de Shannon favorise les profils très mélangés, mais elle peut sous-estimer des profils pourtant informatifs : par exemple un individu porteur d'une ascendance rare mais dominante, peu mélangé, peut avoir une entropie faible. Pour éviter cette limite, le bras découverte contrôlé peut intégrer une métrique complémentaire :

```
ADMIX_rarity(i) = distance(q_i, centroïde_q_secteur)
```

ou une version pondérée par rareté locale :

```
ADMIX_informative(i) = α × entropie(q_i)
                     + β × distance(q_i, centroïde_q_secteur)
                     + γ × rareté_locale(q_i)
```

Cette composante n'est pas nécessairement intégrée au score principal `S_div` de la version stricte, mais elle doit être testée dans le bras découverte 5–10% et dans l'analyse LOCO.

**Calcul** :
1. Déterminer K optimal par cross-validation (CV-error ADMIXTURE, K testé de 2 à 6) **sur les 2500 individus**
   - Pour La Réunion : K attendu = 4 (africain, indien, européen, malgache) — à confirmer empiriquement
   - Pour la validation 1000G : K déterminé selon la population proxy utilisée
2. Lancer ADMIXTURE **globalement sur les 2500** avec le K optimal → proportions q_k(i) pour chaque individu
3. Pour chaque individu i, calculer l'entropie de Shannon de son profil ancestral :
   ```
   ADMIX_score(i) = -Σ(k=1 à K) q_k(i) × log(q_k(i))
   ```
   où q_k(i) = proportion de l'ancêtrie k chez l'individu i dans le modèle global

4. Normaliser **au sein du secteur** entre 0 et 1 :
   ```
   ADMIX_score(i) = (entropie(i) - min_secteur) / (max_secteur - min_secteur)
   ```

**Pourquoi global** : ADMIXTURE par secteur produit un modèle ancestral propre à chaque sous-groupe — un secteur à majorité africaine et un secteur à majorité indienne auraient des axes k différents, rendant les q_k non-interprétables d'un secteur à l'autre. Un modèle global garantit que q_1 (ex: africain) signifie la même chose pour tous les 2500 individus. La normalisation locale de l'entropie qui suit (min/max par secteur) est correcte : on compare l'entropie d'un individu à celle de ses voisins géographiques, ce qui est l'objectif.

**Interprétation** : 
- ADMIX_score = 1 → individu avec K ancêtries à parts égales (profil maximalement mélangé)
- ADMIX_score = 0 → individu avec une seule ancêtrie dominante (parental ou peu mélangé)

---

#### **Composante 3 : IBD — Parenté et indépendance génétique**

**Objectif** : Favoriser les individus génétiquement isolés au sein du secteur (peu apparentés aux autres), et éviter la redondance génétique.

**Calcul** :
1. Calculer la matrice de parenté pairwise **au sein du secteur** avec PLINK/KING
2. Pour chaque individu i, identifier sa parenté maximale avec n'importe quel autre membre du secteur :
   ```
   IBD_score(i) = 1 - max_j IBD(i, j)    pour tout j ≠ i dans le secteur
   ```
   Les valeurs IBD sont bornées [0, 1], donc IBD_score(i) ∈ [0, 1] sans normalisation supplémentaire.

   *Justification du `max` vs `mean`* : utiliser la moyenne diluerait l'effet d'un seul apparentement proche. Un individu avec un jumeau (IBD=1) mais 99 non-apparentés (IBD≈0) aurait un score moyen élevé alors qu'il introduit une forte redondance. Le `max` pénalise dès qu'il existe un lien proche, ce qui est cohérent avec le critère d'exclusion de la contrainte dure.

3. **Contrainte dure** lors de la sélection greedy (en supplément du score) :
   ```
   IBD_threshold = 0.125
   # seuil à interpréter selon la métrique : PI_HAT vs kinship KING
   ```
   Un candidat est éliminé si IBD(candidat, tout individu déjà sélectionné) ≥ 0.125

**Interprétation** :
- IBD_score proche de 1 → individu non-apparenté à quiconque dans le secteur → information génétique nouvelle ✓
- IBD_score proche de 0 → individu qui a un proche parent dans le secteur → information redondante ✗

---

#### **Composante 4 : ROH — Runs of Homozygosity (effet fondateur local)**

**Objectif** : Dans le noyau principal, favoriser les individus avec peu de segments homozygotes longs afin de limiter la redondance et la consanguinité récente. Cependant, les profils à ROH élevés ne doivent pas être éliminés totalement : ils peuvent être très informatifs pour l'étude des effets fondateurs réunionnais. On distingue donc deux usages :
- `ROH_score` dans le score principal : privilégie la diversité générale ;
- `ROH_founder_score` dans le bras découverte : récupère des profils fondateurs ciblés.

**Calcul** :
1. Calculer les ROH **sur les 2500 individus** avec PLINK (`--homozyg`) — métrique individuelle, le groupe de calcul n'affecte pas le résultat
   - Longueur minimale : 1 Mb
   - Densité SNP : 1 SNP par 10 kb

2. Pour chaque individu i, calculer :
   ```
   total_ROH_length(i) = somme des longueurs de tous les ROH > 1 Mb
   ```

3. Score ROH — deux versions à comparer :

   **Version simple (référence opérationnelle)**
   ```
   ROH_score_simple(i) = max(0, 1 - (total_ROH_length(i) / 100 Mb))
   ```

   **Version empirique recommandée pour analyse de sensibilité**
   ```
   ROH_score_emp(i) = 1 - rank_percentile(total_ROH_length(i), secteur)
   ```
   ou, alternativement,
   ```
   ROH_score_emp(i) = 1 - (total_ROH_length(i) - min_secteur) / (max_secteur - min_secteur)
   ```

   **Version fondateur (bras découverte uniquement)**
   ```
   ROH_founder_score(i) = rank_percentile(total_ROH_length(i), secteur)
   ```
   ou, si des segments partagés sont détectés :
   ```
   ROH_founder_score(i) = f(longueur_ROH, partage_segmentaire, cluster_géographique)
   ```

**Justification** :
- le seuil fixe de `100 Mb` est simple et interprétable ;
- mais sa pertinence peut varier selon la densité de puce, la cohorte et la distribution réelle des ROH ;
- une normalisation empirique ou percentile permet de tester la robustesse du score ROH à la cohorte observée.

**Recommandation** : conserver `ROH_score_simple` comme version principale pour la reproductibilité, mais comparer systématiquement avec `ROH_score_emp` dans la validation 1000G puis sur la cohorte réunionnaise.

**Interprétation** : 
- ROH_score proche de 1 → peu de ROH, diversité locale élevée ✓
- ROH_score proche de 0 → beaucoup de ROH, individu très consanguin ✗

---

### 2.3 Agrégation — Score S_div final

**Au sein de chaque secteur**, le score S_div agrège les 4 composantes :

```
S_div(i) = w1 × PCA_score(i) 
         + w2 × ADMIX_score(i) 
         + w3 × IBD_score(i) 
         + w4 × ROH_score(i)
```

avec contraintes :
- w1 + w2 + w3 + w4 = 1
- IBD_threshold = 0.125 s'applique en **contrainte dure supplémentaire** lors de la sélection greedy (voir §3.3)
- **Valeurs par défaut (pré-validation)** :
  - w1 = 0.30 (diversité position génétique)
  - w2 = 0.30 (diversité ancestrale)
  - w3 = 0.25 (indépendance génétique)
  - w4 = 0.15 (qualité générale / effet fondateur)

*(Les poids seront optimisés et validés par l'étude préalable sur données 1000 Genomes — l'analyse de sensibilité déterminera si ces valeurs par défaut sont robustes ou si d'autres pondérations produisent systématiquement de meilleurs résultats. À ce stade, ils doivent être présentés comme des **poids de travail** et non comme des constantes théoriquement optimales.)*

**Clarification  :** `S_div` reste le score principal du noyau géographique. Le bras découverte contrôlé peut utiliser des scores additionnels ciblés (`ADMIX_rarity`, `ROH_founder_score`, utilité phasage/imputation). Ces scores ne doivent pas modifier silencieusement le panel principal : ils doivent produire une liste séparée, traçable, auditée, puis intégrée dans les 5–10% réservés.

---

### 2.4 Stratification par quintiles (au sein de chaque secteur)

**Problème** : Sélectionner uniquement les individus avec S_div élevé au sein d'un secteur crée un **biais directionnel** — on capture les profils "marginaux" mais on sous-représente les profils "typiques" du secteur.

**Solution** : Appliquer une **stratification par quintiles de S_div** pour contrôler le biais directionnel et garantir que la sélection au sein du secteur couvre la distribution complète de la diversité génétique.

#### **2.4.1 Allocation par quintiles (par secteur)**

1. Trier tous les individus du secteur par ordre décroissant de S_div
2. Diviser en 5 groupes égaux (ou proportionnels si N_secteur < 100)
3. **Allouer proportionnellement** :
   
   Si secteur a N_WGS = 50 individus à sélectionner :

   | Quintile | Profil | % | N sélectionnés |
   |---|---|---|---|
   | Q1 (scores élevés) | Extrêmes/marginaux | 20% | 10 |
   | Q2 | Au-dessus médiane | 20% | 10 |
   | Q3 (médiane) | **Typiques** | **30%** | **15** |
   | Q4 | Sous médiane | 20% | 10 |
   | Q5 (scores bas) | Ordinaires | 10% | 5 |
   | **Total** | — | **100%** | **50** |

   **Règles selon la taille du secteur** :
   
   | N_WGS alloué | Stratégie | Justification |
   |---|---|---|
   | ≥ 20 | Quintile (5 groupes : 20-20-30-20-10%) | Effectif suffisant pour 5 strates |
   | 6 à 19 | **Binaire (2 groupes : top 50% / bottom 50%)** | Maintient le principe anti-biais directionnel |
   | < 6 | S_div greedy seul | Trop petit pour toute stratification (< 1.7% cohorte) |

   *Le principe anti-biais directionnel est conservé dès N_WGS ≥ 6 — seuls les secteurs représentant moins de 1.7% de la cohorte y dérogent, et ils font l'objet d'une documentation explicite.*

#### **2.4.2 Justification**

- **Q3 (médiane) = 30%** : Les individus "typiques" du secteur forment l'anchor génétique local
- **Q1-Q2 = 40%** : Les profils extrêmes capturent la diversité rare du secteur
- **Q4-Q5 = 30%** : Les profils ordinaires garantissent une couverture plus complète et limitent le biais directionnel

**Stratification binaire (N_WGS = 6–19)** : allocation 60% top / 40% bottom
- *Top 50% S_div* (60% des WGS alloués) : favorise la diversité tout en limitant l'effet plafonnier
- *Bottom 50% S_div* (40% des WGS alloués) : ancre la sélection dans les profils représentatifs du secteur
- Ce ratio 60/40 reproduit l'esprit des quintiles (favoriser sans exclure) avec seulement 2 strates

**Principe commun** : quelle que soit la taille du secteur (≥ 6 WGS), la sélection ne peut jamais n'être que les individus en haut de la distribution S_div — un sous-ensemble du bas est toujours inclus.

**Garantie algorithmique** : le plafond par quintile (`n_to_select`) est vérifié par un compteur `selected_in_quintile` indépendant du total secteur. La contrainte IBD peut vider un quintile (aucun candidat non-apparenté disponible) — dans ce cas, le quota non rempli est perdu (non reporté sur le quintile suivant), ce qui peut réduire légèrement N total ; ce cas doit être tracé et documenté dans le rapport de sélection.

---

## 3. Pipeline de sélection

### 3.1 Étape 1 : Contrôle qualité des SNP

```
Données brutes puce SNP (2500 individus, tous secteurs)
         ↓
QC variant :
- MAF ≥ 1%  ← filtre sur les marqueurs PUCE utilisés pour S_div
- Taux de manquants < 2–5%
- HWE p > 1e-6, idéalement évalué avec prudence par strate
- Exclusion SNP ambigus A/T et C/G si harmonisation inter-références
- Harmonisation build / strand / position
- LD pruning pour PCA et ADMIXTURE
         ↓
QC individu :
- Taux de manquants < 2–5%
- Hétérozygotie extrême : |z| > 3 à examiner
- Sex check
- Duplicats / apparentements inattendus
- Contrôle batch / plaque / extraction
- Contamination estimée si données disponibles
         ↓
~2.5M SNP conservés (marqueurs puce, pour calcul S_div uniquement)
```

**Point de vigilance : HWE en population admixée :** un test HWE appliqué globalement à une population structurée peut retirer des marqueurs informatifs par effet Wahlund. Le filtre HWE doit donc être utilisé comme indicateur de qualité technique, et non comme critère aveugle d'exclusion biologique. Une analyse par strate ou après contrôle de structure est recommandée.

**Important — distinction puce vs WGS** : ce filtre MAF ≥ 1% s'applique exclusivement aux **marqueurs SNP de la puce** utilisés pour calculer les scores S_div (PCA, ADMIXTURE, IBD, ROH). Il est standard en génomique des populations pour éviter le bruit des variants très rares dans les analyses multivariées. Il ne concerne pas les variants que le **séquençage WGS** découvrira : le référentiel WGS final capturera des variants à n'importe quelle fréquence, y compris MAF < 1%, selon la couverture calculée en §1.2.

---

### 3.2 Étape 2 : Calcul des composantes

**Deux niveaux de calcul — durée estimée : 3-4 jours**

```
NIVEAU 1 — GLOBAL (sur les 2500 individus, une seule fois) :

    ├─ PCA globale (plink --pca)
    │  → Coordonnées PC1-PC5 pour tous les 2500
    │
    ├─ ADMIXTURE K optimal (CV-error, K=2..6)
    │  → Proportions q_k(i) pour tous les 2500 (modèle ancestral commun)
    │
    └─ ROH (plink --homozyg)
       → ROH_score(i) pour tous les 2500

NIVEAU 2 — PAR SECTEUR (parallélisable sur 7-8 secteurs) :

    Pour chaque secteur géographique :
        ├─ PCA_score : distance au centroïde du secteur dans l'espace PCA global
        │  → PCA_score(i) normalisé dans le secteur
        │
        ├─ ADMIX_score : entropie de Shannon des q_k globaux
        │  → ADMIX_score(i) normalisé dans le secteur
        │
        ├─ IBD pairwise intra-secteur (plink --king)
        │  → IBD_score(i) = 1 - max_j IBD(i,j) dans le secteur
        │
        └─ Agrégation S_div = w1×PCA + w2×ADMIX + w3×IBD + w4×ROH
           → S_div(i) pour tous i du secteur (classement local)
```

---

### 3.3 Étape 3 : Sélection stratifiée par secteur

**Algorithme greedy stratifié (par secteur) :**

```python
selected_total = []

for secteur in ["Nord", "Nord-Est", ..., "Nord-Ouest"]:
    
    # Allocation pour ce secteur
    N_secteur_WGS = round(proportion_secteur * 350)
    
    # Récupérer tous les individus du secteur
    individuals_secteur = get_individuals_by_sector(secteur)
    
    if N_secteur_WGS >= 20:
        # GRANDE SECTEUR : stratification quintile
        
        # Diviser en quintiles par S_div
        quintiles = divide_into_quintiles(individuals_secteur, 5)
        
        # Allocation par quintile (adaptée à N_secteur_WGS)
        allocations = {
            "Q1": round(0.20 * N_secteur_WGS),
            "Q2": round(0.20 * N_secteur_WGS),
            "Q3": round(0.30 * N_secteur_WGS),  # Médiane (anchor)
            "Q4": round(0.20 * N_secteur_WGS),
            "Q5": round(0.10 * N_secteur_WGS)
        }
        
        # Sélection greedy au sein de chaque quintile
        for quintile_label in ["Q1", "Q2", "Q3", "Q4", "Q5"]:
            candidates = quintiles[quintile_label]
            n_to_select = allocations[quintile_label]
            selected_in_quintile = 0                        # ← compteur par quintile
            
            for candidate in sorted(candidates, key=lambda i: S_div(i), reverse=True):
                if selected_in_quintile >= n_to_select:     # ← plafond par quintile
                    break
                
                # Vérifier IBD (non-parenté avec TOUS les sélectionnés cross-secteur)
                is_unrelated = all(IBD(candidate, sel) < 0.125 for sel in selected_total)
                
                if is_unrelated:
                    selected_total.append(candidate)
                    selected_in_quintile += 1               # ← incrément compteur
    elif N_secteur_WGS >= 6:
        # SECTEUR INTERMÉDIAIRE (6–19 individus WGS) : stratification binaire top/bottom 50%
        
        sorted_sector = sorted(individuals_secteur, key=lambda i: S_div(i), reverse=True)
        mid = len(sorted_sector) // 2
        top_half    = sorted_sector[:mid]   # top 50% S_div
        bottom_half = sorted_sector[mid:]   # bottom 50% S_div
        
        n_top    = round(0.60 * N_secteur_WGS)
        n_bottom = N_secteur_WGS - n_top    # = round(0.40 * N_secteur_WGS)
        
        for group, n_target in [(top_half, n_top), (bottom_half, n_bottom)]:
            selected_in_group = 0
            for candidate in group:
                if selected_in_group >= n_target:
                    break
                is_unrelated = all(IBD(candidate, sel) < 0.125 for sel in selected_total)
                if is_unrelated:
                    selected_total.append(candidate)
                    selected_in_group += 1
    
    else:
        # TRÈS PETIT SECTEUR (< 6 individus WGS) : S_div greedy seul
        # Documenter explicitement ce cas (< 1.7% de la cohorte)
        
        for candidate in sorted(individuals_secteur, key=lambda i: S_div(i), reverse=True):
            if len([s for s in selected_total if s in individuals_secteur]) >= N_secteur_WGS:
                break
            
            is_unrelated = all(IBD(candidate, sel) < 0.125 for sel in selected_total)
            
            if is_unrelated:
                selected_total.append(candidate)

return selected_total  # 350 individus total, stratifiés géographiquement + optimisés localement
```

**Résultat** : Liste des 350 IDs à séquencer en WGS.

#### **3.3.1 Procédure de récupération des quotas**

La version précédente indiquait qu'un quota vidé par la contrainte IBD pouvait être perdu. Cette règle est prudente, mais elle peut empêcher d'atteindre exactement 350 WGS. La V2 introduit donc une récupération contrôlée :

1. **Même quintile / même secteur** : chercher le candidat suivant compatible IBD.
2. **Quintile voisin / même secteur** : si aucun candidat compatible n'est disponible, chercher dans la strate adjacente.
3. **Même secteur / tous quintiles** : préserver d'abord la représentativité géographique.
4. **Pool libre insulaire** : si le secteur ne peut plus fournir de candidat compatible, utiliser le bras découverte contrôlé.
5. **Dérogation documentée** : toute substitution est tracée dans le rapport final.

Cette procédure permet de maintenir l'objectif de 350 WGS sans masquer les contraintes imposées par la parenté ou par les petits effectifs.

**Note — ordre de traitement des secteurs** : la contrainte IBD étant vérifiée contre `selected_total` (qui grandit à chaque secteur), les secteurs traités en fin de liste font face à plus d'exclusions cross-secteur potentielles que les premiers. Pour limiter cet effet, traiter les secteurs **par ordre décroissant de taille** (les grands secteurs en premier) afin que les contraintes IBD les plus structurantes soient établies tôt. L'ordre exact doit être documenté dans le rapport de sélection.

**Avantages** :
- ✓ Représentativité géographique garantie (100%) dans la version stricte
- ✓ Métriques PCA/ADMIXTURE globales → centroïdes correctement positionnés, q_k interprétables de façon identique dans tous les secteurs (la normalisation locale rend les scores absolus non comparables entre secteurs, ce qui est sans conséquence : classement et stratification n'opèrent qu'au sein de chaque secteur)
- ✓ Pas de biais directionnel : quintile (N≥20), binaire 60/40 (N 6–19), greedy seul (<6)
- ✓ Contrainte IBD vérifiée cross-secteur (IBD(candidat, tous les déjà sélectionnés)) — évite la parenté entre secteurs également
- ✓ Exception greedy-seul documentée et limitée à < 1.7% de la cohorte

#### **3.3.2 Robustesse de l'algorithme greedy — multi-ordre / multi-seed**

L'algorithme greedy reste dépendant de l'ordre de traitement des secteurs et, à l'intérieur des groupes, d'éventuels ex-aequo. Pour objectiver cette dépendance, ajouter une étape de robustesse :

1. Exécuter l'algorithme sur **plusieurs ordres de secteurs** :
   - décroissant de taille,
   - aléatoire (≥ 100 permutations),
   - ordres extrêmes (plus petit → plus grand).

2. Répéter avec **plusieurs seeds** pour les composantes stochastiques (ADMIXTURE, simulations, éventuels tie-breakers).

3. Mesurer :
   - taille de l'intersection entre sélections (`|A ∩ B| / 350`) ;
   - variance des métriques de sortie (couverture allélique, KS, représentation ancestrale) ;
   - fréquence de sélection de chaque individu sur l'ensemble des runs.

**Livrables recommandés** :
- une **sélection consensus** (individus présents dans ≥ X% des runs) ;
- un **indice de stabilité** global de la méthodologie ;
- la liste des individus "frontière" sélectionnés de manière instable.

**Interprétation** :
- stabilité élevée → le greedy est acceptable comme approximation opérationnelle ;
- stabilité faible → envisager une formulation plus explicite en problème de couverture maximale sous contraintes.

---

## 4. Étude de validation préalable

### 4.1 Objectif

**Démontrer que la logique de sélection S_div est mathématiquement fondée**, indépendamment de la structure ancestrale spécifique d'une population.

L'argument est le suivant : si S_div (diversité positionnelle + diversité ancestrale + indépendance génétique + qualité générale) surpasse systématiquement les approches naïves **sur des populations admixées de structures différentes**, alors sa logique est **robuste et transférable** — y compris à La Réunion. Ce n'est pas la population proxy qui doit "ressembler" à La Réunion, c'est la **logique du score** qui doit se montrer supérieure quelle que soit la structure d'admixture testée.

**Périmètre de la validation** : cette étude valide les **4 composantes du score S_div** et leur capacité combinée à maximiser la diversité tout en minimisant le biais directionnel. Elle ne valide pas la **stratification géographique** (contrainte première de l'architecture), qui dépend de la distribution démographique réelle de la cohorte EFS réunionnaise et ne peut être testée sur des données publiques 1000G. La stratification géographique sera validée par le seul déploiement réel sur la cohorte.

### 4.2 Protocole sur données publiques (1000 Genomes)

#### **4.2.1 Datasets de validation — trois structures d'admixture distinctes**

Pour démontrer la généralisabilité de la logique S_div, utiliser **trois groupes de populations admixées** du projet 1000 Genomes, couvrant des structures ancestrales différentes :

**Groupe 1 — Admixture africain/européen (N=157)**

| Population | Code | N | Profil |
|---|---|---|---|
| African Caribbeans (Barbados) | ACB | 96 | Africain + Européen |
| African Americans (SW USA) | ASW | 61 | Africain + Européen + Amérindien |
| **Total** | — | **157** | |

**Groupe 2 — Admixture sud-asiatique/européen (N≈200)**

| Population | Code | N | Profil |
|---|---|---|---|
| Gujarati Indians (Texas) | GIH | ~103 | Sud-asiatique + Européen (proche ancêtrie indienne réunionnaise) |
| Bengali (Bangladesh) | BEB | ~86 | Sud-asiatique (structure différente de GIH) |
| **Total** | — | **~189** | |

**Groupe 3 — Admixture tri-ancestrale simulée (N=150)**

Construire un dataset synthétique à 3 ancêtries à partir de populations parentales 1000G (YRI + CEU + CHB) par simulation de croisements (outil `AdmixSim` ou simulation PLINK) :

| Profil simulé | Proportions | N |
|---|---|---|
| Très mélangé | YRI 33% / CEU 33% / CHB 33% | 50 |
| Bimétis | YRI 50% / CEU 50% | 50 |
| Partial | YRI 70% / CEU 20% / CHB 10% | 50 |

**Argumentaire** : si S_div stratifié surpasse les alternatives sur les 3 groupes (structures africain/européen, sud-asiatique, et tri-ancestrale simulée), la logique est démontrée indépendamment de la structure spécifique réunionnaise.

**Note technique — alignement des labels ADMIXTURE** : ADMIXTURE étant stochastique, les composantes q_k peuvent être permutées entre deux exécutions indépendantes (q_1 = "africain" dans un run peut devenir q_2 dans un autre). Chaque groupe 1000G sera analysé avec son propre modèle ADMIXTURE → les labels doivent être alignés manuellement (ou via `pong`) avant toute comparaison inter-groupes. Cela ne crée pas d'ambiguïté dans l'entropie de Shannon (invariante à la permutation des labels), mais est crucial pour l'interprétation des q_k individuels.

#### **4.2.2 Scénarios testés**

Pour chaque niveau de contrainte budgétaire (appliqué proportionnellement à chaque groupe) :

| Scénario | Proportion | Groupe 1 (N=157) | Groupe 2 (N=189) | Groupe 3 (N=150) |
|---|---|---|---|---|
| Contrainte forte | 25% | 39 | 47 | 38 |
| Contrainte modérée | 50% | 79 | 95 | 75 |
| Contrainte faible | 75% | 118 | 142 | 113 |

Pour chaque scénario, comparer 5 stratégies de sélection :

1. **S_div naïf** (sélection pure sur S_div, sans stratification) — test de biais directionnel
2. **S_div stratifié** (avec stratification quintile) — méthode proposée
3. **Random** (tirage aléatoire, 100 répétitions, moyenne)
4. **PCA-only** (sélection sur diversité PCA seule)
5. **Maximin IBD** (maximiser distance de parenté seule)

#### **4.2.3 Métriques de qualité**

Pour chaque sélection, mesurer :

| Métrique | Formule | Interprétation |
|---|---|---|
| **Couverture allélique** | `\|variants(sélection)\| / \|variants(total)\|` | % de variants totaux capturés |
| **Variants rares** | % variants capturés avec MAF < 5% | Qualité pour détection variants rares |
| **Représentation ancestrale** | Divergence KL(distribution ancestrale sélection vs total) | La sélection est-elle représentative ? |
| **Éviter parenté** | % de paires IBD > 0.125 dans sélection | Efficacité à éviter redondance génétique |
| **Couverture PCA** | Variance expliquée dans l'espace sélectionné vs total | Capture-t-on la diversité positionnelle ? |
| **Biais directionnel** | Kolmogorov-Smirnov : distribution S_div(sélection) vs S_div(total) | La sélection reflète-t-elle la population ou les extrêmes ? |

**Critère de succès (logique confirmée)** : S_div stratifié doit obtenir un KS < 0.10 (biais faible) ET une couverture allélique supérieure au tirage aléatoire **sur les 3 groupes de populations**. La cohérence entre groupes prime sur la performance absolue sur un seul groupe.

**Validation spécifique au design puce → WGS :** comme la sélection réelle partira de marqueurs de puce SNP et non d'un WGS complet, il est recommandé d'ajouter une simulation de dégradation :
1. partir de données WGS 1000G/EPIGEN ;
2. restreindre artificiellement aux SNPs disponibles sur la puce envisagée ;
3. calculer `S_div` sur la version puce ;
4. évaluer la couverture réelle des variants WGS récupérés par les individus sélectionnés.

Cette étape teste la question critique : *un score calculé sur puce SNP permet-il réellement de sélectionner les individus qui maximisent l'information WGS ?*

#### **4.2.4 Résultats attendus (qualitatifs)**

Les chiffres ci-dessous sont **purement hypothétiques**, destinés à illustrer la logique des comparaisons. Aucune valeur numérique ne sera retenue avant l'exécution réelle du script sur les données 1000G.

**Comportements attendus par stratégie (logique qualitative) :**

| Stratégie | Couverture allélique | Biais directionnel (KS) | Comportement attendu |
|---|---|---|---|
| **S_div naïf** | Élevée | **Élevé** | Capture l'information maximimale mais sur-représente les profils extrêmes |
| **S_div stratifié** | Légèrement inférieure | **Faible** | Compromis optimal : couverture solide + représentation honnête de la distribution |
| Random | Basse | Neutre | Baseline de référence ; ne maximise rien mais ne biaise pas |
| PCA-only | Haute sur PC | Élevé | Excelle sur variance positionnelle, rate les variants ancestraux rares |
| Maximin IBD | Modérée | Modéré | Élimine la parenté mais peut perdre des profils ancestraux rares |

**Logique à valider** : S_div stratifié doit présenter un **KS significativement inférieur** à S_div naïf (confirmation que la stratification quintile élimine le biais directionnel), et une **couverture allélique significativement supérieure** au tirage aléatoire (confirmation que S_div maximise l'information).

Si ce profil de résultats se reproduit sur les 3 groupes 1000G (africain/européen, sud-asiatique, tri-ancestral), la logique S_div est **démontrée indépendamment de la population cible**.

---

### 4.3 Généralisabilité de la méthode S_div

**Argument central** : S_div n'est pas une méthode "pour La Réunion" — c'est un **cadre générique de sélection optimale** pour toute cohorte d'individus admixés sous contrainte budgétaire. Ses 4 composantes (position génétique, composition ancestrale, indépendance, qualité) sont universellement applicables.

| Propriété de S_div | Justification universelle |
|---|---|
| PCA globale, scoring intra-secteur | Espace commun à toute la cohorte ; diversité positionnelle comparable entre groupes |
| Entropie ancestrale (modèle global) | Mesure le degré d'admixture sans supposer d'ancêtries spécifiques |
| Indépendance IBD (max_j) | Maximise l'information non-redondante dans tout groupe |
| ROH score | Pénalise la consanguinité, universellement indésirable |
| Stratification quintile / binaire | Évite le biais directionnel dans toute distribution, quelle que soit la taille |

**Populations pour lesquelles la même logique s'appliquerait** :
- Brésil : admixture africain/européen/amérindien (Naslavsky 2022 → structure différente mais même logique)
- Antilles : admixture similaire à ACB/ASW
- Afrique du Sud : Coloured population (africain/européen/malais)
- Maurice : admixture indien/africain/européen (très proche de La Réunion)

**Implication pour la validation** : tester S_div sur ACB/ASW (africain/européen) ET sur GIH/BEB (sud-asiatique) constitue une preuve de concept multistructurale suffisante pour justifier son application réunionnaise, même sans proxy parfait incluant des Malgaches ou des Indiens océaniens.

---

### 4.4 Analyse de sensibilité des poids

Pour garantir que S_div n'est pas arbitraire, tester sa robustesse :

```
Pour chaque poids w ∈ {w1, w2, w3, w4} :
    Faire varier w de -10% à +10%
    Réapplier sélection S_div
    Mesurer variance des 6 métriques
```

**Résultat attendu** : Si variance < 5% → poids robustes → méthodologie défendable.

**Interprétation** : une faible sensibilité aux poids signifie que le classement final est stable quelle que soit la pondération exacte — les composantes se renforcent mutuellement. Si la variance est élevée (>10%), le résultat dépend fortement du choix des poids : les composantes capturent des dimensions vraiment distinctes mais leur calibration relative est critique → les poids devront être optimisés sur les résultats 1000G avant déploiement réunionnais. Dans les deux cas, le score reste défendable ; c'est la précision requise sur les poids qui diffère.

### 4.5 Analyse leave-one-component-out (LOCO)

Pour objectiver la contribution réelle de chaque composante et éviter qu'une variable redondante domine artificiellement S_div, exécuter une analyse LOCO :

- `S_div_full = PCA + ADMIX + IBD + ROH`
- `S_div_-PCA = ADMIX + IBD + ROH`
- `S_div_-ADMIX = PCA + IBD + ROH`
- `S_div_-IBD = PCA + ADMIX + ROH`
- `S_div_-ROH = PCA + ADMIX + IBD`

**Mesures à comparer** :
- variation de la couverture allélique ;
- variation du KS (biais directionnel) ;
- proportion d'individus remplacés dans la sélection finale ;
- stabilité des performances sur les 3 groupes 1000G.

**Objectif** :
- identifier les composantes réellement indispensables ;
- documenter les recouvrements entre PCA et ADMIXTURE ;
- quantifier la valeur ajoutée propre de ROH au-delà de l'IBD.

---

## 5. Considérations pratiques — Réunion

### 5.1 Paramètres spécifiques à adapter

Une fois validé sur 1000G, les paramètres suivants devront être finalisés pour La Réunion :

| Paramètre | Approche validation 1000G | À finaliser Réunion |
|---|---|---|
| K (ADMIXTURE) | Déterminé par CV-error par groupe | CV-error sur les 2500 (attendu K=4) |
| IBD seuil | 0.125 (cousins) | Adapter si effet fondateur extrême |
| ROH seuil | 100 Mb | À valider sur cohorte réelle |
| Poids w1..w4 | 0.3, 0.3, 0.25, 0.15 → optimiser si sensibilité > 5% | À re-calibrer sur résultats 1000G |
| Seuil quintile | 20 individus | Adapter selon secteurs avec < 20 |

### 5.2 Interactions avec partenaires

- **EFS** : échantillonnage, informations secteur/région, consentement
- **CHU Réunion** : fournit les 2500 génotypes SNP, logistique, extraction ADN, QC
- **Epitech / partenaires bio** : informatique, bioinformatique
- **Illumina / plateforme séquençage, POPgen** : WGS des 350 sélectionnés

---

## 6. Risques et limitations

### 6.1 Risques scientifiques

| Risque | Cause | Mitigation |
|---|---|---|
| **Biais puce SNP** | SNPs choisis reflètent bias eurocentré | Accepter et documenter ; valider sur 1000G |
| **Variants rares manqués** | Même optimisé, 350 < 2500 = perte information | Documenter couverture variants < 1% |
| **Secteurs très petits** | N_WGS < 6 = pas de stratification possible | S_div seul documenté ; cas < 1.7% cohorte |
| **Poids arbitraires** | Choix de w1, w2, w3, w4 sans justification | Validation 1000G + analyse sensibilité |
| **Fréquences WGS biaisées** | Panel enrichi, non aléatoire | Recalibrage sur les 2500 SNP par pondération / imputation |
| **ROH fondateurs sous-capturés** | Score principal pénalise les ROH élevés | Bras découverte ROH/fondateur 5–10% |
| **Seuil IBD ambigu** | PI_HAT et kinship KING non équivalents | Définir métrique, seuil et interprétation dans le rapport |

### 6.2 Limitations acceptables

- ✓ **À accepter** : 14% WGS (350/2500) est plus petit que Naslavsky 2022 (1171 brésiliens), mais financièrement réaliste
- ✓ **À documenter** : Variants avec fréquence < 1% ne seront pas fiablement captés
- ✓ **À compenser** : Les 2150 individus génotypés (non séquencés) restent informatifs pour génomique populationnelle, imputation et recalibrage des fréquences
- ✓ **À expliciter** : Le panel WGS est un panel hybride de découverte/imputation ; les fréquences brutes des 350 WGS ne doivent pas être présentées comme fréquences populationnelles définitives sans pondération

---

## 7. Livrables et timeline

### 7.1 Phase 1 : Validation (8 semaines)

| Semaine | Tâche | Livrable |
|---|---|---|
| 1 | Téléchargement 1000G (ACB/ASW + GIH/BEB) + preprocessing | Datasets 1000G QC |
| 2 | Simulation dataset tri-ancestral (YRI+CEU+CHB) | Dataset synthétique |
| 3 | PCA + ADMIXTURE (CV-error → K optimal par groupe) | Scores PCA/ADMIX par groupe |
| 4 | IBD + ROH par groupe | Scores IBD/ROH par groupe |
| 5 | Agrégation S_div + 5 stratégies de sélection | Sélections testées (3 groupes × 3 budgets × 5 stratégies) |
| 6 | Benchmark vs alternatives — métriques + version stricte vs hybride V2 | Tableau métriques réel |
| 7 | Analyse sensibilité des poids + LOCO + stabilité multi-ordre + simulation puce→WGS | Rapport sensibilité/robustesse |
| 8 | Synthèse : cohérence inter-groupes + rapport final | Rapport de validation + recommandations K/poids/algorithme |

**Livrable final** : Rapport démontrant que la logique S_div est robuste sur 3 structures d'admixture différentes → justification scientifique pour déploiement Réunion

### 7.2 Phase 2 : Déploiement Réunion (8-10 semaines)

| Semaine | Tâche | Livrable |
|---|---|---|
| 1-2 | Réception génotypes SNP 2500 EFS + secteurs | Données PLINK QC + cartographie secteurs |
| 3 | PCA + ADMIXTURE + ROH **globaux** sur les 2500 | Coordonnées PCA, proportions q_k, ROH_score |
| 4 | IBD intra-secteur (parallélisé) + calcul S_div par secteur | Matrices IBD + classements S_div par secteur |
| 5 | Sélection 350 individus (version stricte + version hybride V2) | Liste de 350 IDs + répartition par secteur + justification du bras découverte |
| 6-8 | Coordination WGS + extractions ADN | 350 échantillons en séquençage |
| 9-10 | Premiers résultats WGS | BAMs/VCFs préliminaires |

---

## 8. Références

**Méthodologie et équité génomique :**
- Martin AR, et al. (2019). Clinical use of current polygenic risk scores may exacerbate health disparities. *Nature Genetics*, 51(4):584-591.
- Fatumo S, et al. (2022). A roadmap to increase diversity in genomic studies. *Nature Medicine*, 28(2):243-250.
- Sirugo G, Williams SM, Tishkoff SA. (2019). The Missing Diversity in Human Genetic Studies. *Cell*, 177(1):26-31.

**Populations admixées et WGS stratégique :**
- Naslavsky MS, et al. (2022). Whole-genome sequencing of 1,171 elderly admixed individuals from São Paulo, Brazil. *Nature Communications*, 13(1):1004.
- Nunes K, et al. (2025). Admixture's impact on Brazilian population evolution and health. *Science*, 388(6748):eadl3564.

**Analyses génétiques de population :**
- Tournebize R, et al. (2022). Reconstructing the history of founder events using genome-wide patterns of allele sharing across individuals. *PLoS Genetics*, 18(6):e1010243.
- Kirin M, et al. (2010). Genomic runs of homozygosity record population history and consanguinity. *PLoS One*, 5(11):e13996.

**Outils bioinformatiques :**
- Chang CC, et al. (2015). Second-generation PLINK: rising to the challenge for larger and richer datasets. *GigaScience*, 4(1):7.
- Alexander DH, Novembre J, Lange K. (2009). Fast model-based estimation of ancestry in unrelated individuals. *Genome Research*, 19(9):1655-1664.

---

## 9. Auteurs et versioning

| Version | Date | Auteur | Changements |
|---|---|---|---|
| 1.0 | 2026-04-21 | Équipe Génome Réunion | Document initial |
| 2.0 | 2026-04-21 | Révision | Réarchitecture complète : stratification géographique + S_div par secteur |
| 3.0 | 2026-04-21 | Révision | Correction formule IBD_score ; K ADMIXTURE générique (CV) ; tables illustratives labelisées ; proxy 1000G étendu à 3 groupes ; ajout argument généralisabilité |
| 3.1 | 2026-04-21 | Révision | IBD_score = 1 - max_j IBD(i,j) ; stratification binaire (60/40) pour N_WGS 6–19 ; cohérence anti-biais directionnel tous secteurs |
| 3.2 | 2026-04-21 | Révision | PCA et ADMIXTURE calculés globalement sur les 2500 → métriques comparables inter-secteurs ; IBD reste intra-secteur ; pipeline niveau 1/2 |
| 3.3 | 2026-04-21 | Révision | Cohérence complète : §7.2 corrigé (global vs par secteur) ; §4.3 label PCA corrigé ; label flip ADMIXTURE documenté (pong) ; --seed=42 Annexe A ; IBD cross-secteur explicité ; flowchart §1.3 mis à jour |
| 3.4 | 2026-04-21 | Révision | Ajout §1.2 justification statistique N=350 : P(détection) = 1-(1-MAF)^700, seuil MAF≥1%, tableau comparatif bibliographique |
| 3.5 | 2026-04-21 | Révision finale | §3.1 : clarification MAF puce SNP ≠ WGS output ; §4.1 : périmètre validation explicité (S_div validé, stratification géo hors portée 1000G) |
| 3.6 | 2026-04-21 | Correction critique | Bug algorithmique §3.3 : ajout compteur selected_in_quintile (n_to_select jamais vérifié) ; reformulation comparabilité §2.2 (normalization locale ≠ comparabilité inter-secteurs) ; garantie algorithmique documentée §2.4.2 |
| 3.7 | 2026-04-21 | Corrections finales | "indépendantes" → "complémentaires" + note corrélation ; table §2.2 header corrigé ; ordre secteurs décroissant documenté ; rounding arrondi géré ; scénarios §4.2.2 en proportions par groupe |
| 3.8 | 2026-04-21 | Corrections finales | §3.3 bullet "comparables entre secteurs" corrigé (normalisation locale ≠ comparabilité) ; §4.4 interprétation variance corrigée (haute variance = calibration critique, non redondance) |

| 3.9 | 2026-04-21 | Révision critique | Ajout positionnement heuristique, variante pool libre 5–10%, score ROH empirique en sensibilité, robustesse multi-ordre/multi-seed, analyse LOCO des composantes |
| 4.0 / V2 renforcée | 2026-04-27 | Révision méthodologique | Clarification panel découverte vs fréquences ; bras découverte 5–10% explicité ; récupération des quotas ; QC renforcé ; seuil IBD clarifié ; ROH fondateur distingué du ROH diversité ; simulation puce→WGS ajoutée |

---

## Annexe A : Commandes PLINK/ADMIXTURE de référence

```bash
# QC variant — version minimale
plink2 --vcf data.vcf.gz \
  --maf 0.01 \
  --geno 0.05 \
  --hwe 1e-6 \
  --make-pgen \
  --out data_qc

# QC individu complémentaire recommandé
plink2 --pfile data_qc \
  --missing sample-only \
  --check-sex \
  --het \
  --out qc_individuals

# LD pruning pour PCA / ADMIXTURE
plink2 --pfile data_qc \
  --indep-pairwise 200kb 50 0.2 \
  --out data_qc_pruned

plink2 --pfile data_qc \
  --extract data_qc_pruned.prune.in \
  --make-pgen \
  --out data_qc_ldpruned

# ── NIVEAU 1 : calculs GLOBAUX sur les 2500 ──────────────────

# PCA globale
plink2 --pfile data_qc_ldpruned \
  --pca 10 \
  --out pca_global

# ROH global
plink --bfile data_qc \
  --homozyg \
  --homozyg-window-snp 50 \
  --homozyg-snp 50 \
  --homozyg-kb 1000 \
  --out roh_global

# ADMIXTURE — déterminer K optimal par cross-validation (K=2 à 6)
# --seed fixé pour reproductibilité
for K in 2 3 4 5 6; do
    admixture --cv --seed=42 data_qc_ldpruned.bed $K | tee admixture_K${K}.log
done
# Sélectionner K avec CV-error minimal
grep "CV error" admixture_K*.log

# Puis lancer avec K optimal (ex: K=4 pour La Réunion)
admixture --seed=42 data_qc_ldpruned.bed 4
# → fichier data_qc.4.Q : proportions ancestrales pour les 2500 individus
# Note : les labels k peuvent différer entre runs indépendants (label flip)
# → utiliser pong ou alignement manuel si comparaison multi-runs nécessaire

# ── NIVEAU 2 : calculs PAR SECTEUR ───────────────────────────

# IBD intra-secteur (parallélisable)
plink --bfile data_qc \
  --keep sector_A.txt \
  --king-cutoff 0.125 \
  --out ibd_sector_A

# PCA_score et ADMIX_score calculés en Python à partir des
# fichiers globaux (pca_global.eigenvec, admixture_K4.Q)
# en filtrant par secteur → normalisation locale
```

---

**Document conforme à AGENTS.md — méthodologie publiable, reproductible, stratifiée géographiquement + optimisée génétiquement**
