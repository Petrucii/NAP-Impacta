import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/cn';

type Props = {
  title: string;
  description?: string;
  to?: string;
  linkLabel?: string;
  bordered?: boolean;
  children: ReactNode;
};

/** Bloco de página com título à esquerda e link "ver todos" à direita. */
export function Section({ title, description, to, linkLabel, bordered, children }: Props) {
  return (
    <section className={cn('section', bordered && 'border-t border-line')}>
      <div className="container-page">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2>{title}</h2>
            {description ? <p className="mt-2 text-body text-muted">{description}</p> : null}
          </div>
          {to ? (
            <Link to={to} className="link inline-flex items-center gap-1 font-medium">
              {linkLabel}
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          ) : null}
        </div>
        {children}
      </div>
    </section>
  );
}
