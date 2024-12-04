/* Initiates the backend server and sets up the routes for:
 * - Fetching the game data from CheapShark API
 * - Storing and retrieving favorite game deals from MongoDB 
 */
const express = require('express');
const cors = require('cors');
const dealsRouter = require('./routes/deals');
const connectDB = require('../db/connection');
connectDB();


const app = express();
app.use(cors());
app.use(express.json());

app.use('/deals', dealsRouter);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
