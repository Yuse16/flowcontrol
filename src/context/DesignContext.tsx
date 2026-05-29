"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';

interface ElementStyle {
  color?: string;
  backgroundColor?: string;
  fontSize?: string;
  fontWeight?: string;
  borderRadius?: string;
  opacity?: string;
  padding?: string;
  margin?: string;
  width?: string;
  height?: string;
  boxShadow?: string;
}

interface DesignSettings {
  global: {
    primaryColor: string;
    borderRadius: string;
    fontSizeBase: string;
    fontFamily: string;
    background: string;
  };
  overrides: Record<string, ElementStyle>;
}

interface DesignContextType {
  settings: DesignSettings;
  selectedElementId: string | null;
  setSelectedElementId: (id: string | null) => void;
  updateGlobalSettings: (newSettings: Partial<DesignSettings['global']>) => void;
  updateElementStyle: (id: string, style: Partial<ElementStyle>) => void;
  resetSettings: () => void;
}

const defaultSettings: DesignSettings = {
  global: {
    primaryColor: '#8B5CF6',
    borderRadius: '12px',
    fontSizeBase: '14px',
    fontFamily: "'Inter', sans-serif",
    background: '',
  },
  overrides: {},
};

const DesignContext = createContext<DesignContextType | undefined>(undefined);

export function DesignProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<DesignSettings>(defaultSettings);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('flowcontrol-granular-design');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading design settings", e);
      }
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Apply Global CSS variables
    root.style.setProperty('--primary-hex', settings.global.primaryColor);
    root.style.setProperty('--radius-base', settings.global.borderRadius);
    root.style.setProperty('--font-size-base', settings.global.fontSizeBase);
    root.style.setProperty('--font-family-base', settings.global.fontFamily);
    if (settings.global.background) root.style.setProperty('--bg-custom', settings.global.background);

    localStorage.setItem('flowcontrol-granular-design', JSON.stringify(settings));
  }, [settings]);

  const updateGlobalSettings = (newSettings: Partial<DesignSettings['global']>) => {
    setSettings(prev => ({
      ...prev,
      global: { ...prev.global, ...newSettings }
    }));
  };

  const updateElementStyle = (id: string, style: Partial<ElementStyle>) => {
    setSettings(prev => ({
      ...prev,
      overrides: {
        ...prev.overrides,
        [id]: { ...(prev.overrides[id] || {}), ...style }
      }
    }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('flowcontrol-granular-design');
  };

  // Generate CSS for granular overrides
  const generateOverridesCSS = () => {
    return Object.entries(settings.overrides).map(([id, style]) => {
      const rules = Object.entries(style).map(([prop, value]) => {
        // Convert camelCase to kebab-case
        const kebabProp = prop.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
        return `${kebabProp}: ${value} !important;`;
      }).join(' ');
      return `[data-design-id="${id}"] { ${rules} }`;
    }).join('\n');
  };

  return (
    <DesignContext.Provider value={{ 
      settings, 
      selectedElementId, 
      setSelectedElementId,
      updateGlobalSettings, 
      updateElementStyle, 
      resetSettings 
    }}>
      <style dangerouslySetInnerHTML={{ __html: generateOverridesCSS() }} />
      {children}
    </DesignContext.Provider>
  );
}

export const useDesign = () => {
  const context = useContext(DesignContext);
  if (!context) throw new Error('useDesign must be used within DesignProvider');
  return context;
};
