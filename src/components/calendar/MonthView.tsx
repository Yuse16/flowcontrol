import { useState } from 'react';
import { generateCalendarGrid, isSameDay } from '@/utils/date';
import { CalendarTask } from '@/types/calendar';
import { TaskBadge } from './TaskBadge';

export function MonthView({ currentDate, tasks, onDayClick, onTaskClick, onMoveTask }: { currentDate: Date, tasks: CalendarTask[], onDayClick: (d: Date) => void, onTaskClick: (t: CalendarTask) => void, onMoveTask: (id: string, date: string) => void }) {
  const grid = generateCalendarGrid(currentDate.getFullYear(), currentDate.getMonth());
  const today = new Date();
  today.setHours(0,0,0,0);
  
  const [dragOverDate, setDragOverDate] = useState<string | null>(null);
  const daysOfWeek = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  const handleDragOver = (e: React.DragEvent, dateStr: string) => {
    e.preventDefault();
    setDragOverDate(dateStr);
  };

  const handleDrop = (e: React.DragEvent, dateStr: string) => {
    e.preventDefault();
    setDragOverDate(null);
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      onMoveTask(taskId, dateStr);
    }
  };

  return (
    <div className="flex-1 bg-white dark:bg-[#171717] rounded-2xl flex flex-col border border-gray-100 dark:border-[#1f1f1f] shadow-sm overflow-hidden" data-design-id="month-view-container">
      {/* Days of Week Header - Smaller */}
      <div className="grid grid-cols-7 border-b border-gray-50 dark:border-[#1f1f1f] bg-gray-50/30 dark:bg-white/[0.01]">
        {daysOfWeek.map(d => (
          <div key={d} className="py-2.5 text-center text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400">{d}</div>
        ))}
      </div>

      {/* Calendar Grid - More Compact */}
      <div className="grid grid-cols-7 flex-1 min-h-[500px]">
        {grid.map((date, i) => {
          const isCurrentMonth = date.getMonth() === currentDate.getMonth();
          const isToday = isSameDay(date, new Date());
          
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          const dateStr = `${year}-${month}-${day}`;
          
          const dayTasks = tasks.filter(t => t.date === dateStr);
          const isDraggingOver = dragOverDate === dateStr;

          return (
            <div 
              key={i} 
              onClick={() => onDayClick(date)}
              onDragOver={(e) => handleDragOver(e, dateStr)}
              onDragLeave={() => setDragOverDate(null)}
              onDrop={(e) => handleDrop(e, dateStr)}
              className={`
                relative border-r border-b border-gray-50 dark:border-[#1f1f1f] p-2 flex flex-col gap-1 
                transition-all hover:bg-gray-50/50 dark:hover:bg-white/[0.01] cursor-pointer min-h-[100px]
                ${!isCurrentMonth ? 'bg-gray-50/20 dark:bg-black/10' : ''} 
                ${isDraggingOver ? 'bg-primary/5 ring-2 ring-inset ring-primary/10' : ''}
              `}
              data-design-id={`calendar-day-${dateStr}`}
            >
              <div className="flex justify-between items-start">
                <span className={`
                  text-[11px] font-bold w-6 h-6 flex items-center justify-center rounded-lg transition-all
                  ${isToday ? 'bg-primary text-white shadow-sm shadow-primary/30' : isCurrentMonth ? 'text-gray-700 dark:text-white' : 'text-gray-300'}
                `}>
                  {date.getDate()}
                </span>
                {dayTasks.length > 0 && !isToday && (
                  <div className="w-1 h-1 rounded-full bg-primary/30 mt-2.5" />
                )}
              </div>

              <div className="flex-1 overflow-y-auto space-y-1 pr-0.5 custom-scrollbar">
                {dayTasks.map(t => (
                  <TaskBadge key={t.id} task={t} onClick={() => onTaskClick(t)} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
