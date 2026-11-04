import { Link } from 'react-router-dom';
import { Logo } from './Logo';

const col = 'text-small text-muted no-underline transition-colors hover:text-ink active:text-muted';

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="container-page grid gap-12 py-16 md:grid-cols-3">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-small text-muted">
            Núcleo de Apoio Psicopedagógico do Centro Universitário Impacta. Acolhimento, orientação e
            inclusão para a comunidade acadêmica.
          </p>
        </div>
        <nav aria-label="Rodapé">
          <p className="eyebrow mb-4">Navegação</p>
          <ul className="space-y-2">
            <li><Link to="/sobre" className={col}>Sobre</Link></li>
            <li><Link to="/servicos" className={col}>Serviços</Link></li>
            <li><Link to="/conteudos" className={col}>Orientações</Link></li>
            <li><Link to="/faq" className={col}>FAQ</Link></li>
            <li><Link to="/acessibilidade" className={col}>Acessibilidade</Link></li>
          </ul>
        </nav>
        <div>
          <p className="eyebrow mb-4">Contato</p>
          <ul className="space-y-2 text-small text-muted">
            <li>Centro Universitário Impacta — São Paulo/SP</li>
            <li><Link to="/contato" className="link">Fale conosco</Link></li>
            <li><Link to="/feedback" className="link">Deixe um feedback</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="container-page py-6 text-small text-muted">
          &copy; {new Date().getFullYear()} NAP Impacta · Projeto de extensão
        </p>
      </div>
    </footer>
  );
}
