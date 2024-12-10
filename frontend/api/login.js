import { BACKEND_URL } from './config.js';

// Login user
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${BACKEND_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const data = await response.json();
            alert('Login successful');
            localStorage.setItem('token', data.token); // Save token for authenticated routes
            window.location.href = '../../index.html'; // Redirect to home page
        } else {
            const errorMessage = await response.text();
            alert(`Error: ${errorMessage}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error logging in');
    }
});
