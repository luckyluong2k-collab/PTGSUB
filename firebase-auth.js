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
const adminPanel = document.querySelector("#adminPanel");
const adminUsers = document.querySelector("#adminUsers");

function setStatus(message) {
  if (authStatus) authStatus.textContent = message;
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
  const isAdmin = user.email === ADMIN_EMAIL;

  if (!snap.exists()) {
    await setDoc(userRef, {
      email: user.email,
      displayName: user.displayName || "",
      approved: isAdmin,
      role: isAdmin ? "admin" : "user",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return {
      email: user.email,
      approved: isAdmin,
      role: isAdmin ? "admin" : "user",
    };
  }

  const data = snap.data();
  await updateDoc(userRef, {
    email: user.email,
    displayName: user.displayName || data.displayName || "",
    lastLoginAt: serverTimestamp(),
  });
  return data;
}

function userCard(id, data) {
  const email = data.email || "Không có email";
  const approved = Boolean(data.approved);
  const role = data.role || "user";
  const card = document.createElement("div");
  card.className = "admin-user-card";
  card.innerHTML = `
    <strong>${email}</strong>
    <span class="admin-badge">${approved ? "Đã duyệt" : "Chờ duyệt"}${role === "admin" ? " · Admin" : ""}</span>
    <div class="admin-user-actions">
      <button class="primary" type="button" data-action="approve">Duyệt</button>
      <button class="filter-reset" type="button" data-action="block">Chặn</button>
    </div>
  `;
  card.querySelector('[data-action="approve"]').addEventListener("click", async () => {
    await updateDoc(doc(db, "users", id), { approved: true, updatedAt: serverTimestamp() });
    await renderAdminUsers();
  });
  card.querySelector('[data-action="block"]').addEventListener("click", async () => {
    await updateDoc(doc(db, "users", id), { approved: false, updatedAt: serverTimestamp() });
    await renderAdminUsers();
  });
  return card;
}

async function renderAdminUsers() {
  if (!adminPanel || !adminUsers) return;
  adminPanel.hidden = false;
  adminUsers.textContent = "Đang tải danh sách người dùng...";
  const snaps = await getDocs(collection(db, "users"));
  adminUsers.textContent = "";
  const docs = [];
  snaps.forEach((snap) => docs.push({ id: snap.id, data: snap.data() }));
  docs.sort((a, b) => String(a.data.email || "").localeCompare(String(b.data.email || "")));
  if (!docs.length) {
    adminUsers.textContent = "Chưa có người dùng nào.";
    return;
  }
  docs.forEach(({ id, data }) => adminUsers.appendChild(userCard(id, data)));
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
      hideApp("Vui lòng đăng nhập bằng Gmail để truy cập website.");
      return;
    }

    if (loginBtn) loginBtn.hidden = true;
    if (logoutBtn) logoutBtn.hidden = false;
    setStatus("Đang kiểm tra quyền truy cập...");

    const data = await ensureUserDoc(user);
    const isAdmin = user.email === ADMIN_EMAIL || data.role === "admin";

    if (!data.approved && !isAdmin) {
      if (appContent) appContent.hidden = true;
      setStatus(`Gmail ${user.email} đang chờ quản trị viên phê duyệt.`);
      return;
    }

    showApp(user.email);
    if (isAdmin) await renderAdminUsers();
  } catch (error) {
    if (appContent) appContent.hidden = true;
    setStatus(`Lỗi kiểm tra quyền truy cập: ${error?.message || error}`);
  }
});
