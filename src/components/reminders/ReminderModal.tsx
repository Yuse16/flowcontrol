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
    
    let delayMs = 0;
    if (unit === 'minutes') delayMs = amount * 60 * 1000;
    else if (unit === 'hours') delayMs = amount * 60 * 60 * 1000;
    else if (unit === 'days') delayMs = amount * 24 * 60 * 60 * 1000;

    addReminder(message, delayMs);
    setModalOpen(false);
    setMessage('');
    setAmount(5);
  };

  return (
    <AnimatePresence>
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-card border border-border rounded-3xl p-8 w-full max-w-md relative shadow-2xl"
          >
            <button 
              onClick={() => setModalOpen(false)}
              className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-primary/20 rounded-xl text-primary">
                <Bell size={20} />
              </div>
              <h2 className="text-xl font-bold text-foreground">Nuevo Recordatorio Crítico</h2>
            </div>

            <form onSubmit={handleCreate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">¿Qué quieres recordar?</label>
                <input 
                  required
                  type="text" 
                  placeholder="Ej: Llamar al proveedor..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-5 py-4 bg-background/50 border border-border rounded-2xl text-foreground focus:outline-none focus:border-primary transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">¿En cuánto tiempo?</label>
                <div className="flex gap-2">
                  <input 
                    required
                    type="number" 
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(parseInt(e.target.value) || 1)}
                    className="w-24 px-5 py-4 bg-background/50 border border-border rounded-2xl text-foreground focus:outline-none focus:border-primary transition-all text-center"
                  />
                  <div className="flex-1 flex bg-background/50 border border-border rounded-2xl p-1">
                    {(['minutes', 'hours', 'days'] as const).map((u) => (
                      <button
                        key={u}
                        type="button"
                        onClick={() => setUnit(u)}
                        className={`flex-1 py-3 text-[10px] uppercase font-black tracking-tighter rounded-xl transition-all ${
                          unit === u ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-500 hover:text-gray-400'
                        }`}
                      >
                        {u === 'minutes' ? 'Min' : u === 'hours' ? 'Hrs' : 'Días'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex gap-4 items-start">
                <Clock className="text-primary mt-1" size={18} />
                <p className="text-xs text-primary/80 leading-relaxed font-medium">
                  Este recordatorio bloqueará toda la pantalla al llegar el tiempo. Tendrás una confirmación de seguimiento 1 hora después de finalizar.
                </p>
              </div>

              <button 
                type="submit"
                className="w-full py-5 bg-primary hover:bg-primary-dark text-always-white rounded-2xl font-black text-lg transition-all shadow-lg shadow-primary/20 hover:-translate-y-1 active:translate-y-0"
              >
                ACTIVAR RECORDATORIO
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
