# CLAUDE.md — Index du projet Génome Réunion
<!-- Mettre à jour ce fichier après toute modification qui change une ligne de référence,
     ajoute une slide, crée une classe CSS ou modifie la structure des fichiers. -->

## Vue d'ensemble

Présentation HTML/CSS/JS statique — 29 slides, zéro build tool, zéro CDN à l'exécution.
Règles de travail détaillées dans `AGENTS.md`.

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | Toutes les slides (source unique de vérité) |
| `css/main.css` | Styles (1 650 lignes, 14 sections numérotées) |
| `js/app.js` | Navigation, accessibilité du deck, Chart.js, animations SVG |
| `data/admixture.js` | Données + builder DOM du fond admixture (slide 0) |
| `js/vendor/chart.umd.js` | Chart.js 4.4.1 vendorisé (pas de CDN) |
| `AGENTS.md` | Règles de travail (contenu, commits, CSS) |

## CSS — Sections (main.css)

| # | Titre | Ligne | Classes clés |
|---|---|---|---|
| 1 | Variables de design | 34 | `:root` — `--navy --teal --cream --coral --amber --purple --blue --green` |
| 2 | Reset & base | 73 | `* html body` |
| 3 | Navigation fixe | 92 | `#nav #nav-logo #nav-center #nav-right .sec-pill .nbtn #ctr` |
| 4 | Barre de progression | 181 | `#prog #pf` |
| 5 | Deck de slides | 202 | `#deck .slide .inner` + delays `nth-child(1-7, n+8)` |
| 6 | Typographie | 264 | `.slide-title .slide-rule .text-body .caption` |
| 7 | Hero (slide 0) | 306 | `.accent-bar .hero-content .hero-title .hero-subtitle .hero-authors .hero-pill` |
| 8 | Intro de section | 410 | `.section-slide .section-number .section-tag .section-title .section-subtitle .section-graphic` |
| 9 | Composants | 534 | Voir sous-index ci-dessous |
| 10 | Admixture (slide 0) | 1413 | `.admix-wrap #admix-bg .admix-overlay-left .admix-overlay-vignette .adm-legend .adm-legend-dot--*` |
| 11 | Graphiques / SVG | 1500 | `.chart-wrapper .pipeline-box .pipeline-arrow .chromosome-*` `#radarChart` |
| 12 | Responsive | 1579 | `@media 900px / 600px / 380px` |
| 13 | Hauteurs min. fluides | 1631 | `.grid-* .card .level-card .arm-card` min-height |
| 14 | Accessibilité (motion) | 1646 | `@media (prefers-reduced-motion: reduce)` |

### Sous-index section 9 — Composants

| Groupe | Ligne | Classes |
|---|---|---|
| Grilles | 542 | `.grid-2 .grid-3 .grid-4` |
| Cards | 551 | `.card .card-colored` |
| Modificateurs de slides | 565 | `.slide--cream --navy --hero --s01…s05` `.slide-rule--*` `.toc-number--*` `.pipeline-box--*` `.level-header--*` `.arm-percent--*` `.s2-double-card--*` |
| AI slides | 622 | `.ai-lead .ai-grid-2 .ai-badge-card .ai-callout .ai-step-*` |
| Clinical | 782 | `.clinical-grid .clinical-panel .clinical-panel--*` |
| Biais | 851 | `.bias-intro .bias-table .bias-callout` |
| History quotes | 906 | `.history-quotes .history-quote .history-quote-prosper --fuma` |
| s2 (section 02) | 943 | `.s2-card .s2-kicker .s2-chip .s2-figure .s2-legend .s2-legend-dot--* .s2-compare .s2-double .s2-clinical-band` |
| Footer | 1092 | `.slide-footer .slide-footer-meta .slide-footer-sources` |
| TOC | 1148 | `.toc-row .toc-number .toc-title .toc-desc` |
| Formule | 1191 | `.formula` |
| Barres de progression | 1206 | `.progress-bar .progress-label .progress-track .progress-fill` |
| Tableau | 1251 | `table th td .hi .pharma-*` |
| Arm-card | 1334 | `.arm-card .arm-percent .arm-body .arm-title .arm-desc` |
| Callout | 1365 | `.callout` |
| Level-card | 1378 | `.level-card .level-header .level-body` |
| Conclusion | 1386 | `.conclusion-item .conclusion-dot` |

## index.html — Carte des slides

| idx | Titre (commentaire HTML) | l. HTML | data-section | data-animate | Classe slide |
|---|---|---|---|---|---|
| 0 | TITRE HERO | 38 | 0 | — | `slide--hero` |
| 1 | SOMMAIRE | 118 | 0 | — | `slide--cream` |
| 2 | INTRO S01 — L'ANGLE MORT | 169 | 1 | — | `slide--s01` |
| 3 | BIAIS STRUCTUREL MONDIAL | 299 | 1 | — | `slide--cream` |
| 4 | LE MUR CLINIQUE | 377 | 1 | — | `slide--cream` |
| 5 | PHARMACOGÉNÉTIQUE | 432 | 1 | — | `slide--cream` |
| 6 | IA : GARBAGE IN, GARBAGE OUT | 524 | 1 | — | `slide--cream` |
| 7 | COMMENT LE PROJET CORRIGE LE BIAIS IA | 590 | 1 | — | `slide--cream` |
| 8 | INTRO S02 — SINGULARITÉ RÉUNIONNAISE | 631 | 2 | — | `slide--s02` |
| 9 | HISTOIRE DU PEUPLEMENT | 740 | 2 | — | `slide--cream` |
| 10 | DU PEUPLEMENT AU MÉTISSAGE | 835 | 2 | — | `slide--cream` |
| 11 | POPULATION HOMOGÈNE VS LA RÉUNION | 922 | 2 | — | `slide--cream` |
| 12 | EFFET FONDATEUR | 1015 | 2 | — | `slide--cream` |
| 13 | DOUBLE SINGULARITÉ | 1093 | 2 | — | `slide--cream` |
| 14 | INTRO S03 — DESIGN | 1125 | 3 | — | `slide--s03` |
| 15 | LE PIPELINE D'OPTIMISATION | 1146 | 3 | `pipeline` | `slide--cream` |
| 16 | TROIS NIVEAUX DE SINGULARITÉ | 1219 | 3 | — | `slide--cream` |
| 17 | INTRO S04 — ALGORITHME | 1381 | 4 | — | `slide--s04` |
| 18 | LE PROBLÈME D'OPTIMISATION | 1400 | 4 | — | `slide--cream` |
| 19 | TROIS VARIABLES GÉNOMIQUES | 1440 | 4 | — | `slide--cream` |
| 20 | LE SCORE DE DIVERSITÉ S_div | 1486 | 4 | `score` | `slide--cream` |
| 21 | PARENTÉ ET QUALITÉ ADN | 1507 | 4 | — | `slide--cream` |
| 22 | LES 4 BRAS DE SÉLECTION | 1565 | 4 | — | `slide--cream` |
| 23 | ZOOM : EFFET FONDATEUR / ROH / IBD | 1611 | 4 | `roh` | `slide--cream` |
| 24 | EXEMPLE CONCRET : CALCUL DU SCORE | 1714 | 4 | `radar` | `slide--cream` |
| 25 | CE QUI REND LA MÉTHODE DÉFENDABLE | 1784 | 4 | — | `slide--cream` |
| 26 | INTRO S05 — WGS | 1828 | 5 | — | `slide--s05` |
| 27 | IMPACTS ATTENDUS DU RÉFÉRENTIEL | 1847 | 5 | — | `slide--cream` |
| 28 | CONCLUSION | 1888 | 5 | — | `slide--navy` |

### Navigation pills → slide d'entrée de section

| Pill | data-target-slide |
|---|---|
| Accueil | 0 |
| 01 · Angle mort | 2 |
| 02 · Singularité | 8 |
| 03 · Design | 14 |
| 04 · Algorithme | 17 |
| 05 · WGS | 26 |

## IDs DOM utilisés par app.js

| ID | Rôle |
|---|---|
| `#deck` | Conteneur des slides (translateX) |
| `#bp` / `#bn` | Boutons Préc. / Suiv. |
| `#ctr` | Compteur "N / 29" (aria-live) |
| `#pf` | Barre de progression (width %) |
| `#admix-bg` | Conteneur des barres admixture (injecté par data/admixture.js) |
| `#pipeFlow` | Animation pipeline (slide 15, animate:pipeline) |
| `#scoreBarChart` | Canvas Chart.js barres (slide 20, animate:score) |
| `#radarChart` | Canvas Chart.js radar (slide 24, animate:radar) |
| `#rohDiagram` | Diagramme ROH (slide 23, animate:roh) |

## Conventions de nommage CSS

| Famille | Préfixe | Exemples |
|---|---|---|
| Hero | `hero-` | `.hero-content .hero-title .hero-authors` |
| Section intro | `section-` | `.section-slide .section-number` |
| Admixture | `admix-` / `adm-` | `.admix-wrap .adm-legend-dot--*` |
| Angle mort | `bias-` / `ai-` / `clinical-` | `.bias-table .ai-callout .clinical-panel` |
| Singularité (s02) | `s2-` | `.s2-card .s2-legend-dot--*` |
| Pipeline | `pipeline-` | `.pipeline-box .pipeline-arrow` |
| Chromosomes ROH | `chromosome-` | `.chromosome-row .chromosome-segment` |
| Formule | `formula` | (unique) |
| Pharmacogénétique | `pharma-` | `.pharma-table .pharma-highlight` |
| Modificateurs | `--couleur` | `.slide-rule--teal .arm-percent--blue` |

## Règle de mise à jour

> **Après toute modification qui change l'un des éléments ci-dessous, mettre à jour
> la section correspondante de ce fichier dans le même commit :**
>
> - Ajout / suppression / déplacement d'une slide → tableau "Carte des slides"
> - Ajout d'une classe CSS → sous-index section 9 ou ligne du tableau sections
> - Déplacement d'une section CSS → tableau sections (numéro + ligne)
> - Nouvel ID DOM utilisé par JS → tableau IDs DOM
> - Modification de la cible d'une pill → tableau pills

Les numéros de lignes sont indicatifs (±5 lignes tolérées) ; seul l'ordre et le contenu comptent.
