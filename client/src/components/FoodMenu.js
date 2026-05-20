import React, { useState, useEffect, useCallback } from 'react';
import * as api from '../api';

function FoodMenu() {
  const [activeTab, setActiveTab] = useState('Breakfast');
  const [menuItems, setMenuItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', quantity: '', notes: '' });

  const fetchMenu = useCallback(async () => {
    try {
      const res = await api.getMenuItems();
      setMenuItems(res.data);
    } catch (err) {
      console.error('Error fetching menu:', err);
    }
  }, []);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  const filteredItems = menuItems.filter((item) => item.mealType === activeTab);
  const selectedCount = filteredItems.filter((item) => item.selected).length;

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    try {
      const res = await api.createMenuItem({ name: newItem.trim(), mealType: activeTab, selected: true });
      setMenuItems([...menuItems, res.data]);
      setNewItem('');
    } catch (err) {
      console.error('Error adding menu item:', err);
    }
  };

  const handleToggleSelect = async (item) => {
    try {
      const res = await api.updateMenuItem(item._id, { ...item, selected: !item.selected });
      setMenuItems(menuItems.map((m) => (m._id === item._id ? res.data : m)));
    } catch (err) {
      console.error('Error updating menu item:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteMenuItem(id);
      setMenuItems(menuItems.filter((m) => m._id !== id));
    } catch (err) {
      console.error('Error deleting menu item:', err);
    }
  };

  const handleEditStart = (item) => {
    setEditingId(item._id);
    setEditForm({ name: item.name, quantity: item.quantity || '', notes: item.notes || '' });
  };

  const handleEditSave = async (item) => {
    try {
      const res = await api.updateMenuItem(item._id, {
        name: editForm.name,
        quantity: editForm.quantity,
        notes: editForm.notes,
        selected: item.selected
      });
      setMenuItems(menuItems.map((m) => (m._id === item._id ? res.data : m)));
      setEditingId(null);
    } catch (err) {
      console.error('Error saving menu item:', err);
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
  };

  return (
    <div className="food-menu-page">
      <div className="food-menu-header">
        <h2>🍽️ Food Menu</h2>
        <p>Plan and select items for the celebration feast</p>
      </div>

      <div className="food-menu-tabs">
        <button
          className={`food-tab ${activeTab === 'Breakfast' ? 'active' : ''}`}
          onClick={() => setActiveTab('Breakfast')}
        >
          🌅 Breakfast
        </button>
        <button
          className={`food-tab ${activeTab === 'Lunch' ? 'active' : ''}`}
          onClick={() => setActiveTab('Lunch')}
        >
          🍛 Lunch
        </button>
      </div>

      <div className="food-menu-card">
        <div className="food-menu-card-header">
          <h3>{activeTab === 'Breakfast' ? '🌅 Breakfast Menu' : '🍛 Lunch Menu'}</h3>
          <span className="food-menu-count">
            {selectedCount}/{filteredItems.length} selected
          </span>
        </div>

        <div className="food-menu-list">
          {filteredItems.map((item) => (
            <div key={item._id} className={`food-menu-item ${item.selected ? 'selected' : ''}`}>
              {editingId === item._id ? (
                <div className="food-item-edit">
                  <input
                    className="food-edit-input"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    placeholder="Item name"
                  />
                  <input
                    className="food-edit-input small"
                    value={editForm.quantity}
                    onChange={(e) => setEditForm({ ...editForm, quantity: e.target.value })}
                    placeholder="Quantity (e.g. 2kg, 50 pcs)"
                  />
                  <input
                    className="food-edit-input"
                    value={editForm.notes}
                    onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                    placeholder="Notes"
                  />
                  <div className="food-edit-actions">
                    <button className="food-btn-save" onClick={() => handleEditSave(item)}>✓</button>
                    <button className="food-btn-cancel" onClick={handleEditCancel}>✕</button>
                  </div>
                </div>
              ) : (
                <>
                  <label className="food-item-checkbox">
                    <input
                      type="checkbox"
                      checked={item.selected}
                      onChange={() => handleToggleSelect(item)}
                    />
                    <span className="checkmark"></span>
                  </label>
                  <div className="food-item-info">
                    <span className={`food-item-name ${!item.selected ? 'unselected' : ''}`}>
                      {item.name}
                    </span>
                    {item.quantity && <span className="food-item-qty">{item.quantity}</span>}
                    {item.notes && <span className="food-item-notes">{item.notes}</span>}
                  </div>
                  <div className="food-item-actions">
                    <button onClick={() => handleEditStart(item)} title="Edit">✏️</button>
                    <button onClick={() => handleDelete(item._id)} title="Delete">🗑️</button>
                  </div>
                </>
              )}
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className="food-menu-empty">
              <span>No items added yet. Add your first {activeTab.toLowerCase()} item below!</span>
            </div>
          )}
        </div>

        <form className="food-add-form" onSubmit={handleAdd}>
          <input
            className="food-add-input"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder={`Add new ${activeTab.toLowerCase()} item...`}
          />
          <button type="submit" className="food-add-btn">+ Add</button>
        </form>
      </div>
    </div>
  );
}

export default FoodMenu;
