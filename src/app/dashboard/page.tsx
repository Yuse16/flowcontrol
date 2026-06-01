"use client";
import { useAdvancedActivities } from '@/hooks/useAdvancedActivities';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { AlertTriangle, Calendar, Clock, Plus } from 'lucide-react';
import { formatDateString } from '@/utils/date';
import { getGreeting } from '@/utils/uzalaTheme';
import Link from 'next/link';

const summaryCards = [
  {
    key: 'overdue',
    title: 'Vencidas',
    label: 'Necesitan atención',
    icon: AlertTriangle,
    accent: 'from-red-500/15 to-red-500/5',
    iconColor: 'text-red-400',
  },
  {
    key: 'today',
    title: 'Para hoy',
    label: 'En tu agenda',
    icon: Calendar,
    accent: 'from-uzala-purple/20 to-uzala-purple/5',
    iconColor: 'text-uzala-purple',
  },
  {
    key: 'upcoming',
    title: 'Próximas',
    label: 'En los próximos días',
    icon: Clock,
    accent: 'from-sky-500/15 to-sky-500/5',
    iconColor: 'text-sky-400',
  },
];

export default function DashboardPage() {
  const { activities, isLoaded } = useAdvancedActivities();
  const { currentUser } = useAuth();
  const todayStr = formatDateString(new Date());

  if (!isLoaded) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-uzala-purple border-t-transparent animate-spin" />
      </div>
    );
  }

  const overdueActivities = activities.filter((activity) => {
    if (!activity.fechaProgramada || activity.estado === 'completado') return false;
    return activity.fechaProgramada < todayStr;
  });

  const todayActivities = activities.filter(
    (activity) => activity.fechaProgramada === todayStr
  );

  const upcomingActivities = activities.filter(
    (activity) =>
      activity.estado !== 'completado' &&
      activity.fechaProgramada &&
      activity.fechaProgramada > todayStr
  );

  const summaryValues = {
    overdue: overdueActivities.length,
    today: todayActivities.length,
    upcoming: upcomingActivities.length,
  };

  const todayTasks = todayActivities.slice(0, 4);
  const upcomingTasks = upcomingActivities.slice(0, 5);

  return (
    <div className="space-y-6 max-w-4xl mx-auto md:max-w-none">
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 pt-2"
      >
        <div className="flex flex-col gap-3 md:items-start md:flex-row md:justify-between md:items-end">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-uzala-purple/60">
              Centro de acción
            </p>
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Buenos días, {currentUser.name.split(' ')[0]}
              </h1>
              <p className="max-w-2xl text-sm text-gray-400 leading-6">
                ¿Tienes que recordar algo? No lo olvides.
              </p>
            </div>
          </div>

          <Link
            href="/activities"
            className="inline-flex items-center gap-2 rounded-3xl bg-gradient-to-r from-uzala-purple to-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-2xl shadow-uzala-purple/20 transition hover:-translate-y-0.5"
          >
            <Plus size={16} />
            Nueva actividad
          </Link>
        </div>
      </motion.header>

      <section className="grid gap-4 lg:grid-cols-3">
        {summaryCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              className={`rounded-[28px] border border-white/5 bg-white/5 p-5 backdrop-blur-xl shadow-[0_30px_120px_rgba(0,0,0,0.15)] ${card.accent}`}
            >
              <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-white/10 ${card.iconColor}`}>
                <Icon size={22} />
              </div>
              <p className="text-3xl font-bold text-white">{summaryValues[card.key as keyof typeof summaryValues]}</p>
              <p className="mt-2 text-sm text-gray-400">{card.title}</p>
              <p className="mt-4 text-xs text-gray-500">{card.label}</p>
            </motion.div>
          );
        })}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gray-400">
              Actividades de hoy
            </p>
            <p className="text-xs text-gray-500">{todayActivities.length} tareas programadas</p>
          </div>
          <Link href="/activities" className="text-xs text-uzala-purple font-semibold">
            Ver todas
          </Link>
        </div>

        <div className="space-y-3">
          {todayTasks.length > 0 ? (
            todayTasks.map((activity, idx) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex flex-col gap-3 rounded-[28px] border border-white/5 bg-white/5 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.12)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-base font-semibold text-white truncate">{activity.titulo || activity.title}</p>
                    <p className="mt-1 text-sm text-gray-500">{activity.descripcion || activity.description || 'Sin descripción'}</p>
                  </div>
                  <span className="rounded-full bg-uzala-purple/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-uzala-purple">
                    Hoy
                  </span>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                  {activity.fechaProgramada && <span>{activity.fechaProgramada}</span>}
                  <span>{activity.estado.replace('_', ' ')}</span>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="rounded-[28px] border border-white/5 bg-white/5 p-6 text-center text-sm text-gray-500 shadow-[0_20px_80px_rgba(0,0,0,0.12)]">
              No hay actividades para hoy. Agrega una nueva actividad para mantener tu día bajo control.
            </div>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gray-400">
              Próximas actividades
            </p>
            <p className="text-xs text-gray-500">Siguientes tareas en tu lista</p>
          </div>
          <Link href="/activities" className="text-xs text-uzala-purple font-semibold">
            Ver todas
          </Link>
        </div>

        <div className="space-y-3">
          {upcomingTasks.length > 0 ? (
            upcomingTasks.map((activity, idx) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center justify-between gap-4 rounded-[28px] border border-white/5 bg-[#0d0b14] p-4"
              >
                <div className="flex items-center gap-3">
                  <span className={`inline-flex h-3.5 w-3.5 rounded-full ${
                    activity.priority === 'urgent'
                      ? 'bg-red-400'
                      : activity.priority === 'high'
                      ? 'bg-orange-400'
                      : activity.priority === 'medium'
                      ? 'bg-sky-400'
                      : 'bg-emerald-400'
                  }`} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{activity.titulo || activity.title}</p>
                    <p className="text-[11px] text-gray-500">{activity.fechaProgramada}</p>
                  </div>
                </div>
                <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-300">
                  Próxima
                </span>
              </motion.div>
            ))
          ) : (
            <div className="rounded-[28px] border border-white/5 bg-white/5 p-6 text-center text-sm text-gray-500 shadow-[0_20px_80px_rgba(0,0,0,0.12)]">
              No hay actividades próximas. Agrega algo nuevo para mantener el flujo.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
