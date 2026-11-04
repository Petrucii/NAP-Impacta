import { type HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

type Tone = 'neutral' | 'accent' | 'solid';

const tones: Record<Tone, string> = {
  neutral: 'border-field text-muted',
  accent: 'border-accent-text text-accent-text',
  solid: 'border-ink bg-ink text-canvas',
};

/** Tag pequena em caixa-alta, no estilo "DEV / SOTD" da referência. */
export function Badge({ tone = 'neutral', className, ...rest }: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-ui border px-2 py-0.5 text-caption uppercase',
        tones[tone],
        className,
      )}
      {...rest}
    />
  );
}
