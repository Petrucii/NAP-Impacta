import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Briefcase, FileText, MessageSquare, Eye } from 'lucide-react';

import { api } from '@/lib/api';
import type { AdminSummary } from '@/types/api';
import { Seo } from '@/lib/seo';
import { DataState } from '@/components/ui/State';
import { cardLinkClass, Card } from '@/components/ui/Card';

export default function AdminDashboard() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin', 'summary'],
    queryFn: async () => (await api.get<AdminSummary>('/admin/summary')).data,
  });

  const items = data
    ? [
        { label: 'Serviços', value: data.totals.services, to: '/admin/servicos', Icon: Briefcase },
        { label: 'Conteúdos', value: data.totals.posts, to: '/admin/conteudos', Icon: FileText },
        { label: 'Mensagens não lidas', value: data.totals.messagesUnhandled, to: '/admin/mensagens', Icon: MessageSquare },
        { label: 'Views nos últimos 7 dias', value: data.totals.viewsLast7d, to: null, Icon: Eye },
      ]
    : [];

  return (
    <div>
      <Seo title="Admin — Dashboard" />
      <h1 className="text-title md:text-title">Dashboard</h1>
      <p className="mt-2 text-body text-muted">Panorama rápido do site e das demandas abertas.</p>

      <div className="mt-8">
        <DataState
          isLoading={isLoading}
          isError={isError}
          onRetry={() => refetch()}
          skeletonCount={4}
          empty={{ title: 'Sem dados' }}
        >
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {items.map((it) => {
              const body = (
                <>
                  <it.Icon size={20} aria-hidden="true" className="text-muted" />
                  <p className="mt-6 text-heading">{it.value}</p>
                  <p className="mt-1 text-small text-muted">{it.label}</p>
                </>
              );
              return it.to ? (
                <Link key={it.label} to={it.to} className={cardLinkClass}>{body}</Link>
              ) : (
                <Card key={it.label}>{body}</Card>
              );
            })}
          </div>
        </DataState>
      </div>
    </div>
  );
}
