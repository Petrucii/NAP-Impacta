import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Briefcase, FileText, MessageSquare, LogOut } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { cn } from '@/lib/cn';

const ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/servicos', label: 'Serviços', icon: Briefcase },
  { to: '/admin/conteudos', label: 'Conteúdos', icon: FileText },
  { to: '/admin/mensagens', label: 'Mensagens', icon: MessageSquare },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-surface-2">
      <header className="border-b border-border bg-surface">
        <div className="container-page flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-accent text-accent-ink text-sm font-bold">
              NAP
            </span>
            <span className="font-semibold">Admin NAP</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-mute hidden sm:inline">{user?.email}</span>
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-card border border-border px-3 py-1.5 text-sm hover:bg-surface-2"
            >
              <LogOut size={16} aria-hidden="true" />
              Sair
            </button>
          </div>
        </div>
      </header>
      <div className="container-page py-6 grid gap-6 md:grid-cols-[220px_1fr]">
        <aside>
          <nav aria-label="Admin">
            <ul className="space-y-1">
              {ITEMS.map((it) => (
                <li key={it.to}>
                  <NavLink
                    to={it.to}
                    end={it.end}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-2 rounded-card px-3 py-2 text-sm no-underline',
                        isActive
                          ? 'bg-brand-50 text-brand-700 font-semibold dark:bg-brand-900/40 dark:text-brand-200'
                          : 'text-ink hover:bg-surface',
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
