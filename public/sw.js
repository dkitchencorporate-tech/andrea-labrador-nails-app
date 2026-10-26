// Self-destructing cleanup Service Worker for VANESEV
// Eliminates any legacy PWA cache (andrea-nails-pwa-v3, etc.) and unregisters itself immediately.

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
      .then(() => self.registration.unregister())
      .then(() => self.clients.matchAll())
      .then((clients) => {
        clients.forEach((client) => {
          if (client.url && 'navigate' in client) {
            // Caches cleared & SW unregistered
          }
        });
      })
  );
});

