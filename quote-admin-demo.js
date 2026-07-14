(function () {
  "use strict";

  const params = new URLSearchParams(window.location.search);
  const code = String(params.get("code") || "AB7K29").trim().toUpperCase();
  const analyticsKey = "ptgsub_quote_demo_analytics_v1";

  function $(selector) {
    return document.querySelector(selector);
  }

  function readStore() {
    try {
      return JSON.parse(localStorage.getItem(analyticsKey) || "{}");
    } catch {
      return {};
    }
  }

  function writeStore(store) {
    localStorage.setItem(analyticsKey, JSON.stringify(store));
  }

  function seedDemoStats() {
    const now = Date.now();
    const store = readStore();
    store[code] = {
      code,
      opens: 1,
      sessions: {
        demo: {
          firstSeenAt: now - 90000,
          lastSeenAt: now
        }
      },
      actions: {
        call: 1,
        zalo: 1,
        flora_avenue: 1,
        loan_schedule: 1
      },
      maxScrollPct: 100,
      timeOnPageSeconds: 42,
      lastSeenAt: now,
      events: [
        { type: "loan_schedule", detail: "Mo trang tinh lai", at: now - 3000 },
        { type: "flora_avenue", detail: "Xem Flora Avenue", at: now - 7000 },
        { type: "call", detail: "Goi tu van", at: now - 16000 },
        { type: "zalo", detail: "Nhan Zalo", at: now - 26000 },
        { type: "read_progress", detail: "100%", at: now - 36000 },
        { type: "open", detail: "Khach mo link bao gia", at: now - 90000 }
      ]
    };
    writeStore(store);
  }

  function formatDate(ms) {
    if (!ms) return "Chua mo link";
    return new Date(ms).toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  }

  function eventLabel(type) {
    return {
      open: "Khach mo link",
      close: "Khach roi trang",
      call: "Bam goi tu van",
      zalo: "Bam nhan Zalo",
      flora_avenue: "Bam Flora Avenue",
      loan_schedule: "Mo trang tinh lai",
      read_progress: "Doc toi vi tri moi"
    }[type] || type;
  }

  function render() {
    const store = readStore();
    const stats = store[code] || {};
    const actions = stats.actions || {};
    const pct = Math.max(0, Math.min(100, Number(stats.maxScrollPct || 0)));
    $("#quoteCode").textContent = code;
    $("#openQuoteLink").href = `quote.html?code=${encodeURIComponent(code)}`;
    $("#opens").textContent = String(stats.opens || 0);
    $("#zaloClicks").textContent = String(actions.zalo || 0);
    $("#callClicks").textContent = String(actions.call || 0);
    $("#floraClicks").textContent = String(actions.flora_avenue || 0);
    $("#lastSeen").textContent = stats.lastSeenAt
      ? `Khach mo gan nhat: ${formatDate(stats.lastSeenAt)}. Tong thoi gian tren trang khoang ${Math.round(Number(stats.timeOnPageSeconds || 0))} giay.`
      : "Chua co du lieu mo link.";
    $("#readProgress").style.width = `${pct}%`;
    $("#readProgressText").textContent = `${pct}%`;

    const list = $("#eventList");
    list.textContent = "";
    const events = Array.isArray(stats.events) ? stats.events : [];
    if (!events.length) {
      const empty = document.createElement("p");
      empty.className = "quote-empty";
      empty.textContent = "Chua co thao tac nao. Mo trang khach de tao du lieu demo.";
      list.append(empty);
      return;
    }
    events.slice(0, 40).forEach((item) => {
      const row = document.createElement("div");
      row.className = "quote-event";
      const time = document.createElement("time");
      time.textContent = formatDate(item.at);
      const text = document.createElement("strong");
      text.textContent = `${eventLabel(item.type)}${item.detail ? ` - ${item.detail}` : ""}`;
      row.append(time, text);
      list.append(row);
    });
  }

  $("#copyQuoteLink").addEventListener("click", async () => {
    const url = new URL(`quote.html?code=${encodeURIComponent(code)}`, window.location.href).toString();
    try {
      await navigator.clipboard.writeText(url);
      $("#copyQuoteLink").textContent = "Da copy";
      window.setTimeout(() => { $("#copyQuoteLink").textContent = "Copy link"; }, 1400);
    } catch {
      window.prompt("Copy link bao gia:", url);
    }
  });

  $("#resetStats").addEventListener("click", () => {
    const store = readStore();
    delete store[code];
    writeStore(store);
    render();
  });

  $("#seedStats").addEventListener("click", () => {
    seedDemoStats();
    render();
  });

  if (params.get("seed") === "1") seedDemoStats();
  render();
  window.setInterval(render, 1000);
}());
