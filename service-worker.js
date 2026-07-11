const CACHE_NAME = "park-pricing-v83-signature-sheet-gate";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css?v=79",
  "./unit-data.js?v=64",
  "./app.js?v=83",
  "./firebase-auth.js?v=76",
  "./manifest.webmanifest",
  "./icon.svg",
  "./favicon.png",
  "./apple-touch-icon.png",
  "./sun-group-icon.png",
  "./sun-group-logo.png",
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
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put("./index.html", copy));
          return response;
        })
        .catch(() => caches.match(event.request).then((cached) => cached || caches.match("./index.html")))
    );
    return;
  }

  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});
