const express = require('express');
const router = express.Router();
const Asset = require('../models/asset'); // Import the Asset model for consistency

// Route for the home page
router.get('/', (req, res) => {
  res.render('home', { title: 'Home' });
});

// Route for the support page (/support)
router.get('/support', (req, res) => {
  res.render('support', { title: 'Support' });
});

// Route for rendering the assets add page
router.get('/assets/add', (req, res) => {
  res.render('addAsset', { title: 'Add New Asset' });
});

// Route for checking inventory (/assets/check)
router.get('/assets/check', async (req, res) => {
  try {
    const assets = await Asset.find(); // Fetch all assets from the database
    res.render('checkInventory', { title: 'Check Inventory', assets });
  } catch (error) {
    res.render('error', { title: 'Error', message: error.message, error });
  }
});

module.exports = router;
