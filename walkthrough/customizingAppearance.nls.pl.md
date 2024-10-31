## Dostosowywanie wyglądu

Możesz dostosować nie tylko to, jak ikona jest wyświetlana w marginesie (Gutter), ale także dodać kolor tła do zakładkowanej linii oraz do linijki przeglądu.

Coś takiego w twoich ustawieniach:

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

Może to skutkować zakładką wyglądającą tak:

![Zakładka po dostosowaniu](customizedBookmark.png)
