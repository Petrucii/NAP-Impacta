import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { usePost } from '@/features/posts/hooks';
import { Seo } from '@/lib/seo';
import { Markdown } from '@/components/ui/Markdown';
import { Spinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/Badge';
import NotFound from './NotFound';

const LABEL = { orientacao: 'Orientação', educativo: 'Educativo', aviso: 'Aviso' } as const;
const TONE = { orientacao: 'brand', educativo: 'success', aviso: 'warn' } as const;

function fmt(iso: string | null) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

export default function ConteudoDetalhe() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, isError } = usePost(slug);

  if (isLoading) return <Spinner />;
  if (isError || !data) return <NotFound />;

  return (
    <article className="container-page py-12 max-w-3xl">
      <Seo title={data.title} description={data.summary} />

      <nav aria-label="Breadcrumb" className="mb-6 text-sm">
        <Link to="/conteudos" className="text-mute hover:text-accent no-underline inline-flex items-center gap-1">
          <ArrowLeft size={14} aria-hidden="true" /> Orientações
        </Link>
      </nav>

      <div className="flex items-center gap-3 mb-4">
        <Badge tone={TONE[data.category]}>{LABEL[data.category]}</Badge>
        {data.publishedAt ? (
          <time className="text-sm text-mute" dateTime={data.publishedAt}>
            {fmt(data.publishedAt)}
          </time>
        ) : null}
      </div>

      <h1 className="text-ink">{data.title}</h1>
      <p className="mt-3 text-mute text-lg">{data.summary}</p>
      <p className="mt-2 text-sm text-mute">Por {data.author}</p>

      <div className="mt-8">
        <Markdown>{data.bodyMd}</Markdown>
      </div>
    </article>
  );
}
