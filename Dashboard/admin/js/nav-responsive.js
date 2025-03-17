document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links-container');
    const navLinks = document.querySelectorAll('.nav-item a');
    const logo = document.querySelector('.logo-text');

    // Add glitch effect to logo
    if (logo) {
        logo.addEventListener('mouseover', () => {
            logo.classList.add('glitch-effect');
        });

        logo.addEventListener('mouseout', () => {
            logo.classList.remove('glitch-effect');
        });
    }

    // Mobile menu toggle functionality
    if (mobileMenuToggle && navLinksContainer) {
        mobileMenuToggle.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
            mobileMenuToggle.setAttribute('aria-expanded', 
                mobileMenuToggle.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'
            );
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinksContainer && navLinksContainer.classList.contains('active')) {
            if (!navLinksContainer.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                navLinksContainer.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            }
        }
    });

    // Handle active state for nav links
    navLinks.forEach(link => {
        if (link.getAttribute('href') === window.location.pathname) {
            link.classList.add('active');
        }

        link.addEventListener('click', () => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Close mobile menu after clicking a link
            if (window.innerWidth <= 768) {
                navLinksContainer.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navLinksContainer.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
        }
    });
}));