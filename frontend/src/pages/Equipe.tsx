import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { TeamMember } from '@/types/api';
import { Seo } from '@/lib/seo';
import { Spinner } from '@/components/ui/Spinner';
import { Card } from '@/components/ui/Card';

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}

export default function Equipe() {
  const { data, isLoading } = useQuery({
    queryKey: ['team'],
    queryFn: async () => (await api.get<TeamMember[]>('/team')).data,
  });

  return (
    <div className="container-page py-12">
      <Seo title="Equipe" description="Equipe do Núcleo de Apoio Psicopedagógico — NAP Impacta." />
      <h1>Equipe</h1>
      <p className="mt-2 text-mute max-w-2xl">
        Profissionais responsáveis pelo acolhimento, orientação e inclusão na Impacta.
      </p>

      {isLoading ? (
        <Spinner />
      ) : (
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {data?.map((m) => (
            <Card key={m.id} className="flex gap-4">
              {m.photoUrl ? (
                <img
                  src={m.photoUrl}
                  alt={`Foto de ${m.name}, ${m.roleTitle}`}
                  width={64}
                  height={64}
                  loading="lazy"
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div
                  aria-hidden="true"
                  className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700 font-semibold dark:bg-brand-900/40 dark:text-brand-200"
                >
                  {initials(m.name)}
                </div>
              )}
              <div className="min-w-0">
                <h3 className="text-base font-semibold text-ink">{m.name}</h3>
                <p className="text-sm text-mute">{m.roleTitle}</p>
                {m.bio ? <p className="mt-2 text-sm text-mute">{m.bio}</p> : null}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
