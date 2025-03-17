// Support System with CAPTCHA and Rate Limiting
const SupportSystem = {
    // Initialize support system
    init() {
        this.bindEvents();
        this.initializeCaptcha();
    },

    // Bind event listeners
    bindEvents() {
        const supportForm = document.getElementById('supportForm');
        if (supportForm) {
            supportForm.addEventListener('submit', (e) => {
                e.preventDefault();
                if (this.validateForm(supportForm)) {
                    this.submitInquiry(supportForm);
                }
            });
        }

        // Real-time validation
        document.querySelectorAll('.form-input, .form-textarea').forEach(input => {
            input.addEventListener('input', () => {
                this.validateField(input);
            });

            input.addEventListener('blur', () => {
                this.validateField(input);
            });
        });
    },

    // Initialize CAPTCHA
    initializeCaptcha() {
        this.refreshCaptcha();
        
        // Add refresh button event
        const refreshBtn = document.querySelector('.refresh-captcha');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshCaptcha());
        }
    },

    // Generate CAPTCHA
    refreshCaptcha() {
        const canvas = document.getElementById('captchaCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const captchaText = this.generateCaptchaText();
        
        // Store captcha text for validation
        canvas.dataset.captcha = captchaText;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Add noise
        this.addNoise(ctx, canvas.width, canvas.height);

        // Draw text
        ctx.font = 'bold 24px "Fira Code", monospace';
        ctx.fillStyle = '#00ff00';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Add distortion
        for (let i = 0; i < captchaText.length; i++) {
            const x = (canvas.width / (captchaText.length + 1)) * (i + 1);
            const y = canvas.height / 2 + Math.random() * 10 - 5;
            const rotation = (Math.random() - 0.5) * 0.4;
            
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation);
            ctx.fillText(captchaText[i], 0, 0);
            ctx.restore();
        }

        // Add lines
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 1;
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
            ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
            ctx.stroke();
        }
    },

    // Generate random CAPTCHA text
    generateCaptchaText(length = 6) {
        const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    },

    // Add noise to CAPTCHA
    addNoise(ctx, width, height) {
        const imageData = ctx.getImageData(0, 0, width, height);
        const pixels = imageData.data;
        
        for (let i = 0; i < pixels.length; i += 4) {
            if (Math.random() < 0.1) {
                pixels[i] = pixels[i + 1] = pixels[i + 2] = Math.random() < 0.5 ? 0 : 255;
            }
        }
        
        ctx.putImageData(imageData, 0, 0);
    },

    // Validate form
    validateForm(form) {
        const fields = form.querySelectorAll('.form-input, .form-textarea');
        let isValid = true;

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        // Validate CAPTCHA
        const captchaInput = form.querySelector('#captcha');
        const canvas = document.getElementById('captchaCanvas');
        
        if (captchaInput && canvas) {
            const userInput = captchaInput.value.toUpperCase();
            const captchaText = canvas.dataset.captcha;
            
            if (userInput !== captchaText) {
                this.showError(captchaInput, 'Invalid CAPTCHA code');
                isValid = false;
            }
        }

        // Check rate limiting
        if (!SecurityMiddleware.rateLimiter.check('support_inquiry', 3, 3600000)) { // 3 per hour
            this.showError(form.querySelector('[name="email"]'), 'Too many inquiries. Please try again later.');
            isValid = false;
        }

        return isValid;
    },

    // Validate individual field
    validateField(field) {
        const value = field.value.trim();
        const name = field.name;

        // Clear previous errors
        this.clearError(field);

        // Required field validation
        if (field.required && !value) {
            this.showError(field, 'This field is required');
            return false;
        }

        // Email validation
        if (name === 'email' && value) {
            if (!SecurityMiddleware.sanitizer.validateEmail(value)) {
                this.showError(field, 'Please enter a valid email address');
                return false;
            }
        }

        // Name validation
        if (name === 'name' && value) {
            if (value.length < 2) {
                this.showError(field, 'Name must be at least 2 characters long');
                return false;
            }
            if (!/^[a-zA-Z\s-']+$/.test(value)) {
                this.showError(field, 'Name contains invalid characters');
                return false;
            }
        }

        // Subject validation
        if (name === 'subject' && value) {
            if (value.length < 5) {
                this.showError(field, 'Subject must be at least 5 characters long');
                return false;
            }
            if (value.length > 100) {
                this.showError(field, 'Subject must be less than 100 characters');
                return false;
            }
        }

        // Message validation
        if (name === 'message' && value) {
            if (value.length < 20) {
                this.showError(field, 'Message must be at least 20 characters long');
                return false;
            }
            if (value.length > 5000) {
                this.showError(field, 'Message must be less than 5000 characters');
                return false;
            }
        }

        return true;
    },

    // Submit inquiry
    async submitInquiry(form) {
        try {
            const formData = new FormData(form);
            const inquiry = {
                name: SecurityMiddleware.sanitizer.sanitizeInput(formData.get('name')),
                email: SecurityMiddleware.sanitizer.sanitizeInput(formData.get('email')),
                subject: SecurityMiddleware.sanitizer.sanitizeInput(formData.get('subject')),
                message: SecurityMiddleware.sanitizer.sanitizeInput(formData.get('message')),
                timestamp: new Date().toISOString()
            };

            // Store inquiry (demo implementation)
            let inquiries = JSON.parse(localStorage.getItem('support_inquiries') || '[]');
            inquiries.push(inquiry);
            localStorage.setItem('support_inquiries', JSON.stringify(inquiries));

            // Clear form and show success message
            form.reset();
            this.refreshCaptcha();
            this.showSuccess('Your inquiry has been submitted successfully! We will respond to your email shortly.');
        } catch (error) {
            console.error('Error submitting inquiry:', error);
            this.showError(form.querySelector('[name="email"]'), 'Failed to submit inquiry. Please try again.');
        }
    },

    // Show error message
    showError(field, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        
        // Remove any existing error
        this.clearError(field);
        
        // Add error message
        field.classList.add('error');
        field.parentNode.appendChild(errorDiv);
    },

    // Clear error message
    clearError(field) {
        field.classList.remove('error');
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    },

    // Show success message
    showSuccess(message) {
        const alert = document.createElement('div');
        alert.className = 'alert alert-success';
        alert.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        this.showAlert(alert);
    },

    // Show alert
    showAlert(alert) {
        const container = document.querySelector('.support-alerts') || document.createElement('div');
        container.className = 'support-alerts';
        document.querySelector('.support-container').prepend(container);
        
        container.appendChild(alert);
        setTimeout(() => alert.remove(), 5000);
    }
};

// Initialize support system
document.addEventListener('DOMContentLoaded', () => {
    SupportSystem.init();
});
