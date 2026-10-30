const CACHE_NAME = 'com2it-pwa-v2';

const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/styles.css',
  './js/config.js',
  './js/diagnostic-data.js',
  './js/supabase-service.js',
  './js/app.js',
  './assets/icons/icon.svg',
  './icon-192.png',
  './icon-512.png'
];

// Instalación: Cachear assets estáticos esenciales
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Precaching recursos de Com2IT...');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activación: Limpiar cachés anteriores
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('[Service Worker] Limpiando caché antigua:', name);
            return caches.delete(name);
          }
          return Promise.resolve();
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Estrategia de Fetch: Network-First con fallback a Caché.
// Se ignoran las llamadas directas a la API REST/Realtime de Supabase.
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // No interceptar peticiones a la API REST o Realtime de Supabase
  if (requestUrl.hostname.includes('supabase.co')) {
    return;
  }

  // Solo se interceptan peticiones GET; el resto pasa directo a la red
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(async () => {
        // Si no hay red (offline), servimos desde la caché
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }

        // Si es navegación HTML y falló, servir index.html
        if (event.request.mode === 'navigate') {
          const fallbackPage = await caches.match('./index.html');
          if (fallbackPage) {
            return fallbackPage;
          }
        }

        return new Response('Sin conexión de red en Com2IT', {
          status: 503,
          statusText: 'Offline',
          headers: new Headers({ 'Content-Type': 'text/plain; charset=utf-8' })
        });
      })
  );
});
