// Certification Page JavaScript

// DOM Elements
const certificationCards = document.getElementById('certificationCards');
const certificateModal = document.getElementById('certificateModal');
const closeModalBtn = document.getElementById('closeModal');
const downloadCertBtn = document.getElementById('downloadCertificate');
const shareCertBtn = document.getElementById('shareCertificate');
const certificatesCounter = document.getElementById('certificatesIssued');
const activeStudentsCounter = document.getElementById('activeStudents');

// Sample course data (to be replaced with actual API integration)
const courses = [
    {
        id: 'CEH001',
        title: 'Certified Ethical Hacker',
        description: 'Master ethical hacking and security testing',
        duration: '12 weeks',
        level: 'Advanced',
        completed: true
    },
    {
        id: 'PTS002',
        title: 'Penetration Testing Specialist',
        description: 'Learn advanced penetration testing techniques',
        duration: '8 weeks',
        level: 'Intermediate',
        completed: false
    },
    {
        id: 'CSF003',
        title: 'Cyber Security Fundamentals',
        description: 'Essential cybersecurity concepts and practices',
        duration: '6 weeks',
        level: 'Beginner',
        completed: true
    }
];

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    loadCertifications();
    initializeCounters();
    initializeEventListeners();
});

// Load certification cards
function loadCertifications() {
    courses.forEach(course => {
        const card = createCertificationCard(course);
        certificationCards.appendChild(card);
    });
}

// Create certification card
function createCertificationCard(course) {
    const card = document.createElement('div');
    card.className = 'certification-card glass-effect';
    
    card.innerHTML = `
        <div class="card-content">
            <h3 class="course-title">${course.title}</h3>
            <p class="course-description">${course.description}</p>
            <div class="course-meta">
                <span><i class="fas fa-clock"></i> ${course.duration}</span>
                <span><i class="fas fa-layer-group"></i> ${course.level}</span>
            </div>
            <div class="completion-status ${course.completed ? 'completed' : ''}">
                <i class="fas ${course.completed ? 'fa-check-circle' : 'fa-clock'}"></i>
                ${course.completed ? 'Completed' : 'In Progress'}
            </div>
            <button class="generate-cert-btn" ${!course.completed ? 'disabled' : ''}
                    onclick="generateCertificate('${course.id}')">
                <i class="fas fa-certificate"></i>
                Generate Certificate
            </button>
        </div>
    `;

    return card;
}

// Generate certificate
function generateCertificate(courseId) {
    const course = courses.find(c => c.id === courseId);
    if (!course || !course.completed) return;

    // Set certificate details
    document.getElementById('userName').textContent = 'John Doe'; // Replace with actual user name
    document.getElementById('courseName').textContent = course.title;
    document.getElementById('certDate').textContent = new Date().toLocaleDateString();
    document.getElementById('certificateId').textContent = `${courseId}-${Date.now()}`;

    // Generate QR Code (placeholder)
    generateQRCode();

    // Show modal with animation
    certificateModal.style.display = 'flex';
    gsap.from('.modal-content', {
        scale: 0.8,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out'
    });
}

// Generate QR Code (placeholder)
function generateQRCode() {
    const qrContainer = document.getElementById('certificateQR');
    // Implement actual QR code generation here
    qrContainer.innerHTML = '<div class="qr-placeholder"></div>';
}

// Initialize counters with animation
function initializeCounters() {
    animateCounter(certificatesCounter, 1500); // Sample target number
    animateCounter(activeStudentsCounter, 850); // Sample target number
}

// Animate counter
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100;
    const interval = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(interval);
        }
        element.textContent = Math.round(current);
    }, 20);
}

// Initialize event listeners
function initializeEventListeners() {
    // Close modal
    closeModalBtn.addEventListener('click', () => {
        gsap.to('.modal-content', {
            scale: 0.8,
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
                certificateModal.style.display = 'none';
                gsap.set('.modal-content', { clearProps: 'all' });
            }
        });
    });

    // Download certificate
    downloadCertBtn.addEventListener('click', () => {
        // Implement certificate download functionality
        console.log('Downloading certificate...');
    });

    // Share certificate
    shareCertBtn.addEventListener('click', () => {
        // Implement share functionality
        console.log('Sharing certificate...');
    });
}