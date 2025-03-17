document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initMatrix();
    initTabs();
    initPasswordToggles();
    initPasswordStrength();
    initCaptcha();
    initFormValidation();
});

// Matrix Background Animation
function initMatrix() {
    const canvas = document.getElementById('matrixBg');
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
    const charArray = chars.split('');
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);
    
    function draw() {
        ctx.fillStyle = 'rgba(2, 12, 27, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#0F0';
        ctx.font = `${fontSize}px monospace`;
        
        for(let i = 0; i < drops.length; i++) {
            const text = charArray[Math.floor(Math.random() * charArray.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if(drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    setInterval(draw, 33);
}

// Tab Switching
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const forms = document.querySelectorAll('.auth-form');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tab;
            
            // Update active states
            tabBtns.forEach(b => b.classList.remove('active'));
            forms.forEach(f => f.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(`${target}Form`).classList.add('active');
            
            // Add glitch effect
            btn.classList.add('glitch');
            setTimeout(() => btn.classList.remove('glitch'), 1000);
        });
    });
}

// Password Visibility Toggle
function initPasswordToggles() {
    const toggleBtns = document.querySelectorAll('.toggle-password');
    
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.previousElementSibling;
            const icon = btn.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
            
            // Add neon effect
            btn.style.textShadow = '0 0 10px #0F0';
            setTimeout(() => btn.style.textShadow = 'none', 500);
        });
    });
}

// Password Strength Checker
function initPasswordStrength() {
    const passwordInput = document.querySelector('.password-input');
    const strengthBars = document.querySelector('.strength-bars');
    const strengthText = document.querySelector('.strength-text');
    
    passwordInput.addEventListener('input', (e) => {
        const password = e.target.value;
        const strength = checkPasswordStrength(password);
        
        // Remove all classes
        strengthBars.className = 'strength-bars';
        
        // Add appropriate class
        if (password.length > 0) {
            strengthBars.classList.add(strength);
        }
        
        // Update text
        strengthText.textContent = `Password Strength: ${strength.replace('-', ' ')}`;
    });
}

function checkPasswordStrength(password) {
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength++;
    
    // Character variety checks
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    // Return strength level
    switch(strength) {
        case 0: return 'weak';
        case 1: return 'medium';
        case 2: return 'strong';
        default: return 'very-strong';
    }
}

// Captcha Simulation
function initCaptcha() {
    // Initialize reCAPTCHA for login form
    grecaptcha.render('login-recaptcha', {
        'sitekey': 'YOUR_RECAPTCHA_SITE_KEY',
        'theme': 'dark',
        'callback': onLoginCaptchaVerified
    });

    // Initialize reCAPTCHA for signup form
    grecaptcha.render('signup-recaptcha', {
        'sitekey': 'YOUR_RECAPTCHA_SITE_KEY',
        'theme': 'dark',
        'callback': onSignupCaptchaVerified
    });
}

function onLoginCaptchaVerified(token) {
    // Store the token for form submission
    document.getElementById('loginFormElement').dataset.captchaToken = token;
}

function onSignupCaptchaVerified(token) {
    // Store the token for form submission
    document.getElementById('signupForm').querySelector('form').dataset.captchaToken = token;
}

async function handleLogin(event) {
    event.preventDefault();
    const form = event.target;
    const captchaToken = form.dataset.captchaToken;

    if (!captchaToken) {
        showNotification('Please complete the captcha verification', 'error');
        return;
    }

    // Proceed with login logic
    const captcha = document.querySelector('.cyber-captcha');
    
    if (captcha) {
        captcha.addEventListener('click', () => {
            if (!captcha.classList.contains('verified')) {
                captcha.classList.add('loading');
                
                // Simulate verification
                setTimeout(() => {
                    captcha.classList.remove('loading');
                    captcha.classList.add('verified');
                    captcha.innerHTML = `
                        <i class="fas fa-check"></i>
                        <span>Verified</span>
                    `;
                    captcha.style.borderColor = '#0F0';
                    captcha.style.color = '#0F0';
                }, 1500);
            }
        });
    }
}

// Form Validation
function initFormValidation() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const form = e.target;
    
    try {
        // Add loading state
        form.classList.add('loading');
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Show success message
        showNotification('Login successful!', 'success');
        
        // Redirect (you can change this to your dashboard)
        setTimeout(() => {
            window.location.href = '/dashboard';
        }, 1000);
        
    } catch (error) {
        showNotification('Login failed. Please try again.', 'error');
    } finally {
        form.classList.remove('loading');
    }
}

async function handleSignup(e) {
    e.preventDefault();
    const form = e.target;
    const button = form.querySelector('.cyber-button');

    try {
        // Validate passwords match
        const password = form.querySelector('.password-input').value;
        const confirmPassword = form.querySelector('input[placeholder="Confirm Password"]').value;
        
        if (password !== confirmPassword) {
            throw new Error('Passwords do not match');
        }

        // Validate password strength
        if (!this.isPasswordStrong(password)) {
            throw new Error('Password does not meet security requirements');
        }

        this.setLoadingState(button, true, 'Creating Account...');
        
        const formData = {
            name: form.querySelector('input[placeholder="Full Name"]').value,
            userType: form.querySelector('.cyber-select').value,
            email: form.querySelector('input[type="email"]').value,
            password: password
        };

        // Simulate API call
        await this.simulateAuth(formData);

        // Show success message
        this.showSuccessAnimation('Account Created', 'Welcome to GITHACKS');

        // Switch to login form after success
        setTimeout(() => {
            this.switchForm('login');
        }, 1500);

    } catch (error) {
        this.showError(error.message);
    } finally {
        this.setLoadingState(button, false, 'Create Account');
    }
}

// Utility Functions
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

class CyberAuth {
    constructor() {
        this.loginForm = document.getElementById('loginForm');
        this.signupForm = document.getElementById('signupForm');
        this.buttons = document.querySelectorAll('.cyber-button');
        this.passwordInputs = document.querySelectorAll('input[type="password"]');
        this.toggleButtons = document.querySelectorAll('.toggle-password');
        
        this.initializeEventListeners();
        this.initializeMatrixBackground();
        this.initializeButtonEffects();
    }

    initializeEventListeners() {
        // Form submissions
        if (this.loginForm) {
            this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        if (this.signupForm) {
            this.signupForm.addEventListener('submit', (e) => this.handleSignup(e));
        }

        // Password toggles
        this.toggleButtons.forEach((btn, index) => {
            btn.addEventListener('click', () => this.togglePassword(this.passwordInputs[index], btn));
        });

        // Form switching
        document.querySelectorAll('.switch-form').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchForm(btn.dataset.form);
            });
        });
    }

    initializeButtonEffects() {
        this.buttons.forEach(button => {
            // Add click effect
            button.addEventListener('click', () => {
                button.classList.add('clicked');
                setTimeout(() => button.classList.remove('clicked'), 500);
            });

            // Add hover glitch effect
            button.addEventListener('mouseover', () => {
                this.startGlitchEffect(button);
            });

            button.addEventListener('mouseout', () => {
                this.stopGlitchEffect(button);
            });
        });
    }

    startGlitchEffect(button) {
        if (!button.glitchInterval) {
            button.glitchInterval = setInterval(() => {
                const offset = Math.random() * 4 - 2;
                button.style.transform = `translate(${offset}px, ${offset}px)`;
            }, 50);
        }
    }

    stopGlitchEffect(button) {
        if (button.glitchInterval) {
            clearInterval(button.glitchInterval);
            button.glitchInterval = null;
            button.style.transform = '';
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        const button = e.target.querySelector('.cyber-button');
        
        try {
            this.setLoadingState(button, true);
            
            const formData = {
                userType: e.target.querySelector('.cyber-select').value,
                email: e.target.querySelector('input[type="email"]').value,
                password: e.target.querySelector('input[type="password"]').value
            };

            await this.simulateAuth(formData);
            
            // Show success animation
            this.showSuccessAnimation();
            
            // Redirect based on user type
            setTimeout(() => {
                window.location.href = formData.userType === 'admin' 
                    ? '/Dashboard/admin/index.html' 
                    : '/Dashboard/student/index.html';
            }, 1500);

        } catch (error) {
            this.showError(error.message);
        } finally {
            this.setLoadingState(button, false);
        }
    }

    setLoadingState(button, isLoading) {
        if (isLoading) {
            button.disabled = true;
            button.innerHTML = `
                <div class="loading-spinner"></div>
                <span>Authenticating...</span>
            `;
            button.classList.add('loading');
        } else {
            button.disabled = false;
            button.innerHTML = button.classList.contains('signup') ? `
                <span>Create Account</span>
                <i class="fas fa-user-plus"></i>
            ` : `
                <span>Initialize Login</span>
                <i class="fas fa-arrow-right"></i>
            `;
            button.classList.remove('loading');
        }
    }

    showSuccessAnimation() {
        const overlay = document.createElement('div');
        overlay.className = 'cyber-success-overlay';
        overlay.innerHTML = `
            <div class="success-content">
                <i class="fas fa-check-circle"></i>
                <h3>Access Granted</h3>
                <div class="success-loader"></div>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'cyber-error';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.classList.add('show');
            this.triggerGlitchEffect();
        }, 100);
        
        setTimeout(() => {
            errorDiv.classList.remove('show');
            setTimeout(() => errorDiv.remove(), 300);
        }, 3000);
    }

    triggerGlitchEffect() {
        document.querySelectorAll('.cyber-button').forEach(button => {
            button.style.animation = 'buttonGlitch 0.3s ease';
            setTimeout(() => {
                button.style.animation = '';
            }, 300);
        });
    }

    simulateAuth(data) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() > 0.1) { // 90% success rate
                    resolve();
                } else {
                    reject(new Error('Authentication failed. Please try again.'));
                }
            }, 1500);
        });
    }

    switchForm(formType) {
        const currentForm = formType === 'login' ? this.signupForm : this.loginForm;
        const nextForm = formType === 'login' ? this.loginForm : this.signupForm;

        // Add exit animation
        currentForm.style.animation = 'fadeOut 0.3s forwards';
        
        setTimeout(() => {
            currentForm.classList.add('hidden');
            nextForm.classList.remove('hidden');
            // Add entrance animation
            nextForm.style.animation = 'fadeIn 0.3s forwards';
        }, 300);

        // Add glitch effect to header
        this.triggerGlitchEffect();
    }

    togglePassword(input, button) {
        const type = input.type === 'password' ? 'text' : 'password';
        input.type = type;
        
        const icon = button.querySelector('i');
        icon.className = `fas fa-eye${type === 'password' ? '' : '-slash'}`;
        
        // Add neon pulse effect
        button.style.animation = 'neonPulse 0.3s';
        setTimeout(() => button.style.animation = '', 300);
    }

    isPasswordStrong(password) {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        const strength = [
            password.length >= minLength,
            hasUpperCase,
            hasLowerCase,
            hasNumbers,
            hasSpecialChar
        ].filter(Boolean).length;

        this.updatePasswordStrength(strength);
        return strength >= 4;
    }

    updatePasswordStrength(strength) {
        const strengthBars = document.querySelector('.strength-bars');
        const strengthText = document.querySelector('.strength-text');
        
        strengthBars.className = 'strength-bars';
        let strengthLevel = '';

        switch(strength) {
            case 1:
                strengthLevel = 'weak';
                break;
            case 2:
            case 3:
                strengthLevel = 'medium';
                break;
            case 4:
                strengthLevel = 'strong';
                break;
            case 5:
                strengthLevel = 'very-strong';
                break;
        }

        if (strengthLevel) {
            strengthBars.classList.add(strengthLevel);
            strengthText.textContent = `Password Strength: ${strengthLevel.replace('-', ' ')}`;
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CyberAuth();
});