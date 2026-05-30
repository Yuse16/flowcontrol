import { Activity } from '@/types/activity';
import { CalendarTask } from '@/types/calendar';
import { formatDateString } from '@/utils/date';
import { CheckCircle2, Circle, AlertCircle, RefreshCw, Layers, CalendarDays } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DayViewProps {
  currentDate: Date;
  activities: Activity[];
  calendarTasks?: CalendarTask[];
  onToggleComplete: (id: string, dateStr: string) => void;
  onToggleCalendarTask?: (id: string) => void;
  onCalendarTaskClick?: (task: CalendarTask) => void;
}

export function DayView({ currentDate, activities, calendarTasks = [], onToggleComplete, onToggleCalendarTask, onCalendarTaskClick }: DayViewProps) {
  const dateStr = formatDateString(currentDate);
  const today = new Date();
  today.setHours(0,0,0,0);
  const queryDate = new Date(currentDate);
  queryDate.setHours(0,0,0,0);
  const isPast = queryDate < today;

  const isCompleted = (act: Activity) => {
    if (act.type === 'variable') return act.isCompleted;
    return !!(act.completionHistory && act.completionHistory[dateStr]);
  };

  const completedCount = activities.filter(isCompleted).length + calendarTasks.filter(t => t.completed).length;
  const totalCount = activities.length + calendarTasks.length;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const recurrentActs = activities.filter(a => a.type === 'recurrent');
  const variableActs = activities.filter(a => a.type === 'variable');

  const renderActivity = (act: Activity) => {
    const completed = isCompleted(act);
    const createdDate = new Date(act.createdAt || '');
    createdDate.setHours(0,0,0,0);
    // Vencida: Es variable, se creó antes de hoy, miramos hoy, y no está completada
    const isOverdue = act.type === 'variable' && !completed && queryDate.getTime() === today.getTime() && createdDate < today;

    const moduleColors: Record<string, string> = {
      proveedores: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      surtir: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
      urgentes: 'text-red-400 bg-red-500/10 border-red-500/20',
      vencidos: 'text-red-500 bg-red-500/10 border-red-500/20',
      general: 'text-gray-400 bg-gray-500/10 border-gray-500/20',
    };

    return (
      <motion.div 
        key={act.id} 
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`group flex items-start gap-4 p-4 rounded-xl border transition-all hover:-translate-y-0.5 hover:shadow-lg ${
          completed 
            ? 'bg-background border-border opacity-60' 
            : isOverdue 
              ? 'bg-red-500/5 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.1)]' 
              : 'bg-card border-border hover:border-primary/50'
        }`}
      >
        <button 
          onClick={() => onToggleComplete(act.id, dateStr)}
          className={`mt-0.5 flex-shrink-0 transition-all active:scale-90 ${completed ? 'text-primary' : 'text-gray-400 hover:text-primary'}`}
        >
          {completed ? <CheckCircle2 size={24} className="fill-primary/20" /> : <Circle size={24} />}
        </button>
        <div className="flex-1 min-w-0">
          <h4 className={`text-base font-medium truncate transition-all ${completed ? 'line-through text-gray-500' : 'text-foreground'}`}>
            {act.title}
          </h4>
          
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${moduleColors[act.module] || moduleColors.general}`}>
              {act.module}
            </span>
            
            {act.type === 'recurrent' && (
              <span className="flex items-center gap-1 text-[10px] text-gray-500 bg-background border border-border px-2 py-0.5 rounded">
                <RefreshCw size={10} /> Recurrente
              </span>
            )}
            
            {isOverdue && (
              <span className="flex items-center gap-1 text-[10px] text-white bg-red-500 px-2 py-0.5 rounded font-bold shadow-[0_0_8px_rgba(239,68,68,0.5)] animate-pulse">
                <AlertCircle size={10} /> Vencida
              </span>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex-1 bg-white dark:bg-[#171717] rounded-[32px] border border-border shadow-sm overflow-hidden flex flex-col relative" data-design-id="day-view-container">
      
      {/* Premium Progress Header */}
      <div className="p-8 border-b border-border bg-gray-50/30 dark:bg-white/[0.01] z-10">
        <div className="flex justify-between items-end mb-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-1">Resumen del Día</p>
            <h2 className="text-3xl font-black text-[#111827] dark:text-white tracking-tighter">Actividades</h2>
            <p className="text-sm text-gray-500 font-medium mt-1">{completedCount} de {totalCount} completadas</p>
          </div>
          <div className="text-5xl font-black text-primary tracking-tighter">
            {progress}%
          </div>
        </div>
        <div className="w-full h-3 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden relative border border-white/10 shadow-inner">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"
          />
        </div>
      </div>

      {/* Lists */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
        {totalCount === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 py-20">
            <div className="w-20 h-20 mb-6 rounded-[24px] bg-gray-50 dark:bg-white/5 flex items-center justify-center shadow-inner">
              <Layers size={32} className="opacity-20" />
            </div>
            <p className="text-xl font-black text-[#111827] dark:text-white tracking-tight uppercase tracking-widest">Día Libre</p>
            <p className="text-sm text-center max-w-xs mt-3 text-gray-400 font-medium">No hay rutinas ni pendientes para este día. Disfruta tu tiempo o agrega nuevas actividades.</p>
          </div>
        ) : (
          <div className="space-y-12 max-w-4xl mx-auto">

            {calendarTasks.length > 0 && (
              <section>
                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]" /> Tareas del calendario
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {calendarTasks.map(task => (
                    <motion.div
                      key={task.id}
                      layout
                      className={`group flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                        task.completed ? 'bg-background border-border opacity-60' : 'bg-card border-border hover:border-primary/50'
                      }`}
                      onClick={() => onCalendarTaskClick?.(task)}
                    >
                      <button
                        onClick={(e) => { e.stopPropagation(); onToggleCalendarTask?.(task.id); }}
                        className={`mt-0.5 flex-shrink-0 ${task.completed ? 'text-primary' : 'text-gray-400 hover:text-primary'}`}
                      >
                        {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <h4 className={`text-base font-medium truncate ${task.completed ? 'line-through text-gray-500' : 'text-foreground'}`}>
                          {task.title}
                        </h4>
                        <span className="inline-flex items-center gap-1 text-[10px] text-gray-500 mt-2">
                          <CalendarDays size={10} /> Calendario
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}
            
            {/* Variables */}
            {variableActs.length > 0 && (
              <section>
                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]" /> Pendientes Críticos
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <AnimatePresence>
                    {variableActs.map(renderActivity)}
                  </AnimatePresence>
                </div>
              </section>
            )}

            {/* Recurrentes */}
            {recurrentActs.length > 0 && (
              <section>
                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(99,102,241,0.4)]" /> Rutinas Diarias
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <AnimatePresence>
                    {recurrentActs.map(renderActivity)}
                  </AnimatePresence>
                </div>
              </section>
            )}
            
          </div>
        )}
      </div>
    </div>
  );
}
