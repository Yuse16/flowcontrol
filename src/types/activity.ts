import { PriorityLevel } from './common';

export type ActivityType = 'recurrent' | 'variable';
export type RecurrencePattern = 'daily' | 'weekdays' | 'weekends' | 'custom';
export type ActivityModule = 'proveedores' | 'surtir' | 'urgentes' | 'vencidos' | 'general';
export type ActivityStatus = 'pendiente' | 'en_proceso' | 'completado' | 'vencido';
export type ActivityOrigin = 'actividades' | 'calendario' | 'nota' | 'surtir' | 'proveedor';

export interface Activity {
  id: string;
  titulo: string;
  descripcion?: string;
  fechaProgramada?: string; // YYYY-MM-DD
  priority: PriorityLevel;
  estado: ActivityStatus;
  fechaCreacion: string; // ISO
  fechaCompletado?: string; // ISO
  origen: ActivityOrigin;

  // Compatibility aliases for legacy rendering
  title?: string;
  description?: string;

  // Legacy / compatibility fields
  type?: ActivityType;
  module?: ActivityModule;
  recurrence?: RecurrencePattern;
  customDays?: number[]; // 0=Sunday, 1=Monday... 6=Saturday
}
