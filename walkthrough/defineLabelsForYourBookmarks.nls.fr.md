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

## Le texte du label s'affiche en ligne

![Bookmarks with labels](../images/bookmarks-with-labels-arrowed.png)

Vous pouvez activer la visibilité du texte des étiquettes en ligne sur la même ligne où se trouve le signet étiqueté en activant `bookmarks.label.inline.enabled`.

Le texte du label du signet apparaît à côté de la ligne où se trouve le signet étiqueté. Par défaut, cela ressemble à la décoration du texte de git blame. Vous pouvez activer cette fonction et personnaliser son apparence avec les paramètres suivants :

  * `bookmarks.label.inline.enabled`: Activer l'affichage du texte du label à côté de la ligne réelle du signet étiqueté _(`false` par défaut)_
  * `bookmarks.label.inline.margin`: Marge entre la fin de la ligne et le texte du label en ligne. N'a de sens que si le paramètre bookmarks.label.inline.enabled est activé _(`2` par défaut)_
  * `bookmarks.label.inline.fontStyle`: Style de police du texte du label en ligne (p. ex. `"italic"`). N'a de sens que si le paramètre bookmarks.label.inline.enabled est activé _(`"normal"` par défaut)_
  * `bookmarks.labelInlineMessageTextColor`: Couleur du texte du label en ligne du signet. Si non spécifié, la même couleur que celle des git blame décoration de texte est utilisée. N'a de sens que si le paramètre bookmarks.label.inline.enabled est activé
  * `bookmarks.label.inline.fontWeight`: Épaisseur de la police du texte du label en ligne. N'a de sens que si le paramètre bookmarks.label.inline.enabled est activé _(`400` par défaut)_
  * `bookmarks.labelInlineMessageBackgroundColor`: Couleur de fond du texte du label en ligne. Si non spécifié, la même couleur que celle des git blame décoration de texte est utilisée. N'a de sens que si le paramètre bookmarks.label.inline.enabled est activé

Pour modifier la couleur du texte/fond du label en ligne du signet :
```json
    "workbench.colorCustomizations": {
      "bookmarks.labelInlineMessageTextColor": "#23ca11f3",
      "bookmarks.labelInlineMessageBackgroundColor": "#6161611a",
    }
```
