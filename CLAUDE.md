# CLAUDE.md — Index du projet Génome Réunion

## Vue d'ensemble

Présentation HTML/CSS/JS statique — **42 slides** (0–41, dont 2 résumés S04 optionnels), zéro build tool, zéro CDN à l'exécution.
Fichiers sources : `index.html` (~195 KB), 7 fichiers CSS (3 280 lignes), 3 fichiers JS (665 lignes).
Système adaptatif : toggle Expert/Résumé pour la section S04 (Algorithme) — les 2 slides de résumé remplacent les 20 slides expert détaillées.
**Révision S04 (2026-04)** : implémentation de 5 recommandations scientifiques + 75+ références bibliographiques intégrées.
**Révision V3.5 (2026-05)** : intégration des pools témoins externes (1000G + EGA) pour ancrage PCA/ADMIXTURE — nouvelle slide 27 dual ADMIXTURE/PCA.
Règles de travail détaillées dans `AGENTS.md`.

## Fichiers principaux

| Fichier | Rôle |
|---|---|
| `index.html` | Toutes les 41 slides (source unique de vérité) : 39 principales + 2 résumés S04 adaptés |
| `presenter.html` | Mode présentation deux-écrans : slide actuelle (gauche) + notes + preview (droite), synchro par postMessage |
| `css/main.css` | Styles transversaux : variables de couleur, reset, nav fixe, deck, typo, grilles, composants génériques, responsive (900px / 600px / 380px), burger menu mobile, logo stylisé |
| `css/slides/s00-hero.css` | Slide 0 — hero, auteurs, animation admixture, légende ancêtrale |
| `css/slides/s01-angle-mort.css` | Slides 2–8 — biais IA, clinique, pharmacogénétique |
| `css/slides/s02-singularite.css` | Slides 9–14 — histoire, peuplement, métissage, effet fondateur, singularité |
| `css/slides/s03-design.css` | Slides 15–17 — pipeline SNP→WGS, entonnoir d'optimisation, mini-figures |
| `css/slides/s04-algorithme.css` | Slides 17–38 — intro, résumés, comparative (NEW), fondations, algorithme détaillé, ROH/IBD, score, phasage, recalibrage, validation |
| `css/slides/s05-wgs.css` | Slides 39–40 — intro S05, impacts, conclusion |
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
| `s03-design.css` | 15–16 | 183 | `.pipeline-* .design-* .funnel-*` | ✓ extrait |
| `s04-algorithme.css` | 17–39 | 1122 | `.algo-* .special-* .arm-* .arch-* .arch-flow* .phasage-* .comp-* .geo-bars-svg .chromosome-* .pools-*` | ✓ V3.5 révisé |
| `s05-wgs.css` | 40–41 | 96 | `.conclusion-* .impact-card-*` | ✓ extrait |
| **main.css** | — | **1112** | Voir section "CSS – main.css" |  ✓ structuré |

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
| Footer (Option 5) | 571 | `.slide-footer .slide-footer-meta .slide-footer-sources .slide-footer-source .slide-footer-citations` |
| Table des matières | 579 | `.toc-row .toc-number .toc-title .toc-desc` |
| Formule | 622 | `.formula .formula--score` |
| Barres de progression | 642 | `.progress-bar .progress-label .progress-track .progress-fill` |
| Tableau | 687 | `table th td .hi` |
| Callout | 696 | `.callout .callout--amber` |
| Layout modifier | 291 | `.inner--top` |
| Level-card | 709 | `.level-card .level-header .level-body` |

## index.html — Carte des slides

| Idx | Titre | L. HTML | Sect | Anim | Classe | Notes |
|---|---|---|---|---|---|---|
| 0 | TITRE HERO | 100 | 0 | — | `slide--hero` | Auteurs, animation admixture |
| 1 | Plan de la présentation | 180 | 0 | — | `slide--cream` | Sommaire, TOC, toggle S04 |
| 2 | INTRO S01 — L'ANGLE MORT | 234 | 1 | — | `slide--s01` | Biais structurel, IA, clinique |
| 3–7 | Biais (5 slides) | 364–655 | 1 | — | `slide--cream` | IA, pharmacogénétique, correction projet |
| 8 | INTRO S02 — SINGULARITÉ | 696 | 2 | — | `slide--s02` | Histoire, peuplement, métissage |
| 9–13 | Singularité (5 slides) | 805–1158 | 2 | — | `slide--cream` | Fondateur, double singularité |
| 14 | INTRO S03 — DESIGN | 1190 | 3 | — | `slide--s03` | Pipeline, entonnoir |
| 15 | Pipeline d'Optimisation | 1327 | 3 | `pipeline` | `slide--cream` | Animation SVG |
| 16 | Entonnoir d'Optimisation | 1412 | 3 | — | `slide--cream` | SNP→WGS |
| 17 | INTRO S04 — ALGORITHME | 1480 | 4 | — | `slide--s04` | S04 expert ou résumé |
| **18–19** | **S04 RÉSUMÉ (2 slides)** | 1596–1634 | 4 | — | `s04-summary` | **Masqué Expert, visible Résumé** |
| 20 | Justification N=350 (V3 fondation) | 1674 | 4 | — | `slide--cream` | MAF, robustesse |
| 21 | Architecture 3 piliers | 1713 | 4 | — | `slide--cream` | Cohorte SNP, panel hybride, familles |
| 22 | Panel WGS hybride V3 | 1756 | 4 | — | `slide--cream` | Noyau 322 + découverte 28 |
| 23 | Deux niveaux, contrainte | 1793 | 4 | `archflow` | `slide--cream` | Géo + découverte (carousel mobile) |
| 24 | Représentativité géographique | 1871 | 4 | — | `slide--cream` | Stratification par secteur |
| 25 | Quatre dimensions S_div | 1931 | 4 | — | `slide--cream` | PCA, ADMIX, IBD, ROH |
| 26 | Composantes globales | 1975 | 4 | — | `slide--cream` | PCA + ADMIX score |
| **27** | **Pools témoins externes (V3.5)** | **2042** | 4 | — | `slide--cream` | **ADMIXTURE supervisée K=4 + PCA projetée, ancrage 1000G + EGA** |
| 28 | Composantes locales | 2231 | 4 | `roh` | `slide--cream` | IBD + ROH score, ROH diagram |
| 29 | Score de Diversité | 2310 | 4 | `score` | `slide--cream` | Chart.js barres |
| 30 | Anti-biais directionnel | 2329 | 4 | — | `slide--cream` | Quintile stratification |
| 31 | Sélection greedy stratifiée | 2383 | 4 | — | `slide--cream` + `inner--top` | 3 branches, robustesse |
| 32 | Exemple concret: calcul | 2448 | 4 | `radar` | `slide--cream` | Radar Chart.js pas-à-pas |
| 33 | Phasage réunionnais | 2494 | 4 | — | `slide--cream` + `inner--top` | 2500 SNP + 100 familles, pipeline visuel |
| 34 | Recalibrage fréquences | 2558 | 4 | — | `slide--cream` | Brute → pondérée → imputée |
| 35 | Avantages et limitations | 2600 | 4 | — | `slide--cream` + `inner--top` | Robustesse multi-ordre, callout |
| 36 | Validation 1000G | 2659 | 4 | — | `slide--cream` | Étape critique avant déploiement |
| 37 | Validation EPIGEN-Brasil | 2696 | 4 | — | `slide--cream` | Cohorte brésilienne admixée |
| 38 | INTRO S05 — WGS | 2734 | 5 | — | `slide--s05` | WGS, impacts, conclusion |
| 39 | Impacts attendus | 2845 | 5 | — | `slide--cream` | Référentiel réunionnais |
| 40 | CONCLUSION | 2886 | 5 | — | `slide--navy` | Fermeture |

### Navigation pills → slides d'entrée de section

| Pill | target-slide | Slide |
|---|---|---|
| Accueil | 0 | 0 — TITRE HERO |
| 01 · Angle mort | 2 | 2 — INTRO S01 |
| 02 · Singularité | 8 | 8 — INTRO S02 |
| 03 · Méthodo | 14 | 14 — INTRO S03 |
| 04 · Algorithme | 17 | 17 — INTRO S04 |
| 05 · WGS | 33 | 33 — INTRO S05 |

## IDs DOM utilisés par app.js

| ID | Rôle |
|---|---|
| `#deck` | Conteneur des 42 slides (transform translateX) |
| `#bp` / `#bn` | Boutons Préc. / Suiv. (gèrent navigation visible uniquement) |
| `#ctr` | Compteur "N / visible-count" (aria-live, ajusté dynamiquement) |
| `#s04-toggle-btn` | Bouton toggle Expert/Résumé pour section S04 (aria-pressed) |
| `#pf` | Barre de progression (width %) |
| `#admix-bg` | Conteneur 60 barres admixture (injecté par data/admixture.js, slide 0) |
| `#pipeFlow` | Animation pipeline (slide 15, data-animate="pipeline") |
| `#archFlow` | Carousel arch-flow (slide 23, data-animate="archflow", mobile uniquement) |
| `#scoreBarChart` | Canvas Chart.js barres S_div (slide 29, data-animate="score") |
| `#radarChart` | Canvas Chart.js radar (slide 32, data-animate="radar") |
| `#rohDiagram` | SVG diagramme ROH (slide 28, data-animate="roh") |

## Conventions de nommage CSS

| Famille | Préfixe | Exemples | Scope |
|---|---|---|---|
| Hero | `hero-` | `.hero-content .hero-title .hero-authors .hero-author-name` | s00-hero.css |
| Section intro | `section-` | `.section-slide .section-number .section-graphic .section-title` | main.css |
| Admixture | `admix-` / `adm-` | `.admix-wrap .adm-legend-dot--afrique .adm-legend-dot--inde` | s00-hero.css |
| Angle mort S01 | `bias-` / `ai-` / `clinical-` / `pharma-` | `.bias-table .ai-callout .clinical-panel .pharma-highlight` | s01-angle-mort.css |
| Singularité S02 | `history-*` / `s2-*` / `timeline-*` | `.history-quote .s2-card .timeline-step` | s02-singularite.css |
| Design S03 | `pipeline-*` / `design-*` / `funnel-*` | `.pipeline-box .design-pipeline .funnel-layout` | s03-design.css |
| Algorithme S04 | `algo-*` / `special-*` / `arm-*` / `arch-*` / `comp-*` / `chromosome-*` / `geo-bars-svg` / `pools-*` | `.algo-problem-box .arm-card .arch-split .comp-card .geo-bars-svg .pools-dual-layout .pools-admix-bar .pools-pca-chart-inner` | s04-algorithme.css |
| WGS S05 | `impact-*` / `conclusion-*` | `.impact-card--green .conclusion-list .conclusion-item` | s05-wgs.css |

## Récapitulatif des éléments DOM inline style

Il reste **25** `style=""` inline dans `index.html` (tous justifiés) :
- **4** : SVG display standard (`width:100%;display:block`) — élément racine SVG, responsive (slides 15, 26, 29)
- **9** : ROH chromosome segments (`left`/`width` positioning) — géométrie unique du diagramme (slide 27)
- **3** : Liste et code styling pour notes phasage/recalibrage (slides 30-31)
- **9** : Callouts colorés recalibrage (slide 33: 3 boxes + style inline pour formule)

Conservés volontairement pour des raisons de responsivité (SVG), géométrie locale unique (ROH), et callouts spécialisés (recalibrage).

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

## Mode Adaptatif S04 (Expert/Résumé)

**Objectif** : Permettre à la présentation de s'adapter au niveau d'expertise de l'audience.

| Aspect | Expert Mode (ON) | Résumé Mode (OFF) |
|---|---|---|
| Slides visibles S04 | 17, 20–38 (20 slides détaillés) | 17–19 (3 slides : intro + 2 résumés) |
| Autres slides | Slides 18–19 masqués, autres visibles | Slides 20–38 masqués, autres visibles |
| Compteur | Affiche le total des slides visibles | Affiche le total des slides visibles |
| Navigation | Saute les slides masqués automatiquement | Saute les slides masqués automatiquement |
| Bouton toggle | `S04: Expert` (aria-pressed="true") | `S04: Résumé` (aria-pressed="false") |

**Implémentation JS** (`js/app.js`) :
- `s04ExpertMode` : variable globale (true = Expert, false = Résumé), pas de localStorage
- `S04_SUMMARY_START=18, S04_SUMMARY_END=19` : slides résumé (Algorithme vue d'ensemble + Validation)
- `S04_DETAILED_START=20, S04_DETAILED_END=38` : slides expert détaillés (comparative + fondations + pools témoins V3.5 + validation)
- `updateSlideVisibility()` : applique `display:none` sur les slides cachés
- `getVisibleSlides()` : retourne indices visibles selon le mode courant
- Bouton `#s04-toggle-btn` : bascule le mode et redessine le deck

## Systèmes d'animation

| Système | Slides | Implémentation | Durée |
|---|---|---|---|
| **Admixture** | 0 | CSS animation loop, 60 barres translateY(-50%) | 24s infinite |
| **Pipeline** | 15 | JS .shown (opacity + transform), app.initDeck()/animatePipeline() | ~2.5s |
| **Archflow** | 24 | Carousel mobile, initArchFlowCarousel() | interactive |
| **ROH diagram** | 28 | JS .roh-visible transition, animateROH() | ~1.3s |
| **Score chart** | 29 | Chart.js bar chart, initScoreChart() | instant |
| **Radar chart** | 32 | Chart.js radar, initRadarChart() | instant |

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
| **CSS Cleanup** | Nettoyage complet : 83→13 inline styles (-84%), 9 s04 summary slides repositionnées, classes utilitaires responsives |
| **Classe .toc-row--with-button** | Dédiée au toggle Expert/Résumé S04 en slide 2, élimine redéfinition globale de `.toc-row` |
| **Texte TOC S04 actualisé** | "Comment choisir les individus qui maximisent l'information génétique" (description plus pertinente) |
| **S04 Méthodologie V3** | 5 nouvelles slides fondation : Justification N=350, Architecture 3 piliers, Panel hybride V3, Phasage, Recalibrage |
| **Classe .inner--top** | `justify-content: flex-start` pour slides denses (29, 32, 34) évite que titre soit coupé par overflow |
| **Callout --amber** | Variante `.callout--amber` pour distinctions critiques (border-left amber au lieu de teal) |
| **Classe .algo-card--top-navy** | Nouvelle variante de couleur pour cards S04 (Garde-fous éthiques, slide 32) |
| **Pipeline phasage V3** | Slide 32 redessinée : layout 3-col (cards + visual pipeline) + callout amber, élimine monospace ASCII |
| **Classes .phasage-flow-*** | `.phasage-flow` `.phasage-flow-box--navy/.blue/.teal` `.phasage-flow-tag` pour pipeline visuel |
| **Archflow carousel** | Nouveau système pour slides larges (slide 23) : carousel items avec dots navigation, mobile-friendly |
| **Slide 30 + 32 + 34** | Appliqué `.inner--top` pour éviter titles cachés sur slides denses (greedy, phasage, avantages) |
| **S04 Révision (2026-04)** | ✅ 5 recommandations implémentées : (1) slide 21 comparative 6 stratégies, (2) clarifier ADMIX_rarity (slide 28), (3) quantifier robustesse multi-ordre (slide 32), (4) énumérer 6 stratégies (slides 18-19), (5) effectif observé (slide 35). ✅ 75+ références bibliographiques intégrées en pied de page |
| **Footer Redesign (2026-04)** | ✅ Option 5 — Design Mixte Moderne : barre d'accent colorée (couleur de section), breadcrumb "Génome Réunion · <#>", badge de numéro (droite), section références avec icône 📚. CSS Grid 2×3 + pseudo-éléments ::before/::after. Support dual : simple (2 captions) + citations (via slide-footer-meta wrapper). Responsive clamp() typography. |
| **Total slides** | Augmenté de 40 → **41 slides** (1 nouvelle comparative S04) + 2 résumés optionnels = deck complet V3 révisé |
| **S04 Pools témoins V3.5 (2026-05)** | ✅ Nouvelle slide 27 « Pools témoins externes — ancrer PCA et ADMIXTURE » : layout dual ADMIXTURE supervisée K=4 (gauche, 5 individus admixés + 1 référence africaine, mise en évidence Ind. A) + PCA projetée (droite, 4 clusters d'ascendance, individu A pointé). Aligne la présentation sur METHODOLOGY_selection_V3_5.md (catalogue 1000G + EGA : MGUA Madagascar, MAGE, GenomeAsia, Angola/Mozambique). Classes `.pools-dual-layout .pools-pane .pools-admix-* .pools-pca-*` dans `s04-algorithme.css`. |
| **Total slides** | Augmenté de 41 → **42 slides** (1 nouvelle pools témoins S04) + 2 résumés optionnels = deck complet V3.5 |

## Règle de mise à jour

> **Après toute modification qui change l'un des éléments ci-dessous, mettre à jour
> la section correspondante de ce fichier ET du git commit :**
>
> - Modification du nombre de slides → "**41 slides**" en vue d'ensemble + tableau "Carte des slides"
> - Ajout / suppression / déplacement d'une slide → tableau "Carte des slides"
> - Ajout d'une classe CSS → tableau "Fichiers slides" (colonne classes clés)
> - Modification de styles existants → indiquer le fichier affecté et la plage de lignes
> - Nouvel ID DOM utilisé par JS → tableau "IDs DOM utilisés par app.js"
> - Modification de la cible d'une pill → tableau "Navigation pills"

Les numéros de lignes sont indicatifs (±10 lignes tolérées après refactoring) ; seul l'ordre et le contenu comptent.
