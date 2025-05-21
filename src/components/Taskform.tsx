'use client';

import { FormEvent, useState } from 'react';
import { Status } from '@prisma/client';

export function TaskForm({ afterSubmit }: { afterSubmit?: () => void }) {
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
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, important, status: Status.Pending }),
      });
      if (!res.ok) throw new Error();
      setTitle('');
      setDescription('');
      setImportant(false);
      afterSubmit?.();
      setMessage('Task added!');
    } catch {
      setMessage('Oops, error.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Title Floating Outlined */}
      <div className="relative">
        <input
          id="title"
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder=" "
          disabled={loading}
          className="
            block w-full px-2.5 pb-2.5 pt-4
            text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none
            dark:text-white dark:border-gray-600 dark:focus:border-blue-500
            focus:outline-none focus:ring-0 focus:border-blue-600
            peer
          "
        />
        <label
          htmlFor="title"
          className="
            absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform
            -translate-y-4 scale-75 left-2 top-2 z-10 origin-[0]
            bg-white dark:bg-gray-900 px-2
            peer-placeholder-shown:top-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2
            peer-focus:top-2 peer-focus:left-2 peer-focus:scale-75 peer-focus:-translate-y-4
            peer-focus:text-blue-600 peer-focus:dark:text-blue-500
          "
        >
          Title
        </label>
      </div>

      {/* Description Floating Outlined */}
      <div className="relative">
        <textarea
          id="description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder=" "
          rows={3}
          disabled={loading}
          className="
            block w-full px-2.5 pb-2.5 pt-4
            text-gray-900 bg-transparent rounded-lg border border-gray-300 resize-none
            dark:text-white dark:border-gray-600 dark:focus:border-blue-500
            focus:outline-none focus:ring-0 focus:border-blue-600
            peer
          "
        />
        <label
          htmlFor="description"
          className="
            absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform
            -translate-y-4 scale-75 left-2 top-2 z-10 origin-[0]
            bg-white dark:bg-gray-900 px-2
            peer-placeholder-shown:top-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2
            peer-focus:top-2 peer-focus:left-2 peer-focus:scale-75 peer-focus:-translate-y-4
            peer-focus:text-blue-600 peer-focus:dark:text-blue-500
          "
        >
          Description (optional)
        </label>
      </div>

      {/* Important Toggle */}
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={important}
          disabled={loading}
          onChange={() => setImportant(!important)}
          className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="text-gray-900 dark:text-gray-100">Important</span>
      </label>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading && (
          <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-t-transparent"></span>
        )}
        <span>{loading ? 'Adding...' : 'Add Task'}</span>
      </button>

      {message && (
        <p className="text-center text-sm text-green-600 dark:text-green-400">
          {message}
        </p>
      )}
    </form>
  );
}
