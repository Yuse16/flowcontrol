import { Activity } from '@/types/activity';

export function getTaskColor(task: Activity) {
  if (task.estado === 'completado') return 'bg-green-500 text-white shadow-lg shadow-green-500/20';
  if (task.estado === 'vencido') return 'bg-red-500 text-white shadow-lg shadow-red-500/20';
  if (task.estado === 'pendiente') return 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/20';
  if (task.estado === 'en_proceso') return 'bg-uzala-purple text-white shadow-lg shadow-uzala-purple/20';

  if (!task.fechaProgramada) {
    return 'bg-primary text-white shadow-lg shadow-primary/20';
  }

  const taskDate = new Date(task.fechaProgramada);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  taskDate.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - taskDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    return 'bg-primary text-white shadow-lg shadow-primary/20';
  }

  if (diffDays === 1) return 'bg-orange-500 text-white';
  if (diffDays === 2) return 'bg-orange-600 text-white';
  if (diffDays === 3) return 'bg-red-500 text-white';
  if (diffDays >= 4) return 'bg-red-700 text-white animate-pulse shadow-lg shadow-red-500/40';

  return 'bg-gray-500 text-white';
}
