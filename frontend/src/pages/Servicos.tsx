import { useServices } from '@/features/services/hooks';
import { Seo } from '@/lib/seo';
import { ServiceCard } from '@/components/content/ServiceCard';
import { Spinner } from '@/components/ui/Spinner';

export default function Servicos() {
  const { data, isLoading } = useServices();

  return (
    <div className="container-page py-12">
      <Seo
        title="Serviços"
        description="Áreas de apoio do NAP: acolhimento, acessibilidade, orientação vocacional e aprendizagem."
      />
      <h1>Serviços</h1>
      <p className="mt-2 text-mute max-w-2xl">
        Todas as áreas de apoio do Núcleo. Clique para ver detalhes e como acessar.
      </p>

      {isLoading ? (
        <Spinner />
      ) : (
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {data?.items.map((s) => <ServiceCard key={s.id} service={s} />)}
          {data && data.items.length === 0 ? (
            <p className="text-mute col-span-full">Nenhum serviço disponível no momento.</p>
          ) : null}
        </div>
      )}
    </div>
  );
}
