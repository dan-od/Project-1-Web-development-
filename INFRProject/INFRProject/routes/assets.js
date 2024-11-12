// routes/assets.js
const express = require('express');
const router = express.Router();
const Asset = require('../models/asset'); // Import the Asset model

// Route to render the form for adding a new asset
router.get('/add', (req, res) => {
  res.render('addAsset', { title: 'Add New Asset' });
});

// Route to handle form submission for adding a new asset
router.post('/add', async (req, res) => {
  try {
    const { name, category, serialNumber, purchaseDate, status, notes } = req.body;

    // Validate required fields
    if (!name || !category || !status) {
      throw new Error('Name, Category, and Status are required.');
    }

    const newAsset = new Asset({
      name,
      category,
      serialNumber,
      purchaseDate,
      status,
      notes
    });

    await newAsset.save();
    res.redirect('/assets/check'); // Redirect to check inventory
  } catch (error) {
    res.render('error', { title: 'Error', message: error.message, error });
  }
});

// Route to render the form for looking up an asset
router.get('/lookup', (req, res) => {
  res.render('lookupAsset', { title: 'Lookup Asset', message: null });
});

// Route to handle lookup functionality
router.post('/lookup', async (req, res) => {
  try {
    const { serialNumber } = req.body;

    // Search for the asset by serial number
    const asset = await Asset.findOne({ serialNumber });

    if (!asset) {
      res.render('lookupAsset', { title: 'Lookup Asset', message: 'No result found for this serial number', asset: null });
    } else {
      res.render('assetDetails', { title: 'Asset Details', asset });
    }
  } catch (error) {
    res.render('error', { title: 'Error', message: error.message, error });
  }
});

// Route to render the edit form for an asset
router.get('/edit/:id', async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) {
      throw new Error('Asset not found');
    }
    res.render('editAsset', { title: 'Edit Asset', asset });
  } catch (error) {
    res.render('error', { title: 'Error', message: error.message, error });
  }
});

// Route to handle editing an asset
router.post('/edit/:id', async (req, res) => {
  try {
    const { name, category, serialNumber, purchaseDate, status, notes } = req.body;

    await Asset.findByIdAndUpdate(req.params.id, {
      name,
      category,
      serialNumber,
      purchaseDate,
      status,
      notes
    });

    res.redirect('/assets/check'); // Redirect to assets list
  } catch (error) {
    res.render('error', { title: 'Error', message: error.message, error });
  }
});

// Route for checking inventory (/assets/check)
router.get('/check', async (req, res) => {
  try {
    const assets = await Asset.find(); // Fetch all assets from the database
    res.render('checkInventory', { title: 'Check Inventory', assets });
  } catch (error) {
    res.render('error', { title: 'Error', message: error.message, error });
  }
});

module.exports = router;
