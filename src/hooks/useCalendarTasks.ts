"use client";
import { useState, useEffect, useCallback } from 'react';
import { CalendarTask } from '@/types/calendar';
import { PriorityLevel } from '@/types/common';

const STORAGE_KEY = 'flowcontrol_calendar_tasks';

export function useCalendarTasks() {
  const [tasks, setTasks] = useState<CalendarTask[]>([]);
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks, isLoaded]);

  const addTask = useCallback((task: Omit<CalendarTask, 'id' | 'createdAt'>) => {
    const newTask: CalendarTask = {
      ...task,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    setTasks(prev => [...prev, newTask]);
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<CalendarTask>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const toggleTaskStatus = useCallback((id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  }, []);

  const moveTask = useCallback((id: string, newDate: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, date: newDate } : t));
  }, []);

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    moveTask,
    isLoaded
  };
}
