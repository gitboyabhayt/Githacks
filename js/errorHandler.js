// Global Error Handler
class ErrorHandler {
    constructor() {
        this.setupGlobalHandlers();
    }

    setupGlobalHandlers() {
        window.onerror = (msg, url, lineNo, columnNo, error) => {
            this.handleError(error || msg);
            return false;
        };

        window.addEventListener('unhandledrejection', (event) => {
            this.handleError(event.reason);
        });
    }

    handleError(error) {
        // Log error to console with stack trace
        console.error('Error:', error);
        
        // Show user-friendly error message
        this.showErrorNotification(this.getUserFriendlyMessage(error));
        
        // Track error for analytics
        this.trackError(error);
    }

    getUserFriendlyMessage(error) {
        // Map technical errors to user-friendly messages
        const errorMessages = {
            'NetworkError': 'Connection error. Please check your internet connection.',
            'TypeError': 'Something went wrong. Please try again.',
            'AuthError': 'Authentication failed. Please log in again.',
            'ValidationError': 'Please check your input and try again.',
            'default': 'An unexpected error occurred. Please try again later.'
        };

        const errorType = error.name || error.constructor.name;
        return errorMessages[errorType] || errorMessages.default;
    }

    showErrorNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'error-notification';
        notification.innerHTML = `
            <div class="error-content">
                <i class="fas fa-exclamation-circle"></i>
                <span>${message}</span>
                <button class="close-btn" aria-label="Close notification">×</button>
            </div>
        `;

        // Add to DOM
        document.body.appendChild(notification);

        // Add close button functionality
        const closeBtn = notification.querySelector('.close-btn');
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.remove();
            }
        }, 5000);
    }

    trackError(error) {
        // Implementation for error tracking/analytics
        const errorData = {
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            browser: this.getBrowserInfo(),
            os: this.getOSInfo(),
            errorType: error.name || error.constructor.name,
            componentInfo: this.getComponentInfo()
        };

        // Send to analytics service
        this.sendToAnalytics(errorData);
        
        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
            console.log('Error tracked:', errorData);
        }
    }

    getBrowserInfo() {
        const ua = navigator.userAgent;
        let browserInfo = {
            name: 'unknown',
            version: 'unknown'
        };

        if (ua.includes('Chrome')) browserInfo.name = 'Chrome';
        else if (ua.includes('Firefox')) browserInfo.name = 'Firefox';
        else if (ua.includes('Safari')) browserInfo.name = 'Safari';
        else if (ua.includes('Edge')) browserInfo.name = 'Edge';
        else if (ua.includes('Opera')) browserInfo.name = 'Opera';

        return browserInfo;
    }

    getOSInfo() {
        const ua = navigator.userAgent;
        let osInfo = {
            name: 'unknown',
            version: 'unknown'
        };

        if (ua.includes('Windows')) osInfo.name = 'Windows';
        else if (ua.includes('Mac')) osInfo.name = 'MacOS';
        else if (ua.includes('Linux')) osInfo.name = 'Linux';
        else if (ua.includes('Android')) osInfo.name = 'Android';
        else if (ua.includes('iOS')) osInfo.name = 'iOS';

        return osInfo;
    }

    getComponentInfo() {
        try {
            const currentScript = document.currentScript;
            const componentName = currentScript?.dataset?.component || 'unknown';
            return {
                name: componentName,
                path: window.location.pathname
            };
        } catch (error) {
            return {
                name: 'unknown',
                path: window.location.pathname
            };
        }
    }

    async sendToAnalytics(errorData) {
        try {
            const response = await fetch('/api/error-tracking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(errorData)
            });

            if (!response.ok) {
                console.warn('Failed to send error to analytics service');
            }
        } catch (error) {
            console.warn('Error sending data to analytics service:', error);
        }
    }
}

// Initialize error handler
const errorHandler = new ErrorHandler();

// Export for use in other modules
export default errorHandler;
