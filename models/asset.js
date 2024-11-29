// models/asset.js
const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  serialNumber: { type: String },
  purchaseDate: { type: Date },
  status: { 
    type: String, 
    enum: ['Available', 'Assigned', 'In Repair', 'Retired'], 
    required: true 
  },
  notes: { type: String }
});

module.exports = mongoose.model('Asset', assetSchema);
