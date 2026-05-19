import { CalendarTask } from '@/types/calendar';
import { formatDateString } from '@/utils/date';
import { Calendar, Clock } from 'lucide-react';
import Link from 'next/link';

export function TodayActivitiesWidget({ tasks }: { tasks: CalendarTask[] }) {
  const todayStr = formatDateString(new Date());
  const todayTasks = tasks.filter(t => t.date === todayStr).slice(0, 5);

  return (
    <div className="bg-white dark:bg-[#171717] p-5 rounded-2xl border border-gray-100 dark:border-[#1f1f1f] h-[300px] flex flex-col relative overflow-hidden shadow-sm" data-design-id="today-widget-minimal">
      <div className="flex justify-between items-center mb-4 relative z-10">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
          <Calendar size={14} className="text-[#6366f1]" />
          Agenda
        </h2>
        <Link href="/calendar" className="text-[10px] text-[#6366f1] font-bold hover:underline">Calendario</Link>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
        {todayTasks.length === 0 ? (
          <div className="h-full flex items-center justify-center text-[11px] text-gray-300 font-bold uppercase tracking-widest">
            Sin eventos
          </div>
        ) : (
          <div className="space-y-4 pt-2 relative">
            <div className="absolute left-1.5 top-2 bottom-0 w-px bg-gray-100 dark:bg-white/5" />
            {todayTasks.map(task => (
              <div key={task.id} className="relative pl-6 group">
                <div className={`absolute left-0 top-1.5 w-3 h-3 rounded-full border-2 border-white dark:border-[#171717] transition-all ${task.completed ? 'bg-gray-200' : 'bg-[#6366f1]'}`} />
                <h4 className={`text-[12px] font-bold transition-colors ${task.completed ? 'text-gray-300 line-through' : 'text-[#111827] dark:text-white'}`}>{task.title}</h4>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
