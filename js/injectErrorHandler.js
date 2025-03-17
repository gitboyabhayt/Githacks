// Script to inject error handler into all pages
document.addEventListener('DOMContentLoaded', () => {
    // Create error handler script element
    const errorHandlerScript = document.createElement('script');
    errorHandlerScript.src = '/js/errorHandler.js';
    errorHandlerScript.type = 'module';
    
    // Add data-component attribute for tracking
    errorHandlerScript.dataset.component = document.querySelector('meta[name="page-component"]')?.content || 
        document.title || 
        window.location.pathname;

    // Append to document head
    document.head.appendChild(errorHandlerScript);

    // Add error boundary div for fallback UI
    const errorBoundary = document.createElement('div');
    errorBoundary.id = 'error-boundary';
    errorBoundary.style.display = 'none';
    errorBoundary.innerHTML = `
        <div class="error-fallback">
            <h2>Something went wrong</h2>
            <p>We're sorry for the inconvenience. Please try refreshing the page.</p>
            <button onclick="window.location.reload()">Refresh Page</button>
        </div>
    `;
    document.body.appendChild(errorBoundary);
});