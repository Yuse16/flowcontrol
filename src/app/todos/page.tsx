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
        <h1 className="text-2xl font-bold text-white tracking-tight">Pendientes</h1>
      </header>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
        <input
          type="text"
          placeholder="Buscar pendiente..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full glass bg-white/5 border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-uzala-purple/30 transition-all"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-shrink-0 px-5 py-2.5 rounded-full text-xs font-bold transition-all border ${
              activeTab === tab.id
                ? 'bg-uzala-purple border-uzala-purple text-white shadow-lg shadow-uzala-purple/20'
                : 'glass bg-white/5 text-gray-500 border-white/5 hover:border-white/20'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <section>
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4 ml-1">
          {activeTab === 'upcoming' ? 'En agenda futura' : activeTab === 'completed' ? 'Historial de éxito' : 'Tareas activas'}
        </h2>

        <div className="space-y-3">
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
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={() => toggleCompletion(activity.id)}
                    className="flex items-center gap-4 glass-card p-4 cursor-pointer hover:shadow-uzala/10 transition-all active:scale-[0.98]"
                  >
                    <button className="flex-shrink-0" onClick={(e) => { e.stopPropagation(); toggleCompletion(activity.id); }}>
                      {isDone ? (
                        <CheckCircle2 size={24} className="text-green-500" />
                      ) : (
                        <Circle size={24} className="text-gray-600" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold truncate ${isDone ? 'text-gray-500 line-through' : 'text-white'}`}>
                        {activity.titulo || activity.title}
                      </p>
                      <p className="text-[10px] text-gray-500 font-medium mt-0.5">{activity.fechaProgramada || 'Sin fecha asignada'}</p>
                    </div>

                    <span className={`text-[10px] font-black uppercase tracking-tighter px-3 py-1 rounded-full flex-shrink-0 ${priority.bg} ${priority.text}`}>
                      {priority.label}
                    </span>
                  </motion.div>
                );
              })
            ) : (
              <div className="text-center py-20 glass bg-white/5 border-dashed border-white/10 rounded-[32px]">
                <p className="text-sm font-medium text-gray-500">Nada que mostrar en esta lista</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <div className="md:hidden fixed bottom-28 left-0 right-0 px-6 z-30 pointer-events-none">
        <button
          onClick={() => addActivity({ titulo: 'Nuevo pendiente', descripcion: undefined, title: 'Nuevo pendiente', description: undefined, priority: 'medium', origen: 'actividades' })}
          className="w-full py-4 glass-card border-none bg-uzala-purple text-white text-sm font-black uppercase tracking-widest shadow-2xl shadow-uzala-purple/40 pointer-events-auto active:scale-95 transition-transform"
        >
          + Agregar pendiente
        </button>
      </div>

      <div className="hidden md:block text-center py-10">
        <button
          onClick={() => addActivity({ titulo: 'Nuevo pendiente', descripcion: undefined, title: 'Nuevo pendiente', description: undefined, priority: 'medium', origen: 'actividades' })}
          className="text-xs font-black uppercase tracking-[0.2em] text-uzala-purple hover:text-white transition-colors"
        >
          + Agregar nuevo pendiente
        </button>
      </div>
    </div>
  );
}
