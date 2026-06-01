"use client";
import { useAdvancedActivities } from '@/hooks/useAdvancedActivities';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle2, ClipboardList, Package } from 'lucide-react';
import { formatDateString } from '@/utils/date';
import { getGreeting } from '@/utils/uzalaTheme';
import Link from 'next/link';

const summaryCards = [
  { key: 'scheduled', icon: Calendar, color: 'from-uzala-purple/20 to-uzala-purple/5', iconColor: 'text-uzala-purple', border: 'border-uzala-purple/20' },
  { key: 'completed', icon: CheckCircle2, color: 'from-uzala-blue/20 to-uzala-blue/5', iconColor: 'text-uzala-blue', border: 'border-uzala-blue/20' },
  { key: 'pending', icon: ClipboardList, color: 'from-uzala-teal/20 to-uzala-teal/5', iconColor: 'text-uzala-teal', border: 'border-uzala-teal/20' },
  { key: 'restock', icon: Package, color: 'from-uzala-orange/20 to-uzala-orange/5', iconColor: 'text-uzala-orange', border: 'border-uzala-orange/20' },
];

export default function DashboardPage() {
  const { activities, getActivitiesByStatus, isLoaded } = useAdvancedActivities();
  const { currentUser } = useAuth();
  const todayStr = formatDateString(new Date());

  if (!isLoaded) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-uzala-purple border-t-transparent animate-spin" />
      </div>
    );
  }

  const todayActivities = activities.filter(activity => activity.fechaProgramada === todayStr);
  const completedActivities = todayActivities.filter(activity => activity.estado === 'completado').length;
  const pendingActivities = todayActivities.filter(activity => activity.estado !== 'completado').length;
  const upcomingActivities = activities.filter(activity => activity.estado !== 'completado' && activity.fechaProgramada && activity.fechaProgramada > todayStr).slice(0, 5);

  const stats = {
    scheduled: todayActivities.length,
    completed: completedActivities,
    pending: pendingActivities,
    restock: activities.filter(activity => activity.estado !== 'completado' && activity.priority === 'high').length,
  };

  const cardLabels: Record<string, { title: string; subtitle?: string }> = {
    scheduled: { title: `${stats.scheduled} activas`, subtitle: 'programadas para hoy' },
    completed: { title: `${stats.completed} completadas`, subtitle: `${todayActivities.length ? Math.round((completedActivities / todayActivities.length) * 100) : 0}% progreso` },
    pending: { title: `${stats.pending} pendientes`, subtitle: 'para hoy' },
    restock: { title: `${stats.restock} importantes`, subtitle: 'prioridad alta' },
  };

  return (
    <div className="space-y-6 max-w-lg mx-auto md:max-w-none">
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

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-400">Próximas actividades</h2>
          <Link href="/activities" className="text-xs text-uzala-purple font-semibold">
            Ver todas
          </Link>
        </div>

        <div className="space-y-2">
          {upcomingActivities.length > 0 ? (
            upcomingActivities.map((activity, idx) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.06 }}
                className="flex items-center gap-3 bg-uzala-card border border-uzala-border rounded-2xl p-4"
              >
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                  activity.priority === 'urgent'
                    ? 'bg-red-500'
                    : activity.priority === 'high'
                    ? 'bg-orange-500'
                    : activity.priority === 'medium'
                    ? 'bg-blue-500'
                    : 'bg-green-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{activity.title}</p>
                  <p className="text-xs text-gray-500">{activity.fechaProgramada}</p>
                </div>
                <span className="text-[10px] font-bold text-uzala-purple bg-uzala-purple/10 px-2.5 py-1 rounded-full">
                  Próxima
                </span>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-10 bg-uzala-card border border-uzala-border rounded-2xl">
              <p className="text-sm text-gray-500">No hay actividades próximas</p>
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
