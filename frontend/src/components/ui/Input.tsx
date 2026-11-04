import { forwardRef, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes, useId } from 'react';
import { cn } from '@/lib/cn';

type FieldWrapProps = {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  htmlFor: string;
  children: React.ReactNode;
};

export function Field({ label, hint, error, required, htmlFor, children }: FieldWrapProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="block text-small font-medium text-ink">
        {label}
        {required ? (
          <span className="text-muted" aria-hidden="true">
            {' '}
            *
          </span>
        ) : null}
      </label>
      {children}
      {hint && !error ? (
        <p id={`${htmlFor}-hint`} className="text-small text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${htmlFor}-err`} className="text-small text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

const control =
  'block w-full rounded-ui border bg-surface px-4 text-body text-ink transition-colors ' +
  'placeholder:text-muted hover:border-ink disabled:cursor-not-allowed disabled:opacity-50';

function describedBy(id: string, hint?: string, error?: string) {
  return [hint && !error ? `${id}-hint` : null, error ? `${id}-err` : null].filter(Boolean).join(' ') || undefined;
}

type CommonProps = { label: string; hint?: string; error?: string };

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & CommonProps>(
  function Input({ label, hint, error, id, required, className, ...rest }, ref) {
    const auto = useId();
    const inputId = id ?? auto;
    return (
      <Field label={label} hint={hint} error={error} required={required} htmlFor={inputId}>
        <input
          id={inputId}
          ref={ref}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(inputId, hint, error)}
          className={cn(control, 'h-12', error ? 'border-danger' : 'border-field', className)}
          {...rest}
        />
      </Field>
    );
  },
);

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & CommonProps>(
  function Textarea({ label, hint, error, id, required, className, rows = 5, ...rest }, ref) {
    const auto = useId();
    const inputId = id ?? auto;
    return (
      <Field label={label} hint={hint} error={error} required={required} htmlFor={inputId}>
        <textarea
          id={inputId}
          ref={ref}
          rows={rows}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(inputId, hint, error)}
          className={cn(control, 'resize-y py-3', error ? 'border-danger' : 'border-field', className)}
          {...rest}
        />
      </Field>
    );
  },
);

export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement> & CommonProps & { options: { value: string; label: string }[] }
>(function Select({ label, hint, error, id, required, options, className, ...rest }, ref) {
  const auto = useId();
  const inputId = id ?? auto;
  return (
    <Field label={label} hint={hint} error={error} required={required} htmlFor={inputId}>
      <select
        id={inputId}
        ref={ref}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(inputId, hint, error)}
        className={cn(control, 'h-12', error ? 'border-danger' : 'border-field', className)}
        {...rest}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
});
