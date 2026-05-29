"use client";
import { useTodos } from '@/hooks/useTodos';
import { useCalendarTasks } from '@/hooks/useCalendarTasks';
import { useAdvancedActivities } from '@/hooks/useAdvancedActivities';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle2, ClipboardList, Package } from 'lucide-react';
import { formatDateString } from '@/utils/date';
import { getGreeting, getCategoryColor } from '@/utils/uzalaTheme';
import Link from 'next/link';

const summaryCards = [
  { key: 'scheduled', icon: Calendar, color: 'from-uzala-purple/20 to-uzala-purple/5', iconColor: 'text-uzala-purple', border: 'border-uzala-purple/20' },
  { key: 'completed', icon: CheckCircle2, color: 'from-uzala-blue/20 to-uzala-blue/5', iconColor: 'text-uzala-blue', border: 'border-uzala-blue/20' },
  { key: 'pending', icon: ClipboardList, color: 'from-uzala-teal/20 to-uzala-teal/5', iconColor: 'text-uzala-teal', border: 'border-uzala-teal/20' },
  { key: 'restock', icon: Package, color: 'from-uzala-orange/20 to-uzala-orange/5', iconColor: 'text-uzala-orange', border: 'border-uzala-orange/20' },
];

export default function DashboardPage() {
  const { tasks: todos, isLoaded: todosLoaded } = useTodos();
  const { tasks: calTasks, isLoaded: calLoaded } = useCalendarTasks();
  const { getActivitiesForDate, isLoaded: actLoaded } = useAdvancedActivities();
  const { currentUser } = useAuth();

  const todayStr = formatDateString(new Date());
  const todayActivities = getActivitiesForDate(new Date());

  if (!todosLoaded || !calLoaded || !actLoaded) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-uzala-purple border-t-transparent animate-spin" />
      </div>
    );
  }

  const completedActivities = todayActivities.filter(a => {
    const isDone = a.type === 'variable' ? a.isCompleted : a.completionHistory?.[todayStr];
    return isDone;
  }).length;

  const pendingActivities = todayActivities.length - completedActivities;
  const progress = todayActivities.length > 0 ? Math.round((completedActivities / todayActivities.length) * 100) : 0;

  const pendingTodos = todos.filter(t => t.status !== 'completed').length;
  const restockCount = todos.filter(t => t.status === 'pending' && t.priority === 'urgent').length;

  const stats = {
    scheduled: todayActivities.length,
    completed: completedActivities,
    pending: pendingActivities + pendingTodos,
    restock: restockCount || Math.min(pendingTodos, 2),
  };

  const upcoming = [...todayActivities]
    .filter(a => {
      const isDone = a.type === 'variable' ? a.isCompleted : a.completionHistory?.[todayStr];
      return !isDone;
    })
    .slice(0, 5);

  const cardLabels: Record<string, { title: string; subtitle?: string }> = {
    scheduled: { title: `${stats.scheduled} Actividades`, subtitle: 'programadas' },
    completed: { title: `${stats.completed} Completadas`, subtitle: `${progress}% progreso` },
    pending: { title: `${stats.pending} Pendientes`, subtitle: 'activos' },
    restock: { title: `${stats.restock} Por surtir`, subtitle: 'pendientes' },
  };

  return (
    <div className="space-y-6 max-w-lg mx-auto md:max-w-none">
      {/* Greeting */}
      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1 pt-2"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          ¡{getGreeting()}, {currentUser.name.split(' ')[0]}! 👋
        </h1>
        <p className="text-sm text-gray-400">
          Tienes {todayActivities.length} actividades para hoy
        </p>
      </motion.header>

      {/* Resumen del día */}
      <section>
        <h2 className="text-sm font-semibold text-gray-400 mb-3">Resumen del día</h2>
        <div className="grid grid-cols-2 gap-3">
          {summaryCards.map((card, idx) => {
            const Icon = card.icon;
            const label = cardLabels[card.key];
            return (
              <motion.div
                key={card.key}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className={`bg-gradient-to-br ${card.color} border ${card.border} rounded-2xl p-4`}
              >
                <div className={`w-9 h-9 rounded-xl bg-[#0F0F17]/40 flex items-center justify-center mb-3 ${card.iconColor}`}>
                  <Icon size={18} />
                </div>
                <p className="text-lg font-bold text-white leading-tight">{label.title}</p>
                {label.subtitle && (
                  <p className="text-xs text-gray-400 mt-0.5">{label.subtitle}</p>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Próximas actividades */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-400">Próximas actividades</h2>
          <Link href="/activities" className="text-xs text-uzala-purple font-semibold">
            Ver todas
          </Link>
        </div>

        <div className="space-y-2">
          {upcoming.length > 0 ? (
            upcoming.map((activity, idx) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.06 }}
                className="flex items-center gap-3 bg-uzala-card border border-uzala-border rounded-2xl p-4"
              >
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: getCategoryColor(activity.category) }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{activity.title}</p>
                  <p className="text-xs text-gray-500">{activity.time || '08:00'}</p>
                </div>
                <span className="text-[10px] font-bold text-uzala-purple bg-uzala-purple/10 px-2.5 py-1 rounded-full">
                  Hoy
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

      {/* Desktop extras */}
      <section className="hidden lg:grid lg:grid-cols-2 gap-4">
        <div className="bg-uzala-card border border-uzala-border rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-gray-400 mb-3">Calendario hoy</h3>
          <p className="text-2xl font-bold text-white">{calTasks.filter(t => !t.completed).length}</p>
          <p className="text-xs text-gray-500">eventos pendientes</p>
        </div>
        <div className="bg-uzala-card border border-uzala-border rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-gray-400 mb-3">Tareas totales</h3>
          <p className="text-2xl font-bold text-white">{todos.length}</p>
          <p className="text-xs text-gray-500">en pendientes</p>
        </div>
      </section>
    </div>
  );
}
