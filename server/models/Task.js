const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  assignee: { type: String, default: '' },
  dueDate: { type: Date, default: null },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Urgent', ''], default: '' },
  status: { type: String, enum: ['Pending', 'In Progress', 'Done'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', taskSchema);
