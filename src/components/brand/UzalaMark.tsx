import { UZALA_COLORS, UZALA_ICON_GRADIENT, UZALA_MARK } from './uzalaBrand';

interface UzalaMarkProps {
  size?: number;
  className?: string;
  showGlow?: boolean;
}

export function UzalaMark({ size = 48, className, showGlow = true }: UzalaMarkProps) {
  const uid = `mark-${size}`;
  const { squircle, uBody, uTick, uCap, glow, strokeWidth } = UZALA_MARK;

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
        <linearGradient id={`${uid}-grad`} x1="15%" y1="10%" x2="85%" y2="90%">
          {UZALA_ICON_GRADIENT.map((s) => (
            <stop key={s.offset} offset={s.offset} stopColor={s.color} />
          ))}
        </linearGradient>
        <linearGradient id={`${uid}-border`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9333EA" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.25" />
        </linearGradient>
        <radialGradient id={`${uid}-ambient`} cx="50%" cy="55%" r="50%">
          <stop offset="0%" stopColor="#9333EA" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#9333EA" stopOpacity="0" />
        </radialGradient>
        {showGlow && (
          <filter id={`${uid}-blur`} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )}
      </defs>

      {/* Squircle container */}
      <rect
        x={squircle.x}
        y={squircle.y}
        width={squircle.w}
        height={squircle.h}
        rx={squircle.rx}
        fill={squircle.fill}
        stroke={`url(#${uid}-border)`}
        strokeWidth="1.2"
      />

      {/* Purple ambient glow inside icon */}
      {showGlow && (
        <ellipse
          cx={glow.cx}
          cy={glow.cy}
          rx={glow.rx}
          ry={glow.ry}
          fill={`url(#${uid}-ambient)`}
        />
      )}

      {/* Detached vertical cap (right arm top piece) */}
      <rect
        x={uCap.x}
        y={uCap.y}
        width={uCap.w}
        height={uCap.h}
        rx={uCap.rx}
        fill={`url(#${uid}-grad)`}
        filter={showGlow ? `url(#${uid}-blur)` : undefined}
      />

      {/* Main U body */}
      <path
        d={uBody}
        stroke={`url(#${uid}-grad)`}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        filter={showGlow ? `url(#${uid}-blur)` : undefined}
      />

      {/* Diagonal tick */}
      <path
        d={uTick}
        stroke={`url(#${uid}-grad)`}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        filter={showGlow ? `url(#${uid}-blur)` : undefined}
      />
    </svg>
  );
}
