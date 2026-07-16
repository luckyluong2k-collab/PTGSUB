const CACHE_NAME = "park-pricing-v167-client-advisor";
const ASSETS = [
  "./",
  "./index.html",
  "./forum.html",
  "./styles.css?v=116",
  "./feng-shui.css?v=3",
  "./mid-autumn-theme.css?v=6",
  "./app.js?v=108",
  "./tra-goc-lai-35-nam-tu-ngay-mua.html",
  "./firebase-auth.js?v=85",
  "./loan-auth-guard.js?v=2",
  "./ui-unit-lookup.js?v=1",
  "./ui-admin-search.js?v=1",
  "./ui-menu.js?v=3",
  "./ui-payment.js?v=1",
  "./ui-theme.js?v=4",
  "./feng-shui.js?v=2",
  "./manifest.webmanifest",
  "./favicon.png",
  "./apple-touch-icon.png",
  "./sun-group-icon.png",
  "./sun-group-logo.png",
  "./payment-qr.png",
  "./lowrise-map-sharp.jpg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = new URL(event.notification.data?.url || "./index.html", self.location.href).href;
  event.waitUntil((async () => {
    const windowClients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const client of windowClients) {
      if (typeof client.navigate === "function") {
        await client.navigate(targetUrl).catch(() => null);
      }
      if (typeof client.focus === "function") return client.focus();
    }
    return self.clients.openWindow ? self.clients.openWindow(targetUrl) : null;
  })());
});

async function refreshOpenAppTabs() {
  const clients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
  await Promise.all(clients.map((client) => {
    const url = new URL(client.url);
    const isAppPage = url.origin === self.location.origin
      && !url.pathname.startsWith("/__/")
      && (url.pathname === "/" || url.pathname.endsWith("/index.html"));

    if (!isAppPage || typeof client.navigate !== "function") return null;
    return client.navigate(client.url).catch(() => null);
  }));
}

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    const oldKeys = keys.filter((key) => key !== CACHE_NAME);
    await Promise.all(oldKeys.map((key) => caches.delete(key)));
    await self.clients.claim();

    if (oldKeys.some((key) => key.startsWith("park-pricing-"))) {
      await refreshOpenAppTabs();
    }
  })());
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  if (event.request.mode === "navigate") {
    const requestUrl = new URL(event.request.url);
    const isForumPage = requestUrl.pathname.endsWith("/forum.html");
    const cacheKey = isForumPage ? "./forum.html" : "./index.html";
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(cacheKey, copy));
          return response;
        })
        .catch(() => caches.match(event.request).then((cached) => cached || caches.match(cacheKey)))
    );
    return;
  }

  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});
