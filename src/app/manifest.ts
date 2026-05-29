import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'UZALA — Gestión Inteligente',
    short_name: 'UZALA',
    description: 'App móvil de gestión de actividades, calendario y pendientes.',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#0F0F17',
    theme_color: '#8B5CF6',
    orientation: 'portrait-primary',
    categories: ['productivity', 'business', 'utilities'],
    icons: [
      {
        src: '/icons/icon-192.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  };
}
