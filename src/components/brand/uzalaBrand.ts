/** UZALA brand — single source of truth for icon + wordmark paths */

export const UZALA_COLORS = {
  bg: '#05000A',
  bgCard: '#0c0814',
  purple: '#9333EA',
  purpleMid: '#7C3AED',
  purpleLight: '#9D80FE',
  blue: '#3B82F6',
  cyan: '#22D3EE',
  white: '#FFFFFF',
} as const;

export const UZALA_ICON_GRADIENT = [
  { offset: '0%', color: '#9333EA' },
  { offset: '35%', color: '#7C3AED' },
  { offset: '65%', color: '#3B82F6' },
  { offset: '100%', color: '#22D3EE' },
] as const;

/** Icon mark geometry (viewBox 0 0 100 100) */
export const UZALA_MARK = {
  squircle: { x: 5, y: 5, w: 90, h: 90, rx: 22, fill: UZALA_COLORS.bgCard },
  strokeWidth: 11.5,
  /** U-shape body */
  uBody: 'M 30 28 V 56 Q 30 70 50 70 Q 70 70 70 56 V 28',
  /** Check mark inside the U */
  uTick: 'M 46 52 L 56 62 L 74 40',
  /** Ambient glow ellipse behind mark */
  glow: { cx: 50, cy: 48, rx: 32, ry: 28 },
} as const;

/** Wordmark geometry (viewBox 0 0 248 52) */
export const UZALA_WORDMARK = {
  viewW: 248,
  viewH: 52,
  stroke: 6.5,
} as const;

export const UZALA_TEXT_GRADIENT = [
  { offset: '0%', color: '#9333EA' },
  { offset: '50%', color: '#6366F1' },
  { offset: '100%', color: '#22D3EE' },
] as const;

/** Wordmark widths per size token */
export const WORDMARK_WIDTHS = {
  sm: 112,
  md: 148,
  lg: 200,
  hero: 300,
} as const;

export const MARK_SIZES = {
  sm: 32,
  md: 40,
  lg: 52,
  hero: 120,
} as const;
