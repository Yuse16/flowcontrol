"use client";
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle2, ClipboardList, Bell, Package, Truck, FileText, Plus } from 'lucide-react';

const options = [
  {
    key: 'actividad',
    label: 'Actividad',
    icon: CheckCircle2,
    color: 'text-uzala-purple',
    bg: 'bg-uzala-purple/10',
    glow: 'shadow-uzala-purple/20',
  },
  {
    key: 'pendiente',
    label: 'Pendiente',
    icon: ClipboardList,
    color: 'text-uzala-teal',
    bg: 'bg-uzala-teal/10',
    glow: 'shadow-uzala-teal/20',
  },
  {
    key: 'recordatorio',
    label: 'Recordatorio',
    icon: Bell,
    color: 'text-uzala-orange',
    bg: 'bg-uzala-orange/10',
    glow: 'shadow-uzala-orange/20',
  },
  {
    key: 'por_surtir',
    label: 'Por surtir',
    icon: Package,
    color: 'text-uzala-blue',
    bg: 'bg-uzala-blue/10',
    glow: 'shadow-uzala-blue/20',
  },
  {
    key: 'proveedor',
    label: 'Proveedor',
    icon: Truck,
    color: 'text-uzala-cyan',
    bg: 'bg-uzala-cyan/10',
    glow: 'shadow-uzala-cyan/20',
  },
  {
    key: 'nota',
    label: 'Nota',
    icon: FileText,
    color: 'text-green-400',
    bg: 'bg-green-400/10',
    glow: 'shadow-green-400/20',
  },
] as const;

interface QuickAddMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (option: typeof options[number]['key']) => void;
}

export function QuickAddMenu({ isOpen, onClose, onSelect }: QuickAddMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center">
          {/* Backdrop - now fills the screen but within the same wrapper */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
          />

          {/* Menu Container */}
          <div className="relative w-full h-full flex flex-col items-center justify-end px-6 pb-24 pointer-events-none">
            <div className="w-full max-w-xs flex flex-col gap-3 pointer-events-auto">
              {options.map((option, idx) => {
                const Icon = option.icon;
                return (
                  <motion.button
                    key={option.key}
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0, 
                      scale: 1,
                      transition: { 
                        delay: (options.length - 1 - idx) * 0.04, 
                        type: 'spring', 
                        damping: 20, 
                        stiffness: 300 
                      }
                    }}
                    exit={{ 
                      opacity: 0, 
                      y: 10, 
                      scale: 0.95,
                      transition: { delay: idx * 0.02, duration: 0.15 }
                    }}
                    onClick={() => onSelect(option.key)}
                    className="flex items-center gap-4 p-2 pl-3 rounded-[24px] glass-card border-white/10 shadow-xl group active:scale-95 transition-all"
                  >
                    <div className={`w-12 h-12 rounded-2xl ${option.bg} flex items-center justify-center ${option.color} ${option.glow} shadow-lg transition-transform group-hover:scale-110`}>
                      <Icon size={24} />
                    </div>
                    <span className="text-base font-bold text-white tracking-tight">{option.label}</span>
                    <div className="ml-auto mr-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Plus size={16} className="text-gray-500" />
                    </div>
                  </motion.button>
                );
              })}
              
              {/* Close Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2 }}
                onClick={onClose}
                className="mt-2 self-center w-12 h-12 rounded-full glass border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
