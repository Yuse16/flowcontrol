import { PriorityLevel } from './common';

export type ActivityType = 'recurrent' | 'variable';
export type RecurrencePattern = 'daily' | 'weekdays' | 'weekends' | 'custom';
export type ActivityModule = 'proveedores' | 'surtir' | 'urgentes' | 'vencidos' | 'general';

export interface Activity {
  id: string;
  title: string;
  type: ActivityType;
  module: ActivityModule;
  priority: PriorityLevel;
  category?: string;
  time?: string;
  
  // Para recurrentes
  recurrence?: RecurrencePattern;
  customDays?: number[]; // 0=Sunday, 1=Monday... 6=Saturday
  
  // Para variables
  createdAt: string; // ISO
  isCompleted: boolean; // Para variables es global
  
  // Para recurrentes: Historial de completado por fecha "YYYY-MM-DD"
  // Para variables: No se usa, se usa isCompleted
  completionHistory?: Record<string, boolean>; 
}
