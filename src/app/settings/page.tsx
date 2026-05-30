"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeProvider';
import { User, Shield, Palette, Zap, Save, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SettingsPage() {
  const { currentUser, updateProfile } = useAuth();
  const { theme, setTheme } = useTheme();
  const [name, setName] = useState(currentUser.name);
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    setName(currentUser.name);
  }, [currentUser.name]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    updateProfile(trimmed);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col space-y-6 pb-10">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-white">Configuración</h1>
        <p className="text-gray-400 mt-1">Personaliza tu perfil y preferencias de sistema.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Section */}
        <div className="lg:col-span-2 space-y-6">
          <section className="glass-card rounded-3xl p-8 border border-white/5 relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
            
            <div className="flex items-center gap-3 mb-8 relative z-10">
              <div className="p-2.5 bg-primary/20 rounded-xl text-primary">
                <User size={20} />
              </div>
              <h2 className="text-xl font-bold text-white">Perfil de Usuario</h2>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Nombre Completo</label>
                  <input 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-5 py-3.5 bg-black/40 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    placeholder="Escribe tu nombre..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Correo Electrónico</label>
                  <input 
                    disabled
                    type="email"
                    value={currentUser.email}
                    className="w-full px-5 py-3.5 bg-white/[0.02] border border-white/5 rounded-2xl text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Rol del Sistema</label>
                  <div className="flex items-center gap-3 px-5 py-3.5 bg-white/[0.02] border border-white/5 rounded-2xl text-gray-400">
                    <Shield size={18} className="text-primary" />
                    <span className="capitalize">{currentUser.role === 'manager' ? 'Gerente / Administrador' : 'Empleado'}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Departamento</label>
                  <div className="px-5 py-3.5 bg-white/[0.02] border border-white/5 rounded-2xl text-gray-400">
                    {currentUser.department}
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <button 
                  type="submit"
                  className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-8 py-3.5 rounded-2xl font-bold transition-all shadow-lg shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Save size={20} />
                  Guardar Cambios
                </button>

                <AnimatePresence>
                  {showSaved && (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 text-green-500 font-medium"
                    >
                      <CheckCircle size={18} />
                      <span>¡Perfil actualizado!</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </section>

          {/* Theme Section */}
          <section className="glass-card rounded-3xl p-8 border border-white/5">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-purple-500/20 rounded-xl text-purple-400">
                <Palette size={20} />
              </div>
              <h2 className="text-xl font-bold text-white">Personalización</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                onClick={() => setTheme('dark')}
                className={`flex flex-col items-center justify-center gap-4 p-8 rounded-3xl border-2 transition-all ${
                  theme === 'dark' 
                    ? 'bg-primary/10 border-primary' 
                    : 'bg-black/40 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="w-16 h-16 bg-black border border-white/10 rounded-2xl flex items-center justify-center text-primary shadow-xl">
                  <div className="w-8 h-2 bg-primary rounded-full" />
                </div>
                <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-500'}`}>Modo Oscuro</span>
              </button>

              <button 
                onClick={() => setTheme('light')}
                className={`flex flex-col items-center justify-center gap-4 p-8 rounded-3xl border-2 transition-all ${
                  theme === 'light' 
                    ? 'bg-primary/10 border-primary' 
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="w-16 h-16 bg-white border border-gray-200 rounded-2xl flex items-center justify-center text-primary shadow-xl">
                  <div className="w-8 h-2 bg-primary rounded-full" />
                </div>
                <span className={`font-bold ${theme === 'light' ? 'text-black' : 'text-gray-500'}`}>Modo Claro</span>
              </button>
            </div>
          </section>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <section className="glass-card rounded-3xl p-8 border border-white/5">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-yellow-500/20 rounded-xl text-yellow-500">
                <Zap size={20} />
              </div>
              <h2 className="text-xl font-bold text-white">Módulos Pro</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                <div>
                  <p className="text-sm font-bold text-white">FlowBot IA</p>
                  <p className="text-[10px] text-gray-500">Asistente de voz inteligente</p>
                </div>
                <div className="w-10 h-5 rounded-full bg-primary/20 relative">
                  <div className="w-3.5 h-3.5 rounded-full bg-primary absolute left-1 top-0.75" />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl opacity-50">
                <div>
                  <p className="text-sm font-bold text-white">Reportes Excel</p>
                  <p className="text-[10px] text-gray-500">Exportación automática</p>
                </div>
                <div className="w-10 h-5 rounded-full bg-white/10 relative">
                  <div className="w-3.5 h-3.5 rounded-full bg-gray-600 absolute right-1 top-0.75" />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
