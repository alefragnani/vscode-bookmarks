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

## Etiket metni satır içinde görüntülenir

![Bookmarks with labels](../images/bookmarks-with-lables-arrrowed.png)

Varsayılan olarak, yer imi etiket metni etiketli yer iminin bulunduğu satırın yanında görünür. Varsayılan olarak bir satır içi ipucuya (inlay hint) benzer. Bu metnin görünümünü (veya kapatmayı) aşağıdaki ayarlarla özelleştirebilirsiniz:

  * `bookmarks.enableLabelInlineMessage`: Etiketli yer imi bulunan gerçek satırın yanında yer imi etiket metninin gösterilmesini etkinleştirir _(`true` varsayılan)_
  * `bookmarks.labelInlineMessageMargin`: Satırın sonu ile yer imi etiketinin satır içi metni arasındaki boşluk. Yalnızca bookmarks.enableLabelInlineMessage ayarı etkinse anlamlıdır _(`2` varsayılan)_
  * `bookmarks.labelInlineMessageItalic`: Yer imi etiketinin satır içi metnini italik yapar. Yalnızca bookmarks.enableLabelInlineMessage ayarı etkinse anlamlıdır _(`false` varsayılan)_
  * `bookmarks.labelInlineMessageTextColor`: Yer imi etiketinin satır içi metni için metin rengi. Belirtilmezse satır içi ipuçları (inlay hints) ile aynı renk kullanılır. Yalnızca bookmarks.enableLabelInlineMessage ayarı etkinse anlamlıdır
  * `bookmarks.labelInlineMessageBackgroundColor`: Yer imi etiketinin satır içi metni için arka plan rengi. Belirtilmezse satır içi ipuçları (inlay hints) ile aynı renk kullanılır. Yalnızca bookmarks.enableLabelInlineMessage ayarı etkinse anlamlıdır
  * `bookmarks.labelInlineMessageFontWeight`: Yer imi etiketinin satır içi metni için yazı kalınlığı. Yalnızca bookmarks.enableLabelInlineMessage ayarı etkinse anlamlıdır _(`450` varsayılan)_
