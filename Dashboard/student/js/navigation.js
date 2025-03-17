// Page Navigation Handler
class PageManager {
    constructor() {
        this.currentPage = 'dashboard';
        this.init();
    }

    init() {
        // Handle navigation clicks
        document.querySelectorAll('.nav-link[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const page = link.dataset.page;
                this.navigateTo(page);
            });
        });

        // Handle initial page load
        const hash = window.location.hash.slice(1) || 'dashboard';
        this.showPage(hash);

        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            const page = window.location.hash.slice(1) || 'dashboard';
            this.showPage(page);
        });
    }

    navigateTo(page) {
        window.location.hash = page;
        this.showPage(page);
    }

    showPage(page) {
        // Update active state in navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            if (link.dataset.page === page) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Show/hide page sections
        document.querySelectorAll('.page-section').forEach(section => {
            if (section.dataset.page === page) {
                section.style.display = 'block';
                gsap.from(section, {
                    opacity: 0,
                    y: 20,
                    duration: 0.3,
                    clearProps: 'all'
                });
            } else {
                section.style.display = 'none';
            }
        });

        this.currentPage = page;

        // Handle mobile menu
        if (window.innerWidth <= 768) {
            const sidebar = document.querySelector('.sidebar');
            sidebar.classList.remove('active');
        }
    }
}

// Mobile menu handling
function initializeMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const sidebar = document.querySelector('.sidebar');

    // Toggle menu
    mobileToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        }
    });

    // Prevent menu close when clicking inside sidebar
    sidebar.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const pageManager = new PageManager();
    initializeMobileMenu();

    // Remove any inline styles that might be added
    const sidebar = document.querySelector('.sidebar');
    if (window.innerWidth > 768) {
        sidebar.removeAttribute('style');
    }
}); 