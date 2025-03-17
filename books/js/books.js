// Animation for book cards
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
        }
    });
});

// Initialize book cards
function initializeBookCards() {
    document.querySelectorAll('.book-card').forEach((card) => {
        card.style.opacity = 0;
        card.style.transform = 'translateY(50px)';
        card.style.transition = 'all 0.5s ease';
        observer.observe(card);
    });
}

// 3D hover effect for book cards
function initialize3DHoverEffect() {
    document.querySelectorAll('.book-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const rotateX = (y - rect.height / 2) / 20;
            const rotateY = (x - rect.width / 2) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

// Premium cards parallax effect
function initializePremiumCards() {
    const premiumCards = document.querySelectorAll('.premium-card');
    
    premiumCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `
                perspective(1000px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateZ(10px)
            `;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
}

// Premium section scroll animation
function initializePremiumSection() {
    const premiumSection = document.querySelector('.premium-section');
    
    window.addEventListener('scroll', () => {
        const rect = premiumSection.getBoundingClientRect();
        const scrollPercent = (window.innerHeight - rect.top) / window.innerHeight;
        
        if (scrollPercent > 0 && scrollPercent < 1) {
            premiumSection.style.backgroundPosition = `${scrollPercent * 100}% ${scrollPercent * 100}%`;
        }
    });
}

// Initialize all features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeBookCards();
    initialize3DHoverEffect();
    initializePremiumCards();
    initializePremiumSection();
});

const razorpay = new RazorpayPayment();

async function handlePremiumPurchase(event, bookDetails) {
    event.preventDefault();
    
    // Check if user is logged in
    const isLoggedIn = await checkUserAuth(); // Implement this function
    
    if (!isLoggedIn) {
        // Save intended purchase
        sessionStorage.setItem('pendingPurchase', JSON.stringify(bookDetails));
        // Redirect to login
        window.location.href = '/auth/login';
        return;
    }

    razorpay.initializePayment(bookDetails);
} 