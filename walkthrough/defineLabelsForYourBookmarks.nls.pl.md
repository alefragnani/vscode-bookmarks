## Definiowanie Etykiet dla Twoich Zakładek

Zakładki reprezentują pozycje w twoim kodzie, dzięki czemu możesz łatwo i szybko do nich wrócić, kiedy tylko jest to konieczne. Ale czasami pozycja ta lub zawartość danej linii nie jest tak znacząca, jak byś tego chciał.

Aby wypełnić tę lukę, możesz zdefiniować **Etykiety**, które będą przypisane do zakładki.

Możesz łatwo wpisać własną **Etykietę** podczas przełączania zakładki, lub możesz poprosić rozszerzenie, aby zaproponowało ci ją.

Masz do wyboru kilka alternatyw:

  * `useWhenSelected`: Użyj zaznaczonego tekstu _(jeśli dostępny)_ bezpośrednio, bez potrzeby potwierdzenia
  * `suggestWhenSelected`: Zaproponuj zaznaczony tekst _(jeśli dostępny)_. Nadal musisz potwierdzić.
  * `suggestWhenSelectedOrLineWhenNoSelected`: Zaproponuj zaznaczony tekst _(jeśli dostępny)_ lub całą linię (kiedy nie ma zaznaczenia). Nadal musisz potwierdzić

<table align="center" width="85%" border="0">
  <tr>
    <td align="center">
      <a title="Open Settings" href="command:workbench.action.openSettings?%5B%22bookmarks.label.suggestion%22%5D">Otwórz Ustawienia</a>
    </td>
  </tr>
</table>

## Tekst etykiety jest wyświetlany w wierszu

![Bookmarks with labels](../images/bookmarks-with-lables-arrrowed.png)

Możesz włączyć widoczność tekstu etykiety zakładki w wierszu, w którym umieszczona jest zakładka z etykietą, włączając `bookmarks.label.inline.enabled`.

Tekst etykiety zakładki pojawia się obok wiersza, w którym umieszczona jest zakładka z etykietą. Domyślnie wygląda jak dekoracja tekstu git blame. Możesz włączyć tę funkcję i dostosować jej wygląd za pomocą następujących ustawień:

  * `bookmarks.label.inline.enabled`: Włącz pokazywanie tekstu etykiety zakładki obok rzeczywistego wiersza z etykietowaną zakładką _(`false` domyślnie)_
  * `bookmarks.label.inline.margin`: Margines między końcem linii a tekstem etykiety zakładki w wierszu. Ma sens tylko jeśli ustawienie bookmarks.label.inline.enabled jest włączone _(`2` domyślnie)_
  * `bookmarks.label.inline.fontStyle`: Styl czcionki tekstu etykiety w wierszu (np. `"italic"`). Ma sens tylko jeśli ustawienie bookmarks.label.inline.enabled jest włączone _(`"normal"` domyślnie)_
  * `bookmarks.labelInlineMessageTextColor`: Kolor tekstu etykiety zakładki w wierszu. Jeśli nie jest określony, używany jest ten sam kolor co dla inlay hints. Ma sens tylko jeśli ustawienie bookmarks.label.inline.enabled jest włączone
  * `bookmarks.label.inline.fontWeight`: Grubość czcionki tekstu etykiety w wierszu. Ma sens tylko jeśli ustawienie bookmarks.label.inline.enabled jest włączone _(`450` domyślnie)_
  * `bookmarks.labelInlineMessageBackgroundColor`: Kolor tła tekstu etykiety zakładki w wierszu. Jeśli nie jest określony, używany jest ten sam kolor co dla inlay hints. Ma sens tylko jeśli ustawienie bookmarks.label.inline.enabled jest włączone

Aby zmienić kolor tekstu/koloru tła tekstu etykiety zakładki w wierszu:
```json
    "workbench.colorCustomizations": {
      "bookmarks.labelInlineMessageTextColor": "#23ca11f3",
      "bookmarks.labelInlineMessageBackgroundColor": "#6161611a",
    }
```
