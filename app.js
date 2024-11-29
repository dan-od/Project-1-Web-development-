const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();
const authRoutes = require('./auth/auth'); // Correct path to auth.js
const assetRoutes = require('./routes/assets'); // Correct path to assets.js
const generalRoutes = require('./routes/team');
require('dotenv').config();
app.use('/', generalRoutes);

app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // Session expiry to 1 day
    },
  })
);


// Set up view engine and public directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to make session data accessible in views
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

// Use routes
app.use('/auth', authRoutes); // Authentication routes
app.use('/assets', assetRoutes); // Asset routes

// Home Route
app.get('/', (req, res) => {
  res.render('home', { title: 'Home' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Something went wrong';
  res.status(status).render('error', { title: 'Error', message, error: err });
});

// Catch-all 404 route
app.use((req, res) => {
  res.status(404).render('error', { title: 'Error', message: 'Page Not Found', error: {} });
});


module.exports = app;
