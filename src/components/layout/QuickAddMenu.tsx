"use client";
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle2, ClipboardList, Bell, Package, Truck, FileText } from 'lucide-react';

const options = [
  {
    key: 'actividad',
    label: 'Actividad',
    description: 'Tarea diaria o proyecto rápido.',
    icon: CheckCircle2,
    accent: 'from-uzala-purple to-uzala-blue',
  },
  {
    key: 'pendiente',
    label: 'Pendiente',
    description: 'Anota algo urgente o rápido.',
    icon: ClipboardList,
    accent: 'from-uzala-teal to-uzala-cyan',
  },
  {
    key: 'recordatorio',
    label: 'Recordatorio',
    description: 'Alerta temporal con seguimiento.',
    icon: Bell,
    accent: 'from-uzala-orange to-uzala-red',
  },
  {
    key: 'por_surtir',
    label: 'Por surtir',
    description: 'Registra lo que necesitas surtir.',
    icon: Package,
    accent: 'from-uzala-blue to-uzala-purple',
  },
  {
    key: 'proveedor',
    label: 'Proveedor',
    description: 'Nuevo proveedor o contacto de surtido.',
    icon: Truck,
    accent: 'from-uzala-cyan to-uzala-teal',
  },
  {
    key: 'nota',
    label: 'Nota',
    description: 'Guarda una referencia rápida.',
    icon: FileText,
    accent: 'from-uzala-green to-uzala-teal',
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] bg-black/65 backdrop-blur-xl flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="w-full max-w-3xl rounded-[32px] border border-white/10 bg-[#0D0D16]/95 shadow-2xl shadow-black/50 overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 pt-6 pb-3 border-b border-white/10">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-gray-400">¿Qué quieres crear?</p>
                <h2 className="mt-3 text-2xl font-black text-white">Nuevo elemento rápido</h2>
              </div>
              <button onClick={onClose} className="rounded-2xl p-3 text-gray-400 hover:text-white bg-white/5 transition">
                <X size={20} />
              </button>
            </div>

            <div className="grid gap-2 p-4 sm:grid-cols-3 lg:grid-cols-4 max-h-[calc(100vh-20vh)] overflow-y-auto">
              {options.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => onSelect(option.key)}
                    className={`group rounded-3xl border border-white/10 bg-gradient-to-br ${option.accent} p-3 text-left shadow-xl shadow-black/20 transition hover:-translate-y-0.5 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-uzala-purple/40`}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white mb-2 shadow-inner">
                      <Icon size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">{option.label}</h3>
                      <p className="mt-1 text-xs leading-4 text-white/70">{option.description}</p>
                    </div>
                    <span className="mt-3 inline-flex items-center text-[11px] font-semibold text-white/80 group-hover:text-white">
                      Crear ahora
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
