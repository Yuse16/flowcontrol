"use client";
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Circle, CheckCircle2, Search, Plus } from 'lucide-react';
import { useAdvancedActivities } from '@/hooks/useAdvancedActivities';
import { formatDateString } from '@/utils/date';
import { ActivityModal } from '@/components/activities/ActivityModal';
import { Activity } from '@/types/activity';
import { getCategoryColor } from '@/utils/uzalaTheme';

const MODULE_LABELS: Record<string, string> = {
  proveedores: 'Proveedores',
  surtir: 'Surtir',
  urgentes: 'Urgentes',
  vencidos: 'Vencidos',
  general: 'General',
};

const TABS = [
  { id: 'all', label: 'Todas' },
  { id: 'today', label: 'Hoy' },
  { id: 'week', label: 'Esta semana' },
  { id: 'done', label: 'Completadas' },
];

export default function ActivitiesPage() {
  const { activities, toggleCompletion, getActivitiesForDate, addActivity, updateActivity, deleteActivity } = useAdvancedActivities();
  const [activeTab, setActiveTab] = useState('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  const todayStr = formatDateString(new Date());

  const filteredActivities = useMemo(() => {
    let list = activities;

    if (activeTab === 'today') {
      list = getActivitiesForDate(new Date());
    } else if (activeTab === 'week') {
      const now = new Date();
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      list = activities.filter(a => {
        const d = new Date(a.createdAt || todayStr);
        return d >= weekStart && d <= weekEnd;
      });
    } else if (activeTab === 'done') {
      list = getActivitiesForDate(new Date()).filter(a => {
        return a.type === 'variable' ? a.isCompleted : a.completionHistory?.[todayStr];
      });
    }

    if (searchQuery) {
      list = list.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    return list;
  }, [activities, activeTab, getActivitiesForDate, searchQuery, todayStr]);

  const handleSaveActivity = (data: any) => {
    if (editingActivity) {
      updateActivity(editingActivity.id, data);
    } else {
      addActivity(data);
    }
  };

  return (
    <div className="space-y-5 max-w-lg mx-auto md:max-w-none">
      <header>
        <h1 className="text-2xl font-bold text-white">Actividades</h1>
      </header>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
        <input
          type="text"
          placeholder="Buscar actividad..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-uzala-card border border-uzala-border rounded-2xl py-3 pl-11 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-uzala-purple/30"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
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

      {/* Activity list */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity) => {
              const isDone = activity.type === 'variable'
                ? activity.isCompleted
                : activity.completionHistory?.[todayStr];
              const catColor = getCategoryColor(activity.module);

              return (
                <motion.div
                  key={activity.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 bg-uzala-card border border-uzala-border rounded-2xl p-4"
                >
                  <button
                    onClick={() => toggleCompletion(activity.id, todayStr)}
                    className="flex-shrink-0"
                  >
                    {isDone ? (
                      <CheckCircle2 size={22} className="text-uzala-purple" />
                    ) : (
                      <Circle size={22} className="text-gray-600" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0" onClick={() => { setEditingActivity(activity); setIsModalOpen(true); }}>
                    <p className={`text-sm font-medium truncate ${isDone ? 'text-gray-500 line-through' : 'text-white'}`}>
                      {activity.title}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time || '08:00'}</p>
                  </div>

                  <span
                    className="text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: `${catColor}20`,
                      color: catColor,
                    }}
                  >
                    {MODULE_LABELS[activity.module] || 'General'}
                  </span>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-16">
              <p className="text-sm text-gray-500">Sin actividades</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      <button
        onClick={() => { setEditingActivity(null); setIsModalOpen(true); }}
        className="flex md:hidden fixed bottom-28 right-4 z-30 w-12 h-12 uzala-gradient rounded-full items-center justify-center shadow-uzala-lg"
        aria-label="Nueva actividad"
      >
        <Plus size={22} className="text-white" />
      </button>

      <button
        onClick={() => { setEditingActivity(null); setIsModalOpen(true); }}
        className="hidden md:flex items-center gap-2 text-uzala-purple text-sm font-semibold mx-auto"
      >
        <Plus size={16} /> Nueva actividad
      </button>

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
