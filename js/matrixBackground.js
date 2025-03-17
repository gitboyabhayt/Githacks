// Matrix Rain Effect
class MatrixBackground {
    constructor() {
        this.canvas = document.getElementById('matrixBackground');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
        this.fontSize = 14;
        this.columns = 0;
        this.drops = [];
        
        // Initialize
        this.initialize();
        
        // Handle resize
        window.addEventListener('resize', () => this.initialize());
        
        // Start animation
        this.animate();
        
        // Handle visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        });
    }

    initialize() {
        // Set canvas size
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Calculate columns
        this.columns = Math.floor(this.canvas.width / this.fontSize);
        
        // Reset drops
        this.drops = [];
        for (let i = 0; i < this.columns; i++) {
            this.drops[i] = 1;
        }
    }

    draw(timestamp) {
        // Control frame rate
        if (timestamp - this.lastFrame < 1000 / this.frameRate) {
            return;
        }
        this.lastFrame = timestamp;

        // Semi-transparent black background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Green text
        this.ctx.fillStyle = '#0F0';
        this.ctx.font = `${this.fontSize}px monospace`;
        
        // Draw characters
        for (let i = 0; i < this.drops.length; i++) {
            const text = this.characters.charAt(
                Math.floor(Math.random() * this.characters.length)
            );
            
            this.ctx.fillText(
                text,
                i * this.fontSize,
                this.drops[i] * this.fontSize
            );
            
            if (this.drops[i] * this.fontSize > this.canvas.height && 
                Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            
            this.drops[i]++;
        }
    }

    animate = (timestamp) => {
        if (!this.paused) {
            this.draw(timestamp);
            requestAnimationFrame(this.animate);
        }
    }

    pause() {
        this.paused = true;
    }

    resume() {
        if (this.paused) {
            this.paused = false;
            this.animate();
        }
    }
}

// Initialize Matrix Background
const matrixBackground = new MatrixBackground();
