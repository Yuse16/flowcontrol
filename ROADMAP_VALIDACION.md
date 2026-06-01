# 🛠️ Estrategia de Validación Temprana: UZALA "Solo-Flight"

Este roadmap ha sido reestructurado para priorizar la **validación de utilidad** con el menor costo y complejidad técnica posible, posponiendo la infraestructura de servidor hasta que el producto sea necesario a escala.

---

## 🚀 1. QUÉ HACER AHORA (Fase de Pulido y Utilidad Core)
*Enfoque: Eliminar fricción técnica y alcanzar la estética del mockup.*

### A. Saneamiento Quirúrgico
1.  **Eliminar Duplicidad:** Borrar la carpeta `/flowcontrol/`. Mantener dos versiones del código aumenta la probabilidad de bugs en un 100% y confunde el proceso de desarrollo.
2.  **Unificación de Tipos y Datos:** Normalizar el objeto `Activity` (eliminar alias `title/titulo`). Fusionar `useTodos` y `useAdvancedActivities` en un único motor de datos. 
    *   *Justificación:* Para validar, el usuario debe sentir que el sistema es robusto. Si un "Pendiente" no aparece en el "Calendario", la confianza se rompe.

### B. El "Look & Feel" de Validación
1.  **Implementación del Mockup (Glassmorphism):** Refactorizar los componentes para usar transparencias reales y desenfoques.
2.  **Optimización Orbitron:** Usar la fuente secundaria para métricas y estados de "sistema" para dar esa sensación tecnológica y premium.
3.  **Limpieza de CSS:** Quitar los `!important` y arreglar el soporte de temas.
    *   *Justificación:* Un usuario individual tolera la falta de nube si la app es hermosa y fluida. La estética premium es el mayor diferenciador de UZALA.

### C. Cierre de Flujos Individuales
1.  **Módulo "Todos" Real:** Conectar la página de pendientes con los componentes visuales ya creados (`TodoBoard`, `TodoCard`).
2.  **Detección de "Por Surtir":** Habilitar la lógica automática que marca tareas como urgentes si contienen palabras clave de inventario.

---

## 🛠️ 2. QUÉ HACER DESPUÉS (Fase de Operatividad Operativa)
*Enfoque: Convertir la app en una herramienta de trabajo diario completa.*

1.  **Módulo de Proveedores (Local):** Crear una base de contactos guardada en LocalStorage.
2.  **Módulo "Por Surtir" (Vista Dedicada):** Un lugar donde el usuario vea qué comprar/reponer sin distracciones.
3.  **PWA "App-Like" Experience:** Configurar el soporte offline al 100% y los iconos de pantalla de inicio.
    *   *Justificación:* Estas funciones dan valor real de "gestión" que otras apps de notas no tienen. Al ser locales, el costo de mantenimiento es cero.

---

## ⏳ 3. QUÉ POSPONER (Fase de Escalado y Complejidad)
*Enfoque: Retrasar dependencias externas y costos operativos.*

1.  **Supabase / Base de Datos Externa:** No implementar Auth ni sincronización en la nube todavía.
    *   *Justificación:* Supabase introduce latencia, manejo de errores de red y complejidad de esquemas que no ayudan a validar si el flujo de "Actividades + Surtido" funciona. LocalStorage es instantáneo y gratuito.
2.  **Notificaciones Push (Server-side):** Usar solo notificaciones locales si es necesario.
    *   *Justificación:* Requieren un backend activo o servicios de terceros que rompen la meta de "cero dependencias".
3.  **IA de Hábitos:** No implementar integración con LLMs o modelos de entrenamiento.
    *   *Justificación:* Sin una base de datos de usuarios reales y meses de uso, la IA no tendría datos que procesar. Es una característica de retención, no de adquisición inicial.

---

## ⚖️ Justificación del Cambio de Rumbo

1.  **Velocidad de Iteración:** Al trabajar solo con LocalStorage y hooks locales, los cambios en la estructura de datos se reflejan instantáneamente sin migraciones de base de datos.
2.  **Costo Cero:** El hosting de una app estática en Next.js (Vercel/Netlify) es gratuito. Mantener una instancia de Supabase o servicios de IA tiene costos que no se justifican sin usuarios validados.
3.  **Foco en el Diseño:** UZALA se vende por los ojos. Al posponer el backend, dedicamos el 100% del tiempo a que la interfaz sea idéntica al mockup oficial.
4.  **Privacidad por Diseño:** Para validación temprana, muchos usuarios prefieren que sus datos de "gestión interna" no salgan de su dispositivo.

---
**Próximo Paso Sugerido:** Proceder con la eliminación de `/flowcontrol/` y la normalización de tipos en `src/types/activity.ts`.
