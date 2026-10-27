import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckCircle, Mail, X } from 'lucide-react';

import { Seo } from '@/lib/seo';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { adminHandleMessage, adminListMessages } from '@/features/contact/api';
import type { ContactMessage } from '@/types/api';

export default function MessagesAdmin() {
  const [filter, setFilter] = useState<'all' | 'unhandled' | 'handled'>('unhandled');
  const [open, setOpen] = useState<ContactMessage | null>(null);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'messages', filter],
    queryFn: () =>
      adminListMessages({
        handled: filter === 'all' ? undefined : filter === 'handled',
        limit: 50,
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

  return (
    <div>
      <Seo title="Admin — Mensagens" />
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-ink">Mensagens</h1>
        <div className="flex gap-2 text-sm" role="tablist" aria-label="Filtrar">
          {(['unhandled', 'all', 'handled'] as const).map((v) => (
            <button
              key={v}
              role="tab"
              aria-selected={filter === v}
              onClick={() => setFilter(v)}
              className={
                filter === v
                  ? 'rounded-full border border-accent bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200 px-3 py-1'
                  : 'rounded-full border border-border text-mute px-3 py-1 hover:bg-surface'
              }
            >
              {v === 'unhandled' ? 'Não lidas' : v === 'all' ? 'Todas' : 'Tratadas'}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <ul className="mt-6 space-y-3">
          {data?.items.map((m) => (
            <li key={m.id}>
              <Card className="flex items-start justify-between gap-4">
                <button
                  onClick={() => setOpen(m)}
                  className="text-left flex-1 min-w-0"
                >
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold text-ink">{m.name}</span>
                    <span className="text-mute">·</span>
                    <span className="text-mute truncate">{m.topic}</span>
                    {m.handledAt ? (
                      <span className="ml-auto inline-flex items-center gap-1 text-xs text-emerald-600">
                        <CheckCircle size={14} aria-hidden="true" /> Tratada
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm text-mute line-clamp-2">{m.message}</p>
                  <p className="mt-2 text-xs text-mute">
                    {new Date(m.createdAt).toLocaleString('pt-BR')}
                    {' · '}
                    {m.email}
                  </p>
                </button>
              </Card>
            </li>
          ))}
          {data && data.items.length === 0 ? (
            <p className="text-mute">Nenhuma mensagem neste filtro.</p>
          ) : null}
        </ul>
      )}

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mensagem"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setOpen(null)}
        >
          <div
            className="w-full max-w-lg rounded-card border border-border bg-surface p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-ink">{open.name}</p>
                <p className="text-sm text-mute">{open.topic}</p>
              </div>
              <button
                aria-label="Fechar"
                onClick={() => setOpen(null)}
                className="h-8 w-8 rounded hover:bg-surface-2"
              >
                <X size={18} aria-hidden="true" className="mx-auto" />
              </button>
            </div>

            <p className="mt-4 whitespace-pre-wrap text-sm text-ink">{open.message}</p>

            <p className="mt-4 text-xs text-mute">
              {open.email} · {new Date(open.createdAt).toLocaleString('pt-BR')}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <a
                href={`mailto:${open.email}?subject=${encodeURIComponent(`Re: ${open.topic}`)}`}
                className="inline-flex items-center gap-2 rounded-card bg-accent px-5 py-2.5 font-medium text-accent-ink no-underline"
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
