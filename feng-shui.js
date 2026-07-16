(() => {
  "use strict";

  const $ = (selector) => document.querySelector(selector);
  const els = {
    open: $("#fengShuiOpenBtn"),
    dialog: $("#fengShuiDialog"),
    close: $("#fengShuiCloseBtn"),
    form: $("#fengShuiForm"),
    name: $("#fengShuiCustomerName"),
    birthDate: $("#fengShuiBirthDate"),
    datePicker: $("#fengShuiBirthDatePicker"),
    lunarDate: $("#fengShuiLunarDate"),
    gender: $("#fengShuiGender"),
    unitCode: $("#fengShuiUnitCode"),
    direction: $("#fengShuiDirection"),
    reset: $("#fengShuiResetBtn"),
    result: $("#fengShuiResult"),
  };

  if (!els.open || !els.dialog || !els.form) return;

  const TZ = 7;
  const trigrams = {
    1: { name: "Khảm", element: "Thủy", good: { "Đông Nam": "Sinh Khí", "Đông": "Thiên Y", "Nam": "Diên Niên", "Bắc": "Phục Vị" } },
    2: { name: "Khôn", element: "Thổ", good: { "Đông Bắc": "Sinh Khí", "Tây": "Thiên Y", "Tây Bắc": "Diên Niên", "Tây Nam": "Phục Vị" } },
    3: { name: "Chấn", element: "Mộc", good: { "Nam": "Sinh Khí", "Bắc": "Thiên Y", "Đông Nam": "Diên Niên", "Đông": "Phục Vị" } },
    4: { name: "Tốn", element: "Mộc", good: { "Bắc": "Sinh Khí", "Nam": "Thiên Y", "Đông": "Diên Niên", "Đông Nam": "Phục Vị" } },
    6: { name: "Càn", element: "Kim", good: { "Tây": "Sinh Khí", "Đông Bắc": "Thiên Y", "Tây Nam": "Diên Niên", "Tây Bắc": "Phục Vị" } },
    7: { name: "Đoài", element: "Kim", good: { "Tây Bắc": "Sinh Khí", "Tây Nam": "Thiên Y", "Đông Bắc": "Diên Niên", "Tây": "Phục Vị" } },
    8: { name: "Cấn", element: "Thổ", good: { "Tây Nam": "Sinh Khí", "Tây Bắc": "Thiên Y", "Tây": "Diên Niên", "Đông Bắc": "Phục Vị" } },
    9: { name: "Ly", element: "Hỏa", good: { "Đông": "Sinh Khí", "Đông Nam": "Thiên Y", "Bắc": "Diên Niên", "Nam": "Phục Vị" } },
  };
  const badNames = {
    1: { "Tây": "Tuyệt Mệnh", "Đông Bắc": "Ngũ Quỷ", "Tây Bắc": "Lục Sát", "Tây Nam": "Họa Hại" },
    2: { "Bắc": "Tuyệt Mệnh", "Đông Nam": "Ngũ Quỷ", "Đông": "Lục Sát", "Nam": "Họa Hại" },
    3: { "Tây": "Tuyệt Mệnh", "Tây Nam": "Ngũ Quỷ", "Đông Bắc": "Lục Sát", "Tây Bắc": "Họa Hại" },
    4: { "Tây Bắc": "Tuyệt Mệnh", "Tây": "Ngũ Quỷ", "Tây Nam": "Lục Sát", "Đông Bắc": "Họa Hại" },
    6: { "Nam": "Tuyệt Mệnh", "Đông": "Ngũ Quỷ", "Bắc": "Lục Sát", "Đông Nam": "Họa Hại" },
    7: { "Đông": "Tuyệt Mệnh", "Bắc": "Ngũ Quỷ", "Nam": "Lục Sát", "Đông Nam": "Họa Hại" },
    8: { "Đông Nam": "Tuyệt Mệnh", "Nam": "Ngũ Quỷ", "Đông": "Lục Sát", "Bắc": "Họa Hại" },
    9: { "Tây": "Tuyệt Mệnh", "Tây Bắc": "Ngũ Quỷ", "Đông Bắc": "Lục Sát", "Tây Nam": "Họa Hại" },
  };
  const benefitText = {
    "Sinh Khí": "được ưu tiên khi khách muốn nhấn vào sự phát triển, cơ hội và nguồn năng lượng tích cực",
    "Thiên Y": "phù hợp để gợi câu chuyện về sự an tâm, sức khỏe và sự chăm sóc gia đình",
    "Diên Niên": "thuận để nói về tính gắn kết, ổn định và sự hài hòa trong gia đình",
    "Phục Vị": "phù hợp với nhu cầu an cư, sự bình ổn và không gian riêng tư",
  };

  const esc = (value) => String(value ?? "").replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
  const int = Math.floor;

  function jdFromDate(day, month, year) {
    const a = int((14 - month) / 12);
    const y = year + 4800 - a;
    const m = month + 12 * a - 3;
    let jd = day + int((153 * m + 2) / 5) + 365 * y + int(y / 4) - int(y / 100) + int(y / 400) - 32045;
    if (jd < 2299161) jd = day + int((153 * m + 2) / 5) + 365 * y + int(y / 4) - 32083;
    return jd;
  }

  function newMoon(k) {
    const t = k / 1236.85;
    const t2 = t * t;
    const t3 = t2 * t;
    const dr = Math.PI / 180;
    let jd = 2415020.75933 + 29.53058868 * k + 0.0001178 * t2 - 0.000000155 * t3;
    jd += 0.00033 * Math.sin((166.56 + 132.87 * t - 0.009173 * t2) * dr);
    const m = 359.2242 + 29.10535608 * k - 0.0000333 * t2 - 0.00000347 * t3;
    const mpr = 306.0253 + 385.81691806 * k + 0.0107306 * t2 + 0.00001236 * t3;
    const f = 21.2964 + 390.67050646 * k - 0.0016528 * t2 - 0.00000239 * t3;
    const correction = t < -11
      ? 0.001 + 0.000839 * t + 0.0002261 * t2 - 0.00000845 * t3 - 0.000000081 * t * t3
      : -0.000278 + 0.000265 * t + 0.000262 * t2;
    jd += (0.1734 - 0.000393 * t) * Math.sin(m * dr) + 0.0021 * Math.sin(2 * m * dr);
    jd -= 0.4068 * Math.sin(mpr * dr) + 0.0161 * Math.sin(2 * mpr * dr) - 0.0004 * Math.sin(3 * mpr * dr);
    jd += 0.0104 * Math.sin(2 * f * dr) - 0.0051 * Math.sin((m + mpr) * dr) - 0.0074 * Math.sin((m - mpr) * dr);
    jd += 0.0004 * Math.sin((2 * f + m) * dr) - 0.0004 * Math.sin((2 * f - m) * dr) - 0.0006 * Math.sin((2 * f + mpr) * dr);
    jd += 0.001 * Math.sin((2 * f - mpr) * dr) + 0.0005 * Math.sin((2 * mpr + m) * dr);
    return jd + correction;
  }

  function newMoonDay(k) {
    return int(newMoon(k) + 0.5 + TZ / 24);
  }

  function sunLongitude(jdn) {
    const t = (jdn - 2451545.5 - TZ / 24) / 36525;
    const t2 = t * t;
    const dr = Math.PI / 180;
    const m = 357.5291 + 35999.0503 * t - 0.0001559 * t2 - 0.00000048 * t * t2;
    const l0 = 280.46645 + 36000.76983 * t + 0.0003032 * t2;
    let dl = (1.9146 - 0.004817 * t - 0.000014 * t2) * Math.sin(dr * m);
    dl += (0.019993 - 0.000101 * t) * Math.sin(2 * dr * m) + 0.00029 * Math.sin(3 * dr * m);
    let longitude = (l0 + dl) * dr;
    longitude -= Math.PI * 2 * int(longitude / (Math.PI * 2));
    return int(longitude / Math.PI * 6);
  }

  function lunarMonth11(year) {
    const off = jdFromDate(31, 12, year) - 2415021;
    const k = int(off / 29.530588853);
    let nm = newMoonDay(k);
    if (sunLongitude(nm) >= 9) nm = newMoonDay(k - 1);
    return nm;
  }

  function leapMonthOffset(a11) {
    const k = int(0.5 + (a11 - 2415021.076998695) / 29.530588853);
    let last = 0;
    let i = 1;
    let arc = sunLongitude(newMoonDay(k + i));
    do {
      last = arc;
      i += 1;
      arc = sunLongitude(newMoonDay(k + i));
    } while (arc !== last && i < 14);
    return i - 1;
  }

  function solarToLunar(day, month, year) {
    const dayNumber = jdFromDate(day, month, year);
    const k = int((dayNumber - 2415021.076998695) / 29.530588853);
    let monthStart = newMoonDay(k + 1);
    if (monthStart > dayNumber) monthStart = newMoonDay(k);
    let a11 = lunarMonth11(year);
    let b11 = a11;
    let lunarYear;
    if (a11 >= monthStart) {
      lunarYear = year;
      a11 = lunarMonth11(year - 1);
    } else {
      lunarYear = year + 1;
      b11 = lunarMonth11(year + 1);
    }
    const lunarDay = dayNumber - monthStart + 1;
    const diff = int((monthStart - a11) / 29);
    let lunarMonth = diff + 11;
    let lunarLeap = 0;
    if (b11 - a11 > 365) {
      const leapMonthDiff = leapMonthOffset(a11);
      if (diff >= leapMonthDiff) lunarMonth = diff + 10;
      if (diff === leapMonthDiff) lunarLeap = 1;
    }
    if (lunarMonth > 12) lunarMonth -= 12;
    if (lunarMonth >= 11 && diff < 4) lunarYear -= 1;
    return { day: lunarDay, month: lunarMonth, year: lunarYear, leap: lunarLeap === 1 };
  }

  function parseDate(value) {
    const text = String(value || "").trim();
    const vietnameseDate = text.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
    const isoDate = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (!vietnameseDate && !isoDate) return null;
    const day = Number(vietnameseDate?.[1] || isoDate?.[3]);
    const month = Number(vietnameseDate?.[2] || isoDate?.[2]);
    const year = Number(vietnameseDate?.[3] || isoDate?.[1]);
    const check = new Date(Date.UTC(year, month - 1, day));
    if (year < 1900 || year > 2100 || check.getUTCFullYear() !== year || check.getUTCMonth() !== month - 1 || check.getUTCDate() !== day) return null;
    return { day, month, year };
  }

  function formatSolarDate({ day, month, year }) {
    return `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`;
  }

  function normalizeDirection(value) {
    const text = String(value || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d");
    const map = [["dong bac", "Đông Bắc"], ["dong nam", "Đông Nam"], ["tay bac", "Tây Bắc"], ["tay nam", "Tây Nam"], ["bac", "Bắc"], ["dong", "Đông"], ["nam", "Nam"], ["tay", "Tây"]];
    return map.find(([needle]) => text.includes(needle))?.[1] || "";
  }

  function digitRoot(value) {
    let number = Math.abs(Number(value));
    while (number > 9) number = String(number).split("").reduce((total, digit) => total + Number(digit), 0);
    return number;
  }

  function kuaFor(lunarYear, gender) {
    const base = digitRoot(lunarYear % 100);
    const raw = lunarYear >= 2000
      ? (gender === "male" ? 9 - base : 6 + base)
      : (gender === "male" ? 10 - base : 5 + base);
    let kua = digitRoot(raw);
    if (kua === 5) kua = gender === "male" ? 2 : 8;
    return kua;
  }

  function setLunarDateHint() {
    const solar = parseDate(els.birthDate.value);
    if (!solar) {
      els.lunarDate.textContent = "Nhập đúng định dạng dd/mm/yyyy hoặc chọn trên lịch để tự quy đổi lịch âm.";
      return null;
    }
    const lunar = solarToLunar(solar.day, solar.month, solar.year);
    els.lunarDate.textContent = `Âm lịch: ${String(lunar.day).padStart(2, "0")}/${String(lunar.month).padStart(2, "0")}/${lunar.year}${lunar.leap ? " (tháng nhuận)" : ""}.`;
    return lunar;
  }

  function syncActiveUnit() {
    const code = String($("#unitCode")?.value || "").trim().toUpperCase();
    if (els.unitCode) els.unitCode.value = code || "Chưa chọn căn";
    const catalog = window.unitCatalog || {};
    const unit = catalog[code] || {};
    const detectedDirection = normalizeDirection(unit.direction);
    if (detectedDirection) els.direction.value = detectedDirection;
    els.unitCode.dataset.unitDirection = unit.direction || "";
  }

  function bestDirection(kua) {
    return Object.entries(trigrams[kua].good).find(([, value]) => value === "Sinh Khí")?.[0] || "";
  }

  function renderResult({ lunar, kua, direction }) {
    const trigram = trigrams[kua];
    const good = trigram.good[direction];
    const bad = badNames[kua]?.[direction];
    const code = els.unitCode.value || "căn đang tra";
    const name = els.name.value.trim();
    const customer = name ? `Khách ${name}` : "Khách hàng";
    const best = bestDirection(kua);
    const relationTitle = good ? good : (bad || "Chưa xác định");
    const relationClass = good ? "is-good" : "is-neutral";
    const advisory = good
      ? `${customer} có cung <b>${esc(trigram.name)}</b> (${esc(trigram.element)}); hướng <b>${esc(direction)}</b> của căn <b>${esc(code)}</b> rơi vào <b>${esc(good)}</b>, ${benefitText[good]}. Đây là điểm có thể đưa vào phần lý do chọn căn sau khi đã chốt được tài chính và pháp lý.`
      : `${customer} có cung <b>${esc(trigram.name)}</b> (${esc(trigram.element)}). Hướng <b>${esc(direction)}</b> của căn <b>${esc(code)}</b> chưa phải hướng ưu tiên theo Bát trạch (${esc(bad || "chưa có dữ liệu")}). Có thể giữ căn trong shortlist nếu giá, pháp lý và dòng tiền tốt; phần phong thủy nên tư vấn bằng cách bố trí không gian theo hướng hợp mệnh.`;
    const pitch = good
      ? `“Căn ${code} có hướng ${direction}, theo Bát trạch của ${name || "anh/chị"} là cung ${good}. Điểm này phù hợp để nhấn thêm về ${benefitText[good]}. Nếu phương án tài chính đang phù hợp, đây là một căn có thể ưu tiên xem thực tế.”`
      : `“Căn ${code} vẫn đáng xem khi giá và vị trí phù hợp. Về Bát trạch, ${name || "anh/chị"} có thể ưu tiên bố trí bàn làm việc hoặc khu sinh hoạt theo hướng ${best} (Sinh Khí) để tăng yếu tố hợp mệnh trong không gian sử dụng.”`;

    els.result.innerHTML = `
      <div class="feng-shui-result-head ${relationClass}">
        <span>Đánh giá hướng căn</span>
        <strong>${esc(direction)} · ${esc(relationTitle)}</strong>
      </div>
      <div class="feng-shui-kua-grid">
        <div><span>Ngày sinh âm</span><strong>${String(lunar.day).padStart(2, "0")}/${String(lunar.month).padStart(2, "0")}/${lunar.year}${lunar.leap ? " nhuận" : ""}</strong></div>
        <div><span>Cung mệnh</span><strong>${esc(trigram.name)} · ${esc(trigram.element)}</strong></div>
        <div><span>Hướng Sinh Khí</span><strong>${esc(best)}</strong></div>
      </div>
      <article class="feng-shui-insight"><h3>Điểm tư vấn cho căn ${esc(code)}</h3><p>${advisory}</p></article>
      <article class="feng-shui-pitch"><h3>Câu nói để tư vấn khách</h3><p>${pitch}</p><button class="secondary feng-shui-copy" id="fengShuiCopyBtn" type="button">Sao chép câu tư vấn</button></article>
    `;
    els.result.hidden = false;
    $("#fengShuiCopyBtn")?.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(els.result.querySelector(".feng-shui-pitch p")?.textContent || "");
        const button = $("#fengShuiCopyBtn");
        if (button) button.textContent = "Đã sao chép";
      } catch {
        // Clipboard access can be unavailable in embedded browsers.
      }
    });
  }

  els.open.addEventListener("click", () => {
    syncActiveUnit();
    if (typeof els.dialog.showModal === "function") els.dialog.showModal();
    else els.dialog.setAttribute("open", "");
  });
  els.close?.addEventListener("click", () => els.dialog.close?.());
  els.dialog.addEventListener("click", (event) => {
    if (event.target === els.dialog) els.dialog.close?.();
  });
  els.datePicker?.addEventListener("change", () => {
    if (!els.datePicker.value) return;
    const [year, month, day] = els.datePicker.value.split("-").map(Number);
    els.birthDate.value = formatSolarDate({ day, month, year });
    setLunarDateHint();
  });
  els.birthDate?.addEventListener("input", () => {
    const digits = els.birthDate.value.replace(/\D/g, "").slice(0, 8);
    if (digits.length === 8) els.birthDate.value = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
    const solar = parseDate(els.birthDate.value);
    if (solar) els.datePicker.value = `${solar.year}-${String(solar.month).padStart(2, "0")}-${String(solar.day).padStart(2, "0")}`;
    setLunarDateHint();
  });
  els.form.addEventListener("reset", () => {
    window.setTimeout(() => {
      els.result.hidden = true;
      els.lunarDate.textContent = "Nhập hoặc chọn ngày để tự quy đổi lịch âm.";
      syncActiveUnit();
    }, 0);
  });
  els.form.addEventListener("submit", (event) => {
    event.preventDefault();
    syncActiveUnit();
    const lunar = setLunarDateHint();
    const direction = normalizeDirection(els.direction.value);
    if (!lunar || !direction) {
      els.result.hidden = false;
      els.result.innerHTML = '<p class="feng-shui-error">Vui lòng nhập ngày sinh hợp lệ và chọn đúng hướng căn trước khi phân tích.</p>';
      return;
    }
    renderResult({ lunar, kua: kuaFor(lunar.year, els.gender.value), direction });
  });
  $("#unitCode")?.addEventListener("change", syncActiveUnit);
  $("#unitCode")?.addEventListener("input", () => window.setTimeout(syncActiveUnit, 0));
})();
