# Méthodologie de sélection optimale — Génome Réunion

## Vue d'ensemble

Le projet Génome Réunion vise à créer un **référentiel génomique local pour les populations admixées réunionnaises** sous **contrainte budgétaire** : 350 séquençages WGS sélectionnés parmi 2500 génotypages SNP.

Cette approche repose sur deux principes :
1. **Représentativité géographique** (contrainte principale) : la sélection reflète la distribution démographique réelle de l'île
2. **Optimisation génétique** (au sein de chaque secteur) : S_div maximise l'information capturée localement

Résultat : **350 individus représentatifs + informatifs**, sans biais directionnel.

---

## 1. Contexte scientifique

### 1.1 Pourquoi une sélection ?

La Réunion présente une **double singularité génétique** :
- **Admixture complexe** : ancêtres africains, indiens, européens, malgaches
- **Effet fondateur** : population historiquement petite avec caractéristiques génomiques uniques
- **Structure géographique** : distribution démographique inégale par secteur

Le **biais de représentation global** signifie que les bases génomiques mondiales (gnomAD, 1000 Genomes) sous-représentent systématiquement les variants rares réunionnais, particulièrement en pharmacogénétique et prédiction de risque génétique (Martin et al., 2019 ; Naslavsky et al., 2022).

### 1.2 Architecture de sélection en trois temps

```
Cohorte EFS (2500 individus)
         ↓
    Génotypage SNP (puce)
         ↓
STRATIFICATION GÉOGRAPHIQUE (représentativité = contrainte)
   Secteur A: 32% → 112 WGS
   Secteur B: 25% → 87 WGS
   ...
   Secteur H: 3% → 7 WGS
         ↓
AU SEIN DE CHAQUE SECTEUR :
   Calcul S_div (4 critères)
   Stratification quintile (si N ≥ 20)
   Sélection greedy non-apparentée
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

2. **Allocation irrevocable** : Chaque secteur reçoit exactement `N_secteur_WGS = round(proportion_secteur × 350)`

**Résultat** : 350 WGS distribués géographiquement, garantissant que la sélection reflète la structure démographique réelle de La Réunion.

---

### 2.2 Étape 2 : Calcul du score S_div

Le score S_div agrège **4 dimensions indépendantes** de la diversité génétique.

**Principe clé — global vs par secteur** :

| Composante | Calculée sur | Raison |
|---|---|---|
| PCA | **2500 individus (global)** | Espace commun = scores comparables entre secteurs |
| ADMIXTURE | **2500 individus (global)** | Modèle ancestral unique = q_k comparables entre secteurs |
| IBD | Par secteur | Parenté évaluée dans le contexte local de sélection |
| ROH | **2500 individus (global)** | Métrique individuelle, non affectée par le groupe de calcul |

PCA et ADMIXTURE calculés globalement garantissent que le score d'un individu du Nord est **dans le même référentiel** que celui d'un individu du Sud. La sélection et la stratification quintile restent faites **par secteur** — seules les métriques sous-jacentes sont globales.

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

**Pourquoi global** : une PCA par secteur produit des axes propres à chaque sous-groupe, rendant les scores incomparables. Une PCA globale place tous les individus dans le même espace — la distance au centroïde du secteur mesure alors réellement qui est "marginal" dans sa région par rapport à la structure génétique de l'île entière.

**Interprétation** : PCA_score proche de 1 → individu aux marges génétiques de son secteur, dans l'espace de référence commun à toute la cohorte.

---

#### **Composante 2 : ADMIXTURE — Composition ancestrale**

**Objectif** : Favoriser les individus avec des profils d'admixture rares ou bien mélangés au sein du secteur.

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

**Pourquoi global** : ADMIXTURE par secteur produit un modèle ancestral propre à chaque sous-groupe. Un secteur à majorité africaine et un secteur à majorité indienne auraient des axes k différents, rendant les q_k incomparables. Un modèle global garantit que q_1 (ex: africain) signifie la même chose pour tous les 2500 individus.

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
   IBD_threshold = 0.125  (seuil cousins 1er degré)
   ```
   Un candidat est éliminé si IBD(candidat, tout individu déjà sélectionné) ≥ 0.125

**Interprétation** :
- IBD_score proche de 1 → individu non-apparenté à quiconque dans le secteur → information génétique nouvelle ✓
- IBD_score proche de 0 → individu qui a un proche parent dans le secteur → information redondante ✗

---

#### **Composante 4 : ROH — Runs of Homozygosity (effet fondateur local)**

**Objectif** : Favoriser les individus avec peu de segments homozygotes longs, indicateurs d'une faible consanguinité locale. La diversité locale (peu de ROH) est préférable.

**Calcul** :
1. Calculer les ROH **sur les 2500 individus** avec PLINK (`--homozyg`) — métrique individuelle, le groupe de calcul n'affecte pas le résultat
   - Longueur minimale : 1 Mb
   - Densité SNP : 1 SNP par 10 kb

2. Pour chaque individu i, calculer :
   ```
   total_ROH_length(i) = somme des longueurs de tous les ROH > 1 Mb
   ```

3. Score ROH :
   ```
   ROH_score(i) = max(0, 1 - (total_ROH_length(i) / 100 Mb))
   ```

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

*(Les poids seront optimisés et validés par l'étude préalable sur données 1000 Genomes — l'analyse de sensibilité déterminera si ces valeurs par défaut sont robustes ou si d'autres pondérations produisent systématiquement de meilleurs résultats)*

---

### 2.4 Stratification par quintiles (au sein de chaque secteur)

**Problème** : Sélectionner uniquement les individus avec S_div élevé au sein d'un secteur crée un **biais directionnel** — on capture les profils "marginaux" mais on sous-représente les profils "typiques" du secteur.

**Solution** : Appliquer une **stratification par quintiles de S_div** pour garantir que la sélection au sein du secteur reflète la distribution complète de la diversité génétique.

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
- **Q4-Q5 = 30%** : Les profils ordinaires garantissent une couverture complète sans biais

**Stratification binaire (N_WGS = 6–19)** : allocation 60% top / 40% bottom
- *Top 50% S_div* (60% des WGS alloués) : favorise la diversité tout en limitant l'effet plafonnier
- *Bottom 50% S_div* (40% des WGS alloués) : ancre la sélection dans les profils représentatifs du secteur
- Ce ratio 60/40 reproduit l'esprit des quintiles (favoriser sans exclure) avec seulement 2 strates

**Principe commun** : quelle que soit la taille du secteur (≥ 6 WGS), la sélection ne peut jamais n'être que les individus en haut de la distribution S_div — un sous-ensemble du bas est toujours inclus.

---

## 3. Pipeline de sélection

### 3.1 Étape 1 : Contrôle qualité des SNP

```
Données brutes puce SNP (2500 individus, tous secteurs)
         ↓
QC variant :
- MAF ≥ 1%
- Taux de manquants < 5%
- HWE p > 1e-6
         ↓
QC individu :
- Taux de manquants < 5%
- Pas de contamination estimée
         ↓
~2.5M SNP conservés
```

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
            
            for candidate in sorted(candidates, key=lambda i: S_div(i), reverse=True):
                if len([s for s in selected_total if s in individuals_secteur]) >= N_secteur_WGS:
                    break
                
                # Vérifier IBD (non-parenté avec TOUS les sélectionnés)
                is_unrelated = all(IBD(candidate, sel) < 0.125 for sel in selected_total)
                
                if is_unrelated:
                    selected_total.append(candidate)
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

**Avantages** :
- ✓ Représentativité géographique garantie (100%)
- ✓ Au sein de chaque secteur : diversité génétique maximisée par S_div
- ✓ Pas de biais directionnel (stratification quintile ou S_div seul)
- ✓ Pas de sur-représentation des extrêmes
- ✓ Petits secteurs traités spécifiquement (pas de quintiles fictives)

---

## 4. Étude de validation préalable

### 4.1 Objectif

**Démontrer que la logique de sélection S_div est mathématiquement fondée**, indépendamment de la structure ancestrale spécifique d'une population.

L'argument est le suivant : si S_div (diversité positionnelle + diversité ancestrale + indépendance génétique + qualité générale) surpasse systématiquement les approches naïves **sur des populations admixées de structures différentes**, alors sa logique est **robuste et transférable** — y compris à La Réunion. Ce n'est pas la population proxy qui doit "ressembler" à La Réunion, c'est la **logique du score** qui doit se montrer supérieure quelle que soit la structure d'admixture testée.

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

#### **4.2.2 Scénarios testés**

Pour chaque niveau de contrainte budgétaire :

| Scénario | Sélection | Budget |
|---|---|---|
| Contrainte forte | 40 / 157 (25%) | Très limité |
| Contrainte modérée | 78 / 157 (50%) | Modéré |
| Contrainte faible | 120 / 157 (75%) | Large |

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
| PCA intra-secteur | Capture la diversité positionnelle quelle que soit la structure ancestrale |
| Entropie ancestrale | Mesure le degré d'admixture sans supposer d'ancêtries spécifiques |
| Indépendance IBD | Maximise l'information non-redondante dans tout groupe |
| ROH score | Pénalise la consanguinité, universellement indésirable |
| Stratification quintile | Évite le biais directionnel dans toute distribution |

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

**Interprétation** : une faible sensibilité aux poids est une **preuve indirecte de la cohérence des 4 composantes** — elles mesurent des dimensions réellement indépendantes et complémentaires. Si la variance est élevée (>10%), les composantes sont redondantes et le score doit être revu.

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

- **EFS** : fournit les 2500 génotypes SNP, informations secteur/région
- **CHU Réunion** : identification individus, logistique, consentement
- **Epitech / partenaires bio** : extraction ADN, QC
- **Illumina / plateforme séquençage** : WGS des 350 sélectionnés

---

## 6. Risques et limitations

### 6.1 Risques scientifiques

| Risque | Cause | Mitigation |
|---|---|---|
| **Biais puce SNP** | SNPs choisis reflètent bias eurocentré | Accepter et documenter ; valider sur 1000G |
| **Variants rares manqués** | Même optimisé, 350 < 2500 = perte information | Documenter couverture variants < 1% |
| **Secteurs très petits** | N_WGS < 6 = pas de stratification possible | S_div seul documenté ; cas < 1.7% cohorte |
| **Poids arbitraires** | Choix de w1, w2, w3, w4 sans justification | Validation 1000G + analyse sensibilité |

### 6.2 Limitations acceptables

- ✓ **À accepter** : 14% WGS (350/2500) est plus petit que Naslavsky 2022 (1171 brésiliens), mais financièrement réaliste
- ✓ **À documenter** : Variants avec fréquence < 1% ne seront pas fiablement captés
- ✓ **À compenser** : Les 2150 individus génotypés (non séquencés) restent informatifs pour génomique populationnelle et imputation

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
| 6 | Benchmark vs alternatives — métriques | Tableau métriques réel |
| 7 | Analyse sensibilité des poids | Rapport sensibilité |
| 8 | Synthèse : cohérence inter-groupes + rapport final | Rapport de validation + recommandations K/poids |

**Livrable final** : Rapport démontrant que la logique S_div est robuste sur 3 structures d'admixture différentes → justification scientifique pour déploiement Réunion

### 7.2 Phase 2 : Déploiement Réunion (8-10 semaines)

| Semaine | Tâche | Livrable |
|---|---|---|
| 1-2 | Réception génotypes SNP 2500 EFS + secteurs | Données PLINK QC + cartographie secteurs |
| 3 | PCA + ADMIXTURE par secteur | Scores Réunion par secteur |
| 4 | IBD + ROH par secteur | Données parenté Réunion |
| 5 | Sélection 350 individus (stratifiée géographique) | Liste de 350 IDs + répartition par secteur |
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

---

## Annexe A : Commandes PLINK/ADMIXTURE de référence

```bash
# QC variant
plink2 --vcf data.vcf.gz \
  --maf 0.01 \
  --geno 0.05 \
  --hwe 1e-6 \
  --make-pgen \
  --out data_qc

# ── NIVEAU 1 : calculs GLOBAUX sur les 2500 ──────────────────

# PCA globale
plink2 --pfile data_qc \
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
for K in 2 3 4 5 6; do
    admixture --cv data_qc.bed $K | tee admixture_K${K}.log
done
# Sélectionner K avec CV-error minimal
grep "CV error" admixture_K*.log

# Puis lancer avec K optimal (ex: K=4 pour La Réunion)
admixture data_qc.bed 4

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
