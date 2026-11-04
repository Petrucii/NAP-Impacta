import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { TeamMember } from '@/types/api';
import { Seo } from '@/lib/seo';
import { Card } from '@/components/ui/Card';
import { DataState } from '@/components/ui/State';
import { PageHeader } from '@/components/layout/PageHeader';

const AVATAR = 'h-16 w-16 shrink-0 rounded-ui';

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}

export default function Equipe() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['team'],
    queryFn: async () => (await api.get<TeamMember[]>('/team')).data,
  });

  return (
    <div className="container-page section">
      <Seo title="Equipe" description="Equipe do Núcleo de Apoio Psicopedagógico — NAP Impacta." />
      <PageHeader
        eyebrow="Equipe"
        title="Quem cuida do NAP"
        description="Profissionais responsáveis pelo acolhimento, orientação e inclusão na Impacta."
      />
      <div className="mt-12">
        <DataState
          isLoading={isLoading}
          isError={isError}
          isEmpty={!data || data.length === 0}
          onRetry={() => refetch()}
          empty={{ title: 'Equipe em atualização' }}
        >
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data?.map((m) => (
              <Card key={m.id} className="flex gap-4">
                {m.photoUrl ? (
                  <img
                    src={m.photoUrl}
                    alt={`Foto de ${m.name}, ${m.roleTitle}`}
                    width={64}
                    height={64}
                    loading="lazy"
                    className={`${AVATAR} object-cover`}
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className={`${AVATAR} flex items-center justify-center border border-line bg-canvas font-semibold text-ink`}
                  >
                    {initials(m.name)}
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="text-body font-semibold">{m.name}</h3>
                  <p className="text-small text-muted">{m.roleTitle}</p>
                  {m.bio ? <p className="mt-2 text-small text-muted">{m.bio}</p> : null}
                </div>
              </Card>
            ))}
          </div>
        </DataState>
      </div>
    </div>
  );
}
