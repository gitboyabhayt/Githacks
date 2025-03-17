// Storage Management Service
const StorageManager = {
    // LocalStorage Operations
    local: {
        set(key, value, expiry = null) {
            try {
                const item = {
                    value,
                    timestamp: new Date().getTime(),
                    expiry: expiry ? new Date().getTime() + expiry : null
                };
                localStorage.setItem(key, JSON.stringify(item));
                return true;
            } catch (e) {
                console.error('LocalStorage set error:', e);
                return false;
            }
        },

        get(key) {
            try {
                const item = JSON.parse(localStorage.getItem(key));
                if (!item) return null;

                if (item.expiry && new Date().getTime() > item.expiry) {
                    this.remove(key);
                    return null;
                }
                return item.value;
            } catch (e) {
                console.error('LocalStorage get error:', e);
                return null;
            }
        },

        remove(key) {
            localStorage.removeItem(key);
        },

        clear() {
            localStorage.clear();
        }
    },

    // SessionStorage Operations
    session: {
        set(key, value) {
            try {
                sessionStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                console.error('SessionStorage set error:', e);
                return false;
            }
        },

        get(key) {
            try {
                const value = sessionStorage.getItem(key);
                return value ? JSON.parse(value) : null;
            } catch (e) {
                console.error('SessionStorage get error:', e);
                return null;
            }
        },

        remove(key) {
            sessionStorage.removeItem(key);
        },

        clear() {
            sessionStorage.clear();
        }
    },

    // Utility Methods
    isStorageAvailable(type = 'localStorage') {
        try {
            const storage = window[type];
            const x = '__storage_test__';
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        } catch (e) {
            return false;
        }
    },

    getStorageUsage(type = 'localStorage') {
        const storage = type === 'localStorage' ? localStorage : sessionStorage;
        let total = 0;
        for (let key in storage) {
            if (storage.hasOwnProperty(key)) {
                total += (storage[key].length * 2) / 1024; // Size in KB
            }
        }
        return total;
    }
};

// Session Management Service
const SessionManager = {
    // Initialize session from localStorage
    init() {
        const session = StorageManager.local.get('githacks_session');
        if (session && this.isValidSession(session)) {
            return session;
        }
        this.clearSession();
        return null;
    },

    // Create new session
    create(userData) {
        const session = {
            userId: userData.id,
            username: userData.username,
            email: userData.email,
            avatar: userData.avatar || '/assets/avatar.png',
            token: userData.token,
            expiresAt: new Date().getTime() + (7 * 24 * 60 * 60 * 1000) // 7 days
        };
        StorageManager.local.set('githacks_session', session);
        StorageManager.session.set('current_session', session);
        this.updateUI(session);
        return session;
    },

    // Check if session is valid
    isValidSession(session) {
        return session && 
               session.token && 
               session.expiresAt && 
               new Date().getTime() < session.expiresAt;
    },

    // Clear session
    clearSession() {
        StorageManager.local.remove('githacks_session');
        StorageManager.session.remove('current_session');
        this.updateUI(null);
    },

    // Update UI based on session state
    updateUI(session) {
        const authLinks = document.querySelector('.auth-links');
        if (!authLinks) return;

        if (session) {
            authLinks.innerHTML = `
                <button class="theme-toggle">
                    <i class="fas fa-sun"></i>
                </button>
                <div class="user-menu">
                    <img src="${session.avatar}" alt="${session.username}" class="avatar">
                    <span class="username">${session.username}</span>
                    <div class="user-dropdown">
                        <a href="/dashboard" class="dropdown-item">
                            <i class="fas fa-chart-line"></i> Dashboard
                        </a>
                        <a href="/profile" class="dropdown-item">
                            <i class="fas fa-user"></i> Profile
                        </a>
                        <a href="#" class="dropdown-item" id="logout-btn">
                            <i class="fas fa-sign-out-alt"></i> Logout
                        </a>
                    </div>
                </div>`;

            // Add logout handler
            document.getElementById('logout-btn').addEventListener('click', (e) => {
                e.preventDefault();
                this.clearSession();
                window.location.href = '/';
            });

            // Add dropdown toggle
            const userMenu = document.querySelector('.user-menu');
            userMenu.addEventListener('click', () => {
                userMenu.classList.toggle('active');
            });
        } else {
            authLinks.innerHTML = `
                <button class="theme-toggle">
                    <i class="fas fa-sun"></i>
                </button>
                <a href="/auth/login.html" class="btn btn-text">Login</a>
                <a href="/auth/signup.html" class="btn btn-primary">Sign Up</a>`;
        }
    },

    // Check if user is authenticated
    isAuthenticated() {
        const session = this.init();
        return this.isValidSession(session);
    },

    // Get current user data
    getCurrentUser() {
        const session = this.init();
        return this.isValidSession(session) ? session : null;
    }
};

// Route Protection
function protectRoute() {
    if (!SessionManager.isAuthenticated()) {
        const currentPath = window.location.pathname;
        const protectedPaths = ['/books/', '/tools/', '/dashboard/', '/courses/'];
        
        if (protectedPaths.some(path => currentPath.startsWith(path))) {
            const returnUrl = encodeURIComponent(currentPath);
            window.location.href = `/auth/login.html?returnUrl=${returnUrl}`;
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    if (StorageManager.isStorageAvailable('localStorage') && 
        StorageManager.isStorageAvailable('sessionStorage')) {
        protectRoute();
        SessionManager.init();
    } else {
        console.error('Web Storage is not available');
    }
});
