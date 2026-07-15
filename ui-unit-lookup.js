(function () {
  "use strict";

  // GitHub Pages đang thiếu ảnh lienke.png. Ưu tiên các tọa độ thấp tầng
  // đã có trên lowrise-map-sharp.jpg để vẫn tạo được ảnh chính xác.
  try {
    if (
      typeof lowRiseUnitMapLocations !== "undefined"
      && typeof lowRiseMapImage !== "undefined"
      && typeof LOW_RISE_SOURCE_SCALE !== "undefined"
      && typeof scaleLowRiseRect === "function"
      && typeof scaleLowRisePoint === "function"
    ) {
      if (!lowRiseUnitMapLocations.C1717) {
        lowRiseUnitMapLocations.C1717 = {
          image: lowRiseMapImage,
          scale: 0.22 * LOW_RISE_SOURCE_SCALE,
          crop: scaleLowRiseRect({ x: 410, y: 980, width: 650, height: 340 }),
          unitRect: scaleLowRiseRect({ x: 486, y: 1039, width: 7, height: 19 }),
          label: scaleLowRiseRect({ x: 660, y: 995, width: 370, height: 115 }),
          arrowStart: scaleLowRisePoint({ x: 660, y: 1130 }),
          arrowEnd: scaleLowRisePoint({ x: 489.5, y: 1048.5 }),
        };
      }

      if (typeof resolveUnitMapLocation === "function") {
        var originalResolveUnitMapLocation = resolveUnitMapLocation;
        resolveUnitMapLocation = function (code) {
          var unitCode = typeof normalizeUnitCode === "function"
            ? normalizeUnitCode(code)
            : String(code || "").trim().toUpperCase().replace(/\s+/g, "");
          var exactLowRiseLocation = lowRiseUnitMapLocations[unitCode];
          if (exactLowRiseLocation) return exactLowRiseLocation;
          return originalResolveUnitMapLocation(code);
        };
      }
    }
  } catch (error) {
    console.warn("Không áp dụng được bản vá chỉ căn thấp tầng:", error);
  }

  var input = document.getElementById("unitCode");
  var button = document.getElementById("unitLookupBtn");
  if (!input || !button) return;

  function normalizedCode() {
    return typeof normalizeUnitCode === "function"
      ? normalizeUnitCode(input.value)
      : String(input.value || "").trim().toUpperCase().replace(/\s+/g, "");
  }

  function hasExactUnit() {
    var code = normalizedCode();
    return Boolean(code && typeof unitCatalog !== "undefined" && unitCatalog[code]);
  }

  function syncButton() {
    var code = normalizedCode();
    button.hidden = !code || hasExactUnit();
    button.textContent = code ? "Tra căn " + code : "Tra căn";
  }

  input.addEventListener("input", syncButton);
  input.addEventListener("change", syncButton);

  button.addEventListener("click", async function () {
    button.disabled = true;
    button.textContent = "Đang tra căn...";
    try {
      if (typeof refreshCatalogFromGoogle === "function") {
        await refreshCatalogFromGoogle({ showSuccessToast: false });
      }
      if (typeof lastAutoFilledCode !== "undefined") lastAutoFilledCode = "";
      var found = typeof applyUnitCatalog === "function" && applyUnitCatalog();
      if (found) {
        if (typeof render === "function") render();
      } else if (typeof showToast === "function") {
        showToast("Không tìm thấy mã căn " + normalizedCode());
      }
    } catch (error) {
      if (typeof showToast === "function") {
        showToast(error && error.message ? error.message : "Không tra được mã căn");
      }
    } finally {
      button.disabled = false;
      syncButton();
    }
  });

  window.setTimeout(syncButton, 0);
}());
