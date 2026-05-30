"use client";
import { useState } from 'react';
import { useRoutes } from '@/hooks/useRoutes';
import { OperationalRoute } from '@/types/route';
import { 
  Map, 
  Search, 
  Plus, 
  ChevronRight, 
  X, 
  Trash2, 
  Bookmark,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RoutesPage() {
  const { routes, addRoute, deleteRoute, isLoaded } = useRoutes();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Modal state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Intelisis');
  const [stepsInput, setStepsInput] = useState('');

  const filteredRoutes = routes.filter(r => 
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.steps.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreateRoute = (e: React.FormEvent) => {
    e.preventDefault();
    const steps = stepsInput.split(/[>|,]/).map(s => s.trim()).filter(s => s !== '');
    addRoute({ title, description, category, steps });
    setIsModalOpen(false);
    // Reset
    setTitle('');
    setDescription('');
    setCategory('Intelisis');
    setStepsInput('');
  };

  if (!isLoaded) {
    return <div className="h-full flex items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div></div>;
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6 pb-10">
      {/* Header - Minimalist */}
      <div className="flex justify-between items-end mb-8">
        <div className="space-y-1">
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#6366f1]">Biblioteca</p>
          <h1 className="text-3xl font-bold text-[#111827] dark:text-white tracking-tight">Rutas Operativas</h1>
          <p className="text-[13px] text-gray-400 font-medium">Flujos de navegación para Intelisis y otros sistemas.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#6366f1] text-white px-5 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all shadow-sm shadow-[#6366f1]/20 hover:scale-105"
        >
          <Plus size={16} strokeWidth={3} />
          <span>Nueva Ruta</span>
        </button>
      </div>

      {/* Search Bar - Minimalist */}
      <div className="relative w-full max-w-2xl group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
        <input 
          type="text"
          placeholder="Buscar rutas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-6 py-2.5 bg-white dark:bg-[#171717] border border-[#f3f4f6] dark:border-[#262626] rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/5 transition-all shadow-sm"
        />
      </div>

      {/* Routes Grid - Minimalist Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredRoutes.map((route, idx) => (
            <motion.div
              key={route.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-white dark:bg-[#171717] p-5 rounded-2xl border border-gray-100 dark:border-[#1f1f1f] shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[8px] uppercase font-bold tracking-widest text-[#6366f1] px-1.5 py-0.5 bg-[#6366f1]/5 rounded border border-[#6366f1]/10">
                      {route.category}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#111827] dark:text-white group-hover:text-[#6366f1] transition-colors">{route.title}</h3>
                  <p className="text-[12px] text-gray-400 mt-1 line-clamp-1">{route.description}</p>
                </div>
                <button 
                  onClick={() => deleteRoute(route.id)}
                  className="p-1.5 text-gray-200 hover:text-red-400 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Steps Visualizer - Compact */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {route.steps.map((step, sIdx) => (
                  <div key={sIdx} className="flex items-center">
                    <div className="flex items-center gap-2 px-2.5 py-1 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-white/5">
                      <span className="text-[11px] font-medium text-gray-600 dark:text-gray-300">{step}</span>
                    </div>
                    {sIdx < route.steps.length - 1 && (
                      <ChevronRight size={12} className="mx-1 text-gray-300" />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredRoutes.length === 0 && (
          <div className="col-span-full py-16 text-center bg-gray-50 dark:bg-[#171717] rounded-3xl border border-dashed border-gray-100 dark:border-white/10">
            <BookOpen size={32} className="mx-auto text-gray-200 mb-3" />
            <p className="text-[13px] font-medium text-gray-400">No hay rutas registradas.</p>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#0f1115] border border-white/10 rounded-3xl p-8 w-full max-w-lg relative shadow-2xl"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <h2 className="text-2xl font-bold text-white mb-2">Nueva Ruta Operativa</h2>
              <p className="text-gray-400 mb-8">Documenta un proceso paso a paso para que nadie lo olvide.</p>

              <form onSubmit={handleCreateRoute} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">Título de la Ruta</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Ej: Ver días de entrega"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">Descripción corta</label>
                  <textarea 
                    rows={2}
                    placeholder="¿Para qué sirve esta ruta?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">Sistema / Categoría</label>
                    <select 
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary transition-all appearance-none"
                    >
                      <option value="Intelisis">Intelisis</option>
                      <option value="Excel">Excel</option>
                      <option value="Web">Web Externo</option>
                      <option value="Admin">Administración</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">Pasos (Separados por &quot;&gt;&quot;)</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Ej: Reportes > Otros > Operación"
                    value={stepsInput}
                    onChange={(e) => setStepsInput(e.target.value)}
                    className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-primary transition-all"
                  />
                  <p className="text-[10px] text-gray-500 mt-2">Puedes usar &quot;&gt;&quot;, coma o barra para separar los pasos.</p>
                </div>

                <div className="pt-4 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold transition-all shadow-lg shadow-primary/20"
                  >
                    Guardar Ruta
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
