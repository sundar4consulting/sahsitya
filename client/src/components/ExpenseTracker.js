import React, { useState, useEffect, useCallback } from 'react';
import * as api from '../api';

function ExpenseTracker({ categories }) {
  const [expenses, setExpenses] = useState([]);
  const [filterCategory, setFilterCategory] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    category: '',
    description: '',
    amount: '',
    paidBy: '',
    paidTo: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState('');

  const fetchExpenses = useCallback(async () => {
    try {
      const res = await api.getExpenses(filterCategory);
      setExpenses(res.data);
    } catch (err) {
      console.error('Error fetching expenses:', err);
    }
  }, [filterCategory]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const totalAmount = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);

  const resetForm = () => {
    setForm({ category: '', description: '', amount: '', paidBy: '', paidTo: '', image: null });
    setImagePreview('');
    setShowForm(false);
    setEditingId(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('category', form.category);
    formData.append('description', form.description);
    formData.append('amount', form.amount);
    formData.append('paidBy', form.paidBy);
    formData.append('paidTo', form.paidTo);
    if (form.image) formData.append('image', form.image);

    try {
      if (editingId) {
        const res = await api.updateExpense(editingId, formData);
        setExpenses(expenses.map((ex) => (ex._id === editingId ? res.data : ex)));
      } else {
        const res = await api.createExpense(formData);
        setExpenses([res.data, ...expenses]);
      }
      resetForm();
    } catch (err) {
      console.error('Error saving expense:', err);
    }
  };

  const handleEdit = (expense) => {
    setEditingId(expense._id);
    setForm({
      category: expense.category,
      description: expense.description || '',
      amount: expense.amount,
      paidBy: expense.paidBy,
      paidTo: expense.paidTo,
      image: null
    });
    setImagePreview(expense.imageUrl || '');
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteExpense(id);
      setExpenses(expenses.filter((ex) => ex._id !== id));
    } catch (err) {
      console.error('Error deleting expense:', err);
    }
  };

  return (
    <div className="expense-page">
      <div className="expense-header">
        <h2>💰 Expense Tracker</h2>
        <p>Track all celebration expenses by category</p>
      </div>

      <div className="expense-summary-bar">
        <div className="expense-total">
          <span className="expense-total-label">Total Expenses</span>
          <span className="expense-total-amount">₹{totalAmount.toLocaleString('en-IN')}</span>
        </div>
        <div className="expense-filter">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="expense-filter-select"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>
        <button className="expense-add-btn" onClick={() => { resetForm(); setShowForm(true); }}>
          + Add Expense
        </button>
      </div>

      {showForm && (
        <div className="expense-form-card">
          <h3>{editingId ? '✏️ Edit Expense' : '➕ New Expense'}</h3>
          <form onSubmit={handleSubmit} className="expense-form">
            <div className="expense-form-row">
              <div className="expense-form-field">
                <label>Category</label>
                <input
                  type="text"
                  list="category-list"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="Type or select category"
                  required
                />
                <datalist id="category-list">
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.name} />
                  ))}
                </datalist>
              </div>
              <div className="expense-form-field">
                <label>Amount (₹)</label>
                <input
                  type="number"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  placeholder="0"
                  required
                  min="0"
                />
              </div>
            </div>

            <div className="expense-form-row">
              <div className="expense-form-field">
                <label>Paid By</label>
                <input
                  type="text"
                  value={form.paidBy}
                  onChange={(e) => setForm({ ...form, paidBy: e.target.value })}
                  placeholder="Who paid?"
                  required
                />
              </div>
              <div className="expense-form-field">
                <label>Paid To</label>
                <input
                  type="text"
                  value={form.paidTo}
                  onChange={(e) => setForm({ ...form, paidTo: e.target.value })}
                  placeholder="Whom was it given?"
                  required
                />
              </div>
            </div>

            <div className="expense-form-field">
              <label>Description (optional)</label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Brief description of expense"
              />
            </div>

            <div className="expense-form-field">
              <label>Upload Receipt/Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="expense-file-input"
              />
              {imagePreview && (
                <div className="expense-image-preview">
                  <img src={imagePreview} alt="Receipt preview" />
                </div>
              )}
            </div>

            <div className="expense-form-actions">
              <button type="submit" className="expense-submit-btn">
                {editingId ? '✓ Update Expense' : '💰 Add Expense'}
              </button>
              <button type="button" className="expense-cancel-btn" onClick={resetForm}>
                ✕ Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="expense-list">
        {expenses.length === 0 && (
          <div className="expense-empty">
            <span>No expenses recorded yet. Click "+ Add Expense" to start tracking.</span>
          </div>
        )}
        {expenses.map((expense) => (
          <div key={expense._id} className="expense-card">
            <div className="expense-card-top">
              <div className="expense-card-info">
                <span className="expense-card-category">{expense.category}</span>
                <span className="expense-card-amount">₹{expense.amount.toLocaleString('en-IN')}</span>
              </div>
              <div className="expense-card-actions">
                <button onClick={() => handleEdit(expense)} title="Edit">✏️</button>
                <button onClick={() => handleDelete(expense._id)} title="Delete">🗑️</button>
              </div>
            </div>
            {expense.description && (
              <p className="expense-card-desc">{expense.description}</p>
            )}
            <div className="expense-card-people">
              <span><strong>Paid by:</strong> {expense.paidBy}</span>
              <span><strong>Paid to:</strong> {expense.paidTo}</span>
            </div>
            {expense.imageUrl && (
              <div className="expense-card-image">
                <img src={expense.imageUrl} alt="Receipt" onClick={() => window.open(expense.imageUrl, '_blank')} />
              </div>
            )}
            <div className="expense-card-date">
              {new Date(expense.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExpenseTracker;
