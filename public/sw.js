// MediExplain AI — Multi-Tier Edge Caching & Offline Resilience Service Worker (v2)
const CACHE_VERSION = 'v2';
const STATIC_CACHE = `mediexplain-static-${CACHE_VERSION}`;
const API_CACHE = `mediexplain-api-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `mediexplain-dynamic-${CACHE_VERSION}`;
const EMERGENCY_CACHE = `mediexplain-offline-emergency-${CACHE_VERSION}`;

const CURRENT_CACHES = [STATIC_CACHE, API_CACHE, DYNAMIC_CACHE, EMERGENCY_CACHE];
const MAX_DYNAMIC_ITEMS = 50;
const MAX_API_ITEMS = 30;

// Essential assets required for instant offline emergency triage
const EMERGENCY_PRECACHE_URLS = [
  '/',
  '/emergency',
  '/manifest.json',
  '/globe.svg',
  '/window.svg',
  '/samples/Sample_CBC_Blood_Test_Report.pdf',
  '/samples/Sample_HbA1c_Diabetes_Report.pdf'
];

/**
 * Trim cache to max allowed entries using FIFO/LRU eviction.
 */
async function trimCache(cacheName, maxItems) {
  try {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    if (keys.length > maxItems) {
      await cache.delete(keys[0]);
      await trimCache(cacheName, maxItems);
    }
  } catch (e) {
    // Ignore trim errors
  }
}

// Installation: Pre-cache critical emergency ICE assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(EMERGENCY_CACHE).then((cache) => {
      return cache.addAll(EMERGENCY_PRECACHE_URLS);
    }).then(() => self.skipWaiting())
  );
});

// Activation: Purge legacy or obsolete cache buckets
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!CURRENT_CACHES.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Dispatcher: Multi-Strategy Caching
self.addEventListener('fetch', (event) => {
  // Only process standard GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // 1. Emergency ICE Route & Pre-cached Icons: Instant Cache-First with Background Revalidation
  if (url.pathname === '/emergency' || url.pathname === '/manifest.json') {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(EMERGENCY_CACHE).then((cache) => cache.put(event.request, networkResponse));
          }
          return networkResponse;
        }).catch(() => null);

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // 2. Static Assets (Next.js chunks, fonts, images, SVGs, sample documents): Cache-First Strategy
  const isStaticAsset =
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/samples/') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.woff') ||
    url.pathname.endsWith('.woff2');

  if (isStaticAsset) {
    event.respondWith(
      caches.open(STATIC_CACHE).then(async (cache) => {
        const cached = await cache.match(event.request);
        if (cached) return cached;

        try {
          const networkResponse = await fetch(event.request);
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        } catch (err) {
          // If network failed and not cached, return empty or fallback
          return new Response('', { status: 408, statusText: 'Request Timeout' });
        }
      })
    );
    return;
  }

  // 3. Stale-While-Revalidate (SWR) for Read-Only Clinical Reference APIs
  const isReadApi =
    url.pathname === '/api/reports' ||
    url.pathname === '/api/medicines' ||
    url.pathname === '/api/doctors' ||
    url.pathname === '/api/config/gemini';

  if (isReadApi) {
    event.respondWith(
      caches.open(API_CACHE).then(async (cache) => {
        const cachedResponse = await cache.match(event.request);

        const fetchPromise = fetch(event.request)
          .then(async (networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              await cache.put(event.request, networkResponse.clone());
              trimCache(API_CACHE, MAX_API_ITEMS);
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        // Serve cached version immediately if present (0ms latency), revalidate in background
        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // 4. Page Navigations & General HTML: Network-First with Offline Cache Fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(async (networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(event.request, networkResponse.clone());
            trimCache(DYNAMIC_CACHE, MAX_DYNAMIC_ITEMS);
          }
          return networkResponse;
        })
        .catch(async () => {
          const cached = await caches.match(event.request);
          if (cached) return cached;

          // Ultimate offline fallback: Emergency triage screen
          const emergencyFallback = await caches.match('/emergency');
          if (emergencyFallback) return emergencyFallback;

          return new Response(
            '<!DOCTYPE html><html><body><h1>Offline</h1><p>You are currently offline. MediExplain emergency mode is available.</p></body></html>',
            { headers: { 'Content-Type': 'text/html' } }
          );
        })
    );
    return;
  }

  // 5. Default Network Fetch with Dynamic Cache Fallback
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200 && event.request.url.startsWith('http')) {
          const copy = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
