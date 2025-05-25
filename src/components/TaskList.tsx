'use client';

import React from 'react';
import { Status, Task } from '@prisma/client';
import { motion, AnimatePresence } from 'framer-motion';

interface TaskListProps {
  tasks: Task[];
  onStatusChange: (id: string, status: Status) => Promise<void>;
  onImportantToggle: (id: string, important: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit: (task: Task) => void;
}

export function TaskList({
  tasks,
  onStatusChange,
  onImportantToggle,
  onDelete,
  onEdit,
}: TaskListProps) {
  const statusColors: Record<Status, string> = {
    [Status.Pending]: 'text-gray-500',
    [Status.InProgress]: 'text-blue-500',
    [Status.Completed]: 'text-green-500',
    [Status.Skip]: 'text-yellow-500',
  };

  return (
    <div className="h-full flex flex-col">
      <ul className="space-y-4 flex-1 overflow-auto">
        <AnimatePresence>
          {tasks.map((task) => (
            <motion.li
              key={task.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="p-4 bg-gray-50 dark:bg-gray-800 rounded shadow flex justify-between items-start"
            >
              {/* Left side: Title, description, status label, important toggle */}
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onImportantToggle(task.id, task.important)}
                    title={task.important ? 'Unmark important' : 'Mark important'}
                    className={`text-lg focus:outline-none hover:cursor-pointer ${
                      task.important ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    {task.important ? '★' : '☆'}
                  </button>

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
                  <span className={statusColors[task.status]}>
                    {task.status}
                  </span>
                </p>
              </div>

              {/* Right side: status dropdown, edit/delete */}
              <div className="flex flex-col items-end space-y-2 ml-4 flex-none">
                <label htmlFor={`status-select-${task.id}`} className="sr-only">
                  Select status
                </label>
                <select
                  id={`status-select-${task.id}`}
                  value={task.status}
                  onChange={(e) =>
                    onStatusChange(task.id, e.target.value as Status)
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
                    onClick={() => onDelete(task.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
