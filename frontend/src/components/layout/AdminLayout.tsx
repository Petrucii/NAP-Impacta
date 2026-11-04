import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Briefcase, FileText, MessageSquare, LogOut } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { cn } from '@/lib/cn';
import { Logo } from './Logo';
import { Button } from '@/components/ui/Button';

const ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/servicos', label: 'Serviços', icon: Briefcase },
  { to: '/admin/conteudos', label: 'Conteúdos', icon: FileText },
  { to: '/admin/mensagens', label: 'Mensagens', icon: MessageSquare },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-line">
        <div className="container-page flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo />
            <span className="eyebrow hidden border-l border-line pl-4 sm:inline">Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-small text-muted sm:inline">{user?.email}</span>
            <Button variant="secondary" size="sm" onClick={logout}>
              <LogOut size={16} aria-hidden="true" />
              Sair
            </Button>
          </div>
        </div>
      </header>
      <div className="container-page grid gap-8 py-8 md:grid-cols-[208px_1fr]">
        <aside>
          <nav aria-label="Admin">
            <ul className="flex gap-1 overflow-x-auto md:flex-col">
              {ITEMS.map((it) => (
                <li key={it.to}>
                  <NavLink
                    to={it.to}
                    end={it.end}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 whitespace-nowrap rounded-ui border px-4 py-2 text-small no-underline transition-colors',
                        isActive
                          ? 'border-line bg-surface font-medium text-ink'
                          : 'border-transparent text-muted hover:bg-surface hover:text-ink active:bg-line',
                      )
                    }
                  >
                    <it.icon size={16} aria-hidden="true" />
                    {it.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
