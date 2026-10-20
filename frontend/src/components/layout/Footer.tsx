import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-surface-2">
      <div className="container-page py-10 grid gap-8 md:grid-cols-3">
        <div>
          <p className="font-semibold text-ink mb-2">NAP Impacta</p>
          <p className="text-sm text-mute">
            Núcleo de Apoio Psicopedagógico do Centro Universitário Impacta. Acolhimento,
            orientação e inclusão para a comunidade acadêmica.
          </p>
        </div>
        <div>
          <p className="font-semibold text-ink mb-2">Navegação</p>
          <ul className="space-y-1.5 text-sm">
            <li><Link to="/sobre" className="text-mute hover:text-accent no-underline">Sobre</Link></li>
            <li><Link to="/servicos" className="text-mute hover:text-accent no-underline">Serviços</Link></li>
            <li><Link to="/conteudos" className="text-mute hover:text-accent no-underline">Orientações</Link></li>
            <li><Link to="/faq" className="text-mute hover:text-accent no-underline">FAQ</Link></li>
            <li><Link to="/acessibilidade" className="text-mute hover:text-accent no-underline">Acessibilidade</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-ink mb-2">Contato</p>
          <ul className="space-y-1.5 text-sm text-mute">
            <li>Centro Universitário Impacta — São Paulo/SP</li>
            <li><Link to="/contato" className="text-accent no-underline">Fale conosco</Link></li>
            <li><Link to="/feedback" className="text-accent no-underline">Deixe um feedback</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-mute">
        &copy; {new Date().getFullYear()} NAP Impacta · Projeto de extensão
      </div>
    </footer>
  );
}
