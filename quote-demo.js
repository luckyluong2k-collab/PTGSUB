(function () {
  "use strict";

  const QUOTES = {
    AB7K29: {
      code: "AB7K29",
      customerName: "anh Nguyen Van Minh",
      unitCode: "C1717",
      unitType: "2PN+",
      tower: "C17",
      floor: "17",
      view: "Noi khu va quang truong",
      area: "68,4 m2",
      direction: "Dong Nam",
      finalPrice: "7,63 ty",
      upfront: "2,67 ty",
      bankLoan: "4,96 ty",
      loanAmount: 4960000000,
      supportMonths: 36,
      purchaseDate: "2026-07-14",
      tags: ["HTLS 36 thang", "Vay 65%", "So huu lau dai", "Du lieu minh hoa"],
      advisor: "Gia va chinh sach trong link nay la ban demo giao dien. Ban that se khoa snapshot gia tai thoi diem tao link va ghi lich su thao tac vao Firestore.",
      schedule: [
        ["Dat coc", "300 trieu", "giu cho can"],
        ["Ky HDMB", "1,21 ty", "sau 9 ngay"],
        ["Ngan hang giai ngan", "4,96 ty", "sau khi hoan tat ho so"],
        ["Phan con lai", "1,16 ty", "theo tien do"]
      ],
      loan: [
        ["Khoan vay minh hoa", "4,96 ty"],
        ["Ho tro lai suat", "36 thang"],
        ["Thoi han vay", "35 nam"],
        ["Lai sau HTLS", "du kien 10%/nam"]
      ]
    }
  };

  const params = new URLSearchParams(window.location.search);
  const code = String(params.get("code") || "AB7K29").trim().toUpperCase();
  const quote = QUOTES[code] || QUOTES.AB7K29;
  const quoteStateKey = `ptgsub_quote_demo_quote_${quote.code}`;
  const analyticsKey = "ptgsub_quote_demo_analytics_v1";
  const sessionKey = `ptgsub_quote_demo_session_${quote.code}`;

  function $(selector) {
    return document.querySelector(selector);
  }

  function readJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function writeJson(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Demo analytics should never block the quote page.
    }
  }

  function quoteState() {
    const current = readJson(quoteStateKey, null);
    if (current?.createdAt && current?.expiresAt) return current;
    const createdAt = Date.now();
    const expiresAt = createdAt + 3 * 24 * 60 * 60 * 1000;
    const next = { createdAt, expiresAt };
    writeJson(quoteStateKey, next);
    return next;
  }

  function ensureStats(store) {
    const stats = store[quote.code] || {};
    stats.code = quote.code;
    stats.opens = Number(stats.opens || 0);
    stats.sessions = stats.sessions || {};
    stats.actions = Object.assign({
      call: 0,
      zalo: 0,
      flora_avenue: 0,
      loan_schedule: 0
    }, stats.actions || {});
    stats.maxScrollPct = Number(stats.maxScrollPct || 0);
    stats.timeOnPageSeconds = Number(stats.timeOnPageSeconds || 0);
    stats.events = Array.isArray(stats.events) ? stats.events : [];
    store[quote.code] = stats;
    return stats;
  }

  function sessionId() {
    let id = sessionStorage.getItem(sessionKey);
    if (!id) {
      id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      sessionStorage.setItem(sessionKey, id);
    }
    return id;
  }

  function track(type, detail = "") {
    const store = readJson(analyticsKey, {});
    const stats = ensureStats(store);
    const id = sessionId();
    const now = Date.now();
    if (!stats.sessions[id]) {
      stats.sessions[id] = { firstSeenAt: now };
      stats.opens += 1;
    }
    stats.sessions[id].lastSeenAt = now;
    stats.lastSeenAt = now;
    if (type !== "heartbeat" && type !== "scroll") {
      stats.events.unshift({ type, detail, at: now });
      stats.events = stats.events.slice(0, 80);
    }
    if (stats.actions[type] != null) stats.actions[type] += 1;
    writeJson(analyticsKey, store);
  }

  function updateScrollProgress() {
    const store = readJson(analyticsKey, {});
    const stats = ensureStats(store);
    const doc = document.documentElement;
    const max = Math.max(1, doc.scrollHeight - window.innerHeight);
    const pct = Math.max(0, Math.min(100, Math.round((window.scrollY / max) * 100)));
    if (pct > stats.maxScrollPct) {
      stats.maxScrollPct = pct;
      stats.events.unshift({ type: "read_progress", detail: `${pct}%`, at: Date.now() });
      stats.events = stats.events.slice(0, 80);
      writeJson(analyticsKey, store);
    }
  }

  function formatDate(ms) {
    return new Date(ms).toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  }

  function renderRows(container, rows) {
    if (!container) return;
    container.textContent = "";
    rows.forEach(([label, value, meta]) => {
      const row = document.createElement("div");
      row.className = "quote-demo-row";
      const left = document.createElement("span");
      left.textContent = meta ? `${label} - ${meta}` : label;
      const right = document.createElement("strong");
      right.textContent = value;
      row.append(left, right);
      container.append(row);
    });
  }

  function renderQuote() {
    const state = quoteState();
    document.title = `Bao gia ${quote.unitCode} - ${quote.code}`;
    $("#adminDemoLink").href = `quote-admin-demo.html?code=${quote.code}`;
    $("#quoteTitle").textContent = `Dành riêng cho ${quote.customerName}`;
    $("#quoteIntro").textContent = `Phương án tài chính căn ${quote.unitCode} được lập theo dữ liệu tại thời điểm tạo báo giá.`;
    $("#quoteNotice").innerHTML = `Báo giá được tạo lúc <strong>${formatDate(state.createdAt)}</strong>. Vui lòng liên hệ chuyên viên để xác nhận bảng hàng và chính sách hiện tại trước khi đặt cọc.`;
    $("#finalPrice").textContent = quote.finalPrice;
    $("#upfront").textContent = quote.upfront;
    $("#bankLoan").textContent = quote.bankLoan;
    $("#unitCode").textContent = quote.unitCode;
    $("#advisorNote").textContent = quote.advisor;
    const tags = $("#quoteTags");
    tags.textContent = "";
    quote.tags.forEach((tag) => {
      const item = document.createElement("span");
      item.textContent = tag;
      tags.append(item);
    });
    renderRows($("#unitInfo"), [
      ["Loại căn", quote.unitType],
      ["Tòa / tầng", `${quote.tower} / tầng ${quote.floor}`],
      ["Diện tích", quote.area],
      ["Hướng / view", `${quote.direction} - ${quote.view}`]
    ]);
    renderRows($("#paymentSchedule"), quote.schedule);
    renderRows($("#loanInfo"), quote.loan);
    const loanUrl = new URL("tra-goc-lai-35-nam-tu-ngay-mua.html", window.location.href);
    loanUrl.searchParams.set("unit", quote.unitCode);
    loanUrl.searchParams.set("loan", String(quote.loanAmount));
    loanUrl.searchParams.set("loanPct", "100");
    loanUrl.searchParams.set("support", String(quote.supportMonths));
    loanUrl.searchParams.set("purchaseDate", quote.purchaseDate);
    $("#loanScheduleLink").href = loanUrl.toString();
  }

  function renderCountdown() {
    const state = quoteState();
    const left = state.expiresAt - Date.now();
    const el = $("#countdownText");
    if (!el) return;
    if (left <= 0) {
      el.textContent = "Link đã hết hiệu lực";
      return;
    }
    const totalSeconds = Math.floor(left / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    el.textContent = `Link còn hiệu lực: ${days} ngày ${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  renderQuote();
  renderCountdown();
  track("open", "Khach mo link bao gia");
  updateScrollProgress();

  document.querySelectorAll("[data-track]").forEach((item) => {
    item.addEventListener("click", () => {
      track(item.dataset.track, item.textContent.trim());
    });
  });

  let scrollTimer = 0;
  window.addEventListener("scroll", () => {
    window.clearTimeout(scrollTimer);
    scrollTimer = window.setTimeout(updateScrollProgress, 120);
  }, { passive: true });

  window.setInterval(() => {
    const store = readJson(analyticsKey, {});
    const stats = ensureStats(store);
    stats.timeOnPageSeconds += 5;
    writeJson(analyticsKey, store);
    track("heartbeat");
  }, 5000);

  window.setInterval(renderCountdown, 1000);
  window.addEventListener("pagehide", () => track("close", "Khach roi trang"));
}());
