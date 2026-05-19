"use client";
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Reminder } from '@/types/reminder';

const STORAGE_KEY = 'flowcontrol_critical_reminders';

interface ReminderContextType {
  reminders: Reminder[];
  activeReminder: Reminder | null;
  isModalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  addReminder: (message: string, delayMs: number) => void;
  deleteReminder: (id: string) => void;
  dismissActive: () => void;
  isLoaded: boolean;
}

const ReminderContext = createContext<ReminderContextType | undefined>(undefined);

export function ReminderProvider({ children }: { children: React.ReactNode }) {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [activeReminder, setActiveReminder] = useState<Reminder | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const checkInterval = useRef<NodeJS.Timeout | null>(null);

  // Load from storage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setReminders(parsed);
      } catch (e) {}
    }
    setIsLoaded(true);
  }, []);

  // Save to storage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
    }
  }, [reminders, isLoaded]);

  // Background checker
  useEffect(() => {
    if (!isLoaded) return;

    checkInterval.current = setInterval(() => {
      const now = Date.now();
      // Solo buscar si no hay una alerta activa ya en pantalla
      if (!activeReminder) {
        const nextActive = reminders.find(r => r.status === 'pending' && now >= r.targetTime);
        
        if (nextActive) {
          setReminders(prev => prev.map(r => r.id === nextActive.id ? { ...r, status: 'active' } : r));
          setActiveReminder({ ...nextActive, status: 'active' });
        }
      }
    }, 1000);

    return () => {
      if (checkInterval.current) clearInterval(checkInterval.current);
    };
  }, [reminders, isLoaded, activeReminder]);

  const addReminder = useCallback((message: string, delayMs: number) => {
    const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
    const newReminder: Reminder = {
      id,
      message,
      targetTime: Date.now() + delayMs,
      status: 'pending',
      type: 'critical',
      createdAt: Date.now()
    };
    setReminders(prev => [...prev, newReminder]);
  }, []);

  const deleteReminder = useCallback((id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  }, []);

  const dismissActive = useCallback(() => {
    if (!activeReminder) return;

    const currentId = activeReminder.id;
    const currentMessage = activeReminder.message;
    const currentType = activeReminder.type;

    // Mark current as dismissed in the list
    setReminders(prev => prev.map(r => r.id === currentId ? { ...r, status: 'dismissed' } : r));
    
    // Schedule follow-up if it was critical
    if (currentType === 'critical') {
      const followUpId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
      const followUp: Reminder = {
        id: followUpId,
        message: `Confirmación: ¿Realmente terminaste "${currentMessage}"?`,
        targetTime: Date.now() + (1000 * 60 * 60), // +1 Hour
        status: 'pending',
        type: 'followup',
        createdAt: Date.now()
      };
      setReminders(prev => [...prev, followUp]);
    }

    setActiveReminder(null);
  }, [activeReminder]);

  return (
    <ReminderContext.Provider value={{ reminders, activeReminder, isModalOpen, setModalOpen, addReminder, deleteReminder, dismissActive, isLoaded }}>
      {children}
    </ReminderContext.Provider>
  );
}

export const useReminders = () => {
  const context = useContext(ReminderContext);
  if (context === undefined) {
    throw new Error('useReminders must be used within a ReminderProvider');
  }
  return context;
};
