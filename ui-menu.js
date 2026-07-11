(function () {
  "use strict";

  var toggle = document.getElementById("accountTab");
  if (!toggle) return;

  var expanded = false;
  localStorage.removeItem("ptgsub-menu-expanded");

  function applyState() {
    document.body.classList.toggle("menu-expanded", expanded);
    toggle.setAttribute("aria-expanded", String(expanded));
    toggle.setAttribute("aria-label", expanded ? "Thu gọn menu" : "Mở toàn bộ menu");
    toggle.title = expanded ? "Thu gọn menu" : "Mở toàn bộ menu";
  }

  toggle.addEventListener("click", function (event) {
    if (window.matchMedia("(min-width: 1051px)").matches) {
      event.preventDefault();
      event.stopImmediatePropagation();
      expanded = !expanded;
      applyState();
    }
  }, true);

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && expanded && window.matchMedia("(min-width: 1051px)").matches) {
      expanded = false;
      applyState();
    }
  });

  applyState();
}());
