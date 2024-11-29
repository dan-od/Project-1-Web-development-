require('dotenv').config(); // Load environment variables from .env file
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// Log the MongoDB URI being used
console.log("Using MongoDB URI:", process.env.MONGODB_URI_DANIEL);

// Choose which connection URI to use
const MONGODB_URI = process.env.MONGODB_URI_DANIEL;

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, // Increase the timeout to 30 seconds
    socketTimeoutMS: 45000 // Optional: timeout for socket operations
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.log("Error connecting to MongoDB:", err));

module.exports = mongoose;
