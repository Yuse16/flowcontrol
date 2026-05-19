"use client";
import { useState } from 'react';
import { CalendarHeader } from '@/components/calendar/CalendarHeader';
import { MonthView } from '@/components/calendar/MonthView';
import { WeekView } from '@/components/calendar/WeekView';
import { DayView } from '@/components/calendar/DayView';
import { TaskModal } from '@/components/calendar/TaskModal';
import { useCalendarTasks } from '@/hooks/useCalendarTasks';
import { useAdvancedActivities } from '@/hooks/useAdvancedActivities';
import { CalendarViewType, CalendarTask } from '@/types/calendar';
import { PriorityLevel } from '@/types/common';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<CalendarViewType>('month');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<CalendarTask | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const { tasks, addTask, updateTask, deleteTask, toggleTaskStatus, moveTask, isLoaded } = useCalendarTasks();
  const { getActivitiesForDate, toggleCompletion: toggleAdvancedCompletion } = useAdvancedActivities();

  const advancedActivitiesForDay = getActivitiesForDate(currentDate);

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

  const handleTaskClick = (task: CalendarTask) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleOpenNewTaskModal = () => {
    setEditingTask(null);
    setSelectedDate(viewType === 'day' ? currentDate : new Date());
    setIsModalOpen(true);
  };

  const handleSaveTask = (title: string, priority: PriorityLevel, description: string) => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    if (editingTask) {
      updateTask(editingTask.id, { title, priority, description });
    } else {
      addTask({ title, date: dateStr, priority, description, completed: false });
    }
  };

  const handleDeleteTask = () => {
    if (editingTask) {
      deleteTask(editingTask.id);
    }
  };

  if (!isLoaded) {
    return <div className="h-full flex items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div></div>;
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col max-w-[1600px] mx-auto w-full pb-10 px-4">
      <CalendarHeader 
        currentDate={currentDate}
        viewType={viewType}
        onViewChange={setViewType}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
        onAddTask={handleOpenNewTaskModal}
      />

      {viewType === 'month' && (
        <MonthView 
          currentDate={currentDate} 
          tasks={tasks} 
          onDayClick={handleDayClick} 
          onTaskClick={handleTaskClick} 
          onMoveTask={moveTask}
        />
      )}
      
      {viewType === 'week' && (
        <WeekView 
          currentDate={currentDate} 
          tasks={tasks} 
          onDayClick={handleDayClick} 
          onTaskClick={handleTaskClick} 
        />
      )}
      
      {viewType === 'day' && (
        <DayView 
          currentDate={currentDate} 
          activities={advancedActivitiesForDay}
          onToggleComplete={toggleAdvancedCompletion}
        />
      )}

      <TaskModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingTask}
        selectedDate={selectedDate}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        onMove={(newDate) => editingTask && moveTask(editingTask.id, newDate)}
        onToggleStatus={() => editingTask && toggleTaskStatus(editingTask.id)}
      />
    </div>
  );
}
