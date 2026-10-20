import { Link } from 'react-router-dom';
import { Seo } from '@/lib/seo';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="container-page py-24 max-w-xl text-center">
      <Seo title="Página não encontrada" />
      <p className="text-6xl font-bold text-accent">404</p>
      <h1 className="mt-4 text-ink">Página não encontrada</h1>
      <p className="mt-3 text-mute">
        O endereço acessado não existe ou foi movido.
      </p>
      <div className="mt-6">
        <Link to="/">
          <Button>Voltar ao início</Button>
        </Link>
      </div>
    </div>
  );
}
