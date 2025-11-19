// sw.js - Free Troubleshoot Checker ka Service Worker
const CACHE_NAME = 'ftc-v6';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  // Favicon & icon
  'https://assets.vercel.com/image/upload/front/favicon/vercel/192x192.png',
  'https://assets.vercel.com/image/upload/front/favicon/vercel/57x57.png'
];

// Install - pehli baar cache kar do sab kuch
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache opened');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate - purana cache hata do
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch - network se pehle cache check karo (fast + offline support)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache mein mila toh wahi return kar do
        if (response) {
          return response;
        }
        // Nahi mila toh network se laao
        return fetch(event.request).catch(() => {
          // Agar network bhi fail ho toh simple offline page dikhao
          return new Response(
            '<h1>Offline Mode</h1><p>Internet nahi hai, lekin tool ab bhi kaam kar raha hai!</p>',
            { headers: { 'Content-Type': 'text/html' } }
          );
        });
      })
  );
});
