document.addEventListener('DOMContentLoaded', () => {
    // Animate statistics
    const statValues = document.querySelectorAll('.stat-value');
    
    const animateValue = (element, start, end, duration) => {
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
    };

    // Animate stats when they come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const endValue = parseInt(element.dataset.count);
                animateValue(element, 0, endValue, 2000);
                observer.unobserve(element);
            }
        });
    }, { threshold: 0.5 });

    statValues.forEach(stat => observer.observe(stat));

    // Update progress bars randomly
    const updateProgress = () => {
        document.querySelectorAll('.progress').forEach(bar => {
            const newValue = Math.floor(Math.random() * 30) + 70; // 70-100%
            bar.style.width = `${newValue}%`;
        });
    };

    setInterval(updateProgress, 5000);
}); 