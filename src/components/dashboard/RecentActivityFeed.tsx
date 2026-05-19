import { TodoTask } from '@/types/todo';
import { CalendarTask } from '@/types/calendar';
import { CheckCircle2, PlusCircle, RotateCcw } from 'lucide-react';

interface RecentActivityFeedProps {
  todos: TodoTask[];
  calendarTasks: CalendarTask[];
}

export function RecentActivityFeed({ todos, calendarTasks }: RecentActivityFeedProps) {
  const combined = [
    ...todos.map(t => ({ ...t, type: 'todo' as const, isDone: t.status === 'completed' })),
    ...calendarTasks.map(t => ({ ...t, type: 'calendar' as const, isDone: t.completed }))
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 6);

  return (
    <div className="glass-card p-6 rounded-2xl border border-white/5 h-full relative overflow-hidden group">
      <div className="absolute -left-32 -bottom-32 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2 relative z-10">
        <RotateCcw size={18} className="text-primary" />
        Actividad Reciente
      </h2>
      
      <div className="space-y-5 relative z-10">
        {combined.length === 0 ? (
          <p className="text-sm text-gray-500">Aún no hay actividad en el sistema.</p>
        ) : (
          combined.map(item => (
            <div key={item.id} className="flex items-start gap-4 group/item">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 text-gray-400 group-hover/item:text-primary transition-all border border-white/5 group-hover/item:bg-primary/10">
                {item.isDone ? <CheckCircle2 size={16} /> : <PlusCircle size={16} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-300 truncate">
                  <span className="text-white font-medium">{item.isDone ? 'Completaste' : 'Añadiste'}</span> &ldquo;{item.title}&rdquo;
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                    {item.type === 'todo' ? 'Pendientes' : 'Calendario'}
                  </span>
                  <span className="text-[10px] text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
