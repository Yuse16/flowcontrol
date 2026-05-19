import { PriorityLevel } from './common';

export type TodoStatus = 'pending' | 'in_progress' | 'completed' | 'delayed';

export interface TodoCategory {
  id: string;
  name: string;
  color: string;
}

export interface TodoTask {
  id: string;
  title: string;
  description?: string;
  status: TodoStatus;
  priority: PriorityLevel;
  categoryIds: string[];
  isFavorite: boolean;
  dueDate?: string; // YYYY-MM-DD
  createdAt: string;
  assigneeId?: string; // ID del usuario asignado
}
