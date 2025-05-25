// src/context/TaskContext.tsx
"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Task } from "@prisma/client";
// import { Status } from "@prisma/client";

// Shape of our context
interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  addTask: (t: Omit<Task, "id" | "userId" | "createdAt">) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | null>(null);

// Key for sessionStorage
const STORAGE_KEY = "guest_tasks";

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const isGuest = !user;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Load tasks either from API or sessionStorage
  useEffect(() => {
    setLoading(true);
    if (isGuest) {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      setTasks(raw ? JSON.parse(raw) : []);
      setLoading(false);
    } else {
      fetch("/api/tasks", { credentials: "include" })
        .then((res) => res.json())
        .then((data: Task[]) => setTasks(data))
        .finally(() => setLoading(false));
    }
  }, [isGuest]);

  // Save guest tasks to sessionStorage whenever they change
  useEffect(() => {    
    if (isGuest) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks, isGuest]);

  // Helper to refresh signed-in tasks
  async function refetch() {
    setLoading(true);
    const data = await fetch("/api/tasks", { credentials: "include" }).then((r) =>
      r.json()
    );
    setTasks(data);
    setLoading(false);
  }

  // add / update / delete
  async function addTask(payload: Omit<Task, "id" | "userId" | "createdAt">) {
    if (isGuest) {
      // generate a temporary id & createdAt
      const temp: Task = {
        ...payload,
        id: crypto.randomUUID(),
        userId: "guest",
        createdAt: new Date(),
      };
      setTasks((ts) => [temp, ...ts]);
    } else {
      await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      await refetch();
    }
  }

  async function updateTask(id: string, updates: Partial<Task>) {
    if (isGuest) {
      setTasks((ts) =>
        ts.map((t) => (t.id === id ? { ...t, ...updates } : t))
      );
    } else {
      await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      });
      await refetch();
    }
  }

  async function deleteTask(id: string) {
    if (isGuest) {
      setTasks((ts) => ts.filter((t) => t.id !== id));
    } else {
      await fetch("/api/tasks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      await refetch();
    }
  }

  return (
    <TaskContext.Provider
      value={{ tasks, loading, addTask, updateTask, deleteTask }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTasks must be used inside TaskProvider");
  return ctx;
}
