import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';

import { Seo } from '@/lib/seo';
import { listFaq } from '@/features/faq/api';
import { DataState } from '@/components/ui/State';
import { Input } from '@/components/ui/Input';
import { Markdown } from '@/components/ui/Markdown';
import { PageHeader } from '@/components/layout/PageHeader';

const CATEGORY_LABEL: Record<string, string> = {
  geral: 'Geral',
  atendimento: 'Atendimento',
  servicos: 'Serviços',
};

export default function Faq() {
  const { data, isLoading, isError, refetch } = useQuery({ queryKey: ['faq'], queryFn: listFaq });
  const [q, setQ] = useState('');

  const grouped = useMemo(() => {
    if (!data) return {};
    const query = q.trim().toLowerCase();
    const filtered = query
      ? data.filter(
          (f) => f.question.toLowerCase().includes(query) || f.answerMd.toLowerCase().includes(query),
        )
      : data;
    return filtered.reduce<Record<string, typeof data>>((acc, item) => {
      (acc[item.category] ||= []).push(item);
      return acc;
    }, {});
  }, [data, q]);

  const noResults = Object.keys(grouped).length === 0;

  return (
    <div className="container-page section">
      <Seo
        title="Perguntas frequentes"
        description="Dúvidas comuns sobre o Núcleo de Apoio Psicopedagógico — NAP Impacta."
      />
      <PageHeader
        eyebrow="FAQ"
        title="Perguntas frequentes"
        description="Dúvidas mais comuns sobre o atendimento e os serviços."
      />

      <div className="mt-12 max-w-prose space-y-12">
        <Input
          label="Buscar"
          type="search"
          placeholder="Digite palavras-chave…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <DataState
          isLoading={isLoading}
          isError={isError}
          isEmpty={noResults}
          onRetry={() => refetch()}
          skeletonCount={2}
          empty={{
            title: q ? `Nenhum resultado para “${q}”` : 'Nenhuma pergunta cadastrada',
            description: q ? 'Tente outras palavras ou fale direto com a equipe.' : undefined,
          }}
        >
          <div className="space-y-12">
            {Object.entries(grouped).map(([cat, items]) => (
              <section key={cat}>
                <h2 className="eyebrow mb-4">{CATEGORY_LABEL[cat] ?? cat}</h2>
                <div className="divide-y divide-line rounded-ui border border-line bg-surface">
                  {items.map((item) => (
                    <details key={item.id} className="group">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 font-medium text-ink transition-colors hover:bg-canvas">
                        <span>{item.question}</span>
                        <ChevronDown
                          size={16}
                          aria-hidden="true"
                          className="shrink-0 text-muted transition-transform group-open:rotate-180"
                        />
                      </summary>
                      <div className="px-4 pb-4">
                        <Markdown>{item.answerMd}</Markdown>
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </DataState>
      </div>
    </div>
  );
}
