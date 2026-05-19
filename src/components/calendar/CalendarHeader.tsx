import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { CalendarViewType } from '@/types/calendar';

interface CalendarHeaderProps {
  currentDate: Date;
  viewType: CalendarViewType;
  onViewChange: (view: CalendarViewType) => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onAddTask: () => void;
}

export function CalendarHeader({ currentDate, viewType, onViewChange, onPrev, onNext, onToday, onAddTask }: CalendarHeaderProps) {
  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4" data-design-id="calendar-header">
      <div className="flex items-center gap-4">
        <div className="space-y-0.5">
          <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-primary">Calendario</p>
          <h2 className="text-xl font-bold text-[#111827] dark:text-white tracking-tight">
            {viewType === 'day' 
              ? `${currentDate.getDate()} de ${monthNames[currentDate.getMonth()]}` 
              : `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
          </h2>
        </div>
        
        {/* Navigation Controls - Smaller */}
        <div className="flex items-center gap-0.5 bg-white dark:bg-[#171717] border border-gray-100 dark:border-[#262626] p-1 rounded-xl shadow-sm">
          <button onClick={onPrev} className="p-1.5 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg text-gray-400 hover:text-primary transition-all"><ChevronLeft size={16} /></button>
          <button onClick={onToday} className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg text-gray-400 hover:text-primary transition-all">Hoy</button>
          <button onClick={onNext} className="p-1.5 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg text-gray-400 hover:text-primary transition-all"><ChevronRight size={16} /></button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* View Switcher - Smaller */}
        <div className="flex bg-white dark:bg-[#171717] border border-gray-100 dark:border-[#262626] p-1 rounded-xl shadow-sm">
          {(['month', 'week', 'day'] as CalendarViewType[]).map((v) => (
            <button
              key={v}
              onClick={() => onViewChange(v)}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${viewType === v ? 'bg-primary text-white shadow-sm shadow-primary/20' : 'text-gray-300 hover:text-primary hover:bg-gray-50'}`}
            >
              {v === 'month' ? 'Mes' : v === 'week' ? 'Sem' : 'Día'}
            </button>
          ))}
        </div>
        
        <button 
          onClick={onAddTask}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all shadow-sm shadow-primary/20 hover:scale-105"
        >
          <Plus size={14} strokeWidth={3} />
          <span>Tarea</span>
        </button>
      </div>
    </div>
  );
}
