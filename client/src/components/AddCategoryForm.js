import React, { useState } from 'react';

function AddCategoryForm({ onAdd }) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name.trim());
    setName('');
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <div className="add-category-card" onClick={() => setIsOpen(true)}>
        ➕ Add New Category
      </div>
    );
  }

  return (
    <form className="add-category-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Category name..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoFocus
      />
      <button type="submit" className="btn-save">Add</button>
      <button type="button" className="btn-cancel" onClick={() => setIsOpen(false)}>
        Cancel
      </button>
    </form>
  );
}

export default AddCategoryForm;
