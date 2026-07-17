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
  // Đường C16: dãy chẵn nằm phía dưới tên đường.
  C1634: Object.freeze({
    x: 1063.5,
    y: 2052,
    width: 11,
    height: 32,
    rotation: 0,
    padding: 2,
    crop: Object.freeze({ x: 704, y: 1880, width: 720, height: 360 }),
    tagOffset: Object.freeze({ x: 100, y: -45 }),
  }),

  // Đường C17: dãy lẻ nằm phía trên tên đường.
  C1707: Object.freeze({
    x: 945.5,
    y: 2095,
    width: 11,
    height: 32,
    rotation: 0,
    padding: 2,
    crop: Object.freeze({ x: 586, y: 1920, width: 720, height: 360 }),
    tagOffset: Object.freeze({ x: 28, y: 24 }),
  }),
  C1741: Object.freeze({
    x: 1117.5,
    y: 2095,
    width: 11,
    height: 32,
    rotation: 0,
    padding: 2,
    crop: Object.freeze({ x: 758, y: 1920, width: 720, height: 360 }),
    tagOffset: Object.freeze({ x: 102, y: 24 }),
  }),

  // Đường C18: dãy lẻ nằm phía trên tên đường.
  C1807: Object.freeze({
    x: 945.5,
    y: 2205,
    width: 11,
    height: 32,
    rotation: 0,
    padding: 2,
    crop: Object.freeze({ x: 586, y: 2030, width: 720, height: 360 }),
    tagOffset: Object.freeze({ x: 28, y: 24 }),
  }),
  C1837: Object.freeze({
    x: 1096.5,
    y: 2205,
    width: 11,
    height: 32,
    rotation: 0,
    padding: 2,
    crop: Object.freeze({ x: 737, y: 2030, width: 720, height: 360 }),
    tagOffset: Object.freeze({ x: 102, y: 24 }),
  }),
  C1841: Object.freeze({
    x: 1117.5,
    y: 2205,
    width: 11,
    height: 32,
    rotation: 0,
    padding: 2,
    crop: Object.freeze({ x: 758, y: 2030, width: 720, height: 360 }),
    tagOffset: Object.freeze({ x: 102, y: 24 }),
  }),

  // Đường C19: dãy lẻ nằm phía trên tên đường.
  C1955: Object.freeze({
    x: 1192.5,
    y: 2314,
    width: 11,
    height: 33,
    rotation: 0,
    padding: 2,
    crop: Object.freeze({ x: 833, y: 2140, width: 720, height: 360 }),
    tagOffset: Object.freeze({ x: 28, y: 24 }),
  }),
  C1981: Object.freeze({
    x: 1332.5,
    y: 2314,
    width: 11,
    height: 33,
    rotation: 0,
    padding: 2,
    crop: Object.freeze({ x: 973, y: 2140, width: 720, height: 360 }),
    tagOffset: Object.freeze({ x: 28, y: 24 }),
  }),
  C19177: Object.freeze({
    x: 1910,
    y: 2314,
    width: 11,
    height: 33,
    rotation: 0,
    padding: 2,
    crop: Object.freeze({ x: 1550, y: 2140, width: 720, height: 360 }),
    tagOffset: Object.freeze({ x: 28, y: 24 }),
  }),
});
