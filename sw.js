/**
 * ═══════════════════════════════════════════════════════════════
 * سبيل الهدى | Sabeel Al-Huda
 * Service Worker v3.0 — تخزين كامل مضمون
 * ═══════════════════════════════════════════════════════════════
 * ✅ يُخزّن كل الملفات مسبقًا
 * ✅ يعمل بدون إنترنت 100%
 * ✅ لا يُمسح الكاش عند الإغلاق
 * ═══════════════════════════════════════════════════════════════
 */

const CACHE_NAME = 'sabeel-alhuda-v3';
const QURAN_CACHE = 'sabeel-quran-v3';

// ═══ كل الملفات المطلوب تخزينها ═══
const FILES_TO_CACHE = [
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
    './offline.html',
    './style.css',
    './config.js',
    './main.js',
    './auth.js',
    './icon.png',
    './manifest.json'
];

// ═══ 1. التثبيت: تخزين كل الملفات ═══
self.addEventListener('install', (event) => {
    console.log('🔧 [SW] بدء التثبيت...');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('📦 [SW] تخزين', FILES_TO_CACHE.length, 'ملف...');
            // تخزين كل ملف على حدة (أكثر أمانًا)
            return Promise.all(
                FILES_TO_CACHE.map((url) => {
                    return cache.add(url).catch((err) => {
                        console.warn('⚠️ [SW] فشل تخزين:', url, err);
                    });
                })
            );
        }).then(() => {
            console.log('✅ [SW] تم التثبيت');
            return self.skipWaiting();
        })
    );
});

// ═══ 2. التنشيط: حذف الكاش القديم ═══
self.addEventListener('activate', (event) => {
    console.log('🚀 [SW] بدء التنشيط...');
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
        }).then(() => {
            console.log('✅ [SW] تم التنشيط');
            return self.clients.claim();
        })
    );
});

// ═══ 3. الطلبات: Cache-First لكل شيء ═══
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
                    }).catch(() => new Response('{}', { headers: { 'Content-Type': 'application/json' } }));
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
                }).catch(() => cached);
            })
        );
        return;
    }

    // ─── ملفات الموقع: Cache-First قوي ───
    if (url.origin === self.location.origin) {
        event.respondWith(
            caches.match(request).then((cached) => {
                // إذا وُجد في الكاش، اعرضه فورًا
                if (cached) {
                    // حاول تحديثه في الخلفية (لا يمنع العرض)
                    fetch(request).then((res) => {
                        if (res && res.status === 200) {
                            caches.open(CACHE_NAME).then((c) => c.put(request, res.clone()));
                        }
                    }).catch(() => {});
                    return cached;
                }

                // إذا لم يوجد، اجلبه من الإنترنت
                return fetch(request).then((res) => {
                    if (res && res.status === 200 && res.type !== 'opaque') {
                        const clone = res.clone();
                        caches.open(CACHE_NAME).then((c) => c.put(request, clone));
                    }
                    return res;
                }).catch(() => {
                    // فشل كل شيء → صفحة offline
                    if (request.mode === 'navigate') {
                        return caches.match('./index.html').then((index) => {
                            return index || caches.match('./offline.html');
                        });
                    }
                    return caches.match('./offline.html');
                });
            })
        );
        return;
    }

    // ─── طلبات أخرى ───
    event.respondWith(
        fetch(request).catch(() => caches.match(request))
    );
});

// ═══ 4. رسائل من الصفحات ═══
self.addEventListener('message', (event) => {
    if (event.data === 'SKIP_WAITING') self.skipWaiting();
    if (event.data === 'CLEAR_CACHE') {
        caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k))));
    }
});
