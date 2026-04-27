# Plan de validation S_div sur 1000 Genomes

## Vue d'ensemble

Ce document détaille le plan **pratique et reproductible** pour valider que le score S_div apporte un gain mesurable sur des données réelles (1000 Genomes Project).

**Durée estimée** : 6 semaines pour la validation complète

---

## 1. Téléchargement et préparation des données 1000 Genomes

### 1.1 Données à télécharger

**Source** : Phase 3 de 1000 Genomes Project (ftp://ftp.1000genomes.ebi.ac.uk/)

**Populations d'intérêt** (proxy de La Réunion) :

| Code | Population | N | Profil | URL |
|---|---|---|---|---|
| ACB | African Caribbeans (Barbados) | 96 | Africain + Européen | 1000G_phase3_acb |
| ASW | African Americans (SW USA) | 61 | Africain + Européen + Amérindien | 1000G_phase3_asw |
| **Total** | **Proxy admixe** | **157** | **Comparable Réunion** | — |

**Données à récupérer** :
- VCF brut (variants) : `ALL.*.vcf.gz`
- Métadonnées (populations) : `igsr_samples.tsv`

### 1.2 Commandes de téléchargement

```bash
#!/bin/bash
# Créer répertoire de travail
mkdir -p ~/genome_reunion_validation/1000g_data
cd ~/genome_reunion_validation/1000g_data

# Télécharger les VCF pour les 2 populations
# (Warning : chaque VCF ~1-2 GB, prévoir temps réseau)

# Option 1 : Télécharger chromosome par chromosome (plus rapide)
for chr in {1..22}; do
    wget ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/20130502/ALL.chr${chr}.phase3_shapeit2_mvncall_integrated_v5b.20130502.genotypes.vcf.gz
    wget ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/20130502/ALL.chr${chr}.phase3_shapeit2_mvncall_integrated_v5b.20130502.genotypes.vcf.gz.tbi
done

# Métadonnées
wget http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/technical/working/20130606_sample_info/igsr_samples.tsv

# Option 2 : Utiliser un miroir public (exemple : NCBI)
# Voir : https://www.ncbi.nlm.nih.gov/gvs/
```

**Durée** : 1-2 jours (dépend bande passante)

### 1.3 Extraction des populations cibles

```bash
# Créer fichier liste ACB + ASW
grep -E "^(ACB|ASW)" igsr_samples.tsv | awk '{print $1}' > target_samples.txt

# Filtrer VCF pour ne garder que ces samples
for chr in {1..22}; do
    bcftools view -S target_samples.txt \
        ALL.chr${chr}.phase3_shapeit2_mvncall_integrated_v5b.20130502.genotypes.vcf.gz \
        -o chr${chr}_filtered.vcf.gz -O z
    tabix -p vcf chr${chr}_filtered.vcf.gz
done

# Merger tous les chromosomes
bcftools concat chr{1..22}_filtered.vcf.gz -o 1000g_acb_asw_merged.vcf.gz -O z
tabix -p vcf 1000g_acb_asw_merged.vcf.gz
```

**Résultat** : `1000g_acb_asw_merged.vcf.gz` (~500 MB, 157 individus)

### 1.4 Conversion au format PLINK

```bash
# Convertir VCF → PLINK
plink2 --vcf 1000g_acb_asw_merged.vcf.gz \
    --make-pgen \
    --out 1000g_acb_asw

# QC basique
plink2 --pfile 1000g_acb_asw \
    --maf 0.01 \
    --geno 0.05 \
    --hwe 1e-6 \
    --make-pgen \
    --out 1000g_acb_asw_qc
```

**Résultat** : 
- `1000g_acb_asw_qc.pgen` (données binaires)
- `1000g_acb_asw_qc.pvar` (variants)
- `1000g_acb_asw_qc.psam` (samples + métadonnées)

---

## 2. Script Python pour calcul S_div

Voir fichier séparé : **`s_div_validation.py`** (voir section 3)

**Ce script automatise** :
1. Calcul PCA
2. Exécution ADMIXTURE
3. Calcul IBD/ROH via PLINK
4. Agrégation S_div
5. Benchmark vs alternatives

---

## 3. Benchmark automation

### 3.1 Protocole de benchmark

Pour chaque scénario de contrainte (25%, 50%, 75%) :

1. **Appliquer 5 stratégies de sélection** :
   - S_div stratifié (votre méthode)
   - S_div naïf (sans stratification)
   - Random (100 répétitions)
   - PCA-only
   - Maximin IBD

2. **Mesurer 6 métriques** pour chaque sélection :
   - Couverture allélique
   - Variants rares (MAF < 5%)
   - Représentation ancestrale (KL)
   - Parenté (% IBD > 0.125)
   - Couverture PCA
   - Biais directionnel (Kolmogorov-Smirnov)

3. **Outputer tableau de résultats** avec p-values et intervalles confiance

### 3.2 Exécution

```bash
# Lancer le benchmark (durée : ~4 heures)
python s_div_validation.py \
    --pfile 1000g_acb_asw_qc \
    --metadata igsr_samples.tsv \
    --output_dir results/
```

**Résultats générés** :
- `results/benchmark_25pct.csv`
- `results/benchmark_50pct.csv`
- `results/benchmark_75pct.csv`
- `results/figures/` (graphiques)
- `results/report.txt` (résumé texte)

---

## 4. Interprétation des résultats

### 4.1 Critères de succès

**S_div stratifié est validé SI** :

| Critère | Seuil | Raison |
|---|---|---|
| **1. Biais directionnel minimal** | KS < 0.10 | La sélection ne favorise pas les extrêmes |
| **2. Couverture allélique > 85%** | ≥ 85% | Capte la majorité des variants |
| **3. Variants rares > 60%** | ≥ 60% (MAF<5%) | Détecte variants informatifs rares |
| **4. Parenté < 5%** | < 5% IBD>0.125 | Évite redondance génétique |
| **5. KL ancestral < 0.15** | < 0.15 | Représentation ancestrale ok |
| **6. Supériorité vs alternatives** | S_div > Random + PCA + IBD en score agrégé | Meilleur compromis global |

### 4.2 Seuils d'alerte

**Revoir la méthodologie SI** :

| Signal | Action |
|---|---|
| KS > 0.20 | Biais directionnel trop fort → revoir poids w1-w4 |
| Couverture < 80% | Trop de variants perdus → augmenter N sélection ou réduire MAF |
| Variants rares < 50% | Méthode pas assez bonne pour rares → ajouter critère spécifique |
| KL ancestral > 0.25 | Perte représentation ancestrale → stratifier par ADMIXTURE en plus |
| Parenté > 10% | Greedy IBD ne fonctionne pas bien → revoir seuil 0.125 |

### 4.3 Tableau de résultats attendu

**Cas 50% sélection (78/157 individus)**

| Métrique | S_div stratifié | S_div naïf | Random | PCA-only | Maximin IBD |
|---|---|---|---|---|---|
| **Couverture allélique** | 88% | 91% | 76% | 87% | 82% |
| **Variants rares** | 66% | 70% | 45% | 51% | 58% |
| **KL ancestral** | 0.08 | 0.05 | 0.18 | 0.13 | 0.15 |
| **Parenté redondante** | 3% | 1% | 15% | 9% | 0% |
| **Couverture PCA** | 85% | 91% | 72% | 95% | 78% |
| **Biais direction (KS)** | **0.05** ✓ | **0.34** ✗ | 0.12 | 0.28 | 0.18 |
| **Score agrégé** | **8.5/10** | 8.2/10 | 6.8/10 | 8.1/10 | 7.5/10 |

**Interprétation** :
- S_div naïf : meilleure couverture MAIS biais fort → rejeté
- S_div stratifié : équilibre optimal (88% couverture + biais minimal 0.05) → accepté ✓
- Random : mauvais sur tous les critères sauf parenté → rejeté
- PCA-only : bon sur PCA mais faible sur variants rares + biais → rejeté
- Maximin IBD : excellent parenté mais perd diversité → rejeté

### 4.4 Rapport de validation

Script génère automatiquement un rapport texte :

```
═══════════════════════════════════════════════════════
RAPPORT DE VALIDATION S_DIV — 1000 Genomes
═══════════════════════════════════════════════════════

Population : ACB + ASW (157 individus, proxy La Réunion)
Date : 2026-05-15
Durée validation : 6 semaines

RÉSUMÉ EXÉCUTIF
───────────────
✓ S_div stratifié VALIDÉ pour La Réunion
  - Score agrégé optimal sur tous les critères
  - Biais directionnel minimal (KS=0.05 < seuil 0.10)
  - Couverture allélique > 85% sur les 3 scénarios

RÉSULTATS PAR SCÉNARIO
─────────────────────
25% sélection (40/157) : Score 8.2/10 — ACCEPTÉ
50% sélection (78/157) : Score 8.5/10 — ACCEPTÉ ← optimal
75% sélection (120/157) : Score 8.3/10 — ACCEPTÉ

ANALYSE POIDS
────────────
w1 (PCA) = 0.30 : Robuste (±5% variance)
w2 (ADMIX) = 0.30 : Robuste (±4% variance)
w3 (IBD) = 0.25 : Robuste (±6% variance)
w4 (ROH) = 0.15 : Robuste (±7% variance)
→ Tous poids < 10% variance → MÉTHODOLOGIE DÉFENDABLE

RECOMMANDATIONS POUR RÉUNION
────────────────────────────
1. Appliquer S_div stratifié (secteur par secteur)
2. Adapter K ADMIXTURE à 4-5 si sous-structure locale détectée
3. Valider IBD seuil 0.125 sur données réunionnaises
4. Documenter % variants rares < 1% non captés (limites acceptables)

PROCHAINES ÉTAPES
─────────────────
→ Déploiement phase 2 : Sélection 350/2500 sur données Réunion
→ WGS des 350 sélectionnés
→ Création référentiel réunionnais

═══════════════════════════════════════════════════════
```

---

## 5. Timeline pratique

| Semaine | Tâche | Durée | Livrable |
|---|---|---|---|
| **1** | Téléchargement 1000G + QC | 3 jours | `1000g_acb_asw_qc.pgen` |
| **2** | Calcul PCA/ADMIXTURE/IBD/ROH | 2 jours | Scores calculés |
| **3** | Agrégation S_div | 1 jour | `s_div_scores.csv` |
| **4** | Benchmark automation | 2 jours | Tableau de résultats |
| **4-5** | Analyse sensibilité poids | 3 jours | Rapport robustesse |
| **5-6** | Rédaction rapport final | 3 jours | **Rapport de validation complet** |

**Total : 6 semaines** (peut être parallélisé)

---

## 6. Dépendances logicielles

### 6.1 Installation

```bash
# Python packages
pip install numpy pandas scikit-learn matplotlib seaborn scipy

# Bioinformatics tools
# PLINK 2.0
wget https://s3.amazonaws.com/plink2-assets/plink2_linux_x86_64_latest.zip
unzip plink2_linux_x86_64_latest.zip
export PATH=$PATH:~/plink2

# ADMIXTURE
wget https://software.paintmychromosomes.com/admixture/ADMIXTURE_linux-1.3.0.tar.gz
tar -xzf ADMIXTURE_linux-1.3.0.tar.gz
export PATH=$PATH:~/admixture

# BCFtools (optionnel, pour filtrage VCF)
conda install -c bioconda bcftools tabix
```

### 6.2 Vérification installation

```bash
plink2 --version
admixture --version
python -c "import numpy, pandas, sklearn; print('OK')"
```

---

## 7. Fichiers générés

**Structure des outputs** :

```
results/
├── 1000g_benchmark_summary.csv          # Tableau principal
├── benchmark_25pct.csv                  # Détails 25%
├── benchmark_50pct.csv                  # Détails 50%
├── benchmark_75pct.csv                  # Détails 75%
├── weight_sensitivity_analysis.csv      # Analyse poids
├── report.txt                           # Rapport texte
├── figures/
│   ├── comparison_bar_chart.png         # Comparaison stratégies
│   ├── bias_distribution.png            # Biais directionnel KS
│   ├── allelic_coverage.png             # Couverture allélique
│   ├── rare_variants.png                # Variants rares
│   ├── ancestry_representation.png      # Représentation ancestrale
│   └── pca_coverage.png                 # Couverture PCA
└── logs/
    ├── pca_calculation.log
    ├── admixture.log
    ├── benchmark.log
    └── validation.log
```

---

## 8. Troubleshooting

| Problème | Solution |
|---|---|
| VCF trop volumineux | Télécharger chromosome par chromosome + merger |
| ADMIXTURE convergence lente | Réduire à ACB seulement (96 individus) pour test rapide |
| PCA calcul timeout | Utiliser `plink2 --pca` (plus rapide que scikit) |
| IBD calcul lent | Pré-filtrer SNPs (MAF > 5%) avant KING |
| Manque espace disque | Utiliser compressé (VCF.gz, pas VCF brut) |

---

## 9. Prochaines étapes après validation

**SI validation réussit** (S_div score > 8/10) :

1. Documenter résultats 1000G dans article/rapport
2. Adapter paramètres pour Réunion (K, IBD seuil, etc.)
3. Passer à phase 2 : déploiement sur données Réunion 2500
4. Sélection 350 WGS stratifiée géographique + S_div
5. Lancer WGS

**SI validation échoue** (score < 7/10 ou biais > 0.15) :

1. Réviser poids w1-w4
2. Ajouter critères supplémentaires (ex: stratification ADMIXTURE)
3. Réduire MAF seuil (0.5% au lieu de 1%)
4. Ré-tester sur 1000G
5. Recommencer jusqu'à validation

---

**Document prêt pour implémentation. Voir : `s_div_validation.py` pour le code.**
