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
    const app = document.getElementById('app-favorites');
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
                const fetchUrl = `https://www.cheapshark.com/api/1.0/deals?id=${dealID}`;
                console.log(`Fetch URL: ${fetchUrl}`);
                if (!fetchUrl.includes('undefined')) {
                    try {
                        const response = await fetch(fetchUrl);
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
                } else {
                    console.error('Fetch URL is undefined:', fetchUrl);
                    return null;
                }
            })
        );
    
        const validDealDetails = dealDetails.filter((deal) => deal !== null);

        if (validDealDetails.length === 0) {
            app.innerHTML = '<p>No valid favorite deals could be loaded.</p>';
            return;
        }

        // Display the valid deal details
        app.innerHTML = `
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                ${validDealDetails.map(deal => {
                    const dealDetails = deal.gameInfo; // Access the gameInfo object
                    return `
                        <div class="card border border-gray-200 rounded p-4 shadow-md">
                            <img class="w-full rounded" src="${dealDetails.thumb}" alt="${dealDetails.name}">
                            <h2 class="text-lg font-bold mt-2">${dealDetails.name}</h2>
                            <p class="text-gray-600">Sale Price: $${dealDetails.salePrice}</p>
                            <p class="text-gray-500 line-through">Normal Price: $${dealDetails.retailPrice}</p>
                            <p class="text-gray-600">Steam Rating: ${dealDetails.steamRatingText} (${dealDetails.steamRatingPercent}%)</p>
                            <p class="text-gray-600">Metacritic Score: ${dealDetails.metacriticScore}</p>
                            <a href="https://www.cheapshark.com/redirect?dealID=${deal.dealID}" target="_blank"
                               class="text-electricBlue underline mt-2 inline-block">View Deal</a>
                        </div>
                    `;
                }).join('')}
            </div>
        `;;
    } catch (error) {
        console.error('Error fetching deal details:', error);
        app.innerHTML = '<p>There was an error loading your favorite deals.</p>';
    }
}


document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();
    loadFavorites();
});