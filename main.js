/**
 * ═══════════════════════════════════════════════════════════════
 * سبيل الهدى | Sabeel Al-Huda
 * المحرك الرئيسي - main.js
 * ═══════════════════════════════════════════════════════════════
 * يتحكم في تفاعلات المنصة، وبناء العناصر الديناميكية.
 * يعتمد على البيانات الموجودة في config.js
 * ═══════════════════════════════════════════════════════════════
 */

document.addEventListener('DOMContentLoaded', () => {

    // ═══════════════════════════════════════════
    // 1. إخفاء شاشة التحميل
    // ═══════════════════════════════════════════
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('hidden');
                setTimeout(() => {
                    if (preloader.parentNode) {
                        preloader.parentNode.removeChild(preloader);
                    }
                }, 800);
            }, 400);
        });
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
        // استعادة التفضيل المحفوظ
        const savedTheme = localStorage.getItem('sabeel_theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-mode');
        }

        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            const isLight = document.body.classList.contains('light-mode');
            localStorage.setItem('sabeel_theme', isLight ? 'light' : 'dark');

            // تحديث theme-color
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
    // 7. تحميل الاقتباسات ديناميكيًا (من config.js)
    // ═══════════════════════════════════════════
    const quoteSection = document.querySelector('.quote-section');
    if (quoteSection && typeof siteConfig !== 'undefined' && siteConfig.quotes) {
        const quoteText = quoteSection.querySelector('.quote-text');
        const quoteAuthor = quoteSection.querySelector('.quote-author');

        if (quoteText && quoteAuthor && siteConfig.quotes.length > 0) {
            // اختيار اقتباس عشوائي
            const randomQuote = siteConfig.quotes[Math.floor(Math.random() * siteConfig.quotes.length)];
            quoteText.textContent = randomQuote.text;
            quoteAuthor.textContent = "— " + randomQuote.ref;

            // تغيير الاقتباس كل 30 ثانية
            let currentQuoteIndex = siteConfig.quotes.indexOf(randomQuote);
            setInterval(() => {
                currentQuoteIndex = (currentQuoteIndex + 1) % siteConfig.quotes.length;
                const nextQuote = siteConfig.quotes[currentQuoteIndex];

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

    // ═══════════════════════════════════════════
    // 8. تأثيرات الظهور عند التمرير
    // ═══════════════════════════════════════════
    if ('IntersectionObserver' in window) {
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
        // تحديث عنوان الصفحة
        if (siteConfig.site && siteConfig.site.name) {
            const titleTag = document.querySelector('title');
            if (titleTag && !titleTag.textContent.includes(siteConfig.site.name)) {
                titleTag.textContent = siteConfig.site.name + ' | ' + siteConfig.site.tagline;
            }
        }

        // تحديث اسم المنصة في الترويسة
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
    // 10. تفعيل PWA (Service Worker) — لاحقًا
    // ═══════════════════════════════════════════
    // سيتم إضافته في المرحلة النهائية بعد إنشاء sw.js و manifest.json

    // ═══════════════════════════════════════════
    // 11. اختصارات لوحة المفاتيح
    // ═══════════════════════════════════════════
    document.addEventListener('keydown', (e) => {
        // Ctrl + Home → العودة للأعلى
        if (e.ctrlKey && e.key === 'Home') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    // ═══════════════════════════════════════════
    // 12. معلومات للمطورين (اختياري)
    // ═══════════════════════════════════════════
    console.log('%c🕌 سبيل الهدى', 'color: #d4af37; font-size: 20px; font-weight: bold;');
    console.log('%cمنصة إسلامية شاملة', 'color: #10b981; font-size: 14px;');
    console.log('%cنسأل الله الإخلاص والقبول', 'color: #94a3b8; font-size: 12px;');

});
