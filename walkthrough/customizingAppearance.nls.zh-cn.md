## 自定义外观

你可以在设置中自定义书签在编辑器中的呈现，以下是可供设定的颜色设置：

- 装订线（Gutter Ruler）中书签图标的颜色；
- 书签所在行的背景颜色；
- 概览标尺（Overview Ruler）中书签标记的颜色。

就比如，如果在设置中像这样写：

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

就会变成这样：

![Customized Bookmark](customizedBookmark.png)
