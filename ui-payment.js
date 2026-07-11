(function () {
  "use strict";
  var openButton = document.querySelector(".login-price-spotlight");
  var dialog = document.getElementById("paymentDialog");
  var closeButton = document.getElementById("paymentCloseBtn");
  if (!openButton || !dialog || !closeButton) return;

  openButton.id = "paymentOpenBtn";
  openButton.tabIndex = 0;
  openButton.setAttribute("role", "button");
  openButton.setAttribute("aria-haspopup", "dialog");
  openButton.setAttribute("aria-controls", "paymentDialog");
  openButton.setAttribute("aria-label", "Mở thông tin chuyển khoản 129 nghìn một năm");

  function openDialog() {
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
  }
  function closeDialog() {
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  }

  openButton.addEventListener("click", openDialog);
  openButton.addEventListener("keydown", function (event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openDialog();
    }
  });
  closeButton.addEventListener("click", closeDialog);
  dialog.addEventListener("click", function (event) {
    if (event.target === dialog) closeDialog();
  });
}());
