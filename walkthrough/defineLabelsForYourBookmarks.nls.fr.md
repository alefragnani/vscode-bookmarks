## Définir des étiquettes pour vos signets

Les signets représentent des positions dans votre code, vous permettant d’y revenir facilement et rapidement lorsque nécessaire. Mais parfois, leur position ou le contenu de la ligne n’est pas aussi significatif que vous le souhaiteriez.

Pour combler cette lacune, vous pouvez définir des **étiquettes** associées au signet.

Vous pouvez facilement saisir votre propre **étiquette** lorsque vous activez un signet, ou demander à l’extension de vous en suggérer une.

Vous avez plusieurs alternatives à choisir :

-   `useWhenSelected` : Utilise directement le texte sélectionné _(si disponible)_, sans confirmation requise.
-   `suggestWhenSelected` : Suggère le texte sélectionné _(si disponible)_. Vous devez toujours confirmer.
-   `suggestWhenSelectedOrLineWhenNoSelected` : Suggère le texte sélectionné _(si disponible)_ ou la ligne entière (en l’absence de sélection). Vous devez toujours confirmer.

<table align="center" width="85%" border="0">
  <tr>
    <td align="center">
      <a title="Ouvrir les paramètres" href="command:workbench.action.openSettings?%5B%22bookmarks.label.suggestion%22%5D">Ouvrir les paramètres</a>
    </td>
  </tr>
</table>

## Le texte de l’étiquette s’affiche en ligne

![Bookmarks with labels](../images/bookmarks-with-lables-arrrowed.png)

Par défaut, le texte de l’étiquette du signet apparaît à côté de la ligne où le signet étiqueté est placé. Par défaut, il ressemble à un indice intégré (inlay hint). Vous pouvez personnaliser l’apparence de ce texte (ou le désactiver) avec les paramètres suivants :

  * `bookmarks.enableLabelInlineMessage` : Active l’affichage du texte de l’étiquette du signet à côté de la ligne réelle avec un signet étiqueté _(`true` par défaut)_
  * `bookmarks.labelInlineMessageMargin` : Marge entre la fin de la ligne et le texte en ligne de l’étiquette du signet. Cela n’a de sens que si le paramètre bookmarks.enableLabelInlineMessage est activé _(`2` par défaut)_
  * `bookmarks.labelInlineMessageItalic` : Rend le texte en ligne de l’étiquette du signet en italique. Cela n’a de sens que si le paramètre bookmarks.enableLabelInlineMessage est activé _(`false` par défaut)_
  * `bookmarks.labelInlineMessageTextColor` : Couleur du texte pour le texte en ligne de l’étiquette du signet. Si non spécifiée, la même couleur que pour les indices intégrés (inlay hints) est utilisée. Cela n’a de sens que si le paramètre bookmarks.enableLabelInlineMessage est activé
  * `bookmarks.labelInlineMessageBackgroundColor` : Couleur d’arrière-plan pour le texte en ligne de l’étiquette du signet. Si non spécifiée, la même couleur que pour les indices intégrés (inlay hints) est utilisée. Cela n’a de sens que si le paramètre bookmarks.enableLabelInlineMessage est activé
  * `bookmarks.labelInlineMessageFontWeight` : Épaisseur de police pour le texte en ligne de l’étiquette du signet. Cela n’a de sens que si le paramètre bookmarks.enableLabelInlineMessage est activé _(`450` par défaut)_
