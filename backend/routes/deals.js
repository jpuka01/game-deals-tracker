const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/', async (req, res) => {
    try {
        const response = await axios.get('https://www.cheapshark.com/api/1.0/deals?storeID=1&upperPrice=15');
        res.json(response.data);
    } catch (error) {
        res.status(500).send('Error fetching deals');
    }
});

module.exports = router;
