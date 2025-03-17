// Comment System
const CommentSystem = {
    // Initialize comment system
    init() {
        this.bindEvents();
        this.loadComments();
    },

    // Bind event listeners
    bindEvents() {
        const commentForm = document.getElementById('commentForm');
        if (commentForm) {
            commentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                if (this.validateComment(commentForm)) {
                    this.submitComment(commentForm);
                }
            });
        }

        // Pagination events
        document.querySelectorAll('.pagination-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.target.dataset.page;
                this.loadComments(page);
            });
        });
    },

    // Validate comment
    validateComment(form) {
        const content = form.querySelector('textarea[name="content"]').value.trim();
        
        // Check if user is logged in
        if (!SessionManager.isAuthenticated()) {
            this.showError('Please log in to comment');
            return false;
        }

        // Check rate limiting
        if (!SecurityMiddleware.rateLimiter.check('comment', 5, 300000)) {
            this.showError('Too many comments. Please wait a few minutes.');
            return false;
        }

        // Validate content
        if (!content) {
            this.showError('Comment cannot be empty');
            return false;
        }

        if (content.length > 1000) {
            this.showError('Comment is too long (max 1000 characters)');
            return false;
        }

        // Check for spam patterns
        if (this.isSpam(content)) {
            this.showError('Your comment was flagged as spam');
            return false;
        }

        return true;
    },

    // Submit comment
    async submitComment(form) {
        try {
            const content = form.querySelector('textarea[name="content"]').value.trim();
            const user = SessionManager.getCurrentUser();
            
            // Sanitize input
            const sanitizedContent = SecurityMiddleware.sanitizer.sanitizeInput(content);
            
            // In a real app, this would be an API call
            const comment = {
                id: Date.now(),
                content: sanitizedContent,
                author: user.username,
                avatar: user.avatar,
                timestamp: new Date().toISOString(),
                likes: 0
            };

            // Store comment (demo implementation)
            let comments = JSON.parse(localStorage.getItem('blog_comments') || '[]');
            comments.unshift(comment);
            localStorage.setItem('blog_comments', JSON.stringify(comments));

            // Clear form and reload comments
            form.reset();
            this.loadComments();
            this.showSuccess('Comment posted successfully!');
        } catch (error) {
            console.error('Error posting comment:', error);
            this.showError('Failed to post comment');
        }
    },

    // Load comments with pagination
    loadComments(page = 1) {
        const commentsPerPage = 10;
        const comments = JSON.parse(localStorage.getItem('blog_comments') || '[]');
        
        // Calculate pagination
        const totalPages = Math.ceil(comments.length / commentsPerPage);
        const start = (page - 1) * commentsPerPage;
        const end = start + commentsPerPage;
        const pageComments = comments.slice(start, end);

        // Render comments
        const commentsList = document.querySelector('.comments-list');
        if (commentsList) {
            commentsList.innerHTML = pageComments.map(comment => this.renderComment(comment)).join('');
            this.renderPagination(page, totalPages);
        }
    },

    // Render single comment
    renderComment(comment) {
        const timestamp = new Date(comment.timestamp).toLocaleString();
        return `
            <div class="comment card fade-in" data-id="${comment.id}">
                <div class="comment-header">
                    <img src="${comment.avatar}" alt="${comment.author}" class="avatar">
                    <div class="comment-meta">
                        <span class="author">${comment.author}</span>
                        <span class="timestamp">${timestamp}</span>
                    </div>
                    ${this.renderCommentActions(comment)}
                </div>
                <div class="comment-content">
                    ${comment.content}
                </div>
                <div class="comment-footer">
                    <button class="btn-like" onclick="CommentSystem.likeComment(${comment.id})">
                        <i class="fas fa-heart"></i> ${comment.likes}
                    </button>
                    <button class="btn-report" onclick="CommentSystem.reportComment(${comment.id})">
                        <i class="fas fa-flag"></i> Report
                    </button>
                </div>
            </div>`;
    },

    // Render comment actions
    renderCommentActions(comment) {
        const user = SessionManager.getCurrentUser();
        if (user && (user.isAdmin || user.username === comment.author)) {
            return `
                <div class="comment-actions">
                    <button class="btn-delete" onclick="CommentSystem.deleteComment(${comment.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>`;
        }
        return '';
    },

    // Render pagination
    renderPagination(currentPage, totalPages) {
        const pagination = document.querySelector('.comments-pagination');
        if (!pagination || totalPages <= 1) return;

        let html = '';
        for (let i = 1; i <= totalPages; i++) {
            html += `
                <button class="pagination-link ${i === currentPage ? 'active' : ''}" 
                        data-page="${i}">
                    ${i}
                </button>`;
        }
        pagination.innerHTML = html;
    },

    // Like comment
    async likeComment(commentId) {
        if (!SessionManager.isAuthenticated()) {
            this.showError('Please log in to like comments');
            return;
        }

        let comments = JSON.parse(localStorage.getItem('blog_comments') || '[]');
        const index = comments.findIndex(c => c.id === commentId);
        
        if (index !== -1) {
            comments[index].likes++;
            localStorage.setItem('blog_comments', JSON.stringify(comments));
            this.loadComments();
        }
    },

    // Report comment
    async reportComment(commentId) {
        if (!SessionManager.isAuthenticated()) {
            this.showError('Please log in to report comments');
            return;
        }

        // In a real app, this would send a report to the server
        this.showSuccess('Comment reported. Our moderators will review it.');
    },

    // Delete comment
    async deleteComment(commentId) {
        const user = SessionManager.getCurrentUser();
        if (!user) return;

        let comments = JSON.parse(localStorage.getItem('blog_comments') || '[]');
        const comment = comments.find(c => c.id === commentId);
        
        if (comment && (user.isAdmin || user.username === comment.author)) {
            comments = comments.filter(c => c.id !== commentId);
            localStorage.setItem('blog_comments', JSON.stringify(comments));
            this.loadComments();
            this.showSuccess('Comment deleted successfully');
        }
    },

    // Spam detection
    isSpam(content) {
        const spamPatterns = [
            /\b(viagra|cialis)\b/i,
            /\b(casino|poker|gambling)\b/i,
            /\b(http|https|www\.)\b/i,
            /\b(free|win|winner)\b/i
        ];

        // Check for spam patterns
        if (spamPatterns.some(pattern => pattern.test(content))) {
            return true;
        }

        // Check for repeated characters
        if (/(.)\1{4,}/.test(content)) {
            return true;
        }

        // Check for all caps
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
        const container = document.querySelector('.comments-alerts') || document.createElement('div');
        container.className = 'comments-alerts';
        document.querySelector('.comments-section').prepend(container);
        
        container.appendChild(alert);
        setTimeout(() => alert.remove(), 5000);
    }
};

// Initialize comment system
document.addEventListener('DOMContentLoaded', () => {
    CommentSystem.init();
});
