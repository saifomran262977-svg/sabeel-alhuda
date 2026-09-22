/**
 * ═══════════════════════════════════════════════════════════════
 * سبيل الهدى | Sabeel Al-Huda
 * نظام الدخول - auth.js
 * ═══════════════════════════════════════════════════════════════
 */

(function() {

    // ═══════════════════════════════════════════
    // الإعدادات
    // ═══════════════════════════════════════════
    var SESSION_KEY = 'sabeel_session';
    var SESSION_TIME_KEY = 'sabeel_session_time';
    var SESSION_DURATION = 60 * 60 * 1000; // ساعة

    // الرمز الافتراضي
    var DEFAULT_PASSWORD = "11";

    function getPassword() {
        try {
            if (typeof siteConfig !== 'undefined' &&
                siteConfig.settings &&
                siteConfig.settings.loginPassword) {
                return siteConfig.settings.loginPassword;
            }
        } catch (e) {}
        return DEFAULT_PASSWORD;
    }

    // ═══════════════════════════════════════════
    // إدارة الجلسة
    // ═══════════════════════════════════════════
    function setSession() {
        try {
            localStorage.setItem(SESSION_KEY, 'active');
            localStorage.setItem(SESSION_TIME_KEY, Date.now().toString());
        } catch (e) {}
    }

    function clearSession() {
        try {
            localStorage.removeItem(SESSION_KEY);
            localStorage.removeItem(SESSION_TIME_KEY);
        } catch (e) {}
    }

    function isSessionActive() {
        try {
            var session = localStorage.getItem(SESSION_KEY);
            var time = parseInt(localStorage.getItem(SESSION_TIME_KEY) || '0', 10);
            var now = Date.now();

            if (session === 'active' && (now - time) < SESSION_DURATION) {
                return true;
            }
            if (session === 'active') {
                clearSession();
            }
            return false;
        } catch (e) {
            return false;
        }
    }

    // ═══════════════════════════════════════════
    // التحقق من صفحة الدخول
    // ═══════════════════════════════════════════
    var path = window.location.pathname;
    var isLoginPage = path.indexOf('login.html') !== -1;

    // ═══════════════════════════════════════════
    // صفحة الدخول
    // ═══════════════════════════════════════════
    if (isLoginPage) {

        document.addEventListener('DOMContentLoaded', function() {

            // إذا كان مسجلاً بالفعل → الرئيسية
            if (isSessionActive()) {
                window.location.href = 'index.html';
                return;
            }

            var form = document.getElementById('loginForm');
            var input = document.getElementById('passwordInput');
            var errorEl = document.getElementById('loginError');
            var toggleBtn = document.getElementById('togglePassword');

            if (!form || !input) return;

            // زر إظهار/إخفاء الرمز
            if (toggleBtn) {
                toggleBtn.addEventListener('click', function() {
                    input.type = input.type === 'password' ? 'text' : 'password';
                });
            }

            // إرسال النموذج
            form.addEventListener('submit', function(e) {
                e.preventDefault();

                var entered = input.value.trim();
                var correct = getPassword();

                if (errorEl) {
                    errorEl.classList.remove('show');
                    errorEl.textContent = '';
                }

                if (entered === correct) {
                    // نجاح
                    setSession();

                    if (errorEl) {
                        errorEl.textContent = '✓ تم الدخول بنجاح';
                        errorEl.classList.add('show', 'success');
                    }

                    setTimeout(function() {
                        window.location.href = 'index.html';
                    }, 700);

                } else {
                    // فشل
                    if (errorEl) {
                        errorEl.textContent = '✕ الرمز غير صحيح';
                        errorEl.classList.add('show');
                    }

                    input.value = '';
                    input.focus();

                    form.style.animation = 'shake 0.4s';
                    setTimeout(function() { form.style.animation = ''; }, 400);
                }
            });

            setTimeout(function() { input.focus(); }, 300);

        });
    }

    // ═══════════════════════════════════════════
    // كشف عام
    // ═══════════════════════════════════════════
    window.SabeelAuth = {
        isLoggedIn: isSessionActive,
        login: setSession,
        logout: clearSession
    };

})();
