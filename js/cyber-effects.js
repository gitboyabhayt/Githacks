document.addEventListener('DOMContentLoaded', () => {
    // Matrix rain effect enhancement
    const canvas = document.getElementById('matrixBg');
    const ctx = canvas.getContext('2d');
    
    // Resize handler
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Card hover effects
    const cards = document.querySelectorAll('.cert-card, .lab-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Intersection Observer for fade-in effects
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.cert-card, .lab-card').forEach(el => {
        observer.observe(el);
    });

    // Terminal typing animation with cursor
    function typeWriterWithCursor(element, text, speed = 50) {
        let i = 0;
        element.innerHTML = '<span class="cursor">|</span>';
        
        function type() {
            if (i < text.length) {
                element.innerHTML = text.substring(0, i + 1) + '<span class="cursor">|</span>';
                i++;
                setTimeout(type, speed);
            } else {
                element.innerHTML = text;
            }
        }
        type();
    }

    // Update terminal status randomly
    function updateTerminalStatus() {
        const statusElements = document.querySelectorAll('.terminal-status');
        statusElements.forEach(el => {
            const randomValue = Math.floor(Math.random() * 100);
            el.textContent = `${randomValue}%`;
            el.style.color = randomValue > 80 ? '#ff3366' : '#39ff14';
        });
    }

    setInterval(updateTerminalStatus, 3000);

    // Apply typing effect to descriptions
    document.querySelectorAll('.lab-content p, .cert-content p').forEach(el => {
        const text = el.textContent;
        el.textContent = '';
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    typeWriterWithCursor(el, text);
                    observer.unobserve(el);
                }
            });
        });
        
        observer.observe(el);
    });

    // Particle effect for hero section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        const particleCanvas = document.createElement('canvas');
        particleCanvas.classList.add('particle-canvas');
        heroSection.appendChild(particleCanvas);
        
        const ctx = particleCanvas.getContext('2d');
        const particles = [];
        
        function initParticles() {
            particleCanvas.width = heroSection.offsetWidth;
            particleCanvas.height = heroSection.offsetHeight;
            
            for (let i = 0; i < 50; i++) {
                particles.push({
                    x: Math.random() * particleCanvas.width,
                    y: Math.random() * particleCanvas.height,
                    speed: 0.5 + Math.random() * 1,
                    size: 1 + Math.random() * 2
                });
            }
        }
        
        function animateParticles() {
            ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
            
            particles.forEach(particle => {
                particle.y -= particle.speed;
                if (particle.y < 0) {
                    particle.y = particleCanvas.height;
                }
                
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0, 243, 255, 0.5)';
                ctx.fill();
            });
            
            requestAnimationFrame(animateParticles);
        }
        
        initParticles();
        animateParticles();
        
        window.addEventListener('resize', initParticles);
    }

    // Add floating icons
    if (heroSection) {
        const icons = ['shield-alt', 'lock', 'code', 'server', 'bug'];
        icons.forEach((icon, index) => {
            const iconEl = document.createElement('i');
            iconEl.className = `fas fa-${icon} floating-icon`;
            iconEl.style.left = `${Math.random() * 90}%`;
            iconEl.style.top = `${Math.random() * 90}%`;
            iconEl.style.animationDelay = `${index * 0.5}s`;
            heroSection.appendChild(iconEl);
        });
    }

    // Add scanner effect
    cards.forEach(card => {
        const scanner = document.createElement('div');
        scanner.className = 'scanner-line';
        card.appendChild(scanner);
    });

    // Interactive particle system
    function createParticleSystem(container) {
        const canvas = document.createElement('canvas');
        canvas.className = 'particle-canvas';
        container.appendChild(canvas);
        const ctx = canvas.getContext('2d');

        let particles = [];
        let mouse = { x: 0, y: 0 };

        function resize() {
            canvas.width = container.offsetWidth;
            canvas.height = container.offsetHeight;
        }

        resize();
        window.addEventListener('resize', resize);

        container.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });

        function createParticle() {
            return {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 1,
                speedX: (Math.random() - 0.5) * 2,
                speedY: (Math.random() - 0.5) * 2
            };
        }

        // Initialize particles
        for (let i = 0; i < 100; i++) {
            particles.push(createParticle());
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                // Move towards mouse
                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 100) {
                    p.x += dx * 0.02;
                    p.y += dy * 0.02;
                }

                p.x += p.speedX;
                p.y += p.speedY;

                // Wrap around screen
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0, 243, 255, 0.5)';
                ctx.fill();
            });

            requestAnimationFrame(animate);
        }

        animate();
    }

    // Apply particle system to hero section
    const heroContainer = document.querySelector('.hero-section');
    if (heroContainer) {
        createParticleSystem(heroContainer);
    }
}); 