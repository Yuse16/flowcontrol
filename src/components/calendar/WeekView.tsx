import { getWeekDays, isSameDay } from '@/utils/date';
import { Activity } from '@/types/activity';
import { TaskBadge } from './TaskBadge';

export function WeekView({ currentDate, activities, onDayClick, onTaskClick }: { currentDate: Date, activities: Activity[], onDayClick: (d: Date) => void, onTaskClick: (t: Activity) => void }) {
  const weekDays = getWeekDays(currentDate);
  const today = new Date();
  today.setHours(0,0,0,0);
  
  const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  return (
    <div className="flex-1 bg-uzala-card rounded-[32px] flex flex-col border border-uzala-border shadow-2xl overflow-hidden h-full max-h-[calc(100vh-16rem)] md:max-h-none" data-design-id="week-view-container">
      <div className="grid grid-cols-7 border-b border-uzala-border bg-[#0f1119]">
        {weekDays.map((date, i) => {
          const isToday = isSameDay(date, new Date());
          return (
            <div key={i} className="py-6 flex flex-col items-center gap-2 border-r border-uzala-border last:border-r-0">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{dayNames[i]}</span>
              <div className={`text-xl font-black w-10 h-10 flex items-center justify-center rounded-[14px] transition-all ${isToday ? 'bg-uzala-purple text-white shadow-xl shadow-uzala-purple/30 scale-110' : 'text-white'}`}>
                {date.getDate()}
              </div>
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-7 flex-1 min-h-[400px] md:min-h-[500px] overflow-y-auto">
        {weekDays.map((date, i) => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          const dateStr = `${year}-${month}-${day}`;
          
          const dayTasks = activities.filter(task => task.fechaProgramada === dateStr);

          return (
            <div 
              key={i} 
              onClick={() => onDayClick(date)}
              className="border-r border-uzala-border p-4 flex flex-col gap-3 hover:bg-white/5 cursor-pointer transition-all last:border-r-0 min-h-[120px]"
            >
              {dayTasks.length === 0 ? (
                <div className="flex-1 flex items-center justify-center opacity-20">
                   <div className="w-1 h-1 rounded-full bg-gray-400" />
                </div>
              ) : (
                <div className="space-y-2 overflow-y-auto max-h-44 custom-scrollbar">
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
