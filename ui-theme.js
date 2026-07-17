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
      name: "Trung Thu Trăng Vàng",
      bodyClass: "theme-mid-autumn-red-gold",
      description: "Giao diện Trung Thu đồng bộ: sáng kem - đỏ son - vàng đồng, tối navy đêm - vàng ánh trăng.",
      colors: ["#fff8e7", "#a52a24", "#d8a62e", "#07152d", "#0d2140", "#f1c65b"],
    },
  ];

  function requestedDemoThemeId() {
    try {
      var requested = new URLSearchParams(window.location.search).get("demo-theme") || "";
      return systemThemes.some(function (theme) { return theme.id === requested; }) ? requested : "";
    } catch (_error) {
      return "";
    }
  }

  var demoThemeId = requestedDemoThemeId();

  function findSystemTheme(themeId) {
    return systemThemes.find(function (theme) { return theme.id === themeId; }) || systemThemes[0];
  }

  function ensureMidAutumnDecor() {
    var decorations = document.querySelectorAll("#midAutumnDecor");
    for (var index = 1; index < decorations.length; index += 1) {
      decorations[index].remove();
    }
    return decorations[0] || null;
  }

  function setMidAutumnDecorVisible(isVisible) {
    var decor = ensureMidAutumnDecor();
    if (decor) decor.hidden = !isVisible;
  }

  function applySystemTheme(themeId) {
    var selectedTheme = findSystemTheme(demoThemeId || themeId);
    systemThemes.forEach(function (theme) {
      body.classList.remove(theme.bodyClass);
    });
    body.classList.add(selectedTheme.bodyClass);
    body.dataset.siteTheme = selectedTheme.id;
    body.classList.toggle("site-theme-demo", Boolean(demoThemeId));
    setMidAutumnDecorVisible(selectedTheme.id === "mid-autumn-red-gold");
    if (!demoThemeId) localStorage.setItem(systemThemeStorageKey, selectedTheme.id);
    window.dispatchEvent(new CustomEvent("ptgsub-site-theme-change", {
      detail: { themeId: selectedTheme.id, isDemo: Boolean(demoThemeId) },
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
  window.ensureMidAutumnDecor = ensureMidAutumnDecor;
  window.setMidAutumnDecorVisible = setMidAutumnDecorVisible;

  loadSystemTheme();

  if (demoThemeId) {
    var demoBadge = document.createElement("div");
    var demoLabel = document.createElement("strong");
    var demoExit = document.createElement("a");
    var exitUrl = new URL(window.location.href);
    exitUrl.searchParams.delete("demo-theme");
    demoBadge.className = "mid-autumn-demo-badge";
    demoBadge.setAttribute("role", "status");
    demoLabel.textContent = "DEMO TRUNG THU";
    demoExit.textContent = "Thoát demo";
    demoExit.href = exitUrl.href;
    demoBadge.append(demoLabel, demoExit);
    body.appendChild(demoBadge);
  }

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
