'use client';

import React from 'react';
import { HiOutlineInbox } from 'react-icons/hi'; // Use any icon you like

export function EmptyState({ message = 'No tasks match your filters.' }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
      {/* Inbox Icon */}
      <HiOutlineInbox className="w-16 h-16 mb-4" />
      <p className="text-lg">{message}</p>
    </div>
  );
}
