"use client";
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Circle, CheckCircle2, MapPin } from 'lucide-react';
import { useTodos } from '@/hooks/useTodos';
import { TodoDetailPanel } from '@/components/todos/TodoDetailPanel';
import { TodoTask } from '@/types/todo';
import { useAdvancedActivities } from '@/hooks/useAdvancedActivities';
import { formatDateString } from '@/utils/date';
import { PRIORITY_STYLES } from '@/utils/uzalaTheme';

const TABS = [
  { id: 'pending', label: 'Pendientes' },
  { id: 'restock', label: 'Por surtir' },
  { id: 'completed', label: 'Completados' },
];

export default function TodosPage() {
  const { tasks, addTask, updateTask, deleteTask, toggleFavorite, isLoaded: todosLoaded } = useTodos();
  const { getActivitiesForDate, toggleCompletion, isLoaded: activitiesLoaded } = useAdvancedActivities();

  const [activeTab, setActiveTab] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState<TodoTask | null>(null);

  const todayStr = formatDateString(new Date());

  const todayActivitiesAsTodos = useMemo(() => {
    return getActivitiesForDate(new Date()).map(act => {
      const isDone = act.type === 'variable' ? act.isCompleted : act.completionHistory?.[todayStr];
      return {
        id: act.id,
        title: act.title,
        description: `Módulo: ${act.module}`,
        status: isDone ? 'completed' : 'pending',
        priority: 'high' as const,
        categoryIds: [],
        isFavorite: false,
        createdAt: act.createdAt || new Date().toISOString(),
        isActivity: true,
      } as TodoTask & { isActivity: boolean };
    });
  }, [getActivitiesForDate, todayStr]);

  const allTasks = useMemo(() => [...tasks, ...todayActivitiesAsTodos], [tasks, todayActivitiesAsTodos]);

  const filteredTasks = useMemo(() => {
    return allTasks.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());

      if (activeTab === 'pending') {
        return matchesSearch && t.status !== 'completed' && t.priority !== 'urgent';
      }
      if (activeTab === 'restock') {
        return matchesSearch && t.status !== 'completed' && (t.priority === 'urgent' || t.title.toLowerCase().includes('surtir'));
      }
      if (activeTab === 'completed') {
        return matchesSearch && t.status === 'completed';
      }
      return matchesSearch;
    });
  }, [allTasks, searchQuery, activeTab]);

  const handleTaskClick = (task: TodoTask & { isActivity?: boolean }) => {
    if (task.isActivity) {
      toggleCompletion(task.id, todayStr);
    } else {
      setSelectedTask(task);
    }
  };

  if (!todosLoaded || !activitiesLoaded) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-uzala-purple border-t-transparent animate-spin" />
      </div>
    );
  }

  const sectionTitle = activeTab === 'restock' ? 'Por surtir' : activeTab === 'completed' ? 'Completados' : 'Pendientes activos';

  return (
    <div className="space-y-5 max-w-lg mx-auto md:max-w-none">
      <header>
        <h1 className="text-2xl font-bold text-white">Pendientes</h1>
      </header>

      {/* Search */}
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

      {/* Tabs */}
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

      {/* Section */}
      <section>
        <h2 className="text-sm font-semibold text-gray-400 mb-3">{sectionTitle}</h2>

        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => {
                const isDone = task.status === 'completed';
                const priority = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.medium;
                const isRestock = activeTab === 'restock';

                return (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => handleTaskClick(task as TodoTask & { isActivity?: boolean })}
                    className="flex items-center gap-3 bg-uzala-card border border-uzala-border rounded-2xl p-4 cursor-pointer active:scale-[0.98] transition-transform"
                  >
                    <button className="flex-shrink-0" onClick={(e) => { e.stopPropagation(); handleTaskClick(task as TodoTask & { isActivity?: boolean }); }}>
                      {isDone ? (
                        <CheckCircle2 size={22} className="text-uzala-purple" />
                      ) : (
                        <Circle size={22} className="text-gray-600" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${isDone ? 'text-gray-500 line-through' : 'text-white'}`}>
                        {task.title}
                      </p>
                      {isRestock && (
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <MapPin size={10} /> Tienda Centro
                        </p>
                      )}
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

      {/* Desktop kanban fallback */}
      <div className="hidden md:block text-center py-4">
        <button
          onClick={() => addTask('Nueva tarea', 'pending')}
          className="text-sm text-uzala-purple font-semibold"
        >
          + Agregar pendiente
        </button>
      </div>

      <TodoDetailPanel
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        onUpdate={updateTask}
        onDelete={(id) => { deleteTask(id); setSelectedTask(null); }}
      />
    </div>
  );
}
