import { CalendarTask } from '@/types/calendar';
import { getTaskColor } from '@/utils/calendarUtils';

export function TaskBadge({ task, onClick }: { task: CalendarTask, onClick: () => void }) {
  const colorClass = getTaskColor(task);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('taskId', task.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div 
      draggable
      onDragStart={handleDragStart}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={`text-[10px] sm:text-xs px-2 py-1 rounded-md cursor-pointer truncate transition-all hover:scale-[1.02] active:scale-95 font-medium select-none ${colorClass}`}
      title={task.title}
    >
      {task.title}
    </div>
  );
}
