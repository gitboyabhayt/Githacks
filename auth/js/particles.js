class ParticleSystem {
    constructor() {
        this.particles = [];
        this.container = document.getElementById('particles');
        this.maxParticles = 50;
        this.init();
    }

    init() {
        this.createParticles();
        this.animate();
        window.addEventListener('resize', () => this.handleResize());
    }

    createParticles() {
        for (let i = 0; i < this.maxParticles; i++) {
            this.createParticle();
        }
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random size between 2-6px
        const size = Math.random() * 4 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random position
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // Random animation duration between 3-7s
        particle.style.animationDuration = `${Math.random() * 4 + 3}s`;
        
        this.container.appendChild(particle);
        this.particles.push(particle);
        
        // Remove particle after animation
        particle.addEventListener('animationend', () => {
            particle.remove();
            this.particles = this.particles.filter(p => p !== particle);
            this.createParticle();
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (this.particles.length < this.maxParticles) {
            this.createParticle();
        }
    }

    handleResize() {
        // Clear existing particles
        this.particles.forEach(p => p.remove());
        this.particles = [];
        
        // Create new particles
        this.createParticles();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ParticleSystem();
}); 