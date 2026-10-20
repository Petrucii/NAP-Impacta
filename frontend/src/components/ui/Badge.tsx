import { type HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

type Props = HTMLAttributes<HTMLSpanElement> & {
  tone?: 'neutral' | 'brand' | 'success' | 'warn';
};

const toneClasses = {
  neutral: 'bg-surface-2 text-mute border-border',
  brand: 'bg-brand-50 text-brand-700 border-brand-200 dark:bg-brand-900/40 dark:text-brand-200 dark:border-brand-800',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800',
  warn: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800',
};

export function Badge({ tone = 'neutral', className, ...rest }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        toneClasses[tone],
        className,
      )}
      {...rest}
    />
  );
}
