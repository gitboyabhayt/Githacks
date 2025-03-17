// Import Chart.js if not already included in the HTML
if (!window.Chart) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    document.head.appendChild(script);
}

// Initialize Revenue Chart
function initRevenueChart() {
    const ctx = document.getElementById('revenueChart').getContext('2d');
    
    // Cyber theme gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(0, 255, 255, 0.5)');
    gradient.addColorStop(1, 'rgba(0, 255, 255, 0)');

    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({length: 24}, (_, i) => `${i}:00`),
            datasets: [{
                label: 'Revenue',
                data: generateRandomData(24),
                borderColor: '#00ffff',
                backgroundColor: gradient,
                borderWidth: 2,
                pointBackgroundColor: '#00ffff',
                pointBorderColor: '#00ffff',
                pointHoverBackgroundColor: '#ffffff',
                pointHoverBorderColor: '#00ffff',
                pointRadius: 4,
                pointHoverRadius: 6,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 255, 255, 0.1)',
                        borderColor: 'rgba(0, 255, 255, 0.2)'
                    },
                    ticks: {
                        color: '#00ffff',
                        font: {
                            family: '"Share Tech Mono", monospace'
                        },
                        callback: value => `$${value}k`
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(0, 255, 255, 0.1)',
                        borderColor: 'rgba(0, 255, 255, 0.2)'
                    },
                    ticks: {
                        color: '#00ffff',
                        font: {
                            family: '"Share Tech Mono", monospace'
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(20, 24, 28, 0.9)',
                    titleFont: {
                        family: '"Orbitron", sans-serif',
                        size: 14
                    },
                    bodyFont: {
                        family: '"Share Tech Mono", monospace',
                        size: 12
                    },
                    borderColor: '#00ffff',
                    borderWidth: 1,
                    callbacks: {
                        label: context => `Revenue: $${context.parsed.y}k`
                    }
                }
            }
        }
    });

    // Update chart data every 5 seconds
    setInterval(() => {
        chart.data.datasets[0].data = generateRandomData(24);
        chart.update('none');
    }, 5000);

    return chart;
}

// Generate random data for demonstration
function generateRandomData(points) {
    return Array.from({length: points}, () => Math.floor(Math.random() * 100) + 50);
}

// Time period switcher
function initTimeControls() {
    const timeButtons = document.querySelectorAll('.time-btn');
    timeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            timeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateChartPeriod(btn.dataset.time);
        });
    });
}

// Update metrics with animation
function updateMetric(elementId, newValue, prefix = '') {
    const element = document.getElementById(elementId);
    if (!element) return;

    const startValue = parseFloat(element.textContent.replace(/[^0-9.-]+/g, ''));
    const endValue = parseFloat(newValue);
    const duration = 1000;
    const startTime = performance.now();

    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const currentValue = startValue + (endValue - startValue) * progress;
        element.textContent = `${prefix}${currentValue.toFixed(2)}`;

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }

    requestAnimationFrame(animate);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const chart = initRevenueChart();
    initTimeControls();

    // Simulate real-time updates
    setInterval(() => {
        updateMetric('totalRevenue', Math.random() * 50000 + 100000, '$');
        updateMetric('newSubs', Math.floor(Math.random() * 100 + 200));
        updateMetric('recurringRevenue', Math.random() * 20000 + 90000, '$');
        updateMetric('conversionRate', Math.random() * 2 + 4);
        updateMetric('avgTransaction', Math.random() * 100 + 450, '$');
        updateMetric('customerLtv', Math.random() * 500 + 2200, '$');
    }, 5000);
});