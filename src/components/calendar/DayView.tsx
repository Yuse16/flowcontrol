import { Activity } from '@/types/activity';
import { formatDateString } from '@/utils/date';
import { CheckCircle2, Circle, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DayViewProps {
  currentDate: Date;
  activities: Activity[];
  onToggleComplete: (id: string) => void;
}

export function DayView({ currentDate, activities, onToggleComplete }: DayViewProps) {
  const dateStr = formatDateString(currentDate);
  const today = new Date();
  today.setHours(0,0,0,0);
  const queryDate = new Date(currentDate);
  queryDate.setHours(0,0,0,0);

  const completedCount = activities.filter(act => act.estado === 'completado').length;
  const totalCount = activities.length;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const renderActivity = (act: Activity) => {
    const completed = act.estado === 'completado';
    const dueDate = act.fechaProgramada ? new Date(act.fechaProgramada) : null;
    const isOverdue = dueDate ? dueDate < today && !completed : false;

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
          onClick={() => onToggleComplete(act.id)}
          className={`mt-0.5 flex-shrink-0 transition-all active:scale-90 ${completed ? 'text-primary' : 'text-gray-400 hover:text-primary'}`}
        >
          {completed ? <CheckCircle2 size={24} className="fill-primary/20" /> : <Circle size={24} />}
        </button>
        <div className="flex-1 min-w-0">
          <h4 className={`text-base font-medium truncate transition-all ${completed ? 'line-through text-gray-500' : 'text-foreground'}`}>
            {act.titulo || act.title}
          </h4>
          <p className="text-xs text-gray-500 mt-1">{act.descripcion || act.description || 'Sin descripción'}</p>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {act.fechaProgramada && (
              <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-gray-500 bg-background border border-border px-2 py-1 rounded-full">
                {act.fechaProgramada}
              </span>
            )}
            <span className={`text-[10px] uppercase tracking-[0.2em] font-semibold px-2 py-1 rounded-full ${completed ? 'bg-green-500/10 text-green-400 border border-green-500/20' : isOverdue ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-uzala-purple/10 text-uzala-purple border border-uzala-purple/20'}`}>
              {act.estado.replace('_', ' ')}
            </span>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex-1 bg-white dark:bg-[#171717] rounded-[32px] border border-border shadow-sm overflow-hidden flex flex-col relative" data-design-id="day-view-container">
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
            transition={{ duration: 0.8, ease: 'circOut' }}
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-8 pb-24 md:pb-8 safe-bottom">
        {totalCount === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 py-20">
            <div className="w-20 h-20 mb-6 rounded-[24px] bg-gray-50 dark:bg-white/5 flex items-center justify-center shadow-inner">
              <Layers size={32} className="opacity-20" />
            </div>
            <p className="text-xl font-black text-[#111827] dark:text-white tracking-tight uppercase tracking-widest">Día Libre</p>
            <p className="text-sm text-center max-w-xs mt-3 text-gray-400 font-medium">No hay actividades programadas para este día. Agrega una nueva actividad desde el calendario o desde Actividades.</p>
          </div>
        ) : (
          <div className="space-y-6 max-w-4xl mx-auto">
            <AnimatePresence mode="popLayout">
              {activities.map(renderActivity)}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
