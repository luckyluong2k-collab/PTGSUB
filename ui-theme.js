(function () {
  "use strict";
  var storageKey = "ptgsub-ui-theme";
  var siteThemeStorageKey = "ptgsub-site-theme";
  var body = document.body;
  var toggle = document.getElementById("uiThemeToggle");
  var siteThemes = [
    {
      id: "navy-gold",
      name: "Navy-gold",
      description: "Giao diện xanh navy phối vàng sang trọng đang sử dụng.",
      colors: ["#071c22", "#0f766e", "#d7b46a", "#f5faf8"],
    },
  ];

  window.ptgsubSiteThemes = siteThemes;
  window.ptgsubApplySiteTheme = function ptgsubApplySiteTheme(themeId) {
    var exists = siteThemes.some(function (theme) { return theme.id === themeId; });
    var selectedId = exists ? themeId : siteThemes[0].id;
    body.dataset.siteTheme = selectedId;
    localStorage.setItem(siteThemeStorageKey, selectedId);
    window.dispatchEvent(new CustomEvent("ptgsub-site-theme-change", { detail: { themeId: selectedId } }));
    return selectedId;
  };

  window.ptgsubApplySiteTheme(localStorage.getItem(siteThemeStorageKey) || siteThemes[0].id);
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
