# Génome Réunion

Présentation HTML/CSS/JS statique du projet de référentiel génomique réunionnais.

Le deck est composé de **29 slides**, sans build tool et sans dépendance CDN à l'exécution.

## Accès en ligne

Le site est publié via GitHub Pages :

[https://patrick-mun.github.io/genome_reunion/](https://patrick-mun.github.io/genome_reunion/)

## Structure du projet

```text
genome_reunion/
├── index.html                    # Source unique de vérité : toutes les slides
├── css/
│   ├── main.css                  # Variables, reset, nav, composants génériques, responsive
│   └── slides/
│       ├── s00-hero.css          # Slide 0 — hero, admixture, auteurs
│       ├── s01-angle-mort.css    # Slides 2–7 — biais, IA, clinique, pharma
│       ├── s02-singularite.css   # Slides 8–13 — singularité, timeline, comparaison
│       ├── s03-design.css        # Slides 14–16 — pipeline, mini-figures
│       ├── s04-algorithme.css    # Slides 17–25 — algo, bras, ROH, radar
│       └── s05-wgs.css           # Slides 26–28 — impacts, conclusion
├── js/
│   ├── app.js                    # Navigation, animations, Chart.js
│   └── vendor/
│       └── chart.umd.js          # Chart.js vendorisé localement
├── data/
│   └── admixture.js              # Injection DOM du fond admixture (slide hero)
├── AGENTS.md                     # Règles de travail pour contribuer au dépôt
├── CLAUDE.md                     # Index structuré du projet (slides, CSS, IDs DOM)
└── SECURITY.md                   # Politique de sécurité
```

## Architecture CSS

Le style est réparti en deux niveaux :

- `css/main.css` — variables de design (`:root`), reset, navigation, deck, typographie, composants génériques (`card`, `callout`, `formula`, `level-card`, `progress-bar`), responsive et accessibilité.
- `css/slides/s0X-*.css` — styles spécifiques à chaque section, chargés après `main.css` via `<link>` dans `<head>`.

## Architecture JS

`js/app.js` pilote :
- la navigation clavier / boutons / swipe
- le compteur de slides et la barre de progression
- les animations SVG séquentielles (pipeline, ROH, score)
- les graphiques Chart.js (barres score, radar)

`data/admixture.js` maintient une seule source de vérité pour l'animation de la slide d'ouverture.

## Navigation

| Action | Commande |
|---|---|
| Slide suivante / précédente | `→` / `←` ou `↓` / `↑` |
| Boutons | `Préc.` / `Suiv.` en haut à droite |
| Tactile | swipe gauche / droite |
| Section | pills de navigation en haut |

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
| Styles d'une section spécifique | `css/slides/s0X-*.css` |
| Navigation, animations, graphiques | `js/app.js` |
| Animation admixture (slide 0) | `data/admixture.js` |
| Index du projet / carte des slides | `CLAUDE.md` |
| Règles de contribution | `AGENTS.md` |

## Conventions importantes

- Utiliser des **classes CSS** — aucun style inline sauf les coordonnées géométriques des segments ROH (slide 23)
- Garder `index.html` commenté par slide
- Ajouter tout nouveau style dans le fichier `css/slides/` de la section concernée
- Mettre à jour `CLAUDE.md` après toute modification qui change une slide, une classe CSS ou un ID DOM
- Ne pas modifier le fond scientifique sans validation

## Documents de référence internes

- `AGENTS.md` — règles d'édition et de maintenabilité
- `CLAUDE.md` — carte technique complète du deck (slides, CSS, IDs DOM, conventions de nommage)
