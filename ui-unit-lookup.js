(function () {
  "use strict";

  // Bản vá tọa độ thấp tầng:
  // - Tách mã theo tên đường C1-C22 dài nhất (C19177 = C19 / căn 177).
  // - Luôn ưu tiên tọa độ exact đã duyệt.
  // - Chỉ nội suy giữa các căn cùng đường và cùng dãy chẵn/lẻ.
  // - Không dùng dữ liệu ước lượng cũ nếu chưa đủ mẫu, tránh khoanh nhầm căn.
  try {
    var strictLowRiseStreets = Array.from({ length: 22 }, function (_, index) {
      return "C" + (index + 1);
    }).sort(function (a, b) {
      return b.length - a.length;
    });

    function parseLowRiseCodeStrict(value) {
      var code = typeof normalizeUnitCode === "function"
        ? normalizeUnitCode(value)
        : String(value || "").trim().toUpperCase().replace(/\s+/g, "");

      if (!/^C\d+$/.test(code)) {
        return { street: "", house: "" };
      }

      var street = strictLowRiseStreets.find(function (item) {
        return code.indexOf(item) === 0 && code.length > item.length;
      }) || "";

      if (!street) return { street: "", house: "" };
      return {
        street: street,
        house: code.slice(street.length),
      };
    }

    function interpolateNumber(start, end, ratio) {
      return start + (end - start) * ratio;
    }

    function interpolateRect(start, end, ratio) {
      return {
        x: Math.round(interpolateNumber(start.x, end.x, ratio)),
        y: Math.round(interpolateNumber(start.y, end.y, ratio)),
        width: Math.round(interpolateNumber(start.width, end.width, ratio)),
        height: Math.round(interpolateNumber(start.height, end.height, ratio)),
      };
    }

    function interpolatePoint(start, end, ratio) {
      return {
        x: Math.round(interpolateNumber(start.x, end.x, ratio)),
        y: Math.round(interpolateNumber(start.y, end.y, ratio)),
      };
    }

    function resolveStrictLowRiseInterpolation(unitCode) {
      if (
        typeof lowRiseUnitMapLocations === "undefined"
        || typeof lowRiseMapImage === "undefined"
      ) {
        return null;
      }

      var parsed = parseLowRiseCodeStrict(unitCode);
      var targetHouse = Number.parseInt(parsed.house, 10);
      if (!parsed.street || !Number.isFinite(targetHouse)) return null;

      var targetParity = Math.abs(targetHouse % 2);
      var samples = Object.keys(lowRiseUnitMapLocations)
        .map(function (code) {
          var sampleParsed = parseLowRiseCodeStrict(code);
          var house = Number.parseInt(sampleParsed.house, 10);
          return {
            code: code,
            street: sampleParsed.street,
            house: house,
            location: lowRiseUnitMapLocations[code],
          };
        })
        .filter(function (sample) {
          return sample.street === parsed.street
            && Number.isFinite(sample.house)
            && Math.abs(sample.house % 2) === targetParity
            && sample.location
            && sample.location.image === lowRiseMapImage
            && sample.location.unitRect;
        })
        .sort(function (a, b) {
          return a.house - b.house;
        });

      if (samples.length < 2) return null;

      var lower = null;
      var upper = null;
      for (var index = 0; index < samples.length; index += 1) {
        if (samples[index].house <= targetHouse) lower = samples[index];
        if (samples[index].house >= targetHouse) {
          upper = samples[index];
          break;
        }
      }

      // Chỉ nội suy trong khoảng đã có mẫu; không ngoại suy ra ngoài để tránh khoanh sai.
      if (!lower || !upper || lower.house === upper.house) return null;

      var ratio = (targetHouse - lower.house) / (upper.house - lower.house);
      var start = lower.location;
      var end = upper.location;

      return {
        image: lowRiseMapImage,
        scale: interpolateNumber(start.scale || 1, end.scale || 1, ratio),
        crop: interpolateRect(start.crop, end.crop, ratio),
        unitRect: interpolateRect(start.unitRect, end.unitRect, ratio),
        label: interpolateRect(start.label, end.label, ratio),
        arrowStart: interpolatePoint(start.arrowStart, end.arrowStart, ratio),
        arrowEnd: interpolatePoint(start.arrowEnd, end.arrowEnd, ratio),
      };
    }

    if (typeof parseLowRiseCodeParts === "function") {
      parseLowRiseCodeParts = parseLowRiseCodeStrict;
    }

    if (
      typeof lowRiseUnitMapLocations !== "undefined"
      && typeof lowRiseMapImage !== "undefined"
      && typeof LOW_RISE_SOURCE_SCALE !== "undefined"
      && typeof scaleLowRiseRect === "function"
      && typeof scaleLowRisePoint === "function"
    ) {
      // Điểm exact bổ sung đã đối chiếu trên mặt bằng gốc.
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

          var lowRiseParts = parseLowRiseCodeStrict(unitCode);
          if (lowRiseParts.street) {
            var exactLowRiseLocation = lowRiseUnitMapLocations[unitCode];
            if (exactLowRiseLocation) return exactLowRiseLocation;

            var interpolatedLowRiseLocation = resolveStrictLowRiseInterpolation(unitCode);
            if (interpolatedLowRiseLocation) return interpolatedLowRiseLocation;

            // Không trả về tọa độ ước lượng cũ cho mã C nếu chưa có đủ mẫu chính xác.
            return null;
          }

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
