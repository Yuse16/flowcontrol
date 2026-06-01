"use client";
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Circle, CheckCircle2 } from 'lucide-react';
import { useAdvancedActivities } from '@/hooks/useAdvancedActivities';
import { PRIORITY_STYLES } from '@/utils/uzalaTheme';

const TABS = [
  { id: 'pending', label: 'Pendientes' },
  { id: 'upcoming', label: 'Próximas' },
  { id: 'completed', label: 'Completadas' },
];

export default function TodosPage() {
  const { activities, addActivity, toggleCompletion, getActivitiesByStatus, isLoaded } = useAdvancedActivities();
  const [activeTab, setActiveTab] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredActivities = useMemo(() => {
    let list = activities;

    if (activeTab === 'pending') {
      list = getActivitiesByStatus('pendiente');
    } else if (activeTab === 'upcoming') {
      list = getActivitiesByStatus('upcoming');
    } else if (activeTab === 'completed') {
      list = getActivitiesByStatus('completado');
    }

    if (searchQuery) {
      list = list.filter(act => act.titulo.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    return list;
  }, [activities, activeTab, getActivitiesByStatus, searchQuery]);

  return (
    <div className="space-y-5 max-w-lg mx-auto md:max-w-none">
      <header>
        <h1 className="text-2xl font-bold text-white">Pendientes</h1>
      </header>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
        <input
          type="text"
          placeholder="Buscar pendiente..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-uzala-card border border-uzala-border rounded-2xl py-3 pl-11 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-uzala-purple/30"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-uzala-purple text-white'
                : 'bg-uzala-card text-gray-400 border border-uzala-border'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <section>
        <h2 className="text-sm font-semibold text-gray-400 mb-3">
          {activeTab === 'upcoming' ? 'Próximas actividades' : activeTab === 'completed' ? 'Actividades completadas' : 'Pendientes activos'}
        </h2>

        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {filteredActivities.length > 0 ? (
              filteredActivities.map((activity) => {
                const isDone = activity.estado === 'completado';
                const priority = PRIORITY_STYLES[activity.priority] || PRIORITY_STYLES.medium;

                return (
                  <motion.div
                    key={activity.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => toggleCompletion(activity.id)}
                    className="flex items-center gap-3 bg-uzala-card border border-uzala-border rounded-2xl p-4 cursor-pointer active:scale-[0.98] transition-transform"
                  >
                    <button className="flex-shrink-0" onClick={(e) => { e.stopPropagation(); toggleCompletion(activity.id); }}>
                      {isDone ? (
                        <CheckCircle2 size={22} className="text-uzala-purple" />
                      ) : (
                        <Circle size={22} className="text-gray-600" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${isDone ? 'text-gray-500 line-through' : 'text-white'}`}>
                        {activity.title}
                      </p>
                      <p className="text-xs text-gray-500">{activity.fechaProgramada || 'Sin fecha'}</p>
                    </div>

                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${priority.bg} ${priority.text}`}>
                      {priority.label}
                    </span>
                  </motion.div>
                );
              })
            ) : (
              <div className="text-center py-16 bg-uzala-card border border-uzala-border rounded-2xl">
                <p className="text-sm text-gray-500">No hay pendientes</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <div className="md:hidden fixed bottom-28 left-0 right-0 px-4 z-30">
        <button
          onClick={() => addActivity({ titulo: 'Nueva actividad', descripcion: undefined, title: 'Nueva actividad', description: undefined, priority: 'medium', origen: 'actividades' })}
          className="w-full py-3 bg-uzala-card border border-uzala-border rounded-2xl text-sm font-semibold text-uzala-purple"
        >
          + Agregar pendiente
        </button>
      </div>

      <div className="hidden md:block text-center py-4">
        <button
          onClick={() => addActivity({ titulo: 'Nueva actividad', descripcion: undefined, title: 'Nueva actividad', description: undefined, priority: 'medium', origen: 'actividades' })}
          className="text-sm text-uzala-purple font-semibold"
        >
          + Agregar pendiente
        </button>
      </div>
    </div>
  );
}
