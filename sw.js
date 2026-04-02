// ══════════════════════════════════════════════════
// ELGIN CAFE — Service Worker
// Cache-first for static assets, network-first for pages
// ══════════════════════════════════════════════════

const CACHE_NAME = 'elgin-v2';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    // Optimized WebP images
    '/pizza.webp',
    '/drink.webp',
    '/artisian.webp',
    '/grand.webp',
    '/signature.webp',
    '/culinery.webp',
    '/coffee.webp',
    '/evening-patio.webp',
];

const CDN_ASSETS = [
    'https://cdn.jsdelivr.net/npm/lenis@1.1.14/dist/lenis.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js',
];

// Pre-cache critical assets on install
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            // Cache local assets (don't fail on individual errors)
            return Promise.allSettled(
                STATIC_ASSETS.map(url => cache.add(url).catch(() => {}))
            ).then(() => {
                // Also cache CDN assets
                return Promise.allSettled(
                    CDN_ASSETS.map(url => cache.add(url).catch(() => {}))
                );
            });
        })
    );
    self.skipWaiting();
});

// Clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
            )
        )
    );
    self.clients.claim();
});

// Fetch strategy
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // Skip Google Maps and analytics
    if (url.hostname.includes('google') || url.hostname.includes('analytics')) return;

    // Images: Cache-first (serve from cache, update in background)
    if (request.destination === 'image' || /\.(webp|jpg|jpeg|png|svg)$/i.test(url.pathname)) {
        event.respondWith(
            caches.match(request).then((cached) => {
                const fetchPromise = fetch(request).then((response) => {
                    if (response && response.ok) {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
                    }
                    return response;
                }).catch(() => cached);

                return cached || fetchPromise;
            })
        );
        return;
    }

    // CSS/JS: Stale-while-revalidate  
    if (request.destination === 'style' || request.destination === 'script' ||
        /\.(css|js)$/i.test(url.pathname)) {
        event.respondWith(
            caches.match(request).then((cached) => {
                const fetchPromise = fetch(request).then((response) => {
                    if (response && response.ok) {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
                    }
                    return response;
                }).catch(() => cached);

                return cached || fetchPromise;
            })
        );
        return;
    }

    // Fonts: Cache-first (fonts rarely change)
    if (request.destination === 'font' || url.hostname === 'fonts.gstatic.com') {
        event.respondWith(
            caches.match(request).then((cached) => {
                if (cached) return cached;
                return fetch(request).then((response) => {
                    if (response && response.ok) {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
                    }
                    return response;
                });
            })
        );
        return;
    }

    // HTML pages: Network-first with cache fallback
    if (request.destination === 'document') {
        event.respondWith(
            fetch(request).then((response) => {
                if (response && response.ok) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
                }
                return response;
            }).catch(() => caches.match(request))
        );
        return;
    }

    // Everything else: network with cache fallback
    event.respondWith(
        fetch(request).catch(() => caches.match(request))
    );
});
