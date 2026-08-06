# Tour 360° Sun Urban City

Website tour ảnh cầu 360° chạy độc lập trong thư mục `tour360/`, không thay đổi ứng dụng PTGSUB hiện tại.

## Nội dung hiện có

- 14 ảnh panorama DJI toàn cảnh dự án.
- Ảnh nguồn: 12.000 × 6.000 px, chuẩn equirectangular 2:1.
- Ảnh dùng trên web: 8.192 × 4.096 px, JPEG progressive, tối ưu để cân bằng độ nét và tốc độ tải.
- Danh sách 14 điểm nhìn: khu thấp tầng, trục đường, hồ cảnh quan, khu thể thao, khu cao tầng, công viên nước và các khu vực đang phát triển.
- CTA gọi điện và Zalo: 0387 335 227.
- Giao diện responsive cho điện thoại và máy tính.

## Chạy thử trên máy

Không mở trực tiếp bằng `file://` vì trình duyệt có thể chặn tài nguyên. Tại thư mục gốc repo, chạy:

```bash
python -m http.server 8080
```

Sau đó mở:

```text
http://localhost:8080/tour360/
```

## Cấu trúc chính

```text
tour360/
├── index.html
├── styles.css
├── app.js
├── tour-config.js
├── editor.html
├── drive-manifest.json
├── scripts/
│   └── import_drive_panos.py
└── assets/
    └── panos/
        ├── scene-01.jpg
        ├── ...
        └── scene-14.jpg
```

## Thay đổi tên và mô tả điểm nhìn

Sửa các trường `title` và `subtitle` trong `tour-config.js`. Không cần đổi tên file ảnh.

## Nhập lại ảnh từ Google Drive

Workflow `.github/workflows/import-tour360-panoramas.yml` tự động:

1. Đọc danh sách file trong `drive-manifest.json`.
2. Tải ảnh từ Google Drive.
3. Kiểm tra tỷ lệ 2:1.
4. Tối ưu về 8192 × 4096 px.
5. Commit ảnh vào `assets/panos/`.

Khi thay ảnh trên Drive hoặc đổi file ID, cập nhật `drive-manifest.json` rồi chạy workflow.

## Hotspot

`editor.html` hỗ trợ mở ảnh 360 và lấy tọa độ `pitch` / `yaw`. Sau khi xác định đúng quan hệ không gian giữa các điểm bay, có thể thêm hotspot chuyển cảnh trong `tour-config.js`.

## Triển khai

Có thể triển khai thư mục `tour360/` bằng Firebase Hosting, GitHub Pages, Cloudflare Pages hoặc bất kỳ static hosting nào. Với Firebase hiện tại, cần cấu hình route/public directory trước khi merge và deploy để không ảnh hưởng PTGSUB đang chạy.
