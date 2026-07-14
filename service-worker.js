const CACHE_NAME = "park-pricing-v152-remove-flora-menu";
const ASSETS = [
  "./",
  "./index.html",
  "./forum.html",
  "./quote.html",
  "./quote-admin-demo.html",
  "./quote-demo.css?v=2",
  "./styles.css?v=113",
  "./mid-autumn-theme.css?v=6",
  "./app.js?v=105",
  "./forum.js?v=1",
  "./quote-demo.js?v=2",
  "./quote-admin-demo.js?v=2",
  "./tra-goc-lai-35-nam-tu-ngay-mua.html",
  "./firebase-auth.js?v=84",
  "./ui-unit-lookup.js?v=1",
  "./ui-admin-search.js?v=1",
  "./ui-menu.js?v=2",
  "./ui-payment.js?v=1",
  "./ui-theme.js?v=4",
  "./manifest.webmanifest",
  "./favicon.png",
  "./apple-touch-icon.png",
  "./sun-group-icon.png",
  "./sun-group-logo.png",
  "./payment-qr.png",
  "./lowrise-map-sharp.jpg",
  "./lienke.png",
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
