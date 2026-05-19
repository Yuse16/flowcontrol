"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Circle, CheckCircle2, Search, Filter, 
  ArrowUp, ArrowDown, MoreVertical, Plus,
  Activity as ActivityIcon, Clock, ListTodo, 
  CheckCircle, ChevronDown, ListFilter, SlidersHorizontal
} from 'lucide-react';
import { useAdvancedActivities } from '@/hooks/useAdvancedActivities';
import { formatDateString } from '@/utils/date';
import { ActivityModal } from '@/components/activities/ActivityModal';
import { Activity } from '@/types/activity';

export default function ActivitiesPage() {
  const { activities, toggleCompletion, getActivitiesForDate, addActivity, updateActivity, deleteActivity } = useAdvancedActivities();
  const [activeTab, setActiveTab] = useState('todo');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  const todayStr = formatDateString(new Date());

  const todayActivities = getActivitiesForDate(new Date());

  const filteredActivities = todayActivities.filter(a => {
    const isDone = a.type === 'variable' ? a.isCompleted : a.completionHistory?.[todayStr];
    if (activeTab === 'todo') return !isDone;
    if (activeTab === 'done') return isDone;
    return true;
  });

  const pendingCount = todayActivities.filter(a => !(a.type === 'variable' ? a.isCompleted : a.completionHistory?.[todayStr])).length;
  const completedCount = todayActivities.length - pendingCount;
  const progress = todayActivities.length > 0 ? (completedCount / todayActivities.length) * 100 : 0;

  const handleOpenNewModal = () => {
    setEditingActivity(null);
    setIsModalOpen(true);
  };

  const handleEditActivity = (activity: Activity) => {
    setEditingActivity(activity);
    setIsModalOpen(true);
  };

  const handleSaveActivity = (data: any) => {
    if (editingActivity) {
      updateActivity(editingActivity.id, data);
    } else {
      addActivity(data);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] dark:bg-[#0a0a0a] p-8 space-y-6" data-design-id="activities-page">
      
      {/* HEADER SECTION - Minimalist */}
      <div className="space-y-1">
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#6366f1]">Mi Jornada</p>
        <h1 className="text-3xl font-bold text-[#111827] dark:text-white tracking-tight">Actividades</h1>
        <p className="text-[13px] text-gray-400 font-medium">Gestión diaria de tareas y rutinas.</p>
      </div>

      {/* SUB SEARCH BAR - Smaller */}
      <div className="relative group w-full max-w-2xl" data-design-id="activities-search">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="text-gray-300" size={16} />
        </div>
        <input 
          type="text"
          placeholder="Buscar actividad..."
          className="w-full bg-white dark:bg-[#171717] border border-[#f3f4f6] dark:border-[#262626] rounded-xl py-2.5 pl-12 pr-4 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/5 transition-all shadow-sm"
        />
      </div>

      {/* STAT CARDS - Smaller & Elegant */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-design-id="stats-container">
        {/* Progress Card */}
        <div className="bg-white dark:bg-[#171717] border border-[#f3f4f6] dark:border-[#262626] rounded-2xl p-5 shadow-sm" data-design-id="stat-progress">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#6366f1]/5 text-[#6366f1] rounded-xl flex items-center justify-center">
              <ActivityIcon size={20} />
            </div>
            <div>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Progreso</p>
              <h3 className="text-xl font-bold text-[#111827] dark:text-white leading-tight">{Math.round(progress)}%</h3>
            </div>
          </div>
          <div className="w-full h-1.5 bg-gray-50 dark:bg-white/5 rounded-full overflow-hidden mt-4">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-[#6366f1] rounded-full"
            />
          </div>
        </div>

        {/* Pending Card */}
        <div className="bg-white dark:bg-[#171717] border border-[#f3f4f6] dark:border-[#262626] rounded-2xl p-5 shadow-sm flex items-center gap-3" data-design-id="stat-pending">
          <div className="w-10 h-10 bg-blue-50/5 text-blue-500 rounded-xl flex items-center justify-center">
            <ListTodo size={20} />
          </div>
          <div>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Pendientes</p>
            <h3 className="text-xl font-bold text-[#111827] dark:text-white leading-tight">{pendingCount}</h3>
          </div>
        </div>

        {/* Completed Card */}
        <div className="bg-white dark:bg-[#171717] border border-[#f3f4f6] dark:border-[#262626] rounded-2xl p-5 shadow-sm flex items-center gap-3" data-design-id="stat-completed">
          <div className="w-10 h-10 bg-green-50/5 text-green-500 rounded-xl flex items-center justify-center">
            <CheckCircle size={20} />
          </div>
          <div>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Completas</p>
            <h3 className="text-xl font-bold text-[#111827] dark:text-white leading-tight">{completedCount}</h3>
          </div>
        </div>
      </div>

      {/* TABS AND FILTERS BAR - Minimalist */}
      <div className="flex justify-between items-center border-b border-[#f3f4f6] dark:border-[#1f1f1f]" data-design-id="tabs-section">
        <div className="flex gap-8">
          {['todo', 'done', 'all'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-1 text-[13px] font-semibold transition-all relative ${
                activeTab === tab ? 'text-[#6366f1]' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab === 'todo' ? 'Pendientes' : tab === 'done' ? 'Listo' : 'Todo'}
              {activeTab === tab && (
                <motion.div layoutId="activeTabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6366f1] rounded-full" />
              )}
            </button>
          ))}
        </div>
        <div className="flex gap-2 pb-3">
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#f3f4f6] rounded-lg text-[10px] font-bold text-gray-400">
            <Filter size={12} /> Filtrar
          </button>
        </div>
      </div>

      {/* ACTIVITY LIST - Minimalist Rows */}
      <div className="space-y-1" data-design-id="activity-list">
        <AnimatePresence mode="popLayout">
          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity, idx) => {
              const isDone = activity.type === 'variable' ? activity.isCompleted : activity.completionHistory?.[todayStr];
              return (
                <motion.div
                  key={activity.id}
                  layout
                  className="flex items-center gap-4 py-3 px-3 hover:bg-gray-50/50 dark:hover:bg-white/[0.01] rounded-xl transition-all border-b border-[#fcfcfc] dark:border-[#121212]"
                >
                  <button 
                    onClick={() => toggleCompletion(activity.id, todayStr)}
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                      isDone ? 'bg-[#6366f1] border-[#6366f1] text-white' : 'border-gray-200 dark:border-[#333]'
                    }`}
                  >
                    {isDone && <CheckCircle2 size={12} strokeWidth={3} />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <h4 className={`text-[13px] font-medium ${isDone ? 'text-gray-300 line-through' : 'text-[#111827] dark:text-white'}`}>
                      {activity.title}
                    </h4>
                  </div>

                  <span className="px-2 py-0.5 bg-gray-50 text-gray-400 text-[9px] font-bold uppercase tracking-wider rounded-md border border-gray-100">
                    {activity.category || 'Gral'}
                  </span>

                  <div className="text-[11px] text-gray-300 font-medium min-w-[60px]">
                    {activity.time || '08:00'}
                  </div>

                  <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold ${
                    activity.priority === 'high' ? 'bg-red-50 text-red-400' : 'bg-gray-50 text-gray-400'
                  }`}>
                    {activity.priority === 'high' ? 'Alta' : 'Baja'}
                  </span>

                  <button 
                    onClick={() => handleEditActivity(activity)}
                    className="p-1 text-gray-200 hover:text-gray-400 transition-colors"
                  >
                    <MoreVertical size={14} />
                  </button>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-20 text-[11px] text-gray-300 font-bold uppercase tracking-widest">Sin tareas</div>
          )}
        </AnimatePresence>
      {/* QUICK ADD ACTION - Minimalist */}
      <div className="pt-6 flex justify-center pb-10">
        <button 
          onClick={handleOpenNewModal}
          className="flex items-center gap-2 text-[#6366f1] text-[12px] font-semibold opacity-70 hover:opacity-100 transition-all"
        >
          <Plus size={14} /> Nueva actividad
        </button>
      </div>

      <ActivityModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveActivity}
        onDelete={() => editingActivity && deleteActivity(editingActivity.id)}
        initialData={editingActivity}
      />

      </div>

    </div>
  );
}
