import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '@/types/user';
import { X, UserPlus } from 'lucide-react';

interface TaskAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  preSelectedUserId?: string | null;
  onAssign: (userId: string, title: string, priority: string) => void;
}

export function TaskAssignmentModal({ isOpen, onClose, users, preSelectedUserId, onAssign }: TaskAssignmentModalProps) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [assigneeId, setAssigneeId] = useState('');

  // Update state when modal opens with a preselected user
  if (isOpen && preSelectedUserId && assigneeId !== preSelectedUserId) {
    setAssigneeId(preSelectedUserId);
  }

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && assigneeId) {
      onAssign(assigneeId, title, priority);
      setTitle('');
      setAssigneeId('');
      onClose();
    }
  };

  const employees = users.filter(u => u.role === 'employee');

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-md glass-card rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <UserPlus size={20} className="text-primary" /> Asignar Tarea
              </h3>
              <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Título de la Tarea</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                  placeholder="Ej. Revisar reporte mensual"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Asignar a</label>
                <select 
                  value={assigneeId}
                  onChange={e => setAssigneeId(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary"
                  required
                >
                  <option value="" disabled>Selecciona un empleado</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.department})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Prioridad</label>
                <select 
                  value={priority}
                  onChange={e => setPriority(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary"
                >
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                  <option value="urgent">Urgente</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3 justify-end">
                <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/5 transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={!title || !assigneeId} className="bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-primary/20 disabled:opacity-50">
                  Asignar y Notificar
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
