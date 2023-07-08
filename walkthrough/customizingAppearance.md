## Customizing Appearance

You can customize not only how the icon is show in the Gutter, but also add a background color to the bookmarked line and the overview ruller.

Something like this in your settings:

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

Could end up with a bookmark like this:

![Customized Bookmark](customizedBookmark.png)