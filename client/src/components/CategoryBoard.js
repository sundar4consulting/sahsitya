import React, { useState } from 'react';
import TaskRow from './TaskRow';
import EditTaskModal from './EditTaskModal';

function CategoryBoard({
  category,
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onDeleteCategory,
  onUpdateCategory,
  onReorderTasks
}) {
  const [newTaskName, setNewTaskName] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [catName, setCatName] = useState(category.name);
  const [draggedId, setDraggedId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);

  const orderedTasks = [...tasks].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  const doneCount = orderedTasks.filter((t) => t.status === 'Done').length;

  const handleDragStart = (id) => setDraggedId(id);
  const handleDragOver = (e, id) => { e.preventDefault(); setDragOverId(id); };
  const handleDragEnd = () => { setDraggedId(null); setDragOverId(null); };
  const handleDrop = (e, dropId) => {
    e.preventDefault();
    if (!draggedId || draggedId === dropId) { handleDragEnd(); return; }
    const ids = orderedTasks.map(t => t._id);
    const fromIdx = ids.indexOf(draggedId);
    const toIdx = ids.indexOf(dropId);
    ids.splice(fromIdx, 1);
    ids.splice(toIdx, 0, draggedId);
    onReorderTasks(ids);
    handleDragEnd();
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;
    onAddTask({ name: newTaskName.trim(), category: category._id });
    setNewTaskName('');
  };

  const handleStatusCycle = (task) => {
    const order = ['Pending', 'In Progress', 'Done'];
    const next = order[(order.indexOf(task.status) + 1) % order.length];
    onUpdateTask(task._id, { status: next });
  };

  const handlePriorityCycle = (task) => {
    const order = ['', 'Low', 'Medium', 'High', 'Urgent'];
    const next = order[(order.indexOf(task.priority) + 1) % order.length];
    onUpdateTask(task._id, { priority: next });
  };

  const handleCategoryNameSave = () => {
    if (catName.trim() && catName.trim() !== category.name) {
      onUpdateCategory(category._id, catName.trim());
    }
    setIsEditingName(false);
  };

  return (
    <div className="category-board">
      <div className="category-header">
        <div className="category-header-left">
          {isEditingName ? (
            <input
              className="inline-edit"
              style={{ color: '#333', maxWidth: 250 }}
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
              onBlur={handleCategoryNameSave}
              onKeyDown={(e) => e.key === 'Enter' && handleCategoryNameSave()}
              autoFocus
            />
          ) : (
            <h2 onDoubleClick={() => setIsEditingName(true)}>{category.name}</h2>
          )}
          <span className="category-badge">
            {doneCount}/{tasks.length}
          </span>
        </div>
        <div className="category-actions">
          <button onClick={() => setIsEditingName(true)} title="Rename">✏️</button>
          <button
            onClick={() => {
              if (window.confirm(`Delete "${category.name}" and all its items?`)) {
                onDeleteCategory(category._id);
              }
            }}
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="category-body">
        {orderedTasks.length > 0 && (
          <table className="task-table">
            <thead>
              <tr>
                <th style={{ width: '3%' }}></th>
                <th style={{ width: '37%' }}>Item</th>
                <th style={{ width: '15%' }}>Person</th>
                <th style={{ width: '15%' }}>Due Date</th>
                <th style={{ width: '10%' }}>Priority</th>
                <th style={{ width: '12%' }}>Status</th>
                <th style={{ width: '8%' }}></th>
              </tr>
            </thead>
            <tbody>
              {orderedTasks.map((task) => (
                <TaskRow
                  key={task._id}
                  task={task}
                  onStatusCycle={handleStatusCycle}
                  onPriorityCycle={handlePriorityCycle}
                  onEdit={() => setEditingTask(task)}
                  onDelete={() => onDeleteTask(task._id)}
                  isDragging={draggedId === task._id}
                  isDragOver={dragOverId === task._id}
                  onDragStart={() => handleDragStart(task._id)}
                  onDragOver={(e) => handleDragOver(e, task._id)}
                  onDrop={(e) => handleDrop(e, task._id)}
                  onDragEnd={handleDragEnd}
                />
              ))}
            </tbody>
          </table>
        )}

        <form className="add-task-row" onSubmit={handleAddTask}>
          <input
            className="add-task-input"
            type="text"
            placeholder="+ Add item..."
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
          />
          <button className="add-task-btn" type="submit">
            Add
          </button>
        </form>
      </div>

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onSave={(data) => {
            onUpdateTask(editingTask._id, data);
            setEditingTask(null);
          }}
          onClose={() => setEditingTask(null)}
        />
      )}
    </div>
  );
}

export default CategoryBoard;
