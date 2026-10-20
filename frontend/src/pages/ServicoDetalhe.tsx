import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, MessageCircle } from 'lucide-react';

import { useService } from '@/features/services/hooks';
import { Seo } from '@/lib/seo';
import { Markdown } from '@/components/ui/Markdown';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import NotFound from './NotFound';

export default function ServicoDetalhe() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, isError } = useService(slug);

  if (isLoading) return <Spinner />;
  if (isError || !data) return <NotFound />;

  return (
    <div className="container-page py-12 max-w-3xl">
      <Seo title={data.title} description={data.summary} />

      <nav aria-label="Breadcrumb" className="mb-6 text-sm">
        <ol className="flex items-center gap-2 text-mute">
          <li><Link to="/servicos" className="text-mute hover:text-accent no-underline inline-flex items-center gap-1">
            <ArrowLeft size={14} aria-hidden="true" /> Serviços
          </Link></li>
        </ol>
      </nav>

      <h1 className="text-ink">{data.title}</h1>
      <p className="mt-3 text-mute text-lg">{data.summary}</p>

      <article className="mt-8">
        <Markdown>{data.bodyMd || '_Em breve, mais detalhes sobre este serviço._'}</Markdown>
      </article>

      <div className="mt-10 rounded-card border border-border bg-surface-2 p-6">
        <h2 className="text-xl font-semibold text-ink">Como acessar</h2>
        <p className="mt-2 text-mute">
          Entre em contato pelo formulário informando o serviço de interesse.
          Nossa equipe retorna em até 2 dias úteis.
        </p>
        <div className="mt-4">
          <Link to={`/contato?topic=${encodeURIComponent(data.title)}`}>
            <Button>
              <MessageCircle size={16} aria-hidden="true" />
              Falar com o NAP sobre este serviço
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
