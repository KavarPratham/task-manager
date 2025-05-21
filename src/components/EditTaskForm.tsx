'use client';

import { FormEvent, useState } from 'react';
import { Status, Task } from '@prisma/client';

interface EditTaskFormProps {
  task: Task;
  onClose: () => void;
  onSaved: () => void;
}

export function EditTaskForm({ task, onClose, onSaved }: EditTaskFormProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [status, setStatus] = useState<Status>(task.status);
  const [important, setImportant] = useState(task.important);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: task.id,
          title,
          description,
          status,
          important,
        }),
      });
      if (!res.ok) throw new Error();
      setMessage('Saved!');
      onSaved();
    } catch {
      setMessage('Failed to save.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Title with floating label */}
      <div className="relative">
        <input
          id="edit-title"
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder=" "
          disabled={saving}
          className="block w-full px-2.5 pb-2.5 pt-4 text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        />
        <label
          htmlFor="edit-title"
          className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-placeholder-shown:top-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-2 peer-focus:left-2 left-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500"
        >
          Title
        </label>
      </div>

      {/* Description with floating label */}
      <div className="relative">
        <textarea
          id="edit-description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder=" "
          rows={3}
          disabled={saving}
          className="block w-full px-2.5 pb-2.5 pt-4 text-gray-900 bg-transparent rounded-lg border border-gray-300 resize-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        />
        <label
          htmlFor="edit-description"
          className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-placeholder-shown:top-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-2 peer-focus:left-2 left-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500"
        >
          Description
        </label>
      </div>

      {/* Status dropdown */}
      <div className="relative">
        <select
          id="edit-status"
          value={status}
          onChange={e => setStatus(e.target.value as Status)}
          disabled={saving}
          className="block w-full px-2.5 pb-2.5 pt-4 bg-transparent text-gray-900 rounded-lg border border-gray-300 dark:text-white dark:border-gray-600 dark:bg-gray-800 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        >
          {Object.values(Status).map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <label
          htmlFor="edit-status"
          className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:text-blue-600 peer-focus:left-2 left-2 peer-focus:dark:text-blue-500"
        >
          Status
        </label>
      </div>

      {/* Important checkbox */}
      <label className="flex items-center gap-2 text-sm text-gray-900 dark:text-white">
        <input
          type="checkbox"
          checked={important}
          onChange={() => setImportant(!important)}
          className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          disabled={saving}
        />
        Important
      </label>

      {/* Buttons */}
      <div className="flex justify-end items-center gap-4">
        <button
          type="button"
          onClick={onClose}
          disabled={saving}
          className="px-4 py-2 rounded border border-gray-300 text-gray-700 dark:text-white dark:border-gray-600 hover:bg-gray-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded disabled:opacity-50"
        >
          {saving && (
            <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-t-transparent border-white"></span>
          )}
          <span>{saving ? 'Saving…' : 'Save'}</span>
        </button>
      </div>

      {message && (
        <p className="text-sm text-center mt-2 text-green-600 dark:text-green-400">{message}</p>
      )}
    </form>
  );
}
