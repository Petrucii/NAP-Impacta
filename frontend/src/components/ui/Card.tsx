import { type HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export function Card({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-ui border border-line bg-surface p-6', className)} {...rest} />;
}

/** Classes de card clicável (usadas em <Link>): borda forte no hover, sem sombra. */
export const cardLinkClass =
  'group flex h-full flex-col rounded-ui border border-line bg-surface p-6 no-underline ' +
  'transition-colors hover:border-ink active:bg-canvas';

export function CardHeader({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mb-4', className)} {...rest} />;
}

export function CardTitle({ className, children, ...rest }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-lead font-semibold text-ink', className)} {...rest}>
      {children}
    </h3>
  );
}

export function CardBody({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('text-small text-muted', className)} {...rest} />;
}
