/**
 * ═══════════════════════════════════════════════════════════════
 * سبيل الهدى | Sabeel Al-Huda
 * main.js — الحل النهائي المضمون
 * ═══════════════════════════════════════════════════════════════
 * يحقن CSS إصلاحي في الصفحة + يُفعّل اللمس والتمرير
 * ═══════════════════════════════════════════════════════════════
 */

(function() {
    'use strict';

    // ═══════════════════════════════════════════
    // 1. حقن CSS فوري لتفعيل اللمس (قبل أي شيء)
    // ═══════════════════════════════════════════
    function injectFixCSS() {
        // حذف أي حقن سابق
        var old = document.getElementById('sabeel-fix-css');
        if (old) old.remove();

        var style = document.createElement('style');
        style.id = 'sabeel-fix-css';
        style.textContent = [
            '/* تفعيل اللمس والتمرير بكل أشكاله */',
            'html, body {',
            '    touch-action: auto !important;',
            '    -webkit-touch-callout: default !important;',
            '    user-select: auto !important;',
            '    -webkit-user-select: auto !important;',
            '    overflow-y: auto !important;',
            '    overflow-x: hidden !important;',
            '    position: static !important;',
            '    height: auto !important;',
            '    min-height: 100vh !important;',
            '    width: 100% !important;',
            '    max-width: 100% !important;',
            '}',
            'body {',
            '    -webkit-overflow-scrolling: touch !important;',
            '    overscroll-behavior-y: auto !important;',
            '}',
            '*, *::before, *::after {',
            '    touch-action: auto !important;',
            '    -webkit-touch-callout: default !important;',
            '    user-select: auto !important;',
            '    -webkit-user-select: auto !important;',
            '}',
            'a, button, .cat-btn, .filter-btn, .tab-btn {',
            '    touch-action: manipulation !important;',
            '}',
            'main, .hero, .section, .cards-grid, .card-item, .tool-item {',
            '    touch-action: auto !important;',
            '    overflow: visible !important;',
            '}',
            '/* القائمة الجانبية */',
            '.nav-menu:not(.active) {',
            '    pointer-events: none !important;',
            '    visibility: hidden !important;',
            '}',
            '.nav-menu.active {',
            '    pointer-events: auto !important;',
            '    visibility: visible !important;',
            '    touch-action: pan-y !important;',
            '}',
            '.nav-menu a {',
            '    touch-action: manipulation !important;',
            '}',
            '/* إلغاء أي position: fixed على body */',
            'body.menu-open, body.no-scroll {',
            '    position: static !important;',
            '    overflow: auto !important;',
            '    height: auto !important;',
            '}',
      
'    * {',
'        scroll-behavior: auto !important;',
'    }',
        ].join('\n');
// ═══ تحسين أداء القوائم الطويلة ═══
style.textContent += '\n' + [
    '@media (max-width: 1024px), (hover: none), (pointer: coarse) {',

    '    /* تعطيل حركة الدخول على البطاقات */',
    '    .hadith-card, .athkar-card, .news-card, .scholar-card,',
    '    .book-card, .brother-card, .card-item, .tool-item {',
    '        animation: none !important;',
    '        transition: none !important;',
    '        opacity: 1 !important;',
    '        transform: none !important;',
    '        will-change: auto !important;',
    '        contain: layout paint style !important;',
    '    }',

    '    /* تعطيل تأثير اللمعان على البطاقات */',
    '    .hadith-card::before, .athkar-card::before, .news-card::before,',
    '    .scholar-card::before, .book-card::before, .brother-card::before,',
    '    .card-item::before, .tool-item::before {',
    '        display: none !important;',
    '    }',

    '    /* تعطيل الشريط الجانبي الملون */',
    '    .hadith-card::after, .athkar-card::after, .news-card::after,',
    '    .scholar-card::after, .book-card::after {',
    '        display: none !important;',
    '    }',

    '    /* تعطيل كل الحركات داخل البطاقات */',
    '    .hadith-card *, .athkar-card *, .news-card *, .scholar-card * {',
    '        animation: none !important;',
    '        transition: none !important;',
    '    }',

    '    /* تعطيل الظلال */',
    '    .hadith-card, .athkar-card, .news-card, .scholar-card {',
    '        box-shadow: none !important;',
    '    }',

    '    /* تحسين رسم النصوص */',
    '    .hadith-text, .athkar-text, .news-content {',
    '        text-rendering: optimizeSpeed !important;',
    '        -webkit-font-smoothing: auto !important;',
    '    }',

    '    /* تسريع القوائم الطويلة */',
    '    .hadith-list, .athkar-list, .news-list, .scholars-grid {',
    '        contain: layout style !important;',
    '    }',
    '}',
].join('\n');
        document.head.appendChild(style);
    }

    // تنفيذ فوري
    injectFixCSS();

    // إعادة الحقن عند أي تغيير في الصفحة
    window.addEventListener('pageshow', injectFixCSS);
    window.addEventListener('focus', function() {
        setTimeout(injectFixCSS, 100);
    });

    // ═══════════════════════════════════════════
    // 2. إلغاء أي قيود برمجية
    // ═══════════════════════════════════════════
    function forceUnlock() {
        try {
            // إزالة inline styles التي قد تكون عالقة
            document.body.style.removeProperty('overflow');
            document.body.style.removeProperty('overflow-x');
            document.body.style.removeProperty('overflow-y');
            document.body.style.removeProperty('position');
            document.body.style.removeProperty('height');
            document.body.style.removeProperty('width');
            document.documentElement.style.removeProperty('overflow');
            document.documentElement.style.removeProperty('overflow-x');
            document.documentElement.style.removeProperty('overflow-y');
            document.documentElement.style.removeProperty('height');

            // إزالة الكلاسات العالقة
            document.body.classList.remove('no-scroll', 'menu-open', 'locked');
            document.documentElement.classList.remove('no-scroll', 'menu-open', 'locked');
        } catch (e) {}
    }

    // تنفيذ فوري + عند أي حدث
    forceUnlock();
    window.addEventListener('pageshow', forceUnlock);
    window.addEventListener('load', forceUnlock);
    window.addEventListener('focus', function() {
        setTimeout(forceUnlock, 100);
    });

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
        setTimeout(hidePreloader, 300);
    });

    // ═══════════════════════════════════════════
    // 4. القائمة الجانبية (بدون تجميد)
    // ═══════════════════════════════════════════
    function initMenu() {
        var menuBtn = document.getElementById('menuBtn');
        var navMenu = document.getElementById('navMenu');
        var navOverlay = document.getElementById('navOverlay');

        if (!menuBtn || !navMenu) return;

        function openMenu() {
            navMenu.classList.add('active');
            if (navOverlay) navOverlay.classList.add('active');
        }

        function closeMenu() {
            navMenu.classList.remove('active');
            if (navOverlay) navOverlay.classList.remove('active');
            forceUnlock();
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
        var yearEl = document.getElementById('year');
        if (yearEl) yearEl.textContent = new Date().getFullYear();

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

        var sp = document.getElementById('scrollProgress');
        if (sp) {
            window.addEventListener('scroll', function() {
                var st = window.pageYOffset || document.documentElement.scrollTop;
                var dh = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                sp.style.width = (dh > 0 ? (st / dh) * 100 : 0) + '%';
            }, { passive: true });
        }

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
            injectFixCSS();
            forceUnlock();
            initMenu();
            initFeatures();
        });
    } else {
        initMenu();
        initFeatures();
    }

})();
