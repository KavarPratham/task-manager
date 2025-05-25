'use client';

import { useState } from "react";
import { useUser, SignInButton } from "@clerk/nextjs";
import { TaskList } from "@/components/TaskList";
import { EditTaskForm } from "@/components/EditTaskForm";
import { TaskForm } from "@/components/Taskform";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { EmptyState } from "@/components/EmptyState";
import { Task } from "@prisma/client";
import { useTasks } from "@/context/TaskProvider";
import { motion, AnimatePresence } from "framer-motion";

export default function ImportantPage() {
  const { isSignedIn } = useUser();
  const { tasks, loading, updateTask, deleteTask } = useTasks();

  const [isAddModal, setAddModal] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);

  const importantTasks = tasks.filter((t) => t.important);

  if (!isSignedIn) {
    return (
      <main className="flex flex-col h-full w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 items-center justify-center">
        <EmptyState message="Please sign in to view your Important tasks." />
        <SignInButton>
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Sign In
          </button>
        </SignInButton>
      </main>
    );
  }

  return (
    <>
      {/* Animate background dimming when modal open */}
      <motion.main
        className="flex flex-col h-full w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
        animate={{ opacity: (isAddModal || editTask) ? 0.6 : 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <h1 className="text-3xl font-bold">
            Important Tasks
            <span className="ml-2 text-2xl font-normal text-gray-500 dark:text-gray-400">
              ({importantTasks.length})
            </span>
          </h1>
          <button
            onClick={() => setAddModal(true)}
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            + Add Task
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-auto">
          {loading ? (
            <LoadingOverlay />
          ) : importantTasks.length > 0 ? (
            <TaskList
              tasks={importantTasks}
              onStatusChange={(id, status) =>
                updateTask(id, { status })
              }
              onImportantToggle={(id, current) =>
                updateTask(id, { important: !current })
              }
              onDelete={deleteTask}
              onEdit={setEditTask}
            />
          ) : (
            <EmptyState message="No important tasks found." />
          )}
        </div>
      </motion.main>

      {/* Add Task Modal */}
      <AnimatePresence>
        {isAddModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black"
              style={{ opacity: 0.5 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="relative bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg max-w-md w-full"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
            >
              <button
                className="absolute top-3 right-3 text-xl"
                onClick={() => setAddModal(false)}
              >
                ✕
              </button>
              <TaskForm
                afterSubmit={() => {
                  setAddModal(false);
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Task Modal */}
      <AnimatePresence>
        {editTask && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black"
              style={{ opacity: 0.5 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="relative bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg max-w-md w-full"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
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
                onSaved={() => {
                  setEditTask(null);
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
