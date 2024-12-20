const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios');
const nodemailer = require('nodemailer');

// Express App Setup
const app = express();
app.use(cors({ 
    origin: 'https://jpuka01.github.io',
}));
app.use(express.json());

// MongoDB Connection Setup
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};
connectDB();

// MongoDB User Schema and Model
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    favorites: { type: [String], default: [] },
});
const User = mongoose.model('User', userSchema);

// Routes

// 1. Fetch the API
app.get('/deals', async (req, res) => {
    const { search } = req.query; // Retrieve 'search' query param
    console.log('Fetching deals...');
    try {
        let response;
        if (search) {
            // Fetch the full deals API and filter results
            response = await axios.get('https://www.cheapshark.com/api/1.0/deals');
            const allDeals = response.data;

            // Filter deals based on the search query
            const filteredDeals = allDeals.filter(deal =>
                deal.title.toLowerCase().includes(search.toLowerCase())
            );

            res.json(filteredDeals);
        } else {
            // Default behavior
            response = await axios.get('https://www.cheapshark.com/api/1.0/deals?storeID=1&upperPrice=15');
            res.json(response.data);
        }
    } catch (error) {
        res.status(500).send('Error fetching deals');
    }
});


// 2. User Registration
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        
        const newUser = new User({ username, email, password, favorites: [] });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error registering user', error });
    }
});

// 3. User Login
app.post('/login', async (req, res) => {
    const { username } = req.body;
    try {
        const user = await User.findOne({ username });
        if (user) {
            res.status(200).json({ message: 'Login successful', user });
        } else {
            res.status(401).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
});

// 4. Add Favorite Deals
app.put('/favorites', async (req, res) => {
    const { username, dealID } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
        }

        if (!user.favorites.includes(dealID)) {
            user.favorites.push(dealID);
            await user.save();
        }

        await user.save();
        res.status(200).json({ message: 'Favorite deal added', favorites: user.favorites });
    } catch (error) {
        res.status(500).json({ message: 'Error adding favorite deal', error });
    }
});

// 5. Fetch User Favorites
app.get('/favorites/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
        }

        const favorites = user.favorites;
        res.status(200).json({ favorites: user.favorites });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching favorites', error });
    }
});

// Email Notification (NOTE ON FUNCTIONALITY and innerHTML)
const sendEmail = async (to, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

// Registered User Homepage
app.get('/index/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({
            message: `Welcome back, ${username}`,
            favorites: user.favorites,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user data', error });
    }
});


// Email Route
app.post('/send-email', async (req, res) => {
    const { to, subject, text } = req.body;
    try {
        await sendEmail(to, subject, text);
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error sending email', error });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
