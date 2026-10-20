export function Spinner({ label = 'Carregando' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-10 text-mute" role="status">
      <span
        aria-hidden="true"
        className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-current border-r-transparent"
      />
      <span className="sr-only">{label}</span>
      <span aria-hidden="true" className="text-sm">
        {label}…
      </span>
    </div>
  );
}
