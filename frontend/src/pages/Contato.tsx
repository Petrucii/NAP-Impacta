import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { z } from 'zod';

import { Seo } from '@/lib/seo';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
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
      <div className="container-page py-16 max-w-2xl">
        <Seo title="Mensagem enviada" />
        <div className="rounded-card border border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-800 p-8 text-center">
          <CheckCircle2 className="mx-auto mb-3 text-emerald-600" size={40} aria-hidden="true" />
          <h1 className="text-ink">Mensagem recebida</h1>
          <p className="mt-3 text-mute">
            Obrigado por entrar em contato. A equipe do NAP responde em até 2 dias úteis
            no e-mail informado.
          </p>
          <div className="mt-6">
            <Button onClick={() => setSent(false)} variant="secondary">
              Enviar outra mensagem
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-12 max-w-2xl">
      <Seo
        title="Contato"
        description="Formulário para falar com o Núcleo de Apoio Psicopedagógico — NAP Impacta."
      />
      <h1>Fale com o NAP</h1>
      <p className="mt-2 text-mute">
        Preencha o formulário abaixo. Mensagens são tratadas com sigilo pela equipe.
      </p>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
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

        <label className="flex items-start gap-2 text-sm text-ink">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-border text-accent focus:ring-accent"
            {...register('isAnonymous')}
          />
          <span>
            Enviar de forma anônima.{' '}
            <span className="text-mute">
              Seu nome não é registrado, mas ainda assim precisamos do seu e-mail para
              resposta.
            </span>
          </span>
        </label>

        {serverError ? (
          <p className="rounded-card border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300" role="alert">
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
