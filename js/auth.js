// Constants and Configuration
const API_BASE_URL = 'https://api.githacks.com';
const AUTH_CONFIG = {
    TOKEN_KEY: 'githacks_auth_token',
    USER_KEY: 'githacks_user',
    THEME_KEY: 'githacks_theme',
    SESSION_DURATION: 7 * 24 * 60 * 60 * 1000, // 7 days
    REDIRECT_DELAY: 1500,
    PASSWORD_MIN_LENGTH: 8,
    PASSWORD_REQUIREMENTS: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecial: true
    }
};

// Auth Class - Handles all authentication related functionality
class Auth {
    static instance = null;

    constructor() {
        if (Auth.instance) {
            return Auth.instance;
        }
        Auth.instance = this;

        this.isAuthenticated = false;
        this.user = null;
        this.token = null;
        this.theme = localStorage.getItem(AUTH_CONFIG.THEME_KEY) || 'dark';
        
        this.init();
    }

    async init() {
        this.setupTheme();
        await this.checkAuth();
        this.setupEventListeners();
    }

    setupTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.checked = this.theme === 'dark';
            themeToggle.addEventListener('change', () => this.toggleTheme());
        }
    }

    toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem(AUTH_CONFIG.THEME_KEY, this.theme);
    }

    async checkAuth() {
        const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
        const user = JSON.parse(localStorage.getItem(AUTH_CONFIG.USER_KEY));
        
        if (token && user) {
            try {
                const response = await this.validateToken(token);
                if (response.valid) {
                    this.setAuthState(token, user);
                    return true;
                }
            } catch (error) {
                console.error('Token validation failed:', error);
            }
            this.clearAuth();
        }
        return false;
    }

    async validateToken(token) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/validate`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Token validation error:', error);
            return { valid: false };
        }
    }

    setAuthState(token, user) {
        this.isAuthenticated = true;
        this.token = token;
        this.user = user;
        localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, token);
        localStorage.setItem(AUTH_CONFIG.USER_KEY, JSON.stringify(user));
        this.updateUIForAuthState(true);
    }

    clearAuth() {
        this.isAuthenticated = false;
        this.token = null;
        this.user = null;
        localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
        localStorage.removeItem(AUTH_CONFIG.USER_KEY);
        this.updateUIForAuthState(false);
    }

    updateUIForAuthState(isAuthenticated) {
        const authElements = document.querySelectorAll('[data-auth]');
        authElements.forEach(element => {
            const showWhen = element.dataset.auth;
            element.style.display = 
                (showWhen === 'authenticated' && isAuthenticated) ||
                (showWhen === 'unauthenticated' && !isAuthenticated)
                    ? 'block' 
                    : 'none';
        });
    }

    setupEventListeners() {
        // Login Form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleLogin(e.target);
            });
        }

        // Signup Form
        const signupForm = document.getElementById('signupForm');
        if (signupForm) {
            signupForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleSignup(e.target);
            });
        }

        // Logout Button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        // Form Validation
        this.setupFormValidation();
    }

    setupFormValidation() {
        const forms = document.querySelectorAll('form[data-validate]');
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input[required]');
            inputs.forEach(input => {
                input.addEventListener('input', () => this.validateInput(input));
                input.addEventListener('blur', () => this.validateInput(input));
            });
        });
    }

    validateInput(input) {
        const value = input.value.trim();
        const type = input.type;
        let isValid = true;
        let message = '';

        switch (type) {
            case 'email':
                isValid = this.isValidEmail(value);
                message = isValid ? '' : 'Please enter a valid email address';
                break;
            case 'password':
                if (input.dataset.validate === 'newPassword') {
                    const result = this.validatePassword(value);
                    isValid = result.isValid;
                    message = result.message;
                    this.updatePasswordStrength(value);
                }
                break;
            default:
                isValid = value.length > 0;
                message = isValid ? '' : 'This field is required';
        }

        this.updateInputValidation(input, isValid, message);
        return isValid;
    }

    updateInputValidation(input, isValid, message) {
        const formGroup = input.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message');
        
        if (isValid) {
            formGroup.classList.remove('error');
            formGroup.classList.add('success');
            errorElement.textContent = '';
        } else {
            formGroup.classList.remove('success');
            formGroup.classList.add('error');
            errorElement.textContent = message;
        }
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    validatePassword(password) {
        const { minLength, requireUppercase, requireLowercase, requireNumbers, requireSpecial } = AUTH_CONFIG.PASSWORD_REQUIREMENTS;
        
        if (password.length < minLength) {
            return {
                isValid: false,
                message: `Password must be at least ${minLength} characters long`
            };
        }

        if (requireUppercase && !/[A-Z]/.test(password)) {
            return {
                isValid: false,
                message: 'Password must contain at least one uppercase letter'
            };
        }

        if (requireLowercase && !/[a-z]/.test(password)) {
            return {
                isValid: false,
                message: 'Password must contain at least one lowercase letter'
            };
        }

        if (requireNumbers && !/\d/.test(password)) {
            return {
                isValid: false,
                message: 'Password must contain at least one number'
            };
        }

        if (requireSpecial && !/[!@#$%^&*]/.test(password)) {
            return {
                isValid: false,
                message: 'Password must contain at least one special character (!@#$%^&*)'
            };
        }

        return {
            isValid: true,
            message: ''
        };
    }

    updatePasswordStrength(password) {
        const strengthMeter = document.querySelector('.strength-meter');
        const strengthText = document.querySelector('.strength-text');
        if (!strengthMeter || !strengthText) return;

        let strength = 0;
        let feedback = '';

        if (password.length >= 8) strength += 20;
        if (/[A-Z]/.test(password)) strength += 20;
        if (/[a-z]/.test(password)) strength += 20;
        if (/[0-9]/.test(password)) strength += 20;
        if (/[!@#$%^&*]/.test(password)) strength += 20;

        const fill = strengthMeter.querySelector('.strength-fill');
        fill.style.width = `${strength}%`;
        fill.className = 'strength-fill';

        if (strength <= 20) {
            fill.classList.add('weak');
            feedback = 'Weak';
        } else if (strength <= 60) {
            fill.classList.add('medium');
            feedback = 'Medium';
        } else {
            fill.classList.add('strong');
            feedback = 'Strong';
        }

        strengthText.textContent = `Password strength: ${feedback}`;
    }

    async handleLogin(form) {
        if (!this.validateForm(form)) return;

        const email = form.email.value;
        const password = form.password.value;
        const remember = form.remember?.checked;

        try {
            this.showLoading(form, true);
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password, remember })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            this.setAuthState(data.token, data.user);
            this.showMessage('Login successful! Redirecting...', 'success');
            
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, AUTH_CONFIG.REDIRECT_DELAY);

        } catch (error) {
            this.showMessage(error.message);
        } finally {
            this.showLoading(form, false);
        }
    }

    async handleSignup(form) {
        if (!this.validateForm(form)) return;

        const name = form.name.value;
        const email = form.email.value;
        const password = form.password.value;

        try {
            this.showLoading(form, true);
            const response = await fetch(`${API_BASE_URL}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Signup failed');
            }

            this.showMessage('Account created successfully! Please check your email for verification.', 'success');
            
            setTimeout(() => {
                window.location.href = '/auth/verify-email.html';
            }, AUTH_CONFIG.REDIRECT_DELAY);

        } catch (error) {
            this.showMessage(error.message);
        } finally {
            this.showLoading(form, false);
        }
    }

    async handleLogout() {
        try {
            if (this.token) {
                await fetch(`${API_BASE_URL}/auth/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.clearAuth();
            window.location.href = '/';
        }
    }

    validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input[required]');
        inputs.forEach(input => {
            if (!this.validateInput(input)) {
                isValid = false;
            }
        });
        return isValid;
    }

    showLoading(form, isLoading) {
        const button = form.querySelector('button[type="submit"]');
        const buttonText = button.querySelector('.button-text');
        const buttonLoader = button.querySelector('.button-loader');

        if (isLoading) {
            button.disabled = true;
            button.classList.add('loading');
            if (buttonText) buttonText.style.opacity = '0';
            if (buttonLoader) buttonLoader.style.display = 'block';
        } else {
            button.disabled = false;
            button.classList.remove('loading');
            if (buttonText) buttonText.style.opacity = '1';
            if (buttonLoader) buttonLoader.style.display = 'none';
        }
    }

    showMessage(message, type = 'error') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type} fade-in`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <p>${message}</p>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        document.body.appendChild(notification);

        // Auto dismiss
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 5000);

        // Manual dismiss
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        });
    }
}

// Form Validation
class FormValidator {
    constructor(form) {
        this.form = form;
        this.errors = new Map();
        this.setupValidation();
    }

    setupValidation() {
        this.form.addEventListener('submit', (e) => this.validateForm(e));
        this.form.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', () => this.validateField(input));
            input.addEventListener('blur', () => this.validateField(input));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        this.errors.delete(field.name);
        
        // Required field validation
        if (field.required && !value) {
            this.addError(field, 'This field is required');
            return false;
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.addError(field, 'Please enter a valid email address');
                return false;
            }
        }

        // Password validation
        if (field.type === 'password' && value) {
            if (value.length < 8) {
                this.addError(field, 'Password must be at least 8 characters long');
                return false;
            }
            if (!/[A-Z]/.test(value)) {
                this.addError(field, 'Password must contain at least one uppercase letter');
                return false;
            }
            if (!/[a-z]/.test(value)) {
                this.addError(field, 'Password must contain at least one lowercase letter');
                return false;
            }
            if (!/[0-9]/.test(value)) {
                this.addError(field, 'Password must contain at least one number');
                return false;
            }
            if (!/[^A-Za-z0-9]/.test(value)) {
                this.addError(field, 'Password must contain at least one special character');
                return false;
            }
        }

        // Username validation
        if (field.name === 'username' && value) {
            if (value.length < 3) {
                this.addError(field, 'Username must be at least 3 characters long');
                return false;
            }
            if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
                this.addError(field, 'Username can only contain letters, numbers, underscores, and hyphens');
                return false;
            }
        }

        this.updateFieldStatus(field, true);
        return true;
    }

    validateForm(e) {
        e.preventDefault();
        let isValid = true;
        
        this.form.querySelectorAll('input').forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        // Password confirmation validation
        const password = this.form.querySelector('input[type="password"]');
        const confirmPassword = this.form.querySelector('input[name="confirm-password"]');
        if (password && confirmPassword && password.value !== confirmPassword.value) {
            this.addError(confirmPassword, 'Passwords do not match');
            isValid = false;
        }

        if (isValid) {
            this.submitForm();
        }
    }

    addError(field, message) {
        this.errors.set(field.name, message);
        this.updateFieldStatus(field, false);
    }

    updateFieldStatus(field, isValid) {
        const container = field.closest('.form-group');
        if (!container) return;

        const errorElement = container.querySelector('.error-message');
        if (isValid) {
            container.classList.remove('error');
            container.classList.add('success');
            if (errorElement) errorElement.remove();
        } else {
            container.classList.add('error');
            container.classList.remove('success');
            if (!errorElement) {
                const error = document.createElement('span');
                error.className = 'error-message';
                error.textContent = this.errors.get(field.name);
                container.appendChild(error);
            } else {
                errorElement.textContent = this.errors.get(field.name);
            }
        }
    }

    async submitForm() {
        const submitButton = this.form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        try {
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="spinner"></span> Processing...';
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'alert alert-success';
            successMessage.textContent = 'Form submitted successfully!';
            this.form.insertAdjacentElement('beforebegin', successMessage);
            
            // Reset form
            this.form.reset();
            
        } catch (error) {
            const errorMessage = document.createElement('div');
            errorMessage.className = 'alert alert-error';
            errorMessage.textContent = 'An error occurred. Please try again.';
            this.form.insertAdjacentElement('beforebegin', errorMessage);
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    }
}

// Initialize Authentication
document.addEventListener('DOMContentLoaded', () => {
    window.auth = new Auth();
});

// Initialize form validation
document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => new FormValidator(form));
});

// Authentication System
class LabAuthentication {
    constructor() {
        this.form = document.getElementById('labAccessForm');
        this.overlay = document.getElementById('authOverlay');
        this.initializeAuth();
    }

    initializeAuth() {
        this.form.addEventListener('submit', (e) => this.handleAuth(e));
    }

    async handleAuth(e) {
        e.preventDefault();
        const accessKey = document.getElementById('accessKey').value;

        // Show verification animation
        this.showVerification();

        // Simulate API call
        try {
            const isValid = await this.validateAccess(accessKey);
            if (isValid) {
                this.grantAccess();
            } else {
                this.showError('Invalid access key');
            }
        } catch (error) {
            this.showError('Authentication failed');
        }
    }

    showVerification() {
        const terminal = document.querySelector('.terminal-body');
        terminal.innerHTML = `
            <p class="typing-effect">Verifying credentials...</p>
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
        `;
    }

    async validateAccess(key) {
        // Simulate API validation
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(key === 'DEMO123'); // Demo key for testing
            }, 2000);
        });
    }

    grantAccess() {
        this.overlay.style.animation = 'fadeOut 0.5s forwards';
        setTimeout(() => {
            this.overlay.style.display = 'none';
            document.querySelector('.lab-interface').classList.remove('hidden');
        }, 500);
    }

    showError(message) {
        const terminal = document.querySelector('.terminal-body');
        terminal.innerHTML = `
            <p class="error-message">${message}</p>
            <button class="cyber-button small" onclick="location.reload()">
                Try Again
            </button>
        `;
    }

    trackUserSession() {
        const sessionId = Math.random().toString(36).substring(7);
        const startTime = new Date();

        // Update session status periodically
        setInterval(() => {
            const duration = Math.floor((new Date() - startTime) / 1000);
            this.updateSessionStatus(sessionId, duration);
        }, 30000);

        // Track user activity
        document.addEventListener('mousemove', this.debounce(() => {
            this.updateUserActivity(sessionId);
        }, 1000));
    }

    updateSessionStatus(sessionId, duration) {
        const statusEl = document.querySelector('.session-status');
        if (statusEl) {
            statusEl.innerHTML = `
                <div class="status-item">
                    <span>Session ID:</span> ${sessionId}
                </div>
                <div class="status-item">
                    <span>Duration:</span> ${this.formatDuration(duration)}
                </div>
            `;
        }
    }

    formatDuration(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours}h ${minutes}m ${secs}s`;
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize authentication
document.addEventListener('DOMContentLoaded', () => {
    const auth = new LabAuthentication();
});
