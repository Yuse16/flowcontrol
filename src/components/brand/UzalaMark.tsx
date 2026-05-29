import { UZALA_COLORS, UZALA_GRADIENT_STOPS, uzalaMarkPaths } from './uzalaBrand';

interface UzalaMarkProps {
  size?: number;
  className?: string;
  showGlow?: boolean;
}

export function UzalaMark({ size = 48, className, showGlow = true }: UzalaMarkProps) {
  const { squircle, uShape, checkTip, strokeWidth } = uzalaMarkPaths(100);
  const gradId = `uzalaGrad-${size}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id={gradId} x1="10%" y1="20%" x2="90%" y2="80%">
          {UZALA_GRADIENT_STOPS.map((stop) => (
            <stop key={stop.offset} offset={stop.offset} stopColor={stop.color} />
          ))}
        </linearGradient>
        {showGlow && (
          <>
            <linearGradient id={`${gradId}-border`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8A2BE2" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#00D4FF" stopOpacity="0.3" />
            </linearGradient>
            <filter id={`${gradId}-glow`} x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </>
        )}
      </defs>

      {/* Squircle background */}
      <rect
        x="4"
        y="4"
        width="92"
        height="92"
        rx={squircle.rx}
        fill={squircle.fill}
        stroke={showGlow ? `url(#${gradId}-border)` : '#2a2040'}
        strokeWidth="1.5"
      />

      {/* U body */}
      <path
        d={uShape}
        stroke={`url(#${gradId})`}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        filter={showGlow ? `url(#${gradId}-glow)` : undefined}
      />

      {/* Broken right leg / check tip */}
      <path
        d={checkTip}
        stroke={`url(#${gradId})`}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        filter={showGlow ? `url(#${gradId}-glow)` : undefined}
      />
    </svg>
  );
}

/** Static SVG string for public icon files — keeps PWA icons identical to in-app mark */
export function renderUzalaMarkSvg(size: number, cornerRadius: number): string {
  const gradId = 'g';
  const stops = UZALA_GRADIENT_STOPS.map(
    (s) => `<stop offset="${s.offset}" stop-color="${s.color}"/>`
  ).join('');

  const scale = size / 100;
  const sw = 11 * scale;
  const rx = cornerRadius;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="${gradId}" x1="10%" y1="20%" x2="90%" y2="80%">${stops}</linearGradient>
    <linearGradient id="border" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8A2BE2" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#00D4FF" stop-opacity="0.3"/>
    </linearGradient>
    <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="${2 * scale}" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect x="${4 * scale}" y="${4 * scale}" width="${92 * scale}" height="${92 * scale}" rx="${rx}" fill="${UZALA_COLORS.bgCard}" stroke="url(#border)" stroke-width="${1.5 * scale}"/>
  <path d="M ${28 * scale} ${32 * scale} V ${54 * scale} Q ${28 * scale} ${72 * scale} ${50 * scale} ${72 * scale} Q ${72 * scale} ${72 * scale} ${72 * scale} ${54 * scale} V ${46 * scale}" stroke="url(#${gradId})" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" fill="none" filter="url(#glow)"/>
  <path d="M ${72 * scale} ${46 * scale} L ${72 * scale} ${34 * scale} L ${84 * scale} ${22 * scale}" stroke="url(#${gradId})" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" fill="none" filter="url(#glow)"/>
</svg>`;
}
