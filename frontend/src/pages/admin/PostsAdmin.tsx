import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Edit3 } from 'lucide-react';

import { Seo } from '@/lib/seo';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { useAdminPosts } from '@/features/posts/hooks';
import {
  adminCreatePost,
  adminDeletePost,
  adminUpdatePost,
} from '@/features/posts/api';
import type { Post } from '@/types/api';
import { extractApiError } from '@/lib/api';

type Form = {
  id?: string;
  slug: string;
  title: string;
  summary: string;
  bodyMd: string;
  category: Post['category'];
  coverUrl: string;
  author: string;
};

const EMPTY: Form = {
  slug: '',
  title: '',
  summary: '',
  bodyMd: '',
  category: 'orientacao',
  coverUrl: '',
  author: 'Equipe NAP',
};

const CATS = [
  { value: 'orientacao', label: 'Orientação' },
  { value: 'educativo', label: 'Educativo' },
  { value: 'aviso', label: 'Aviso' },
];

export default function PostsAdmin() {
  const { data, isLoading } = useAdminPosts();
  const [form, setForm] = useState<Form | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const qc = useQueryClient();

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['admin', 'posts'] });
    qc.invalidateQueries({ queryKey: ['posts'] });
    qc.invalidateQueries({ queryKey: ['home'] });
  };

  const create = useMutation({
    mutationFn: (f: Form) =>
      adminCreatePost({
        slug: f.slug,
        title: f.title,
        summary: f.summary,
        bodyMd: f.bodyMd,
        category: f.category,
        coverUrl: f.coverUrl || null,
        author: f.author,
      }),
    onSuccess: () => {
      setForm(null);
      invalidate();
    },
    onError: (e) => setErr(extractApiError(e).message),
  });

  const update = useMutation({
    mutationFn: ({ id, f }: { id: string; f: Form }) =>
      adminUpdatePost(id, {
        slug: f.slug,
        title: f.title,
        summary: f.summary,
        bodyMd: f.bodyMd,
        category: f.category,
        coverUrl: f.coverUrl || null,
        author: f.author,
      }),
    onSuccess: () => {
      setForm(null);
      invalidate();
    },
    onError: (e) => setErr(extractApiError(e).message),
  });

  const togglePublish = useMutation({
    mutationFn: ({ id, publish }: { id: string; publish: boolean }) =>
      adminUpdatePost(id, { publish }),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: string) => adminDeletePost(id),
    onSuccess: invalidate,
  });

  const onEdit = (p: Post) =>
    setForm({
      id: p.id,
      slug: p.slug,
      title: p.title,
      summary: p.summary,
      bodyMd: p.bodyMd,
      category: p.category,
      coverUrl: p.coverUrl || '',
      author: p.author,
    });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setErr(null);
    if (form.id) update.mutate({ id: form.id, f: form });
    else create.mutate(form);
  };

  return (
    <div>
      <Seo title="Admin — Conteúdos" />
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-ink">Conteúdos</h1>
        {!form ? (
          <Button onClick={() => setForm({ ...EMPTY })} size="sm">
            <Plus size={16} aria-hidden="true" /> Novo
          </Button>
        ) : null}
      </div>

      {form ? (
        <Card className="mt-6">
          <form onSubmit={onSubmit} className="space-y-4">
            <h2 className="text-lg font-semibold">
              {form.id ? 'Editar conteúdo' : 'Novo conteúdo'}
            </h2>
            <Input
              label="Título"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <Input
              label="Slug"
              required
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
            />
            <Textarea
              label="Resumo"
              required
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
            />
            <Textarea
              label="Corpo (Markdown)"
              rows={14}
              value={form.bodyMd}
              onChange={(e) => setForm({ ...form, bodyMd: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Categoria"
                options={CATS}
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as Post['category'] })}
              />
              <Input
                label="Autor"
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
              />
            </div>
            <Input
              label="URL da imagem de capa (opcional)"
              value={form.coverUrl}
              onChange={(e) => setForm({ ...form, coverUrl: e.target.value })}
            />
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
                <th className="py-2 pr-4 hidden md:table-cell">Categoria</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className="py-2 pr-4 font-medium text-ink">{p.title}</td>
                  <td className="py-2 pr-4 text-mute hidden md:table-cell">{p.category}</td>
                  <td className="py-2 pr-4">
                    {p.publishedAt ? (
                      <span className="text-emerald-600">Publicado</span>
                    ) : (
                      <span className="text-mute">Rascunho</span>
                    )}
                  </td>
                  <td className="py-2 pr-4 text-right">
                    <div className="inline-flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => togglePublish.mutate({ id: p.id, publish: !p.publishedAt })}
                      >
                        {p.publishedAt ? 'Despublicar' : 'Publicar'}
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => onEdit(p)}>
                        <Edit3 size={14} aria-hidden="true" />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          if (confirm(`Arquivar "${p.title}"?`)) remove.mutate(p.id);
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
                  <td colSpan={4} className="py-6 text-center text-mute">
                    Nenhum conteúdo cadastrado.
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
