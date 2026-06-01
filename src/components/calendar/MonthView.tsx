import { useState } from 'react';
import { generateCalendarGrid, isSameDay } from '@/utils/date';
import { Activity } from '@/types/activity';
import { TaskBadge } from './TaskBadge';

export function MonthView({ currentDate, activities, onDayClick, onTaskClick, onMoveTask }: { currentDate: Date, activities: Activity[], onDayClick: (d: Date) => void, onTaskClick: (t: Activity) => void, onMoveTask: (id: string, date: string) => void }) {
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
    <div className="flex-1 bg-uzala-card rounded-[32px] flex flex-col border border-uzala-border shadow-2xl overflow-hidden h-full max-h-[calc(100vh-16rem)] md:max-h-none" data-design-id="month-view-container">
      <div className="grid grid-cols-7 border-b border-uzala-border bg-[#0f1119]">
        {daysOfWeek.map(d => (
          <div key={d} className="py-2.5 text-center text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 flex-1 min-h-[400px] md:min-h-[500px] overflow-y-auto">
        {grid.map((date, i) => {
          const isCurrentMonth = date.getMonth() === currentDate.getMonth();
          const isToday = isSameDay(date, new Date());
          
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          const dateStr = `${year}-${month}-${day}`;
          
          const dayTasks = activities.filter(t => t.fechaProgramada === dateStr);
          const isDraggingOver = dragOverDate === dateStr;

          return (
            <div 
              key={i} 
              onClick={() => onDayClick(date)}
              onDragOver={(e) => handleDragOver(e, dateStr)}
              onDragLeave={() => setDragOverDate(null)}
              onDrop={(e) => handleDrop(e, dateStr)}
              className={`
                relative border-r border-b border-uzala-border p-2 flex flex-col gap-1 
                transition-all hover:bg-white/5 cursor-pointer min-h-[70px] md:min-h-[100px]
                ${!isCurrentMonth ? 'bg-white/5' : ''} 
                ${isDraggingOver ? 'bg-uzala-purple/10 ring-2 ring-inset ring-uzala-purple/20' : ''}
              `}
              data-design-id={`calendar-day-${dateStr}`}
            >
              <div className="flex justify-between items-start">
                <span className={`
                  text-[11px] font-bold w-6 h-6 flex items-center justify-center rounded-lg transition-all
                  ${isToday ? 'bg-uzala-purple text-white shadow-sm shadow-uzala-purple/30' : isCurrentMonth ? 'text-white' : 'text-gray-400'}
                `}>
                  {date.getDate()}
                </span>
                {dayTasks.length > 0 && !isToday && (
                  <div className="w-1 h-1 rounded-full bg-uzala-purple/30 mt-2.5" />
                )}
              </div>

              <div className="flex-1 overflow-y-auto max-h-28 space-y-1 pr-0.5 custom-scrollbar">
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
