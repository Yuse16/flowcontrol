/** Shared UZALA brand SVG paths — single source for app icon, PWA icons, and in-app logo */

export const UZALA_COLORS = {
  bg: '#050508',
  bgCard: '#0a0a12',
  purple: '#8A2BE2',
  purpleLight: '#9D80FE',
  blue: '#3B82F6',
  cyan: '#00D4FF',
  white: '#FFFFFF',
} as const;

/** Squircle app mark: thick U with broken right leg / check tip */
export function uzalaMarkPaths(viewBox = 100) {
  const s = viewBox / 100;
  return {
    squircle: {
      rx: 22 * s,
      fill: UZALA_COLORS.bgCard,
      stroke: 'url(#uzalaBorderGlow)',
    },
    uShape: `M ${28 * s} ${32 * s} V ${54 * s} Q ${28 * s} ${72 * s} ${50 * s} ${72 * s} Q ${72 * s} ${72 * s} ${72 * s} ${54 * s} V ${46 * s}`,
    checkTip: `M ${72 * s} ${46 * s} L ${72 * s} ${34 * s} L ${84 * s} ${22 * s}`,
    strokeWidth: 11 * s,
  };
}

export const UZALA_GRADIENT_STOPS = [
  { offset: '0%', color: '#8A2BE2' },
  { offset: '45%', color: '#6366F1' },
  { offset: '100%', color: '#00D4FF' },
];

export const UZALA_TEXT_GRADIENT_STOPS = [
  { offset: '0%', color: '#9D80FE' },
  { offset: '100%', color: '#00D4FF' },
];
