(() => {
  "use strict";

  const config = window.TOUR_CONFIG;
  const loadingScreen = document.getElementById("loading-screen");
  const sceneTitle = document.getElementById("scene-title");
  const sceneList = document.getElementById("scene-list");
  const roomPanel = document.querySelector(".room-panel");
  const panelToggle = document.getElementById("panel-toggle");
  const fullscreenButton = document.getElementById("fullscreen-button");

  if (!config || !config.scenes || !config.firstScene) {
    loadingScreen.innerHTML = "<strong>Không tìm thấy cấu hình tour.</strong>";
    throw new Error("TOUR_CONFIG is invalid");
  }

  document.getElementById("project-name").textContent = config.projectName;
  document.getElementById("unit-name").textContent = config.unitName;
  document.getElementById("call-link").href = `tel:${config.phone}`;
  document.getElementById("zalo-link").href = config.zaloUrl;

  const viewer = pannellum.viewer("panorama", {
    default: {
      firstScene: config.firstScene,
      autoLoad: true,
      sceneFadeDuration: 650,
      showControls: true,
      compass: false,
      keyboardZoom: true,
      mouseZoom: true,
      friction: 0.18
    },
    scenes: config.scenes
  });

  Object.entries(config.scenes).forEach(([sceneId, scene]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "scene-button";
    button.dataset.sceneId = sceneId;
    button.innerHTML = `
      <span class="scene-icon" aria-hidden="true">${scene.icon || "📍"}</span>
      <span class="scene-copy">
        <strong>${escapeHtml(scene.title || sceneId)}</strong>
        <span>${escapeHtml(scene.subtitle || "Xem không gian 360°")}</span>
      </span>
    `;
    button.addEventListener("click", () => viewer.loadScene(sceneId));
    sceneList.appendChild(button);
  });

  viewer.on("load", () => {
    loadingScreen.classList.add("hidden");
    updateSceneUI(viewer.getScene());
  });

  viewer.on("scenechange", (sceneId) => {
    loadingScreen.classList.remove("hidden");
    updateSceneUI(sceneId);
  });

  viewer.on("error", (message) => {
    loadingScreen.classList.remove("hidden");
    loadingScreen.innerHTML = `
      <strong>Không tải được ảnh 360°</strong>
      <span>${escapeHtml(String(message))}</span>
    `;
  });

  panelToggle.addEventListener("click", () => {
    roomPanel.classList.toggle("collapsed");
    panelToggle.textContent = roomPanel.classList.contains("collapsed") ? "+" : "−";
  });

  fullscreenButton.addEventListener("click", () => viewer.toggleFullscreen());

  function updateSceneUI(sceneId) {
    const scene = config.scenes[sceneId];
    if (!scene) return;
    sceneTitle.textContent = scene.title || sceneId;
    document.title = `${scene.title} | ${config.unitName}`;
    document.querySelectorAll(".scene-button").forEach((button) => {
      const isActive = button.dataset.sceneId === sceneId;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-current", isActive ? "true" : "false");
    });
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#039;",
      '"': "&quot;"
    })[char]);
  }
})();
