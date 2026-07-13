(function () {
  "use strict";

  var storageKey = "ptgsub-ui-theme";
  var systemThemeStorageKey = "ptgsub-site-theme";
  var body = document.body;
  var toggle = document.getElementById("uiThemeToggle");
  var systemThemes = [
    {
      id: "navy-gold",
      name: "Navy-gold",
      bodyClass: "theme-navy-gold",
      description: "Giao diện xanh navy phối vàng sang trọng đang sử dụng.",
      colors: ["#071c22", "#0f766e", "#d7b46a", "#f5faf8"],
    },
    {
      id: "mid-autumn-red-gold",
      name: "Trung Thu vàng-đỏ",
      bodyClass: "theme-mid-autumn-red-gold",
      description: "Giao diện Trung Thu Việt Nam với sắc đỏ son, vàng ánh trăng, đèn ông sao và không khí lễ hội.",
      colors: ["#5f0614", "#8b0f23", "#b51b31", "#f5c451", "#ffd978", "#fff7e8"],
    },
  ];

  function findSystemTheme(themeId) {
    return systemThemes.find(function (theme) { return theme.id === themeId; }) || systemThemes[0];
  }

  function applySystemTheme(themeId) {
    var selectedTheme = findSystemTheme(themeId);
    systemThemes.forEach(function (theme) {
      body.classList.remove(theme.bodyClass);
    });
    body.classList.add(selectedTheme.bodyClass);
    body.dataset.siteTheme = selectedTheme.id;
    localStorage.setItem(systemThemeStorageKey, selectedTheme.id);
    window.dispatchEvent(new CustomEvent("ptgsub-site-theme-change", {
      detail: { themeId: selectedTheme.id },
    }));
    return selectedTheme.id;
  }

  function loadSystemTheme() {
    return applySystemTheme(localStorage.getItem(systemThemeStorageKey) || systemThemes[0].id);
  }

  window.ptgsubSiteThemes = systemThemes;
  window.ptgsubSystemThemes = systemThemes;
  window.ptgsubApplySiteTheme = applySystemTheme;
  window.applySystemTheme = applySystemTheme;
  window.loadSystemTheme = loadSystemTheme;

  loadSystemTheme();

  if (!toggle) return;

  function updateToggle(isDark) {
    var text = toggle.querySelector(".theme-toggle-text");
    if (text) text.textContent = isDark ? "Tối" : "Sáng";
    toggle.classList.toggle("is-dark", isDark);
    toggle.setAttribute("aria-label", isDark ? "Bật giao diện sáng" : "Bật giao diện tối");
  }

  var isDark = localStorage.getItem(storageKey) === "dark";
  body.classList.toggle("theme-dark", isDark);
  updateToggle(isDark);
  toggle.addEventListener("click", function () {
    isDark = !body.classList.contains("theme-dark");
    body.classList.toggle("theme-dark", isDark);
    localStorage.setItem(storageKey, isDark ? "dark" : "light");
    updateToggle(isDark);
  });
}());
