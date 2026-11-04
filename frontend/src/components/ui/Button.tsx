import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { cn } from '@/lib/cn';
import { Bars } from './Spinner';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex select-none items-center justify-center gap-2 rounded-ui font-medium no-underline ' +
  'transition-colors disabled:pointer-events-none disabled:opacity-50';

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-ink hover:bg-accent-hover active:bg-accent-active',
  secondary:
    'border border-field bg-transparent text-ink hover:border-ink hover:bg-surface active:bg-line',
  ghost: 'bg-transparent text-ink hover:bg-line active:bg-line/70',
  danger:
    'border border-danger bg-transparent text-danger hover:bg-danger hover:text-canvas active:opacity-90',
};

const sizes: Record<Size, string> = {
  sm: 'h-10 px-4 text-small',
  md: 'h-12 px-6 text-body',
  lg: 'h-14 px-8 text-body',
};

export function buttonStyles({
  variant = 'primary',
  size = 'md',
  className,
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
} = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, isLoading, children, disabled, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={buttonStyles({ variant, size, className })}
      {...rest}
    >
      {isLoading ? <Bars /> : null}
      {children}
    </button>
  );
});

type ButtonLinkProps = LinkProps & { variant?: Variant; size?: Size };

/** Link com aparência de botão (evita <button> dentro de <a>). */
export function ButtonLink({ variant, size, className, ...rest }: ButtonLinkProps) {
  return <Link className={buttonStyles({ variant, size, className })} {...rest} />;
}
