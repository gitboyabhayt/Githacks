// Lazy Loading Utility
const LazyLoader = {
    // Initialize Intersection Observer
    init() {
        const options = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    if (element.tagName.toLowerCase() === 'img') {
                        this.loadImage(element);
                    } else {
                        this.loadComponent(element);
                    }
                    observer.unobserve(element);
                }
            });
        }, options);

        return observer;
    },

    // Load image when it enters viewport
    loadImage(img) {
        const src = img.dataset.src;
        if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            img.classList.add('loaded');
        }
    },

    // Load component when it enters viewport
    loadComponent(element) {
        const component = element.dataset.component;
        if (component) {
            import(`/components/${component}.js`)
                .then(module => {
                    if (module.default) {
                        module.default(element);
                    }
                    element.removeAttribute('data-component');
                    element.classList.add('loaded');
                })
                .catch(error => console.error(`Error loading component ${component}:`, error));
        }
    },

    // Observe elements for lazy loading
    observe(elements) {
        const observer = this.init();
        elements.forEach(element => observer.observe(element));
    }
};

// Initialize lazy loading on page load
document.addEventListener('DOMContentLoaded', () => {
    // Lazy load images
    const lazyImages = document.querySelectorAll('img[data-src]');
    LazyLoader.observe(lazyImages);

    // Lazy load components
    const lazyComponents = document.querySelectorAll('[data-component]');
    LazyLoader.observe(lazyComponents);
});

export default LazyLoader;