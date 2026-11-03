## Đặt nhãn cho dấu trang

Dấu trang đại diện cho các vị trí trong mã của bạn, nhờ đó bạn có thể quay lại chúng dễ dàng và nhanh chóng bất cứ khi nào cần. Nhưng đôi khi vị trí hoặc nội dung của dòng đó không mang nhiều ý nghĩa như bạn mong muốn. 

Để khắc phục điều này, bạn có thể đặt **nhãn** gắn với dấu trang. 

Bạn có thể dễ dàng nhập **nhãn** của riêng mình khi bật/tắt dấu trang, hoặc để tiện ích mở rộng gợi ý cho bạn.

Bạn có một vài lựa chọn:

  * `useWhenSelected`: Dùng trực tiếp văn bản đang chọn _(nếu có)_, không cần xác nhận
  * `suggestWhenSelected`: Gợi ý văn bản đang chọn _(nếu có)_. Bạn vẫn cần xác nhận.
  * `suggestWhenSelectedOrLineWhenNoSelected`: Gợi ý văn bản đang chọn _(nếu có)_ hoặc toàn bộ dòng (khi không có vùng chọn). Bạn vẫn cần xác nhận

<table align="center" width="85%" border="0">
  <tr>
    <td align="center">
      <a title="Mở cài đặt" href="command:workbench.action.openSettings?%5B%22bookmarks.label.suggestion%22%5D">Mở cài đặt</a>
    </td>
  </tr>
</table>

## Văn bản nhãn được hiển thị cùng dòng

![Dấu trang có nhãn](../docs/images/bookmarks-with-labels-arrowed.png)

Bạn có thể hiển thị văn bản nhãn dấu trang ngay trên dòng có dấu trang gắn nhãn bằng cách bật `bookmarks.label.inline.enabled`.

Văn bản nhãn dấu trang xuất hiện bên cạnh dòng có dấu trang gắn nhãn. Theo mặc định, nó trông giống như phần trang trí văn bản git blame. Bạn có thể bật tính năng này và tùy chỉnh giao diện của nó bằng các cài đặt sau:

  * `bookmarks.label.inline.enabled`: Bật hiển thị văn bản nhãn dấu trang bên cạnh dòng có dấu trang gắn nhãn _(mặc định là `false`)_
  * `bookmarks.label.inline.margin`: Khoảng cách giữa cuối dòng và văn bản nhãn dấu trang hiển thị cùng dòng. Chỉ có tác dụng khi cài đặt bookmarks.label.inline.enabled được bật _(mặc định là `2`)_
  * `bookmarks.label.inline.fontStyle`: Kiểu phông chữ của văn bản nhãn hiển thị cùng dòng (ví dụ: `"italic"`). Chỉ có tác dụng khi cài đặt bookmarks.label.inline.enabled được bật _(mặc định là `"normal"`)_
  * `bookmarks.labelInlineMessageTextColor`: Màu chữ của văn bản nhãn dấu trang hiển thị cùng dòng. Nếu không chỉ định, sẽ dùng cùng màu với phần trang trí văn bản git blame. Chỉ có tác dụng khi cài đặt bookmarks.label.inline.enabled được bật
  * `bookmarks.label.inline.fontWeight`: Độ đậm phông chữ của văn bản nhãn dấu trang hiển thị cùng dòng. Chỉ có tác dụng khi cài đặt bookmarks.label.inline.enabled được bật _(mặc định là `400`)_
  * `bookmarks.labelInlineMessageBackgroundColor`: Màu nền của văn bản nhãn dấu trang hiển thị cùng dòng. Nếu không chỉ định, sẽ dùng cùng màu với phần trang trí văn bản git blame. Chỉ có tác dụng khi cài đặt bookmarks.label.inline.enabled được bật

Để thay đổi màu chữ/màu nền của văn bản nhãn dấu trang hiển thị cùng dòng:
```json
    "workbench.colorCustomizations": {
      "bookmarks.labelInlineMessageTextColor": "#23ca11f3",
      "bookmarks.labelInlineMessageBackgroundColor": "#6161611a",
    }
```
