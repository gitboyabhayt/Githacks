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
});
