# Regles de travail pour ce depot

Ce projet est une presentation HTML/CSS/JS statique. La priorite est la
maintenabilite du code, la lisibilite de `index.html`, et la coherence
visuelle entre les slides.

## Principes generaux

- Ne pas degrader la maintenabilite du depot pour accelerer une correction.
- Separer autant que possible le contenu, la structure et la presentation.
- Preferer des changements petits, lisibles et faciles a relire.
- Preserver le contenu scientifique sauf demande explicite.

## HTML

- Garder `index.html` correctement indente apres chaque modification.
- Une slide doit rester un bloc clairement identifiable.
- Ajouter des commentaires HTML seulement pour delimiter les slides ou les
  blocs importants.
- Eviter les conteneurs inutiles et les structures difficiles a relire.
- Avant de finir une tache, verifier que la hierarchie parent/enfant reste
  facile a comprendre.

## CSS

- Ne pas ajouter de CSS inline sauf exception tres justifiee.
- Si un style inline temporaire est ajoute pour debloquer une correction,
  le sortir vers `css/main.css` dans la meme session ou juste apres.
- Reutiliser les classes existantes avant d'en creer de nouvelles.
- Si un motif visuel revient au moins deux fois, creer une classe dediee.
- Regrouper les styles par composant ou par famille de slides.
- Nommer les classes de maniere explicite et coherente, par exemple :
  `bias-*`, `clinical-*`, `pharma-*`, `ai-*`.

## Contenu des slides

- Ne pas modifier le fond scientifique sans demande explicite.
- Ne pas raccourcir, reformuler ou enrichir un message scientifique sans
  validation si cela peut changer son sens.
- Garder les references bibliographiques dans un format court, lisible et
  coherent avec la slide.
- Choisir consciemment si une slide utilise des references numerotees ou non.

## Refactor et commits

- Ne pas melanger dans un meme commit :
  - refactor de structure
  - changement de contenu
  - correction visuelle
- Si un refactor est fait, il doit ameliorer la lisibilite du code sans
  changer le message de la slide.
- Avant un commit, verifier qu'aucun style inline inutile n'a ete laisse.

## Attendu par defaut pour Codex

- Favoriser la maintenabilite plutot que la vitesse brute.
- Proposer une structure propre avant d'ajouter des exceptions locales.
- Quand un doute existe entre correction rapide et solution propre, preferer
  la solution propre si son cout reste raisonnable.
