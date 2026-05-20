const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');

// Get all menu items (optionally filter by mealType)
router.get('/', async (req, res) => {
  try {
    const filter = req.query.mealType ? { mealType: req.query.mealType } : {};
    const items = await MenuItem.find(filter).sort({ sortOrder: 1, createdAt: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create menu item
router.post('/', async (req, res) => {
  try {
    const { name, mealType, group, quantity, notes, selected } = req.body;
    const count = await MenuItem.countDocuments({ mealType });
    const item = new MenuItem({ name, mealType, group, quantity, notes, selected, sortOrder: count });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update menu item
router.put('/:id', async (req, res) => {
  try {
    const { name, quantity, notes, selected } = req.body;
    const item = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { name, quantity, notes, selected },
      { new: true }
    );
    if (!item) return res.status(404).json({ error: 'Menu item not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete menu item
router.delete('/:id', async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Menu item not found' });
    res.json({ message: 'Menu item deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
