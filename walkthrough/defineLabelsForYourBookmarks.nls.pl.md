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

## Tekst etykiety jest wyświetlany w linii

![Bookmarks with labels](../images/bookmarks-with-lables-arrrowed.png)

Domyślnie tekst etykiety zakładki pojawia się obok linii, w której znajduje się oznaczona zakładka. Domyślnie wygląda tak samo jak wskazówka osadzona (inlay hint). Możesz dostosować wygląd tego tekstu (albo go wyłączyć) za pomocą następujących ustawień:

  * `bookmarks.enableLabelInlineMessage`: Włącza wyświetlanie tekstu etykiety zakładki obok właściwej linii z oznaczoną zakładką _(`true` domyślnie)_
  * `bookmarks.labelInlineMessageMargin`: Margines między końcem linii a tekstem etykiety zakładki wyświetlanym w linii. Ma sens tylko wtedy, gdy ustawienie bookmarks.enableLabelInlineMessage jest włączone _(`2` domyślnie)_
  * `bookmarks.labelInlineMessageItalic`: Ustawia kursywę dla tekstu etykiety zakładki wyświetlanego w linii. Ma sens tylko wtedy, gdy ustawienie bookmarks.enableLabelInlineMessage jest włączone _(`false` domyślnie)_
  * `bookmarks.labelInlineMessageTextColor`: Kolor tekstu dla tekstu etykiety zakładki wyświetlanego w linii. Jeśli nie zostanie określony, użyty zostanie ten sam kolor co dla wskazówek osadzonych (inlay hints). Ma sens tylko wtedy, gdy ustawienie bookmarks.enableLabelInlineMessage jest włączone
  * `bookmarks.labelInlineMessageBackgroundColor`: Kolor tła dla tekstu etykiety zakładki wyświetlanego w linii. Jeśli nie zostanie określony, użyty zostanie ten sam kolor co dla wskazówek osadzonych (inlay hints). Ma sens tylko wtedy, gdy ustawienie bookmarks.enableLabelInlineMessage jest włączone
  * `bookmarks.labelInlineMessageFontWeight`: Grubość czcionki dla tekstu etykiety zakładki wyświetlanego w linii. Ma sens tylko wtedy, gdy ustawienie bookmarks.enableLabelInlineMessage jest włączone _(`450` domyślnie)_
