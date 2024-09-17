const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Create an Express application
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// MongoDB connection string (including the database name 'dashboard')
const mongoURI = 'mongodb+srv://sandeepsanwale:sandeepsanwale@cluster0.ovo5xjq.mongodb.net/dashboard?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB
mongoose.connect(mongoURI);

const db = mongoose.connection;

// Event handlers for MongoDB connection
db.on('error', (error) => console.error('Connection error:', error));
db.once('open', () => console.log('Connected to MongoDB'));

// Define a schema and model for jsondata
const jsonDataSchema = new mongoose.Schema({}, { strict: false });
const JsonData = mongoose.model('JsonData', jsonDataSchema);

// Define a GET API endpoint to fetch data from the jsondata collection
app.get('/api/jsondata', async (req, res) => {
    console.log("api hitting ")
  try {
    const filters = req.query;
    const query = {};

    if (filters.endYear) query.end_year = Number(filters.endYear);
    if (filters.topic) query.topic = filters.topic;
    if (filters.sector) query.sector = filters.sector;
    if (filters.region) query.region = filters.region;
    if (filters.pestle) query.pestle = filters.pestle;
    if (filters.source) query.source = filters.source;
    if (filters.country) query.country = filters.country;

    console.log('Filters:', filters);
    console.log('Query:', query);

    const data = await JsonData.find(query);
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
