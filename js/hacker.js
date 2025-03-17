// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const terminal = document.getElementById('hacker-terminal');
const terminalOutput = document.querySelector('.terminal-output');
const terminalInput = document.querySelector('.terminal-input');
const matrixCanvas = document.getElementById('matrix-canvas');
const heroText = document.querySelector('.hero-text');

// Theme Toggle
themeToggle.addEventListener('click', () => {
    document.documentElement.setAttribute(
        'data-theme',
        document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
    );
    themeToggle.querySelector('i').classList.toggle('fa-sun');
    themeToggle.querySelector('i').classList.toggle('fa-moon');
});

// Matrix Background Effect
function initMatrix() {
    const ctx = matrixCanvas.getContext('2d');
    let width = matrixCanvas.width = window.innerWidth;
    let height = matrixCanvas.height = window.innerHeight;

    const columns = Math.floor(width / 20);
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンヴ';
    const drops = Array(columns).fill(1);

    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, width, height);
        
        ctx.fillStyle = '#0F0';
        ctx.font = '15px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(text, i * 20, drops[i] * 20);
            
            if (drops[i] * 20 > height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    window.addEventListener('resize', () => {
        width = matrixCanvas.width = window.innerWidth;
        height = matrixCanvas.height = window.innerHeight;
    });

    setInterval(draw, 33);
}

// Typing Effect
function typeText(element, text, speed = 100) {
    let index = 0;
    element.textContent = '';
    
    return new Promise(resolve => {
        function type() {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(type, speed);
            } else {
                resolve();
            }
        }
        type();
    });
}

// Terminal Commands
const commands = {
    help: () => `Available commands:
    help - Show this help message
    courses - View available courses
    tools - Browse hacking tools
    community - Join our community
    clear - Clear terminal`,
    
    courses: () => `Available Courses:
    1. Ethical Hacking Fundamentals
    2. Web Security & Penetration Testing
    3. Network Security Advanced
    4. Mobile Security Essentials`,
    
    tools: () => `Hacking Tools:
    1. Network Analyzers
    2. Vulnerability Scanners
    3. Exploitation Frameworks
    4. Security Testing Tools`,
    
    community: () => `Join our community:
    Discord: discord.gg/githacks
    Forum: forum.githacks.com
    GitHub: github.com/githacks`,
    
    clear: () => {
        terminalOutput.innerHTML = '';
        return '';
    }
};

// Handle Terminal Input
terminalInput.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
        const command = terminalInput.value.toLowerCase().trim();
        terminalInput.value = '';
        
        const output = document.createElement('div');
        output.classList.add('command-line');
        output.innerHTML = `<span class="prompt">></span> ${command}`;
        terminalOutput.appendChild(output);
        
        const response = document.createElement('div');
        response.classList.add('response');
        
        if (commands[command]) {
            response.textContent = commands[command]();
        } else {
            response.textContent = `Command not found: ${command}. Type 'help' for available commands.`;
        }
        
        terminalOutput.appendChild(response);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
});

// Live Stats Counter
function animateValue(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            clearInterval(timer);
            current = end;
        }
        element.textContent = Math.floor(current).toLocaleString();
    }, 16);
}

// Initialize Stats
function initStats() {
    const stats = {
        'learners-count': 10000,
        'courses-count': 50,
        'tools-count': 100
    };
    
    Object.entries(stats).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            animateValue(element, 0, value, 2000);
        }
    });
}

// Scroll Animation Observer
const observeElements = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        observer.observe(element);
    });
};

// Scroll Animations
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
}

// Initialize Everything
document.addEventListener('DOMContentLoaded', () => {
    initMatrix();
    initStats();
    initScrollAnimations();
    observeElements();
    
    // Initial terminal message
    const response = document.createElement('div');
    response.classList.add('response');
    response.textContent = 'Welcome to GITHACKS Terminal. Type "help" for available commands.';
    terminalOutput.appendChild(response);
});
