# CORRECTIONS S04 — DÉTAIL PAR SLIDE

## Format: Pour chaque slide, actions précises à effectuer

---

## 🆕 NOUVELLE SLIDE [21] — Justification N=350 WGS

| Élément | Détail |
|---------|--------|
| **Titre** | Justification statistique : pourquoi 350 WGS = 700 haplotypes ? |
| **Position** | Après Résumé S04 slide 20 |
| **Type** | ⭐ NOUVELLE (critique) |
| **Contenu gauche (texte)** | <ul><li>Formule P(détection) = 1 - (1 - MAF)^700</li><li>Seuil adopté : MAF ≥ 1%</li><li>Raison : couverture fiable des variants communs</li><li>Limite acceptée : variants < 1% non fiables</li></ul> |
| **Contenu droite (visuel)** | Tableau 4 colonnes:<br>- MAF (%)<br>- Copies attendues<br>- P(détection)<br>- Interprétation<br><br>Lignes:<br>5% → 35 → >99.9% → Très robuste<br>2% → 14 → >99.9% → Robuste<br>**1% → 7 → >99.9% → Limite acceptable** ✓<br>0.5% → 3.5 → ~97% → Fragile<br>0.1% → 0.7 → ~50% → Non fiable |
| **Callout** | ✓ Comparaison : Naslavsky Brasil 1171 WGS (~0.1%) vs Génome Réunion 350 WGS (~1%) |
| **Footer** | Génome Réunion \| 21 |
| **Classe CSS** | `slide--cream` |
| **Règle** | `slide-rule--blue` |

---

## 🆕 NOUVELLE SLIDE [22] — Architecture 3 Piliers

| Élément | Détail |
|---------|--------|
| **Titre** | Architecture du projet : trois ressources complémentaires |
| **Position** | Après slide 21 |
| **Type** | ⭐ NOUVELLE (critique) |
| **Contenu** | Tableau 4 colonnes centralisé: |
| | **Ressource** \| **Taille** \| **Statut** \| **Rôle principal** |
| | Cohorte SNP populationnelle \| 2500 indiv \| Base populationnelle \| Structure génétique, sélection WGS, recalibrage fréquences |
| | Panel WGS optimisé \| 350 indiv (from 2500) \| Panel hybride \| Découverte variants, imputation locale, référence |
| | Familles nucléaires SNP \| 100 familles (hors 2500) \| Ressource technique \| Phasage transmission, haplotypes Réunion |
| **Callout** | ⚠️ Les 100 familles **ne sont pas incluses** dans les 2500. Ressource de phasage, **pas d'observation indépendante**. |
| **Visuel optionnel** | Diagramme 3 cercles/boxes avec flèches montrant flux : 2500 → sélect → 350 WGS; 100 familles → phasage → haplotypes |
| **Footer** | Génome Réunion \| 22 |

---

## 🆕 NOUVELLE SLIDE [23] — Panel Hybride V3

| Élément | Détail |
|---------|--------|
| **Titre** | Panel WGS hybride V3 : noyau géographique + découverte contrôlée |
| **Position** | Après slide 22 |
| **Type** | ⭐ NOUVELLE (critique) |
| **Contenu gauche** | **Pourquoi hybride ?**<br>- Noyau : représentativité géographique dominante<br>- Découverte : profils informatifs rarifiés/fondateurs<br>- Recalibrage : fréquences finales sur les 2500 SNP |
| **Contenu droite** | Tableau allocation V3:<br><br>\| Composante \| % \| N approx \| Objectif \|<br>\|---|---|---|---\|<br>\| Noyau géographique strict \| 90–95% \| 315–332 \| Ancrage démographique \|<br>\| Bras découverte \| 5–10% \| 18–35 \| Rareté/fondateurs/extrêmes \|<br>\| **Total** \| **100%** \| **350** \| **Panel hybride** \|<br><br>**Par défaut opérationnel :**<br>N_core = 322 (92%)<br>N_discovery = 28 (8%) |
| **Callout** | 🚨 **Ne pas confondre :**<br>- Découverte (richesse WGS capturée)<br>≠ Fréquence populationnelle (recalibrage obligatoire sur 2500) |
| **Footer** | Génome Réunion \| 23 |

---

## ✏️ MODIF SLIDE [24] — Deux Niveaux, Une Contrainte

| Élément | Détail |
|---------|--------|
| **Titre** | _(Pas de changement)_ |
| **Statut** | ✏️ MODIF + CLARIFICATION |
| **Changement 1** | Dans la boîte gauche "Niveau 1 — Fondation":<br><br>**AJOUTER** après le titre "Représentativité géographique":<br><br>_Variante opérationnelle : noyau géographique strict (322 indiv) + bras découverte contrôlé (28 indiv)._ |
| **Changement 2** | Dans la boîte droite "Niveau 2 — Optimisation":<br><br>**CLARIFIER** : "Au sein de chaque secteur : maximiser l'information capturée via un score multicritère sur 4 dimensions complémentaires."<br><br>**AJOUTER** : _(Bras découverte : score global insulaire pour profils informatifs rares.)_ |
| **Impact** | Ligne 1679-1690 de index.html |
| **Priorité** | 🟡 HAUTE |

---

## ✏️ MODIF SLIDE [25] — Représentativité Géographique

| Élément | Détail |
|---------|--------|
| **Titre** | _(Pas de changement)_ |
| **Statut** | ✏️ MODIF TABLE + NOTE |
| **Changement 1** | **TABLE existante** (1761-1770):<br><br>AJOUTER une 2e table à droite avec quotas pour N_core = 322:<br><br>\| Secteur \| N cohorte 2500 \| % \| N_core (322) \|<br>\|---|---|---|---\|<br>\| Nord \| 320 \| 12.8% \| 41 \|<br>\| Nord-Est \| 500 \| 20.0% \| 64 \|<br>\| Est \| 380 \| 15.2% \| 49 \|<br>\| Sud-Est \| 400 \| 16.0% \| 52 \|<br>\| Sud \| 350 \| 14.0% \| 45 \|<br>\| Ouest \| 300 \| 12.0% \| 39 \|<br>\| Nord-Ouest \| 250 \| 10.0% \| 32 \|<br>\| **Total** \| **2500** \| **100%** \| **322** \| |
| **Changement 2** | **AJOUTER callout** après les tables:<br><br>_Noyau géographique strict : 322 indiv (92% des 350)._<br>_Bras découverte : 28 indiv (8%) sélectionnés par score insulaire (rareté, fondateurs, utilité imputation), après le noyau._ |
| **Impact** | Ligne 1757-1806 |
| **Priorité** | 🟡 HAUTE |

---

## ✏️ MODIF SLIDE [26] — 4 Composantes de S_div

| Élément | Détail |
|---------|--------|
| **Titre** | _(Pas de changement)_ |
| **Statut** | ✏️ MODIF CALLOUT (rationale global) |
| **Changement** | **REMPLACER le callout actuel** (ligne 1836):<br><br>ANCIEN:<br>_Normalisation locale (min/max par secteur) pour PCA et ADMIX — les scores absolus ne sont pas comparables entre secteurs, ce qui est sans conséquence : classement et stratification n'opèrent qu'au sein de chaque secteur._ <br><br>NOUVEAU:<br>_**Pourquoi global vs par-secteur ?**<br>- PCA (global) : centroïdes secteurs bien positionnés dans un espace commun<br>- ADMIXTURE (global) : modèle ancestral unique → q_k interprétables identiquement tous secteurs<br>- IBD (par-secteur) : parenté dans le contexte local de sélection<br>- ROH (global) : métrique individuelle, non affectée par groupe<br><br>Normalisation locale : rend scores absolus non comparables inter-secteurs. Sans conséquence : sélection opère qu'au sein de chaque secteur._ |
| **Impact** | Ligne 1836 (callout unique) |
| **Priorité** | 🟡 HAUTE |

---

## ✏️ MODIF SLIDE [27] — Composantes Globales : PCA + ADMIX

| Élément | Détail |
|---------|--------|
| **Titre** | _(Pas de changement)_ |
| **Statut** | ✏️ MODIF 2 callouts |
| **Changement 1** | Dans la boîte droite "2 · ADMIX_score — Composition":<br><br>**DANS le texte p.1878**, MODIFIER:<br><br>ANCIEN: _Modèle global → q_k interprétables de façon identique dans tous les secteurs. K optimal déterminé par CV-error (K=2..6). Attendu K=4 pour La Réunion._<br><br>NOUVEAU: _Modèle global → q_k interprétables de façon identique dans tous les secteurs. K optimal déterminé par cross-validation (K testé 2–10 ; choix par CV-error, stabilité, interprétabilité). Attendu K=4 pour La Réunion (africain, indien, européen, malgache)._ |
| **Changement 2** | **AJOUTER callout après SVG** (ligne 1897):<br><br>_**Note :** L'entropie seule ne capture pas la rareté ancestrale. Le bras découverte utilisera une métrique complémentaire : ADMIX_rarity (distance au centroïde q du secteur). À valider en analyse de sensibilité._ |
| **Impact** | Ligne 1874-1896 |
| **Priorité** | 🟡 HAUTE |

---

## ✏️ MODIF SLIDE [28] — Composantes Locales : IBD + ROH

| Élément | Détail |
|---------|--------|
| **Titre** | _(Pas de changement)_ |
| **Statut** | ✏️ MODIF 2 sections (IBD + ROH) |
| **Changement 1 — IBD** | Dans "3 · IBD_score — Indépendance":<br><br>**AJOUTER après le formula** (ligne 1916):<br><br>_Métrique principale : kinship KING (robust en population admixée)._<br>_Seuil de recrutement : kinship_KING ≥ 0.0625 ≈ cousin germain → exclure._<br><br>**DANS le legend table**, MODIFIER les labels:<br><br>ANCIEN \| NOUVEAU<br>φ > 0.25 \| kinship > 0.125 (1er degré) — éliminé<br>0.125–0.25 \| kinship 0.0625–0.125 (2e degré) — seuil dur<br>< 0.125 \| kinship < 0.0625 (non apparenté) — compatible ✓ |
| **Changement 2 — ROH** | Dans "4 · ROH_score — Effet fondateur":<br><br>**APRÈS le formula** (ligne 1941):<br><br>AJOUTER:<br>_Version simple (opérationnelle) : 1 - ROH_total/100Mb._<br>_Version empirique (sensibilité) : 1 - rank_percentile(ROH_total, secteur). À comparer en validation._ |
| **Impact** | Ligne 1913-1975 |
| **Priorité** | 🟡 HAUTE |

---

## ✏️ MODIF SLIDE [29] — Le Score S_div

| Élément | Détail |
|---------|--------|
| **Titre** | _(Pas de changement)_ |
| **Statut** | ✏️ MODIF callout (poids comme "valeurs de travail") |
| **Changement** | Dans le **callout** (ligne 1995):<br><br>**AJOUTER avant "IBD 0.125"** :<br><br>_Les poids 0.30 · 0.30 · 0.25 · 0.15 sont des **valeurs de travail** pré-validation. Ils seront testés par analyse de sensibilité (±10%) et analyse leave-one-component-out avant optimisation finale._ <br><br>**PUIS le reste du callout :** _IBD 0.125 = contrainte dure supplémentaire..._|
| **Impact** | Ligne 1995 (callout single) |
| **Priorité** | 🟡 HAUTE |

---

## ✏️ MODIF SLIDE [30] — Stratification Quintile

| Élément | Détail |
|---------|--------|
| **Titre** | _(Pas de changement)_ |
| **Statut** | ✏️ MODIF TABLE (justifier 60/40) |
| **Changement** | Dans la **table droite** (ligne 2037-2041):<br><br>ANCIEN:<br>\| 6 à 19 \| **Binaire** \| Top 50% → 60 % · Bottom → 40 % \|<br><br>NOUVEAU:<br>\| 6 à 19 \| **Binaire 60/40** \| Top 50% → 60% des WGS. Bottom 50% → 40% des WGS. Maintient anti-biais directionnel avec seulement 2 strates. \|<br><br>**AJOUTER callout après table** (ligne 2043):<br><br>_**Stratification binaire 60/40 :** Le top 50% S_div apporte diversité ; le bottom 50% ancre dans les profils représentatifs du secteur. Ce ratio reproduit l'esprit des quintiles (Q1-Q2=40%, Q3=30%, Q4-Q5=30%) avec 2 strates seulement._ |
| **Impact** | Ligne 2036-2046 |
| **Priorité** | 🟡 HAUTE |

---

## ✏️ MODIF SLIDE [31] — Algorithme Greedy Stratifié

| Élément | Détail |
|---------|--------|
| **Titre** | _(Pas de changement)_ |
| **Statut** | ✏️ MODIF 2 éléments |
| **Changement 1** | **AJOUTER une 4e section** (après "③ Quota non rempli") :<br><br>Div class="card algo-validation-item":<br><br>_**④ Bras découverte sélectionné après noyau**_<br><br>_Les 28 individus du bras découverte sont sélectionnés après constitution du noyau géographique, pour assurer la non-redondance avec les individus déjà retenus. Score S_discovery_global (insulaire) distinct de S_div_sector (local)._ |
| **Changement 2** | **AJOUTER callout AVANT slide-footer** :<br><br>_**Robustesse multi-ordre :** Pour valider la stabilité du greedy, exécuter l'algorithme en plusieurs ordres de secteurs (décroissant de taille, aléatoires ≥100, extrêmes) et mesurer l'intersection des sélections (|A ∩ B| / 350). Cela quantifie la dépendance à l'ordre et la stabilité de la méthodologie._ |
| **Impact** | Ligne 2078-2100 |
| **Priorité** | 🟡 HAUTE |

---

## ✏️ MODIF SLIDE [32] — Exemple Concret

| Élément | Détail |
|---------|--------|
| **Titre** | _(Pas de changement)_ |
| **Statut** | ✓ PAS DE CHANGEMENT |
| **Note** | Le radar chart reste valable. Les trois patients A/B/C illustrent bien le score multicritère et la redondance IBD. |

---

## ✏️ MODIF SLIDE [33] — Avantages et Limitations

| Élément | Détail |
|---------|--------|
| **Titre** | _(Pas de changement)_ |
| **Statut** | ✏️ MODIF CARD "Limitations" (complete rewrite) |
| **Changement** | **REMPLACER la 5e card** (ligne 2190-2196) :<br><br>ANCIEN:<br>_Limitations acceptables et documentées_<br>_Variants MAF < 1% moins fiables (N=350 < résolutions d'études plus larges). Non-optimisation mathématique : S_div est une heuristique paramétrée validée empiriquement, pas une solution algébrique optimale._<br><br>NOUVEAU:<br>_Limitations acceptables et documentées_<br>- ✓ Heuristique paramétrée, non optimale mathématiquement<br>- ✓ Référentiel **première génération** sous contrainte budgétaire<br>- ✓ Variants MAF < 1% : moins fiables avec 350 WGS<br>- ✓ Fréquences WGS **biaisées** par sélection → recalibrage obligatoire sur 2500 SNP<br>- ✓ Améliorable itérativement après validation<br><br>_Ces limitations sont assumées et documentées._ |
| **Impact** | Ligne 2190-2196 |
| **Priorité** | 🟡 HAUTE |

---

## ✏️ MODIF SLIDE [34] — Validation 1000 Genomes

| Élément | Détail |
|---------|--------|
| **Titre** | _(Pas de changement)_ |
| **Statut** | ✏️ MODIF + AJOUT (5 stratégies explicites) |
| **Changement 1** | **AJOUTER après le texte** (avant les tables, ligne 2220):<br><br>_**5 stratégies de sélection comparées :**_<br><br>1. S_div stratifié (proposé) — quintiles/binaire<br>2. S_div naïf — scores élevés seuls (teste biais)<br>3. Random — tirage aléatoire (baseline)<br>4. PCA-only — diversité positionnelle seule<br>5. Maximin IBD — indépendance génétique seule_ |
| **Changement 2** | Dans **criteria-list** (ligne 2227-2229), **AJOUTER** :<br><br>- **Robustesse multi-groupe** : performance cohérente sur africain/européen, sud-asiatique, tri-ancestral (pas d'optimisation locale)<br>- **Stabilité multi-seed** : résultats identiques avec seeds ADMIXTURE différentes |
| **Changement 3** | **AJOUTER callout** avant design-note :<br><br>_**Note :** La cohérence multi-groupe prime sur la performance absolue. Même si KS < 0.10 sur un groupe seul, la validité requiert que tous les 3 groupes passent les critères._ |
| **Impact** | Ligne 2212-2232 |
| **Priorité** | 🟡 HAUTE |

---

## ✏️ MODIF SLIDE [35] — EPIGEN-Brasil

| Élément | Détail |
|---------|--------|
| **Titre** | _(Pas de changement)_ |
| **Statut** | ✏️ MODIF (ajout plateforme) |
| **Changement** | Dans la **liste gauche** (ligne 2253), **MODIFIER** :<br><br>ANCIEN:<br>_✓ **HumanOmni2.5 genotypes** — même plateforme SNP que potentiel pré-screening_<br><br>NOUVEAU:<br>_✓ **HumanOmni2.5 genotypes** — plateforme SNP **compatible avec celle potentiellement utilisée à La Réunion** (harmonisable build/strand)_ |
| **Impact** | Ligne 2253 |
| **Priorité** | 🟢 MOYENNE |

---

## 🆕 NOUVELLE SLIDE [36] — Phasage + 100 Familles Nucléaires

| Élément | Détail |
|---------|--------|
| **Titre** | Phasage réunionnais : 2500 SNP + 100 familles nucléaires |
| **Position** | Après EPIGEN-Brasil slide 35, avant INTRO S05 |
| **Type** | ⭐ NOUVELLE (critique) |
| **Contenu gauche** | **Pourquoi 100 familles nucléaires ?**<br>- Transmission mendélienne validée<br>- Réduit erreurs de phase SNP<br>- Haplotypes adaptés population réunionnaise<br>- Améliore imputation, LAI, IBD, ROH<br><br>**Garde-fou :**<br>- Familles ≠ observations indépendantes<br>- Ressource technique de phasage<br>- Protocole éthique spécifique (non-parenté, filiation) |
| **Contenu droite** | Diagramme flux :<br><br>2500 SNP populationnels<br>        +<br>100 familles nucléaires SNP<br>        ↓<br>phasage populationnel<br>assisté par transmission mendélienne<br>        ↓<br>haplotypes réunionnais<br>        ↓<br>imputation / LAI / IBD / ROH |
| **Callout** | ⚠️ **Distinctions critiques :**<br>- Phasage SNP : utiliser 100 familles ✓<br>- Estimations fréquence : **jamais** 100 familles<br>- Analyses familiales : données séparées<br>- Annotations : séparation stricte technique vs analytique |
| **Footer** | Génome Réunion \| 36 |
| **Classe CSS** | `slide--cream` |

---

## 🆕 NOUVELLE SLIDE [37] — Recalibrage Fréquences

| Élément | Détail |
|---------|--------|
| **Titre** | Fréquences finales : brute → pondérée → imputée |
| **Position** | Après slide 36, avant INTRO S05 slide 38 |
| **Type** | ⭐ NOUVELLE (critique) |
| **Contenu gauche** | **Ne pas confondre :**<br><br>Fréquence WGS brute<br>← observée dans 350 WGS<br>← **biaisée** par sélection<br><br>Fréquence populationnelle pondérée<br>← ajustée par strate géographique<br>← ref = 2500 SNP<br><br>Fréquence imputée<br>← projetée via panel local<br>← qualité fonction MAF |
| **Contenu droite** | Tableau annotation finale:<br><br>\| Variant \| Fréq WGS \| Fréq Pond. \| Statut \|<br>\|---|---|---|---\|<br>\| Commun (MAF>5%) \| Observée \| Pondérée \| Direct/confiance ✓ \|<br>\| Rare (1-5%) \| Observée \| Pondérée \| Direct/confiance ✓ \|<br>\| Très rare (0.5-1%) \| Observée \| Imputée \| HC imputation ✓ \|<br>\| Ultrarare (<0.5%) \| — \| Imputée \| MC imputation ⚠ \| |
| **Callout** | **Formule pondération simple :**<br><br>freq_pond(v) = Σ_secteur poids_secteur × freq_secteur(v)<br><br>avec poids_secteur = prop. secteur dans 2500 SNP |
| **Règle important** | Tous les outputs doivent mentionner : MAF, statut (direct/imputé), confiance (HC/MC), effectif WGS/SNP imputé |
| **Footer** | Génome Réunion \| 37 |
| **Classe CSS** | `slide--cream` |

---

## 📋 SYNTHÈSE DES ACTIONS

| # | Type | Slide | Action | Durée |
|---|------|-------|--------|-------|
| 1 | 🆕 NEW | [21] | Créer : Justification N=350 | 25 min |
| 2 | 🆕 NEW | [22] | Créer : Architecture 3 piliers | 20 min |
| 3 | 🆕 NEW | [23] | Créer : Panel hybride V3 | 20 min |
| 4 | ✏️ MOD | [24] | Clarifier noyau + découverte | 10 min |
| 5 | ✏️ MOD | [25] | Ajouter table N_core + callout | 15 min |
| 6 | ✏️ MOD | [26] | Remplacer callout "global vs secteur" | 10 min |
| 7 | ✏️ MOD | [27] | Clarifier K ADMIX + rareté | 10 min |
| 8 | ✏️ MOD | [28] | Ajouter KING + ROH empirique | 15 min |
| 9 | ✏️ MOD | [29] | Ajouter "poids valeurs travail" | 5 min |
| 10 | ✏️ MOD | [30] | Justifier binaire 60/40 | 10 min |
| 11 | ✏️ MOD | [31] | Ajouter bras découverte + multi-ordre | 15 min |
| 12 | — | [32] | Rien | — |
| 13 | ✏️ MOD | [33] | Refondre limitations | 15 min |
| 14 | ✏️ MOD | [34] | 5 stratégies + robustesse multi-groupe | 15 min |
| 15 | ✏️ MOD | [35] | Plateforme compatible | 5 min |
| 16 | 🆕 NEW | [36] | Créer : Phasage + 100 familles | 25 min |
| 17 | 🆕 NEW | [37] | Créer : Recalibrage fréquences | 25 min |
| **TOTAL** | | | | **~250 min (4h10)** |

---

## ✅ ORDRE D'EXÉCUTION RECOMMANDÉ

**Phase 1 — Fondations (NEW 21-23)** : 65 min
→ Crée le socle théorique V3

**Phase 2 — Corrections texte (MOD 24-35)** : 125 min  
→ Aligne slides existantes avec V3

**Phase 3 — Phasage et fréquences (NEW 36-37)** : 50 min
→ Complète l'architecture 3 piliers

