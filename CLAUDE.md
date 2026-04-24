# CLAUDE.md — Index du projet Génome Réunion

## Vue d'ensemble

Présentation HTML/CSS/JS statique — **33 slides** (0–32), zéro build tool, zéro CDN à l'exécution.
Fichiers sources : `index.html` (~135 KB), 7 fichiers CSS (2 630 lignes), 3 fichiers JS (465 lignes).
Règles de travail détaillées dans `AGENTS.md`.

## Fichiers principaux

| Fichier | Rôle |
|---|---|
| `index.html` | Toutes les 33 slides (source unique de vérité) |
| `presenter.html` | Mode présentation deux-écrans : slide actuelle (gauche) + notes + preview (droite), synchro par postMessage |
| `css/main.css` | Styles transversaux : variables de couleur, reset, nav fixe, deck, typo, grilles, composants génériques, responsive (900px / 600px / 380px), burger menu mobile, logo stylisé |
| `css/slides/s00-hero.css` | Slide 0 — hero, auteurs, animation admixture, légende ancêtrale |
| `css/slides/s01-angle-mort.css` | Slides 2–8 — biais IA, clinique, pharmacogénétique |
| `css/slides/s02-singularite.css` | Slides 9–14 — histoire, peuplement, métissage, effet fondateur, singularité |
| `css/slides/s03-design.css` | Slides 15–17 — pipeline SNP→WGS, entonnoir d'optimisation, mini-figures |
| `css/slides/s04-algorithme.css` | Slides 18–29 — algorithme de sélection, ROH/IBD, score, stratification, validation, 1000G, EPIGEN |
| `css/slides/s05-wgs.css` | Slides 30–32 — WGS, impacts, conclusion |
| `js/app.js` | Navigation, accessibilité, Chart.js (score + radar), animations SVG (pipeline, ROH), speaker mode, logo click handler |
| `data/admixture.js` | Données + générateur DOM pour animation admixture (slide 0 : 60 barres animées) |
| `js/vendor/chart.umd.js` | Chart.js 4.4.1 vendorisé (pas de CDN) |
| `AGENTS.md` | Règles de travail (contenu, commits, conventions CSS) |
| `CLAUDE.md` | Index technique du projet (ce fichier) |
| `README.md` | Guide utilisateur et architecture |

## CSS — Fichiers slides

| Fichier | Slides | Lignes | Classes clés | État |
|---|---|---|---|---|
| `s00-hero.css` | 0 | 219 | `.hero-* .accent-bar .admix-* .adm-legend-*` | ✓ extrait |
| `s01-angle-mort.css` | 2–8 | 330 | `.ai-* .clinical-* .bias-* .pharma-*` | ✓ extrait |
| `s02-singularite.css` | 9–14 | 360 | `.history-* .s2-* .timeline-*` | ✓ extrait |
| `s03-design.css` | 15–17 | 158 | `.pipeline-* .design-* .funnel-*` | ✓ extrait |
| `s04-algorithme.css` | 18–29 | 774 | `.algo-* .special-* .arm-* .arch-* .arch-flow* .comp-* .geo-bars-svg .chromosome-* .chart-wrapper* #radarChart` | ✓ refactorisé |
| `s05-wgs.css` | 30–32 | 96 | `.conclusion-* .impact-card-*` | ✓ extrait |
| **main.css** | — | **803** | Voir section "CSS – main.css" |  ✓ structuré |

## CSS — Sections principales (main.css)

| # | Titre | Ligne | Classes clés |
|---|---|---|---|
| 1 | Variables de design | 34 | `:root` — `--navy --teal --tealL --cream --coral --amber --purple --blue --green --orange --gray` |
| 2 | Reset & base | 73 | `* html body` |
| 3 | Navigation fixe | 92 | `#nav #nav-logo #nav-center #nav-right .sec-pill .nbtn #ctr` |
| 4 | Barre de progression | 189 | `#prog #pf` |
| 5 | Deck de slides | 210 | `#deck .slide .inner` + delays `nth-child(1-7, n+8)` |
| 6 | Typographie | 272 | `.slide-title .slide-rule .text-body .caption` |
| 7 | Intro de section | 323 | `.section-slide .section-number .section-tag .section-title .section-subtitle .section-graphic` |
| 8 | Composants | 447 | Voir sous-index ci-dessous |
| 9 | Responsive | 727 | `@media 900px / 600px / 380px` |
| 10 | Hauteurs min. fluides | 775 | `.grid-* .card .level-card` min-height |
| 11 | Accessibilité | 789 | `@media (prefers-reduced-motion: reduce)` |

### Sous-index section 8 — Composants (main.css)

| Groupe | Ligne | Classes |
|---|---|---|
| Grilles | 451 | `.grid-2 .grid-3 .grid-4` |
| Cards | 459 | `.card .card-colored` |
| Modificateurs de slides | 484 | `.slide--cream --navy --hero --s01…s05` `.slide-rule--*` `.toc-number--*` `.level-header--*` |
| Footer | 523 | `.slide-footer .slide-footer-meta .slide-footer-sources` |
| Table des matières | 579 | `.toc-row .toc-number .toc-title .toc-desc` |
| Formule | 622 | `.formula .formula--score` |
| Barres de progression | 642 | `.progress-bar .progress-label .progress-track .progress-fill` |
| Tableau | 687 | `table th td .hi` |
| Callout | 696 | `.callout` |
| Level-card | 709 | `.level-card .level-header .level-body` |

## index.html — Carte des slides

| Idx | Titre (commentaire HTML) | L. HTML | Section | Anim | Classe slide |
|---|---|---|---|---|---|
| 0 | TITRE HERO | 37 | 0 | — | `slide--hero` |
| 1 | SOMMAIRE | 118 | 0 | — | `slide--cream` |
| 2 | INTRO S01 — L'ANGLE MORT | 172 | 1 | — | `slide--s01` |
| 3 | BIAIS STRUCTUREL MONDIAL | 297 | 1 | — | `slide--cream` |
| 4 | LE MUR CLINIQUE | 378 | 1 | — | `slide--cream` |
| 5 | PHARMACOGÉNÉTIQUE | 433 | 1 | — | `slide--cream` |
| 6 | IA : GARBAGE IN, GARBAGE OUT | 525 | 1 | — | `slide--cream` |
| 7 | COMMENT LE PROJET CORRIGE LE BIAIS IA | 592 | 1 | — | `slide--cream` |
| 8 | INTRO S02 — SINGULARITÉ RÉUNIONNAISE | 634 | 2 | — | `slide--s02` |
| 9 | HISTOIRE DU PEUPLEMENT | 741 | 2 | — | `slide--cream` |
| 10 | DU PEUPLEMENT AU MÉTISSAGE | 837 | 2 | — | `slide--cream` |
| 11 | POPULATION HOMOGÈNE VS LA RÉUNION | 924 | 2 | — | `slide--cream` |
| 12 | EFFET FONDATEUR | 1017 | 2 | — | `slide--cream` |
| 13 | DOUBLE SINGULARITÉ | 1095 | 2 | — | `slide--cream` |
| 14 | INTRO S03 — DESIGN | 1128 | 3 | — | `slide--s03` |
| 15 | LE PIPELINE D'OPTIMISATION | 1146 | 3 | `pipeline` | `slide--cream` |
| 16 | L'ENTONNOIR D'OPTIMISATION | 1233 | 3 | — | `slide--cream` |
| 17 | INTRO S04 — ALGORITHME | 1302 | 4 | — | `slide--s04` |
| 18 | DEUX NIVEAUX, UNE CONTRAINTE PRINCIPALE | 1320 | 4 | — | `slide--cream` |
| 19 | STRATIFICATION GÉOGRAPHIQUE | 1410 | 4 | — | `slide--cream` |
| 20 | LES 4 COMPOSANTES DE S_div | 1467 | 4 | — | `slide--cream` |
| 21 | PCA_score + ADMIX_score | 1503 | 4 | — | `slide--cream` |
| 22 | IBD_score + ROH_score | 1560 | 4 | — | `slide--cream` |
| 23 | AGRÉGATION S_div | 1638 | 4 | — | `slide--cream` |
| 24 | STRATIFICATION QUINTILE | 1658 | 4 | — | `slide--cream` |
| 25 | ALGORITHME GREEDY STRATIFIÉ | 1709 | 4 | — | `slide--cream` |
| 26 | EXEMPLE CONCRET : CALCUL DU SCORE | 1763 | 4 | `radar` | `slide--cream` |
| 27 | AVANTAGES ET LIMITATIONS ACCEPTABLES | 1810 | 4 | — | `slide--cream` |
| 28 | VALIDATION 1000 GENOMES AVANT DÉPLOIEMENT | 1860 | 4 | — | `slide--cream` |
| 29 | VALIDATION COMPLÉMENTAIRE : EPIGEN-BRASIL | 1910 | 4 | — | `slide--cream` |
| 30 | INTRO S05 — WGS | 1950 | 5 | — | `slide--s05` |
| 31 | IMPACTS ATTENDUS DU RÉFÉRENTIEL | 1970 | 5 | — | `slide--cream` |
| 32 | CONCLUSION | 2010 | 5 | — | `slide--navy` |

### Navigation pills → slides d'entrée de section

| Pill | target-slide | Slide |
|---|---|---|
| Accueil | 0 | 0 — TITRE HERO |
| 01 · Angle mort | 2 | 2 — INTRO S01 |
| 02 · Singularité | 8 | 8 — INTRO S02 |
| 03 · Méthodo | 14 | 14 — INTRO S03 |
| 04 · Algorithme | 17 | 17 — INTRO S04 |
| 05 · WGS | 30 | 30 — INTRO S05 |

## IDs DOM utilisés par app.js

| ID | Rôle |
|---|---|
| `#deck` | Conteneur des 33 slides (transform translateX) |
| `#bp` / `#bn` | Boutons Préc. / Suiv. |
| `#ctr` | Compteur "N / 33" (aria-live) |
| `#pf` | Barre de progression (width %) |
| `#admix-bg` | Conteneur 60 barres admixture (injecté par data/admixture.js, slide 0) |
| `#pipeFlow` | Animation pipeline (slide 15, data-animate="pipeline") |
| `#scoreBarChart` | Canvas Chart.js barres S_div (slide 21, data-animate="score") |
| `#radarChart` | Canvas Chart.js radar (slide 26, data-animate="radar") |
| `#rohDiagram` | SVG diagramme ROH (slide 24, data-animate="roh") |

## Conventions de nommage CSS

| Famille | Préfixe | Exemples | Scope |
|---|---|---|---|
| Hero | `hero-` | `.hero-content .hero-title .hero-authors .hero-author-name` | s00-hero.css |
| Section intro | `section-` | `.section-slide .section-number .section-graphic .section-title` | main.css |
| Admixture | `admix-` / `adm-` | `.admix-wrap .adm-legend-dot--afrique .adm-legend-dot--inde` | s00-hero.css |
| Angle mort S01 | `bias-` / `ai-` / `clinical-` / `pharma-` | `.bias-table .ai-callout .clinical-panel .pharma-highlight` | s01-angle-mort.css |
| Singularité S02 | `history-*` / `s2-*` / `timeline-*` | `.history-quote .s2-card .timeline-step` | s02-singularite.css |
| Design S03 | `pipeline-*` / `design-*` / `funnel-*` | `.pipeline-box .design-pipeline .funnel-layout` | s03-design.css |
| Algorithme S04 | `algo-*` / `special-*` / `arm-*` / `arch-*` / `comp-*` / `chromosome-*` / `geo-bars-svg` | `.algo-problem-box .arm-card .arch-split .comp-card .geo-bars-svg` | s04-algorithme.css |
| WGS S05 | `impact-*` / `conclusion-*` | `.impact-card--green .conclusion-list .conclusion-item` | s05-wgs.css |

## Récapitulatif des éléments DOM inline style

Il reste **9** `style=""` inline dans `index.html`, tous sur la slide 26 (ROH diagram).
Ils servent uniquement à placer les segments du schéma ROH (`left` / `width`), donc
sont conservés volontairement comme géométrie locale d'un dessin unique.

## Palette de couleurs (variables CSS)

| Variable | Valeur | Usage |
|---|---|---|
| `--navy` | #0B1F3A | Fond principal, texte principal |
| `--teal` | #0D7377 | Accent primaire, S02 section |
| `--tealL` | #14B8A6 | Accent clair (hero, badges) |
| `--cream` | #F4F1EC | Fond slides neutres |
| `--coral` | #E05A4B | Accent S01 (biais) |
| `--amber` | #D97706 | Accent S04 (ROH, consanguinité) |
| `--purple` | #7C3AED | Accent S03 (design) |
| `--blue` | #0369A1 | Accent S04 (géo, PCA) |
| `--green` | #059669 | Accent S05 (WGS, réussite) |
| `--orange` | #EA580C | Accent S04 (IBD) |
| `--gray` | #6B7280 | Texte muted, disabled |

## Systèmes d'animation

| Système | Slides | Implémentation | Durée |
|---|---|---|---|
| **Admixture** | 0 | CSS animation loop, 60 barres translateY(-50%) | 24s infinite |
| **Pipeline** | 15 | JS .shown (opacity + transform), app.initDeck()/animatePipeline() | ~2.5s |
| **ROH diagram** | 24 | JS .roh-visible transition, animateROH() | ~1.3s |
| **Score chart** | 21 | Chart.js bar chart, initScoreChart() | instant |
| **Radar chart** | 26 | Chart.js radar, initRadarChart() | instant |

## Fonctionnalités récentes (2026-04)

| Fonctionnalité | Détail |
|---|---|
| **Mode Présentation** | Deux-écrans : `presenter.html` affiche slide gauche + notes/preview droite, synchro via postMessage |
| **Navigation Mobile** | Burger menu (< 900px) : nav pills à gauche, cream bg, dark text, séparateurs, 260px width |
| **Logo interactif** | Logo "Génome Réunion" cliquable → retour slide 0, style navy bg / white text, tab shape border-radius |
| **Corrections contenu** | Slide 5: "variant de signification inconnue" • Slide 10: "Colonisation / Esclavage" • Slide 14: "WGS (Whole Genome Sequencing)" |
| **Distribution labels** | Slide 24: labels "scores élevés" (gauche) et "scores bas" (droite) alignés avec méthodologie |
| **Notes presenter** | Notes font-size 36px, colonne 50/50 split (texte | next-slide preview) |
| **Emoji removal** | Présentation button : 📺 emoji retiré |

## Règle de mise à jour

> **Après toute modification qui change l'un des éléments ci-dessous, mettre à jour
> la section correspondante de ce fichier ET du git commit :**
>
> - Modification du nombre de slides → "**31 slides**" en vue d'ensemble + tableau "Carte des slides"
> - Ajout / suppression / déplacement d'une slide → tableau "Carte des slides"
> - Ajout d'une classe CSS → tableau "Fichiers slides" (colonne classes clés)
> - Modification de styles existants → indiquer le fichier affecté et la plage de lignes
> - Nouvel ID DOM utilisé par JS → tableau "IDs DOM utilisés par app.js"
> - Modification de la cible d'une pill → tableau "Navigation pills"

Les numéros de lignes sont indicatifs (±10 lignes tolérées après refactoring) ; seul l'ordre et le contenu comptent.
