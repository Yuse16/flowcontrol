import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, AlertTriangle } from 'lucide-react';
import { Activity, ActivityOrigin } from '@/types/activity';
import { PriorityLevel } from '@/types/common';

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

  if (!isOpen) return null;

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-lg bg-white dark:bg-[#171717] border border-[#f3f4f6] dark:border-[#262626] rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-[#f3f4f6] dark:border-[#262626]">
              <div>
                <h3 className="text-xl font-bold text-[#111827] dark:text-white">
                  {headerTitle ?? (initialData ? 'Editar Actividad' : 'Nueva Actividad')}
                </h3>
                <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mt-0.5">
                  Configura tu tarea o rutina
                </p>
              </div>
              <button onClick={onClose} className="p-2 text-gray-400 hover:text-[#111827] dark:hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* TITLE */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">Nombre de la actividad</label>
                <input 
                  type="text" 
                  value={titulo}
                  onChange={e => setTitulo(e.target.value)}
                  className="w-full bg-[#f9fafb] dark:bg-[#0a0a0a] border border-[#f3f4f6] dark:border-[#262626] rounded-xl px-4 py-3 text-sm text-[#111827] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/10 focus:border-[#8B5CF6] transition-all"
                  placeholder="Ej. Revisar inventario de surtido"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">Descripción</label>
                <textarea
                  value={descripcion}
                  onChange={e => setDescripcion(e.target.value)}
                  className="w-full bg-[#f9fafb] dark:bg-[#0a0a0a] border border-[#f3f4f6] dark:border-[#262626] rounded-xl px-4 py-3 text-sm text-[#111827] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/10 focus:border-[#8B5CF6] transition-all resize-none h-28"
                  placeholder="Detalles adicionales"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">Fecha programada</label>
                  <input
                    type="date"
                    value={fechaProgramada}
                    onChange={e => setFechaProgramada(e.target.value)}
                    className="w-full bg-[#f9fafb] dark:bg-[#0a0a0a] border border-[#f3f4f6] dark:border-[#262626] rounded-xl px-4 py-3 text-sm text-[#111827] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/10 focus:border-[#8B5CF6] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-1.5">
                    <AlertTriangle size={12} /> Prioridad
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['low', 'medium', 'high', 'urgent'] as PriorityLevel[]).map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={`py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg border transition-all ${
                          priority === p 
                          ? 'bg-[#8B5CF6] border-[#8B5CF6] text-white' 
                          : 'bg-white dark:bg-[#171717] border-[#f3f4f6] dark:border-[#262626] text-gray-400 hover:border-gray-300'
                        }`}
                      >
                        {p === 'low' ? 'Baja' : p === 'medium' ? 'Media' : p === 'high' ? 'Alta' : 'Crítica'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 flex items-center justify-between border-t border-[#f3f4f6] dark:border-[#262626]">
                {initialData && onDelete ? (
                  <button 
                    type="button" 
                    onClick={() => { onDelete(); onClose(); }} 
                    className="p-2.5 text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
                    title="Eliminar actividad"
                  >
                    <Trash2 size={20} />
                  </button>
                ) : <div></div>}
                <div className="flex gap-3">
                  <button 
                    type="button" 
                    onClick={onClose} 
                    className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    disabled={!titulo.trim()} 
                    className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-8 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-[#8B5CF6]/25 disabled:opacity-50 disabled:shadow-none"
                  >
                    {submitLabel ?? (initialData ? 'Guardar Cambios' : 'Crear Actividad')}
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
