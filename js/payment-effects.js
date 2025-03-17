class PaymentEffects {
    static init() {
        this.addTestModeBadge();
        this.initializeAnimations();
    }

    static addTestModeBadge() {
        const badge = document.createElement('div');
        badge.className = 'test-mode-badge';
        badge.innerHTML = `
            <i class="fas fa-vial"></i>
            Test Mode
        `;
        document.body.appendChild(badge);
    }

    static initializeAnimations() {
        // Add loading animation
        const addLoadingEffect = (button) => {
            button.addEventListener('click', (e) => {
                if (!button.classList.contains('loading')) {
                    button.classList.add('loading');
                    button.innerHTML = `
                        <span class="spinner"></span>
                        Processing...
                    `;
                }
            });
        };

        // Add to all payment buttons
        document.querySelectorAll('.payment-button').forEach(addLoadingEffect);
    }

    static showProcessingModal() {
        const modal = document.createElement('div');
        modal.className = 'payment-modal';
        modal.innerHTML = `
            <div class="payment-modal-content">
                <div class="processing-animation"></div>
                <h3>Processing Payment</h3>
                <p>Please don't close this window...</p>
            </div>
        `;
        document.body.appendChild(modal);
        return modal;
    }

    static hideProcessingModal(modal) {
        modal.classList.add('fade-out');
        setTimeout(() => modal.remove(), 300);
    }

    static addSuccessEffect(element) {
        element.classList.add('success-animation');
        setTimeout(() => {
            element.classList.remove('success-animation');
        }, 1000);
    }
}

// Initialize effects
document.addEventListener('DOMContentLoaded', () => {
    PaymentEffects.init();
}); 