import React from 'react';
import { TodoTask } from '@/types/todo';
import { Star, GripVertical, AlertCircle } from 'lucide-react';

interface TodoCardProps {
  task: TodoTask;
  onClick: () => void;
  onToggleFavorite: (e: React.MouseEvent) => void;
  onDragStart: (e: React.DragEvent) => void;
}

export const TodoCard = React.memo(function TodoCard({ task, onClick, onToggleFavorite, onDragStart }: TodoCardProps) {
  const priorityColors = {
    low: 'bg-green-500',
    medium: 'bg-blue-500',
    high: 'bg-orange-500',
    urgent: 'bg-red-500'
  };

  // Obtenemos el color hexadecimal para el borde (Tailwind CSS colors fallback if CSS vars don't map directly)
  const hexColors = {
    low: '#22c55e',
    medium: '#3b82f6',
    high: '#f97316',
    urgent: '#ef4444'
  };

  return (
    <div 
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
      className={`group relative bg-white dark:bg-[#1a1a1a] p-3 rounded-xl cursor-grab active:cursor-grabbing border border-gray-100 dark:border-white/[0.05] transition-all hover:border-primary/30 shadow-sm ${task.status === 'completed' ? 'opacity-50' : ''}`}
    >
      <div className={`absolute top-0 left-0 w-1 h-full rounded-l-xl ${priorityColors[task.priority]}`} />
      
      <div className="flex justify-between items-start gap-2">
        <h4 className={`font-bold text-[13px] leading-tight mb-1 ${task.status === 'completed' ? 'line-through text-gray-400 font-medium' : 'text-[#111827] dark:text-white'}`}>
          {task.title}
        </h4>
        <button 
          onClick={onToggleFavorite}
          className="text-gray-200 hover:text-yellow-400 transition-colors"
        >
          <Star size={14} className={task.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''} />
        </button>
      </div>
      
      {task.description && (
        <p className="text-[11px] text-gray-400 line-clamp-2 mt-1">{task.description}</p>
      )}

      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">{task.priority}</span>
        </div>
        {task.status === 'delayed' && (
          <span className="flex items-center gap-1 text-[9px] font-bold text-red-400 bg-red-50 dark:bg-red-500/5 px-1.5 py-0.5 rounded uppercase tracking-wider">
            <AlertCircle size={10} />
          </span>
        )}
      </div>
    </div>
  );
});
