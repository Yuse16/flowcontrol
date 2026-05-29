import clsx from 'clsx';

interface UzalaLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export function UzalaLogo({ size = 'md', showText = true, className }: UzalaLogoProps) {
  const iconSize = size === 'sm' ? 28 : size === 'lg' ? 44 : 36;
  const textSize = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-lg';

  return (
    <div className={clsx('flex items-center gap-2.5', className)}>
      <svg width={iconSize} height={iconSize} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="uzalaLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
        <path
          d="M6 10 C6 10 6 26 18 26 C30 26 30 10 30 10"
          stroke="url(#uzalaLogoGrad)"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M23 21 L27 25 L31 19"
          stroke="url(#uzalaLogoGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      {showText && (
        <span className={clsx('font-black tracking-[0.15em] text-white', textSize)}>
          UZALA
        </span>
      )}
    </div>
  );
}
