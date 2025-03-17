// Security Middleware
const SecurityMiddleware = {
    // CSRF Token Management
    csrfToken: {
        generate() {
            return Array.from(crypto.getRandomValues(new Uint8Array(32)))
                .map(b => b.toString(16).padStart(2, '0'))
                .join('');
        },
        
        set() {
            const token = this.generate();
            localStorage.setItem('csrf_token', token);
            document.cookie = `csrf_token=${token}; path=/; Secure; SameSite=Strict`;
            return token;
        },
        
        get() {
            return localStorage.getItem('csrf_token');
        },
        
        validate(token) {
            return token === this.get() && token === this.getCookie('csrf_token');
        },

        getCookie(name) {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
            return null;
        }
    },

    // Rate Limiting with IP-based tracking
    rateLimiter: {
        attempts: {},
        ipAttempts: new Map(),
        
        async check(action, maxAttempts = 5, timeWindow = 300000) { // 5 minutes window
            const now = Date.now();
            const key = `${action}_${now}`;
            
            try {
                // Get client IP (if available through a service)
                const ipResponse = await fetch('https://api.ipify.org?format=json');
                const { ip } = await ipResponse.json();
                const ipKey = `${ip}_${action}`;
                
                // Clean up old attempts
                this.cleanupAttempts(now, timeWindow);
                
                // Check IP-based attempts
                const ipAttempts = this.ipAttempts.get(ipKey) || [];
                const recentIpAttempts = ipAttempts.filter(timestamp => now - timestamp < timeWindow);
                
                if (recentIpAttempts.length >= maxAttempts) {
                    console.warn(`Rate limit exceeded for IP ${ip} on action ${action}`);
                    return false;
                }
                
                // Record new IP attempt
                recentIpAttempts.push(now);
                this.ipAttempts.set(ipKey, recentIpAttempts);
                
            } catch (error) {
                console.warn('IP-based rate limiting unavailable:', error);
            }
            
            // Fallback to session-based rate limiting
            const recentAttempts = Object.values(this.attempts)
                .filter(a => a.action === action && now - a.timestamp < timeWindow)
                .length;
                
            if (recentAttempts >= maxAttempts) {
                return false;
            }
            
            // Record new attempt
            this.attempts[key] = { action, timestamp: now };
            return true;
        },

        cleanupAttempts(now, timeWindow) {
            // Clean up session attempts
            Object.keys(this.attempts).forEach(k => {
                if (now - this.attempts[k].timestamp > timeWindow) {
                    delete this.attempts[k];
                }
            });
            
            // Clean up IP attempts
            this.ipAttempts.forEach((attempts, key) => {
                const filtered = attempts.filter(timestamp => now - timestamp < timeWindow);
                if (filtered.length === 0) {
                    this.ipAttempts.delete(key);
                } else {
                    this.ipAttempts.set(key, filtered);
                }
            });
        }
    },

    // Input Sanitization and Validation
    sanitizer: {
        escapeHTML(str) {
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        },
        
        sanitizeInput(input) {
            if (typeof input !== 'string') return input;
            
            // Remove potentially dangerous characters
            let sanitized = input.trim()
                .replace(/[<>]/g, '') // Remove < and >
                .replace(/javascript:/gi, '') // Remove javascript: protocol
                .replace(/data:/gi, '') // Remove data: protocol
                .replace(/on\w+=/gi, '') // Remove event handlers
                .replace(/eval\((.*?)\)/gi, '') // Remove eval()
                .replace(/expression\((.*?)\)/gi, '') // Remove expression()
                .replace(/vbscript:/gi, ''); // Remove vbscript: protocol
            
            return this.escapeHTML(sanitized);
        },
        
        validateEmail(email) {
            // RFC 5322 compliant email regex
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        },

        validatePassword(password) {
            // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
            const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            return re.test(password);
        }
    },

    // Content Security and Access Control
    contentSecurity: {
        protectedPaths: [
            '/dashboard/',
            '/books/',
            '/tools/',
            '/courses/',
            '/community/',
            '/documentation/'
        ],
        
        adminPaths: [
            '/admin/',
            '/documentation/edit/'
        ],
        
        isProtectedPath(path) {
            return this.protectedPaths.some(p => path.startsWith(p));
        },
        
        isAdminPath(path) {
            return this.adminPaths.some(p => path.startsWith(p));
        },
        
        checkAccess() {
            const currentPath = window.location.pathname;
            const token = localStorage.getItem('auth_token');
            const userRole = localStorage.getItem('user_role');

            if (this.isProtectedPath(currentPath) && !token) {
                window.location.href = '/auth/login.html';
                return false;
            }

            if (this.isAdminPath(currentPath) && userRole !== 'admin') {
                window.location.href = '/dashboard/index.html';
                return false;
            }

            return true;
        }
    },

    // Anti-Scraping Protection
    antiScraping: {
        lastAccess: {},
        
        check(userId, resourceType) {
            const now = Date.now();
            const key = `${userId}_${resourceType}`;
            const lastTime = this.lastAccess[key] || 0;
            const minInterval = 1000; // 1 second minimum between requests
            
            if (now - lastTime < minInterval) {
                console.warn(`Potential scraping detected for user ${userId} on ${resourceType}`);
                return false;
            }
            
            this.lastAccess[key] = now;
            return true;
        }
    },

    // reCAPTCHA Integration
    recaptcha: {
        async verify() {
            try {
                const token = await grecaptcha.execute('YOUR_SITE_KEY', {action: 'submit'});
                return token;
            } catch (error) {
                console.error('reCAPTCHA verification failed:', error);
                return null;
            }
        }
    },

    // Initialize Security Features
    init() {
        // Set CSRF token
        const csrfToken = this.csrfToken.set();
        document.querySelectorAll('form').forEach(form => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = '_csrf';
            input.value = csrfToken;
            form.appendChild(input);
        });

        // Add security headers
        this.addSecurityHeaders();

        // Check access control
        this.contentSecurity.checkAccess();

        // Initialize form protection
        this.initFormProtection();
    },

    // Add Security Headers
    addSecurityHeaders() {
        // These headers will be added server-side, but we can also check them client-side
        const requiredHeaders = {
            'Content-Security-Policy': "default-src 'self'; script-src 'self' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com/; img-src 'self' data: https:; font-src 'self' https://cdnjs.cloudflare.com/; connect-src 'self' https://api.ipify.org;",
            'X-Frame-Options': 'DENY',
            'X-Content-Type-Options': 'nosniff',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
        };

        // Log warning if any security headers are missing
        fetch(window.location.href).then(response => {
            Object.entries(requiredHeaders).forEach(([header, value]) => {
                if (!response.headers.get(header)) {
                    console.warn(`Missing security header: ${header}`);
                }
            });
        });
    },

    // Initialize Form Protection
    initFormProtection() {
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();

                // Verify reCAPTCHA
                const recaptchaToken = await this.recaptcha.verify();
                if (!recaptchaToken) {
                    console.error('reCAPTCHA verification failed');
                    return;
                }

                // Check rate limiting
                const canSubmit = await this.rateLimiter.check('form_submit');
                if (!canSubmit) {
                    console.error('Rate limit exceeded');
                    return;
                }

                // Validate CSRF token
                const formToken = form.querySelector('[name="_csrf"]')?.value;
                if (!this.csrfToken.validate(formToken)) {
                    console.error('Invalid CSRF token');
                    return;
                }

                // Sanitize form inputs
                const formData = new FormData(form);
                for (let [key, value] of formData.entries()) {
                    formData.set(key, this.sanitizer.sanitizeInput(value));
                }

                // Submit the form
                form.submit();
            });
        });
    }
};

// Initialize security features
document.addEventListener('DOMContentLoaded', () => {
    SecurityMiddleware.init();
});
