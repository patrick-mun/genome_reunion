# Méthodologie de validation in silico — Génome Réunion
## Quatre profils de population synthétique et liens INSEE utiles

**Version :** v0.10  
**Statut :** document de travail à intégrer au projet  
**Objectif :** formaliser une stratégie de validation méthodologique indépendante d'une reconstruction historique exhaustive de La Réunion.

**Historique :**
- v0.1 — version initiale (quatre profils, stratégies, métriques, proxys INSEE).
- v0.2 — clarification du **découplage simulateur ↔ méthode** dans §10 (les `%` d'ascendance par secteur deviennent des cibles de calibration émergentes, non des inputs directs) ; ajout d'une section dédiée aux **outils logiciels et au pipeline de simulation** (§11) ; renumérotation des sections suivantes.
- v0.3 — refonte du §5 : classification des métriques en trois tiroirs (primaires extrinsèques / diagnostiques intrinsèques / algorithmiques) avec hiérarchie de jugement explicite ; spécification de **formes mathématiques d'évaluation distinctes** de celles de `S_div` pour les dimensions partagées (PCA, ADMIXTURE, IBD, ROH).
- v0.4 — ajout d'une section **§7 « Seuils de succès quantitatifs (pré-enregistrés) »** : formule du Δ relatif, règle de jugement par profil, table de seuils initiale, trois ancrages de justification (coût-bénéfice, IC 95 %, convention), clause de pré-enregistrement et de tolérance pour les métriques diagnostiques ; ajout du livrable `validation_thresholds.tsv` ; renumérotation §7→§8 … §15→§16.
- v0.5 — prise en compte de **N=2500 comme contrainte budgétaire dure** (§3 préambule) et reformulation : la sous-puissance de `random` sur les variants fondateurs devient l'argument central de la méthode, pas un défaut à corriger. Ajout d'un **paramètre d'apparentement φ et de profondeur d'endogamie** sur les sous-profils fondateurs (§3 B/C/D, §12.3). Nouvelle métrique primaire **taux de capture binaire** `P(≥1 allèle F_k capté)` (§5.1) et reformulation des seuils fondateurs en probabilités de capture (§7.3). Nouvelle section **§7.7 « Analyse de puissance *a priori* »** avec livrable `power_analysis_pre_simulation.tsv`.
- v0.6 — **modèle haplotypique détaillé** (§12.4 nouvelle) avec squelette démographique informé par l'histoire connue de La Réunion : pool de populations sources (1000G + EGA, cohérent V3.5), chronologie des pulses migratoires (founding 1665 → engagisme → moderne), bottleneck fondateur (`Ne ≈ 50`) et croissance exponentielle, architecture chromosomique, protocole d'injection F1–F5, **pool de 100 familles nucléaires simulé en parallèle** pour ancrer le phasage Beagle/SHAPEIT5, sanity-checks de calibration (LD decay + ROH). Ajout du livrable `nuclear_families_pool.vcf`. Renumérotation §12.4 → §12.5, §12.5 → §12.6.
- v0.7 — **évaluation spécifique du bras découverte** (nouvelle §7.8) sans dévier de la logique d'optimisation de la méthode : le ratio noyau/pool libre est **déterminé par analyse de sensibilité** (5 ratios testés), pas fixé doctrinalement. Critère d'utilité positif (gain ≥ +3 points sur au moins une métrique primaire vs `géo-ancestrale seule`) plutôt que critères restrictifs de fidélité à la cohorte. Ajout d'une métrique primaire `IBD résiduel pool libre seul` (anti-redondance interne) en §5.1. Livrable `discovery_arm_sensitivity.tsv`.
- v0.8 — **harmonisation complète avec METHODOLOGY_selection_V3_5.md** (3 paliers fusionnés). Palier 1 (critique) : §4 enrichi avec 4 stratégies V3.5 manquantes (`S_div naïf`, `maximin IBD`, `S_div + novelty λ`, `maximin PCA/ADMIX/IBD`) ; §5.1 enrichi (couverture géo-ancestrale, couverture haplotypique, précision recalibrage fréquences) ; §5.2 : KING kinship explicité (seuil 0,0625) ; §5.3 : LOCO ajouté ; nouvelle §7.9 « Audit puce → WGS » (V3.5 §13.6). Palier 2 (important) : §12.4.7 HWE par strate ; §5.3 sensibilité ±10 %/±20 % explicitée ; §7.3 classe MAF 1–5 % ajoutée ; §7.8 récupération des quotas V3.5 §9.4 mentionnée ; K ADMIXTURE élargi à 2–10. Palier 3 (confort) : §5.2 KS de `S_div` et stabilité labels ADMIXTURE ; nouvelle §17 « Table de correspondance V3.5 ↔ v0.8 ». Livrables ajoutés : `chip_to_wgs_audit.tsv`, `frequency_recalibration_validation.tsv`, `loco_sensitivity.tsv`.
- v0.9 — **validation pré-déploiement par triangulation sur populations réelles externes** (nouvelle §8) : opérationnalise V3.5 §13.2 Validations A/B/C qui étaient absentes de v0.8. La conviction pré-déploiement se construit désormais sur trois sources convergentes — simulation profils A–D, populations réelles externes (1000G + EGA + EPIGEN-Brasil), squelette historique. Critère de succès triangulé §8.5. Chronologie pré-déploiement vs audit ex-post explicitée §8.7. Reformulation du §14 garde-fou n°4 : l'audit ex-post post-WGS n'est **pas** la validation (déjà faite avant déploiement), c'est un sanity-check. Renumérotation §8 → §9, … §17 → §18 ; cross-références mises à jour. Livrables ajoutés : `external_validation_1000G.tsv`, `external_validation_EGA_prioritaires.tsv`, `external_validation_EGA_complementaires.tsv`, `triangulation_summary.tsv`.
- v0.10 — **harmonisation à 8 secteurs** sur tous les profils A/B/C/D (alignés sur §11 : Nord urbain, Nord-Est/Est agricole, Saint-Leu/Hauts Ouest, Sud agricole, Hauts du Sud/Plaine, Sud-Est périphérique, Cirques/Hauts isolés, Ouest littoral) — la maille géographique est désormais constante, condition de comparabilité entre profils. **Corrections de cohérence** : §1 (liste des métriques actualisée), §6 et §17 (référence à la triangulation §8), §7.3 titre, §7.9 (« 11 stratégies »), §8.2/§8.3 (clarification de l'analogue de secteur pour 1000G/EGA), §8.5 (structure de `triangulation_summary.tsv`), §14.4 (renvoi §8.5). **Bugs corrigés** dans §18 : header v0.9, `§13.44`→`§13.4`, « préciisé »→« précisé », doublon « Audit ex-post » supprimé.

---

## 1. Principe général

La validation ne doit pas chercher à prouver que l'on connaît parfaitement la structure réelle de la population réunionnaise. Elle doit tester si la méthodologie de sélection WGS reste robuste dans plusieurs régimes possibles de structure populationnelle.

L'idée retenue est de construire plusieurs populations synthétiques de **2500 individus**, puis de sélectionner **350 WGS** selon différentes stratégies. La méthode est ensuite évaluée selon des métriques communes (cf. §5) : couverture allélique et haplotypique, capture des variants rares et fondateurs, couverture géo-ancestrale, précision du recalibrage de fréquences, parenté résiduelle, performance d'imputation et stabilité algorithmique.

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

### Préambule — Contraintes structurelles de la cohorte synthétique

**N = 2500 est une contrainte budgétaire dure**, alignée sur la cohorte SNP réelle prévue par Génome Réunion. L'augmentation de N n'est pas une option. Cette section précise les conséquences méthodologiques de cette contrainte.

**Conséquence 1 — Sous-puissance assumée du tirage aléatoire pour les fondateurs.** Sur des sous-profils fondateurs représentant ~10 % d'un secteur (~36 individus), un variant à fréquence locale ~6 % donne ~0,6 allèle attendu dans une sélection `random` de 350/2500. La probabilité que `random` capte *zéro* allèle fondateur d'un foyer donné est ≈ 54 %. Cette sous-puissance n'est pas un défaut de la validation, c'est **l'argument central de la méthode** : on évalue précisément la capacité d'une sélection structurée à rendre déterministe ce qui, en tirage aléatoire, est bimodal et imprévisible.

**Conséquence 2 — Intégration de l'apparentement comme paramètre de simulation.** Dans une population avec endogamie locale, dérive sur petit pool reproductif et héritage de quelques lignées fondatrices (Hauts, cirques, marronnage, petits foyers agricoles), les variants fondateurs voient leur **fréquence locale gonflée naturellement** au-delà de leur fréquence introduite. Cet effet est modélisé explicitement via deux paramètres ajoutés au simulateur (cf. §13.3) :

| Paramètre | Notation | Plage par sous-profil fondateur |
|---|---|---|
| Coefficient d'apparentement intra sous-profil | `φ` | 0,03 (B) — 0,05 (C) — 0,08 (D) |
| Profondeur d'endogamie simulée | `G_endo` | 3–4 générations (B) — 4–5 (C) — 5–6 (D) |

Ces valeurs sont **scénarisées** au sens §13.2 (à calibrer empiriquement dès que les SNP réels et les pedigrees CGB seront disponibles).

**Conséquence 3 — Reporting en distribution, pas en moyenne.** Pour les métriques liées aux fondateurs, on rapporte la **distribution de capture sur les ≥ 100 seeds** (taux binaire, P(≥1 allèle capté)) et non un Δ moyen seul. Cela rend visible la bimodalité du tirage aléatoire et l'effet de stabilisation de la méthode ciblée.

**Conséquence 4 — Maille géographique constante à 8 secteurs.** Tous les profils A/B/C/D utilisent les **8 mêmes secteurs** (alignés sur §11 : Nord urbain, Nord-Est/Est agricole, Saint-Leu/Hauts Ouest, Sud agricole, Hauts du Sud/Plaine, Sud-Est périphérique, Cirques/Hauts isolés, Ouest littoral). Cette constance est une **condition de comparabilité** : la méthode `géo-ancestrale` allouant les quotas par secteur, comparer les profils exigerait une maille identique, sinon les différences de performance se confondraient avec des différences de granularité géographique.

---

### Profil A — Homogène

#### Rôle

Contrôle négatif. Il sert à vérifier que la méthode ne crée pas artificiellement une différence lorsque la population est réellement peu structurée.

#### Hypothèse

Tous les secteurs présentent une admixture proche. Les différences géographiques sont faibles.

| Secteur | Européen | Africain | Malgache | Indien | Chinois / Est-asiatique | Comores / Océan Indien |
|---|---:|---:|---:|---:|---:|---:|
| Nord urbain | 20 | 15 | 18 | 30 | 8 | 9 |
| Nord-Est / Est agricole | 18 | 16 | 20 | 30 | 7 | 9 |
| Saint-Leu / Hauts Ouest | 19 | 15 | 18 | 30 | 8 | 10 |
| Sud agricole | 19 | 14 | 18 | 31 | 8 | 10 |
| Hauts du Sud / Plaine | 22 | 14 | 18 | 28 | 7 | 11 |
| Sud-Est périphérique | 18 | 17 | 20 | 29 | 6 | 10 |
| Cirques / Hauts isolés | 20 | 15 | 19 | 30 | 7 | 9 |
| Ouest littoral | 21 | 15 | 17 | 29 | 9 | 9 |

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
| Nord-Est / Est agricole | 12 | 20 | 28 | 30 | 4 | 6 |
| Saint-Leu / Hauts Ouest | 28 | 8 | 12 | 42 | 3 | 7 |
| Sud agricole | 18 | 10 | 10 | 50 | 4 | 8 |
| Hauts du Sud / Plaine | 45 | 8 | 10 | 25 | 2 | 10 |
| Sud-Est périphérique | 12 | 18 | 25 | 35 | 3 | 7 |
| Cirques / Hauts isolés | 35 | 14 | 25 | 16 | 1 | 9 |
| Ouest littoral | 22 | 13 | 15 | 32 | 8 | 10 |

#### Sous-profils à simuler

Exemple pour le **Sud agricole** :

| Sous-profil | Proportion dans le secteur | Signal simulé |
|---|---:|---|
| Engagisme indien agricole | 45 % | forte composante indienne |
| Créole sud admixé | 30 % | mélange indien / européen / africain / malgache |
| Mobilité récente | 15 % | profil diffus |
| Petit foyer fondateur | 10 % | ROH / IBD local, variant rare simulé — `φ ≈ 0,03`, `G_endo = 3–4` |

Exemple pour les **Hauts du Sud / Plaine** :

| Sous-profil | Proportion dans le secteur | Signal simulé |
|---|---:|---|
| Yab / petits agriculteurs | 40 % | composante européenne fondatrice plus élevée — `φ ≈ 0,03`, `G_endo = 3–4` |
| Admixé des Hauts | 30 % | européen + malgache + indien |
| Fondateur local | 20 % | ROH / IBD élevé — `φ ≈ 0,03`, `G_endo = 3–4` |
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
| Ouest littoral | mobilité moderne, mix urbain-périurbain, tourisme | profils diffus, mélange indien / européen / admixé récent |

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
| Nord urbain | 30 | 8 | 8 | 20 | 25 | 9 |
| Nord-Est / Est agricole | 7 | 20 | 29 | 38 | 2 | 4 |
| Saint-Leu / Hauts Ouest | 32 | 6 | 10 | 45 | 1 | 6 |
| Sud agricole | 12 | 6 | 8 | 66 | 2 | 6 |
| Hauts du Sud / Plaine | 60 | 5 | 8 | 18 | 1 | 8 |
| Sud-Est périphérique | 10 | 15 | 22 | 42 | 2 | 9 |
| Cirques / Hauts isolés | 45 | 18 | 25 | 6 | 0 | 6 |
| Ouest littoral | 28 | 12 | 12 | 28 | 12 | 8 |

#### Variants fondateurs simulés

Paramètres d'apparentement appliqués aux zones porteuses : `φ ≈ 0,08`, `G_endo = 5–6`. La fréquence locale **émerge** de la simulation forward-time avec mating restreint ; les valeurs ci-dessous sont les **cibles de calibration** vers lesquelles la simulation doit converger.

| Variant simulé | Zone principale | Fréquence locale (cible) | Fréquence île entière (cible) |
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

Chaque profil doit être soumis aux mêmes stratégies de sélection. La liste ci-dessous est alignée sur les **10 stratégies de comparaison** posées par `METHODOLOGY_selection_V3_5.md` §13.4, complétée par le scénario *opportuniste urbain* comme contre-exemple à battre.

| # | Stratégie | Description | Rôle dans la validation |
|---:|---|---|---|
| 0 | Opportuniste urbain | prélèvement concentré sur quelques zones faciles d'accès | scénario biaisé à battre (extension v0.7) |
| 1 | Random | tirage aléatoire simple parmi les 2500 | référence minimale (V3.5 §13.4 #1) |
| 2 | PCA-only | sélection par distance dans l'espace PCA | teste l'information génétique globale (V3.5 §13.4 #2) |
| 3 | **Maximin IBD** | sélection maximisant la distance IBD pair-à-pair | teste l'évitement de redondance pure (V3.5 §13.4 #3) |
| 4 | **`S_div` naïf** | score combiné sans stratification (greedy global sur `S_div`) | teste la valeur de la stratification (V3.5 §13.4 #4) |
| 5 | Géographique strict + `S_div_sector` | allocation proportionnelle par secteur, `S_div` intra-secteur | teste la stratification géographique seule (V3.5 §13.4 #5) |
| 6 | **Géo-ancestral distributionnel + `S_div_geoancestry`** | secteur × profil d'ascendance avec quintiles intra-cellule | stratégie principale (V3.5 §13.4 #6) |
| 7 | Géo-ancestral + bras découverte | noyau représentatif + pool libre informatif (ratio noyau/pool libre **déterminé par sensibilité**, cf. §7.8 ; 5 ratios testés) | stratégie candidate optimale (V3.5 §13.4 #7) |
| 8 | **`S_div` hybride + gain marginal (novelty `λ`)** | `S_div_geoancestry + λ × novelty(i, S)` avec `λ ∈ {0,10 ; 0,15 ; 0,20}` | teste l'apport du terme de nouveauté (V3.5 §9.2 et §13.4 #8) |
| 9 | **ADMIXTURE + greedy global** | stratification par profils ADMIXTURE puis greedy insulaire | teste l'information ancestrale renforcée (V3.5 §13.4 #9) |
| 10 | **Maximin PCA / ADMIX / IBD** | sélection globale max-min sur les 3 dimensions | teste l'optimisation multi-objectif pure (V3.5 §13.4 #10) |

La stratégie historique « ADMIXTURE-only » de v0.7 est désormais incluse dans la stratégie 9 (ADMIXTURE + greedy global), plus rigoureusement définie.

---

## 5. Métriques de validation

Les mêmes métriques doivent être calculées pour chaque profil et chaque stratégie. Elles sont **classées en trois tiroirs** selon leur indépendance vis-à-vis de la fonction objectif `S_div = 0.30·PCA + 0.30·ADMIX + 0.25·IBD + 0.15·ROH` (cf. §12.2 sur le découplage simulateur ↔ méthode).

### 5.1 Métriques primaires (extrinsèques) — critère décisif de succès

Ces métriques portent sur des dimensions **absentes de `S_div`**. Elles constituent le verdict réel de la performance de la méthode.

| Métrique | Question évaluée | Indépendance vs `S_div` |
|---|---|---|
| Couverture allélique totale | combien de variants sont capturés ? | totale |
| Capture des variants rares (MAF < 1 %) | la stratégie récupère-t-elle les variants à fréquence faible ? | totale |
| Capture des variants modérément rares (MAF 1–5 %) | classe intermédiaire utile pour l'imputation et la pharmacogénétique (V3.5 §13.5) | totale |
| Capture des variants fondateurs simulés (F1–F5), proportion d'allèles | les foyers locaux sont-ils représentés en moyenne ? | totale (variants injectés au stade simulation) |
| **Taux de capture binaire** `P(≥1 allèle F_k capté)` sur ≥ 100 seeds | la stratégie est-elle **fiable** pour chaque fondateur ? (réponse à la bimodalité de `random` sous N=2500) | totale |
| **Couverture géo-ancestrale** | proportion de cellules `secteur × profil d'ascendance` représentées dans la sélection (V3.5 §13.5) | totale |
| **Couverture haplotypique** | diversité de segments haplotypiques couverts (longueur cumulée d'haplotypes uniques) (V3.5 §13.5) | totale |
| **Précision du recalibrage de fréquences** | écart entre fréquence WGS pondérée / imputée et fréquence cohorte de référence (V3.5 §3.4, §13.5) | totale (mesure le livrable final attendu de la méthode) |
| **IBD résiduel intra pool libre** (bras découverte uniquement) | le pool libre sélectionne-t-il des profils rares **non redondants** entre eux ? | totale (anti-doublons familiaux gloutons, cf. §7.8) |
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
| IBD résiduel (distribution) — **KING kinship**, seuil 0,0625 | y a-t-il trop de redondance génétique ? (V3.5 §7.5 : métrique principale = KING ; `relatedness_R ≈ 2 × kinship_KING` ; seuil = cousin germain ou plus proche) |
| Distribution ROH (seuil de travail : 100 Mb, recalibrable empiriquement) | la sélection surreprésente-t-elle l'autozygotie ? (V3.5 §7.6) |
| **Test KS de la distribution `S_div`** | biais directionnel de la sélection vs la cohorte (V3.5 §13.5) |
| **Stabilité des labels ADMIXTURE multi-seed** | cohérence des composantes `q_k` à travers les seeds et alignement avec pools témoins (V3.5 §13.5) |

### 5.3 Métriques algorithmiques (orthogonales) — robustesse

Indépendantes du contenu génétique, elles mesurent la fiabilité du procédé. Conformes à V3.5 §14 (« Analyses de sensibilité »).

| Métrique | Question évaluée | Référence V3.5 |
|---|---|---|
| Stabilité multi-seed | l'algorithme donne-t-il des résultats reproductibles ? | §14.3 |
| Sensibilité aux poids `S_div` (analyse ±10 % et ±20 % sur `w1…w4`) | les conclusions dépendent-elles trop des poids ? Variance faible / modérée / forte | §14.1 |
| **Analyse LOCO (Leave-One-Component-Out)** : `S_full`, `S_−PCA`, `S_−ADMIX`, `S_−IBD`, `S_−ROH` | chaque composante est-elle indispensable ou substituable ? Quelle est la valeur ajoutée de ROH et IBD ? | §14.2 |
| Stabilité à l'ordre de présentation (≥ 100 permutations) | l'algorithme greedy est-il invariant à la permutation des candidats ? | §14.3 |
| Stabilité des tie-breakers randomisés | les égalités sont-elles résolues de façon stable ? | §14.3 |

Pour chaque analyse, sont reportés : intersection moyenne des panels, individus stables, individus frontière, variance des métriques, recommandation de sélection consensus.

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

Ce tableau ne concerne que la **Validation D** (simulation, profils A–D). La conviction pré-déploiement complète repose sur la **triangulation** de cette Validation D avec les Validations A/B/C sur populations réelles externes (cf. §8) ; le critère de succès global est défini en §8.5.

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

### 7.3 Table de seuils proposés (valeurs de travail — à figer avant simulation)

Ces valeurs sont des **points de départ documentés**, à figer formellement avant la première simulation.

| Métrique primaire (§5.1) | δ_A_max | δ_B_min | δ_C_min | δ_D_min | Unité |
|---|---:|---:|---:|---:|---|
| Couverture allélique totale | ≤ 2 % | ≥ 5 % | ≥ 8 % | ≥ 15 % | gain relatif |
| Capture des variants modérément rares (MAF 1–5 %) | ≤ 2 % | ≥ 7 % | ≥ 12 % | ≥ 20 % | gain relatif |
| Capture des variants rares (MAF < 1 %) | ≤ 3 % | ≥ 10 % | ≥ 15 % | ≥ 25 % | gain relatif |
| Capture des fondateurs F1–F5 — **proportion d'allèles** (moyenne) | ≤ 0,10 | ≥ 0,15 | ≥ 0,20 | ≥ 0,35 | différence absolue |
| Capture des fondateurs F1–F5 — **probabilité `P(≥1 allèle capté)`** | `\|P_méthode − P_random\| ≤ 0,10` | `P_random ≤ 0,60` ET `P_méthode ≥ 0,80` | `P_random ≤ 0,55` ET `P_méthode ≥ 0,85` | `P_random ≤ 0,50` ET `P_méthode ≥ 0,90` | probabilité sur ≥ 100 seeds |
| Performance d'imputation aval (ΔR² moyen) | ≤ 0,01 | ≥ 0,02 | ≥ 0,03 | ≥ 0,05 | différence absolue de R² |

**Pourquoi deux lignes pour les fondateurs ?** Sous la contrainte N=2500, la métrique « proportion moyenne d'allèles » lisse une distribution fortement bimodale (capture binaire : 0 ou ≥ 1 allèle). La probabilité de capture exprime directement la **fiabilité** du panel WGS pour un fondateur donné — c'est ce qui compte cliniquement pour la suite (un panel qui capte F1 dans 50 % des runs n'est pas exploitable, même si la moyenne d'allèles paraît honorable).

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

### 7.7 Analyse de puissance *a priori*

Sous la contrainte `N = 2500`, il est obligatoire de **vérifier la puissance statistique du design avant de figer les seuils** §7.3. Le but : éviter de pré-enregistrer un seuil que le design ne peut intrinsèquement pas atteindre (faux échec) ou que tout design atteindrait (faux succès).

#### Procédure

1. **Calcul d'effet minimum détectable (MDE) théorique.** Pour chaque couple (métrique × profil) :
   - **Fondateurs F_k** : sous tirage `random`, la capture est binomiale `B(2 · n_sub_sel, f_k_eff)` où `n_sub_sel` est l'effectif sélectionné dans le sous-profil et `f_k_eff` la fréquence locale **après inflation par apparentement φ** (cf. §3 préambule). On en déduit `P_random(≥1 allèle)` analytiquement et `P_méthode(≥1 allèle)` par simulation ciblée.
   - **Autres métriques** : bootstrap synthétique léger sur une cohorte stub (N=2500) pour estimer la SD du Δ sous `random` ; MDE = `2 × SD / √100 seeds`.
2. **Comparaison aux seuils §7.3.** Si `MDE > δ_min` (resp. `MDE > δ_max` pour A), le design est sous-puissant pour ce critère.
3. **Décision documentée :**
   - soit ajuster `δ_min` à un niveau réaliste (avec justification §7.4) ;
   - soit ajuster le design (φ, G_endo, fréquence cible des fondateurs, répartition des sous-profils) — toujours dans la limite `N = 2500` ;
   - soit déclarer le couple (métrique × profil) **non-évaluable** dans cette validation et le mentionner explicitement comme limitation.

#### Effet attendu de l'apparentement sur la puissance

L'intégration de `φ > 0` (cf. §3 préambule) **augmente naturellement** la fréquence locale effective des variants fondateurs au-delà de leur fréquence introduite. Calcul illustratif sur un sous-profil de 36 individus, `n_sub_sel ≈ 5` en `random` :

| Régime | `f_eff` | `P_random(≥1)` | `P_géo(≥1)` (≈ 8 sélectionnés ciblés) |
|---|---:|---:|---:|
| Sans apparentement (`φ = 0`) | 6 % | 46 % | 62 % |
| Apparentement modéré (`φ ≈ 0,03`, Profils B/C) | 9 % | 60 % | 78 % |
| Apparentement fort (`φ ≈ 0,08`, Profil D) | 12 % | 72 % | 88 % |

L'apparentement creuse l'écart entre stratégies, ce qui **améliore mécaniquement la puissance** pour distinguer la méthode du tirage aléatoire. Cet effet n'est pas une astuce de calibration : il reproduit ce qui est biologiquement attendu dans une petite population insulaire avec fondateurs.

#### Livrable

Un fichier `power_analysis_pre_simulation.tsv` est versionné dans le repo **avant la première simulation de validation**, contenant pour chaque couple (métrique × profil) :

```text
metrique, profil, parametre_design (n_sub, f_intro, phi, G_endo),
MDE_theorique, seuil_pre_enregistre, decision (OK / ajuster_seuil / ajuster_design / non_evaluable),
justification
```

Ce fichier est lui-même soumis à la clause §7.5 de pré-enregistrement.

### 7.8 Évaluation spécifique du bras découverte

Le bras découverte (composante « pool libre informatif » de la stratégie `géo-ancestrale + bras découverte`) est **conçu** pour maximiser la capture d'information en sélectionnant des profils potentiellement éloignés du barycentre de la cohorte. Cette divergence vis-à-vis de la cohorte n'est **pas un défaut** — c'est le mécanisme même par lequel le bras gagne. La validation ne doit pas pénaliser cette divergence par des critères de fidélité (chi² sectoriel, conservation ADMIXTURE, etc.) qui contrediraient la logique d'optimisation `S_div` et la stratification par quintiles posée dans `METHODOLOGY_selection_V3_5.md`.

En revanche, deux risques **réels** subsistent : (a) une redondance interne du pool libre (sélectionner deux porteurs très apparentés d'un même fondateur, ce qui dépense du budget sans gain informationnel), et (b) un ratio noyau/pool libre arbitraire qui rendrait l'évaluation non reproductible.

**Reproduction de la récupération des quotas (V3.5 §9.4).** La simulation doit reproduire fidèlement l'algorithme de récupération en 5 étapes prévu par la méthode : même strate / même secteur → strate voisine / même secteur → autre strate / même secteur → bras découverte insulaire → dérogation documentée. Sinon, la validation évaluerait une méthode différente de celle effectivement déployée.

#### 7.8.1 Détermination du ratio noyau/pool libre par sensibilité

Plutôt que de fixer un ratio doctrinal, on **teste systématiquement** cinq ratios sur le Profil C (scénario principal) :

| Ratio noyau / pool libre | Effectifs (noyau / pool libre) |
|---|---|
| 90 / 10 | 315 / 35 |
| 80 / 20 | 280 / 70 |
| 70 / 30 | 245 / 105 |
| 60 / 40 | 210 / 140 |
| 50 / 50 | 175 / 175 |

Le ratio retenu pour la version finale du panel WGS est celui qui **maximise les métriques primaires §5.1** (couverture allélique, variants rares, capture fondateurs `P(≥1)`, ΔR² imputation) sous la **seule contrainte** d'IBD résiduel intra pool libre raisonnable (cf. §7.8.3). Aucune contrainte de fidélité à la cohorte n'est imposée — le ratio optimal **émerge** de la performance informationnelle, pas d'un dogme.

#### 7.8.2 Critère d'utilité du bras découverte (formulation positive)

Le bras découverte est jugé **utile** sur un profil donné si, par rapport à la stratégie `géo-ancestrale seule` (sans pool libre), il :

- **augmente** au moins une métrique primaire §5.1 d'au moins **+3 points** (gain absolu, calculé sur la médiane des ≥ 100 seeds), parmi :
  - couverture allélique totale,
  - capture des variants rares (MAF < 1 %),
  - capture des fondateurs `P(≥1 allèle F_k capté)`,
  - performance d'imputation aval ΔR² ;
- ne dégrade aucune métrique primaire §5.1 au-delà de la tolérance générale `−5 %` posée pour les diagnostiques §7.6.

Aucun critère sur PCA / ADMIXTURE / chi² sectoriel n'entre dans le verdict. La distorsion vs cohorte est **attendue et acceptée**.

#### 7.8.3 Garde-fou anti-redondance interne

Pour éviter qu'un pool libre se remplisse de doublons familiaux (deux frères porteurs du même fondateur, par exemple), on impose :

```text
IBD_résiduel(pool libre seul) ≤ 1,5 × IBD_résiduel(sélection complète)
```

Si ce ratio dépasse 1,5, le pool libre est jugé sous-optimal (trop concentré sur quelques foyers) et l'algorithme de sélection doit être ajusté avant pré-enregistrement.

#### 7.8.4 Comparaison frontale `+ bras découverte` vs `géo-ancestrale seule`

Toutes les stratégies sont comparées à `random` dans §7.3. Pour le bras découverte, on ajoute une **comparaison frontale supplémentaire** contre `géo-ancestrale seule` : *« qu'apporte le pool libre au-delà du noyau représentatif ? »*. Cette comparaison est reportée dans un livrable dédié `discovery_arm_sensitivity.tsv` (ratios × métriques primaires × profil), mais ne sert **pas** de critère d'échec restrictif au-delà du §7.8.2.

#### Livrable

`discovery_arm_sensitivity.tsv` versionné, contenant pour chaque ratio et chaque profil :

```text
ratio (90/10 … 50/50), profil, métrique primaire,
valeur_méthode (géo-anc + bras découverte),
valeur_référence (géo-ancestrale seule),
gain_absolu, IC_95,
IBD_pool_libre_seul, IBD_sélection_complète, ratio_IBD,
utilité_déclarée (oui / non) + métrique(s) bénéficiaire(s)
```

### 7.9 Audit puce SNP → WGS (V3.5 §13.6)

La sélection réelle part de la **puce SNP 1,9 M**, pas du WGS. Il faut donc vérifier que le scoring `S_div` calculé sur SNP sélectionne effectivement les individus qui maximisent l'information WGS. Sans cet audit, on valide une méthode dans un monde idéal qui n'est pas celui du déploiement.

#### Procédure

1. Partir des cohortes synthétiques A–D, qui contiennent l'information WGS complète (≥ 500 000 variants simulés par individu).
2. **Restreindre** chaque cohorte aux SNP présents sur la puce 1,9 M (intersection avec une liste de marqueurs représentatifs).
3. Appliquer QC et LD pruning selon les usages standards (PLINK 2).
4. Calculer les scores `S_div_geoancestry` et `S_discovery_global` **sur la version puce uniquement**.
5. Sélectionner les 350 individus selon les stratégies §4 (notamment 5 à 10, cœur du test comparatif).
6. **Mesurer la couverture WGS réelle** (métriques primaires §5.1) sur les individus ainsi sélectionnés.

#### Question centrale

> Un score calculé sur puce SNP sélectionne-t-il bien les individus qui maximisent l'information WGS ?

#### Critère de succès

Le scoring puce est jugé fidèle si :

```text
|métrique_primaire(sélection_puce) − métrique_primaire(sélection_WGS_complet)| ≤ 5 %
```

pour les métriques de §5.1 sur le profil C (scénario principal). Au-delà, la méthode est jugée sensible à la perte d'information liée à la puce et doit être discutée explicitement comme limitation.

#### Livrable

`chip_to_wgs_audit.tsv` versionné, contenant pour chaque stratégie et chaque profil :

```text
strategie, profil, metrique_primaire,
valeur_selection_puce, valeur_selection_WGS_complet,
ecart_absolu, ecart_relatif, fidelite_puce (OK / dégradation)
```

---

## 8. Validation sur populations réelles externes

### 8.1 Principe : triangulation pour la conviction pré-déploiement

L'objectif du présent document est de **démontrer la pertinence de V3.5 avant le déploiement** des 350 WGS réunionnais — donc *avant* l'arrivée des données réelles de La Réunion. La simulation (§3, §13.4) seule risquerait d'être perçue comme un monde imaginaire. Pour rendre la démonstration défendable sans données réunionnaises, on **triangule** trois sources de conviction indépendantes :

| Source de conviction | Nature | Section |
|---|---|---|
| 1. Simulation profils A–D | mondes possibles, robustesse multi-scénarios | §3 |
| 2. **Populations réelles externes** (1000G + EGA) | données empiriques sur populations admixées analogues | **§8 (cette section)** |
| 3. Squelette historique attesté | chronologie, founding 1665, événements documentés | §13.4 |

Si la méthode V3.5 gagne sur les trois fronts, la pertinence pré-déploiement est défendable. Si elle gagne sur deux fronts mais échoue sur le troisième, la limitation est documentée. Si elle échoue sur deux fronts, le déploiement WGS doit être reporté pour révision.

### 8.2 Validation A — 1000G public (V3.5 §13.2)

**Datasets** : populations admixées et de référence directement accessibles, sans accès contrôlé :

| Population 1000G | Caractéristique | Rôle dans la validation |
|---|---|---|
| ACB (Afro-Caribbean Barbados) | admixée Afrique + Europe | proxy d'une population créole atlantique, comparable structurellement à La Réunion sur l'axe afro-européen |
| ASW (African-American Southwest US) | admixée Afrique + Europe (proportions différentes d'ACB) | second proxy afro-européen indépendant |
| GIH (Gujarati Indians Houston) | composante indienne migrée | proxy de la composante indienne engagiste |
| BEB (Bengali Bangladesh) | composante sud-asiatique distincte | sensibilité de la composante indienne |
| CEU / IBS / TSI | européens | outgroup européen (non utilisé comme source de simulation, cf. §13.4.1) |
| CHB / CHS / JPT / KHV | est-asiatiques | proxy de la composante chinoise/Hakka |

**Procédure** :

1. Charger les VCF 1000G high-coverage pour les populations ci-dessus, fusionnées en une cohorte multi-populations.
2. Définir une **cible artificielle de sélection** : par ex. sélectionner 14 % d'individus (équivalent au ratio 350/2500) de la cohorte fusionnée.
3. **Analogue de secteur** : comme 1000G n'a pas de secteurs réunionnais, la **population 1000G d'origine** (ACB, GIH, CEU…) tient lieu de « secteur » pour la stratification géographique, et le profil ADMIXTURE individuel tient lieu de « profil d'ascendance ». La cellule `secteur × ascendance` devient donc `population 1000G × cluster ADMIXTURE`.
4. Appliquer les **11 stratégies §4** sur cette cohorte (la stratégie 6 utilise les cellules définies en 3).
5. Calculer les **métriques primaires §5.1** sur chaque sélection.
6. Vérifier que la stratégie `géo-ancestrale + bras découverte` **gagne** sur les métriques primaires.

**Critère de succès** : la méthode `géo-ancestrale + bras découverte` atteint le plus haut score primaire (ou est à égalité avec une stratégie indistinguable statistiquement) sur **≥ 75 %** des couples (population × métrique primaire) testés.

### 8.3 Validation B — 1000G + EGA prioritaires (V3.5 §13.2)

**Datasets EGA prioritaires** (accès contrôlé, voir Phase 0 de V3.5 §17) :

| Pool EGA | Pertinence pour La Réunion |
|---|---|
| **MGUA Malagasy WGS** | composante malgache directement représentée |
| **MAGE Madagascar SNP** | extension MGUA en densité SNP |
| **GenomeAsia** | composantes indienne et chinoise (Asie du Sud-Est) |
| **Angola / Mozambique WGS** | composante africaine bantu d'esclavage |

**Procédure** : identique à §8.2 (même définition d'analogue de secteur `pool d'origine × cluster ADMIXTURE`), mais sur des cohortes plus proches structurellement de La Réunion. C'est la couche la plus directe pour anticiper la performance sur la Réunion réelle.

**Critère de succès** : la méthode `géo-ancestrale + bras découverte` gagne sur **≥ 80 %** des couples (pool × métrique primaire) — seuil plus exigeant que Validation A car les populations sont plus représentatives.

### 8.4 Validation C — EGA complémentaires et populations admixées comparables

**Datasets** :

| Pool / Étude | Pertinence |
|---|---|
| AGVP (African Genome Variation Project) | diversité africaine large |
| H3Africa WGS | référence africaine de second ordre |
| Pacific WGS (selon accès) | populations insulaires comparables |
| **EPIGEN-Brasil** (publié) | cohorte brésilienne admixée 6487 ind. — déjà référencée dans le deck slide 37 |

**Procédure** : tester la robustesse de la méthode sur des populations admixées éloignées de La Réunion structurellement, mais comparables par leur dynamique (insularité, dérive, admixture multi-vagues).

**Critère de succès** : la méthode reste **non-inférieure** à `random` sur les métriques primaires (`Δ ≥ 0` avec IC 95 % ne croisant pas le seuil bas) — ce niveau d'exigence allégée reconnaît que ces populations sont structurellement plus éloignées.

### 8.5 Critère de succès triangulé

La validation pré-déploiement est **considérée acquise** si :

```text
(Validation A réussie)  ET  (Validation B réussie)  ET  (Validation C non-inférieure)
ET
(Validation D = profils A/B/C/D synthétiques, §3+§7) réussie
ET
(Sanity-checks de calibration §13.4.7) passés
```

Si **2 des 4 conditions** échouent, le déploiement WGS est reporté pour révision méthodologique. Si une seule condition échoue, la limitation est documentée explicitement dans le rapport final (§16 livrable `validation_report`) et le déploiement peut être autorisé sous réserve d'engagement de re-validation post-WGS.

Le bilan est consigné dans `triangulation_summary.tsv` :

```text
condition (Validation_A / B / C / D / sanity_checks),
metrique_ou_critere, seuil_attendu, valeur_observée,
statut (réussi / non-inférieur / échec),
décision_globale (déployer / déployer_avec_limitations / reporter)
```

### 8.6 Livrables

| Livrable | Contenu |
|---|---|
| `external_validation_1000G.tsv` | métriques primaires × stratégies × populations 1000G (Validation A) |
| `external_validation_EGA_prioritaires.tsv` | métriques × stratégies × pools EGA prioritaires (Validation B) |
| `external_validation_EGA_complementaires.tsv` | métriques × stratégies × pools EGA larges + EPIGEN-Brasil (Validation C) |
| `triangulation_summary.tsv` | bilan des 4 conditions de succès §8.5 |

Ces livrables sont versionnés et soumis à la clause §7.5 de pré-enregistrement.

### 8.7 Chronologie pré-déploiement vs audit ex-post

Pour lever toute ambiguïté avec le garde-fou §14.4 (« calibrer dès que les SNP réels sont disponibles ») :

```text
[T-12 mois]   Pré-enregistrement seuils + paramètres
[T-9 mois]    Validation A (1000G public)         ← démonstration sans données réunionnaises
[T-6 mois]    Validation B (1000G + EGA)          ← démonstration sans données réunionnaises
[T-6 mois]    Validation C (EGA complémentaires)  ← démonstration sans données réunionnaises
[T-3 mois]    Validation D (simulation A–D)       ← démonstration sans données réunionnaises
[T-0]         Triangulation §8.5 → décision déploiement OU report
              ↓
              Si OK : déploiement sélection des 350 WGS réunionnais
              ↓
[T+12 mois]   Production WGS terminée
[T+15 mois]   Audit ex-post (V3.5 §13.7) : profil dominant identifié, cohérence vérifiée
              → NE valide PAS la méthode (déjà fait)
              → DOCUMENTE la cohérence et les écarts éventuels
```

**L'audit ex-post n'est pas la validation.** La validation a été faite en T-9 à T-3 par triangulation. L'audit ex-post est un sanity-check qui ferme la boucle.

---

## 9. Proxys à intégrer dans le simulateur

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

## 10. Liens INSEE utiles

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

## 11. Table de données minimale recommandée

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

## 12. Formulation algorithmique

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

### 12.1 Statut de la formulation : cible de calibration, non tirage individuel

L'équation ci-dessus **ne décrit pas un tirage individuel d'ascendance**. Elle définit les **fréquences ancestrales attendues** par secteur, qui servent de **cibles de calibration** pour le simulateur démographique.

Les individus synthétiques ne sont **pas** générés en tirant `g` selon `P(g|s,t)`. Ils sont produits par une simulation forward-time (ou coalescente) sur `G ≈ 10–12` générations, avec recombinaison, dérive, migration inter-secteurs et injection éventuelle de variants fondateurs sur lignées spécifiques. Le **squelette démographique** qui définit cette génératrice (populations sources, dates des pulses migratoires, bottleneck fondateur 1665) est détaillé en **§13.4 « Modèle haplotypique détaillé »**. Les proportions ancestrales observées en sortie sont ensuite **comparées** aux cibles ; les flux migratoires `F(g,t)` et les pondérations `αg…ηg` sont ajustés jusqu'à convergence des sorties simulées sur les tableaux §3.

### 12.2 Pourquoi ce découplage est indispensable

Le simulateur doit opérer à un **niveau plus profond** que la méthode de sélection, pour les raisons suivantes :

1. **Éviter une validation tautologique.** Si les `%` d'ascendance par secteur étaient des inputs directs du simulateur, et que la sélection `géo-ancestrale` optimise sur ces mêmes `%`, le gain mesuré serait garanti par construction et ne validerait rien.
2. **Faire émerger une structure haplotypique réaliste.** Les métriques `IBD résiduel`, `ROH`, `capture des variants fondateurs` et `performance d'imputation` n'ont de sens que si les individus synthétiques portent des **blocs haplotypiques cohérents** issus de recombinaison sur plusieurs générations, pas des étiquettes ancestrales posées à la main.
3. **Disjoindre fonction objectif et métrique d'évaluation.** La fonction objectif `S_div` de la méthode et les métriques §5 doivent reposer sur des grandeurs construites différemment, sinon on mesure la cohérence interne de la méthode, pas sa performance réelle. Voir §5 pour la classification opérationnelle en métriques **primaires** (extrinsèques, juges du succès), **diagnostiques** (intrinsèques, témoins) et **algorithmiques** (contrôles).

Les `%` ancestraux des tableaux §3 sont donc traités comme des **sorties émergentes** d'une démographie sous-jacente plus riche, non comme des paramètres de tirage. Cette discipline méthodologique est l'un des piliers de la validité de l'étude.

---

## 13. Outils logiciels et pipeline de simulation

### 13.1 Vue d'ensemble du pipeline

```text
[1] Démographie historique        →  msprime (coalescent multi-population)
        ↓ pool sources 1000G + EGA, pulses datés (cf. §13.4)
[2] Variants fondateurs simulés   →  SLiM 4 (forward-time)
        ↓ injection F1…F5 sur lignées spécifiques (profil D)
        ↓ apparentement intra sous-profil (φ, G_endo)
        │
        ├──[2a] Cohorte principale 2500 ind. → VCF + métadonnées (secteur, sous-profil)
        │
        └──[2b] Pool de phasage : 100 familles nucléaires (~400 ind., pedigree connu)
                ↓ mêmes paramètres démographiques, simulé en parallèle
[3] Phasage statistique             →  Beagle 5.4 / SHAPEIT5
        ↓ référence = pool [2b], cible = cohorte [2a]
[4] PCA / ADMIXTURE / IBD / ROH     →  PLINK 2, ADMIXTURE, hap-ibd, GARLIC
        ↓ scores par individu
[5] Sélection 350 WGS               →  Python (7 stratégies, dont géo-ancestral)
        ↓
[6] Métriques de validation         →  scikit-allel, pandas, R
        ↓
[7] Imputation aval (2150 SNP)      →  Beagle 5.4 ou GLIMPSE2
        ↓
[8] Rapport final                   →  Quarto / Jupyter Book (HTML + PDF)
```

### 13.2 Outils recommandés par étape

| Étape | Outil principal | Rôle | Licence |
|---|---|---|---|
| Simulation démographique | **msprime** (Python) | coalescent multi-population, admixture pulsée, recombinaison | MIT |
| Variants fondateurs / dérive | **SLiM 4** | forward-time, injection variants rares, petites populations | GPL-3 |
| Carte génétique | **HapMap / deCODE** | taux de recombinaison réalistes (GRCh38) | publique |
| QC / manipulation VCF | **bcftools**, **PLINK 2** | filtrage MAF, HWE, missingness, conversion formats | GPL/MIT |
| PCA | **PLINK 2 (`--pca`)** ou **smartpca** | structure globale | GPL |
| ADMIXTURE supervisée + non supervisée | **ADMIXTURE 1.3** | proportions `q_k`, K exploré de **2 à 10** (V3.5 §7.3), choix final par CV-error + stabilité multi-seed + cohérence pools témoins | libre académique |
| IBD | **hap-ibd** ou **iLASH** | segments partagés ≥ 2–3 cM | libre académique |
| ROH | **PLINK 2 (`--homozyg`)** ou **GARLIC** | distribution d'autozygotie | GPL |
| Sélection géo-ancestrale | **Python** (numpy, pandas, scikit-allel) | implémentation `S_div` + 7 stratégies | MIT |
| Imputation aval | **Beagle 5.4** ou **GLIMPSE2** | imputation des 2150 SNP non-WGS | libre académique |
| Orchestration | **Snakemake** ou **Nextflow** | DAG reproductible, multi-seed, traçabilité | MIT/Apache |
| Conteneurisation | **Docker** ou **Singularity / Apptainer** | image figée, ré-exécution exacte | libre |
| Rapport final | **Quarto** | HTML + PDF auditables, code embarqué | MIT |

### 13.3 Paramètres de simulation à fixer (valeurs indicatives)

| Paramètre | Valeur indicative | Justification |
|---|---|---|
| Profondeur générationnelle `G` | 10–12 générations | depuis 1665, ≈ 25–30 ans/génération |
| Taille effective initiale `Ne` par secteur | 200–500 | calibrée sur démographie historique INSEE |
| Taux de recombinaison | carte HapMap GRCh38 | standard humain |
| Taux de mutation `μ` | 1,25 × 10⁻⁸ / site / génération | valeur consensus humaine |
| Brassage inter-secteurs | 1–5 % / génération (variable selon période) | faible pour Hauts/cirques, fort pour côtes |
| **Coefficient d'apparentement intra sous-profil fondateur `φ`** | 0,03 (B) — 0,05 (C) — 0,08 (D) | gonfle naturellement la fréquence locale des fondateurs (cf. §3 préambule, §7.7) |
| **Profondeur d'endogamie simulée `G_endo`** | 3–4 (B) — 4–5 (C) — 5–6 (D) générations | mating restreint sur petit pool reproductif (SLiM 4) |
| Nombre de réplicats par profil | ≥ 100 seeds indépendantes | pour intervalles de confiance des métriques et taux de capture binaire `P(≥1)` |
| Nombre de SNP simulés | ≥ 500 000 sur 22 autosomes | suffisant pour PCA, ADMIXTURE, ROH, IBD |
| Taille cohorte synthétique `N` | **2500 (contrainte budgétaire dure)** | alignée sur la cohorte SNP réelle ; non négociable (cf. §3 préambule) |
| Statut paramètre | `observé` / `estimé` / `scénarisé` | obligatoire par §14 garde-fous (`φ` et `G_endo` sont `scénarisés`) |

### 13.4 Modèle haplotypique détaillé

Cette sous-section formalise la **génératrice démographique** qui produit les cohortes synthétiques. L'esprit reste celui de la §3 préambule et du §14 garde-fous : **s'approcher de l'histoire connue, pas la reconstruire**. Le squelette ci-dessous combine événements historiques attestés (statut `observé`) et paramètres démographiques fins (statut `scénarisé`).

#### 13.4.1 Pool de populations sources (bootstrap d'haplotypes)

Cohérent avec V3.5 du projet (slide 25 « Pools témoins externes »). Les haplotypes des populations sources sont bootstrappés depuis les références publiques, plutôt que simulés *from scratch* :

| Population source | Proxy 1000G / EGA | `Ne` effectif | Rôle |
|---|---|---:|---|
| Europe (français) | CEU (1000G) | 10 000 | colons fondateurs + mainland récent |
| Afrique de l'Est / Madagascar | **MGUA** (EGA) | 5 000 | esclavage + composante austronésienne |
| Afrique Bantu (Mozambique / Angola) | **MAGE** (EGA) + YRI (1000G) | 15 000 | esclavage continental |
| Inde (Tamoul / sud) | GIH (1000G) | 12 000 | engagisme agricole |
| Chine du Sud / Hakka | CHS (1000G) + GenomeAsia | 10 000 | engagisme commercial |
| Comores | proxy Bantu Est (MAGE / YRI) | 5 000 | migration moderne (approximation) |

**Découplage simulateur ↔ analyse :** pour éviter qu'une même référence serve à la fois de source de simulation et d'ancrage d'évaluation (ADMIXTURE supervisée K=4 de la V3.5), réserver **YRI et CEU comme outgroups d'évaluation** et utiliser **MGUA, MAGE, GIH, CHS, GenomeAsia** pour le bootstrap d'haplotypes en simulation. Si une population doit être réutilisée des deux côtés, le justifier explicitement dans le manifest de calibration.

#### 13.4.2 Chronologie démographique (12 générations, ~30 ans/gén., base 2025)

| Génération | Date approx. | Évènement | Pulse migratoire (proportion du flux entrant à cette période) | Statut |
|---:|---|---|---|---|
| **12** | 1665 | **Founding** | 70 % CEU + 25 % MGUA + 5 % GIH | évènement `observé`, proportions `scénarisé` |
| 11 → 7 | 1695 → 1815 | Esclavage continu | 60 % MGUA + 40 % MAGE / YRI | `observé` / `scénarisé` |
| 6 | 1845–1850 | Abolition (1848) | fin du flux esclavage | `observé` |
| 5 → 3 | 1860 → 1930 | **Engagisme** | 80 % GIH + 15 % CHS + 5 % YRI (Comores) | `observé` / `scénarisé` |
| 2 → 0 | 1965 → 2025 | Mobilité moderne | 70 % CEU + 20 % Comores + 10 % mixed | `observé` / `scénarisé` |

#### 13.4.3 Bottleneck fondateur et croissance

| Paramètre | Valeur | Statut |
|---|---|---|
| `Ne_founding` (1665, gén. 12) | ≈ 50 effective | `scénarisé` (≈ 30 colons attestés + variance reproductrice) |
| Croissance | exponentielle, λ ≈ 0,63 / gén. | `scénarisé` |
| `Ne_actuel` (2025, gén. 0) | ≈ 100 000 effective | `scénarisé` (population census ≈ 850 000) |

Cette croissance rapide d'un fondateur de ~50 vers ~100 000 reproduit la signature de **dérive génétique forte** typique d'une colonisation insulaire et favorise l'émergence naturelle des fréquences fondateur cibles (cf. §3.D).

#### 13.4.4 Architecture chromosomique

| Élément | Choix |
|---|---|
| Chromosomes | 22 autosomes GRCh38 |
| Chromosome X | **exclu** par défaut (modélisation distincte non justifiée pour la validation) |
| Longueur totale | ≈ 2,9 Gb |
| Carte de recombinaison | HapMap GRCh38 (sex-averaged), centromères masqués |
| Variants retenus (analyses globales) | MAF ≥ 0,5 % sur la cohorte simulée |
| Variants retenus (catégorie « rares ») | MAF < 1 % conservés intégralement |

#### 13.4.5 Protocole d'injection des variants fondateurs F1–F5

| Élément | Spécification |
|---|---|
| Hand-off | msprime → SLiM 4 à la génération `G_endo` (cf. §3 préambule) |
| Origine | un **seul haplotype ancestral** par variant F_k (origine unique) |
| Position | tirée aléatoirement hors régions à fort LD problématique (HLA, centromères, télomères) |
| Génération d'introduction | calibrée par run de pré-validation pour atteindre la fréquence locale cible §3.D |
| Trajectoire | dérive libre jusqu'au présent, sans forçage à chaque génération |
| Mating dans le sous-profil porteur | restreint selon `φ` et `G_endo` (cf. §3 préambule et §13.3) |

#### 13.4.6 Pool de 100 familles nucléaires pour le phasage

| Élément | Spécification |
|---|---|
| Effectif | 100 trios ou quatuors (~400 individus) |
| Simulation | **en parallèle** de la cohorte principale, mêmes paramètres §13.4.1–§13.4.3 |
| Pedigree | connu et exporté (PED file standard) |
| Rôle | référence pour le phasage statistique Beagle 5.4 / SHAPEIT5 de la cohorte principale 2500 |
| Statut | indépendant des 2500 individus de sélection, n'entre pas dans le pool de candidats WGS |

Ce pool reproduit l'organisation prévue par V3.5 (slide 33 « Phasage réunionnais — 2500 SNP + 100 familles nucléaires »). Il évite à la fois (a) le phasage parfait msprime qui surévaluerait la qualité des métriques IBD/ROH et (b) le phasage Beagle sans référence qui les sous-évaluerait.

#### 13.4.7 Sanity-checks de calibration (avant les 100 seeds de validation)

Avant de lancer les ≥ 100 seeds par profil, exécuter **3 à 5 runs de calibration** et vérifier qualitativement les cibles suivantes. Si écart majeur, ajuster les `Ne` et proportions de pulses (statut `scénarisé`) — pas les évènements historiques.

| Cible haplotypique | Attendu | Méthode |
|---|---|---|
| Proportions ADMIXTURE par secteur | écart < 5 points / composante vs §3 (profil considéré) | ADMIXTURE supervisée K=4 (et exploration K=2–10) |
| Décroissance LD `r²(d)` | LD réunionnaise > LD sources à toute distance | PLINK 2 `--r2` |
| Distribution ROH | pic à 1–5 Mb pour sous-profils fondateurs (φ > 0) ; seuil de travail 100 Mb, recalibrable | PLINK 2 `--homozyg` |
| **HWE par strate (effet Wahlund)** | HWE global trompeur en population admixée ; tester HWE secteur par secteur, pas sur la cohorte agrégée (V3.5 §11.4) | PLINK 2 `--hardy` stratifié par secteur |

Le manifest de calibration est versionné dans `simulation_calibration.tsv` (livrable, §15) et soumis à la clause §7.5 de pré-enregistrement.

### 13.5 Exigences de reproductibilité

Toute la chaîne doit être :

- **versionnée** (Git, un tag par run de validation) ;
- **conteneurisée** (image Docker/Singularity figée, avec versions exactes des outils) ;
- **paramétrée par seed** (un seed par réplicat, journalisé dans un manifest) ;
- **orchestrée** par Snakemake ou Nextflow (DAG reproductible, reprise sur échec) ;
- **archivée** avec hash SHA-256 des cohortes synthétiques produites, pour permettre une ré-exécution exacte ou une audit indépendant.

### 13.6 Alternatives et options

| Besoin | Alternative |
|---|---|
| Simulation très grande échelle | **stdpopsim** (catalogue de modèles démographiques humains pré-validés, basé sur msprime) |
| ADMIXTURE non supervisée comparative | **fastSTRUCTURE** ou **sNMF** (R) |
| Phasage si besoin | **SHAPEIT5** ou **Beagle 5.4** (déjà cité) |
| Visualisation PCA / ADMIXTURE | **R** (ggplot2, pophelper) ou **Python** (matplotlib, seaborn) |
| Comparaison cohortes (Fst, etc.) | **scikit-allel** (Python) ou **EIGENSOFT** |

---

## 14. Garde-fous scientifiques et éthiques

La simulation doit respecter quatre garde-fous :

1. **Ne pas assigner une origine individuelle.** Les composantes sont des outils de simulation génétique, pas des identités sociales.
2. **Distinguer les paramètres observés, estimés et scénarisés.** Chaque paramètre doit recevoir un statut : `observé`, `estimé`, `scénarisé`. Application au modèle haplotypique §13.4 : dates et évènements historiques (founding 1665, abolition 1848, périodes d'engagisme) = `observé` ; `Ne_founding`, proportions de chaque pulse, `φ` et `G_endo` = `scénarisé` ; proxys 1000G/EGA des populations sources = `estimé` (substituts de populations historiques non directement observables).
3. **Ne pas présenter les profils comme des mesures réelles.** Les profils A-D servent à valider la méthode, non à décrire définitivement La Réunion.
4. **Audit ex-post à l'arrivée des 2500 SNP réels (sanity-check, pas validation).** La validation de la méthode V3.5 est faite *avant* le déploiement, par triangulation §8.5 (simulation + populations réelles externes + squelette historique). À l'arrivée des SNP réunionnais réels, un audit ex-post compare les sorties effectives (PCA, ADMIXTURE, ROH, IBD, fréquences) **au profil synthétique le plus proche** parmi A/B/C/D, vérifie la cohérence avec les prédictions de validation, et documente les écarts comme limitations. Cet audit **ne valide pas** la méthode — il ferme la boucle. Voir aussi V3.5 §13.7 « Audit ex-post 350 WGS ».

---

## 15. Positionnement final recommandé

Le scénario principal du projet doit être le **Profil C — mixte-hétérogène réunionnais plausible**.

Texte de justification recommandé :

> La population réunionnaise ne sera pas modélisée comme une population homogène ni comme une population totalement fragmentée. Le scénario principal sera un profil mixte-hétérogène : une population globalement admixée, mais présentant des gradients géographiques, des sous-profils locaux, des zones à héritage agricole ou commercial marqué et des foyers potentiels d'effets fondateurs. Ce scénario sera encadré par un profil homogène servant de contrôle négatif, un profil mixte avec sous-structure cachée et un profil hétérogène extrême utilisé comme stress-test méthodologique.

---

## 16. Livrables attendus

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
| `power_analysis_pre_simulation.tsv` | analyse de puissance *a priori* pré-enregistrée (§7.7) |
| `discovery_arm_sensitivity.tsv` | sensibilité du bras découverte au ratio noyau/pool libre (§7.8) |
| `chip_to_wgs_audit.tsv` | audit puce SNP → WGS, fidélité du scoring sur puce (§7.9, V3.5 §13.6) |
| `external_validation_1000G.tsv` | métriques × stratégies × populations 1000G (§8.2 Validation A) |
| `external_validation_EGA_prioritaires.tsv` | métriques × stratégies × pools EGA prioritaires (§8.3 Validation B) |
| `external_validation_EGA_complementaires.tsv` | métriques × stratégies × pools EGA larges + EPIGEN-Brasil (§8.4 Validation C) |
| `triangulation_summary.tsv` | bilan des 4 conditions de succès de la validation pré-déploiement (§8.5) |
| `frequency_recalibration_validation.tsv` | validation du recalibrage de fréquences (§5.1, V3.5 §3.4) |
| `loco_sensitivity.tsv` | analyse leave-one-component-out sur `S_div` (§5.3, V3.5 §14.2) |
| `nuclear_families_pool.vcf` | pool de 100 familles nucléaires pour ancrage du phasage (§13.4.6) |
| `simulation_calibration.tsv` | manifest de calibration du modèle haplotypique (§13.4.7) |
| `validation_report.html/pdf` | rapport interprétable et auditable |

---

## 17. Résumé opérationnel

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

Ces quatre profils constituent la **Validation D**. La conviction pré-déploiement complète est obtenue par **triangulation** (§8) de cette Validation D avec les Validations A/B/C sur populations réelles externes (1000G + EGA + EPIGEN-Brasil) et le squelette historique. Le critère de succès global est défini en §8.5.

Cette approche rend la validation de la stratégie WGS défendable **avant déploiement**, car elle ne dépend pas d'une reconstruction historique parfaite de La Réunion : elle teste la méthode dans plusieurs mondes possibles et sur des populations réelles analogues. À l'arrivée des 2500 SNP réunionnais, un **audit ex-post** (§8.7, §14 garde-fou n°4) documente la cohérence — il ne s'agit pas d'une calibration *a posteriori* de la validation, déjà acquise.

---

## 18. Table de correspondance V3.5 ↔ v0.10

Ce tableau facilite la lecture croisée des deux documents et atteste que chaque exigence de `METHODOLOGY_selection_V3_5.md` est couverte par une section de validation.

| Élément V3.5 | Section V3.5 | Couverture v0.10 |
|---|---|---|
| Architecture 2500 + 350 + 100 familles | §2.1, §5 | §3 préambule, §13.4.6 |
| Module familial 100 trios/quatuors | §5 | §13.4.6 |
| Pools témoins 1000G + EGA (catalogue) | §6.3, §13.2 | §13.4.1 |
| Stratification géo-ancestrale (secteur × ascendance) | §6.7 | §3, §4 stratégie 6 |
| Quotas WGS par cellule | §6.8 | §7.8.1 (sensibilité ratio) |
| Formule `S_div = 0,30 PCA + 0,30 ADMIX + 0,25 IBD + 0,15 ROH` | §7.1 | §5 intro |
| PCA ancrée sur pools témoins | §7.2, §6.4 | §13.4.1 (pools), §5.2 (PCA enveloppe convexe) |
| ADMIXTURE K = 2 à 10 | §7.3 | §13.2 (élargi v0.8) |
| ADMIX_rarity (bras découverte) | §7.4 | §5.2 (divergence KL) + §7.8.2 |
| **KING kinship, seuil 0,0625** | §7.5 | §5.2 (précisé v0.8) |
| ROH seuil 100 Mb (recalibrable) | §7.6 | §5.2, §13.4.7 (mentionné v0.8) |
| Score `S_discovery_global` (bras découverte) | §8.2 | §4 stratégie 7, §7.8 |
| Sous-bras du bras découverte | §8.3 | §7.8 (sensibilité ratio) |
| **Stratification quintiles + récupération quotas** | §9.1, §9.4 | §7.8 (récupération précisée v0.8) |
| **Gain marginal / novelty `λ`** | §9.2 | §4 stratégie 8 (ajouté v0.8) |
| QC SNP (variant, individu) | §11 | §13.4.4 |
| **HWE par strate (effet Wahlund)** | §11.4 | §13.4.7 (ajouté v0.8) |
| Phasage 2500 + familles (SHAPEIT4/5) | §12 | §13.4.6 |
| Imputation Beagle/GLIMPSE | §12.5 | §13.2 |
| LAI (Local Ancestry Inference) | §12.6 | §13.4 (haplotypes émergents) |
| **Validation A : 1000G public** | §13.2 | **§8.2 (opérationnalisée v0.9)** |
| **Validation B : 1000G + EGA** | §13.2 | **§8.3 (opérationnalisée v0.9)** |
| **Validation C : EGA complémentaires** | §13.2 | **§8.4 (opérationnalisée v0.9)** |
| **Validation D : Simulation réunionnaise** | §13.2 | §3 profils A–D + §7 |
| **Critère triangulé pré-déploiement** | (esprit §13.2) | **§8.5 (nouveau v0.9)** |
| **Chronologie pré-déploiement vs ex-post** | §13.7 | **§8.7 (nouveau v0.9)** |
| **Audit ex-post 350 WGS (sanity-check)** | §13.7 | **§14 garde-fou n°4 (reformulé v0.9)** |
| Scénarios de compression | §13.3 | §7.4 ancrage coût-bénéfice |
| **10 stratégies de comparaison** | §13.4 | §4 (aligné v0.8 : 10 stratégies + opportuniste) |
| Métriques de validation | §13.5 | §5.1, §5.2, §5.3 (alignées v0.8) |
| **Validation puce → WGS** | §13.6 | §7.9 (ajoutée v0.8) |
| Sensibilité poids ±10 % / ±20 % | §14.1 | §5.3 (précisé v0.8) |
| **Analyse LOCO** | §14.2 | §5.3 (ajoutée v0.8) |
| Robustesse greedy (multi-ordre, multi-seed) | §14.3 | §5.3 |
| Sorties attendues (livrables) | §15 | §15 |
| Risques et mitigations | §16 | §14 garde-fous + §3 préambule |
| **Recalibrage de fréquences** | §3.4 | §5.1 (ajouté v0.8) |
| Effet fondateur ROH | §8.4 | §3.D F1–F5, §7.7 |
| Profils d'ascendance — interprétation prudente | §6.6, §13 | §14 garde-fous éthiques |

Toute exigence V3.5 non couverte par cette table doit être considérée comme une lacune à corriger.
