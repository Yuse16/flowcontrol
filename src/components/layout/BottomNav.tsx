"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Calendar, Plus, Activity, MoreHorizontal } from 'lucide-react';
import clsx from 'clsx';
import { useNavigation } from '@/context/NavigationContext';
import { useQuickAdd } from '@/context/QuickAddContext';

const navItems = [
  { icon: Home, label: 'Inicio', href: '/dashboard' },
  { icon: Calendar, label: 'Calendario', href: '/calendar' },
  { icon: Plus, label: '', href: null, isAction: true },
  { icon: Activity, label: 'Actividades', href: '/activities' },
  { icon: MoreHorizontal, label: 'Más', href: null, isMore: true },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { setIsMobileMenuOpen } = useNavigation();
  const { openMenu } = useQuickAdd();

  const handleActiveNavClick = (href: string | null) => {
    if (!href) return;
    if (href === '/calendar' && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('calendar-nav-click'));
    }
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[100] glass border-t border-white/5 safe-bottom rounded-t-[32px] shadow-[0_-8px_40px_rgba(0,0,0,0.5)]">
      <div className="flex items-end justify-around px-2 pt-3 pb-3">
        {navItems.map((item) => {
          if (item.isAction) {
            return (
              <button
                key="add"
                onClick={() => openMenu()}
                className="flex flex-col items-center -mt-6 active:scale-90 transition-transform"
              >
                <div className="w-16 h-16 uzala-gradient rounded-full flex items-center justify-center shadow-xl shadow-uzala-purple/40 border-4 border-[#05000A]">
                  <Plus size={30} className="text-white" strokeWidth={3} />
                </div>
              </button>
            );
          }

          if (item.isMore) {
            return (
              <button
                key="more"
                onClick={() => setIsMobileMenuOpen(true)}
                className="flex flex-col items-center gap-1.5 px-3 py-1 active:scale-95 transition-all"
              >
                <item.icon
                  size={24}
                  className="text-gray-500"
                  strokeWidth={2}
                />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">MÁS</span>
              </button>
            );
          }

          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href || item.label}
              href={item.href || '#'}
              onClick={(e) => {
                if (isActive && item.href) {
                  e.preventDefault();
                  handleActiveNavClick(item.href);
                }
              }}
              className="flex flex-col items-center gap-1.5 px-3 py-1 active:scale-95 transition-all"
            >
              <item.icon
                size={24}
                className={clsx(
                  'transition-all duration-300',
                  isActive ? 'text-uzala-purple drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]' : 'text-gray-500'
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span
                className={clsx(
                  'text-[10px] font-black uppercase tracking-widest transition-all duration-300',
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
