// Matrix Rain Effect
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('matrixBg');
    const ctx = canvas.getContext('2d');

    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Matrix characters with special cyber symbols
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*(){}[]<>~`|\\';
    const charArray = chars.split('');
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);
    
    // Color variations
    const colors = ['#0F0', '#00FF00', '#90EE90', '#98FB98'];
    let currentColor = 0;

    // Drawing function with enhanced effects
    function draw() {
        // Fade effect
        ctx.fillStyle = 'rgba(2, 12, 27, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Cycle through colors
        ctx.fillStyle = colors[currentColor];
        ctx.font = `${fontSize}px monospace`;

        for(let i = 0; i < drops.length; i++) {
            // Random character
            const text = charArray[Math.floor(Math.random() * charArray.length)];
            
            // Random brightness effect
            const alpha = Math.random() * 0.5 + 0.5;
            ctx.fillStyle = colors[currentColor].replace(')', `, ${alpha})`);
            
            // Draw character
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            // Reset drop when it reaches bottom
            if(drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }

        // Cycle colors slowly
        if(Math.random() > 0.99) {
            currentColor = (currentColor + 1) % colors.length;
        }
    }

    // Animation loop with variable speed
    let speed = 33;
    function animate() {
        draw();
        setTimeout(animate, speed);
    }
    animate();

    // Speed control based on scroll
    window.addEventListener('scroll', () => {
        const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        speed = 33 + (scrollPercent * 20); // Slow down as user scrolls
    });
}); 