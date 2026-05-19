import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';

export function TeamActivityFeed() {
  const [activities, setActivities] = useState<{id:number, type:string, user:string, text:string, task:string, time:string}[]>([]);

  useEffect(() => {
    // La actividad en vivo será empujada desde la base de datos o WebSockets
  }, []);

  return (
    <div className="glass-card p-6 rounded-2xl border border-white/5 h-full relative overflow-hidden">
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2 relative z-10">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
        Feed en Vivo
      </h3>
      <div className="space-y-5 relative z-10">
        {activities.length === 0 ? (
          <p className="text-sm text-gray-500 text-center mt-10">Sin actividad reciente en el equipo.</p>
        ) : (
          <AnimatePresence>
            {activities.map((act) => (
              <motion.div 
                key={act.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, height: 0 }}
                layout
                className="flex gap-3 text-sm"
              >
                <div className="mt-0.5 text-gray-500 flex-shrink-0">
                  {act.type === 'complete' && <CheckCircle2 size={16} className="text-green-500" />}
                  {act.type === 'comment' && <MessageSquare size={16} className="text-blue-500" />}
                  {act.type === 'alert' && <AlertCircle size={16} className="text-red-500" />}
                </div>
                <div>
                  <p className="text-gray-300">
                    <span className="font-semibold text-white">{act.user}</span> {act.text} <span className="text-primary font-medium">&ldquo;{act.task}&rdquo;</span>
                  </p>
                  <span className="text-[10px] uppercase font-bold text-gray-500">{act.time}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
