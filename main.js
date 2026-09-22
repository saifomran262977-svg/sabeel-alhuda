/**
 * ═══════════════════════════════════════════════════════════════
 * سبيل الهدى | Sabeel Al-Huda
 * المحرك الرئيسي - main.js (النسخة النهائية)
 * ═══════════════════════════════════════════════════════════════
 */

console.log('✅ [main.js] تم التحميل');

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ [main.js] DOM جاهز');

    // ═══════════════════════════════════════════
    // 1. إخفاء شاشة التحميل
    // ═══════════════════════════════════════════
    var preloader = document.getElementById('preloader');
    function hidePreloader() {
        if (preloader && preloader.parentNode) {
            preloader.classList.add('hidden');
            setTimeout(function() {
                if (preloader && preloader.parentNode) {
                    preloader.parentNode.removeChild(preloader);
                }
            }, 500);
        }
    }
    setTimeout(hidePreloader, 1200);
    window.addEventListener('load', function() {
        setTimeout(hidePreloader, 300);
    });

    // ═══════════════════════════════════════════
    // 2. شريط تقدم التمرير
    // ═══════════════════════════════════════════
    var scrollProgress = document.getElementById('scrollProgress');
    if (scrollProgress) {
        var ticking = false;
        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                    var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
                    scrollProgress.style.width = progress + '%';
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    
// ═══════════════════════════════════════════
// 3. القائمة الجانبية
// ═══════════════════════════════════════════
var menuBtn = document.getElementById('menuBtn');
var navMenu = document.getElementById('navMenu');
var navOverlay = document.getElementById('navOverlay');

function openMenu() {
    if (navMenu) navMenu.classList.add('active');
    if (navOverlay) navOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
}

function closeMenu() {
    if (navMenu) navMenu.classList.remove('active');
    if (navOverlay) navOverlay.classList.remove('active');
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
}

if (menuBtn) {
    menuBtn.onclick = function(e) {
        e.preventDefault();
        if (navMenu && navMenu.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    };
}

if (navOverlay) {
    navOverlay.onclick = closeMenu;
}

if (navMenu) {
    navMenu.querySelectorAll('a').forEach(function(link) {
        link.onclick = closeMenu;
    });
}
    

    // ═══════════════════════════════════════════
    // 4. زر تغيير المظهر
    // ═══════════════════════════════════════════
    var themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        try {
            var savedTheme = localStorage.getItem('sabeel_theme');
            if (savedTheme === 'light') document.body.classList.add('light-mode');
        } catch (e) {}

        themeToggle.onclick = function() {
            document.body.classList.toggle('light-mode');
            var isLight = document.body.classList.contains('light-mode');
            try { localStorage.setItem('sabeel_theme', isLight ? 'light' : 'dark'); } catch (e) {}
        };
    }

    // ═══════════════════════════════════════════
    // 5. السنة
    // ═══════════════════════════════════════════
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // ═══════════════════════════════════════════
    // 6. زر العودة للأعلى
    // ═══════════════════════════════════════════
    var backToTop = document.getElementById('backToTop');
    if (backToTop) {
        var btTicking = false;
        window.addEventListener('scroll', function() {
            if (!btTicking) {
                window.requestAnimationFrame(function() {
                    if (window.pageYOffset > 300) backToTop.classList.add('visible');
                    else backToTop.classList.remove('visible');
                    btTicking = false;
                });
                btTicking = true;
            }
        }, { passive: true });

        backToTop.onclick = function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
    }

    // ═══════════════════════════════════════════
    // 7. الاقتباسات
    // ═══════════════════════════════════════════
    if (typeof siteConfig !== 'undefined' && siteConfig.quotes && siteConfig.quotes.length > 0) {
        var quoteSection = document.querySelector('.quote-section');
        if (quoteSection) {
            var quoteText = quoteSection.querySelector('.quote-text');
            var quoteAuthor = quoteSection.querySelector('.quote-author');
            if (quoteText && quoteAuthor) {
                var rq = siteConfig.quotes[Math.floor(Math.random() * siteConfig.quotes.length)];
                quoteText.textContent = rq.text;
                quoteAuthor.textContent = "— " + rq.ref;
            }
        }
    }

    // ═══════════════════════════════════════════
    // 8. معلومات المنصة
    // ═══════════════════════════════════════════
    if (typeof siteConfig !== 'undefined' && siteConfig.site) {
        var brandTitle = document.querySelector('.logo-text h1');
        if (brandTitle && siteConfig.site.name) brandTitle.textContent = siteConfig.site.name;
        var brandSubtitle = document.querySelector('.logo-text p');
        if (brandSubtitle && siteConfig.site.tagline) brandSubtitle.textContent = siteConfig.site.tagline;
    }

    console.log('✅ [main.js] جاهز');

});
