document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    const formInputs = document.querySelectorAll('.form-control');

    // Form validation
    function validateInput(input) {
        const errorText = input.nextElementSibling;
        let isValid = true;

        // Reset error state
        input.classList.remove('error');
        errorText.style.display = 'none';

        // Validate based on input type
        switch(input.id) {
            case 'name':
                if (!input.value.trim()) {
                    showError(input, errorText, 'Please enter your name');
                    isValid = false;
                }
                break;

            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value)) {
                    showError(input, errorText, 'Please enter a valid email address');
                    isValid = false;
                }
                break;

            case 'subject':
                if (!input.value) {
                    showError(input, errorText, 'Please select a subject');
                    isValid = false;
                }
                break;

            case 'message':
                if (!input.value.trim()) {
                    showError(input, errorText, 'Please enter your message');
                    isValid = false;
                }
                break;
        }

        return isValid;
    }

    function showError(input, errorText, message) {
        input.classList.add('error');
        errorText.textContent = message;
        errorText.style.display = 'block';
    }

    // Real-time validation
    formInputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateInput(input);
        });

        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateInput(input);
            }
        });
    });

    // Form submission
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        let isValid = true;

        // Hide previous messages
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';

        // Validate all inputs
        formInputs.forEach(input => {
            if (!validateInput(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            return;
        }

        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        try {
            // Simulate API call (replace with actual API endpoint)
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Show success message
            successMessage.style.display = 'block';
            contactForm.reset();

            // Scroll to success message
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } catch (error) {
            // Show error message
            errorMessage.style.display = 'block';
            errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } finally {
            // Reset button state
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });

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
