# Génome Réunion

Présentation HTML/CSS/JS statique du projet de référentiel génomique réunionnais.

Le deck est composé de **41 slides** (index 0–40, dont 2 résumés optionnels pour la section S04), sans build tool et sans dépendance CDN à l’exécution.
**Mode adaptatif** : basculez entre "Expert" (tous les détails) et "Résumé" (synthèse) pour la section Algorithme via le bouton `Expert`/`Résumé` dans le sommaire (slide 2, ligne "04 · L’Algorithme de Sélection").
**Révision S04 (avril 2026)** : implémentation de 5 recommandations scientifiques + 75+ références bibliographiques intégrées en pied de page.

## Accès en ligne

Le site est publié via GitHub Pages :

[https://patrick-mun.github.io/genome_reunion/](https://patrick-mun.github.io/genome_reunion/)

## Structure du projet

```text
genome_reunion/
├── index.html                    # Source unique de vérité : toutes les 41 slides
├── presenter.html                # Mode présentation deux-écrans (slide + notes + preview)
├── css/
│   ├── main.css                  # Variables, reset, nav, deck, composants, responsive, burger menu, logo
│   └── slides/
│       ├── s00-hero.css          # Slide 0 — hero, admixture, auteurs
│       ├── s01-angle-mort.css    # Slides 2–8 — biais, IA, clinique, pharmacogénétique
│       ├── s02-singularite.css   # Slides 9–14 — histoire, peuplement, métissage, effet fondateur
│       ├── s03-design.css        # Slides 15–16 — pipeline, entonnoir d’optimisation
│       ├── s04-algorithme.css    # Slides 17–38 — S04 intro, résumés, comparative (NEW), fondations, algo détaillé, validation
│       └── s05-wgs.css           # Slides 39–40 — intro S05, impacts, conclusion
├── js/
│   ├── app.js                    # Navigation, accessibilité, animations, Chart.js, speaker mode
│   └── vendor/
│       └── chart.umd.js          # Chart.js 4.4.1 vendorisé localement
├── data/
│   └── admixture.js              # Animation admixture (slide 0)
├── AGENTS.md                     # Règles de contribution
├── CLAUDE.md                     # Index technique (slides, CSS, IDs, conventions)
├── README.md                     # Ce fichier
├── S04_BIBLIOGRAPHY_MAPPING.md   # Mapping détaillé des références S04
├── COHÉRENCE_S04_vs_METHODOLOGY.md # Analyse cohérence slides vs méthodologie
└── SECURITY.md                   # Politique de sécurité
```

## Architecture du deck

Le contenu est organisé en 6 blocs :

- **0–1** : accueil et sommaire
- **2–8** : angle mort de la médecine de précision
- **9–14** : singularité réunionnaise
- **15–16** : pipeline méthodologique
- **17–38** : algorithme de sélection et validation (détaillé, ou résumé via toggle)
  - Mode Expert (défaut) : 21 slides visibles (17, 21–38, dont 1 comparative 21, 20 détaillés 22–38)
  - Mode Résumé : 3 slides (17 intro + 18–19 synthèse), slides 21–38 masqués
- **39–40** : WGS, impacts, conclusion

## Architecture CSS

Le style est réparti en deux niveaux :

- `css/main.css` — variables de design (`:root`), reset, navigation, deck, typographie, composants génériques (`card`, `callout`, `formula`, `level-card`, etc.), responsive et accessibilité.
- `css/slides/s0X-*.css` — styles spécifiques à chaque section, chargés après `main.css` via `<link>` dans `<head>`.

## Architecture JS

`js/app.js` pilote :

- la navigation clavier / boutons / swipe
- le compteur de slides et la barre de progression
- la logique d’accessibilité (`aria-*`, focus sur les titres, gestion des slides inactives)
- les animations SVG séquentielles (pipeline, ROH)
- les graphiques Chart.js (barres score, radar)

`data/admixture.js` maintient une seule source de vérité pour l’animation de la slide d’ouverture.

## Navigation

| Action | Commande |
|---|---|
| Slide suivante / précédente | `→` / `←` ou `↓` / `↑` |
| Boutons | `Préc.` / `Suiv.` en haut à droite |
| Tactile | swipe gauche / droite |
| Section | pills de navigation en haut |
| Sommaire | lignes cliquables vers chaque bloc |
| Logo | clic sur "Génome Réunion" → retour à slide 0 |
| Burger menu (mobile) | clic sur ≡ (< 900px) pour section nav |

## Mode Présentation (deux-écrans)

Clic sur bouton **Présentation** en haut à droite ouvre `presenter.html` :

- **Panneau gauche** : slide actuelle en aperçu full-height
- **Panneau droit** : notes du speaker (36px) + preview de la slide suivante
- **Synchro** : communication bidirectionnelle via `postMessage`
- **Navigation** : clavier / boutons / pills synchronisés entre deux windows

Les notes sont prédéfinies pour chaque slide (index.html : `SLIDE_NOTES`)

## Lancer le projet en local

Site 100 % statique — ouvrir `index.html` directement dans un navigateur, ou lancer un serveur local :

```bash
cd genome_reunion
python3 -m http.server 8000
```

Puis ouvrir [http://localhost:8000/](http://localhost:8000/)

## Mettre à jour le dépôt local

```bash
cd genome_reunion
git pull origin main
```

## Modifier le contenu

| Besoin | Fichier |
|---|---|
| Texte, ordre, structure des slides | `index.html` |
| Variables de couleur, layout, composants globaux | `css/main.css` |
| Styles d’une section spécifique | `css/slides/s0X-*.css` |
| Navigation, accessibilité, animations, graphiques | `js/app.js` |
| Animation admixture (slide 0) | `data/admixture.js` |
| Index technique / carte des slides | `CLAUDE.md` |
| Règles de contribution | `AGENTS.md` |

## Responsive Design

Le deck s'adapte automatiquement :

| Écran | Breakpoint | Adaptations |
|---|---|---|
| Desktop | `> 900px` | Navigation pills visible, présentation button visible |
| Tablette | `601–900px` | Burger menu actif, présentation button caché |
| Mobile | `≤ 600px` | Burger menu, nav pills dans dropdown, présentation button caché, layout vertical |

**Burger Menu** : nav pills (section 0–5) dans dropdown à gauche, cream bg, dark text, séparateurs, 260px width

## Conventions importantes

- Garder `index.html` comme **source unique de vérité** pour le contenu du deck
- Conserver les slides **commentées par section** dans le HTML
- Ajouter tout nouveau style dans le fichier `css/slides/` de la section concernée
- Mettre à jour `CLAUDE.md` après toute modification qui change une slide, une classe CSS ou un ID DOM
- Ne pas modifier le fond scientifique sans validation
- Éviter les styles inline sauf nécessité locale de géométrie ou de démonstration visuelle
- Utiliser les breakpoints `900px` et `600px` pour la responsivité

## Documents de référence internes

- `AGENTS.md` — règles d’édition et de maintenabilité
- `CLAUDE.md` — carte technique complète du deck (slides, CSS, IDs DOM, conventions de nommage)
- `SECURITY.md` — politique de sécurité du dépôt
