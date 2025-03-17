// Performance Monitor for Core Web Vitals and Lighthouse metrics
class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.initializeObservers();
        this.trackCoreWebVitals();
    }

    initializeObservers() {
        // Performance Observer for LCP
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            this.metrics.lcp = lastEntry.startTime;
            this.logMetric('LCP', this.metrics.lcp);
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // Performance Observer for FID
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                this.metrics.fid = entry.processingStart - entry.startTime;
                this.logMetric('FID', this.metrics.fid);
            });
        }).observe({ entryTypes: ['first-input'] });

        // Performance Observer for CLS
        new PerformanceObserver((entryList) => {
            let clsValue = 0;
            entryList.getEntries().forEach(entry => {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            });
            this.metrics.cls = clsValue;
            this.logMetric('CLS', this.metrics.cls);
        }).observe({ entryTypes: ['layout-shift'] });
    }

    trackCoreWebVitals() {
        // Track Time to First Byte (TTFB)
        this.metrics.ttfb = performance.timing.responseStart - performance.timing.navigationStart;

        // Track First Contentful Paint (FCP)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            this.metrics.fcp = entries[0].startTime;
            this.logMetric('FCP', this.metrics.fcp);
        }).observe({ entryTypes: ['paint'] });

        // Track Time to Interactive (TTI)
        this.calculateTTI();
    }

    calculateTTI() {
        const ttiPolyfill = async () => {
            try {
                const tti = await import('tti-polyfill');
                tti.getFirstConsistentlyInteractive().then(tti => {
                    this.metrics.tti = tti;
                    this.logMetric('TTI', this.metrics.tti);
                });
            } catch (error) {
                console.warn('TTI polyfill failed to load:', error);
            }
        };
        ttiPolyfill();
    }

    logMetric(metricName, value) {
        console.log(`${metricName}: ${value}`);
        // Here you can implement your own analytics service to track these metrics
        this.sendToAnalytics(metricName, value);
    }

    sendToAnalytics(metricName, value) {
        // Implement your analytics service integration here
        // Example: Google Analytics 4 event
        if (typeof gtag === 'function') {
            gtag('event', 'web_vital', {
                metric_name: metricName,
                value: value,
                page_path: window.location.pathname
            });
        }
    }

    generateReport() {
        return {
            url: window.location.href,
            timestamp: new Date().toISOString(),
            metrics: this.metrics,
            userAgent: navigator.userAgent,
            deviceType: this.getDeviceType(),
            connectionType: this.getConnectionType()
        };
    }

    getDeviceType() {
        const ua = navigator.userAgent;
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
            return 'tablet';
        }
        if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
            return 'mobile';
        }
        return 'desktop';
    }

    getConnectionType() {
        if ('connection' in navigator) {
            const conn = navigator.connection;
            return {
                effectiveType: conn.effectiveType,
                downlink: conn.downlink,
                rtt: conn.rtt,
                saveData: conn.saveData
            };
        }
        return null;
    }
}

// Initialize performance monitoring when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.performanceMonitor = new PerformanceMonitor();
});