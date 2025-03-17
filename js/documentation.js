// Documentation System with Admin-Only Access
const DocumentationSystem = {
    // Cache for documentation content
    cache: new Map(),
    cacheTimeout: 5 * 60 * 1000, // 5 minutes

    // Initialize documentation system
    init() {
        this.bindEvents();
        this.loadContent();
        this.setupAdminFeatures();
    },

    // Bind event listeners
    bindEvents() {
        // Table of contents navigation
        document.querySelectorAll('.toc-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(e.target.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Search functionality
        const searchInput = document.querySelector('.doc-search');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce(() => {
                this.searchContent(searchInput.value);
            }, 300));
        }
    },

    // Load documentation content
    async loadContent() {
        try {
            const sections = document.querySelectorAll('.doc-section');
            
            sections.forEach(async section => {
                const sectionId = section.id;
                const content = await this.getCachedContent(sectionId);
                
                if (content) {
                    section.querySelector('.doc-content').innerHTML = this.sanitizeHTML(content);
                    this.highlightCode(section);
                }
            });
        } catch (error) {
            console.error('Error loading documentation:', error);
            this.showError('Failed to load documentation content');
        }
    },

    // Get cached content or fetch from storage
    async getCachedContent(sectionId) {
        const now = Date.now();
        const cached = this.cache.get(sectionId);
        
        if (cached && now - cached.timestamp < this.cacheTimeout) {
            return cached.content;
        }

        // In a real app, this would fetch from a server
        // For demo, we'll use localStorage
        const content = localStorage.getItem(`doc_${sectionId}`);
        
        if (content) {
            this.cache.set(sectionId, {
                content: content,
                timestamp: now
            });
        }
        
        return content;
    },

    // Setup admin features
    setupAdminFeatures() {
        const user = SessionManager.getCurrentUser();
        if (!user || !user.isAdmin) {
            document.querySelectorAll('.admin-only').forEach(el => el.remove());
            return;
        }

        // Add edit buttons to sections
        document.querySelectorAll('.doc-section').forEach(section => {
            const editBtn = document.createElement('button');
            editBtn.className = 'btn btn-edit admin-only';
            editBtn.innerHTML = '<i class="fas fa-edit"></i> Edit';
            editBtn.addEventListener('click', () => this.editSection(section));
            
            section.querySelector('.doc-header').appendChild(editBtn);
        });

        // Initialize TinyMCE for rich text editing
        if (window.tinymce) {
            tinymce.init({
                selector: '.doc-editor',
                plugins: 'code codesample link lists',
                toolbar: 'undo redo | formatselect | bold italic | codesample | link | bullist numlist',
                height: 500,
                content_css: '../css/main.css',
                skin: 'oxide-dark',
                content_style: 'body { color: #fff; background: #1a1a1a; }',
                codesample_languages: [
                    { text: 'HTML/XML', value: 'markup' },
                    { text: 'JavaScript', value: 'javascript' },
                    { text: 'CSS', value: 'css' },
                    { text: 'PHP', value: 'php' },
                    { text: 'Python', value: 'python' },
                    { text: 'Java', value: 'java' },
                    { text: 'C', value: 'c' },
                    { text: 'C++', value: 'cpp' }
                ]
            });
        }
    },

    // Edit section
    editSection(section) {
        const sectionId = section.id;
        const content = section.querySelector('.doc-content');
        const currentContent = content.innerHTML;

        // Create editor
        const editor = document.createElement('div');
        editor.className = 'doc-editor';
        editor.innerHTML = currentContent;

        // Create toolbar
        const toolbar = document.createElement('div');
        toolbar.className = 'edit-toolbar';
        toolbar.innerHTML = `
            <button class="btn btn-save">
                <i class="fas fa-save"></i> Save
            </button>
            <button class="btn btn-cancel">
                <i class="fas fa-times"></i> Cancel
            </button>
        `;

        // Replace content with editor
        content.replaceWith(editor);
        section.appendChild(toolbar);

        // Initialize TinyMCE
        if (window.tinymce) {
            tinymce.init({
                target: editor,
                plugins: 'code codesample link lists',
                toolbar: 'undo redo | formatselect | bold italic | codesample | link | bullist numlist',
                height: 500,
                skin: 'oxide-dark',
                content_css: '../css/main.css',
                content_style: 'body { color: #fff; background: #1a1a1a; }'
            });
        }

        // Add event listeners
        toolbar.querySelector('.btn-save').addEventListener('click', () => {
            this.saveSection(sectionId, editor, content, toolbar);
        });

        toolbar.querySelector('.btn-cancel').addEventListener('click', () => {
            editor.replaceWith(content);
            toolbar.remove();
        });
    },

    // Save section
    async saveSection(sectionId, editor, originalContent, toolbar) {
        try {
            const content = window.tinymce ? 
                tinymce.get(editor.id).getContent() : 
                editor.innerHTML;

            // Validate content
            if (!content.trim()) {
                throw new Error('Content cannot be empty');
            }

            // In a real app, this would be an API call
            localStorage.setItem(`doc_${sectionId}`, content);
            
            // Update cache
            this.cache.set(sectionId, {
                content: content,
                timestamp: Date.now()
            });

            // Update content
            originalContent.innerHTML = this.sanitizeHTML(content);
            editor.replaceWith(originalContent);
            toolbar.remove();

            // Highlight code blocks
            this.highlightCode(originalContent.closest('.doc-section'));
            
            this.showSuccess('Documentation updated successfully');
        } catch (error) {
            console.error('Error saving documentation:', error);
            this.showError('Failed to save documentation');
        }
    },

    // Search content
    searchContent(query) {
        const normalizedQuery = query.toLowerCase().trim();
        
        document.querySelectorAll('.doc-section').forEach(section => {
            const content = section.textContent.toLowerCase();
            const isMatch = content.includes(normalizedQuery);
            
            section.style.display = isMatch || !normalizedQuery ? 'block' : 'none';
        });

        // Update TOC visibility
        document.querySelectorAll('.toc-link').forEach(link => {
            const targetId = link.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            link.style.display = target.style.display;
        });
    },

    // Highlight code blocks
    highlightCode(container) {
        if (window.Prism) {
            container.querySelectorAll('pre code').forEach(block => {
                Prism.highlightElement(block);
            });
        }
    },

    // Sanitize HTML
    sanitizeHTML(html) {
        return SecurityMiddleware.sanitizer.sanitizeInput(html);
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
        const container = document.querySelector('.doc-alerts') || document.createElement('div');
        container.className = 'doc-alerts';
        document.querySelector('.documentation-container').prepend(container);
        
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

// Initialize documentation system
document.addEventListener('DOMContentLoaded', () => {
    DocumentationSystem.init();
});
