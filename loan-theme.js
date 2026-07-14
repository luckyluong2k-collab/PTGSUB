(function () {
  "use strict";
  var key = "ptgsub-ui-theme";
  var homeLink = document.getElementById("homeLink");
  if (!homeLink) return;

  var toggle = document.createElement("button");
  toggle.className = "loan-theme-toggle";
  toggle.id = "loanThemeToggle";
  toggle.type = "button";
  toggle.innerHTML = '<span class="loan-theme-track" aria-hidden="true"><span></span></span><b>Sáng</b>';
  homeLink.before(toggle);

  function apply(isDark) {
    document.documentElement.classList.toggle("theme-dark", isDark);
    document.body.classList.toggle("theme-dark", isDark);
    toggle.classList.toggle("is-dark", isDark);
    toggle.querySelector("b").textContent = isDark ? "Tối" : "Sáng";
    toggle.setAttribute("aria-label", isDark ? "Bật giao diện sáng" : "Bật giao diện tối");
  }

  apply(localStorage.getItem(key) === "dark");
  toggle.addEventListener("click", function () {
    var isDark = !document.documentElement.classList.contains("theme-dark");
    localStorage.setItem(key, isDark ? "dark" : "light");
    apply(isDark);
  });
}());
