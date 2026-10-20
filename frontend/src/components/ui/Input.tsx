import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, useId } from 'react';
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
  const describedBy = [hint ? `${htmlFor}-hint` : null, error ? `${htmlFor}-err` : null]
    .filter(Boolean)
    .join(' ');
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
        {label}
        {required ? <span className="text-red-600" aria-hidden="true"> *</span> : null}
      </label>
      <div
        data-described-by={describedBy || undefined}
      >
        {children}
      </div>
      {hint && !error ? (
        <p id={`${htmlFor}-hint`} className="text-xs text-mute">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${htmlFor}-err`} className="text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, id, required, className, ...rest },
  ref,
) {
  const auto = useId();
  const inputId = id ?? auto;
  return (
    <Field label={label} hint={hint} error={error} required={required} htmlFor={inputId}>
      <input
        id={inputId}
        ref={ref}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          [hint ? `${inputId}-hint` : null, error ? `${inputId}-err` : null]
            .filter(Boolean)
            .join(' ') || undefined
        }
        required={required}
        className={cn(
          'block w-full rounded-card border bg-surface px-3.5 py-2.5 text-ink',
          'placeholder:text-mute focus:outline-none focus:ring-2 focus:ring-accent',
          error ? 'border-red-500' : 'border-border',
          className,
        )}
        {...rest}
      />
    </Field>
  );
});

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  hint?: string;
  error?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, hint, error, id, required, className, rows = 5, ...rest },
  ref,
) {
  const auto = useId();
  const inputId = id ?? auto;
  return (
    <Field label={label} hint={hint} error={error} required={required} htmlFor={inputId}>
      <textarea
        id={inputId}
        ref={ref}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          [hint ? `${inputId}-hint` : null, error ? `${inputId}-err` : null]
            .filter(Boolean)
            .join(' ') || undefined
        }
        required={required}
        className={cn(
          'block w-full rounded-card border bg-surface px-3.5 py-2.5 text-ink',
          'placeholder:text-mute focus:outline-none focus:ring-2 focus:ring-accent resize-y',
          error ? 'border-red-500' : 'border-border',
          className,
        )}
        {...rest}
      />
    </Field>
  );
});

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  hint?: string;
  error?: string;
  options: { value: string; label: string }[];
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, hint, error, id, required, options, className, ...rest },
  ref,
) {
  const auto = useId();
  const inputId = id ?? auto;
  return (
    <Field label={label} hint={hint} error={error} required={required} htmlFor={inputId}>
      <select
        id={inputId}
        ref={ref}
        aria-invalid={error ? true : undefined}
        className={cn(
          'block w-full rounded-card border bg-surface px-3.5 py-2.5 text-ink',
          'focus:outline-none focus:ring-2 focus:ring-accent',
          error ? 'border-red-500' : 'border-border',
          className,
        )}
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
