import { BACKEND_URL } from './config.js';

// Fetch deals and render them
export async function fetchDeals(query = '') {
    try {
        const url = query
            ? `${BACKEND_URL}/deals?search=${encodeURIComponent(query)}`
            : `${BACKEND_URL}/deals`;

        const response = await fetch(url);
        const deals = await response.json();
        return deals;
    } catch (error) {
        console.error('Error fetching deals:', error);
        throw error;
    }
}
