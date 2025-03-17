class NotificationSystem {
    constructor() {
        this.notifications = [
            {
                id: 1,
                type: 'user',
                message: 'New user registration',
                time: 'Just now',
                read: false
            },
            {
                id: 2,
                type: 'security',
                message: 'Unusual login attempt detected',
                time: '5 minutes ago',
                read: false
            },
            {
                id: 3,
                type: 'system',
                message: 'System update available',
                time: '1 hour ago',
                read: true
            }
        ];
        this.initializeNotifications();
    }

    initializeNotifications() {
        const notificationBtn = document.querySelector('.notifications');
        notificationBtn.addEventListener('click', () => this.toggleNotificationPanel());
        
        // Update notification badge
        this.updateNotificationBadge();
    }

    toggleNotificationPanel() {
        const panel = this.createNotificationPanel();
        document.body.appendChild(panel);

        // Animate panel
        gsap.fromTo(panel,
            { opacity: 0, x: 300 },
            { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' }
        );

        // Close panel when clicking outside
        document.addEventListener('click', (e) => {
            if (!panel.contains(e.target) && !e.target.closest('.notifications')) {
                this.closeNotificationPanel(panel);
            }
        });
    }

    createNotificationPanel() {
        const panel = document.createElement('div');
        panel.className = 'notification-panel';
        panel.innerHTML = `
            <div class="notification-header">
                <h3>Notifications</h3>
                <button class="mark-all-read">Mark all as read</button>
            </div>
            <div class="notification-list">
                ${this.notifications.map(notif => this.createNotificationItem(notif)).join('')}
            </div>
        `;

        // Add event listeners
        panel.querySelector('.mark-all-read').addEventListener('click', () => {
            this.markAllAsRead();
            this.updateNotificationBadge();
        });

        return panel;
    }

    createNotificationItem(notification) {
        return `
            <div class="notification-item ${notification.read ? 'read' : ''}" data-id="${notification.id}">
                <div class="notification-icon ${notification.type}">
                    <i class="fas fa-${this.getNotificationIcon(notification.type)}"></i>
                </div>
                <div class="notification-content">
                    <p>${notification.message}</p>
                    <span>${notification.time}</span>
                </div>
                ${!notification.read ? '<div class="unread-marker"></div>' : ''}
            </div>
        `;
    }

    getNotificationIcon(type) {
        const icons = {
            user: 'user-plus',
            security: 'shield-alt',
            system: 'cog',
            course: 'graduation-cap'
        };
        return icons[type] || 'bell';
    }

    markAllAsRead() {
        this.notifications.forEach(notif => notif.read = true);
        document.querySelectorAll('.notification-item').forEach(item => {
            item.classList.add('read');
            item.querySelector('.unread-marker')?.remove();
        });
    }

    updateNotificationBadge() {
        const unreadCount = this.notifications.filter(n => !n.read).length;
        const badge = document.querySelector('.notification-badge');
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? 'flex' : 'none';
    }

    closeNotificationPanel(panel) {
        gsap.to(panel, {
            opacity: 0,
            x: 300,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => panel.remove()
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NotificationSystem();
}); 