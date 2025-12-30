const CACHE_NAME = 'gasolina-gp-v1';
const assets = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json'
];

// Instalar el Service Worker y guardar archivos en caché
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(assets);
    })
  );
});

// Estrategia: Primero buscar en Caché, si no hay, ir a Internet
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});