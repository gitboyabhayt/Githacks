class PasswordReset {
    constructor() {
        this.form = document.getElementById('resetForm');
        this.emailInput = document.getElementById('email');
        this.submitBtn = this.form.querySelector('.submit-btn');
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    async handleSubmit(e) {
        e.preventDefault();
        const email = this.emailInput.value;

        // Show loading state
        this.submitBtn.disabled = true;
        this.submitBtn.innerHTML = `
            <span>Sending...</span>
            <i class="fas fa-spinner fa-spin"></i>
        `;

        try {
            // Simulate API call
            await this.simulatePasswordReset(email);

            // Show success message
            this.showSuccessMessage();

            // Reset form
            this.form.reset();
        } catch (error) {
            this.showErrorMessage(error.message);
        } finally {
            // Reset button state
            this.submitBtn.disabled = false;
            this.submitBtn.innerHTML = `
                <span>Send Reset Link</span>
                <i class="fas fa-paper-plane"></i>
            `;
        }
    }

    simulatePasswordReset(email) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 2000);
        });
    }

    showSuccessMessage() {
        const message = document.createElement('div');
        message.className = 'success-message';
        message.innerHTML = `
            <i class="fas fa-check-circle"></i>
            Password reset instructions have been sent to your email.
        `;

        // Remove any existing messages
        const existingMessage = this.form.querySelector('.success-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        this.form.appendChild(message);
        message.style.display = 'block';
    }

    showErrorMessage(error) {
        // Implement error message display
        console.error(error);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PasswordReset();
});

document.addEventListener('DOMContentLoaded', () => {
    initCaptcha();
    initFormHandling();
});

function initCaptcha() {
    // Initialize reCAPTCHA
    grecaptcha.render('forgot-password-recaptcha', {
        'sitekey': 'YOUR_RECAPTCHA_SITE_KEY',
        'theme': 'dark',
        'callback': onCaptchaVerified
    });
}

function onCaptchaVerified(token) {
    // Store the token for form submission
    document.querySelector('form').dataset.captchaToken = token;
}

function initFormHandling() {
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const captchaToken = form.dataset.captchaToken;
            if (!captchaToken) {
                showNotification('Please complete the captcha verification', 'error');
                return;
            }

            const email = form.querySelector('input[type="email"]').value;
            // Proceed with password reset logic
            try {
                // Add your password reset API call here
                showNotification('Password reset instructions sent to your email', 'success');
            } catch (error) {
                showNotification('Failed to process request. Please try again.', 'error');
            }
        });
    }
}

function showNotification(message, type) {
    // Implement notification display logic
    console.log(`${type}: ${message}`);
}