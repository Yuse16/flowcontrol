import clsx from 'clsx';
import {
  UZALA_COLORS,
  UZALA_TEXT_GRADIENT,
  UZALA_WORDMARK,
  WORDMARK_WIDTHS,
} from './uzalaBrand';

interface UzalaWordmarkProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
}

export function UzalaWordmark({ size = 'md', className }: UzalaWordmarkProps) {
  const width = WORDMARK_WIDTHS[size];
  const height = (width * UZALA_WORDMARK.viewH) / UZALA_WORDMARK.viewW;
  const uid = `wm-${size}`;
  const sw = UZALA_WORDMARK.stroke;

  // Letter positions tuned to match reference image proportions
  const a1cx = 128;
  const a1top = 7;
  const a1base = 45;
  const a1w = 15;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${UZALA_WORDMARK.viewW} ${UZALA_WORDMARK.viewH}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx('flex-shrink-0', className)}
      aria-label="UZALA"
      role="img"
    >
      <defs>
        <linearGradient id={`${uid}-aGrad`} x1="0%" y1="100%" x2="60%" y2="0%">
          {UZALA_TEXT_GRADIENT.map((s) => (
            <stop key={s.offset} offset={s.offset} stopColor={s.color} />
          ))}
        </linearGradient>
      </defs>

      {/* U */}
      <path
        d="M 2 45 V 17 Q 2 5 24 5 Q 46 5 46 17 V 45"
        stroke={UZALA_COLORS.white}
        strokeWidth={sw}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Z */}
      <path
        d="M 58 7 H 94 L 58 45 H 94"
        stroke={UZALA_COLORS.white}
        strokeWidth={sw}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* First A — gradient left half, white right leg, cyan dot, no crossbar */}
      <path
        d={`M ${a1cx - a1w} ${a1base} L ${a1cx} ${a1top} L ${a1cx} ${a1base} Z`}
        fill={`url(#${uid}-aGrad)`}
      />
      <path
        d={`M ${a1cx} ${a1top} L ${a1cx + a1w} ${a1base}`}
        stroke={UZALA_COLORS.white}
        strokeWidth={sw}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={a1cx} cy={34} r={3.2} fill={UZALA_COLORS.cyan} />

      {/* L */}
      <path
        d="M 162 45 V 7 H 188"
        stroke={UZALA_COLORS.white}
        strokeWidth={sw}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Final A — open white V, no crossbar, no dot */}
      <path
        d="M 204 45 L 218 7 L 232 45"
        stroke={UZALA_COLORS.white}
        strokeWidth={sw}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function UzalaTagline({ variant = 'full' }: { variant?: 'full' | 'short' }) {
  if (variant === 'short') {
    return (
      <p className="text-[11px] text-white/90 font-light tracking-wide text-center">
        ¿Tienes que recordar algo?
      </p>
    );
  }

  return (
    <div className="text-center space-y-2.5">
      <p className="text-[15px] text-white/90 font-light tracking-wide">
        ¿Tienes que recordar algo?
      </p>
      <p className="text-[15px] font-medium tracking-[0.28em] uppercase text-[#9D80FE]">
        UZALA UZALA.
      </p>
    </div>
  );
}
