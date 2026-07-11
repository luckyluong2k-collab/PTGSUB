const policies = {
  P3P9: {
    name: "P3-P9",
    hasCompletion: true,
    completionMode: "grossPlusMaintenance",
    completionDiscount: 0.07,
    noLoanDiscount: 0.05,
    fixedDiscounts: { Studio: 70000000, "1BR+": 100000000, "2BR": 150000000 },
    completionUnits: { Studio: 5100000, "1BR+": 4600000, "2BR": 5400000 },
    ttsJuly: { tts95: 0.125, tts70: 0.10, tts50: 0.08 },
    effectiveDate: "2026-04-16",
    handover: "2027-05-30",
    customerHandover: "2027-05-30",
    loanSupport: "HTLS 24 tháng, không muộn hơn 15/08/2028",
  },
  P10P18: {
    name: "P10/P16/P18",
    hasCompletion: true,
    completionMode: "netTimes112",
    completionDiscount: 0.03,
    noLoanDiscount: 0.05,
    fixedDiscounts: {},
    completionUnits: { Studio: 4722222, "1BR+": 4259259, "2BR": 5000000 },
    ttsJuly: { tts95: 0.095, tts70: 0.065, tts50: 0.035 },
    effectiveDate: "2026-05-01",
    handover: "2027-09-30",
    customerHandover: "2027-09-30",
    loanSupport: "HTLS 24 tháng, không muộn hơn 15/07/2028",
  },
  P7P15P19: {
    name: "P7/P15/P19",
    hasCompletion: false,
    completionMode: "none",
    completionDiscount: 0,
    noLoanDiscount: 0.05,
    fixedDiscounts: {},
    completionUnits: {},
    ttsJuly: { tts95: 0.115, tts70: 0.065, tts50: 0.035 },
    earlyBird: 0.01,
    effectiveDate: "2026-06-20",
    handover: "2027-09-30",
    customerHandover: "2027-09-30",
    loanSupport: "HTLS 30 tháng, không quá 31/10/2028",
  },
  P24P26: {
    name: "P24/P25/P26",
    hasCompletion: false,
    completionMode: "none",
    completionDiscount: 0,
    noLoanDiscount: 0.05,
    fixedDiscounts: {},
    completionUnits: {},
    ttsJuly: { tts95: 0.105, tts70: 0.055, tts50: 0.025 },
    earlyBird: 0.01,
    effectiveDate: "2026-03-11",
    handover: "2028-12-31",
    customerHandover: "2027-12-31",
    loanSupport: "HTLS 30 tháng, không quá 31/10/2028",
  },
  KHOIDE_P3P9: {
    name: "Khối đế P3-P9",
    defaultUnitType: "Khối đế",
    hasCompletion: false,
    completionMode: "none",
    completionDiscount: 0,
    noLoanDiscount: 0.05,
    fixedDiscounts: {},
    completionUnits: {},
    earlyBird: 0.03,
    tmdvDiscount: 0.10,
    tmdvDefault: true,
    ttsJuly: { tts95: 0.125, tts70: 0.08, tts50: 0.06 },
    effectiveDate: "2026-04-01",
    handover: "2027-05-30",
    loanSupport: "HTLS 30 tháng, không quá 24/09/2028",
  },
  KHOIDE_P10P11: {
    name: "Khối đế P10/P11",
    defaultUnitType: "Khối đế",
    hasCompletion: false,
    completionMode: "none",
    completionDiscount: 0,
    noLoanDiscount: 0.05,
    fixedDiscounts: {},
    completionUnits: {},
    earlyBird: 0.03,
    tmdvDiscount: 0.10,
    tmdvDefault: true,
    ttsJuly: { tts95: 0.14, tts70: 0.09, tts50: 0.065 },
    effectiveDate: "2026-05-06",
    handover: "2027-09-30",
    loanSupport: "HTLS 30 tháng, không quá 24/09/2028",
  },
  LOWRISE_LK: {
    name: "Thấp tầng LK",
    defaultUnitType: "Liền kề",
    hasCompletion: false,
    completionMode: "none",
    completionDiscount: 0,
    noLoanDiscount: 0.05,
    fixedDiscounts: {},
    completionUnits: {},
    areaDiscountPerSqm: 3000000,
    landUseRightUnitPrice: 12689776.73,
    maintenanceRate: 0.005,
    ttsJuly: { tts95: 0.21, tts70: 0.145, tts50: 0.12 },
    scenarioLabels: { tts95: "TTS 100%" },
    lowRiseTts100Schedule: true,
    effectiveDate: "2026-06-18",
    handover: "2027-04-30",
    loanSupport: "HTLS 36 tháng, không muộn hơn 30/06/2029",
  },
  LOWRISE_BT: {
    name: "Thấp tầng BT",
    defaultUnitType: "Biệt thự",
    hasCompletion: false,
    completionMode: "none",
    completionDiscount: 0,
    noLoanDiscount: 0.05,
    fixedDiscounts: {},
    completionUnits: {},
    areaDiscountPerSqm: 3000000,
    landUseRightUnitPrice: 12689776.73,
    maintenanceRate: 0.005,
    ttsJuly: { tts95: 0.16, tts70: 0.095, tts50: 0.07 },
    scenarioLabels: { tts95: "TTS 100%" },
    lowRiseTts100Schedule: true,
    effectiveDate: "2026-06-18",
    handover: "2027-04-30",
    loanSupport: "HTLS 36 tháng, không muộn hơn 30/06/2029",
  },
};

const depositByType = {
  Studio: 50000000,
  "1BR+": 100000000,
  "2BR": 150000000,
  "Khối đế": 200000000,
  "Liền kề": 200000000,
  "Biệt thự": 300000000,
};

let unitCatalog = {};
window.unitCatalog = unitCatalog;
const grossDividedPolicyKeys = new Set([
  "P3P9",
  "P10P18",
  "P7P15P19",
  "P24P26",
  "KHOIDE_P3P9",
  "KHOIDE_P10P11",
]);

const GOOGLE_SHEET_ID = "1zkzQCRqIgNtcMktWxE8PDc0fF4tuvMl9eY-ehHYfSiM";
const GOOGLE_SHEET_GIDS = [
  "1056952990",
  "696857310",
  "1047554448",
  "304330379",
  "2045467558",
  "1510790688",
  "442507581",
];

const scenarioLabels = {
  loan: "Có vay",
  standard: "Không vay",
  tts50: "TTS 50%",
  tts70: "TTS 70%",
  tts95: "TTS 95%",
};

const quoteScenarios = ["loan", "standard", "tts50", "tts70", "tts95"];

function scenarioLabel(scenario, policy = policies.P3P9) {
  return policy?.scenarioLabels?.[scenario] || scenarioLabels[scenario] || scenario;
}

const els = {
  unitCode: document.querySelector("#unitCode"),
  policyGroup: document.querySelector("#policyGroup"),
  unitType: document.querySelector("#unitType"),
  area: document.querySelector("#area"),
  areaLabel: document.querySelector("#areaLabel"),
  constructionArea: document.querySelector("#constructionArea"),
  constructionAreaRow: document.querySelector("#constructionAreaRow"),
  propertyDetailsGrid: document.querySelector("#propertyDetailsGrid"),
  pricingForm: document.querySelector("#pricingForm"),
  quoteDate: document.querySelector("#quoteDate"),
  listedGross: document.querySelector("#listedGross"),
  baseNet: document.querySelector("#baseNet"),
  bankGuarantee: document.querySelector("#bankGuarantee"),
  tmdvDiscount: document.querySelector("#tmdvDiscount"),
  tmdvDiscountRow: document.querySelector("#tmdvDiscountRow"),
  loanRatio: document.querySelector("#loanRatio"),
  totalPrice: document.querySelector("#totalPrice"),
  upfrontPrice: document.querySelector("#upfrontPrice"),
  upfrontLabel: document.querySelector("#upfrontLabel"),
  summaryBand: document.querySelector(".summary-band"),
  upfrontBox: document.querySelector("#upfrontPrice").parentElement,
  resultRows: document.querySelector("#resultRows"),
  discountRows: document.querySelector("#discountRows"),
  scheduleRows: document.querySelector("#scheduleRows"),
  copyBtn: document.querySelector("#copyBtn"),
  pdfBtn: document.querySelector("#pdfBtn"),
  multiQuoteBtn: document.querySelector("#multiQuoteBtn"),
  multiQuotePanel: document.querySelector("#multiQuotePanel"),
  multiQuoteGrid: document.querySelector("#multiQuoteGrid"),
  multiQuoteImageBtn: document.querySelector("#multiQuoteImageBtn"),
  multiQuotePdfBtn: document.querySelector("#multiQuotePdfBtn"),
  multiQuoteExportDialog: document.querySelector("#multiQuoteExportDialog"),
  multiQuoteExportInputs: document.querySelectorAll("[data-multi-export-scenario]"),
  multiQuoteExportCancel: document.querySelector("#multiQuoteExportCancel"),
  multiQuoteExportImage: document.querySelector("#multiQuoteExportImage"),
  multiQuoteExportPdf: document.querySelector("#multiQuoteExportPdf"),
  unitMapBtn: document.querySelector("#unitMapBtn"),
  unitMapDialog: document.querySelector("#unitMapDialog"),
  mapScenarioInputs: document.querySelectorAll("[data-map-scenario]"),
  unitMapCancel: document.querySelector("#unitMapCancel"),
  unitMapCreate: document.querySelector("#unitMapCreate"),
  unitMapPreview: document.querySelector("#unitMapPreview"),
  unitMapPreviewImage: document.querySelector("#unitMapPreviewImage"),
  unitMapOutputActions: document.querySelector("#unitMapOutputActions"),
  unitMapDownload: document.querySelector("#unitMapDownload"),
  unitMapCopy: document.querySelector("#unitMapCopy"),
  ttsChartPanel: document.querySelector("#ttsChartPanel"),
  ttsPriceChart: document.querySelector("#ttsPriceChart"),
  ttsChartTooltip: document.querySelector("#ttsChartTooltip"),
  ttsChartNow: document.querySelector("#ttsChartNow"),
  ttsChartMethod: document.querySelector("#ttsChartMethod"),
  ttsChartCurrent: document.querySelector("#ttsChartCurrent"),
  ttsChartEnd: document.querySelector("#ttsChartEnd"),
  ttsChartButtons: document.querySelectorAll("[data-tts-chart-scenario]"),
  pdfPrintArea: document.querySelector("#pdfPrintArea"),
  pdfOptionsDialog: document.querySelector("#pdfOptionsDialog"),
  pdfScenarioInputs: document.querySelectorAll("[data-pdf-scenario]"),
  pdfOptionsCancel: document.querySelector("#pdfOptionsCancel"),
  pdfOptionsExport: document.querySelector("#pdfOptionsExport"),
  resetBtn: document.querySelector("#resetBtn"),
  scenarioButtons: document.querySelectorAll(".segmented button"),
  filterTower: document.querySelector("#filterTower"),
  filterType: document.querySelector("#filterType"),
  filterFloor: document.querySelector("#filterFloor"),
  filterView: document.querySelector("#filterView"),
  filterDirection: document.querySelector("#filterDirection"),
  filterPriceSort: document.querySelector("#filterPriceSort"),
  filterToggle: document.querySelector("#filterToggle"),
  filterPanel: document.querySelector("#finderPanel"),
  filterContent: document.querySelector("#finderContent"),
  filterCount: document.querySelector("#filterCount"),
  comparisonCards: document.querySelector("#comparisonCards"),
  clearFilters: document.querySelector("#clearFilters"),
  toast: document.querySelector("#toast"),
};

let activeScenario = "loan";
let activeTtsChartScenario = "tts95";
let multiQuoteOpen = false;
let multiQuoteExportMode = "image";
let unitMapGeneratedImages = [];
let lastQuoteText = "";
let lastPolicyKey = "";
let lastAutoFilledCode = "";
let skipPolicyDefaultOnce = false;
let selectedUnitCode = normalizeUnitCode(els.unitCode.value);

const unitMapImage = "phankhupark-map.png";
const lowRiseMapImage = "lowrise-map-sharp.jpg";
const LOW_RISE_BASE_WIDTH = 2048;
const LOW_RISE_BASE_HEIGHT = 1448;
const LOW_RISE_SOURCE_SCALE = 2;
const LOW_RISE_STREETS = Array.from(
  { length: 22 },
  (_, index) => `C${index + 1}`
).sort((a, b) => b.length - a.length);

function parseLowRiseCodeParts(value) {
  const code = normalizeUnitCode(value);

  if (!/^C\d+$/.test(code)) {
    return {
      street: "",
      house: "",
    };
  }

  const street = LOW_RISE_STREETS.find((item) => {
    return code.startsWith(item) && code.length > item.length;
  }) || "";

  if (!street) {
    return {
      street: "",
      house: "",
    };
  }

  return {
    street,
    house: code.slice(street.length),
  };
}

function scaleLowRiseValue(value) {
  return Math.round(value * LOW_RISE_SOURCE_SCALE);
}

function scaleLowRiseRect(rect) {
  return {
    x: scaleLowRiseValue(rect.x),
    y: scaleLowRiseValue(rect.y),
    width: scaleLowRiseValue(rect.width),
    height: scaleLowRiseValue(rect.height),
  };
}

function scaleLowRisePoint(point) {
  return {
    x: scaleLowRiseValue(point.x),
    y: scaleLowRiseValue(point.y),
  };
}

function makeLowRiseMapLocation(x, y, options = {}) {
  const width = options.width || 22;
  const height = options.height || 46;
  const cropWidth = options.cropWidth || 850;
  const cropHeight = options.cropHeight || 430;
  const maxCropX = Math.max(0, LOW_RISE_BASE_WIDTH - cropWidth);
  const maxCropY = Math.max(0, LOW_RISE_BASE_HEIGHT - cropHeight);
  const cropX = Math.min(maxCropX, Math.max(0, options.cropX ?? x - 300));
  const cropY = Math.min(maxCropY, Math.max(0, options.cropY ?? y - 145));
  const labelOnLeft = options.labelOnLeft ?? x > 1300;
  const label = {
    x: labelOnLeft ? cropX + 24 : cropX + 430,
    y: cropY + 24,
    width: 390,
    height: 120,
  };

  return {
    image: lowRiseMapImage,
    scale: 0.32 * LOW_RISE_SOURCE_SCALE,
    crop: scaleLowRiseRect({ x: cropX, y: cropY, width: cropWidth, height: cropHeight }),
    unitRect: scaleLowRiseRect({ x, y, width, height }),
    label: scaleLowRiseRect(label),
    arrowStart: scaleLowRisePoint({
      x: labelOnLeft ? label.x + label.width : label.x,
      y: label.y + 125,
    }),
    arrowEnd: scaleLowRisePoint({ x: x + width / 2, y: y + height / 2 }),
  };
}

// Danh sách căn LK được duyệt để tạo ảnh chỉ căn (theo bảng hàng thấp tầng).
const lowRiseUnitMapLocations = {
  C6104: makeLowRiseMapLocation(1238, 366),
  C7177: makeLowRiseMapLocation(1394, 454, { labelOnLeft: true }),
  C1634: makeLowRiseMapLocation(702, 1000),
  C1707: makeLowRiseMapLocation(543, 1044),
  C1741: makeLowRiseMapLocation(766, 1044),
  C1807: makeLowRiseMapLocation(541, 1100),
  C1837: makeLowRiseMapLocation(742, 1100),
  C1841: makeLowRiseMapLocation(766, 1100),
  C1863: makeLowRiseMapLocation(1071, 1100),
  C1955: makeLowRiseMapLocation(846, 1158),
  C1981: makeLowRiseMapLocation(1037, 1158),
  C19177: makeLowRiseMapLocation(1394, 1100, { labelOnLeft: true }),
};

const unitMapExactLocations = {
  P90316: {
    image: unitMapImage,
    scale: 0.5,
    crop: { x: 1025, y: 750, width: 1300, height: 870 },
    towerRect: { x: 1181, y: 944, width: 155, height: 445 },
    unitRect: { x: 1268, y: 1208, width: 38, height: 32 },
    label: { x: 1370, y: 855, width: 835, height: 165 },
    arrowStart: { x: 1370, y: 992 },
    arrowEnd: { x: 1287, y: 1224 },
  },
};

function normalizeMapApartmentNo(value) {
  return normalizeUnitCode(value).replace(/^A(?=\d)/, "");
}

function makeMapUnitCells(rows, defaults = {}) {
  return rows.reduce((cells, row) => {
    row.labels.forEach((label, index) => {
      const keys = String(label).split("/").map(normalizeMapApartmentNo);
      const textWidth = /[A-Z]/.test(label) ? 24 : 20;
      const width = row.widths?.[index] || row.width || defaults.width || textWidth;
      const height = row.height || defaults.height || 28;
      const rect = {
        x: row.centers[index] - width / 2,
        y: row.y,
        width,
        height,
      };
      keys.forEach((key) => {
        cells[key] = rect;
      });
    });
    return cells;
  }, {});
}

function makeMapUnitColumnCells(columns, defaults = {}) {
  return columns.reduce((cells, column) => {
    column.labels.forEach((label, index) => {
      const keys = String(label).split("/").map(normalizeMapApartmentNo);
      const width = column.width || defaults.width || 32;
      const height = column.heights?.[index] || column.height || defaults.height || 24;
      const rect = {
        x: column.x - width / 2,
        y: column.centers[index] - height / 2,
        width,
        height,
      };
      keys.forEach((key) => {
        cells[key] = rect;
      });
    });
    return cells;
  }, {});
}

const parkCompactTopLabels = [
  "20", "21", "22", "23", "24", "25", "26", "27", "28",
  "29", "30", "31", "32", "33", "34", "35", "36", "37",
];
const parkCompactBottomLabels = [
  "19", "18", "17", "16", "15", "12B", "12A", "12", "11", "10", "09",
  "08", "07", "06", "05", "04", "03", "02", "01", "40", "39", "38",
];
const parkCompactTopCenters = [
  1504, 1522, 1538, 1572, 1583, 1599, 1614, 1629, 1645,
  1660, 1675, 1690, 1704, 1718, 1728, 1761, 1777, 1804,
];
const parkCompactBottomCenters = [
  1504, 1522, 1538, 1553, 1568, 1582, 1594, 1607, 1622, 1638, 1653,
  1668, 1683, 1698, 1713, 1728, 1740, 1755, 1769, 1782, 1796, 1810,
];

function shiftCenters(centers, offsetX) {
  return centers.map((center) => center + offsetX);
}

function makeParkCompactTower({ offsetX = 0, cropX, towerRect, labelX }) {
  return {
    image: unitMapImage,
    scale: 0.5,
    crop: { x: cropX, y: 650, width: 1550, height: 850 },
    towerRect,
    label: { x: labelX, y: 950, width: 820, height: 165 },
    units: makeMapUnitCells([
      { labels: parkCompactTopLabels, centers: shiftCenters(parkCompactTopCenters, offsetX), y: 828, height: 28 },
      { labels: parkCompactBottomLabels, centers: shiftCenters(parkCompactBottomCenters, offsetX), y: 858, height: 28 },
    ]),
  };
}

const unitMapTowerLayouts = {
  P7: {
    image: unitMapImage,
    scale: 0.5,
    crop: { x: 900, y: 600, width: 1000, height: 700 },
    towerRect: { x: 1206, y: 676, width: 84, height: 226 },
    label: { x: 1300, y: 705, width: 560, height: 165 },
    units: makeMapUnitColumnCells([
      {
        x: 1226,
        width: 30,
        height: 18,
        labels: ["19", "18", "17", "16", "15", "12B", "12A", "12", "11", "10", "09", "08"],
        centers: [689, 708, 727, 745, 762, 778, 817, 833, 849, 864, 880, 890],
      },
      {
        x: 1270,
        width: 30,
        height: 18,
        labels: ["20", "21", "22", "23", "24", "25", "26", "03A", "03", "05", "06", "07", "28"],
        centers: [689, 708, 727, 745, 762, 778, 793, 817, 833, 849, 864, 880, 890],
      },
    ]),
  },
  P9: {
    image: unitMapImage,
    scale: 0.5,
    crop: { x: 1025, y: 750, width: 1300, height: 870 },
    towerRect: { x: 1181, y: 944, width: 155, height: 445 },
    label: { x: 1370, y: 855, width: 835, height: 165 },
    units: makeMapUnitColumnCells([
      {
        x: 1222,
        width: 32,
        height: 22,
        labels: [
          "37", "36", "35", "34", "33", "32", "31", "30", "29",
          "28", "27", "26", "25", "24", "23", "22", "21", "20",
        ],
        centers: [
          973, 989, 1005, 1040, 1054, 1068, 1082, 1097, 1112,
          1127, 1142, 1157, 1172, 1186, 1199, 1238, 1253, 1270,
        ],
      },
      {
        x: 1287,
        width: 32,
        height: 22,
        labels: [
          "38", "39", "40", "01", "02", "03A", "03", "05", "06", "07",
          "08", "09", "10", "11", "12", "12A", "12B", "15", "16", "17", "18", "19",
        ],
        centers: [
          973, 989, 1005, 1020, 1035, 1048, 1058, 1073, 1087, 1102,
          1117, 1131, 1146, 1161, 1176, 1190, 1199, 1213, 1224, 1238, 1253, 1270,
        ],
      },
    ]),
  },
  P24: {
    image: unitMapImage,
    scale: 0.5,
    crop: { x: 880, y: 1300, width: 1200, height: 980 },
    towerRect: { x: 1067, y: 1519, width: 110, height: 313 },
    label: { x: 1190, y: 1440, width: 680, height: 165 },
    units: makeMapUnitColumnCells([
      {
        x: 1113,
        width: 32,
        height: 18,
        labels: [
          "04", "03", "02", "01", "39/40", "38", "37", "36", "35", "34",
          "33", "32", "31", "29/30", "28", "27", "26", "25", "24", "23",
        ],
        centers: [
          1530, 1543, 1557, 1585, 1601, 1616, 1631, 1646, 1661, 1677,
          1692, 1708, 1723, 1739, 1754, 1769, 1784, 1800, 1819, 1830,
        ],
      },
      {
        x: 1150,
        width: 32,
        height: 18,
        labels: ["06", "07", "08", "09", "10", "11", "12", "12A", "12B", "15", "16", "17", "18", "19", "20", "21", "22"],
        centers: [1530, 1543, 1557, 1601, 1616, 1631, 1646, 1661, 1677, 1692, 1708, 1723, 1739, 1754, 1769, 1800, 1830],
      },
    ]),
  },
  P25: {
    image: unitMapImage,
    scale: 0.5,
    crop: { x: 1010, y: 1300, width: 1200, height: 980 },
    towerRect: { x: 1218, y: 1519, width: 128, height: 313 },
    label: { x: 1360, y: 1440, width: 680, height: 165 },
    units: makeMapUnitColumnCells([
      {
        x: 1244,
        width: 34,
        height: 18,
        labels: ["37", "36", "35", "34", "33/34", "32", "31", "30", "29", "28", "27", "26", "25", "23/24", "21/22", "20"],
        centers: [1529, 1544, 1558, 1598, 1614, 1630, 1645, 1660, 1676, 1691, 1706, 1722, 1737, 1753, 1798, 1822],
      },
      {
        x: 1296,
        width: 34,
        height: 18,
        labels: ["38", "39", "40", "01", "02", "03", "03A", "05", "06", "07", "08", "09", "10", "11", "12", "12A", "12B", "15", "16", "17", "18", "19"],
        centers: [1529, 1544, 1558, 1573, 1588, 1603, 1614, 1630, 1645, 1660, 1676, 1691, 1706, 1722, 1737, 1753, 1764, 1794, 1808, 1822, 1830, 1830],
      },
    ]),
  },
  P26: {
    image: unitMapImage,
    scale: 0.5,
    crop: { x: 880, y: 1700, width: 1200, height: 580 },
    towerRect: { x: 1067, y: 1873, width: 110, height: 214 },
    label: { x: 1190, y: 1870, width: 680, height: 165 },
    units: makeMapUnitColumnCells([
      {
        x: 1113,
        width: 32,
        height: 18,
        labels: ["09", "07", "06", "05", "03A", "03", "02", "01", "24", "23", "22", "20/21", "19"],
        centers: [1882, 1907, 1922, 1937, 1953, 1968, 1984, 1998, 2013, 2028, 2044, 2058, 2080],
      },
      {
        x: 1150,
        width: 32,
        height: 18,
        labels: ["08", "10", "11", "12", "12A", "12B", "15", "16", "17", "18"],
        centers: [1882, 1922, 1937, 1953, 1968, 2013, 2028, 2044, 2058, 2080],
      },
    ]),
  },
  P15: makeParkCompactTower({
    cropX: 1125,
    towerRect: { x: 1492, y: 828, width: 333, height: 64 },
    labelX: 1840,
  }),
  P16: makeParkCompactTower({
    offsetX: 344,
    cropX: 1350,
    towerRect: { x: 1838, y: 828, width: 327, height: 64 },
    labelX: 1840,
  }),
  P18: {
    image: unitMapImage,
    scale: 0.5,
    crop: { x: 1700, y: 650, width: 1700, height: 850 },
    towerRect: { x: 2198, y: 828, width: 430, height: 64 },
    label: { x: 2200, y: 950, width: 960, height: 165 },
    units: makeMapUnitCells([
      {
        labels: [
          "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26",
          "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37",
        ],
        centers: [
          2206, 2223, 2238, 2266, 2277, 2292, 2307, 2322, 2337, 2352, 2368,
          2397, 2412, 2428, 2443, 2458, 2474, 2490, 2503, 2534, 2550, 2582,
        ],
        y: 828,
        height: 28,
      },
      {
        labels: [
          "15", "12B", "12A", "12", "11", "10", "09", "08", "07", "06", "05",
          "04A", "03", "02", "01", "50", "48A", "48", "47", "46", "45", "44",
          "43", "42", "41", "40", "39", "38",
        ],
        centers: [
          2206, 2223, 2238, 2253, 2268, 2282, 2297, 2312, 2328, 2343, 2358,
          2373, 2388, 2403, 2418, 2432, 2446, 2460, 2475, 2490, 2505, 2519,
          2534, 2549, 2564, 2578, 2592, 2612,
        ],
        y: 858,
        height: 28,
      },
    ]),
  },
};

function parseMoney(value) {
  if (typeof value === "number") return value;
  const cleaned = String(value || "").replace(/[^\d.-]/g, "");
  return Number(cleaned || 0);
}

function parseNumber(value) {
  const cleaned = String(value || "").replace(",", ".").replace(/[^\d.-]/g, "");
  return Number(cleaned || 0);
}

function parseSheetNumber(value) {
  if (typeof value === "number") return value;
  const text = String(value || "").trim();
  if (!text) return 0;
  const cleaned = text.replace(/[^\d,.-]/g, "");
  if (/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(cleaned)) {
    return Number(cleaned.replace(/\./g, "").replace(",", ".") || 0);
  }
  if (/^\d{1,3}(,\d{3})+(\.\d+)?$/.test(cleaned)) {
    return Number(cleaned.replace(/,/g, "") || 0);
  }
  return Number(cleaned.replace(",", ".") || 0);
}

function parseSheetMoney(value) {
  return round(parseSheetNumber(value));
}

function round(value) {
  return Math.round(Number(value || 0));
}

function money(value) {
  return `${round(value).toLocaleString("vi-VN")} đ`;
}

function inputMoney(value) {
  const rounded = round(value);
  return rounded ? rounded.toLocaleString("en-US") : "";
}

function percent(value) {
  return `${(value * 100).toLocaleString("vi-VN", { maximumFractionDigits: 2 })}%`;
}

function dateFromText(dateText) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(dateText || ""));
  if (match) {
    return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  }
  const parsed = new Date(dateText || "2026-07-08");
  if (Number.isNaN(parsed.getTime())) return new Date(2026, 6, 8);
  return parsed;
}

function addDays(dateValue, days) {
  const d = dateValue instanceof Date ? new Date(dateValue) : dateFromText(dateValue);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDateText(dateValue) {
  const d = dateValue instanceof Date ? dateValue : dateFromText(dateValue);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${d.getFullYear()}`;
}

function spreadDates(startValue, endValue, count) {
  const start = startValue instanceof Date ? new Date(startValue) : dateFromText(startValue);
  let end = endValue instanceof Date ? new Date(endValue) : dateFromText(endValue);
  if (end.getTime() <= start.getTime()) {
    end = addDays(start, (count - 1) * 30);
  }
  const step = (end.getTime() - start.getTime()) / Math.max(1, count - 1);
  return Array.from({ length: count }, (_, index) => new Date(start.getTime() + step * index));
}

function vatRate(policy) {
  return policy?.vatRate ?? 0.10;
}

function maintenanceRate(policy) {
  return policy?.maintenanceRate ?? 0.02;
}

function grossFactor(policy) {
  return policy?.grossFactor ?? (1 + vatRate(policy) + maintenanceRate(policy));
}

function syncBaseFromGross() {
  if (!grossDividedPolicyKeys.has(els.policyGroup.value)) return;
  els.baseNet.value = inputMoney(parseMoney(els.listedGross.value) / 1.12);
}

function formatMoneyInput(input) {
  input.value = inputMoney(parseMoney(input.value));
}

function normalizeUnitCode(value) {
  return String(value || "").trim().toUpperCase().replace(/\s+/g, "");
}

function normalizeFacet(value) {
  return String(value || "").trim().toLocaleLowerCase("vi-VN");
}

function normalizeHeaderText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLocaleLowerCase("vi-VN")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const highRiseTowers = [
  "P26", "P25", "P24", "P19", "P18", "P16", "P15", "P11", "P10",
  "P9", "P8", "P7", "P6", "P5", "P4", "P3",
];

function parseUnitCodeParts(code) {
  const normalized = normalizeUnitCode(code);
  if (!/^P\d/.test(normalized)) return { tower: "", floor: "", apartment: "" };
  const tower = highRiseTowers.find((item) => normalized.startsWith(item)) || "";
  if (!tower) return { tower: "", floor: "", apartment: "" };
  const rest = normalized.slice(tower.length);
  const floor = rest.match(/^(\d{2})/)?.[1] || "";
  const apartment = floor ? rest.slice(2) : "";
  return { tower, floor, apartment };
}

function rectCenter(rect) {
  return {
    x: rect.x + rect.width / 2,
    y: rect.y + rect.height / 2,
  };
}

function resolveUnitMapLocation(code) {
  const unitCode = normalizeUnitCode(code);
  if (lowRiseUnitMapLocations[unitCode]) return lowRiseUnitMapLocations[unitCode];
  if (unitMapExactLocations[unitCode]) return unitMapExactLocations[unitCode];

  const parsed = parseUnitCodeParts(unitCode);
  const layout = unitMapTowerLayouts[parsed.tower];
  const apartment = normalizeMapApartmentNo(parsed.apartment);
  const unitRect = layout?.units?.[apartment];
  if (!layout || !unitRect) return null;

  const arrowEnd = rectCenter(unitRect);
  return {
    image: layout.image,
    scale: layout.scale,
    crop: layout.crop,
    towerRect: layout.towerRect,
    unitRect,
    label: layout.label,
    arrowStart: layout.arrowStart || {
      x: layout.label.x + 42,
      y: layout.label.y + 42,
    },
    arrowEnd,
  };
}

function unitTower(unit, code = "") {
  const parsed = parseUnitCodeParts(code);
  return parsed.tower || unit.tower || policies[unit.policyGroup]?.name || "Chưa cập nhật";
}

function unitFloor(unit, code = "") {
  const parsed = parseUnitCodeParts(code);
  if (parsed.floor) return parsed.floor;
  const floor = String(unit.floor || "").trim();
  return floor || "";
}

function unitApartmentNumber(code, unit = {}) {
  const parsed = parseUnitCodeParts(code);
  return parsed.apartment || unit.apartmentNo || "";
}

function unitAreaText(unit) {
  if (unit.policyGroup === "LOWRISE_LK" || unit.policyGroup === "LOWRISE_BT") {
    const land = unit.landArea ?? unit.area;
    const construction = unit.constructionArea;
    return construction ? `Đất ${land} m2 / XD ${construction} m2` : `Đất ${land} m2`;
  }
  return unit.area ? `${unit.area} m2` : "Chưa cập nhật";
}

function optionValues(items, valueGetter) {
  const values = new Map();
  items.forEach((item) => {
    const value = String(valueGetter(item) || "").trim();
    const key = normalizeFacet(value);
    if (key && !values.has(key)) values.set(key, value);
  });
  return Array.from(values.values()).sort((a, b) =>
    a.localeCompare(b, "vi", { numeric: true, sensitivity: "base" })
  );
}

function fillFilterSelect(select, label, values) {
  const currentValue = select.value;
  select.innerHTML = "";
  const allOption = document.createElement("option");
  allOption.value = "";
  allOption.textContent = `Tất cả ${label}`;
  select.appendChild(allOption);
  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });
  if (values.includes(currentValue)) select.value = currentValue;
}

let catalogEntries = [];
let catalogLoading = true;

function isSaleCatalogCode(code) {
  const normalized = normalizeUnitCode(code);
  return /^P\d{3,}[A-Z0-9]*$/.test(normalized) || /^C\d{3,}[A-Z0-9]*$/.test(normalized);
}

function rebuildCatalogEntries() {
  const sanitizedCatalog = {};
  catalogEntries = Object.entries(unitCatalog).reduce((entries, [code, unit]) => {
    const normalizedCode = normalizeUnitCode(code);
    if (!isSaleCatalogCode(normalizedCode)) return entries;
    const parsed = parseUnitCodeParts(normalizedCode);
    const normalizedUnit = { ...unit };
    if (parsed.tower) normalizedUnit.tower = parsed.tower;
    if (parsed.floor) normalizedUnit.floor = parsed.floor;
    if (parsed.apartment) normalizedUnit.apartmentNo = parsed.apartment;
    sanitizedCatalog[normalizedCode] = normalizedUnit;
    entries.push({ code: normalizedCode, unit: normalizedUnit });
    return entries;
  }, []);
  unitCatalog = sanitizedCatalog;
  window.unitCatalog = unitCatalog;
}

rebuildCatalogEntries();

function gvizCellText(cell) {
  if (!cell) return "";
  return String(cell.f ?? cell.v ?? "").replace(/\s+/g, " ").trim();
}

function gvizCellNumber(cell) {
  if (!cell) return 0;
  return parseSheetNumber(cell.f ?? cell.v ?? "");
}

function gvizCellMoney(cell) {
  if (!cell) return 0;
  return parseSheetMoney(cell.f ?? cell.v ?? "");
}

function gvizValue(row, index) {
  return index >= 0 ? gvizCellText(row.c?.[index]) : "";
}

function gvizNumber(row, index) {
  return index >= 0 ? gvizCellNumber(row.c?.[index]) : 0;
}

function gvizMoney(row, index) {
  return index >= 0 ? gvizCellMoney(row.c?.[index]) : 0;
}

function rowText(row) {
  return (row.c || []).map(gvizCellText).filter(Boolean).join(" ");
}

function rowLabels(row) {
  return (row.c || []).map(gvizCellText);
}

function findColumn(labels, includes, excludes = []) {
  const includeNeedles = includes.map(normalizeHeaderText);
  const excludeNeedles = excludes.map(normalizeHeaderText);
  const matches = [];
  labels.forEach((label, index) => {
    const normalized = normalizeHeaderText(label);
    if (!includeNeedles.some((needle) => normalized.includes(needle))) return;
    if (excludeNeedles.some((needle) => normalized.includes(needle))) return;
    const exactScore = includeNeedles.includes(normalized) ? -1000 : 0;
    matches.push({ index, score: normalized.length + exactScore });
  });
  matches.sort((a, b) => a.score - b.score || a.index - b.index);
  return matches[0]?.index ?? -1;
}

function shortColumnIndex(labels, index, maxLength = 60) {
  if (index < 0) return -1;
  return normalizeHeaderText(labels[index]).length <= maxLength ? index : -1;
}

function preferredColumnIndex(labels, candidates, maxLength = 90) {
  for (const candidate of candidates) {
    const index = shortColumnIndex(
      labels,
      findColumn(labels, candidate.includes, candidate.excludes || []),
      candidate.maxLength || maxLength
    );
    if (index >= 0) return index;
  }
  return -1;
}

function headerScore(labels) {
  const normalized = labels.map(normalizeHeaderText);
  const has = (needle) => normalized.some((label) => label.includes(needle));
  let score = 0;
  if (has("ma can")) score += 4;
  if (has("dien tich")) score += 2;
  if (has("tong gia") || has("gia ban")) score += 2;
  if (has("tinh trang") || has("trang thai")) score += 2;
  if (has("loai can")) score += 1;
  if (has("toa")) score += 1;
  return score;
}

function detectSheetHeader(table) {
  const fallbackLabels = table.cols.map((column) => column.label || column.id || "");
  let best = {
    labels: fallbackLabels,
    startRow: 0,
    score: headerScore(fallbackLabels),
  };

  table.rows.slice(0, 80).forEach((row, index) => {
    const labels = rowLabels(row);
    const score = headerScore(labels);
    if (score > best.score) {
      best = {
        labels,
        startRow: index + 1,
        score,
      };
    }
  });

  return best.score >= 6 ? best : { labels: fallbackLabels, startRow: 0, score: best.score };
}

function statusNoteColumnIndexes(labels) {
  const needles = ["tinh trang", "trang thai", "ghi chu", "note", "status"];
  return labels.reduce((indexes, label, index) => {
    const normalized = normalizeHeaderText(label);
    if (needles.some((needle) => normalized.includes(needle))) indexes.push(index);
    return indexes;
  }, []);
}

function extractSheetCode(row, codeIdx) {
  const directCode = normalizeUnitCode(gvizValue(row, codeIdx));
  if (isSupportedSheetCode(directCode)) return directCode;

  const codeCell = (row.c || []).find((cell) => {
    return isSupportedSheetCode(normalizeUnitCode(gvizCellText(cell)));
  });
  return normalizeUnitCode(gvizCellText(codeCell));
}

function sheetCodeCellIndex(row, code) {
  const normalizedCode = normalizeUnitCode(code);
  return (row.c || []).findIndex((cell) => normalizeUnitCode(gvizCellText(cell)) === normalizedCode);
}

function looksLikeSheetNumber(value) {
  return Boolean(String(value || "").trim().match(/^\d+(?:[,.]\d+)?$/));
}

function lowRiseRowValue(row, codeCellIndex, offset) {
  return codeCellIndex >= 0 ? gvizValue(row, codeCellIndex + offset) : "";
}

function lowRiseRowNumber(row, codeCellIndex, offset) {
  return codeCellIndex >= 0 ? gvizNumber(row, codeCellIndex + offset) : 0;
}

function lowRiseRowMoney(row, codeCellIndex, offset) {
  return codeCellIndex >= 0 ? gvizMoney(row, codeCellIndex + offset) : 0;
}

function lowRiseCodeCellIndexes(row, code) {
  const normalizedCode = normalizeUnitCode(code);
  return (row.c || []).reduce((indexes, cell, index) => {
    if (normalizeUnitCode(gvizCellText(cell)) === normalizedCode) indexes.push(index);
    return indexes;
  }, []);
}

function lowRiseRowDetails(row, code) {
  const indexes = lowRiseCodeCellIndexes(row, code);
  for (const codeCellIndex of indexes) {
    const compactLayout = looksLikeSheetNumber(lowRiseRowValue(row, codeCellIndex, 2));
    const offsets = compactLayout
      ? { rawType: 1, view: 1, floor: 2, area: 3, constructionArea: 5, listedGross: 6 }
      : { rawType: 1, view: 2, floor: 3, area: 4, constructionArea: 6, listedGross: 7 };
    const listedGross = lowRiseRowMoney(row, codeCellIndex, offsets.listedGross);
    if (!listedGross) continue;
    return {
      rawType: lowRiseRowValue(row, codeCellIndex, offsets.rawType),
      view: lowRiseRowValue(row, codeCellIndex, offsets.view),
      floor: lowRiseRowValue(row, codeCellIndex, offsets.floor),
      area: lowRiseRowNumber(row, codeCellIndex, offsets.area),
      constructionArea: lowRiseRowNumber(row, codeCellIndex, offsets.constructionArea),
      listedGross,
    };
  }
  return null;
}

function nonEmptyUnitValueCount(unit) {
  return Object.values(unit).filter((value) => {
    return value !== null && value !== undefined && String(value).trim() !== "" && value !== 0;
  }).length;
}

function mergeCatalogUnit(catalog, metaByCode, code, unit, meta) {
  const current = catalog[code];
  if (!current) {
    catalog[code] = unit;
    metaByCode[code] = meta;
    return;
  }

  const incomingCount = nonEmptyUnitValueCount(unit);
  const currentCount = nonEmptyUnitValueCount(current);
  const currentMeta = metaByCode[code] || { gidIndex: -1, rowIndex: -1 };
  const incomingOrder = meta.gidIndex * 100000 + meta.rowIndex;
  const currentOrder = currentMeta.gidIndex * 100000 + currentMeta.rowIndex;

  if (incomingCount > currentCount || (incomingCount === currentCount && incomingOrder >= currentOrder)) {
    catalog[code] = unit;
    metaByCode[code] = meta;
  }
}

function inferTowerFromCode(code, rawTower = "") {
  const parsed = parseUnitCodeParts(code);
  if (parsed.tower) return parsed.tower;
  const tower = String(rawTower || "").trim().toUpperCase().match(/^P\d{1,2}/)?.[0];
  return tower || "";
}

function inferFloorFromCode(code, tower = "") {
  const parsed = parseUnitCodeParts(code);
  if (tower && parsed.tower && parsed.tower !== tower) return "";
  return parsed.floor;
}

function isPodiumType(value) {
  const normalized = normalizeHeaderText(value);
  return /\b(sh|shld|shophouse|khoi de|thuong mai|tmdv)\b/.test(normalized);
}

function isLowRiseCode(code) {
  return /^C\d{3,}[A-Z0-9]*$/.test(normalizeUnitCode(code));
}

function isSupportedSheetCode(code) {
  return isSaleCatalogCode(code);
}

function normalizeSheetUnitType(rawType, policyGroup) {
  const normalized = normalizeHeaderText(rawType);
  if (policyGroup === "LOWRISE_BT") return "Biệt thự";
  if (policyGroup === "LOWRISE_LK") return "Liền kề";
  if (policyGroup === "KHOIDE_P3P9" || policyGroup === "KHOIDE_P10P11") return "Khối đế";
  if (normalized.includes("studio") || normalized === "stu") return "Studio";
  if (normalized.includes("2br") || normalized.includes("2pn")) return "2BR";
  if (normalized.includes("1br") || normalized.includes("1pn")) return "1BR+";
  return rawType || "";
}

function isUnavailableSheetStatus(status) {
  const normalized = normalizeHeaderText(status);
  if (!normalized) return false;
  const phrases = [
    "da ban",
    "ban het",
    "da xoa",
    "da an",
    "da bo",
    "da thu hoi",
    "thu hoi",
    "ngung ban",
    "khong ban",
    "da huy",
    "sold",
  ];
  if (phrases.some((phrase) => normalized.includes(phrase))) return true;
  return ["xoa", "an", "bo", "huy", "khoa"].some((word) => {
    return new RegExp(`(^| )${word}( |$)`).test(normalized);
  });
}

function rowHasUnavailableSheetStatus(row, statusNoteIndexes = []) {
  const cells = statusNoteIndexes.length
    ? statusNoteIndexes.map((index) => row.c?.[index])
    : (row.c || []);
  return cells.some((cell) => isUnavailableSheetStatus(gvizCellText(cell)));
}

function inferPolicyGroup(code, tower, rawType, title) {
  const normalizedTitle = normalizeHeaderText(title);
  const normalizedType = normalizeHeaderText(rawType);
  if (isLowRiseCode(code) || normalizedTitle.includes("thap tang") || normalizedTitle.includes("flora")) {
    return normalizedType.includes("biet thu") ? "LOWRISE_BT" : "LOWRISE_LK";
  }
  if (isPodiumType(rawType)) {
    return ["P10", "P11"].includes(tower) ? "KHOIDE_P10P11" : "KHOIDE_P3P9";
  }
  if (["P3", "P4", "P5", "P6", "P8", "P9"].includes(tower)) return "P3P9";
  if (["P10", "P16", "P18"].includes(tower)) return "P10P18";
  if (["P7", "P15", "P19"].includes(tower)) return "P7P15P19";
  if (["P24", "P25", "P26"].includes(tower)) return "P24P26";
  if (["P10", "P11"].includes(tower)) return "KHOIDE_P10P11";
  return "";
}

function parseGoogleSheetUnits(response, { gid = "", gidIndex = 0 } = {}) {
  const table = response?.table;
  const stats = {
    gid,
    readRows: 0,
    acceptedRows: 0,
    rejectedRows: 0,
  };
  if (!table?.rows?.length) return { units: {}, stats, metaByCode: {} };
  const detected = detectSheetHeader(table);
  const labels = detected.labels;
  const title = [
    ...table.cols.map((column) => column.label || column.id || ""),
    ...table.rows.slice(0, detected.startRow).map(rowText),
  ].join(" ");
  if (normalizeHeaderText(title).includes("ma tran")) return { units: {}, stats, metaByCode: {} };
  const codeIdx = shortColumnIndex(labels, findColumn(labels, ["ma can"]), 40);
  const rawTypeIdx = preferredColumnIndex(labels, [
    { includes: ["loai can"] },
    { includes: ["vi tri"], excludes: ["chi can", "tinh trang", "trang thai"] },
    { includes: ["phan khu"] },
  ], 80);
  const towerIdx = shortColumnIndex(labels, findColumn(labels, ["toa"]), 30);
  const viewIdx = preferredColumnIndex(labels, [
    { includes: ["view"] },
    { includes: ["vi tri"], excludes: ["chi can", "tinh trang", "trang thai"] },
  ], 80);
  const directionIdx = shortColumnIndex(labels, findColumn(labels, ["huong"]), 30);
  const floorIdx = preferredColumnIndex(labels, [
    { includes: ["tang cao"] },
    { includes: ["tang"], excludes: ["dtang", "tang 1"] },
  ], 45);
  const areaIdx = preferredColumnIndex(labels, [
    { includes: ["dien tich thong thuy"] },
    { includes: ["dien tich dat"] },
    { includes: ["dien tich"], excludes: ["xay dung"] },
    { includes: ["dtd"] },
    { includes: ["dt d"] },
  ], 80);
  const constructionIdx = preferredColumnIndex(labels, [
    { includes: ["tong dtxd"] },
    { includes: ["tong dien tich xay dung"] },
    { includes: ["dtxd"], excludes: ["tang 1"] },
  ], 80);
  const baseNetIdx = preferredColumnIndex(labels, [
    { includes: ["gia chua"], excludes: ["tts"] },
    { includes: ["chua gom vat"], excludes: ["tts"] },
    { includes: ["chua vat"], excludes: ["tts"] },
    { includes: ["gia tho chua"], excludes: ["tts"] },
  ], 150);
  const salesPolicyIdx = preferredColumnIndex(labels, [
    { includes: ["csbh"], maxLength: 40 },
    { includes: ["chinh sach ban hang"], maxLength: 80 },
  ], 80);
  const grossIdx = preferredColumnIndex(labels, [
    { includes: ["tong gia ban can ho bao gom vat"], excludes: ["chua", "tts"] },
    { includes: ["tong gia gom vat"], excludes: ["chua", "tts"] },
    { includes: ["gia da gom vat"], excludes: ["chua", "tts"] },
    { includes: ["bao gom vat kpbt"], excludes: ["chua", "tts"] },
    { includes: ["tong gia ban ra thi truong"], excludes: ["tts"] },
    { includes: ["gia ban ra thi truong"], excludes: ["tts"] },
    { includes: ["tong tien thanh toan"], excludes: ["tts"] },
  ], 170);
  const noteIndexes = statusNoteColumnIndexes(labels);
  const units = {};
  const metaByCode = {};

  table.rows.slice(detected.startRow).forEach((row, rowIndex) => {
    stats.readRows += 1;
    const rejectRow = () => {
      stats.rejectedRows += 1;
    };
    const code = extractSheetCode(row, codeIdx);
    if (!isSupportedSheetCode(code)) {
      rejectRow();
      return;
    }

    if (rowHasUnavailableSheetStatus(row, noteIndexes)) {
      rejectRow();
      return;
    }

    const isLowRise = isLowRiseCode(code);
    const lowRiseDetails = isLowRise ? lowRiseRowDetails(row, code) : null;
    const rawType = lowRiseDetails?.rawType || gvizValue(row, rawTypeIdx);
    const tower = inferTowerFromCode(code, gvizValue(row, towerIdx));
    const policyGroup = inferPolicyGroup(code, tower, rawType, title);
    if (!policyGroup || !policies[policyGroup]) {
      rejectRow();
      return;
    }

    let listedGross = lowRiseDetails?.listedGross || 0;
    if (!listedGross) listedGross = gvizMoney(row, grossIdx);
    let baseNet = gvizMoney(row, baseNetIdx);
    const area = isLowRise
      ? lowRiseDetails?.area || gvizNumber(row, areaIdx)
      : gvizNumber(row, areaIdx);
    const constructionArea = isLowRise
      ? lowRiseDetails?.constructionArea || gvizNumber(row, constructionIdx)
      : gvizNumber(row, constructionIdx);

    if (!listedGross && baseNet && grossDividedPolicyKeys.has(policyGroup)) {
      listedGross = round(baseNet * 1.12);
    }
    if (!baseNet && listedGross && grossDividedPolicyKeys.has(policyGroup)) {
      baseNet = round(listedGross / 1.12);
    }
    if (!baseNet && listedGross && area && (policyGroup === "LOWRISE_LK" || policyGroup === "LOWRISE_BT")) {
      const policy = policies[policyGroup];
      const landUseRightValue = policy.landUseRightUnitPrice
        ? round(policy.landUseRightUnitPrice * area)
        : 0;
      baseNet = round((listedGross + landUseRightValue * vatRate(policy)) / grossFactor(policy));
    }

    const unitType = normalizeSheetUnitType(rawType, policyGroup);
    const salesPolicy = gvizValue(row, salesPolicyIdx);
    const unit = {
      policyGroup,
      source: "google-sheet",
    };
    if (unitType) unit.unitType = unitType;
    if (area) unit.area = area;
    if (listedGross) unit.listedGross = listedGross;
    if (baseNet) unit.baseNet = baseNet;
    if (tower) unit.tower = tower;
    if (policyGroup === "LOWRISE_LK" || policyGroup === "LOWRISE_BT") {
      if (area) unit.landArea = area;
      if (constructionArea) unit.constructionArea = constructionArea;
      if (lowRiseDetails?.view && !looksLikeSheetNumber(lowRiseDetails.view)) {
        unit.view = lowRiseDetails.view;
      } else if (rawType) {
        unit.view = rawType;
      }
    } else {
      const view = gvizValue(row, viewIdx);
      const direction = gvizValue(row, directionIdx);
      if (view) unit.view = view;
      if (direction) unit.direction = direction;
    }
    if (salesPolicy) {
      unit.salesPolicy = salesPolicy;
      unit.sunSignatureEligible = normalizeHeaderText(salesPolicy).includes("sun signature");
    }
    const parsedCode = parseUnitCodeParts(code);
    const floor = lowRiseDetails?.floor || parsedCode.floor || gvizValue(row, floorIdx) || inferFloorFromCode(code, tower);
    if (floor) unit.floor = parsedCode.floor || String(parseSheetNumber(floor) || floor);
    if (parsedCode.apartment) unit.apartmentNo = parsedCode.apartment;
    mergeCatalogUnit(units, metaByCode, code, unit, {
      gid,
      gidIndex,
      rowIndex: detected.startRow + rowIndex,
    });
    stats.acceptedRows += 1;
  });
  return { units, stats, metaByCode };
}

function loadGoogleSheet(gid) {
  return new Promise((resolve, reject) => {
    const callbackName = `__sheet_${gid}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const script = document.createElement("script");
    const timeout = window.setTimeout(() => {
      cleanup();
      reject(new Error("Quá thời gian đọc bảng"));
    }, 12000);
    function cleanup() {
      window.clearTimeout(timeout);
      delete window[callbackName];
      script.remove();
    }
    window[callbackName] = (response) => {
      cleanup();
      resolve(response);
    };
    script.onerror = () => {
      cleanup();
      reject(new Error("Không đọc được bảng"));
    };
    const query = `out:json;responseHandler:${callbackName}`;
    script.src = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?tqx=${encodeURIComponent(query)}&gid=${encodeURIComponent(gid)}&v=${Date.now()}`;
    document.head.appendChild(script);
  });
}

async function refreshCatalogFromGoogle({ showSuccessToast = true } = {}) {
  const sheetJobs = GOOGLE_SHEET_GIDS.map((gid, gidIndex) => {
    return loadGoogleSheet(gid).then((response) => ({ gid, gidIndex, response }));
  });
  const results = await Promise.allSettled(sheetJobs);
  const freshCatalog = {};
  const freshMetaByCode = {};
  results.forEach((result, resultIndex) => {
    const gid = GOOGLE_SHEET_GIDS[resultIndex];
    if (result.status !== "fulfilled") {
      console.warn(`[Google Sheet ${gid}] lỗi đồng bộ:`, result.reason);
      return;
    }

    const { units, stats, metaByCode } = parseGoogleSheetUnits(result.value.response, {
      gid: result.value.gid,
      gidIndex: result.value.gidIndex,
    });
    Object.entries(units).forEach(([code, unit]) => {
      mergeCatalogUnit(freshCatalog, freshMetaByCode, code, unit, metaByCode[code]);
    });
    console.log(
      `[Google Sheet ${stats.gid}] đọc ${stats.readRows} dòng, loại ${stats.rejectedRows} dòng, nhận ${stats.acceptedRows} dòng`
    );
  });
  const freshCount = Object.keys(freshCatalog).length;
  console.log(`[Google Sheet] tổng mã sau khi gộp: ${freshCount}`);
  if (!freshCount) throw new Error("Không có mã căn hợp lệ trong bảng hàng");
  unitCatalog = freshCatalog;
  window.unitCatalog = unitCatalog;
  catalogLoading = false;
  rebuildCatalogEntries();
  populateFinderOptions();
  lastAutoFilledCode = "";
  applyUnitCatalog();
  renderFinder();
  render();
  if (showSuccessToast) showToast(`Đã lọc còn ${freshCount} căn theo bảng hàng`);
  return freshCount;
}

function populateFinderOptions() {
  fillFilterSelect(els.filterTower, "tòa", optionValues(catalogEntries, ({ code, unit }) => unitTower(unit, code)));
  fillFilterSelect(els.filterType, "loại căn", optionValues(catalogEntries, ({ unit }) => unit.unitType));
  fillFilterSelect(els.filterFloor, "tầng", optionValues(catalogEntries, ({ code, unit }) => unitFloor(unit, code)));
  fillFilterSelect(els.filterView, "view", optionValues(catalogEntries, ({ unit }) => unit.view));
  fillFilterSelect(els.filterDirection, "hướng", optionValues(catalogEntries, ({ unit }) => unit.direction));
}

function unitCard({ code, unit }) {
  const tower = unitTower(unit, code);
  const floor = unitFloor(unit, code);
  const apartmentNo = unitApartmentNumber(code, unit);
  const view = unit.view || "Chưa cập nhật";
  const direction = unit.direction || "Chưa cập nhật";
  const isSelected = code === selectedUnitCode;
  return `
    <button class="unit-card${isSelected ? " selected" : ""}" type="button"
      data-unit-code="${escapeHtml(code)}" aria-pressed="${isSelected}">
      <span class="unit-card-heading">
        <strong>${escapeHtml(code)}</strong>
        <span>${escapeHtml(tower)}</span>
      </span>
      <span class="unit-card-price">
        <small>Giá niêm yết đã gồm VAT/KPBT</small>
        <strong>${escapeHtml(money(unit.listedGross))}</strong>
      </span>
      <span class="unit-card-details">
        <span><b>Loại</b><em>${escapeHtml(unit.unitType || "Chưa cập nhật")}</em></span>
        <span><b>Tầng</b><em>${escapeHtml(floor || "Chưa cập nhật")}</em></span>
        <span><b>Căn</b><em>${escapeHtml(apartmentNo || "Chưa cập nhật")}</em></span>
        <span><b>Hướng</b><em>${escapeHtml(direction)}</em></span>
        <span><b>View</b><em>${escapeHtml(view)}</em></span>
        <span class="unit-card-wide"><b>Diện tích</b><em>${escapeHtml(unitAreaText(unit))}</em></span>
      </span>
    </button>`;
}

function renderFinder() {
  if (catalogLoading) {
    els.filterCount.textContent = "Đang tải bảng hàng";
    els.comparisonCards.innerHTML = '<div class="finder-empty">Đang kết nối Google Sheet để lọc căn đang mở bán...</div>';
    return;
  }

  const tower = normalizeFacet(els.filterTower.value);
  const type = normalizeFacet(els.filterType.value);
  const floor = normalizeFacet(els.filterFloor.value);
  const view = normalizeFacet(els.filterView.value);
  const direction = normalizeFacet(els.filterDirection.value);
  const priceSort = els.filterPriceSort.value === "desc" ? -1 : 1;

  const matches = catalogEntries
    .filter(({ code, unit }) => {
      if (tower && normalizeFacet(unitTower(unit, code)) !== tower) return false;
      if (type && normalizeFacet(unit.unitType) !== type) return false;
      if (floor && normalizeFacet(unitFloor(unit, code)) !== floor) return false;
      if (view && normalizeFacet(unit.view) !== view) return false;
      if (direction && normalizeFacet(unit.direction) !== direction) return false;
      return true;
    })
    .sort((a, b) =>
      (a.unit.listedGross - b.unit.listedGross) * priceSort || a.code.localeCompare(b.code, "vi")
    );

  const shown = matches.slice(0, 4);
  els.filterCount.textContent = `${shown.length}/${matches.length} căn`;
  els.comparisonCards.innerHTML = shown.length
    ? shown.map(unitCard).join("")
    : '<div class="finder-empty">Không có căn phù hợp</div>';
}

function ensureUnitTypeOption(value) {
  if (!value || !els.unitType?.options) return;
  const exists = Array.from(els.unitType.options).some((option) => option.value === value);
  if (!exists) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    els.unitType.appendChild(option);
  }
}

function applyUnitCatalog() {
  const code = normalizeUnitCode(els.unitCode.value);
  if (!code || code === lastAutoFilledCode) return false;
  lastAutoFilledCode = code;

  const unit = unitCatalog[code];
  if (!unit) return false;

  els.unitCode.value = code;
  if (unit.policyGroup && policies[unit.policyGroup]) {
    els.policyGroup.value = unit.policyGroup;
    skipPolicyDefaultOnce = true;
    lastPolicyKey = "";
  }
  if (unit.unitType) {
    ensureUnitTypeOption(unit.unitType);
    els.unitType.value = unit.unitType;
  }
  const isLowRise = unit.policyGroup === "LOWRISE_LK" || unit.policyGroup === "LOWRISE_BT";
  const area = isLowRise ? unit.landArea ?? unit.area : unit.area;
  els.area.value = area ? String(area) : "";
  els.constructionArea.value = isLowRise && unit.constructionArea
    ? String(unit.constructionArea)
    : "";
  if (unit.listedGross) {
    els.listedGross.value = inputMoney(unit.listedGross);
  }
  if (grossDividedPolicyKeys.has(unit.policyGroup)) {
    syncBaseFromGross();
  } else {
    els.baseNet.value = unit.baseNet ? inputMoney(unit.baseNet) : "";
  }

  selectedUnitCode = code;
  renderFinder();
  showToast(`Đã tự điền mã căn ${code}`);
  return true;
}

function discountStepFromJuly2026(dateText) {
  const d = dateFromText(dateText || "2026-07-01");
  if (Number.isNaN(d.getTime())) return 0;
  const monthOffset = (d.getFullYear() - 2026) * 12 + (d.getMonth() - 6);
  const step = monthOffset + (d.getDate() >= 25 ? 1 : 0);
  return step;
}

function rollingTtsRate(policy, scenario, dateText) {
  if (!["tts50", "tts70", "tts95"].includes(scenario)) return 0;
  const base = policy.ttsJuly[scenario] || 0;
  const steps = discountStepFromJuly2026(dateText);
  return Math.max(0, base - steps * 0.005);
}

function syncScenarioButtons(policy) {
  els.scenarioButtons.forEach((button) => {
    button.textContent = scenarioLabel(button.dataset.scenario, policy);
  });
}

function syncPolicyControls(policy) {
  const policyKey = els.policyGroup.value;
  const isNewPolicy = policyKey !== lastPolicyKey;
  const isLowRise = policyKey === "LOWRISE_LK" || policyKey === "LOWRISE_BT";

  if (isNewPolicy) {
    if (skipPolicyDefaultOnce) {
      skipPolicyDefaultOnce = false;
    } else if (policy.defaultUnitType) {
      els.unitType.value = policy.defaultUnitType;
    } else if (!["Studio", "1BR+", "2BR"].includes(els.unitType.value)) {
      els.unitType.value = "Studio";
    }

    if (els.tmdvDiscount) {
      els.tmdvDiscount.checked = Boolean(policy.tmdvDiscount && (policy.tmdvDefault ?? true));
    }

    if (grossDividedPolicyKeys.has(policyKey)) syncBaseFromGross();
    lastPolicyKey = policyKey;
  }

  els.areaLabel.textContent = isLowRise ? "Diện tích đất" : "Diện tích";
  els.constructionAreaRow.hidden = !isLowRise;
  els.propertyDetailsGrid.classList.toggle("lowrise", isLowRise);

  if (els.tmdvDiscountRow) {
    els.tmdvDiscountRow.hidden = !policy.tmdvDiscount;
  }
  syncScenarioButtons(policy);
}

function completionBreakdown(policy, unitType, area) {
  if (!policy.hasCompletion) return { grossWithVat: 0, maintenance: 0, total: 0 };
  const unit = policy.completionUnits[unitType] || 0;
  let grossWithVat = 0;
  let maintenance = 0;
  if (policy.completionMode === "grossPlusMaintenance") {
    grossWithVat = round(unit * area);
    maintenance = round((unit / 1.1) * area * 0.02);
  } else if (policy.completionMode === "netTimes112") {
    const net = unit * area;
    grossWithVat = round(net * 1.1);
    maintenance = round(net * 0.02);
  }
  return { grossWithVat, maintenance, total: grossWithVat + maintenance };
}

function completionValue(policy, unitType, area) {
  return completionBreakdown(policy, unitType, area).total;
}

function buildStandardSchedule(result) {
  const deposit = depositByType[result.unitType] || 0;
  const quoteDate = dateFromText(els.quoteDate.value);
  const handoverDate = dateFromText(result.policy.handover);
  const secondDate = addDays(quoteDate, 9);
  const installmentDates = spreadDates(addDays(secondDate, 60), addDays(handoverDate, -14), 15);
  const completion = completionBreakdown(result.policy, result.unitType, result.area);
  const paymentBasisRawWithVat = result.paymentBasisRawWithVat || result.rawWithVat;

  const rows = [
    [`Cọc (${formatDateText(quoteDate)})`, deposit],
    [`Lần 2 - 15% (${formatDateText(secondDate)})`, round(paymentBasisRawWithVat * 0.15 - deposit)],
  ];

  if (completion.total) {
    rows.push([
      `Ký HĐMB - 70% hoàn thiện (${formatDateText(addDays(secondDate, 3))})`,
      round(completion.grossWithVat * 0.70),
    ]);
  }

  rows.push([`Lần 3 - 10% (${formatDateText(installmentDates[0])})`, round(result.rawWithVat * 0.10)]);
  for (let index = 0; index < 14; index += 1) {
    rows.push([
      `Lần ${index + 4} - 5% (${formatDateText(installmentDates[index + 1])})`,
      round(result.rawWithVat * 0.05),
    ]);
  }

  rows.push([
    `Bàn giao - KPBT + thuế 5% (${formatDateText(handoverDate)})`,
    round(result.maintenance + result.vat * 0.05 + completion.grossWithVat * 0.30 + completion.maintenance),
  ]);
  rows.push([`5% GCN (${formatDateText(handoverDate)})`, round(result.netAfterDiscount * 0.05)]);

  const totalRows = rows.reduce((sum, [, amount]) => sum + round(amount), 0);
  const diff = result.total - totalRows;
  if (diff) rows[rows.length - 2][1] = round(rows[rows.length - 2][1] + diff);

  return rows;
}

function ttsRatioFromScenario(scenario, policy) {
  if (policy?.paymentRatios?.[scenario]) return policy.paymentRatios[scenario];
  if (scenario === "tts50") return 0.50;
  if (scenario === "tts70") return 0.70;
  if (scenario === "tts95") return 0.95;
  return 0;
}

function ttsDeadlineFromQuote(dateText) {
  const quoteDate = dateFromText(dateText);
  const deadline = new Date(quoteDate.getFullYear(), quoteDate.getMonth(), 25);
  if (quoteDate.getDate() > 25) {
    deadline.setMonth(deadline.getMonth() + 1);
  }
  return deadline;
}

function buildTtsSchedule(result) {
  const ttsRatio = ttsRatioFromScenario(result.scenario, result.policy);
  const deposit = depositByType[result.unitType] || 0;
  const quoteDateText = result.quoteDate || els.quoteDate.value;
  const quoteDate = dateFromText(quoteDateText);
  const deadline = ttsDeadlineFromQuote(quoteDateText);
  const handoverDate = dateFromText(result.policy.handover);
  const completion = completionBreakdown(result.policy, result.unitType, result.area);
  const paymentBasisRawWithVat = result.rawWithVat;
  const isLowRiseTts100 = Boolean(result.policy.lowRiseTts100Schedule && result.scenario === "tts95");
  const rows = [
    [`Cọc (${formatDateText(quoteDate)})`, deposit],
  ];

  if (isLowRiseTts100) {
    rows.push([
      `Thanh toán lần 2 95% (${formatDateText(deadline)})`,
      Math.max(0, round(paymentBasisRawWithVat * 0.95 - deposit)),
    ]);
  } else {
    rows.push([
      `Thanh toán lần 2 ${scenarioLabel(result.scenario, result.policy)} (${formatDateText(deadline)})`,
      Math.max(0, round(paymentBasisRawWithVat * ttsRatio - deposit)),
    ]);
  }

  if (completion.total) {
    rows.push([`Ký HĐMB - 70% hoàn thiện`, round(completion.grossWithVat * 0.70)]);
  }

  if (result.scenario === "tts50") {
    rows.push([`Đợt tiếp theo - 5%`, round(result.rawWithVat * 0.05)]);
    rows.push([`Đợt tiếp theo - 10%`, round(result.rawWithVat * 0.10)]);
    rows.push([
      `Bàn giao - 30% + KPBT/thuế (${formatDateText(handoverDate)})`,
      round(result.rawWithVat * 0.30 + result.maintenance + result.vat * 0.05 + completion.grossWithVat * 0.30 + completion.maintenance),
    ]);
  } else if (result.scenario === "tts70") {
    rows.push([`Đợt tiếp theo - 10%`, round(result.rawWithVat * 0.10)]);
    rows.push([`Đợt tiếp theo - 10%`, round(result.rawWithVat * 0.10)]);
    rows.push([
      `Bàn giao - 5% + KPBT/thuế (${formatDateText(handoverDate)})`,
      round(result.rawWithVat * 0.05 + result.maintenance + result.vat * 0.05 + completion.grossWithVat * 0.30 + completion.maintenance),
    ]);
  } else {
    rows.push([
      `Bàn giao - KPBT + thuế 5% (${formatDateText(handoverDate)})`,
      round(result.maintenance + result.vat * 0.05 + completion.grossWithVat * 0.30 + completion.maintenance),
    ]);
  }

  rows.push([`5% GCN`, round(result.netAfterDiscount * 0.05)]);

  const totalRows = rows.reduce((sum, [, amount]) => sum + round(amount), 0);
  const diff = result.total - totalRows;
  if (diff) rows[rows.length - 2][1] = round(rows[rows.length - 2][1] + diff);

  return rows;
}

function emphasizePercentText(text, enabled = true) {
  if (!enabled) return String(text);
  return String(text).replace(/(\d+(?:[,.]\d+)?%)/g, '<b class="discount-percent">$1</b>');
}

function shouldEmphasizePercent(label) {
  return /CK|TTS|Early Bird|Không vay|bảo lãnh|hoàn thiện/i.test(String(label));
}

function applyDiscount(items, label, rateOrAmount, base, isRate = true) {
  const amount = isRate ? round(base * rateOrAmount) : round(rateOrAmount);
  if (amount > 0) {
    items.push({ label, amount, rate: isRate ? rateOrAmount : null });
  }
  return base - amount;
}

function calculate(options = {}) {
  const policy = policies[els.policyGroup.value];
  const unitType = els.unitType.value;
  const area = parseNumber(els.area.value);
  const constructionArea = parseNumber(els.constructionArea.value);
  const listedGross = parseMoney(els.listedGross.value);
  const baseNet = parseMoney(els.baseNet.value);
  const loanRatio = Math.max(0, Math.min(100, parseNumber(els.loanRatio.value))) / 100;
  const scenario = options.scenario || activeScenario;
  const quoteDateText = options.quoteDate || els.quoteDate.value;
  const includeGuarantee = options.includeGuarantee ?? els.bankGuarantee.checked;
  const discounts = [];

  let remaining = baseNet;
  const fixed = policy.fixedDiscounts[unitType] || 0;
  remaining = applyDiscount(discounts, `CK loại căn ${unitType}`, fixed, remaining, false);

  if (policy.areaDiscountPerSqm) {
    const discountArea = constructionArea || area;
    remaining = applyDiscount(
      discounts,
      `CK hoàn thiện/vào ở sớm ${money(policy.areaDiscountPerSqm)}/m2`,
      policy.areaDiscountPerSqm * discountArea,
      remaining,
      false
    );
  }

  if (policy.tmdvDiscount && els.tmdvDiscount?.checked) {
    remaining = applyDiscount(discounts, `CK TMDV ${percent(policy.tmdvDiscount)}`, policy.tmdvDiscount, remaining);
  }

  if (policy.earlyBird) {
    remaining = applyDiscount(discounts, `Early Bird ${percent(policy.earlyBird)}`, policy.earlyBird, remaining);
  }

  if (policy.completionDiscount) {
    remaining = applyDiscount(
      discounts,
      `CK gói hoàn thiện ${percent(policy.completionDiscount)}`,
      policy.completionDiscount,
      remaining
    );
  }

  if (scenario !== "loan") {
    remaining = applyDiscount(discounts, "Không vay 5%", policy.noLoanDiscount, remaining);
  }

  if (includeGuarantee) {
    remaining = applyDiscount(discounts, "CK bảo lãnh NH 1%", 0.01, remaining);
  }

  const ttsRate = rollingTtsRate(policy, scenario, quoteDateText);
  if (ttsRate) {
    remaining = applyDiscount(discounts, `CK ${scenarioLabel(scenario, policy)} ${percent(ttsRate)}`, ttsRate, remaining);
  }

  const netAfterDiscount = round(remaining);
  const landUseRightValue = policy.landUseRightUnitPrice
    ? round(policy.landUseRightUnitPrice * area)
    : 0;
  const vatBase = Math.max(0, netAfterDiscount - landUseRightValue);
  const vat = round(vatBase * vatRate(policy));
  const maintenance = round(netAfterDiscount * maintenanceRate(policy));
  const rawGrossAfterDiscount = netAfterDiscount + vat + maintenance;
  const completion = completionValue(policy, unitType, area);
  const total = rawGrossAfterDiscount + completion;
  const rawWithVat = netAfterDiscount + vat;
  const noGuaranteeBasis = includeGuarantee
    ? calculate({ scenario, quoteDate: quoteDateText, includeGuarantee: false })
    : null;
  const paymentBasisRawWithVat = noGuaranteeBasis
    ? noGuaranteeBasis.netAfterDiscount + noGuaranteeBasis.vat
    : rawWithVat;
  const bankDisbursement = scenario === "loan" ? round(rawWithVat * loanRatio) : 0;
  const deposit = depositByType[unitType] || 0;

  let upfront = 0;
  let schedule = [];
  if (scenario === "loan") {
    const payment2 = round(paymentBasisRawWithVat * 0.15 - deposit);
    const payment4 = round(paymentBasisRawWithVat * 0.10);
    upfront = deposit + payment2 + payment4;

    schedule = [
      ["Trả trước 25%", upfront],
      [`NH giải ngân ${percent(loanRatio)}`, bankDisbursement],
      ["Bàn giao", round(maintenance + vat * 0.05 + completion * 0.30)],
      ["5% GCN", round(netAfterDiscount * 0.05)],
    ];
    if (completion) {
      schedule.splice(1, 0, ["HĐMB - 70% nội thất", round(completion * 0.70)]);
    }
  } else if (scenario === "standard") {
    schedule = buildStandardSchedule({
      policy,
      unitType,
      area,
      netAfterDiscount,
      vat,
      maintenance,
      total,
      rawWithVat,
      paymentBasisRawWithVat,
    });
  } else {
    schedule = buildTtsSchedule({
      policy,
      scenario,
      quoteDate: quoteDateText,
      unitType,
      area,
      netAfterDiscount,
      vat,
      maintenance,
      total,
      rawWithVat,
      paymentBasisRawWithVat,
    });
  }

  return {
    policy,
    quoteDate: quoteDateText,
    scenario,
    unitType,
    area,
    constructionArea,
    listedGross,
    baseNet,
    discounts,
    netAfterDiscount,
    landUseRightValue,
    vatBase,
    vat,
    maintenance,
    rawGrossAfterDiscount,
    completion,
    total,
    rawWithVat,
    paymentBasisRawWithVat,
    bankDisbursement,
    loanRatio,
    upfront,
    schedule,
    ttsRate,
  };
}

function row(label, value, className = "") {
  const markPercent = shouldEmphasizePercent(label);
  return `<div class="row ${className}"><span>${emphasizePercentText(label, markPercent)}</span><strong>${emphasizePercentText(value, markPercent)}</strong></div>`;
}

function safeText(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function quoteUnitLabel(result = {}) {
  const unitCode = normalizeUnitCode(els.unitCode.value) || els.unitCode.value.trim() || "Căn hộ";
  const unitType = String(result.unitType || els.unitType.value || "").trim();
  return unitType ? `${unitCode} - ${unitType}` : unitCode;
}

function quoteCardStat(label, value, icon, tone = "primary") {
  return `
    <div class="quote-stat quote-stat-${tone}">
      <div class="quote-stat-top">
        <span>${safeText(label)}</span>
        <em>${safeText(icon)}</em>
      </div>
      <strong>${safeText(value)}</strong>
    </div>`;
}

function quoteCardDetail(label, value, className = "") {
  const markPercent = shouldEmphasizePercent(label);
  const formattedValue = emphasizePercentText(safeText(value), markPercent);
  return `
    <div class="quote-detail ${className}">
      <span>${safeText(label)}</span>
      <strong>${formattedValue}</strong>
    </div>`;
}

function quoteCardDiscountSummary(discounts) {
  const totalDiscount = discounts.reduce((sum, item) => sum + round(item.amount), 0);
  const rows = discounts.length
    ? discounts.map((item) => {
      const markPercent = shouldEmphasizePercent(item.label);
      const label = emphasizePercentText(safeText(item.label), markPercent);
      return `
        <li>
          <span>${label}</span>
          <strong>${safeText(money(item.amount))}</strong>
        </li>`;
    }).join("")
    : `<li><span>Chưa có chiết khấu</span><strong>${safeText(money(0))}</strong></li>`;

  return `
    <div class="quote-detail quote-discount-summary wide">
      <span>Tổng chiết khấu được nhận</span>
      <strong>${safeText(money(totalDiscount))}</strong>
      <ul class="quote-discount-list">${rows}</ul>
    </div>`;
}

const SUN_SIGNATURE_POINT_VALUE = 330;
const SUN_SIGNATURE_TIERS = [
  { name: "Infinity", min: 40000000000, rate: 0.02 },
  { name: "Platinum", min: 30000000000, rate: 0.015 },
  { name: "Gold", min: 15000000000, rate: 0.01 },
  { name: "Silver", min: 1, rate: 0.007 },
];

function formatPoints(value) {
  return `${round(value).toLocaleString("vi-VN")} điểm`;
}

function sunSignatureReward(result) {
  const completion = completionBreakdown(result.policy, result.unitType, result.area);
  const transactionValue = round(result.rawWithVat + completion.grossWithVat);
  const tier = SUN_SIGNATURE_TIERS.find((item) => transactionValue >= item.min) || {
    name: "Member",
    rate: 0,
  };
  const points = tier.rate ? round((transactionValue * tier.rate) / SUN_SIGNATURE_POINT_VALUE) : 0;
  return { transactionValue, tier, points };
}

function isCurrentUnitSunSignatureEligible() {
  const unitCode = normalizeUnitCode(els.unitCode.value);
  return Boolean(unitCatalog[unitCode]?.sunSignatureEligible);
}

function quoteCardSunSignatureReward(result) {
  if (!isCurrentUnitSunSignatureEligible()) return "";
  const reward = sunSignatureReward(result);
  const rewardRows = [
    ["Hạng dự kiến", reward.tier.name],
    ["Hệ số điểm thưởng", percent(reward.tier.rate)],
    ["Giá trị tính điểm", money(reward.transactionValue)],
  ];

  return `
    <div class="quote-detail quote-signature-reward wide">
      <span>Điểm thưởng Sun Signature dự kiến</span>
      <strong>${safeText(formatPoints(reward.points))}</strong>
      <ul class="quote-signature-list">
        ${rewardRows.map(([label, value]) => `
          <li>
            <span>${safeText(label)}</span>
            <strong>${safeText(value)}</strong>
          </li>`).join("")}
      </ul>
      <p>Điểm thưởng dùng cho dịch vụ/quyền lợi trong hệ sinh thái Sun Signature, không trừ trực tiếp vào giá căn và sẽ đổ theo tiến độ thanh toán.</p>
    </div>`;
}

function renderQuoteCard(result, isLoan, isTts) {
  const unitCode = els.unitCode.value.trim() || "Căn hộ";
  const unitLabel = quoteUnitLabel(result);
  const scenario = scenarioLabel(result.scenario, result.policy);
  const depositRow = result.schedule[0] || ["Cọc", 0];
  const paymentRow = result.schedule[1] || ["Đợt tiếp theo", 0];
  const stats = [
    quoteCardStat("Giá Cuối Phải TT", money(result.total), "VND", "green"),
  ];

  if (isLoan) {
    stats.push(quoteCardStat("Trả trước 25%", money(result.upfront), "25%", "warm"));
    stats.push(quoteCardStat(`NH giải ngân ${percent(result.loanRatio)}`, money(result.bankDisbursement), "NH", "blue"));
  } else if (isTts) {
    stats.push(quoteCardStat(depositRow[0], money(depositRow[1]), "Cọc", "warm"));
    stats.push(quoteCardStat(paymentRow[0], money(paymentRow[1]), "TTS", "blue"));
  } else {
    stats.push(quoteCardStat("Giá niêm yết đã gồm VAT/KPBT", money(result.listedGross), "VAT", "warm"));
    stats.push(quoteCardStat("Giá thô sau CK", "", "CK", "blue"));
  }

  const rawGrossAfterDiscountText = result.scenario === "standard" ? "" : money(result.rawGrossAfterDiscount);
  const details = [
    quoteCardDetail("Mã căn - loại căn", unitLabel),
    quoteCardDetail("Nhóm tòa", result.policy.name),
    ...(result.policy.customerHandover
      ? [quoteCardDetail("Ngày dự kiến nhận bàn giao nhà", formatDateText(result.policy.customerHandover))]
      : []),
    quoteCardDetail("Giá niêm yết đã gồm VAT/KPBT", money(result.listedGross)),
    quoteCardDetail("Giá thô sau CK", rawGrossAfterDiscountText),
    quoteCardDetail("Giá nội thất/hoàn thiện", money(result.completion)),
  ];

  details.push(quoteCardDiscountSummary(result.discounts));
  const signatureReward = quoteCardSunSignatureReward(result);
  if (signatureReward) details.push(signatureReward);
  if (isLoan) {
    details.push(quoteCardDetail("HTLS", result.policy.loanSupport, "wide"));
  }

  return `
    <article class="quote-card" aria-label="Phiếu báo giá ${safeText(unitCode)}">
      <div class="quote-card-hero">
        <div>
          <p class="quote-eyebrow">Phiếu báo giá nhanh</p>
          <h3>${safeText(unitLabel)} - ${safeText(result.policy.name)}</h3>
          <p class="quote-subtitle">Phương án: <strong>${safeText(scenario)}</strong></p>
        </div>
        <span class="quote-badge">${safeText(scenario)}</span>
      </div>
      <div class="quote-stats">${stats.join("")}</div>
      <div class="quote-detail-grid">${details.join("")}</div>
    </article>`;
}

function multiQuoteSecondary(result) {
  const isLoan = result.scenario === "loan";
  const isTts = isTtsScenario(result.scenario);
  if (isLoan) {
    return {
      label: "Trả trước 25%",
      value: money(result.upfront),
      meta: `NH giải ngân ${percent(result.loanRatio)}: ${money(result.bankDisbursement)}`,
    };
  }
  if (isTts) {
    const depositRow = result.schedule[0] || ["Cọc", 0];
    const paymentRow = result.schedule[1] || ["Giải ngân lần 2", 0];
    return {
      label: depositRow[0],
      value: money(depositRow[1]),
      metaLabel: paymentRow[0],
      metaValue: money(paymentRow[1]),
    };
  }
  const firstPayment = result.schedule[0] || ["Đợt 1", 0];
  return {
    label: firstPayment[0],
    value: money(firstPayment[1]),
    meta: "Không sử dụng hỗ trợ vay",
  };
}

function renderMultiQuoteCard(result) {
  const unitCode = els.unitCode.value.trim() || "Căn hộ";
  const unitLabel = quoteUnitLabel(result);
  const scenario = scenarioLabel(result.scenario, result.policy);
  const secondary = multiQuoteSecondary(result);
  const totalDiscount = result.discounts.reduce((sum, item) => sum + round(item.amount), 0);
  const rawGrossAfterDiscountText = result.scenario === "standard" ? "" : money(result.rawGrossAfterDiscount);
  const tone = result.scenario === "loan" ? "loan" : isTtsScenario(result.scenario) ? "tts" : "standard";

  return `
    <article class="multi-quote-card multi-quote-card-${tone}" aria-label="Báo giá ${safeText(scenario)}">
      <div class="multi-quote-head">
        <div>
          <span>${safeText(unitLabel)} - ${safeText(result.policy.name)}</span>
          <h3>${safeText(scenario)}</h3>
        </div>
        <em>${safeText(scenario)}</em>
      </div>
      <div class="multi-quote-stats">
        <div>
          <span>Giá cuối phải trả</span>
          <strong>${safeText(money(result.total))}</strong>
        </div>
        <div>
          <span>${safeText(secondary.label)}</span>
          <strong>${safeText(secondary.value)}</strong>
          ${secondary.metaValue
            ? `<small class="multi-quote-payment-extra"><span>${safeText(secondary.metaLabel)}:</span><b>${safeText(secondary.metaValue)}</b></small>`
            : `<small>${safeText(secondary.meta)}</small>`}
        </div>
      </div>
      <div class="multi-quote-details">
        <div><span>Giá niêm yết đã gồm VAT/KPBT</span><strong>${safeText(money(result.listedGross))}</strong></div>
        <div><span>Giá thô sau CK</span><strong>${safeText(rawGrossAfterDiscountText || "Theo tiến độ")}</strong></div>
        <div><span>Nội thất/hoàn thiện</span><strong>${safeText(money(result.completion))}</strong></div>
        <div><span>Tổng chiết khấu</span><strong>${safeText(money(totalDiscount))}</strong></div>
      </div>
      ${result.scenario === "loan" ? `<p class="multi-quote-note">${safeText(result.policy.loanSupport)}</p>` : ""}
    </article>`;
}

function renderMultiQuotePanel() {
  if (!els.multiQuotePanel || !els.multiQuoteGrid) return;
  els.multiQuotePanel.hidden = !multiQuoteOpen;
  els.multiQuoteBtn?.setAttribute("aria-expanded", String(multiQuoteOpen));
  els.multiQuoteBtn?.classList.toggle("open", multiQuoteOpen);
  if (!multiQuoteOpen) return;

  els.multiQuoteGrid.innerHTML = quoteScenarios
    .map((scenario) => renderMultiQuoteCard(calculate({ scenario })))
    .join("");
}

function selectedMultiQuoteExportScenarios() {
  return Array.from(els.multiQuoteExportInputs || [])
    .filter((input) => input.checked)
    .map((input) => input.value);
}

function syncMultiQuoteExportLabels() {
  const policy = policies[els.policyGroup.value] || policies.P3P9;
  els.multiQuoteExportInputs.forEach((input) => {
    const text = input.closest("label")?.querySelector("span");
    if (text) text.textContent = scenarioLabel(input.value, policy);
  });
}

function openMultiQuoteExportOptions(mode = "image") {
  multiQuoteExportMode = mode;
  syncMultiQuoteExportLabels();
  els.multiQuoteExportInputs.forEach((input) => {
    input.checked = true;
  });

  if (els.multiQuoteExportDialog?.showModal) {
    els.multiQuoteExportDialog.showModal();
    return;
  }

  runMultiQuoteExport(quoteScenarios, mode);
}

function canvasRoundRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function fillRoundedRect(ctx, x, y, width, height, radius, fill, stroke = "", lineWidth = 1) {
  ctx.save();
  canvasRoundRect(ctx, x, y, width, height, radius);
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
  ctx.restore();
}

function drawFittedText(ctx, text, x, y, maxWidth, size, weight = 800, color = "#17211f", minSize = 18) {
  let fontSize = size;
  ctx.save();
  ctx.fillStyle = color;
  do {
    ctx.font = `${weight} ${fontSize}px "Segoe UI", Arial, sans-serif`;
    if (ctx.measureText(text).width <= maxWidth || fontSize <= minSize) break;
    fontSize -= 1;
  } while (fontSize > minSize);
  ctx.fillText(text, x, y);
  ctx.restore();
  return fontSize;
}

function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight, options = {}) {
  const {
    maxLines = 2,
    size = 24,
    weight = 800,
    color = "#17211f",
  } = options;
  const words = String(text || "").split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";

  ctx.save();
  ctx.font = `${weight} ${size}px "Segoe UI", Arial, sans-serif`;
  words.forEach((word) => {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  });
  if (line) lines.push(line);

  ctx.fillStyle = color;
  lines.slice(0, maxLines).forEach((item, index) => {
    const suffix = index === maxLines - 1 && lines.length > maxLines ? "..." : "";
    ctx.fillText(`${item}${suffix}`, x, y + index * lineHeight);
  });
  ctx.restore();
  return y + Math.min(lines.length, maxLines) * lineHeight;
}

function multiQuoteExportTone(scenario) {
  if (scenario === "loan") return { bg: "#f7fffd", border: "#8ccdc4", badge: "#e2f2ef", badgeText: "#0b5f59" };
  if (isTtsScenario(scenario)) return { bg: "#f8fbff", border: "#b9d2f0", badge: "#e9f1ff", badgeText: "#1d4f91" };
  return { bg: "#fffdf6", border: "#d7c087", badge: "#fff3df", badgeText: "#7a4b0b" };
}

function drawExportStat(ctx, x, y, width, label, value, meta = "") {
  fillRoundedRect(ctx, x, y, width, 104, 12, "#ffffff", "#d8e4e1", 2);
  drawFittedText(ctx, label, x + 16, y + 28, width - 32, 21, 850, "#64736f", 15);
  if (!meta) {
    drawFittedText(ctx, value, x + 16, y + 64, width - 32, 30, 950, "#0f766e", 21);
    return;
  }

  const splitIndex = meta.lastIndexOf(": ");
  const metaLabel = splitIndex > -1 ? meta.slice(0, splitIndex + 1) : "";
  const metaValue = splitIndex > -1 ? meta.slice(splitIndex + 2) : meta;
  drawFittedText(ctx, value, x + 16, y + 56, width - 32, 24, 950, "#0f766e", 18);
  if (metaLabel) drawFittedText(ctx, metaLabel, x + 16, y + 78, width - 32, 15, 850, "#7a4b0b", 12);
  drawFittedText(ctx, metaValue, x + 16, y + 100, width - 32, 24, 950, "#7a4b0b", 18);
}

function drawExportDetail(ctx, x, y, width, label, value) {
  fillRoundedRect(ctx, x, y, width, 62, 10, "rgba(255,255,255,0.82)", "#dbe5e2", 1.5);
  drawFittedText(ctx, label, x + 12, y + 23, width - 24, 17, 800, "#64736f", 12);
  drawFittedText(ctx, value, x + 12, y + 48, width - 24, 20, 900, "#111c1a", 14);
}

function drawMultiQuoteExportCard(ctx, result, x, y, width, height) {
  const unitLabel = quoteUnitLabel(result);
  const scenario = scenarioLabel(result.scenario, result.policy);
  const secondary = multiQuoteSecondary(result);
  const secondaryMeta = secondary.metaValue
    ? `${secondary.metaLabel}: ${secondary.metaValue}`
    : secondary.meta;
  const totalDiscount = result.discounts.reduce((sum, item) => sum + round(item.amount), 0);
  const rawGrossAfterDiscountText = result.scenario === "standard" ? "Theo tiến độ" : money(result.rawGrossAfterDiscount);
  const tone = multiQuoteExportTone(result.scenario);

  ctx.save();
  ctx.shadowColor = "rgba(18, 38, 34, 0.10)";
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 8;
  fillRoundedRect(ctx, x, y, width, height, 16, tone.bg, tone.border, 2);
  ctx.restore();

  const pad = 24;
  const contentX = x + pad;
  const contentW = width - pad * 2;
  ctx.font = '950 18px "Segoe UI", Arial, sans-serif';
  const badgeW = Math.min(170, Math.max(118, ctx.measureText(scenario).width + 54));

  drawWrappedText(ctx, `${unitLabel} - ${result.policy.name}`, contentX, y + 36, contentW - badgeW - 14, 22, {
    size: 20,
    weight: 850,
    color: "#64736f",
    maxLines: 1,
  });
  drawFittedText(ctx, scenario, contentX, y + 72, contentW - badgeW - 14, 34, 950, "#0b5f59", 24);
  fillRoundedRect(ctx, x + width - pad - badgeW, y + 24, badgeW, 38, 999, tone.badge);
  drawFittedText(ctx, scenario, x + width - pad - badgeW + 18, y + 49, badgeW - 36, 18, 950, tone.badgeText, 13);

  const statGap = 16;
  const statW = (contentW - statGap) / 2;
  drawExportStat(ctx, contentX, y + 92, statW, "Giá cuối phải trả", money(result.total));
  drawExportStat(ctx, contentX + statW + statGap, y + 92, statW, secondary.label, secondary.value, secondaryMeta);

  const detailW = (contentW - statGap) / 2;
  const detailY = y + 216;
  drawExportDetail(ctx, contentX, detailY, detailW, "Giá niêm yết đã gồm VAT/KPBT", money(result.listedGross));
  drawExportDetail(ctx, contentX + detailW + statGap, detailY, detailW, "Giá thô sau CK", rawGrossAfterDiscountText);
  drawExportDetail(ctx, contentX, detailY + 76, detailW, "Nội thất/hoàn thiện", money(result.completion));
  drawExportDetail(ctx, contentX + detailW + statGap, detailY + 76, detailW, "Tổng chiết khấu", money(totalDiscount));
}

function buildMultiQuoteExportCanvas(scenarios) {
  const selected = scenarios.filter(Boolean);
  const results = selected.map((scenario) => calculate({ scenario }));
  const unitCode = normalizeUnitCode(els.unitCode.value) || "CAN-HO";
  const unitLabel = results[0] ? quoteUnitLabel(results[0]) : unitCode;
  const width = 1400;
  const margin = 48;
  const gap = 26;
  const columns = selected.length === 1 ? 1 : 2;
  const rows = Math.ceil(selected.length / columns);
  const headerHeight = 130;
  const cardHeight = 360;
  const cardWidth = columns === 1 ? width - margin * 2 : (width - margin * 2 - gap) / 2;
  const height = margin + headerHeight + rows * cardHeight + Math.max(0, rows - 1) * gap + margin;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#f4f7f6";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "#0f766e";
  ctx.fillRect(0, 0, width, 14);

  ctx.fillStyle = "#0b5f59";
  ctx.font = '950 44px "Segoe UI", Arial, sans-serif';
  ctx.fillText("Báo giá nhiều phương án", margin, margin + 34);
  ctx.fillStyle = "#64736f";
  ctx.font = '850 24px "Segoe UI", Arial, sans-serif';
  ctx.fillText(`${unitLabel} · ${results[0]?.policy?.name || ""}`, margin, margin + 70);
  ctx.fillText(`Ngày báo giá: ${formatDateText(els.quoteDate.value)}`, margin, margin + 104);

  results.forEach((result, index) => {
    const col = index % columns;
    const rowIndex = Math.floor(index / columns);
    const x = margin + col * (cardWidth + gap);
    const y = margin + headerHeight + rowIndex * (cardHeight + gap);
    drawMultiQuoteExportCard(ctx, result, x, y, cardWidth, cardHeight);
  });

  return canvas;
}

function multiQuoteExportFileName(scenarios, ext) {
  const unitCode = normalizeUnitCode(els.unitCode.value) || "can-ho";
  const suffix = scenarios.join("-") || "phuong-an";
  return `bao-gia-${unitCode}-${suffix}.${ext}`;
}

function runMultiQuoteExport(scenarios, mode = multiQuoteExportMode) {
  const selected = scenarios.filter(Boolean);
  if (!selected.length) {
    showToast("Chọn ít nhất một phương án");
    return;
  }

  const canvas = buildMultiQuoteExportCanvas(selected);
  if (mode === "pdf") {
    const originalTitle = document.title;
    document.title = `Báo giá nhiều phương án - ${normalizeUnitCode(els.unitCode.value) || "Căn hộ"}`;
    els.pdfPrintArea.innerHTML = `
      <div class="multi-quote-print-page">
        <img src="${canvas.toDataURL("image/png")}" alt="Báo giá nhiều phương án">
      </div>
    `;
    document.body.classList.add("print-mode", "multi-quote-print-mode");
    showToast("Đang mở hộp thoại lưu PDF");

    const cleanup = () => {
      document.body.classList.remove("print-mode", "multi-quote-print-mode");
      document.title = originalTitle;
      window.removeEventListener("afterprint", cleanup);
    };

    window.addEventListener("afterprint", cleanup);
    window.setTimeout(() => {
      window.print();
      window.setTimeout(cleanup, 60000);
    }, 80);
    return;
  }

  downloadCanvas(canvas, multiQuoteExportFileName(selected, "png"));
  showToast("Đang tải ảnh báo giá");
}

function discountRowsHtml(result) {
  const discountRows = result.discounts.map((item) => {
    const label = item.rate ? `${item.label}` : item.label;
    return row(label, money(item.amount));
  });
  discountRows.push(row("Giá chưa VAT/KPBT sau CK", money(result.netAfterDiscount), "highlight"));
  discountRows.push(row(`VAT ${percent(vatRate(result.policy))}`, money(result.vat)));
  discountRows.push(row(`KPBT ${percent(maintenanceRate(result.policy))}`, money(result.maintenance)));
  return discountRows.join("");
}

function scheduleRowsHtml(result) {
  return result.schedule.map(([label, value]) => {
    const className = /NH|Tổng|Trả|Bàn giao|GCN/.test(label) ? "highlight" : "";
    return row(label, money(value), className);
  }).join("");
}

function buildPdfSheet(result, isLoan, isTts) {
  const unitCode = els.unitCode.value.trim() || "Căn hộ";
  const unitLabel = quoteUnitLabel(result);
  const quoteDate = formatDateText(els.quoteDate.value);
  return `
    <article class="print-sheet">
      <header class="print-header">
        <img src="sun-group-logo.png" alt="Sun Group">
        <div>
          <p>Sun Urban City Hà Nam</p>
          <h1>Bảng tính giá Vhomes - Đối tác top 1 Sun Group</h1>
          <span>${safeText(unitLabel)} - ${safeText(result.policy.name)} | Ngày báo giá: ${safeText(quoteDate)}</span>
        </div>
      </header>

      <section class="print-section results">
        <h2>Kết quả</h2>
        <div class="result-list">${renderQuoteCard(result, isLoan, isTts)}</div>
      </section>

      <div class="print-columns">
        <section class="print-section compact">
          <h2>Chi tiết CK</h2>
          <div class="result-list">${discountRowsHtml(result)}</div>
        </section>
        <section class="print-section compact">
          <h2>Tiến độ tạm tính</h2>
          <div class="result-list">${scheduleRowsHtml(result)}</div>
        </section>
      </div>
    </article>`;
}

function pdfExportDateText(date = new Date()) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}-${month}-${date.getFullYear()}`;
}

function pdfDocumentTitle() {
  const unitCode = normalizeUnitCode(els.unitCode.value) || "Can-ho";
  return `Bảng tính giá Vhomes - ${unitCode} - ${pdfExportDateText()}`;
}

function isTtsScenario(scenario) {
  return ["tts50", "tts70", "tts95"].includes(scenario);
}

function buildPdfDocument(scenarios) {
  return scenarios.map((scenario) => {
    const result = calculate({ scenario });
    return buildPdfSheet(result, scenario === "loan", isTtsScenario(scenario));
  }).join("");
}

function selectedPdfScenarios() {
  return Array.from(els.pdfScenarioInputs)
    .filter((input) => input.checked)
    .map((input) => input.value);
}

function syncPdfScenarioLabels() {
  const policy = policies[els.policyGroup.value] || policies.P3P9;
  els.pdfScenarioInputs.forEach((input) => {
    const text = input.closest("label")?.querySelector("span");
    if (text) text.textContent = scenarioLabel(input.value, policy);
  });
}

function openPdfOptions() {
  syncPdfScenarioLabels();
  els.pdfScenarioInputs.forEach((input) => {
    input.checked = input.value === activeScenario;
  });

  if (els.pdfOptionsDialog?.showModal) {
    els.pdfOptionsDialog.showModal();
    return;
  }

  exportPdf([activeScenario]);
}

function exportPdf(scenarios = [activeScenario]) {
  const selectedScenarios = scenarios.filter(Boolean);
  if (!selectedScenarios.length) {
    showToast("Chọn ít nhất một phương án");
    return;
  }

  render();
  const originalTitle = document.title;
  document.title = pdfDocumentTitle();
  els.pdfPrintArea.innerHTML = buildPdfDocument(selectedScenarios);
  document.body.classList.add("print-mode");
  showToast("Đang mở hộp thoại lưu PDF");

  const cleanup = () => {
    document.body.classList.remove("print-mode");
    document.title = originalTitle;
    window.removeEventListener("afterprint", cleanup);
  };

  window.addEventListener("afterprint", cleanup);
  window.setTimeout(() => {
    window.print();
    window.setTimeout(cleanup, 60000);
  }, 80);
}

function selectedMapScenarios() {
  return Array.from(els.mapScenarioInputs || [])
    .filter((input) => input.checked)
    .map((input) => input.value);
}

function syncMapScenarioLabels() {
  const policy = policies[els.policyGroup.value] || policies.P3P9;
  els.mapScenarioInputs.forEach((input) => {
    const text = input.closest("label")?.querySelector("span");
    if (text) text.textContent = scenarioLabel(input.value, policy);
  });
}

function openUnitMapOptions() {
  const unitCode = normalizeUnitCode(els.unitCode.value);
  if (!resolveUnitMapLocation(unitCode)) {
    showToast(`Chưa có tọa độ mặt bằng cho căn ${unitCode || "này"}`);
    return;
  }

  syncMapScenarioLabels();
  els.mapScenarioInputs.forEach((input) => {
    input.checked = input.value === activeScenario;
  });
  unitMapGeneratedImages = [];
  if (els.unitMapPreview) els.unitMapPreview.hidden = true;
  if (els.unitMapPreviewImage) els.unitMapPreviewImage.removeAttribute("src");
  if (els.unitMapOutputActions) els.unitMapOutputActions.hidden = true;

  if (els.unitMapDialog?.showModal) {
    els.unitMapDialog.showModal();
    return;
  }

  createUnitMapImages([activeScenario]);
}

function loadMapImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Không tải được ảnh mặt bằng"));
    image.src = src;
  });
}

function drawMapRect(ctx, rect, color, lineWidth, scale = 1, glow = true) {
  ctx.save();
  if (glow) {
    ctx.strokeStyle = "rgba(255,255,255,0.92)";
    ctx.lineWidth = (lineWidth + 12) * scale;
    ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth * scale;
  ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
  ctx.restore();
}

function drawMapArrow(ctx, start, end, scale = 1) {
  const angle = Math.atan2(end.y - start.y, end.x - start.x);
  const size = 42 * scale;
  ctx.save();
  ctx.strokeStyle = "#ff2d2d";
  ctx.fillStyle = "#ff2d2d";
  ctx.lineWidth = 16 * scale;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(end.x, end.y);
  ctx.lineTo(end.x - size * Math.cos(angle - Math.PI / 6), end.y - size * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(end.x - size * Math.cos(angle + Math.PI / 6), end.y - size * Math.sin(angle + Math.PI / 6));
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function mapLabelLines(results = []) {
  const list = Array.isArray(results) ? results : [results];
  const firstResult = list[0] || {};
  const unitLabel = quoteUnitLabel(firstResult);
  const lines = [
    { text: unitLabel, size: unitLabel.length > 13 ? 72 : 86, weight: 900, color: "#ffffff" },
  ];

  list.forEach((result) => {
    const scenario = scenarioLabel(result.scenario, result.policy || firstResult.policy);
    lines.push({
      text: `${scenario}: ${money(result.total)}`,
      size: list.length > 2 ? 40 : 50,
      weight: 950,
      color: result.scenario === "loan" ? "#ffe278" : "#ffffff",
    });
    if (result.scenario === "loan") {
      lines.push({
        text: `Trả trước 25%: ${money(result.upfront)}`,
        size: list.length > 2 ? 31 : 42,
        weight: 850,
        color: "#ffffff",
      });
    }
  });

  return lines;
}

function drawMapLabel(ctx, label, results = [], scale = 1) {
  const list = Array.isArray(results) ? results : [results];
  const lines = mapLabelLines(list);
  const contentHeight = lines.reduce((sum, line) => sum + line.size + 24, 0) * scale;
  const height = Math.max(label.height, contentHeight + 44 * scale);
  ctx.save();
  ctx.fillStyle = "rgba(15, 118, 110, 0.92)";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
  ctx.lineWidth = 5 * scale;
  ctx.fillRect(label.x, label.y, label.width, height);
  ctx.strokeRect(label.x, label.y, label.width, height);

  let cursorY = label.y + 72 * scale;
  lines.forEach((line) => {
    drawFittedText(
      ctx,
      line.text,
      label.x + 72 * scale,
      cursorY,
      label.width - 110 * scale,
      line.size * scale,
      line.weight,
      line.color,
      Math.max(16, line.size * scale * 0.62)
    );
    cursorY += (line.size + 24) * scale;
  });
  ctx.restore();
}

function canvasToBlob(canvas) {
  return new Promise((resolve) => canvas.toBlob(resolve, "image/png", 0.94));
}

async function buildUnitMapImage(scenarios = [activeScenario]) {
  const selected = (Array.isArray(scenarios) ? scenarios : [scenarios]).filter(Boolean);
  const unitCode = normalizeUnitCode(els.unitCode.value);
  const location = resolveUnitMapLocation(unitCode);
  if (!location) throw new Error(`Chưa có tọa độ mặt bằng cho căn ${unitCode || "này"}`);

  const results = selected.map((scenario) => calculate({ scenario }));
  const image = await loadMapImage(location.image);
  const crop = location.crop;
  const outputCanvas = document.createElement("canvas");
  outputCanvas.width = crop.width;
  outputCanvas.height = crop.height;
  const ctx = outputCanvas.getContext("2d");
  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height
  );
  ctx.save();
  ctx.translate(-crop.x, -crop.y);
  const scale = location.scale || 1;
  if (location.towerRect) drawMapRect(ctx, location.towerRect, "#ff2d2d", 18, scale);
  drawMapRect(ctx, location.unitRect, "#ffea00", 6, scale, false);
  drawMapArrow(ctx, location.arrowStart, location.arrowEnd, scale);
  drawMapLabel(ctx, location.label, results, scale);
  ctx.restore();

  return {
    canvas: outputCanvas,
    filename: `chi-can-${unitCode}-${selected.join("-")}.png`,
  };
}

function downloadCanvas(canvas, filename) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL("image/png");
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function downloadUnitMapImages() {
  if (!unitMapGeneratedImages.length) {
    showToast("Hãy tạo ảnh trước");
    return;
  }

  unitMapGeneratedImages.forEach(({ canvas, filename }) => downloadCanvas(canvas, filename));
  showToast("Đang tải ảnh chỉ căn");
}

async function copyUnitMapImage() {
  const firstImage = unitMapGeneratedImages[0];
  if (!firstImage) {
    showToast("Hãy tạo ảnh trước");
    return;
  }

  if (!navigator.clipboard?.write || typeof ClipboardItem === "undefined") {
    showToast("Trình duyệt chưa hỗ trợ sao chép ảnh");
    return;
  }

  const blob = await canvasToBlob(firstImage.canvas);
  if (!blob) {
    showToast("Không sao chép được ảnh");
    return;
  }

  await navigator.clipboard.write([
    new ClipboardItem({ [blob.type]: blob }),
  ]);
  showToast("Đã sao chép ảnh");
}

async function createUnitMapImages(scenarios = [activeScenario]) {
  const selectedScenarios = (Array.isArray(scenarios) ? scenarios : [scenarios]).filter(Boolean);
  if (!selectedScenarios.length) {
    showToast("Chọn ít nhất một phương án");
    return;
  }

  try {
    const generated = [await buildUnitMapImage(selectedScenarios)];
    unitMapGeneratedImages = generated;

    const preview = generated[0];
    if (els.unitMapPreview && els.unitMapPreviewImage && preview) {
      els.unitMapPreviewImage.src = preview.canvas.toDataURL("image/png");
      els.unitMapPreview.hidden = false;
    }

    if (els.unitMapOutputActions) els.unitMapOutputActions.hidden = false;
    showToast(`Đã tạo ảnh chỉ căn với ${selectedScenarios.length} phương án`);
  } catch (error) {
    showToast(error.message || "Không tạo được ảnh chỉ căn");
  }
}

function isoDate(dateValue) {
  const d = dateValue instanceof Date ? dateValue : dateFromText(dateValue);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

function addMonths(dateValue, count) {
  const d = dateValue instanceof Date ? new Date(dateValue) : dateFromText(dateValue);
  d.setMonth(d.getMonth() + count);
  return d;
}

function monthText(dateValue) {
  const d = dateValue instanceof Date ? dateValue : dateFromText(dateValue);
  return `T${d.getMonth() + 1}/${d.getFullYear()}`;
}

function firstTtsChangeDateAfter(dateValue) {
  const start = dateValue instanceof Date ? new Date(dateValue) : dateFromText(dateValue);
  const d = new Date(start.getFullYear(), start.getMonth(), 25);
  if (d.getTime() <= start.getTime()) d.setMonth(d.getMonth() + 1);
  return d;
}

function nearestDateIndex(points, targetDate) {
  const target = targetDate.getTime();
  return points.reduce((best, point, index) => {
    const diff = Math.abs(point.date.getTime() - target);
    return diff < best.diff ? { index, diff } : best;
  }, { index: 0, diff: Infinity }).index;
}

function buildTtsChartPoints(policy, scenario) {
  const start = dateFromText(policy.effectiveDate || "2026-07-01");
  const current = dateFromText(els.quoteDate.value);
  const dates = new Map([[isoDate(start), start]]);
  let cursor = firstTtsChangeDateAfter(start);

  for (let index = 0; index < 60; index += 1) {
    dates.set(isoDate(cursor), new Date(cursor));
    if (rollingTtsRate(policy, scenario, isoDate(cursor)) <= 0) break;
    cursor = addMonths(cursor, 1);
  }

  const endDate = Array.from(dates.values()).sort((a, b) => a - b).at(-1);
  if (current.getTime() >= start.getTime() && current.getTime() <= endDate.getTime()) {
    dates.set(isoDate(current), current);
  }

  return Array.from(dates.values())
    .sort((a, b) => a - b)
    .map((date) => {
      const quoteDate = isoDate(date);
      const result = calculate({ scenario, quoteDate });
      return {
        date,
        quoteDate,
        label: monthText(date),
        price: result.total,
        rate: rollingTtsRate(policy, scenario, quoteDate),
      };
    });
}

function showTtsChartPoint(index, visible = true) {
  const state = els.ttsPriceChart?._chartState;
  if (!state || !state.points[index]) return;

  const point = state.points[index];
  const hoverLine = els.ttsPriceChart.querySelector("#ttsChartHoverLine");
  const hoverDot = els.ttsPriceChart.querySelector("#ttsChartHoverDot");
  if (hoverLine) {
    hoverLine.setAttribute("x1", point.x);
    hoverLine.setAttribute("x2", point.x);
    hoverLine.style.opacity = visible ? "0.7" : "0";
  }
  if (hoverDot) {
    hoverDot.setAttribute("cx", point.x);
    hoverDot.setAttribute("cy", point.y);
    hoverDot.style.opacity = visible ? "1" : "0";
  }

  const rect = els.ttsPriceChart.getBoundingClientRect();
  const scaleX = rect.width / state.width;
  const scaleY = rect.height / state.height;
  els.ttsChartTooltip.innerHTML = `
    <span>${safeText(scenarioLabel(activeTtsChartScenario, state.policy))} - ${safeText(formatDateText(point.date))}</span>
    <strong>${safeText(money(point.price))}</strong>
    <em>CK còn ${safeText(percent(point.rate))}</em>
  `;
  els.ttsChartTooltip.style.left = `${point.x * scaleX + 12}px`;
  els.ttsChartTooltip.style.top = `${point.y * scaleY + 12}px`;
  els.ttsChartTooltip.classList.toggle("visible", visible);
}

function nearestTtsChartPoint(clientX) {
  const state = els.ttsPriceChart?._chartState;
  if (!state) return 0;
  const rect = els.ttsPriceChart.getBoundingClientRect();
  const svgX = (clientX - rect.left) * state.width / rect.width;
  return state.points.reduce((best, point, index) => {
    const diff = Math.abs(point.x - svgX);
    return diff < best.diff ? { index, diff } : best;
  }, { index: 0, diff: Infinity }).index;
}

function renderTtsChart() {
  if (!els.ttsPriceChart) return;

  const policy = policies[els.policyGroup.value] || policies.P3P9;
  const points = buildTtsChartPoints(policy, activeTtsChartScenario);
  const currentDate = dateFromText(els.quoteDate.value);
  const currentIndex = nearestDateIndex(points, currentDate);
  const currentPoint = points[currentIndex];
  const endPoint = points[points.length - 1];
  const color = activeTtsChartScenario === "tts50"
    ? "#2563eb"
    : activeTtsChartScenario === "tts70"
      ? "#7c3aed"
      : "#be123c";
  const soft = activeTtsChartScenario === "tts50"
    ? "#eaf1ff"
    : activeTtsChartScenario === "tts70"
      ? "#f1eaff"
      : "#fff0f3";

  const width = 720;
  const height = 330;
  const margin = { top: 24, right: 18, bottom: 54, left: 76 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const prices = points.map((point) => point.price);
  const rawMin = Math.min(...prices);
  const rawMax = Math.max(...prices);
  const padding = Math.max(50000000, (rawMax - rawMin) * 0.15);
  const minValue = Math.max(0, Math.floor((rawMin - padding) / 50000000) * 50000000);
  const maxValue = Math.ceil((rawMax + padding) / 50000000) * 50000000 || 1;
  const span = Math.max(1, maxValue - minValue);
  const xStep = plotWidth / Math.max(1, points.length - 1);
  const toX = (index) => margin.left + index * xStep;
  const toY = (value) => margin.top + (maxValue - value) / span * plotHeight;
  const chartPoints = points.map((point, index) => ({
    ...point,
    x: toX(index),
    y: toY(point.price),
  }));
  const path = chartPoints.map((point, index) => `${index ? "L" : "M"} ${point.x} ${point.y}`).join(" ");
  const area = `${path} L ${chartPoints.at(-1).x} ${height - margin.bottom} L ${chartPoints[0].x} ${height - margin.bottom} Z`;
  const ticks = Array.from({ length: 5 }, (_, index) => minValue + span / 4 * index);
  const labelEvery = Math.max(1, Math.ceil(points.length / 7));
  const currentX = chartPoints[currentIndex].x;
  const bandWidth = Math.max(22, xStep * 0.78);

  els.ttsPriceChart.innerHTML = `
    <rect class="tts-current-band" x="${currentX - bandWidth / 2}" y="${margin.top}" width="${bandWidth}" height="${plotHeight}"></rect>
    ${ticks.map((value) => {
      const y = toY(value);
      return `
        <line class="tts-grid-line" x1="${margin.left}" y1="${y}" x2="${width - margin.right}" y2="${y}"></line>
        <text class="tts-axis-label" x="${margin.left - 9}" y="${y + 4}" text-anchor="end">${(value / 1000000000).toLocaleString("vi-VN", { maximumFractionDigits: 2 })} tỷ</text>
      `;
    }).join("")}
    ${chartPoints.map((point, index) => {
      const showLabel = index === 0 || index === points.length - 1 || index === currentIndex || index % labelEvery === 0;
      return `
        <line class="tts-grid-line" x1="${point.x}" y1="${margin.top}" x2="${point.x}" y2="${height - margin.bottom}" opacity="${showLabel ? "0.65" : "0.25"}"></line>
        ${showLabel ? `<text class="tts-axis-label" x="${point.x}" y="${height - 20}" text-anchor="middle">${safeText(point.label)}</text>` : ""}
      `;
    }).join("")}
    <line class="tts-axis-line" x1="${margin.left}" y1="${height - margin.bottom}" x2="${width - margin.right}" y2="${height - margin.bottom}"></line>
    <line class="tts-axis-line" x1="${margin.left}" y1="${margin.top}" x2="${margin.left}" y2="${height - margin.bottom}"></line>
    <text class="tts-axis-title" x="${margin.left}" y="16">Giá Phải TT</text>
    <text class="tts-axis-title" x="${width - margin.right}" y="${height - 5}" text-anchor="end">Đơn vị: tháng</text>
    <line class="tts-current-line" x1="${currentX}" y1="${margin.top}" x2="${currentX}" y2="${height - margin.bottom}"></line>
    <text class="tts-current-label" x="${Math.min(currentX + 8, width - 90)}" y="${margin.top + 17}">Hiện tại</text>
    <path class="tts-area" d="${area}" fill="${color}"></path>
    <path class="tts-line" d="${path}" stroke="${color}"></path>
    ${chartPoints.map((point, index) => `
      <circle class="tts-dot" cx="${point.x}" cy="${point.y}" r="${index === currentIndex ? 7 : 5}" fill="${color}" data-index="${index}"></circle>
    `).join("")}
    <line id="ttsChartHoverLine" class="tts-hover-line" x1="0" y1="${margin.top}" x2="0" y2="${height - margin.bottom}"></line>
    <circle id="ttsChartHoverDot" class="tts-hover-dot" cx="0" cy="0" r="8" fill="${color}"></circle>
  `;

  els.ttsPriceChart._chartState = {
    width,
    height,
    points: chartPoints,
    policy,
  };
  els.ttsChartNow.textContent = `Hiện tại: ${formatDateText(currentPoint.date)}`;
  els.ttsChartMethod.textContent = scenarioLabel(activeTtsChartScenario, policy);
  els.ttsChartCurrent.textContent = money(currentPoint.price);
  els.ttsChartEnd.textContent = money(endPoint.price);
  els.ttsChartPanel.style.setProperty("--tts-chart-color", color);
  els.ttsChartPanel.style.setProperty("--tts-chart-soft", soft);
  els.ttsChartButtons.forEach((button) => {
    button.textContent = scenarioLabel(button.dataset.ttsChartScenario, policy);
    button.classList.toggle("active", button.dataset.ttsChartScenario === activeTtsChartScenario);
  });
  showTtsChartPoint(currentIndex, false);
}

function render() {
  const policy = policies[els.policyGroup.value] || policies.P3P9;
  syncPolicyControls(policy);
  const result = calculate();
  els.totalPrice.textContent = money(result.total);
  const isLoan = activeScenario === "loan";
  const isTts = ["tts50", "tts70", "tts95"].includes(activeScenario);
  els.upfrontBox.style.display = isLoan || isTts ? "" : "none";
  els.summaryBand.style.gridTemplateColumns = isLoan || isTts ? "1fr 1fr" : "1fr";
  els.upfrontPrice.classList.toggle("summary-mini", isTts);
  if (isLoan) {
    els.upfrontLabel.textContent = "Trả trước 25%";
    els.upfrontPrice.textContent = money(result.upfront);
  } else if (isTts) {
    const depositRow = result.schedule[0] || ["Cọc", 0];
    const paymentRow = result.schedule[1] || ["Phải vào", 0];
    els.upfrontLabel.textContent = "Tiến Độ vào tiền trước ngày 25";
    els.upfrontPrice.innerHTML = `
      <span><small>Cọc</small><b>${money(depositRow[1])}</b></span>
      <span><small>Giải ngân lần 2</small><b>${money(paymentRow[1])}</b></span>`;
  } else {
    els.upfrontLabel.textContent = "";
    els.upfrontPrice.textContent = "";
  }

  els.resultRows.innerHTML = renderQuoteCard(result, isLoan, isTts);

  els.discountRows.innerHTML = discountRowsHtml(result);
  els.scheduleRows.innerHTML = scheduleRowsHtml(result);
  renderMultiQuotePanel();
  renderTtsChart();

  lastQuoteText = makeQuoteText(result);
}

function makeQuoteText(result) {
  const unitLabel = quoteUnitLabel(result);
  const parts = [
    `${unitLabel} - ${result.policy.name}`,
    `Phương án: ${scenarioLabel(result.scenario, result.policy)}`,
    `Mã căn - loại căn: ${unitLabel}`,
    ...(result.policy.customerHandover ? [`Ngày dự kiến nhận bàn giao nhà: ${formatDateText(result.policy.customerHandover)}`] : []),
    `Giá niêm yết đã gồm VAT/KPBT: ${money(result.listedGross)}`,
    `Giá Cuối Phải TT: ${money(result.total)}`,
  ];
  if (result.scenario === "loan") {
    parts.push(`Trả trước 25%: ${money(result.upfront)}`);
    parts.push(`NH giải ngân ${percent(result.loanRatio)}: ${money(result.bankDisbursement)}`);
    parts.push(`HTLS: ${result.policy.loanSupport}`);
  }
  parts.push(`Giá thô sau CK: ${result.scenario === "standard" ? "" : money(result.rawGrossAfterDiscount)}`);
  if (result.completion) parts.push(`Nội thất/hoàn thiện: ${money(result.completion)}`);
  return parts.join("\n");
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  window.setTimeout(() => els.toast.classList.remove("show"), 1800);
}

async function copyTextToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const input = document.createElement("textarea");
  input.value = text;
  input.setAttribute("readonly", "");
  input.style.position = "fixed";
  input.style.left = "-999px";
  input.style.top = "0";
  document.body.appendChild(input);
  input.select();
  const copied = document.execCommand("copy");
  input.remove();
  if (!copied) throw new Error("Clipboard unavailable");
}

function resetDefaults() {
  els.unitCode.value = "P90316";
  els.policyGroup.value = "P3P9";
  els.unitType.value = "Studio";
  els.area.value = "29.70";
  els.constructionArea.value = "";
  els.quoteDate.value = "2026-07-08";
  els.listedGross.value = "1,671,152,684";
  syncBaseFromGross();
  els.bankGuarantee.checked = true;
  if (els.tmdvDiscount) els.tmdvDiscount.checked = false;
  els.loanRatio.value = "70";
  activeScenario = "loan";
  lastPolicyKey = "";
  lastAutoFilledCode = "";
  skipPolicyDefaultOnce = false;
  els.scenarioButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.scenario === activeScenario);
  });
  selectedUnitCode = normalizeUnitCode(els.unitCode.value);
  renderFinder();
  render();
}

document.querySelectorAll("input:not([data-unit-filter]), select:not([data-unit-filter])").forEach((input) => {
  input.addEventListener("input", () => {
    if (input === els.unitCode) {
      applyUnitCatalog();
    }
    if (input === els.listedGross) {
      const cursorAtEnd = input.selectionStart === input.value.length;
      formatMoneyInput(input);
      if (cursorAtEnd) input.setSelectionRange(input.value.length, input.value.length);
      syncBaseFromGross();
    }
    if (input === els.policyGroup && !grossDividedPolicyKeys.has(input.value)) {
      els.baseNet.value = "";
      els.constructionArea.value = "";
    }
    render();
  });
  input.addEventListener("change", () => {
    if (input === els.unitCode) {
      applyUnitCatalog();
    }
    if (input.matches?.("[data-money-input]")) {
      formatMoneyInput(input);
    }
    if (input === els.listedGross) {
      syncBaseFromGross();
    }
    render();
  });
});

document.querySelectorAll("[data-unit-filter]").forEach((input) => {
  input.addEventListener("input", renderFinder);
  input.addEventListener("change", renderFinder);
});

els.clearFilters.addEventListener("click", () => {
  document.querySelectorAll("[data-unit-filter]").forEach((input) => {
    if (input.tagName === "SELECT") {
      input.selectedIndex = 0;
    } else {
      input.value = "";
    }
  });
  renderFinder();
});

els.filterToggle.addEventListener("click", () => {
  const isOpen = els.filterToggle.getAttribute("aria-expanded") === "true";
  els.filterToggle.setAttribute("aria-expanded", String(!isOpen));
  els.filterToggle.classList.toggle("open", !isOpen);
  els.filterContent.hidden = isOpen;
});

els.comparisonCards.addEventListener("click", (event) => {
  const card = event.target.closest("[data-unit-code]");
  if (!card) return;
  els.unitCode.value = card.dataset.unitCode;
  lastAutoFilledCode = "";
  applyUnitCatalog();
  render();
  els.pricingForm.scrollIntoView({ behavior: "smooth", block: "start" });
});

document.addEventListener("click", async (event) => {
  const copyMapBtn = event.target.closest("[data-copy-map-link]");
  if (!copyMapBtn) return;
  const link = copyMapBtn.dataset.copyMapLink;
  if (!link) return;
  try {
    await copyTextToClipboard(link);
    showToast(`Đã sao chép: ${copyMapBtn.textContent.trim()}`);
  } catch {
    showToast("Không sao chép được link trên trình duyệt này");
  }
});

els.scenarioButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeScenario = button.dataset.scenario;
    els.scenarioButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    render();
  });
});

els.resetBtn.addEventListener("click", resetDefaults);

els.copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(lastQuoteText);
    showToast("Đã sao chép báo giá");
  } catch {
    showToast("Không sao chép được trên trình duyệt này");
  }
});

els.pdfBtn.addEventListener("click", openPdfOptions);

els.multiQuoteBtn?.addEventListener("click", () => {
  multiQuoteOpen = !multiQuoteOpen;
  renderMultiQuotePanel();
});

els.multiQuoteImageBtn?.addEventListener("click", () => openMultiQuoteExportOptions("image"));

els.multiQuotePdfBtn?.addEventListener("click", () => openMultiQuoteExportOptions("pdf"));

els.multiQuoteExportCancel?.addEventListener("click", () => {
  els.multiQuoteExportDialog.close();
});

els.multiQuoteExportImage?.addEventListener("click", () => {
  const scenarios = selectedMultiQuoteExportScenarios();
  if (!scenarios.length) {
    showToast("Chọn ít nhất một phương án");
    return;
  }
  els.multiQuoteExportDialog.close();
  runMultiQuoteExport(scenarios, "image");
});

els.multiQuoteExportPdf?.addEventListener("click", () => {
  const scenarios = selectedMultiQuoteExportScenarios();
  if (!scenarios.length) {
    showToast("Chọn ít nhất một phương án");
    return;
  }
  els.multiQuoteExportDialog.close();
  runMultiQuoteExport(scenarios, "pdf");
});

els.unitMapBtn?.addEventListener("click", openUnitMapOptions);

els.unitMapCancel?.addEventListener("click", () => {
  els.unitMapDialog.close();
});

els.unitMapCreate?.addEventListener("click", () => {
  createUnitMapImages(selectedMapScenarios());
});

els.unitMapDownload?.addEventListener("click", downloadUnitMapImages);

els.unitMapCopy?.addEventListener("click", () => {
  copyUnitMapImage().catch(() => showToast("Không sao chép được ảnh"));
});

els.pdfOptionsCancel.addEventListener("click", () => {
  els.pdfOptionsDialog.close();
});

els.pdfOptionsExport.addEventListener("click", () => {
  const scenarios = selectedPdfScenarios();
  if (!scenarios.length) {
    showToast("Chọn ít nhất một phương án");
    return;
  }
  els.pdfOptionsDialog.close();
  exportPdf(scenarios);
});

els.ttsChartButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeTtsChartScenario = button.dataset.ttsChartScenario;
    renderTtsChart();
  });
});

els.ttsPriceChart.addEventListener("pointermove", (event) => {
  showTtsChartPoint(nearestTtsChartPoint(event.clientX), true);
});

els.ttsPriceChart.addEventListener("pointerdown", (event) => {
  els.ttsPriceChart.setPointerCapture(event.pointerId);
  showTtsChartPoint(nearestTtsChartPoint(event.clientX), true);
});

els.ttsPriceChart.addEventListener("pointerleave", () => {
  showTtsChartPoint(nearestDateIndex(els.ttsPriceChart._chartState.points, dateFromText(els.quoteDate.value)), false);
});

function installServiceWorkerUpdates() {
  if (!("serviceWorker" in navigator)) return;

  navigator.serviceWorker.register("service-worker.js?v=84", { updateViaCache: "none" })
    .then((registration) => {
      const activateWaitingWorker = () => {
        registration.waiting?.postMessage({ type: "SKIP_WAITING" });
      };

      activateWaitingWorker();
      registration.addEventListener("updatefound", () => {
        const worker = registration.installing;
        if (!worker) return;

        worker.addEventListener("statechange", () => {
          if (worker.state === "installed" && navigator.serviceWorker.controller) {
            worker.postMessage({ type: "SKIP_WAITING" });
          }
        });
      });

      registration.update().catch(() => {});
    })
    .catch(() => {});
}

installServiceWorkerUpdates();
syncBaseFromGross();
document.querySelectorAll("[data-money-input]").forEach(formatMoneyInput);
renderFinder();
render();
refreshCatalogFromGoogle()
  .catch((error) => {
    catalogLoading = false;
    rebuildCatalogEntries();
    populateFinderOptions();
    renderFinder();
    render();
    showToast(error?.message || "Không đọc được bảng hàng mới");
  });










