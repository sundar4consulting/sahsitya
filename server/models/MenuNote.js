const mongoose = require('mongoose');

const menuNoteSchema = new mongoose.Schema({
  mealType: { type: String, enum: ['Breakfast', 'Lunch'], required: true, unique: true },
  content: { type: String, default: '' },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MenuNote', menuNoteSchema);
