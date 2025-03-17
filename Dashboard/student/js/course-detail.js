class CourseDetailManager {
    constructor() {
        this.initializeProgress();
        this.initializeModules();
        this.initializeResources();
        this.setupEventListeners();
    }

    initializeProgress() {
        // Animate circular progress
        const progress = document.querySelector('.progress-bar');
        const progressText = document.querySelector('.progress-text');
        const percentage = 75; // Get this from your backend

        if (progress) {
            const circumference = 2 * Math.PI * 54; // 2πr where r=54
            const offset = circumference - (percentage / 100 * circumference);
            
            // Animate the progress bar
            progress.style.strokeDasharray = circumference;
            progress.style.strokeDashoffset = circumference;
            
            setTimeout(() => {
                progress.style.transition = 'stroke-dashoffset 2s ease-in-out';
                progress.style.strokeDashoffset = offset;
            }, 100);

            // Animate the percentage text
            let currentPercent = 0;
            const interval = setInterval(() => {
                if (currentPercent >= percentage) {
                    clearInterval(interval);
                } else {
                    currentPercent++;
                    progressText.textContent = `${currentPercent}%`;
                }
            }, 20);
        }
    }

    initializeModules() {
        const moduleItems = document.querySelectorAll('.module-item');
        
        moduleItems.forEach(module => {
            // Add click event to expand/collapse module content
            const header = module.querySelector('.module-header');
            const content = module.querySelector('.module-content');
            
            if (header && content) {
                header.addEventListener('click', () => {
                    const isExpanded = content.style.maxHeight;
                    
                    // Collapse all other modules
                    document.querySelectorAll('.module-content').forEach(c => {
                        c.style.maxHeight = null;
                    });

                    // Toggle current module
                    if (!isExpanded) {
                        content.style.maxHeight = content.scrollHeight + 'px';
                        module.classList.add('active');
                    } else {
                        content.style.maxHeight = null;
                        module.classList.remove('active');
                    }
                });
            }

            // Add hover effects
            module.addEventListener('mouseenter', () => {
                this.addGlowEffect(module);
            });

            module.addEventListener('mouseleave', () => {
                this.removeGlowEffect(module);
            });
        });
    }

    initializeResources() {
        const resources = document.querySelectorAll('.resources-list li');
        
        resources.forEach(resource => {
            resource.addEventListener('click', () => {
                // Add loading animation
                resource.classList.add('loading');
                
                // Simulate resource loading
                setTimeout(() => {
                    resource.classList.remove('loading');
                    // Handle resource access here
                    this.showNotification('Resource accessed successfully!');
                }, 1000);
            });
        });
    }

    setupEventListeners() {
        // Continue button interaction
        const continueBtn = document.querySelector('.continue-btn');
        if (continueBtn) {
            continueBtn.addEventListener('click', () => {
                this.handleContinueLearning();
            });
        }

        // Handle scroll animations
        this.setupScrollAnimations();
    }

    handleContinueLearning() {
        const btn = document.querySelector('.continue-btn');
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        
        // Simulate loading
        setTimeout(() => {
            // Redirect to learning environment
            window.location.href = '/learning-environment';
        }, 1500);
    }

    setupScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        // Observe sections for animation
        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });
    }

    addGlowEffect(element) {
        element.style.boxShadow = '0 0 20px rgba(0, 255, 136, 0.2)';
        element.style.borderColor = 'var(--primary-color)';
    }

    removeGlowEffect(element) {
        element.style.boxShadow = '';
        element.style.borderColor = 'rgba(0, 255, 136, 0.1)';
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <i class="fas fa-info-circle"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        // Animate notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Remove notification
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const courseManager = new CourseDetailManager();
});

// Add these styles to course-detail.css
const styles = `
    .notification {
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: rgba(0, 255, 136, 0.1);
        border: 1px solid var(--primary-color);
        padding: 15px 25px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 10px;
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
    }

    .notification.show {
        transform: translateY(0);
        opacity: 1;
    }

    .notification i {
        color: var(--primary-color);
    }

    .loading {
        position: relative;
        opacity: 0.7;
    }

    .loading::after {
        content: '';
        position: absolute;
        width: 20px;
        height: 20px;
        border: 2px solid var(--primary-color);
        border-top: 2px solid transparent;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
    }

    @keyframes spin {
        0% { transform: translateY(-50%) rotate(0deg); }
        100% { transform: translateY(-50%) rotate(360deg); }
    }

    .fade-in {
        animation: fadeIn 0.5s ease forwards;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet); 