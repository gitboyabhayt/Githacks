// Import theme manager
import themeManager from './themeManager.js';

class SignupForm {
    constructor() {
        this.form = document.getElementById('signupForm');
        this.fields = {
            name: document.getElementById('name'),
            email: document.getElementById('email'),
            password: document.getElementById('password'),
            confirmPassword: document.getElementById('confirmPassword'),
            terms: document.getElementById('terms')
        };
        this.errors = {
            name: document.getElementById('nameError'),
            email: document.getElementById('emailError'),
            password: document.getElementById('passwordError'),
            confirmPassword: document.getElementById('confirmPasswordError')
        };
        this.strengthMeter = document.querySelector('.strength-fill');
        this.strengthText = document.querySelector('.strength-text');
        this.init();
    }

    init() {
        this.initializePasswordToggles();
        this.initializeFloatingLabels();
        this.initializeValidation();
        this.initializeGoogleSignIn();
        this.initializeGitHubSignIn();
        this.initializeCaptcha();
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }

    initializePasswordToggles() {
        document.querySelectorAll('.password-toggle').forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                const input = e.target.closest('.input-group').querySelector('input');
                const icon = toggle.querySelector('i');
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.replace('fa-eye', 'fa-eye-slash');
                } else {
                    input.type = 'password';
                    icon.classList.replace('fa-eye-slash', 'fa-eye');
                }
            });
        });
    }

    initializeFloatingLabels() {
        document.querySelectorAll('.input-group input').forEach(input => {
            input.addEventListener('focus', () => {
                input.closest('.input-group').classList.add('focused');
            });
            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.closest('.input-group').classList.remove('focused');
                }
            });
            // Set initial state
            if (input.value) {
                input.closest('.input-group').classList.add('focused');
            }
        });
    }

    initializeValidation() {
        // Real-time validation
        this.fields.name.addEventListener('input', () => this.validateName());
        this.fields.email.addEventListener('input', () => this.validateEmail());
        this.fields.password.addEventListener('input', () => {
            this.validatePassword();
            this.updatePasswordStrength();
        });
        this.fields.confirmPassword.addEventListener('input', () => this.validateConfirmPassword());
    }

    async initializeGoogleSignIn() {
        try {
            const auth2 = await this.loadGoogleAuth();
            const button = document.getElementById('googleSignIn');
            if (button) {
                auth2.attachClickHandler(button, {},
                    (googleUser) => this.handleGoogleSignIn(googleUser),
                    (error) => console.error('Google Sign In Error:', error)
                );
            }
        } catch (error) {
            console.error('Failed to initialize Google Sign In:', error);
        }
    }

    initializeGitHubSignIn() {
        const button = document.getElementById('githubSignIn');
        if (button) {
            button.addEventListener('click', () => {
                window.location.href = '/api/auth/github';
            });
        }
    }

    initializeCaptcha() {
        // Initialize reCAPTCHA
        grecaptcha.ready(() => {
            grecaptcha.render('recaptcha', {
                'sitekey': 'YOUR_RECAPTCHA_SITE_KEY',
                'callback': this.onCaptchaVerified.bind(this)
            });
        });
    }

    validateName() {
        const name = this.fields.name.value.trim();
        if (!name) {
            this.showError('name', 'Name is required');
            return false;
        }
        if (name.length < 2) {
            this.showError('name', 'Name must be at least 2 characters long');
            return false;
        }
        this.clearError('name');
        return true;
    }

    validateEmail() {
        const email = this.fields.email.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            this.showError('email', 'Email is required');
            return false;
        }
        if (!emailRegex.test(email)) {
            this.showError('email', 'Please enter a valid email address');
            return false;
        }
        this.clearError('email');
        return true;
    }

    validatePassword() {
        const password = this.fields.password.value;
        if (!password) {
            this.showError('password', 'Password is required');
            return false;
        }
        if (password.length < 8) {
            this.showError('password', 'Password must be at least 8 characters long');
            return false;
        }
        if (!/[A-Z]/.test(password)) {
            this.showError('password', 'Password must contain at least one uppercase letter');
            return false;
        }
        if (!/[a-z]/.test(password)) {
            this.showError('password', 'Password must contain at least one lowercase letter');
            return false;
        }
        if (!/[0-9]/.test(password)) {
            this.showError('password', 'Password must contain at least one number');
            return false;
        }
        if (!/[!@#$%^&*]/.test(password)) {
            this.showError('password', 'Password must contain at least one special character (!@#$%^&*)');
            return false;
        }
        this.clearError('password');
        return true;
    }

    validateConfirmPassword() {
        const password = this.fields.password.value;
        const confirmPassword = this.fields.confirmPassword.value;
        if (!confirmPassword) {
            this.showError('confirmPassword', 'Please confirm your password');
            return false;
        }
        if (password !== confirmPassword) {
            this.showError('confirmPassword', 'Passwords do not match');
            return false;
        }
        this.clearError('confirmPassword');
        return true;
    }

    updatePasswordStrength() {
        const password = this.fields.password.value;
        let strength = 0;
        let feedback = '';

        // Length check
        if (password.length >= 8) strength += 20;
        // Uppercase check
        if (/[A-Z]/.test(password)) strength += 20;
        // Lowercase check
        if (/[a-z]/.test(password)) strength += 20;
        // Number check
        if (/[0-9]/.test(password)) strength += 20;
        // Special character check
        if (/[!@#$%^&*]/.test(password)) strength += 20;

        // Update UI
        this.strengthMeter.style.width = `${strength}%`;
        this.strengthMeter.className = 'strength-fill';

        if (strength <= 20) {
            this.strengthMeter.classList.add('weak');
            feedback = 'Weak';
        } else if (strength <= 60) {
            this.strengthMeter.classList.add('medium');
            feedback = 'Medium';
        } else {
            this.strengthMeter.classList.add('strong');
            feedback = 'Strong';
        }

        this.strengthText.textContent = `Password strength: ${feedback}`;
    }

    showError(field, message) {
        this.errors[field].textContent = message;
        this.errors[field].style.display = 'block';
        this.fields[field].classList.add('error');
    }

    clearError(field) {
        this.errors[field].textContent = '';
        this.errors[field].style.display = 'none';
        this.fields[field].classList.remove('error');
    }

    async handleSubmit(e) {
        e.preventDefault();

        // Validate all fields
        const isValid = 
            this.validateName() &&
            this.validateEmail() &&
            this.validatePassword() &&
            this.validateConfirmPassword();

        if (!isValid) return;

        if (!this.fields.terms.checked) {
            this.showNotification('Please accept the Terms & Conditions', 'error');
            return;
        }

        const captchaToken = await grecaptcha.execute();
        if (!captchaToken) {
            this.showNotification('Please complete the captcha verification', 'error');
            return;
        }

        try {
            const formData = {
                name: this.fields.name.value.trim(),
                email: this.fields.email.value.trim(),
                password: this.fields.password.value,
                captchaToken
            };

            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Signup failed');
            }

            this.showNotification('Account created successfully! Please check your email for verification.', 'success');
            setTimeout(() => {
                window.location.href = '/auth/verify-email.html';
            }, 2000);

        } catch (error) {
            this.showNotification(error.message || 'An error occurred during signup', 'error');
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type} fade-in`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
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

    async handleGoogleSignIn(googleUser) {
        try {
            const id_token = googleUser.getAuthResponse().id_token;
            const response = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token: id_token })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            window.location.href = '/dashboard';
        } catch (error) {
            this.showNotification(error.message || 'Google sign in failed', 'error');
        }
    }

    loadGoogleAuth() {
        return new Promise((resolve, reject) => {
            gapi.load('auth2', () => {
                gapi.auth2.init({
                    client_id: 'YOUR_GOOGLE_CLIENT_ID'
                }).then(resolve, reject);
            });
        });
    }

    onCaptchaVerified(token) {
        // Store the token for form submission
        this.captchaToken = token;
    }
}

// Initialize the form
document.addEventListener('DOMContentLoaded', () => {
    new SignupForm();
    const form = document.getElementById('signupForm');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');
    
    // Password visibility toggle
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const input = e.target.closest('.password-input').querySelector('input');
            const icon = btn.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.replace('fa-eye-slash', 'fa-eye');
            }
        });
    });

    // Password strength checker
    const checkPasswordStrength = (password) => {
        const strengthBar = document.querySelector('.strength-bar');
        const strengthText = document.querySelector('.strength-text');
        
        let strength = 0;
        const patterns = {
            length: password.length >= 8,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            numbers: /[0-9]/.test(password),
            symbols: /[^A-Za-z0-9]/.test(password)
        };

        strength = Object.values(patterns).filter(Boolean).length;

        const strengthColors = ['#ff4757', '#ffa502', '#7bed9f'];
        const strengthLabels = ['Weak', 'Medium', 'Strong'];
        
        strengthBar.style.width = `${(strength / 5) * 100}%`;
        strengthBar.style.backgroundColor = strengthColors[Math.min(strength - 1, 2)];
        strengthText.textContent = strengthLabels[Math.min(strength - 1, 2)];
    };

    passwordInput.addEventListener('input', (e) => {
        checkPasswordStrength(e.target.value);
    });

    // Form validation
    const validateForm = () => {
        let isValid = true;
        const username = document.getElementById('username');
        const email = document.getElementById('email');
        const terms = document.getElementById('terms');

        // Username validation
        if (!username.value.match(/^[A-Za-z0-9_]{3,20}$/)) {
            showError(username, 'Username must be 3-20 characters long and can contain letters, numbers, and underscore');
            isValid = false;
        }

        // Email validation
        if (!email.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            showError(email, 'Please enter a valid email address');
            isValid = false;
        }

        // Password validation
        if (passwordInput.value.length < 8) {
            showError(passwordInput, 'Password must be at least 8 characters long');
            isValid = false;
        }

        // Confirm password validation
        if (passwordInput.value !== confirmPasswordInput.value) {
            showError(confirmPasswordInput, 'Passwords do not match');
            isValid = false;
        }

        // Terms validation
        if (!terms.checked) {
            showError(terms, 'You must accept the Terms of Service');
            isValid = false;
        }

        return isValid;
    };

    const showError = (element, message) => {
        const errorDiv = element.closest('.form-group').querySelector('.error-message');
        errorDiv.textContent = message;
        element.classList.add('error');
    };

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            const button = form.querySelector('.signup-button');
            button.disabled = true;
            button.classList.add('loading');

            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Success - redirect to dashboard
                window.location.href = '/dashboard.html';
            } catch (error) {
                console.error('Signup failed:', error);
                button.disabled = false;
                button.classList.remove('loading');
            }
        }
    });
});
