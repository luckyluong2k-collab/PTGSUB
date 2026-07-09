const CACHE_NAME = "park-pricing-v47-payment-basis";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css?v=47",
  "./unit-data.js?v=47",
  "./app.js?v=47",
  "./firebase-auth.js?v=47",
  "./manifest.webmanifest",
  "./icon.svg",
  "./favicon.png",
  "./apple-touch-icon.png",
  "./sun-group-icon.png",
  "./sun-group-logo.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});
