import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  onAuthStateChanged,
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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

const authGate = document.querySelector("#authGate");
const appContent = document.querySelector("#appContent");
const loginBtn = document.querySelector("#loginBtn");
const logoutBtn = document.querySelector("#logoutBtn");
const authStatus = document.querySelector("#authStatus");
let adminPanel = document.querySelector("#adminPanel");
let adminUsers = document.querySelector("#adminUsers");

let currentUserId = "";
let currentUserEmail = "";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function setStatus(message) {
  if (authStatus) authStatus.textContent = message;
}

function ensureAdminPanelElement() {
  if (!adminPanel) {
    adminPanel = document.createElement("div");
    adminPanel.id = "adminPanel";
    adminPanel.className = "admin-panel";
    adminPanel.hidden = true;
    adminPanel.innerHTML = `<h2>Quản lý người dùng</h2><div id="adminUsers" class="admin-users"></div>`;
    const card = authGate?.querySelector(".auth-card") || authGate || document.body;
    card.appendChild(adminPanel);
  }

  adminUsers = adminPanel.querySelector("#adminUsers");
  if (!adminUsers) {
    adminUsers = document.createElement("div");
    adminUsers.id = "adminUsers";
    adminUsers.className = "admin-users";
    adminPanel.appendChild(adminUsers);
  }
}

function showApp(userEmail) {
  if (authGate) authGate.hidden = false;
  if (appContent) appContent.hidden = false;
  if (loginBtn) loginBtn.hidden = true;
  if (logoutBtn) logoutBtn.hidden = false;
  setStatus(`Đã đăng nhập: ${userEmail}`);
}

function hideApp(message) {
  if (authGate) authGate.hidden = false;
  if (appContent) appContent.hidden = true;
  if (loginBtn) loginBtn.hidden = false;
  if (logoutBtn) logoutBtn.hidden = true;
  if (adminPanel) adminPanel.hidden = true;
  setStatus(message);
}

async function ensureUserDoc(user) {
  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);
  const email = normalizeEmail(user.email);
  const isAdminEmail = email === ADMIN_EMAIL;

  if (!snap.exists()) {
    const data = {
      email,
      displayName: user.displayName || "",
      approved: isAdminEmail,
      role: isAdminEmail ? "admin" : "user",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    };
    await setDoc(userRef, data);
    return { email, approved: isAdminEmail, role: isAdminEmail ? "admin" : "user" };
  }

  const oldData = snap.data() || {};
  const patch = {
    email,
    displayName: user.displayName || oldData.displayName || "",
    lastLoginAt: serverTimestamp(),
  };

  // Tự khóa tài khoản admin theo Gmail chính, tránh trường hợp doc admin cũ bị thiếu role/approved.
  if (isAdminEmail) {
    patch.approved = true;
    patch.role = "admin";
  }

  await updateDoc(userRef, patch);
  return {
    ...oldData,
    ...patch,
    email,
    approved: isAdminEmail ? true : Boolean(oldData.approved),
    role: isAdminEmail ? "admin" : oldData.role || "user",
  };
}

function userCard(id, data) {
  const email = data.email || "Không có email";
  const approved = Boolean(data.approved);
  const role = data.role || "user";
  const isSelf = id === currentUserId || normalizeEmail(email) === currentUserEmail;
  const isAdminUser = role === "admin" || normalizeEmail(email) === ADMIN_EMAIL;

  const card = document.createElement("div");
  card.className = "admin-user-card";
  card.innerHTML = `
    <strong>${escapeHtml(email)}</strong>
    <span class="admin-badge">${approved ? "Đã duyệt" : "Chờ duyệt"}${isAdminUser ? " · Admin" : ""}</span>
    ${isSelf ? `<small>Đây là tài khoản admin đang đăng nhập.</small>` : ""}
    <div class="admin-user-actions"></div>
  `;

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

async function renderAdminUsers() {
  ensureAdminPanelElement();
  if (!adminPanel || !adminUsers) return;

  adminPanel.hidden = false;
  adminPanel.style.display = "block";
  adminUsers.textContent = "Đang tải danh sách người dùng...";

  try {
    const snaps = await getDocs(collection(db, "users"));
    const docs = [];
    snaps.forEach((snap) => docs.push({ id: snap.id, data: snap.data() || {} }));

    docs.sort((a, b) => {
      const pendingA = a.data.approved ? 1 : 0;
      const pendingB = b.data.approved ? 1 : 0;
      if (pendingA !== pendingB) return pendingA - pendingB;
      return String(a.data.email || "").localeCompare(String(b.data.email || ""));
    });

    adminUsers.textContent = "";
    if (!docs.length) {
      adminUsers.textContent = "Chưa có người dùng nào.";
      return;
    }

    docs.forEach(({ id, data }) => adminUsers.appendChild(userCard(id, data)));
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

if (loginBtn) {
  loginBtn.addEventListener("click", async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      if (error?.code === "auth/popup-blocked" || error?.code === "auth/cancelled-popup-request") {
        await signInWithRedirect(auth, provider);
        return;
      }
      setStatus(`Không đăng nhập được: ${error?.message || error}`);
    }
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => signOut(auth));
}

onAuthStateChanged(auth, async (user) => {
  try {
    if (!user) {
      currentUserId = "";
      currentUserEmail = "";
      hideApp("Vui lòng đăng nhập bằng Gmail để truy cập website.");
      return;
    }

    currentUserId = user.uid;
    currentUserEmail = normalizeEmail(user.email);

    if (loginBtn) loginBtn.hidden = true;
    if (logoutBtn) logoutBtn.hidden = false;
    setStatus("Đang kiểm tra quyền truy cập...");

    const data = await ensureUserDoc(user);
    const isAdmin = currentUserEmail === ADMIN_EMAIL || data.role === "admin";

    if (!data.approved && !isAdmin) {
      if (appContent) appContent.hidden = true;
      if (adminPanel) adminPanel.hidden = true;
      setStatus(`Gmail ${user.email} đang chờ quản trị viên phê duyệt.`);
      return;
    }

    showApp(user.email);
    if (isAdmin) {
      await renderAdminUsers();
    } else if (adminPanel) {
      adminPanel.hidden = true;
    }
  } catch (error) {
    if (appContent) appContent.hidden = true;
    setStatus(`Lỗi kiểm tra quyền truy cập: ${error?.message || error}`);
  }
});
