import { motion } from 'framer-motion';

export function WeeklyProgressChart({ data }: { data: number[] }) {
  const max = Math.max(...data, 10); // Minimum scale of 10 to avoid tiny bars
  const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  return (
    <div className="glass-card p-6 rounded-2xl border border-white/5 h-[350px] flex flex-col relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors pointer-events-none" />
      
      <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2 relative z-10">
        <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
        Actividad Semanal
      </h2>
      
      <div className="flex-1 flex items-end justify-between gap-2 sm:gap-4 relative mt-4">
        {/* Grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="w-full border-t border-white/5 border-dashed" />
          ))}
        </div>

        {data.map((val, i) => {
          const heightPercent = (val / max) * 100;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-3 z-10 group/bar">
              <div className="w-full relative flex-1 flex items-end justify-center">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPercent}%` }}
                  transition={{ duration: 0.8, delay: i * 0.1, type: 'spring' }}
                  className="w-full max-w-[40px] bg-gradient-to-t from-primary/20 to-primary rounded-t-md relative hover:brightness-125 transition-all cursor-crosshair"
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-xs text-white opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap border border-white/10 z-20">
                    {val} act.
                  </div>
                </motion.div>
              </div>
              <span className="text-xs font-medium text-gray-500">{days[i]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
