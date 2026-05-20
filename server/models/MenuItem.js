const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mealType: { type: String, enum: ['Breakfast', 'Lunch'], required: true },
  quantity: { type: String, default: '' },
  notes: { type: String, default: '' },
  selected: { type: Boolean, default: false },
  sortOrder: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
