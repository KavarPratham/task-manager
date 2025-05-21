'use client';

import { useEffect, useState, useCallback } from 'react';
import { TaskForm } from '@/components/Taskform';
import { TaskList } from '@/components/TaskList';
import { EditTaskForm } from '@/components/EditTaskForm';
import { LoadingOverlay } from '@/components/LoadingOverlay';
import { EmptyState } from '@/components/EmptyState';
import { Task } from '@prisma/client';
import { Status } from '@prisma/client';

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModal, setIsAddModal] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);

  // Super filter state
  const [statusFilter, setStatusFilter] = useState<'All' | Status>('All');
  const [importantOnly, setImportantOnly] = useState(false);

  // Fetch tasks with filters
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      // Build query string
      const params: string[] = [];
      if (statusFilter !== 'All') params.push(`status=${statusFilter}`);
      if (importantOnly) params.push(`important=true`);
      const query = params.length ? `?${params.join('&')}` : '';
      const res = await fetch(`/api/tasks${query}`, {
        credentials: 'include',
      });
      const data: Task[] = await res.json();
      setTasks(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, importantOnly]);

  // Re-fetch whenever filters change
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <main className="flex flex-col h-screen max-w-2xl mx-auto p-6">
      {/* Header + Add Button */}
      <div className="flex justify-between items-center mb-4 flex-none">
        <h1 className="text-3xl font-bold">
          Your Tasks
          <span className="ml-2 text-2xl font-normal text-gray-500 dark:text-gray-400">
            ({tasks.length})
          </span>  
        </h1>
        <button
          onClick={() => setIsAddModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          + Add Task
        </button>
      </div>

      {/* Super Filter Bar */}
      <div className="flex items-center gap-4 mb-4 flex-none">
        {/* Status filter */}
        <label className="flex items-center gap-2 text-sm">
          <span>Status:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as 'All' | Status)}
            className="border p-1 rounded dark:bg-gray-700 dark:text-white"
          >
            <option value="All">All</option>
            {Object.values(Status).map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>

        {/* Important toggle */}
        <label className="flex items-center gap-1 text-sm">
          <input
            type="checkbox"
            checked={importantOnly}
            onChange={() => setImportantOnly(prev => !prev)}
            className="w-4 h-4"
          />
          Important only
        </label>
      </div>

      {/* Scrollable task list area */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <LoadingOverlay />
        ) : tasks.length ? (
          <TaskList
            tasks={tasks}
            refreshTasks={fetchTasks}
            onEdit={setEditTask}
          />
        ) : (
          <EmptyState message="No tasks match your filters." />
        )}
      </div>

      {/* Add Task Modal */}
      {isAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50" />
          <div className="relative bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg max-w-md w-full">
            <button
              className="absolute top-2 right-2"
              onClick={() => setIsAddModal(false)}
            >
              ✕
            </button>
            <TaskForm
              afterSubmit={() => {
                setIsAddModal(false);
                fetchTasks();
              }}
            />
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {editTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50" />
          <div className="relative bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg max-w-md w-full">
            <button
              className="absolute top-2 right-2"
              onClick={() => setEditTask(null)}
            >
              ✕
            </button>
            <EditTaskForm
              task={editTask}
              onClose={() => setEditTask(null)}
              onSaved={() => {
                setEditTask(null);
                fetchTasks();
              }}
            />
          </div>
        </div>
      )}
    </main>
  );
}
