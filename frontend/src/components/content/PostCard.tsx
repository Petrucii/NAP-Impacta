import { Link } from 'react-router-dom';
import type { Post } from '@/types/api';
import { Badge } from '@/components/ui/Badge';
import { cardLinkClass } from '@/components/ui/Card';

export const CATEGORY_LABEL: Record<Post['category'], string> = {
  orientacao: 'Orientação',
  educativo: 'Educativo',
  aviso: 'Aviso',
};

export const CATEGORY_TONE: Record<Post['category'], 'accent' | 'neutral' | 'solid'> = {
  orientacao: 'accent',
  educativo: 'neutral',
  aviso: 'solid',
};

export function formatDate(iso: string | null, month: 'short' | 'long' = 'short') {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month, year: 'numeric' });
  } catch {
    return '';
  }
}

export function PostCard({ post }: { post: Post }) {
  return (
    <Link to={`/conteudos/${post.slug}`} className={cardLinkClass}>
      <div className="flex items-center justify-between gap-4">
        <Badge tone={CATEGORY_TONE[post.category]}>{CATEGORY_LABEL[post.category]}</Badge>
        {post.publishedAt ? (
          <time className="text-caption text-muted" dateTime={post.publishedAt}>
            {formatDate(post.publishedAt)}
          </time>
        ) : null}
      </div>
      <h3 className="mt-8 group-hover:underline group-hover:decoration-accent group-hover:decoration-2 group-hover:underline-offset-4">
        {post.title}
      </h3>
      <p className="mt-2 line-clamp-3 flex-1 text-small text-muted">{post.summary}</p>
    </Link>
  );
}
