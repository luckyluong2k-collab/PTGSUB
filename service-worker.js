const CACHE_NAME = "park-pricing-v40-sun-logo";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./unit-data.js",
  "./app.js",
  "./firebase-auth.js",
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
