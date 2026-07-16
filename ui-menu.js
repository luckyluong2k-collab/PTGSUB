(function () {
  "use strict";

  var toggle = document.getElementById("accountTab");
  var drawer = document.getElementById("authGate");
  var closeButton = document.getElementById("authCloseBtn");
  if (!toggle || !drawer) return;

  localStorage.removeItem("ptgsub-menu-expanded");

  function applyState(expanded) {
    document.body.classList.toggle("menu-expanded", expanded);
    drawer.hidden = !expanded;
    toggle.setAttribute("aria-expanded", String(expanded));
    toggle.setAttribute("aria-label", expanded ? "Thu gon menu" : "Mo menu");
    toggle.title = expanded ? "Thu gon menu" : "Mo menu";
  }

  toggle.addEventListener("click", function (event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    applyState(!document.body.classList.contains("menu-expanded"));
  }, true);

  if (closeButton) {
    closeButton.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopImmediatePropagation();
      applyState(false);
      toggle.focus();
    }, true);
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && document.body.classList.contains("menu-expanded")) {
      applyState(false);
      toggle.focus();
    }
  });

  applyState(false);
}());
