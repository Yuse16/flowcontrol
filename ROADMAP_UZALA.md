# 🗺️ Roadmap Estratégico UZALA (2026)

Este documento detalla el estado actual del proyecto, las brechas entre la visión y la implementación, y la hoja de ruta priorizada para alcanzar el "Mockup Oficial".

---

## 📊 Estado Actual vs. Objetivo

| Módulo | Estado | Implementado | Pendiente |
| :--- | :---: | :--- | :--- |
| **Branding & UI** | 🟠 | Logo, Colores base, Dark Mode. | Glassmorphism real, fuentes Orbitron, pulido de Mockup. |
| **Infraestructura**| 🔴 | LocalStorage, Hooks fragmentados. | **Supabase**, Sincronización Real-time, Tipado único. |
| **Actividades** | 🟢 | CRUD, Recurrencia básica, Estados. | Analíticas, Adjuntos, Recurrencia compleja. |
| **Calendario** | 🟢 | Vistas Mes/Semana/Día. | Sync iCal/Google, Drag & Drop. |
| **Pendientes** | 🟠 | Lista básica, Filtros. | Favoritos, Categorías, Reordenamiento manual. |
| **Por surtir** | 🔴 | Lógica parcial en Dashboard. | Módulo dedicado, Gestión de inventario. |
| **Proveedores** | 🔴 | Nada. | Directorio, Contactos, Vínculo con Surtido. |
| **PWA** | 🟠 | Manifiesto, Configuración base. | Soporte Offline, Notificaciones Push, Iconos iOS. |
| **Usuarios** | 🔴 | Mock de contexto. | Auth vía Supabase, Perfiles, Roles. |
| **Hábitos IA** | 🔴 | Nada. | Sugerencias inteligentes, Análisis de productividad. |

---

## 🚀 Hoja de Ruta Priorizada

### Fase 1: Saneamiento y Estructura (CRÍTICO)
*Objetivo: Eliminar deuda técnica y preparar la base para el crecimiento.*

1.  **Limpieza de Directorios:** Eliminar `/flowcontrol/` y unificar el código en la raíz.
2.  **Unificación de Datos:** Fusionar `useTodos`, `useCalendarTasks` y `useAdvancedActivities` en un solo motor de datos normalizado.
3.  **Normalización de Tipos:** Eliminar alias duplicados (`title/titulo`, `description/descripcion`).
4.  **Limpieza de Estilos:** Refactorizar `globals.css` para eliminar `!important` y habilitar un Light Mode real sin hacks.

### Fase 2: Conectividad y Persistencia (ALTO)
*Objetivo: Salir de LocalStorage y habilitar el uso multi-dispositivo.*

1.  **Integración con Supabase:**
    *   Migración de esquemas de datos a PostgreSQL.
    *   Implementación de Auth (Email/Google).
    *   Sincronización en tiempo real (Realtime).
2.  **Sistema de Usuarios:** Gestión de perfiles y preferencias de diseño guardadas en la nube.

### Fase 3: Operatividad y Negocio (ALTO)
*Objetivo: Completar los flujos de trabajo core para uso empresarial/personal.*

1.  **Módulo de Pendientes (Full):** Integrar favoritos, categorías y los componentes visuales ya creados (`TodoBoard`, `TodoCard`).
2.  **Módulo "Por Surtir":** Vista dedicada para ítems urgentes y control de stock.
3.  **Módulo Proveedores:** Directorio de contactos integrado con las tareas de compra/surtido.
4.  **Dashboard Pro:** Implementar widgets avanzados (`WeeklyProgressChart`, `StatWidget`) con datos reales.

### Fase 4: Experiencia "Mockup Perfect" (MEDIO)
*Objetivo: Alcanzar la estética visual premium de UZALA.*

1.  **Glassmorphism UI:** Aplicar efectos de transparencia y desenfoque (backdrop-blur) consistentes.
2.  **Soporte iOS Avanzado:** Optimización total para Notch/Dynamic Island y gestos hapticos.
3.  **PWA Offline:** Garantizar que la app funcione sin conexión y sincronice al volver.
4.  **Notificaciones Push:** Alertas del sistema para recordatorios críticos.

### Fase 5: Inteligencia y Automatización (BAJO)
*Objetivo: Diferenciación competitiva mediante IA.*

1.  **Hábitos IA:** Motor de sugerencias basado en el historial del usuario (ej: "Sueles surtir los lunes, ¿quieres programar una actividad?").
2.  **Integración de Calendarios:** Sincronización bidireccional con Google Calendar y iCal.
3.  **Reportes de Productividad:** Gráficos detallados de cumplimiento y cuellos de botella.

---

## 🛠️ Stack Tecnológico Definido

*   **Frontend:** Next.js 14 + Tailwind CSS + Framer Motion.
*   **Backend/BaaS:** Supabase (PostgreSQL, Auth, Realtime).
*   **Mobile:** PWA (con @ducanh2912/next-pwa).
*   **Diseño:** Sistema de variables CSS centralizado en `globals.css` y `uzalaTheme.ts`.

---
**Última actualización:** 1 de junio de 2026
