import React, { useState } from 'react';

function EditTaskModal({ task, onSave, onClose }) {
  const [form, setForm] = useState({
    name: task.name,
    assignee: task.assignee || '',
    dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
    priority: task.priority || '',
    status: task.status
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      name: form.name,
      assignee: form.assignee,
      dueDate: form.dueDate || null,
      priority: form.priority,
      status: form.status
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Edit Task</h3>
        <form onSubmit={handleSubmit}>
          <div className="modal-field">
            <label>Task Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="modal-field">
            <label>Assignee</label>
            <input
              name="assignee"
              value={form.assignee}
              onChange={handleChange}
              placeholder="Assign to..."
            />
          </div>
          <div className="modal-field">
            <label>Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
            />
          </div>
          <div className="modal-field">
            <label>Priority</label>
            <select name="priority" value={form.priority} onChange={handleChange}>
              <option value="">None</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
          <div className="modal-field">
            <label>Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>
          <div className="modal-buttons">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditTaskModal;
