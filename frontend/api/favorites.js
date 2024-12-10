import { fetchDeals } from './deals.js';
import { BACKEND_URL } from './config.js';

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
                    <button 
                        class="favorite-button mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                        data-dealid="${deal.dealID}">
                        ❤️ Favorite
                    </button>
                </div>
            `).join('')}
        </div>
    `;
    setupFavoriteButtons();
}

function setupFavoriteButtons() {
    const favoriteButtons = document.querySelectorAll('.favorite-button');

    favoriteButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const dealID = event.target.dataset.dealid;
            const username = localStorage.getItem('username');

            if (!username) {
                alert('You must be logged in to favorite deals!');
                return;
            }

            try {
                const response = await fetch(`${BACKEND_URL}/favorites`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, dealID }),
                });

                const result = await response.json();
                if (response.ok) {
                    alert('Deal added to favorites!');
                } else {
                    console.error(result.message);
                    alert('Error adding favorite deal.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error adding favorite deal.');
            }
        });
    });
}

async function checkLoginStatus() {
    const usernameDisplay = document.getElementById('usernameDisplay');
    const logoutButton = document.getElementById('logoutButton');
    const signInButton = document.querySelector('a[href="./frontend/login.html"]');
    const username = localStorage.getItem('username');

    if (username) {
        usernameDisplay.textContent = `Welcome, ${username}!`;
        usernameDisplay.classList.remove('hidden');
        logoutButton.classList.remove('hidden');
        signInButton.classList.add('hidden');
    } else {
        usernameDisplay.classList.add('hidden');
        logoutButton.classList.add('hidden');
        signInButton.classList.remove('hidden');
    }

    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('username');
        window.location.href = 'https://jpuka01.github.io/game-deals-tracker/';
    });
}

async function loadFavorites() {
    const username = localStorage.getItem('username');
    if (!username) {
        alert('You must be logged in to view favorites!');
        window.location.href = './login.html';
        return;
    }

    try {
        const response = await fetch(`${BACKEND_URL}/favorites/${username}`);
        const { favorites } = await response.json();
        renderFavorites(favorites);
    } catch (error) {
        console.error('Error fetching favorites:', error);
        alert('Error fetching favorite deals.');
    }
}

function renderFavorites(favorites) {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            ${favorites.map(dealID => `
                <div class="card border border-gray-200 rounded p-4 shadow-md">
                    <p>Deal ID: ${dealID}</p>
                </div>
            `).join('')}
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();

    const searchBar = document.getElementById('searchBar');
    if (searchBar) {
        searchBar.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            loadDeals(query);
        });
    } else {
        console.error('Search bar not found');
    }

    if (window.location.pathname.includes('favorites.html')) {
        loadFavorites();
    } else {
        loadDeals();
    }
});