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
  setDoc,
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

const ADMIN_EMAIL = "luckyluong2k@gmail.com";
const MAX_POST_LENGTH = 1500;
const MAX_COMMENT_LENGTH = 500;
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const els = {
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
  notificationToggle: document.querySelector("#notificationToggle"),
  notificationCount: document.querySelector("#notificationCount"),
  notificationPanel: document.querySelector("#notificationPanel"),
  notificationClose: document.querySelector("#notificationClose"),
  notificationList: document.querySelector("#notificationList"),
  markAllRead: document.querySelector("#markAllRead"),
};

let currentUser = null;
let currentUserData = null;
let currentIsAdmin = false;
let postSnapshots = [];
let commentSnapshots = [];
let likeSnapshots = [];
let notificationSnapshots = [];
let unsubscribeListeners = [];

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
  return String(data.displayName || user.displayName || user.email || "Thành viên").trim();
}

function formatDate(value) {
  const ms = timestampMs(value);
  if (!ms) return "Vừa xong";
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

function makeButton(label, action, className = "action-btn") {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.dataset.action = action;
  button.textContent = label;
  return button;
}

function likesFor(targetType, targetId) {
  return likeSnapshots.filter((snapshot) => {
    const data = snapshot.data() || {};
    return data.targetType === targetType && data.targetId === targetId;
  });
}

function currentUserLike(targetType, targetId) {
  return likesFor(targetType, targetId).find((snapshot) => snapshot.data()?.uid === currentUser?.uid) || null;
}

function commentsForPost(postId) {
  return commentSnapshots.filter((snapshot) => snapshot.data()?.postId === postId);
}

function createCommentCard(snapshot, postId) {
  const data = snapshot.data() || {};
  const item = document.createElement("article");
  item.className = "comment";
  item.id = `comment-${snapshot.id}`;

  const head = document.createElement("div");
  head.className = "comment-head";
  const author = document.createElement("strong");
  author.textContent = data.displayName || data.email || "Thành viên";
  const time = document.createElement("span");
  time.textContent = formatDate(data.createdAt);
  head.append(author, time);

  const body = document.createElement("p");
  body.textContent = data.body || "";

  const actions = document.createElement("div");
  actions.className = "comment-actions";
  const commentLikes = likesFor("comment", snapshot.id);
  const liked = Boolean(currentUserLike("comment", snapshot.id));
  const like = makeButton(`${liked ? "♥" : "♡"} Thích ${commentLikes.length || ""}`.trim(), "toggle-like-comment");
  like.classList.toggle("is-active", liked);
  like.dataset.commentId = snapshot.id;
  like.dataset.postId = postId;
  like.dataset.ownerUid = data.uid || "";
  actions.append(like);

  if (currentIsAdmin || data.uid === currentUser?.uid) {
    const remove = makeButton("Xóa bình luận", "delete-comment", "action-btn");
    remove.dataset.commentId = snapshot.id;
    actions.append(remove);
  }

  item.append(head, body, actions);
  return item;
}

function createPostCard(snapshot) {
  const data = snapshot.data() || {};
  const card = document.createElement("article");
  card.className = "post-card";
  card.classList.toggle("is-featured", data.featured === true);
  card.id = `post-${snapshot.id}`;

  if (data.featured === true) {
    const badge = document.createElement("span");
    badge.className = "featured-badge";
    badge.textContent = "★ Bài viết nổi bật";
    card.append(badge);
  }

  const head = document.createElement("div");
  head.className = "post-head";
  const author = document.createElement("div");
  author.className = "post-author";
  const name = document.createElement("strong");
  name.textContent = data.displayName || data.email || "Thành viên";
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

  const postComments = commentsForPost(snapshot.id);
  const postLikes = likesFor("post", snapshot.id);
  const liked = Boolean(currentUserLike("post", snapshot.id));
  const actions = document.createElement("div");
  actions.className = "post-actions";

  const like = makeButton(`${liked ? "♥" : "♡"} Thích ${postLikes.length || ""}`.trim(), "toggle-like-post");
  like.classList.toggle("is-active", liked);
  like.dataset.postId = snapshot.id;
  like.dataset.ownerUid = data.uid || "";
  actions.append(like);

  const commentCount = makeButton(`💬 ${postComments.length} bình luận`, "focus-comment");
  commentCount.dataset.postId = snapshot.id;
  actions.append(commentCount);

  if (currentIsAdmin) {
    const feature = makeButton(data.featured ? "Bỏ nổi bật" : "Đặt nổi bật", "toggle-featured", "action-btn featured");
    feature.dataset.postId = snapshot.id;
    feature.dataset.featured = data.featured ? "true" : "false";
    actions.append(feature);
  }

  if (currentIsAdmin || data.uid === currentUser?.uid) {
    const remove = makeButton("Xóa bài", "delete-post", "danger-btn");
    remove.dataset.postId = snapshot.id;
    actions.append(remove);
  }

  const comments = document.createElement("section");
  comments.className = "comments";
  const commentList = document.createElement("div");
  commentList.className = "comment-list";
  if (postComments.length) {
    postComments.forEach((comment) => commentList.append(createCommentCard(comment, snapshot.id)));
  } else {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "Chưa có bình luận.";
    commentList.append(empty);
  }

  const commentForm = document.createElement("form");
  commentForm.className = "comment-form";
  commentForm.dataset.postId = snapshot.id;
  commentForm.dataset.ownerUid = data.uid || "";
  const input = document.createElement("input");
  input.type = "text";
  input.maxLength = MAX_COMMENT_LENGTH;
  input.required = true;
  input.dataset.commentInput = snapshot.id;
  input.placeholder = "Viết bình luận...";
  input.setAttribute("aria-label", "Nội dung bình luận");
  const submit = document.createElement("button");
  submit.className = "primary-btn";
  submit.type = "submit";
  submit.textContent = "Gửi";
  commentForm.append(input, submit);
  comments.append(commentList, commentForm);

  card.append(head, body, actions, comments);
  return card;
}

function renderPosts() {
  if (!els.postList) return;
  els.postList.textContent = "";
  if (!postSnapshots.length) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "Chưa có bài viết nào. Hãy là người đầu tiên chia sẻ.";
    els.postList.append(empty);
    renderNotifications();
    return;
  }
  postSnapshots.forEach((item) => els.postList.append(createPostCard(item)));
  renderNotifications();
}

function featuredReadKey() {
  return `ptgsub-forum-featured-read:${currentUser?.uid || "guest"}`;
}

function readFeaturedIds() {
  try {
    return new Set(JSON.parse(localStorage.getItem(featuredReadKey()) || "[]"));
  } catch {
    return new Set();
  }
}

function writeFeaturedIds(ids) {
  localStorage.setItem(featuredReadKey(), JSON.stringify([...ids].slice(-200)));
}

function combinedNotifications() {
  const featuredRead = readFeaturedIds();
  const featured = postSnapshots
    .filter((snapshot) => snapshot.data()?.featured === true)
    .map((snapshot) => {
      const featuredId = `featured-${snapshot.id}-${timestampMs(snapshot.data()?.featuredAt)}`;
      return {
        id: featuredId,
        kind: "featured",
        postId: snapshot.id,
        message: "Admin đã đánh dấu một bài viết nổi bật.",
        createdAt: snapshot.data()?.featuredAt || snapshot.data()?.updatedAt || snapshot.data()?.createdAt,
        read: featuredRead.has(featuredId),
      };
    });
  const personal = notificationSnapshots.map((snapshot) => ({
    id: snapshot.id,
    kind: "personal",
    ...snapshot.data(),
  }));
  return [...featured, ...personal].sort((a, b) => timestampMs(b.createdAt) - timestampMs(a.createdAt));
}

function renderNotifications() {
  if (!els.notificationList) return;
  const notifications = combinedNotifications();
  const unread = notifications.filter((item) => !item.read).length;
  if (els.notificationCount) {
    els.notificationCount.textContent = unread > 99 ? "99+" : String(unread);
    els.notificationCount.hidden = unread === 0;
  }
  els.notificationList.textContent = "";
  if (!notifications.length) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "Chưa có thông báo mới.";
    els.notificationList.append(empty);
    return;
  }
  notifications.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "notification-item";
    button.classList.toggle("unread", !item.read);
    button.dataset.notificationId = item.id;
    button.dataset.notificationKind = item.kind;
    button.dataset.postId = item.postId || "";
    button.dataset.commentId = item.commentId || "";
    const message = document.createElement("strong");
    message.textContent = item.message || "Bạn có thông báo mới.";
    const time = document.createElement("span");
    time.textContent = formatDate(item.createdAt);
    button.append(message, time);
    els.notificationList.append(button);
  });
}

async function createNotification({ recipientUid, type, postId, commentId = "", message }) {
  if (!recipientUid || recipientUid === currentUser?.uid) return;
  await addDoc(collection(db, "forumNotifications"), {
    recipientUid,
    actorUid: currentUser.uid,
    actorName: displayName(currentUser, currentUserData),
    type,
    postId,
    commentId,
    message,
    read: false,
    createdAt: serverTimestamp(),
  });
}

async function toggleLike({ targetType, targetId, targetOwnerUid, postId }) {
  const existing = currentUserLike(targetType, targetId);
  const likeId = `${targetType}_${targetId}_${currentUser.uid}`;
  if (existing) {
    await deleteDoc(doc(db, "forumLikes", likeId));
    return;
  }
  await setDoc(doc(db, "forumLikes", likeId), {
    postId,
    targetType,
    targetId,
    targetOwnerUid,
    uid: currentUser.uid,
    displayName: displayName(currentUser, currentUserData),
    createdAt: serverTimestamp(),
  });
  const isComment = targetType === "comment";
  await createNotification({
    recipientUid: targetOwnerUid,
    type: isComment ? "like_comment" : "like_post",
    postId,
    commentId: isComment ? targetId : "",
    message: `${displayName(currentUser, currentUserData)} đã thích ${isComment ? "bình luận" : "bài viết"} của bạn.`,
  });
}

function listen(collectionName, dataQuery, onData) {
  const unsubscribe = onSnapshot(dataQuery, (snapshot) => onData(snapshot.docs), (error) => {
    setStatus(`Không tải được ${collectionName}: ${error.message || error}`, "error");
  });
  unsubscribeListeners.push(unsubscribe);
}

function startForumListeners() {
  unsubscribeListeners.forEach((unsubscribe) => unsubscribe());
  unsubscribeListeners = [];
  listen("bài viết", query(collection(db, "forumPosts"), orderBy("createdAt", "desc"), limit(80)), (docs) => {
    postSnapshots = docs;
    renderPosts();
    setStatus("Forum đã sẵn sàng.");
  });
  listen("bình luận", query(collection(db, "forumComments"), orderBy("createdAt", "asc"), limit(500)), (docs) => {
    commentSnapshots = docs;
    renderPosts();
  });
  listen("lượt thích", query(collection(db, "forumLikes"), limit(1000)), (docs) => {
    likeSnapshots = docs;
    renderPosts();
  });
  listen("thông báo", query(collection(db, "forumNotifications"), where("recipientUid", "==", currentUser.uid), limit(100)), (docs) => {
    notificationSnapshots = docs;
    renderNotifications();
  });
}

async function prepareForum(user) {
  currentUser = user;
  const userSnapshot = await getDoc(doc(db, "users", user.uid));
  currentUserData = userSnapshot.exists() ? userSnapshot.data() || {} : {};
  const email = String(user.email || "").trim().toLowerCase();
  currentIsAdmin = email === ADMIN_EMAIL || currentUserData.role === "admin";

  if (!activeAccess(currentUserData, currentIsAdmin)) {
    setStatus("Tài khoản chưa được duyệt hoặc đã hết hạn.", "error");
    window.setTimeout(redirectToMain, 900);
    return;
  }

  if (els.memberName) els.memberName.textContent = displayName(user, currentUserData);
  if (els.memberEmail) els.memberEmail.textContent = user.email || "";
  if (els.memberRole) els.memberRole.textContent = currentIsAdmin ? "Quản trị viên" : "Thành viên đã duyệt";
  if (els.app) els.app.hidden = false;
  document.body.classList.add("forum-ready");
  setFormBusy(false);
  startForumListeners();
}

els.body?.addEventListener("input", updateCounter);

els.form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!currentUser) return;
  const body = String(els.body?.value || "").trim();
  if (!body) {
    setStatus("Nhập nội dung trước khi gửi.", "error");
    return;
  }
  if (body.length > MAX_POST_LENGTH) {
    setStatus(`Nội dung tối đa ${MAX_POST_LENGTH} ký tự.`, "error");
    return;
  }
  try {
    setFormBusy(true);
    await addDoc(collection(db, "forumPosts"), {
      uid: currentUser.uid,
      email: currentUser.email || "",
      displayName: displayName(currentUser, currentUserData),
      body,
      featured: false,
      featuredAt: null,
      featuredBy: "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    els.body.value = "";
    updateCounter();
    setStatus("Đã gửi bài viết.");
  } catch (error) {
    setStatus(`Không gửi được bài viết: ${error.message || error}`, "error");
  } finally {
    setFormBusy(false);
  }
});

els.postList?.addEventListener("submit", async (event) => {
  const form = event.target.closest(".comment-form");
  if (!form || !currentUser) return;
  event.preventDefault();
  const input = form.querySelector("input");
  const body = String(input?.value || "").trim();
  const postId = form.dataset.postId || "";
  const postOwnerUid = form.dataset.ownerUid || "";
  if (!body || !postId) return;
  try {
    const submit = form.querySelector("button[type='submit']");
    if (submit) submit.disabled = true;
    const commentRef = await addDoc(collection(db, "forumComments"), {
      postId,
      uid: currentUser.uid,
      email: currentUser.email || "",
      displayName: displayName(currentUser, currentUserData),
      body: body.slice(0, MAX_COMMENT_LENGTH),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    await createNotification({
      recipientUid: postOwnerUid,
      type: "comment_post",
      postId,
      commentId: commentRef.id,
      message: `${displayName(currentUser, currentUserData)} đã bình luận bài viết của bạn.`,
    });
    input.value = "";
    setStatus("Đã gửi bình luận.");
  } catch (error) {
    setStatus(`Không gửi được bình luận: ${error.message || error}`, "error");
  } finally {
    const submit = form.querySelector("button[type='submit']");
    if (submit) submit.disabled = false;
  }
});

els.postList?.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-action]");
  if (!button || !currentUser) return;
  const action = button.dataset.action;
  try {
    button.disabled = true;
    if (action === "delete-post") {
      await deleteDoc(doc(db, "forumPosts", button.dataset.postId));
      setStatus("Đã xóa bài viết.");
    } else if (action === "delete-comment") {
      await deleteDoc(doc(db, "forumComments", button.dataset.commentId));
      setStatus("Đã xóa bình luận.");
    } else if (action === "toggle-like-post") {
      await toggleLike({
        targetType: "post",
        targetId: button.dataset.postId,
        targetOwnerUid: button.dataset.ownerUid,
        postId: button.dataset.postId,
      });
    } else if (action === "toggle-like-comment") {
      await toggleLike({
        targetType: "comment",
        targetId: button.dataset.commentId,
        targetOwnerUid: button.dataset.ownerUid,
        postId: button.dataset.postId,
      });
    } else if (action === "toggle-featured") {
      const featured = button.dataset.featured !== "true";
      await updateDoc(doc(db, "forumPosts", button.dataset.postId), {
        featured,
        featuredAt: featured ? serverTimestamp() : null,
        featuredBy: featured ? currentUser.uid : "",
        updatedAt: serverTimestamp(),
      });
      setStatus(featured ? "Đã đặt bài viết nổi bật." : "Đã bỏ nổi bật.");
    } else if (action === "focus-comment") {
      const input = els.postList.querySelector(`[data-comment-input="${button.dataset.postId}"]`);
      input?.focus();
    }
  } catch (error) {
    setStatus(`Không thực hiện được thao tác: ${error.message || error}`, "error");
  } finally {
    button.disabled = false;
  }
});

function setNotificationPanel(open) {
  if (!els.notificationPanel || !els.notificationToggle) return;
  els.notificationPanel.hidden = !open;
  els.notificationToggle.setAttribute("aria-expanded", String(open));
}

els.notificationToggle?.addEventListener("click", () => setNotificationPanel(els.notificationPanel?.hidden !== false));
els.notificationClose?.addEventListener("click", () => setNotificationPanel(false));

els.notificationList?.addEventListener("click", async (event) => {
  const item = event.target.closest("[data-notification-id]");
  if (!item) return;
  const notificationId = item.dataset.notificationId;
  try {
    if (item.dataset.notificationKind === "personal" && item.classList.contains("unread")) {
      await updateDoc(doc(db, "forumNotifications", notificationId), { read: true });
    } else if (item.dataset.notificationKind === "featured") {
      const ids = readFeaturedIds();
      ids.add(notificationId);
      writeFeaturedIds(ids);
      renderNotifications();
    }
  } catch (error) {
    setStatus(`Không cập nhật được thông báo: ${error.message || error}`, "error");
  }
  setNotificationPanel(false);
  const commentTarget = item.dataset.commentId ? document.querySelector(`#comment-${item.dataset.commentId}`) : null;
  const postTarget = item.dataset.postId ? document.querySelector(`#post-${item.dataset.postId}`) : null;
  (commentTarget || postTarget)?.scrollIntoView({ behavior: "smooth", block: "center" });
});

els.markAllRead?.addEventListener("click", async () => {
  const featuredIds = readFeaturedIds();
  combinedNotifications().filter((item) => item.kind === "featured").forEach((item) => featuredIds.add(item.id));
  writeFeaturedIds(featuredIds);
  const unreadPersonal = notificationSnapshots.filter((snapshot) => snapshot.data()?.read !== true);
  try {
    await Promise.all(unreadPersonal.map((snapshot) => updateDoc(doc(db, "forumNotifications", snapshot.id), { read: true })));
    renderNotifications();
  } catch (error) {
    setStatus(`Không đánh dấu được thông báo: ${error.message || error}`, "error");
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
    setStatus(`Không kiểm tra được quyền truy cập: ${error.message || error}`, "error");
    window.setTimeout(redirectToMain, 900);
  });
});
