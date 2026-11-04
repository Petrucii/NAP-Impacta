import { useState } from 'react';
import { Star } from 'lucide-react';
import { Seo } from '@/lib/seo';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Input';
import { submitFeedback } from '@/features/contact/api';
import { extractApiError } from '@/lib/api';
import { cn } from '@/lib/cn';

export default function Feedback() {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) {
      setError('Selecione uma nota de 1 a 5.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await submitFeedback({
        rating,
        comment: comment.trim() || undefined,
        pageSlug: window.location.pathname,
      });
      setSent(true);
    } catch (err) {
      setError(extractApiError(err).message || 'Falha ao enviar.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="container-page section">
        <Seo title="Obrigado pelo feedback" />
        <PageHeader
          eyebrow="Feedback"
          title="Obrigado!"
          description="Seu feedback nos ajuda a melhorar o site do NAP."
        />
      </div>
    );
  }

  return (
    <div className="container-page section">
      <Seo title="Feedback sobre o site" />
      <PageHeader
        eyebrow="Feedback"
        title="Como foi sua experiência?"
        description="Avalie o site e, se quiser, deixe um comentário. Totalmente anônimo."
      />

      <form onSubmit={onSubmit} className="mt-12 max-w-prose space-y-6">
        <div>
          <span className="block text-small font-medium text-ink">Nota</span>
          <div className="mt-2 flex gap-2" role="radiogroup" aria-label="Nota de 1 a 5">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={rating === n}
                aria-label={`${n} estrela${n > 1 ? 's' : ''}`}
                onClick={() => setRating(n)}
                className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-ui border transition-colors',
                  rating >= n
                    ? 'border-ink bg-ink text-canvas'
                    : 'border-field text-muted hover:border-ink hover:text-ink active:bg-line',
                )}
              >
                <Star size={20} aria-hidden="true" fill={rating >= n ? 'currentColor' : 'none'} />
              </button>
            ))}
          </div>
        </div>

        <Textarea
          label="Comentário (opcional)"
          placeholder="O que funcionou bem ou o que podemos melhorar?"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={5}
        />

        {error ? (
          <p className="text-small text-danger" role="alert">
            {error}
          </p>
        ) : null}

        <Button type="submit" isLoading={loading}>
          Enviar feedback
        </Button>
      </form>
    </div>
  );
}
