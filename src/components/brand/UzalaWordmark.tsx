import clsx from 'clsx';
import { WORDMARK_WIDTHS } from './uzalaBrand';

interface UzalaWordmarkProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
}

const sizeClasses: Record<NonNullable<UzalaWordmarkProps['size']>, string> = {
  sm: 'text-base tracking-[0.35em]',
  md: 'text-xl tracking-[0.32em]',
  lg: 'text-2xl tracking-[0.3em]',
  hero: 'text-4xl tracking-[0.28em]',
};

export function UzalaWordmark({ size = 'md', className }: UzalaWordmarkProps) {
  return (
    <div
      className={clsx(
        'inline-flex items-center gap-2 font-black uppercase leading-none',
        sizeClasses[size],
        className
      )}
      style={{ width: WORDMARK_WIDTHS[size] }}
      aria-label="FlowControl"
      role="img"
    >
      <span className="text-white">FL</span>
      <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-uzala-purple via-uzala-blue to-uzala-cyan">
        O
        <span className="absolute left-1/2 bottom-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-uzala-purple" />
      </span>
      <span className="text-white">W</span>
    </div>
  );
}

export function UzalaTagline({ variant = 'full' }: { variant?: 'full' | 'short' }) {
  if (variant === 'short') {
    return (
      <p className="text-[11px] text-white/80 font-light tracking-wide text-center">
        ¿Tienes que recordar algo? No lo olvides.
      </p>
    );
  }

  return (
    <div className="text-center space-y-2.5 max-w-[22rem] mx-auto">
      <p className="text-[15px] text-white/85 font-light tracking-wide">
        ¿Tienes que recordar algo? No lo olvides.
      </p>
      <p className="text-[15px] font-medium tracking-[0.28em] uppercase text-[#9D80FE]">
        UZALA UZALA.
      </p>
    </div>
  );
}
