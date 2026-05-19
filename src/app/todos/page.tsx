"use client";
import { useState, useMemo } from 'react';
import { useTodos } from '@/hooks/useTodos';
import { TodoHeader } from '@/components/todos/TodoHeader';
import { TodoBoard } from '@/components/todos/TodoBoard';
import { TodoDetailPanel } from '@/components/todos/TodoDetailPanel';
import { QuickAddBar } from '@/components/todos/QuickAddBar';
import { TodoTask, TodoStatus } from '@/types/todo';
import { useAdvancedActivities } from '@/hooks/useAdvancedActivities';
import { formatDateString } from '@/utils/date';

export default function TodosPage() {
  const { tasks, addTask, updateTask, deleteTask, moveTask, toggleFavorite, getProgress, isLoaded: todosLoaded } = useTodos();
  const { activities, getActivitiesForDate, toggleCompletion, isLoaded: activitiesLoaded } = useAdvancedActivities();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TodoTask | null>(null);

  const todayStr = formatDateString(new Date());
  
  // Transform today's activities into TodoTasks for display
  const todayActivitiesAsTodos = useMemo(() => {
    return getActivitiesForDate(new Date()).map(act => {
      const isDone = act.type === 'variable' ? act.isCompleted : act.completionHistory?.[todayStr];
      return {
        id: act.id,
        title: `[Actividad] ${act.title}`,
        description: `Módulo: ${act.module}`,
        status: isDone ? 'completed' : 'pending',
        priority: 'high',
        categoryIds: [],
        isFavorite: false,
        createdAt: act.createdAt || new Date().toISOString(),
        isActivity: true // Flag to handle completion differently
      } as TodoTask & { isActivity: boolean };
    });
  }, [activities, getActivitiesForDate, todayStr]);

  const allMergedTasks = useMemo(() => {
    return [...tasks, ...todayActivitiesAsTodos];
  }, [tasks, todayActivitiesAsTodos]);

  const filteredTasks = useMemo(() => {
    return allMergedTasks.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFav = showFavoritesOnly ? t.isFavorite : true;
      return matchesSearch && matchesFav;
    });
  }, [allMergedTasks, searchQuery, showFavoritesOnly]);

  const handleTaskClick = (task: TodoTask) => {
    if ((task as any).isActivity) {
       // Si es una actividad, redirigir o manejar el toggle directamente
       toggleCompletion(task.id, todayStr);
    } else {
       setSelectedTask(task);
    }
  };

  if (!todosLoaded || !activitiesLoaded) {
    return <div className="h-full flex items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div></div>;
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-screen bg-[#f9fafb] dark:bg-[#0a0a0a] p-8 space-y-8" data-design-id="todos-page">
      
      {/* HEADER SECTION - Same Premium Style */}
      <div className="space-y-2">
        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#6366f1]">Gestión de Tareas</p>
        <h1 className="text-5xl font-black text-[#111827] dark:text-white tracking-tight">Pendientes</h1>
        <p className="text-base text-gray-500 font-medium">Gestiona tus tareas personales y actividades del día en un solo lugar.</p>
      </div>

      <TodoHeader 
        progress={getProgress()}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showFavoritesOnly={showFavoritesOnly}
        setShowFavoritesOnly={setShowFavoritesOnly}
      />
      
      <div className="flex-1 flex flex-col min-h-0 relative">
        <TodoBoard 
          tasks={filteredTasks}
          onTaskClick={handleTaskClick}
          onToggleFavorite={toggleFavorite}
          onMoveTask={(id, status) => {
            // Only move if it's not an activity (activities have fixed status logic for now)
            const task = tasks.find(t => t.id === id);
            if (task) moveTask(id, status);
          }}
          onQuickAdd={(status) => addTask("Nueva Tarea", status)}
        />
        <QuickAddBar onAdd={(title) => addTask(title, 'pending')} />
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
