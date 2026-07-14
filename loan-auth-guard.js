import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { doc, getDoc, getFirestore } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

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
const guard = document.getElementById("loanAuthGuard");

function timestampMs(value) {
  if (!value) return 0;
  if (typeof value === "number") return value;
  if (typeof value.toMillis === "function") return value.toMillis();
  if (value.seconds) return value.seconds * 1000;
  return 0;
}

function returnToMain() {
  const next = window.location.href;
  window.location.replace(`index.html?next=${encodeURIComponent(next)}`);
}

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    returnToMain();
    return;
  }

  try {
    const snapshot = await getDoc(doc(db, "users", user.uid));
    const data = snapshot.exists() ? snapshot.data() || {} : {};
    const email = String(user.email || "").trim().toLowerCase();
    const isAdmin = email === ADMIN_EMAIL || data.role === "admin";
    const expiresAt = timestampMs(data.accessExpiresAt);
    const allowed = isAdmin || (Boolean(data.approved) && (!expiresAt || expiresAt > Date.now()));

    if (!allowed) {
      returnToMain();
      return;
    }

    document.body.classList.remove("loan-auth-checking");
    guard?.remove();
  } catch {
    returnToMain();
  }
});
