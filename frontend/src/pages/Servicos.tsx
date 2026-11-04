import { useServices } from '@/features/services/hooks';
import { Seo } from '@/lib/seo';
import { ServiceCard } from '@/components/content/ServiceCard';
import { DataState } from '@/components/ui/State';
import { PageHeader } from '@/components/layout/PageHeader';

export default function Servicos() {
  const { data, isLoading, isError, refetch } = useServices();

  return (
    <div className="container-page section">
      <Seo
        title="Serviços"
        description="Áreas de apoio do NAP: acolhimento, acessibilidade, orientação vocacional e aprendizagem."
      />
      <PageHeader
        eyebrow="Serviços"
        title="Áreas de apoio do Núcleo"
        description="Escolha uma área para ver os detalhes e saber como acessar."
      />
      <div className="mt-12">
        <DataState
          isLoading={isLoading}
          isError={isError}
          isEmpty={!data || data.items.length === 0}
          onRetry={() => refetch()}
          empty={{ title: 'Nenhum serviço disponível no momento' }}
        >
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data?.items.map((s, i) => <ServiceCard key={s.id} service={s} index={i} />)}
          </div>
        </DataState>
      </div>
    </div>
  );
}
