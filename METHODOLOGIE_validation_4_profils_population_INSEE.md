# Méthodologie de validation in silico — Génome Réunion
## Quatre profils de population synthétique et liens INSEE utiles

**Version :** v0.1  
**Statut :** document de travail à intégrer au projet  
**Objectif :** formaliser une stratégie de validation méthodologique indépendante d'une reconstruction historique exhaustive de La Réunion.

---

## 1. Principe général

La validation ne doit pas chercher à prouver que l'on connaît parfaitement la structure réelle de la population réunionnaise. Elle doit tester si la méthodologie de sélection WGS reste robuste dans plusieurs régimes possibles de structure populationnelle.

L'idée retenue est de construire plusieurs populations synthétiques de **2500 individus**, puis de sélectionner **350 WGS** selon différentes stratégies. La méthode est ensuite évaluée selon des métriques communes : diversité capturée, représentativité, parenté résiduelle, capture des variants rares ou fondateurs, performance d'imputation et stabilité algorithmique.

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

### Profil A — Homogène

#### Rôle

Contrôle négatif. Il sert à vérifier que la méthode ne crée pas artificiellement une différence lorsque la population est réellement peu structurée.

#### Hypothèse

Tous les secteurs présentent une admixture proche. Les différences géographiques sont faibles.

| Secteur | Européen | Africain | Malgache | Indien | Chinois / Est-asiatique | Comores / Océan Indien |
|---|---:|---:|---:|---:|---:|---:|
| Nord | 20 | 15 | 18 | 30 | 8 | 9 |
| Est | 18 | 16 | 20 | 30 | 7 | 9 |
| Sud | 19 | 14 | 18 | 31 | 8 | 10 |
| Ouest | 21 | 15 | 17 | 29 | 9 | 9 |
| Hauts / Cirques | 22 | 14 | 18 | 28 | 7 | 11 |
| Sud-Est | 18 | 17 | 20 | 29 | 6 | 10 |

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
| Est agricole | 12 | 20 | 28 | 30 | 4 | 6 |
| Saint-Leu / Hauts Ouest | 28 | 8 | 12 | 42 | 3 | 7 |
| Sud agricole | 18 | 10 | 10 | 50 | 4 | 8 |
| Hauts du Sud / Plaine | 45 | 8 | 10 | 25 | 2 | 10 |
| Sud-Est | 12 | 18 | 25 | 35 | 3 | 7 |
| Cirques / Hauts isolés | 35 | 14 | 25 | 16 | 1 | 9 |

#### Sous-profils à simuler

Exemple pour le **Sud agricole** :

| Sous-profil | Proportion dans le secteur | Signal simulé |
|---|---:|---|
| Engagisme indien agricole | 45 % | forte composante indienne |
| Créole sud admixé | 30 % | mélange indien / européen / africain / malgache |
| Mobilité récente | 15 % | profil diffus |
| Petit foyer fondateur | 10 % | ROH / IBD local, variant rare simulé |

Exemple pour les **Hauts du Sud / Plaine** :

| Sous-profil | Proportion dans le secteur | Signal simulé |
|---|---:|---|
| Yab / petits agriculteurs | 40 % | composante européenne fondatrice plus élevée |
| Admixé des Hauts | 30 % | européen + malgache + indien |
| Fondateur local | 20 % | ROH / IBD élevé |
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
| Nord urbain / commercial | 30 | 8 | 8 | 20 | 25 | 9 |
| Est agricole ancien | 6 | 25 | 38 | 24 | 2 | 5 |
| Nord-Est agricole indien | 8 | 14 | 20 | 52 | 2 | 4 |
| Saint-Leu / Hauts Ouest | 32 | 6 | 10 | 45 | 1 | 6 |
| Sud agricole | 12 | 6 | 8 | 66 | 2 | 6 |
| Hauts du Sud / Plaine | 60 | 5 | 8 | 18 | 1 | 8 |
| Cirques / Hauts isolés | 45 | 18 | 25 | 6 | 0 | 6 |
| Ouest littoral | 28 | 12 | 12 | 28 | 12 | 8 |

#### Variants fondateurs simulés

| Variant simulé | Zone principale | Fréquence locale | Fréquence île entière |
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

Chaque profil doit être soumis aux mêmes stratégies de sélection.

| Stratégie | Description | Rôle dans la validation |
|---|---|---|
| Opportuniste urbain | prélèvement concentré sur quelques zones faciles d'accès | scénario biaisé à battre |
| Random | tirage aléatoire simple parmi les 2500 | référence minimale |
| Géographique strict | allocation proportionnelle par secteur | teste la seule représentativité territoriale |
| PCA-only | sélection par distance dans l'espace PCA | teste l'information génétique globale |
| ADMIXTURE-only | sélection par entropie ou distance des profils q_k | teste l'information ancestrale |
| Géo-ancestral | secteur × profil d'ascendance | stratégie principale |
| Géo-ancestral + bras découverte | noyau représentatif + pool libre informatif | stratégie candidate optimale |

---

## 5. Métriques de validation

Les mêmes métriques doivent être calculées pour chaque profil et chaque stratégie.

| Métrique | Question évaluée |
|---|---|
| Couverture allélique totale | combien de variants sont capturés ? |
| Capture des variants rares | la stratégie récupère-t-elle les variants à fréquence faible ? |
| Capture des variants fondateurs simulés | les foyers locaux sont-ils représentés ? |
| Distance PCA sélection vs cohorte totale | la sélection respecte-t-elle la structure globale ? |
| Divergence ADMIXTURE sélection vs cohorte totale | les proportions ancestrales sont-elles conservées ? |
| IBD résiduel | y a-t-il trop de redondance génétique ? |
| ROH moyen / distribution ROH | la sélection surreprésente-t-elle l'autozygotie ? |
| Performance d'imputation | le panel WGS améliore-t-il l'imputation des 2150 SNP restants ? |
| Stabilité multi-seed | l'algorithme donne-t-il des résultats reproductibles ? |
| Sensibilité aux poids S_div | les conclusions dépendent-elles trop des poids ? |

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

---

## 7. Proxys à intégrer dans le simulateur

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

## 8. Liens INSEE utiles

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

## 9. Table de données minimale recommandée

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

## 10. Formulation algorithmique

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

---

## 11. Garde-fous scientifiques et éthiques

La simulation doit respecter quatre garde-fous :

1. **Ne pas assigner une origine individuelle.** Les composantes sont des outils de simulation génétique, pas des identités sociales.
2. **Distinguer les paramètres observés, estimés et scénarisés.** Chaque paramètre doit recevoir un statut : `observé`, `estimé`, `scénarisé`.
3. **Ne pas présenter les profils comme des mesures réelles.** Les profils A-D servent à valider la méthode, non à décrire définitivement La Réunion.
4. **Calibrer dès que les 2500 SNP réels sont disponibles.** Les scénarios doivent être comparés aux PCA, ADMIXTURE, ROH, IBD et fréquences réelles.

---

## 12. Positionnement final recommandé

Le scénario principal du projet doit être le **Profil C — mixte-hétérogène réunionnais plausible**.

Texte de justification recommandé :

> La population réunionnaise ne sera pas modélisée comme une population homogène ni comme une population totalement fragmentée. Le scénario principal sera un profil mixte-hétérogène : une population globalement admixée, mais présentant des gradients géographiques, des sous-profils locaux, des zones à héritage agricole ou commercial marqué et des foyers potentiels d'effets fondateurs. Ce scénario sera encadré par un profil homogène servant de contrôle négatif, un profil mixte avec sous-structure cachée et un profil hétérogène extrême utilisé comme stress-test méthodologique.

---

## 13. Livrables attendus

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
| `validation_report.html/pdf` | rapport interprétable et auditable |

---

## 14. Résumé opérationnel

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

Cette approche rend la validation de la stratégie WGS plus défendable, car elle ne dépend pas d'une reconstruction historique parfaite de La Réunion. Elle teste la méthode dans plusieurs mondes possibles, puis permettra une calibration empirique sur les 2500 SNP réels.
