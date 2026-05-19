import { motion, AnimatePresence } from 'framer-motion';
import { TodoTask, TodoStatus } from '@/types/todo';
import { PriorityLevel } from '@/types/common';
import { X, Trash2, Calendar, Flag, AlignLeft } from 'lucide-react';

interface TodoDetailPanelProps {
  task: TodoTask | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<TodoTask>) => void;
  onDelete: (id: string) => void;
}

export function TodoDetailPanel({ task, isOpen, onClose, onUpdate, onDelete }: TodoDetailPanelProps) {
  if (!task && isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && task && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          />
          <motion.div 
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed lg:absolute top-0 right-0 h-full w-full sm:w-96 glass border-l border-white/10 shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="font-medium text-gray-400">Detalles de Tarea</h3>
              <div className="flex items-center gap-2">
                <button onClick={() => { onDelete(task.id); onClose(); }} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                  <Trash2 size={18} />
                </button>
                <button onClick={onClose} className="p-2 text-gray-400 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              <div>
                <input 
                  type="text" 
                  value={task.title}
                  onChange={(e) => onUpdate(task.id, { title: e.target.value })}
                  className="w-full bg-transparent text-xl font-bold text-white focus:outline-none focus:border-b border-primary pb-1"
                  placeholder="Título de la tarea"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm">
                  <div className="w-24 flex items-center gap-2 text-gray-400">
                    <Flag size={16} /> Prioridad
                  </div>
                  <select 
                    value={task.priority}
                    onChange={(e) => onUpdate(task.id, { priority: e.target.value as PriorityLevel })}
                    className="bg-black/50 border border-white/10 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-primary"
                  >
                    <option value="low">Baja</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
                    <option value="urgent">Urgente</option>
                  </select>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="w-24 flex items-center gap-2 text-gray-400">
                    <div className="w-4 h-4 rounded-full bg-gray-500 flex items-center justify-center text-[10px] text-white font-bold">E</div> Estado
                  </div>
                  <select 
                    value={task.status}
                    onChange={(e) => onUpdate(task.id, { status: e.target.value as TodoStatus })}
                    className="bg-black/50 border border-white/10 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-primary"
                  >
                    <option value="pending">Pendiente</option>
                    <option value="in_progress">En Progreso</option>
                    <option value="completed">Completado</option>
                    <option value="delayed">Retrasada</option>
                  </select>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="w-24 flex items-center gap-2 text-gray-400">
                    <Calendar size={16} /> Fecha Límite
                  </div>
                  <input 
                    type="date"
                    value={task.dueDate || ''}
                    onChange={(e) => onUpdate(task.id, { dueDate: e.target.value })}
                    className="bg-black/50 border border-white/10 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 text-gray-400 mb-3 text-sm">
                  <AlignLeft size={16} /> Descripción
                </div>
                <textarea 
                  value={task.description || ''}
                  onChange={(e) => onUpdate(task.id, { description: e.target.value })}
                  placeholder="Añade una descripción más detallada..."
                  className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-primary min-h-[150px] resize-none"
                />
              </div>
            </div>
            <div className="p-4 border-t border-white/10 text-xs text-center text-gray-600">
              Creado el: {new Date(task.createdAt).toLocaleString()}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
