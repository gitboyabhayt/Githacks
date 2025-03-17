// Chart configurations and initializations
class ChartManager {
    constructor() {
        this.initProgressChart();
        this.initActivityChart();
    }

    initProgressChart() {
        const progressCtx = document.getElementById('progressChart').getContext('2d');
        new Chart(progressCtx, {
            type: 'doughnut',
            data: {
                labels: ['Completed', 'In Progress', 'Not Started'],
                datasets: [{
                    data: [65, 25, 10],
                    backgroundColor: ['#00ff88', '#ffc107', '#ff4444']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#ffffff' }
                    }
                }
            }
        });
    }

    initActivityChart() {
        const activityCtx = document.getElementById('activityChart').getContext('2d');
        new Chart(activityCtx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Hours Spent',
                    data: [4, 3, 5, 2, 4, 6, 3],
                    borderColor: '#00ff88',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: { color: '#ffffff' }
                    }
                },
                scales: {
                    y: { ticks: { color: '#888888' } },
                    x: { ticks: { color: '#888888' } }
                }
            }
        });
    }
} 