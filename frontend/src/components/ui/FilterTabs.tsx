import { cn } from '@/lib/cn';

type Option<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  label: string;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
};

/** Filtro em abas (role=tablist), usado em Conteúdos e no admin. */
export function FilterTabs<T extends string>({ label, options, value, onChange }: Props<T>) {
  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label={label}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className={cn(
              'h-10 rounded-ui border px-4 text-small transition-colors',
              active
                ? 'border-ink bg-ink text-canvas'
                : 'border-field text-muted hover:border-ink hover:text-ink active:bg-line',
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
