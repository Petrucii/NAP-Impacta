import { useEffect, useState, type ReactNode } from 'react';
import { Inbox, WifiOff } from 'lucide-react';
import { Button } from './Button';
import { Bars } from './Spinner';

/** Vira true depois de `ms` — usado para avisar que o servidor está acordando. */
function useSlowFlag(active: boolean, ms = 6000) {
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    if (!active) {
      setSlow(false);
      return;
    }
    const t = setTimeout(() => setSlow(true), ms);
    return () => clearTimeout(t);
  }, [active, ms]);
  return slow;
}

export function SkeletonGrid({ count = 3 }: { count?: number }) {
  const slow = useSlowFlag(true);
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">Carregando conteúdo</span>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="rounded-ui border border-line bg-surface p-6">
            <div className="h-3 w-12 animate-pulse rounded-ui bg-line" />
            <div className="mt-6 h-5 w-3/4 animate-pulse rounded-ui bg-line" />
            <div className="mt-4 h-3 w-full animate-pulse rounded-ui bg-line" />
            <div className="mt-2 h-3 w-5/6 animate-pulse rounded-ui bg-line" />
          </div>
        ))}
      </div>
      {slow ? (
        <p className="mt-6 flex items-center gap-3 text-small text-muted">
          <Bars />
          Na primeira visita o servidor pode levar até 1 minuto para acordar. Já está carregando.
        </p>
      ) : null}
    </div>
  );
}

type EmptyProps = { title: string; description?: string; action?: ReactNode };

export function EmptyState({ title, description, action }: EmptyProps) {
  return (
    <div className="flex flex-col items-start gap-4 rounded-ui border border-dashed border-field p-8 md:p-12">
      <Inbox aria-hidden="true" size={24} className="text-muted" />
      <div>
        <p className="text-lead font-semibold text-ink">{title}</p>
        {description ? <p className="mt-2 max-w-prose text-body text-muted">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-start gap-4 rounded-ui border border-field bg-surface p-8 md:p-12">
      <WifiOff aria-hidden="true" size={24} className="text-muted" />
      <div>
        <p className="text-lead font-semibold text-ink">Não conseguimos carregar agora</p>
        <p className="mt-2 max-w-prose text-body text-muted">
          Pode ser só o servidor acordando ou uma oscilação na conexão. Tente de novo em alguns
          segundos.
        </p>
      </div>
      {onRetry ? (
        <Button variant="secondary" onClick={onRetry}>
          Tentar de novo
        </Button>
      ) : null}
    </div>
  );
}

type DataStateProps = {
  isLoading: boolean;
  isError: boolean;
  isEmpty?: boolean;
  onRetry?: () => void;
  skeletonCount?: number;
  empty: EmptyProps;
  children: ReactNode;
};

/** Um só lugar para os 4 estados: carregando, erro, vazio e conteúdo. */
export function DataState({ isLoading, isError, isEmpty, onRetry, skeletonCount, empty, children }: DataStateProps) {
  if (isLoading) return <SkeletonGrid count={skeletonCount} />;
  if (isError) return <ErrorState onRetry={onRetry} />;
  if (isEmpty) return <EmptyState {...empty} />;
  return <>{children}</>;
}
