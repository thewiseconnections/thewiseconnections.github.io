// Email subscription form handling
const emailForm = document.getElementById('emailForm');
const formMessage = document.getElementById('formMessage');

if (emailForm) {
    emailForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        
        // Simple validation
        if (email) {
            formMessage.innerHTML = '<p style="color: green; font-weight: bold;">Thank you for subscribing! Check your email for confirmation.</p>';
            emailForm.reset();
            
            // Clear message after 5 seconds
            setTimeout(() => {
                formMessage.innerHTML = '';
            }, 5000);
        } else {
            formMessage.innerHTML = '<p style="color: red;">Please enter a valid email address.</p>';
        }
    });
}
