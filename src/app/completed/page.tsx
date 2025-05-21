'use client';

import { useEffect, useState, useCallback } from 'react';
import { TaskList } from '@/components/TaskList';
import { EditTaskForm } from '@/components/EditTaskForm';
import { TaskForm } from '@/components/Taskform';
import { Task } from '@prisma/client';
import { EmptyState } from '@/components/EmptyState';
import { LoadingOverlay } from '@/components/LoadingOverlay';
// import { Status } from '@prisma/client';

export default function CompletedPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModal, setIsAddModal] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/tasks?status=Completed', {
        credentials: 'include',
      });
      const data: Task[] = await res.json();
      setTasks(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <main className="flex flex-col h-screen max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 flex-none">
        <h1 className="text-3xl font-bold">
            Completed Tasks
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

      {/* Scrollable List */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <LoadingOverlay/>
        ) : tasks.length ? (
          <TaskList
            tasks={tasks}
            refreshTasks={fetchTasks}
            onEdit={setEditTask}
          />
        ) : (
          <EmptyState message="Complete or Add a task First." />
        )}
      </div>

      {/* Add Modal */}
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

      {/* Edit Modal */}
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
