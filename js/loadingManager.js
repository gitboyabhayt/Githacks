// Loading State Manager
class LoadingManager {
    constructor() {
        this.loadingStates = new Map();
        this.defaultOptions = {
            spinnerSize: 'medium', // small, medium, large
            text: 'Loading...',
            overlay: true,
            blur: true
        };
    }

    // Show loading state for an element
    show(elementId, options = {}) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const settings = { ...this.defaultOptions, ...options };
        
        // Create loading overlay
        const overlay = document.createElement('div');
        overlay.className = `loading-overlay ${settings.blur ? 'blur' : ''}`;
        
        // Create spinner
        const spinner = document.createElement('div');
        spinner.className = `spinner spinner-${settings.spinnerSize}`;
        
        // Create loading text
        const text = document.createElement('span');
        text.className = 'loading-text';
        text.textContent = settings.text;
        
        // Assemble loading indicator
        overlay.appendChild(spinner);
        overlay.appendChild(text);
        
        // Store original position if not static
        const originalPosition = window.getComputedStyle(element).position;
        if (originalPosition === 'static') {
            element.style.position = 'relative';
        }
        
        // Add overlay to element
        element.appendChild(overlay);
        element.setAttribute('aria-busy', 'true');
        
        // Store state
        this.loadingStates.set(elementId, {
            overlay,
            originalPosition,
            element
        });
    }

    // Hide loading state
    hide(elementId) {
        const state = this.loadingStates.get(elementId);
        if (!state) return;

        const { overlay, originalPosition, element } = state;
        
        // Remove loading overlay
        overlay.remove();
        
        // Restore original position
        if (originalPosition === 'static') {
            element.style.position = '';
        }
        
        element.setAttribute('aria-busy', 'false');
        this.loadingStates.delete(elementId);
    }

    // Show loading state for async operation
    async withLoading(elementId, asyncOperation, options = {}) {
        try {
            this.show(elementId, options);
            return await asyncOperation();
        } finally {
            this.hide(elementId);
        }
    }

    // Show global loading state
    showGlobal(options = {}) {
        const globalLoader = document.createElement('div');
        globalLoader.id = 'global-loader';
        globalLoader.className = 'global-loading-overlay';
        
        const spinner = document.createElement('div');
        spinner.className = `spinner spinner-${options.spinnerSize || 'large'}`;
        
        const text = document.createElement('span');
        text.className = 'loading-text';
        text.textContent = options.text || 'Loading...';
        
        globalLoader.appendChild(spinner);
        globalLoader.appendChild(text);
        
        document.body.appendChild(globalLoader);
        document.body.style.overflow = 'hidden';
    }

    // Hide global loading state
    hideGlobal() {
        const globalLoader = document.getElementById('global-loader');
        if (globalLoader) {
            globalLoader.remove();
            document.body.style.overflow = '';
        }
    }
}

// Initialize loading manager
const loadingManager = new LoadingManager();

// Export for use in other modules
export default loadingManager;
