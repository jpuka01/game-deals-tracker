import { BACKEND_URL } from './config.js';

// Fetch deals and render them
export async function fetchDeals(query = '') {
    try {
        const response = await fetch(`${BACKEND_URL}/deals`);
        let deals = await response.json();

        // Filter deals by search query
        if (query) {
            deals = deals.filter(deal => deal.title.toLowerCase().includes(query.toLowerCase()));
        }

        return deals;
    } catch (error) {
        console.error('Error fetching deals:', error);
        throw error;
    }
};
