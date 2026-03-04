## Elegir etiquetas para tus marcadores

Los marcadores establecen posiciones concretas en tu código para que puedas volver a esas posiciones rápida y fácilmente siempre que quieras. Sin embargo, puede que la posición o el contenido de la línea no sean tan útiles como te gustaría que fuesen.

Para solucionar esto, puedes escribir **etiquetas**, que van unidas al marcador.

Puedes escribir tu propia **etiqueta** cuando estableces un marcador; también puedes dejar que la extensión te sugiera una.

Tienes un montón de alternativas entre las que elegir:

  * `useWhenSelected`: usa el texto seleccionado inmediatamente _(si está disponible)_. No se necesita confirmación.
  * `suggestWhenSelected`: sugiere el texto seleccionado _(si está disponible)_. Es necesario que lo confirmes.
  * `suggestWhenSelectedOrLineWhenNoSelected`: sugiere el texto seleccionado _(si está disponible)_ o la línea entera (si no hay ninguna selección). Es necesario que lo confirmes.

<table align="center" width="85%" border="0">
  <tr>
    <td align="center">
      <a title="Abrir la configuración" href="command:workbench.action.openSettings?%5B%22bookmarks.label.suggestion%22%5D">Abrir la configuración</a>
    </td>
  </tr>
</table>

## El texto de la etiqueta se muestra en línea

![Bookmarks with labels](../images/bookmarks-with-lables-arrrowed.png)

De forma predeterminada, el texto de la etiqueta del marcador aparece junto a la línea donde se coloca el marcador etiquetado. Por defecto, se ve igual que una sugerencia en línea (inlay hint). Puedes personalizar la apariencia de este texto (o desactivarlo) con las siguientes configuraciones:

  * `bookmarks.enableLabelInlineMessage`: Habilita mostrar el texto de la etiqueta del marcador junto a la línea real con marcador etiquetado _(`true` por defecto)_
  * `bookmarks.labelInlineMessageMargin`: Margen entre el final de la línea y el texto en línea de la etiqueta del marcador. Solo tiene sentido si la configuración bookmarks.enableLabelInlineMessage está habilitada _(`2` por defecto)_
  * `bookmarks.labelInlineMessageItalic`: Hace que el texto en línea de la etiqueta del marcador esté en cursiva. Solo tiene sentido si la configuración bookmarks.enableLabelInlineMessage está habilitada _(`false` por defecto)_
  * `bookmarks.labelInlineMessageTextColor`: Color del texto para el texto en línea de la etiqueta del marcador. Si no se especifica, se usa el mismo color que para las sugerencias en línea (inlay hints). Solo tiene sentido si la configuración bookmarks.enableLabelInlineMessage está habilitada
  * `bookmarks.labelInlineMessageBackgroundColor`: Color de fondo para el texto en línea de la etiqueta del marcador. Si no se especifica, se usa el mismo color que para las sugerencias en línea (inlay hints). Solo tiene sentido si la configuración bookmarks.enableLabelInlineMessage está habilitada
  * `bookmarks.labelInlineMessageFontWeight`: Grosor de fuente para el texto en línea de la etiqueta del marcador. Solo tiene sentido si la configuración bookmarks.enableLabelInlineMessage está habilitada _(`450` por defecto)_
