(function () {
  "use strict";

  var input = document.getElementById("adminUserSearch");
  var board = document.getElementById("adminUsers");
  if (!input || !board) return;

  function normalize(value) {
    return String(value || "").trim().toLocaleLowerCase("vi");
  }

  function applyFilter() {
    var query = normalize(input.value);
    board.querySelectorAll(".admin-user-section").forEach(function (section) {
      var visibleCount = 0;
      section.querySelectorAll(".admin-user-card").forEach(function (card) {
        var emailNode = card.querySelector(":scope > strong");
        var visible = !query || normalize(emailNode && emailNode.textContent).includes(query);
        card.hidden = !visible;
        if (visible) visibleCount += 1;
      });
      section.classList.toggle("admin-section-no-match", Boolean(query) && visibleCount === 0);
    });
  }

  input.addEventListener("input", applyFilter);
  input.addEventListener("search", applyFilter);
  new MutationObserver(applyFilter).observe(board, { childList: true, subtree: true });
}());
