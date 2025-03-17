// Course Data Management
const courseData = {
    'termux': [
        {
            id: 'tx1',
            title: 'Termux Fundamentals',
            description: 'Learn the basics of Termux, installation, and essential commands for ethical hacking',
            duration: '8h',
            progress: 0,
            completed: false,
            xp: 2000,
            link: ''
        },
        {
            id: 'tx2',
            title: 'Mobile Penetration Testing',
            description: 'Advanced penetration testing techniques using Termux on Android',
            duration: '12h',
            progress: 0,
            completed: false,
            xp: 2500,
            link: ''
        }
    ],
    'web-security': [
        {
            id: 'ws1',
            title: 'Web Security Fundamentals',
            description: 'Learn the basics of web security and common vulnerabilities.',
            duration: '4h',
            progress: 0,
            completed: false,
            xp: 1000,
            link: 'https://drive.google.com/drive/folders/11IS0PThJv2h1phJ6CI08JnADzHeE43Vx?usp=drive_link'
        },
        {
            id: 'ws2',
            title: 'XSS and CSRF Prevention',
            description: 'Master cross-site scripting and request forgery prevention.',
            duration: '6h',
            progress: 0,
            completed: false,
            xp: 1500,
            link: 'https://drive.google.com/drive/folders/1TgycmSooRZ2XKfnE2wxAnuJ11GRDUAJL?usp=drive_link'
        },
        {
            id: 'ws3',
            title: 'SQL Injection Defense',
            description: 'Learn to prevent and mitigate SQL injection attacks.',
            duration: '5h',
            progress: 0,
            completed: false,
            xp: 1200,
            link: 'https://drive.google.com/drive/folders/1czTw1SAcMq_JFKx1jR3bvJwbwv1oWHog?usp=drive_link'
        },
        {
            id: 'ws4',
            title: 'Secure Authentication',
            description: 'Implement secure user authentication and session management.',
            duration: '8h',
            progress: 0,
            completed: false,
            xp: 2000,
            link: 'https://drive.google.com/drive/folders/13KGNT2zNchEcsqOWGs6qOwS9byB__Dq5?usp=drive_link'
        },
        {
            id: 'ws5',
            title: 'API Security',
            description: 'Secure REST APIs and web services.',
            duration: '7h',
            progress: 0,
            completed: false,
            xp: 1800,
            link: 'https://drive.google.com/drive/folders/1t-hTqg0-02t0cnc5SypHnb8t3CfE3bXU?usp=drive_link'
        }
    ],
    'network-security': [
        {
            id: 'ns1',
            title: 'Network Fundamentals',
            description: 'Master essential networking concepts and protocols.',
            duration: '6h',
            progress: 0,
            completed: false,
            xp: 1500,
            link: ''
        },
        {
            id: 'ns2',
            title: 'Packet Analysis',
            description: 'Learn packet capture and analysis using Wireshark.',
            duration: '8h',
            progress: 0,
            completed: false,
            xp: 2000,
            link: ''
        },
        {
            id: 'ns3',
            title: 'Firewall Configuration',
            description: 'Configure and manage network firewalls.',
            duration: '5h',
            progress: 0,
            completed: false,
            xp: 1200,
            link: ''
        },
        {
            id: 'ns4',
            title: 'IDS/IPS Systems',
            description: 'Set up intrusion detection and prevention systems.',
            duration: '7h',
            progress: 0,
            completed: false,
            xp: 1800,
            link: ''
        },
        {
            id: 'ns5',
            title: 'VPN Implementation',
            description: 'Implement and secure virtual private networks.',
            duration: '6h',
            progress: 0,
            completed: false,
            xp: 1500,
            link: ''
        }
    ],
    'mobile-security': [
        {
            id: 'ms1',
            title: 'Mobile App Security Basics',
            description: 'Understand mobile application security fundamentals.',
            duration: '5h',
            progress: 0,
            completed: false,
            xp: 1200,
            link: ''
        },
        {
            id: 'ms2',
            title: 'Android Security',
            description: 'Secure Android applications and systems.',
            duration: '8h',
            progress: 0,
            completed: false,
            xp: 2000,
            link: ''
        },
        {
            id: 'ms3',
            title: 'iOS Security',
            description: 'Implement security in iOS applications.',
            duration: '8h',
            progress: 0,
            completed: false,
            xp: 2000,
            link: ''
        },
        {
            id: 'ms4',
            title: 'Mobile API Security',
            description: 'Secure mobile app APIs and data transmission.',
            duration: '6h',
            progress: 0,
            completed: false,
            xp: 1500,
            link: ''
        },
        {
            id: 'ms5',
            title: 'Mobile Pen Testing',
            description: 'Learn mobile application penetration testing.',
            duration: '10h',
            progress: 0,
            completed: false,
            xp: 2500,
            link: ''
        }
    ]
};

// User Progress Management
let userProgress = {
    totalXP: 0,
    completedCourses: new Set(),
    currentCourse: null
};

// Initialize Page
document.addEventListener('DOMContentLoaded', () => {
    loadUserProgress();
    renderCourses();
    initializeSearch();
    initializeInteractivity();
    initializeTermuxFeatures();
    initializeLabs();
    initializeCertifications();
    initializeTools();

    // Course Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const courseCards = document.querySelectorAll('.course-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');

            courseCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    card.style.animation = 'cardEntrance 0.5s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Wishlist Toggle
    const wishlistButtons = document.querySelectorAll('.wishlist-btn');
    wishlistButtons.forEach(button => {
        button.addEventListener('click', () => {
            const icon = button.querySelector('i');
            icon.classList.toggle('far');
            icon.classList.toggle('fas');
            button.classList.toggle('active');
        });
    });

    // Search Functionality
    const searchInput = document.querySelector('.cyber-input');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        courseCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });

    // Category Card Hover Effects
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
            card.style.boxShadow = '0 0 30px rgba(0,255,159,0.2)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = 'none';
        });
    });

    // Pagination
    const paginationButtons = document.querySelectorAll('.pagination-btn');
    const itemsPerPage = 6;
    let currentPage = 1;

    function showPage(pageNum) {
        const start = (pageNum - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        courseCards.forEach((card, index) => {
            if (index >= start && index < end) {
                card.style.display = 'block';
                card.style.animation = 'cardEntrance 0.5s ease forwards';
            } else {
                card.style.display = 'none';
            }
        });
    }

    paginationButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (!button.classList.contains('active')) {
                paginationButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                currentPage = parseInt(button.textContent);
                showPage(currentPage);
            }
        });
    });

    // Initialize first page
    showPage(1);
});

// Initialize Termux specific features
function initializeTermuxFeatures() {
    // Initialize terminal-like typing effect for Termux course descriptions
    const termuxDescriptions = document.querySelectorAll('.course-card[data-category="termux"] .course-description');
    
    termuxDescriptions.forEach(description => {
        const text = description.textContent;
        description.textContent = '';
        let index = 0;
        
        function typeText() {
            if (index < text.length) {
                description.textContent += text.charAt(index);
                index++;
                setTimeout(typeText, 50);
            }
        }
        
        // Start typing effect when card becomes visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    typeText();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(description);
    });

    // Tool tags hover effect
    const toolTags = document.querySelectorAll('.tool-tag');
    toolTags.forEach(tag => {
        tag.addEventListener('mouseenter', () => {
            tag.style.transform = 'translateY(-2px) scale(1.05)';
        });
        
        tag.addEventListener('mouseleave', () => {
            tag.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Initialize Interactivity
function initializeInteractivity() {
    // Section switching functionality
    const categoryButtons = document.querySelectorAll('.category-btn');
    const sections = document.querySelectorAll('.course-section');

    function switchSection(category) {
        // Remove active class from all buttons and sections
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        sections.forEach(section => section.classList.remove('active'));

        // Add active class to selected button and section
        const activeButton = document.querySelector(`.category-btn[data-category="${category}"]`);
        const activeSection = document.querySelector(`.course-section[data-category="${category}"]`);

        if (activeButton && activeSection) {
            activeButton.classList.add('active');
            activeSection.classList.add('active');

            // Trigger card animations
            const cards = activeSection.querySelectorAll('.course-card');
            cards.forEach((card, index) => {
                card.style.animationDelay = `${index * 0.1}s`;
                card.style.animation = `fadeInUp 0.5s ease forwards`;
            });
        }
    }

    // Add click event listeners to category buttons
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-category');
            switchSection(category);
        });
    });

    // Course card hover effects
    const courseCards = document.querySelectorAll('.course-card');
    courseCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            if (card.getAttribute('data-hover-effect') === 'lift') {
                card.style.transform = 'translateY(-10px)';
                card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = 'none';
        });
    });

    // Initialize with the first section active
    switchSection('web-security');

    // Pagination functionality
    const paginationButtons = document.querySelectorAll('.pagination-btn');
    const itemsPerPage = 10;
    let currentPage = 1;

    paginationButtons.forEach(button => {
        button.addEventListener('click', () => {
            paginationButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentPage = parseInt(button.textContent);
            loadCoursePage(currentPage);
        });
    });

    // Load More functionality
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            loadMoreBtn.classList.add('loading');
            // Simulate loading
            setTimeout(() => {
                currentPage++;
                loadCoursePage(currentPage, true);
                loadMoreBtn.classList.remove('loading');
            }, 1000);
        });
    }
}

// Load Course Page
function loadCoursePage(page, append = false) {
    const start = (page - 1) * 10;
    const end = start + 10;
    const currentTrack = document.querySelector('.category-btn.active')?.getAttribute('data-category') || 'web-security';
    const courses = courseData[currentTrack];

    if (courses) {
        const paginatedCourses = courses.slice(start, end);
        const grid = document.querySelector(`[data-track="${currentTrack}"]`);
        
        if (grid) {
            if (!append) {
                grid.innerHTML = '';
            }
            paginatedCourses.forEach(course => {
                const courseCard = createCourseCard(course, currentTrack);
                grid.insertAdjacentHTML('beforeend', courseCard);
            });
        }
    }
}

// Add animations
const animations = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

// Add the animations to the document
const style = document.createElement('style');
style.textContent = animations;
document.head.appendChild(style);

// Load User Progress
function loadUserProgress() {
    const savedProgress = localStorage.getItem('githacks_progress');
    if (savedProgress) {
        const parsed = JSON.parse(savedProgress);
        userProgress = {
            ...parsed,
            completedCourses: new Set(parsed.completedCourses)
        };
    }
}

// Save User Progress
function saveUserProgress() {
    localStorage.setItem('githacks_progress', JSON.stringify({
        ...userProgress,
        completedCourses: Array.from(userProgress.completedCourses)
    }));
}

// Render Courses
function renderCourses() {
    Object.entries(courseData).forEach(([track, courses]) => {
        const grid = document.querySelector(`[data-track="${track}"]`);
        if (!grid) return;

        grid.innerHTML = courses.map(course => createCourseCard(course, track)).join('');
        updateTrackProgress(track);
    });
}

// Create Course Card
function createCourseCard(course, track) {
    const completed = userProgress.completedCourses.has(course.id);
    const progress = completed ? 100 : course.progress;
    
    return `
        <div class="course-card" data-course-id="${course.id}">
            <h3 class="course-title">${course.title}</h3>
            <p class="course-description">${course.description}</p>
            <div class="course-meta">
                <div class="course-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                    <span class="duration"><i class="far fa-clock"></i> ${course.duration}</span>
                    <span class="xp"><i class="fas fa-star"></i> ${course.xp} XP</span>
                </div>
            </div>
            <a href="${course.link}" target="_blank" class="start-button" onclick="trackCourseStart('${course.id}', '${track}')">
                ${completed ? 'Continue Course' : 'Start Course'}
                <i class="fas fa-arrow-right"></i>
            </a>
        </div>
    `;
}

// Update Track Progress
function updateTrackProgress(track) {
    const courses = courseData[track];
    const completed = courses.filter(course => userProgress.completedCourses.has(course.id)).length;
    const total = courses.length;
    const progress = (completed / total) * 100;

    const progressBar = document.querySelector(`#${track}Progress`);
    const progressText = progressBar?.parentElement?.nextElementSibling;

    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }
    if (progressText) {
        progressText.textContent = `${completed}/${total} Completed`;
    }
}

// Mark Course as Complete
function markCourseComplete(courseId, track) {
    const course = courseData[track].find(c => c.id === courseId);
    if (!course) return;

    // Update local progress
    userProgress.completedCourses.add(courseId);
    userProgress.totalXP += course.xp;
    
    // Save progress
    saveUserProgress();
    
    // Update UI
    updateTrackProgress(track);
    showCompletionModal(course);
}

// Show Completion Modal
function showCompletionModal(course) {
    const modal = document.querySelector('.completion-modal');
    const xpEarned = document.getElementById('xpEarned');
    const achievementEarned = document.getElementById('achievementEarned');

    xpEarned.textContent = `+${course.xp} XP`;
    achievementEarned.textContent = `Completed: ${course.title}`;
    
    modal.style.display = 'flex';
}

// Close Completion Modal
function closeCompletionModal() {
    const modal = document.querySelector('.completion-modal');
    modal.style.display = 'none';
}

// Show Next Recommendation
function showNextRecommendation(currentTrack) {
    const tracks = Object.keys(courseData);
    const recommendations = [];

    tracks.forEach(track => {
        courseData[track].forEach(course => {
            if (!userProgress.completedCourses.has(course.id)) {
                recommendations.push({ ...course, track });
            }
        });
    });

    if (recommendations.length === 0) return;

    // Prioritize courses from the same track
    const sameTrackCourses = recommendations.filter(course => course.track === currentTrack);
    const nextCourse = sameTrackCourses.length > 0 ? sameTrackCourses[0] : recommendations[0];

    const panel = document.querySelector('.recommendation-panel');
    const title = document.getElementById('recommendedTitle');
    const description = document.getElementById('recommendedDescription');

    title.textContent = nextCourse.title;
    description.textContent = nextCourse.description;
    panel.style.display = 'block';

    userProgress.currentCourse = nextCourse;
}

// Start Recommended Course
function startRecommendedCourse() {
    if (!userProgress.currentCourse) return;
    
    const courseElement = document.querySelector(`[data-course-id="${userProgress.currentCourse.id}"]`);
    if (courseElement) {
        courseElement.scrollIntoView({ behavior: 'smooth' });
    }
}

// Initialize Search
function initializeSearch() {
    const searchInput = document.getElementById('courseSearch');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        Object.entries(courseData).forEach(([track, courses]) => {
            const grid = document.querySelector(`[data-track="${track}"]`);
            if (!grid) return;

            const filteredCourses = courses.filter(course =>
                course.title.toLowerCase().includes(searchTerm) ||
                course.description.toLowerCase().includes(searchTerm)
            );

            grid.innerHTML = filteredCourses.map(course => 
                createCourseCard(course, track)
            ).join('');
        });
    });
}

// Track when user starts a course
function trackCourseStart(courseId, track) {
    const course = courseData[track].find(c => c.id === courseId);
    if (!course) return;

    // Update progress if not already started
    if (course.progress === 0) {
        course.progress = 5; // Set initial progress
        saveUserProgress();
        updateTrackProgress(track);
    }
}

// Labs Section Functionality
function initializeLabs() {
    const labCards = document.querySelectorAll('.lab-card');
    const launchButtons = document.querySelectorAll('.btn-launch');

    labCards.forEach(card => {
        // Add hover effects
        card.addEventListener('mouseenter', () => {
            if (card.getAttribute('data-hover-effect') === 'lift') {
                card.style.transform = 'translateY(-10px)';
                card.style.boxShadow = '0 20px 40px rgba(var(--danger-rgb), 0.3)';
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = 'none';
        });
    });

    launchButtons.forEach(button => {
        button.addEventListener('click', () => {
            const labUrl = button.getAttribute('data-href');
            if (labUrl) {
                // Add loading state
                button.classList.add('loading');
                button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading Lab...';
                
                // Simulate lab environment loading
                setTimeout(() => {
                    window.location.href = labUrl;
                }, 1500);
            }
        });
    });
}

// Certification Paths Functionality
function initializeCertifications() {
    const certCards = document.querySelectorAll('.cert-card');
    const exploreButtons = document.querySelectorAll('.btn-explore');

    certCards.forEach(card => {
        // Progress bar animation
        const progressBar = card.querySelector('.cert-progress');
        if (progressBar) {
            const progress = progressBar.getAttribute('data-progress') || '0';
            progressBar.style.setProperty('--progress', `${progress}%`);
        }

        // Module expansion
        const modulesList = card.querySelector('.cert-modules');
        if (modulesList) {
            const modules = modulesList.querySelectorAll('li');
            modules.forEach((module, index) => {
                module.style.animationDelay = `${index * 0.1}s`;
            });
        }
    });

    exploreButtons.forEach(button => {
        button.addEventListener('click', () => {
            const pathUrl = button.getAttribute('data-href');
            if (pathUrl) {
                button.classList.add('loading');
                window.location.href = pathUrl;
            }
        });
    });
}

// Security Tools Functionality
function initializeTools() {
    const toolCards = document.querySelectorAll('.tool-card');
    const downloadButtons = document.querySelectorAll('.btn-download');

    toolCards.forEach(card => {
        // Tool card hover effects
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });

    downloadButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const toolUrl = button.getAttribute('data-download-url');
            if (toolUrl) {
                button.classList.add('loading');
                button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';

                try {
                    // Simulate download process
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    button.innerHTML = '<i class="fas fa-check"></i> Downloaded';
                    button.classList.remove('loading');
                    button.classList.add('success');
                } catch (error) {
                    button.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Retry';
                    button.classList.remove('loading');
                    button.classList.add('error');
                }
            }
        });
    });
}

// Initialize all sections when document is ready
document.addEventListener('DOMContentLoaded', function() {
    loadUserProgress();
    renderCourses();
    initializeSearch();
    initializeInteractivity();
    initializeTermuxFeatures();
    initializeLabs();
    initializeCertifications();
    initializeTools();
});
