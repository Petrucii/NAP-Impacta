import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckCircle, Mail, X } from 'lucide-react';

import { Seo } from '@/lib/seo';
import { Button, buttonStyles } from '@/components/ui/Button';
import { cardLinkClass } from '@/components/ui/Card';
import { DataState } from '@/components/ui/State';
import { FilterTabs } from '@/components/ui/FilterTabs';
import { adminHandleMessage, adminListMessages } from '@/features/contact/api';
import type { ContactMessage } from '@/types/api';

type Filter = 'all' | 'unhandled' | 'handled';

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'unhandled', label: 'Não lidas' },
  { value: 'all', label: 'Todas' },
  { value: 'handled', label: 'Tratadas' },
];

const PAGE_LIMIT = 50;

export default function MessagesAdmin() {
  const [filter, setFilter] = useState<Filter>('unhandled');
  const [open, setOpen] = useState<ContactMessage | null>(null);
  const qc = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin', 'messages', filter],
    queryFn: () =>
      adminListMessages({
        handled: filter === 'all' ? undefined : filter === 'handled',
        limit: PAGE_LIMIT,
      }),
  });

  const toggle = useMutation({
    mutationFn: ({ id, handled }: { id: string; handled: boolean }) =>
      adminHandleMessage(id, handled),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'messages'] });
      qc.invalidateQueries({ queryKey: ['admin', 'summary'] });
    },
  });

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div>
      <Seo title="Admin — Mensagens" />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-title md:text-title">Mensagens</h1>
        <FilterTabs label="Filtrar" options={FILTERS} value={filter} onChange={setFilter} />
      </div>

      <div className="mt-8">
        <DataState
          isLoading={isLoading}
          isError={isError}
          isEmpty={!data || data.items.length === 0}
          onRetry={() => refetch()}
          skeletonCount={2}
          empty={{ title: 'Nenhuma mensagem neste filtro' }}
        >
          <ul className="space-y-4">
            {data?.items.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => setOpen(m)}
                  className={`${cardLinkClass} w-full text-left`}
                >
                  <div className="flex items-center gap-2 text-small">
                    <span className="font-semibold text-ink">{m.name}</span>
                    <span className="text-muted">·</span>
                    <span className="truncate text-muted">{m.topic}</span>
                    {m.handledAt ? (
                      <span className="ml-auto inline-flex items-center gap-1 text-caption uppercase text-accent-text">
                        <CheckCircle size={14} aria-hidden="true" /> Tratada
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 line-clamp-2 text-small text-muted">{m.message}</p>
                  <p className="mt-3 text-caption text-muted">
                    {new Date(m.createdAt).toLocaleString('pt-BR')} · {m.email}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        </DataState>
      </div>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mensagem"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <button
            type="button"
            tabIndex={-1}
            aria-label="Fechar mensagem"
            onClick={() => setOpen(null)}
            className="absolute inset-0 cursor-default bg-ink/50"
          />
          <div className="relative w-full max-w-lg rounded-ui border border-line bg-surface p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-ink">{open.name}</p>
                <p className="text-small text-muted">{open.topic}</p>
              </div>
              <button
                type="button"
                aria-label="Fechar"
                onClick={() => setOpen(null)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-ui text-ink transition-colors hover:bg-line active:bg-line/70"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <p className="mt-6 whitespace-pre-wrap text-body text-ink">{open.message}</p>
            <p className="mt-4 text-caption text-muted">
              {open.email} · {new Date(open.createdAt).toLocaleString('pt-BR')}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={`mailto:${open.email}?subject=${encodeURIComponent(`Re: ${open.topic}`)}`}
                className={buttonStyles()}
              >
                <Mail size={16} aria-hidden="true" /> Responder
              </a>
              <Button
                variant="secondary"
                onClick={() => {
                  toggle.mutate({ id: open.id, handled: !open.handledAt });
                  setOpen(null);
                }}
              >
                {open.handledAt ? 'Marcar como não lida' : 'Marcar como tratada'}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
