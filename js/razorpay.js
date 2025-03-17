class RazorpayPayment {
    constructor() {
        // Replace this with your actual Razorpay test key
        this.key = 'rzp_test_YOUR_KEY_HERE'; // Replace with your test key
        this.currency = 'INR';
    }

    async initializePayment(purchaseDetails, type) {
        const options = {
            key: this.key,
            amount: purchaseDetails.price * 100, // amount in paise
            currency: this.currency,
            name: 'GITHACKS',
            description: `Purchase: ${purchaseDetails.title}`,
            image: '/assets/images/logo.png',
            handler: (response) => {
                // Handle successful payment
                console.log('Payment successful:', response);
                this.showSuccessMessage(purchaseDetails);
                // Redirect to success page
                window.location.href = `/payment/success.html?id=${response.razorpay_payment_id}`;
            },
            prefill: {
                name: '',
                email: '',
                contact: ''
            },
            theme: {
                color: '#00ff00'
            },
            modal: {
                ondismiss: () => {
                    this.handlePaymentCancellation();
                }
            }
        };

        const razorpayInstance = new Razorpay(options);
        razorpayInstance.open();
    }

    showSuccessMessage(details) {
        const notification = document.createElement('div');
        notification.className = 'payment-notification success';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <h3>Payment Successful!</h3>
            <p>You now have access to ${details.title}</p>
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 5000);
    }

    showErrorMessage(message) {
        const notification = document.createElement('div');
        notification.className = 'payment-notification error';
        notification.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <h3>Payment Failed</h3>
            <p>${message}</p>
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 5000);
    }

    handlePaymentCancellation() {
        this.showErrorMessage('Payment cancelled');
    }
} 