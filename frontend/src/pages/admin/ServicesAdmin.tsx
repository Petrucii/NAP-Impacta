import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Edit3 } from 'lucide-react';

import { Seo } from '@/lib/seo';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { useAdminServices } from '@/features/services/hooks';
import {
  adminCreateService,
  adminDeleteService,
  adminUpdateService,
} from '@/features/services/api';
import type { Service } from '@/types/api';
import { extractApiError } from '@/lib/api';

type Form = {
  id?: string;
  slug: string;
  title: string;
  summary: string;
  bodyMd: string;
  icon: string;
  orderIndex: number;
  published: boolean;
};

const EMPTY: Form = {
  slug: '',
  title: '',
  summary: '',
  bodyMd: '',
  icon: 'heart-handshake',
  orderIndex: 0,
  published: true,
};

export default function ServicesAdmin() {
  const { data, isLoading } = useAdminServices();
  const [form, setForm] = useState<Form | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const qc = useQueryClient();

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['admin', 'services'] });
    qc.invalidateQueries({ queryKey: ['services'] });
  };

  const create = useMutation({
    mutationFn: (f: Form) => adminCreateService(f),
    onSuccess: () => {
      setForm(null);
      invalidate();
    },
    onError: (e) => setErr(extractApiError(e).message),
  });

  const update = useMutation({
    mutationFn: ({ id, f }: { id: string; f: Form }) => adminUpdateService(id, f),
    onSuccess: () => {
      setForm(null);
      invalidate();
    },
    onError: (e) => setErr(extractApiError(e).message),
  });

  const remove = useMutation({
    mutationFn: (id: string) => adminDeleteService(id),
    onSuccess: invalidate,
    onError: (e) => setErr(extractApiError(e).message),
  });

  const onEdit = (s: Service) =>
    setForm({
      id: s.id,
      slug: s.slug,
      title: s.title,
      summary: s.summary,
      bodyMd: s.bodyMd,
      icon: s.icon,
      orderIndex: s.orderIndex,
      published: s.published,
    });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setErr(null);
    if (form.id) {
      update.mutate({ id: form.id, f: form });
    } else {
      create.mutate(form);
    }
  };

  return (
    <div>
      <Seo title="Admin — Serviços" />
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-ink">Serviços</h1>
        {!form ? (
          <Button onClick={() => setForm({ ...EMPTY })} size="sm">
            <Plus size={16} aria-hidden="true" /> Novo
          </Button>
        ) : null}
      </div>

      {form ? (
        <Card className="mt-6">
          <form onSubmit={onSubmit} className="space-y-4">
            <h2 className="text-lg font-semibold">{form.id ? 'Editar serviço' : 'Novo serviço'}</h2>
            <Input
              label="Título"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <Input
              label="Slug"
              required
              hint="Minúsculas, hífens, sem acentos (ex.: apoio-a-aprendizagem)"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
            />
            <Textarea
              label="Resumo"
              required
              hint="Até 400 caracteres. Aparece nos cards."
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
            />
            <Textarea
              label="Corpo (Markdown)"
              rows={10}
              value={form.bodyMd}
              onChange={(e) => setForm({ ...form, bodyMd: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Ícone (lucide)"
                value={form.icon}
                hint="ex.: heart-handshake, graduation-cap, accessibility, compass"
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
              />
              <Input
                label="Ordem"
                type="number"
                value={form.orderIndex}
                onChange={(e) => setForm({ ...form, orderIndex: Number(e.target.value) })}
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
              />
              Publicado
            </label>
            {err ? (
              <p className="text-sm text-red-600" role="alert">
                {err}
              </p>
            ) : null}
            <div className="flex gap-2">
              <Button type="submit" isLoading={create.isPending || update.isPending}>
                Salvar
              </Button>
              <Button variant="secondary" type="button" onClick={() => setForm(null)}>
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      ) : null}

      {isLoading ? (
        <Spinner />
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left text-mute">
                <th className="py-2 pr-4">Título</th>
                <th className="py-2 pr-4 hidden md:table-cell">Slug</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Ordem</th>
                <th className="py-2 pr-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((s) => (
                <tr key={s.id} className="border-b border-border last:border-0">
                  <td className="py-2 pr-4 font-medium text-ink">{s.title}</td>
                  <td className="py-2 pr-4 text-mute hidden md:table-cell"><code>{s.slug}</code></td>
                  <td className="py-2 pr-4">
                    {s.published ? (
                      <span className="text-emerald-600">Publicado</span>
                    ) : (
                      <span className="text-mute">Rascunho</span>
                    )}
                  </td>
                  <td className="py-2 pr-4">{s.orderIndex}</td>
                  <td className="py-2 pr-4 text-right">
                    <div className="inline-flex gap-2">
                      <Button variant="secondary" size="sm" onClick={() => onEdit(s)}>
                        <Edit3 size={14} aria-hidden="true" />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          if (confirm(`Arquivar "${s.title}"?`)) remove.mutate(s.id);
                        }}
                      >
                        <Trash2 size={14} aria-hidden="true" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {data && data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-mute">
                    Nenhum serviço cadastrado.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
