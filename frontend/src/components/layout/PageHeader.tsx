import { type ReactNode } from 'react';

type Props = { eyebrow?: string; title: string; description?: ReactNode };

export function PageHeader({ eyebrow, title, description }: Props) {
  return (
    <header className="border-b border-line pb-12">
      {eyebrow ? <p className="eyebrow mb-4">{eyebrow}</p> : null}
      <h1 className="max-w-3xl">{title}</h1>
      {description ? <p className="mt-6 max-w-prose text-lead text-muted">{description}</p> : null}
    </header>
  );
}
