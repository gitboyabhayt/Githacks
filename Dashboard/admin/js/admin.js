class AdminDashboard {
    constructor() {
        this.initializeEventListeners();
        this.setupActivityList();
        this.initializeNotifications();
        this.initializeMobileMenu();
    }

    initializeEventListeners() {
        // Navigation handling
        document.querySelectorAll('.nav-group a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNavigation(link);
            });
        });

        // Search functionality
        const searchInput = document.querySelector('.search-bar input');
        searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        // Notification click handler
        document.querySelector('.notifications').addEventListener('click', () => {
            this.showNotificationsPanel();
        });

        // Profile click handler
        document.querySelector('.admin-profile').addEventListener('click', () => {
            this.showProfileMenu();
        });
    }

    handleNavigation(link) {
        // Remove active class from all links
        document.querySelectorAll('.nav-group a').forEach(a => {
            a.parentElement.classList.remove('active');
        });

        // Add active class to clicked link
        link.parentElement.classList.add('active');
    }

    handleSearch(query) {
        // Implement search functionality
        console.log('Searching for:', query);
    }

    setupActivityList() {
        // Sample activity data
        const activities = [
            { type: 'user', text: 'New user registration', time: '2 minutes ago' },
            { type: 'course', text: 'Course content updated', time: '1 hour ago' },
            { type: 'security', text: 'Security alert detected', time: '3 hours ago' }
        ];

        const activityList = document.querySelector('.activity-list');
        activities.forEach(activity => {
            activityList.appendChild(this.createActivityItem(activity));
        });
    }

    createActivityItem(activity) {
        const item = document.createElement('div');
        item.className = 'activity-item';
        item.innerHTML = `
            <div class="activity-icon ${activity.type}">
                <i class="fas fa-${this.getActivityIcon(activity.type)}"></i>
            </div>
            <div class="activity-details">
                <p>${activity.text}</p>
                <span>${activity.time}</span>
            </div>
        `;
        return item;
    }

    getActivityIcon(type) {
        const icons = {
            user: 'user-plus',
            course: 'graduation-cap',
            security: 'shield-alt'
        };
        return icons[type] || 'info-circle';
    }

    initializeNotifications() {
        // Sample notifications
        this.notifications = [
            { id: 1, text: 'New user registration', time: 'Just now', read: false },
            { id: 2, text: 'System update available', time: '5 min ago', read: false },
            { id: 3, text: 'Security alert', time: '1 hour ago', read: true }
        ];
    }

    showNotificationsPanel() {
        const panel = document.createElement('div');
        panel.className = 'notification-panel';
        panel.innerHTML = `
            <div class="notification-header">
                <h3>Notifications</h3>
                <button class="mark-all-read">Mark all as read</button>
            </div>
            <div class="notification-list">
                ${this.notifications.map(n => this.createNotificationItem(n)).join('')}
            </div>
        `;
        document.body.appendChild(panel);

        // Close panel when clicking outside
        document.addEventListener('click', (e) => {
            if (!panel.contains(e.target) && !e.target.closest('.notifications')) {
                panel.remove();
            }
        });
    }

    createNotificationItem(notification) {
        return `
            <div class="notification-item ${notification.read ? 'read' : ''}">
                <p>${notification.text}</p>
                <span>${notification.time}</span>
            </div>
        `;
    }

    initializeMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const sidebar = document.querySelector('.admin-sidebar');

        mobileToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            document.body.classList.toggle('sidebar-open');
        });

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                if (!sidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
                    sidebar.classList.remove('active');
                    document.body.classList.remove('sidebar-open');
                }
            }
        });
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AdminDashboard();

    // Theme Toggle Functionality
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme) {
        document.body.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'light') {
            themeToggle.classList.add('active');
        }
    }

    themeToggle.addEventListener('click', () => {
        themeToggle.classList.toggle('active');
        let theme = 'dark';
        if (themeToggle.classList.contains('active')) {
            theme = 'light';
        }
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        // Trigger glitch animation
        themeToggle.classList.add('glitch');
        setTimeout(() => {
            themeToggle.classList.remove('glitch');
        }, 300);
    });

    // Stats Card Animation
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        const statNumber = card.querySelector('.stat-number');
        const endValue = parseInt(statNumber.getAttribute('data-value'));
        animateValue(statNumber, 0, endValue, 2000);
    });

    // Recent Activity List
    const activityList = document.querySelector('.activity-list');
    const activities = [
        "John Doe completed the CEH certification.",
        "Alice Smith started the CompTIA Security+ course.",
        "Michael Chen downloaded the Nmap Scanner tool."
    ];

    activities.forEach(activity => {
        const li = document.createElement('li');
        li.textContent = activity;
        activityList.appendChild(li);
    });
});

// Animate value function
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.textContent = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
} 