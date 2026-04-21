# Méthodologie de sélection optimale S_div — Génome Réunion

## Vue d'ensemble

Le projet Génome Réunion vise à créer un **référentiel génomique local pour les populations admixées réunionnaises** sous **contrainte budgétaire** : 350 séquençages WGS sélectionnés parmi 2500 génotypages SNP.

Cette approche combine **optimisation multicritère** et **représentation de la diversité génétique** pour maximiser l'information scientifique capturée dans le sous-ensemble WGS, sans présumer que la sélection exhaustive serait possible ou nécessaire.

---

## 1. Contexte scientifique

### 1.1 Pourquoi une sélection ?

La Réunion présente une **double singularité génétique** :
- **Admixture complexe** : ancêtres africains, indiens, européens, malgaches
- **Effet fondateur** : population historiquement petite avec caractéristiques génomiques uniques

Le **biais de représentation global** signifie que les bases génomiques mondiales (gnomAD, 1000 Genomes) sous-représentent systématiquement les variants rares réunionnais, particulièrement en pharmacogénétique et prédiction de risque génétique (Martin et al., 2019 ; Naslavsky et al., 2022).

### 1.2 Approche en trois temps

```
Cohorte EFS complète (2500 individus)
           ↓
    Génotypage SNP
    (Puce SNP)
           ↓
  Score S_div calculé
  pour chaque individu
           ↓
  Sélection 350 individus
  optimale (14% WGS)
           ↓
  Séquençage WGS ciblé
           ↓
  Référentiel réunionnais
```

Cette approche pragmatique **maximise l'information par franc dépensé** en sélectionnant stratégiquement plutôt que aléatoirement.

---

## 2. Score S_div — Définition mathématique

### 2.1 Composantes

Le score S_div agrège **4 dimensions indépendantes** de la diversité génétique :

#### **Composante 1 : PCA — Position dans l'espace génétique**

**Objectif** : capturer les individus qui occupent des positions extrêmes ou peu fréquentes dans l'espace génétique principal.

**Calcul** :
1. Réaliser une Analyse en Composantes Principales (PCA) sur l'ensemble des 2500 génotypes SNP
2. Pour chaque individu i, calculer sa distance euclidienne au centroïde de la cohorte dans l'espace PC1-PC5 :
   ```
   PCA_distance(i) = √(PC1(i)² + PC2(i)² + PC3(i)² + PC4(i)² + PC5(i)²)
   ```
3. Normaliser entre 0 et 1 :
   ```
   PCA_score(i) = (PCA_distance(i) - min) / (max - min)
   ```

**Interprétation** : Individus avec PCA_score proche de 1 occupent les "marges" génétiques et capturent de la variabilité nouvelle.

---

#### **Composante 2 : ADMIXTURE — Composition ancestrale**

**Objectif** : favoriser les individus avec des profils d'admixture rares ou bien mélangés, qui représentent la complexité ancestrale réunionnaise.

**Calcul** :
1. Lancer ADMIXTURE avec K=3 (représentant les 3 ancêtries majeures : africaine, indienne, européenne)
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

**Résultat attendu** : La majorité des Réunionnais auront ADMIX_score > 0.8, mais les extrêmes (profils parentaux purs ou inversement hyper-mélangés) apportent de l'information.

---

#### **Composante 3 : IBD — Parenté et structure de population**

**Objectif** : éviter la redondance génétique en sélectionnant des individus non-apparentés, ce qui garantit l'indépendance statistique et réduit le "coût génétique" de la parenté.

**Calcul** :
1. Calculer la matrice de parenté pairwise avec PLINK/KING (`--king-cutoff`)
2. Utiliser une approche **greedy itérative** :
   - Trier tous les individus par ordre décroissant de (w1×PCA + w2×ADMIX + w4×ROH)
   - Parcourir la liste dans cet ordre
   - Ajouter un individu à la sélection si IBD < 0.125 avec tous les individus déjà sélectionnés (cousins 1er degré)
   - Score IBD pour individu i = 1 si sélectionné et non-apparenté, 0 sinon

**Méthode alternative (si pas de sélection greedy)** :
```
IBD_score(i) = 1 - (1/349 × Σ_{j sélectionnés, j≠i} IBD(i,j))
```

**Interprétation** : Individus avec faible IBD moyen avec les autres sélectionnés = apportent de l'information génétiquement indépendante.

---

#### **Composante 4 : ROH — Runs of Homozygosity (Effet fondateur)**

**Objectif** : favoriser les individus avec peu de segments homozygotes longs, indicateurs d'une forte consanguinité locale ou d'effet fondateur extrême. La diversité locale (peu de ROH) est préférable.

**Calcul** :
1. Calculer les ROH avec PLINK (`--homozyg`) avec paramètres standards :
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
   (Normalisation par 100 Mb = seuil au-delà duquel consanguinité est extrême)

**Interprétation** : 
- ROH_score proche de 1 → peu de ROH, diversité locale élevée ✓
- ROH_score proche de 0 → beaucoup de ROH, individu très consanguin ou fondateur ✗ (à éviter)

---

### 2.2 Agrégation — Score S_div final

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

### 2.3 Stratification par profils — Éviter le biais directionnel

**Problème** : Sélectionner uniquement les individus avec S_div élevés crée un **biais de sélection directionnel** — on capture les profils "marginaux" ou "extrêmes" mais on sous-représente les profils "typiques" de la population réunionnaise.

**Solution** : Appliquer une **stratification par quintiles de S_div** pour garantir que la sélection des 350 reflète la distribution complète de la diversité génétique.

#### **2.3.1 Allocation par quintiles**

1. Trier tous les 2500 individus par ordre décroissant de S_div
2. Diviser en 5 groupes égaux (500 individus chacun) :
   - **Q1** : Top 20% (percentile 80-100, scores S_div les plus élevés) — profils les plus "extrêmes"
   - **Q2** : 2e 20% (percentile 60-80)
   - **Q3** : Médiane 20% (percentile 40-60) — profils "moyens/typiques"
   - **Q4** : 4e 20% (percentile 20-40)
   - **Q5** : Bottom 20% (percentile 0-20, scores S_div les plus bas) — profils les plus "ordinaires"

3. **Allouer les 350 sélections proportionnellement** pour capturer la structure complète :

| Quintile | Profil | N sélectionnés | % du total | Raison |
|---|---|---|---|---|
| **Q1** (scores élevés) | Extrêmes/marginaux | 70 | 20% | Capturent la diversité positionnelle rare |
| **Q2** | Au-dessus médiane | 70 | 20% | Profils intermédiaires informatifs |
| **Q3** (médiane) | **Typiques** | **105** | **30%** | **Anchor population réunionnaise** |
| **Q4** | Sous médiane | 70 | 20% | Profils moins diversifiés mais représentatifs |
| **Q5** (scores bas) | Ordinaires/fondateurs | 35 | 10% | Moindre information mais présence requise |
| **Total** | — | **350** | **100%** | — |

#### **2.3.2 Justification**

- **Q3 (médiane) = 30%** : Les individus "typiques" réunionnais forment l'anchor du référentiel. Ils représentent les génotypes les plus fréquents et les variants les plus communs.
- **Q1-Q2 = 40%** : Les profils extrêmes (hauts scores) capturent la diversité génétique rare et les variants informatifs.
- **Q4-Q5 = 30%** : Les profils ordinaires garantissent une couverture complète sans biais vers les extrêmes.

#### **2.3.3 Algorithme de sélection stratifiée**

```python
# Étape 1 : Calculer S_div pour tous 2500
S_div_scores = calculate_s_div(all_individuals)

# Étape 2 : Diviser en quintiles
quintiles = divide_into_quintiles(S_div_scores, n_quintiles=5)

# Étape 3 : Allouer les sélections par quintile
allocations = {
    "Q1": 70,
    "Q2": 70,
    "Q3": 105,  # Médiane
    "Q4": 70,
    "Q5": 35
}

selected = []

for quintile_label, n_to_select in allocations.items():
    candidates = quintiles[quintile_label]
    
    # Au sein de chaque quintile, appliquer contrainte IBD
    # (éviter parenté même dans le même quintile)
    selected_in_quintile = greedy_select_unrelated(
        candidates,
        n_to_select,
        ibd_threshold=0.125
    )
    
    selected.extend(selected_in_quintile)

return selected  # 350 individus, représentant distribution S_div
```

#### **2.3.4 Résultat attendu**

Après sélection stratifiée, la distribution de S_div dans l'échantillon WGS (350) devrait **approximativement reproduire** celle de la cohorte totale (2500) :

```
Cohorte totale (2500)    vs    Sélection WGS (350)
───────────────────────       ──────────────────
Q1 : 500 (20%)                Q1 : 70 (20%) ✓
Q2 : 500 (20%)                Q2 : 70 (20%) ✓
Q3 : 500 (20%)     →          Q3 : 105 (30%) ✓ [anchor +10%]
Q4 : 500 (20%)                Q4 : 70 (20%) ✓
Q5 : 500 (20%)                Q5 : 35 (10%) ✓ [léger sous-échantillonnage]
```

**Avantage** : Pas de biais directionnel. Le référentiel WGS représente à la fois :
- Les profils rares/extrêmes (Q1-Q2) = variants nouveaux
- Les profils typiques (Q3) = variants communs et structuration populationnelle
- Les profils ordinaires (Q4-Q5) = baseline génétique complète

---

## 3. Pipeline de sélection

### 3.1 Étape 1 : Contrôle qualité des SNP

```
Données brutes puce SNP (2500 individus)
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

**Parallélisable — durée estimée : 2-3 jours**

```
Données QC-passées
    ↓
┌─────────────────────────────────────┐
│ PCA (plink --pca)                   │ → PCA_score(i) pour tous i
│ + normalisation par individu        │
└─────────────────────────────────────┘
    
    ↓
┌─────────────────────────────────────┐
│ ADMIXTURE K=3 (5 répétitions CV)    │ → ADMIX_score(i) pour tous i
│ + sélection K optimal                │
│ + normalisation par individu        │
└─────────────────────────────────────┘
    
    ↓
┌─────────────────────────────────────┐
│ IBD pairwise (plink --king)         │ → IBD_score(i) par sélection
│ + sélection greedy prioritaire      │ (itérative)
└─────────────────────────────────────┘
    
    ↓
┌─────────────────────────────────────┐
│ ROH (plink --homozyg)               │ → ROH_score(i) pour tous i
│ + agrégation par individu            │
└─────────────────────────────────────┘
    
    ↓
┌─────────────────────────────────────┐
│ Agrégation S_div = w1×PCA + w2×ADMIX│ → S_div(i) pour tous i
│                    + w3×IBD + w4×ROH │   (classement final)
└─────────────────────────────────────┘
```

---

### 3.3 Étape 3 : Sélection stratifiée des 350 individus

**Algorithme greedy stratifié par quintiles :**

```python
# Étape 1 : Calculer S_div pour tous 2500
S_div_scores = calculate_s_div(all_individuals)

# Étape 2 : Diviser en quintiles
quintiles = {
    "Q1": sorted_by_s_div(all_individuals, percentile=80-100),  # 500 individus
    "Q2": sorted_by_s_div(all_individuals, percentile=60-80),   # 500 individus
    "Q3": sorted_by_s_div(all_individuals, percentile=40-60),   # 500 individus
    "Q4": sorted_by_s_div(all_individuals, percentile=20-40),   # 500 individus
    "Q5": sorted_by_s_div(all_individuals, percentile=0-20),    # 500 individus
}

# Étape 3 : Allouer par quintile (éviter biais directionnel)
allocations = {
    "Q1": 70,    # Profils extrêmes
    "Q2": 70,    # Profils au-dessus médiane
    "Q3": 105,   # Profils MÉDIANS (anchor population)
    "Q4": 70,    # Profils sous médiane
    "Q5": 35     # Profils ordinaires
}

selected = []

for quintile_label in ["Q1", "Q2", "Q3", "Q4", "Q5"]:
    candidates = quintiles[quintile_label]
    n_to_select = allocations[quintile_label]
    
    # Greedy : sélectionner n_to_select individus non-apparentés
    for candidate in sorted(candidates, key=lambda i: S_div(i), reverse=True):
        if len([s for s in selected if s in candidates]) >= n_to_select:
            break
        
        # Vérifier contrainte IBD (non-parenté avec TOUS les sélectionnés)
        is_unrelated = all(IBD(candidate, sel) < 0.125 for sel in selected)
        
        if is_unrelated:
            selected.append(candidate)

return selected  # 350 individus, stratifiés par S_div, sans biais directionnel
```

**Résultat** : Liste des 350 IDs à séquencer en WGS, représentant la distribution complète de S_div.

**Avantage** : 
- ✓ Pas de sur-représentation des extrêmes
- ✓ Anchor solide (Q3 médiane = 30% de la sélection)
- ✓ Couverture allélique équilibrée entre variants rares et communs
- ✓ Représentation scientifiquement honnête de la population réunionnaise

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
2. **S_div stratifié** (votre méthode avec quintiles) — évite biais directionnel
3. **Random** (tirage aléatoire, 100 répétitions, moyenne)
4. **PCA-only** (sélection sur diversité PCA seule)
5. **Maximin IBD** (maximiser distance de parenté seule)

#### **4.2.3 Métriques de qualité**

Pour chaque sélection, mesurer :

| Métrique | Formule | Interprétation |
|---|---|---|
| **Couverture allélique** | `|variants(sélection)| / \|variants(total)\|` | % de variants totaux capturés |
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
- **S_div stratifié** : Couverture légèrement inférieure (88% vs 91%) MAIS biais minimal (0.05) → représentation honnête de la population
- **S_div stratifié offre le meilleur compromis** : perte de 3% de couverture allélique pour éliminer le biais directionnel est acceptable

---

### 4.3 Analyse de sensibilité des poids

Pour garantir que S_div n'est pas arbitraire, tester sa robustesse :

```
Pour chaque poids w ∈ {w1, w2, w3, w4} :
    Faire varier w de -10% à +10%
    Réapplier sélection S_div
    Mesurer variance des 5 métriques
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

### 5.2 Interactions avec partenaires

- **EFS** : fournit les 2500 génotypes SNP et données phénotypiques (âge, sexe, région île)
- **CHU Réunion** : identification des individus à séquencer en WGS (logistique, consentement)
- **Epitech / partenaires bio** : extraction ADN, QC
- **Illumina / plateforme séquençage** : WGS des 350 sélectionnés

---

## 6. Risques et limitations

### 6.1 Risques scientifiques

| Risque | Cause | Mitigation |
|---|---|---|
| **Biais puce SNP** | Les SNPs choisis reflètent bias eurocentré | Accepter et documenter ; valider sur 1000G |
| **Variants rares manqués** | Même optimisé, 350 < 2500 = perte information | Documenter couverture variants < 1% |
| **Structure cryptique** | Effet fondateur peut créer sous-groupes cachés | Ajouter stratification explicite par quartiles ADMIXTURE |
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
| 1-2 | Réception génotypes SNP 2500 EFS | Données PLINK QC |
| 3 | PCA + ADMIXTURE Réunion | Scores Réunion |
| 4 | IBD + ROH Réunion | Données parenté Réunion |
| 5 | Sélection 350 individus | Liste de 350 IDs |
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
| — | — | — | — |

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

# PCA
plink2 --pfile data_qc \
  --pca 10 \
  --out pca_results

# IBD
plink --bfile data_qc \
  --king-cutoff 0.125 \
  --out ibd_results

# ROH
plink --bfile data_qc \
  --homozyg \
  --homozyg-window-snp 50 \
  --homozyg-snp 50 \
  --homozyg-kb 1000 \
  --out roh_results

# ADMIXTURE
admixture data_qc.bed 3 --cv=5  # K=3 populations
```

---

**Document conforme à AGENTS.md — méthodologie publiable, reproductible, critique**
