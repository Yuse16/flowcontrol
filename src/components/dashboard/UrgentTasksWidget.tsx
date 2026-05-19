import { TodoTask } from '@/types/todo';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export function UrgentTasksWidget({ tasks }: { tasks: TodoTask[] }) {
  const urgentTasks = tasks.filter(t => t.status !== 'completed' && (t.priority === 'urgent' || t.status === 'delayed')).slice(0, 4);

  return (
    <div className="bg-white dark:bg-[#171717] p-5 rounded-2xl border border-gray-100 dark:border-[#1f1f1f] h-[300px] flex flex-col relative overflow-hidden group shadow-sm" data-design-id="urgent-widget-minimal">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
          <AlertCircle size={14} className="text-red-400" />
          Urgente
        </h2>
        <Link href="/todos" className="text-[10px] text-[#6366f1] font-bold hover:underline">Ver todo</Link>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
        {urgentTasks.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <CheckCircle2 size={24} className="text-green-400 mb-2 opacity-50" />
            <p className="text-[11px] font-bold text-gray-300 uppercase tracking-widest">Al día</p>
          </div>
        ) : (
          urgentTasks.map(task => (
            <div key={task.id} className="p-3 rounded-xl bg-red-50/50 dark:bg-red-500/5 border border-red-100/50 dark:border-red-500/10 hover:border-red-200 transition-all">
              <h4 className="text-[12px] font-bold text-[#111827] dark:text-white line-clamp-1">{task.title}</h4>
              <p className="text-[9px] text-red-400 font-bold uppercase tracking-wider mt-0.5">{task.status === 'delayed' ? 'Retrasada' : 'Urgente'}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
