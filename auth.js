/**
 * ═══════════════════════════════════════════════════════════════
 * سبيل الهدى | Sabeel Al-Huda
 * نظام الدخول - auth.js
 * ═══════════════════════════════════════════════════════════════
 * يتحكم في صفحة الدخول، والتحقق من الرمز، وحفظ الجلسة.
 * ═══════════════════════════════════════════════════════════════
 */

(function() {

    // ═══════════════════════════════════════════
    // الإعدادات
    // ═══════════════════════════════════════════
    const SESSION_KEY = 'sabeel_session';
    const SESSION_TIME_KEY = 'sabeel_session_time';
    const LAST_LOGIN_KEY = 'sabeel_last_login';
    const SESSION_DURATION = 60 * 60 * 1000; // ساعة واحدة

    // الحصول على الرمز من config.js
    function getPassword() {
        if (typeof siteConfig !== 'undefined' && siteConfig.settings && siteConfig.settings.loginPassword) {
            return siteConfig.settings.loginPassword;
        }
        return "11"; // افتراضي
    }

    // ═══════════════════════════════════════════
    // إدارة الجلسة
    // ═══════════════════════════════════════════
    function setSession() {
        try {
            localStorage.setItem(SESSION_KEY, 'active');
            localStorage.setItem(SESSION_TIME_KEY, Date.now().toString());
        } catch (e) {
            console.warn('⚠️ لا يمكن حفظ الجلسة:', e);
        }
    }

    function clearSession() {
        try {
            localStorage.removeItem(SESSION_KEY);
            localStorage.removeItem(SESSION_TIME_KEY);
        } catch (e) {}
    }

    function isSessionActive() {
        try {
            const session = localStorage.getItem(SESSION_KEY);
            const time = parseInt(localStorage.getItem(SESSION_TIME_KEY) || '0', 10);
            const now = Date.now();

            if (session === 'active' && (now - time) < SESSION_DURATION) {
                return true;
            }
            // الجلسة منتهية
            if (session === 'active') {
                clearSession();
            }
            return false;
        } catch (e) {
            return false;
        }
    }

    // ═══════════════════════════════════════════
    // التحقق إذا كنا في صفحة الدخول
    // ═══════════════════════════════════════════
    const isLoginPage = window.location.pathname.includes('login.html') ||
                        window.location.pathname.endsWith('/login') ||
                        window.location.pathname.endsWith('login');

    // ═══════════════════════════════════════════
    // إذا كنا في صفحة الدخول: تشغيل نموذج الدخول
    // ═══════════════════════════════════════════
    if (isLoginPage) {

        document.addEventListener('DOMContentLoaded', () => {

            // إذا كان المستخدم مسجلاً دخوله بالفعل → توجيه للرئيسية
            if (isSessionActive()) {
                window.location.href = 'index.html';
                return;
            }

            const form = document.getElementById('loginForm');
            const input = document.getElementById('passwordInput');
            const errorEl = document.getElementById('loginError');
            const toggleBtn = document.getElementById('togglePassword');

            if (!form || !input) return;

            // زر إظهار/إخفاء كلمة المرور
            if (toggleBtn) {
                toggleBtn.addEventListener('click', () => {
                    const isPassword = input.type === 'password';
                    input.type = isPassword ? 'text' : 'password';

                    // تغيير الأيقونة
                    toggleBtn.innerHTML = isPassword
                        ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`
                        : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
                });
            }

            // معالجة إرسال النموذج
            form.addEventListener('submit', (e) => {
                e.preventDefault();

                const enteredPassword = input.value.trim();
                const correctPassword = getPassword();

                // إخفاء الخطأ
                if (errorEl) errorEl.classList.remove('show');

                if (enteredPassword === correctPassword) {
                    // نجاح الدخول
                    setSession();
                    localStorage.setItem(LAST_LOGIN_KEY, Date.now().toString());

                    // تأثير نجاح
                    if (errorEl) {
                        errorEl.textContent = '✓ تم الدخول بنجاح';
                        errorEl.style.background = 'rgba(16, 185, 129, 0.1)';
                        errorEl.style.borderColor = 'rgba(16, 185, 129, 0.3)';
                        errorEl.style.color = '#34d399';
                        errorEl.classList.add('show');
                    }

                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 800);

                } else {
                    // فشل الدخول
                    if (errorEl) {
                        errorEl.textContent = '✕ الرمز غير صحيح';
                        errorEl.style.background = 'rgba(239, 68, 68, 0.1)';
                        errorEl.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                        errorEl.style.color = '#fca5a5';
                        errorEl.classList.add('show');
                    }

                    input.value = '';
                    input.focus();

                    // تأثير اهتزاز
                    form.style.animation = 'shake 0.4s';
                    setTimeout(() => form.style.animation = '', 400);
                }
            });

            // تركيز تلقائي على الخانة
            setTimeout(() => input.focus(), 300);

        });
    }

    // ═══════════════════════════════════════════
    // إذا لم نكن في صفحة الدخول: حماية الصفحات
    // ═══════════════════════════════════════════
    else {

        // قائمة الصفحات المحمية
        const protectedPages = [];
        // (اتركها فارغة الآن — إذا أردت حماية صفحة لاحقًا، أضف اسمها هنا)
        // مثال: protectedPages.push('admin.html');

        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const isProtected = protectedPages.some(p => currentPage.includes(p));

        if (isProtected && !isSessionActive()) {
            window.location.href = 'login.html';
        }

    }

    // ═══════════════════════════════════════════
    // كشف عام (للاستخدام من صفحات أخرى)
    // ═══════════════════════════════════════════
    window.SabeelAuth = {
        isLoggedIn: isSessionActive,
        login: setSession,
        logout: clearSession,
        getLastLogin: () => {
            const last = localStorage.getItem(LAST_LOGIN_KEY);
            return last ? new Date(parseInt(last, 10)) : null;
        }
    };

})();
