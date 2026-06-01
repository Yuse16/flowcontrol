"use client";
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Circle, CheckCircle2, Search, Plus } from 'lucide-react';
import { useAdvancedActivities } from '@/hooks/useAdvancedActivities';
import { ActivityModal } from '@/components/activities/ActivityModal';
import { Activity } from '@/types/activity';
import { PRIORITY_STYLES } from '@/utils/uzalaTheme';

const SECTIONS = [
  { key: 'today', label: 'Hoy' },
  { key: 'upcoming', label: 'Próximas' },
  { key: 'vencido', label: 'Vencidas' },
  { key: 'en_proceso', label: 'En proceso' },
];

const statusKeyMap: Record<string, any> = {
  today: 'today',
  upcoming: 'upcoming',
  vencido: 'vencido',
  en_proceso: 'en_proceso',
};

export default function ActivitiesPage() {
  const { activities, toggleCompletion, getActivitiesByStatus, addActivity, updateActivity, deleteActivity } = useAdvancedActivities();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  const sectionData = useMemo(() => {
    return SECTIONS.map((section) => {
      const list = getActivitiesByStatus(statusKeyMap[section.key]);
      const filtered = list.filter((activity) => {
        // Ocultar completadas de las secciones principales
        if (activity.estado === 'completado') return false;
        
        if (searchQuery) {
          return activity.titulo.toLowerCase().includes(searchQuery.toLowerCase());
        }
        return true;
      });
      return { ...section, activities: filtered };
    });
  }, [getActivitiesByStatus, searchQuery, activities]);

  const historyData = useMemo(() => {
    const list = getActivitiesByStatus('completado');
    return searchQuery
      ? list.filter((activity) => activity.titulo.toLowerCase().includes(searchQuery.toLowerCase()))
      : list;
  }, [getActivitiesByStatus, searchQuery, activities]);

  const handleSaveActivity = (data: Omit<Activity, 'id' | 'fechaCreacion' | 'estado' | 'fechaCompletado'>) => {
    if (editingActivity) {
      updateActivity(editingActivity.id, data);
    } else {
      addActivity(data);
    }
  };

  const renderActivityItem = (activity: Activity) => {
    const isDone = activity.estado === 'completado';
    const priority = PRIORITY_STYLES[activity.priority] || PRIORITY_STYLES.medium;

    return (
      <motion.div
        key={activity.id}
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98 }}
        className="flex items-center gap-3 glass-card p-4 hover:shadow-uzala/20"
      >
        <button
          type="button"
          onClick={() => toggleCompletion(activity.id)}
          className="flex-shrink-0"
        >
          {isDone ? (
            <CheckCircle2 size={22} className="text-green-500" />
          ) : (
            <Circle size={22} className="text-gray-500" />
          )}
        </button>

        <button
          type="button"
          onClick={() => { setEditingActivity(activity); setIsModalOpen(true); }}
          className="flex-1 text-left min-w-0"
        >
          <p className={`text-sm font-medium truncate ${isDone ? 'text-gray-500 line-through' : 'text-white'}`}>
            {activity.titulo}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-[10px] text-gray-500">
              {activity.fechaProgramada ?? 'Sin fecha'}
            </p>
            {isDone && activity.fechaCompletado && (
              <>
                <span className="w-1 h-1 rounded-full bg-gray-600" />
                <p className="text-[10px] text-green-500/70">
                  Completado: {new Date(activity.fechaCompletado).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                </p>
              </>
            )}
          </div>
        </button>

        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${priority.bg} ${priority.text}`}>
          {priority.label}
        </span>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto md:max-w-none">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Actividades</h1>
          <p className="text-sm text-gray-400 mt-1">Tu centro de acción para terminar tareas hoy.</p>
        </div>
        <button
          onClick={() => { setEditingActivity(null); setIsModalOpen(true); }}
          className="inline-flex items-center gap-2 rounded-2xl bg-uzala-purple px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-uzala-purple/20"
        >
          <Plus size={16} /> Nueva actividad
        </button>
      </header>

      <div className="relative max-w-2xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
        <input
          type="text"
          placeholder="Buscar actividad..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full glass border-white/5 rounded-2xl py-3 pl-11 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-uzala-purple/30"
        />
      </div>

      <div className="space-y-8 pb-10">
        {sectionData.map((section) => (
          <section key={section.key} className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-400">{section.label}</p>
                <p className="text-xs text-gray-500 mt-1">{section.activities.length} actividades</p>
              </div>
            </div>

            <div className="space-y-3">
              {section.activities.length > 0 ? (
                <AnimatePresence mode="popLayout">
                  {section.activities.map(renderActivityItem)}
                </AnimatePresence>
              ) : (
                <div className="rounded-3xl border border-uzala-border bg-white/5 p-6 text-center text-sm text-gray-500">
                  No hay actividades pendientes en esta sección.
                </div>
              )}
            </div>
          </section>
        ))}

        {/* Sección Historial */}
        <section className="space-y-4 pt-4 border-t border-uzala-border/50">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-400">Historial</p>
            <p className="text-xs text-gray-500 mt-1">{historyData.length} actividades completadas</p>
          </div>

          <div className="space-y-3">
            {historyData.length > 0 ? (
              <AnimatePresence mode="popLayout">
                {historyData.map(renderActivityItem)}
              </AnimatePresence>
            ) : (
              <div className="rounded-3xl border border-dotted border-uzala-border bg-transparent p-6 text-center text-sm text-gray-500">
                El historial aparecerá aquí cuando completes actividades.
              </div>
            )}
          </div>
        </section>
      </div>

      <ActivityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveActivity}
        onDelete={() => editingActivity && deleteActivity(editingActivity.id)}
        initialData={editingActivity}
      />
    </div>
  );
}
