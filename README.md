# Génome Réunion

Présentation interactive sur le projet de référentiel génomique réunionnais.
Accessible partout via GitHub Pages.

## 🌐 Accès en ligne

→ **https://[ton-username].github.io/genome-reunion/**

## 📁 Structure du projet

```
genome-reunion/
├── index.html              # Structure HTML des 25 slides
├── css/
│   ├── variables.css       # Tokens de design (couleurs, thème)
│   ├── layout.css          # Navigation, deck, slides, responsive
│   ├── components.css      # Cards, tableaux, grilles, formules
│   └── charts.css          # Pipeline, ROH, radar chart
├── js/
│   ├── navigation.js       # go(), clavier, swipe, barre de progression
│   └── charts.js           # Chart.js : donut, barres, radar + animations
└── data/
    └── admixture.js        # Animation admixture slide 1 (données démographiques)
```

## 🚀 Déploiement GitHub Pages

```bash
# 1. Créer le repo sur GitHub, puis :
git init
git add .
git commit -m "init: présentation Génome Réunion"
git branch -M main
git remote add origin https://github.com/[username]/genome-reunion.git
git push -u origin main

# 2. Sur GitHub : Settings → Pages → Source : main / root → Save
# 3. URL disponible en ~1 minute
```

## ✏️ Modifier le contenu

| Besoin | Fichier à modifier |
|---|---|
| Texte d'une slide | `index.html` |
| Couleurs / thème | `css/variables.css` |
| Mise en page | `css/layout.css` |
| Style d'un composant | `css/components.css` |
| Ajouter un graphique | `js/charts.js` |
| Animation admixture | `data/admixture.js` |

## 🎮 Navigation

- **Clavier** : `←` `→` ou `↑` `↓`
- **Mobile** : swipe gauche / droite
- **Boutons** : Préc. / Suiv. en haut à droite
- **Sections** : pills de navigation en haut au centre

## 🔬 Composition démographique réunionnaise

L'animation admixture de la slide 1 reflète la réalité historique et génétique :

| Composante | % | Couleur |
|---|---|---|
| Afrique / Malgache (Cafres) | ~45% | Teal `#0D9488` |
| Inde du Sud (Malbars) | ~25% | Coral `#E05A4B` |
| Européen (créoles blancs) | ~15% | Navy `#0B1F3A` |
| Zarabe / Gujarati | ~8% | Amber `#D97706` |
| Chinois | ~7% | Violet `#7C3AED` |
