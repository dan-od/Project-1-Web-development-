require('dotenv').config(); // Load environment variables from .env file
const mongoose = require('mongoose');

// Choose which connection URI to use
const MONGODB_URI = process.env.MONGODB_URI_DANIEL

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.log("Error connecting to MongoDB:", err));

module.exports = mongoose;
