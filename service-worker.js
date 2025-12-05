
const CACHE_NAME = '3f-app-cache-v1';
const DYNAMIC_CACHE_NAME = '3f-app-dynamic-v1';

// فایل‌هایی که باید بلافاصله کش شوند (App Shell)
const STATIC_ASSETS = [
  '/',
  '/index.html',
  'https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css',
  'https://cdn.tailwindcss.com'
];

// نصب سرویس ورکر و کش کردن فایل‌های استاتیک
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Caching App Shell');
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// فعال‌سازی و پاک کردن کش‌های قدیمی
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME && key !== DYNAMIC_CACHE_NAME) {
            console.log('Service Worker: Removing old cache', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// مدیریت درخواست‌ها (Fetch)
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // نادیده گرفتن درخواست‌های غیر GET
  if (request.method !== 'GET') return;

  // استراتژی برای درخواست‌های ناوبری (Navigation) - برای SPA
  // اگر کاربر آفلاین بود و صفحه‌ای را رفرش کرد، index.html برگردانده شود
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match('/index.html');
      })
    );
    return;
  }

  // استراتژی Cache First, falling back to Network برای فایل‌های استاتیک و تصاویر
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request)
        .then((networkResponse) => {
          // بررسی صحت پاسخ شبکه
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic' && networkResponse.type !== 'cors') {
            return networkResponse;
          }

          // ذخیره پاسخ جدید در کش داینامیک
          const responseToCache = networkResponse.clone();
          caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });

          return networkResponse;
        })
        .catch(() => {
          // اگر آفلاین بودیم و عکس درخواست شده بود، می‌توان یک تصویر پیش‌فرض برگرداند (اختیاری)
          if (request.destination === 'image') {
             // return caches.match('/offline-image.png');
          }
        });
    })
  );
});
