"use client";
import { useTodos } from '@/hooks/useTodos';
import { useCalendarTasks } from '@/hooks/useCalendarTasks';
import { useAdvancedActivities } from '@/hooks/useAdvancedActivities';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle2, ClipboardList, Package } from 'lucide-react';
import { formatDateString } from '@/utils/date';
import { getGreeting } from '@/utils/uzalaTheme';
import Link from 'next/link';

const summaryCards = [
  { key: 'scheduled', icon: Calendar, color: 'from-uzala-purple/20 to-uzala-purple/5', iconColor: 'text-uzala-purple', border: 'border-uzala-purple/20' },
  { key: 'completed', icon: CheckCircle2, color: 'from-green-500/20 to-green-500/5', iconColor: 'text-green-400', border: 'border-green-500/20' },
  { key: 'pending', icon: ClipboardList, color: 'from-teal-500/20 to-teal-500/5', iconColor: 'text-teal-400', border: 'border-teal-500/20' },
  { key: 'restock', icon: Package, color: 'from-orange-500/20 to-orange-500/5', iconColor: 'text-orange-400', border: 'border-orange-500/20' },
];

export default function DashboardPage() {
  const { tasks: todos, isLoaded: todosLoaded } = useTodos();
  const { isLoaded: calLoaded } = useCalendarTasks();
  const { activities, isLoaded: activitiesLoaded } = useAdvancedActivities();
  const { currentUser } = useAuth();
  const todayStr = formatDateString(new Date());

  if (!todosLoaded || !calLoaded || !activitiesLoaded) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-uzala-purple border-t-transparent animate-spin" />
      </div>
    );
  }

  // Filtrado de actividades de hoy (Programadas para hoy + Pendientes sin fecha)
  const todayActivities = activities.filter((activity) => 
    activity.fechaProgramada === todayStr || (!activity.fechaProgramada && activity.estado !== 'completado')
  );
  
  const completedToday = activities.filter((activity) => 
    activity.estado === 'completado' && 
    (activity.fechaCompletado?.startsWith(todayStr) || activity.fechaProgramada === todayStr)
  ).length;

  const pendingToday = todayActivities.filter(a => a.estado !== 'completado').length;
  
  // Pendientes globales (excluyendo completados de cualquier origen)
  const pendingTodos = todos.filter((task) => task.status !== 'completed').length;
  const pendingActivitiesGlobal = activities.filter(a => a.estado !== 'completado').length;
  
  // Lógica de "Por surtir" (prioridad urgente o palabras clave)
  const restockItems = activities.filter(a => 
    a.estado !== 'completado' && 
    (a.priority === 'urgent' || 
     a.titulo.toLowerCase().includes('surtir') || 
     a.titulo.toLowerCase().includes('comprar') ||
     a.titulo.toLowerCase().includes('falta'))
  );
  
  const progress = todayActivities.length > 0 ? Math.round((completedToday / (todayActivities.length + (completedToday > todayActivities.length ? 0 : 0))) * 100) : 0;
  const safeProgress = Math.min(100, progress);

  // Actividades próximas (Futuras + Pendientes críticas)
  const upcomingTasks = activities
    .filter(activity => 
      activity.estado !== 'completado' && 
      ((activity.fechaProgramada && activity.fechaProgramada > todayStr) || activity.priority === 'urgent')
    )
    .sort((a, b) => {
      if (a.priority === 'urgent' && b.priority !== 'urgent') return -1;
      return 0;
    })
    .slice(0, 5);

  const stats = {
    scheduled: todayActivities.length,
    completed: completedToday,
    pending: pendingActivitiesGlobal + pendingTodos,
    restock: restockItems.length,
  };

  const cardLabels: Record<string, { title: string; subtitle?: string }> = {
    scheduled: { title: `${stats.scheduled} de hoy`, subtitle: 'en agenda' },
    completed: { title: `${stats.completed} hechas`, subtitle: `${safeProgress}% completado` },
    pending: { title: `${stats.pending} totales`, subtitle: 'pendientes' },
    restock: { title: `${stats.restock} totales`, subtitle: 'por surtir' },
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6 pb-6 max-w-4xl mx-auto md:max-w-none">
      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2 pt-2"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 data-design-id="dashboard-greeting" className="text-3xl md:text-4xl font-semibold italic text-white tracking-tight">
              {getGreeting()}, {currentUser.name.split(' ')[0]} 👋
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              {pendingToday > 0 
                ? `Tienes ${pendingToday} tareas para resolver hoy` 
                : todayActivities.length > 0
                  ? '¡Día completado! No te queda nada pendiente ✨'
                  : 'Tu agenda está libre para hoy'}
            </p>
          </div>
          <Link
            href="/activities"
            className="inline-flex items-center gap-2 rounded-2xl bg-uzala-purple px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-uzala-purple/20"
          >
            Nueva actividad
          </Link>
        </div>
      </motion.header>

      <section className="grid grid-cols-2 gap-3">
        {summaryCards.map((card, idx) => {
          const Icon = card.icon;
          const label = cardLabels[card.key];
          return (
            <motion.div
              key={card.key}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className={`bg-gradient-to-br ${card.color} glass-card border-none p-4`}
            >
              <div className={`w-11 h-11 rounded-2xl bg-[#0F0F17]/40 flex items-center justify-center mb-4 ${card.iconColor}`}>
                <Icon size={18} />
              </div>
              <p className="text-lg font-bold text-white leading-tight">{label.title}</p>
              {label.subtitle && <p className="text-xs text-gray-400 mt-1">{label.subtitle}</p>}
            </motion.div>
          );
        })}
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-gray-400">Resumen de Actividad</h2>
            <p className="text-xs text-gray-500">Tareas críticas y próximas</p>
          </div>
          <Link href="/activities" className="text-xs text-uzala-purple font-semibold">
            Ver todas
          </Link>
        </div>

        <div className="space-y-2">
          {upcomingTasks.length > 0 ? (
            upcomingTasks.map((activity, idx) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.06 }}
                className="flex items-center gap-3 glass-card p-4 hover:shadow-uzala/10 border-none"
              >
                <span className={`h-2.5 w-2.5 rounded-full ${
                  activity.priority === 'urgent'
                    ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                    : activity.priority === 'high'
                    ? 'bg-orange-400'
                    : activity.priority === 'medium'
                    ? 'bg-sky-400'
                    : 'bg-emerald-400'
                }`} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white truncate">{activity.titulo || activity.title}</p>
                  <p className="mt-1 text-[11px] text-gray-500">
                    {activity.fechaProgramada || 'Sin fecha'} · {activity.estado.replace('_', ' ')}
                  </p>
                </div>
                {activity.priority === 'urgent' && (
                  <span className="text-[9px] font-black text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full border border-red-400/20 uppercase tracking-tighter">
                    Urgente
                  </span>
                )}
              </motion.div>
            ))
          ) : (
            <div className="text-center py-10 glass-card border-none">
              <p className="text-sm text-gray-500">No hay tareas pendientes importantes</p>
              <Link href="/activities" className="text-xs text-uzala-purple font-semibold mt-2 inline-block">
                Agregar actividad
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
