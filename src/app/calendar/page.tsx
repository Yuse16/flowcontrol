"use client";
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useQuickAdd } from '@/context/QuickAddContext';
import { CalendarHeader } from '@/components/calendar/CalendarHeader';
import { MonthView } from '@/components/calendar/MonthView';
import { WeekView } from '@/components/calendar/WeekView';
import { DayView } from '@/components/calendar/DayView';
import { TaskModal } from '@/components/calendar/TaskModal';
import { useAdvancedActivities } from '@/hooks/useAdvancedActivities';
import { CalendarViewType } from '@/types/calendar';
import { PriorityLevel } from '@/types/common';
import { Activity } from '@/types/activity';
import { formatDateString } from '@/utils/date';

export default function CalendarPage() {
  const pathname = usePathname();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<CalendarViewType>('month');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const { activities, addActivity, updateActivity, deleteActivity, toggleCompletion, getCalendarActivitiesForDate, isLoaded } = useAdvancedActivities();
  const { openMenu } = useQuickAdd();
  const router = useRouter();

  useEffect(() => {
    if (pathname === '/calendar') {
      setViewType('month');
    }
  }, [pathname]);

  useEffect(() => {
    const handleCalendarNavClick = () => {
      if (viewType === 'day' || viewType === 'week') {
        setViewType('month');
        return;
      }
      if (viewType === 'month') {
        router.push('/dashboard');
      }
    };

    window.addEventListener('calendar-nav-click', handleCalendarNavClick);
    return () => window.removeEventListener('calendar-nav-click', handleCalendarNavClick);
  }, [viewType, router]);

  const activitiesForDay = getCalendarActivitiesForDate(currentDate);
  const scheduledActivities = activities.filter(a => a.fechaProgramada);

  const handleOpenQuickAdd = () => {
    openMenu({ origen: 'calendario', fechaProgramada: formatDateString(currentDate) });
  };

  const handlePrev = () => {
    const newDate = new Date(currentDate);
    if (viewType === 'month') newDate.setMonth(newDate.getMonth() - 1);
    else if (viewType === 'week') newDate.setDate(newDate.getDate() - 7);
    else newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (viewType === 'month') newDate.setMonth(newDate.getMonth() + 1);
    else if (viewType === 'week') newDate.setDate(newDate.getDate() + 7);
    else newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleDayClick = (date: Date) => {
    setCurrentDate(date);
    setViewType('day');
  };

  const handleTaskClick = (activity: Activity) => {
    setEditingActivity(activity);
    setIsModalOpen(true);
  };

  const handleSaveTask = (title: string, priority: PriorityLevel, description: string) => {
    const dateStr = formatDateString(selectedDate);
    if (editingActivity) {
      updateActivity(editingActivity.id, { titulo: title, description, title, priority, descripcion: description });
    } else {
      addActivity({
        titulo: title,
        descripcion: description,
        title,
        description,
        fechaProgramada: dateStr,
        priority,
        origen: 'calendario',
      });
    }
  };

  const handleDeleteTask = () => {
    if (editingActivity) {
      deleteActivity(editingActivity.id);
    }
  };

  const handleMoveActivity = (id: string, newDate: string) => {
    updateActivity(id, { fechaProgramada: newDate, origen: 'calendario' });
  };

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-uzala-purple border-t-transparent animate-spin"></div></div>;
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-screen flex flex-col max-w-full md:max-w-[1600px] mx-auto w-full pb-4">
      <header className="mb-4 md:hidden">
        <h1 className="text-2xl font-bold text-white">Calendario</h1>
      </header>
      <CalendarHeader 
        currentDate={currentDate}
        viewType={viewType}
        onViewChange={setViewType}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
        onAddTask={handleOpenQuickAdd}
      />

      {viewType === 'month' && (
        <MonthView 
          currentDate={currentDate} 
          activities={scheduledActivities} 
          onDayClick={handleDayClick} 
          onTaskClick={handleTaskClick} 
          onMoveTask={handleMoveActivity}
        />
      )}
      
      {viewType === 'week' && (
        <WeekView 
          currentDate={currentDate} 
          activities={scheduledActivities} 
          onDayClick={handleDayClick} 
          onTaskClick={handleTaskClick} 
        />
      )}
      
      {viewType === 'day' && (
        <DayView 
          currentDate={currentDate} 
          activities={activitiesForDay}
          onToggleComplete={toggleCompletion}
        />
      )}

      <TaskModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingActivity}
        selectedDate={selectedDate}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        onMove={(newDate) => editingActivity && handleMoveActivity(editingActivity.id, newDate)}
        onToggleStatus={() => {
          if (editingActivity) {
            toggleCompletion(editingActivity.id);
            setEditingActivity(prev => prev ? { ...prev, estado: prev.estado === 'completado' ? 'pendiente' : 'completado' } : null);
          }
        }}
      />
    </div>
  );
}
