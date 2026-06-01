"use client";
import { useState } from 'react';
import { useReminders } from '@/hooks/useReminders';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Bell, Calendar } from 'lucide-react';


export function ReminderModal() {
  const { isModalOpen, setModalOpen, addReminder } = useReminders();
  const [message, setMessage] = useState('');
  const [amount, setAmount] = useState(5);
  const [unit, setUnit] = useState<'minutes' | 'hours' | 'days'>('minutes');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    let delayMs = 0;
    if (unit === 'minutes') delayMs = amount * 60 * 1000;
    else if (unit === 'hours') delayMs = amount * 60 * 60 * 1000;
    else if (unit === 'days') delayMs = amount * 24 * 60 * 60 * 1000;

    addReminder(message.trim(), delayMs);
    setModalOpen(false);
    setMessage('');
    setAmount(5);
  };

  return (
    <AnimatePresence>
      {isModalOpen && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="glass border-white/10 rounded-[32px] p-8 w-full max-w-md relative shadow-2xl overflow-hidden"
          >
            <button 
              onClick={() => setModalOpen(false)}
              className="absolute top-6 right-6 w-10 h-10 rounded-2xl flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X size={24} />
            </button>

            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-uzala-orange/20 rounded-2xl flex items-center justify-center text-uzala-orange shadow-lg shadow-uzala-orange/10">
                <Bell size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-white tracking-tight">Recordatorio Crítico</h2>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-1">Sincronización Temporal</p>
              </div>
            </div>

            <form onSubmit={handleCreate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-uzala-purple ml-1">¿Qué quieres recordar?</label>
                <input 
                  required
                  type="text" 
                  placeholder="Ej: Llamar al proveedor..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-5 py-4 glass bg-white/5 border-white/10 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-uzala-purple/30 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-uzala-purple ml-1">¿En cuánto tiempo?</label>
                <div className="flex gap-3">
                  <input 
                    required
                    type="number" 
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(parseInt(e.target.value) || 1)}
                    className="w-24 px-5 py-4 glass bg-white/5 border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-uzala-purple/30 transition-all text-center font-bold"
                  />
                  <div className="flex-1 flex glass bg-white/5 border-white/10 rounded-2xl p-1">
                    {(['minutes', 'hours', 'days'] as const).map((u) => (
                      <button
                        key={u}
                        type="button"
                        onClick={() => setUnit(u)}
                        className={`flex-1 py-3 text-[10px] uppercase font-black tracking-tighter rounded-xl transition-all ${
                          unit === u 
                          ? 'bg-uzala-purple text-white shadow-lg shadow-uzala-purple/20' 
                          : 'text-gray-500 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {u === 'minutes' ? 'Min' : u === 'hours' ? 'Hrs' : 'Días'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-uzala-purple/5 border border-uzala-purple/20 rounded-2xl p-5 flex gap-4 items-start">
                <Clock className="text-uzala-purple mt-0.5 flex-shrink-0" size={18} />
                <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
                  Este recordatorio bloqueará toda la pantalla al llegar el tiempo. Tendrás una confirmación de seguimiento 1 hora después de finalizar.
                </p>
              </div>

              <button 
                type="submit"
                className="w-full py-5 uzala-gradient text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-uzala-purple/20 hover:scale-[1.02] active:scale-100"
              >
                Activar Recordatorio
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
