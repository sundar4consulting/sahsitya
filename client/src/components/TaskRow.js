import React from 'react';

function TaskRow({ task, onStatusCycle, onPriorityCycle, onEdit, onDelete,
  isDragging, isDragOver, onDragStart, onDragOver, onDrop, onDragEnd }) {
  const statusClass = task.status.toLowerCase().replace(' ', '-');
  const priorityClass = task.priority ? task.priority.toLowerCase() : 'none';

  const formatDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short'
    });
  };

  const rowClass = [
    isDragging ? 'row-dragging' : '',
    isDragOver ? 'row-drag-over' : ''
  ].filter(Boolean).join(' ');

  return (
    <>
      <tr
        className={rowClass}
        draggable
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onDragEnd={onDragEnd}
      >
        <td className="drag-handle" title="Drag to reorder">⠿</td>
        <td>
          <span className={`task-name ${task.status === 'Done' ? 'done' : ''}`}>
            {task.name}
          </span>
          {task.notes && (
            <div className="notes-inline" title={task.notes}>
              📝 {task.notes.length > 60 ? task.notes.slice(0, 60) + '…' : task.notes}
            </div>
          )}
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
    </>
  );
}

export default TaskRow;
