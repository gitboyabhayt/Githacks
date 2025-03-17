// Sample book data - Replace with actual API call
const books = {
    free: [
        {
            id: 1,
            title: "Web Application Security Basics",
            author: "John Smith",
            category: "web",
            cover: "../assets/books/web-security.jpg",
            description: "Learn the fundamentals of securing web applications from common vulnerabilities and attacks.",
            rating: 4.5,
            downloads: 1200
        },
        {
            id: 'intro',
            title: 'Introduction to Cybersecurity',
            author: 'Sarah Johnson',
            category: 'basics',
            cover: '../assets/books/intro.jpg',
            description: 'A comprehensive introduction to the world of cybersecurity.',
            rating: 4.5,
            downloads: 1200
        },
        {
            id: 'ethical-hacking-basics',
            title: 'Ethical Hacking Basics',
            author: 'Michael Chen',
            category: 'pentesting',
            cover: '../assets/books/ethical-hacking.jpg',
            description: 'Learn the fundamentals of ethical hacking and penetration testing.',
            rating: 4.8,
            downloads: 1200
        },
        // Add more free books...
    ],
    premium: [
        {
            id: 101,
            title: "Advanced Network Penetration Testing",
            author: "Sarah Johnson",
            category: "network",
            cover: "../assets/books/network-pentest.jpg",
            description: "Master advanced techniques in network penetration testing and vulnerability assessment.",
            price: 49.99,
            rating: 4.8,
            purchases: 850
        },
        {
            id: 'advanced-hacking',
            title: 'Advanced Ethical Hacking',
            author: 'David Miller',
            category: 'pentesting',
            cover: '../assets/books/advanced-hacking.jpg',
            description: 'Advanced techniques for ethical hackers and security professionals.',
            price: 49.99,
            rating: 4.9,
            purchases: 850
        },
        {
            id: 'red-blue-team',
            title: 'Red Team vs. Blue Team Strategies',
            author: 'Emma Wilson',
            category: 'security',
            cover: '../assets/books/red-blue.jpg',
            description: 'Master offensive and defensive security strategies.',
            price: 59.99,
            rating: 4.7,
            purchases: 850
        },
        // Add more premium books...
    ]
};

// DOM Elements
const searchInput = document.getElementById('searchBooks');
const categoryFilter = document.getElementById('categoryFilter');
const sortFilter = document.getElementById('sortFilter');
const freeBooksGrid = document.getElementById('freeBooksGrid');
const premiumBooksGrid = document.getElementById('premiumBooksGrid');
const bookPreviewModal = document.getElementById('bookPreview');

// State
let currentFilter = {
    search: '',
    category: '',
    sort: 'newest'
};

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    initializeBooks();
    setupEventListeners();
});

// Initialize books display
function initializeBooks() {
    // Show skeleton loading
    showSkeletonLoading();

    // Simulate API call delay
    setTimeout(() => {
        renderBooks('free', books.free);
        renderBooks('premium', books.premium);
    }, 1000);
}

// Show skeleton loading
function showSkeletonLoading() {
    const skeletonTemplate = `
        <div class="book-card skeleton">
            <div class="book-cover"></div>
            <div class="book-info">
                <div class="book-title"></div>
                <div class="book-author"></div>
                <div class="book-category"></div>
            </div>
        </div>
    `.repeat(8);

    freeBooksGrid.innerHTML = skeletonTemplate;
    premiumBooksGrid.innerHTML = skeletonTemplate;
}

// Setup event listeners
function setupEventListeners() {
    // Search input
    searchInput.addEventListener('input', debounce(() => {
        currentFilter.search = searchInput.value.toLowerCase();
        filterBooks();
    }, 300));

    // Category filter
    categoryFilter.addEventListener('change', () => {
        currentFilter.category = categoryFilter.value;
        filterBooks();
    });

    // Sort filter
    sortFilter.addEventListener('change', () => {
        currentFilter.sort = sortFilter.value;
        filterBooks();
    });

    // Modal close button
    document.querySelector('.modal-close').addEventListener('click', () => {
        closeBookPreview();
    });

    // Close modal on outside click
    bookPreviewModal.addEventListener('click', (e) => {
        if (e.target === bookPreviewModal) {
            closeBookPreview();
        }
    });

    // Escape key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeBookPreview();
        }
    });
}

// Render books
function renderBooks(type, booksArray) {
    const grid = type === 'free' ? freeBooksGrid : premiumBooksGrid;
    const filteredBooks = filterBooksByCurrentFilters(booksArray);
    
    grid.innerHTML = filteredBooks.map(book => createBookCard(book, type)).join('');
    
    // Add click event listeners to cards
    grid.querySelectorAll('.book-card').forEach(card => {
        card.addEventListener('click', () => {
            const bookId = parseInt(card.dataset.id);
            const book = booksArray.find(b => b.id === bookId);
            if (book) {
                showBookPreview(book, type);
            }
        });
    });
}

// Create book card HTML
function createBookCard(book, type) {
    return `
        <div class="book-card ${type === 'premium' ? 'premium' : ''}" data-id="${book.id}">
            <div class="book-cover">
                <img src="${book.cover}" alt="${book.title}" loading="lazy">
            </div>
            <div class="book-info">
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">by ${book.author}</p>
                <span class="book-category">${book.category}</span>
            </div>
        </div>
    `;
}

// Show book preview
function showBookPreview(book, type) {
    const modal = document.getElementById('bookPreview');
    const content = modal.querySelector('.book-preview');
    
    content.innerHTML = `
        <div class="preview-cover">
            <img src="${book.cover}" alt="${book.title}">
        </div>
        <div class="preview-info">
            <h3 class="preview-title">${book.title}</h3>
            <p class="preview-author">by ${book.author}</p>
            <span class="preview-category">${book.category}</span>
            <div class="preview-description">${book.description}</div>
            <div class="preview-actions">
                ${type === 'free' ? `
                    <button class="btn-read" onclick="readBook(${book.id})">
                        <i class="fas fa-book-reader"></i>
                        Read Now
                    </button>
                ` : `
                    <button class="btn-buy" onclick="purchaseBook(${book.id})">
                        <i class="fas fa-shopping-cart"></i>
                        Buy Now ($${book.price})
                    </button>
                `}
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close book preview
function closeBookPreview() {
    const modal = document.getElementById('bookPreview');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Filter books by current filters
function filterBooksByCurrentFilters(booksArray) {
    return booksArray
        .filter(book => {
            const matchesSearch = book.title.toLowerCase().includes(currentFilter.search) ||
                                book.author.toLowerCase().includes(currentFilter.search);
            const matchesCategory = !currentFilter.category || book.category === currentFilter.category;
            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            switch (currentFilter.sort) {
                case 'popular':
                    return (b.downloads || b.purchases) - (a.downloads || a.purchases);
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'newest':
                default:
                    return b.id - a.id;
            }
        });
}

// Filter all books
function filterBooks() {
    renderBooks('free', books.free);
    renderBooks('premium', books.premium);
}

// Read book function
function readBook(bookId) {
    const book = books.free.find(b => b.id === bookId);
    if (book) {
        // Implement book reading functionality
        console.log(`Opening book: ${book.title}`);
        window.location.href = `reader.html?id=${bookId}`;
    }
}

// Purchase book function
function purchaseBook(bookId) {
    const book = books.premium.find(b => b.id === bookId);
    if (book) {
        // Implement purchase functionality
        console.log(`Processing purchase for: ${book.title}`);
        window.location.href = `checkout.html?id=${bookId}`;
    }
}

// Debounce function for search input
function debounce(func, wait) {
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

// Lazy loading for book covers
function setupLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}
