/**
 * ═══════════════════════════════════════════════════════════════
 * سبيل الهدى | Sabeel Al-Huda
 * المحرك الرئيسي - main.js
 * ═══════════════════════════════════════════════════════════════
 * يتحكم في تفاعلات المنصة، وبناء العناصر الديناميكية، وتفعيل PWA.
 * يعتمد على البيانات الموجودة في config.js
 * ═══════════════════════════════════════════════════════════════
 */

document.addEventListener('DOMContentLoaded', () => {

   // ═══════════════════════════════════════════
// 1. إخفاء شاشة التحميل (محسّن)
// ═══════════════════════════════════════════
const preloader = document.getElementById('preloader');

function hidePreloader() {
    if (preloader && preloader.parentNode) {
        preloader.classList.add('hidden');
        setTimeout(() => {
            if (preloader.parentNode) {
                preloader.parentNode.removeChild(preloader);
            }
        }, 600);
    }
}

// إخفاء فوري بعد 1.2 ثانية (حماية قصوى)
setTimeout(hidePreloader, 1200);

// محاولة عادية عند اكتمال التحميل
window.addEventListener('load', () => {
    setTimeout(hidePreloader, 300);
});

// حماية إضافية: DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(hidePreloader, 800);
    });
} else {
    setTimeout(hidePreloader, 500);
}

    // ═══════════════════════════════════════════
    // 2. شريط تقدم التمرير
    // ═══════════════════════════════════════════
    const scrollProgress = document.getElementById('scrollProgress');
    if (scrollProgress) {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
                    scrollProgress.style.width = progress + '%';
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // ═══════════════════════════════════════════
    // 3. القائمة الجانبية للهاتف
    // ═══════════════════════════════════════════
    const menuBtn = document.getElementById('menuBtn');
    const navMenu = document.getElementById('navMenu');
    const navOverlay = document.getElementById('navOverlay');

    function openMenu() {
        if (navMenu) navMenu.classList.add('active');
        if (navOverlay) navOverlay.classList.add('active');
        if (menuBtn) {
            menuBtn.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>`;
        }
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        if (navMenu) navMenu.classList.remove('active');
        if (navOverlay) navOverlay.classList.remove('active');
        if (menuBtn) {
            menuBtn.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="3" y1="12" x2="21" y2="12"/>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <line x1="3" y1="18" x2="21" y2="18"/>
                </svg>`;
        }
        document.body.style.overflow = '';
    }

    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            if (navMenu && navMenu.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
    }

    if (navOverlay) {
        navOverlay.addEventListener('click', closeMenu);
    }

    if (navMenu) {
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }

    // إغلاق بزر Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMenu();
        }
    });

    // ═══════════════════════════════════════════
    // 4. زر تغيير المظهر
    // ═══════════════════════════════════════════
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const savedTheme = localStorage.getItem('sabeel_theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-mode');
        }

        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            const isLight = document.body.classList.contains('light-mode');
            localStorage.setItem('sabeel_theme', isLight ? 'light' : 'dark');

            const metaTheme = document.querySelector('meta[name="theme-color"]');
            if (metaTheme) {
                metaTheme.setAttribute('content', isLight ? '#f8fafc' : '#0a0e1a');
            }
        });
    }

    // ═══════════════════════════════════════════
    // 5. تحديث السنة في التذييل
    // ═══════════════════════════════════════════
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // ═══════════════════════════════════════════
    // 6. زر العودة للأعلى
    // ═══════════════════════════════════════════
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        let btTicking = false;
        window.addEventListener('scroll', () => {
            if (!btTicking) {
                window.requestAnimationFrame(() => {
                    if (window.pageYOffset > 400) {
                        backToTop.classList.add('visible');
                    } else {
                        backToTop.classList.remove('visible');
                    }
                    btTicking = false;
                });
                btTicking = true;
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ═══════════════════════════════════════════
    // 7. تحميل الاقتباسات ديناميكيًا
    // ═══════════════════════════════════════════
    const quoteSection = document.querySelector('.quote-section');
    if (quoteSection && typeof siteConfig !== 'undefined' && siteConfig.quotes) {
        const quoteText = quoteSection.querySelector('.quote-text');
        const quoteAuthor = quoteSection.querySelector('.quote-author');

        if (quoteText && quoteAuthor && siteConfig.quotes.length > 0) {
            const randomQuote = siteConfig.quotes[Math.floor(Math.random() * siteConfig.quotes.length)];
            quoteText.textContent = randomQuote.text;
            quoteAuthor.textContent = "— " + randomQuote.ref;

            let currentQuoteIndex = siteConfig.quotes.indexOf(randomQuote);
            setInterval(() => {
                currentQuoteIndex = (currentQuoteIndex + 1) % siteConfig.quotes.length;
                const nextQuote = siteConfig.quotes[currentQuoteIndex];

                quoteText.style.transition = 'opacity 0.4s ease';
                quoteAuthor.style.transition = 'opacity 0.4s ease';
                quoteText.style.opacity = '0';
                quoteAuthor.style.opacity = '0';

                setTimeout(() => {
                    quoteText.textContent = nextQuote.text;
                    quoteAuthor.textContent = "— " + nextQuote.ref;
                    quoteText.style.opacity = '1';
                    quoteAuthor.style.opacity = '1';
                }, 400);
            }, 30000);
        }
    }

    /
        const revealElements = document.querySelectorAll('.section, .card-item, .tool-item, .quote-section');

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
            revealObserver.observe(el);
        });
    }

    // ═══════════════════════════════════════════
    // 9. تحميل معلومات المنصة من config.js
    // ═══════════════════════════════════════════
    if (typeof siteConfig !== 'undefined') {
        if (siteConfig.site && siteConfig.site.name) {
            const titleTag = document.querySelector('title');
            if (titleTag && !titleTag.textContent.includes(siteConfig.site.name)) {
                titleTag.textContent = siteConfig.site.name + ' | ' + siteConfig.site.tagline;
            }
        }

        const brandTitle = document.querySelector('.logo-text h1');
        if (brandTitle && siteConfig.site && siteConfig.site.name) {
            brandTitle.textContent = siteConfig.site.name;
        }

        const brandSubtitle = document.querySelector('.logo-text p');
        if (brandSubtitle && siteConfig.site && siteConfig.site.tagline) {
            brandSubtitle.textContent = siteConfig.site.tagline;
        }
    }

    // ═══════════════════════════════════════════
    // 10. تسجيل Service Worker (PWA)
    // ═══════════════════════════════════════════
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then((registration) => {
                    console.log('✅ [PWA] تم تفعيل العمل بدون إنترنت');
                    console.log('📦 [PWA] Service Worker مسجّل بنجاح');

                    // فحص التحديثات كل 60 ثانية
                    setInterval(() => {
                        registration.update();
                    }, 60000);

                    // عند وجود تحديث جديد
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        console.log('🔄 [PWA] يوجد تحديث جديد...');

                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                console.log('✅ [PWA] التحديث جاهز');
                                showUpdateButton();
                            }
                        });
                    });
                })
                .catch((err) => {
                    console.log('⚠️ [PWA] فشل تسجيل Service Worker:', err);
                });

            // إعادة تحميل الصفحة عند تحديث Service Worker
            let refreshing = false;
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                if (!refreshing) {
                    refreshing = true;
                    window.location.reload();
                }
            });
        });
    }

    // ═══════════════════════════════════════════
    // 11. زر التحديث العائم
    // ═══════════════════════════════════════════
    function showUpdateButton() {
        if (document.getElementById('pwaUpdateBtn')) return;

        const btn = document.createElement('button');
        btn.id = 'pwaUpdateBtn';
        btn.className = 'pwa-update-btn';
        btn.innerHTML = `
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="23 4 23 10 17 10"/>
                <polyline points="1 20 1 14 7 14"/>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
            <span>تحديث جديد</span>
        `;

        btn.addEventListener('click', () => {
            const sw = navigator.serviceWorker.controller;
            if (sw) sw.postMessage('SKIP_WAITING');
            btn.innerHTML = '⏳ جارٍ التحديث...';
            btn.disabled = true;
            setTimeout(() => window.location.reload(), 1000);
        });

        document.body.appendChild(btn);
    }

    // ═══════════════════════════════════════════
    // 12. إشعار "أضف إلى الشاشة الرئيسية"
    // ═══════════════════════════════════════════
    let deferredPrompt = null;

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        console.log('📲 [PWA] التطبيق قابل للتثبيت');

        // إظهار الإشعار بعد 15 ثانية
        setTimeout(() => {
            if (document.getElementById('pwaInstallBanner')) return;

            const banner = document.createElement('div');
            banner.id = 'pwaInstallBanner';
            banner.className = 'pwa-install-banner';
            banner.innerHTML = `
                <div class="pwa-install-text">
                    <b>📲 ثبّت سبيل الهدى</b>
                    <span>تصفح بدون إنترنت</span>
                </div>
                <div class="pwa-install-actions">
                    <button id="pwaInstallBtn">تثبيت</button>
                    <button id="pwaCloseBtn" aria-label="إغلاق">✕</button>
                </div>
            `;
            document.body.appendChild(banner);
            setTimeout(() => banner.classList.add('show'), 100);

            document.getElementById('pwaInstallBtn').addEventListener('click', async () => {
                if (!deferredPrompt) return;
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                console.log('👤 [PWA] نتيجة التثبيت:', outcome);

                if (outcome === 'accepted') {
                    banner.classList.remove('show');
                    setTimeout(() => banner.remove(), 500);
                }
                deferredPrompt = null;
            });

            document.getElementById('pwaCloseBtn').addEventListener('click', () => {
                banner.classList.remove('show');
                setTimeout(() => banner.remove(), 500);
                // تذكر الرفض ليوم واحد
                localStorage.setItem('pwa_install_dismissed', Date.now().toString());
            });
        }, 15000);
    });

    window.addEventListener('appinstalled', () => {
        console.log('✅ [PWA] تم تثبيت التطبيق بنجاح');
        const banner = document.getElementById('pwaInstallBanner');
        if (banner) {
            banner.classList.remove('show');
            setTimeout(() => banner.remove(), 500);
        }
        deferredPrompt = null;
    });

    // ═══════════════════════════════════════════
    // 13. اختصارات لوحة المفاتيح
    // ═══════════════════════════════════════════
    document.addEventListener('keydown', (e) => {
        // Ctrl + Home → العودة للأعلى
        if (e.ctrlKey && e.key === 'Home') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    // ═══════════════════════════════════════════
    // 14. معلومات للمطورين
    // ═══════════════════════════════════════════
    console.log('%c🕌 سبيل الهدى', 'color: #d4af37; font-size: 20px; font-weight: bold;');
    console.log('%cمنصة إسلامية شاملة', 'color: #10b981; font-size: 14px;');
    console.log('%cنسأل الله الإخلاص والقبول', 'color: #94a3b8; font-size: 12px;');
// ═══════════════════════════════════════════
// حماية الصفحات (تحويل لصفحة الدخول)
// ═══════════════════════════════════════════
var protectedPages = []; // اتركها فارغة الآن، أو أضف صفحات:
// مثال: protectedPages = ['admin.html', 'dashboard.html'];

var currentPage = window.location.pathname.split('/').pop() || 'index.html';
var isProtected = protectedPages.some(function(p) {
    return currentPage.indexOf(p) !== -1;
});

if (isProtected && window.SabeelAuth && !window.SabeelAuth.isLoggedIn()) {
    window.location.href = 'login.html';
}
});
