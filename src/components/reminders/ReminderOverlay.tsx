"use client";
import { useReminders } from '@/hooks/useReminders';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

export function ReminderOverlay() {
  const { activeReminder, dismissActive } = useReminders();

  return (
    <AnimatePresence>
      {activeReminder && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-2xl p-6 overflow-hidden"
        >
          {/* Background animated glow */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.2, 0.1]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] ${
                activeReminder.type === 'critical' ? 'bg-red-500' : 'bg-primary'
              }`}
            />
          </div>

          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="w-full max-w-lg bg-card border border-border rounded-[40px] p-10 relative shadow-2xl text-center"
          >
            <div className="flex justify-center mb-8">
              <div className={`p-5 rounded-3xl ${
                activeReminder.type === 'critical' ? 'bg-red-500/20 text-red-500' : 'bg-primary/20 text-primary'
              }`}>
                {activeReminder.type === 'critical' ? <AlertTriangle size={48} /> : <Clock size={48} />}
              </div>
            </div>

            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-gray-500 mb-2">
              {activeReminder.type === 'critical' ? 'Recordatorio Crítico' : 'Confirmación de Seguimiento'}
            </h2>
            
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
              {activeReminder.message}
            </h1>

            <p className="text-gray-500 mb-10 text-lg">
              {activeReminder.type === 'critical' 
                ? "Esta tarea requiere tu atención inmediata. La aplicación permanecerá bloqueada hasta que confirmes que has terminado."
                : "Prometiste terminar esto hace una hora. ¿Seguro que lo hiciste?"}
            </p>

            <button 
              onClick={dismissActive}
              className={`w-full flex items-center justify-center gap-3 py-6 rounded-2xl font-black text-xl transition-all active:scale-95 shadow-xl ${
                activeReminder.type === 'critical' 
                  ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20' 
                  : 'bg-primary hover:bg-primary-dark text-white shadow-primary/20'
              }`}
            >
              <CheckCircle2 size={24} />
              ¡LISTO, YA LO HICE!
            </button>

            <p className="mt-6 text-[10px] uppercase font-bold tracking-widest text-gray-600">
              UZALA — Sistema de recordatorios
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
