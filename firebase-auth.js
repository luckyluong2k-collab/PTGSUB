import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  browserLocalPersistence,
  getRedirectResult,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  onAuthStateChanged,
  setPersistence,
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  serverTimestamp,
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

const ADMIN_EMAIL = "luckyluong2k@gmail.com";
const HISTORY_LIMIT = 10;

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });
auth.languageCode = "vi";

function authErrorMessage(error) {
  const code = error?.code || "";
  if (code === "auth/unauthorized-domain") {
    const host = window.location.protocol === "file:" ? "file:// (đang mở trực tiếp từ máy)" : window.location.hostname;
    return `Domain ${host} chưa được thêm trong Firebase Authentication > Settings > Authorized domains. Hãy mở bằng link web đã deploy hoặc localhost.`;
  }
  if (code === "auth/operation-not-allowed") {
    return "Firebase chưa bật Google provider trong Authentication > Sign-in method.";
  }
  if (code === "auth/popup-blocked" || code === "auth/cancelled-popup-request") {
    return "Trình duyệt đang chặn cửa sổ đăng nhập Google. Hãy cho phép pop-up rồi bấm đăng nhập lại.";
  }
  if (code === "auth/popup-closed-by-user") {
    return "Bạn vừa đóng cửa sổ đăng nhập Google. Bấm đăng nhập lại để tiếp tục.";
  }
  if (code === "permission-denied") {
    return "Firestore Rules chưa cho phép đọc/ghi người dùng. Hãy dán file firestore.rules rồi Publish.";
  }
  return error?.message || String(error || "Không rõ lỗi đăng nhập.");
}

const authGate = document.querySelector("#authGate");
const appContent = document.querySelector("#appContent");
const accountTab = document.querySelector("#accountTab");
const authCloseBtn = document.querySelector("#authCloseBtn");
const loginBtn = document.querySelector("#loginBtn");
const logoutBtn = document.querySelector("#logoutBtn");
const authStatus = document.querySelector("#authStatus");
const adminPanel = document.querySelector("#adminPanel");
const adminUsers = document.querySelector("#adminUsers");
const myHistoryPanel = document.querySelector("#myHistoryPanel");
const myHistoryList = document.querySelector("#myHistoryList");
const loginIntro = document.querySelector("#loginIntro");
const loginMenuSection = document.querySelector("#loginMenuSection");
const protectedMenuItems = Array.from(document.querySelectorAll("[data-auth-menu]"));
const browserWarning = document.querySelector("#browserWarning");
const copyAppLinkBtn = document.querySelector("#copyAppLinkBtn");
const openBrowserLink = document.querySelector("#openBrowserLink");

let currentUserId = "";
let currentUserEmail = "";
let currentUserData = null;
let currentIsAdmin = false;
let lastLoggedCode = "";
let historyTimer = 0;
let redirectResultChecked = false;

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function normalizeUnitCode(value) {
  return String(value || "").trim().toUpperCase().replace(/\s+/g, "");
}

function moneyText(value) {
  return String(value || "").trim();
}

function setStatus(message) {
  if (authStatus) authStatus.textContent = message;
}

function isMobileDevice() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || "");
}

function isBlockedOAuthBrowser() {
  const ua = navigator.userAgent || "";
  return /FBAN|FBAV|FBIOS|FB_IAB|Instagram|Line|MicroMessenger|Zalo|Messenger|wv\)/i.test(ua);
}

function updateBrowserWarning(force = false) {
  const shouldShow = force || isBlockedOAuthBrowser();
  if (browserWarning) browserWarning.hidden = !shouldShow;
  if (openBrowserLink) openBrowserLink.href = window.location.href;
  return shouldShow;
}

async function prepareGoogleLogin() {
  await setPersistence(auth, browserLocalPersistence);
}

async function checkRedirectLoginResult() {
  if (redirectResultChecked) return;
  redirectResultChecked = true;
  try {
    await prepareGoogleLogin();
    const result = await getRedirectResult(auth);
    if (result?.user) {
      setStatus("Đã nhận đăng nhập Google, đang kiểm tra quyền truy cập...");
    }
  } catch (error) {
    if (String(error?.message || error).includes("disallowed_useragent")) updateBrowserWarning(true);
    setStatus(`Không hoàn tất đăng nhập Google: ${authErrorMessage(error)}`);
    openDrawer();
  }
}

function setMenuAuthState(isInsideApp) {
  if (loginIntro) loginIntro.hidden = isInsideApp;
  if (loginMenuSection) loginMenuSection.open = !isInsideApp;
  protectedMenuItems.forEach((item) => {
    item.hidden = !isInsideApp;
  });
}

function openDrawer() {
  if (authGate) authGate.hidden = false;
  if (accountTab) accountTab.setAttribute("aria-expanded", "true");
}

function closeDrawer() {
  if (authGate) authGate.hidden = true;
  if (accountTab) accountTab.setAttribute("aria-expanded", "false");
}

function showApp(userEmail) {
  if (appContent) appContent.hidden = false;
  if (loginBtn) loginBtn.hidden = true;
  if (logoutBtn) logoutBtn.hidden = false;
  setMenuAuthState(true);
  setStatus(`Đã đăng nhập: ${userEmail}`);
}

function hideApp(message) {
  if (appContent) appContent.hidden = true;
  if (loginBtn) loginBtn.hidden = false;
  if (logoutBtn) logoutBtn.hidden = true;
  if (adminPanel) adminPanel.hidden = true;
  if (myHistoryPanel) myHistoryPanel.hidden = true;
  setMenuAuthState(false);
  updateBrowserWarning(false);
  setStatus(message);
  openDrawer();
}

function timestampMs(value) {
  if (!value) return 0;
  if (typeof value === "number") return value;
  if (typeof value.toMillis === "function") return value.toMillis();
  if (value.seconds) return value.seconds * 1000;
  return 0;
}

function formatDate(value) {
  const ms = timestampMs(value);
  if (!ms) return "Chưa rõ thời gian";
  return new Date(ms).toLocaleString("vi-VN");
}

function isAdminEmail(email) {
  return normalizeEmail(email) === ADMIN_EMAIL;
}

async function ensureUserDoc(user) {
  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);
  const email = normalizeEmail(user.email);
  const adminEmail = isAdminEmail(email);

  if (!snap.exists()) {
    const data = {
      email,
      displayName: user.displayName || "",
      approved: adminEmail,
      role: adminEmail ? "admin" : "user",
      recentSearches: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    };
    await setDoc(userRef, data);
    return { ...data, recentSearches: [] };
  }

  const oldData = snap.data() || {};
  const oldSearches = Array.isArray(oldData.recentSearches) ? oldData.recentSearches : [];
  const patch = {
    email,
    displayName: user.displayName || oldData.displayName || "",
    lastLoginAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  if (oldSearches.length > HISTORY_LIMIT) {
    patch.recentSearches = oldSearches.slice(0, HISTORY_LIMIT);
  }

  if (adminEmail) {
    patch.approved = true;
    patch.role = "admin";
  }

  await updateDoc(userRef, patch);

  return {
    ...oldData,
    ...patch,
    email,
    approved: adminEmail ? true : Boolean(oldData.approved),
    role: adminEmail ? "admin" : oldData.role || "user",
    recentSearches: Array.isArray(patch.recentSearches) ? patch.recentSearches : oldSearches,
  };
}

function readCurrentSearch() {
  const code = normalizeUnitCode(document.querySelector("#unitCode")?.value);
  if (!code) return null;

  return {
    code,
    policyGroup: document.querySelector("#policyGroup")?.value || "",
    unitType: document.querySelector("#unitType")?.value || "",
    area: document.querySelector("#area")?.value || "",
    totalPrice: moneyText(document.querySelector("#totalPrice")?.textContent),
    upfrontPrice: moneyText(document.querySelector("#upfrontPrice")?.textContent),
    scenario: document.querySelector(".segmented button.active")?.textContent?.trim() || "",
    at: Date.now(),
  };
}

async function saveCurrentSearch(force = false) {
  if (!currentUserId || !currentUserData?.approved) return;
  const item = readCurrentSearch();
  if (!item?.code) return;
  if (!force && item.code === lastLoggedCode) return;
  lastLoggedCode = item.code;

  const userRef = doc(db, "users", currentUserId);
  const snap = await getDoc(userRef);
  const oldData = snap.data() || {};
  const current = Array.isArray(oldData.recentSearches) ? oldData.recentSearches : [];
  const withoutSameCode = current.filter((entry) => normalizeUnitCode(entry?.code) !== item.code);
  const recentSearches = [item, ...withoutSameCode].slice(0, HISTORY_LIMIT);

  await updateDoc(userRef, {
    recentSearches,
    updatedAt: serverTimestamp(),
  });

  currentUserData = { ...currentUserData, recentSearches };
  renderMyHistory(recentSearches);
}

function scheduleSaveCurrentSearch(force = false) {
  window.clearTimeout(historyTimer);
  historyTimer = window.setTimeout(() => {
    saveCurrentSearch(force).catch(() => {});
  }, force ? 150 : 900);
}

function renderHistoryList(container, searches = []) {
  if (!container) return;
  container.textContent = "";
  if (!searches.length) {
    container.innerHTML = `<div class="history-card">Chưa có lịch sử tra căn.</div>`;
    return;
  }

  searches.slice(0, HISTORY_LIMIT).forEach((item) => {
    const card = document.createElement("div");
    card.className = "history-card";
    card.innerHTML = `
      <strong>${escapeHtml(item.code || "Không rõ mã căn")}</strong>
      <span class="history-meta">
        ${escapeHtml(item.unitType || "")}${item.area ? ` · ${escapeHtml(item.area)} m²` : ""}<br>
        ${item.totalPrice ? `Giá cuối: ${escapeHtml(item.totalPrice)}<br>` : ""}
        ${item.scenario ? `Phương án: ${escapeHtml(item.scenario)}<br>` : ""}
        ${escapeHtml(formatDate(item.at))}
      </span>
    `;

    const useBtn = document.createElement("button");
    useBtn.className = "history-mini-btn";
    useBtn.type = "button";
    useBtn.textContent = "Tra lại căn này";
    useBtn.addEventListener("click", () => {
      const input = document.querySelector("#unitCode");
      if (!input || !item.code) return;
      input.value = item.code;
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
      closeDrawer();
      document.querySelector("#pricingForm")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    card.appendChild(useBtn);
    container.appendChild(card);
  });
}

function renderMyHistory(searches = []) {
  if (!myHistoryPanel || !myHistoryList) return;
  if (myHistoryPanel.hidden) myHistoryPanel.open = false;
  myHistoryPanel.hidden = false;
  renderHistoryList(myHistoryList, searches);
}

function userCard(id, data) {
  const email = data.email || "Không có email";
  const approved = Boolean(data.approved);
  const role = data.role || "user";
  const normalizedEmail = normalizeEmail(email);
  const isSelf = id === currentUserId || normalizedEmail === currentUserEmail;
  const isAdminUser = role === "admin" || isAdminEmail(normalizedEmail);
  const searches = Array.isArray(data.recentSearches) ? data.recentSearches.slice(0, HISTORY_LIMIT) : [];

  const card = document.createElement("div");
  card.className = "admin-user-card";
  card.innerHTML = `
    <strong>${escapeHtml(email)}</strong>
    <span class="admin-badge">${approved ? "Đã duyệt" : "Chờ duyệt"}${isAdminUser ? " · Admin" : ""}</span>
    ${isSelf ? `<small>Đây là tài khoản admin đang đăng nhập.</small>` : ""}
    <details>
      <summary>Lịch sử tra căn (${searches.length})</summary>
      <div class="history-list"></div>
    </details>
    <div class="admin-user-actions"></div>
  `;

  renderHistoryList(card.querySelector(".history-list"), searches);

  const actions = card.querySelector(".admin-user-actions");
  if (!isSelf && !isAdminUser) {
    const approveBtn = document.createElement("button");
    approveBtn.className = "primary";
    approveBtn.type = "button";
    approveBtn.textContent = approved ? "Duyệt lại" : "Duyệt";
    approveBtn.addEventListener("click", async () => {
      approveBtn.disabled = true;
      approveBtn.textContent = "Đang duyệt...";
      await updateDoc(doc(db, "users", id), { approved: true, role: "user", updatedAt: serverTimestamp() });
      await renderAdminUsers();
    });

    const blockBtn = document.createElement("button");
    blockBtn.className = "filter-reset";
    blockBtn.type = "button";
    blockBtn.textContent = approved ? "Chặn" : "Giữ chờ duyệt";
    blockBtn.addEventListener("click", async () => {
      blockBtn.disabled = true;
      blockBtn.textContent = "Đang cập nhật...";
      await updateDoc(doc(db, "users", id), { approved: false, role: "user", updatedAt: serverTimestamp() });
      await renderAdminUsers();
    });

    actions.append(approveBtn, blockBtn);
  } else {
    actions.remove();
  }

  return card;
}

function adminUserSection(title, users, emptyText) {
  const section = document.createElement("section");
  section.className = "admin-user-section";

  const heading = document.createElement("h3");
  heading.textContent = `${title} (${users.length})`;

  const list = document.createElement("div");
  list.className = "admin-users";

  if (users.length) {
    users.forEach(({ id, data }) => list.appendChild(userCard(id, data)));
  } else {
    const empty = document.createElement("div");
    empty.className = "admin-empty";
    empty.textContent = emptyText;
    list.appendChild(empty);
  }

  section.append(heading, list);
  return section;
}

async function renderAdminUsers() {
  if (!adminPanel || !adminUsers) return;

  if (adminPanel.hidden) adminPanel.open = false;
  adminPanel.hidden = false;
  adminUsers.textContent = "Đang tải danh sách người dùng...";

  try {
    const snaps = await getDocs(collection(db, "users"));
    const docs = [];
    snaps.forEach((snap) => docs.push({ id: snap.id, data: snap.data() || {} }));

    docs.sort((a, b) => String(a.data.email || "").localeCompare(String(b.data.email || "")));

    adminUsers.textContent = "";
    if (!docs.length) {
      adminUsers.textContent = "Chưa có người dùng nào.";
      return;
    }

    const pendingUsers = docs.filter(({ data }) => !Boolean(data.approved));
    const approvedUsers = docs.filter(({ data }) => Boolean(data.approved));

    adminUsers.append(
      adminUserSection("Tài khoản chờ duyệt", pendingUsers, "Không có tài khoản chờ duyệt."),
      adminUserSection("Tài khoản đã duyệt", approvedUsers, "Chưa có tài khoản đã duyệt.")
    );
  } catch (error) {
    adminUsers.innerHTML = `
      <div class="admin-user-card">
        <strong>Không tải được danh sách người dùng</strong>
        <span>${escapeHtml(error?.message || error)}</span>
        <small>Kiểm tra Firestore Rules: tài khoản ${escapeHtml(currentUserEmail)} cần có role = admin.</small>
      </div>
    `;
  }
}

if (accountTab) {
  accountTab.addEventListener("click", () => {
    if (authGate?.hidden) openDrawer();
    else closeDrawer();
  });
}

if (authCloseBtn) authCloseBtn.addEventListener("click", closeDrawer);

if (copyAppLinkBtn) {
  copyAppLinkBtn.addEventListener("click", async () => {
    const link = window.location.href;
    try {
      await navigator.clipboard.writeText(link);
      copyAppLinkBtn.textContent = "Đã sao chép link";
    } catch (error) {
      copyAppLinkBtn.textContent = "Không sao chép được";
      setStatus(`Hãy copy link này rồi mở bằng Safari/Chrome: ${link}`);
    }
    window.setTimeout(() => {
      copyAppLinkBtn.textContent = "Sao chép link web";
    }, 1800);
  });
}

if (loginBtn) {
  loginBtn.addEventListener("click", async () => {
    if (updateBrowserWarning(false)) {
      setStatus("Google đang chặn trình duyệt trong app này. Hãy mở web bằng Safari/Chrome rồi đăng nhập lại.");
      return;
    }

    try {
      loginBtn.disabled = true;
      loginBtn.textContent = "Đang mở Google...";
      await prepareGoogleLogin();
      if (isMobileDevice()) {
        await signInWithRedirect(auth, provider);
        return;
      }
      await signInWithPopup(auth, provider);
    } catch (error) {
      if (error?.code === "auth/popup-blocked" || error?.code === "auth/cancelled-popup-request") {
        await signInWithRedirect(auth, provider);
        return;
      }
      if (String(error?.message || error).includes("disallowed_useragent")) updateBrowserWarning(true);
      setStatus(`Không đăng nhập được: ${authErrorMessage(error)}`);
    } finally {
      loginBtn.disabled = false;
      loginBtn.textContent = "Đăng nhập bằng Google";
    }
  });
}

if (logoutBtn) logoutBtn.addEventListener("click", () => signOut(auth));

document.addEventListener("change", (event) => {
  if (event.target?.id === "unitCode" || event.target?.closest?.("[data-unit-code]")) scheduleSaveCurrentSearch(true);
});

document.addEventListener("click", (event) => {
  if (event.target?.closest?.("[data-unit-code]")) scheduleSaveCurrentSearch(true);
});

document.addEventListener("input", (event) => {
  if (event.target?.id === "unitCode") scheduleSaveCurrentSearch(false);
});

hideApp("Vui lòng đăng nhập bằng Gmail để truy cập website.");
updateBrowserWarning(false);
checkRedirectLoginResult();

onAuthStateChanged(auth, async (user) => {
  try {
    if (!user) {
      currentUserId = "";
      currentUserEmail = "";
      currentUserData = null;
      currentIsAdmin = false;
      lastLoggedCode = "";
      hideApp("Vui lòng đăng nhập bằng Gmail để truy cập website.");
      return;
    }

    currentUserId = user.uid;
    currentUserEmail = normalizeEmail(user.email);

    if (loginBtn) loginBtn.hidden = true;
    if (logoutBtn) logoutBtn.hidden = false;
    setStatus("Đang kiểm tra quyền truy cập...");

    const data = await ensureUserDoc(user);
    currentUserData = data;
    currentIsAdmin = isAdminEmail(currentUserEmail) || data.role === "admin";

    if (!data.approved && !currentIsAdmin) {
      if (appContent) appContent.hidden = true;
      if (adminPanel) adminPanel.hidden = true;
      if (myHistoryPanel) myHistoryPanel.hidden = true;
      setMenuAuthState(false);
      setStatus(`Gmail ${user.email} đang chờ quản trị viên phê duyệt.`);
      openDrawer();
      return;
    }

    showApp(user.email);
    renderMyHistory(data.recentSearches || []);

    if (currentIsAdmin) {
      await renderAdminUsers();
    } else if (adminPanel) {
      adminPanel.hidden = true;
    }

    closeDrawer();
    window.setTimeout(() => scheduleSaveCurrentSearch(true), 1000);
  } catch (error) {
    if (appContent) appContent.hidden = true;
    setStatus(`Lỗi kiểm tra quyền truy cập: ${error?.message || error}`);
    openDrawer();
  }
});
