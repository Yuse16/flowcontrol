import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Calendar as CalendarIcon, AlignLeft, CheckCircle2 } from 'lucide-react';
import { Activity, ActivityOrigin } from '@/types/activity';
import { PriorityLevel } from '@/types/common';
import { PrioritySelector } from '@/components/common/PrioritySelector';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Activity, 'id' | 'fechaCreacion' | 'estado' | 'fechaCompletado'>) => void;
  onDelete?: () => void;
  initialData?: Activity | null;
  headerTitle?: string;
  submitLabel?: string;
  defaultOrigin?: ActivityOrigin;
  defaultFechaProgramada?: string;
}

export function ActivityModal({ isOpen, onClose, onSave, onDelete, initialData, headerTitle, submitLabel, defaultOrigin, defaultFechaProgramada }: ActivityModalProps) {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaProgramada, setFechaProgramada] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('medium');

  useEffect(() => {
    if (!isOpen) return;
    if (initialData) {
      setTitulo(initialData.titulo || initialData.title || '');
      setDescripcion(initialData.descripcion || initialData.description || '');
      setFechaProgramada(initialData.fechaProgramada || '');
      setPriority(initialData.priority);
    } else {
      setTitulo('');
      setDescripcion('');
      setFechaProgramada(defaultFechaProgramada ?? '');
      setPriority('medium');
    }
  }, [initialData, isOpen, defaultFechaProgramada]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) return;

    onSave({
      titulo: titulo.trim(),
      descripcion: descripcion.trim() || undefined,
      title: titulo.trim(),
      description: descripcion.trim() || undefined,
      fechaProgramada: fechaProgramada || undefined,
      priority,
      origen: initialData?.origen || defaultOrigin || 'actividades',
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-lg glass border-white/10 rounded-[32px] shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <div>
                <h3 className="text-xl font-black text-white tracking-tight">
                  {headerTitle ?? (initialData ? 'Editar Actividad' : 'Nueva Actividad')}
                </h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-1">
                  Gestión Inteligente
                </p>
              </div>
              <button onClick={onClose} className="w-10 h-10 rounded-2xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              {/* TITLE */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-uzala-purple ml-1">
                  <CheckCircle2 size={12} /> Título
                </label>
                <input 
                  type="text" 
                  value={titulo}
                  onChange={e => setTitulo(e.target.value)}
                  className="w-full glass bg-white/5 border-white/10 rounded-2xl px-5 py-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-uzala-purple/30 transition-all"
                  placeholder="Ej. Revisar inventario de surtido"
                  autoFocus
                />
              </div>

              {/* DESCRIPTION */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-uzala-purple ml-1">
                  <AlignLeft size={12} /> Descripción
                </label>
                <textarea
                  value={descripcion}
                  onChange={e => setDescripcion(e.target.value)}
                  className="w-full glass bg-white/5 border-white/10 rounded-2xl px-5 py-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-uzala-purple/30 transition-all resize-none h-24"
                  placeholder="Detalles adicionales opcionales..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-uzala-purple ml-1">
                    <CalendarIcon size={12} /> Fecha
                  </label>
                  <input
                    type="date"
                    value={fechaProgramada}
                    onChange={e => setFechaProgramada(e.target.value)}
                    className="w-full glass bg-white/5 border-white/10 rounded-2xl px-5 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-uzala-purple/30 transition-all [color-scheme:dark]"
                  />
                </div>
                
                <PrioritySelector 
                  value={priority} 
                  onChange={setPriority} 
                />
              </div>

              <div className="pt-6 flex items-center justify-between border-t border-white/5">
                {initialData && onDelete ? (
                  <button 
                    type="button" 
                    onClick={() => { onDelete(); onClose(); }} 
                    className="w-12 h-12 flex items-center justify-center text-red-500 hover:bg-red-500/10 rounded-2xl transition-colors"
                    title="Eliminar actividad"
                  >
                    <Trash2 size={20} />
                  </button>
                ) : <div />}
                
                <div className="flex gap-3">
                  <button 
                    type="button" 
                    onClick={onClose} 
                    className="px-6 py-3 rounded-2xl text-sm font-bold text-gray-400 hover:text-white transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    disabled={!titulo.trim()} 
                    className="uzala-gradient text-white px-8 py-3 rounded-2xl text-sm font-black transition-all shadow-xl shadow-uzala-purple/20 disabled:opacity-30 disabled:shadow-none"
                  >
                    {submitLabel ?? (initialData ? 'Guardar Cambios' : 'Crear Actividad')}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
