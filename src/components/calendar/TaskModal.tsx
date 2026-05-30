import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarTask } from '@/types/calendar';
import { PriorityLevel } from '@/types/common';
import { formatDateString } from '@/utils/date';
import { X, Trash2 } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, priority: PriorityLevel, description: string) => void;
  onDelete?: () => void;
  onMove?: (newDate: string) => void;
  onToggleStatus?: () => void;
  initialData?: CalendarTask | null;
  selectedDate: Date;
}

export function TaskModal({ isOpen, onClose, onSave, onDelete, onMove, onToggleStatus, initialData, selectedDate }: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [moveDate, setMoveDate] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setShowDatePicker(false);
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || '');
      setPriority(initialData.priority);
      setMoveDate(initialData.date);
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setMoveDate(formatDateString(selectedDate));
    }
  }, [initialData, isOpen, selectedDate]);

  const handleMoveTomorrow = () => {
    if (!onMove) return;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    onMove(formatDateString(tomorrow));
    onClose();
  };

  const handleMoveCustom = () => {
    if (!onMove || !moveDate) return;
    onMove(moveDate);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave(title.trim(), priority, description);
    onClose();
  };

  const priorityOptions: { value: PriorityLevel, label: string, color: string }[] = [
    { value: 'low', label: 'Baja', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
    { value: 'medium', label: 'Media', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    { value: 'high', label: 'Alta', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
    { value: 'urgent', label: 'Urgente', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-xl font-semibold text-foreground">
                {initialData ? 'Editar Tarea' : 'Nueva Tarea'}
              </h3>
              <button type="button" onClick={onClose} className="text-gray-500 hover:text-foreground transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {initialData && (
                <div className="flex gap-2">
                  <button 
                    type="button" 
                    onClick={onToggleStatus}
                    className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                      initialData.completed 
                        ? 'bg-green-500/20 text-green-500 border border-green-500/30' 
                        : 'bg-gray-500/10 text-gray-500 border border-gray-500/20 hover:bg-green-500/20 hover:text-green-500 hover:border-green-500/30'
                    }`}
                  >
                    {initialData.completed ? '✓ COMPLETADA' : 'MARCAR COMO LISTO'}
                  </button>
                  
                  <button 
                    type="button"
                    onClick={handleMoveTomorrow}
                    className="flex-1 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
                  >
                    +1 DÍA (MAÑANA)
                  </button>
                </div>
              )}

              {initialData && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Mover a otra fecha</label>
                    <button 
                      type="button" 
                      onClick={() => setShowDatePicker(!showDatePicker)}
                      className="text-[10px] text-primary font-bold hover:underline"
                    >
                      {showDatePicker ? 'Cerrar' : 'Cambiar'}
                    </button>
                  </div>
                  {showDatePicker && (
                    <div className="flex gap-2">
                      <input 
                        type="date" 
                        value={moveDate}
                        onChange={(e) => setMoveDate(e.target.value)}
                        className="flex-1 bg-background/50 border border-border rounded-xl px-4 py-2 text-foreground text-sm focus:outline-none focus:border-primary transition-all"
                      />
                      <button 
                        type="button"
                        onClick={handleMoveCustom}
                        className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold transition-all"
                      >
                        MOVER
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Título</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-background/50 border border-border rounded-xl px-4 py-2.5 text-foreground placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="Ej. Revisar diseño de dashboard"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Descripción</label>
                <textarea 
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-background/50 border border-border rounded-xl px-4 py-2.5 text-foreground placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none h-24"
                  placeholder="Detalles adicionales..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Prioridad</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {priorityOptions.map(p => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setPriority(p.value)}
                      className={`py-2 px-1 text-xs font-semibold rounded-lg border transition-all ${priority === p.value ? p.color + ' ring-1 ring-current' : 'border-border text-gray-500 hover:bg-white/5'}`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                {initialData && onDelete ? (
                  <button type="button" onClick={() => { onDelete(); onClose(); }} className="text-red-500 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-colors">
                    <Trash2 size={20} />
                  </button>
                ) : <div></div>}
                <div className="flex gap-3">
                  <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-medium text-gray-500 hover:bg-white/5 transition-colors">
                    Cancelar
                  </button>
                  <button type="submit" disabled={!title.trim()} className="bg-primary hover:bg-primary-dark text-always-white px-5 py-2 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed">
                    Guardar
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
