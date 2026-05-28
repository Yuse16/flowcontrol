"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Calendar, 
  CheckSquare, 
  Activity, 
  Settings2, 
  LogOut,
  Sun,
  Moon,
  Crown,
  ChevronDown,
  X,
  BookOpen,
  ShieldAlert,
  BarChart3,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeProvider';
import { useNavigation } from '@/context/NavigationContext';

export function Sidebar() {
  const pathname = usePathname();
  const { isManager, currentUser, switchRole } = useAuth();
  const { theme, setTheme } = useTheme();
  const { isDesktopCollapsed, toggleDesktopSidebar, isMobileMenuOpen, closeMobileMenu } = useNavigation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Calendar, label: 'Calendario', href: '/calendar' },
    { icon: CheckSquare, label: 'Pendientes', href: '/todos', badge: 12 },
    { icon: Activity, label: 'Actividades', href: '/activities' },
    { icon: BookOpen, label: 'Rutas', href: '/routes' },
    { icon: ShieldAlert, label: 'Panel Gerencial', href: '/manager' },
    { icon: BarChart3, label: 'Reportes', href: '/reports' },
  ];

  const sidebarContent = (
    <>
      {/* LOGO & Mobile Close Button */}
      <div className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-tr from-[#6366f1] to-[#8b5cf6] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#6366f1]/20">
            <Activity className="text-white" size={18} strokeWidth={2.5} />
          </div>
          <AnimatePresence mode="wait">
            {!isDesktopCollapsed && (
              <motion.div 
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="font-black text-lg tracking-tight text-[#111827] dark:text-white whitespace-nowrap overflow-hidden"
              >
                Flow<span className="text-[#6366f1]">Control</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Mobile Close Button */}
        <button 
          onClick={closeMobileMenu}
          className="md:hidden p-2 text-gray-400 hover:text-[#111827] dark:hover:text-white transition-colors bg-gray-50 dark:bg-white/5 rounded-lg"
        >
          <X size={18} />
        </button>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              onClick={closeMobileMenu}
              className={clsx(
                "flex items-center gap-3.5 px-3 py-2.5 rounded-xl transition-all duration-200 relative group",
                isActive 
                  ? "text-[#6366f1] bg-[#6366f1]/10 font-bold" 
                  : "text-gray-500 hover:text-[#111827] dark:text-gray-400 dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-white/5 font-medium"
              )}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} className={clsx("flex-shrink-0 transition-colors", isActive ? "text-[#6366f1]" : "text-gray-400 group-hover:text-[#111827] dark:group-hover:text-white")} />
              
              <AnimatePresence>
                {!isDesktopCollapsed && (
                  <motion.span 
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="whitespace-nowrap flex-1 text-[13px] overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {!isDesktopCollapsed && item.badge && (
                <span className="bg-[#6366f1] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm shadow-[#6366f1]/20">
                  {item.badge}
                </span>
              )}

              {/* Tooltip for collapsed desktop state */}
              {isDesktopCollapsed && (
                <div className="absolute left-full ml-4 px-3 py-1.5 bg-[#111827] dark:bg-white text-white dark:text-[#111827] text-[12px] font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 hidden md:block shadow-xl">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* FOOTER SECTION */}
      <div className="p-4 space-y-4 border-t border-gray-100 dark:border-[#1f1f1f]">
        
        {/* Settings */}
        <Link 
          href="/settings"
          onClick={closeMobileMenu}
          className="flex items-center gap-3.5 px-3 py-2 text-gray-500 hover:text-[#111827] dark:text-gray-400 dark:hover:text-white transition-all text-[13px] font-medium rounded-xl hover:bg-gray-100/50 dark:hover:bg-white/5 group"
        >
          <Settings2 size={20} className="flex-shrink-0 text-gray-400 group-hover:text-[#111827] dark:group-hover:text-white transition-colors" />
          {!isDesktopCollapsed && <span className="flex-1 whitespace-nowrap">Configuración</span>}
        </Link>

        {/* User Profile */}
        <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#262626] rounded-2xl p-1.5 shadow-sm">
          <button 
            onClick={() => switchRole(isManager ? 'employee' : 'manager')}
            className="w-full flex items-center justify-center md:justify-start gap-3 p-1.5 rounded-xl hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-all text-left group"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center text-white font-black flex-shrink-0 shadow-md">
              {currentUser.name.charAt(0)}
            </div>
            
            <AnimatePresence>
              {!isDesktopCollapsed && (
                <motion.div 
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="min-w-0 flex-1 overflow-hidden"
                >
                  <p className="text-[13px] font-bold text-[#111827] dark:text-white truncate leading-tight">{currentUser.name.split(' ')[0]}</p>
                  <p className="text-[10px] text-[#6366f1] font-semibold tracking-wide uppercase mt-0.5">Gerente</p>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* System & Toggle Buttons */}
        <div className={clsx("flex items-center pt-2", isDesktopCollapsed ? "justify-center flex-col gap-3" : "justify-between px-1")}>
          <div className={clsx("flex items-center", isDesktopCollapsed ? "flex-col gap-3" : "gap-2")}>
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-[#111827] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">
              <LogOut size={18} />
            </button>
          </div>

          {/* Desktop Collapse Toggle */}
          <button 
            onClick={toggleDesktopSidebar}
            className={clsx(
              "hidden md:flex w-8 h-8 rounded-xl items-center justify-center text-gray-400 hover:text-[#111827] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all",
              isDesktopCollapsed && "mt-2"
            )}
          >
            {isDesktopCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* MOBILE BACKDROP */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMobileMenu}
            className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR COMPONENT */}
      <motion.aside 
        initial={false}
        animate={{ 
          width: isDesktopCollapsed ? 76 : 260,
          x: 0
        }}
        className={clsx(
          "h-full bg-[#fcfcfc] dark:bg-[#0a0a0a] border-r border-gray-200 dark:border-[#1f1f1f] flex-col relative z-50 transition-colors",
          // Desktop specific
          "hidden md:flex",
          // Mobile specific override when open
          isMobileMenuOpen ? "!flex fixed inset-y-0 left-0 shadow-2xl w-[280px]" : ""
        )}
        style={{
          transform: `translateX(${(!isMobileMenuOpen && typeof window !== 'undefined' && window.innerWidth < 768) ? '-100%' : '0'})`
        }}
      >
        {sidebarContent}
      </motion.aside>
    </>
  );
}
