// Responsive Navigation Handler
class ResponsiveNav {
    constructor() {
        this.nav = document.querySelector('.nav-menu');
        this.toggle = document.querySelector('.nav-toggle');
        this.overlay = document.querySelector('.nav-overlay');
        this.breakpoint = 768; // mobile breakpoint in pixels
        this.isOpen = false;

        this.init();
    }

    init() {
        if (this.toggle && this.nav) {
            this.setupEventListeners();
            this.setupResizeHandler();
            this.setupScrollHandler();
            this.setupAccessibility();
        }
    }

    setupEventListeners() {
        // Toggle button click handler
        this.toggle.addEventListener('click', () => this.toggleNav());

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.nav.contains(e.target) && !this.toggle.contains(e.target)) {
                this.closeNav();
            }
        });

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeNav();
            }
        });
    }

    setupResizeHandler() {
        // Handle window resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (window.innerWidth > this.breakpoint && this.isOpen) {
                    this.closeNav();
                }
            }, 250);
        });
    }

    setupScrollHandler() {
        // Handle scroll - hide nav on scroll down, show on scroll up
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            const header = document.querySelector('.header');

            if (header) {
                if (currentScroll <= 0) {
                    header.classList.remove('scroll-up', 'scroll-down');
                    return;
                }

                if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
                    header.classList.remove('scroll-up');
                    header.classList.add('scroll-down');
                } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
                    header.classList.remove('scroll-down');
                    header.classList.add('scroll-up');
                }
                lastScroll = currentScroll;
            }
        });
    }

    setupAccessibility() {
        // Add proper ARIA attributes
        this.toggle.setAttribute('aria-expanded', 'false');
        this.toggle.setAttribute('aria-controls', 'nav-menu');
        this.nav.setAttribute('id', 'nav-menu');
        
        // Make all interactive elements focusable
        this.nav.querySelectorAll('a, button').forEach(element => {
            element.setAttribute('tabindex', this.isOpen ? '0' : '-1');
        });
    }

    toggleNav() {
        this.isOpen ? this.closeNav() : this.openNav();
    }

    openNav() {
        this.isOpen = true;
        this.nav.classList.add('active');
        this.toggle.classList.add('active');
        this.toggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';

        // Make nav items focusable
        this.nav.querySelectorAll('a, button').forEach(element => {
            element.setAttribute('tabindex', '0');
        });

        // Add overlay
        if (this.overlay) {
            this.overlay.classList.add('active');
        }

        // Trap focus within nav
        this.trapFocus();
    }

    closeNav() {
        this.isOpen = false;
        this.nav.classList.remove('active');
        this.toggle.classList.remove('active');
        this.toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';

        // Make nav items not focusable
        this.nav.querySelectorAll('a, button').forEach(element => {
            element.setAttribute('tabindex', '-1');
        });

        // Remove overlay
        if (this.overlay) {
            this.overlay.classList.remove('active');
        }
    }

    trapFocus() {
        const focusableElements = this.nav.querySelectorAll(
            'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusableElement = focusableElements[0];
        const lastFocusableElement = focusableElements[focusableElements.length - 1];

        this.nav.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusableElement) {
                        lastFocusableElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusableElement) {
                        firstFocusableElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }
}

// Initialize responsive navigation
document.addEventListener('DOMContentLoaded', () => {
    new ResponsiveNav();
});

// Lazy Loading Images
document.addEventListener('DOMContentLoaded', () => {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
});

// Responsive Tables
document.addEventListener('DOMContentLoaded', () => {
    const tables = document.querySelectorAll('table');
    
    tables.forEach(table => {
        const wrapper = document.createElement('div');
        wrapper.classList.add('table-responsive');
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);

        // Add data labels for mobile view
        const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent);
        const rows = table.querySelectorAll('tbody tr');

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            cells.forEach((cell, index) => {
                cell.setAttribute('data-label', headers[index]);
            });
        });
    });
});

// Responsive Iframes
document.addEventListener('DOMContentLoaded', () => {
    const iframes = document.querySelectorAll('iframe');
    
    iframes.forEach(iframe => {
        const wrapper = document.createElement('div');
        wrapper.classList.add('iframe-responsive');
        iframe.parentNode.insertBefore(wrapper, iframe);
        wrapper.appendChild(iframe);
    });
});

// Responsive Typography
document.addEventListener('DOMContentLoaded', () => {
    const setResponsiveFont = () => {
        const width = window.innerWidth;
        const baseSize = 16; // Base font size in pixels
        const minSize = 14; // Minimum font size
        const maxSize = 18; // Maximum font size
        
        // Calculate font size based on viewport width
        const fontSize = Math.min(
            Math.max(minSize, baseSize * (width / 1920)),
            maxSize
        );
        
        document.documentElement.style.fontSize = `${fontSize}px`;
    };

    window.addEventListener('resize', setResponsiveFont);
    setResponsiveFont();
});
