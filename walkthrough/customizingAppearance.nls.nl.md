## Weergave aanpassen

Je kunt niet alleen aanpassen hoe het pictogram wordt weergegeven in de Gutter, maar ook een achtergrondkleur toevoegen aan de regel met de bladwijzer en de overzichtsbalk.

Zet zoiets als dit in je instellingen:

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

Wat resulteert in een bladwijzer zoals deze:

![Aangepaste bladwijzer](customizedBookmark.png)
