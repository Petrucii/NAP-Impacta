import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Briefcase, FileText, MessageSquare, Eye } from 'lucide-react';

import { api } from '@/lib/api';
import type { AdminSummary } from '@/types/api';
import { Seo } from '@/lib/seo';
import { Spinner } from '@/components/ui/Spinner';
import { Card } from '@/components/ui/Card';

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'summary'],
    queryFn: async () => (await api.get<AdminSummary>('/admin/summary')).data,
  });

  if (isLoading || !data) {
    return <Spinner />;
  }

  const items = [
    { label: 'Serviços', value: data.totals.services, to: '/admin/servicos', Icon: Briefcase },
    { label: 'Conteúdos', value: data.totals.posts, to: '/admin/conteudos', Icon: FileText },
    {
      label: 'Mensagens não lidas',
      value: data.totals.messagesUnhandled,
      to: '/admin/mensagens',
      Icon: MessageSquare,
    },
    { label: 'Views últimos 7d', value: data.totals.viewsLast7d, to: null, Icon: Eye },
  ];

  return (
    <div>
      <Seo title="Admin — Dashboard" />
      <h1 className="text-ink">Dashboard</h1>
      <p className="mt-2 text-mute">Panorama rápido do site e das demandas abertas.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it) => {
          const inner = (
            <Card className="h-full">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-mute">{it.label}</p>
                  <p className="mt-2 text-3xl font-semibold text-ink">{it.value}</p>
                </div>
                <div className="inline-flex h-10 w-10 items-center justify-center rounded bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
                  <it.Icon size={18} aria-hidden="true" />
                </div>
              </div>
            </Card>
          );
          return it.to ? (
            <Link key={it.label} to={it.to} className="no-underline">
              {inner}
            </Link>
          ) : (
            <div key={it.label}>{inner}</div>
          );
        })}
      </div>
    </div>
  );
}
