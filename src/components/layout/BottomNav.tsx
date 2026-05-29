"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, Plus, Activity, MoreHorizontal } from 'lucide-react';
import clsx from 'clsx';
import { useNavigation } from '@/context/NavigationContext';
import { useReminders } from '@/hooks/useReminders';

const navItems = [
  { icon: Home, label: 'Inicio', href: '/dashboard' },
  { icon: Calendar, label: 'Calendario', href: '/calendar' },
  { icon: Plus, label: '', href: null, isAction: true },
  { icon: Activity, label: 'Actividades', href: '/activities' },
  { icon: MoreHorizontal, label: 'Más', href: null, isMore: true },
];

export function BottomNav() {
  const pathname = usePathname();
  const { setIsMobileMenuOpen } = useNavigation();
  const { setModalOpen } = useReminders();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0F0F17]/95 backdrop-blur-xl border-t border-[#2A2A3C] safe-bottom">
      <div className="flex items-end justify-around px-2 pt-2 pb-3">
        {navItems.map((item) => {
          if (item.isAction) {
            return (
              <button
                key="add"
                onClick={() => setModalOpen(true)}
                className="flex flex-col items-center -mt-5"
              >
                <div className="w-14 h-14 uzala-gradient rounded-full flex items-center justify-center shadow-uzala-lg">
                  <Plus size={26} className="text-white" strokeWidth={2.5} />
                </div>
              </button>
            );
          }

          if (item.isMore) {
            return (
              <button
                key="more"
                onClick={() => setIsMobileMenuOpen(true)}
                className="flex flex-col items-center gap-1 px-3 py-1"
              >
                <item.icon
                  size={22}
                  className="text-gray-500"
                  strokeWidth={2}
                />
                <span className="text-[10px] font-semibold text-gray-500">{item.label}</span>
              </button>
            );
          }

          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href!}
              href={item.href!}
              className="flex flex-col items-center gap-1 px-3 py-1"
            >
              <item.icon
                size={22}
                className={clsx(
                  'transition-colors',
                  isActive ? 'text-uzala-purple' : 'text-gray-500'
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span
                className={clsx(
                  'text-[10px] font-semibold transition-colors',
                  isActive ? 'text-uzala-purple' : 'text-gray-500'
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
