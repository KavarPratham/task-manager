'use client';

import React from 'react';
import { Status } from '@prisma/client';
import { Task } from '@prisma/client';

interface TaskListProps {
  tasks: Task[];
  refreshTasks: () => Promise<void>;
  onEdit: (task: Task) => void;
}

export function TaskList({ tasks, refreshTasks, onEdit }: TaskListProps) {
  // Update status
  async function updateStatus(id: string, newStatus: Status) {
    await fetch('/api/tasks', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus }),
    });
    await refreshTasks();
  }

  // Toggle important
  async function updateImportant(id: string, current: boolean) {
    await fetch('/api/tasks', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, important: !current }),
    });
    await refreshTasks();
  }

  // Delete task
  async function deleteTask(id: string) {
    await fetch('/api/tasks', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    await refreshTasks();
  }

  // Color mapping for statuses
  const statusColors: Record<Status, string> = {
    [Status.Pending]: 'text-gray-500',
    [Status.InProgress]: 'text-blue-500',
    [Status.Completed]: 'text-green-500',
    [Status.Skip]: 'text-yellow-500',
  };

  return (
    <div className="h-full flex flex-col">
      <ul className="space-y-4 flex-1 overflow-auto">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="p-4 bg-gray-50 dark:bg-gray-800 rounded shadow flex justify-between items-start"
          >
            {/* Left: Title, Description, Status, and Important Toggle */}
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                {/* Important star */}
                <span
                  className={`cursor-pointer text-lg ${
                    task.important ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  onClick={() => updateImportant(task.id, task.important)}
                  title={task.important ? 'Unmark important' : 'Mark important'}
                >
                  {task.important ? '★' : '☆'}
                </span>

                <h3
                  className={`text-lg font-semibold ${
                    task.status === Status.Completed
                      ? 'line-through text-gray-400'
                      : ''
                  }`}
                >
                  {task.title}
                </h3>
              </div>

              {task.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {task.description}
                </p>
              )}

              <p className="text-xs">
                <span className="font-medium">Status:</span>{' '}
                <span className={statusColors[task.status]}>
                  {task.status}
                </span>
              </p>
            </div>

            {/* Right: Actions */}
            <div className="flex flex-col items-end space-y-2 ml-4 flex-none">
              <label htmlFor={`status-select-${task.id}`} className="sr-only">
                Select status
              </label>
              <select
                id={`status-select-${task.id}`}
                value={task.status}
                onChange={(e) =>
                  updateStatus(task.id, e.target.value as Status)
                }
                className="border rounded p-1 text-sm dark:bg-gray-700 dark:text-white"
              >
                {Object.values(Status).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onEdit(task)}
                  className="px-2 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
