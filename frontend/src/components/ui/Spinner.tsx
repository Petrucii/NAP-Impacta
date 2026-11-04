import { cn } from '@/lib/cn';

/** Três barras pulsando: indicador de carga sem formas redondas (raio único do projeto). */
export function Bars({ className }: { className?: string }) {
  return (
    <span aria-hidden="true" className={cn('inline-flex h-4 items-end gap-0.5', className)}>
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="h-full w-1 animate-pulse rounded-ui bg-current"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </span>
  );
}

export function Spinner({ label = 'Carregando' }: { label?: string }) {
  return (
    <div
      role="status"
      className="flex items-center justify-center gap-3 py-16 text-small text-muted"
    >
      <Bars />
      <span>{label}…</span>
    </div>
  );
}
