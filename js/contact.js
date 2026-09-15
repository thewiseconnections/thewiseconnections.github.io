// Subscription form handler
document.getElementById('emailForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const messageDiv = document.getElementById('formMessage');

    try {
        const response = await fetch('../php/subscribe.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        const result = await response.json();
        messageDiv.textContent = result.message;
        messageDiv.className = result.success ? 'success' : 'error';
        if (result.success) document.getElementById('emailForm').reset();
    } catch (error) {
        messageDiv.textContent = 'Error submitting form';
        messageDiv.className = 'error';
    }
});

// Question form handler
document.getElementById('questionForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const subject = document.getElementById('subject').value;
    const email = document.getElementById('questionEmail').value;
    const message = document.getElementById('message').value;
    const messageDiv = document.getElementById('questionMessage');

    try {
        const response = await fetch('../php/send-question.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subject, email, message })
        });
        const result = await response.json();
        messageDiv.textContent = result.message;
        messageDiv.className = result.success ? 'success' : 'error';
        if (result.success) document.getElementById('questionForm').reset();
    } catch (error) {
        messageDiv.textContent = 'Error sending question';
        messageDiv.className = 'error';
    }
});
