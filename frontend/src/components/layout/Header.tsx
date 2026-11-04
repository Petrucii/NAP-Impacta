import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Logo } from './Logo';
import { ButtonLink } from '@/components/ui/Button';

const NAV = [
  { to: '/', label: 'Início' },
  { to: '/sobre', label: 'Sobre' },
  { to: '/servicos', label: 'Serviços' },
  { to: '/conteudos', label: 'Orientações' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contato', label: 'Contato' },
];

const linkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'py-2 text-small no-underline transition-colors',
    isActive
      ? 'font-medium text-ink underline decoration-accent decoration-2 underline-offset-8'
      : 'text-muted hover:text-ink active:text-muted',
  );

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-canvas">
      <div className="container-page flex h-16 items-center justify-between">
        <Logo />

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Principal">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.to === '/'} className={linkClass}>
              {n.label}
            </NavLink>
          ))}
          <ButtonLink to="/contato?topic=Agendar%20atendimento" size="sm">
            Agendar atendimento
          </ButtonLink>
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-ui border border-field text-ink transition-colors hover:border-ink hover:bg-surface active:bg-line lg:hidden"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
          aria-controls="menu-mobile"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
        </button>
      </div>

      {open ? (
        <nav id="menu-mobile" className="border-t border-line bg-canvas lg:hidden" aria-label="Principal (móvel)">
          <ul className="container-page space-y-1 py-4">
            {NAV.map((n) => (
              <li key={n.to}>
                <NavLink
                  to={n.to}
                  end={n.to === '/'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'block rounded-ui px-4 py-3 text-body no-underline transition-colors',
                      isActive ? 'bg-surface font-medium text-ink' : 'text-muted hover:bg-surface hover:text-ink',
                    )
                  }
                >
                  {n.label}
                </NavLink>
              </li>
            ))}
            <li className="pt-4">
              <ButtonLink
                to="/contato?topic=Agendar%20atendimento"
                className="w-full"
                onClick={() => setOpen(false)}
              >
                Agendar atendimento
              </ButtonLink>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
