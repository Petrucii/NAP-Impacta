import { Seo } from '@/lib/seo';
import { ButtonLink } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="container-page section">
      <Seo title="Página não encontrada" />
      <p className="eyebrow">Erro 404</p>
      <h1 className="mt-4 max-w-3xl">Página não encontrada</h1>
      <p className="mt-6 max-w-prose text-lead text-muted">
        O endereço acessado não existe ou foi movido.
      </p>
      <ButtonLink to="/" className="mt-12">Voltar ao início</ButtonLink>
    </div>
  );
}
