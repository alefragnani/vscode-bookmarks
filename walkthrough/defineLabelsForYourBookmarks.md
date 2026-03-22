## Define Labels for Your Bookmarks

Bookmarks represent positions in your code, so you can easily and quickly go back to them whenever necessary. But sometimes its position or the content of that line is not so meaningful as you would like to be. 

To fill this gap, you can define **Labels** to be tied to the bookmark. 

You can eaily type your own **Label** when you toggle a bookmark, or you can ask the extension to suggest for you.

You have a handlfull of alternatives to choose:

  * `useWhenSelected`: Use the selected text _(if available)_ directly, no confirmation required
  * `suggestWhenSelected`: Suggests the selected text _(if available)_. You still need to confirm.
  * `suggestWhenSelectedOrLineWhenNoSelected`: Suggests the selected text _(if available)_ or the entire line (when has no selection). You still need to confirm

<table align="center" width="85%" border="0">
  <tr>
    <td align="center">
      <a title="Open Settings" href="command:workbench.action.openSettings?%5B%22bookmarks.label.suggestion%22%5D">Open Settings</a>
    </td>
  </tr>
</table>

## Label text is displayed inline

![Bookmarks with labels](../images/bookmarks-with-lables-arrrowed.png)

You can turn on bookmark labels text visibility inline in the same line where labeled bookmark is placed by enabling `bookmarks.label.inline.enabled`.

Bookmark label text appears next to the line where labeled bookmark is placed. By default it looks just like git blame text decoration. You can turn this feature on and customize its appearance by the following settings:

  * `bookmarks.label.inline.enabled`: Enable showing bookmark label text next to actual line with labeled bookmark _(`false` by default)_
  * `bookmarks.label.inline.margin`: Margin between end of the line and bookmark label inline text. Makes sense only if bookmarks.label.inline.enabled setting enabled _(`2` by default)_
  * `bookmarks.label.inline.fontStyle`: Label inline text font style (e.g. `"italic"`). Makes sense only if bookmarks.label.inline.enabled setting enabled _(`"normal"` by default)_
  * `bookmarks.labelInlineMessageTextColor`: Text color for bookmark label inline text. If not specified same color as for inlay hints is used. Makes sense only if bookmarks.label.inline.enabled setting enabled
  * `bookmarks.label.inline.fontWeight`: Font thickness for bookmark label inline text. Makes sense only if bookmarks.label.inline.enabled setting enabled _(`450` by default)_
  * `bookmarks.labelInlineMessageBackgroundColor`: Background color for bookmark label inline text. If not specified same color as for inlay hints is used. Makes sense only if bookmarks.label.inline.enabled setting enabled

To change text color/background color of bookmark label inline text:
```json
    "workbench.colorCustomizations": {
      "bookmarks.labelInlineMessageTextColor": "#23ca11f3",
      "bookmarks.labelInlineMessageBackgroundColor": "#6161611a",
    }
```
