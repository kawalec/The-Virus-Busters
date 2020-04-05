const CACHE_NAME = "The Virus Busters";

let filesToCache = ["/", "/styles/styles.css", "/img/logo.png", "/js/app.js"];

self.addEventListener("install", function (evt) {
  evt.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(function (cache) {
        return cache.addAll(filesToCache);
      })
      .catch(function (err) {})
  );
});

self.addEventListener("fetch", function (evt) {
  evt.respondWith(
    fetch(evt.request).catch(function () {
      return caches.match(evt.request);
    })
  );
});
