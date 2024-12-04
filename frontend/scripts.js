// Fetch deals and render them
const BACKEND_URL = 'http://127.0.0.1:3000';
async function fetchDeals(query = '') {
    const app = document.getElementById('app');
    app.innerHTML = '<p>Loading deals...</p>';
    try {
        const response = await fetch(`${BACKEND_URL}/deals`);
        let deals = await response.json();

        // Filter deals by search query
        if (query) {
            deals = deals.filter(deal => deal.title.toLowerCase().includes(query.toLowerCase()));
        }

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

// Search bar functionality
document.getElementById('searchBar').addEventListener('input', (e) => {
    fetchDeals(e.target.value);
});

// Initial fetch
fetchDeals();
