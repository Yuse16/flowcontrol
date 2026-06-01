"use client";
import { createContext, useContext, useState } from 'react';
import { ActivityModal } from '@/components/activities/ActivityModal';
import { QuickAddMenu } from '@/components/layout/QuickAddMenu';
import { useAdvancedActivities } from '@/hooks/useAdvancedActivities';
import { useReminders } from '@/hooks/useReminders';
import { Activity, ActivityModule, ActivityOrigin } from '@/types/activity';

export type QuickAddOption =
  | 'actividad'
  | 'pendiente'
  | 'recordatorio'
  | 'por_surtir'
  | 'proveedor'
  | 'nota';

interface QuickAddContextType {
  openMenu: (defaultActivity?: Partial<Pick<Activity, 'origen' | 'fechaProgramada'>>) => void;
  closeMenu: () => void;
}

const QuickAddContext = createContext<QuickAddContextType | undefined>(undefined);

const optionConfig: Record<QuickAddOption, {
  heading: string;
  submitLabel: string;
  origin?: ActivityOrigin;
  module?: ActivityModule;
}> = {
  actividad: {
    heading: 'Nueva Actividad',
    submitLabel: 'Crear Actividad',
    origin: 'actividades',
  },
  pendiente: {
    heading: 'Nuevo Pendiente',
    submitLabel: 'Crear Pendiente',
    origin: 'actividades',
  },
  recordatorio: {
    heading: 'Nuevo Recordatorio',
    submitLabel: 'Crear Recordatorio',
  },
  por_surtir: {
    heading: 'Por surtir',
    submitLabel: 'Guardar por surtir',
    origin: 'actividades',
    module: 'surtir',
  },
  proveedor: {
    heading: 'Nuevo Proveedor',
    submitLabel: 'Guardar proveedor',
    origin: 'actividades',
    module: 'proveedores',
  },
  nota: {
    heading: 'Nueva Nota',
    submitLabel: 'Guardar nota',
    origin: 'actividades',
    module: 'general',
  },
};

export function QuickAddProvider({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeOption, setActiveOption] = useState<QuickAddOption | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [defaultActivityData, setDefaultActivityData] = useState<Partial<Pick<Activity, 'origen' | 'fechaProgramada'>> | null>(null);
  const { addActivity } = useAdvancedActivities();
  const { setModalOpen } = useReminders();

  const openMenu = (defaultActivity?: Partial<Pick<Activity, 'origen' | 'fechaProgramada'>>) => {
    setDefaultActivityData(defaultActivity ?? null);
    setIsMenuOpen(true);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setDefaultActivityData(null);
  };

  const closeCreate = () => {
    setIsCreateOpen(false);
    setActiveOption(null);
    setDefaultActivityData(null);
  };

  const handleOptionSelect = (option: QuickAddOption) => {
    if (option === 'recordatorio') {
      closeMenu();
      setModalOpen(true);
      return;
    }

    setActiveOption(option);
    setIsCreateOpen(true);
    setIsMenuOpen(false);
  };

  const handleSave = (data: Omit<Activity, 'id' | 'fechaCreacion' | 'estado' | 'fechaCompletado'>) => {
    if (!activeOption) return;
    const config = optionConfig[activeOption];
    addActivity({
      ...data,
      origen: data.origen ?? config.origin ?? defaultActivityData?.origen ?? 'actividades',
      module: config.module,
      fechaProgramada: data.fechaProgramada ?? defaultActivityData?.fechaProgramada,
    });
    closeCreate();
  };

  const currentOption = activeOption ? optionConfig[activeOption] : null;

  return (
    <QuickAddContext.Provider value={{ openMenu, closeMenu }}>
      {children}
      <QuickAddMenu isOpen={isMenuOpen} onClose={closeMenu} onSelect={handleOptionSelect} />
      {currentOption && (
        <ActivityModal
          isOpen={isCreateOpen}
          onClose={closeCreate}
          onSave={handleSave}
          initialData={null}
          headerTitle={currentOption.heading}
          submitLabel={currentOption.submitLabel}
          defaultOrigin={currentOption.origin ?? defaultActivityData?.origen}
          defaultFechaProgramada={defaultActivityData?.fechaProgramada}
        />
      )}
    </QuickAddContext.Provider>
  );
}

export function useQuickAdd() {
  const context = useContext(QuickAddContext);
  if (!context) {
    throw new Error('useQuickAdd must be used within a QuickAddProvider');
  }
  return context;
}
