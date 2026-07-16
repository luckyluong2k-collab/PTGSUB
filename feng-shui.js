(function (root) {
  "use strict";

  var TIME_ZONE = 7;
  var PI = Math.PI;
  var DIRECTIONS = ["Bắc", "Đông Bắc", "Đông", "Đông Nam", "Nam", "Tây Nam", "Tây", "Tây Bắc"];
  var PALACES = {
    1: { name: "Khảm", element: "Thủy" },
    2: { name: "Khôn", element: "Thổ" },
    3: { name: "Chấn", element: "Mộc" },
    4: { name: "Tốn", element: "Mộc" },
    6: { name: "Càn", element: "Kim" },
    7: { name: "Đoài", element: "Kim" },
    8: { name: "Cấn", element: "Thổ" },
    9: { name: "Ly", element: "Hỏa" }
  };
  var AUSPICIOUS = {
    "Càn": { "Tây": "Sinh Khí", "Đông Bắc": "Thiên Y", "Tây Nam": "Diên Niên", "Tây Bắc": "Phục Vị" },
    "Khảm": { "Đông Nam": "Sinh Khí", "Đông": "Thiên Y", "Nam": "Diên Niên", "Bắc": "Phục Vị" },
    "Cấn": { "Tây Nam": "Sinh Khí", "Tây Bắc": "Thiên Y", "Tây": "Diên Niên", "Đông Bắc": "Phục Vị" },
    "Chấn": { "Nam": "Sinh Khí", "Bắc": "Thiên Y", "Đông Nam": "Diên Niên", "Đông": "Phục Vị" },
    "Tốn": { "Bắc": "Sinh Khí", "Nam": "Thiên Y", "Đông": "Diên Niên", "Đông Nam": "Phục Vị" },
    "Ly": { "Đông": "Sinh Khí", "Đông Nam": "Thiên Y", "Bắc": "Diên Niên", "Nam": "Phục Vị" },
    "Khôn": { "Đông Bắc": "Sinh Khí", "Tây": "Thiên Y", "Tây Bắc": "Diên Niên", "Tây Nam": "Phục Vị" },
    "Đoài": { "Tây Bắc": "Sinh Khí", "Tây Nam": "Thiên Y", "Đông Bắc": "Diên Niên", "Tây": "Phục Vị" }
  };

  function int(value) { return Math.floor(value); }
  function jdFromDate(dd, mm, yy) {
    var a = int((14 - mm) / 12);
    var y = yy + 4800 - a;
    var m = mm + 12 * a - 3;
    var jd = dd + int((153 * m + 2) / 5) + 365 * y + int(y / 4) - int(y / 100) + int(y / 400) - 32045;
    if (jd < 2299161) jd = dd + int((153 * m + 2) / 5) + 365 * y + int(y / 4) - 32083;
    return jd;
  }

  function newMoon(k) {
    var t = k / 1236.85;
    var t2 = t * t;
    var t3 = t2 * t;
    var dr = PI / 180;
    var jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * t2 - 0.000000155 * t3;
    jd1 += 0.00033 * Math.sin((166.56 + 132.87 * t - 0.009173 * t2) * dr);
    var m = 359.2242 + 29.10535608 * k - 0.0000333 * t2 - 0.00000347 * t3;
    var mpr = 306.0253 + 385.81691806 * k + 0.0107306 * t2 + 0.00001236 * t3;
    var f = 21.2964 + 390.67050646 * k - 0.0016528 * t2 - 0.00000239 * t3;
    var c1 = (0.1734 - 0.000393 * t) * Math.sin(m * dr) + 0.0021 * Math.sin(2 * m * dr);
    c1 -= 0.4068 * Math.sin(mpr * dr) + 0.0161 * Math.sin(2 * mpr * dr);
    c1 -= 0.0004 * Math.sin(3 * mpr * dr);
    c1 += 0.0104 * Math.sin(2 * f * dr) - 0.0051 * Math.sin((m + mpr) * dr);
    c1 -= 0.0074 * Math.sin((m - mpr) * dr) + 0.0004 * Math.sin((2 * f + m) * dr);
    c1 -= 0.0004 * Math.sin((2 * f - m) * dr) - 0.0006 * Math.sin((2 * f + mpr) * dr);
    c1 += 0.0010 * Math.sin((2 * f - mpr) * dr) + 0.0005 * Math.sin((2 * mpr + m) * dr);
    var deltaT;
    if (t < -11) {
      deltaT = 0.001 + 0.000839 * t + 0.0002261 * t2 - 0.00000845 * t3 - 0.000000081 * t * t3;
    } else {
      deltaT = -0.000278 + 0.000265 * t + 0.000262 * t2;
    }
    return jd1 + c1 - deltaT;
  }

  function sunLongitude(jdn) {
    var t = (jdn - 2451545.0) / 36525;
    var t2 = t * t;
    var dr = PI / 180;
    var m = 357.52910 + 35999.05030 * t - 0.0001559 * t2 - 0.00000048 * t * t2;
    var l0 = 280.46645 + 36000.76983 * t + 0.0003032 * t2;
    var dl = (1.914600 - 0.004817 * t - 0.000014 * t2) * Math.sin(dr * m);
    dl += (0.019993 - 0.000101 * t) * Math.sin(2 * dr * m) + 0.000290 * Math.sin(3 * dr * m);
    var l = (l0 + dl) * dr;
    l -= PI * 2 * int(l / (PI * 2));
    return l;
  }

  function getNewMoonDay(k, timeZone) { return int(newMoon(k) + 0.5 + timeZone / 24); }
  function getSunLongitude(dayNumber, timeZone) { return int(sunLongitude(dayNumber - 0.5 - timeZone / 24) / PI * 6); }
  function getLunarMonth11(yy, timeZone) {
    var off = jdFromDate(31, 12, yy) - 2415021;
    var k = int(off / 29.530588853);
    var nm = getNewMoonDay(k, timeZone);
    if (getSunLongitude(nm, timeZone) >= 9) nm = getNewMoonDay(k - 1, timeZone);
    return nm;
  }
  function getLeapMonthOffset(a11, timeZone) {
    var k = int((a11 - 2415021.076998695) / 29.530588853 + 0.5);
    var last = 0;
    var i = 1;
    var arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
    do {
      last = arc;
      i += 1;
      arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
    } while (arc !== last && i < 14);
    return i - 1;
  }

  function solarToLunar(dd, mm, yy, timeZone) {
    var dayNumber = jdFromDate(dd, mm, yy);
    var k = int((dayNumber - 2415021.076998695) / 29.530588853);
    var monthStart = getNewMoonDay(k + 1, timeZone);
    if (monthStart > dayNumber) monthStart = getNewMoonDay(k, timeZone);
    var a11 = getLunarMonth11(yy, timeZone);
    var b11 = a11;
    var lunarYear;
    if (a11 >= monthStart) {
      lunarYear = yy;
      a11 = getLunarMonth11(yy - 1, timeZone);
    } else {
      lunarYear = yy + 1;
      b11 = getLunarMonth11(yy + 1, timeZone);
    }
    var lunarDay = dayNumber - monthStart + 1;
    var diff = int((monthStart - a11) / 29);
    var lunarLeap = 0;
    var lunarMonth = diff + 11;
    if (b11 - a11 > 365) {
      var leapMonthDiff = getLeapMonthOffset(a11, timeZone);
      if (diff >= leapMonthDiff) {
        lunarMonth = diff + 10;
        if (diff === leapMonthDiff) lunarLeap = 1;
      }
    }
    if (lunarMonth > 12) lunarMonth -= 12;
    if (lunarMonth >= 11 && diff < 4) lunarYear -= 1;
    return { day: lunarDay, month: lunarMonth, year: lunarYear, leap: Boolean(lunarLeap) };
  }

  function positiveMod(value, divisor) { return ((value % divisor) + divisor) % divisor; }
  function oneToNine(value) { var result = positiveMod(value, 9); return result === 0 ? 9 : result; }
  function calculatePalace(lunarYear, gender) {
    var yearRoot = oneToNine(lunarYear);
    var modernCentury = lunarYear >= 2000;
    var number = gender === "female"
      ? oneToNine((modernCentury ? 6 : 5) + yearRoot)
      : oneToNine((modernCentury ? 9 : 10) - yearRoot);
    if (number === 5) number = gender === "female" ? 8 : 2;
    return { number: number, name: PALACES[number].name, element: PALACES[number].element };
  }

  function stripMarks(value) {
    return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase();
  }
  function normalizeDirection(value) {
    var compact = stripMarks(value).replace(/[^a-z]/g, "");
    var aliases = {
      b: "Bắc", bac: "Bắc", n: "Nam", nam: "Nam",
      d: "Đông", dong: "Đông", t: "Tây", tay: "Tây",
      db: "Đông Bắc", dongbac: "Đông Bắc", dn: "Đông Nam", dongnam: "Đông Nam",
      tb: "Tây Bắc", taybac: "Tây Bắc", tn: "Tây Nam", taynam: "Tây Nam"
    };
    if (aliases[compact]) return aliases[compact];
    return DIRECTIONS.slice().sort(function (a, b) { return b.length - a.length; }).find(function (direction) {
      return compact.indexOf(stripMarks(direction).replace(/[^a-z]/g, "")) >= 0;
    }) || "";
  }

  function parseSolarDate(text) {
    var match = String(text || "").trim().match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
    if (!match) return null;
    var day = Number(match[1]);
    var month = Number(match[2]);
    var year = Number(match[3]);
    var date = new Date(Date.UTC(year, month - 1, day));
    if (year < 1900 || year > 2099 || date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
    return { day: day, month: month, year: year };
  }

  function directionAssessment(palace, direction) {
    var entries = AUSPICIOUS[palace.name];
    var category = entries[direction] || "Nhóm không ưu tiên";
    var best = Object.keys(entries).find(function (key) { return entries[key] === "Sinh Khí"; });
    return { category: category, best: best, favorable: category !== "Nhóm không ưu tiên" };
  }

  function buildAdvice(name, palace, direction, assessment) {
    var person = name ? name.trim() : "khách hàng";
    var categoryBenefits = {
      "Sinh Khí": "đây là hướng ưu tiên cao nhất, thuận lợi để nhấn mạnh cảm giác chủ động, phát triển và sinh khí trong không gian sống",
      "Thiên Y": "đây là hướng tốt, phù hợp để nhấn mạnh sự ổn định, nghỉ ngơi và cân bằng sinh hoạt",
      "Diên Niên": "đây là hướng tốt, phù hợp để nhấn mạnh sự hài hòa, gắn kết và tính bền vững của không gian gia đình",
      "Phục Vị": "đây là hướng tốt, phù hợp để nhấn mạnh sự yên ổn, tập trung và cảm giác vững tâm"
    };
    if (assessment.favorable) {
      return "Căn hướng " + direction + " thuộc " + assessment.category + " với cung " + palace.name + " của " + person + "; " + categoryBenefits[assessment.category] + ". Đây là một lợi thế tham khảo khi các yếu tố pháp lý, giá, dòng tiền, vị trí và nhu cầu thực tế cũng phù hợp.";
    }
    return "Hướng " + direction + " không nằm trong bốn hướng ưu tiên của cung " + palace.name + ", nhưng không phải yếu tố loại trừ căn. Có thể bố trí bàn làm việc hoặc khu sinh hoạt chính quay về " + assessment.best + " để tăng cảm giác phù hợp; quyết định vẫn nên ưu tiên pháp lý, giá, dòng tiền, vị trí và nhu cầu thực tế.";
  }

  function buildSalesScript(name, palace, direction, assessment) {
    var salutation = name ? name.trim() : "anh/chị";
    var fit = assessment.favorable
      ? "Căn này hướng " + direction + " thuộc " + assessment.category + " của cung " + palace.name + ", là một điểm cộng phù hợp để " + salutation + " tham khảo."
      : "Căn này hướng " + direction + " chưa thuộc nhóm hướng ưu tiên của cung " + palace.name + ", nhưng mình có thể bố trí bàn làm việc hoặc khu sinh hoạt theo hướng " + assessment.best + " để hài hòa hơn.";
    return fit + " Phong thủy chỉ là phần tham khảo; mình vẫn ưu tiên kiểm tra pháp lý, giá, dòng tiền, vị trí và nhu cầu thực tế. Nếu các điều kiện đó đã phù hợp, ngày hôm nay là ngày tốt nhất để chốt căn này.";
  }

  var api = {
    TIME_ZONE: TIME_ZONE,
    solarToLunar: function (day, month, year) { return solarToLunar(day, month, year, TIME_ZONE); },
    calculatePalace: calculatePalace,
    normalizeDirection: normalizeDirection,
    parseSolarDate: parseSolarDate,
    directionAssessment: directionAssessment
  };
  root.FengShui = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;

  if (!root.document) return;
  var document = root.document;
  var dialog = document.getElementById("fengShuiDialog");
  var openButton = document.getElementById("fengShuiOpenBtn");
  var closeButton = document.getElementById("fengShuiCloseBtn");
  var form = document.getElementById("fengShuiForm");
  if (!dialog || !openButton || !closeButton || !form) return;

  var birthText = document.getElementById("fengShuiBirthText");
  var birthPicker = document.getElementById("fengShuiBirthPicker");
  var unitCode = document.getElementById("fengShuiUnitCode");
  var unitDirection = document.getElementById("fengShuiUnitDirection");
  var manualDirection = document.getElementById("fengShuiManualDirection");
  var directionHelp = document.getElementById("fengShuiDirectionHelp");
  var error = document.getElementById("fengShuiError");
  var result = document.getElementById("fengShuiResult");
  var salesScript = document.getElementById("fengShuiSalesScript");
  var lastFocus = null;

  function syncUnit() {
    var source = document.getElementById("unitCode");
    var code = String(source && source.value || "").trim().toUpperCase();
    var catalog = root.unitCatalog || {};
    var rawDirection = catalog[code] && catalog[code].direction || "";
    var normalized = normalizeDirection(rawDirection);
    unitCode.value = code || "Chưa chọn căn";
    unitDirection.value = normalized || "Chưa có hướng trong bảng hàng";
    manualDirection.hidden = Boolean(normalized);
    manualDirection.required = !normalized;
    directionHelp.textContent = normalized ? "Tự động lấy từ bảng hàng." : "Bảng hàng chưa có hướng; vui lòng chọn một trong 8 hướng.";
  }

  function openDialog() {
    lastFocus = document.activeElement;
    syncUnit();
    error.textContent = "";
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
    setTimeout(function () { birthText.focus(); }, 0);
  }
  function closeDialog() {
    if (dialog.open && typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  openButton.addEventListener("click", openDialog);
  closeButton.addEventListener("click", closeDialog);
  dialog.addEventListener("click", function (event) { if (event.target === dialog) closeDialog(); });
  dialog.addEventListener("cancel", function (event) { event.preventDefault(); closeDialog(); });

  birthText.addEventListener("input", function () {
    var digits = birthText.value.replace(/\D/g, "").slice(0, 8);
    birthText.value = digits.length > 4 ? digits.slice(0, 2) + "/" + digits.slice(2, 4) + "/" + digits.slice(4) : digits.length > 2 ? digits.slice(0, 2) + "/" + digits.slice(2) : digits;
  });
  birthPicker.addEventListener("change", function () {
    if (!birthPicker.value) return;
    var parts = birthPicker.value.split("-");
    birthText.value = parts[2] + "/" + parts[1] + "/" + parts[0];
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    error.textContent = "";
    var solar = parseSolarDate(birthText.value);
    if (!solar) { error.textContent = "Vui lòng nhập ngày sinh hợp lệ theo định dạng dd/mm/yyyy (1900–2099)."; birthText.focus(); return; }
    var direction = normalizeDirection(unitDirection.value) || normalizeDirection(manualDirection.value);
    if (!direction) { error.textContent = "Vui lòng chọn hướng căn."; manualDirection.focus(); return; }
    var gender = form.querySelector('input[name="fengShuiGender"]:checked').value;
    var lunar = api.solarToLunar(solar.day, solar.month, solar.year);
    var palace = calculatePalace(lunar.year, gender);
    var assessment = directionAssessment(palace, direction);
    var name = document.getElementById("fengShuiCustomerName").value;
    document.getElementById("fengShuiLunar").textContent = "Âm lịch Việt Nam (UTC+7): " + String(lunar.day).padStart(2, "0") + "/" + String(lunar.month).padStart(2, "0") + "/" + lunar.year + (lunar.leap ? " · tháng nhuận" : "");
    document.getElementById("fengShuiDestiny").textContent = "Cung " + palace.name + " · hành " + palace.element;
    document.getElementById("fengShuiBestDirection").textContent = assessment.best;
    document.getElementById("fengShuiDirectionVerdict").textContent = direction + " · " + assessment.category;
    document.getElementById("fengShuiAdvice").textContent = buildAdvice(name, palace, direction, assessment);
    salesScript.textContent = buildSalesScript(name, palace, direction, assessment);
    result.hidden = false;
    result.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

  document.getElementById("fengShuiCopyBtn").addEventListener("click", function () {
    var text = salesScript.textContent;
    var done = function () { var button = document.getElementById("fengShuiCopyBtn"); button.textContent = "Đã sao chép"; setTimeout(function () { button.textContent = "Sao chép"; }, 1600); };
    if (navigator.clipboard && root.isSecureContext) navigator.clipboard.writeText(text).then(done);
    else {
      var area = document.createElement("textarea"); area.value = text; document.body.appendChild(area); area.select(); document.execCommand("copy"); area.remove(); done();
    }
  });
}(typeof globalThis !== "undefined" ? globalThis : this));
