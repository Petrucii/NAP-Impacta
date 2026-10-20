import { useState } from 'react';
import { usePosts } from '@/features/posts/hooks';
import { Seo } from '@/lib/seo';
import { PostCard } from '@/components/content/PostCard';
import { Spinner } from '@/components/ui/Spinner';
import { cn } from '@/lib/cn';

const CATEGORIES: { value: string | undefined; label: string }[] = [
  { value: undefined, label: 'Todos' },
  { value: 'orientacao', label: 'Orientação' },
  { value: 'educativo', label: 'Educativo' },
  { value: 'aviso', label: 'Avisos' },
];

export default function Conteudos() {
  const [cat, setCat] = useState<string | undefined>(undefined);
  const { data, isLoading } = usePosts(cat);

  return (
    <div className="container-page py-12">
      <Seo
        title="Orientações e conteúdos"
        description="Material educativo e dicas práticas publicadas pelo NAP Impacta."
      />
      <h1>Orientações e conteúdos</h1>
      <p className="mt-2 text-mute max-w-2xl">
        Dicas práticas e materiais educativos para apoiar sua trajetória acadêmica.
      </p>

      <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Filtrar por categoria">
        {CATEGORIES.map((c) => {
          const active = cat === c.value;
          return (
            <button
              key={c.label}
              role="tab"
              aria-selected={active}
              onClick={() => setCat(c.value)}
              className={cn(
                'rounded-full border px-4 py-1.5 text-sm transition',
                active
                  ? 'border-accent bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200'
                  : 'border-border text-mute hover:bg-surface-2',
              )}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {data?.items.map((p) => <PostCard key={p.id} post={p} />)}
          {data && data.items.length === 0 ? (
            <p className="text-mute col-span-full">Nada publicado nesta categoria ainda.</p>
          ) : null}
        </div>
      )}
    </div>
  );
}
