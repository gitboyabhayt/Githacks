async function handlePurchase(event, details) {
    event.preventDefault();
    
    const isLoggedIn = await checkUserAuth();
    
    if (!isLoggedIn) {
        sessionStorage.setItem('pendingPurchase', JSON.stringify(details));
        window.location.href = '/auth/login';
        return;
    }

    // Check if user already has access
    const hasAccess = await checkAccess(details);
    if (hasAccess) {
        showAccessMessage(details);
        return;
    }

    // Initialize payment
    const razorpay = new RazorpayPayment();
    razorpay.initializePayment(details, details.type);
}

async function checkAccess(details) {
    try {
        const response = await fetch('/api/check-access', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                itemId: details.id,
                type: details.type
            })
        });
        const data = await response.json();
        return data.hasAccess;
    } catch (error) {
        console.error('Error checking access:', error);
        return false;
    }
}

function showAccessMessage(details) {
    const notification = document.createElement('div');
    notification.className = 'payment-notification info';
    notification.innerHTML = `
        <i class="fas fa-info-circle"></i>
        <h3>Already Purchased</h3>
        <p>You already have access to ${details.title}</p>
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 5000);
} 