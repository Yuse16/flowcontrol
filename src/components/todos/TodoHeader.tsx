import { Search, Filter, Star } from 'lucide-react';

interface TodoHeaderProps {
  progress: number;
  searchQuery: string;
  setSearchQuery: (s: string) => void;
  showFavoritesOnly: boolean;
  setShowFavoritesOnly: (v: boolean) => void;
}

export function TodoHeader({ progress, searchQuery, setSearchQuery, showFavoritesOnly, setShowFavoritesOnly }: TodoHeaderProps) {
  return (
    <div className="flex flex-col gap-4 mb-6" data-design-id="todo-header-minimal">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search & Actions - Smaller */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            <input 
              type="text" 
              placeholder="Buscar tarea..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white dark:bg-[#171717] border border-gray-100 dark:border-[#262626] rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/5 transition-all w-full md:w-64 text-foreground"
            />
          </div>
          <button 
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`p-2 rounded-xl border transition-all ${showFavoritesOnly ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500 shadow-sm shadow-yellow-500/10' : 'bg-white dark:bg-[#171717] border-gray-100 dark:border-[#262626] text-gray-300 hover:text-primary'}`}
          >
            <Star size={16} className={showFavoritesOnly ? 'fill-yellow-500' : ''} />
          </button>
        </div>

        {/* Compact Progress */}
        <div className="bg-white dark:bg-[#171717] px-4 py-2 rounded-xl border border-gray-100 dark:border-[#262626] flex items-center gap-4 min-w-[200px] shadow-sm">
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Progreso</span>
              <span className="text-[10px] font-bold text-primary">{progress}%</span>
            </div>
            <div className="h-1 w-full bg-gray-50 dark:bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-1000 ease-out" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
