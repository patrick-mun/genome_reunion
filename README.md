# Génome Réunion

Présentation HTML/CSS/JS statique du projet de référentiel génomique réunionnais.

Le deck est actuellement composé de **29 slides**, sans build tool et sans dépendance CDN à l'exécution.

## Accès en ligne

Le site est publié via GitHub Pages :

[https://patrick-mun.github.io/genome_reunion/](https://patrick-mun.github.io/genome_reunion/)

## Structure du projet

```text
genome_reunion/
├── index.html              # Source unique de vérité : toutes les slides
├── css/
│   └── main.css            # Variables, layout, composants, responsive, accessibilité
├── js/
│   ├── app.js              # Navigation, compteur, progression, animations, Chart.js
│   └── vendor/
│       └── chart.umd.js    # Chart.js vendorisé localement
├── data/
│   └── admixture.js        # Injection DOM du fond admixture de la slide hero
├── AGENTS.md               # Règles de travail pour contribuer au dépôt
├── CLAUDE.md               # Index structuré du projet (slides, CSS, IDs DOM)
└── SECURITY.md             # Politique de sécurité
```

## Architecture

- `index.html` contient l'ensemble des **29 slides**.
- `css/main.css` centralise le système visuel et les composants.
- `js/app.js` pilote :
  - la navigation clavier / boutons / swipe
  - le compteur de slides
  - la barre de progression
  - les animations SVG et graphiques
- `data/admixture.js` garde une seule source de vérité pour l'animation de la slide d'ouverture.

## Navigation

- `←` `→` ou `↑` `↓` : navigation clavier
- `Préc.` / `Suiv.` : boutons en haut à droite
- swipe gauche / droite : navigation tactile
- boutons de section et sommaire : navigation par `data-target-slide`

## Lancer le projet en local

Comme il s'agit d'un site statique, on peut ouvrir directement `index.html` dans un navigateur.

Pour un test plus propre, on peut aussi lancer un petit serveur local :

```bash
cd /Users/patrickmunier/Library/CloudStorage/OneDrive-Personnel/genome_reunion/genome_reunion
python3 -m http.server 8000
```

Puis ouvrir :

[http://localhost:8000/](http://localhost:8000/)

## Mettre à jour le dépôt local

```bash
cd /Users/patrickmunier/Library/CloudStorage/OneDrive-Personnel/genome_reunion/genome_reunion
git pull origin main
```

## Modifier le contenu

| Besoin | Fichier principal |
|---|---|
| Texte, ordre, structure des slides | `index.html` |
| Couleurs, layout, composants, responsive | `css/main.css` |
| Navigation, progression, animations, graphiques | `js/app.js` |
| Animation admixture (slide 1) | `data/admixture.js` |
| Index du projet / carte des slides | `CLAUDE.md` |
| Règles de contribution | `AGENTS.md` |

## Conventions importantes

- privilégier les **classes CSS** aux styles inline
- garder `index.html` lisible et bien commenté par slide
- ne pas modifier le fond scientifique sans validation
- mettre à jour `CLAUDE.md` après toute modification qui change :
  - une slide
  - une classe CSS
  - un ID DOM
  - une cible de navigation

## Références de design et de contenu

Le projet suit deux documents de travail internes :

- `AGENTS.md` pour les règles d'édition et de maintenabilité
- `CLAUDE.md` pour la carte technique du deck
