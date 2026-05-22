# Méthodologie de validation à voilure réduite — Génome Réunion

## Version v1.1 corrigée pour gel méthodologique

**Version :** v1.1
**Statut :** protocole de validation resserré, corrigé pour gel méthodologique de la sélection WGS
**Document de référence amont :** `METHODOLOGY_selection_V3_5.md` (méthode de sélection)
**Document dont il dérive :** `METHODOLOGIE_validation_4_profils_population_INSEE.md` (protocole dense, profils A–D)
**Objet :** valider la pertinence de la sélection WGS géo-ancestrale **avant déploiement**, avec une surface d'analyse minimale, un risque statistique maîtrisé et la rigueur concentrée là où elle décide.

---

## 0. Pourquoi une version à voilure réduite

Le protocole dense croise ~11 stratégies × 4 profils × ≥100 seeds × ~24 variantes de sensibilité × 3 validations externes × 15+ livrables. Cette surface est à la fois ingérable opérationnellement et statistiquement risquée : avec autant de cellules (métrique × profil × stratégie × scénario), des « succès » apparaîtront par hasard (comparaisons multiples non corrigées, *garden of forking paths*).

Cette version applique cinq décisions de réduction, sans renoncer à ce qui fait la valeur scientifique du protocole dense :

1. **Un seul endpoint primaire décisif** (imputation aval), co-primaire la capture binaire des fondateurs — au lieu de ~12 métriques juges.
2. **3 à 4 stratégies** au chemin de décision — au lieu de 11.
3. **3 profils décisifs** (A, C, D), le profil D étant *élargi* en distribution de structures cryptiques ; B passe en exploratoire.
4. **Seeds en deux étages** (criblage 25 → confirmation 100) — au lieu de 100 partout.
5. **Sensibilité non croisée** : un seul couple (profil C × stratégie candidate).

Tout ce qui n'appartient pas au noyau décisif ne participe **pas** au verdict : il forme un *anneau exploratoire* facultatif, utile à la discussion mais hors du chemin de gel.

### Distinction de périmètre assumée

Cette validation **ne cherche pas** à reconstituer la structure démographique réelle de La Réunion. Elle teste la robustesse de la méthode à travers plusieurs régimes possibles de structure populationnelle. Les profils ne sont pas des portraits de l'île : ce sont des mondes possibles.

La représentativité de la cohorte réelle des 2500 donneurs EFS n'est **pas un endpoint de validation in silico**, car elle ne peut pas être résolue par simulation. En revanche, elle constitue une **condition de déploiement séparée mais obligatoire** : avant application finale de la sélection WGS, un audit EFS devra documenter la distribution par commune/secteur, âge, sexe, accessibilité territoriale et écarts majeurs aux proxys INSEE disponibles. La sélection WGS ne devra donc pas être présentée comme directement représentative de la population réunionnaise générale, mais comme une sélection optimisée dans une cohorte EFS auditée et, si nécessaire, recalibrée.

### Limite résiduelle reconnue d'emblée

Les mondes simulés A, C (et B) sont engendrés dans le langage `secteur × composante × période` — exactement les coordonnées que la méthode géo-ancestrale exploite. Une méthode géo-ancestrale est donc quasi assurée de bien faire dans ces mondes. **Le profil D est le seul qui injecte un signal hors des coordonnées fournies au score `S_div`** (isolat cryptique non annoté). C'est pourquoi cette version *renforce* D plutôt que de le réduire : il porte l'essentiel de la valeur probante interne.

**Conséquence assumée du poids probant.** Le seul test sur **données réelles** (EPIGEN-Brasil, §10) est délibérément non décisif : le Brésil n'est pas La Réunion, il ne peut donc servir que de test de transférabilité, pas de juge. Le verdict décisif repose par conséquent sur la **simulation** (Porte 1 sur A/C/D), la donnée réelle ne venant qu'en appui (Porte 3). C'est une limite structurelle revendiquée : la preuve décisive est in silico, la donnée réelle est confirmatoire. Le profil D élargi est précisément ce qui empêche cette preuve simulée de se réduire à une tautologie géo-ancestrale.

---

## 1. Principe et questions

La validation répond à trois questions, et trois seulement, au niveau décisif :

1. **Le panel local améliore-t-il réellement l'imputation** des variants rares et fondateurs par rapport à un référentiel externe seul et à un tirage aléatoire ? (endpoint primaire)
2. **La complexité géo-ancestrale se justifie-t-elle** face à l'alternative bien moins coûteuse de la stratification géographique stricte ?
3. **La méthode reste-t-elle pertinente face à une structure qu'elle ne sait pas lire a priori** (isolat cryptique) ?

Le scénario central pour La Réunion est défini comme **mixte-hétérogène** : population globalement admixée, structurée par des gradients géographiques, des sous-profils locaux, des effets fondateurs et des différences haplotypiques.

---

## 2. Contraintes structurelles (rappel)

**N = 2500 est une contrainte budgétaire dure**, alignée sur la cohorte SNP réelle. On sélectionne **350 WGS**. Conséquences conservées du protocole dense :

- **Sous-puissance assumée de `random` pour les fondateurs** : c'est l'argument central de la méthode, pas un défaut. Reporting en **distribution de capture** sur les seeds, pas en moyenne seule.
- **Apparentement comme paramètre de simulation** (`φ`, `G_endo`) : modélise l'inflation naturelle des fréquences fondatrices en petite population insulaire.
- **Maille géographique constante à 8 secteurs** sur tous les profils, condition de comparabilité : Nord urbain, Nord-Est/Est agricole, Saint-Leu/Hauts Ouest, Sud agricole, Hauts du Sud/Plaine, Sud-Est périphérique, Cirques/Hauts isolés, Ouest littoral.

| Paramètre | Notation | Plage |
|---|---|---|
| Coefficient d'apparentement intra sous-profil | `φ` | 0,03 (C) — 0,08 (D) |
| Profondeur d'endogamie simulée | `G_endo` | 4–5 (C) — 5–6 (D) |

Valeurs scénarisées, à calibrer dès que les SNP réels et pedigrees CGB seront disponibles.

---

## 3. Profils de population

### 3.1 Noyau décisif : A, C, D

#### Profil A — Homogène (contrôle négatif)

Tous les secteurs présentent une admixture proche. Sert à vérifier que la méthode **ne crée pas** de gain artificiel quand la population est peu structurée.

| Secteur | Eur | Afr | Malg | Ind | ChinEA | OcéanInd |
|---|---:|---:|---:|---:|---:|---:|
| Nord urbain | 20 | 15 | 18 | 30 | 8 | 9 |
| Nord-Est / Est agricole | 18 | 16 | 20 | 30 | 7 | 9 |
| Saint-Leu / Hauts Ouest | 19 | 15 | 18 | 30 | 8 | 10 |
| Sud agricole | 19 | 14 | 18 | 31 | 8 | 10 |
| Hauts du Sud / Plaine | 22 | 14 | 18 | 28 | 7 | 11 |
| Sud-Est périphérique | 18 | 17 | 20 | 29 | 6 | 10 |
| Cirques / Hauts isolés | 20 | 15 | 19 | 30 | 7 | 9 |
| Ouest littoral | 21 | 15 | 17 | 29 | 9 | 9 |

**Résultat attendu :** `random ≈ géographique strict ≈ géo-ancestral`. Un gain élevé signalerait un biais de métrique ou une simulation mal contrôlée.

#### Profil C — Mixte-hétérogène réunionnais plausible (scénario principal)

La population est très métissée à l'échelle de l'île, mais certains secteurs portent des signatures particulières (zones agricoles, Hauts, cirques, foyers fondateurs, mobilité récente).

| Secteur | Eur | Afr | Malg | Ind | ChinEA | OcéanInd |
|---|---:|---:|---:|---:|---:|---:|
| Nord urbain | 25 | 10 | 10 | 22 | 20 | 13 |
| Nord-Est / Est agricole | 12 | 20 | 28 | 30 | 4 | 6 |
| Saint-Leu / Hauts Ouest | 28 | 8 | 12 | 42 | 3 | 7 |
| Sud agricole | 18 | 10 | 10 | 50 | 4 | 8 |
| Hauts du Sud / Plaine | 45 | 8 | 10 | 25 | 2 | 10 |
| Sud-Est périphérique | 12 | 18 | 25 | 35 | 3 | 7 |
| Cirques / Hauts isolés | 35 | 14 | 25 | 16 | 1 | 9 |
| Ouest littoral | 22 | 13 | 15 | 32 | 8 | 10 |

Sous-profils internes forts, hétérogénéité haplotypique forte, variants fondateurs localisés probables (`φ ≈ 0,03`, `G_endo = 4–5` dans les foyers).

**Résultat attendu :** `random < géographique strict < géo-ancestral < géo-ancestral + bras découverte`. Écart modéré à net, jamais caricatural.

#### Profil D — Stress-test d'isolat cryptique artificiel (élargi)

Secteurs très contrastés **et** isolat local généré par le simulateur, **non transmis au score `S_div`**. C'est le seul test réellement adverse.

| Secteur | Eur | Afr | Malg | Ind | ChinEA | OcéanInd |
|---|---:|---:|---:|---:|---:|---:|
| Nord urbain | 30 | 8 | 8 | 20 | 25 | 9 |
| Nord-Est / Est agricole | 7 | 20 | 29 | 38 | 2 | 4 |
| Saint-Leu / Hauts Ouest | 32 | 6 | 10 | 45 | 1 | 6 |
| Sud agricole | 12 | 6 | 8 | 66 | 2 | 6 |
| Hauts du Sud / Plaine | 60 | 5 | 8 | 18 | 1 | 8 |
| Sud-Est périphérique | 10 | 15 | 22 | 42 | 2 | 9 |
| Cirques / Hauts isolés | 45 | 18 | 25 | 6 | 0 | 6 |
| Ouest littoral | 28 | 12 | 12 | 28 | 12 | 8 |

**Élargissement clé (réponse à la critique de circularité simulateur ↔ méthode).** Au lieu d'un isolat unique peint à la main, le profil D devient une **distribution de structures cryptiques randomisées sur les seeds**. À chaque seed, le simulateur tire :

```text
secteur_injection      ~ Uniforme(8 secteurs)            # pas fixé d'avance
Ne_bottleneck          ~ Uniforme[20, 50]
G_endo                 ~ Uniforme{5, 6}
φ                      ~ Uniforme[0,06 ; 0,10]
intensité_dérive       ~ Uniforme[modérée, forte]
nb_variants_fondateurs ~ Uniforme{1..5}
mobilité_sortante      = faible ;  mobilité_entrante = faible à modérée
```

Trois niveaux d'information sont strictement séparés :

| Niveau | Information disponible | Statut |
|---|---|---|
| Simulateur | secteur d'injection, profondeur, dérive, variants/haplotypes | vérité-terrain |
| Validateur | variants injectés + labels cachés, **uniquement pour calculer les métriques finales** | évaluation extrinsèque |
| Algorithme `S_div` | SNP observables, PCA, ADMIXTURE, IBD, ROH, haplotypes dérivés | **aveugle au label d'isolat** |

**Critère de réussite :** non pas que l'algorithme « connaisse » l'isolat, mais qu'il enrichisse la sélection en porteurs de ses signaux génomiques **sans annotation explicite**, et ce **sur la distribution des secteurs d'injection**, pas sur un cas favorable unique.

**Résultat attendu :** `opportuniste urbain << random < géographique strict < géo-ancestral < géo-ancestral + bras découverte`.

### 3.2 Anneau exploratoire (hors décision) : profil B

Le profil B (« mixte avec sous-structure cachée », moyennes sectorielles proches mais sous-profils localisés) est largement un profil C atténué. Il est conservé **uniquement en exploration** (seeds réduits, stratégie candidate seule) et ne participe pas au verdict de gel. Sa table d'admixture est celle du protocole dense (inchangée).

---

## 4. Stratégies de sélection

### 4.1 Noyau décisif (4 stratégies)

| # | Stratégie | Rôle décisif |
|---:|---|---|
| 1 | **Random** | plancher de référence |
| 5 | **Géographique strict + `S_div_sector`** | l'alternative bien moins coûteuse à battre (justifie ou non la complexité) |
| 7 | **Géo-ancestral + bras découverte** | stratégie candidate (ratio noyau/pool libre par sensibilité, cf. §7) |
| 10 | **Maximin PCA / ADMIX / IBD** | benchmark informationnel supérieur, non nécessairement déployable |

Ces quatre stratégies suffisent à trancher les trois questions du §1. Le contraste 5 vs 7 répond directement à « la complexité géo-ancestrale paie-t-elle ? ».

La stratégie 10 sert uniquement de **plafond informationnel génétique pur** : elle indique ce qu'un algorithme pourrait capter en relâchant les contraintes de représentativité géographique. Elle ne constitue pas automatiquement une stratégie déployable. Si elle gagne mais viole fortement la représentativité territoriale ou augmente la redondance IBD/ROH, elle reste un benchmark et non une recommandation opérationnelle.

### 4.2 Anneau exploratoire (hors décision)

PCA-only, maximin IBD seul, `S_div` naïf, `S_div` + novelty `λ`, ADMIXTURE + greedy global, opportuniste urbain. Exécutés **sur le profil C seulement, à seeds réduits**. Ils éclairent la discussion (d'où vient le gain ?) mais ne décident rien.

---

## 5. Métriques

### 5.1 Endpoint primaire décisif — imputation aval

**`R²` d'imputation sur held-out, agrégé par classe de MAF, classe `rare (<1 %) + fondateurs (F1–F5)`.** C'est une tâche prédictive réelle, falsifiable, et la moins circulaire du dispositif (corrélation entre dosage imputé et génotype vrai masqué).

- Held-out = individus de la cohorte **non sélectionnés** dans les 350 (les ~2150 restants), génome complet connu en simulation.
- Trois panels de référence comparés : **local seul** (350 WGS), **externe seul** (pools 1000G/EGA), **combiné**.
- Thèse centrale, testable et réfutable : *le panel local (ou combiné) bat l'externe seul sur les rares et fondateurs.*
- Logiciel figé : Beagle 5.4 ou GLIMPSE2, carte génétique HapMap GRCh38, conteneurs versionnés. Panel phasé via les 100 familles nucléaires.

### 5.2 Co-primaire — capture binaire des fondateurs

**`P(≥1 allèle F_k capté)`** sur ≥ 100 seeds. Répond à la bimodalité de `random` sous N=2500 : un panel qui capte un fondateur dans 50 % des runs n'est pas exploitable cliniquement, même si la moyenne d'allèles paraît honorable.

### 5.3 Métriques de support (reportées, non décisives)

Conservées du protocole dense mais **rétrogradées** : couverture allélique totale, MAF 1–5 %, couverture géo-ancestrale, couverture haplotypique, IBD résiduel intra pool libre, précision du recalibrage de fréquences. Elles documentent le *comment*, pas le verdict.

### 5.4 Diagnostiques (sanity-check) et tolérance

Témoins, jamais juges. Pour réduire l'alignement trivial objectif↔métrique, la **forme mathématique diffère** de `S_div` :

| Dimension | Forme à l'évaluation |
|---|---|
| PCA | volume de l'enveloppe convexe (PC1–PC4) |
| ADMIXTURE | divergence KL `q_k(sélection)` vs `q_k(cohorte)` |
| IBD | distribution des longueurs ≥ 5 cM (KS) ; **KING kinship**, seuil 0,0625 |
| ROH | distribution des longueurs (KS) + Gini |

**Tolérance :** une diagnostique ne doit pas se dégrader de plus de `−5 %` vs `random`. La divergence PCA/ADMIXTURE du **bras découverte** n'est pas éliminatoire (c'est son mécanisme), mais sa redondance IBD interne l'est.

### 5.5 Hiérarchie de jugement

1. Gagner sur l'endpoint primaire §5.1 (+ co-primaire §5.2) — **décisif**.
2. Comportement raisonnable sur les diagnostiques §5.4 — témoin.
3. Stabilité algorithmique §8 — contrôle.

Les §5.1 sont les juges, les §5.4 les témoins, le §8 les contrôles. Cette hiérarchie n'est jamais inversée.

---

## 6. Seuils pré-enregistrés

Les seuils sont **figés avant la première simulation** dans `validation_thresholds.tsv`, déposé avec horodatage externe (OSF/Zenodo ou tag Git signé). Tout amendement postérieur exige un défaut technique documenté ou une courbe de saturation `random` rendant le seuil manifestement inadapté — versionné avec justification.

### 6.1 Gain relatif

Pour l'endpoint primaire `M` et chaque profil `P`, agrégé sur ≥ 100 seeds :

```text
Δ_M,P = ( M(stratégie testée) − M(random) ) / M(random)   [%]
```

On exige que l'**IC 95 % bootstrap** du Δ ne croise pas le seuil dans le mauvais sens.

### 6.2 Table de seuils (valeurs de travail à figer)

| Endpoint | δ_A_max | δ_C_min | δ_D_min | Unité |
|---|---:|---:|---:|---|
| Imputation `R²` rare+fondateur (ΔR² moyen) | ≤ 0,01 | ≥ 0,03 | ≥ 0,05 | différence absolue de R² |
| Capture fondateurs `P(≥1 allèle)` | `\|P_méthode − P_random\| ≤ 0,10` | `P_random ≤ 0,55` ET `P_méthode ≥ 0,85` | `P_random ≤ 0,50` ET `P_méthode ≥ 0,90` | probabilité sur ≥ 100 seeds |

### 6.3 Analyse de puissance *a priori*

Avant de figer §6.2, vérifier le MDE théorique pour chaque couple (endpoint × profil) :

- **Fondateurs** : capture binomiale `B(2·n_sub_sel, f_k_eff)`, `f_k_eff` après inflation par `φ` ; `P_random` analytique, `P_méthode` par simulation ciblée.
- **Imputation** : bootstrap léger sur cohorte stub (N=2500) pour estimer la SD du Δ ; `MDE = 2 × SD / √100`.

Si `MDE > δ`, décision documentée : ajuster le seuil (justifié), ajuster le design (`φ`, `G_endo`, dans la limite N=2500), ou déclarer le couple **non-évaluable** comme limitation explicite. Livrable `power_analysis_pre_simulation.tsv`, soumis à la clause de pré-enregistrement.

---

## 7. Bras découverte — ratio par sensibilité (couple unique)

Le protocole principal pré-spécifie un ratio conservateur :

```text
ratio principal = 90 / 10
noyau géo-ancestral = 315 WGS
bras découverte = 35 WGS
```

> **Écart assumé vs `METHODOLOGY_selection_V3_5.md` §3.2.** Le document maître pose `N_discovery = 28` (ratio 92/8) comme valeur de travail par défaut. La présente validation retient 90/10 (35) pour donner au bras découverte une marge suffisante à *tester* sa propre utilité sans le sous-dimensionner d'emblée. Si la sensibilité ci-dessous ne montre aucun gain au-delà de 28, le ratio sera réaligné sur V3.5 lors du gel.

Deux ratios alternatifs sont évalués uniquement en **sensibilité sur le profil C** :

| Ratio noyau / pool libre | Statut | Effectifs |
|---|---|---|
| 90 / 10 | ratio principal pré-spécifié | 315 / 35 |
| 80 / 20 | sensibilité | 280 / 70 |
| 70 / 30 | sensibilité | 245 / 105 |

Le ratio principal reste retenu par défaut. Un ratio alternatif ne peut le remplacer que si :

```text
gain endpoint primaire alternatif ≥ gain ratio 90/10 + seuil pré-enregistré
ET
IBD_résiduel(pool libre seul) ≤ 1,5 × IBD_résiduel(sélection complète)
ET
absence de dégradation diagnostique > −5 %
```

Aucune contrainte de fidélité à la cohorte n'est imposée au bras découverte : sa divergence est attendue et acceptée. En revanche, sa redondance IBD interne, sa concentration excessive sur un foyer unique ou l'absence de gain primaire restent éliminatoires. Livrable `discovery_arm_sensitivity.tsv`.

---

## 8. Sensibilité algorithmique — non croisée

Toutes les analyses de robustesse sont exécutées **sur le seul couple (profil C × stratégie 7 candidate)**. C'est là, et seulement là, que la stabilité de la candidate compte pour le gel.

| Analyse | Procédure |
|---|---|
| Poids `S_div` | `w1…w4 ± 10 %` puis `± 20 %` ; relance et comparaison |
| **LOCO** | `S_full`, `S_−PCA`, `S_−ADMIX`, `S_−IBD`, `S_−ROH` : chaque composante est-elle indispensable ? |
| Ordre greedy | ≥ 100 permutations ; invariance ? |
| Tie-breakers | résolution stable des égalités ? |
| Bruit panel témoin | `clean` / `missingness 1–3 %` / `reduced_overlap` / `ambiguous_removed` / `batch_shift_PCA` |

Reporting : intersection moyenne des panels, individus stables, individus frontière, variance des métriques, recommandation consensus. Interprétation poids : variance faible → robuste ; modérée → conserver mais justifier ; forte → calibration critique avant déploiement.

---

## 9. Audit puce SNP → WGS

La sélection réelle part de la **puce SNP 1,9 M**, pas du WGS. Test conservé intégralement (monde du déploiement) :

1. Cohortes A/C/D avec WGS complet simulé.
2. Restreindre aux SNP de la puce 1,9 M ; QC + LD pruning (PLINK 2).
3. Calculer `S_div_geoancestry` et `S_discovery_global` **sur la version puce**.
4. Sélectionner 350 selon les stratégies §4.1.
5. Mesurer l'endpoint primaire §5.1 sur les individus sélectionnés.

**Critère :** `|primaire(sélection_puce) − primaire(sélection_WGS_complet)| ≤ 5 %` sur le profil C. Au-delà : limitation explicite. Livrable `chip_to_wgs_audit.tsv`.

---

## 10. Validation externe — un test principal de transférabilité, deux témoins

Triangulation conservée mais ré-équilibrée : la donnée réelle la plus pertinente devient le juge.

| Source | Données | Rôle | Critère |
|---|---|---|---|
| **EPIGEN-Brasil** (publié, 6487 ind.) | cohorte admixée continue, multi-vagues, insulaire-like | **test externe principal de transférabilité** | géo-ancestral + découverte **gagne** sur l'endpoint primaire (≥ 75 % des couples) |
| 1000G public | ACB/ASW, GIH/BEB, CEU/IBS/TSI, CHB/CHS/JPT/KHV | sanity-check | non-régression vs `random` |
| EGA prioritaires | MGUA Malagasy, MAGE, GenomeAsia, Angola/Mozambique | sanity-check (selon accès) | non-régression vs `random` |

**Justification du ré-équilibrage :** dans 1000G, les populations sont discrètes et bien séparées — la cellule `population × cluster ADMIXTURE` y est quasi triviale, ce qui avantage artificiellement la méthode. EPIGEN-Brasil teste un cas dur d'admixture continue intra-population. Il ne valide pas directement La Réunion, mais sert de test externe principal de transférabilité du score dans une population admixée réelle. Pour 1000G/EGA, l'analogue de secteur reste `population/pool d'origine × cluster ADMIXTURE`.

---

## 11. Règle de décision hiérarchique à portes

Le verdict suit un **gatekeeping** strict : on n'examine une porte que si la précédente est franchie. Cela maîtrise le risque statistique (un endpoint, un chemin) et évite le *forking*.

```text
PORTE 1 — Pertinence intrinsèque
   A : contrôle négatif respecté
       → pas de faux gain majeur ; |ΔR² rare+fondateur| ≤ δ_A_max.
   C : succès principal
       → géo-anc+découverte bat random sur l'endpoint primaire,
         IC95 au-dessus du seuil §6.2.
   D : stress-test cryptique
       → gain primaire attendu ou, au minimum, non-effondrement documenté
         sur la distribution des secteurs d'injection.
   NON sur A ou C → STOP. Méthode non validée.
   D faible seul → REVIEW, sauf si C est également fragile.
   OUI ↓

PORTE 2 — La complexité paie-t-elle ?
   géo-anc+découverte ≥ géographique strict (gain primaire ≥ +Δ pré-enregistré) ?
   NON → la couche géo-ancestrale ne se justifie pas → retenir géographique strict
   OUI ↓

PORTE 3 — Robustesse et transférabilité externe
   EPIGEN-Brasil soutient la transférabilité (§10)
   ET sensibilité (C × 7) stable (§8)
   ET profil D élargi tenu sur la distribution des secteurs d'injection (§3.1)
   ET audit puce→WGS ≤ 5 % (§9)
   ET audit EFS disponible ET sans biais majeur non corrigé avant déploiement final ?
   OUI → GEL de la sélection des 350 WGS
   NON → REVIEW documenté ; report ou déploiement sous engagement de re-validation
```

> **Précision sur l'audit EFS en Porte 3.** La condition n'est pas la seule *existence* de l'audit : un audit révélant un biais EFS majeur (sur/sous-représentation sectorielle, démographique ou d'accessibilité) non corrigé met la Porte 3 en `REVIEW`. L'audit documente *et* peut bloquer ; il ne se contente pas d'exister.

### Statuts par stratégie (en appui des portes)

| Statut | Condition |
|---|---|
| `PASS` | gain primaire significatif + diagnostiques dans la tolérance + stabilité acceptable |
| `REVIEW` | gain primaire significatif mais anomalie diagnostique modérée ou divergence attendue du bras découverte |
| `FAIL` | gain primaire insuffisant, ou obtenu au prix d'une dégradation diagnostique majeure non justifiée, ou instabilité forte |

---

## 12. Livrables (resserrés)

| Livrable | Contenu |
|---|---|
| `validation_thresholds.tsv` | seuils pré-enregistrés §6.2 + power analysis §6.3 |
| `primary_imputation_performance.tsv` | endpoint primaire : stratégie × profil (A/C/D) × panel (local/externe/combiné) × classe MAF × R² × IC95 |
| `founder_capture.tsv` | co-primaire : stratégie × profil × `P(≥1 allèle F_k)` sur seeds |
| `discovery_arm_sensitivity.tsv` | ratio noyau/pool libre × endpoint primaire (profil C) |
| `sensitivity_and_gates.tsv` | sensibilité (C×7) + audit puce→WGS + statut des 3 portes + décision globale |
| `efs_representativity_audit.tsv` | condition de déploiement : distribution EFS vs proxys INSEE, écarts et limites |

Six fichiers au lieu de 15+. Les sorties de l'anneau exploratoire (profil B, stratégies hors §4.1) sont produites séparément, marquées `exploratory`, et n'entrent dans aucune porte.

---

## 13. Effet sur la voilure

| | Protocole dense | v1.1 réduit (noyau) |
|---|---:|---:|
| Stratégies décisives | 11 | 4 |
| Profils décisifs | 4 | 3 (+ D élargi) |
| Métriques juges | ~12 | 1 (+ 1 co-primaire) |
| Seeds | 100 partout | 25 criblage → 100 ciblé |
| Sensibilité | croisée | 1 couple (C × 7) |
| Validations externes décisives | 3 (A,B,C pondérées) | 1 test principal de transférabilité (EPIGEN) + 2 témoins |
| Livrables `.tsv` | 15+ | 6 |
| Risque comparaisons multiples | non corrigé | un endpoint, chemin à portes |

Seeds en deux étages : criblage à ~25 seeds sur le noyau pour repérer le signal, puis 100 seeds **uniquement** sur les cellules décisives (primaire × {A,C,D} × {5,7}). Économie typique de 60–70 % des runs.

---

## 14. Ce qui est délibérément conservé

Malgré la réduction, restent intacts car ils portent la rigueur réelle :

- **Pré-enregistrement** des seuils + power analysis *a priori*.
- **Séparation des trois tiroirs** de métriques avec formes mathématiques distinctes à l'évaluation (anti-alignement objectif↔métrique).
- **Audit puce→WGS** (monde du déploiement).
- **LOCO** et sensibilité aux poids (sur le couple décisif).
- **Triangulation** simulation + donnée réelle externe + squelette historique — mais avec EPIGEN-Brasil en test de transférabilité.
- **Profil D renforcé** : distribution de structures cryptiques, seul rempart contre le couplage simulateur↔méthode.

L'audit ex-post après obtention des 350 WGS reste un sanity-check qui **ne valide pas** la méthode (déjà faite en pré-déploiement), il ferme la boucle.

---

## 15. Versioning

- **v1.0** — version initiale à voilure réduite. Dérive du protocole dense `METHODOLOGIE_validation_4_profils_population_INSEE.md` (profils A–D) et de `METHODOLOGY_selection_V3_5.md` (méthode). Applique : endpoint primaire unique (imputation rare+fondateur) + co-primaire (capture binaire fondateurs) ; 4 stratégies décisives ; 3 profils (A/C/D, D élargi en distribution cryptique) ; seeds à deux étages ; sensibilité non croisée (C×7) ; EPIGEN-Brasil promu test externe décisif ; règle de décision à 3 portes ; 5 livrables. Profil B et stratégies secondaires rétrogradés en anneau exploratoire hors décision.
- **v1.1** — corrections de gel méthodologique : biais EFS reclassé comme condition de déploiement obligatoire et non comme simple hors-périmètre ; EPIGEN-Brasil renommé test externe principal de transférabilité plutôt que juge décisif direct, avec conséquence sur le poids probant explicitée en §0 ; Porte 1 clarifiée entre contrôle négatif A, succès principal C et stress-test D ; stratégie maximin PCA/ADMIX/IBD clarifiée comme benchmark informationnel non nécessairement déployable ; ratio principal du bras découverte pré-spécifié à 90/10, avec écart vs V3.5 §3.2 documenté et 80/20 + 70/30 maintenus en sensibilité seulement ; audit EFS en Porte 3 précisé comme bloquant en cas de biais majeur ; livrable `efs_representativity_audit.tsv` ajouté.
