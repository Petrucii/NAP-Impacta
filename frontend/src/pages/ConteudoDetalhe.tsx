import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { usePost } from '@/features/posts/hooks';
import { Seo } from '@/lib/seo';
import { Markdown } from '@/components/ui/Markdown';
import { SkeletonGrid } from '@/components/ui/State';
import { Badge } from '@/components/ui/Badge';
import { CATEGORY_LABEL, CATEGORY_TONE, formatDate } from '@/components/content/PostCard';
import NotFound from './NotFound';

export default function ConteudoDetalhe() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, isError } = usePost(slug);

  if (isLoading) return <div className="container-page section"><SkeletonGrid count={1} /></div>;
  if (isError || !data) return <NotFound />;

  return (
    <article className="container-page section">
      <Seo title={data.title} description={data.summary} />

      <Link to="/conteudos" className="link mb-8 inline-flex items-center gap-1 text-small">
        <ArrowLeft size={16} aria-hidden="true" /> Orientações
      </Link>

      <div className="max-w-prose">
        <div className="mb-6 flex items-center gap-4">
          <Badge tone={CATEGORY_TONE[data.category]}>{CATEGORY_LABEL[data.category]}</Badge>
          {data.publishedAt ? (
            <time className="text-small text-muted" dateTime={data.publishedAt}>
              {formatDate(data.publishedAt, 'long')}
            </time>
          ) : null}
        </div>

        <h1>{data.title}</h1>
        <p className="mt-6 text-lead text-muted">{data.summary}</p>
        <p className="mt-4 text-small text-muted">Por {data.author}</p>

        <div className="mt-12 border-t border-line pt-12">
          <Markdown>{data.bodyMd}</Markdown>
        </div>
      </div>
    </article>
  );
}
