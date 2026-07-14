(function () {
  "use strict";

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
