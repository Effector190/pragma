const CACHE_NAME = 'pragma-v7'; // Поменяли версию
const ASSETS = [
  './',
  './index.html',
  './pragma_app.html',
  './manifest.json',
  './icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Кэшируем ресурсы');
        // Используем addAll, но если что-то не скачается, воркер не умрет
        return cache.addAll(ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).catch(() => {
        // Если нет сети и нет в кэше — просто не падаем
      });
    })
  );
});
