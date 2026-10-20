import { NavLink, Link } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/cn';

const NAV = [
  { to: '/', label: 'Início' },
  { to: '/sobre', label: 'Sobre' },
  { to: '/servicos', label: 'Serviços' },
  { to: '/conteudos', label: 'Orientações' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contato', label: 'Contato' },
];

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold text-lg no-underline text-ink">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-accent text-accent-ink text-sm font-bold">
            NAP
          </span>
          <span>NAP Impacta</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6" aria-label="Principal">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === '/'}
              className={({ isActive }) =>
                cn(
                  'text-sm no-underline transition hover:text-accent',
                  isActive ? 'text-accent font-semibold' : 'text-ink',
                )
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-card border border-border"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
        </button>
      </div>

      {open ? (
        <nav
          className="md:hidden border-t border-border bg-surface"
          aria-label="Principal (móvel)"
        >
          <ul className="container-page py-3 space-y-1">
            {NAV.map((n) => (
              <li key={n.to}>
                <NavLink
                  to={n.to}
                  end={n.to === '/'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'block rounded px-3 py-2.5 text-sm no-underline',
                      isActive ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-ink hover:bg-surface-2',
                    )
                  }
                >
                  {n.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
