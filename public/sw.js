// AgroCare AI Service Worker for Offline Persistence & PWA
const CACHE_NAME = 'agrocare-cache-v2';
const RUNTIME_CACHE = 'agrocare-runtime-v2';

// Install event
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activate event: Clean up legacy caches and claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event: Bypass all JavaScript/Vite/HMR/module requests completely to prevent stale React chunk collisions
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Bypass all script, Vite, node_modules, source, or development requests completely
  if (
    request.destination === 'script' ||
    url.pathname.includes('/@vite/') ||
    url.pathname.includes('/@id/') ||
    url.pathname.includes('/node_modules/') ||
    url.pathname.includes('/src/') ||
    url.pathname.endsWith('.ts') ||
    url.pathname.endsWith('.tsx') ||
    url.pathname.endsWith('.jsx') ||
    url.pathname.endsWith('.js')
  ) {
    return; // Let browser fetch directly from server
  }

  // Bypass non-GET requests
  if (request.method !== 'GET') {
    return;
  }
});
