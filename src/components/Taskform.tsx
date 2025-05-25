'use client';

import { FormEvent, useState } from 'react';
import { Status } from '@prisma/client';
import { useTasks } from '@/context/TaskProvider';

export function TaskForm({ afterSubmit }: { afterSubmit?: () => void }) {
  const { addTask } = useTasks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [important, setImportant] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    setMessage('');

    try {
      await addTask({
        title,
        description,
        status: Status.Pending,
        important,
      });
      setTitle('');
      setDescription('');
      setImportant(false);
      setMessage('Task added!');
      afterSubmit?.();
    } catch {
      setMessage('Oops, something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-gray-800 dark:text-white text-center">
        Create a New Task
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Title floating outlined */}
        <div className="relative">
          <input
            id="title"
            type="text"
            placeholder=" "
            value={title}
            onChange={e => setTitle(e.target.value)}
            disabled={loading}
            className="block w-full px-2.5 pb-2.5 pt-4
              text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none
              dark:text-white dark:border-gray-600 dark:focus:border-blue-500
              focus:outline-none focus:ring-0 focus:border-blue-600
              peer"
          />
          <label
            htmlFor="title"
            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform
              -translate-y-4 scale-75 left-2 top-2 z-10 origin-[0]
              bg-white dark:bg-gray-900 px-2
              peer-placeholder-shown:top-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2
              peer-focus:top-2 peer-focus:left-2 peer-focus:scale-75 peer-focus:-translate-y-4
              peer-focus:text-blue-600 peer-focus:dark:text-blue-500"
          >
            Title
          </label>
        </div>

        {/* Description floating outlined */}
        <div className="relative">
          <textarea
            id="description"
            placeholder=" "
            rows={3}
            value={description}
            onChange={e => setDescription(e.target.value)}
            disabled={loading}
            className="block w-full px-2.5 pb-2.5 pt-4
              text-gray-900 bg-transparent rounded-lg border border-gray-300 resize-none
              dark:text-white dark:border-gray-600 dark:focus:border-blue-500
              focus:outline-none focus:ring-0 focus:border-blue-600
              peer"
          />
          <label
            htmlFor="description"
            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform
              -translate-y-4 scale-75 left-2 top-2 z-10 origin-[0]
              bg-white dark:bg-gray-900 px-2
              peer-placeholder-shown:top-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2
              peer-focus:top-2 peer-focus:left-2 peer-focus:scale-75 peer-focus:-translate-y-4
              peer-focus:text-blue-600 peer-focus:dark:text-blue-500"
          >
            Description (optional)
          </label>
        </div>

        {/* Important toggle */}
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-white">
          <input
            type="checkbox"
            checked={important}
            onChange={() => setImportant(v => !v)}
            disabled={loading}
            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          Important
        </label>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded bg-blue-600 px-4 py-2 text-white
                     hover:bg-blue-700 disabled:opacity-50"
        >
          {loading && (
            <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-t-transparent border-white"></span>
          )}
          <span>{loading ? 'Adding...' : 'Add Task'}</span>
        </button>

        {message && (
          <p className="text-center text-sm text-green-600 dark:text-green-400">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
