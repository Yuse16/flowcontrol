export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

export const CATEGORY_COLORS: Record<string, string> = {
  'Trabajo': '#8B5CF6',
  'Personal': '#3B82F6',
  'Gestión': '#8B5CF6',
  'Diseño': '#06B6D4',
  'Sprint': '#14B8A6',
  'Soporte': '#F97316',
  'default': '#8B5CF6',
};

export function getCategoryColor(category?: string): string {
  if (!category) return CATEGORY_COLORS.default;
  return CATEGORY_COLORS[category] || CATEGORY_COLORS.default;
}

export const PRIORITY_STYLES: Record<string, { label: string; bg: string; text: string }> = {
  urgent: { label: 'Urgente', bg: 'bg-red-500/15', text: 'text-red-400' },
  high: { label: 'Urgente', bg: 'bg-red-500/15', text: 'text-red-400' },
  medium: { label: 'Medio', bg: 'bg-orange-500/15', text: 'text-orange-400' },
  low: { label: 'Bajo', bg: 'bg-teal-500/15', text: 'text-teal-400' },
};
