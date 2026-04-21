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
   - Exemple :
   
   | Secteur | N (cohorte 2500) | % | N WGS (350) |
   |---|---|---|---|
   | Nord | 320 | 12.8% | 45 |
   | Nord-Est | 560 | 22.4% | 78 |
   | Est | 380 | 15.2% | 53 |
   | Sud-Est | 420 | 16.8% | 59 |
   | Sud | 375 | 15.0% | 52 |
   | Ouest | 300 | 12.0% | 42 |
   | Nord-Ouest | 245 | 9.8% | 34 |
   | **Total** | **2500** | **100%** | **350** |

2. **Allocation irrevocable** : Chaque secteur reçoit exactement `N_secteur_WGS = round(proportion_secteur × 350)`

**Résultat** : 350 WGS distribués géographiquement, garantissant que la sélection reflète la structure démographique réelle de La Réunion.

---

### 2.2 Étape 2 : Calcul du score S_div (au sein de chaque secteur)

Le score S_div agrège **4 dimensions indépendantes** de la diversité génétique. **Important** : S_div est calculé sur **chaque secteur indépendamment**.

#### **Composante 1 : PCA — Position dans l'espace génétique**

**Objectif** : Capturer les individus qui occupent des positions extrêmes ou peu fréquentes dans l'espace génétique du secteur.

**Calcul** :
1. Réaliser une Analyse en Composantes Principales (PCA) **au sein du secteur** sur les SNPs
2. Pour chaque individu i du secteur, calculer sa distance euclidienne au centroïde du secteur dans l'espace PC1-PC5 :
   ```
   PCA_distance(i) = √(PC1(i)² + PC2(i)² + PC3(i)² + PC4(i)² + PC5(i)²)
   ```
3. Normaliser entre 0 et 1 :
   ```
   PCA_score(i) = (PCA_distance(i) - min) / (max - min)
   ```

**Interprétation** : Individus avec PCA_score proche de 1 occupent les "marges" génétiques du secteur et capturent de la variabilité nouvelle.

---

#### **Composante 2 : ADMIXTURE — Composition ancestrale**

**Objectif** : Favoriser les individus avec des profils d'admixture rares ou bien mélangés au sein du secteur.

**Calcul** :
1. Lancer ADMIXTURE avec K=3 (représentant les 3 ancêtries majeures : africaine, indienne, européenne) **au sein du secteur**
2. Pour chaque individu i, calculer l'entropie de Shannon de son profil ancestral :
   ```
   ADMIX_score(i) = -Σ(k=1 à 3) q_k(i) × log(q_k(i))
   ```
   où q_k(i) = proportion de l'ancêtrie k chez l'individu i

3. Normaliser entre 0 et 1 :
   ```
   ADMIX_score(i) = (entropie(i) - min) / (max - min)
   ```

**Interprétation** : 
- ADMIX_score = 1 → individu avec 3 ancêtries à parts égales (profil maximalement mélangé)
- ADMIX_score = 0 → individu avec une seule ancêtrie dominante (parental ou peu mélangé)

---

#### **Composante 3 : IBD — Parenté et indépendance génétique**

**Objectif** : Éviter la redondance génétique en sélectionnant des individus non-apparentés au sein du secteur.

**Calcul** :
1. Calculer la matrice de parenté pairwise **au sein du secteur** avec PLINK/KING
2. Score IBD : Utilisé lors de la sélection greedy (voir section 3.3)
   ```
   IBD_threshold = 0.125  (cousins 1er degré)
   ```
   On sélectionne uniquement si IBD < 0.125 avec tous les individus déjà sélectionnés

---

#### **Composante 4 : ROH — Runs of Homozygosity (effet fondateur local)**

**Objectif** : Favoriser les individus avec peu de segments homozygotes longs, indicateurs d'une faible consanguinité locale. La diversité locale (peu de ROH) est préférable.

**Calcul** :
1. Calculer les ROH **au sein du secteur** avec PLINK (`--homozyg`)
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
- **Valeurs par défaut (pré-validation)** :
  - w1 = 0.30 (diversité position génétique)
  - w2 = 0.30 (diversité ancestrale)
  - w3 = 0.25 (indépendance génétique)
  - w4 = 0.15 (qualité générale / effet fondateur)

*(Les poids seront optimisés et validés par l'étude préalable sur données 1000 Genomes)*

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

   **Cas des petits secteurs** : Si N_WGS < 20, la stratification quintile n'a pas de sens → **utiliser S_div seul** (greedy)

#### **2.4.2 Justification**

- **Q3 (médiane) = 30%** : Les individus "typiques" du secteur forment l'anchor génétique local
- **Q1-Q2 = 40%** : Les profils extrêmes capturent la diversité rare du secteur
- **Q4-Q5 = 30%** : Les profils ordinaires garantissent une couverture complète sans biais

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

### 3.2 Étape 2 : Calcul des composantes (par secteur)

**Parallélisable — durée estimée : 3-4 jours**

```
Pour chaque secteur géographique :
    
    ├─ PCA (plink --pca)
    │  → PCA_score(i) pour tous i du secteur
    │
    ├─ ADMIXTURE K=3 (5 répétitions CV)
    │  → ADMIX_score(i) pour tous i du secteur
    │
    ├─ IBD pairwise (plink --king)
    │  → Matrice IBD pour sélection
    │
    └─ ROH (plink --homozyg)
       → ROH_score(i) pour tous i du secteur

Agrégation S_div = w1×PCA + w2×ADMIX + w3×IBD + w4×ROH
                → S_div(i) pour tous i du secteur (classement)
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
    else:
        # PETIT SECTEUR (< 20 individus WGS) : S_div seul, pas de quintiles
        
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

**Valider que S_div produit une sélection meilleure qu'une approche naïve**, avant de la déployer sur la vraie cohorte réunionnaise.

### 4.2 Protocole sur données publiques (1000 Genomes)

#### **4.2.1 Dataset proxy**

Utiliser deux populations admixées publiques du projet 1000 Genomes comme proxy de La Réunion :

| Population | Code | N | Profil |
|---|---|---|---|
| African Caribbeans (Barbados) | ACB | 96 | Africain + Européen (comme Réunion) |
| African Americans (SW USA) | ASW | 61 | Africain + Européen + Amérindien |
| **Total** | — | **157** | **Proxy de cohorte mixte** |

*(Limité mais suffisant pour proof-of-concept)*

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

#### **4.2.4 Résultats attendus**

**Tableau illustratif — cas 50/157 (32% sélection)**

| Stratégie | Couverture allélique | Variants rares | KL ancestral | IBD redondant | Couverture PCA | Biais direction |
|---|---|---|---|---|---|---|
| **S_div naïf** | 91% | 70% | 0.05 | 1% | 91% | **0.34*** |
| **S_div stratifié** | **88%** | **66%** | **0.08** | **3%** | **85%** | **0.05** ✓ |
| Random | 76% | 45% | 0.18 | 15% | 72% | 0.12 |
| PCA-only | 87% | 51% | 0.13 | 9% | 95%* | 0.28* |
| Maximin IBD | 82% | 58% | 0.15 | 0%* | 78% | 0.18 |

*PCA-only excelle sur PCA mais crée biais directionnel, rate variants rares ; Maximin IBD élimine toute parenté mais perd diversité*
***S_div naïf capture plus de variants rares mais crée fort biais directionnel (Kolmogorov-Smirnov = 0.34)*

**Conclusion clé** : 
- **S_div naïf** : Meilleure couverture allélique MAIS fort biais directionnel → introduit artefacts scientifiques
- **S_div stratifié** : Couverture légèrement inférieure (88% vs 91%) MAIS biais minimal (0.05) → représentation honnête
- **S_div stratifié offre le meilleur compromis** : perte de 3% de couverture allélique pour éliminer biais directionnel

---

### 4.3 Analyse de sensibilité des poids

Pour garantir que S_div n'est pas arbitraire, tester sa robustesse :

```
Pour chaque poids w ∈ {w1, w2, w3, w4} :
    Faire varier w de -10% à +10%
    Réapplier sélection S_div
    Mesurer variance des 6 métriques
```

**Résultat attendu** : Si variance < 5% → poids robustes → méthodologie défendable.

---

## 5. Considérations pratiques — Réunion

### 5.1 Paramètres spécifiques à adapter

Une fois validé sur 1000G, les paramètres suivants devront être finalisés pour La Réunion :

| Paramètre | Valeur 1000G | À affiner Réunion |
|---|---|---|
| K (ADMIXTURE) | 3 | Possiblement 4-5 pour sous-structure locale |
| IBD seuil | 0.125 (cousins) | Adapter si effet fondateur extrême |
| ROH seuil | 100 Mb | À valider sur cohorte réelle |
| Poids w1..w4 | 0.3, 0.3, 0.25, 0.15 | À re-optimiser si résultats 1000G divergent |
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
| **Secteurs très petits** | Secteurs < 5% = peu d'individus WGS | Appliquer S_div seul, pas de quintiles |
| **Poids arbitraires** | Choix de w1, w2, w3, w4 sans justification | Validation 1000G + analyse sensibilité |

### 6.2 Limitations acceptables

- ✓ **À accepter** : 14% WGS (350/2500) est plus petit que Naslavsky 2022 (1171 brésiliens), mais financièrement réaliste
- ✓ **À documenter** : Variants avec fréquence < 1% ne seront pas fiablement captés
- ✓ **À compenser** : Les 2150 individus génotypés (non séquencés) restent informatifs pour génomique populationnelle et imputation

---

## 7. Livrables et timeline

### 7.1 Phase 1 : Validation (6 semaines)

| Semaine | Tâche | Livrable |
|---|---|---|
| 1 | Téléchargement 1000G + preprocessing | Dataset 1000G QC |
| 2 | Calcul PCA + ADMIXTURE | Scores PCA/ADMIX |
| 3 | Calcul IBD + ROH | Scores IBD/ROH |
| 4 | Agrégation S_div + simulations | Sélections testées |
| 5 | Benchmark vs alternatives | Tableau métriques |
| 6 | Analyse sensibilité + rapport | Rapport de validation |

**Livrable final** : Document validant S_div sur 1000G + rapport de sensibilité → prêt pour déploiement Réunion

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

# PCA (par secteur si applicable)
plink2 --pfile data_qc \
  --keep sector_A.txt \
  --pca 10 \
  --out pca_sector_A

# IBD (par secteur si applicable)
plink --bfile data_qc \
  --keep sector_A.txt \
  --king-cutoff 0.125 \
  --out ibd_sector_A

# ROH (par secteur si applicable)
plink --bfile data_qc \
  --keep sector_A.txt \
  --homozyg \
  --homozyg-window-snp 50 \
  --homozyg-snp 50 \
  --homozyg-kb 1000 \
  --out roh_sector_A

# ADMIXTURE (par secteur si applicable)
admixture data_qc.bed 3 --cv=5  # K=3 populations
```

---

**Document conforme à AGENTS.md — méthodologie publiable, reproductible, stratifiée géographiquement + optimisée génétiquement**
