(function () {
  "use strict";

  var storageKey = "ptgsub-ui-theme";
  var body = document.body;
  var toggle = document.getElementById("uiThemeToggle");

  if (!toggle) return;

  function updateToggle(isDark) {
    toggle.querySelector("span").textContent = isDark ? "☀" : "☾";
    toggle.setAttribute("aria-label", isDark ? "Bật giao diện sáng" : "Bật giao diện tối");
  }

  var savedTheme = localStorage.getItem(storageKey);
  var isDark = savedTheme === "dark";
  body.classList.toggle("theme-dark", isDark);
  updateToggle(isDark);

  toggle.addEventListener("click", function () {
    isDark = !body.classList.contains("theme-dark");
    body.classList.toggle("theme-dark", isDark);
    localStorage.setItem(storageKey, isDark ? "dark" : "light");
    updateToggle(isDark);
  });
}());
