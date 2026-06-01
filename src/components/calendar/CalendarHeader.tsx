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
    <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4" data-design-id="calendar-header">
      <div className="flex items-center gap-6">
        <div className="space-y-0.5">
          <p className="text-[9px] font-black uppercase tracking-[0.25em] text-uzala-purple ml-0.5">Cronograma</p>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {viewType === 'day'
              ? `${currentDate.getDate()} de ${monthNames[currentDate.getMonth()]}`
              : `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
          </h2>
        </div>

        <div className="flex items-center gap-0.5 glass border-white/10 p-1 rounded-2xl shadow-xl shadow-black/20">
          <button onClick={onPrev} className="p-2 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all active:scale-90"><ChevronLeft size={18} /></button>
          <button onClick={onToday} className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.15em] hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all active:scale-95">Hoy</button>
          <button onClick={onNext} className="p-2 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all active:scale-90"><ChevronRight size={18} /></button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex glass border-white/10 p-1 rounded-2xl shadow-xl shadow-black/20">
          {(['month', 'week', 'day'] as CalendarViewType[]).map((v) => (
            <button
              key={v}
              onClick={() => onViewChange(v)}
              className={`px-4 py-2 text-[10px] font-black uppercase tracking-[0.15em] rounded-xl transition-all ${viewType === v ? 'bg-uzala-purple text-white shadow-lg shadow-uzala-purple/30' : 'text-gray-500 hover:text-white hover:bg-white/10'}`}
            >
              {v === 'month' ? 'Mes' : v === 'week' ? 'Sem' : 'Día'}
            </button>
          ))}
        </div>

        <button
          onClick={onAddTask}
          className="flex items-center gap-2 uzala-gradient text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] transition-all shadow-xl shadow-uzala-purple/25 hover:scale-105 active:scale-95"
        >
          <Plus size={16} strokeWidth={3} />
          <span>Tarea</span>
        </button>
      </div>
    </div>
  );
}
