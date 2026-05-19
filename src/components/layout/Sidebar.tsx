"use client";
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Calendar, 
  CheckSquare, 
  Activity, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Map,
  BarChart3,
  LogOut,
  Sun,
  Moon,
  Users,
  Crown,
  ChevronDown,
  X,
  LayoutGrid,
  BookOpen,
  Settings2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeProvider';

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { isManager, currentUser, switchRole } = useAuth();
  const { theme, setTheme } = useTheme();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Calendar, label: 'Calendario', href: '/calendar' },
    { icon: CheckSquare, label: 'Pendientes', href: '/todos', badge: 12 },
    { icon: Activity, label: 'Actividades', href: '/activities' },
    { icon: BookOpen, label: 'Rutas', href: '/routes' },
    { icon: ShieldAlert, label: 'Panel Gerencial', href: '/manager' },
    { icon: BarChart3, label: 'Reportes', href: '/reports' },
  ];

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isCollapsed ? 70 : 'var(--sidebar-w, 240px)' }}
      className="h-full bg-white dark:bg-[#0a0a0a] border-r border-[#f3f4f6] dark:border-[#1f1f1f] flex flex-col relative z-50 transition-all duration-300"
      data-design-id="sidebar-container"
    >
      {/* LOGO - Smaller & Minimalist */}
      <div className="p-6 flex items-center gap-2.5">
        <div className="w-7 h-7 bg-[#6366f1] rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm shadow-[#6366f1]/20">
          <Activity className="text-white" size={16} />
        </div>
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-bold text-lg tracking-tight text-[#111827] dark:text-white"
            >
              Flow<span className="text-[#6366f1]">Control</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* NAVIGATION - Thinner & Clean */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={clsx(
                "flex items-center gap-3.5 px-4 py-2.5 rounded-xl transition-all duration-300 relative group",
                isActive 
                  ? "text-[#6366f1] bg-[#6366f1]/5 font-semibold" 
                  : "text-gray-400 hover:text-[#6366f1] hover:bg-gray-50/50 dark:hover:bg-white/5"
              )}
            >
              <item.icon size={18} className={clsx("flex-shrink-0", isActive ? "text-[#6366f1]" : "text-gray-400 group-hover:text-[#6366f1]")} />
              {!isCollapsed && (
                <span className="whitespace-nowrap flex-1 text-[13px]">{item.label}</span>
              )}
              {!isCollapsed && item.badge && (
                <span className="bg-[#6366f1] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* FOOTER SECTION - Minimalist */}
      <div className="p-4 space-y-4 border-t border-gray-100 dark:border-[#1f1f1f]">
        {/* Configuración */}
        <Link 
          href="/settings"
          className="flex items-center gap-3.5 px-4 py-2 text-gray-400 hover:text-[#6366f1] transition-all text-[13px] font-medium"
        >
          <Settings2 size={18} />
          {!isCollapsed && <span className="flex-1">Ajustes</span>}
        </Link>

        {/* User Profile - Smaller & Minimalist */}
        <div className="bg-gray-50/50 dark:bg-[#171717] border border-gray-100 dark:border-[#262626] rounded-2xl p-1.5 shadow-sm">
          <button 
            onClick={() => switchRole(isManager ? 'employee' : 'manager')}
            className="w-full flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-white dark:hover:bg-black transition-all text-left"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center text-white font-black flex-shrink-0">
              {currentUser.name.charAt(0)}
            </div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-bold text-[#111827] dark:text-white truncate leading-tight">{currentUser.name.split(' ')[0]}</p>
                <p className="text-[9px] text-[#6366f1]/70 font-medium">Gerente</p>
              </div>
            )}
            {!isCollapsed && <ChevronDown size={14} className="text-gray-300" />}
          </button>
        </div>

        {/* Premium Banner - Smaller & Cleaner */}
        {!isCollapsed && (
          <div className="p-4 bg-[#f5f3ff] border border-[#ddd6fe] rounded-2xl relative group">
            <div className="flex items-center gap-2 text-[#6366f1] mb-1">
              <Crown size={12} fill="currentColor" />
              <span className="text-[9px] font-black uppercase tracking-widest">Premium</span>
            </div>
            <p className="text-[9px] text-gray-500 mb-2 font-medium">Plan activo</p>
          </div>
        )}

        {/* System Buttons - Minimalist Icons */}
        <div className="flex items-center justify-between px-2 pt-1">
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-[#6366f1] hover:bg-gray-100 transition-all"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-500 transition-all">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </motion.aside>
  );
}
