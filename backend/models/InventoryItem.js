const mongoose = require('mongoose');

const inventoryItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  unit: { type: String, default: 'unit' },
  category: { type: String, default: 'general' }, // e.g., dairy-free, gluten-free
  barcode: { type: String },
  expirationDate: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('InventoryItem', inventoryItemSchema);
