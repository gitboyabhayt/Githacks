document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initMatrix();
    initTerminal();
    initFilters();
    initSearch();
    initCourseCards();
    initPreviewModals();
    initAuthButton();
});

// Matrix Background Animation
function initMatrix() {
    const canvas = document.getElementById('matrixBg');
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
    const charArray = chars.split('');
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);
    
    function draw() {
        ctx.fillStyle = 'rgba(2, 12, 27, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#0F0';
        ctx.font = `${fontSize}px monospace`;
        
        for(let i = 0; i < drops.length; i++) {
            const text = charArray[Math.floor(Math.random() * charArray.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if(drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    setInterval(draw, 33);
}

// Terminal Text Effect
function initTerminal() {
    const terminalText = document.getElementById('terminalText');
    const commands = [
        'Loading security modules...',
        'Initializing penetration tools...',
        'Scanning vulnerabilities...',
        'System ready for training.'
    ];
    let commandIndex = 0;
    let charIndex = 0;
    
    function typeCommand() {
        if (commandIndex < commands.length) {
            const currentCommand = commands[commandIndex];
            
            if (charIndex < currentCommand.length) {
                terminalText.textContent += currentCommand.charAt(charIndex);
                charIndex++;
                setTimeout(typeCommand, 50);
            } else {
                setTimeout(() => {
                    clearCommand();
                }, 2000);
            }
        }
    }
    
    function clearCommand() {
        const clear = setInterval(() => {
            if (terminalText.textContent.length > 0) {
                terminalText.textContent = terminalText.textContent.slice(0, -1);
            } else {
                clearInterval(clear);
                commandIndex++;
                charIndex = 0;
                if (commandIndex < commands.length) {
                    setTimeout(typeCommand, 500);
                } else {
                    commandIndex = 0;
                    setTimeout(typeCommand, 1000);
                }
            }
        }, 30);
    }
    
    typeCommand();
}

// Search and Filter Functionality
function initFilters() {
    const filterToggle = document.querySelector('.filter-toggle');
    const filterPanel = document.querySelector('.filter-panel');
    const filterSelects = document.querySelectorAll('.cyber-select');
    
    filterToggle.addEventListener('click', () => {
        filterPanel.classList.toggle('active');
    });
    
    // Close filter panel when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
            filterPanel.classList.remove('active');
        }
    });
    
    filterSelects.forEach(select => {
        select.addEventListener('change', filterCourses);
    });
}

function initSearch() {
    const searchInput = document.querySelector('.search-input');
    let debounceTimer;
    
    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            filterCourses();
        }, 300);
    });
}

function filterCourses() {
    const searchTerm = document.querySelector('.search-input').value.toLowerCase();
    const level = document.querySelector('select[class="cyber-select"]').value;
    const courses = document.querySelectorAll('.course-card');
    
    courses.forEach(course => {
        const title = course.querySelector('h3').textContent.toLowerCase();
        const courseLevel = course.dataset.level;
        const matchesSearch = title.includes(searchTerm);
        const matchesLevel = level === 'all' || courseLevel === level;
        
        if (matchesSearch && matchesLevel) {
            course.style.display = 'block';
            course.style.animation = 'fadeIn 0.5s ease';
        } else {
            course.style.display = 'none';
        }
    });
}

// Course Card Interactions
function initCourseCards() {
    const courseCards = document.querySelectorAll('.course-card');
    
    courseCards.forEach(card => {
        // Preview button functionality
        const previewBtn = card.querySelector('.preview-btn');
        if (previewBtn) {
            previewBtn.addEventListener('click', () => {
                const courseId = card.dataset.courseId;
                openPreviewModal(courseId);
            });
        }
        
        // Enroll button functionality
        const enrollBtn = card.querySelector('.cyber-button');
        if (enrollBtn) {
            enrollBtn.addEventListener('click', () => {
                const courseId = card.dataset.courseId;
                handleEnrollment(courseId);
            });
        }
    });
}

// Preview Modal
function initPreviewModals() {
    const modal = document.createElement('div');
    modal.className = 'preview-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close">&times;</button>
            <div class="modal-body"></div>
        </div>
    `;
    document.body.appendChild(modal);
    
    modal.querySelector('.modal-close').addEventListener('click', () => {
        modal.classList.remove('active');
    });
}

function openPreviewModal(courseId) {
    // Simulate fetching course preview data
    const previewData = {
        title: "Course Preview",
        video: "path/to/preview.mp4",
        description: "Course preview content..."
    };
    
    const modal = document.querySelector('.preview-modal');
    const modalBody = modal.querySelector('.modal-body');
    
    // Update modal content
    modalBody.innerHTML = `
        <h3>${previewData.title}</h3>
        <video src="${previewData.video}" controls></video>
        <p>${previewData.description}</p>
    `;
    
    modal.classList.add('active');
}

function handleEnrollment(courseId) {
    // Add enrollment logic here
    console.log(`Enrolling in course: ${courseId}`);
    // Show enrollment confirmation
    showNotification('Successfully enrolled in the course!');
}

// Utility Functions
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Auth Button Effects
function initAuthButton() {
    const authBtn = document.querySelector('.auth-btn');
    if (!authBtn) return;

    // Mouse move effect
    authBtn.addEventListener('mousemove', (e) => {
        const rect = authBtn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Create glow effect that follows cursor
        authBtn.style.setProperty('--x', `${x}px`);
        authBtn.style.setProperty('--y', `${y}px`);
    });

    // Click effect
    authBtn.addEventListener('click', (e) => {
        // Create ripple effect
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        const rect = authBtn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left - size/2}px`;
        ripple.style.top = `${e.clientY - rect.top - size/2}px`;
        
        authBtn.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => ripple.remove(), 600);

        // Add glitch effect
        authBtn.classList.add('glitch');
        setTimeout(() => authBtn.classList.remove('glitch'), 300);
    });
} 