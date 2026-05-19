import { CalendarTask } from '@/types/calendar';

export function getTaskColor(task: CalendarTask) {
  if (task.completed) return 'bg-green-500 text-white';

  const taskDate = new Date(task.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  taskDate.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - taskDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    // Pendiente (hoy o futuro)
    return 'bg-primary text-white shadow-lg shadow-primary/20';
  }

  // Atrasado: Más rojo conforme pasan los días
  if (diffDays === 1) return 'bg-orange-500 text-white';
  if (diffDays === 2) return 'bg-orange-600 text-white';
  if (diffDays === 3) return 'bg-red-500 text-white';
  if (diffDays >= 4) return 'bg-red-700 text-white animate-pulse shadow-lg shadow-red-500/40';

  return 'bg-gray-500 text-white';
}
