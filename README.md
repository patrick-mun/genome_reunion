# Génome Réunion

Présentation interactive de 25 slides sur le projet de référentiel génomique réunionnais.
Accessible partout via GitHub Pages.

## 🌐 Accès en ligne

→ **https://[ton-username].github.io/genome-reunion/**

## 📁 Structure du projet

```
genome-reunion/
├── index.html          # Structure HTML des 25 slides + commentaires par slide
├── css/
│   └── main.css        # Tout le CSS : variables, layout, composants, responsive
│                       # (13 sections commentées — voir entête du fichier)
├── js/
│   └── app.js          # Navigation, graphiques Chart.js, animations SVG
│                       # (goToSlide, initScoreChart, initRadarChart,
│                       #  animatePipeline, animateROH et gestion clavier/swipe)
└── data/
    └── admixture.js    # Données de l'animation admixture (slide 1)
                        # 60 lignes × composition démographique réunionnaise réelle
```

## 🚀 Déploiement GitHub Pages

```bash
# 1. Initialiser le repo local et le connecter à GitHub
git init
git add .
git commit -m "init: présentation Génome Réunion"
git branch -M main
git remote add origin https://github.com/[username]/genome-reunion.git
git push -u origin main

# 2. Activer GitHub Pages
#    Settings → Pages → Source : main / (root) → Save

# 3. Site disponible en ~1 minute à l'URL ci-dessus
```

## ✏️ Modifier le contenu

| Besoin | Fichier à modifier |
|---|---|
| Texte ou structure d'une slide | `index.html` |
| Couleurs, typographie, thème | `css/main.css` — section 1 (variables `:root`) |
| Layout navigation ou deck | `css/main.css` — sections 3, 4, 5 |
| Style d'un composant (card, formula…) | `css/main.css` — section 9 |
| Responsive | `css/main.css` — section 12 |
| Ajouter / modifier un graphique Chart.js | `js/app.js` |
| Animation admixture (slide 1) | `data/admixture.js` |

## 🎮 Navigation

- **Clavier** : `←` `→` ou `↑` `↓`
- **Mobile** : swipe gauche / droite
- **Boutons** : Préc. / Suiv. en haut à droite
- **Sections** : boutons de section et sommaire via attributs `data-target-slide`

## 🔬 Composition démographique réunionnaise

L'animation admixture de la slide 1 reflète la réalité historique et génétique.
Le conteneur HTML de la slide 1 reste vide par design ; les lignes sont injectées
dynamiquement depuis `data/admixture.js` pour garder une seule source de vérité.

| Composante | % estimé | Couleur CSS |
|---|---|---|
| Afrique / Malgache (Cafres) | ~45% | `--adm-afro-malg` `#0D9488` teal |
| Inde du Sud (Malbars) | ~25% | `--adm-inde` `#E05A4B` coral |
| Européen (créoles blancs) | ~15% | `--adm-euro` `#0B1F3A` navy |
| Zarabe / Gujarati | ~8% | `--adm-zarabe` `#D97706` amber |
| Chinois | ~7% | `--adm-chinois` `#7C3AED` violet |

Sources : étude ADN mitochondrial 2005 (lignées maternelles) + données démographiques
historiques (engagisme 1848 : ~117 000 Indiens, ~50 000 Chinois et Indo-musulmans).
