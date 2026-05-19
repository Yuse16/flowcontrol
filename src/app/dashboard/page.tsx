"use client";
import { useTodos } from '@/hooks/useTodos';
import { useCalendarTasks } from '@/hooks/useCalendarTasks';
import { useAuth } from '@/context/AuthContext';
import { StatWidget } from '@/components/dashboard/StatWidget';
import { WeeklyProgressChart } from '@/components/dashboard/WeeklyProgressChart';
import { UrgentTasksWidget } from '@/components/dashboard/UrgentTasksWidget';
import { TodayActivitiesWidget } from '@/components/dashboard/TodayActivitiesWidget';
import { RecentActivityFeed } from '@/components/dashboard/RecentActivityFeed';
import { motion } from 'framer-motion';
import { CheckSquare, Activity, Star, Zap } from 'lucide-react';

export default function DashboardPage() {
  const { tasks: todos, getProgress: getTodoProgress, isLoaded: todosLoaded } = useTodos();
  const { tasks: calTasks, isLoaded: calLoaded } = useCalendarTasks();
  const { currentUser } = useAuth();

  if (!todosLoaded || !calLoaded) {
    return <div className="h-full flex items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div></div>;
  }

  const totalCompletedTodos = todos.filter(t => t.status === 'completed').length;
  const urgentCount = todos.filter(t => (t.priority === 'urgent' || t.status === 'delayed') && t.status !== 'completed').length;
  const favoriteCount = todos.filter(t => t.isFavorite).length;
  
  // Datos limpios iniciados en 0
  const weeklyData = [0, 0, 0, 0, 0, 0, 0];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 pb-6 overflow-x-hidden p-8 bg-[#fcfcfc] dark:bg-[#0a0a0a] min-h-screen"
    >
      <header className="space-y-1">
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#6366f1]">Overview</p>
        <h1 className="text-3xl font-bold text-[#111827] dark:text-white tracking-tight">Hola, {currentUser.name.split(' ')[0]}</h1>
        <p className="text-[13px] text-gray-400 font-medium">Aquí está tu resumen de productividad para hoy.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={itemVariants}>
          <StatWidget 
            title="Progreso" 
            value={`${getTodoProgress()}%`} 
            trend="+5% hoy" 
            trendUp={true} 
            icon={<CheckSquare size={18} />} 
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatWidget 
            title="Actividades" 
            value={totalCompletedTodos + calTasks.filter(t=>t.completed).length} 
            trend="Consistente" 
            trendUp={true} 
            icon={<Activity size={18} />} 
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatWidget 
            title="Favoritos" 
            value={favoriteCount} 
            trend="Foco" 
            trendUp={true} 
            icon={<Star size={18} />} 
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatWidget 
            title="Eficiencia" 
            value="Alta" 
            trend="Optimizado" 
            trendUp={true} 
            icon={<Zap size={18} />} 
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <WeeklyProgressChart data={weeklyData} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <UrgentTasksWidget tasks={todos} />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div variants={itemVariants}>
          <TodayActivitiesWidget tasks={calTasks} />
        </motion.div>
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <RecentActivityFeed todos={todos} calendarTasks={calTasks} />
        </motion.div>
      </div>
    </motion.div>
  );
}
