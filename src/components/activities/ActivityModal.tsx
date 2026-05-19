import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Calendar, Repeat, Tag, AlertTriangle } from 'lucide-react';
import { Activity, ActivityType, RecurrencePattern, ActivityModule } from '@/types/activity';
import { PriorityLevel } from '@/types/common';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Activity, 'id' | 'createdAt' | 'completionHistory' | 'isCompleted'>) => void;
  onDelete?: () => void;
  initialData?: Activity | null;
}

export function ActivityModal({ isOpen, onClose, onSave, onDelete, initialData }: ActivityModalProps) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ActivityType>('recurrent');
  const [module, setModule] = useState<ActivityModule>('general');
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [recurrence, setRecurrence] = useState<RecurrencePattern>('daily');
  const [customDays, setCustomDays] = useState<number[]>([]);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setType(initialData.type);
      setModule(initialData.module);
      setPriority(initialData.priority);
      setRecurrence(initialData.recurrence || 'daily');
      setCustomDays(initialData.customDays || []);
    } else {
      setTitle('');
      setType('recurrent');
      setModule('general');
      setPriority('medium');
      setRecurrence('daily');
      setCustomDays([]);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onSave({
      title,
      type,
      module,
      priority,
      ...(type === 'recurrent' ? { recurrence, customDays } : {})
    });
    onClose();
  };

  const toggleDay = (day: number) => {
    setCustomDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort()
    );
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
                  {initialData ? 'Editar Actividad' : 'Nueva Actividad'}
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
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-[#f9fafb] dark:bg-[#0a0a0a] border border-[#f3f4f6] dark:border-[#262626] rounded-xl px-4 py-3 text-sm text-[#111827] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6366f1]/10 focus:border-[#6366f1] transition-all"
                  placeholder="Ej. Revisar inventario de surtido"
                  autoFocus
                />
              </div>

              {/* TYPE & MODULE */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-1.5">
                    <Repeat size={12} /> Tipo
                  </label>
                  <select 
                    value={type}
                    onChange={e => setType(e.target.value as ActivityType)}
                    className="w-full bg-[#f9fafb] dark:bg-[#0a0a0a] border border-[#f3f4f6] dark:border-[#262626] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#6366f1] transition-all"
                  >
                    <option value="recurrent">Recurrente (Rutina)</option>
                    <option value="variable">Variable (Una vez)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-1.5">
                    <Tag size={12} /> Módulo
                  </label>
                  <select 
                    value={module}
                    onChange={e => setModule(e.target.value as ActivityModule)}
                    className="w-full bg-[#f9fafb] dark:bg-[#0a0a0a] border border-[#f3f4f6] dark:border-[#262626] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#6366f1] transition-all"
                  >
                    <option value="general">General</option>
                    <option value="proveedores">Proveedores</option>
                    <option value="surtir">Surtir</option>
                    <option value="urgentes">Urgentes</option>
                    <option value="vencidos">Vencidos</option>
                  </select>
                </div>
              </div>

              {/* PRIORITY */}
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
                        ? 'bg-[#6366f1] border-[#6366f1] text-white' 
                        : 'bg-white dark:bg-[#171717] border-[#f3f4f6] dark:border-[#262626] text-gray-400 hover:border-gray-300'
                      }`}
                    >
                      {p === 'low' ? 'Baja' : p === 'medium' ? 'Media' : p === 'high' ? 'Alta' : 'Crítica'}
                    </button>
                  ))}
                </div>
              </div>

              {/* RECURRENCE (Conditional) */}
              {type === 'recurrent' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">Frecuencia</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'daily', label: 'Diario' },
                        { id: 'weekdays', label: 'Lunes a Viernes' },
                        { id: 'weekends', label: 'Fines de Semana' },
                        { id: 'custom', label: 'Personalizado' },
                      ].map(r => (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => setRecurrence(r.id as RecurrencePattern)}
                          className={`py-2 px-3 text-[11px] font-semibold rounded-xl border text-left transition-all ${
                            recurrence === r.id 
                            ? 'bg-[#6366f1]/5 border-[#6366f1] text-[#6366f1]' 
                            : 'bg-white dark:bg-[#171717] border-[#f3f4f6] dark:border-[#262626] text-gray-500'
                          }`}
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {recurrence === 'custom' && (
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">Días de la semana</label>
                      <div className="flex justify-between">
                        {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((day, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => toggleDay(i)}
                            className={`w-9 h-9 rounded-full text-xs font-bold transition-all border ${
                              customDays.includes(i)
                              ? 'bg-[#6366f1] border-[#6366f1] text-white'
                              : 'bg-white dark:bg-[#171717] border-[#f3f4f6] dark:border-[#262626] text-gray-400'
                            }`}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

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
                    disabled={!title.trim()} 
                    className="bg-[#6366f1] hover:bg-[#4f46e5] text-white px-8 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-[#6366f1]/25 disabled:opacity-50 disabled:shadow-none"
                  >
                    {initialData ? 'Guardar Cambios' : 'Crear Actividad'}
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
