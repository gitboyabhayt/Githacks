// API Service Layer
class ApiService {
    constructor() {
        this.baseURL = '/api/v1';
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        };
    }

    // Get CSRF token from meta tag
    getCsrfToken() {
        const token = document.querySelector('meta[name="csrf-token"]');
        return token ? token.getAttribute('content') : null;
    }

    // Add auth token to headers
    getAuthHeaders() {
        const token = localStorage.getItem('authToken');
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }

    // Handle API responses
    async handleResponse(response) {
        const contentType = response.headers.get('content-type');
        const isJson = contentType && contentType.includes('application/json');
        const data = isJson ? await response.json() : await response.text();

        if (!response.ok) {
            const error = (data && data.message) || response.statusText;
            throw new Error(error);
        }

        return data;
    }

    // Make API request with error handling and retries
    async request(endpoint, options = {}) {
        const retries = options.retries || 3;
        const retryDelay = options.retryDelay || 1000;
        let lastError;

        for (let i = 0; i < retries; i++) {
            try {
                const headers = {
                    ...this.defaultHeaders,
                    ...this.getAuthHeaders(),
                    'X-CSRF-TOKEN': this.getCsrfToken()
                };

                const response = await fetch(`${this.baseURL}${endpoint}`, {
                    ...options,
                    headers: { ...headers, ...options.headers }
                });

                return await this.handleResponse(response);
            } catch (error) {
                lastError = error;
                if (i < retries - 1) {
                    await new Promise(resolve => setTimeout(resolve, retryDelay));
                }
            }
        }

        throw lastError;
    }

    // API Methods
    async get(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'GET' });
    }

    async post(endpoint, data, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async put(endpoint, data, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async delete(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'DELETE' });
    }

    // Rate limiting and request queuing
    async withRateLimit(fn, limit = 1000) {
        const now = Date.now();
        if (this.lastRequest && (now - this.lastRequest) < limit) {
            await new Promise(resolve => 
                setTimeout(resolve, limit - (now - this.lastRequest))
            );
        }
        this.lastRequest = Date.now();
        return fn();
    }

    // Cache management
    setCacheItem(key, data, ttl = 300000) { // 5 minutes default TTL
        const item = {
            data,
            expires: Date.now() + ttl
        };
        localStorage.setItem(`cache_${key}`, JSON.stringify(item));
    }

    getCacheItem(key) {
        const item = localStorage.getItem(`cache_${key}`);
        if (!item) return null;

        const { data, expires } = JSON.parse(item);
        if (Date.now() > expires) {
            localStorage.removeItem(`cache_${key}`);
            return null;
        }

        return data;
    }

    // Cached API requests
    async getCached(endpoint, options = {}) {
        const cacheKey = `${endpoint}_${JSON.stringify(options)}`;
        const cached = this.getCacheItem(cacheKey);
        
        if (cached) return cached;

        const data = await this.get(endpoint, options);
        this.setCacheItem(cacheKey, data);
        return data;
    }
}

// Create and export API service instance
const apiService = new ApiService();
export default apiService;
