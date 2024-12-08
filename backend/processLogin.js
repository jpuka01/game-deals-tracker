const express = require('express');
const router = express.Router();
const User = require('./user');

app.post('/login', async (req, res) => {
    const { username } = req.body;

    try {
        const user = await User.findOne({ username });
        if (user) {
            res.status(200).json({ message: 'Login successful' });
        } else {
            res.status(401).json({ message: 'Invalid username' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// edit this 
module.exports = processLogin;
