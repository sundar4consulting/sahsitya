import React, { useState, useEffect, useCallback } from 'react';
import * as api from '../api';

function FoodMenu() {
  const [activeTab, setActiveTab] = useState('Breakfast');
  const [menuItems, setMenuItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [newGroup, setNewGroup] = useState('');
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

  // Group items by their group field
  const groupedItems = filteredItems.reduce((acc, item) => {
    const group = item.group || 'Other';
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});

  const groupOrder = Object.keys(groupedItems);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    try {
      const res = await api.createMenuItem({
        name: newItem.trim(),
        mealType: activeTab,
        group: newGroup.trim() || 'Other',
        selected: true
      });
      setMenuItems([...menuItems, res.data]);
      setNewItem('');
      setNewGroup('');
    } catch (err) {
      console.error('Error adding menu item:', err);
    }
  };

  const handleToggleSelect = async (item) => {
    if (item.alwaysIncluded) return;
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

  const handleExportPDF = () => {
    const selectedItems = filteredItems.filter((item) => item.selected);
    const grouped = selectedItems.reduce((acc, item) => {
      const g = item.group || 'Other';
      if (!acc[g]) acc[g] = [];
      acc[g].push(item);
      return acc;
    }, {});

    const title = activeTab === 'Breakfast' ? 'முஹூர்த்தம் - Tiffin Menu' : 'முஹூர்த்தம் சாப்பாடு - Lunch Menu';

    const rows = Object.entries(grouped).map(([group, items]) =>
      `<tr><td colspan="2" style="background:#f8e8d0;font-weight:700;color:#a8001a;padding:8px 12px;font-size:14px;">▸ ${group}</td></tr>` +
      items.map((item, i) =>
        `<tr><td style="padding:6px 12px 6px 28px;border-bottom:1px solid #f0e0c8;">${i + 1}. ${item.name}</td><td style="padding:6px 12px;border-bottom:1px solid #f0e0c8;color:#555;">${item.quantity || ''}</td></tr>`
      ).join('')
    ).join('');

    const html = `
      <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: 'Noto Sans Tamil', 'Catamaran', sans-serif; margin: 0; padding: 30px; background: #fff; color: #5a1a1a; }
          .card { max-width: 700px; margin: 0 auto; border: 2px solid #c9a874; border-radius: 14px; padding: 30px 40px; background: linear-gradient(135deg, #f5e3c0 0%, #f0d9a8 50%, #ecd095 100%); }
          .banner { background: linear-gradient(180deg, #a8001a 0%, #7a0010 100%); color: #ffd700; text-align: center; padding: 12px 40px; font-size: 22px; font-weight: 700; border-radius: 22px; width: fit-content; margin: 0 auto 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          .footer { text-align: center; margin-top: 25px; font-size: 12px; color: #888; }
          .count { text-align: center; font-size: 14px; margin-bottom: 10px; color: #5a1a1a; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="banner">${title}</div>
          <div class="count">${selectedItems.length} items selected</div>
          <table>${rows}</table>
        </div>
        <div class="footer">Generated on ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  };

  return (
    <div className="food-menu-page">
      <div className="food-menu-header">
        <h2>🍽️ முஹூர்த்தம் Food Menu</h2>
        <p>Select items for the celebration feast</p>
      </div>

      <div className="food-menu-tabs">
        <button
          className={`food-tab ${activeTab === 'Breakfast' ? 'active' : ''}`}
          onClick={() => setActiveTab('Breakfast')}
        >
          🌅 Tiffin (Breakfast)
        </button>
        <button
          className={`food-tab ${activeTab === 'Lunch' ? 'active' : ''}`}
          onClick={() => setActiveTab('Lunch')}
        >
          🍛 சாப்பாடு (Lunch)
        </button>
      </div>

      <div className="food-menu-export-bar">
        <button className="food-export-btn" onClick={handleExportPDF}>
          📄 Export {activeTab === 'Breakfast' ? 'Tiffin' : 'Lunch'} Menu as PDF
        </button>
      </div>

      <div className="food-menu-card">
        <div className="food-menu-card-header">
          <h3>{activeTab === 'Breakfast' ? '🌅 Tiffin Menu' : '🍛 முஹூர்த்தம் சாப்பாடு'}</h3>
          <span className="food-menu-count">
            {selectedCount}/{filteredItems.length} selected
          </span>
        </div>

        <div className="food-menu-list">
          {groupOrder.map((group) => (
            <div key={group} className="food-menu-group">
              <div className="food-group-header">
                <span className="food-group-name">
                  {group === 'Always' ? '✦ Always Included' : `▸ ${group}`}
                </span>
                <span className="food-group-count">
                  {groupedItems[group].filter(i => i.selected).length}/{groupedItems[group].length}
                </span>
              </div>
              <div className="food-group-items">
                {groupedItems[group].map((item) => (
                  <div key={item._id} className={`food-menu-item ${item.selected ? 'selected' : ''} ${item.alwaysIncluded ? 'always' : ''}`}>
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
                          placeholder="Quantity"
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
                            disabled={item.alwaysIncluded}
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
                          {!item.alwaysIncluded && (
                            <button onClick={() => handleDelete(item._id)} title="Delete">🗑️</button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className="food-menu-empty">
              <span>No items yet. Add items below or run the seed script.</span>
            </div>
          )}
        </div>

        <form className="food-add-form" onSubmit={handleAdd}>
          <input
            className="food-add-input"
            value={newGroup}
            onChange={(e) => setNewGroup(e.target.value)}
            placeholder="Group (e.g. சட்னி)"
            style={{ maxWidth: '140px' }}
          />
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
