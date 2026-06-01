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
  { key: 'completed', icon: CheckCircle2, color: 'from-sky-500/20 to-sky-500/5', iconColor: 'text-sky-400', border: 'border-sky-500/20' },
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

  const todayActivities = activities.filter((activity) => activity.fechaProgramada === todayStr);
  const completedActivities = todayActivities.filter((activity) => activity.estado === 'completado').length;
  const pendingActivities = todayActivities.length - completedActivities;
  const pendingTodos = todos.filter((task) => task.status !== 'completed').length;
  const restockCount = todos.filter((task) => task.status === 'pending' && task.priority === 'urgent').length;
  const progress = todayActivities.length > 0 ? Math.round((completedActivities / todayActivities.length) * 100) : 0;
  const upcomingActivities = activities.filter(
    (activity) =>
      activity.estado !== 'completado' &&
      activity.fechaProgramada &&
      activity.fechaProgramada > todayStr
  );

  const stats = {
    scheduled: todayActivities.length,
    completed: completedActivities,
    pending: pendingActivities + pendingTodos,
    restock: restockCount || Math.min(pendingTodos, 2),
  };

  const cardLabels: Record<string, { title: string; subtitle?: string }> = {
    scheduled: { title: `${stats.scheduled} Actividades`, subtitle: 'programadas' },
    completed: { title: `${stats.completed} Completadas`, subtitle: `${progress}% progreso` },
    pending: { title: `${stats.pending} Pendientes`, subtitle: 'activos' },
    restock: { title: `${stats.restock} Por surtir`, subtitle: 'pendientes' },
  };

  const upcomingTasks = upcomingActivities.slice(0, 4);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6 pb-6 max-w-4xl mx-auto md:max-w-none">
      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2 pt-2"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              {getGreeting()}, {currentUser.name.split(' ')[0]} 👋
            </h1>
            <p className="text-sm text-gray-400 mt-1">Tienes {todayActivities.length} actividades para hoy</p>
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
              className={`bg-gradient-to-br ${card.color} border ${card.border} rounded-3xl p-4`}
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
            <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-gray-400">Próximas actividades</h2>
            <p className="text-xs text-gray-500">Toma acción rápida sin desplazarte</p>
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
                className="flex items-center gap-3 bg-uzala-card border border-uzala-border rounded-2xl p-4"
              >
                <span className={`h-2.5 w-2.5 rounded-full ${
                  activity.priority === 'urgent'
                    ? 'bg-red-400'
                    : activity.priority === 'high'
                    ? 'bg-orange-400'
                    : activity.priority === 'medium'
                    ? 'bg-sky-400'
                    : 'bg-emerald-400'
                }`} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white truncate">{activity.titulo || activity.title}</p>
                  <p className="mt-1 text-[11px] text-gray-500">{activity.fechaProgramada} · {activity.estado.replace('_', ' ')}</p>
                </div>
                <span className="text-[10px] font-bold text-uzala-purple bg-uzala-purple/10 px-2.5 py-1 rounded-full">
                  Próxima
                </span>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-10 bg-uzala-card border border-uzala-border rounded-2xl">
              <p className="text-sm text-gray-500">No hay actividades pendientes</p>
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
