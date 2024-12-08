const express = require('express');
const User = require('./user');
// var app = express();


// help pasrse json body 
app.use(express.json());

// get register post info
app.post('/register', async (req, res) => {
    const {username, email} = req.body;

    try {
        const existingUser = await User.findOne({email});

        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered. Please log in' });
        } else {
            const newUser = new User({ username, email });
            await newUser.save();
            
            res.status(400).json({ message: 'You have sucessfully registered. Please log in' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = processRegister;







