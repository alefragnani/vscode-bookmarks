## Personnalisation de l’apparence

Vous pouvez personnaliser l’affichage de l’icône dans la marge, mais aussi ajouter une couleur d’arrière-plan et une bordure à la ligne marquée d’un signet et modifier l’aspect lors du survol.

Ajoutez quelque chose comme ceci dans vos paramètres :

```json
    "bookmarks.gutterIconFillColor": "none",
    // "bookmarks.gutterIconBorderColor": "157EFB",
    "workbench.colorCustomizations": {
      ...
      "bookmarks.lineBackground": "#0077ff2a",
      "bookmarks.lineBorder": "#FF0000",
      "bookmarks.overviewRuler": "#157EFB88"
    }
```

Pour obtenir un signet qui ressemble à ceci :

![Signet personnalisé](customizedBookmark.png)
