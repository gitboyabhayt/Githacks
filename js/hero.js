class HeroSection {
    constructor() {
        this.init();
    }

    init() {
        this.setupGreeting();
        this.initMatrixRain();
        this.setupScrollReveal();
        this.initializeEffects();
    }

    setupGreeting() {
        const username = localStorage.getItem('username') || 'Hacker';
        const greetingElement = document.querySelector('.username');
        const hour = new Date().getHours();
        let greeting = 'Welcome';
        
        if (hour < 12) greeting = 'Good morning';
        else if (hour < 18) greeting = 'Good afternoon';
        else greeting = 'Good evening';
        
        document.querySelector('.greeting').textContent = `${greeting},`;
        greetingElement.textContent = username;
    }

    initMatrixRain() {
        const canvas = document.getElementById('matrixRain');
        const ctx = canvas.getContext('2d');
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const characters = '01';
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = new Array(Math.floor(columns)).fill(1);
        
        function draw() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#0f0';
            ctx.font = `${fontSize}px monospace`;
            
            for (let i = 0; i < drops.length; i++) {
                const text = characters[Math.floor(Math.random() * characters.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }

        setInterval(draw, 33);
        
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    setupScrollReveal() {
        const features = document.querySelectorAll('.feature');
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            },
            { threshold: 0.1 }
        );
        
        features.forEach(feature => observer.observe(feature));
    }

    initializeEffects() {
        this.initParallax();
        this.initButtonEffects();
        this.initFeatureHover();
    }

    initParallax() {
        document.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth - 0.5;
            const mouseY = e.clientY / window.innerHeight - 0.5;
            
            gsap.to('.hero__title', {
                duration: 0.5,
                x: mouseX * 20,
                y: mouseY * 20,
                ease: 'power2.out'
            });
            
            gsap.to('.feature', {
                duration: 0.5,
                x: mouseX * 10,
                y: mouseY * 10,
                stagger: 0.1,
                ease: 'power2.out'
            });
        });
    }

    initButtonEffects() {
        const buttons = document.querySelectorAll('.cta-button');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                gsap.to(button, {
                    duration: 0.3,
                    scale: 1.05,
                    ease: 'power2.out'
                });
            });
            
            button.addEventListener('mouseleave', () => {
                gsap.to(button, {
                    duration: 0.3,
                    scale: 1,
                    ease: 'power2.out'
                });
            });
        });
    }

    initFeatureHover() {
        const features = document.querySelectorAll('.feature');
        
        features.forEach(feature => {
            feature.addEventListener('mouseenter', () => {
                const icon = feature.querySelector('.feature__icon');
                gsap.to(icon, {
                    duration: 0.3,
                    scale: 1.2,
                    ease: 'back.out'
                });
            });
            
            feature.addEventListener('mouseleave', () => {
                const icon = feature.querySelector('.feature__icon');
                gsap.to(icon, {
                    duration: 0.3,
                    scale: 1,
                    ease: 'back.out'
                });
            });
        });
    }
}

export const heroSection = new HeroSection();
