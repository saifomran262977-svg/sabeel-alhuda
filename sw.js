/**
 * ═══════════════════════════════════════════════════════════════
 * سبيل الهدى | Sabeel Al-Huda
 * Service Worker - sw.js
 * ═══════════════════════════════════════════════════════════════
 * يتيح استخدام المنصة بدون إنترنت + التحديث التلقائي
 * ═══════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════
// الإعدادات
// ═══════════════════════════════════════════
const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = 'sabeel-alhuda-' + CACHE_VERSION;
const API_CACHE_NAME = 'sabeel-api-' + CACHE_VERSION;
const QURAN_CACHE_NAME = 'sabeel-quran-' + CACHE_VERSION;

// ═══════════════════════════════════════════
// الملفات الأساسية للتخزين
// ═══════════════════════════════════════════
const CORE_ASSETS = [
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
    './auth.js',
    './manifest.json',
    './icon.png'
];

// ═══════════════════════════════════════════
// روابط خارجية (Google Fonts)
// ═══════════════════════════════════════════
const EXTERNAL_ASSETS = [
    'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Tajawal:wght@400;500;700;900&family=Amiri:wght@400;700&display=swap'
];

// ═══════════════════════════════════════════
// 1. عند التثبيت (Install)
// ═══════════════════════════════════════════
self.addEventListener('install', (event) => {
    console.log('🔧 [SW] تثبيت Service Worker...');

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('📦 [SW] تخزين الملفات الأساسية...');
                return cache.addAll(CORE_ASSETS).catch((err) => {
                    console.warn('⚠️ [SW] بعض الملفات لم تُخزَّن:', err);
                });
            })
            .then(() => {
                // تخزين الخطوط الخارجية بشكل منفصل
                return caches.open(API_CACHE_NAME).then((cache) => {
                    return Promise.all(
                        EXTERNAL_ASSETS.map((url) =>
                            fetch(url, { mode: 'cors' })
                                .then((res) => res.ok ? cache.put(url, res) : null)
                                .catch(() => null)
                        )
                    );
                });
            })
            .then(() => {
                console.log('✅ [SW] تم التثبيت بنجاح');
                return self.skipWaiting();
            })
    );
});

// ═══════════════════════════════════════════
// 2. عند التنشيط (Activate)
// ═══════════════════════════════════════════
self.addEventListener('activate', (event) => {
    console.log('🚀 [SW] تنشيط Service Worker...');

    event.waitUntil(
        caches.keys()
            .then((keys) => {
                return Promise.all(
                    keys.map((key) => {
                        // حذف الذاكرات القديمة
                        if (key !== CACHE_NAME &&
                            key !== API_CACHE_NAME &&
                            key !== QURAN_CACHE_NAME) {
                            console.log('🗑️ [SW] حذف ذاكرة قديمة:', key);
                            return caches.delete(key);
                        }
                    })
                );
            })
            .then(() => {
                console.log('✅ [SW] تم التنشيط');
                return self.clients.claim();
            })
    );
});

// ═══════════════════════════════════════════
// 3. عند الطلب (Fetch)
// ═══════════════════════════════════════════
self.addEventListener('fetch', (event) => {
    const request = event.request;
    const url = new URL(request.url);

    // تجاهل الطلبات غير GET
    if (request.method !== 'GET') return;

    // تجاهل chrome-extension
    if (url.protocol === 'chrome-extension:') return;

    // ─── 1. طلبات API القرآن ───
    if (url.hostname.includes('alquran.cloud')) {
        event.respondWith(
            caches.open(QURAN_CACHE_NAME).then((cache) => {
                return fetch(request)
                    .then((response) => {
                        if (response && response.status === 200) {
                            cache.put(request, response.clone());
                        }
                        return response;
                    })
                    .catch(() => {
                        // إذا فشل الاتصال، جلب من الذاكرة
                        return cache.match(request).then((cached) => {
                            if (cached) return cached;
                            // رد افتراضي عند عدم وجود نتائج مخزنة
                            return new Response(
                                JSON.stringify({
                                    code: 503,
                                    status: "error",
                                    message: "لا يوجد اتصال بالإنترنت"
                                }),
                                { headers: { 'Content-Type': 'application/json' } }
                            );
                        });
                    });
            })
        );
        return;
    }

    // ─── 2. طلبات Google Fonts ───
    if (url.hostname.includes('fonts.googleapis.com') ||
        url.hostname.includes('fonts.gstatic.com')) {
        event.respondWith(
            caches.match(request).then((cached) => {
                if (cached) return cached;
                return fetch(request).then((response) => {
                    if (response && response.status === 200) {
                        const copy = response.clone();
                        caches.open(API_CACHE_NAME).then((cache) => {
                            cache.put(request, copy);
                        });
                    }
                    return response;
                }).catch(() => cached);
            })
        );
        return;
    }

    // ─── 3. الملفات الداخلية (نفس الأصل) ───
    if (url.origin === self.location.origin) {
        // استثناء الملفات التي لا تُخزَّن
        if (url.pathname.includes('service-worker.js') ||
            url.pathname.includes('sw.js')) {
            return;
        }

        // استراتيجية: Cache First مع تحديث في الخلفية
        event.respondWith(
            caches.match(request).then((cached) => {
                // جلب نسخة جديدة في الخلفية (Stale-While-Revalidate)
                const fetchPromise = fetch(request)
                    .then((response) => {
                        if (response && response.status === 200 && response.type !== 'opaque') {
                            const copy = response.clone();
                            caches.open(CACHE_NAME).then((cache) => {
                                cache.put(request, copy);
                            });
                        }
                        return response;
                    })
                    .catch(() => cached);

                // إرجاع النسخة المخزنة فورًا (أسرع)، أو انتظار الشبكة
                return cached || fetchPromise;
            })
        );
        return;
    }

    // ─── 4. طلبات خارجية أخرى ───
    event.respondWith(
        fetch(request).catch(() => caches.match(request))
    );
});

// ═══════════════════════════════════════════
// 4. استقبال رسائل من الصفحات
// ═══════════════════════════════════════════
self.addEventListener('message', (event) => {
    const data = event.data;

    // تفعيل التحديث فورًا
    if (data === 'SKIP_WAITING' || (data && data.type === 'SKIP_WAITING')) {
        console.log('🔄 [SW] تحديث فوري بناءً على طلب الصفحة');
        self.skipWaiting();
    }

    // مسح الذاكرة المؤقتة
    if (data === 'CLEAR_CACHE' || (data && data.type === 'CLEAR_CACHE')) {
        console.log('🗑️ [SW] مسح الذاكرة المؤقتة');
        caches.keys().then((keys) => {
            return Promise.all(keys.map((key) => caches.delete(key)));
        });
    }

    // إرسال إشعار للصفحة
    if (data === 'GET_VERSION' || (data && data.type === 'GET_VERSION')) {
        event.source.postMessage({
            type: 'VERSION',
            version: CACHE_VERSION
        });
    }
});

// ═══════════════════════════════════════════
// 5. مزامنة في الخلفية (اختياري)
// ═══════════════════════════════════════════
self.addEventListener('sync', (event) => {
    if (event.tag === 'sabeel-sync') {
        console.log('🔄 [SW] مزامنة في الخلفية');
        event.waitUntil(
            // يمكن إضافة مزامنة إعدادات المستخدم هنا
            Promise.resolve()
        );
    }
});

// ═══════════════════════════════════════════
// 6. إشعارات Push (اختياري - للمستقبل)
// ═══════════════════════════════════════════
self.addEventListener('push', (event) => {
    console.log('📬 [SW] إشعار وارد');

    let data = {
        title: 'سبيل الهدى',
        body: 'لديك إشعار جديد',
        icon: './icon.png',
        badge: './icon.png',
        url: './index.html'
    };

    if (event.data) {
        try {
            const parsed = event.data.json();
            data = { ...data, ...parsed };
        } catch (e) {
            data.body = event.data.text();
        }
    }

    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: data.icon,
            badge: data.badge,
            dir: 'rtl',
            lang: 'ar',
            vibrate: [200, 100, 200],
            tag: 'sabeel-notification',
            requireInteraction: false,
            data: { url: data.url }
        })
    );
});

// ═══════════════════════════════════════════
// 7. عند الضغط على الإشعار
// ═══════════════════════════════════════════
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    const urlToOpen = event.notification.data?.url || './index.html';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                // إذا كان الموقع مفتوحًا، ركّز عليه
                for (const client of clientList) {
                    if (client.url.includes(self.location.origin) && 'focus' in client) {
                        client.navigate(urlToOpen);
                        return client.focus();
                    }
                }
                // وإلا افتح نافذة جديدة
                if (clients.openWindow) {
                    return clients.openWindow(urlToOpen);
                }
            })
    );
});

// ═══════════════════════════════════════════
// 8. معلومات التشخيص
// ═══════════════════════════════════════════
console.log('%c🕌 سبيل الهدى — Service Worker', 'color: #d4af37; font-size: 14px; font-weight: bold;');
console.log('%cالإصدار: ' + CACHE_VERSION, 'color: #10b981; font-size: 12px;');
console.log('%cتم التحميل بنجاح', 'color: #94a3b8; font-size: 11px;');
