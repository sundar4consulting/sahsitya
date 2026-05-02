import React from 'react';

function TaskRow({ task, onStatusCycle, onPriorityCycle, onEdit, onDelete }) {
  const statusClass = task.status.toLowerCase().replace(' ', '-');
  const priorityClass = task.priority ? task.priority.toLowerCase() : 'none';

  const formatDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short'
    });
  };

  return (
    <tr>
      <td>
        <span className={`task-name ${task.status === 'Done' ? 'done' : ''}`}>
          {task.name}
        </span>
      </td>
      <td style={{ color: task.assignee ? '#1f2937' : '#d1d5db' }}>
        {task.assignee || '—'}
      </td>
      <td style={{ color: task.dueDate ? '#1f2937' : '#d1d5db' }}>
        {formatDate(task.dueDate)}
      </td>
      <td>
        <span
          className={`priority-badge ${priorityClass}`}
          onClick={() => onPriorityCycle(task)}
          title="Click to change priority"
        >
          {task.priority || '—'}
        </span>
      </td>
      <td>
        <span
          className={`status-badge ${statusClass}`}
          onClick={() => onStatusCycle(task)}
          title="Click to change status"
        >
          {task.status}
        </span>
      </td>
      <td>
        <div className="task-actions">
          <button onClick={onEdit} title="Edit">✏️</button>
          <button onClick={onDelete} title="Delete">🗑️</button>
        </div>
      </td>
    </tr>
  );
}

export default TaskRow;
