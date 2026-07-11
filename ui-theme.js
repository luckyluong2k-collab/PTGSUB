(function () {
  "use strict";
  var storageKey = "ptgsub-ui-theme";
  var body = document.body;
  var toggle = document.getElementById("uiThemeToggle");
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
