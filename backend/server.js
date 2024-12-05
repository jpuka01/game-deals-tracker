const express = require('express');
const cors = require('cors');
const dealsRouter = require('./routes/deals');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
const processLoginRouter = require('./processLogin.js');
// const connectDB = require('../db/connection');
// connectDB();

const app = express();
app.use(cors());
app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// Use the new login route
app.use('/processLogin', processLoginRouter);

// Fetch the API
app.use('/deals', dealsRouter);

// MongoDB connection setup
// mongoose.connect('mongodb://127.0.0.1:27017/gameTracker', { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log('MongoDB connected'))
//     .catch((error) => console.log('MongoDB connection error:', error));

// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
