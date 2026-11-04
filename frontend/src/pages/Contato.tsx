import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { z } from 'zod';

import { Seo } from '@/lib/seo';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/layout/PageHeader';
import { submitContact, type ContactInput } from '@/features/contact/api';
import { extractApiError } from '@/lib/api';

const schema = z.object({
  name: z.string().min(1, 'Informe seu nome').max(120),
  email: z.string().email('E-mail inválido'),
  topic: z.string().min(1, 'Selecione um assunto'),
  message: z.string().min(10, 'Conte um pouco mais (mín. 10 caracteres)').max(4000),
  isAnonymous: z.boolean().optional(),
  website: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const TOPICS = [
  { value: '', label: '— selecione —' },
  { value: 'Agendar atendimento', label: 'Agendar atendimento' },
  { value: 'Dúvida sobre o NAP', label: 'Dúvida sobre o NAP' },
  { value: 'Acessibilidade', label: 'Acessibilidade' },
  { value: 'Apoio à aprendizagem', label: 'Apoio à aprendizagem' },
  { value: 'Orientação vocacional', label: 'Orientação vocacional' },
  { value: 'Outro', label: 'Outro' },
];

export default function Contato() {
  const [params] = useSearchParams();
  const presetTopic = params.get('topic') ?? '';
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      email: '',
      topic: TOPICS.find((t) => t.value === presetTopic)?.value || '',
      message: '',
      isAnonymous: false,
      website: '',
    },
  });

  const isAnon = watch('isAnonymous');

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      setServerError('Verifique os campos destacados.');
      return;
    }
    try {
      const payload: ContactInput = {
        name: parsed.data.name,
        email: parsed.data.email,
        topic: parsed.data.topic,
        message: parsed.data.message,
        isAnonymous: !!parsed.data.isAnonymous,
        website: parsed.data.website ?? '',
      };
      await submitContact(payload);
      setSent(true);
      reset();
    } catch (err) {
      const api = extractApiError(err);
      setServerError(
        api.code === 'rate_limited'
          ? 'Muitas tentativas. Aguarde um minuto e tente novamente.'
          : api.message || 'Não foi possível enviar. Tente novamente em instantes.',
      );
    }
  };

  if (sent) {
    return (
      <div className="container-page section">
        <Seo title="Mensagem enviada" />
        <PageHeader
          eyebrow="Contato"
          title="Mensagem recebida"
          description="Obrigado por entrar em contato. A equipe do NAP responde em até 2 dias úteis no e-mail informado."
        />
        <Button className="mt-12" variant="secondary" onClick={() => setSent(false)}>
          Enviar outra mensagem
        </Button>
      </div>
    );
  }

  return (
    <div className="container-page section">
      <Seo
        title="Contato"
        description="Formulário para falar com o Núcleo de Apoio Psicopedagógico — NAP Impacta."
      />
      <PageHeader
        eyebrow="Contato"
        title="Fale com o NAP"
        description="Preencha o formulário abaixo. Mensagens são tratadas com sigilo pela equipe."
      />

      <form className="mt-12 max-w-prose space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* honeypot — não visível, mas focável para teclado é mascarado por aria-hidden */}
        <div aria-hidden="true" className="absolute left-[-9999px] opacity-0">
          <label>
            Site (não preencha)
            <input tabIndex={-1} autoComplete="off" {...register('website')} />
          </label>
        </div>

        <Input
          label="Nome"
          required
          placeholder="Como quer ser chamado(a)"
          error={errors.name?.message}
          disabled={isAnon}
          {...register('name')}
        />

        <Input
          label="E-mail"
          type="email"
          required
          placeholder="voce@exemplo.com"
          hint="Necessário para que a gente possa te responder."
          error={errors.email?.message}
          {...register('email')}
        />

        <Select
          label="Assunto"
          required
          options={TOPICS}
          error={errors.topic?.message}
          {...register('topic')}
        />

        <Textarea
          label="Mensagem"
          required
          placeholder="Conte com suas palavras o que está acontecendo."
          rows={6}
          error={errors.message?.message}
          {...register('message')}
        />

        <label className="flex items-start gap-3 text-small text-ink">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 shrink-0 accent-[rgb(var(--ink))]"
            {...register('isAnonymous')}
          />
          <span>
            Enviar de forma anônima.{' '}
            <span className="text-muted">
              Seu nome não é registrado, mas ainda assim precisamos do seu e-mail para
              resposta.
            </span>
          </span>
        </label>

        {serverError ? (
          <p className="rounded-ui border border-danger p-4 text-small text-danger" role="alert">
            {serverError}
          </p>
        ) : null}

        <Button type="submit" isLoading={isSubmitting} size="lg">
          Enviar mensagem
        </Button>
      </form>
    </div>
  );
}
