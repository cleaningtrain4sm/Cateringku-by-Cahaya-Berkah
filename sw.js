var CACHE = 'cateringku-v1';
var CORE = ['./', './index.html', './manifest.json'];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return cache.addAll(CORE).catch(function () {});
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    fetch(event.request)
      .then(function (response) {
        if (event.request.method === 'GET') {
          var copy = response.clone();
          caches.open(CACHE).then(function (cache) {
            cache.put(event.request, copy);
          }).catch(function () {});
        }
        return response;
      })
      .catch(function () {
        return caches.match(event.request).then(function (match) {
          return match || caches.match('./index.html');
        });
      })
  );
});