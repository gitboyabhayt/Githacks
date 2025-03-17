document.addEventListener('DOMContentLoaded', () => {
    const profileBtn = document.getElementById('profileBtn');
    const profileMenu = document.getElementById('profileMenu');
    const themeToggle = document.getElementById('themeToggle');

    // Profile Dropdown Toggle
    profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        profileMenu.classList.toggle('active');
    });

    // Close profile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!profileMenu.contains(e.target) && !profileBtn.contains(e.target)) {
            profileMenu.classList.remove('active');
        }
    });

    // Theme Toggle Functionality
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Simulated real-time notifications (for demo)
    function updateNotifications() {
        // Add your real-time notification logic here
        console.log('Checking for new notifications...');
    }

    // Update notifications every 30 seconds
    setInterval(updateNotifications, 30000);

    // Profile Image Error Handling
    const profileImages = document.querySelectorAll('.profile-avatar, .profile-menu-avatar');
    profileImages.forEach(img => {
        img.onerror = () => {
            img.src = '../../assets/images/avatars/default-avatar.png';
        };
    });
});