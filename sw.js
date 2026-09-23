/**
 * ═══════════════════════════════════════════════════════════════
 * سبيل الهدى | Sabeel Al-Huda
 * Service Worker - sw.js (Network-First)
 * ═══════════════════════════════════════════════════════════════
 * ✅ يجلب أحدث نسخة من الإنترنت دائمًا
 * ✅ يحفظ نسخة للعمل بدون إنترنت
 * ═══════════════════════════════════════════════════════════════
 */

const CACHE_VERSION = 'v2.0.0';
const CACHE_NAME = 'sabeel-alhuda-' + CACHE_VERSION;
const QURAN_CACHE = 'sabeel-quran-' + CACHE_VERSION;

// الملفات التي تحتاج تحديثًا دائمًا
const DYNAMIC_ASSETS = [
    './',
    './index.html',
    './quran.html',
    './surah.html',
    './hadith.html',
    './scholars.html',
    './ahmad.html',
    './ibn-taymiyyah.html',
    './ibn-qayyim.html',
    './abdulwahhab.html',
    './athkar.html',
    './news.html',
    './about.html',
    './contact.html',
    './login.html',
    './style.css',
    './config.js',
    './main.js',
    './auth.js'
     './offline.html'
];

// ملفات ثابتة (يمكن تخزينها دائمًا)
const STATIC_ASSETS = [
    './icon.png',
    './manifest.json'
];

// ═══════════════════════════════════════════
// 1. عند التثبيت
// ═══════════════════════════════════════════
self.addEventListener('install', (event) => {
    console.log('🔧 [SW] تثبيت...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll([...DYNAMIC_ASSETS, ...STATIC_ASSETS]))
            .then(() => self.skipWaiting())
            .catch((e) => console.log('⚠️ [SW] خطأ:', e))
    );
});

// ═══════════════════════════════════════════
// 2. عند التنشيط (حذف كل الكاشات القديمة)
// ═══════════════════════════════════════════
self.addEventListener('activate', (event) => {
    console.log('🚀 [SW] تنشيط...');
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME && key !== QURAN_CACHE) {
                        console.log('🗑️ [SW] حذف كاش قديم:', key);
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// ═══════════════════════════════════════════
// 3. عند الطلب
// ═══════════════════════════════════════════
self.addEventListener('fetch', (event) => {
    const request = event.request;
    const url = new URL(request.url);

    // تجاهل غير GET
    if (request.method !== 'GET') return;
    if (url.protocol === 'chrome-extension:') return;

    // ─── API القرآن: Cache-First ───
    if (url.hostname.includes('alquran.cloud')) {
        event.respondWith(
            caches.open(QURAN_CACHE).then((cache) => {
                return cache.match(request).then((cached) => {
                    if (cached) return cached;
                    return fetch(request).then((res) => {
                        if (res && res.status === 200) cache.put(request, res.clone());
                        return res;
                    }).catch(() => cached || new Response('{}', { headers: { 'Content-Type': 'application/json' } }));
                });
            })
        );
        return;
    }

    // ─── Google Fonts: Cache-First ───
    if (url.hostname.includes('fonts.google') || url.hostname.includes('fonts.gstatic')) {
        event.respondWith(
            caches.match(request).then((cached) => {
                if (cached) return cached;
                return fetch(request).then((res) => {
                    if (res && res.status === 200) {
                        caches.open(CACHE_NAME).then((c) => c.put(request, res.clone()));
                    }
                    return res;
                });
            })
        );
        return;
    }

    // ─── الملفات الخاصة بالمنصة: Network-First ───
if (url.origin === self.location.origin) {
    event.respondWith(
        fetch(request).then((res) => {
            // احفظ نسخة جديدة في الكاش
            if (res && res.status === 200 && res.type !== 'opaque') {
                const clone = res.clone();
                caches.open(CACHE_NAME).then((c) => c.put(request, clone));
            }
            return res;
        }).catch(() => {
            // فشل الاتصال → استخدم الكاش
            return caches.match(request).then((cached) => {
                if (cached) return cached;
                // إذا كنا نُحمّل صفحة HTML، أرجع index أولاً ثم offline
                if (request.mode === 'navigate') {
                    return caches.match('./index.html').then((indexCached) => {
                        if (indexCached) return indexCached;
                        return caches.match('./offline.html');
                    });
                }
                return caches.match('./offline.html');
            });
        })
    );
    return;
}
    

    // ─── طلبات أخرى ───
    event.respondWith(fetch(request).catch(() => caches.match(request)));
});

// ═══════════════════════════════════════════
// 4. استقبال الرسائل
// ═══════════════════════════════════════════
self.addEventListener('message', (event) => {
    if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
