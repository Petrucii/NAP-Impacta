import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

import { Seo } from '@/lib/seo';
import { listFaq } from '@/features/faq/api';
import { Spinner } from '@/components/ui/Spinner';
import { Input } from '@/components/ui/Input';
import { Markdown } from '@/components/ui/Markdown';

const CATEGORY_LABEL: Record<string, string> = {
  geral: 'Geral',
  atendimento: 'Atendimento',
  servicos: 'Serviços',
};

export default function Faq() {
  const { data, isLoading } = useQuery({
    queryKey: ['faq'],
    queryFn: listFaq,
  });

  const [q, setQ] = useState('');

  const grouped = useMemo(() => {
    if (!data) return {};
    const query = q.trim().toLowerCase();
    const filtered = query
      ? data.filter(
          (f) =>
            f.question.toLowerCase().includes(query) ||
            f.answerMd.toLowerCase().includes(query),
        )
      : data;
    return filtered.reduce<Record<string, typeof data>>((acc, item) => {
      (acc[item.category] ||= []).push(item);
      return acc;
    }, {});
  }, [data, q]);

  return (
    <div className="container-page py-12 max-w-3xl">
      <Seo
        title="Perguntas frequentes"
        description="Dúvidas comuns sobre o Núcleo de Apoio Psicopedagógico — NAP Impacta."
      />
      <h1>Perguntas frequentes</h1>
      <p className="mt-2 text-mute">Dúvidas mais comuns sobre o atendimento e os serviços.</p>

      <div className="mt-6">
        <Input
          label="Buscar"
          placeholder="Digite palavras-chave…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <div className="mt-8 space-y-10">
          {Object.entries(grouped).map(([cat, items]) => (
            <section key={cat}>
              <h2 className="text-lg font-semibold text-mute uppercase tracking-wide">
                {CATEGORY_LABEL[cat] ?? cat}
              </h2>
              <div className="mt-3 divide-y divide-border rounded-card border border-border bg-surface">
                {items.map((item) => (
                  <details key={item.id} className="group p-4">
                    <summary className="flex cursor-pointer items-center justify-between gap-4 text-ink font-medium">
                      <span>{item.question}</span>
                      <span className="text-mute transition group-open:rotate-180" aria-hidden="true">
                        ▾
                      </span>
                    </summary>
                    <div className="mt-3">
                      <Markdown>{item.answerMd}</Markdown>
                    </div>
                  </details>
                ))}
              </div>
            </section>
          ))}
          {Object.keys(grouped).length === 0 ? (
            <p className="text-mute">Nenhum resultado para "{q}".</p>
          ) : null}
        </div>
      )}
    </div>
  );
}
