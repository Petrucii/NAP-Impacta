import { Link } from 'react-router-dom';
import type { Post } from '@/types/api';
import { Badge } from '@/components/ui/Badge';

const CATEGORY_LABEL: Record<Post['category'], string> = {
  orientacao: 'Orientação',
  educativo: 'Educativo',
  aviso: 'Aviso',
};

const CATEGORY_TONE: Record<Post['category'], 'brand' | 'success' | 'warn'> = {
  orientacao: 'brand',
  educativo: 'success',
  aviso: 'warn',
};

function formatDate(iso: string | null) {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return '';
  }
}

export function PostCard({ post }: { post: Post }) {
  return (
    <Link
      to={`/conteudos/${post.slug}`}
      className="group block rounded-card border border-border bg-surface p-5 shadow-soft transition hover:border-accent hover:shadow-md no-underline"
    >
      <div className="mb-3 flex items-center gap-2">
        <Badge tone={CATEGORY_TONE[post.category]}>{CATEGORY_LABEL[post.category]}</Badge>
        {post.publishedAt ? (
          <time className="text-xs text-mute" dateTime={post.publishedAt}>
            {formatDate(post.publishedAt)}
          </time>
        ) : null}
      </div>
      <h3 className="text-lg font-semibold text-ink group-hover:text-accent transition">
        {post.title}
      </h3>
      <p className="mt-2 text-sm text-mute leading-relaxed line-clamp-3">{post.summary}</p>
    </Link>
  );
}
