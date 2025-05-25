'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TaskForm } from '@/components/Taskform';
import { TaskList } from '@/components/TaskList';
import { EditTaskForm } from '@/components/EditTaskForm';
import { LoadingOverlay } from '@/components/LoadingOverlay';
import { EmptyState } from '@/components/EmptyState';
import { Status } from '@prisma/client';
import { useTasks } from '@/context/TaskProvider';

export default function DashboardPage() {
  const [statusFilter, setStatusFilter] = useState<'All' | Status>('All');
  const [importantOnly, setImportantOnly] = useState(false);

  const {
    tasks: rawTasks,
    loading,
    updateTask,
    deleteTask,
  } = useTasks();

  const tasks = useMemo(() => {
    return rawTasks
      .filter(t => statusFilter === 'All' || t.status === statusFilter)
      .filter(t => !importantOnly || t.important);
  }, [rawTasks, statusFilter, importantOnly]);

  const [isAddModal, setAddModal] = useState(false);
  const [editTask, setEditTask] = useState<null | typeof rawTasks[0]>(null);

  return (
    <main className="flex flex-col h-full w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex justify-between items-center mb-4 flex-none"
      >
        <h1 className="text-3xl font-bold">
          Your Tasks
          <span className="ml-2 text-2xl font-normal text-gray-500 dark:text-gray-400">
            ({tasks.length})
          </span>
        </h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setAddModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          + Add Task
        </motion.button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex items-center gap-4 mb-4 flex-none"
      >
        <label className="flex items-center gap-2 text-sm">
          <span>Status:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as 'All' | Status)}
            className="border p-1 rounded dark:bg-gray-700 dark:text-white"
          >
            <option value="All">All</option>
            {Object.values(Status).map(s => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-1 text-sm">
          <input
            type="checkbox"
            checked={importantOnly}
            onChange={() => setImportantOnly(v => !v)}
            className="w-4 h-4"
          />
          Important only
        </label>
      </motion.div>

      {/* Tasks Area */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <LoadingOverlay />
        ) : tasks.length > 0 ? (
          <TaskList
            tasks={tasks}
            onStatusChange={(id, status) => updateTask(id, { status })}
            onImportantToggle={(id, current) => updateTask(id, { important: !current })}
            onDelete={deleteTask}
            onEdit={setEditTask}
          />
        ) : (
          <EmptyState
            message={
              statusFilter !== 'All' || importantOnly
                ? 'No tasks match your filters.'
                : 'Your tasks will appear here.'
            }
          />
        )}
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {isAddModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg max-w-md w-full"
            >
              <button
                className="absolute top-3 right-3 text-xl"
                onClick={() => setAddModal(false)}
              >
                ✕
              </button>
              <TaskForm afterSubmit={() => setAddModal(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editTask && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg max-w-md w-full"
            >
              <button
                className="absolute top-3 right-3 text-xl"
                onClick={() => setEditTask(null)}
              >
                ✕
              </button>
              <EditTaskForm
                task={editTask}
                onClose={() => setEditTask(null)}
                onSaved={() => setEditTask(null)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
