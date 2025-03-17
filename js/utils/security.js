// Security Utilities
class SecurityUtils {
    constructor() {
        this.setupCSRFProtection();
        this.setupXSSProtection();
    }

    // CSRF Protection
    setupCSRFProtection() {
        // Add CSRF token to all AJAX requests
        document.addEventListener('DOMContentLoaded', () => {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
            if (csrfToken) {
                document.querySelectorAll('form').forEach(form => {
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = '_csrf';
                    input.value = csrfToken;
                    form.appendChild(input);
                });
            }
        });
    }

    // XSS Protection
    setupXSSProtection() {
        // Sanitize HTML content
        window.sanitizeHTML = (dirty) => {
            const clean = dirty.replace(/[&<>"'/]/g, char => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;',
                '/': '&#x2F;'
            })[char]);
            return clean;
        };

        // Override innerHTML to use sanitized content
        const originalInnerHTML = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
        Object.defineProperty(Element.prototype, 'innerHTML', {
            set(value) {
                const sanitized = window.sanitizeHTML(value);
                originalInnerHTML.set.call(this, sanitized);
            }
        });
    }

    // Content Security Policy
    setupCSP() {
        const meta = document.createElement('meta');
        meta.httpEquiv = 'Content-Security-Policy';
        meta.content = `
            default-src 'self';
            script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com;
            style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com;
            img-src 'self' data: https:;
            font-src 'self' https://fonts.gstatic.com;
            connect-src 'self' https://api.githacks.com;
        `;
        document.head.appendChild(meta);
    }

    // Input Validation
    validateInput(input, rules) {
        const errors = [];
        
        for (const rule of rules) {
            switch (rule.type) {
                case 'required':
                    if (!input.trim()) {
                        errors.push('This field is required');
                    }
                    break;
                case 'email':
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(input)) {
                        errors.push('Invalid email format');
                    }
                    break;
                case 'password':
                    if (input.length < 8) {
                        errors.push('Password must be at least 8 characters');
                    }
                    if (!/[A-Z]/.test(input)) {
                        errors.push('Password must contain uppercase letter');
                    }
                    if (!/[a-z]/.test(input)) {
                        errors.push('Password must contain lowercase letter');
                    }
                    if (!/[0-9]/.test(input)) {
                        errors.push('Password must contain number');
                    }
                    break;
                case 'regex':
                    if (!rule.pattern.test(input)) {
                        errors.push(rule.message || 'Invalid format');
                    }
                    break;
            }
        }

        return errors;
    }

    // Rate Limiting
    createRateLimiter(limit = 10, windowMs = 60000) {
        const requests = new Map();

        return (key) => {
            const now = Date.now();
            const windowStart = now - windowMs;
            
            // Clean old requests
            requests.forEach((timestamp, reqKey) => {
                if (timestamp < windowStart) {
                    requests.delete(reqKey);
                }
            });

            // Get requests in current window
            const userRequests = Array.from(requests.entries())
                .filter(([reqKey, timestamp]) => 
                    reqKey.startsWith(key) && timestamp > windowStart
                ).length;

            if (userRequests >= limit) {
                throw new Error('Rate limit exceeded');
            }

            requests.set(`${key}_${now}`, now);
            return true;
        };
    }

    // Session Management
    manageSession() {
        // Check session activity
        let lastActivity = Date.now();
        const sessionTimeout = 30 * 60 * 1000; // 30 minutes

        document.addEventListener('mousemove', () => {
            lastActivity = Date.now();
        });

        setInterval(() => {
            if (Date.now() - lastActivity > sessionTimeout) {
                // Session expired
                this.logout();
            }
        }, 60000); // Check every minute
    }

    // Logout function
    logout() {
        localStorage.removeItem('authToken');
        window.location.href = '/auth/login.html';
    }
}

// Create and export security utils instance
const securityUtils = new SecurityUtils();
export default securityUtils;
