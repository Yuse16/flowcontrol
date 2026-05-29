import clsx from 'clsx';

interface UzalaWordmarkProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
}

const SIZE_CLASSES = {
  sm: { text: 'text-[15px] tracking-[0.28em]', dot: 'w-1 h-1', aH: 'h-[14px] w-[13px]' },
  md: { text: 'text-[19px] tracking-[0.3em]', dot: 'w-1.5 h-1.5', aH: 'h-[17px] w-[16px]' },
  lg: { text: 'text-[26px] tracking-[0.32em]', dot: 'w-2 h-2', aH: 'h-[23px] w-[22px]' },
  hero: { text: 'text-[44px] tracking-[0.34em]', dot: 'w-3 h-3', aH: 'h-[38px] w-[36px]' },
};

function StylizedA({ size, variant = 'featured' }: { size: keyof typeof SIZE_CLASSES; variant?: 'featured' | 'plain' }) {
  const s = SIZE_CLASSES[size];

  if (variant === 'plain') {
    return (
      <span className={clsx('inline-flex items-end mx-[0.08em]', s.aH)} aria-hidden>
        <svg viewBox="0 0 24 28" className="h-full w-auto" fill="none">
          <path d="M4 26 L12 2 L20 26" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7 18 H17" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.3" />
        </svg>
      </span>
    );
  }

  return (
    <span className={clsx('inline-flex flex-col items-center mx-[0.08em] relative', s.aH)} aria-hidden>
      <svg viewBox="0 0 24 28" className="h-full w-auto" fill="none">
        <defs>
          <linearGradient id="aPeak" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="35%" stopColor="#8A2BE2" />
            <stop offset="100%" stopColor="#00D4FF" />
          </linearGradient>
        </defs>
        <path d="M12 2 L20 26" stroke="url(#aPeak)" strokeWidth="2.8" strokeLinecap="round" />
        <path d="M12 2 L4 26" stroke="white" strokeWidth="2.8" strokeLinecap="round" />
        <path d="M4 26 L20 26" stroke="white" strokeWidth="2.8" strokeLinecap="round" />
      </svg>
      <span className={clsx('absolute top-[52%] left-1/2 -translate-x-1/2 rounded-full bg-[#00D4FF]', s.dot)} />
    </span>
  );
}

export function UzalaWordmark({ size = 'md', className }: UzalaWordmarkProps) {
  const s = SIZE_CLASSES[size];

  return (
    <div
      className={clsx(
        'font-orbitron font-bold text-white inline-flex items-end leading-none select-none',
        s.text,
        className
      )}
      aria-label="UZALA"
      role="img"
    >
      <span>U</span>
      <span>Z</span>
      <StylizedA size={size} variant="featured" />
      <span>L</span>
      <StylizedA size={size} variant="plain" />
    </div>
  );
}

export function UzalaTagline({ variant = 'full' }: { variant?: 'full' | 'short' }) {
  if (variant === 'short') {
    return (
      <p className="text-[11px] text-[#9D80FE]/90 font-light tracking-wide text-center font-orbitron">
        ¿Tienes que recordar algo?
      </p>
    );
  }

  return (
    <div className="text-center space-y-2 font-orbitron">
      <p className="text-sm text-[#9D80FE]/90 font-light tracking-wide">
        ¿Tienes que recordar algo?
      </p>
      <p
        className="text-sm font-semibold tracking-[0.35em] uppercase bg-gradient-to-r from-[#9D80FE] to-[#00D4FF] bg-clip-text text-transparent"
      >
        UZALA UZALA.
      </p>
    </div>
  );
}
