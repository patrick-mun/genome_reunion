# Méthodologie de sélection optimale — Génome Réunion

**Version : V3.3 géo-ancestrale — phasage SHAPEIT4**  
**Statut : document méthodologique scientifique — non destiné à une diffusion grand public**  
**Objet : sélection WGS, phasage réunionnais et construction d’un référentiel génomique local de première génération**  
**Projet : Génome Réunion**  
**Date : 2026-04-28**  
**Statut documentaire : document de travail scientifique révisé, destiné à structurer la méthodologie avant validation empirique**

---

## Message central

Ce document décrit une stratégie de première génération combinant :

```text
2500 individus SNP populationnels
350 WGS optimisés
100 familles nucléaires SNP hors cohorte
```

L’objectif est de construire un référentiel génomique réunionnais local, évolutif et auditable, en distinguant clairement :

- la découverte de variants ;
- le recalibrage des fréquences populationnelles ;
- le phasage réunionnais ;
- l’imputation ;
- la validation empirique de la sélection WGS ;
- la prise en compte explicite de l’**ascendance génétique inférée**, sans la confondre avec une identité ethnique ou sociale.

La V3.3 remplace la logique strictement géographique par une logique **géo-ancestrale** : les secteurs géographiques restent indispensables pour l’ancrage territorial, mais ils sont croisés avec des profils d’ascendance génétique inférée à partir de la PCA projetée sur des pools témoins et d’ADMIXTURE avec références.

---

## Résumé exécutif méthodologique

Le projet **Génome Réunion** vise à construire un référentiel génomique local adapté à la population réunionnaise, caractérisée par une combinaison rare d’**admixture récente**, de **structure insulaire** et d’**effets fondateurs locaux**. Sous contrainte budgétaire, le projet prévoit :

1. une cohorte populationnelle de **2500 individus génotypés sur puce SNP** ;
2. une sélection optimisée de **350 individus séquencés en WGS** parmi ces 2500 ;
3. un module familial complémentaire de **100 familles nucléaires génotypées sur puce SNP**, hors cohorte 2500, destiné à améliorer le phasage et la reconstruction haplotypique réunionnaise.

La puce SNP utilisée comporte environ **1,9 million de SNP bruts**. Après contrôle qualité, les marqueurs seront utilisés différemment selon les analyses :

- SNP prunés en LD pour PCA et ADMIXTURE ;
- SNP denses filtrés pour phasage, IBD et ROH ;
- SNP harmonisés avec le WGS pour l’imputation.

Le panel WGS n’est pas un tirage aléatoire simple. Il s’agit d’un **panel hybride de découverte, de référence et d’imputation**, composé :

- d’un **noyau géo-ancestral majoritaire**, garantissant à la fois l’ancrage territorial et la couverture des principaux profils d’ascendance génétique inférée ;
- d’un **bras de découverte contrôlé**, destiné à récupérer les profils génétiques sous-capturés par la stratification stricte : ascendance rare ou dominante, profils extrêmes, ROH/fondateurs et haplotypes utiles pour l’imputation.

Cette approche ne vise pas à attribuer une identité ethnique aux individus. Elle vise à intégrer une variable biologique pertinente pour la médecine génomique : l’ascendance génétique inférée, mesurée à partir de données SNP, de pools témoins, de PCA, d’ADMIXTURE et, si nécessaire, de LAI.

Le panel de **350 WGS** doit être interprété comme un **référentiel local de première génération**, non comme une ressource exhaustive et autosuffisante. Il est conçu pour être complémentaire des ressources internationales existantes, tout en apportant une couche locale indispensable pour améliorer l’imputation, la découverte de variants fréquents ou modérément rares, et la représentation des haplotypes réunionnais. Les variants ultra-rares et certains effets fondateurs très localisés nécessiteront des phases d’extension ultérieures.

Les fréquences observées dans les 350 WGS ne devront donc pas être interprétées naïvement comme des fréquences populationnelles définitives. Les fréquences finales seront recalibrées sur les **2500 individus SNP**, par pondération, stratification et imputation.

---

## Sommaire

### Partie I — Cadre scientifique et architecture du référentiel
1. Positionnement scientifique  
2. Architecture globale du projet  
3. Nature du panel WGS : découverte, imputation et fréquences  
4. Justification statistique de N = 350 WGS  

### Partie II — Ressources complémentaires et ancrage territorial
5. Module familial complémentaire : 100 familles nucléaires SNP  
6. Pools témoins, ascendance génétique inférée et stratification géo-ancestrale  

### Partie III — Méthode de sélection WGS
7. Score géo-ancestral `S_div`  
8. Score global du bras découverte  
9. Sélection stratifiée du noyau géo-ancestral  
10. Intégration du bras découverte  

### Partie IV — Données, contrôle qualité et analyses haplotypiques
11. Contrôle qualité SNP  
12. Phasage, imputation et LAI  

### Partie V — Validation, sensibilité et audit
13. Validation préalable  
14. Analyses de sensibilité  

### Partie VI — Mise en œuvre opérationnelle
15. Sorties attendues  
16. Risques et mitigations  
17. Timeline opérationnelle révisée  
18. Points à valider avant gel de la sélection  

### Partie VII — Annexes, références et versioning
19. Annexe A — Commandes indicatives PLINK / ADMIXTURE / SHAPEIT4  
20. Annexe B — Statut analytique des familles nucléaires  
21. Références à maintenir et compléter  
22. Versioning  
23. Conclusion méthodologique  

---

## Partie I — Cadre scientifique et architecture du référentiel

## 1. Positionnement scientifique

### 1.1 Objectif général

Le projet vise à produire un référentiel génomique réunionnais de première génération pour améliorer :

- l’interprétation des variants ;
- l’imputation dans une population admixée ;
- la pharmacogénétique locale ;
- les analyses IBD/ROH et d’effet fondateur ;
- le phasage et la reconstruction haplotypique ;
- les analyses d’ascendance globale et locale ;
- la robustesse future des approches d’aide à la décision ou d’IA biomédicale.

La méthode est conçue pour être **reproductible, auditable et améliorable**, et non pour prétendre atteindre une solution mathématiquement optimale au sens strict. Elle doit être comprise comme une **heuristique paramétrée**, validée empiriquement et adaptée à une première génération de référentiel sous contrainte budgétaire.

### 1.2 Pourquoi une sélection optimisée ?

La Réunion présente une triple difficulté méthodologique :

1. **Admixture complexe** : contributions africaines, malgaches, indiennes, européennes et asiatiques à des degrés variables selon les individus et les secteurs.
2. **Effet fondateur** : certains variants ou haplotypes peuvent être enrichis localement dans des sous-groupes ou des régions géographiques.
3. **Contrainte budgétaire** : le WGS ne peut pas être réalisé sur les 2500 individus populationnels dès la première phase.

Une sélection aléatoire des 350 WGS serait simple, mais risquerait de manquer des profils génétiques rares ou fondateurs. À l’inverse, une sélection uniquement basée sur les profils extrêmes maximiserait la diversité capturée, mais biaiserait fortement la représentativité. La méthode proposée cherche donc un compromis explicite :

> **représentativité géo-ancestrale dominante + enrichissement génétique contrôlé + recalibrage populationnel sur les 2500 SNP.**

La notion d’ascendance génétique inférée est utilisée ici dans un sens strictement biologique et analytique. Elle ne correspond pas à une assignation sociale, culturelle ou administrative. Elle vise à réduire les angles morts cliniques liés à l’interprétation de variants, à l’imputation, à la pharmacogénétique, au phasage et aux effets fondateurs dans une population admixée.

---

## 2. Architecture globale du projet

### 2.1 Trois ressources complémentaires

| Ressource | Taille | Statut | Rôle principal |
|---|---:|---|---|
| **Cohorte populationnelle SNP** | 2500 individus | Base populationnelle | Structure génétique, sélection WGS, recalibrage des fréquences |
| **Panel WGS optimisé** | 350 individus issus des 2500 | Panel hybride | Découverte de variants, panel d’imputation, référence locale |
| **Familles nucléaires SNP** | 100 familles hors cohorte 2500 | Ressource technique complémentaire | Phasage par transmission, haplotypes réunionnais, contrôle mendélien |

Les 100 familles nucléaires ne sont pas incluses dans les 2500 individus populationnels. Elles ne servent pas à augmenter artificiellement l’effectif indépendant de la cohorte. Elles constituent une ressource externe de phasage et de validation haplotypique.

### 2.2 Schéma général

```text
A. Cohorte populationnelle
   2500 individus génotypés sur puce SNP ~1,9 M SNP
       ↓
   QC + harmonisation avec pools témoins
       ↓
   PCA projetée sur références / ADMIXTURE avec références / IBD / ROH / phasage populationnel
       ↓
   construction de cellules géo-ancestrales : secteur × profil d’ascendance génétique inférée
       ↓
   sélection optimisée de 350 WGS
       ↓
   recalibrage des fréquences sur les 2500

B. Panel WGS optimisé
   350 individus sélectionnés parmi les 2500
       ↓
   découverte de variants
       ↓
   référence locale d’imputation
       ↓
   enrichissement du phasage et des haplotypes réunionnais

C. Module familial complémentaire
   100 familles nucléaires SNP hors cohorte 2500
       ↓
   transmission mendélienne
       ↓
   phasage familial
       ↓
   haplotypes réunionnais mieux adaptés
       ↓
   amélioration imputation / LAI / IBD / ROH / haplotypes fondateurs
```

---

## 3. Nature du panel WGS : découverte, imputation et fréquences

### 3.1 Panel hybride

Le panel WGS de 350 individus est un **panel hybride**. Il ne doit pas être décrit comme un simple échantillon aléatoire. Il combine :

- un noyau géo-ancestral majoritaire ;
- un bras de découverte contrôlé ;
- une stratégie de recalibrage sur la cohorte SNP complète.

La version stricte peut être conservée comme référence de comparaison, mais la version opérationnelle recommandée est une version hybride.

### 3.2 Architecture recommandée du panel WGS

| Composante du panel | Proportion recommandée | N approximatif | Objectif |
|---|---:|---:|---|
| **Noyau géo-ancestral strict** | 90–95 % | 315–332 | Ancrage territorial, couverture géo-ancestrale et stabilité démographique |
| **Bras de découverte contrôlé** | 5–10 % | 18–35 | Profils rares, fondateurs, extrêmes ou utiles à l’imputation |
| **Total** | 100 % | 350 | Panel hybride représentatif + informatif |

**Paramètre opérationnel par défaut proposé :**

```text
N_total_WGS      = 350
N_core           = 322  # ~92 %
N_discovery      = 28   # ~8 %
```

Ce réglage est une valeur de travail prudente. Le bras découverte devra être traité comme un **paramètre méthodologique à tester**, et non comme une proportion fixe. Les scénarios suivants seront comparés :

| Scénario | Noyau géographique | Bras découverte | N_discovery si 350 WGS | Interprétation |
|---|---:|---:|---:|---|
| Conservateur | 95 % | 5 % | 18 | Priorité maximale à l’ancrage géographique |
| Intermédiaire | 92 % | 8 % | 28 | Compromis opérationnel par défaut |
| Enrichi | 90 % | 10 % | 35 | Récupération plus forte des profils rares/fondateurs |
| Exploratoire | 85 % | 15 % | 52 | Test de sensibilité, non retenu d’emblée |

L’objectif de cette comparaison est de mesurer si l’augmentation du bras découverte améliore réellement la couverture allélique, la diversité haplotypique, les profils ROH/fondateurs et l’imputation, sans dégrader excessivement l’ancrage géographique du panel.

### 3.3 Ne pas confondre découverte et fréquence populationnelle

La formule de détection d’un variant dans 700 haplotypes est utile pour estimer un ordre de grandeur :

```text
P(détection) = 1 - (1 - MAF)^700
```

Cependant, cette formule suppose un variant réparti de manière suffisamment homogène et un échantillonnage proche de la représentativité. Le panel WGS étant stratifié et partiellement enrichi, cette probabilité doit être interprétée comme une approximation utile, non comme une garantie absolue pour tous les variants.

| Usage | Source principale | Interprétation |
|---|---|---|
| **Découverte de variants** | 350 WGS optimisés | Maximiser la probabilité de capter des variants informatifs |
| **Imputation** | 350 WGS + 2500 SNP + familles SNP | Projeter l’information WGS vers la cohorte complète |
| **Fréquences populationnelles finales** | 2500 SNP recalibrés | Fréquences pondérées/imputées, pas fréquences WGS brutes |

### 3.4 Recalibrage des fréquences

Les fréquences finales devront être rapportées sous plusieurs formes :

1. **Fréquence brute WGS** : fréquence observée dans les 350 WGS, utile comme signal de panel, mais enrichie.
2. **Fréquence pondérée** : fréquence corrigée selon les strates géographiques et, si nécessaire, les strates génétiques.
3. **Fréquence imputée** : fréquence estimée après imputation dans les 2500 SNP.
4. **Fréquence finale annotée** : fréquence retenue avec intervalle d’incertitude et statut de fiabilité.

Formulation de pondération simple :

```text
freq_pondérée(v) = Σ_s poids_s × freq_s(v)

avec :
poids_s = proportion de la strate s dans les 2500 SNP
freq_s(v) = fréquence du variant v dans les WGS/imputations de la strate s
```

La fréquence finale devra indiquer si le variant est :

- directement observé en WGS ;
- imputé avec forte confiance ;
- imputé avec confiance intermédiaire ;
- insuffisamment couvert pour estimation populationnelle.

---

## 4. Justification statistique de N = 350 WGS

### 4.1 Ordre de grandeur

350 WGS diploïdes correspondent à environ **700 haplotypes**. Pour un variant de fréquence allélique `f`, la probabilité de l’observer au moins une fois est :

```text
P(détection) = 1 - (1 - f)^700
```

| MAF | Copies attendues | Probabilité de détection | Interprétation |
|---:|---:|---:|---|
| 5 % | 35 | >99,9 % | Très robuste |
| 2 % | 14 | >99,9 % | Robuste |
| 1 % | 7 | >99,9 % | Limite opérationnelle acceptable |
| 0,5 % | 3,5 | ~97 % | Détection possible, fréquence instable |
| 0,1 % | 0,7 | ~50 % | Non fiable avec 350 WGS |

### 4.2 Seuil opérationnel

Le seuil opérationnel de première génération est fixé à :

```text
MAF interprétable avec prudence : ≥ 1 %
MAF détectable mais fréquence fragile : 0,5–1 %
MAF non fiable : < 0,5 %
```

Cette limite doit être explicitement assumée. Le projet ne vise pas à capturer exhaustivement tous les variants ultra-rares dès la première phase. Il vise à construire un référentiel exploitable, évolutif et localement mieux adapté que les référentiels externes.

Le panel de **350 WGS** doit donc être compris comme un **socle local initial**, complémentaire des ressources internationales existantes, et non comme une ressource autosuffisante. Sa valeur principale est de fournir une couche réunionnaise pour l’imputation, le phasage, la découverte de variants fréquents ou modérément rares, et l’identification de signaux fondateurs suffisamment représentés. Les variants ultra-rares, les haplotypes très localisés et certains effets fondateurs minoritaires devront faire l’objet de phases d’extension ou de validations ciblées.

---

## Partie II — Ressources complémentaires et ancrage territorial

## 5. Module familial complémentaire : 100 familles nucléaires SNP

### 5.1 Statut du module familial

Le projet prévoit le génotypage SNP d’environ **100 familles nucléaires supplémentaires**, non incluses dans les 2500 individus populationnels. Ces familles seront géographiquement diversifiées afin de couvrir les principaux secteurs de l’île.

Elles constituent une ressource technique pour améliorer le phasage, et non un échantillon populationnel indépendant pour estimer les fréquences.

### 5.2 Objectifs du module familial

Les familles nucléaires permettront de :

- valider les transmissions mendéliennes parent-enfant ;
- réduire les erreurs de phase ;
- produire des haplotypes mieux adaptés à la structure réunionnaise ;
- améliorer l’imputation des variants WGS dans les 2500 SNP ;
- soutenir les analyses de local ancestry inference ;
- mieux interpréter les segments IBD et ROH ;
- documenter certains haplotypes fondateurs ;
- détecter des erreurs de génotypage, d’orientation allélique ou de contamination ;
- identifier les apparentements inattendus nécessitant une gestion éthique spécifique.

### 5.3 Phasage combiné : 2500 SNP + familles nucléaires

Le phasage sera réalisé en combinant deux sources :

1. les **2500 individus SNP populationnels**, qui capturent la diversité haplotypique globale de La Réunion ;
2. les **100 familles nucléaires SNP**, qui apportent une information directe de transmission mendélienne.

Cette combinaison devrait produire un phasage mieux adapté à la structure haplotypique réunionnaise qu’un phasage reposant uniquement sur des panels externes.

```text
2500 SNP populationnels
        +
100 familles nucléaires SNP
        ↓
phasage populationnel assisté par transmission
        ↓
haplotypes réunionnais
        ↓
imputation / LAI / IBD / ROH / haplotypes fondateurs
```

### 5.4 Densité de la puce SNP

La puce utilisée comporte environ **1,9 million de SNP bruts**. Cette densité est favorable à la reconstruction haplotypique, mais tous les SNP ne seront pas utilisés de la même manière.

| Usage | Jeu de SNP recommandé |
|---|---|
| PCA | SNP filtrés + LD-pruned |
| ADMIXTURE | SNP filtrés + LD-pruned |
| Phasage | SNP denses harmonisés, après QC |
| IBD | SNP denses filtrés, attention au LD selon méthode |
| ROH | SNP denses filtrés, paramètres adaptés à la densité |
| Imputation | SNP harmonisés avec WGS et build commun |

Il ne faut donc pas écrire que 1,9 M SNP seront utilisés indistinctement pour toutes les analyses. La densité brute renforce surtout le phasage, l’IBD, les ROH et l’imputation.

### 5.5 Garde-fou analytique

Les individus des familles nucléaires :

- ne seront pas ajoutés aux 2500 pour estimer les fréquences populationnelles ;
- ne seront pas traités comme observations indépendantes ;
- seront utilisés comme ressource de phasage et de contrôle de transmission ;
- pourront être inclus dans des analyses familiales dédiées ;
- devront être annotés séparément dans les exports et les rapports.

### 5.6 Point éthique spécifique

Les familles nucléaires exposent à des informations sensibles : non-parenté biologique, apparentement inattendu, incohérences de filiation, erreurs d’échantillon ou situations familiales non anticipées.

Le consentement, le circuit de retour d’information et la gouvernance de ces informations devront être définis avant production des données. Le module familial doit donc être accompagné d’un protocole éthique spécifique, distinct du protocole de cohorte populationnelle.

---

## 6. Pools témoins, ascendance génétique inférée et stratification géo-ancestrale

### 6.1 Principe général

La stratification géographique seule ne suffit pas à représenter la diversité réunionnaise. La population de l’île n’est pas répartie de façon homogène selon les histoires de peuplement, les lignées familiales, les apports ancestraux, les effets fondateurs et les structures locales. Un secteur géographique peut contenir plusieurs profils d’ascendance génétique, et un même profil peut être présent dans plusieurs secteurs.

La V3.3 remplace donc la logique :

```text
secteur géographique → quota WGS → S_div intra-secteur
```

par une logique plus robuste :

```text
secteur géographique × profil d’ascendance génétique inférée
        → quota géo-ancestral
        → S_div intra-cellule ou intra-secteur selon effectif
```

Cette stratégie ne vise pas à assigner une identité ethnique aux individus. Elle vise à mesurer une information biologique utile pour la médecine génomique : **l’ascendance génétique inférée**. La négliger exposerait le référentiel à des angles morts cliniques, notamment pour l’interprétation des variants, la pharmacogénétique, l’imputation, la LAI et l’analyse des effets fondateurs.

### 6.2 Pourquoi des pools témoins sont nécessaires

Une PCA calculée uniquement sur les 2500 individus réunionnais permet de visualiser la structure génétique interne de la cohorte, mais elle ne suffit pas à interpréter biologiquement l’origine des axes. De même, une ADMIXTURE non supervisée peut identifier `K` composantes statistiques, mais ces composantes ne peuvent pas être nommées de manière fiable sans comparaison à des références.

Autrement dit :

```text
ADMIXTURE non supervisé sans références
        → composantes K statistiques
        → structure interne utile
        → origine biologique difficile à attribuer
```

Pour interpréter les composantes, il faut introduire des **pools témoins d’ascendance**. Ces pools ne servent pas à enfermer les individus dans des catégories sociales ; ils servent à ancrer les axes PCA et les composantes ADMIXTURE dans des références génétiques connues.

Pools témoins recommandés, sous réserve de disponibilité et de qualité :

| Dimension recherchée | Type de référence possible | Usage attendu |
|---|---|---|
| Afrique subsaharienne / Afrique de l’Est / Afrique australe | panels 1000G, HGDP, H3Africa si disponible | ancrage des composantes africaines |
| Europe | CEU/TSI/IBS/GBR ou équivalents | ancrage européen |
| Inde / Asie du Sud | GIH, ITU, PJL, BEB, STU ou équivalents | ancrage sud-asiatique, pertinent pour l’histoire réunionnaise |
| Madagascar / océan Indien | références malgaches ou indo-océaniques si disponibles | dimension critique mais possiblement sous-représentée |
| Asie de l’Est / Chine | CHB/CHS/JPT/KHV ou équivalents | ancrage est-asiatique |
| Sud-Est asiatique / Comores / autres apports régionaux | selon disponibilité | analyse exploratoire et prudente |

L’absence ou la faible qualité d’un pool témoin doit être explicitement documentée. Certaines dimensions, notamment malgaches ou indo-océaniques, peuvent être imparfaitement représentées dans les panels publics. Dans ce cas, les composantes correspondantes seront interprétées avec prudence.

### 6.3 PCA de référence et projection des individus réunionnais

La PCA sera utilisée selon deux niveaux complémentaires :

1. **PCA interne** sur les 2500 individus, pour analyser la structure propre de la cohorte réunionnaise.
2. **PCA ancrée sur références**, calculée avec des pools témoins harmonisés, puis projection des individus réunionnais dans cet espace.

Schéma recommandé :

```text
Pools témoins harmonisés
        +
2500 individus réunionnais SNP
        ↓
QC commun + LD pruning + harmonisation build/strand
        ↓
PCA de référence
        ↓
Projection des individus réunionnais
        ↓
positionnement relatif par rapport aux pôles d’ascendance
```

La PCA ne fournit pas une identité ethnique. Elle fournit une position dans un espace de variation génétique. L’interprétation en ascendance doit être croisée avec ADMIXTURE, la géographie, le phasage, la LAI, les ROH/IBD et les connaissances historiques.

### 6.4 ADMIXTURE : non supervisé, supervisé et interprétation de K

`K` dans ADMIXTURE correspond au nombre de composantes du modèle, pas directement à un nombre de groupes ethniques. Sans pools témoins, les composantes `q_k` sont difficiles à nommer, peuvent varier entre exécutions, et peuvent être influencées par la dérive, l’effet fondateur, la parenté, l’admixture récente ou le déséquilibre d’échantillonnage.

La stratégie recommandée est donc :

| Étape | Objectif | Interprétation |
|---|---|---|
| ADMIXTURE non supervisé sur 2500 | découvrir la structure interne réunionnaise | utile mais labels non garantis |
| ADMIXTURE avec pools témoins | ancrer les composantes sur références | attribution plus interprétable |
| ADMIXTURE supervisé ou semi-supervisé | estimer les proportions par rapport à références définies | utile pour les clusters géo-ancestraux |
| Analyse multi-K | tester la robustesse | éviter de figer artificiellement K |

Le choix de `K` devra combiner :

- l’erreur de cross-validation ;
- la stabilité entre seeds ;
- la cohérence avec la PCA projetée ;
- la cohérence avec les pools témoins ;
- l’interprétabilité historique et biologique ;
- la prudence sur les composantes mal représentées par les panels publics.

Pour La Réunion, un `K` pertinent pourrait refléter plusieurs dimensions ancestrales majeures, mais il ne doit pas être fixé a priori. Il doit être testé empiriquement et validé par cohérence avec les références.

### 6.5 Construction des profils d’ascendance génétique inférée

À partir de la PCA projetée et d’ADMIXTURE avec références, chaque individu sera décrit par un profil d’ascendance génétique inférée. Ce profil pourra inclure :

- coordonnées PCA projetées ;
- proportions `q_k` ADMIXTURE ;
- distance aux pôles de référence ;
- distance au centroïde du secteur ;
- entropie d’admixture ;
- rareté locale du profil ;
- appartenance à un cluster PCA/ADMIXTURE.

Un clustering des individus pourra être réalisé sur un espace combiné :

```text
[PC1..PCn projetées] + [q1..qK ADMIXTURE] + métriques de rareté
```

Les clusters obtenus ne seront pas interprétés comme des groupes sociaux. Ils seront utilisés comme **strates génétiques opérationnelles** pour éviter qu’un secteur soit représenté uniquement par son profil majoritaire.

### 6.6 Construction des cellules géo-ancestrales

La strate principale devient :

```text
cellule géo-ancestrale = secteur géographique × cluster d’ascendance génétique inférée
```

Exemple conceptuel :

| Secteur | Cluster d’ascendance inférée | N SNP | Statut |
|---|---|---:|---|
| Nord | cluster A | 120 | majoritaire local |
| Nord | cluster B | 35 | minoritaire informatif |
| Est | cluster A | 80 | partagé inter-secteurs |
| Sud | cluster C | 25 | rare / à surveiller |
| Ouest | cluster D | 15 | cellule rare, possible bras découverte |

Cette approche permet de préserver l’ancrage territorial tout en capturant la diversité génétique non homogène de l’île.

### 6.7 Attribution des quotas WGS

L’allocation WGS se fait en deux niveaux :

1. **Quota géographique de base**, proportionnel à la distribution de la cohorte EFS.
2. **Répartition interne par cellules géo-ancestrales**, proportionnelle à leur fréquence et ajustée pour protéger les cellules rares ou cliniquement informatives.

Formulation simplifiée :

```text
N_secteur_core = round(proportion_secteur × N_core)

N_cellule = round(N_secteur_core × proportion_cellule_dans_secteur)
```

Puis correction par règles de sauvegarde :

- garantir un minimum pour les cellules rares si elles sont suffisamment représentées dans la cohorte ;
- éviter qu’un secteur soit capturé uniquement par son profil majoritaire ;
- documenter toute cellule non représentée ;
- transférer certaines cellules rares vers le bras découverte si l’effectif est trop faible pour le noyau.

Cette approche produit un noyau WGS **géo-ancestral**, et non seulement géographique.

### 6.8 Biais potentiel de recrutement EFS

La cohorte EFS peut ne pas être parfaitement représentative de la population réunionnaise générale. Les donneurs peuvent différer selon l’âge, le sexe, l’état de santé, la proximité des centres de don, les critères d’éligibilité et les comportements de volontariat.

La représentativité devra donc être évaluée à trois niveaux :

1. **représentativité géographique interne** : distribution par secteur dans les 2500 ;
2. **représentativité géo-ancestrale interne** : distribution des cellules secteur × ascendance inférée ;
3. **comparaison externe** : comparaison avec les distributions démographiques disponibles pour La Réunion lorsque cela est possible.

Cette analyse ne vise pas à disqualifier la cohorte, mais à documenter précisément son périmètre d’interprétation.

### 6.9 Validation comparative de la contrainte géo-ancestrale

Trois stratégies seront comparées en priorité :

1. **Stratification géographique + S_div_geoancestry** : ancienne stratégie principale, utile comme référence.
2. **Stratification géo-ancestrale + S_div_geoancestry** : stratégie recommandée, fondée sur les cellules secteur × ascendance inférée.
3. **Sélection globale maximin PCA/ADMIX/IBD** : stratégie insulaire sans quotas géographiques stricts, visant à maximiser la distance minimale entre individus dans un espace combinant PCA, ADMIXTURE et parenté.

L’objectif n’est pas de remplacer la géographie, mais de vérifier que la stratégie géo-ancestrale apporte une meilleure couverture des profils génétiques réellement présents dans l’île, en particulier lorsque les ascendances ou les haplotypes fondateurs ne sont pas distribués homogènement entre secteurs.

---

## Partie III — Méthode de sélection WGS

## 7. Score géo-ancestral S_div

### 7.1 Principe général

Le score `S_div_geoancestry` est utilisé dans le noyau géo-ancestral. Il classe les individus **au sein de chaque cellule géo-ancestrale** lorsque l’effectif est suffisant, ou au sein du secteur avec correction par profil d’ascendance lorsque les cellules sont trop petites. Les valeurs absolues ne sont pas comparées directement entre cellules sans normalisation adaptée.

```text
S_div_geoancestry(i) = w1 × PCA_score_sector(i)
                + w2 × ADMIX_score_sector(i)
                + w3 × IBD_score_sector(i)
                + w4 × ROH_score_diversity(i)
```

Valeurs de travail pré-validation :

| Composante | Poids initial | Rôle |
|---|---:|---|
| PCA_score_sector | 0,30 | Position génétique intra-secteur |
| ADMIX_score_sector | 0,30 | Mélange ancestral intra-secteur |
| IBD_score_sector | 0,25 | Non-redondance locale |
| ROH_score_diversity | 0,15 | Limitation de l’autozygotie excessive |

Ces poids sont des valeurs de travail. Ils seront testés par analyse de sensibilité et analyse leave-one-component-out.

### 7.2 PCA_score_geoancestry

La PCA est calculée dans un espace commun, idéalement ancré sur des pools témoins harmonisés. Pour chaque cellule géo-ancestrale, ou à défaut pour chaque secteur, un centroïde est calculé dans cet espace. Chaque individu est scoré selon sa distance au centroïde pertinent.

```text
PCA_distance(i) = √Σ_k (PC_k(i) - centroïde_k_secteur)^2
PCA_score_sector(i) = normalisation_minmax_secteur(PCA_distance(i))
```

Cette approche évite les PCA par secteur, qui produiraient des axes non comparables, et permet de mesurer la marginalité génétique dans un espace ancré sur références.

### 7.3 ADMIX_score_geoancestry

ADMIXTURE sera analysé en deux temps : non supervisé pour explorer la structure interne, puis supervisé ou semi-supervisé avec pools témoins pour interpréter les composantes. K sera exploré dans une plage large, par exemple :

```text
K = 2 à 10 en phase exploratoire
```

Le choix final reposera sur :

- l’erreur de cross-validation ;
- la stabilité entre seeds ;
- l’interprétabilité biologique ;
- la cohérence avec PCA, géographie et histoire du peuplement.

Le score principal utilise l’entropie de Shannon :

```text
H(i) = - Σ_k q_k(i) × log(q_k(i))
ADMIX_score_geoancestry(i) = normalisation_minmax_cellule(H(i), rareté_locale, distance_q)
```

### 7.4 Limite de l’entropie et métrique complémentaire

L’entropie favorise les profils très mélangés, mais elle ne mesure pas directement la rareté. Un individu porteur d’une ascendance rare mais dominante peut avoir une entropie faible tout en étant très informatif.

Le bras de découverte utilisera donc une métrique complémentaire :

```text
ADMIX_rarity(i) = distance(q_i, centroïde_q_cellule_ou_secteur)
```

ou :

```text
ADMIX_informative(i) = α × entropie(q_i)
                     + β × distance(q_i, centroïde_q_cellule_ou_secteur)
                     + γ × rareté_locale(q_i)
```

Cette métrique ne modifie pas silencieusement le score géo-ancestral. Elle est utilisée dans le bras découverte et dans les analyses de sensibilité.

### 7.5 IBD_score_geoancestry et métrique de parenté

La présente version fixe explicitement la métrique principale recommandée.

**Métrique principale recommandée :** coefficient de parenté robuste de type KING, utilisé pour les apparentements en contexte structuré/admixté.

Pour éviter la confusion entre `PI_HAT` et `kinship`, on définit :

```text
kinship_KING(i,j) = coefficient de parenté robuste
relatedness_R(i,j) ≈ 2 × kinship_KING(i,j)
```

Le score individuel peut être formulé sur une échelle de relatedness :

```text
IBD_score_geoancestry(i) = 1 - max_j relatedness_R(i,j)
```

avec bornage à [0,1] si nécessaire.

**Seuil d’exclusion recommandé :**

```text
kinship_KING ≥ 0,0625
```

ce qui correspond approximativement à :

```text
relatedness_R ≥ 0,125
```

Ce seuil cible les apparentements proches de type cousin germain ou plus proches. Le seuil exact devra être validé empiriquement selon la distribution de parenté réunionnaise et selon l’outil retenu.

| Approximation | PI_HAT / relatedness R | Kinship KING approximatif |
|---|---:|---:|
| Parent-enfant / germains | ~0,50 | ~0,25 |
| 2e degré | ~0,25 | ~0,125 |
| Cousins germains | ~0,125 | ~0,0625 |
| Parenté plus lointaine | <0,125 | <0,0625 |

**Règle de reporting :** le rapport final devra toujours indiquer la métrique exacte, l’outil, la version logicielle et le seuil utilisé.

### 7.6 ROH_score_diversity

Dans le noyau principal, le score ROH vise à limiter l’excès d’autozygotie et à éviter de surreprésenter des profils très consanguins.

Version simple :

```text
ROH_score_diversity(i) = max(0, 1 - total_ROH_length(i) / 100 Mb)
```

Version empirique recommandée en sensibilité :

```text
ROH_score_diversity_emp(i) = 1 - rank_percentile(total_ROH_length(i), secteur)
```

Le seuil 100 Mb est une valeur de travail. Il devra être recalibré sur la distribution réelle des ROH dans la cohorte réunionnaise.

---

## 8. Score global du bras découverte

### 8.1 Pourquoi un score global distinct ?

Le score géo-ancestral `S_div_geoancestry` est normalisé localement. Ses valeurs absolues ne sont pas comparables entre secteurs. Le bras découverte ne doit donc pas utiliser directement les plus hauts `S_div_geoancestry` comme s’il s’agissait d’un score insulaire global.

Cette version introduit donc un score distinct :

```text
S_discovery_global
```

Ce score est calculé à l’échelle insulaire, avec des rangs ou percentiles comparables entre tous les individus.

### 8.2 Formulation proposée

```text
S_discovery_global(i) = a × PCA_global_outlier(i)
                      + b × ADMIX_rarity_global(i)
                      + c × IBD_independence_global(i)
                      + d × Haplotype_utility(i)
                      + e × Founder_ROH_score(i)
```

avec :

| Composante | Rôle |
|---|---|
| PCA_global_outlier | Profils éloignés dans l’espace PCA insulaire |
| ADMIX_rarity_global | Profils d’ascendance rares ou dominants localement |
| IBD_independence_global | Non-redondance avec le noyau déjà sélectionné |
| Haplotype_utility | Apport potentiel à l’imputation/phasage |
| Founder_ROH_score | Signature ROH/fondateur ciblée |

Chaque composante sera convertie en percentile global avant agrégation.

**Dépendance au phasage :** la composante `Haplotype_utility` ne doit être activée que si le phasage SNP populationnel et/ou familial est disponible avant le gel de la sélection WGS. Si le module familial n’est pas finalisé à ce moment, la pondération `d` sera fixée à 0 pour la sélection initiale, puis cette composante sera utilisée secondairement pour l’imputation, la LAI et l’audit haplotypique.

### 8.3 Sous-bras du bras découverte

Pour éviter qu’une seule logique domine les 5–10 %, le bras découverte sera stratifié en sous-bras.

Répartition opérationnelle proposée pour `N_discovery = 28` :

| Sous-bras | Proportion indicative | N si 28 | Critère principal |
|---|---:|---:|---|
| S_discovery_global élevé | 35 % | 10 | Score global extrême, IBD compatible |
| Ascendance rare/dominante | 25 % | 7 | ADMIX_rarity / distance q |
| ROH/fondateur | 25 % | 7 | ROH partagé, cluster local, haplotype fondateur |
| Utilité haplotypique/imputation | 15 % | 4 | couverture de segments, amélioration imputation |
| **Total** | 100 % | 28 | — |

Cette répartition est paramétrable et sera testée en validation. Comme les sous-bras peuvent devenir très petits lorsque `N_discovery` est limité, cette version impose de comparer plusieurs tailles de bras découverte (`5 %`, `8 %`, `10 %`, `15 %`) et d’évaluer la stabilité des individus sélectionnés dans chaque sous-bras. Si les sous-bras de petite taille sont instables, une stratégie plus parcimonieuse pourra être retenue : pré-classer les candidats par sous-bras, constituer un pool global de candidats prioritaires, puis sélectionner les meilleurs profils non redondants sous contrainte IBD.

### 8.4 ROH fondateur

Le bras ROH/fondateur ne doit pas seulement sélectionner les plus forts `total_ROH_length`. Il doit rechercher des profils biologiquement informatifs :

```text
Founder_ROH_score(i) = f(
    total_ROH_length,
    segments_ROH_partagés,
    fréquence du segment dans la cohorte,
    cluster géographique,
    cohérence haplotypique
)
```

Un ROH élevé isolé peut refléter une consanguinité récente individuelle. Un ROH partagé par plusieurs individus non proches, localisé géographiquement ou associé à un haplotype commun, est plus informatif pour l’effet fondateur.

---

## 9. Sélection stratifiée du noyau géo-ancestral

### 9.1 Stratification anti-biais directionnel

Dans chaque cellule géo-ancestrale, lorsque l’effectif est suffisant, la sélection ne doit pas se limiter aux scores les plus élevés. Le score `S_div_geoancestry` est donc stratifié. Lorsque les cellules sont trop petites, la sélection est réalisée au niveau du secteur en imposant des garde-fous pour les profils d’ascendance rares ou informatifs.

| N_core alloué à la cellule ou au secteur | Stratégie | Justification |
|---:|---|---|
| ≥20 | Quintiles | Cinq strates informatives |
| 6–19 | Binaire top/bottom 50 % | Maintien d’un ancrage représentatif |
| <6 | Greedy documenté | Effectif trop faible pour stratifier |

Allocation quintile proposée :

| Quintile | Profil | Allocation |
|---|---|---:|
| Q1 | Scores élevés / marginaux | 20 % |
| Q2 | Au-dessus médiane | 20 % |
| Q3 | Typiques / médiane | 30 % |
| Q4 | Sous médiane | 20 % |
| Q5 | Scores faibles / ordinaires | 10 % |

### 9.2 Sélection greedy avec gain marginal optionnel

La sélection individuelle pure peut sélectionner plusieurs individus proches dans l’espace PCA/ADMIX. Pour limiter cette redondance non capturée par l’IBD, cette version recommande d’ajouter un terme de nouveauté marginale, au moins en analyse de sensibilité.

Formule optionnelle :

```text
score_selection(i | S) = S_div_geoancestry(i)
                       + λ × novelty(i, S)
```

avec :

```text
novelty(i, S) = distance minimale entre i et les individus déjà sélectionnés S
                dans l’espace PCA/ADMIX/haplotype
```

Valeur de travail :

```text
λ = 0,10 à 0,20
```

Version minimale : `S_div_geoancestry` seul.  
Version renforcée : `S_div_geoancestry + gain marginal`.

Les deux versions devront être comparées.

### 9.3 Pseudo-code du noyau

```python
selected_core = []

for cellule in cellules_geoancestrales_tries_par_priorite:
    N_target = quota_core[cellule]
    individuals = get_individuals_by_geoancestry_cell(cellule)

    groups = build_strata(individuals, N_target)  # quintile, binaire ou greedy

    for group in groups:
        n_group_target = group.target
        selected_group = []

        candidates = sort_by_selection_score(
            group.candidates,
            selected_current=selected_core,
            use_marginal_novelty=True
        )

        for candidate in candidates:
            if len(selected_group) >= n_group_target:
                break

            if is_related_to_selected(candidate, selected_core, threshold="KING_0.0625"):
                continue

            selected_core.append(candidate)
            selected_group.append(candidate)

        if len(selected_group) < n_group_target:
            recover_quota(
                cellule=cellule,
                group=group,
                missing=n_group_target - len(selected_group),
                selected_core=selected_core
            )
```

### 9.4 Récupération des quotas

La récupération des quotas est intégrée à l’algorithme afin de garantir autant que possible l’effectif cible.

Ordre recommandé :

1. même strate, même secteur ;
2. strate voisine, même secteur ;
3. autre strate du même secteur ;
4. bras découverte insulaire ;
5. dérogation documentée.

Pseudo-code :

```python
def recover_quota(cellule, group, missing, selected_core):
    recovery_sources = [
        same_group_same_sector,
        adjacent_group_same_sector,
        any_group_same_sector,
        discovery_pool_global
    ]

    recovered = []

    for source in recovery_sources:
        candidates = get_recovery_candidates(source, cellule, group)
        candidates = sort_by_selection_score(candidates, selected_core)

        for candidate in candidates:
            if len(recovered) >= missing:
                return recovered

            if is_related_to_selected(candidate, selected_core, threshold="KING_0.0625"):
                continue

            selected_core.append(candidate)
            recovered.append(candidate)

    log_unfilled_quota(cellule, group, missing - len(recovered))
    return recovered
```

Toute récupération doit être tracée dans un rapport : cellule géo-ancestrale, secteur, cluster d’ascendance inférée, strate d’origine, strate de remplacement, justification, impact sur la représentativité.

---

## 10. Intégration du bras découverte

### 10.1 Sélection après le noyau

Le bras découverte est sélectionné après constitution du noyau géo-ancestral, afin de mesurer sa non-redondance avec les individus déjà retenus.

```python
selected_discovery = []

for subarm in discovery_subarms:
    candidates = get_candidates_for_subarm(subarm)
    candidates = remove_already_selected(candidates, selected_core)
    candidates = sort_by_subarm_score(candidates, subarm)

    for candidate in candidates:
        if len(selected_discovery_for_subarm) >= subarm.target:
            break

        if is_related_to_selected(candidate, selected_core + selected_discovery,
                                  threshold="KING_0.0625"):
            continue

        selected_discovery.append(candidate)

selected_total = selected_core + selected_discovery
```

Si le bras découverte ne peut pas atteindre son quota à cause de la contrainte IBD, les substitutions sont faites entre sous-bras, puis documentées.

### 10.2 Sorties obligatoires

Le pipeline doit produire au moins deux listes :

1. `selection_stricte_350` : sélection géographique stricte, sans bras découverte.
2. `selection_hybride_350` : noyau géo-ancestral + bras découverte contrôlé.

Une troisième liste peut être produite :

3. `selection_hybride_consensus` : individus stables sur multi-ordres/multi-seeds.

---

## Partie IV — Données, contrôle qualité et analyses haplotypiques

## 11. Contrôle qualité SNP

### 11.1 Principes

La puce comporte environ **1,9 M SNP bruts**. Le nombre final de SNP dépendra du QC, du filtrage et de l’usage analytique.

```text
1,9 M SNP bruts
     ↓
QC variant / individu
     ↓
jeux de SNP spécialisés :
   - PCA/ADMIXTURE : LD-pruned
   - phasage : dense harmonisé
   - IBD/ROH : dense filtré
   - imputation : harmonisé avec WGS
```

### 11.2 QC variant

- taux de manquants SNP < 2–5 % ;
- MAF ≥ 1 % pour PCA/ADMIXTURE/S_div principal ;
- SNP rares conservés dans des jeux secondaires si pertinents ;
- HWE utilisé avec prudence, idéalement par strate ;
- exclusion ou traitement des SNP ambigus A/T et C/G si harmonisation inter-références ;
- harmonisation build / strand / positions ;
- contrôle batch / plaque / centre / extraction ;
- LD pruning pour PCA et ADMIXTURE.

### 11.3 QC individu

- taux de manquants individu < 2–5 % ;
- sex check ;
- hétérozygotie extrême, par exemple |z| > 3 à examiner ;
- duplicats ;
- apparentements inattendus ;
- contamination si métriques disponibles ;
- cohérence géographique et métadonnées minimales.

### 11.4 HWE en population admixée

Un filtre HWE global peut retirer des marqueurs informatifs dans une population structurée par effet Wahlund. Le HWE doit donc être traité comme un indicateur de qualité technique, non comme une règle d’exclusion aveugle.

Recommandation :

- HWE global pour détection de problèmes majeurs ;
- HWE par strate ou après contrôle de structure ;
- documentation des SNP exclus pour HWE.

---

## 12. Phasage, imputation et LAI

### 12.1 Stratégie de phasage

La stratégie de phasage combinera :

- les 2500 individus SNP populationnels ;
- les 100 familles nucléaires SNP ;
- les 350 WGS lorsqu’ils seront disponibles ;
- les panels externes uniquement comme support, non comme référence exclusive.

L’objectif est de produire un phasage mieux adapté à la structure haplotypique réunionnaise qu’un phasage reposant uniquement sur des panels externes. Le gain attendu devra être mesuré, et non seulement supposé, par les erreurs mendéliennes, les taux de switch error, la concordance d’imputation, la stabilité des haplotypes transmis et la performance par strate d’ascendance.

### 12.2 Outil principal retenu : SHAPEIT4

L’outil principal retenu pour le phasage est **SHAPEIT4**. Ce choix est justifié par plusieurs éléments :

- SHAPEIT4 est conçu pour le phasage de grands jeux de données SNP et WGS ;
- il est adapté aux cohortes de grande taille grâce à une approche PBWT efficace ;
- il permet d’intégrer différentes sources d’information de phase, notamment des panels de référence, des haplotypes préphasés, des informations issues de trios ou pedigrees et, si disponibles, des lectures de séquençage informatives ;
- il s’inscrit dans la continuité des outils de la famille SHAPEIT utilisés dans les ressources de référence internationales, notamment les ressources 1000 Genomes / IGSR.

Dans le projet Génome Réunion, SHAPEIT4 sera utilisé pour construire un phasage populationnel réunionnais à partir :

```text
2500 SNP populationnels
+ 100 familles nucléaires SNP
+ 350 WGS après disponibilité
```

Les familles nucléaires pourront fournir des contraintes de transmission mendélienne ou des haplotype scaffolds. Ces informations doivent être utilisées pour réduire les erreurs de phase, améliorer la continuité des haplotypes et renforcer l’imputation locale.

### 12.3 Plan de phasage en trois niveaux

La stratégie recommandée est progressive :

| Niveau | Données utilisées | Objectif |
|---|---|---|
| **Phase A** | 2500 SNP populationnels | phasage statistique populationnel initial |
| **Phase B** | 2500 SNP + 100 familles nucléaires | phasage assisté par transmission mendélienne |
| **Phase C** | 2500 SNP + familles + 350 WGS | phasage enrichi par variants WGS et panel local |

Chaque niveau devra être comparé au précédent pour mesurer le gain réel.

Métriques recommandées :

- taux d’erreurs mendéliennes ;
- taux de switch error sur les enfants informatifs ;
- longueur moyenne des haplotypes cohérents ;
- concordance d’imputation après masquage de variants ;
- R² d’imputation par classe de MAF ;
- stabilité des segments LAI ;
- performance dans les régions ROH/fondatrices.

### 12.4 Phasage familial

Les familles nucléaires fournissent des contraintes de transmission :

```text
parents + enfant(s)
      ↓
transmission mendélienne
      ↓
validation de phase locale
      ↓
réduction des switch errors
```

Les familles permettront de mesurer :

- taux d’erreurs mendéliennes ;
- taux de switch errors lorsqu’un jeu de validation est disponible ;
- cohérence des haplotypes transmis ;
- amélioration de l’imputation après inclusion des familles.

#### 12.4.1 Priorité des structures familiales

Toutes les familles nucléaires n’ont pas la même valeur informative pour le phasage. La priorité de recrutement et d’analyse sera :

| Structure familiale | Priorité | Utilité pour le phasage |
|---|---:|---|
| Deux parents + ≥2 enfants | Très haute | transmission robuste, recombinaisons informatives |
| Trio père-mère-enfant | Haute | phasage mendélien fiable |
| Un parent + enfant | Intermédiaire | utile mais moins complet |
| Fratrie sans parents | Secondaire | information partielle, à utiliser avec prudence |

Les familles incomplètes peuvent rester utiles, mais elles devront être annotées séparément, avec un niveau de confiance adapté.

### 12.5 Imputation

Le panel d’imputation final reposera sur :

```text
350 WGS phasés
+ haplotypes SNP des 2500
+ information de transmission des familles
```

Les performances seront évaluées par :

- masquage de variants connus ;
- concordance dosage/génotype ;
- R² d’imputation par classe de MAF ;
- performance par strate d’ascendance ;
- performance sur variants pharmacogénétiques et variants fondateurs connus lorsque disponibles.

### 12.6 Local ancestry inference

Le phasage amélioré renforcera les analyses de local ancestry inference, en particulier dans les régions où les segments ancestraux sont courts, mosaïques ou mal représentés par des panels externes.

Les résultats LAI devront être interprétés avec prudence et validés par cohérence avec :

- PCA ;
- ADMIXTURE global ;
- haplotypes familiaux ;
- géographie ;
- signaux IBD/ROH.

---

## Partie V — Validation, sensibilité et audit

## 13. Validation préalable

### 13.1 Objectif

Valider empiriquement que la logique de sélection proposée est supérieure à des alternatives simples, sans dépendre d’une seule structure d’admixture.

La validation porte sur :

- le score géo-ancestral `S_div_geoancestry` ;
- le score global `S_discovery_global` ;
- la version stricte vs la version hybride ;
- la robustesse aux poids ;
- la robustesse aux ordres de sélection ;
- la capacité du score calculé sur puce SNP à prédire la couverture WGS.

### 13.2 Groupes de validation

Groupes proposés :

1. ACB/ASW : admixture africain/européen ;
2. GIH/BEB : composante sud-asiatique ;
3. tri-ancestral simulé à partir de populations parentales ;
4. cohorte admixée plus large si disponible, pour tester une compression proche de 14 %.

### 13.3 Scénarios de compression

1000G peut être trop petit pour tester directement une compression de 14 %. Les scénarios 25/50/75 % restent utiles, mais doivent être complétés par :

- un scénario 10–15 % lorsque la taille de la cohorte le permet ;
- une cohorte plus grande de type admixée si accessible ;
- une simulation de sous-échantillonnage répétée.

### 13.4 Stratégies comparées

Comparer :

1. random ;
2. PCA-only ;
3. maximin IBD ;
4. S_div naïf ;
5. **stratification géographique + S_div_geoancestry** ;
6. S_div stratifié strict ;
7. S_div hybride ;
8. S_div hybride + gain marginal ;
9. **stratification ADMIXTURE + greedy global** ;
10. **sélection globale maximin PCA/ADMIX/IBD**.

Les stratégies 5, 6, 10 et 11 constituent le test comparatif central de cette version : elles permettent d’évaluer si l’ancrage géographique apporte un meilleur compromis populationnel que des stratégies purement génétiques, ou si une version hybride géographie + clusters génétiques doit être retenue comme scénario secondaire.

### 13.5 Métriques

| Métrique | Rôle |
|---|---|
| Couverture allélique globale | Variants capturés par la sélection |
| Couverture variants rares | Variants MAF < 5 %, puis < 1 % si possible |
| KS distribution S_div | Biais directionnel |
| Divergence ancestrale | Représentation ADMIX/PCA |
| Parenté résiduelle | Paires au-dessus du seuil |
| Couverture haplotypique | Diversité de segments couverts |
| Performance imputation | R² / concordance par MAF |
| Stabilité multi-seed | Robustesse algorithmique |
| Stabilité multi-ordre | Dépendance à l’ordre de sélection |
| Différence stricte vs hybride | Apport réel du bras découverte |
| Sensibilité taille bras découverte | Comparaison 5 %, 8 %, 10 %, 15 % |
| Couverture géo-ancestrale | Proportion de cellules secteur × ascendance inférée représentées |
| Stabilité des labels ADMIXTURE | Cohérence multi-seed et alignement avec pools témoins |

### 13.6 Validation puce → WGS

Comme la sélection réelle part de la puce SNP, il faut tester la capacité prédictive de la puce :

1. partir de données WGS disponibles ;
2. restreindre aux SNP présents sur la puce 1,9 M ;
3. appliquer QC et LD pruning selon les usages ;
4. calculer les scores sur la version puce ;
5. sélectionner les individus ;
6. mesurer la couverture réelle des variants WGS récupérés.

Question centrale :

> un score calculé sur puce SNP sélectionne-t-il bien les individus qui maximisent l’information WGS ?

Cette étape doit être présentée comme une **simulation de faisabilité pré-déploiement**. Elle ne remplace pas l’audit final sur les données réunionnaises réelles, car les 350 WGS seront sélectionnés stratégiquement et non tirés aléatoirement.

### 13.7 Audit ex-post après obtention des 350 WGS

Après production des 350 WGS réunionnais, un audit ex-post devra vérifier empiriquement la performance réelle de la sélection. Cet audit comparera la sélection hybride géo-ancestrale aux scénarios contrefactuels qui auraient pu être retenus à partir de la même cohorte SNP.

Comparaisons minimales :

1. `selection_hybride_350` ;
2. tirages random de 350 individus, répétés au moins 100 fois ;
3. sélection PCA-only ;
4. sélection ADMIXTURE-only ;
5. sélection maximin PCA/ADMIX/IBD ;
6. sélection géographique stricte sans bras découverte.

Métriques ex-post :

- nombre total de variants WGS capturés ;
- couverture des variants rares et modérément rares ;
- couverture des variants pharmacogénétiques ;
- couverture des haplotypes et segments mal représentés ;
- performance d’imputation par classe de MAF ;
- performance par strate d’ascendance ;
- contribution réelle du bras ROH/fondateur ;
- comparaison fréquence brute WGS / fréquence pondérée / fréquence imputée.

L’objectif est de démontrer que la sélection hybride apporte un gain mesurable par rapport à des stratégies plus simples, et d’identifier les limites résiduelles du référentiel de première génération.

---

## 14. Analyses de sensibilité

### 14.1 Sensibilité des poids

Les poids initiaux de `S_div_geoancestry` sont des **valeurs de travail**, et non des constantes théoriques. Ils devront donc être testés avant gel de la sélection WGS.

Analyse minimale :

```text
w1, w2, w3, w4 ±10 %
```

Analyse renforcée recommandée :

```text
w1, w2, w3, w4 ±20 %
```

Pour chaque jeu de poids, la sélection sera relancée et comparée à la sélection de référence.

Mesures à rapporter :

- couverture allélique globale ;
- couverture des variants rares ;
- KS de la distribution `S_div` ;
- divergence ancestrale PCA/ADMIXTURE ;
- nombre et proportion d’individus remplacés ;
- parenté résiduelle dans le panel ;
- performance d’imputation, si disponible ;
- stabilité du bras découverte.

Interprétation :

- **faible variance** : les poids sont robustes et la sélection ne dépend pas fortement du paramétrage initial ;
- **variance modérée** : les poids peuvent être conservés mais doivent être justifiés par les objectifs prioritaires du panel ;
- **forte variance** : la calibration des poids devient critique et devra être optimisée avant déploiement sur la cohorte réunionnaise.

En complément, une recherche de poids optimisés pourra être réalisée sur les jeux de validation externes ou simulés, en comparant les performances de plusieurs combinaisons pondérées. Les poids retenus pour la cohorte réunionnaise devront être versionnés et documentés dans le fichier final de paramètres.

### 14.2 LOCO

Analyse leave-one-component-out :

```text
S_full
S_-PCA
S_-ADMIX
S_-IBD
S_-ROH
```

Objectifs :

- tester la redondance PCA/ADMIX ;
- quantifier la valeur ajoutée de ROH ;
- vérifier que IBD n’est pas substituable ;
- mesurer la stabilité des individus sélectionnés.

### 14.3 Robustesse greedy

Exécuter :

- ordre décroissant de taille ;
- ordre aléatoire, ≥100 permutations ;
- ordre petit → grand ;
- plusieurs seeds ADMIXTURE ;
- tie-breakers randomisés.

Livrables :

- intersection moyenne des panels ;
- individus stables ;
- individus frontière ;
- variance des métriques ;
- recommandation de sélection consensus.

---

## Partie VI — Mise en œuvre opérationnelle

## 15. Sorties attendues

Le pipeline doit produire :

1. `QC_report_SNP_populationnel` ;
2. `QC_report_familles` ;
3. `PCA_global_2500` ;
4. `ADMIXTURE_global_2500` ;
5. `ROH_report_2500` ;
6. `IBD_report_geoancestral` ;
7. `phase_report_population_familles` ;
8. `selection_stricte_350` ;
9. `selection_hybride_350` ;
10. `selection_consensus` si multi-seed/multi-ordre ;
11. `rapport_bras_decouverte` ;
12. `rapport_recalibrage_frequences` ;
13. `rapport_imputation` ;
14. `rapport_LAI` si réalisé ;
15. `audit_versions_parametres`.

---

## 16. Risques et mitigations

| Risque | Cause | Mitigation |
|---|---|---|
| Biais puce SNP | contenu de la puce non parfaitement adapté | validation puce→WGS, documentation |
| Fréquences WGS biaisées | panel enrichi | recalibrage sur les 2500 SNP |
| ROH fondateurs sous-capturés | score principal pénalise ROH | bras découverte ROH/fondateur |
| Parenté excessive | population insulaire, familles | seuil KING, annotation, filtrage |
| Seuil IBD ambigu | PI_HAT vs KING | métrique fixée et reportée |
| Familles mal interprétées | apparentés utilisés comme indépendants | familles = ressource technique, non fréquence |
| HWE global trompeur | effet Wahlund | HWE par strate / prudence |
| Greedy instable | dépendance à l’ordre | multi-ordre, consensus |
| K ADMIXTURE instable | modèles proches | seeds, CV, pools témoins, analyse multi-K |
| K ADMIXTURE non interprétable | absence de références | PCA projetée + ADMIXTURE avec pools témoins, labels prudents |
| Stratification géographique insuffisante | répartition non homogène des ascendances | cellules géo-ancestrales secteur × ascendance inférée |
| Phasage dépendant panel externe | haplotypes réunionnais absents | 2500 SNP + 100 familles + WGS local |

---

## 17. Timeline opérationnelle révisée

### Phase 1 — Validation externe et simulation, 8 à 10 semaines

| Semaine | Tâche | Livrable |
|---|---|---|
| 1 | Préparation jeux 1000G/admixés | datasets QC |
| 2 | Simulation tri-ancestrale | dataset simulé |
| 3 | Simulation puce 1,9 M depuis WGS | jeu dégradé puce |
| 4 | PCA/ADMIX/IBD/ROH | scores initiaux |
| 5 | Sélections comparatives | panels testés |
| 6 | Strict vs hybride géo-ancestral | métriques comparées |
| 7 | Sensibilité poids + LOCO | rapport robustesse |
| 8 | Multi-ordre/multi-seed | rapport stabilité |
| 9–10 | Synthèse et recommandations | paramètres V3.3 finalisés |

### Phase 2 — Cohorte Réunion SNP, 8 à 10 semaines

| Semaine | Tâche | Livrable |
|---|---|---|
| 1–2 | QC 2500 SNP + secteurs | données propres |
| 3 | PCA interne + PCA projetée sur pools témoins + ADMIXTURE | structure géo-ancestrale initiale |
| 4 | cellules géo-ancestrales + IBD + ROH + S_div_geoancestry | quotas et scores géo-ancestraux |
| 5 | sélection stricte + hybride géo-ancestrale | listes 350 |
| 6 | audit bras découverte | justification individuelle |
| 7–8 | préparation WGS | échantillons prêts |
| 9–10 | premiers WGS | VCF/BAM préliminaires |

### Phase 3 — Module familial et phasage, parallèle

| Étape | Tâche | Livrable |
|---|---|---|
| F1 | recrutement 100 familles nucléaires | familles géographiquement diversifiées |
| F2 | génotypage SNP 1,9 M | données familiales SNP |
| F3 | QC familial + Mendel errors | rapport transmission |
| F4 | phasage 2500 + familles | haplotypes réunionnais SNP |
| F5 | intégration WGS | panel d’imputation local |
| F6 | évaluation imputation/LAI | rapport performance |


---

## 18. Points à valider avant gel de la sélection

Avant d’arrêter définitivement la liste des 350 WGS, les points suivants devront être explicitement validés :

1. **Statut du panel retenu** : stricte 350 ou hybride géo-ancestrale 322+28.
2. **Métrique de parenté** : KING kinship comme métrique principale, avec seuil final documenté.
3. **Disponibilité du module familial** : activation ou non de `Haplotype_utility` dans le bras découverte.
4. **Seuils ROH** : 100 Mb conservé ou remplacé par une normalisation empirique.
5. **K ADMIXTURE et pools témoins** : choix final fondé sur CV-error, stabilité, cohérence avec PCA projetée, pools témoins et interprétabilité prudente.
6. **Cellules géo-ancestrales** : seuils minimaux, règles de protection des profils rares et documentation des cellules non représentées.
7. **Poids S_div** : poids initiaux ou poids recalibrés après validation.
8. **Procédure de récupération** : règles activées et rapport de substitution produit.
9. **Fréquences finales** : format de reporting brut / pondéré / imputé.
10. **Gouvernance familiale** : protocole de gestion des apparentements inattendus et erreurs mendéliennes.

Ces éléments devront être stockés dans un fichier de paramètres versionné afin de rendre la sélection reproductible.

---

## Partie VII — Annexes, références et versioning

## 19. Annexe A — Commandes indicatives PLINK / ADMIXTURE / SHAPEIT4

Les commandes ci-dessous sont indicatives. Elles devront être adaptées au format exact des fichiers, au build génomique, à la puce utilisée et à la version finale de SHAPEIT4 retenue pour le phasage.

### 19.1 Conversion et QC minimal

```bash
# Conversion initiale depuis VCF ou format fournisseur
plink2 --vcf data.vcf.gz \
  --make-pgen \
  --out reunion_raw

# QC variant et individu : jeu dense de base
plink2 --pfile reunion_raw \
  --geno 0.05 \
  --mind 0.05 \
  --make-pgen \
  --out reunion_qc_dense

# Jeu commun pour PCA / ADMIXTURE / S_div principal
plink2 --pfile reunion_qc_dense \
  --maf 0.01 \
  --hwe 1e-6 midp \
  --make-pgen \
  --out reunion_qc_common
```

### 19.2 Contrôles individuels

```bash
plink2 --pfile reunion_qc_common \
  --missing sample-only \
  --check-sex \
  --het \
  --out qc_individuals
```

### 19.3 LD pruning pour PCA et ADMIXTURE

```bash
plink2 --pfile reunion_qc_common \
  --indep-pairwise 200kb 50 0.2 \
  --out reunion_pruning

plink2 --pfile reunion_qc_common \
  --extract reunion_pruning.prune.in \
  --make-pgen \
  --out reunion_qc_ldpruned
```

### 19.4 PCA interne et PCA avec pools témoins

```bash
# PCA interne sur les 2500 individus réunionnais
plink2 --pfile reunion_qc_ldpruned \
  --pca 10 \
  --out pca_global_2500

# PCA ancrée sur pools témoins : principe indicatif
# 1. harmoniser les références et la cohorte Réunion sur build/strand/SNP communs
# 2. fusionner les jeux de données
# 3. effectuer LD pruning commun
# 4. calculer la PCA sur références + Réunion ou projeter Réunion sur l’espace référence
plink2 --pfile reunion_plus_references_ldpruned \
  --pca 20 \
  --out pca_reference_projected
```

### 19.5 ADMIXTURE non supervisé et avec pools témoins

```bash
# Convertir si nécessaire au format bed/bim/fam
plink2 --pfile reunion_qc_ldpruned \
  --make-bed \
  --out reunion_admixture

# ADMIXTURE non supervisé : structure interne, labels non garantis
for K in 2 3 4 5 6 7 8 9 10; do
    admixture --cv --seed=42 reunion_admixture.bed $K | tee admixture_unsup_K${K}.log
done

grep "CV error" admixture_unsup_K*.log

# ADMIXTURE avec références : principe indicatif
# Le fichier .pop doit distinguer les individus de référence connus
# et les individus réunionnais à estimer selon le mode retenu.
plink2 --pfile reunion_plus_references_ldpruned \
  --make-bed \
  --out reunion_references_admixture

# Exemple supervisé indicatif ; les options exactes dépendront du fichier .pop
admixture --supervised --seed=42 reunion_references_admixture.bed ${K_REF} \
  | tee admixture_supervised_K${K_REF}.log
```

### 19.6 Parenté KING

```bash
# Table de parenté globale indicative
plink2 --pfile reunion_qc_common \
  --make-king-table \
  --out king_global

# Analyse par secteur : exemple secteur A
plink2 --pfile reunion_qc_common \
  --keep sector_A.txt \
  --make-king-table \
  --out king_sector_A
```

Le seuil recommandé est :

```text
kinship_KING >= 0,0625  → apparentement proche à exclure du panel WGS principal
```

Ce seuil devra être validé sur la distribution réelle des coefficients de parenté.

### 19.7 ROH

```bash
plink --bfile reunion_qc_common \
  --homozyg \
  --homozyg-window-snp 50 \
  --homozyg-snp 50 \
  --homozyg-kb 1000 \
  --out roh_global
```

Les paramètres ROH devront être ajustés à la densité réelle de la puce et validés sur la distribution réunionnaise observée.

### 19.8 Familles nucléaires

```bash
# Contrôles de transmission mendélienne : commande indicative selon format pedigree
plink2 --pfile families_qc_dense \
  --mendel \
  --out families_mendel
```

Le fichier de pedigree devra être versionné, contrôlé et séparé des fichiers populationnels afin d’éviter toute confusion entre ressource de phasage et cohorte indépendante.

### 19.9 Phasage avec SHAPEIT4 — schéma indicatif

Les commandes exactes dépendront du format VCF/BCF retenu, de la carte génétique utilisée, du découpage par chromosome et de la manière dont les informations familiales seront transformées en contraintes de phase ou en haplotype scaffold.

```bash
# Exemple indicatif : phasage populationnel par chromosome
shapeit4 \
  --input reunion_chr${CHR}.vcf.gz \
  --map genetic_map_chr${CHR}.txt \
  --region ${CHR} \
  --output reunion_chr${CHR}.phased.bcf \
  --thread 8

# Exemple conceptuel : intégration d'un scaffold familial ou d'une information préphasée
# Les options exactes seront adaptées au format produit par le pipeline familial.
shapeit4 \
  --input reunion_chr${CHR}.vcf.gz \
  --map genetic_map_chr${CHR}.txt \
  --region ${CHR} \
  --scaffold family_scaffold_chr${CHR}.bcf \
  --output reunion_chr${CHR}.family_assisted.phased.bcf \
  --thread 8
```

Le pipeline devra conserver au minimum deux sorties comparables :

```text
phasage_populationnel_SHAPEIT4
phasage_populationnel_plus_familles_SHAPEIT4
```

Une troisième sortie sera produite après disponibilité du WGS :

```text
phasage_populationnel_plus_familles_plus_WGS_SHAPEIT4
```

Ces sorties permettront de quantifier le gain réel du module familial et du panel WGS local.

---

## 20. Annexe B — Statut analytique des familles nucléaires

| Usage | Familles utilisées ? | Commentaire |
|---|---|---|
| Estimation brute de fréquence populationnelle | Non | apparentés, hors cohorte 2500 |
| Phasage SNP | Oui | transmission mendélienne |
| Imputation | Oui | amélioration des haplotypes |
| LAI | Oui | soutien à la reconstruction locale |
| IBD/ROH familial | Oui | analyses dédiées |
| Sélection WGS principale | Non directement | sauf si un individu appartient aussi à la cohorte 2500, ce qui n’est pas le cas prévu ici |
| Contrôle qualité | Oui | Mendel errors, incohérences, contamination |

---

## 21. Références à maintenir et compléter

### Méthodologie et diversité génomique

- Martin AR, et al. Clinical use of current polygenic risk scores may exacerbate health disparities. *Nature Genetics*, 2019.
- Fatumo S, et al. A roadmap to increase diversity in genomic studies. *Nature Medicine*, 2022.
- Sirugo G, Williams SM, Tishkoff SA. The Missing Diversity in Human Genetic Studies. *Cell*, 2019.

### Populations admixées et WGS

- Naslavsky MS, et al. Whole-genome sequencing of elderly admixed individuals from São Paulo, Brazil. *Nature Communications*, 2022.
- Nunes K, et al. Admixture and Brazilian population evolution/health. Référence à vérifier et mettre à jour selon citation finale.

### ROH, IBD, phasage, imputation, outils

- Kirin M, et al. Genomic runs of homozygosity record population history and consanguinity. *PLoS One*, 2010.
- Tournebize R, et al. Reconstructing founder events using genome-wide allele sharing. *PLoS Genetics*, 2022.
- Chang CC, et al. Second-generation PLINK. *GigaScience*, 2015.
- Price AL, Patterson NJ, Plenge RM, Weinblatt ME, Shadick NA, Reich D. Principal components analysis corrects for stratification in genome-wide association studies. *Nature Genetics*, 2006.
- Alexander DH, Novembre J, Lange K. Fast model-based estimation of ancestry in unrelated individuals. *Genome Research*, 2009.
- Browning SR, Browning BL. Haplotype phasing: existing methods and new developments. *Nature Reviews Genetics*, 2011.
- Delaneau O, Zagury JF, Robinson MR, Marchini J, Dermitzakis ET. Accurate, scalable and integrative haplotype estimation. *Nature Communications*, 2019. Référence principale SHAPEIT4.
- Byrska-Bishop M, et al. High-coverage whole-genome sequencing of the expanded 1000 Genomes Project cohort including 602 trios. *Cell*, 2022. Référence utile pour les ressources 1000 Genomes/IGSR à haute couverture, les trios et les panels d’imputation.
- Loh PR, Palamara PF, Price AL. Fast and accurate long-range phasing in a UK Biobank cohort. *Nature Genetics*, 2016. Référence comparative Eagle / long-range phasing.
- Browning BL, Zhou Y, Browning SR. A One-Penny Imputed Genome from Next-Generation Reference Panels. *American Journal of Human Genetics*, 2018. Référence Beagle / imputation et grands panels.

Les références sur la local ancestry inference devront être complétées dans la version destinée à publication.

---

## 22. Versioning

| Version | Statut | Changements principaux |
|---|---|---|
| V1 | Méthode initiale | Stratification géographique + `S_div` |
| V2 | Révision renforcée | Panel hybride, bras découverte, QC, ROH fondateur, validation puce→WGS |
| V3 | Reformulation consolidée | Familles nucléaires hors cohorte, puce 1,9 M SNP, phasage Réunion, `S_div` global distinct, IBD KING clarifié, quotas intégrés, recalibrage des fréquences formalisé |
| V3.1 | Consolidation phasage | SHAPEIT4 retenu comme outil principal, références phasage/imputation ajoutées, phasage en trois niveaux, priorisation des structures familiales, annexe de commandes SHAPEIT4 indicatives |
| V3.2 organisée | Version structurée | Réorganisation en grandes parties, ajout d’une page titre, d’un message central, d’un sommaire, et intégration des garde-fous méthodologiques sans affichage sous forme de corrections successives |
| **V3.3 géo-ancestrale** | Révision conceptuelle majeure | Remplacement de la stratification strictement géographique par une stratification géo-ancestrale ; ajout des pools témoins ; clarification PCA/ADMIXTURE/K ; distinction ascendance génétique inférée vs ethnicité sociale ; adaptation de S_div et des quotas aux cellules secteur × ascendance inférée |

---

## 23. Conclusion méthodologique

Ce document formalise une architecture en trois piliers :

```text
2500 SNP populationnels
    → structure, sélection, recalibrage

350 WGS optimisés
    → découverte, référence locale, imputation

100 familles nucléaires SNP hors cohorte
    → phasage, transmission, haplotypes réunionnais
```

Cette architecture répond aux principales faiblesses méthodologiques identifiées :

- distinction entre découverte et estimation de fréquence ;
- préservation de la représentativité territoriale tout en intégrant l’ascendance génétique inférée ;
- passage d’une stratification géographique simple à une stratification géo-ancestrale ;
- récupération contrôlée des profils rares, fondateurs ou sous-capturés ;
- amélioration du phasage par information familiale avec SHAPEIT4 comme outil principal ;
- non-utilisation des familles comme individus indépendants de fréquence ;
- validation explicite du passage puce SNP vers information WGS ;
- auditabilité des scores, paramètres, seuils et substitutions.

Le projet ne prétend pas produire dès la première phase un référentiel exhaustif de tous les variants réunionnais. Il propose une stratégie réaliste, contrôlée et évolutive pour construire un premier référentiel local utilisable, améliorable et scientifiquement défendable.
