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
import { UzalaLogo } from '@/components/brand/UzalaLogo';

export function Sidebar() {
  const pathname = usePathname();
  const { isManager, currentUser, switchRole } = useAuth();
  const { theme, setTheme } = useTheme();
  const { isDesktopCollapsed, toggleDesktopSidebar, isMobileMenuOpen, closeMobileMenu } = useNavigation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Inicio', href: '/dashboard' },
    { icon: Calendar, label: 'Calendario', href: '/calendar' },
    { icon: CheckSquare, label: 'Pendientes', href: '/todos' },
    { icon: Activity, label: 'Actividades', href: '/activities' },
    { icon: BookOpen, label: 'Rutas', href: '/routes' },
    { icon: ShieldAlert, label: 'Panel Gerencial', href: '/manager' },
    { icon: BarChart3, label: 'Reportes', href: '/reports' },
  ];

  const sidebarContent = (
    <>
      <div className="p-5 flex items-center justify-between">
        <Link href="/dashboard" onClick={closeMobileMenu} className="flex items-center gap-2">
          <UzalaLogo size="sm" showText />
        </Link>
        <button
          onClick={closeMobileMenu}
          className="md:hidden p-2 text-gray-400 hover:text-white transition-colors bg-white/5 rounded-lg"
        >
          <X size={18} />
        </button>
      </div>

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
                  ? "text-uzala-purple bg-uzala-purple/10 font-bold"
                  : "text-gray-400 hover:text-white hover:bg-white/5 font-medium"
              )}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} className={clsx("flex-shrink-0", isActive ? "text-uzala-purple" : "text-gray-500 group-hover:text-white")} />

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

              {isDesktopCollapsed && (
                <div className="absolute left-full ml-4 px-3 py-1.5 bg-uzala-card text-white text-[12px] font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 hidden md:block shadow-xl border border-uzala-border">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 space-y-4 border-t border-uzala-border">
        <Link
          href="/settings"
          onClick={closeMobileMenu}
          className="flex items-center gap-3.5 px-3 py-2 text-gray-400 hover:text-white transition-all text-[13px] font-medium rounded-xl hover:bg-white/5 group"
        >
          <Settings2 size={20} className="flex-shrink-0 text-gray-500 group-hover:text-white transition-colors" />
          {!isDesktopCollapsed && <span className="flex-1 whitespace-nowrap">Configuración</span>}
        </Link>

        <div className="bg-uzala-card border border-uzala-border rounded-2xl p-1.5">
          <button
            onClick={() => switchRole(isManager ? 'employee' : 'manager')}
            className="w-full flex items-center justify-center md:justify-start gap-3 p-1.5 rounded-xl hover:bg-white/5 transition-all text-left group"
          >
            <div className="w-8 h-8 rounded-full uzala-gradient flex items-center justify-center text-white font-black flex-shrink-0">
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
                  <p className="text-[13px] font-bold text-white truncate leading-tight">{currentUser.name.split(' ')[0]}</p>
                  <p className="text-[10px] text-uzala-purple font-semibold tracking-wide uppercase mt-0.5">Usuario</p>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>

        <div className={clsx("flex items-center pt-2", isDesktopCollapsed ? "justify-center flex-col gap-3" : "justify-between px-1")}>
          <div className={clsx("flex items-center", isDesktopCollapsed ? "flex-col gap-3" : "gap-2")}>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
              <LogOut size={18} />
            </button>
          </div>

          <button
            onClick={toggleDesktopSidebar}
            className={clsx(
              "hidden md:flex w-8 h-8 rounded-xl items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all",
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
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMobileMenu}
            className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{
          width: isDesktopCollapsed ? 76 : 260,
          x: 0
        }}
        className={clsx(
          "h-full bg-[#0F0F17] border-r border-uzala-border flex-col relative z-50 transition-colors",
          "hidden md:flex",
          isMobileMenuOpen ? "!flex fixed left-0 top-0 bottom-0 shadow-2xl w-[280px] safe-top" : ""
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
