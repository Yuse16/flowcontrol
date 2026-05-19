"use client";
import { useState, useEffect, useCallback } from 'react';
import { OperationalRoute } from '@/types/route';

const STORAGE_KEY = 'flowcontrol_operational_routes';

const INITIAL_ROUTES: OperationalRoute[] = [
  {
    id: '1',
    title: 'Días disponibles para entregas',
    description: 'Verificar los días de entrega en el sistema Intelisis.',
    category: 'Intelisis',
    steps: ['Reportes', 'Otros', 'Operación Sucursal'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export function useRoutes() {
  const [routes, setRoutes] = useState<OperationalRoute[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setRoutes(JSON.parse(stored));
      } catch (e) {
        setRoutes(INITIAL_ROUTES);
      }
    } else {
      setRoutes(INITIAL_ROUTES);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(routes));
    }
  }, [routes, isLoaded]);

  const addRoute = useCallback((route: Omit<OperationalRoute, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRoute: OperationalRoute = {
      ...route,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setRoutes(prev => [newRoute, ...prev]);
  }, []);

  const updateRoute = useCallback((id: string, updates: Partial<OperationalRoute>) => {
    setRoutes(prev => prev.map(r => r.id === id ? { 
      ...r, 
      ...updates, 
      updatedAt: new Date().toISOString() 
    } : r));
  }, []);

  const deleteRoute = useCallback((id: string) => {
    setRoutes(prev => prev.filter(r => r.id !== id));
  }, []);

  return {
    routes,
    addRoute,
    updateRoute,
    deleteRoute,
    isLoaded
  };
}
