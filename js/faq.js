document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const faqSearch = document.getElementById('faqSearch');
    const categoryBtns = document.querySelectorAll('.category-btn');
    const faqItems = document.querySelectorAll('.faq-item');
    const toggleBtns = document.querySelectorAll('.toggle-btn');

    // Toggle FAQ answers
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const faqItem = btn.closest('.faq-item');
            faqItem.classList.toggle('active');
        });
    });

    // Category filtering
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            categoryBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const category = btn.dataset.category;
            
            // Show/hide FAQ items based on category
            faqItems.forEach(item => {
                if (category === 'all' || item.dataset.category === category) {
                    item.style.display = 'block';
                    item.classList.add('fade-in');
                } else {
                    item.style.display = 'none';
                    item.classList.remove('fade-in');
                }
            });
        });
    });

    // Search functionality
    faqSearch.addEventListener('input', () => {
        const searchTerm = faqSearch.value.toLowerCase();

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question h3').textContent.toLowerCase();
            const answer = item.querySelector('.faq-answer').textContent.toLowerCase();

            if (question.includes(searchTerm) || answer.includes(searchTerm)) {
                item.style.display = 'block';
                // Highlight search terms
                highlightSearchTerm(item, searchTerm);
            } else {
                item.style.display = 'none';
            }
        });
    });

    // Function to highlight search terms
    function highlightSearchTerm(item, term) {
        if (!term) {
            // Remove existing highlights
            const highlights = item.querySelectorAll('.highlight');
            highlights.forEach(h => {
                const parent = h.parentNode;
                parent.replaceChild(document.createTextNode(h.textContent), h);
            });
            return;
        }

        const questionText = item.querySelector('.faq-question h3');
        const answerText = item.querySelector('.faq-answer');

        [questionText, answerText].forEach(element => {
            const text = element.innerHTML;
            const regex = new RegExp(term, 'gi');
            element.innerHTML = text.replace(regex, match => `<span class="highlight">${match}</span>`);
        });
    }

    // Theme toggle functionality (if not already implemented in theme.js)
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.documentElement.setAttribute(
                'data-theme',
                document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
            );
        });
    }

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
});
