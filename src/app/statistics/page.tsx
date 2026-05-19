export default function StatisticsPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-white">Estadísticas</h1>
        <p className="text-gray-400 mt-1">Análisis de rendimiento y métricas.</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
        <div className="glass-card rounded-2xl p-6 border border-white/5 flex flex-col items-center justify-center">
          <div className="w-40 h-40 rounded-full border-8 border-primary/20 border-t-primary animate-spin-slow"></div>
          <p className="mt-6 text-gray-400">Gráfico de Productividad</p>
        </div>
        <div className="glass-card rounded-2xl p-6 border border-white/5 flex flex-col items-center justify-center">
          <div className="flex items-end gap-2 h-40">
            {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
              <div key={i} className="w-8 bg-gradient-to-t from-primary/50 to-primary rounded-t-sm" style={{ height: `${h}%` }}></div>
            ))}
          </div>
          <p className="mt-6 text-gray-400">Actividad Semanal</p>
        </div>
      </div>
    </div>
  );
}
