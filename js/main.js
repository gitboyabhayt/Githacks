document.addEventListener('DOMContentLoaded', () => {
    // Prevent double-tap zoom on mobile
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (event) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        const navMenu = document.querySelector('.nav-menu');
        const navToggle = document.querySelector('.nav-toggle');
        
        if (navMenu && navMenu.classList.contains('active') && 
            !e.target.closest('.nav-menu') && 
            !e.target.closest('.nav-toggle')) {
            navMenu.classList.remove('active');
            navToggle?.classList.remove('active');
        }
    });

    // Handle mobile scroll behavior
    let touchStartY = 0;
    document.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    });

    document.addEventListener('touchmove', (e) => {
        const touchY = e.touches[0].clientY;
        const navMenu = document.querySelector('.nav-menu');
        
        if (navMenu && navMenu.classList.contains('active')) {
            const scrollTop = navMenu.scrollTop;
            const scrollHeight = navMenu.scrollHeight;
            const height = navMenu.clientHeight;
            
            if ((scrollTop <= 0 && touchY > touchStartY) || 
                (scrollTop + height >= scrollHeight && touchY < touchStartY)) {
                e.preventDefault();
            }
        }
    }, { passive: false });

    // Basic navigation functionality
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Course filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const courseCards = document.querySelectorAll('.course-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            
            courseCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.5s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Course card hover effects
    courseCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            if (card.getAttribute('data-hover-effect') === 'lift') {
                card.style.transform = 'translateY(-10px)';
                card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = 'none';
        });
    });

    // Progress bar animation
    const progressBars = document.querySelectorAll('.progress-bar');
    progressBars.forEach(bar => {
        const progress = bar.getAttribute('data-progress') || '0';
        bar.style.setProperty('--progress', `${progress}%`);
    });

    // Pagination functionality
    const paginationButtons = document.querySelectorAll('.pagination-btn');
    const itemsPerPage = 6;
    let currentPage = 1;

    function showPage(pageNum) {
        const start = (pageNum - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        courseCards.forEach((card, index) => {
            if (index >= start && index < end) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.5s ease forwards';
            } else {
                card.style.display = 'none';
            }
        });
    }

    paginationButtons.forEach(button => {
        button.addEventListener('click', () => {
            paginationButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentPage = parseInt(button.getAttribute('data-page'));
            showPage(currentPage);
        });
    });

    // Initialize first page
    showPage(1);

    // Carousel controls functionality
    const carouselPrev = document.querySelector('.carousel-btn.prev');
    const carouselNext = document.querySelector('.carousel-btn.next');
    const coursesGrid = document.querySelector('.courses__grid');

    if (carouselPrev && carouselNext) {
        carouselPrev.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                showPage(currentPage);
                paginationButtons[currentPage - 1].click();
            }
        });

        carouselNext.addEventListener('click', () => {
            if (currentPage < Math.ceil(courseCards.length / itemsPerPage)) {
                currentPage++;
                showPage(currentPage);
                paginationButtons[currentPage - 1].click();
            }
        });
    }

    // Wishlist functionality
    const wishlistButtons = document.querySelectorAll('.btn-wishlist');
    wishlistButtons.forEach(button => {
        button.addEventListener('click', () => {
            const icon = button.querySelector('i');
            icon.classList.toggle('far');
            icon.classList.toggle('fas');
            button.classList.toggle('active');
        });
    });

    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    themeToggle.addEventListener('click', () => {
        if (body.getAttribute('data-theme') === 'dark') {
            body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        } else {
            body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.setAttribute('data-theme', 'dark');
    }

    // Mobile Navigation
    const navToggleMobile = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');

    navToggleMobile.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Typing Animation
    const typingText = document.getElementById('typingText');
    const texts = ['Innovative Development Solutions', 'Modern Web Applications', 'Cloud Infrastructure'];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeText() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typingText.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingText.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            setTimeout(typeText, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            setTimeout(typeText, 500);
        } else {
            setTimeout(typeText, isDeleting ? 50 : 100);
        }
    }

    // Start typing animation
    typeText();

    initializeFeatures();
    loadTeamMembers();
    setupContactForm();

    // Mobile Navigation Toggle
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');
    const dropdowns = document.querySelectorAll('.dropdown');

    navToggle?.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Mobile Dropdown Toggle
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdown.classList.toggle('active');
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-container')) {
            navLinks.classList.remove('active');
            navToggle?.classList.remove('active');
        }
    });
});

// Add necessary animations
const fadeIn = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;

// Add the animation to the document
const style = document.createElement('style');
style.textContent = fadeIn;
document.head.appendChild(style);

// Initialize features section
function initializeFeatures() {
    const features = [
        {
            icon: 'shield-alt',
            title: 'Penetration Testing',
            description: 'Learn advanced penetration testing techniques'
        },
        {
            icon: 'bug',
            title: 'Exploit Development',
            description: 'Master the art of finding and exploiting vulnerabilities'
        },
        {
            icon: 'network-wired',
            title: 'Network Security',
            description: 'Secure networks against advanced threats'
        },
        {
            icon: 'lock',
            title: 'Web Security',
            description: 'Protect web applications from cyber attacks'
        }
    ];

    const featureGrid = document.querySelector('.feature-grid');
    if (featureGrid) {
        featureGrid.innerHTML = features.map(feature => `
            <div class="feature-card">
                <div class="card-icon">
                    <i class="fas fa-${feature.icon}"></i>
                </div>
                <h3>${feature.title}</h3>
                <p>${feature.description}</p>
            </div>
        `).join('');
    }
}

// Load team members
function loadTeamMembers() {
    const team = [
        {
            name: 'Sarah Johnson',
            role: 'Security Researcher',
            image: 'img/team/sarah.jpg',
            socials: {
                github: '#',
                linkedin: '#',
                twitter: '#'
            }
        },
        {
            name: 'Michael Chen',
            role: 'Malware Analyst',
            image: 'img/team/michael.jpg',
            socials: {
                github: '#',
                linkedin: '#',
                twitter: '#'
            }
        },
        {
            name: 'Emma Williams',
            role: 'Network Security Expert',
            image: 'img/team/emma.jpg',
            socials: {
                github: '#',
                linkedin: '#',
                twitter: '#'
            }
        },
        {
            name: 'James Wilson',
            role: 'Web Security Specialist',
            image: 'img/team/james.jpg',
            socials: {
                github: '#',
                linkedin: '#',
                twitter: '#'
            }
        },
        {
            name: 'Lisa Anderson',
            role: 'Cryptography Expert',
            image: 'img/team/lisa.jpg',
            socials: {
                github: '#',
                linkedin: '#',
                twitter: '#'
            }
        }
    ];

    const teamGrid = document.querySelector('.team-grid');
    if (teamGrid) {
        teamGrid.innerHTML = team.map(member => `
            <div class="team-card">
                <div class="member-image">
                    <img src="${member.image}" alt="${member.name}">
                    <div class="cyber-overlay"></div>
                </div>
                <div class="member-info">
                    <h3>${member.name}</h3>
                    <p class="role">${member.role}</p>
                    <div class="social-links">
                        <a href="${member.socials.github}" class="neon-icon"><i class="fab fa-github"></i></a>
                        <a href="${member.socials.linkedin}" class="neon-icon"><i class="fab fa-linkedin"></i></a>
                        <a href="${member.socials.twitter}" class="neon-icon"><i class="fab fa-twitter"></i></a>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// Setup contact form
function setupContactForm() {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Add form submission logic here
            console.log('Form submitted');
        });
    }
}

// Remove all previous mobile menu related event listeners
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navContainer = document.querySelector('.nav-links-container');
    
    if (mobileMenuBtn && navContainer) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Toggle classes for menu visibility
            this.classList.toggle('active');
            navContainer.classList.toggle('active');
            
            // Toggle body scroll
            document.body.style.overflow = navContainer.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking a link
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                navContainer.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navContainer.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                mobileMenuBtn.classList.remove('active');
                navContainer.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
});
import LazyLoader from './utils/lazyLoader.js';

// Initialize lazy loading
LazyLoader.init();
});

// Add necessary animations
const fadeIn = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;

// Add the animation to the document
const style = document.createElement('style');
style.textContent = fadeIn;
document.head.appendChild(style);

// Initialize features section
function initializeFeatures() {
    const features = [
        {
            icon: 'shield-alt',
            title: 'Penetration Testing',
            description: 'Learn advanced penetration testing techniques'
        },
        {
            icon: 'bug',
            title: 'Exploit Development',
            description: 'Master the art of finding and exploiting vulnerabilities'
        },
        {
            icon: 'network-wired',
            title: 'Network Security',
            description: 'Secure networks against advanced threats'
        },
        {
            icon: 'lock',
            title: 'Web Security',
            description: 'Protect web applications from cyber attacks'
        }
    ];

    const featureGrid = document.querySelector('.feature-grid');
    if (featureGrid) {
        featureGrid.innerHTML = features.map(feature => `
            <div class="feature-card">
                <div class="card-icon">
                    <i class="fas fa-${feature.icon}"></i>
                </div>
                <h3>${feature.title}</h3>
                <p>${feature.description}</p>
            </div>
        `).join('');
    }
}

// Load team members
function loadTeamMembers() {
    const team = [
        {
            name: 'Sarah Johnson',
            role: 'Security Researcher',
            image: 'img/team/sarah.jpg',
            socials: {
                github: '#',
                linkedin: '#',
                twitter: '#'
            }
        },
        {
            name: 'Michael Chen',
            role: 'Malware Analyst',
            image: 'img/team/michael.jpg',
            socials: {
                github: '#',
                linkedin: '#',
                twitter: '#'
            }
        },
        {
            name: 'Emma Williams',
            role: 'Network Security Expert',
            image: 'img/team/emma.jpg',
            socials: {
                github: '#',
                linkedin: '#',
                twitter: '#'
            }
        },
        {
            name: 'James Wilson',
            role: 'Web Security Specialist',
            image: 'img/team/james.jpg',
            socials: {
                github: '#',
                linkedin: '#',
                twitter: '#'
            }
        },
        {
            name: 'Lisa Anderson',
            role: 'Cryptography Expert',
            image: 'img/team/lisa.jpg',
            socials: {
                github: '#',
                linkedin: '#',
                twitter: '#'
            }
        }
    ];

    const teamGrid = document.querySelector('.team-grid');
    if (teamGrid) {
        teamGrid.innerHTML = team.map(member => `
            <div class="team-card">
                <div class="member-image">
                    <img src="${member.image}" alt="${member.name}">
                    <div class="cyber-overlay"></div>
                </div>
                <div class="member-info">
                    <h3>${member.name}</h3>
                    <p class="role">${member.role}</p>
                    <div class="social-links">
                        <a href="${member.socials.github}" class="neon-icon"><i class="fab fa-github"></i></a>
                        <a href="${member.socials.linkedin}" class="neon-icon"><i class="fab fa-linkedin"></i></a>
                        <a href="${member.socials.twitter}" class="neon-icon"><i class="fab fa-twitter"></i></a>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// Setup contact form
function setupContactForm() {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Add form submission logic here
            console.log('Form submitted');
        });
    }
}

// Remove all previous mobile menu related event listeners
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navContainer = document.querySelector('.nav-links-container');
    
    if (mobileMenuBtn && navContainer) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Toggle classes for menu visibility
            this.classList.toggle('active');
            navContainer.classList.toggle('active');
            
            // Toggle body scroll
            document.body.style.overflow = navContainer.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking a link
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                navContainer.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navContainer.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                mobileMenuBtn.classList.remove('active');
                navContainer.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
});
