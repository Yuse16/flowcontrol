import { TodoTask, TodoStatus } from '@/types/todo';
import { TodoCard } from './TodoCard';
import { Plus } from 'lucide-react';

interface TodoBoardProps {
  tasks: TodoTask[];
  onTaskClick: (t: TodoTask) => void;
  onToggleFavorite: (id: string) => void;
  onMoveTask: (id: string, status: TodoStatus) => void;
  onQuickAdd: (status: TodoStatus) => void;
}

export function TodoBoard({ tasks, onTaskClick, onToggleFavorite, onMoveTask, onQuickAdd }: TodoBoardProps) {
  const columns: { id: TodoStatus; title: string; color: string }[] = [
    { id: 'pending', title: 'Pendiente', color: 'bg-gray-500' },
    { id: 'in_progress', title: 'En Progreso', color: 'bg-blue-500' },
    { id: 'completed', title: 'Completado', color: 'bg-green-500' },
    { id: 'delayed', title: 'Retrasada', color: 'bg-red-500' },
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necesario para permitir soltar
  };

  const handleDrop = (e: React.DragEvent, status: TodoStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      onMoveTask(taskId, status);
    }
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 flex-1 items-start" data-design-id="todo-board-minimal">
      {columns.map(col => {
        const colTasks = tasks.filter(t => t.status === col.id);
        return (
          <div 
            key={col.id} 
            className="flex-1 min-w-[260px] flex flex-col bg-gray-50/30 dark:bg-white/[0.01] rounded-2xl border border-gray-100 dark:border-[#1f1f1f] max-h-full"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
          >
            <div className="px-4 py-3 border-b border-gray-100 dark:border-[#1f1f1f] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${col.color}`} />
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-400">{col.title}</h3>
                <span className="text-[9px] bg-gray-100 dark:bg-white/5 px-1.5 py-0.5 rounded-md text-gray-400">{colTasks.length}</span>
              </div>
              <button 
                onClick={() => onQuickAdd(col.id)}
                className="text-gray-300 hover:text-primary transition-all"
              >
                <Plus size={14} />
              </button>
            </div>
            
            <div className="flex-1 p-3 space-y-2 overflow-y-auto custom-scrollbar h-full min-h-[150px]">
              {colTasks.map(task => (
                <TodoCard 
                  key={task.id} 
                  task={task} 
                  onClick={() => onTaskClick(task)}
                  onToggleFavorite={(e) => { e.stopPropagation(); onToggleFavorite(task.id); }}
                  onDragStart={(e) => e.dataTransfer.setData('taskId', task.id)}
                />
              ))}
              {colTasks.length === 0 && (
                <div className="h-16 border border-dashed border-gray-200 dark:border-white/5 rounded-xl flex items-center justify-center text-gray-300 text-[10px] font-medium italic">
                  Vacio
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
