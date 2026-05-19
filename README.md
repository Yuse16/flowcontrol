# FlowControl - Smart Management Platform

FlowControl es una aplicación web moderna, de arquitectura escalable, diseñada para la gestión inteligente de actividades, pendientes y productividad. 

## Características Principales (MVP)
- **Diseño Moderno:** Tema oscuro futurista con glassmorphism y animaciones suaves usando Framer Motion.
- **Arquitectura Escalable:** Basado en Next.js App Router (React 18), estructurado para soportar crecimiento (servicios, hooks, tipos).
- **Responsive:** Interfaces que se adaptan a cualquier tamaño de pantalla.
- **Preparado para el Futuro:** Interfaces pre-construidas listas para conectar con IA, sincronización en tiempo real y comandos de voz.

## Requisitos Previos (Para Windows)
Para ejecutar este proyecto en tu máquina Windows, necesitas tener instalado:
- **Node.js** (versión 18 o superior). Puedes descargarlo desde [nodejs.org](https://nodejs.org/).
- **npm** (usualmente viene incluido con Node.js).

## Instalación y Ejecución

1. Abre tu terminal (PowerShell o Símbolo del Sistema) en la carpeta del proyecto `FlowControl`.
2. Instala las dependencias ejecutando:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
4. Abre tu navegador y navega a [http://localhost:3000](http://localhost:3000).

## Estructura de Carpetas

```
FlowControl/
├── src/
│   ├── app/           # Rutas (Dashboard, Actividades, Calendario, etc.) y Layouts
│   ├── components/    # Componentes reutilizables
│   │   └── layout/    # Topbar, Sidebar
│   ├── hooks/         # Custom React hooks (para el futuro)
│   ├── services/      # Llamadas a API (para el futuro)
│   ├── utils/         # Utilidades y helper functions
│   ├── types/         # Definiciones de TypeScript
│   ├── styles/        # Estilos adicionales si es necesario
│   ├── context/       # Estado global (para el futuro)
│   └── data/          # Datos de prueba (mocks)
├── public/            # Assets estáticos
├── package.json       # Dependencias y scripts
├── tailwind.config.ts # Configuración del tema y colores
└── tsconfig.json      # Configuración de TypeScript
```

## Tecnologías Utilizadas
- **Next.js 14+** (App Router)
- **TypeScript**
- **TailwindCSS**
- **Framer Motion** (Animaciones)
- **Lucide React** (Íconos)
- **Clsx & Tailwind-merge** (Utilidades de clases)

## Próximos Pasos (Hoja de Ruta)
- Implementar base de datos (PostgreSQL/Supabase).
- Autenticación multiusuario (NextAuth).
- Integrar la IA real para predecir productividad y tiempos muertos.
- Sincronización en tiempo real (WebSockets).
