const express = require('express');
const router = express.Router();
const InventoryItem = require('../models/InventoryItem');

// Get all inventory items
router.get('/', async (req, res) => {
  const items = await InventoryItem.find();
  res.json(items);
});

// Add a new item
router.post('/', async (req, res) => {
  const item = new InventoryItem(req.body);
  await item.save();
  res.status(201).json(item);
});

// Update item
router.put('/:id', async (req, res) => {
  const updated = await InventoryItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// Delete item
router.delete('/:id', async (req, res) => {
  await InventoryItem.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

module.exports = router;
