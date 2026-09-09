## Əlfəcinləriniz üçün etiketlər təyin edin

Əlfəcinlər kodunuzdakı mövqeləri təmsil edir, ona görə lazım olduqda onlara asanlıqla və sürətlə qayıda bilərsiniz. Amma bəzən onun mövqeyi və ya həmin sətrin məzmunu istədiyiniz qədər mənalı olmaya bilər. 

Bu boşluğu doldurmaq üçün əlfəcinə bağlanacaq **Etiketlər** təyin edə bilərsiniz. 

Bir əlfəcini aç/bağla edərkən öz **Etiketinizi** asanlıqla yaza bilər, ya da genişlənmədən sizin üçün təklif verməsini istəyə bilərsiniz.

Seçmək üçün bir neçə alternativiniz var:

  * `useWhenSelected`: Seçilmiş mətni _(varsa)_ birbaşa istifadə et, təsdiq tələb olunmur
  * `suggestWhenSelected`: Seçilmiş mətni _(varsa)_ təklif edir. Yenə də təsdiqləməlisiniz.
  * `suggestWhenSelectedOrLineWhenNoSelected`: Seçilmiş mətni _(varsa)_ və ya bütün sətri (seçim olmadıqda) təklif edir. Yenə də təsdiqləməlisiniz

<table align="center" width="85%" border="0">
  <tr>
    <td align="center">
      <a title="Parametrləri aç" href="command:workbench.action.openSettings?%5B%22bookmarks.label.suggestion%22%5D">Parametrləri aç</a>
    </td>
  </tr>
</table>

## Etiket mətni sətiriçi göstərilir

![Etiketli əlfəcinlər](../docs/images/bookmarks-with-labels-arrowed.png)

`bookmarks.label.inline.enabled` parametrini aktivləşdirməklə etiketli əlfəcinin yerləşdiyi eyni sətirdə əlfəcin etiketi mətninin sətiriçi görünürlüyünü aça bilərsiniz.

Əlfəcin etiketi mətni etiketli əlfəcinin yerləşdiyi sətrin yanında görünür. Standart olaraq git blame mətn dekorasiyası kimi görünür. Bu funksiyanı aşağıdakı parametrlərlə aktivləşdirə və görünüşünü fərdiləşdirə bilərsiniz:

  * `bookmarks.label.inline.enabled`: Əlfəcin etiketi mətninin etiketli əlfəcinin olduğu sətrin yanında göstərilməsini aktivləşdirir _(standart olaraq `false`)_
  * `bookmarks.label.inline.margin`: Sətrin sonu ilə əlfəcin etiketinin sətiriçi mətni arasındakı boşluq. Yalnız bookmarks.label.inline.enabled parametri aktivdirsə mənası var _(standart olaraq `2`)_
  * `bookmarks.label.inline.fontStyle`: Etiketin sətiriçi mətninin şrift üslubu (məs. `"italic"`). Yalnız bookmarks.label.inline.enabled parametri aktivdirsə mənası var _(standart olaraq `"normal"`)_
  * `bookmarks.labelInlineMessageTextColor`: Əlfəcin etiketinin sətiriçi mətni üçün mətn rəngi. Təyin edilməzsə git blame mətn dekorasiyası ilə eyni rəng istifadə olunur. Yalnız bookmarks.label.inline.enabled parametri aktivdirsə mənası var
  * `bookmarks.label.inline.fontWeight`: Əlfəcin etiketinin sətiriçi mətni üçün şriftin qalınlığı. Yalnız bookmarks.label.inline.enabled parametri aktivdirsə mənası var _(standart olaraq `400`)_
  * `bookmarks.labelInlineMessageBackgroundColor`: Əlfəcin etiketinin sətiriçi mətni üçün fon rəngi. Təyin edilməzsə git blame mətn dekorasiyası ilə eyni rəng istifadə olunur. Yalnız bookmarks.label.inline.enabled parametri aktivdirsə mənası var

Əlfəcin etiketinin sətiriçi mətninin mətn rəngini/fon rəngini dəyişmək üçün:
```json
    "workbench.colorCustomizations": {
      "bookmarks.labelInlineMessageTextColor": "#23ca11f3",
      "bookmarks.labelInlineMessageBackgroundColor": "#6161611a",
    }
```
