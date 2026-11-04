import { useQuery } from '@tanstack/react-query';

import { Seo } from '@/lib/seo';
import { api } from '@/lib/api';
import type { HomeHighlights } from '@/types/api';
import { ServiceCard } from '@/components/content/ServiceCard';
import { PostCard } from '@/components/content/PostCard';
import { ButtonLink } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DataState } from '@/components/ui/State';
import { Section } from '@/components/layout/Section';

const COPY = {
  eyebrow: 'Projeto de extensão · Impacta',
  title: 'Um espaço de acolhimento e orientação para a sua trajetória acadêmica.',
  lead:
    'O Núcleo de Apoio Psicopedagógico oferece escuta, orientação e acessibilidade para toda a comunidade do Centro Universitário Impacta. Atendimento gratuito e sigiloso.',
  ctaPrimary: 'Agendar atendimento',
  ctaSecondary: 'Ver serviços',
  closingTitle: 'Precisa conversar com o NAP?',
  closingBody:
    'O primeiro passo é uma escuta inicial. Preencha o formulário e nossa equipe responde em até 2 dias úteis.',
} as const;

export default function Home() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['home'],
    queryFn: async () => (await api.get<HomeHighlights>('/content/home-highlights')).data,
  });

  return (
    <>
      <Seo
        title="NAP Impacta — Núcleo de Apoio Psicopedagógico"
        description="Acolhimento, orientação e inclusão para estudantes do Centro Universitário Impacta."
      />

      <section className="section">
        <div className="container-page">
          <Badge>{COPY.eyebrow}</Badge>
          <h1 className="mt-6 max-w-4xl">{COPY.title}</h1>
          <p className="mt-8 max-w-prose text-lead text-muted">{COPY.lead}</p>
          <div className="mt-12 flex flex-wrap gap-4">
            <ButtonLink to="/contato" size="lg">{COPY.ctaPrimary}</ButtonLink>
            <ButtonLink to="/servicos" size="lg" variant="secondary">{COPY.ctaSecondary}</ButtonLink>
          </div>
        </div>
      </section>

      {data?.bannerText ? (
        <aside className="border-y border-line bg-surface" aria-label="Aviso">
          <p className="container-page py-4 text-small text-ink">
            <strong className="mr-2 font-semibold">Aviso</strong>
            {data.bannerText}
          </p>
        </aside>
      ) : null}

      <Section
        title="O que fazemos"
        description="Áreas de apoio disponíveis para toda a comunidade acadêmica."
        to="/servicos"
        linkLabel="Todos os serviços"
        bordered
      >
        <DataState
          isLoading={isLoading}
          isError={isError}
          isEmpty={!data || data.featuredServices.length === 0}
          onRetry={() => refetch()}
          empty={{
            title: 'Serviços em atualização',
            description: 'Estamos preparando o catálogo. Enquanto isso, fale com a equipe pelo formulário.',
          }}
        >
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data?.featuredServices.map((s, i) => <ServiceCard key={s.id} service={s} index={i} />)}
          </div>
        </DataState>
      </Section>

      {data && data.recentPosts.length > 0 ? (
        <Section
          title="Últimas orientações"
          description="Conteúdos educativos e dicas práticas."
          to="/conteudos"
          linkLabel="Ver todos"
          bordered
        >
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.recentPosts.map((p) => <PostCard key={p.id} post={p} />)}
          </div>
        </Section>
      ) : null}

      <section className="section border-t border-line">
        <div className="container-page grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <h2>{COPY.closingTitle}</h2>
            <p className="mt-4 max-w-prose text-body text-muted">{COPY.closingBody}</p>
          </div>
          <ButtonLink to="/contato" size="lg">Fale conosco</ButtonLink>
        </div>
      </section>
    </>
  );
}
