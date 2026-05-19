import { PriorityLevel } from './common';

export type CalendarViewType = 'month' | 'week' | 'day';

export interface CalendarTask {
  id: string;
  title: string;
  description?: string;
  date: string; // ISO string YYYY-MM-DD
  priority: PriorityLevel;
  completed: boolean;
  createdAt: string;
}
