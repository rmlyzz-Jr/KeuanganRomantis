// ============================================================
// Service Worker - Keuangan ROMANTIS
// ============================================================

const CACHE_NAME = 'romantis-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.min.js',
  'https://i.ibb.co.com/wZMrZqwn/logo-romantis.png'
];

// ============================================================
// INSTALL - Cache aset penting
// ============================================================
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('💕 ROMANTIS: Caching assets...');
        return cache.addAll(ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// ============================================================
// ACTIVATE - Bersihkan cache lama
// ============================================================
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME)
          .map((key) => {
            console.log('💕 ROMANTIS: Menghapus cache lama:', key);
            return caches.delete(key);
          })
      );
    })
  );
  return self.clients.claim();
});

// ============================================================
// FETCH - Serve dari cache jika ada, jika tidak fetch dari network
// ============================================================
self.addEventListener('fetch', (event) => {
  // Skip request yang tidak perlu di-cache
  if (event.request.url.includes('google-analytics') || 
      event.request.url.includes('doubleclick.net') ||
      event.request.url.includes('googletagmanager')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Jika ada di cache, kembalikan
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Jika tidak ada di cache, fetch dari network
        return fetch(event.request)
          .then((response) => {
            // Cek apakah response valid
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone response untuk disimpan di cache
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then((cache) => {
                try {
                  cache.put(event.request, responseToCache);
                } catch (e) {
                  console.log('💕 ROMANTIS: Gagal cache:', e);
                }
              });
            
            return response;
          })
          .catch(() => {
            // Fallback offline - tampilkan halaman offline jika tersedia
            return caches.match('/offline.html');
          });
      })
  );
});

// ============================================================
// PUSH NOTIFICATION (Opsional - untuk masa depan)
// ============================================================
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : '💕 Ada update keuangan nih!',
    icon: 'https://i.ibb.co.com/wZMrZqwn/logo-romantis.png',
    badge: 'https://i.ibb.co.com/wZMrZqwn/logo-romantis.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      { action: 'explore', title: 'Lihat Aplikasi', icon: 'https://i.ibb.co.com/wZMrZqwn/logo-romantis.png' },
      { action: 'close', title: 'Tutup' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('💕 ROMANTIS Keuangan', options)
  );
});

// ============================================================
// NOTIFICATION CLICK
// ============================================================
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

console.log('💕 ROMANTIS Service Worker siap!');
