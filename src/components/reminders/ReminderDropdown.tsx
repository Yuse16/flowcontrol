"use client";
import { useReminders } from '@/hooks/useReminders';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Clock, BellOff } from 'lucide-react';

interface ReminderDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReminderDropdown({ isOpen, onClose }: ReminderDropdownProps) {
  const { reminders, deleteReminder } = useReminders();
  
  const pendingReminders = reminders.filter(r => r.status === 'pending');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-[40]" onClick={onClose} />
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-80 bg-[#0f1115] border border-white/10 rounded-2xl shadow-2xl z-[50] overflow-hidden"
          >
            <div className="p-4 border-b border-white/5 bg-white/[0.02]">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock size={14} className="text-primary" />
                Recordatorios Pendientes
              </h3>
            </div>

            <div className="max-h-80 overflow-y-auto custom-scrollbar">
              {pendingReminders.length === 0 ? (
                <div className="p-8 text-center">
                  <BellOff size={32} className="mx-auto text-gray-700 mb-2 opacity-20" />
                  <p className="text-xs text-gray-500">No hay recordatorios activos</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {pendingReminders.map((r) => (
                    <div key={r.id} className="p-4 hover:bg-white/[0.02] transition-colors group">
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-200 font-medium break-words leading-relaxed">
                            {r.message}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full font-bold">
                              {new Date(r.targetTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span className="text-[10px] text-gray-500">
                              {r.type === 'critical' ? 'Crítico' : 'Seguimiento'}
                            </span>
                          </div>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteReminder(r.id);
                          }}
                          className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                          title="Eliminar recordatorio"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {pendingReminders.length > 0 && (
              <div className="p-3 bg-black/40 border-t border-white/5 text-center">
                <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                  Se activarán automáticamente
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
