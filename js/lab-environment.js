// Lab Environment Management
class LabEnvironment {
    constructor() {
        this.authOverlay = document.getElementById('authOverlay');
        this.labInterface = document.querySelector('.lab-interface');
        this.initializeEventListeners();
        this.initializeRealTimeUpdates();
    }

    initializeEventListeners() {
        // Lab cards interaction
        document.querySelectorAll('.lab-card').forEach(card => {
            card.addEventListener('click', () => this.handleLabLaunch(card));
        });

        // Lab controls
        document.querySelectorAll('.control-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleLabControl(e));
        });
    }

    handleLabLaunch(card) {
        // Add launch animation
        card.classList.add('launching');
        
        // Simulate lab environment loading
        setTimeout(() => {
            this.loadLabEnvironment(card.dataset.labId);
        }, 1000);
    }

    loadLabEnvironment(labId) {
        // Show loading indicator
        this.showLoadingIndicator();

        // Simulate lab environment setup
        setTimeout(() => {
            this.hideLoadingIndicator();
            this.showLabEnvironment();
        }, 2000);
    }

    showLoadingIndicator() {
        const loader = document.createElement('div');
        loader.className = 'lab-loader';
        document.body.appendChild(loader);
    }

    hideLoadingIndicator() {
        const loader = document.querySelector('.lab-loader');
        if (loader) loader.remove();
    }

    showLabEnvironment() {
        this.labInterface.classList.remove('hidden');
        requestAnimationFrame(() => {
            this.labInterface.classList.add('visible');
        });
    }

    initializeRealTimeUpdates() {
        // Simulate real-time updates
        setInterval(() => {
            this.updateActivityFeed();
        }, 5000);
    }

    updateActivityFeed() {
        const feed = document.querySelector('.feed-container');
        const activities = [
            'User456 completed Web Security Lab',
            'User789 started Network Security Lab',
            'User123 achieved new high score'
        ];

        const activity = activities[Math.floor(Math.random() * activities.length)];
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        activityItem.innerHTML = `
            <span class="time">Just now</span>
            <span class="event">${activity}</span>
        `;

        feed.insertBefore(activityItem, feed.firstChild);
        
        // Remove old activities
        if (feed.children.length > 10) {
            feed.removeChild(feed.lastChild);
        }
    }

    handleLabControl(e) {
        const button = e.currentTarget;
        const action = button.dataset.tooltip;

        switch(action) {
            case 'Reset Environment':
                this.resetLabEnvironment();
                break;
            case 'Save Progress':
                this.saveLabProgress();
                break;
            case 'Full Screen':
                this.toggleFullScreen();
                break;
        }
    }

    resetLabEnvironment() {
        const confirmation = confirm('Are you sure you want to reset the lab environment? All progress will be lost.');
        if (confirmation) {
            this.showNotification('Resetting environment...', 'info');
            // Simulate reset
            setTimeout(() => {
                this.showNotification('Environment reset successfully!', 'success');
                document.querySelectorAll('.progress-bar').forEach(bar => {
                    bar.style.setProperty('--progress', '0%');
                });
            }, 2000);
        }
    }

    saveLabProgress() {
        this.showNotification('Saving progress...', 'info');
        // Simulate save
        setTimeout(() => {
            this.showNotification('Progress saved successfully!', 'success');
        }, 1500);
    }

    toggleFullScreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `lab-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notification);
        setTimeout(() => {
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }, 100);
    }

    getNotificationIcon(type) {
        switch(type) {
            case 'success': return 'check-circle';
            case 'error': return 'exclamation-circle';
            case 'warning': return 'exclamation-triangle';
            default: return 'info-circle';
        }
    }
}

// Initialize lab environment
document.addEventListener('DOMContentLoaded', () => {
    const lab = new LabEnvironment();
}); 