document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle Functionality
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme) {
        document.body.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'light') {
            themeToggle.classList.add('active');
        }
    }

    themeToggle.addEventListener('click', () => {
        themeToggle.classList.toggle('active');
        let theme = 'dark';
        if (themeToggle.classList.contains('active')) {
            theme = 'light';
        }
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        // Trigger glitch animation
        themeToggle.classList.add('glitch');
        setTimeout(() => {
            themeToggle.classList.remove('glitch');
        }, 300);
    });

    // Certification Card Hover Effect
    const certificationCards = document.querySelectorAll('.certification-card');
    certificationCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.classList.add('hovered');
        });
        card.addEventListener('mouseleave', () => {
            card.classList.remove('hovered');
        });
    });

    // Smooth Scroll for Learn More Buttons
    const learnMoreButtons = document.querySelectorAll('.cyber-button.small');
    learnMoreButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector('#certification-list');
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // AI-Based Learning Assistant
    const askButton = document.getElementById('askButton');
    const userInput = document.getElementById('userInput');
    const chatOutput = document.getElementById('chatOutput');

    askButton.addEventListener('click', () => {
        const userQuestion = userInput.value;
        if (userQuestion) {
            chatOutput.innerHTML += `<p><strong>You:</strong> ${userQuestion}</p>`;
            userInput.value = '';

            // Simulate AI response
            setTimeout(() => {
                chatOutput.innerHTML += `<p><strong>AI:</strong> Here is some information related to your question...</p>`;
                chatOutput.scrollTop = chatOutput.scrollHeight; // Scroll to the bottom
            }, 1000);
        }
    });

    // Intersection Observer for fade-in animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    // Observe all cards and sections
    document.querySelectorAll('.certification-card, .progress-tracker, .learning-assistant, .hacking-lab').forEach(el => {
        observer.observe(el);
    });

    // Add hover effect to track cards
    document.querySelectorAll('.certification-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const angleX = (y - centerY) / 20;
            const angleY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });

    // Animate stats counting
    const animateValue = (element, start, end, duration) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            element.textContent = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };

    // Animate stats when they come into view
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target;
                const endValue = parseInt(statNumber.getAttribute('data-value'));
                animateValue(statNumber, 0, endValue, 2000);
                statsObserver.unobserve(statNumber);
            }
        });
    });

    document.querySelectorAll('.stat-number').forEach(stat => {
        statsObserver.observe(stat);
    });
}); 