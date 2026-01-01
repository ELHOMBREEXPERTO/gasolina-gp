const CACHE_NAME = 'gas-gp-v2'; // Cambiamos el nombre para forzar actualización
const assets = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  'https://cdn-icons-png.flaticon.com/512/4842/4842231.png'
];

// 1. Instalación: Guardar archivos en el teléfono
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Guardando archivos en caché...');
      return cache.addAll(assets);
    })
  );
  self.skipWaiting(); // Obliga al nuevo SW a activarse de inmediato
});

// 2. Activación: Limpiar versiones viejas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

// 3. Intercepción: Servir desde el caché incluso sin internet
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Si está en el caché, lo devuelve. Si no, intenta internet.
      return cachedResponse || fetch(event.request);
    }).catch(() => {
      // Si falla todo (no hay red ni caché), podrías mostrar una página de error
      // Pero como guardamos el index.html, esto casi nunca pasará.
    })
  );
});