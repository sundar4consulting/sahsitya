const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Get all tasks (optionally filter by category)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    const tasks = await Task.find(filter).populate('category').sort({ createdAt: 1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create task
router.post('/', async (req, res) => {
  try {
    const task = new Task({
      name: req.body.name,
      category: req.body.category,
      assignee: req.body.assignee || '',
      dueDate: req.body.dueDate || null,
      priority: req.body.priority || '',
      status: req.body.status || 'Pending'
    });
    await task.save();
    const populated = await task.populate('category');
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update task
router.put('/:id', async (req, res) => {
  try {
    const updates = {};
    const allowed = ['name', 'assignee', 'dueDate', 'priority', 'status', 'category'];
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });
    const task = await Task.findByIdAndUpdate(req.params.id, updates, { new: true }).populate('category');
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
