import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity } from '@/types/activity';
import { PriorityLevel } from '@/types/common';
import { formatDateString } from '@/utils/date';
import { X, Trash2 } from 'lucide-react';
import { PrioritySelector } from '@/components/common/PrioritySelector';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, priority: PriorityLevel, description: string) => void;
  onDelete?: () => void;
  onMove?: (newDate: string) => void;
  onToggleStatus?: () => void;
  initialData?: Activity | null;
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
      setTitle(initialData.titulo || initialData.title || '');
      setDescription(initialData.descripcion || initialData.description || '');
      setPriority(initialData.priority);
      setMoveDate(initialData.fechaProgramada || formatDateString(selectedDate));
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
                      initialData.estado === 'completado'
                        ? 'bg-green-500/20 text-green-500 border border-green-500/30' 
                        : 'bg-gray-500/10 text-gray-500 border border-gray-500/20 hover:bg-green-500/20 hover:text-green-500 hover:border-green-500/30'
                    }`}
                  >
                    {initialData.estado === 'completado' ? '✓ COMPLETADA' : 'MARCAR COMO LISTO'}
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

              <PrioritySelector value={priority} onChange={setPriority} label="Prioridad de Tarea" />

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
