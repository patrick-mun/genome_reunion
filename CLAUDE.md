# CLAUDE.md — Index du projet Génome Réunion
<!-- Mettre à jour ce fichier après toute modification qui change une ligne de référence,
     ajoute une slide, crée une classe CSS ou modifie la structure des fichiers. -->

## Vue d'ensemble

Présentation HTML/CSS/JS statique — 30 slides, zéro build tool, zéro CDN à l'exécution.
Règles de travail détaillées dans `AGENTS.md`.

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | Toutes les slides (source unique de vérité) |
| `css/main.css` | Styles transversaux (variables, reset, nav, deck, typo, composants génériques, responsive) |
| `css/slides/s00-hero.css` | Slide 0 — hero layout, auteurs, pills, animation admixture |
| `js/app.js` | Navigation, accessibilité du deck, Chart.js, animations SVG |
| `data/admixture.js` | Données + builder DOM du fond admixture (slide 0) |
| `js/vendor/chart.umd.js` | Chart.js 4.4.1 vendorisé (pas de CDN) |
| `AGENTS.md` | Règles de travail (contenu, commits, CSS) |

## CSS — Fichiers slides (css/slides/)

| Fichier | Slides | Classes clés | État |
|---|---|---|---|
| `s00-hero.css` | 0 | `.hero-* .accent-bar .admix-* .adm-legend-*` | ✓ extrait |
| `s01-angle-mort.css` | 2–7 | `.bias-* .ai-* .clinical-* .pharma-*` | ✓ extrait |
| `s02-singularite.css` | 8–13 | `.s2-* .history-quote* .timeline-*` | ✓ extrait |
| `s03-design.css` | 14–16 | `.design-* .pipeline-* .funnel-*` | ✓ extrait |
| `s04-algorithme.css` | 17–26 | `.algo-* .special-* .arm-card* .arm-percent--* .arch-* .comp-* .geo-bars-svg .chromosome-* .chart-wrapper* #radarChart` | ✓ extrait |
| `s05-wgs.css` | 27–29 | `.impact-card* .conclusion-*` | ✓ extrait |

## CSS — Sections (main.css)

| # | Titre | Ligne | Classes clés |
|---|---|---|---|
| 1 | Variables de design | 34 | `:root` — `--navy --teal --cream --coral --amber --purple --blue --green` |
| 2 | Reset & base | 73 | `* html body` |
| 3 | Navigation fixe | 92 | `#nav #nav-logo #nav-center #nav-right .sec-pill .nbtn #ctr` |
| 4 | Barre de progression | 189 | `#prog #pf` |
| 5 | Deck de slides | 210 | `#deck .slide .inner` + delays `nth-child(1-7, n+8)` |
| 6 | Typographie | 272 | `.slide-title .slide-rule .text-body .caption` |
| 7 | Intro de section | 323 | `.section-slide .section-number .section-tag .section-title .section-subtitle .section-graphic` |
| 8 | Composants | 447 | Voir sous-index ci-dessous |
| 9 | Responsive | 727 | `@media 900px / 600px / 380px` |
| 10 | Hauteurs min. fluides | 775 | `.grid-* .card .level-card` min-height |
| 11 | Accessibilité (motion) | 789 | `@media (prefers-reduced-motion: reduce)` |

### Sous-index section 8 — Composants (main.css)

| Groupe | Ligne | Classes |
|---|---|---|
| Grilles | 451 | `.grid-2 .grid-3 .grid-4` |
| Cards | 459 | `.card .card-colored` |
| Modificateurs de slides | 484 | `.slide--cream --navy --hero --s01…s05` `.slide-rule--*` `.toc-number--*` `.level-header--*` |
| Footer | 523 | `.slide-footer .slide-footer-meta .slide-footer-sources` |
| TOC | 579 | `.toc-row .toc-number .toc-title .toc-desc` |
| Formule | 622 | `.formula .formula--score` |
| Barres de progression | 642 | `.progress-bar .progress-label .progress-track .progress-fill` |
| Tableau | 687 | `table th td .hi` |
| Callout | 696 | `.callout` |
| Level-card | 709 | `.level-card .level-header .level-body` |

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
| 14 | INTRO S03 — PIPELINE MÉTHODOLOGIQUE | 1128 | 3 | — | `slide--s03` |
| 15 | LE PIPELINE D'OPTIMISATION | 1146 | 3 | `pipeline` | `slide--cream` |
| 16 | L'ENTONNOIR D'OPTIMISATION | 1233 | 3 | — | `slide--cream` |
| 17 | INTRO S04 — ALGORITHME | 1298 | 4 | — | `slide--s04` |
| 18 | TROIS NIVEAUX DE SINGULARITÉ | 1316 | 4 | — | `slide--cream` |
| 19 | LE PROBLÈME D'OPTIMISATION | 1455 | 4 | — | `slide--cream` |
| 20 | TROIS VARIABLES GÉNOMIQUES | 1495 | 4 | — | `slide--cream` |
| 21 | LE SCORE DE DIVERSITÉ S_div | 1540 | 4 | `score` | `slide--cream` |
| 22 | PARENTÉ ET QUALITÉ ADN | 1561 | 4 | — | `slide--cream` |
| 23 | LES 4 BRAS DE SÉLECTION | 1617 | 4 | — | `slide--cream` |
| 24 | ZOOM : EFFET FONDATEUR / ROH / IBD | 1663 | 4 | `roh` | `slide--cream` |
| 25 | EXEMPLE CONCRET : CALCUL DU SCORE | 1766 | 4 | `radar` | `slide--cream` |
| 26 | CE QUI REND LA MÉTHODE DÉFENDABLE | 1839 | 4 | — | `slide--cream` |
| 27 | INTRO S05 — WGS | 1884 | 5 | — | `slide--s05` |
| 28 | IMPACTS ATTENDUS DU RÉFÉRENTIEL | 1902 | 5 | — | `slide--cream` |
| 29 | CONCLUSION | 1943 | 5 | — | `slide--navy` |

### Navigation pills → slide d'entrée de section

| Pill | data-target-slide |
|---|---|
| Accueil | 0 |
| 01 · Angle mort | 2 |
| 02 · Singularité | 8 |
| 03 · Méthodo | 14 |
| 04 · Algorithme | 17 |
| 05 · WGS | 27 |

## IDs DOM utilisés par app.js

| ID | Rôle |
|---|---|
| `#deck` | Conteneur des slides (translateX) |
| `#bp` / `#bn` | Boutons Préc. / Suiv. |
| `#ctr` | Compteur "N / 30" (aria-live) |
| `#pf` | Barre de progression (width %) |
| `#admix-bg` | Conteneur des barres admixture (injecté par data/admixture.js) |
| `#pipeFlow` | Animation pipeline (slide 15, animate:pipeline) |
| `#scoreBarChart` | Canvas Chart.js barres (slide 21, animate:score) |
| `#radarChart` | Canvas Chart.js radar (slide 25, animate:radar) |
| `#rohDiagram` | Diagramme ROH (slide 24, animate:roh) |

## Inline styles résiduels

Il ne reste plus que **9** `style=""` inline dans `index.html`, tous sur la slide 25.
Ils servent uniquement à placer les segments du schéma ROH (`left` / `width`), donc
ils sont conservés volontairement comme géométrie locale d'un dessin unique.

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
