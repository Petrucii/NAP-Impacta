import { useState } from 'react';
import { usePosts } from '@/features/posts/hooks';
import { Seo } from '@/lib/seo';
import { PostCard } from '@/components/content/PostCard';
import { DataState } from '@/components/ui/State';
import { FilterTabs } from '@/components/ui/FilterTabs';
import { PageHeader } from '@/components/layout/PageHeader';

const ALL = 'all';
const CATEGORIES = [
  { value: ALL, label: 'Todos' },
  { value: 'orientacao', label: 'Orientação' },
  { value: 'educativo', label: 'Educativo' },
  { value: 'aviso', label: 'Avisos' },
];

export default function Conteudos() {
  const [cat, setCat] = useState(ALL);
  const { data, isLoading, isError, refetch } = usePosts(cat === ALL ? undefined : cat);

  return (
    <div className="container-page section">
      <Seo
        title="Orientações e conteúdos"
        description="Material educativo e dicas práticas publicadas pelo NAP Impacta."
      />
      <PageHeader
        eyebrow="Orientações"
        title="Orientações e conteúdos"
        description="Dicas práticas e materiais educativos para apoiar sua trajetória acadêmica."
      />
      <div className="mt-12 space-y-8">
        <FilterTabs label="Filtrar por categoria" options={CATEGORIES} value={cat} onChange={setCat} />
        <DataState
          isLoading={isLoading}
          isError={isError}
          isEmpty={!data || data.items.length === 0}
          onRetry={() => refetch()}
          empty={{ title: 'Nada publicado nesta categoria ainda' }}
        >
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data?.items.map((p) => <PostCard key={p.id} post={p} />)}
          </div>
        </DataState>
      </div>
    </div>
  );
}
