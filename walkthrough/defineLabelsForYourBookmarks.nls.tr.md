## Yer İşaretleriniz için Etiketleri Tanımlayın

Yer işaretleri kodunuzdaki konumları temsil eder; böylece gerektiğinde bunlara kolayca ve hızlı bir şekilde geri dönebilirsiniz. Ancak bazen o satırın konumu veya içeriği sizin istediğiniz kadar anlamlı olmayabilir.

Bu boşluğu doldurmak için yer işaretine bağlanacak **Etiketler**'i tanımlayabilirsiniz.

Bir yer işaretini değiştirdiğinizde kendi **Etiketinizi** kolayca yazabilir veya uzantının sizin için önermesini isteyebilirsiniz.

Seçebileceğiniz bir sürü alternatifiniz var:

  * `useWhenSelected`: Seçilen metni _(varsa)_ doğrudan kullanın, onay gerekmez
  * `suggestWhenSelected`: Seçilen metni _(varsa)_ önerir. Hala onaylamanız gerekiyor.
  * `suggestWhenSelectedOrLineWhenNoSelected`: Seçilen metni _(varsa)_ veya tüm satırı (seçim olmadığında) önerir. Hala onaylamanız gerekiyor

<table align="center" width="85%" border="0">
  <tr>
    <td align="center">
      <a title="Ayarları Aç" href="command:workbench.action.openSettings?%5B%22bookmarks.label.suggestion%22%5D">Ayarları Aç</a>
    </td>
  </tr>
</table>

## Etiket metni satır içinde görüntüleniyor

![Bookmarks with labels](../images/bookmarks-with-lables-arrrowed.png)

`bookmarks.label.inline.enabled` öğesini etkinleştirerek, etiketli yer işaretinin yerleştirildiği aynı satırda yer işareti etiketleri metninin görünürlüğünü satır içinde açabilirsiniz.

Yer işareti etiketi metni, etiketli yer işaretinin yerleştirildiği satırın yanında görünür. Varsayılan olarak, git blame metin dekorasyonu gibi görünür. Bu özelliği açabilir ve aşağıdaki ayarlarla görünümünü özelleştirebilirsiniz:

  * `bookmarks.label.inline.enabled`: Yer işareti etiketi metnini etiketli yer işaretinin gerçek satırının yanında göstermeyi etkinleştirin _(`false` varsayılan)_
  * `bookmarks.label.inline.margin`: Satırın sonu ile yer işareti etiketi satır içi metni arasındaki kenar boşluğu. Yalnızca bookmarks.label.inline.enabled ayarı etkinse anlam ifade eder _(`2` varsayılan)_
  * `bookmarks.label.inline.fontStyle`: Etiket satır içi metin yazı tipi stili (örn. `"italic"`). Yalnızca bookmarks.label.inline.enabled ayarı etkinse anlam ifade eder _(`"normal"` varsayılan)_
  * `bookmarks.labelInlineMessageTextColor`: Yer işareti etiketi satır içi metni için metin rengi. Belirtilmezse, satır içi ipuçları ile aynı renk kullanılır. Yalnızca bookmarks.label.inline.enabled ayarı etkinse anlam ifade eder
  * `bookmarks.label.inline.fontWeight`: Yer işareti etiketi satır içi metni için yazı tipi kalınlığı. Yalnızca bookmarks.label.inline.enabled ayarı etkinse anlam ifade eder _(`450` varsayılan)_
  * `bookmarks.labelInlineMessageBackgroundColor`: Yer işareti etiketi satır içi metni için arka plan rengi. Belirtilmezse, satır içi ipuçları ile aynı renk kullanılır. Yalnızca bookmarks.label.inline.enabled ayarı etkinse anlam ifade eder

Yer işareti etiketi satır içi metni metin rengini/arka plan rengini değiştirmek için:
```json
    "workbench.colorCustomizations": {
      "bookmarks.labelInlineMessageTextColor": "#23ca11f3",
      "bookmarks.labelInlineMessageBackgroundColor": "#6161611a",
    }
```
