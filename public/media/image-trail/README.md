# Image Trail photos

Dépose ici tes photos `.avif` (800–1200 px sur le grand côté conseillés). Aucun contenu n'est sélectionné par défaut.

Pour les afficher, ajoute chaque photo dans `trailImages` de `src/config/site-assets.ts`, **après** avoir commité le fichier :

```ts
export const trailImages: TrailAsset[] = [
  { src: "/media/image-trail/brochure-01.avif", alt: "Brochure imprimée" },
  { src: "/media/image-trail/sac-02.avif", alt: "Tote bag personnalisé" },
  { src: "/media/image-trail/kakemono-03.avif", alt: "Kakémono" },
];
```

- L'ordre du tableau = l'ordre d'affichage. Le dossier n'est jamais scanné.
- 0 image : rien n'est affiché. 1–2 images : composition statique seulement.
- 3 images ou plus : composition statique de 3 images sur mobile / tactile / mouvement réduit ; trail interactif au curseur sur grand écran avec souris.
- `alt` : décris la photo en français (lu par les lecteurs d'écran sur la version statique).
