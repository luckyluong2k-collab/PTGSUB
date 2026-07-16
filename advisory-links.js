import { getApp, getApps, initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAZ1CS05a7rCubn5AtDvTnh6pATMUN0agI",
  authDomain: "ptg-sub.firebaseapp.com",
  projectId: "ptg-sub",
  storageBucket: "ptg-sub.firebasestorage.app",
  messagingSenderId: "32845891728",
  appId: "1:32845891728:web:8d166bcb2ba2eaccb3b015",
  measurementId: "G-HJYWPVSERF",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const DAY_MS = 24 * 60 * 60 * 1000;
const MAX_LINKS = 3;
const DEFAULT_SALE_NAME = "Đức Lương Sun Group";
const DEFAULT_SALE_PHONE = "0387335227";
const menuButton = document.getElementById("advisoryLinksOpenBtn");
let currentUser = null;
let currentLinks = [];
let currentCandidates = [];
let latestPricingState = {};

function safeText(value, max = 240) {
  return String(value ?? "").replace(/\s+/g, " ").trim().slice(0, max);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function unitCode(value) {
  return safeText(value, 24).toUpperCase().replace(/[^A-Z0-9_-]/g, "").slice(0, 24);
}

function saleName(value = "") {
  return safeText(value, 120) || safeText(currentUser?.displayName || currentUser?.email?.split("@")[0], 120) || DEFAULT_SALE_NAME;
}

function salePhone(value = "") {
  let digits = String(value || "").replace(/\D/g, "");
  if (digits.startsWith("84") && digits.length >= 11) digits = `0${digits.slice(2)}`;
  return /^0\d{9,10}$/.test(digits) ? digits : DEFAULT_SALE_PHONE;
}

function timestampMs(value) {
  if (!value) return 0;
  if (typeof value.toMillis === "function") return value.toMillis();
  if (value.seconds) return value.seconds * 1000;
  if (typeof value === "number") return value;
  return 0;
}

function dateTime(value) {
  const ms = timestampMs(value);
  return ms ? new Date(ms).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" }) : "—";
}

function shortDate(value) {
  const ms = timestampMs(value);
  return ms ? new Date(ms).toLocaleDateString("vi-VN") : "—";
}

function linkStatus(item) {
  if (item.revoked) return { label: "Đã thu hồi", className: "revoked" };
  if (timestampMs(item.expiresAt) <= Date.now()) return { label: "Hết hạn", className: "expired" };
  if (item.changeState === "unit_unavailable") return { label: "Căn đã thay đổi", className: "warning" };
  if (item.changeState === "price_changed") return { label: "Giá/chính sách đổi", className: "warning" };
  return { label: "Đang hoạt động", className: "active" };
}

function advisoryUrl(id) {
  return `${window.location.origin}/tu-van/${encodeURIComponent(id)}`;
}

function randomToken() {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
  const area = document.createElement("textarea");
  area.value = text;
  area.style.position = "fixed";
  area.style.left = "-9999px";
  document.body.appendChild(area);
  area.select();
  document.execCommand("copy");
  area.remove();
}

function notify(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  window.clearTimeout(toast._advisoryTimer);
  toast.textContent = message;
  toast.classList.add("show");
  toast._advisoryTimer = window.setTimeout(() => toast.classList.remove("show"), 2200);
}

function closeAccountDrawer() {
  document.body.classList.remove("menu-expanded");
  document.getElementById("accountTab")?.setAttribute("aria-expanded", "false");
  document.getElementById("authGate")?.setAttribute("aria-hidden", "true");
}

function createInterface() {
  if (document.getElementById("advisoryManagerDialog")) return;
  document.body.insertAdjacentHTML("beforeend", `
    <dialog class="advisory-dialog advisory-manager-dialog" id="advisoryManagerDialog" aria-labelledby="advisoryManagerTitle">
      <div class="advisory-dialog-card">
        <header class="advisory-dialog-head">
          <div><span>HỒ SƠ TƯ VẤN RIÊNG</span><h2 id="advisoryManagerTitle">Link đã gửi khách</h2><p>Quản lý báo giá đã chia sẻ mà không để lộ bảng hàng.</p></div>
          <button type="button" data-advisory-close="manager" aria-label="Đóng">×</button>
        </header>
        <div class="advisory-toolbar">
          <button class="advisory-primary" id="advisoryCreateOpenBtn" type="button">+ Tạo link tư vấn</button>
          <button id="advisoryRefreshBtn" type="button">Làm mới danh sách</button>
        </div>
        <p class="advisory-manager-status" id="advisoryManagerStatus" role="status"></p>
        <div class="advisory-table-wrap">
          <table class="advisory-table">
            <thead><tr><th>Khách</th><th>Căn chính</th><th>Tạo lúc</th><th>Hết hạn</th><th>Lượt mở</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
            <tbody id="advisoryLinksBody"></tbody>
          </table>
        </div>
      </div>
    </dialog>
    <dialog class="advisory-dialog advisory-create-dialog" id="advisoryCreateDialog" aria-labelledby="advisoryCreateTitle">
      <form class="advisory-dialog-card" id="advisoryCreateForm">
        <header class="advisory-dialog-head">
          <div><span>TẠO LINK CÓ THỜI HẠN</span><h2 id="advisoryCreateTitle">Chọn tối đa 3 căn</h2><p>Chỉ lưu tên gợi nhớ, liên hệ sale và thông tin căn; không lưu số điện thoại khách, IP hay thiết bị.</p></div>
          <button type="button" data-advisory-close="create" aria-label="Đóng">×</button>
        </header>
        <div class="advisory-sale-grid">
          <label><span>Tên sale</span><input id="advisorySaleName" maxlength="120" autocomplete="name" placeholder="Tên người tư vấn"></label>
          <label><span>Số điện thoại sale</span><input id="advisorySalePhone" type="tel" inputmode="tel" maxlength="16" autocomplete="tel" placeholder="0387335227"></label>
        </div>
        <div class="advisory-create-grid">
          <label><span>Tên khách / tên gợi nhớ</span><input id="advisoryCustomerAlias" maxlength="80" placeholder="Ví dụ: Anh Minh" required></label>
          <label><span>Thời hạn link</span><select id="advisoryExpiry"><option value="1">24 giờ</option><option value="3" selected>3 ngày</option><option value="7">7 ngày</option><option value="14">14 ngày</option><option value="30">30 ngày</option></select></label>
        </div>
        <section class="advisory-manual-unit" aria-labelledby="advisoryManualUnitTitle">
          <div><strong id="advisoryManualUnitTitle">Thêm căn chưa có trong danh sách</strong><span>Nhập đúng mã trong bảng hàng, chọn phương án rồi thêm vào link.</span></div>
          <div class="advisory-manual-unit-controls">
            <label><span>Mã căn</span><input id="advisoryManualUnitCode" maxlength="30" autocomplete="off" placeholder="Ví dụ: P250932"></label>
            <label><span>Phương án thanh toán</span><select id="advisoryManualScenario"></select></label>
            <button class="advisory-primary" id="advisoryManualAddBtn" type="button">+ Thêm căn</button>
          </div>
          <p id="advisoryManualStatus" role="status"></p>
        </section>
        <div class="advisory-candidate-head"><strong>Căn đưa vào link</strong><span>Căn đánh dấu chính sẽ xuất hiện đầu tiên.</span></div>
        <div class="advisory-candidates" id="advisoryCandidates"></div>
        <p class="advisory-form-error" id="advisoryFormError" role="alert"></p>
        <div class="advisory-form-actions"><button type="button" data-advisory-close="create">Hủy</button><button class="advisory-primary" id="advisoryCreateSubmit" type="submit">Tạo link riêng</button></div>
      </form>
    </dialog>
  `);
}

const managerDialog = () => document.getElementById("advisoryManagerDialog");
const createDialog = () => document.getElementById("advisoryCreateDialog");

function openDialog(dialog) {
  if (!dialog) return;
  if (typeof dialog.showModal === "function") dialog.showModal();
  else dialog.setAttribute("open", "");
}

function closeDialog(dialog) {
  if (!dialog) return;
  if (dialog.open && typeof dialog.close === "function") dialog.close();
  else dialog.removeAttribute("open");
}

function currentUnitSnapshot() {
  const code = unitCode(latestPricingState.unitCode || document.getElementById("unitCode")?.value);
  if (!code) return null;
  return {
    code,
    unitType: safeText(latestPricingState.unitType || document.getElementById("unitType")?.value, 80),
    areaText: safeText(latestPricingState.area, 80),
    totalPrice: safeText(latestPricingState.totalText || document.getElementById("totalPrice")?.textContent, 80),
    upfrontPrice: safeText(document.getElementById("upfrontPrice")?.textContent, 80),
    scenario: safeText(latestPricingState.scenarioText || document.querySelector(".segmented button.active")?.textContent, 120),
    at: Date.now(),
  };
}

function candidateSnapshot(entry) {
  const code = unitCode(entry?.code);
  const catalog = window.unitCatalog?.[code] || {};
  const current = currentUnitSnapshot();
  const source = current?.code === code && !entry?.scenarioKey ? { ...entry, ...current } : entry || {};
  const area = safeText(source.area ?? catalog.area ?? catalog.landArea, 80);
  return {
    code,
    unitType: safeText(source.unitType || catalog.unitType, 80),
    areaText: area ? (/m²|m2/i.test(area) ? area : `${area} m²`) : "Chưa cập nhật",
    totalPrice: safeText(source.totalPrice, 80) || "Liên hệ sale cập nhật",
    upfrontPrice: safeText(source.upfrontPrice, 80),
    scenario: safeText(source.scenario, 120),
    tower: safeText(catalog.tower, 40),
    floor: safeText(catalog.floor, 40),
    view: safeText(catalog.view, 120),
    direction: safeText(catalog.direction, 40),
    catalogListedGross: Number(catalog.listedGross) || 0,
    catalogBaseNet: Number(catalog.baseNet) || 0,
    catalogSalesPolicy: safeText(catalog.salesPolicy, 240),
  };
}

async function loadCandidates() {
  const items = [];
  const current = currentUnitSnapshot();
  if (current?.code) items.push(current);
  if (currentUser) {
    const userSnap = await getDoc(doc(db, "users", currentUser.uid));
    const history = userSnap.exists() && Array.isArray(userSnap.data()?.recentSearches) ? userSnap.data().recentSearches : [];
    history.forEach((entry) => items.push(entry));
  }
  const seen = new Set();
  currentCandidates = items.map(candidateSnapshot).filter((item) => {
    if (!item.code || seen.has(item.code)) return false;
    seen.add(item.code);
    return true;
  }).slice(0, 10);
  renderCandidates();
}

function renderCandidates({ selectedCodes = null, primaryCode = "" } = {}) {
  const container = document.getElementById("advisoryCandidates");
  if (!container) return;
  const selected = selectedCodes instanceof Set ? selectedCodes : new Set(currentCandidates[0]?.code ? [currentCandidates[0].code] : []);
  const primary = primaryCode || currentCandidates.find((item) => selected.has(item.code))?.code || "";
  container.textContent = "";
  if (!currentCandidates.length) {
    container.innerHTML = '<p class="advisory-empty">Chưa có căn để tạo link. Hãy tra và tính giá một căn trước.</p>';
    return;
  }
  currentCandidates.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "advisory-candidate";
    const checked = selected.has(item.code);
    row.innerHTML = `
      <label class="advisory-candidate-select">
        <input type="checkbox" data-advisory-unit value="${escapeHtml(item.code)}" ${checked ? "checked" : ""}>
        <span><strong>${escapeHtml(item.code)}</strong><small>${escapeHtml(item.unitType || "Chưa rõ loại")} · ${escapeHtml(item.areaText)}<br>${escapeHtml(item.totalPrice)}${item.scenario ? `<br>Phương án: ${escapeHtml(item.scenario)}` : ""}</small></span>
      </label>
      <label class="advisory-primary-choice"><input type="radio" name="advisoryPrimary" value="${escapeHtml(item.code)}" ${item.code === primary ? "checked" : ""} ${checked ? "" : "disabled"}> Căn chính</label>
    `;
    container.appendChild(row);
  });
}

function selectedCandidateState() {
  return {
    selectedCodes: new Set(Array.from(document.querySelectorAll("[data-advisory-unit]:checked"), (input) => input.value)),
    primaryCode: document.querySelector('input[name="advisoryPrimary"]:checked')?.value || "",
  };
}

function syncManualScenarioOptions() {
  const input = document.getElementById("advisoryManualUnitCode");
  const select = document.getElementById("advisoryManualScenario");
  if (!select) return;
  const previous = select.value || "loan";
  const scenarios = window.ptgsubAdvisoryPricing?.scenarios?.(input?.value) || [
    { value: "loan", label: "Có vay" },
    { value: "standard", label: "Không vay" },
    { value: "tts50", label: "TTS 50%" },
    { value: "tts70", label: "TTS 70%" },
    { value: "tts95", label: "TTS 100%" },
  ];
  select.textContent = "";
  scenarios.forEach((item) => select.add(new Option(item.label, item.value)));
  select.value = scenarios.some((item) => item.value === previous) ? previous : "loan";
}

function addManualCandidate() {
  const codeInput = document.getElementById("advisoryManualUnitCode");
  const scenarioSelect = document.getElementById("advisoryManualScenario");
  const status = document.getElementById("advisoryManualStatus");
  const code = unitCode(codeInput?.value);
  if (!code) { status.textContent = "Vui lòng nhập mã căn."; return; }
  if (!window.unitCatalog?.[code]) { status.textContent = `Không tìm thấy căn ${code} trong bảng hàng hiện tại.`; return; }
  if (!window.ptgsubAdvisoryPricing?.snapshot) { status.textContent = "Bộ tính giá chưa sẵn sàng, vui lòng thử lại."; return; }
  try {
    const state = selectedCandidateState();
    const snapshot = candidateSnapshot(window.ptgsubAdvisoryPricing.snapshot(code, scenarioSelect?.value || "loan"));
    const existingIndex = currentCandidates.findIndex((item) => item.code === code);
    if (existingIndex >= 0) currentCandidates.splice(existingIndex, 1, snapshot);
    else currentCandidates.unshift(snapshot);
    if (state.selectedCodes.size < MAX_LINKS || state.selectedCodes.has(code)) state.selectedCodes.add(code);
    if (!state.primaryCode) state.primaryCode = code;
    renderCandidates(state);
    status.textContent = state.selectedCodes.has(code)
      ? `Đã thêm ${code} · ${snapshot.scenario} vào link.`
      : `Đã thêm ${code} vào danh sách. Link đã chọn đủ 3 căn, hãy bỏ chọn một căn để chọn căn này.`;
    codeInput.value = "";
    syncManualScenarioOptions();
  } catch (error) {
    status.textContent = error?.message || "Không tính được giá căn này.";
  }
}

function selectedUnits() {
  const selectedCodes = Array.from(document.querySelectorAll("[data-advisory-unit]:checked")).map((input) => input.value);
  const primary = document.querySelector('input[name="advisoryPrimary"]:checked')?.value || selectedCodes[0] || "";
  const ordered = selectedCodes.slice().sort((a, b) => (a === primary ? -1 : b === primary ? 1 : 0));
  return ordered.map((code) => currentCandidates.find((item) => item.code === code)).filter(Boolean);
}

function initialChangeState(units) {
  const catalog = window.unitCatalog || {};
  if (!Object.keys(catalog).length) return { state: "unchecked", message: "Chưa đối chiếu lại bảng hàng." };
  const missing = units.filter((unit) => !catalog[unit.code]).map((unit) => unit.code);
  if (missing.length) return { state: "unit_unavailable", message: `Cần kiểm tra lại tình trạng: ${missing.join(", ")}.` };
  return { state: "current", message: "Các căn còn trong bảng hàng tại thời điểm tạo link." };
}

async function createLinkFromUnits({ customerAlias, days, units, ownerName = "", ownerPhone = "", source = null }) {
  currentUser = currentUser || auth.currentUser;
  if (!currentUser) throw new Error("Bạn cần đăng nhập lại.");
  const id = randomToken();
  const state = initialChangeState(units);
  const primaryUnitCode = units[0]?.code || "";
  await setDoc(doc(db, "advisoryLinks", id), {
    ownerUid: currentUser.uid,
    ownerName: saleName(ownerName || source?.ownerName),
    ownerPhone: salePhone(ownerPhone || source?.ownerPhone),
    customerAlias: safeText(customerAlias, 80),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    expiresAt: Timestamp.fromMillis(Date.now() + days * DAY_MS),
    revoked: false,
    version: Number(source?.version || 0) + 1,
    sourceLinkId: safeText(source?.id, 80),
    primaryUnitCode,
    interestedUnitCode: safeText(source?.interestedUnitCode, 24),
    units,
    viewCount: 0,
    lastViewedAt: null,
    changeState: state.state,
    changeMessage: state.message,
    statusCheckedAt: serverTimestamp(),
  });
  return { id, url: advisoryUrl(id) };
}

async function loadLinks({ validate = true } = {}) {
  const status = document.getElementById("advisoryManagerStatus");
  const body = document.getElementById("advisoryLinksBody");
  if (!currentUser || !body) return;
  if (status) status.textContent = "Đang tải link đã gửi…";
  const snap = await getDocs(query(collection(db, "advisoryLinks"), where("ownerUid", "==", currentUser.uid)));
  currentLinks = snap.docs.map((item) => ({ id: item.id, ...item.data() })).sort((a, b) => timestampMs(b.createdAt) - timestampMs(a.createdAt));
  renderLinks();
  if (status) status.textContent = currentLinks.length ? `${currentLinks.length} link · Không lưu IP hoặc thông tin thiết bị.` : "Chưa có link tư vấn nào.";
  if (validate) validateActiveLinks().catch(() => {});
}

function actionButton(label, action, id, className = "") {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  button.dataset.advisoryAction = action;
  button.dataset.linkId = id;
  if (className) button.className = className;
  return button;
}

function renderLinks() {
  const body = document.getElementById("advisoryLinksBody");
  if (!body) return;
  body.textContent = "";
  if (!currentLinks.length) {
    body.innerHTML = '<tr><td colspan="7"><div class="advisory-empty">Chưa có link. Bấm “Tạo link tư vấn” để bắt đầu.</div></td></tr>';
    return;
  }
  currentLinks.forEach((item) => {
    const status = linkStatus(item);
    const row = document.createElement("tr");
    row.innerHTML = `
      <td data-label="Khách"><strong>${escapeHtml(safeText(item.customerAlias, 80) || "Khách hàng")}</strong>${item.interestedUnitCode ? `<small>Quan tâm: ${escapeHtml(unitCode(item.interestedUnitCode))}</small>` : ""}</td>
      <td data-label="Căn chính"><b>${escapeHtml(unitCode(item.primaryUnitCode))}</b><small>Phiên bản ${Number(item.version || 1)}</small></td>
      <td data-label="Tạo lúc">${dateTime(item.createdAt)}</td>
      <td data-label="Hết hạn">${shortDate(item.expiresAt)}</td>
      <td data-label="Lượt mở"><strong>${Number(item.viewCount || 0)}</strong>${item.lastViewedAt ? `<small>Gần nhất: ${dateTime(item.lastViewedAt)}</small>` : ""}</td>
      <td data-label="Trạng thái"><span class="advisory-status ${status.className}">${escapeHtml(status.label)}</span><small>${escapeHtml(safeText(item.changeMessage, 240))}</small></td>
      <td data-label="Thao tác"><div class="advisory-row-actions"></div></td>
    `;
    const actions = row.querySelector(".advisory-row-actions");
    actions.append(
      actionButton("Mở xem", "open", item.id),
      actionButton("Sao chép", "copy", item.id),
      actionButton("Gia hạn 3 ngày", "extend", item.id),
      actionButton("Tạo phiên bản mới", "duplicate", item.id),
      actionButton("Đánh dấu quan tâm", "interest", item.id),
      actionButton("Thu hồi", "revoke", item.id, "danger")
    );
    body.appendChild(row);
  });
}

async function validateActiveLinks() {
  const catalog = window.unitCatalog || {};
  if (Object.keys(catalog).length < 5) {
    window.setTimeout(() => validateActiveLinks().catch(() => {}), 1800);
    return;
  }
  let changed = false;
  for (const item of currentLinks) {
    if (item.revoked || timestampMs(item.expiresAt) <= Date.now()) continue;
    const missing = (item.units || []).filter((unit) => !catalog[unit.code]).map((unit) => unit.code);
    let state = "current";
    let message = "Các căn vẫn còn trong bảng hàng ở lần kiểm tra gần nhất.";
    if (missing.length) {
      state = "unit_unavailable";
      message = `Cần kiểm tra lại tình trạng: ${missing.join(", ")}.`;
    } else {
      const priceChanged = (item.units || []).some((unit) => {
        const live = catalog[unit.code] || {};
        const listedChanged = Number(unit.catalogListedGross) > 0 && Number(live.listedGross) > 0 && Number(unit.catalogListedGross) !== Number(live.listedGross);
        const policyChanged = unit.catalogSalesPolicy && live.salesPolicy && safeText(unit.catalogSalesPolicy) !== safeText(live.salesPolicy);
        return listedChanged || policyChanged;
      });
      if (priceChanged) {
        state = "price_changed";
        message = "Giá gốc hoặc chính sách bảng hàng đã thay đổi; nên tạo phiên bản mới.";
      }
    }
    if (item.changeState === state && item.changeMessage === message) continue;
    await updateDoc(doc(db, "advisoryLinks", item.id), { changeState: state, changeMessage: message, statusCheckedAt: serverTimestamp(), updatedAt: serverTimestamp() });
    changed = true;
  }
  if (changed) await loadLinks({ validate: false });
}

async function handleRowAction(button) {
  const item = currentLinks.find((link) => link.id === button.dataset.linkId);
  if (!item) return;
  const action = button.dataset.advisoryAction;
  if (action === "open") {
    window.open(advisoryUrl(item.id), "_blank", "noopener");
    return;
  }
  if (action === "copy") {
    await copyText(advisoryUrl(item.id));
    notify("Đã sao chép link tư vấn");
    return;
  }
  if (action === "extend") {
    const base = Math.max(Date.now(), timestampMs(item.expiresAt));
    const expires = Math.min(base + 3 * DAY_MS, Date.now() + 30 * DAY_MS);
    await updateDoc(doc(db, "advisoryLinks", item.id), { expiresAt: Timestamp.fromMillis(expires), revoked: false, updatedAt: serverTimestamp() });
    notify("Đã gia hạn link thêm 3 ngày");
  } else if (action === "duplicate") {
    const created = await createLinkFromUnits({ customerAlias: item.customerAlias, days: 3, units: item.units || [], source: item });
    await copyText(created.url);
    notify("Đã tạo phiên bản mới và sao chép link");
  } else if (action === "revoke") {
    await updateDoc(doc(db, "advisoryLinks", item.id), { revoked: true, updatedAt: serverTimestamp() });
    notify("Đã thu hồi link ngay");
  } else if (action === "interest") {
    const codes = (item.units || []).map((unit) => unit.code);
    const currentIndex = Math.max(-1, codes.indexOf(item.interestedUnitCode));
    const nextCode = codes[(currentIndex + 1) % (codes.length + 1)] || "";
    await updateDoc(doc(db, "advisoryLinks", item.id), { interestedUnitCode: nextCode, updatedAt: serverTimestamp() });
    notify(nextCode ? `Đã đánh dấu khách quan tâm căn ${nextCode}` : "Đã bỏ đánh dấu căn quan tâm");
  }
  await loadLinks();
}

async function openManager() {
  currentUser = currentUser || auth.currentUser;
  if (!currentUser) { notify("Bạn cần đăng nhập lại để quản lý link"); return; }
  closeAccountDrawer();
  openDialog(managerDialog());
  try {
    await loadLinks();
  } catch (error) {
    document.getElementById("advisoryManagerStatus").textContent = `Không tải được danh sách: ${error?.message || error}`;
  }
}

async function openCreate() {
  document.getElementById("advisoryFormError").textContent = "";
  document.getElementById("advisorySaleName").value = saleName();
  document.getElementById("advisorySalePhone").value = DEFAULT_SALE_PHONE;
  document.getElementById("advisoryCustomerAlias").value = "";
  document.getElementById("advisoryManualUnitCode").value = "";
  document.getElementById("advisoryManualStatus").textContent = "";
  syncManualScenarioOptions();
  openDialog(createDialog());
  try {
    await loadCandidates();
  } catch (error) {
    document.getElementById("advisoryFormError").textContent = `Không tải được lịch sử căn: ${error?.message || error}`;
  }
}

function bindInterface() {
  createInterface();
  menuButton?.addEventListener("click", openManager);
  document.getElementById("advisoryCreateOpenBtn")?.addEventListener("click", openCreate);
  document.getElementById("advisoryRefreshBtn")?.addEventListener("click", () => loadLinks());
  document.getElementById("advisorySaleName")?.addEventListener("blur", (event) => { event.currentTarget.value = saleName(event.currentTarget.value); });
  document.getElementById("advisorySalePhone")?.addEventListener("blur", (event) => { event.currentTarget.value = salePhone(event.currentTarget.value); });
  document.getElementById("advisoryManualUnitCode")?.addEventListener("input", syncManualScenarioOptions);
  document.getElementById("advisoryManualUnitCode")?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") { event.preventDefault(); addManualCandidate(); }
  });
  document.getElementById("advisoryManualAddBtn")?.addEventListener("click", addManualCandidate);
  document.querySelectorAll('[data-advisory-close="manager"]').forEach((button) => button.addEventListener("click", () => closeDialog(managerDialog())));
  document.querySelectorAll('[data-advisory-close="create"]').forEach((button) => button.addEventListener("click", () => closeDialog(createDialog())));
  managerDialog()?.addEventListener("click", (event) => { if (event.target === managerDialog()) closeDialog(managerDialog()); });
  createDialog()?.addEventListener("click", (event) => { if (event.target === createDialog()) closeDialog(createDialog()); });
  document.getElementById("advisoryCandidates")?.addEventListener("change", (event) => {
    const checkbox = event.target.closest("[data-advisory-unit]");
    if (!checkbox) return;
    const selected = document.querySelectorAll("[data-advisory-unit]:checked");
    if (selected.length > MAX_LINKS) {
      checkbox.checked = false;
      document.getElementById("advisoryFormError").textContent = "Mỗi link chỉ được chứa tối đa 3 căn.";
    } else {
      document.getElementById("advisoryFormError").textContent = "";
    }
    const radio = document.querySelector(`input[name="advisoryPrimary"][value="${checkbox.value}"]`);
    if (radio) radio.disabled = !checkbox.checked;
    const currentPrimary = document.querySelector('input[name="advisoryPrimary"]:checked');
    if (!currentPrimary || currentPrimary.disabled) {
      const firstSelected = document.querySelector("[data-advisory-unit]:checked");
      const nextRadio = firstSelected && document.querySelector(`input[name="advisoryPrimary"][value="${firstSelected.value}"]`);
      if (nextRadio) nextRadio.checked = true;
    }
  });
  document.getElementById("advisoryLinksBody")?.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-advisory-action]");
    if (!button) return;
    button.disabled = true;
    try { await handleRowAction(button); }
    catch (error) { notify(`Không thực hiện được: ${error?.message || error}`); }
    finally { button.disabled = false; }
  });
  document.getElementById("advisoryCreateForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const errorBox = document.getElementById("advisoryFormError");
    const submit = document.getElementById("advisoryCreateSubmit");
    const ownerName = saleName(document.getElementById("advisorySaleName").value);
    const ownerPhone = salePhone(document.getElementById("advisorySalePhone").value);
    const alias = safeText(document.getElementById("advisoryCustomerAlias").value, 80);
    const units = selectedUnits();
    if (!alias) { errorBox.textContent = "Vui lòng nhập tên gợi nhớ của khách."; return; }
    if (!units.length || units.length > MAX_LINKS) { errorBox.textContent = "Hãy chọn từ 1 đến 3 căn."; return; }
    submit.disabled = true;
    submit.textContent = "Đang tạo link…";
    try {
      const days = Number(document.getElementById("advisoryExpiry").value) || 3;
      const created = await createLinkFromUnits({ customerAlias: alias, days, units, ownerName, ownerPhone });
      await copyText(created.url);
      closeDialog(createDialog());
      notify("Đã tạo và sao chép link tư vấn");
      await loadLinks();
    } catch (error) {
      errorBox.textContent = `Không tạo được link: ${error?.message || error}`;
    } finally {
      submit.disabled = false;
      submit.textContent = "Tạo link riêng";
    }
  });
}

bindInterface();
window.addEventListener("ptgsub:pricing-updated", (event) => {
  latestPricingState = { ...(event.detail || {}) };
});
onAuthStateChanged(auth, (user) => {
  currentUser = user;
  if (!user) currentLinks = [];
});
