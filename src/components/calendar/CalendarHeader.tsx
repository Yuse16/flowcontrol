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
          <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-uzala-purple">Calendario</p>
          <h2 className="text-xl font-bold text-white tracking-tight">
            {viewType === 'day'
              ? `${currentDate.getDate()} de ${monthNames[currentDate.getMonth()]}`
              : `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
          </h2>
        </div>

        <div className="flex items-center gap-0.5 bg-uzala-card border border-uzala-border p-1 rounded-2xl shadow-sm">
          <button onClick={onPrev} className="p-1.5 hover:bg-white/5 rounded-xl text-gray-400 hover:text-uzala-purple transition-all"><ChevronLeft size={16} /></button>
          <button onClick={onToday} className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider hover:bg-white/5 rounded-xl text-gray-400 hover:text-uzala-purple transition-all">Hoy</button>
          <button onClick={onNext} className="p-1.5 hover:bg-white/5 rounded-xl text-gray-400 hover:text-uzala-purple transition-all"><ChevronRight size={16} /></button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex bg-uzala-card border border-uzala-border p-1 rounded-2xl shadow-sm">
          {(['month', 'week', 'day'] as CalendarViewType[]).map((v) => (
            <button
              key={v}
              onClick={() => onViewChange(v)}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all ${viewType === v ? 'bg-uzala-purple text-white shadow-sm shadow-uzala-purple/20' : 'text-gray-400 hover:text-uzala-purple hover:bg-white/5'}`}
            >
              {v === 'month' ? 'Mes' : v === 'week' ? 'Sem' : 'Día'}
            </button>
          ))}
        </div>

        <button
          onClick={onAddTask}
          className="flex items-center gap-2 bg-uzala-purple text-white px-4 py-2 rounded-2xl text-[10px] font-bold uppercase tracking-wider transition-all shadow-sm shadow-uzala-purple/20 hover:scale-105"
        >
          <Plus size={14} strokeWidth={3} />
          <span>Tarea</span>
        </button>
      </div>
    </div>
  );
}
