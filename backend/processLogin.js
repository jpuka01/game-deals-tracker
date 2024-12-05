const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Assuming you have a User model for MongoDB

// Handle the login process
router.post('/', async (req, res) => {
    const { username } = req.body;

    try {
        // Check if the username exists in the database
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).send('Username not found');
        }

        // Login successful, proceed further (e.g., create a session or return success)
        // For simplicity, we're returning a success message.
        res.status(200).send('Login successful');
    } catch (error) {
        res.status(500).send('Error processing login');
    }
});

module.exports = router;
