"use client";
import { useState, useEffect, useCallback } from 'react';
import { Activity, ActivityStatus } from '@/types/activity';
import { TodoTask, TodoStatus } from '@/types/todo';
import { CalendarTask } from '@/types/calendar';
import { formatDateString } from '@/utils/date';

const STORAGE_KEY = 'flowcontrol_advanced_activities';
const TODO_STORAGE_KEY = 'flowcontrol_todos';
const CALENDAR_STORAGE_KEY = 'flowcontrol_calendar_tasks';
const MIGRATION_FLAG_KEY = 'flowcontrol_activities_migration_done';

function normalizeEstado(activity: Activity): ActivityStatus {
  if (activity.estado === 'completado') return 'completado';
  if (activity.fechaProgramada) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(activity.fechaProgramada);
    dueDate.setHours(0, 0, 0, 0);
    if (dueDate < today) return 'vencido';
  }
  return activity.estado || 'pendiente';
}

function mapTodoToActivity(task: TodoTask): Activity {
  const statusMap: Record<TodoStatus, ActivityStatus> = {
    pending: 'pendiente',
    in_progress: 'en_proceso',
    completed: 'completado',
    delayed: 'vencido',
  };

  return {
    id: task.id,
    titulo: task.title,
    descripcion: task.description,
    title: task.title,
    description: task.description,
    fechaProgramada: task.dueDate,
    priority: task.priority,
    estado: statusMap[task.status],
    fechaCreacion: task.createdAt,
    fechaCompletado: task.status === 'completed' ? task.createdAt : undefined,
    origen: 'actividades',
  };
}

function mapCalendarToActivity(task: CalendarTask): Activity {
  return {
    id: task.id,
    titulo: task.title,
    descripcion: task.description,
    title: task.title,
    description: task.description,
    fechaProgramada: task.date,
    priority: task.priority,
    estado: task.completed ? 'completado' : 'pendiente',
    fechaCreacion: task.createdAt,
    fechaCompletado: task.completed ? task.createdAt : undefined,
    origen: 'calendario',
  };
}

function dedupeActivities(activities: Activity[]) {
  const map = new Map<string, Activity>();
  activities.forEach(activity => {
    if (!map.has(activity.id)) {
      map.set(activity.id, activity);
    }
  });
  return Array.from(map.values());
}

export function useAdvancedActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    let loadedActivities: Activity[] = [];

    if (stored) {
      try {
        loadedActivities = JSON.parse(stored);
      } catch (e) {
        loadedActivities = [];
      }
    }

    const migrationDone = localStorage.getItem(MIGRATION_FLAG_KEY) === 'true';
    const legacyTodos = localStorage.getItem(TODO_STORAGE_KEY);
    const legacyCalendar = localStorage.getItem(CALENDAR_STORAGE_KEY);

    if (!migrationDone && (legacyTodos || legacyCalendar)) {
      let migratedActivities: Activity[] = [];

      if (legacyTodos) {
        try {
          const todos: TodoTask[] = JSON.parse(legacyTodos);
          migratedActivities = migratedActivities.concat(todos.map(mapTodoToActivity));
        } catch (e) {
          // ignore malformed legacy todo data
        }
      }

      if (legacyCalendar) {
        try {
          const calendarTasks: CalendarTask[] = JSON.parse(legacyCalendar);
          migratedActivities = migratedActivities.concat(calendarTasks.map(mapCalendarToActivity));
        } catch (e) {
          // ignore malformed legacy calendar data
        }
      }

      loadedActivities = dedupeActivities([...loadedActivities, ...migratedActivities]);
      localStorage.setItem(MIGRATION_FLAG_KEY, 'true');
    }

    setActivities(loadedActivities);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
    }
  }, [activities, isLoaded]);

  const addActivity = useCallback((data: Omit<Activity, 'id' | 'fechaCreacion' | 'estado' | 'fechaCompletado'>) => {
    const newActivity: Activity = {
      ...data,
      id: crypto.randomUUID(),
      fechaCreacion: new Date().toISOString(),
      estado: 'pendiente',
      fechaCompletado: undefined,
      title: data.titulo,
      description: data.descripcion,
    };
    setActivities(prev => [...prev, newActivity]);
  }, []);

  const updateActivity = useCallback((id: string, updates: Partial<Activity>) => {
    setActivities(prev => prev.map(activity => {
      if (activity.id !== id) return activity;

      const next = { ...activity, ...updates };
      if ('titulo' in updates) {
        next.title = updates.titulo ?? activity.title;
      }
      if ('title' in updates) {
        next.titulo = updates.title ?? activity.titulo;
      }
      if ('descripcion' in updates) {
        next.description = updates.descripcion ?? activity.description;
      }
      if ('description' in updates) {
        next.descripcion = updates.description ?? activity.descripcion;
      }
      if (updates.estado === 'completado' && !activity.fechaCompletado) {
        next.fechaCompletado = new Date().toISOString();
      }
      if (activity.estado === 'completado' && updates.estado && updates.estado !== 'completado') {
        next.fechaCompletado = undefined;
      }
      return next;
    }));
  }, []);

  const deleteActivity = useCallback((id: string) => {
    setActivities(prev => prev.filter(activity => activity.id !== id));
  }, []);

  const toggleCompletion = useCallback((id: string) => {
    setActivities(prev => prev.map(activity => {
      if (activity.id !== id) return activity;

      const isDone = activity.estado === 'completado';
      return {
        ...activity,
        estado: isDone ? 'pendiente' : 'completado',
        fechaCompletado: isDone ? undefined : new Date().toISOString(),
      };
    }));
  }, []);

  const getCalendarActivitiesForDate = useCallback((date: Date) => {
    const dateStr = formatDateString(date);
    const dayOfWeek = date.getDay();

    return activities.filter(activity => {
      if (activity.fechaProgramada) {
        return activity.fechaProgramada === dateStr;
      }
      if (activity.type === 'recurrent') {
        if (!activity.recurrence) return false;
        if (activity.recurrence === 'daily') return true;
        if (activity.recurrence === 'weekdays' && dayOfWeek >= 1 && dayOfWeek <= 5) return true;
        if (activity.recurrence === 'weekends' && (dayOfWeek === 0 || dayOfWeek === 6)) return true;
        if (activity.recurrence === 'custom' && activity.customDays?.includes(dayOfWeek)) return true;
      }
      return false;
    });
  }, [activities]);

  const getActivitiesByStatus = useCallback((status: ActivityStatus | 'upcoming' | 'today') => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = formatDateString(today);

    return activities.filter(activity => {
      const normalizedStatus = normalizeEstado(activity);
      if (status === 'upcoming') {
        return normalizedStatus === 'pendiente' && activity.fechaProgramada && activity.fechaProgramada > todayStr;
      }
      if (status === 'today') {
        if (activity.fechaProgramada) {
          return activity.fechaProgramada === todayStr && normalizedStatus !== 'completado';
        }
        return normalizedStatus !== 'completado';
      }
      return normalizedStatus === status;
    });
  }, [activities]);

  const getActivityStatus = useCallback((activity: Activity) => normalizeEstado(activity), []);

  return {
    activities,
    addActivity,
    updateActivity,
    deleteActivity,
    toggleCompletion,
    getCalendarActivitiesForDate,
    getActivitiesByStatus,
    getActivityStatus,
    isLoaded,
  };
}
