const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Correct path to user model

// Register Page
router.get('/register', (req, res) => {
  res.render('register', { title: 'Register' });
});

// Handle Registration
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  console.log("Registration Request Body:", req.body);

  if (!username || !email || !password) {
    return res.render('register', { title: 'Register', message: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password:", hashedPassword);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    console.log("New user registered successfully:", username);
    res.redirect('/auth/login');
  } catch (err) {
    console.error("Registration error:", err.message);
    res.render('register', { title: 'Register', message: 'User already exists' });
  }
});

// Login Page
router.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

// Handle Login with JWT
router.post('/login', async (req, res) => {
  const { identifier, password } = req.body;

  console.log("Login Request Body:", req.body);

  try {
    // Use case-insensitive query to find the user
    const query = identifier.includes('@')
      ? { email: { $regex: new RegExp("^" + identifier + "$", "i") } }
      : { username: { $regex: new RegExp("^" + identifier + "$", "i") } };

    console.log("Query Being Used:", query);

    const user = await User.findOne(query);
    console.log("Queried User:", user);

    if (!user) {
      console.log("User not found in database with identifier:", identifier);
      return res.render('login', { title: 'Login', message: 'Invalid username/email or password' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password comparison result:", isMatch);

    if (!isMatch) {
      return res.render('login', { title: 'Login', message: 'Invalid username/email or password' });
    }

    // Generate JWT token with fallback for SESSION_KEY
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.SESSION_KEY || 'default_secret_key', // Fallback to avoid missing key error
      { expiresIn: '1h' }
    );
    console.log("Generated JWT Token:", token);

    // Save token and user in session
    req.session.token = token;
    req.session.user = user;

    // Log the session data to verify
    console.log("Session Data:", req.session);

    res.redirect('/');
  } catch (error) {
    console.error("Login error:", error.message);
    res.render('login', { title: 'Login', message: 'An unexpected error occurred.' });
  }
});


// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    console.log("User logged out successfully.");
    res.redirect('/auth/login');
  });
});

module.exports = router;
