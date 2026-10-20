import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { AboutContent } from '@/types/api';
import { Seo } from '@/lib/seo';
import { Markdown } from '@/components/ui/Markdown';
import { Spinner } from '@/components/ui/Spinner';

export default function Sobre() {
  const { data, isLoading } = useQuery({
    queryKey: ['about'],
    queryFn: async () => (await api.get<AboutContent>('/content/about')).data,
  });

  return (
    <div className="container-page py-12 max-w-3xl">
      <Seo title="Sobre o NAP" description="O que é, missão e público atendido pelo NAP Impacta." />
      {isLoading || !data ? (
        <Spinner />
      ) : (
        <article>
          <h1 className="text-ink">{data.title}</h1>
          <div className="mt-6">
            <Markdown>{data.bodyMd}</Markdown>
          </div>
        </article>
      )}
    </div>
  );
}
