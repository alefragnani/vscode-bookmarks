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

## 标签文本以内联方式显示

![Bookmarks with labels](../images/bookmarks-with-lables-arrrowed.png)

默认情况下，书签标签文本会显示在带标签书签所在行的旁边。默认样式看起来类似于内联提示（inlay hint）。你可以通过以下设置自定义该文本的显示效果（或将其关闭）：

  * `bookmarks.enableLabelInlineMessage`: 启用在带标签书签所在的实际行旁显示书签标签文本 _(`true`，默认值)_
  * `bookmarks.labelInlineMessageMargin`: 行尾与书签标签内联文本之间的间距。仅在启用 bookmarks.enableLabelInlineMessage 设置时有意义 _(`2`，默认值)_
  * `bookmarks.labelInlineMessageItalic`: 将书签标签内联文本显示为斜体。仅在启用 bookmarks.enableLabelInlineMessage 设置时有意义 _(`false`，默认值)_
  * `bookmarks.labelInlineMessageTextColor`: 书签标签内联文本的文字颜色。如果未指定，则使用与内联提示（inlay hints）相同的颜色。仅在启用 bookmarks.enableLabelInlineMessage 设置时有意义
  * `bookmarks.labelInlineMessageBackgroundColor`: 书签标签内联文本的背景颜色。如果未指定，则使用与内联提示（inlay hints）相同的颜色。仅在启用 bookmarks.enableLabelInlineMessage 设置时有意义
  * `bookmarks.labelInlineMessageFontWeight`: 书签标签内联文本的字体粗细。仅在启用 bookmarks.enableLabelInlineMessage 设置时有意义 _(`450`，默认值)_