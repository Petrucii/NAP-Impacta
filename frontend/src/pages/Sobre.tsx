import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { AboutContent } from '@/types/api';
import { Seo } from '@/lib/seo';
import { Markdown } from '@/components/ui/Markdown';
import { DataState } from '@/components/ui/State';
import { PageHeader } from '@/components/layout/PageHeader';

export default function Sobre() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['about'],
    queryFn: async () => (await api.get<AboutContent>('/content/about')).data,
  });

  return (
    <div className="container-page section">
      <Seo title="Sobre o NAP" description="O que é, missão e público atendido pelo NAP Impacta." />
      <PageHeader eyebrow="Sobre" title={data?.title ?? 'Sobre o NAP'} />
      <div className="mt-12 max-w-prose">
        <DataState
          isLoading={isLoading}
          isError={isError}
          isEmpty={!data?.bodyMd}
          onRetry={() => refetch()}
          skeletonCount={1}
          empty={{ title: 'Conteúdo em preparação' }}
        >
          <Markdown>{data?.bodyMd ?? ''}</Markdown>
        </DataState>
      </div>
    </div>
  );
}
