import clsx from 'clsx';
import { UzalaMark } from './UzalaMark';
import { UzalaWordmark, UzalaTagline } from './UzalaWordmark';

interface UzalaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showText?: boolean;
  showTagline?: boolean;
  layout?: 'horizontal' | 'vertical';
  className?: string;
}

const MARK_SIZES = { sm: 32, md: 40, lg: 52, hero: 96 };
const WORDMARK_SIZES = { sm: 'sm' as const, md: 'md' as const, lg: 'lg' as const, hero: 'hero' as const };

export function UzalaLogo({
  size = 'md',
  showText = true,
  showTagline = false,
  layout = 'horizontal',
  className,
}: UzalaLogoProps) {
  const isVertical = layout === 'vertical' || size === 'hero';

  return (
    <div
      className={clsx(
        'flex items-center',
        isVertical ? 'flex-col gap-5' : 'flex-row gap-3',
        className
      )}
    >
      <UzalaMark size={MARK_SIZES[size]} showGlow={size === 'hero' || size === 'lg'} />
      {showText && (
        <div className={clsx(isVertical && 'flex flex-col items-center gap-3')}>
          <UzalaWordmark size={WORDMARK_SIZES[size]} />
          {showTagline && <UzalaTagline variant={size === 'hero' ? 'full' : 'short'} />}
        </div>
      )}
    </div>
  );
}

export { UzalaMark, UzalaWordmark, UzalaTagline };
