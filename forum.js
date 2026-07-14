import { initializeApp, getApp, getApps } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
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
const MAX_POST_LENGTH = 1500;
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const els = {
  guard: document.querySelector("#forumAuthGuard"),
  app: document.querySelector("#forumApp"),
  status: document.querySelector("#forumStatus"),
  form: document.querySelector("#forumForm"),
  body: document.querySelector("#forumBody"),
  submit: document.querySelector("#forumSubmit"),
  charCount: document.querySelector("#charCount"),
  postList: document.querySelector("#postList"),
  memberName: document.querySelector("#memberName"),
  memberEmail: document.querySelector("#memberEmail"),
  memberRole: document.querySelector("#memberRole"),
};

let currentUser = null;
let currentUserData = null;
let currentIsAdmin = false;
let unsubscribePosts = null;

function redirectToMain() {
  const next = window.location.href;
  window.location.replace(`index.html?next=${encodeURIComponent(next)}`);
}

function timestampMs(value) {
  if (!value) return 0;
  if (typeof value === "number") return value;
  if (typeof value.toMillis === "function") return value.toMillis();
  if (value.seconds) return value.seconds * 1000;
  return 0;
}

function setStatus(message, tone = "") {
  if (!els.status) return;
  els.status.textContent = message;
  els.status.classList.toggle("error", tone === "error");
}

function setFormBusy(isBusy) {
  if (els.submit) els.submit.disabled = isBusy;
  if (els.body) els.body.disabled = isBusy;
}

function activeAccess(data = {}, isAdmin = false) {
  if (isAdmin) return true;
  const expiresAt = timestampMs(data.accessExpiresAt);
  return Boolean(data.approved) && (!expiresAt || expiresAt > Date.now());
}

function displayName(user, data = {}) {
  return String(data.displayName || user.displayName || user.email || "Thanh vien").trim();
}

function formatDate(value) {
  const ms = timestampMs(value);
  if (!ms) return "Vua xong";
  return new Date(ms).toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function updateCounter() {
  const length = els.body?.value.length || 0;
  if (els.charCount) els.charCount.textContent = `${length}/${MAX_POST_LENGTH}`;
}

function createPostCard(snapshot) {
  const data = snapshot.data() || {};
  const card = document.createElement("article");
  card.className = "post-card";

  const head = document.createElement("div");
  head.className = "post-head";

  const author = document.createElement("div");
  author.className = "post-author";

  const name = document.createElement("strong");
  name.textContent = data.displayName || data.email || "Thanh vien";

  const email = document.createElement("span");
  email.textContent = data.email || "";

  author.append(name, email);

  const meta = document.createElement("div");
  meta.className = "post-time";
  meta.textContent = formatDate(data.createdAt);

  head.append(author, meta);

  const body = document.createElement("p");
  body.className = "post-body";
  body.textContent = data.body || "";

  card.append(head, body);

  if (currentIsAdmin || data.uid === currentUser?.uid) {
    const actions = document.createElement("div");
    actions.className = "post-actions";
    const remove = document.createElement("button");
    remove.className = "danger-btn";
    remove.type = "button";
    remove.dataset.postId = snapshot.id;
    remove.textContent = "Xoa";
    actions.append(remove);
    card.append(actions);
  }

  return card;
}

function renderPosts(snapshots) {
  if (!els.postList) return;
  els.postList.textContent = "";
  if (!snapshots.length) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "Chua co bai viet nao. Hay la nguoi dau tien chia se.";
    els.postList.append(empty);
    return;
  }
  snapshots.forEach((item) => els.postList.append(createPostCard(item)));
}

function startPostListener() {
  if (unsubscribePosts) unsubscribePosts();
  const postsQuery = query(collection(db, "forumPosts"), orderBy("createdAt", "desc"), limit(80));
  unsubscribePosts = onSnapshot(postsQuery, (snapshot) => {
    renderPosts(snapshot.docs);
    setStatus("Forum da san sang.");
  }, (error) => {
    setStatus(`Khong tai duoc forum: ${error.message || error}`, "error");
  });
}

async function prepareForum(user) {
  currentUser = user;
  const userSnapshot = await getDoc(doc(db, "users", user.uid));
  currentUserData = userSnapshot.exists() ? userSnapshot.data() || {} : {};
  const email = String(user.email || "").trim().toLowerCase();
  currentIsAdmin = email === ADMIN_EMAIL || currentUserData.role === "admin";

  if (!activeAccess(currentUserData, currentIsAdmin)) {
    setStatus("Tai khoan chua duoc duyet hoac da het han.", "error");
    window.setTimeout(redirectToMain, 900);
    return;
  }

  if (els.memberName) els.memberName.textContent = displayName(user, currentUserData);
  if (els.memberEmail) els.memberEmail.textContent = user.email || "";
  if (els.memberRole) els.memberRole.textContent = currentIsAdmin ? "Quan tri vien" : "Thanh vien da duyet";
  if (els.app) els.app.hidden = false;
  document.body.classList.add("forum-ready");
  setFormBusy(false);
  startPostListener();
}

els.body?.addEventListener("input", updateCounter);

els.form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!currentUser) return;
  const body = String(els.body?.value || "").trim();
  if (!body) {
    setStatus("Nhap noi dung truoc khi gui.", "error");
    return;
  }
  if (body.length > MAX_POST_LENGTH) {
    setStatus(`Noi dung toi da ${MAX_POST_LENGTH} ky tu.`, "error");
    return;
  }

  try {
    setFormBusy(true);
    await addDoc(collection(db, "forumPosts"), {
      uid: currentUser.uid,
      email: currentUser.email || "",
      displayName: displayName(currentUser, currentUserData),
      body,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    els.body.value = "";
    updateCounter();
    setStatus("Da gui bai viet.");
  } catch (error) {
    setStatus(`Khong gui duoc bai viet: ${error.message || error}`, "error");
  } finally {
    setFormBusy(false);
  }
});

els.postList?.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-post-id]");
  if (!button) return;
  const postId = button.dataset.postId;
  if (!postId) return;
  try {
    button.disabled = true;
    await deleteDoc(doc(db, "forumPosts", postId));
    setStatus("Da xoa bai viet.");
  } catch (error) {
    button.disabled = false;
    setStatus(`Khong xoa duoc bai viet: ${error.message || error}`, "error");
  }
});

setFormBusy(true);
updateCounter();
onAuthStateChanged(auth, (user) => {
  if (!user) {
    redirectToMain();
    return;
  }
  prepareForum(user).catch((error) => {
    setStatus(`Khong kiem tra duoc quyen truy cap: ${error.message || error}`, "error");
    window.setTimeout(redirectToMain, 900);
  });
});
