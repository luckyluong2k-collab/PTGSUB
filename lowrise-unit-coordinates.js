// Tọa độ xác thực thủ công cho ảnh gốc lowrise-map-sharp.jpg (4096 x 2896 px).
// x, y là TÂM lô trên ảnh gốc; width, height là kích thước thật của riêng lô đó.
// Không nội suy và không sao chép kích thước từ căn khác.
//
// Cách thêm một căn C mới:
// 1. Kiểm tra mã có trong window.unitCatalog và tách đúng đường C1-C22 theo tiền tố dài nhất.
// 2. Đo thủ công đúng bốn ranh lô trên ảnh gốc, rồi nhập tâm x/y, width/height và rotation.
// 3. Đặt crop chỉ để lấy vùng xem; tagOffset đặt nhãn mã căn ra phần đường/vùng trống.
// 4. Bật DEBUG_UNIT_COORDINATES = true để rà tâm, ranh lô và mã; tắt lại trước khi phát hành.

window.DEBUG_UNIT_COORDINATES = false;

window.lowRiseUnitCoordinates = Object.freeze({
  C1707: Object.freeze({
    x: 922.5,
    y: 2095,
    width: 11,
    height: 32,
    rotation: 0,
    padding: 2,
    crop: Object.freeze({ x: 850, y: 2025, width: 360, height: 190 }),
    tagOffset: Object.freeze({ x: 24, y: 42 }),
  }),
  C1837: Object.freeze({
    x: 1099.5,
    y: 2205,
    width: 11,
    height: 32,
    rotation: 0,
    padding: 2,
    crop: Object.freeze({ x: 930, y: 2135, width: 360, height: 190 }),
    tagOffset: Object.freeze({ x: 24, y: 42 }),
  }),
  C19177: Object.freeze({
    x: 1910,
    y: 2314,
    width: 11,
    height: 33,
    rotation: 0,
    padding: 2,
    crop: Object.freeze({ x: 1740, y: 2245, width: 360, height: 190 }),
    tagOffset: Object.freeze({ x: 24, y: 42 }),
  }),
});
