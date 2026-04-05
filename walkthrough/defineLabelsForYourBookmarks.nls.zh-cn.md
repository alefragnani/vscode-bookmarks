## 为你的书签指定标签

书签承载了你代码中的位置信息，这样你就可以随时方便快捷的跳转回去了。但有时只有位置或者书签行上的文本似乎不太够啊。

为了填补这样的空缺，你可以为书签定义**标签**。

你可以在添加标签的时候指定其标签，而如果你拿不定主意，也能让书签扩展自动为你生成可供参考的建议。

若要让扩展生成建议，则有以下生成方式可供选取：

- `useWhenSelected`: 如果可用，使用已选中的文本（不需要额外确认）。
- `suggestWhenSelected`: 如果可用，使用已选中的文本（需要额外确认）。
- `suggestWhenSelectedOrLineWhenNoSelected`: 如果可用，使用已选中的文本，或是当未选中任何文本时使用整行内容（需要额外确认）。

<table align="center" width="85%" border="0">
  <tr>
    <td align="center">
      <a title="跳转设置项" href="command:workbench.action.openSettings?%5B%22bookmarks.label.suggestion%22%5D">跳转设置项</a>
    </td>
  </tr>
</table>


## 标签文本在行中显示

![Bookmarks with labels](../images/bookmarks-with-labels-arrowed.png)

你可以通过启用 `bookmarks.label.inline.enabled` 来在标记书签所在的同一行中打开书签标签文本的可见性。

书签标签文本出现在标记书签所在行的旁边。默认情况下，它看起来就像 git blame 文本装饰。你可以启用此功能并通过以下设置自定义其外观：

  * `bookmarks.label.inline.enabled`: 启用在标记书签的实际行旁边显示书签标签文本 _（默认为 `false`）_
  * `bookmarks.label.inline.margin`: 行末与书签标签内联文本之间的边距。仅当启用 bookmarks.label.inline.enabled 设置时才有意义 _（默认为 `2`）_
  * `bookmarks.label.inline.fontStyle`: 标签内联文本的字体样式（例如 `"italic"`）。仅当启用 bookmarks.label.inline.enabled 设置时才有意义 _（默认为 `"normal"`）_
  * `bookmarks.labelInlineMessageTextColor`: 书签标签内联文本的文本颜色。如果未指定，则使用与 git blame 文本装饰 相同的颜色。仅当启用 bookmarks.label.inline.enabled 设置时才有意义
  * `bookmarks.label.inline.fontWeight`: 书签标签内联文本的字体粗细。仅当启用 bookmarks.label.inline.enabled 设置时才有意义 _（默认为 `400`）_
  * `bookmarks.labelInlineMessageBackgroundColor`: 书签标签内联文本的背景颜色。如果未指定，则使用与 git blame 文本装饰 相同的颜色。仅当启用 bookmarks.label.inline.enabled 设置时才有意义

要改变书签标签内联文本的文本颜色/背景颜色：
```json
    "workbench.colorCustomizations": {
      "bookmarks.labelInlineMessageTextColor": "#23ca11f3",
      "bookmarks.labelInlineMessageBackgroundColor": "#6161611a",
    }
```
