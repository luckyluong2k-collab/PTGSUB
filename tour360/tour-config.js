/*
 * THAY ẢNH THẬT:
 * 1) Xuất ảnh Insta360 dạng equirectangular JPG tỷ lệ 2:1.
 * 2) Chép ảnh vào thư mục assets/panos/.
 * 3) Đổi trường panorama bên dưới, ví dụ: "./assets/panos/phong-khach.jpg".
 * 4) Dùng editor.html để lấy pitch / yaw cho hotspot.
 */
window.TOUR_CONFIG = {
  projectName: "SUN URBAN CITY",
  unitName: "Nhà mẫu căn hộ 1BR",
  phone: "0387335227",
  zaloUrl: "https://zalo.me/0387335227",
  firstScene: "living-room",
  scenes: {
    "living-room": {
      title: "Phòng khách",
      subtitle: "Không gian sinh hoạt chung",
      icon: "🛋️",
      panorama: "https://pannellum.org/images/from-tree.jpg",
      pitch: -2,
      yaw: 118,
      hfov: 105,
      hotSpots: [
        { pitch: -3, yaw: 132, type: "scene", text: "Đi tới phòng ngủ", sceneId: "bedroom" },
        { pitch: -5, yaw: 78, type: "scene", text: "Đi tới ban công", sceneId: "balcony" }
      ]
    },
    bedroom: {
      title: "Phòng ngủ",
      subtitle: "Không gian nghỉ ngơi",
      icon: "🛏️",
      panorama: "https://pannellum.org/images/bma-0.jpg",
      pitch: -1,
      yaw: 5,
      hfov: 105,
      hotSpots: [
        { pitch: -2, yaw: 36, type: "scene", text: "Quay lại phòng khách", sceneId: "living-room", targetYaw: -22, targetPitch: 2 },
        { pitch: -4, yaw: -65, type: "scene", text: "Đi tới phòng tắm", sceneId: "bathroom" }
      ]
    },
    bathroom: {
      title: "Phòng tắm",
      subtitle: "Thiết kế tối ưu công năng",
      icon: "🚿",
      panorama: "https://pannellum.org/images/alma.jpg",
      pitch: 1,
      yaw: 25,
      hfov: 100,
      hotSpots: [
        { pitch: -3, yaw: 176, type: "scene", text: "Quay lại phòng ngủ", sceneId: "bedroom" }
      ]
    },
    balcony: {
      title: "Ban công",
      subtitle: "Góc nhìn cảnh quan",
      icon: "🌇",
      panorama: "https://pannellum.org/images/cerro-toco-0.jpg",
      pitch: 0,
      yaw: 20,
      hfov: 105,
      hotSpots: [
        { pitch: -5, yaw: -155, type: "scene", text: "Quay lại phòng khách", sceneId: "living-room" }
      ]
    }
  }
};
