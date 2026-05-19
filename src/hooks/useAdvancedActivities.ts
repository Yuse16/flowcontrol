"use client";
import { useState, useEffect, useCallback } from 'react';
import { Activity, ActivityType, RecurrencePattern, ActivityModule } from '@/types/activity';
import { PriorityLevel } from '@/types/common';
import { formatDateString } from '@/utils/date';

const STORAGE_KEY = 'flowcontrol_advanced_activities';

export function useAdvancedActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setActivities(JSON.parse(stored));
      } catch (e) {}
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
    }
  }, [activities, isLoaded]);

  const addActivity = useCallback((data: Omit<Activity, 'id' | 'createdAt' | 'completionHistory' | 'isCompleted'>) => {
    const newActivity: Activity = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      isCompleted: false,
      completionHistory: {}
    };
    setActivities(prev => [...prev, newActivity]);
  }, []);

  const updateActivity = useCallback((id: string, updates: Partial<Activity>) => {
    setActivities(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  }, []);

  const deleteActivity = useCallback((id: string) => {
    setActivities(prev => prev.filter(a => a.id !== id));
  }, []);

  const toggleCompletion = useCallback((id: string, dateStr: string) => {
    setActivities(prev => prev.map(act => {
      if (act.id !== id) return act;
      
      if (act.type === 'variable') {
        return { ...act, isCompleted: !act.isCompleted };
      } else {
        const history = { ...(act.completionHistory || {}) };
        history[dateStr] = !history[dateStr];
        return { ...act, completionHistory: history };
      }
    }));
  }, []);

  const getActivitiesForDate = useCallback((date: Date) => {
    const dateStr = formatDateString(date);
    const dayOfWeek = date.getDay();
    const today = new Date();
    today.setHours(0,0,0,0);
    const queryDate = new Date(date);
    queryDate.setHours(0,0,0,0);
    
    return activities.filter(act => {
      if (act.type === 'recurrent') {
        if (!act.recurrence) return false;
        if (act.recurrence === 'daily') return true;
        if (act.recurrence === 'weekdays' && dayOfWeek >= 1 && dayOfWeek <= 5) return true;
        if (act.recurrence === 'weekends' && (dayOfWeek === 0 || dayOfWeek === 6)) return true;
        if (act.recurrence === 'custom' && act.customDays?.includes(dayOfWeek)) return true;
        return false;
      } else {
        // Variables:
        // Si no está completada y se creó antes o igual a queryDate, aparece como pendiente en ese día.
        // O si ya está completada pero se completó HOY (para el historial).
        // En un MVP, los variables activos aparecen hasta completarse. 
        // Si queryDate es menor a la fecha de creación, no mostrar.
        const createdDate = new Date(act.createdAt);
        createdDate.setHours(0,0,0,0);
        
        if (queryDate < createdDate) return false;
        if (act.isCompleted) {
          // Solo mostrar completados variables en el día exacto en que se completó si tuviéramos fecha de fin,
          // Por ahora, solo mostrarlos en el día actual o si no, ocultar de días pasados
          return queryDate.getTime() === today.getTime();
        }
        return true;
      }
    });
  }, [activities]);

  return {
    activities,
    addActivity,
    updateActivity,
    deleteActivity,
    toggleCompletion,
    getActivitiesForDate,
    isLoaded
  };
}
