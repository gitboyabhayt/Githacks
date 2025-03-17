// Animations for Certification Page

// Matrix Background Animation
class MatrixBackground {
    constructor() {
        this.canvas = document.getElementById('matrixBg');
        this.ctx = this.canvas.getContext('2d');
        this.initialize();
    }

    initialize() {
        // Set canvas size
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        // Matrix character set
        this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';
        this.fontSize = 14;
        this.columns = Math.floor(this.canvas.width / this.fontSize);
        this.drops = Array(this.columns).fill(1);

        // Start animation
        this.animate();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    animate() {
        // Semi-transparent black to create fade effect
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Green text
        this.ctx.fillStyle = '#0F0';
        this.ctx.font = `${this.fontSize}px monospace`;

        // Draw characters
        for (let i = 0; i < this.drops.length; i++) {
            const char = this.chars[Math.floor(Math.random() * this.chars.length)];
            const x = i * this.fontSize;
            const y = this.drops[i] * this.fontSize;

            this.ctx.fillText(char, x, y);

            // Reset drop or move it down
            if (y > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            this.drops[i]++;
        }

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize Matrix Background
const matrix = new MatrixBackground();

// Glitch Text Effect
class GlitchText {
    constructor() {
        this.glitchTexts = document.querySelectorAll('.glitch-text');
        this.initialize();
    }

    initialize() {
        this.glitchTexts.forEach(text => {
            text.addEventListener('mouseover', () => this.startGlitch(text));
            text.addEventListener('mouseout', () => this.stopGlitch(text));
        });
    }

    startGlitch(element) {
        if (element.dataset.glitching === 'true') return;
        element.dataset.glitching = 'true';

        const originalText = element.textContent;
        const glitchChars = '!@#$%^&*';
        let glitchInterval;

        glitchInterval = setInterval(() => {
            if (element.dataset.glitching !== 'true') {
                clearInterval(glitchInterval);
                element.textContent = originalText;
                return;
            }

            let glitchedText = '';
            for (let i = 0; i < originalText.length; i++) {
                if (Math.random() < 0.1) {
                    glitchedText += glitchChars[Math.floor(Math.random() * glitchChars.length)];
                } else {
                    glitchedText += originalText[i];
                }
            }
            element.textContent = glitchedText;
        }, 50);
    }

    stopGlitch(element) {
        element.dataset.glitching = 'false';
    }
}

// Initialize Glitch Text Effect
const glitch = new GlitchText();

// Scroll Animations
document.addEventListener('DOMContentLoaded', () => {
    // Fade in elements on scroll
    const fadeElements = document.querySelectorAll('.certification-card, .counter-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                gsap.from(entry.target, {
                    opacity: 0,
                    y: 50,
                    duration: 0.8,
                    ease: 'power2.out'
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    fadeElements.forEach(element => observer.observe(element));

    // Testimonials marquee animation
    const marquee = document.querySelector('.marquee-content');
    if (marquee) {
        gsap.to(marquee, {
            x: '-100%',
            duration: 20,
            ease: 'none',
            repeat: -1
        });
    }
});