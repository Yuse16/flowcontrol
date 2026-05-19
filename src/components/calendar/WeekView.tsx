import { getWeekDays, isSameDay } from '@/utils/date';
import { CalendarTask } from '@/types/calendar';
import { TaskBadge } from './TaskBadge';

export function WeekView({ currentDate, tasks, onDayClick, onTaskClick }: { currentDate: Date, tasks: CalendarTask[], onDayClick: (d: Date) => void, onTaskClick: (t: CalendarTask) => void }) {
  const weekDays = getWeekDays(currentDate);
  const today = new Date();
  today.setHours(0,0,0,0);
  
  const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  return (
    <div className="flex-1 bg-white dark:bg-[#171717] rounded-[32px] flex flex-col border border-border shadow-sm overflow-hidden" data-design-id="week-view-container">
      <div className="grid grid-cols-7 border-b border-border bg-gray-50/50 dark:bg-white/[0.02]">
        {weekDays.map((date, i) => {
          const isToday = isSameDay(date, new Date());
          return (
            <div key={i} className="py-6 flex flex-col items-center gap-2 border-r border-border last:border-r-0">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{dayNames[i]}</span>
              <div className={`text-xl font-black w-10 h-10 flex items-center justify-center rounded-[14px] transition-all ${isToday ? 'bg-primary text-white shadow-xl shadow-primary/30 scale-110' : 'text-[#111827] dark:text-white'}`}>
                {date.getDate()}
              </div>
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-7 flex-1 min-h-[500px]">
        {weekDays.map((date, i) => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          const dateStr = `${year}-${month}-${day}`;
          
          const dayTasks = tasks.filter(t => t.date === dateStr);

          return (
            <div 
              key={i} 
              onClick={() => onDayClick(date)}
              className="border-r border-[#f3f4f6] dark:border-[#1f1f1f] p-4 flex flex-col gap-3 hover:bg-gray-50/50 dark:hover:bg-white/[0.01] cursor-pointer transition-all last:border-r-0"
            >
              {dayTasks.length === 0 ? (
                <div className="flex-1 flex items-center justify-center opacity-10">
                   <div className="w-1 h-1 rounded-full bg-gray-400" />
                </div>
              ) : (
                <div className="space-y-2">
                  {dayTasks.map(t => (
                    <TaskBadge key={t.id} task={t} onClick={() => onTaskClick(t)} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
