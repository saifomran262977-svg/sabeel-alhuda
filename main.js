/**
 * ═══════════════════════════════════════════════════════════════
 * سبيل الهدى | Sabeel Al-Huda
 * main.js - حل نهائي: إزالة Service Worker والكاش
 * ═══════════════════════════════════════════════════════════════
 */

(function() {
    'use strict';

    // ═══════════════════════════════════════════
    // 1. إلغاء Service Worker + مسح الكاش
    // ═══════════════════════════════════════════
    var CLEAN_FLAG = 'sabeel_cleaned_v3';

    if (!localStorage.getItem(CLEAN_FLAG)) {
        console.log('🧹 بدء التنظيف...');

        var cleanupDone = false;

        function finishCleanup() {
            if (cleanupDone) return;
            cleanupDone = true;
            localStorage.setItem(CLEAN_FLAG, 'true');
            console.log('✅ تم التنظيف، إعادة تحميل...');
            window.location.reload(true);
        }

        // 1. إلغاء كل Service Workers
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(function(regs) {
                var promises = regs.map(function(reg) {
                    console.log('🗑️ إلغاء SW:', reg.scope);
                    return reg.unregister();
                });
                return Promise.all(promises);
            }).then(function() {
                // 2. مسح كل الكاش
                if ('caches' in window) {
                    return caches.keys().then(function(names) {
                        return Promise.all(names.map(function(name) {
                            console.log('🗑️ حذف كاش:', name);
                            return caches.delete(name);
                        }));
                    });
                }
            }).then(finishCleanup).catch(finishCleanup);
        } else {
            finishCleanup();
        }

        // حماية: بعد 2 ثانية، أكمل حتى لو تعطل شيء
        setTimeout(finishCleanup, 2000);

        // إيقاف التنفيذ مؤقتًا حتى انتهاء التنظيف
        return;
    }

    // ═══════════════════════════════════════════
    // 2. إلغاء قيود التمرير
    // ═══════════════════════════════════════════
    function unlockScroll() {
        document.body.style.overflow = '';
        document.body.style.overflowX = '';
        document.body.style.overflowY = '';
        document.body.style.position = '';
        document.body.style.height = '';
        document.documentElement.style.overflow = '';
        document.documentElement.style.overflowX = '';
        document.documentElement.style.overflowY = '';
        document.documentElement.style.height = '';
        document.body.classList.remove('no-scroll', 'menu-open');
        document.documentElement.classList.remove('no-scroll', 'menu-open');
    }

    unlockScroll();

    // ═══════════════════════════════════════════
    // 3. إخفاء شاشة التحميل
    // ═══════════════════════════════════════════
    function hidePreloader() {
        var p = document.getElementById('preloader');
        if (p && p.parentNode) {
            p.style.opacity = '0';
            p.style.visibility = 'hidden';
            p.style.display = 'none';
            setTimeout(function() {
                if (p && p.parentNode) p.parentNode.removeChild(p);
            }, 500);
        }
    }

    setTimeout(hidePreloader, 1000);
    window.addEventListener('load', function() {
        unlockScroll();
        setTimeout(hidePreloader, 300);
    });

    // ═══════════════════════════════════════════
    // 4. القائمة الجانبية
    // ═══════════════════════════════════════════
    function initMenu() {
        var menuBtn = document.getElementById('menuBtn');
        var navMenu = document.getElementById('navMenu');
        var navOverlay = document.getElementById('navOverlay');

        if (!menuBtn || !navMenu) return;

        function openMenu() {
            navMenu.classList.add('active');
            if (navOverlay) navOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeMenu() {
            navMenu.classList.remove('active');
            if (navOverlay) navOverlay.classList.remove('active');
            unlockScroll();
        }

        menuBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (navMenu.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        };

        if (navOverlay) navOverlay.onclick = closeMenu;

        navMenu.querySelectorAll('a').forEach(function(link) {
            link.onclick = closeMenu;
        });
    }

    // ═══════════════════════════════════════════
    // 5. الميزات الأخرى
    // ═══════════════════════════════════════════
    function initFeatures() {
        // السنة
        var yearEl = document.getElementById('year');
        if (yearEl) yearEl.textContent = new Date().getFullYear();

        // زر المظهر
        var themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            try {
                if (localStorage.getItem('sabeel_theme') === 'light') {
                    document.body.classList.add('light-mode');
                }
            } catch (e) {}
            themeToggle.onclick = function() {
                document.body.classList.toggle('light-mode');
                try {
                    localStorage.setItem('sabeel_theme',
                        document.body.classList.contains('light-mode') ? 'light' : 'dark');
                } catch (e) {}
            };
        }

        // زر الأعلى
        var backToTop = document.getElementById('backToTop');
        if (backToTop) {
            var ticking = false;
            window.addEventListener('scroll', function() {
                if (!ticking) {
                    window.requestAnimationFrame(function() {
                        if (window.pageYOffset > 300) backToTop.classList.add('visible');
                        else backToTop.classList.remove('visible');
                        ticking = false;
                    });
                    ticking = true;
                }
            }, { passive: true });
            backToTop.onclick = function() {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            };
        }

        // شريط التقدم
        var scrollProgress = document.getElementById('scrollProgress');
        if (scrollProgress) {
            window.addEventListener('scroll', function() {
                var st = window.pageYOffset || document.documentElement.scrollTop;
                var dh = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                scrollProgress.style.width = (dh > 0 ? (st / dh) * 100 : 0) + '%';
            }, { passive: true });
        }

        // الاقتباسات
        if (typeof siteConfig !== 'undefined' && siteConfig.quotes && siteConfig.quotes.length > 0) {
            var qs = document.querySelector('.quote-section');
            if (qs) {
                var qt = qs.querySelector('.quote-text');
                var qa = qs.querySelector('.quote-author');
                if (qt && qa) {
                    var rq = siteConfig.quotes[Math.floor(Math.random() * siteConfig.quotes.length)];
                    qt.textContent = rq.text;
                    qa.textContent = '— ' + rq.ref;
                }
            }
        }
    }

    // ═══════════════════════════════════════════
    // 6. التشغيل
    // ═══════════════════════════════════════════
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initMenu();
            initFeatures();
        });
    } else {
        initMenu();
        initFeatures();
    }

})();
