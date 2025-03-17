document.addEventListener('DOMContentLoaded', () => {
    // Initialize cookie preferences
    const initializePreferences = () => {
        const savedPreferences = JSON.parse(localStorage.getItem('cookiePreferences')) || {
            analytics: false,
            preferences: false,
            retentionPeriod: 'session',
            policyVersion: 'strict'
        };

        // Set toggle states
        document.getElementById('analyticsToggle').checked = savedPreferences.analytics;
        document.getElementById('preferencesToggle').checked = savedPreferences.preferences;
        document.getElementById('retentionPeriod').value = savedPreferences.retentionPeriod;
        document.getElementById('cookiePolicy').value = savedPreferences.policyVersion;
    };

    // Save preferences
    const savePreferences = () => {
        const preferences = {
            analytics: document.getElementById('analyticsToggle').checked,
            preferences: document.getElementById('preferencesToggle').checked,
            retentionPeriod: document.getElementById('retentionPeriod').value,
            policyVersion: document.getElementById('cookiePolicy').value
        };

        localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
        showToast('Preferences saved successfully!', 'success');
    };

    // Reset preferences
    const resetPreferences = () => {
        const defaultPreferences = {
            analytics: false,
            preferences: false,
            retentionPeriod: 'session',
            policyVersion: 'strict'
        };

        document.getElementById('analyticsToggle').checked = false;
        document.getElementById('preferencesToggle').checked = false;
        document.getElementById('retentionPeriod').value = 'session';
        document.getElementById('cookiePolicy').value = 'strict';

        localStorage.setItem('cookiePreferences', JSON.stringify(defaultPreferences));
        showToast('Preferences reset to default', 'info');
    };

    // Modal functionality
    const initializeModals = () => {
        const modal = document.getElementById('cookieModal');
        const modalContent = {
            'essential-info': {
                title: 'Essential Cookies',
                content: `
                    <div class="modal-section">
                        <h3>What are Essential Cookies?</h3>
                        <p>Essential cookies are necessary for the website to function properly. These cookies ensure basic functionalities and security features of the website.</p>
                        <ul>
                            <li>Session Management</li>
                            <li>Authentication</li>
                            <li>Security Measures</li>
                        </ul>
                    </div>
                `
            },
            'analytics-info': {
                title: 'Analytics Cookies',
                content: `
                    <div class="modal-section">
                        <h3>About Analytics Cookies</h3>
                        <p>Analytics cookies help us understand how visitors interact with our website. This information helps us improve our website and services.</p>
                        <ul>
                            <li>Page View Statistics</li>
                            <li>User Behavior Analysis</li>
                            <li>Performance Monitoring</li>
                        </ul>
                    </div>
                `
            },
            'preferences-info': {
                title: 'Preference Cookies',
                content: `
                    <div class="modal-section">
                        <h3>Understanding Preference Cookies</h3>
                        <p>Preference cookies allow the website to remember your choices and provide a more personalized experience.</p>
                        <ul>
                            <li>Language Preferences</li>
                            <li>Theme Settings</li>
                            <li>User Customizations</li>
                        </ul>
                    </div>
                `
            }
        };

        // Open modal
        document.querySelectorAll('[data-modal]').forEach(button => {
            button.addEventListener('click', () => {
                const modalType = button.dataset.modal;
                const content = modalContent[modalType];
                
                document.getElementById('modalTitle').textContent = content.title;
                document.getElementById('modalContent').innerHTML = content.content;
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            });
        });

        // Close modal
        document.querySelector('.modal-close').addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });

        // Close on outside click
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    };

    // Toast notifications
    const showToast = (message, type = 'info') => {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        document.getElementById('toastContainer').appendChild(toast);

        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    };

    // Add hover effects to cards
    const initializeCardEffects = () => {
        document.querySelectorAll('.cookie-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const angleX = (y - centerY) / 20;
                const angleY = (centerX - x) / 20;
                
                card.style.transform = `
                    perspective(1000px) 
                    rotateX(${angleX}deg) 
                    rotateY(${angleY}deg) 
                    translateZ(10px)
                `;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
            });
        });
    };

    // Event listeners
    document.getElementById('savePreferences').addEventListener('click', savePreferences);
    document.getElementById('resetPreferences').addEventListener('click', resetPreferences);

    // Initialize all features
    initializePreferences();
    initializeModals();
    initializeCardEffects();
}); 