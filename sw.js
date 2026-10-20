// Uzhavan Hub - Progressive Web App Service Worker
// Enables offline functionality, fast field loading, and client caching

const CACHE_NAME = 'uzhavan-hub-v2.5';
const STATIC_ASSETS = [
  './',
  'index.html',
  'css/style.css',
  'assets/icon.svg',
  'manifest.json',
  'js/data.js',
  'js/engine.js',
  'js/app.js',
  'js/components/landing.js',
  'js/components/dashboard.js',
  'js/components/decisionEngine.js',
  'js/components/farmLingo.js',
  'js/components/plantWizard.js',
  'js/components/cropHealth.js',
  'js/components/weather.js',
  'js/components/marketPrice.js',
  'js/components/farmFinance.js',
  'js/components/farmServices.js',
  'js/components/farmLabour.js',
  'js/components/machineryRental.js',
  'js/components/veterinaryCare.js',
  'js/components/community.js',
  'js/components/schemes.js',
  'js/components/loans.js',
  'js/components/fertilizer.js',
  'js/components/farmManagement.js',
  'js/components/actionPlan.js',
  'js/components/cropRisk.js',
  'js/components/profitPredictor.js',
  'js/components/voiceAssistant.js',
  'data/crops.json',
  'data/weather.json',
  'data/fertilizers.json',
  'data/marketPrices.json',
  'data/rentals.json',
  'data/veterinary.json',
  'data/schemes.json',
  'data/voiceFaq.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Uzhavan SW] Pre-caching offline agricultural assets');
      return cache.addAll(STATIC_ASSETS).catch(err => {
        console.warn('[Uzhavan SW] Caching notice:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Network first, falling back to cache
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Cache dynamic successful responses
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Offline fallback to cache
        return caches.match(event.request);
      })
  );
});
