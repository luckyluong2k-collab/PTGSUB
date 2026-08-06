# Tour 360° Bất động sản — MVP

Website tour ảnh cầu 360° dành cho tư vấn căn hộ, chạy bằng HTML/CSS/JavaScript thuần và Pannellum 2.5.7.

## Chức năng đã có

- Xoay, zoom và xem toàn màn hình trên điện thoại / máy tính.
- Nhiều phòng trong một tour.
- Hotspot mũi tên để chuyển giữa các phòng.
- Danh sách phòng, hiệu ứng chuyển cảnh và giao diện thương hiệu.
- Nút gọi điện và nhắn Zalo cho Đức Lương — 0387 335 227.
- `editor.html` hỗ trợ lấy tọa độ `pitch` và `yaw` để đặt hotspot.
- Không cần build, có thể triển khai lên Firebase Hosting, GitHub Pages, Netlify hoặc Cloudflare Pages.

## Chạy thử trên máy

Không nên mở trực tiếp bằng `file://`. Trong thư mục này, chạy một web server tĩnh:

```bash
python -m http.server 8080
```

Sau đó mở:

- Tour: `http://localhost:8080`
- Hotspot editor: `http://localhost:8080/editor.html`

## Thay ảnh chụp từ Insta360

1. Trong Insta360 Studio hoặc ứng dụng Insta360, xuất ảnh đã stitch dạng JPG equirectangular tỷ lệ 2:1.
2. Tạo thư mục `assets/panos` và chép ảnh vào đó.
3. Mở `tour-config.js` và thay URL demo:

```js
panorama: "./assets/panos/phong-khach.jpg"
```

4. Mở `editor.html`, tải ảnh lên và xoay đến cửa / lối đi.
5. Bấm **Lấy tọa độ hiện tại**, nhập scene đích rồi tạo cấu hình.
6. Dán object nhận được vào mảng `hotSpots` của phòng tương ứng.

## Thêm một phòng

Trong `tour-config.js`, thêm scene mới vào `scenes`:

```js
kitchen: {
  title: "Khu bếp",
  subtitle: "Bếp liên thông phòng khách",
  icon: "🍳",
  panorama: "./assets/panos/khu-bep.jpg",
  pitch: 0,
  yaw: 0,
  hfov: 105,
  hotSpots: []
}
```

## Triển khai độc lập lên Firebase

Tạo một project Firebase hoặc Hosting site riêng, sau đó chạy:

```bash
firebase init hosting
firebase deploy --only hosting
```

Chọn thư mục public là thư mục `tour360` này và không ghi đè `index.html`.

## Lưu ý hình ảnh

Các URL ảnh trong `tour-config.js` chỉ là ảnh demo công khai từ website chính thức của Pannellum. Trước khi gửi khách, phải thay toàn bộ bằng ảnh 360° do anh sở hữu hoặc được chủ đầu tư cho phép sử dụng.
