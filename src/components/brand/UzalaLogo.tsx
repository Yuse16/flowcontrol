import clsx from 'clsx';
import { UzalaMark } from './UzalaMark';
import { UzalaWordmark, UzalaTagline } from './UzalaWordmark';
import { MARK_SIZES } from './uzalaBrand';

interface UzalaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showText?: boolean;
  showTagline?: boolean;
  layout?: 'horizontal' | 'vertical';
  className?: string;
}

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
        isVertical ? 'flex-col gap-6' : 'flex-row gap-3',
        className
      )}
    >
      <UzalaMark size={MARK_SIZES[size]} showGlow={size === 'hero' || size === 'lg'} />
      {showText && (
        <div className={clsx(isVertical && 'flex flex-col items-center gap-4')}>
          <UzalaWordmark size={size} />
          {showTagline && <UzalaTagline variant={size === 'hero' ? 'full' : 'short'} />}
        </div>
      )}
    </div>
  );
}

export { UzalaMark, UzalaWordmark, UzalaTagline };
