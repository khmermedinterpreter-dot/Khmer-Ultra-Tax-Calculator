// Ultra Tax Calculator - Service Worker (Offline-capable)
const CACHE_NAME = 'ultra-tax-v2';

// Install event — cache the app shell on first visit
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      // Get the base path dynamically (works on both / and /Khmer-Ultra-Tax-Calculator/)
      const scope = self.registration.scope;
      
      // Cache the main page and manifest
      try {
        // Use { cache: 'reload' } to ensure we get fresh copies
        await cache.addAll([
          scope,                    // e.g. /Khmer-Ultra-Tax-Calculator/
          scope + 'manifest.json',
          scope + 'icons/icon-192x192.png',
          scope + 'icons/icon-512x512.png',
        ]);
        console.log('[SW] Core assets cached');
      } catch (err) {
        console.warn('[SW] Some assets failed to cache:', err);
      }
    })()
  );
  self.skipWaiting();
});

// Activate event — clean old caches and take control
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Delete old caches
      const keys = await caches.keys();
      await Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      );
      // Take control of all open tabs immediately
      await self.clients.claim();
      console.log('[SW] Activated and controlling all clients');
    })()
  );
});

// Fetch event — Cache everything the app requests for full offline support
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Only handle GET requests
  if (request.method !== 'GET') return;

  // Strategy: Network First, then Cache (with aggressive caching)
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      try {
        // Try network first
        const networkResponse = await fetch(request);
        
        // Cache successful responses (including CDN resources like Tailwind, fonts)
        if (networkResponse.ok) {
          cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
      } catch (err) {
        // Network failed — serve from cache
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
          console.log('[SW] Serving from cache:', request.url);
          return cachedResponse;
        }

        // For navigation requests, serve the cached main page
        if (request.mode === 'navigate') {
          const scope = self.registration.scope;
          const fallback = await cache.match(scope);
          if (fallback) return fallback;
        }

        return new Response('Offline — this resource is not cached', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: { 'Content-Type': 'text/plain' },
        });
      }
    })()
  );
});
