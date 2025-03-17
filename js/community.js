// Community System with Secure User Interactions
const CommunitySystem = {
    // Initialize community features
    init() {
        this.bindEvents();
        this.loadPosts();
        this.setupRealTimeUpdates();
    },

    // Bind event listeners
    bindEvents() {
        // New post form
        const postForm = document.getElementById('postForm');
        if (postForm) {
            postForm.addEventListener('submit', (e) => {
                e.preventDefault();
                if (this.validatePost(postForm)) {
                    this.submitPost(postForm);
                }
            });
        }

        // Search functionality
        const searchInput = document.querySelector('.community-search');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce(() => {
                this.searchPosts(searchInput.value);
            }, 300));
        }

        // Category filters
        document.querySelectorAll('.category-filter').forEach(filter => {
            filter.addEventListener('click', () => {
                this.filterByCategory(filter.dataset.category);
            });
        });

        // Sort options
        document.querySelectorAll('.sort-option').forEach(option => {
            option.addEventListener('click', () => {
                this.sortPosts(option.dataset.sort);
            });
        });
    },

    // Validate post
    validatePost(form) {
        const title = form.querySelector('[name="title"]').value.trim();
        const content = form.querySelector('[name="content"]').value.trim();
        const category = form.querySelector('[name="category"]').value;

        // Check authentication
        if (!SessionManager.isAuthenticated()) {
            this.showError('Please log in to create a post');
            return false;
        }

        // Check rate limiting
        if (!SecurityMiddleware.rateLimiter.check('post', 5, 300000)) {
            this.showError('Too many posts. Please wait a few minutes.');
            return false;
        }

        // Validate fields
        if (!title || !content || !category) {
            this.showError('All fields are required');
            return false;
        }

        if (title.length < 5 || title.length > 100) {
            this.showError('Title must be between 5 and 100 characters');
            return false;
        }

        if (content.length < 20 || content.length > 5000) {
            this.showError('Content must be between 20 and 5000 characters');
            return false;
        }

        // Check for spam
        if (this.isSpam(title) || this.isSpam(content)) {
            this.showError('Your post was flagged as spam');
            return false;
        }

        return true;
    },

    // Submit new post
    async submitPost(form) {
        try {
            const user = SessionManager.getCurrentUser();
            const formData = new FormData(form);
            
            // Sanitize inputs
            const post = {
                id: Date.now(),
                title: SecurityMiddleware.sanitizer.sanitizeInput(formData.get('title')),
                content: SecurityMiddleware.sanitizer.sanitizeInput(formData.get('content')),
                category: formData.get('category'),
                author: user.username,
                avatar: user.avatar,
                timestamp: new Date().toISOString(),
                likes: 0,
                comments: []
            };

            // Store post (demo implementation)
            let posts = JSON.parse(localStorage.getItem('community_posts') || '[]');
            posts.unshift(post);
            localStorage.setItem('community_posts', JSON.stringify(posts));

            // Clear form and reload posts
            form.reset();
            this.loadPosts();
            this.showSuccess('Post created successfully!');
        } catch (error) {
            console.error('Error creating post:', error);
            this.showError('Failed to create post');
        }
    },

    // Load posts with filtering and sorting
    loadPosts(filters = {}) {
        try {
            let posts = JSON.parse(localStorage.getItem('community_posts') || '[]');
            
            // Apply filters
            if (filters.category) {
                posts = posts.filter(post => post.category === filters.category);
            }
            if (filters.search) {
                const search = filters.search.toLowerCase();
                posts = posts.filter(post => 
                    post.title.toLowerCase().includes(search) ||
                    post.content.toLowerCase().includes(search)
                );
            }

            // Apply sorting
            if (filters.sort) {
                switch (filters.sort) {
                    case 'recent':
                        posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                        break;
                    case 'popular':
                        posts.sort((a, b) => b.likes - a.likes);
                        break;
                    case 'comments':
                        posts.sort((a, b) => b.comments.length - a.comments.length);
                        break;
                }
            }

            // Render posts
            const postsContainer = document.querySelector('.posts-list');
            if (postsContainer) {
                postsContainer.innerHTML = posts.map(post => this.renderPost(post)).join('');
            }
        } catch (error) {
            console.error('Error loading posts:', error);
            this.showError('Failed to load posts');
        }
    },

    // Render single post
    renderPost(post) {
        const timestamp = new Date(post.timestamp).toLocaleString();
        return `
            <article class="post card fade-in" data-id="${post.id}">
                <div class="post-header">
                    <img src="${post.avatar}" alt="${post.author}" class="avatar">
                    <div class="post-meta">
                        <h3 class="post-title">${post.title}</h3>
                        <div class="post-info">
                            <span class="author">${post.author}</span>
                            <span class="timestamp">${timestamp}</span>
                            <span class="category">${post.category}</span>
                        </div>
                    </div>
                    ${this.renderPostActions(post)}
                </div>
                <div class="post-content">
                    ${post.content}
                </div>
                <div class="post-footer">
                    <button class="btn-like" onclick="CommunitySystem.likePost(${post.id})">
                        <i class="fas fa-heart"></i> ${post.likes}
                    </button>
                    <button class="btn-comment" onclick="CommunitySystem.showComments(${post.id})">
                        <i class="fas fa-comment"></i> ${post.comments.length}
                    </button>
                    <button class="btn-report" onclick="CommunitySystem.reportPost(${post.id})">
                        <i class="fas fa-flag"></i> Report
                    </button>
                </div>
                <div class="comments-container" id="comments-${post.id}"></div>
            </article>`;
    },

    // Render post actions
    renderPostActions(post) {
        const user = SessionManager.getCurrentUser();
        if (user && (user.isAdmin || user.username === post.author)) {
            return `
                <div class="post-actions">
                    <button class="btn-edit" onclick="CommunitySystem.editPost(${post.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" onclick="CommunitySystem.deletePost(${post.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>`;
        }
        return '';
    },

    // Show comments
    async showComments(postId) {
        const container = document.getElementById(`comments-${postId}`);
        if (!container) return;

        const posts = JSON.parse(localStorage.getItem('community_posts') || '[]');
        const post = posts.find(p => p.id === postId);
        
        if (post) {
            container.innerHTML = `
                <div class="comments-list">
                    ${post.comments.map(comment => this.renderComment(comment)).join('')}
                </div>
                <form class="comment-form" onsubmit="CommunitySystem.submitComment(event, ${postId})">
                    <textarea name="content" placeholder="Write a comment..." required></textarea>
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-paper-plane"></i> Post Comment
                    </button>
                </form>`;
        }
    },

    // Submit comment
    async submitComment(event, postId) {
        event.preventDefault();
        
        try {
            if (!SessionManager.isAuthenticated()) {
                this.showError('Please log in to comment');
                return;
            }

            if (!SecurityMiddleware.rateLimiter.check('comment', 5, 300000)) {
                this.showError('Too many comments. Please wait a few minutes.');
                return;
            }

            const form = event.target;
            const content = form.querySelector('[name="content"]').value.trim();
            
            if (!content) {
                this.showError('Comment cannot be empty');
                return;
            }

            if (this.isSpam(content)) {
                this.showError('Your comment was flagged as spam');
                return;
            }

            const user = SessionManager.getCurrentUser();
            const comment = {
                id: Date.now(),
                content: SecurityMiddleware.sanitizer.sanitizeInput(content),
                author: user.username,
                avatar: user.avatar,
                timestamp: new Date().toISOString()
            };

            let posts = JSON.parse(localStorage.getItem('community_posts') || '[]');
            const postIndex = posts.findIndex(p => p.id === postId);
            
            if (postIndex !== -1) {
                posts[postIndex].comments.push(comment);
                localStorage.setItem('community_posts', JSON.stringify(posts));
                this.showComments(postId);
                form.reset();
                this.showSuccess('Comment posted successfully!');
            }
        } catch (error) {
            console.error('Error posting comment:', error);
            this.showError('Failed to post comment');
        }
    },

    // Like post
    async likePost(postId) {
        if (!SessionManager.isAuthenticated()) {
            this.showError('Please log in to like posts');
            return;
        }

        let posts = JSON.parse(localStorage.getItem('community_posts') || '[]');
        const index = posts.findIndex(p => p.id === postId);
        
        if (index !== -1) {
            posts[index].likes++;
            localStorage.setItem('community_posts', JSON.stringify(posts));
            this.loadPosts();
        }
    },

    // Report post
    async reportPost(postId) {
        if (!SessionManager.isAuthenticated()) {
            this.showError('Please log in to report posts');
            return;
        }

        // In a real app, this would send a report to the server
        this.showSuccess('Post reported. Our moderators will review it.');
    },

    // Edit post
    async editPost(postId) {
        const user = SessionManager.getCurrentUser();
        if (!user) return;

        const posts = JSON.parse(localStorage.getItem('community_posts') || '[]');
        const post = posts.find(p => p.id === postId);
        
        if (post && (user.isAdmin || user.username === post.author)) {
            const article = document.querySelector(`[data-id="${postId}"]`);
            const content = article.querySelector('.post-content');
            
            content.innerHTML = `
                <form class="edit-form" onsubmit="CommunitySystem.saveEdit(event, ${postId})">
                    <input type="text" name="title" value="${post.title}" required>
                    <textarea name="content" required>${post.content}</textarea>
                    <div class="edit-actions">
                        <button type="submit" class="btn btn-save">Save</button>
                        <button type="button" class="btn btn-cancel" onclick="CommunitySystem.cancelEdit(${postId})">
                            Cancel
                        </button>
                    </div>
                </form>`;
        }
    },

    // Save edited post
    async saveEdit(event, postId) {
        event.preventDefault();
        
        try {
            const form = event.target;
            const title = form.querySelector('[name="title"]').value.trim();
            const content = form.querySelector('[name="content"]').value.trim();

            if (!title || !content) {
                this.showError('All fields are required');
                return;
            }

            let posts = JSON.parse(localStorage.getItem('community_posts') || '[]');
            const index = posts.findIndex(p => p.id === postId);
            
            if (index !== -1) {
                posts[index].title = SecurityMiddleware.sanitizer.sanitizeInput(title);
                posts[index].content = SecurityMiddleware.sanitizer.sanitizeInput(content);
                posts[index].edited = true;
                
                localStorage.setItem('community_posts', JSON.stringify(posts));
                this.loadPosts();
                this.showSuccess('Post updated successfully!');
            }
        } catch (error) {
            console.error('Error updating post:', error);
            this.showError('Failed to update post');
        }
    },

    // Cancel post edit
    cancelEdit(postId) {
        this.loadPosts();
    },

    // Delete post
    async deletePost(postId) {
        const user = SessionManager.getCurrentUser();
        if (!user) return;

        let posts = JSON.parse(localStorage.getItem('community_posts') || '[]');
        const post = posts.find(p => p.id === postId);
        
        if (post && (user.isAdmin || user.username === post.author)) {
            posts = posts.filter(p => p.id !== postId);
            localStorage.setItem('community_posts', JSON.stringify(posts));
            this.loadPosts();
            this.showSuccess('Post deleted successfully');
        }
    },

    // Search posts
    searchPosts(query) {
        this.loadPosts({ search: query });
    },

    // Filter by category
    filterByCategory(category) {
        this.loadPosts({ category });
    },

    // Sort posts
    sortPosts(sortBy) {
        this.loadPosts({ sort: sortBy });
    },

    // Setup real-time updates
    setupRealTimeUpdates() {
        // In a real app, this would use WebSocket
        setInterval(() => this.loadPosts(), 30000);
    },

    // Spam detection
    isSpam(content) {
        const spamPatterns = [
            /\b(viagra|cialis)\b/i,
            /\b(casino|poker|gambling)\b/i,
            /\b(http|https|www\.)\b/i,
            /\b(free|win|winner)\b/i
        ];

        if (spamPatterns.some(pattern => pattern.test(content))) {
            return true;
        }

        if (/(.)\1{4,}/.test(content)) {
            return true;
        }

        if (content.length > 20 && content.toUpperCase() === content) {
            return true;
        }

        return false;
    },

    // Show error message
    showError(message) {
        const alert = document.createElement('div');
        alert.className = 'alert alert-error';
        alert.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        this.showAlert(alert);
    },

    // Show success message
    showSuccess(message) {
        const alert = document.createElement('div');
        alert.className = 'alert alert-success';
        alert.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        this.showAlert(alert);
    },

    // Show alert
    showAlert(alert) {
        const container = document.querySelector('.community-alerts') || document.createElement('div');
        container.className = 'community-alerts';
        document.querySelector('.community-container').prepend(container);
        
        container.appendChild(alert);
        setTimeout(() => alert.remove(), 5000);
    },

    // Debounce helper
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// Community Page Initialization
document.addEventListener('DOMContentLoaded', () => {
    initializeCommunity();
});

const initializeCommunity = () => {
    initializeNavigation();
    initializeAnimations();
    initializeStats();
    initializeCommunityCards();
    CommunitySystem.init();
};

// Navigation
const initializeNavigation = () => {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                mobileMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        });
    }
};

// Animations
const initializeAnimations = () => {
    // Typing effect for hero heading
    const heroHeading = document.querySelector('.typing-text');
    if (heroHeading) {
        const text = heroHeading.textContent;
        heroHeading.textContent = '';
        let i = 0;
        
        const typeWriter = () => {
            if (i < text.length) {
                heroHeading.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        typeWriter();
    }

    // Scroll animations for community cards
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.community-card, .guideline-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1
        });

        elements.forEach(element => {
            observer.observe(element);
        });
    };

    animateOnScroll();
};

// Stats Counter
const initializeStats = () => {
    const stats = document.querySelectorAll('.stat-value');
    
    const animateValue = (element, start, end, duration) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = value.toLocaleString() + '+';
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const value = parseInt(entry.target.textContent);
                animateValue(entry.target, 0, value, 2000);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    stats.forEach(stat => {
        const value = parseInt(stat.textContent);
        stat.textContent = '0+';
        observer.observe(stat);
    });
};

// Community Cards
const initializeCommunityCards = () => {
    const cards = document.querySelectorAll('.community-card');
    
    cards.forEach(card => {
        // Hover effect
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });

        // Click handler
        const button = card.querySelector('.btn');
        if (button) {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const href = button.getAttribute('href');
                
                // Add loading state
                button.classList.add('loading');
                button.textContent = 'Loading...';

                // Simulate loading (replace with actual navigation)
                setTimeout(() => {
                    window.location.href = href;
                }, 500);
            });
        }
    });
};

// Utility Functions
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Error Handling
const showError = (message) => {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
};

// Success Message
const showSuccess = (message) => {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
};

// Auth Modal Management
class AuthModal {
    constructor() {
        this.modal = document.getElementById('auth-modal');
        this.closeBtn = document.querySelector('.close-modal');
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.closeBtn?.addEventListener('click', () => this.hide());
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.hide();
        });
    }

    show() {
        this.modal?.classList.remove('hidden');
        setTimeout(() => this.modal?.classList.add('active'), 10);
        document.body.style.overflow = 'hidden';
    }

    hide() {
        this.modal?.classList.remove('active');
        setTimeout(() => {
            this.modal?.classList.add('hidden');
            document.body.style.overflow = '';
        }, 300);
    }
}

// Glitch Text Effect
class GlitchText {
    constructor() {
        this.glitchTexts = document.querySelectorAll('.glitch-text');
        this.init();
    }

    init() {
        this.glitchTexts.forEach(text => {
            text.setAttribute('data-text', text.textContent);
        });
    }
}

// Matrix Rain Effect
class MatrixRain {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.classList.add('matrix-bg');
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.characters = 'GITHACKS01';
        this.fontSize = 14;
        this.drops = [];
        this.init();
    }

    init() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        this.animate();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columns = Math.floor(this.canvas.width / this.fontSize);
        this.drops = Array(this.columns).fill(1);
    }

    draw() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#0F0';
        this.ctx.font = this.fontSize + 'px monospace';

        for (let i = 0; i < this.drops.length; i++) {
            const char = this.characters[Math.floor(Math.random() * this.characters.length)];
            this.ctx.fillText(char, i * this.fontSize, this.drops[i] * this.fontSize);
            if (this.drops[i] * this.fontSize > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            this.drops[i]++;
        }
        requestAnimationFrame(() => this.draw());
    }

    animate() {
        this.draw();
    }
}

// Scroll Animation Observer
class ScrollAnimator {
    constructor() {
        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '50px'
            }
        );

        this.init();
    }

    init() {
        document.querySelectorAll('.reveal-on-scroll').forEach(element => {
            this.observer.observe(element);
        });
    }
}

// Stats Counter Animation
class StatsCounter {
    constructor() {
        this.stats = document.querySelectorAll('.stat .count');
        this.init();
    }

    init() {
        this.stats.forEach(stat => {
            const target = parseInt(stat.textContent);
            this.animateValue(stat, 0, target, 2000);
        });
    }

    animateValue(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = value;
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
}

// Mobile Menu
class MobileMenu {
    constructor() {
        this.menuToggle = document.querySelector('.menu-toggle');
        this.navLinks = document.querySelector('.nav-links');
        this.authLinks = document.querySelector('.auth-links');
        this.init();
    }

    init() {
        this.menuToggle?.addEventListener('click', () => {
            this.menuToggle.classList.toggle('active');
            this.navLinks?.classList.toggle('active');
            this.authLinks?.classList.toggle('active');
        });
    }
}

// Check authentication status
const checkAuth = () => {
    const isAuthenticated = Auth.checkAuth();
    if (!isAuthenticated) {
        const authModal = new AuthModal();
        authModal.show();
        return false;
    }
    return true;
};
