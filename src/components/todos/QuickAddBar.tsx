import { useState } from 'react';
import { Plus } from 'lucide-react';

export function QuickAddBar({ onAdd }: { onAdd: (title: string) => void }) {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onAdd(value.trim());
      setValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative mt-4 flex-shrink-0">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Plus className="h-5 w-5 text-gray-500" />
      </div>
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Presiona Enter para agregar una nueva tarea rápida..."
        className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:bg-white/[0.05] transition-all shadow-lg"
      />
    </form>
  );
}
