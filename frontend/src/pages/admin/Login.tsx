import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import { Seo } from '@/lib/seo';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/features/auth/AuthContext';

type FormData = { email: string; password: string };

export default function AdminLogin() {
  const { login, token, user } = useAuth();
  const nav = useNavigate();
  const location = useLocation() as { state?: { from?: { pathname: string } } };
  const from = location.state?.from?.pathname ?? '/admin';
  const [err, setErr] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ defaultValues: { email: '', password: '' } });

  if (token && user) {
    return <Navigate to={from} replace />;
  }

  const onSubmit = async (data: FormData) => {
    setErr(null);
    try {
      await login(data.email, data.password);
      nav(from, { replace: true });
    } catch (e) {
      const api = e as { message?: string };
      setErr(api.message || 'E-mail ou senha inválidos');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-2 p-4">
      <Seo title="Login admin" />
      <div className="w-full max-w-sm rounded-card border border-border bg-surface p-6 shadow-soft">
        <div className="mb-6 flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded bg-accent text-accent-ink font-bold">
            NAP
          </span>
          <div>
            <p className="font-semibold">Admin NAP</p>
            <p className="text-xs text-mute">Acesso restrito à equipe</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="E-mail"
            type="email"
            autoComplete="username"
            required
            error={errors.email && 'Informe um e-mail válido'}
            {...register('email', { required: true, pattern: /.+@.+\..+/ })}
          />
          <Input
            label="Senha"
            type="password"
            autoComplete="current-password"
            required
            error={errors.password && 'Informe sua senha'}
            {...register('password', { required: true })}
          />
          {err ? (
            <p className="text-sm text-red-600" role="alert">
              {err}
            </p>
          ) : null}
          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Entrar
          </Button>
        </form>
      </div>
    </div>
  );
}
