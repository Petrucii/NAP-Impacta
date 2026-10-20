import { useState } from 'react';
import { Star, CheckCircle2 } from 'lucide-react';
import { Seo } from '@/lib/seo';
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
      <div className="container-page py-16 max-w-2xl">
        <Seo title="Obrigado pelo feedback" />
        <div className="rounded-card border border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-800 p-8 text-center">
          <CheckCircle2 className="mx-auto mb-3 text-emerald-600" size={40} aria-hidden="true" />
          <h1 className="text-ink">Obrigado!</h1>
          <p className="mt-3 text-mute">Seu feedback nos ajuda a melhorar o site do NAP.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-12 max-w-xl">
      <Seo title="Feedback sobre o site" />
      <h1>Como foi sua experiência?</h1>
      <p className="mt-2 text-mute">
        Avalie o site e, se quiser, deixe um comentário. Totalmente anônimo.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-6">
        <div>
          <span className="text-sm font-medium text-ink">Nota</span>
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
                  'flex h-11 w-11 items-center justify-center rounded-card border transition',
                  rating >= n
                    ? 'border-amber-400 bg-amber-50 text-amber-500 dark:bg-amber-900/40'
                    : 'border-border text-mute hover:bg-surface-2',
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
          <p className="text-sm text-red-600" role="alert">
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
