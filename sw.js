const staticCacheName = 'site-static-2022-03-02';
const assets = ['./', './index.html', './script.js', './styles.css'];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(staticCacheName).then(cache => {
            cache.addAll(assets);
        })
    )
});
self.addEventListener('activated', (e) => {
    // delete prev "versions" of cache
    e.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                 keys.filter(key => key !== staticCacheName).map(key => caches.delete(key))
            )
        })
    )
});
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then(cacheRes => {
           return cacheRes || fetch(e.request);
        })
    );
});
