import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Sparkles } from 'lucide-react';

import { Seo } from '@/lib/seo';
import { api } from '@/lib/api';
import type { HomeHighlights } from '@/types/api';
import { ServiceCard } from '@/components/content/ServiceCard';
import { PostCard } from '@/components/content/PostCard';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';

export default function Home() {
  const { data, isLoading } = useQuery({
    queryKey: ['home'],
    queryFn: async () => (await api.get<HomeHighlights>('/content/home-highlights')).data,
  });

  return (
    <>
      <Seo
        title="NAP Impacta — Núcleo de Apoio Psicopedagógico"
        description="Acolhimento, orientação e inclusão para estudantes do Centro Universitário Impacta."
      />

      {/* HERO */}
      <section className="bg-gradient-to-b from-brand-50 to-surface dark:from-brand-900/20">
        <div className="container-page py-16 md:py-24">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-surface px-3 py-1 text-xs font-medium text-brand-700 dark:border-brand-800 dark:text-brand-200">
              <Sparkles size={14} aria-hidden="true" /> Projeto de extensão · Impacta
            </span>
            <h1 className="mt-5 text-ink">
              Um espaço de acolhimento e orientação para a sua trajetória acadêmica.
            </h1>
            <p className="mt-4 text-lg text-mute leading-relaxed">
              O Núcleo de Apoio Psicopedagógico (NAP) oferece escuta, orientação e
              acessibilidade para toda a comunidade do Centro Universitário Impacta.
              Atendimento gratuito e sigiloso.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/contato">
                <Button size="lg">Agendar atendimento</Button>
              </Link>
              <Link to="/servicos">
                <Button size="lg" variant="secondary">
                  Ver serviços
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* BANNER */}
      {data?.bannerText ? (
        <section className="border-y border-border bg-surface-2">
          <div className="container-page py-4 text-sm text-ink">
            <strong className="mr-2">Aviso:</strong>
            {data.bannerText}
          </div>
        </section>
      ) : null}

      {/* SERVIÇOS */}
      <section className="container-page py-16">
        <div className="mb-8 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-ink">O que fazemos</h2>
            <p className="mt-2 text-mute">
              Áreas de apoio disponíveis para toda a comunidade acadêmica.
            </p>
          </div>
          <Link
            to="/servicos"
            className="inline-flex items-center gap-1 text-sm font-medium text-accent no-underline"
          >
            Todos os serviços <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
        {isLoading ? (
          <Spinner />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {data?.featuredServices.map((s) => <ServiceCard key={s.id} service={s} />)}
          </div>
        )}
      </section>

      {/* ORIENTAÇÕES */}
      {data && data.recentPosts.length > 0 ? (
        <section className="bg-surface-2 border-t border-border">
          <div className="container-page py-16">
            <div className="mb-8 flex items-end justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-ink">Últimas orientações</h2>
                <p className="mt-2 text-mute">
                  Conteúdos educativos e dicas práticas.
                </p>
              </div>
              <Link
                to="/conteudos"
                className="inline-flex items-center gap-1 text-sm font-medium text-accent no-underline"
              >
                Ver todos <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {data.recentPosts.map((p) => <PostCard key={p.id} post={p} />)}
            </div>
          </div>
        </section>
      ) : null}

      {/* CTA */}
      <section className="container-page py-16">
        <div className="rounded-card border border-border bg-brand-50 dark:bg-brand-900/30 p-8 md:p-12 text-center">
          <h2 className="text-ink">Precisa conversar com o NAP?</h2>
          <p className="mt-3 text-mute max-w-xl mx-auto">
            O primeiro passo é uma escuta inicial. Preencha o formulário e nossa equipe
            responde em até 2 dias úteis.
          </p>
          <div className="mt-6">
            <Link to="/contato">
              <Button size="lg">Fale conosco</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
