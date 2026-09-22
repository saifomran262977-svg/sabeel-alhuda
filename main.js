/**
 * ═══════════════════════════════════════════════════════════════
 * سبيل الهدى | Sabeel Al-Huda
 * main.js - الحل النهائي
 * ═══════════════════════════════════════════════════════════════
 * هذا الملف يُصلح كل مشاكل التمرير والقائمة تلقائياً.
 * لا يحتاج أي تعديل على ملفات أخرى.
 * ═══════════════════════════════════════════════════════════════
 */

(function() {
    'use strict';

    // ═══════════════════════════════════════════
    // 1. إلغاء أي قيود على التمرير فوراً
    // ═══════════════════════════════════════════
    function unlockScroll() {
        document.body.style.overflow = 'auto';
        document.body.style.overflowX = 'hidden';
        document.body.style.overflowY = 'auto';
        document.body.style.position = 'static';
        document.body.style.height = 'auto';
        document.body.style.width = 'auto';
        document.documentElement.style.overflow = 'auto';
        document.documentElement.style.overflowX = 'hidden';
        document.documentElement.style.overflowY = 'auto';
        document.documentElement.style.height = 'auto';
        document.body.classList.remove('no-scroll', 'menu-open');
        document.documentElement.classList.remove('no-scroll', 'menu-open');
    }

    // تنفيذ فوري
    unlockScroll();

    // ═══════════════════════════════════════════
    // 2. إخفاء شاشة التحميل
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

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            unlockScroll();
            setTimeout(hidePreloader, 800);
        });
    } else {
        unlockScroll();
        setTimeout(hidePreloader, 800);
    }

    setTimeout(hidePreloader, 1500);
    window.addEventListener('load', function() {
        unlockScroll();
        setTimeout(hidePreloader, 300);
    });

    // ═══════════════════════════════════════════
    // 3. القائمة الجانبية
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

        if (navOverlay) {
            navOverlay.onclick = closeMenu;
        }

        navMenu.querySelectorAll('a').forEach(function(link) {
            link.onclick = closeMenu;
        });

        // إغلاق بزر Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') closeMenu();
        });
    }

    // ═══════════════════════════════════════════
    // 4. باقي الميزات
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

        // معلومات المنصة
        if (typeof siteConfig !== 'undefined' && siteConfig.site) {
            var bt = document.querySelector('.logo-text h1');
            if (bt && siteConfig.site.name) bt.textContent = siteConfig.site.name;
            var bs = document.querySelector('.logo-text p');
            if (bs && siteConfig.site.tagline) bs.textContent = siteConfig.site.tagline;
        }
    }

    // ═══════════════════════════════════════════
    // 5. التشغيل
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

    // فك التمرير عند أي تغيير في الصفحة
    window.addEventListener('pageshow', unlockScroll);
    window.addEventListener('focus', function() {
        setTimeout(unlockScroll, 100);
    });

})();
