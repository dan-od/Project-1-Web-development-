const express = require('express');
const router = express.Router();
const Asset = require('../models/asset'); // Model for asset
const jwt = require('jsonwebtoken');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.token) {
    try {
      const decoded = jwt.verify(req.session.token, process.env.SESSION_KEY);
      console.log("Decoded JWT:", decoded);
      req.user = decoded; // Attach user data to the request object
      return next();
    } catch (error) {
      console.error("Invalid JWT:", error.message);
    }
  }
  res.redirect('/auth/login'); // Redirect to login if not authenticated
};

// Route for landing page (/assets)
router.get('/', isAuthenticated, (req, res) => {
  res.redirect('/assets/check'); // Redirect to inventory check or main page
});

// Route for assets overview (protected)
router.get('/assets', isAuthenticated, (req, res) => {
  res.render('assets', { title: 'Assets' });
});

// Route to render the form for adding a new asset (protected)
router.get('/add', isAuthenticated, (req, res) => {
  res.render('addAsset', { title: 'Add New Asset' });
});

// Route to handle adding a new asset (protected)
router.post('/add', isAuthenticated, async (req, res) => {
  try {
    const { name, category, serialNumber, purchaseDate, status, notes } = req.body;

    if (!name || !category || !status) {
      throw new Error('Name, Category, and Status are required.');
    }

    const newAsset = new Asset({ name, category, serialNumber, purchaseDate, status, notes });
    await newAsset.save();
    res.redirect('/assets/check');
  } catch (error) {
    res.render('error', { title: 'Error', message: error.message });
  }
});

// Route to render the form for editing an asset (protected)
router.get('/edit/:id', isAuthenticated, async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) {
      throw new Error('Asset not found');
    }
    res.render('editAsset', { title: 'Edit Asset', asset });
  } catch (error) {
    res.render('error', { title: 'Error', message: error.message });
  }
});

// Route to handle editing an asset (protected)
router.post('/edit/:id', isAuthenticated, async (req, res) => {
  try {
    const { name, category, serialNumber, purchaseDate, status, notes } = req.body;

    await Asset.findByIdAndUpdate(req.params.id, {
      name,
      category,
      serialNumber,
      purchaseDate,
      status,
      notes,
    });

    res.redirect('/assets/check'); // Redirect to asset list
  } catch (error) {
    res.render('error', { title: 'Error', message: error.message });
  }
});

// Route to handle deleting an asset (protected)
router.post('/delete/:id', isAuthenticated, async (req, res) => {
  try {
    await Asset.findByIdAndDelete(req.params.id);
    res.redirect('/assets/check');
  } catch (error) {
    res.render('error', { title: 'Error', message: error.message });
  }
});

// Route to render inventory check (protected)
router.get('/check', isAuthenticated, async (req, res) => {
  try {
    const assets = await Asset.find(); // Fetch all assets from the database
    res.render('checkInventory', { title: 'Check Inventory', assets });
  } catch (error) {
    res.render('error', { title: 'Error', message: error.message });
  }
});

router.get('/lookup', isAuthenticated, (req, res) => {
  res.redirect('/assets/check'); // Redirect to inventory check or main page
});

router.post('/lookup', isAuthenticated, async (req, res) => {
  try {
    const { serialNumber, name } = req.body;

    // Search for the asset by either serial number or name
    let query = {};
    if (serialNumber) {
      query.serialNumber = serialNumber;
    } else if (name) {
      query.name = name;
    }

    const asset = await Asset.findOne(query);

    if (!asset) {
      res.render('lookupAsset', {
        title: 'Lookup Asset',
        message: 'No result found for the provided details',
        asset: null,
      });
    } else {
      res.render('assetDetails', { title: 'Asset Details', asset });
    }
  } catch (error) {
    res.render('error', { title: 'Error', message: error.message, error });
  }
});


module.exports = router;
