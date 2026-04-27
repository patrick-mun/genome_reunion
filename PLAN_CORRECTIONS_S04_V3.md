# PLAN VISUEL DES CORRECTIONS S04 — V3

## STRUCTURE ACTUELLE vs STRUCTURE V3 CIBLE

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SECTION S04 — ALGORITHME DE SÉLECTION                     │
└─────────────────────────────────────────────────────────────────────────────┘

BLOC 1: INTRO + CONTEXTE SCIENTIFIQUE
═════════════════════════════════════════════════════════════════════════════

  [S04-18] INTRO S04 — Algorithme de Sélection
           └─ EXISTE ✓ | Pas de changement

  [S04-19] Résumé 1 — Vue d'ensemble
           └─ EXISTE ✓ | Pas de changement

  [S04-20] Résumé 2 — Validation & Déploiement
           └─ EXISTE ✓ | À mettre à jour (mentionner 100 familles)
           └─ MODIF: ajouter phrase sur phasage familial


BLOC 2: FONDATIONS SCIENTIFIQUES (NOUVEAU)
═════════════════════════════════════════════════════════════════════════════

  [NEW-21] ★ Justification statistique : N = 350 WGS = 700 haplotypes
           ├─ Formule : P(détection) = 1 - (1 - MAF)^700
           ├─ Table MAF / probabilité / acceptabilité
           ├─ Seuil retenu : MAF ≥ 1%
           └─ Comparaison : Naslavsky (1171) vs Réunion (350)


BLOC 3: ARCHITECTURE GLOBALE DU PROJET (NOUVEAU)
═════════════════════════════════════════════════════════════════════════════

  [NEW-22] ★ Architecture en trois piliers
           ├─ Pilier 1 : 2500 SNP populationnels
           ├─ Pilier 2 : 350 WGS (panel hybride)
           └─ Pilier 3 : 100 familles nucléaires SNP
           └─ Tableau : taille / rôle / statut analytique


BLOC 4: NATURE DU PANEL WGS (NOUVEAU/IMPORTANT)
═════════════════════════════════════════════════════════════════════════════

  [NEW-23] ★ Panel WGS hybride V3 : noyau + découverte
           ├─ Noyau géographique strict : 322 (92%)
           ├─ Bras découverte contrôlé : 28 (8%)
           ├─ Ne pas confondre : découverte ≠ fréquence populationnelle
           └─ Recalibrage obligatoire sur 2500 SNP


BLOC 5: SÉLECTION STRATIFIÉE (CORRECTIONS TEXTE)
═════════════════════════════════════════════════════════════════════════════

  [EXISTE-21] Deux niveaux, une contrainte principale
             └─ MODIF: clarifier "noyau géographique" vs "bras découverte"

  [EXISTE-22] Représentativité géographique
             └─ MODIF: expliciter allocation pour N_core = 322 vs N_strict = 350

  [EXISTE-23] Quatre dimensions complémentaires
             └─ MODIF: ajouter rationale "global vs par-secteur" + K ADMIXTURE

  [EXISTE-24] Composantes globales : PCA + ADMIX
             └─ MODIF: "Pourquoi global?" + entropie vs rareté ancestrale

  [EXISTE-25] Composantes locales : IBD + ROH
             └─ MODIF: ajouter métrique KING kinship + seuil 0.0625
             └─ MODIF: ROH simple + version empirique en sensibilité

  [EXISTE-26] Le Score S_div
             └─ MODIF: clarifier poids comme "valeurs de travail" pré-validation


BLOC 6: STRATIFICATION ET ALGORITHME GREEDY
═════════════════════════════════════════════════════════════════════════════

  [EXISTE-27] Anti-biais directionnel : stratification par quintile
             └─ MODIF: justifier allocation 60/40 pour binaire N_WGS 6-19
             └─ MODIF: ajouter note sur multi-ordre robustness

  [EXISTE-28] Algorithme greedy stratifiée
             └─ MODIF: ajouter sous-algorithme "bras découverte"
             └─ MODIF: clarifier récupération des quotas


BLOC 7: EXEMPLE CONCRET + AVANTAGES/LIMITATIONS
═════════════════════════════════════════════════════════════════════════════

  [EXISTE-29] Exemple concret : calcul pas-à-pas du score
             └─ Pas de changement (radar chart reste valable)

  [EXISTE-30] Avantages et limitations acceptables
             └─ MODIF: refondre limitations avec V3
               ├─ Heuristique paramétrée (non mathématiquement optimale)
               ├─ Référentiel première génération, améliorable
               ├─ Variants MAF < 1% moins fiables
               └─ Recalibrage sur 2500 obligatoire


BLOC 8: VALIDATION EXTERNE
═════════════════════════════════════════════════════════════════════════════

  [EXISTE-31] Validation 1000 Genomes
             └─ MODIF: lister 5 stratégies comparées explicitement
             └─ MODIF: emphasize robustesse multi-groupe

  [EXISTE-32] EPIGEN-Brasil
             └─ MODIF: ajouter détail plateforme compatible


BLOC 9: PHASAGE ET MODULE FAMILIAL (NOUVEAU)
═════════════════════════════════════════════════════════════════════════════

  [NEW-33] ★ Phasage réunionnais : 2500 SNP + 100 familles nucléaires
           ├─ Transmission mendélienne comme source
           ├─ Amélioration haplotypes → imputation/LAI/IBD/ROH
           ├─ Les familles ≠ observations indépendantes (fréquence)
           └─ Séparation stricte : technique vs analytique


BLOC 10: RECALIBRAGE FRÉQUENCES (NOUVEAU)
═════════════════════════════════════════════════════════════════════════════

  [NEW-34] ★ Fréquences finales : brute → pondérée → imputée
           ├─ Distinction : freq WGS brute ≠ freq populationnelle
           ├─ Formule pondération simple par secteur
           ├─ Trois niveaux de confiance (direct / imputé HC / imputé MC)
           └─ Annotation obligatoire du statut


BLOC 11: SUMMARY + TRANSITION S05
═════════════════════════════════════════════════════════════════════════════

  [EXISTE-33+] INTRO S05 — WGS
               └─ Pas de changement

  [EXISTE-34+] Les impacts attendus
               └─ Pas de changement

  [EXISTE-35+] Conclusion
               └─ Pas de changement
```

---

## SYNTHÈSE DES ACTIONS PAR PRIORITÉ

### 🔴 PRIORITÉ CRITIQUE (Nouvelles slides à créer)

| # | Titre | Contenu clé | Position |
|---|-------|-----------|----------|
| NEW-21 | Justification N=350 | P(détection), table MAF, seuil 1% | Après Résumé S04 |
| NEW-22 | Architecture 3 piliers | 2500 + 350 + 100 | Après NEW-21 |
| NEW-23 | Panel hybride V3 | Noyau 322 + Découverte 28 | Après NEW-22 |
| NEW-33 | Phasage + 100 familles | Transmission + haplotypes Réunion | Après Validation EPIGEN |
| NEW-34 | Recalibrage fréquences | Brute/pondérée/imputée + annotations | Après NEW-33 |

### 🟡 PRIORITÉ HAUTE (Corrections texte/contenu)

| Slide | Correction | Type | Ligne approx |
|-------|-----------|------|--------------|
| S04-20 (Résumé 2) | Ajouter mention phasage 100 familles | TEXTE | +2 lignes |
| S04-23 | Clarifier global vs par-secteur | TEXTE | +3-4 lignes callout |
| S04-24 | "Pourquoi global?" + K ADMIXTURE | TEXTE + callout | +2-3 para |
| S04-25 | KING kinship + ROH empirique | TEXTE + callout | +2-3 para |
| S04-27 | Justifier 60/40 binaire | TEXTE | +1-2 lignes |
| S04-28 | Multi-ordre robustness note | TEXTE | +1 ligne |
| S04-30 | Refondre limitations heuristique | TEXTE complet | ~4 para |
| S04-31 | Lister 5 stratégies + multi-groupe | TEXTE + tableau | +2-3 para |
| S04-32 | Plateforme compatible | TEXTE | +1 ligne |

### 🟢 PRIORITÉ MOYENNE (Sensibilité/analyses)

| Élément | Ajout | Type | Note |
|---------|-------|------|------|
| S04-25 | ROH empirique (sensibilité) | Callout | "À comparer en sensibilité" |
| S04-28 | Gain marginal PCA/ADMIX | Callout | "Optionnel, tester en V3" |
| S04-27 | Récupération quotas | Pseudo-code | Dans callout ou sous-section |
| S04-31 | Stabilité multi-seed | Texte | "Robustesse greedy" |

---

## STRUCTURE VISUELLE CIBLE

```
S04 INTRO [18]
    │
    ├─ Résumé S04 [19-20] ✓ EXISTE
    │
    ├─ NOUVEAU: Fondations scientifiques [21]
    │   └─ N=350 justification
    │
    ├─ NOUVEAU: Architecture 3 piliers [22]
    │   └─ 2500 + 350 + 100 familles
    │
    ├─ NOUVEAU: Panel hybride V3 [23]
    │   └─ Noyau + Découverte
    │
    ├─ Deux niveaux [MODIF: 24]
    │   └─ Clarifier hybrid vs strict
    │
    ├─ Représentativité géo [MODIF: 25]
    │   └─ Quotas pour 322 + 28
    │
    ├─ 4 composantes [MODIF: 26]
    │   └─ Global vs par-secteur rationale
    │
    ├─ PCA + ADMIX [MODIF: 27]
    │   └─ "Pourquoi global?" + K
    │
    ├─ IBD + ROH [MODIF: 28]
    │   └─ KING + ROH empirique
    │
    ├─ Le Score S_div [MODIF: 29]
    │   └─ "Valeurs de travail"
    │
    ├─ Stratification quintile [MODIF: 30]
    │   └─ Justifier 60/40
    │
    ├─ Algo greedy [MODIF: 31]
    │   └─ Ajouter bras découverte
    │
    ├─ Exemple concret [32] ✓
    │
    ├─ Avantages/limitations [MODIF: 33]
    │   └─ Heuristique + recalibrage
    │
    ├─ Validation 1000G [MODIF: 34]
    │   └─ 5 stratégies + multi-groupe
    │
    ├─ EPIGEN-Brasil [MODIF: 35]
    │   └─ Plateforme compatible
    │
    ├─ NOUVEAU: Phasage + 100 familles [36]
    │   └─ Transmission + haplotypes
    │
    ├─ NOUVEAU: Recalibrage fréquences [37]
    │   └─ Brute/pondérée/imputée
    │
    └─ S05 INTRO [38+]
```

---

## ESTIMATION EFFORT DE TRAVAIL

| Catégorie | Nb items | Effort estimé | Temps total |
|-----------|----------|---------------|------------|
| Nouvelles slides (5) | 5 | 20-30 min/slide | 2h30 |
| Corrections texte (9) | 9 | 5-10 min/slide | 1h30 |
| Callouts/mises à jour | 7 | 5 min/item | 35 min |
| **Total** | **21** | — | **~4h30** |

---

## CHECKLIST VALIDATION V3

- [ ] N=350 justification statistique (slide NEW-21)
- [ ] Architecture 3 piliers explicitée (slide NEW-22)
- [ ] Panel hybride 322+28 documenté (slide NEW-23)
- [ ] Global vs per-secteur rationalisé (slides MODIF: 23-25)
- [ ] KING kinship défini (slide MODIF: 25)
- [ ] ROH empirique mentionné (slide MODIF: 25)
- [ ] Limitations heuristique reformulées (slide MODIF: 33)
- [ ] 5 stratégies listées (slide MODIF: 34)
- [ ] Phasage 2500+100 familles (slide NEW-36)
- [ ] Recalibrage fréquences explicité (slide NEW-37)
- [ ] Familles = ressource technique (clarified throughout)

---

**READY FOR IMPLEMENTATION?** Dis-moi par où tu veux commencer:
1. Créer les 5 nouvelles slides
2. Corriger les slides existantes
3. Les deux en parallèle

