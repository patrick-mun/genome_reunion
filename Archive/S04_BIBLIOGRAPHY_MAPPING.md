# Mapping des Références Bibliographiques — Slides S04

## Structure des Références par Slide

### Slide 17 — INTRO S04 (pas de modification)
- Titre : "L'Algorithme de Sélection"

---

### Slide 18–19 — S04 RÉSUMÉ (Mode Résumé)
**Slide 18** : "Algorithme de Sélection — Vue d'ensemble"
- Contenu clé : S_div = 0.30·PCA + 0.30·ADMIX + 0.25·IBD + 0.15·ROH
- **Références**:
  - Price et al. 2006 (PCA) — ref 27
  - Alexander et al. 2009 (ADMIXTURE) — ref 29
  - Manichaikul et al. 2010 (KING kinship) — ref 31
  - Kirin et al. 2010 (ROH) — ref 35

**Slide 20** : "Validation & Déploiement"
- Contenu clé : 1000G (3 populations) + EPIGEN-Brasil
- **Références**:
  - Bergström et al. 2020 (1000G expansion) — ref 16
  - Naslavsky et al. 2022 (EPIGEN-Brasil, 1171 WGS) — ref 20
  - Nunes et al. 2025 (EPIGEN admixture Brazilian) — ref 21

---

### Slide 21 — Justification N=350 (NOUVELLE REF)
**Titre** : "Justification statistique : pourquoi 350 WGS = 700 haplotypes ?"
- Contenu clé : P(détection) = 1 − (1 − MAF)^700, MAF ≥ 1%, seuil robustesse
- **Références**:
  - Le & Durbin 2011 (SNP detection from low-coverage sequencing) — ref 57
  - Auer & Lettre 2015 (Rare variant association studies) — ref 59
  - Naslavsky et al. 2022 (Panel design, MAF ~1%) — ref 20

---

### Slide 22 — Architecture 3 Ressources (NEW REF)
**Titre** : "Architecture du projet : trois ressources complémentaires"
- Contenu clé : 2500 SNP + 350 WGS + 100 familles (non incluses)
- **Références**:
  - Browning & Browning 2011 (Haplotype phasing) — ref 40
  - Delaneau et al. 2019 (SHAPEIT4, accurate phasing) — ref 41
  - Taliun et al. 2021 (TOPMed, 53,831 WGS) — ref 45

---

### Slide 23 — Panel WGS Hybride V3 (NEW REF)
**Titre** : "Panel WGS hybride V3 : noyau géographique + découverte contrôlée"
- Contenu clé : 322 noyau (92%) + 28 découverte (8%), recalibrage sur 2500
- **Références**:
  - Rubinacci et al. 2021 (Efficient phasing & imputation) — ref 48
  - Browning et al. 2018 (Imputation panel design) — ref 44
  - Auer & Lettre 2015 (Rare variant representation) — ref 59

---

### Slide 24 — Deux Niveaux (NEW REF)
**Titre** : "Deux niveaux, une contrainte principale"
- Contenu clé : Niveau 1 (géographie) + Niveau 2 (S_div génétique)
- **Références**:
  - Cardon & Palmer 2003 (Population stratification) — ref 79
  - Wojcik et al. 2019 (Diverse populations improve discovery) — ref 4
  - Sirugo et al. 2019 (Missing diversity in genetic studies) — ref 1

---

### Slide 25 — Représentativité Géographique (NEW REF)
**Titre** : "Représentativité géographique — la contrainte première"
- Contenu clé : N_core = round(proportion × 322), quotas par secteur
- **Références**:
  - Pemberton et al. 2013 (Population structure in genomic data) — ref 58
  - Choudhury et al. 2020 (High-depth African genomes, geographic representation) — ref 12
  - Cardon & Palmer 2003 (Population structure importance) — ref 79

---

### Slide 26 — Quatre Dimensions S_div (NEW REF)
**Titre** : "Quatre dimensions complémentaires de S_div"
- Contenu clé : PCA_score (global), ADMIX_score (global), IBD_score (secteur), ROH_score (global)
- **Références**:
  - Price et al. 2006 (PCA corrects for stratification) — ref 27
  - Patterson et al. 2006 (PCA & eigenanalysis) — ref 28
  - Alexander et al. 2009 (Fast ADMIXTURE) — ref 29
  - Conomos et al. 2016 (Model-free kinship estimation) — ref 33
  - Ceballos et al. 2018 (ROH review) — ref 36

---

### Slide 27 — PCA_score + ADMIX_score (NEW REF)
**Titre** : "Composantes globales : position et composition"
- Contenu clé : dist(i) = √Σ(PCₖ − cₖ)², H(i) = −Σ q_k log(q_k)
- **Références**:
  - Price et al. 2006 (PCA methodology) — ref 27
  - Patterson et al. 2006 (PCA technical details) — ref 28
  - Alexander et al. 2009 (ADMIXTURE algorithm) — ref 29
  - Lawson et al. 2018 (Tutorial: how not to over-interpret ADMIXTURE) — ref 30

---

### Slide 28 — IBD_score + ROH_score (NEW REF)
**Titre** : "Composantes locales : indépendance et effet fondateur"
- Contenu clé : IBD = 1 − max kinship, ROH_score = max(0, 1 − ROH_total/100Mb)
- **Références**:
  - Manichaikul et al. 2010 (KING robust kinship) — ref 31
  - Thornton et al. 2012 (Kinship in admixed populations) — ref 32
  - Conomos et al. 2016 (KING kinship estimation) — ref 33
  - Kirin et al. 2010 (ROH record population history) — ref 35
  - Ceballos et al. 2018 (ROH review) — ref 36
  - McQuillan et al. 2008 (ROH in European populations) — ref 37

---

### Slide 29 — Score S_div Agrégation (NEW REF)
**Titre** : "Le Score de Diversité : tableau de bord paramétrable"
- Contenu clé : S_div = 0.30·PCA + 0.30·ADMIX + 0.25·IBD + 0.15·ROH, poids travail
- **Références**:
  - Price et al. 2006 (Composite scoring framework) — ref 27
  - Alexander et al. 2009 (ADMIXTURE scoring) — ref 29
  - Manichaikul et al. 2010 (KING for scoring) — ref 31
  - Ceballos et al. 2018 (ROH diversity) — ref 36

---

### Slide 30 — Anti-biais Directionnel (NEW REF)
**Titre** : "Anti-biais directionnel : stratification par quintile"
- Contenu clé : Quintile 20-20-30-20-10%, binaire 60/40, greedy
- **Références**:
  - Pemberton et al. 2013 (Stratification in genome-wide studies) — ref 58
  - Auer & Lettre 2015 (Strategies for rare variant studies) — ref 59

---

### Slide 31 — Greedy Stratifié (3 Branches) + Robustesse Multi-ordre (NEW REF + UPGRADE)
**Titre** : "Sélection greedy stratifiée — les trois branches"
- Contenu clé : Quintile (≥20), binaire (6–19), libre (<6), IBD cross-secteur, robustesse multi-ordre
- **Références**:
  - Le & Durbin 2011 (SNP selection strategies) — ref 57
  - Pemberton et al. 2013 (Selection in population studies) — ref 58
  - Auer & Lettre 2015 (Sample selection strategies) — ref 59

---

### Slide 32 — Phasage Réunionnais + 100 Familles (NEW REF)
**Titre** : "Phasage réunionnais : 2 500 SNP + 100 familles nucléaires"
- Contenu clé : SHAPEIT4 3-niveaux, familles = ressource technique, Mendelian transmission
- **Références**:
  - Browning & Browning 2011 (Haplotype phasing review) — ref 40
  - Browning & Browning 2012 (Identity by descent & phasing) — ref 39
  - Delaneau et al. 2019 (SHAPEIT4 accurate haplotype phasing) — ref 41
  - Loh et al. 2016 (Long-range phasing) — ref 42
  - Hofmeister et al. 2023 (Rare variant phasing in WGS) — ref 43
  - Maples et al. 2013 (RFMix local ancestry) — ref 51
  - Browning & Browning 2023 (FLARE local ancestry) — ref 52

---

### Slide 33 — Recalibrage Fréquences (NEW REF + UPGRADE)
**Titre** : "Fréquences finales : brute → pondérée → imputée"
- Contenu clé : 3 niveaux, annotation (direct/imputé, HC/MC), MAF ≥ 1%
- **Références**:
  - Browning et al. 2018 (Imputation panel design) — ref 44
  - Taliun et al. 2021 (TOPMed imputation quality) — ref 45
  - Kowalski et al. 2019 (NHLBI imputation quality) — ref 46
  - Das et al. 2016 (Genotype imputation service) — ref 47
  - Rubinacci et al. 2021 (Efficient phasing & imputation) — ref 48
  - Rubinacci et al. 2023 (UK Biobank imputation) — ref 49
  - Marchini & Howie 2010 (Imputation review) — ref 50

---

### Slide 34 — Avantages et Limitations (NEW REF)
**Titre** : "Avantages et limitations acceptables de la méthode"
- Contenu clé : Formules explicites, reproductibilité, anti-biais garanti, validation, limitations documentées
- **Références**:
  - Richards et al. 2015 (Standards for variant interpretation) — ref 65
  - Chang et al. 2015 (PLINK2 reproducible analysis) — ref 60
  - Purcell et al. 2007 (PLINK standard tool) — ref 61

---

### Slide 35 — Validation 1000G (NEW REF)
**Titre** : "Validation sur 1000 Genomes avant déploiement"
- Contenu clé : 3 populations admixées, 3 budgets, 5 stratégies, KS-test, couverture allélique
- **Références**:
  - Bergström et al. 2020 (1000G 929 diverse genomes) — ref 16
  - Byrska-Bishop et al. 2022 (1000G expansion high-coverage) — ref 17
  - Choudhury et al. 2020 (African genomes, variant discovery) — ref 12
  - Gurdasani et al. 2015 (African Genome Variation Project) — ref 13
  - Nakatsuka et al. 2017 (South Asian genetic discoveries) — ref 14
  - Wall et al. 2019 (GenomeAsia 100K) — ref 15
  - Wojcik et al. 2019 (Diverse populations improve discovery) — ref 4

---

### Slide 36 — EPIGEN-Brasil (NEW REF)
**Titre** : "Validation complémentaire : cohorte brésilienne admixée (EPIGEN-Brasil)"
- Contenu clé : 6 487 indiv, 30 WGS, structure admixée africain/européen/amérindien, SNP↔WGS validation
- **Références**:
  - Naslavsky et al. 2022 (EPIGEN-Brasil 1,171 WGS sequenced) — ref 20
  - Nunes et al. 2025 (EPIGEN admixture Brazilian) — ref 21
  - Suarez-Kurtz 2010 (Pharmacogenetics Brazil) — ref 67

---

## Summary Table

| Slide | Titre Clé | Références Principales | Nombre |
|-------|-----------|------------------------|--------|
| 17 | INTRO S04 | — | 0 |
| 18–19 | S04 Résumé | 27, 29, 31, 35 + 16, 20, 21 | 7 |
| 21 | N=350 | 57, 59, 20 | 3 |
| 22 | Architecture | 40, 41, 45 | 3 |
| 23 | Panel Hybride | 48, 44, 59 | 3 |
| 24 | Deux Niveaux | 79, 4, 1 | 3 |
| 25 | Géo Représentativité | 58, 12, 79 | 3 |
| 26 | 4 Dimensions | 27, 28, 29, 33, 36 | 5 |
| 27 | PCA+ADMIX | 27, 28, 29, 30 | 4 |
| 28 | IBD+ROH | 31, 32, 33, 35, 36, 37 | 6 |
| 29 | S_div Score | 27, 29, 31, 36 | 4 |
| 30 | Anti-biais | 58, 59 | 2 |
| 31 | Greedy Stratifié | 57, 58, 59 | 3 |
| 32 | Phasage | 40, 39, 41, 42, 43, 51, 52 | 7 |
| 33 | Recalibrage Fréq | 44, 45, 46, 47, 48, 49, 50 | 7 |
| 34 | Avantages/Limit | 65, 60, 61 | 3 |
| 35 | Val 1000G | 16, 17, 12, 13, 14, 15, 4 | 7 |
| 36 | Val EPIGEN | 20, 21, 67 | 3 |

**Total références S04** : ~75 citations intégrées

---

## Implémentations de Recommandations

### ✅ Recommandation 1 : Tableau 6 Stratégies
- **Insertion** : Nouvelle slide après 19 (avant slide 21 actuelle)
- **Contenu** : Tableau comparatif des 6 stratégies testées
- **Références** : 57, 58, 59

### ✅ Recommandation 2 : Clarifier ADMIX_rarity
- **Modification** : Slide 27
- **Ajout** : Phrase explicite "Bras découverte utilise S_discovery_rarity (distance centroïde ancestral) plutôt qu'entropie"
- **Références** : 29, 30

### ✅ Recommandation 3 : Robustesse Multi-ordre
- **Modification** : Slide 31
- **Upgrade** : Quantifier "100+ ordres aléatoires, intersection > 95% stabilité"
- **Références** : 57, 58, 59

### ✅ Recommandation 4 : Expliciter 6 Stratégies
- **Modification** : Slide 18–19
- **Ajout** : Explicit mention des 6 stratégies (random, PCA-only, maximin-IBD, geo+S_div, geo-ancestral+S_div, ADMIX+greedy)
- **Références** : 57, 58, 59

### ✅ Recommandation 5 : Effectif Observé
- **Modification** : Slide 33
- **Upgrade** : Colonne "Effectif observé (n haplotypes)" dans tableau annotation
- **Références** : 44, 45, 47, 48

---

## Notes d'Intégration

1. **Format .slide-footer** : Utiliser `.slide-footer-sources` pour lister les références
2. **Citation courte** : Auteur année, titre court, journal
3. **Multi-refs par slide** : Lister par ordre d'apparition dans le texte
4. **Pas d'URL** : Les références doivent être DOI/journal, pas de lien cliquable
5. **Complétude** : Chaque slide scientifique (21–36) doit avoir ≥1 référence
