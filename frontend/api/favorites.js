import { BACKEND_URL } from './config.js';

async function checkLoginStatus() {
    const usernameDisplay = document.getElementById('usernameDisplay');
    const logoutButton = document.getElementById('logoutButton');
    const username = localStorage.getItem('username');

    if (username) {
        usernameDisplay.textContent = `Welcome, ${username}!`;
        usernameDisplay.classList.remove('hidden');
        logoutButton.classList.remove('hidden');
    } else {
        usernameDisplay.classList.add('hidden');
        logoutButton.classList.add('hidden');
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
        if (!response.ok) {
            throw new Error('Failed to fetch favorites.');
        }

        const data = await response.json();
        const { favorites } = data;

        if (!Array.isArray(favorites)) {
            console.error('Invalid favorites data:', favorites);
            alert('Error fetching favorite deals.');
            return;
        }

        console.log('Fetched favorites:', favorites); // Debugging
        renderFavorites(favorites);
    } catch (error) {
        console.error('Error fetching favorites:', error);
        alert('Error fetching favorite deals.');
    }
}

async function renderFavorites(favorites) {
    const app = document.getElementById('app');
    if (!favorites || favorites.length === 0) {
        app.innerHTML = '<p>No favorite deals found.</p>';
        return;
    }

    try {
        const dealDetails = await Promise.all(
            favorites.map(async (encodedDealID) => {
                const dealID = decodeURIComponent(encodedDealID).trim();

                if (!dealID) {
                    console.error('Invalid dealID:', encodedDealID);
                    return null;
                }

                console.log(`Fetching details for dealID: ${dealID}`);
                try {
                    const response = await fetch(
                        `https://www.cheapshark.com/api/1.0/deals?id=${dealID}`
                    );
                    if (response.ok) {
                        return await response.json();
                    } else {
                        console.error(`Failed to fetch details for dealID: ${dealID}`);
                        return null;
                    }
                } catch (fetchError) {
                    console.error(`Fetch error for dealID: ${dealID}`, fetchError);
                    return null;
                }
            })
        );

        const validDealDetails = dealDetails.filter((deal) => deal !== null);

        if (validDealDetails.length === 0) {
            app.innerHTML = '<p>No valid favorite deals could be loaded.</p>';
            return;
        }

        app.innerHTML = `
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                ${validDealDetails
                    .map(
                        (deal) => `
                    <div class="card border border-gray-200 rounded p-4 shadow-md">
                        <img class="w-full rounded" src="${deal.thumb}" alt="${deal.title}">
                        <h2 class="text-lg font-bold mt-2">${deal.title}</h2>
                        <p class="text-gray-600">Sale Price: $${deal.salePrice}</p>
                        <p class="text-gray-500 line-through">Normal Price: $${deal.normalPrice}</p>
                        <a href="https://www.cheapshark.com/redirect?dealID=${deal.dealID}" target="_blank"
                           class="text-electricBlue underline mt-2 inline-block">View Deal</a>
                    </div>
                `
                    )
                    .join('')}
            </div>
        `;
    } catch (error) {
        console.error('Error rendering favorite deals:', error);
        app.innerHTML = '<p>Error loading favorite deals. Please try again later.</p>';
    }
}


document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();
    loadFavorites();
});