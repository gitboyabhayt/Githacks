import { apiClient } from '../../../js/services/apiClient.js';

class CourseManager {
    constructor() {
        this.searchInput = document.querySelector('.search-input');
        this.levelFilter = document.querySelector('.filter-select:nth-child(1)');
        this.categoryFilter = document.querySelector('.filter-select:nth-child(2)');
        this.coursesGrid = document.querySelector('.courses-grid');
        
        this.initialize();
    }

    initialize() {
        // Search functionality
        this.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        
        // Filter functionality
        this.levelFilter.addEventListener('change', () => this.applyFilters());
        this.categoryFilter.addEventListener('change', () => this.applyFilters());

        // Initialize course cards with animations
        this.initializeCourseCards();
        
        // Load course data
        this.loadCourses();
    }

    handleSearch(query) {
        const cards = document.querySelectorAll('.course-card');
        query = query.toLowerCase();

        cards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const tags = Array.from(card.querySelectorAll('.course-tags span'))
                .map(tag => tag.textContent.toLowerCase());

            const matches = title.includes(query) || 
                          tags.some(tag => tag.includes(query));

            card.style.display = matches ? 'block' : 'none';
            
            if (matches) {
                this.animateCard(card);
            }
        });
    }

    applyFilters() {
        const level = this.levelFilter.value;
        const category = this.categoryFilter.value;
        const cards = document.querySelectorAll('.course-card');

        cards.forEach(card => {
            const cardLevel = card.querySelector('.course-level').textContent;
            const cardCategory = card.querySelector('.course-tags span').textContent;

            const levelMatch = level === 'All Levels' || cardLevel === level;
            const categoryMatch = category === 'All Categories' || cardCategory === category;

            card.style.display = (levelMatch && categoryMatch) ? 'block' : 'none';
            
            if (levelMatch && categoryMatch) {
                this.animateCard(card);
            }
        });
    }

    animateCard(card) {
        card.style.animation = 'none';
        card.offsetHeight; // Trigger reflow
        card.style.animation = 'cardAppear 0.5s ease forwards';
    }

    initializeCourseCards() {
        const cards = document.querySelectorAll('.course-card');
        
        cards.forEach(card => {
            // Hover effect
            card.addEventListener('mouseenter', () => {
                card.classList.add('hover-animation');
            });

            card.addEventListener('mouseleave', () => {
                card.classList.remove('hover-animation');
            });

            // Progress bar animation
            const progress = card.querySelector('.progress');
            if (progress) {
                const width = progress.style.width;
                progress.style.width = '0';
                setTimeout(() => {
                    progress.style.transition = 'width 1s ease-in-out';
                    progress.style.width = width;
                }, 100);
            }
        });
    }

    async loadCourses() {
        try {
            const { data: courses } = await apiClient.get('/courses');
            this.renderCourses(courses);
        } catch (error) {
            console.error('Error loading courses:', error);
            // Show error message to user
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.textContent = 'Failed to load courses. Please try again later.';
            this.coursesGrid.appendChild(errorMessage);
        }
    }

    renderCourses(courses) {
        // Implementation for rendering course cards
    }
}

// Initialize Course Manager
document.addEventListener('DOMContentLoaded', () => {
    const courseManager = new CourseManager();
});

// Add custom animations
document.addEventListener('DOMContentLoaded', () => {
    // Animate stats on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-stat');
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.progress-stat').forEach(stat => {
        observer.observe(stat);
    });

    // Animate course cards on scroll
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.course-card').forEach(card => {
        cardObserver.observe(card);
    });
});