// Notification System
class NotificationManager {
    constructor() {
        this.initializeNotifications();
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification animate__animated animate__fadeInRight';
        notification.innerHTML = `
            <i class="fas fa-info-circle"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(notification);

        // ... Rest of your notification code ...
    }

    // ... Other notification methods ...
} 