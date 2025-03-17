class SecurityMonitor {
    constructor() {
        this.initializeMonitoring();
        this.setupWebSocket();
        this.updateInterval = null;
    }

    initializeMonitoring() {
        this.updateSecurityStats();
        this.initializeTerminal();
        this.startRealtimeUpdates();
    }

    setupWebSocket() {
        // Simulated WebSocket for real-time updates
        this.simulateWebSocketUpdates();
    }

    updateSecurityStats() {
        const threatNumber = document.querySelector('.stat-circle .stat-number');
        const statusIndicator = document.querySelector('.status-indicator');
        const lastScanTime = document.getElementById('lastScanTime');

        // Simulate real-time threat detection
        setInterval(() => {
            const threats = Math.floor(Math.random() * 5);
            threatNumber.textContent = threats;

            // Update status indicator
            if (threats > 3) {
                statusIndicator.innerHTML = `
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>High Alert: ${threats} Active Threats</span>
                `;
                statusIndicator.style.color = 'var(--admin-danger)';
            } else if (threats > 0) {
                statusIndicator.innerHTML = `
                    <i class="fas fa-exclamation-circle"></i>
                    <span>Moderate Alert: ${threats} Active Threats</span>
                `;
                statusIndicator.style.color = 'var(--admin-warning)';
            } else {
                statusIndicator.innerHTML = `
                    <i class="fas fa-shield-alt"></i>
                    <span>All Systems Operational</span>
                `;
                statusIndicator.style.color = 'var(--admin-success)';
            }
        }, 5000);

        // Update last scan time
        setInterval(() => {
            const now = new Date();
            lastScanTime.textContent = `Last Scan: ${now.toLocaleTimeString()}`;
        }, 60000);
    }

    initializeTerminal() {
        const terminal = document.getElementById('securityLog');
        const logTypes = ['info', 'warning', 'error', 'success'];
        const logMessages = [
            'System scan completed',
            'New user login detected',
            'Failed login attempt',
            'Firewall rules updated',
            'Database backup completed',
            'SSL certificate check passed',
            'Network traffic analysis running',
            'Security patches installed'
        ];

        // Add log entry with cyber effect
        const addLogEntry = (type, message) => {
            const entry = document.createElement('div');
            entry.className = `log-entry ${type}`;
            const timestamp = new Date().toLocaleTimeString();
            entry.innerHTML = `
                <span class="log-time">[${timestamp}]</span>
                <span class="log-type">[${type.toUpperCase()}]</span>
                <span class="log-message">${message}</span>
            `;
            terminal.insertBefore(entry, terminal.firstChild);

            // Limit log entries
            if (terminal.children.length > 50) {
                terminal.removeChild(terminal.lastChild);
            }
        };

        // Simulate real-time logs
        setInterval(() => {
            const type = logTypes[Math.floor(Math.random() * logTypes.length)];
            const message = logMessages[Math.floor(Math.random() * logMessages.length)];
            addLogEntry(type, message);
        }, 3000);
    }

    startRealtimeUpdates() {
        // Update threat list
        const threatList = document.getElementById('threatList');
        const threats = [
            'Suspicious IP Access',
            'Unusual Login Pattern',
            'Port Scan Detected',
            'DDoS Attempt',
            'Malware Signature',
            'SQL Injection Attempt'
        ];

        setInterval(() => {
            if (Math.random() > 0.7) {
                const threat = threats[Math.floor(Math.random() * threats.length)];
                const threatItem = document.createElement('div');
                threatItem.className = 'threat-item';
                threatItem.innerHTML = `
                    <i class="fas fa-radiation"></i>
                    <span>${threat}</span>
                    <span class="threat-time">Just now</span>
                `;
                threatList.insertBefore(threatItem, threatList.firstChild);

                // Limit threat list items
                if (threatList.children.length > 5) {
                    threatList.removeChild(threatList.lastChild);
                }
            }
        }, 4000);
    }

    simulateWebSocketUpdates() {
        // Simulate real-time data updates
        const events = [
            { type: 'security_alert', message: 'Unusual network activity detected' },
            { type: 'system_status', message: 'Memory usage spike detected' },
            { type: 'user_activity', message: 'Multiple failed login attempts' },
            { type: 'network_scan', message: 'Port scanning activity detected' }
        ];

        setInterval(() => {
            const event = events[Math.floor(Math.random() * events.length)];
            this.handleSecurityEvent(event);
        }, 8000);
    }

    handleSecurityEvent(event) {
        // Handle different types of security events
        console.log(`Security Event: ${event.type}`, event.message);
        // Implement real-time notification system here
    }
}

// Initialize Security Monitor
document.addEventListener('DOMContentLoaded', () => {
    const securityMonitor = new SecurityMonitor();
});