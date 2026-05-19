"use client";
import { useState, useEffect, useCallback } from 'react';
import { TodoTask, TodoStatus } from '@/types/todo';
import { PriorityLevel } from '@/types/common';

const STORAGE_KEY = 'flowcontrol_todos';

export function useTodos() {
  const [tasks, setTasks] = useState<TodoTask[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setTasks(JSON.parse(stored));
      } catch (e) {}
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      const today = new Date();
      today.setHours(0,0,0,0);
      let changed = false;
      
      const updatedTasks = tasks.map(t => {
        if (t.status !== 'completed' && t.dueDate) {
          const dueDate = new Date(t.dueDate);
          dueDate.setHours(0,0,0,0);
          if (dueDate < today && t.status !== 'delayed') {
            changed = true;
            return { ...t, status: 'delayed' as TodoStatus };
          }
        }
        return t;
      });

      if (changed) setTasks(updatedTasks);
      else localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks, isLoaded]);

  const addTask = useCallback((title: string, status: TodoStatus = 'pending', priority: PriorityLevel = 'medium') => {
    const newTask: TodoTask = {
      id: crypto.randomUUID(),
      title,
      status,
      priority,
      categoryIds: [],
      isFavorite: false,
      createdAt: new Date().toISOString()
    };
    setTasks(prev => [...prev, newTask]);
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<TodoTask>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const moveTask = useCallback((id: string, newStatus: TodoStatus) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, isFavorite: !t.isFavorite } : t));
  }, []);

  const getProgress = useCallback(() => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter(t => t.status === 'completed').length;
    return Math.round((completed / tasks.length) * 100);
  }, [tasks]);

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    toggleFavorite,
    getProgress,
    isLoaded
  };
}
