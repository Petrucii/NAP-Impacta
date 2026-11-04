import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, MessageCircle } from 'lucide-react';

import { useService } from '@/features/services/hooks';
import { Seo } from '@/lib/seo';
import { Markdown } from '@/components/ui/Markdown';
import { SkeletonGrid } from '@/components/ui/State';
import { ButtonLink } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import NotFound from './NotFound';

export default function ServicoDetalhe() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, isError } = useService(slug);

  if (isLoading) return <div className="container-page section"><SkeletonGrid count={1} /></div>;
  if (isError || !data) return <NotFound />;

  return (
    <div className="container-page section">
      <Seo title={data.title} description={data.summary} />

      <Link to="/servicos" className="link mb-8 inline-flex items-center gap-1 text-small">
        <ArrowLeft size={16} aria-hidden="true" /> Serviços
      </Link>

      <div className="max-w-prose">
        <h1>{data.title}</h1>
        <p className="mt-6 text-lead text-muted">{data.summary}</p>

        <article className="mt-12">
          <Markdown>{data.bodyMd || '_Em breve, mais detalhes sobre este serviço._'}</Markdown>
        </article>

        <Card className="mt-12">
          <h2 className="text-lead font-semibold">Como acessar</h2>
          <p className="mt-2 text-body text-muted">
            Entre em contato pelo formulário informando o serviço de interesse. Nossa equipe retorna
            em até 2 dias úteis.
          </p>
          <ButtonLink to={`/contato?topic=${encodeURIComponent(data.title)}`} className="mt-6">
            <MessageCircle size={16} aria-hidden="true" />
            Falar com o NAP sobre este serviço
          </ButtonLink>
        </Card>
      </div>
    </div>
  );
}
