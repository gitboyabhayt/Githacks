class AnimationController {
    constructor() {
        this.initHeroParallax();
        this.initCourseCards();
        this.initScrollParallax();
    }

    initScrollParallax() {
        const parallaxElements = document.querySelectorAll('.parallax-layer');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translate3d(0, ${yPos}px, 0)`;
            });
        });
    }

    initHeroParallax() {
        document.addEventListener('mousemove', (e) => {
            const hero = document.querySelector('.hero');
            const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
            const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
            
            hero.style.transform = `translateX(${moveX}px) translateY(${moveY}px)`;
        });
    }

    initCourseCards() {
        const cards = document.querySelectorAll('.course-card');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                card.style.setProperty('--x', `${x}px`);
                card.style.setProperty('--y', `${y}px`);
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) rotateX(0)';
            });
        });
    }
}

export const animationController = new AnimationController();

document.addEventListener('DOMContentLoaded', () => {
    initializeAnimations();
    initializeGlitchEffect();
    initializeScrollAnimations();
    initializeTerminal();
    initializeCounters();
});

// Initialize all animations
function initializeAnimations() {
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');
    
    navToggle?.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Card hover effects
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
            card.style.boxShadow = 'var(--neon-glow)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = 'none';
        });
    });

    // Auth Button Effects
    document.querySelector('.auth-btn')?.addEventListener('mousemove', (e) => {
        const btn = e.currentTarget;
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Update glow position
        btn.style.setProperty('--x', `${x}px`);
        btn.style.setProperty('--y', `${y}px`);
        
        // Add ripple effect on click
        btn.addEventListener('click', (e) => {
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${e.clientX - rect.left - size/2}px`;
            ripple.style.top = `${e.clientY - rect.top - size/2}px`;
            btn.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// Glitch text effect
function initializeGlitchEffect() {
    const glitchTexts = document.querySelectorAll('.glitch-text');
    
    glitchTexts.forEach(text => {
        const originalText = text.textContent;
        
        setInterval(() => {
            if (Math.random() > 0.9) {
                text.style.textShadow = `
                    0.05em 0 0 rgba(255,0,0,.75),
                    -0.025em -0.05em 0 rgba(0,255,0,.75),
                    0.025em 0.05em 0 rgba(0,0,255,.75)
                `;
                
                setTimeout(() => {
                    text.style.textShadow = 'none';
                }, 50);
            }
        }, 100);
    });
}

// Scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements
    document.querySelectorAll('.feature-card, .mentor-card, .team-card').forEach(el => {
        observer.observe(el);
    });
}

// Theme toggle
const themeToggle = document.querySelector('.theme-toggle');
themeToggle?.addEventListener('click', () => {
    document.documentElement.setAttribute('data-theme', 
        document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
    );
});

function initializeTerminal() {
    const terminalText = document.getElementById('terminalText');
    const messages = [
        'Initializing security protocols...',
        'Loading penetration testing modules...',
        'Scanning network vulnerabilities...',
        'System ready for training...'
    ];
    let messageIndex = 0;
    let charIndex = 0;

    function typeMessage() {
        if (messageIndex >= messages.length) messageIndex = 0;
        
        const currentMessage = messages[messageIndex];
        
        if (charIndex < currentMessage.length) {
            terminalText.textContent += currentMessage.charAt(charIndex);
            charIndex++;
            setTimeout(typeMessage, 50);
        } else {
            setTimeout(() => {
                eraseMessage();
            }, 2000);
        }
    }

    function eraseMessage() {
        if (terminalText.textContent.length > 0) {
            terminalText.textContent = terminalText.textContent.slice(0, -1);
            setTimeout(eraseMessage, 30);
        } else {
            charIndex = 0;
            messageIndex++;
            setTimeout(typeMessage, 500);
        }
    }

    typeMessage();
}

// Initialize counters
function initializeCounters() {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const steps = 50;
        const increment = target / steps;
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.ceil(current);
                setTimeout(updateCounter, duration / steps);
            } else {
                counter.textContent = target;
            }
        };

        updateCounter();
    });
}
