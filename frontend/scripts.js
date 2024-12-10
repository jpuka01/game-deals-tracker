import { fetchDeals } from './api/deals.js';

// Fetch deals and render them
async function loadDeals(query = '') {
    const app = document.getElementById('app');
    app.innerHTML = '<p>Loading deals...</p>';
    try {
        const deals = await fetchDeals(query);

        if (deals.length === 0) {
            app.innerHTML = '<p>No deals found.</p>';
        } else {
            renderDeals(deals);
        }

    } catch (error) {
        app.innerHTML = '<p>Error fetching deals. Please try again later.</p>';
        console.error('Error:', error);
    }
}

// Render deals in a responsive grid
function renderDeals(deals) {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            ${deals.map(deal => `
                <div class="card border border-gray-200 rounded p-4 shadow-md">
                    <img class="w-full rounded" src="${deal.thumb}" alt="${deal.title}">
                    <h2 class="text-lg font-bold mt-2">${deal.title}</h2>
                    <p class="text-gray-600">Sale Price: $${deal.salePrice}</p>
                    <p class="text-gray-500 line-through">Normal Price: $${deal.normalPrice}</p>
                    <a href="https://www.cheapshark.com/redirect?dealID=${deal.dealID}" target="_blank"
                       class="text-electricBlue underline mt-2 inline-block">View Deal</a>
                </div>
            `).join('')}
        </div>
    `;
}

// Check if the user is logged in
document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('username');
    const usernameDisplay = document.getElementById('usernameDisplay');
    const logoutButton = document.getElementById('logoutButton');
    const signInButton = document.getElementById('signInButton');

    if (username) {
        usernameDisplay.textContent = `Welcome, ${username}`;
        usernameDisplay.classList.remove('hidden');
        logoutButton.classList.remove('hidden');
        signInButton.classList.add('hidden');
    }

    // Logout functionality
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('username');
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    });
});


// Search bar functionality
document.getElementById('searchBar').addEventListener('input', (e) => {
    fetchDeals(e.target.value);
});

// Initial fetch
loadDeals();
